<script setup lang="ts">
import { computed } from 'vue'
import { useDeck } from '../utils/useDeck'

// Courses: course name and day on the left, quotable slide ID on the right.
const { config, day, slideId } = useDeck()

const left = computed(() => {
  const parts = [config.value.course].filter(Boolean)
  if (day.value != null) parts.push(`day ${day.value}`)
  return parts.join(' · ')
})
</script>

<template>
  <footer class="ma-footer">
    <span>{{ left }}</span>
    <span class="id">{{ slideId }}</span>
  </footer>
</template>

<style scoped>
.ma-footer {
  position: absolute; left: var(--ma-pad-x); right: var(--ma-pad-x); bottom: 30px;
  display: flex; justify-content: space-between; align-items: baseline;
  border-top: 2px solid var(--ma-line); padding-top: 12px;
  font-size: var(--ma-size-label); line-height: 36px; color: var(--ma-ink-muted);
}
.id { font-family: var(--ma-font-mono); font-variant-numeric: tabular-nums; }
</style>
