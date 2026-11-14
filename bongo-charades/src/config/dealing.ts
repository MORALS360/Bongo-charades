/**
 * Bongo Charades — how prompts are dealt, all in ONE place.
 *
 * Change these numbers after real play-testing; nothing else needs editing.
 */
export interface DealingConfig {
  /**
   * How many recently played prompt ideas the phone remembers between games.
   * Prompts in this list are dealt only AFTER every fresh prompt in the chosen
   * categories has been used, so nothing is ever blocked — they just come later.
   */
  recentHistorySize: number
  /**
   * When the next card in the shuffled pile would break a balance rule, look this
   * many cards further down for one that fits. Bigger = more even, but less random.
   */
  lookahead: number
  /**
   * Never deal more than this many prompts of the same kind in a row (e.g. 2 people).
   * Only used for kinds that are a minority of the pile; see `pileContext` in game/dealing.ts.
   */
  maxSameKindInARow: number
  /** The same artist may not come back within this many prompts. */
  artistGap: number
  /** Never deal more than this many prompts from the same decade in a row. */
  maxSameEraInARow: number
  /** Never deal more than this many "hard" prompts in a row. */
  maxHardInARow: number
  /** With several categories chosen, never deal more than this many from one category in a row. */
  maxSameCategoryInARow: number
}

export const DEALING: DealingConfig = {
  recentHistorySize: 600,
  lookahead: 20,
  maxSameKindInARow: 2,
  artistGap: 6,
  maxSameEraInARow: 2,
  maxHardInARow: 2,
  maxSameCategoryInARow: 2,
}
