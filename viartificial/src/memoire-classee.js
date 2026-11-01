// src/memoire-classee.js — remplace restauration auto derniers messages.
// Classification : projet, intention, evolution, correction, actif, termine/bloque.
// Le lancement d'une app/page déclenche restaurerSurLancement (pas au boot).
'use strict';
const STATUTS = new Set(['actif', 'termine', 'bloque']);
const TYPES = new Set(['projet', 'intention', 'evolution', 'correction']);
function classerSouvenir(s = {}) {
  const type = TYPES.has(s.type) ? s.type : 'evolution';
  const statut = STATUTS.has(s.statut) ? s.statut : 'actif';
  return { projet: String(s.projet || 'courant'), intention: String(s.intention || ''),
    type, texte: String(s.texte || '').slice(0, 2000), statut,
    ts: s.ts || Date.now() };
}
function restaurerSurLancement(memoires, { app = '', page = '' } = {}) {
  // Seuls les actifs du projet/app/page en cours reviennent.
  const cible = String(app || page || 'courant');
  return memoires.filter((m) => m.statut === 'actif')
    .filter((m) => m.projet === cible || m.projet === 'courant')
    .slice(-8);
}
module.exports = { STATUTS, TYPES, classerSouvenir, restaurerSurLancement };
