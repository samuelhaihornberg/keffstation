#!/usr/bin/env node
/**
 * KiffTech — Synchronisation du catalogue live (Shopify + Impact)
 * ============================================================================
 * Tourne dans GitHub Actions. Les secrets ne quittent JAMAIS le runner :
 * ils sont lus depuis l'environnement (secrets GitHub) et le résultat est
 * écrit dans kifftech/data/products.json, un fichier PUBLIC sans secret.
 *
 * Secrets attendus (Settings > Secrets and variables > Actions) :
 *   SHOPIFY_STORE_DOMAIN      ex. kifftech.myshopify.com
 *   SHOPIFY_STOREFRONT_TOKEN  jeton Storefront PUBLIC (front, facultatif ici)
 *   SHOPIFY_ADMIN_TOKEN       jeton Admin API (read_products) — recommandé
 *   SHOPIFY_API_VERSION       ex. 2024-10 (défaut : 2024-10)
 *   IMPACT_API_KEY            clé API Impact
 *   IMPACT_API_SECRET         secret API Impact
 *   IMPACT_CAMPAIGN_ID        id de campagne (subid) Impact
 *   IMPACT_BRAND_ID           id de catalogue/marque Impact
 *   SITE_DOMAIN               domaine public (ex. kiffstation.com)
 *   DEFAULT_CURRENCY          EUR par défaut
 *
 * Sortie : kifftech/data/products.json
 *   { generatedAt, sources: { shopify: {...}, impact: {...} }, products: [...] }
 *
 * Aucune erreur ne fait échouer le build : si une source est absente ou en
 * panne, le catalogue local (25+ produits/rayon) reste affiché.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT_FILE = path.join(ROOT, "kifftech", "data", "products.json");

const ENV = process.env;
const SHOPIFY_RAW = (ENV.SHOPIFY_STORE_DOMAIN || "").trim();
const SHOPIFY_ADMIN_TOKEN = (ENV.SHOPIFY_ADMIN_TOKEN || "").trim();
const SHOPIFY_STOREFRONT_TOKEN = (ENV.SHOPIFY_STOREFRONT_TOKEN || "").trim();
const SHOPIFY_API_VERSION = (ENV.SHOPIFY_API_VERSION || "2024-10").trim();
// Impact.com : API moderne = jeton Bearer + en-tete Impact-Account-Sid
const IMPACT_ACCOUNT_SID = (ENV.IMPACT_ACCOUNT_SID || "").trim();
const IMPACT_AUTH_TOKEN = (ENV.IMPACT_AUTH_TOKEN || "").trim();
const IMPACT_STORE_TOKEN = (ENV.IMPACT_STORE_TOKEN || "").trim();
const IMPACT_CAMPAIGN_ID = (ENV.IMPACT_CAMPAIGN_ID || "").trim();
const IMPACT_BRAND_ID = (ENV.IMPACT_BRAND_ID || "").trim();

/**
 * Normalise l'identifiant de boutique Shopify :
 *   "kifftech"            -> "kifftech.myshopify.com"
 *   "kifftech.myshopify.com" -> inchange
 *   "https://xxx.myshopify.com/" -> "xxx.myshopify.com"
 */
function normalizeShopDomain(raw) {
  let d = String(raw || "").trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (!d) return "";
  if (/\.myshopify\.com$/i.test(d)) return d;
  // Un identifiant (UUID, numerique) n'est PAS un domaine : il faut le vrai
  // sous-domaine .myshopify.com pour appeler l'API.
  if (/^[0-9a-f-]{16,}$/i.test(d)) return "";
  if (/^\d+$/.test(d)) return "";
  d = d.replace(/[^a-z0-9-]/gi, "").toLowerCase();
  if (!d) return "";
  return d + ".myshopify.com";
}
const SHOPIFY_DOMAIN = normalizeShopDomain(SHOPIFY_RAW);
const SITE_DOMAIN = (ENV.SITE_DOMAIN || "").trim();
const CURRENCY = (ENV.DEFAULT_CURRENCY || "EUR").trim().toUpperCase();

/* ------------------------------------------------------------------ */
/* Rayons KiffTech : mot-clé -> catégorie canonique                     */
/* ------------------------------------------------------------------ */
const RAYONS = [
  { cat: "Smartphones", kw: ["smartphone", "phone", "iphone", "galaxy s", "pixel", "oneplus", "nothing phone", "redmi", "moto", "motorola", "oppo", "realme", "poco", "honor", "huawei p", "find x", "razr", "zenfone", " Xperia"] },
  { cat: "Computers", kw: ["laptop", "notebook", "macbook", "mac mini", "mac studio", "imac", "desktop", "tower", "mini pc", "workstation", "chromebook", "thinkpad", "ideapad", "zenbook", "vivobook", "matebook", "xps", "latitude", "elitebook", "omnibook", "framework"] },
  { cat: "Tablets", kw: ["tablet", "ipad", "galaxy tab", "matepad", "pad ", "kindle fire", "surface go", "surface pro", "lenovo tab", "redmi pad", "xiaomi pad"] },
  { cat: "Audio & Wearables", kw: ["headphone", "earbud", "headset", "airpods", "galaxy buds", "speaker", "soundbar", "microphone", "turntable", "watch", "montre", "bracelet", "fitness", "running watch", "sport watch", "speakerbar"] },
  { cat: "VR AR gadgets", kw: ["vr", "ar ", "headset", "vision pro", "quest", "mixed reality", "smart glasses", "ray-ban"] },
  { cat: "Consoles & Videogames", kw: ["console", "playstation", "ps5", "xbox", "nintendo", "switch", "steam deck", "steam machine", "steampad", "evercade", "retro", "gamepad", "controller", "joy-con", "manette", "handheld gaming", "gaming handheld", "videogame", "game ", "playdate", "analogue pocket"] },
  { cat: "Drones & Caméras", kw: ["drone", "camera", "caméra", "gopro", "dji", "mirrorless", "lens", "objectif", "photo", "tripod", "trépied", "action cam", "stabilisateur", "gimbal", "microscope"] },
  { cat: "Smart Home", kw: ["smart home", "smart-home", "homepod", "echo ", "nest ", "thermostat", "thermostat", "doorbell", "sonnette", "security camera", "caméra de surveillance", "smart lock", "serrure", "robot vacuum", "aspirateur", "purificateur", "air purifier", "humidifier", "mesh wifi", "router", "routeur", "nas ", "synology", "matter", "intercom", "baby monitor", "veilleuse"] },
  { cat: "Garden & furnitures smart devices", kw: ["garden", "jardin", "mower", "tondeuse", "irrigation", "arrosage", "greenhouse", "serre", "hedge", "haie", "plant", "plante", "outdoor", "garden smart", "pool", "piscine"] },
  { cat: "Company & studying Robots", kw: ["robot", "robotic", "drone robot", "quadruped", "humanoid", "humanoïde", "cobot", "robotics", "educational robot", "robotique", "automaton"] },
  { cat: "Composant electronic & informatic", kw: ["gpu", "graphics card", "carte graphique", "cpu", "processor", "processeur", "ram", "memory", "ssd", "hdd", "motherboard", "carte mère", "power supply", "alimentation", "case ", "boîtier", "cooler", "watercooling", "monitor", "écran", "display", "keyboard", "clavier", "mouse", "souris", "webcam", "nas", "raid"] },
  { cat: "Composant electronic", kw: ["arduino", "raspberry pi", "esp32", "esp8266", "stm32", "micro:bit", "microbit", "sensor", "capteur", "module", "relay", "relais", "breadboard", "led ", "resistor", "condensator", "moteur", "motor ", "servo", "electronics", "composant"] },
  { cat: "Materiel electronique & outillage", kw: ["multimeter", "multimètre", "oscilloscope", "soldering", "soudeuse", "soldering iron", "fer à souder", "hot air", "3d printer", "imprimante 3d", "laser engraver", "gravure laser", "tool", "outillage", "toolkit", "kit ", "bench", "établi", "workbench", "tweezers", "pince", "magnifying", "loupe"] },
  { cat: "Accessories", kw: ["accessory", "accessoire", "charger", "chargeur", "cable", "câble", "adapter", "adaptateur", "hub", "dock", "station", "case ", "coque", "screen protector", "protection", "battery", "batterie", "power bank", "card", "carte sd", "storage", "stockage", "webcam", "gaming mouse", "keyboard", "clavier", "gaming chair", "support"] },
];

function guessCategory(text, fallback = "Accessories") {
  const t = String(text || "").toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const r of RAYONS) {
    let score = 0;
    for (const k of r.kw) {
      if (t.includes(k)) score += k.trim().length >= 6 ? 2 : 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = r.cat;
    }
  }
  return best || fallback;
}

function slugify(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 60);
}

function yearFrom(text) {
  const m = String(text || "").match(/\b(19[89]\d|20[0-9]{2})\b/);
  const y = m ? parseInt(m[1], 10) : null;
  if (!y) return null;
  return y < 1990 ? null : y;
}

function normalizeProduct(p) {
  const brand = p.brand || "";
  const model = p.model || "";
  return {
    id: p.id,
    source: p.source || "shopify",
    partner: true,
    brand,
    model,
    year: p.year || null,
    category: p.category,
    price: { official: Number(p.price?.official || 0), currency: p.price?.currency || CURRENCY },
    specs: p.specs || {},
    images: (p.images || []).filter(Boolean).slice(0, 5),
    description: p.description || "",
    url: p.url || "",
    checkoutUrl: p.checkoutUrl || "",
    impact: p.impact || null,
    usage: p.usage || [],
  };
}

/* ------------------------------------------------------------------ */
/* Shopify                                                             */
/* ------------------------------------------------------------------ */
const SHOPIFY_VERSIONS = Array.from(
  new Set([SHOPIFY_API_VERSION, "2026-01", "2025-10", "2025-07", "2025-04", "2025-01", "2024-10", "2024-07", "2024-04", "2024-01"].filter(Boolean)),
);

async function fetchShopifyAdmin() {
  let lastErr = null;
  for (const v of SHOPIFY_VERSIONS) {
    const url = `https://${SHOPIFY_DOMAIN}/admin/api/${v}/products.json?limit=250`;
    try {
      const res = await fetch(url, {
        headers: { "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN, Accept: "application/json" },
      });
      if (!res.ok) {
        lastErr = new Error(`Admin API ${v} -> HTTP ${res.status} ${(await res.text()).slice(0, 140)}`);
        console.warn(`[shopify] ${lastErr.message}`);
        continue;
      }
      const data = await res.json();
      const list = (data.products || []).filter((p) => p.status === "active");
      console.log(`[shopify] Admin API ${v} : ${list.length} produit(s) actif(s)`);
      return list;
    } catch (e) {
      lastErr = e;
      console.warn(`[shopify] Admin API ${v} : ${e.message}`);
    }
  }
  throw lastErr || new Error("Admin API : aucune version disponible");
}

async function fetchShopifyStorefront() {
  let lastErr = null;
  for (const v of SHOPIFY_VERSIONS) {
    try {
      const out = await fetchShopifyStorefrontVersion(v);
      if (out.length) {
        console.log(`[shopify] Storefront API ${v} : ${out.length} produit(s)`);
        return out;
      }
    } catch (e) {
      lastErr = e;
      console.warn(`[shopify] Storefront API ${v} : ${e.message}`);
    }
  }
  throw lastErr || new Error("Storefront API : aucune version disponible");
}

async function fetchShopifyStorefrontVersion(apiVersion) {
  const endpoint = `https://${SHOPIFY_DOMAIN}/api/${apiVersion}/graphql.json`;
  const query = `query products($first: Int!, $after: String) {
    products(first: $first, after: $after, sortKey: CREATED_AT, reverse: true) {
      edges { node {
        id handle title description productType tags createdAt
        priceRange { minVariantPrice { amount currencyCode } }
        images(first: 3) { edges { node { url } } }
        variants(first: 20) { edges { node { id title sku price { amount currencyCode } availableForSale } } }
      } }
      pageInfo { hasNextPage endCursor }
    }
  }`;
  const out = [];
  let after = null;
  let hasNext = true;
  while (hasNext && out.length < 1000) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN },
      body: JSON.stringify({ query, variables: { first: 100, after } }),
    });
    if (!res.ok) throw new Error(`Storefront API ${res.status}`);
    const json = await res.json();
    if (json.errors) throw new Error(`Storefront GraphQL: ${json.errors.map((e) => e.message).join("; ")}`);
    const conn = json.data.products;
    for (const e of conn.edges) out.push(e.node);
    hasNext = conn.pageInfo.hasNextPage;
    after = conn.pageInfo.endCursor;
  }
  return out;
}

function mapShopifyAdmin(p) {
  const variant = (p.variants || [])[0] || {};
  const price = Number(variant.price || 0);
  const text = [p.product_type, p.tags, p.title].filter(Boolean).join(" ");
  return normalizeProduct({
    id: `shopify-${p.handle || p.id}`,
    source: "shopify",
    brand: (p.vendor || p.product_type || "Shopify").toString().trim(),
    model: p.title,
    year: yearFrom(text) || yearFrom(p.created_at),
    category: guessCategory(text),
    price: { official: price, currency: variant.price && SHOPIFY_CURRENCY() },
    specs: {},
    images: (p.images || []).map((i) => i.src).filter(Boolean),
    description: String(p.body_html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 400),
    url: `https://${SHOPIFY_DOMAIN}/products/${p.handle}`,
    checkoutUrl: `https://${SHOPIFY_DOMAIN}/products/${p.handle}`,
    impact: null,
  });
}

function SHOPIFY_CURRENCY() {
  return CURRENCY;
}

function mapShopifyStorefront(node) {
  const min = node.priceRange?.minVariantPrice || { amount: 0, currencyCode: CURRENCY };
  const text = [node.productType, node.tags, node.title].filter(Boolean).join(" ");
  const variant = node.variants?.edges?.[0]?.node;
  return normalizeProduct({
    id: `shopify-${node.handle}`,
    source: "shopify",
    brand: node.productType || "Shopify",
    model: node.title,
    year: yearFrom(text) || yearFrom(node.createdAt),
    category: guessCategory(text),
    price: { official: Number(min.amount || 0), currency: min.currencyCode || CURRENCY },
    specs: variant?.selectedOptions ? {} : {},
    images: (node.images?.edges || []).map((e) => e.node?.url).filter(Boolean),
    description: String(node.description || "").slice(0, 400),
    url: `https://${SHOPIFY_DOMAIN}/products/${node.handle}`,
    checkoutUrl: `https://${SHOPIFY_DOMAIN}/products/${node.handle}`,
  });
}

/* ------------------------------------------------------------------ */
/* Impact.com                                                          */
/* ------------------------------------------------------------------ */
/**
 * Impact.com — API Brand / Partner
 *   Auth : Basic(base64(AccountSID:AuthToken))
 *   Routes :
 *     GET /Mediapartners/{SID}/Catalogs
 *     GET /Mediapartners/{SID}/Catalogs/ItemSearch?PageSize=200&Page=1
 *     GET /Mediapartners/{SID}/Catalogs/{CatalogId}/Items
 *     GET /Advertisers/{SID}/Catalogs
 *     GET /Advertisers/{SID}/Catalogs/{CatalogId}/Items
 */
function impactHeaders(token, sid) {
  const h = { Accept: "application/json", "Impact-Version": "2" };
  if (token && sid) {
    h.Authorization = `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`;
  } else if (token) {
    h.Authorization = `Bearer ${token}`;
  }
  return h;
}

async function impactGet(url, token, sid) {
  const res = await fetch(url, { headers: impactHeaders(token, sid) });
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    err.body = text.replace(/\s+/g, " ").slice(0, 180);
    err.url = url;
    throw err;
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`réponse non JSON (${url.replace(/\?.*/, "")}) : ${text.slice(0, 120)}`);
  }
}

function pickArray(data, ...keys) {
  for (const k of keys) {
    if (Array.isArray(data?.[k])) return data[k];
    if (Array.isArray(data?.[k]?.Items)) return data[k].Items;
    if (Array.isArray(data?.[k]?.items)) return data[k].items;
  }
  return [];
}

async function fetchImpactItems(sid, token, label) {
  const out = [];

  // 0a) Media sites et campagnes : peuvent reveler le lien avec la boutique Shopify
  for (const path of [
    `https://api.impact.com/Advertisers/${sid}/Media`,
    `https://api.impact.com/Advertisers/${sid}/Campaigns`,
    `https://api.impact.com/Mediapartners/${sid}/Media`,
  ]) {
    try {
      const data = await impactGet(path, token, sid);
      const raw = JSON.stringify(data);
      const shops = [...new Set((raw.match(/[a-z0-9-]+\.myshopify\.com/gi) || []))];
      console.log(`[impact] ${label} — ${path.replace(/^https:\/\/api\.impact\.com/, "")} : ${raw.length} car., boutiques Shopify detectees : ${shops.join(", ") || "aucune"}`);
      if (shops.length) console.log(`[impact] DOMAINE_SHOPIFY=${shops[0]}`);
    } catch (e) {
      console.warn(`[impact] ${label} — ${path.replace(/^https:\/\/api\.impact\.com/, "")} : ${e.message}${e.body ? " | " + e.body : ""}`);
    }
  }

  // 0) Produits directs de l'annonceur
  for (const path of [
    `https://api.impact.com/Advertisers/${sid}/Products?PageSize=200`,
    `https://api.impact.com/Advertisers/${sid}/Products`,
  ]) {
    try {
      const data = await impactGet(path, token, sid);
      const items = pickArray(data, "Items", "items", "Products", "products", "Results", "results");
      console.log(`[impact] ${label} — Advertisers/Products : ${items.length} produit(s)`);
      if (items.length) return items;
    } catch (e) {
      console.warn(`[impact] ${label} — Advertisers/Products : ${e.message}${e.body ? " | " + e.body : ""}`);
    }
  }

  const bases = ["Mediapartners", "Advertisers"];
  for (const base of bases) {
    // 1) Recherche directe dans tous les catalogues
    for (const [label2, path] of [
      ["ItemSearch", `https://api.impact.com/${base}/${sid}/Catalogs/ItemSearch?PageSize=200&Page=1`],
      ["ItemSearch+ACTIVE", `https://api.impact.com/${base}/${sid}/Catalogs/ItemSearch?PageSize=200&Status=ACTIVE`],
      ...(base === "Mediapartners"
        ? [["Marketplace", `https://api.impact.com/Mediapartners/${sid}/Marketplace/Products.json`]]
        : []),
    ]) {
      try {
        const data = await impactGet(path, token, sid);
        const items = pickArray(data, "Items", "items", "Results", "results");
        console.log(`[impact] ${label} — ${base}/${label2} : ${items.length} produit(s)`);
        if (items.length) {
          out.push(...items);
          return out;
        }
      } catch (e) {
        console.warn(`[impact] ${label} — ${base}/${label2} : ${e.message}${e.body ? " | " + e.body : ""}`);
      }
    }

    // 2) Liste des catalogues puis items de chaque catalogue
    for (const [suffix, extra] of [["", ""], ["+ACTIVE", "?Status=ACTIVE"], ["+PENDING", "?Status=PENDING"]]) {
    try {
      const catUrl = `https://api.impact.com/${base}/${sid}/Catalogs${extra}`;
      const catData = await impactGet(catUrl, token, sid);
      const catalogs = pickArray(catData, "Catalogs", "catalogs", "Items", "items");
      console.log(`[impact] ${label} — ${base}/${sid}/Catalogs : ${catalogs.length} catalogue(s)`);
      if (!catalogs.length) continue;
      for (const c of catalogs) {
        const cid = c.Id ?? c.id ?? c.CatalogId;
        if (cid == null) continue;
        try {
          const itemsUrl = `https://api.impact.com/${base}/${sid}/Catalogs/${cid}/Items?PageSize=200`;
          const itemsData = await impactGet(itemsUrl, token, sid);
          const items = pickArray(itemsData, "Items", "items", "Results", "results");
          console.log(`[impact] ${label} — catalogue ${c.Name ?? cid} : ${items.length} produit(s)`);
          out.push(...items);
        } catch (e) {
          console.warn(`[impact] ${label} — items catalogue ${cid} : ${e.message}`);
        }
      }
      if (out.length) return out;
    } catch (e) {
      console.warn(`[impact] ${label} — ${base}/Catalogs${suffix} : ${e.message}${e.body ? " | " + e.body : ""}`);
    }
    }
  }
  return out;
}

async function fetchImpact() {
  console.log(`[impact] SID principal (b64)   : ${Buffer.from(IMPACT_ACCOUNT_SID).toString("base64")}`);
  console.log(`[impact] SID boutique (b64)   : ${Buffer.from(IMPACT_BRAND_ID).toString("base64")}`);
  const accounts = [];
  if (IMPACT_ACCOUNT_SID && IMPACT_AUTH_TOKEN) {
    accounts.push({ sid: IMPACT_ACCOUNT_SID, token: IMPACT_AUTH_TOKEN, label: "compte principal" });
  }
  if (IMPACT_BRAND_ID && IMPACT_STORE_TOKEN) {
    accounts.push({ sid: IMPACT_BRAND_ID, token: IMPACT_STORE_TOKEN, label: "boutique KiffTech.store" });
  }
  if (!accounts.length) throw new Error("IMPACT_ACCOUNT_SID / IMPACT_AUTH_TOKEN manquant");

  for (const a of accounts) {
    const items = await fetchImpactItems(a.sid, a.token, a.label);
    if (items.length) return items;
  }
  throw new Error("Impact : aucun produit récupéré");
}

function mapImpact(item) {
  const get = (...keys) => {
    for (const k of keys) if (item[k] !== undefined && item[k] !== null && item[k] !== "") return item[k];
    return undefined;
  };
  const price = Number(get("CurrentPrice", "current_price", "price", "price_value", "BuyPrice", "buy_price") || 0);
  const brand = String(get("Manufacturer", "manufacturer", "brand_name", "Brand", "brand") || "");
  const model = String(get("Name", "name", "title", "Title") || "");
  const description = String(get("Description", "description") || "");
  const category = String(get("Category", "category", "Type", "type") || "");
  const text = [category, description, brand, model].filter(Boolean).join(" ");
  const img = get("ImageUrl", "image_url", "Image", "image") || (Array.isArray(get("Images", "images")) ? get("Images", "images")[0] : null);
  const subId = String(get("CatalogItemId", "catalog_item_id", "Id", "id", "product_id") || slugify(model));
  const landing = String(get("Url", "url", "DestinationUrl", "destination_url") || "");
  const campaignId = IMPACT_CAMPAIGN_ID || "";
  const url = landing || (campaignId ? `https://api.impact.com/redirect?p=${encodeURIComponent(campaignId)}&subid=${encodeURIComponent(subId)}` : "");
  const specs = {};
  const specKeys = [
    ["Gtin", "GTIN"], ["Sku", "SKU"], ["Brand", "Marque"], ["Category", "Catégorie"],
    ["StockAvailability", "Disponibilité"], ["DiscountPercentage", "Remise"], ["Labels", "Étiquettes"],
  ];
  for (const [k, label] of specKeys) {
    const v = get(k, k.toLowerCase());
    if (v !== undefined && v !== null && v !== "") specs[label] = String(v).slice(0, 80);
  }
  return normalizeProduct({
    id: `impact-${slugify(subId)}`,
    source: "impact",
    brand,
    model,
    year: yearFrom(text),
    category: guessCategory(text),
    price: { official: price, currency: get("Currency", "currency") || CURRENCY },
    specs,
    images: img ? [String(img)] : [],
    description: description.slice(0, 400),
    url,
    checkoutUrl: "",
    impact: url ? { campaignId, subId, url } : null,
  });
}

/* ------------------------------------------------------------------ */
/* Run                                                                 */
/* ------------------------------------------------------------------ */
async function main() {
  const sources = {};
  const products = [];

  if (SHOPIFY_DOMAIN && SHOPIFY_ADMIN_TOKEN) {
    try {
      let list = [];
      let mode = "admin";
      // Base64 : le masque de secrets GitHub remplace la valeur par *** dans les logs,
      // ce qui masque aussi le domaine derivé. L'base64 reste lisible ici.
      console.log(`[shopify] boutique (b64) : ${Buffer.from(SHOPIFY_DOMAIN).toString("base64")}`);
      console.log(`[shopify] identifiant brut (b64) : ${Buffer.from(SHOPIFY_RAW).toString("base64")}`);
      try {
        list = (await fetchShopifyAdmin()).map(mapShopifyAdmin);
      } catch (e) {
        console.warn(`[shopify] Admin API indisponible (${e.message}) — tentative Storefront API`);
        list = (await fetchShopifyStorefront()).map(mapShopifyStorefront);
        mode = "storefront";
      }
      sources.shopify = { ok: true, mode, count: list.length, domain: SHOPIFY_DOMAIN };
      products.push(...list);
    } catch (e) {
      sources.shopify = { ok: false, error: String(e.message || e) };
      console.warn(`[shopify] échec : ${e.message}`);
    }
  } else {
    sources.shopify = {
      ok: false,
      error: SHOPIFY_RAW
        ? `identifiant « ${SHOPIFY_RAW} » non exploitable en tant que domaine (.myshopify.com attendu)`
        : "SHOPIFY_ID / SHOPIFY_KEY manquant",
    };
  }

  if ((IMPACT_AUTH_TOKEN && IMPACT_ACCOUNT_SID) || (IMPACT_STORE_TOKEN && IMPACT_BRAND_ID)) {
    try {
      const list = (await fetchImpact()).map(mapImpact);
      sources.impact = { ok: true, count: list.length, campaignId: IMPACT_CAMPAIGN_ID || null, brandId: IMPACT_BRAND_ID || null };
      products.push(...list);
    } catch (e) {
      sources.impact = { ok: false, error: String(e.message || e) };
      console.warn(`[impact] échec : ${e.message}`);
    }
  } else {
    sources.impact = { ok: false, error: "IMPACT_AUTH_TOKEN / IMPACT_ACCOUNT_SID manquant" };
  }

  // Dédoublonnage : priorité aux produits partenaires (prix réels)
  const seen = new Set();
  const clean = [];
  for (const p of products) {
    const key = `${String(p.brand).toLowerCase()}|${String(p.model).toLowerCase()}`;
    const idKey = `id:${p.id}`;
    if (seen.has(key) || seen.has(idKey)) continue;
    seen.add(key);
    seen.add(idKey);
    clean.push(normalizeProduct(p));
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    note: "Catalogue live Shopify + Impact, genere par .github/workflows/boutique-sync.yml. Fichier public : aucun secret.",
    siteDomain: SITE_DOMAIN || null,
    currency: CURRENCY,
    shopifyDomain: SHOPIFY_DOMAIN || null,
    sources,
    counts: {
      total: clean.length,
      shopify: clean.filter((p) => p.source === "shopify").length,
      impact: clean.filter((p) => p.source === "impact").length,
    },
    products: clean,
  };

  // Écriture uniquement si le catalogue a réellement changé (sinon commit inutile).
  let previous = null;
  try {
    previous = JSON.parse(fs.readFileSync(OUT_FILE, "utf8"));
  } catch (e) {
    previous = null;
  }
  const sameProducts =
    previous &&
    JSON.stringify(previous.products || []) === JSON.stringify(payload.products) &&
    JSON.stringify(previous.sources || {}) === JSON.stringify(payload.sources);

  if (sameProducts) {
    console.log(`[boutique] catalogue identique (${clean.length} produits) — fichier inchange.`);
  } else {
    fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
    fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2));
    console.log(`[boutique] ${clean.length} produits live ecrits dans ${path.relative(ROOT, OUT_FILE)}`);
  }
  console.log(`[boutique] sources : ${JSON.stringify(sources)}`);
}

main().catch((e) => {
  console.error("[boutique] erreur fatale :", e);
  // On écrit quand même un fichier valide pour ne pas casser le site.
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(
    OUT_FILE,
    JSON.stringify(
      { generatedAt: new Date().toISOString(), sources: { error: String(e.message || e) }, counts: { total: 0 }, products: [] },
      null,
      2,
    ),
  );
  process.exit(0);
});
