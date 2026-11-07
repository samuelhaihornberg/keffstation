// src/bllm-d07-coherence.js — Domaine D7 COHERENCE : 10 blocs B061-B070 (M1).
// Pur, sans réseau, sans LLM. Blocs LOGIQUES (exactement 10 règles), pas des bots.
// Définitions : bllm-registre-B.js (registre-A pour 010). Liaisons COS en `cos`.
'use strict';
var DOMAINE = { id: 'D7', nom: 'COHERENCE', matrice: 'M1' };
var NOYAU = ['071','072','073','074','075','076','077','078','010','109'];
var BLOCS = [
{ id: 'B061', nom: 'COHERENCE/COH-ANALYSE', pivot: '071', regles: ['071','072','073','074','075','076','077','078','010','109'], cos: ['071 to 077','071 to 078'], limites: 'jamais de reformulation ici' },
{ id: 'B062', nom: 'COHERENCE/COH-SALUTATION', pivot: '072', regles: ['071','072','073','074','075','076','077','078','010','109'], cos: ['071 to 072'], limites: 'sans présupposer la suite' },
{ id: 'B063', nom: 'COHERENCE/COH-QUESTION', pivot: '073', regles: ['071','072','073','074','075','076','077','078','010','109'], cos: ['073 to 089'], limites: 'pas de hors-sujet toléré' },
{ id: 'B064', nom: 'COHERENCE/COH-ADIEU', pivot: '074', regles: ['071','072','073','074','075','076','077','078','010','109'], cos: ['071 to 074'], limites: 'pas tranchée à l\u2019aveugle' },
{ id: 'B065', nom: 'COHERENCE/COH-XREAD', pivot: '075', regles: ['071','072','073','074','075','076','077','078','010','109'], cos: ['075 to 095'], limites: 'jamais d\u2019affichage' },
{ id: 'B066', nom: 'COHERENCE/COH-MEMOIRE', pivot: '076', regles: ['071','072','073','074','075','076','077','078','010','109'], cos: ['036 to 076'], limites: 'mémoire jamais réécrite ici' },
{ id: 'B067', nom: 'COHERENCE/COH-DOUTE', pivot: '077', regles: ['071','072','073','074','075','076','077','078','010','109'], cos: ['077 to 084','026 to 077'], limites: '026 détecte, 077 arbitre, 084 conserve' },
{ id: 'B068', nom: 'COHERENCE/COH-NON-EVALUE', pivot: '078', regles: ['071','072','073','074','075','076','077','078','010','109'], cos: ['071 to 078'], limites: 'rien inventé' },
{ id: 'B069', nom: 'COHERENCE/CON-RAPPEL', pivot: '010', regles: ['071','072','073','074','075','076','077','078','010','109'], cos: ['077 to 010'], limites: 'rappel seul' },
{ id: 'B070', nom: 'COHERENCE/CON-ETATS', pivot: '109', regles: ['071','072','073','074','075','076','077','078','010','109'], cos: ['109 to 111'], limites: 'simulé, jamais vécu personnel' }
];
if (typeof module !== 'undefined' && module.exports) module.exports = { DOMAINE: DOMAINE, NOYAU: NOYAU, BLOCS: BLOCS };
