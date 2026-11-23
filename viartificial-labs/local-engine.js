/* Moteur IA local COMMUN — CPU/WebAssembly via Web Worker (AUCUN WebGPU/WebLLM, AUCUN Ollama).
   Docs officielles vérifiées (huggingface.co/docs/transformers.js v3 :
   api/pipelines pipeline text-generation + api/env) : messages [{role,content}],
   TextStreamer(skip_prompt), progress_callback, env.useBrowserCache.
   UN SEUL moteur partagé pour tous les SuperBots : la personnalité = prompt système.
   - device:'wasm' (CPU), dtype:'q4', numThreads:1 forcé : GitHub Pages sans
     COOP/COEP → monothread, aucun SharedArrayBuffer requis.
   - Inférence dans local-wasm-worker.js (thread séparé) : interface réactive.
   - Sans COOP/COEP (GitHub Pages), ONNX Runtime bascule seul en WASM monothread.
   - Une seule tentative de poids par accord (jamais de boucle) ; le cache
     navigateur évite tout re-téléchargement inutile.
   - WASM réduit le risque mémoire mais ne le supprime pas : un navigateur peut
     fermer l'onglet sans prévenir (noté dans l'interface, jamais garanti).
   - NE DÉPEND PAS d'Ollama ni d'aucun serveur distant : modèles open source locaux uniquement.
   États : idle→preparing→loading→ready→generating→error. Chargement auto après consentement cookie ViA. */
(function (global) {
  'use strict';
  var MODELS = [
    // Défaut vérifié 2026-10-31 (anonyme, sans compte) :
    // onnx-community/SmolLM2-360M-Instruct-ONNX — onnx/model_q4.onnx 386 Mo
    // + tokenizer 3.5 Mo ≈ 390 Mo ; licence Apache-2.0 (source HuggingFaceTB) ;
    // chat_template officiel présent (368 car., identique HuggingFaceTB).
    { id: 'onnx-community/SmolLM2-360M-Instruct-ONNX', downloadMB: 390, license: 'Apache 2.0', auto: true, label: 'SmolLM2 360M Instruct — (≈390 Mo, Apache 2.0, défaut)' },
    { id: 'onnx-community/Qwen2.5-0.5B-Instruct', downloadMB: 800, license: 'Apache 2.0', auto: false, label: 'Qwen2.5 0.5B Instruct — (≈800 Mo mesurés, Apache 2.0, PC/Wi-Fi uniquement, choix explicite)' }
  ];
  // Double consentement : cookies Keffstation + chargement moteur SuperBot
  // CONSENT_KEY_COOKIES = consentement cookies général Keffstation
  // CONSENT_KEY_MODEL = consentement chargement moteur SuperBot ViArtificial Labs
  var CONSENT_KEY_COOKIES = 'keffstation-cookies-consent';
  var CONSENT_KEY_MODEL = 'via-model-consent';
  function getCookiesConsent() { try { var o = JSON.parse(localStorage.getItem(CONSENT_KEY_COOKIES) || 'null'); return (o && o.state) || null; } catch (e) { return null; } }
  function setCookiesConsent(state) { try { localStorage.setItem(CONSENT_KEY_COOKIES, JSON.stringify({ state: state, ts: Date.now() })); } catch (e) {} return state; }
  function getModelConsent() { try { var o = JSON.parse(localStorage.getItem(CONSENT_KEY_MODEL) || 'null'); return (o && o.state) || null; } catch (e) { return null; } }
  function setModelConsent(state) { try { localStorage.setItem(CONSENT_KEY_MODEL, JSON.stringify({ state: state, ts: Date.now() })); } catch (e) {} return state; }
  // Compatibilité : getConsent/setConsent pointent vers le consentement modèle
  function getConsent() { return getModelConsent(); }
  function setConsent(state) { return setModelConsent(state); }
  // Les deux consentements doivent être accordés pour le préchargement
  function bothConsentsGranted() { return getCookiesConsent() === 'granted' && getModelConsent() === 'granted'; }
  function setConsent(state) { try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ state: state, ts: Date.now() })); } catch (e) {} return state; }
  // État du chargement : 'idle' | 'preparing' | 'loading' | 'ready' | 'unavailable' | 'error'
  var LOAD_STATE = 'idle';
  var LOAD_MODEL = null;
  var LOAD_PROGRESS = 0;
  var LOAD_DETAIL = '';
  // Promesse d'initialisation partagée pour éviter les initialisations simultanées
  var initPromise = null;
  function getLoadState() { return { state: LOAD_STATE, model: LOAD_MODEL, progress: LOAD_PROGRESS, detail: LOAD_DETAIL }; }
  function setLoadState(state, model, progress, detail) {
    LOAD_STATE = state; LOAD_MODEL = model; LOAD_PROGRESS = progress || 0; LOAD_DETAIL = detail || '';
    try { if (typeof paintEngineStatus === 'function') paintEngineStatus(); } catch (e) {}
  }
  // Choix automatique : moteur CPU/WASM si WebAssembly disponible, sinon erreur
  // précise. WebGPU n'est PLUS requis (ni consulté pour le choix).
  // Défaut : SmolLM2-360M-Instruct-ONNX (≈390 Mo vérifiés). Qwen 800 Mo
  // uniquement si demandé
  // explicitement (modelId) ou gros appareil non-mobile + mémoire >= 4 Go.
  function pickModel(cap, wantId) {
    if (wantId) { var mi = modelInfo(wantId); return { backend: 'wasm', id: mi.id, downloadMB: mi.downloadMB }; }
    var mobile = false; try { mobile = /Android|iPhone|iPad/i.test(navigator.userAgent || ''); } catch (e) {}
    var dm = 0; try { dm = navigator.deviceMemory || 0; } catch (e) {}
    if (cap && cap.wasm) {
      if (mobile || (dm && dm < 4)) return { backend: 'wasm', id: MODELS[0].id, downloadMB: MODELS[0].downloadMB };
      return { backend: 'wasm', id: MODELS[0].id, downloadMB: MODELS[0].downloadMB };
    }
    var why = (cap && cap.reasons && cap.reasons.length) ? cap.reasons.join(' ; ') : 'appareil non analysable';
    return { error: 'NO_LOCAL', message: 'Aucun moteur local ne peut fonctionner ici : ' + why + '.' };
  }
  function modelInfo(id) { for (var i = 0; i < MODELS.length; i++) if (MODELS[i].id === id) return MODELS[i]; return { id: id, vramMB: 0, downloadMB: 800, license: 'Apache 2.0', label: id }; }
  async function storageCheck(needMB) {
    try {
      if (!navigator.storage || !navigator.storage.estimate) return { ok: true, unknown: true, needMB: needMB };
      var e = await navigator.storage.estimate();
      var quotaMB = Math.round((e.quota || 0) / 1048576), usageMB = Math.round((e.usage || 0) / 1048576);
      return { ok: quotaMB === 0 || (quotaMB - usageMB) > needMB * 1.2, quotaMB: quotaMB, usageMB: usageMB, needMB: needMB };
    } catch (err) { return { ok: true, unknown: true, needMB: needMB }; }
  }
  // Diagnostic complet : contexte sécurisé, WebAssembly, stockage, mémoire.
  // AUCUNE initialisation GPU (pas de requestAdapter/requestDevice) : simple
  // présence d'API notée pour le diagnostic, sans coût mémoire. Jamais de
  // conclusion hâtive sur « tout l'appareil ».
  var lastDetect = null;
  async function detect() {
    var reasons = [];
    var secure = false; try { secure = !!window.isSecureContext; } catch (e) {}
    if (!secure) reasons.push('contexte non sécurisé (service worker et cache exigent HTTPS ou localhost)');
    var hasAPI = false; try { hasAPI = !!(navigator.gpu); } catch (e) {}
    var wasm = false; try { wasm = typeof WebAssembly !== 'undefined'; } catch (e) {}
    if (!wasm) reasons.push('WebAssembly absent : moteur CPU impossible');
    var threads = 'monothread (GitHub Pages ne définit pas COOP/COEP)';
    try { if (typeof crossOriginIsolated !== 'undefined' && crossOriginIsolated && typeof SharedArrayBuffer !== 'undefined') threads = 'multithread possible'; } catch (e) {}
    var dm = navigator.deviceMemory || 0;
    if (dm && dm < 4) reasons.push('mémoire appareil faible (' + dm + ' Go déclarés) : préfère un contexte court');
    var mobile = /Android|iPhone|iPad/i.test(navigator.userAgent || '');
    var cap = { secure: secure, webgpu: false, shaderF16: false, deviceMemoryGB: dm, mobile: mobile,
      adapter: hasAPI ? 'présent (non initialisé, moteur CPU seul)' : 'absent', device: 'non testé (CPU seul)', wasm: wasm, threads: threads,
      reasons: reasons, ok: !!wasm };
    lastDetect = cap;
    return cap;
  }
  // Parcours : détection → sélection CPU/WASM → stockage → téléchargement →
  // chargement. Essai en cascade petit→grand via le worker (chaque modèle une
  // seule fois) ; le cache navigateur évite tout re-téléchargement inutile.
  // Initialise automatiquement le chargement des LLM locaux après consentement cookie ViA.
  // Ne nécessite aucun clic manuel sur « Charger » pour le fonctionnement normal.
  async function initAutoLoad(onTick, wantId) {
    // Promesse partagée : empêche les initialisations simultanées
    // IMPORTANT : définir initPromise SYNCHRONEMENT avant toute opération async
    if (initPromise) {
      try { console.log('[local-engine] initAutoLoad : réutilisation de la promesse existante'); } catch (e) {}
      return initPromise;
    }
    // Créer la promesse immédiatement (synchrone) pour éviter la race condition
    initPromise = (async function () {
      try { console.log('[local-engine] initAutoLoad appelé. ViaWasmEngine disponible:', !!global.ViaWasmEngine); } catch (e) {}
    // Vérifier les deux consentements
    if (getCookiesConsent() !== 'granted') { setLoadState('idle', null, 0, 'En attente du consentement cookies Keffstation.'); return { state: 'waiting-cookies', detail: 'Consentement cookies requis.' }; }
    if (getModelConsent() !== 'granted') { setLoadState('idle', null, 0, 'En attente du consentement chargement moteur SuperBot.'); return { state: 'waiting-model', detail: 'Consentement modèle requis.' }; }
    var c = 'granted';
    setLoadState('preparing', wantId || MODELS[0].id, 0, 'Vérification de l’appareil et sélection du modèle…');
    // Attendre que ViaWasmEngine soit disponible (max 5 secondes)
    if (!global.ViaWasmEngine) {
      for (var i = 0; i < 50; i++) {
        await new Promise(function (resolve) { setTimeout(resolve, 100); });
        if (global.ViaWasmEngine) break;
      }
    }
    // Si toujours pas disponible, tenter de charger le script dynamiquement
    if (!global.ViaWasmEngine) {
      try {
        var script = document.createElement('script');
        script.src = './local-wasm.js';
        document.head.appendChild(script);
        for (var j = 0; j < 30; j++) {
          await new Promise(function (resolve) { setTimeout(resolve, 100); });
          if (global.ViaWasmEngine) break;
        }
      } catch (e) {}
    }
    try {
      var cap = await detect();
      var pick = pickModel(cap, wantId);
      if (pick.error) { setLoadState('unavailable', pick.model || wantId, 0, pick.message); throw Object.assign(new Error(pick.message), { code: 'NO_LOCAL' }); }
      var needMB = pick.downloadMB || 200;
      var st = await storageCheck(needMB);
      if (!st.ok) { setLoadState('unavailable', pick.model || wantId, 0, 'Stockage insuffisant : il faut ≈' + needMB + ' Mo libres (utilisé ' + st.usageMB + ' / quota ' + st.quotaMB + ' Mo).'); throw Object.assign(new Error('Stockage insuffisant'), { code: 'STORAGE_FULL' }); }
      if (!global.ViaWasmEngine) {
        var msg = 'local-wasm.js non chargé ou ViaWasmEngine non exposé. Vérifiez la console du navigateur (F12) pour les erreurs de chargement. Étapes : 1) Vérifier que local-wasm.js est présent à côté de conversation.html, 2) Vérifier les erreurs réseau (onglet Network), 3) Vérifier que le navigateur supporte les Web Workers (Chrome/Firefox/Safari/Edge).';
        setLoadState('error', pick.model || wantId, 0, msg);
        throw Object.assign(new Error(msg), { code: 'NOT_LOADED' });
      }
      setLoadState('loading', pick.model || wantId, 0, 'Téléchargement et chargement du modèle local en cours…');
      try {
        var loadResult = await global.ViaWasmEngine.load(wantId || null, function (p) {
          setLoadState('loading', pick.model || wantId, p.progress || 0, p.detail || 'Chargement en cours…');
        });
        // Le modèle est maintenant chargé et prêt
        setLoadState('ready', pick.model || wantId, 100, 'Modèle local prêt et chargé.');
        return loadResult;
      } catch (loadErr) {
        var errMsg = (loadErr && loadErr.message) ? loadErr.message : 'Échec inconnu du chargement CPU';
        var errCode = (loadErr && loadErr.code) ? loadErr.code : 'LOAD_ERROR';
        setLoadState('error', pick.model || wantId, 0, errMsg);
        throw Object.assign(new Error(errMsg), { code: errCode });
      }
    } catch (e) {
      if (e.code === 'ABORTED') { setLoadState('idle', null, 0, 'Chargement annulé.'); return { state: 'aborted' }; }
      throw e;
    }
    })().finally(function () { initPromise = null; }); // fin de la promesse partagée, reset pour retry
  }
  async function autoLoad(onTick, wantId) {
    var c = getConsent();
    if (c !== 'granted') throw Object.assign(new Error('Consentement requis : autorise le modèle local dans l’accord cookie ViArtificial Labs.'), { code: 'NEEDS_CONSENT' });
    return initAutoLoad(onTick, wantId);
  }
  // Supprime les fichiers de modèles du cache navigateur (ciblé, sur demande explicite).
  async function deleteModels() {
    var names = []; try { if ('caches' in window) names = await caches.keys(); } catch (e) {}
    var gone = 0;
    for (var i = 0; i < names.length; i++) {
      if (/transformers|onnx|webllm|mlc/i.test(names[i])) { try { if (await caches.delete(names[i])) gone++; } catch (e) {} }
    }
    await unload();
    return gone;
  }
  function setModel(id) { return id || null; } // compat : un seul modèle partagé, rien à commuter.
  async function chat(bot, history, opt) {
    if (!global.ViaWasmEngine) throw Object.assign(new Error('Moteur CPU non chargé : recharge la page.'), { code: 'NOT_LOADED' });
    return global.ViaWasmEngine.chat(bot, history, opt);
  }
  async function unload() {
    try { if (global.ViaWasmEngine) await global.ViaWasmEngine.unload(); } catch (e) {}
  }
  function summary() {
    var ls = getLoadState();
    if (global.ViaWasmEngine) { var w = global.ViaWasmEngine.summary(); return { phase: ls.state, model: w.model || ls.model, progress: w.progress || ls.progress, detail: w.detail || ls.detail, mode: w.mode, backend: 'wasm', tokenizer: w.tokenizer, threads: w.threads, loadState: ls.state, loadDetail: ls.detail }; }
    return { phase: ls.state, model: ls.model, progress: ls.progress, detail: ls.detail, mode: '—', backend: 'wasm', loadState: ls.state, loadDetail: ls.detail };
  }
  function lastDetectFn() { return lastDetect; }
  global.ViaLocalEngine = { MODELS: MODELS, detect: detect, lastDetect: lastDetectFn, modelInfo: modelInfo, setModel: setModel, autoLoad: autoLoad, initAutoLoad: initAutoLoad, pickModel: pickModel, storageCheck: storageCheck, getConsent: getConsent, setConsent: setConsent, getCookiesConsent: getCookiesConsent, setCookiesConsent: setCookiesConsent, getModelConsent: getModelConsent, setModelConsent: setModelConsent, bothConsentsGranted: bothConsentsGranted, deleteModels: deleteModels, chat: chat, unload: unload, summary: summary, getLoadState: getLoadState, CONSENT_KEY_COOKIES: CONSENT_KEY_COOKIES, CONSENT_KEY_MODEL: CONSENT_KEY_MODEL };
})(window);
