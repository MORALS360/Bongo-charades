import { describe, expect, it } from 'vitest'
import {
  HISTORY_STORAGE_KEY,
  addToHistory,
  clearHistory,
  historyKey,
  loadHistory,
  recordShown,
  saveHistory,
  type HistoryStorage,
} from './playHistory'

/** In-memory stand-in for the phone's localStorage */
function fakeStorage(initial: Record<string, string> = {}): HistoryStorage & { data: Record<string, string> } {
  const data = { ...initial }
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => {
      data[k] = v
    },
    removeItem: (k) => {
      delete data[k]
    },
  }
}

describe('play history — remembering prompts between games', () => {
  it('remembers ideas, not single prompts: "Lion" and "Simba" share one key', () => {
    expect(historyKey({ id: 'anim-lion-en', concept: 'anim-lion' })).toBe('anim-lion')
    expect(historyKey({ id: 'anim-lion-sw', concept: 'anim-lion' })).toBe('anim-lion')
    expect(historyKey({ id: 'bf-pawa' })).toBe('bf-pawa')
  })

  it('adds new keys at the end and moves a replayed key to the end', () => {
    expect(addToHistory(['a', 'b', 'c'], ['b', 'd'], 10)).toEqual(['a', 'c', 'b', 'd'])
  })

  it('keeps only the configured number of most recent ideas', () => {
    expect(addToHistory(['a', 'b', 'c'], ['d', 'e'], 3)).toEqual(['c', 'd', 'e'])
    expect(addToHistory(['a'], ['b'], 0)).toEqual([])
  })

  it('saves and loads from storage', () => {
    const s = fakeStorage()
    saveHistory(['x', 'y'], s)
    expect(loadHistory(s)).toEqual(['x', 'y'])
    recordShown([{ id: 'p1' }, { id: 'p2', concept: 'c2' }], s, 10)
    expect(loadHistory(s)).toEqual(['x', 'y', 'p1', 'c2'])
    clearHistory(s)
    expect(loadHistory(s)).toEqual([])
  })

  it('treats missing, corrupted or old-format storage as "no history"', () => {
    expect(loadHistory(null)).toEqual([])
    expect(loadHistory(fakeStorage({ [HISTORY_STORAGE_KEY]: 'not json' }))).toEqual([])
    expect(loadHistory(fakeStorage({ [HISTORY_STORAGE_KEY]: '{"version":99,"keys":["a"]}' }))).toEqual([])
    expect(loadHistory(fakeStorage({ [HISTORY_STORAGE_KEY]: '{"version":1,"keys":["a",3,null]}' }))).toEqual(['a'])
  })

  it('never crashes when storage refuses to save (private browsing, full storage)', () => {
    const broken: HistoryStorage = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('quota')
      },
      removeItem: () => {
        throw new Error('blocked')
      },
    }
    expect(() => recordShown([{ id: 'a' }], broken)).not.toThrow()
    expect(loadHistory(broken)).toEqual([])
    expect(() => clearHistory(broken)).not.toThrow()
  })
})
