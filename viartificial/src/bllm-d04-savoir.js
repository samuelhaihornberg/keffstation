// src/bllm-d04-savoir.js — Domaine D4 SAVOIR (+learning 111) : 10 blocs B031-B040 (M1).
// Pur, sans réseau, sans LLM. Blocs LOGIQUES (exactement 10 règles), pas des bots.
// Définitions : bllm-registre-B.js. Liaisons COS sortantes en `cos` (documentées).
'use strict';
var DOMAINE = { id: 'D4', nom: 'SAVOIR', matrice: 'M1' };
var NOYAU = ['045','046','047','048','049','050','104','105','106','111'];
var BLOCS = [
{ id: 'B031', nom: 'SAVOIR/SAV-FAITS', pivot: '045', regles: ['045','046','047','048','049','050','104','105','106','111'], cos: ['045 to 049','045 to 050'], limites: 'aide interne jamais récitée' },
{ id: 'B032', nom: 'SAVOIR/SAV-DICOS', pivot: '046', regles: ['045','046','047','048','049','050','104','105','106','111'], cos: ['023 to 046'], limites: 'source étiquetée' },
{ id: 'B033', nom: 'SAVOIR/SAV-ETATS', pivot: '047', regles: ['045','046','047','048','049','050','104','105','106','111'], cos: ['047 to 069'], limites: 'jeu, pas réalité' },
{ id: 'B034', nom: 'SAVOIR/SAV-DATES', pivot: '048', regles: ['045','046','047','048','049','050','104','105','106','111'], cos: ['021 to 048'], limites: 'repère, pas chronologie' },
{ id: 'B035', nom: 'SAVOIR/SAV-SOURCES', pivot: '049', regles: ['045','046','047','048','049','050','104','105','106','111'], cos: ['049 to 111'], limites: 'jamais de source forgée' },
{ id: 'B036', nom: 'SAVOIR/SAV-LIMITES', pivot: '050', regles: ['045','046','047','048','049','050','104','105','106','111'], cos: ['050 to 064'], limites: 'aveu explicite' },
{ id: 'B037', nom: 'SAVOIR/SAV-SYNONYMES', pivot: '104', regles: ['045','046','047','048','049','050','104','105','106','111'], cos: ['023 to 104'], limites: 'jamais transmis au moteur' },
{ id: 'B038', nom: 'SAVOIR/SAV-OPPOSITIONS', pivot: '105', regles: ['045','046','047','048','049','050','104','105','106','111'], cos: ['023 to 105'], limites: 'pas de cours affiché' },
{ id: 'B039', nom: 'SAVOIR/SAV-USAGES', pivot: '106', regles: ['045','046','047','048','049','050','104','105','106','111'], cos: ['101 to 106','035 to 106'], limites: 'popularité != vérité' },
{ id: 'B040', nom: 'SAVOIR/LRN-PROVENANCE-GARDE', pivot: '111', regles: ['045','046','047','048','049','050','104','105','106','111'], cos: ['111 to 036','069 to 111'], limites: 'supposition jamais fait ; sorties propres jamais faits' }
];
if (typeof module !== 'undefined' && module.exports) module.exports = { DOMAINE: DOMAINE, NOYAU: NOYAU, BLOCS: BLOCS };
