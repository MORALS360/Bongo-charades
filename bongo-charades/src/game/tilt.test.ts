import { describe, expect, it } from 'vitest'
import { CALIBRATION, TILT_PRESETS, type TiltConfig } from '../config/gameplay'
import {
  checkCalibrationTimeout,
  createCalibration,
  createTiltTracker,
  processCalibrationReading,
  processTiltReading,
  screenElevationDegrees,
  type CalibrationState,
  type TiltTrackerState,
} from './tilt'

/*
 * These tests check the MATHS with simulated sensor angles.
 * They do NOT prove the tilt feels right on a real phone — that needs a device test.
 *
 * Reference angles (DeviceOrientation spec):
 *   phone flat, screen up        beta=0,   gamma=0
 *   phone flat, screen down      beta=180, gamma=0
 *   landscape on the forehead    beta≈0,   gamma≈±90
 */

const M = TILT_PRESETS.medium
/** No smoothing / hold — isolates the threshold + re-arm logic */
const RAW: TiltConfig = { ...M, smoothing: 1, holdMs: 0, neutralDriftFollow: 0 }

function feed(
  readings: Array<[elevation: number, time: number]>,
  config: TiltConfig = RAW,
  start: TiltTrackerState = createTiltTracker(0),
) {
  let state = start
  const actions: string[] = []
  for (const [elev, t] of readings) {
    const r = processTiltReading(state, elev, t, config)
    state = r.state
    if (r.action) actions.push(r.action)
  }
  return { actions, state }
}

describe('screenElevationDegrees', () => {
  it('upright landscape (forehead position) reads ~0° in BOTH landscape directions', () => {
    expect(Math.abs(screenElevationDegrees(0, 90))).toBeLessThan(1)
    expect(Math.abs(screenElevationDegrees(0, -90))).toBeLessThan(1)
  })

  it('screen facing the ceiling = +90°, floor = −90°', () => {
    expect(screenElevationDegrees(0, 0)).toBeCloseTo(90)
    expect(screenElevationDegrees(180, 0)).toBeCloseTo(-90)
  })

  it('same answer whichever way the phone was rotated into landscape', () => {
    for (const gamma of [45, -45]) {
      expect(screenElevationDegrees(0, gamma)).toBeCloseTo(45)
      expect(screenElevationDegrees(180, gamma)).toBeCloseTo(-45)
    }
  })
})

describe('thresholds and re-arming (relative to neutral)', () => {
  it('holding still at neutral never fires', () => {
    expect(feed([[0, 0], [5, 100], [-8, 200], [10, 300]]).actions).toEqual([])
  })

  it('must be at neutral first (no answer if the round starts tilted)', () => {
    expect(feed([[-60, 0], [-60, 1000]]).actions).toEqual([])
  })

  it('down past the trigger = correct, up past the trigger = pass', () => {
    expect(feed([[0, 0], [-(M.correctTriggerDeg + 1), 100]]).actions).toEqual(['correct'])
    expect(feed([[0, 0], [M.passTriggerDeg + 1, 100]]).actions).toEqual(['pass'])
  })

  it('a movement just short of the trigger does nothing (no accidental answers)', () => {
    expect(feed([[0, 0], [-(M.correctTriggerDeg - 2), 100], [M.passTriggerDeg - 2, 200]]).actions).toEqual([])
  })

  it('one long tilt gives one answer only', () => {
    expect(feed([[0, 0], [-40, 100], [-50, 900], [-60, 2000]]).actions).toEqual(['correct'])
  })

  it('hysteresis: wobbling between the re-arm zone and the trigger does not re-fire', () => {
    const between = M.rearmDeg + 2 // outside neutral, below trigger
    expect(
      feed([[0, 0], [-40, 100], [-between, 800], [-40, 1600], [-between, 2400], [-40, 3200]]).actions,
    ).toEqual(['correct'])
  })

  it('returning to neutral re-arms, but the cooldown still applies', () => {
    expect(feed([[0, 0], [-40, 100], [0, 200], [-40, 300]]).actions).toEqual(['correct'])
    expect(feed([[0, 0], [-40, 100], [0, 200], [-40, 100 + M.cooldownMs + 1]]).actions).toEqual([
      'correct',
      'correct',
    ])
  })
})

describe('calibrated baseline', () => {
  it('a player who naturally holds the phone 15° tilted back is "neutral" there', () => {
    const start = createTiltTracker(15)
    // Holding at 15° does nothing; nodding to −20° (35° below neutral) is correct
    expect(feed([[15, 0], [14, 200], [-20, 400]], RAW, start).actions).toEqual(['correct'])
    // Tilting to +40° is only 25° above that neutral → not yet a pass
    expect(feed([[15, 0], [40, 400]], RAW, start).actions).toEqual([])
    expect(feed([[15, 0], [50, 400]], RAW, start).actions).toEqual(['pass'])
  })

  it('without calibration the same tilted-back hold would be read differently', () => {
    // Uncalibrated (neutral = upright 0°): the same 40° reading IS a pass
    expect(feed([[0, 0], [40, 400]], RAW, createTiltTracker(0)).actions).toEqual(['pass'])
  })
})

describe('noise handling (smoothing + hold time)', () => {
  it('a single noisy spike does not fire', () => {
    const { actions } = feed([[0, 0], [0, 20], [-60, 40], [0, 60], [0, 80]], M)
    expect(actions).toEqual([])
  })

  it('a deliberate, sustained nod fires once', () => {
    const r: Array<[number, number]> = [[0, 0]]
    for (let t = 20; t <= 400; t += 20) r.push([-45, t])
    expect(feed(r, M).actions).toEqual(['correct'])
  })
})

describe('calibration', () => {
  const C = CALIBRATION

  function run(readings: Array<[number, number]>): CalibrationState {
    let s = createCalibration(0)
    for (const [v, t] of readings) s = processCalibrationReading(s, v, t, C)
    return s
  }

  it('captures the neutral angle once the phone is held still near upright', () => {
    const r: Array<[number, number]> = []
    for (let t = 0; t <= C.settleDelayMs + C.stillWindowMs + 200; t += 50) r.push([12 + (t % 100 === 0 ? 1 : -1), t])
    const s = run(r)
    expect(s.status).toBe('done')
    expect(s.baseline!).toBeGreaterThan(10)
    expect(s.baseline!).toBeLessThan(14)
  })

  it('ignores movement while the player is lifting the phone', () => {
    const r: Array<[number, number]> = []
    for (let t = 0; t <= 2000; t += 50) r.push([Math.sin(t / 60) * 30, t])
    expect(run(r).status).toBe('waiting')
  })

  it('does not accept a still phone lying flat as "neutral"', () => {
    const r: Array<[number, number]> = []
    for (let t = 0; t <= 2000; t += 50) r.push([70, t])
    expect(run(r).status).toBe('waiting')
  })

  it('falls back to upright (0°) after the timeout so the game never gets stuck', () => {
    const s = checkCalibrationTimeout(createCalibration(0), C.timeoutMs + 1, C)
    expect(s).toMatchObject({ status: 'done', baseline: 0, method: 'timeout' })
  })
})
