// src/cos-langage.js — langage COS de connexion (NOUVEAU 2026-11-03).
// Grammaire ÉTABLIE (motor.s : README, COS.lire/analyserLigne/trajet/condition,
// co-cos-commun.js parseSpec) : <cos> regroupe, <co> = UNE connexion/description.
// Formes : "A to B" (textuel, de→vers), "A➡️B" (aller, pointe=receveur=B),
// "A⬅️B" (retour, pointe=receveur=A). "↔" = DESCRIPTION (co-cos-commun),
// jamais un lien traversable. ID : ^[A-Za-z][A-Za-z0-9]*$ (COS.alphanum).
// Règles NOUVELLES (à confirmer, marquées) : modificateur inconnu (ex. « i »
// de A1→iB2 : aucune classe/propriété ne le définit → signalé, non exécuté),
// compatibilité par classes, rotation documentaire bornée, pertinence équipe.
// Résolution : REGISTRE (cos-registre.js, généré du catalogue) ; inconnu →
// non-résolu + manque signalé, jamais inventé. L'ID est un alias, jamais un
// remplacement : la définition complète est préservée (pas de troncature).
'use strict';
var ID_RE = /^[A-Za-z][A-Za-z0-9]*$/;
var MAX_LIENS = 8; // NOUVEAU, à confirmer : borne d'exécution par message.
function registry() {
  try { var p = (typeof __dirname !== 'undefined' ? __dirname + '/' : './') + 'cos-registre.js'; return require(p).REGISTRE; }
  catch (e) { try { return window.COSRegistre.REGISTRE; } catch (x) { return {}; } }
}
function normeCle(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
function resoudreId(id, cartes) {
  var brut = String(id || '').trim();
  var reg = registry();
  // Extension ViArtificial (NOUVELLE, à confirmer) : références BLM numériques
  // 001-100 acceptées comme alias (le catalogue numérote ainsi ; COS.alphanum
  // historique exigeait une lettre initiale). Zéro-paddées, jamais tronquées.
  var num = brut.match(/^[0-9]{1,3}$/) ? ('00' + brut).slice(-3) : null;
  if (num && reg[num]) return { resolu: true, id: num, def: reg[num], aliasNumerique: true };
  if (!ID_RE.test(brut)) return { resolu: false, id: brut, manque: 'ID non alphanumérique' };
  if (reg[brut]) return { resolu: true, id: brut, def: reg[brut] };
  var n = normeCle(brut);
  var k = Object.keys(reg).filter(function (k) { return normeCle(k) === n; })[0];
  if (k) return { resolu: true, id: k, def: reg[k] };
  if (cartes && cartes[brut]) return { resolu: true, id: brut, def: cartes[brut] };
  var mod = brut.match(/^[a-z][A-Z]/);
  if (mod) return { resolu: false, id: brut, manque: 'modificateur présumé « ' + brut[0] + ' » non défini par aucune classe/propriété (cf. A1→iB2) : signification inconnue' };
  return { resolu: false, id: brut, manque: 'aucune définition au registre (ni BLM, famille, langue, pattern, paramètre, ni carte ↔ du document)' };
}
// Analyse un document <cos> : ordre documentaire conservé (rotation).
// Sortie : {ok, cartes, liens[{de,vers,op,sens,donneur,receveur,description}], notes[]}.
function analyser(src) {
  var r = { ok: false, cartes: {}, liens: [], notes: [] };
  var s = String(src || '').replace(/<!--[\s\S]*?-->/g, '').replace(/[︎\uFE0E\uFE0F]/g, '');
  var blocs = s.match(/<cos[^>]*>([\s\S]*?)<\/cos>/g) || [];
  if (!blocs.length) { r.notes.push('aucun bloc <cos>…</cos>'); return r; }
  blocs.forEach(function (b) {
    var inners = b.match(/<co[^>]*>([\s\S]*?)<\/co>/g) || [];
    inners.forEach(function (c) {
      var t = c.replace(/<\/?co[^>]*>/g, '').trim();
      if (!t) return;
      if (/↔/.test(t)) { // DESCRIPTION (co-cos-commun), jamais traversable.
        var parts = t.split('↔').map(function (x) { return x.trim(); });
        if (ID_RE.test(parts[0])) r.cartes[parts[0]] = { classe: 'carte', nom: parts.slice(1).join(' ↔ ').slice(0, 500), famille: 'document', etape: [], source: 'document <cos> local' };
        else r.notes.push('carte ↔ ignorée (ID invalide) : ' + t.slice(0, 60));
        return;
      }
      var m = t.match(/^([A-Za-z][A-Za-z0-9]*|[0-9]{1,3})\s*(to|➡|→|⬅|←)\s*([a-z])?\s*([A-Za-z][A-Za-z0-9]*|[0-9]{1,3})$/);
      if (!m) { r.notes.push('forme non conforme (ni to, ni flèche, ni ↔) : ' + t.slice(0, 60)); return; }
      var sens = (m[2] === 'to') ? 'textuel' : (/⬅|←/.test(m[2]) ? 'retour' : 'aller');
      var receveur = (sens === 'retour') ? m[1] : m[4]; // pointe = receveur.
      var donneur = (sens === 'retour') ? m[4] : m[1];
      r.liens.push({ de: m[1], vers: m[4], op: m[2], modificateur: m[3] || null, sens: sens, donneur: donneur, receveur: receveur });
    });
  });
  r.ok = r.liens.length > 0 || Object.keys(r.cartes).length > 0;
  if (!r.ok) r.notes.push('aucune connexion');
  return r;
}
// Compatibilité (NOUVEAU, à confirmer ; chaque cas est ancré au projet) :
// BLM→BLM si vers.depend contient de (catalogue) ; BLM↔famille si membre
// (catalogue) ; famille→famille si phases S adjacentes (plan-v1 S1→…→S6) ;
// langue→BLM si famille cible langue|philosophie|registre (catalogue) ;
// pattern→BLM si pattern documenté pour ce BLM (table issue du code) ;
// BLM→parametre si BLM le produit (catalogue Produit:) ; parametre→BLM :
// JAMAIS (le paramètre ne commande pas, il borne — 005/099).
var LANGUE_FAMILLES = ['langue', 'philosophie', 'registre'];
var PATTERN_BLMS = { '019': ['BLM_COMP_SALUT', 'BLM_COMP_ETAT', 'BLM_COMP_CAUSE', 'BLM_COMP_TEMPS', 'BLM_COMP_ADIEU', 'BLM_COMP_IMPERATIFS', 'BLM_COMP_POSITIF', 'BLM_COMP_NEGATIF'], '029': ['BLM_LAN_EN'], '079': ['BLM_DICT_FR', 'BLM_DICT_EN'], '008': ['BLM_CONS_MARQUEURS'], '012': ['BLM_FUITE_MARQUEURS'], '001': ['BLM_INJECTION_MARQUEURS'], '039': ['MARQUEURS_CORRECTION'] };
function compatible(de, vers) {
  if (!de.resolu || !vers.resolu) return { ok: false, motif: 'non-resolu' };
  var a = de.def, b = vers.def;
  if (a.classe === 'BLM' && b.classe === 'BLM' && (b.depend || []).indexOf(de.id) >= 0) return { ok: true, motif: 'depend-catalogue' };
  if (a.classe === 'famille' && b.classe === 'famille') return { ok: true, motif: 'phases-S-adjacentes-a-verifier', borne: true };
  if ((a.classe === 'BLM' && b.classe === 'famille' && a.famille === b.nom) || (a.classe === 'famille' && b.classe === 'BLM' && b.famille === a.nom)) return { ok: true, motif: 'appartenance-catalogue' };
  if (a.classe === 'langue' && b.classe === 'BLM' && LANGUE_FAMILLES.indexOf(b.famille) >= 0) return { ok: true, motif: 'famille-touche-langue' };
  if (a.classe === 'pattern' && b.classe === 'BLM' && (PATTERN_BLMS[vers.id] || []).indexOf(de.id) >= 0) return { ok: true, motif: 'pattern-documente-pour-ce-BLM' };
  if (a.classe === 'BLM' && b.classe === 'parametre' && b.produitPar === de.id) return { ok: true, motif: 'produit-catalogue' };
  return { ok: false, motif: 'classes-ou-proprietes-incompatibles' };
}
// Classement + rotation (NOUVEAUX, corrigés 2026-11-03) : la borne MAX_LIENS
// s'applique APRÈS classement, pas avant. Classement : compatibilité d'abord
// (poids : depend-catalogue 0, produit/appartenance 1, langue/pattern 2,
// phases-à-vérifier 3), puis couverture des vagues S1→S6 — tourniquet par
// vague du receveur pour qu'aucune vague (dont S5/S6) ne soit exclue par sa
// position documentaire — puis ordre documentaire (déterministe, pas d'aléa).
// Chaque lien écarté est tracé avec sa raison et son rang.
var POIDS_COMPAT = { 'depend-catalogue': 0, 'produit-catalogue': 1, 'appartenance-catalogue': 1, 'famille-touche-langue': 2, 'pattern-documente-pour-ce-BLM': 2, 'phases-S-adjacentes-a-verifier': 3 };
function vagueDeBloc(id, vagues) {
  for (var i = 0; i < (vagues || []).length; i++) {
    if ((vagues[i].blocs || []).indexOf(id) >= 0) return { nom: vagues[i].nom, idx: i };
  }
  return null;
}
function classerLiens(candidats, vagues) {
  var pq = candidats.map(function (l) {
    var v = vagueDeBloc(l.versId, vagues) || vagueDeBloc(l.deId, vagues);
    return { lien: l, poids: POIDS_COMPAT[l.detail] !== undefined ? POIDS_COMPAT[l.detail] : 4, vague: v ? v.idx : 99, vagueNom: v ? v.nom : 'hors-vague' };
  });
  pq.sort(function (a, b) { return (a.poids - b.poids) || (a.vague - b.vague) || (a.lien.ordre - b.lien.ordre); });
  var parVague = {}, ordre = [];
  pq.forEach(function (e) { ((parVague[e.vague] = parVague[e.vague] || [])).push(e); });
  var cles = Object.keys(parVague).map(Number).sort(function (a, b) { return a - b; });
  var reste = true;
  while (reste) {
    reste = false;
    cles.forEach(function (k) { if (parVague[k].length) { ordre.push(parVague[k].shift()); reste = true; } });
  }
  return ordre;
}
function liensPourEquipe(src, refBlocs, refFamilles, vagues) {
  var doc = analyser(src), dansEq = {}, i;
  (refBlocs || []).forEach(function (b) { dansEq[String(b)] = true; });
  (refFamilles || []).forEach(function (f) { dansEq['famille:' + f] = true; });
  var executes = [], signales = [];
  doc.liens.forEach(function (ln, idx) {
    var rDe = resoudreId(ln.donneur, doc.cartes), rVers = resoudreId(ln.receveur, doc.cartes);
    var base = { ordre: idx, de: ln.donneur, vers: ln.receveur, op: ln.op, sens: ln.sens, donneur: ln.donneur, receveur: ln.receveur };
    if (ln.modificateur) { base.statut = 'modificateur-inconnu'; base.detail = '« ' + ln.modificateur + ' » non défini : lien non exécuté'; signales.push(base); return; }
    if (!rDe.resolu) { base.statut = 'non-resolu'; base.detail = rDe.manque; signales.push(base); return; }
    if (!rVers.resolu) { base.statut = 'non-resolu'; base.detail = rVers.manque; signales.push(base); return; }
    var c = compatible(rDe, rVers);
    if (!c.ok) { base.statut = 'incompatible'; base.detail = c.motif; signales.push(base); return; }
    var cleDe = rDe.def.classe === 'famille' ? 'famille:' + rDe.def.nom : rDe.id;
    var cleVers = rVers.def.classe === 'famille' ? 'famille:' + rVers.def.nom : rVers.id;
    if (!dansEq[cleDe] || !dansEq[cleVers]) { base.statut = 'hors-equipe'; base.detail = 'extrémités non mobilisées'; signales.push(base); return; }
    base.statut = 'candidat'; base.detail = c.motif; base.classes = rDe.def.classe + '→' + rVers.def.classe;
    base.deId = (rDe.def.classe === 'BLM') ? rDe.id : null; base.versId = (rVers.def.classe === 'BLM') ? rVers.id : null;
    base.famDe = (rDe.def.classe === 'famille') ? rDe.def.nom : (rDe.def.famille || null);
    executes.push(base);
  });
  var classes = classerLiens(executes, vagues);
  var retenus = classes.slice(0, MAX_LIENS).map(function (e, rang) {
    e.lien.statut = 'execute'; e.lien.rang = rang + 1; e.lien.vague = e.vagueNom; e.lien.poidsCompat = e.poids;
    e.lien.detail = e.lien.detail + ' (rang ' + (rang + 1) + ', ' + e.vagueNom + ')';
    return e.lien;
  });
  classes.slice(MAX_LIENS).forEach(function (e, k) {
    signales.push({ statut: 'borne-depassee', ordre: e.lien.ordre, de: e.lien.de, vers: e.lien.vers, op: e.lien.op, sens: e.lien.sens, donneur: e.lien.donneur, receveur: e.lien.receveur, detail: 'rang ' + (MAX_LIENS + k + 1) + ' après classement (' + e.lien.detail + ', ' + e.vagueNom + ') : au-delà de MAX_LIENS=' + MAX_LIENS + ', à confirmer' });
  });
  return { ok: true, executes: retenus, signales: signales, notes: doc.notes };
}
module.exports = { ID_RE: ID_RE, MAX_LIENS: MAX_LIENS, analyser: analyser, resoudreId: resoudreId, compatible: compatible, liensPourEquipe: liensPourEquipe, PATTERN_BLMS: PATTERN_BLMS, LANGUE_FAMILLES: LANGUE_FAMILLES };
