# Bongo Charades — Phase 5 Content Audit

**Date:** 2026-11-14 · **Bank version:** Phase 5 (generated from `docs/content/research/curation/*/*.txt`)
**Before Phase 5:** 578 prompts / 489 ideas, 12–32 ideas per category, songs up to about 2022.
**After Phase 5:** **4,179 prompts / 3,738 ideas**, 61–190 ideas per category.

An *idea* counts an English–Kiswahili pair once ("Lion" / "Simba" = 1 idea, 2 prompts).

---

## 1. Ideas per category

Confidence: **H** High · **M** Medium · **V** Needs local verification (ships with `needsReview: true`).

| Group | Category | Ideas | H | M | V | Easy / Medium / Hard | Target met? |
|---|---|---|---|---|---|---|---|
| Classic | Animals | 109 | 0 | 109 | 0 | 73 / 31 / 5 | Yes (common knowledge) |
| | Movies & TV | 127 | 35 | 84 | 8 | 84 / 39 / 4 | Yes |
| | Music & Artists | 150 | 53 | 94 | 3 | 58 / 84 / 8 | Yes |
| | Sports | 119 | 49 | 68 | 2 | 65 / 50 / 4 | Yes |
| | Countries | 121 | 119 | 2 | 0 | 75 / 39 / 7 | Yes |
| | Famous Landmarks | 101 | 29 | 70 | 2 | 29 / 42 / 30 | Yes |
| | Car Brands | 61 | 10 | 48 | 3 | 27 / 23 / 11 | Approved exception (60–70) |
| | Famous Brands | 111 | 23 | 77 | 11 | 66 / 39 / 6 | Yes |
| | Everyday Things | 113 | 0 | 112 | 1 | 102 / 11 / 0 | Yes (common knowledge) |
| | Act It Out | 119 | 0 | 119 | 0 | 104 / 15 / 0 | Yes (common knowledge) |
| | Food & Drinks | 115 | 0 | 114 | 1 | 88 / 22 / 5 | Yes (common knowledge) |
| Bongo | Bongo Flava | 190 | 70 | 118 | 2 | 12 / 146 / 32 | Yes |
| | Zilipendwa | 181 | 92 | 44 | 45 | 10 / 127 / 44 | Yes |
| | Mpira & Mashabiki | 174 | 12 | 122 | 40 | 58 / 74 / 42 | Yes |
| | Mtaani | 153 | 0 | 78 | 75 | 79 / 60 / 14 | Yes, if most slang is kept |
| | Chakula Chetu | 133 | 18 | 100 | 15 | 100 / 18 / 15 | Yes |
| | Chuo Life | 124 | 9 | 97 | 18 | 94 / 25 / 5 | Yes |
| | Hii Dar Yetu | 122 | 40 | 77 | 5 | 40 / 74 / 8 | Yes |
| | Movie za Bongo | 122 | 6 | 70 | 46 | 46 / 28 / 48 | Yes, if most review items are kept |
| | Shughuli za Familia | 119 | 0 | 111 | 8 | 96 / 20 / 3 | Yes |
| | Daladala Diaries | 107 | 2 | 100 | 5 | 96 / 9 / 2 | Yes |
| | Mapenzi & Mahusiano | 105 | 0 | 99 | 6 | 91 / 13 / 1 | Yes |
| | Watu Maarufu | 81 | 9 | 40 | 32 | 12 / 41 / 28 | **No — approved "under 100 with reason"** |
| East Africa & Beyond | African Music & Artists | 190 | 73 | 84 | 33 | 10 / 138 / 42 | Yes |
| | Throwback Hits | 170 | 9 | 82 | 79 | 62 / 87 / 21 | Yes, if most review items are kept |
| | African Icons | 148 | 51 | 89 | 8 | 9 / 75 / 64 | Yes |
| | Pop Culture | 142 | 18 | 92 | 32 | 62 / 69 / 11 | Yes |
| | East African Vibes | 126 | 25 | 89 | 12 | 36 / 45 / 45 | Yes |
| | African Cities | 105 | 59 | 46 | 0 | 27 / 42 / 36 | Yes |
| | **Total** | **3,738** | **811** | **2,435** | **492** | | 27 of 29 at 100+ |

**Watu Maarufu (81):** I stopped where I could no longer name people I was confident are widely known, are not musicians or actors (those have their own categories), and are uncontroversial. Sitting politicians other than the President are left out on purpose.

**Car Brands (61):** brands only (owner rule), including trucks, buses and Chinese brands. About 60–70 is the approved target.

## 2. Bank-wide mix

| Measure | Split |
|---|---|
| Language (prompts) | Mixed / any language 2,342 · Kiswahili 1,358 · English 479 |
| Difficulty (prompts) | Easy 2,098 · Medium 1,536 · Hard 545 |
| Shelf (prompts) | Evergreen 3,594 · Nostalgia 455 · Trending 130 |
| Kind (prompts) | thing 947 · person 758 · action 660 · place 549 · song 530 · food 280 · brand 180 · title 173 · phrase 102 |
| Needs review (prompts) | 496 (492 ideas; some are pairs) |

Kiswahili-led for Bongo, English-led with Kiswahili pairs for Classic, English-led for East Africa & Beyond. The language-direction tests in `src/data/prompts.test.ts` enforce this.

## 3. Rules the bank follows (all tested automatically)

- Every category has 100+ ideas, except Car Brands (≥ 55) and Watu Maarufu (≥ 75).
- Max 4 words; a prompt marked `longTitle` (really famous title) may have up to 6.
- The same text may appear more than once only when the hint lines differ. Example: "Nairobi" the city, and "Nairobi" with "Marioo ft. Bien" under it. Shared titles must stay under 2% of the bank.
- Every song shows its artist as a hint. Throwback Hits holds songs only.
- Countries holds places only, none of them also a city or landmark.
- African Music & Artists has no Tanzanian main artist; a Tanzanian guest is allowed.
- Every prompt has `difficulty`, `kind` and `shelf`, and a stable content-based id.

## 4. What changed for existing prompts

- **All 489 pre-Phase 5 ideas were kept.** Four changed category:
  - "Mwana" and "Hawajui" went from Zilipendwa to Bongo Flava (2014 rule).
  - "Professor Jay" and "Lady Jaydee" went from Watu Maarufu to Zilipendwa (musicians rule).
- Throwback songs from African Music & Artists ("Vulindlela", "Aïcha", "Tamally Maak", "Johnny") went to Throwback Hits (2013 rule).
- "Fela Kuti" and "Miriam Makeba" went from African Icons to African Music & Artists.
- "Maria Salome" (Saida Karoli) lost its review flag after being confirmed by the artist's reference page.

## 5. Shared titles (told apart by the hint line)

The checker lists every case in the generated `*_GROUP_CURATION.md` files. Examples:
- Songs that share a title with a place or thing: Nairobi, Mombasa, Malaika, DJ, Banana, Phone, Sukari, Honey, Water, Umbrella, Msumari, Kipepeo.
- Two different songs with one title: Baridi, Salome.
- Others: Duma (cheetah / actor), Bahasha (envelope / film), Turkey (country / bird), Apple (fruit / brand), Roger Milla (footballer / song).

## 6. Owner review workload

**492 ideas** are on the tick-lists. Unanswered items play normally, marked `needsReview`.

| Tick-list | Ideas | Largest parts |
|---|---|---|
| [`BONGO_OWNER_REVIEW.md`](research/curation/BONGO_OWNER_REVIEW.md) | 297 | Mtaani slang 75, Movie za Bongo 46, Zilipendwa 45, Mpira 40, Watu Maarufu 32 |
| [`AFRICA_OWNER_REVIEW.md`](research/curation/AFRICA_OWNER_REVIEW.md) | 164 | Throwback Hits 79, African Music 33, Pop Culture 32 |
| [`CLASSIC_OWNER_REVIEW.md`](research/curation/CLASSIC_OWNER_REVIEW.md) | 31 | Tanzanian brands, telenovelas, a few Kiswahili words |

Separately from the tick-lists, the **Kiswahili wording** of about 450 Classic pairs should be read through once.

## 7. Keeping the content current

| Shelf | Prompts | Re-check | Next due |
|---|---|---|---|
| Trending | 130 | Every 3 months, against the same chart sources | **2027-02-14** |
| Evergreen | 3,594 | Once a year | 2027-11-14 |
| Nostalgia | 455 | Once a year | 2027-11-14 |

**How to update (no code knowledge needed beyond running commands):**

1. Edit the lists in `docs/content/research/curation/<group>/<category>.txt`.
2. Run `python3 scripts/content/check_candidates.py bongo` (or `africa` / `classic`). It reports duplicates, over-long prompts and clashes, and rebuilds the tables and tick-lists.
3. Run `python3 scripts/content/build_prompts.py` to regenerate `src/data/promptBank.ts`.
4. Run `npm test`. The content tests must pass.
5. Add any new source to `docs/content/research/SOURCES.md`.

Never edit `promptBank.ts` by hand.

## 8. Known gaps

- **Current slang and memes are unsourced.** Social media was not readable.
- **Throwback Hits**: most African classics come from memory and are on the tick-list.
- **Hard prompts are scarce** in Act It Out (0), Everyday Things (0) and Daladala Diaries (2). Balanced dealing simply has fewer hard prompts there; that is acceptable for easy categories.
- **Some song years are unconfirmed.** Four songs placed in Bongo Flava may be from 2013 or earlier: Nitakupwelepweta, Mfalme, Moyo Mashine, Nashindwa.
