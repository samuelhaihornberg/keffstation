// src/noeuds-calcul.js — NOUVEAU (2026-11-02), pur, sans réseau.
// MANQUE CONSTATÉ : aucun « nœud CPU/GPU, virtuel, matrice, pattern,
// networkien » n'est défini dans le code (seules traces : local-engine
// « device wasm CPU », etats-keff « COS preserve », matrice-v1.csv = graphe
// BLM documentaire). Ce fichier distingue NŒUDS LOGIQUES (étapes BLM) des
// RESSOURCES PHYSIQUES réellement disponibles. Il ne règle aucune vitesse.
// Familles (NOUVEAU, à confirmer) : 'cpu' | 'gpu' | 'virtuel' | 'matrice' |
//   'pattern' | 'networkien'.
// Ressources physiques RÉELLES : CPU/WASM monothread (local-engine) ;
// Ollama/custom via fetch SI adresse saisie (providers). WebGPU : NON UTILISÉ
// (migré vers local, providers.js). Tout le reste = LOGIQUE SEULEMENT.
'use strict';
var FAMILLES = ['cpu', 'gpu', 'virtuel', 'matrice', 'pattern', 'networkien'];
var NOEUDS = [
  { id: 'cpu-wasm', famille: 'virtuel', logique: false, physique: true, etat: 'disponible', source: 'local-engine device wasm monothread' },
  { id: 'ollama-distant', famille: 'networkien', logique: false, physique: true, etat: 'indisponible', source: 'providers ollama/custom, adresse requise' },
  { id: 'gpu-webgpu', famille: 'gpu', logique: false, physique: false, etat: 'indisponible', source: 'providers.js : AUCUNE exécution WebGPU' },
  { id: 'graphe-blm', famille: 'matrice', logique: true, physique: false, etat: 'disponible', source: 'docs/blm/matrice-v1.csv (graphe documentaire, pas de calcul matriciel)' },
  { id: 'heuristiques-regex', famille: 'pattern', logique: true, physique: false, etat: 'disponible', source: 'blm-comprehension/langue/correction (regex locales)' },
  { id: 'credits-virtuels', famille: 'virtuel', logique: true, physique: false, etat: 'disponible', source: 'blm-couts : crédits virtuels, distincts des tokens LLM réels' }
];
function ressourcesPhysiques() { return NOEUDS.filter(function (n) { return n.physique; }); }
function noeudsLogiques() { return NOEUDS.filter(function (n) { return n.logique; }); }
module.exports = { FAMILLES: FAMILLES, NOEUDS: NOEUDS, ressourcesPhysiques: ressourcesPhysiques, noeudsLogiques: noeudsLogiques };
