---
sidebar_position: 2
tags: [yocto,fundamentals-devtool,qemu,linux]
---

# How to start with Yocto even without hardware

In this tutorial, I will show you a basic, yet pretty realistic setup on Yocto. This is a different approach than the one taken by the official documentation on [Yocto Project Quick Build](https://docs.yoctoproject.org/brief-yoctoprojectqs/index.html#yocto-project-quick-build). Using the Poky testing distribution is a very good starting point, but once you are looking for a *real* product. This should be your starting point.

<!-- truncate -->

The Poky distribution is used internally on the Yocto Project to test the different new development and improvements on the tool. It is meant to be used **only** in that way and once you are thinking to create a product with Yocto, you should create your own distro layer and have your custom code into your own. This is even recommended on [What I wish I’d known about Yocto Project](https://docs.yoctoproject.org/what-i-wish-id-known.html#what-i-wish-i-d-known-about-yocto-project), which I highly recommend to read.

## Download starting setup of bootlin

Due to the fact that you should create your own layers and have your own distro layer while working with Yocto, I recommend to use the [simplest-yocto-setup](https://github.com/bootlin/simplest-yocto-setup) as a starting point rather than the Poky distribution. The Poky distribution is meant for testing, so it has a lot of things that you don't normally have on a normal setup for your applications. That's why I liked the Bootlin's approach. They created a simplest layer possible that works with several hardware that you can find easily.

However, because it uses the `meta` layer on `openembedded-core` we can also use the machines created there. One of those machines are the QEMU ARM versions that we can used to emulate our architecture as much as possible. You have `qemuarm64` and `qemuarm`. You should use either of those depending on the ARM type that you are working on.

:::note
If you are interested on RISC-V architectures, there are also `qemuriscv32` and `qemuriscv64`
:::

## Setting up everything with kas

If you are a veteran on Yocto but you have never heard of `kas`, I would recommend you to give it a chance. Siemens saw a missing piece in the whole process of setting up Yocto projects and a lot of manual steps and decided to automate the process in a very simple, yet powerful way. Bootlin uses this to setup the whole process and you can easily understand the syntax by looking the `.config.yaml` file on the root folder's project. You need to install it once. At the end `kas` is another python package. 

```
$ pip install kas
```

After having the package installed and following all the dependencies that you need to install for Yocto, you can checkout all repositories:

```bash
# On the simplest-yocto-setup root folder
$ kas checkout
```

The bootlin setup do not create a build configuration file, but relies on the default given by Yocto project, which is not a bad choice either

```bash
# Initialize the build environment
$ . ./openembedded-core/oe-init-build-env
```

After this point you have already initialize the Yocto build environment and you can use `bitbake` commands. I personally add the "useful lines" commented on the `conf/local.conf` file that adds extra features to the image to make it easier to use.

```bash
EXTRA_IMAGE_FEATURES += "\
    empty-root-password \
    allow-empty-password \
    allow-root-login \
"
```

## Building an image for different MACHINES

When working with yocto `bitbake` uses its own environmental variables. This is a design decision of the project and makes that you are unable to change the environmental variables of Yocto by accident while changing your shell rc. There are some variables that allow to be bypassed from this design because are meant to be change often. This is way you can change the `MACHINE` of a build without having to change any configuration file under `conf` folder of the build directory. 

:::warning
By adding a different `MACHINE` during the execution you will change cross-compilation configuration. Yocto will try to re-use as much as possible, but we aware that changing machines could be mean starting from zero a build
:::

```bash
# Emulation of 32 bits ARM
$ MACHINE=qemuarm bitbake kiss-image

# Emulation of 64 bits ARM
$ MACHINE=qemuarm64 bitbake kiss-image

# By no using any MACHINE type, we used the default of conf/local.conf which is dogbonedark
$ bitbake kiss-image
```

## Using built-in Yocto scripts to run QEMU

Once you created an image with QEMU, you can use the built-in scripts of QEMU to start that emulation and play with your custom image.

```bash
$ MACHINE=qemuarm64 runqemu qemuarm64 nographic
```

```
runqemu - INFO - Running MACHINE=qemuarm64 bitbake -e  ...
runqemu - INFO - Continuing with the following parameters:
...
Configuring network interfaces... done.
Starting Dropbear SSH server: dropbear.
Starting syslogd/klogd: done

Keep-it-simple,stupid Linux 1.0 qemuarm64 /dev/ttyAMA0

qemuarm64 login:
```

---

And that's basically it, I hope you understand the basics of the process and you start your journey on Yocto with the right foot. See you in the next tutorial. If you have any questions, just let me know.
