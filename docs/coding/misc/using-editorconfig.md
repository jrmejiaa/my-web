---
sidebar_position: 1
---

# EditConfig for basic styling guide

EditorConfig is a simple configuration file format used to maintain consistent coding styles for multiple developers working on the same project across various editors and IDEs. It consists of a file named `.editorconfig` that defines basic formatting properties such as indentation style (tabs vs. spaces), indent size, character encoding, and whether to trim trailing whitespace. Unlike Clang-format, which focuses on complex code structure and syntax-aware formatting, EditorConfig handles the fundamental "text-level" settings that determine how your editor behaves when you hit the Enter or Tab keys.

This file allows me to determine on a global scale. For example Makefile, CMakeLists.txt or input data files like JSON or XML. This also set the UTF-8 as my encoding to avoid any type of mismatch, specially with those colleagues that still works with Windows and Notepad++ 🤪.

```bash
root = true

[*]
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
indent_style = space
indent_size = 4

[*.{html,php,js,yaml,yml}]
indent_size = 2

[*.txt]
indent_style = tab
indent_size = 4

[Makefile]
indent_style = tab

[*.{diff,md}]
trim_trailing_whitespace = false
```
