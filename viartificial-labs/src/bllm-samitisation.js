// src/bllm-samitisation.js — Moteur de Samitisation pour ViArtificial Labs (BLLM).
// La samitisation est une méthode de recherche et de mise en relation des idées.
// Elle fait travailler ensemble : synonymes, antonymes, homonymes, racines,
// formulations voisines, philosophies, thèses, antithèses, objections, synthèses.
// Elle ne remplace pas un mot par une liste de mots proches : elle explore les
// relations qui aident les BLLM et les LLM locaux à mieux comprendre une demande,
// examiner plusieurs pistes et construire une réponse adaptée.
// Chaque relation conserve son type, son contexte et, si disponible, sa provenance.
'use strict';
(function (global) {
  // ---------- Types de relations sémantiques ----------
  var RELATION_TYPES = {
    'synonyme-identique': { label: 'Synonyme (sens identique)', poids: 1.0 },
    'synonyme-proche': { label: 'Synonyme (sens proche dans un contexte)', poids: 0.85 },
    'antonyme': { label: 'Antonyme (opposition)', poids: 0.7 },
    'anti-antonyme': { label: 'Anti-antonyme (dépassement/correction d\'une opposition)', poids: 0.75 },
    'homonyme': { label: 'Homonyme / polysémie (désambiguïsation contextuelle)', poids: 0.6 },
    'racine-famille': { label: 'Racine / famille de mots (sans équivalence automatique)', poids: 0.5 },
    'philo-conceptuelle': { label: 'Relation philosophique / conceptuelle', poids: 0.8 },
    'cause': { label: 'Cause', poids: 0.9 },
    'consequence': { label: 'Conséquence', poids: 0.9 },
    'condition': { label: 'Condition', poids: 0.85 },
    'moyen': { label: 'Moyen', poids: 0.8 },
    'but': { label: 'But', poids: 0.8 },
    'exemple': { label: 'Exemple', poids: 0.7 },
    'contradiction': { label: 'Contradiction', poids: 0.75 }
  };

  // ---------- Valeurs et priorités des liens ----------
  // Dimensions séparées : pertinence, proximité de sens, fiabilité, niveau de
  // contradiction, utilité dans la synthèse, priorité de traitement.
  // Ces dimensions sont distinctes de : niveau de détail, longueur de réponse,
  // priorité d'apparition, rapidité de traitement, coût de chargement.
  function creerValeurs(overrides) {
    var o = overrides || {};
    return {
      pertinence: (typeof o.pertinence === 'number') ? o.pertinence : 0.5,
      proximiteSens: (typeof o.proximiteSens === 'number') ? o.proximiteSens : 0.5,
      fiabilite: (typeof o.fiabilite === 'number') ? o.fiabilite : 0.5,
      contradiction: (typeof o.contradiction === 'number') ? o.contradiction : 0.0,
      utiliteSynthese: (typeof o.utiliteSynthese === 'number') ? o.utiliteSynthese : 0.5,
      prioriteTraitement: (typeof o.prioriteTraitement === 'number') ? o.prioriteTraitement : 0.5
    };
  }

  // ---------- Relation typée avec contexte et provenance ----------
  function creerRelation(termA, termB, type, contexte, provenance) {
    var rt = RELATION_TYPES[type] || { label: type, poids: 0.5 };
    return {
      id: 'rel-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      termA: termA,
      termB: termB,
      type: type,
      typeLabel: rt.label,
      poids: rt.poids,
      contexte: contexte || '',
      provenance: provenance || 'bibliotheque',
      valeurs: creerValeurs({}),
      ts: Date.now()
    };
  }

  // ---------- Mémoire des chemins explorés (bornes d'arrêt anti-cycle) ----------
  var cheminsExplores = new Set();
  var tracesLiens = [];
  var conceptsExamines = new Set();

  function memoiserChemin(concept, lienId) {
    var cle = concept + '::' + lienId;
    if (cheminsExplores.has(cle)) return false; // déjà exploré → arrêt
    cheminsExplores.add(cle);
    conceptsExamines.add(concept);
    return true;
  }

  function resetMemoire() {
    cheminsExplores.clear();
    tracesLiens = [];
    conceptsExamines.clear();
  }

  function traceLien(relation, valeur) {
    tracesLiens.push({
      relation: relation,
      valeur: valeur || null,
      ts: Date.now()
    });
  }

  // ---------- Anti-antonymes : distincts des synonymes ----------
  // Un anti-antonyme répond à une opposition, la corrige, la dépasse ou rend
  // possible une synthèse. Il n'est PAS automatiquement un synonyme de l'idée initiale.
  function trouverAntiAntonymes(relationAntonyme, registre) {
    var resultats = [];
    if (!relationAntonyme || relationAntonyme.type !== 'antonyme') return resultats;
    var termOppose = relationAntonyme.termB;
    // Recherche dans le registre des relations qui dépassent l'opposition
    if (registre && Array.isArray(registre)) {
      for (var i = 0; i < registre.length; i++) {
        var r = registre[i];
        if (r.termA === termOppose || r.termB === termOppose) {
          if (r.type === 'anti-antonyme' || r.type === 'philo-conceptuelle' || r.type === 'cause' || r.type === 'consequence') {
            if (memoiserChemin(termOppose, r.id)) {
              resultats.push(r);
              traceLien(r, 'anti-antonyme-trouve');
            }
          }
        }
      }
    }
    return resultats;
  }

  // ---------- Désambiguïsation contextuelle (homonymes/polysémie) ----------
  function desambiguïser(term, contexte) {
    // Retourne le sens retenu et les sens possibles.
    var sensPossibles = [];
    // Indice contextuel : si le contexte contient des mots liés au domaine, on le retient.
    var sensRetenu = null;
    if (contexte && contexte.length > 0) {
      sensRetenu = term + ' (sens déterminé par contexte : ' + contexte.slice(0, 60) + ')';
    } else {
      sensRetenu = term + ' (sens non déterminé — précision requise)';
    }
    return {
      term: term,
      sensRetenu: sensRetenu,
      sensPossibles: sensPossibles,
      precisionRequise: !contexte || contexte.length === 0
    };
  }

  // ---------- Tableaux de raisonnement ----------
  // Colonnes adaptatives : on n'utilise que les catégories utiles.
  var COLONNES_RAISONNEMENT = [
    'Élément examiné', 'Idée ou solution', 'Arguments favorables',
    'Défauts ou limites', 'Objections', 'Réponse à l\'objection',
    'Valeur pour la synthèse'
  ];
  var COLONNES_COMPARAISON = [
    'Solution', 'Avantages', 'Défauts', 'Critères communs',
    'Moyens de correction', 'Solution retenue'
  ];

  function creerTableau(type, lignes) {
    var cols = (type === 'comparaison') ? COLONNES_COMPARAISON : COLONNES_RAISONNEMENT;
    return {
      type: type || 'raisonnement',
      colonnes: cols,
      lignes: (lignes || []).map(function (l) {
        var row = {};
        cols.forEach(function (c) { row[c] = (l && l[c]) || ''; });
        return row;
      }),
      actif: true
    };
  }

  function tableauVide() { return null; } // pas de tableau pour salutation/demande simple

  // ---------- Dialectique : Thèse → Antithèse → Anti-antithèse → Synthèse ----------
  function dialectique(thes, registre) {
    var result = { these: null, antithese: null, antiAntithese: null, synthese: null, etabli: [], hypothese: [] };
    // 1. Thèse
    result.these = {
      titre: 'Thèse',
      contenu: thes || '',
      arguments: [],
      statut: 'formulee'
    };
    // 2. Antithèse : contradictions, défauts, risques, contre-exemples
    result.antithese = {
      titre: 'Antithèse',
      contenu: 'Contradictions, défauts, risques et conditions oubliées dans la thèse.',
      objections: [],
      statut: 'formulee'
    };
    // 3. Anti-antithèse : vérifier l'antithèse elle-même
    result.antiAntithese = {
      titre: 'Anti-antithèse',
      contenu: 'Vérification de l\'antithèse : ses objections sont-elles fondées, pertinentes, proportionnées ?',
      defautsAntithese: [],
      statut: 'formulee'
    };
    // 4. Synthèse
    result.synthese = {
      titre: 'Synthèse',
      contenu: 'Conservation des éléments solides, correction des défauts, construction d\'une réponse cohérente.',
      etabli: result.etabli,
      hypothese: result.hypothese,
      statut: 'provisoire'
    };
    return result;
  }

  // ---------- Les 10 boucles de samitisation ----------
  var BOUCLES = {
    formulation: {
      id: 1, nom: 'Boucle de formulation',
      description: 'Demande → synonymes et formulations proches → sens possibles → choix du sens correspondant au contexte.',
      appliquer: function (demande, registre) {
        return { boucle: 1, etape: 'formulation', demande: demande, registre: registre || [] };
      }
    },
    desambiguation: {
      id: 2, nom: 'Boucle de désambiguïsation',
      description: 'Terme ambigu → homonymes et sens possibles → indices du contexte → sens retenu, ou demande de précision.',
      appliquer: function (term, contexte) {
        return desambiguïser(term, contexte);
      }
    },
    racinesConcepts: {
      id: 3, nom: 'Boucle des racines et des concepts',
      description: 'Concept → racines et famille de mots → notions apparentées → vérification du lien de sens → ajout des relations utiles.',
      appliquer: function (concept, registre) {
        var res = [];
        if (registre && Array.isArray(registre)) {
          for (var i = 0; i < registre.length; i++) {
            var r = registre[i];
            if (r.type === 'racine-famille' && (r.termA === concept || r.termB === concept)) {
              if (memoiserChemin(concept, r.id)) { res.push(r); traceLien(r, 'racine-concept'); }
            }
          }
        }
        return { boucle: 3, concept: concept, relations: res };
      }
    },
    opposition: {
      id: 4, nom: 'Boucle d\'opposition',
      description: 'Idée → antonyme ou opposition → nature de l\'opposition → conséquences → recherche d\'anti-antonymes, de corrections ou de conditions permettant une synthèse.',
      appliquer: function (idee, registre) {
        var antonymes = [];
        var antiAntonymes = [];
        if (registre && Array.isArray(registre)) {
          for (var i = 0; i < registre.length; i++) {
            var r = registre[i];
            if (r.termA === idee && r.type === 'antonyme') {
              if (memoiserChemin(idee, r.id)) { antonymes.push(r); traceLien(r, 'opposition-antonyme'); }
              var aa = trouverAntiAntonymes(r, registre);
              antiAntonymes = antiAntonymes.concat(aa);
            }
          }
        }
        return { boucle: 4, idee: idee, antonymes: antonymes, antiAntonymes: antiAntonymes };
      }
    },
    dialectique: {
      id: 5, nom: 'Boucle dialectique',
      description: 'Thèse → antithèse → vérification de l\'antithèse → anti-antithèse → synthèse → contrôle de cohérence.',
      appliquer: function (thes, registre) {
        return dialectique(thes, registre);
      }
    },
    comparaison: {
      id: 6, nom: 'Boucle de comparaison',
      description: 'Plusieurs solutions ou interprétations → tableau comparatif → critères communs → avantages et défauts → solution retenue ou combinaison.',
      appliquer: function (solutions, criteres) {
        var tableau = creerTableau('comparaison', (solutions || []).map(function (s) {
          var row = { 'Solution': s };
          (criteres || []).forEach(function (c) { row[c] = ''; });
          return row;
        }));
        return { boucle: 6, solutions: solutions || [], criteres: criteres || [], tableau: tableau };
      }
    },
    problemeRecurrent: {
      id: 7, nom: 'Boucle de résolution d\'un problème récurrent',
      description: 'Demande → recherche de cas proches dans les bibliothèques → comparaison du contexte → adaptation d\'une méthode déjà connue → vérification que les différences ne rendent pas cette méthode inappropriée.',
      appliquer: function (demande, bibliotheques) {
        return { boucle: 7, demande: demande, bibliotheques: bibliotheques || [], casProches: [] };
      }
    },
    problemeNouveau: {
      id: 8, nom: 'Boucle de problème nouveau',
      description: 'Demande qui ne correspond pas aux cas connus → génération de plusieurs hypothèses → recherche des relations et méthodes utiles → examen contradictoire → synthèse provisoire → indication des incertitudes et des vérifications nécessaires.',
      appliquer: function (demande) {
        return { boucle: 8, demande: demande, hypotheses: [], syntheseProvisoire: null, incertitudes: [] };
      }
    },
    revisionReponse: {
      id: 9, nom: 'Boucle de révision de réponse',
      description: 'Réponse préparée → contrôle de pertinence, cohérence, clarté et adéquation au besoin → correction des défauts → réponse finale.',
      appliquer: function (reponse) {
        return { boucle: 9, reponse: reponse, controles: ['pertinence', 'coherence', 'clarte', 'adequation'], corrections: [] };
      }
    },
    apprentissageRetour: {
      id: 10, nom: 'Boucle d\'apprentissage à partir d\'un retour',
      description: 'Réponse → retour de l\'utilisateur → identification de ce qui était utile ou erroné → proposition d\'amélioration → validation avant de transformer une observation isolée en règle générale.',
      appliquer: function (reponse, retour) {
        return { boucle: 10, reponse: reponse, retour: retour, ameliorations: [], validationRequise: true };
      }
    }
  };

  // ---------- Choix des boucles adaptées par Guideoplan ----------
  function choisirBoucles(demande, intention, perimetre) {
    var selection = [];
    var d = (demande || '').toLowerCase();
    // Salutation ou demande simple → pas de boucle complexe
    if (/^(salut|bonjour|bonsoir|coucou|hello|yo|hey|merci|ok|oui|non|bye)\b/.test(d.trim())) {
      return { boucles: [], raison: 'demande-simple-pas-d-analyse' };
    }
    // Question → formulation + désambiguïsation
    selection.push('formulation');
    if (d.length > 80 || /ambigu|sens|signifie|veut dire/i.test(d)) selection.push('desambiguation');
    // Comparaison de solutions
    if (/comparer|vs|versus|ou bien|choisir entre|alternative/i.test(d)) selection.push('comparaison');
    // Opposition
    if (/pourquoi pas|contre|inverse|opposé|risque|défaut/i.test(d)) selection.push('opposition');
    // Dialectique pour les questions complexes
    if (d.length > 150 || /analyser|expliquer|pourquoi|comment fonctionne/i.test(d)) selection.push('dialectique');
    // Problème nouveau si pas de cas connu
    if (/nouveau|jamais vu|inconnu/i.test(d)) selection.push('problemeNouveau');
    return { boucles: selection, raison: 'selection-adaptative' };
  }

  // ---------- API publique ----------
  global.ViaSamitisation = {
    RELATION_TYPES: RELATION_TYPES,
    creerRelation: creerRelation,
    creerValeurs: creerValeurs,
    trouverAntiAntonymes: trouverAntiAntonymes,
    desambiguïser: desambiguïser,
    creerTableau: creerTableau,
    COLONNES_RAISONNEMENT: COLONNES_RAISONNEMENT,
    COLONNES_COMPARAISON: COLONNES_COMPARAISON,
    dialectique: dialectique,
    BOUCLES: BOUCLES,
    choisirBoucles: choisirBoucles,
    memoiserChemin: memoiserChemin,
    resetMemoire: resetMemoire,
    traceLien: traceLien,
    getTraces: function () { return tracesLiens.slice(); },
    getCheminsExplores: function () { return Array.from(cheminsExplores); },
    getConceptsExamines: function () { return Array.from(conceptsExamines); }
  };
})(window);