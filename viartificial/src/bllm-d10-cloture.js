// src/bllm-d10-cloture.js — Domaine D10 CLOTURE : 10 blocs B091-B100 (M1).
// Pur, sans réseau, sans LLM. Blocs LOGIQUES, pas des bots. Noyau 20 règles, blocs 10-11.
// Définitions : bllm-registre-A.js (006/008/009/012/013/016/017/018) et bllm-registre-B.js.
'use strict';
var DOMAINE = { id: 'D10', nom: 'CLOTURE', matrice: 'M1' };
var BLOCS = [
{ id: 'B091', nom: 'CLOTURE/VER-FINALE', pivot: '087', regles: ['087','008','009','012','013','018','051','071','006','100'], cos: ['051 to 087','071 to 087','008 to 087'], limites: 'écart -> repli, jamais de 2e génération' },
{ id: 'B092', nom: 'CLOTURE/ORC-JOURNAL', pivot: '006', regles: ['006','016','017','100','097','098','088','018','013','012'], cos: ['006 to 100','006 to 016'], limites: 'jamais de brut ni PII (088 batterie hors-ligne rattachée ici)' },
{ id: 'B093', nom: 'CLOTURE/COU-PLAFOND', pivot: '099', regles: ['099','097','100','066','005','006','016','017','110','098'], cos: ['099 to 066','005 to 099'], limites: '005/appel vs 099/session, pas doublon' },
{ id: 'B094', nom: 'CLOTURE/COU-COMPTEUR', pivot: '097', regles: ['097','098','099','100','005','006','110','016','017','091'], cos: ['005 to 097'], limites: 'virtuels != vrais tokens' },
{ id: 'B095', nom: 'CLOTURE/CON-LIMITES', pivot: '008', regles: ['008','009','087','012','013','071','051','006','018','016'], cos: ['087 to 008'], limites: 'personnification écartée' },
{ id: 'B096', nom: 'CLOTURE/SEC-SORTIE', pivot: '012', regles: ['012','013','087','008','009','035','006','018','016','017'], cos: ['087 to 012','035 to 013'], limites: 'fuite/PII -> écart + repli' },
{ id: 'B097', nom: 'CLOTURE/VER-MOTEUR', pivot: '089', regles: ['089','073','087','090','092','006','100','097','012','013'], cos: ['073 to 089'], limites: 'vide = EMPTY, jamais de remplissage' },
{ id: 'B098', nom: 'CLOTURE/VER-PROMESSE', pivot: '090', regles: ['090','065','087','089','092','006','016','017','091','018'], cos: ['065 to 090'], limites: 'purgée si session fermée' },
{ id: 'B099', nom: 'CLOTURE/AMI-SILENCE', pivot: '095', regles: ['095','075','093','094','087','006','100','012','013','018'], cos: ['075 to 095','093 to 094'], limites: '075 écarte, 095 tait ; jamais de pis-aller' },
{ id: 'B100', nom: 'CLOTURE/COU-MESURES', pivot: '110', regles: ['110','100','097','006','016','017','091','018','099','098'], cos: ['110 to 100'], limites: 'indisponibles listés, heuristiques étiquetées' }
];
if (typeof module !== 'undefined' && module.exports) module.exports = { DOMAINE: DOMAINE, BLOCS: BLOCS };
