# Génère conditions.html et politique-confidentialite.html à partir du texte source,
# en appliquant uniquement les valeurs fournies (docs/source/valeurs-renseignees.json).
# Les champs restants restent visibles et surlignés. Usage : python3 tools/build-legal-pages.py
import html, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'docs/source/KiffStation_conditions_utilisation_et_confidentialite.txt'
MAP = json.loads((ROOT / 'docs/source/valeurs-renseignees.json').read_text(encoding='utf-8'))
src = SRC.read_text(encoding='utf-8').splitlines()
PH = re.compile(r'(\[[^\]]+\])')
POLICY_LINE = MAP['bloc_politique_retours']['ligne']

def substitute(n, text):
    for old, new in MAP['remplacements'].get(str(n), []):
        assert old in text, f'ligne {n} : "{old}" absent — vérifier le mapping'
        text = text.replace(old, new, 1)
    return text

def inline(s):
    return PH.sub(lambda m: f'<mark class="todo">{html.escape(m.group(1))}</mark>', html.escape(s))

def body(items):
    out, in_ul = [], False
    for n, raw in items:
        if raw.strip() == '':
            if in_ul: out.append('</ul>'); in_ul = False
            continue
        if n == POLICY_LINE:
            if in_ul: out.append('</ul>'); in_ul = False
            b = MAP['bloc_politique_retours']
            out.append('<div class="policy-block">')
            out.append(f'<p class="policy-title">{html.escape(b["titre"])}</p>')
            out += [f'<p>{html.escape(p)}</p>' for p in b['paragraphes']]
            out.append('</div>')
            continue
        t = substitute(n, raw)
        if t.startswith('- '):
            if not in_ul: out.append('<ul>'); in_ul = True
            out.append(f'<li>{inline(t[2:])}</li>'); continue
        if in_ul: out.append('</ul>'); in_ul = False
        if re.match(r'^\d+\. [^a-z]+$', t) and any(c.isalpha() for c in t):
            out.append(f'<h2>{inline(t)}</h2>')
        else:
            out.append(f'<p>{inline(t)}</p>')
        if str(n) in MAP.get('blocs_apres', {}):
            if in_ul: out.append('</ul>'); in_ul = False
            b = MAP['blocs_apres'][str(n)]
            out.append('<div class="policy-block">')
            out.append(f'<p class="policy-title">{html.escape(b["titre"])}</p>')
            out += [f'<p>{html.escape(x)}</p>' for x in b['paragraphes']]
            out.append('</div>')
    if in_ul: out.append('</ul>')
    return '\n'.join(out)

i1 = next(i for i, l in enumerate(src) if l.startswith('PARTIE I —'))
i2 = next(i for i, l in enumerate(src) if l.startswith('PARTIE II —'))
part1 = [(i + 1, src[i]) for i in range(i1 + 2, i2 - 1)]
part2 = [(i + 1, src[i]) for i in range(i2 + 2, len(src))]

head = (
  '<div class="legal-head">'
  f'<p class="legal-brand">{html.escape(src[0])}</p>'
  f'<p class="legal-title">{html.escape(src[1])}<br>{html.escape(src[2])}</p>'
  f'<p class="legal-status">{inline(src[4])}<br>{inline(src[5])}<br>{inline(src[6])}</p>'
  f'<div class="legal-warning"><strong>{html.escape(src[8])}</strong><br>{inline(src[9])}</div>'
  '</div>')

PAGE = '''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#03050a">
<link rel="stylesheet" href="./style.css">
<link rel="stylesheet" href="./legal.css">
<title>{title}</title>
</head>
<body>
<header class="top-bar" role="banner">
  <div class="bar-left"><span class="app-name">KiffTech.store</span></div>
  <div class="bar-right"><a href="./index.html" class="icon-btn" aria-label="Retour au catalogue">&larr;</a></div>
</header>
<main class="legal-page">
{head}
<p class="legal-nav"><a href="./{other_file}">{other_label}</a></p>
<h1>{part_title}</h1>
{content}
</main>
</body>
</html>
'''

def make(fname, title, items, other_file, other_label, part_title):
    Path(ROOT / fname).write_text(PAGE.format(title=html.escape(title), head=head, other_file=other_file,
        other_label=html.escape(other_label), part_title=html.escape(part_title), content=body(items)), encoding='utf-8')

make('conditions.html', 'KiffTech.store — Conditions d’utilisation et de vente', part1,
     'politique-confidentialite.html', 'Politique de confidentialité', 'Partie I — Conditions d’utilisation et de vente')
make('politique-confidentialite.html', 'KiffTech.store — Politique de confidentialité', part2,
     'conditions.html', 'Conditions d’utilisation et de vente', 'Partie II — Politique de confidentialité')

# Vérification : chaque ligne source (après valeurs fournies) doit figurer dans le texte visible.
def norm(x): return re.sub(r'\s+', ' ', x).strip()
def visible(fname):
    t = (ROOT / fname).read_text(encoding='utf-8')
    t = re.sub(r'<(br|/p|/h1|/h2|/li|/div)[^>]*>', '\n', t)
    t = re.sub(r'<[^>]+>', '', t)
    return [norm(x) for x in html.unescape(t).split('\n') if norm(x)]
vis = visible('conditions.html') + visible('politique-confidentialite.html')
expected = []
for n, raw in part1 + part2:
    if not norm(raw) or set(norm(raw)) <= set('='): continue
    if n == POLICY_LINE: continue
    t = substitute(n, raw)
    expected.append(norm(t[2:] if t.startswith('- ') else t))
missing = [e for e in expected if e not in vis and not e.startswith(('PARTIE', 'Politique'))]
assert not missing, missing[:3]
# Champs restants (liste pour CHAMPS-A-COMPLETER.md)
rows, current = [], ''
i2n = i2 + 1
for n, l in enumerate(src, start=1):
    m = re.match(r'^(\d+)\. ([^a-z]+)$', l)
    if m and any(c.isalpha() for c in l): current = l
    t = substitute(n, l)
    for ph in re.findall(r'\[[^\]]+\]', t):
        rows.append(('Partie I' if n < i2n else 'Partie II', current or '—', n, ph))
lines = ['# Champs restants avant activation des commandes', '',
         'Source : `docs/source/KiffStation_conditions_utilisation_et_confidentialite.txt`. Les valeurs déjà renseignées sont listées dans `docs/source/valeurs-renseignees.json`. Les champs ci-dessous restent surlignés dans les pages et ne doivent pas être inventés.', '',
         '| Partie | Section | Ligne source | Champ |', '|---|---|---|---|']
lines += [f'| {p} | {s} | {n} | {ph} |' for p, s, n, ph in rows]
lines += ['', f'Total restant : {len(rows)} occurrences (dont l’en-tête de date, présent dans les deux pages).', '',
          '## Après complétion', '1. Compléter les champs (valeurs fournies par le responsable, pas inventées), puis relancer `python3 tools/build-legal-pages.py`.',
          '2. Faire valider le texte juridiquement.',
          '3. Mettre `termsValidated: true` dans `data/legal.js` uniquement après validation.',
          '4. `npm run sync:supabase`, commit, push, relancer le workflow de déploiement, puis vérifier `legalReady: true`.']
(ROOT / 'docs/CHAMPS-A-COMPLETER.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')
print(f'pages générées ; lignes vérifiées : {len(expected)} ; champs restants : {len(rows)}')
