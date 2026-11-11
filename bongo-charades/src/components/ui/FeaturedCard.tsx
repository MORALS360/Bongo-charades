import { FeelingLuckyDiceSvg } from '../illustrations/CategoryIcon'

interface FeaturedCardProps {
  title?: string
  subtitle?: string
  onClick?: () => void
}

/**
 * "Feeling lucky?" FeaturedCard component with yellow-to-orange gradient
 * and dual dice illustration, used on both Home and Categories screens.
 */
export function FeaturedCard({
  title = 'Feeling lucky?',
  subtitle = 'Play random words across all categories.',
  onClick,
}: FeaturedCardProps) {
  return (
    <button type="button" className="featured-card" onClick={onClick}>
      <span>
        <span
          className="d"
          style={{ fontSize: 26, lineHeight: '28px', display: 'block' }}
        >
          {title}
        </span>
        <span
          style={{
            fontWeight: 700,
            fontSize: 14,
            display: 'block',
            marginTop: 4,
          }}
        >
          {subtitle}
        </span>
      </span>
      <FeelingLuckyDiceSvg size={92} />
    </button>
  )
}
