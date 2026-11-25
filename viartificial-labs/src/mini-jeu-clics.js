// src/mini-jeu-clics.js — Mini-jeu de clics sur la bannière "Hello World".
// Mode sonore : clics produisent des notes et un beat musical selon la position.
// Mode silencieux : gremlins cartoon arrivent en 2D, se déplacent, splash d'eau.
// Jetons d'interface gagnés par les clics, avec compteur et animation.
// Indépendant du moteur conversationnel.
'use strict';
(function (global) {
  var REDUCED_MOTION = false;
  try { REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  var STORAGE_KEY = 'via-mini-jeu-jetons';
  var SON_KEY = 'via-mini-jeu-son';
  var ACTIF_KEY = 'via-mini-jeu-actif';

  function getJetons() { try { return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10); } catch (e) { return 0; } }
  function setJetons(n) { try { localStorage.setItem(STORAGE_KEY, String(n)); } catch (e) {} }
  function isSonActif() { try { return localStorage.getItem(SON_KEY) !== '0'; } catch (e) { return true; } }
  function setSonActif(v) { try { localStorage.setItem(SON_KEY, v ? '1' : '0'); } catch (e) {} }
  function isActif() { try { return localStorage.getItem(ACTIF_KEY) !== '0'; } catch (e) { return true; } }
  function setActif(v) { try { localStorage.setItem(ACTIF_KEY, v ? '1' : '0'); } catch (e) {} }

  function calculerFrequence(x, y, width, height) {
    var baseFreq = 440;
    var yNorm = y / height;
    var freqY = baseFreq * Math.pow(2, (0.5 - yNorm) * 2);
    var xNorm = x / width;
    return { freq: freqY, xNorm: xNorm, yNorm: yNorm };
  }

  var audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) { try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    return audioCtx;
  }

  function jouerNote(x, y, width, height) {
    if (!isSonActif()) return;
    var ctx = getAudioCtx();
    if (!ctx) return;
    var info = calculerFrequence(x, y, width, height);
    var osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = info.freq;
    var gain = ctx.createGain();
    gain.gain.value = 0.3;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    var filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000 + info.xNorm * 4000;
    osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5);
    if (info.xNorm > 0.5) {
      var osc2 = ctx.createOscillator();
      osc2.type = 'triangle'; osc2.frequency.value = info.freq * 2;
      var gain2 = ctx.createGain(); gain2.gain.value = 0.1;
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc2.connect(gain2); gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime); osc2.stop(ctx.currentTime + 0.3);
    }
  }

  function creerFeuArtifice(container, x, y) {
    if (REDUCED_MOTION || !isActif()) return;
    var colors = ['#ffd700', '#ff4d6d', '#00d4ff', '#27d17f', '#b84dff', '#ff8c00', '#fff'];
    var particles = 12 + Math.floor(Math.random() * 8);
    for (var i = 0; i < particles; i++) {
      var p = document.createElement('div');
      p.className = 'via-firework-particle';
      var angle = (Math.PI * 2 * i) / particles;
      var dist = 30 + Math.random() * 40;
      p.style.cssText = 'position:absolute;width:4px;height:4px;border-radius:50%;background:' + colors[Math.floor(Math.random() * colors.length)] + ';left:' + x + 'px;top:' + y + 'px;pointer-events:none;z-index:9999;';
      container.appendChild(p);
      (function (el, dx, dy) {
        el.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: 'translate(' + dx + 'px,' + dy + 'px)', opacity: 0 }], { duration: 600 + Math.random() * 400, easing: 'cubic-bezier(0,0,0.2,1)' });
        setTimeout(function () { el.remove(); }, 1000);
      })(p, Math.cos(angle) * dist, Math.sin(angle) * dist);
    }
  }

  function animerJeton(container, x, y) {
    if (REDUCED_MOTION) return;
    var jeton = document.createElement('div');
    jeton.className = 'via-jeton';
    jeton.style.cssText = 'position:absolute;left:' + x + 'px;top:' + y + 'px;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle,#ffd700,#b87333);box-shadow:0 0 12px rgba(255,215,0,.8);pointer-events:none;z-index:9999;font-size:0.7rem;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;';
    jeton.textContent = '+1';
    container.appendChild(jeton);
    jeton.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: 'translate(0,-60px) scale(0.5)', opacity: 0 }], { duration: 800, easing: 'ease-out' });
    setTimeout(function () { jeton.remove(); }, 800);
  }

  function mettreAJourCompteur(container) {
    var jetons = getJetons();
    var compteur = container.querySelector('.via-jeton-compteur');
    if (compteur) { compteur.textContent = jetons; compteur.animate([{ transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 200 }); }
  }

  // ---------- Mode sonore ----------
  function initialiser(banniere, options) {
    if (!banniere || !isActif()) return null;
    var opts = options || {};
    var onClic = opts.onClic || null;
    banniere.style.position = 'relative';

    var compteurDiv = document.createElement('div');
    compteurDiv.className = 'via-jeton-compteur-container';
    compteurDiv.style.cssText = 'position:absolute;top:4px;right:8px;display:flex;align-items:center;gap:4px;background:rgba(0,0,0,.4);padding:2px 8px;border-radius:12px;font-size:0.75rem;color:#ffd700;font-weight:700;z-index:10;';
    compteurDiv.innerHTML = '🪙 <span class="via-jeton-compteur">' + getJetons() + '</span>';
    banniere.appendChild(compteurDiv);

    var btnSon = document.createElement('button');
    btnSon.className = 'via-btn-son';
    btnSon.style.cssText = 'position:absolute;top:4px;left:8px;background:rgba(0,0,0,.4);border:none;color:#fff;padding:2px 6px;border-radius:8px;cursor:pointer;font-size:0.8rem;z-index:10;';
    btnSon.textContent = isSonActif() ? '🔊' : '🔇';
    btnSon.addEventListener('click', function (e) { e.stopPropagation(); setSonActif(!isSonActif()); btnSon.textContent = isSonActif() ? '🔊' : '🔇'; });
    banniere.appendChild(btnSon);

    var btnDesactiver = document.createElement('button');
    btnDesactiver.className = 'via-btn-desactiver';
    btnDesactiver.style.cssText = 'position:absolute;bottom:4px;right:8px;background:rgba(0,0,0,.4);border:none;color:#fff;padding:2px 6px;border-radius:8px;cursor:pointer;font-size:0.7rem;z-index:10;';
    btnDesactiver.textContent = 'Désactiver';
    banniere.addEventListener('click', function handleClick(e) {
      if (!isActif()) return;
      var rect = banniere.getBoundingClientRect();
      var x = e.clientX - rect.left, y = e.clientY - rect.top;
      jouerNote(x, y, rect.width, rect.height);
      creerFeuArtifice(banniere, x, y);
      animerJeton(banniere, x, y);
      var jetons = getJetons() + 1;
      setJetons(jetons);
      mettreAJourCompteur(banniere);
      if (onClic) onClic({ jetons: jetons, x: x, y: y });
    });
    btnDesactiver.addEventListener('click', function (e) {
      e.stopPropagation();
      setActif(false);
      banniere.removeEventListener('click', handleClick);
      btnDesactiver.textContent = 'Désactivé'; btnDesactiver.disabled = true;
    });
    banniere.appendChild(btnDesactiver);

    if (!document.getElementById('via-mini-jeu-css')) {
      var style = document.createElement('style');
      style.id = 'via-mini-jeu-css';
      style.textContent = '.via-firework-particle,.via-jeton{position:absolute;pointer-events:none;}@media(prefers-reduced-motion:reduce){.via-firework-particle,.via-jeton{display:none!important;}}';
      document.head.appendChild(style);
    }
    return { getJetons: getJetons, setJetons: setJetons, detruire: function () { banniere.removeEventListener('click', handleClick); compteurDiv.remove(); btnSon.remove(); btnDesactiver.remove(); } };
  }

  // ---------- Mode gremlins (silencieux) ----------
  function initialiserGremlins(container) {
    if (!container || REDUCED_MOTION) return null;
    var gremlins = [];
    var running = true;
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:5;';
    container.style.position = 'relative';
    container.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    function resize() { canvas.width = container.offsetWidth; canvas.height = container.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);

    function spawnGremlin() {
      gremlins.push({ x: Math.random() * canvas.width, y: 20, vx: (Math.random() - 0.5) * 2, vy: 0, r: 12, couleur: '#4caf50', vivant: true });
    }
    spawnGremlin();

    var plateformes = [
      { x: 50, y: container.offsetHeight * 0.7, w: 120 },
      { x: container.offsetWidth * 0.5, y: container.offsetHeight * 0.5, w: 100 },
      { x: container.offsetWidth - 170, y: container.offsetHeight * 0.7, w: 120 }
    ];

    function update() {
      gremlins.forEach(function (g) {
        if (!g.vivant) return;
        g.vy += 0.3; g.x += g.vx; g.y += g.vy;
        plateformes.forEach(function (pl) {
          if (g.y + g.r > pl.y && g.y + g.r < pl.y + 10 && g.x > pl.x && g.x < pl.x + pl.w) { g.y = pl.y - g.r; g.vy = 0; g.vx *= 0.9; }
        });
        if (g.x < g.r) { g.x = g.r; g.vx = Math.abs(g.vx); }
        if (g.x > canvas.width - g.r) { g.x = canvas.width - g.r; g.vx = -Math.abs(g.vx); }
        if (g.y > canvas.height) g.vivant = false;
      });
      gremlins = gremlins.filter(function (g) { return g.vivant; });
      if (gremlins.length === 0) spawnGremlin();
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      plateformes.forEach(function (pl) { ctx.fillStyle = 'rgba(184,77,255,0.3)'; ctx.fillRect(pl.x, pl.y, pl.w, 8); });
      gremlins.forEach(function (g) {
        if (!g.vivant) return;
        ctx.fillStyle = g.couleur;
        ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(g.x - 4, g.y - 3, 3, 0, Math.PI * 2); ctx.arc(g.x + 4, g.y - 3, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.arc(g.x - 4, g.y - 3, 1.5, 0, Math.PI * 2); ctx.arc(g.x + 4, g.y - 3, 1.5, 0, Math.PI * 2); ctx.fill();
      });
    }

    function loop() { if (!running) return; update(); draw(); requestAnimationFrame(loop); }
    loop();

    container.addEventListener('click', function (e) {
      if (!isActif()) return;
      var rect = container.getBoundingClientRect();
      var x = e.clientX - rect.left, y = e.clientY - rect.top;
      var hit = null;
      gremlins.forEach(function (g) { var dx = g.x - x, dy = g.y - y; if (Math.sqrt(dx * dx + dy * dy) < g.r + 5) hit = g; });
      if (hit) {
        hit.vivant = false;
        var splash = document.createElement('div');
        splash.style.cssText = 'position:absolute;left:' + (hit.x - 10) + 'px;top:' + (hit.y - 10) + 'px;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle,rgba(0,180,255,0.6),transparent);pointer-events:none;z-index:6;';
        container.appendChild(splash);
        splash.animate([{ transform: 'scale(1)', opacity: 0.8 }, { transform: 'scale(2.5)', opacity: 0 }], { duration: 500 });
        setTimeout(function () { splash.remove(); }, 500);
        if (Math.random() > 0.5) spawnGremlin();
        var jetons = getJetons() + 1;
        setJetons(jetons);
        mettreAJourCompteur(container);
      }
    });

    return { detruire: function () { running = false; canvas.remove(); window.removeEventListener('resize', resize); } };
  }

  // ---------- Traduction jetons → budget de génération ----------
  function jetonsVersBudget(jetons) {
    return { jetons: jetons, tokensSupplementaires: Math.min(jetons * 10, 200), maxTokensSupplementaires: 200, explication: '1 jeton = 10 tokens supplémentaires (max 200). Un clic ne cree pas de puissance GPU ni de tokens LLM directement.' };
  }

  // ---------- API publique ----------
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initialiser: initialiser, initialiserGremlins: initialiserGremlins, getJetons: getJetons, setJetons: setJetons, isSonActif: isSonActif, setSonActif: setSonActif, isActif: isActif, setActif: setActif, jetonsVersBudget: jetonsVersBudget, calculerFrequence: calculerFrequence };
  }
  if (typeof window !== 'undefined') {
    window.ViaMiniJeuClics = { initialiser: initialiser, initialiserGremlins: initialiserGremlins, getJetons: getJetons, setJetons: setJetons, isSonActif: isSonActif, setSonActif: setSonActif, isActif: isActif, setActif: setActif, jetonsVersBudget: jetonsVersBudget, calculerFrequence: calculerFrequence };
  }
})(typeof window !== 'undefined' ? window : global);