import { useEffect, useRef, useState } from 'react'
import { TILT_PRESETS } from '../config/gameplay'
import { createTiltTracker, processTiltReading, screenElevationDegrees } from '../game/tilt'
import { setDebug } from '../services/debug'
import type { GameplayAction, TiltSensitivity } from '../types'

interface UseTiltControlsOptions {
  enabled: boolean
  onAction: (action: GameplayAction) => void
  /** Player's calibrated neutral elevation in degrees (0 = upright) */
  baseline?: number
  sensitivity?: TiltSensitivity
}

/**
 * Physical tilt controls (DeviceOrientationEvent) for one round.
 *
 * - TILT DOWN (screen turns towards the floor)   = 'correct'
 * - TILT UP   (screen turns towards the ceiling) = 'pass'
 * Measured relative to the calibrated `baseline`; all rules and numbers live in
 * `game/tilt.ts` and `config/gameplay.ts`.
 *
 * Exactly one listener while enabled; the latest `onAction` is kept in a ref so the
 * listener (and its "return to neutral" memory) survives prompt changes.
 */
export function useTiltControls({
  enabled,
  onAction,
  baseline = 0,
  sensitivity = 'medium',
}: UseTiltControlsOptions) {
  const [sensorActive, setSensorActive] = useState(false)

  const onActionRef = useRef(onAction)
  useEffect(() => {
    onActionRef.current = onAction
  }, [onAction])

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const config = TILT_PRESETS[sensitivity] ?? TILT_PRESETS.medium
    let tracker = createTiltTracker(baseline)
    let reportedActive = false
    let lastDebug = 0

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return
      if (!reportedActive) {
        reportedActive = true
        setSensorActive(true)
      }

      const now = performance.now()
      const elevation = screenElevationDegrees(e.beta, e.gamma)
      const result = processTiltReading(tracker, elevation, now, config)
      tracker = result.state

      if (now - lastDebug > 100) {
        lastDebug = now
        setDebug({
          elevation,
          relative: result.relative,
          baseline: tracker.baseline,
          trackerMode: tracker.mode,
        })
      }

      if (result.action) {
        setDebug({ lastAction: result.action })
        onActionRef.current(result.action)
      }
    }

    window.addEventListener('deviceorientation', handleOrientation)
    return () => window.removeEventListener('deviceorientation', handleOrientation)
  }, [enabled, sensitivity, baseline])

  return { sensorActive }
}
