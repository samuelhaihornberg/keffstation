// src/blm-usages.js — NOUVEAU 2026-11-03 : coutumes et usages (REG 057/058/061,
// SAV 045/046 comme aide interne), réponse attendue (060/053/074), formulation
// (068/069). Pur, sans réseau, sans LLM. Correspondances BLM indiquées :
// reconnaissance = 019-028 (CMP, blm-comprehension) ; usages = 057/058/061 ;
// aide dico = 045/046 (SAV, jamais récitée) ; suite = 060/053/074 ;
// formulation finale = 068/069 (RSN, sysPrompt + moteur).
// Règles : les dictionnaires aident à CHOISIR, jamais à réciter (aucune
// définition/traduction/liste n'est affichée ni transmise telle quelle au
// moteur, sauf UN fait étiqueté via le mécanisme existant formulerEntreeClasse).
// Un seul texte final ; formule et suite restent internes (jamais ajoutées
// bout à bout, jamais affichées). Ne touche à aucune personnalité.
'use strict';
var SALUT_SEUL = /^(salut|bonjour|bonsoir|coucou|hello|yo|hey|bienvenue)[,!.\s…]*$/i;
var MARQUEURS_LINGUISTIQUE = ['veux dire', 'veut dire', 'signifie', 'signification', 'traduire', 'traduction', 'comment on dit', 'comment dit-on', 'orthographe', 'conjugaison', 'grammaire', 'ça veut dire', 'ca veut dire', 'c est quoi', 'quest ce que', 'qu est ce que', 'expression', 'synonyme', 'contraire de'];
function norme(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
// 1. Reconnaissance : salut simple vs explication linguistique vs ordinaire.
function distinguerDemande(texte) {
  var t = String(texte || '').trim();
  if (!t) return 'conversation-ordinaire';
  var n = ' ' + norme(t) + ' ';
  var linguistique = MARQUEURS_LINGUISTIQUE.some(function (m) { return n.indexOf(m) >= 0; });
  if (linguistique) return 'explication-linguistique';
  if (SALUT_SEUL.test(t)) return 'salutation-simple';
  return 'conversation-ordinaire';
}
// 2. Coutumes : formule habituelle brève + relance, par langue (table
// sociale ordinaire, pas un exemple unique hardcodé). Interne uniquement.
var FORMULES = {
  fr: ['Salut ! Ça va bien, merci 😊 Et toi, comment tu vas ?', 'Coucou ! Ravi de te voir 😊 Quoi de neuf ?', 'Bonjour ! Content de te lire 😊 Tu viens pour quoi ?'],
  en: ['Hi! Doing well, thanks 😊 How about you?', 'Hello! Great to see you 😊 What brings you here?']
};
function choisirFormule(demandeType, langue, texte) {
  var l = langue === 'en' ? 'en' : 'fr';
  var table = FORMULES[l] || FORMULES.fr;
  var h = 0, s = String(texte || '') + '|' + String(demandeType || '');
  for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  var f = table[h % table.length];
  var q = f.indexOf('?');
  return { formule: q >= 0 ? f.slice(0, q + 1).trim() : f, relance: true, ton: 'convivial', langue: l };
}
// 3. Suite attendue : type estimé, objet jamais affiché ni promis.
function estimerSuite(demandeType, intention, contexteN) {
  if (/(au revoir|adieu|bonne nuit|bye|a plus)/i.test(String(demandeType || ''))) return { type: 'conclure' };
  if (demandeType === 'salutation-simple' || intention === 'salutation') return { type: 'inviter-repondre' };
  if (intention === 'question') return { type: (contexteN || 0) > 0 ? 'poursuivre-sujet' : 'inviter-repondre' };
  return { type: 'poursuivre-sujet' };
}
// 103 LAN-TRADUIRE : verbe de traduction + langue cible explicites (exige les
// deux ; « En parlant en français » seul ne déclenche pas).
var MARQUEURS_TRADUIRE = ['traduis', 'traduction', 'traduit', 'translate', 'comment on dit', 'comment dit-on'];
var LANGUES_CIBLES = [['anglais', 'en'], ['francais', 'fr'], ['français', 'fr'], ['espagnol', 'es'], ['allemand', 'de'], ['italien', 'it']];
function traductionDemandee(texte) {
  var n = ' ' + norme(texte) + ' ';
  var verbe = MARQUEURS_TRADUIRE.some(function (m) { return n.indexOf(m) >= 0; });
  if (!verbe) return { demande: false, vers: null };
  for (var i = 0; i < LANGUES_CIBLES.length; i++) {
    if (n.indexOf(LANGUES_CIBLES[i][0]) >= 0) return { demande: true, vers: LANGUES_CIBLES[i][1] };
  }
  return { demande: false, vers: null };
}
// 096 AMI-CHALEUR : chaleur dosée (convivial sans mièvrerie). Vérifie les
// propriétés DÉJÀ établies ailleurs (062 tutoiement, brièveté des contraintes,
// relance 060) : aucun seuil inventé. Interne, jamais affiché.
function doserChaleur(formule, langue) {
  var t = String((formule && formule.formule) || '');
  if (!t) return { ok: false, motif: 'formule-vide' };
  if (t.length > 280) return { ok: false, motif: 'trop-longue' };
  if ((langue || 'fr') === 'fr' && /\bvous\b/i.test(t)) return { ok: false, motif: 'vouvoiement' };
  if (!/\?\s*$/.test(t.trim())) return { ok: false, motif: 'sans-relance' };
  return { ok: true, motif: 'chaleur-dosee' };
}
module.exports = { distinguerDemande: distinguerDemande, choisirFormule: choisirFormule, estimerSuite: estimerSuite, traductionDemandee: traductionDemandee, doserChaleur: doserChaleur, FORMULES: FORMULES };
