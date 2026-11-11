import { describe, expect, it } from 'vitest'
import type { GamePrompt } from '../types'
import {
  gameSessionReducer as reduce,
  getCurrentPrompt,
  initialGameSessionState,
  rankTeams,
  type GameConfig,
  type GameSessionState,
} from './gameSession'

const prompts: GamePrompt[] = Array.from({ length: 10 }, (_, i) => ({
  id: `p${i}`,
  text: `Prompt ${i}`,
  categoryId: 'bongo-flava',
  language: 'mixed',
}))

const config = (teamNames = ['Wana Dar', 'Simba Damu']): GameConfig => ({
  teamNames,
  categoryIds: ['bongo-flava'],
  isFeelingLucky: false,
  promptLanguage: 'mixed',
  durationSeconds: 60,
})

function started(teamNames?: string[]): GameSessionState {
  return reduce(initialGameSessionState, { type: 'START', config: config(teamNames), prompts, seed: 3 })
}

function toPlaying(s: GameSessionState): GameSessionState {
  return reduce(reduce(s, { type: 'BEGIN_COUNTDOWN' }), { type: 'BEGIN_ROUND' })
}

function answer(s: GameSessionState, action: 'correct' | 'pass'): GameSessionState {
  return reduce(s, { type: 'ANSWER', action, promptId: getCurrentPrompt(s)!.id })
}

describe('game session — flow', () => {
  it('start → ready → countdown → playing', () => {
    let s = started()
    expect(s.phase).toBe('ready')
    expect(getCurrentPrompt(s)).toBeNull()
    s = reduce(s, { type: 'BEGIN_COUNTDOWN' })
    expect(s.phase).toBe('countdown')
    s = reduce(s, { type: 'BEGIN_ROUND' })
    expect(s.phase).toBe('playing')
    expect(getCurrentPrompt(s)?.text).toBeTruthy()
  })

  it('does not start with no playable prompts', () => {
    const s = reduce(initialGameSessionState, { type: 'START', config: config(), prompts: [], seed: 1 })
    expect(s.phase).toBe('idle')
  })

  it('ignores out-of-order events (e.g. BEGIN_ROUND before countdown)', () => {
    const s = started()
    expect(reduce(s, { type: 'BEGIN_ROUND' })).toBe(s)
    expect(reduce(s, { type: 'TIME_UP' })).toBe(s)
  })
})

describe('game session — scoring', () => {
  it('correct = +1, pass = 0, each answer shows a new prompt', () => {
    let s = toPlaying(started())
    const first = getCurrentPrompt(s)!.id
    s = answer(s, 'correct')
    expect(getCurrentPrompt(s)!.id).not.toBe(first)
    s = answer(s, 'pass')
    s = answer(s, 'correct')
    expect(s.teams[0]).toMatchObject({ score: 2, correctCount: 2, passedCount: 1 })
    expect(s.teams[1].score).toBe(0)
  })

  it('a duplicate answer event for the same prompt is ignored', () => {
    let s = toPlaying(started())
    const id = getCurrentPrompt(s)!.id
    s = reduce(s, { type: 'ANSWER', action: 'correct', promptId: id })
    const again = reduce(s, { type: 'ANSWER', action: 'correct', promptId: id })
    expect(again).toBe(s)
    expect(again.teams[0].score).toBe(1)
  })

  it('no answers are accepted after time is up', () => {
    let s = toPlaying(started())
    s = answer(s, 'correct')
    const id = getCurrentPrompt(s)!.id
    s = reduce(s, { type: 'TIME_UP' })
    const late = reduce(s, { type: 'ANSWER', action: 'correct', promptId: id })
    expect(late).toBe(s)
    expect(late.teams[0].score).toBe(1)
  })
})

describe('game session — team rotation and results', () => {
  it('plays each team once in order, then finishes', () => {
    let s = toPlaying(started(['A', 'B', 'C']))
    s = answer(s, 'correct') // A: 1
    s = reduce(s, { type: 'TIME_UP' })
    expect(s.phase).toBe('roundOver')

    s = toPlaying(reduce(s, { type: 'NEXT_TEAM' }))
    expect(s.currentTeamIndex).toBe(1)
    s = answer(answer(s, 'correct'), 'correct') // B: 2
    s = reduce(s, { type: 'TIME_UP' })
    expect(s.phase).toBe('roundOver')

    s = toPlaying(reduce(s, { type: 'NEXT_TEAM' }))
    expect(s.currentTeamIndex).toBe(2)
    s = answer(s, 'pass') // C: 0
    s = reduce(s, { type: 'TIME_UP' })
    expect(s.phase).toBe('finished')

    expect(s.teams.map((t) => t.score)).toEqual([1, 2, 0])
    expect(reduce(s, { type: 'NEXT_TEAM' })).toBe(s) // no 4th team
  })

  it('round summary resets for each team', () => {
    let s = toPlaying(started())
    s = answer(answer(s, 'correct'), 'pass')
    expect(s.roundRecords).toHaveLength(2)
    s = reduce(reduce(s, { type: 'TIME_UP' }), { type: 'NEXT_TEAM' })
    expect(s.roundRecords).toHaveLength(0)
  })

  it('prompts are not repeated across teams in the same game', () => {
    let s = toPlaying(started())
    const shown = [getCurrentPrompt(s)!.id]
    for (let i = 0; i < 3; i++) {
      s = answer(s, 'pass')
      shown.push(getCurrentPrompt(s)!.id)
    }
    s = toPlaying(reduce(reduce(s, { type: 'TIME_UP' }), { type: 'NEXT_TEAM' }))
    shown.push(getCurrentPrompt(s)!.id)
    for (let i = 0; i < 4; i++) {
      s = answer(s, 'pass')
      shown.push(getCurrentPrompt(s)!.id)
    }
    expect(new Set(shown).size).toBe(shown.length) // 9 of 10 prompts, all different
  })

  it('Play Again resets scores and keeps the same teams/settings', () => {
    let s = toPlaying(started())
    s = answer(s, 'correct')
    s = reduce(reduce(s, { type: 'TIME_UP' }), { type: 'NEXT_TEAM' })
    s = reduce(toPlaying(s), { type: 'TIME_UP' })
    expect(s.phase).toBe('finished')
    const again = reduce(s, { type: 'RESTART', seed: 99 })
    expect(again.phase).toBe('ready')
    expect(again.currentTeamIndex).toBe(0)
    expect(again.teams.map((t) => [t.name, t.score])).toEqual([
      ['Wana Dar', 0],
      ['Simba Damu', 0],
    ])
  })

  it('EXIT returns to idle', () => {
    expect(reduce(toPlaying(started()), { type: 'EXIT' }).phase).toBe('idle')
  })
})

describe('rankTeams', () => {
  const t = (name: string, score: number) => ({ name, score, correctCount: score, passedCount: 0 })

  it('ranks highest first', () => {
    expect(rankTeams([t('A', 1), t('B', 3), t('C', 2)]).map((x) => [x.name, x.rank])).toEqual([
      ['B', 1],
      ['C', 2],
      ['A', 3],
    ])
  })

  it('tied teams share a rank (1, 1, 3)', () => {
    expect(rankTeams([t('A', 4), t('B', 4), t('C', 1)]).map((x) => x.rank)).toEqual([1, 1, 3])
  })
})
