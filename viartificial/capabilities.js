/* Détection des capacités réelles — affiche ce que l'environnement SAIT faire,
   propose une alternative sinon. Aucune compatibilité universelle promise :
   les environnements réellement testés sont listés dans chaque page. */
(function (global) {
  'use strict';
  function detect() {
    var ua = navigator.userAgent || '', os = 'inconnu';
    if (/Android/i.test(ua)) os = 'Android';
    else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
    else if (/Win/i.test(ua)) os = 'Windows';
    else if (/Mac/i.test(ua)) os = 'macOS';
    else if (/Linux/i.test(ua)) os = 'Linux';
    var coarse = false, fine = false;
    try { coarse = matchMedia('(pointer:coarse)').matches; fine = matchMedia('(pointer:fine)').matches; } catch (e) {}
    var touch = coarse || (navigator.maxTouchPoints > 0);
    var standalone = false;
    try { standalone = matchMedia('(display-mode:standalone)').matches || navigator.standalone === true; } catch (e) {}
    var md = navigator.mediaDevices || {};
    var storage = true; try { localStorage.setItem('__c', '1'); localStorage.removeItem('__c'); } catch (e) { storage = false; }
    return {
      os: os, touch: touch, mouse: fine || !touch, standalone: standalone,
      share: !!(md && md.getDisplayMedia), camera: !!(md && md.getUserMedia),
      mic: !!(md && md.getUserMedia), notify: ('Notification' in window),
      sw: ('serviceWorker' in navigator), storage: storage
    };
  }
  function altMissing(c) {
    var a = [];
    if (!c.share) a.push('partage d’écran indisponible ici → décris la scène à l’écrit');
    if (!c.camera || !c.mic) a.push('caméra/micro indisponibles → mode texte seul');
    if (!c.storage) a.push('stockage local indisponible → carnet et réglages non persistés');
    if (!c.sw) a.push('service worker indisponible → pas de hors-ligne');
    return a;
  }
  function paint(id) {
    var el = document.getElementById(id); if (!el) return;
    var c = detect();
    var bits = [c.os, c.touch ? 'tactile' : 'clavier/souris', c.standalone ? 'installée' : 'navigateur'];
    el.textContent = 'Cet appareil : ' + bits.join(' · ') + '. ' + (altMissing(c).join(' ; ') || 'Toutes les fonctions de base sont disponibles ici.');
  }
  global.ViaCaps = { detect: detect, paint: paint };
})(window);
