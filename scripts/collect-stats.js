// ==========================================================================
// KeffStation — Collecte de statistiques RÉELLES (aucune simulation)
// --------------------------------------------------------------------------
// Sources (indépendantes, toutes optionnelles) :
//   1. GitHub Traffic API  → vues / visiteurs uniques par chemin, par dépôt
//   2. GA4 Data API        → vues, durée d'engagement, clics liens/boutons
//   3. Search Console API  → clics et impressions de recherche par URL
//
// Sortie : stats/data/live.json (commité par le workflow, servi par GitHub Pages)
//
// Usage (local ou via Actions) :
//   GH_TRAFFIC_TOKEN=…                 node scripts/collect-stats.js
//   GA4_PROPERTY_ID=123456789          node scripts/collect-stats.js
//   GA4_SERVICE_ACCOUNT_JSON={…}       node scripts/collect-stats.js
//   GSC_SITE_URL=sc-domain:…           node scripts/collect-stats.js
//   GSC_SERVICE_ACCOUNT_JSON={…}       node scripts/collect-stats.js
//
// Règles :
//   - Ne journalise JAMAIS un secret (token, clé, e-mail de service).
//   - N'écrit le fichier que si au moins une source a répondu ; sinon le
//     dernier fichier valide est conservé (le workflow ne committe rien).
//   - Les données sont brutes : aucune valeur inventée, aucun repli simulé.
// ==========================================================================
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const OUT_FILE = path.join(ROOT, 'stats', 'data', 'live.json');
const WINDOW_DAYS = Number(process.env.STATS_WINDOW_DAYS || 30);
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'samuelhaihornberg';
const SITES = ['keffstation', 'Factureboutique', 'Kifftech.store', 'critiques-services.com'];

/* ------------------------------------------------------------------ */
/* Utilitaires                                                        */
/* ------------------------------------------------------------------ */
const SECRETS = [
  process.env.GH_TRAFFIC_TOKEN || '',
  process.env.GA4_SERVICE_ACCOUNT_JSON || '',
  process.env.GSC_SERVICE_ACCOUNT_JSON || '',
  process.env.GSC_CLIENT_SECRET || ''
].filter(Boolean);

function redact(s) {
  let out = String(s == null ? '' : s);
  for (const secret of SECRETS) {
    if (secret && secret.length >= 6) out = out.split(secret).join('[REDACTED]');
  }
  return out;
}
function log(...args) { console.log(...args.map((a) => redact(a))); }
function warn(...args) { console.warn(...args.map((a) => redact(a))); }

function isoDaysAgo(days) {
  const d = new Date(Date.now() - days * 86400000);
  return d.toISOString().slice(0, 10);
}

async function httpJson(url, options = {}, timeoutMs = 30000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal });
    const text = await res.text();
    let json = null;
    try { json = text ? JSON.parse(text) : null; } catch (e) { json = null; }
    if (!res.ok) {
      const err = new Error(`HTTP ${res.status} ${res.statusText}`);
      err.status = res.status;
      err.body = json || text.slice(0, 300);
      throw err;
    }
    return json;
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------ */
/* 1. GitHub Traffic API                                               */
/* ------------------------------------------------------------------ */
async function collectGitHub() {
  const token = process.env.GH_TRAFFIC_TOKEN || '';
  if (!token) return { ok: false, reason: 'GH_TRAFFIC_TOKEN absent', repos: [] };

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'keffstation-stats-collector'
  };

  const repos = [];
  for (const repo of SITES) {
    const entry = { repo, views: 0, uniques: 0, paths: [], referrers: [], error: null };
    try {
      const views = await httpJson(`https://api.github.com/repos/${GITHUB_OWNER}/${repo}/traffic/views`, { headers });
      entry.views = views.count || 0;
      entry.uniques = views.uniques || 0;
      entry.daily = (views.views || []).map((d) => ({ d: d.timestamp, views: d.count, uniques: d.uniques }));

      const paths = await httpJson(`https://api.github.com/repos/${GITHUB_OWNER}/${repo}/traffic/popular/paths`, { headers });
      entry.paths = (paths || []).map((p) => ({
        path: p.path,
        title: p.title || '',
        views: p.count || 0,
        uniques: p.uniques || 0
      }));

      const refs = await httpJson(`https://api.github.com/repos/${GITHUB_OWNER}/${repo}/traffic/popular/referrers`, { headers });
      entry.referrers = (refs || []).map((r) => ({ referrer: r.referrer, views: r.count || 0, uniques: r.uniques || 0 }));
    } catch (e) {
      entry.error = e.status ? `HTTP ${e.status}` : e.message;
      warn(`  ⚠ github/${repo} : ${entry.error}`);
    }
    repos.push(entry);
  }

  const ok = repos.some((r) => !r.error && (r.views > 0 || r.paths.length));
  return { ok, reason: ok ? null : 'aucune donnée exploitable', repos, window_days: 14 };
}

/* ------------------------------------------------------------------ */
/* 2. GA4 Data API                                                    */
/* ------------------------------------------------------------------ */
function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function parseServiceAccount(raw) {
  if (!raw) return null;
  try {
    const txt = raw.trim().replace(/^```[a-z]*\n?/i, '').replace(/```$/, '');
    return JSON.parse(txt);
  } catch (e) {
    return null;
  }
}

function createJwt(sa, scope, audience) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = { iss: sa.client_email, scope, aud: audience, iat: now, exp: now + 3600 };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  const sig = signer.sign(sa.private_key, 'base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${unsigned}.${sig}`;
}

async function tokenFromServiceAccount(sa, scope, audience) {
  const jwt = createJwt(sa, scope, audience);
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: jwt
  });
  const res = await httpJson('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });
  if (!res || !res.access_token) throw new Error('Jeton GA4/GSC absent de la réponse OAuth');
  return res.access_token;
}

async function ga4Report(accessToken, propertyId, body) {
  return httpJson(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }, 60000);
}

function rowsToObjects(report) {
  const dims = (report && report.dimensionHeaders) ? report.dimensionHeaders.map((d) => d.name) : [];
  const metrics = (report && report.metricHeaders) ? report.metricHeaders.map((m) => m.name) : [];
  const rows = (report && report.rows) || [];
  return rows.map((row) => {
    const obj = {};
    dims.forEach((d, i) => { obj[d] = row.dimensionValues[i] ? row.dimensionValues[i].value : ''; });
    metrics.forEach((m, i) => { obj[m] = row.metricValues[i] ? parseFloat(row.metricValues[i].value) : 0; });
    return obj;
  });
}

async function collectGa4() {
  const propertyId = (process.env.GA4_PROPERTY_ID || '').trim();
  const sa = parseServiceAccount(process.env.GA4_SERVICE_ACCOUNT_JSON);
  if (!propertyId || !sa) {
    return { ok: false, reason: !propertyId ? 'GA4_PROPERTY_ID absent' : 'GA4_SERVICE_ACCOUNT_JSON absent ou invalide', pages: [], clicks: [], totals: {} };
  }

  let token;
  try {
    token = await tokenFromServiceAccount(sa, 'https://www.googleapis.com/auth/analytics.readonly', 'https://oauth2.googleapis.com/token');
  } catch (e) {
    return { ok: false, reason: `authentification impossible (${e.status ? 'HTTP ' + e.status : e.message})`, pages: [], clicks: [], totals: {} };
  }

  const startDate = isoDaysAgo(WINDOW_DAYS);
  const endDate = isoDaysAgo(0);

  const pagesReport = await ga4Report(token, propertyId, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'userEngagementDuration' },
      { name: 'sessions' }
    ],
    limit: 500,
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }]
  });

  const totalsReport = await ga4Report(token, propertyId, {
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'sessions' },
      { name: 'totalUsers' },
      { name: 'userEngagementDuration' },
      { name: 'averageSessionDuration' }
    ]
  });

  let clicks = [];
  try {
    const clicksReport = await ga4Report(token, propertyId, {
      dateRanges: [{ startDate, endDate }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          inListFilter: { values: ['keff_link_click', 'keff_button_click', 'keff_page_view'] }
        }
      },
      dimensions: [
        { name: 'eventName' },
        { name: 'customEvent:link_label' },
        { name: 'customEvent:link_url' },
        { name: 'pagePath' }
      ],
      metrics: [{ name: 'eventCount' }],
      limit: 1000,
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }]
    });
    clicks = rowsToObjects(clicksReport);
  } catch (e) {
    warn(`  ⚠ GA4 clics : ${e.status ? 'HTTP ' + e.status : e.message}`);
  }

  return {
    ok: true,
    property: propertyId,
    range: { startDate, endDate, days: WINDOW_DAYS },
    pages: rowsToObjects(pagesReport),
    clicks,
    totals: rowsToObjects(totalsReport)[0] || {}
  };
}

/* ------------------------------------------------------------------ */
/* 3. Search Console API                                               */
/* ------------------------------------------------------------------ */
async function gscToken() {
  const sa = parseServiceAccount(process.env.GSC_SERVICE_ACCOUNT_JSON);
  if (sa) {
    return tokenFromServiceAccount(sa, 'https://www.googleapis.com/auth/webmasters.readonly', 'https://oauth2.googleapis.com/token');
  }
  const clientId = process.env.GSC_CLIENT_ID || '';
  const clientSecret = process.env.GSC_CLIENT_SECRET || '';
  const refreshToken = process.env.GSC_REFRESH_TOKEN || '';
  if (!clientId || !clientSecret || !refreshToken) return null;

  const res = await httpJson('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken
    }).toString()
  });
  return res && res.access_token ? res.access_token : null;
}

async function collectGsc() {
  const siteUrl = (process.env.GSC_SITE_URL || '').trim();
  if (!siteUrl) return { ok: false, reason: 'GSC_SITE_URL absent', urls: [], totals: {} };

  let token;
  try {
    token = await gscToken();
  } catch (e) {
    return { ok: false, reason: `authentification impossible (${e.status ? 'HTTP ' + e.status : e.message})`, urls: [], totals: {} };
  }
  if (!token) {
    return { ok: false, reason: 'GSC_SERVICE_ACCOUNT_JSON ou (GSC_CLIENT_ID/SECRET/REFRESH_TOKEN) absent', urls: [], totals: {} };
  }

  const body = {
    startDate: isoDaysAgo(WINDOW_DAYS),
    endDate: isoDaysAgo(0),
    dimensions: ['page'],
    rowLimit: 500
  };

  const data = await httpJson(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    },
    60000
  );

  const rows = data.rows || [];
  const totals = rows.reduce((acc, r) => {
    acc.clicks += r.clicks || 0;
    acc.impressions += r.impressions || 0;
    acc.position_sum += (r.position || 0) * (r.impressions || 0);
    return acc;
  }, { clicks: 0, impressions: 0, position_sum: 0 });

  const avgPosition = totals.impressions ? totals.position_sum / totals.impressions : 0;

  return {
    ok: true,
    site: siteUrl,
    range: { startDate: body.startDate, endDate: body.endDate, days: WINDOW_DAYS },
    urls: rows.map((r) => ({
      path: r.keys && r.keys[0] ? r.keys[0] : '',
      clicks: r.clicks || 0,
      impressions: r.impressions || 0,
      ctr: r.ctr || 0,
      position: r.position || 0
    })),
    totals: { clicks: totals.clicks, impressions: totals.impressions, avg_position: avgPosition }
  };
}

/* ------------------------------------------------------------------ */
/* Normalisation des chemins                                          */
/* ------------------------------------------------------------------ */
// '/keffstation/kifftech/' -> 'kifftech/index.html'
// '/kifftech/'              -> 'kifftech/index.html'
function normalizePath(raw, site) {
  let p = String(raw || '').trim();
  if (!p) return '';
  p = p.split('?')[0].split('#')[0];
  // retire le préfixe du site (Pages) ou le nom du dépôt
  const prefixes = ['/' + site + '/', '/' + site.toLowerCase() + '/'];
  for (const pre of prefixes) {
    if (p.toLowerCase().startsWith(pre.toLowerCase())) { p = p.slice(pre.length); break; }
  }
  if (p === '' || p === '/') p = 'index.html';
  p = p.replace(/^\/+/, '');
  if (p.endsWith('/')) p += 'index.html';
  if (!/\.[a-z0-9]{2,5}$/i.test(p)) p += 'index.html';
  return p;
}

const PAGE_LABELS = {
  'index.html': 'Vitrine KeffStation',
  'kifftech/index.html': 'KiffTech',
  'kifftech/rayons.html': 'KiffTech — Rayons',
  'kifftech/catalog.html': 'KiffTech — Catalogue',
  'kifftech/about.html': 'KiffTech — À propos',
  'kifftech/credits.html': 'KiffTech — Crédits',
  'kifftech/admin-caisse.html': 'KiffTech — Caisse',
  'viartificial-labs/index.html': 'ViArtificial Labs',
  'viartificial-labs/via.html': 'ViArtificial — Miroir IA',
  'viartificial-labs/conversation.html': 'ViArtificial — Conversation',
  'viartificial-labs/xsstream.html': 'ViArtificial — XSStream',
  'videogames/index.html': 'Videogames',
  'cos-editor/index.html': 'cos Editor',
  'linguistic-motors/index.html': 'Linguistic Motors',
  'stats/index.html': 'Statistiques publiques',
  'tricktrocjob/index.html': 'Tricktrocjob',
  'kiffstationadmin/index.html': 'Admin KeffStation',
  'blm/index.html': 'BLM Orchestrateur'
};

function labelFor(site, pagePath) {
  if (site === 'keffstation') return PAGE_LABELS[pagePath] || pagePath;
  const name = site.replace(/\.(com|store)$/i, '');
  const leaf = pagePath.split('/').pop() || '';
  const pretty = leaf.replace(/index\.html$/, '').replace(/[-_]/g, ' ').trim();
  return pretty ? `${name} — ${pretty}` : name;
}

/* ------------------------------------------------------------------ */
/* Assemblage                                                         */
/* ------------------------------------------------------------------ */
function buildOutput(gh, ga4, gsc) {
  const pages = {};   // site -> { pagePath -> {...} }
  const links = {};   // site -> { key -> {...} }
  const buttons = {};

  const ensure = (site) => {
    if (!pages[site]) pages[site] = {};
    if (!links[site]) links[site] = {};
    if (!buttons[site]) buttons[site] = {};
    return pages[site];
  };

  /* --- GitHub : vues par chemin --- */
  (gh.repos || []).forEach((repo) => {
    if (!repo || repo.error) return;
    const site = repo.repo;
    const bag = ensure(site);
    (repo.paths || []).forEach((p) => {
      const key = normalizePath(p.path, site);
      if (!key) return;
      const cur = bag[key] || (bag[key] = { label: labelFor(site, key), views: 0, uniques: 0, clicks: 0, duration: 0, sources: [] });
      cur.views += p.views || 0;
      cur.uniques = Math.max(cur.uniques, p.uniques || 0);
      if (!cur.sources.includes('github')) cur.sources.push('github');
    });
  });

  /* --- GA4 : vues + durée + clics --- */
  if (ga4.ok) {
    const site = 'keffstation';
    const bag = ensure(site);
    (ga4.pages || []).forEach((row) => {
      const key = normalizePath(row.pagePath, site);
      if (!key) return;
      const cur = bag[key] || (bag[key] = { label: labelFor(site, key), views: 0, uniques: 0, clicks: 0, duration: 0, sources: [] });
      cur.views += row.screenPageViews || 0;
      cur.duration += row.userEngagementDuration || 0;
      if (!cur.sources.includes('ga4')) cur.sources.push('ga4');
    });

    const clickEvents = (ga4.clicks || []).filter((c) => c.eventName !== 'keff_page_view');
    clickEvents.forEach((c) => {
      const page = normalizePath(c.pagePath, site);
      const label = c['customEvent:link_label'] || '(sans libellé)';
      const url = c['customEvent:link_url'] || '';
      const isButton = c.eventName === 'keff_button_click';
      const target = isButton ? buttons : links;
      if (!target[site]) target[site] = {};
      const key = `${page}||${label}|${url}`;
      const rec = target[site][key] || { label, href: url, target: url, page, count: 0, sources: [] };
      rec.count += c.eventCount || 0;
      if (!rec.sources.includes('ga4')) rec.sources.push('ga4');
      target[site][key] = rec;
    });

    // Le nombre de clics de page peut aussi venir des événements GA4
    const pageClicks = {};
    clickEvents.forEach((c) => {
      const p = normalizePath(c.pagePath, site);
      pageClicks[p] = (pageClicks[p] || 0) + (c.eventCount || 0);
    });
    Object.keys(pageClicks).forEach((p) => {
      const cur = bag[p] || (bag[p] = { label: labelFor(site, p), views: 0, uniques: 0, clicks: 0, duration: 0, sources: [] });
      cur.clicks += pageClicks[p];
    });
  }

  /* --- GSC : clics de recherche par URL --- */
  if (gsc.ok) {
    const site = 'keffstation';
    const bag = ensure(site);
    (gsc.urls || []).forEach((u) => {
      const key = normalizePath(u.path, site);
      if (!key) return;
      const cur = bag[key] || (bag[key] = { label: labelFor(site, key), views: 0, uniques: 0, clicks: 0, duration: 0, sources: [] });
      cur.search_clicks = (cur.search_clicks || 0) + (u.clicks || 0);
      cur.impressions = (cur.impressions || 0) + (u.impressions || 0);
      cur.position = u.position || 0;
      if (!cur.sources.includes('gsc')) cur.sources.push('gsc');
    });
  }

  const totals = Object.keys(pages).reduce((acc, site) => {
    Object.keys(pages[site]).forEach((p) => {
      const v = pages[site][p];
      acc.views += v.views || 0;
      acc.clicks += v.clicks || 0;
      acc.duration += v.duration || 0;
    });
    return acc;
  }, { views: 0, clicks: 0, duration: 0 });

  return {
    generated: new Date().toISOString(),
    window: { days: WINDOW_DAYS, from: isoDaysAgo(WINDOW_DAYS), to: isoDaysAgo(0) },
    real: true,
    sources: {
      github: { ok: !!gh.ok, reason: gh.reason || null, repos: gh.repos || [] },
      ga4: { ok: !!ga4.ok, reason: ga4.reason || null, property: ga4.property || null, range: ga4.range || null, totals: ga4.totals || {} },
      gsc: { ok: !!gsc.ok, reason: gsc.reason || null, site: gsc.site || null, range: gsc.range || null, totals: gsc.totals || {} }
    },
    pages,
    links,
    buttons,
    totals
  };
}

/* ------------------------------------------------------------------ */
/* Main                                                               */
/* ------------------------------------------------------------------ */
async function main() {
  log('→ Collecte des statistiques réelles (fenêtre ' + WINDOW_DAYS + ' jours)');

  log('· GitHub Traffic API…');
  const gh = await collectGitHub();
  log(gh.ok ? `  ✓ ${gh.repos.length} dépôt(s)` : `  — indisponible : ${gh.reason}`);

  log('· GA4 Data API…');
  const ga4 = await collectGa4();
  log(ga4.ok ? '  ✓ propriété ' + ga4.property : `  — indisponible : ${ga4.reason}`);

  log('· Search Console API…');
  const gsc = await collectGsc();
  log(gsc.ok ? '  ✓ ' + gsc.site : `  — indisponible : ${gsc.reason}`);

  const out = buildOutput(gh, ga4, gsc);

  const anyData = out.totals.views > 0 || out.totals.clicks > 0 || out.totals.duration > 0 ||
    Object.keys(out.pages).some((s) => Object.keys(out.pages[s]).length);

  if (!anyData) {
    warn('✗ Aucune donnée réelle collectée — fichier existant conservé.');
    process.exitCode = 2;
    return;
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2) + '\n');

  log(`✓ ${path.relative(ROOT, OUT_FILE)} écrit`);
  log(`  vues=${out.totals.views} clics=${out.totals.clicks} durée=${Math.round(out.totals.duration)}s`);
  log(`  sites: ${Object.keys(out.pages).join(', ') || '(aucun)'}`);
}

main().catch((e) => {
  warn('STATS_COLLECT_ERROR: ' + redact(e && e.message ? e.message : String(e)));
  process.exit(1);
});
