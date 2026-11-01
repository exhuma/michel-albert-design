import { defineShikiSetup } from '@slidev/types'

// Seven-hue "Rich" code palette from the design system, in both themes.
// Keywords clay, functions teal, strings green, numbers/constants coral,
// types amber, comments muted, everything else ink.
function richTheme(name: string, type: 'dark' | 'light', c: Record<string, string>) {
  return {
    name,
    type,
    colors: { 'editor.background': c.bg, 'editor.foreground': c.ink },
    tokenColors: [
      { settings: { foreground: c.ink } },
      { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: c.muted } },
      { scope: ['keyword', 'storage', 'storage.type', 'keyword.control', 'keyword.operator.logical', 'keyword.operator.new'], settings: { foreground: c.clay } },
      { scope: ['entity.name.function', 'support.function', 'meta.function-call.generic', 'entity.name.tag'], settings: { foreground: c.accent } },
      { scope: ['string', 'string.quoted', 'punctuation.definition.string', 'markup.inline.raw'], settings: { foreground: c.good } },
      { scope: ['constant.numeric', 'constant.language', 'constant.character', 'support.constant'], settings: { foreground: c.critical } },
      { scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class', 'entity.other.attribute-name'], settings: { foreground: c.warn } },
      { scope: ['variable.parameter', 'meta.decorator', 'entity.name.function.decorator'], settings: { foreground: c.blue } },
    ],
  }
}

const dark = richTheme('michel-albert-dark', 'dark', {
  bg: '#2e2924', ink: '#ece6dd', muted: '#a89f93', clay: '#b07d56', accent: '#4fb3a9',
  good: '#8fb573', critical: '#e8806a', warn: '#e0a83c', blue: '#8ea8c8',
})

const light = richTheme('michel-albert-light', 'light', {
  bg: '#f6f2ec', ink: '#231e19', muted: '#5e554b', clay: '#8c5a38', accent: '#0f6e68',
  good: '#3d6b2a', critical: '#a63a24', warn: '#8a5a00', blue: '#3b5b82',
})

export default defineShikiSetup(() => ({
  themes: { dark: dark as any, light: light as any },
}))
