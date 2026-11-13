---
enableComments: true
sidebar_position: 2
description: "Tools that you can use to make your life easier with D-Bus APIs"
tags: [glib,dbus,user-space,linux]
---

# Tools that you need on your D-Bus journey

There are many tools with the ones we can take a look into how the services are made and what are currently listening to the `system` and `user` buses. If you like CLI tools you have `gdbus` and `busctl` to monitor and call methods on a D-Bus service. Otherwise you have `d-feet` and `D-Spy` that are visually tools that allow you to check the D-Bus easy to describe the members of the interface that you have available on every service. In this tutorial we will dive into the CLI tools that allow us to grasp more the concepts that we learn on [Where to start when working with D-Bus](./where-to-start-with-dbus.md)

## Exploring a live service

### Getting the D-Bus API via introspect

D-Bus has a default interface that all services must implement. Introspect is a feature that **must** have all services and creates automatically a dump of the object's interfaces and all their members (methods, signals and properties). We can use `gdbus` to generate this information. Add `--xml` to get the machine-readable form that feeds the code generator (explain below).

```bash
# Human-readable:
gdbus introspect --session --dest org.freedesktop.systemd1 \
    --object-path /org/freedesktop/systemd1

# XML (what you save to feed gdbus-codegen):
gdbus introspect --session --dest org.freedesktop.systemd1 \
    --object-path /org/freedesktop/systemd1 --xml > systemd-dbus.xml
```

Use `--system` instead of `--session` for the system bus.

### When you need a quick view of an object

`busctl` is systemd's D-Bus tool and is especially good at listing and reading  properties. It shows each property's type, current value, and whether it emits change signals (`emits-change`). This is an example on the `ModemManager` D-Bus interface on my Debian12 machine:

```bash
busctl --system introspect org.freedesktop.ModemManager1 \ 
    /org/freedesktop/ModemManager1

NAME                                TYPE      SIGNATURE  RESULT/VALUE  FLAGS
org.freedesktop.DBus.Introspectable interface -          -             -
.Introspect                         method    -          s             -
org.freedesktop.DBus.ObjectManager  interface -          -             -
.GetManagedObjects                  method    -          a{oa{sa{sv}}} -
.InterfacesAdded                    signal    oa{sa{sv}} -             -
.InterfacesRemoved                  signal    oas        -             -
org.freedesktop.DBus.Peer           interface -          -             -
.GetMachineId                       method    -          s             -
.Ping                               method    -          -             -
org.freedesktop.DBus.Properties     interface -          -             -
.Get                                method    ss         v             -
.GetAll                             method    s          a{sv}         -
.Set                                method    ssv        -             -
.PropertiesChanged                  signal    sa{sv}as   -             -
org.freedesktop.ModemManager1       interface -          -             -
.InhibitDevice                      method    sb         -             -
.ReportKernelEvent                  method    a{sv}      -             -
.ScanDevices                        method    -          -             -
.SetLogging                         method    s          -             -
.Version                            property  s          "1.20.4"      emits-change
```

### Calling a method by hand

Before going berserker mode on your first proxy application, you need to understand how the service actually communicates. You need to remember that D-Bus is a wiring protocol, you may have cases where the introspect is not enough to tell you how to use certain method. In this scenarios is better to call the method by hand, looking into what is possible, specially in those methods where the input is a string. You need to check the documentation for it and check what values actually supports the service. 

This is for example the case of `StartUnit` or `ReplaceUnit` in systemd. Both of them receives two strings: `name` and `mode`. The name is maybe clear for all, but what about *mode*? You can only check that information on the man page of systemd, because there is no way you get that information for the D-Bus introspect itself.

```bash
gdbus call --system --dest org.freedesktop.systemd1 \
    --object-path /org/freedesktop/systemd1 \
    --method org.freedesktop.systemd1.Manager.GetUnit "ModemManager.service"
(objectpath '/org/freedesktop/systemd1/unit/ModemManager_2eservice',)
```

### Watching signals and properties

This is maybe the most essential skill to have when creating a proxy of a service that generates a lot of things depending on runtime configurations. This is the case of `ModemManager`, which creates an object for every Modem that he could find during a exploration udev phase. You need to check how exactly a service is generating the objects and how you could have access to.

:::tip
If you have an object creating sub-objects, you should check if inherits the interface `org.freedesktop.Dbus.ObjectManager`, this is the only standard interface that is not mandatory. If the object has this interface, it is the interface used to create and managed the sub-tree objects.
:::

:::warning
A monitor puts the bus into an eavesdropping mode and may show signals a *normal* client would not receive without subscribing. Do not use "I saw it in the monitor" as proof that your client will receive it.
:::

```bash
# GLib monitor, scoped to one service:
gdbus monitor --session --dest org.freedesktop.systemd1

# Lower-level, sees all bus traffic:
dbus-monitor --session
```

## References

* [gdbus - Tool for working with D-Bus objects](https://www.manpagez.com/html/gio/gio-2.38.2/gdbus.php)
* [busctl - Introspect the D-bus](https://man7.org/linux/man-pages/man1/busctl.1.html)
* [D-Feet - an easy to use D-Bus debugger](https://wiki.gnome.org/Apps/DFeet)
* [D-Spy - simple tool to explore D-Bus connections](https://apps.gnome.org/Dspy/)
