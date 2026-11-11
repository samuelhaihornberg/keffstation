#!/usr/bin/env node
/**
 * KiffTech — Construction du catalogue étendu
 * ============================================================================
 * 1. Extrait LOCAL_DB (base embarquée dans kifftech/app.v2.js)
 * 2. Ajoute les produits des fichiers de contribution (products-*.json)
 * 3. Récupère une photo libre de droits (Wikimedia Commons, CC BY-SA) pour
 *    chaque produit sans image, et met à jour kifftech/img/CREDITS.txt
 * 4. Écrit kifftech/data/catalogue.json (chargé par kifftech/catalogue-live.js)
 *
 * Usage :
 *   node scripts/kifftech/build-catalogue.mjs                # tout
 *   node scripts/kifftech/build-catalogue.mjs --no-images    # sans téléchargement
 *   node scripts/kifftech/build-catalogue.mjs --only-ids a,b # limite les images
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "..");
const KIFF = path.join(ROOT, "kifftech");
const IMG_DIR = path.join(KIFF, "img");
const OUT = path.join(KIFF, "data", "catalogue.json");
const CREDITS = path.join(IMG_DIR, "CREDITS.txt");
const EXTRA_DIRS = ["/tmp/opencode"];

const args = process.argv.slice(2);
const NO_IMAGES = args.includes("--no-images");
const onlyIdx = args.indexOf("--only-ids");
const ONLY_IDS = onlyIdx >= 0 ? new Set((args[onlyIdx + 1] || "").split(",").map((s) => s.trim()).filter(Boolean)) : null;

const UA = "KeffStation-KiffTech/1.0 (build-catalogue; contact samuelhaihornberg@gmail.com)";
const MIN_PER_CATEGORY = 25;

/* ------------------------------------------------------------------ */
/* 1. Base existante                                                   */
/* ------------------------------------------------------------------ */
function loadLocalDb() {
  const src = fs.readFileSync(path.join(KIFF, "app.v2.js"), "utf8");
  const marker = "const LOCAL_DB = ";
  const start = src.indexOf(marker);
  if (start < 0) throw new Error("LOCAL_DB introuvable dans app.v2.js");
  const from = start + marker.length;
  const end = src.indexOf("\n];", from);
  const arraySrc = src.slice(from, end + 2);
  // eslint-disable-next-line no-eval
  return eval(arraySrc);
}

/* ------------------------------------------------------------------ */
/* 2. Contributions                                                     */
/* ------------------------------------------------------------------ */
function loadExtra() {
  const files = [];
  for (const dir of EXTRA_DIRS) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (/^products-[A-Z]\.json$/.test(f)) files.push(path.join(dir, f));
    }
  }
  const out = [];
  for (const f of files) {
    try {
      const arr = JSON.parse(fs.readFileSync(f, "utf8"));
      if (Array.isArray(arr)) {
        out.push(...arr);
        console.log(`[catalogue] ${path.basename(f)} : ${arr.length} produits`);
      }
    } catch (e) {
      console.warn(`[catalogue] ${path.basename(f)} illisible : ${e.message}`);
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* 3. Wikimedia Commons                                                 */
/* ------------------------------------------------------------------ */
const BAD_PATTERNS = [
  /logo/i, /\bicon\b/i, /\bflag\b/i, /\bmap\b/i, /diagram/i, /poster/i, /screenshot/i,
  /\bbook\b/i, /cover/i, /\bsign\b/i, /banner/i, /location/i, /headquarters/i,
  /conference/i, /booth/i, /museum/i, /unboxing/i, /circuit board/i, /in store/i,
  /apple store/i, /packaging/i, /carton/i, /sticker/i, /comparison/i, /teardown/i,
  /disassembly/i, /template/i, /certificate/i, /wallpaper/i, /open(ed)? box/i,
  /and box/i, /with box/i, /\.pdf$/i,
];

function normalizeText(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/^file:/, "")
    .replace(/\.[a-z0-9]+$/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

async function commonsSearch(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
    `&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=12` +
    "&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=900&format=json&origin=*";
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error("Commons HTTP " + res.status);
  const data = await res.json();
  const pages = data?.query?.pages || {};
  return Object.values(pages)
    .map((p) => ({ title: p.title, info: (p.imageinfo || [])[0] }))
    .filter((p) => p.info && p.info.thumburl);
}

/* Score : le modèle doit apparaître dans le titre du fichier. */
function scoreCandidate(title, brand, model) {
  const t = normalizeText(title);
  const m = normalizeText(model);
  const b = normalizeText(brand);
  if (!m) return -10;
  let score = 0;
  if (t.includes(m)) {
    score += 6; // modèle complet
  } else {
    const mt = m.split(" ").filter((w) => w.length > 2);
    const hits = mt.filter((w) => t.includes(w)).length;
    score += hits * 2;
    if (mt.length >= 2 && hits === mt.length) score += 3;
    if (mt.length >= 2 && hits < mt.length - 1) score -= 3;
  }
  if (b && t.includes(b)) score += 2;
  for (const bad of BAD_PATTERNS) if (bad.test(title)) score -= 4;
  if (/\.svg$/i.test(title)) score -= 0.5;
  return score;
}

function cleanQuery(s) {
  return String(s || "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/["']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function commonsSearchSafe(query) {
  // L'API Wikimedia limite les requetes : on espace et on retente une fois.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await commonsSearch(query);
    } catch (e) {
      const msg = String(e.message || e);
      if (/too many requests|429/i.test(msg)) {
        const wait = 4000 * (attempt + 1);
        console.warn(`[commons] limitation API — pause ${wait} ms`);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      throw e;
    }
  }
  throw new Error("Commons : trop de requêtes");
}

async function pickImage(product) {
  const brand = cleanQuery(product.brand || "");
  const model = cleanQuery(product.model || "");
  const cq = cleanQuery(product.commonsQuery || "");
  const queries = [];
  if (cq) queries.push(`filetype:bitmap "${cq}"`);
  queries.push(`filetype:bitmap "${brand} ${model}"`);
  queries.push(`filetype:bitmap "${model}"`);
  const key = model.split(" ").filter((w) => w.length > 3);
  if (key.length) queries.push(`filetype:bitmap "${brand} ${key[0]}"`);
  for (const q of queries) {
    let cands = [];
    try {
      cands = await commonsSearchSafe(q);
    } catch (e) {
      console.warn(`[commons] recherche échouée (${q}) : ${e.message}`);
      return null;
    }
    if (!cands.length) continue;
    const scored = cands
      .map((c) => ({ ...c, score: scoreCandidate(c.title, brand, model) }))
      .filter((c) => c.score >= 4)
      .sort((a, b) => b.score - a.score);
    if (!scored.length) continue;
    const best = scored[0];
    const meta = best.info.extmetadata || {};
    const license = stripHtml(meta.LicenseShortName?.value || meta.License?.value || "");
    if (license && !/cc|public domain|pd|free/i.test(license)) continue;
    return {
      title: best.title,
      url: best.info.thumburl,
      license: license || "CC",
      author: stripHtml(meta.Artist?.value || meta.Credit?.value || "").slice(0, 120),
      page: best.info.descriptionurl || "",
    };
  }
  return null;
}

function stripHtml(s) {
  return String(s || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1500) throw new Error("image trop légère (" + buf.length + " o)");
  fs.writeFileSync(dest, buf);
  return buf.length;
}

function extFor(url, title) {
  const m = String(url).match(/\/(\d+px-[^/]+)$/);
  const tail = m ? m[1] : String(title);
  if (/\.png$/i.test(tail)) return ".png";
  if (/\.svg$/i.test(tail)) return ".svg";
  if (/\.webp$/i.test(tail)) return ".webp";
  return ".jpg";
}

/* ------------------------------------------------------------------ */
/* 4. Build                                                            */
/* ------------------------------------------------------------------ */
function slug(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 48);
}

async function main() {
  const base = loadLocalDb();
  const extra = loadExtra();
  console.log(`[catalogue] base locale : ${base.length} produits — ajouts : ${extra.length}`);

  const seen = new Set();
  const products = [];
  const push = (p, origin) => {
    const id = p.id || slug(`${p.brand}-${p.model}`);
    if (seen.has(id)) return;
    seen.add(id);
    products.push({
      id,
      images: Array.isArray(p.images) ? p.images.filter(Boolean) : [],
      brand: p.brand || "",
      model: p.model || "",
      year: p.year || null,
      category: p.category || "Accessories",
      era: p.era || undefined,
      price: { official: Number(p.price?.official || p.price || 0) },
      specs: p.specs || {},
      usage: p.usage || [],
      impact: p.impact || undefined,
      description: p.description || "",
      commonsQuery: p.commonsQuery || undefined,
      _origin: origin,
    });
  };

  base.forEach((p) => push(p, "base"));
  extra.forEach((p) => push(p, "ajout"));

  // ---- images Wikimedia Commons -------------------------------------
  const credits = fs.existsSync(CREDITS) ? fs.readFileSync(CREDITS, "utf8") : "";
  const creditLines = [];
  let fetched = 0;
  let failed = 0;

  if (!NO_IMAGES) {
    for (const p of products) {
      if (p.images && p.images.length) continue;
      if (ONLY_IDS && !ONLY_IDS.has(p.id)) continue;
      const pick = await pickImage(p);
      if (!pick) {
        failed++;
        continue;
      }
      const ext = extFor(pick.url, pick.title);
      const file = `${slug(p.id)}${ext}`;
      const dest = path.join(IMG_DIR, file);
      try {
        if (!fs.existsSync(dest)) {
          const size = await download(pick.url, dest);
          if (size > 900 * 1024) {
            // Trop lourd pour une PWA : on garde quand même, mais on le signale.
            console.warn(`[img] ${file} volumineux (${Math.round(size / 1024)} Ko)`);
          }
        }
        p.images = [`./img/${file}`];
        fetched++;
        creditLines.push(
          `- ${file} (${p.brand} ${p.model}) : ${pick.title} — ${pick.license}${pick.author ? " — " + pick.author : ""}`
        );
      } catch (e) {
        failed++;
        console.warn(`[img] ${p.id} : ${e.message}`);
      }
      if ((fetched + failed) % 20 === 0) console.log(`[img] ${fetched} récupérées / ${failed} sans photo…`);
      await new Promise((r) => setTimeout(r, 700)); // politesse vis-a-vis de l'API
    }
  }

  if (creditLines.length) {
    const header = `\n--- ${new Date().toISOString().slice(0, 10)} — ajouts catalogue (build-catalogue.mjs) ---\n`;
    fs.writeFileSync(CREDITS, credits.trimEnd() + "\n" + header + creditLines.join("\n") + "\n");
  }

  // ---- contrôles ----------------------------------------------------
  const byCat = {};
  products.forEach((p) => {
    byCat[p.category] = (byCat[p.category] || 0) + 1;
  });
  const short = Object.entries(byCat).filter(([, n]) => n < MIN_PER_CATEGORY);

  const clean = products.map((p) => {
    const c = { ...p };
    delete c._origin;
    if (!c.era) delete c.era;
    if (!c.usage || !c.usage.length) delete c.usage;
    if (!c.impact) delete c.impact;
    if (!c.description) delete c.description;
    if (!c.commonsQuery) delete c.commonsQuery;
    return c;
  });

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(
    OUT,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: clean.length,
        categories: byCat,
        products: clean,
      },
      null,
      2,
    ),
    "utf8"
  );

  const sansPhoto = clean.filter((p) => !p.images || !p.images.length).map((p) => ({ id: p.id, brand: p.brand, model: p.model, category: p.category }));
  fs.writeFileSync("/tmp/opencode/unmatched.json", JSON.stringify(sansPhoto, null, 2));

  console.log(`[catalogue] ${clean.length} produits écrits dans ${path.relative(ROOT, OUT)}`);
  console.log(`[catalogue] images récupérées : ${fetched} — sans photo : ${failed}`);
  console.log("[catalogue] produits par catalogue :");
  Object.entries(byCat)
    .sort((a, b) => b[1] - a[1])
    .forEach(([c, n]) => console.log(`   ${n >= MIN_PER_CATEGORY ? "✅" : "⚠️ "} ${n.toString().padStart(3)} — ${c}`));
  if (short.length) {
    console.log(`[catalogue] catalogues sous ${MIN_PER_CATEGORY} produits : ${short.map(([c]) => c).join(", ")}`);
  }
}

main().catch((e) => {
  console.error("[catalogue] échec :", e);
  process.exit(1);
});
