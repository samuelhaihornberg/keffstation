/* =============================================================
   KeffStation — Statistiques publiques
   - Sources : localStorage (ce navigateur) + data/stats.json (base)
   - 3D : montagnes (Three.js) — hauteur = vues / durée de vue
   - Fallback 2D si Three.js est indisponible (CDN bloqué / hors ligne)
   ============================================================= */

/* ---------------- Traductions ---------------- */

const T = {
  fr: {
    back_vitrine: '← Vitrine',
    back_vitrine2: 'Retour à la plateforme',
    import: 'Importer',
    export: 'Exporter JSON',
    reset: 'Réinitialiser',
    title: 'Statistiques publiques',
    subtitle: "Vues et durée de consultation par page, clics par lien et par bouton. Données de ton navigateur + base de référence du dépôt.",
    source_local: 'Source : ce navigateur',
    source_merged: 'Source : Navigateur + base de référence',
    updated: 'Mise à jour : —',
    pages_count: 'Pages suivies : —',
    kpi_views: 'Vues totales',
    kpi_clicks: 'Clics totaux',
    kpi_duration: 'Durée totale',
    kpi_avg: 'Durée moyenne / page',
    kpi_top: 'Page la plus vue',
    chart_views: 'Montagnes des vues',
    chart_views_hint: 'Hauteur = nombre de vues',
    chart_duration: 'Montagnes de la durée de vue',
    chart_duration_hint: 'Hauteur = temps passé sur la page',
    loading: 'Chargement de la 3D…',
    legend_low: 'Faible',
    legend_mid: 'Moyen',
    legend_high: 'Élevé',
    scene_hint: 'Glisse pour tourner · molette pour zoomer · surligne une montagne pour voir le détail',
    pages_title: 'Pages suivies',
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
    how_title: 'Comment ces chiffres sont-ils produits ?',
    how_1: 'Chaque page visitée enregistre une vue, la durée passée dessus et chaque clic sur un lien ou un bouton.',
    how_2: 'Les mesures sont stockées localement (localStorage) : elles reflètent ta navigation sur ce navigateur, et une base de référence est versionnée dans le dépôt.',
    how_3: 'Un export JSON permet de consolider plusieurs navigateurs : importe le fichier sur l’autre poste pour fusionner les totaux.',
    how_4: 'Les mêmes événements sont envoyés à Google Analytics quand le tag est présent sur la page.',
    footer: 'KeffStation — statistiques publiques',
    no_data: 'Aucune donnée — visite quelques pages puis reviens ici.',
    link: 'Lien',
    button: 'Bouton',
    fallback: '3D indisponible (CDN bloqué) — vue 2D de secours',
    reset_done: 'Données locales réinitialisées.',
    import_done: 'Données importées et fusionnées.',
    import_error: 'Fichier invalide.',
    views: 'vues',
    clicks: 'clics'
  },
  en: {
    back_vitrine: '← Showcase',
    back_vitrine2: 'Back to the platform',
    import: 'Import',
    export: 'Export JSON',
    reset: 'Reset',
    title: 'Public statistics',
    subtitle: 'Views and time spent per page, clicks per link and per button. Data from your browser + the repository baseline.',
    source_local: 'Source: this browser',
    source_merged: 'Source: browser + baseline',
    updated: 'Updated: —',
    pages_count: 'Tracked pages: —',
    kpi_views: 'Total views',
    kpi_clicks: 'Total clicks',
    kpi_duration: 'Total duration',
    kpi_avg: 'Average time / page',
    kpi_top: 'Most viewed page',
    chart_views: 'View mountains',
    chart_views_hint: 'Height = number of views',
    chart_duration: 'View-duration mountains',
    chart_duration_hint: 'Height = time spent on the page',
    loading: 'Loading 3D…',
    legend_low: 'Low',
    legend_mid: 'Medium',
    legend_high: 'High',
    scene_hint: 'Drag to rotate · scroll to zoom · hover a mountain for details',
    pages_title: 'Tracked pages',
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
    how_title: 'How are these numbers produced?',
    how_1: 'Each visited page records a view, the time spent on it and every click on a link or a button.',
    how_2: 'Metrics are stored locally (localStorage): they reflect your browsing in this browser, and a baseline is versioned in the repository.',
    how_3: 'A JSON export lets you consolidate several browsers: import the file on the other machine to merge totals.',
    how_4: 'The same events are sent to Google Analytics when the tag is present on the page.',
    footer: 'KeffStation — public statistics',
    no_data: 'No data — visit a few pages then come back here.',
    link: 'Link',
    button: 'Button',
    fallback: '3D unavailable (CDN blocked) — fallback 2D view',
    reset_done: 'Local data reset.',
    import_done: 'Data imported and merged.',
    import_error: 'Invalid file.',
    views: 'views',
    clicks: 'clicks'
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

function pageLabel(path) {
  return PAGE_LABELS[path] || path;
}

/* ---------------- Sources de données ---------------- */

const STORE_KEY = 'keffstation_stats_v1';

function readLocal() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
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

let imported = null; // données fusionnées via import JSON
let seed = null;     // base de référence versionnée

function merge(seedData) {
  const src = seedData !== undefined ? seedData : seed;
  const pages = {};
  const links = {};
  const buttons = {};

  const addPage = (path, rec) => {
    if (!path) return;
    const p = pages[path] || { path, label: pageLabel(path), views: 0, clicks: 0, duration: 0, sessions: 0, local: false, seeded: false };
    p.views += Number(rec.views || 0);
    p.clicks += Number(rec.clicks || 0);
    p.duration += Number(rec.duration || 0);
    p.sessions += Number(rec.sessions || 0);
    if (rec.local) p.local = true;
    if (rec.seeded) p.seeded = true;
    pages[path] = p;
  };

  const addHit = (bucket, key, rec, kind) => {
    if (!key) return;
    const item = bucket[key] || { key, kind, label: rec.label || '', target: rec.target || rec.href || '', page: rec.page || '', count: 0, local: false, seeded: false };
    item.count += Number(rec.count || 0);
    if (rec.local) item.local = true;
    if (rec.seeded) item.seeded = true;
    if (!item.label && rec.label) item.label = rec.label;
    bucket[key] = item;
  };

  if (src) {
    Object.keys(src.pages || {}).forEach((path) => {
      addPage(path, Object.assign({}, src.pages[path], { seeded: true }));
    });
    Object.keys(src.links || {}).forEach((k) => {
      addHit(links, k, Object.assign({}, src.links[k], { seeded: true }), 'link');
    });
    Object.keys(src.buttons || {}).forEach((k) => {
      addHit(buttons, k, Object.assign({}, src.buttons[k], { seeded: true }), 'button');
    });
  }

  const sources = [readLocal(), imported].filter(Boolean);
  sources.forEach((src) => {
    Object.keys(src.pages || {}).forEach((path) => {
      addPage(path, Object.assign({}, src.pages[path], { local: true }));
    });
    Object.keys(src.links || {}).forEach((k) => {
      addHit(links, k, Object.assign({}, src.links[k], { local: true }), 'link');
    });
    Object.keys(src.buttons || {}).forEach((k) => {
      addHit(buttons, k, Object.assign({}, src.buttons[k], { local: true }), 'button');
    });
  });

  const pageList = Object.values(pages)
    .map((p) => ({
      path: p.path,
      label: p.label || pageLabel(p.path),
      views: p.views,
      clicks: p.clicks,
      duration: p.duration,
      sessions: p.sessions,
      avg: p.views > 0 ? Math.round(p.duration / p.views) : 0,
      local: p.local,
      seeded: p.seeded
    }))
    .filter((p) => p.views > 0 || p.clicks > 0 || p.duration > 0);

  const hitList = []
    .concat(Object.values(links).map((x) => Object.assign({ kind: 'link' }, x)))
    .concat(Object.values(buttons).map((x) => Object.assign({ kind: 'button' }, x)))
    .map((x) => ({
      kind: x.kind,
      label: x.label || '(sans libellé)',
      target: x.target || '',
      page: x.page || '',
      count: x.count,
      local: x.local,
      seeded: x.seeded
    }))
    .sort((a, b) => b.count - a.count);

  const totals = pageList.reduce((acc, p) => {
    acc.views += p.views;
    acc.clicks += p.clicks;
    acc.duration += p.duration;
    return acc;
  }, { views: 0, clicks: 0, duration: 0 });

  const local = readLocal();

  return {
    pages: pageList,
    hits: hitList,
    totals,
    updated: (local && local.updated) || (src && src.generated) || null,
    hasLocal: !!local && Object.keys(local.pages || {}).length > 0,
    hasSeed: !!src && Object.keys(src.pages || {}).length > 0
  };
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

/* ---------------- Rendu des tableaux ---------------- */

let sortKey = 'views';
let filterKey = 'all';
let currentData = null;

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
    tbody.appendChild(tr);
  });
}

function renderHits(data) {
  const tbody = document.getElementById('clicksBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  let rows = data.hits;
  if (filterKey === 'links') rows = rows.filter((r) => r.kind === 'link');
  if (filterKey === 'buttons') rows = rows.filter((r) => r.kind === 'button');

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty">${escapeHtml(T[lang].no_data)}</td></tr>`;
    return;
  }

  const max = Math.max(...rows.map((r) => r.count || 0), 1);

  rows.forEach((r) => {
    const tr = document.createElement('tr');
    const share = Math.round(((r.count || 0) / max) * 100);
    tr.innerHTML = `
      <td><span class="tag ${r.kind}">${escapeHtml(r.kind === 'link' ? T[lang].link : T[lang].button)}</span></td>
      <td><div class="cell-main">${escapeHtml(r.label)}</div></td>
      <td><div class="cell-sub">${escapeHtml(r.target || '—')}</div></td>
      <td><div class="cell-sub">${escapeHtml(pageLabel(r.page))}</div></td>
      <td class="num">${fmtInt(r.count)}</td>
      <td class="bar-col"><div class="bar d"><i style="width:${share}%"></i></div></td>`;
    tbody.appendChild(tr);
  });
}

function renderKpis(data) {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('kpiViews', fmtInt(data.totals.views));
  set('kpiClicks', fmtInt(data.totals.clicks));
  set('kpiDuration', fmtDuration(data.totals.duration));
  set('kpiAvg', fmtDuration(data.pages.length ? data.totals.duration / data.pages.length : 0));

  const top = data.pages.slice().sort((a, b) => b.views - a.views)[0];
  set('kpiTop', top ? top.label : '—');

  const badge = document.getElementById('badgeSource');
  if (badge) badge.textContent = data.hasLocal && data.hasSeed ? T[lang].source_merged : (data.hasSeed ? T[lang].source_merged : T[lang].source_local);

  const upd = document.getElementById('badgeUpdated');
  if (upd) {
    let d = data.updated;
    if (d) {
      const dt = new Date(d);
      upd.textContent = `${T[lang].updated.replace('—', '')} ${dt.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')}`;
    }
  }

  const pagesBadge = document.getElementById('badgePages');
  if (pagesBadge) pagesBadge.textContent = `${T[lang].pages_count.replace('—', '')} ${data.pages.length}`;
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
  const res = 36;
  const geo = new THREE.PlaneGeometry(w, d, res, res);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colors = [];
  for (let y = 0; y <= res; y++) {
    for (let x = 0; x <= res; x++) {
      const u = x / res;
      const v = y / res;
      const n1 = Math.sin(u * 4 * Math.PI) * Math.cos(v * 4 * Math.PI);
      const n2 = Math.sin(u * 7 * Math.PI + 1.3) * Math.cos(v * 5 * Math.PI + 2.1) * 0.6;
      const n3 = Math.sin(u * 11 * Math.PI - 0.8) * 0.35;
      let hh = (n1 + n2 + n3) / 2 + 0.5;
      hh = Math.pow(Math.max(hh, 0), 1.35) * h;
      pos.setZ(x * (w / res) - w / 2, y * (d / res) - d / 2, hh);
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
    this.items = [];
    this.meshes = [];
    this.hovered = null;
    this.autoRotate = true;
    this.idleTimer = 0;

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

    const grid = new THREE.GridHelper(80, 40, 0x1b2440, 0x0d1226);
    this.scene.add(grid);

    // caméra orbitale maison (pas de dépendance OrbitControls)
    this.yaw = Math.PI * 0.25;
    this.pitch = 0.62;
    this.dist = 26;
    this.target = new THREE.Vector3(0, 2.2, 0);

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    const el = this.renderer.domElement;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    el.addEventListener('pointerdown', (e) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
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
        this.autoRotate = false;
        clearTimeout(this.idleTimer);
        this.idleTimer = setTimeout(() => { this.autoRotate = true; }, 4000);
      }
    });

    const stop = (e) => {
      dragging = false;
      if (el.hasPointerCapture && e && e.pointerId != null && el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }
    };
    el.addEventListener('pointerup', stop);
    el.addEventListener('pointercancel', stop);
    el.addEventListener('pointerleave', () => { this.hideTooltip(); });

    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.dist = Math.max(10, Math.min(70, this.dist * (1 + e.deltaY * 0.0012)));
    }, { passive: false });

    el.addEventListener('click', () => {
      if (this.hovered && this.hovered.path) focusRow(this.hovered.path);
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

  setItems(items) {
    const THREE = this.THREE;
    this.items = items || [];
    this.meshes = [];

    while (this.group.children.length) {
      const child = this.group.children.pop();
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    }

    if (!this.items.length) return;

    const metric = this.opts.metric || 'views';
    const values = this.items.map((it) => Number(it[metric] || 0));
    const maxValue = Math.max(...values, 1);
    const maxClicks = Math.max(...this.items.map((it) => Number(it.clicks || 0)), 1);
    const maxDur = Math.max(...this.items.map((it) => Number(it.duration || 0)), 1);

    const cols = Math.min(3, Math.max(1, Math.ceil(Math.sqrt(this.items.length))));
    const spacing = 9;

    this.items.forEach((item, i) => {
      const value = Number(item[metric] || 0);
      const norm = value / maxValue;
      const h = 1.1 + Math.sqrt(norm) * 5.6;
      const w = 2.6 + Math.sqrt(Number(item.clicks || 0) / maxClicks) * 1.8;
      const d = 2.6 + Math.sqrt(Number(item.duration || 0) / maxDur) * 1.5;

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

    // recentrage caméra sur l'ensemble
    const rows = Math.ceil(this.items.length / cols);
    this.target.set(0, 1.8, 0);
    this.dist = Math.max(16, Math.min(46, 12 + rows * 6));
  }

  hideTooltip() {
    const tip = document.getElementById('tooltip');
    if (tip) tip.hidden = true;
    this.hovered = null;
  }

  showTooltip(item, x, y) {
    const tip = document.getElementById('tooltip');
    if (!tip) return;
    const metric = this.opts.metric || 'views';
    const value = item[metric] || 0;
    const valueLabel = metric === 'duration' ? fmtDuration(value) : fmtInt(value);
    tip.innerHTML = `
      <div class="tt-title">${escapeHtml(item.label)}</div>
      <div class="tt-row"><span>${escapeHtml(this.opts.titleKey === 'duration' ? T[lang].kpi_duration : T[lang].kpi_views)}</span><b>${valueLabel}</b></div>
      <div class="tt-row"><span>${escapeHtml(T[lang].kpi_clicks)}</span><b>${fmtInt(item.clicks)}</b></div>
      <div class="tt-row"><span>${escapeHtml(T[lang].kpi_duration)}</span><b>${fmtDuration(item.duration)}</b></div>
      <div class="tt-row"><span>${escapeHtml(T[lang].kpi_avg)}</span><b>${fmtDuration(item.avg)}</b></div>`;
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
    const THREE = this.THREE;

    if (this.autoRotate) this.yaw += 0.0018;

    const r = this.dist;
    this.camera.position.set(
      this.target.x + r * Math.cos(this.pitch) * Math.sin(this.yaw),
      this.target.y + r * Math.sin(this.pitch),
      this.target.z + r * Math.cos(this.pitch) * Math.cos(this.yaw)
    );
    this.camera.lookAt(this.target);

    // survol
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

function fallback2d(container, items, metric) {
  container.innerHTML = '';
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const W = container.clientWidth || 600;
  const H = container.clientHeight || 380;
  canvas.width = W * (window.devicePixelRatio || 1);
  canvas.height = H * (window.devicePixelRatio || 1);
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);
  ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

  const max = Math.max(...items.map((i) => Number(i[metric] || 0)), 1);
  const pad = 34;
  const bw = Math.max(12, (W - pad * 2) / Math.max(items.length, 1) - 14);

  ctx.fillStyle = '#05070f';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,.08)';
  ctx.strokeRect(pad, 20, W - pad * 2, H - 60);

  items.forEach((it, i) => {
    const v = Number(it[metric] || 0);
    const h = Math.max(4, ((H - 100) * v) / max);
    const x = pad + 14 + i * ((W - pad * 2) / Math.max(items.length, 1));
    const grad = ctx.createLinearGradient(0, H - 40 - h, 0, H - 40);
    grad.addColorStop(0, metric === 'duration' ? '#fb7185' : '#22d3ee');
    grad.addColorStop(1, metric === 'duration' ? '#f59e0b' : '#8a4dff');
    ctx.fillStyle = grad;
    ctx.fillRect(x, H - 40 - h, bw, h);
    ctx.fillStyle = 'rgba(255,255,255,.75)';
    ctx.font = '600 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(it.label.slice(0, 14), x + bw / 2, H - 22);
    ctx.fillStyle = 'rgba(255,255,255,.5)';
    ctx.fillText(metric === 'duration' ? fmtDuration(v) : fmtInt(v), x + bw / 2, H - 44 - h);
  });

  const note = document.createElement('div');
  note.className = 'scene-loading scene-error';
  note.textContent = T[lang].fallback;
  container.appendChild(note);
}

/* ---------------- Focus ligne du tableau ---------------- */

function focusRow(path) {
  const rows = document.querySelectorAll('#pagesBody tr');
  rows.forEach((tr) => {
    tr.classList.remove('flash');
    if (tr.dataset.path === path) {
      tr.classList.add('flash');
      tr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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
    note: 'Export KeffStation — statistiques publiques',
    pages: {},
    links: {},
    buttons: {}
  };
  data.pages.forEach((p) => {
    payload.pages[p.path] = { label: p.label, views: p.views, clicks: p.clicks, duration: p.duration, sessions: p.sessions };
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

let chartViews = null;
let chartDuration = null;

function render() {
  currentData = merge();
  renderKpis(currentData);
  renderPages(currentData);
  renderHits(currentData);

  if (chartViews) chartViews.setItems(currentData.pages);
  if (chartDuration) chartDuration.setItems(currentData.pages);
}

/* ---------------- Amorçage ---------------- */

async function boot() {
  applyLang();

  try {
    const res = await fetch('data/stats.json', { cache: 'no-store' });
    if (res.ok) seed = await res.json();
  } catch (e) { seed = null; }

  render();

  // Filtres et tris
  document.querySelectorAll('[data-sort]').forEach((btn) => {
    btn.addEventListener('click', () => {
      sortKey = btn.getAttribute('data-sort');
      document.querySelectorAll('[data-sort]').forEach((b) => b.classList.toggle('active', b === btn));
      renderPages(currentData);
    });
  });

  document.querySelectorAll('[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      filterKey = btn.getAttribute('data-filter');
      document.querySelectorAll('[data-filter]').forEach((b) => b.classList.toggle('active', b === btn));
      renderHits(currentData);
    });
  });

  const btnLang = document.getElementById('btnLang');
  if (btnLang) {
    btnLang.addEventListener('click', () => {
      lang = lang === 'fr' ? 'en' : 'fr';
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
      applyLang();
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
      try { localStorage.removeItem(STORE_KEY); } catch (e) {}
      imported = null;
      render();
      toast(T[lang].reset_done);
    });
  }

  // 3D
  const THREE = await loadThree();
  const cViews = document.getElementById('sceneViews');
  const cDuration = document.getElementById('sceneDuration');

  if (!THREE) {
    [cViews, cDuration].forEach((c) => {
      if (!c) return;
      c.innerHTML = '';
      fallback2d(c, currentData.pages, c === cViews ? 'views' : 'duration');
    });
    return;
  }

  [cViews, cDuration].forEach((c) => { if (c) c.innerHTML = ''; });

  try {
    chartViews = new MountainChart(cViews, THREE, {
      metric: 'views',
      hue: { h0: 0.52, h1: 0.76, s: 0.85, l0: 0.34, l1: 0.62 },
      keyColor: 0x00d4ff,
      rimColor: 0x8a4dff,
      titleKey: 'views'
    });

    chartDuration = new MountainChart(cDuration, THREE, {
      metric: 'duration',
      hue: { h0: 0.06, h1: 0.95, s: 0.9, l0: 0.38, l1: 0.62 },
      keyColor: 0xf59e0b,
      rimColor: 0xff3d9a,
      titleKey: 'duration'
    });

    chartViews.setItems(currentData.pages);
    chartDuration.setItems(currentData.pages);
  } catch (e) {
    // WebGL indisponible (pilote, navigateur, machine) : repli 2D
    chartViews = null;
    chartDuration = null;
    [cViews, cDuration].forEach((c) => {
      if (!c) return;
      c.innerHTML = '';
      fallback2d(c, currentData.pages, c === cViews ? 'views' : 'duration');
    });
  }
}

// Démarrage (promesse exposée pour les intégrations : window.KeffStatsReady)
window.KeffStatsReady = boot().then(() => {
  document.dispatchEvent(new CustomEvent('ks-stats-ready'));
  return true;
});
