<script setup lang="ts">
import { useDeck } from '../utils/useDeck'

// Assertion and evidence: a sentence headline, then one piece of evidence.
const { mode, isPrintMode } = useDeck()
</script>

<template>
  <div class="slidev-layout ma-default" :class="[`ma-${mode}`, { 'ma-final': isPrintMode }]">
    <div class="ma-body">
      <slot />
    </div>
    <MaChrome />
  </div>
</template>

<style scoped>
.ma-body {
  position: absolute;
  inset: var(--ma-pad-top) var(--ma-pad-x) 120px;
  display: flex; flex-direction: column; gap: 48px;
}
.ma-course .ma-body { inset-block-end: 130px; }
.ma-body :deep(.slidev-code-wrapper) { max-width: 1400px; }
</style>
