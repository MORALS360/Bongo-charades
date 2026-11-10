import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type PrimaryButtonSize = 'md' | 'lg' | 'hero'

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  size?: PrimaryButtonSize
  fullWidth?: boolean
  icon?: ReactNode
}

const SIZE_STYLES: Record<PrimaryButtonSize, { minHeight: number; fontSize: number }> = {
  md: { minHeight: 56, fontSize: 18 },
  lg: { minHeight: 64, fontSize: 22 },
  hero: { minHeight: 72, fontSize: 26 },
}

export function PrimaryButton({
  children,
  size = 'md',
  fullWidth = true,
  icon,
  className = '',
  style,
  type = 'button',
  ...rest
}: PrimaryButtonProps) {
  const { minHeight, fontSize } = SIZE_STYLES[size]

  return (
    <button
      type={type}
      className={`y ${className}`.trim()}
      style={{
        width: fullWidth ? '100%' : undefined,
        minHeight,
        fontSize,
        ...style,
      }}
      {...rest}
    >
      {size === 'hero' ? (
        <span className="d" style={{ fontSize }}>
          {children}
        </span>
      ) : (
        children
      )}
      {icon}
    </button>
  )
}
