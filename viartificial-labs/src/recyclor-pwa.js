// src/recyclor-pwa.js — Recyclor côté navigateur (PWA ViArtificial).
// « Matrice presse-papiers virtuelle » interne à ViArtificial : cycle copier →
// retirer de la mémoire de travail → restaurer au besoin.
// Aucune règle BLLM n'est exposée dans les logs/artefacts publics.
'use strict';
(function (global) {
  var reg = global.ViaRegistreCorps;
  var PREFIX_PRESSE = 'via-recyclor-presse:';
  var PREFIX_SAUVEGARDE = 'via-recyclor-sauve:';
  var PREFIX_CACHE = 'via-recyclor-cache:';
  var pressePapier = new Map();      // idPresse -> { idCorps, donneesRef, empreinte, ts, version, compresse, proprietaire }
  var sauvegardes = new Map();       // idSauvegarde -> { idCorps, empreinte, ts, lisible, snapshotRef }
  var copiesCache = new Map();       // idCopie -> { idCorps, empreinte, ts, origine }
  var tachesUtilisant = new Map();   // idCorps -> Set(idsTaches)
  function now(){ return Date.now(); }
  function empreinte(str){ var h = 0; for (var i = 0; i < String(str).length; i++) { h = ((h << 5) - h + String(str).charCodeAt(i)) | 0; } return h.toString(16); }
  function lireStockage(cle, def){
    try { var v = localStorage.getItem(cle); return v == null ? def : JSON.parse(v); } catch (e) { return def; }
  }
  function ecrireStockage(cle, val){
    try { localStorage.setItem(cle, JSON.stringify(val)); return true; } catch (e) { return false; }
  }
  function chargerPresse(){
    pressePapier.clear();
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var cle = localStorage.key(i);
        if (cle && cle.indexOf(PREFIX_PRESSE) === 0) {
          var v = lireStockage(cle, null);
          if (v) pressePapier.set(v.idPresse || cle.slice(PREFIX_PRESSE.length), v);
        }
      }
    } catch (e) {}
  }
  function chargerSauvegardes(){
    sauvegardes.clear();
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var cle = localStorage.key(i);
        if (cle && cle.indexOf(PREFIX_SAUVEGARDE) === 0) {
          var v = lireStockage(cle, null);
          if (v) sauvegardes.set(v.idSauvegarde || cle.slice(PREFIX_SAUVEGARDE.length), v);
        }
      }
    } catch (e) {}
  }
  function chargerCache(){
    copiesCache.clear();
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var cle = localStorage.key(i);
        if (cle && cle.indexOf(PREFIX_CACHE) === 0) {
          var v = lireStockage(cle, null);
          if (v) copiesCache.set(v.idCopie || cle.slice(PREFIX_CACHE.length), v);
        }
      }
    } catch (e) {}
  }
  function init(){
    chargerPresse(); chargerSauvegardes(); chargerCache();
  }
  // ---------- COPIER : place une copie du corps dans la presse-papiers virtuelle ----------
  function copier(idCorps, options){
    options = options || {};
    if (!reg) return { ok: false, erreur: 'registre-indisponible' };
    var c = reg.getCorps(idCorps);
    if (!c) return { ok: false, erreur: 'corps-introuvable', id: idCorps };
    // Vérifier qu'aucune tâche active n'utilise ce corps avant de le préparer
    var usagers = tachesUtilisant.get(idCorps);
    if (usagers && usagers.size > 0) {
      return { ok: false, erreur: 'corps-en-usage', id: idCorps, taches: Array.from(usagers) };
    }
    var idPresse = options.idPresse || ('presse-' + now().toString(36) + '-' + Math.floor(Math.random()*10000).toString(36));
    var donnees = c.ref && c.ref.type === 'inline' ? c.ref.valeur : null;
    var emp = empreinte(donnees == null ? '' : String(donnees));
    var compresse = options.compresse === true && donnees && String(donnees).length > 1024;
    var stocke = donnees;
    if (compresse) { stocke = btoa(unescape(encodeURIComponent(String(donnees)))); } // placeholder compression légère
    var entree = {
      idPresse: idPresse,
      idCorps: idCorps,
      donneesRef: c.ref,                  // référence (pas d'embarquement des poids lourds)
      donnees: stocke,                    // copie en mémoire de travail
      compresse: compresse,
      empreinte: emp,
      version: c.version,
      ts: now(),
      proprietaire: options.proprietaire || 'inconnu',
      type: c.type,
      sante: c.sante
    };
    pressePapier.set(idPresse, entree);
    ecrireStockage(PREFIX_PRESSE + idPresse, entree);
    return { ok: true, idPresse: idPresse, idCorps: idCorps, empreinte: emp, compresse: compresse, version: c.version };
  }
  // ---------- RETIRER DE LA MÉMOIRE DE TRAVAIL : libère un corps dormant ----------
  function retirerDeTravail(idCorps, options){
    options = options || {};
    if (!reg) return { ok: false, erreur: 'registre-indisponible' };
    var c = reg.getCorps(idCorps);
    if (!c) return { ok: false, erreur: 'corps-introuvable', id: idCorps };
    // Vérifier qu'aucune tâche active ne l'utilise
    var usagers = tachesUtilisant.get(idCorps);
    if (usagers && usagers.size > 0) {
      return { ok: false, erreur: 'tâche-active-utilise-le-corps', id: idCorps, taches: Array.from(usagers) };
    }
    // Si le corps est dormant, on peut le retirer de la mémoire de travail
    var etatAvant = c.etat;
    // Avant de libérer, vérifier la restauration dépendante d'un instantané
    if (options.instantaneId) {
      var snap = sauvegardes.get(options.instantaneId);
      if (!snap || !snap.lisible) {
        // écriture non réussie ou instantané illisible : garder le corps disponible
        return { ok: false, erreur: 'instantane-indisponible', id: idCorps, instantane: options.instantaneId, conserve: true };
      }
    }
    // Marquer en dormant (mis de côté, retrouvable)
    reg.transitionCorps(idCorps, 'dormant', 'retirer-memoire-travail');
    return { ok: true, idCorps: idCorps, etatAvant: etatAvant, etat: 'dormant', instantaneVerifie: !!options.instantaneId };
  }
  // ---------- SAUVEGARDER (instantané) : écriture doit réussir et être lisible ----------
  function sauvegarder(idCorps, options){
    options = options || {};
    if (!reg) return { ok: false, erreur: 'registre-indisponible' };
    var c = reg.getCorps(idCorps);
    if (!c) return { ok: false, erreur: 'corps-introuvable', id: idCorps };
    var idSauvegarde = options.idSauvegarde || ('sauve-' + now().toString(36) + '-' + Math.floor(Math.random()*10000).toString(36));
    var donnees = c.ref && c.ref.type === 'inline' ? c.ref.valeur : null;
    var emp = empreinte(donnees == null ? '' : String(donnees));
    var entree = {
      idSauvegarde: idSauvegarde,
      idCorps: idCorps,
      empreinte: emp,
      ts: now(),
      version: c.version,
      etat: c.etat,
      snapshotRef: c.ref,                 // référence vers le contenu (pas de copie lourde)
      lisible: true                       // l'écriture dans localStorage a réussi
    };
    var ok = ecrireStockage(PREFIX_SAUVEGARDE + idSauvegarde, entree);
    if (!ok) {
      // écriture échouée : garder le corps disponible
      reg.setSante(idCorps, 'indisponible');
      return { ok: false, erreur: 'ecriture-echec', id: idCorps, conserves: true };
    }
    sauvegardes.set(idSauvegarde, entree);
    // Vérifier lisibilité immédiate
    var verif = lireStockage(PREFIX_SAUVEGARDE + idSauvegarde, null);
    if (!verif || verif.empreinte !== emp) {
      reg.setSante(idCorps, 'corrompu');
      return { ok: false, erreur: 'instantane-illisible', id: idCorps, conserves: true };
    }
    reg.setSante(idCorps, 'a-jour');
    return { ok: true, idSauvegarde: idSauvegarde, idCorps: idCorps, empreinte: emp, lisible: true };
  }
  // ---------- RESTAURER : depuis un instantané, attendre écriture réussie + lisible ----------
  function restaurer(idSauvegarde, options){
    options = options || {};
    if (!reg) return { ok: false, erreur: 'registre-indisponible' };
    var snap = sauvegardes.get(idSauvegarde);
    if (!snap) {
      // chercher dans le stockage brut (cas recharge)
      var brut = lireStockage(PREFIX_SAUVEGARDE + idSauvegarde, null);
      if (!brut) return { ok: false, erreur: 'instantane-introuvable', id: idSauvegarde };
      snap = brut;
      sauvegardes.set(idSauvegarde, brut);
    }
    if (!snap.lisible) return { ok: false, erreur: 'instantane-illisible', id: idSauvegarde };
    var c = reg.getCorps(snap.idCorps);
    if (!c) return { ok: false, erreur: 'corps-introuvable', id: snap.idCorps };
    // Vérifier l'empreinte du contenu actuel contre l'instantané
    var donneesActuelles = c.ref && c.ref.type === 'inline' ? c.ref.valeur : null;
    var empActuelle = empreinte(donneesActuelles == null ? '' : String(donneesActuelles));
    if (empActuelle !== snap.empreinte) {
      // Restaurer la version sauvegardée
      c.ref = snap.snapshotRef || c.ref;
      c.version = snap.version || c.version;
      reg.transitionCorps(snap.idCorps, 'ressuscite', 'restaurer-instantane:' + idSauvegarde);
      reg.setSante(snap.idCorps, 'disponible');
      return { ok: true, idCorps: snap.idCorps, etat: 'ressuscite', version: c.version, restaure: true };
    }
    reg.transitionCorps(snap.idCorps, 'passif', 'restaurer-verifie:' + idSauvegarde);
    return { ok: true, idCorps: snap.idCorps, etat: 'passif', version: c.version, restaure: false };
  }
  // ---------- COLLER : rattacher une version validée à une demande ----------
  function coller(idPresse, idDemande, options){
    options = options || {};
    if (!reg) return { ok: false, erreur: 'registre-indisponible' };
    var entree = pressePapier.get(idPresse);
    if (!entree) return { ok: false, erreur: 'presse-papier-vide', id: idPresse };
    var idCorps = entree.idCorps;
    var c = reg.getCorps(idCorps);
    if (!c) return { ok: false, erreur: 'corps-introuvable', id: idCorps };
    // Vérifier les dépendances du corps avant de le rattacher
    var depsOk = true, depsManquantes = [];
    (c.dependances || []).forEach(function(dep){
      if (!reg.getCorps(dep)) { depsOk = false; depsManquantes.push(dep); }
    });
    if (!depsOk) {
      return { ok: false, erreur: 'dependances-manquantes', id: idCorps, manquantes: depsManquantes };
    }
    // Rattacher à la demande
    reg.lierDemande(idDemande, idCorps);
    // Passer le corps en actif pour cette demande
    reg.transitionCorps(idCorps, 'actif', 'coller-demande:' + idDemande);
    // Marquer usage par la tâche de la demande
    enregistrerUsage(idCorps, options.idTache || idDemande);
    return { ok: true, idCorps: idCorps, idDemande: idDemande, version: c.version, employe: true };
  }
  // ---------- COPIE CACHE vs SAUVEGARDE ----------
  // Copie cache : accélère le calcul, volontairement volatile
  function miseEnCache(idCorps, origine){
    if (!reg) return { ok: false, erreur: 'registre-indisponible' };
    var c = reg.getCorps(idCorps);
    if (!c) return { ok: false, erreur: 'corps-introuvable', id: idCorps };
    var idCopie = 'cache-' + now().toString(36) + '-' + Math.floor(Math.random()*10000).toString(36);
    var entree = { idCopie: idCopie, idCorps: idCorps, empreinte: empreinte(String(c.ref && c.ref.valeur)), ts: now(), origine: origine || 'inconnu' };
    copiesCache.set(idCopie, entree);
    ecrireStockage(PREFIX_CACHE + idCopie, entree);
    return { ok: true, idCopie: idCopie, idCorps: idCorps };
  }
  function lireCache(idCopie){
    return copiesCache.get(idCopie) || null;
  }
  // ---------- SUIVI DES TÂCHES ACTIVES ----------
  function enregistrerUsage(idCorps, idTache){
    if (!idTache) return;
    if (!tachesUtilisant.has(idCorps)) tachesUtilisant.set(idCorps, new Set());
    tachesUtilisant.get(idCorps).add(idTache);
    reg.incrementerUsager(idCorps);
  }

  function libererUsage(idCorps, idTache){
    if (!idTache) return;
    var usagers = tachesUtilisant.get(idCorps);
    if (usagers) { usagers.delete(idTache); if (usagers.size === 0) tachesUtilisant.delete(idCorps); }
    reg.decrementerUsager(idCorps);
  }
  function estUtilisePar(idCorps, idTache){
    var usagers = tachesUtilisant.get(idCorps);
    return !!(usagers && usagers.has(idTache));
  }
  function resumer(){
    return {
      presse: pressePapier.size,
      sauvegardes: sauvegardes.size,
      copiesCache: copiesCache.size,
      tachesActives: tachesUtilisant.size
    };
  }
  init();
  global.ViaRecyclor = {
    copier: copier, retirerDeTravail: retirerDeTravail, sauvegarder: sauvegarder,
    restaurer: restaurer, coller: coller,
    miseEnCache: miseEnCache, lireCache: lireCache,
    enregistrerUsage: enregistrerUsage, libererUsage: libererUsage, estUtilisePar: estUtilisePar,
    resumer: resumer
  };
})(window);
