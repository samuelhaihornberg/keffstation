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
  if (/^\d+$/.test(d)) return ""; // identifiant numerique : pas un domaine utilisable
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
async function fetchShopifyAdmin() {
  const url = `https://${SHOPIFY_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/products.json?limit=250&fields=id,title,handle,product_type,tags,status,variants,images,body_html,created_at`;
  const res = await fetch(url, {
    headers: { "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Admin API ${res.status} ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return (data.products || []).filter((p) => p.status === "active");
}

async function fetchShopifyStorefront() {
  const endpoint = `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
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
 * Impact.com : authentification moderne
 *   Authorization: Bearer <IMPACT_AUTH_TOKEN>
 *   Impact-Account-Sid: <IMPACT_ACCOUNT_SID>
 * (un couple SID + jeton est aussi disponible pour la boutique KiffTech.store)
 */
function impactHeaders(token, sid) {
  const h = { Accept: "application/json", "Impact-Version": "2" };
  if (token) h.Authorization = `Bearer ${token}`;
  if (sid) h["Impact-Account-Sid"] = sid;
  return h;
}

async function impactGet(url, token, sid) {
  const res = await fetch(url, { headers: impactHeaders(token, sid) });
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} ${url.replace(/\?.*/, "")}`);
    err.status = res.status;
    err.body = text.slice(0, 160);
    throw err;
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`reponse non JSON (${url.replace(/\?.*/, "")}) : ${text.slice(0, 120)}`);
  }
}

async function fetchImpact() {
  const p = new URLSearchParams();
  p.set("currency", CURRENCY);
  p.set("limit", "1000");
  if (IMPACT_BRAND_ID) p.set("brand_id", IMPACT_BRAND_ID);
  const q2 = new URLSearchParams();
  q2.set("currency", CURRENCY);
  q2.set("limit", "1000");
  if (IMPACT_CAMPAIGN_ID) q2.set("campaign_id", IMPACT_CAMPAIGN_ID);

  // (URL, jeton, SID) — on essaie chaque couple jusqu'a une reponse exploitable
  const combos = [];
  if (IMPACT_AUTH_TOKEN && IMPACT_ACCOUNT_SID) {
    combos.push({ token: IMPACT_AUTH_TOKEN, sid: IMPACT_ACCOUNT_SID, label: "compte principal" });
  }
  if (IMPACT_STORE_TOKEN && IMPACT_BRAND_ID) {
    combos.push({ token: IMPACT_STORE_TOKEN, sid: IMPACT_BRAND_ID, label: "boutique KiffTech.store" });
  }
  if (IMPACT_AUTH_TOKEN && !IMPACT_ACCOUNT_SID) {
    combos.push({ token: IMPACT_AUTH_TOKEN, sid: "", label: "compte principal (sans SID)" });
  }

  const urls = [
    `https://api.impact.com/catalog/products?${p.toString()}`,
    `https://api.impact.com/partner/v1/catalog/products?${p.toString()}`,
    `https://api.impact.com/advertiser/v1/catalog/products?${p.toString()}`,
    `https://api.impact.com/products/search?${q2.toString()}`,
    `https://api.impact.com/partner/v1/products?${p.toString()}`,
    `https://api.impact.com/action/v1/products?${p.toString()}`,
  ];

  if (!combos.length) throw new Error("IMPACT_AUTH_TOKEN / IMPACT_ACCOUNT_SID manquant");

  for (const c of combos) {
    for (const url of urls) {
      try {
        const data = await impactGet(url, c.token, c.sid);
        const items = data.items || data.products || data.data || data.results || [];
        const arr = Array.isArray(items) ? items : Array.isArray(items.items) ? items.items : [];
        console.log(`[impact] ${c.label} -> ${url.replace(/\?.*/, "")} : ${arr.length} produit(s)`);
        if (arr.length) return arr;
      } catch (e) {
        console.warn(`[impact] ${c.label} -> ${url.replace(/\?.*/, "")} : ${e.message}${e.body ? " | " + e.body : ""}`);
      }
    }
  }
  throw new Error("Impact : aucune reponse exploitable");
}

function mapImpact(item) {
  const price = Number(item.price ?? item.price_value ?? 0);
  const brand = item.brand_name || item.brand || "";
  const model = item.name || item.title || "";
  const text = [item.category, item.sub_category, item.description, brand, model].filter(Boolean).join(" ");
  const img = item.image_url || item.image || (Array.isArray(item.images) ? item.images[0] : null);
  const subId = item.id || item.product_id || slugify(model);
  const url = IMPACT_CAMPAIGN_ID
    ? `https://api.impact.com/redirect?p=${encodeURIComponent(IMPACT_CAMPAIGN_ID)}&subid=${encodeURIComponent(subId)}`
    : "";
  return normalizeProduct({
    id: `impact-${slugify(subId)}`,
    source: "impact",
    brand,
    model,
    year: yearFrom(text),
    category: guessCategory(text),
    price: { official: price, currency: item.currency || CURRENCY },
    specs: {},
    images: img ? [img] : [],
    description: String(item.description || "").slice(0, 400),
    url,
    checkoutUrl: "",
    impact: url ? { campaignId: IMPACT_CAMPAIGN_ID, subId: String(subId), url } : null,
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
