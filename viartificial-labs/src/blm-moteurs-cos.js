// src/blm-moteurs-cos.js — NOUVEAU (2026-11-02), pur, sans réseau, sans LLM.
// MANQUE CONSTATÉ : aucun « moteur COS » n'est défini dans le dépôt
// (seules mentions : manifest « cos, SuperBots, BLM, BLSM » + recyclor « cos V5 »
// + app.js « Syntaxe cos (connexions) »). Ce fichier NE prétend PAS relever
// d'une spec existante : il définit un registre minimal et vérifiable.
// Rôle : les règles 063-066 déterminent, via le plan, la sélection et
// l'ORDRE des moteurs COS pertinents ; l'orchestrateur applique cette
// sélection et l'appel reste porte unique preparerEntreeMoteur (S4).
// ROUTAGE ACTIF par défaut (COS_ACTIF = true, opt-out via desactiver()) :
// le langage COS est spécifié (src/cos-langage.js + motor.s : README, COS,
// co-cos-commun). Correspondances établies : sélection par les règles
// 063-066 via le plan, transmise à resoudreMoteur (portes + repli conservés).
// Ne JAMAIS supposer A1→B2.
// Types (NOUVEAU, à confirmer) : 'inference' | 'savoir' | 'correction' | 'memoire'.
// États (NOUVEAU, à confirmer) : 'disponible' | 'indisponible' | 'en-charge' |
//   'refuse-budget' | 'hors-perimetre'.
// Polarités (NOUVEAU, à confirmer, sens circulation uniquement, SANS rapport
//   avec POLARITES affectives de etats-keff.js) : 'emetteur' | 'receveur' | 'neutre'.
'use strict';
var COS_TYPES = ['inference', 'savoir', 'correction', 'memoire'];
var COS_ETATS = ['disponible', 'indisponible', 'en-charge', 'refuse-budget', 'hors-perimetre'];
var COS_POLARITES = ['emetteur', 'receveur', 'neutre'];
// Registre déclaratif : 4 moteurs correspondant aux seuls fournisseurs réels
// (providers.js : local CPU/WASM, ollama, custom, aucun). Aucun autre moteur
// COS n'existe dans le code : tout ajout futur passe par declarer().
var REGISTRE = [
  { id: 'local', type: 'inference', polarite: 'emetteur', etat: 'disponible', source: 'providers:local CPU/WASM' },
  { id: 'ollama', type: 'inference', polarite: 'emetteur', etat: 'indisponible', source: 'providers:ollama (adresse requise)' },
  { id: 'custom', type: 'inference', polarite: 'emetteur', etat: 'indisponible', source: 'providers:custom (adresse requise)' },
  { id: 'repli', type: 'memoire', polarite: 'neutre', etat: 'disponible', source: 'reponseSalutation locale, sans moteur' }
];
function declarer(m) {
  if (!m || COS_TYPES.indexOf(m.type) < 0 || COS_POLARITES.indexOf(m.polarite) < 0) return null;
  if (REGISTRE.some(function (x) { return x.id === m.id; })) return null; // pas de doublon
  var e = { id: String(m.id).slice(0, 40), type: m.type, polarite: m.polarite,
    etat: COS_ETATS.indexOf(m.etat) >= 0 ? m.etat : 'indisponible', source: String(m.source || 'declare').slice(0, 120) };
  REGISTRE.push(e);
  return e;
}
// Sélection + ordre déterminés par les règles 063-066 à partir du plan :
// intention/perimetre/budget → séquence typée. Salutation ou hors-périmètre
// → repli seul, jamais de moteur (002/028).
// Question/message → inference disponible, sinon repli (064/066).
function estActif() { return COS_ACTIF === true; }
function activer() { COS_ACTIF = true; return true; }
function desactiver() { COS_ACTIF = false; return true; }
// Choix du moteur dans le parcours (NOUVEAU 2026-11-03) : local CPU/WASM si
// disponible ; Ollama distant seulement si adresse configurée ; GPU UNIQUEMENT
// si moteur + appareil le prennent réellement en charge — aucun moteur WebGPU
// n'existe dans le projet, donc GPU = toujours indisponible (jamais déclaré
// actif). Nœuds virtuels/matrice/patterns/networkiens = catégories logiques.
// 005 = budget d'entrée (défaut 2048), 099 = plafond d'appels/session (défaut
// 50) : des LIMITES, pas des objectifs de vitesse.
// Fournisseurs 'none' (aucun moteur configuré) et 'webllm' (migré vers local,
// comme providers.chat) : mêmes issues que providers.js, jamais de moteur simulé.
function resoudreMoteur(cfg) {
  var c = cfg || {};
  if (c.gpuDemande === true) return { moteur: 'aucun', repli: 'repli-modele (aucun moteur WebGPU dans le projet)', physique: false };
  if (c.fournisseur === 'none') return { moteur: 'aucun', repli: 'repli-modele (aucun moteur IA configuré)', physique: false };
  if (c.fournisseur === 'webllm') return { moteur: 'local-cpu-wasm', repli: 'repli-modele (ancien réglage migré)', physique: true };
  if ((c.fournisseur === 'ollama' || c.fournisseur === 'custom') && String(c.ollamaUrl || '').trim()) return { moteur: c.fournisseur + '-distant', repli: 'repli-modele', physique: true };
  if ((c.fournisseur === 'ollama' || c.fournisseur === 'custom')) return { moteur: 'aucun', repli: 'repli-modele (adresse serveur manquante)', physique: false };
  return { moteur: 'local-cpu-wasm', repli: 'repli-modele', physique: true };
}
// TABLE DES ROUTES EXPLICITES (2026-11-03, NOUVEAU) : seuls les moteurs et
// exécuteurs RÉELLEMENT PRÉSENTS dans le code ou la configuration. Un BLM qui
// n'effectue pas d'inférence reste traité par son propre moteur logique
// (pur JS local, jamais routé vers un LLM). Nœuds virtuels/matrice/patterns/
// networkiens = catégories LOGIQUES tant qu'aucun exécuteur réel ne leur est
// relié (seul l'endpoint Ollama/custom configuré est un exécuteur réseau réel).
var ROUTES = [
  { id: 'local', vers: 'local-cpu-wasm', moteur: true, reel: true, condition: 'modèle local chargé (ViaLocalEngine ready)', source: 'local-engine.js + local-wasm.js (worker, device wasm, monothread)' },
  { id: 'ollama', vers: 'ollama-distant', moteur: true, reel: true, condition: 'baseUrl Ollama configurée (providers load) + pré-vol /api/tags', source: 'providers.js chat ollama' },
  { id: 'custom', vers: 'custom-distant', moteur: true, reel: true, condition: 'baseUrl configurée (+ clé session, jamais persistée)', source: 'providers.js chat custom' },
  { id: 'repli', vers: 'repli-modele', moteur: true, reel: true, condition: 'toujours (repli terminal, 018)', source: "conversation.html reponseSalutation" },
  { id: 'aucun', vers: 'aucun', moteur: true, reel: false, condition: 'aucun moteur configuré/joignable → refus + repli', source: 'resoudreMoteur (066)' },
  { id: 'gpu', vers: 'aucun', moteur: false, reel: false, condition: 'AUCUN backend WebGPU implémenté (migration webllm→local)', source: 'providers.js' },
  { id: 'virtuel', vers: 'aucun', moteur: false, reel: false, condition: 'catégorie logique (crédits virtuels 098 ≠ tokens réels)', source: 'blm-couts.js + noeuds-calcul.js' },
  { id: 'matrice', vers: 'aucun', moteur: false, reel: false, condition: 'catégorie logique (graphe BLM documentaire, pas de calcul)', source: 'docs/blm/matrice-v1.csv' },
  { id: 'pattern', vers: 'aucun', moteur: false, reel: false, condition: 'catégorie logique (regex locales, pas de calculateur)', source: 'blm-comprehension.js' },
  { id: 'networkien', vers: 'aucun', moteur: false, reel: false, condition: 'catégorie logique ; seuls endpoints Ollama/custom configurés exécutent en réseau', source: 'providers.js + noeuds-calcul.js' }
];
var COS_ACTIF = true;
// ACTIF par défaut (2026-11-03) : la table des routes ci-dessus est établie
// depuis le code et la configuration existants. `activer/desactiver` restent
// disponibles (opt-out explicite).
function selectionner(etat, plan, env, besoins) {
  if (!COS_ACTIF) return null;
  var b = besoins || {};
  var intention = etat && etat.intention, perimetre = !etat || etat.perimetre !== false;
  if (!perimetre) return [{ id: 'repli', type: 'memoire', polarite: 'neutre', etat: 'hors-perimetre', motif: '028-hors-perimetre' }];
  if (intention === 'salutation' && !(plan && plan.moteur === true)) return [{ id: 'repli', type: 'memoire', polarite: 'neutre', etat: 'disponible', motif: '002-salutation-sans-moteur' }];
  if (env && env.autorise === false) return [{ id: 'repli', type: 'memoire', polarite: 'neutre', etat: 'refuse-budget', motif: '005/099-' + (env.motif || 'refus') }];
  // Le sélecteur consulte les besoins (bot actif, équipe, fournisseur configuré)
  // puis TRANSMET le choix à 066, qui garde ses portes et son repli.
  var rm = resoudreMoteur({ fournisseur: b.fournisseur || 'local', ollamaUrl: b.ollamaUrl || '', gpuDemande: !!b.gpuDemande });
  if (rm.moteur === 'local-cpu-wasm') return [{ id: 'local', type: 'inference', polarite: 'emetteur', etat: 'en-charge', motif: (plan && plan.motif) || '064-moteur-requis' }];
  if (rm.moteur === 'ollama-distant') return [{ id: 'ollama', type: 'inference', polarite: 'emetteur', etat: 'en-charge', motif: '066-ollama-configure' }];
  if (rm.moteur === 'custom-distant') return [{ id: 'custom', type: 'inference', polarite: 'emetteur', etat: 'en-charge', motif: '066-custom-configure' }];
  return [{ id: 'repli', type: 'memoire', polarite: 'neutre', etat: 'indisponible', motif: '066-' + String(rm.repli || 'aucun-moteur').slice(0, 60) }];
}
module.exports = { TYPES: COS_TYPES, ETATS: COS_ETATS, POLARITES: COS_POLARITES, REGISTRE: REGISTRE, ROUTES: ROUTES, declarer: declarer, selectionner: selectionner, estActif: estActif, activer: activer, desactiver: desactiver, resoudreMoteur: resoudreMoteur };
