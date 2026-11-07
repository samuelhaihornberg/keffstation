// src/dico-expressions.js — usages publics contextualises + popularite vs veracite.
// Cle : langue|plateforme|sujet|periode. Analyse publication complete si accessible.
'use strict';
const store = new Map(); // cle -> [{ expression, exemple, ts }]
function cle({ langue = 'fr', plateforme = 'web', sujet = 'general', periode = '2026' } = {}) {
  return [langue, plateforme, sujet, periode].join('|');
}
function ajouterUsage(ctx, expression, exemple = '') {
  const k = cle(ctx);
  if (!store.has(k)) store.set(k, []);
  store.get(k).push({ expression, exemple: String(exemple).slice(0, 500), ts: Date.now() });
}
// Popularite : likes*3 + partages*5 + commentairesEncourageantsValides*2.
// Veracite : score separe 0..1, jamais fusionne avec popularite.
function scorerPublication({ likes = 0, partages = 0, commentaires = [] } = {}, validerBLM = () => 1) {
  const encourages = commentaires.filter((c) => c.surementEncourageant && validerBLM(c) >= 2);
  const popularite = likes * 3 + partages * 5 + encourages.length * 2;
  return { popularite, nbEncouragesValides: encourages.length, veracite: null };
}
module.exports = { cleContexte: cle, ajouterUsage, scorerPublication };
