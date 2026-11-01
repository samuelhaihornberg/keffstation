/* Fournisseurs de modèles — ViArtificial Labs (PWA statique, GitHub Pages).
   Séparation : profils (bots.json) / interface (conversation.html) / moteurs (ce fichier).
   - Par défaut : moteur local CPU/WASM (modèle partagé téléchargé sur l'appareil,
     accord explicite, choix auto selon l'appareil, Web Worker monothread sans
     SharedArrayBuffer). L'UI affiche son état réel, jamais simulé.
   - Réglage avancé : Ollama local, endpoint compatible OpenAI (saisi par l'utilisateur).
     AUCUNE exécution WebGPU/WebLLM : l'ancien réglage 'webllm' est migré vers 'local'.
   - Clé éventuelle : mémoire de session uniquement, jamais persistée, loggée ni commitée.
   - Clé éventuelle : mémoire de session uniquement, jamais persistée, loggée ni commitée.
   - Pages statiques : secret serveur requis => passer par un proxy adapté, jamais en direct. */
(function (global) {
  'use strict';
  var KEY = 'via-engine'; // localStorage : provider/baseUrl/model uniquement, JAMAIS de clé.
  var DEFAULTS = { provider: 'local', baseUrl: '', model: '' };
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || '{}');
      if (s && s.provider) return { provider: s.provider, baseUrl: s.baseUrl || DEFAULTS.baseUrl, model: s.model || DEFAULTS.model };
      return { provider: DEFAULTS.provider, baseUrl: DEFAULTS.baseUrl, model: DEFAULTS.model }; // local automatique.
    } catch (e) { return { provider: DEFAULTS.provider, baseUrl: DEFAULTS.baseUrl, model: DEFAULTS.model }; }
  }
  function save(cfg) {
    try { localStorage.setItem(KEY, JSON.stringify({ provider: cfg.provider, baseUrl: cfg.baseUrl, model: cfg.model })); } catch (e) {}
  }
  function status(cfg) {
    if (!cfg || cfg.provider === 'none') return { ok: false, label: 'Aucun moteur IA configuré' };
    if (cfg.provider === 'local') return { ok: true, label: 'Modèle local CPU/WASM partagé (worker monothread)' };
    if (cfg.provider === 'webllm') return { ok: true, label: 'Ancien réglage WebLLM (migré vers CPU/WASM) — choisis « local »' };
    if (cfg.provider === 'ollama') return { ok: true, label: 'Ollama local — ' + cfg.model };
    return { ok: true, label: 'Endpoint personnalisé — ' + cfg.model };
  }
  async function ping(cfg, signal) {
    if (!cfg || cfg.provider === 'none') throw err('NO_ENGINE', 'Aucun moteur IA configuré.');
    if (cfg.provider === 'local') {
      if (!global.ViaLocalEngine) throw err('NOT_LOADED', 'Moteur local non chargé.');
      var sm = global.ViaLocalEngine.summary();
      if (sm.phase === 'ready' || sm.phase === 'generating') return true;
      throw err('NOT_READY', 'Moteur local non prêt (' + sm.phase + ').');
    }
    if (cfg.provider === 'webllm') throw err('MIGRATED', 'Ancien réglage WebLLM/WebGPU supprimé : moteur CPU/WASM seul. Bascule sur « local ».');
    if (cfg.provider === 'ollama') {
      var base = (cfg.baseUrl || '').replace(/\/$/, '');
      var res;
      try { res = await fetch(base + '/api/tags', { signal: signal }); }
      catch (e) { if (e && e.name === 'AbortError') throw err('ABORTED', 'Vérification annulée.'); throw err('UNREACHABLE', 'Moteur injoignable (' + base + ').'); }
      if (!res.ok) throw err('HTTP_' + res.status, 'Moteur injoignable (HTTP ' + res.status + ').');
      return true;
    }
    throw err('UNVERIFIED', 'Endpoint personnalisé : lance « Tester » dans Réglages.');
  }
  function err(code, message) { var e = new Error(message); e.code = code; return e; }
  function sysPrompt(bot) {
    return 'Tu incarnes ' + bot.name + ', personnage simulé sans conscience réelle. ' + bot.specialty + ' ' + bot.personality;
  }
  async function chat(cfg, bot, history, signal, sessionKey) {
    if (cfg.provider === 'none') throw err('NO_ENGINE', 'Aucun moteur IA configuré. Autorise le modèle local ou choisis un moteur dans Réglages.');
    if (cfg.provider === 'local') {
      if (!global.ViaLocalEngine) throw err('NOT_LOADED', 'Moteur local non chargé : recharge la page.');
      return await global.ViaLocalEngine.chat(bot, history, { signal: signal });
    }
    if (cfg.provider === 'webllm') {
      if (!global.ViaLocalEngine) throw err('NOT_LOADED', 'Moteur local non chargé : recharge la page.');
      return await global.ViaLocalEngine.chat(bot, history, { signal: signal });
    }
    var base = (cfg.baseUrl || '').replace(/\/$/, '');
    var messages = [{ role: 'system', content: sysPrompt(bot) }].concat(history);
    var headers = { 'Content-Type': 'application/json' };
    var url, body;
    if (cfg.provider === 'ollama') {
      url = base + '/api/chat';
      body = { model: cfg.model, messages: messages, stream: false };
    } else {
      url = base + '/chat/completions';
      body = { model: cfg.model, messages: messages };
      if (sessionKey) headers.Authorization = 'Bearer ' + sessionKey; // mémoire session, jamais persistée.
    }
    var res;
    try {
      res = await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(body), signal: signal });
    } catch (e) {
      if (e && e.name === 'AbortError') throw err('ABORTED', 'Requête annulée.');
      throw err('UNREACHABLE', 'Moteur injoignable (' + base + '). Vérifie qu’il est démarré.');
    }
    if (!res.ok) throw err('HTTP_' + res.status, 'Le moteur répond en erreur (HTTP ' + res.status + ').');
    var data = await res.json();
    var text = (data.message && data.message.content) || (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
    if (!text) throw err('EMPTY', 'Réponse vide du moteur.');
    return text;
  }
  global.ViaProviders = { load: load, save: save, status: status, ping: ping, chat: chat, DEFAULTS: DEFAULTS };
})(window);
