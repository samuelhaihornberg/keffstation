// src/bibliotheques.js — Système de bibliothèques ViArtificial Labs (BLLM).
// Une bibliothèque est un ensemble organisé de ressources (connaissances, concepts,
// définitions, relations entre concepts, méthodes, exemples, données utiles) que
// l'application peut consulter. Elle n'est ni un bot ni un modèle de langage.
// Elle apporte des ressources aux bots, aux BLLM et aux modèles de langage.
// Chaque bibliothèque déclare les composants qui l'utilisent.
'use strict';
(function (global) {
  var BIBLIOTHEQUES = {
    // ---------- Connaissances générales ----------
    savoirGeneral: {
      id: 'savoir-general',
      nom: 'Savoir général',
      domaine: 'connaissances',
      description: "Concepts, définitions et faits de référence accessibles à tous les bots et BLLM.",
      ressources: ['concepts', 'definitions', 'faits'],
      utilisePar: ['bots', 'bllm', 'modeles-locaux'],
      liens: ['dico-langues', 'dico-sociabilite'],
      statut: 'actif'
    },
    // ---------- Dictionnaires ----------
    dicoLangues: {
      id: 'dico-langues',
      nom: 'Dictionnaire des langues',
      domaine: 'langue',
      description: "Base langues partagée par tous les bots : français, anglais et autres.",
      ressources: ['mots', 'expressions', 'regles-langue'],
      utilisePar: ['bots', 'bllm', 'modeles-locaux'],
      liens: ['savoir-general', 'dico-via', 'dico-geek'],
      statut: 'actif'
    },
    dicoVia: {
      id: 'dico-via',
      nom: 'Dictionnaire ViA',
      domaine: 'sociabilite',
      description: "Références pour ViA : jeunes, psy/sociabilite, mentalisme, philo, poèmes.",
      ressources: ['jeunes', 'psy_sociabilite', 'mentalisme_refs', 'philo_extraits', 'poemes_libres'],
      utilisePar: ['bots.via', 'bllm.sociabilite'],
      liens: ['dico-langues', 'dico-sociabilite'],
      statut: 'actif'
    },
    dicoGeek: {
      id: 'dico-geek',
      nom: 'Dictionnaire Geek',
      domaine: 'technique',
      description: "Références partagées Geeko et Geekette : toutes langues, philo.",
      ressources: ['langues', 'note', 'philo'],
      utilisePar: ['bots.geeko', 'bots.geekette', 'bllm.dev'],
      liens: ['dico-langues'],
      statut: 'actif'
    },
    dicoTheo: {
      id: 'dico-theo',
      nom: 'Dictionnaire Theo',
      domaine: 'culture',
      description: "Theo : philo, résumés religieux, contes, poèmes, histoire, livres, films.",
      ressources: ['philo', 'religieux_resumes', 'contes_libres', 'poemes_libres', 'histoire_humanite', 'livres_modernes_refs', 'films_series_fiches'],
      utilisePar: ['bots.theo', 'bllm.narration'],
      liens: ['dico-langues'],
      statut: 'actif'
    },
    dicoSociabilite: {
      id: 'dico-sociabilite',
      nom: 'Dictionnaire Sociabilité',
      domaine: 'social',
      description: "Règles et extraits de sociabilité (domaine public) pour tous les bots.",
      ressources: ['cible', 'note', 'extraits', 'regles'],
      utilisePar: ['bots', 'bllm.sociabilite'],
      liens: ['dico-langues', 'savoir-general'],
      statut: 'actif'
    },
    // ---------- BLLM ----------
    bllmOrchestration: {
      id: 'bllm-orchestration',
      nom: 'BLLM Orchestration',
      domaine: 'bllm',
      description: "Blocs de logique matricielle pour l'analyse, le routage, la session et le consentement d'entrée.",
      ressources: ['001-entree', '002-routage', '003-session', '004-consentement', '005-budget', '006-journal'],
      utilisePar: ['bots.guideoplan', 'bllm.core'],
      liens: ['bllm-comprehension', 'bllm-memoire'],
      statut: 'actif'
    },
    bllmComprehension: {
      id: 'bllm-comprehension',
      nom: 'BLLM Compréhension',
      domaine: 'bllm',
      description: "Détection d'intention, causes, temps, relations, entités, actes, sentiment, ambiguïté, longueur, hors-périmètre, langue.",
      ressources: ['019-intention', '020-causes', '021-temps', '022-relations', '023-entites', '024-actes', '025-sentiment', '026-ambiguite', '027-longueur', '028-hors-perimetre', '029-langue-defaut', '030-langue-mixte', '034-langue-pont'],
      utilisePar: ['bots', 'bllm.core', 'modeles-locaux'],
      liens: ['bllm-orchestration', 'bllm-memoire'],
      statut: 'actif'
    },
    bllmMemoire: {
      id: 'bllm-memoire',
      nom: 'BLLM Mémoire',
      domaine: 'bllm',
      description: "Mémoire classée, pertinence, déduplication, restauration, correction, dépassement, erreurs, reset, ancre, carnet.",
      ressources: ['035-classee', '036-restauree', '037-dedup', '038-pertinente', '039-correction', '040-depassee', '041-erreurs', '042-reset', '043-ancre', '044-carnet'],
      utilisePar: ['bots', 'bllm.core', 'modeles-locaux'],
      liens: ['bllm-comprehension', 'bllm-savoir'],
      statut: 'actif'
    },
    bllmSavoir: {
      id: 'bllm-savoir',
      nom: 'BLLM Savoir',
      domaine: 'bllm',
      description: "Faits, dictionnaires, états, dates, sources, limites, synonymes, oppositions.",
      ressources: ['045-faits', '046-dicos', '047-etats', '048-dates', '049-sources', '050-limites', '104-synonymes', '105-oppositions'],
      utilisePar: ['bots', 'bllm.core', 'modeles-locaux'],
      liens: ['bllm-memoire', 'savoir-general'],
      statut: 'actif'
    },
    bllmRegistre: {
      id: 'bllm-registre',
      nom: 'BLLM Registre',
      domaine: 'bllm',
      description: "Ton, contraintes, longueur, relance, humour, vouvoiement.",
      ressources: ['057-ton', '058-contraintes', '059-longueur', '060-relance', '061-humour', '062-vouvoiement', '107-usage', '108-soutien'],
      utilisePar: ['bots', 'bllm.core', 'modeles-locaux'],
      liens: ['bllm-savoir', 'dico-sociabilite'],
      statut: 'actif'
    },
    bllmRaisonnement: {
      id: 'bllm-raisonnement',
      nom: 'BLLM Raisonnement',
      domaine: 'bllm',
      description: "Certitude, plan, ordre, choix moteur, pré-vol, entrée moteur, tokens.",
      ressources: ['063-certitude', '064-plan', '065-ordre', '066-choix-moteur', '067-prevol', '068-sysprompt', '069-entree-moteur', '070-tokens'],
      utilisePar: ['bots.guideoplan', 'bllm.core', 'modeles-locaux'],
      liens: ['bllm-comprehension', 'bllm-memoire'],
      statut: 'actif'
    },
    bllmCoherence: {
      id: 'bllm-coherence',
      nom: 'BLLM Cohérence',
      domaine: 'bllm',
      description: "Analyse, salutation, question, adieu, xread, mémoire, doute, non-évalué.",
      ressources: ['071-analyse', '072-salutation', '073-question', '074-adieu', '075-xread', '076-memoire', '077-doute', '078-non-evalue'],
      utilisePar: ['bots', 'bllm.core', 'modeles-locaux'],
      liens: ['bllm-raisonnement', 'bllm-correction'],
      statut: 'actif'
    },
    bllmCorrection: {
      id: 'bllm-correction',
      nom: 'BLLM Correction',
      domaine: 'bllm',
      description: "Orthographe, reformulation, vérification finale, jugement social, amitié simulée.",
      ressources: ['079-orthographe', '080-reformulation', '081-verification', '082-jugement', '083-coherence-reponse', '084-repetition', '085-longueur', '086-xread-passive', '093-amitie-silence', '094-amitie-chaleur', '095-amitie-reponse'],
      utilisePar: ['bots', 'bllm.core', 'modeles-locaux'],
      liens: ['bllm-coherence', 'bllm-securite'],
      statut: 'actif'
    },
    bllmSecurite: {
      id: 'bllm-securite',
      nom: 'BLLM Sécurité',
      domaine: 'bllm',
      description: "Entrée, abus, profil, réseau, clé, repli, transparence, limites, preuve, rappel.",
      ressources: ['007-transparence', '008-limites', '009-preuve', '010-rappel', '011-entree', '012-sortie', '013-pii', '014-profil', '015-abus', '016-reseau', '017-cle', '018-repli'],
      utilisePar: ['bots', 'bllm.core', 'modeles-locaux'],
      liens: ['bllm-orchestration', 'bllm-correction'],
      statut: 'actif'
    },
    bllmCouts: {
      id: 'bllm-couts',
      nom: 'BLLM Coûts',
      domaine: 'bllm',
      description: "Compteur d'appels, plafond, bilan, distinction virtuel/réel, mesures réelles.",
      ressources: ['097-compteur', '098-virtuel-reel', '099-plafond', '100-bilan', '110-mesures'],
      utilisePar: ['bllm.core', 'modeles-locaux'],
      liens: ['bllm-raisonnement'],
      statut: 'actif'
    },
    bllmAmitie: {
      id: 'bllm-amitie',
      nom: 'BLLM Amitié Simulée',
      domaine: 'bllm',
      description: "Silence, chaleur, réponse, popularité, idiomes, traduction.",
      ressources: ['101-candidats', '102-langue-maintien', '103-traduire', '106-popularite', '109-etats'],
      utilisePar: ['bots.geeko', 'bots.geekette', 'bots.theo', 'bllm.core'],
      liens: ['bllm-correction', 'dico-geek', 'dico-theo'],
      statut: 'actif'
    },
    // ---------- Modèles de langage locaux ----------
    modeleSmolLM2: {
      id: 'modele-smollm2',
      nom: 'SmolLM2 360M Instruct',
      domaine: 'modele-local',
      description: "Modèle de langage open source local (Apache 2.0), ≈390 Mo, CPU/WASM. Défaut de ViArtificial Labs.",
      ressources: ['chat_template', 'tokenizer', 'poids-q4'],
      utilisePar: ['bllm.core', 'bots.tous'],
      liens: ['bllm-raisonnement'],
      statut: 'configurable'
    },
    modeleQwen: {
      id: 'modele-qwen',
      nom: 'Qwen2.5 0.5B Instruct',
      domaine: 'modele-local',
      description: "Modèle de langage open source local (Apache 2.0), ≈800 Mo, choix explicite.",
      ressources: ['chat_template', 'tokenizer', 'poids-q4'],
      utilisePar: ['bllm.core', 'bots.tous'],
      liens: ['bllm-raisonnement'],
      statut: 'configurable'
    }
  };

  function lister() { return Object.values(BIBLIOTHEQUES); }
  function get(id) { return BIBLIOTHEQUES[id] || null; }
  function utilisePar(composant) {
    var out = [];
    for (var id in BIBLIOTHEQUES) {
      var b = BIBLIOTHEQUES[id];
      if (b.utilisePar && b.utilisePar.indexOf(composant) >= 0) out.push(b);
    }
    return out;
  }
  function domaines() {
    var d = {};
    for (var id in BIBLIOTHEQUES) {
      var dom = BIBLIOTHEQUES[id].domaine;
      if (!d[dom]) d[dom] = [];
      d[dom].push(BIBLIOTHEQUES[id]);
    }
    return d;
  }
  global.ViaBibliotheques = { lister: lister, get: get, utilisePar: utilisePar, domaines: domaines, BIBLIOTHEQUES: BIBLIOTHEQUES };
})(window);
