const CACHE = 'keffstation-vitrine-v22';
const ASSETS = [
  './', './index.html', './articles.html', './vitrine.css', './manifest.json',
  './app.js', './refresh.js', './i18n.js', './i18n-locales.js', './page-translate-adapter.js',
  './locales/locales.json', './locales/fr.json', './locales/en.json',
  './locales/glossary.json', './locales/rtl.css'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => {
      const add = (url) => c.add(url).catch(() => {}); // ignore les absents (ex: langues non créées)
      return Promise.all(ASSETS.map(add));
    }).then(() => self.skipWaiting())
  );
});

// Ne JAMAIS purger les caches de modèles IA (transformers/onnx/webllm/mlc) :
// ils sont partagés à l'échelle de l'origine et re-téléchargés à grand coût.
var KEEP_RE = /transformers|onnx|webllm|mlc/i;
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && !KEEP_RE.test(k)).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  if (e.request.mode === 'navigate') {
    // HTML : réseau d'abord, cache en secours (toujours frais en ligne)
    e.respondWith(
      fetch(e.request).then(r => {
        if (r.ok) caches.open(CACHE).then(c => c.put(e.request, r.clone()));
        return r;
      }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
    );
    return;
  }
  if (/\.(js|css|png|jpg|jpeg|gif|svg|webp|woff2?|ttf|ico|json)$/.test(url.pathname)) {
    // Statiques : périmé-pendant-revalidation (rapide + frais en arrière-plan)
    e.respondWith(
      caches.match(e.request).then(cached => {
        const net = fetch(e.request).then(r => {
          if (r.ok) caches.open(CACHE).then(c => c.put(e.request, r.clone()));
          return r;
        }).catch(() => cached);
        return cached || net;
      })
    );
    return;
  }
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});