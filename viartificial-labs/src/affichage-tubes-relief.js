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

  // ---------- Compter les unités de progression (graphèmes visibles) ----------
  function compterUnites(texte) {
    // Compte les graphèmes visibles comme des unités (accents, emojis composés = 1 unité)
    var unites = [];
    var i = 0;
    while (i < texte.length) {
      var char = texte.charAt(i);
      // Vérifier si c'est un emoji composé (surrogate pair)
      if (i + 1 < texte.length && texte.charCodeAt(i) >= 0xD800 && texte.charCodeAt(i) <= 0xDBFF) {
        unites.push(texte.substring(i, i + 2));
        i += 2;
      } else if (char === ' ' || char === '\\t' || char === '\\n' || char === '\\r') {
        // Espace/tab/retour = 1 unité de progression (crée le bon espacement)
        unites.push(char);
        i++;
      } else {
        unites.push(char);
        i++;
      }
    }
    return unites;
  }

  // ---------- Affichage progressif ----------
  function afficherProgressif(container, texte, options) {
    var opts = options || {};
    var vitesse = opts.vitesse || 15; // ms par caractère
    var onTermine = opts.onTermine || null;
    var animer = !REDUCED_MOTION && opts.animer !== false;
    var onProgression = opts.onProgression || null;

    if (!container || !texte) return;

    // Vider le container
    container.textContent = '';

    // Créer la barre de progression sémantique
    var barreSemantique = document.createElement('div');
    barreSemantique.className = 'via-barre-semantique';
    barreSemantique.style.cssText = 'position:relative;width:100%;height:4px;background:rgba(184,77,255,.15);border-radius:2px;margin:4px 0 8px 0;overflow:hidden;';
    var progressSemantique = document.createElement('div');
    progressSemantique.style.cssText = 'height:100%;width:0%;background:linear-gradient(90deg,#b87333,#ffd700,#c0c0c0,#b84dff);border-radius:2px;transition:width 0.15s ease;box-shadow:0 0 8px rgba(255,215,0,.4);';
    barreSemantique.appendChild(progressSemantique);
    var texteProgression = document.createElement('span');
    texteProgression.style.cssText = 'position:absolute;right:4px;top:-14px;font-size:0.65rem;color:#ffd700;font-weight:700;';
    texteProgression.textContent = '0%';
    barreSemantique.appendChild(texteProgression);
    container.appendChild(barreSemantique);

    // Créer le conteneur de tubes
    var tubeContainer = document.createElement('span');
    tubeContainer.className = 'via-tube-container';
    container.appendChild(tubeContainer);

    // Parser le texte en unités de progression (graphèmes visibles)
    var unites = compterUnites(texte);
    var totalUnites = unites.length;
    var unitesTerminees = 0;

    // Afficher unité par unité
    var i = 0;
    var interval = setInterval(function () {
      var stepStart = performance.now();
      if (i < unites.length) {
        var unite = unites[i];
        var span = document.createElement('span');
        span.className = 'via-tube-char';
        span.textContent = unite;

        // Catégoriser
        var cat = categoriserChar(unite, texte.slice(0, i));
        span.style.color = CATEGORIES_COULEURS[cat] || CATEGORIES_COULEURS.defaut;

        // Vérifier si c'est un mot-clé
        var estMotCle = false;
        var motsCles = detecterMotsCles(texte);
        motsCles.forEach(function (mc) {
          var start = texte.indexOf(mc);
          if (start >= 0 && i >= start && i < start + mc.length) {
            estMotCle = true;
          }
        });
        if (estMotCle) {
          span.classList.add('mot-cle');
          if (animer && Math.random() > 0.7) {
            creerSplashMatiere(tubeContainer, span);
          }
        }

        // Animation décorative : anneau extensible
        if (animer && unite.trim() && Math.random() > 0.85) {
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

        // Mettre à jour la progression
        unitesTerminees++;
        var pct = (unitesTerminees / totalUnites) * 100;
        progressSemantique.style.width = pct + '%';
        texteProgression.textContent = Math.round(pct) + '%';

        // Callback de progression
        if (onProgression) onProgression(pct, unite);

        // Vérifier le temps d'étape (objectif ≤6ms)
        var stepTime = performance.now() - stepStart;
        if (stepTime > 6 && animer) {
          animer = false;
        }

        i++;
      } else {
        clearInterval(interval);
        // S'assurer que la progression est à 100%
        progressSemantique.style.width = '100%';
        texteProgression.textContent = '100%';
        if (onTermine) onTermine();
      }
    }, vitesse);

    // Céder le contrôle au navigateur
    if (animer) {
      requestAnimationFrame(function () {});
    }

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