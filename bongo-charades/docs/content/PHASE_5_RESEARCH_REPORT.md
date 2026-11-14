# Bongo Charades — Phase 5 Research Report

**Date:** 2026-11-14 · **Stages covered:** 2 (strategy), 3A / 3B / 3C (research)
**Related files:** [`PHASE_5_RESEARCH_STRATEGY.md`](PHASE_5_RESEARCH_STRATEGY.md) · [`research/SOURCES.md`](research/SOURCES.md) (57 numbered sources) · evidence files per group in [`research/`](research/)

This report explains how the prompt bank was researched, what the evidence showed, and where it is weak. The per-category numbers are in [`PHASE_5_CONTENT_AUDIT.md`](PHASE_5_CONTENT_AUDIT.md).

---

## 1. Method

Every prompt had to pass three questions (strategy §1):

| Question | Meaning |
|---|---|
| Popular / documented? | There is evidence it exists and matters: a chart, an award, a reference work. |
| Familiar? | Ordinary players would recognise it, not only fans. |
| Playable? | It can be acted out, described or hummed quickly, in 4 words or fewer (6 for really famous titles). |

**Confidence levels**, recorded for every prompt in the curation lists:
- **High:** an official chart, award record or reference list, or two independent sources.
- **Medium:** one editorial source, or common knowledge with no dated source (marked `GK`).
- **Needs local verification:** I could not confirm it, or it is a judgement call. These ship with `needsReview: true` and are listed for the owner.

**Universal Classic content** (animals, household objects, actions) is common knowledge. As agreed in Stage 2, it has a category-level method instead of one source per prompt.

**Work was done group by group**, with an approval stop after each step: Bongo (3A/4A) → East Africa & Beyond (3B/4B) → Classic (3C/4C).

## 2. Sources used

57 sources are registered in [`research/SOURCES.md`](research/SOURCES.md). Each entry has its publication date, access date, region, what it proves, how much of it was read (Full / Part / Summary only) and its limits. Failed sources are listed too.

| Kind of source | Examples | Used for |
|---|---|---|
| Charts (dated snapshots saved in `research/data/`) | YouTube weekly charts for Tanzania, Kenya, Uganda, Nigeria, South Africa (week ending 2026-11-05); Spotify weekly for Nigeria, South Africa, Egypt, Morocco (2026-11-12); Apple Music Top Songs of 2025 Tanzania | What is popular now |
| Year-end and award records | Spotify Wrapped Tanzania 2025 (via The Citizen); Tanzania Music Awards 2010–13, 2023, 2024; Grammy Best African Music Performance 2024–26; Headies; Billboard U.S. Afrobeats number ones; CAF/African Footballer of the Year 1970–2025; Nobel laureates | Lasting popularity |
| Editorial rankings and history | Notjustok's 100 best Tanzanian songs 2012–22; OkayAfrica Bongo Flava classics; Afropop Worldwide primers; Music In Africa history of Bongo Flava; The Citizen on taarab and daladala life | Nostalgia and familiarity |
| Academic | Reuster-Jahn & Kießling, *Lugha ya Mitaani* (2006), a 1,100-word Tanzanian street-language dictionary | Mtaani slang |
| Reference lists | UN members; UNESCO African sites; wonder lists; brand-value rankings (Kantar 2026, Interbrand 2025); box office and Netflix views; Spotify most-streamed; Olympic sports; Forbes athletes 2025–26 | Classic and pan-African fame |
| Market data (search summaries only) | Focus2Move and others on Tanzania's car market | Which car brands Tanzanians know |

**No live service is used by the app.** All content ships inside it.

## 3. What the research found

### Bongo & Tanzanian Culture
- **The old bank stopped at about 2022.** None of 2025's top ten songs was in the game. Spotify Wrapped and Apple Music agreed on the 2025 hits (Pawa, Me Too, Furaha, Nairobi, Tunapendana…). These are now in.
- **Gospel is a large share of what Tanzania plays on YouTube.** The owner decided to keep it out of Bongo Flava.
- **The 1970s–80s are documented by band and musician, rarely by song title.** The owner allowed bands, legends and dance styles in Zilipendwa; older song titles from memory are on the review list.
- **The only written record of street language is from 2006.** Every slang word is on the owner's "still used?" list. Current slang could not be sourced; social media is closed to automated reading.
- **Six categories are lived experience** that is rarely written down: Chuo Life, Daladala Diaries, Mapenzi & Mahusiano, Shughuli za Familia, Movie za Bongo and Watu Maarufu. They rest mainly on general knowledge marked for review (owner decision).

### East Africa & Beyond
- **African charts are very local.** Of six countries' charts, only two songs were on all six. Familiarity in Tanzania was judged mainly from awards, long-running hits, and African songs that chart inside Tanzania.
- **North African charts are almost all local Arabic-language music.** The owner lowered the North Africa floor in African Music & Artists from 10% to 5%.
- **Throwback Hits and Pop Culture have the weakest evidence.** No dated list of African classics was read, and nothing documents East African trends.

### Classic Charades
- **Toyota dominates Tanzania's roads**, followed by Suzuki, Isuzu, Nissan, Ford and Ashok Leyland, with Chery rising. This came from search summaries only. Truck, bus and Chinese brands were added (owner decision).
- **Brand-value rankings miss familiarity.** Banks rank high but are unknown to players. Up to 15 Tanzanian brands were added (owner decision).
- **Global box office misses Tanzanian TV habits** (Bollywood, telenovelas, Turkish series). Twelve such items were added, mostly for review.

## 4. Owner decisions made during research

| Stage | Decision |
|---|---|
| 2 | Car Brands is a documented exception (about 60–70); thin categories may ship under 100 with the reason recorded; owner reviews only the "Needs local verification" lists |
| 3A | Gospel out of Bongo Flava · 2013 or earlier = Zilipendwa, 2014+ = Bongo Flava · Zilipendwa may hold bands, legends, dance styles · thin categories rest on general knowledge |
| 4A | Big songs that share a title with another prompt are kept, told apart by the artist line |
| 3B | 2013 or earlier = Throwback Hits · North Africa ≥ 5% · musicians live in the music categories · no sitting heads of state in African Icons · up to about ten Sheng words |
| 4B | Really famous titles may have 5–6 words |
| 3C | Up to 15 Tanzanian brands · each African landmark in one category · trucks, buses and Chinese car brands · up to 10 foreign shows popular on Tanzanian TV |
| 4C | Two prompts may share text whenever their hint lines differ (widened from songs only) |

## 5. Limits, stated honestly

1. **Social media could not be read.** Current slang, memes and trends are the weakest areas.
2. **Search summaries only:** the car-market data, Tanzanian sport popularity, comedy-award pages, derby record and wedding write-ups were seen as summaries, not opened. They are marked "Summary only" in the registry.
3. **Chart snapshots are one week.** Trending prompts are marked `shelf: trending` and need re-checking every three months.
4. **Familiarity is mostly judged, not measured.** Sources show that something exists and is popular *somewhere*; whether Tanzanian players know it is the owner's call for the review-list items.
5. **The Kiswahili has not been checked by a native speaker.** About 450 English–Kiswahili pairs were written for Classic. Owner read-through is recommended.
6. **One unverified fact was deliberately not used:** a reference page lists a 2026 Nobel Peace Prize that could not be cross-checked.
