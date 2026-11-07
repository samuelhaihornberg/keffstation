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
  // Script personnalisé (NOUVEAU 2026-11-07) : une balise <script_…> est un
  // nœud local typé, pas un ID du registre. Elle reste résolue dans le document.
  if (cartes && cartes[brut] && cartes[brut].classe === 'script') return { resolu: true, id: brut, def: cartes[brut], script: true };
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
// ---------------------------------------------------------------------------
// CSS alphanumérique (NOUVEAU 2026-11-07, à confirmer) : un bloc
// <script_Alphanumerotation(aconnecter)>…</script_Alphanumerotation(aconnecter)>
// peut vivre dans <cos> ou dans <co>. Son contenu est du CSS réel (règles,
// déclarations, @media). Les sélecteurs purement alphanumériques (A1, B2) sont
// des nœuds COS : ils sont appliqués à [data-cos="A1"] dans l'aperçu. Le
// runtime ne fait qu'analyser/valider : aucun CSS n'est exécuté côté serveur.
var CSS_TAG_RE = /<script_Alphanumerotation\(aconnecter\)>([\s\S]*?)<\/script_Alphanumerotation\(aconnecter\)>/gi;
var CSS_INTERDIT = /<\s*\/?\s*(script|style|iframe|object|embed|link|meta)\b|javascript\s*:|expression\s*\(|behavior\s*:|-moz-binding|@import\b/i;
function normaliserSelecteurCss(sel) {
  return String(sel || '').split(',').map(function (s) {
    var t = s.trim();
    if (/^[A-Za-z][A-Za-z0-9]*$/.test(t)) return '[data-cos="' + t + '"]';
    return t;
  }).join(', ');
}
function analyserDeclarationsCss(corps) {
  var declarations = [], erreurs = [];
  String(corps || '').split(';').forEach(function (m) {
    var t = m.trim();
    if (!t) return;
    var idx = t.indexOf(':');
    if (idx < 0) { erreurs.push('déclaration sans « : » : ' + t.slice(0, 40)); return; }
    var prop = t.slice(0, idx).trim(), val = t.slice(idx + 1).trim();
    if (!/^--?[A-Za-z][\w-]*$/.test(prop) && !/^[A-Za-z][\w-]*$/.test(prop)) {
      erreurs.push('propriété invalide : ' + prop.slice(0, 40)); return;
    }
    if (!val) { erreurs.push('valeur vide pour ' + prop); return; }
    declarations.push({ propriete: prop, valeur: val });
  });
  return { declarations: declarations, erreurs: erreurs };
}
function analyserCss(source) {
  var src = String(source || '').trim();
  var out = { ok: false, source: src, rules: [], erreurs: [] };
  if (!src) { out.erreurs.push('CSS vide'); return out; }
  if (CSS_INTERDIT.test(src)) { out.erreurs.push('construction CSS interdite (script/import/expression)'); return out; }
  var s = src.replace(/\/\*[\s\S]*?\*\//g, '');
  var i = 0, n = s.length;
  function parseBloc(finAttendue, normaliser) {
    var normaliserSelecteurs = normaliser !== false;
    var rules = [];
    while (i < n) {
      while (i < n && /[\s;]/.test(s[i])) i++;
      if (i >= n) break;
      if (s[i] === '}') {
        if (finAttendue) { i++; return rules; }
        out.erreurs.push('accolade fermante sans ouvrante'); i++; continue;
      }
      var debut = i, paren = 0, brace = -1;
      for (; i < n; i++) {
        var ch = s[i];
        if (ch === '(') paren++;
        else if (ch === ')') paren = Math.max(0, paren - 1);
        else if (ch === '{' && paren === 0) { brace = i; break; }
        else if (ch === '}' && paren === 0) break;
      }
      if (brace < 0) {
        var reste = s.slice(debut, i).trim();
        if (reste) out.erreurs.push('règle sans bloc : ' + reste.slice(0, 40));
        if (i < n && s[i] === '}') { if (finAttendue) { i++; return rules; } out.erreurs.push('accolade fermante sans ouvrante'); i++; }
        continue;
      }
      var selecteur = s.slice(debut, brace).trim();
      i = brace + 1;
      if (!selecteur) { out.erreurs.push('sélecteur vide'); continue; }
      if (selecteur.charAt(0) === '@') {
        var save = i, prof2 = 1, j = i;
        for (; j < n; j++) { if (s[j] === '{') prof2++; else if (s[j] === '}') { prof2--; if (prof2 === 0) break; } }
        if (j >= n) { out.erreurs.push('accolade non fermée pour ' + selecteur.slice(0, 40)); break; }
        var corpsAt = s.slice(save, j);
        if (corpsAt.indexOf('{') >= 0) {
          i = save;
          // Les sélecteurs internes de @keyframes (from/to/50%) ne sont pas
          // des nœuds COS : on ne les convertit pas en [data-cos="…"].
          var cleAt = selecteur.toLowerCase().split(/\s+/)[0];
          var normaliserEnfants = !/^@(-[a-z]+-)?keyframes$/.test(cleAt);
          var enfants = parseBloc(true, normaliserEnfants);
          rules.push({ selecteur: selecteur, selecteurApplique: selecteur, atRule: true, children: enfants, brut: s.slice(debut, i) });
        } else {
          var dAt = analyserDeclarationsCss(corpsAt);
          dAt.erreurs.forEach(function (e) { out.erreurs.push(selecteur.slice(0, 40) + ' : ' + e); });
          rules.push({ selecteur: selecteur, selecteurApplique: selecteur, atRule: true, declarations: dAt.declarations, brut: s.slice(debut, j + 1) });
          i = j + 1;
        }
        continue;
      }
      var corpsDebut = i, prof = 1;
      for (; i < n; i++) {
        if (s[i] === '{') prof++;
        else if (s[i] === '}') { prof--; if (prof === 0) break; }
      }
      if (prof !== 0) { out.erreurs.push('accolade non fermée pour ' + selecteur.slice(0, 40)); break; }
      var corps = s.slice(corpsDebut, i);
      i++;
      var d = analyserDeclarationsCss(corps);
      d.erreurs.forEach(function (e) { out.erreurs.push(selecteur.slice(0, 40) + ' : ' + e); });
      rules.push({ selecteur: selecteur, selecteurApplique: normaliserSelecteurs ? normaliserSelecteurCss(selecteur) : selecteur, declarations: d.declarations, brut: s.slice(debut, i) });
    }
    if (finAttendue) out.erreurs.push('accolade non fermée');
    return rules;
  }
  out.rules = parseBloc(false);
  out.ok = out.erreurs.length === 0 && out.rules.length > 0;
  if (!out.rules.length && !out.erreurs.length) out.erreurs.push('aucune règle CSS reconnue');
  return out;
}
function extraireCss(texte) {
  var styles = [];
  var sans = String(texte || '').replace(CSS_TAG_RE, function (_, css) {
    styles.push(String(css || ''));
    return '';
  });
  return { texte: sans, styles: styles };
}
function analyserStyles(styles) {
  return (styles || []).map(function (css) { return analyserCss(css); });
}
// ---------------------------------------------------------------------------
// Scripts personnalisés (NOUVEAU 2026-11-07, à confirmer) : les opérandes
// peuvent être des balises <script_…> au lieu d'IDs nus. Forme donnée par le
// document : <co><script_…> to <script_…></co>. Le scanner accepte la balise
// seule, la balise avec attributs (id/valeur/value/nom/name/attribut) et la
// balise avec contenu. La valeur retenue est l'attribut, sinon le contenu,
// sinon le nom de la balise. Aucun script n'est exécuté : les balises sont
// seulement des opérandes typés du graphe COS.
function extraireScripts(texte) {
  var src = String(texte || '');
  var operandes = [];
  var out = '';
  var i = 0;
  var TAG_START = '<script_';
  var NOM_RE = /[A-Za-z0-9_\-éèêëàâäôöûüçÉÈÊËÀÂÄÔÖÛÜÇ]/;
  while (i < src.length) {
    var start = src.toLowerCase().indexOf(TAG_START, i);
    if (start < 0) { out += src.slice(i); break; }
    out += src.slice(i, start);
    var finNom = start + TAG_START.length;
    while (finNom < src.length && NOM_RE.test(src.charAt(finNom))) finNom++;
    var nom = src.slice(start + TAG_START.length, finNom);
    var finTag = src.indexOf('>', finNom);
    if (finTag < 0) { out += src.slice(start); break; }
    var attrsTexte = src.slice(finNom, finTag);
    var fermant = '</script_' + nom + '>';
    var finContenu = src.toLowerCase().indexOf(fermant.toLowerCase(), finTag + 1);
    var contenu = '';
    var fin = finTag + 1;
    if (finContenu >= 0) {
      contenu = src.slice(finTag + 1, finContenu);
      fin = finContenu + fermant.length;
    }
    var attrs = {};
    String(attrsTexte).replace(/([A-Za-z0-9_:-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g, function (_, k, __, v1, v2, v3) {
      attrs[k] = v1 !== undefined ? v1 : (v2 !== undefined ? v2 : v3);
      return '';
    });
    var valeur = attrs.id || attrs.valeur || attrs.value || attrs.nom || attrs.name || attrs.attribut || contenu.trim() || nom;
    var placeholder = '__COS_SCRIPT_' + operandes.length + '__';
    operandes.push({ nom: nom, attrs: attrs, contenu: contenu.trim(), valeur: valeur, placeholder: placeholder });
    out += placeholder;
    i = fin;
  }
  return { texte: out, operandes: operandes };
}
function operandeDepuisToken(token, operandes) {
  var m = String(token || '').match(/^__COS_SCRIPT_(\d+)__$/);
  if (!m) return { token: token, id: token, script: false };
  var op = operandes[Number(m[1])] || { nom: token, valeur: token, attrs: {}, contenu: '' };
  return { token: token, id: op.valeur, script: true, nom: op.nom, attrs: op.attrs, contenu: op.contenu };
}
function carteScript(op) {
  return { classe: 'script', nom: op.nom, famille: 'document', etape: [], source: 'script personnalisé <co>', attrs: op.attrs, contenu: op.contenu };
}
// Analyse un document <cos> : ordre documentaire conservé (rotation).
// Sortie : {ok, cartes, liens[{de,vers,op,sens,donneur,receveur,description}], notes[]}.
function analyser(src) {
  var r = { ok: false, cartes: {}, liens: [], styles: [], notes: [], blocs: 0 };
  var s = String(src || '').replace(/<!--[\s\S]*?-->/g, '').replace(/[︎\uFE0E\uFE0F]/g, '');
  var blocs = s.match(/<cos[^>]*>([\s\S]*?)<\/cos>/g) || [];
  r.blocs = blocs.length;
  if (!blocs.length) { r.notes.push('aucun bloc <cos>…</cos>'); return r; }
  blocs.forEach(function (b) {
    var inners = b.match(/<co[^>]*>([\s\S]*?)<\/co>/g) || [];
    inners.forEach(function (c) {
      var inner = c.replace(/<\/?co[^>]*>/g, '');
      var exCss = extraireCss(inner);
      var exScripts = extraireScripts(exCss.texte);
      var t = exScripts.texte.trim();
      var css = analyserStyles(exCss.styles);
      if (!t) {
        css.forEach(function (x) { r.styles.push(x); });
        return;
      }
      if (/↔/.test(t)) { // DESCRIPTION (co-cos-commun), jamais traversable.
        var parts = t.split('↔').map(function (x) { return x.trim(); });
        if (ID_RE.test(parts[0])) r.cartes[parts[0]] = { classe: 'carte', nom: parts.slice(1).join(' ↔ ').slice(0, 500), famille: 'document', etape: [], source: 'document <cos> local' };
        else r.notes.push('carte ↔ ignorée (ID invalide) : ' + t.slice(0, 60));
        css.forEach(function (x) { r.styles.push(x); });
        return;
      }
      var m = t.match(/^([A-Za-z][A-Za-z0-9]*|[0-9]{1,3}|__COS_SCRIPT_\d+__)\s*(to|➡|→|⬅|←)\s*([a-z])?\s*([A-Za-z][A-Za-z0-9]*|[0-9]{1,3}|__COS_SCRIPT_\d+__)$/);
      if (!m) { r.notes.push('forme non conforme (ni to, ni flèche, ni ↔) : ' + t.slice(0, 60)); css.forEach(function (x) { r.styles.push(x); }); return; }
      var sens = (m[2] === 'to') ? 'textuel' : (/⬅|←/.test(m[2]) ? 'retour' : 'aller');
      var opDe = operandeDepuisToken(m[1], exScripts.operandes);
      var opVers = operandeDepuisToken(m[4], exScripts.operandes);
      var receveurOp = (sens === 'retour') ? opDe : opVers; // pointe = receveur.
      var donneurOp = (sens === 'retour') ? opVers : opDe;
      var lien = { de: opDe.id, vers: opVers.id, op: m[2], modificateur: m[3] || null, sens: sens, donneur: donneurOp.id, receveur: receveurOp.id };
      if (opDe.script || opVers.script) { lien.script = true; lien.operandes = { de: opDe, vers: opVers }; }
      // Les opérandes <script_…> deviennent des cartes locales du document :
      // elles sont déclarées même si un autre lien les référence avant leur
      // balise (l'ordre documentaire reste celui des liens, pas des cartes).
      [opDe, opVers].forEach(function (op) {
        if (!op.script) return;
        if (r.cartes[op.id] && r.cartes[op.id].classe !== 'script') r.notes.push('ID de script « ' + op.id + ' » remplace une carte locale du même ID');
        r.cartes[op.id] = carteScript(op);
      });
      if (css.length) lien.css = css;
      css.forEach(function (x) { r.styles.push(x); });
      r.liens.push(lien);
    });
    // CSS hors <co> mais dans <cos> : feuille du groupe.
    var sansCo = b.replace(/<co[^>]*>([\s\S]*?)<\/co>/g, '');
    var exBloc = extraireCss(sansCo);
    analyserStyles(exBloc.styles).forEach(function (x) { r.styles.push(x); });
  });
  r.ok = r.liens.length > 0 || Object.keys(r.cartes).length > 0 || r.styles.length > 0;
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
  // Script personnalisé : la compatibilité est portée par le document local,
  // pas par le catalogue BLM. Le lien reste traçable, jamais exécuté ici.
  if (a.classe === 'script' || b.classe === 'script') return { ok: true, motif: 'script-personnalise' };
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
    // Les opérandes <script_…> sont des cartes locales du document : on les
    // enregistre avant résolution, sans les confondre avec les BLM du registre.
    if (ln.operandes) {
      ['de', 'vers'].forEach(function (cote) {
        var op = ln.operandes[cote];
        if (op && op.script && !doc.cartes[op.id]) doc.cartes[op.id] = carteScript(op);
      });
    }
    var rDe = resoudreId(ln.donneur, doc.cartes), rVers = resoudreId(ln.receveur, doc.cartes);
    var base = { ordre: idx, de: ln.donneur, vers: ln.receveur, op: ln.op, sens: ln.sens, donneur: ln.donneur, receveur: ln.receveur };
    if (ln.modificateur) { base.statut = 'modificateur-inconnu'; base.detail = '« ' + ln.modificateur + ' » non défini : lien non exécuté'; signales.push(base); return; }
    if (!rDe.resolu) { base.statut = 'non-resolu'; base.detail = rDe.manque; signales.push(base); return; }
    if (!rVers.resolu) { base.statut = 'non-resolu'; base.detail = rVers.manque; signales.push(base); return; }
    var c = compatible(rDe, rVers);
    if (!c.ok) { base.statut = 'incompatible'; base.detail = c.motif; signales.push(base); return; }
    var cleDe = rDe.def.classe === 'famille' ? 'famille:' + rDe.def.nom : rDe.id;
    var cleVers = rVers.def.classe === 'famille' ? 'famille:' + rVers.def.nom : rVers.id;
    // Script personnalisé (NOUVEAU 2026-11-07, à confirmer) : les opérandes
    // <script_…> sont locaux au document, donc mobilisés par le document lui-
    // même ; la liste d'équipe ne s'applique qu'aux nœuds du registre.
    var local = (rDe.def.classe === 'script' || rVers.def.classe === 'script');
    if (!local && (!dansEq[cleDe] || !dansEq[cleVers])) { base.statut = 'hors-equipe'; base.detail = 'extrémités non mobilisées'; signales.push(base); return; }
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
  return { ok: true, executes: retenus, signales: signales, notes: doc.notes, styles: doc.styles, blocs: doc.blocs };
}
module.exports = {
  ID_RE: ID_RE, MAX_LIENS: MAX_LIENS, analyser: analyser, resoudreId: resoudreId,
  compatible: compatible, liensPourEquipe: liensPourEquipe,
  normaliserSelecteurCss: normaliserSelecteurCss, analyserDeclarationsCss: analyserDeclarationsCss,
  analyserCss: analyserCss, extraireCss: extraireCss, analyserStyles: analyserStyles,
  extraireScripts: extraireScripts, operandeDepuisToken: operandeDepuisToken,
  PATTERN_BLMS: PATTERN_BLMS, LANGUE_FAMILLES: LANGUE_FAMILLES
};
