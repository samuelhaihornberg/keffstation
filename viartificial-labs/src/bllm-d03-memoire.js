// src/bllm-d03-memoire.js — Domaine D3 MEMOIRE : 10 blocs B021-B030 (M1).
// Pur, sans réseau, sans LLM. Blocs LOGIQUES (exactement 10 règles), pas des bots.
// Définitions : bllm-registre-A.js. Liaisons COS sortantes en `cos` (documentées).
'use strict';
var DOMAINE = { id: 'D3', nom: 'MEMOIRE', matrice: 'M1' };
var NOYAU = ['035','036','037','038','039','040','041','042','043','044'];
var BLOCS = [
{ id: 'B021', nom: 'MEMOIRE/MEM-CLASSE', pivot: '035', regles: ['035','036','037','038','039','040','041','042','043','044'], cos: ['003 to 035','035 to 106'], limites: 'classé, jamais supposé' },
{ id: 'B022', nom: 'MEMOIRE/MEM-RESTAURE', pivot: '036', regles: ['035','036','037','038','039','040','041','042','043','044'], cos: ['036 to 069'], limites: 'jamais d\u2019inter-bots' },
{ id: 'B023', nom: 'MEMOIRE/MEM-DEDUP', pivot: '037', regles: ['035','036','037','038','039','040','041','042','043','044'], cos: ['035 to 037'], limites: 'doublons exacts seuls' },
{ id: 'B024', nom: 'MEMOIRE/MEM-PERTINENCE', pivot: '038', regles: ['035','036','037','038','039','040','041','042','043','044'], cos: ['038 to 069'], limites: 'notes internes' },
{ id: 'B025', nom: 'MEMOIRE/MEM-CORRECTION', pivot: '039', regles: ['035','036','037','038','039','040','041','042','043','044'], cos: ['039 to 040'], limites: 'correction explicite seule' },
{ id: 'B026', nom: 'MEMOIRE/MEM-DEPASSE', pivot: '040', regles: ['035','036','037','038','039','040','041','042','043','044'], cos: ['040 to 041'], limites: 'terminé, pas supprimé' },
{ id: 'B027', nom: 'MEMOIRE/MEM-ERREURS', pivot: '041', regles: ['035','036','037','038','039','040','041','042','043','044'], cos: ['041 to 063'], limites: 'résumé interne' },
{ id: 'B028', nom: 'MEMOIRE/MEM-RESET', pivot: '042', regles: ['035','036','037','038','039','040','041','042','043','044'], cos: ['042 to 035'], limites: 'explicite seul' },
{ id: 'B029', nom: 'MEMOIRE/MEM-ANCRE', pivot: '043', regles: ['035','036','037','038','039','040','041','042','043','044'], cos: ['036 to 043'], limites: 'pis-aller' },
{ id: 'B030', nom: 'MEMOIRE/MEM-CARNET', pivot: '044', regles: ['035','036','037','038','039','040','041','042','043','044'], cos: ['044 to 036'], limites: 'confirmées seules' }
];
if (typeof module !== 'undefined' && module.exports) module.exports = { DOMAINE: DOMAINE, NOYAU: NOYAU, BLOCS: BLOCS };
