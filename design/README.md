# Design system

Calm, precise, plain. The visual identity for Michel Albert's site, blog,
tools, docs and talks. Open `site/index.html` in a browser for the full
reference with live examples.

## Files

| File | Role |
|---|---|
| `tokens.json` | Colours (dark and light), with the intended use of each token. Packages generate their CSS from a copy. |
| `backdrops.mjs` | The nine seeded backdrops and the guide for choosing one. ES module, canvas 2D. |
| `site/index.html` | Reference page: palette, type, shape, components, backdrops, slides, imagery. |
| `site/backdrops.js` | Browser build of `backdrops.mjs` for the page. Generated. |

## Core rules

- Dark is the main theme. One teal accent on warm brown neutrals; the accent is the only hue that is not a state.
  Diagrams add six category colours (`diagram-1` to `diagram-6`, text on them `on-diagram-N`): they only tell
  categories apart, never carry state, and stay distinct for protan, deutan and tritan readers (tested in the
  Sphinx package).
- Source Sans 3 for text, Source Code Pro for code. Headings at weight 600, nothing heavier.
- Flat surfaces, 1px hairlines, 4px radius (2px for tags, none for tables). Only a raised reading sheet casts a shadow.
- Running text near 65 characters per line. Code and other preformatted blocks never wrap.
- Voice: short sentences, sentence case, no emoji, no exclamation marks.

## Backdrops

Covers, section slides and the margins around a docs reading sheet carry a
seeded backdrop. Each project picks one style and seeds it with its name; a
deck, its handouts and its docs share it. Content stays on plain surfaces.

| Backdrop | Use for |
|---|---|
| `contours` | Default. Overviews, personal pages, anything without a stronger metaphor |
| `circuit` | Networks, protocols, hardware, infrastructure, backbone, operations |
| `mosaic` | Data models, databases, components, design systems, building blocks |
| `flow` | Pipelines, streaming, events, async work, workflows, change over time |
| `facets` | Architecture viewpoints, security, hardening, structure |
| `ridges` | Observability, metrics, monitoring, performance, signals |
| `halftone` | Writing, documentation, publishing, communication |
| `engraving` | Fundamentals, theory, history, legacy systems, retrospectives |
| `barcode` | Encodings, binary formats, identifiers, inventory, analytics |

Backdrops use the background, the hairline colour and lightness steps between
them. Never add a hue or raise their contrast.

Every surface draws them with this generator: Slidev imports `backdrops.mjs`,
and the design site and the Sphinx package ship the browser build
(`michel_albert_backdrop_style` in a project's `conf.py`).

## Slides

Talks: dark, one assertion and one piece of evidence per slide, progress rail.
Courses: dimmed sand, reference layout, section label, footer with quotable slide
IDs. Speaker notes never appear on the audience screen. See `packages/slidev`.
