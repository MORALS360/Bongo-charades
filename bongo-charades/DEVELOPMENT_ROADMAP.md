# Bongo Charades — Development Roadmap

This roadmap breaks the implementation of Bongo Charades into logical, testable, incremental phases. Every phase preserves the approved design exports as the visual source of truth.

---

## Phase 1: Design System Foundation, Fonts & Shared UI Components [COMPLETED]
**Objective**: Replace the default Vite starter styling with the exact Bongo Charades design tokens, typography (`Baloo 2` and `Nunito Sans`), shared SVG radial gradients, all 26 category illustrations, and reusable UI primitives.

- **Scope**:
  - Load `Baloo 2` (800) and `Nunito Sans` (400, 700, 800).
  - Create `src/styles/design-tokens.css` with exact colours, gradients, shadows, radii, and responsive rules (`<600px` mobile, `600–1023px` tablet, `1024px+` desktop centred `440px` frame).
  - Extract the shared `<SvgGradients />` and all 26 `<CategoryIcon />` SVG illustrations + Dice SVG + Forehead Positioning SVG from the HTML export into reusable React components.
  - Build core reusable components: `PrimaryButton`, `SecondaryButton`, `IconButton`, `CategoryCard`, `FeaturedCard`, `Panel`, `SegmentedControl`, `ToggleRow`, `BottomNav`, `TimerPill`, `ScorePill`, `TiltButton`.
- **Status**: Completed. Verified with zero lint/build errors and local dev preview.

---

## Phase 2: Home & Categories Screens [COMPLETED]
**Objective**: Implement the primary portrait discovery experience directly matching Artboards 2 & 3 of the approved Claude design.

- **Scope**:
  - **Home Screen (`HomePage`)**: Brand header, Settings shortcut, `"Ready to play?"` hero card with `"Play Now"` CTA, `"Feeling lucky?"` featured card, `"Recently played"` 2-card grid, and `BottomNav`.
  - **Categories Screen (`CategoriesPage`)**: Scrollable catalog containing all 26 approved categories across 3 groups (*Classic Charades*, *Bongo & Tanzanian Culture*, *East Africa & Beyond*), multi-selection state with `3px` yellow border, and `"Feeling lucky?"` random selection mode.
  - **Category State**: `useCategorySelection.ts` managing selection toggle, lucky mode, clear, and persistence.
- **Status**: Completed. Verified with mobile and desktop headless browser captures.

---

## Phase 3: Game Setup Experience [COMPLETED]
**Objective**: Implement the complete Game Setup screen matching Artboard 4 / PDF Page 4, connecting category selection to pre-round configuration with full team customization, duration, and language controls.

- **Scope**:
  - **Selected Categories Review**: Displays category chips with icons and remove (`×`) actions, count indicator, and "+ Add more" / "Choose specific" returning to Categories while preserving state.
  - **Floating Continue Bar**: On `CategoriesPage`, surfaces a persistent `"Continue to Setup ({count}) ▷"` button whenever categories are selected.
  - **Team Setup & Validation**: Allows choosing 2, 3, or 4 teams with editable team names, culturally authentic defaults (`Wana Dar`, `Simba Damu`, `Team Chapchap`, `Wajanja`), and inline validation requiring non-empty names.
  - **Round Duration**: Segmented control for 30s, 60s (default), 90s, and 120s.
  - **Prompt Language**: Segmented control for English, Kiswahili, and Mixed (default) with clear guidance that category names retain their Tanzanian identity.
  - **Configuration Summary**: Live summary panel detailing categories count, team match-up, turn duration, and prompt language.
  - **Start Game Action**: Prominent CTA button, enabled only when valid, routing forward to the Forehead Positioning screen.
  - **Forehead Positioning Screen (`ForeheadReadyPage`)**: Landscape orientation screen matching Artboard 7 / PDF Page 7 with player+friends SVG illustration and configuration badge.
  - **Setup Hook & Persistence**: `useGameSetup.ts` manages setup state and saves configuration to `localStorage`.
- **Status**: Completed. Verified with automated assertions and visual screenshots.

---

## Phase 4: Landscape Gameplay Loop & Results (Forehead Positioning, Countdown, Gameplay, Results) [UPCOMING]
**Objective**: Complete the core end-to-end playable game loop from clicking `"Start Game"` through forehead positioning, `3-2-1-GO!` countdown, active landscape gameplay, and the `"Time's up!"` Results screen.

- **Scope**:
  - **Forehead Positioning Screen (`ForeheadReadyPage`)**: Connect `"I'm Ready"` to the countdown sequence.
  - **Countdown Screen (`CountdownPage`)**: Landscape `270×270` badge + `3`, `2`, `1`, `GO!` step pills ticking every second into gameplay.
  - **Multilingual Prompt Deck**: Real prompt words and phrases for all 26 categories in English, Kiswahili, and Mixed.
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
