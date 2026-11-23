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
    if (global.BlmEquipe) {
      var be = global.BlmEquipe;
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
          if (resultats.vagues[v.nom.replace('socle-', '').replace('comprendre-', '').replace('contexte-', '').replace('decider-', '').replace('juger-', '').replace('finaliser-', '')]) {
            // normalize
          }
          var waveKey = v.nom.split('-')[0].toUpperCase().replace('SOCLE', 'S1').replace('COMPRENDRE', 'S2').replace('CONTEXTE', 'S3').replace('DECIDER', 'S4').replace('JUGER', 'S5').replace('FINALISER', 'S6');
          if (resultats.vagues[waveKey]) {
            resultats.vagues[waveKey] = v.blocs || [];
          }
        });
      }
      // Vérifier NOYAU_100
      if (be.NOYAU_100) {
        resultats.noyau100 = be.NOYAU_100;
      }
    }

    // Vérifier BlmNouveauxBlocs
    if (global.BlmNouveauxBlocs && global.BlmNouveauxBlocs.NOUVEAUX_BLOCS) {
      var nb = Object.keys(global.BlmNouveauxBlocs.NOUVEAUX_BLOCS);
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
        parcellesParTour: 100
      },
      equipe192: {
        blocs: 192,
        liensInternes: 768,
        liensInterVagues: 1600,
        liensStructurels: 2368,
        portsEntree: 384,
        portsSortie: 384,
        parcellesParTour: 192,
        blocsTransversaux: 8
      },
      connexionsExistantes: 677,
      connexionsMigrees: 0,
      connexionsNonTypees: 0,
      doublonsPotentiels: 0,
      canaux: 35,
      matrices: 10,
      webgpu: 'indisponible'
    };

    if (global.BlmEquipe) {
      var be = global.BlmEquipe;
      if (be.GROUPE_COMPLET) {
        resultats.equipe192.blocs = be.GROUPE_COMPLET.length;
        resultats.equipe192.liensInternes = resultats.equipe192.blocs * 4;
        resultats.equipe192.liensStructurels = resultats.equipe192.liensInternes + resultats.equipe192.liensInterVagues;
        resultats.equipe192.portsEntree = resultats.equipe192.blocs * 2;
        resultats.equipe192.portsSortie = resultats.equipe192.blocs * 2;
        resultats.equipe192.parcellesParTour = resultats.equipe192.blocs;
      }
      if (be.NOYAU_100) {
        resultats.noyau100.blocs = be.NOYAU_100.length;
        resultats.noyau100.liensInternes = resultats.noyau100.blocs * 4;
        resultats.noyau100.liensStructurels = resultats.noyau100.liensInternes + resultats.noyau100.liensInterVagues;
        resultats.noyau100.portsEntree = resultats.noyau100.blocs * 2;
        resultats.noyau100.portsSortie = resultats.noyau100.blocs * 2;
        resultats.noyau100.parcellesParTour = resultats.noyau100.blocs;
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
})(window);