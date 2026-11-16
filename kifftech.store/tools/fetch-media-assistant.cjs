#!/usr/bin/env node
/**
 * Assistant "agent" recherche + téléchargement + squelette média pour Kifftech.store (keffstation).
 *
 * Fonctionne produit par produit (rayon/marque/modèle/année du catalogue), recherche des images,
 * tente le téléchargement dans img/, puis génère tools/media-suggestions.json (squelette medias.images[]).
 *
 * Providers de recherche:
 * - google : Google Custom Search JSON API (recommandé, fiable) si GOOGLE_API_KEY et GOOGLE_CSE_ID sont définis.
 *            Sinon, tentative best-effort via page de résultats Google Images (peut être bloquée/captcha/HTML variable).
 * - commons: Wikimedia Commons API (sources/licences ouvertes, métadonnées riches).
 * - auto   : google si credentials CSE présents, sinon commons.
 *
 * Usage:
 *   node tools/fetch-media-assistant.cjs [--provider auto|google|commons] [--per 3] [--max 60] [--rayon <rayon>] [--id <id>] [--dry-run]
 *
 * Variables d'environnement (Google CSE, optionnel mais recommandé pour "recherche google"):
 *   GOOGLE_API_KEY=...   GOOGLE_CSE_ID=...
 *
 * Mots-clés: "(marque modèle [année]) + images libres de droits" (+ variantes).
 * Vérifiez toujours manuellement la licence, l'attribution et la pertinence avant intégration.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
const CATALOGUE_PATH = path.join(ROOT, 'data', 'catalogue.js');
const IMG_DIR = path.join(ROOT, 'img');
const OUT_PATH = path.join(ROOT, 'tools', 'media-suggestions.json');

function parseArgs(argv) {
  const args = { per: 3, max: Infinity, rayon: null, id: null, dryRun: false, provider: 'auto' };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--per') args.per = Math.max(1, Math.min(5, parseInt(argv[++i] || '3', 10)));
    else if (a === '--max') args.max = parseInt(argv[++i] || '0', 10) || Infinity;
    else if (a === '--rayon') args.rayon = argv[++i] || null;
    else if (a === '--id') args.id = argv[++i] || null;
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--provider') args.provider = (argv[++i] || 'auto').toLowerCase();
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function usage() {
  console.log(`Usage: node tools/fetch-media-assistant.cjs [options]
  --provider auto|google|commons  (défaut: auto)
  --per 1..5                      images par produit (défaut: 3)
  --max N                         limiter le nombre de produits
  --rayon <rayon>                 filtrer par rayon du catalogue
  --id <id-produit>               traiter un produit
  --dry-run                       recherche/squelette sans téléchargement
  --help

Env (Google CSE): GOOGLE_API_KEY, GOOGLE_CSE_ID`);
}

function loadCatalogue() {
  let s = fs.readFileSync(CATALOGUE_PATH, 'utf8');
  const prefix = 'export const CATALOGUE = ';
  const start = s.indexOf(prefix);
  if (start === -1) throw new Error('Préfixe CATALOGUE introuvable');
  let body = s.slice(start + prefix.length);
  // couper avant un éventuel autre export (ex. export const ...) pour ne garder que l'objet principal
  const nextExport = body.search(/\nexport\s+/);
  if (nextExport !== -1) body = body.slice(0, nextExport);
  body = body.replace(/;\s*$/, '');
  try { return Function('return (' + body + ')')(); } catch (e) {
    throw new Error('Impossible de parser data/catalogue.js: ' + e.message);
  }
}

function slugify(str) {
  return String(str || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

async function fetchText(url, headers = {}) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36', 'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8', ...headers } });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return await res.text();
}

async function fetchJson(url, headers = {}) {
  const res = await fetch(url, { headers: { 'User-Agent': 'KifftechMediaAgent/1.0', 'Accept': 'application/json', ...headers } });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return await res.json();
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https:') ? https : http;
    const file = fs.createWriteStream(dest);
    const get = (u, redirects = 0) => {
      if (redirects > 5) { file.close(); fs.unlink(dest, () => {}); return reject(new Error('Trop de redirections')); }
      proto.get(u, { headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const loc = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, u).toString();
          file.close(); fs.unlink(dest, () => {}); return get(loc, redirects + 1);
        }
        if (res.statusCode !== 200) { file.close(); fs.unlink(dest, () => {}); return reject(new Error('HTTP ' + res.statusCode)); }
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      }).on('error', (err) => { file.close(); fs.unlink(dest, () => {}); reject(err); });
    };
    get(url);
  });
}

function extFrom(url, mime) {
  const m = (url || '').match(/\.(jpg|jpeg|png|webp)(?:[?#]|$)/i);
  if (m) return '.' + m[1].toLowerCase().replace('jpeg', 'jpg');
  if (/png/i.test(mime || '')) return '.png';
  if (/webp/i.test(mime || '')) return '.webp';
  return '.jpg';
}

// Licences ouvertes compatibles avec une vente (sans NC ni ND). À vérifier ensuite sur la page source.
const LICENCES_COMMERCIALES = /^(CC0|Public domain|PDM|CC BY(-SA)?\s?\d(\.\d)?)$/i;

async function searchCommons(query, limit) {
  const params = new URLSearchParams({
    action: 'query', format: 'json', origin: '*',
    generator: 'search', gsrnamespace: '6', gsrlimit: String(Math.max(limit * 3, 10)),
    gsrsearch: query,
    prop: 'imageinfo', iiprop: 'url|extmetadata|mime', iiurlwidth: '1600'
  });
  const url = 'https://commons.wikimedia.org/w/api.php?' + params.toString();
  const data = await fetchJson(url);
  const pages = data && data.query && data.query.pages ? Object.values(data.query.pages) : [];
  return pages.map(p => {
    const ii = p.imageinfo && p.imageinfo[0];
    if (!ii) return null;
    const meta = ii.extmetadata || {};
    const pick = (k) => (meta[k] && (meta[k].value || '')).replace(/<[^>]+>/g, '').trim();
    return {
      title: p.title,
      url: ii.thumburl || ii.url,
      original: ii.url,
      mime: ii.mime || '',
      auteur: pick('Artist') || pick('Credit'),
      licence: pick('LicenseShortName') || pick('License'),
      source: ii.descriptionurl || ('https://commons.wikimedia.org/wiki/' + encodeURIComponent(p.title.replace(/ /g, '_'))),
      description: pick('ImageDescription') || pick('ObjectName') || p.title,
      provider: 'commons'
    };
  }).filter(x => x && /image\//.test(x.mime || '') && /\.(jpg|jpeg|png|webp)/i.test(x.url || x.original || ''))
    .filter(x => LICENCES_COMMERCIALES.test(x.licence || ''));
}

async function searchGoogleCSE(query, limit) {
  const key = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CSE_ID || '957bb6ebe1c8042e5';
  if (!key) throw new Error('GOOGLE_API_KEY non défini (GOOGLE_CSE_ID optionnel, défaut: 957bb6ebe1c8042e5)');
  const params = new URLSearchParams({
    key, cx, q: query, searchType: 'image', num: String(Math.min(10, Math.max(limit, 1))), safe: 'active'
  });
  // rights peut être ajouté si configuré (ex: cc_publicdomain,cc_attribute,...)
  if (process.env.GOOGLE_CSE_RIGHTS) params.set('rights', process.env.GOOGLE_CSE_RIGHTS);
  const url = 'https://www.googleapis.com/customsearch/v1?' + params.toString();
  const data = await fetchJson(url);
  const items = Array.isArray(data.items) ? data.items : [];
  return items.map(it => ({
    title: it.title || '',
    url: it.link,
    original: it.link,
    mime: (it.mime || ''),
    auteur: (it.image && it.image.contextLink) ? '' : '',
    licence: 'À vérifier (résultat Google)',
    source: (it.image && it.image.contextLink) || it.link || '',
    description: it.snippet || it.title || '',
    provider: 'google-cse'
  })).filter(x => x.url && /\.(jpg|jpeg|png|webp)/i.test(x.url));
}

function decodeHtml(s){ return String(s||'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'"); }
async function searchGoogleBestEffort(query, limit) {
  // Tentative best-effort (sans API): extraction d'URLs d'images depuis la page de résultats.
  // Peut échouer (consentement/captcha/structure HTML changeante). Licence non garantie.
  const url = 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(query);
  const html = await fetchText(url, { 'Cookie': 'CONSENT=YES+' });
  const found = [];
  const re = /"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)(?:\?[^"]*)?)"/ig;
  let m;
  while ((m = re.exec(html)) && found.length < limit * 4) {
    const u = decodeHtml(m[1]);
    if (/gstatic\.com|google\.com\/images/.test(u)) continue;
    if (!found.find(x => x.url === u)) found.push({ title: '', url: u, original: u, mime: '', auteur: '', licence: 'À vérifier (résultat Google, best-effort)', source: u, description: query, provider: 'google-web' });
  }
  return found;
}

async function searchImages(provider, query, limit) {
  const errors = [];
  const tryP = async (name, fn) => { try { const r = await fn(); if (r && r.length) return r; errors.push(name+':0'); } catch(e){ errors.push(name+':'+e.message); } return []; };
  if (provider === 'commons') return await searchCommons(query, limit);
  if (provider === 'google') {
    let r = await tryP('google-cse', () => searchGoogleCSE(query, limit));
    if (!r.length) r = await tryP('commons-fallback', () => searchCommons(query, limit));
    if (!r.length && errors.length) console.error('[info] aucune image trouvée (' + errors.join(', ') + ') pour: ' + query);
    return r;
  }
  // auto
  const hasCse = !!process.env.GOOGLE_API_KEY;
  if (hasCse) {
    let r = await tryP('google-cse', () => searchGoogleCSE(query, limit));
    if (!r.length) r = await tryP('commons', () => searchCommons(query, limit));
    return r;
  }
  let r = await tryP('commons', () => searchCommons(query, limit));
  return r;
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) { usage(); process.exit(0); }
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });
  const catalogue = loadCatalogue();
  let products = Array.isArray(catalogue.produits) ? catalogue.produits : [];
  if (args.rayon) products = products.filter(p => p.rayon === args.rayon);
  if (args.id) products = products.filter(p => p.id === args.id);
  products = products.slice(0, args.max);

  const today = new Date().toISOString().slice(0, 10);
  const results = [];
  console.log(`[agent] provider=${args.provider} produits=${products.length} per=${args.per} dry-run=${args.dryRun}`);
  const hasCse = !!process.env.GOOGLE_API_KEY;
  if (args.provider !== 'commons' && !hasCse) {
    console.log('[agent] info: sans GOOGLE_API_KEY, la recherche Google CSE API est indisponible (cx par défaut: 957bb6ebe1c8042e5). Mode best-effort + repli Commons utilisé.');
  } else if (args.provider !== 'commons') {
    console.log(`[agent] Google CSE API activée (cx=${process.env.GOOGLE_CSE_ID || '957bb6ebe1c8042e5'}).`);
  }

  for (let idx = 0; idx < products.length; idx++) {
    const p = products[idx];
    const existing = (p.medias && Array.isArray(p.medias.images)) ? p.medias.images.length : 0;
    const need = Math.max(0, args.per - existing);
    const baseQuery = (Array.isArray(p.motsCles) && p.motsCles.filter(Boolean).length)
      ? String(p.motsCles.filter(Boolean).join(' '))
      : `${p.marque || ''} ${p.modele || ''}`.trim();
    const queries = [
      `"${baseQuery}"`,
      `"${baseQuery}" ${p.annee || ''}`.trim()
    ];
    const suggested = [];
    let found = [];
    for (const q of queries) {
      if (found.length >= need) break;
      const hits = await searchImages(args.provider, q, need);
      for (const h of hits) {
        if (found.length >= need) break;
        const key = h.original || h.url;
        if (key && !found.find(x => (x.original || x.url) === key)) found.push(h);
      }
    }
    found = found.slice(0, need);
    for (let i = 0; i < found.length; i++) {
      const h = found[i];
      const ext = extFrom(h.url || h.original, h.mime);
      const fname = `${slugify(p.id)}-${i + 1 + existing}${ext}`;
      const rel = `img/${fname}`;
      const dest = path.join(IMG_DIR, fname);
      let downloaded = false;
      if (!args.dryRun) {
        try {
          if (!fs.existsSync(dest)) await downloadFile(h.url || h.original, dest);
          downloaded = true;
        } catch (e) {
          console.error(`[warn] téléchargement échoué ${p.id}: ${e.message}`);
        }
      }
      suggested.push({
        fichier: rel,
        alt: `${p.marque || ''} ${p.modele || ''} - image ${i + 1 + existing}`.trim(),
        auteur: h.auteur || '',
        licence: h.licence || '',
        source: h.source || h.original || h.url || '',
        dateVerification: today,
        _downloaded: args.dryRun ? false : downloaded,
        _requete: `${baseQuery} images libres de droits`,
        _provider: h.provider || args.provider
      });
    }
    results.push({ id: p.id, marque: p.marque, modele: p.modele, rayon: p.rayon, annee: p.annee, existantes: existing, suggested });
    console.log(`[${idx + 1}/${products.length}] ${p.id} -> ${suggested.length}/${need} suggestion(s)`);
  }

  const out = { generatedAt: new Date().toISOString(), mode: 'agent', params: { provider: args.provider, per: args.per, rayon: args.rayon, id: args.id, dryRun: args.dryRun }, products: results };
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + '\n', 'utf8');
  const totalSug = results.reduce((a, p) => a + (p.suggested ? p.suggested.length : 0), 0);
  console.log(`\n[agent] terminé. suggestions=${totalSug} fichier=${path.relative(ROOT, OUT_PATH)}`);
  console.log('[agent] vérifiez licences/droits/pertinence, puis fusionnez avec merge-media-suggestions.cjs');
}

main().catch(e => { console.error('[agent] erreur:', e.message); process.exit(1); });
