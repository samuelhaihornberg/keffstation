/* =============================================================
   KeffStation — Statistiques publiques
   -------------------------------------------------------------
   - Sources : localStorage (ce navigateur) + data/stats.json (base)
   - 3D : un graphique « montagnes » par statistique
          (vues / durée / clics) + un graphique par page sélectionnée
   - Fallback 2D si Three.js est indisponible (CDN bloqué / hors ligne)
   ============================================================= */

/* ---------------- Traductions ---------------- */

const T = {
  fr: {
    back_vitrine: '← Vitrine',
    import: 'Importer',
    export: 'Exporter JSON',
    reset: 'Réinitialiser',
    title: 'Statistiques publiques',
    subtitle: "Un graphique 3D montagnes par statistique (vues, durée, clics), et le détail par page sélectionnée. Données de ton navigateur + base de référence du dépôt.",
    source_local: 'Source : ce navigateur',
    source_merged: 'Source : Navigateur + base de référence',
    updated: 'Mise à jour : —',
    pages_count: 'Pages suivies : —',
    kpi_views: 'Vues totales',
    kpi_clicks: 'Clics totaux',
    kpi_duration: 'Durée totale',
    kpi_avg: 'Durée moyenne / page',
    kpi_top: 'Page la plus vue',
    kpi_uniques: 'Visiteurs uniques',
    kpi_search: 'Clics Google',
    source_real: 'Source : données réelles collectées',
    source_missing: 'Non configurée',
    source_on: 'actif',
    source_off: 'inactif',
    collected: 'Collecte : —',
    sources_title: 'Sources des données',
    sources_hint: 'Collecte automatique par GitHub Actions (quotidienne). Aucun secret n\'est exposé dans le navigateur.',
    chart_sites: 'Toutes les PWA — vues par chemin',
    chart_sites_hint: 'GitHub Traffic API · tous les dépôts',
    sites_title: 'Trafic de tous les dépôts',
    th_depot: 'Dépôt',
    th_uniques: 'Uniques',
    tb_mode: 'Affichage',
    tb_stat: 'Statistique',
    tb_note: 'Clique une montagne ou une ligne du tableau pour ouvrir le détail de la page.',
    tb_note_active: 'Statistique active : {stat}. Clique une montagne pour ouvrir le détail de la page.',
    mode_global: '🌐 Plateforme',
    mode_page: '📄 Page sélectionnée',
    stat_views: '📈 Vues',
    stat_duration: '⏱️ Durée',
    stat_clicks: '👆 Clics',
    chart_views: 'Montagnes des vues',
    chart_views_hint: 'Hauteur = nombre de vues',
    chart_duration: 'Montagnes de la durée de vue',
    chart_duration_hint: 'Hauteur = temps passé sur la page',
    chart_clicks: 'Montagnes des clics',
    chart_clicks_hint: 'Hauteur = clics sur liens et boutons',
    card_pick: 'Voir cette statistique',
    loading: 'Chargement de la 3D…',
    legend_low: 'Faible',
    legend_mid: 'Moyen',
    legend_high: 'Élevé',
    scene_hint: 'Glisse pour tourner · molette pour zoomer · clique une montagne pour ouvrir le détail de la page',
    pages_title: 'Pages suivies',
    pages_hint: 'Clique une ligne pour ouvrir le graphique 3D de la page.',
    sort_views: 'Vues',
    sort_duration: 'Durée',
    sort_clicks: 'Clics',
    th_page: 'Page',
    th_views: 'Vues',
    th_clicks: 'Clics',
    th_duration: 'Durée',
    th_avg: 'Moyenne',
    th_share: 'Part',
    clicks_title: 'Clics par lien et par bouton',
    f_all: 'Tous',
    f_links: 'Liens',
    f_buttons: 'Boutons',
    th_type: 'Type',
    th_label: 'Libellé',
    th_target: 'Cible',
    th_source_page: 'Page',
    th_hits: 'Occurrences',
    page_clear: '✕ Revenir à la plateforme',
    page_title: 'Statistiques de la page',
    page_scene_hint: 'Chaque montagne = un lien ou un bouton de la page (hauteur = nombre de clics)',
    page_kpi_views: 'Vues',
    page_kpi_clicks: 'Clics',
    page_kpi_duration: 'Durée totale',
    page_kpi_avg: 'Durée moyenne',
    how_title: 'Comment ces chiffres sont-ils produits ?',
    how_1: 'Chaque page visitée enregistre une vue, la durée passée dessus et chaque clic sur un lien ou un bouton.',
    how_2: 'Les mesures sont stockées localement (localStorage) : elles reflètent ta navigation sur ce navigateur, et une base de référence est versionnée dans le dépôt.',
    how_3: 'Un export JSON permet de consolider plusieurs navigateurs : importe le fichier sur l’autre poste pour fusionner les totaux.',
    how_4: 'Les mêmes événements sont envoyés à Google Analytics quand le tag est présent sur la page.',
    footer: 'KeffStation — statistiques publiques',
    no_data: 'Aucune donnée — visite quelques pages puis reviens ici.',
    no_hits: 'Aucun clic enregistré sur cette page.',
    link: 'Lien',
    button: 'Bouton',
    fallback: '3D indisponible (CDN bloqué) — vue 2D de secours',
    reset_done: 'Données locales réinitialisées.',
    import_done: 'Données importées et fusionnées.',
    import_error: 'Fichier invalide.',
    filter_page: 'Filtre : {page}'
  },
  en: {
    back_vitrine: '← Showcase',
    import: 'Import',
    export: 'Export JSON',
    reset: 'Reset',
    title: 'Public statistics',
    subtitle: 'A 3D mountain chart per statistic (views, duration, clicks), plus a detail view for the selected page. Data from your browser + the repository baseline.',
    source_local: 'Source: this browser',
    source_merged: 'Source: browser + baseline',
    updated: 'Updated: —',
    pages_count: 'Tracked pages: —',
    kpi_views: 'Total views',
    kpi_clicks: 'Total clicks',
    kpi_duration: 'Total duration',
    kpi_avg: 'Average time / page',
    kpi_top: 'Most viewed page',
    kpi_uniques: 'Unique visitors',
    kpi_search: 'Google clicks',
    source_real: 'Source: real collected data',
    source_missing: 'Not configured',
    source_on: 'active',
    source_off: 'inactive',
    collected: 'Collected: —',
    sources_title: 'Data sources',
    sources_hint: 'Collected automatically by GitHub Actions (daily). No secret is exposed in the browser.',
    chart_sites: 'All PWAs — views per path',
    chart_sites_hint: 'GitHub Traffic API · every repository',
    sites_title: 'Traffic of every repository',
    th_depot: 'Repository',
    th_uniques: 'Unique',
    tb_mode: 'Display',
    tb_stat: 'Statistic',
    tb_note: 'Click a mountain or a table row to open the page detail.',
    tb_note_active: 'Active statistic: {stat}. Click a mountain to open the page detail.',
    mode_global: '🌐 Platform',
    mode_page: '📄 Selected page',
    stat_views: '📈 Views',
    stat_duration: '⏱️ Duration',
    stat_clicks: '👆 Clicks',
    chart_views: 'View mountains',
    chart_views_hint: 'Height = number of views',
    chart_duration: 'View-duration mountains',
    chart_duration_hint: 'Height = time spent on the page',
    chart_clicks: 'Click mountains',
    chart_clicks_hint: 'Height = clicks on links and buttons',
    card_pick: 'View this statistic',
    loading: 'Loading 3D…',
    legend_low: 'Low',
    legend_mid: 'Medium',
    legend_high: 'High',
    scene_hint: 'Drag to rotate · scroll to zoom · click a mountain to open the page detail',
    pages_title: 'Tracked pages',
    pages_hint: 'Click a row to open the 3D chart of that page.',
    sort_views: 'Views',
    sort_duration: 'Duration',
    sort_clicks: 'Clicks',
    th_page: 'Page',
    th_views: 'Views',
    th_clicks: 'Clicks',
    th_duration: 'Duration',
    th_avg: 'Average',
    th_share: 'Share',
    clicks_title: 'Clicks per link and per button',
    f_all: 'All',
    f_links: 'Links',
    f_buttons: 'Buttons',
    th_type: 'Type',
    th_label: 'Label',
    th_target: 'Target',
    th_source_page: 'Page',
    th_hits: 'Hits',
    page_clear: '✕ Back to the platform',
    page_title: 'Page statistics',
    page_scene_hint: 'Each mountain = a link or a button of the page (height = number of clicks)',
    page_kpi_views: 'Views',
    page_kpi_clicks: 'Clicks',
    page_kpi_duration: 'Total duration',
    page_kpi_avg: 'Average duration',
    how_title: 'How are these numbers produced?',
    how_1: 'Each visited page records a view, the time spent on it and every click on a link or a button.',
    how_2: 'Metrics are stored locally (localStorage): they reflect your browsing in this browser, and a baseline is versioned in the repository.',
    how_3: 'A JSON export lets you consolidate several browsers: import the file on the other machine to merge totals.',
    how_4: 'The same events are sent to Google Analytics when the tag is present on the page.',
    footer: 'KeffStation — public statistics',
    no_data: 'No data — visit a few pages then come back here.',
    no_hits: 'No click recorded on this page.',
    link: 'Link',
    button: 'Button',
    fallback: '3D unavailable (CDN blocked) — fallback 2D view',
    reset_done: 'Local data reset.',
    import_done: 'Data imported and merged.',
    import_error: 'Invalid file.',
    filter_page: 'Filter: {page}'
  }
};

const LANG_KEY = 'keffstation_lang';
let lang = (localStorage.getItem(LANG_KEY) || 'fr').slice(0, 2).toLowerCase();
if (!T[lang]) lang = 'fr';

function applyLang() {
  document.querySelectorAll('[data-t]').forEach((el) => {
    const key = el.getAttribute('data-t');
    if (T[lang][key]) el.textContent = T[lang][key];
  });
  document.documentElement.lang = lang;
  const btn = document.getElementById('btnLang');
  if (btn) btn.textContent = lang === 'fr' ? 'EN' : 'FR';
}

/* ---------------- Libellés de pages ---------------- */

const PAGE_LABELS = {
  'index.html': 'Vitrine KeffStation',
  'kifftech/index.html': 'KiffTech',
  'kifftech/catalogue.html': 'KiffTech — Rayons',
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

function pageLabel(path) {
  return PAGE_LABELS[path] || path;
}

/* ---------------- Sources de données ---------------- */

const STORAGE_KEY = 'keffstation_stats_v1';
const MAIN_SITE = 'keffstation';

function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;
    return {
      pages: data.pages || {},
      links: data.links || {},
      buttons: data.buttons || {},
      updated: data.updated || null
    };
  } catch (e) { return null; }
}

let imported = null; // import manuel d'un export JSON
let live = null;     // stats/data/live.json — données RÉELLES collectées par GitHub Actions

/* Cible normalisée : '/keffstation/kifftech/catalogue.html' -> 'kifftech/catalogue.html'
   Les cibles déjà relatives à la racine du site (produites par le tracker)
   sont conservées telles quelles. */
function shortTarget(t) {
  if (!t) return '';
  const s = String(t);
  if (s.charAt(0) !== '/' && !/^https?:\/\//i.test(s)) return s.replace(/^\/+/, '');
  try {
    const u = new URL(s, location.href);
    let p = u.pathname;
    const pre = '/' + MAIN_SITE + '/';
    if (p.indexOf(pre) === 0) p = p.slice(pre.length);
    p = p.replace(/^\/+/, '');
    if (p.length > 1 && p.charAt(p.length - 1) === '/') p += 'index.html';
    return p + (u.search || '');
  } catch (e) { return s.slice(0, 60); }
}

function liveSite(site) {
  const out = { pages: {}, links: {}, buttons: {} };
  if (!live) return out;

  const lp = (live.pages && live.pages[site]) || {};
  Object.keys(lp).forEach((path) => {
    const v = lp[path] || {};
    out.pages[path] = {
      path,
      label: v.label || pageLabel(path),
      views: Number(v.views || 0),
      uniques: Number(v.uniques || 0),
      clicks: Number(v.clicks || 0),
      duration: Number(v.duration || 0),
      search_clicks: Number(v.search_clicks || 0),
      impressions: Number(v.impressions || 0),
      position: Number(v.position || 0),
      sources: v.sources || []
    };
  });

  const readHits = (bucket, kind) => {
    const src = (live[bucket] && live[bucket][site]) || {};
    Object.keys(src).forEach((k) => {
      const v = src[k] || {};
      const label = v.label || '';
      const target = kind === 'link' ? shortTarget(v.href || v.target || '') : (v.target || v.href || '');
      out.bucket_add(bucket, kind, { key: `${v.page || ''}||${label}|${target}`, kind, label, target, page: v.page || '', count: Number(v.count || 0), sources: v.sources || [] });
    });
  };
  out.bucket_add = (bucket, kind, rec) => { out[bucket][rec.key] = rec; };
  readHits('links', 'link');
  readHits('buttons', 'button');

  return out;
}

function merge(site) {
  const s = site || MAIN_SITE;
  const base = liveSite(s);
  const pages = {};
  const hits = [];

  Object.keys(base.pages).forEach((path) => {
    const v = base.pages[path];
    pages[path] = Object.assign({}, v, { avg: v.views > 0 ? Math.round(v.duration / v.views) : 0 });
  });
  Object.keys(base.links).forEach((k) => hits.push(base.links[k]));
  Object.keys(base.buttons).forEach((k) => hits.push(base.buttons[k]));

  const bumpHit = (kind, page, label, target, count) => {
    const key = `${page}||${label}|${target}`;
    const found = hits.find((h) => h.kind === kind && h.key === key);
    if (found) {
      found.count += count;
      if (!found.sources.includes('local')) found.sources.push('local');
    } else {
      hits.push({ key, kind, label, target, page, count, sources: ['local'] });
    }
  };

  /* Données locales (ce navigateur) — site principal uniquement */
  if (s === MAIN_SITE) {
    const local = readLocal();
    if (local) {
      Object.keys(local.pages || {}).forEach((path) => {
        const v = local.pages[path] || {};
        const cur = pages[path] || {
          path, label: pageLabel(path), views: 0, uniques: 0, clicks: 0, duration: 0,
          search_clicks: 0, impressions: 0, position: 0, sources: [], avg: 0
        };
        cur.views += Number(v.views || 0);
        cur.clicks += Number(v.clicks || 0);
        cur.duration += Number(v.duration || 0);
        cur.sessions = Number(v.sessions || 0);
        if (!cur.sources.includes('local')) cur.sources.push('local');
        cur.avg = cur.views > 0 ? Math.round(cur.duration / cur.views) : 0;
        pages[path] = cur;
      });
      Object.keys(local.links || {}).forEach((k) => {
        const v = local.links[k] || {};
        bumpHit('link', v.page || '', v.label || '', shortTarget(v.target || v.href || ''), Number(v.count || 0));
      });
      Object.keys(local.buttons || {}).forEach((k) => {
        const v = local.buttons[k] || {};
        bumpHit('button', v.page || '', v.label || '', v.target || '', Number(v.count || 0));
      });
    }

    /* Import manuel d'un export JSON */
    if (imported) {
      Object.keys(imported.pages || {}).forEach((path) => {
        const v = imported.pages[path] || {};
        const cur = pages[path] || {
          path, label: pageLabel(path), views: 0, uniques: 0, clicks: 0, duration: 0,
          search_clicks: 0, impressions: 0, position: 0, sources: [], avg: 0
        };
        cur.views += Number(v.views || 0);
        cur.clicks += Number(v.clicks || 0);
        cur.duration += Number(v.duration || 0);
        if (!cur.sources.includes('import')) cur.sources.push('import');
        cur.avg = cur.views > 0 ? Math.round(cur.duration / cur.views) : 0;
        pages[path] = cur;
      });
      Object.keys(imported.links || {}).forEach((k) => {
        const v = imported.links[k] || {};
        bumpHit('link', v.page || '', v.label || '', shortTarget(v.href || v.target || ''), Number(v.count || 0));
      });
      Object.keys(imported.buttons || {}).forEach((k) => {
        const v = imported.buttons[k] || {};
        bumpHit('button', v.page || '', v.label || '', v.target || '', Number(v.count || 0));
      });
    }
  }

  const pageList = Object.values(pages).filter((p) => p.views || p.clicks || p.duration);
  hits.sort((a, b) => b.count - a.count);

  const totals = pageList.reduce((acc, p) => {
    acc.views += p.views;
    acc.clicks += p.clicks;
    acc.duration += p.duration;
    acc.uniques += p.uniques || 0;
    acc.search_clicks += p.search_clicks || 0;
    acc.impressions += p.impressions || 0;
    return acc;
  }, { views: 0, clicks: 0, duration: 0, uniques: 0, search_clicks: 0, impressions: 0 });

  return {
    pages: pageList,
    hits,
    totals,
    updated: (live && live.generated) || null,
    window: (live && live.window) || null,
    sources: (live && live.sources) || null,
    hasLive: !!live
  };
}

/* Toutes les pages de tous les dépôts (GitHub Traffic) */
function allSites() {
  const rows = [];
  if (!live || !live.pages) return rows;
  Object.keys(live.pages).forEach((site) => {
    const bag = live.pages[site] || {};
    Object.keys(bag).forEach((path) => {
      const v = bag[path] || {};
      if (!v.views && !v.uniques) return;
      rows.push({
        site,
        path,
        label: v.label || path,
        views: Number(v.views || 0),
        uniques: Number(v.uniques || 0),
        sources: v.sources || []
      });
    });
  });
  rows.sort((a, b) => b.views - a.views);
  return rows;
}


/* ---------------- Formatage ---------------- */

function fmtInt(n) {
  return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US').format(Math.round(n || 0));
}

function fmtDuration(sec) {
  sec = Math.max(0, Math.round(sec || 0));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h} h ${String(m).padStart(2, '0')} min`;
  if (m > 0) return `${m} min ${String(s).padStart(2, '0')} s`;
  return `${s} s`;
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function metricLabel(metric) {
  if (metric === 'duration') return T[lang].kpi_duration;
  if (metric === 'clicks') return T[lang].kpi_clicks;
  return T[lang].kpi_views;
}

/* ---------------- État ---------------- */

const STATS = [
  { key: 'views', scene: 'sceneViews', hue: { h0: 0.52, h1: 0.76, s: 0.85, l0: 0.34, l1: 0.62 }, keyColor: 0x00d4ff, rimColor: 0x8a4dff },
  { key: 'duration', scene: 'sceneDuration', hue: { h0: 0.06, h1: 0.95, s: 0.9, l0: 0.38, l1: 0.62 }, keyColor: 0xf59e0b, rimColor: 0xff3d9a },
  { key: 'clicks', scene: 'sceneClicks', hue: { h0: 0.78, h1: 0.95, s: 0.9, l0: 0.36, l1: 0.64 }, keyColor: 0x8a4dff, rimColor: 0x00d4ff }
];

let sortKey = 'views';
let filterKey = 'all';
let activeStat = 'views';
let selectedPage = null;
let currentData = null;

/* ---------------- Rendu des tableaux ---------------- */

function renderPages(data) {
  const tbody = document.getElementById('pagesBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (!data.pages.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty">${escapeHtml(T[lang].no_data)}</td></tr>`;
    return;
  }

  const rows = data.pages.slice().sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0));
  const max = Math.max(...rows.map((r) => r[sortKey] || 0), 1);

  rows.forEach((r) => {
    const tr = document.createElement('tr');
    tr.dataset.path = r.path;
    if (r.path === selectedPage) tr.classList.add('selected');
    const share = Math.round(((r[sortKey] || 0) / max) * 100);
    tr.innerHTML = `
      <td>
        <div class="cell-main">${escapeHtml(r.label)}</div>
        <div class="cell-sub">${escapeHtml(r.path)}</div>
      </td>
      <td class="num">${fmtInt(r.views)}</td>
      <td class="num">${fmtInt(r.clicks)}</td>
      <td class="num">${fmtDuration(r.duration)}</td>
      <td class="num">${fmtDuration(r.avg)}</td>
      <td class="bar-col"><div class="bar"><i style="width:${share}%"></i></div></td>`;
    tr.addEventListener('click', () => selectPage(r.path));
    tbody.appendChild(tr);
  });
}

function hitRow(h, withPage) {
  const tr = document.createElement('tr');
  const share = h.share !== undefined ? h.share : 0;
  tr.innerHTML = `
    <td><span class="tag ${h.kind}">${escapeHtml(h.kind === 'link' ? T[lang].link : T[lang].button)}</span></td>
    <td><div class="cell-main">${escapeHtml(h.label)}</div></td>
    <td><div class="cell-sub">${escapeHtml(h.target || '—')}</div></td>
    ${withPage ? `<td><div class="cell-sub">${escapeHtml(pageLabel(h.page))}</div></td>` : ''}
    <td class="num">${fmtInt(h.count)}</td>
    <td class="bar-col"><div class="bar d"><i style="width:${share}%"></i></div></td>`;
  return tr;
}

function renderHits(data) {
  const tbody = document.getElementById('clicksBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  let rows = data.hits;
  if (filterKey === 'links') rows = rows.filter((r) => r.kind === 'link');
  if (filterKey === 'buttons') rows = rows.filter((r) => r.kind === 'button');
  if (selectedPage) rows = rows.filter((r) => r.page === selectedPage);

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty">${escapeHtml(T[lang].no_data)}</td></tr>`;
    return;
  }

  const max = Math.max(...rows.map((r) => r.count || 0), 1);
  rows.forEach((r) => {
    const share = Math.round(((r.count || 0) / max) * 100);
    tbody.appendChild(hitRow(Object.assign({}, r, { share }), true));
  });
}

function renderKpis(data) {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('kpiViews', fmtInt(data.totals.views));
  set('kpiClicks', fmtInt(data.totals.clicks));
  set('kpiDuration', fmtDuration(data.totals.duration));
  set('kpiAvg', fmtDuration(data.pages.length ? data.totals.duration / data.pages.length : 0));
  set('kpiUniques', fmtInt(data.totals.uniques));
  set('kpiSearch', fmtInt(data.totals.search_clicks));

  const top = data.pages.slice().sort((a, b) => b.views - a.views)[0];
  set('kpiTop', top ? top.label : '—');

  const badge = document.getElementById('badgeSource');
  if (badge) badge.textContent = data.hasLive ? T[lang].source_real : T[lang].source_local;

  const upd = document.getElementById('badgeUpdated');
  if (upd) {
    const d = data.updated;
    upd.textContent = d ? `${T[lang].updated.replace('—', '')} ${new Date(d).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')}` : T[lang].updated;
  }

  const pagesBadge = document.getElementById('badgePages');
  if (pagesBadge) pagesBadge.textContent = `${T[lang].pages_count.replace('—', '')} ${data.pages.length}`;
}

/* ---------------- Sources réelles ---------------- */

const SOURCE_META = {
  github: { label: 'GitHub Traffic API', desc: 'Vues et visiteurs uniques par chemin (14 jours glissants)' },
  ga4: { label: 'Google Analytics 4', desc: 'Vues, durée d\'engagement et clics liens/boutons' },
  gsc: { label: 'Google Search Console', desc: 'Clics et impressions de recherche par URL' },
  local: { label: 'Ce navigateur', desc: 'Vues, durée et clics mesurés sur cet appareil' }
};

function renderSources(data) {
  const grid = document.getElementById('sourcesGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const src = data.sources || {};
  const cards = [];

  ['github', 'ga4', 'gsc'].forEach((key) => {
    const info = src[key] || {};
    const ok = !!info.ok;
    const meta = SOURCE_META[key];
    let detail = '';
    if (ok && key === 'github') {
      const repos = (info.repos || []).filter((r) => !r.error);
      const total = repos.reduce((a, r) => a + (r.views || 0), 0);
      detail = `${repos.length} dépôt(s) · ${fmtInt(total)} vues`;
    } else if (ok && key === 'ga4') {
      const t = info.totals || {};
      detail = `${fmtInt(t.screenPageViews || 0)} vues · ${fmtDuration(t.userEngagementDuration || 0)} d'engagement`;
    } else if (ok && key === 'gsc') {
      const t = info.totals || {};
      detail = `${fmtInt(t.clicks || 0)} clics · ${fmtInt(t.impressions || 0)} impressions`;
    } else {
      detail = info.reason || T[lang].source_missing;
    }
    cards.push({ key, label: meta.label, desc: meta.desc, ok, detail });
  });

  const local = readLocal();
  cards.push({
    key: 'local',
    label: SOURCE_META.local.label,
    desc: SOURCE_META.local.desc,
    ok: !!local && Object.keys(local.pages || {}).length > 0,
    detail: local ? `${Object.keys(local.pages).length} page(s) mesurée(s)` : T[lang].source_missing
  });

  cards.forEach((c) => {
    const div = document.createElement('div');
    div.className = 'source-card' + (c.ok ? ' ok' : ' off');
    div.innerHTML = `
      <div class="source-head">
        <span class="source-dot"></span>
        <strong>${escapeHtml(c.label)}</strong>
        <span class="source-state">${c.ok ? escapeHtml(T[lang].source_on) : escapeHtml(T[lang].source_off)}</span>
      </div>
      <div class="source-desc">${escapeHtml(c.desc)}</div>
      <div class="source-detail">${escapeHtml(c.detail)}</div>`;
    grid.appendChild(div);
  });

  const badge = document.getElementById('badgeCollected');
  if (badge) {
    badge.textContent = data.updated
      ? `${T[lang].collected.replace('—', '')} ${new Date(data.updated).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')}`
      : T[lang].collected;
  }
}

/* ---------------- Trafic des autres dépôts ---------------- */

let siteFilter = 'all';

function renderSites() {
  const tbody = document.getElementById('sitesBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  let rows = allSites();
  if (siteFilter !== 'all') rows = rows.filter((r) => r.site === siteFilter);

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty">${escapeHtml(T[lang].no_data)}</td></tr>`;
    return;
  }

  const max = Math.max(...rows.map((r) => r.views || 0), 1);
  rows.forEach((r) => {
    const tr = document.createElement('tr');
    const share = Math.round(((r.views || 0) / max) * 100);
    tr.innerHTML = `
      <td><div class="cell-main">${escapeHtml(r.site)}</div></td>
      <td><div class="cell-sub">${escapeHtml(r.path)}</div></td>
      <td class="num">${fmtInt(r.views)}</td>
      <td class="num">${fmtInt(r.uniques)}</td>
      <td class="bar-col"><div class="bar s"><i style="width:${share}%"></i></div></td>`;
    tbody.appendChild(tr);
  });
}

function renderSiteFilters() {
  const box = document.querySelector('[data-site-filter="all"]') ? document.querySelector('[data-site-filter="all"]').parentElement : null;
  if (!box) return;
  const sites = [];
  Object.keys((live && live.pages) || {}).forEach((s) => { if (s !== MAIN_SITE) sites.push(s); });
  if (!sites.length) return;

  Array.from(box.querySelectorAll('[data-site-filter]')).forEach((b) => {
    if (b.getAttribute('data-site-filter') !== 'all') b.remove();
  });

  sites.forEach((s) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (siteFilter === s ? ' active' : '');
    b.setAttribute('data-site-filter', s);
    b.textContent = s;
    b.addEventListener('click', () => {
      siteFilter = s;
      Array.from(box.querySelectorAll('[data-site-filter]')).forEach((x) => x.classList.toggle('active', x === b));
      renderSites();
    });
    box.appendChild(b);
  });
}


/* ---------------- Graphique 3D (Three.js) ---------------- */

async function loadThree() {
  const urls = [
    'https://unpkg.com/three@0.164.1/build/three.module.js',
    'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js'
  ];
  for (const url of urls) {
    try {
      return await import(/* @vite-ignore */ url);
    } catch (e) { /* next */ }
  }
  return null;
}

function buildTerrain(THREE, w, d, h, hue) {
  const res = 40;
  const geo = new THREE.PlaneGeometry(w, d, res, res);
  const pos = geo.attributes.position;
  const colors = [];

  // 1) Champ de hauteur : dôme central (0 au bord, 1 au sommet) + ondulations douces
  const heights = new Float32Array((res + 1) * (res + 1));
  let maxH = 0;
  for (let iy = 0; iy <= res; iy++) {
    for (let ix = 0; ix <= res; ix++) {
      const u = ix / res;
      const v = iy / res;
      const dx = u - 0.5;
      const dy = v - 0.5;
      const r = Math.min(1, Math.sqrt(dx * dx + dy * dy) / 0.55);
      const dome = Math.cos(r * Math.PI * 0.5);
      const ripple = 0.82 + 0.18 * (Math.sin(u * 3 * Math.PI + 1.3) * Math.cos(v * 2.5 * Math.PI + 2.1));
      const hh = Math.pow(dome, 1.25) * ripple;
      heights[iy * (res + 1) + ix] = hh;
      if (hh > maxH) maxH = hh;
    }
  }

  // 2) Normalisation : le sommet atteint exactement la hauteur h
  const scale = maxH > 0 ? h / maxH : 0;

  // 3) Écriture des sommets finaux : X = largeur, Y = hauteur, Z = profondeur
  //    (PlaneGeometry : sommet (ix, iy) -> index = ix + (res + 1) * iy)
  for (let iy = 0; iy <= res; iy++) {
    for (let ix = 0; ix <= res; ix++) {
      const u = ix / res;
      const v = iy / res;
      const i = iy * (res + 1) + ix;
      const hh = heights[i] * scale;

      pos.setXYZ(i, -w / 2 + u * w, hh, -d / 2 + v * d);

      const t = hh / Math.max(h, 0.001);
      const c = new THREE.Color().setHSL(hue.h0 + (hue.h1 - hue.h0) * t, hue.s, hue.l0 + (hue.l1 - hue.l0) * t);
      colors.push(c.r, c.g, c.b);
    }
  }

  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

class MountainChart {
  constructor(container, THREE, opts) {
    this.container = container;
    this.THREE = THREE;
    this.opts = opts || {};
    this.metric = this.opts.metric || 'views';
    this.items = [];
    this.meshes = [];
    this.hovered = null;
    this.autoRotate = true;
    this.idleTimer = 0;
    this.visible = true;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 380;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x05070f);
    this.scene.fog = new THREE.FogExp2(0x05070f, 0.028);

    this.camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 300);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const key = new THREE.DirectionalLight(this.opts.keyColor || 0x00d4ff, 1.1);
    key.position.set(9, 14, 7);
    key.castShadow = true;
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(this.opts.rimColor || 0xff3d9a, 0.55);
    rim.position.set(-9, 6, -8);
    this.scene.add(rim);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshStandardMaterial({ color: 0x0a0e20, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    this.scene.add(new THREE.GridHelper(80, 40, 0x1b2440, 0x0d1226));

    // caméra orbitale maison (aucune dépendance OrbitControls)
    this.yaw = Math.PI * 0.25;
    this.pitch = 0.62;
    this.dist = 26;
    this.target = new THREE.Vector3(0, 2.2, 0);

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.bindEvents();
    this.observe();
    this.animate();
  }

  /* Pause le rendu quand la carte est hors écran (CPU/GPU) */
  observe() {
    if (typeof IntersectionObserver === 'undefined') return;
    try {
      this.observer = new IntersectionObserver((entries) => {
        this.visible = entries.some((e) => e.isIntersecting);
      }, { threshold: 0.05 });
      this.observer.observe(this.container);
    } catch (e) { /* ignore */ }
  }

  bindEvents() {
    const el = this.renderer.domElement;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let moved = false;

    el.addEventListener('pointerdown', (e) => {
      dragging = true;
      moved = false;
      lastX = e.clientX;
      lastY = e.clientY;
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    });

    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      if (dragging) {
        this.yaw -= (e.clientX - lastX) * 0.006;
        this.pitch = Math.max(0.12, Math.min(1.35, this.pitch + (e.clientY - lastY) * 0.004));
        lastX = e.clientX;
        lastY = e.clientY;
        moved = true;
        this.autoRotate = false;
        clearTimeout(this.idleTimer);
        this.idleTimer = setTimeout(() => { this.autoRotate = true; }, 4000);
      }
    });

    const stop = (e) => {
      dragging = false;
      try {
        if (e && e.pointerId != null && el.hasPointerCapture && el.hasPointerCapture(e.pointerId)) {
          el.releasePointerCapture(e.pointerId);
        }
      } catch (err) { /* ignore */ }
    };
    el.addEventListener('pointerup', stop);
    el.addEventListener('pointercancel', stop);
    el.addEventListener('pointerleave', () => { this.hideTooltip(); });

    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.dist = Math.max(10, Math.min(70, this.dist * (1 + e.deltaY * 0.0012)));
    }, { passive: false });

    el.addEventListener('click', () => {
      if (moved) return;               // simple rotation : pas une sélection
      if (this.hovered && this.opts.onSelect) this.opts.onSelect(this.hovered);
    });

    this._resize = () => {
      const w = this.container.clientWidth || 600;
      const h = this.container.clientHeight || 380;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };
    window.addEventListener('resize', this._resize);
  }

  setItems(items, metric, extra) {
    const THREE = this.THREE;
    const opts = extra || {};
    this.metric = metric || this.metric;
    this.items = items || [];
    this.meshes = [];

    while (this.group.children.length) {
      const child = this.group.children.pop();
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    }

    if (!this.items.length) return;

    const maxValue = Math.max(...this.items.map((it) => Number(it[this.metric] || 0)), 1);
    const maxClicks = Math.max(...this.items.map((it) => Number(it.clicks || 0)), 1);
    const maxDur = Math.max(...this.items.map((it) => Number(it.duration || 0)), 1);

    const cols = Math.min(3, Math.max(1, Math.ceil(Math.sqrt(this.items.length))));
    const spacing = 9;

    this.items.forEach((item, i) => {
      const value = Number(item[this.metric] || 0);
      const norm = value / maxValue;
      const h = 0.8 + Math.sqrt(norm) * 3.6;
      const w = opts.uniform ? 4.2 : 3.4 + Math.sqrt(Number(item.clicks || 0) / maxClicks) * 1.6;
      const d = opts.uniform ? 4.2 : 3.4 + Math.sqrt(Number(item.duration || 0) / maxDur) * 1.4;

      const geo = buildTerrain(THREE, w, d, h, this.opts.hue);
      const mat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.5,
        metalness: 0.12,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const cx = (i % cols) - (cols - 1) / 2;
      const cz = Math.floor(i / cols) - (Math.ceil(this.items.length / cols) - 1) / 2;
      mesh.position.set(cx * spacing, 0, cz * spacing);
      mesh.userData.item = item;
      this.group.add(mesh);
      this.meshes.push(mesh);

      const peakColor = new THREE.Color().setHSL(
        this.opts.hue.h0 + (this.opts.hue.h1 - this.opts.hue.h0) * 0.85,
        this.opts.hue.s,
        0.62
      );
      const peak = new THREE.Mesh(
        new THREE.SphereGeometry(0.16 + Math.sqrt(norm) * 0.22, 14, 14),
        new THREE.MeshStandardMaterial({ color: peakColor, emissive: peakColor, emissiveIntensity: 0.7 })
      );
      peak.position.set(mesh.position.x, h + 0.35, mesh.position.z);
      peak.userData.item = item;
      this.group.add(peak);
      this.meshes.push(peak);
    });

    const rows = Math.ceil(this.items.length / cols);
    this.target.set(0, 1.6, 0);
    this.dist = Math.max(18, Math.min(70, 14 + rows * 7));
  }

  hideTooltip() {
    const tip = document.getElementById('tooltip');
    if (tip) tip.hidden = true;
    this.hovered = null;
  }

  showTooltip(item, x, y) {
    const tip = document.getElementById('tooltip');
    if (!tip) return;
    const value = item[this.metric] || 0;
    const valueLabel = this.metric === 'duration' ? fmtDuration(value) : fmtInt(value);

    let rows = `
      <div class="tt-row"><span>${escapeHtml(metricLabel(this.metric))}</span><b>${valueLabel}</b></div>`;

    if (this.opts.detail === 'page') {
      rows += `
        <div class="tt-row"><span>${escapeHtml(T[lang].th_type)}</span><b>${escapeHtml(item.kind === 'link' ? T[lang].link : T[lang].button)}</b></div>
        <div class="tt-row"><span>${escapeHtml(T[lang].th_target)}</span><b>${escapeHtml(item.target || '—')}</b></div>`;
    } else {
      rows += `
        <div class="tt-row"><span>${escapeHtml(T[lang].kpi_clicks)}</span><b>${fmtInt(item.clicks)}</b></div>
        <div class="tt-row"><span>${escapeHtml(T[lang].kpi_duration)}</span><b>${fmtDuration(item.duration)}</b></div>
        <div class="tt-row"><span>${escapeHtml(T[lang].kpi_avg)}</span><b>${fmtDuration(item.avg)}</b></div>`;
    }

    tip.innerHTML = `<div class="tt-title">${escapeHtml(item.label)}</div>${rows}`;
    tip.hidden = false;
    const rect = tip.getBoundingClientRect();
    let left = x + 16;
    let top = y + 16;
    if (left + rect.width > window.innerWidth - 10) left = x - rect.width - 16;
    if (top + rect.height > window.innerHeight - 10) top = y - rect.height - 16;
    tip.style.left = Math.max(8, left) + 'px';
    tip.style.top = Math.max(8, top) + 'px';
  }

  animate() {
    this.raf = requestAnimationFrame(() => this.animate());
    if (!this.visible) return;

    if (this.autoRotate) this.yaw += 0.0018;

    const r = this.dist;
    this.camera.position.set(
      this.target.x + r * Math.cos(this.pitch) * Math.sin(this.yaw),
      this.target.y + r * Math.sin(this.pitch),
      this.target.z + r * Math.cos(this.pitch) * Math.cos(this.yaw)
    );
    this.camera.lookAt(this.target);

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.meshes, false);
    if (hits.length) {
      const item = hits[0].object.userData.item;
      if (item) {
        this.hovered = item;
        if (this.mouseX != null) this.showTooltip(item, this.mouseX, this.mouseY);
      }
    } else if (this.hovered) {
      this.hideTooltip();
    }

    this.renderer.render(this.scene, this.camera);
  }
}

/* ---------------- Vue 2D de secours ---------------- */

function fallback2d(container, items, metric, detail) {
  container.innerHTML = '';
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const W = container.clientWidth || 600;
  const H = container.clientHeight || 380;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);
  ctx.scale(dpr, dpr);

  const max = Math.max(...items.map((i) => Number(i[metric] || 0)), 1);
  const pad = 34;
  const step = (W - pad * 2) / Math.max(items.length, 1);
  const bw = Math.max(10, step - 12);

  ctx.fillStyle = '#05070f';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,.08)';
  ctx.strokeRect(pad, 20, W - pad * 2, H - 60);

  items.forEach((it, i) => {
    const v = Number(it[metric] || 0);
    const h = Math.max(4, ((H - 100) * v) / max);
    const x = pad + 12 + i * step;
    const grad = ctx.createLinearGradient(0, H - 40 - h, 0, H - 40);
    if (metric === 'duration') { grad.addColorStop(0, '#fb7185'); grad.addColorStop(1, '#f59e0b'); }
    else if (metric === 'clicks') { grad.addColorStop(0, '#c084fc'); grad.addColorStop(1, '#ff3d9a'); }
    else { grad.addColorStop(0, '#22d3ee'); grad.addColorStop(1, '#8a4dff'); }
    ctx.fillStyle = grad;
    ctx.fillRect(x, H - 40 - h, bw, h);
    ctx.fillStyle = 'rgba(255,255,255,.75)';
    ctx.font = '600 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(it.label || '').slice(0, 14), x + bw / 2, H - 22);
    ctx.fillStyle = 'rgba(255,255,255,.5)';
    ctx.fillText(metric === 'duration' ? fmtDuration(v) : fmtInt(v), x + bw / 2, H - 44 - h);
  });

  const note = document.createElement('div');
  note.className = 'scene-loading scene-error';
  note.textContent = T[lang].fallback;
  container.appendChild(note);
}

/* ---------------- Sélection ---------------- */

function selectPage(path) {
  if (!path) return;
  selectedPage = path;
  setMode('page');
  renderPagePanel();
  renderPages(currentData);
  renderHits(currentData);
  const panel = document.getElementById('pagePanel');
  if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deselectPage() {
  selectedPage = null;
  setMode('global');
  const scene = document.getElementById('scenePage');
  if (scene && pageChart) pageChart.setItems([], 'clicks', { uniform: true });
  renderPagePanel();
  renderPages(currentData);
  renderHits(currentData);
}

function setMode(mode) {
  document.querySelectorAll('[data-mode]').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-mode') === mode);
  });
  const panel = document.getElementById('pagePanel');
  if (panel) panel.hidden = mode !== 'page';
  const charts = document.getElementById('globalCharts');
  if (charts) charts.classList.toggle('dimmed', mode === 'page');
}

function setActiveStat(key) {
  activeStat = key;
  document.querySelectorAll('[data-stat]').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-stat') === key);
  });
  document.querySelectorAll('[data-stat-card]').forEach((card) => {
    card.classList.toggle('active', card.getAttribute('data-stat-card') === key);
  });
  const note = document.getElementById('toolbarNote');
  if (note) {
    const label = key === 'duration' ? T[lang].stat_duration : (key === 'clicks' ? T[lang].stat_clicks : T[lang].stat_views);
    note.textContent = T[lang].tb_note_active.replace('{stat}', label);
  }
  if (pageChart && selectedPage) refreshPageScene();
}

function renderPagePanel() {
  const panel = document.getElementById('pagePanel');
  if (!panel) return;

  if (!selectedPage) {
    panel.hidden = true;
    return;
  }
  panel.hidden = false;

  const page = (currentData.pages || []).find((p) => p.path === selectedPage);
  const title = document.getElementById('pageTitle');
  const path = document.getElementById('pagePath');
  const kpis = document.getElementById('pageKpis');

  if (title) title.textContent = page ? page.label : selectedPage;
  if (path) path.textContent = selectedPage;

  if (kpis) {
    kpis.innerHTML = '';
    const cells = [
      { label: T[lang].page_kpi_views, value: fmtInt(page ? page.views : 0) },
      { label: T[lang].page_kpi_clicks, value: fmtInt(page ? page.clicks : 0) },
      { label: T[lang].page_kpi_duration, value: fmtDuration(page ? page.duration : 0) },
      { label: T[lang].page_kpi_avg, value: fmtDuration(page ? page.avg : 0) }
    ];
    cells.forEach((c) => {
      const div = document.createElement('div');
      div.className = 'kpi mini';
      div.innerHTML = `<div class="kpi-value">${c.value}</div><div class="kpi-label">${escapeHtml(c.label)}</div>`;
      kpis.appendChild(div);
    });
  }

  refreshPageScene();
  renderPageHits();
}

function pageHits() {
  if (!currentData) return [];
  return currentData.hits.filter((h) => h.page === selectedPage);
}

function refreshPageScene() {
  const hits = pageHits();
  const items = hits.map((h) => ({
    label: h.label,
    kind: h.kind,
    target: h.target,
    clicks: h.count,
    duration: 0,
    views: 0,
    avg: 0
  }));

  const scene = document.getElementById('scenePage');
  if (!scene) return;

  if (!items.length) {
    if (pageChart) pageChart.setItems([], 'clicks', { uniform: true });
    const tbody = document.getElementById('pageHitsBody');
    if (tbody) tbody.innerHTML = `<tr><td colspan="5" class="empty">${escapeHtml(T[lang].no_hits)}</td></tr>`;
    return;
  }

  if (pageChart) {
    pageChart.setItems(items, 'clicks', { uniform: true });
  } else {
    fallback2d(scene, items, 'clicks');
  }
}

function renderPageHits() {
  const tbody = document.getElementById('pageHitsBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  const hits = pageHits();
  if (!hits.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty">${escapeHtml(T[lang].no_hits)}</td></tr>`;
    return;
  }
  const max = Math.max(...hits.map((h) => h.count || 0), 1);
  hits.forEach((h) => {
    const share = Math.round(((h.count || 0) / max) * 100);
    tbody.appendChild(hitRow(Object.assign({}, h, { share }), false));
  });
}

/* ---------------- Actions ---------------- */

function download(name, content, type) {
  const blob = new Blob([content], { type: type || 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportJson() {
  const data = currentData || merge();
  const payload = {
    generated: new Date().toISOString(),
    note: 'Export KeffStation — statistiques (réelles + navigation locale)',
    sources: data.sources || null,
    collected: data.updated || null,
    pages: {},
    links: {},
    buttons: {}
  };
  data.pages.forEach((p) => {
    payload.pages[p.path] = {
      label: p.label, views: p.views, uniques: p.uniques, clicks: p.clicks,
      duration: p.duration, sessions: p.sessions || 0,
      search_clicks: p.search_clicks || 0, impressions: p.impressions || 0,
      position: p.position || 0, sources: p.sources || []
    };
  });
  data.hits.forEach((h) => {
    const key = `${h.page}||${h.label}|${h.target}`;
    if (h.kind === 'link') payload.links[key] = { label: h.label, href: h.target, page: h.page, count: h.count };
    else payload.buttons[key] = { label: h.label, target: h.target, page: h.page, count: h.count };
  });
  download('keffstation-stats.json', JSON.stringify(payload, null, 2));
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result));
      imported = {
        pages: data.pages || {},
        links: data.links || {},
        buttons: data.buttons || {},
        updated: data.generated || null
      };
      render();
      toast(T[lang].import_done);
    } catch (e) {
      toast(T[lang].import_error);
    }
  };
  reader.readAsText(file);
}

let toastTimer = null;
function toast(msg) {
  let el = document.getElementById('ks-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'ks-toast';
    el.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:24px;z-index:9999;background:rgba(8,10,24,.96);border:1px solid rgba(0,212,255,.45);color:#00d4ff;padding:9px 15px;border-radius:999px;font-size:.82rem;box-shadow:0 12px 30px rgba(0,0,0,.5)';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.style.display = 'none'; }, 3200);
}

/* ---------------- Rendu global ---------------- */

let statCharts = {};
let pageChart = null;
let sitesChart = null;

function render() {
  currentData = merge();
  renderKpis(currentData);
  renderSources(currentData);
  renderPages(currentData);
  renderHits(currentData);
  renderSiteFilters();
  renderSites();
  if (selectedPage) renderPagePanel();

  STATS.forEach((s) => {
    const chart = statCharts[s.key];
    if (chart) chart.setItems(currentData.pages, s.key);
  });

  if (sitesChart) {
    const rows = allSites().map((r) => ({
      label: `${r.site} — ${r.path}`,
      path: r.path,
      site: r.site,
      views: r.views,
      clicks: 0,
      duration: 0,
      avg: 0
    }));
    sitesChart.setItems(rows, 'views', { uniform: false });
  }
}

/* ---------------- Amorçage ---------------- */

async function boot() {
  applyLang();

  /* Données RÉELLES collectées par GitHub Actions (stats/data/live.json) */
  try {
    const res = await fetch('data/live.json', { cache: 'no-store' });
    if (res.ok) {
      live = await res.json();
      if (live && live.real !== true) live = null; // pas de fichier simulé accepté
    }
  } catch (e) { live = null; }

  render();
  setActiveStat(activeStat);
  setMode('global');

  // Tri du tableau des pages
  document.querySelectorAll('[data-sort]').forEach((btn) => {
    btn.addEventListener('click', () => {
      sortKey = btn.getAttribute('data-sort');
      document.querySelectorAll('[data-sort]').forEach((b) => b.classList.toggle('active', b === btn));
      renderPages(currentData);
    });
  });

  // Filtre liens / boutons
  document.querySelectorAll('[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      filterKey = btn.getAttribute('data-filter');
      document.querySelectorAll('[data-filter]').forEach((b) => b.classList.toggle('active', b === btn));
      renderHits(currentData);
    });
  });

  // Mode d'affichage
  document.querySelectorAll('[data-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      if (mode === 'page' && !selectedPage) {
        const top = currentData.pages.slice().sort((a, b) => b.views - a.views)[0];
        if (top) { selectPage(top.path); return; }
      }
      setMode(mode);
    });
  });

  // Boutons « statistique »
  document.querySelectorAll('[data-stat]').forEach((btn) => {
    btn.addEventListener('click', () => setActiveStat(btn.getAttribute('data-stat')));
  });

  // Boutons « voir cette statistique » sur chaque carte
  document.querySelectorAll('[data-pick]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-pick');
      setActiveStat(key);
      const card = document.querySelector(`[data-stat-card="${key}"]`);
      if (card) {
        card.classList.add('flash');
        setTimeout(() => card.classList.remove('flash'), 1200);
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  const btnClear = document.getElementById('btnClearPage');
  if (btnClear) btnClear.addEventListener('click', deselectPage);

  const btnLang = document.getElementById('btnLang');
  if (btnLang) {
    btnLang.addEventListener('click', () => {
      lang = lang === 'fr' ? 'en' : 'fr';
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
      applyLang();
      setActiveStat(activeStat);
      render();
    });
  }

  const btnExport = document.getElementById('btnExport');
  if (btnExport) btnExport.addEventListener('click', exportJson);

  const btnImport = document.getElementById('btnImport');
  const fileImport = document.getElementById('fileImport');
  if (btnImport && fileImport) {
    btnImport.addEventListener('click', () => fileImport.click());
    fileImport.addEventListener('change', () => {
      if (fileImport.files && fileImport.files[0]) importJson(fileImport.files[0]);
      fileImport.value = '';
    });
  }

  const btnReset = document.getElementById('btnReset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      imported = null;
      render();
      toast(T[lang].reset_done);
    });
  }

  // ---- Scènes 3D ----
  const THREE = await loadThree();
  const use3D = !!THREE;

  STATS.forEach((s) => {
    const c = document.getElementById(s.scene);
    if (!c) return;
    c.innerHTML = '';
    if (use3D) {
      try {
        statCharts[s.key] = new MountainChart(c, THREE, {
          metric: s.key,
          hue: s.hue,
          keyColor: s.keyColor,
          rimColor: s.rimColor,
          onSelect: (item) => { if (item && item.path) selectPage(item.path); }
        });
      } catch (e) {
        statCharts[s.key] = null;
      }
    }
  });

  const cPage = document.getElementById('scenePage');
  if (cPage && use3D) {
    try {
      pageChart = new MountainChart(cPage, THREE, {
        metric: 'clicks',
        hue: { h0: 0.13, h1: 0.92, s: 0.9, l0: 0.38, l1: 0.64 },
        keyColor: 0xffd23f,
        rimColor: 0xff3d9a,
        detail: 'page',
        onSelect: (item) => { if (item) toast(`${item.label} — ${fmtInt(item.clicks)} clic(s)`); }
      });
    } catch (e) {
      pageChart = null;
    }
  }

  /* Scène « toutes les PWA » */
  const cSites = document.getElementById('sceneSites');
  if (cSites && use3D) {
    try {
      sitesChart = new MountainChart(cSites, THREE, {
        metric: 'views',
        hue: { h0: 0.32, h1: 0.58, s: 0.8, l0: 0.32, l1: 0.6 },
        keyColor: 0x27d17f,
        rimColor: 0x00d4ff,
        onSelect: (item) => {
          if (!item) return;
          const rows = Array.from(document.querySelectorAll('#sitesBody tr'));
          rows.forEach((tr) => {
            tr.classList.remove('flash');
            if (tr.textContent.indexOf(item.path) !== -1) {
              tr.classList.add('flash');
              tr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          });
        }
      });
    } catch (e) {
      sitesChart = null;
    }
  }

  // Repli 2D si la 3D n'est pas disponible
  STATS.forEach((s) => {
    const c = document.getElementById(s.scene);
    if (!c) return;
    if (!statCharts[s.key]) fallback2d(c, currentData.pages, s.key);
  });
  if (cSites && !sitesChart) {
    fallback2d(cSites, allSites().map((r) => ({ label: `${r.site} — ${r.path}`, views: r.views, clicks: 0, duration: 0 })), 'views');
  }

  render();
}

/* Démarrage (promesse exposée pour les intégrations : window.KeffStatsReady) */
window.KeffStatsReady = boot().then(() => {
  document.dispatchEvent(new CustomEvent('ks-stats-ready'));
  return true;
});
