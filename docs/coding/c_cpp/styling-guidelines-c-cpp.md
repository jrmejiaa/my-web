---
tags: [fundamentals-cxx,clang-format]
---

# Styling Guidelines for C/C++ projects

I am a believer of the saying: *"The experience talk and we should listen"*. So I am not going to be the weirdo here. If you arrived to an already started project, you don't have a saying in the style and you should under all circumstances (even your own liking) maintain that style guide. The **consistency** is the most important aspect while reading code. If for the whole project you are using <kbd>tabs</kbd> instead of <kbd>spaces</kbd>, go for it. There is nothing more ugly (believe me) that seeing tabs and spaces together **in the same file** 😖. Imagine the beauty in languages like Python...

Nowadays we have so many tools to avoid this kind of mistakes that even on old projects we can use new tools to avoid this kind of issues. This is the tool that I used and the settings that I preferred.

## Clang format

This is, I think, the most used tool for this particular problem on C/C++ developers. Clang-format is an open-source tool part of the LLVM/Clang ecosystem designed to automatically reformat source code to follow a specific style guide. By using a `.clang-format` configuration file, developers can define precise rules for indentation, brace placement, and line wrapping, ensuring that an entire codebase remains consistent regardless of who wrote the code.

You can see what does every setting on their official website, but I basically use the Google standard and tweak it of my liking. 

```yaml
# Google C/C++ Code Style settings
# https://clang.llvm.org/docs/ClangFormatStyleOptions.html
Language: Cpp
BasedOnStyle: Google
AccessModifierOffset: -4
SortIncludes: false
AlignAfterOpenBracket: Align
AlignConsecutiveAssignments: true
AlignConsecutiveMacros: true
AlignOperands: Align
AllowAllArgumentsOnNextLine: true
AllowAllConstructorInitializersOnNextLine: true
AllowAllParametersOfDeclarationOnNextLine: false
AllowShortBlocksOnASingleLine: Empty
AllowShortCaseLabelsOnASingleLine: false
AllowShortFunctionsOnASingleLine: Inline
AllowShortIfStatementsOnASingleLine: Never
AllowShortLambdasOnASingleLine: Inline
AllowShortLoopsOnASingleLine: false
AlwaysBreakAfterReturnType: None
AlwaysBreakTemplateDeclarations: Yes
BinPackArguments: false
BreakBeforeBraces: Custom
BraceWrapping:
  AfterCaseLabel: false
  AfterClass: true
  AfterStruct: true
  AfterControlStatement: true
  AfterEnum: true
  AfterFunction: true
  AfterNamespace: true
  AfterUnion: true
  AfterExternBlock: false
  BeforeCatch: false
  BeforeElse: false
  BeforeLambdaBody: false
  IndentBraces: false
  SplitEmptyFunction: false
  SplitEmptyRecord: false
  SplitEmptyNamespace: false
BreakBeforeBinaryOperators: None
BreakBeforeTernaryOperators: true
BreakConstructorInitializers: BeforeColon
PackConstructorInitializers: Never
BreakInheritanceList: AfterComma
ColumnLimit: 150
CompactNamespaces: false
ContinuationIndentWidth: 4
Cpp11BracedListStyle: true
DerivePointerAlignment: false # Make sure the * or & align on the left
EmptyLineBeforeAccessModifier: LogicalBlock
EmptyLineAfterAccessModifier: Always
AlignConsecutiveDeclarations: true
FixNamespaceComments: true
IncludeBlocks: Preserve
IndentCaseLabels: true
IndentPPDirectives: None
IndentWidth: 4
KeepEmptyLinesAtTheStartOfBlocks: true
MaxEmptyLinesToKeep: 1
NamespaceIndentation: None
ObjCSpaceAfterProperty: false
ObjCSpaceBeforeProtocolList: true
PointerAlignment: Right
ReflowComments: false
SeparateDefinitionBlocks: Always # Only support since clang-format 14
SpaceAfterCStyleCast: false
SpaceAfterLogicalNot: false
SpaceAfterTemplateKeyword: true
SpaceBeforeAssignmentOperators: true
SpaceBeforeCpp11BracedList: false
SpaceBeforeCtorInitializerColon: true
SpaceBeforeInheritanceColon: true
SpaceBeforeParens: ControlStatements
SpaceBeforeRangeBasedForLoopColon: true
SpaceBeforeSquareBrackets: false
SpaceInEmptyParentheses: false
SpacesBeforeTrailingComments: 2
SpacesInAngles: false
SpacesInCStyleCastParentheses: false
SpacesInContainerLiterals: false
SpacesInParentheses: false
SpacesInSquareBrackets: false
Standard: c++20
TabWidth: 4
UseTab: Never
```
