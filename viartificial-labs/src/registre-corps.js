// src/registre-corps.js — Registre des corps de données (PWA, navigateur).
// Pur, sans réseau, sans LLM. Aucun texte de règle BLLM n'est journalisé ni exposé.
// Types de corps : message | contexte | parametre | logique-bllm | outil | modele | resultat-intermediaire | resultat-final
// États de cycle : actif | passif | dormant | en-recyclage | fantome | zombie | ressuscite
// Polarités de circulation (relation avec la demande courante) : positive | negative | neutre | abstraite
// Santé : disponible | integre | a-jour | indisponible | corrompu | obsolète
'use strict';
(function (global) {
  var TYPES = ['message','contexte','parametre','logique-bllm','outil','modele','resultat-intermediaire','resultat-final'];
  var ETATS = ['actif','passif','dormant','en-recyclage','fantome','zombie','ressuscite'];
  var POLARITES = ['positive','negative','neutre','abstraite'];
  var SANTES = ['disponible','integre','a-jour','indisponible','corrompu','obsolète'];
  function estType(t){ return TYPES.indexOf(t) !== -1; }
  function estEtat(e){ return ETATS.indexOf(e) !== -1; }
  function estPolarite(p){ return POLARITES.indexOf(p) !== -1; }
  function estSante(s){ return SANTES.indexOf(s) !== -1; }
  function maintenant(){ return Date.now(); }
  function generateurId(){ var n = 0; return function(prefix){ return (prefix||'corps') + '-' + Date.now().toString(36) + '-' + (n++).toString(36) + '-' + Math.floor(Math.random()*10000).toString(36); }; }
  var nouvelId = generateurId();
  var registre = new Map();       // idCorps -> corps
  var demandes = new Map();       // idDemande -> { ids: [], created, etat }
  var transitions = new Map();    // idCorps -> [{etat, cause, ts}]
  function corpsVide(spec){
    var id = spec.id || nouvelId('corps');
    return {
      id: id,
      version: spec.version != null ? spec.version : 1,
      type: estType(spec.type) ? spec.type : 'parametre',
      source: spec.source || 'inconnu',
      dependances: Array.isArray(spec.dependances) ? spec.dependances.slice() : [],
      ref: spec.ref || { type: 'inline', valeur: null },
      etat: estEtat(spec.etat) ? spec.etat : 'passif',
      polarite: estPolarite(spec.polarite) ? spec.polarite : 'neutre',
      sante: estSante(spec.sante) ? spec.sante : 'disponible',
      cause: spec.cause || 'enregistrement',
      ts: maintenant(),
      usagesActifs: 0
    };
  }
  function enregistrerCorps(spec){
    var c = corpsVide(spec);
    registre.set(c.id, c);
    if (!transitions.has(c.id)) transitions.set(c.id, []);
    journalTransition(c.id, c.etat, c.cause, c.ts);
    return c;
  }
  function getCorps(id){ return registre.get(id) || null; }
  function journalTransition(idCorps, etat, cause, ts){
    if (!etat || !cause) return;
    var h = transitions.get(idCorps) || [];
    h.push({ etat: etat, cause: String(cause), ts: ts != null ? ts : maintenant() });
    transitions.set(idCorps, h);
  }
  function transitionCorps(id, nouvelEtat, cause){
    var c = getCorps(id);
    if (!c) return { ok: false, erreur: 'corps-introuvable', id: id };
    if (!estEtat(nouvelEtat)) return { ok: false, erreur: 'etat-inconnu', etat: nouvelEtat };
    if (c.etat === nouvelEtat) return { ok: true, corps: c, inchangé: true };
    var ancien = c.etat;
    c.etat = nouvelEtat;
    c.cause = cause || 'transition';
    c.ts = maintenant();
    journalTransition(id, nouvelEtat, cause, c.ts);
    // polarité préservée si non précisée dans cause ; santé inchangée sauf cas explicites
    return { ok: true, corps: c, ancienEtat: ancien, nouvelEtat: nouvelEtat };
  }
  function setPolarite(id, polarite){
    var c = getCorps(id);
    if (!c) return { ok: false, erreur: 'corps-introuvable' };
    if (!estPolarite(polarite)) return { ok: false, erreur: 'polarite-inconnue', polarite: polarite };
    c.polarite = polarite;
    c.ts = maintenant();
    journalTransition(id, c.etat, 'polarite->'+polarite, c.ts);
    return { ok: true, corps: c };
  }
  function setSante(id, sante){
    var c = getCorps(id);
    if (!c) return { ok: false, erreur: 'corps-introuvable' };
    if (!estSante(sante)) return { ok: false, erreur: 'sante-inconnue', sante: sante };
    c.sante = sante;
    c.ts = maintenant();
    journalTransition(id, c.etat, 'sante->'+sante, c.ts);
    return { ok: true, corps: c };
  }
  function lierDemande(idDemande, idCorps){
    if (!demandes.has(idDemande)) demandes.set(idDemande, { ids: [], created: maintenant() });
    var d = demandes.get(idDemande);
    if (d.ids.indexOf(idCorps) === -1) d.ids.push(idCorps);
    var c = getCorps(idCorps);
    if (c && c.etat === 'passif') transitionCorps(idCorps, 'actif', 'lier-demande:' + idDemande);
    return d;
  }
  function corpsDeDemande(idDemande){
    var d = demandes.get(idDemande);
    if (!d) return null;
    return d.ids.map(function(id){ return getCorps(id); }).filter(Boolean);
  }
  function compterUsagers(idCorps){
    var c = getCorps(idCorps);
    return c ? c.usagesActifs : 0;
  }
  function incrementerUsager(idCorps){
    var c = getCorps(idCorps);
    if (c){ c.usagesActifs = (c.usagesActifs || 0) + 1; if (c.etat === 'passif') transitionCorps(idCorps, 'actif', 'usage-debut'); }
    return c;
  }
  function decrementerUsager(idCorps){
    var c = getCorps(idCorps);
    if (c){ c.usagesActifs = Math.max(0, (c.usagesActifs || 0) - 1); if (c.usagesActifs === 0 && c.etat === 'actif') transitionCorps(idCorps, 'passif', 'usage-fin'); }
    return c;
  }
  function resumer(){
    var parEtat = {}, parType = {}, parPolarite = {};
    registre.forEach(function(c){
      parEtat[c.etat] = (parEtat[c.etat] || 0) + 1;
      parType[c.type] = (parType[c.type] || 0) + 1;
      parPolarite[c.polarite] = (parPolarite[c.polarite] || 0) + 1;
    });
    return { total: registre.size, demandes: demandes.size, parEtat: parEtat, parType: parType, parPolarite: parPolarite };
  }
  global.ViaRegistreCorps = {
    TYPES: TYPES, ETATS: ETATS, POLARITES: POLARITES, SANTES: SANTES,
    enregistrerCorps: enregistrerCorps, getCorps: getCorps, transitionCorps: transitionCorps,
    setPolarite: setPolarite, setSante: setSante, lierDemande: lierDemande,
    corpsDeDemande: corpsDeDemande, compterUsagers: compterUsagers,
    incrementerUsager: incrementerUsager, decrementerUsager: decrementerUsager,
    journalTransition: journalTransition, resumer: resumer, nouvelId: nouvelId
  };
})(window);
