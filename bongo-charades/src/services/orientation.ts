/**
 * Landscape orientation helpers for gameplay.
 *
 * WHAT THE PLATFORMS ALLOW (researched 2026-11)
 * - Android Chrome / Samsung Internet: `screen.orientation.lock('landscape')` works,
 *   but only while the page is FULLSCREEN (or running as an installed PWA). So we
 *   first ask for fullscreen, then lock. Both must start inside a tap.
 * - iPhone Safari (and every iPhone browser, they all use Safari's engine): there is
 *   NO way for a web page to rotate the phone or lock orientation, and iPhones don't
 *   allow fullscreen for normal pages. The player must rotate the phone; we show a
 *   friendly "turn your phone" screen until they do.
 * - Desktop browsers: no lock needed, and we don't want to force fullscreen there,
 *   so we only try on touch devices.
 *
 * Every call is wrapped so an unsupported browser simply does nothing.
 */

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
  if (typeof window === 'undefined' || typeof document === 'undefined') return 'unsupported'
  if (!isTouchDevice()) return 'skipped'

  const orientation = screen.orientation as LockableOrientation | undefined
  if (!orientation || typeof orientation.lock !== 'function') return 'unsupported'

  try {
    // Android needs fullscreen before it allows a lock.
    const root = document.documentElement
    if (!document.fullscreenElement && typeof root.requestFullscreen === 'function') {
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
