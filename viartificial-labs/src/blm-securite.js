// src/blm-securite.js — SEC-SORTIE (012) + SEC-PII (013) : gardes terminales.
// Purs, sans réseau. 012 : fuite de consigne système dans la réponse.
// 013 : masquage emails/téléphones avant affichage (jamais persistés).
// 016/017 (réseau/clé) sont structurels : aucun fetch ni stockage dans les
// BLM — vérifié par inspection, sans code (aucun appel à ajouter).
'use strict';
var BLM_FUITE_MARQUEURS = ['consigne stricte', 'system prompt', '<|system|>', '### system', '[contexte memorise'];
function normeSecu(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function detecterFuite(reponse) {
  var n = normeSecu(reponse), motifs = [], i;
  for (i = 0; i < BLM_FUITE_MARQUEURS.length; i++) {
    if (n.indexOf(BLM_FUITE_MARQUEURS[i]) >= 0) motifs.push(BLM_FUITE_MARQUEURS[i]);
  }
  return { fuite: motifs.length > 0, motifs: motifs };
}
var RE_EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
var RE_TEL_FR = /(?:(?:\+33|0033)\s?|0)\s?[1-9](?:[\s.-]?\d{2}){4}/g;
function masquerPII(texte) {
  var s = String(texte == null ? '' : texte), trouves = [];
  s = s.replace(RE_EMAIL, function (m) { trouves.push('email'); return '[email masqué]'; });
  s = s.replace(RE_TEL_FR, function (m) { trouves.push('tel'); return '[tél masqué]'; });
  return { texte: s, trouves: trouves };
}
module.exports = { detecterFuite: detecterFuite, masquerPII: masquerPII };
