---
sidebar_position: 4
tags: [yocto,advance-yocto,linux]
---

# How to create plugins for devtool in Yocto

I have said several times in the past that the documentation  of yocto is really impressive. They managed to explain in detail several things that otherwise will be really hard to grasp. However, I did not find anywhere how to create a plugin for devtool, which for enterprise solutions is more useful than you can ever think. So in this tutorial, you will learn how to create plugins for devtool.

<!-- truncate -->

If you don't know why you should use `devtool` to begin with, I recommend you my [blog post](/blog/why-you-should-use-devtool-on-yocto) to understand the advantages of working with it in your daily basis with Yocto. If you are repeating steps in Yocto frequently doing *the same thing* but with different recipes or maybe you want to automatize a process adding a plugin to devtool is your best chance.

## Basic structure of devtool

If you look into the python code of the `devtool` script, you will see that this tool uses a modular approach by allowing plugins to "register" new commands. This is how different subcommands has been added to the tool since the introduction of it a few years ago. You can find this on the `openembedded-core` repository on the `scripts` folder.

We can use for example the `deploy.py` plugin as a basis for our own plugin. In order to find the "plugins" for all their different scripts, it follows the same lookup pattern on the paths under `BBPATH`. If that pattern is found and a function in the file `register_commands` is detected, it means that this is a plugin for the tool and it is accepted.

This approach is not unique of `devtool` other binaries of the Yocto project used the same approach, but `devtool` would be the place for such plugins that you want to use to automatize a process during your development.

Once you understand the structure, adding a new plugin is pretty straightforward, you go in your own layer and create a python file under:

```bash
# ex: yocto-labs/lib/devtool/my-own-plugin.py
<path-to-layer>/lib/devtool/<name-plugin>.py
```

## Plugin python file

The only **require** function on the plugin file is `register_commands` and a function that will be executed if command is called. Which looks something like this:

```python
def do_something(args, config, basepath, workspace):
    # Do something on devtool
    return 0

def register_commands(subparsers, context):
    # Register devtool subcommands from this plugin
    subparsers.add_subparser_group("sub-group", "Subgroup to gather all custom plugins")
    cmd = subparsers.add_parser("do-something", help="Do something", group="sub-group")
    cmd.add_argument("recipe-name", help="Name of recipe on project")
    cmd.set_defaults(func=do_something, fixed_setup=context.fixed_setup)
```

The `subparsers` parameter is a object of [`argparse`](https://docs.python.org/3/library/argparse.html) library. You can use the official documentation to add all the arguments and parameters that you need to make it work. 

Once in the function that will be executed, you have the `args` parameter with all the information given by the user and the bitbake context on the rest of the parameters.

### How to execute bitbake-context commands on the plugin

You can either use the functions that `devtool` use internally to bring a recipe into the workspace or build certain recipe. However, the issue with this approach is that such functions test normally if all the information passes as expected. In my experience, this was more complicate that only use the function with the parameter that we need. In order to use the context and be able to send such commands you can use `exec_build_env_command`. This is a built-in Yocto function that wait for parameters that you already have and allow you to send any `devtool` or `bitbake-*` commands. You only need to import the function as for example: 

```python
from devtool import DevtoolError, exec_build_env_command

def do_something(args, config, basepath, workspace):
    # ...
    try:
        cmd = f"devtool add -V 1.0 -B {args.srcbranch} {args.recipename} {args.repository}"
        _, _ = exec_build_env_command(config.init_path, basepath, cmd, watch=True)
    except ExecutionError as e:
        raise DevtoolError(f"Command \'{e.command}\' failed")
```

## Testing your new plugin on devtool

Once you have the previous steps, you should be able to use the `devtool` help and see your commands and your sub-group. If you use the command, it will execute the function `do_something` with the given parameters.

```
$ devtool --help
  ...
  Subgroup to gather all custom plugins:
    do-something    Do something help and description
  ...
Use devtool <subcommand> --help to get help on a specific command
```
