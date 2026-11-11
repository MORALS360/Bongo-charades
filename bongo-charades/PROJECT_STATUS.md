# Bongo Charades — Project Status

**Last Updated**: 2026-11-11 (Phase 4 audit, branch `phase-4-audit`)  
**Current Stage**: Phase 4 complete in the browser; real-device tilt testing pending. Phase 5 has not started and is waiting for owner approval.

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

---

## 2. Current Codebase State
- Full playable game in the browser:
  - `#home` → `#categories` → `#setup` → `#forehead` → `#countdown` → `#gameplay` → `#transition` (between teams) → `#results`
  - Manual Correct/Pass buttons always work. Tilt works in simulation and still needs a real phone.
  - `#settings`, `#create`, `#history`: still placeholder screens.
- Game in progress is held in memory only (refreshing mid-game returns to Setup).
- No PWA manifest or service worker yet (Phase 7).
- The GitHub remote exists; the owner pushes `main` manually. Phase 4 work is on the local branch `phase-4-audit` (not pushed).

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
1. **Owner:** review `PHASE_4_ACCEPTANCE_REPORT.md` and run the physical-device tilt checklist (needs an https URL).
2. **After approval: Phase 5, Cultural Research & Prompt Bank** (see `DEVELOPMENT_ROADMAP.md`). Not started.
