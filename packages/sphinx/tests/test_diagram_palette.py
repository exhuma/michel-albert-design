"""The six diagram colours stay distinct for colour-blind readers, in both themes.

Each colour is simulated for full protanopia, deuteranopia and tritanopia (Machado, Oliveira
and Fernandes 2009) and every pair is compared with CIEDE2000. The bar is the Okabe-Ito
palette's own worst pair under the same test, so the palette is at least as safe as the
reference palette for colour-blind readers.
"""

import itertools
import json
import math
from pathlib import Path

import pytest

TOKENS = json.loads((Path(__file__).parent.parent / "src/michel_albert_sphinx/tokens.json").read_text())
RAW = {t["name"]: t["value"] for t in TOKENS["color"]["tokens"]}
DIAGRAM = [f"diagram-{i}" for i in range(1, 7)]
OKABE_ITO = ["#e69f00", "#56b4e9", "#009e73", "#0072b2", "#d55e00", "#cc79a7"]

MACHADO = {
    "normal": ((1, 0, 0), (0, 1, 0), (0, 0, 1)),
    "protan": ((0.152286, 1.052583, -0.204868), (0.114503, 0.786281, 0.099216), (-0.003882, -0.048116, 1.051998)),
    "deutan": ((0.367322, 0.860646, -0.227968), (0.280085, 0.672501, 0.047413), (-0.011820, 0.042940, 0.968881)),
    "tritan": ((1.255528, -0.076749, -0.178779), (-0.078411, 0.930809, 0.147602), (0.004733, 0.691367, 0.303900)),
}


def resolve(name: str, theme: str) -> str:
    v = RAW[name]
    v = v[theme] if isinstance(v, dict) else v
    return resolve(v[1:-1], theme) if v.startswith("{") else v


def linear(c: float) -> float:
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def simulate(hex_color: str, kind: str) -> tuple[float, float, float]:
    """Linear RGB as seen with the given colour vision."""
    rgb = [linear(int(hex_color.lstrip("#")[i : i + 2], 16) / 255) for i in (0, 2, 4)]
    return tuple(min(1.0, max(0.0, sum(m * c for m, c in zip(row, rgb)))) for row in MACHADO[kind])


def lab(rgb: tuple[float, float, float]) -> tuple[float, float, float]:
    r, g, b = rgb
    x = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047
    y = 0.2126 * r + 0.7152 * g + 0.0722 * b
    z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883

    def f(t: float) -> float:
        return t ** (1 / 3) if t > 0.008856 else 7.787 * t + 16 / 116

    return 116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))


def ciede2000(c1: tuple[float, float, float], c2: tuple[float, float, float]) -> float:
    (l1, a1, b1), (l2, a2, b2) = c1, c2
    cbar = (math.hypot(a1, b1) + math.hypot(a2, b2)) / 2
    g = 0.5 * (1 - math.sqrt(cbar**7 / (cbar**7 + 25**7)))
    a1p, a2p = (1 + g) * a1, (1 + g) * a2
    c1p, c2p = math.hypot(a1p, b1), math.hypot(a2p, b2)
    h1p, h2p = math.degrees(math.atan2(b1, a1p)) % 360, math.degrees(math.atan2(b2, a2p)) % 360
    dh = 0.0 if c1p * c2p == 0 else (h2p - h1p + 180) % 360 - 180
    d_l, d_c = l2 - l1, c2p - c1p
    d_h = 2 * math.sqrt(c1p * c2p) * math.sin(math.radians(dh / 2))
    lbar, cbarp = (l1 + l2) / 2, (c1p + c2p) / 2
    if c1p * c2p == 0:
        hbar = h1p + h2p
    elif abs(h1p - h2p) <= 180:
        hbar = (h1p + h2p) / 2
    else:
        hbar = (h1p + h2p + 360) / 2
    t = (
        1
        - 0.17 * math.cos(math.radians(hbar - 30))
        + 0.24 * math.cos(math.radians(2 * hbar))
        + 0.32 * math.cos(math.radians(3 * hbar + 6))
        - 0.20 * math.cos(math.radians(4 * hbar - 63))
    )
    rt = -math.sin(math.radians(60 * math.exp(-(((hbar - 275) / 25) ** 2)))) * 2 * math.sqrt(cbarp**7 / (cbarp**7 + 25**7))
    sl = 1 + 0.015 * (lbar - 50) ** 2 / math.sqrt(20 + (lbar - 50) ** 2)
    sc, sh = 1 + 0.045 * cbarp, 1 + 0.015 * cbarp * t
    return math.sqrt((d_l / sl) ** 2 + (d_c / sc) ** 2 + (d_h / sh) ** 2 + rt * (d_c / sc) * (d_h / sh))


def worst_pair(colors: list[str], kind: str) -> float:
    return min(ciede2000(lab(simulate(a, kind)), lab(simulate(b, kind))) for a, b in itertools.combinations(colors, 2))


BAR = min(worst_pair(OKABE_ITO, kind) for kind in MACHADO)


@pytest.mark.parametrize("theme", ["light", "dark"])
@pytest.mark.parametrize("kind", list(MACHADO))
def test_categories_stay_distinct(theme, kind):
    colors = [resolve(name, theme) for name in DIAGRAM]
    assert worst_pair(colors, kind) >= BAR


@pytest.mark.parametrize("theme", ["light", "dark"])
@pytest.mark.parametrize("name", DIAGRAM)
def test_categories_stand_off_the_page(theme, name):
    """A filled node must read as filled on the reading surface."""
    page = lab(simulate(resolve("surface-200", theme), "normal"))
    assert ciede2000(lab(simulate(resolve(name, theme), "normal")), page) >= 12
