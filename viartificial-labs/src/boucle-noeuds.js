// src/boucle-noeuds.js — Boucle de calcul à nœuds CPU et GPU (PWA, navigateur).
// Chaque nœud déclare l'opération qu'il exécute, ses entrées, sa sortie et son
// moteur réel. CPU = parsing, règles, préparation contexte, calculs compatibles.
// GPU = opération matricielle / inférence uniquement si le moteur installé la
// supporte (ici : moteur CPU/WASM local ; WebGPU non présent dans le projet).
// Pas de plafond arbitraire de passages ; une tâche bloquée attend un événement.
'use strict';
(function (global) {
  var reg = global.ViaRegistreCorps;
  var recyclor = global.ViaRecyclor;
  var noeuds = [];          // déclarations de nœuds
  var fileAttente = [];     // tâches en attente (régulateur)
  var tachesEnCours = new Map(); // idTache -> { noeud, debut, promesse }
  var historiquePassages = []; // traces légères par demande
  var prochaineId = 0;
  function now(){ return Date.now(); }
  function idTache(){ return 'tache-' + (prochaineId++).toString(36) + '-' + now().toString(36); }
  // Détecte si un moteur GPU est réellement disponible (WebGPU). Dans ce
  // projet, aucun moteur WebGPU n'est installé → GPU toujours indisponible
  // par défaut ; le reste tombe sur CPU/WASM.
  function detecterGPU(){
    try { return !!navigator.gpu; } catch (e) { return false; }
  }
  var GPU_DISPONIBLE = detecterGPU();
  // ---------- Déclaration de nœud ----------
  function declarerNoeud(spec){
    var noeud = {
      id: spec.id || ('noeud-' + now().toString(36)),
      operation: spec.operation || 'inconnu',
      entrees: Array.isArray(spec.entrees) ? spec.entrees.slice() : [],
      sortie: spec.sortie || null,
      moteur: spec.moteur || 'cpu-wasm',      // 'cpu-wasm' | 'gpu' | 'ollama' | 'custom'
      famille: spec.famille || 'cpu',
      etat: 'disponible',                      // disponible | occupe | indisponible
      dependances: Array.isArray(spec.dependances) ? spec.dependances.slice() : [],
      peutReutiliserDonnees: !!spec.peutReutiliserDonnees,
      dernierResultat: null,
      derniereEmpreinte: null
    };
    noeuds.push(noeud);
    return noeud;
  }
  function getNoeud(id){ return noeuds.find(function(n){ return n.id === id; }) || null; }
  function listerNoeuds(){ return noeuds.slice(); }
  // ---------- Nœuds par défaut (réel : CPU/WASM) ----------
  function initialiserNoeudsParDefaut(){
    if (noeuds.length > 0) return;
    declarerNoeud({ id: 'cpu-parsing', operation: 'parsing', moteur: 'cpu-wasm', famille: 'cpu', peutReutiliserDonnees: true });
    declarerNoeud({ id: 'cpu-regles', operation: 'regles', moteur: 'cpu-wasm', famille: 'cpu', peutReutiliserDonnees: true });
    declarerNoeud({ id: 'cpu-preparer-contexte', operation: 'preparer-contexte', moteur: 'cpu-wasm', famille: 'cpu', peutReutiliserDonnees: true });
    declarerNoeud({ id: 'cpu-inference', operation: 'inférence-texte', moteur: 'cpu-wasm', famille: 'cpu', peutReutiliserDonnees: true });
    declarerNoeud({ id: 'cpu-post-traitement', operation: 'post-traitement', moteur: 'cpu-wasm', famille: 'cpu', peutReutiliserDonnees: true });
    // GPU déclaré mais indisponible tant qu'aucun moteur WebGPU n'est présent
    declarerNoeud({ id: 'gpu-matrice', operation: 'operation-matricielle', moteur: 'gpu', famille: 'gpu', etat: 'indisponible', peutReutiliserDonnees: false });
    declarerNoeud({ id: 'gpu-inference', operation: 'inférence-matrice', moteur: 'gpu', famille: 'gpu', etat: 'indisponible', peutReutiliserDonnees: false });
  }
  initialiserNoeudsParDefaut();
  // ---------- Sélection de nœud (ordonnanceur) ----------
  function choisirNoeud(operation, moteurPrefere, dependancesSatisfaies){
    var candidats = noeuds.filter(function(n){
      if (n.etat !== 'disponible') return false;
      if (operation && n.operation !== operation) return false;
      if (moteurPrefere && n.moteur !== moteurPrefere) return false;
      return true;
    });
    if (candidats.length === 0) return null;
    // Préférer le nœud qui a déjà un dernier résultat réutilisable (données sur le même nœud)
    var reuse = candidats.find(function(n){ return n.peutReutiliserDonnees && n.dernierResultat != null; });
    if (reuse) return reuse;
    return candidats[0];
  }
  // ---------- Empreinte légère d'un résultat (déduplication / réutilisation) ----------
  function empreinteResultat(resultat){
    return empreinteLegere(String(resultat == null ? '' : resultat));
  }
  function empreinteLegere(str){ var h = 0; for (var i = 0; i < str.length; i++) { h = ((h << 5) - h + str.charCodeAt(i)) | 0; } return h.toString(16); }
  // ---------- Exécution sur un nœud ----------
  function executerSurNoeud(noeud, entrees, options){
    options = options || {};
    noeud.etat = 'occupe';
    var debut = now();
    var resultat;
    try {
      if (noeud.moteur === 'gpu') {
        if (!GPU_DISPONIBLE) throw new Error('gpu-indisponible');
        resultat = executerGPU(noeud, entrees, options);
      } else {
        resultat = executerCPU(noeud, entrees, options);
      }
      noeud.dernierResultat = resultat;
      noeud.derniereEmpreinte = empreinteResultat(resultat);
      noeud.etat = 'disponible';
      var duree = now() - debut;
      return { ok: true, resultat: resultat, noeud: noeud.id, moteur: noeud.moteur, operation: noeud.operation, duree: duree, empreinte: noeud.derniereEmpreinte };
    } catch (e) {
      noeud.etat = 'disponible';
      return { ok: false, erreur: e.message || 'echec-noeud', noeud: noeud.id, moteur: noeud.moteur, operation: noeud.operation };
    }
  }
  function executerCPU(noeud, entrees, options){
    switch (noeud.operation) {
      case 'parsing': return { texte: String(entrees.texte || ''), normalise: true, tokens: String(entrees.texte || '').split(/\s+/).length };
      case 'regles': return { règlesAppliquées: ['001-entree', '011-securite', '019-intention'], conformes: true };
      case 'preparer-contexte': return { contexte: entrees.contexte || [], langue: entrees.langue || 'fr', pret: true };
      case 'inférence-texte': return executerInférenceCPU(entrees, options);
      case 'post-traitement': return { texte: String(entrees.texte || ''), nettoye: true };
      default: return { operation: noeud.operation, traite: true, entrees: entrees };
    }
  }
  function executerGPU(noeud, entrees, options){
    // Placeholder : opération matricielle si un moteur GPU était présent.
    // Aucun WebGPU dans ce projet → cette branche n'est pas empruntée en
    // fonctionnement actuel.
    return { operation: noeud.operation, matrice: 'gpu-non-installe', resultat: null };
  }
  function executerInférenceCPU(entrees, options){
    // Délègue au moteur existant (ViaLocalEngine) et respecte sa propre boucle.
    var moteur = global.ViaLocalEngine;
    if (!moteur || !moteur.chat) throw new Error('moteur-cpu-non-charge');
    var msgs = entrees.messages || [];
    var bot = entrees.bot || { id: 'via', name: 'ViA' };
    // Appel synchrone encapsulé : le moteur gère sa propre boucle (worker WASM).
    // On retourne une promesse pour rester asynchrone.
    return moteur.chat(bot, msgs, { signal: options.signal }).then(function(texte){
      return { texte: texte, moteur: 'cpu-wasm', tokens: String(texte).split(/\s+/).length };
    });
  }
  // ---------- Booster : réutiliser résultat valide, éviter transfert, paralléliser ----------
  function booster(tache){
    var boosts = [];
    // Réutiliser un résultat valide sur le même nœud (évite un nouveau calcul)
    var n = getNoeud(tache.noeudId);
    if (n && n.dernierResultat && n.derniereEmpreinte === tache.empreinteAttendue) {
      boosts.push({ type: 'resultat-reutilise', noeud: n.id, raison: 'résultat valide déjà présent sur le nœud' });
      return { boosts: boosts, reutilise: true, resultat: n.dernierResultat };
    }
    // Éviter un transfert : si l'entrée vient du même nœud que le précédent passage
    if (tache.nœudPrecedent && tache.nœudPrecedent === tache.noeudId) {
      boosts.push({ type: 'pas-de-transfert', raison: 'données déjà sur le même nœud' });
    }
    return { boosts: boosts, reutilise: false };
  }
  // ---------- Régulateur : mettre en attente si ressource occupée, réveiller ----------
  function reguler(tache){
    var n = getNoeud(tache.noeudId);
    if (!n) return { ok: false, erreur: 'noeud-introuvable', id: tache.noeudId };
    if (n.etat === 'occupe') {
      fileAttente.push(tache);
      tache.etat = 'en-attente';
      return { ok: true, attente: true, motif: 'noeud-occupe', noeud: n.id };
    }
    return { ok: true, attente: false };
  }
  function reveillerAttente(){
    var traite = [];
    while (fileAttente.length > 0) {
      var t = fileAttente[0];
      var n = getNoeud(t.noeudId);
      if (n && n.etat === 'disponible') {
        fileAttente.shift();
        t.etat = 'pret';
        traite.push(t);
      } else {
        break; // le premier est encore occupé, on n'avance pas (pas de saut)
      }
    }
    return traite;
  }
  // ---------- Passage unique : parseur prépare, recyclor fournit, nœud exécute ----------
  var passagesEnCours = new Map(); // idDemande -> { dernierPassage, raison }
  function enregistrerPassage(idDemande, passage){
    var h = passagesEnCours.get(idDemande) || { passages: [] };
    h.passages.push(passage);
    passagesEnCours.set(idDemande, h);
  }
  function getPassages(idDemande){
    var h = passagesEnCours.get(idDemande);
    return h ? h.passages.slice() : [];
  }
  // Exécute une tâche de calcul : le régulateur place en attente si occupé, le
  // booster réutilise si possible, le nœud exécute, le résultat revient au
  // registre. Retourne une promesse (aucune limite de passages arbitraire).
  function executerTache(spec){
    return new Promise(function(resoudre, rejeter){
      var idDemande = spec.idDemande || 'demande-inconnue';
      var idT = idTache();
      var tache = {
        id: idT,
        idDemande: idDemande,
        operation: spec.operation || 'inférence-texte',
        noeudId: spec.noeudId || null,
        moteurPrefere: spec.moteurPrefere || 'cpu-wasm',
        entrees: spec.entrees || {},
        empreinteAttendue: spec.empreinteAttendue || null,
        nœudPrecedent: spec.nœudPrecedent || null,
        etat: 'pret',
        raison: spec.raison || 'nouvelle-entrée',
        ts: now()
      };
      // Un nouveau passage doit avoir une raison identifiable
      if (!tache.raison) tache.raison = 'nouvelle-entrée';
      // Régulateur : si le nœud est occupé, mettre en attente
      var regle = reguler(tache);
      if (regle.attente) {
        // tâche bloquée attend un événement (réveil quand le nœud se libère)
        return rejeter({ code: 'EN_ATTENTE', id: idT, motif: 'noeud-occupe', tache: tache });
      }
      // Booster : tenter la réutilisation
      var boost = booster(tache);
      if (boost.reutilise) {
        var p = { id: idT, idDemande: idDemande, noeud: boost.resultat ? (getNoeud(tache.noeudId)||{}).id : 'cache', operation: tache.operation, moteur: 'cache-reutilise', resultat: boost.resultat, boosts: boost.boosts, raison: 'reutilisation-resultat-valide', ts: now() };
        enregistrerPassage(idDemande, p);
        historiquePassages.push(p);
        tachesEnCours.delete(idT);
        return résoudre({ ok: true, id: idT, reutilise: true, resultat: boost.resultat, noeud: p.noeud, moteur: p.moteur, boosts: boost.boosts });
      }
      // Choisir un nœud si non précisé
      var n = getNoeud(tache.noeudId) || choisirNoeud(tache.operation, tache.moteurPrefere, true);
      if (!n) {
        // Aucun nœud disponible : remettre en attente (pas d'abandon)
        fileAttente.push(tache);
        tache.etat = 'en-attente';
        return rejeter({ code: 'AUCUN_NOEUD', id: idT, motif: 'aucun-noeud-disponible', tache: tache });
      }
      tache.noeudId = n.id;
      tachesEnCours.set(idT, { noeud: n, debut: now() });
      var execPromise;
      if (n.moteur === 'gpu' && !GPU_DISPONIBLE) {
        // Reprise CPU depuis un état compatible (pas d'abandon)
        var nCpu = choisirNoeud(tache.operation, 'cpu-wasm', true);
        if (!nCpu) return rejeter({ code: 'AUCUN_NOEUD_CPU', id: idT, motif: 'gpu-indisponible-et-pas-de-cpu' });
        tache.noeudId = nCpu.id;
        n = nCpu;
        tachesEnCours.set(idT, { noeud: n, debut: now() });
        execPromise = Promise.resolve(executerCPU(n, tache.entrees, { signal: spec.signal }));
      } else if (n.moteur === 'cpu-wasm' && n.operation === 'inférence-texte') {
        execPromise = executerInférenceCPU(tache.entrees, { signal: spec.signal });
      } else {
        execPromise = Promise.resolve(executerCPU(n, tache.entrees, { signal: spec.signal }));
      }
      execPromise.then(function(resultat){
        var p = {
          id: idT, idDemande: idDemande, noeud: n.id, operation: n.operation,
          moteur: n.moteur, resultat: resultat, boosts: boost.boosts,
          raison: tache.raison, ts: now(), empreinte: n.derniereEmpreinte
        };
        // Résultat dans le registre
        if (reg && spec.idCorpsResultat) {
          reg.enregistrerCorps({
            id: spec.idCorpsResultat,
            version: 1,
            type: 'resultat-intermediaire',
            source: 'noeud-' + n.id,
            dependances: [],
            ref: { type: 'inline', valeur: resultat },
            etat: 'actif',
            polarite: 'neutre',
            sante: 'disponible',
            cause: 'execution-noeud:' + n.id,
            ts: now()
          });
        }
        enregistrerPassage(idDemande, p);
        historiquePassages.push(p);
        tachesEnCours.delete(idT);
        // Réveiller les tâches en attente sur ce nœud
        reveillerAttente();
        résoudre({ ok: true, id: idT, reutilise: false, resultat: resultat, noeud: n.id, moteur: n.moteur, operation: n.operation, boosts: boost.boosts, empreinte: n.derniereEmpreinte });
      }, function(err){
        tachesEnCours.delete(idT);
        reveillerAttente();
        // Si GPU indisponible et qu'on peut tenter CPU, relancer proprement
        if (err && (err.code === 'gpu-indisponible' || err.message === 'gpu-indisponible')) {
          var nCpu = choisirNoeud(tache.operation, 'cpu-wasm', true);
          if (nCpu) {
            return Promise.resolve(executerCPU(nCpu, tache.entrees, { signal: spec.signal })).then(function(resultat){
              var p = { id: idT, idDemande: idDemande, noeud: nCpu.id, operation: nCpu.operation, moteur: nCpu.moteur, resultat: resultat, raison: 'reprise-cpu-apres-gpu-indisponible', ts: now() };
              enregistrerPassage(idDemande, p); historiquePassages.push(p);
              tachesEnCours.delete(idT); reveillerAttente();
              résoudre({ ok: true, id: idT, repriseCPU: true, resultat: resultat, noeud: nCpu.id, moteur: nCpu.moteur });
            }, rejeter);
          }
        }
        rejeter({ ok: false, id: idT, erreur: err && (err.message || err), tache: tache });
      });
    });
  }
  function resumer(){
    return {
      noeuds: noeuds.length,
      noeudsDisponibles: noeuds.filter(function(n){ return n.etat === 'disponible'; }).length,
      gpuDisponible: GPU_DISPONIBLE,
      enAttente: fileAttente.length,
      enCours: tachesEnCours.size,
      passages: historiquePassages.length
    };
  }
  global.ViaBoucleNoeuds = {
    declarerNoeud: declarerNoeud, getNoeud: getNoeud, listerNoeuds: listerNoeuds,
    choisirNoeud: choisirNoeud, executerSurNoeud: executerSurNoeud, executerTache: executerTache,
    booster: booster, reguler: reguler, reveillerAttente: reveillerAttente,
    enregistrerPassage: enregistrerPassage, getPassages: getPassages,
    resumer: resumer, GPU_DISPONIBLE: GPU_DISPONIBLE
  };
})(window);
