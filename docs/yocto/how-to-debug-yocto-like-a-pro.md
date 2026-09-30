---
slug: how-to-debug-yocto-like-a-pro
enableComments: true
sidebar_position: 4
description: "Network errors, misordered inherits, and config overrides that silently fail — the debugging gotchas that cost hours, and how to work around them."
tags: [yocto,advance-yocto,linux]
---

# How to debug recipes in Yocto like a pro

In this tutorial I show you those tips that were really useful for me while dealing with problems in Yocto. You will find here all the different recurrent bugs that I have, and their solutions. You may have tried to use a similar approach or need to do something similar, I will explain you in detail the problems and possible fixes that I have gathered while working in Yocto.

## Toolkit for debugging issues in Yocto

### Use the dependency graph in your favor

I explain briefly on [Five things you need to know about working with Yocto](/blog/five-things-you-need-to-know-about-working-with-yocto) that you need to only put the top-level applications in your image recipe. The rest depends on the *dependency graph* bringing everything together. You can generate this graph by using a default command of the bitbake engine. 

```bash
bitbake -g <image-recipe-name>
```

This generates a `.dot` file with all the relationships between the recipes that you will have inside of an image created by that recipe.

> Why is important to have a clean dependency graph?

If you have any problems in the future because there are a package that is not present in your image and you wandering why. Instead of adding it to the image and *"fixing"* the problem, ask yourself. Which top-level application of my image require that recipe?

Once you start doing that, creating multiple products with same image different architecture, or same architecture but slightly different top-level applications became a walk in the park.

### `bitbake-getvar` and `oe-depends-dot`

The `bitbake-getvar` is maybe the most useful command for debugging the parsing of `bitbake` that exists. Before the introduction of this command, most people use `bitbake -e` to bring the whole environment of yocto into the standard output and look there for clues of what actually is happening. On the newer versions of Yocto, this is no longer the case. You can use `bitbake-getvar` to get any global or local variable information after parsing. This became extremely useful specially for newbies that are trying to understand who is Yocto parsing certain things and understand the powerful structure behind Yocto's bash and python parsing.

:::tip
One thing that I found really useful is that `bitbake-getvar` says exactly where the information is coming from. You can check by yourself in the file or change it as you need.
:::

```bash
bitbake-getvar DL_DIR
NOTE: Starting bitbake server...
#
# $DL_DIR [3 operations]
#   from env data.py:105 [inheritFromOS]
#     "/home/mejia/build/bb.downloads"
#   set /<yocto-path>/openembedded-core/meta/conf/documentation.conf:152
#     [doc] "The central download directory used by the build process to store downloads. 
#            By default, the directory is 'downloads' in the Build Directory."
#   set? /<yocto-path>/openembedded-core/meta/conf/bitbake.conf:843
#     "${TOPDIR}/downloads"
# pre-expansion value:
#   "/home/mejia/build/bb.downloads"
DL_DIR="/home/mejia/build/bb.downloads"
```

On the other hand, when we are not sure where something is coming from or what exactly is inside of an image and *why*, `oe-depends-dot` is the tool. This helps us to navigate into the `.dot` file of the dependencies. Other approaches would be really time-wasting (believe, I know) or just not as good. This tool helps in two things: Finding the key dependencies of a recipe and finding *why* is the recipe actually present in your image.

The last one is actually the one that I use most, because sometimes, depending on how big the project is, I don't know why exactly a certain package is present on the device.

```bash
oe-depends-dot -k libqmi -w -d task-depends.dot
Depends: python3-native glib-2 bash-completion ninja-native qemu-native dwarfsrcfiles-native 
         glibc patch-native gobject-introspection libmbim dpkg-native gobject-introspection-native 
         rpm-native libgudev pkgconfig-native pseudo-native quilt-native meson-native 
         gcc-cross-aarch64 gcc-runtime binutils-cross-aarch64
Because: image-core-dev modemmanager modem-manager-client packagegroup-apps
image-core-dev -> packagegroup-apps -> modem-manager-client -> modemmanager -> libqmi
```

## Common issues and possible fixes

### Downloading something from a task

I have personally seen this problems already three times. Some of my colleagues that do not have much experience with the tool, try to do things as they can. They see a bash script and think: *I can download anything from here, it is just a bash script*

Although this is most of the time true, Yocto has a very strict rule of forbidding any task to access the internet. It's basically a security concern and also a way to not depend on having network to do the heavy work. You can change this behavior by changing the default variable flags of a task in a recipe.

However, 99% of the time, if you are downloading something on a recipe different than `do_fetch`, you are doing something wrong. However, if you really really need that and you don't see any other way to solve your problem, do the following: 

```bash
# this activates the network on that specific task
do_awesome_task[network] = "1"
```

### Changing a global scope inside a recipe

I get into this issue a few months ago. I wanted to update a global variable depending on the information of the image recipe. I required the list of installed packages that has an specific feature. There were a management application that requires that information about the amount of top-level applications that were in the device. I thought I could create a packagegroup where I could wrap all the top-level applications and this package group updates the global variable with the amount of recipes in the `RDEPENDS` of the packagegroup.

This idea works locally, but as soon as I wanted to use the variable in the management application I went back to the default value of the global variable. I tried everything, until I found deep in the mailing list of yocto that this was wanted and there is no way to change the global scope from a recipe.

This actually makes total sense, my approach was just wrong. When you want to have inter-relations between recipes that goes outside of the code itself, you need two things: 

1. Establish a dependency in the right direction. 
2. Use the `TMPDIR` folder and save your information in a custom directory.

On the target recipe of the dependency made in point `(1)`, you use a custom task to take the information from the custom `TMPDIR` folder. Depending on where you need the information, you add this dependency to that task. If you don't know, but you need it *as soon as possible*. Add it to `do_fetch`

```bash
# Create dependency on the target recipe of the package group that 
# has all top-level apps
do_fetch[depends] = "packagegroup-awesome:do_register_apps"
```

:::note
Solving this issue show me an important limitation on `bitbake-getvar` that we should take always into consideration. There are variables that are fill it *after* parsing. In this case, I had a variable named `FOO_APPS` that **could be** empty if I tried to get information from it using `bitbake-getvar`. Why? Because the filling of that variable depends on the information from another recipe. 

On a clean build without ever *make* the task `packagegroup-awesome:do_register_apps`, the variable that takes the information from the `TMPDIR` will be empty.
:::

### Variable position matters for inherits

You should see the `inherit` operation of yocto as a include macro in C/C++ compiler. It is kind of a copy-paste of what the `.bbclass` shows. Normally, you should inherit the class and all that common behavior that you are expecting is there. However, if you want to change a weak assignment variable created in the bbclass, but you want to maintain that weak assignment, unless you add the variable **before** you inherit the class, the parsing of bitbake will take the value of the inherit class. This is not the case if you make a direct assignment, so it basically depends.

:::tip
I always check this kind of things with `bitbake-getvar`, because it uses the same engine to do the parsing. In the result you see exactly from where the value is coming from and which condition took precedence.
:::

## References

* [Bitbake Manual: Variable Flags](https://docs.yoctoproject.org/bitbake/2.18/bitbake-user-manual/bitbake-user-manual-metadata.html#variable-flags)

