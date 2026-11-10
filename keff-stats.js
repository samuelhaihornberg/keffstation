/* =============================================================
   KeffStation — Suivi public (vues, durée, clics liens/boutons)
   -------------------------------------------------------------
   - Aucune dépendance, aucun envoi réseau obligatoire.
   - Stockage local (localStorage) par navigateur.
   - Les données sont aussi poussées vers Google Analytics (gtag)
     si le tag est présent sur la page.
   - Opt-out sur un élément : data-ks-track="off"
   - API publique : window.KeffStats
   ============================================================= */
(function () {
  'use strict';

  var STORAGE_KEY = 'keffstation_stats_v1';
  var HEARTBEAT_MS = 5000;

  /* ---------- Racine du dépôt (chemin relatif stable) ---------- */
  function repoBasePath() {
    var el = document.querySelector('script[src*="keff-stats.js"]');
    if (!el || !el.src) return null;
    try {
      var u = new URL(el.src, location.href);
      return u.pathname.replace(/[^/]*$/, '');
    } catch (e) { return null; }
  }

  var BASE_PATH = repoBasePath();

  function currentPath() {
    var p = location.pathname;
    if (BASE_PATH && p.indexOf(BASE_PATH) === 0) p = p.slice(BASE_PATH.length);
    p = p.replace(/^\/+/, '');
    if (p === '' || p === 'index.html') p = 'index.html';
    if (p.charAt(p.length - 1) === '/') p += 'index.html';
    return p;
  }

  /* ---------- Stockage ---------- */
  function emptyStore() {
    return { version: 1, updated: null, pages: {}, links: {}, buttons: {} };
  }

  function readStore() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyStore();
      var data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return emptyStore();
      data.pages = data.pages || {};
      data.links = data.links || {};
      data.buttons = data.buttons || {};
      return data;
    } catch (e) { return emptyStore(); }
  }

  function writeStore(data) {
    try {
      data.updated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* mode privé / quota : on ignore */ }
  }

  /* ---------- Identité d'un élément cliquable ---------- */
  function labelOf(el) {
    var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!t) t = el.getAttribute('aria-label') || '';
    if (!t) t = el.getAttribute('title') || '';
    if (!t) t = el.getAttribute('data-i18n') || '';
    if (!t) t = el.id || el.tagName.toLowerCase();
    return t.slice(0, 80);
  }

  function targetOf(el) {
    if (!el) return '';
    if (el.tagName === 'A') return el.getAttribute('href') || '';
    return el.getAttribute('data-href') || (el.id ? '#' + el.id : '');
  }

  function shortTarget(t) {
    if (!t) return '';
    try {
      var u = new URL(t, location.href);
      var p = u.pathname;
      if (BASE_PATH && p.indexOf(BASE_PATH) === 0) p = p.slice(BASE_PATH.length);
      p = p.replace(/^\/+/, '');
      if (p.length > 1 && p.charAt(p.length - 1) === '/') p += 'index.html';
      return p + (u.search || '') + (u.hash || '');
    } catch (e) { return String(t).slice(0, 60); }
  }

  /* ---------- Suivi de la page courante ---------- */
  var page = currentPath();
  var store = readStore();
  var pg = store.pages[page];
  if (!pg) {
    pg = { views: 0, clicks: 0, duration: 0, sessions: 0 };
    store.pages[page] = pg;
  }
  pg.views = (pg.views || 0) + 1;
  pg.sessions = (pg.sessions || 0) + 1;
  writeStore(store);

  function sendGtag(name, params) {
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
    } catch (e) { /* ignore */ }
  }

  sendGtag('keff_page_view', {
    page_path: page,
    page_location: location.href,
    page_title: document.title
  });

  /* ---------- Durée de consultation ---------- */
  var started = Date.now();

  function flushDuration() {
    var elapsed = Math.round((Date.now() - started) / 1000);
    if (elapsed <= 0) return;
    var s = readStore();
    if (s.pages[page]) {
      s.pages[page].duration = (s.pages[page].duration || 0) + elapsed;
      s.pages[page]._last = elapsed;
    }
    writeStore(s);
    sendGtag('keff_engagement', { page_path: page, engagement_time_msec: elapsed * 1000 });
    started = Date.now();
  }

  try { setInterval(flushDuration, HEARTBEAT_MS); } catch (e) { /* ignore */ }
  window.addEventListener('pagehide', flushDuration);
  window.addEventListener('beforeunload', flushDuration);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) flushDuration();
    else started = Date.now();
  });

  /* ---------- Clics : liens et boutons ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target;
    if (!el || !el.closest) return;
    if (el.closest('[data-ks-track="off"]')) return;

    var link = el.closest('a[href]');
    var btn = link ? null : el.closest('button, [role="button"], input[type="button"], input[type="submit"]');
    if (!link && !btn) return;

    var s = readStore();
    var label = labelOf(link || btn);
    var target = targetOf(link || btn);

    if (link) {
      var key = page + '||' + label + '|' + target;
      var rec = s.links[key] || { label: label, href: target, target: shortTarget(target), page: page, count: 0 };
      rec.count += 1;
      s.links[key] = rec;
    } else {
      var key2 = page + '||' + label;
      var rec2 = s.buttons[key2] || { label: label, target: target, page: page, count: 0 };
      rec2.count += 1;
      s.buttons[key2] = rec2;
    }

    if (s.pages[page]) s.pages[page].clicks = (s.pages[page].clicks || 0) + 1;
    writeStore(s);

    sendGtag(link ? 'keff_link_click' : 'keff_button_click', {
      page_path: page,
      link_label: label,
      link_url: target
    });
  }, true);

  /* ---------- API publique ---------- */
  window.KeffStats = {
    storageKey: STORAGE_KEY,
    page: page,
    get: readStore,
    reset: function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    },
    export: function () { return JSON.stringify(readStore(), null, 2); }
  };
})();
