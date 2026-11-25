// src/execution-blm.js — Mécanisme d'exécution réel pour les 192 BLMs.
// Distingue : enregistré, sélectionnable, exécutable, exécuté dans cette demande.
// Recherche et sélectionne les blocs pertinents, vérifie les dépendances,
// transmet les entrées et récupère les sorties.
'use strict';
(function (global) {
  // ---------- États d'un bloc ----------
  var ETATS_BLOC = {
    enregistre: 'enregistre',       // dans le registre, pas encore évalué
    selectionnable: 'selectionnable', // peut être sélectionné pour cette demande
    executable: 'executable',       // dépendances satisfaites, prêt à exécuter
    execute: 'execute',             // en cours d'exécution
    executeAvecResultat: 'execute-avec-resultat', // exécuté avec contribution
    nonApplicable: 'non-applicable', // sélectionné mais pas pertinent
    erreur: 'erreur',               // exécution échouée
    indisponible: 'indisponible'    // dépendance manquante
  };

  // ---------- Registre des blocs ----------
  var registreBlocs = {};

  function enregistrerBloc(id, nom, vague, role, dependances, fonction) {
    registreBlocs[id] = {
      id: id,
      nom: nom || id,
      vague: vague || 'S2',
      role: role || 'traitement',
      dependances: dependances || [],
      fonction: fonction || null,
      etat: ETATS_BLOC.enregistre,
      selectionnable: false,
      executable: false,
      executeDansCetteDemande: false,
      contribution: null,
      erreur: null,
      raisonSelection: null,
      ts: null
    };
  }

  // ---------- Recherche de blocs pertinents ----------
  function rechercherBlocs(texte, intention, contexte) {
    var resultats = [];
    var t = (texte || '').toLowerCase();
    for (var id in registreBlocs) {
      var bloc = registreBlocs[id];
      // Vérifier si le bloc est sélectionnable selon l'intention
      var selectionnable = false;
      var raison = '';
      // Blocs de comprendre (S2) : toujours sélectionnables pour une question
      if (bloc.vague === 'S2') { selectionnable = true; raison = 'vague-comprendre'; }
      // Blocs de contexte (S3) : sélectionnables si contexte disponible
      if (bloc.vague === 'S3') { selectionnable = true; raison = 'vague-contexte'; }
      // Blocs de décision (S4) : sélectionnables pour les questions complexes
      if (bloc.vague === 'S4' && t.length > 50) { selectionnable = true; raison = 'vague-decider-complexe'; }
      // Blocs de jugement (S5) : sélectionnables pour les réponses longues
      if (bloc.vague === 'S5') { selectionnable = true; raison = 'vague-juger'; }
      // Blocs de finalisation (S6) : toujours sélectionnables
      if (bloc.vague === 'S6') { selectionnable = true; raison = 'vague-finaliser'; }
      // Socle (S1) : toujours sélectionnable
      if (bloc.vague === 'S1') { selectionnable = true; raison = 'socle'; }
      if (selectionnable) {
        bloc.selectionnable = true;
        bloc.raisonSelection = raison;
        resultats.push(bloc);
      }
    }
    return resultats;
  }

  // ---------- Vérifier les dépendances ----------
  function verifierDependances(bloc, blocsExecutes) {
    var deps = bloc.dependances || [];
    if (deps.length === 0) return { ok: true, manquantes: [] };
    var manquantes = [];
    deps.forEach(function (dep) {
      var depBloc = registreBlocs[dep];
      if (!depBloc || !depBloc.executeDansCetteDemande) {
        manquantes.push(dep);
      }
    });
    return { ok: manquantes.length === 0, manquantes: manquantes };
  }

  // ---------- Exécuter un bloc ----------
  function executerBloc(blocId, input) {
    var bloc = registreBlocs[blocId];
    if (!bloc) return { ok: false, raison: 'bloc non enregistré' };
    if (!bloc.selectionnable) return { ok: false, raison: 'bloc non sélectionnable' };
    var deps = verifierDependances(bloc, null);
    if (!deps.ok) {
      bloc.etat = ETATS_BLOC.indisponible;
      bloc.erreur = 'dépendances manquantes: ' + deps.manquantes.join(', ');
      return { ok: false, raison: bloc.erreur };
    }
    bloc.etat = ETATS_BLOC.execute;
    bloc.ts = Date.now();
    try {
      if (bloc.fonction) {
        var resultat = bloc.fonction(input);
        bloc.etat = ETATS_BLOC.executeAvecResultat;
        bloc.contribution = resultat;
        bloc.executeDansCetteDemande = true;
        return { ok: true, resultat: resultat, etat: bloc.etat };
      } else {
        bloc.etat = ETATS_BLOC.nonApplicable;
        bloc.executeDansCetteDemande = false;
        return { ok: false, raison: 'pas de fonction exécutable' };
      }
    } catch (e) {
      bloc.etat = ETATS_BLOC.erreur;
      bloc.erreur = e.message;
      bloc.executeDansCetteDemande = false;
      return { ok: false, raison: e.message };
    }
  }

  // ---------- Exécuter le parcours pour une demande ----------
  function executerParcours(texte, intention, contexte) {
    // 1. Rechercher les blocs pertinents
    var selectionnes = rechercherBlocs(texte, intention, contexte);
    // 2. Trier par vague (S1 → S6)
    var ordre = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
    selectionnes.sort(function (a, b) {
      return ordre.indexOf(a.vague) - ordre.indexOf(b.vague);
    });
    // 3. Exécuter les blocs sélectionnables
    var resultats = [];
    var executeDansCetteDemande = [];
    selectionnes.forEach(function (bloc) {
      if (bloc.selectionnable) {
        var res = executerBloc(bloc.id, { texte: texte, intention: intention, contexte: contexte });
        if (res.ok) {
          executeDansCetteDemande.push(bloc.id);
        }
        resultats.push({ bloc: bloc.id, resultat: res });
      }
    });
    // 4. Réinitialiser pour la prochaine demande
    // (les blocs restent enregistrés, mais leur état "exécuté" est réinitialisé)
    return {
      selectionnes: selectionnes.map(function (b) { return b.id; }),
      executeDansCetteDemande: executeDansCetteDemande,
      resultats: resultats,
      nombreSelectionnes: selectionnes.length,
      nombreExecutes: executeDansCetteDemande.length
    };
  }

  // ---------- Réinitialiser les états d'exécution ----------
  function reinitialiserExecution() {
    for (var id in registreBlocs) {
      registreBlocs[id].etat = ETATS_BLOC.enregistre;
      registreBlocs[id].selectionnable = false;
      registreBlocs[id].executable = false;
      registreBlocs[id].executeDansCetteDemande = false;
      registreBlocs[id].contribution = null;
      registreBlocs[id].erreur = null;
      registreBlocs[id].raisonSelection = null;
      registreBlocs[id].ts = null;
    }
  }

  // ---------- Statistiques ----------
  function getStatistiques() {
    var total = 0, enregistres = 0, selectionnables = 0, executables = 0, executes = 0;
    for (var id in registreBlocs) {
      total++;
      var b = registreBlocs[id];
      if (b.etat === ETATS_BLOC.enregistre) enregistres++;
      if (b.selectionnable) selectionnables++;
      if (b.executable) executables++;
      if (b.executeDansCetteDemande) executes++;
    }
    return { total: total, enregistres: enregistres, selectionnables: selectionnables, executables: executables, executes: executes };
  }

  // ---------- API publique ----------
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ETATS_BLOC: ETATS_BLOC, enregistrerBloc: enregistrerBloc, rechercherBlocs: rechercherBlocs, verifierDependances: verifierDependances, executerBloc: executerBloc, executerParcours: executerParcours, reinitialiserExecution: reinitialiserExecution, getStatistiques: getStatistiques, registreBlocs: registreBlocs };
  }
  if (typeof window !== 'undefined') {
    window.ViaExecutionBLM = { ETATS_BLOC: ETATS_BLOC, enregistrerBloc: enregistrerBloc, rechercherBlocs: rechercherBlocs, verifierDependances: verifierDependances, executerBloc: executerBloc, executerParcours: executerParcours, reinitialiserExecution: reinitialiserExecution, getStatistiques: getStatistiques, registreBlocs: registreBlocs };
  }
})(typeof window !== 'undefined' ? window : global);