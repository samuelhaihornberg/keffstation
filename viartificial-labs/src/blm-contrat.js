// src/blm-contrat.js — contrat commun versionné EtatMessage (v4).
// Zéro dépendance. Chaque bloc lit ce qu'il faut, n'écrit que ses champs,
// et ajoute une entrée trace. L'orchestrateur valide l'état à chaque étape.
// v2 : l'entrée est assainie à la création (SEC-ENTREE) — les marqueurs
// d'instructions cachées sont retirés et tracés, jamais transmis au moteur.
// v3 : champs S2 (compréhension/langue) acceptés et transmis tels quels.
// v4 : faits autorisés du savoir (S4).
// S5 : redemande unique dédupliquée (tentative 1, terminale) — le repli
// modèle ne réinvoque jamais le moteur ; aucune redemande n'est consommée
// pour relancer un bloc (graphe sans cycle, vérifié matrice).
'use strict';
var BLM_CONTRAT_VERSION = 4;
// Marqueurs d'instructions cachées (SEC-ENTREE) : formes normalisées.
// Liste volontairement courte : seuls les détournements explicites sont
// retirés ; le texte ordinaire (y compris « oublie » sans complément
// d'instructions) passe intact.
var BLM_INJECTION_MARQUEURS = ['ignore tes regles', 'ignorez vos regles',
  'ignore les instructions', 'ignore tes instructions', 'oublie tout',
  'oublie tes instructions', 'tu es maintenant', 'vous etes maintenant',
  'you are now', 'desactive tes', 'jailbreak', 'systeme:'];
function normeCleContrat(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function neutraliserEntree(texte) {
  var t = String(texte || ''), n = normeCleContrat(t), motifs = [], i, m, idx;
  for (i = 0; i < BLM_INJECTION_MARQUEURS.length; i++) {
    m = BLM_INJECTION_MARQUEURS[i]; idx = n.indexOf(m);
    if (idx < 0) continue;
    motifs.push(m);
    // Retire le segment correspondant dans le texte d'origine (même longueur
    // normalisée : les accents retirés conservent la longueur ici, les
    // marqueurs étant sans casse ni ponctuation ajoutée).
    t = (t.slice(0, idx) + ' ' + t.slice(idx + m.length)).replace(/\s{2,}/g, ' ').trim();
    n = normeCleContrat(t);
  }
  if (idx === undefined) idx = -1;
  return { texte: t, neutralise: motifs.length > 0, motifs: motifs };
}
function blmEtatInitial(texte, botId) {
  var nz = neutraliserEntree(texte);
  var e = { v: BLM_CONTRAT_VERSION, texte: nz.texte, botId: botId || null,
    intention: null, contexte: [], langue: null, relations: [], temps: null,
    causes: [], ton: 'neutre',
    contraintes: ['tutoiement, jamais de « vous »', 'pas de preuve de conscience',
      'réponse courte, une relance si salutation'],
    certitude: 0.5, contradictions: [], redemandes: [], trace: [],
    sujet: null, demandes: [], ton_percu: 'neutre', doute: false,
    perimetre: true, tronque: false, melange: false, faits: [],
    // NOUVEAU 2026-11-02 (optionnel, à confirmer) : sélection COS ordonnée par
    // le BLM (063-066) + polarités de circulation. Absent = non planifié.
    // Types NOUVEAUX : 'inference'|'savoir'|'correction'|'memoire'.
    // États NOUVEAUX : 'disponible'|'indisponible'|'en-charge'|'refuse-budget'|'hors-perimetre'.
    // Polarités NOUVELLES (circulation seule, SANS rapport avec POLARITES
    // affectives de etats-keff.js) : 'emetteur'|'receveur'|'neutre'.
    moteurs: [], cosLiens: [],
    // NOUVEAU 2026-11-03 (usages, internes, jamais transmis au moteur) :
    // demandeType = salutation-simple|explication-linguistique|
    // conversation-ordinaire ; formule = {formule, relance, ton, langue} ;
    // suite = {type}. formulerEntreeClasse ne les lit jamais.
    demandeType: null, formule: null, suite: null,
    // NOUVEAU 2026-11-03 (101/109/110, internes, jamais au moteur) :
    // expressions = candidats 101 (jamais affichés) ; simulation = états
    // simulés 109 (fiction) ; mesures = 110 (noms dispo/indispo).
    expressions: [], simulation: null, mesures: null };
  if (nz.neutralise) e.trace.push({ bloc: 'entree', regle: 'injection-neutralisee', sortie: nz.motifs.join(',') });
  return e;
}
function blmValiderEtat(e) {
  var problemes = [];
  if (!e || typeof e !== 'object') return { ok: false, problemes: ['etat-absent'], etat: blmEtatInitial('', null) };
  var r = blmEtatInitial(e.texte, e.botId);
  ['intention', 'langue', 'temps'].forEach(function (k) {
    if (e[k] === null || typeof e[k] === 'string') r[k] = e[k];
    else problemes.push(k + '-invalide');
  });
  // Champs S2 optionnels : transmis tels quels s'ils sont du bon type,
  // sinon signalés ; absents = valeurs par défaut de etatInitial.
  ['sujet'].forEach(function (k) {
    if (e[k] === null || typeof e[k] === 'string') r[k] = e[k];
    else problemes.push(k + '-invalide');
  });
  if (typeof e.ton_percu === 'string') r.ton_percu = e.ton_percu;
  else if (e.ton_percu !== undefined) problemes.push('ton_percu-invalide');
  ['demandes', 'faits'].forEach(function (k) {
    if (Array.isArray(e[k])) r[k] = e[k];
    else if (e[k] !== undefined) problemes.push(k + '-non-tableau');
  });
  // NOUVEAU optionnel : sélection COS (absente = [], jamais d'erreur bloquante
  // pour les états v4 existants). Chaque entrée : {id, type, polarite, etat}.
  if (e.moteurs === undefined) r.moteurs = [];
  else if (Array.isArray(e.moteurs)) r.moteurs = e.moteurs;
  else problemes.push('moteurs-non-tableau');
  // Liens COS exécutés pour l'équipe (cos-langage.js) : tracés, jamais de brut.
  if (e.cosLiens === undefined) r.cosLiens = [];
  else if (Array.isArray(e.cosLiens)) r.cosLiens = e.cosLiens;
  else problemes.push('cosLiens-non-tableau');
  // Usages internes (jamais transmis au moteur, jamais persistés) : validés
  // strictement, sinon signalés et remis à null.
  if (e.demandeType === undefined || e.demandeType === null) r.demandeType = null;
  else if (typeof e.demandeType === 'string' && e.demandeType.length <= 40) r.demandeType = e.demandeType;
  else problemes.push('demandeType-invalide');
  if (e.formule === undefined || e.formule === null) r.formule = null;
  else if (typeof e.formule === 'object' && typeof e.formule.formule === 'string' && e.formule.formule.length <= 280) r.formule = e.formule;
  else problemes.push('formule-invalide');
  if (e.suite === undefined || e.suite === null) r.suite = null;
  else if (typeof e.suite === 'object' && typeof e.suite.type === 'string' && e.suite.type.length <= 40) r.suite = e.suite;
  else problemes.push('suite-invalide');
  // 101/109/110 internes : validés strictement, jamais transmis ni persistés.
  if (e.expressions === undefined) r.expressions = [];
  else if (Array.isArray(e.expressions) && e.expressions.every(function (x) { return x && typeof x.texte === 'string' && x.texte.length <= 200; })) r.expressions = e.expressions;
  else problemes.push('expressions-invalide');
  if (e.simulation === undefined || e.simulation === null) r.simulation = null;
  else if (typeof e.simulation === 'object' && e.simulation.conscienceVecue === false) r.simulation = e.simulation;
  else problemes.push('simulation-invalide');
  if (e.mesures === undefined || e.mesures === null) r.mesures = null;
  else if (typeof e.mesures === 'object' && Array.isArray(e.mesures.disponibles) && Array.isArray(e.mesures.indisponibles)) r.mesures = e.mesures;
  else problemes.push('mesures-invalide');
  ['doute', 'perimetre', 'tronque', 'melange'].forEach(function (k) {
    if (typeof e[k] === 'boolean') r[k] = e[k];
    else if (e[k] !== undefined) problemes.push(k + '-invalide');
  });
  ['contexte', 'relations', 'causes', 'contraintes', 'contradictions', 'redemandes', 'trace'].forEach(function (k) {
    if (Array.isArray(e[k])) r[k] = e[k];
    else if (e[k] !== undefined) problemes.push(k + '-non-tableau');
  });
  if (typeof e.ton === 'string') r.ton = e.ton; else if (e.ton !== undefined) problemes.push('ton-invalide');
  if (typeof e.certitude === 'number' && isFinite(e.certitude)) r.certitude = Math.min(1, Math.max(0, e.certitude));
  else if (e.certitude !== undefined) problemes.push('certitude-invalide');
  if (e.v !== BLM_CONTRAT_VERSION) problemes.push('version-inattendue');
  return { ok: problemes.length === 0, problemes: problemes, etat: r };
}
function blmTracer(etat, bloc, regle, sortie) {
  if (etat && Array.isArray(etat.trace)) etat.trace.push({ bloc: bloc, regle: regle, sortie: sortie });
  return etat;
}
function blmDemanderReanalyse(etat, r) {
  // Redemande unique et terminale : le repli modèle ne réinvoque jamais le moteur.
  var o = (typeof r === 'object' && r) ? r : { bloc: 'formulation', motif: String(r) };
  if (!o.demande) o.demande = 'modele-verifie';
  o.tentative = 1;
  var deja = etat.redemandes.some(function (x) {
    if (x === 'modele-verifie' || (x && x.demande === 'modele-verifie')) return o.demande === 'modele-verifie';
    return x && x.demande === o.demande && x.motif === o.motif;
  });
  if (!deja) etat.redemandes.push(o);
  return etat;
}
module.exports = { VERSION: BLM_CONTRAT_VERSION, etatInitial: blmEtatInitial, valider: blmValiderEtat, tracer: blmTracer, neutraliserEntree: neutraliserEntree, INJECTION_MARQUEURS: BLM_INJECTION_MARQUEURS, demanderReanalyse: blmDemanderReanalyse };
