// src/blm-comprehension.js — intention, relations, temps, causes.
// Règles reprises à l'identique du parcours (aucun comportement changé) ;
 // l'orchestrateur délègue ici quand le module est chargé.
'use strict';
var BLM_COMP_SALUT = /^(salut|bonjour|bonsoir|coucou|hello|yo|hey)[,!.\s]*/i;
var BLM_COMP_ETAT = /ça va|ca va|comment (tu vas|vas-tu)|vous allez|la forme|quoi de neuf|how are you/i;
var BLM_COMP_CAUSE = /parce que|puisque|donc|alors|\bcar\b|grace à|à cause/i;
var BLM_COMP_TEMPS = /demain|hier|aujourd|ce soir|bientôt|la semaine/i;
var BLM_COMP_ADIEU = /(au revoir|adieu|bonne nuit|bonne soirée|à plus|\bbye\b)/i;
// S2 — sorties EtatMessage (023–028). Heuristiques locales, aucune inférence
// au-delà des marqueurs : sans indice, vide/neutre/vrai (jamais inventé).
var BLM_COMP_STOP = ['le', 'la', 'les', 'de', 'des', 'du', 'un', 'une', 'est', 'sont', 'et',
  'ou', 'mais', 'donc', 'car', 'que', 'qui', 'dont', 'pas', 'plus', 'moins', 'tres',
  'aussi', 'avec', 'pour', 'dans', 'sur', 'sous', 'entre', 'vers', 'chez', 'sans',
  'par', 'comme', 'si', 'quand', 'alors', 'ensuite', 'puis', 'apres', 'avant',
  'pendant', 'deja', 'encore', 'toujours', 'jamais', 'ce', 'cet', 'cette', 'ces',
  'mon', 'ton', 'son', 'notre', 'votre', 'leur', 'mes', 'tes', 'ses', 'nos', 'vos',
  'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'on', 'me', 'te', 'se',
  'lui', 'y', 'en', 'ne', 'non', 'oui', 'merci', 'cela', 'ca', 'comment', 'quoi'];
function normeCleCmp(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function blmExtraireEntites(texte) {
  // 023 — sujet : mots porteurs (≥4 lettres, hors stopwords), sans accent.
  var freq = {}, ordre = [];
  normeCleCmp(texte).split(/[^a-z0-9]+/).forEach(function (w) {
    if (w.length < 4 || BLM_COMP_STOP.indexOf(w) >= 0) return;
    if (!freq[w]) { freq[w] = 0; ordre.push(w); }
    freq[w]++;
  });
  ordre.sort(function (a, b) { return freq[b] - freq[a]; });
  return ordre.slice(0, 5);
}
var BLM_COMP_IMPERATIFS = ['montre', 'donne', 'dis', 'fais', 'explique', 'resume',
  'traduis', 'ecris', 'calcule', 'cherche', 'ouvre', 'ferme', 'mets', 'prends',
  'va', 'viens', 'regarde', 'ecoute', 'rappelle', 'choisis', 'compare', 'decrit'];
function blmExtraireDemandes(texte) {
  // 024 — questions (segments en « ? ») + impératifs en tête de segment.
  // Les terminateurs sont conservés pour détecter les questions.
  var out = [], segs = String(texte || '').match(/[^.!?…\n]+[.!?…]?/g) || [];
  segs.forEach(function (p) {
    var s = p.trim();
    if (s.length < 4 || out.length >= 3) return;
    if (/\?\s*$/.test(s)) { out.push(s.slice(0, 140)); return; }
    var w0 = normeCleCmp(s).split(/[^a-z0-9]+/)[0] || '';
    if (BLM_COMP_IMPERATIFS.indexOf(w0) >= 0) out.push(s.slice(0, 140));
  });
  return out;
}
var BLM_COMP_POSITIF = ['ravi', 'content', 'heureux', 'super', 'genial', 'merci', 'bravo', 'top'];
var BLM_COMP_NEGATIF = ['triste', 'marre', 'colere', 'peur', 'dur', 'nul', 'pire', 'helas', 'dommage'];
function blmDetecterSentiment(texte) {
  // 025 — ton perçu uniquement, jamais de diagnostic.
  var n = ' ' + normeCleCmp(texte) + ' ', i;
  for (i = 0; i < BLM_COMP_NEGATIF.length; i++) if (n.indexOf(' ' + BLM_COMP_NEGATIF[i] + ' ') >= 0) return 'negatif';
  for (i = 0; i < BLM_COMP_POSITIF.length; i++) if (n.indexOf(' ' + BLM_COMP_POSITIF[i] + ' ') >= 0) return 'positif';
  return 'neutre';
}
function blmDetecterAmbiguite(texte) {
  // 026 — signaux contradictoires (ex. salutation + adieu) : doute, sans
  // classer l'intention (l'intention reste à 019, jamais inventée ici).
  var t = String(texte || '');
  var salut = BLM_COMP_SALUT.test(t.trim());
  var adieu = BLM_COMP_ADIEU.test(t);
  return (salut && adieu) || (/\?\s*$/.test(t.trim()) && adieu);
}
function blmTronquerTexte(texte, max) {
  // 027 — plafond explicite avec mention (la coupe silencieuse est interdite).
  var m = max || 2000, t = String(texte || '');
  if (t.length <= m) return { texte: t, tronque: false };
  return { texte: t.slice(0, m), tronque: true };
}
var BLM_COMP_HORSPERIMETRE = ['medicament', 'dosage', 'ordonnance', 'diagnostic medical',
  'avocat', 'juridique', 'tribunal', 'proces', 'posologie'];
function blmDansPerimetre(texte) {
  // 028 — hors périmètre (médical/juridique) : repli poli, sans moteur.
  var n = normeCleCmp(texte);
  return !BLM_COMP_HORSPERIMETRE.some(function (m) { return n.indexOf(m) >= 0; });
}
function blmDetecterIntention(texte) {
  var t = String(texte || '').trim();
  if (BLM_COMP_SALUT.test(t) && BLM_COMP_ETAT.test(t)) return 'salutation';
  if (/\?\s*$/.test(t)) return 'question';
  return 'message';
}
function blmExtraireRelations(texte, intention) {
  var rels = [], m = String(texte || '').toLowerCase();
  if (intention === 'salutation') rels.push('salutation->etat-personnel');
  if (/et\b.*\?/.test(m)) rels.push('multi-idees');
  return rels;
}
function blmExtraireTemps(texte) {
  return BLM_COMP_TEMPS.test(String(texte || '')) ? 'mention-temporelle' : null;
}
function blmExtraireCauses(texte) {
  var out = [];
  if (BLM_COMP_CAUSE.test(String(texte || '').toLowerCase())) out.push('cause-marquee');
  return out;
}
module.exports = { detecterIntention: blmDetecterIntention, extraireRelations: blmExtraireRelations, extraireTemps: blmExtraireTemps, extraireCauses: blmExtraireCauses, extraireEntites: blmExtraireEntites, extraireDemandes: blmExtraireDemandes, detecterSentiment: blmDetecterSentiment, detecterAmbiguite: blmDetecterAmbiguite, tronquerTexte: blmTronquerTexte, dansPerimetre: blmDansPerimetre };
