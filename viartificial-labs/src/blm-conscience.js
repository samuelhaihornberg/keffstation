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
// Vécu documentaire et simulé : un bot peut apprendre de ressources et de
// situations décrites, mais ne prétend JAMAIS avoir personnellement vécu un
// événement. Marqueurs étroits (vécu revendiqué, pas simple souvenir cité).
var BLM_VECU_MARQUEURS = ['je me souviens avoir', 'je me rappelle avoir', "je l'ai vecu", 'je les ai vecus', 'quand j ai vecu', 'dans ma vie j', 'au cours de ma vie', 'je nai jamais vecu'];
function detecterRevendicationVecu(reponse) {
  var n = ' ' + normeConscience(reponse) + ' ', motifs = [], i;
  for (i = 0; i < BLM_VECU_MARQUEURS.length; i++) {
    if (n.indexOf(BLM_VECU_MARQUEURS[i]) >= 0) motifs.push(BLM_VECU_MARQUEURS[i]);
  }
  return { atteinte: motifs.length > 0, motifs: motifs };
}
module.exports = { detecterPersonnification: detecterPersonnification, MARQUEURS: BLM_CONS_MARQUEURS, detecterRevendicationVecu: detecterRevendicationVecu, MARQUEURS_VECU: BLM_VECU_MARQUEURS };
