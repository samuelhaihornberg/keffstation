// src/keyboard-dev.js — Passeur de clavier professionnel pour ViArtificial Labs.
// Raccourcis clavier pour les développeurs et utilisateurs avancés.
'use strict';
(function (global) {
  var raccourcis = {
    'Ctrl+S': { nom: 'Sauvegarder', action: function () { console.log('Sauvegarder'); } },
    'Ctrl+Enter': { nom: 'Exécuter', action: function () { console.log('Exécuter'); } },
    'Ctrl+Shift+F': { nom: 'Formater', action: function () { console.log('Formater'); } },
    'Ctrl+/': { nom: 'Commenter', action: function () { console.log('Commenter'); } },
    'Ctrl+D': { nom: 'Dupliquer ligne', action: function () { console.log('Dupliquer'); } },
    'Ctrl+Shift+K': { nom: 'Supprimer ligne', action: function () { console.log('Supprimer'); } },
    'Ctrl+F': { nom: 'Rechercher', action: function () { console.log('Rechercher'); } },
    'Ctrl+H': { nom: 'Remplacer', action: function () { console.log('Remplacer'); } },
    'Ctrl+G': { nom: 'Aller à la ligne', action: function () { console.log('Aller à'); } },
    'Ctrl+Shift+P': { nom: 'Palette de commandes', action: function () { console.log('Palette'); } },
    'Ctrl+B': { nom: 'Toggle sidebar', action: function () { console.log('Sidebar'); } },
    'Ctrl+`': { nom: 'Toggle terminal', action: function () { console.log('Terminal'); } },
    'F5': { nom: 'Run', action: function () { console.log('Run'); } },
    'F9': { nom: 'Debug', action: function () { console.log('Debug'); } },
    'F12': { nom: 'DevTools', action: function () { console.log('DevTools'); } }
  };

  function enregistrer(nom, raccourci, action) {
    raccourcis[raccourci] = { nom: nom, action: action };
  }

  function lister() { return Object.keys(raccourcis).map(function (k) { return { raccourci: k, nom: raccourcis[k].nom }; }); }

  function gerer(e) {
    var key = '';
    if (e.ctrlKey || e.metaKey) key += 'Ctrl+';
    if (e.shiftKey) key += 'Shift+';
    if (e.altKey) key += 'Alt+';
    key += e.key;
    var r = raccourcis[key];
    if (r && typeof r.action === 'function') {
      e.preventDefault();
      r.action();
      return true;
    }
    return false;
  }

  function initialiser(container) {
    if (!container) container = document;
    container.addEventListener('keydown', gerer, true);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { raccourcis: raccourcis, enregistrer: enregistrer, lister: lister, gerer: gerer, initialiser: initialiser };
  }
  if (typeof window !== 'undefined') {
    window.ViaKeyboardDev = { raccourcis: raccourcis, enregistrer: enregistrer, lister: lister, gerer: gerer, initialiser: initialiser };
  }
})(typeof window !== 'undefined' ? window : global);