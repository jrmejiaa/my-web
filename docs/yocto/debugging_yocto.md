---
sidebar_position: 4
tags: [yocto,advance-yocto,linux]
---

# How to debug applications in Yocto

- A configuration in image cannot change a configuration in a package that wants to be installed.

- Variable not in the right order when working with inherit

- Network error

So if you ever face the same problem - btibake tasks in general have no network access - this is intentionally to only fetch using fetch. In cases (like ours) you can manually enable it like shown above. That was really a weird problem.

