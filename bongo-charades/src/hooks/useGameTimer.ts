import { useCallback, useEffect, useRef, useState } from 'react'
import { playTimeUpSound } from '../services/soundEffects'

interface UseGameTimerOptions {
  durationSeconds: number
  active: boolean
  /** While true the clock is frozen (e.g. the phone was turned to portrait) */
  paused?: boolean
  onTimeUp: () => void
  soundEnabled?: boolean
}

/**
 * Round countdown timer.
 *
 * How it stays accurate: instead of "subtract 1 every second" (which drifts when the
 * phone is busy), we keep the time REMAINING and, while running, an exact END time.
 * Every 200 ms we compute "how long until the end". Pausing stores what's left;
 * resuming sets a new end time from it.
 *
 * `hasExpired()` lets the gameplay screen reject an answer that arrives in the
 * split-second between the real deadline and the next 200 ms tick.
 *
 * The parent remounts this hook (via a React `key`) for each new round.
 */
export function useGameTimer({
  durationSeconds,
  active,
  paused = false,
  onTimeUp,
  soundEnabled = true,
}: UseGameTimerOptions) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(durationSeconds)
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false)

  const onTimeUpRef = useRef(onTimeUp)
  const soundEnabledRef = useRef(soundEnabled)
  useEffect(() => {
    onTimeUpRef.current = onTimeUp
    soundEnabledRef.current = soundEnabled
  }, [onTimeUp, soundEnabled])

  const remainingMsRef = useRef(durationSeconds * 1000)
  const endTimeRef = useRef<number | null>(null)
  const firedRef = useRef(false)

  useEffect(() => {
    if (!active || paused || firedRef.current) {
      endTimeRef.current = null
      return
    }

    const endTime = Date.now() + remainingMsRef.current
    endTimeRef.current = endTime

    const tick = () => {
      const remainingMs = endTime - Date.now()
      remainingMsRef.current = Math.max(0, remainingMs)
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
    return () => {
      window.clearInterval(intervalId)
      // Remember exactly how much time was left when pausing / unmounting
      remainingMsRef.current = Math.max(0, endTime - Date.now())
      endTimeRef.current = null
    }
  }, [active, paused])

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
