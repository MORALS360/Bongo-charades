# Bongo Charades — Development Roadmap

This roadmap breaks the implementation of Bongo Charades into logical, testable, incremental phases. Every phase preserves the approved design exports as the visual source of truth.

---

## Phase 1: Design System Foundation, Fonts & Shared UI Components
**Objective**: Replace the default Vite starter styling with the exact Bongo Charades design tokens, typography (`Baloo 2` and `Nunito Sans`), shared SVG radial gradients, all 26 category illustrations, and reusable UI primitives.

- **Scope**:
  - Load `Baloo 2` (800) and `Nunito Sans` (400, 700, 800).
  - Create `src/styles/design-tokens.css` with exact colours, gradients, shadows, radii, and responsive rules (`<600px` mobile, `600–1023px` tablet, `1024px+` desktop centred `440px` frame).
  - Extract the shared `<SvgGradients />` and all 26 `<CategoryIcon />` SVG illustrations + Dice SVG + Forehead Positioning SVG from the HTML export into reusable React components.
  - Build core reusable components: `PrimaryButton`, `SecondaryButton`, `IconButton`, `CategoryCard`, `FeaturedCard`, `Panel`, `SegmentedControl`, `ToggleRow`, `BottomNav`, `TimerPill`, `ScorePill`, `TiltButton`.
- **Dependencies**: None (Foundational).
- **How We Test**:
  - Verify typography, colours, borders, shadows, and all 26 SVG illustrations against Page 1 (Design System) and Page 3 (Categories) of the PDF/HTML exports.
  - Run `npm run build` and `npm run lint` to confirm zero TypeScript or lint errors.

---

## Phase 2: Game Content Data, Localization & State Management
**Objective**: Establish the decoupled data layer for all 26 categories, initial multilingual prompt decks (`English`, `Kiswahili`, `Mixed`), UI translation dictionary (`English` default, `Kiswahili` toggle), and persistent app/game state.

- **Scope**:
  - Create `src/data/categories.ts` with all 26 categories across the 3 groups (*Classic Charades*, *Bongo & Tanzanian Culture*, *East Africa & Beyond*), preserving original untranslated category names.
  - Create `src/data/prompts/` with initial playable prompt lists for every category, tagged by language (`en`, `sw`, `mixed`).
  - Create `src/i18n/uiStrings.ts` separating App Interface Language from Game Prompt Language.
  - Create `SettingsContext` and `GameContext` backed by `localStorage` (`recentlyPlayed`, `settings`, `gameSetup`, `history`).
- **Dependencies**: Phase 1 types/icons.
- **How We Test**:
  - Unit/integration check that switching App Interface Language translates UI labels while keeping category names untouched.
  - Verify prompt filtering by category, `"Feeling lucky?"` random mode, and prompt language (`English`, `Kiswahili`, `Mixed`).

---

## Phase 3: Portrait Discovery & Configuration Screens (Home, Categories, Game Setup, Settings)
**Objective**: Implement the complete pre-game portrait user journey so a player can browse categories, configure a game round, and adjust settings.

- **Scope**:
  - **Home Screen (`HomePage`)**: Brand header, Settings button, `"Ready to play?"` hero, `"Play Now"` CTA, `"Feeling lucky?"` featured card, `"Recently played"` 2-card grid, and `BottomNav`.
  - **Categories Screen (`CategoriesPage`)**: Scrollable view with `"Feeling lucky?"` card and all 3 category sections (26 cards), multi-category selection (`3px` yellow border), and sticky/clear way to proceed to Game Setup.
  - **Game Setup Screen (`GameSetupPage`)**: Selected category chips with `32×32` icons, Duration (`30s/60s/90s/120s`), Teams (`2/3/4`), Prompt language (`English/Kiswahili/Mixed`), and `"Start Game"` button.
  - **Settings Screen (`SettingsPage`)**: App language (`English/Kiswahili`), Sound, Haptic feedback, Show tilt hints, and Tilt sensitivity (`Low/Medium/High`).
- **Dependencies**: Phases 1 & 2.
- **How We Test**:
  - Visual comparison of Home, Categories, Game Setup, and Settings against Pages 2, 3, 4, and 6 of the PDF export across mobile (`390×844`), tablet, and desktop viewports.
  - Verify full navigation flow between Home ↔ Categories ↔ Game Setup ↔ Settings.

---

## Phase 4: Landscape Gameplay Loop & Results (Forehead Positioning, Countdown, Gameplay, Results)
**Objective**: Complete the core end-to-end playable game loop from clicking `"Start Game"` through forehead positioning, `3-2-1-GO!` countdown, active landscape gameplay, and the `"Time's up!"` Results screen.

- **Scope**:
  - **Forehead Positioning Screen (`ForeheadReadyPage`)**: Landscape layout (`844×390` proportion), custom player+friends SVG illustration, `"Get ready!"` instructions, and `"I'm Ready"` button.
  - **Countdown Screen (`CountdownPage`)**: Landscape `270×270` badge + `3`, `2`, `1`, `GO!` step pills ticking every second into gameplay.
  - **Active Gameplay Screen (`GameplayPage`)**: Landscape view with `TimerPill`, `ScorePill`, active Category title, responsive `Baloo 2` prompt display (`88px` down to `56px` for long words), and functional `Pass ↑` and `Correct ↓` buttons.
  - **Results Screen (`ResultsPage`)**: Portrait summary with confetti dots, `"Time's up!"`, Final Score badge, team/encouragement message, `Correct` and `Passed` counts, `"Play Again"`, and `"Back to Categories"`.
- **Dependencies**: Phase 3.
- **How We Test**:
  - Play complete rounds (`30s`, `60s`) from Home → Categories → Game Setup → Forehead Positioning → Countdown → Gameplay → Results → Play Again / Back to Categories.
  - Compare every screen visually against Pages 5, 7, 8, and 9 of the PDF export.

---

## Phase 5: Tilt Sensor Integration, Audio/Haptics & Secondary Tabs
**Objective**: Layer in physical device tilt controls (`DeviceOrientationEvent`), synthesized sound effects, haptic vibration, and the remaining `BottomNav` views (`History` & `Create`).

- **Scope**:
  - Implement `useTiltControls` hook with explicit iOS 13+ permission request triggered on `"I'm Ready"`, neutral-zone calibration, debounced Tilt Down (`Correct`) and Tilt Up (`Pass`), and sensitivity settings (`Low`, `Medium`, `High`).
  - Add Web Audio API sound effects (countdown beep, correct chime, pass swoosh, time's up fanfare) and `navigator.vibrate` haptics respecting Settings toggles.
  - Implement local `History` screen (showing past rounds stored in `localStorage`) and `Create` screen (or clean custom deck builder) matching the design system.
- **Dependencies**: Phase 4.
- **How We Test**:
  - Test tilt controls on actual mobile devices (iOS Safari & Android Chrome) plus desktop fallback when motion sensors are absent or denied.
  - Verify `Show tilt hints` and `Tilt sensitivity` settings dynamically affect gameplay.

---

## Phase 6: Responsive Polish & Progressive Web App (PWA) Readiness
**Objective**: Ensure Bongo Charades works offline, can be installed to a mobile home screen, and handles landscape/portrait transitions smoothly across devices.

- **Scope**:
  - Add Web App Manifest (`manifest.webmanifest`), app icons, and service worker caching for offline play (including bundled fonts and prompt decks).
  - Final accessibility, safe-area inset (`env(safe-area-inset-bottom)`), and cross-device layout audit.
- **Dependencies**: Phase 5.
- **How We Test**:
  - Lighthouse PWA / accessibility check and offline airplane-mode gameplay test.
