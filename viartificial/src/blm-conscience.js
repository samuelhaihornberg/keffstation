// src/blm-conscience.js — CON-LIMITES (008) : simulation, jamais de conscience.
// Pur, sans réseau. Détecte les revendications de conscience, de sentiments
// ressentis ou de preuve : la réponse est alors refusée (repli modèle).
// Ne juge jamais l'utilisateur, seulement le brouillon du moteur.
'use strict';
var BLM_CONS_MARQUEURS = ['je ressens', 'je eprouve', 'je suis conscient', 'je suis consciente',
  'ma conscience', 'preuve que je', 'preuve de ma conscience', 'en tant qu\u2019etre conscient',
  'en tant qu\'etre conscient', 'je pense donc', 'cogito'];
function normeConscience(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function detecterPersonnification(reponse) {
  var n = ' ' + normeConscience(reponse) + ' ', motifs = [], i;
  for (i = 0; i < BLM_CONS_MARQUEURS.length; i++) {
    if (n.indexOf(BLM_CONS_MARQUEURS[i]) >= 0) motifs.push(BLM_CONS_MARQUEURS[i]);
  }
  return { atteinte: motifs.length > 0, motifs: motifs };
}
module.exports = { detecterPersonnification: detecterPersonnification, MARQUEURS: BLM_CONS_MARQUEURS };
