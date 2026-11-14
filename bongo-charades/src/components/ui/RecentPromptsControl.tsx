import { useState } from 'react'
import { clearHistory, loadHistory } from '../../game/playHistory'

/**
 * Small "forget recently played prompts" control (owner request, Phase 5 Stage 7).
 *
 * The phone remembers which prompt ideas it showed so the next game deals fresh ones
 * first (see game/playHistory.ts). This lets players wipe that memory, for example
 * when a new group of friends picks up the phone. Two taps: "Forget" then "Yes, forget".
 */
export function RecentPromptsControl() {
  const [count, setCount] = useState(() => loadHistory().length)
  const [confirming, setConfirming] = useState(false)

  const linkStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    padding: '4px 0',
    margin: 0,
    color: 'inherit',
    font: 'inherit',
    fontWeight: 800,
    textDecoration: 'underline',
    cursor: 'pointer',
  }

  if (count === 0) {
    return (
      <p style={{ fontSize: 13, fontWeight: 700, opacity: 0.75, margin: '8px 0 0' }}>
        No prompts remembered yet — every game starts fresh.
      </p>
    )
  }

  return (
    <p
      style={{ fontSize: 13, fontWeight: 700, opacity: 0.9, margin: '8px 0 0' }}
      aria-live="polite"
    >
      {confirming ? (
        <>
          Forget {count} recently played {count === 1 ? 'prompt' : 'prompts'}?{' '}
          <button
            type="button"
            style={linkStyle}
            onClick={() => {
              clearHistory()
              setCount(loadHistory().length)
              setConfirming(false)
            }}
          >
            Yes, forget
          </button>
          {' · '}
          <button type="button" style={linkStyle} onClick={() => setConfirming(false)}>
            Cancel
          </button>
        </>
      ) : (
        <>
          {count} recently played {count === 1 ? 'prompt is' : 'prompts are'} saved for later, so
          new ones come first.{' '}
          <button type="button" style={linkStyle} onClick={() => setConfirming(true)}>
            Forget
          </button>
        </>
      )}
    </p>
  )
}
