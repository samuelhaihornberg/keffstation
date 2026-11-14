#!/usr/bin/env node
/**
 * Assistant recherche + téléchargement + squelette média pour Kifftech.store (keffstation).
 *
 * - Recherche des images sur Wikimedia Commons (licences libres, métadonnées auteur/licence/source).
 * - Télécharge les fichiers dans img/.
 * - Génère un squelette JSON (media-suggestions.json) intégrable dans la visionneuse/fiche produit
 *   via `medias.images[]` (champ principal attendu: `fichier`).
 *
 * Usage:
 *   node tools/fetch-media-assistant.js [--per 3] [--max 60] [--rayon smartphones] [--id alienware-m15-r3] [--dry-run]
 *
 * Notes:
 * - Nécessite un accès réseau à l'API Wikimedia Commons.
 * - Vérifiez toujours manuellement la licence, l'attribution et la pertinence avant intégration.
 * - Mot-clé de recherche utilisé: "<marque> <modele> <annee?> images libres de droits" (+ variantes).
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const CATALOGUE_PATH = path.join(ROOT, 'data', 'catalogue.js');
const IMG_DIR = path.join(ROOT, 'img');
const OUT_PATH = path.join(ROOT, 'tools', 'media-suggestions.json');

function parseArgs(argv) {
  const args = { per: 3, max: Infinity, rayon: null, id: null, dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--per') args.per = Math.max(1, Math.min(5, parseInt(argv[++i] || '3', 10)));
    else if (a === '--max') args.max = parseInt(argv[++i] || '0', 10) || Infinity;
    else if (a === '--rayon') args.rayon = argv[++i] || null;
    else if (a === '--id') args.id = argv[++i] || null;
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function loadCatalogue() {
  let s = fs.readFileSync(CATALOGUE_PATH, 'utf8');
  s = s.replace(/^export const CATALOGUE = /, '').replace(/;\s*$/, '');
  // fallback: try to evaluate
  try { return Function('return (' + s + ')')(); } catch (e) {
    // heuristic: extract produits array is complex; rely on simple regex scan for essentials
    throw new Error('Impossible de parser data/catalogue.js: ' + e.message);
  }
}

function slugify(str) {
  return String(str || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

function fetchJson(url) {
  return fetch(url, { headers: { 'User-Agent': 'KifftechMediaAssistant/1.0 (local script; contact: local)' } })
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const get = (u) => https.get(u, { headers: { 'User-Agent': 'KifftechMediaAssistant/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close(); fs.unlink(dest, () => {}); return get(res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, u).toString());
      }
      if (res.statusCode !== 200) { file.close(); fs.unlink(dest, () => {}); return reject(new Error('HTTP ' + res.statusCode + ' ' + u)); }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => { file.close(); fs.unlink(dest, () => {}); reject(err); });
    get(url);
  });
}

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
      description: pick('ImageDescription') || pick('ObjectName') || p.title
    };
  }).filter(x => x && /image\//.test(x.mime) && /\.(jpg|jpeg|png|webp)/i.test(x.url || x.original || ''));
}

function extFrom(url, mime) {
  const m = (url || '').match(/\.(jpg|jpeg|png|webp)(?:\?|$)/i);
  if (m) return '.' + m[1].toLowerCase().replace('jpeg', 'jpg');
  if (/png/i.test(mime)) return '.png';
  if (/webp/i.test(mime)) return '.webp';
  return '.jpg';
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log('Usage: node tools/fetch-media-assistant.js [--per 3] [--max 60] [--rayon <rayon>] [--id <id>] [--dry-run]');
    process.exit(0);
  }
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });
  const catalogue = loadCatalogue();
  let products = Array.isArray(catalogue.produits) ? catalogue.produits : [];
  if (args.rayon) products = products.filter(p => p.rayon === args.rayon);
  if (args.id) products = products.filter(p => p.id === args.id);
  products = products.slice(0, args.max);

  const today = new Date().toISOString().slice(0, 10);
  const results = [];
  for (const p of products) {
    const existing = (p.medias && Array.isArray(p.medias.images)) ? p.medias.images.length : 0;
    const need = Math.max(0, args.per - existing);
    const baseQuery = `${p.marque || ''} ${p.modele || ''}`.trim();
    const queries = [
      `${baseQuery} ${p.annee || ''} images libres de droits`,
      `${baseQuery} product photo`,
      `${baseQuery}`
    ];
    const suggested = [];
    let found = [];
    for (const q of queries) {
      if (found.length >= need) break;
      try {
        const hits = await searchCommons(q, need);
        for (const h of hits) {
          if (found.length >= need) break;
          if (!found.find(x => x.original === h.original)) found.push(h);
        }
      } catch (e) {
        console.error(`[warn] recherche échouée pour ${p.id} (${q}): ${e.message}`);
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
        source: h.source || h.original || '',
        dateVerification: today,
        _downloaded: args.dryRun ? false : downloaded,
        _requete: baseQuery
      });
    }
    results.push({ id: p.id, marque: p.marque, modele: p.modele, rayon: p.rayon, annee: p.annee, existantes: existing, suggested });
    console.log(`[${p.id}] ${suggested.length}/${need} suggestion(s)${args.dryRun ? ' (dry-run)' : ''}`);
  }

  const out = { generatedAt: new Date().toISOString(), params: { per: args.per, rayon: args.rayon, id: args.id, dryRun: args.dryRun }, products: results };
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`\nSquelette écrit: ${path.relative(ROOT, OUT_PATH)}`);
  console.log('Intégration: pour chaque produit, fusionner `suggested[]` (sans champs `_...`) dans `medias.images[]` du catalogue.');
}

main().catch(e => { console.error(e); process.exit(1); });
