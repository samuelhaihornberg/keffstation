// src/blm-journal.js — ORC-JOURNAL (006) : trace locale des états terminaux.
// localStorage clé unique 'via-journal' (convention plan v1), FIFO cap 200,
// best-effort try/catch (jamais de crash si stockage indisponible).
// Aucun texte brut ni contenu sensible : seuls bot, issue, motif, verdict et
// compteur de redemandes. Aucune synchronisation serveur (hors étape).
'use strict';
var BLM_JOURNAL_CLE = 'via-journal', BLM_JOURNAL_CAP = 200;
function lireJournal(stockage) {
  try {
    var ls = stockage || (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!ls) return [];
    var a = JSON.parse(ls.getItem(BLM_JOURNAL_CLE) || 'null');
    return Array.isArray(a) ? a : [];
  } catch (e) { return []; }
}
function ecrireJournal(entrees, stockage) {
  try {
    var ls = stockage || (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!ls) return false;
    ls.setItem(BLM_JOURNAL_CLE, JSON.stringify((entrees || []).slice(-BLM_JOURNAL_CAP)));
    return true;
  } catch (e) { return false; }
}
function consigner(issue, stockage) {
  // issue : {bot, issue:'succes'|'refus'|'erreur', motif, verdict, redemandes}
  var e = {
    at: new Date().toISOString(),
    bot: String((issue && issue.bot) || 'inconnu').slice(0, 40),
    issue: String((issue && issue.issue) || 'inconnu'),
    motif: String((issue && issue.motif) || '').slice(0, 140),
    verdict: String((issue && issue.verdict) || ''),
    redemandes: +(issue && issue.redemandes) || 0
  };
  var a = lireJournal(stockage);
  a.push(e);
  ecrireJournal(a, stockage);
  return e;
}
function effacerJournal(stockage) {
  try {
    var ls = stockage || (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!ls) return false;
    ls.removeItem(BLM_JOURNAL_CLE);
    return true;
  } catch (e) { return false; }
}
module.exports = { consigner: consigner, lire: lireJournal, ecrire: ecrireJournal, effacer: effacerJournal, CLE: BLM_JOURNAL_CLE, CAP: BLM_JOURNAL_CAP };
