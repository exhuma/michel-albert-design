"""Seeded backdrop: the options and what a build links."""

import re
import subprocess
import sys
from pathlib import Path

from michel_albert_sphinx import BACKDROP_STYLES

ROOT = Path(__file__).parent.parent
STATIC = ROOT / "src/michel_albert_sphinx/static"
CSS = "michel-albert-backdrop.css"
SCRIPT = "michel-albert-backdrop.js"


def build(out: Path, *defines: str, strict: bool = True) -> tuple[Path, str]:
    args = [sys.executable, "-m", "sphinx", "--keep-going", "-b", "html"]
    if strict:
        args.append("-W")
    for d in defines:
        args += ["-D", d]
    result = subprocess.run([*args, str(ROOT / "docs"), str(out)], capture_output=True, text=True)
    assert result.returncode == 0, result.stdout + result.stderr
    return out, result.stderr


def backdrop_tag(html: str) -> str:
    tag = re.search(rf"<script[^>]*_static/{re.escape(SCRIPT)}[^>]*>", html)
    assert tag, "backdrop script not linked"
    return tag.group(0)


def test_build_links_backdrop(tmp_path):
    out, _ = build(tmp_path)
    html = (out / "usage.html").read_text(encoding="utf-8")
    assert f"_static/{CSS}" in html
    assert html.index("_static/backdrops.js") < html.index(f"_static/{SCRIPT}")  # generator first
    tag = backdrop_tag(html)
    assert 'data-style="contours"' in tag  # the default
    assert 'data-seed="michel-albert-sphinx"' in tag  # seeded from `project`
    for name in (CSS, SCRIPT, "backdrops.js"):
        assert (out / "_static" / name).exists()


def test_style_and_seed_options(tmp_path):
    out, _ = build(tmp_path, "michel_albert_backdrop_style=ridges", "michel_albert_backdrop_seed=something-else")
    tag = backdrop_tag((out / "usage.html").read_text(encoding="utf-8"))
    assert 'data-style="ridges"' in tag and 'data-seed="something-else"' in tag


def test_unknown_style_warns_and_falls_back(tmp_path):
    out, stderr = build(tmp_path, "michel_albert_backdrop_style=plaid", strict=False)
    assert "unknown michel_albert_backdrop_style 'plaid'" in stderr
    assert 'data-style="contours"' in backdrop_tag((out / "usage.html").read_text(encoding="utf-8"))


def test_switch_off(tmp_path):
    out, _ = build(tmp_path, "michel_albert_backdrop=0")
    html = (out / "usage.html").read_text(encoding="utf-8")
    assert CSS not in html and SCRIPT not in html and "backdrops.js" not in html


def test_styles_match_the_generator():
    """The option accepts exactly the styles the shared generator draws."""
    source = (STATIC / "backdrops.js").read_text(encoding="utf-8")
    block = source.split("const BACKDROPS = [", 1)[1].split("]", 1)[0]
    assert tuple(re.findall(r"\{ id: '([a-z]+)'", block)) == BACKDROP_STYLES


def test_backdrop_fades_and_the_sheet_casts_the_halo():
    rules = (STATIC / CSS).read_text(encoding="utf-8")
    assert rules.count("mask-image: radial-gradient(") == 2  # prefixed and standard
    assert "object-fit: cover" in rules  # cropped, never stretched
    assert "0 0 40px 4px var(--ma-shadow)" in rules  # the sheet's halo
    assert "@media print { .ma-backdrop { display: none; } }" in rules
