import { useCallback, useMemo, useState } from 'react'
import type { PromptLanguage, RoundDuration, TeamCount } from '../types'

export const DEFAULT_TEAM_NAMES: readonly string[] = [
  'Wana Dar',
  'Simba Damu',
  'Team Chapchap',
  'Wajanja',
]

const STORAGE_KEY = 'bongo_charades_game_setup'

export interface GameSetupController {
  durationSeconds: RoundDuration
  teams: TeamCount
  teamNames: string[]
  activeTeamNames: string[]
  promptLanguage: PromptLanguage
  isTeamNamesValid: boolean
  emptyTeamIndices: number[]
  promptLanguageLabel: string
  setDurationSeconds: (duration: RoundDuration) => void
  setTeams: (teams: TeamCount) => void
  updateTeamName: (index: number, name: string) => void
  setPromptLanguage: (lang: PromptLanguage) => void
  resetToDefaults: () => void
}

interface StoredSetupState {
  durationSeconds?: RoundDuration
  teams?: TeamCount
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

/**
 * Manages game configuration state for the Game Setup screen:
 * - Round duration (30s, 60s default, 90s, 120s)
 * - Teams (2 default, 3, 4) with authentic editable Tanzanian default names
 * - Prompt language (English, Kiswahili, Mixed default)
 * - Validation & persistence across sessions
 */
export function useGameSetup(): GameSetupController {
  const initial = useMemo(() => loadInitialSetup(), [])

  const [durationSeconds, setDurationSecondsState] = useState<RoundDuration>(
    initial.durationSeconds === 30 ||
      initial.durationSeconds === 60 ||
      initial.durationSeconds === 90 ||
      initial.durationSeconds === 120
      ? initial.durationSeconds
      : 60,
  )

  const [teams, setTeamsState] = useState<TeamCount>(
    initial.teams === 2 || initial.teams === 3 || initial.teams === 4
      ? initial.teams
      : 2,
  )

  const [teamNames, setTeamNamesState] = useState<string[]>(() => {
    if (Array.isArray(initial.teamNames) && initial.teamNames.length >= 4) {
      return initial.teamNames.slice(0, 4)
    }
    return [...DEFAULT_TEAM_NAMES]
  })

  const [promptLanguage, setPromptLanguageState] = useState<PromptLanguage>(
    initial.promptLanguage === 'en' ||
      initial.promptLanguage === 'sw' ||
      initial.promptLanguage === 'mixed'
      ? initial.promptLanguage
      : 'mixed',
  )

  const persist = useCallback(
    (
      newDuration: RoundDuration,
      newTeams: TeamCount,
      newNames: string[],
      newLang: PromptLanguage,
    ) => {
      saveSetup({
        durationSeconds: newDuration,
        teams: newTeams,
        teamNames: newNames,
        promptLanguage: newLang,
      })
    },
    [],
  )

  const setDurationSeconds = useCallback(
    (d: RoundDuration) => {
      setDurationSecondsState(d)
      persist(d, teams, teamNames, promptLanguage)
    },
    [persist, teams, teamNames, promptLanguage],
  )

  const setTeams = useCallback(
    (t: TeamCount) => {
      setTeamsState(t)
      persist(durationSeconds, t, teamNames, promptLanguage)
    },
    [persist, durationSeconds, teamNames, promptLanguage],
  )

  const updateTeamName = useCallback(
    (index: number, name: string) => {
      setTeamNamesState((prev) => {
        const next = [...prev]
        next[index] = name
        persist(durationSeconds, teams, next, promptLanguage)
        return next
      })
    },
    [persist, durationSeconds, teams, promptLanguage],
  )

  const setPromptLanguage = useCallback(
    (l: PromptLanguage) => {
      setPromptLanguageState(l)
      persist(durationSeconds, teams, teamNames, l)
    },
    [persist, durationSeconds, teams, teamNames],
  )

  const resetToDefaults = useCallback(() => {
    const defaultDuration: RoundDuration = 60
    const defaultTeams: TeamCount = 2
    const defaultNames = [...DEFAULT_TEAM_NAMES]
    const defaultLang: PromptLanguage = 'mixed'

    setDurationSecondsState(defaultDuration)
    setTeamsState(defaultTeams)
    setTeamNamesState(defaultNames)
    setPromptLanguageState(defaultLang)
    persist(defaultDuration, defaultTeams, defaultNames, defaultLang)
  }, [persist])

  const activeTeamNames = useMemo(
    () => teamNames.slice(0, teams),
    [teamNames, teams],
  )

  const emptyTeamIndices = useMemo(() => {
    const empty: number[] = []
    for (let i = 0; i < teams; i++) {
      if (!teamNames[i] || teamNames[i].trim().length === 0) {
        empty.push(i)
      }
    }
    return empty
  }, [teamNames, teams])

  const isTeamNamesValid = emptyTeamIndices.length === 0

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
    teams,
    teamNames,
    activeTeamNames,
    promptLanguage,
    isTeamNamesValid,
    emptyTeamIndices,
    promptLanguageLabel,
    setDurationSeconds,
    setTeams,
    updateTeamName,
    setPromptLanguage,
    resetToDefaults,
  }
}
