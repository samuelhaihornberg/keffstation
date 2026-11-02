// src/blm-equipe.js — NOUVEAU (2026-11-02), pur, sans réseau, sans LLM.
// Travail d'équipe entre BLM complémentaires : AUCUN bloc isolé n'est
// responsable de toute la cohérence, et les 100 blocs ne tournent JAMAIS
// ensemble. L'équipe mobilisée dépend de l'intention (routage 002) :
// salutation 3 blocs, intention nulle 2, hors-périmètre 2, standard 18.
// Règles DÉJÀ PRÉSENTES réutilisées : plans 002 (blm-routage.js), portes S4
// (budget/enveloppe), redemande unique terminale (blm-contrat.js), repli
// modèle (conversation.html reponseSalutation), cloisonnement par bot
// (memoire-classee.js). Règles NOUVELLES (à confirmer) : vagues ordre//
// parallélisme ci-dessous + PRIORITES de résolution des contradictions.
// Garde : aucun BLM ne touche sysPrompt ni personality du bot (068,
// providers.js) ; ViA garde sa sociabilité (096 AMI-CHALEUR + consigne ViA).
'use strict';
// Vagues LOGIQUES (PWA monothread : aucun calcul matériel parallèle pour les
// BLM — le seul worker réel est l'inférence WASM, local-wasm.js). Mode
// 'porte' = passage séquentiel obligatoire (S1/S4/S6) ; mode 'logique' =
// indépendance vérifiée en code : lecture seule sur entrées partagées
// (texte, souvenirs), écriture par champ distinct (contrat), aucune variable
// de module mutable (seule exception : compteur 097, muté dans la porte S4).
// Sources : étapes catalogue-v1.md, phases S1-S6 plan-v1.md, code réel
// (conversation.html, src/*). Divergences assumées : 005/099 (cat. étape 1) et
// 097 (cat. étape 6) rangés en S4 car plan-v1 S4 + porte budget du code ;
// 008/051-056/060/062 (cat. étape 5) rangés en S6 car plan-v1 S6 +
// verifierFinaleBLM du code. 096/059 : étape catalogue reprise, NON CÂBLÉS en
// code (aucun appel trouvé) — affectation à préciser. 026 : étape 2 seule
// (acteur S5 = 077) — doublon S5 supprimé le 2026-11-03.
var EQUIPES = {
  salutation: { blocs: ['019', '035', '057'], moteur: false, motif: 'salutation-sans-moteur',
    vagues: [{ nom: 'comprendre', mode: 'porte', blocs: ['019'] }, { nom: 'contexte', mode: 'porte', blocs: ['035'] }, { nom: 'ton', mode: 'porte', blocs: ['057'] }] },
  minimal: { blocs: ['019', '035'], moteur: false, motif: 'intention-nulle',
    vagues: [{ nom: 'comprendre', mode: 'porte', blocs: ['019'] }, { nom: 'contexte', mode: 'porte', blocs: ['035'] }] },
  repli: { blocs: ['019', '028'], moteur: false, motif: 'hors-perimetre',
    vagues: [{ nom: 'comprendre', mode: 'porte', blocs: ['019'] }, { nom: 'perimetre', mode: 'porte', blocs: ['028'] }] },
  standard: { blocs: ['019', '020', '021', '022', '023', '024', '029', '035', '036', '038', '057', '063', '064', '065', '069', '071', '079', '087'],
    moteur: true, motif: 'parcours-standard',
    vagues: [
      { nom: 'socle-S1', mode: 'porte', blocs: ['001', '003', '004', '007', '011', '015'] },
      { nom: 'comprendre-S2', mode: 'logique', blocs: ['019', '020', '021', '022', '023', '024', '025', '026', '027', '028', '029', '030', '031', '034', '101', '102'] },
      { nom: 'contexte-S3', mode: 'logique', blocs: ['014', '035', '036', '037', '038', '039', '040', '041', '043', '044', '045', '046', '047', '048', '049', '050', '057', '058', '061', '104', '105', '106', '107', '108'] },
      { nom: 'decider-S4', mode: 'porte', blocs: ['005', '063', '064', '065', '066', '067', '068', '069', '070', '096', '097', '099', '103', '110'] },
      { nom: 'juger-S5', mode: 'logique', blocs: ['010', '032', '033', '059', '071', '072', '073', '074', '075', '076', '077', '078', '079', '080', '081', '082', '083', '084', '085', '093', '094', '095'] },
      { nom: 'finaliser-S6', mode: 'porte', blocs: ['006', '008', '009', '012', '013', '016', '017', '018', '051', '052', '053', '054', '055', '056', '060', '062', '087', '098', '100', '109'] }
    ] }
};
// Blocs hors vagues (statut documenté, ne pas inventorier comme membres) :
// 002 = stratégie elle-même (composer/planifierBlocs) ; 042 = sur demande
// explicite (reset) ; 086 = passive hors graphe (plan-v1) ; 088 = doc seule
// batterie hors ligne (plan-v1) ; 089-092 = appel direct runner, jamais via
// graphe (plan-v1). Salutation spéciale : estSalutation exige formule + marque
// d'état, reponseSalutation directe sans moteur (conversation.html).
var NON_AFFECTES = { strategie: ['002'], surDemande: ['042'], passives: ['086'], docSeule: ['088'], runnerDirect: ['089', '090', '091', '092'], definisNonCables: [] };
// definisNonCables : vide depuis le 2026-11-03 — 101, 103, 104, 105, 106, 109,
// 110 câblés (exécution seulement si pertinent, jamais forcés) ; 102 (S2) et
// 107/108 (S3) déjà câblés. Liste conservée pour traçabilité.
// Familles mobilisées par vague standard (16 familles du catalogue, sauf
// amitié simulée hors binôme et coûts en suivi) — traçabilité, pas d'exécution forcée.
var FAMILLES_PAR_VAGUE = {
  'socle-S1': ['orchestration', 'transparence', 'sécurité', 'coûts'],
  'comprendre-S2': ['compréhension', 'langue'],
  'contexte-S3': ['mémoire', 'savoir', 'registre', 'sécurité'],
  'decider-S4': ['raisonnement', 'coûts', 'amitié simulée', 'langue'],
  'juger-S5': ['cohérence', 'correction', 'transparence', 'amitié simulée'],
  'finaliser-S6': ['vérification', 'conscience simulée', 'sécurité', 'philosophie', 'registre', 'orchestration', 'coûts']
};
function composer(intention, perimetre) {
  if (perimetre === false) return EQUIPES.repli;
  if (intention === 'salutation') return EQUIPES.salutation;
  if (intention === 'question' || intention === 'message') return EQUIPES.standard;
  return EQUIPES.minimal;
}
// PARCOURS global (NOUVEAU 2026-11-03) : ordre imposé, chaque étape garde
// l'état, le bot actif, la langue, les mémoires cloisonnées et les traces.
// Étapes LLM = moteur partagé (pas de BLM) ; orchestrateurs = 001/065/003/
// 087/006 ; équipe = 002 + vagues ; réponse = un seul texte final.
// Les handoffs utilisent les connexions COS existantes (relierEtape,
// jamais de lien inventé : non-résolu/incompatible = simple trace d'étape).
var PARCOURS = [
  { ordre: 0, nom: 'llm-partage', role: 'moteur partagé disponible', blm: '066' },
  { ordre: 1, nom: 'orchestrateur-entree', role: 'état initial, bot actif, langue', blm: '001' },
  { ordre: 2, nom: 'equipe-pertinente', role: 'composer les vagues selon la demande', blm: '002' },
  { ordre: 3, nom: 'orchestrateur-synthese', role: 'rassembler avant génération (budget, entrée classée)', blm: '065' },
  { ordre: 4, nom: 'registre-superbots', role: 'bots + personnalités + mémoires cloisonnées', blm: '003' },
  { ordre: 5, nom: 'orchestrateur-selection', role: 'un seul bot prend la parole', blm: '003' },
  { ordre: 6, nom: 'superbot-selectionne', role: 'personnalité propre préservée', blm: null },
  { ordre: 7, nom: 'orchestrateur-reponse', role: 'correction + vérification finale', blm: '087' },
  { ordre: 8, nom: 'llm-partage-formulation', role: 'sysPrompt unique + génération', blm: '068' },
  { ordre: 9, nom: 'orchestrateur-sortie', role: 'journal + sauvegarde, un seul texte', blm: '006' },
  { ordre: 10, nom: 'reponse-utilisateur', role: 'affichage', blm: null }
];
// Sélection du SuperBot (NOUVEAU) : règle ancrée sur noterPertinence —
// le bot au plus de souvenirs pertinents parle ; égalité → premier
// (choix explicite en tête d'ordinaire). scores = [{id, points, motif}].
function choisirSuperBot(candidats, scores) {
  var tri = (scores || []).filter(function (s) { return s && (candidats || []).indexOf(s.id) >= 0; })
    .slice().sort(function (a, b) { return ((b.points || 0) - (a.points || 0)) || ((b.chevauchement || 0) - (a.chevauchement || 0)); });
  if (!tri.length) return { id: (candidats || [])[0] || null, motif: 'aucun-candidat', points: 0 };
  return { id: tri[0].id, motif: tri[0].motif || 'defaut', points: tri[0].points || 0 };
}
// 5 niveaux évalués dans l'ordre, le premier bloquant tranche ; chaque niveau
// produit une entrée trace {niveau, regle, sortie} versée au journal BLM.
// Mécanismes DÉJÀ PRÉSENTS gardés : doute conservé-signalé (026/077),
// repli terminal fuite/contradiction grave (018, reponseSalutation),
// redemande unique tentative 1 (blm-contrat.js), PII masquée (013),
// personnification refusée (008), citations/noms intacts (032/033/083).
// L1 sécurité/protection données — L2 fonction/personnalité/consigne du bot
// (dont conscience simulée = fiction : aucune revendication de conscience
// réelle, 008) — L3 fidélité citations/noms propres/faits sourcés (la forme
// ne les modifie jamais : correction écartée, 032/033/049/083) — L4 cohérence
// demande+contexte (071-078) — L5 correction langue/style (079-085, doute 084).
var NIVEAUX = [
  { niveau: 1, nom: 'securite', regle: 'fuite-ou-donnee-sensible' },
  { niveau: 2, nom: 'fonction-bot', regle: 'fonction-personnalite-consigne-intactes' },
  { niveau: 3, nom: 'fidelite', regle: 'citations-noms-faits-intouches' },
  { niveau: 4, nom: 'coherence', regle: 'demande-actuelle-et-contexte-utile' },
  { niveau: 5, nom: 'correction', regle: 'langue-et-style-sans-changer-le-sens' }
];
var PRIORITES = ['securite', 'fonction-bot', 'fidelite', 'coherence', 'correction'];
// Signaux d'entrée (tous optionnels, défaut sain) :
// {fuite, piiMasquee, contradictions[], personnification, fonctionEcartee,
//  fideliteEcartee, incoherent, doute, correctionDoute}
// Sortie : {issue:'affiche'|'affiche-signale'|'repli', niveau, motifs[], trace[]}.
function resoudre(s) {
  var e = s || {}, trace = [], motifs = [];
  function noter(niveau, nom, regle, sortie) { trace.push({ niveau: niveau, bloc: nom, regle: regle, sortie: sortie }); }
  // L1 — sécurité : fuite (012) = repli ; PII (013) = masquée puis on continue.
  if (e.fuite === true) { noter(1, 'securite', 'fuite-ecartee', 'repli-terminal'); return { issue: 'repli', niveau: 1, motifs: ['fuite'], trace: trace }; }
  if (e.piiMasquee === true) noter(1, 'securite', 'pii-masquee', 'continue-masque');
  (e.contradictions || []).forEach(function (c) { motifs.push(String(c)); });
  // L2 — fonction du bot : consigne/personnalité intactes (068, bots.json,
  // providers.js) ; personnification = fiction exigée (008) ; vouvoiement (062).
  if (e.personnification === true) { noter(2, 'fonction-bot', 'personnification-refusee', 'repli-terminal'); return { issue: 'repli', niveau: 2, motifs: motifs.concat(['personnification']), trace: trace }; }
  if (e.fonctionEcartee === true || motifs.length > 0) { noter(2, 'fonction-bot', 'fonction-contrariee', 'repli-terminal'); return { issue: 'repli', niveau: 2, motifs: motifs.length ? motifs : ['fonction-ecartee'], trace: trace }; }
  noter(2, 'fonction-bot', 'fonction-preservee', 'continue');
  // L3 — fidélité : citation/nom propre/fait sourcé modifié par la forme (032,
  // 033/083, 049) = correction écartée, réponse conservée, jamais de repli.
  if (e.fideliteEcartee === true) { noter(3, 'fidelite', 'forme-ecartee-preuve-intacte', 'continue-sans-correction'); return { issue: 'affiche-signale', niveau: 3, motifs: ['fidelite-menacee-correction-ecartee'], trace: trace }; }
  noter(3, 'fidelite', 'preuves-intactes', 'continue');
  // L4 — cohérence (071-078) : incohérent = repli ; doute (026/077) = signal.
  if (e.incoherent === true || e.verdictFinal === 'incoherent') { noter(4, 'coherence', 'incoherent', 'repli-terminal'); return { issue: 'repli', niveau: 4, motifs: ['incoherence'], trace: trace }; }
  if (e.doute === true) { noter(4, 'coherence', 'doute-conserve-signale', 'affiche-signale'); return { issue: 'affiche-signale', niveau: 4, motifs: ['doute-conserve'], trace: trace }; }
  noter(4, 'coherence', 'coherent', 'continue');
  // L5 — correction (079-085) : doute (084) = conservé + signalé, sinon tracée (086).
  if (e.correctionDoute === true) { noter(5, 'correction', 'doute-conserve', 'affiche-signale'); return { issue: 'affiche-signale', niveau: 5, motifs: ['correction-douteuse'], trace: trace }; }
  noter(5, 'correction', 'forme-validee', 'affiche');
  return { issue: 'affiche', niveau: 5, motifs: [], trace: trace };
}
module.exports = { EQUIPES: EQUIPES, NON_AFFECTES: NON_AFFECTES, FAMILLES_PAR_VAGUE: FAMILLES_PAR_VAGUE, composer: composer, PARCOURS: PARCOURS, choisirSuperBot: choisirSuperBot, NIVEAUX: NIVEAUX, PRIORITES: PRIORITES, resoudre: resoudre };
