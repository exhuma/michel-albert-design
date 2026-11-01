<script setup lang="ts">
import { useDeck } from '../utils/useDeck'

// Course reference slide: full-width headline, evidence left, notes right.
// Readable without the speaker; doubles as handout.
//   # Headline
//   ::left::   code, diagram or image
//   ::right::  two or three short explanatory lines
const { mode, isPrintMode } = useDeck()
</script>

<template>
  <div class="slidev-layout ma-reference" :class="[`ma-${mode}`, { 'ma-final': isPrintMode }]">
    <div class="ma-body">
      <div class="ma-head"><slot /></div>
      <div class="ma-cols">
        <div class="ma-left"><slot name="left" /></div>
        <div class="ma-right"><slot name="right" /></div>
      </div>
    </div>
    <MaChrome />
  </div>
</template>

<style scoped>
.ma-body {
  position: absolute;
  inset: var(--ma-pad-top) var(--ma-pad-x) 130px;
  display: flex; flex-direction: column; gap: 48px;
}
.ma-cols { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 64px; align-items: start; }
.ma-right { color: var(--ma-ink-muted); display: flex; flex-direction: column; gap: 24px; }
.ma-right :deep(p) { max-width: 34ch; }
</style>
