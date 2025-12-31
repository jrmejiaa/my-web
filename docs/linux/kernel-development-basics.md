---
sidebar_position: 2
tags: [cross-compilation,driver,kernel-space,linux]
---

# Kernel Development Basics

In this tutorial, you will learn the basics of kernel and user space and how this two spaces communicates. We will implement a very basic character device driver and how to test it on your Linux machine.

<!-- truncate -->

## Kernel vs User space

The Linux architecture is divided into two key spaces: 

* **Kernel space**, which is responsible to communicate with the Hardware and basic core OS operations.
* **User space**, where all the applications are executed.

On Linux the **System Call Interface** enables the communication between the two spaces. 

<img src="/img/linux-arch.svg" alt="Linux Architecture" style={{
    display: 'block',
    margin: '0 auto',
    paddingBottom: '1.5rem',
}}/>

In order to boot properly your hardware, the kernel requires minimal drivers for the whole configuration (Ethernet, PCIe, etc). To achieve this, the kernel uses internal modules (or drivers) to communicate properly with the hardware. You can do this process by incorporating the code into the kernel source tree and compiling the again. 

However, there is a more easy way to work by working with Out-Of-Tree modules. As you may get from the name, you don't need to compile the kernel again and your module could be in a later stage integrate it. This process is known as **loading modules**. 

In the blog [Why you should developed out-of-tree kernel modules](#), I mentioned why the last option is the most optimal in several aspects, specially when you are not planing to make the module open source.

## Install your Linux kernel header

In this step you basically need the linux headers in order to compile a driver module. Most of the time this is straight-forward and you only need to compile or even run the package command from your distribution. However, if you are a little bit unlucky, the compilation will not work if you are working on cross-compilation. I myself dealt with this problem while I was working with the Ultra96-V2 board of Xilinx. At that time, the only way that I could generate the right modules that will compile in my x86 architecture computer was by compiling the whole kernel in the device itself. It takes ages, but at least I could resolve that issue and later use the headers to use cross-compilation without problem. 

```bash
# Inside of the git folder of your linux kernel repository
$ make INSTALL_MOD_PATH=/frodo modules_install
=> Install dir: /frodo/lib/modules/$(KERNELRELEASE)/kernel/
```

If you are working on a derived Debian distro, you can just install the headers of your current kernel by installing with: 

```bash
sudo apt-get install linux-headers-generic
```

## Creating a kernel module

The essential part of a kernel module for Linux is the `init_module` and `cleanup_module`. You can basically create a module just with this two important functions.

```c
/*
 * hello-1.c - The simplest kernel module.
 */
#include <linux/module.h> /* Needed by all modules */
#include <linux/printk.h> /* Needed for pr_info() */

int init_module(void)
{
    pr_info("Hello world 1.\n");

    /* A non 0 return means init_module failed; module can't be loaded. */
    return 0;
}

void cleanup_module(void)
{
    pr_info("Goodbye world 1.\n");
}

MODULE_LICENSE("GPL");
```

The `Makefile` for the creation of a kernel module is rather basic and is thanks to the makefile that already exists on the linux kernel to create modules. You only need to add the files that you required to the `obj-m` variable that at the end will take the object of the kernel module that you required.

```makefile
obj-m += hello-1.o

PWD := $(shell pwd)

ifeq ($(CONFIG_STATUS_CHECK_GCC),y)
CC=$(STATUS_CHECK_GCC)
ccflags-y += -fanalyzer
endif

all:
        $(MAKE) -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules

clean:
        $(MAKE) -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean
```

# References

On my journey to learn more about the linux kernel I started working on the book [Understanding Linux Kernel](https://www.cs.utexas.edu/~rossbach/cs380p/papers/ulk3.pdf) and I successfully finished the training on Bootlin [Linux kernel driver development](https://bootlin.com/training/kernel/).


:::info
If you want to check more of my basic kernel modules see my Github repo: \
[Linux kernel Playground](https://github.com/jrmejiaa/linux-kernel-playground)
:::

