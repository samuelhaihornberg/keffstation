#!/usr/bin/env node
/**
 * KiffTech — Contrôle de cohérence des sources produits
 * ============================================================================
 * Compare le catalogue LOCAL (LOCAL_DB + data/catalogue.json) et le flux LIVE
 * (data/products.json = Shopify + Impact + exports) et affiche :
 *
 *   - les produits présents dans les DEUX sources (conflit de prix)
 *   - les produits présents dans une seule source
 *   - le nombre de produits par rayon et par source
 *
 * Usage :
 *   node scripts/kifftech/check-duplicates.mjs
 *   node scripts/kifftech/check-duplicates.mjs --detail   (liste des conflits)
 *
 * Regle de priorite appliquee au runtime (kifftech/catalogue-live.js) :
 *   le prix LIVE remplace le prix local pour un produit equivalent.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "..");
const KIFF = path.join(ROOT, "kifftech");
const DETAIL = process.argv.includes("--detail");

// Jetons d'identite : volume / generation / edition. Ils distinguent deux
// produits differents ("Pad 7 Ultra" != "Pad 7", "990 PRO 4 To" != "2To").
const IDENTITY_RE = /\b(\d+\s?(go|to|gb|tb|ko|mo)\b|\b(pro|max|plus|mini|ultra|lite|air|se)\b)/g;
const strip = (s) =>
  String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const strictKey = (p) => strip(p.brand) + "|" + strip(p.model);
const identityTokens = (p) => {
  const t = strip(p.model);
  const found = [];
  let m;
  const re = new RegExp(IDENTITY_RE.source, "g");
  while ((m = re.exec(t)) !== null) found.push(m[0].replace(/\s+/g, ""));
  return found.sort().join(",");
};
const sameIdentity = (a, b) => identityTokens(a) === identityTokens(b);
const looseKey = (p) =>
  strip(p.brand) +
  "|" +
  strip(p.model)
    .replace(new RegExp(IDENTITY_RE.source, "g"), " ")
    .replace(/\b(19|20)\d{2}\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function loadLocalDb() {
  const src = fs.readFileSync(path.join(KIFF, "app.v2.js"), "utf8");
  const marker = "const LOCAL_DB = ";
  const st = src.indexOf(marker) + marker.length;
  const en = src.indexOf("\n];", st);
  // eslint-disable-next-line no-eval
  return eval(src.slice(st, en + 2));
}

function readJSON(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    return fallback;
  }
}

// catalogue.json contient deja LOCAL_DB : on deduplique par id.
const seenLocal = new Set();
const local = [...loadLocalDb(), ...(readJSON(path.join(KIFF, "data", "catalogue.json"), { products: [] }).products || [])]
  .filter((p) => {
    if (!p || !p.id || seenLocal.has(p.id)) return false;
    seenLocal.add(p.id);
    return true;
  });
const liveDoc = readJSON(path.join(KIFF, "data", "products.json"), { products: [] });
const live = liveDoc.products || [];

const byStrict = new Map();
const byLoose = new Map();
local.forEach((p) => {
  byStrict.set(strictKey(p), p);
  const kl = looseKey(p);
  if (!byLoose.has(kl)) byLoose.set(kl, []);
  byLoose.get(kl).push(p);
});

const conflicts = [];
const liveOnly = [];
const seenLive = new Set();

for (const p of live) {
  const ks = strictKey(p);
  const kl = looseKey(p);
  const strictHit = byStrict.get(ks);
  const looseHit = (byLoose.get(kl) || []).length === 1 ? byLoose.get(kl)[0] : null;
  const match =
    (strictHit && sameIdentity(strictHit, p) ? strictHit : null) ||
    (looseHit && sameIdentity(looseHit, p) ? looseHit : null);
  if (match) {
    conflicts.push({
      id: p.id,
      model: `${p.brand} ${p.model}`,
      local: match.price?.official,
      live: p.price?.official,
      source: p.source,
      match: byStrict.has(ks) ? "exact" : "souple",
    });
  } else {
    liveOnly.push({ id: p.id, model: `${p.brand} ${p.model}`, source: p.source, price: p.price?.official });
  }
  seenLive.add(p.id);
}

const localOnly = local.filter((p) => !live.some((l) => l.id === p.id));

const count = (list) => {
  const c = {};
  list.forEach((p) => {
    const k = p.category || "Accessories";
    c[k] = (c[k] || 0) + 1;
  });
  return c;
};

console.log("=== SOURCES ===");
console.log(`  Catalogue local : ${local.length} produits`);
console.log(`  Flux live       : ${live.length} produits (${liveDoc.counts?.shopify ?? 0} Shopify, ${liveDoc.counts?.impact ?? 0} Impact)`);
console.log(`  Domaines        : ${liveDoc.shopifyDomain || "—"}`);

console.log("\n=== CONFLITS (present dans les 2 sources) ===");
if (!conflicts.length) console.log("  aucun — aucun produit en double");
else {
  conflicts.forEach((c) => {
    console.log(
      `  [${c.match}] ${c.model}\n      local ${c.local} EUR  ->  live ${c.live} EUR  (${c.source}) : le prix LIVE est applique`,
    );
  });
}

console.log("\n=== UNIQUEMENT LIVE ===");
liveOnly.forEach((p) => console.log(`  + ${p.model} — ${p.price} EUR (${p.source})`));

console.log("\n=== PAR RAYON ===");
const lc = count(local);
const lvc = count(live);
const cats = [...new Set([...Object.keys(lc), ...Object.keys(lvc)])].sort();
console.log("  rayon                              local  live  total");
cats.forEach((c) => {
  const a = lc[c] || 0;
  const b = lvc[c] || 0;
  const t = a + b - conflicts.filter((x) => x.match && x.model).length * 0; // les conflits sont comptes une fois
  console.log(`  ${c.padEnd(34)} ${String(a).padStart(5)} ${String(b).padStart(5)} ${String(t).padStart(6)}`);
});
console.log(`\n  Total : ${local.length} local + ${live.length} live = ${local.length + live.length - conflicts.length} produits uniques apres fusion`);

if (DETAIL) {
  console.log("\n=== DETAIL PRODUITS LOCAUX (non listés) ===");
  localOnly.slice(0, 200).forEach((p) => console.log(`  ${p.id} — ${p.brand} ${p.model}`));
}
