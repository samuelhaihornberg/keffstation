#!/usr/bin/env node
/**
 * KiffTech — Generation des pages de rayon (URL propres)
 * ============================================================================
 * Chaque rayon de la boutique devient une vraie page statique, avec une URL
 * propre, stable et partageable :
 *
 *   https://…/keffstation/kifftech/rayon/smartphones/
 *   https://…/keffstation/kifftech/rayon/audio-et-wearables/
 *   https://…/keffstation/kifftech/rayon/vr-ar-gadgets/
 *   …
 *
 * La page est une copie de index.html avec :
 *   - les chemins d'assets corriges (../ au lieu de ./) ;
 *   - une variable globale KIFFTECH_RAYON qui preselectionne le rayon ;
 *   - un <title> et un <link rel="canonical"> propres au rayon.
 *
 * Regenération :
 *   node scripts/kifftech/gen-rayon-pages.mjs
 *
 * Le catalogue.json est lu pour connaitre les rayons existants.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "..");
const KIFF = path.join(ROOT, "kifftech");
const OUT_DIR = path.join(KIFF, "rayon");

/* Slug : meme regle que slugRayon() dans kifftech/app.v2.js */
export function slugRayon(cat) {
  return String(cat || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " et ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function readJSON(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    return fallback;
  }
}

const catalogue = readJSON(path.join(KIFF, "data", "catalogue.json"), { categories: {} });
const categories = Object.keys(catalogue.categories || {}).sort((a, b) =>
  a.localeCompare(b, "fr"),
);

if (!categories.length) {
  console.error("[rayons] aucun rayon trouve dans kifftech/data/catalogue.json");
  process.exit(1);
}

const template = fs.readFileSync(path.join(KIFF, "index.html"), "utf8");

/* Titre lisible : "Audio & Wearables" -> "Audio et Wearables" */
function titleOf(cat) {
  return cat.replace(/&/g, " et ");
}

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const manifest = [];
for (const cat of categories) {
  const slug = slugRayon(cat);
  const dir = path.join(OUT_DIR, slug);
  fs.mkdirSync(dir, { recursive: true });

  let html = template;

  // 1) chemins d'assets : les pages de rayon sont DEUX niveaux plus bas
  //    (/kifftech/rayon/<slug>/) -> il faut "../../" pour revenir a /kifftech/.
  const NO_PREFIX = [
    "index-inline-01.css",
    "index-inline-02.js",
    "index-inline-03.js",
    "app.v2.js",
    "paypal-config.js",
    "manifest.json",
    "sw.js",
    "theme.css",
  ];
  for (const a of NO_PREFIX) {
    html = html.split(`"${a}`).join(`"../../${a}`);
  }
  // Scripts a la racine du site (un niveau au-dessus de /kifftech/) :
  // il faut trois niveaux pour y revenir depuis /kifftech/rayon/<slug>/.
  const ROOT_LEVEL = ["i18n.js", "ga4.js", "analytics-events.js", "keff-stats.js", "refresh.js"];
  for (const a of ROOT_LEVEL) {
    html = html.split(`"../${a}`).join(`"../../../${a}`);
  }
  html = html.replace(/(href|src)="\.\//g, '$1="../../');
  html = html.replace(/href="\.\.\/\.\.\/index\.html"/g, 'href="../../index.html"');
  html = html.replace(/href="\.\.\/\.\.\/rayons\.html"/g, 'href="../../rayons.html"');
  html = html.replace(/href="\.\.\/\.\.\/about\.html"/g, 'href="../../about.html"');
  html = html.replace(/href="\.\.\/\.\.\/credits\.html"/g, 'href="../../credits.html"');

  // 2) rayon preselectionne
  html = html.replace(
    "<script defer src=\"../catalogue-live.js\"></script>",
    `<script>window.KIFFTECH_RAYON=${JSON.stringify(cat)};</script>\n<script defer src="../catalogue-live.js"></script>`,
  );

  // 3) titre + description propres
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>KiffTech — ${titleOf(cat)} | Boutique KeffStation</title>`,
  );
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="Rayon ${titleOf(cat)} — ${catalogue.categories[cat]} produits KiffTech : prix officiels, avis, photos et achat en ligne.">`,
  );
  // lien canonique
  const CANON = "https://kiffstation.com/kifftech/rayon/" + slug + "/";
  html = html.replace(/<link rel="canonical"[^>]*>/, "");
  html = html.replace(
    "<title>",
    `<link rel="canonical" href="${CANON}">\n<title>`,
  );

  fs.writeFileSync(path.join(dir, "index.html"), html, "utf8");
  manifest.push({ category: cat, slug, title: titleOf(cat), count: catalogue.categories[cat] });
}

// index du dossier rayon : liste des rayons (page d'acces rapide)
const listHtml = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>KiffTech — Tous les rayons</title>
<meta name="description" content="Tous les rayons de la boutique KiffTech.">
<link rel="stylesheet" href="../theme.css">
<link rel="stylesheet" href="./rayons-index.css">
</head>
<body>
<main style="max-width:1100px;margin:0 auto;padding:24px 16px">
<h1 style="font-family:var(--kf-display);color:var(--kf-bone)">Rayons KiffTech</h1>
<p style="color:var(--kf-ink-dim)"><a href="../index.html">← Retour à la boutique</a></p>
<div class="ray-list">
${manifest.map((m) => `<a class="ray-item" href="./${m.slug}/"><strong>${m.title}</strong><span>${m.count} produits</span></a>`).join("\n")}
</div>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT_DIR, "index.html"), listHtml, "utf8");

// CSS de l'index des rayons (fichier externe, pas de style inline)
fs.writeFileSync(
  path.join(OUT_DIR, "rayons-index.css"),
  `/* KiffTech — index des rayons */
.ray-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;padding:20px 0 60px}
.ray-item{display:block;text-decoration:none;color:inherit;border:1px solid var(--kf-line);padding:16px;border-radius:14px;background:rgba(255,255,255,.03)}
.ray-item:hover{border-color:rgba(216,255,62,.5);background:rgba(255,255,255,.06)}
.ray-item strong{display:block;font-family:var(--kf-display);font-size:1.05rem;color:var(--kf-bone);margin-bottom:4px}
.ray-item span{font:600 .7rem var(--kf-mono);color:var(--kf-acid-dim);letter-spacing:.1em;text-transform:uppercase}
`,
  "utf8",
);

fs.writeFileSync(
  path.join(KIFF, "data", "rayons.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), rayons: manifest }, null, 2),
  "utf8",
);

// Verification automatique : chaque reference locale doit exister sur le disque.
let missing = 0;
for (const m of manifest) {
  const page = path.join(OUT_DIR, m.slug, "index.html");
  const dir = path.dirname(page);
  const html = fs.readFileSync(page, "utf8");
  const refs = [...html.matchAll(/(?:href|src)="([^"#?][^"]*)"/g)].map((x) => x[1]);
  for (const ref of refs) {
    if (/^(https?:)?\/\//i.test(ref) || ref.startsWith("data:") || ref.startsWith("mailto:")) continue;
    // Fichiers generes au deploiement (absents du depot)
    if (["shopify-config.js", "paypal-config.js"].includes(ref.split("/").pop())) continue;
    const clean = ref.split("?")[0].split("#")[0];
    const target = path.resolve(dir, clean);
    if (!fs.existsSync(target)) {
      console.error(`  ❌ ${m.slug} -> ${ref} (introuvable : ${path.relative(ROOT, target)})`);
      missing++;
    }
  }
}
if (missing) {
  console.error(`[rayons] ${missing} reference(s) cassee(s) — generation corrigee avant commit.`);
  process.exit(1);
}
console.log("[rayons] toutes les references locales sont valides.");

console.log(`[rayons] ${manifest.length} pages generees dans kifftech/rayon/`);
manifest.forEach((m) => console.log(`   /kifftech/rayon/${m.slug}/  — ${m.title} (${m.count})`));
