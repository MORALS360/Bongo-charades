import type {
  CategoryIconId,
  GamePrompt,
  GameplayAction,
  PlayedPromptRecord,
  PlayMode,
  PromptLanguage,
  RoundDuration,
} from '../types'
import { createDeck, currentPrompt, drawNext, type DeckState } from './promptDeck'

/**
 * Game session — the single "source of truth" for a game in progress.
 *
 * This file is a *reducer*: a plain function that takes the current game state
 * plus an action ("a team got one correct", "time is up") and returns the new
 * state. It has no timers, no sounds and no screen code, which means:
 *  - every rule of the game lives in one place,
 *  - it can be tested automatically without a browser,
 *  - duplicate or late events can be safely ignored here.
 *
 * Game flow (phase by phase):
 *
 *   idle ──START──▶ ready ──BEGIN_COUNTDOWN──▶ countdown ──BEGIN_ROUND──▶ playing
 *                     ▲                                                     │
 *                     │ NEXT_TEAM                                     TIME_UP│
 *                     │                                                     ▼
 *                 roundOver ◀──────────── (more teams left) ──────────── [round ends]
 *                                         (last team played) ──────────▶ finished
 */

export type GamePhase = 'idle' | 'ready' | 'countdown' | 'playing' | 'roundOver' | 'finished'

export interface GameConfig {
  /**
   * 'quick' = Quick Play: one shared score, one round, no teams.
   * 'teams' = each team plays one round in turn.
   * Both modes use exactly the same rules below — Quick Play is simply a game
   * with a single participant, so there is no duplicated gameplay logic.
   */
  mode: PlayMode
  /** Teams mode: the team names. Quick Play: ignored (one participant is created). */
  teamNames: string[]
  categoryIds: CategoryIconId[]
  isFeelingLucky: boolean
  promptLanguage: PromptLanguage
  durationSeconds: RoundDuration
}

export interface TeamState {
  name: string
  score: number
  correctCount: number
  passedCount: number
}

export interface GameSessionState {
  phase: GamePhase
  config: GameConfig | null
  /** Prompts eligible for this game (kept so Play Again can rebuild the deck) */
  promptPool: GamePrompt[]
  teams: TeamState[]
  currentTeamIndex: number
  /** Increments every time a round starts — used to reset round timers */
  roundNumber: number
  deck: DeckState
  /** What happened during the current (or just-finished) round */
  roundRecords: PlayedPromptRecord[]
}

export type GameSessionAction =
  | { type: 'START'; config: GameConfig; prompts: GamePrompt[]; seed: number }
  | { type: 'BEGIN_COUNTDOWN' }
  | { type: 'BEGIN_ROUND' }
  | { type: 'ANSWER'; action: GameplayAction; promptId: string }
  | { type: 'TIME_UP' }
  | { type: 'NEXT_TEAM' }
  | { type: 'RESTART'; seed: number }
  | { type: 'EXIT' }

/** Name used for the single participant in Quick Play */
export const QUICK_PLAY_NAME = 'Quick Play'

export const initialGameSessionState: GameSessionState = {
  phase: 'idle',
  config: null,
  promptPool: [],
  teams: [],
  currentTeamIndex: 0,
  roundNumber: 0,
  deck: { order: [], index: -1, seed: 1, cycles: 0 },
  roundRecords: [],
}

function freshTeams(names: string[]): TeamState[] {
  return names.map((name) => ({ name, score: 0, correctCount: 0, passedCount: 0 }))
}

export function gameSessionReducer(
  state: GameSessionState,
  event: GameSessionAction,
): GameSessionState {
  switch (event.type) {
    case 'START': {
      const names =
        event.config.mode === 'quick'
          ? [QUICK_PLAY_NAME]
          : event.config.teamNames.map((n) => n.trim()).filter((n) => n.length > 0)
      if (names.length < 1) return state
      if (event.config.mode === 'teams' && names.length < 2) return state
      const deck = createDeck(event.prompts, event.seed)
      if (deck.order.length === 0) return state // nothing playable — stay idle
      return {
        phase: 'ready',
        config: { ...event.config, teamNames: names },
        promptPool: event.prompts,
        teams: freshTeams(names),
        currentTeamIndex: 0,
        roundNumber: 0,
        deck,
        roundRecords: [],
      }
    }

    case 'BEGIN_COUNTDOWN':
      if (state.phase !== 'ready') return state
      return { ...state, phase: 'countdown' }

    case 'BEGIN_ROUND':
      if (state.phase !== 'countdown') return state
      return {
        ...state,
        phase: 'playing',
        roundNumber: state.roundNumber + 1,
        roundRecords: [],
        deck: drawNext(state.deck),
      }

    case 'ANSWER': {
      // Guard 1: only accept answers while a round is running (not after time is up)
      if (state.phase !== 'playing') return state
      const prompt = currentPrompt(state.deck)
      // Guard 2: the answer must be for the prompt on screen. A second, duplicate
      // event for the same prompt arrives after the prompt has changed and is ignored.
      if (!prompt || prompt.id !== event.promptId) return state

      const teams = state.teams.map((team, i) => {
        if (i !== state.currentTeamIndex) return team
        return event.action === 'correct'
          ? { ...team, score: team.score + 1, correctCount: team.correctCount + 1 }
          : { ...team, passedCount: team.passedCount + 1 }
      })

      return {
        ...state,
        teams,
        roundRecords: [...state.roundRecords, { prompt, outcome: event.action }],
        deck: drawNext(state.deck),
      }
    }

    case 'TIME_UP': {
      if (state.phase !== 'playing') return state
      const isLastTeam = state.currentTeamIndex >= state.teams.length - 1
      return { ...state, phase: isLastTeam ? 'finished' : 'roundOver' }
    }

    case 'NEXT_TEAM':
      if (state.phase !== 'roundOver') return state
      return {
        ...state,
        phase: 'ready',
        currentTeamIndex: state.currentTeamIndex + 1,
        roundRecords: [],
      }

    case 'RESTART': {
      if (!state.config) return state
      return gameSessionReducer(initialGameSessionState, {
        type: 'START',
        config: state.config,
        prompts: state.promptPool,
        seed: event.seed,
      })
    }

    case 'EXIT':
      return initialGameSessionState

    default:
      return state
  }
}

/* ---------- Small read-only helpers used by screens ---------- */

export function getCurrentPrompt(state: GameSessionState): GamePrompt | null {
  return state.phase === 'playing' ? currentPrompt(state.deck) : null
}

export function getCurrentTeam(state: GameSessionState): TeamState | null {
  return state.teams[state.currentTeamIndex] ?? null
}

export function getNextTeam(state: GameSessionState): TeamState | null {
  return state.teams[state.currentTeamIndex + 1] ?? null
}

export interface RoundSummary {
  correctCount: number
  passedCount: number
}

export function getRoundSummary(state: GameSessionState): RoundSummary {
  let correctCount = 0
  let passedCount = 0
  for (const r of state.roundRecords) {
    if (r.outcome === 'correct') correctCount++
    else passedCount++
  }
  return { correctCount, passedCount }
}

export interface RankedTeam extends TeamState {
  /** Competition ranking: tied teams share a rank (1, 1, 3 …) */
  rank: number
}

export function rankTeams(teams: readonly TeamState[]): RankedTeam[] {
  const sorted = teams
    .map((team, originalIndex) => ({ team, originalIndex }))
    // Highest score first; equal scores keep the order teams played in
    .sort((a, b) => b.team.score - a.team.score || a.originalIndex - b.originalIndex)

  return sorted.map(({ team }, i) => {
    const firstWithScore = sorted.findIndex((s) => s.team.score === team.score)
    return { ...team, rank: i === 0 ? 1 : firstWithScore + 1 }
  })
}
