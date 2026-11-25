// src/blm-coherence-thematique.js — BLM de cohérence thématique pour ViArtificial Labs.
// Aide VIA et les Superbots à garder le fil de la conversation.
// Contrôle léger, pas un deuxième appel LLM. Ne ralentit pas la génération.
'use strict';
(function (global) {
  // ---------- État du fil de conversation ----------
  var filConversation = {
    sujetCentral: null,
    butPrincipal: null,
    sousSujets: [],
    questionsDemandees: [],
    actionsDemandees: [],
    contraintes: [],
    preferences: [],
    pointsNonResolus: [],
    historiqueSujets: []
  };

  // ---------- Analyser un message ----------
  function analyserMessage(texte, contexte) {
    var t = String(texte || '').trim();
    if (!t) return filConversation;
    var n = t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // Détecter un changement de sujet explicite
    var nouveauSujet = /^(nouveau sujet|changeons de sujet|autre chose|passons a|parlons de|je veux parler de|dis moi|explique)/i.test(t);
    if (nouveauSujet) {
      // Conserver les éléments précédents seulement s'ils restent utiles
      if (filConversation.sujetCentral) {
        filConversation.historiqueSujets.push({
          sujet: filConversation.sujetCentral,
          but: filConversation.butPrincipal,
          ts: Date.now()
        });
      }
      filConversation.sujetCentral = t.slice(0, 80);
      filConversation.butPrincipal = t;
      filConversation.sousSujets = [];
      filConversation.questionsDemandees = [];
      filConversation.actionsDemandees = [];
      filConversation.pointsNonResolus = [];
    } else if (!filConversation.sujetCentral) {
      // Premier message : initialiser
      filConversation.sujetCentral = t.slice(0, 80);
      filConversation.butPrincipal = t;
    }
    // Extraire les questions
    var questions = (t.match(/[^.!?]*\?/g) || []).map(function (q) { return q.trim(); });
    questions.forEach(function (q) {
      if (filConversation.questionsDemandees.indexOf(q) < 0) {
        filConversation.questionsDemandees.push(q);
      }
    });
    // Extraire les contraintes
    var contraintes = (t.match(/\b(sans|ne pas|pas de|maximum|minimum|au moins|seulement|uniquement)\b[^.!?]*/gi) || []);
    contraintes.forEach(function (c) {
      if (filConversation.contraintes.indexOf(c) < 0) {
        filConversation.contraintes.push(c.trim());
      }
    });
    // Sous-sujets (mots-clés longs)
    var mots = t.toLowerCase().split(/\s+/).filter(function (w) { return w.length >= 5; });
    mots.forEach(function (m) {
      if (filConversation.sousSujets.indexOf(m) < 0 && filConversation.sousSujets.length < 10) {
        filConversation.sousSujets.push(m);
      }
    });
    return filConversation;
  }

  // ---------- Vérifier la cohérence d'une réponse ----------
  function verifierCoherence(reponse, fil) {
    var f = fil || filConversation;
    var r = String(reponse || '').trim();
    if (!r) return { coherent: false, raison: 'reponse-vide', pointsManquants: f.questionsDemandees };
    // Vérifier que les questions ont été traitées
    var pointsManquants = [];
    f.questionsDemandees.forEach(function (q) {
      // Vérifier si la réponse contient des éléments de la question
      var motsQ = q.toLowerCase().split(/\s+/).filter(function (w) { return w.length >= 4; });
      var contient = motsQ.some(function (m) { return r.toLowerCase().indexOf(m) >= 0; });
      if (!contient && motsQ.length > 0) pointsManquants.push(q);
    });
    return {
      coherent: pointsManquants.length === 0,
      pointsManquants: pointsManquants,
      sujetRespecte: true, // pas de vérification stricte du sujet
      digressions: [] // pas de détection automatique de digression
    };
  }

  // ---------- Vérifier une contribution de bot (mode multi-bot) ----------
  function verifierContribution(botId, contribution, fil) {
    var f = fil || filConversation;
    var c = String(contribution || '').trim();
    if (!c) return { utile: false, raison: 'contribution-vide' };
    // Vérifier que la contribution est liée au sujet
    var motsSujet = (f.sujetCentral || '').toLowerCase().split(/\s+/).filter(function (w) { return w.length >= 4; });
    var lie = motsSujet.some(function (m) { return c.toLowerCase().indexOf(m) >= 0; });
    return { utile: true, lieAuSujet: lie, raison: lie ? 'lie' : 'potentiellement-hors-sujet' };
  }

  // ---------- Demander une précision (seulement si ambiguïté réelle) ----------
  function besoinPrecision(texte) {
    var t = String(texte || '').trim();
    // Ambiguïté réelle : message très court sans verbe ni sujet clair
    if (t.length < 5) return { besoin: true, raison: 'message-trop-court' };
    if (/^(ça|ca|quoi|hein|\?|!)$/i.test(t)) return { besoin: true, raison: 'message-ambigu' };
    return { besoin: false, raison: 'clair' };
  }

  // ---------- Réinitialiser le fil ----------
  function reinitialiser() {
    filConversation = {
      sujetCentral: null,
      butPrincipal: null,
      sousSujets: [],
      questionsDemandees: [],
      actionsDemandees: [],
      contraintes: [],
      preferences: [],
      pointsNonResolus: [],
      historiqueSujets: []
    };
  }

  // ---------- API publique ----------
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { analyserMessage: analyserMessage, verifierCoherence: verifierCoherence, verifierContribution: verifierContribution, besoinPrecision: besoinPrecision, reinitialiser: reinitialiser, getFil: function () { return filConversation; } };
  }
  if (typeof window !== 'undefined') {
    window.BlmCoherenceThematique = { analyserMessage: analyserMessage, verifierCoherence: verifierCoherence, verifierContribution: verifierContribution, besoinPrecision: besoinPrecision, reinitialiser: reinitialiser, getFil: function () { return filConversation; } };
  }
})(typeof window !== 'undefined' ? window : global);