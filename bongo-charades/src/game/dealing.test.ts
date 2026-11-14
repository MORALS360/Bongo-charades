import { describe, expect, it } from 'vitest'
import type { GamePrompt } from '../types'
import { DEALING } from '../config/dealing'
import { getFilteredPrompts } from '../data/prompts'
import { artistKey, balanceOrder, countViolations, dealOrder, pileContext } from './dealing'
import { historyKey } from './playHistory'
import { createDeck, drawNext, shuffleWithSeed } from './promptDeck'
import { gameSessionReducer, initialGameSessionState, type GameConfig } from './gameSession'

const ids = (ps: readonly GamePrompt[]) => ps.map((p) => p.id)

/** Count places in an order where a balance rule is broken */
function violations(order: readonly GamePrompt[]): number {
  const ctx = pileContext(order)
  let n = 0
  for (let i = 0; i < order.length; i++) n += countViolations(order[i], order.slice(0, i), ctx) > 0 ? 1 : 0
  return n
}

describe('dealing — fresh shuffle every game', () => {
  const pool = getFilteredPrompts(['animals', 'bongo-flava', 'countries'], false, 'mixed', 3)

  it('keeps every prompt exactly once (nothing lost, nothing added)', () => {
    const [order] = dealOrder(pool, 42)
    expect(order).toHaveLength(pool.length)
    expect(new Set(ids(order))).toEqual(new Set(ids(pool)))
  })

  it('different seeds give different games; the same seed gives the same game', () => {
    expect(ids(dealOrder(pool, 1)[0])).not.toEqual(ids(dealOrder(pool, 2)[0]))
    expect(ids(dealOrder(pool, 7)[0])).toEqual(ids(dealOrder(pool, 7)[0]))
  })

  it('every prompt has a fair chance to come first (no prompt is stuck at the top)', () => {
    const small = pool.slice(0, 10)
    const firsts = new Map<string, number>()
    for (let seed = 1; seed <= 2000; seed++) {
      const id = dealOrder(small, seed * 7919)[0][0].id
      firsts.set(id, (firsts.get(id) ?? 0) + 1)
    }
    expect(firsts.size).toBe(10)
    for (const count of firsts.values()) {
      // Fair share is 200 of 2000; balancing nudges this a little, so allow a wide band
      expect(count).toBeGreaterThan(80)
      expect(count).toBeLessThan(400)
    }
  })
})

describe('dealing — balance (no clumps)', () => {
  it('reads the main artist from a song hint, and a person from their name', () => {
    const song = { id: 's', text: 'Tetema', categoryId: 'bongo-flava', language: 'mixed', kind: 'song', hint: 'Rayvanny ft. Diamond Platnumz' } as GamePrompt
    const person = { id: 'p', text: 'Rayvanny', categoryId: 'bongo-flava', language: 'mixed', kind: 'person' } as GamePrompt
    expect(artistKey(song)).toBe('rayvanny')
    expect(artistKey(person)).toBe('rayvanny')
  })

  it('Bongo Flava: no three songs in a row and no artist twice within six prompts, almost always', () => {
    const pool = getFilteredPrompts(['bongo-flava'], false, 'mixed', 1)
    let broken = 0
    let total = 0
    for (let seed = 1; seed <= 20; seed++) {
      const [order] = dealOrder(pool, seed * 104729)
      // The first 40 cards are what a game actually uses; check them strictly
      broken += violations(order.slice(0, 40))
      total += 40
    }
    expect(broken / total).toBeLessThan(0.02)
  })

  it('Feeling Lucky: categories, kinds and difficulty are spread out', () => {
    const pool = getFilteredPrompts([], true, 'mixed', 1)
    const [order] = dealOrder(pool, 99)
    expect(violations(order.slice(0, 200))).toBe(0)
  })

  it('balancing breaks clumps that a plain shuffle leaves in (every category)', () => {
    let plain = 0
    let balanced = 0
    for (const id of ['zilipendwa', 'african-music', 'movies-tv', 'mpira-mashabiki', 'food-drinks'] as const) {
      const pool = getFilteredPrompts([id], false, 'mixed', 1)
      for (let seed = 1; seed <= 10; seed++) {
        const [shuffled] = shuffleWithSeed(pool, seed * 31337)
        plain += violations(shuffled.slice(0, 40))
        balanced += violations(balanceOrder(shuffled).slice(0, 40))
      }
    }
    expect(balanced).toBeLessThan(plain / 10)
  })

  it('never gets stuck when a rule cannot be met (e.g. a pile of only songs)', () => {
    const onlySongs = getFilteredPrompts(['throwback-hits'], false, 'mixed', 1)
    const order = balanceOrder(onlySongs)
    expect(order).toHaveLength(onlySongs.length)
  })
})

describe('dealing — fresh prompts before recently played ones', () => {
  const pool = getFilteredPrompts(['animals'], false, 'en', 1)

  it('ideas shown in earlier games come after every fresh one', () => {
    const recent = pool.slice(0, 30).map(historyKey)
    const [order] = dealOrder(pool, 5, recent)
    const firstRecent = order.findIndex((p) => recent.includes(historyKey(p)))
    expect(firstRecent).toBe(pool.length - 30)
  })

  it('relaxes gracefully: if everything was played recently, the OLDEST come back first', () => {
    const recent = pool.map(historyKey) // oldest first
    const [order] = dealOrder(pool, 5, recent)
    expect(order).toHaveLength(pool.length)
    const firstTen = order.slice(0, 10).map((p) => recent.indexOf(historyKey(p)))
    // Balancing may swap a few neighbours, but the first cards all come from the oldest part
    expect(Math.max(...firstTen)).toBeLessThan(pool.length / 4)
  })

  it('switching language does not bring an idea straight back ("Lion" played → "Simba" waits)', () => {
    const en = getFilteredPrompts(['animals'], false, 'en', 1)
    const sw = getFilteredPrompts(['animals'], false, 'sw', 1)
    const lion = en.find((p) => p.text === 'Lion')!
    const [order] = dealOrder(sw, 3, [historyKey(lion)])
    expect(order[order.length - 1].text).toBe('Simba')
  })

  it('the history window is configurable', () => {
    expect(DEALING.recentHistorySize).toBeGreaterThan(0)
  })
})

describe('dealing — inside one game', () => {
  const config: GameConfig = {
    mode: 'teams',
    teamNames: ['A', 'B', 'C'],
    categoryIds: ['bongo-flava', 'zilipendwa'],
    isFeelingLucky: false,
    promptLanguage: 'mixed',
    durationSeconds: 60,
  }

  it('teams share one pile: no prompt repeats across teams until the pile is used up', () => {
    const prompts = getFilteredPrompts(config.categoryIds, false, 'mixed', 1)
    let s = gameSessionReducer(initialGameSessionState, { type: 'START', config, prompts, seed: 11 })
    const seen: string[] = []
    for (let team = 0; team < 3; team++) {
      s = gameSessionReducer(s, { type: 'BEGIN_COUNTDOWN' })
      s = gameSessionReducer(s, { type: 'BEGIN_ROUND' })
      for (let i = 0; i < 30; i++) {
        const id = s.deck.order[s.deck.index].id
        seen.push(id)
        s = gameSessionReducer(s, { type: 'ANSWER', action: 'correct', promptId: id })
      }
      s = gameSessionReducer(s, { type: 'TIME_UP' })
      if (team < 2) s = gameSessionReducer(s, { type: 'NEXT_TEAM' })
    }
    expect(new Set(seen).size).toBe(seen.length)
  })

  it('START uses the phone history: recently played ideas are not dealt first', () => {
    const prompts = getFilteredPrompts(['animals'], false, 'en', 1)
    const recent = prompts.slice(0, 50).map(historyKey)
    const s = gameSessionReducer(initialGameSessionState, {
      type: 'START',
      config: { ...config, mode: 'quick', categoryIds: ['animals'] },
      prompts,
      seed: 4,
      recentKeys: recent,
    })
    const first = s.deck.order.slice(0, prompts.length - 50)
    expect(first.some((p) => recent.includes(historyKey(p)))).toBe(false)
  })

  it('after the pile runs out, the reshuffled pile is balanced and never repeats the last card', () => {
    const prompts = getFilteredPrompts(['bongo-flava'], false, 'mixed', 1)
    let deck = createDeck(prompts, 8)
    for (let i = 0; i < prompts.length; i++) deck = drawNext(deck)
    const last = deck.order[deck.index]
    deck = drawNext(deck)
    expect(deck.cycles).toBe(1)
    expect(deck.order[0].id).not.toBe(last.id)
    expect(violations(deck.order.slice(0, 40)) / 40).toBeLessThan(0.05)
  })
})
