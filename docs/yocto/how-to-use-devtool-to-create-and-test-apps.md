---
sidebar_position: 2
tags: [cross-compilation,yocto,fundamentals-devtool,user-space,linux]
---

# How to use devtool to create and test applications on Yocto

In this tutorial, you will learn the basics of `devtool` and how you can create a library and test the Unit test of your recipe by creating a `ptest` package for your library.

<!-- truncate -->

For this tutorial we will be working with the [`devtool-libmultiply`](https://github.com/jrmejiaa/devtool-libmultiply) repository that I created for this purpose.

## Create a new recipe using devtool

When you load a Yocto environment, you already have the devtool binary in the path. Now we can send the first command by adding a new recipe. You can use the [`devtool-libmultiply`](https://github.com/jrmejiaa/devtool-libmultiply) repository to play with it.  

```bash
devtool add -B main libmultiply https://github.com/jrmejiaa/devtool-libmultiply.git
```

If everything succeeded, you will have a recipe, a bbappend and the sourcetree of the project.

```bash
# On the BUILDDIR folder of Yocto
$ tree workspace/
wworkspace/
├── appends
│   └── libmultiply_git.bbappend
├── conf
│   └── layer.conf
├── README.md
├── recipes
│   └── libmultiply
│       └── libmultiply_git.bb
└── sources
    └── libmultiply
        ├── CMakeLists.txt
        ├── LICENSE
        ├── README.md
        ├── src
        │   ├── CMakeLists.txt
        │   └── multiply
        │       ├── CMakeLists.txt
        │       ├── include
        │       │   └── multiply
        │       │       └── multiply.hpp
        │       └── multiply.cpp
        └── test
            ├── CMakeLists.txt
            └── multiply_test.cpp
```

If you look into the bbappend, you will understand why you can access the source tree of the recipe. This bbappend contains the bbclass `externalsrc` that allows us to set the source tree to a different location than the default location defined by Yocto. Any changes that we make in the source tree, Yocto will see it and will compile again our application.

For the recipe, we can see that devtool tries to understand the code, it detects that we are using cmake as build tool and adds that bbclass to the recipe. Besides it, we can also see the bbclass `pkgconfig`, which means that `devtool` was also able to detect that we are using `pkgconfig` to determine the available libraries for our system.

By using Googletest as Unit-test framework, `devtool` was also smart enough to see that we require this as dependency. It creates a template to start and we may add the things that we need, like the LICENSE of the project or more information that `devtool` was not able to find.

Nevertheless, this is already a huge advantage over trying this manually.

:::info
The work of `devtool` is the foundation of a recipe, it will always be syntactically ready, but it may not be enough to compile sometimes.
:::

## Using devtool to build and finish a recipe

### Building the recipe

We can now use devtool status and see if devtool recognizes our recipe as part of the workspace. If you see the new recipe `libmultiply` as part of it, then we can try to build it. 

```bash
$ devtool build libmultiply
```

This process is similar to using bitbake `libmultiply` but it will only trigger certain tasks, not all of them as bitbake does. As you can see the build process works. If you go to the source tree of the recipe inside of the workspace, you will notice two symlinks: `oe-logs` and `oe-workdir`. These two are helpers that devtool creates, which allows us to more easily access these directories. We can then check the destination folder (do_install) using that link: 

```bash
$ tree workspace/sources/libmultiply/oe-workdir/image
workspace/sources/libmultiply/oe-workdir/image
└── usr
    └── lib
        └── libmultiply.a
```

Although we did not create a `do_install` task, the cmake bbclass creates one that uses cmake commands to install the files.

### Using devtool to finish a recipe and send it to a permanent location

When we are done with the recipe and do not want to make new changes, it makes sense to put in a real layer, where it can be uploaded to a repository. Devtool has the command finish for this purpose. It requires at least two parameters, the recipe name and the path of the layer. Before doing the changes, let’s do a dry-run to see what devtool will do:

```bash
$ devtool finish --dry-run libmultiply <path-of-a-layer>/
...
INFO: Updating SRCREV in recipe libmultiply_git.bb (dry-run)
INFO: Moving recipe file to <path-of-a-layer>/recipes-libmultiply/libmultiply (dry-run)
INFO: Resetting recipe (dry-run)
```

So as you see devtool will create a folder with the name recipes-libmultiply and put the recipe there. We don’t want that so let’s add the path to the layer where we want it.


```bash
$ devtool finish --dry-run libmultiply <path-of-a-layer>/recipes-devtools
...
INFO: Updating SRCREV in recipe libmultiply_git.bb (dry-run)
INFO: Moving recipe file to <path-of-a-layer>/recipes-devtools/libmultiply (dry-run)
INFO: Resetting recipe (dry-run)
```

As you can see, the subcommand finish of devtool is also able to understand that path and now it does put it where we want. We only need to remove the --dry-run flag and the recipe will be gone from the workspace and available in the layer that we choose.

## Shipping libmultiply package with unit-tests

As we saw in the previous step, the destination folder of our recipe only shows a `.a` extension file. This happens because our library is a static one, not a shared library. So basically our application will not create a binary that end up in the final machine. Whether you should use a static or a shared library in this case is out-of-scope and both solutions has their advantages. If we want to verify the behavior of our library, we can use the binary of the GoogleTest, but this was not shipped to the destination folder. Let’s check the build folder `${B}`. For that we use the command `bitbake-getvar` that allow us to check the value of any variable in bitbake context.

```bash
$ bitbake-getvar -r libmultiply B
```

This command shows us the build directory where all artifacts should be. Let’s see what we can find:

```bash
$ tree sources/multiply/oe-workdir/multiply-1.0+git -L 2
sources/multiply/oe-workdir/multiply-1.0+git
├── build.ninja
├── CMakeCache.txt
....
└── test
    ├── CMakeFiles
    ├── cmake_install.cmake
    ├── CTestTestfile.cmake
    └── multiply_test
```

As you can see the binary `multiply_test` was generated successfully, but it was not added in do_install. We can add this changing the CMakeLists.txt or by adding the file appending the do_install task.

```bash
do_install:append() {
    install -d ${D}/root
    install -m 755 ${B}/test/multiply_test ${D}/root
}
```

If we build the system again, it fails, because the `multiply_test` is part of the destination image, but no package includes it. This is a sanity check from Yocto that allow us to avoid any basic errors on development. Why didn’t I need to change the FILES variable before? Because the general bbclass of a recipe includes standard paths where files are normally located, but /root is not one of them. We can check that by using the following command: 

```bash
bitbake-getvar -r multiply FILES:multiply
```

As you can see the variable already includes the default paths! We do not have to take care of that, so we change it to a default path and try again:

```bash
do_install:append() {
    install -d ${D}${bindir}
    install -m 755 ${B}/test/multiply_test ${D}${bindir}
}
```

This time it builds and the basic package already includes the binary that we want!.

## Creating ptest package with unit-test of project

Although the last approach works perfect, this will mean that the default package will always have a *testing* binary that should only be shipped on testing images. What we can do in that case is creating a `ptest` package, which are explain on the Yocto documentation [Testing Packages With ptest](https://docs.yoctoproject.org/dev/test-manual/ptest.html#testing-packages-with-ptest). 

The whole idea is to have a package only for testing that we can later trigger by using the testing framework of Yocto. We then need to include the bbclass `ptest` and change where we send the unittest binaries. According to the documentation, we always need a basic `run-ptest` binary that will be triggered by the `ptest-runner` inside of the machine. That `run-ptest` could be anything, on a project I created a python script inside of the `run-ptest` because the whole testing framework of the company was made with python. So basically, you can be as simple or as complex as you want in that file.

For this particular case we have to create the `run-ptest` and to add our unittest binary to the `PTEST_PATH` defined on the bbclass. We have two options. Either creating those files on the repository or doing it inside of the recipe. I personally believe that all non-related source code files needs to be located in the layer instead of the repository and this is this approach.


```bash
do_install_ptest_base:prepend() {
    cat << EOF > ${WORKDIR}/run-ptest
#!/bin/sh

./multiply_test
EOF
}

do_install_ptest() {
    install -d ${D}/${PTEST_PATH}
    install -m 755 ${B}/test/multiply_test ${D}/${PTEST_PATH}
}
``` 

Now if we build again the tool you will see those files are part of the `PTEST_PATH` variable: 

```bash
$ tree workspace/sources/libmultiply/oe-workdir/image
workspace/sources/libmultiply/oe-workdir/image
└── usr
    └── lib
        ├── libmultiply
        │   └── ptest
        │       ├── multiply_test
        │       └── run-ptest
        └── libmultiply.a
```

### How to use the generated ptest package

On your testing image you add the package `libmultiply-ptest` and the `ptest-runner` if you don't have it already. Afterwards, you should be able to build an image with that specific ptest package that we need to run the unittest that we require to verify the behavior of our application.

For this particular case, because we do have an empty *installable* package being a static library, we require to add an extra setting to our recipe. 

```bash
RDEPENDS:${PN}-ptest += "${PN}"
```

By default the `ptest` bbclass put as `RDEPENDS` our own package (which makes total sense). However, in this case we got an error because our default package do not include anything to be installed. This is again a sanity check by the Yocto developers to avoid making 'dummy' mistakes.

Once you have an image and you run for example QEMU as we do for the tutorial [How to start with Yocto without hardware](#), you should be able to run the command. 

```bash
# inside of QEMU environment
root@qemu-coreos-arm64:~$ ptest-runner libmultiply
START: ptest-runner
2025-12-17T16:56
BEGIN: /usr/lib/libmultiply/ptest
[==========] Running 3 tests from 1 test suite.
[----------] Global test environment set-up.
[----------] 3 tests from MultiplyTests
[ RUN      ] MultiplyTests.TestIntegerOne_One
[       OK ] MultiplyTests.TestIntegerOne_One (0 ms)
[ RUN      ] MultiplyTests.TestIntegerZero_Zero
[       OK ] MultiplyTests.TestIntegerZero_Zero (0 ms)
[ RUN      ] MultiplyTests.TestIntegerZero_One
[       OK ] MultiplyTests.TestIntegerZero_One (0 ms)
[----------] 3 tests from MultiplyTests (1 ms total)

[----------] Global test environment tear-down
[==========] 3 tests from 1 test suite ran. (5 ms total)
[  PASSED  ] 3 tests.
DURATION: 0
END: /usr/lib/libmultiply/ptest
2025-12-17T16:56
STOP: ptest-runner
TOTAL: 1 FAIL: 0
```
