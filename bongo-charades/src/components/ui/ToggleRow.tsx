interface ToggleRowProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

/**
 * Settings checkbox row inside a translucent panel (.pl), matching Artboard 6 (Settings).
 */
export function ToggleRow({ label, checked, onChange }: ToggleRowProps) {
  return (
    <label
      className="pl"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 60,
        fontWeight: 800,
        cursor: 'pointer',
      }}
    >
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: 28,
          height: 28,
          accentColor: '#FFC83A',
          cursor: 'pointer',
          margin: 0,
        }}
      />
    </label>
  )
}
