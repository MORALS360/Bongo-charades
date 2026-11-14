import type { CalibrationConfig, TiltConfig } from '../config/gameplay'
import type { GameplayAction } from '../types'

/**
 * Tilt maths — pure functions (no React, no browser events), so they can be tested.
 * All tuning numbers live in `src/config/gameplay.ts`.
 *
 * 1) WHICH WAY IS THE SCREEN FACING?
 *    The browser reports orientation as angles (beta, gamma). Held sideways on the
 *    forehead, gamma sits near ±90° and jumps sign as the phone passes vertical, so
 *    we don't use raw angles. Instead we compute the screen's "elevation":
 *      +90° = screen faces the ceiling, 0° = upright, −90° = screen faces the floor
 *    using elevation = asin(cos β · cos γ) (from the DeviceOrientation spec).
 *    It's the same whichever way the phone is turned and has no ±90° jump.
 *
 * 2) CALIBRATION — "what is THIS player's neutral?"
 *    People hold the phone differently (a little tilted back, a little forward).
 *    Before the countdown we wait until the phone is held still near upright and
 *    record that angle as the player's baseline.
 *
 * 3) GESTURES ARE MEASURED RELATIVE TO THAT BASELINE
 *    relative = smoothed elevation − baseline
 *      relative ≤ −correctTrigger (held for holdMs) → CORRECT  (nod down)
 *      relative ≥ +passTrigger    (held for holdMs) → PASS     (tilt back)
 *    After an answer the phone must return within `rearmDeg` of neutral before the
 *    next one (hysteresis), plus a short cooldown. Readings are smoothed to remove
 *    sensor jitter, and a very slow drift correction follows the player's posture
 *    while they rest at neutral.
 */

const DEG = Math.PI / 180

/** Angle of the screen above (+) or below (−) the horizon, in degrees. */
export function screenElevationDegrees(beta: number, gamma: number): number {
  const up = Math.cos(beta * DEG) * Math.cos(gamma * DEG)
  const clamped = Math.max(-1, Math.min(1, up))
  return Math.asin(clamped) / DEG
}

/* ───────────────────────────── Gesture tracker ───────────────────────────── */

export interface TiltTrackerState {
  /** 'armed' = ready for a gesture; 'waitingForNeutral' = must return to neutral first */
  mode: 'armed' | 'waitingForNeutral'
  lastActionAt: number
  /** Calibrated neutral elevation (degrees) */
  baseline: number
  /** Smoothed elevation (null until the first reading) */
  smoothed: number | null
  /** Direction currently past a trigger, and since when (for the hold check) */
  pending: GameplayAction | null
  pendingSince: number
}

export function createTiltTracker(baseline = 0): TiltTrackerState {
  return {
    // The player must first be at neutral, so a phone that is already tilted when
    // the round starts never fires by itself.
    mode: 'waitingForNeutral',
    lastActionAt: -Infinity,
    baseline,
    smoothed: null,
    pending: null,
    pendingSince: 0,
  }
}

export interface TiltReadingResult {
  state: TiltTrackerState
  action: GameplayAction | null
  /** Smoothed angle relative to neutral (for the debug readout) */
  relative: number
}

export function processTiltReading(
  state: TiltTrackerState,
  rawElevation: number,
  now: number,
  config: TiltConfig,
): TiltReadingResult {
  const smoothed =
    state.smoothed === null
      ? rawElevation
      : state.smoothed + config.smoothing * (rawElevation - state.smoothed)
  let baseline = state.baseline
  const relative = smoothed - baseline

  // Back at neutral → re-arm (and gently follow slow posture drift)
  if (Math.abs(relative) < config.rearmDeg) {
    baseline += config.neutralDriftFollow * (smoothed - baseline)
    return {
      state: { ...state, smoothed, baseline, mode: 'armed', pending: null },
      action: null,
      relative,
    }
  }

  const base = { ...state, smoothed, baseline }

  if (state.mode !== 'armed' || now - state.lastActionAt < config.cooldownMs) {
    return { state: { ...base, pending: null }, action: null, relative }
  }

  const direction: GameplayAction | null =
    relative <= -config.correctTriggerDeg
      ? 'correct'
      : relative >= config.passTriggerDeg
        ? 'pass'
        : null

  if (!direction) {
    // In the "in-between" band: not neutral, not a gesture → nothing happens
    return { state: { ...base, pending: null }, action: null, relative }
  }

  const pendingSince = state.pending === direction ? state.pendingSince : now
  if (now - pendingSince < config.holdMs) {
    return { state: { ...base, pending: direction, pendingSince }, action: null, relative }
  }

  return {
    state: { ...base, mode: 'waitingForNeutral', lastActionAt: now, pending: null },
    action: direction,
    relative,
  }
}

/* ───────────────────────────── Calibration ───────────────────────────── */

export interface CalibrationState {
  startedAt: number
  /** Recent readings (time, elevation) inside the "still" window */
  window: Array<{ t: number; v: number }>
  status: 'waiting' | 'done'
  baseline: number | null
  /** How the baseline was found */
  method: 'still' | 'timeout' | null
  /** Has any sensor reading arrived? */
  sawSensor: boolean
}

export function createCalibration(now: number): CalibrationState {
  return { startedAt: now, window: [], status: 'waiting', baseline: null, method: null, sawSensor: false }
}

/**
 * Feed one reading. Calibration completes when, after a short settle delay, the
 * phone has been held still (small spread) for `stillWindowMs` at a roughly
 * upright angle. The average of that window becomes the player's neutral.
 */
export function processCalibrationReading(
  state: CalibrationState,
  elevation: number,
  now: number,
  config: CalibrationConfig,
): CalibrationState {
  if (state.status === 'done') return state
  const sawSensor = true
  if (now - state.startedAt < config.settleDelayMs) return { ...state, sawSensor }

  const window = [...state.window, { t: now, v: elevation }].filter(
    (r) => now - r.t <= config.stillWindowMs,
  )
  const next = { ...state, window, sawSensor }

  const span = window.length > 0 ? now - window[0].t : 0
  if (span < config.stillWindowMs * 0.9 || window.length < 4) return next

  const values = window.map((r) => r.v)
  const spread = Math.max(...values) - Math.min(...values)
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  if (spread <= config.stillToleranceDeg && Math.abs(mean) <= config.maxNeutralFromUprightDeg) {
    return { ...next, status: 'done', baseline: mean, method: 'still' }
  }
  return next
}

/** Called on a timer: falls back to upright (0°) if the player never held still. */
export function checkCalibrationTimeout(
  state: CalibrationState,
  now: number,
  config: CalibrationConfig,
): CalibrationState {
  if (state.status === 'done' || now - state.startedAt < config.timeoutMs) return state
  return { ...state, status: 'done', baseline: 0, method: 'timeout' }
}
