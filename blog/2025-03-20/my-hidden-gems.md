---
slug: My-developer-setup-and-some-hidden-terminal-gems
title: My developer setup and some hidden terminal gems
authors: [jrmejiaa]
enableComments: true # for Gisqus
tags: [open-source,dev-setup,linux]
---

In this blog, I will discuss some of the amazing open-source tools that I used on my daily basis while developing Embedded systems on Linux. I will mention why I find it useful and how you can install it and test it by yourself.

<!-- truncate -->

## Faster editors over fancy IDEs

I know that this may be controversy, but I am not a fan of IDEs. I understand the value, I see some advantages but most of the time an Editor with some good capabilities works as good as a super powerful (and very expensive) IDE. For my personal projects and my work I used VS Code and NVIM. You may considered both normal editors but with the right amount of extensions/plugins, you will have the speed and performance of a text editor with some of the most important features of an IDE.

I considered myself as a primary developer on VS Code, but having a terminal text editor came with a lot of advantages and overall you could use it in almost everywhere. Besides, being a superset of `vi` is the best. I was in the past always a `nano` user, I find it more friendly. I think until this date, the most voted question of StackOverflow is how to exit `vi` 🤣. However, you cannot denied `vi` is **everywhere** and I love that, so I made the switch from Nano. I love how fast it is and how easily you could search for hundred of items without seeing any lag whatsoever.

### VSCode extensions

The VSCode extensions depends a lot what you developed and there are an enormous amount of blogs telling you the best extensions. I always said, you should use what it works better for you. Some of the less known extensions that I used are: 

- autoDocstring and Doxygen Documentation generator to create documentation with `sphinx` and `doxygen`
- Shellcheck to integrate the amazing terminal tool `shellcheck` for bash static analysis into VS Code
- Advance-new-file to create files and directories easily anywhere in the workspace
- Better Jinja and Better YAML Formatter when working with Jinja templates and YAML files

The rest of my extensions are really well-known and I don't see the value to put it all here. I have C/C++, Python, PHP, Javascript and Web-development extensions to make my life easier when dealing with the different parts of my projects.

### Kickstart.nvim

I was a happy `vim` user, I had a few plugins, a basic theme and I thought that was enough. Until I came across to a YouTube video that change everything, the first two minutes of that video are epic, I will not spoiled, you have to go to see by yourself: [The Only Video You Need to Get Started with Neovim](https://www.youtube.com/watch?v=m8C0Cq9Uv9o). Since then I am up-to-date to the last version of `nvim` and loving everything new what come with the change. The Kickstart.nvim is exactly that, a starting place to create your experience with `nvim`. I personally recommend to play with it, because the developers of the configuration file really put some effort to make `nvim` amazing from the beginning and explain everything really well.

### A Theme to rule them all

When I like something I keep using it until I find something better, I have used a lot of different themes for my NVIM and VS Code. However there was one for me that it is just perfect and that's **Tokyo Night**. This theme is well known when you search for themes, it is very popular and it exists in a range of different editors and IDEs and that's make it perfect for me, because there is a version for VSCode and NVIM. I came across with it and since then I never look back. I love how it looks. I forked the original extension in VSCode to make it more perfect for C++ and some changes for YANG. If you are interested, let me know 😎. 

I don't use icons on NVIM, I like to maintain it as clean as possible, but for VSCode I have tested a lot and I just love my last finding *Bearded Icons*. Sadly the project seems abandon because I made a PR and the creator has not responded, but for me, it is the best icon theme on VSCode.

## Terminal essentials

Most on my work is on terminal, the building process of Yocto projects is quite heavy, so I rely a lot on the building server of the company for the builds. That's why I have been searching for tools that make my life easier, I will explain briefly all of them and tell you why I used it.

### `zsh`

I have to say, I have not find any reason to use `bash` over `zsh` in your desktop, if you want to debate please leave a comment. But, there are so many advantages in `zsh` and a lot of people working to make it even better. My setup is easy: zsh with [Oh-My-Zsh](https://ohmyz.sh) as based and [PowerLevel10K](https://github.com/romkatv/powerlevel10k). The last one is sadly no longer actively maintained, but the customization is crazy and I love how my shell looks like. I even added it to the build server 😅

### `tmux`

If you work on terminal and you don't use `tmux`, you need to learn it ASAP. It is a life changer for me. If you learn the basic shortcuts of tmux, you will feel like having a mouse is optional. It is crazy how my productivity has changed since I started using tmux. I used tmux a long time ago, but it was in my last job where I took my time to customize it to my needs. I used [tpm](https://github.com/tmux-plugins/tpm) as tmux plugin manager and also recommend [`tmuxp`](https://tmuxp.git-pull.com/quickstart.html). The last one is a terminal tool that allow you to create complex tmux sessions saved on a YAML file. Pressing a command that generates automatically all my windows and panes, it is just amazing. The best part is that is able to detect if the project exists by their name in the tmux server.

## Terminal Gems

I came across another YouTube video looking for tools that you *need* in your setup. Most of the videos are always the same, they talked about the same tools that any developer have at least heard once. However, I saw this video [7 Amazing CLI Tools You Need To Try](https://www.youtube.com/watch?v=mmqDYw9C30I&t=551s) from Josean, and it was really the first time that almost all tools were new to me and **really** useful. He explained really well the setup in his [website](https://www.josean.com/posts/7-amazing-cli-tools), I will just mention why is that useful and let go check his tutorial.

### `bat`

This is an improvement over `cat`. It did not replace `cat` from my point of view, but when you want to see a file quickly but want a syntax highlight, `bat` is your friend. They even have a Tokyo Night theme 👀 

### `eza`

This is the same as `ls` but with icons and more useful colors. This is maybe the less useful *gem*, but I always like a better look 😅

### `zoxide`

This is an improvement of `cd`. I don't like the name and I am really used to use `cd`, so I make an alias in my `.zshrc`. The idea is that it remembers the paths that you were using and *jump* into the directory.

### `fd`

This is a better version of `find`. This tools allow different new features that are useful for the last and most cool of the *gems*. Something that I really like is that it can ignore the folders and files in your `.gitignore`. This is specially useful in my setup, where the whole build process of yocto is enormous and most of the time, I don't need to search there.

### `delta`

This tool is a pager used by `git` to display the `diff` in a project. Their setup is a little complicated but is well explained in the [README](#) of the project.

### `fzf`

This is basically a fuzzy finder for your terminal. The best parts is that all the above mentioned tools works together with this one to create really cool stuff. It changes for good how you look for things. My selling point for this one was the fuzzy search on processes, I was speechless. Basically you put in you terminal `kill **` and press <kbd>Tab</kbd> and you will went in fuzzy search mode for all processes in your computer 🤩. You can use it with a lot of useful tools like `cd` and `find`. It makes your search for files and directories way more easy and **fast**. I was really impressed that this cool interfaces do not came with a performance cost (at least noticeable). I am never coming back to the *old ways*. 

---

That's it, I hope you find this useful and try to use this new cool terminal tools that I found it improves my way of work. See you the next time 🤟
