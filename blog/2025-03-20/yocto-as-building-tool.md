---
slug: Why-I-use-Yocto-over-Buildroot
title: Why I use Yocto over Buildroot as building tool
authors: [jrmejiaa]
enableComments: true # for Gisqus
tags: [cross-compilation,yocto,linux]
---

Yet Another Opinion about Yocto vs Buildroot... If you ever come across to work with YANG, I hope you understand the reference. If you don't have a clue what I am talking about, don't worry, I have no clue of YANG and SNMP until a few months ago 😅. As you may get for the title, I will just write why I think Yocto and OpenEmbedded is the right tool for building your custom Linux Embedded systems, even for personal projects. Let's go into it 🤓

<!-- truncate -->

When you deep into building custom Linux systems, there is almost certain that you will get across the question: *Should I use Buildroot or Yocto-OE?*. You start digging into some forums and blogs like this one 😛 to see what other people with maybe more experience thinks of the topic. I certainly asked this same question during my training on Yocto to Luca Ceresoli, our very prepared trainer, which works as contributor to both projects.

He mentioned at that time something that surprise me. I commented that one of the reasons why I went to learn more in deep Yocto was because I saw a lot of job application in my field requiring to have some knowledge in the topic. I saw this as a sign that companies uses Yocto over Buildroot. I may fall into a confirmation bias, because he mentioned that on Bootlin, they advice Yocto and Buildroot projects almost equally and the reason why I may not see more mentions on Buildroot is because of his simplicity.

This is exactly the selling point of Buildroot. If you have ever compile a `C` code in your life, you will feel close at home with Buildroot. This tool uses a series of Makefiles to create the whole image of the product. This is really incredible because it makes a building custom linux OS more easy to grasp, it gives you the things that you may need and everything with a `.config`. Easy to understand and easy to modify.

Although I see a lot of value on simplify this process that could be really complicated, it does not give you a lot of room to play with. If you want to have different machines, you have to create a config for everyone of them, you cannot simply re-use things. You may not need to change the basic applications of your custom linux for all of it, so why don't we use the same? Because Buildroot creates an root filesystem as an image, you are unable to change or adapt the things, you have to modify the config, but they do not share configurations, even if you need the same thing. 

On the other hand, yocto sells itself as a distribution building tool. It creates a sort of complex binary package system to create an image. Everything in yocto starting from the kernel is a package and the final process is to bring all those packages together and create the final root filesystem that you want. As you can see, it looks more complex and you will have a steep learning curve to understand how yocto works. But now, you are working by packages, should that means that you could interchange packages from one machine to the other if they based on the same processor? Well that's exactly the advantage.

Yocto works with layers and every layer has a priority. I will not going into details here, but it allows us to create an abstraction between those layers. This is perfect for projects with a lot of teams because you can divide the different parts of the project. This abstraction plays an important role because you could even abstract the whole hardware from the software part. Yocto will re-use everything what it could use to create new machines. This is exactly what I felt is really valuable of Yocto.

I think the complexity of Yocto pays off. They successfully creates abstractions using their layer concept, therefore vendor chips companies have been working closely with Yocto developers to create their own layer that implements their chips. Every single one of the big manufacture companies has their own layer where they create the *machine* configuration that you need to run your custom Linux OS.

I think at the end the support of vendors and Open Source Foundation is what it plays a big role for me to choose Yocto. When you are developing Embedded systems you have to think what is going to be available for the next 10 or 15 years. Once you sell a piece of hardware, depending on the sector, they will not upgrade for a long time, but they will ask for security updates, new software features and a long etc. So from a product perspective, you have to be prepared.

Another reason why I choose Yocto over Buildroot is because of their documentation. Let's be honest, we all hate to write documentation, I do not know the first developer who tells me: *"The part that I love from coding is to write the documentation"*. No, it did not happen and if it happens, you may check if coding is really what you like 🫢. Joke asides, the documentation of Yocto is amazing, I really do not have another word for that. It is the open source project with the best documentation that I have ever used and I have been a Linux and open source enthusiast for more than 10 years. They even have a section called [What I wish to know before working with Yocto](https://docs.yoctoproject.org/what-i-wish-id-known.html) and it really helps 🤯. They have `poky` an example distribution just that you understand how to build up your project. The documentation of Yocto has been on my bookmarks for around two years and every time that I visited the website I just find it incredible useful.

And that's it, you will find in this website some tutorials about my findings developing with Yocto. Things that I found useful to know and I will try to make it as understandable as possible because I know how hard it could be. So let's keep in touch, go check the tutorials section, I hope you find it interesting.
