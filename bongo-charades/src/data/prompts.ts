import type { CategoryIconId, GamePrompt } from '../types'

/**
 * Bongo Charades — Comprehensive Starter Prompt Library
 *
 * Covers all 26 categories across the 3 visual/cultural groups:
 * - c1: Classic Charades
 * - c2: Bongo & Tanzanian Culture
 * - c3: East Africa & Beyond
 *
 * Each prompt is tagged with:
 * - `categoryId`: matches CategoryIconId
 * - `language`: 'en' | 'sw' | 'mixed'
 */
export const PROMPTS: GamePrompt[] = [
  // =========================================================================
  // GROUP 1: CLASSIC CHARADES (c1)
  // =========================================================================

  // 1. Animals
  { id: 'anim-1', text: 'Simba', categoryId: 'animals', language: 'sw' },
  { id: 'anim-2', text: 'Lion', categoryId: 'animals', language: 'en' },
  { id: 'anim-3', text: 'Tembo', categoryId: 'animals', language: 'sw' },
  { id: 'anim-4', text: 'Elephant', categoryId: 'animals', language: 'en' },
  { id: 'anim-5', text: 'Twiga', categoryId: 'animals', language: 'sw' },
  { id: 'anim-6', text: 'Giraffe', categoryId: 'animals', language: 'en' },
  { id: 'anim-7', text: 'Chui', categoryId: 'animals', language: 'sw' },
  { id: 'anim-8', text: 'Leopard', categoryId: 'animals', language: 'en' },
  { id: 'anim-9', text: 'Kiboko', categoryId: 'animals', language: 'sw' },
  { id: 'anim-10', text: 'Hippopotamus', categoryId: 'animals', language: 'en' },
  { id: 'anim-11', text: 'Nyoka Mweusi', categoryId: 'animals', language: 'sw' },
  { id: 'anim-12', text: 'Black Mamba', categoryId: 'animals', language: 'en' },
  { id: 'anim-13', text: 'Kenge', categoryId: 'animals', language: 'sw' },
  { id: 'anim-14', text: 'Crocodile', categoryId: 'animals', language: 'en' },
  { id: 'anim-15', text: 'Mamba wa Mto Rufiji', categoryId: 'animals', language: 'mixed' },
  { id: 'anim-16', text: 'Tumbili', categoryId: 'animals', language: 'sw' },

  // 2. Movies & TV
  { id: 'mov-1', text: 'Lion King', categoryId: 'movies-tv', language: 'en' },
  { id: 'mov-2', text: 'Black Panther', categoryId: 'movies-tv', language: 'en' },
  { id: 'mov-3', text: 'Titanic', categoryId: 'movies-tv', language: 'en' },
  { id: 'mov-4', text: 'Huba Series', categoryId: 'movies-tv', language: 'mixed' },
  { id: 'mov-5', text: 'Jua Kali', categoryId: 'movies-tv', language: 'sw' },
  { id: 'mov-6', text: 'Pete Series', categoryId: 'movies-tv', language: 'sw' },
  { id: 'mov-7', text: 'Avatar', categoryId: 'movies-tv', language: 'en' },
  { id: 'mov-8', text: 'Spider-Man', categoryId: 'movies-tv', language: 'en' },
  { id: 'mov-9', text: 'Fast & Furious', categoryId: 'movies-tv', language: 'en' },
  { id: 'mov-10', text: 'Money Heist', categoryId: 'movies-tv', language: 'en' },
  { id: 'mov-11', text: 'Game of Thrones', categoryId: 'movies-tv', language: 'en' },
  { id: 'mov-12', text: 'Uncle JJ Movie', categoryId: 'movies-tv', language: 'mixed' },

  // 3. Music & Artists
  { id: 'mus-1', text: 'Beyoncé', categoryId: 'music-artists', language: 'en' },
  { id: 'mus-2', text: 'Michael Jackson', categoryId: 'music-artists', language: 'en' },
  { id: 'mus-3', text: 'Burna Boy', categoryId: 'music-artists', language: 'mixed' },
  { id: 'mus-4', text: 'Wizkid', categoryId: 'music-artists', language: 'mixed' },
  { id: 'mus-5', text: 'Rihanna', categoryId: 'music-artists', language: 'en' },
  { id: 'mus-6', text: 'Bob Marley', categoryId: 'music-artists', language: 'en' },
  { id: 'mus-7', text: 'Drake', categoryId: 'music-artists', language: 'en' },
  { id: 'mus-8', text: 'Davido', categoryId: 'music-artists', language: 'mixed' },
  { id: 'mus-9', text: 'Chris Brown', categoryId: 'music-artists', language: 'en' },
  { id: 'mus-10', text: 'Sauti Sol', categoryId: 'music-artists', language: 'mixed' },

  // 4. Sports
  { id: 'spt-1', text: 'Mpira wa Miguu', categoryId: 'sports', language: 'sw' },
  { id: 'spt-2', text: 'Football / Soccer', categoryId: 'sports', language: 'en' },
  { id: 'spt-3', text: 'Ndondo Cup', categoryId: 'sports', language: 'mixed' },
  { id: 'spt-4', text: 'Boxing / Masumbwi', categoryId: 'sports', language: 'mixed' },
  { id: 'spt-5', text: 'Twaha Kiduku', categoryId: 'sports', language: 'mixed' },
  { id: 'spt-6', text: 'Mandonga Mtu Kazi', categoryId: 'sports', language: 'sw' },
  { id: 'spt-7', text: 'Basketball', categoryId: 'sports', language: 'en' },
  { id: 'spt-8', text: 'Mbwana Samatta', categoryId: 'sports', language: 'mixed' },
  { id: 'spt-9', text: 'Kukimbia Marathon', categoryId: 'sports', language: 'sw' },
  { id: 'spt-10', text: 'Penalty Shootout', categoryId: 'sports', language: 'en' },

  // 5. Countries & Places
  { id: 'plc-1', text: 'Tanzania', categoryId: 'countries-places', language: 'mixed' },
  { id: 'plc-2', text: 'Zanzibar Island', categoryId: 'countries-places', language: 'en' },
  { id: 'plc-3', text: 'Serengeti Park', categoryId: 'countries-places', language: 'mixed' },
  { id: 'plc-4', text: 'Mlima Kilimanjaro', categoryId: 'countries-places', language: 'sw' },
  { id: 'plc-5', text: 'Mount Kilimanjaro', categoryId: 'countries-places', language: 'en' },
  { id: 'plc-6', text: 'Kenya', categoryId: 'countries-places', language: 'mixed' },
  { id: 'plc-7', text: 'South Africa', categoryId: 'countries-places', language: 'en' },
  { id: 'plc-8', text: 'Dubai', categoryId: 'countries-places', language: 'en' },
  { id: 'plc-9', text: 'Ngorongoro Crater', categoryId: 'countries-places', language: 'mixed' },
  { id: 'plc-10', text: 'Uganda', categoryId: 'countries-places', language: 'mixed' },

  // 6. Everyday Things
  { id: 'evt-1', text: 'Pasi ya Mkaa', categoryId: 'everyday-things', language: 'sw' },
  { id: 'evt-2', text: 'Smartphone Charger', categoryId: 'everyday-things', language: 'en' },
  { id: 'evt-3', text: 'Ndoo ya Maji', categoryId: 'everyday-things', language: 'sw' },
  { id: 'evt-4', text: 'Tochi ya Simu', categoryId: 'everyday-things', language: 'sw' },
  { id: 'evt-5', text: 'Kiberiti cha Mti', categoryId: 'everyday-things', language: 'sw' },
  { id: 'evt-6', text: 'Flashlight', categoryId: 'everyday-things', language: 'en' },
  { id: 'evt-7', text: 'Umbrella / Mwavuli', categoryId: 'everyday-things', language: 'mixed' },
  { id: 'evt-8', text: 'Fagio la Chelewa', categoryId: 'everyday-things', language: 'sw' },
  { id: 'evt-9', text: 'Saa ya Mkononi', categoryId: 'everyday-things', language: 'sw' },
  { id: 'evt-10', text: 'Wristwatch', categoryId: 'everyday-things', language: 'en' },

  // 7. Act It Out
  { id: 'act-1', text: 'Kupika Ugali', categoryId: 'act-it-out', language: 'sw' },
  { id: 'act-2', text: 'Kuendesha Bodaboda', categoryId: 'act-it-out', language: 'sw' },
  { id: 'act-3', text: 'Taking a Selfie', categoryId: 'act-it-out', language: 'en' },
  { id: 'act-4', text: 'Kufua Nguo kwa Mkono', categoryId: 'act-it-out', language: 'sw' },
  { id: 'act-5', text: 'Kucheza Singeli', categoryId: 'act-it-out', language: 'sw' },
  { id: 'act-6', text: 'Sleeping in Class', categoryId: 'act-it-out', language: 'en' },
  { id: 'act-7', text: 'Kukimbizwa na Mbwa', categoryId: 'act-it-out', language: 'sw' },
  { id: 'act-8', text: 'Sneezing loudly', categoryId: 'act-it-out', language: 'en' },
  { id: 'act-9', text: 'Kusalimiana kwa Adabu', categoryId: 'act-it-out', language: 'sw' },
  { id: 'act-10', text: 'Winning the Lottery', categoryId: 'act-it-out', language: 'en' },

  // 8. Food & Drinks
  { id: 'fd-1', text: 'Chipsi Mayai', categoryId: 'food-drinks', language: 'mixed' },
  { id: 'fd-2', text: 'Wali Maharage', categoryId: 'food-drinks', language: 'sw' },
  { id: 'fd-3', text: 'Pizza', categoryId: 'food-drinks', language: 'en' },
  { id: 'fd-4', text: 'Mishkaki', categoryId: 'food-drinks', language: 'sw' },
  { id: 'fd-5', text: 'Ice Cream', categoryId: 'food-drinks', language: 'en' },
  { id: 'fd-6', text: 'Mandazi Moto', categoryId: 'food-drinks', language: 'sw' },
  { id: 'fd-7', text: 'Burger and Fries', categoryId: 'food-drinks', language: 'en' },
  { id: 'fd-8', text: 'Chai ya Rangi', categoryId: 'food-drinks', language: 'sw' },
  { id: 'fd-9', text: 'Juisi ya Miwa', categoryId: 'food-drinks', language: 'sw' },
  { id: 'fd-10', text: 'Fresh Orange Juice', categoryId: 'food-drinks', language: 'en' },

  // =========================================================================
  // GROUP 2: BONGO & TANZANIAN CULTURE (c2)
  // =========================================================================

  // 9. Hii Dar Yetu
  { id: 'dar-1', text: 'Kariakoo Sokoni', categoryId: 'hii-dar-yetu', language: 'sw' },
  { id: 'dar-2', text: 'Daraja la Tanzanite', categoryId: 'hii-dar-yetu', language: 'sw' },
  { id: 'dar-3', text: 'Ferry ya Kivukoni', categoryId: 'hii-dar-yetu', language: 'sw' },
  { id: 'dar-4', text: 'Mnazi Mmoja', categoryId: 'hii-dar-yetu', language: 'sw' },
  { id: 'dar-5', text: 'Posta Mpya', categoryId: 'hii-dar-yetu', language: 'sw' },
  { id: 'dar-6', text: 'Mlimani City Mall', categoryId: 'hii-dar-yetu', language: 'mixed' },
  { id: 'dar-7', text: 'Coco Beach Jumapili', categoryId: 'hii-dar-yetu', language: 'sw' },
  { id: 'dar-8', text: 'Samaki Samaki', categoryId: 'hii-dar-yetu', language: 'sw' },
  { id: 'dar-9', text: 'Tazara Flyover', categoryId: 'hii-dar-yetu', language: 'mixed' },
  { id: 'dar-10', text: 'Kigamboni Bridge', categoryId: 'hii-dar-yetu', language: 'en' },

  // 10. Daladala Diaries
  { id: 'dala-1', text: 'Konda wa Daladala', categoryId: 'daladala-diaries', language: 'sw' },
  { id: 'dala-2', text: 'Fidia ya Nauli', categoryId: 'daladala-diaries', language: 'sw' },
  { id: 'dala-3', text: 'Mwisho wa Gari!', categoryId: 'daladala-diaries', language: 'sw' },
  { id: 'dala-4', text: 'Shusha Hapa Konda', categoryId: 'daladala-diaries', language: 'sw' },
  { id: 'dala-5', text: 'Sogea Ndani Kiti Kipo', categoryId: 'daladala-diaries', language: 'sw' },
  { id: 'dala-6', text: 'Siti ya Mbele', categoryId: 'daladala-diaries', language: 'sw' },
  { id: 'dala-7', text: 'Mwenge Stand', categoryId: 'daladala-diaries', language: 'sw' },
  { id: 'dala-8', text: 'Kupiga Dirisha la Gari', categoryId: 'daladala-diaries', language: 'sw' },
  { id: 'dala-9', text: 'Abiria Chunga Mzigo Wako', categoryId: 'daladala-diaries', language: 'sw' },
  { id: 'dala-10', text: 'Gerezani Stand', categoryId: 'daladala-diaries', language: 'sw' },

  // 11. Bongo Flava
  { id: 'bfl-1', text: 'Diamond Platnumz', categoryId: 'bongo-flava', language: 'mixed' },
  { id: 'bfl-2', text: 'Ali Kiba', categoryId: 'bongo-flava', language: 'mixed' },
  { id: 'bfl-3', text: 'Harmonize Jeshi', categoryId: 'bongo-flava', language: 'mixed' },
  { id: 'bfl-4', text: 'Zuchu Sukari', categoryId: 'bongo-flava', language: 'mixed' },
  { id: 'bfl-5', text: 'Marioo', categoryId: 'bongo-flava', language: 'mixed' },
  { id: 'bfl-6', text: 'Nandy The African Princess', categoryId: 'bongo-flava', language: 'mixed' },
  { id: 'bfl-7', text: 'Rayvanny Chui', categoryId: 'bongo-flava', language: 'mixed' },
  { id: 'bfl-8', text: 'Mdundo wa Singeli', categoryId: 'bongo-flava', language: 'sw' },
  { id: 'bfl-9', text: 'WCB Wasafi', categoryId: 'bongo-flava', language: 'mixed' },
  { id: 'bfl-10', text: 'Konde Music Worldwide', categoryId: 'bongo-flava', language: 'mixed' },

  // 12. Mtaani
  { id: 'mta-1', text: 'Machinga', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-2', text: 'Duka la Mangi', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-3', text: 'Bodaboda Kijiweni', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-4', text: 'Mama Ntilie', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-5', text: 'Genge la Nyanya', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-6', text: 'Umeme Umekatika', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-7', text: 'Saloon ya Kiume', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-8', text: 'Kazi Iendelee', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-9', text: 'Utajua Hujui', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-10', text: 'Haina Kufeli', categoryId: 'mtaani', language: 'sw' },

  // 13. Vijiweni
  { id: 'vij-1', text: 'Kahawa na Kashata', categoryId: 'vijiweni', language: 'sw' },
  { id: 'vij-2', text: 'Kucheza Dama', categoryId: 'vijiweni', language: 'sw' },
  { id: 'vij-3', text: 'Bao la Kiswahili', categoryId: 'vijiweni', language: 'sw' },
  { id: 'vij-4', text: 'Maskani ya Vijana', categoryId: 'vijiweni', language: 'sw' },
  { id: 'vij-5', text: 'Kubishana Mpira wa Ulaya', categoryId: 'vijiweni', language: 'sw' },
  { id: 'vij-6', text: 'Story za Kidimbwi', categoryId: 'vijiweni', language: 'sw' },
  { id: 'vij-7', text: 'Kupiga Pamba Mpya', categoryId: 'vijiweni', language: 'sw' },
  { id: 'vij-8', text: 'Chai na Vitumbua', categoryId: 'vijiweni', language: 'sw' },
  { id: 'vij-9', text: 'Kukodi Baiskeli', categoryId: 'vijiweni', language: 'sw' },
  { id: 'vij-10', text: 'Mzee wa Busara', categoryId: 'vijiweni', language: 'sw' },

  // 14. Chakula Chetu
  { id: 'chk-1', text: 'Ugali wa Sembe na Samaki', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-2', text: 'Pilau ya Kuku', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-3', text: 'Ndizi Nyama za Bukoba', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-4', text: 'Makande ya Nazi', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-5', text: 'Supu ya Kongoro', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-6', text: 'Mchemsho wa Mbuzi', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-7', text: 'Kitimoto Choma', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-8', text: 'Mihogo ya Kukaanga na Pili Pili', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-9', text: 'Chapati za Kusukuma', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-10', text: 'Biriani ya Ijumaa', categoryId: 'chakula-chetu', language: 'sw' },

  // 15. Watu Maarufu
  { id: 'wtu-1', text: 'Mwalimu Julius Nyerere', categoryId: 'watu-maarufu', language: 'sw' },
  { id: 'wtu-2', text: 'Rais Samia Suluhu Hassan', categoryId: 'watu-maarufu', language: 'sw' },
  { id: 'wtu-3', text: 'Haji Manara', categoryId: 'watu-maarufu', language: 'mixed' },
  { id: 'wtu-4', text: 'Millard Ayo', categoryId: 'watu-maarufu', language: 'mixed' },
  { id: 'wtu-5', text: 'Idris Sultan', categoryId: 'watu-maarufu', language: 'mixed' },
  { id: 'wtu-6', text: 'Jokate Mwegelo', categoryId: 'watu-maarufu', language: 'mixed' },
  { id: 'wtu-7', text: 'Ahmed Ally', categoryId: 'watu-maarufu', language: 'mixed' },
  { id: 'wtu-8', text: 'Professor Jay', categoryId: 'watu-maarufu', language: 'mixed' },
  { id: 'wtu-9', text: 'Lady Jaydee', categoryId: 'watu-maarufu', language: 'mixed' },
  { id: 'wtu-10', text: 'Masoud Kipanya', categoryId: 'watu-maarufu', language: 'mixed' },

  // 16. Movie za Bongo
  { id: 'mvb-1', text: 'Steven Kanumba The Great', categoryId: 'movie-za-bongo', language: 'mixed' },
  { id: 'mvb-2', text: 'Ray Kigosi', categoryId: 'movie-za-bongo', language: 'mixed' },
  { id: 'mvb-3', text: 'Wema Sepetu', categoryId: 'movie-za-bongo', language: 'mixed' },
  { id: 'mvb-4', text: 'JB Jerusalem Boys', categoryId: 'movie-za-bongo', language: 'mixed' },
  { id: 'mvb-5', text: 'Irene Uwoya', categoryId: 'movie-za-bongo', language: 'mixed' },
  { id: 'mvb-6', text: 'Monalisa', categoryId: 'movie-za-bongo', language: 'mixed' },
  { id: 'mvb-7', text: 'Aunt Ezekiel', categoryId: 'movie-za-bongo', language: 'mixed' },
  { id: 'mvb-8', text: 'Single Mtambalike Rich', categoryId: 'movie-za-bongo', language: 'mixed' },
  { id: 'mvb-9', text: 'Oprah Movie', categoryId: 'movie-za-bongo', language: 'mixed' },
  { id: 'mvb-10', text: 'Chopa Mchopanga', categoryId: 'movie-za-bongo', language: 'mixed' },

  // 17. Mpira & Mashabiki
  { id: 'mpm-1', text: 'Simba SC Mnyama', categoryId: 'mpira-mashabiki', language: 'sw' },
  { id: 'mpm-2', text: 'Yanga SC Wananchi', categoryId: 'mpira-mashabiki', language: 'sw' },
  { id: 'mpm-3', text: 'Kariakoo Derby', categoryId: 'mpira-mashabiki', language: 'mixed' },
  { id: 'mpm-4', text: 'Uwanja wa Benjamin Mkapa', categoryId: 'mpira-mashabiki', language: 'sw' },
  { id: 'mpm-5', text: 'Vuvuzela Uwanjani', categoryId: 'mpira-mashabiki', language: 'sw' },
  { id: 'mpm-6', text: 'Kadi Nyekundu', categoryId: 'mpira-mashabiki', language: 'sw' },
  { id: 'mpm-7', text: 'Golikipa Amedaka', categoryId: 'mpira-mashabiki', language: 'sw' },
  { id: 'mpm-8', text: 'Kushangilia Goli la Dakika 90', categoryId: 'mpira-mashabiki', language: 'sw' },
  { id: 'mpm-9', text: 'Azam FC Wanalambalamba', categoryId: 'mpira-mashabiki', language: 'sw' },
  { id: 'mpm-10', text: 'Mashabiki wa Jangwani', categoryId: 'mpira-mashabiki', language: 'sw' },

  // 18. Chuo Life
  { id: 'chuo-1', text: 'Boom la HESLB', categoryId: 'chuo-life', language: 'sw' },
  { id: 'chuo-2', text: 'Hostel za Magufuli', categoryId: 'chuo-life', language: 'sw' },
  { id: 'chuo-3', text: 'Mtihani wa UE', categoryId: 'chuo-life', language: 'sw' },
  { id: 'chuo-4', text: 'Kupiga Msuli Usiku', categoryId: 'chuo-life', language: 'sw' },
  { id: 'chuo-5', text: 'Kugombea Siti ya Mbele Lecture', categoryId: 'chuo-life', language: 'sw' },
  { id: 'chuo-6', text: 'Cafeteria ya Chuo', categoryId: 'chuo-life', language: 'mixed' },
  { id: 'chuo-7', text: 'Graduation Day', categoryId: 'chuo-life', language: 'en' },
  { id: 'chuo-8', text: 'Kupata Carry Over', categoryId: 'chuo-life', language: 'sw' },
  { id: 'chuo-9', text: 'Kugawa Notes za Mtihani', categoryId: 'chuo-life', language: 'sw' },
  { id: 'chuo-10', text: 'Mhadhiri Mkali', categoryId: 'chuo-life', language: 'sw' },

  // 19. Mapenzi & Mahusiano
  { id: 'map-1', text: 'Kutoa Mahari', categoryId: 'mapenzi-mahusiano', language: 'sw' },
  { id: 'map-2', text: 'Send-off Party', categoryId: 'mapenzi-mahusiano', language: 'mixed' },
  { id: 'map-3', text: 'Harusi ya Kifahari', categoryId: 'mapenzi-mahusiano', language: 'sw' },
  { id: 'map-4', text: 'Baby wa Moyo', categoryId: 'mapenzi-mahusiano', language: 'sw' },
  { id: 'map-5', text: 'Kuchunwa Buzi', categoryId: 'mapenzi-mahusiano', language: 'sw' },
  { id: 'map-6', text: 'Kupata Shemeji Mpya', categoryId: 'mapenzi-mahusiano', language: 'sw' },
  { id: 'map-7', text: 'Kuposa kwa Wazazi', categoryId: 'mapenzi-mahusiano', language: 'sw' },
  { id: 'map-8', text: 'Valentine Day Dinner', categoryId: 'mapenzi-mahusiano', language: 'en' },
  { id: 'map-9', text: 'Penzi la Dhati', categoryId: 'mapenzi-mahusiano', language: 'sw' },
  { id: 'map-10', text: 'Kuvunja Uchumba', categoryId: 'mapenzi-mahusiano', language: 'sw' },

  // 20. Shughuli za Familia
  { id: 'shg-1', text: 'Kitchen Party', categoryId: 'shughuli-za-familia', language: 'mixed' },
  { id: 'shg-2', text: 'Kikao cha Harusi', categoryId: 'shughuli-za-familia', language: 'sw' },
  { id: 'shg-3', text: 'Mkesha wa Mwaka Mpya', categoryId: 'shughuli-za-familia', language: 'sw' },
  { id: 'shg-4', text: 'Kipaimara cha Mtoto', categoryId: 'shughuli-za-familia', language: 'sw' },
  { id: 'shg-5', text: 'Dua ya Wazazi', categoryId: 'shughuli-za-familia', language: 'sw' },
  { id: 'shg-6', text: 'Kadi ya Mchango', categoryId: 'shughuli-za-familia', language: 'sw' },
  { id: 'shg-7', text: 'Maua ya Bibi Harusi', categoryId: 'shughuli-za-familia', language: 'sw' },
  { id: 'shg-8', text: 'Kupika kwenye Masufuria Makubwa', categoryId: 'shughuli-za-familia', language: 'sw' },
  { id: 'shg-9', text: 'Kuimba Pambio za Sherehe', categoryId: 'shughuli-za-familia', language: 'sw' },
  { id: 'shg-10', text: 'Sherehe ya Kuzaliwa', categoryId: 'shughuli-za-familia', language: 'sw' },

  // =========================================================================
  // GROUP 3: EAST AFRICA & BEYOND (c3)
  // =========================================================================

  // 21. East African Vibes
  { id: 'eav-1', text: 'Matatu ya Nairobi', categoryId: 'east-african-vibes', language: 'mixed' },
  { id: 'eav-2', text: 'Rolex ya Uganda', categoryId: 'east-african-vibes', language: 'mixed' },
  { id: 'eav-3', text: 'Boda Boda wa Kampala', categoryId: 'east-african-vibes', language: 'sw' },
  { id: 'eav-4', text: 'Lake Victoria', categoryId: 'east-african-vibes', language: 'en' },
  { id: 'eav-5', text: 'Zanzibar Spice Tour', categoryId: 'east-african-vibes', language: 'en' },
  { id: 'eav-6', text: 'Gorilla Trekking Rwanda', categoryId: 'east-african-vibes', language: 'en' },
  { id: 'eav-7', text: 'Kigali Clean Streets', categoryId: 'east-african-vibes', language: 'en' },
  { id: 'eav-8', text: 'Mombasa Raha', categoryId: 'east-african-vibes', language: 'sw' },
  { id: 'eav-9', text: 'Nyangumi wa Mafia Island', categoryId: 'east-african-vibes', language: 'sw' },
  { id: 'eav-10', text: 'Wanyama wa Serengeti', categoryId: 'east-african-vibes', language: 'sw' },

  // 22. African Icons
  { id: 'ico-1', text: 'Nelson Mandela', categoryId: 'african-icons', language: 'mixed' },
  { id: 'ico-2', text: 'Kwame Nkrumah', categoryId: 'african-icons', language: 'mixed' },
  { id: 'ico-3', text: 'Wangari Maathai', categoryId: 'african-icons', language: 'mixed' },
  { id: 'ico-4', text: 'Kofi Annan', categoryId: 'african-icons', language: 'mixed' },
  { id: 'ico-5', text: 'Miriam Makeba Mama Africa', categoryId: 'african-icons', language: 'mixed' },
  { id: 'ico-6', text: 'Chinua Achebe', categoryId: 'african-icons', language: 'mixed' },
  { id: 'ico-7', text: 'Thomas Sankara', categoryId: 'african-icons', language: 'mixed' },
  { id: 'ico-8', text: 'Haile Selassie', categoryId: 'african-icons', language: 'mixed' },
  { id: 'ico-9', text: 'Fela Kuti', categoryId: 'african-icons', language: 'mixed' },
  { id: 'ico-10', text: 'Patrice Lumumba', categoryId: 'african-icons', language: 'mixed' },

  // 23. African Music
  { id: 'afm-1', text: 'Afrobeats', categoryId: 'african-music', language: 'en' },
  { id: 'afm-2', text: 'Amapiano Dance', categoryId: 'african-music', language: 'en' },
  { id: 'afm-3', text: 'Rhumba la Congo', categoryId: 'african-music', language: 'sw' },
  { id: 'afm-4', text: 'Taarab ya Zanzibar', categoryId: 'african-music', language: 'sw' },
  { id: 'afm-5', text: 'Highlife Rhythm', categoryId: 'african-music', language: 'en' },
  { id: 'afm-6', text: 'Gengetone Kenya', categoryId: 'african-music', language: 'mixed' },
  { id: 'afm-7', text: 'Kwaito Beats', categoryId: 'african-music', language: 'en' },
  { id: 'afm-8', text: 'Soukous Dance', categoryId: 'african-music', language: 'en' },
  { id: 'afm-9', text: 'Benga Music', categoryId: 'african-music', language: 'mixed' },
  { id: 'afm-10', text: 'Gqom Durban', categoryId: 'african-music', language: 'en' },

  // 24. African Cities
  { id: 'cty-1', text: 'Dar es Salaam', categoryId: 'african-cities', language: 'mixed' },
  { id: 'cty-2', text: 'Nairobi', categoryId: 'african-cities', language: 'mixed' },
  { id: 'cty-3', text: 'Kampala', categoryId: 'african-cities', language: 'mixed' },
  { id: 'cty-4', text: 'Kigali', categoryId: 'african-cities', language: 'mixed' },
  { id: 'cty-5', text: 'Johannesburg', categoryId: 'african-cities', language: 'en' },
  { id: 'cty-6', text: 'Lagos', categoryId: 'african-cities', language: 'en' },
  { id: 'cty-7', text: 'Cairo', categoryId: 'african-cities', language: 'en' },
  { id: 'cty-8', text: 'Accra', categoryId: 'african-cities', language: 'en' },
  { id: 'cty-9', text: 'Addis Ababa', categoryId: 'african-cities', language: 'mixed' },
  { id: 'cty-10', text: 'Zanzibar Stone Town', categoryId: 'african-cities', language: 'en' },

  // 25. Pop Culture
  { id: 'pop-1', text: 'TikTok Dance Challenge', categoryId: 'pop-culture', language: 'en' },
  { id: 'pop-2', text: 'Viral Instagram Meme', categoryId: 'pop-culture', language: 'en' },
  { id: 'pop-3', text: 'Red Carpet Bongo Movie', categoryId: 'pop-culture', language: 'mixed' },
  { id: 'pop-4', text: 'Trending on Twitter / X', categoryId: 'pop-culture', language: 'en' },
  { id: 'pop-5', text: 'YouTube Vloggers', categoryId: 'pop-culture', language: 'en' },
  { id: 'pop-6', text: 'Podcast za Mjini', categoryId: 'pop-culture', language: 'sw' },
  { id: 'pop-7', text: 'Celebrity Breakup', categoryId: 'pop-culture', language: 'en' },
  { id: 'pop-8', text: 'Mastaa wa Bongo', categoryId: 'pop-culture', language: 'sw' },
  { id: 'pop-9', text: 'Paparazzi wa Dar', categoryId: 'pop-culture', language: 'sw' },
  { id: 'pop-10', text: 'Live Stream Concert', categoryId: 'pop-culture', language: 'en' },

  // 26. Throwback Hits
  { id: 'tbk-1', text: 'Ze Comedy Original', categoryId: 'throwback-hits', language: 'sw' },
  { id: 'tbk-2', text: 'Mr Nice Fagilia', categoryId: 'throwback-hits', language: 'sw' },
  { id: 'tbk-3', text: 'TMK Wanaume Family', categoryId: 'throwback-hits', language: 'sw' },
  { id: 'tbk-4', text: 'TID Zeze', categoryId: 'throwback-hits', language: 'sw' },
  { id: 'tbk-5', text: 'Dully Sykes Salome', categoryId: 'throwback-hits', language: 'sw' },
  { id: 'tbk-6', text: 'Ray C Mapenzi Yangu', categoryId: 'throwback-hits', language: 'sw' },
  { id: 'tbk-7', text: 'Lady Jaydee Machozi', categoryId: 'throwback-hits', language: 'sw' },
  { id: 'tbk-8', text: '20 Percent Money Money', categoryId: 'throwback-hits', language: 'sw' },
  { id: 'tbk-9', text: 'Juma Nature Ugali', categoryId: 'throwback-hits', language: 'sw' },
  { id: 'tbk-10', text: 'East Coast Team', categoryId: 'throwback-hits', language: 'mixed' },
]

/**
 * Filter and retrieve prompts based on category IDs and language preference.
 */
export function getFilteredPrompts(
  categoryIds: CategoryIconId[],
  isFeelingLucky: boolean,
  language: 'en' | 'sw' | 'mixed',
): GamePrompt[] {
  let pool = PROMPTS

  if (!isFeelingLucky && categoryIds.length > 0) {
    const idSet = new Set(categoryIds)
    pool = pool.filter((p) => idSet.has(p.categoryId))
  }

  if (language === 'en') {
    pool = pool.filter((p) => p.language === 'en' || p.language === 'mixed')
  } else if (language === 'sw') {
    pool = pool.filter((p) => p.language === 'sw' || p.language === 'mixed')
  }

  // If filtered pool is somehow empty (e.g. edge case), fallback to entire matching category pool
  if (pool.length === 0) {
    pool = PROMPTS.filter((p) => !categoryIds.length || categoryIds.includes(p.categoryId))
  }

  return pool.length > 0 ? pool : PROMPTS
}
