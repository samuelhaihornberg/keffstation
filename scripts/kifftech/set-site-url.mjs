#!/usr/bin/env node
/**
 * KeffStation — Bascule des URL canoniques vers un nouveau domaine
 * ============================================================================
 * Remplace https://samuelhaihornberg.github.io/keffstation par le domaine
 * cible dans : sitemap.xml, balises <link rel="canonical">, JSON-LD "url",
 * manifest.json (start_url / scope), et URLs de service worker.
 *
 * Usage :
 *   node scripts/kifftech/set-site-url.mjs kiffstation.com            # applique
 *   node scripts/kifftech/set-site-url.mjs kiffstation.com --dry-run  # simule
 *
 * À lancer APRÈS que le nouveau domaine répond en 200 (certificat émis).
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "..");
const OLD_BASE = "https://samuelhaihornberg.github.io/keffstation";

const domain = String(process.argv[2] || "").trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
const DRY = process.argv.includes("--dry-run");

if (!domain) {
  console.error("Usage : node scripts/kifftech/set-site-url.mjs <domaine> [--dry-run]");
  process.exit(1);
}
const NEW_BASE = "https://" + domain;

const TARGETS = [
  "sitemap.xml",
  "index.html",
  "manifest.json",
  "sw.js",
  "kifftech/index.html",
  "kifftech/catalog.html",
  "kifftech/rayons.html",
  "kifftech/about.html",
  "kifftech/credits.html",
  "kifftech/admin-caisse.html",
  "viartificial-labs/index.html",
  "tricktrocjob/index.html",
  "videogames/index.html",
  "cos-editor/index.html",
  "linguistic-motors/index.html",
];

let changed = 0;
for (const rel of TARGETS) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  if (!before.includes(OLD_BASE)) continue;
  const after = before.split(OLD_BASE).join(NEW_BASE);
  if (!DRY) fs.writeFileSync(file, after, "utf8");
  const n = before.split(OLD_BASE).length - 1;
  changed += n;
  console.log(`  ${rel} : ${n} URL(s) ${DRY ? "(simulation)" : "remplacée(s)"}`);
}

console.log(
  changed
    ? `\n${DRY ? "Simulation" : "Basculé"} : ${changed} URL(s) → ${NEW_BASE}`
    : `\nAucune URL à remplacer (déjà sur ${NEW_BASE} ?)`
);
