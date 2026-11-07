/* Actions agentiques — ViArtificial Labs. Inventaire honnête des capacités réelles.
   DISPONIBLES (vérifiés, sans permission) : lecture fichiers PWA, diagnostic hors-ligne,
   carnet local, export JSON (téléchargement).
   CONNECTABLES EXPLICITEMENT : notifications navigateur (permission demandée à l'usage),
   moteur IA local/distant (providers.js, service à démarrer par l'utilisateur).
   INDISPONIBLES (marqués tels quels) : téléphone/SMS, autres apps, superposition système,
   tests Node, achats, publications et messages externes sans service connecté.
   Sensible (achat, suppression importante, publication, message externe) => validation
   explicite exigée AVANT exécution, même si un service est connecté. */
(function (global) {
  'use strict';
  function dl(name, text) { var b = new Blob([text], { type: 'application/json' }); var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000); }
  var TOOLS = [
    { id: 'diag', title: 'Diagnostiquer la PWA', desc: 'Vérifie bots.json, service worker, localStorage. 100 % local.', perms: 'locales', sensitive: false, needs: null },
    { id: 'export', title: 'Exporter le carnet', desc: 'Télécharge le carnet JSON de ce SuperBot.', perms: 'locales', sensitive: false, needs: null },
    { id: 'notify', title: 'Notifier (navigateur)', desc: 'Notification locale via permission navigateur explicite.', perms: 'notification (demandée à l’usage)', sensitive: false, needs: 'permission-notification' },
    { id: 'ask', title: 'Demander au moteur', desc: 'Interroge le moteur configuré (providers.js). Service à démarrer.', perms: 'service moteur', sensitive: false, needs: 'service-moteur' },
    { id: 'publish', title: 'Publier / message externe', desc: 'AUCUN service de publication connecté.', perms: 'bloquées', sensitive: true, needs: 'service-publication', off: true },
    { id: 'phone', title: 'Téléphone / autres apps', desc: 'Pas d’accès direct depuis une PWA web.', perms: 'impossibles sans compagnon', sensitive: true, needs: 'compagnon-android ou extension', off: true }
  ];
  function available(t) { return !t.off; }
  async function run(id, ctx, onState) {
    var say = onState || function () {};
    if (id === 'diag') {
      say('run', 'Lecture de bots.json…');
      var bots = await (await fetch('./bots.json')).json();
      say('run', 'Contrôle du service worker…');
      var sw = ('serviceWorker' in navigator) ? await navigator.serviceWorker.getRegistration().catch(function () { return null; }) : null;
      var ls = true; try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); } catch (e) { ls = false; }
      return 'PWA OK : ' + bots.bots.length + ' profils, SW ' + (sw ? 'actif' : 'absent') + ', stockage local ' + (ls ? 'OK' : 'indisponible') + '.';
    }
    if (id === 'export') { say('run', 'Génération du JSON…'); var j = global.ViaMemory.exportBot(ctx.bot); dl('carnet-' + ctx.bot + '.json', j); return 'Carnet exporté (' + global.ViaMemory.entries(ctx.bot).length + ' entrées). Fichier téléchargé.'; }
    if (id === 'notify') {
      say('run', 'Demande de permission…');
      if (!('Notification' in window)) throw Object.assign(new Error('Notifications non supportées par ce navigateur.'), { code: 'UNSUPPORTED' });
      var p = await Notification.requestPermission();
      if (p !== 'granted') throw Object.assign(new Error('Permission refusée : aucune notification envoyée.'), { code: 'DENIED' });
      new Notification(ctx.title || 'ViArtificial Labs', { body: ctx.text || 'Test de notification locale.' });
      return 'Notification affichée (permission accordée explicitement).';
    }
    if (id === 'ask') {
      var eng = global.ViaProviders.load();
      if (!global.ViaProviders.status(eng).ok) throw Object.assign(new Error('Service moteur non connecté. Configure Ollama local ou un endpoint.'), { code: 'NO_ENGINE' });
      say('run', 'Interrogation du moteur…');
      return await global.ViaProviders.chat(eng, ctx.botObj, [{ role: 'user', content: ctx.text }], ctx.signal, ctx.key || null);
    }
    throw Object.assign(new Error('Outil indisponible : dépendance « ' + (TOOLS.filter(function (t) { return t.id === id; })[0] || {}).needs + ' » non connectée.'), { code: 'OFFLINE_TOOL' });
  }
  global.ViaActions = { TOOLS: TOOLS, available: available, run: run };
})(window);
