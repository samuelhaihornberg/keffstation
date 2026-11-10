/*!
 * KeffTech — Client Shopify Storefront API (Headless)
 * ============================================================================
 * Appelle l'API Storefront publique de Shopify depuis le navigateur.
 *
 * Sécurité :
 *   - N'utilise QUE le jeton Storefront PUBLIC (lecture en magasin + caisse)
 *   - N'utilise JAMAIS de jeton Admin API ni de jeton Storefront privé
 *   - Toutes les clés secrètes restent côté serveur Shopify
 */

(function (window) {
  "use strict";

  var CFG = window.KIFFTECH_SHOPIFY || {};
  var DOMAIN = CFG.domain || "";
  var TOKEN = CFG.storefrontAccessToken || "";
  var API_VERSION = CFG.apiVersion || "2024-01";
  var PAGE_SIZE = CFG.pageSize || 100;
  var ID_PREFIX = CFG.idPrefix || "shopify-";

  var ENDPOINT = DOMAIN
    ? "https://" + DOMAIN + "/api/" + API_VERSION + "/graphql.json"
    : null;

  var _cache = { products: null, ts: 0 };
  var CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  function _headers() {
    return {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    };
  }

  function _graphql(query, variables) {
    if (!ENDPOINT || !TOKEN) {
      return Promise.reject(new Error("Shopify non configuré : domaine ou jeton manquant"));
    }
    return fetch(ENDPOINT, {
      method: "POST",
      headers: _headers(),
      body: JSON.stringify({ query: query, variables: variables || {} }),
      credentials: "omit",
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (txt) {
          throw new Error("Shopify API " + res.status + ": " + txt.slice(0, 200));
        });
      }
      return res.json();
    }).then(function (json) {
      if (json.errors) {
        throw new Error("Shopify GraphQL errors: " + json.errors.map(function (e) { return e.message; }).join("; "));
      }
      return json.data;
    });
  }

  /* ========================= Produits ========================= */

  // Récupère les produits actifs et publiés sur le canal Headless
  function fetchProducts(first, after) {
    var query = "\n      query products($first: Int!, $after: String, $query: String) {\n        products(first: $first, after: $after, query: $query, sortKey: CREATED_AT, reverse: true) {\n          edges {\n            node {\n              id\n              handle\n              title\n              description\nDescriptionHtml: descriptionHtml\n              tags\n              productType\n              onlineStoreUrl\n              createdAt\n              priceRange {\n                minVariantPrice {\n                  amount\n                  currencyCode\n                }\n                maxVariantPrice {\n                  amount\n                  currencyCode\n                }\n              }\n              images(first: 5) {\n                edges {\n                  node {\n                    url\n                    altText\n                  }\n                }\n              }\n              variants(first: 100) {\n                edges {\n                  node {\n                    id\n                    title\n                    sku\n                    price {\n                      amount\n                      currencyCode\n                    }\n                    compareAtPrice {\n                      amount\n                      currencyCode\n                    }\n                    availableForSale\n                    inventoryQuantity\n                    selectedOptions {\n                      name\n                      value\n                    }\n                  }\n                }\n              }\n            }\n          }\n          pageInfo {\n            hasNextPage\n            endCursor\n          }\n        }\n      }\n    ";
    return _graphql(query, { first: first, after: after, query: "status:ACTIVE" }).then(function (data) {
      return data.products;
    });
  }

  function loadAllProducts() {
    if (_cache.products && Date.now() - _cache.ts < CACHE_TTL) {
      return Promise.resolve(_cache.products);
    }
    var all = [];
    var after = null;
    var hasNext = true;
    return (function fetchPage() {
      return fetchProducts(PAGE_SIZE, after).then(function (res) {
        var edges = res.edges || [];
        edges.forEach(function (e) { if (e && e.node) all.push(e.node); });
        hasNext = res.pageInfo && res.pageInfo.hasNextPage;
        after = res.pageInfo ? res.pageInfo.endCursor : null;
        if (hasNext && after) return fetchPage();
        _cache.products = all;
        _cache.ts = Date.now();
        return all;
      });
    })();
  }

  /* ========================= Caisse (cart Shopify) ========================= */

  // Cree une caisse Shopify avec les lignes donnees, retourne { cartId, checkoutUrl }
  function createCart(lines) {
    var mutation = "\n      mutation cartCreate($input: CartInput!) {\n        cartCreate(input: $input) {\n          cart {\n            id\n            checkoutUrl\n            totalQuantity\n            cost {\n              totalAmount { amount currencyCode }\n            }\n            lines(first: 100) {\n              edges {\n                node {\n                  id\n                  quantity\n                  merchandise {\n                    ... on ProductVariant {\n                      id\n                      title\n                      sku\n                      image { url }\n                      price { amount currencyCode }\n                      compareAtPrice { amount currencyCode }\n                    }\n                  }\n                  cost {\n                    totalAmount { amount currencyCode }\n                  }\n                }\n              }\n            }\n          }\n          userErrors { field message }\n        }\n      }\n    ";
    var input = {
      lines: lines.map(function (l) {
        return {
          merchandiseId: l.variantId,
          quantity: l.quantity || 1,
          attributes: l.attributes || [{ key: "source", value: "KiffTech" }],
        };
      }),
    };
    return _graphql(mutation, { input: input }).then(function (data) {
      if (data.cartCreate.userErrors && data.cartCreate.userErrors.length) {
        throw new Error(data.cartCreate.userErrors.map(function (e) { return e.message; }).join("; "));
      }
      return {
        cartId: data.cartCreate.cart.id,
        checkoutUrl: data.cartCreate.cart.checkoutUrl,
        totalQuantity: data.cartCreate.cart.totalQuantity,
      };
    });
  }

  // Ajoute des lignes a la caisse Shopify existante
  function addLinesToCart(cartId, lines) {
    var mutation = "\n      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {\n        cartLinesAdd(cartId: $cartId, lines: $lines) {\n          cart { id checkoutUrl }\n          userErrors { field message }\n        }\n      }\n    ";
    var inputLines = lines.map(function (l) {
      return { merchandiseId: l.variantId, quantity: l.quantity || 1 };
    });
    return _graphql(mutation, { cartId: cartId, lines: inputLines }).then(function (data) {
      if (data.cartLinesAdd.userErrors && data.cartLinesAdd.userErrors.length) {
        throw new Error(data.cartLinesAdd.userErrors.map(function (e) { return e.message; }).join("; "));
      }
      return { cartId: data.cartLinesAdd.cart.id, checkoutUrl: data.cartLinesAdd.cart.checkoutUrl };
    });
  }

  /* ========================= Mapping vers format KiffTech ========================= */

  // Convertit un produit Shopify en objet compatible KiffTech
  function toKifftechProduct(node) {
    var variants = (node.variants && node.variants.edges) ? node.variants.edges.map(function (e) { return e.node; }).filter(Boolean) : [];
    var defaultVariant = variants[0] || null;
    var images = (node.images && node.images.edges) ? node.images.edges.map(function (e) { return e.node.url; }).filter(Boolean) : [];
    var priceRange = node.priceRange || {};
    var minPrice = priceRange.minVariantPrice || { amount: 0, currencyCode: "EUR" };
    var maxPrice = priceRange.maxVariantPrice || { amount: 0, currencyCode: "EUR" };

    return {
      id: ID_PREFIX + node.handle,
      shopifyId: node.id,
      handle: node.handle,
      brand: node.productType || "Shopify",
      model: node.title,
      year: null,
      category: "Shopify",
      price: {
        official: Number(minPrice.amount) || 0,
        currency: minPrice.currencyCode || "EUR",
        max: Number(maxPrice.amount) || 0,
      },
      kifftech: {
        official: Number(minPrice.amount) || 0,
        kifftech: Number(minPrice.amount) || 0,
        discount: 0,
        savings: 0,
        freeDelivery: false,
        reason: "Prix Shopify",
        currency: minPrice.currencyCode || "EUR",
      },
      specs: {},
      images: images.length ? images : [],
      videos: [],
      shopify: true,
      partner: false,
      variants: variants.map(function (v) {
        return {
          id: ID_PREFIX + v.id,
          shopifyVariantId: v.id,
          sku: v.sku || null,
          title: v.title,
          price: Number(v.price.amount) || 0,
          compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice.amount) : null,
          currency: v.price.currencyCode || "EUR",
          availableForSale: Boolean(v.availableForSale),
          inventoryQuantity: v.inventoryQuantity != null ? v.inventoryQuantity : null,
          selectedOptions: (v.selectedOptions || []).map(function (o) { return { name: o.name, value: o.value }; }),
          image: v.image ? v.image.url : (images[0] || null),
        };
      }),
      defaultVariant: defaultVariant ? {
        id: ID_PREFIX + defaultVariant.id,
        sku: defaultVariant.sku || null,
        price: Number(defaultVariant.price.amount) || 0,
        compareAtPrice: defaultVariant.compareAtPrice ? Number(defaultVariant.compareAtPrice.amount) : null,
        availableForSale: Boolean(defaultVariant.availableForSale),
      } : null,
      onlineStoreUrl: node.onlineStoreUrl || "",
      tags: node.tags ? node.tags.split(",").map(function (t) { return t.trim(); }).filter(Boolean) : [],
      description: node.description || "",
      createdAt: node.createdAt || "",
    };
  }

  /* ========================= API publique ========================= */

  window.KiShopify = {
    isConfigured: function () { return Boolean(ENDPOINT && TOKEN); },
    config: CFG,
    loadAllProducts: loadAllProducts,
    toKifftechProduct: toKifftechProduct,
    createCart: createCart,
    addLinesToCart: addLinesToCart,
    endpoint: ENDPOINT,
  };

})(window);
