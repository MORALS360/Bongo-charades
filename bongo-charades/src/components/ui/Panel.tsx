import type { CSSProperties, ReactNode } from 'react'

interface PanelProps {
  title?: string
  children: ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * Translucent rounded panel container (.pl) used in Game Setup, Settings, and Results.
 */
export function Panel({ title, children, className = '', style }: PanelProps) {
  return (
    <div className={`pl ${className}`.trim()} style={style}>
      {title && <b>{title}</b>}
      {children}
    </div>
  )
}
