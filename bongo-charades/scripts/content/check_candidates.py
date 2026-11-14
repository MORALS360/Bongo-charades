#!/usr/bin/env python3
# Bongo Charades — Phase 5 curation checker (Stage 4).
#
# Reads the candidate prompt lists in docs/content/research/curation/<group>/*.txt,
# checks them, and writes two reports next to them. It does NOT change the game:
# src/data/prompts.ts is only read.
#
#     python3 scripts/content/check_candidates.py bongo
#
# Candidate line format:   text ; hint ; key=value key=value ... note=free text to end of line
# A line starting with @ sets defaults for the lines below it. # starts a comment.
import os, re, sys, glob, unicodedata, collections

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
GROUP = sys.argv[1] if len(sys.argv) > 1 else 'bongo'
CDIR = os.path.join(ROOT, 'docs', 'content', 'research', 'curation', GROUP)
KEYS = {'lang', 'kind', 'diff', 'shelf', 'conf', 'src', 'era', 'moved', 'note', 'region', 'sw', 'famous'}
ALLOWED = {
    'lang': {'sw', 'en', 'mixed'},
    'kind': {'person', 'song', 'place', 'thing', 'action', 'phrase', 'title', 'brand', 'food'},
    'diff': {'easy', 'medium', 'hard'},
    'shelf': {'evergreen', 'trending', 'nostalgia'},
    'conf': {'H', 'M', 'V'},
}
CONF = {'H': 'High', 'M': 'Medium', 'V': 'Needs local verification'}

def norm(t):
    t = unicodedata.normalize('NFKD', t).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', ' ', t).strip()

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
    items, errors, defaults = [], [], {}
    for n, line in enumerate(open(path, encoding='utf-8'), 1):
        line = line.rstrip('\n')
        if not line.strip() or line.startswith('#'):
            continue
        if line.startswith('@'):
            defaults = kv(line[1:])
            continue
        parts = [p.strip() for p in re.split(r'\s*;\s*', line, maxsplit=2)]
        it = dict(defaults)
        it['text'] = parts[0]
        if ' | ' in parts[0]:
            it['text'], it['sw'] = [x.strip() for x in parts[0].split(' | ', 1)]
        it['hint'] = parts[1] if len(parts) > 1 else ''
        if len(parts) > 2:
            it.update(kv(parts[2]))
        it['line'] = n
        for k in it:
            if k not in KEYS | {'text', 'hint', 'line'}:
                errors.append(f'line {n}: unknown key "{k}"')
        for k, allowed in ALLOWED.items():
            if it.get(k) not in allowed:
                errors.append(f'line {n}: {k}="{it.get(k)}" is not one of {sorted(allowed)}')
        if not it.get('src'):
            errors.append(f'line {n}: no source')
        items.append(it)
    return items, errors

# The current game bank (read only).
bank = collections.defaultdict(list)
src = open(os.path.join(ROOT, 'src', 'data', 'prompts.ts'), encoding='utf-8').read()
for m in re.finditer(r"text: (['\"])(.*?)\1, categoryId: (['\"])(.*?)\3", src):
    bank[m.group(4)].append(m.group(2))
bank_hint = {}
for m in re.finditer(r"text: (['\"])(.*?)\1, categoryId: (['\"])(.*?)\3,[^}]*?hint: (['\"])(.*?)\5", src):
    bank_hint[(m.group(4), norm(m.group(2)))] = m.group(6)
bank_by_text = {norm(t): c for c, ts in bank.items() for t in ts}

cats = {}
problems = []
moves = []
shared = []
longs = []
for path in sorted(glob.glob(os.path.join(CDIR, '*.txt'))):
    cat = os.path.basename(path)[:-4]
    items, errors = load(path)
    cats[cat] = items
    problems += [f'{cat}: {e}' for e in errors]

others = {}
for path in glob.glob(os.path.join(CDIR, '..', '*', '*.txt')):
    g = os.path.basename(os.path.dirname(path))
    if g != GROUP:
        for i in load(path)[0]:
            for t in [i['text']] + ([i['sw']] if i.get('sw') else []):
                others[norm(t)] = (os.path.basename(path)[:-4], t, i['hint'])
where_now = {norm(t): c for c, items in cats.items() for i in items for t in [i['text']] + ([i['sw']] if i.get('sw') else [])}
seen = {}
for cat, items in cats.items():
    for it in items:
      for label in [it['text']] + ([it['sw']] if it.get('sw') else []):
          key = norm(label)
          words = len(label.split())
          # Owner rule (2026-11-14): a really famous title may have up to 6 words if marked famous=yes.
          limit = 6 if it.get('famous') == 'yes' else 4
          if words > limit:
              problems.append(f'{cat}: "{label}" has {words} words (limit {limit})')
          elif words > 4:
              longs.append(f'"{label}" ({cat}, {words} words)')
          # Owner rule (2026-11-14): a song may share its text with another prompt when the artist hint tells them apart.
          # Extended in Stage 4C: any two prompts may share text when their hint lines differ.
          is_song = it['kind'] == 'song' and it['hint']
          if key in seen:
              pcat, ptext, phint = seen[key]
              if (is_song or phint or it['hint']) and it['hint'] != phint:
                  shared.append(f'"{label}" ({it["hint"] or "no hint"}) in {cat} and ({phint or "no hint"}) in {pcat}')
              else:
                  problems.append(f'{cat}: "{label}" duplicates "{ptext}" in {pcat}')
          seen[key] = (cat, label, it['hint'])
          if key in others:
              ocat, otext, ohint = others[key]
              if (is_song or ohint or it['hint']) and it['hint'] != ohint:
                  shared.append(f'"{label}" ({it["hint"] or "no hint"}) in {cat} and ({ohint or "no hint"}) in {ocat}')
              else:
                  problems.append(f'{cat}: "{label}" duplicates "{otext}" in {ocat} (another group)')
          other = bank_by_text.get(key)
          if other and other != cat and it.get('moved') != other and other not in cats:
              if is_song or it['hint'] or bank_hint.get((other, key)):
                  shared.append(f'"{label}" ({it["hint"] or "no hint"}) in {cat} and the existing prompt in {other} ({bank_hint.get((other, key)) or "no hint"})')
              else:
                  problems.append(f'{cat}: "{label}" is already in the game under {other}')
      it['existing'] = norm(it['text']) in {norm(t) for t in bank.get(cat, [])} and not (it['kind']=='song' and it['hint'] and bank_hint.get((cat, norm(it['text'])), it['hint']) != it['hint'])
    have = {norm(i['text']) for i in items} | {norm(i['sw']) for i in items if i.get('sw')}
    for t in bank.get(cat, []):
        if norm(t) not in have:
            moved_to = (where_now.get(norm(t)) or (others.get(norm(t)) or [None])[0])
            if moved_to:
                moves.append(f'"{t}": {cat} → {moved_to}')
                continue
            where = ' (DROPPED)'
            problems.append(f'{cat}: existing prompt "{t}" is not in the candidate list{where}')

def count(items, key):
    return collections.Counter(i.get(key) for i in items)

# ── Report 1: summary and full lists ──
out = [f'# Phase 5, Stage 4 — Candidate prompts: {GROUP} group', '',
       'Generated by `scripts/content/check_candidates.py`. Edit the `.txt` lists, not this file.',
       '**These are candidates. Nothing here has been added to the game.**', '',
       '## Counts', '',
       '| Category | Candidates | In game today | New | High | Medium | Needs your check | Easy / Medium / Hard |',
       '|---|---|---|---|---|---|---|---|']
total = collections.Counter()
for cat, items in cats.items():
    c, d = count(items, 'conf'), count(items, 'diff')
    ex = sum(1 for i in items if i['existing'])
    out.append(f'| {cat} | **{len(items)}** | {ex} | {len(items)-ex} | {c["H"]} | {c["M"]} | {c["V"]} | {d["easy"]} / {d["medium"]} / {d["hard"]} |')
    total.update(n=len(items), ex=ex, H=c['H'], M=c['M'], V=c['V'])
out.append(f'| **Total** | **{total["n"]}** | {total["ex"]} | {total["n"]-total["ex"]} | {total["H"]} | {total["M"]} | {total["V"]} | |')
for cat, items in cats.items():
    r = collections.Counter(i.get('region') for i in items if i.get('region'))
    if r:
        n = sum(r.values())
        out += ['', f'**Regional shares, {cat}:** ' + ' · '.join(f'{k} {v} ({round(100*v/n)}%)' for k, v in sorted(r.items()))]
out += ['', '## Automatic checks', '']
out += [f'- {p}' for p in problems] or ['- No problems found: no duplicates, no clash with other categories in the game, nothing over 4 words.']
out += ['', '## Famous titles over 4 words (owner exception)', ''] + ([f'- {x}' for x in longs] or ['- None.'])
out += ['', '## Shared titles (told apart by the artist line)', ''] + ([f'- {x}' for x in shared] or ['- None.'])
out += ['', '## Existing prompts that change category', ''] + ([f'- {m}' for m in moves] or ['- None.'])
for cat, items in cats.items():
    out += ['', f'## {cat} ({len(items)})', '', '| Prompt | Hint | Kind | Difficulty | Shelf | Confidence | Sources | Status |', '|---|---|---|---|---|---|---|---|']
    for i in items:
        status = 'in game' if i['existing'] else (f'moved from {i["moved"]}' if i.get('moved') else 'new')
        out.append(f'| {i["text"]}{(" / " + i["sw"]) if i.get("sw") else ""} | {i["hint"]} | {i["kind"]} | {i["diff"]} | {i["shelf"]} | {CONF[i["conf"]]} | {i["src"]} | {status} |')
open(os.path.join(CDIR, '..', f'{GROUP.upper()}_GROUP_CURATION.md'), 'w', encoding='utf-8').write('\n'.join(out) + '\n')

# ── Report 2: the owner's tick-lists ──
out = [f'# Phase 5, Stage 4 — Owner review tick-lists: {GROUP} group', '',
       'Only the prompts I could **not** confirm are listed here. For each one, tick one box:',
       '', '- **Keep** — people know it and would say it this way.',
       '- **Fix** — right idea, wrong wording or spelling (write the correction).',
       '- **Drop** — unknown, old-fashioned, or not suitable.', '']
for cat, items in cats.items():
    v = [i for i in items if i['conf'] == 'V']
    if not v:
        continue
    out += [f'## {cat} ({len(v)} to check)', '', '| Prompt | Hint | My question | Keep | Fix | Drop |', '|---|---|---|---|---|---|']
    out += [f'| {i["text"]} | {i["hint"]} | {i.get("note","")} | ☐ | ☐ | ☐ |' for i in v]
    out.append('')
open(os.path.join(CDIR, '..', f'{GROUP.upper()}_OWNER_REVIEW.md'), 'w', encoding='utf-8').write('\n'.join(out) + '\n')

print(f'{total["n"]} candidates in {len(cats)} categories; {total["V"]} need owner check; {len(problems)} problems')
for p in problems + moves + shared:
    print(' -', p)
