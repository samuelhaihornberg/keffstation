/* Chargeur dico ViArtificial Labs : textes par bot pour le prompt systeme.
   - langues.json : tous les bots. - via/geek/theo : perimetre de chacun.
   - Fiches et references uniquement, jamais d'oeuvre integrale sous droit. */
(function (g) {
'use strict';
var CACHE = {};
function get(url) {
  if (CACHE[url]) return Promise.resolve(CACHE[url]);
  return fetch(url).then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(function (j) { CACHE[url] = j; return j; }).catch(function () { return null; });
}
function versTexte(j, max) {
  if (!j) return '';
  var s = JSON.stringify(j);
  return s.length > (max || 1200) ? s.slice(0, max || 1200) + '…' : s;
}
async function textePour(botId) {
  var b = String(botId || '').toLowerCase(), parts = [];
  var lang = await get('./dico/langues.json');
  if (lang) parts.push('Base langues (tous) : ' + versTexte(lang, 600));
  var soc = await get('./dico/sociabilite.json');
  if (soc) parts.push('Sociabilite (tous, domaine public) : ' + versTexte(soc, 1200));
  if (b === 'via') { var v = await get('./dico/via.json'); if (v) parts.push('ViA (jeunes/psy/sociabilite/mentalisme/philo/poemes) : ' + versTexte(v, 1200)); }
  if (b === 'geeko' || b === 'geekette') { var k = await get('./dico/geek.json'); if (k) parts.push('Geek (toutes langues + philo) : ' + versTexte(k, 1200)); }
  if (b === 'theo') { var t = await get('./dico/theo.json'); if (t) parts.push('Theo (philo/religieux/contes/poemes/histoire/livres/films-fiches) : ' + versTexte(t, 1500)); }
  var s = parts.join('\n');
  return s.length > 2500 ? s.slice(0, 2500) + '…' : s;
}
g.ViaDico = { textePour: textePour };
})(typeof window !== 'undefined' ? window : globalThis);