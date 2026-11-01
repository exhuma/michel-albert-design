<script setup lang="ts">
import { useDeck } from '../utils/useDeck'

// Title slide: the deck backdrop (themeConfig.backdrop), title bottom-left.
//   # Talk title
//   One line under the title (speaker, event, date)
const { seed, backdrop } = useDeck()
</script>

<template>
  <div class="slidev-layout ma-cover">
    <MaBackdrop :id="backdrop" :seed="seed" />
    <div class="ma-text"><slot /></div>
  </div>
</template>

<style scoped>
.ma-text {
  position: absolute; left: var(--ma-pad-x); right: var(--ma-pad-x); bottom: 120px;
  display: flex; flex-direction: column; gap: 24px;
}
.ma-text :deep(h1) { font-size: var(--ma-size-display); line-height: 104px; max-width: 18ch; }
.ma-text :deep(p) { color: var(--ma-ink-muted); }
</style>
