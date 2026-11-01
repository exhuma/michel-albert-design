<script setup lang="ts">
import { useDeck } from '../utils/useDeck'

// Courses: small uppercase label above the headline naming the current section.
const { section } = useDeck()
</script>

<template>
  <div v-if="section" class="ma-label ma-section-label">{{ section.index }} · {{ section.title }}</div>
</template>

<style scoped>
.ma-section-label { position: absolute; top: 48px; left: var(--ma-pad-x); }
</style>
