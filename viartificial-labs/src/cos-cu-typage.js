// src/cos-cu-typage.js — Typage complet du réseau COS/CU pour ViArtificial Labs.
// Définit les types de matrices, canaux, blocs, connexions, enveloppes de message,
// états d'exécution, KEF/compute et comptage du graphe.
// Réutilise les structures existantes (cos-langage.js, blm-equipe.js, cos-circuit-taches.js, kef.js).
'use strict';
(function (global) {
  // ---------- 1. TYPES DES CINQ MATRICES ----------
  var MATRIX_IDS = ['background', 'text', 'image', 'engine', 'context_semantic'];
  var MATRIX_LABELS = {
    background: 'Thème, fond, mise en page visuelle, animation des conduits et éclats lumineux',
    text: 'Entrée utilisateur, contexte textuel transmis, fragments générés et réponse affichée',
    image: 'Références d\'images, métadonnées, requêtes de génération et résultats image',
    engine: 'Tâches, orchestration, modèles sollicités, compute et états d\'exécution',
    context_semantic: 'Sens, historique pertinent, préférences disponibles, mémoire, feedback et relations sémantiques'
  };
  function creerMatrice(id) {
    if (MATRIX_IDS.indexOf(id) < 0) return null;
    return { id: id, label: MATRIX_LABELS[id], canaux: [], synchronise: true, tourCourant: null };
  }

  // ---------- 2. TYPES DE CANAUX ----------
  var CHANNEL_TYPES = [
    'control', 'task_request', 'task_result', 'text_input', 'text_context',
    'text_chunk', 'text_output', 'image_input', 'image_metadata',
    'image_generation_request', 'image_output', 'semantic_context',
    'memory_reference', 'user_feedback', 'style_instruction',
    'compute_request', 'compute_result', 'kef_metrics', 'status_update',
    'visual_layout', 'animation_event'
  ];
  // Association canal → matrice
  var CANAL_MATRICE = {
    text_input: 'text', text_context: 'text', text_chunk: 'text', text_output: 'text', style_instruction: 'text',
    image_input: 'image', image_metadata: 'image', image_generation_request: 'image', image_output: 'image',
    control: 'engine', task_request: 'engine', task_result: 'engine', compute_request: 'engine',
    compute_result: 'engine', kef_metrics: 'engine', status_update: 'engine',
    semantic_context: 'context_semantic', memory_reference: 'context_semantic', user_feedback: 'context_semantic',
    visual_layout: 'background', animation_event: 'background'
  };
  function canalVersMatrice(canalType) {
    return CANAL_MATRICE[canalType] || null;
  }
  function creerCanal(type, matriceId) {
    if (CHANNEL_TYPES.indexOf(type) < 0) return null;
    var m = matriceId || canalVersMatrice(type);
    if (!m || MATRIX_IDS.indexOf(m) < 0) return null;
    return { type: type, matrice: m, statut: 'cree', horodatage: Date.now() };
  }

  // ---------- 3. TYPES DE BLOCS ----------
  var WAVE_IDS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
  var EXECUTION_MODES = ['sequential', 'parallel', 'merge'];
  var BLOCK_ROLES = ['understand', 'context', 'decide', 'judge', 'finalize', 'foundation'];
  // Mapping vague → rôle
  var VAGUE_ROLE = { S1: 'foundation', S2: 'understand', S3: 'context', S4: 'decide', S5: 'judge', S6: 'finalize' };
  function creerDefinitionBloc(def) {
    var d = def || {};
    var wave = WAVE_IDS.indexOf(d.wave) >= 0 ? d.wave : 'S2';
    return {
      id: d.id || null,
      nom: d.nom || '',
      description: d.description || '',
      wave: wave,
      role: d.role || VAGUE_ROLE[wave] || 'understand',
      typesTacheAcceptes: d.typesTacheAcceptes || [],
      typesTacheProduits: d.typesTacheProduits || [],
      entrees: d.entrees || [],
      sorties: d.sorties || [],
      matricesAutorisees: d.matricesAutorisees || [],
      modeExecution: EXECUTION_MODES.indexOf(d.modeExecution) >= 0 ? d.modeExecution : 'sequential',
      dependances: d.dependances || [],
      etat: 'queued',
      kef: d.kef || null,
      feedback: d.feedback || null
    };
  }

  // ---------- 4. TYPES D'ÉLÉMENTS INTERNES ----------
  var ELEMENT_TYPES = ['systematization', 'intelligent_library', 'orchestrator_agent', 'superbot_engine'];
  function creerElementInterne(type, blocId) {
    if (ELEMENT_TYPES.indexOf(type) < 0) return null;
    return {
      type: type,
      blocId: blocId,
      portsEntree: [],
      portsSortie: [],
      // Connexions internes (structurelles, comptées une fois)
      connexionsInternes: []
    };
  }
  // Les 4 connexions internes prévues par bloc
  var CONNEXIONS_INTERNES_BLOC = [
    { de: 'orchestrator_agent', vers: 'systematization', type: 'control', label: 'contrôle et demande de tâche' },
    { de: 'orchestrator_agent', vers: 'intelligent_library', type: 'task_request', label: 'demande de recherche' },
    { de: 'systematization', vers: 'superbot_engine', type: 'task_result', label: 'résultat organisé' },
    { de: 'intelligent_library', vers: 'superbot_engine', type: 'semantic_context', label: 'références pertinentes' }
  ];

  // ---------- 5. TYPES DE CONNEXIONS ----------
  // StructuralEdge : lien logique entre blocs
  function creerStructuralEdge(edgeId, sourceBlockId, destinationBlockId, type, condition, mode) {
    return {
      edgeId: edgeId,
      sourceBlockId: sourceBlockId,
      destinationBlockId: destinationBlockId,
      type: type || 'sequence',
      condition: condition || 'toujours',
      mode: (['sync', 'async', 'broadcast', 'merge'].indexOf(mode) >= 0) ? mode : 'sync',
      limiteParcours: 100, // borne anti-boucle
      oriente: true
    };
  }
  // ChannelLink : transport d'un canal sur une matrice
  function creerChannelLink(channelLinkId, edgeId, matrixId, channelType, portSource, portDestination, contentType) {
    if (MATRIX_IDS.indexOf(matrixId) < 0) return null;
    if (CHANNEL_TYPES.indexOf(channelType) < 0) return null;
    return {
      channelLinkId: channelLinkId,
      edgeId: edgeId,
      matrixId: matrixId,
      channelType: channelType,
      portSource: portSource,
      portDestination: portDestination,
      contentType: contentType || 'json',
      statutLivraison: 'en-attente',
      horodatage: Date.now()
    };
  }

  // ---------- 6. ENVELOPPE DE MESSAGE COMMUNE ----------
  function creerEnveloppe(params) {
    var p = params || {};
    return {
      eventId: p.eventId || ('evt-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)),
      turnId: p.turnId || null,
      taskId: p.taskId || null,
      sourceBlockId: p.sourceBlockId || null,
      destinationBlockId: p.destinationBlockId || null,
      edgeId: p.edgeId || null,
      matrixId: p.matrixId || null,
      channelType: p.channelType || null,
      payloadType: p.payloadType || 'json',
      payload: p.payload || null,
      status: p.status || 'created',
      createdAt: Date.now()
    };
  }

  // ---------- 7. ÉTATS D'EXÉCUTION ----------
  var BLOCK_STATUS = ['queued', 'dispatched', 'running', 'waiting_merge', 'complete', 'complete_reduced', 'partial', 'error', 'cancelled'];
  function estComplet(statut) { return statut === 'complete' || statut === 'complete_reduced'; }
  function estPartiel(statut) { return statut === 'partial'; }
  function estErreur(statut) { return statut === 'error'; }

  // ---------- 8. TYPAGE KEF ET COMPUTE ----------
  var KEF_DIMENSIONS = ['induction', 'vitesse', 'gainRapidite', 'reductionBruit', 'bruitRecycle', 'puissanceVectorielle', 'puissanceDifferencielle', 'puissanceComputationnelle', 'compute', 'feedbackUtilisateur'];
  function creerKEF(compute, feedback) {
    return {
      induction: null,
      vitesse: null,
      gainRapidite: null,
      reductionBruit: null,
      bruitRecycle: null,
      puissanceVectorielle: null,
      puissanceDifferencielle: null,
      puissanceComputationnelle: null,
      compute: compute || { valeur: null, type: 'indisponible', detail: '', source: null, confiance: 0 },
      feedback: feedback || { origine: null, valeur: null, associeA: null, type: null }
    };
  }
  // Compute : consommé, disponible, gain
  function creerCompute(consomme, disponible, gain) {
    return {
      consomme: consomme || null, // { cpu: ms, gpu: ms, ops: n, data: bytes }
      disponible: disponible || null, // capacité disponible
      gain: gain || null, // gain de puissance computationnelle
      type: 'indisponible', // 'mesure', 'estimation', 'indisponible'
      source: null,
      confiance: 0
    };
  }

  // ---------- 9. COMPTAGE ET CONSERVATION DU GRAPHE ----------
  var COMPTEURS = {
    liensStructurels: 0,
    canauxTypes: 0,
    liensInternesBlocs: 0,
    liensExistants: 677, // connexions existantes à migrer
    liensMigres: 0,
    liensNonTypes: 0,
    doublons: 0
  };
  function incrementerCompteur(type, n) {
    if (COMPTEURS[type] !== undefined) COMPTEURS[type] += (n || 1);
  }
  function getCompteurs() { return Object.assign({}, COMPTEURS); }
  // Migration des 677 connexions existantes
  function migrerConnexionExistante(conn) {
    if (!conn) return null;
    var type = conn.type || null;
    var matrice = conn.matrice || null;
    var source = conn.source || conn.de || null;
    var destination = conn.destination || conn.vers || null;
    if (!type || !matrice || !source || !destination) {
      COMPTEURS.liensNonTypes++;
      return { migre: false, raison: 'typage incomplet', conn: conn };
    }
    COMPTEURS.liensMigres++;
    return { migre: true, type: type, matrice: matrice, source: source, destination: destination };
  }
  // Comptage pour 100 blocs en 5 vagues
  var COMPTE_100_BLOCS = {
    internes: 400, // 4 par bloc × 100
    interVagues: 1600, // 4 × 20 × 20 (4 passages complets entre vagues)
    total: 2000,
    canauxMultiples: 0, // comptés séparément
    socleS1: 'séparé (hors compte)'
  };

  // ---------- API publique ----------
  global.ViaCOSTypage = {
    MATRIX_IDS: MATRIX_IDS,
    MATRIX_LABELS: MATRIX_LABELS,
    CHANNEL_TYPES: CHANNEL_TYPES,
    CANAL_MATRICE: CANAL_MATRICE,
    WAVE_IDS: WAVE_IDS,
    EXECUTION_MODES: EXECUTION_MODES,
    BLOCK_ROLES: BLOCK_ROLES,
    VAGUE_ROLE: VAGUE_ROLE,
    ELEMENT_TYPES: ELEMENT_TYPES,
    CONNEXIONS_INTERNES_BLOC: CONNEXIONS_INTERNES_BLOC,
    BLOCK_STATUS: BLOCK_STATUS,
    KEF_DIMENSIONS: KEF_DIMENSIONS,
    COMPTE_100_BLOCS: COMPTE_100_BLOCS,
    creerMatrice: creerMatrice,
    canalVersMatrice: canalVersMatrice,
    creerCanal: creerCanal,
    creerDefinitionBloc: creerDefinitionBloc,
    creerElementInterne: creerElementInterne,
    creerStructuralEdge: creerStructuralEdge,
    creerChannelLink: creerChannelLink,
    creerEnveloppe: creerEnveloppe,
    estComplet: estComplet,
    estPartiel: estPartiel,
    estErreur: estErreur,
    creerKEF: creerKEF,
    creerCompute: creerCompute,
    incrementerCompteur: incrementerCompteur,
    getCompteurs: getCompteurs,
    migrerConnexionExistante: migrerConnexionExistante
  };
})(window);