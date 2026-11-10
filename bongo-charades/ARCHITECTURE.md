# Bongo Charades — Application Architecture

## 1. Technical Stack & Guiding Principles
- **Framework**: React 19 + TypeScript (~7.0) + Vite 8.
- **Styling**: Modular CSS / CSS Variables (or Tailwind CSS configured with exact design tokens) reproducing the approved design specification pixel-for-pixel.
- **Local-First Architecture**: Zero mandatory backend for the initial release. All categories, prompts, user settings, recently played categories, and local game history are stored and run client-side (`localStorage` + static TypeScript data modules).
- **Strict Separation of Concerns**:
  - **UI Components** (`src/components/`) are pure and reusable.
  - **Screens / Pages** (`src/pages/`) assemble components for each stage of the user journey.
  - **Game Content** (`src/data/`) holds category metadata and prompt decks completely decoupled from React components.
  - **Game & Sensor Logic** (`src/hooks/`, `src/services/`) encapsulates countdowns, round timers, deck shuffling, device orientation (tilt detection), audio/haptics, and persistence.
  - **Localization** (`src/i18n/`) separates **App Interface Language** (`en` | `sw`) from **Game Prompt Language** (`en` | `sw` | `mixed`), while keeping category names untranslated.

---

## 2. Recommended Directory Structure

```text
bongo-charades/
├── public/
│   ├── fonts/                  # Optional self-hosted Baloo 2 & Nunito Sans woff2
│   └── manifest.json           # Future PWA manifest
├── src/
│   ├── assets/                 # Static audio/image assets if needed
│   ├── components/
│   │   ├── illustrations/
│   │   │   ├── SvgGradients.tsx        # Shared <defs> radial gradients (#Y, #O, #R, #B, #G, #W, #K, #M, #T)
│   │   │   ├── CategoryIcon.tsx        # All 26 64x64 category SVG illustrations + Dice + Forehead SVG
│   │   │   └── UiIcons.tsx             # Settings, Gift/Rewards, Play, Nav icons
│   │   ├── ui/
│   │   │   ├── CategoryCard.tsx        # c1/c2/c3 cards (default, compact 132px, selected 3px yellow border)
│   │   │   ├── FeaturedCard.tsx        # "Feeling lucky?" orange-yellow gradient card with dice SVG
│   │   │   ├── PrimaryButton.tsx       # Pill button (#FFC83A + 0 4px 0 #C98F0A shadow)
│   │   │   ├── SecondaryButton.tsx     # Outlined pill button ("Back to Categories")
│   │   │   ├── IconButton.tsx          # 44x44 translucent circle button (.ic)
│   │   │   ├── Panel.tsx               # Translucent rounded container (.pl)
│   │   │   ├── SegmentedControl.tsx    # Pill option selector (.sg / .a)
│   │   │   ├── ToggleRow.tsx           # Settings checkbox/toggle panel row
│   │   │   └── CategoryChip.tsx        # Selected category pill on Game Setup (32x32 icon + label)
│   │   ├── layout/
│   │   │   ├── AppShell.tsx            # Responsive wrapper (mobile full-bleed, 440px desktop frame, landscape switch)
│   │   │   └── BottomNav.tsx           # 4-tab navigation bar (Home, Categories, Create, History)
│   │   └── gameplay/
│   │       ├── TimerPill.tsx           # Top-left countdown pill (0:42)
│   │       ├── ScorePill.tsx           # Top-right score pill (Score 7)
│   │       └── TiltButton.tsx          # Pass ↑ (#F59A23) and Correct ↓ (#14B8A6) fallback buttons
│   ├── data/
│   │   ├── categories.ts               # All 26 categories (id, untranslated name, group c1/c2/c3, iconId)
│   │   └── prompts/                    # Modular prompt banks per category with language tags ('en' | 'sw' | 'mixed')
│   ├── i18n/
│   │   ├── uiStrings.ts                # English (default) & Kiswahili UI translations
│   │   └── useTranslation.ts           # Hook returning current UI strings based on Settings.appLanguage
│   ├── state/
│   │   ├── SettingsContext.tsx         # App language, sound, haptics, showTiltHints, tiltSensitivity (persisted)
│   │   └── GameContext.tsx             # Selected categories, setup config, active round state, recent categories, history
│   ├── hooks/
│   │   ├── useCountdown.ts             # 3 -> 2 -> 1 -> GO! timer hook
│   │   ├── useGameTimer.ts             # Round countdown timer (30s/60s/90s/120s)
│   │   └── useTiltControls.ts          # DeviceOrientation API permission, neutral calibration, tilt up/down state machine
│   ├── services/
│   │   ├── storage.ts                  # Safe localStorage wrapper for settings, recent categories, custom decks & history
│   │   └── feedback.ts                 # Web Audio API synthesized sound effects + navigator.vibrate haptics
│   ├── pages/
│   │   ├── HomePage.tsx                # Screen 1: Home
│   │   ├── CategoriesPage.tsx          # Screen 2: Categories browser & selector
│   │   ├── GameSetupPage.tsx           # Screen 3: Game configuration
│   │   ├── ForeheadReadyPage.tsx       # Screen 4: Landscape forehead instructions & sensor permission trigger
│   │   ├── CountdownPage.tsx           # Screen 5: Landscape 3-2-1-GO!
│   │   ├── GameplayPage.tsx            # Screen 6: Landscape active charades round
│   │   ├── ResultsPage.tsx             # Screen 7: Portrait round summary & score
│   │   ├── SettingsPage.tsx            # Screen 8: App settings
│   │   ├── CreatePage.tsx              # Placeholder / Custom deck creator (BottomNav tab)
│   │   └── HistoryPage.tsx             # Local round history view (BottomNav tab)
│   ├── styles/
│   │   └── design-tokens.css           # Exact CSS variables, fonts, and utility classes from design handoff
│   ├── App.tsx
│   └── main.tsx
```

---

## 3. Core Technical Subsystems

### A. Device Orientation & Tilt Detection (`useTiltControls`)
1. **Explicit Permission Request (iOS 13+ Safari Requirement)**:
   - Modern iOS browsers require `DeviceOrientationEvent.requestPermission()` to be called directly inside a synchronous user gesture handler.
   - Tapping **"I'm Ready"** on the Forehead Positioning screen (`ForeheadReadyPage`) is the ideal user gesture to request permission before the 3-2-1 countdown starts.
2. **Tilt State Machine & Debouncing**:
   - When the phone is held horizontally in landscape against the forehead:
     - **Neutral Zone**: Phone roughly vertical against forehead (`beta` / `gamma` calibrated on round start or within neutral threshold).
     - **Tilt DOWN (Nod forward)** → Triggers **Correct**, plays positive sound/haptic, and enters a `WAITING_FOR_NEUTRAL` state so holding the tilt doesn't skip multiple cards.
     - **Tilt UP (Tilt backward toward ceiling)** → Triggers **Pass**, plays pass sound/haptic, and waits for return to neutral before accepting the next tilt.
   - **Sensitivity Mapping**: `Low`, `Medium` (default), and `High` in Settings adjust the angular threshold required to trigger Correct/Pass.
   - **Graceful Fallback**: If sensors are unavailable (desktop browser, denied permission, or unsupported WebView), the manual `Pass ↑` and `Correct ↓` buttons remain interactive on screen at all times.

### B. Orientation & Viewport Handling (`AppShell`)
- Portrait screens (`Home`, `Categories`, `Game Setup`, `Results`, `Settings`) render in a mobile-first vertical layout (`max-width: 440px` centred on desktop, 3-column category grid on tablet `600–1023px`).
- Landscape screens (`Forehead Positioning`, `Countdown`, `Gameplay`) render in a horizontal layout:
  - On mobile devices, we attempt `screen.orientation.lock('landscape')` where supported (e.g., installed PWA / fullscreen Android) and provide a smooth CSS landscape adaptation so the layout always matches the `844×390` landscape design even on iOS Safari where programmatic orientation lock is restricted.

### C. Backend & Database Strategy
- **Phase 1 (Current)**: 100% client-side. No Firebase or external database is introduced. This keeps hosting free, offline-capable, fast, and zero-maintenance.
- **Future Phases**: Data access is isolated behind `src/services/` so that if remote prompt updates, cloud history sync, or multiplayer rooms are desired later, a lightweight backend (such as Supabase or Firebase) can be plugged in without rewriting UI components.
