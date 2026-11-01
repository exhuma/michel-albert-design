Usage
=====

Install
-------

Add the package to the project's documentation dependencies:

.. code-block:: toml

   [project.optional-dependencies]
   docs = ["michel-albert-sphinx @ git+https://github.com/exhuma/michel-albert-design@sphinx-v0.9.1#subdirectory=packages/sphinx"]

Configure
---------

Add the extension to ``conf.py``. Leave ``html_theme`` unset: the extension
selects ``sphinx_immaterial`` itself.

.. code-block:: python

   extensions = [
       "michel_albert_sphinx",
   ]

Build with warnings treated as errors:

.. code-block:: console

   $ sphinx-build -W --keep-going -b html docs docs/_build/html

What the extension sets
-----------------------

- ``html_theme`` is ``sphinx_immaterial`` unless the project chose another
  theme, in which case the build warns.
- ``html_theme_options`` gets ``font: False`` and a light/dark palette that
  follows the reader's OS setting. Keys the project sets itself win.
- The stylesheet, the fonts and a small keyboard-scroll script are added to
  the static files.

Margin notes
------------

A ``note``, ``tip``, ``hint`` or ``seealso`` that directly follows a paragraph
or a list is set beside it in the margin on screens 1365 px and wider, and
below it on narrower screens. The build pairs the two in one block, so reading
order is the same for everyone. Several notes in a row stack in the margin.

A note stays in the text when it follows code, a table or a heading, or when it
sits inside a list or another callout. Warnings, cautions and dangers always
stay in the text. To keep one note in the text, give it a class:

.. code-block:: rst

   .. note::
      :class: ma-inline

      This note stays in the text.

Pages with margin notes get the margin column; code blocks, tables and API
signatures on those pages span the text and the margin.

Diagrams
--------

Draw mermaid diagrams with the ``md-mermaid`` directive. The package ships
mermaid with the site and draws each diagram in the theme's colours, in light
and dark, as wide as the text column. A tall diagram stops at three quarters
of the screen height (36rem at most) and is centred.

.. code-block:: rst

   .. md-mermaid::
      :caption: A request through the service, by kind of component
      :name: request-flow

      flowchart LR
        client([Client]):::cat1 --> api[API]:::cat3
        api --> db[(Database)]:::cat4

``:caption:``
   Shown under the diagram and as the title of the full-screen view. Without
   it, the full-screen view shows the section heading.

``:name:``
   A link target. The full-screen view's address ends in ``#`` and this name,
   so a link to it opens the diagram enlarged.

Tag nodes with the classes ``cat1`` to ``cat6`` to tell categories apart
(``A:::cat1`` in flowcharts, ``class A cat1`` in state diagrams). The six
colours stay distinct for readers with any form of colour blindness; pie
slices, git branches and timeline sections use them in order. Don't set
colours in a diagram, and label everything that a colour marks.

Every diagram has an enlarge button in its top right corner (always shown on
touch screens). The full-screen view pans and zooms with the mouse wheel, by
dragging, by pinching, or with the keys :kbd:`+`, :kbd:`-`, :kbd:`0` (fit) and
the arrow keys, and downloads the diagram as SVG.

Options
-------

``michel_albert_margin_notes``
   ``True`` by default. ``False`` keeps every note in the text.

``michel_albert_home_header``
   ``True`` by default. Styles the start page's first paragraph as a lede with
   a clay band. ``False`` turns it off.

``michel_albert_backdrop``
   ``True`` by default. On screens wider than the frame, the page sits on a
   raised sheet over a seeded backdrop. ``False`` turns it off.

``michel_albert_backdrop_style``
   ``"contours"`` by default. One of the design system's nine backdrops:
   ``contours``, ``circuit``, ``mosaic``, ``flow``, ``facets``, ``ridges``,
   ``halftone``, ``engraving`` or ``barcode``. Pick the one whose metaphor fits
   the project, and use the same one for its slides. An unknown name warns and
   falls back to ``contours``.

``michel_albert_backdrop_seed``
   The backdrop is generated from this text, by default the ``project`` name,
   so each project gets its own picture. The same seed always gives the same
   picture.

Pygments styles
---------------

The package registers ``michel-albert-light`` and ``michel-albert-dark`` as
Pygments styles, built from the same tokens as the stylesheet. Sphinx projects
don't need them (the stylesheet colours code), but any other tool that
highlights with Pygments can use them by name:

.. code-block:: console

   $ pygmentize -O style=michel-albert-dark -f terminal256 example.py

Change the look
---------------

Don't add CSS to a project. Change this package instead:

1. Edit ``design/tokens.json`` at the repository root and run ``node scripts/sync.mjs``, or
   edit ``styles/base.css``, ``styles/immaterial.css`` or ``styles/layout.css``.
2. Run ``python scripts/generate_css.py``.
3. Run the tests, bump the version and tag a release as ``sphinx-vX.Y.Z``.

.. autofunction:: michel_albert_sphinx.setup
