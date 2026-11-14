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

  it('every category has at least 100 prompt ideas (Phase 5 target), except the approved exceptions', () => {
    // Owner decisions: Car Brands is a documented exception (about 60–70 brands);
    // Watu Maarufu may ship under 100 because the evidence does not support more.
    const EXCEPTIONS: Record<string, number> = { 'car-brands': 55, 'watu-maarufu': 75 }
    for (const c of CATEGORIES) {
      const ideas = new Set(PROMPTS.filter((p) => p.categoryId === c.id).map((p) => p.concept ?? p.id))
      expect(ideas.size, c.name).toBeGreaterThanOrEqual(EXCEPTIONS[c.id] ?? 100)
    }
  })

  it('every prompt carries the Phase 5 fields (difficulty, kind, shelf)', () => {
    const missing = PROMPTS.filter((p) => !p.difficulty || !p.kind || !p.shelf).map((p) => p.id)
    expect(missing).toEqual([])
  })

  it('ids are stable content ids, not position numbers', () => {
    expect(PROMPTS.filter((p) => /-\d+$/.test(p.id) && !/\d/.test(p.text)).map((p) => p.id)).toEqual([])
  })

  it('29 categories: Vijiweni is gone, Zilipendwa exists (previous restructure intact)', () => {
    expect(CATEGORIES).toHaveLength(29)
    expect(CATEGORIES.find((c) => /vijiweni/i.test(c.name))).toBeUndefined()
    expect(CATEGORIES.find((c) => c.id === 'zilipendwa')?.group).toBe('c2')
    const mtaani = PROMPTS.filter((p) => p.categoryId === 'mtaani').map((p) => p.text)
    expect(mtaani).toEqual(expect.arrayContaining(['Kijiweni', 'Kahawa na Kashata', 'Bao']))
  })

  it('no empty prompts and no very long prompts (max 4 words; really famous titles up to 6)', () => {
    for (const p of PROMPTS) {
      expect(p.text.trim().length, p.id).toBeGreaterThan(0)
      // Owner rule (2026-11-14): a really famous title may be longer, marked longTitle.
      const limit = p.longTitle ? 6 : 4
      expect(p.text.trim().split(/\s+/).length, `${p.id}: ${p.text}`).toBeLessThanOrEqual(limit)
    }
  })
})

describe('prompt bank — duplicates', () => {
  /*
   * Owner rule (Stage 4A, widened in 4C): the same text may appear twice only when the
   * hint lines tell them apart — "Nairobi" the city, and "Nairobi" with "Marioo ft. Bien"
   * under it. Two prompts with the same text and the same (or no) hint are still forbidden.
   */
  // Normalise so near-duplicates like "Bodaboda" / "Boda Boda" are caught too
  const key = (t: string) => t.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g, '')

  it('no duplicate prompt text inside a category, unless the hints differ', () => {
    for (const c of CATEGORIES) {
      const seen = new Set<string>()
      for (const p of PROMPTS.filter((q) => q.categoryId === c.id)) {
        const k = `${key(p.text)}|${p.hint ?? ''}`
        expect(seen.has(k), `${c.name}: ${p.text}`).toBe(false)
        seen.add(k)
      }
    }
  })

  it('a text repeated across categories is always told apart by a hint', () => {
    const byText = new Map<string, typeof PROMPTS>()
    for (const p of PROMPTS) byText.set(key(p.text), [...(byText.get(key(p.text)) ?? []), p])
    const clashes: string[] = []
    for (const group of byText.values()) {
      const cats = new Set(group.map((p) => p.categoryId))
      if (cats.size < 2) continue
      const hints = group.map((p) => p.hint ?? '')
      if (new Set(hints).size !== hints.length) {
        clashes.push(group.map((p) => `${p.text} [${p.categoryId}: ${p.hint ?? 'no hint'}]`).join(' / '))
      }
    }
    expect(clashes).toEqual([])
  })

  it('shared titles stay rare (under 2% of the bank)', () => {
    const counts = new Map<string, number>()
    for (const p of PROMPTS) counts.set(key(p.text), (counts.get(key(p.text)) ?? 0) + 1)
    const shared = [...counts.values()].filter((n) => n > 1).length
    expect(shared / counts.size).toBeLessThan(0.02)
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

  it('every song (Zilipendwa, Bongo Flava, Throwback Hits and the rest) shows its artist as a hint', () => {
    // Owner rule (Stage 3A): Zilipendwa may also hold bands, legendary artists and dance styles,
    // so the old "every Zilipendwa prompt has a hint" rule now applies to songs only.
    expect(PROMPTS.filter((p) => p.kind === 'song' && !p.hint).map((p) => p.id)).toEqual([])
    expect(PROMPTS.filter((p) => p.categoryId === 'zilipendwa' && p.kind === 'song').length).toBeGreaterThanOrEqual(60)
  })

  it('Throwback Hits holds songs only', () => {
    expect(PROMPTS.filter((p) => p.categoryId === 'throwback-hits' && p.kind !== 'song').map((p) => p.id)).toEqual([])
  })
})

describe('second refinement — category restructure', () => {
  const inCat = (id: string) => PROMPTS.filter((p) => p.categoryId === id)
  const cat = (id: string) => CATEGORIES.find((c) => c.id === id)

  it('Countries & Places is now "Countries" and contains countries only', () => {
    expect(cat('countries')?.name).toBe('Countries')
    expect(CATEGORIES.find((c) => c.name === 'Countries & Places')).toBeUndefined()
    // Phase 5: the list grew to 120+ countries, so check the shape instead of a fixed list:
    // every prompt is a place, and none of them is also a city or a landmark in the game.
    const countries = inCat('countries')
    expect(countries.filter((p) => p.kind !== 'place').map((p) => p.text)).toEqual([])
    const elsewhere = new Set(
      [...inCat('african-cities'), ...inCat('famous-landmarks'), ...inCat('hii-dar-yetu')].map((p) => p.text),
    )
    expect(countries.filter((p) => elsewhere.has(p.text)).map((p) => p.text)).toEqual([])
    expect(countries.map((p) => p.text)).toEqual(
      expect.arrayContaining(['Tanzania', 'Kenya', 'Uganda', 'Rwanda', 'Japan', 'Japani', 'Brazil']),
    )
  })

  it('landmarks moved out of Countries into Famous Landmarks', () => {
    const texts = inCat('famous-landmarks').map((p) => p.text)
    expect(texts).toEqual(
      expect.arrayContaining(['Eiffel Tower', 'Mount Kilimanjaro', 'Pyramids of Giza', 'Taj Mahal']),
    )
  })

  it('new Classic categories exist with enough prompts', () => {
    for (const id of ['famous-landmarks', 'car-brands', 'famous-brands']) {
      expect(cat(id)?.group, id).toBe('c1')
      expect(inCat(id).length, id).toBeGreaterThanOrEqual(15)
    }
    expect(inCat('car-brands').map((p) => p.text)).toEqual(
      expect.arrayContaining(['Toyota', 'Mercedes-Benz', 'Lamborghini', 'Tesla']),
    )
    expect(inCat('famous-brands').map((p) => p.text)).toEqual(
      expect.arrayContaining(['Apple', 'Nike', 'Coca-Cola', "McDonald's"]),
    )
  })

  it('brands are not duplicated between Car Brands and Famous Brands', () => {
    const cars = new Set(inCat('car-brands').map((p) => p.text.toLowerCase()))
    expect(inCat('famous-brands').filter((p) => cars.has(p.text.toLowerCase()))).toEqual([])
  })

  it('African Music is renamed "African Music & Artists" and is not Tanzanian', () => {
    expect(cat('african-music')?.name).toBe('African Music & Artists')
    // The prompt and its MAIN artist must not be Tanzanian. A guest appearance is allowed
    // ("Yope" by Innoss'B ft. Diamond Platnumz is a Congolese song).
    const TZ = ['Diamond', 'Ali Kiba', 'Harmonize', 'Zuchu', 'Marioo', 'Nandy', 'Rayvanny', 'Mbosso', 'Taarab', 'Bongo Flava']
    const all = inCat('african-music').map((p) => `${p.text} ${(p.hint ?? '').split(/ ft\. | & /)[0]}`)
    expect(all.filter((t) => TZ.some((n) => t.includes(n)))).toEqual([])
  })
})
