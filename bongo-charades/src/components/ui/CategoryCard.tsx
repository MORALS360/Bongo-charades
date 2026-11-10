import type { Category } from '../../types'
import { CategoryIcon } from '../illustrations/CategoryIcon'

interface CategoryCardProps {
  category: Category
  selected?: boolean
  /** Compact variant (height: 132px, 64px icon) used in Home "Recently played" */
  compact?: boolean
  onSelect?: (category: Category) => void
}

/**
 * Approved CategoryCard component (.c, .c1/.c2/.c3).
 * Category names are always rendered in their original untranslated language.
 */
export function CategoryCard({
  category,
  selected = false,
  compact = false,
  onSelect,
}: CategoryCardProps) {
  const classes = [
    'c',
    category.group,
    compact ? 'c-compact' : '',
    selected ? 'c-selected' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={classes}
      aria-pressed={selected}
      onClick={() => onSelect?.(category)}
    >
      <CategoryIcon icon={category.icon} size={compact ? 64 : 76} />
      <span className="n">{category.name}</span>
    </button>
  )
}
