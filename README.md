# michel-albert-design

Michel Albert's design system and everything that ships it, in one place.

| Folder | What it is |
|---|---|
| [`design/`](design/) | The design system itself: tokens, seeded backdrops and the reference page. Source of truth. |
| [`packages/sphinx/`](packages/sphinx/) | `michel-albert-sphinx`: Sphinx extension on sphinx-immaterial for project docs. |
| [`packages/slidev/`](packages/slidev/) | `slidev-theme-michel-albert`: Slidev theme for talks and courses. |
| [`plugins/`](plugins/) | Claude Code plugins: `michel-albert-docs` (Sphinx) and `michel-albert-slides` (Slidev). |

## Install

Sphinx docs (pip, pin a tag):

```toml
[project.optional-dependencies]
docs = ["michel-albert-sphinx @ git+https://github.com/exhuma/michel-albert-design@sphinx-v0.6.0#subdirectory=packages/sphinx"]
```

Slidev decks (pnpm, pin a tag):

```console
pnpm add -D @slidev/cli markdown-it@^14 "slidev-theme-michel-albert@github:exhuma/michel-albert-design#slidev-v0.1.0&path:/packages/slidev"
```

Claude Code plugins:

```console
claude plugin marketplace add exhuma/michel-albert-design
claude plugin install michel-albert-docs@michel-albert
claude plugin install michel-albert-slides@michel-albert
```

## Change the design

1. Edit the source in `design/` (`tokens.json`, `backdrops.mjs`, `site/index.html`).
2. Run `node scripts/sync.mjs` to update the copies each package ships.
   CI fails if a copy is out of date.
3. Rebuild and test the affected packages, then release each one on its own tag.

## Releases

Each package is versioned and tagged separately:

- `sphinx-vX.Y.Z` for `packages/sphinx` (before the move: `vX.Y.Z`, up to `v0.5.0`)
- `slidev-vX.Y.Z` for `packages/slidev`

## Licences

Code: MIT (see `LICENSE`). Fonts shipped with the Sphinx package: SIL Open Font License 1.1.
