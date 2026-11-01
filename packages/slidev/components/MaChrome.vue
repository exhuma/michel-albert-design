<script setup lang="ts">
import { useDeck } from '../utils/useDeck'

// Orientation for content slides: progress rail in talks,
// section label plus footer in courses.
const { mode } = useDeck()
</script>

<template>
  <template v-if="mode === 'course'">
    <MaSectionLabel />
    <MaCourseFooter />
  </template>
  <MaProgressRail v-else />
</template>
