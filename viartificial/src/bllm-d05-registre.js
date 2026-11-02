// src/bllm-d05-registre.js — Domaine D5 REGISTRE-APPEL : 10 blocs B041-B050 (M1).
// Pur, sans réseau, sans LLM. Blocs LOGIQUES (exactement 10 règles), pas des bots.
// Définitions : bllm-registre-B.js (registre-A pour 014). Liaisons COS en `cos`.
'use strict';
var DOMAINE = { id: 'D5', nom: 'REGISTRE-APPEL', matrice: 'M1' };
var NOYAU = ['057','058','061','107','108','031','103','096','101','014'];
var BLOCS = [
{ id: 'B041', nom: 'REGISTRE/REG-TON', pivot: '057', regles: ['057','058','061','107','108','031','103','096','101','014'], cos: ['057 to 058','057 to 096'], limites: 'personnalités intactes' },
{ id: 'B042', nom: 'REGISTRE/REG-CONTRAINTES', pivot: '058', regles: ['057','058','061','107','108','031','103','096','101','014'], cos: ['058 to 068'], limites: 'jamais concaténées au moteur' },
{ id: 'B043', nom: 'REGISTRE/REG-HUMOUR', pivot: '061', regles: ['057','058','061','107','108','031','103','096','101','014'], cos: ['061 to 093'], limites: 'vérification finale tranche' },
{ id: 'B044', nom: 'REGISTRE/REG-FORMULES', pivot: '107', regles: ['057','058','061','107','108','031','103','096','101','014'], cos: ['057 to 107'], limites: 'interne, jamais au moteur' },
{ id: 'B045', nom: 'REGISTRE/REG-SUITE', pivot: '108', regles: ['057','058','061','107','108','031','103','096','101','014'], cos: ['019 to 108'], limites: 'typée, jamais affichée' },
{ id: 'B046', nom: 'REGISTRE/LAN-PONT', pivot: '031', regles: ['057','058','061','107','108','031','103','096','101','014'], cos: ['031 to 058'], limites: 'pont, pas décision' },
{ id: 'B047', nom: 'REGISTRE/LAN-TRADUIRE', pivot: '103', regles: ['057','058','061','107','108','031','103','096','101','014'], cos: ['029 to 103','068 to 103'], limites: 'via moteur seul' },
{ id: 'B048', nom: 'REGISTRE/AMI-CHALEUR', pivot: '096', regles: ['057','058','061','107','108','031','103','096','101','014'], cos: ['096 to 093'], limites: 'sans revendication (093 relit)' },
{ id: 'B049', nom: 'REGISTRE/CMP-IDIOMES', pivot: '101', regles: ['057','058','061','107','108','031','103','096','101','014'], cos: ['101 to 106'], limites: 'candidats, jamais récités' },
{ id: 'B050', nom: 'REGISTRE/SEC-PROFIL', pivot: '014', regles: ['057','058','061','107','108','031','103','096','101','014'], cos: ['035 to 014'], limites: 'aucun profil, même partiel' }
];
if (typeof module !== 'undefined' && module.exports) module.exports = { DOMAINE: DOMAINE, NOYAU: NOYAU, BLOCS: BLOCS };
