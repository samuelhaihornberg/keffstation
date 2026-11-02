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
// Question sociale seule (« Ça va ? ») : attend une réponse, pas une relance.
var QUESTION_SOCIALE = /^(ca va|comment tu vas|comment vas tu|comment allez vous|la forme|quoi de neuf|how are you)[?!.\s…]*$/;
var MARQUEURS_LINGUISTIQUE = ['veux dire', 'veut dire', 'signifie', 'signification', 'traduire', 'traduction', 'comment on dit', 'comment dit-on', 'orthographe', 'conjugaison', 'grammaire', 'ça veut dire', 'ca veut dire', 'c est quoi', 'quest ce que', 'qu est ce que', 'expression', 'synonyme', 'contraire de'];
function norme(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
// 1. Reconnaissance : salut simple vs question sociale (« Ça va ? » seul)
// vs explication linguistique vs ordinaire.
function distinguerDemande(texte) {
  var t = String(texte || '').trim();
  if (!t) return 'conversation-ordinaire';
  var n = ' ' + norme(t) + ' ';
  var linguistique = MARQUEURS_LINGUISTIQUE.some(function (m) { return n.indexOf(m) >= 0; });
  if (linguistique) return 'explication-linguistique';
  if (QUESTION_SOCIALE.test(norme(t).trim())) return 'question-sociale';
  if (SALUT_SEUL.test(t)) return 'salutation-simple';
  return 'conversation-ordinaire';
}
// 2. Coutumes : formule adaptée au type de demande, par langue. Règle de
// sociabilité : un salut simple reçoit un salut bref et chaleureux, SANS
// présupposer une question (« ne prétend pas qu'on lui a demandé ») et SANS
// relance automatique. Une question sociale reçoit une réponse brève, pas un
// cours. Tables courtes et fixes (pas de texte fabriqué). Interne uniquement.
var FORMULES = {
  fr: ['Salut ! Très content de te voir 😊', 'Coucou ! Ça fait plaisir de te lire 😊', 'Bonjour ! Bienvenue à toi 😊'],
  en: ['Hello! Great to see you 😊', 'Hello! Happy to see you 😊', 'Hi! Welcome 😊']
};
var FORMULES_REPONSE = {
  fr: ['Ça va bien, merci ! 😊', 'Très bien, merci ! 😊', 'Super bien, merci ! 😊'],
  en: ['Doing well, thanks! 😊', 'Great, thanks! 😊']
};
function choisirFormule(demandeType, langue, texte) {
  var l = langue === 'en' ? 'en' : 'fr';
  var table = demandeType === 'question-sociale' ? (FORMULES_REPONSE[l] || FORMULES_REPONSE.fr) : (FORMULES[l] || FORMULES.fr);
  var h = 0, s = String(texte || '') + '|' + String(demandeType || '');
  for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  var f = table[h % table.length];
  return { formule: f, relance: /\?\s*$/.test(f.trim()), ton: 'convivial', langue: l };
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
// propriétés DÉJÀ établies ailleurs (062 tutoiement, brièveté 280c du contrat,
// relance 060 quand le type de demande l'exige) : aucun seuil inventé.
// Pour un salut simple : pas de relance exigée, mais la formule doit saluer
// sans présupposer une question. Interne, jamais affiché.
var PRESUPPOSE_QUESTION = /ça va bien|et toi/i;
function doserChaleur(formule, langue, demandeType) {
  var t = String((formule && formule.formule) || '');
  if (!t) return { ok: false, motif: 'formule-vide' };
  if (t.length > 280) return { ok: false, motif: 'trop-longue' };
  if ((langue || 'fr') === 'fr' && /\bvous\b/i.test(t)) return { ok: false, motif: 'vouvoiement' };
  if (demandeType === 'salutation-simple') {
    if (!/salut|bonjour|coucou|hello|bienvenue/i.test(t)) return { ok: false, motif: 'sans-salutation' };
    if (PRESUPPOSE_QUESTION.test(t)) return { ok: false, motif: 'presuppose-question' };
    return { ok: true, motif: 'chaleur-dosee' };
  }
  if (demandeType === 'question-sociale') return { ok: true, motif: 'chaleur-dosee' };
  if (!/\?\s*$/.test(t.trim())) return { ok: false, motif: 'sans-relance' };
  return { ok: true, motif: 'chaleur-dosee' };
}
module.exports = { distinguerDemande: distinguerDemande, choisirFormule: choisirFormule, estimerSuite: estimerSuite, traductionDemandee: traductionDemandee, doserChaleur: doserChaleur, FORMULES: FORMULES };
