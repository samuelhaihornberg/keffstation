const CACHE = 'viartificial-labs-v31'; // v31 : conversation directe, mode local/hybride/en ligne, chargement auto après accord.
const ASSETS = ['./', './index.html', './xsstream.html', './conversation.html', './bots.json', './providers.js', './memory.js', './actions.js', './local-engine.js', './local-wasm.js', './local-wasm-worker.js', './responsive.css', './capabilities.js', './manifest.json'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
// Ne JAMAIS purger les caches de modèles IA (transformers/onnx/webllm/mlc) :
// ils sont partagés à l'échelle de l'origine et re-téléchargés à grand coût.
var KEEP_RE = /transformers|onnx|webllm|mlc/i;
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && !KEEP_RE.test(k)).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(cache => cache.put(e.request, c)); } return res; }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
    return;
  }
  if (url.pathname.endsWith('/bots.json') || url.pathname.endsWith('bots.json')) {
    e.respondWith(fetch(e.request, { cache: 'no-store' }).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(cache => cache.put(e.request, c)); } return res; }).catch(() => caches.match(e.request)));
    return;
  }
  // Code et styles : RÉSEAU D'ABORD. Un ancien module BLM en cache ne doit
  // jamais masquer une correction publiée ; le cache ne sert qu'hors-ligne.
  if (/\.(js|css)$/.test(url.pathname)) {
    e.respondWith(fetch(e.request, { cache: 'no-store' }).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(cache => cache.put(e.request, c)); } return res; }).catch(() => caches.match(e.request)));
    return;
  }
  if (/\.(png|jpg|jpeg|gif|svg|webp|woff2?|ttf|ico|json)$/.test(url.pathname)) {
    e.respondWith(caches.match(e.request).then(cached => {
      const net = fetch(e.request).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(cache => cache.put(e.request, c)); } return res; }).catch(() => cached);
      return cached || net;
    }));
    return;
  }
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});