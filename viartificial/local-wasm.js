/* Client du moteur LLM en Web Worker — même API que l'ancien moteur (load/chat/unload/summary).
   Docs officielles transformers.js v3 : device 'wasm' = CPU/ONNX Runtime WASM.
   Le travail lourd (téléchargement, décodage ONNX, génération) tourne dans
   local-wasm-worker.js : l'interface reste réactive, même sur mobile.
   - device: 'wasm' (CPU), numThreads:1. Sans COOP/COEP (GitHub Pages), ONNX Runtime bascule
     seul en monothread : aucun SharedArrayBuffer requis.
   - Annulation du téléchargement : commande 'cancel' -> terminaison du worker
     (3.7.2 : pas de env.fetch ; le navigateur coupe les fetch en vol). Annulation en génération : worker terminé
     côté client (mémoire libérée aussitôt), à recharger au prochain usage.
   - Un seul moteur + un seul modèle partagés ; personnalités via prompt système. */
(function (global) {
  'use strict';
  var WORKER_URL = './local-wasm-worker.js';
  var CDN = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2/+esm';
  var CANDIDATES = [
    // Vérifié 2026-10-31 (accès anonyme) : SmolLM2-360M-Instruct-ONNX
    // (onnx/model_q4.onnx 386 Mo + tokenizer ≈ 390 Mo total, Apache-2.0,
    // chat_template officiel présent) puis Qwen2.5-0.5B-Instruct q4 ≈ 800 Mo
    // (Apache-2.0 via base Qwen, template présent, PC/Wi-Fi uniquement).
    { id: 'onnx-community/SmolLM2-360M-Instruct-ONNX', downloadMB: 390, license: 'Apache 2.0' },
    { id: 'onnx-community/Qwen2.5-0.5B-Instruct', downloadMB: 800, license: 'Apache 2.0' }
  ];
  var S = { phase: 'idle', model: null, progress: 0, detail: '' };
  var worker = null, seq = 0, pending = {}, busy = false, picked = null;
  var tokInfo = { source: 'inconnu', hasTemplate: false };
  function set(p, d, g) { S.phase = p; if (d !== undefined) S.detail = d; if (g !== undefined) S.progress = g; }
  function err(code, message) { var e = new Error(message); e.code = code; return e; }
  function onMsg(e) {
    var m = e.data || {}, id = m.id, h = pending[id];
    if (!h) return;
    try {
      if (m.type === 'progress' || m.type === 'stage') { if (h.onTick) h.onTick({ group: m.group, phase: S.phase, progress: m.progress, text: m.detail, detail: m.detail }); }
      else if (m.type === 'token') { if (h.onToken) h.onToken(m.text); }
      else if (m.type === 'ready') { picked = m.model; if (m.tokenizer) tokInfo = { source: m.tokenizer, hasTemplate: true }; delete pending[id]; h.resolve({ model: picked, tokenizer: tokInfo.source }); }
      else if (m.type === 'done') { delete pending[id]; h.resolve(m.text !== undefined ? m.text : true); }
      else if (m.type === 'cancelled') { delete pending[id]; h.reject(err('ABORTED', 'Annulé à ta demande.')); }
      else if (m.type === 'error') { delete pending[id]; h.reject(err(m.code || 'ERROR', m.message || 'échec')); }
    } catch (ex) {}
  }
  function onErr(e) {
    var ids = Object.keys(pending);
    for (var i = 0; i < ids.length; i++) { try { pending[ids[i]].reject(err('WORKER_FAIL', 'Moteur interrompu : ' + ((e && e.message) || 'erreur worker'))); } catch (ex) {} delete pending[ids[i]]; }
    worker = null; busy = false; set('error', 'moteur interrompu');
  }
  function getWorker() {
    if (!worker) {
      worker = new global.Worker(WORKER_URL, { type: 'module' });
      worker.onmessage = onMsg;
      worker.onerror = onErr;
    }
    return worker;
  }
  function rpc(cmd, payload, cbs) {
    var id = ++seq;
    return new Promise(function (resolve, reject) {
      pending[id] = { resolve: resolve, reject: reject, onTick: cbs && cbs.onTick, onToken: cbs && cbs.onToken };
      try { getWorker().postMessage({ id: id, cmd: cmd, payload: payload || {} }); }
      catch (e) { delete pending[id]; reject(err('WORKER_FAIL', 'Worker indisponible : ' + (e && e.message ? e.message : e))); }
    });
  }
  async function load(modelId, onTick) {
    if (busy) throw err('BUSY', 'Moteur occupé : une opération est déjà en cours (pas de boucle).');
    busy = true; set('downloading', 'runtime…', 0);
    try {
      if (onTick) onTick({ group: 'runtime', phase: 'downloading', progress: 5, text: 'runtime…', detail: 'runtime…' });
      var r = await rpc('load', { modelId: modelId || null, candidates: CANDIDATES.map(function (c) { return c.id; }) }, { onTick: onTick });
      S.model = r.model;
      set('loading', 'chargement en mémoire…');
      if (onTick) onTick({ group: 'poids', phase: 'loading', progress: 100, text: 'chargement en mémoire…', detail: 'chargement en mémoire…' });
      set('ready', 'prêt (CPU)');
      if (onTick) onTick({ group: 'poids', phase: 'ready', progress: 100, text: 'moteur prêt', detail: 'moteur prêt' });
      return true;
    } catch (e) { set('error', (e && e.message) || 'échec'); throw e; }
    finally { busy = false; }
  }
  function sysPrompt(bot) {
    return 'Tu es ' + bot.name + ', personnage simulé sans conscience réelle. ' + bot.specialty + ' ' + bot.personality + ' Réponds en français, court.';
  }
  async function chat(bot, history, opt) {
    if (!worker || S.phase !== 'ready') throw err('NOT_LOADED', 'Modèle non chargé : appuie sur « Charger le modèle local », puis réessaie.');
    if (busy) throw err('BUSY', 'Génération déjà en cours : attends ou annule.');
    busy = true; set('generating', 'génération…');
    var o = opt || {};
    try {
      var msgs = [{ role: 'system', content: sysPrompt(bot) }].concat(history);
      var t = await rpc('chat', { messages: msgs.slice(-5) }, { onToken: o.onToken });
      t = String(t).trim();
      if (!t) throw err('EMPTY', 'Réponse vide du moteur.');
      return t;
    } finally { busy = false; if (S.phase === 'generating') set('ready', 'prêt (CPU)'); }
  }
  // Annulation : téléchargement -> le worker interrompt ses fetch (le runtime le
  // permet) ; génération -> worker terminé côté client (mémoire libérée aussitôt,
  // rechargement nécessaire au prochain usage). Les promesses en vol sont rejetées.
  function cancel() {
    var ids = Object.keys(pending);
    try { if (worker) worker.postMessage({ id: 0, cmd: 'cancel', payload: {} }); } catch (e) {}
    try { if (worker) worker.terminate(); } catch (e) {}
    worker = null;
    for (var i = 0; i < ids.length; i++) { try { pending[ids[i]].reject(err('ABORTED', 'Annulé à ta demande.')); } catch (e) {} delete pending[ids[i]]; }
    busy = false; set('idle', 'annulé (moteur déchargé, mémoire libérée)');
  }
  async function unload() {
    try { if (worker) worker.terminate(); } catch (e) {}
    worker = null;
    var ids = Object.keys(pending);
    for (var i = 0; i < ids.length; i++) { try { pending[ids[i]].reject(err('ABORTED', 'Moteur déchargé.')); } catch (e) {} delete pending[ids[i]]; }
    busy = false; S.model = null; set('idle', 'déchargé (mémoire libérée)');
  }
  function summary() { return { phase: S.phase, model: S.model || picked, progress: S.progress, detail: S.detail, mode: S.phase === 'ready' || S.phase === 'generating' ? 'CPU/WASM local (worker)' : '—', backend: 'wasm', tokenizer: tokInfo.hasTemplate ? ('chat_template ' + tokInfo.source) : 'chat_template non chargé', threads: (typeof crossOriginIsolated !== 'undefined' && crossOriginIsolated) ? 'multithread' : 'monothread (Pages sans COOP/COEP)' }; }
  function info() { return { candidates: CANDIDATES.map(function (c) { return c.id; }), picked: picked, tokenizer: tokInfo, device: 'wasm (CPU), monothread sans COOP/COEP', lib: '3.7.2', cdn: CDN, worker: WORKER_URL }; }
  global.ViaWasmEngine = { CANDIDATES: CANDIDATES, load: load, chat: chat, cancel: cancel, unload: unload, summary: summary, info: info, CDN: CDN, WORKER_URL: WORKER_URL };
})(window);
