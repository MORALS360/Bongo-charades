import type { GamePrompt } from '../types'

/**
 * Prompt deck — pure helper functions (no React).
 *
 * Think of this like a real deck of cards:
 * 1. At the start of a game we shuffle every eligible prompt into a pile (`order`).
 * 2. Each time a prompt is needed we turn over the next card (`index + 1`).
 * 3. Only when the whole pile has been used do we reshuffle and start again,
 *    so no prompt repeats until every other prompt has been seen.
 *
 * Randomness comes from a *seeded* random-number generator. Given the same seed,
 * the shuffle is always the same. This keeps the game reducer "pure"
 * (same input → same output), which makes it safe in React and easy to test.
 */

export interface DeckState {
  /** Shuffled prompts for the current pass through the deck */
  order: GamePrompt[]
  /** Position of the prompt currently on screen (-1 = nothing drawn yet) */
  index: number
  /** Seed used for the next reshuffle */
  seed: number
  /** How many times the deck has been fully used and reshuffled */
  cycles: number
}

/** Small, fast, well-known seeded PRNG (mulberry32). Returns [value 0..1, nextSeed]. */
export function nextRandom(seed: number): [number, number] {
  const next = (seed + 0x6d2b79f5) | 0
  let t = next
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296
  return [value, next]
}

/** Fisher–Yates shuffle driven by the seeded generator. Returns [shuffled, nextSeed]. */
export function shuffleWithSeed<T>(items: readonly T[], seed: number): [T[], number] {
  const result = [...items]
  let s = seed
  for (let i = result.length - 1; i > 0; i--) {
    const [r, nextSeed] = nextRandom(s)
    s = nextSeed
    const j = Math.floor(r * (i + 1))
    const tmp = result[i]
    result[i] = result[j]
    result[j] = tmp
  }
  return [result, s]
}

/** Only keep prompts that can actually be displayed (no empty / undefined text). */
export function sanitizePrompts(prompts: readonly GamePrompt[]): GamePrompt[] {
  const seen = new Set<string>()
  return prompts.filter((p) => {
    if (!p || typeof p.text !== 'string' || p.text.trim().length === 0) return false
    if (seen.has(p.id)) return false
    seen.add(p.id)
    return true
  })
}

export function createDeck(prompts: readonly GamePrompt[], seed: number): DeckState {
  const [order, nextSeed] = shuffleWithSeed(sanitizePrompts(prompts), seed)
  return { order, index: -1, seed: nextSeed, cycles: 0 }
}

/** The prompt currently on screen, or null if none has been drawn / the deck is empty. */
export function currentPrompt(deck: DeckState): GamePrompt | null {
  if (deck.index < 0 || deck.index >= deck.order.length) return null
  return deck.order[deck.index] ?? null
}

/**
 * Turn over the next prompt. When the pile runs out, reshuffle it — making sure
 * the first card of the new pile is not the card that was just shown.
 */
export function drawNext(deck: DeckState): DeckState {
  if (deck.order.length === 0) return deck

  if (deck.index + 1 < deck.order.length) {
    return { ...deck, index: deck.index + 1 }
  }

  const last = currentPrompt(deck)
  const [reshuffled, nextSeed] = shuffleWithSeed(deck.order, deck.seed)
  if (last && reshuffled.length > 1 && reshuffled[0].id === last.id) {
    // Swap the first card away so the same prompt never appears twice in a row
    const tmp = reshuffled[0]
    reshuffled[0] = reshuffled[1]
    reshuffled[1] = tmp
  }
  return { order: reshuffled, index: 0, seed: nextSeed, cycles: deck.cycles + 1 }
}
