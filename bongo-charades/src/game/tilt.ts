import type { GameplayAction, TiltSensitivity } from '../types'

/**
 * Tilt maths — pure functions (no React, no browser events), so they can be tested.
 *
 * WHY THIS APPROACH
 * The browser reports phone orientation as three angles (alpha, beta, gamma).
 * When the phone is held sideways (landscape) against the forehead, the "resting"
 * value of gamma is about ±90°, and gamma jumps from +90 to -90 when the phone
 * passes vertical. The previous code treated 0° as "resting", so a phone held
 * correctly on the forehead could look like a big tilt and fire answers by itself.
 *
 * Instead we ask one simple question: "Which way is the SCREEN facing?"
 *   - Screen facing the ceiling  → player tilted their head BACK  → PASS
 *   - Screen facing the floor    → player tilted their head DOWN  → CORRECT
 *   - Screen facing straight out → resting position               → nothing
 *
 * From the DeviceOrientation spec, the "up" component of the screen's direction is
 * cos(beta) × cos(gamma). Turning that into an angle gives:
 *   +90° = screen faces ceiling, 0° = upright, −90° = screen faces floor.
 * This works the same whether the phone is turned left or right, and has no
 * jumps around ±90°.
 */

const DEG = Math.PI / 180

/** Angle of the screen above (+) or below (−) the horizon, in degrees. */
export function screenElevationDegrees(beta: number, gamma: number): number {
  const up = Math.cos(beta * DEG) * Math.cos(gamma * DEG)
  const clamped = Math.max(-1, Math.min(1, up))
  return Math.asin(clamped) / DEG
}

export interface TiltThresholds {
  /** Degrees of tilt needed to count as an answer */
  trigger: number
  /** Must come back within this many degrees of upright before the next answer */
  deadZone: number
}

export const TILT_THRESHOLDS: Record<TiltSensitivity, TiltThresholds> = {
  low: { trigger: 45, deadZone: 28 },
  medium: { trigger: 35, deadZone: 20 },
  high: { trigger: 25, deadZone: 15 },
}

/** Minimum time between two tilt answers, in milliseconds */
export const TILT_COOLDOWN_MS = 700

export interface TiltTrackerState {
  /** 'armed' = ready to detect a tilt; 'waitingForNeutral' = must return upright first */
  mode: 'armed' | 'waitingForNeutral'
  lastActionAt: number
}

export const initialTiltTrackerState: TiltTrackerState = {
  mode: 'waitingForNeutral', // the player must first hold the phone upright
  lastActionAt: -Infinity,
}

/**
 * Feed one sensor reading in, get back the new tracker state and (maybe) an action.
 * Rules:
 *  1. After any answer, nothing fires again until the phone returns near upright.
 *  2. Even then, at least TILT_COOLDOWN_MS must pass between answers.
 */
export function processTiltReading(
  state: TiltTrackerState,
  elevation: number,
  now: number,
  thresholds: TiltThresholds,
): { state: TiltTrackerState; action: GameplayAction | null } {
  if (Math.abs(elevation) < thresholds.deadZone) {
    return { state: { ...state, mode: 'armed' }, action: null }
  }

  if (state.mode !== 'armed' || now - state.lastActionAt < TILT_COOLDOWN_MS) {
    return { state, action: null }
  }

  if (elevation <= -thresholds.trigger) {
    return { state: { mode: 'waitingForNeutral', lastActionAt: now }, action: 'correct' }
  }
  if (elevation >= thresholds.trigger) {
    return { state: { mode: 'waitingForNeutral', lastActionAt: now }, action: 'pass' }
  }
  return { state, action: null }
}
