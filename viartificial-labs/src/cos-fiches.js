// src/cos-fiches.js — NOUVEAU 2026-11-03 : fiches SuperBots selon les règles
// bot PRÉSENTES dans cos.js (/root/viartificial/src/cos.js, identique à
// /root/projets/ViArtificial/src/cos.js). AUCUNE règle inventée : grammaire
// <co bot="ID" ...> + lignes « code op clé: valeur », ID ^[A-Za-z][A-Za-z0-9]*$,
// gardes (1 Mo max, anti-traversal, doublons refusés, lignes non conformes =
// erreurs signalées, jamais acceptées silencieusement), champs structurés
// (role, temperament, voix, reglePropre, mots, echelle, capacites, gadgets,
// pourContre, modes, droits, refus, limiteBalancier).
// KeffStation ne contient AUCUN fichier .cos : l'adaptateur ficheDepuisJson
// convertit les définitions EXISTANTES (bots.json : id, name, specialty,
// personality, tags, greeting) vers cette structure, sans rien inventer
// (droits/refus/modes/capacites absents = explicitement non-renseignés).
// Usage parcours : registre SuperBots (003) — validation des fiches +
// chevauchement mots/tags pour départager une égalité de sélection.
'use strict';
var FICHE_ID_RE = /^[A-Za-z][A-Za-z0-9]*$/;
var FICHE_MAX_COS = 1024 * 1024;
function normeFiche(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
// Grammaire cos.js portée telle quelle : bloc + lignes de règles.
function lireBlocCo(texte, fichier) {
  var src = String(texte || '').replace(/<!--[\s\S]*?-->/g, '');
  var regles = [], erreurs = [], at = null;
  var m = src.match(/<co\b([^>]*)>([\s\S]*?)<\/co>/);
  if (!m) { erreurs.push((fichier || 'fiche') + ' : aucun bloc <co>…</co>'); return { bot: null, erreurs: erreurs }; }
  at = {};
  String(m[1]).replace(/([\w-]+)="([^"]*)"/g, function (_, k, v) { at[k] = v; return ''; });
  if (!at.bot) { erreurs.push((fichier || 'fiche') + ' : bloc <co> sans attribut bot'); return { bot: null, erreurs: erreurs }; }
  if (!FICHE_ID_RE.test(at.bot)) { erreurs.push((fichier || 'fiche') + ' : ID bot invalide "' + at.bot + '"'); return { bot: null, erreurs: erreurs }; }
  String(m[2]).split('\n').forEach(function (ln) {
    var t = String(ln).trim();
    if (!t) return;
    var r = t.match(/^([a-z]\d+)\s+(\S+)\s+([^:]+?):\s*(.*)$/u);
    if (r) regles.push({ code: r[1], op: r[2], cle: normeFiche(r[3]), valeur: r[4].trim() });
    else erreurs.push((fichier || at.bot) + ' : ligne ignorée « ' + t.slice(0, 60) + ' »');
  });
  return { bot: { id: at.bot, nom: at.nom || at.bot, attrs: at, regles: regles }, erreurs: erreurs };
}
// bots.json → fiche : correspondance documentée (id, nom=name, role=specialty,
// temperament=personality, voix=greeting, mots=tags normalisés). Le reste est
// explicitement non-renseigné (jamais inventé).
// Mapping direct (repli historique, NON employé par le parcours : le parcours
// utilise exclusivement ficheDepuisBloc + lireBlocCo, une seule grammaire).
function ficheDepuisJson(b) {
  var mots = [];
  (b.tags || []).forEach(function (t) { String(t || '').split(/[^A-Za-zÀ-ÿ0-9]+/).forEach(function (w) { var n = normeFiche(w); if (n.length >= 3 && mots.indexOf(n) < 0) mots.push(n); }); });
  return { id: b.id, nom: b.name || b.id, role: String(b.specialty || ''), temperament: String(b.personality || ''),
    voix: String(b.greeting || ''), mots: mots, echelle: {}, capacites: [], gadgets: [], pourContre: [],
    modes: [], droits: [], refus: [], reglePropre: '', limiteBalancier: null, nonRenseigne: ['echelle', 'capacites', 'gadgets', 'pour-contre', 'modes', 'droits', 'refus'] };
}
function validerRegistre(fiches) {
  var vus = {}, erreurs = [];
  (fiches || []).forEach(function (f) {
    if (!f || !FICHE_ID_RE.test(f.id || '')) { erreurs.push('ID bot invalide : ' + (f && f.id)); return; }
    if (vus[f.id]) { erreurs.push('ID bot dupliqué : ' + f.id); return; }
    vus[f.id] = true;
  });
  return { ok: erreurs.length === 0, erreurs: erreurs };
}
// Représentation <co bot> GÉNÉRÉE depuis bots.json (source unique, jamais
// éditée à la main) : seuls les champs EXISTANTS sont émis (id, nom=name,
// role=specialty, temperament=personality, voix=greeting, mots=tags) ; aucun
// champ inventé (ni capacites, ni droits, ni refus). Règles cos.js appliquées
// à la génération comme à la lecture : ID invalide ou guillemet non échappable
// → erreur, jamais de silencieux.
function blocCoDepuisJson(b) {
  var id = String((b && b.id) || '');
  if (!FICHE_ID_RE.test(id)) throw new Error('ID bot invalide : ' + id);
  ['name', 'specialty', 'personality', 'greeting'].forEach(function (k) {
    if (/"/.test(String((b && b[k]) || ''))) throw new Error('guillemet non échappable dans ' + k + ' de ' + id);
  });
  var mots = [];
  String((b && b.tags) ? b.tags.join(' ') : '').split(/[^A-Za-zÀ-ÿ0-9]+/).forEach(function (w) {
    var n = normeFiche(w); if (n.length >= 3 && mots.indexOf(n) < 0) mots.push(n);
  });
  return '<co bot="' + id + '" nom="' + b.name + '" famille="SuperBots">\n' +
    'r1 : role: ' + b.specialty + '\n' +
    'r2 : temperament: ' + b.personality + '\n' +
    'r3 : voix: ' + b.greeting + '\n' +
    'r4 : mots: ' + mots.join(', ') + '\n</co>';
}
// Fiche via la grammaire (aller-retour vérifié : le relu doit égaler l'écrit).
function ficheDepuisBloc(b) {
  var texte = blocCoDepuisJson(b);
  var p = lireBlocCo(texte, 'bots.json:' + b.id);
  if (p.erreurs.length || !p.bot) return { fiche: null, erreurs: p.erreurs.length ? p.erreurs : ['bloc vide'] };
  var un = {};
  (p.bot.regles || []).forEach(function (r) { if (!(r.cle in un)) un[r.cle] = r.valeur; });
  var mots = String(un.mots || '').split(',').map(normeFiche).filter(function (w) { return w; });
  var fiche = { id: p.bot.id, nom: p.bot.attrs.nom || p.bot.id, role: un.role || '', temperament: un.temperament || '', voix: un.voix || '', mots: mots,
    echelle: {}, capacites: [], gadgets: [], pourContre: [], modes: [], droits: [], refus: [], reglePropre: '', limiteBalancier: null, nonRenseigne: ['echelle', 'capacites', 'gadgets', 'pour-contre', 'modes', 'droits', 'refus'] };
  // Valeur manquante → nonRenseigne (jamais inventée, jamais comblée).
  ['role', 'temperament', 'voix'].forEach(function (k) { if (!fiche[k] && fiche.nonRenseigne.indexOf(k) < 0) fiche.nonRenseigne.push(k); });
  if (!fiche.mots.length && fiche.nonRenseigne.indexOf('mots') < 0) fiche.nonRenseigne.push('mots');
  var erreurs = [];
  if (fiche.id !== b.id) erreurs.push('aller-retour id incohérent');
  if (fiche.role !== String(b.specialty || '')) erreurs.push('aller-retour role incohérent');
  if (fiche.temperament !== String(b.personality || '')) erreurs.push('aller-retour temperament incohérent');
  if (fiche.voix !== String(b.greeting || '')) erreurs.push('aller-retour voix incohérente');
  return { fiche: erreurs.length ? null : fiche, erreurs: erreurs };
}
// Chevauchement mots/tag (normalisés cos.js) avec les mots porteurs du sujet.
function chevauchement(fiche, motsSujet) {
  var n = 0;
  (motsSujet || []).forEach(function (w) { if ((fiche.mots || []).indexOf(String(w)) >= 0) n++; });
  return n;
}
module.exports = { ID_RE: FICHE_ID_RE, MAX_COS_SIZE: FICHE_MAX_COS, norme: normeFiche, lireBlocCo: lireBlocCo, ficheDepuisJson: ficheDepuisJson, blocCoDepuisJson: blocCoDepuisJson, ficheDepuisBloc: ficheDepuisBloc, validerRegistre: validerRegistre, chevauchement: chevauchement };
