(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const TYPE_LABELS = {
    link: "Lien",
    button: "Bouton",
    tab: "Onglet",
    menu: "Menu"
  };

  const BASE = {
    visits: 1842,
    clicks: 3271,
    formsStarted: 113,
    searches: 412,
    gsc: {
      clicks: 1280,
      impressions: 48200,
      position: 12.4,
      queries: [
        { query: "keffstation", clicks: 320, impressions: 8200, position: 4.2 },
        { query: "boutique keffstation", clicks: 180, impressions: 5200, position: 6.1 },
        { query: "livraison", clicks: 120, impressions: 6800, position: 18.2 },
        { query: "paiement sécurisé", clicks: 90, impressions: 4100, position: 14.8 },
        { query: "kiffstation", clicks: 70, impressions: 2600, position: 5.4 }
      ]
    },
    topClicks: [
      { label: "Découvrir la boutique", type: "button", page: "/", count: 842 },
      { label: "Voir les offres", type: "link", page: "/offres", count: 611 },
      { label: "Services", type: "tab", page: "/services", count: 488 },
      { label: "Ouvrir le menu", type: "menu", page: "/", count: 397 },
      { label: "Ajouter au panier", type: "button", page: "/boutique", count: 321 },
      { label: "Contact", type: "link", page: "/contact", count: 214 }
    ],
    searchTop: [
      { query: "livraison", results: 12, clicks: 84, zero: false },
      { query: "prix", results: 8, clicks: 63, zero: false },
      { query: "paiement", results: 15, clicks: 58, zero: false },
      { query: "retour", results: 4, clicks: 41, zero: false },
      { query: "horaires", results: 2, clicks: 33, zero: true },
      { query: "caisse", results: 6, clicks: 28, zero: false }
    ]
  };

  const FORM_DEFS = [
    { name: "Contact", share: 0.37 },
    { name: "Newsletter", share: 0.25 },
    { name: "Devis", share: 0.16 },
    { name: "Commande", share: 0.22 }
  ];

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);

  const state = {
    mode: "preset",
    days: 7,
    start: null,
    end: null,
    data: null
  };

  const nf = new Intl.NumberFormat("fr-FR");
  const nf1 = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });
  const nf2 = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function signedPct(value) {
    return `${value >= 0 ? "+" : "−"}${nf1.format(Math.abs(value))} %`;
  }

  function signedPts(value) {
    return `${value >= 0 ? "+" : "−"}${nf1.format(Math.abs(value))} pts`;
  }

  function addDays(date, delta) {
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    return d;
  }

  function toInputValue(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function parseInputDate(value) {
    if (!value) return null;
    const [y, m, d] = value.split("-").map(Number);
    if (!y || !m || !d) return null;
    const date = new Date(y, m - 1, d, 12, 0, 0);
    if (Number.isNaN(date.getTime())) return null;
    return date;
  }

  function formatShort(date) {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short"
    }).format(date);
  }

  function formatTime(date) {
    return new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function buildForms(totalStarted, successRate) {
    let remaining = totalStarted;
    return FORM_DEFS.map((def, index) => {
      const isLast = index === FORM_DEFS.length - 1;
      const started = isLast
        ? remaining
        : Math.round(totalStarted * def.share);
      remaining -= started;
      const submitted = Math.round((started * successRate) / 100);
      const errors = Math.round((started * (100 - successRate) * 0.45) / 100);
      return {
        name: def.name,
        started,
        submitted,
        errors
      };
    });
  }

  function buildReliability(days) {
    const t = Math.pow(clamp((days - 7) / 23, 0, 1), 0.4);
    const uptime = lerp(99.9, 99.7, t);
    const formSuccess = 85;
    const paymentSuccess = lerp(90, 84, t);
    const errorScore = lerp(93, 88, t);
    const freshness = lerp(80, 67, t);
    const score = Math.round(
      0.3 * uptime +
        0.2 * formSuccess +
        0.2 * paymentSuccess +
        0.15 * errorScore +
        0.15 * freshness
    );
    return {
      uptime,
      formSuccess,
      paymentSuccess,
      errorScore,
      freshness,
      score
    };
  }

  function buildClicksByType(total) {
    const link = Math.round(total * 0.46);
    const button = Math.round(total * 0.34);
    const tab = Math.round(total * 0.12);
    const menu = total - link - button - tab;
    return { link, button, tab, menu };
  }

  function buildData() {
    const days = state.days;
    const end = state.mode === "custom" ? state.end : today;
    const start =
      state.mode === "custom" ? state.start : addDays(today, -(days - 1));
    const scale = days / 7;
    const reliability = buildReliability(days);

    const formsStarted = Math.max(1, Math.round(BASE.formsStarted * scale));
    const forms = buildForms(formsStarted, reliability.formSuccess);
    const formsSubmitted = forms.reduce((sum, form) => sum + form.submitted, 0);
    const formErrors = forms.reduce((sum, form) => sum + form.errors, 0);

    const visits = Math.round(BASE.visits * scale);
    const clicks = Math.round(BASE.clicks * scale);
    const searches = Math.round(BASE.searches * scale);
    const clicksByType = buildClicksByType(clicks);

    const topClicks = BASE.topClicks.map((item) => ({
      ...item,
      count: Math.round(item.count * scale)
    }));

    const searchTop = BASE.searchTop.map((item) => ({
      ...item,
      clicks: Math.round(item.clicks * scale)
    }));

    const gscClicks = Math.round(BASE.gsc.clicks * scale);
    const gscImpressions = Math.round(BASE.gsc.impressions * scale);
    const gscCtr = gscImpressions ? (gscClicks / gscImpressions) * 100 : 0;
    const gscQueries = BASE.gsc.queries.map((item) => {
      const clicks = Math.round(item.clicks * scale);
      const impressions = Math.round(item.impressions * scale);
      return {
        ...item,
        clicks,
        impressions,
        ctr: impressions ? (clicks / impressions) * 100 : 0
      };
    });

    const tDelta = clamp((days - 7) / 23, 0, 1);
    const visitsDelta = lerp(12.4, 4.8, tDelta);
    const clicksDelta = lerp(8.1, 3.2, tDelta);
    const formsDelta = lerp(4.2, 1.2, tDelta);
    const searchesDelta = lerp(-2.3, 0.8, tDelta);

    const scoreDelta =
      days === 7
        ? 2.4
        : days === 10
          ? 1.1
          : days === 30
            ? -0.6
            : days <= 10
              ? 1.4
              : 0.4;

    const previousScore = reliability.score - scoreDelta;
    const periodLabel =
      state.mode === "custom"
        ? `du ${formatShort(start)} au ${formatShort(end)}`
        : `${days} derniers jours`;

    const alerts = [
      {
        type: "warn",
        title: "Erreurs de formulaire au-dessus du seuil",
        detail: `${formErrors} erreurs techniques · il y a 2 h`
      },
      {
        type: "ok",
        title: "Certificat SSL valide",
        detail: "Expire dans 68 jours"
      },
      {
        type: "info",
        title: "GSC synchronisé",
        detail: "Dernière synchronisation il y a 6 h · données différées"
      },
      {
        type: "ok",
        title: "PayPal Sandbox opérationnel",
        detail: "Dernier test de refus réussi"
      }
    ];

    return {
      days,
      start,
      end,
      periodLabel,
      updatedLabel: `Mis à jour à ${formatTime(now)}`,
      ...reliability,
      previousScore,
      scoreDelta,
      visits,
      visitsDelta,
      clicks,
      clicksDelta,
      formsStarted,
      formsSubmitted,
      formsDelta,
      formErrors,
      forms,
      searches,
      searchesDelta,
      clicksByType,
      topClicks,
      searchTop,
      gsc: {
        clicks: gscClicks,
        impressions: gscImpressions,
        ctr: gscCtr,
        position: BASE.gsc.position,
        queries: gscQueries
      },
      alerts
    };
  }

  function setText(id, text) {
    const el = $(id);
    if (el) el.textContent = text;
  }

  function setDeltaClass(id, value) {
    const el = $(id);
    if (!el) return;
    el.classList.toggle("up", value >= 0);
    el.classList.toggle("down", value < 0);
  }

  function makeTypeBadge(type) {
    const span = document.createElement("span");
    span.className = `type-badge ${type}`;
    span.textContent = TYPE_LABELS[type] || type;
    return span;
  }

  function renderHero(data) {
    setText("score-value", String(data.score));
    setText(
      "score-delta",
      `${signedPts(data.scoreDelta)} vs période précédente`
    );
    const delta = $("score-delta");
    if (delta) delta.classList.toggle("negative", data.scoreDelta < 0);
    setText("period-label", data.periodLabel);
    setText("updated-label", data.updatedLabel);
  }

  function renderMetrics(data) {
    setText("metric-visits", nf.format(data.visits));
    setText("delta-visits", signedPct(data.visitsDelta));
    setDeltaClass("delta-visits", data.visitsDelta);

    setText("metric-clicks", nf.format(data.clicks));
    setText("delta-clicks", signedPct(data.clicksDelta));
    setDeltaClass("delta-clicks", data.clicksDelta);

    setText("metric-forms", nf.format(data.formsSubmitted));
    setText("delta-forms", signedPct(data.formsDelta));
    setDeltaClass("delta-forms", data.formsDelta);

    setText("metric-searches", nf.format(data.searches));
    setText("delta-searches", signedPct(data.searchesDelta));
    setDeltaClass("delta-searches", data.searchesDelta);
  }

  function renderFallback(data) {
    const rows = [
      ["Visites", nf.format(data.visits)],
      ["Clics", nf.format(data.clicks)],
      ["Formulaires envoyés", nf.format(data.formsSubmitted)],
      ["Recherches internes", nf.format(data.searches)],
      ["Score de fiabilité", `${data.score}/100`],
      ["Taux de succès formulaires", `${nf1.format(data.formSuccess)} %`],
      ["Disponibilité", `${nf1.format(data.uptime)} %`],
      ["Période", data.periodLabel]
    ];
    const tbody = $("fallback-body");
    if (!tbody) return;
    tbody.replaceChildren();
    rows.forEach(([label, value]) => {
      const tr = document.createElement("tr");
      const tdLabel = document.createElement("td");
      tdLabel.textContent = label;
      const tdValue = document.createElement("td");
      tdValue.className = "num";
      tdValue.textContent = value;
      tr.append(tdLabel, tdValue);
      tbody.append(tr);
    });
  }

  function renderTopClicks(data) {
    const tbody = $("top-clicks-body");
    if (!tbody) return;
    tbody.replaceChildren();
    data.topClicks.slice(0, 5).forEach((item) => {
      const tr = document.createElement("tr");
      const tdLabel = document.createElement("td");
      tdLabel.textContent = item.label;
      const tdType = document.createElement("td");
      tdType.append(makeTypeBadge(item.type));
      const tdCount = document.createElement("td");
      tdCount.className = "num";
      tdCount.textContent = nf.format(item.count);
      tr.append(tdLabel, tdType, tdCount);
      tbody.append(tr);
    });
  }

  function renderAlerts(data) {
    const list = $("alerts-list");
    if (!list) return;
    list.replaceChildren();
    data.alerts.forEach((alert) => {
      const li = document.createElement("li");
      const dot = document.createElement("span");
      dot.className = `alert-dot ${alert.type}`;
      dot.setAttribute("aria-hidden", "true");
      const body = document.createElement("div");
      const strong = document.createElement("strong");
      strong.textContent = alert.title;
      const detail = document.createElement("span");
      detail.textContent = alert.detail;
      body.append(strong, detail);
      li.append(dot, body);
      list.append(li);
    });
  }

  function renderClicks(data) {
    setText("click-type-links", nf.format(data.clicksByType.link));
    setText("click-type-buttons", nf.format(data.clicksByType.button));
    setText("click-type-tabs", nf.format(data.clicksByType.tab));
    setText("click-type-menus", nf.format(data.clicksByType.menu));

    const tbody = $("clicks-table-body");
    if (!tbody) return;
    tbody.replaceChildren();
    data.topClicks.forEach((item) => {
      const tr = document.createElement("tr");
      const tdLabel = document.createElement("td");
      tdLabel.textContent = item.label;
      const tdType = document.createElement("td");
      tdType.append(makeTypeBadge(item.type));
      const tdPage = document.createElement("td");
      tdPage.textContent = item.page;
      const tdCount = document.createElement("td");
      tdCount.className = "num";
      tdCount.textContent = nf.format(item.count);
      tr.append(tdLabel, tdType, tdPage, tdCount);
      tbody.append(tr);
    });
  }

  function renderForms(data) {
    const tbody = $("forms-table-body");
    if (!tbody) return;
    tbody.replaceChildren();
    data.forms.forEach((form) => {
      const rate = form.started
        ? (form.submitted / form.started) * 100
        : 0;
      const tr = document.createElement("tr");
      const tdName = document.createElement("td");
      tdName.textContent = form.name;
      const tdStarted = document.createElement("td");
      tdStarted.className = "num";
      tdStarted.textContent = nf.format(form.started);
      const tdSubmitted = document.createElement("td");
      tdSubmitted.className = "num";
      tdSubmitted.textContent = nf.format(form.submitted);
      const tdRate = document.createElement("td");
      tdRate.className = "num";
      tdRate.textContent = `${nf1.format(rate)} %`;
      const tdErrors = document.createElement("td");
      tdErrors.className = "num";
      tdErrors.textContent = nf.format(form.errors);
      tr.append(tdName, tdStarted, tdSubmitted, tdRate, tdErrors);
      tbody.append(tr);
    });
  }

  function renderSearches(data) {
    const tbody = $("searches-table-body");
    if (!tbody) return;
    tbody.replaceChildren();
    data.searchTop.forEach((item) => {
      const tr = document.createElement("tr");
      const tdQuery = document.createElement("td");
      tdQuery.textContent = item.query;
      const tdResults = document.createElement("td");
      tdResults.className = "num";
      tdResults.textContent = nf.format(item.results);
      const tdClicks = document.createElement("td");
      tdClicks.className = "num";
      tdClicks.textContent = nf.format(item.clicks);
      const tdZero = document.createElement("td");
      tdZero.className = "num";
      tdZero.textContent = item.zero ? "Oui" : "Non";
      tr.append(tdQuery, tdResults, tdClicks, tdZero);
      tbody.append(tr);
    });
  }

  function renderGSC(data) {
    setText("gsc-clicks", nf.format(data.gsc.clicks));
    setText("gsc-impressions", nf.format(data.gsc.impressions));
    setText("gsc-ctr", `${nf2.format(data.gsc.ctr)} %`);
    setText("gsc-position", nf1.format(data.gsc.position));

    const tbody = $("gsc-table-body");
    if (!tbody) return;
    tbody.replaceChildren();
    data.gsc.queries.forEach((item) => {
      const tr = document.createElement("tr");
      const tdQuery = document.createElement("td");
      tdQuery.textContent = item.query;
      const tdClicks = document.createElement("td");
      tdClicks.className = "num";
      tdClicks.textContent = nf.format(item.clicks);
      const tdImpressions = document.createElement("td");
      tdImpressions.className = "num";
      tdImpressions.textContent = nf.format(item.impressions);
      const tdCtr = document.createElement("td");
      tdCtr.className = "num";
      tdCtr.textContent = `${nf2.format(item.ctr)} %`;
      const tdPosition = document.createElement("td");
      tdPosition.className = "num";
      tdPosition.textContent = nf1.format(item.position);
      tr.append(tdQuery, tdClicks, tdImpressions, tdCtr, tdPosition);
      tbody.append(tr);
    });
  }

  function renderReliability(data) {
    setText("rel-score-badge", `${data.score}/100`);
    const components = [
      ["uptime", data.uptime],
      ["form", data.formSuccess],
      ["payment", data.paymentSuccess],
      ["error", data.errorScore],
      ["fresh", data.freshness]
    ];
    components.forEach(([key, value]) => {
      setText(`rel-${key}-value`, `${nf1.format(value)} %`);
      const bar = $(`rel-${key}-bar`);
      if (bar) bar.style.width = `${clamp(value, 0, 100)}%`;
    });
  }

  function renderAll(data) {
    state.data = data;
    renderHero(data);
    renderMetrics(data);
    renderFallback(data);
    renderTopClicks(data);
    renderAlerts(data);
    renderClicks(data);
    renderForms(data);
    renderSearches(data);
    renderGSC(data);
    renderReliability(data);
    drawChart(data);
  }

  const chart = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    dpr: 1,
    cells: [],
    data: null
  };

  const COLOR_STOPS = [
    [0, [22, 35, 66]],
    [0.3, [31, 111, 235]],
    [0.55, [46, 160, 67]],
    [0.78, [242, 201, 76]],
    [1, [255, 246, 200]]
  ];

  let drawRaf = 0;
  let tooltipTimer = 0;

  function initChart() {
    chart.canvas = $("mountain");
    if (!chart.canvas) return;
    chart.ctx = chart.canvas.getContext("2d");
    chart.canvas.addEventListener("pointerdown", onChartPointer);
    chart.canvas.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "mouse") hideTooltip();
    });

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(() => scheduleDraw());
      observer.observe($("chart-wrap"));
    }
    window.addEventListener("resize", scheduleDraw);
  }

  function resizeCanvas() {
    const canvas = chart.canvas;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    const bufferWidth = Math.round(width * dpr);
    const bufferHeight = Math.round(height * dpr);
    if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
      canvas.width = bufferWidth;
      canvas.height = bufferHeight;
    }
    chart.width = width;
    chart.height = height;
    chart.dpr = dpr;
    chart.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function scheduleDraw() {
    if (drawRaf) cancelAnimationFrame(drawRaf);
    drawRaf = requestAnimationFrame(() => {
      drawRaf = 0;
      if (chart.data) drawChart(chart.data);
    });
  }

  function mountainColor(t) {
    const value = clamp(t, 0, 1);
    for (let i = 1; i < COLOR_STOPS.length; i += 1) {
      const [stop, color] = COLOR_STOPS[i];
      const [prevStop, prevColor] = COLOR_STOPS[i - 1];
      if (value <= stop) {
        const local = (value - prevStop) / (stop - prevStop || 1);
        return [
          Math.round(lerp(prevColor[0], color[0], local)),
          Math.round(lerp(prevColor[1], color[1], local)),
          Math.round(lerp(prevColor[2], color[2], local))
        ];
      }
    }
    return COLOR_STOPS[COLOR_STOPS.length - 1][1];
  }

  function heightAt(u, v, data) {
    const dx = u - 0.5;
    const dy = v - 0.5;
    const r2 = dx * dx + dy * dy;
    const peak = 0.86 * Math.exp(-r2 * 15) * (data.score / 100);
    const gaussian = (cx, cy, sx, sy) =>
      Math.exp(-((dx - cx) ** 2) / sx - ((dy - cy) ** 2) / sy);

    const visitsN = clamp(data.visits / 8000, 0, 1);
    const clicksN = clamp(data.clicks / 14000, 0, 1);
    const formsN = clamp(data.formsSubmitted / 450, 0, 1);
    const searchesN = clamp(data.searches / 1800, 0, 1);

    const ridges =
      0.32 * visitsN * gaussian(0, -0.22, 0.018, 0.01) +
      0.32 * clicksN * gaussian(0.22, 0, 0.01, 0.018) +
      0.32 * formsN * gaussian(0, 0.22, 0.018, 0.01) +
      0.32 * searchesN * gaussian(-0.22, 0, 0.01, 0.018);

    const noise =
      Math.sin(u * 37 + 1.7) * Math.cos(v * 41 - 0.4) * 0.012 +
      Math.sin((u + v) * 23) * 0.008;

    return clamp(0.06 + peak + ridges + noise, 0.02, 1);
  }

  function shadeFor(u, v, data) {
    const e = 0.018;
    const dzdx =
      (heightAt(u + e, v, data) - heightAt(u - e, v, data)) / (2 * e);
    const dzdy =
      (heightAt(u, v + e, data) - heightAt(u, v - e, data)) / (2 * e);
    const nx = -dzdx * 0.28;
    const ny = -dzdy * 0.28;
    const nz = 1;
    const len = Math.hypot(nx, ny, nz);
    const lx = -0.55;
    const ly = -0.35;
    const lz = 0.76;
    const dot = (nx * lx + ny * ly + nz * lz) / len;
    return clamp(0.62 + 0.52 * Math.max(0, dot), 0.55, 1.18);
  }

  function roundRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function drawChart(data) {
    chart.data = data;
    hideTooltip();
    resizeCanvas();
    const ctx = chart.ctx;
    if (!ctx) return;
    const w = chart.width;
    const h = chart.height;
    ctx.clearRect(0, 0, w, h);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    const cos30 = Math.cos(Math.PI / 6);
    const sin30 = 0.5;
    const scaleX = w * 0.42;
    const scaleY = h * 0.36;
    const zHeight = h * 0.4;
    const originX = w / 2;
    const originY = h * 0.52;

    const project = (u, v, z) => ({
      x: originX + (u - v) * cos30 * scaleX,
      y: originY + (u + v) * sin30 * scaleY - z * zHeight
    });

    const background = ctx.createRadialGradient(
      w / 2,
      h * 0.42,
      10,
      w / 2,
      h * 0.42,
      Math.min(w, h) * 0.5
    );
    background.addColorStop(0, "rgba(56,212,122,0.10)");
    background.addColorStop(0.55, "rgba(91,140,255,0.05)");
    background.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, w, h);

    const topZ = 0.05;
    const bottomZ = -0.06;
    const corners = [
      { u: 0, v: 0 },
      { u: 1, v: 0 },
      { u: 1, v: 1 },
      { u: 0, v: 1 }
    ];
    const sideColors = ["#0b1426", "#0d1930", "#0a1222", "#0c172b"];

    for (let i = 0; i < corners.length; i += 1) {
      const a = corners[i];
      const b = corners[(i + 1) % corners.length];
      const p1 = project(a.u, a.v, topZ);
      const p2 = project(b.u, b.v, topZ);
      const p3 = project(b.u, b.v, bottomZ);
      const p4 = project(a.u, a.v, bottomZ);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.closePath();
      ctx.fillStyle = sideColors[i];
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const topCorners = corners.map((corner) =>
      project(corner.u, corner.v, topZ)
    );
    ctx.beginPath();
    ctx.moveTo(topCorners[0].x, topCorners[0].y);
    for (let i = 1; i < topCorners.length; i += 1) {
      ctx.lineTo(topCorners[i].x, topCorners[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = "#0f1a2f";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.045)";
    ctx.lineWidth = 0.7;
    for (let k = 1; k < 8; k += 1) {
      const t = k / 8;
      const a = project(t, 0, topZ);
      const b = project(t, 1, topZ);
      const c = project(0, t, topZ);
      const d = project(1, t, topZ);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(d.x, d.y);
      ctx.stroke();
    }
    ctx.restore();

    const N = 28;
    const heights = [];
    let maxZ = 0.001;
    for (let i = 0; i <= N; i += 1) {
      const row = [];
      for (let j = 0; j <= N; j += 1) {
        const z = heightAt(i / N, j / N, data);
        if (z > maxZ) maxZ = z;
        row.push(z);
      }
      heights.push(row);
    }

    const cells = [];
    for (let i = 0; i < N; i += 1) {
      for (let j = 0; j < N; j += 1) {
        const u0 = i / N;
        const v0 = j / N;
        const u1 = (i + 1) / N;
        const v1 = (j + 1) / N;
        const z00 = heights[i][j];
        const z10 = heights[i + 1][j];
        const z11 = heights[i + 1][j + 1];
        const z01 = heights[i][j + 1];
        const z = (z00 + z10 + z11 + z01) / 4;
        cells.push({
          u0,
          v0,
          u1,
          v1,
          u: (u0 + u1) / 2,
          v: (v0 + v1) / 2,
          z,
          z00,
          z10,
          z11,
          z01,
          depth: i + j
        });
      }
    }
    cells.sort((a, b) => a.depth - b.depth);
    chart.cells = cells;

    const zMin = 0.02;
    const zSpan = Math.max(0.001, maxZ - zMin);
    for (const cell of cells) {
      const t = clamp((cell.z - zMin) / zSpan, 0, 1);
      const shade = shadeFor(cell.u, cell.v, data);
      const color = mountainColor(t);
      const p1 = project(cell.u0, cell.v0, cell.z00);
      const p2 = project(cell.u1, cell.v0, cell.z10);
      const p3 = project(cell.u1, cell.v1, cell.z11);
      const p4 = project(cell.u0, cell.v1, cell.z01);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.closePath();
      ctx.fillStyle = `rgb(${Math.round(clamp(color[0] * shade, 0, 255))}, ${Math.round(clamp(color[1] * shade, 0, 255))}, ${Math.round(clamp(color[2] * shade, 0, 255))})`;
      ctx.fill();
      ctx.strokeStyle = "rgba(5,10,20,0.18)";
      ctx.lineWidth = 0.6;
      ctx.stroke();
      const center = project(cell.u, cell.v, cell.z);
      cell.sx = center.x;
      cell.sy = center.y;
    }

    ctx.save();
    ctx.font = "600 10px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "rgba(233,237,247,0.62)";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    const north = project(0.5, -0.6, 0);
    ctx.fillText("Visites", north.x, north.y);
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const east = project(1.15, 0.5, 0);
    ctx.fillText("Clics", east.x, east.y);
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const south = project(0.5, 1.55, 0);
    ctx.fillText("Formulaires", south.x, south.y);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    const west = project(-0.15, 0.5, 0);
    ctx.fillText("Recherches", west.x, west.y);
    ctx.restore();

    const peakZ = heightAt(0.5, 0.5, data);
    const peak = project(0.5, 0.5, peakZ);
    const glow = ctx.createRadialGradient(
      peak.x,
      peak.y,
      2,
      peak.x,
      peak.y,
      34
    );
    glow.addColorStop(0, "rgba(242,201,76,0.32)");
    glow.addColorStop(1, "rgba(242,201,76,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(peak.x, peak.y, 34, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(242,201,76,0.75)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(peak.x, peak.y);
    ctx.lineTo(peak.x, peak.y - 26);
    ctx.stroke();

    ctx.fillStyle = "#f2c94c";
    ctx.beginPath();
    ctx.arc(peak.x, peak.y, 3.5, 0, Math.PI * 2);
    ctx.fill();

    const label = `Fiabilité ${data.score}`;
    ctx.font = "700 11px system-ui, -apple-system, sans-serif";
    const textWidth = ctx.measureText(label).width;
    const boxWidth = textWidth + 16;
    const boxHeight = 22;
    const boxX = clamp(peak.x - boxWidth / 2, 4, w - boxWidth - 4);
    const boxY = Math.max(4, peak.y - 26 - boxHeight);
    roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 7);
    ctx.fillStyle = "rgba(8,13,26,0.92)";
    ctx.fill();
    ctx.strokeStyle = "rgba(242,201,76,0.55)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#f2c94c";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, boxX + boxWidth / 2, boxY + boxHeight / 2 + 0.5);

    chart.canvas.setAttribute(
      "aria-label",
      `Graphique en montagne 3D. Fiabilité ${data.score} sur 100. Période ${data.periodLabel}.`
    );
  }

  function onChartPointer(event) {
    if (!chart.data || !chart.cells.length) return;
    const rect = chart.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let best = null;
    let bestDistance = 26 * 26;
    for (const cell of chart.cells) {
      const dx = cell.sx - x;
      const dy = cell.sy - y;
      const distance = dx * dx + dy * dy;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = cell;
      }
    }
    if (!best) {
      hideTooltip();
      return;
    }
    showTooltip(best, x, y);
  }

  function showTooltip(cell, x, y) {
    const tooltip = $("chart-tooltip");
    if (!tooltip || !chart.data) return;
    const dx = cell.u - 0.5;
    const dy = cell.v - 0.5;
    const radius = Math.hypot(dx, dy);
    let label;
    let value;

    if (radius < 0.1) {
      label = "Fiabilité";
      value = `${chart.data.score}/100`;
    } else if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        label = "Clics";
        value = nf.format(chart.data.clicks);
      } else {
        label = "Recherches";
        value = nf.format(chart.data.searches);
      }
    } else if (dy > 0) {
      label = "Formulaires";
      value = nf.format(chart.data.formsSubmitted);
    } else {
      label = "Visites";
      value = nf.format(chart.data.visits);
    }

    tooltip.replaceChildren();
    const strong = document.createElement("strong");
    strong.textContent = label;
    tooltip.append(strong, document.createTextNode(value));
    tooltip.style.left = `${clamp(x, 64, chart.width - 64)}px`;
    tooltip.style.top = `${Math.max(42, y - 8)}px`;
    tooltip.hidden = false;
    clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(hideTooltip, 4000);
  }

  function hideTooltip() {
    clearTimeout(tooltipTimer);
    tooltipTimer = 0;
    const tooltip = $("chart-tooltip");
    if (tooltip) tooltip.hidden = true;
  }

  function setActivePeriodButton(value) {
    $$(".period").forEach((button) => {
      const active = button.dataset.period === value;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function showCustomRange(show) {
    const range = $("custom-range");
    if (!range) return;
    range.hidden = !show;
    if (show) {
      range.classList.remove("is-invalid");
      const error = $("range-error");
      if (error) error.hidden = true;
    }
  }

  function applyCustomRange() {
    const startInput = $("start-date");
    const endInput = $("end-date");
    const range = $("custom-range");
    const error = $("range-error");
    if (!startInput || !endInput) return false;

    const fail = (message) => {
      if (range) range.classList.add("is-invalid");
      if (error) {
        error.textContent = message;
        error.hidden = false;
      }
      return false;
    };

    const start = parseInputDate(startInput.value);
    const end = parseInputDate(endInput.value);
    if (!start || !end) return fail("Renseigne les deux dates.");
    if (start > end) return fail("La date de début doit précéder la date de fin.");

    const days = Math.round((end - start) / 86400000) + 1;
    if (days < 1) return fail("La période est invalide.");
    if (days > 90) return fail("Maximum 90 jours.");

    if (range) range.classList.remove("is-invalid");
    if (error) error.hidden = true;

    state.mode = "custom";
    state.days = days;
    state.start = start;
    state.end = end;
    setActivePeriodButton("custom");
    renderAll(buildData());
    return true;
  }

  function handlePeriodClick(value) {
    if (value === "custom") {
      showCustomRange(true);
      setActivePeriodButton("custom");
      if (!applyCustomRange()) {
        setActivePeriodButton(state.mode === "custom" ? "custom" : String(state.days));
      }
      return;
    }

    showCustomRange(false);
    state.mode = "preset";
    state.days = Number(value);
    state.start = null;
    state.end = null;
    setActivePeriodButton(value);
    renderAll(buildData());
  }

  function initPeriods() {
    $$(".period").forEach((button) => {
      button.addEventListener("click", () => {
        handlePeriodClick(button.dataset.period);
      });
    });
    const apply = $("apply-range");
    if (apply) apply.addEventListener("click", applyCustomRange);
  }

  function initTabs() {
    const tabs = $$(".tab");
    const panels = $$(".tab-panel");

    const activate = (name) => {
      tabs.forEach((tab) => {
        const active = tab.dataset.tab === name;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      panels.forEach((panel) => {
        const active = panel.id === `panel-${name}`;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => activate(tab.dataset.tab));
      tab.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const current = tabs.indexOf(tab);
        const next =
          event.key === "ArrowRight"
            ? (current + 1) % tabs.length
            : (current - 1 + tabs.length) % tabs.length;
        tabs[next].focus();
        activate(tabs[next].dataset.tab);
      });
    });
  }

  function init() {
    const startInput = $("start-date");
    const endInput = $("end-date");
    if (startInput) startInput.value = toInputValue(addDays(today, -6));
    if (endInput) endInput.value = toInputValue(today);

    const customRange = $("custom-range");
    if (customRange && !$("range-error")) {
      const error = document.createElement("p");
      error.id = "range-error";
      error.className = "range-error";
      error.hidden = true;
      customRange.append(error);
    }

    initChart();
    initPeriods();
    initTabs();
    renderAll(buildData());
  }

  init();
})();
