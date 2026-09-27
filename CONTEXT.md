# Context

Glossary of domain terms for this site. Definitions only — no implementation details.

## Terms

### Cover

An AI-generated hero image that represents the subject of a post or doc, shown at the top of the
content. Its look is governed by the site house style (see the `blog-cover-prompt` skill).

### CoverFigure

The presentational cover element: given a resolved image source, a title (for alt text), and the
AI-attribution metadata (model, prompt), it renders the cover image and its attribution footer. It
holds no knowledge of where the data came from.

### BlogCover

The automatic cover for a blog post. It reads the post's frontmatter and renders a `CoverFigure`
without any author action. Present on every finalized blog post that carries a full cover.

### DocCover

The manual cover for a tutorial/doc. Most docs have no cover; an author opts a specific doc in by
placing the cover element in the page. It reads the doc's frontmatter and renders a `CoverFigure`.

### Cover fields

The frontmatter that defines a cover: the image, the generating model, the prompt, and the style
slug. A cover renders only when the required fields are present.

### Doc

A tutorial or learning article authored by the site owner (e.g. a Yocto or C/C++ tutorial). "Doc"
and "tutorial" are used interchangeably in conversation. A doc is a *piece of content*, not a
location — do not conflate it with the `docs/` tree (below).

### `docs/` tree

The published Docusaurus content directory at the repository root. Everything placed here renders as
a public page on the live site. Because of this, non-content material (such as ADRs) must **not** be
placed under `docs/`; it lives elsewhere (ADRs live in `adr/`). When someone says "a doc," they mean
a tutorial (above); when they say "the `docs/` tree" or "under `docs/`," they mean this published
directory. Keeping the two apart avoids accidentally publishing internal files.

### Post

A blog entry (a dated article under `blog/`). "Post" and "blog post" mean the same thing. Distinct
from a doc: posts are the chronological blog; docs are the reference/tutorial content.

### Section

A top-level grouping of docs by subject — `yocto`, `linux`, and `coding`. Used as a concept signal
for covers and navigation. Not to be confused with a visual "section" of a rendered page.

### House style

The fixed visual identity every cover shares: a blue-dominant palette and one of the sibling
illustration styles, no text, 16:9. It is what makes covers across the blog and docs read as one
site. Defined and enforced by the `blog-cover-prompt` skill.

### Content index

The full, display-ready catalog of every published post and doc — title, permalink, tags, and
summary — derived from the content's own frontmatter and published as site-wide data. It is the
single source of truth a page reads instead of restating a post's or doc's details by hand. A doc's
`Section` is part of its index entry, derived from the permalink rather than authored.

### Featured content

The ordered subset of posts or docs a page chooses to highlight, identified by permalink. It is an
editorial selection — which items appear and in what order — resolved against the `Content index`
for display. The selection lives with the page; the details it shows live with the content. A
featured card shows at most the first three of an item's tags, so tag count never changes a card's
size; the full tag set stays on the item itself.

