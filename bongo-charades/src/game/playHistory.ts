import type { GamePrompt } from '../types'
import { DEALING } from '../config/dealing'

/**
 * Play history — remembers which prompt ideas this phone has shown recently,
 * so the next game deals fresh prompts first.
 *
 * - Stored on the phone only (localStorage). Nothing is sent anywhere.
 * - Remembers prompt *ideas*, not single prompts: "Lion" and "Simba" are one idea,
 *   so switching the prompt language does not bring a just-played idea straight back.
 * - Keeps only the most recent `DEALING.recentHistorySize` ideas; older ones drop off.
 * - If storage is missing, full or corrupted, the game simply plays without history.
 */

export const HISTORY_STORAGE_KEY = 'bongo-charades:recent-prompts:v1'

/** The part of the browser's Storage the history needs (lets tests pass a fake). */
export interface HistoryStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

interface StoredHistory {
  version: 1
  /** Prompt idea keys, oldest first, most recent last */
  keys: string[]
}

/** The key used to remember a prompt: its translation concept, or its own id. */
export function historyKey(prompt: Pick<GamePrompt, 'id' | 'concept'>): string {
  return prompt.concept ?? prompt.id
}

function defaultStorage(): HistoryStorage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    return null
  }
}

/** Read the saved history (oldest first). Returns [] if there is none or it cannot be read. */
export function loadHistory(storage: HistoryStorage | null = defaultStorage()): string[] {
  if (!storage) return []
  try {
    const raw = storage.getItem(HISTORY_STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw) as Partial<StoredHistory>
    if (data?.version !== 1 || !Array.isArray(data.keys)) return []
    return data.keys.filter((k): k is string => typeof k === 'string')
  } catch {
    return []
  }
}

/**
 * Add the keys of prompts that were just shown. A key already in the list moves to
 * the end (most recent). The list is trimmed to `size`, dropping the oldest.
 * Pure function: returns a new list.
 */
export function addToHistory(
  history: readonly string[],
  shownKeys: readonly string[],
  size = DEALING.recentHistorySize,
): string[] {
  if (shownKeys.length === 0) return [...history]
  const shown = new Set(shownKeys)
  const kept = history.filter((k) => !shown.has(k))
  const result = [...kept, ...new Set(shownKeys)]
  return size > 0 ? result.slice(-size) : []
}

/** Save the history. Errors (private browsing, full storage) are ignored. */
export function saveHistory(
  keys: readonly string[],
  storage: HistoryStorage | null = defaultStorage(),
): void {
  if (!storage) return
  try {
    const data: StoredHistory = { version: 1, keys: [...keys] }
    storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Ignore: the game still works, it just forgets between games.
  }
}

/** Convenience: load, add the shown prompts, save. Returns the new history. */
export function recordShown(
  prompts: readonly Pick<GamePrompt, 'id' | 'concept'>[],
  storage: HistoryStorage | null = defaultStorage(),
  size = DEALING.recentHistorySize,
): string[] {
  const next = addToHistory(loadHistory(storage), prompts.map(historyKey), size)
  saveHistory(next, storage)
  return next
}

/** Forget everything (for a future "reset" button or testing). */
export function clearHistory(storage: HistoryStorage | null = defaultStorage()): void {
  if (!storage) return
  try {
    storage.removeItem(HISTORY_STORAGE_KEY)
  } catch {
    // ignore
  }
}
