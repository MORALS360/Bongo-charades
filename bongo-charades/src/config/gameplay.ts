/**
 * Bongo Charades — gameplay tuning values, all in ONE place.
 *
 * Change these numbers during real-phone testing; nothing else needs editing.
 * Angles are in degrees, times in milliseconds.
 *
 * Tip: open the game with `?debug=1` in the address bar (before the #) to see
 * live tilt angles, the calibrated baseline and the orientation-lock result on screen.
 */

/** How long the full-screen CORRECT / PASS feedback stays up */
export const FEEDBACK_MS = 450

/** If no motion data arrives within this time during a round, show small manual buttons */
export const SENSOR_GRACE_MS = 1500

export interface TiltConfig {
  /** Degrees BELOW the calibrated neutral position needed for CORRECT (head nods down) */
  correctTriggerDeg: number
  /** Degrees ABOVE the calibrated neutral position needed for PASS (head tilts back) */
  passTriggerDeg: number
  /**
   * Re-arm zone: after an answer, the phone must come back within this many degrees
   * of neutral before another answer can register. The gap between this and the
   * trigger angles is the "hysteresis" that stops wobbles from double-firing.
   */
  rearmDeg: number
  /** The tilt must stay past the trigger for this long (filters single noisy readings) */
  holdMs: number
  /** Minimum time between two answers */
  cooldownMs: number
  /**
   * Smoothing of raw sensor readings, 0–1. Lower = smoother but slower to react.
   * (Exponential moving average.)
   */
  smoothing: number
  /**
   * Very slow drift correction: while the phone rests near neutral, the baseline
   * follows it by this fraction per reading, so a player who slowly relaxes their
   * posture doesn't drift into a false answer. 0 disables it.
   */
  neutralDriftFollow: number
}

/** Medium is the default; low/high are ready for a future Settings screen */
export const TILT_PRESETS: Record<'low' | 'medium' | 'high', TiltConfig> = {
  low: {
    correctTriggerDeg: 40,
    passTriggerDeg: 40,
    rearmDeg: 15,
    holdMs: 90,
    cooldownMs: 500,
    smoothing: 0.35,
    neutralDriftFollow: 0.01,
  },
  medium: {
    correctTriggerDeg: 30,
    passTriggerDeg: 30,
    rearmDeg: 12,
    holdMs: 70,
    cooldownMs: 500,
    smoothing: 0.4,
    neutralDriftFollow: 0.01,
  },
  high: {
    correctTriggerDeg: 22,
    passTriggerDeg: 22,
    rearmDeg: 9,
    holdMs: 50,
    cooldownMs: 450,
    smoothing: 0.5,
    neutralDriftFollow: 0.01,
  },
}

export interface CalibrationConfig {
  /** Wait this long after "I'm Ready" so the player can lift the phone to their forehead */
  settleDelayMs: number
  /** The phone must be held still for this long to capture the neutral position */
  stillWindowMs: number
  /** "Still" = readings in the window vary by no more than this (max − min, degrees) */
  stillToleranceDeg: number
  /**
   * A forehead hold is roughly upright. Readings further than this from upright
   * (e.g. the phone lying flat in a hand) are not accepted as neutral.
   */
  maxNeutralFromUprightDeg: number
  /** Give up waiting and use upright (0°) as neutral after this long */
  timeoutMs: number
  /** If no sensor data at all arrives within this time, skip calibration (manual mode) */
  noSensorSkipMs: number
}

export const CALIBRATION: CalibrationConfig = {
  settleDelayMs: 700,
  stillWindowMs: 600,
  stillToleranceDeg: 6,
  maxNeutralFromUprightDeg: 35,
  timeoutMs: 5000,
  noSensorSkipMs: 1500,
}
