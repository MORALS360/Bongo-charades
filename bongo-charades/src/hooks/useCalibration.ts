import { useEffect, useRef } from 'react'
import { CALIBRATION } from '../config/gameplay'
import {
  checkCalibrationTimeout,
  createCalibration,
  processCalibrationReading,
  screenElevationDegrees,
} from '../game/tilt'
import { setDebug } from '../services/debug'

export interface CalibrationResult {
  /** Neutral elevation in degrees, or null when no motion sensor is available */
  baseline: number | null
  method: 'still' | 'timeout' | 'no-sensor'
}

/**
 * Runs the calibration stage: listens to the motion sensor until the phone has been
 * held still near upright, then reports the player's neutral angle.
 *  - No sensor data at all within `noSensorSkipMs` → finishes immediately (manual mode).
 *  - Player never holds still → falls back to upright (0°) after `timeoutMs`.
 * It never touches the round timer or the score.
 */
export function useCalibration(active: boolean, onDone: (result: CalibrationResult) => void) {
  const onDoneRef = useRef(onDone)
  useEffect(() => {
    onDoneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    if (!active || typeof window === 'undefined') return

    let state = createCalibration(performance.now())
    let finished = false

    const finish = (result: CalibrationResult) => {
      if (finished) return
      finished = true
      setDebug({
        calibration: `${result.method}${result.baseline !== null ? ` ${result.baseline.toFixed(1)}°` : ''}`,
      })
      onDoneRef.current(result)
    }

    const handle = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return
      const now = performance.now()
      const elevation = screenElevationDegrees(e.beta, e.gamma)
      setDebug({ elevation })
      state = processCalibrationReading(state, elevation, now, CALIBRATION)
      if (state.status === 'done') finish({ baseline: state.baseline, method: 'still' })
    }

    const timer = window.setInterval(() => {
      const now = performance.now()
      if (!state.sawSensor && now - state.startedAt >= CALIBRATION.noSensorSkipMs) {
        finish({ baseline: null, method: 'no-sensor' })
        return
      }
      state = checkCalibrationTimeout(state, now, CALIBRATION)
      if (state.status === 'done') finish({ baseline: state.baseline ?? 0, method: 'timeout' })
    }, 100)

    window.addEventListener('deviceorientation', handle)
    return () => {
      window.removeEventListener('deviceorientation', handle)
      window.clearInterval(timer)
    }
  }, [active])
}
