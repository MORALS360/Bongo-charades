import { useCallback, useEffect, useMemo, useReducer } from 'react'
import {
  gameSessionReducer,
  getCurrentPrompt,
  getCurrentTeam,
  getNextTeam,
  getRoundSummary,
  initialGameSessionState,
  type GameConfig,
} from '../game/gameSession'
import { getFilteredPrompts } from '../data/prompts'
import type { GameplayAction } from '../types'

function newSeed(): number {
  return Math.floor(Math.random() * 2 ** 31)
}

/**
 * React wrapper around the game-session reducer (see `game/gameSession.ts`).
 * Screens call these named functions instead of changing game data directly.
 */
export function useGameSession() {
  const [state, dispatch] = useReducer(gameSessionReducer, initialGameSessionState)

  // Development only: expose the game state so automated browser tests can read scores
  useEffect(() => {
    if (import.meta.env.DEV) {
      ;(window as unknown as { __bongoGame?: unknown }).__bongoGame = state
    }
  }, [state])

  /** Returns false (and does not start) if no playable prompts match the setup. */
  const startGame = useCallback((config: GameConfig): boolean => {
    const seed = newSeed()
    const prompts = getFilteredPrompts(
      config.categoryIds,
      config.isFeelingLucky,
      config.promptLanguage,
      seed,
    )
    if (prompts.length === 0) return false
    dispatch({ type: 'START', config, prompts, seed })
    return true
  }, [])

  const beginCountdown = useCallback(() => dispatch({ type: 'BEGIN_COUNTDOWN' }), [])
  const beginRound = useCallback(() => dispatch({ type: 'BEGIN_ROUND' }), [])
  const answer = useCallback(
    (action: GameplayAction, promptId: string) => dispatch({ type: 'ANSWER', action, promptId }),
    [],
  )
  const timeUp = useCallback(() => dispatch({ type: 'TIME_UP' }), [])
  const nextTeam = useCallback(() => dispatch({ type: 'NEXT_TEAM' }), [])
  const restart = useCallback(() => dispatch({ type: 'RESTART', seed: newSeed() }), [])
  const exitGame = useCallback(() => dispatch({ type: 'EXIT' }), [])

  const derived = useMemo(
    () => ({
      currentPrompt: getCurrentPrompt(state),
      currentTeam: getCurrentTeam(state),
      upcomingTeam: getNextTeam(state),
      roundSummary: getRoundSummary(state),
      isActive: state.phase !== 'idle',
    }),
    [state],
  )

  return {
    state,
    ...derived,
    startGame,
    beginCountdown,
    beginRound,
    answer,
    timeUp,
    nextTeam,
    restart,
    exitGame,
  }
}

export type GameSessionController = ReturnType<typeof useGameSession>
