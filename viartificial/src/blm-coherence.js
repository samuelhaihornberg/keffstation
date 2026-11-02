// src/blm-coherence.js — compare l'intention et le contexte de l'EtatMessage
// à la réponse produite. Ne touche jamais au LLM, ne modifie ni l'intention
// (jamais inventée) ni la réponse : retourne un verdict explicable et des
// redemandes structurées. La reformulation éventuelle reste au point de
// vérification existant (repli terminal, une seule tentative).
'use strict';
var BLM_COH_SALUT = /^(salut|bonjour|bonsoir|coucou|hello|yo|hey)\b/i;
var BLM_COH_ADIEU = /(au revoir|adieu|bonne nuit|bonne soirée|à plus|\bbye\b)/i;
// « à bientôt » seul n'est PAS un adieu : c'est une promesse de revoir,
// ambiguë hors formule explicite de départ.
function blmIndicesAdieu(texte) {
  var t = String(texte || '').trim();
  return { salutation: BLM_COH_SALUT.test(t), adieu: BLM_COH_ADIEU.test(t) };
}
function blmAnalyserCoherence(etat, reponse) {
  var s = String(reponse || '').trim();
  var res = { verdict: 'non-evalue', motifs: [], redemandes: [], indices: blmIndicesAdieu((etat && etat.texte) || '') };
  if (res.indices.salutation && res.indices.adieu) {
    res.verdict = 'doute';
    res.motifs.push('indices-mixtes-salutation-adieu');
    res.redemandes.push({ demande: 'analyse', bloc: 'comprehension', motif: 'formule mixte : ni clôture auto ni relecture forcée', tentative: 1 });
    return res;
  }
  var intention = etat && etat.intention;
  if (!intention) return res; // jamais d'intention inventée
  if (intention === 'salutation') {
    var aSalue = /salut|bonjour|coucou|hello|bonsoir/i.test(s);
    var relance = /\?\s*$/.test(s);
    // Bref sans présupposition accepté pour un simple « Salut » (120 =
    // heuristique non validée ; voir verifierFinaleBLM) ; sinon relance exigée.
    var bref = (etat && etat.demandeType === 'salutation-simple') && String(s).length <= 120 && !/ça va bien|et toi|\bvous\b/i.test(s);
    if (!s) { res.verdict = 'incoherent'; res.motifs.push('reponse-vide'); }
    else if (!aSalue || (!relance && !bref)) {
      res.verdict = 'incoherent';
      res.motifs.push(!aSalue ? 'salutation-absente' : 'relance-absente');
      res.redemandes.push({ demande: 'modele-verifie', bloc: 'formulation', motif: 'réponse hors-sujet à une salutation', tentative: 1 });
    } else res.verdict = 'coherent';
    return res;
  }
  if (intention === 'question') {
    if (!s) {
      res.verdict = 'incoherent'; res.motifs.push('reponse-vide');
      res.redemandes.push({ demande: 'modele-verifie', bloc: 'formulation', motif: 'question sans réponse', tentative: 1 });
    } else res.verdict = 'coherent';
    return res;
  }
  res.verdict = 'coherent'; res.motifs.push('message-libre');
  return res;
}
module.exports = { VERSION: 1, indicesAdieu: blmIndicesAdieu, analyser: blmAnalyserCoherence };
