// src/barre-progression-alchimique.js — Barre de progression alchimique pour la génération de contenu.
// Style design alchimique : or, argent, cuivre, transmutations, symboles alchimiques.
// Progression 0% → 100% avec animation fluide et synchronisée au fil du traitement.
'use strict';
(function (global) {
  var SYMBOLES_ALCHIMIQUES = ['☿', '♃', '♀', '♂', '♄', '☉', '☽', '♁', '⊕', '⊗'];
  var COULEURS_ALCHIMIQUES = {
    or: '#ffd700',
    argent: '#c0c0c0',
    cuivre: '#b87333',
    mercure: '#e8e8e8',
    soufre: '#ffff00',
    sel: '#ffffff'
  };

  // ---------- Création de la barre ----------
  function creerBarre(container, options) {
    var opts = options || {};
    var barre = document.createElement('div');
    barre.className = 'via-barre-alchimique';
    barre.style.cssText = 'position:relative;width:100%;height:24px;background:linear-gradient(90deg,#1a1a2e,#2a1a4e);border:1px solid rgba(184,77,255,.4);border-radius:12px;overflow:hidden;margin:8px 0;';

    // Fond alchimique
    var fond = document.createElement('div');
    fond.className = 'via-barre-fond';
    fond.style.cssText = 'position:absolute;inset:0;background:repeating-linear-gradient(45deg,transparent,transparent 4px,rgba(184,77,255,.05) 4px,rgba(184,77,255,.05) 8px);';
    barre.appendChild(fond);

    // Barre de progression
    var progress = document.createElement('div');
    progress.className = 'via-barre-progress';
    progress.style.cssText = 'position:absolute;top:0;left:0;height:100%;width:0%;background:linear-gradient(90deg,#b87333,#ffd700,#c0c0c0,#b84dff);border-radius:12px;transition:width 0.3s ease;box-shadow:0 0 12px rgba(255,215,0,.6),inset 0 0 8px rgba(255,255,255,.3);';
    barre.appendChild(progress);

    // Symbole alchimique animé
    var symbole = document.createElement('span');
    symbole.className = 'via-barre-symbole';
    symbole.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:1.2rem;color:#ffd700;text-shadow:0 0 8px rgba(255,215,0,.8);pointer-events:none;transition:opacity 0.3s;';
    symbole.textContent = SYMBOLES_ALCHIMIQUES[0];
    barre.appendChild(symbole);

    // Texte de progression
    var texte = document.createElement('span');
    texte.className = 'via-barre-texte';
    texte.style.cssText = 'position:absolute;top:50%;right:8px;transform:translateY(-50%);font-size:0.75rem;color:#fff;font-weight:700;text-shadow:0 0 4px rgba(0,0,0,.8);';
    texte.textContent = '0%';
    barre.appendChild(texte);

    // Particules alchimiques
    var particules = document.createElement('div');
    particules.className = 'via-barre-particules';
    particules.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
    barre.appendChild(particules);

    if (container) container.appendChild(barre);

    // État interne
    var etat = { progression: 0, symboleIndex: 0, interval: null, particulesInterval: null };

    // ---------- Mise à jour de la progression ----------
    function setProgression(pct) {
      pct = Math.max(0, Math.min(100, pct));
      etat.progression = pct;
      progress.style.width = pct + '%';
      texte.textContent = Math.round(pct) + '%';
      // Changer le symbole selon la progression
      var idx = Math.floor((pct / 100) * (SYMBOLES_ALCHIMIQUES.length - 1));
      symbole.textContent = SYMBOLES_ALCHIMIQUES[idx];
      // Changer la couleur selon la progression
      if (pct < 25) progress.style.background = 'linear-gradient(90deg,#b87333,#cd7f32)';
      else if (pct < 50) progress.style.background = 'linear-gradient(90deg,#cd7f32,#ffd700)';
      else if (pct < 75) progress.style.background = 'linear-gradient(90deg,#ffd700,#c0c0c0)';
      else progress.style.background = 'linear-gradient(90deg,#c0c0c0,#b84dff,#ffd700)';
      // Particules
      if (pct > 0 && pct < 100) {
        creerParticule(particules, pct);
      }
    }

    function creerParticule(container, pct) {
      var p = document.createElement('div');
      p.style.cssText = 'position:absolute;width:4px;height:4px;border-radius:50%;background:' + COULEURS_ALCHIMIQUES.or + ';left:' + (Math.random() * 100) + '%;top:' + (Math.random() * 100) + '%;opacity:0.8;pointer-events:none;';
      container.appendChild(p);
      setTimeout(function () { p.style.opacity = '0'; setTimeout(function () { p.remove(); }, 500); }, 300);
    }

    // ---------- Animation automatique ----------
    function animer(duree) {
      var d = duree || 3000;
      var debut = Date.now();
      if (etat.interval) clearInterval(etat.interval);
      etat.interval = setInterval(function () {
        var elapsed = Date.now() - debut;
        var pct = Math.min(100, (elapsed / d) * 100);
        setProgression(pct);
        if (pct >= 100) {
          clearInterval(etat.interval);
          etat.interval = null;
          // Flash final
          progress.style.boxShadow = '0 0 24px rgba(255,215,0,1),inset 0 0 12px rgba(255,255,255,.5)';
          setTimeout(function () { progress.style.boxShadow = '0 0 12px rgba(255,215,0,.6),inset 0 0 8px rgba(255,255,255,.3)'; }, 500);
        }
      }, 50);
    }

    // ---------- CSS injecté ----------
    function injecterCSS() {
      if (document.getElementById('via-barre-alchimique-css')) return;
      var style = document.createElement('style');
      style.id = 'via-barre-alchimique-css';
      style.textContent = `
        .via-barre-alchimique { position: relative; }
        .via-barre-alchimique::before {
          content: ''; position: absolute; inset: -2px;
          background: linear-gradient(90deg, #b87333, #ffd700, #c0c0c0, #b84dff, #b87333);
          background-size: 200% 100%; border-radius: 14px; z-index: -1;
          animation: alchimie-border 3s linear infinite; opacity: 0.6;
        }
        @keyframes alchimie-border { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        .via-barre-symbole { animation: alchimie-rotate 4s linear infinite; }
        @keyframes alchimie-rotate { 0% { transform: translate(-50%,-50%) rotate(0deg); } 100% { transform: translate(-50%,-50%) rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) { .via-barre-alchimique::before, .via-barre-symbole { animation: none !important; } }
      `;
      document.head.appendChild(style);
    }

    // ---------- API de la barre ----------
    var api = {
      element: barre,
      setProgression: setProgression,
      animer: animer,
      getProgression: function () { return etat.progression; },
      detruire: function () {
        if (etat.interval) clearInterval(etat.interval);
        if (etat.particulesInterval) clearInterval(etat.particulesInterval);
        barre.remove();
      }
    };

    injecterCSS();
    return api;
  }

  // ---------- API publique ----------
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { creerBarre: creerBarre, SYMBOLES_ALCHIMIQUES: SYMBOLES_ALCHIMIQUES, COULEURS_ALCHIMIQUES: COULEURS_ALCHIMIQUES };
  }
  if (typeof window !== 'undefined') {
    window.ViaBarreAlchimique = { creerBarre: creerBarre, SYMBOLES_ALCHIMIQUES: SYMBOLES_ALCHIMIQUES, COULEURS_ALCHIMIQUES: COULEURS_ALCHIMIQUES };
  }
})(typeof window !== 'undefined' ? window : global);