---
slug: Why-you-need-to-use-yocto-or-buildroot-in-Linux-embedded-development-ASAP
title: Why you need to use Yocto or Buildroot in Linux embedded development ASAP
authors: [jrmejiaa]
enableComments: true # for Gisqus
tags: [building-tools,cross-compilation,yocto,buildroot]
---

Building Linux systems is still tough, but Yocto and Buildroot simplify it a lot. In this blog, you will see the problems of building a Linux embedded device from scratch and why these tools changes the game for better.

<!-- truncate -->

When I was looking my first embedded development lecture at the university in Colombia, I remember the overwhelming amount of things that you have to take into consideration just to compile a small hello-world `C` code in a soft-core processor for the FPGA that we had. So many information, even when it is useful, is really complicated to grasp and it scares a lot of people (a lot of my colleagues gave up on the subject). I considered myself a fast learner and there were things in that class that I understood until I have a similar lecture on my master.

Nowadays there are closed and open solutions to solve this kind of problems. If you want to play with a SoC FPGA kit now, Xilinx explains really well what you have to do to have a soft-core. Even the TU Dresden and some other German universities (like mine) use an open-source solution made by TU Dresden called [SpartanMC project](https://spartanmc.de/?node=ec16&page=license&ln=en) to reduce the complexity of this type of knowledge and give you a simple ready-to-use processor with the one you can play with.

Building a Linux system for an embedded device is also really complex. You can try (I certainly want to try) to build a Linux system for a different architecture as x86 from scratch. You not only have to think how are you going to compile everything (it is a different architecture 🤯), but you also need to think in the bootloader, the Linux kernel (networking, filesystem, task/memory management, etc), the C library that you want to use (there is more than one 🤯x2) and then finally you are in userspace. I love diagrams and this one explains really well the point.

<img src="/img/linux-sys-arch.svg" alt="Linux System Architecture" style={{
    width: '30rem',
    display: 'block',
    margin: '0 auto',
    paddingBottom: '1.5rem',
}}/>

Now that we are on userspace, are you sure that make it easier? Being users of a SO and almost everything (I talk to you Linux Bluetooth) works out of the box, we tend to forget how complex userspace really is. How do you know the C library version you are using is compatible with the latest version of `tar`? Do you want to work with `systemd` or are you old fashion and want `init.d` files?

Are you still with me? Even if you are an experienced Linux user, this is a lot of information and you could make it wrong easily. It would not be your fault, also not Linus Torvalds' or open-source community's fault. Complex problems means complex solution, even when we tried our best to avoid it.

That's why a lot of good developers with good intentions had created different building tools that makes this process less painful. Please do not get me wrong, it is still complex and you have to understand what is the role of almost everything, but now, you don't have to do it everything from scratch every time. You can create configuration files to define your machines and the best part, the chip vendors supports this open-source projects because it really decreases the difficulty to create new embedded devices. You don't have to worry about mismatch on versioning tools, because this building tools will throw you an early error if the versions are not compatible.

Sound better right? As you may understand for the title, there are two main projects working on this topic, both of them open-source projects, but they work fairly different. [The Yocto Project](https://www.yoctoproject.org) which is founded directly by The Linux Foundation and [Buildroot](https://buildroot.org). You can find a lot (really a lot) discussions about why is one better over the other one. I will be giving my opinion is another blog too, but what you need to know now is that both tools solve **a lot** of problems:

* I want to support different devices with different hardware peripherals, but same kernel ☑️
* I don't care about kernel space or hardware, I want to focus on userspace ☑️
* My hardware design is really complex, I need to make a kernel almost from scratch, but then userspace is very basic ☑️
* I don't want to deal with bootloader, I just want that works for my device ☑️

As you see, I could give you a lot of examples why these tools solve a lot of problems. They allow you to go as customize as you want in certain area and leave the other ones as basic as possible to make you focus in what really matters for your development. You save a lot of time and money with it. I would not recommend nowadays to anyone a Linux embedded development from scratch, only for learning purposes.

Embedded development has come a long way. What used to be a mountain of complexity is now more like a manageable hill, thanks to both closed and open-source solutions. Sure, building a Linux system for an embedded device is still no walk in the park, but projects like Yocto and Buildroot have made it a lot more doable. These tools help streamline the process, ensure compatibility, and reduce errors, so you can focus more on creating cool stuff rather than fixing endless issues.
