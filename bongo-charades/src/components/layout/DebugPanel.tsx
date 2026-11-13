import { useEffect, useState } from 'react'
import { getDebug, isDebugEnabled, type DebugInfo } from '../../services/debug'

const fmt = (n?: number) => (typeof n === 'number' ? `${n.toFixed(1)}°` : '—')

/** Small diagnostics strip, only rendered with `?debug=1` in the URL. */
export function DebugPanel() {
  const [enabled] = useState(isDebugEnabled)
  const [d, setD] = useState<DebugInfo>({})
  useEffect(() => {
    if (!enabled) return
    const t = window.setInterval(() => setD(getDebug()), 150)
    return () => window.clearInterval(t)
  }, [enabled])
  if (!enabled) return null
  return (
    <div className="debug-panel" aria-hidden="true">
      lock: {d.orientationLock ?? '—'} · elev {fmt(d.elevation)} · base {fmt(d.baseline)} · rel{' '}
      {fmt(d.relative)} · {d.trackerMode ?? '—'} · calib {d.calibration ?? '—'} · last{' '}
      {d.lastAction ?? '—'}
    </div>
  )
}
