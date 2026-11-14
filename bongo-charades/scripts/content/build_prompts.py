#!/usr/bin/env python3
# Bongo Charades — prompt bank builder (Phase 5).
#
# The SOURCE of the prompt bank is now the curated lists:
#     docs/content/research/curation/<group>/<category>.txt   (29 files)
# Edit those, then run from the project folder:
#     python3 scripts/content/check_candidates.py <group>   # optional: checks + reports
#     python3 scripts/content/build_prompts.py              # rewrites the PROMPTS array
#     npm test                                              # validates the bank
#
# It rewrites src/data/promptBank.ts (generated, one array per category; do not edit by hand).
#
# Line format in the lists:   text ; hint ; key=value key=value ... note=free text
#   "English | Kiswahili" in the text column makes a translation pair (two prompts, one concept).
#   A line starting with @ sets defaults for the lines below it. # starts a comment.
# Shipped fields: id, text, categoryId, language, concept, hint, difficulty, kind, shelf, era,
#   longTitle, needsReview. Sources, confidence and notes stay in the research files (not shipped).
# needsReview is true for every prompt marked conf=V ("Needs local verification").
import glob, json, os, re, unicodedata

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
CURATION = os.path.join(ROOT, 'docs', 'content', 'research', 'curation')
TARGET = os.path.join(ROOT, 'src', 'data', 'promptBank.ts')

# Category order in the generated file (same as the game's category list).
ORDER = ['animals', 'movies-tv', 'music-artists', 'sports', 'countries', 'famous-landmarks',
         'car-brands', 'famous-brands', 'everyday-things', 'act-it-out', 'food-drinks',
         'hii-dar-yetu', 'daladala-diaries', 'bongo-flava', 'mtaani', 'zilipendwa',
         'chakula-chetu', 'watu-maarufu', 'movie-za-bongo', 'mpira-mashabiki', 'chuo-life',
         'mapenzi-mahusiano', 'shughuli-za-familia',
         'east-african-vibes', 'african-icons', 'african-music', 'african-cities',
         'pop-culture', 'throwback-hits']
ABBR = {'animals': 'anim', 'movies-tv': 'mov', 'music-artists': 'mus', 'sports': 'spt',
        'countries': 'cty', 'famous-landmarks': 'lmk', 'car-brands': 'car', 'famous-brands': 'brd',
        'everyday-things': 'evd', 'act-it-out': 'act', 'food-drinks': 'food',
        'hii-dar-yetu': 'dar', 'daladala-diaries': 'dld', 'bongo-flava': 'bf', 'mtaani': 'mta',
        'zilipendwa': 'zil', 'chakula-chetu': 'chk', 'watu-maarufu': 'wtm',
        'movie-za-bongo': 'mzb', 'mpira-mashabiki': 'mpr', 'chuo-life': 'chuo',
        'mapenzi-mahusiano': 'mpz', 'shughuli-za-familia': 'fam',
        'east-african-vibes': 'eav', 'african-icons': 'aic', 'african-music': 'amu',
        'african-cities': 'acy', 'pop-culture': 'pop', 'throwback-hits': 'tbk'}


def slug(t):
    t = unicodedata.normalize('NFKD', t).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', t).strip('-')


def kv(s):
    out = {}
    s = s.strip()
    if 'note=' in s:
        s, note = s.split('note=', 1)
        out['note'] = note.strip()
    for tok in s.split():
        k, _, v = tok.partition('=')
        out[k] = v
    return out


def load(path):
    items, defaults = [], {}
    for line in open(path, encoding='utf-8'):
        line = line.rstrip('\n')
        if not line.strip() or line.startswith('#'):
            continue
        if line.startswith('@'):
            defaults = kv(line[1:])
            continue
        parts = [p.strip() for p in re.split(r'\s*;\s*', line, maxsplit=2)]
        it = dict(defaults)
        it.pop('note', None)
        it['text'] = parts[0]
        if ' | ' in parts[0]:
            it['text'], it['sw'] = [x.strip() for x in parts[0].split(' | ', 1)]
        it['hint'] = parts[1] if len(parts) > 1 else ''
        if len(parts) > 2:
            it.update(kv(parts[2]))
        items.append(it)
    return items


files = {os.path.basename(p)[:-4]: p for p in glob.glob(os.path.join(CURATION, '*', '*.txt'))}
missing = [c for c in ORDER if c not in files]
if missing:
    raise SystemExit(f'Missing curated lists: {missing}')

rows = []
for cat in ORDER:
    a = ABBR[cat]
    used = set()

    def make_id(base, hint):
        i = base
        if i in used and hint:
            i = f'{base}-{slug(hint)}'
        n = 2
        while i in used:
            i = f'{base}-{n}'
            n += 1
        used.add(i)
        return i

    for it in load(files[cat]):
        common = {}
        if it['hint']:
            common['hint'] = it['hint']
        for k_in, k_out in (('diff', 'difficulty'), ('kind', 'kind'), ('shelf', 'shelf'), ('era', 'era')):
            if it.get(k_in):
                common[k_out] = it[k_in]
        if it.get('famous') == 'yes':
            common['longTitle'] = True
        if it.get('conf') == 'V':
            common['needsReview'] = True
        if it.get('sw'):
            concept = f'{a}-{slug(it["text"])}'
            for lang, text in (('en', it['text']), ('sw', it['sw'])):
                rows.append(dict(id=make_id(f'{concept}-{lang}', it['hint']), text=text,
                                 categoryId=cat, language=lang, concept=concept, **common))
        else:
            rows.append(dict(id=make_id(f'{a}-{slug(it["text"])}', it['hint']), text=it['text'],
                             categoryId=cat, language=it.get('lang', 'mixed'), **common))


def lit(v):
    if isinstance(v, bool):
        return 'true' if v else 'false'
    s = json.dumps(v, ensure_ascii=False)
    return "'" + s[1:-1].replace('\\"', '"').replace("'", "\\'") + "'"


FIELDS = ['id', 'text', 'categoryId', 'language', 'concept', 'hint', 'difficulty', 'kind',
          'shelf', 'era', 'longTitle', 'needsReview']
def const_name(cat):
    return 'C_' + cat.upper().replace('-', '_')


out = ['// GENERATED by scripts/content/build_prompts.py from docs/content/research/curation/*/*.txt',
       '// Do not edit by hand: edit the curated lists and re-run the script.',
       '// One array per category keeps the TypeScript checker fast on a bank of this size.',
       "import type { GamePrompt } from '../types'", '']
for cat in ORDER:
    out.append(f'const {const_name(cat)}: GamePrompt[] = [')
    for r in rows:
        if r['categoryId'] == cat:
            out.append('  { ' + ', '.join(f'{k}: {lit(r[k])}' for k in FIELDS if k in r) + ' },')
    out.append(']')
    out.append('')
out.append('export const PROMPT_BANK: GamePrompt[] = [')
out += [f'  ...{const_name(c)},' for c in ORDER]
out.append(']')
open(TARGET, 'w', encoding='utf-8').write('\n'.join(out) + '\n')
ideas = len({r.get('concept') or r['id'] for r in rows})
print(f'Wrote {len(rows)} prompts ({ideas} ideas) across {len(ORDER)} categories to src/data/promptBank.ts')
