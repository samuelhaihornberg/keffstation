// src/bllm-d08-correction.js — Domaine D8 CORRECTION : 10 blocs B071-B080 (M1).
// Pur, sans réseau, sans LLM. Blocs LOGIQUES (exactement 10 règles), pas des bots.
// Définitions : bllm-registre-B.js (registre-A pour 032/033). Liaisons COS en `cos`.
'use strict';
var DOMAINE = { id: 'D8', nom: 'CORRECTION', matrice: 'M1' };
var NOYAU = ['079','080','081','082','083','084','085','086','032','033'];
var BLOCS = [
{ id: 'B071', nom: 'CORRECTION/COR-ORTHO', pivot: '079', regles: ['079','080','081','082','083','084','085','086','032','033'], cos: ['079 to 080','079 to 084'], limites: 'jamais de réécriture de fond' },
{ id: 'B072', nom: 'CORRECTION/COR-ACCORDS', pivot: '080', regles: ['079','080','081','082','083','084','085','086','032','033'], cos: ['079 to 080'], limites: 'accords seuls' },
{ id: 'B073', nom: 'CORRECTION/COR-PONCTUATION', pivot: '081', regles: ['079','080','081','082','083','084','085','086','032','033'], cos: ['079 to 081'], limites: 'sobre' },
{ id: 'B074', nom: 'CORRECTION/COR-ANGLAIS', pivot: '082', regles: ['079','080','081','082','083','084','085','086','032','033'], cos: ['079 to 082'], limites: 'en seul' },
{ id: 'B075', nom: 'CORRECTION/COR-NOMS', pivot: '083', regles: ['079','080','081','082','083','084','085','086','032','033'], cos: ['033 to 083'], limites: 'intacts même si correction voudrait normaliser' },
{ id: 'B076', nom: 'CORRECTION/COR-DOUTE', pivot: '084', regles: ['079','080','081','082','083','084','085','086','032','033'], cos: ['077 to 084'], limites: '077 arbitre global, 084 conserve local' },
{ id: 'B077', nom: 'CORRECTION/COR-INCHANGE', pivot: '085', regles: ['079','080','081','082','083','084','085','086','032','033'], cos: ['079 to 085'], limites: 'intact strict' },
{ id: 'B078', nom: 'CORRECTION/COR-TRACE', pivot: '086', regles: ['079','080','081','082','083','084','085','086','032','033'], cos: ['086 to 001'], limites: 'passive, jamais d\u2019appel sortant' },
{ id: 'B079', nom: 'CORRECTION/LAN-CITATIONS', pivot: '032', regles: ['079','080','081','082','083','084','085','086','032','033'], cos: ['087 to 032'], limites: 'langue d\u2019origine' },
{ id: 'B080', nom: 'CORRECTION/LAN-NOMSPROPRES', pivot: '033', regles: ['079','080','081','082','083','084','085','086','032','033'], cos: ['023 to 033'], limites: '023 extrait, 033 protège' }
];
if (typeof module !== 'undefined' && module.exports) module.exports = { DOMAINE: DOMAINE, NOYAU: NOYAU, BLOCS: BLOCS };
