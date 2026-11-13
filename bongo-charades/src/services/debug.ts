/**
 * On-screen diagnostics for real-phone testing.
 * Turn on by opening the app with `?debug=1` before the # (e.g. https://…/?debug=1#home).
 * The panel shows live tilt angles, the calibrated baseline and the orientation-lock
 * result, so thresholds in `src/config/gameplay.ts` can be tuned on a real device.
 */
export interface DebugInfo {
  orientationLock?: string
  elevation?: number
  relative?: number
  baseline?: number
  calibration?: string
  trackerMode?: string
  lastAction?: string
}

const info: DebugInfo = {}

// Development builds: expose for automated browser tests
if (import.meta.env.DEV && typeof window !== 'undefined') {
  ;(window as unknown as { __bongoDebug?: DebugInfo }).__bongoDebug = info
}

export const isDebugEnabled = (): boolean =>
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug')

export function setDebug(patch: DebugInfo): void {
  Object.assign(info, patch)
}

export function getDebug(): DebugInfo {
  return { ...info }
}
