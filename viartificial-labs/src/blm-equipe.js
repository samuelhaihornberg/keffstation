// src/blm-equipe.js — NOUVEAU (2026-11-02), pur, sans réseau, sans LLM.
// Travail d'équipe entre BLM complémentaires : AUCUN bloc existant n'est
// hors de l'équipe standard. Le registre contient 110 BLM existants.
// Les 18 blocs standards + 82 nouveaux = 100 noyau ; les 92 autres BLM
// existants sont également intégrés à l'équipe complète.
// Total : 192 BLM (110 existants + 82 nouveaux).
// 8 blocs hors-vagues (002, 042, 086, 088, 089-092) restent intégrés
// comme blocs transversaux ; ils ne sont pas supprimés ni isolés.
// Communication parcellaire : chaque BLM reçoit l'événement et la tâche
// du tour. Les données circulent en parcelles typées (src/parcelles-cos-cu.js).
// Pas de maillage intégral implicite : routage parcellaire réel.
// Règles DÉJÀ PRÉSENTES réutilisées : plans 002 (blm-routage.js), portes S4
// (budget/enveloppe), redemande unique terminale (blm-contrat.js), repli
// modèle (conversation.html reponseSalutation), cloisonnement par bot
// (memoire-classee.js). Règles NOUVELLES (à confirmer) : ordre des vagues,
// parallélisme documenté ci-dessous + PRIORITES de résolution des contradictions.
// Garde : aucun BLM ne touche sysPrompt ni personality du bot (068,
// providers.js) ; ViA garde sa sociabilité (096 AMI-CHALEUR + consigne ViA).
'use strict';

// ============================================================
// GROUPE STANDARD : 100 blocs répartis en 5 vagues de 20
// S1 (socle) reste la porte d'entrée commune, hors de ce compte.
// ============================================================

// Vague S2 — Comprendre (20 blocs)
// Existants (7) : 019, 020, 021, 022, 023, 024, 029
// Ajouts (13) : 111-123
var S2_COMPRENDRE = [
  '019', '020', '021', '022', '023', '024', '029',
  '111', '112', '113', '114', '115', '116', '117',
  '118', '119', '120', '121', '122', '123'
];

// Vague S3 — Contexte (20 blocs)
// Existants (4) : 035, 036, 038, 057
// Ajouts (16) : 124-139
var S3_CONTEXTE = [
  '035', '036', '038', '057',
  '124', '125', '126', '127', '128', '129', '130',
  '131', '132', '133', '134', '135', '136', '137',
  '138', '139'
];

// Vague S4 — Décider (20 blocs)
// Existants (4) : 063, 064, 065, 069
// Ajouts (16) : 140-155
var S4_DECIDER = [
  '063', '064', '065', '069',
  '140', '141', '142', '143', '144', '145', '146',
  '147', '148', '149', '150', '151', '152', '153',
  '154', '155'
];

// Vague S5 — Juger (20 blocs)
// Existants (2) : 071, 079
// Ajouts (18) : 156-173
var S5_JUGER = [
  '071', '079',
  '156', '157', '158', '159', '160', '161', '162',
  '163', '164', '165', '166', '167', '168', '169',
  '170', '171', '172', '173'
];

// Vague S6 — Finaliser (20 blocs)
// Existants (1) : 087
// Ajouts (19) : 174-192
var S6_FINALISER = [
  '087',
  '174', '175', '176', '177', '178', '179', '180',
  '181', '182', '183', '184', '185', '186', '187',
  '188', '189', '190', '191', '192'
];

// S1 — Socle (porte d'entrée commune, hors du compte de 100)
var S1_SOCLE = ['001', '003', '004', '007', '011', '015'];

// Tous les blocs existants (001-110) — intégrés à l'équipe complète
var BLOCS_EXISTANTS = [];
for (var _i = 1; _i <= 110; _i++) {
  var _id = (_i < 10 ? '00' : (_i < 100 ? '0' : '')) + _i;
  BLOCS_EXISTANTS.push(_id);
}
// Tous les nouveaux blocs (111-192)
var BLOCS_NOUVEAUX = [];
for (var _j = 111; _j <= 192; _j++) {
  BLOCS_NOUVEAUX.push(String(_j));
}
// Groupe complet : 192 BLMs (110 existants + 82 nouveaux)
var GROUPE_COMPLET = BLOCS_EXISTANTS.concat(BLOCS_NOUVEAUX);
// Tous les blocs du groupe standard (maintenant 192)
var STANDARD_BLOCS = GROUPE_COMPLET.slice();
// Noyau de 100 : 18 standards + 82 nouveaux (référence historique)
var NOYAU_100 = S2_COMPRENDRE.concat(S3_CONTEXTE).concat(S4_DECIDER).concat(S5_JUGER).concat(S6_FINALISER);

// Vagues avec mode d'exécution
var VAGUES = [
  { nom: 'socle-S1', mode: 'porte', blocs: S1_SOCLE },
  { nom: 'comprendre-S2', mode: 'logique', blocs: S2_COMPRENDRE },
  { nom: 'contexte-S3', mode: 'logique', blocs: S3_CONTEXTE },
  { nom: 'decider-S4', mode: 'porte', blocs: S4_DECIDER },
  { nom: 'juger-S5', mode: 'logique', blocs: S5_JUGER },
  { nom: 'finaliser-S6', mode: 'porte', blocs: S6_FINALISER }
];

// Noms des nouveaux blocs (111-192)
var NOMS_BLOCS = {
  // S2 — Comprendre
  '111': 'Détecteur d\'intention',
  '112': 'Analyseur de demande',
  '113': 'Résolveur d\'ambiguïtés',
  '114': 'Analyseur de références',
  '115': 'Reconnaisseur de langue',
  '116': 'Maintien linguistique',
  '117': 'Décodeur d\'expressions',
  '118': 'Extracteur de contraintes',
  '119': 'Lecteur de format attendu',
  '120': 'Estimateur de détail',
  '121': 'Analyseur d\'émoticônes',
  '122': 'Cartographe sémantique',
  '123': 'Reformulateur interne',
  // S3 — Contexte
  '124': 'Mémoire du tour actif',
  '125': 'Résumeur de conversation',
  '126': 'Récupérateur de souvenirs',
  '127': 'Filtre de pertinence mémoire',
  '128': 'Vérificateur de fraîcheur',
  '129': 'Provenance mémoire',
  '130': 'Profil de préférences',
  '131': 'Continuité de personnalité',
  '132': 'Lecteur de dynamique conversationnelle',
  '133': 'Hypothèse émotionnelle prudente',
  '134': 'Détecteur de changement de sujet',
  '135': 'Résolveur de contradictions d\'historique',
  '136': 'Index de bibliothèque intelligente',
  '137': 'Filtre de confidentialité',
  '138': 'Contexte temporel',
  '139': 'Constructeur de contexte partagé',
  // S4 — Décider
  '140': 'Générateur de pistes',
  '141': 'Sélecteur d\'objectif principal',
  '142': 'Arbitre de contraintes',
  '143': 'Constructeur de plan',
  '144': 'Analyseur de compromis',
  '145': 'Générateur d\'antithèses',
  '146': 'Synthétiseur de perspectives',
  '147': 'Sélecteur de genre',
  '148': 'Sélecteur de duo SuperBot',
  '149': 'Planificateur COS/CU',
  '150': 'Répartiteur de tâches',
  '151': 'Sélecteur de matrice',
  '152': 'Estimateur de compute',
  '153': 'Répartiteur CPU/GPU/WASM',
  '154': 'Séquenceur d\'étapes',
  '155': 'Coordinateur d\'apprentissage KEF',
  // S5 — Juger
  '156': 'Vérificateur de cohérence',
  '157': 'Détecteur de contradiction',
  '158': 'Filtre hors sujet',
  '159': 'Réducteur de répétitions',
  '160': 'Contrôleur de polarité',
  '161': 'Vérificateur synonymes/antonymes',
  '162': 'Vérificateur de consignes',
  '163': 'Contrôleur de langue',
  '164': 'Contrôleur de persona',
  '165': 'Vérificateur de contexte',
  '166': 'Contrôleur de confidentialité',
  '167': 'Vérificateur de sources internes',
  '168': 'Marqueur d\'incertitude',
  '169': 'Évaluateur de complétude',
  '170': 'Interprète du feedback',
  '171': 'Lecteur du passage à la suite',
  '172': 'Correcteur d\'après-feedback',
  '173': 'Vérificateur de synchronisation',
  // S6 — Finaliser
  '174': 'Synthèse finale SuperBot',
  '175': 'Formulateur naturel',
  '176': 'Ajusteur de style',
  '177': 'Ajusteur d\'attention',
  '178': 'Sélecteur d\'émoticônes',
  '179': 'Micro-apport éducatif',
  '180': 'Ajusteur de concision',
  '181': 'Structureur de réponse longue',
  '182': 'Formateur de tableaux',
  '183': 'Préparateur de diffusion progressive',
  '184': 'Préparateur de canal Texte',
  '185': 'Préparateur de canal Image',
  '186': 'Préparateur de canal Background',
  '187': 'Afficheur d\'état moteur',
  '188': 'Formulateur d\'erreur ou de réponse partielle',
  '189': 'Évaluateur de réduction du bruit',
  '190': 'Calculateur KEF',
  '191': 'Indicateur de puissance conversationnelle',
  '192': 'Proposeur de souvenir'
};

// Blocs hors vagues (statut documenté)
var NON_AFFECTES = { strategie: ['002'], surDemande: ['042'], passives: ['086'], docSeule: ['088'], runnerDirect: ['089', '090', '091', '092'], definisNonCables: [] };

// Familles mobilisées par vague
var FAMILLES_PAR_VAGUE = {
  'socle-S1': ['orchestration', 'transparence', 'sécurité', 'coûts'],
  'comprendre-S2': ['compréhension', 'langue', 'samitisation'],
  'contexte-S3': ['mémoire', 'savoir', 'registre', 'sécurité', 'bibliothèques'],
  'decider-S4': ['raisonnement', 'coûts', 'amitié simulée', 'langue', 'cos-cu', 'kef'],
  'juger-S5': ['cohérence', 'correction', 'transparence', 'amitié simulée', 'confidentialité'],
  'finaliser-S6': ['vérification', 'conscience simulée', 'sécurité', 'philosophie', 'registre', 'orchestration', 'coûts', 'affichage']
};

// Équipes
var EQUIPES = {
  salutation: { blocs: ['019', '035', '057'], moteur: false, motif: 'salutation-sans-moteur',
    vagues: [{ nom: 'comprendre', mode: 'porte', blocs: ['019'] }, { nom: 'contexte', mode: 'porte', blocs: ['035'] }, { nom: 'ton', mode: 'porte', blocs: ['057'] }] },
  minimal: { blocs: ['019', '035'], moteur: false, motif: 'intention-nulle',
    vagues: [{ nom: 'comprendre', mode: 'porte', blocs: ['019'] }, { nom: 'contexte', mode: 'porte', blocs: ['035'] }] },
  repli: { blocs: ['019', '028'], moteur: false, motif: 'hors-perimetre',
    vagues: [{ nom: 'comprendre', mode: 'porte', blocs: ['019'] }, { nom: 'perimetre', mode: 'porte', blocs: ['028'] }] },
  standard: { blocs: STANDARD_BLOCS, moteur: true, motif: 'parcours-complet-192',
    vagues: VAGUES, transversaux: ['002', '042', '086', '088', '089', '090', '091', '092'] }
};

function composer(intention, perimetre) {
  if (perimetre === false) return EQUIPES.repli;
  if (intention === 'salutation') return EQUIPES.salutation;
  if (intention === 'question' || intention === 'message') return EQUIPES.standard;
  return EQUIPES.minimal;
}

// Connexions structurelles : 4 internes par bloc (400) + 1600 entre vagues = 2000
var CONNEXIONS_INTERNES = 400; // 4 par bloc × 100 blocs
var CONNEXIONS_INTER_VAGUES = 1600; // 4 × 20 × 20 (4 connexions par bloc vers la vague suivante)
var CONNEXIONS_TOTAL = CONNEXIONS_INTERNES + CONNEXIONS_INTER_VAGUES;

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    S1_SOCLE: S1_SOCLE, S2_COMPRENDRE: S2_COMPRENDRE, S3_CONTEXTE: S3_CONTEXTE,
    S4_DECIDER: S4_DECIDER, S5_JUGER: S5_JUGER, S6_FINALISER: S6_FINALISER,
    BLOCS_EXISTANTS: BLOCS_EXISTANTS, BLOCS_NOUVEAUX: BLOCS_NOUVEAUX,
    GROUPE_COMPLET: GROUPE_COMPLET, NOYAU_100: NOYAU_100,
    STANDARD_BLOCS: STANDARD_BLOCS, VAGUES: VAGUES, NOMS_BLOCS: NOMS_BLOCS,
    NON_AFFECTES: NON_AFFECTES, FAMILLES_PAR_VAGUE: FAMILLES_PAR_VAGUE,
    EQUIPES: EQUIPES, composer: composer, CONNEXIONS_TOTAL: CONNEXIONS_TOTAL
  };
}
if (typeof window !== 'undefined') {
  window.BlmEquipe = {
    S1_SOCLE: S1_SOCLE, S2_COMPRENDRE: S2_COMPRENDRE, S3_CONTEXTE: S3_CONTEXTE,
    S4_DECIDER: S4_DECIDER, S5_JUGER: S5_JUGER, S6_FINALISER: S6_FINALISER,
    BLOCS_EXISTANTS: BLOCS_EXISTANTS, BLOCS_NOUVEAUX: BLOCS_NOUVEAUX,
    GROUPE_COMPLET: GROUPE_COMPLET, NOYAU_100: NOYAU_100,
    STANDARD_BLOCS: STANDARD_BLOCS, VAGUES: VAGUES, NOMS_BLOCS: NOMS_BLOCS,
    NON_AFFECTES: NON_AFFECTES, FAMILLES_PAR_VAGUE: FAMILLES_PAR_VAGUE,
    EQUIPES: EQUIPES, composer: composer, CONNEXIONS_TOTAL: CONNEXIONS_TOTAL
  };
}