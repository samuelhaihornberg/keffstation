// src/blm-correction.js — corrections locales, déterministes et prudentes.
// Ne corrige QUE les fautes couvertes par une règle ou le dictionnaire local
// ci-dessous. Préserve sens, langue, ton et noms propres ; en cas de doute,
// ne corrige pas (doute:true + trace). AUCUNE donnée n'est transmise à un LLM.
'use strict';
var BLM_CORR_VERSION = 1;
var BLM_DICT_FR = { 'aujourdhui': "aujourd'hui", 'parceque': 'parce que', 'quelquechose': 'quelque chose', 'ca': 'ça' };
var BLM_DICT_FR_TITRE = { 'Ca': 'Ça' };
var BLM_DICT_EN = { 'dont': "don't", 'cant': "can't", 'wont': "won't", 'isnt': "isn't", 'doesnt': "doesn't" };
function blmTitre(mot, remplace) {
  if (/^[A-ZÀÂÄÉÈÊËÎÏÔÖÙÛÜ]/.test(mot) && mot.slice(1) === mot.slice(1).toLowerCase()) {
    return remplace.charAt(0).toUpperCase() + remplace.slice(1);
  }
  return remplace;
}
function blmCorriger(etat, texte) {
  var s = String(texte == null ? '' : texte);
  var langue = (etat && etat.langue) || null;
  var corrections = [], doute = false;
  function regle(nom, avant, apres) { corrections.push({ regle: nom, avant: avant, apres: apres }); }
  // 032 LAN-CITATIONS : les segments cités (« … », "...") sont mis en réserve
  // avant toute règle et restaurés intacts après — jamais retouchés.
  var reserves = [];
  s = s.replace(/(«[^»]*»|"[^"]*")/g, function (m) { reserves.push(m); return '\u0000' + (reserves.length - 1) + '\u0000'; });
  function restaurer(t) {
    return String(t).replace(/\u0000(\d+)\u0000/g, function (m, i) { return reserves[+i] !== undefined ? reserves[+i] : m; });
  }
  // 1) espaces : resserre les multiples, supprime l'espace avant , et .
  //    (jamais avant ? ! ; : — typographie française préservée).
  var t1 = s.replace(/[ \t]{2,}/g, ' ').replace(/ +([,.])/g, '$1').trim();
  if (t1 !== s) regle('espaces', s, t1);
  s = t1;
  // 2) dictionnaire local, seulement dans la langue détectée (avant la
  //    majuscule pour ne pas confondre un mot corrigé avec un nom propre).
  //    Sigles en capitales et noms propres suspects : jamais touchés (doute).
  function dictionnaire(dict, titreSeul) {
    return s.replace(/[A-Za-zÀ-ÿ']+/g, function (mot) {
      var bas = mot.toLowerCase();
      if (mot === mot.toUpperCase() && /[A-ZÀÂÄÉÈÊËÎÏÔÖÙÛÜ]/.test(mot)) return mot;
      var estTitre = /^[A-ZÀÂÄÉÈÊËÎÏÔÖÙÛÜ]/.test(mot);
      if (Object.prototype.hasOwnProperty.call(dict, bas)) {
        if (estTitre && !titreSeul) { doute = true; return mot; }
        return estTitre ? blmTitre(mot, dict[bas]) : dict[bas];
      }
      if (estTitre && langue === 'fr' && Object.prototype.hasOwnProperty.call(BLM_DICT_FR_TITRE, mot)) return BLM_DICT_FR_TITRE[mot];
      return mot;
    });
  }
  if (langue === 'fr') { var f = dictionnaire(BLM_DICT_FR, false); if (f !== s) { regle('dictionnaire-fr', s, f); s = f; } }
  else if (langue === 'en') { var g = dictionnaire(BLM_DICT_EN, true); if (g !== s) { regle('dictionnaire-en', s, g); s = g; } }
  // 3) majuscule initiale de phrase (ne touche pas au reste du texte).
  var m = s.match(/^([^A-Za-zÀ-ÿ]*)([a-zàâäéèêëîïôöùûüç])/);
  if (m) {
    var corr = m[1] + m[2].toUpperCase() + s.slice(m[0].length);
    regle('majuscule-initiale', s, corr); s = corr;
  }
  // 4) ponctuation finale si la phrase finit par lettre ou chiffre.
  if (/[A-Za-zÀ-ÿ0-9]$/.test(s)) { regle('ponctuation-finale', s, s + '.'); s = s + '.'; }
  // 032 : restitue les citations intactes (jamais retouchées).
  s = restaurer(s);
  return { texte: s, corrections: corrections, doute: doute };
}
module.exports = { VERSION: BLM_CORR_VERSION, corriger: blmCorriger };
