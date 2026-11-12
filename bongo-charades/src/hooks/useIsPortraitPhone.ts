import { useEffect, useState } from 'react'

/**
 * true when a touch device (phone/tablet) is physically held in portrait.
 * Used to show the "turn your phone" screen during gameplay stages.
 * Desktop browsers are never treated as "portrait phones", so a narrow
 * desktop window is never blocked.
 */
function compute(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  const touch = window.matchMedia('(pointer: coarse)').matches
  const portrait = window.matchMedia('(orientation: portrait)').matches
  return touch && portrait
}

export function useIsPortraitPhone(): boolean {
  const [isPortrait, setIsPortrait] = useState(compute)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(orientation: portrait)')
    const update = () => setIsPortrait(compute())
    mq.addEventListener?.('change', update)
    window.addEventListener('resize', update)
    return () => {
      mq.removeEventListener?.('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return isPortrait
}
