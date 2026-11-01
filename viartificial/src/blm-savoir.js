// src/blm-savoir.js — savoir local S3 (045–050), pur, sans réseau.
// Base injectée (aucune donnée embarquée) : { faits: {sujet: {texte, source}},
// definitions: {mot: def}, etats: {bot: etat} }. Tout fait sans source est
// étiqueté ; sujet inconnu → vide (050 : jamais d'hallucination).
// Câblage au parcours (via RSN) : S4. Ici : modules + batterie S3.
'use strict';
function normeSavoir(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
function cleSujet(sujet) { return normeSavoir(sujet).slice(0, 120); }
function chercherFait(sujet, base) {
  // 045 SAV-FAITS — fait local exact sur le sujet, source exigée (049).
  var b = base || {}, faits = b.faits || {};
  var f = faits[cleSujet(sujet)] || faits[normeSavoir(sujet).split(' ')[0]];
  if (!f || !String(f.texte || '').trim()) return null;
  return { texte: String(f.texte).slice(0, 500), source: String(f.source || 'locale-non-verifiee').slice(0, 120) };
}
function definirMot(mot, base) {
  // 046 SAV-DICOS — définition locale, vide si absente.
  var b = base || {}, d = b.definitions || {};
  var v = d[normeSavoir(mot)];
  return v ? String(v).slice(0, 300) : '';
}
function etatDe(botId, base) {
  // 047 SAV-ETATS — états scopés par bot, jamais mélangés.
  var b = base || {}, e = b.etats || {};
  var v = e[String(botId || 'courant')];
  return v === undefined ? null : v;
}
function daterFait(fait) {
  // 048 SAV-DATES — repère repris tel quel s'il est fourni, jamais inventé.
  if (!fait) return null;
  return fait.depuis ? String(fait.depuis).slice(0, 20) : null;
}
module.exports = { chercherFait: chercherFait, definirMot: definirMot, etatDe: etatDe, daterFait: daterFait };
