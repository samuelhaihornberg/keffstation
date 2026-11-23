// src/dedoublonnage.js — Dédoublonnage des connexions COS/CU pour ViArtificial Labs.
// Repère deux enregistrements décrivant exactement la même connexion.
// Ne supprime pas des communications réellement distinctes.
// Préserve les 677 connexions existantes, attribue le typage, détecte les doublons.
'use strict';
(function (global) {
  // ---------- Identité d'une connexion ----------
  // Deux connexions sont identiques si : même source, destination, direction,
  // ports, matrice, canal et fonction.
  function identiteConnexion(conn) {
    if (!conn) return null;
    return [
      conn.source || conn.de || '',
      conn.destination || conn.vers || '',
      conn.direction || 'sortant',
      conn.portSource || '',
      conn.portDestination || '',
      conn.matrice || '',
      conn.canal || conn.channelType || '',
      conn.fonction || conn.type || ''
    ].join('::');
  }

  // ---------- Dédoublonnage ----------
  function dedoublonner(connexions) {
    var vues = {};
    var uniques = [];
    var doublons = [];
    var potentiels = [];
    (connexions || []).forEach(function (conn) {
      var id = identiteConnexion(conn);
      if (!id) { uniques.push(conn); return; }
      if (vues[id]) {
        // Même identité exacte → doublon confirmé
        doublons.push({ conn: conn, original: vues[id], raison: 'identite-identique' });
      } else {
        // Vérifier si c'est un doublon potentiel (source+destination identiques mais autre chose diffère)
        var clePartielle = (conn.source || conn.de || '') + '::' + (conn.destination || conn.vers || '');
        var existePartiel = false;
        for (var k in vues) {
          if (k.indexOf(clePartielle) === 0 && k !== id) {
            existePartiel = true;
            break;
          }
        }
        if (existePartiel) {
          potentiels.push({ conn: conn, raison: 'doublon-potentiel' });
          uniques.push(conn); // conserver, marquer pour examen
        } else {
          vues[id] = conn;
          uniques.push(conn);
        }
      }
    });
    return {
      uniques: uniques,
      doublons: doublons,
      potentiels: potentiels,
      totalOriginal: (connexions || []).length,
      totalUnique: uniques.length,
      totalDoublons: doublons.length,
      totalPotentiels: potentiels.length
    };
  }

  // ---------- Typage d'une connexion existante ----------
  function typerConnexion(conn) {
    if (!conn) return null;
    var type = conn.type || null;
    var matrice = conn.matrice || null;
    var canal = conn.canal || conn.channelType || null;
    var source = conn.source || conn.de || null;
    var destination = conn.destination || conn.vers || null;
    // Déduire le type depuis les informations disponibles
    if (!type && conn.detail) {
      if (/contexte/i.test(conn.detail)) type = 'contexte';
      else if (/resultat/i.test(conn.detail)) type = 'resultat';
      else if (/parametre/i.test(conn.detail)) type = 'parametre';
      else if (/etat/i.test(conn.detail)) type = 'etat';
      else if (/retour/i.test(conn.detail)) type = 'retour';
    }
    // Déduire la matrice depuis le type
    if (!matrice && type) {
      if (type === 'contexte' || type === 'semantic_context') matrice = 'context_semantic';
      else if (type === 'resultat' || type === 'task_result') matrice = 'engine';
      else if (type === 'texte' || type === 'text_output') matrice = 'text';
    }
    return {
      source: source,
      destination: destination,
      type: type,
      matrice: matrice,
      canal: canal,
      typeDeduit: !conn.type || !conn.matrice,
      complet: !!(type && matrice && source && destination)
    };
  }

  // ---------- Migration des 677 connexions ----------
  function migrerConnexions(connexions) {
    var typees = [];
    var nonTypees = [];
    (connexions || []).forEach(function (conn) {
      var typee = typerConnexion(conn);
      if (typee && typee.complet) typees.push(Object.assign({}, conn, typee));
      else nonTypees.push({ conn: conn, typage: typee });
    });
    return {
      typees: typees,
      nonTypees: nonTypees,
      total: (connexions || []).length,
      typeesCount: typees.length,
      nonTypeesCount: nonTypees.length
    };
  }

  // ---------- Compteurs ----------
  function compterConnexions(connexions) {
    var structurelles = 0;
    var canaux = 0;
    var parcelles = 0;
    var portsEntree = 0;
    var portsSortie = 0;
    (connexions || []).forEach(function (conn) {
      structurelles++;
      if (conn.canaux && Array.isArray(conn.canaux)) canaux += conn.canaux.length;
      if (conn.parcelles && Array.isArray(conn.parcelles)) parcelles += conn.parcelles.length;
      if (conn.portsEntree) portsEntree += conn.portsEntree;
      if (conn.portsSortie) portsSortie += conn.portsSortie;
    });
    return {
      structurelles: structurelles,
      canaux: canaux,
      parcelles: parcelles,
      portsEntree: portsEntree,
      portsSortie: portsSortie
    };
  }

  // ---------- API publique ----------
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { identiteConnexion: identiteConnexion, dedoublonner: dedoublonner, typerConnexion: typerConnexion, migrerConnexions: migrerConnexions, compterConnexions: compterConnexions };
  }
  if (typeof window !== 'undefined') {
    window.ViaDedoublonnage = { identiteConnexion: identiteConnexion, dedoublonner: dedoublonner, typerConnexion: typerConnexion, migrerConnexions: migrerConnexions, compterConnexions: compterConnexions };
  }
})(typeof window !== "undefined" ? window : global);