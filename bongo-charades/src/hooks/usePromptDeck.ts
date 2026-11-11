import { useCallback, useEffect, useRef, useState } from 'react'
import type { CategoryIconId, GamePrompt, PromptLanguage } from '../types'
import { getFilteredPrompts } from '../data/prompts'

interface UsePromptDeckOptions {
  categoryIds: CategoryIconId[]
  isFeelingLucky: boolean
  promptLanguage: PromptLanguage
}

/**
 * Modern Fisher-Yates shuffle algorithm.
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]
    shuffled[i] = shuffled[j]
    shuffled[j] = temp
  }
  return shuffled
}

/**
 * Hook providing a shuffled, non-repeating prompt deck for the game session.
 * Guarantees that:
 * 1. Prompts are drawn only from selected categories (or all 26 if lucky).
 * 2. Language selection ('en' | 'sw' | 'mixed') is strictly respected.
 * 3. Prompts do not repeat within a session until the deck is fully exhausted.
 * 4. Never returns undefined/empty text.
 */
export function usePromptDeck({
  categoryIds,
  isFeelingLucky,
  promptLanguage,
}: UsePromptDeckOptions) {
  // Store the active shuffled deck and the current pointer
  const [deck, setDeck] = useState<GamePrompt[]>([])
  const [deckIndex, setDeckIndex] = useState(0)
  const [currentPrompt, setCurrentPrompt] = useState<GamePrompt | null>(null)

  // Track session-used prompt IDs to prevent immediate repeats across team turns
  const usedPromptIdsRef = useRef<Set<string>>(new Set())

  // Initialize or re-filter the deck when configuration changes
  const initDeck = useCallback(() => {
    const available = getFilteredPrompts(categoryIds, isFeelingLucky, promptLanguage)
    const shuffled = shuffleArray(available)
    setDeck(shuffled)
    setDeckIndex(0)
    usedPromptIdsRef.current.clear()

    if (shuffled.length > 0) {
      setCurrentPrompt(shuffled[0])
      usedPromptIdsRef.current.add(shuffled[0].id)
    }
  }, [categoryIds, isFeelingLucky, promptLanguage])

  // Re-initialize whenever options change
  useEffect(() => {
    initDeck()
  }, [initDeck])

  /**
   * Advance to the next prompt, reshuffling if exhausted without repetition.
   */
  const nextPrompt = useCallback((): GamePrompt => {
    setDeck((prevDeck) => {
      let pool = prevDeck

      // If pool is empty or index reaches end, reshuffle from source
      if (pool.length === 0 || deckIndex + 1 >= pool.length) {
        const available = getFilteredPrompts(categoryIds, isFeelingLucky, promptLanguage)
        // Filter out already used IDs if possible to avoid repeats
        const unused = available.filter((p) => !usedPromptIdsRef.current.has(p.id))

        if (unused.length > 0) {
          pool = shuffleArray(unused)
        } else {
          // Deck exhausted in this session: reset used IDs and reshuffle all
          usedPromptIdsRef.current.clear()
          pool = shuffleArray(available)
        }
        setDeckIndex(0)
      } else {
        setDeckIndex((prev) => prev + 1)
      }

      const next = pool[deckIndex + 1] ?? pool[0]
      if (next) {
        usedPromptIdsRef.current.add(next.id)
        setCurrentPrompt(next)
      }
      return pool
    })

    // Return the prompt guaranteed not to be null
    return (
      currentPrompt ?? {
        id: 'fallback-prompt',
        text: 'Bongo Charades',
        categoryId: 'bongo-flava',
        language: 'mixed',
      }
    )
  }, [categoryIds, isFeelingLucky, promptLanguage, deckIndex, currentPrompt])

  return {
    currentPrompt,
    nextPrompt,
    resetDeck: initDeck,
    totalAvailablePrompts: deck.length,
  }
}
