#!/usr/bin/env node
// Copy the design system's shared sources into the packages that ship them.
//
//   node scripts/sync.mjs          write the copies
//   node scripts/sync.mjs --check  exit 1 if any copy is out of date (CI)
//
// Each package must be installable on its own (pip and pnpm only see their own
// folder), so the copies are committed. design/ is the source of truth; never
// edit a copy.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = p => readFileSync(join(ROOT, p), 'utf8')

const backdrops = read('design/backdrops.mjs')
const classic = [
  '/* Michel Albert design system: seeded backdrops. Generated from design/backdrops.mjs by scripts/sync.mjs; do not edit. */',
  '(function(){',
  backdrops.replace(/^export function /gm, 'function ').replace(/^export const /gm, 'const '),
  'window.MaBackdrops={PALETTES:PALETTES,BACKDROPS:BACKDROPS,drawBackdrop:drawBackdrop,hash:hash,rng:rng};',
  '})();',
  '',
].join('\n')

const targets = [
  ['packages/sphinx/src/michel_albert_sphinx/tokens.json', read('design/tokens.json')],
  ['packages/slidev/utils/backdrops.mjs', backdrops],
  ['design/site/backdrops.js', classic],
  ['packages/sphinx/src/michel_albert_sphinx/static/backdrops.js', classic],
]

const check = process.argv.includes('--check')
let stale = 0
for (const [path, content] of targets) {
  const full = join(ROOT, path)
  const current = existsSync(full) ? readFileSync(full, 'utf8') : null
  if (current === content) continue
  if (check) { console.error(`${relative(ROOT, full)} is out of date; run: node scripts/sync.mjs`); stale++ }
  else { writeFileSync(full, content); console.log(`wrote ${path}`) }
}
process.exit(stale ? 1 : 0)
