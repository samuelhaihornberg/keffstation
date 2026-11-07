// src/bllm-connexions-dynamiques.js — Génération COS situationnelle (1 → 1000 simultanées, espace 1M+).
// Pur, sans réseau, sans LLM, déterministe (même situation -> mêmes candidates).
// Plancher 1 (jamais de parcours vide : repli statique) ; plafond 1000 actives
// simultanées (SIMULTANEES_MAX, à valider humainement) ; espace adressable 2^20
// (~1M, adresses calculées, jamais matérialisées) ; seules les actives existent.
// Les liens ROUTENT, jamais de faits : ne nourrissent jamais 111 ; éphémères
// (l\u2019appelant ne persiste rien, trace `cos/auto-*` distincte de `cos/lien-*`).
'use strict';
var PLANCHER = 1, SIMULTANEES_MAX = 1000, ESPACE = 1048576, EXAMEN_MAX = 10000;
function hachage32(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; } return h >>> 0; }
function cleSituation(sit) { var s = sit || {}; return [s.intention || '?', (s.entites || []).slice(0, 8).join(','), (s.plan || []).slice(0, 12).join(','), s.langue || '?', s.perimetre || '?'].join('|'); }
// Génère des candidates : reglesIds × facettes situationnelles, adresses 20 bits, borne EXAMEN_MAX.
function generer(situation, reglesIds) {
  var cle = cleSituation(situation), ids = reglesIds || [], out = [], vus = {};
  var facettes = ['comprendre', 'relier', 'ordonner', 'arbitrer', 'garder', 'verifier', 'corriger', 'tracer', 'rendre', 'relancer'];
  for (var i = 0; i < ids.length && out.length < EXAMEN_MAX; i++) {
    for (var f = 0; f < facettes.length && out.length < EXAMEN_MAX; f++) {
      var a = hachage32(cle + '|' + ids[i] + '|' + facettes[f]) % ESPACE;
      if (vus[a]) continue; vus[a] = 1;
      var j = hachage32(cle + '|vers|' + a) % ids.length;
      if (ids[j] === ids[i]) continue;
      out.push({ de: ids[i], vers: ids[j], facette: facettes[f], adresse: a, base: (hachage32('s|' + a) % 1000) / 1000 });
    }
  }
  return out;
}
// Active : bonus statique (registre connu) > nouveauté ; dédup ; sans cycle ; borne cap ; plancher garanti.
function activer(candidates, statiques, dejaActives, cap) {
  var max = Math.min(cap || SIMULTANEES_MAX, SIMULTANEES_MAX), acts = {}, res = [];
  var pool = (candidates || []).slice().sort(function (x, y) {
    var sx = x.base + ((statiques && statiques[x.de + ' to ' + x.vers]) ? 1 : 0);
    var sy = y.base + ((statiques && statiques[y.de + ' to ' + y.vers]) ? 1 : 0);
    return sy - sx;
  });
  for (var i = 0; i < pool.length && res.length < max; i++) {
    var c = pool[i], k = c.de + ' to ' + c.vers;
    if (c.de === c.vers || acts[k] || (dejaActives && dejaActives[k])) continue;
    acts[k] = 1; res.push({ de: c.de, vers: c.vers, facette: c.facette, adresse: c.adresse, auto: true });
  }
  if (res.length < PLANCHER) res.push({ de: '001', vers: '002', facette: 'rendre', adresse: -1, auto: false, repli: true });
  return res;
}
if (typeof module !== 'undefined' && module.exports) module.exports = { PLANCHER: PLANCHER, SIMULTANEES_MAX: SIMULTANEES_MAX, ESPACE: ESPACE, EXAMEN_MAX: EXAMEN_MAX, hachage32: hachage32, cleSituation: cleSituation, generer: generer, activer: activer };
