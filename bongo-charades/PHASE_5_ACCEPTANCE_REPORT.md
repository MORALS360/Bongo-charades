# Bongo Charades — Phase 5 Acceptance Report

**Date:** 2026-11-14
**Work location:** worktree branch `claude/bongo-charades-phase-4-c0f2f7` (based on `267f7c1`). Not yet merged into `phase-5-content`, not committed, not pushed.
**Reviewer:** Claude, for owner review.

**Verdict:** Phase 5 is **complete in the browser and in automated tests**, with two open items that only the owner can close:
1. The review tick-lists: 492 ideas, marked `needsReview`, play normally.
2. A real-phone game with the new content.

**Recommendation:** ready to move to Phase 6 once the work is committed and the owner has played one real game on a phone. The tick-lists can be finished during Phase 6 play-testing.

Status words: **PASS** = met and checked · **PARTIAL** = met with a stated limit · **OWNER** = needs the owner · **NOT RUN** = could not be run here.

---

## 1. Final acceptance criteria (from the Phase 5 brief)

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | Repository audited | PASS | Stage 1 audit (approved) |
| 2 | Research methodology documented | PASS | `docs/content/PHASE_5_RESEARCH_STRATEGY.md`, `docs/content/PHASE_5_RESEARCH_REPORT.md` §1 |
| 3 | Sources documented and traceable | PASS | `docs/content/research/SOURCES.md`: 57 sources with dates, region, how much was read, limits, failed sources. Every curated prompt names its source numbers (or `GK` for common knowledge) |
| 4 | Three groups keep their identities | PASS | Language-direction tests; boundary rules in each `*_CURATION_NOTES.md` |
| 5 | Categories populated with researched prompts | PASS (owner target) / PARTIAL | 3,738 ideas. 27 of 29 categories have 100+. Car Brands (61) and Watu Maarufu (81) are approved exceptions with reasons recorded |
| 6 | Tanzanian content culturally authentic | OWNER | Researched from Tanzanian charts, awards, press and an academic slang study, but cultural authenticity needs a Tanzanian check: 297 Bongo ideas are on the tick-list |
| 7 | African content represents the continent | PASS | African Music & Artists: West 34% · East 26% · Southern 23% · Central 12% · North 6% (all within the agreed limits). Icons, cities and throwbacks cover all five regions |
| 8 | Classic content globally recognisable | PASS | UN list, wonder lists, brand rankings, box office, most-streamed; Kiswahili pairs for most ideas |
| 9 | Prompts concise and playable | PASS | Test: max 4 words (6 for marked famous titles); every song has its artist hint |
| 10 | Duplicates and wrong categories addressed | PASS | Checker and tests: exact and near-duplicates (accents, spaces, punctuation ignored); same text allowed only with different hints; category boundary tests |
| 11 | Prompt metadata consistent | PASS | Test: every prompt has `difficulty`, `kind`, `shelf` and a stable content-based `id` |
| 12 | New sessions shuffle independently | PASS | Fisher–Yates with a fresh seed per game and per Play Again; tests show different orders and a fair first card; seen in the browser |
| 13 | No repeats within a session before exhaustion | PASS | Tests; browser: 46 prompts across two teams, 46 unique |
| 14 | Recent history reduces repetition across sessions | PASS | Tests; browser: after a full page reload, the 46 played prompts were dealt in the last 46 places of a 445-card pile |
| 15 | Teams share the same session deck | PASS | Tests; browser Teams game drew from one deck |
| 16 | Existing gameplay still works | PASS (browser) / OWNER (device) | All Phase 4 tests pass; Quick Play and Teams games played to the results screen in the browser. Not yet played on a real phone with the new content |
| 17 | Tests pass | PASS | `npm test`: 91 tests |
| 18 | Production build succeeds | PASS | `npm run build` clean; `npm run lint` 0 warnings |
| 19 | Docs and acceptance reports updated | PASS | See §4 |

## 2. Randomisation requirements (brief, Part 7)

| Requirement | Status | How |
|---|---|---|
| A. Fresh shuffle each session, first prompt not fixed | PASS | `game/dealing.ts` `dealOrder`; test "every prompt has a fair chance to come first" |
| B. No repeats within a session; teams share one deck | PASS | One deck per game in `game/gameSession.ts`; reshuffle only after exhaustion, never the same card twice in a row |
| C. Cross-session history, configurable window, graceful relaxation | PASS | `game/playHistory.ts`. The phone remembers the last 600 ideas (`config/dealing.ts`). Remembered ideas go to the bottom of the pile, oldest first, so a small category never becomes unusable. History is one list keyed by idea; since every idea belongs to one category, this works per category automatically |
| C. Owner request: a way to forget history | PASS | "Forget" link on the Play Mode screen, with a confirmation step (checked in the browser) |
| D. Avoid clusters (artists, decades, difficulty, categories) | PASS / PARTIAL | Balanced shuffle: no artist twice within 6, no 3 of a minority kind, decade or hard prompt in a row, no 3 from one category when several are chosen. In tests: 0 clumps in the first 40 cards across all 29 categories, against about 7% with a plain shuffle. **Limit:** runs of *easy* prompts are not broken up; English/Kiswahili order in Mixed mode is random per idea, not balanced |
| E. Tests incl. persistence after reopening | PASS | Unit tests with a fake storage; browser test across a full page reload |
| Finite bank limits documented | PASS | §5 below |

## 3. How it was tested

| Kind | What | Result |
|---|---|---|
| Automated (Vitest) | 91 tests: content rules (20), dealing and balance (15), history (6), plus the existing game-session, deck and tilt tests (50) | All pass |
| Content checker | `scripts/content/check_candidates.py` for all three groups | 0 problems |
| Browser (desktop browser pane, phone-sized window) | Quick Play across three categories; Teams game with two 30 s rounds to the results screen; Play Again; page reload; Forget button | All behaved as designed |
| Browser simulation script (`tests/e2e/full-game-flow.mjs`) | Needs Playwright, which is not installed | **NOT RUN** (installing it needs the owner's OK) |
| Real phone | Tilt, landscape, motion permission with new content | **OWNER**: not done |
| Offline | The app has no service worker yet (Phase 7) | Not applicable |

## 4. Documentation

- **Created:**
  - `docs/content/PHASE_5_RESEARCH_REPORT.md`
  - `docs/content/PHASE_5_CONTENT_AUDIT.md`
  - this report
  - the source registry `docs/content/research/SOURCES.md`
  - evidence files per group
  - curation notes and owner tick-lists
- **Updated:** `PRODUCT_BRIEF.md`, `ARCHITECTURE.md`, `DEVELOPMENT_ROADMAP.md`, `PROJECT_STATUS.md`, `README.md` (replacing the Vite template text), `docs/content/CONTENT_DIRECTION.md` (points to the new process).

## 5. Known limits

1. **A finite bank repeats eventually.** With 600 remembered ideas, a group playing one category every night will see repeats after the category's fresh prompts are used (about 100–190 per category). The system then deals the oldest-played prompts first instead of failing.
2. **History is per phone and per browser.** A different phone, or clearing the browser's data, starts fresh. Nothing is sent anywhere.
3. **Content will date.** 130 prompts are marked trending; next review is due 2027-02-14 (see the content audit §7).
4. **Download size grew.** The app bundle is about 900 KB (159 KB compressed), mostly prompt text. Acceptable now; worth compacting in Phase 7 together with offline support.
5. **Social media and current slang could not be researched** by automated reading.

## 6. Owner actions before or during Phase 6

1. Play one real game on a phone with the new content (Teams, Mixed language).
2. Work through the tick-lists, starting with Mtaani (75), Throwback Hits (79) and Movie za Bongo (46). Send the answers as Keep / Fix / Drop; the lists are then updated and the bank rebuilt.
3. Read the Classic Kiswahili pairs once for wording.
4. Decide on the remaining git steps:
   - commit this work;
   - merge it into `phase-5-content`;
   - whether to keep the uncommitted `vite.config.ts` comment change in the main folder;
   - whether to push.
5. Optional: allow installing Playwright so the browser simulation script can run again.
