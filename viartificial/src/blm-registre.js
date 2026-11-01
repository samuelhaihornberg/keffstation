// src/blm-registre.js — ton et contraintes de formulation.
// Règles reprises à l'identique du parcours (aucun comportement changé).
// La consigne finale reste assemblée dans sysPrompt (providers/local-wasm).
'use strict';
function blmChoisirTon(personality, intention) {
  var p = String(personality || '');
  var ton = /drôle|fun|taquin|iron|enjoué/i.test(p) ? 'enjoue' : 'neutre';
  if (intention === 'salutation') ton = 'convivial';
  return ton;
}
function blmContraintes() {
  return ['tutoiement, jamais de « vous »', 'pas de preuve de conscience',
    'réponse courte, une relance si salutation'];
}
function blmAutoriserHumour(personality, botId) {
  // 061 REG-HUMOUR — touche d'humour autorisée seulement si la personnalité
  // du bot est taquine ET dans le cadre du binôme simulé (relecture xread,
  // câblée en S5). Jamais de moquerie : la vérification finale tranche.
  var p = String(personality || '');
  var taquin = /drôle|fun|taquin|iron|enjoué/i.test(p);
  var binome = /geeko|geekette/i.test(String(botId || ''));
  return taquin && binome;
}
module.exports = { choisirTon: blmChoisirTon, contraintes: blmContraintes, autoriserHumour: blmAutoriserHumour };
