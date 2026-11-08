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
      if (!res.ok) { var tg = ''; try { tg = await res.text(); } catch (e) {} var ex = err('HTTP_' + res.status, 'Moteur injoignable (HTTP ' + res.status + ').' + (tg ? ' Réponse : ' + String(tg).slice(0, 160) : '')); ex.detail = tg; throw ex; }
      return true;
    }
    throw err('UNVERIFIED', 'Endpoint personnalisé : lance « Tester » dans Réglages.');
  }
  function err(code, message) { var e = new Error(message); e.code = code; return e; }
  function sysPrompt(bot) {
    var base = 'Tu es ' + bot.name + ', personnage simulé sans conscience réelle. ' + bot.specialty + ' ' + bot.personality + ' Réponds en français, court. Tutoie toujours, jamais de « vous ». Si on te salue, salue en retour puis pose une question.';
    if (bot && bot.id === 'via') base += ' Tu es ViA, personnage féminin (elle), bot de sociabilité : échanges chaleureux en français naturel, écoute les passions et les rêves, relance par une question pertinente. Ne propose jamais d’aide en programmation sauf demande explicite, et ne te présente jamais comme assistant de code.';
    base += ' Ne déduis jamais le genre de la personne à qui tu parles et n’attribue aucune identité de genre à l’utilisateur sans qu’il ou elle l’ait dite.';
    return base;
  }
  async function chat(cfg, bot, history, signal, sessionKey, ctx) {
    if (cfg.provider === 'none') throw err('NO_ENGINE', 'Aucun moteur IA configuré. Autorise le modèle local ou choisis un moteur dans Réglages.');
    if (cfg.provider === 'local') {
      if (!global.ViaLocalEngine) throw err('NOT_LOADED', 'Moteur local non chargé : recharge la page.');
      return await global.ViaLocalEngine.chat(bot, history, { signal: signal, ctx: ctx });
    }
    if (cfg.provider === 'webllm') {
      if (!global.ViaLocalEngine) throw err('NOT_LOADED', 'Moteur local non chargé : recharge la page.');
      return await global.ViaLocalEngine.chat(bot, history, { signal: signal, ctx: ctx });
    }
    var base = (cfg.baseUrl || '').replace(/\/$/, '');
    // Garde-fou central : jamais de POST relatif (GitHub Pages) sans adresse.
    if ((cfg.provider === 'ollama' || cfg.provider === 'custom') && !base) throw err('NO_ENGINE', 'Aucun serveur LLM configuré : renseigne l’adresse du serveur dans Réglages, ou choisis le moteur local.');
    var messages = (history && history.length && history[0] && history[0].role === 'system') ? history.slice() : [{ role: 'system', content: sysPrompt(bot) }].concat(history);
    var headers = { 'Content-Type': 'application/json' };
    var url, body;
    if (cfg.provider === 'ollama') {
      // Pré-vol obligatoire : vérifier que c'est bien Ollama AVANT tout POST.
      var tagRes = null, tagBody = '';
      try {
        tagRes = await fetch(base + '/api/tags', { method: 'GET', cache: 'no-store', signal: signal });
        try { tagBody = await tagRes.text(); } catch (e) { tagBody = ''; }
      } catch (e) {
        if (e && e.name === 'AbortError') throw err('ABORTED', 'Vérification annulée.');
        throw err('UNREACHABLE', 'Aucun serveur joignable à ' + base + ' (GET /api/tags impossible).');
      }
      if (!tagRes.ok || !/\"models\"/.test(tagBody)) {
        var pv = err('NOT_OLLAMA', 'Le serveur à ' + base + ' ne répond pas comme Ollama (GET /api/tags → HTTP ' + tagRes.status + '). Aucun POST envoyé : méthode et chemin inchangés.');
        pv.detail = String(tagBody).slice(0, 160); pv.url = base + '/api/tags'; pv.method = 'GET';
        throw pv;
      }
      url = base + '/api/chat';
      body = { model: cfg.model, messages: messages, stream: false };
    } else {
      url = base + '/chat/completions';
      body = { model: cfg.model, messages: messages };
      if (sessionKey) headers.Authorization = 'Bearer ' + sessionKey; // mémoire session, jamais persistée.
    }
    var res, rawSnippet = '';
    try {
      res = await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(body), signal: signal });
      try { rawSnippet = await res.text(); } catch (e) { rawSnippet = ''; }
    } catch (e) {
      if (e && e.name === 'AbortError') throw err('ABORTED', 'Requête annulée.');
      throw err('UNREACHABLE', 'Moteur injoignable (' + base + '). Vérifie qu’il est démarré.');
    }
    if (!res.ok) {
      var erx = err('HTTP_' + res.status, 'Le moteur répond en erreur (HTTP ' + res.status + ' à POST ' + url + ').' + (rawSnippet ? ' Réponse du serveur : ' + String(rawSnippet).slice(0, 160) : ' (aucun corps de réponse)'));
      erx.detail = rawSnippet; erx.url = url; erx.method = 'POST';
      throw erx;
    }
    var data = {};
    try { data = JSON.parse(rawSnippet); } catch (e) { throw err('EMPTY', 'Réponse non-JSON du moteur.'); }
    var text = (data.message && data.message.content) || (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
    if (!text) throw err('EMPTY', 'Réponse vide du moteur.');
    return text;
  }
  global.ViaProviders = { load: load, save: save, status: status, ping: ping, chat: chat, sysPrompt: sysPrompt, DEFAULTS: DEFAULTS };
})(window);
