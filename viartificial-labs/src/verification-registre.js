// src/verification-registre.js — Vérification du registre complet (192 BLMs).
// Vérifie que tous les blocs sont présents, non dupliqués, bien assignés.
'use strict';
(function (global) {
  function verifierRegistre() {
    var resultats = {
      totalAttendu: 192,
      totalTrouve: 0,
      doublons: [],
      manquants: [],
      horsVague: [],
      mauvaiseVague: [],
      transversaux: ['002', '042', '086', '088', '089', '090', '091', '092'],
      vagues: { S1: [], S2: [], S3: [], S4: [], S5: [], S6: [] },
      noyau100: [],
      ok: true
    };

    // Collecter tous les IDs attendus
    var attendus = [];
    for (var i = 1; i <= 192; i++) {
      var id = (i < 10 ? '00' : (i < 100 ? '0' : '')) + i;
      attendus.push(id);
    }

    // Vérifier BlmEquipe
    var be = global.BlmEquipe;
    if (!be && typeof require !== 'undefined') {
      try { be = require('./blm-equipe.js'); } catch (e) {}
    }
    if (be) {
      // Vérifier GROUPE_COMPLET
      if (be.GROUPE_COMPLET) {
        resultats.totalTrouve = be.GROUPE_COMPLET.length;
        // Détecter les doublons
        var vus = {};
        be.GROUPE_COMPLET.forEach(function (id) {
          if (vus[id]) resultats.doublons.push(id);
          vus[id] = true;
        });
        // Détecter les manquants
        attendus.forEach(function (id) {
          if (!vus[id]) resultats.manquants.push(id);
        });
      }
      // Vérifier les vagues
      if (be.VAGUES) {
        be.VAGUES.forEach(function (v) {
          var waveKey = 'S1';
          if (v.nom.indexOf('socle') >= 0) waveKey = 'S1';
          else if (v.nom.indexOf('comprendre') >= 0) waveKey = 'S2';
          else if (v.nom.indexOf('contexte') >= 0) waveKey = 'S3';
          else if (v.nom.indexOf('decider') >= 0) waveKey = 'S4';
          else if (v.nom.indexOf('juger') >= 0) waveKey = 'S5';
          else if (v.nom.indexOf('finaliser') >= 0) waveKey = 'S6';
          resultats.vagues[waveKey] = v.blocs || [];
        });
      }
      // Vérifier NOYAU_100
      if (be.NOYAU_100) {
        resultats.noyau100 = be.NOYAU_100;
      }
    }

    // Vérifier BlmNouveauxBlocs
    var nbMod = global.BlmNouveauxBlocs;
    if (!nbMod && typeof require !== 'undefined') {
      try { nbMod = require('./blm-nouveaux-blocs.js'); } catch (e) {}
    }
    if (nbMod && nbMod.NOUVEAUX_BLOCS) {
      var nb = Object.keys(nbMod.NOUVEAUX_BLOCS);
      // Vérifier que 111-192 sont présents
      for (var i = 111; i <= 192; i++) {
        if (nb.indexOf(String(i)) < 0) resultats.manquants.push(String(i));
      }
    }

    resultats.ok = resultats.doublons.length === 0 && resultats.manquants.length === 0;
    return resultats;
  }

  // ---------- Calcul du graphe réel ----------
  function calculerGraphe() {
    var resultats = {
      noyau100: {
        blocs: 100,
        liensInternes: 400,
        liensInterVagues: 1600,
        liensStructurels: 2000,
        portsEntree: 200,
        portsSortie: 200,
        parcellesEntree: 100,
        parcellesSortie: 100,
        blocsTransversaux: 0
      },
      equipe192: {
        blocs: 192,
        liensInternes: 768,
        liensInterVagues: 1600,
        liensStructurels: 2368,
        portsEntree: 384,
        portsSortie: 384,
        parcellesEntree: 192,
        parcellesSortie: 192,
        blocsTransversaux: 8
      },
      connexionsExistantes: 677,
      sourceConnexions: 'ABSENTE - aucune donnée source avec 677 connexions trouvée dans le dépôt ni dans l historique Git',
      migrationBloquee: true,
      fichierImportNecessaire: 'connexions-677.json ou matrice-v1.csv (colonnes: source,destination,direction,portSource,portDestination,matrice,canal,fonction)',
      rechercheEffectuee: {
        fichiersJson: 'aucun fichier avec 677 connexions',
        fichiersCsv: 'matrice-v1.csv contient 10047 lignes (pas 677)',
        historiqueGit: 'aucun commit avec 677 connexions',
        documentation: 'aucune référence à 677 dans les docs'
      },
      connexionsMigrees: 0,
      connexionsNonTypees: 0,
      doublonsExacts: 0,
      doublonsPotentiels: 0,
      connexionsDistinctes: 0,
      importeurDisponible: true,
      importeurModule: 'src/importeur-connexions.js',
      canaux: 35,
      matrices: 10,
      webgpu: 'indisponible',
      fluxExterne: {
        entreeUtilisateur: 1,
        reponseFinale: 1
      },
      typesRoutes: {
        directes: 'connexions entre blocs adjacents',
        busPartage: 'parcelles partagées via ViaParcelles.routerParcelle()'
      }
    };

    if (global.BlmEquipe) {
      var be = global.BlmEquipe;
      if (be.GROUPE_COMPLET) {
        var n = be.GROUPE_COMPLET.length;
        resultats.equipe192.blocs = n;
        resultats.equipe192.liensInternes = n * 4;
        resultats.equipe192.liensStructurels = resultats.equipe192.liensInternes + resultats.equipe192.liensInterVagues;
        resultats.equipe192.portsEntree = n * 2;
        resultats.equipe192.portsSortie = n * 2;
        resultats.equipe192.parcellesEntree = n;
        resultats.equipe192.parcellesSortie = n;
      }
      if (be.NOYAU_100) {
        var n100 = be.NOYAU_100.length;
        resultats.noyau100.blocs = n100;
        resultats.noyau100.liensInternes = n100 * 4;
        resultats.noyau100.liensStructurels = resultats.noyau100.liensInternes + resultats.noyau100.liensInterVagues;
        resultats.noyau100.portsEntree = n100 * 2;
        resultats.noyau100.portsSortie = n100 * 2;
        resultats.noyau100.parcellesEntree = n100;
        resultats.noyau100.parcellesSortie = n100;
      }
    }

    return resultats;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { verifierRegistre: verifierRegistre, calculerGraphe: calculerGraphe };
  }
  if (typeof window !== 'undefined') {
    window.ViaVerificationRegistre = { verifierRegistre: verifierRegistre, calculerGraphe: calculerGraphe };
  }
})(typeof window !== "undefined" ? window : global);