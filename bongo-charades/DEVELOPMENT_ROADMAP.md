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

## Phase 4: Gameplay Engine [COMPLETE IN BROWSER — DEVICE TILT TEST PENDING]
**Objective**: A complete, reliable game loop: forehead positioning → 3-2-1-GO! → landscape gameplay with tilt and manual controls → team rotation → final results.

- **Delivered** (Antigravity screens + Claude audit/integration, 2026-11-11):
  - Forehead positioning screen with Ready button and iOS motion-permission request.
  - 3-2-1-GO! countdown, and round timer for 30/60/90/120 s that stops exactly at 0.
  - Landscape gameplay: large prompt, timer, team, score, Pass ↑ / Correct ↓ buttons, rotate-phone message.
  - Tilt controls (down = Correct, up = Pass) using screen-facing maths, with a return-to-upright rule and cooldown.
  - Prompt deck: selected categories only, respects language, shuffled, no repeats until exhausted.
  - Scoring per team, duplicate and late answers ignored, team rotation with transition screen and mid-game standings.
  - Final results with ranking, winner, ties, Play Again and Return Home.
  - Game rules centralised in `src/game/gameSession.ts`. 33 unit tests and an end-to-end browser script.
- **Remaining for full acceptance**: physical-device tilt test on iOS Safari and Android Chrome (needs https). See `PHASE_4_ACCEPTANCE_REPORT.md` §5.

---

## Phase 5: Cultural Research & Prompt-Bank Development [NEXT — AWAITING APPROVAL]
**Objective**: A research-backed, culturally relevant prompt library for the **existing 26 categories** (no new categories).

- **Scope**:
  - A research ledger with sources, dates and uncertainty notes (music charts, entertainment, everyday life, slang, personalities, nostalgia).
  - A prompt schema extended with difficulty (easy/medium/hard), content type, region, tags, verification status and review date, kept separate from UI and game logic.
  - About 15–25 quality-controlled prompts per category, prioritising Bongo & Tanzanian Culture.
  - Duplicate detection and validation script; a list of content that needs human review.
  - Integration into the game, plus tests confirming category, language and difficulty selection.
- **Known issues to fix there**: EN/SW word-for-word duplicates ("Simba"/"Lion"), "Kenge" mislabelled as crocodile, thin categories.

---

## Phase 6: Gameplay Polish & User Testing
- Real group play-testing; fix confusing moments.
- Pause/quit during a round; pause the timer while the rotate message shows or the app is in the background.
- Settings screen (sound, haptics, tilt hints, tilt sensitivity), History and Create tabs.
- Haptic feedback, animation and sound refinement, and accessibility.

---

## Phase 7: PWA Optimisation
- Web App Manifest, icons, service worker, offline play, update handling.
- Installability; landscape orientation lock for installed app; iOS and Android testing.

---

## Phase 8: Deployment & Launch
- Production hosting (https), domain, privacy-respecting analytics, error monitoring, launch preparation.

---

## Future: Native app (evaluate Capacitor when justified)
Keep the architecture portable. Game rules already live in plain TypeScript (`src/game/`), independent of the browser UI.
