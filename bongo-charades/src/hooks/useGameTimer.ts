import { useCallback, useEffect, useRef, useState } from 'react'
import { playTimeUpSound } from '../services/soundEffects'

interface UseGameTimerOptions {
  durationSeconds: number
  active: boolean
  onTimeUp: () => void
  soundEnabled?: boolean
}

/**
 * Round countdown timer.
 *
 * How it stays accurate: instead of "subtract 1 every second" (which drifts when the
 * phone is busy), we remember the exact END time and, every 200 ms, compute
 * "how much time is left until then". The display rounds up, so it shows 0:01 until
 * the final second has fully passed, then 0:00 exactly when time is up.
 *
 * `hasExpired()` lets the gameplay screen reject an answer that arrives in the
 * split-second between the real deadline and the next 200 ms tick.
 *
 * The parent should remount this hook (via a React `key`) for each new round.
 */
export function useGameTimer({
  durationSeconds,
  active,
  onTimeUp,
  soundEnabled = true,
}: UseGameTimerOptions) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(durationSeconds)
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false)

  // Keep the latest callbacks/settings in refs so changing them never restarts the clock
  const onTimeUpRef = useRef(onTimeUp)
  const soundEnabledRef = useRef(soundEnabled)
  useEffect(() => {
    onTimeUpRef.current = onTimeUp
    soundEnabledRef.current = soundEnabled
  }, [onTimeUp, soundEnabled])

  const endTimeRef = useRef<number | null>(null)
  const firedRef = useRef(false)

  useEffect(() => {
    if (!active) return

    firedRef.current = false
    const endTime = Date.now() + durationSeconds * 1000
    endTimeRef.current = endTime

    const tick = () => {
      const remainingMs = endTime - Date.now()
      setSecondsRemaining(Math.max(0, Math.ceil(remainingMs / 1000)))

      if (remainingMs <= 0 && !firedRef.current) {
        firedRef.current = true
        window.clearInterval(intervalId)
        setIsTimeUp(true)
        if (soundEnabledRef.current) playTimeUpSound()
        onTimeUpRef.current()
      }
    }

    const intervalId = window.setInterval(tick, 200)
    return () => window.clearInterval(intervalId)
  }, [active, durationSeconds])

  const hasExpired = useCallback(() => {
    if (firedRef.current) return true
    return endTimeRef.current !== null && Date.now() >= endTimeRef.current
  }, [])

  return {
    secondsRemaining,
    isTimeUp,
    hasExpired,
  }
}
