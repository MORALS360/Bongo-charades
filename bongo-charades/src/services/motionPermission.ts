/**
 * Motion-sensor permission helper.
 *
 * iPhones/iPads (iOS 13+) only send tilt data after the user explicitly allows it,
 * and the request MUST happen directly inside a tap (e.g. the "I'm Ready" button).
 * Android Chrome and desktop browsers don't ask, so we treat them as "granted".
 * Tilt sensors also only work on secure pages (https:// or localhost).
 */

export type MotionPermissionState = 'granted' | 'denied' | 'unsupported'

type OrientationCtorWithPermission = {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

export function isMotionSupported(): boolean {
  return typeof window !== 'undefined' && 'DeviceOrientationEvent' in window
}

export async function requestMotionPermission(): Promise<MotionPermissionState> {
  if (!isMotionSupported()) return 'unsupported'

  const ctor = window.DeviceOrientationEvent as unknown as OrientationCtorWithPermission
  if (typeof ctor.requestPermission === 'function') {
    try {
      return (await ctor.requestPermission()) === 'granted' ? 'granted' : 'denied'
    } catch (err) {
      console.warn('Motion permission request failed:', err)
      return 'denied'
    }
  }
  return 'granted'
}
