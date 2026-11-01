<script setup lang="ts">
import { computed } from 'vue'
import { useDeck } from '../utils/useDeck'

// Talks: a hairline bar on the bottom edge, one segment per section.
// Done sections in line-strong, the current one fills in accent.
const { sections, section, page } = useDeck()

const segments = computed(() => sections.value.map((s) => {
  let fill = 0
  let state: 'done' | 'current' | 'todo' = 'todo'
  if (section.value && s.index < section.value.index) { fill = 1; state = 'done' }
  else if (section.value && s.index === section.value.index) {
    fill = (page.value - s.no + 1) / s.count
    state = 'current'
  }
  return { key: s.no, grow: s.count, fill, state }
}))
</script>

<template>
  <div v-if="segments.length" class="ma-rail" aria-hidden="true">
    <div v-for="seg in segments" :key="seg.key" class="seg" :style="{ flexGrow: seg.grow }">
      <div class="fill" :class="seg.state" :style="{ width: `${seg.fill * 100}%` }" />
    </div>
  </div>
</template>

<style scoped>
.ma-rail { position: absolute; left: 0; right: 0; bottom: 0; height: 8px; display: flex; gap: 4px; }
.seg { flex-basis: 0; background: var(--ma-line); height: 100%; }
.fill { height: 100%; }
.fill.done { background: var(--ma-line-strong); }
.fill.current { background: var(--ma-accent); }
</style>
