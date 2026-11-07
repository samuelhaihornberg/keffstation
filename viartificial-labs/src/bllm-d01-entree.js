// src/bllm-d01-entree.js — Domaine D1 ENTREE : 10 blocs B001-B010 (matrice M1 unique).
// Pur, sans réseau, sans LLM. Blocs LOGIQUES (exactement 10 règles rattachées), pas des bots.
// Définitions des règles : src/bllm-registre-A.js. Liaisons COS sortantes en `cos` (documentées, pas rattachées).
'use strict';
var DOMAINE = { id: 'D1', nom: 'ENTREE', matrice: 'M1' };
var NOYAU = ['001','003','004','007','011','015','027','028','034','102'];
var BLOCS = [
{ id: 'B001', nom: 'ENTREE/ORC-ENTREE', pivot: '001', regles: ['001','003','004','007','011','015','027','028','034','102'], cos: ['001 to 002'], limites: 'ne déduit rien' },
{ id: 'B002', nom: 'ENTREE/ORC-SESSION', pivot: '003', regles: ['001','003','004','007','011','015','027','028','034','102'], cos: ['003 to 038'], limites: 'cloisonné par bot' },
{ id: 'B003', nom: 'ENTREE/ORC-CONSENTEMENT', pivot: '004', regles: ['001','003','004','007','011','015','027','028','034','102'], cos: ['004 to 066','004 to 005'], limites: 'jamais de démarrage auto' },
{ id: 'B004', nom: 'ENTREE/CON-TRANSPARENCE', pivot: '007', regles: ['001','003','004','007','011','015','027','028','034','102'], cos: ['007 to 068','007 to 087'], limites: 'mention simulé exigée' },
{ id: 'B005', nom: 'ENTREE/SEC-ENTREE', pivot: '011', regles: ['001','003','004','007','011','015','027','028','034','102'], cos: ['011 to 002'], limites: 'neutralise sans censurer' },
{ id: 'B006', nom: 'ENTREE/SEC-ABUS', pivot: '015', regles: ['001','003','004','007','011','015','027','028','034','102'], cos: ['015 to 002'], limites: 'jamais de sanction inventée' },
{ id: 'B007', nom: 'ENTREE/CMP-LONGUEUR', pivot: '027', regles: ['001','003','004','007','011','015','027','028','034','102'], cos: ['027 to 070'], limites: 'coupe avertie' },
{ id: 'B008', nom: 'ENTREE/CMP-HORSPERIMETRE', pivot: '028', regles: ['001','003','004','007','011','015','027','028','034','102'], cos: ['028 to 002','028 to 099'], limites: 'alimente 002, ne décide pas' },
{ id: 'B009', nom: 'ENTREE/LAN-DEFAUT', pivot: '034', regles: ['001','003','004','007','011','015','027','028','034','102'], cos: ['029 to 034'], limites: 'défaut révisable' },
{ id: 'B010', nom: 'ENTREE/LAN-MAINTIEN', pivot: '102', regles: ['001','003','004','007','011','015','027','028','034','102'], cos: ['102 to 031'], limites: 'jamais de bascule silencieuse' }
];
if (typeof module !== 'undefined' && module.exports) module.exports = { DOMAINE: DOMAINE, NOYAU: NOYAU, BLOCS: BLOCS };
