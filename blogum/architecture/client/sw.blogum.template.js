/* GABARIT Service Worker Blogum (à intégrer/adapter quand le backend/API sera défini)
 * Objectifs:
 * - Cache API pour les assets de l'application (shell) nécessaires au fonctionnement.
 * - PAS de cache durable hors ligne des publications/médias des autres utilisateurs.
 * - Téléchargement adaptatif côté app (aperçus d'abord ; médias complets sur lecture/action explicite).
 * - Après fin complète du visionnage d'une publication d'autrui, suppression immédiate (best-effort)
 *   des données média/publication mises en cache pour cette lecture (coordination avec cache-manager).
 * Limites: le navigateur ne garantit pas la suppression de ses tampons internes.
 */

const APP_SHELL_CACHE = 'blogum-shell-v1';
// Lister explicitement les assets statiques de l'app (à ajuster)
const APP_SHELL_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(APP_SHELL_CACHE);
    await cache.addAll(APP_SHELL_ASSETS.map(u => new Request(u, { cache: 'reload' }))).catch(() => {});
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('blogum-shell-') && k !== APP_SHELL_CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ne pas mettre en cache durable les réponses API/médias de publications d'autrui.
  // (Adapter les motifs d'URL aux endpoints réels: /api/, /functions/, storage signé, etc.)
  const isApiOrMedia = /\/(api|functions|storage|media)\//.test(url.pathname);
  if (isApiOrMedia) {
    // Par défaut: réseau direct (pas de mise en cache durable). La gestion éphémère de lecture
    // (si nécessaire) doit être contrôlée explicitement côté client et purgée après visionnage.
    event.respondWith(fetch(req));
    return;
  }

  // Assets app: cache-first (shell) avec fallback réseau
  if (req.method === 'GET') {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res && res.ok && url.origin === self.location.origin) {
          const copy = res.clone();
          const cache = await caches.open(APP_SHELL_CACHE);
          cache.put(req, copy);
        }
        return res;
      } catch (_e) {
        return cached || Response.error();
      }
    })());
  }
});

// Messages depuis le client (ex. purge après visionnage, vidage cache)
// self.addEventListener('message', (event) => { ... });
