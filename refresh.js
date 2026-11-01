// Panneau KeffStation : 4 actions nommées, discrètes, à portée limitée.
// - Rafraîchissement KeffStation / ViArtificial Labs : met à jour le SW du
//   périmètre indiqué puis recharge (contrôlée) uniquement si c'est la page
//   affichée ; sinon prépare la prochaine visite, sans toucher à l'autre app.
// - Vider cache KeffStation / ViArtificial Labs : supprime uniquement les
//   caches du périmètre indiqué (hors modèles IA) ; historique
//   (localStorage) et données du modèle local toujours préservés.
// Zéro dépendance. Formats téléphone / tablette / ordinateur via CSS.
(function () {
  var SCOPE = {
    keff: { label: 'KeffStation', re: /^keffstation-/i, path: '/keffstation/' },
    via: { label: 'ViArtificial Labs', re: /^viartificial-/i, path: '/keffstation/viartificial/' }
  };
  var KEEP = /transformers|onnx|webllm|mlc/i; // caches du modèle local : jamais vidés
  var CSS = [
    '#ks-panel{position:fixed;z-index:9998;display:flex;gap:8px;flex-wrap:wrap;justify-content:center}',
    '#ks-panel button{min-height:44px;padding:10px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.2);background:rgba(10,12,34,.92);color:#f4f6ff;font-size:.85rem;cursor:pointer;touch-action:manipulation}',
    '#ks-panel button:active{transform:scale(.97)}',
    '#ks-toast{position:fixed;left:50%;transform:translateX(-50%);bottom:5.2rem;z-index:9999;background:rgba(10,12,34,.95);border:1px solid rgba(255,210,63,.5);color:#ffd23f;padding:8px 14px;border-radius:999px;font-size:.8rem;display:none;max-width:92vw;text-align:center}',
    '@media (max-width:600px){#ks-panel{left:.5rem;right:.5rem;bottom:.5rem}#ks-panel button{flex:1 1 45%}}',
    '@media (min-width:601px) and (max-width:1024px){#ks-panel{right:1rem;bottom:1rem;max-width:22rem}#ks-panel button{flex:1 1 100%}}',
    '@media (min-width:1025px){#ks-panel{right:1rem;bottom:1rem}#ks-panel button{flex:0 0 auto}}'
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
  async function rafraichir(scope) {
    var meta = SCOPE[scope], ici = location.pathname.indexOf('/viartificial/') > -1 ? 'via' : 'keff';
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
  function bouton(id, texte, titre, fn) {
    var b = document.createElement('button');
    b.id = id; b.type = 'button'; b.textContent = texte; b.title = titre;
    b.setAttribute('aria-label', titre);
    b.addEventListener('click', fn);
    return b;
  }
  function monter() {
    if (document.getElementById('ks-panel')) return;
    var st = document.createElement('style'); st.textContent = CSS;
    document.head.appendChild(st);
    var p = document.createElement('div');
    p.id = 'ks-panel'; p.setAttribute('role', 'toolbar');
    p.setAttribute('aria-label', 'Rafraîchissement et caches KeffStation et ViArtificial Labs');
    p.appendChild(bouton('ks-r-keff', 'Rafraîchissement Keffstation', 'Actualiser KeffStation', function () { rafraichir('keff'); }));
    p.appendChild(bouton('ks-r-via', 'Rafraîchissement ViArtificial Labs', 'Actualiser ViArtificial Labs', function () { rafraichir('via'); }));
    p.appendChild(bouton('ks-c-keff', 'Vider cache Keffstation', 'Vider uniquement le cache KeffStation (historique et modèle préservés)', async function () {
      var n = await viderCache('keff'); toast('Cache KeffStation vidé (' + n + ') — historique et modèle gardés');
    }));
    p.appendChild(bouton('ks-c-via', 'Vider cache ViArtificial Labs', 'Vider uniquement le cache ViArtificial Labs (historique et modèle préservés)', async function () {
      var n = await viderCache('via'); toast('Cache ViArtificial Labs vidé (' + n + ') — historique et modèle gardés');
    }));
    document.body.appendChild(p);
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SCOPE: SCOPE, scopeOf: scopeOf };
  } else {
    document.addEventListener('DOMContentLoaded', monter);
  }
})();
