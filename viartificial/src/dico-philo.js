// src/dico-philo.js — these qualites / defauts / anti-defauts + synthese su/ignore.
// Verifie langue, grammaire, pertinence, repetitions, registre, coherence.
'use strict';
function fichePhilo({ qualites = [], defauts = [], antiDefauts = [] } = {}) {
  const su = qualites.map((q) => 'sait:' + q);
  const ignore = defauts.filter((d) => !antiDefauts.includes(d)).map((d) => 'ignore:' + d);
  const synthese = [...su, ...ignore].join(' ; ').slice(0, 1000);
  return { theseQualites: qualites, theseDefauts: defauts, theseAntiDefauts: antiDefauts, synthese };
}
function verifierReponse({ langueOk = true, grammaireOk = true, pertinent = true, repetition = false, registreOk = true, coherent = true } = {}) {
  const problemes = [];
  if (!langueOk) problemes.push('langue');
  if (!grammaireOk) problemes.push('grammaire');
  if (!pertinent) problemes.push('pertinence');
  if (repetition) problemes.push('repetition');
  if (!registreOk) problemes.push('registre');
  if (!coherent) problemes.push('coherence');
  return { ok: problemes.length === 0, problemes };
}
module.exports = { fichePhilo, verifierReponse };
