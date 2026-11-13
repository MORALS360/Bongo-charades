/**
 * Landscape orientation helpers for gameplay.
 *
 * WHAT THE PLATFORMS ALLOW (researched 2026-11, see docs/ORIENTATION.md)
 * - The Screen Orientation spec requires the page to be FULLSCREEN before
 *   `screen.orientation.lock()` may succeed. So we request fullscreen first, then lock.
 *   Both must start inside a tap.
 * - Android phones (Chrome, Samsung Internet, Firefox 144+): supported this way.
 *   Since Chrome 136, Android TABLETS are refused ("NotSupportedError") on purpose.
 * - Installed app (Add to Home screen): our manifest uses `display: "fullscreen"`,
 *   so the installed app is already fullscreen and the lock works without the
 *   fullscreen step — the most reliable option on Android.
 * - iPhone / iPad (every browser — they all use Safari's engine): `lock()` is not
 *   supported and iPhones don't allow fullscreen for web pages. The player must
 *   rotate the phone; we show a "Turn your phone sideways" screen until they do.
 * - Desktop: no lock needed, and we never force fullscreen there.
 *
 * Every call is wrapped so an unsupported browser simply does nothing.
 */

import { setDebug } from './debug'

type LockableOrientation = ScreenOrientation & {
  lock?: (orientation: 'landscape' | 'portrait') => Promise<void>
  unlock?: () => void
}

export type OrientationLockResult = 'locked' | 'unsupported' | 'failed' | 'skipped'


let weEnteredFullscreen = false
let weLocked = false

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(pointer: coarse)').matches ?? false
}

/**
 * Ask the device to go landscape. MUST be called directly from a tap handler
 * (Start Game, Quick Play, Start next team, Play Again).
 * Never throws; resolves with what actually happened.
 */
export async function requestLandscape(): Promise<OrientationLockResult> {
  const result = await tryLandscape()
  setDebug({ orientationLock: result })
  return result
}

async function tryLandscape(): Promise<OrientationLockResult> {
  if (typeof window === 'undefined' || typeof document === 'undefined') return 'unsupported'
  if (!isTouchDevice()) return 'skipped'

  const orientation = screen.orientation as LockableOrientation | undefined
  if (!orientation || typeof orientation.lock !== 'function') return 'unsupported'

  try {
    // Android needs fullscreen before it allows a lock.
    const root = document.documentElement
    const installedFullscreen = window.matchMedia?.('(display-mode: fullscreen)').matches ?? false
    if (
      !installedFullscreen &&
      !document.fullscreenElement &&
      typeof root.requestFullscreen === 'function'
    ) {
      await root.requestFullscreen({ navigationUI: 'hide' })
      weEnteredFullscreen = true
    }
  } catch {
    // Fullscreen refused — an installed PWA may still allow the lock below.
  }

  try {
    await orientation.lock('landscape')
    weLocked = true
    return 'locked'
  } catch {
    // Not allowed here (e.g. iPad Safari, desktop) — the rotate prompt takes over.
    await leaveFullscreenIfOurs()
    return 'failed'
  }
}

/** Undo whatever requestLandscape() did, so portrait screens behave normally again. */
export async function releaseLandscape(): Promise<void> {
  if (typeof window === 'undefined') return
  if (weLocked) {
    try {
      ;(screen.orientation as LockableOrientation | undefined)?.unlock?.()
    } catch {
      // ignore
    }
    weLocked = false
  }
  await leaveFullscreenIfOurs()
}

async function leaveFullscreenIfOurs(): Promise<void> {
  if (!weEnteredFullscreen) return
  weEnteredFullscreen = false
  try {
    if (document.fullscreenElement && typeof document.exitFullscreen === 'function') {
      await document.exitFullscreen()
    }
  } catch {
    // ignore
  }
}
