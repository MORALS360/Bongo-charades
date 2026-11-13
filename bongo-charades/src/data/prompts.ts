import type { CategoryIconId, GamePrompt, PromptLanguage } from '../types'
import { nextRandom } from '../game/promptDeck'

/**
 * Bongo Charades — Prompt Library (pre-Phase 5 restructure, 2026-11-12)
 *
 * GENERATED from a readable spec (see docs/content/CONTENT_DIRECTION.md for the rules).
 * Each category group has its own content identity and language direction:
 *
 *  - Classic Charades ............ universal, English-led. Most prompts are translation
 *                                  pairs sharing a `concept` (e.g. "Lion" / "Simba").
 *  - Bongo & Tanzanian Culture ... Tanzanian, Kiswahili-led. English is not forced in.
 *  - East Africa & Beyond ........ Africa-wide and international, English-led.
 *
 * `language: 'mixed'` = works in any language (names, song titles, brands).
 * `hint` = small helper line shown under the prompt (e.g. the artist of a song).
 * `needsReview: true` = flagged for human review (see the content report).
 *
 * Research notes and sources live in docs/content/, NOT in this file.
 */
export const PROMPTS: GamePrompt[] = [
  // ── animals ──
  { id: 'anim-1', text: 'Lion', categoryId: 'animals', language: 'en', concept: 'anim-lion' },
  { id: 'anim-2', text: 'Simba', categoryId: 'animals', language: 'sw', concept: 'anim-lion' },
  { id: 'anim-3', text: 'Elephant', categoryId: 'animals', language: 'en', concept: 'anim-elephant' },
  { id: 'anim-4', text: 'Tembo', categoryId: 'animals', language: 'sw', concept: 'anim-elephant' },
  { id: 'anim-5', text: 'Giraffe', categoryId: 'animals', language: 'en', concept: 'anim-giraffe' },
  { id: 'anim-6', text: 'Twiga', categoryId: 'animals', language: 'sw', concept: 'anim-giraffe' },
  { id: 'anim-7', text: 'Leopard', categoryId: 'animals', language: 'en', concept: 'anim-leopard' },
  { id: 'anim-8', text: 'Chui', categoryId: 'animals', language: 'sw', concept: 'anim-leopard' },
  { id: 'anim-9', text: 'Hippo', categoryId: 'animals', language: 'en', concept: 'anim-hippo' },
  { id: 'anim-10', text: 'Kiboko', categoryId: 'animals', language: 'sw', concept: 'anim-hippo' },
  { id: 'anim-11', text: 'Crocodile', categoryId: 'animals', language: 'en', concept: 'anim-crocodile' },
  { id: 'anim-12', text: 'Mamba', categoryId: 'animals', language: 'sw', concept: 'anim-crocodile' },
  { id: 'anim-13', text: 'Monkey', categoryId: 'animals', language: 'en', concept: 'anim-monkey' },
  { id: 'anim-14', text: 'Tumbili', categoryId: 'animals', language: 'sw', concept: 'anim-monkey' },
  { id: 'anim-15', text: 'Zebra', categoryId: 'animals', language: 'en', concept: 'anim-zebra' },
  { id: 'anim-16', text: 'Pundamilia', categoryId: 'animals', language: 'sw', concept: 'anim-zebra' },
  { id: 'anim-17', text: 'Snake', categoryId: 'animals', language: 'en', concept: 'anim-snake' },
  { id: 'anim-18', text: 'Nyoka', categoryId: 'animals', language: 'sw', concept: 'anim-snake' },
  { id: 'anim-19', text: 'Dog', categoryId: 'animals', language: 'en', concept: 'anim-dog' },
  { id: 'anim-20', text: 'Mbwa', categoryId: 'animals', language: 'sw', concept: 'anim-dog' },
  { id: 'anim-21', text: 'Cat', categoryId: 'animals', language: 'en', concept: 'anim-cat' },
  { id: 'anim-22', text: 'Paka', categoryId: 'animals', language: 'sw', concept: 'anim-cat' },
  { id: 'anim-23', text: 'Chicken', categoryId: 'animals', language: 'en', concept: 'anim-chicken' },
  { id: 'anim-24', text: 'Kuku', categoryId: 'animals', language: 'sw', concept: 'anim-chicken' },
  { id: 'anim-25', text: 'Rhino', categoryId: 'animals', language: 'en', concept: 'anim-rhino' },
  { id: 'anim-26', text: 'Kifaru', categoryId: 'animals', language: 'sw', concept: 'anim-rhino' },
  { id: 'anim-27', text: 'Frog', categoryId: 'animals', language: 'en', concept: 'anim-frog' },
  { id: 'anim-28', text: 'Chura', categoryId: 'animals', language: 'sw', concept: 'anim-frog' },
  { id: 'anim-29', text: 'Cow', categoryId: 'animals', language: 'en', concept: 'anim-cow' },
  { id: 'anim-30', text: "Ng'ombe", categoryId: 'animals', language: 'sw', concept: 'anim-cow' },
  { id: 'anim-31', text: 'Fish', categoryId: 'animals', language: 'en', concept: 'anim-fish' },
  { id: 'anim-32', text: 'Samaki', categoryId: 'animals', language: 'sw', concept: 'anim-fish' },

  // ── movies-tv ──
  { id: 'mov-1', text: 'The Lion King', categoryId: 'movies-tv', language: 'mixed' },
  { id: 'mov-2', text: 'Black Panther', categoryId: 'movies-tv', language: 'mixed' },
  { id: 'mov-3', text: 'Titanic', categoryId: 'movies-tv', language: 'mixed' },
  { id: 'mov-4', text: 'Avatar', categoryId: 'movies-tv', language: 'mixed' },
  { id: 'mov-5', text: 'Spider-Man', categoryId: 'movies-tv', language: 'mixed' },
  { id: 'mov-6', text: 'Fast & Furious', categoryId: 'movies-tv', language: 'mixed' },
  { id: 'mov-7', text: 'Money Heist', categoryId: 'movies-tv', language: 'mixed' },
  { id: 'mov-8', text: 'Game of Thrones', categoryId: 'movies-tv', language: 'mixed' },
  { id: 'mov-9', text: 'Harry Potter', categoryId: 'movies-tv', language: 'mixed' },
  { id: 'mov-10', text: 'Squid Game', categoryId: 'movies-tv', language: 'mixed' },
  { id: 'mov-11', text: 'Tom and Jerry', categoryId: 'movies-tv', language: 'mixed' },
  { id: 'mov-12', text: 'Mr. Bean', categoryId: 'movies-tv', language: 'mixed' },
  { id: 'mov-13', text: 'Shrek', categoryId: 'movies-tv', language: 'mixed' },
  { id: 'mov-14', text: 'Frozen', categoryId: 'movies-tv', language: 'mixed' },
  { id: 'mov-15', text: 'Superman', categoryId: 'movies-tv', language: 'mixed' },

  // ── music-artists ──
  { id: 'mus-1', text: 'Michael Jackson', categoryId: 'music-artists', language: 'mixed' },
  { id: 'mus-2', text: 'Beyoncé', categoryId: 'music-artists', language: 'mixed' },
  { id: 'mus-3', text: 'Rihanna', categoryId: 'music-artists', language: 'mixed' },
  { id: 'mus-4', text: 'Bob Marley', categoryId: 'music-artists', language: 'mixed' },
  { id: 'mus-5', text: 'Drake', categoryId: 'music-artists', language: 'mixed' },
  { id: 'mus-6', text: 'Chris Brown', categoryId: 'music-artists', language: 'mixed' },
  { id: 'mus-7', text: 'Taylor Swift', categoryId: 'music-artists', language: 'mixed' },
  { id: 'mus-8', text: 'Ed Sheeran', categoryId: 'music-artists', language: 'mixed' },
  { id: 'mus-9', text: 'Shakira', categoryId: 'music-artists', language: 'mixed' },
  { id: 'mus-10', text: 'Justin Bieber', categoryId: 'music-artists', language: 'mixed' },
  { id: 'mus-11', text: 'Guitar', categoryId: 'music-artists', language: 'en', concept: 'mus-guitar' },
  { id: 'mus-12', text: 'Gitaa', categoryId: 'music-artists', language: 'sw', concept: 'mus-guitar' },
  { id: 'mus-13', text: 'Drums', categoryId: 'music-artists', language: 'en', concept: 'mus-drums' },
  { id: 'mus-14', text: 'Ngoma', categoryId: 'music-artists', language: 'sw', concept: 'mus-drums' },
  { id: 'mus-15', text: 'Piano', categoryId: 'music-artists', language: 'en', concept: 'mus-piano' },
  { id: 'mus-16', text: 'Kinanda', categoryId: 'music-artists', language: 'sw', concept: 'mus-piano' },
  { id: 'mus-17', text: 'Microphone', categoryId: 'music-artists', language: 'en', concept: 'mus-microphone' },
  { id: 'mus-18', text: 'Kipaza Sauti', categoryId: 'music-artists', language: 'sw', concept: 'mus-microphone' },
  { id: 'mus-19', text: 'DJ', categoryId: 'music-artists', language: 'mixed' },
  { id: 'mus-20', text: 'Karaoke', categoryId: 'music-artists', language: 'mixed' },

  // ── sports ──
  { id: 'spt-1', text: 'Football', categoryId: 'sports', language: 'en', concept: 'spt-football' },
  { id: 'spt-2', text: 'Mpira wa Miguu', categoryId: 'sports', language: 'sw', concept: 'spt-football' },
  { id: 'spt-3', text: 'Basketball', categoryId: 'sports', language: 'en', concept: 'spt-basketball' },
  { id: 'spt-4', text: 'Mpira wa Kikapu', categoryId: 'sports', language: 'sw', concept: 'spt-basketball' },
  { id: 'spt-5', text: 'Boxing', categoryId: 'sports', language: 'en', concept: 'spt-boxing' },
  { id: 'spt-6', text: 'Ngumi', categoryId: 'sports', language: 'sw', concept: 'spt-boxing' },
  { id: 'spt-7', text: 'Swimming', categoryId: 'sports', language: 'en', concept: 'spt-swimming' },
  { id: 'spt-8', text: 'Kuogelea', categoryId: 'sports', language: 'sw', concept: 'spt-swimming' },
  { id: 'spt-9', text: 'Running', categoryId: 'sports', language: 'en', concept: 'spt-running' },
  { id: 'spt-10', text: 'Kukimbia', categoryId: 'sports', language: 'sw', concept: 'spt-running' },
  { id: 'spt-11', text: 'Goalkeeper', categoryId: 'sports', language: 'en', concept: 'spt-goalkeeper' },
  { id: 'spt-12', text: 'Kipa', categoryId: 'sports', language: 'sw', concept: 'spt-goalkeeper' },
  { id: 'spt-13', text: 'Penalty', categoryId: 'sports', language: 'en', concept: 'spt-penalty' },
  { id: 'spt-14', text: 'Penalti', categoryId: 'sports', language: 'sw', concept: 'spt-penalty' },
  { id: 'spt-15', text: 'Cycling', categoryId: 'sports', language: 'en', concept: 'spt-cycling' },
  { id: 'spt-16', text: 'Mbio za Baiskeli', categoryId: 'sports', language: 'sw', concept: 'spt-cycling' },
  { id: 'spt-17', text: 'Volleyball', categoryId: 'sports', language: 'en', concept: 'spt-volleyball' },
  { id: 'spt-18', text: 'Mpira wa Wavu', categoryId: 'sports', language: 'sw', concept: 'spt-volleyball' },
  { id: 'spt-19', text: 'Tennis', categoryId: 'sports', language: 'mixed' },
  { id: 'spt-20', text: 'Cristiano Ronaldo', categoryId: 'sports', language: 'mixed' },
  { id: 'spt-21', text: 'Lionel Messi', categoryId: 'sports', language: 'mixed' },
  { id: 'spt-22', text: 'Usain Bolt', categoryId: 'sports', language: 'mixed' },
  { id: 'spt-23', text: 'Olympics', categoryId: 'sports', language: 'mixed' },

  // ── countries ──
  { id: 'cty-1', text: 'Tanzania', categoryId: 'countries', language: 'mixed' },
  { id: 'cty-2', text: 'Kenya', categoryId: 'countries', language: 'mixed' },
  { id: 'cty-3', text: 'Nigeria', categoryId: 'countries', language: 'mixed' },
  { id: 'cty-4', text: 'Ghana', categoryId: 'countries', language: 'mixed' },
  { id: 'cty-5', text: 'Australia', categoryId: 'countries', language: 'mixed' },
  { id: 'cty-6', text: 'Argentina', categoryId: 'countries', language: 'mixed' },
  { id: 'cty-7', text: 'Jamaica', categoryId: 'countries', language: 'mixed' },
  { id: 'cty-8', text: 'India', categoryId: 'countries', language: 'mixed' },
  { id: 'cty-9', text: 'Japan', categoryId: 'countries', language: 'en', concept: 'cty-japan' },
  { id: 'cty-10', text: 'Japani', categoryId: 'countries', language: 'sw', concept: 'cty-japan' },
  { id: 'cty-11', text: 'Brazil', categoryId: 'countries', language: 'en', concept: 'cty-brazil' },
  { id: 'cty-12', text: 'Brazili', categoryId: 'countries', language: 'sw', concept: 'cty-brazil' },
  { id: 'cty-13', text: 'France', categoryId: 'countries', language: 'en', concept: 'cty-france' },
  { id: 'cty-14', text: 'Ufaransa', categoryId: 'countries', language: 'sw', concept: 'cty-france' },
  { id: 'cty-15', text: 'Canada', categoryId: 'countries', language: 'en', concept: 'cty-canada' },
  { id: 'cty-16', text: 'Kanada', categoryId: 'countries', language: 'sw', concept: 'cty-canada' },
  { id: 'cty-17', text: 'China', categoryId: 'countries', language: 'en', concept: 'cty-china' },
  { id: 'cty-18', text: 'Uchina', categoryId: 'countries', language: 'sw', concept: 'cty-china' },
  { id: 'cty-19', text: 'Egypt', categoryId: 'countries', language: 'en', concept: 'cty-egypt' },
  { id: 'cty-20', text: 'Misri', categoryId: 'countries', language: 'sw', concept: 'cty-egypt' },
  { id: 'cty-21', text: 'America', categoryId: 'countries', language: 'en', concept: 'cty-america' },
  { id: 'cty-22', text: 'Marekani', categoryId: 'countries', language: 'sw', concept: 'cty-america' },
  { id: 'cty-23', text: 'Germany', categoryId: 'countries', language: 'en', concept: 'cty-germany' },
  { id: 'cty-24', text: 'Ujerumani', categoryId: 'countries', language: 'sw', concept: 'cty-germany' },
  { id: 'cty-25', text: 'Italy', categoryId: 'countries', language: 'en', concept: 'cty-italy' },
  { id: 'cty-26', text: 'Italia', categoryId: 'countries', language: 'sw', concept: 'cty-italy' },
  { id: 'cty-27', text: 'Spain', categoryId: 'countries', language: 'en', concept: 'cty-spain' },
  { id: 'cty-28', text: 'Hispania', categoryId: 'countries', language: 'sw', concept: 'cty-spain' },
  { id: 'cty-29', text: 'Mexico', categoryId: 'countries', language: 'en', concept: 'cty-mexico' },
  { id: 'cty-30', text: 'Meksiko', categoryId: 'countries', language: 'sw', concept: 'cty-mexico' },
  { id: 'cty-31', text: 'Russia', categoryId: 'countries', language: 'en', concept: 'cty-russia' },
  { id: 'cty-32', text: 'Urusi', categoryId: 'countries', language: 'sw', concept: 'cty-russia' },
  { id: 'cty-33', text: 'England', categoryId: 'countries', language: 'en', concept: 'cty-england' },
  { id: 'cty-34', text: 'Uingereza', categoryId: 'countries', language: 'sw', concept: 'cty-england' },
  { id: 'cty-35', text: 'South Africa', categoryId: 'countries', language: 'en', concept: 'cty-south-africa' },
  { id: 'cty-36', text: 'Afrika Kusini', categoryId: 'countries', language: 'sw', concept: 'cty-south-africa' },
  { id: 'cty-37', text: 'Portugal', categoryId: 'countries', language: 'en', concept: 'cty-portugal' },
  { id: 'cty-38', text: 'Ureno', categoryId: 'countries', language: 'sw', concept: 'cty-portugal' },
  { id: 'cty-39', text: 'Greece', categoryId: 'countries', language: 'en', concept: 'cty-greece' },
  { id: 'cty-40', text: 'Ugiriki', categoryId: 'countries', language: 'sw', concept: 'cty-greece' },

  // ── famous-landmarks ──
  { id: 'lmk-1', text: 'Mount Kilimanjaro', categoryId: 'famous-landmarks', language: 'en', concept: 'lmk-mount-kilimanjaro' },
  { id: 'lmk-2', text: 'Mlima Kilimanjaro', categoryId: 'famous-landmarks', language: 'sw', concept: 'lmk-mount-kilimanjaro' },
  { id: 'lmk-3', text: 'Pyramids of Giza', categoryId: 'famous-landmarks', language: 'en', concept: 'lmk-pyramids-of-giza' },
  { id: 'lmk-4', text: 'Mapiramidi ya Giza', categoryId: 'famous-landmarks', language: 'sw', concept: 'lmk-pyramids-of-giza' },
  { id: 'lmk-5', text: 'Eiffel Tower', categoryId: 'famous-landmarks', language: 'mixed' },
  { id: 'lmk-6', text: 'Statue of Liberty', categoryId: 'famous-landmarks', language: 'mixed' },
  { id: 'lmk-7', text: 'Great Wall of China', categoryId: 'famous-landmarks', language: 'mixed' },
  { id: 'lmk-8', text: 'Taj Mahal', categoryId: 'famous-landmarks', language: 'mixed' },
  { id: 'lmk-9', text: 'Colosseum', categoryId: 'famous-landmarks', language: 'mixed' },
  { id: 'lmk-10', text: 'Burj Khalifa', categoryId: 'famous-landmarks', language: 'mixed' },
  { id: 'lmk-11', text: 'Sydney Opera House', categoryId: 'famous-landmarks', language: 'mixed' },
  { id: 'lmk-12', text: 'Big Ben', categoryId: 'famous-landmarks', language: 'mixed' },
  { id: 'lmk-13', text: 'Christ the Redeemer', categoryId: 'famous-landmarks', language: 'mixed' },
  { id: 'lmk-14', text: 'Leaning Tower of Pisa', categoryId: 'famous-landmarks', language: 'mixed' },
  { id: 'lmk-15', text: 'Machu Picchu', categoryId: 'famous-landmarks', language: 'mixed' },
  { id: 'lmk-16', text: 'Victoria Falls', categoryId: 'famous-landmarks', language: 'mixed' },
  { id: 'lmk-17', text: 'Table Mountain', categoryId: 'famous-landmarks', language: 'mixed' },
  { id: 'lmk-18', text: 'Golden Gate Bridge', categoryId: 'famous-landmarks', language: 'mixed' },
  { id: 'lmk-19', text: 'Mount Everest', categoryId: 'famous-landmarks', language: 'mixed' },
  { id: 'lmk-20', text: 'Niagara Falls', categoryId: 'famous-landmarks', language: 'mixed' },
  { id: 'lmk-21', text: 'Stonehenge', categoryId: 'famous-landmarks', language: 'mixed' },
  { id: 'lmk-22', text: 'Hollywood Sign', categoryId: 'famous-landmarks', language: 'mixed' },
  { id: 'lmk-23', text: 'Times Square', categoryId: 'famous-landmarks', language: 'mixed' },

  // ── car-brands ──
  { id: 'car-1', text: 'Toyota', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-2', text: 'Mercedes-Benz', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-3', text: 'BMW', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-4', text: 'Audi', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-5', text: 'Volkswagen', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-6', text: 'Nissan', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-7', text: 'Honda', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-8', text: 'Mazda', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-9', text: 'Subaru', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-10', text: 'Suzuki', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-11', text: 'Mitsubishi', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-12', text: 'Isuzu', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-13', text: 'Hyundai', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-14', text: 'Kia', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-15', text: 'Ford', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-16', text: 'Chevrolet', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-17', text: 'Jeep', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-18', text: 'Tesla', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-19', text: 'Land Rover', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-20', text: 'Volvo', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-21', text: 'Peugeot', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-22', text: 'Mini', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-23', text: 'Ferrari', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-24', text: 'Lamborghini', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-25', text: 'Porsche', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-26', text: 'Rolls-Royce', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-27', text: 'Bentley', categoryId: 'car-brands', language: 'mixed' },
  { id: 'car-28', text: 'Bugatti', categoryId: 'car-brands', language: 'mixed' },

  // ── famous-brands ──
  { id: 'brd-1', text: 'Apple', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-2', text: 'Samsung', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-3', text: 'Google', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-4', text: 'Microsoft', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-5', text: 'Amazon', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-6', text: 'Netflix', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-7', text: 'WhatsApp', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-8', text: 'Instagram', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-9', text: 'Disney', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-10', text: 'PlayStation', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-11', text: 'Nike', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-12', text: 'Adidas', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-13', text: 'Puma', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-14', text: 'Gucci', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-15', text: 'Louis Vuitton', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-16', text: 'Chanel', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-17', text: 'Tiffany & Co.', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-18', text: 'Zara', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-19', text: 'Coca-Cola', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-20', text: 'Pepsi', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-21', text: "McDonald's", categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-22', text: 'KFC', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-23', text: 'Starbucks', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-24', text: 'Red Bull', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-25', text: 'IKEA', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-26', text: 'Lego', categoryId: 'famous-brands', language: 'mixed' },
  { id: 'brd-27', text: 'Visa', categoryId: 'famous-brands', language: 'mixed' },

  // ── everyday-things ──
  { id: 'evd-1', text: 'Umbrella', categoryId: 'everyday-things', language: 'en', concept: 'evd-umbrella' },
  { id: 'evd-2', text: 'Mwavuli', categoryId: 'everyday-things', language: 'sw', concept: 'evd-umbrella' },
  { id: 'evd-3', text: 'Flashlight', categoryId: 'everyday-things', language: 'en', concept: 'evd-flashlight' },
  { id: 'evd-4', text: 'Tochi', categoryId: 'everyday-things', language: 'sw', concept: 'evd-flashlight' },
  { id: 'evd-5', text: 'Watch', categoryId: 'everyday-things', language: 'en', concept: 'evd-watch' },
  { id: 'evd-6', text: 'Saa', categoryId: 'everyday-things', language: 'sw', concept: 'evd-watch' },
  { id: 'evd-7', text: 'Bucket', categoryId: 'everyday-things', language: 'en', concept: 'evd-bucket' },
  { id: 'evd-8', text: 'Ndoo', categoryId: 'everyday-things', language: 'sw', concept: 'evd-bucket' },
  { id: 'evd-9', text: 'Matches', categoryId: 'everyday-things', language: 'en', concept: 'evd-matches' },
  { id: 'evd-10', text: 'Kiberiti', categoryId: 'everyday-things', language: 'sw', concept: 'evd-matches' },
  { id: 'evd-11', text: 'Broom', categoryId: 'everyday-things', language: 'en', concept: 'evd-broom' },
  { id: 'evd-12', text: 'Fagio', categoryId: 'everyday-things', language: 'sw', concept: 'evd-broom' },
  { id: 'evd-13', text: 'Phone Charger', categoryId: 'everyday-things', language: 'en', concept: 'evd-phone-charger' },
  { id: 'evd-14', text: 'Chaja', categoryId: 'everyday-things', language: 'sw', concept: 'evd-phone-charger' },
  { id: 'evd-15', text: 'Mirror', categoryId: 'everyday-things', language: 'en', concept: 'evd-mirror' },
  { id: 'evd-16', text: 'Kioo', categoryId: 'everyday-things', language: 'sw', concept: 'evd-mirror' },
  { id: 'evd-17', text: 'Toothbrush', categoryId: 'everyday-things', language: 'en', concept: 'evd-toothbrush' },
  { id: 'evd-18', text: 'Mswaki', categoryId: 'everyday-things', language: 'sw', concept: 'evd-toothbrush' },
  { id: 'evd-19', text: 'Key', categoryId: 'everyday-things', language: 'en', concept: 'evd-key' },
  { id: 'evd-20', text: 'Ufunguo', categoryId: 'everyday-things', language: 'sw', concept: 'evd-key' },
  { id: 'evd-21', text: 'Chair', categoryId: 'everyday-things', language: 'en', concept: 'evd-chair' },
  { id: 'evd-22', text: 'Kiti', categoryId: 'everyday-things', language: 'sw', concept: 'evd-chair' },
  { id: 'evd-23', text: 'Iron', categoryId: 'everyday-things', language: 'en', concept: 'evd-iron' },
  { id: 'evd-24', text: 'Pasi', categoryId: 'everyday-things', language: 'sw', concept: 'evd-iron' },
  { id: 'evd-25', text: 'Glasses', categoryId: 'everyday-things', language: 'en', concept: 'evd-glasses' },
  { id: 'evd-26', text: 'Miwani', categoryId: 'everyday-things', language: 'sw', concept: 'evd-glasses' },
  { id: 'evd-27', text: 'Phone', categoryId: 'everyday-things', language: 'en', concept: 'evd-phone' },
  { id: 'evd-28', text: 'Simu', categoryId: 'everyday-things', language: 'sw', concept: 'evd-phone' },

  // ── act-it-out ──
  { id: 'act-1', text: 'Taking a Selfie', categoryId: 'act-it-out', language: 'en', concept: 'act-taking-a-selfie' },
  { id: 'act-2', text: 'Kupiga Selfie', categoryId: 'act-it-out', language: 'sw', concept: 'act-taking-a-selfie' },
  { id: 'act-3', text: 'Sleeping in Class', categoryId: 'act-it-out', language: 'en', concept: 'act-sleeping-in-class' },
  { id: 'act-4', text: 'Kusinzia Darasani', categoryId: 'act-it-out', language: 'sw', concept: 'act-sleeping-in-class' },
  { id: 'act-5', text: 'Sneezing', categoryId: 'act-it-out', language: 'en', concept: 'act-sneezing' },
  { id: 'act-6', text: 'Kupiga Chafya', categoryId: 'act-it-out', language: 'sw', concept: 'act-sneezing' },
  { id: 'act-7', text: 'Washing Clothes', categoryId: 'act-it-out', language: 'en', concept: 'act-washing-clothes' },
  { id: 'act-8', text: 'Kufua Nguo', categoryId: 'act-it-out', language: 'sw', concept: 'act-washing-clothes' },
  { id: 'act-9', text: 'Chased by a Dog', categoryId: 'act-it-out', language: 'en', concept: 'act-chased-by-a-dog' },
  { id: 'act-10', text: 'Kukimbizwa na Mbwa', categoryId: 'act-it-out', language: 'sw', concept: 'act-chased-by-a-dog' },
  { id: 'act-11', text: 'Brushing Teeth', categoryId: 'act-it-out', language: 'en', concept: 'act-brushing-teeth' },
  { id: 'act-12', text: 'Kupiga Mswaki', categoryId: 'act-it-out', language: 'sw', concept: 'act-brushing-teeth' },
  { id: 'act-13', text: 'Riding a Bicycle', categoryId: 'act-it-out', language: 'en', concept: 'act-riding-a-bicycle' },
  { id: 'act-14', text: 'Kuendesha Baiskeli', categoryId: 'act-it-out', language: 'sw', concept: 'act-riding-a-bicycle' },
  { id: 'act-15', text: 'Crying', categoryId: 'act-it-out', language: 'en', concept: 'act-crying' },
  { id: 'act-16', text: 'Kulia', categoryId: 'act-it-out', language: 'sw', concept: 'act-crying' },
  { id: 'act-17', text: 'Laughing', categoryId: 'act-it-out', language: 'en', concept: 'act-laughing' },
  { id: 'act-18', text: 'Kucheka', categoryId: 'act-it-out', language: 'sw', concept: 'act-laughing' },
  { id: 'act-19', text: 'Fishing', categoryId: 'act-it-out', language: 'en', concept: 'act-fishing' },
  { id: 'act-20', text: 'Kuvua Samaki', categoryId: 'act-it-out', language: 'sw', concept: 'act-fishing' },
  { id: 'act-21', text: 'Cooking', categoryId: 'act-it-out', language: 'en', concept: 'act-cooking' },
  { id: 'act-22', text: 'Kupika', categoryId: 'act-it-out', language: 'sw', concept: 'act-cooking' },
  { id: 'act-23', text: 'Dancing', categoryId: 'act-it-out', language: 'en', concept: 'act-dancing' },
  { id: 'act-24', text: 'Kucheza Muziki', categoryId: 'act-it-out', language: 'sw', concept: 'act-dancing' },
  { id: 'act-25', text: 'Driving', categoryId: 'act-it-out', language: 'en', concept: 'act-driving' },
  { id: 'act-26', text: 'Kuendesha Gari', categoryId: 'act-it-out', language: 'sw', concept: 'act-driving' },
  { id: 'act-27', text: 'Winning the Lottery', categoryId: 'act-it-out', language: 'en', concept: 'act-winning-the-lottery' },
  { id: 'act-28', text: 'Kushinda Bahati Nasibu', categoryId: 'act-it-out', language: 'sw', concept: 'act-winning-the-lottery' },

  // ── food-drinks ──
  { id: 'food-1', text: 'Pizza', categoryId: 'food-drinks', language: 'mixed' },
  { id: 'food-2', text: 'Ice Cream', categoryId: 'food-drinks', language: 'en', concept: 'food-ice-cream' },
  { id: 'food-3', text: 'Aiskrimu', categoryId: 'food-drinks', language: 'sw', concept: 'food-ice-cream' },
  { id: 'food-4', text: 'Burger', categoryId: 'food-drinks', language: 'mixed' },
  { id: 'food-5', text: 'Rice', categoryId: 'food-drinks', language: 'en', concept: 'food-rice' },
  { id: 'food-6', text: 'Wali', categoryId: 'food-drinks', language: 'sw', concept: 'food-rice' },
  { id: 'food-7', text: 'Bread', categoryId: 'food-drinks', language: 'en', concept: 'food-bread' },
  { id: 'food-8', text: 'Mkate', categoryId: 'food-drinks', language: 'sw', concept: 'food-bread' },
  { id: 'food-9', text: 'Egg', categoryId: 'food-drinks', language: 'en', concept: 'food-egg' },
  { id: 'food-10', text: 'Yai', categoryId: 'food-drinks', language: 'sw', concept: 'food-egg' },
  { id: 'food-11', text: 'Banana', categoryId: 'food-drinks', language: 'en', concept: 'food-banana' },
  { id: 'food-12', text: 'Ndizi', categoryId: 'food-drinks', language: 'sw', concept: 'food-banana' },
  { id: 'food-13', text: 'Tea', categoryId: 'food-drinks', language: 'en', concept: 'food-tea' },
  { id: 'food-14', text: 'Chai', categoryId: 'food-drinks', language: 'sw', concept: 'food-tea' },
  { id: 'food-15', text: 'Coffee', categoryId: 'food-drinks', language: 'en', concept: 'food-coffee' },
  { id: 'food-16', text: 'Kahawa', categoryId: 'food-drinks', language: 'sw', concept: 'food-coffee' },
  { id: 'food-17', text: 'Orange Juice', categoryId: 'food-drinks', language: 'en', concept: 'food-orange-juice' },
  { id: 'food-18', text: 'Juisi ya Machungwa', categoryId: 'food-drinks', language: 'sw', concept: 'food-orange-juice' },
  { id: 'food-19', text: 'Watermelon', categoryId: 'food-drinks', language: 'en', concept: 'food-watermelon' },
  { id: 'food-20', text: 'Tikiti Maji', categoryId: 'food-drinks', language: 'sw', concept: 'food-watermelon' },
  { id: 'food-21', text: 'Chocolate', categoryId: 'food-drinks', language: 'en', concept: 'food-chocolate' },
  { id: 'food-22', text: 'Chokoleti', categoryId: 'food-drinks', language: 'sw', concept: 'food-chocolate' },
  { id: 'food-23', text: 'Popcorn', categoryId: 'food-drinks', language: 'mixed' },
  { id: 'food-24', text: 'Milk', categoryId: 'food-drinks', language: 'en', concept: 'food-milk' },
  { id: 'food-25', text: 'Maziwa', categoryId: 'food-drinks', language: 'sw', concept: 'food-milk' },
  { id: 'food-26', text: 'Soda', categoryId: 'food-drinks', language: 'mixed' },

  // ── hii-dar-yetu ──
  { id: 'dar-1', text: 'Kariakoo', categoryId: 'hii-dar-yetu', language: 'sw' },
  { id: 'dar-2', text: 'Coco Beach', categoryId: 'hii-dar-yetu', language: 'mixed' },
  { id: 'dar-3', text: 'Mlimani City', categoryId: 'hii-dar-yetu', language: 'mixed' },
  { id: 'dar-4', text: 'Daraja la Tanzanite', categoryId: 'hii-dar-yetu', language: 'sw' },
  { id: 'dar-5', text: 'Kivuko cha Kigamboni', categoryId: 'hii-dar-yetu', language: 'sw' },
  { id: 'dar-6', text: 'Daraja la Kigamboni', categoryId: 'hii-dar-yetu', language: 'sw' },
  { id: 'dar-7', text: 'Mnazi Mmoja', categoryId: 'hii-dar-yetu', language: 'sw' },
  { id: 'dar-8', text: 'Posta', categoryId: 'hii-dar-yetu', language: 'sw' },
  { id: 'dar-9', text: 'Samaki Samaki', categoryId: 'hii-dar-yetu', language: 'mixed' },
  { id: 'dar-10', text: 'Flyover ya Tazara', categoryId: 'hii-dar-yetu', language: 'sw' },
  { id: 'dar-11', text: 'Mwendokasi', categoryId: 'hii-dar-yetu', language: 'sw' },
  { id: 'dar-12', text: 'Foleni', categoryId: 'hii-dar-yetu', language: 'sw' },
  { id: 'dar-13', text: 'Soko la Samaki Feri', categoryId: 'hii-dar-yetu', language: 'sw' },

  // ── daladala-diaries ──
  { id: 'dld-1', text: 'Konda', categoryId: 'daladala-diaries', language: 'sw' },
  { id: 'dld-2', text: 'Dereva wa Daladala', categoryId: 'daladala-diaries', language: 'sw' },
  { id: 'dld-3', text: 'Nauli', categoryId: 'daladala-diaries', language: 'sw' },
  { id: 'dld-4', text: 'Chenji', categoryId: 'daladala-diaries', language: 'sw' },
  { id: 'dld-5', text: 'Shusha Hapa!', categoryId: 'daladala-diaries', language: 'sw' },
  { id: 'dld-6', text: 'Sogeeni Ndani', categoryId: 'daladala-diaries', language: 'sw' },
  { id: 'dld-7', text: 'Siti ya Mbele', categoryId: 'daladala-diaries', language: 'sw' },
  { id: 'dld-8', text: 'Stendi ya Mwenge', categoryId: 'daladala-diaries', language: 'sw' },
  { id: 'dld-9', text: 'Stendi ya Gerezani', categoryId: 'daladala-diaries', language: 'sw' },
  { id: 'dld-10', text: 'Mwisho wa Gari', categoryId: 'daladala-diaries', language: 'sw' },
  { id: 'dld-11', text: 'Kubanana', categoryId: 'daladala-diaries', language: 'sw' },
  { id: 'dld-12', text: 'Mzigo wa Abiria', categoryId: 'daladala-diaries', language: 'sw' },

  // ── bongo-flava ──
  { id: 'bf-1', text: 'Diamond Platnumz', categoryId: 'bongo-flava', language: 'mixed' },
  { id: 'bf-2', text: 'Ali Kiba', categoryId: 'bongo-flava', language: 'mixed' },
  { id: 'bf-3', text: 'Harmonize', categoryId: 'bongo-flava', language: 'mixed' },
  { id: 'bf-4', text: 'Zuchu', categoryId: 'bongo-flava', language: 'mixed' },
  { id: 'bf-5', text: 'Marioo', categoryId: 'bongo-flava', language: 'mixed' },
  { id: 'bf-6', text: 'Nandy', categoryId: 'bongo-flava', language: 'mixed' },
  { id: 'bf-7', text: 'Rayvanny', categoryId: 'bongo-flava', language: 'mixed' },
  { id: 'bf-8', text: 'Mbosso', categoryId: 'bongo-flava', language: 'mixed' },
  { id: 'bf-9', text: 'WCB Wasafi', categoryId: 'bongo-flava', language: 'mixed' },
  { id: 'bf-10', text: 'Singeli', categoryId: 'bongo-flava', language: 'sw' },
  { id: 'bf-11', text: 'Kucheza Singeli', categoryId: 'bongo-flava', language: 'sw' },
  { id: 'bf-12', text: 'Tetema', categoryId: 'bongo-flava', language: 'mixed', hint: 'Rayvanny ft. Diamond Platnumz' },
  { id: 'bf-13', text: 'Kwangwaru', categoryId: 'bongo-flava', language: 'mixed', hint: 'Harmonize ft. Diamond Platnumz' },
  { id: 'bf-14', text: 'Sukari', categoryId: 'bongo-flava', language: 'mixed', hint: 'Zuchu' },
  { id: 'bf-15', text: 'Salome', categoryId: 'bongo-flava', language: 'mixed', hint: 'Diamond Platnumz ft. Rayvanny' },
  { id: 'bf-16', text: 'Waah!', categoryId: 'bongo-flava', language: 'mixed', hint: 'Diamond Platnumz' },
  { id: 'bf-17', text: 'Aje', categoryId: 'bongo-flava', language: 'mixed', hint: 'Ali Kiba' },
  { id: 'bf-18', text: 'Mi Amor', categoryId: 'bongo-flava', language: 'mixed', hint: 'Marioo ft. Jovial' },
  { id: 'bf-19', text: 'Mama Amina', categoryId: 'bongo-flava', language: 'mixed', hint: 'Marioo' },
  { id: 'bf-20', text: 'Hainaga Ushemeji', categoryId: 'bongo-flava', language: 'mixed', hint: 'Man Fongo' },
  { id: 'bf-21', text: 'Nyumba Ndogo', categoryId: 'bongo-flava', language: 'mixed', hint: 'Zuchu' },
  { id: 'bf-22', text: 'Kwetu', categoryId: 'bongo-flava', language: 'mixed', hint: 'Rayvanny' },

  // ── mtaani ──
  { id: 'mta-1', text: 'Machinga', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-2', text: 'Mama Ntilie', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-3', text: 'Duka la Mangi', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-4', text: 'Genge', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-5', text: 'Kinyozi', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-6', text: 'Bodaboda', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-7', text: 'Bajaji', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-8', text: 'Umeme Umekatika', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-9', text: 'Kijiweni', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-10', text: 'Kahawa na Kashata', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-11', text: 'Bao', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-12', text: 'Kucheza Drafti', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-13', text: 'Kubishana Mpira', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-14', text: 'Maskani', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-15', text: 'Kukodi Baiskeli', categoryId: 'mtaani', language: 'sw' },
  { id: 'mta-16', text: 'Kupiga Pamba', categoryId: 'mtaani', language: 'sw', needsReview: true },
  { id: 'mta-17', text: 'Utajua Hujui', categoryId: 'mtaani', language: 'sw', needsReview: true },
  { id: 'mta-18', text: 'Haina Kufeli', categoryId: 'mtaani', language: 'sw', needsReview: true },

  // ── zilipendwa ──
  { id: 'zil-1', text: 'Shida', categoryId: 'zilipendwa', language: 'mixed', hint: 'Mbaraka Mwinshehe' },
  { id: 'zil-2', text: 'Pole Dada', categoryId: 'zilipendwa', language: 'mixed', hint: 'Mbaraka Mwinshehe' },
  { id: 'zil-3', text: 'Neema', categoryId: 'zilipendwa', language: 'mixed', hint: 'DDC Mlimani Park Orchestra' },
  { id: 'zil-4', text: 'Mambo kwa Soksi', categoryId: 'zilipendwa', language: 'mixed', hint: 'Remmy Ongala' },
  { id: 'zil-5', text: 'Kifo', categoryId: 'zilipendwa', language: 'mixed', hint: 'Remmy Ongala' },
  { id: 'zil-6', text: 'Kipenda Roho', categoryId: 'zilipendwa', language: 'mixed', hint: 'Remmy Ongala' },
  { id: 'zil-7', text: 'Kidali Po', categoryId: 'zilipendwa', language: 'mixed', hint: 'Mr Nice' },
  { id: 'zil-8', text: 'Siamini', categoryId: 'zilipendwa', language: 'mixed', hint: 'TID' },
  { id: 'zil-9', text: 'Umenikataa', categoryId: 'zilipendwa', language: 'mixed', hint: 'Ray C' },
  { id: 'zil-10', text: 'Kimya Kimya', categoryId: 'zilipendwa', language: 'mixed', hint: 'Jay Moe ft. Ngwair' },
  { id: 'zil-11', text: 'Habari Ndiyo Hiyo', categoryId: 'zilipendwa', language: 'mixed', hint: 'Mwana FA ft. AY' },
  { id: 'zil-12', text: 'Mapozi', categoryId: 'zilipendwa', language: 'mixed', hint: 'Mr Blue' },
  { id: 'zil-13', text: 'Binti Kiziwi', categoryId: 'zilipendwa', language: 'mixed', hint: 'Z Anto' },
  { id: 'zil-14', text: 'Nakshi Mrembo', categoryId: 'zilipendwa', language: 'mixed', hint: 'Ali Kiba' },
  { id: 'zil-15', text: 'Bembeleza', categoryId: 'zilipendwa', language: 'mixed', hint: 'Marlaw' },
  { id: 'zil-16', text: 'Siku Hazigandi', categoryId: 'zilipendwa', language: 'mixed', hint: 'Lady Jaydee' },
  { id: 'zil-17', text: 'Dar Mpaka Moro', categoryId: 'zilipendwa', language: 'mixed', hint: 'TMK Wanaume' },
  { id: 'zil-18', text: 'Nalia kwa Furaha', categoryId: 'zilipendwa', language: 'mixed', hint: 'Bushoke' },
  { id: 'zil-19', text: 'Anita', categoryId: 'zilipendwa', language: 'mixed', hint: 'Matonya ft. Lady Jaydee' },
  { id: 'zil-20', text: 'Maria Salome', categoryId: 'zilipendwa', language: 'mixed', hint: 'Saida Karoli', needsReview: true },
  { id: 'zil-21', text: 'My Number One', categoryId: 'zilipendwa', language: 'mixed', hint: 'Diamond Platnumz' },
  { id: 'zil-22', text: 'Mwana', categoryId: 'zilipendwa', language: 'mixed', hint: 'Ali Kiba' },
  { id: 'zil-23', text: 'Hawajui', categoryId: 'zilipendwa', language: 'mixed', hint: 'Vanessa Mdee' },
  { id: 'zil-24', text: 'Me & You', categoryId: 'zilipendwa', language: 'mixed', hint: 'Ommy Dimpoz ft. Vanessa Mdee' },

  // ── chakula-chetu ──
  { id: 'chk-1', text: 'Ugali na Samaki', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-2', text: 'Pilau', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-3', text: 'Ndizi Nyama', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-4', text: 'Makande', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-5', text: 'Supu ya Kongoro', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-6', text: 'Mchemsho', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-7', text: 'Kitimoto', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-8', text: 'Mihogo ya Kukaanga', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-9', text: 'Chapati', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-10', text: 'Biriani', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-11', text: 'Chipsi Mayai', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-12', text: 'Wali Maharage', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-13', text: 'Mishkaki', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-14', text: 'Maandazi', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-15', text: 'Chai ya Rangi', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-16', text: 'Juisi ya Miwa', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-17', text: 'Vitumbua', categoryId: 'chakula-chetu', language: 'sw' },
  { id: 'chk-18', text: 'Urojo', categoryId: 'chakula-chetu', language: 'sw' },

  // ── watu-maarufu ──
  { id: 'wtm-1', text: 'Mwalimu Nyerere', categoryId: 'watu-maarufu', language: 'sw' },
  { id: 'wtm-2', text: 'Samia Suluhu Hassan', categoryId: 'watu-maarufu', language: 'mixed' },
  { id: 'wtm-3', text: 'Haji Manara', categoryId: 'watu-maarufu', language: 'mixed' },
  { id: 'wtm-4', text: 'Millard Ayo', categoryId: 'watu-maarufu', language: 'mixed' },
  { id: 'wtm-5', text: 'Idris Sultan', categoryId: 'watu-maarufu', language: 'mixed' },
  { id: 'wtm-6', text: 'Jokate Mwegelo', categoryId: 'watu-maarufu', language: 'mixed' },
  { id: 'wtm-7', text: 'Ahmed Ally', categoryId: 'watu-maarufu', language: 'mixed' },
  { id: 'wtm-8', text: 'Masoud Kipanya', categoryId: 'watu-maarufu', language: 'mixed' },
  { id: 'wtm-9', text: 'Professor Jay', categoryId: 'watu-maarufu', language: 'mixed' },
  { id: 'wtm-10', text: 'Lady Jaydee', categoryId: 'watu-maarufu', language: 'mixed' },
  { id: 'wtm-11', text: 'Mandonga Mtu Kazi', categoryId: 'watu-maarufu', language: 'mixed' },
  { id: 'wtm-12', text: 'Mbwana Samatta', categoryId: 'watu-maarufu', language: 'mixed' },

  // ── movie-za-bongo ──
  { id: 'mzb-1', text: 'Steven Kanumba', categoryId: 'movie-za-bongo', language: 'mixed' },
  { id: 'mzb-2', text: 'Ray Kigosi', categoryId: 'movie-za-bongo', language: 'mixed' },
  { id: 'mzb-3', text: 'Wema Sepetu', categoryId: 'movie-za-bongo', language: 'mixed' },
  { id: 'mzb-4', text: 'JB', categoryId: 'movie-za-bongo', language: 'mixed' },
  { id: 'mzb-5', text: 'Irene Uwoya', categoryId: 'movie-za-bongo', language: 'mixed' },
  { id: 'mzb-6', text: 'Monalisa', categoryId: 'movie-za-bongo', language: 'mixed' },
  { id: 'mzb-7', text: 'Aunt Ezekiel', categoryId: 'movie-za-bongo', language: 'mixed' },
  { id: 'mzb-8', text: 'Single Mtambalike', categoryId: 'movie-za-bongo', language: 'mixed' },
  { id: 'mzb-9', text: 'Huba', categoryId: 'movie-za-bongo', language: 'mixed', needsReview: true },
  { id: 'mzb-10', text: 'Jua Kali', categoryId: 'movie-za-bongo', language: 'mixed', needsReview: true },
  { id: 'mzb-11', text: 'Ze Comedy', categoryId: 'movie-za-bongo', language: 'mixed', needsReview: true },
  { id: 'mzb-12', text: 'Filamu ya Kibongo', categoryId: 'movie-za-bongo', language: 'sw' },
  { id: 'mzb-13', text: 'Kuigiza Kulia', categoryId: 'movie-za-bongo', language: 'sw' },

  // ── mpira-mashabiki ──
  { id: 'mpr-1', text: 'Simba SC', categoryId: 'mpira-mashabiki', language: 'mixed' },
  { id: 'mpr-2', text: 'Yanga SC', categoryId: 'mpira-mashabiki', language: 'mixed' },
  { id: 'mpr-3', text: 'Kariakoo Derby', categoryId: 'mpira-mashabiki', language: 'sw' },
  { id: 'mpr-4', text: 'Uwanja wa Mkapa', categoryId: 'mpira-mashabiki', language: 'sw' },
  { id: 'mpr-5', text: 'Azam FC', categoryId: 'mpira-mashabiki', language: 'mixed' },
  { id: 'mpr-6', text: 'Taifa Stars', categoryId: 'mpira-mashabiki', language: 'mixed' },
  { id: 'mpr-7', text: 'Jangwani', categoryId: 'mpira-mashabiki', language: 'sw' },
  { id: 'mpr-8', text: 'Vuvuzela', categoryId: 'mpira-mashabiki', language: 'sw' },
  { id: 'mpr-9', text: 'Kadi Nyekundu', categoryId: 'mpira-mashabiki', language: 'sw' },
  { id: 'mpr-10', text: 'Kipa Amedaka', categoryId: 'mpira-mashabiki', language: 'sw' },
  { id: 'mpr-11', text: 'Goli Dakika ya 90', categoryId: 'mpira-mashabiki', language: 'sw' },
  { id: 'mpr-12', text: 'Ndondo Cup', categoryId: 'mpira-mashabiki', language: 'sw' },
  { id: 'mpr-13', text: 'Shabiki Analia', categoryId: 'mpira-mashabiki', language: 'sw' },
  { id: 'mpr-14', text: 'Kubeti', categoryId: 'mpira-mashabiki', language: 'sw' },

  // ── chuo-life ──
  { id: 'chuo-1', text: 'Boom', categoryId: 'chuo-life', language: 'sw' },
  { id: 'chuo-2', text: 'Hosteli', categoryId: 'chuo-life', language: 'sw' },
  { id: 'chuo-3', text: 'Mtihani wa UE', categoryId: 'chuo-life', language: 'sw' },
  { id: 'chuo-4', text: 'Kupiga Msuli', categoryId: 'chuo-life', language: 'sw' },
  { id: 'chuo-5', text: 'Lecture', categoryId: 'chuo-life', language: 'sw' },
  { id: 'chuo-6', text: 'Kanteeni', categoryId: 'chuo-life', language: 'sw' },
  { id: 'chuo-7', text: 'Mahafali', categoryId: 'chuo-life', language: 'sw' },
  { id: 'chuo-8', text: 'Carry Over', categoryId: 'chuo-life', language: 'sw' },
  { id: 'chuo-9', text: 'Sapu', categoryId: 'chuo-life', language: 'sw', needsReview: true },
  { id: 'chuo-10', text: 'Notes za Mtihani', categoryId: 'chuo-life', language: 'sw' },
  { id: 'chuo-11', text: 'Mhadhiri Mkali', categoryId: 'chuo-life', language: 'sw' },
  { id: 'chuo-12', text: 'Kugombea Siti', categoryId: 'chuo-life', language: 'sw' },
  { id: 'chuo-13', text: 'Group Discussion', categoryId: 'chuo-life', language: 'sw' },

  // ── mapenzi-mahusiano ──
  { id: 'mpz-1', text: 'Mahari', categoryId: 'mapenzi-mahusiano', language: 'sw' },
  { id: 'mpz-2', text: 'Send-off', categoryId: 'mapenzi-mahusiano', language: 'mixed' },
  { id: 'mpz-3', text: 'Harusi', categoryId: 'mapenzi-mahusiano', language: 'sw' },
  { id: 'mpz-4', text: 'Posa', categoryId: 'mapenzi-mahusiano', language: 'sw' },
  { id: 'mpz-5', text: 'Shemeji', categoryId: 'mapenzi-mahusiano', language: 'sw' },
  { id: 'mpz-6', text: 'Kuchunwa Buzi', categoryId: 'mapenzi-mahusiano', language: 'sw' },
  { id: 'mpz-7', text: 'Kuvunja Uchumba', categoryId: 'mapenzi-mahusiano', language: 'sw' },
  { id: 'mpz-8', text: 'Kutongoza', categoryId: 'mapenzi-mahusiano', language: 'sw' },
  { id: 'mpz-9', text: 'Wivu', categoryId: 'mapenzi-mahusiano', language: 'sw' },
  { id: 'mpz-10', text: 'Kuomba Namba', categoryId: 'mapenzi-mahusiano', language: 'sw' },
  { id: 'mpz-11', text: 'Siku ya Wapendanao', categoryId: 'mapenzi-mahusiano', language: 'sw' },
  { id: 'mpz-12', text: 'Baby', categoryId: 'mapenzi-mahusiano', language: 'sw' },

  // ── shughuli-za-familia ──
  { id: 'fam-1', text: 'Kitchen Party', categoryId: 'shughuli-za-familia', language: 'mixed' },
  { id: 'fam-2', text: 'Kikao cha Harusi', categoryId: 'shughuli-za-familia', language: 'sw' },
  { id: 'fam-3', text: 'Mkesha wa Mwaka Mpya', categoryId: 'shughuli-za-familia', language: 'sw' },
  { id: 'fam-4', text: 'Kipaimara', categoryId: 'shughuli-za-familia', language: 'sw' },
  { id: 'fam-5', text: 'Kadi ya Mchango', categoryId: 'shughuli-za-familia', language: 'sw' },
  { id: 'fam-6', text: 'Bibi Harusi', categoryId: 'shughuli-za-familia', language: 'sw' },
  { id: 'fam-7', text: 'MC wa Sherehe', categoryId: 'shughuli-za-familia', language: 'sw' },
  { id: 'fam-8', text: 'Sherehe ya Kuzaliwa', categoryId: 'shughuli-za-familia', language: 'sw' },
  { id: 'fam-9', text: 'Shikamoo', categoryId: 'shughuli-za-familia', language: 'sw' },
  { id: 'fam-10', text: 'Shangazi', categoryId: 'shughuli-za-familia', language: 'sw' },
  { id: 'fam-11', text: 'Mjomba', categoryId: 'shughuli-za-familia', language: 'sw' },
  { id: 'fam-12', text: 'Bibi na Babu', categoryId: 'shughuli-za-familia', language: 'sw' },
  { id: 'fam-13', text: 'Masufuria ya Sherehe', categoryId: 'shughuli-za-familia', language: 'sw' },

  // ── east-african-vibes ──
  { id: 'eav-1', text: 'Matatu', categoryId: 'east-african-vibes', language: 'mixed' },
  { id: 'eav-2', text: 'Rolex', categoryId: 'east-african-vibes', language: 'mixed', hint: 'Ugandan street snack' },
  { id: 'eav-3', text: 'Kitenge', categoryId: 'east-african-vibes', language: 'mixed' },
  { id: 'eav-4', text: 'Lake Victoria', categoryId: 'east-african-vibes', language: 'en', concept: 'eav-lake-victoria' },
  { id: 'eav-5', text: 'Ziwa Victoria', categoryId: 'east-african-vibes', language: 'sw', concept: 'eav-lake-victoria' },
  { id: 'eav-6', text: 'Gorilla Trekking', categoryId: 'east-african-vibes', language: 'en', concept: 'eav-gorilla-trekking' },
  { id: 'eav-7', text: 'Kutembelea Sokwe', categoryId: 'east-african-vibes', language: 'sw', concept: 'eav-gorilla-trekking' },
  { id: 'eav-8', text: 'Safari', categoryId: 'east-african-vibes', language: 'mixed' },
  { id: 'eav-9', text: 'Great Migration', categoryId: 'east-african-vibes', language: 'mixed' },
  { id: 'eav-10', text: 'Maasai Jumping Dance', categoryId: 'east-african-vibes', language: 'en', concept: 'eav-maasai-jumping-dance' },
  { id: 'eav-11', text: 'Ngoma ya Kimaasai', categoryId: 'east-african-vibes', language: 'sw', concept: 'eav-maasai-jumping-dance' },
  { id: 'eav-12', text: 'Kanga', categoryId: 'east-african-vibes', language: 'mixed' },
  { id: 'eav-13', text: 'Nyama Choma', categoryId: 'east-african-vibes', language: 'mixed' },
  { id: 'eav-14', text: 'Mombasa', categoryId: 'east-african-vibes', language: 'mixed' },
  { id: 'eav-15', text: 'Zanzibar', categoryId: 'east-african-vibes', language: 'mixed' },
  { id: 'eav-16', text: 'Source of the Nile', categoryId: 'east-african-vibes', language: 'mixed' },

  // ── african-icons ──
  { id: 'aic-1', text: 'Nelson Mandela', categoryId: 'african-icons', language: 'mixed' },
  { id: 'aic-2', text: 'Kwame Nkrumah', categoryId: 'african-icons', language: 'mixed' },
  { id: 'aic-3', text: 'Wangari Maathai', categoryId: 'african-icons', language: 'mixed' },
  { id: 'aic-4', text: 'Kofi Annan', categoryId: 'african-icons', language: 'mixed' },
  { id: 'aic-5', text: 'Miriam Makeba', categoryId: 'african-icons', language: 'mixed' },
  { id: 'aic-6', text: 'Chinua Achebe', categoryId: 'african-icons', language: 'mixed' },
  { id: 'aic-7', text: 'Thomas Sankara', categoryId: 'african-icons', language: 'mixed' },
  { id: 'aic-8', text: 'Haile Selassie', categoryId: 'african-icons', language: 'mixed' },
  { id: 'aic-9', text: 'Fela Kuti', categoryId: 'african-icons', language: 'mixed' },
  { id: 'aic-10', text: 'Patrice Lumumba', categoryId: 'african-icons', language: 'mixed' },
  { id: 'aic-11', text: 'Mohamed Salah', categoryId: 'african-icons', language: 'mixed' },
  { id: 'aic-12', text: 'Didier Drogba', categoryId: 'african-icons', language: 'mixed' },
  { id: 'aic-13', text: "Lupita Nyong'o", categoryId: 'african-icons', language: 'mixed' },
  { id: 'aic-14', text: 'Trevor Noah', categoryId: 'african-icons', language: 'mixed' },

  // ── african-music ──
  { id: 'amu-1', text: 'Afrobeats', categoryId: 'african-music', language: 'mixed' },
  { id: 'amu-2', text: 'Amapiano', categoryId: 'african-music', language: 'mixed' },
  { id: 'amu-3', text: 'Rhumba', categoryId: 'african-music', language: 'mixed' },
  { id: 'amu-4', text: 'Highlife', categoryId: 'african-music', language: 'mixed' },
  { id: 'amu-5', text: 'Raï', categoryId: 'african-music', language: 'mixed' },
  { id: 'amu-6', text: 'Burna Boy', categoryId: 'african-music', language: 'mixed' },
  { id: 'amu-7', text: 'Wizkid', categoryId: 'african-music', language: 'mixed' },
  { id: 'amu-8', text: 'Davido', categoryId: 'african-music', language: 'mixed' },
  { id: 'amu-9', text: 'Tems', categoryId: 'african-music', language: 'mixed' },
  { id: 'amu-10', text: 'Rema', categoryId: 'african-music', language: 'mixed' },
  { id: 'amu-11', text: 'Ayra Starr', categoryId: 'african-music', language: 'mixed' },
  { id: 'amu-12', text: 'Tyla', categoryId: 'african-music', language: 'mixed' },
  { id: 'amu-13', text: 'Yemi Alade', categoryId: 'african-music', language: 'mixed' },
  { id: 'amu-14', text: 'Angélique Kidjo', categoryId: 'african-music', language: 'mixed' },
  { id: 'amu-15', text: "Youssou N'Dour", categoryId: 'african-music', language: 'mixed' },
  { id: 'amu-16', text: 'Sauti Sol', categoryId: 'african-music', language: 'mixed' },
  { id: 'amu-17', text: 'Eddy Kenzo', categoryId: 'african-music', language: 'mixed' },
  { id: 'amu-18', text: 'Fally Ipupa', categoryId: 'african-music', language: 'mixed' },
  { id: 'amu-19', text: 'Koffi Olomide', categoryId: 'african-music', language: 'mixed' },
  { id: 'amu-20', text: 'Amr Diab', categoryId: 'african-music', language: 'mixed' },
  { id: 'amu-21', text: 'Cheb Khaled', categoryId: 'african-music', language: 'mixed' },
  { id: 'amu-22', text: 'Calm Down', categoryId: 'african-music', language: 'mixed', hint: 'Rema' },
  { id: 'amu-23', text: 'Water', categoryId: 'african-music', language: 'mixed', hint: 'Tyla' },
  { id: 'amu-24', text: 'Last Last', categoryId: 'african-music', language: 'mixed', hint: 'Burna Boy' },
  { id: 'amu-25', text: 'Essence', categoryId: 'african-music', language: 'mixed', hint: 'Wizkid ft. Tems' },
  { id: 'amu-26', text: 'Fall', categoryId: 'african-music', language: 'mixed', hint: 'Davido' },
  { id: 'amu-27', text: 'Johnny', categoryId: 'african-music', language: 'mixed', hint: 'Yemi Alade' },
  { id: 'amu-28', text: 'Jerusalema', categoryId: 'african-music', language: 'mixed', hint: 'Master KG' },
  { id: 'amu-29', text: 'Sitya Loss', categoryId: 'african-music', language: 'mixed', hint: 'Eddy Kenzo' },
  { id: 'amu-30', text: 'Sura Yako', categoryId: 'african-music', language: 'mixed', hint: 'Sauti Sol' },
  { id: 'amu-31', text: 'Vulindlela', categoryId: 'african-music', language: 'mixed', hint: 'Brenda Fassie' },
  { id: 'amu-32', text: 'Aïcha', categoryId: 'african-music', language: 'mixed', hint: 'Cheb Khaled' },
  { id: 'amu-33', text: 'Tamally Maak', categoryId: 'african-music', language: 'mixed', hint: 'Amr Diab' },

  // ── african-cities ──
  { id: 'acy-1', text: 'Dar es Salaam', categoryId: 'african-cities', language: 'mixed' },
  { id: 'acy-2', text: 'Nairobi', categoryId: 'african-cities', language: 'mixed' },
  { id: 'acy-3', text: 'Kampala', categoryId: 'african-cities', language: 'mixed' },
  { id: 'acy-4', text: 'Kigali', categoryId: 'african-cities', language: 'mixed' },
  { id: 'acy-5', text: 'Johannesburg', categoryId: 'african-cities', language: 'mixed' },
  { id: 'acy-6', text: 'Cape Town', categoryId: 'african-cities', language: 'mixed' },
  { id: 'acy-7', text: 'Lagos', categoryId: 'african-cities', language: 'mixed' },
  { id: 'acy-8', text: 'Cairo', categoryId: 'african-cities', language: 'mixed' },
  { id: 'acy-9', text: 'Accra', categoryId: 'african-cities', language: 'mixed' },
  { id: 'acy-10', text: 'Addis Ababa', categoryId: 'african-cities', language: 'mixed' },
  { id: 'acy-11', text: 'Kinshasa', categoryId: 'african-cities', language: 'mixed' },
  { id: 'acy-12', text: 'Marrakech', categoryId: 'african-cities', language: 'mixed' },
  { id: 'acy-13', text: 'Dakar', categoryId: 'african-cities', language: 'mixed' },

  // ── pop-culture ──
  { id: 'pop-1', text: 'TikTok Dance Challenge', categoryId: 'pop-culture', language: 'mixed' },
  { id: 'pop-2', text: 'Viral Meme', categoryId: 'pop-culture', language: 'en' },
  { id: 'pop-3', text: 'Red Carpet', categoryId: 'pop-culture', language: 'en' },
  { id: 'pop-4', text: 'Trending on X', categoryId: 'pop-culture', language: 'mixed' },
  { id: 'pop-5', text: 'YouTuber', categoryId: 'pop-culture', language: 'mixed' },
  { id: 'pop-6', text: 'Podcast', categoryId: 'pop-culture', language: 'mixed' },
  { id: 'pop-7', text: 'Celebrity Breakup', categoryId: 'pop-culture', language: 'en' },
  { id: 'pop-8', text: 'Paparazzi', categoryId: 'pop-culture', language: 'mixed' },
  { id: 'pop-9', text: 'Live Stream', categoryId: 'pop-culture', language: 'en' },
  { id: 'pop-10', text: 'Jerusalema Dance Challenge', categoryId: 'pop-culture', language: 'mixed' },
  { id: 'pop-11', text: 'Wakanda Forever Salute', categoryId: 'pop-culture', language: 'mixed' },
  { id: 'pop-12', text: 'Big Brother Naija', categoryId: 'pop-culture', language: 'mixed' },
  { id: 'pop-13', text: 'Influencer', categoryId: 'pop-culture', language: 'mixed' },
  { id: 'pop-14', text: 'Binge-watching', categoryId: 'pop-culture', language: 'en' },

  // ── throwback-hits ──
  { id: 'tbk-1', text: 'Malaika', categoryId: 'throwback-hits', language: 'mixed', hint: 'Fadhili William' },
  { id: 'tbk-2', text: 'Jambo Bwana', categoryId: 'throwback-hits', language: 'mixed', hint: 'Them Mushrooms' },
  { id: 'tbk-3', text: 'Pata Pata', categoryId: 'throwback-hits', language: 'mixed', hint: 'Miriam Makeba' },
  { id: 'tbk-4', text: 'Sweet Mother', categoryId: 'throwback-hits', language: 'mixed', hint: 'Prince Nico Mbarga' },
  { id: 'tbk-5', text: 'Yéké Yéké', categoryId: 'throwback-hits', language: 'mixed', hint: 'Mory Kanté' },
  { id: 'tbk-6', text: 'Wale Watu', categoryId: 'throwback-hits', language: 'mixed', hint: 'Khadja Nin' },
  { id: 'tbk-7', text: 'Shauri Yako', categoryId: 'throwback-hits', language: 'mixed', hint: 'Super Mazembe' },
  { id: 'tbk-8', text: 'African Queen', categoryId: 'throwback-hits', language: 'mixed', hint: '2Face Idibia' },
  { id: 'tbk-9', text: 'Waka Waka', categoryId: 'throwback-hits', language: 'mixed', hint: 'Shakira' },
  { id: 'tbk-10', text: 'Thriller', categoryId: 'throwback-hits', language: 'mixed', hint: 'Michael Jackson' },
  { id: 'tbk-11', text: 'Billie Jean', categoryId: 'throwback-hits', language: 'mixed', hint: 'Michael Jackson' },
  { id: 'tbk-12', text: 'Macarena', categoryId: 'throwback-hits', language: 'mixed' },
  { id: 'tbk-13', text: 'Gangnam Style', categoryId: 'throwback-hits', language: 'mixed', hint: 'PSY' },
  { id: 'tbk-14', text: 'One Love', categoryId: 'throwback-hits', language: 'mixed', hint: 'Bob Marley' },
]

/** Language preference order used when a concept has more than one version */
const PREFERENCE: Record<'en' | 'sw', PromptLanguage[]> = {
  en: ['en', 'mixed', 'sw'],
  sw: ['sw', 'mixed', 'en'],
}

/**
 * Choose ONE version of each concept for the selected prompt language.
 *
 *  - English:   English version if it exists, otherwise the any-language or Kiswahili one.
 *  - Kiswahili: Kiswahili version if it exists, otherwise any-language or English.
 *  - Mixed:     where both translations exist, pick one at random (seeded), so a game
 *               mixes both languages without ever showing "Lion" AND "Simba".
 *
 * Prompts without a translation are always kept — e.g. Tanzanian categories stay in
 * Kiswahili even in English mode, because that is their identity.
 */
export function selectPromptVariants(
  prompts: readonly GamePrompt[],
  language: PromptLanguage,
  seed = 1,
): GamePrompt[] {
  const groups = new Map<string, GamePrompt[]>()
  for (const p of prompts) {
    const key = p.concept ?? `id:${p.id}`
    const list = groups.get(key)
    if (list) list.push(p)
    else groups.set(key, [p])
  }

  const result: GamePrompt[] = []
  let s = seed
  for (const variants of groups.values()) {
    if (variants.length === 1) {
      result.push(variants[0])
      continue
    }
    if (language === 'mixed') {
      const [r, next] = nextRandom(s)
      s = next
      result.push(variants[Math.floor(r * variants.length)])
      continue
    }
    const order = PREFERENCE[language]
    const best = [...variants].sort(
      (a, b) => order.indexOf(a.language) - order.indexOf(b.language),
    )[0]
    result.push(best)
  }
  return result
}

/**
 * Prompts for the categories chosen on Game Setup, one version per concept.
 *
 * - Only prompts from the selected categories are used (all categories in "Feeling lucky").
 * - We never borrow prompts from categories the players did not choose.
 * - Returns an empty array if nothing matches; the app then shows a friendly message.
 */
export function getFilteredPrompts(
  categoryIds: CategoryIconId[],
  isFeelingLucky: boolean,
  language: PromptLanguage,
  seed = 1,
): GamePrompt[] {
  const playable = PROMPTS.filter((p) => typeof p.text === 'string' && p.text.trim().length > 0)

  let categoryPool = playable
  if (!isFeelingLucky) {
    if (categoryIds.length === 0) return []
    const idSet = new Set(categoryIds)
    categoryPool = playable.filter((p) => idSet.has(p.categoryId))
  }

  return selectPromptVariants(categoryPool, language, seed)
}
