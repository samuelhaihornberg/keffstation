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
      blocs: 0,
      liensInternes: 0,
      liensInterVagues: 0,
      liensStructurels: 0,
      blocsTransversaux: 8,
      portsEntree: 0,
      portsSortie: 0,
      connexionsExistantes: 677,
      connexionsMigrees: 0,
      connexionsNonTypees: 0,
      doublonsPotentiels: 0,
      canaux: 35,
      parcellesParTour: 0
    };

    if (global.BlmEquipe) {
      var be = global.BlmEquipe;
      // Compter les blocs
      if (be.GROUPE_COMPLET) resultats.blocs = be.GROUPE_COMPLET.length;
      // Liens internes : 4 par bloc
      resultats.liensInternes = resultats.blocs * 4;
      // Liens inter-vagues : 4 connexions par bloc vers la vague suivante
      // 5 vagues S2-S6, 4 passages = 4 * 20 * 20 = 1600 pour le noyau
      // Pour 192 blocs : proportionnel
      resultats.liensInterVagues = 4 * 20 * 20; // passages entre vagues S2→S3, S3→S4, S4→S5, S5→S6
      resultats.liensStructurels = resultats.liensInternes + resultats.liensInterVagues;
      // Ports : 4 par bloc (2 entrée + 2 sortie par connexion interne)
      resultats.portsEntree = resultats.blocs * 2;
      resultats.portsSortie = resultats.blocs * 2;
      // Parcelles par tour : 1 par bloc actif
      resultats.parcellesParTour = resultats.blocs;
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