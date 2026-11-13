# Bongo Charades — Content Direction & Pre-Phase 5 Content Record

**Date:** 2026-11-12 · **Branch:** `phase-4-polish`
**Status:** this is a *restructure and clean-up* of the existing prompt bank. It is not the Phase 5 research expansion. Production data is in `src/data/prompts.ts`, generated from `scripts/content/build_prompts.py`. Research notes stay in this folder and are never stored in the app data.

---

## 1. Category group identities (owner decision)

| Group | Identity | Language direction | Must NOT contain |
|---|---|---|---|
| **Classic Charades** (8) | Universal: anyone, anywhere can play | English-led. Most ideas exist as an **English + Kiswahili pair of the same concept** (Lion / Simba) | Tanzania-specific references (moved to the Bongo group) |
| **Bongo & Tanzanian Culture** (12) | Tanzania: people, places, music, daily life, slang | **Kiswahili-led.** English isn't forced in | Generic global content |
| **East Africa & Beyond** (6) | Africa-wide plus internationally known African and global culture | English-led; names and titles work in any language | Being "another Tanzanian category" |

## 2. Prompt-writing rules
1. A prompt must be easy to understand, act out and guess.
2. Prefer one word; use a short phrase only when one word is unclear. Automated limit: **4 words maximum**.
3. No situations that need explaining.
4. Use natural Kiswahili, never literal translations. Proper names and titles aren't translated.
5. A translation pair must be the **same idea** in both languages.
6. No duplicates or near-duplicates, inside a category or across categories. Automated check: comparison ignores case and spacing, so "Bodaboda" and "Boda Boda" count as the same.
7. Song titles carry the artist as a `hint` (shown small under the prompt) so the friends acting it out know what to hum.

## 3. How the prompt-language setting works now

| Setting | What gets dealt |
|---|---|
| English | The English version of each pair. Prompts with no translation (names, Kiswahili-only Tanzanian content) are still included |
| Kiswahili | The Kiswahili version of each pair. Untranslated prompts are still included |
| Mixed | For each pair, one version **chosen at random**, so a game mixes both languages but never shows "Lion" *and* "Simba" |

Tanzanian categories therefore stay mostly Kiswahili in every setting. That is deliberate.

## 4. Schema (additions, all optional)
```ts
concept?: string      // shared by translations of the same idea, e.g. 'anim-lion'
hint?: string         // small helper line under the prompt (e.g. song artist)
needsReview?: true    // flagged for human review
```
`language: 'mixed'` now means "works in any language" (a proper name, title or brand) or a natural mix.

## 5. Category changes

### Vijiweni → merged into Mtaani (category removed)
| Old Vijiweni prompt | Decision |
|---|---|
| Kahawa na Kashata | ✅ moved to Mtaani |
| Kucheza Dama | ✅ moved to Mtaani as "Kucheza Drafti" (the common name) |
| Bao la Kiswahili | ✅ moved to Mtaani as "Bao" |
| Maskani ya Vijana | ✅ moved to Mtaani as "Maskani" |
| Kubishana Mpira wa Ulaya | ✅ moved to Mtaani as "Kubishana Mpira" |
| Kupiga Pamba Mpya | ✅ moved to Mtaani as "Kupiga Pamba" (⚠ review: slang) |
| Kukodi Baiskeli | ✅ moved to Mtaani |
| Chai na Vitumbua | ↪ moved to Chakula Chetu as "Vitumbua" (it's food) |
| Story za Kidimbwi | ❌ dropped: unclear meaning, hard to act |
| Mzee wa Busara | ❌ dropped: too vague to guess |
| *(new)* Kijiweni | ✅ added to Mtaani so the place itself is still in the game |

### Zilipendwa: new category (Tanzanian throwback music)
Song titles come first, with the artist as a hint. Spans dansi/rumba classics → 1990s → 2000s Bongo Flava golden era → hits from about 10 years ago. Sources are in §7.

| Era | Prompts |
|---|---|
| 1970s–80s | Shida, Pole Dada (Mbaraka Mwinshehe) · Neema (DDC Mlimani Park Orchestra, Song of the Year 1985/86) |
| 1990s | Mambo kwa Soksi (1990), Kifo, Kipenda Roho (Remmy Ongala) |
| 2000s | Kidali Po (Mr Nice) · Siamini (TID) · Umenikataa (Ray C) · Kimya Kimya (Jay Moe ft. Ngwair) · Habari Ndiyo Hiyo (Mwana FA ft. AY) · Mapozi (Mr Blue) · Binti Kiziwi (Z Anto) · Nakshi Mrembo (Ali Kiba) · Bembeleza (Marlaw) · Siku Hazigandi (Lady Jaydee) · Dar Mpaka Moro (TMK Wanaume) · Nalia kwa Furaha (Bushoke) · Anita (Matonya ft. Lady Jaydee) · Maria Salome (Saida Karoli ⚠) |
| ~10 years ago | My Number One (Diamond, 2013) · Mwana (Ali Kiba, 2015) · Hawajui (Vanessa Mdee, 2015) · Me & You (Ommy Dimpoz ft. Vanessa Mdee) |

The old *Throwback Hits* list was entirely Tanzanian, and several attributions couldn't be verified ("Dully Sykes – Salome", "Juma Nature – Ugali", "20 Percent – Money Money", "TID – Zeze", "Mr Nice – Fagilia", "Ray C – Mapenzi Yangu"). Those entries were **removed** rather than moved. "Salome" is actually Diamond Platnumz ft. Rayvanny and now sits in Bongo Flava.

### Bongo Flava: broadened
Artists (Diamond Platnumz, Ali Kiba, Harmonize, Zuchu, Marioo, Nandy, Rayvanny, Mbosso), music culture (WCB Wasafi, Singeli) and **recognisable 2016–2022 hits** verified against Notjustok's *100 best Tanzanian songs 2012–2022*: Tetema, Kwangwaru, Sukari, Salome, Waah!, Aje, Mi Amor, Mama Amina, Hainaga Ushemeji, Nyumba Ndogo, Kwetu.
**Not yet done (Phase 5):** current 2025–26 hits. A 2024 list was found but couldn't be verified word-for-word, so it wasn't used.

### Re-homed by group identity
- **Classic → Bongo:** Huba, Jua Kali (Movies & TV → Movie za Bongo); Mandonga and Samatta (Sports → Watu Maarufu), Ndondo Cup (Sports → Mpira & Mashabiki); Twaha Kiduku dropped; Chipsi Mayai, Mishkaki, Mandazi, Chai ya Rangi, Juisi ya Miwa, Wali Maharage (Food & Drinks → Chakula Chetu); Bodaboda, Singeli (Act It Out → Mtaani / Bongo Flava); Serengeti, Ngorongoro, Zanzibar removed from Countries & Places.
- **Classic → East Africa & Beyond:** Burna Boy, Wizkid, Davido, Sauti Sol (Music & Artists → African Music).
- **East Africa & Beyond, de-Tanzanianised:** Taarab, "Mastaa wa Bongo", "Paparazzi wa Dar", "Red Carpet Bongo Movie", "Zanzibar Stone Town" (duplicate) removed. African Music is now artists and genres from across Africa. Throwback Hits is now African and international (Malaika, Jambo Bwana, Pata Pata, Sweet Mother, Yéké Yéké, Wale Watu, Shauri Yako, African Queen, Waka Waka, Thriller, Billie Jean, Macarena, Gangnam Style, One Love).

### Fixes
- "Kenge" was labelled as crocodile, but kenge means monitor lizard. Crocodile is now paired with **Mamba**.
- Long or awkward prompts were shortened (e.g. "Mihogo ya Kukaanga na Pili Pili" → "Mihogo ya Kukaanga", "Simba SC Mnyama" → "Simba SC").
- Political slogan "Kazi Iendelee" removed. "Uncle JJ Movie", "Pete Series", "Oprah Movie" and "Chopa Mchopanga" were removed because they couldn't be verified.

## 6. Needs human review (flagged `needsReview: true`)
| Prompt | Category | Why |
|---|---|---|
| Kupiga Pamba, Utajua Hujui, Haina Kufeli | Mtaani | Slang: check current, nationwide usage |
| Maria Salome (Saida Karoli) | Zilipendwa | Title from memory; sources only say Saida Karoli's early-2000s hit was the basis for "Salome" |
| Huba, Jua Kali, Ze Comedy | Movie za Bongo | TV shows: confirm they're still widely recognised |
| Sapu | Chuo Life | University slang for supplementary exam: confirm across universities |

Also worth a quick look: **Samia Suluhu Hassan** and **Mwalimu Nyerere** in Watu Maarufu (keep political figures neutral and respectful), and **Kuchunwa Buzi** in Mapenzi (adult-ish slang, fine for a party game but check the audience).

## 7. Research ledger (sources used in this pass)
| Claim used | Source | Date | Type |
|---|---|---|---|
| 2000s Bongo Flava classics and artists (Siamini, Umenikataa, Kimya Kimya, Habari Ndiyo Hiyo, Mapozi, Binti Kiziwi, Kidali Po, Nakshi Mrembo, Bembeleza, Siku Hazigandi, Dar Mpaka Moro, Nalia kwa Furaha, Anita) | [OkayAfrica — 14 Bongo Flava Classics](https://www.okayafrica.com/14-bongo-flava-classics-you-need-in-your-life/160880) | 2017-11-14 | Editorial list |
| Remmy Ongala songs; Mambo kwa Soksi = 1990 | [The Chanzo — Remmy Ongala legacy](https://thechanzo.com/2023/12/13/remmy-ongala-the-life-death-and-legacy-of-legendary-musician/) | 2023-12-13 | Journalism |
| Mbaraka Mwinshehe songs (Shida, Pole Dada …) | [Jabulani Radio — Mbaraka Mwinshehe](https://jabulaniradio.com/news/mbaraka-mwinshehe-mwaruka-155) | 2025-01-08 | Music history |
| Malaika (Fadhili William), Jambo Bwana (Them Mushrooms), Neema (DDC Mlimani Park, 1985/86), Wale Watu (Khadja Nin, 1996), Salome revives a Saida Karoli hit | [Nation — Popular Swahili songs through the decades](https://nation.africa/kenya/news/language-of-love-popular-songs-in-swahili-through-the-decades-4295640) | n.d. | Journalism |
| 2012–2022 Tanzanian hits and years (My Number One 2013, Mwana 2015, Hawajui 2015, Tetema, Kwangwaru, Sukari, Salome, Waah 2020, Aje, Mi Amor, Mama Amina, Hainaga Ushemeji, Nyumba Ndogo, Kwetu) | [Notjustok — 100 best Tanzanian songs of the decade](https://notjustok.com/eastafrica/article/100-best-tanzanian-songs-of-the-decade/) | 2023-09 | Editorial ranking (entries 1–43 verified verbatim) |
| 2014 hits turning 10 (Mwana, Hawajui, My Number One remix …) | [Notjustok — Bongo Flava classics turning 10](https://notjustok.com/songs/classic-bongo-flava-songs-turning-10-in-2024-2/amp/) | 2024-10-12 | Editorial |

These are **editorial** sources, not streaming charts. They show which songs critics consider notable, not which songs every Tanzanian recognises. Phase 5 should add chart data and real-player feedback.
International and pan-African throwbacks (Pata Pata, Sweet Mother, Yéké Yéké, Waka Waka, Thriller, Macarena …) and African icons are widely documented global hits. They're included on general knowledge and were not individually sourced in this pass.

## 8. Validation (automated, `npm test` → `src/data/prompts.test.ts`)
Unique ids · valid categories · ≥12 prompts per category · ≤4 words · no duplicate or near-duplicate text across the whole bank · translation pairs have exactly one EN + one SW · Bongo group <5% English-only · Classic English prompts >90% paired · every Zilipendwa prompt has an artist hint.

---

## 9. Second refinement pass (2026-11-13)

### Classic Charades now has 11 categories
| Category | Rule | Content |
|---|---|---|
| **Countries** (was Countries & Places) | Countries only, enforced by a test against an explicit country list | 24 countries from every continent, including Tanzania, Kenya, Nigeria and Ghana. Natural Kiswahili names where they exist (Japani, Ufaransa, Kanada, Uchina, Misri, Marekani, Ujerumani, Italia, Hispania, Meksiko, Urusi, Uingereza, Afrika Kusini, Ureno, Ugiriki). Same-name countries are single prompts. |
| **Famous Landmarks** (new) | Recognisable, actable, geographically diverse | Africa: Mount Kilimanjaro / Mlima Kilimanjaro, Pyramids of Giza / Mapiramidi ya Giza, Victoria Falls, Table Mountain · Europe: Eiffel Tower, Colosseum, Big Ben, Leaning Tower of Pisa, Stonehenge · Asia: Great Wall of China, Taj Mahal, Burj Khalifa, Mount Everest · Americas: Statue of Liberty, Christ the Redeemer, Machu Picchu, Golden Gate Bridge, Niagara Falls, Hollywood Sign, Times Square · Oceania: Sydney Opera House |
| **Car Brands** (new; first requested as "Cars & Vehicles", narrowed by the owner to brands only) | Car brands only, no models or vehicle types | Toyota, Mercedes-Benz, BMW, Audi, Volkswagen, Nissan, Honda, Mazda, Subaru, Suzuki, Mitsubishi, Isuzu, Hyundai, Kia, Ford, Chevrolet, Jeep, Tesla, Land Rover, Volvo, Peugeot, Mini, Ferrari, Lamborghini, Porsche, Rolls-Royce, Bentley, Bugatti |
| **Famous Brands** (new) | Many industries; no car brands, which live in Car Brands (test-enforced) | Tech/media: Apple, Samsung, Google, Microsoft, Amazon, Netflix, WhatsApp, Instagram, Disney, PlayStation · Sportswear: Nike, Adidas, Puma · Fashion/luxury: Gucci, Louis Vuitton, Chanel, Tiffany & Co., Zara · Food/drink: Coca-Cola, Pepsi, McDonald's, KFC, Starbucks, Red Bull · Other: IKEA, Lego, Visa |

Removed from the old Countries & Places: Dubai, London and New York (cities, not countries; their landmarks Burj Khalifa, Big Ben and Times Square are in Landmarks) and Desert/Beach (generic). Food & Drinks "Water" became **Milk / Maziwa**, because "Water" is now Tyla's song in African Music & Artists and the duplicate check treats them as the same.

### African Music & Artists (renamed from African Music)
Africa-wide; Tanzanian artists stay in Bongo Flava (test-enforced).
- **Genres:** Afrobeats, Amapiano, Rhumba, Highlife, Raï
- **Artists:** Burna Boy, Wizkid, Davido, Tems, Rema, Ayra Starr, Yemi Alade (Nigeria) · Angélique Kidjo (Benin) · Youssou N'Dour (Senegal) · Tyla (South Africa) · Sauti Sol (Kenya) · Eddy Kenzo (Uganda) · Fally Ipupa, Koffi Olomide (DR Congo) · Amr Diab (Egypt) · Cheb Khaled (Algeria)
- **Songs with artist hints:** Calm Down (Rema), Water (Tyla), Last Last (Burna Boy), Essence (Wizkid ft. Tems), Fall (Davido), Johnny (Yemi Alade), Jerusalema (Master KG), Sitya Loss (Eddy Kenzo), Sura Yako (Sauti Sol), Vulindlela (Brenda Fassie), Aïcha (Cheb Khaled), Tamally Maak (Amr Diab)
- Gengetone and Kwaito, plus a few extra names, were trimmed to keep quality over quantity.

### Sources and review
These additions are globally documented brands, landmarks, countries and internationally charting African artists and songs. They were chosen from general knowledge and **not individually sourced in this pass**. **"Artists currently achieving significant popularity"** needs 2025–26 chart data, which is part of the Phase 5 research ledger (Spotify/Apple/YouTube Africa charts). Treat the African Music & Artists list as a well-known baseline, not a current-charts list.
