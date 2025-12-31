---
sidebar_position: 1
tags: [yocto, fundamentals-python, setuptools]
---

# How to create a basic python module

Nowadays on times of python `3.14.X` there are a tone of ways to create a python module. This is kind of the "old" way. You will be find python purist that say why this is no longer recommended, but I decide to document this version here because it is the current way of installing modules that works out-of-the-box with Yocto and with legacy tools. Besides that the blog post [*Is `setup.py` deprecated?](https://packaging.python.org/en/latest/discussions/setup-py-deprecated/) shows why this is still relevant and could be used to follow the latest trends.


```bash
$ tree py-project
├── py-project
│   ├── __init__.py
│   ├── ...
│   └── ...
├── README.md
└── setup.py
```

On the `py-project` folder should be the name of your module and then all your fancy stuffs for that module inside. The `setup.py` looks very basic something like this:

```python
from setuptools import setup

setup(
    name='py-project',
    description="Awesome module of py-project",
    version='0.0.1',
    package_data={'py-project': ['< Here can be static files >']},
    install_requires=[
        'jsonschema>=4.24.0' # Example of required libraries
    ],
)
```

If you use a normal install command of `pip`, you will get a warning saying that you are not following the new standard on module creation. You can avoid that by using the flag `--use-pep517` and `--no-build-isolation`.

```bash
# On root of module
$ pip install --use-pep517 --no-build-isolation .
```
