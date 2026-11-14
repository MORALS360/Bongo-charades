# Bongo Charades

A phone party game with a Tanzanian heart. One player holds the phone sideways on their forehead, friends act out, describe or sing the prompt, and the player tilts the phone **down for Correct** or **up for Pass** before the timer runs out.

- **29 categories in 3 groups:**
  - **Classic Charades:** universal, English with Kiswahili pairs.
  - **Bongo & Tanzanian Culture:** Kiswahili-led, e.g. Bongo Flava, Zilipendwa, Mtaani, Daladala Diaries, Chakula Chetu.
  - **East Africa & Beyond:** Africa-wide and international.
- **3,738 researched prompt ideas**, with English, Kiswahili or Mixed prompts.
- **Quick Play** (one shared score) or **Teams** (2–8 teams, one round each).
- **Every game deals a fresh, balanced order**, and the phone remembers recently played prompts so the next game starts with new ones.
- Runs in the browser and can be installed to the home screen. No account, no server: everything stays on the phone.

## Run it

```bash
npm install        # once
npm run dev        # local dev server (open the printed address)
npm test           # automated tests (Vitest)
npm run lint       # code checks (oxlint)
npm run build      # production build into dist/
```

To test tilt on a real phone, the page must be served over https (for example through a Cloudflare quick tunnel; see `docs/ORIENTATION.md`). Add `?debug=1` to the address to see live tilt angles.

## Changing the prompts

Prompts are **not** edited in the code. The source is one text file per category:

```
docs/content/research/curation/<group>/<category>.txt
```

1. Edit the list. Each line is `text ; hint ; settings`, and `English | Kiswahili` makes a translation pair. Each file explains its rules at the top.
2. Check it: `python3 scripts/content/check_candidates.py bongo` (or `africa`, `classic`).
3. Build it: `python3 scripts/content/build_prompts.py`. This regenerates `src/data/promptBank.ts`; never edit that file by hand.
4. Run `npm test`.

The rules, numbers and review schedule are in `docs/content/PHASE_5_CONTENT_AUDIT.md`.

## Where things are

| Path | What |
|---|---|
| `src/game/` | Game rules, deck, dealing and play history: plain TypeScript with unit tests |
| `src/config/gameplay.ts`, `src/config/dealing.ts` | All tuning numbers (tilt, feedback, history size, balance rules) |
| `src/pages/`, `src/components/` | Screens and UI pieces |
| `src/data/` | Categories and the generated prompt bank |
| `docs/content/` | Research strategy, source registry, evidence, curated lists, reports |
| `ARCHITECTURE.md` | How the code fits together |
| `PROJECT_STATUS.md`, `DEVELOPMENT_ROADMAP.md` | Where the project stands and what comes next |
| `PHASE_5_ACCEPTANCE_REPORT.md` | Latest acceptance report |

## Tech

React 19, TypeScript, Vite 8, Vitest, oxlint. Fonts: Baloo 2 and Nunito Sans (self-hosted, SIL Open Font License).
