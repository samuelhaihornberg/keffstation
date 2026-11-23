// src/bllm-core.js — Cœur BLLM (Bloc de Logique Matricielle).
// Regroupe les anciennes appellations BLM, BLSM, BRM, BRSM sous le seul terme BLLM.
// Un BLLM est un bloc de logique matricielle qui explique comment analyser, relier
// et traiter les éléments d'une demande. Les BLLM coopèrent entre eux pour guider
// la compréhension, le raisonnement et la réponse. Ils ne sont pas limités à des
// règles figées du type « si l'utilisateur écrit X, répondre Y ».
// Relie les bibliothèques, les bots, les BLLM et les modèles de langage locaux.
'use strict';
(function (global) {
  // ---------- Compatibilité : anciens noms reliés à BLLM ----------
  var ALIAS = {
    'BLM': 'BLLM', 'BLSM': 'BLLM', 'BRM': 'BLLM', 'BRSM': 'BLLM'
  };
  function nomCanonique(ancien) { return ALIAS[ancien] || ancien; }

  // ---------- État des BLLM ----------
  var BLLM_ETAT = {
    domaines: ['orchestration', 'comprehension', 'memoire', 'savoir', 'registre', 'raisonnement', 'coherence', 'correction', 'securite', 'couts', 'amitie'],
    blocs: {},          // id -> { id, nom, domaine, depend: [], ressources: [], statut: 'actif'|'inactif' }
    liens: [],          // { donneur, receveur, sens, vague }
    active: [],         // ids de blocs actifs pour la demande courante
    cooperation: []     // traces de coopération entre blocs
  };

  function enregistrerBloc(spec) {
    BLLM_ETAT.blocs[spec.id] = {
      id: spec.id,
      nom: spec.nom,
      domaine: spec.domaine,
      depend: spec.depend || [],
      ressources: spec.ressources || [],
      statut: spec.statut || 'actif',
      bibliotheque: spec.bibliotheque || null
    };
    return BLLM_ETAT.blocs[spec.id];
  }

  function ajouterLien(donneur, receveur, sens, vague) {
    BLLM_ETAT.liens.push({ donneur: donneur, receveur: receveur, sens: sens, vague: vague || '?' });
  }

  function activerBloc(id) {
    if (BLLM_ETAT.active.indexOf(id) < 0) BLLM_ETAT.active.push(id);
  }

  function cooperationTrace(de, vers, motif) {
    BLLM_ETAT.cooperation.push({ de: de, vers: vers, motif: motif, ts: Date.now() });
  }

  // ---------- Sélection des BLLM pertinents pour une demande ----------
  function selectionner(intention, perimetre, bibliotheques) {
    var selection = [];
    // Orchestration toujours présente
    activerBloc('001-entree');
    selection.push('001-entree');
    if (intention === 'salutation') {
      activerBloc('072-salutation'); selection.push('072-salutation');
    } else if (intention === 'question' || intention === 'message') {
      activerBloc('019-intention'); selection.push('019-intention');
      activerBloc('065-ordre'); selection.push('065-ordre');
      activerBloc('066-choix-moteur'); selection.push('066-choix-moteur');
      activerBloc('068-sysprompt'); selection.push('068-sysprompt');
    }
    // Mémoire si périmètre autorisé
    if (perimetre !== false) {
      activerBloc('036-restauree'); selection.push('036-restauree');
      activerBloc('038-pertinente'); selection.push('038-pertinente');
    }
    // Registre
    activerBloc('057-ton'); selection.push('057-ton');
    activerBloc('058-contraintes'); selection.push('058-contraintes');
    // Sécurité
    activerBloc('007-transparence'); selection.push('007-transparence');
    activerBloc('011-entree'); selection.push('011-entree');
    // Coût
    activerBloc('097-compteur'); selection.push('097-compteur');
    activerBloc('099-plafond'); selection.push('099-plafond');
    // Correction / vérification finale
    activerBloc('087-verification'); selection.push('087-verification');
    activerBloc('006-journal'); selection.push('006-journal');

    // Traçage des coopérations BLLM
    cooperationTrace('001-entree', '019-intention', 'analyse-demande');
    cooperationTrace('019-intention', '066-choix-moteur', 'routage-moteur');
    cooperationTrace('036-restauree', '038-pertinente', 'contexte-memoire');
    cooperationTrace('068-sysprompt', '087-verification', 'consigne-reponse');

    return { blocs: selection, liens: BLLM_ETAT.liens, cooperation: BLLM_ETAT.cooperation };
  }

  // ---------- API publique ----------
  global.ViaBLLM = {
    ALIAS: ALIAS,
    nomCanonique: nomCanonique,
    etat: function () { return BLLM_ETAT; },
    enregistrerBloc: enregistrerBloc,
    ajouterLien: ajouterLien,
    activerBloc: activerBloc,
    cooperationTrace: cooperationTrace,
    selectionner: selectionner,
    domaines: function () { return BLLM_ETAT.domaines; },
    blocs: function () { return BLLM_ETAT.blocs; },
    liens: function () { return BLLM_ETAT.liens; }
  };
})(window);
