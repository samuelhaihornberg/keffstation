// Sync catalogues impact.com (Partner API) -> kifftech/impact-products.json
// Usage: IMPACT_ACCOUNT_SID=... IMPACT_AUTH_TOKEN=... node scripts/sync-impact.js [--dry-run] [--limit N] [--test-connection] [--persona mediapartners|advertisers]
// - Ne journalise JAMAIS les identifiants (ni SID, ni token).
// - N'écrit le JSON que si >= 1 produit valide ; sinon conserve le dernier catalogue valide.
// - Ne remplit aucun champ manquant : seules les données fournies par l'API sont importées.
const fs = require('fs');
const path = require('path');

const API_BASE = 'https://api.impact.com';
const OUT_FILE = path.join(__dirname, '..', 'kifftech', 'impact-products.json');
const PAGE_SIZE = 100;
const MAX_PAGES_PER_CATALOG = 50;

const SID = process.env.IMPACT_ACCOUNT_SID || '';
const TOKEN = process.env.IMPACT_AUTH_TOKEN || '';
let PERSONA = 'Mediapartners'; // chemin API selon le type de compte (Partner par défaut)

function redact(s) {
  let out = String(s);
  for (const secret of [SID, TOKEN]) {
    if (secret && secret.length >= 4) out = out.split(secret).join('[REDACTED]');
  }
  return out;
}
function log(...args) { console.log(...args.map((a) => redact(a))); }
function fail(msg, code = 1) { console.error('IMPACT_SYNC_ERROR: ' + redact(msg)); process.exit(code); }

function authHeader() {
  return 'Basic ' + Buffer.from(`${SID}:${TOKEN}`).toString('base64');
}

async function apiGet(pathname) {
  const url = API_BASE + pathname;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch(url, {
      headers: { Authorization: authHeader(), Accept: 'application/json' },
      signal: ctrl.signal
    });
    if (res.status === 401 || res.status === 403) {
      throw new Error(`HTTP ${res.status} : identifiants refusés ou autorisations insuffisantes (vérifier compte, token Read-Only et accès catalogues).`);
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} sur ${pathname.split('?')[0]}`);
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) throw new Error(`Réponse non-JSON sur ${pathname.split('?')[0]}`);
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

// L'API enveloppe les listes (ex. {Catalogs:[...]} ou {Items:[...]}) ; accepte aussi un tableau nu.
function unwrapList(data, key) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data[key])) return data[key];
  if (data && typeof data === 'object') {
    for (const k of Object.keys(data)) {
      if (Array.isArray(data[k]) && /s$/i.test(k)) return data[k];
    }
  }
  return [];
}

async function listCatalogs() {
  const data = await apiGet(`/${PERSONA}/${encodeURIComponent(SID)}/Catalogs?PageSize=${PAGE_SIZE}`);
  return unwrapList(data, 'Catalogs');
}

async function listCatalogItems(catalogId, limit = Infinity) {
  const items = [];
  for (let page = 1; page <= MAX_PAGES_PER_CATALOG && items.length < limit; page++) {
    const data = await apiGet(
      `/${PERSONA}/${encodeURIComponent(SID)}/Catalogs/${encodeURIComponent(catalogId)}/Items?PageSize=${PAGE_SIZE}&Page=${page}`
    );
    const batch = unwrapList(data, 'Items');
    if (!batch.length) break;
    items.push(...batch);
    if (batch.length < PAGE_SIZE) break;
  }
  return limit === Infinity ? items : items.slice(0, limit);
}

function num(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}
function httpUrl(v) {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return /^https?:\/\//i.test(t) ? t : null;
}

// Mapping strict : uniquement les champs fournis par l'API. Rien d'inventé.
// Marque = Manufacturer (sinon AdvertiserName) ; modèle = Name tel que fourni.
function mapItem(it, catalog) {
  const id = it.CatalogItemId || it.Id;
  const name = (it.Name || '').trim();
  if (!id || !name) return null;
  const images = [httpUrl(it.ImageUrl), ...((it.AdditionalImageUrls || []).map(httpUrl))].filter(Boolean);
  const price = num(it.CurrentPrice);
  const original = num(it.OriginalPrice);
  return {
    id: String(id),
    catalogId: catalog.Id || null,
    campaign: it.CampaignName || catalog.CampaignName || null,
    brand: (it.Manufacturer || it.AdvertiserName || catalog.AdvertiserName || '').trim() || null,
    model: name,
    description: it.Description || null,
    images,
    price,
    originalPrice: original,
    currency: it.Currency || catalog.Currency || null,
    availability: it.StockAvailability || null,
    url: httpUrl(it.Url) || httpUrl(it.MobileUrl),
    category: it.SubCategory || it.Category || null
  };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const testOnly = args.includes('--test-connection');
  const limitArg = args.find((a) => a.startsWith('--limit'));
  const limit = limitArg ? Math.max(1, parseInt(limitArg.split('=')[1] || limitArg.split(' ')[1] || '0', 10) || Infinity) : Infinity;
  const personaArg = args.find((a) => a.startsWith('--persona'));
  const persona = personaArg ? (personaArg.split('=')[1] || '').trim().toLowerCase() : 'mediapartners';
  if (!['mediapartners', 'advertisers'].includes(persona)) fail(`Persona inconnu : ${persona} (mediapartners|advertisers).`);
  PERSONA = persona === 'advertisers' ? 'Advertisers' : 'Mediapartners';
  if (!SID || !TOKEN) fail('Secrets IMPACT_ACCOUNT_SID / IMPACT_AUTH_TOKEN absents de l environnement.');

  log('Connexion API impact.com (base officielle, auth Basic SID/token)…');
  const catalogs = await listCatalogs();
  log(`Catalogues autorisés : ${catalogs.length}`);
  for (const c of catalogs) {
    log(`- ${c.Name || c.Id} | annonceur=${c.AdvertiserName || '?'} | articles=${c.NumberOfItems || '?'} | devise=${c.Currency || '?'}`);
  }
  if (testOnly) {
    log('Test de connexion OK (aucune écriture).');
    return;
  }

  const products = [];
  const catalogMeta = [];
  for (const c of catalogs) {
    const items = await listCatalogItems(c.Id, limit);
    const mapped = items.map((it) => mapItem(it, c)).filter(Boolean);
    log(`Catalogue ${c.Name || c.Id} : ${items.length} lus, ${mapped.length} valides.`);
    catalogMeta.push({ id: c.Id || null, name: c.Name || null, advertiser: c.AdvertiserName || null, currency: c.Currency || null, count: mapped.length });
    products.push(...mapped);
    if (products.length >= limit) break;
  }

  if (!products.length) {
    fail(`Catalogue vide ou aucun produit valide : le dernier catalogue valide est conservé (${OUT_FILE} inchangé). Vérifier autorisations catalogues du compte.`);
  }
  const payload = {
    source: 'impact.com',
    updatedAt: new Date().toISOString(),
    count: products.length,
    catalogs: catalogMeta,
    products
  };
  if (dryRun) {
    log(`Dry-run : ${products.length} produits valides (aucune écriture).`);
    return;
  }
  fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2) + '\n');
  log(`Écrit : ${OUT_FILE} (${products.length} produits, ${catalogMeta.length} catalogues).`);
}

main().catch((e) => fail(e && e.message ? e.message : String(e)));
