import { useCallback, useState } from 'react'
import type { BottomNavTab, ScreenRoute } from '../types'

const LANDSCAPE_ROUTES: ReadonlySet<ScreenRoute> = new Set([
  'forehead',
  'countdown',
  'gameplay',
])

const NAV_TAB_ROUTES: ReadonlySet<ScreenRoute> = new Set([
  'home',
  'categories',
  'create',
  'history',
])

export interface NavigationController {
  currentRoute: ScreenRoute
  activeNavTab: BottomNavTab
  isLandscape: boolean
  showBottomNav: boolean
  navigate: (route: ScreenRoute) => void
  selectNavTab: (tab: BottomNavTab) => void
}

/**
 * Lightweight, type-safe navigation & routing hook for Bongo Charades.
 * Automatically tracks active BottomNav tab and whether the current screen
 * requires a Portrait or Landscape shell.
 */
export function useNavigation(initialRoute: ScreenRoute = 'home'): NavigationController {
  const [currentRoute, setCurrentRoute] = useState<ScreenRoute>(initialRoute)
  const [activeNavTab, setActiveNavTab] = useState<BottomNavTab>('home')

  const navigate = useCallback((route: ScreenRoute) => {
    setCurrentRoute(route)
    if (
      route === 'home' ||
      route === 'categories' ||
      route === 'create' ||
      route === 'history'
    ) {
      setActiveNavTab(route)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const selectNavTab = useCallback((tab: BottomNavTab) => {
    setActiveNavTab(tab)
    setCurrentRoute(tab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const isLandscape = LANDSCAPE_ROUTES.has(currentRoute)
  const showBottomNav =
    NAV_TAB_ROUTES.has(currentRoute) || currentRoute === 'settings'

  return {
    currentRoute,
    activeNavTab,
    isLandscape,
    showBottomNav,
    navigate,
    selectNavTab,
  }
}
