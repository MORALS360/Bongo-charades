import type { ReactNode } from 'react'
import type { BottomNavTab } from '../../types'
import {
  CategoriesNavIcon,
  CreateNavIcon,
  HistoryNavIcon,
  HomeNavIcon,
} from '../illustrations/UiIcons'

interface BottomNavProps {
  activeTab: BottomNavTab
  onSelectTab: (tab: BottomNavTab) => void
  labels?: Partial<Record<BottomNavTab, string>>
}

const DEFAULT_LABELS: Record<BottomNavTab, string> = {
  home: 'Home',
  categories: 'Categories',
  create: 'Create',
  history: 'History',
}

const TAB_ICONS: Record<BottomNavTab, ReactNode> = {
  home: <HomeNavIcon />,
  categories: <CategoriesNavIcon />,
  create: <CreateNavIcon />,
  history: <HistoryNavIcon />,
}

const TAB_ORDER: BottomNavTab[] = ['home', 'categories', 'create', 'history']

/**
 * Approved Bottom Navigation bar (#3E2FA8) with Home, Categories, Create, and History tabs.
 */
export function BottomNav({ activeTab, onSelectTab, labels }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {TAB_ORDER.map((tab) => {
        const isActive = tab === activeTab
        const label = labels?.[tab] ?? DEFAULT_LABELS[tab]
        return (
          <button
            key={tab}
            type="button"
            className={`bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`.trim()}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onSelectTab(tab)}
          >
            {TAB_ICONS[tab]}
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
