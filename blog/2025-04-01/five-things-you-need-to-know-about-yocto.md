---
slug: five-things-you-need-to-know-about-working-with-yocto
title: Five things you need to know about working with Yocto
authors: [jrmejiaa]
enableComments: true # for Gisqus
tags: [cross-compilation,yocto,linux]
image: ./cover.png
imageStyle: isometric
imageModel: Gemini Nano Banana Pro
imagePrompt: "Isometric flat-vector illustration, flat-shaded with crisp solid fills and bold clean silhouettes, modern editorial tech style. A minimalist microchip sits as an independent base platform on the ground plane; resting on top of it is a stack of flat rectangular blocks piled one on top of another like layers of a built system. Small flat fragment pieces float inward from the sides and converge to complete the single topmost block of the stack, snapping into place like assembling tiles. Blue-dominant palette derived from deep navy (#0b1120), blue (#3b82f6, #60a5fa) and pale blue (#dbeafe), with cyan (#06b6d4) as a minority accent (~10-25% of the frame) glowing on the converging fragments and chip contacts. Background is a soft deep-navy duotone gradient with generous negative space. Clear focal hierarchy centered on the block stack. Absolutely no text, no letters, no numbers, no words, no labels, no logos, no faces, no UI, no penguins. 16:9 aspect ratio."
---

When you started with Yocto for the first time. It could be overwhelm to not know what to expect. I remember when I started working with Yocto my first thought was: "This is very cool, but also extremely complex". I spent a good amount of time with my developer leader and myself until I grasp a good amount of knowledge about this tool. In this blog, I want to summarize five things that you need to know before working with Yocto.

<!-- truncate -->

## Makefile and Yocto

I think this help me a lot to understand what Yocto does and how: 

:::note[Core concept:]
Yocto is to a custom Linux distribution what Makefile is to a C/C++ executable.
:::

This for me is the golden concept to understand. With yocto you have syntax divide into different sub-topics that we are going to discuss later, but in general is a series of steps to build and create a custom Linux distribution to play on a Embedded device, exactly as Makefile is a series of task that could depend one of another that creates at the end an ELF file.

## Recipes and Bitbake

When you get the naming of Yocto, you start going into the direction of understand everything quicker. What is a recipe? is just a set of instructions to prepare a dish. A recipe in yocto is exactly that, it is a set of instructions, but instead of preparing a dish, we prepare **packages**. Bitbake is the tool that we used to *bake* the recipes, hence the name! 🍳

:::warning
A recipe produces **more than one package**. This is a normal misconception on how Yocto works.
:::

The recipe will create the main package named after the recipe name with all elements the application needs to work (configuration files, ELF file, systemd/SysV file, etc), but also creates dev or doc packages and this can be also added to the image if necessary. 

Dev packages for example are used when this particular recipe is require as dependency for another one. Imagine in this case a shared library. For that matter, the dev packages has all the include files `*.h/*.hpp` that are only needed it on build time. The main package in this case will have the `*.so` files that will be required while running the image.

## The layer model

One of the big advantages of working with Yocto and also the root of a lot of bugs on misuse are the layer concept. This concept was designed for collaboration and customization. A layer is nothing else as a container of recipes. The layer has to has an specific format to be recognize as layer for Bitbake engine, but in general is just a set of recipes.

### Why collaboration?

As industry standard for custom linux distribution, there are many companies working together to create those layers. A layer could be a core element of the project like `openembedded-core`, which contains all important metadata to make a minimal build. Or specific layers like `meta-virtualization` which is recipes to support building Xen, LVM associated packages.

All of the above-mentioned layers and way more are open-source license and you use it as a base to create your own custom distribution. If you don't need virtualization on your Embedded device, you just don't add it. There are many well-maintained layers on the community.

:::tip
If you maintain your custom distribution with an up-to-date yocto release, you leverage the maintenance burden on the community layers. So you are no longer in charged of updating every single piece of open-source software that you used, you update the yocto release and all the releases and tools that you used are automatically updated.
:::

### Why customization?

One of the design decisions on the layer model is that every layer has a priority. As you may anticipate, the lower priority layers are the community-layers that you are using and on top of it, your layers. In your layer you develop your own applications or you customize something from the community recipe of an open source project.

As an example, when I was working on a NTP server/client for our Embedded device, I decided to go with `chrony`. However, the default package configuration of `chrony` in the community layer was not enough for me, so I create an append of the recipe and change the package configuration.

Because of structure of layering includes our customize layer, the append recipe is merge with the original one and I got a package that has the configuration that I desired. This is why the customization is one of the biggest gains on working with Yocto. If in the future we need to add an extra configuration package to `chrony` or even de-feature a particular configuration, we can easily do it by changing the append recipe **without** ever changing the original community-layer recipe that we based upon.

:::danger
You should **never** change open-source layers, unless you are thinking of contributing to it. You must always create your own layers. Otherwise, you lose the possibility to upgrade easily.
:::

## The environment of Bitbake and gcc

For those who were already involved on cross-compilation before, it is easier to grasp the concept of the bitbake environment. We basically cannot use th compiler of our computer (normally a x86 architecture) to create ELF files for a Embedded device that are normally RISC architectures, like ARM processors.

For this particular reason the reality is that Yocto creates a environment where everything is set to build an image for that specific machine with an architecture type. The sourcing of the environment is essential, it is the first thing that you need to do to have all variables require by bitbake to work properly. 

Once you source the environment you get the `bitbake` command line and all their helpers (`devtool`, `oe-*`, etc). One of the first things that we will be building with Yocto is actually the right compiler depending on the `MACHINE` variable that you set. The community core layer already provides *machines* so that you could based upon them to create your own.

:::tip
The bitbake weak assignment variables cannot be changed from the command line as you would do with weak assignment variables on a Makefile. The only variable that allows is `MACHINE` (as far as I know), which is a very special type of variable. This is really useful so that you don't have to create different environment to build different machine type images.

For the rest of the variables you need to add it to `BB_ENV_PASSTHROUGH_ADDITIONS`. For more details look into the official documentation [here](https://docs.yoctoproject.org/bitbake/2.18/bitbake-user-manual/bitbake-user-manual-ref-variables.html#term-BB_ENV_PASSTHROUGH_ADDITIONS)

```bash
# QEMU ARM 64 bits machine
MACHINE=qemu-arm64 bitbake image-core
# Real custom hardware of ARM 64 bits machine
MACHINE=awesome-arm64 bitbake image-core
```
:::

## Final tips on Yocto

### Start your recipe image simple

The biggest advantage of creating your own custom GNU/Linux image is of course you control what goes inside and the size of it. Start as small as possible and add the things that you will actually need. Use the built-in variables to control the size of the rootfs as much as possible. 

As any other package made with Yocto, the final image is also a recipe. You basically starts with the following file:

```bash
# Build a simple, minimal root filesystem.
# This recipe is a simplified form of core-image-minimal.

SUMMARY = "A simple, minimal image"

inherit core-image

IMAGE_INSTALL = "packagegroup-core-boot dropbear"
```

Once you have this starting image you start adding what you actually need inside of it. This image uses `dropbear` for SSH because it is smaller than `openssh`, but this is also available in the community-layers.

### Use QEMU machine as much as possible

Everything what you can do in software without intervening in hardware is a gain. However, as always, there are trade-offs. I spent a hard-time trying to convince the Product Owner of the new product that I was developing that having a container-software testing for a particular part of our embedded project was causing more harm than good. But, don't get me wrong, test in software as much as possible and leave the hardware testing (more expensive, more time-consuming) for future stage of your project.

For that particular reason, QEMU machines for ARM 32 and 64 bits are available from the beginning in Yocto. You just need to start with the image recipe that I put you above and start building your project stone by stone.

Using QEMU brings another big win, which is the possibility to create a CI-CD pipeline on purely software elements to verify how well or bad behaves your system. This is a complex topic and I will maybe create a tutorial in the future for it.

### My Dos and Don'ts Lemmas

This is the list of things that I wish to know before going on a full-time job working with Yocto as building tool. This tips aims to reduce the burden of maintaining a Yocto project and making your life easier as developer and any newcomer to the project.

| **The Dos and Don'ts** | **Explanation** |
|---|:---:|
| Use `DEPENDS`, `RDEPENDS` to have the dependency graph in your favor | If you define the *dependencies* of your recipes correctly, you will have several advantages over a messy development. On one side,  the bitbake engine will build more things in parallel aka less time of building an image. On the other hand it is clear from the recipe itself what is needed it to build that specific piece of software. |
| Define in your image recipe **only** your  top-level applications | If you have a clear dependency graph. You should only include in the `IMAGE_INSTALL` variable the top-level applications, the dependency graph will  bring the rest of the things that are necessary to build that image  |
| Use `packagegroup` when possible | If you see two or more top-level applications that are related to each other, but they don't have any real dependency, the best option is to use a packagegroup recipe.  It is a very simple recipe that wraps top-level application into one place. This again helps you to organize your development better. This make it also easier to share between different image recipes, when you know that certain things goes together. |
| Use the established variables (ex. `SUMMARY`, `DESCRIPTION`) and comments (`#`) on recipes to document your recipes | The Yocto recipes should be the first location of your documentation. Having a basic, yet sufficient documentation to every recipe that you made is a huge gain. The newbies on a embedded project starts on the building tool. If the building tool, in our case Yocto recipes, are well documented, you don't need to go to source code to understand the overall structure of the project. The goal is that from the image recipe, I should get already a grasp of the most important components of the image and how they interact to each other |
| Use the packages of your recipe in your favor | By default, a recipe produces several packages, some of those packages are there to be used by you as you prefer. Take those into your advantage, if you follow the guideline principles of the packages, you can use the whole infrastructure of Yocto to test your application for example. This is the case of the `ptest` package for example. |
| Read documentation and understand your tool | Your first instinct may be to develop your own thing because it is faster, specially now with AI. But the reality is that the Yocto project is a very established and old open-source project. There are several things that has been already solved that you could leverage on. Just to give you an example the `ptest` package. If you want to test if your application is working as expected and you create a tool to verify it, you can use the ptest structure. If you follow it, you can use the testing framework of yocto to verify the correctness of your image. Don't need to reinvent the wheel, just adapt what you need to the requirements that `ptest` has and you are go to go. |
| Don't overengineer your layers | When I got my training on Yocto, the person in charge said *"You only need one custom layer"*. That sticks really hard in my brain because at now, the project that I worked has +30 layers... Yes, you hear me well. There is really not need of that many, even with the amount of people who works on the project, I really think we could reduce that number a lot. You should focus on a few, but really high-quality layers that bring everything what you need. |
| Use `bitbake-getvar` to expand variables | Understanding what exactly the bitbake engine is giving you a certain result is not always easy. The layer model that allows customization and collaboration, also creates some hidden concepts that could create bugs. Every time that I need to know exactly what the bitbake engine is saying, I use that tool. I knew the tool by pure luck, when I was attending the Yocto training. My colleagues were amazed of it, because the only alternative before was to print the whole bitbake environment |
| Create Architectural Decision Record (ADR)s for your Yocto structure and make everyone follow it | On the same training that I already mentioned, I got these amazing phrase *"Yocto is like CMake, it is very easy to do the wrong thing work"*. Yocto has many possibilities and several ways of doing exactly the same thing. That's why is so important that everyone follows the same principles. If there are established decisions on how to react on certain common scenarios, you will have a healthy project that could escalate quickly. If not, you will spend several hours (believe me...) refactoring the mess of other people that never wanted to learn how to use the tool. |

--- 

Okay this was longer that I expected to be honest, but I just wish to have such ideas before starting with Yocto. Starting on Embedded devices with Yocto as a building tool is a really cool experience and I wish this give you an idea why this tool may seem so complex at the beginning, but afterwards it will just make sense. Thank you for your time, if you want to add something, I would love to see you in the comments!
