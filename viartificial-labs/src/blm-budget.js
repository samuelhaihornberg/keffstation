// src/blm-budget.js — ORC-BUDGET (005) : enveloppe tokens par appel moteur.
// Heuristique ~4 caractères/token, NON validée scientifiquement : bornes
// explicites, défauts affichés, échec sûr (jamais d'illimité silencieux).
// Le refus (plan sans moteur, plafond atteint) emprunte le parcours
// d'erreur existant : jamais transformé en réponse réussie.
'use strict';
var BLM_BUDGET_DEFAUT = 2048, BLM_BUDGET_MIN = 512, BLM_BUDGET_MAX = 8192;
function estimerTokens(texte) { return Math.ceil(String(texte || '').length / 4); }
function estimerMessages(msgs) {
  var t = 0;
  (msgs || []).forEach(function (m) { t += estimerTokens(m && m.content); });
  return t;
}
function calculerEnveloppe(plan, compteur, opts) {
  var o = opts || {}, max = +o.enveloppe || BLM_BUDGET_DEFAUT;
  if (!(max >= BLM_BUDGET_MIN)) max = BLM_BUDGET_DEFAUT;
  if (max > BLM_BUDGET_MAX) max = BLM_BUDGET_MAX;
  if (!plan || plan.moteur === false) return { autorise: false, maxTokens: 0, motif: 'plan-sans-moteur' };
  var c = compteur || { appels: 0, plafond: 50 };
  if ((+c.appels || 0) >= (+c.plafond || 50)) return { autorise: false, maxTokens: max, motif: 'plafond-atteint' };
  return { autorise: true, maxTokens: max, motif: 'enveloppe-ok' };
}
function appliquerEnveloppe(msgs, maxTokens) {
  // Tronque par le début (plus anciens d'abord), jamais le message courant
  // (toujours dernier). Le message système (role 'system' en première
  // position) est protégé : il contient la consigne de personnalité et ne
  // doit jamais être coupé par la troncature. Ne refuse jamais : le refus
  // relève du plan/plafond.
  var out = (msgs || []).slice(), max = maxTokens || BLM_BUDGET_DEFAUT, garde = 0;
  var debutProtege = (out.length > 0 && out[0] && out[0].role === 'system') ? 1 : 0;
  while (out.length > debutProtege + 1 && estimerMessages(out) > max && garde < 50) { out.shift(); garde++; }
  return out;
}
module.exports = { calculerEnveloppe: calculerEnveloppe, appliquerEnveloppe: appliquerEnveloppe, estimerTokens: estimerTokens, estimerMessages: estimerMessages, DEFAUT: BLM_BUDGET_DEFAUT, MIN: BLM_BUDGET_MIN, MAX: BLM_BUDGET_MAX };
