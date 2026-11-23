// src/importeur-connexions.js — Importeur strict pour les 677 connexions historiques.
// Si la source est absente, l'état reste BLOQUÉ et un diagnostic précis est fourni.
// Formats attendus : JSON array ou CSV avec colonnes source,destination,direction,ports,matrice,canal,fonction.
'use strict';
(function (global) {
  var ETAT_MIGRATION = 'BLOQUE';
  var MOTIF = 'Source des 677 connexions non trouvée dans le dépôt';
  var FICHIER_ATTENDU = 'connexions-677.json ou matrice-v1.csv (avec colonnes source,destination,direction,portSource,portDestination,matrice,canal,fonction)';
  var DONNEES_SOURCE = null;

  // Schéma attendu pour une connexion
  var SCHEMA_CONNEXION = {
    source: 'string (requis)',
    destination: 'string (requis)',
    direction: 'string (sortant|entrant, défaut: sortant)',
    portSource: 'string (optionnel)',
    portDestination: 'string (optionnel)',
    matrice: 'string (optionnel, une des 10 matrices)',
    canal: 'string (optionnel, un des 35 canaux)',
    fonction: 'string (optionnel)',
    type: 'string (optionnel)'
  };

  function validerConnexion(conn) {
    var erreurs = [];
    if (!conn) { erreurs.push('connexion null'); return { valide: false, erreurs: erreurs }; }
    if (!conn.source && !conn.de) erreurs.push('source manquante');
    if (!conn.destination && !conn.vers) erreurs.push('destination manquante');
    return { valide: erreurs.length === 0, erreurs: erreurs };
  }

  function importerJSON(data) {
    if (!Array.isArray(data)) return { ok: false, erreur: 'Les données doivent être un tableau JSON', importes: 0 };
    var valides = [];
    var invalides = [];
    data.forEach(function (conn, idx) {
      var v = validerConnexion(conn);
      if (v.valide) valides.push(conn);
      else invalides.push({ index: idx, conn: conn, erreurs: v.erreurs });
    });
    if (valides.length > 0) {
      DONNEES_SOURCE = valides;
      ETAT_MIGRATION = 'PRET';
      MOTIF = valides.length + ' connexions valides importées';
    }
    return { ok: valides.length > 0, importes: valides.length, invalides: invalides.length, details: invalides.slice(0, 10) };
  }

  function importerCSV(texte) {
    if (!texte || typeof texte !== 'string') return { ok: false, erreur: 'Texte CSV vide', importes: 0 };
    var lignes = texte.split('\n').filter(function (l) { return l.trim().length > 0; });
    if (lignes.length < 2) return { ok: false, erreur: 'CSV doit avoir au moins un en-tête et une ligne', importes: 0 };
    var header = lignes[0].split(',').map(function (h) { return h.trim().toLowerCase(); });
    var connexions = [];
    for (var i = 1; i < lignes.length; i++) {
      var cols = lignes[i].split(',');
      var conn = {};
      header.forEach(function (h, idx) {
        if (cols[idx] !== undefined) conn[h] = cols[idx].trim();
      });
      connexions.push(conn);
    }
    return importerJSON(connexions);
  }

  function getEtat() {
    return {
      etat: ETAT_MIGRATION,
      motif: MOTIF,
      fichierAttendu: FICHIER_ATTENDU,
      donneesChargees: DONNEES_SOURCE ? DONNEES_SOURCE.length : 0,
      schema: SCHEMA_CONNEXION
    };
  }

  function migrer() {
    if (!DONNEES_SOURCE) return { ok: false, erreur: 'Aucune donnee source chargee. Importez d abord un fichier.', etat: 'BLOQUE' };
    // Utiliser le module dedoublonnage
    var dedoub = global.ViaDedoublonnage;
    if (!dedoub && typeof require !== 'undefined') {
      try { dedoub = require('./dedoublonnage.js'); } catch (e) {}
    }
    if (!dedoub) return { ok: false, erreur: 'Module dedoublonnage non chargé', etat: 'BLOQUE' };
    var migration = dedoub.migrerConnexions(DONNEES_SOURCE);
    var dedoubResult = dedoub.dedoublonner(migration.typees);
    ETAT_MIGRATION = 'TERMINE';
    return {
      ok: true,
      etat: 'TERMINE',
      totalOriginal: DONNEES_SOURCE.length,
      typees: migration.typeesCount,
      nonTypees: migration.nonTypeesCount,
      doublonsExacts: dedoubResult.totalDoublons,
      doublonsPotentiels: dedoubResult.totalPotentiels,
      connexionsDistinctes: dedoubResult.totalUnique,
      nonTypeesDetails: migration.nonTypees.slice(0, 10)
    };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validerConnexion: validerConnexion, importerJSON: importerJSON, importerCSV: importerCSV, getEtat: getEtat, migrer: migrer, SCHEMA_CONNEXION: SCHEMA_CONNEXION };
  }
  if (typeof window !== 'undefined') {
    window.ViaImporteurConnexions = { validerConnexion: validerConnexion, importerJSON: importerJSON, importerCSV: importerCSV, getEtat: getEtat, migrer: migrer, SCHEMA_CONNEXION: SCHEMA_CONNEXION };
  }
})(typeof window !== 'undefined' ? window : global);