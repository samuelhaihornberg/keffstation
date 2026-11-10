/*
 * KiffTech — Service Worker
 * ============================================================================
 * Strategie de cache :
 *   - navigation (HTML)  : RESEAU D'ABORD, cache en secours (mode hors ligne)
 *   - JS / CSS / JSON    : RESEAU D'ABORD, cache en secours
 *         -> un deploiement doit etre visible immediatement : servir un vieux
 *            app.v2.js avec un nouveau HTML provoque des erreurs d'affichage.
 *   - images / polices   : CACHE D'ABORD + mise a jour en arriere-plan
 *         -> elles changent peu et sont volumineuses.
 *
 * Le catalogue (data/*.json) est conserve en localStorage par l'application
 * (kifftech/catalogue-live.js) : double securite hors ligne.
 */
const CACHE = 'kifftech-agent-v29';
var KEEP_RE = /transformers|onnx|webllm|mlc/i;

const ASSETS = [
  './',
  './index.html',
  './rayons.html',
  './catalog.html',
  './credits.html',
  './about.html',
  './theme.css',
  './app.v2.js',
  './catalogue-live.js',
  './rayons.css',
  './rayons.js',
  './data/catalogue.json',
  './data/products.json',
  './manifest.json',
  './rayon/index.html',
  './rayon/smartphones/index.html',
  './rayon/tablets/index.html',
  './rayon/accessories/index.html',
  './rayon/audio-et-wearables/index.html',
  './rayon/vr-ar-gadgets/index.html',
  './rayon/drones-et-cameras/index.html',
  './rayon/computers/index.html',
  './rayon/smart-home/index.html',
  './rayon/garden-et-furnitures-smart-devices/index.html',
  './rayon/company-et-studying-robots/index.html',
  './rayon/consoles-et-videogames/index.html',
  './rayon/composant-electronic-et-informatic/index.html',
  './rayon/composant-electronic/index.html',
  './rayon/materiel-electronique-et-outillage/index.html',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => Promise.all(ASSETS.map((a) => c.add(a).catch(() => {})))),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && !KEEP_RE.test(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/* Reseau d'abord, cache en secours. */
async function networkFirst(request, fallbackUrl) {
  try {
    const res = await fetch(request);
    if (res && res.ok) {
      const copy = res.clone();
      caches.open(CACHE).then((ch) => ch.put(request, copy));
    }
    return res;
  } catch (e) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (fallbackUrl) {
      const fb = await caches.match(fallbackUrl);
      if (fb) return fb;
    }
    throw e;
  }
}

/* Cache d'abord, mise a jour en arriere-plan. */
function cacheFirst(request) {
  return caches.match(request).then((cached) => {
    const net = fetch(request)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((ch) => ch.put(request, copy));
        }
        return res;
      })
      .catch(() => cached);
    return cached || net;
  });
}

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  // Navigation : HTML toujours a jour, cache en secours (hors ligne)
  if (e.request.mode === 'navigate') {
    e.respondWith(networkFirst(e.request, './index.html'));
    return;
  }

  // Config generees au deploiement : toujours depuis le reseau si possible
  if (/\/(paypal|shopify)-config\.js$/.test(url.pathname)) {
    e.respondWith(networkFirst(e.request));
    return;
  }

  // Images / polices / video : cache d'abord
  if (/\.(png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf|eot|mp4|webm)$/i.test(url.pathname)) {
    e.respondWith(cacheFirst(e.request));
    return;
  }

  // JS / CSS / JSON : reseau d'abord (un push doit etre visible immediatement)
  if (/\.(js|css|json|mjs|cjs)$/i.test(url.pathname)) {
    e.respondWith(networkFirst(e.request));
    return;
  }

  e.respondWith(networkFirst(e.request));
});
