<script setup lang="ts">
import { useDeck } from '../utils/useDeck'

// Section divider: same backdrop as the cover, part label and title
// bottom-left. Courses keep the footer so the section is quotable (2.00).
//   ---
//   layout: section
//   title: Requests      # optional, defaults to the slide heading
//   day: 1               # optional, courses only
//   ---
//   # Requests
const { mode, section, seed, backdrop } = useDeck()
</script>

<template>
  <div class="slidev-layout ma-section" :class="`ma-${mode}`">
    <MaBackdrop :id="backdrop" :seed="seed" />
    <div class="ma-text">
      <div v-if="section" class="ma-label">Part {{ section.index }}</div>
      <slot />
    </div>
    <MaCourseFooter v-if="mode === 'course'" />
  </div>
</template>

<style scoped>
.ma-text {
  position: absolute; left: var(--ma-pad-x); right: var(--ma-pad-x); bottom: 130px;
  display: flex; flex-direction: column; gap: 16px;
}
.ma-course .ma-text { bottom: 150px; }
.ma-text :deep(h1) { font-size: var(--ma-size-display); line-height: 104px; }
</style>
