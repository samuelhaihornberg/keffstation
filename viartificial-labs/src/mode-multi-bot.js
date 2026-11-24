// src/mode-multi-bot.js — Mode « All Bots in One » pour ViArtificial Labs.
// En mode multi-bot, VIA orchestre une réponse commune où les bots interviennent à tour de rôle.
// Le mode conversation habituel reste VIA seule.
'use strict';
(function (global) {
  var MODE_KEY = 'via-mode-multi-bot';
  var BOTS_MULTI = ['via', 'golemotor', 'btb', 'theo', 'guideoplan'];

  // Spécialités par bot pour le routage
  var SPECIALITES = {
    via: { domaines: ['conversation', 'sociabilite', 'coordination', 'synthese'], role: 'introduit et coordonne' },
    golemotor: { domaines: ['code', 'mecanique', 'ingenierie', 'architecture'], role: 'code, mécanismes et ingénierie' },
    btb: { domaines: ['science', 'physique', 'analyse', 'technique'], role: 'science, physique et analyse technique' },
    theo: { domaines: ['lecture', 'narration', 'explication', 'traduction', 'education'], role: 'lecture, narration, explication ou traduction' },
    guideoplan: { domaines: ['planification', 'projet', 'loisir', 'organisation', 'suivi'], role: 'planification personnelle, professionnelle, projets et loisirs' }
  };

  function estActif() {
    try { return localStorage.getItem(MODE_KEY) === '1'; } catch (e) { return false; }
  }
  function activer() { try { localStorage.setItem(MODE_KEY, '1'); } catch (e) {} }
  function desactiver() { try { localStorage.setItem(MODE_KEY, '0'); } catch (e) {} }

  // Déterminer l'ordre des bots selon le domaine de la demande
  function ordonnerBots(texte) {
    var t = (texte || '').toLowerCase();
    var ordre = [];
    // VIA toujours en premier (introduction)
    ordre.push('via');
    // Détecter le domaine
    var domainesDetectes = [];
    if (/code|mecanique|moteur|architecture|ingenierie|developpement/i.test(t)) domainesDetectes.push('golemotor');
    if (/science|physique|analyse|technique|calcul|formule/i.test(t)) domainesDetectes.push('btb');
    if (/lecture|narration|histoire|traduction|expliquer|raconter/i.test(t)) domainesDetectes.push('theo');
    if (/plan|projet|organiser|planning|loisir|hobby|objectif/i.test(t)) domainesDetectes.push('guideoplan');
    // Si aucun domaine détecté, inclure tous les bots
    if (domainesDetectes.length === 0) domainesDetectes = ['golemotor', 'btb', 'theo', 'guideoplan'];
    // Ajouter les bots détectés (sans doublons)
    domainesDetectes.forEach(function (b) {
      if (ordre.indexOf(b) < 0) ordre.push(b);
    });
    // Guideoplan toujours en dernier (synthèse/planification)
    if (ordre.indexOf('guideoplan') >= 0 && ordre[ordre.length - 1] !== 'guideoplan') {
      ordre = ordre.filter(function (b) { return b !== 'guideoplan'; });
      ordre.push('guideoplan');
    }
    return ordre;
  }

  // Générer la contribution d'un bot (prompt système adapté)
  function genererContribution(botId, texte, contextePrecedent) {
    var bot = (global.botsById && global.botsById[botId]) || { id: botId, name: botId };
    var specialite = SPECIALITES[botId] ? SPECIALITES[botId].role : '';
    var ctx = contextePrecedent ? 'Contexte précédent : ' + contextePrecedent.slice(0, 200) + '\n' : '';
    return {
      botId: botId,
      nom: bot.name || botId,
      specialite: specialite,
      prompt: ctx + 'Tu es ' + (bot.name || botId) + '. ' + (bot.specialty || '') + ' ' + (bot.personality || '') +
        ' Réponds en français, court (2-3 phrases). ' + specialite + '. ' +
        'Appuie-toi sur ce qui précède, apporte un élément distinct, ne répète pas les autres.',
      contextePrecedent: contextePrecedent
    };
  }

  // Synthèse finale par VIA
  function syntheseVIA(contributions) {
    var texte = contributions.filter(function (c) { return c && c.texte; }).map(function (c) { return c.texte; }).join(' ');
    if (texte.length > 500) texte = texte.slice(0, 500) + '…';
    return texte;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { estActif: estActif, activer: activer, desactiver: desactiver, ordonnerBots: ordonnerBots, genererContribution: genererContribution, syntheseVIA: syntheseVIA, BOTS_MULTI: BOTS_MULTI, SPECIALITES: SPECIALITES };
  }
  if (typeof window !== 'undefined') {
    window.ViaModeMultiBot = { estActif: estActif, activer: activer, desactiver: desactiver, ordonnerBots: ordonnerBots, genererContribution: genererContribution, syntheseVIA: syntheseVIA, BOTS_MULTI: BOTS_MULTI, SPECIALITES: SPECIALITES };
  }
})(typeof window !== 'undefined' ? window : global);