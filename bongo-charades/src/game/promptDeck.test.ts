import { describe, expect, it } from 'vitest'
import type { GamePrompt } from '../types'
import { createDeck, currentPrompt, drawNext, sanitizePrompts } from './promptDeck'
import { getFilteredPrompts, PROMPTS } from '../data/prompts'

const make = (n: number): GamePrompt[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `p${i}`,
    text: `Prompt ${i}`,
    categoryId: 'animals',
    language: 'en',
  }))

describe('prompt deck', () => {
  it('shows nothing until the first draw', () => {
    expect(currentPrompt(createDeck(make(3), 42))).toBeNull()
  })

  it('never repeats a prompt until every prompt has been used', () => {
    const prompts = make(25)
    let deck = createDeck(prompts, 7)
    const seen = new Set<string>()
    for (let i = 0; i < prompts.length; i++) {
      deck = drawNext(deck)
      const p = currentPrompt(deck)!
      expect(seen.has(p.id)).toBe(false)
      seen.add(p.id)
    }
    expect(seen.size).toBe(25)
  })

  it('reshuffles after exhaustion without showing the same prompt twice in a row', () => {
    for (let seed = 1; seed < 200; seed++) {
      let deck = createDeck(make(4), seed)
      let last: string | null = null
      for (let i = 0; i < 20; i++) {
        deck = drawNext(deck)
        const id = currentPrompt(deck)!.id
        expect(id).not.toBe(last)
        last = id
      }
    }
  })

  it('shuffles (different seeds give different orders)', () => {
    const a = createDeck(make(20), 1).order.map((p) => p.id).join()
    const b = createDeck(make(20), 2).order.map((p) => p.id).join()
    expect(a).not.toBe(b)
  })

  it('removes empty/undefined prompts and duplicate ids', () => {
    const bad = [
      ...make(2),
      { id: 'empty', text: '   ', categoryId: 'animals', language: 'en' },
      { id: 'p0', text: 'dupe', categoryId: 'animals', language: 'en' },
    ] as GamePrompt[]
    expect(sanitizePrompts(bad).map((p) => p.id)).toEqual(['p0', 'p1'])
  })

  it('handles an empty deck without crashing', () => {
    const deck = drawNext(createDeck([], 1))
    expect(currentPrompt(deck)).toBeNull()
  })
})

describe('getFilteredPrompts', () => {
  it('only returns prompts from the selected categories', () => {
    const result = getFilteredPrompts(['bongo-flava', 'animals'], false, 'mixed')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((p) => p.categoryId === 'bongo-flava' || p.categoryId === 'animals')).toBe(
      true,
    )
  })

  it('shows only ONE version of each translated concept (never "Lion" and "Simba" together)', () => {
    for (const lang of ['en', 'sw', 'mixed'] as const) {
      for (let seed = 1; seed < 6; seed++) {
        const result = getFilteredPrompts([], true, lang, seed)
        const concepts = result.filter((p) => p.concept).map((p) => p.concept)
        expect(new Set(concepts).size).toBe(concepts.length)
      }
    }
  })

  it('English prefers English versions, Kiswahili prefers Kiswahili versions', () => {
    const en = getFilteredPrompts(['animals'], false, 'en')
    const sw = getFilteredPrompts(['animals'], false, 'sw')
    expect(en.map((p) => p.text)).toContain('Lion')
    expect(en.map((p) => p.text)).not.toContain('Simba')
    expect(sw.map((p) => p.text)).toContain('Simba')
    expect(sw.map((p) => p.text)).not.toContain('Lion')
  })

  it('Mixed uses both languages across a game', () => {
    const mixed = getFilteredPrompts(['animals', 'everyday-things', 'act-it-out'], false, 'mixed', 42)
    const langs = new Set(mixed.map((p) => p.language))
    expect(langs.has('en')).toBe(true)
    expect(langs.has('sw')).toBe(true)
  })

  it('Tanzanian categories keep their Kiswahili prompts even in English mode', () => {
    const en = getFilteredPrompts(['daladala-diaries'], false, 'en')
    expect(en.length).toBeGreaterThan(0)
    expect(en.map((p) => p.text)).toContain('Konda')
  })

  it('returns nothing (not other categories) when no categories are selected', () => {
    expect(getFilteredPrompts([], false, 'mixed')).toEqual([])
  })

  it('every one of the 29 categories currently has at least one prompt', () => {
    const ids = new Set(PROMPTS.map((p) => p.categoryId))
    expect(ids.size).toBe(29)
  })

  it('no prompt in the bundled data is empty', () => {
    expect(PROMPTS.every((p) => p.text.trim().length > 0)).toBe(true)
  })
})
