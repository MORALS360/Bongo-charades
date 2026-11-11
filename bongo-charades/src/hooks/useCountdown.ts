import { useEffect, useRef, useState } from 'react'
import { playCountdownTick } from '../services/soundEffects'

export type CountdownStep = 3 | 2 | 1 | 'GO!'

interface UseCountdownOptions {
  active: boolean
  onComplete: () => void
  soundEnabled?: boolean
}

/**
 * Hook managing the 3 -> 2 -> 1 -> GO! sequence (Artboard 8 / PDF Page 8).
 * Ticks every 1000ms with synthesized sound effects and fires `onComplete` upon completion.
 */
export function useCountdown({
  active,
  onComplete,
  soundEnabled = true,
}: UseCountdownOptions) {
  const [step, setStep] = useState<CountdownStep>(3)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (!active) {
      setStep(3)
      return
    }

    setStep(3)
    if (soundEnabled) playCountdownTick(false)

    const timer1 = setTimeout(() => {
      setStep(2)
      if (soundEnabled) playCountdownTick(false)
    }, 1000)

    const timer2 = setTimeout(() => {
      setStep(1)
      if (soundEnabled) playCountdownTick(false)
    }, 2000)

    const timer3 = setTimeout(() => {
      setStep('GO!')
      if (soundEnabled) playCountdownTick(true)
    }, 3000)

    const timer4 = setTimeout(() => {
      onCompleteRef.current()
    }, 3900)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [active, soundEnabled])

  return { step }
}
