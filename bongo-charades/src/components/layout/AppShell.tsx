import type { ReactNode } from 'react'
import type { BottomNavTab } from '../../types'
import { SvgGradients } from '../illustrations/SvgGradients'
import { BottomNav } from './BottomNav'

interface AppShellProps {
  orientation?: 'portrait' | 'landscape'
  activeNavTab?: BottomNavTab
  onSelectNavTab?: (tab: BottomNavTab) => void
  showBottomNav?: boolean
  children: ReactNode
}

/**
 * Responsive application layout wrapper enforcing the design system breakpoints:
 * - Portrait: full-bleed on mobile (<600px), 720px on tablet, centred 440px frame on desktop (1024px+)
 * - Landscape: dedicated horizontal stage (844x390 proportion) for Forehead, Countdown, and Gameplay
 */
export function AppShell({
  orientation = 'portrait',
  activeNavTab = 'home',
  onSelectNavTab,
  showBottomNav = false,
  children,
}: AppShellProps) {
  return (
    <div className="app-shell-outer">
      <SvgGradients />
      {orientation === 'landscape' ? (
        <main className="app-shell-landscape">{children}</main>
      ) : (
        <div className="app-shell-portrait">
          <main
            className={`app-shell-portrait__content ${
              showBottomNav ? 'app-shell-portrait__content--with-nav' : ''
            }`.trim()}
          >
            {children}
          </main>
          {showBottomNav && onSelectNavTab && (
            <BottomNav activeTab={activeNavTab} onSelectTab={onSelectNavTab} />
          )}
        </div>
      )}
    </div>
  )
}
