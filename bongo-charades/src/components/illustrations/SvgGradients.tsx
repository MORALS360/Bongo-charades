/**
 * Global SVG <defs> providing the 9 radial gradients used across all
 * Bongo Charades category illustrations, dice, and character art.
 *
 * Extracted directly from the master Claude Design export.
 */
export function SvgGradients() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="Y" cx=".35" cy=".3" r=".85">
          <stop offset="0" stopColor="#FFE98A" />
          <stop offset="1" stopColor="#F5A623" />
        </radialGradient>
        <radialGradient id="O" cx=".35" cy=".3" r=".85">
          <stop offset="0" stopColor="#FFB36B" />
          <stop offset="1" stopColor="#E8590C" />
        </radialGradient>
        <radialGradient id="R" cx=".35" cy=".3" r=".85">
          <stop offset="0" stopColor="#FF9A9A" />
          <stop offset="1" stopColor="#D62839" />
        </radialGradient>
        <radialGradient id="B" cx=".35" cy=".3" r=".85">
          <stop offset="0" stopColor="#9CD3FF" />
          <stop offset="1" stopColor="#2563EB" />
        </radialGradient>
        <radialGradient id="G" cx=".35" cy=".3" r=".85">
          <stop offset="0" stopColor="#B5F0A0" />
          <stop offset="1" stopColor="#1E9E4A" />
        </radialGradient>
        <radialGradient id="W" cx=".35" cy=".3" r=".85">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#CFC8F0" />
        </radialGradient>
        <radialGradient id="K" cx=".35" cy=".3" r=".85">
          <stop offset="0" stopColor="#6A5BB5" />
          <stop offset="1" stopColor="#1E1250" />
        </radialGradient>
        <radialGradient id="M" cx=".35" cy=".3" r=".85">
          <stop offset="0" stopColor="#FFB3E6" />
          <stop offset="1" stopColor="#C026D3" />
        </radialGradient>
        <radialGradient id="T" cx=".35" cy=".3" r=".85">
          <stop offset="0" stopColor="#9CF5EA" />
          <stop offset="1" stopColor="#0E9F90" />
        </radialGradient>
      </defs>
    </svg>
  )
}
