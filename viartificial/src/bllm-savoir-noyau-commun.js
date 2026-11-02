// src/bllm-savoir-noyau-commun.js — Doctrine du socle de connaissances (pas un corpus).
// Pur, sans réseau, sans LLM. AUCUN livre embarqué : ni titres inventés, ni textes
// intégraux, ni liste récitée. Combine des apports SOURCÉS : ne garde que l\u2019intersection
// multi-sources et les théories vérifiables reproductibles (type 1+1=2).
// EXACT (maths/logique) : 1+1=2. VIVANT (bio/psycho/neuro/social) : garder la décimale,
// c\u2019est-à-dire la marge d\u2019incertitude explicite ; jamais arrondir le vivant à l\u2019exact.
// Priorité : socle scolaire commun d\u2019abord, puis vie sociale et sciences du vivant,
// pour répondre de la façon la plus normale : usages attestés, ton sobre, lucidité.
'use strict';
var PRIORITES = ['noyau-scolaire-commun', 'savoirs-verifies', 'dicos-locaux', 'usages-attestes', 'vie-sociale', 'psy-neuro-savoirs'];
var SEUIL_SOURCES = 2; // heuristique, à valider : min de sources indépendantes concordantes.
var CERTITUDES = [
{ domaine: 'exact', exemples: 'arithmétique, logique formelle', regle: '1+1=2, reproductible', marge: 'aucune' },
{ domaine: 'vivant', exemples: 'biologie, psychologie, psychiatrie, neurophysiologie, neurosciences, vie sociale', regle: 'garder la décimale : incertitude explicite', marge: 'obligatoire, jamais arrondie' }
];
var INTERDITS = ['corpus-embarque', 'titre-invente', 'texte-integral', 'diagnostic-utilisateur', 'etiquette-clinique', 'conseil-medical', 'numero-invente'];
// Détresse perçue : repli sobre + invitation à consulter un professionnel (sans numéro inventé),
// jamais de diagnostic, jamais d\u2019étiquette. Doc/simulé jamais souvenirs personnels (109, 111).
function combiner(apports) {
  var parCle = {};
  (apports || []).forEach(function (a) { if (!a || !a.cle || !a.source) return; (parCle[a.cle] = parCle[a.cle] || []).push(a); });
  var noyau = [], ecartes = [];
  Object.keys(parCle).forEach(function (cle) {
    var g = parCle[cle], sources = {};
    g.forEach(function (a) { sources[a.source] = 1; });
    var n = Object.keys(sources).length;
    var exact = g.every(function (a) { return a.verifiable === true; });
    if (n >= SEUIL_SOURCES || exact) noyau.push({ cle: cle, sources: n, exact: exact, vivant: g.some(function (a) { return a.vivant === true; }) });
    else ecartes.push({ cle: cle, motif: 'source-unique-non-verifiable' });
  });
  return { noyau: noyau, ecartes: ecartes };
}
if (typeof module !== 'undefined' && module.exports) module.exports = { PRIORITES: PRIORITES, SEUIL_SOURCES: SEUIL_SOURCES, CERTITUDES: CERTITUDES, INTERDITS: INTERDITS, combiner: combiner };
