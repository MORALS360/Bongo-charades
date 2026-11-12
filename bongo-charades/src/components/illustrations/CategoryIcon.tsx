import type { ReactNode } from 'react'
import type { CategoryIconId } from '../../types'

interface CategoryIconProps {
  icon: CategoryIconId
  /** Size in pixels: 76 (full category card), 64 (compact Home card), or 32 (Game Setup chip) */
  size?: number
  className?: string
}

/**
 * Renders the exact 64x64 viewBox vector illustration for each of the 26 categories,
 * extracted verbatim from the master Claude Design HTML export.
 * Requires <SvgGradients /> to be mounted once in the application tree.
 */
export function CategoryIcon({ icon, size = 76, className }: CategoryIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
      style={{ flexShrink: 0 }}
    >
      {renderCategoryArtwork(icon)}
    </svg>
  )
}

function renderCategoryArtwork(icon: CategoryIconId): ReactNode {
  switch (icon) {
    // ── Group 1: Classic Charades (c1) ──
    case 'animals':
      return (
        <>
          <circle cx="18" cy="16" r="6" fill="url(#W)" />
          <circle cx="46" cy="16" r="6" fill="url(#W)" />
          <circle cx="32" cy="34" r="20" fill="url(#W)" />
          <path
            d="M22 18v9M32 15v9M42 18v9"
            stroke="#2A1B6B"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="25" cy="36" r="3" fill="url(#K)" />
          <circle cx="39" cy="36" r="3" fill="url(#K)" />
          <circle cx="32" cy="45" r="6" fill="url(#K)" />
        </>
      )

    case 'movies-tv':
      return (
        <>
          <rect x="10" y="26" width="44" height="28" rx="4" fill="url(#K)" />
          <path d="M8 16l42-7 3 10-42 7z" fill="url(#W)" />
          <path
            d="M16 15l5 9M27 13l5 9M38 11l5 9"
            stroke="#2A1B6B"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )

    case 'music-artists':
      return (
        <>
          <path
            d="M24 46V16l22-5v30"
            stroke="#FFC83A"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="20" cy="47" r="8" fill="url(#Y)" />
          <circle cx="42" cy="43" r="8" fill="url(#O)" />
        </>
      )

    case 'sports':
      return (
        <>
          <circle cx="32" cy="32" r="22" fill="url(#W)" />
          <path d="M32 21l9 7-3 11H26l-3-11z" fill="url(#K)" />
          <path
            d="M32 21V10M41 28l11-4M23 28L12 24"
            stroke="#2A1B6B"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )

    case 'countries-places':
      return (
        <>
          <circle cx="32" cy="32" r="22" fill="url(#B)" />
          <path d="M18 24c6-6 12 0 10 6s-8 4-10-2z" fill="url(#G)" />
          <path d="M38 34c6-2 10 4 6 10s-10 0-6-10z" fill="url(#G)" />
        </>
      )

    case 'everyday-things':
      return (
        <>
          <rect x="14" y="20" width="30" height="32" rx="9" fill="url(#O)" />
          <path
            d="M44 28c11 0 11 14 0 14"
            stroke="#FFC83A"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M23 8v7M33 8v7"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )

    case 'act-it-out':
      return (
        <>
          <path d="M10 14h44v16c0 14-10 22-22 22S10 44 10 30z" fill="url(#Y)" />
          <circle cx="22" cy="28" r="4" fill="url(#K)" />
          <circle cx="42" cy="28" r="4" fill="url(#K)" />
          <path
            d="M22 40q10 8 20 0"
            stroke="#2A1B6B"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )

    case 'food-drinks':
      return (
        <>
          <path d="M12 30c0-14 40-14 40 0z" fill="url(#O)" />
          <rect x="10" y="32" width="44" height="6" rx="3" fill="url(#G)" />
          <rect x="10" y="38" width="44" height="7" rx="3" fill="url(#R)" />
          <path d="M12 47h40c0 8-40 8-40 0z" fill="url(#O)" />
        </>
      )

    // ── Group 2: Bongo & Tanzanian Culture (c2) ──
    case 'hii-dar-yetu':
      return (
        <>
          <rect x="10" y="28" width="14" height="26" rx="2" fill="url(#B)" />
          <rect x="26" y="14" width="14" height="40" rx="2" fill="url(#M)" />
          <rect x="42" y="32" width="12" height="22" rx="2" fill="url(#T)" />
          <circle cx="50" cy="14" r="7" fill="url(#Y)" />
        </>
      )

    case 'daladala-diaries':
      return (
        <>
          <rect x="5" y="16" width="54" height="30" rx="8" fill="url(#Y)" />
          <rect x="11" y="22" width="12" height="10" rx="2" fill="url(#B)" />
          <rect x="26" y="22" width="12" height="10" rx="2" fill="url(#B)" />
          <rect x="41" y="22" width="12" height="10" rx="2" fill="url(#B)" />
          <rect x="5" y="38" width="54" height="4" rx="0" fill="url(#R)" />
          <circle cx="18" cy="50" r="6" fill="url(#K)" />
          <circle cx="46" cy="50" r="6" fill="url(#K)" />
        </>
      )

    case 'bongo-flava':
      return (
        <>
          <rect x="23" y="6" width="18" height="28" rx="9" fill="url(#W)" />
          <path
            d="M16 28q0 16 16 16t16-16"
            stroke="#FFC83A"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M32 44v10M23 54h18"
            stroke="#FFC83A"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )

    case 'mtaani':
      return (
        <>
          <path d="M6 32L32 8l26 24z" fill="url(#R)" />
          <rect x="13" y="32" width="38" height="22" rx="2" fill="url(#Y)" />
          <rect x="28" y="40" width="10" height="14" rx="2" fill="url(#K)" />
        </>
      )

    case 'zilipendwa':
      // Vintage radio — Tanzanian throwback music (Radio Tanzania era to the 2000s)
      return (
        <>
          <path d="M40 17L52 5" stroke="#FFC83A" strokeWidth="3" strokeLinecap="round" />
          <circle cx="52" cy="5" r="3" fill="url(#Y)" />
          <rect x="5" y="16" width="54" height="38" rx="9" fill="url(#O)" />
          <circle cx="23" cy="35" r="12" fill="url(#K)" />
          <circle cx="19" cy="31" r="2" fill="url(#W)" />
          <circle cx="27" cy="31" r="2" fill="url(#W)" />
          <circle cx="19" cy="39" r="2" fill="url(#W)" />
          <circle cx="27" cy="39" r="2" fill="url(#W)" />
          <rect x="40" y="24" width="13" height="7" rx="3.5" fill="url(#W)" />
          <circle cx="46.5" cy="43" r="5.5" fill="url(#Y)" />
        </>
      )

    case 'chakula-chetu':
      return (
        <>
          <circle cx="32" cy="34" r="25" fill="url(#W)" />
          <circle cx="32" cy="34" r="17" fill="url(#O)" />
          <circle cx="26" cy="30" r="7" fill="url(#G)" />
          <circle cx="38" cy="38" r="6" fill="url(#R)" />
          <circle cx="37" cy="27" r="5" fill="url(#Y)" />
        </>
      )

    case 'watu-maarufu':
      return (
        <path
          d="M32 6l7 17 18 2-14 12 4 18-15-10-15 10 4-18L7 25l18-2z"
          fill="url(#Y)"
        />
      )

    case 'movie-za-bongo':
      return (
        <>
          <circle cx="32" cy="32" r="24" fill="url(#K)" />
          <circle cx="32" cy="17" r="6" fill="url(#W)" />
          <circle cx="18" cy="38" r="6" fill="url(#W)" />
          <circle cx="46" cy="38" r="6" fill="url(#W)" />
          <circle cx="32" cy="32" r="4" fill="url(#Y)" />
        </>
      )

    case 'mpira-mashabiki':
      return (
        <>
          <path d="M16 8h32v14c0 11-7 17-16 17s-16-6-16-17z" fill="url(#Y)" />
          <path
            d="M16 12H8v6c0 7 8 9 10 9M48 12h8v6c0 7-8 9-10 9"
            stroke="#FFC83A"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <rect x="28" y="40" width="8" height="8" rx="2" fill="url(#O)" />
          <rect x="18" y="48" width="28" height="9" rx="3" fill="url(#O)" />
        </>
      )

    case 'chuo-life':
      return (
        <>
          <path d="M32 10l28 12-28 12L4 22z" fill="url(#K)" />
          <path d="M15 31v12c9 9 25 9 34 0V31l-17 8z" fill="url(#M)" />
          <path
            d="M56 24v16"
            stroke="#FFC83A"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )

    case 'mapenzi-mahusiano':
      return (
        <path
          d="M32 56C4 38 8 10 25 12c4 0 7 4 7 7 0-3 3-7 7-7 17-2 21 26-7 44z"
          fill="url(#R)"
        />
      )

    case 'shughuli-za-familia':
      return (
        <>
          <circle cx="24" cy="24" r="13" fill="url(#M)" />
          <circle cx="42" cy="20" r="12" fill="url(#Y)" />
          <path
            d="M24 37q6 12 10 21M42 32q-4 12-8 26"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )

    // ── Group 3: East Africa & Beyond (c3) ──
    case 'east-african-vibes':
      return (
        <>
          <path d="M3 54L24 20l12 18 8-10 17 26z" fill="url(#G)" />
          <circle cx="48" cy="13" r="8" fill="url(#Y)" />
          <path d="M24 20l-6 9h12z" fill="url(#W)" />
        </>
      )

    case 'african-icons':
      return (
        <>
          <path d="M8 48V18l14 14 10-18 10 18 14-14v30z" fill="url(#Y)" />
          <rect x="8" y="48" width="48" height="7" rx="3" fill="url(#O)" />
        </>
      )

    case 'african-music':
      return (
        <>
          <path d="M12 22h40l-6 32H18z" fill="url(#O)" />
          <rect x="12" y="14" width="40" height="11" rx="5" fill="url(#Y)" />
          <path
            d="M20 26l8 28M44 26l-8 28"
            stroke="#FFC83A"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )

    case 'african-cities':
      return (
        <>
          <path
            d="M32 5c13 0 19 9 19 19 0 13-19 34-19 34S13 37 13 24c0-10 6-19 19-19z"
            fill="url(#R)"
          />
          <circle cx="32" cy="24" r="8" fill="url(#W)" />
        </>
      )

    case 'pop-culture':
      return <path d="M38 4L14 36h15l-4 24 25-34H35z" fill="url(#Y)" />

    case 'throwback-hits':
      return (
        <>
          <rect x="6" y="14" width="52" height="34" rx="6" fill="url(#W)" />
          <circle cx="22" cy="31" r="7" fill="url(#K)" />
          <circle cx="42" cy="31" r="7" fill="url(#K)" />
          <rect x="20" y="40" width="24" height="5" rx="2" fill="url(#M)" />
        </>
      )
  }
}

/**
 * Dual rotated dice illustration used inside the "Feeling lucky?" FeaturedCard.
 */
export function FeelingLuckyDiceSvg({ size = 92 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 92 92" aria-hidden="true" style={{ flexShrink: 0 }}>
      <g transform="rotate(-14 30 56)">
        <rect x="6" y="30" width="48" height="48" rx="12" fill="url(#W)" />
        <circle cx="20" cy="44" r="4.5" fill="#2A1B6B" />
        <circle cx="40" cy="44" r="4.5" fill="#2A1B6B" />
        <circle cx="30" cy="54" r="4.5" fill="#2A1B6B" />
        <circle cx="20" cy="64" r="4.5" fill="#2A1B6B" />
        <circle cx="40" cy="64" r="4.5" fill="#2A1B6B" />
      </g>
      <g transform="rotate(16 62 28)">
        <rect x="46" y="8" width="38" height="38" rx="10" fill="url(#W)" />
        <circle cx="57" cy="19" r="3.5" fill="#2A1B6B" />
        <circle cx="73" cy="35" r="3.5" fill="#2A1B6B" />
        <circle cx="65" cy="27" r="3.5" fill="#2A1B6B" />
      </g>
    </svg>
  )
}

/**
 * Landscape instruction illustration showing a player holding the phone
 * against their forehead facing three friends.
 */
export function ForeheadPositioningSvg({
  width = 340,
  height = 230,
}: {
  width?: number
  height?: number
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 340 230"
      role="img"
      aria-label="Player holding phone to forehead, screen facing friends"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <circle cx="170" cy="100" r="62" fill="#F4B183" />
      <path
        d="M108 90c0-40 30-52 62-52s62 12 62 52c-10-18-30-26-62-26s-52 8-62 26z"
        fill="#2A1B6B"
      />
      <rect
        x="98"
        y="62"
        width="144"
        height="52"
        rx="12"
        fill="url(#K)"
        stroke="#fff"
        strokeWidth="3"
      />
      <rect x="106" y="69" width="128" height="38" rx="6" fill="url(#Y)" />
      <path
        d="M170 124v22m-8-8l8 8 8-8"
        stroke="#FFC83A"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="110" cy="190" r="16" fill="url(#O)" />
      <circle cx="105" cy="188" r="2" fill="#2A1B6B" />
      <circle cx="115" cy="188" r="2" fill="#2A1B6B" />
      <circle cx="170" cy="190" r="16" fill="url(#T)" />
      <circle cx="165" cy="188" r="2" fill="#2A1B6B" />
      <circle cx="175" cy="188" r="2" fill="#2A1B6B" />
      <circle cx="230" cy="190" r="16" fill="url(#M)" />
      <circle cx="225" cy="188" r="2" fill="#2A1B6B" />
      <circle cx="235" cy="188" r="2" fill="#2A1B6B" />
    </svg>
  )
}
