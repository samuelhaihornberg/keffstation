// src/bllm-d02-comprehension.js — Domaine D2 COMPREHENSION : 10 blocs B011-B020 (M1).
// Pur, sans réseau, sans LLM. Blocs LOGIQUES (exactement 10 règles), pas des bots.
// Définitions : bllm-registre-A.js. Liaisons COS sortantes en `cos` (documentées).
'use strict';
var DOMAINE = { id: 'D2', nom: 'COMPREHENSION', matrice: 'M1' };
var NOYAU = ['019','020','021','022','023','024','025','026','029','030'];
var BLOCS = [
{ id: 'B011', nom: 'COMPREHENSION/CMP-INTENTION', pivot: '019', regles: ['019','020','021','022','023','024','025','026','029','030'], cos: ['019 to 002'], limites: 'jamais d\u2019intention inventée' },
{ id: 'B012', nom: 'COMPREHENSION/CMP-CAUSES', pivot: '020', regles: ['019','020','021','022','023','024','025','026','029','030'], cos: ['020 to 063'], limites: 'pas de psychologie inférée' },
{ id: 'B013', nom: 'COMPREHENSION/CMP-TEMPS', pivot: '021', regles: ['019','020','021','022','023','024','025','026','029','030'], cos: ['021 to 048'], limites: 'jamais de date inventée' },
{ id: 'B014', nom: 'COMPREHENSION/CMP-RELATIONS', pivot: '022', regles: ['019','020','021','022','023','024','025','026','029','030'], cos: ['022 to 063'], limites: 'relations du texte seul' },
{ id: 'B015', nom: 'COMPREHENSION/CMP-ENTITES', pivot: '023', regles: ['019','020','021','022','023','024','025','026','029','030'], cos: ['023 to 033','023 to 045'], limites: 'candidats, pas identités' },
{ id: 'B016', nom: 'COMPREHENSION/CMP-ACTES', pivot: '024', regles: ['019','020','021','022','023','024','025','026','029','030'], cos: ['024 to 064'], limites: 'actes demandés, jamais exécutés' },
{ id: 'B017', nom: 'COMPREHENSION/CMP-SENTIMENT', pivot: '025', regles: ['019','020','021','022','023','024','025','026','029','030'], cos: ['025 to 057'], limites: 'perçu, pas ressenti' },
{ id: 'B018', nom: 'COMPREHENSION/CMP-AMBIGUITE', pivot: '026', regles: ['019','020','021','022','023','024','025','026','029','030'], cos: ['026 to 010','026 to 077'], limites: 'signale, ne tranche pas (077 arbitre)' },
{ id: 'B019', nom: 'COMPREHENSION/LAN-DETECT', pivot: '029', regles: ['019','020','021','022','023','024','025','026','029','030'], cos: ['029 to 031','029 to 102'], limites: 'détection, pas traduction' },
{ id: 'B020', nom: 'COMPREHENSION/LAN-MIXTE', pivot: '030', regles: ['019','020','021','022','023','024','025','026','029','030'], cos: ['030 to 031'], limites: 'marqueur seul' }
];
if (typeof module !== 'undefined' && module.exports) module.exports = { DOMAINE: DOMAINE, NOYAU: NOYAU, BLOCS: BLOCS };
