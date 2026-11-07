// src/bllm-d06-raisonnement.js — Domaine D6 RAISONNEMENT : 10 blocs B051-B060 (M1).
// Pur, sans réseau, sans LLM. Blocs LOGIQUES (exactement 10 règles), pas des bots.
// Définitions : bllm-registre-B.js (registre-A pour 002/005). Liaisons COS en `cos`.
'use strict';
var DOMAINE = { id: 'D6', nom: 'RAISONNEMENT', matrice: 'M1' };
var NOYAU = ['002','005','063','064','065','066','067','068','069','070'];
var BLOCS = [
{ id: 'B051', nom: 'RAISONNEMENT/ORC-ROUTAGE', pivot: '002', regles: ['002','005','063','064','065','066','067','068','069','070'], cos: ['002 to 019','002 to 028'], limites: 'plan minimal si intention nulle' },
{ id: 'B052', nom: 'RAISONNEMENT/ORC-BUDGET', pivot: '005', regles: ['002','005','063','064','065','066','067','068','069','070'], cos: ['005 to 099'], limites: 'enveloppe/appel vs 099/session' },
{ id: 'B053', nom: 'RAISONNEMENT/RSN-CERTITUDE', pivot: '063', regles: ['002','005','063','064','065','066','067','068','069','070'], cos: ['063 to 064'], limites: 'jamais affichée comme score' },
{ id: 'B054', nom: 'RAISONNEMENT/RSN-PLAN', pivot: '064', regles: ['002','005','063','064','065','066','067','068','069','070'], cos: ['064 to 066'], limites: 'jamais de moteur forcé' },
{ id: 'B055', nom: 'RAISONNEMENT/RSN-ORDRE', pivot: '065', regles: ['002','005','063','064','065','066','067','068','069','070'], cos: ['065 to 090'], limites: 'aucun calcul parallèle' },
{ id: 'B056', nom: 'RAISONNEMENT/RSN-CHOIX-MOTEUR', pivot: '066', regles: ['002','005','063','064','065','066','067','068','069','070'], cos: ['004 to 066','099 to 066'], limites: 'sélection propose, 066 dispose' },
{ id: 'B057', nom: 'RAISONNEMENT/RSN-PREVOL', pivot: '067', regles: ['002','005','063','064','065','066','067','068','069','070'], cos: ['066 to 067'], limites: 'jamais d\u2019appel aveugle' },
{ id: 'B058', nom: 'RAISONNEMENT/RSN-SYSPROMPT', pivot: '068', regles: ['002','005','063','064','065','066','067','068','069','070'], cos: ['068 to 069'], limites: 'seul 068 touche sysPrompt' },
{ id: 'B059', nom: 'RAISONNEMENT/RSN-ENTREE-MOTEUR', pivot: '069', regles: ['002','005','063','064','065','066','067','068','069','070'], cos: ['069 to 111'], limites: 'classé seul au moteur' },
{ id: 'B060', nom: 'RAISONNEMENT/RSN-TOKENS', pivot: '070', regles: ['002','005','063','064','065','066','067','068','069','070'], cos: ['005 to 070','027 to 070'], limites: 'jamais de coupe silencieuse' }
];
if (typeof module !== 'undefined' && module.exports) module.exports = { DOMAINE: DOMAINE, NOYAU: NOYAU, BLOCS: BLOCS };
