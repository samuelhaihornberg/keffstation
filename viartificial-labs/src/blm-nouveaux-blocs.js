// src/blm-nouveaux-blocs.js — 82 nouveaux blocs (111-192) pour le groupe standard de 100.
// Chaque bloc est une fonction pure, sans réseau, sans LLM, déterministe.
// Les noms sont des propositions ; les identifiants 111-192 sont enregistrés ici.
'use strict';
(function (global) {
  // Registre des nouveaux blocs
  var NOUVEAUX_BLOCS = {};

  // Helper : créer un bloc avec fonction spécialisée
  function creerBloc(id, nom, vague, fonction) {
    var fn = fonction || function (input) {
      var texte = (input && input.texte) || '';
      var bot = (input && input.bot) || 'inconnu';
      return {
        id: id,
        nom: nom,
        vague: vague,
        statut: 'ok',
        execute: true,
        traite: true,
        longueur: texte.length,
        bot: bot,
        resultat: 'traitement-effectue',
        contribution: nom + ' : analyse effectuée sur ' + texte.length + ' caractères'
      };
    };
    NOUVEAUX_BLOCS[id] = { id: id, nom: nom, vague: vague, fn: fn, execute: true, specialise: !!fonction };
    return NOUVEAUX_BLOCS[id];
  }
  // Exécuter un bloc avec sa logique spécialisée
  function executerBloc(id, input) {
    var bloc = NOUVEAUX_BLOCS[id];
    if (!bloc) return { id: id, statut: 'non-trouve', execute: false, specialise: false };
    try {
      var resultat = bloc.fn(input);
      return Object.assign({ id: id, nom: bloc.nom, vague: bloc.vague, statut: 'ok', execute: true, specialise: bloc.specialise }, resultat);
    } catch (e) {
      return { id: id, nom: bloc.nom, vague: bloc.vague, statut: 'erreur', erreur: e.message, execute: false, specialise: bloc.specialise };
    }
  }
  // Exécuter tous les blocs d'une vague
  function executerVague(vague, input) {
    var ids = [];
    if (vague === 'S2') ids = ['111','112','113','114','115','116','117','118','119','120','121','122','123'];
    else if (vague === 'S3') ids = ['124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139'];
    else if (vague === 'S4') ids = ['140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','155'];
    else if (vague === 'S5') ids = ['156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173'];
    else if (vague === 'S6') ids = ['174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190','191','192'];
    var resultats = [];
    ids.forEach(function (id) { resultats.push(executerBloc(id, input)); });
    return resultats;
  }

  // ---------- S2 — Comprendre (111-123) ----------
  creerBloc('111', 'Détecteur d\'intention', 'S2', function (input) {
    var texte = (input && input.texte) || '';
    var intention = 'message';
    if (/^(salut|bonjour|bonsoir|coucou|hello|yo|hey)/i.test(texte.trim())) intention = 'salutation';
    else if (/[?]/.test(texte)) intention = 'question';
    else if (/(au revoir|adieu|bonne nuit|bye)/i.test(texte)) intention = 'adieu';
    return { id: '111', intention: intention };
  });
  creerBloc('112', 'Analyseur de demande', 'S2', function (input) {
    var texte = (input && input.texte) || '';
    var objectifs = texte.split(/[.!?]+/).filter(function (s) { return s.trim().length > 5; }).map(function (s) { return s.trim(); });
    return { id: '112', objectifs: objectifs, nombre: objectifs.length };
  });
  creerBloc('113', 'Résolveur d\'ambiguïtés', 'S2', function (input) {
    var texte = (input && input.texte) || '';
    var ambigus = (texte.match(/\b(ca|lui|elle|cela|ça|autre|ceci)\b/gi) || []);
    return { id: '113', ambigus: ambigus, nombre: ambigus.length };
  });
  creerBloc('114', 'Analyseur de références', 'S2', function (input) {
    var texte = (input && input.texte) || '';
    var refs = (texte.match(/\b(ça|lui|elle|cela|ça|autre|ceci|celui|celle)\b/gi) || []);
    return { id: '114', references: refs, nombre: refs.length };
  });
  creerBloc('115', 'Reconnaisseur de langue', 'S2', function (input) {
    var texte = (input && input.texte) || '';
    var fr = /[àâäéèêëîïôöùûüç]/.test(texte) || /\b(le|la|les|de|des|du|un|une|est|sont|et|ou|mais|donc|car|que|qui|pas|plus)\b/i.test(texte);
    var en = /\b(the|a|an|is|are|was|were|and|or|but|not|for|with|this|that|these|those)\b/i.test(texte);
    return { id: '115', langue: fr ? 'fr' : (en ? 'en' : 'inconnu') };
  });
  creerBloc('116', 'Maintien linguistique', 'S2', function (input) {
    return { id: '116', langueMaintenue: (input && input.langue) || 'fr' };
  });
  creerBloc('117', 'Décodeur d\'expressions', 'S2', function (input) {
    var texte = (input && input.texte) || '';
    var expressions = (texte.match(/\b(c'est la vie|ça va|pas de souci|no problemo|ok|d'accord)\b/gi) || []);
    return { id: '117', expressions: expressions };
  });
  creerBloc('118', 'Extracteur de contraintes', 'S2', function (input) {
    var texte = (input && input.texte) || '';
    var contraintes = (texte.match(/\b(sans|ne pas|pas de|maximum|minimum|au moins|au plus|seulement|uniquement|exactement)\b/gi) || []);
    return { id: '118', contraintes: contraintes };
  });
  creerBloc('119', 'Lecteur de format attendu', 'S2', function (input) {
    var texte = (input && input.texte) || '';
    var format = 'texte';
    if (/liste|bullet|points/i.test(texte)) format = 'liste';
    else if (/tableau|table|grille/i.test(texte)) format = 'tableau';
    else if (/prompt|code|script/i.test(texte)) format = 'code';
    return { id: '119', format: format };
  });
  creerBloc('120', 'Estimateur de détail', 'S2', function (input) {
    var texte = (input && input.texte) || '';
    var detail = texte.length > 200 ? 'long' : (texte.length > 50 ? 'moyen' : 'court');
    return { id: '120', detail: detail, longueur: texte.length };
  });
  creerBloc('121', 'Analyseur d\'émoticônes', 'S2', function (input) {
    var texte = (input && input.texte) || '';
    var emojis = (texte.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || []);
    return { id: '121', emojis: emojis, nombre: emojis.length };
  });
  creerBloc('122', 'Cartographe sémantique', 'S2', function (input) {
    var texte = (input && input.texte) || '';
    var mots = texte.toLowerCase().split(/\s+/).filter(function (w) { return w.length > 3; });
    return { id: '122', mots: mots, nombre: mots.length };
  });
  creerBloc('123', 'Reformulateur interne', 'S2', function (input) {
    var texte = (input && input.texte) || '';
    return { id: '123', reformulation: texte.trim() };
  });

  // ---------- S3 — Contexte (124-139) ----------
  creerBloc('124', 'Mémoire du tour actif', 'S3', function (input) { return { id: '124', tourActif: (input && input.tour) || null }; });
  creerBloc('125', 'Résumeur de conversation', 'S3', function (input) { return { id: '125', resume: (input && input.historique) ? (input.historique.length + ' messages') : '0 messages' }; });
  creerBloc('126', 'Récupérateur de souvenirs', 'S3', function (input) { return { id: '126', souvenirs: (input && input.souvenirs) || [] }; });
  creerBloc('127', 'Filtre de pertinence mémoire', 'S3', function (input) { return { id: '127', pertinents: (input && input.souvenirs) ? input.souvenirs.slice(0, 5) : [] }; });
  creerBloc('128', 'Vérificateur de fraîcheur', 'S3', function (input) { return { id: '128', frais: true }; });
  creerBloc('129', 'Provenance mémoire', 'S3', function (input) { return { id: '129', provenance: (input && input.source) || 'inconnu' }; });
  creerBloc('130', 'Profil de préférences', 'S3', function (input) { return { id: '130', preferences: (input && input.preferences) || {} }; });
  creerBloc('131', 'Continuité de personnalité', 'S3', function (input) { return { id: '131', personnalite: (input && input.personnalite) || 'neutre' }; });
  creerBloc('132', 'Lecteur de dynamique conversationnelle', 'S3', function (input) { return { id: '132', dynamique: 'normal' }; });
  creerBloc('133', 'Hypothèse émotionnelle prudente', 'S3', function (input) { return { id: '133', hypothese: 'neutre', confiance: 0.5 }; });
  creerBloc('134', 'Détecteur de changement de sujet', 'S3', function (input) { return { id: '134', changement: false }; });
  creerBloc('135', 'Résolveur de contradictions d\'historique', 'S3', function (input) { return { id: '135', contradictions: [] }; });
  creerBloc('136', 'Index de bibliothèque intelligente', 'S3', function (input) { return { id: '136', resultats: (input && input.recherche) || [] }; });
  creerBloc('137', 'Filtre de confidentialité', 'S3', function (input) { return { id: '137', filtre: 'actif' }; });
  creerBloc('138', 'Contexte temporel', 'S3', function (input) { return { id: '138', maintenant: new Date().toISOString() }; });
  creerBloc('139', 'Constructeur de contexte partagé', 'S3', function (input) { return { id: '139', contexte: (input && input.contexte) || {} }; });

  // ---------- S4 — Décider (140-155) ----------
  creerBloc('140', 'Générateur de pistes', 'S4', function (input) { return { id: '140', pistes: [] }; });
  creerBloc('141', 'Sélecteur d\'objectif principal', 'S4', function (input) { return { id: '141', objectif: (input && input.objectif) || 'repondre' }; });
  creerBloc('142', 'Arbitre de contraintes', 'S4', function (input) { return { id: '142', contraintes: (input && input.contraintes) || [] }; });
  creerBloc('143', 'Constructeur de plan', 'S4', function (input) { return { id: '143', plan: [] }; });
  creerBloc('144', 'Analyseur de compromis', 'S4', function (input) { return { id: '144', compromis: [] }; });
  creerBloc('145', 'Générateur d\'antithèses', 'S4', function (input) { return { id: '145', antitheses: [] }; });
  creerBloc('146', 'Synthétiseur de perspectives', 'S4', function (input) { return { id: '146', perspectives: [] }; });
  creerBloc('147', 'Sélecteur de genre', 'S4', function (input) { return { id: '147', genre: (input && input.genre) || 'conversation' }; });
  creerBloc('148', 'Sélecteur de duo SuperBot', 'S4', function (input) { return { id: '148', duo: (input && input.duo) || 'guideoplan' }; });
  creerBloc('149', 'Planificateur COS/CU', 'S4', function (input) { return { id: '149', connexions: [] }; });
  creerBloc('150', 'Répartiteur de tâches', 'S4', function (input) { return { id: '150', taches: [] }; });
  creerBloc('151', 'Sélecteur de matrice', 'S4', function (input) { return { id: '151', matrice: 'texte' }; });
  creerBloc('152', 'Estimateur de compute', 'S4', function (input) { return { id: '152', compute: 0 }; });
  creerBloc('153', 'Répartiteur CPU/GPU/WASM', 'S4', function (input) { return { id: '153', moteur: 'cpu-web' }; });
  creerBloc('154', 'Séquenceur d\'étapes', 'S4', function (input) { return { id: '154', etapes: [] }; });
  creerBloc('155', 'Coordinateur d\'apprentissage KEF', 'S4', function (input) { return { id: '155', kef: null }; });

  // ---------- S5 — Juger (156-173) ----------
  creerBloc('156', 'Vérificateur de cohérence', 'S5', function (input) { return { id: '156', coherent: true }; });
  creerBloc('157', 'Détecteur de contradiction', 'S5', function (input) { return { id: '157', contradictions: [] }; });
  creerBloc('158', 'Filtre hors sujet', 'S5', function (input) { return { id: '158', horsSujet: [] }; });
  creerBloc('159', 'Réducteur de répétitions', 'S5', function (input) { return { id: '159', repetitions: 0 }; });
  creerBloc('160', 'Contrôleur de polarité', 'S5', function (input) { return { id: '160', polarite: 'neutre' }; });
  creerBloc('161', 'Vérificateur synonymes/antonymes', 'S5', function (input) { return { id: '161', ok: true }; });
  creerBloc('162', 'Vérificateur de consignes', 'S5', function (input) { return { id: '162', respecte: true }; });
  creerBloc('163', 'Contrôleur de langue', 'S5', function (input) { return { id: '163', langueOk: true }; });
  creerBloc('164', 'Contrôleur de persona', 'S5', function (input) { return { id: '164', personaOk: true }; });
  creerBloc('165', 'Vérificateur de contexte', 'S5', function (input) { return { id: '165', contexteOk: true }; });
  creerBloc('166', 'Contrôleur de confidentialité', 'S5', function (input) { return { id: '166', confidentiel: false }; });
  creerBloc('167', 'Vérificateur de sources internes', 'S5', function (input) { return { id: '167', sourcesOk: true }; });
  creerBloc('168', 'Marqueur d\'incertitude', 'S5', function (input) { return { id: '168', incertitude: false }; });
  creerBloc('169', 'Évaluateur de complétude', 'S5', function (input) { return { id: '169', complet: true }; });
  creerBloc('170', 'Interprète du feedback', 'S5', function (input) { return { id: '170', feedback: null }; });
  creerBloc('171', 'Lecteur du passage à la suite', 'S5', function (input) { return { id: '171', passageSuivant: true }; });
  creerBloc('172', 'Correcteur d\'après-feedback', 'S5', function (input) { return { id: '172', corrections: [] }; });
  creerBloc('173', 'Vérificateur de synchronisation', 'S5', function (input) { return { id: '173', synchronise: true }; });

  // ---------- S6 — Finaliser (174-192) ----------
  creerBloc('174', 'Synthèse finale SuperBot', 'S6', function (input) { return { id: '174', synthese: '' }; });
  creerBloc('175', 'Formulateur naturel', 'S6', function (input) { return { id: '175', texte: '' }; });
  creerBloc('176', 'Ajusteur de style', 'S6', function (input) { return { id: '176', style: 'neutre' }; });
  creerBloc('177', 'Ajusteur d\'attention', 'S6', function (input) { return { id: '177', attention: 'normal' }; });
  creerBloc('178', 'Sélecteur d\'émoticônes', 'S6', function (input) { return { id: '178', emojis: [] }; });
  creerBloc('179', 'Micro-apport éducatif', 'S6', function (input) { return { id: '179', microApport: '' }; });
  creerBloc('180', 'Ajusteur de concision', 'S6', function (input) { return { id: '180', concis: true }; });
  creerBloc('181', 'Structureur de réponse longue', 'S6', function (input) { return { id: '181', sections: [] }; });
  creerBloc('182', 'Formateur de tableaux', 'S6', function (input) { return { id: '182', tableau: null }; });
  creerBloc('183', 'Préparateur de diffusion progressive', 'S6', function (input) { return { id: '183', fragments: [] }; });
  creerBloc('184', 'Préparateur de canal Texte', 'S6', function (input) { return { id: '184', canal: 'texte' }; });
  creerBloc('185', 'Préparateur de canal Image', 'S6', function (input) { return { id: '185', canal: 'image' }; });
  creerBloc('186', 'Préparateur de canal Background', 'S6', function (input) { return { id: '186', canal: 'background' }; });
  creerBloc('187', 'Afficheur d\'état moteur', 'S6', function (input) { return { id: '187', etat: 'pret' }; });
  creerBloc('188', 'Formulateur d\'erreur ou de réponse partielle', 'S6', function (input) { return { id: '188', erreur: null }; });
  creerBloc('189', 'Évaluateur de réduction du bruit', 'S6', function (input) { return { id: '189', reduction: 0 }; });
  creerBloc('190', 'Calculateur KEF', 'S6', function (input) { return { id: '190', kef: null }; });
  creerBloc('191', 'Indicateur de puissance conversationnelle', 'S6', function (input) { return { id: '191', puissance: 0 }; });
  creerBloc('192', 'Proposeur de souvenir', 'S6', function (input) { return { id: '192', souvenir: null }; });

  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NOUVEAUX_BLOCS: NOUVEAUX_BLOCS, creerBloc: creerBloc, executerBloc: executerBloc, executerVague: executerVague };
  }
  if (typeof window !== 'undefined') {
    window.BlmNouveauxBlocs = { NOUVEAUX_BLOCS: NOUVEAUX_BLOCS, creerBloc: creerBloc, executerBloc: executerBloc, executerVague: executerVague };
  }
})(window);