// src/parcelles-cos-cu.js — Communication parcellaire COS/CU pour ViArtificial Labs.
// Chaque BLM reçoit l'événement et la tâche du tour. Les données circulent
// en parcelles typées, partagées aux blocs autorisés, sans retransmission
// automatique de l'historique complet.
// Parcelle = unité de données partagée avec métadonnées complètes.
'use strict';
(function (global) {
  // ---------- États de la parcelle ----------
  var ETATS_PARCELLE = ['creee', 'validee', 'envoyee', 'reception-en-attente', 'recue', 'traitee', 'refusee', 'expiree', 'annulee'];
  // ---------- Parcelle de données ----------
  function creerParcelle(params) {
    var p = params || {};
    return {
      id: p.id || ('parcelle-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)),
      tour: p.tour || null,
      source: p.source || null,
      destinataire: p.destinataire || null, // string ou array
      destinatairesAutorises: p.destinatairesAutorises || [],
      matrice: p.matrice || null,
      canal: p.canal || null,
      typeDonnee: p.typeDonnee || 'json',
      permissions: p.permissions || 'lecture',
      version: p.version || 1,
      etat: 'creee',
      // Accusé de réception
      accuseReception: null, // {destinataire, ts, resultat}
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
      horodatage: Date.now(),
      // Historique des états
      historique: [{ etat: 'creee', ts: Date.now() }]
    };
  }

  // ---------- Validation ----------
  function validerParcelle(parcelle) {
    if (!parcelle) return { valide: false, raison: 'parcelle null' };
    if (!parcelle.id) return { valide: false, raison: 'id manquant' };
    if (!parcelle.source) return { valide: false, raison: 'source manquante' };
    if (!parcelle.destinataire && (!parcelle.destinatairesAutorises || parcelle.destinatairesAutorises.length === 0)) return { valide: false, raison: 'destinataire manquant' };
    if (!parcelle.matrice) return { valide: false, raison: 'matrice manquante' };
    if (!parcelle.canal) return { valide: false, raison: 'canal manquant' };
    return { valide: true, raison: 'ok' };
  }

  // ---------- Transition d'état ----------
  function transitionner(parcelle, nouvelEtat, detail) {
    if (!parcelle) return false;
    if (ETATS_PARCELLE.indexOf(nouvelEtat) < 0) return false;
    parcelle.etat = nouvelEtat;
    parcelle.historique.push({ etat: nouvelEtat, detail: detail || '', ts: Date.now() });
    sauvegarderParcelles();
    return true;
  }

  // ---------- Stockage persistant (IndexedDB avec fallback localStorage) ----------
  var DB_NAME = 'via-parcelles';
  var DB_VERSION = 1;
  var STORE_NAME = 'parcelles';
  var parcellesActives = {};
  var dbInstance = null;

  function ouvrirDB() {
    return new Promise(function (resolve, reject) {
      if (!window.indexedDB) { resolve(null); return; }
      if (dbInstance) { resolve(dbInstance); return; }
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function (e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          var store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('tour', 'tour', { unique: false });
          store.createIndex('etat', 'etat', { unique: false });
        }
      };
      req.onsuccess = function (e) { dbInstance = e.target.result; resolve(dbInstance); };
      req.onerror = function (e) { console.warn('[parcelles] IndexedDB erreur:', e.target.error); resolve(null); };
    });
  }

  function sauvegarderParcelles() {
    ouvrirDB().then(function (db) {
      if (db) {
        var tx = db.transaction(STORE_NAME, 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        // Effacer et réécrire
        store.clear();
        for (var id in parcellesActives) {
          store.put(parcellesActives[id]);
        }
        tx.oncomplete = function () {};
        tx.onerror = function (e) { console.warn('[parcelles] Erreur transaction:', e.target.error); };
      } else {
        // Fallback localStorage
        try { localStorage.setItem('via-parcelles-v1', JSON.stringify(parcellesActives)); } catch (e) { console.warn('[parcelles] localStorage erreur:', e && e.message); }
      }
    }).catch(function (e) { console.warn('[parcelles] Erreur sauvegarde:', e && e.message); });
  }

  function chargerParcelles() {
    return ouvrirDB().then(function (db) {
      if (db) {
        return new Promise(function (resolve) {
          var tx = db.transaction(STORE_NAME, 'readonly');
          var store = tx.objectStore(STORE_NAME);
          var req = store.getAll();
          req.onsuccess = function (e) {
            var result = e.target.result || [];
            parcellesActives = {};
            result.forEach(function (p) { parcellesActives[p.id] = p; });
            resolve(parcellesActives);
          };
          req.onerror = function () { resolve({}); };
        });
      } else {
        // Fallback localStorage
        try {
          var data = localStorage.getItem('via-parcelles-v1');
          if (data) parcellesActives = JSON.parse(data) || {};
        } catch (e) { parcellesActives = {}; }
        return Promise.resolve(parcellesActives);
      }
    }).catch(function (e) { console.warn('[parcelles] Erreur chargement:', e && e.message); parcellesActives = {}; return parcellesActives; });
  }

  function exporterParcelles() {
    return JSON.stringify(parcellesActives, null, 2);
  }

  function effacerParcelles() {
    parcellesActives = {};
    ouvrirDB().then(function (db) {
      if (db) {
        var tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).clear();
      } else {
        try { localStorage.removeItem('via-parcelles-v1'); } catch (e) {}
      }
    });
  }
  function enregistrerParcelle(parcelle) {
    if (parcelle && parcelle.id) {
      parcellesActives[parcelle.id] = parcelle;
      sauvegarderParcelles();
    }
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
    sauvegarderParcelles();
  }

  // ---------- Routage parcellaire ----------
  // Chaque BLM reçoit l'événement et la tâche. Les données circulent en parcelles.
  // Pas de maillage intégral : routage selon les dépendances et autorisations.
  function routerParcelle(parcelle, blocsAutorises) {
    var resultats = [];
    if (!parcelle) return resultats;
    // Valider la parcelle avant routage
    var validation = validerParcelle(parcelle);
    if (!validation.valide) {
      transitionner(parcelle, 'refusee', validation.raison);
      return resultats;
    }
    // Marquer comme envoyée
    transitionner(parcelle, 'envoyee', 'routage vers ' + (blocsAutorises || []).length + ' destinataires');
    (blocsAutorises || []).forEach(function (blocId) {
      var copie = Object.assign({}, parcelle, { destinataire: blocId, id: parcelle.id + '->' + blocId, etat: 'envoyee' });
      copie.historique = [{ etat: 'envoyee', ts: Date.now() }];
      enregistrerParcelle(copie);
      resultats.push(copie);
    });
    return resultats;
  }

  // ---------- Accusé de réception ----------
  // Appelé par le destinataire quand il a traité la parcelle
  function accuserReception(parcelleId, destinataire, resultat) {
    var p = getParcelle(parcelleId);
    if (!p) return { ok: false, raison: 'parcelle non trouvée' };
    if (p.destinataire !== destinataire && (p.destinatairesAutorises || []).indexOf(destinataire) < 0) {
      return { ok: false, raison: 'destinataire non autorisé' };
    }
    p.accuseReception = { destinataire: destinataire, ts: Date.now(), resultat: resultat || 'ok' };
    transitionner(p, 'recue', 'accusé de réception de ' + destinataire);
    // Mettre à jour la parcelle originale si c'est une copie routée
    var origId = parcelleId.split('->')[0];
    if (origId !== parcelleId) {
      var orig = getParcelle(origId);
      if (orig) {
        orig.accuseReception = p.accuseReception;
        // Vérifier si tous les destinataires ont accusé réception
        var toutesRecues = true;
        for (var id in parcellesActives) {
          if (id.indexOf(origId + '->') === 0 && parcellesActives[id].etat !== 'recue') {
            toutesRecues = false;
            break;
          }
        }
        if (toutesRecues) transitionner(orig, 'circulante', 'tous les destinataires ont accusé réception');
      }
    }
    return { ok: true, etat: p.etat };
  }

  // ---------- Traitement par le destinataire ----------
  function traiterParcelle(parcelleId, destinataire, resultat) {
    var p = getParcelle(parcelleId);
    if (!p) return { ok: false, raison: 'parcelle non trouvée' };
    p.tailleSortie = resultat ? (resultat.taille || 0) : 0;
    p.tokensSortie = resultat ? (resultat.tokens || 0) : 0;
    transitionner(p, 'traitee', 'traitée par ' + destinataire);
    return { ok: true, etat: p.etat };
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
    module.exports = { creerParcelle: creerParcelle, enregistrerParcelle: enregistrerParcelle, getParcelle: getParcelle, listerParcelles: listerParcelles, nettoyerParcelles: nettoyerParcelles, routerParcelle: routerParcelle, mesurerBloc: mesurerBloc, sauvegarderParcelles: sauvegarderParcelles, chargerParcelles: chargerParcelles, validerParcelle: validerParcelle, transitionner: transitionner, accuserReception: accuserReception, traiterParcelle: traiterParcelle, ETATS_PARCELLE: ETATS_PARCELLE, exporterParcelles: exporterParcelles, effacerParcelles: effacerParcelles };
  }
  if (typeof window !== 'undefined') {
    window.ViaParcelles = { creerParcelle: creerParcelle, enregistrerParcelle: enregistrerParcelle, getParcelle: getParcelle, listerParcelles: listerParcelles, nettoyerParcelles: nettoyerParcelles, routerParcelle: routerParcelle, mesurerBloc: mesurerBloc, sauvegarderParcelles: sauvegarderParcelles, chargerParcelles: chargerParcelles, validerParcelle: validerParcelle, transitionner: transitionner, accuserReception: accuserReception, traiterParcelle: traiterParcelle, ETATS_PARCELLE: ETATS_PARCELLE, exporterParcelles: exporterParcelles, effacerParcelles: effacerParcelles };
  }
})(typeof window !== "undefined" ? window : global);