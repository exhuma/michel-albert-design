<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useDarkMode } from '@slidev/client'
import { drawBackdrop } from '../utils/backdrops.mjs'

// Seeded backdrop for title and section slides. Style comes from
// themeConfig.backdrop (default: contours), seed from the deck title.
const props = defineProps<{ id: string; seed: string }>()
const { isDark } = useDarkMode()
const canvas = ref<HTMLCanvasElement>()

function draw() {
  const c = canvas.value?.getContext('2d')
  if (c) drawBackdrop(c, props.id, props.seed, isDark.value ? 'dark' : 'sand')
}

onMounted(draw)
watch(() => [props.id, props.seed, isDark.value], draw)
</script>

<template>
  <canvas ref="canvas" class="ma-backdrop" width="1920" height="1080" aria-hidden="true" />
</template>

<style scoped>
.ma-backdrop { position: absolute; inset: 0; width: 100%; height: 100%; display: block; pointer-events: none; }
</style>
