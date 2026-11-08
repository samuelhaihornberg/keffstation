// src/blm-routage.js — ORC-ROUTAGE (002, étape 1→2).
// Pur (aucun DOM) : intention (+ périmètre) → plan de blocs à activer.
// L'orchestrateur calcule le plan et le trace ; l'activation effective des
// étapes S3+ reste du ressort du parcours (le plan ne coupe rien seul).
// Seule la salutation + périmètre connu dispensent de moteur.
'use strict';
var PLAN_SALUTATION = ['019', '035', '057'];
var PLAN_MINIMAL = ['019', '035'];
var PLAN_REPLI = ['019', '028'];
var PLAN_STANDARD = ['019', '020', '021', '022', '023', '024', '029', '035', '036', '038',
  '057', '063', '064', '065', '069', '071', '079', '087'];
function planifierBlocs(intention, opts) {
  var o = opts || {};
  if (o.perimetre === false) return { blocs: PLAN_REPLI.slice(), minimal: true, moteur: false, motif: 'hors-perimetre' };
  if (intention === 'salutation') return { blocs: PLAN_SALUTATION.slice(), minimal: false, moteur: !!o.forcerMoteur, motif: o.forcerMoteur ? 'salutation-avec-moteur' : 'salutation-sans-moteur' };
  if (intention === 'question' || intention === 'message') return { blocs: PLAN_STANDARD.slice(), minimal: false, moteur: true, motif: 'parcours-standard' };
  return { blocs: PLAN_MINIMAL.slice(), minimal: true, moteur: false, motif: 'intention-nulle' };
}
module.exports = { planifierBlocs: planifierBlocs, PLAN_SALUTATION: PLAN_SALUTATION, PLAN_MINIMAL: PLAN_MINIMAL, PLAN_REPLI: PLAN_REPLI, PLAN_STANDARD: PLAN_STANDARD };
