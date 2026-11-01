// src/blm-couts.js — COU-COMPTEUR (097) + COU-PLAFOND (099).
// Compteur en mémoire de page (session) : remis à zéro au rechargement.
// 098 (distinction virtuel/réel) et 100 (bilan) relèvent de S6 : non codés ici,
// aucun appel ne les contourne (tout appel moteur passe par le compteur).
'use strict';
var BLM_PLAFOND_DEFAUT = 50;
function creerCompteur(plafond) {
  var max = (plafond === undefined || plafond === null) ? BLM_PLAFOND_DEFAUT : Math.max(0, +plafond || 0);
  var n = 0;
  return {
    compter: function () { n++; return n; },
    appels: function () { return n; },
    plafond: function () { return max; },
    depasse: function () { return n >= max; },
    reste: function () { return Math.max(0, max - n); },
    reinitialiser: function () { n = 0; return n; }
  };
}
var defaut = null;
function compteurDefaut() {
  if (!defaut) defaut = creerCompteur(BLM_PLAFOND_DEFAUT);
  return defaut;
}
function bilan(entrees, compteur) {
  // 100 COU-BILAN (+098) : synthèse bornée par message — que des comptes,
  // jamais de texte. 098 : unité explicite « crédits virtuels », distincte
  // des vrais tokens LLM (enveloppe 005).
  var c = { appels: 0, succes: 0, refus: 0, erreurs: 0, unite: 'crédits virtuels (hors tokens LLM réels)' };
  (entrees || []).forEach(function (e) {
    if (!e) return;
    if (e.issue === 'succes') c.succes++;
    else if (e.issue === 'refus') c.refus++;
    else if (e.issue === 'erreur') c.erreurs++;
  });
  try { if (compteur) c.appels = compteur.appels(); } catch (e) {}
  return c;
}
module.exports = { creerCompteur: creerCompteur, compteurDefaut: compteurDefaut, bilan: bilan, PLAFOND_DEFAUT: BLM_PLAFOND_DEFAUT };
