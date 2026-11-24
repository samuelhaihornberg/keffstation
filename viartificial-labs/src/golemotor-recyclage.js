// src/golemotor-recyclage.js — Moteur de recyclage de cache GoleMotor.
// Boucle : COPIER → SUPPRIMER → RECOLLER.
// Types d'état : actif, passif, dormant, zombie, fantôme, ressuscité.
// Polarité : positive, négative, abstraite.
// Valeur énergétique calculée à partir des octets de référence.
'use strict';
(function (global) {
  var ETATS = ['actif', 'passif', 'dormant', 'zombie', 'fantome', 'ressuscite'];
  var POLARITES = ['positive', 'negative', 'abstraite'];

  // ---------- Valeur énergétique ----------
  function valeurEnergetique(octets) {
    if (!octets || octets < 0) return 0;
    // Calculée à partir des octets de référence (hash simple)
    var h = 0;
    var s = String(octets);
    for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; }
    return (h % 1000) / 10; // 0-100
  }

  // ---------- Élément recyclable ----------
  function creerElement(params) {
    var p = params || {};
    var octets = p.octets || 0;
    return {
      id: p.id || ('elem-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6)),
      type: p.type || 'donnees',
      polarite: p.polarite || 'positive',
      etat: p.etat || 'actif',
      octetsOrigine: octets,
      valeurEnergetique: valeurEnergetique(octets),
      historique: [],
      version: 1,
      ts: Date.now()
    };
  }

  // ---------- Transitions d'état ----------
  // actif → passif → dormant → zombie → fantôme → ressuscité
  var TRANSITIONS = {
    actif: ['passif'],
    passif: ['dormant', 'actif'],
    dormant: ['zombie', 'actif'],
    zombie: ['fantome', 'ressuscite'],
    fantome: ['ressuscite', 'dormant'],
    ressuscite: ['actif', 'passif']
  };

  function peutTransitionner(etatActuel, nouvelEtat) {
    var possibles = TRANSITIONS[etatActuel] || [];
    return possibles.indexOf(nouvelEtat) >= 0;
  }

  // Évolution de la polarité selon l'état
  function evoluerPolarite(etat, polariteActuelle) {
    if (etat === 'zombie') {
      if (polariteActuelle === 'positive') return 'negative';
      if (polariteActuelle === 'negative') return 'abstraite';
    }
    if (etat === 'ressuscite') return 'positive';
    return polariteActuelle;
  }

  // ---------- Cycle de recyclage : COPIER → SUPPRIMER → RECOLLER ----------
  function cycleRecyclage(element, nouvelEtat) {
    if (!element) return null;
    if (!peutTransitionner(element.etat, nouvelEtat)) {
      return { ok: false, raison: 'transition non autorisee: ' + element.etat + ' -> ' + nouvelEtat };
    }
    // 1. COPIER : conserver la donnée originale et ses octets de référence
    var copie = {
      octetsOrigine: element.octetsOrigine,
      valeurEnergetique: element.valeurEnergetique,
      type: element.type,
      polarite: element.polarite,
      etat: element.etat,
      version: element.version,
      ts: Date.now()
    };
    // 2. Évaluer l'état de santé
    var sante = calculerSante(element);
    // 3. SUPPRIMER : supprimer la version ciblée selon sa transition
    var etatPrecedent = element.etat;
    var polaritePrecedente = element.polarite;
    // 4. RECOLLER : restaurer la donnée originale ou la version recyclée
    element.etat = nouvelEtat;
    element.polarite = evoluerPolarite(nouvelEtat, element.polarite);
    element.valeurEnergetique = valeurEnergetique(element.octetsOrigine);
    element.version++;
    // Enregistrer l'historique de transition
    element.historique.push({
      etatPrecedent: etatPrecedent,
      etatCourant: element.etat,
      polaritePrecedente: polaritePrecedente,
      polariteCourante: element.polarite,
      valeurEnergetique: element.valeurEnergetique,
      octetsOrigine: element.octetsOrigine,
      resultatRecyclage: sante >= 0.5 ? 'valide' : 'degrade',
      ts: Date.now()
    });
    return {
      ok: true,
      element: element,
      transition: etatPrecedent + ' -> ' + element.etat,
      polarite: polaritePrecedente + ' -> ' + element.polarite,
      sante: sante,
      copie: copie
    };
  }

  // ---------- Santé de l'élément ----------
  function calculerSante(element) {
    if (!element) return 0;
    var ve = element.valeurEnergetique || 0;
    var transitions = element.historique ? element.historique.length : 0;
    // Santé = valeur énergétique normalisée - pénalité pour les transitions dégradées
    var degrade = 0;
    if (element.historique) {
      element.historique.forEach(function (h) {
        if (h.resultatRecyclage === 'degrade') degrade++;
      });
    }
    var sante = (ve / 100) - (degrade * 0.1);
    return Math.max(0, Math.min(1, sante));
  }

  // ---------- Recyclage automatique selon les règles ----------
  function recyclerAutomatique(element) {
    if (!element) return null;
    var sante = calculerSante(element);
    var nouvelEtat = null;
    if (element.etat === 'actif' && sante < 0.3) nouvelEtat = 'passif';
    else if (element.etat === 'passif' && sante < 0.2) nouvelEtat = 'dormant';
    else if (element.etat === 'dormant' && sante < 0.1) nouvelEtat = 'zombie';
    else if (element.etat === 'zombie') nouvelEtat = 'fantome';
    else if (element.etat === 'fantome' && sante > 0.5) nouvelEtat = 'ressuscite';
    if (nouvelEtat && peutTransitionner(element.etat, nouvelEtat)) {
      return cycleRecyclage(element, nouvelEtat);
    }
    return { ok: false, raison: 'pas de transition automatique' };
  }

  // ---------- Registre des éléments ----------
  var registre = {};
  function enregistrer(element) {
    if (element && element.id) registre[element.id] = element;
  }
  function get(id) { return registre[id] || null; }
  function lister() { return Object.values(registre); }
  function parEtat(etat) { return Object.values(registre).filter(function (e) { return e.etat === etat; }); }
  function parPolarite(polarite) { return Object.values(registre).filter(function (e) { return e.polarite === polarite; }); }

  // ---------- API publique ----------
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ETATS: ETATS, POLARITES: POLARITES, TRANSITIONS: TRANSITIONS, creerElement: creerElement, cycleRecyclage: cycleRecyclage, calculerSante: calculerSante, recyclerAutomatique: recyclerAutomatique, valeurEnergetique: valeurEnergetique, evoluerPolarite: evoluerPolarite, peutTransitionner: peutTransitionner, enregistrer: enregistrer, get: get, lister: lister, parEtat: parEtat, parPolarite: parPolarite };
  }
  if (typeof window !== 'undefined') {
    window.GoleMotorRecyclage = { ETATS: ETATS, POLARITES: POLARITES, TRANSITIONS: TRANSITIONS, creerElement: creerElement, cycleRecyclage: cycleRecyclage, calculerSante: calculerSante, recyclerAutomatique: recyclerAutomatique, valeurEnergetique: valeurEnergetique, evoluerPolarite: evoluerPolarite, peutTransitionner: peutTransitionner, enregistrer: enregistrer, get: get, lister: lister, parEtat: parEtat, parPolarite: parPolarite };
  }
})(typeof window !== 'undefined' ? window : global);