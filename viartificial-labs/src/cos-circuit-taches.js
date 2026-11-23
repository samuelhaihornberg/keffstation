// src/cos-circuit-taches.js — Circuits COS/CU, moteur de tâches, synthèse SuperBot, statuts progressifs.
// Réutilise les modules existants : blm-moteurs-cos, local-engine, providers, blm-equipe.
// A. Circuits COS/CU : connexions typées formant le circuit d'exécution d'une réponse.
// B. Moteur de tâches : CPU/GPU/Web/WASM/remote selon capacités réelles.
// C. SuperBot : synthèse d'une seule réponse à partir des contributions LLM+BLM.
// D. Statuts et affichage progressif.
'use strict';
(function (global) {
  // ---------- A. Circuits COS/CU ----------
  // Types de connexion COS/CU
  var COS_TYPES_CONNEXION = ['contexte', 'resultat', 'parametre', 'etat', 'retour'];
  // États d'un bloc dans le circuit
  var COS_ETATS_BLOC = ['en-attente', 'en-cours', 'termine', 'partiel', 'erreur', 'annule'];
  // Circuit d'exécution : liste ordonnée de blocs avec leurs connexions
  function creerCircuit(blocs) {
    return {
      id: 'circuit-' + Date.now(),
      blocs: (blocs || []).map(function (b, i) {
        return {
          id: b.id || ('B' + i),
          groupe: b.groupe || 'general',
          typeTache: b.typeTache || 'traitement',
          parametres: b.parametres || {},
          moteur: b.moteur || 'local',
          etat: 'en-attente',
          connexions: (b.connexions || []).map(function (c) {
            return { vers: c.vers, type: COS_TYPES_CONNEXION.indexOf(c.type) >= 0 ? c.type : 'contexte' };
          }),
          resultat: null,
          erreur: null
        };
      }),
      actif: true,
      annule: false
    };
  }
  // Propagation du contexte et des résultats entre blocs
  function propagerCircuit(circuit, contexteInitial) {
    var ctx = contexteInitial || {};
    for (var i = 0; i < circuit.blocs.length; i++) {
      var bloc = circuit.blocs[i];
      if (circuit.annule) { bloc.etat = 'annule'; continue; }
      bloc.etat = 'en-cours';
      // Transmettre le contexte accumulé
      bloc.parametres._contexte = ctx;
      // Le résultat sera rempli par le moteur
    }
    return circuit;
  }
  // Annulation d'un circuit
  function annulerCircuit(circuit) {
    if (circuit) { circuit.annule = true; circuit.blocs.forEach(function (b) { if (b.etat === 'en-cours') b.etat = 'annule'; }); }
  }

  // ---------- B. Moteur de tâches ----------
  // Groupes de tâches
  var GROUPES_TACHES = ['orchestration', 'contexte', 'samitisation', 'generation', 'verification', 'synthese', 'affichage'];
  // Types de moteur disponibles (selon capacités réelles)
  var MOTEURS = {
    'cpu-web': { nom: 'CPU Web (WASM)', disponible: true, accelere: false },
    'gpu-webgpu': { nom: 'GPU WebGPU', disponible: false, accelere: true }, // non implémenté dans le projet
    'wasm-local': { nom: 'WASM local (transformers.js)', disponible: true, accelere: false },
    'distant-ollama': { nom: 'Ollama distant', disponible: false, accelere: false },
    'distant-custom': { nom: 'Endpoint personnalisé', disponible: false, accelere: false },
    'repli': { nom: 'Repli (sans moteur)', disponible: true, accelere: false }
  };
  // Vérifier la disponibilité réelle des moteurs
  function verifierMoteurs() {
    var etat = {};
    // CPU/WASM local
    try { etat['wasm-local'] = global.ViaLocalEngine && global.ViaLocalEngine.summary && global.ViaLocalEngine.summary().phase === 'ready'; } catch (e) { etat['wasm-local'] = false; }
    // GPU WebGPU
    try { etat['gpu-webgpu'] = !!(navigator.gpu); } catch (e) { etat['gpu-webgpu'] = false; }
    // Distant
    try { etat['distant-ollama'] = false; etat['distant-custom'] = false; } catch (e) {}
    etat['cpu-web'] = true; // toujours disponible (JS pur)
    etat['repli'] = true; // toujours disponible
    return etat;
  }
  // Sélectionner le moteur le plus adapté selon le type de tâche et les capacités
  function selectionnerMoteur(typeTache, preference) {
    var moteurs = verifierMoteurs();
    if (preference && moteurs[preference]) return preference;
    if (typeTache === 'generation' && moteurs['wasm-local']) return 'wasm-local';
    if (typeTache === 'orchestration') return 'cpu-web';
    if (typeTache === 'contexte') return 'cpu-web';
    if (typeTache === 'samitisation') return 'cpu-web';
    if (typeTache === 'verification') return 'cpu-web';
    if (typeTache === 'synthese') return moteurs['wasm-local'] ? 'wasm-local' : 'cpu-web';
    if (typeTache === 'affichage') return 'cpu-web';
    return moteurs['wasm-local'] ? 'wasm-local' : 'cpu-web';
  }

  // ---------- C. SuperBot : synthèse ----------
  // État d'un participant
  function creerParticipant(id, type) {
    return { id: id, type: type || 'llm', etat: 'en-attente', contribution: null, erreur: null, ts: null };
  }
  // Solliciter tous les LLM et BLM configurés
  function solliciterParticipants(participants, demande, contexte) {
    var resultats = [];
    (participants || []).forEach(function (p) {
      p.etat = 'sollicite';
      p.ts = Date.now();
      resultats.push(p);
    });
    return resultats;
  }
  // Synthèse SuperBot : une seule réponse à partir des contributions
  function synthetiserSuperBot(contributions, contexte, style, genre) {
    var disponibles = (contributions || []).filter(function (c) { return c.etat === 'repondu' && c.contribution; });
    var manquants = (contributions || []).filter(function (c) { return c.etat !== 'repondu'; });
    // Construire la réponse à partir des contributions disponibles
    var parties = [];
    disponibles.forEach(function (c) {
      if (c.contribution && c.contribution.texte) {
        parties.push(c.contribution.texte);
      }
    });
    // Si aucune contribution, réponse réduite
    if (parties.length === 0) {
      return { texte: '', partiel: true, contributions: 0, manquants: manquants.map(function (m) { return m.id; }) };
    }
    // Synthèse : combiner les contributions les plus pertinentes
    var texte = parties.join(' ');
    // Adapter la longueur au besoin
    if (texte.length > 2000) texte = texte.slice(0, 2000) + '…';
    return {
      texte: texte,
      partiel: manquants.length > 0,
      contributions: disponibles.length,
      manquants: manquants.map(function (m) { return m.id; }),
      style: style || 'neutre',
      genre: genre || 'conversation'
    };
  }

  // ---------- D. Statuts et affichage progressif ----------
  var ETATS_VISIBLES = ['reçue', 'distribution', 'traitement', 'synthèse', 'affichage', 'terminée', 'partielle', 'erreur'];
  // Créer un tracker de statut
  function creerTracker() {
    return {
      etat: 'reçue',
      historique: [{ etat: 'reçue', ts: Date.now() }],
      progression: 0,
      texteProgressif: '',
      erreur: null
    };
  }
  function mettreAJourStatut(tracker, nouvelEtat, detail) {
    if (!tracker) return;
    tracker.etat = nouvelEtat;
    tracker.historique.push({ etat: nouvelEtat, detail: detail || '', ts: Date.now() });
    if (nouvelEtat === 'affichage' || nouvelEtat === 'terminée') tracker.progression = 100;
  }
  // Affichage progressif du texte
  function afficherProgressif(element, texte, vitesse) {
    if (!element) return;
    var i = 0;
    var v = vitesse || 20; // ms par caractère
    element.textContent = '';
    var interval = setInterval(function () {
      if (i < texte.length) {
        element.textContent += texte.charAt(i);
        i++;
      } else {
        clearInterval(interval);
      }
    }, v);
    return interval;
  }
  // Libérer les verrous
  function libererVerrous(circuit, tracker) {
    if (circuit) { circuit.annule = false; circuit.blocs.forEach(function (b) { if (b.etat === 'en-cours') b.etat = 'termine'; }); }
    if (tracker) { tracker.etat = 'terminée'; }
  }

  // ---------- CSS pour les circuits lumineux ----------
  function injecterCSSCircuits() {
    if (document.getElementById('cos-circuit-css')) return;
    var style = document.createElement('style');
    style.id = 'cos-circuit-css';
    style.textContent = `
      .cos-circuit { position: relative; padding: 8px; }
      .cos-bloc { display: inline-block; padding: 4px 8px; margin: 2px; border-radius: 6px; font-size: 0.75rem; border: 1px solid rgba(184,77,255,.3); background: rgba(184,77,255,.1); }
      .cos-bloc.en-cours { border-color: #00d4ff; box-shadow: 0 0 8px rgba(0,212,255,.4); animation: cos-pulse 1s infinite; }
      .cos-bloc.termine { border-color: #27d17f; background: rgba(39,209,127,.1); }
      .cos-bloc.erreur { border-color: #ff4d6d; background: rgba(255,77,109,.1); }
      .cos-bloc.partiel { border-color: #ffd23f; background: rgba(255,210,63,.1); }
      .cos-conduit { display: inline-block; width: 20px; height: 2px; background: linear-gradient(90deg, rgba(184,77,255,.2), rgba(184,77,255,.8), rgba(184,77,255,.2)); animation: cos-flow 1.5s infinite; }
      .cos-conduit.actif { background: linear-gradient(90deg, #00d4ff, #b84dff, #00d4ff); }
      @keyframes cos-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.7; } }
      @keyframes cos-flow { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
      .cos-status { font-size: 0.8rem; padding: 4px 8px; border-radius: 4px; }
      .cos-status.reçue { color: #8f96bd; }
      .cos-status.distribution { color: #b84dff; }
      .cos-status.traitement { color: #00d4ff; }
      .cos-status.synthèse { color: #ffd23f; }
      .cos-status.affichage { color: #27d17f; }
      .cos-status.terminée { color: #27d17f; font-weight: 700; }
      .cos-status.partielle { color: #ffd23f; font-weight: 700; }
      .cos-status.erreur { color: #ff4d6d; font-weight: 700; }
      /* Thème lumineux sur fond sombre */
      .cos-bloc.lumineux { background: rgba(255,255,255,.18); color: #fff; }
      .cos-bloc.veille { background: rgba(0,0,0,.4982); }
      .cos-bloc.intensif { filter: brightness(1.5); }
      /* Économie d'énergie */
      @media (prefers-reduced-motion: reduce) { .cos-conduit, .cos-bloc.en-cours { animation: none !important; } }
    `;
    document.head.appendChild(style);
  }

  // ---------- API publique ----------
  global.ViaCOSCircuit = {
    creerCircuit: creerCircuit,
    propagerCircuit: propagerCircuit,
    annulerCircuit: annulerCircuit,
    verifierMoteurs: verifierMoteurs,
    selectionnerMoteur: selectionnerMoteur,
    MOTEURS: MOTEURS,
    creerParticipant: creerParticipant,
    solliciterParticipants: solliciterParticipants,
    synthetiserSuperBot: synthetiserSuperBot,
    creerTracker: creerTracker,
    mettreAJourStatut: mettreAJourStatut,
    afficherProgressif: afficherProgressif,
    libererVerrous: libererVerrous,
    injecterCSS: injecterCSSCircuits,
    COS_TYPES_CONNEXION: COS_TYPES_CONNEXION,
    COS_ETATS_BLOC: COS_ETATS_BLOC,
    GROUPES_TACHES: GROUPES_TACHES,
    ETATS_VISIBLES: ETATS_VISIBLES
  };
})(window);