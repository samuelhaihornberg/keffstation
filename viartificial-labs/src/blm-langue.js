// src/blm-langue.js — langue du message (fr/en), mélange, défaut français.
// Règles reprises du parcours ; défaut « fr » (034 : jamais d'anglais imposé).
// Un seul mot anglais isolé ne fait pas basculer (030).
'use strict';
var BLM_LAN_EN = /\b(hello|how|are|you|the|and|what|thanks|please|morning|today|with|for|your|good|know|time|work|need|like|think)\b/i;
function blmDetecterLangue(t) {
  var s = String(t || '');
  if (/[àâäéèêëîïôöùûüç]/i.test(s)) return 'fr';
  if (/\b(le|la|les|des|est|une|vous|tu|que|pour|comment|avec)\b/i.test(s)) return 'fr';
  if (BLM_LAN_EN.test(s)) return 'en';
  return 'fr';
}
function blmDetecterMelange(t) {
  // 030 — mélange régulier : français ET anglais installés (≥2 du minoritaire
  // ou ≥1 de chaque sur message long) ; un terme isolé ne compte pas.
  var s = String(t || '');
  var fr = (s.match(/[àâäéèêëîïôöùûüç]/gi) || []).length
    + (s.match(/\b(le|la|les|des|est|une|vous|tu|que|pour|comment|avec|bonjour|salut|merci|oui|non)\b/gi) || []).length;
  var en = (s.match(/\b(hello|how|are|you|the|and|what|thanks|please|morning|today|with|for|your|good|know|time|work|need|like|think)\b/gi) || []).length;
  return (fr >= 1 && en >= 2) || (en >= 1 && fr >= 2) || (fr >= 3 && en >= 3);
}
module.exports = { detecterLangue: blmDetecterLangue, detecterMelange: blmDetecterMelange };
