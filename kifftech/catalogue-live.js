/*!
 * KiffTech — Chargement du catalogue etendu + catalogue live
 * ============================================================================
 * Trois flux de produits, UNE seule regle de priorite (aucun doublon) :
 *
 *   1. LOCAL  — LOCAL_DB (app.v2.js) + data/catalogue.json
 *      Catalogue de fond : 25+ produits par rayon, photos CC, apercus generes.
 *   2. LIVE   — data/products.json (Shopify + Impact + exports locaux)
 *      Prix REELS, photos reelles, liens d'achat : c'est la source de verite.
 *   3. IMPORT — exports CSV/JSON deposes dans kifftech/data/
 *
 * REGLE : quand un produit live correspond a un produit local (meme id ou
 * meme marque + meme modele), c'est le produit LIVE qui gagne :
 *   - son prix remplace le prix local (pas de remise inventee sur un prix reel)
 *   - ses images remplacent les images locales
 *   - il est marque "live" (badge Boutique / Impact dans le lecteur)
 * Le produit local reste en secours si le flux live est indisponible.
 *
 * Aucune API ne "contredit" l'autre : Shopify et Impact alimentent le meme
 * flux live, dedoublonne par identifiant, puis par marque + modele.
 */
(function (window) {
  "use strict";

  // URL de base du site KiffTech, deduite de l'URL du script lui-meme :
  // fonctionne aussi bien a la racine (/kifftech/) que dans une page de rayon
  // (/kifftech/rayon/tablettes/).
  var BASE = (function () {
    try {
      var s = document.currentScript;
      if (!s) {
        var list = document.getElementsByTagName("script");
        for (var i = list.length - 1; i >= 0; i--) {
          if (list[i].src && /catalogue-live\.js/.test(list[i].src)) { s = list[i]; break; }
        }
      }
      if (s && s.src) return s.src.replace(/catalogue-live\.js.*$/, "");
    } catch (e) {}
    return "./";
  })();
  // Chemin dynamique deduit de l'URL du script : fonctionne sur kiffstation.com
  // (custom domain a la racine) comme dans un sous-dossier local. Plus de chemin
  // en dur qui bloque le chargement de data/catalogue.json et data/products.json.
  window.KIFFTECH_BASE = BASE;

  var DATA_CATALOGUE = window.KIFFTECH_BASE + "data/catalogue.json";
  var DATA_LIVE = window.KIFFTECH_BASE + "data/products.json";

  /* ---------------- normalisation des cles de rapprochement ---------------- */
  function stripAccents(s) {
    return String(s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  /* Cle stricte : marque + modele, sans accents ni ponctuation. */
  function strictKey(p) {
    return (
      stripAccents(p.brand || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() +
      "|" +
      stripAccents(p.model || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
    );
  }

  /* Jetons d'IDENTITE : volume, capacite, generation, edition.
     Ils distinguent deux produits reellement differents :
     "Xiaomi Pad 7 Ultra" (ultra) != "Xiaomi Pad 7" (rien)
     "Samsung 990 PRO 4 To" (4to) != "Samsung 990 Pro 2To" (2to)
     L'annee est ignoree : "AirPods 3" == "AirPods 3 (2023)". */
  var IDENTITY_RE = /\b(\d+\s?(go|to|gb|tb|ko|mo)\b|\b(pro|max|plus|mini|ultra|lite|air|se)\b)/g;
  function identityTokens(p) {
    var t = stripAccents(p.model || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    var found = [];
    var m;
    var re = new RegExp(IDENTITY_RE.source, "g");
    while ((m = re.exec(t)) !== null) found.push(m[0].replace(/\s+/g, ""));
    return found.sort().join(",");
  }

  /* Deux produits ne sont le meme que si leurs jetons d'identite coincident. */
  function sameIdentity(a, b) {
    return identityTokens(a) === identityTokens(b);
  }

  /* Cle souple : modele sans les jetons d'identite ni l'annee. */
  function looseKey(p) {
    var b = stripAccents(p.brand || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    var m = stripAccents(p.model || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    m = m.replace(IDENTITY_RE, " ").replace(/\b(19|20)\d{2}\b/g, " ").replace(/\s+/g, " ").trim();
    return b + "|" + m;
  }

  // La boutique doit etre PERSISTANTE : le catalogue est conserve en local
  // (localStorage) et servi depuis ce cache si le reseau echoue.
  var LS_CATALOGUE = "kifftech.catalogue.v1";
  var LS_LIVE = "kifftech.live.v1";

  function saveLocal(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify({ at: Date.now(), data: value }));
    } catch (e) {
      /* quota atteint : on ignore, le cache du SW suffira */
    }
  }

  function readLocal(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      return obj && obj.data ? obj.data : null;
    } catch (e) {
      return null;
    }
  }

  function fetchJSON(url, cacheKey) {
    if (!url) return Promise.resolve(null);
    return fetch(url, { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error(url + " → HTTP " + r.status);
        return r.json();
      })
      .then(function (json) {
        if (cacheKey) saveLocal(cacheKey, json);
        return json;
      })
      .catch(function (e) {
        const cached = cacheKey ? readLocal(cacheKey) : null;
        if (cached) {
          console.warn("[KiffTech] catalogue servi depuis le cache local :", e.message);
          return cached;
        }
        console.warn("[KiffTech] catalogue indisponible :", e.message);
        return null;
      });
  }

  /**
   * Fusionne une liste de produits entrants dans la liste cible.
   * Regles :
   *  - meme id                    -> meme produit (mise a jour)
   *  - meme cle stricte + memes jetons d'identite -> meme produit (mise a jour)
   *  - cle souple unique + memes jetons d'identite -> correspondance (live uniquement)
   *  - sinon                      -> produit distinct : il est AJOUTE (jamais perdu)
   * Le flux LIVE remplace les prix / images / liens du produit local equivalent.
   */
  function merge(target, incoming, opts) {
    opts = opts || {};
    var live = !!opts.live;
    var byId = {};
    var byStrict = {};
    var byLoose = {};
    target.forEach(function (p) {
      if (p.id) byId[p.id] = p;
      var ks = strictKey(p);
      if (ks !== "|") byStrict[ks] = p;
      var kl = looseKey(p);
      if (kl !== "|") {
        byLoose[kl] = byLoose[kl] || [];
        byLoose[kl].push(p);
      }
    });

    var added = 0;
    var updated = 0;
    (incoming || []).forEach(function (p) {
      if (!p || !p.id || !p.model) return;
      var ks = strictKey(p);
      var kl = looseKey(p);
      var looseHits = kl !== "|" ? byLoose[kl] : null;
      var looseMatch = null;
      if (looseHits && looseHits.length === 1 && sameIdentity(looseHits[0], p)) looseMatch = looseHits[0];
      var strictMatch = byStrict[ks];
      if (strictMatch && !sameIdentity(strictMatch, p)) strictMatch = null;

      var existing = byId[p.id] || strictMatch || (live ? looseMatch : null);

      if (existing) {
        if (live) {
          // Le flux live est la source de verite pour les prix.
          if (p.price && Number(p.price.official) > 0) existing.price = p.price;
          if (p.images && p.images.length) existing.images = p.images;
          if (p.description) existing.description = p.description;
          if (p.url) existing.url = p.url;
          if (p.checkoutUrl) existing.checkoutUrl = p.checkoutUrl;
          if (p.impact) existing.impact = p.impact;
          if (p.source) existing.source = p.source;
          existing.live = true;
          existing.partner = true;
          updated++;
        } else {
          // Catalogue local : on complete le produit existant, on ne le jette pas.
          if ((!existing.images || !existing.images.length) && p.images && p.images.length) existing.images = p.images;
          if (!existing.description && p.description) existing.description = p.description;
          if ((!existing.specs || !Object.keys(existing.specs).length) && p.specs) existing.specs = p.specs;
          updated++;
        }
        return;
      }

      p.live = live;
      if (live) p.partner = true;
      target.push(p);
      added++;
      if (p.id) byId[p.id] = p;
      if (ks !== "|") byStrict[ks] = p;
      if (kl !== "|") {
        byLoose[kl] = byLoose[kl] || [];
        byLoose[kl].push(p);
      }
    });
    return { added: added, updated: updated };
  }

  function loadLocal() {
    return fetchJSON(DATA_CATALOGUE, LS_CATALOGUE).then(function (json) {
      if (!json) return [];
      return Array.isArray(json) ? json : json.products || [];
    });
  }

  function loadLive() {
    return fetchJSON(DATA_LIVE, LS_LIVE).then(function (json) {
      if (!json) return { products: [], meta: null };
      return { products: Array.isArray(json) ? json : json.products || [], meta: json };
    });
  }

  function load() {
    return Promise.all([loadLocal(), loadLive()]).then(function (res) {
      return { local: res[0], live: res[1].products, meta: res[1].meta };
    });
  }

  window.KiCatalogue = {
    load: load,
    merge: merge,
    loadLocal: loadLocal,
    loadLive: loadLive,
    strictKey: strictKey,
    looseKey: looseKey,
    identityTokens: identityTokens,
    sameIdentity: sameIdentity,
  };
})(window);
