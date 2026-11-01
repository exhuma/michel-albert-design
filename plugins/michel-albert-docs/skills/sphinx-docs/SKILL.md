---
name: sphinx-docs
description: Use whenever you create, set up, build, migrate or restyle Sphinx documentation (conf.py, docs/ folder, .rst pages, Read the Docs config) in one of Michel Albert's projects. Applies his design system through the michel-albert-sphinx package on the sphinx-immaterial theme, and his writing rules for docs.
---

# Sphinx documentation in Michel's identity

All of Michel's Sphinx documentation uses one look: his design system on the
`sphinx_immaterial` theme, delivered by the `michel-albert-sphinx` package
(https://github.com/exhuma/michel-albert-design, folder `packages/sphinx`). The package owns every visual
decision. Projects only add it as an extension.

## Rules

- Use the extension `michel_albert_sphinx`. Do not set `html_theme`; the
  extension selects `sphinx_immaterial` itself.
- Never add styling to a project: no `html_css_files`, no `_static/*.css`, no
  template overrides, no `font` or `palette` theme options, no `pygments_style`.
  If something looks wrong, tell Michel and propose the change for the package
  repository instead.
- Other `sphinx_immaterial` options (features, repo links, edit links) are fine
  in a project's `html_theme_options`.
- Do not switch a project from another generator (MkDocs, plain Markdown) to
  Sphinx without asking.

## Set up docs in a project

1. Find the newest release tag:
   `git ls-remote --tags --refs https://github.com/exhuma/michel-albert-design 'sphinx-v*'`
   and use the highest `sphinx-vX.Y.Z`.
2. Add the docs dependency in `pyproject.toml` (create the extra if missing):

   ```toml
   [project.optional-dependencies]
   docs = ["michel-albert-sphinx @ git+https://github.com/exhuma/michel-albert-design@sphinx-vX.Y.Z#subdirectory=packages/sphinx"]
   ```

   If the project manages docs dependencies elsewhere (`docs/requirements.txt`,
   a uv dependency group), add the same requirement there instead.
3. Create `docs/conf.py`:

   ```python
   project = "<project name>"
   author = "Michel Albert"
   copyright = "<year>, Michel Albert"

   extensions = [
       "sphinx.ext.autodoc",       # only for Python packages with an API to document
       "michel_albert_sphinx",
   ]
   ```

   `project` also seeds the backdrop, so use the project's real name. Don't set
   `michel_albert_backdrop_seed` unless Michel asks.

   Pick the backdrop with `michel_albert_backdrop_style` by the project's main
   metaphor; if nothing clearly fits, leave it out (`contours`). Reuse the
   style of the project's slides when there are any. State the choice and the
   reason in one line.

   | Style | Use for |
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
4. Create `docs/index.rst` with a one-paragraph summary of what the project
   does and a `toctree` of the pages.
5. If the project has `.readthedocs.yaml`, make sure it installs the `docs`
   extra (`python.install: - method: pip, path: ., extra_requirements: [docs]`).

## Migrate existing Sphinx docs

1. Add the dependency as above and `"michel_albert_sphinx"` to `extensions`.
2. Remove `html_theme`, any theme-specific `html_theme_options` from the old
   theme, `html_css_files`, `html_style`, `pygments_style`, and custom CSS or
   templates that only restyle. Keep content, extensions and real
   functionality (for example a custom template that adds a page, not a look).
3. Remove the old theme package from the docs dependencies.
4. Mermaid diagrams: remove `sphinxcontrib.mermaid` from `extensions`, its
   `mermaid_*` settings (themes, colours) and the `sphinxcontrib-mermaid`
   dependency, and rename every `.. mermaid::` to `.. md-mermaid::`. The design
   package draws `md-mermaid` itself (see "Diagrams" below);
   sphinxcontrib-mermaid diagrams show as raw source under sphinx-immaterial.
   Where the old theme coloured nodes by category, use the `cat1` to `cat6`
   classes instead.
5. Tell Michel what you removed.

## Writing the pages

Follow the design system's content rules:

- Write plainly and directly. Short sentences. Say what a thing does, then stop.
- Docs address no one and use imperatives ("Install the package", not "You can
  install the package").
- Sentence case for every heading. No emoji, no exclamation marks, no marketing
  adjectives. Quote real names, paths and numbers.
- Callouts: `note` for neutral information, `tip` for a recommended or
  confirmed path, `warning` for something to check, `danger` for something that
  fails or breaks. Use them sparingly.
- Margin notes: a `note`, `tip`, `hint` or `seealso` placed directly after a
  paragraph or list appears beside it in the margin on wide screens. Put each
  note right after the paragraph it qualifies, keep it short (a few sentences),
  and use it for asides the reader can skip. Anything the reader must not miss
  is a `warning` or `danger`, which always stays in the text. A note after a
  code block or table stays in the text; to force that elsewhere, add
  `:class: ma-inline`.
- The start page's first paragraph is shown as a lede: make it a one-paragraph
  summary of what the project does.
- Code blocks: always give a language (`.. code-block:: python`, `console` for
  shell sessions with a `$` prompt). Long lines are fine; code never wraps and
  scrolls inside its block, so do not hand-break lines to fit.
- Keep headings shallow: page title, sections, at most one level below.

## Diagrams

Draw diagrams as code with `.. md-mermaid::` (no extension to add; the package
ships mermaid with the site). Every diagram gets an enlarge button that opens it
full screen, with pan, zoom and SVG download.

```rst
.. md-mermaid::
   :caption: A request through the service, by kind of component
   :name: request-flow

   flowchart LR
     client([Client]):::cat1 --> api[API]:::cat3
     api --> db[(Database)]:::cat4
```

- Give a diagram a `:caption:` when it needs a title; it shows under the diagram
  and as the full-screen title. `:name:` makes it a link target.
- Colours come from the theme; never set colours in the diagram (`style`,
  `classDef` with colours, `%%{init}%%` themes).
- To tell categories apart, tag nodes with `cat1` to `cat6` (`A:::cat1` in
  flowcharts, `class A cat1` in state diagrams). Six at most; the six colours
  stay distinct for colour-blind readers. Pie slices, git branches and timeline
  sections take the same colours automatically.
- Colour never carries meaning alone: label every node, edge and state, and say
  in the caption or text what the categories are.

## Build and check

Build with warnings as errors and fix every warning before you finish:

```console
sphinx-build -W --keep-going -b html docs docs/_build/html
```

Then check the output:

- The pages use `sphinx_immaterial` (the HTML contains `md-header`) and link
  `_static/michel-albert.css`.
- No page references `fonts.googleapis.com`.
- The build printed no warning about `html_theme`; if it did, a theme is still
  set somewhere in `conf.py`.

Add `docs/_build/` to `.gitignore` if it is not there.
