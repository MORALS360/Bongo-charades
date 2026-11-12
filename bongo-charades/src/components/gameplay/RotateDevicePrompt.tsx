/**
 * Full-screen "turn your phone sideways" screen.
 * Shown on gameplay stages while a phone is held in portrait — mainly on iPhones,
 * where a website is not allowed to rotate the screen itself.
 * The round timer and countdown are paused while this is visible.
 */
export function RotateDevicePrompt({ message }: { message?: string }) {
  return (
    <div className="rotate-prompt" role="alertdialog" aria-live="assertive" aria-label="Rotate your phone">
      <svg width="132" height="132" viewBox="0 0 132 132" aria-hidden="true" className="rotate-prompt__phone">
        <rect x="42" y="16" width="48" height="96" rx="12" fill="url(#W)" />
        <rect x="48" y="26" width="36" height="72" rx="6" fill="url(#K)" />
        <circle cx="66" cy="104" r="3.5" fill="#2A1B6B" />
      </svg>
      <svg width="64" height="28" viewBox="0 0 64 28" aria-hidden="true" className="rotate-prompt__arrow">
        <path
          d="M6 20 Q32 -4 58 20"
          stroke="#FFC83A"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M50 10 L58 20 L46 23" stroke="#FFC83A" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h2 className="d" style={{ fontSize: 32, lineHeight: '34px', margin: '8px 0 0' }}>
        Turn your phone sideways
      </h2>
      <p style={{ fontSize: 16, fontWeight: 700, margin: 0, maxWidth: 300, lineHeight: 1.4 }}>
        {message ?? 'Bongo Charades is played in landscape. The game continues as soon as you rotate.'}
      </p>
    </div>
  )
}
