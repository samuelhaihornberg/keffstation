/* GABARIT gestion cache adaptatif / IndexedDB / purge (Blogum)
 * - IndexedDB: uniquement données locales nécessaires (préférences, brouillons propres, état UI/métadonnées).
 * - Jamais de stockage durable hors ligne des publications/médias des autres utilisateurs.
 * - Après fin complète du visionnage d'une publication d'autrui: supprimer immédiatement (best-effort)
 *   les blobs/données média et de publication mis en cache pour cette lecture.
 * - Exposer taille du cache et commande de vidage.
 * Limites: suppression des tampons internes navigateur non garantie ; captures/enregistrements externes impossibles à empêcher.
 */

export const BlogumCacheManager = (() => {
  const DB_NAME = 'blogum-local';
  const DB_VER = 1;

  async function openDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('local_state')) db.createObjectStore('local_state', { keyPath: 'key' });
        // Ne pas créer de store durable pour médias/publications d'autrui.
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function getCacheSizeEstimate() {
    // Taille approximative (storage estimate) + comptage best-effort des caches Blogum
    let estimate = { usage: null, quota: null };
    if (navigator.storage && navigator.storage.estimate) {
      try { estimate = await navigator.storage.estimate(); } catch (_) {}
    }
    return estimate; // à afficher clairement dans l'UI (approximation)
  }

  async function clearBlogumCaches() {
    // Vide Cache Storage (caches app Blogum) et entrées IndexedDB gérées par Blogum
    if (typeof caches !== 'undefined') {
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => k.startsWith('blogum-')).map(k => caches.delete(k)));
    }
    try {
      const db = await openDb();
      const tx = db.transaction('local_state', 'readwrite');
      tx.objectStore('local_state').clear();
      await new Promise((res, rej) => { tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
      db.close();
    } catch (_) {}
    // Informer l'utilisateur que les tampons internes navigateur ne peuvent pas être garantis supprimés.
  }

  async function onPlaybackFinishedEphemeral({ ephemeralKey, blobUrls = [] }) {
    // À appeler à la fin complète du visionnage d'une publication d'autrui:
    // - révoquer les blob: URLs, supprimer les données éphémères associées (mémoire/IndexedDB éphémère si utilisée)
    // - ne conserver aucune copie durable
    try { blobUrls.forEach(u => { try { URL.revokeObjectURL(u); } catch(_){} }); } catch(_) {}
    // Supprimer toute entrée éphémère identifiée par ephemeralKey (si stockée temporairement) — best-effort.
    void ephemeralKey;
  }

  return { openDb, getCacheSizeEstimate, clearBlogumCaches, onPlaybackFinishedEphemeral };
})();
