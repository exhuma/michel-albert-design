import { computed } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'

export interface Section {
  index: number      // 1-based section number
  no: number         // slide number of the section slide
  title: string
  day?: string | number
  count: number      // slides in this section, section slide included
}

/**
 * Deck structure as seen from the slide this is rendered on.
 * Uses $page (this slide), not the presenter's current slide, so thumbnails,
 * overview and exports all show the right orientation for each slide.
 */
export function useDeck() {
  const { slides, isPrintMode } = useNav()
  const { $page, $slidev } = useSlideContext()

  // $slidev is a reactive object, so themeConfigs arrives already unwrapped.
  const config = computed(() => {
    const raw = ($slidev as any)?.themeConfigs
    return ((raw && 'value' in raw ? raw.value : raw) ?? {}) as Record<string, any>
  })
  const mode = computed<'talk' | 'course'>(() => (config.value.mode === 'course' ? 'course' : 'talk'))

  const sections = computed<Section[]>(() => {
    const all = slides.value
    const starts = all.filter(s => s.meta?.layout === 'section')
    return starts.map((s, i) => {
      const next = starts[i + 1]?.no ?? all.length + 1
      const fm = (s.meta?.slide?.frontmatter ?? {}) as Record<string, any>
      return {
        index: i + 1,
        no: s.no,
        title: String(fm.title ?? s.meta?.slide?.title ?? `Part ${i + 1}`),
        day: fm.day,
        count: next - s.no,
      }
    })
  })

  const page = computed(() => $page.value)

  const section = computed<Section | undefined>(() => {
    const list = sections.value
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].no <= page.value) return list[i]
    }
    return undefined
  })

  /** Quotable slide ID: section.position, e.g. 2.07; a section slide is 2.00. */
  const slideId = computed(() => {
    const s = section.value
    const pos = s ? page.value - s.no : page.value - 1
    return `${s ? s.index : 0}.${String(pos).padStart(2, '0')}`
  })

  const day = computed(() => {
    const list = sections.value
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].no <= page.value && list[i].day != null) return list[i].day
    }
    return config.value.day
  })

  const seed = computed(() => String(config.value.seed ?? ($slidev as any)?.configs?.title ?? 'michel-albert'))

  const backdrop = computed(() => String(config.value.backdrop ?? 'contours'))

  return { mode, config, sections, section, page, slideId, day, seed, backdrop, isPrintMode }
}
