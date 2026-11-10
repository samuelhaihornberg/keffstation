/*!
 * KiffTech — Chargement du catalogue étendu + catalogue live
 * ============================================================================
 * Deux sources JSON publiques, servies par GitHub Pages :
 *
 *  1. ./data/catalogue.json  — catalogue local enrichi (25+ produits par rayon),
 *                              généré par scripts/kifftech/build-catalogue.mjs
 *  2. ./data/products.json   — catalogue live (Shopify + Impact), écrit par
 *                              .github/workflows/boutique-sync.yml à partir des
 *                              secrets GitHub. Aucun secret dans ce fichier.
 *
 * Règle : la base embarquée dans app.v2.js reste la repli hors-ligne.
 * Les produits live (prix réels, liens partenaires) passent en priorité.
 */
(function (window) {
  "use strict";

  var DATA_CATALOGUE = "./data/catalogue.json";
  var DATA_LIVE = "./data/products.json";

  function fetchJSON(url) {
    if (!url) return Promise.resolve(null);
    return fetch(url, { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error(url + " → HTTP " + r.status);
        return r.json();
      })
      .catch(function (e) {
        console.warn("[KiffTech] catalogue indisponible :", e.message);
        return null;
      });
  }

  function keyOf(p) {
    return (
      String(p.brand || "").trim().toLowerCase() +
      "|" +
      String(p.model || "").trim().toLowerCase()
    );
  }

  /**
   * Fusionne des listes de produits sans doublon.
   * Les produits déjà présents (par id ou marque+modèle) sont ignorés,
   * sauf si la nouvelle occurrence est "live" (prix réel + lien d'achat).
   */
  function merge(target, incoming) {
    var ids = {};
    var keys = {};
    target.forEach(function (p) {
      if (p.id) ids[p.id] = true;
      keys[keyOf(p)] = true;
    });
    var added = 0;
    (incoming || []).forEach(function (p) {
      if (!p || !p.id || !p.model) return;
      var k = keyOf(p);
      if (ids[p.id]) {
        // Déjà connu : on enrichit avec les infos live si disponibles.
        var existing = target.find(function (x) { return x.id === p.id; });
        if (existing && p.source && !existing.source) {
          existing.source = p.source;
          existing.partner = true;
          if (p.url) existing.url = p.url;
          if (p.checkoutUrl) existing.checkoutUrl = p.checkoutUrl;
          if (p.impact && !existing.impact) existing.impact = p.impact;
          if (p.images && p.images.length && (!existing.images || !existing.images.length)) {
            existing.images = p.images;
          }
        }
        return;
      }
      if (keys[k]) return;
      ids[p.id] = true;
      keys[k] = true;
      target.push(p);
      added++;
    });
    return added;
  }

  function loadLocal() {
    return fetchJSON(DATA_CATALOGUE).then(function (json) {
      if (!json) return [];
      return Array.isArray(json) ? json : json.products || [];
    });
  }

  function loadLive() {
    return fetchJSON(DATA_LIVE).then(function (json) {
      if (!json) return { products: [], meta: null };
      return { products: Array.isArray(json) ? json : json.products || [], meta: json };
    });
  }

  /**
   * Charge tout et renvoie { local, live, meta }.
   */
  function load() {
    return Promise.all([loadLocal(), loadLive()]).then(function (res) {
      return { local: res[0], live: res[1].products, meta: res[1].meta };
    });
  }

  window.KiCatalogue = { load: load, merge: merge, loadLocal: loadLocal, loadLive: loadLive };
})(window);
