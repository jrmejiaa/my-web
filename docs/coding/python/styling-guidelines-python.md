---
tags: [fundamentals-python,yapf]
---

# Styling Guidelines for Python projects

For Python projects I tend to be on the side of PEP8. I follow their coding style and use [`yapf`](https://github.com/google/yapf), which was developed by Google to control the styling guide in python projects. My file is fairly simple: 

```bash
[style]
based_on_style = pep8
spaces_before_comment = 4
indent_width: 4
split_before_logical_operator = true
column_limit = 150
SPLIT_BEFORE_FIRST_ARGUMENT = true
DEDENT_CLOSING_BRACKETS = true
```

What I like about using `yapf` is that is automatically understand by VS Code, so my main editor do not have any issue to help me formatting it with `yapf`.
