// scripts/gen-cos-graphe.cjs — Graphe COS : UN MILLION de liens candidats.
// Génère UNE fois : node scripts/gen-cos-graphe.cjs (cwd = racine KeffStation).
// Modes : (défaut) générer | --cherche DE OP VERS CTX | --evoluer obs.jsonl
// Nœuds (170) : 110 BLM + 16 familles + 2 langues + 15 patterns + 4 paramètres
// (registre généré du catalogue) + 7 SuperBots (bots.json) + 4 moteurs +
// 11 orchestrateurs (PARCOURS) + 1 LLM partagé. Paires ordonnées sans auto-lien
// (diagonale interdite, matrice) × 3 opérateurs traversables (to/→/← ; ↔
// jamais traversable) × 12 contextes = 1 034 280 candidats.
// Chaque lien est VÉRIFIÉ (compatibilité classes/propriétés), jamais créé
// aveuglément : statut candidat → valide | ecarte (+motif). 'actif' est réservé
// à la promotion par résultats/mesures réels (--evoluer) ; aucun actif initial.
// Le parcours actif ne charge JAMAIS le million : sélection sur les liens
// utiles (cos-defaut + équipe + borne), vérifiés ici comme sous-ensemble valide.
// Stockage : viartificial/src/cos-graphe/shard-<ctx>.jsonl (ignorés par git,
// régénérables) + index.json (suivi). Runtime navigateur : inchangé (léger).
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const VDIR = path.join(ROOT, 'viartificial');
const GDIR = path.join(VDIR, 'src', 'cos-graphe');
const REG = require(path.join(VDIR, 'src', 'cos-registre.js')).REGISTRE;
const Eq = require(path.join(VDIR, 'src', 'blm-equipe.js'));
const COSL = require(path.join(VDIR, 'src', 'cos-langage.js'));
const BOTS = JSON.parse(fs.readFileSync(path.join(VDIR, 'bots.json'), 'utf8')).bots;
const CTX = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'salutation', 'minimal', 'repli', 'linguistique', 'ordinaire', 'globale'];
const OPS = ['to', '→', '←'];
const MOTEURS = {
  'moteur:local': { classe: 'moteur', nom: 'CPU/WASM local', reel: true, condition: 'toujours (moteur du prototype)', source: 'local-engine.js' },
  'moteur:ollama': { classe: 'moteur', nom: 'Ollama distant', reel: false, condition: 'adresse configurée', source: 'providers.js' },
  'moteur:custom': { classe: 'moteur', nom: 'Endpoint personnalisé', reel: false, condition: 'adresse + clé session', source: 'providers.js' },
  'moteur:repli': { classe: 'moteur', nom: 'Repli modèle local', reel: true, condition: 'toujours (sans moteur)', source: 'conversation.html reponseSalutation' },
};
// Nœuds : registre + SuperBots + moteurs + orchestrateurs + LLM partagé.
function noeuds() {
  const N = {};
  Object.keys(REG).forEach((k) => { N[k] = Object.assign({ id: k }, REG[k]); });
  BOTS.forEach((b) => { N['bot:' + b.id] = { id: 'bot:' + b.id, classe: 'superbot', nom: b.name, specialite: b.specialty, source: 'bots.json' }; });
  Object.keys(MOTEURS).forEach((k) => { N[k] = Object.assign({ id: k }, MOTEURS[k]); });
  Eq.PARCOURS.forEach((p) => { N['etape:' + p.nom] = { id: 'etape:' + p.nom, classe: 'orchestrateur', nom: p.nom, role: p.role, blm: p.blm, source: 'blm-equipe.js PARCOURS' }; });
  N['llm:partage'] = { id: 'llm:partage', classe: 'llm', nom: 'LLM partagé (inférence unique)', source: 'providers.js + local-wasm.js' };
  return N;
}
const N = noeuds();
const IDS = Object.keys(N).sort();
const VAGUE_BLOCS = {};
Eq.EQUIPES.standard.vagues.forEach((v) => (VAGUE_BLOCS[v.nom] = v.blocs));
// Phases S par famille (FAMILLES_PAR_VAGUE), pour adjacence stricte.
const PHASE = {};
Object.keys(Eq.FAMILLES_PAR_VAGUE).forEach((vn, i) => {
  const m = vn.match(/S(\d)/);
  (Eq.FAMILLES_PAR_VAGUE[vn] || []).forEach((f) => { if (m && !(f in PHASE)) PHASE[f] = +m[1]; });
});
function famDe(n) { const d = typeof n === 'string' ? N[n] : n; return d && d.def ? d.def.famille : d.famille; }
function compat(a, b) {
  if (a.id === b.id) return { ok: false, motif: 'diagonale-interdite' };
  const ca = a.def.classe, cb = b.def.classe;
  if (['BLM', 'famille', 'langue', 'pattern', 'parametre'].includes(ca) && ['BLM', 'famille', 'langue', 'pattern', 'parametre'].includes(cb)) {
    if (ca === 'famille' && cb === 'famille') {
      const pa = PHASE[a.def.nom], pb = PHASE[b.def.nom];
      if (pa !== undefined && pb !== undefined && Math.abs(pa - pb) === 1) return { ok: true, motif: 'phases-S-adjacentes' };
      return { ok: false, motif: 'phases-non-adjacentes' };
    }
    return COSL.compatible({ resolu: true, id: a.id, def: a.def }, { resolu: true, id: b.id, def: b.def });
  }
  if (ca === 'superbot' && cb === 'BLM') return { ok: true, motif: 'session-par-bot' };
  if (ca === 'BLM' && cb === 'superbot') return { ok: true, motif: 'resultat-vers-bot-actif' };
  if (ca === 'superbot' && cb === 'superbot') return { ok: false, motif: 'memoires-cloisonnees' };
  if (ca === 'moteur' && cb === 'orchestrateur' && /llm-partage/.test(b.id)) {
    return a.def.reel ? { ok: true, motif: 'moteur-partage-reel' } : { ok: true, motif: 'moteur-partage-conditionnel' };
  }
  if (ca === 'moteur' && cb === 'BLM') return { ok: false, motif: 'moteur-ne-commande-pas' };
  if (ca === 'BLM' && cb === 'moteur') {
    if (a.id === '066' || a.id === '068') return { ok: true, motif: 'choix-moteur-' + a.id };
    return { ok: false, motif: 'pas-de-correspondance-BLM-moteur' };
  }
  if (ca === 'orchestrateur' && cb === 'BLM') {
    const stage = Eq.PARCOURS.find((p) => 'etape:' + p.nom === a.id) || {};
    if (stage.blm && stage.blm === b.id) return { ok: true, motif: 'etape-blm' };
    if (a.id === 'etape:equipe-pertinente' && [].concat(...Eq.EQUIPES.standard.vagues.map((v) => v.blocs)).includes(b.id)) return { ok: true, motif: 'equipe-mobilise' };
    return { ok: false, motif: 'pas-de-lien-documente' };
  }
  if (ca === 'orchestrateur' && cb === 'superbot' && a.id === 'etape:orchestrateur-selection') return { ok: true, motif: 'selection' };
  if (ca === 'superbot' && cb === 'orchestrateur' && b.id === 'etape:registre-superbots') return { ok: true, motif: 'registre-003' };
  if (ca === 'orchestrateur' && cb === 'orchestrateur') {
    const oa = Eq.PARCOURS.find((p) => 'etape:' + p.nom === a.id), ob = Eq.PARCOURS.find((p) => 'etape:' + p.nom === b.id);
    if (oa && ob && ob.ordre === oa.ordre + 1) return { ok: true, motif: 'ordre-parcours' };
    return { ok: false, motif: 'etapes-non-consecutives' };
  }
  if (ca === 'llm' && cb === 'moteur') return { ok: true, motif: 'moteur-partage' };
  return { ok: false, motif: 'pas-de-lien-documente' };
}
function generer() {
  if (!fs.existsSync(GDIR)) fs.mkdirSync(GDIR, { recursive: true });
  const parCtx = {};
  let total = 0, valides = 0;
  const t0 = Date.now();
  // Ordre déterministe : de, op, vers. Contexte en dimension lente.
  for (const ctx of CTX) {
    const ws = fs.createWriteStream(path.join(GDIR, 'shard-' + ctx + '.jsonl'));
    let n = 0, v = 0;
    for (const de of IDS) {
      for (const op of OPS) {
        for (const vers of IDS) {
          if (de === vers) continue;
          const c = compat({ id: de, def: N[de] }, { id: vers, def: N[vers] });
          const statut = c.ok ? 'valide' : 'ecarte';
          if (c.ok) { v++; valides++; }
          ws.write(JSON.stringify([de, op, vers, statut, c.motif]) + '\n');
          n++; total++;
        }
      }
    }
    ws.end();
    parCtx[ctx] = { total: n, valides: v };
    console.log('shard ' + ctx + ' : ' + n + ' (' + v + ' valides)');
  }
  // Vérifie : les 118 paires Dépend du doc défaut sont valides.
  const defaut = require(path.join(VDIR, 'src', 'cos-defaut.js'));
  const paires = [...defaut.matchAll(/<co>([^<]+)<\/co>/g)].map((m) => m[1]);
  let ok = 0;
  paires.forEach((p0) => {
    const p = String(p0).replace(/[︎\uFE0E\uFE0F]/g, '');
    const m = p.match(/^([A-Za-z0-9]+)(to|➡|→|⬅|←)([A-Za-z0-9]+)$/);
    if (!m || !N[m[1]] || !N[m[3]]) { console.log('DIVERGENCE doc-defaut (illisible) : ' + p0); return; }
    const c = compat({ id: m[1], def: N[m[1]] }, { id: m[3], def: N[m[3]] });
    if (c.ok) ok++;
    else console.log('DIVERGENCE doc-defaut : ' + p + ' -> ' + c.motif);
  });
  const index = { version: 1, genereLe: new Date().toISOString(), total, valides, parContexte: parCtx,
    statuts: ['candidat', 'valide', 'ecarte', 'actif-confirme(par --evoluer, résultats réels uniquement)'],
    dependDocDefaut: ok + '/' + paires.length + ' valides',
    generateur: 'scripts/gen-cos-graphe.cjs (déterministe, sans aléa)',
    note: 'Le parcours actif ne charge jamais les shards : sélection sur liens utiles (cos-defaut + équipe + borne).' };
  fs.writeFileSync(path.join(GDIR, 'index.json'), JSON.stringify(index, null, 1));
  console.log('TOTAL ' + total + ' valides ' + valides + ' en ' + ((Date.now() - t0) / 1000).toFixed(1) + 's');
  console.log('doc-defaut valides : ' + ok + '/' + paires.length);
}
function chercher(de, op, vers, ctx) {
  const f = path.join(GDIR, 'shard-' + ctx + '.jsonl');
  if (!fs.existsSync(f)) { console.log('shard manquant : ' + ctx + ' (générer d abord)'); process.exit(1); }
  const lignes = fs.readFileSync(f, 'utf8').split('\n');
  const trouves = [];
  for (const l of lignes) {
    if (!l) continue;
    try {
      const r = JSON.parse(l);
      if ((!de || r[0] === de) && (!op || r[1] === op) && (!vers || r[2] === vers)) { trouves.push(r); if (trouves.length >= 20) break; }
    } catch (e) {}
  }
  console.log(trouves.length + ' lien(s) :');
  trouves.forEach((r) => console.log(' ' + r[0] + r[1] + r[2] + ' [' + ctx + '] ' + r[3] + ' (' + r[4] + ')'));
}
function evoluer(fichier) {
  // Progression UNIQUEMENT depuis des résultats/mesures réels observés :
  // obs.jsonl = lignes {"de","op","vers","ctx"} constatées exécutées.
  const obs = fs.readFileSync(fichier, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const parCtx = {};
  obs.forEach((o) => { (parCtx[o.ctx] = parCtx[o.ctx] || []).push(o); });
  let promus = 0;
  Object.keys(parCtx).forEach((ctx) => {
    const f = path.join(GDIR, 'shard-' + ctx + '.jsonl');
    if (!fs.existsSync(f)) return;
    const lignes = fs.readFileSync(f, 'utf8').split('\n');
    const cles = new Set(parCtx[ctx].map((o) => o.de + '|' + o.op + '|' + o.vers));
    const stamp = new Date().toISOString().slice(0, 10);
    const sorties = lignes.map((l) => {
      if (!l) return l;
      try {
        const r = JSON.parse(l);
        if (cles.has(r[0] + '|' + r[1] + '|' + r[2]) && r[3] === 'valide') { r[3] = 'actif-confirme-' + stamp; promus++; }
        return JSON.stringify(r);
      } catch (e) { return l; }
    });
    fs.writeFileSync(f, sorties.join('\n'));
  });
  console.log('promus actif-confirme : ' + promus + ' (seulement des valides observés réellement)');
}
const args = process.argv.slice(2);
if (args[0] === '--cherche') chercher(args[1], args[2], args[3], args[4] || 'globale');
else if (args[0] === '--evoluer') evoluer(args[1]);
else generer();
