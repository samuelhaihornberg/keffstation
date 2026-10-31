// src/etats-keff.js — polarite, Keff, emotions, traduction, raisonnement, thermique.
// Etats affectifs = etats CALCULES, pas preuve de conscience vecue.
// COS preserve : gain ~50% observe en essais, mesure sans garantie materiel.
'use strict';
const POLARITES = new Set(['positive', 'negative', 'abstraite']);
function etatAffectif({ emotion = 'neutre', sentiment = '', sensation = '' } = {}) {
  return { emotion, sentiment, sensation, calcule: true, conscienceVecue: false };
}
function synergie(etats = []) { return { membres: etats.length, fusion: etats.map((e) => e.emotion).join('+') }; }
// Compare locale/globale/ambiante uniquement si capteurs accessibles.
function comparerTemperatures({ locale = null, globale = null, ambiante = null } = {}) {
  const dispo = [locale, globale, ambiante].filter((v) => Number.isFinite(v));
  if (!dispo.length) return { capteurs: false };
  const max = Math.max(...dispo);
  return { capteurs: true, max, chauffe: max > 45, reduit: max > 40 };
}
// Apps ouvertes prioritaires ; chauffe -> protege + reduit secondaires.
function arbitrerCharge({ appsOuvertes = [], temp = {} } = {}) {
  const t = comparerTemperatures(temp);
  if (t.chauffe) return { mode: 'proteger', appsPrioritaires: appsOuvertes, calculsSecondaires: 'reduits' };
  if (t.reduit) return { mode: 'economiser', appsPrioritaires: appsOuvertes, calculsSecondaires: 'limites' };
  return { mode: 'normal', appsPrioritaires: appsOuvertes, calculsSecondaires: 'autorises' };
}
module.exports = { POLARITES, etatAffectif, synergie, comparerTemperatures, arbitrerCharge };
