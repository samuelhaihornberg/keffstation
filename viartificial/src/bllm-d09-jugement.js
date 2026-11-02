// src/bllm-d09-jugement.js — Domaine D9 JUGEMENT-SOCIAL : 10 blocs B081-B090 (M1).
// Pur, sans réseau, sans LLM. Blocs LOGIQUES (exactement 10 règles), pas des bots.
// Définitions : bllm-registre-B.js. Liaisons COS sortantes en `cos` (documentées).
'use strict';
var DOMAINE = { id: 'D9', nom: 'JUGEMENT-SOCIAL', matrice: 'M1' };
var NOYAU = ['051','052','053','054','055','056','059','060','062','094'];
var BLOCS = [
{ id: 'B081', nom: 'JUGEMENT/PHI-VERIFIE', pivot: '051', regles: ['051','052','053','054','055','056','059','060','062','094'], cos: ['051 to 087'], limites: 'agrégat, ne corrige pas' },
{ id: 'B082', nom: 'JUGEMENT/PHI-TUTOIEMENT', pivot: '052', regles: ['051','052','053','054','055','056','059','060','062','094'], cos: ['052 to 062'], limites: 'pas de leçon affichée' },
{ id: 'B083', nom: 'JUGEMENT/PHI-SALUTATION', pivot: '053', regles: ['051','052','053','054','055','056','059','060','062','094'], cos: ['053 to 060'], limites: '053 juge, 060 vérifie relance' },
{ id: 'B084', nom: 'JUGEMENT/PHI-REPETITION', pivot: '054', regles: ['051','052','053','054','055','056','059','060','062','094'], cos: ['036 to 054'], limites: 'répétition avérée seule' },
{ id: 'B085', nom: 'JUGEMENT/PHI-PERTINENCE', pivot: '055', regles: ['051','052','053','054','055','056','059','060','062','094'], cos: ['051 to 055'], limites: 'pertinence, pas vérité terrain' },
{ id: 'B086', nom: 'JUGEMENT/PHI-GRAMMAIRE', pivot: '056', regles: ['051','052','053','054','055','056','059','060','062','094'], cos: ['056 to 079'], limites: 'renvoie vers correction' },
{ id: 'B087', nom: 'JUGEMENT/REG-LONGUEUR', pivot: '059', regles: ['051','052','053','054','055','056','059','060','062','094'], cos: ['087 to 059'], limites: 'jamais de coupe de sens' },
{ id: 'B088', nom: 'JUGEMENT/REG-RELANCE', pivot: '060', regles: ['051','052','053','054','055','056','059','060','062','094'], cos: ['053 to 060'], limites: 'jamais forcée hors salutation' },
{ id: 'B089', nom: 'JUGEMENT/REG-VOUVOIEMENT', pivot: '062', regles: ['051','052','053','054','055','056','059','060','062','094'], cos: ['052 to 062'], limites: 'garde dure fr' },
{ id: 'B090', nom: 'JUGEMENT/AMI-BINOME', pivot: '093', regles: ['051','052','053','054','055','056','059','060','062','094'], cos: ['096 to 093'], limites: '096 dose, 093 relit ; 1 phrase max' }
];
if (typeof module !== 'undefined' && module.exports) module.exports = { DOMAINE: DOMAINE, NOYAU: NOYAU, BLOCS: BLOCS };
