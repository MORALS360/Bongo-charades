import { describe, expect, it } from 'vitest'
import {
  initialTiltTrackerState,
  processTiltReading,
  screenElevationDegrees,
  TILT_COOLDOWN_MS,
  TILT_THRESHOLDS,
  type TiltTrackerState,
} from './tilt'

/*
 * These tests check the MATHS with simulated sensor angles.
 * They do NOT prove the tilt feels right on a real phone — that needs a device test.
 *
 * Reference angles (DeviceOrientation spec):
 *   phone flat, screen up        beta=0,   gamma=0
 *   phone flat, screen down      beta=180, gamma=0
 *   portrait, upright            beta=90,  gamma=0
 *   landscape on the forehead    beta≈0,   gamma≈±90
 */

describe('screenElevationDegrees', () => {
  it('upright landscape (forehead position) reads ~0° in BOTH landscape directions', () => {
    expect(Math.abs(screenElevationDegrees(0, 90))).toBeLessThan(1)
    expect(Math.abs(screenElevationDegrees(0, -90))).toBeLessThan(1)
    expect(Math.abs(screenElevationDegrees(2, 88))).toBeLessThan(3)
  })

  it('screen facing the ceiling = +90°, floor = −90°', () => {
    expect(screenElevationDegrees(0, 0)).toBeCloseTo(90)
    expect(screenElevationDegrees(180, 0)).toBeCloseTo(-90)
  })

  it('head tilted back 45° in landscape → +45°; nodded down 45° → −45°', () => {
    // Back: screen rotates toward the ceiling, gamma moves from 90 toward 0, beta stays ~0
    expect(screenElevationDegrees(0, 45)).toBeCloseTo(45)
    // Down: screen rotates past vertical toward the floor, beta flips to ~180
    expect(screenElevationDegrees(180, 45)).toBeCloseTo(-45)
    expect(screenElevationDegrees(-180, -45)).toBeCloseTo(-45)
  })
})

describe('processTiltReading', () => {
  const th = TILT_THRESHOLDS.medium

  function feed(readings: Array<[number, number]>, start = initialTiltTrackerState) {
    let state: TiltTrackerState = start
    const actions: string[] = []
    for (const [elev, t] of readings) {
      const r = processTiltReading(state, elev, t, th)
      state = r.state
      if (r.action) actions.push(r.action)
    }
    return actions
  }

  it('holding the phone upright on the forehead never fires', () => {
    expect(feed([[0, 0], [5, 100], [-8, 200], [12, 300]])).toEqual([])
  })

  it('must be held upright first (no answer if the round starts with the phone tilted)', () => {
    expect(feed([[-60, 0], [-60, 1000]])).toEqual([])
  })

  it('down = correct, up = pass', () => {
    expect(feed([[0, 0], [-40, 100]])).toEqual(['correct'])
    expect(feed([[0, 0], [40, 100]])).toEqual(['pass'])
  })

  it('one long tilt gives one answer only', () => {
    expect(feed([[0, 0], [-40, 100], [-50, 900], [-60, 2000], [-45, 3000]])).toEqual(['correct'])
  })

  it('returning upright re-arms, but the cooldown still applies', () => {
    expect(feed([[0, 0], [-40, 100], [0, 200], [-40, 300]])).toEqual(['correct'])
    expect(
      feed([[0, 0], [-40, 100], [0, 200], [-40, 100 + TILT_COOLDOWN_MS + 1]]),
    ).toEqual(['correct', 'correct'])
  })

  it('small wobbles between dead-zone and trigger do nothing', () => {
    expect(feed([[0, 0], [25, 100], [-30, 200], [28, 300]])).toEqual([])
  })
})
