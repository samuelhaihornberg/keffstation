// Panneau KeffStation : actions techniques discrètes, accessibles par une roue
// dentée en bas à droite. Les boutons sont uniquement des icônes (libellés en
// aria-label / title) pour ne pas encombrer l'interface.
// - Rafraîchissement KeffStation / ViArtificial Labs : vide le cache du
//   périmètre, met à jour le SW puis recharge si c'est la page affichée.
// - Vider cache KeffStation / ViArtificial Labs : supprime uniquement les
//   caches du périmètre indiqué (hors modèles IA) ; historique (localStorage)
//   et données du modèle local toujours préservés.
// Zéro dépendance. Formats téléphone / tablette / ordinateur via CSS.
(function () {
  var SCOPE = {
    keff: { label: 'KeffStation', re: /^keffstation-/i, path: '/keffstation/' },
    via: { label: 'ViArtificial Labs', re: /^viartificial-/i, path: '/keffstation/viartificial/' }
  };
  var KEEP = /transformers|onnx|webllm|mlc/i; // caches du modèle local : jamais vidés
  var ICONS = {
    gear: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
    trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'
  };
  var CSS = [
    '#ks-dock{position:fixed;right:14px;bottom:14px;z-index:1100;display:flex;flex-direction:column;align-items:flex-end;gap:8px;font-family:"SFMono-Regular",ui-monospace,Menlo,Consolas,monospace}',
    '#ks-toggle{width:40px;height:40px;padding:0;display:flex;align-items:center;justify-content:center;border:1px solid rgba(239,236,225,.16);border-radius:50%;background:rgba(7,7,8,.72);color:rgba(239,236,225,.5);cursor:pointer;opacity:.5;transition:opacity .18s,transform .22s,color .18s,border-color .18s,background .18s;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}',
    '#ks-toggle svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}',
    '#ks-toggle:hover,#ks-toggle:focus-visible,#ks-dock.open #ks-toggle{opacity:1;color:#d8ff3e;border-color:rgba(216,255,62,.5);background:rgba(7,7,8,.9);transform:rotate(35deg)}',
    '#ks-panel{display:none;grid-template-columns:repeat(2,40px);gap:6px;padding:6px;border:1px solid rgba(239,236,225,.16);background:rgba(7,7,8,.92);box-shadow:0 18px 44px rgba(0,0,0,.55);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}',
    '#ks-dock.open #ks-panel{display:grid}',
    '.ks-icon-btn{position:relative;width:40px;height:40px;padding:0;display:flex;align-items:center;justify-content:center;border:1px solid transparent;border-radius:0;background:transparent;color:rgba(239,236,225,.68);cursor:pointer;transition:background .16s,color .16s,border-color .16s}',
    '.ks-icon-btn svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}',
    '.ks-icon-btn:hover,.ks-icon-btn:focus-visible{border-color:rgba(216,255,62,.4);background:rgba(216,255,62,.1);color:#d8ff3e}',
    '.ks-icon-btn[data-scope="via"]:hover,.ks-icon-btn[data-scope="via"]:focus-visible{border-color:rgba(217,199,163,.45);background:rgba(217,199,163,.1);color:#d9c7a3}',
    '.ks-icon-btn::after{content:"";position:absolute;right:5px;bottom:5px;width:4px;height:4px;border-radius:50%;background:rgba(216,255,62,.55)}',
    '.ks-icon-btn[data-scope="via"]::after{background:rgba(217,199,163,.6)}',
    '#ks-toast{position:fixed;left:50%;transform:translateX(-50%);bottom:5.2rem;z-index:9999;background:rgba(7,7,8,.96);border:1px solid rgba(216,255,62,.45);color:#d8ff3e;padding:8px 14px;border-radius:999px;font-size:.76rem;display:none;max-width:92vw;text-align:center;font-family:"SFMono-Regular",ui-monospace,Menlo,Consolas,monospace}',
    '@media (max-width:600px){#ks-dock{right:10px;bottom:10px}}'
  ].join('');
  function toast(msg) {
    var t = document.getElementById('ks-toast');
    if (!t) { t = document.createElement('div'); t.id = 'ks-toast'; document.body.appendChild(t); }
    t.textContent = msg; t.style.display = 'block';
    clearTimeout(t._h); t._h = setTimeout(function () { t.style.display = 'none'; }, 2600);
  }
  function scopeOf(key) {
    if (KEEP.test(key)) return 'model';
    if (SCOPE.via.re.test(key)) return 'via';
    if (SCOPE.keff.re.test(key)) return 'keff';
    return 'autre';
  }
  async function viderCache(scope) {
    if (!('caches' in window)) { toast('Caches indisponibles ici'); return 0; }
    var keys = await caches.keys(), n = 0;
    for (var i = 0; i < keys.length; i++) {
      if (scopeOf(keys[i]) === scope) { try { if (await caches.delete(keys[i])) n++; } catch (e) {} }
    }
    return n; // localStorage / IndexedDB / modèles : intouchés
  }
  async function rafraichir(scope, hard) {
    var meta = SCOPE[scope], ici = location.pathname.indexOf('/viartificial/') > -1 ? 'via' : 'keff';
    if (hard) { try { await viderCache(scope); } catch (e) {} }
    try {
      if ('serviceWorker' in navigator) {
        var regs = await navigator.serviceWorker.getRegistrations();
        for (var i = 0; i < regs.length; i++) {
          var url = regs[i].scope || '';
          var vise = scope === 'via' ? url.indexOf('/viartificial/') > -1 : /keffstation\/?$/.test(url);
          if (vise) { try { await regs[i].update(); } catch (e) {} }
        }
      }
    } catch (e) {}
    if (scope === ici) {
      toast('Actualisation ' + meta.label + '…');
      setTimeout(function () { window.location.reload(); }, 600);
    } else {
      toast(meta.label + ' prête pour la prochaine visite');
    }
  }
  function boutonIcone(id, icone, libelle, scope, fn) {
    var b = document.createElement('button');
    b.id = id; b.type = 'button';
    b.className = 'ks-icon-btn';
    b.dataset.scope = scope;
    b.innerHTML = icone;
    b.setAttribute('aria-label', libelle);
    b.title = libelle;
    b.addEventListener('click', fn);
    return b;
  }
  function monter() {
    if (document.getElementById('ks-dock')) return;
    var st = document.createElement('style'); st.textContent = CSS;
    document.head.appendChild(st);
    var dock = document.createElement('div');
    dock.id = 'ks-dock';
    var panel = document.createElement('div');
    panel.id = 'ks-panel';
    panel.setAttribute('role', 'toolbar');
    panel.setAttribute('aria-label', 'Rafraîchissement et caches KeffStation et ViArtificial Labs');
    panel.appendChild(boutonIcone('ks-r-keff', ICONS.refresh, 'Rafraîchir KeffStation (vide le cache et recharge)', 'keff', function () { rafraichir('keff', true); }));
    panel.appendChild(boutonIcone('ks-r-via', ICONS.refresh, 'Rafraîchir ViArtificial Labs (vide le cache et recharge)', 'via', function () { rafraichir('via', true); }));
    panel.appendChild(boutonIcone('ks-c-keff', ICONS.trash, 'Vider le cache KeffStation', 'keff', async function () {
      var n = await viderCache('keff'); toast('Cache KeffStation vidé (' + n + ') — historique et modèle gardés');
    }));
    panel.appendChild(boutonIcone('ks-c-via', ICONS.trash, 'Vider le cache ViArtificial Labs', 'via', async function () {
      var n = await viderCache('via'); toast('Cache ViArtificial Labs vidé (' + n + ') — historique et modèle gardés');
    }));
    var toggle = document.createElement('button');
    toggle.id = 'ks-toggle'; toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Paramètres de rafraîchissement et de cache');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'ks-panel');
    toggle.title = 'Paramètres';
    toggle.innerHTML = ICONS.gear;
    function fermer() {
      dock.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
    toggle.addEventListener('click', function () {
      var ouvert = dock.classList.toggle('open');
      toggle.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!dock.contains(e.target)) fermer();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fermer();
    });
    dock.appendChild(panel);
    dock.appendChild(toggle);
    document.body.appendChild(dock);
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SCOPE: SCOPE, scopeOf: scopeOf };
  } else {
    document.addEventListener('DOMContentLoaded', monter);
  }
})();
