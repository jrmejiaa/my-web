---
name: blog-cover-prompt
description: Generate a Google Imagen / Gemini (Nano Banana Pro) prompt for a cover image that matches this blog's house style. Use when the user wants a cover image for a blog post or a doc/tutorial, mentions "cover prompt", "cover image", or "blog image". Input is a path to a blog post or doc; output is prompt(s) plus save path and frontmatter snippet. Also has a finalize mode to record the chosen cover into the post frontmatter.
---

# blog-cover-prompt

Generate ready-to-paste Google Imagen / Gemini prompts for **cover images** that stay recognizably
part of this blog's brand while giving the generator real creative room. This skill outputs prompts
only — it never generates, downloads, or writes image files. The user pastes a prompt into
Imagen/Gemini (Nano Banana Pro), picks a result, and saves it.

The skill has two modes:

1. **Generate mode (default)** — negotiate the concept, then produce two divergent prompt options.
2. **Finalize mode** — after the user picks a winner in Gemini, record the chosen prompt and style
   into the post's frontmatter (the user still saves the `cover.png` file themselves). For docs, it
   also wires `<DocCover />` into the page body.

The user is a partner in deciding **what the image is about**. Before any prompt is written, the skill
and the user negotiate the core concept through a short, bounded grilling phase (see below). That same
phase settles **one** style question — the accent policy (analogous by default, warm contrast only if
the composition warrants it). Once concept and accent policy are agreed, the skill picks the best-fit
style for the post and freely diverges on specific accent, color, and composition to produce two real
alternatives.

## Core principle: consistent family, free expression

The old version of this skill locked *too much* — one flat navy field, a grid overlay, two exact
stroke colors, thin glowing line-art, single-focal composition. Every cover came out near-identical
and nearly unicolor. This version fixes that by locking only what makes covers **siblings**, and
freeing everything that makes them **individuals**.

Two layers, never blurred:

1. **Brand thread (locked, light-touch)** — blue-dominant palette anchored to the site colors, one of
   two sibling illustration styles, no text, 16:9. That is all. This is enough to make every cover
   read as "one blog" on the index grid.
2. **Free expression (per-post)** — the chosen style, the specific accent tone (within the agreed
   accent policy), the background treatment, the composition/density, and the focal subject. This is
   where the generator has full latitude.

Consistency comes from "blue-dominant + one of two sibling styles." Everything else is open.

## Concept negotiation (mini-grill — runs BEFORE anything is generated)

The **meaning** of the cover is decided *with* the user, not chosen unilaterally by the skill. This
phase is a bounded, purpose-built cousin of the `grill-me` skill — do **not** delegate to `grill-me`,
which is deliberately relentless and unbounded. Inline the bounded procedure described here.

Scope of the negotiation is **concept plus one style decision — the accent policy**. The concept
(the metaphor/subject the image expresses) is the primary subject of the grill. In addition, and *only*
this, the grill settles whether the palette stays **analogous** (blue-neighbor accents — the default)
or whether the composition genuinely warrants a **warm contrast** accent (see Palette). Everything else
— the specific style, the specific accent within the policy, background, composition, and density — is
**never** negotiated here; it stays free for the two divergent options downstream.

Procedure:

1. **Read the post silently.** Resolve the input and read the content (see Inputs), but say **nothing**
   about your own reading yet. Hold what you found in reserve as ammunition for challenges.
2. **Ask the user for their seed concept** — their initial idea for what the image should represent.
   The user's view anchors the negotiation.
    - **Fallback (no seed):** if the user has no idea, propose 2–3 candidate concepts drawn from the
      post and grill the user on choosing between them.
3. **Grill toward agreement**, one challenge at a time:
    - **One challenge per round**, each carrying **your recommended stance** (never an open
      "what do you think?"). Use the reserved post evidence to push back — e.g. "you framed this as
      deployment, but the post spends 80% on the debugging loop; I'd center the image on that — defend
      your framing."
    - Grilling is **mandatory**. Even a strong seed gets a **minimum of one** genuine challenge — never
      rubber-stamp the user's seed.
    - Cap at **5 challenge rounds**.
4. **Stop conditions:**
    - **Agreement reached** → stop immediately and lock the concept.
    - **Cap hit (5 rounds) without agreement** → **the user's current position wins.** The grilling
      exists to sharpen the user's thinking, not to overrule it.
5. **Produce the handoff artifact** — a locked **concept statement**:
    - **Concept sentence** — one line naming the metaphor/subject.
    - **Emphasis notes** — what to stress and what to avoid (e.g. "emphasize the branching, not the
      seed; don't make it look organic-cute").
    - **Accent policy** — either "analogous" (default: blue-neighbor accents) or "warm-allowed"
      with a one-line justification for why the composition needs contrast.

    This artifact carries the agreed intent into both options so they stay faithful while still
    differing in style-appropriate color and composition. It **replaces** the old unilateral
    concept-extraction step.

## Palette (LOCKED — blue-dominant, generous room)

Blue is always the home base and the largest presence in the image. Within that, shade, gradient,
saturation, and lighting are fully free.

- **Dominant blue world (must lead the image).** Anchor to the site palette and freely derive shades
  and gradients *between and around* these — do not treat them as an exact swatch list:
  deep navy `#0b1120`, `#1e3a8a`, primary `#3b82f6`, light `#60a5fa`, pale `#dbeafe`.
- **Accent (analogous by default, 1–2 per image, ~10–25% of the frame).** Accents are **neighbors of
  blue** — the site cyan `#06b6d4` first, then teal, indigo, or violet. They *harmonize* with the blue
  world rather than fight it; this is where the generator's best results have come from. Use the accent
  as a minority highlight, never as the dominant color.
    - **Warm contrast (amber and similar) is NOT a default.** It is only permitted when the grill's
      **accent policy** is set to "warm-allowed" because a specific composition genuinely needs
      contrast (e.g. a fire/energy/heat metaphor). **Coral is retired** — it renders poorly out of the
      generator. When warm is allowed, prefer amber; never coral.
- **Neutrals (free).** Blue-tinted grays for grounding are fine.

Rule of thumb: two covers side by side should look like siblings (blue leads both) but never twins
(different accent, different color treatment, different composition).

## Style family (LOCKED to these two siblings — the skill picks ONE per post)

Both are flat-shaded, vector-spirited, and blue-dominant, so the set stays cohesive. Commit fully to
one per image — never muddy hybrids. Do **not** use pixel-art, thin glowing "blueprint" line-art, any
grid overlay, or the retired textured-flat/grain/risograph look; those are all retired.

1. **Clean flat vector (geometric).** Crisp shapes, solid fills, bold silhouettes, minimal gradients.
   Modern editorial tech illustration. One strong shape carries the frame.
    - **Flat-icon motif (optional, clean-flat only).** Within clean flat vector, the frame may be built
      around a bold, chunky flat icon/glyph — thick contours, faux-3D "depth" implied by strong
      *neighboring* colors for the shaded faces, always flat overall (e.g. a penguin for Linux, a gear,
      a container). This motif is a clean-flat variant only; it does **not** belong in isometric, whose
      identity is projected geometry rather than a frontal glyph.
2. **Isometric flat vector.** Flat-shaded objects/scenes in isometric projection — little systems,
   stacks, machines built from the blue palette with accent highlights. The geometry itself reads as
   "technical"; no grid needed.

### Style selection (concept-driven, with anti-monotony nudge)

The skill **picks the single best-fit style for the post/concept** — there is no longer a rule forcing
each option to use a different style. The agreed concept's natural visual form drives the choice. If
the metaphor plainly wants a particular sibling (e.g. "a little machine of interlocking parts" →
isometric #2; "one bold symbol for the tool" → clean flat #1, possibly with the flat-icon motif), use
it. The concept-type heuristic is a tie-breaker for a style-neutral concept:

- **Systems / architecture / how-things-fit-together** (build systems, kernel, QEMU, layers, pipelines)
  → **isometric flat vector (#2)**.
- **Tooling / how-to / single-tool / single-symbol focus** → **clean flat vector (#1)**.

**Anti-monotony nudge (index-level variety).** Because best-fit will cluster (many systems posts push
toward isometric), before locking the style read the `imageStyle` frontmatter of recent existing posts
(see Inputs / Storage). If the last covers have leaned heavily on one style, **nudge toward the other**
when the concept can tolerate it — the concept's fit always wins if the fit is strong. This replaces
the old three-style divergence rule as the mechanism that keeps the blog index varied.

## Divergence between the two options (within one chosen style)

Both options use the **same chosen style** and express the **same agreed concept**. They must still be
real alternatives, not two coats of the same paint. Diverge them on:

- **Color treatment** — a different specific accent within the agreed accent policy (e.g. cyan vs.
  teal vs. indigo when analogous), and/or a different background treatment.
- **Concept interpretation** — a genuinely different way of depicting the same agreed concept (e.g.
  abstract shapes vs. a bold literal flat-icon glyph within clean flat; a single machine vs. a small
  connected scene within isometric).

Never vary the accent *policy* between options — only the specific accent within it.

## Composition (LOCKED — light)

- **Clear focal hierarchy.** Could be one bold subject, or a small grouped scene — the skill decides
  based on the chosen style (clean flat leans single-subject/single-icon; isometric leans small scene).
- **Density follows the style.** Let it flex; keep it legible at thumbnail size on the index grid.
- No mandated background — the model picks the background treatment (wash, duotone gradient, accent
  field, or negative space) per image.

## Inputs

Resolve the input in this priority order:

1. **Path (primary)** — a path to a blog post or doc, e.g. `blog/2025-06-01-slug/index.md` or
   `docs/yocto/how-to-start-with-yocto-in-qemu.md`. Read the file. Use frontmatter `title` and `tags`,
   plus the section (`yocto` / `linux` / `coding`), as strong concept signals. Read the body to find
   the central concept.
2. **Pasted text (fallback)** — the user pastes the post text or a summary. Work from that.
3. **Current context (fallback)** — the post currently being discussed in the conversation.

Tags and section inform the **concept and the style tie-breaker** — never the palette lock.

For the **anti-monotony nudge**, additionally scan existing posts' frontmatter for the `imageStyle`
field to see which styles recent covers used.

## Procedure (generate mode)

1. Resolve the input and read the content **silently** (see Inputs).
2. Run the **Concept negotiation** mini-grill and lock the **concept statement**
   (concept sentence + emphasis notes + accent policy). This replaces unilateral concept extraction.
3. **Pick the single best-fit style** from the agreed concept (heuristic tie-breaker if style-neutral),
   applying the **anti-monotony nudge** against recent posts' `imageStyle` when the concept tolerates
   it.
4. Build **2 deliberately divergent options** (see Output) in that **same chosen style** — differing on
   color treatment and concept interpretation of the *same agreed concept*, so they are real
   alternatives.
5. Determine the **save path** and **frontmatter snippet** (see Storage).
6. Output everything (see Output format).

## Prompt skeleton

Each option's prompt is assembled from: the brand thread + the chosen style + the free expression,
all expressing the agreed concept. Build it in plain natural language, for example:

```
<Style sentence: one of the two siblings, described concretely; if clean flat with
the flat-icon motif, describe the chunky icon with thick contours and neighbor-color
shaded faces>.
Blue-dominant palette derived from deep navy (#0b1120), blue (#3b82f6, #60a5fa)
and pale blue (#dbeafe), with <accent> as a minority accent (~10–25% of the frame).
<Background treatment>. <Composition / focal hierarchy>. The focal subject is
<agreed concept depicted as a form fitting the chosen style>.
Absolutely no text, no letters, no numbers, no words, no labels. No brand logos.
No faces. Simple flat icons or symbols are allowed. 16:9 aspect ratio.
```

Rules for assembly:

- Both options must depict the **agreed concept** and honor its **emphasis notes**.
- Cite the blue hexes as **anchors** and explicitly invite derived shades/gradients — never "use
  exactly these colors."
- Give each of the two options a **different specific accent** within the agreed accent policy
  (analogous → different blue-neighbor tones; warm-allowed → the approved warm accent plus analogous
  tones). Never introduce a warm accent unless the policy is "warm-allowed." Never use coral.
- Commit both prompts to the **same chosen style**; diverge them on color and concept interpretation.
- Always forbid **text, letters, numbers, and words** explicitly — Imagen renders these poorly and the
  blog overlays titles separately. **Also forbid real brand/company logos and faces.** Simple flat
  icons/symbols (e.g. a penguin, a gear, a container) **are allowed** and encouraged where they help.
- Never emit a light-mode variant. One blue-dominant image works as a cover on both site themes.

## Storage

Detect content type by input path.

**Blog** (`blog/YYYY-MM-DD-slug/index.md`) — co-locate the cover in the post folder:

- Save path: `blog/YYYY-MM-DD-slug/cover.png`
- Frontmatter (see Finalize mode for the full recorded set):

    ```yaml
    image: ./cover.png
    ```

**Docs** (`docs/<section>/<slug>.md`) — docs are flat files, so use a mirrored tree under `static/`:

- Save path: `static/img/covers/docs/<section>/<slug>.png`
- Frontmatter:

    ```yaml
    image: /img/covers/docs/<section>/<slug>.png
    ```

Blog and docs use the **same house style**. Storage differs; look does not.

Covers are saved as **`.png`** by default (that is what the generator renders to in practice). If the
user saves a different extension, the recorded `image` path must follow the **actual** saved file — do
not assume `.jpg`.

## Finalize mode (record the chosen cover)

Runs **after** the user has generated images in Gemini and picked a winner. This mode records the
choice into the post's frontmatter so that (a) the anti-monotony nudge has real history to read, and
(b) a future blog component can render a "view prompt" affordance. The skill still **never** writes the
image file — the user saves the cover image at the save path themselves.

For **docs**, finalize additionally wires the manual cover into the page body, because — unlike the
blog, where the swizzled theme places `<BlogCover />` automatically — a doc only shows a cover when the
author explicitly places `<DocCover />`. Finalize does that wiring so the doc renders its cover without
further manual steps.

Procedure:

1. Identify the post (same input resolution as generate mode) and ask the user **which option won** if
   not already stated.
2. Write these fields into the frontmatter, using the **exact prompt of the winning option** the skill
   produced. The `image` path uses the **actual saved extension** (`.png` by default):

    ```yaml
    image: ./cover.png            # or the docs static path
    imagePrompt: "<the full winning prompt, verbatim>"
    imageStyle: clean-flat        # or: isometric
    imageModel: Gemini Nano Banana Pro
    ```

3. **Docs only — wire `<DocCover />` into the body** (skip this step entirely for blog posts):

    a. **Import.** Ensure `import {DocCover} from '@site/src/components/Cover';` is present. Append it
       to the existing import block at the top of the body (grouped with other `import` lines, below
       the frontmatter). If the doc has no imports yet, add it as the first body line after the
       frontmatter, separated by a blank line.
    b. **Placement.** Insert `<DocCover />` immediately **after the first H1 heading**. If the doc has
       no H1, fall back to placing it right after the import block. The author can move it later.
    c. **Idempotency.** Before inserting, check for an existing `DocCover` import and an existing
       `<DocCover />` tag; insert each **only if absent**. Frontmatter fields are still overwritten
       with the winning values. Re-running finalize must never create duplicates.
    d. **Existing banner warning.** If the body contains a leading hand-written `<img …>` banner, do
       **not** rewrite or remove it. Add `<DocCover />` per (b) and emit a one-line warning telling the
       user a manual `<img>` was detected so they can remove the old banner deliberately.
4. Confirm the **save path** where the user must drop the cover image (`.png` by default), and remind
   them the skill does not write the image itself.

`imageStyle` uses a stable slug (`clean-flat` or `isometric`) so the anti-monotony nudge can grep it
reliably across posts.

## Output format (generate mode)

Aspect ratio for all covers: **16:9** (set it as the Imagen/Gemini generation parameter — there are no
`--flags` in this generator).

Present exactly this:

1. A one-line note of the input resolved.
2. The **agreed concept statement** — the locked concept sentence + emphasis notes + accent policy —
   as a visible receipt of what was negotiated. Both options below must honor it.
3. The **chosen style** and a one-line reason (concept fit, plus any anti-monotony nudge applied).
4. **Two deliberately divergent options**, each with:
    - A short label naming the shared style (clean flat / isometric) and this option's accent.
    - The rationale line (`agreed concept = X → style Y → accent Z, interpretation W`).
    - The full ready-to-paste prompt.
    Both options use the same chosen style; they must differ in specific accent and in concept
    interpretation so they land in visibly different corners of that style.
5. The **save path** and the **frontmatter snippet** for the detected content type.
6. A one-line reminder to set 16:9 in the generator, that the image must contain no text, and that
   after picking a winner the user can run **finalize mode** to record it.

## Guardrails

- **Never skip the concept negotiation.** Grilling is mandatory, with a minimum of one genuine
  challenge, even when the user's seed is strong. There is no bypass.
- Keep the negotiation scoped to **concept plus the single accent-policy decision** — never negotiate
  the specific style, specific accent, or composition there; those stay free for the two divergent
  options.
- **Accents are analogous (blue-neighbor) by default.** Only use a warm contrast accent when the grill
  explicitly set the accent policy to "warm-allowed." **Never use coral under any circumstance.**
- **Forbid text, letters, numbers, and words** in every prompt, plus real brand logos and faces —
  Imagen renders these poorly and they break consistency. **Simple flat icons/symbols are allowed** and
  can strengthen a clean-flat cover.
- Never invent a subject that requires readable text or accurate technical diagrams — keep subjects
  abstract or reduced to a clean flat icon.
- Never regress to a retired look: no grid overlay, no thin glowing blueprint line-art, no single
  flat-navy field mandated across every image, no two-color-only palette, and **no textured-flat /
  grain / risograph style**.
- The style family is **exactly two** siblings (clean flat, isometric). Do not reintroduce a third.
- If a free-layer choice would fight the brand thread (e.g. implies a non-blue-dominant image or
  photorealism), reshape that choice, never the brand thread.
- In **finalize mode**, record the **verbatim** winning prompt and the correct `imageStyle` slug; never
  write the image file — the user saves it. For **docs only**, also wire `<DocCover />` into the body
  (import + tag after the first H1), idempotently; never rewrite or remove an author's existing `<img>`
  banner — warn instead. Blog finalize touches frontmatter only.
- If no path, no pasted text, and no clear current-context post exist, ask for one — do not guess.
