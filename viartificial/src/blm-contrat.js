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
    perimetre: true, tronque: false, melange: false, faits: [] };
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
