// src/synthese-ternaire.js — Synthèse ternaire multiple pour ViArtificial Labs.
// Chaque proposition/élément évalué reçoit un verdict OUI, NON ou PEUT-ÊTRE.
// PEUT-ÊTRE déclenche une clarification ciblée. Plusieurs verdicts par demande.
// Ne confond pas erreur technique avec PEUT-ÊTRE.
'use strict';
(function (global) {
  var VERDICTS = ['OUI', 'NON', 'PEUT-ETRE'];

  // ---------- Élément ternaire ----------
  function creerElementTernaire(params) {
    var p = params || {};
    return {
      id: p.id || ('elem-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6)),
      proposition: p.proposition || '',
      verdict: null, // 'OUI', 'NON', 'PEUT-ETRE'
      appuis: p.appuis || [],
      confiance: p.confiance || 0, // 0-100
      informationsManquantes: p.informationsManquantes || [],
      questionClarification: null,
      etatReel: p.etatReel || 'non-evalue', // 'repondu', 'erreur', 'indisponible', 'annule'
      ts: Date.now()
    };
  }

  // ---------- Évaluation d'un élément ----------
  function evaluerElement(element, contexte, contributions) {
    if (!element) return null;
    var ctx = contexte || {};
    var contribs = contributions || [];
    // Vérifier l'état réel du bloc/participant
    if (element.etatReel === 'erreur' || element.etatReel === 'indisponible' || element.etatReel === 'annule') {
      // Ne pas maquiller en PEUT-ETRE : conserver l'état réel
      element.verdict = null;
      element.etatReel = element.etatReel;
      return element;
    }
    // Évaluation basée sur les contributions et le contexte
    var scoreAppui = 0;
    var scoreContradiction = 0;
    element.appuis.forEach(function (a) {
      if (a.type === 'favorable') scoreAppui++;
      else if (a.type === 'defavorable') scoreContradiction++;
    });
    // Contributions disponibles
    var contribsDisponibles = contribs.filter(function (c) { return c.etat === 'repondu' && c.contribution; });
    if (contribsDisponibles.length === 0 && contribs.length > 0) {
      // Aucune contribution disponible mais des participants sollicités → PEUT-ETRE
      element.verdict = 'PEUT-ETRE';
      element.informationsManquantes = ['aucune contribution disponible'];
      element.questionClarification = 'Pouvez-vous préciser votre demande ?';
      element.confiance = 20;
      return element;
    }
    if (scoreAppui > scoreContradiction && scoreAppui > 0) {
      element.verdict = 'OUI';
      element.confiance = Math.min(100, 50 + scoreAppui * 10);
    } else if (scoreContradiction > scoreAppui && scoreContradiction > 0) {
      element.verdict = 'NON';
      element.confiance = Math.min(100, 50 + scoreContradiction * 10);
    } else if (element.informationsManquantes.length > 0) {
      element.verdict = 'PEUT-ETRE';
      element.confiance = Math.max(10, 50 - element.informationsManquantes.length * 10);
      element.questionClarification = genererQuestionClarification(element);
    } else {
      // Pas assez d'information → PEUT-ETRE
      element.verdict = 'PEUT-ETRE';
      element.confiance = 30;
      element.questionClarification = genererQuestionClarification(element);
    }
    return element;
  }

  function genererQuestionClarification(element) {
    if (element.informationsManquantes.length > 0) {
      return 'Pourriez-vous préciser : ' + element.informationsManquantes.join(', ') + ' ?';
    }
    return 'Pouvez-vous préciser votre demande ?';
  }

  // ---------- Synthèse ternaire multiple ----------
  // Une demande peut contenir plusieurs éléments avec des verdicts différents
  function syntheseTernaire(elements, contexte) {
    var resultats = {
      oui: [],
      non: [],
      peutEtre: [],
      erreurs: [],
      clarifications: []
    };
    (elements || []).forEach(function (el) {
      var evalue = evaluerElement(el, contexte, []);
      if (!evalue) return;
      if (evalue.etatReel === 'erreur' || evalue.etatReel === 'indisponible' || evalue.etatReel === 'annule') {
        resultats.erreurs.push(evalue);
      } else if (evalue.verdict === 'OUI') {
        resultats.oui.push(evalue);
      } else if (evalue.verdict === 'NON') {
        resultats.non.push(evalue);
      } else if (evalue.verdict === 'PEUT-ETRE') {
        resultats.peutEtre.push(evalue);
        if (evalue.questionClarification) resultats.clarifications.push(evalue.questionClarification);
      }
    });
    return resultats;
  }

  // ---------- Réévaluation après clarification ----------
  function reevaluerElement(element, reponseUtilisateur) {
    if (!element) return null;
    // Ajouter la réponse de l'utilisateur comme appui
    element.appuis.push({ type: 'favorable', source: 'utilisateur', texte: reponseUtilisateur });
    element.informationsManquantes = [];
    // Réévaluer
    return evaluerElement(element, {}, []);
  }

  // ---------- SuperBot : question de clarification ciblée ----------
  function preparerClarificationSuperBot(elementsPeutEtre, contexte) {
    var questions = [];
    (elementsPeutEtre || []).forEach(function (el) {
      if (el.questionClarification) {
        questions.push({
          elementId: el.id,
          proposition: el.proposition,
          question: el.questionClarification,
          confiance: el.confiance
        });
      }
    });
    return questions;
  }

  // ---------- API publique ----------
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VERDICTS: VERDICTS, creerElementTernaire: creerElementTernaire, evaluerElement: evaluerElement, syntheseTernaire: syntheseTernaire, reevaluerElement: reevaluerElement, preparerClarificationSuperBot: preparerClarificationSuperBot };
  }
  if (typeof window !== 'undefined') {
    window.ViaSyntheseTernaire = { VERDICTS: VERDICTS, creerElementTernaire: creerElementTernaire, evaluerElement: evaluerElement, syntheseTernaire: syntheseTernaire, reevaluerElement: reevaluerElement, preparerClarificationSuperBot: preparerClarificationSuperBot };
  }
})(typeof window !== "undefined" ? window : global);