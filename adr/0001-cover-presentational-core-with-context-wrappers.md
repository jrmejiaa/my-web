# 1. Cover as a presentational core with per-context data wrappers

Date: 2026-09-27

## Status

Accepted

## Context

The site had a single `BlogCover` component that rendered a blog post's AI-generated cover image and an attribution footer. It read all of its data from `useBlogPost()`, the blog plugin's client hook. We wanted the same cover — identical look and attribution footer — to be available in docs, but placed **manually** by the author (most docs should not have a cover), driven by the doc's own frontmatter.

`useBlogPost()` only has a provider inside blog pages; docs expose their data through a different hook, `useDoc()`. A component welded to `useBlogPost()` therefore cannot render in a doc at all. The two contexts also resolve the image differently: blog covers are co-located (`./cover.png`) and webpack-resolved via `assets.image`, whereas doc covers live in the mirrored `static/` tree and are referenced by an absolute path that is already a valid `src`.

Alternatives considered:

1. **One component that detects its context** and calls the matching hook. Fragile: relies on hook-provider presence as control flow, and mixes two data sources in one unit.
2. **One component taking all data as explicit props**, passed from the MDX. Forces authors to hand-copy frontmatter values into JSX props, which is error-prone and duplicates the source of truth.
3. **A presentational core plus thin per-context data wrappers** (chosen).

## Decision

Split the cover into three pieces under `src/components/Cover/`:

- `CoverFigure` — a pure presentational component. Given a resolved image `src`, a title (alt text), and the attribution metadata, it renders the figure, image, and attribution footer. It owns everything shared: markup, the copy-prompt button, the icon, the shared CSS module, and the all-fields-present gate on the data it receives. It knows nothing about where the data came from.
- `BlogCover` — a thin wrapper that reads `useBlogPost()`, applies the blog-particular `isBlogPostPage` guard, resolves the image via `assets.image`, and renders `CoverFigure`. Placed automatically by the swizzled blog theme.
- `DocCover` — a thin wrapper that reads `useDoc()`, resolves the image from the absolute `frontMatter.image`, warns visibly in development when a required field is missing, and renders `CoverFigure`. Placed manually by the author via an explicit import in the doc.

Anything genuinely context-particular (which hook, how the image is resolved, page-type guards, the docs dev warning) lives in the wrapper; everything else lives in `CoverFigure`.

## Consequences

- The look and attribution footer are defined once and cannot drift between blog and docs.
- Adding a cover to a third context later means writing one more thin wrapper, not touching the rendering.
- The thing dropped into a doc is named `DocCover`, not literally `BlogCover`; "same component" is true at the presentational core, not at the wrapper name.
- The existing `BlogCover/` folder moves into `Cover/`, so the swizzled `BlogPostItem/Content` import path changes.
