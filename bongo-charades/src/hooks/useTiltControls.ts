import { useCallback, useEffect, useRef, useState } from 'react'
import type { GameplayAction } from '../types'

interface UseTiltControlsOptions {
  enabled: boolean
  onAction: (action: GameplayAction) => void
  sensitivity?: 'low' | 'medium' | 'high'
}

interface DeviceOrientationEventWithPermission extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

/**
 * Angles for tilt detection based on sensitivity setting:
 * - Low: requires deeper tilt (45 deg)
 * - Medium (default): comfortable 35 deg nod
 * - High: quick 25 deg nod
 */
const SENSITIVITY_THRESHOLDS = {
  low: { trigger: 45, deadZone: 28 },
  medium: { trigger: 35, deadZone: 20 },
  high: { trigger: 25, deadZone: 15 },
}

const TILT_COOLDOWN_MS = 700

/**
 * Hook managing physical device motion controls (DeviceOrientationEvent).
 *
 * Product Rules:
 * - TILT DOWN (nod head forward towards floor) = 'correct' (1 point awarded)
 * - TILT UP (tilt head backwards towards ceiling) = 'pass' (0 points)
 *
 * Architecture & Reliability:
 * 1. Handles iOS Safari explicit permission request via `requestPermission()`.
 * 2. Neutral dead-zone enforcement: player must return to neutral before next trigger.
 * 3. Cooldown prevents rapid bouncing.
 * 4. Automatic cleanup of event listeners.
 * 5. Sensor support detection with fallback flags.
 */
export function useTiltControls({
  enabled,
  onAction,
  sensitivity = 'medium',
}: UseTiltControlsOptions) {
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt')
  const [sensorActive, setSensorActive] = useState(false)
  const [currentPitch, setCurrentPitch] = useState<number | null>(null)

  // Tilt state machine: 'neutral' | 'triggered'
  const stateRef = useRef<'neutral' | 'triggered'>('neutral')
  const lastActionTimeRef = useRef<number>(0)
  const isListenerAttachedRef = useRef<boolean>(false)

  const thresholds = SENSITIVITY_THRESHOLDS[sensitivity] ?? SENSITIVITY_THRESHOLDS.medium

  /**
   * Request motion permission for iOS 13+ devices.
   * MUST be invoked directly within a user gesture (e.g. click on "I'm Ready").
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !window.DeviceOrientationEvent) {
      setPermissionState('unsupported')
      return false
    }

    const DeviceOrientation = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>
    }

    if (typeof DeviceOrientation.requestPermission === 'function') {
      try {
        const response = await DeviceOrientation.requestPermission()
        if (response === 'granted') {
          setPermissionState('granted')
          return true
        } else {
          setPermissionState('denied')
          return false
        }
      } catch (err) {
        console.warn('Device orientation permission request failed:', err)
        setPermissionState('denied')
        return false
      }
    }

    // Non-iOS or standard browsers do not require explicit permission
    setPermissionState('granted')
    return true
  }, [])

  // Device orientation event listener
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return
    }

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null && e.gamma === null) {
        return
      }

      setSensorActive(true)

      // Compute pitch (nod forward / tilt back) relative to landscape forehead position
      const screenAngle =
        window.screen?.orientation?.angle ?? (window.orientation as number) ?? 0

      let pitch = 0

      // When phone is in landscape:
      if (screenAngle === 90) {
        // Landscape with top of phone to the left: gamma measures forward/backward nod
        pitch = e.gamma ?? 0
      } else if (screenAngle === 270 || screenAngle === -90) {
        // Landscape with top of phone to the right
        pitch = -(e.gamma ?? 0)
      } else {
        // Default or unrotated orientation fallback: beta represents front-to-back pitch
        pitch = (e.beta ?? 0) - 90
      }

      setCurrentPitch(pitch)

      const now = Date.now()
      const timeSinceLastAction = now - lastActionTimeRef.current

      // Check if player has returned to neutral zone
      if (Math.abs(pitch) < thresholds.deadZone) {
        if (stateRef.current === 'triggered' && timeSinceLastAction > thresholds.deadZone) {
          stateRef.current = 'neutral'
        }
        return
      }

      // If waiting for cooldown or return to neutral, do not trigger
      if (stateRef.current === 'triggered' || timeSinceLastAction < TILT_COOLDOWN_MS) {
        return
      }

      // TILT DOWN (Nod forward towards floor) -> Correct
      if (pitch < -thresholds.trigger) {
        stateRef.current = 'triggered'
        lastActionTimeRef.current = now
        onAction('correct')
        return
      }

      // TILT UP (Tilt back towards ceiling) -> Pass
      if (pitch > thresholds.trigger) {
        stateRef.current = 'triggered'
        lastActionTimeRef.current = now
        onAction('pass')
        return
      }
    }

    if (!isListenerAttachedRef.current) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true })
      isListenerAttachedRef.current = true
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
      isListenerAttachedRef.current = false
      stateRef.current = 'neutral'
    }
  }, [enabled, onAction, thresholds.deadZone, thresholds.trigger])

  return {
    permissionState,
    sensorActive,
    currentPitch,
    requestPermission,
  }
}
