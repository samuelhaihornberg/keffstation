#!/usr/bin/env node
'use strict';

/**
 * Audit du contenu des fiches produit KiffTech.
 *
 * Référence : data/CONTENU.md
 * Usage :
 *   node tools/check-contenu.js            audit informatif (code 0)
 *   node tools/check-contenu.js --strict   code 1 si une fiche existante est incomplète
 *   node tools/check-contenu.js --complete code 1 si les 63 couples marque × année manquent
 *   node tools/check-contenu.js --json     sortie machine
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const CATALOGUE_PATH = path.join(ROOT, 'data', 'catalogue.js');

const MIN_IMAGES = 3;
const MAX_IMAGES = 5;
const MIN_VIDEOS = 1;
const MAX_VIDEOS = 2;
const MIN_USAGES = 10;
const MAX_USAGES = 20;
const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

const BRANDS = [
  { key: 'samsung', label: 'Samsung', match: /samsung/i },
  { key: 'apple', label: 'Apple', match: /\bapple\b/i },
  { key: 'linux', label: 'Linux', match: /\blinux\b/i },
  { key: 'microsoft', label: 'Microsoft', match: /\bmicrosoft\b/i },
  { key: 'steam', label: 'Steam (Valve)', match: /\bvalve\b|\bsteam\b/i },
  { key: 'meta', label: 'Meta', match: /\bmeta\b|\boculus\b/i },
  { key: 'hp', label: 'HP', match: /\bhp\b|hewlett[\s-]?packard/i },
  { key: 'alienware', label: 'Alienware', match: /alienware/i },
  { key: 'msi', label: 'MSI', match: /\bmsi\b/i }
];

const EXPECTED_TOTAL = BRANDS.length * YEARS.length;

const args = new Set(process.argv.slice(2));
const STRICT = args.has('--strict');
const COMPLETE = args.has('--complete');
const JSON_OUT = args.has('--json');

function loadCatalogue() {
  const source = fs.readFileSync(CATALOGUE_PATH, 'utf8');
  const start = source.indexOf('export const CATALOGUE');
  if (start === -1) throw new Error('export const CATALOGUE introuvable dans data/catalogue.js');

  const body = source
    .slice(start)
    .replace(/^export const CATALOGUE\s*=\s*/, '')
    .replace(/;\s*$/, '');

  return new Function(`return (${body})`)();
}

function videosOf(product) {
  const medias = product.medias || {};
  if (Array.isArray(medias.videos) && medias.videos.length > 0) return medias.videos;
  return medias.video ? [medias.video] : [];
}

function articleOf(product) {
  const article = product.article;
  if (!article) return { present: false, paragraphs: 0 };

  if (typeof article === 'string') {
    const paragraphs = article.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
    return { present: paragraphs.length > 0, paragraphs: paragraphs.length };
  }

  if (typeof article === 'object') {
    const contenu = article.contenu;
    const paragraphs = Array.isArray(contenu)
      ? contenu.map((p) => String(p).trim()).filter(Boolean)
      : String(contenu || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
    return { present: Boolean(article.titre && paragraphs.length > 0), paragraphs: paragraphs.length, titre: article.titre };
  }

  return { present: false, paragraphs: 0 };
}

function brandText(product) {
  return [product.marque, product.modele, product.plateforme].filter(Boolean).join(' ');
}

function auditProduct(product) {
  const images = (product.medias?.images || []).length;
  const videos = videosOf(product).length;
  const specs = (product.caracteristiques || []).length;
  const usages = (product.usages || []).length;
  const article = articleOf(product);

  const issues = [];
  if (images < MIN_IMAGES) issues.push(`${images}/${MIN_IMAGES} images`);
  if (images > MAX_IMAGES) issues.push(`${images} images (max ${MAX_IMAGES})`);
  if (videos < MIN_VIDEOS) issues.push(`${videos}/${MIN_VIDEOS} vidéo`);
  if (videos > MAX_VIDEOS) issues.push(`${videos} vidéos (max ${MAX_VIDEOS})`);
  if (specs < 1) issues.push('tableau de caractéristiques absent');
  if (!article.present) issues.push('article absent');
  if (usages < MIN_USAGES) issues.push(`${usages}/${MIN_USAGES} occasions d'utilisation`);
  if (usages > MAX_USAGES) issues.push(`${usages} occasions (max ${MAX_USAGES})`);

  // Prix : la devise et la date de vérification doivent être explicites.
  // Aucune conversion n'est faite : un prix USD reste en USD.
  const prix = product.prix;
  if (prix && typeof prix.montant === 'number') {
    if (!/^[A-Z]{3}$/.test(String(prix.devise || ''))) {
      issues.push('devise du prix absente ou invalide');
    }
    if (!prix.date) issues.push('date de vérification du prix absente');
  }

  return {
    id: product.id,
    marque: product.marque || '',
    modele: product.modele || '',
    annee: Number(product.annee),
    images,
    videos,
    specs,
    devise: product.prix?.devise || null,
    article: article.present,
    articleParagraphs: article.paragraphs,
    usages,
    issues
  };
}

function pad(value, size) {
  return String(value).padEnd(size, ' ');
}

function padStart(value, size) {
  return String(value).padStart(size, ' ');
}

function main() {
  const catalogue = loadCatalogue();
  const products = catalogue.produits || [];
  const rows = products.map(auditProduct);

  // Couverture marque × année : chaque produit peut couvrir plusieurs marques
  // si son texte les mentionne (ex. plateforme Linux).
  const coverage = new Map();
  for (const brand of BRANDS) {
    for (const year of YEARS) coverage.set(`${brand.key}:${year}`, 0);
  }
  for (const product of products) {
    const year = Number(product.annee);
    if (!YEARS.includes(year)) continue;
    const text = brandText(product);
    for (const brand of BRANDS) {
      if (brand.match.test(text)) {
        const key = `${brand.key}:${year}`;
        coverage.set(key, coverage.get(key) + 1);
      }
    }
  }

  const missingByBrand = BRANDS.map((brand) => ({
    key: brand.key,
    label: brand.label,
    years: YEARS.filter((year) => coverage.get(`${brand.key}:${year}`) === 0)
  }));
  const missingCombos = missingByBrand.flatMap((brand) => brand.years.map((year) => `${brand.label} ${year}`));
  const coveredCombos = EXPECTED_TOTAL - missingCombos.length;

  const incomplete = rows.filter((row) => row.issues.length > 0);
  const strictFailed = incomplete.length > 0;
  const completeFailed = missingCombos.length > 0;

  if (JSON_OUT) {
    console.log(JSON.stringify({
      total: rows.length,
      rows,
      expectedTotal: EXPECTED_TOTAL,
      coveredCombos,
      missingCombos,
      missingByBrand,
      incomplete: incomplete.length,
      strict: STRICT,
      complete: COMPLETE
    }, null, 2));
  } else {
    console.log('KiffTech — audit du contenu produit');
    console.log(`Source : data/catalogue.js · ${rows.length} fiche(s)`);
    console.log('Référence : data/CONTENU.md');
    console.log('');

    const header = `${pad('Produit', 34)} ${pad('Année', 5)} ${pad('Img', 3)} ${pad('Vid', 3)} ${pad('Specs', 5)} ${pad('Art.', 4)} ${pad('Usages', 6)} État`;
    console.log(header);
    console.log('-'.repeat(header.length));

    for (const row of rows) {
      const label = `${row.marque} ${row.modele}`.trim();
      const state = row.issues.length === 0 ? 'OK' : row.issues.join(', ');
      console.log(
        `${pad(label.slice(0, 34), 34)} ${pad(row.annee, 5)} ${pad(row.images, 3)} ${pad(row.videos, 3)} ${pad(row.specs, 5)} ${pad(row.article ? 'oui' : 'non', 4)} ${pad(row.usages, 6)} ${state}`
      );
    }

    console.log('');
    console.log(`Couverture marque × année : ${coveredCombos}/${EXPECTED_TOTAL} couples couverts.`);
    const matrixHeader = `${pad('Marque', 16)}${YEARS.map((year) => padStart(year, 6)).join('')}  Total`;
    console.log(matrixHeader);
    console.log('-'.repeat(matrixHeader.length));
    for (const brand of BRANDS) {
      const cells = YEARS.map((year) => {
        const count = coverage.get(`${brand.key}:${year}`);
        return padStart(count > 0 ? 'OK' : '—', 6);
      }).join('');
      const total = YEARS.filter((year) => coverage.get(`${brand.key}:${year}`) > 0).length;
      console.log(`${pad(brand.label, 16)}${cells}  ${total}/${YEARS.length}`);
    }

    if (missingCombos.length) {
      console.log('');
      console.log('Couples manquants :');
      for (const brand of missingByBrand) {
        if (brand.years.length === 0) continue;
        console.log(`- ${brand.label} : ${brand.years.join(', ')}`);
      }
    }

    console.log('');
    console.log(`Bilan fiches : ${rows.length - incomplete.length}/${rows.length} complète(s).`);
    if (incomplete.length) {
      console.log('Fiches à compléter :');
      for (const row of incomplete) {
        console.log(`- ${row.marque} ${row.modele} (${row.annee}) : ${row.issues.join(', ')}`);
      }
    }

    console.log('');
    if (STRICT) console.log('Mode strict : échec si une fiche existante est incomplète.');
    if (COMPLETE) console.log('Mode complet : échec si un des 63 couples marque × année manque.');
    if (!STRICT && !COMPLETE) console.log('Mode souple : audit informatif (--strict et --complete pour bloquer).');
  }

  process.exitCode = (STRICT && strictFailed) || (COMPLETE && completeFailed) ? 1 : 0;
}

try {
  main();
} catch (error) {
  console.error(`Erreur d'audit : ${error.message}`);
  process.exitCode = 2;
}
