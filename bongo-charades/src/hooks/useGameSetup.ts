import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PromptLanguage, RoundDuration } from '../types'

/** Default Tanzanian team names, used in order as teams are added */
export const DEFAULT_TEAM_NAMES: readonly string[] = [
  'Wana Dar',
  'Simba Damu',
  'Team Chapchap',
  'Wajanja',
  'Mabingwa',
  'Wakali Wao',
  'Moto Moto',
  'Vijana Kazi',
]

export const MIN_TEAMS = 2
/** Upper limit keeps names readable on the results screen; raise if groups need more */
export const MAX_TEAMS = 8

const STORAGE_KEY = 'bongo_charades_game_setup'

export interface GameSetupController {
  durationSeconds: RoundDuration
  /** Number of teams (Teams mode) */
  teams: number
  /** Names of the teams that will play (length === teams) */
  teamNames: string[]
  activeTeamNames: string[]
  promptLanguage: PromptLanguage
  isTeamNamesValid: boolean
  emptyTeamIndices: number[]
  promptLanguageLabel: string
  canAddTeam: boolean
  canRemoveTeam: boolean
  setDurationSeconds: (duration: RoundDuration) => void
  addTeam: () => void
  removeTeam: (index: number) => void
  updateTeamName: (index: number, name: string) => void
  setPromptLanguage: (lang: PromptLanguage) => void
  resetToDefaults: () => void
}

interface StoredSetupState {
  durationSeconds?: RoundDuration
  teams?: number
  teamNames?: string[]
  promptLanguage?: PromptLanguage
}

function loadInitialSetup(): StoredSetupState {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as StoredSetupState
  } catch {
    return {}
  }
}

function saveSetup(state: StoredSetupState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore storage errors (private browsing quota, etc.)
  }
}

function isDuration(v: unknown): v is RoundDuration {
  return v === 30 || v === 60 || v === 90 || v === 120
}

function isLanguage(v: unknown): v is PromptLanguage {
  return v === 'en' || v === 'sw' || v === 'mixed'
}

/** Picks the first default name that isn't already used */
function nextDefaultName(existing: string[]): string {
  const used = new Set(existing.map((n) => n.trim().toLowerCase()))
  return (
    DEFAULT_TEAM_NAMES.find((n) => !used.has(n.toLowerCase())) ?? `Team ${existing.length + 1}`
  )
}

/**
 * Restores the saved team list. Older saves stored 4 names plus a separate count,
 * so we trim to the saved count; anything invalid falls back to 2 default teams.
 */
function initialTeamNames(stored: StoredSetupState): string[] {
  const names = Array.isArray(stored.teamNames)
    ? stored.teamNames.filter((n): n is string => typeof n === 'string')
    : []
  const count =
    typeof stored.teams === 'number' && stored.teams >= MIN_TEAMS && stored.teams <= MAX_TEAMS
      ? stored.teams
      : MIN_TEAMS
  const result = names.slice(0, count)
  while (result.length < count) result.push(nextDefaultName(result))
  return result
}

/**
 * Game configuration shared by both play modes:
 * - Round duration (30s, 60s default, 90s, 120s)
 * - Prompt language (English, Kiswahili, Mixed default)
 * - Teams mode only: a list of teams (2 by default; add/remove up to MAX_TEAMS)
 * Saved to localStorage so the next game starts with the same choices.
 */
export function useGameSetup(): GameSetupController {
  const initial = useMemo(() => loadInitialSetup(), [])

  const [durationSeconds, setDurationSecondsState] = useState<RoundDuration>(
    isDuration(initial.durationSeconds) ? initial.durationSeconds : 60,
  )
  const [teamNames, setTeamNames] = useState<string[]>(() => initialTeamNames(initial))
  const [promptLanguage, setPromptLanguageState] = useState<PromptLanguage>(
    isLanguage(initial.promptLanguage) ? initial.promptLanguage : 'mixed',
  )

  // Save whenever anything changes
  useEffect(() => {
    saveSetup({ durationSeconds, teams: teamNames.length, teamNames, promptLanguage })
  }, [durationSeconds, teamNames, promptLanguage])

  const addTeam = useCallback(() => {
    setTeamNames((prev) => (prev.length >= MAX_TEAMS ? prev : [...prev, nextDefaultName(prev)]))
  }, [])

  const removeTeam = useCallback((index: number) => {
    setTeamNames((prev) =>
      prev.length <= MIN_TEAMS ? prev : prev.filter((_, i) => i !== index),
    )
  }, [])

  const updateTeamName = useCallback((index: number, name: string) => {
    setTeamNames((prev) => prev.map((n, i) => (i === index ? name : n)))
  }, [])

  const resetToDefaults = useCallback(() => {
    setDurationSecondsState(60)
    setTeamNames(DEFAULT_TEAM_NAMES.slice(0, MIN_TEAMS))
    setPromptLanguageState('mixed')
  }, [])

  const emptyTeamIndices = useMemo(
    () =>
      teamNames.flatMap((n, i) => (n.trim().length === 0 ? [i] : [])),
    [teamNames],
  )

  const promptLanguageLabel = useMemo(() => {
    switch (promptLanguage) {
      case 'en':
        return 'English'
      case 'sw':
        return 'Kiswahili'
      case 'mixed':
        return 'Mixed (English + Kiswahili)'
    }
  }, [promptLanguage])

  return {
    durationSeconds,
    teams: teamNames.length,
    teamNames,
    activeTeamNames: teamNames,
    promptLanguage,
    isTeamNamesValid: emptyTeamIndices.length === 0,
    emptyTeamIndices,
    promptLanguageLabel,
    canAddTeam: teamNames.length < MAX_TEAMS,
    canRemoveTeam: teamNames.length > MIN_TEAMS,
    setDurationSeconds: setDurationSecondsState,
    addTeam,
    removeTeam,
    updateTeamName,
    setPromptLanguage: setPromptLanguageState,
    resetToDefaults,
  }
}
