#!/usr/bin/env node
/**
 * KiffTech — Import de produits depuis un export local (CSV ou JSON)
 * ============================================================================
 * Deux sources possibles, sans.domain ni token requis :
 *
 *   1. Export Shopify  : kifftech/data/shopify-export.csv  (export standard
 *      Shopify : Product CSV) ou .json (tableau de produits)
 *   2. Export Impact   : kifftech/data/impact-export.csv  ou .json
 *
 * Comment obtenir le CSV Shopify :
 *   Admin Shopify > Produits > Exporter > Export CSV (ou "CSV de produits")
 *
 * Le fichier est lu par scripts/sync-boutique.mjs et converti en produits
 * KiffTech (prix, images, specs) puis publié dans kifftech/data/products.json.
 *
 * Usage manuel (après avoir déposé le fichier) :
 *   node scripts/sync-boutique.mjs
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "..");
const DATA_DIR = path.join(ROOT, "kifftech", "data");

/* ------------------------------------------------------------------ */
/* Lecture CSV (champs entre guillemets, guillemets doublés)           */
/* ------------------------------------------------------------------ */
export function parseCsv(text) {
  const clean = text.replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (inQuotes) {
      if (c === '"') {
        if (clean[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") {
      field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  if (!rows.length) return [];
  const header = rows[0].map((h) => h.trim());
  return rows
    .slice(1)
    .filter((r) => r.some((v) => String(v).trim() !== ""))
    .map((r) => {
      const o = {};
      header.forEach((h, i) => (o[h] = r[i] === undefined ? "" : String(r[i]).trim()));
      return o;
    });
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const html2text = (s) =>
  String(s || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

function num(v) {
  const n = Number(String(v || "").replace(/[^0-9.,-]/g, "").replace(",", "."));
  return Number.isFinite(n) ? Math.round(n) : 0;
}

function stripTags(s) {
  return String(s || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/* ------------------------------------------------------------------ */
/* Import Shopify (export CSV standard)                                */
/* ------------------------------------------------------------------ */
export function importShopifyCsv(rows) {
  const out = [];
  for (const r of rows) {
    const status = (r["Status"] || "active").toLowerCase();
    if (status && status !== "active" && status !== "published") continue;
    const model = (r["Title"] || r["Name"] || "").trim();
    if (!model) continue;
    const brand = (r["Vendor"] || r["Brand"] || "").trim() || "Shopify";
    const price = num(r["Variant Price"] || r["Price"] || r["Price (€)"]);
    const compare = num(r["Variant Compare At Price"] || r["Compare At Price"]);
    const official = compare > 0 ? compare : price;
    const img = (r["Image Src"] || r["Image"] || r["Image URL"] || "").trim();
    const images = img ? img.split(/\s*\|\s*|\s*,\s*/).filter(Boolean) : [];
    const handle = (r["Handle"] || r["URL / Handle"] || "").trim();
    const desc = html2text(r["Body (HTML)"] || r["Description"] || r["Body"]);
    const type = [r["Type"], r["Product Category"], r["Category"], r["Tags"]].filter(Boolean).join(" ");
    const specs = {};
    for (const [col, label] of [
      ["Variant SKU", "SKU"],
      ["Product Category", "Catégorie"],
      ["Type", "Type"],
      ["Tags", "Étiquettes"],
      ["Option1 Value", "Option"],
      ["Option2 Value", "Option 2"],
      ["Option3 Value", "Option 3"],
    ]) {
      if (r[col]) specs[label] = String(r[col]).slice(0, 80);
    }
    out.push({
      id: `shopify-${handle || model.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      source: "shopify",
      brand,
      model,
      category: type || "Accessories",
      price: { official, currency: "EUR" },
      specs,
      images,
      description: desc.slice(0, 400),
      tags: stripTags(r["Tags"]),
      handle: handle,
      url: "",
      checkoutUrl: "",
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Import générique (JSON ou CSV libre)                                */
/* ------------------------------------------------------------------ */
export function importGeneric(list, source) {
  const out = [];
  for (const r of list) {
    const model = String(r.model || r.Model || r.Name || r.Title || r.name || "").trim();
    if (!model) continue;
    const priceRaw = r.price?.official ?? r.price ?? r.CurrentPrice ?? r.Price ?? r["Variant Price"] ?? 0;
    const official = num(typeof priceRaw === "object" ? priceRaw.official : priceRaw);
    const brand = String(r.brand || r.Brand || r.Manufacturer || r.Vendor || source).trim();
    const images = []
      .concat(r.images || r.Images || r.Image ? [r.images || r.Images || r.Image] : [])
      .flat()
      .filter(Boolean)
      .map(String);
    out.push({
      id: String(r.id || `${source}-${model.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`),
      source,
      brand,
      model,
      year: r.year || r.Year || null,
      category: r.category || r.Category || r.Type || "Accessories",
      price: { official, currency: r.currency || r.Currency || "EUR" },
      specs: r.specs || {},
      images,
      description: String(r.description || r.Description || "").slice(0, 400),
      url: String(r.url || r.Url || r.URL || ""),
      impact: r.impact || null,
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Lecture des fichiers présents dans kifftech/data/                   */
/* ------------------------------------------------------------------ */
export function readLocalImports() {
  const result = { shopify: [], impact: [], files: [] };
  if (!fs.existsSync(DATA_DIR)) return result;

  const load = (base, source, parser) => {
    for (const ext of [".csv", ".json"]) {
      const file = path.join(DATA_DIR, base + ext);
      if (!fs.existsSync(file)) continue;
      try {
        let products = [];
        if (ext === ".csv") {
          const rows = parseCsv(fs.readFileSync(file, "utf8"));
          products = source === "shopify" ? importShopifyCsv(rows) : importGeneric(rows, source);
        } else {
          const json = JSON.parse(fs.readFileSync(file, "utf8"));
          const list = Array.isArray(json) ? json : json.products || [];
          products = importGeneric(list, source);
        }
        result[source] = result[source].concat(products);
        result.files.push({ file: path.basename(file), source, count: products.length });
      } catch (e) {
        console.warn(`[import] ${path.basename(file)} : ${e.message}`);
      }
    }
  };

  load("shopify-export", "shopify", importShopifyCsv);
  load("impact-export", "impact", importGeneric);
  return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const res = readLocalImports();
  console.log("[import] fichiers trouves :", res.files.length ? res.files : "aucun");
  console.log("[import] produits shopify :", res.shopify.length);
  console.log("[import] produits impact  :", res.impact.length);
  if (res.shopify[0]) console.log("[import] exemple :", JSON.stringify(res.shopify[0]));
}
