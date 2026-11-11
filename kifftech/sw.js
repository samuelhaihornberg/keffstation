/*
 * KiffTech — Service Worker désactivé
 * Aucun cache, aucune interception : tout passe par le réseau.
 * Ce fichier est vide pour désactiver l'ancien SW qui causait des rechargements intempestifs.
 */
const CACHE = 'kifftech-agent-disabled';
var KEEP_RE = /transformers|onnx|webllm|mlc/i;

const ASSETS = [];

self.addEventListener('install', (e) => {
  e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Laisse passer toutes les requêtes vers le réseau, aucun cache
  return;
});
