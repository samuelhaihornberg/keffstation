// src/parcelles-cos-cu.js — Communication parcellaire COS/CU pour ViArtificial Labs.
// Chaque BLM reçoit l'événement et la tâche du tour. Les données circulent
// en parcelles typées, partagées aux blocs autorisés, sans retransmission
// automatique de l'historique complet.
// Parcelle = unité de données partagée avec métadonnées complètes.
'use strict';
(function (global) {
  // ---------- Parcelle de données ----------
  function creerParcelle(params) {
    var p = params || {};
    return {
      id: p.id || ('parcelle-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)),
      tour: p.tour || null,
      source: p.source || null,
      destinataire: p.destinataire || null,
      matrice: p.matrice || null,
      canal: p.canal || null,
      typeDonnee: p.typeDonnee || 'json',
      permissions: p.permissions || 'lecture',
      version: p.version || 1,
      etat: p.etat || 'cree',
      // Mesures
      tailleEntree: p.tailleEntree || 0,
      tailleSortie: p.tailleSortie || 0,
      tokensEntree: p.tokensEntree || 0,
      tokensSortie: p.tokensSortie || 0,
      fanOut: p.fanOut || 1,
      compute: p.compute || { consomme: null, disponible: null, gain: null, type: 'indisponible' },
      latence: p.latence || 0,
      kef: p.kef || null,
      provenance: p.provenance || null,
      horodatage: Date.now()
    };
  }

  // ---------- Registre des parcelles actives ----------
  var parcellesActives = {};
  function enregistrerParcelle(parcelle) {
    if (parcelle && parcelle.id) parcellesActives[parcelle.id] = parcelle;
  }
  function getParcelle(id) { return parcellesActives[id] || null; }
  function listerParcelles(tour) {
    var out = [];
    for (var id in parcellesActives) {
      if (!tour || parcellesActives[id].tour === tour) out.push(parcellesActives[id]);
    }
    return out;
  }
  function nettoyerParcelles(tour) {
    for (var id in parcellesActives) {
      if (parcellesActives[id].tour !== tour) delete parcellesActives[id];
    }
  }

  // ---------- Routage parcellaire ----------
  // Chaque BLM reçoit l'événement et la tâche. Les données circulent en parcelles.
  // Pas de maillage intégral : routage selon les dépendances et autorisations.
  function routerParcelle(parcelle, blocsAutorises) {
    var resultats = [];
    (blocsAutorises || []).forEach(function (blocId) {
      var copie = Object.assign({}, parcelle, { destinataire: blocId, id: parcelle.id + '->' + blocId });
      enregistrerParcelle(copie);
      resultats.push(copie);
    });
    return resultats;
  }

  // ---------- Mesures par bloc/connexion/parcelle ----------
  function mesurerBloc(blocId, parcelle, compute, kef) {
    return {
      blocId: blocId,
      parcelleId: parcelle ? parcelle.id : null,
      tailleEntree: parcelle ? parcelle.tailleEntree : 0,
      tailleSortie: parcelle ? parcelle.tailleSortie : 0,
      tokensEntree: parcelle ? parcelle.tokensEntree : 0,
      tokensSortie: parcelle ? parcelle.tokensSortie : 0,
      matrice: parcelle ? parcelle.matrice : null,
      canal: parcelle ? parcelle.canal : null,
      fanOut: parcelle ? parcelle.fanOut : 1,
      compute: compute || { consomme: null, disponible: null, gain: null, type: 'indisponible' },
      latence: parcelle ? parcelle.latence : 0,
      etat: parcelle ? parcelle.etat : 'inconnu',
      kef: kef || null,
      provenance: parcelle ? parcelle.provenance : null
    };
  }

  // ---------- Export ----------
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { creerParcelle: creerParcelle, enregistrerParcelle: enregistrerParcelle, getParcelle: getParcelle, listerParcelles: listerParcelles, nettoyerParcelles: nettoyerParcelles, routerParcelle: routerParcelle, mesurerBloc: mesurerBloc };
  }
  if (typeof window !== 'undefined') {
    window.ViaParcelles = { creerParcelle: creerParcelle, enregistrerParcelle: enregistrerParcelle, getParcelle: getParcelle, listerParcelles: listerParcelles, nettoyerParcelles: nettoyerParcelles, routerParcelle: routerParcelle, mesurerBloc: mesurerBloc };
  }
})(typeof window !== "undefined" ? window : global);