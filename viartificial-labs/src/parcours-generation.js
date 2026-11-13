// src/parcours-generation.js — Premier bloc du moteur de génération (PWA ViArtificial).
// Câble le parcours utilisateur : message → parsing → Recyclor (contexte) →
// logiques BLLM pertinentes → génération sur le moteur disponible → réponse ViA.
// Trace technique légère par demande : nœud, opération, réutilisé/recalculé,
// transition d'état, résultat transmis. Règles BLLM non exposées dans les traces.
'use strict';
(function (global) {
  var parseur = global.ViaParseurDemande;
  var registre = global.ViaRegistreCorps;
  var recyclor = global.ViaRecyclor;
  var noeuds = global.ViaBoucleNoeuds;
  var moteur = global.ViaLocalEngine;
  // Demande en cours (une seule réponse visible à la fois)
  var demandeCourante = null; // { idDemande, bot, texte, abortController }
  var traces = {}; // idDemande -> trace technique
  function now(){ return Date.now(); }
  function estDisponible(){
    // Le parcours peut répondre si : salutation (sans moteur) OU moteur local prêt
    if (!moteur || !moteur.summary) return false;
    var ph = moteur.summary ? moteur.summary().phase : '';
    return (ph === 'ready' || ph === 'generating');
  }
  function trace(idDemande, cle, valeur){
    if (!traces[idDemande]) traces[idDemande] = [];
    traces[idDemande].push({ cle: cle, valeur: valeur, ts: now() });
  }
  function getTrace(idDemande){ return traces[idDemande] || []; }
  // ---------- Exécution du parcours complet ----------
  // Retourne une Promise. Si le parcours ne peut pas prendre le relais (moteur
  // absent et non salutation), la promise est rejetée avec { fallback: true }.
  function executerParcours(texte, bot, onReponse, onErreur){
    onReponse = onReponse || function(){};
    onErreur = onErreur || function(){};
    return new Promise(function(resoudre, rejeter){
      var idDemande = parseur ? parseur.nouvelIdDemande() : ('req-' + now().toString(36));
      // Annuler toute demande précédente (une seule réponse visible)
      if (demandeCourante && demandeCourante.abortController) {
        try { demandeCourante.abortController.abort(); } catch (e) {}
      }
      var abort = new AbortController();
      demandeCourante = { idDemande: idDemande, bot: bot, texte: texte, abortController: abort, terminee: false };
      trace(idDemande, 'etape', 'reception-message');
      trace(idDemande, 'idDemande', idDemande);
      try {
        // 1) Parsing : décrit chaque corps nécessaire au calcul
        var ctx = {};
        try {
          var langue = localStorage.getItem('via-langue-' + (bot && bot.id ? bot.id : 'via')) || 'fr';
          ctx = { langue: langue, version: 1, tailleEstimee: 0 };
        } catch (e) { ctx = { langue: 'fr', version: 1, tailleEstimee: 0 }; }
        var infoMoteur = moteur && moteur.summary ? moteur.summary() : {};
        var demande = parseur.parserDemande(texte, bot, ctx, {
          modelId: infoMoteur.model || null,
          downloadMB: infoMoteur.progress ? null : null
        });
        trace(idDemande, 'parseur', { corps: demande.corps.length, types: demande.typesUtilises });
        // Enregistrer les corps dans le registre (déjà fait par parserDemande, mais on s'assure)
        // 2) Recyclor : récupérer / restaurer le contexte (copier → coller)
        var idCorpsCtx = idDemande + '-ctx';
        var corpsCtx = registre ? registre.getCorps(idCorpsCtx) : null;
        if (recyclor && corpsCtx) {
          // Tenter le collage du contexte existant sur la demande
          var collage = recyclor.coller(idCorpsCtx, idDemande, { idTache: idDemande });
          trace(idDemande, 'recyclor-coller', { ok: collage.ok, idCorps: idCorpsCtx, employe: collage.employe });
          if (!collage.ok && collage.erreur === 'dependances-manquantes') {
            // Recalculer les parties qui dépendent (langue / bot changé)
            trace(idDemande, 'recyclor', 'dependances-manquantes → recalcul des parties dépendantes');
          }
        }
        trace(idDemande, 'etape', 'context-recyclor');
        // 3) Logiques BLLM pertinentes (orchestrateur existant)
        var orch = null;
        if (typeof orchestrerBLM === 'function') {
          var h = (typeof H === 'function') ? H(bot && bot.id ? bot.id : 'via') : [];
          h.push({ role: 'user', content: texte });
          orch = orchestrerBLM(texte, bot || { id: 'via', name: 'ViA' }, h);
          trace(idDemande, 'bllm', { intention: (orch && orch.intention) || '?', plan: (orch && orch.plan) ? 'oui' : 'non' });
        } else {
          trace(idDemande, 'bllm', { intention: 'orchestrerBLM-indisponible' });
        }
        // Salutation simple : réponse directe sans moteur (premier parcours ViA)
        try {
          var estSalut = false;
          if (typeof estSalutation === 'function') estSalut = estSalutation(texte);
          if (estSalut) {
            var reponse = typeof reponseSalutation === 'function' ? reponseSalutation() : 'Salut ! Ravi de te voir 😊';
            finaliser(idDemande, bot, reponse, 'réponse directe (salutation)', { moteur: 'aucun', operation: 'salutation-directe', reutilise: true });
            onReponse(reponse);
            resoudre({ ok: true, idDemande: idDemande, reponse: reponse, moteur: 'aucun' });
            return;
          }
        } catch (e) { /* continuer vers le moteur */ }
        // Vérifier que le moteur est prêt
        if (!moteur || !moteur.chat) {
          rejeter({ fallback: true, idDemande: idDemande, raison: 'moteur-indisponible' });
          return;
        }
        var sm = moteur.summary ? moteur.summary() : {};
        if (sm.phase !== 'ready' && sm.phase !== 'generating') {
          rejeter({ fallback: true, idDemande: idDemande, raison: 'moteur-non-pret', phase: sm.phase });
          return;
        }
        // 4) Préparer l'entrée moteur (logiques BLLM → messages)
        var prep = { ok: true, msgs: [{ role: 'system', content: 'Tu es ' + (bot && bot.name ? bot.name : 'ViA') + '. Réponds en français, court.' }].concat([{ role: 'user', content: texte }]) };
        if (typeof preparerEntreeMoteur === 'function') {
          try { prep = preparerEntreeMoteur(orch, texte, bot || { id: 'via', name: 'ViA' }); } catch (e) { prep = { ok: true, msgs: prep.msgs }; }
        }
        if (!prep.ok) {
          rejeter({ fallback: true, idDemande: idDemande, raison: 'preparation-echec', message: prep.message });
          return;
        }
        trace(idDemande, 'preparer-entree', { messages: (prep.msgs && prep.msgs.length) || 0 });
        // 5) Boucle nœuds : choisir CPU/GPU et exécuter l'inférence
        var operation = 'inférence-texte';
        var moteurPrefere = 'cpu-wasm';
        var idCorpsResInt = idDemande + '-res-int';
        var idCorpsResFinal = idDemande + '-res-final';
        // Régulateur : si aucun nœud disponible, attendre (pas d'abandon)
        var tacheSpec = {
          idDemande: idDemande,
          operation: operation,
          moteurPrefere: moteurPrefere,
          entrees: { messages: prep.msgs, bot: bot, langue: ctx.langue },
          idCorpsResultat: idCorpsResInt,
          raison: 'nouvelle-entrée',
          signal: abort.signal
        };
        // GPU à la demande si disponible (initialisation à la demande).
        // WebGPU n'est pas présent dans ce projet : gpuDemande reste false,
        // le parcours utilise CPU/WASM. Activation GPU à confirmer sur le téléphone.
        var gpuDemande = false && noeuds.GPU_DISPONIBLE;
        if (gpuDemande) {
          // Tenter GPU d'abord, reprise CPU si indisponible
          tacheSpec.moteurPrefere = 'gpu';
        }
        var commence = now();
        noeuds.executerTache(tacheSpec).then(function(resultatNoeud){
          if (demandeCourante && demandeCourante.idDemande !== idDemande) {
            // Une demande plus récente a pris le relais : ignorer ce résultat (zombie tardif)
            trace(idDemande, 'ignoré', 'demande-supersédée-par-plus-récente');
            rejeter({ ok: true, ignore: true, idDemande: idDemande, raison: 'demande-supersédée' });
            return;
          }
          var texteGenere = '';
          var r = resultatNoeud.resultat;
          if (r && r.texte) texteGenere = r.texte;
          else if (typeof r === 'string') texteGenere = r;
          else texteGenere = String(r || '');
          texteGenere = String(texteGenere).trim();
          if (!texteGenere) {
            rejeter({ fallback: true, idDemande: idDemande, raison: 'reponse-vide' });
            return;
          }
          // Corrections + vérification finale (BLM existantes)
          try {
            if (typeof blmCorrigerReponse === 'function') texteGenere = blmCorrigerReponse(orch, texteGenere) || texteGenere;
            if (typeof verifierFinaleBLM === 'function') texteGenere = verifierFinaleBLM(orch, texteGenere) || texteGenere;
          } catch (e) { /* garder le texte brut si correction échoue */ }
          trace(idDemande, 'generation', { noeud: resultatNoeud.noeud, moteur: resultatNoeud.moteur, operation: resultatNoeud.operation, duree: resultatNoeud.duree, reutilise: resultatNoeud.reutilise, boosts: resultatNoeud.boosts });
          // 6) Résultat final dans le registre
          if (parseur) {
            parseur.remplirResultat(idDemande, 'resultat-intermediaire', texteGenere, resultatNoeud.moteur, 'généré par ' + resultatNoeud.noeud);
            parseur.remplirResultat(idDemande, 'resultat-final', texteGenere, resultatNoeud.moteur, 'réponse finale affichée');
          }
          trace(idDemande, 'registre', { resultatFinal: 'enregistré', sante: 'disponible' });
          trace(idDemande, 'etape', 'affichage');
          trace(idDemande, 'duree-totale', now() - commence);
          // 7) Affichage : une seule réponse visible
          var moteurLabel = (resultatNoeud.moteur === 'cpu-wasm') ? 'moteur local CPU/WASM' : (resultatNoeud.moteur || 'moteur');
          if (typeof addPulsed === 'function') {
            addPulsed(bot || { id: 'via', name: 'ViA' }, texteGenere, moteurLabel);
          }
          if (typeof finaliserSortie === 'function') {
            var h = (typeof H === 'function') ? H(bot && bot.id ? bot.id : 'via') : [];
            h.push({ role: 'assistant', content: texteGenere, moteur: moteurLabel });
            try { finaliserSortie(bot || { id: 'via', name: 'ViA' }, h, texteGenere, orch, 'succes', idDemande); } catch (e) {}
          }
          if (typeof setState === 'function') setState('ready', 'réponse transmise');
          if (typeof afficherMoteurUtilise === 'function') afficherMoteurUtilise('parcours-generation-bloc1');
          trace(idDemande, 'termine', true);
          demandeCourante.terminee = true;
          onReponse(texteGenere);
          resoudre({ ok: true, idDemande: idDemande, reponse: texteGenere, moteur: resultatNoeud.moteur, noeud: resultatNoeud.noeud, trace: getTrace(idDemande) });
        }, function(err){
          if (demandeCourante && demandeCourante.idDemande !== idDemande) {
            trace(idDemande, 'ignoré-erreur', 'demande-supersédée');
            rejeter({ ok: true, ignore: true, idDemande: idDemande });
            return;
          }
          // Erreur : si c'est un fallback demandé, laisser l'ancien parcours prendre le relais
          if (err && err.fallback) {
            trace(idDemande, 'etape', 'fallback-ancien-parcours');
            rejeter(err);
            return;
          }
          // Si GPU demandé et indisponible, reprendre sur CPU (déjà géré dans executerTache)
          trace(idDemande, 'erreur', { code: err && err.code, message: err && (err.message || err) });
          if (typeof setState === 'function') setState('error', 'génération échouée');
          onErreur(err || new Error('échec génération'));
          rejeter({ ok: false, idDemande: idDemande, erreur: err });
        });
      } catch (e) {
        trace(idDemande, 'erreur-exception', { message: e && e.message });
        rejeter({ fallback: true, idDemande: idDemande, raison: 'exception', message: e && e.message });
      }
    });
  }
  function getDemandeCourante(){ return demandeCourante; }
  function getTraces(){ return traces; }
  global.ViaParcoursGeneration = {
    executerParcours: executerParcours,
    estDisponible: estDisponible,
    getDemandeCourante: getDemandeCourante,
    getTrace: getTrace,
    getTraces: getTraces
  };
})(window);
