---
sidebar_position: 3
tags: [cross-compilation,yocto,user-space,linux]
---

# Using pkgconfig for your custom-libraries

In the blog [Why you need to use pkgconfig for your own libraries](/blog/Why-you-need-to-use-pkgconfig-for-your-own-libs), we already discussed why using the `pkgconfig` is an amazing tool when using custom-shared libraries. It eases the way you deal with compiler and linker flags when using your custom-library. Here, you will learn exactly how to implement it. 

In a nutshell, the `pkgconfig` package will help you to define compiler and linker flags using a `pc` file that you will generate with your custom-library. This `pc` file needs to be located in a certain default location, where the `pkgconfig` will always look for the information. You can check the syntax of your file by using the binary `pkgconfg` to check and get the compiler or linker flags.

```bash
$ pkgconf -cflags foo-utils.pc
-I/usr/include/foo-utils 

$ pkgconf -libs foo-utils.pc
-lfoo-utils -levent -lzmq -lstdc++ -ldl -lrt 
```

As you see in the example above, this library uses several shared library internally. Imagine how cumbersome would be to add every flag in every application that you need it. Now with `pkgconfig` this process is way easier and easy to maintain too. Let's deep into it.

## Add `pc` file to your custom library source code

First of all, we need to have a `pc` file that is going to be used by `pkgconfig` to deliver to the build script (Makefile or CMake) the right flags. I personally used `cmake` for all my personal builds and `pkgconfig` is well integrated with CMake. However, the same process is also possible with Makefiles, you have just to be more careful and the process is not that straight forward as with CMake. 

### CMake build script

The amazing thing of this tool is that you only need a template to rule them all. This template will be the **same** for all your custom-libraries, you just have to adjust pass the CMake variables to it. 

```bash
prefix=@CMAKE_INSTALL_PREFIX@
exec_prefix=${prefix}
includedir=@CMAKE_INSTALL_PREFIX@/@INSTALL_HEADERS_DEST_BASE@
libdir=${exec_prefix}/lib

Name: @PROJECT_NAME@
Description: @PROJECT_DESCRIPTION@
Version: @PROJECT_VERSION@
Cflags: -I${includedir}
Libs: -L${libdir} -lfoo-utils -lzmq -lpthread -lsystemd -lfoo-common -lfoo-log
```

As you can see all of them are CMake variables. The best part is that using the `@` symbols, we can used the `configure_file` built-in function of CMake to pass all the variables automatically. What do you need to change in the template?

- The name of your **own** flag. As you can see in this case our own custom-library is `foo-utils`, so this is our first shared library parameter in the `Libs` variable of `pkgconfig`.
- The rest of compiler and linker flags (obviously).

The rest is made by CMake itself. Isn't it awesome? Let's go into the used of the `configure_file`: 

```bash
# Your main CMakeLists.txt file
configure_file(
    ${CMAKE_CURRENT_SOURCE_DIR}/pkgconfig/${PROJECT_NAME}.pc.in
    ${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}.pc
    @ONLY
)
install(
    FILES ${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}.pc
    DESTINATION /usr/share/pkgconfig
)
```

Once again, the CMake makes our life easier. Only adding the `@ONLY` statement, all the variables that we set as `@__@` are going to be replace and using the `install` function we will install the file under the position that `pkgconfig` will look for it.

### Makefile build script

To be honest, I rarely used `Makefile` these days. When your project starts building up, maintaining build script of Makefile is chaotic. You can say the same of CMake and you maybe also right, but I think it is still a better approach. However, if I have to handle a `pc` file in a Makefile project, I will not create a template file, but rather the already `pc` file, for our same case as before would be: 

```bash
prefix=/usr
exec_prefix=${prefix}
includedir=/usr/include
libdir=${exec_prefix}/lib

Name: foo-utils
Description: Awesome foo utils library
Version: 1.0.0
Cflags: -I${includedir}
Libs: -L${libdir} -lfoo-utils -lzmq -lpthread -lsystemd -lfoo-common -lfoo-log
```

As you can see, the disadvantage of using Makefile in this case is that you have to be careful of using the right prefix. This is mostly a non-brain issue, because we all used the default paths, right!? Well in my current job for some idiotic reason, they decided not to use it. Using `pkgconfig` in such cases is almost a must, because you also have to pass some compiler flags to the `rpath` in order to tell the binary where to look for the custom libraries, imagine doing everything by hand... What a nightmare.

## How to use the pkgconfig in my final application? 

Using the `pc` file in the final binary is also quite easy in CMake. You have to use built-in function to search for the `pkgconfig` and then use it in the compiler and linker flags.

```bash
# Your main CMakeLists.txt of the application
find_package(PkgConfig)
pkg_check_modules(FOO_UTILS REQUIRED IMPORTED_TARGET foo-utils>=1.0.0)

target_link_libraries(awesome-app PkgConfig::FOO_UTILS)
target_compile_options(awesome-app PRIVATE -Wall -Werror -fdiagnostics-color=always PkgConfig::FOO_UTILS)
```

In a Makefile file is more easy although less easy to follow if you don't understand the basics of `pkgconfig`: 

```bash
# In your main Makefile
FOO_UTILS_LFLAFS=$(shell pkg-config --libs foo-utils)
FOO_UTILS_CFLAGS=$(shell pkg-config --cflags foo-utils)
# Use flags while compiling application like for ex.
$(CC) -MMD -Wall $(LIBS) $(FOO_UTILS_LFLAFS) $(FOO_UTILS_CFLAGS) $^ -o awesome-app
```

I hope this tutorial was helpful and you see the benefit of using this approach in your own custom-libraries. While working with Yocto, I also found out that this was the best way of dealing with this kind of dependencies, at least that I could find out in the Internet wild. Do you know a better way to handle libraries? Let's discuss in the comments!
