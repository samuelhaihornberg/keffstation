#!/usr/bin/env node
/**
 * Fusionne les suggestions média (tools/media-suggestions.json) dans data/catalogue.js.
 *
 * Usage:
 *   node tools/merge-media-suggestions.js [--dry-run] [--include-failed] [--replace]
 *
 * - Par défaut, n'ajoute que les suggestions téléchargées (_downloaded !== false) et
 *   évite les doublons (même `fichier`).
 * - --include-failed : inclut aussi les suggestions non téléchargées.
 * - --replace : remplace les images existantes du produit par les suggestions retenues.
 * - Retire les champs internes préfixés par `_` avant insertion.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CATALOGUE_PATH = path.join(ROOT, 'data', 'catalogue.js');
const SUG_PATH = path.join(ROOT, 'tools', 'media-suggestions.json');

function parseArgs(argv){
  const args={dryRun:false, includeFailed:false, replace:false, help:false};
  for(let i=2;i<argv.length;i++){
    const a=argv[i];
    if(a==='--dry-run') args.dryRun=true;
    else if(a==='--include-failed') args.includeFailed=true;
    else if(a==='--replace') args.replace=true;
    else if(a==='--help'||a==='-h') args.help=true;
  }
  return args;
}

function loadCatalogueFile(){
  const raw=fs.readFileSync(CATALOGUE_PATH,'utf8');
  const prefix='export const CATALOGUE = ';
  const idx=raw.indexOf(prefix);
  if(idx===-1) throw new Error('Préfixe "export const CATALOGUE = " introuvable');
  let body=raw.slice(idx+prefix.length);
  body=body.replace(/;\s*$/,'');
  let data;
  try{ data=Function('return ('+body+')')(); }catch(e){ throw new Error('Parse catalogue impossible: '+e.message); }
  return {raw, prefix, data};
}

function cleanSuggestion(s){
  const out={};
  for(const [k,v] of Object.entries(s||{})){
    if(k.startsWith('_')) continue;
    out[k]=v;
  }
  return out;
}

function main(){
  const args=parseArgs(process.argv);
  if(args.help){
    console.log('Usage: node tools/merge-media-suggestions.js [--dry-run] [--include-failed] [--replace]');
    process.exit(0);
  }
  if(!fs.existsSync(SUG_PATH)) throw new Error('Fichier introuvable: '+SUG_PATH);
  const sug=JSON.parse(fs.readFileSync(SUG_PATH,'utf8'));
  const byId=new Map((sug.products||[]).map(p=>[p.id,p]));
  const {data}=loadCatalogueFile();
  const products=Array.isArray(data.produits)?data.produits:[];
  let changedProducts=0, addedImages=0, skipped=0;

  for(const p of products){
    const entry=byId.get(p.id);
    if(!entry) continue;
    const suggestions=(entry.suggested||[]).filter(s=>args.includeFailed ? true : s && s._downloaded!==false);
    if(!suggestions.length) continue;
    if(!p.medias || typeof p.medias!=='object') p.medias={images:[],videos:[]};
    if(!Array.isArray(p.medias.images)) p.medias.images=[];
    if(args.replace) p.medias.images=[];
    const existing=new Set(p.medias.images.map(im=>im && im.fichier).filter(Boolean));
    let localAdded=0;
    for(const s of suggestions){
      const clean=cleanSuggestion(s);
      if(!clean.fichier) { skipped++; continue; }
      if(existing.has(clean.fichier)) { skipped++; continue; }
      p.medias.images.push(clean);
      existing.add(clean.fichier);
      localAdded++; addedImages++;
    }
    if(localAdded>0) changedProducts++;
  }

  const out = 'export const CATALOGUE = ' + JSON.stringify(data, null, 2) + ';\n';
  console.log(`Produits modifiés: ${changedProducts}, images ajoutées: ${addedImages}, ignorées/doublons: ${skipped}`);
  if(args.dryRun){
    console.log('Dry-run: aucune écriture effectuée.');
  } else {
    fs.writeFileSync(CATALOGUE_PATH, out, 'utf8');
    console.log(`Catalogue mis à jour: ${path.relative(ROOT, CATALOGUE_PATH)}`);
  }
}

try{ main(); }catch(e){ console.error(e.message); process.exit(1); }
