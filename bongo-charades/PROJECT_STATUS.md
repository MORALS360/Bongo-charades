# Bongo Charades — Project Status

**Last Updated**: 2026-11-13 (pre-Phase 5 refinement, second pass, branch `phase-4-polish`)  
**Current Stage**: Phase 4 + pre-Phase 5 refinement complete in the browser. The owner tested the Phase 4 build on a real device via a Cloudflare tunnel. Device checks for the refinement (auto-landscape, iPhone fallback, new feedback) are pending. **Phase 5 has not started.**

> See `PRE_PHASE5_REFINEMENT_REPORT.md` (latest) and `PHASE_4_ACCEPTANCE_REPORT.md`.

> See `PHASE_4_ACCEPTANCE_REPORT.md` for the full PASS / PARTIAL / FAIL / DEVICE TEST REQUIRED checklist.

---

## 1. Completed Milestones
- [x] **Visual Design Handoff**: Master PDF (`Bongo Charades — Design System & Screens.pdf`) and interactive HTML bundle (`Bongo Charades — Design System & Screens.html`) inspected in `design/reference/`.
- [x] **Project Scaffolding**: Vite 8 + React 19 + TypeScript 7 + Oxlint initialized.
- [x] **Comprehensive Design & Technical Audit**:
  - Established `PRODUCT_BRIEF.md`, `DESIGN_HANDOFF.md`, `ARCHITECTURE.md`, `DEVELOPMENT_ROADMAP.md`, and `PROJECT_STATUS.md`.
- [x] **Phase 1 — Design System Foundation, Fonts & Shared UI Components**:
  - Extracted and bundled local `Baloo 2` (`public/fonts/baloo-2-latin.woff2`) and `Nunito Sans` (`public/fonts/nunito-sans-latin.woff2`) fonts from the master HTML design export with SIL Open Font License attribution (`public/fonts/OFL.txt`).
  - Created `src/styles/design-tokens.css` defining all approved colours, gradients, typography classes, card/button/panel styles, and responsive breakpoints (`<600px` mobile, `600–1023px` tablet 3-column grid, `1024px+` desktop centred `440px` shell, and `844×390` landscape gameplay stage).
  - Created shared TypeScript types and interfaces in `src/types/index.ts`.
  - Created category taxonomy metadata (`src/data/categories.ts`) for all 26 approved categories across 3 groups (*Classic Charades*, *Bongo & Tanzanian Culture*, *East Africa & Beyond*), preserving original untranslated category names.
  - Extracted 9 shared SVG radial gradients (`src/components/illustrations/SvgGradients.tsx`), all 26 category vector illustrations + Dice + Forehead positioning illustration (`src/components/illustrations/CategoryIcon.tsx`), and UI/Nav icons (`src/components/illustrations/UiIcons.tsx`).
  - Built reusable UI components: `PrimaryButton`, `SecondaryButton`, `IconButton`, `CategoryCard`, `FeaturedCard`, `CategoryChip`, `Panel`, `SegmentedControl`, `ToggleRow`, `SectionHeading`.
  - Built gameplay HUD components: `TimerPill`, `ScorePill`, `TiltButton`.
  - Built layout, navigation, and error handling foundations: `AppShell`, `BottomNav`, `ErrorBoundary`, and `useNavigation`.
- [x] **Phase 2 — Home & Categories Screens**:
  - Built `HomePage.tsx` matching Artboard 2 / PDF Page 2: Brand header, Settings shortcut, "Ready to play?" hero banner with Play Now CTA, "Feeling lucky?" featured card, and 2-card Recently Played section.
  - Built `CategoriesPage.tsx` matching Artboard 3 / PDF Page 3: Full catalog of all 26 categories across 3 groups, category selection state, and "Feeling lucky?" mode.
  - Built persistent category selection hook `useCategorySelection.ts`.
  - Added clean pending placeholders for Settings, Create, and History screens (`PendingScreenPage.tsx`).
- [x] **Phase 3 — Game Setup Screen**:
  - Built `GameSetupPage.tsx` matching Artboard 4 / PDF Page 4 without bottom nav (full-bleed layout).
  - **Category Review & Removal**: Selected categories display as interactive `CategoryChip`s with remove (`×`) buttons, dynamic count, and "+ Add more" action returning to Categories. Handled empty state and "Feeling lucky?" mode cleanly.
  - **Floating Continue Bar**: Added floating `Continue to Setup ({count}) ▷` button on `CategoriesPage.tsx` when categories are selected.
  - **Team Setup & Validation**: 2, 3, or 4 teams selector (`SegmentedControl`) with editable text inputs and culturally authentic defaults (`Wana Dar`, `Simba Damu`, `Team Chapchap`, `Wajanja`). Enforced non-empty validation with inline error messages and red highlights.
  - **Round Duration**: 30s, 60s (default), 90s, 120s duration selector.
  - **Prompt Language**: English, Kiswahili, and Mixed (default) options, with an explicit note that category names retain their Tanzanian identity.
  - **Game Configuration Summary**: Instant summary showing categories count / lucky mode, active teams match-up (`Team 1 vs Team 2`), turn duration, and prompt language.
  - **Start Game Action**: Prominent CTA button, disabled when validation fails, linking directly to the Forehead Positioning screen.
  - **Forehead Positioning Screen (`ForeheadReadyPage.tsx`)**: Artboard 7 / PDF Page 7 landscape positioning bridge screen with player+friends SVG illustration, configuration badge, and "I'm Ready" action as the upcoming Phase 4 entry point.
  - **Persistence**: `useGameSetup.ts` persists settings to `localStorage`.
  - **Code Quality**: Oxlint 0 warnings/0 errors, `tsc -b && vite build` clean.

---

- [x] **Phase 4 — Gameplay Engine (audited & completed by Claude, 2026-11-11)**:
  - *Audit finding:* Antigravity's Phase 4 commit added the screens and hooks but never connected them. The production build failed, and "I'm Ready" did nothing.
  - Added `src/game/gameSession.ts` (game rules as a pure reducer) and `src/hooks/useGameSession.ts`.
  - Connected Forehead → Countdown → Gameplay → Round Transition → Results → Play Again / Home in `App.tsx`.
  - Rewrote the prompt deck as pure, tested functions (`src/game/promptDeck.ts`); removed `usePromptDeck.ts`.
  - Fixed the tilt maths for the forehead position (`src/game/tilt.ts`), duplicate-answer guards, late-answer guard, tied rankings and the category-filter fallback.
  - Added Vitest (33 unit tests, `npm test`) and an end-to-end browser script (`tests/e2e/full-game-flow.mjs`, 31 checks).
  - Build ✅ · Lint ✅ · Unit tests ✅ · Browser simulation ✅ · **Physical device tilt test ❌ not yet done**.

- [x] **Pre-Phase 5 refinement, second pass (2026-11-13)**:
  - Landscape lock retried on "I'm Ready"; installable app (manifest `display: fullscreen`, icons); `?debug=1` diagnostics; platform matrix in `docs/ORIENTATION.md`.
  - Tilt calibration stage ("Hold still…") → personal neutral; gestures measured relative to it, with smoothing, hold time, hysteresis, cooldown and drift correction. All tuning in `src/config/gameplay.ts`.
  - Feedback 450 ms. Instructions moved to Get Ready; countdown shows numbers only; Quick Play bubble removed.
  - Classic: Countries (countries only), new Famous Landmarks, Car Brands, Famous Brands. "African Music" → "African Music & Artists" (Africa-wide). 29 categories, ~480 prompt ideas.
  - 66 unit tests + 41-check browser simulation pass; build and lint clean.
- [x] **Pre-Phase 5 refinement (2026-11-12)**:
  - Auto-landscape on game start (Android fullscreen + lock); "Turn your phone sideways" fallback (iPhone); orientation released after gameplay; round pauses if the phone is turned upright.
  - New Play Mode screen: **Quick Play** (no teams) and **Teams** (2 by default, add up to 8).
  - Instruction stage (TILT DOWN = CORRECT / TILT UP = PASS) during the countdown; clean prompt screen; manual buttons only without sensor data.
  - Full-screen green/red feedback (800 ms) with the next prompt hidden.
  - Vijiweni merged into Mtaani; new **Zilipendwa** category; prompt bank restructured by group identity and language direction.
  - Visual consistency: background gradient pinned on every screen; panels match Home's cards.
  - 53 unit tests + 33-check browser simulation pass; build and lint clean.

---

## 2. Current Codebase State
- Flow: `#home` → `#categories` → `#play-mode` → (Quick Play → `#forehead`) | (Teams → `#setup` → `#forehead`) → `#calibrate` → `#countdown` → `#gameplay` → `#transition` (Teams, between teams) → `#results`.
- 29 categories (Classic 11 · Bongo 12 · East Africa & Beyond 6); ~480 prompt ideas / 588 entries; source in `scripts/content/build_prompts.py`.
- Game in progress is held in memory only (refreshing mid-game returns to Setup).
- `#settings`, `#create`, `#history`: still placeholder screens.
- Installable (web app manifest + icons); no service worker / offline yet (Phase 7).
- Git: `main` (pushed by owner) ← `phase-4-audit` (200d9ed) ← `phase-4-polish` (this work). Neither branch has been pushed by Claude.

---

## 3. How to run
```bash
npm install        # needed once after pulling this branch (adds Vitest)
npm run dev        # local dev server
npm test           # unit tests
npm run build      # production build
npm run lint
```

---

## 4. Next Planned Task
1. **Owner:** run the second-pass device checklist at the end of `PRE_PHASE5_REFINEMENT_REPORT.md` (§5 of the second pass) and skim the content review list (`docs/content/CONTENT_DIRECTION.md` §6).
2. **After approval: Phase 5, Cultural Research & Prompt Bank** (see `DEVELOPMENT_ROADMAP.md`). Not started.
