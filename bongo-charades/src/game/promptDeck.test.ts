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

  it('respects English / Kiswahili / Mixed', () => {
    const en = getFilteredPrompts([], true, 'en')
    const sw = getFilteredPrompts([], true, 'sw')
    const mixed = getFilteredPrompts([], true, 'mixed')
    expect(en.every((p) => p.language === 'en' || p.language === 'mixed')).toBe(true)
    expect(sw.every((p) => p.language === 'sw' || p.language === 'mixed')).toBe(true)
    expect(mixed.length).toBe(PROMPTS.length)
  })

  it('returns nothing (not other categories) when no categories are selected', () => {
    expect(getFilteredPrompts([], false, 'mixed')).toEqual([])
  })

  it('every one of the 26 categories currently has at least one prompt', () => {
    const ids = new Set(PROMPTS.map((p) => p.categoryId))
    expect(ids.size).toBe(26)
  })

  it('no prompt in the bundled data is empty', () => {
    expect(PROMPTS.every((p) => p.text.trim().length > 0)).toBe(true)
  })
})
