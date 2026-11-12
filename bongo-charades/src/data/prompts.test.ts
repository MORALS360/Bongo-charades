import { describe, expect, it } from 'vitest'
import { CATEGORIES } from './categories'
import { PROMPTS } from './prompts'

/*
 * Content validation — runs with `npm test`.
 * These checks are the automated part of the content-quality process
 * (duplicates, structure, language rules). Cultural accuracy still needs a human.
 */
describe('prompt bank — structure', () => {
  it('every prompt id is unique', () => {
    const ids = PROMPTS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every prompt belongs to an existing category', () => {
    const ids = new Set(CATEGORIES.map((c) => c.id))
    expect(PROMPTS.filter((p) => !ids.has(p.categoryId))).toEqual([])
  })

  it('every category has at least 12 prompts', () => {
    for (const c of CATEGORIES) {
      expect(PROMPTS.filter((p) => p.categoryId === c.id).length, c.name).toBeGreaterThanOrEqual(12)
    }
  })

  it('there are still 26 categories; Vijiweni is gone and Zilipendwa exists', () => {
    expect(CATEGORIES).toHaveLength(26)
    expect(CATEGORIES.find((c) => c.name === 'Vijiweni')).toBeUndefined()
    const zil = CATEGORIES.find((c) => c.id === 'zilipendwa')
    expect(zil?.group).toBe('c2')
  })

  it('no empty prompts and no very long prompts (max 4 words, except hints)', () => {
    for (const p of PROMPTS) {
      expect(p.text.trim().length, p.id).toBeGreaterThan(0)
      expect(p.text.trim().split(/\s+/).length, `${p.id}: ${p.text}`).toBeLessThanOrEqual(4)
    }
  })
})

describe('prompt bank — duplicates', () => {
  it('no duplicate prompt text inside a category', () => {
    for (const c of CATEGORIES) {
      const texts = PROMPTS.filter((p) => p.categoryId === c.id).map((p) => p.text.toLowerCase())
      expect(new Set(texts).size, c.name).toBe(texts.length)
    }
  })

  it('no prompt text is repeated across categories', () => {
    const seen = new Map<string, string>()
    const dupes: string[] = []
    for (const p of PROMPTS) {
      // Normalise so near-duplicates like "Bodaboda" / "Boda Boda" are caught too
      const key = p.text.toLowerCase().replace(/[^a-z0-9]/g, '')
      const other = seen.get(key)
      if (other && other !== p.categoryId) dupes.push(`${p.text} (${other} / ${p.categoryId})`)
      seen.set(key, p.categoryId)
    }
    expect(dupes).toEqual([])
  })

  it('a translated concept has at most one English and one Kiswahili version', () => {
    const byConcept = new Map<string, string[]>()
    for (const p of PROMPTS) {
      if (!p.concept) continue
      byConcept.set(p.concept, [...(byConcept.get(p.concept) ?? []), p.language])
    }
    for (const [concept, langs] of byConcept) {
      expect(langs.sort(), concept).toEqual(['en', 'sw'])
    }
  })
})

describe('prompt bank — language direction', () => {
  const groupOf = (id: string) => CATEGORIES.find((c) => c.id === id)!.group
  const share = (group: string, lang: string) => {
    const g = PROMPTS.filter((p) => groupOf(p.categoryId) === group)
    return g.filter((p) => p.language === lang).length / g.length
  }

  it('Bongo & Tanzanian Culture is Kiswahili-led (almost no English-only prompts)', () => {
    expect(share('c2', 'en')).toBeLessThan(0.05)
  })

  it('Classic Charades offers a Kiswahili version for most translatable ideas', () => {
    const classic = PROMPTS.filter((p) => groupOf(p.categoryId) === 'c1')
    const en = classic.filter((p) => p.language === 'en')
    const paired = en.filter((p) => p.concept)
    expect(paired.length / en.length).toBeGreaterThan(0.9)
  })

  it('Zilipendwa prompts are songs with the artist shown as a hint', () => {
    const zil = PROMPTS.filter((p) => p.categoryId === 'zilipendwa')
    expect(zil.length).toBeGreaterThanOrEqual(15)
    expect(zil.every((p) => p.hint && p.hint.length > 0)).toBe(true)
  })
})
