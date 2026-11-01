"""Mermaid diagrams drawn by the design system.

Replaces sphinx-immaterial's ``md-mermaid`` directive. The theme draws its diagrams inside a
closed shadow root, which no script can reach, so they cannot be enlarged, downloaded or
coloured from the design tokens. This directive writes the diagram source into a
``figure.ma-diagram`` that immaterial's script ignores; ``michel-albert-diagrams.js`` draws it
with the mermaid copy sphinx-immaterial ships, in the design system's colours, and adds the
enlarge button and the full-screen view.

Options: ``:caption:`` (shown under the diagram and as the title of the full-screen view),
``:name:`` (a link target, also used in the full-screen view's URL) and ``:class:``.
"""

from __future__ import annotations

from typing import Any

from docutils import nodes
from docutils.parsers.rst import directives
from sphinx.application import Sphinx
from sphinx.transforms.post_transforms import SphinxPostTransform
from sphinx.util.docutils import SphinxDirective
from sphinx_immaterial import mermaid_diagrams


class diagram(nodes.General, nodes.Element):
    """A mermaid diagram: its source in ``source``, an optional caption as a child node."""


class diagram_caption(nodes.TextElement):
    """The caption under a diagram."""


class DiagramDirective(SphinxDirective):
    has_content = True
    option_spec = {
        "caption": directives.unchanged,
        "name": directives.unchanged,
        "class": directives.class_option,
    }

    def run(self) -> list[nodes.Node]:
        self.assert_has_content()
        node = diagram("", source="\n".join(self.content), classes=self.options.get("class", []))
        self.set_source_info(node)
        if self.options.get("caption"):
            text_nodes, messages = self.state.inline_text(self.options["caption"], self.lineno)
            node += diagram_caption(self.options["caption"], "", *text_nodes)
            node += messages
        self.add_name(node)
        # sphinx-immaterial copies its mermaid build into _static/mermaid when this is set
        setattr(self.env, mermaid_diagrams._COPY_MERMAID_DIST_ENV_KEY, True)
        return [node]


def visit_diagram_html(self: Any, node: diagram) -> None:
    self.body.append(self.starttag(node, "figure", CLASS="ma-diagram"))
    self.body.append('<pre class="ma-diagram__source">' + self.encode(node["source"]) + "</pre>")


def depart_diagram_html(self: Any, node: diagram) -> None:
    self.body.append("</figure>\n")


def visit_caption_html(self: Any, node: diagram_caption) -> None:
    self.body.append(self.starttag(node, "figcaption", "", CLASS="ma-diagram__caption"))


def depart_caption_html(self: Any, node: diagram_caption) -> None:
    self.body.append("</figcaption>")


class DiagramsAsSource(SphinxPostTransform):
    """Builders other than HTML get the diagram's source as a literal block."""

    default_priority = 400

    def run(self, **kwargs: Any) -> None:
        if self.app.builder.format == "html":
            return
        for node in list(self.document.findall(diagram)):
            node.replace_self(nodes.literal_block(node["source"], node["source"]))


def setup(app: Sphinx) -> None:
    app.setup_extension("sphinx_immaterial.mermaid_diagrams")
    app.add_directive("md-mermaid", DiagramDirective, override=True)
    app.add_node(diagram, html=(visit_diagram_html, depart_diagram_html))
    app.add_node(diagram_caption, html=(visit_caption_html, depart_caption_html))
    app.add_post_transform(DiagramsAsSource)
