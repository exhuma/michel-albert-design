# slidev-theme-michel-albert

Slide theme for [Slidev](https://sli.dev) built on the Michel Albert design system.
Two deck types share one theme:

- **Talks**: dark brown, one assertion and one piece of evidence per slide, progress rail.
- **Courses**: dimmed sand, reference layout with notes, section label, footer and quotable slide IDs (`2.07`).

Title and section slides get one of nine seeded backdrops (`themeConfig.backdrop`, default `contours`); content slides stay plain.
Builds and code focus follow one rule: the newest step is full strength, earlier steps fade.
Speaker notes only appear in presenter view, and exports show the final state of each slide.

## Use it in a deck

The theme is installed with pnpm straight from this repository's subfolder (pin a tag):

```console
pnpm add -D @slidev/cli markdown-it@^14 "slidev-theme-michel-albert@github:exhuma/michel-albert-design#slidev-v0.1.0&path:/packages/slidev"
```

`markdown-it@^14` works around a Slidev 53 peer dependency that pnpm would otherwise resolve to 15, which breaks the build.

Find the newest tag with
`git ls-remote --tags --refs https://github.com/exhuma/michel-albert-design 'slidev-v*'`.

```yaml
---
theme: michel-albert
colorSchema: dark        # light for courses
themeConfig:
  mode: talk             # or course
  backdrop: circuit      # contours, circuit, mosaic, flow, facets, ridges, halftone, engraving, barcode
  course: HTTP for developers
layout: cover
---
```

Layouts: `cover`, `section`, `default`, `reference`. The `michel-albert-slides`
Claude Code plugin in this repository holds the authoring rules.

## Develop

```console
pnpm install
pnpm dev:talk      # or dev:course
```

`utils/backdrops.mjs` is a copy of `design/backdrops.mjs`; edit the original and
run `node scripts/sync.mjs` at the repository root.

## Release

Bump `version` in `package.json`, tag `slidev-vX.Y.Z`, push.
