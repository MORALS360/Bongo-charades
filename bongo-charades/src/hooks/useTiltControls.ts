import { useCallback, useEffect, useRef, useState } from 'react'
import {
  initialTiltTrackerState,
  processTiltReading,
  screenElevationDegrees,
  TILT_THRESHOLDS,
} from '../game/tilt'
import {
  requestMotionPermission,
  type MotionPermissionState,
} from '../services/motionPermission'
import type { GameplayAction, TiltSensitivity } from '../types'

interface UseTiltControlsOptions {
  enabled: boolean
  onAction: (action: GameplayAction) => void
  sensitivity?: TiltSensitivity
}

/**
 * Hook managing physical tilt controls (DeviceOrientationEvent).
 *
 * Product rules:
 * - TILT DOWN (screen turns to face the floor)   = 'correct'
 * - TILT UP   (screen turns to face the ceiling) = 'pass'
 *
 * Reliability:
 * 1. The angle maths lives in `game/tilt.ts` (tested without a phone).
 * 2. Exactly one 'deviceorientation' listener while enabled; removed on cleanup.
 * 3. The latest `onAction` is kept in a ref, so the listener is NOT re-attached
 *    every time the prompt changes (re-attaching used to reset the "return to
 *    upright first" rule and could award a second answer for one tilt).
 * 4. Player must return to upright + 700 ms cooldown between answers.
 */
export function useTiltControls({
  enabled,
  onAction,
  sensitivity = 'medium',
}: UseTiltControlsOptions) {
  const [permissionState, setPermissionState] = useState<'prompt' | MotionPermissionState>(
    'prompt',
  )
  const [sensorActive, setSensorActive] = useState(false)
  const [currentPitch, setCurrentPitch] = useState<number | null>(null)

  const onActionRef = useRef(onAction)
  useEffect(() => {
    onActionRef.current = onAction
  }, [onAction])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const result = await requestMotionPermission()
    setPermissionState(result)
    return result === 'granted'
  }, [])

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const thresholds = TILT_THRESHOLDS[sensitivity] ?? TILT_THRESHOLDS.medium
    let tracker = initialTiltTrackerState
    let lastUiUpdate = 0

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return

      const elevation = screenElevationDegrees(e.beta, e.gamma)
      const now = performance.now()

      // Only refresh the debug readout ~10× per second to avoid needless re-renders
      if (now - lastUiUpdate > 100) {
        lastUiUpdate = now
        setSensorActive(true)
        setCurrentPitch(Math.round(elevation))
      }

      const result = processTiltReading(tracker, elevation, now, thresholds)
      tracker = result.state
      if (result.action) onActionRef.current(result.action)
    }

    window.addEventListener('deviceorientation', handleOrientation)
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [enabled, sensitivity])

  return {
    permissionState,
    sensorActive,
    currentPitch,
    requestPermission,
  }
}
