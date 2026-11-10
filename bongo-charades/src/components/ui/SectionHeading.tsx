interface SectionHeadingProps {
  title: string
  actionLabel?: string
  onAction?: () => void
  size?: 'sm' | 'md'
  marginTop?: number
  marginBottom?: number
}

/**
 * Reusable Baloo 2 section heading with optional right-aligned action link
 * (e.g., "Recently played" + "Browse all", or "Classic Charades").
 */
export function SectionHeading({
  title,
  actionLabel,
  onAction,
  size = 'md',
  marginTop = 0,
  marginBottom = 0,
}: SectionHeadingProps) {
  const fontSize = size === 'sm' ? 22 : 24

  if (actionLabel) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginTop,
          marginBottom,
        }}
      >
        <h2 className="d" style={{ fontSize, lineHeight: '28px' }}>
          {title}
        </h2>
        <button
          type="button"
          onClick={onAction}
          style={{
            fontWeight: 800,
            fontSize: 16,
            color: '#FFC83A',
          }}
        >
          {actionLabel}
        </button>
      </div>
    )
  }

  return (
    <h2
      className="d"
      style={{
        fontSize,
        lineHeight: '28px',
        margin: `${marginTop}px 0 ${marginBottom}px`,
      }}
    >
      {title}
    </h2>
  )
}
