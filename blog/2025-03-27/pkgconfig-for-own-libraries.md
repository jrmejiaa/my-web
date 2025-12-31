---
slug: Why-you-need-to-use-pkgconfig-for-your-own-libs
title: Why you need to use pkgconfig for your own libraries
authors: [jrmejiaa]
enableComments: true # for Gisqus
tags: [cross-compilation,yocto,linux]
---

While working on various embedded projects, I often ran into the same issue with handling custom-developed libraries. Each `Makefile` or `CMakeLists.txt` manages the compiler and linker flags for these libraries individually. But what happens when you have ten applications using that library and you need to make a breaking change? You have to update the build script for all ten applications. As you can imagine, in large projects, this is a nightmare. In this blog, you will see a better way to handle this using `pkgconfig`.

<!-- truncate -->

:::info
If you are looking for the *how* and not the *why*, look my tutorial on: \
[How to use `pkgconfig` for your custom-libraries](/docs/linux/user-space/how-to-use-pkgconfig)
:::

Let's start with an example of a library `foo`. This library is a C++ code that wants to be used in several places. This will not only handle internal process communication throughout `zmq`, but also it used a custom-logging library `foo-log` and another common library called `foo-common`. This maybe a huge library, but it is perfect as an example. If we make a search in the ELF file, we find out what we talked about, we have some standard library dependencies (not an issue) and our custom libraries.

```
readelf -d libfoo.so | grep NEEDED
 0x0000000000000001 (NEEDED)      Shared library: [libzmq.so.5]
 0x0000000000000001 (NEEDED)      Shared library: [libsystemd.so.0]
 0x0000000000000001 (NEEDED)      Shared library: [libfoo-common.so.1]
 0x0000000000000001 (NEEDED)      Shared library: [libfoo-log.so.1]
 0x0000000000000001 (NEEDED)      Shared library: [libstdc++.so.6]
 0x0000000000000001 (NEEDED)      Shared library: [libgcc_s.so.1]
 0x0000000000000001 (NEEDED)      Shared library: [libc.so.6]
 0x0000000000000001 (NEEDED)      Shared library: [ld-linux-aarch64.so.1]
```

Now let's image that we have several C++ applications where we would use that library. This may not happen in several software projects, but in Embedded Development, you are very likely to use not only one binary that solves all, but rather several processes that are acting as daemon in user-space. In all my projects, there has been always at least a custom-library that looks like that. For our example, if we want to call the `foo` library, our `CMakeLists.txt` could look something like this:

```bash
add_executable(app-foo ${MY_SOURCES})
target_link_libraries(app-foo foo foo-common foo-log)
```

Since our custom `foo` library uses the other two libraries, every time that we want to create an application, we need to add those extra library flags. The problem arises when w upgrade the `foo` library. Maybe, we found out that we need to secure some user input and we require some encryption algorithms. So now the library requires also `libcrypto.so`. This will immediately breaks all build scripts. Our project will no longer build and we have to do maintaining work on those build scripts. To avoid this technical debt (at least one, right?), we use a very old but reliable tool `pkgconfig`.

The whole idea behind `pkgconfig` is that the maintainer of the library is in charged of updating the require compiler and linker flags to avoid this situation that I mentioned before. Using `pkgconfig` in this case, we now just ask for the package of the custom-library and it is the same library that tell us, which libraries we required to build our application without problem.

```bash
find_package(PkgConfig REQUIRED)
pkg_check_modules(FOO REQUIRED IMPORTED_TARGET foo>=1.0.0)

# same lines as before
add_executable(app-foo ${MY_SOURCES})
target_link_libraries(app-foo PkgConfig::FOO)
```

With this new approach we decrease substantially the technical debt of our build scripts. We no longer need to worry whether the shared library will add or remove compiler or linker flags because we handle everything inside of the `pkgconfig` file, which is part of the source code of the custom-library. Even if the library is install in a non-default path for a library, using the information in the `pkgconfig` file, our build script will able to give the right information to the compiler and the linker.

Now hat you understand why this is necessary, let's deep into the [implementation of a `pkgconfig` for your custom-library](/docs/linux/how-to-use-pkgconfig). See you there 👋🏻
