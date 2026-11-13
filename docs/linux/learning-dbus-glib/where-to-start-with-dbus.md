---
enableComments: true
sidebar_position: 1
description: "Where to start when working for the first time with D-Bus"
tags: [glib,dbus,user-space,linux]
---

# Where to start when working with D-Bus

:::note[TL;TR prefer code]
Everything on Github repo: https://github.com/jrmejiaa/glib-dbus-playground
:::

I have been an user for more than 10 years already. I got my first Linux computer from my math teacher, who plant the bug (point intended) of programming in me. But D-Bus was always a gray area. I knew exists, but I heard always bad things about the protocol, being to complicated and outdated.

:::tip
Not be like me, D-Bus and the library Glib has improved a lot over the years and I found actually easy to create applications that communicates throughout the bus between them.
:::

## What D-Bus is?

D-Bus is an inter-process communication (IPC) system, close in certain aspects to a RPC protocol. Processes connect to a **bus** (a message router) and exchange messages, for example method calls, replies, and signals with other processes on the same bus.

There are two standard buses:

- **System bus**: one per machine, for system services (systemd, NetworkManager, ModemManager). Access is privileged and often gated by polkit.
- **Session bus**: one per login session, for the user's own applications (for example GNOME).

A process opens a **connection** to a bus. On connecting it is assigned a unique connection name like `:1.5` (the colon marks it unique and bus-assigned). But none works with the bus id, we normally identify a process by his *well-known name* on the bus.

## The addressing hierarchy

To call something, a client must name four things, from coarse to fine:

1. **Well-known name** — a reverse-DNS service identifier, e.g. `org.freedesktop.systemd1`. It is a stable alias for whichever connection currently owns it, so clients do not need to know the volatile `:1.5` name. One service owns one (or more) well-known names.
2. **Object path** — a filesystem-like path identifying one object exported by that service, e.g. `/org/freedesktop/systemd1`. A service can export many objects (systemd exports one per unit, e.g. `/org/freedesktop/systemd1/unit/poc_2ddummy_2eservice`).
3. **Interface** — a named contract grouping related methods, signals, and properties, e.g. `org.freedesktop.systemd1.Manager`. One object can implement several interfaces (its own, plus standard ones like `org.freedesktop.DBus.Properties`).
4. **Member** — the specific method, signal, or property name, e.g. `StartUnit`.

Read it as: *name → object → interface → member*. For example, call `StartUnit` on interface `org.freedesktop.systemd1.Manager` of object
`/org/freedesktop/systemd1` owned by `org.freedesktop.systemd1`.

<img src="/img/dbus-concepts.svg" alt="D-Bus Concepts" style={{
    display: 'block',
    margin: '0 auto',
    width: '50rem',
}}/>

## Members: methods, signals, properties

- **Method**: a request/response call. The client calls it and (usually) gets a reply or an error. The usual reply of a method can be made synchronous, blocking the main loop thread until completion, or asynchronous, going back to the main loop until operation fire the callback.

```
StartUnit(name, mode) -> job object path
```

- **Signal**: a one-way broadcast emitted by the service; clients that have a matching subscription receive it. No reply. Signals are how a service pushes events to clients.

```
JobRemoved(id, job, unit, result)
```

- **Property**: a named value on an interface, read/written through the standard `org.freedesktop.DBus.Properties` interface (`Get`/`Set`/`GetAll`), with changes announced via the `PropertiesChanged` signal. Example: the Unit interface's `ActiveState`. The properties can be read-only for the proxies. In that scenario (default one), the service is the only one in charge a property of their objects.

## Type signatures

Method and signal arguments are typed with a compact signature: `s` string, `u` uint32, `t` uint64, `o` object path, `b` boolean, `a` array, `(...)` struct. For instance `ListUnits` returns `a(ssssssouso)` — an array of 10-field structs.

:::warning[Important Limitation]
a signature describes the **wire type only**, never the **allowed values**. A `mode` argument of type `s` does not say which strings are legal (`replace`, `fail`, `isolate`, ...). Those value constraints are a documentation contract from the service, not something in the protocol itself.
:::

## Introspection

A D-Bus object can describe itself: calling the standard `org.freedesktop.DBus.Introspectable.Introspect` method returns an XML document
listing its interfaces, methods, signals, and properties. This is the machine-readable contract that tools and code generators consume. It contains types and member names, but — per the limitation above — not value constraints or whether signals require a subscription.

### XML the language of D-Bus API

I think according to the documentation, this is not the only way to express a D-Bus API, but you don't need anything else. The XML is the description of what an application in D-Bus can access to being a client (aka proxy) or a producer (aka service). This example was made by [Aleksander Morgado](https://aleksander.es/) on his presentation *"Introduction to D-Bus"*

```xml
<node name="/" xmlns:doc="http://www.freedesktop.org/dbus/1.0/doc.dtd">
    <interface name="es.aleksander.Alarm">
        <method name="Configure">
            <arg name="seconds" type="u" direction="in" />
        </method>
        <property name="Activated" type="b" access="read" />
        <signal name="Beeeeeeeeep" />
    </interface>
</node>
```

The same XML contract is used by the service and proxy. The tools that we are going to see in the next chapter uses this schema to generate the necessary pluming to communicate with the bus. Both object types uses the same interface, but the D-Bus and Glib will generate conflict if a proxy tries to use a function that is meant to be used from the service side.

## Questions when I started

> Why is the application that produces methods and fills properties called *service* and the consumer *proxy*? 

The only server on the bus is the Dbus server (also named broker), which is a daemon inside of the device that manages the whole bus and takes charge of dealing with all internal socket pluming. Meanwhile the producer are named *services* because is a program that provides objects, methods and signals on a bus that fulfill a **service** for other local application.

I think **proxy** is a little more straight forward because it follows the same structural pattern with the same name. This D-Bus object is a convenience that provides a local-stand representation of another process (the service) to communicate with the object remotely from the current application (the client).

> What is the basic tool to start with that is easy to use and allow me to check current D-Bus APIs?

I will be covering all tools on the next chapter, but I think the most useful and up-to-date is `D-Spy`. Most of the webpages that has information about D-Bus recommend `d-feet`, but this project is long time no supported. If you use GNOME, give it a try to `D-Spy`.

> There are to many libraries for D-Bus, what should I use?

We had this discussion internally in my team. The architect in charge took two weeks of checking what are the good things of every one of them. There are libraries completely written in C++ and others in plain C. After so much hesitation we went for `GLib` because it was the one used in ModemManager and we need to communicate with the high-level API of it. However, in retrospective, even though we don't have the advantage of working with standard library containers from C++, I think I still choose `Glib` for it. It is the library without a doubt with the best documentation out there and the project is maintained because it is the backbone of GNOME. So if you ask me now, go for `GLib` even on your C++ projects.

> I don't want to use C or C++ for prototyping, I need something to test fast

No problem, I will actually explain later in the series, you can use python to communicate with D-Bus. Maybe you cannot have already functions that connects you automatically to the service via the generator code from `Glib`, but it is way faster and the AI agents understands pretty well D-Bus in Python. I would give it a try for prototyping before going full-mode in your C/C++ or even Rust application.

## References

1. [My Glib playground on this journey](https://github.com/jrmejiaa/glib-dbus-playground)
2. [Introduction to D-Bus by Aleksander Morgado](https://aleksander.es/data/GNOMEASIA2014%20-%20Introduction%20to%20DBus.pdf)
3. [Official documentation of Glib](https://docs.gtk.org/glib/index.html)
