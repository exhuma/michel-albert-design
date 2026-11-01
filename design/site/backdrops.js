/* Michel Albert design system: seeded backdrops. Generated from design/backdrops.mjs by scripts/sync.mjs; do not edit. */
(function(){
// Michel Albert design system: seeded backdrops.
// Source of truth for every surface (slides, docs, site). Draw into a 2D canvas
// context whose coordinate space is 1920 x 1080 (scale the context first).
// Same seed + same backdrop = same picture, on every device.

const PALETTES = {
  dark: { bg: '#1c1916', line: '#3d3731', h: 30, s: 12, l: 9.8, dir: 1, span: 11.8 },
  sand: { bg: '#ebe5dc', line: '#d9d0c3', h: 36, s: 27, l: 89.2, dir: -1, span: 8.4 },
  paper: { bg: '#f6f2ec', line: '#d9d0c3', h: 36, s: 33, l: 94.5, dir: -1, span: 13.7 },
}

const BACKDROPS = [
  { id: 'contours', name: 'Contours', feel: 'Terrain', default: true,
    use: 'The default. Overviews, personal pages, anything without a stronger metaphor.' },
  { id: 'circuit', name: 'Circuit', feel: 'Engineered',
    use: 'Networks, protocols, hardware, infrastructure, backbone and operations.' },
  { id: 'mosaic', name: 'Mosaic', feel: 'Tiled and quiet',
    use: 'Data models, databases, components, design systems, building blocks.' },
  { id: 'flow', name: 'Flow field', feel: 'Wind and motion',
    use: 'Pipelines, streaming, events, async work, workflows, change over time.' },
  { id: 'facets', name: 'Facets', feel: 'Cut stone',
    use: 'Architecture viewpoints, security, hardening, anything about structure.' },
  { id: 'ridges', name: 'Ridges', feel: 'Signal',
    use: 'Observability, metrics, monitoring, performance, audio and signals.' },
  { id: 'halftone', name: 'Halftone', feel: 'Print',
    use: 'Writing, documentation, publishing, communication, media.' },
  { id: 'engraving', name: 'Engraving', feel: 'Paper and craft',
    use: 'Fundamentals, theory, history, legacy systems, retrospectives, craft.' },
  { id: 'barcode', name: 'Barcode', feel: 'Data',
    use: 'Encodings, binary formats, identifiers, inventory, analytics.' },
]

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

function rng(a) {
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeNoise(rand) {
  const perm = Array.from({ length: 256 }, (_, i) => i)
  for (let i = 255; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]] }
  const p = new Uint8Array(512); for (let i = 0; i < 512; i++) p[i] = perm[i & 255]
  const gx = new Float32Array(256), gy = new Float32Array(256)
  for (let i = 0; i < 256; i++) { const a = rand() * Math.PI * 2; gx[i] = Math.cos(a); gy[i] = Math.sin(a) }
  const fade = t => t * t * t * (t * (t * 6 - 15) + 10)
  const g = (ix, iy, dx, dy) => { const h = p[p[ix & 255] + (iy & 255)]; return gx[h] * dx + gy[h] * dy }
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = fade(xf), v = fade(yf)
    const a = g(xi, yi, xf, yf), b = g(xi + 1, yi, xf - 1, yf), c = g(xi, yi + 1, xf, yf - 1), d = g(xi + 1, yi + 1, xf - 1, yf - 1)
    const x1 = a + (b - a) * u, x2 = c + (d - c) * u
    return x1 + (x2 - x1) * v
  }
}

const fbm = (n, x, y) => n(x, y) * 0.6 + n(x * 2.1, y * 2.1) * 0.28 + n(x * 4.3, y * 4.3) * 0.12
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const shade = (P, t, dh = 0) => `hsl(${P.h + dh} ${P.s}% ${(P.l + P.dir * t * P.span).toFixed(2)}%)`
const W = 1920, H = 1080

const DRAW = {
  contours(c, r, n, P) {
    c.strokeStyle = P.line; c.lineWidth = 2.5; c.lineJoin = 'round'
    const summits = [
      { x: 1250 + r() * 300, y: 420 + r() * 260, rings: 13, step: 62 },
      { x: 260 + r() * 260, y: 180 + r() * 160, rings: 5, step: 46 },
    ]
    for (const s of summits) {
      const hs = Array.from({ length: 4 }, (_, k) => ({ k: k + 2, amp: (0.06 + r() * 0.07) / (k + 1), ph: r() * Math.PI * 2, dr: (r() - 0.5) * 0.6 }))
      const st = 1.15 + r() * 0.4
      for (let ring = 1; ring <= s.rings; ring++) {
        const rad = ring * s.step
        c.beginPath()
        for (let i = 0; i <= 96; i++) {
          const a = (i / 96) * Math.PI * 2
          let f = 1
          for (const h of hs) f += h.amp * Math.sin(h.k * a + h.ph + h.dr * ring)
          const x = s.x + Math.cos(a) * rad * f * st, y = s.y + Math.sin(a) * rad * f
          i ? c.lineTo(x, y) : c.moveTo(x, y)
        }
        c.closePath(); c.stroke()
      }
    }
  },

  circuit(c, r, n, P) {
    const g = 36, cols = Math.floor(W / g) + 1, rows = Math.floor(H / g) + 1, occ = new Set()
    const dirs = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]
    const k = (x, y) => x + ',' + y
    const free = (x, y) => x >= 0 && y >= 0 && x < cols && y < rows && !occ.has(k(x, y))
    // Walk a trace: straight runs, a 45° bend, a short diagonal, back to straight.
    function walk(x, y, d) {
      const moves = []; let straight = 0, diagMax = 1 + Math.floor(r() * 3)
      const len = 10 + Math.floor(r() * 40)
      for (let s = 0; s < len; s++) {
        if (d % 2 === 1 && straight >= diagMax) { d = (d + (r() < 0.5 ? 1 : 7)) % 8; straight = 0; diagMax = 1 + Math.floor(r() * 3) }
        else if (d % 2 === 0 && straight > 2 && r() < 0.18) { d = (d + (r() < 0.5 ? 1 : 7)) % 8; straight = 0 }
        moves.push(d); straight++
      }
      return moves
    }
    // Replay a move list from a start node; stop where it would collide.
    function lay(x, y, moves) {
      if (!free(x, y)) return null
      const pts = [[x, y]]; occ.add(k(x, y))
      for (const d of moves) {
        const nx = x + dirs[d][0], ny = y + dirs[d][1]
        if (!free(nx, ny)) break
        if (dirs[d][0] && dirs[d][1]) { const dk = 'd' + Math.min(x, nx) + ',' + Math.min(y, ny); if (occ.has(dk)) break; occ.add(dk) }
        x = nx; y = ny; occ.add(k(x, y)); pts.push([x, y])
      }
      return pts
    }
    const traces = []
    for (let t = 0; t < 360; t++) {
      const x = Math.floor(r() * cols), y = Math.floor(r() * rows), d = Math.floor(r() * 4) * 2
      if (!free(x, y)) continue
      const moves = walk(x, y, d)
      const lead = lay(x, y, moves)
      if (lead && lead.length >= 4) traces.push(lead)
      // Buses: sometimes run 2 to 4 traces in parallel.
      if (lead && r() < 0.35) {
        const px = -dirs[d][1], py = dirs[d][0], m = 1 + Math.floor(r() * 3)
        for (let i = 1; i <= m; i++) {
          const bus = lay(x + px * i, y + py * i, moves.slice(0, lead.length - 1 - Math.floor(r() * 3)))
          if (bus && bus.length >= 4) traces.push(bus)
        }
      }
    }
    c.lineWidth = 3; c.lineJoin = 'round'; c.lineCap = 'round'; c.strokeStyle = P.line
    for (const pts of traces) {
      c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x * g, y * g) : c.moveTo(x * g, y * g))); c.stroke()
    }
    traces.forEach((pts, i) => {
      for (const [x, y] of [pts[0], pts[pts.length - 1]]) {
        c.beginPath(); c.arc(x * g, y * g, 7, 0, Math.PI * 2)
        c.fillStyle = i % 4 === 0 ? P.line : P.bg; c.fill(); c.stroke()
      }
    })
  },

  mosaic(c, r, n, P) {
    const cell = 60
    for (let y = 0; y < H; y += cell) for (let x = 0; x < W; x += cell) {
      const t = clamp(0.08 + (fbm(n, x * 0.0016, y * 0.0016) + 0.5) * 0.5 + (r() - 0.5) * 0.28, 0, 0.75)
      const dh = r() < 0.12 ? (r() - 0.5) * 10 : 0
      c.fillStyle = shade(P, t, dh); c.fillRect(x + 2, y + 2, cell - 4, cell - 4)
    }
  },

  flow(c, r, n, P) {
    c.strokeStyle = P.line; c.lineWidth = 2; c.lineCap = 'round'
    for (let i = 0; i < 560; i++) {
      let x = r() * W, y = r() * H
      c.beginPath(); c.moveTo(x, y)
      for (let s = 0; s < 36; s++) {
        const a = fbm(n, x * 0.0011, y * 0.0011) * Math.PI * 3
        x += Math.cos(a) * 6; y += Math.sin(a) * 6; c.lineTo(x, y)
      }
      c.stroke()
    }
  },

  facets(c, r, n, P) {
    const s = 130, rh = s * 0.866, pts = []
    for (let i = -1; i * rh < H + rh; i++) {
      const row = []
      for (let j = -1; j * s < W + s * 2; j++) row.push([j * s + (i & 1 ? s / 2 : 0) + (r() - 0.5) * 60, i * rh + (r() - 0.5) * 50])
      pts.push(row)
    }
    const tri = (a, b, d) => {
      const cx = (a[0] + b[0] + d[0]) / 3, cy = (a[1] + b[1] + d[1]) / 3
      const col = shade(P, clamp(0.22 + fbm(n, cx * 0.0013, cy * 0.0013) * 0.75 + (r() - 0.5) * 0.18, 0, 0.75))
      c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(d[0], d[1]); c.closePath()
      c.fillStyle = col; c.strokeStyle = col; c.lineWidth = 1.2; c.fill(); c.stroke()
    }
    for (let i = 0; i < pts.length - 1; i++) for (let j = 0; j < pts[i].length - 1; j++) {
      const A = pts[i][j], B = pts[i][j + 1], C = pts[i + 1][j], D = pts[i + 1][j + 1]
      if (i & 1) { tri(A, B, D); tri(A, D, C) } else { tri(A, B, C); tri(B, D, C) }
    }
  },

  ridges(c, r, n, P) {
    const cx = 1050 + r() * 450, cx2 = 300 + r() * 400
    c.lineWidth = 2.5; c.lineJoin = 'round'
    for (let i = 0, y0 = 230; y0 < H + 40; i++, y0 += 30) {
      const ys = []
      for (let x = 0; x <= W; x += 12) {
        const env = Math.exp(-(((x - cx) / 430) ** 2)) + 0.45 * Math.exp(-(((x - cx2) / 260) ** 2))
        ys.push(y0 - env * Math.max(0, fbm(n, x * 0.0035, i * 0.22) + 0.15) * 300 - n(x * 0.02, i) * 6)
      }
      const path = () => { c.beginPath(); ys.forEach((y, k) => (k ? c.lineTo(k * 12, y) : c.moveTo(0, y))) }
      path(); c.lineTo(W, H + 20); c.lineTo(0, H + 20); c.closePath(); c.fillStyle = P.bg; c.fill()
      path(); c.strokeStyle = P.line; c.stroke()
    }
  },

  halftone(c, r, n, P) {
    c.fillStyle = P.line
    const sp = 26
    for (let row = 0, y = 0; y < H + sp; y += sp * 0.866, row++) for (let x = (row % 2) * sp / 2; x < W + sp; x += sp) {
      const rad = (fbm(n, x * 0.0018, y * 0.0018) + 0.12) * 17
      if (rad < 1) continue
      c.beginPath(); c.arc(x, y, Math.min(rad, 11), 0, Math.PI * 2); c.fill()
    }
  },

  engraving(c, r, n, P) {
    const s = 22
    c.strokeStyle = P.line; c.lineWidth = 2.2; c.lineCap = 'round'
    for (let y = s / 2; y < H; y += s) for (let x = s / 2; x < W; x += s) {
      const d = fbm(n, x * 0.0019, y * 0.0019) + 0.5
      if (d < 0.47) continue
      const j = (r() - 0.5) * 0.18, L = 8 + r() * 2
      c.beginPath()
      c.moveTo(x - L * Math.cos(0.785 + j), y + L * Math.sin(0.785 + j)); c.lineTo(x + L * Math.cos(0.785 + j), y - L * Math.sin(0.785 + j))
      if (d > 0.72) { c.moveTo(x - L * Math.cos(0.785 - j), y - L * Math.sin(0.785 - j)); c.lineTo(x + L * Math.cos(0.785 - j), y + L * Math.sin(0.785 - j)) }
      c.stroke()
    }
  },

  barcode(c, r, n, P) {
    const ws = [3, 5, 8, 8, 12, 20, 32], gs = [2, 4, 4, 8, 14]
    let x = 0
    while (x < W) {
      const w = ws[Math.floor(r() * ws.length)]
      c.fillStyle = shade(P, clamp((n(x * 0.003, 0.5) + 0.5) * 0.6 + r() * 0.2 - 0.05, 0, 0.8))
      c.fillRect(x, 0, w, H)
      x += w + gs[Math.floor(r() * gs.length)]
    }
  },
}

/**
 * Draw a backdrop.
 * @param {CanvasRenderingContext2D} ctx  context of a canvas with any 16:9 size
 * @param {string} id      one of BACKDROPS[].id; unknown ids fall back to contours
 * @param {string} seed    usually the deck, course or project name
 * @param {object|string} palette  PALETTES key ('dark', 'sand', 'paper') or a palette object
 */
function drawBackdrop(ctx, id, seed, palette = 'dark') {
  const P = typeof palette === 'string' ? (PALETTES[palette] || PALETTES.dark) : palette
  const fn = DRAW[id] || DRAW.contours
  const key = DRAW[id] ? id : 'contours'
  const cw = ctx.canvas.width, ch = ctx.canvas.height
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1
  ctx.fillStyle = P.bg; ctx.fillRect(0, 0, cw, ch)
  ctx.setTransform(cw / W, 0, 0, ch / H, 0, 0)
  fn(ctx, rng(hash(seed + '|' + key)), makeNoise(rng(hash(seed + '|noise|' + key))), P)
  ctx.restore()
}

window.MaBackdrops={PALETTES:PALETTES,BACKDROPS:BACKDROPS,drawBackdrop:drawBackdrop,hash:hash,rng:rng};
})();
