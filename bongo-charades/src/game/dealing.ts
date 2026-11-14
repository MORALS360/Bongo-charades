import type { GamePrompt } from '../types'
import { DEALING, type DealingConfig } from '../config/dealing'
import { historyKey } from './playHistory'
import { shuffleWithSeed } from './promptDeck'

/**
 * Dealing — decides the ORDER prompts come out in. Pure functions, no React.
 *
 * Step 1  Fisher–Yates shuffle with a fresh seed every game (so no two games match).
 * Step 2  Fresh prompts first: ideas this phone has NOT shown recently go to the top
 *         of the pile; recently shown ones go underneath, oldest first. Nothing is
 *         removed, so a small category never runs dry — it just repeats the oldest
 *         prompts last ("graceful relaxation").
 * Step 3  Balance: walk through the shuffled pile and, when the next card would
 *         create a cluster (three songs in a row, the same artist twice close
 *         together, three 1990s songs in a row, three hard prompts in a row, or
 *         three from one category when several were chosen), look a few cards
 *         further down for one that fits. The pile stays random; only clumps are
 *         broken up.
 */

/** Main artist of a song ("Diamond Platnumz ft. Rayvanny" → "diamond platnumz"), or a person's name. */
export function artistKey(p: GamePrompt): string | null {
  if (p.kind === 'song' && p.hint) {
    return p.hint.split(/\s+(?:ft\.|feat\.|&|x)\s+/i)[0].trim().toLowerCase() || null
  }
  if (p.kind === 'person') return p.text.trim().toLowerCase()
  return null
}

function sameRun<T>(recent: readonly GamePrompt[], n: number, value: T, get: (p: GamePrompt) => T) {
  if (n <= 0 || recent.length < n) return false
  for (let i = recent.length - n; i < recent.length; i++) {
    if (get(recent[i]) !== value) return false
  }
  return true
}

/** Facts about the whole pile that decide which rules make sense for it. */
export interface PileContext {
  /** Several categories chosen → spread them out */
  multiCategory: boolean
  /**
   * Kinds the "not too many in a row" rule applies to. A kind that makes up most of
   * the pile (every Animals prompt is a "thing", most Bongo Flava prompts are songs)
   * cannot be kept apart, so the rule is only used for kinds that are a minority.
   */
  limitedKinds: ReadonlySet<string>
  /** Same idea for hard prompts: only spread them out when they are a minority */
  limitHard: boolean
}

/** A kind counts as a minority when it is at most this share of the pile. */
const MINORITY_SHARE = 0.6

export function pileContext(pile: readonly GamePrompt[]): PileContext {
  const kinds = new Map<string, number>()
  let hard = 0
  for (const p of pile) {
    if (p.kind) kinds.set(p.kind, (kinds.get(p.kind) ?? 0) + 1)
    if (p.difficulty === 'hard') hard++
  }
  const n = Math.max(1, pile.length)
  return {
    multiCategory: new Set(pile.map((p) => p.categoryId)).size > 1,
    limitedKinds: new Set([...kinds].filter(([, c]) => c / n <= MINORITY_SHARE).map(([k]) => k)),
    limitHard: hard / n <= MINORITY_SHARE,
  }
}

/** How many balance rules `candidate` would break if dealt after `dealt`. 0 = fits. */
export function countViolations(
  candidate: GamePrompt,
  dealt: readonly GamePrompt[],
  ctx: PileContext,
  config: DealingConfig = DEALING,
): number {
  const { multiCategory } = ctx
  let v = 0
  if (
    candidate.kind &&
    ctx.limitedKinds.has(candidate.kind) &&
    sameRun(dealt, config.maxSameKindInARow, candidate.kind, (p) => p.kind)
  )
    v++
  if (candidate.era && sameRun(dealt, config.maxSameEraInARow, candidate.era, (p) => p.era)) v++
  if (ctx.limitHard && candidate.difficulty === 'hard' && sameRun(dealt, config.maxHardInARow, 'hard', (p) => p.difficulty)) v++
  if (multiCategory && sameRun(dealt, config.maxSameCategoryInARow, candidate.categoryId, (p) => p.categoryId)) v++
  const artist = artistKey(candidate)
  if (artist) {
    const from = Math.max(0, dealt.length - config.artistGap)
    for (let i = from; i < dealt.length; i++) {
      if (artistKey(dealt[i]) === artist) {
        v++
        break
      }
    }
  }
  return v
}

/**
 * Break up clusters in an already-shuffled list without losing randomness.
 * `before` = prompts already dealt just before this list (so a reshuffle joins smoothly).
 */
export function balanceOrder(
  shuffled: readonly GamePrompt[],
  config: DealingConfig = DEALING,
  before: readonly GamePrompt[] = [],
): GamePrompt[] {
  const ctx = pileContext(shuffled)
  const pool = [...shuffled]
  const dealt: GamePrompt[] = [...before]
  const start = dealt.length
  while (pool.length > 0) {
    const limit = Math.min(Math.max(1, config.lookahead), pool.length)
    let pick = 0
    let best = Number.POSITIVE_INFINITY
    for (let i = 0; i < limit; i++) {
      const v = countViolations(pool[i], dealt, ctx, config)
      if (v < best) {
        best = v
        pick = i
        if (v === 0) break
      }
    }
    dealt.push(pool.splice(pick, 1)[0])
  }
  return dealt.slice(start)
}

/**
 * The full order for a new game: shuffled, fresh ideas first, recently played last
 * (oldest first), each part balanced. Returns [order, nextSeed].
 */
export function dealOrder(
  prompts: readonly GamePrompt[],
  seed: number,
  recentKeys: readonly string[] = [],
  config: DealingConfig = DEALING,
): [GamePrompt[], number] {
  const [shuffled, nextSeed] = shuffleWithSeed(prompts, seed)
  if (recentKeys.length === 0) return [balanceOrder(shuffled, config), nextSeed]

  const age = new Map<string, number>()
  recentKeys.forEach((k, i) => age.set(k, i)) // smaller = played longer ago
  const fresh: GamePrompt[] = []
  const recent: GamePrompt[] = []
  for (const p of shuffled) (age.has(historyKey(p)) ? recent : fresh).push(p)
  // Stable sort keeps the random order among prompts of equal age
  recent.sort((a, b) => (age.get(historyKey(a)) ?? 0) - (age.get(historyKey(b)) ?? 0))

  const freshOrder = balanceOrder(fresh, config)
  return [[...freshOrder, ...balanceOrder(recent, config, freshOrder.slice(-config.artistGap))], nextSeed]
}
