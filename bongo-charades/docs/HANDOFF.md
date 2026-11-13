# BONGO CHARADES: HANDOFF TO CLAUDE CODE

**Prepared:** 2026-11-13, by the previous agent (Claude in Cowork)
**Owner:** Morals (Collins Godwin), a university student in Dar es Salaam who is learning software development
**Read this whole file before touching anything.**

---

## 0. TL;DR: your first job

1. The repo lives at **`~/Documents/Development`**. The git root is `Development/`; the app is `Development/bongo-charades/`.
2. You're on branch **`phase-4-polish`**. Its last commit is `b773f95` (first refinement pass).
3. **The second refinement pass (41 files) is NOT in the folder yet.** It's in `bongo-charades-second-pass.zip`, which the owner will give you alongside this file. Section 3 explains how to apply it, verify it and commit it.
4. Then run the tests and build (Section 4), help the owner do the real-phone checks (Section 8), and **wait for the owner's approval before starting Phase 5** (Section 9).

---

## 1. Your role and working rules (from the owner, mandatory)

You are continuing an existing project. You are **not** starting a new one. Think like a senior engineer, product manager, UX designer, QA engineer and content strategist working together.

1. **Inspect before changing.** Read the files and run the app. Never assume what is implemented.
2. **Preserve working functionality and the approved design.** Don't rewrite or redesign screens unnecessarily.
3. **Work in phases.** Finish the current stage before starting the next. **Don't start Phase 5 until the owner approves.**
4. **Git safety:**
   - Check the branch and `git status` first.
   - Never delete or rewrite history, never reset, never discard uncommitted work, never force-push.
   - **Don't push to GitHub without the owner's explicit approval.** The owner pushes `main` himself.
   - Use a separate branch for new work.
5. **Explain technical decisions in plain, beginner-friendly language.** For every change, say what changed, why, how it works, what to test and what's left.
6. **Verify everything.** Writing code doesn't make a feature done. Run tests, the build and the browser simulation. **Always distinguish** automated tests, browser simulation and **real-phone** tests, and never mark tilt or orientation as fully passed without a real-device test.
7. **Don't over-engineer.** No backend, accounts, Firebase or extra dependencies without a clear reason.
8. **Keep the docs current:** `PRODUCT_BRIEF.md`, `ARCHITECTURE.md`, `DEVELOPMENT_ROADMAP.md`, `DESIGN_HANDOFF.md`, `PROJECT_STATUS.md`, plus the reports.
9. **Never invent statistics or popularity claims.** Cite sources with dates for research.

Commit attribution used so far: commits are authored as `Collins Godwin <155245041+MORALS360@users.noreply.github.com>`, with a `Co-Authored-By: Claude …` trailer. Follow whatever convention your environment requires.

---

## 2. Product vision (summary of the owner's brief)

**Bongo Charades** is a social charades party game played as a mobile-first **PWA**. Tagline: **"Your culture. Your people. Your game."** It launches first in **Tanzania**, then expands to East Africa, Africa and international audiences.

**How it plays:**
- One player holds the phone **sideways on their forehead, screen facing friends**.
- Friends act out or describe the prompt.
- **Tilt DOWN = CORRECT, tilt UP = PASS.** Manual fallback exists.
- Score as many as possible before the timer ends.

**Identity comes from content:** prompts people actually recognise, remember and laugh about. It must not feel like a generic charades app with flags added. **The content library is a core product feature.**

**Audience:** Tanzanian young adults and social groups who like music, comedy, football, pop culture and nostalgia. It should still be playable by other ages and by people who don't know Tanzanian slang.

**Design direction (approved Claude Design export = source of truth):** files are in `bongo-charades/design/reference/` (PDF + HTML, 9 artboards).
- Vibrant purple gradient backgrounds (`#5A49DB → #7F66EE → #B493F6`), lavender elements.
- Rounded two-column category cards (group colours c1 `#7060E3`, c2 `#8A55E8`, c3 `#4F6BE0`).
- Bright yellow `#FFC83A` / orange accents, playful 3D-style SVG illustrations.
- Fonts: Baloo 2 (display) and Nunito Sans (body), bundled locally.
- Fixed bottom nav.
- **The Home screen sets the visual standard for every screen.**
- Avoid: dashboard look, dark gaming style, excessive gradients or glassmorphism, childishness, redesigns.

**Language rules:**
- UI language is **English** by default (a full Kiswahili UI may come later).
- **Category names keep their original Swahili or Tanzanian names and are never translated.**
- Prompt language (English / Kiswahili / Mixed) is a separate setting from UI language.

---

## 3. CURRENT STATE OF GIT, AND THE UNCOMMITTED WORK

### Branches (local repo at `~/Documents/Development`)
| Branch | Commit | What it is |
|---|---|---|
| `main` | `4cd77e4 phase 4` | Antigravity's phases 1–4. Pushed to `origin` (github.com/MORALS360/Bongo-charades) by the owner. |
| `phase-4-audit` | `200d9ed` | Phase 4 audit: gameplay engine connected end-to-end, tests added |
| `phase-4-polish` (current) | `b773f95` | Pre-Phase 5 refinement, first pass |

Neither `phase-4-audit` nor `phase-4-polish` has been pushed.

### Uncommitted
1. **`bongo-charades/vite.config.ts`**: the owner's own small edit (allows `*.trycloudflare.com` for phone testing via a Cloudflare tunnel). **Leave it as is**; ask before committing it.
2. **The second refinement pass is MISSING from the folder.** It was finished and tested in the previous agent's cloud workspace, but the connection to the laptop dropped before it could be written. All 41 changed or new files are in **`bongo-charades-second-pass.zip`**, at their paths relative to `bongo-charades/`. The zip also contains this handoff (as `docs/HANDOFF.md`) and `SECOND_PASS_CHECKSUMS.md5`.

### How to apply it
```bash
cd ~/Documents/Development/bongo-charades
git branch --show-current      # expect: phase-4-polish
git status --short             # expect only: M vite.config.ts
git log --oneline -1           # expect: b773f95 …
unzip -o /path/to/bongo-charades-second-pass.zip -d .
# verify every file arrived intact (works on macOS; prints "ALL OK" or the bad files):
python3 -c "import hashlib;bad=[f for h,f in (l.split() for l in open('SECOND_PASS_CHECKSUMS.md5')) if hashlib.md5(open(f,'rb').read()).hexdigest()!=h];print(bad or 'ALL OK')"
```

Then run the checks in Section 4. If they pass, commit **on `phase-4-polish`**. Leave `vite.config.ts` out unless the owner says otherwise. Delete `SECOND_PASS_CHECKSUMS.md5` from the folder after verifying; it isn't project code.
Suggested commit message: `Pre-Phase 5 refinement, second pass: calibration, landscape retry, installable app, instructions on Get Ready, minimal countdown, 450ms feedback, new Classic categories`.

If anything in the zip conflicts with what's on disk, **stop and ask the owner**. Don't overwrite their newer edits.

---

## 4. How to run and verify

```bash
cd ~/Documents/Development/bongo-charades
npm install          # needed: Vitest was added as a devDependency
npm test             # Vitest. Expected: 66 passed
npm run build        # tsc -b && vite build. Expected: clean
npm run lint         # oxlint. Expected: 0 warnings
npm run dev          # local dev server (owner tunnels it with cloudflared for phone tests)
```
**End-to-end browser simulation** (Playwright, fake clock; not installed as a dependency on purpose):
```bash
npm i -D playwright && npx playwright install chromium   # one time, ask owner first
npm run dev   # note the port
BASE_URL=http://localhost:5173 node tests/e2e/full-game-flow.mjs   # Expected: 41/41 checks passed
```
**On-phone diagnostics:** open the app with `?debug=1` before the `#` (e.g. `https://xxx.trycloudflare.com/?debug=1#home`). A strip at the bottom shows the orientation lock result, live tilt elevation, the calibrated baseline, the relative angle, tracker state, calibration result and the last action. In dev builds, `window.__bongoGame` (game state) and `window.__bongoDebug` are exposed for tests.

---

## 5. Architecture (verified)

**Stack:** React 19, TypeScript 7, Vite 8, oxlint, Vitest 5. CSS tokens and inline styles (no Tailwind). No backend. Hash routing. Local storage for setup.

```
bongo-charades/
├── design/reference/                 # approved design PDF + HTML (source of truth)
├── public/                           # fonts, manifest.webmanifest, icon.svg, icons/*.png
├── index.html                        # manifest + apple-touch icon links
├── scripts/content/build_prompts.py  # ★ human-friendly SOURCE of the prompt bank
├── docs/
│   ├── ORIENTATION.md                # landscape-lock platform matrix + sources
│   └── content/CONTENT_DIRECTION.md  # content rules, research ledger, review list
├── tests/e2e/full-game-flow.mjs      # Playwright browser simulation (41 checks)
└── src/
    ├── App.tsx                       # routes + wires game-session actions to screens
    ├── config/gameplay.ts            # ★ ALL tuning: FEEDBACK_MS, tilt presets, calibration
    ├── game/                         # ★ pure logic, unit-tested
    │   ├── gameSession.ts            # reducer: phases, scoring, team rotation, ranking, modes
    │   ├── promptDeck.ts             # seeded shuffle, no repeats until exhausted
    │   └── tilt.ts                   # screen-elevation maths, calibration, relative gestures
    ├── data/
    │   ├── categories.ts             # 29 categories (names never translated)
    │   ├── prompts.ts                # GENERATED from scripts/content/build_prompts.py
    │   └── prompts.test.ts           # content validation tests
    ├── hooks/                        # useGameSession, useGameSetup, useNavigation, useGameTimer,
    │                                 # useCountdown, useTiltControls, useCalibration, useIsPortraitPhone,
    │                                 # useCategorySelection
    ├── services/                     # orientation.ts, motionPermission.ts, soundEffects.ts, debug.ts
    ├── pages/                        # Home, Categories, PlayMode, GameSetup, ForeheadReady (Get Ready),
    │                                 # Calibration, Countdown, Gameplay, RoundTransition, Results, Pending
    ├── components/                   # ui/, layout/ (AppShell, BottomNav, DebugPanel), gameplay/,
    │                                 # illustrations/ (CategoryIcon: one SVG per category)
    └── styles/design-tokens.css
```

**Game flow:**
```
#home → #categories → #play-mode ─┬─ Quick Play ───────────────┐
                                  └─ Teams → #setup → Start ───┤
                                                               ▼
   #forehead (Get Ready, all instructions) → "I'm Ready" → #calibrate ("Hold still…")
   → #countdown (numbers ONLY) → #gameplay (prompt + timer only)
   → Teams: #transition (between teams) … → #results   |   Quick Play: #results
```

**Key design decisions:**
- **One engine, two modes.** `config.mode` is `'quick' | 'teams'`. Quick Play is a game with one participant, so there's no duplicated logic.
- **The reducer is the referee.** Screens only report events (`ANSWER` with a `promptId`, `TIME_UP`, …). Duplicate or late answers are ignored in the reducer, and also guarded in the UI.
- **In-game routes use `history.replaceState`.** The Back button leaves the game, and a direct `#gameplay` URL with no game redirects to setup.
- **Tilt maths:** `elevation = asin(cos β · cos γ)` gives +90 for screen to ceiling, 0 upright, −90 screen to floor. It works in either landscape direction.
- **Calibration** records the player's neutral angle. Gestures are relative to it, with smoothing (EMA), a hold time, hysteresis (fire ±30°, re-arm within ±12°), a cooldown and slow drift following. All values are in `src/config/gameplay.ts`.
- **Answer feedback:** score immediately, then a full-screen green (Correct) or red (Pass) overlay for `FEEDBACK_MS` (450 ms). The next prompt is hidden and input is ignored until it ends.
- **Orientation:** fullscreen + `screen.orientation.lock('landscape')` on taps (start, I'm Ready, next team, play again), touch devices only. Released when leaving the landscape stages. A "Turn your phone sideways" screen pauses the countdown, the timer and tilt when the phone is upright.
- **Prompt language:** translation pairs share a `concept`, and only one version is dealt per game (EN / SW / random for Mixed). Untranslated prompts are always kept, so Tanzanian categories stay in Kiswahili.

---

## 6. Everything done so far

**Phases 1–3 (Antigravity):** design system, Home, Categories, Game Setup.
**Phase 4 (Antigravity, incomplete):** screens existed but weren't wired together, and the build was failing.

**Phase 4 audit (`200d9ed`):**
- Connected the full loop, added the game-session reducer and rewrote the prompt deck.
- Fixed the forehead tilt maths, the duplicate/late-answer guards, tie ranking and the category-filter fallback.
- Added Vitest, the e2e script and `PHASE_4_ACCEPTANCE_REPORT.md`.

**Refinement, first pass (`b773f95`):**
- Auto-landscape attempt plus rotate fallback.
- Play Mode screen with **Quick Play** and **Teams**. Teams default to 2; players can add or remove teams, up to 8.
- Clean prompt screen, with manual buttons only when there's no sensor data, plus keyboard controls.
- Full-screen Correct/Pass feedback.
- **Vijiweni merged into Mtaani; new Zilipendwa category** (researched Tanzanian throwback songs).
- Content identity per group; visual consistency (gradient pinned to the viewport, panels matching the Home cards).

**Refinement, second pass (IN THE ZIP, not yet committed):**
- Landscape lock retried on "I'm Ready".
- **Installable app:** `manifest.webmanifest` with `display: "fullscreen"`, plus real icons.
- `?debug=1` diagnostics.
- **Tilt calibration stage**, with every tuning value in one config file.
- **Feedback 450 ms.**
- **All instructions on Get Ready.** The countdown shows only 3/2/1/GO. The Quick Play info bubble is removed; Teams keeps the plain line "Team 1 of 3 · name".
- **Classic Charades expanded:**
  - Countries (countries only)
  - **Famous Landmarks**
  - **Car Brands** (brands only; the owner narrowed it from "Cars & Vehicles" to "Cars" to "Car Brands")
  - **Famous Brands**
- **African Music → African Music & Artists**, Africa-wide with no Tanzanian artists.

**Test status (second pass, cloud workspace):** 66/66 unit tests, 41/41 e2e checks (3 runs), build and lint clean.

---

## 7. Content: categories and direction (owner decisions, do NOT reverse)

**29 categories:**

**A. Classic Charades (11): universal, English-led, simple natural Kiswahili translations of the *same* idea**
Animals · Movies & TV · Music & Artists · Sports · Countries · Famous Landmarks · Car Brands · Famous Brands · Everyday Things · Act It Out · Food & Drinks

**B. Bongo & Tanzanian Culture (12): Tanzanian only, Kiswahili-led, natural Tanzanian phrasing (don't force English)**
Hii Dar Yetu · Daladala Diaries · Bongo Flava · Mtaani · **Zilipendwa** · Chakula Chetu · Watu Maarufu · Movie za Bongo · Mpira & Mashabiki · Chuo Life · Mapenzi & Mahusiano · Shughuli za Familia

**C. East Africa & Beyond (6): Africa-wide and international, English-led, not another Tanzanian group**
East African Vibes · African Icons · **African Music & Artists** · African Cities · Pop Culture · Throwback Hits

**Specific rules:**
- **Vijiweni** no longer exists. Its prompts were merged into **Mtaani**. (The owner sometimes types "Vijueni"; he means Vijiweni.)
- **Zilipendwa** = Tanzanian throwback **songs**, with the artist shown as a `hint`, across 1970s/80s dansi, 1990s, the 2000s Bongo Flava era and about 10 years ago. Don't confuse it with Throwback Hits.
- **Throwback Hits** = African and international throwbacks.
- **Bongo Flava** = artists **plus** songs, current hits and music culture (not just names). Tanzanian artists stay here, not in African Music & Artists (test-enforced).
- **Countries** = countries only (test-enforced).
- **Car Brands** = brands only, with no overlap with Famous Brands (test-enforced).

**Prompt quality:** short (≤4 words, test-enforced); one word where possible; actable; no obscure references; no duplicates or near-duplicates anywhere (test-enforced, ignoring case and spaces); culturally accurate; natural Kiswahili and English. Song titles carry a `hint`.

**Schema:** `{ id, text, categoryId, language: 'en'|'sw'|'mixed', concept?, hint?, needsReview? }`. `mixed` means any-language (names/titles) or a natural blend.

**How to edit content:** edit `scripts/content/build_prompts.py` → run `python3 scripts/content/build_prompts.py` (it rewrites only the PROMPTS array in `src/data/prompts.ts`) → run `npm test`.

**Current size:** 578 entries / ~489 distinct prompt ideas. **9 prompts are flagged `needsReview`:** slang in Mtaani (Kupiga Pamba, Utajua Hujui, Haina Kufeli), Maria Salome (Zilipendwa), Huba / Jua Kali / Ze Comedy (Movie za Bongo), Sapu (Chuo Life). The full list and research ledger are in `docs/content/CONTENT_DIRECTION.md`.

---

## 8. Still to do BEFORE Phase 5 (owner must verify on real phones)

The owner tests through a Cloudflare tunnel (https), using `?debug=1`.
1. **Android Chrome:** Quick Play → the phone goes fullscreen and rotates by itself (debug shows `lock: locked`). At the end it returns to portrait.
2. **Android installed app** (Add to Home screen): repeat test 1. This is expected to be the most reliable route.
3. **iPhone:** a website **cannot** rotate the phone. Expect the "Turn your phone sideways" screen, then the game continues once the phone is rotated. Control Centre rotation lock must be OFF.
4. **Calibration:** I'm Ready → "Hold still…" → 3-2-1 within about 1–2 s (debug: `calib still …°`).
5. **Gestures:** a clear nod down = CORRECT once, a tilt back = PASS once, small movements ignored, a held tilt fires once.
6. **Tune `src/config/gameplay.ts`** if gestures feel stiff or twitchy (`correctTriggerDeg`, `passTriggerDeg`, `rearmDeg`, `holdMs`, `FEEDBACK_MS`).
7. Play the new categories.
8. **The owner hasn't yet said which phone and browser he tested landscape on.** Ask. It decides whether the lock "failed" or simply "isn't allowed".

**Platform limits (don't try to work around them; see `docs/ORIENTATION.md`):** iOS/iPadOS has no lock; Chrome 136+ refuses the lock on Android tablets; the lock requires fullscreen. Never fake landscape with CSS rotation.

**Known limitations (Phase 6+):**
- Refreshing mid-game ends the game.
- No pause or quit button (Back exits).
- The timer doesn't pause when the app goes to the background.
- The Settings, Create and History tabs are placeholders.
- No service worker / offline yet.
- `TiltButton.tsx` and `ScorePill.tsx` are unused but kept.

---

## 9. Phase 5: Cultural Research & Prompt-Bank Development (NEXT, only after owner approval)

**Don't add new categories.** Improve the content inside the existing 29.
- **Research first.** Sources: Spotify/Apple/YouTube charts (Tanzania and Africa), editorial playlists, Tanzanian and East African entertainment media. Cover music (current and nostalgic, across age groups), daladala/bodaboda/bajaji life, markets, food, school and university, weddings, football, slang (Tanzanian; Sheng only where relevant, carefully), personalities and nostalgia. Don't reduce Tanzania to Dar es Salaam.
- **Research quality:** never invent stats or "most popular" claims. Record each source, the date, and whether it's a chart or editorial. Distinguish popularity from familiarity, and record uncertainty. Use current sources for trends and historical ones for nostalgia.
- **Prompt design:** every prompt should have a reason to exist: recognisable, relevant, actable, accurate, appropriate, not obscure, not duplicate, works in its language, durable. Mix people, places, objects, activities, expressions, music, entertainment and situations; avoid categories that are all celebrity names.
- **Difficulty:** add `difficulty: 'easy'|'medium'|'hard'` (hard = harder to act, *not* obscure).
- **Volume:** about 15–25 quality prompts per category. Fewer is fine if the category can't support that many strong ones. Prioritise the Bongo group.
- **Copyright and safety:** no lyrics or scripts; no defamatory content; party-appropriate.
- **Deliverables:**
  - a research report and source ledger (kept separate from app data)
  - the curated prompt bank, with schema and difficulty strategy
  - language strategy
  - validation and duplicate process (extend `src/data/prompts.test.ts`)
  - the human-review list
  - integration into the app
  - tests proving prompt selection is correct
- **Known gaps to fill:**
  - current 2025–26 Bongo Flava hits (from chart data)
  - current-popularity check for African Music & Artists
  - the `needsReview` list
  - deeper Mtaani/slang research
  - difficulty levels

## 10. Roadmap after Phase 5 (don't start early)
- **Phase 6, gameplay polish and user testing:** real group play-tests, pause/quit, background pause, Settings screen (tilt presets already exist in config), sound and haptics, accessibility, History and Create tabs.
- **Phase 7, PWA optimisation:** service worker and offline, caching, performance, update handling, iOS and Android testing. The manifest and icons are already done.
- **Phase 8, deployment and launch:** https hosting, domain, privacy-respecting analytics, error monitoring.
- **Future:** native apps by evaluating Capacitor on the existing React app. Keep the architecture portable; game logic already lives in plain TypeScript (`src/game/`).

## 11. Reference documents in the repo
`PRODUCT_BRIEF.md` · `ARCHITECTURE.md` · `DESIGN_HANDOFF.md` · `DEVELOPMENT_ROADMAP.md` · `PROJECT_STATUS.md` · `PHASE_4_ACCEPTANCE_REPORT.md` · `PRE_PHASE5_REFINEMENT_REPORT.md` (both passes) · `docs/ORIENTATION.md` · `docs/content/CONTENT_DIRECTION.md` · `design/reference/*`

## 12. Suggested first message back to the owner
Confirm the folder, branch and git status you found. Confirm the zip applied cleanly and the checksums matched. Report the test, build and e2e results. Ask which phone and browser he tests on. Then walk him through the Section 8 device checks. Don't start Phase 5 until he says so.
