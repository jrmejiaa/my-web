# 2. Comments as opt-in everywhere, behind a presentational core

Date: 2026-09-27

## Status

Accepted

## Context

The site embeds a Giscus comment thread on both blog posts and docs. The wiring had drifted into two inconsistent shapes:

- A single `GiscusComponent` hard-wired the Giscus deployment config (repo, category, mapping) inline and read `useColorMode` for theming.
- The blog swizzle (`BlogPostItem`) rendered it **conditionally**: a post showed comments only when its frontmatter opted in (`enableComments: true`) and only on the full post page.
- The docs swizzle (`DocItem/Layout`) rendered it **unconditionally**: every doc showed a comment thread, with no frontmatter flag at all.

So "does this page have comments?" was answered by two different rules living in two different swizzles, and a reader had to know the context to know the rule. The gate was also duplicated logic that a caller had to re-derive, rather than a property the comments unit owned.

This is the same situation ADR-0001 addressed for covers: one look, two contexts, two different plugin hooks (`useBlogPost` vs `useDoc`).

Alternatives considered:

1. **Keep the asymmetry** (blog opt-in, docs always-on). Rejected: two rules to memorize, and new tutorials silently sprout a comment box.
2. **A single `Comments` component taking an `enabled` prop**, each caller computing the gate. Rejected: leaves the gate scattered across the two swizzles — the exact friction being removed.
3. **A single component that detects its context** by probing which hook provider is present. Rejected for the same reason as in ADR-0001: it relies on hook-provider presence as control flow.
4. **A presentational core plus thin per-context data wrappers**, with a single symmetric opt-in policy (chosen).

## Decision

Two decisions, taken together.

**Policy: comments are opt-in per item, everywhere.** An item shows comments when its own frontmatter sets `enableComments: true` — the same rule for a blog post and a doc. Docs that previously relied on always-on rendering were migrated by adding the flag to the 10 tutorial docs; the 4 section `welcome-*` hub pages were deliberately left without it, since a hub is a signpost, not content people discuss.

**Shape: a `Comments/` module mirroring `Cover/`.** Split into three pieces under `src/components/Comments/`:

- `CommentsThread` — the presentational core. It owns the Giscus deployment config and resolves the theme via `useColorMode`. Its interface is empty (zero props): theme is global and the Giscus config is a single fixed deployment target, so there is nothing to vary and nothing for a caller to pass. It knows nothing about whether it *should* render.
- `BlogComments` — a thin wrapper that reads `useBlogPost()` and gates on `enableComments && isBlogPostPage`, then renders `CommentsThread`.
- `DocComments` — a thin wrapper that reads `useDoc()` and gates on `frontMatter.enableComments`, then renders `CommentsThread`.

Anything context-particular (which hook, which frontmatter gate) lives in the wrapper; everything shared (Giscus config, theme) lives in the core. The old `GiscusComponent/` is deleted and the two swizzles import the wrappers from `@site/src/components/Comments`.

## Consequences

- "Does this page have comments?" has one answer everywhere: the item's `enableComments` frontmatter. The gate is a property the wrapper owns, not logic each swizzle re-derives.
- The Giscus config and theming are defined once and cannot drift between blog and docs.
- The module is named for the domain concept (comments), not today's adapter (Giscus). Swapping comment providers later means changing the core's implementation, not renaming the module or touching call sites.
- The switch to opt-in is not behavior-preserving for docs: any doc without the flag now shows no thread. This was applied as a deliberate one-time editorial pass (tutorials in, hubs out), not a silent default.
- This extends the ADR-0001 pattern to a second module, establishing "presentational core + per-context wrappers" as the house approach for one look shared across the blog and docs contexts.
