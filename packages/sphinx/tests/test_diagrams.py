"""Mermaid diagrams: what the md-mermaid directive writes."""

import re
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).parent.parent


def build(out: Path, builder: str = "html") -> Path:
    args = [sys.executable, "-m", "sphinx", "-W", "--keep-going", "-b", builder, str(ROOT / "docs"), str(out)]
    result = subprocess.run(args, capture_output=True, text=True)
    assert result.returncode == 0, result.stdout + result.stderr
    return out


@pytest.fixture(scope="module")
def site(tmp_path_factory):
    return build(tmp_path_factory.mktemp("html"))


def figures(html: str) -> list[str]:
    return re.findall(r'<figure class="ma-diagram"[^>]*>.*?</figure>', html, re.S)


def test_diagrams_are_figures_the_theme_leaves_alone(site):
    html = (site / "style-reference.html").read_text(encoding="utf-8")
    found = figures(html)
    assert len(found) == 3
    for figure in found:
        assert '<pre class="ma-diagram__source">' in figure
    # sphinx-immaterial's script draws every .mermaid element into a closed shadow root
    assert 'class="mermaid"' not in html


def test_caption_and_name(site):
    first = figures((site / "style-reference.html").read_text(encoding="utf-8"))[0]
    assert first.startswith('<figure class="ma-diagram" id="request-flow">')
    assert '<figcaption class="ma-diagram__caption">A request through the service, by kind of component</figcaption>' in first
    assert "flowchart LR" in first and "--&gt;" in first  # the source, escaped


def test_mermaid_and_script_ship_with_the_site(site):
    assert (site / "_static/mermaid/mermaid.min.js").exists()  # no CDN
    assert (site / "_static/michel-albert-diagrams.js").exists()
    assert "_static/michel-albert-diagrams.js" in (site / "style-reference.html").read_text(encoding="utf-8")


def test_other_builders_get_the_source(tmp_path):
    text = (build(tmp_path, "text") / "style-reference.txt").read_text(encoding="utf-8")
    assert "flowchart LR" in text and "sequenceDiagram" in text
