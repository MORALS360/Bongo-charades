import { useCallback, useEffect, useRef, useState } from 'react'
import { playTimeUpSound } from '../services/soundEffects'

interface UseGameTimerOptions {
  durationSeconds: number
  active: boolean
  onTimeUp: () => void
  soundEnabled?: boolean
}

/**
 * Hook providing a drift-free countdown timer for gameplay rounds.
 * Uses timestamp delta calculation (`Date.now()`) to guarantee clock precision.
 * Automatically stops at 0 and prevents post-round input.
 */
export function useGameTimer({
  durationSeconds,
  active,
  onTimeUp,
  soundEnabled = true,
}: UseGameTimerOptions) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(durationSeconds)
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false)

  const onTimeUpRef = useRef(onTimeUp)
  onTimeUpRef.current = onTimeUp

  const endTimeRef = useRef<number | null>(null)
  const intervalIdRef = useRef<number | null>(null)
  const isTimeUpFiredRef = useRef<boolean>(false)

  const handleTimeUp = useCallback(() => {
    if (isTimeUpFiredRef.current) return
    isTimeUpFiredRef.current = true
    setIsTimeUp(true)
    setSecondsRemaining(0)

    if (intervalIdRef.current) {
      window.clearInterval(intervalIdRef.current)
      intervalIdRef.current = null
    }

    if (soundEnabled) {
      playTimeUpSound()
    }

    onTimeUpRef.current()
  }, [soundEnabled])

  useEffect(() => {
    if (!active) {
      setSecondsRemaining(durationSeconds)
      setIsTimeUp(false)
      isTimeUpFiredRef.current = false
      if (intervalIdRef.current) {
        window.clearInterval(intervalIdRef.current)
        intervalIdRef.current = null
      }
      return
    }

    setIsTimeUp(false)
    isTimeUpFiredRef.current = false
    setSecondsRemaining(durationSeconds)

    const startTime = Date.now()
    const targetEndTime = startTime + durationSeconds * 1000
    endTimeRef.current = targetEndTime

    intervalIdRef.current = window.setInterval(() => {
      const now = Date.now()
      const remainingMs = targetEndTime - now
      const secondsLeft = Math.max(0, Math.ceil(remainingMs / 1000))

      setSecondsRemaining(secondsLeft)

      if (remainingMs <= 0) {
        handleTimeUp()
      }
    }, 200)

    return () => {
      if (intervalIdRef.current) {
        window.clearInterval(intervalIdRef.current)
        intervalIdRef.current = null
      }
    }
  }, [active, durationSeconds, handleTimeUp])

  return {
    secondsRemaining,
    isTimeUp,
  }
}
