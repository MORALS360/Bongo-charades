import type { Category } from '../../types'
import { CategoryIcon } from '../illustrations/CategoryIcon'

interface CategoryChipProps {
  category: Category
  onClick?: (category: Category) => void
}

/**
 * Yellow pill chip displaying a 32x32 mini category illustration and
 * its untranslated category name, used on the Game Setup screen.
 */
export function CategoryChip({ category, onClick }: CategoryChipProps) {
  if (onClick) {
    return (
      <button
        type="button"
        className="category-chip"
        onClick={() => onClick(category)}
      >
        <CategoryIcon icon={category.icon} size={32} />
        <span>{category.name}</span>
      </button>
    )
  }

  return (
    <span className="category-chip">
      <CategoryIcon icon={category.icon} size={32} />
      <span>{category.name}</span>
    </span>
  )
}
