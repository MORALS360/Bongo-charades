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

  it('29 categories: Vijiweni is gone, Zilipendwa exists (previous restructure intact)', () => {
    expect(CATEGORIES).toHaveLength(29)
    expect(CATEGORIES.find((c) => /vijiweni/i.test(c.name))).toBeUndefined()
    expect(CATEGORIES.find((c) => c.id === 'zilipendwa')?.group).toBe('c2')
    const mtaani = PROMPTS.filter((p) => p.categoryId === 'mtaani').map((p) => p.text)
    expect(mtaani).toEqual(expect.arrayContaining(['Kijiweni', 'Kahawa na Kashata', 'Bao']))
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

describe('second refinement — category restructure', () => {
  const inCat = (id: string) => PROMPTS.filter((p) => p.categoryId === id)
  const cat = (id: string) => CATEGORIES.find((c) => c.id === id)

  it('Countries & Places is now "Countries" and contains countries only', () => {
    expect(cat('countries')?.name).toBe('Countries')
    expect(CATEGORIES.find((c) => c.name === 'Countries & Places')).toBeUndefined()
    const COUNTRY_NAMES = new Set([
      'Tanzania', 'Kenya', 'Nigeria', 'Ghana', 'Australia', 'Argentina', 'Jamaica', 'India',
      'Japan', 'Japani', 'Brazil', 'Brazili', 'France', 'Ufaransa', 'Canada', 'Kanada',
      'China', 'Uchina', 'Egypt', 'Misri', 'America', 'Marekani', 'Germany', 'Ujerumani',
      'Italy', 'Italia', 'Spain', 'Hispania', 'Mexico', 'Meksiko', 'Russia', 'Urusi',
      'England', 'Uingereza', 'South Africa', 'Afrika Kusini', 'Portugal', 'Ureno',
      'Greece', 'Ugiriki',
    ])
    expect(inCat('countries').filter((p) => !COUNTRY_NAMES.has(p.text)).map((p) => p.text)).toEqual([])
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
    const TZ = ['Diamond', 'Ali Kiba', 'Harmonize', 'Zuchu', 'Marioo', 'Nandy', 'Rayvanny', 'Mbosso', 'Taarab', 'Bongo']
    const all = inCat('african-music').map((p) => `${p.text} ${p.hint ?? ''}`)
    expect(all.filter((t) => TZ.some((n) => t.includes(n)))).toEqual([])
  })
})
