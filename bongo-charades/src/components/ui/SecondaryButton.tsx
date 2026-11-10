import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  fullWidth?: boolean
}

export function SecondaryButton({
  children,
  fullWidth = true,
  className = '',
  style,
  type = 'button',
  ...rest
}: SecondaryButtonProps) {
  return (
    <button
      type={type}
      className={`btn-secondary ${className}`.trim()}
      style={{
        width: fullWidth ? '100%' : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
