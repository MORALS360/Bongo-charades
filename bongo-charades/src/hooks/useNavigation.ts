import { useCallback, useEffect, useState } from 'react'
import type { BottomNavTab, ScreenRoute } from '../types'

const VALID_ROUTES: ReadonlySet<ScreenRoute> = new Set([
  'home',
  'categories',
  'setup',
  'forehead',
  'countdown',
  'gameplay',
  'results',
  'settings',
  'create',
  'history',
  'design-system',
])

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

function parseHashRoute(fallback: ScreenRoute): ScreenRoute {
  if (typeof window === 'undefined') return fallback
  const raw = window.location.hash.replace(/^#\/?/, '').trim() as ScreenRoute
  return VALID_ROUTES.has(raw) ? raw : fallback
}

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
 * Syncs with URL hash (#home, #categories, etc.) for browser back/forward support
 * and tracks whether the active screen uses a Portrait or Landscape shell.
 */
export function useNavigation(initialRoute: ScreenRoute = 'home'): NavigationController {
  const [currentRoute, setCurrentRoute] = useState<ScreenRoute>(() =>
    parseHashRoute(initialRoute),
  )
  const [activeNavTab, setActiveNavTab] = useState<BottomNavTab>(() => {
    const start = parseHashRoute(initialRoute)
    return start === 'home' ||
      start === 'categories' ||
      start === 'create' ||
      start === 'history'
      ? start
      : 'home'
  })

  const applyRoute = useCallback((route: ScreenRoute) => {
    setCurrentRoute(route)
    if (
      route === 'home' ||
      route === 'categories' ||
      route === 'create' ||
      route === 'history'
    ) {
      setActiveNavTab(route)
    }
  }, [])

  useEffect(() => {
    const onHashChange = () => {
      const next = parseHashRoute(initialRoute)
      applyRoute(next)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [applyRoute, initialRoute])

  const navigate = useCallback(
    (route: ScreenRoute) => {
      applyRoute(route)
      if (typeof window !== 'undefined') {
        const nextHash = `#${route}`
        if (window.location.hash !== nextHash) {
          window.history.pushState(null, '', nextHash)
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    [applyRoute],
  )

  const selectNavTab = useCallback(
    (tab: BottomNavTab) => {
      navigate(tab)
    },
    [navigate],
  )

  const isLandscape = LANDSCAPE_ROUTES.has(currentRoute)
  const showBottomNav =
    NAV_TAB_ROUTES.has(currentRoute) ||
    currentRoute === 'settings' ||
    currentRoute === 'setup'

  return {
    currentRoute,
    activeNavTab,
    isLandscape,
    showBottomNav,
    navigate,
    selectNavTab,
  }
}
