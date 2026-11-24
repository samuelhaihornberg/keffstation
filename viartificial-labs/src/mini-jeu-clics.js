// src/mini-jeu-clics.js — Mini-jeu de clics sur la bannière "Hello World".
// Feu d'artifice visuel + note musicale selon la position du clic.
// Jetons d'interface gagnés par les clics, avec compteur et animation.
// Indépendant du moteur conversationnel.
'use strict';
(function (global) {
  var REDUCED_MOTION = false;
  try { REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  var STORAGE_KEY = 'via-mini-jeu-jetons';
  var SON_KEY = 'via-mini-jeu-son';
  var ACTIF_KEY = 'via-mini-jeu-actif';

  // ---------- État ----------
  function getJetons() { try { return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10); } catch (e) { return 0; } }
  function setJetons(n) { try { localStorage.setItem(STORAGE_KEY, String(n)); } catch (e) {} }
  function isSonActif() { try { return localStorage.getItem(SON_KEY) !== '0'; } catch (e) { return true; } }
  function setSonActif(v) { try { localStorage.setItem(SON_KEY, v ? '1' : '0'); } catch (e) {} }
  function isActif() { try { return localStorage.getItem(ACTIF_KEY) !== '0'; } catch (e) { return true; } }
  function setActif(v) { try { localStorage.setItem(ACTIF_KEY, v ? '1' : '0'); } catch (e) {} }

  // ---------- Notes musicales ----------
  // Fréquences selon la position (haut = aigu, bas = grave, centre = référence)
  function calculerFrequence(x, y, width, height) {
    // Fréquence de base (La4 = 440Hz)
    var baseFreq = 440;
    // Y : haut = aigu (×2), bas = grave (÷2), centre = référence
    var yNorm = y / height; // 0 = haut, 1 = bas
    var freqY = baseFreq * Math.pow(2, (0.5 - yNorm) * 2); // ±2 octaves
    // X : gauche/droite modifient les qualités (timbre via harmoniques)
    var xNorm = x / width; // 0 = gauche, 1 = droite
    return { freq: freqY, xNorm: xNorm, yNorm: yNorm };
  }

  // ---------- Audio context ----------
  var audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
    }
    return audioCtx;
  }

  function jouerNote(x, y, width, height) {
    if (!isSonActif()) return;
    var ctx = getAudioCtx();
    if (!ctx) return;
    var info = calculerFrequence(x, y, width, height);
    var freq = info.freq;
    var xNorm = info.xNorm;

    // Oscillateur principal
    var osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    // Harmoniques selon X (gauche = plus de basses, droite = plus d'aigus)
    var gain = ctx.createGain();
    gain.gain.value = 0.3;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    // Filtre selon X
    var filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000 + xNorm * 4000; // gauche = sombre, droite = brillant

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);

    // Harmonique (octave supérieure) selon X
    if (xNorm > 0.5) {
      var osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.value = freq * 2;
      var gain2 = ctx.createGain();
      gain2.gain.value = 0.1;
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.3);
    }
  }

  // ---------- Feu d'artifice visuel ----------
  function creerFeuArtifice(container, x, y) {
    if (REDUCED_MOTION || !isActif()) return;
    var colors = ['#ffd700', '#ff4d6d', '#00d4ff', '#27d17f', '#b84dff', '#ff8c00', '#fff'];
    var particles = 12 + Math.floor(Math.random() * 8);
    for (var i = 0; i < particles; i++) {
      var p = document.createElement('div');
      p.className = 'via-firework-particle';
      var angle = (Math.PI * 2 * i) / particles;
      var dist = 30 + Math.random() * 40;
      var dx = Math.cos(angle) * dist;
      var dy = Math.sin(angle) * dist;
      p.style.cssText = 'position:absolute;width:4px;height:4px;border-radius:50%;background:' + colors[Math.floor(Math.random() * colors.length)] + ';left:' + x + 'px;top:' + y + 'px;pointer-events:none;z-index:9999;';
      container.appendChild(p);
      // Animation
      (function (el, dx, dy) {
        el.animate([
          { transform: 'translate(0,0)', opacity: 1 },
          { transform: 'translate(' + dx + 'px,' + dy + 'px)', opacity: 0 }
        ], { duration: 600 + Math.random() * 400, easing: 'cubic-bezier(0,0,0.2,1)' });
        setTimeout(function () { el.remove(); }, 1000);
      })(p, dx, dy);
    }
  }

  // ---------- Animation du jeton ----------
  function animerJeton(container, x, y) {
    if (REDUCED_MOTION) return;
    var jeton = document.createElement('div');
    jeton.className = 'via-jeton';
    jeton.style.cssText = 'position:absolute;left:' + x + 'px;top:' + y + 'px;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle,#ffd700,#b87333);box-shadow:0 0 12px rgba(255,215,0,.8);pointer-events:none;z-index:9999;font-size:0.7rem;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;';
    jeton.textContent = '+1';
    container.appendChild(jeton);
    jeton.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: 'translate(0,-60px) scale(0.5)', opacity: 0 }
    ], { duration: 800, easing: 'ease-out' });
    setTimeout(function () { jeton.remove(); }, 800);
  }

  // ---------- Mise à jour du compteur ----------
  function mettreAJourCompteur(container) {
    var jetons = getJetons();
    var compteur = container.querySelector('.via-jeton-compteur');
    if (compteur) {
      compteur.textContent = jetons;
      compteur.animate([{ transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 200 });
    }
  }

  // ---------- Initialisation sur une bannière ----------
  function initialiser(banniere, options) {
    if (!banniere || !isActif()) return null;
    var opts = options || {};
    var onClic = opts.onClic || null;

    // Créer le compteur de jetons
    var compteurDiv = document.createElement('div');
    compteurDiv.className = 'via-jeton-compteur-container';
    compteurDiv.style.cssText = 'position:absolute;top:4px;right:8px;display:flex;align-items:center;gap:4px;background:rgba(0,0,0,.4);padding:2px 8px;border-radius:12px;font-size:0.75rem;color:#ffd700;font-weight:700;z-index:10;';
    compteurDiv.innerHTML = '🪙 <span class="via-jeton-compteur">' + getJetons() + '</span>';
    banniere.style.position = 'relative';
    banniere.appendChild(compteurDiv);

    // Bouton son
    var btnSon = document.createElement('button');
    btnSon.className = 'via-btn-son';
    btnSon.style.cssText = 'position:absolute;top:4px;left:8px;background:rgba(0,0,0,.4);border:none;color:#fff;padding:2px 6px;border-radius:8px;cursor:pointer;font-size:0.8rem;z-index:10;';
    btnSon.textContent = isSonActif() ? '🔊' : '🔇';
    btnSon.addEventListener('click', function (e) {
      e.stopPropagation();
      setSonActif(!isSonActif());
      btnSon.textContent = isSonActif() ? '🔊' : '🔇';
    });
    banniere.appendChild(btnSon);

    // Bouton désactiver
    var btnDesactiver = document.createElement('button');
    btnDesactiver.className = 'via-btn-desactiver';
    btnDesactiver.style.cssText = 'position:absolute;bottom:4px;right:8px;background:rgba(0,0,0,.4);border:none;color:#fff;padding:2px 6px;border-radius:8px;cursor:pointer;font-size:0.7rem;z-index:10;';
    btnDesactiver.textContent = 'Désactiver';
    btnDesactiver.addEventListener('click', function (e) {
      e.stopPropagation();
      setActif(false);
      banniere.removeEventListener('click', handleClick);
      btnDesactiver.textContent = 'Désactivé';
      btnDesactiver.disabled = true;
    });
    banniere.appendChild(btnDesactiver);

    // Gestionnaire de clic
    function handleClick(e) {
      if (!isActif()) return;
      var rect = banniere.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var width = rect.width;
      var height = rect.height;

      // Jouer la note
      jouerNote(x, y, width, height);

      // Feu d'artifice
      creerFeuArtifice(banniere, x, y);

      // Animation du jeton
      animerJeton(banniere, x, y);

      // Incrémenter les jetons
      var jetons = getJetons() + 1;
      setJetons(jetons);
      mettreAJourCompteur(banniere);

      // Callback
      if (onClic) onClic({ jetons: jetons, x: x, y: y, freq: calculerFrequence(x, y, width, height).freq });
    }

    banniere.addEventListener('click', handleClick);

    // CSS pour les particules
    if (!document.getElementById('via-mini-jeu-css')) {
      var style = document.createElement('style');
      style.id = 'via-mini-jeu-css';
      style.textContent = `
        .via-firework-particle { position: absolute; pointer-events: none; }
        .via-jeton { position: absolute; pointer-events: none; }
        @media (prefers-reduced-motion: reduce) {
          .via-firework-particle, .via-jeton { display: none !important; }
        }
      `;
      document.head.appendChild(style);
    }

    return {
      getJetons: getJetons,
      setJetons: setJetons,
      detruire: function () {
        banniere.removeEventListener('click', handleClick);
        compteurDiv.remove();
        btnSon.remove();
        btnDesactiver.remove();
      }
    };
  }

  // ---------- Traduction jetons → budget de génération ----------
  // Un clic = 1 jeton. Les jetons peuvent être utilisés pour choisir une longueur de réponse.
  // Correspondance : 1 jeton = 10 tokens supplémentaires (max 200 tokens supplémentaires)
  // Cette correspondance est une convention de l'interface, pas une puissance GPU réelle.
  function jetonsVersBudget(jetons) {
    var maxTokensSupp = 200;
    var tokensParJeton = 10;
    var tokens = Math.min(jetons * tokensParJeton, maxTokensSupp);
    return {
      jetons: jetons,
      tokensSupplementaires: tokens,
      maxTokensSupplementaires: maxTokensSupp,
      explication: '1 jeton = ' + tokensParJeton + ' tokens supplémentaires (max ' + maxTokensSupp + '). Un clic ne crée pas de puissance GPU ni de tokens LLM directement.'
    };
  }

  // ---------- API publique ----------
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initialiser: initialiser, getJetons: getJetons, setJetons: setJetons, isSonActif: isSonActif, setSonActif: setSonActif, isActif: isActif, setActif: setActif, jetonsVersBudget: jetonsVersBudget, calculerFrequence: calculerFrequence };
  }
  if (typeof window !== 'undefined') {
    window.ViaMiniJeuClics = { initialiser: initialiser, getJetons: getJetons, setJetons: setJetons, isSonActif: isSonActif, setSonActif: setSonActif, isActif: isActif, setActif: setActif, jetonsVersBudget: jetonsVersBudget, calculerFrequence: calculerFrequence };
  }
})(typeof window !== 'undefined' ? window : global);