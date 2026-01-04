---
slug: why-you-should-use-devtool-on-yocto
title: Why you should use devtool on Yocto
authors: [jrmejiaa]
enableComments: true # for Gisqus
tags: [cross-compilation,yocto,linux]
---

I am a little bit amazed that I have to write this article in my blog, but I started a new project a few months ago and I was speechless of how they worked on yocto. So here I will briefly explain why `devtool` exists and all the things that you could do with it.

<!-- truncate -->

When I started in this new project, the developers on the project desired to use a container 'solution' to *test and develop* their code, because "developing new application and testing it in Yocto was really difficult". I was triggered by this statement because it was completely false. Since the beginning Yocto offers `recipetool` and nowadays `devtool` to make the development of new applications easy to have a cross-compilation application that just works in the `MACHINE` that you set.

I remember when I made my training on Bootlin that the trainer said "Yocto is one of those tools that allow you do anything, even the wrong thing". At that time and I just laughed, but now I understand better what they meant. For all newbies in Yocto I **highly recommend** reading the documentation, because it is really well written and it explains a lot of the things that you could do with Yocto without reinventing the wheel.

One of those things is the creation of recipes based on git repositories 'automatically' and test your code. The Yocto developers created `devtool` a python script that allows us to use the bitbake context to create, modify, upgrade and deploy a specific recipe. This tool ease the development of new application on Yocto environments and present the opportunity to deploy your custom solution on a already-running machine.

The `--help` of the `devtool` already give us an idea what else can be do with the tool. As you can see, there are plenty options to choose. However, I personally thing the most valuable are: `add`, `modify`, `build` and `deploy-target`.

```
devtool --help
NOTE: Starting bitbake server...
usage: devtool [--basepath BASEPATH] [--bbpath BBPATH] 
       [-d] [-q] [--color COLOR] [-h] <subcommand> ...

OpenEmbedded development tool

options:
  --basepath BASEPATH   Base directory of SDK / build directory
  --bbpath BBPATH       Explicitly specify the BBPATH
  -d, --debug           Enable debug output
  -q, --quiet           Print only errors
  --color COLOR         Colorize output (where COLOR is auto, always, never)
  -h, --help            show this help message and exit

subcommands:
  Beginning work on a recipe:
    add                   Add a new recipe
    modify                Modify the source for an existing recipe
    upgrade               Upgrade an existing recipe
  Getting information:
    status                Show workspace status
    search                Search available recipes
    latest-version        Report the latest version of an existing recipe
    check-upgrade-status  Report upgradability for multiple (or all) recipes
  Working on a recipe in the workspace:
    build                 Build a recipe
    ide-sdk               Setup the SDK and configure the IDE
    rename                Rename a recipe file in the workspace
    edit-recipe           Edit a recipe file
    find-recipe           Find a recipe file
    configure-help        Get help on configure script options
    update-recipe         Apply changes from external source tree to recipe
    reset                 Remove a recipe from your workspace
    finish                Finish working on a recipe in your workspace
  Advanced:
    create-workspace      Set up workspace in an alternative location
    extract               Extract the source for an existing recipe
    sync                  Synchronize the source tree for an existing recipe
    export                Export workspace into a tar archive
    menuconfig            Alter build-time configuration for a recipe
    import                Import exported tar archive into workspace
Use devtool <subcommand> --help to get help on a specific command

```

In the blog [How to use devtool to create and test applications on Yocto](/docs/yocto/how-to-use-devtool-to-create-and-test-apps), I will explain the benefits of working directly with yocto for creating custom libraries and how you can test your code on the machine by using the approach used on the Yocto community to test their images. See you there 👋🏻
