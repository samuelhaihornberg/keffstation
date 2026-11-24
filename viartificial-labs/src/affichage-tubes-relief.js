// src/affichage-tubes-relief.js — Affichage progressif en tubes en relief alchimique.
// Le texte est le contenu principal (HTML accessible, sélectionnable).
// Les tubes/anneaux sont décoratifs et ne retardent jamais l'affichage.
// Révélation progressive caractère par caractère, préservation des espaces/retours/tab.
// Splash de matière (pâte à modeler/slime) après ouverture du tube.
'use strict';
(function (global) {
  var REDUCED_MOTION = false;
  try { REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  // ---------- Catégories sémantiques et couleurs ----------
  var CATEGORIES_COULEURS = {
    salutation: '#ffd700',   // or
    question: '#00d4ff',     // cyan
    affirmation: '#27d17f',  // vert
    negation: '#ff4d6d',     // rouge
    concept: '#b84dff',      // violet
    action: '#ff8c00',       // orange
    defaut: '#e0e0e0'        // blanc
  };

  // ---------- Injection CSS ----------
  function injecterCSS() {
    if (document.getElementById('via-tubes-relief-css')) return;
    var style = document.createElement('style');
    style.id = 'via-tubes-relief-css';
    style.textContent = `
      .via-tube-container {
        position: relative;
        display: inline;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        color: inherit;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      .via-tube-char {
        display: inline;
        position: relative;
        opacity: 0;
        transform: translateY(4px);
        transition: opacity 0.15s ease, transform 0.15s ease;
        text-shadow: 0 0 8px rgba(255,255,255,0.6), 0 0 2px rgba(255,255,255,0.9);
      }
      .via-tube-char.revele {
        opacity: 1;
        transform: translateY(0);
      }
      .via-tube-char.mot-cle {
        font-weight: 700;
        text-shadow: 0 0 12px rgba(255,215,0,0.9), 0 0 4px rgba(255,255,255,1);
      }
      .via-tube-table {
        border-collapse: collapse;
        margin: 8px 0;
        width: 100%;
      }
      .via-tube-table th, .via-tube-table td {
        border: 1px solid rgba(184,77,255,.3);
        padding: 6px 10px;
        text-align: left;
      }
      .via-tube-table th {
        background: rgba(184,77,255,.15);
        font-weight: 700;
      }
      /* Animation des tubes en relief (décorative) */
      .via-tube-anneau {
        display: inline-block;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,215,0,0.8), rgba(184,77,255,0.4), transparent);
        animation: tube-deploiement 0.3s ease-out forwards;
        vertical-align: middle;
        margin: 0 1px;
      }
      @keyframes tube-deploiement {
        0% { width: 0; height: 0; opacity: 0; }
        50% { width: 8px; height: 8px; opacity: 0.8; }
        100% { width: 0; height: 0; opacity: 0; }
      }
      /* Splash de matière (pâte à modeler/slime) */
      .via-matiere-splash {
        position: absolute;
        pointer-events: none;
        border-radius: 50%;
        opacity: 0;
        animation: matiere-splash 1.2s ease-out forwards;
      }
      @keyframes matiere-splash {
        0% { transform: scale(0); opacity: 0.8; }
        30% { transform: scale(1.2); opacity: 0.6; }
        60% { transform: scale(0.9); opacity: 0.4; }
        100% { transform: scale(1.5); opacity: 0; }
      }
      .via-matiere-filament {
        position: absolute;
        pointer-events: none;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(255,215,0,0.6), transparent);
        animation: matiere-filament 0.8s ease-out forwards;
      }
      @keyframes matiere-filament {
        0% { width: 0; opacity: 0.8; }
        50% { width: 40px; opacity: 0.6; }
        100% { width: 0; opacity: 0; }
      }
      /* Réduction des animations */
      @media (prefers-reduced-motion: reduce) {
        .via-tube-char { transition: none !important; opacity: 1 !important; transform: none !important; }
        .via-tube-anneau { animation: none !important; display: none !important; }
        .via-matiere-splash, .via-matiere-filament { animation: none !important; display: none !important; }
      }
    `;
    document.head.appendChild(style);
  }

  // ---------- Détecter les mots-clés ----------
  function detecterMotsCles(texte) {
    var motsCles = ['ViA', 'SuperBot', 'BLLM', 'KEF', 'ViArtificial', 'Guideoplan', 'GoleMotor', 'KeffStation'];
    var trouves = [];
    motsCles.forEach(function (mc) {
      if (texte.indexOf(mc) >= 0) trouves.push(mc);
    });
    return trouves;
  }

  // ---------- Catégoriser un caractère ----------
  function categoriserChar(char, contexte) {
    if (/[?]/.test(char)) return 'question';
    if (/[.!]/.test(char)) return 'affirmation';
    if (/[A-Z]/.test(char)) return 'concept';
    return 'defaut';
  }

  // ---------- Affichage progressif ----------
  function afficherProgressif(container, texte, options) {
    var opts = options || {};
    var vitesse = opts.vitesse || 15; // ms par caractère
    var onTermine = opts.onTermine || null;
    var animer = !REDUCED_MOTION && opts.animer !== false;

    if (!container || !texte) return;

    // Vider le container
    container.textContent = '';

    // Créer le conteneur de tubes
    var tubeContainer = document.createElement('span');
    tubeContainer.className = 'via-tube-container';
    container.appendChild(tubeContainer);

    // Parser le texte en préservant les espaces, retours à la ligne et tabulations
    var chars = [];
    for (var i = 0; i < texte.length; i++) {
      chars.push(texte.charAt(i));
    }

    // Détecter les mots-clés
    var motsCles = detecterMotsCles(texte);

    // Afficher caractère par caractère
    var i = 0;
    var interval = setInterval(function () {
      if (i < chars.length) {
        var char = chars[i];
        var span = document.createElement('span');
        span.className = 'via-tube-char';
        span.textContent = char;

        // Catégoriser
        var cat = categoriserChar(char, texte.slice(0, i));
        span.style.color = CATEGORIES_COULEURS[cat] || CATEGORIES_COULEURS.defaut;

        // Vérifier si c'est un mot-clé
        var estMotCle = false;
        motsCles.forEach(function (mc) {
          var start = texte.indexOf(mc);
          if (start >= 0 && i >= start && i < start + mc.length) {
            estMotCle = true;
          }
        });
        if (estMotCle) {
          span.classList.add('mot-cle');
          // Splash de matière sur les mots-clés
          if (animer && Math.random() > 0.7) {
            creerSplashMatiere(tubeContainer, span);
          }
        }

        // Animation décorative : anneau extensible
        if (animer && char.trim() && Math.random() > 0.85) {
          var anneau = document.createElement('span');
          anneau.className = 'via-tube-anneau';
          tubeContainer.appendChild(anneau);
          setTimeout(function () { anneau.remove(); }, 300);
        }

        tubeContainer.appendChild(span);

        // Révéler le caractère
        if (animer) {
          requestAnimationFrame(function () {
            span.classList.add('revele');
          });
        } else {
          span.classList.add('revele');
          span.style.opacity = '1';
          span.style.transform = 'none';
        }

        i++;
      } else {
        clearInterval(interval);
        if (onTermine) onTermine();
      }
    }, vitesse);

    return interval;
  }

  // ---------- Splash de matière ----------
  function creerSplashMatiere(container, refElement) {
    if (REDUCED_MOTION) return;
    var splash = document.createElement('div');
    splash.className = 'via-matiere-splash';
    var rect = refElement.getBoundingClientRect();
    var containerRect = container.getBoundingClientRect();
    splash.style.left = (rect.left - containerRect.left + rect.width / 2 - 8) + 'px';
    splash.style.top = (rect.top - containerRect.top + rect.height / 2 - 8) + 'px';
    splash.style.width = '16px';
    splash.style.height = '16px';
    var colors = [COULEURS_ALCHIMIQUES.or, COULEURS_ALCHIMIQUES.argent, COULEURS_ALCHIMIQUES.cuivre];
    splash.style.background = 'radial-gradient(circle, ' + colors[Math.floor(Math.random() * colors.length)] + ', transparent)';
    container.appendChild(splash);
    setTimeout(function () { splash.remove(); }, 1200);

    // Filament
    if (Math.random() > 0.5) {
      var filament = document.createElement('div');
      filament.className = 'via-matiere-filament';
      filament.style.left = (rect.left - containerRect.left) + 'px';
      filament.style.top = (rect.top - containerRect.top + rect.height / 2) + 'px';
      container.appendChild(filament);
      setTimeout(function () { filament.remove(); }, 800);
    }
  }

  // ---------- Affichage de tableau ----------
  function afficherTableau(container, donnees) {
    if (!container || !donnees || !donnees.length) return;
    var table = document.createElement('table');
    table.className = 'via-tube-table';
    // En-tête
    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
    Object.keys(donnees[0]).forEach(function (key) {
      var th = document.createElement('th');
      th.textContent = key;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    // Corps
    var tbody = document.createElement('tbody');
    donnees.forEach(function (row) {
      var tr = document.createElement('tr');
      Object.keys(row).forEach(function (key) {
        var td = document.createElement('td');
        td.textContent = row[key];
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.appendChild(table);
  }

  // ---------- API publique ----------
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { injecterCSS: injecterCSS, afficherProgressif: afficherProgressif, afficherTableau: afficherTableau, detecterMotsCles: detecterMotsCles, CATEGORIES_COULEURS: CATEGORIES_COULEURS, REDUCED_MOTION: REDUCED_MOTION };
  }
  if (typeof window !== 'undefined') {
    window.ViaAffichageTubes = { injecterCSS: injecterCSS, afficherProgressif: afficherProgressif, afficherTableau: afficherTableau, detecterMotsCles: detecterMotsCles, CATEGORIES_COULEURS: CATEGORIES_COULEURS, REDUCED_MOTION: REDUCED_MOTION };
  }
})(typeof window !== 'undefined' ? window : global);