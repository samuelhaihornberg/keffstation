// src/kef.js — KEF (coefficient d'efficacité conversationnelle) pour ViArtificial Labs.
// Mesure la performance conversationnelle d'un bot ou d'une famille de blocs.
// Dimensions : induction, vitesse, réduction du bruit, recyclage, puissance vectorielle,
// puissance différentielle, puissance computationnelle, valeur compute, feedback utilisateur.
// Ne désigne pas un nouveau LLM ni un bloc géant. Évaluation par réponse/session/famille/période.
'use strict';
(function (global) {
  // ---------- Dimensions du KEF ----------
  // Chaque dimension est normalisée dans [0, 100].
  var DIMENSIONS = {
    induction: { label: 'Induction', description: 'Capacité à tirer une compréhension utile des éléments disponibles' },
    vitesse: { label: 'Vitesse', description: 'Temps nécessaire pour préparer et produire une réponse adaptée' },
    gainRapidite: { label: 'Gain de rapidité', description: 'Comparaison à des tâches antérieures de nature comparable' },
    reductionBruit: { label: 'Réduction du bruit', description: 'Capacité à éviter les éléments inutiles, répétitifs ou hors sujet' },
    bruitRecycle: { label: 'Bruit recyclé', description: 'Récupération et réorganisation d\'éléments initialement peu utiles' },
    puissanceVectorielle: { label: 'Puissance vectorielle', description: 'Capacité à organiser plusieurs directions de raisonnement' },
    puissanceDifferencielle: { label: 'Puissance différentielle', description: 'Capacité à discerner les différences entre des idées proches' },
    puissanceComputationnelle: { label: 'Puissance computationnelle', description: 'Capacité de traitement disponible pour une tâche' },
    compute: { label: 'Valeur compute', description: 'Quantité de calcul réellement mobilisée ou estimée' },
    feedbackUtilisateur: { label: 'Feedback utilisateur', description: 'Signaux observables : remerciement, correction, note, réaction' }
  };

  // ---------- Genre de réponse et pondérations ----------
  // Les pondérations varient selon le genre (salutation, conversation, ingénierie, etc.)
  var PONDERATIONS_PAR_GENRE = {
    salutation: { induction: 0.15, vitesse: 0.10, gainRapidite: 0.05, reductionBruit: 0.10, bruitRecycle: 0.05, puissanceVectorielle: 0.05, puissanceDifferencielle: 0.05, puissanceComputationnelle: 0.05, compute: 0.05, feedbackUtilisateur: 0.35 },
    conversation: { induction: 0.15, vitesse: 0.10, gainRapidite: 0.05, reductionBruit: 0.10, bruitRecycle: 0.10, puissanceVectorielle: 0.10, puissanceDifferencielle: 0.10, puissanceComputationnelle: 0.05, compute: 0.05, feedbackUtilisateur: 0.20 },
    ingenierie: { induction: 0.10, vitesse: 0.05, gainRapidite: 0.05, reductionBruit: 0.10, bruitRecycle: 0.05, puissanceVectorielle: 0.15, puissanceDifferencielle: 0.15, puissanceComputationnelle: 0.10, compute: 0.10, feedbackUtilisateur: 0.15 },
    education: { induction: 0.20, vitesse: 0.05, gainRapidite: 0.05, reductionBruit: 0.10, bruitRecycle: 0.10, puissanceVectorielle: 0.10, puissanceDifferencielle: 0.10, puissanceComputationnelle: 0.05, compute: 0.05, feedbackUtilisateur: 0.20 },
    code: { induction: 0.10, vitesse: 0.05, gainRapidite: 0.05, reductionBruit: 0.15, bruitRecycle: 0.05, puissanceVectorielle: 0.10, puissanceDifferencielle: 0.15, puissanceComputationnelle: 0.10, compute: 0.10, feedbackUtilisateur: 0.15 },
    defaut: { induction: 0.12, vitesse: 0.08, gainRapidite: 0.05, reductionBruit: 0.10, bruitRecycle: 0.08, puissanceVectorielle: 0.10, puissanceDifferencielle: 0.10, puissanceComputationnelle: 0.07, compute: 0.05, feedbackUtilisateur: 0.25 }
  };

  // ---------- Relevé KEF ----------
  function creerReleve(perimetre, genre) {
    var p = perimetre || 'reponse';
    var g = genre || 'defaut';
    return {
      perimetre: p, // 'reponse', 'session', 'famille', 'periode'
      genre: g,
      dimensions: {},
      // Chaque dimension porte : valeur, statut (mesure/estimation/indisponible), unite, source, horodatage
      dimensionStatuts: {},
      feedback: { origine: null, valeur: null, associeA: null, type: null, horodatage: null },
      compute: { valeur: null, type: 'indisponible', detail: '', source: null, confiance: 0 },
      vitesse: { debut: null, fin: null, dureeMs: null, tempsMoteur: null, tempsAttente: null, tailleEntree: null, tailleSortie: null, debit: null },
      ts: Date.now(),
      botId: null,
      familleId: null
    };
  }

  // ---------- Enregistrer une dimension ----------
  // statut: 'mesure', 'estimation', 'indisponible'
  function enregistrerDimension(releve, dimension, valeur, statut, unite, source) {
    if (!releve || !DIMENSIONS[dimension]) return;
    var v = (valeur === null || valeur === undefined) ? null : Math.max(0, Math.min(100, valeur));
    releve.dimensions[dimension] = v;
    releve.dimensionStatuts[dimension] = {
      statut: statut || 'indisponible',
      unite: unite || 'score/100',
      source: source || 'inconnu',
      horodatage: Date.now()
    };
  }

  // ---------- Enregistrer le compute ----------
  function enregistrerCompute(releve, valeur, type, detail) {
    if (!releve) return;
    releve.compute = {
      valeur: (typeof valeur === 'number') ? valeur : null,
      type: type || 'indisponible', // 'mesure', 'estimation', 'indisponible'
      detail: detail || ''
    };
  }

  // ---------- Enregistrer le feedback ----------
  function enregistrerFeedback(releve, origine, valeur, associeA) {
    if (!releve) return;
    releve.feedback = {
      origine: origine, // 'explicite', 'implicite', 'deduit'
      valeur: valeur, // 'remerciement', 'correction', 'note', 'reaction', 'passage-suivant'
      associeA: associeA || null // id de la réponse et du genre de tâche
    };
  }

  // ---------- Calcul du KEF global ----------
  function calculerKEF(releve) {
    if (!releve) return null;
    var genre = releve.genre || 'defaut';
    var pond = PONDERATIONS_PAR_GENRE[genre] || PONDERATIONS_PAR_GENRE.defaut;
    var total = 0;
    var poidsTotal = 0;
    var details = {};
    var dimensionsDisponibles = 0;
    var dimensionsIndisponibles = 0;
    for (var dim in DIMENSIONS) {
      var val = releve.dimensions[dim];
      var statut = releve.dimensionStatuts && releve.dimensionStatuts[dim] ? releve.dimensionStatuts[dim].statut : 'indisponible';
      if (typeof val === 'number' && statut !== 'indisponible') {
        var p = pond[dim] || 0;
        total += val * p;
        poidsTotal += p;
        details[dim] = { valeur: val, statut: statut, poids: p, contribution: val * p };
        dimensionsDisponibles++;
      } else {
        details[dim] = { valeur: null, statut: 'indisponible', poids: 0, contribution: 0 };
        dimensionsIndisponibles++;
      }
    }
    // Feedback : bonus/malus selon l'origine (seulement si feedback réel)
    if (releve.feedback && releve.feedback.valeur && releve.feedback.origine) {
      var fb = releve.feedback.valeur;
      var bonus = 0;
      if (fb === 'remerciement') bonus = 5;
      else if (fb === 'correction') bonus = -3;
      else if (fb === 'passage-suivant') bonus = 2;
      else if (fb === 'note') bonus = 0;
      total += bonus;
      details.feedback = { valeur: fb, origine: releve.feedback.origine, bonus: bonus, horodatage: releve.feedback.horodatage };
    }
    // Normaliser par le poids total utilisé
    var kef = poidsTotal > 0 ? (total / poidsTotal) : 0;
    kef = Math.max(0, Math.min(100, kef));
    // Marquer comme partiel si des dimensions sont indisponibles
    var partiel = dimensionsIndisponibles > 0;
    return {
      kef: Math.round(kef * 100) / 100,
      details: details,
      perimetre: releve.perimetre,
      genre: genre,
      partiel: partiel,
      dimensionsDisponibles: dimensionsDisponibles,
      dimensionsIndisponibles: dimensionsIndisponibles,
      ts: releve.ts
    };
  }

  // ---------- Comparaison de KEF ----------
  function comparerKEF(releve1, releve2) {
    var k1 = calculerKEF(releve1);
    var k2 = calculerKEF(releve2);
    if (!k1 || !k2) return null;
    return {
      avant: k1.kef,
      apres: k2.kef,
      delta: Math.round((k2.kef - k1.kef) * 100) / 100,
      amelioration: k2.kef > k1.kef
    };
  }

  // ---------- Historique KEF par bot/famille ----------
  var historiqueKEF = {};
  function enregistrerKEF(botId, familleId, releve, resultat) {
    var cle = (botId || 'global') + '::' + (familleId || 'global');
    if (!historiqueKEF[cle]) historiqueKEF[cle] = [];
    historiqueKEF[cle].push({ releve: releve, resultat: resultat, ts: Date.now() });
    // Garder les 100 derniers
    if (historiqueKEF[cle].length > 100) historiqueKEF[cle] = historiqueKEF[cle].slice(-100);
  }
  function historique(botId, familleId) {
    var cle = (botId || 'global') + '::' + (familleId || 'global');
    return historiqueKEF[cle] || [];
  }

  // ---------- API publique ----------
  global.ViaKEF = {
    DIMENSIONS: DIMENSIONS,
    PONDERATIONS_PAR_GENRE: PONDERATIONS_PAR_GENRE,
    creerReleve: creerReleve,
    enregistrerDimension: enregistrerDimension,
    enregistrerCompute: enregistrerCompute,
    enregistrerFeedback: enregistrerFeedback,
    calculerKEF: calculerKEF,
    comparerKEF: comparerKEF,
    enregistrerKEF: enregistrerKEF,
    historique: historique
  };
})(typeof window !== "undefined" ? window : global);