---
name: slidev-decks
description: Write or convert Michel Albert's slide decks with Slidev and slidev-theme-michel-albert. Use for any talk or course deck, or when porting old reveal.js decks.
---

# Michel Albert slides

Decks are Markdown files rendered by Slidev with `slidev-theme-michel-albert`.
The rules come from the Slides section of the Michel Albert design system; this
skill is how to apply them. Content first: never hand-style a slide.

## Pick the deck type first

| | Talk | Course |
|---|---|---|
| Heard | once | over days, looked up afterwards |
| Headmatter | `colorSchema: dark`, `themeConfig.mode: talk` | `colorSchema: light`, `themeConfig.mode: course`, `themeConfig.course: <name>` |
| Content layout | `default` (assertion and evidence) | `reference` (headline, evidence left, notes right) |
| Orientation | progress rail, automatic | section label + footer + slide ID, automatic |

```yaml
---
theme: michel-albert
title: Overview of HTTP
colorSchema: dark
themeConfig:
  mode: talk          # or: course
  backdrop: circuit   # see "Pick the backdrop"
  course: HTTP for developers   # courses only
layout: cover
---
```

## Pick the backdrop

Covers and section slides carry a seeded backdrop, set once per deck with
`themeConfig.backdrop`. The deck title is the seed (override with
`themeConfig.seed`). Choose by the subject's main metaphor; if nothing clearly
fits, use `contours`. A deck shares its backdrop with the project's docs, so
reuse the project's existing choice when there is one.

| `backdrop` | Use for |
|---|---|
| `contours` | Default. Overviews, personal topics, anything without a stronger metaphor |
| `circuit` | Networks, protocols, hardware, infrastructure, backbone, operations |
| `mosaic` | Data models, databases, components, design systems, building blocks |
| `flow` | Pipelines, streaming, events, async work, workflows, change over time |
| `facets` | Architecture viewpoints, security, hardening, structure |
| `ridges` | Observability, metrics, monitoring, performance, signals |
| `halftone` | Writing, documentation, publishing, communication |
| `engraving` | Fundamentals, theory, history, legacy systems, retrospectives |
| `barcode` | Encodings, binary formats, identifiers, inventory, analytics |

State the choice and the reason in one line when you create a deck.

## Layouts

- `cover`: first slide. `# Title` plus one line (speaker, event, date).
- `section`: starts a part. `# Requests`. Optional `title:` and, in courses, `day:`.
  Numbering, the rail and slide IDs are derived from these; never number by hand.
- `default`: `# One sentence that states the point`, then one piece of evidence:
  a code block, a diagram or an image.
- `reference` (courses): `# Headline`, then `::left::` evidence and `::right::`
  two or three short sentences that make the slide readable without the speaker.

## Writing rules

- Headlines are full sentences that make a claim, not topic labels.
  "Timeouts belong on every call", not "Timeouts".
- Talks: no bullets. A list is only allowed when the list itself is the evidence.
- Everything the speaker says goes into notes: an HTML comment at the end of the
  slide (`<!-- ... -->`). Notes only appear in presenter view.
- Code: at most about 14 lines of 60 characters. Lines never wrap; shorten the
  snippet instead. Step the focus with `{2|3|4|all}`; non-focus lines dim.
- Builds: wrap parts in `<v-clicks>`. Earlier parts fade automatically. No
  transitions, no animation, no custom colours.
- Voice: short sentences, sentence case, no emoji, no exclamation marks.

## Install

In a new deck folder, find the newest tag with
`git ls-remote --tags --refs https://github.com/exhuma/michel-albert-design 'slidev-v*'`
and install with pnpm (npm cannot install from a repository subfolder):

```console
pnpm add -D @slidev/cli markdown-it@^14 "slidev-theme-michel-albert@github:exhuma/michel-albert-design#slidev-vX.Y.Z&path:/packages/slidev"
```

`markdown-it@^14` works around a Slidev 53 peer dependency that pnpm would otherwise resolve to 15, which breaks the build.

Set `theme: michel-albert` in the headmatter.

## Commands

- `pnpm exec slidev deck.md` — present; press `p` for presenter view with notes.
- `pnpm exec slidev build deck.md --base /shelf/<deck>/` — static site for the shelf.
- `pnpm exec slidev export deck.md` — PDF handout, final state of every slide.

## Porting a reveal.js deck

1. Decide talk or course.
2. Turn each `<section>` into a slide separated by `---`.
3. Rewrite topic titles as assertions; move explanatory text into notes
   (talks) or the `::right::` slot (courses).
4. Replace fragments with `<v-clicks>` and `data-line-numbers` with `{…}` steps.
5. Delete inline styles and images used as decoration.
