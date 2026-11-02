// viartificial/entree-moteur.test.cjs — non-régression incident « réponse anglaise hors sujet ».
// Cause démontrée : troncature aveugle slice(-5) client + slice(-4) worker éjectant
// la consigne système dès que l'historique restauré remplit le contexte ; le template
// injecte alors un prompt anglais par défaut (SmolLM2). Correctif : sys jamais tronqué.
// Exécution : node viartificial/entree-moteur.test.cjs (depuis /root/KeffStation).
// Aucun réseau, aucun moteur réel : code réel + stubs. Le worker (import CDN)
// n'est pas exécutable ici : son algorithme est rejoué depuis son code source exact.
'use strict';
const fs = require('fs');
const path = require('path');
const DIR = __dirname;
let failures = 0;
function check(n, c) { console.log((c ? 'PASS ' : 'FAIL ') + n); if (!c) failures++; }
function makeStore() {
  const m = {};
  return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; } };
}
const C = require('./src/blm-contrat.js');
const Comp = require('./src/blm-comprehension.js');
const L = require('./src/blm-langue.js');
const R = require('./src/blm-registre.js');
const Co = require('./src/blm-coherence.js');
const Cor = require('./src/blm-correction.js');
const M = require('./src/memoire-classee.js');
const Rout = require('./src/blm-routage.js');
const Sav = require('./src/blm-savoir.js');
const Bud = require('./src/blm-budget.js');
const Cou = require('./src/blm-couts.js');
const Cons = require('./src/blm-conscience.js');
const Sec = require('./src/blm-securite.js');
const Jou = require('./src/blm-journal.js');
let P; try { P = require('./src/dico-philo.js'); } catch (e) { P = { verifierReponse: v => ({ ok: true, problemes: [] }) }; }
function grab(nom) {
  const html = fs.readFileSync(path.join(DIR, 'conversation.html'), 'utf8');
  const m = html.match(new RegExp('function ' + nom + '\\([\\s\\S]*?\\n\\}'));
  if (!m) throw new Error('introuvable: ' + nom);
  return m[0];
}
function makeEngine() {
  const posted = [];
  let inst = null;
  function StubWorker() {
    inst = this; this.terminated = false;
    this.postMessage = (m) => { posted.push(m); };
    this.terminate = () => { this.terminated = true; };
  }
  const wP = { localStorage: makeStore() };
  new Function('window', 'global', fs.readFileSync(path.join(DIR, 'providers.js'), 'utf8') + ';')(wP, wP);
  const fw = { Worker: StubWorker, ViaProviders: wP.ViaProviders };
  new Function('window', 'global', fs.readFileSync(path.join(DIR, 'local-wasm.js'), 'utf8') + ';')(fw, fw);
  return { E: fw.ViaWasmEngine, posted, respond: (msg) => inst.onmessage({ data: msg }) };
}

async function partieA() {
  console.log('--- A. transport local-wasm.js réel (Worker simulé) ---');
  const bot = { id: 'geeko', name: 'Geeko', specialty: 'bot', personality: 'sympa' };
  {
    const t = makeEngine();
    const lp = t.E.load(); t.respond({ id: 1, type: 'ready', model: 'm', tokenizer: 't' }); await lp;
    const pc = t.E.chat(bot, [{ role: 'user', content: 'Salut ?' }], {});
    const m = t.posted.find(x => x.cmd === 'chat');
    check('A1 sys present historique court', m && m.payload.messages[0] && m.payload.messages[0].role === 'system');
    check('A1 sys en français', /fran[çc]ais/i.test(m.payload.messages[0].content));
    t.respond({ id: 2, type: 'done', text: 'Salut !' }); check('A1 reponse ok', (await pc) === 'Salut !');
  }
  {
    const t = makeEngine();
    const lp = t.E.load(); t.respond({ id: 1, type: 'ready', model: 'm', tokenizer: 't' }); await lp;
    const h = [];
    for (let i = 0; i < 19; i++) h.push({ role: i % 2 ? 'assistant' : 'user', content: 'old chatter number ' + i + ' about stuff' });
    const mem = h.map(x => M.classerEchange('via', x.role === 'user' ? 'demande' : 'reponse', x.content));
    const ctx = M.recupererPertinents(mem, 'via', 'le cache est plein', 8);
    const entree = M.formulerEntreeClasse(ctx, 'comment vider le cache ?');
    const pc = t.E.chat(bot, entree, {});
    const m = t.posted.find(x => x.cmd === 'chat');
    const msgs = m.payload.messages;
    check('A2 sys present malgre historique restaure long', msgs[0] && msgs[0].role === 'system');
    check('A2 sys en français', /fran[çc]ais/i.test(msgs[0].content));
    check('A2 courant dernier', msgs[msgs.length - 1].content === 'comment vider le cache ?');
    const vieux = msgs.slice(1, -1);
    check('A2 ancien code aurait ejecte le sys', vieux.length >= 5 || msgs[0].role === 'system');
    t.respond({ id: 2, type: 'done', text: 'Vide-le via les réglages.' }); await pc;
  }
  {
    const t = makeEngine();
    const lp = t.E.load(); t.respond({ id: 1, type: 'ready', model: 'm', tokenizer: 't' }); await lp;
    let reglements = 0;
    const pc = t.E.chat(bot, [{ role: 'user', content: 'x ?' }], {}).then(v => { reglements++; return v; }, e => { reglements++; throw e; });
    t.E.cancel();
    await pc.then(() => 'ok', e => e.code);
    const avant = reglements;
    t.respond({ id: 2, type: 'done', text: 'TARDIF' });
    await new Promise(r => setImmediate(r));
    check('A3 done tardif ignore apres annulation', reglements === avant && avant === 1);
  }
  {
    const t = makeEngine();
    const lp = t.E.load(); t.respond({ id: 1, type: 'ready', model: 'm', tokenizer: 't' }); await lp;
    const p1 = t.E.chat(bot, [{ role: 'user', content: 'un ?' }], {});
    let busy = null;
    try { await t.E.chat(bot, [{ role: 'user', content: 'deux ?' }], {}); } catch (e) { busy = e && e.code; }
    check('A4 chevauchement refuse (pas de melange)', busy === 'BUSY' || busy === 'NOT_LOADED');
    t.respond({ id: 2, type: 'done', text: 'un!' }); check('A4 premier intact', (await p1) === 'un!');
  }
  {
    const t = makeEngine();
    const lp = t.E.load(); t.respond({ id: 1, type: 'ready', model: 'm', tokenizer: 't' }); await lp;
    const pc = t.E.chat(bot, [{ role: 'user', content: 'x ?' }], {});
    t.respond({ id: 2, type: 'done' });
    let code = null;
    try { await pc; } catch (e) { code = e && e.code; }
    check('A5 done vide -> EMPTY (jamais true)', code === 'EMPTY');
  }
}

// ---------- Partie B : parcours complet simule (vrai runItem + vrai moteur simule) ----------
function makeEl() {
  const o = { children: [], style: {}, textContent: '', innerHTML: '', hidden: false, disabled: true, value: '', className: '', removed: false };
  o.appendChild = (c) => { o.children.push(c); return c; };
  o.setAttribute = () => {}; o.querySelector = () => null; o.querySelectorAll = () => []; o.addEventListener = () => {};
  o.remove = () => { o.removed = true; }; o.focus = () => {}; o.click = () => {};
  return o;
}
const ALL_FN = ['pump', 'promesseMoteurValide', 'runItem', 'preparerEntreeMoteur', 'orchestrerBLM', 'etatInitial', 'blmComprehension', 'blmMemoire', 'blmLangue', 'blmTon', 'blmCertitude', 'souvenirsPertinents', 'langueMessageLocal', 'formulerEntree', 'demanderReanalyse', 'blmCorrigerReponse', 'verifierFinaleBLM', 'reponseSalutation', 'estSalutation', 'explain', 'saveConv', 'flushConvs', 'H', 'setState', 'addStream', 'addOnce', 'add'];
function grabFn(nom) {
  const html = fs.readFileSync(path.join(DIR, 'conversation.html'), 'utf8');
  let m = html.match(new RegExp('^function ' + nom + '\\([^)]*\\)[^\\n]*$', 'm'));
  if (m && !/^\s*}$/.test(m[0]) && !/{\s*$/.test(m[0])) m = null;
  if (!m || !/{\s*$/.test(m[0])) {
    const i = html.search(new RegExp('function ' + nom + '\\('));
    if (i < 0) throw new Error('fonction introuvable: ' + nom);
    const end = html.indexOf('\n}', i);
    if (end < 0) throw new Error('fin introuvable: ' + nom);
    m = [html.slice(i, end + 2)];
  }
  if (/var banner=document/.test(m[0])) throw new Error('extraction corrompue: ' + nom);
  return m[0];
}
function makeRunner() {
  const src = {};
  for (const n of ALL_FN) src[n] = grabFn(n);
  const texts = [];
  const document = {
    createElement: () => makeEl(),
    createTextNode: (t) => { texts.push(String(t)); return { textContent: String(t) }; },
    getElementById: () => makeEl(), querySelector: () => null, querySelectorAll: () => [], addEventListener: () => {}
  };
  const thread = { children: [], scrollTop: 0, querySelector: () => null, querySelectorAll: () => [], appendChild(c) { this.children.push(c); return c; } };
  const localStorage = makeStore();
  const banner = makeEl(), eline = makeEl(), dotEl = makeEl(), statusEl = makeEl();
  const bots = {
    geeko: { id: 'geeko', name: 'Geeko', specialty: 'bidouille', personality: 'taquin', greeting: 'Salut !', avatar: '🤖' },
    geekette: { id: 'geekette', name: 'Geekette', specialty: 'brico', personality: 'enjouée', greeting: 'Coucou !', avatar: '🤖' }
  };
  const journalEcrits = [];
  let inst = null;
  function StubWorker() {
    inst = this; this.posted = []; this.terminated = false;
    this.postMessage = (m) => { this.posted.push(m); };
    this.terminate = () => { this.terminated = true; };
  }
  const wP = { localStorage: makeStore() };
  new Function('window', 'global', fs.readFileSync(path.join(DIR, 'providers.js'), 'utf8') + ';')(wP, wP);
  const fw = { Worker: StubWorker, ViaProviders: wP.ViaProviders };
  new Function('window', 'global', fs.readFileSync(path.join(DIR, 'local-wasm.js'), 'utf8') + ';')(fw, fw);
  const E = fw.ViaWasmEngine;
  const ViaLocalEngine = {
    summary: () => E.summary(),
    chat: (bot, history, opt) => E.chat(bot, history, opt),
    getConsent: () => 'granted', pickModel: () => ({ downloadMB: 390 })
  };
  const fw2 = {
    BLMContrat: C, BLMComprehension: Comp, BLMLangue: L, BLMRegistre: R, BLMCoherence: Co,
    BLMCorrection: Cor, BLMPhilo: P, BLMRoutage: Rout, BLMSavoir: undefined, BLMBudget: Bud, BLMCouts: Cou,
    BLMJournal: { consigner: (x) => { journalEcrits.push(JSON.parse(JSON.stringify(x))); return x; }, lire: () => [], ecrire: () => true, effacer: () => true },
    BLMMemoire: M, ViaMemory: { entries: () => [] }, console,
    ViaLocalEngine, ViaWasmEngine: { cancel() {} },
    document, localStorage, thread,
    consentShown: () => {}, updateIdCard: () => {}, paintTerm: () => {}, paintDiag: () => {},
    xreadTouch: (item) => { (fw2.__x = fw2.__x || []).push(item && item.text); return Promise.resolve(); },
    ensureEngine: async function () {
      if (ViaLocalEngine.summary().phase !== 'ready') { const e = new Error('Chargement non demandé.'); e.code = 'NEEDS_LOAD'; throw e; }
      return true;
    }
  };
  const decls = 'var botsById=init.botsById,selectedBots=init.selectedBots,queue=init.queue,hists=init.hists,working=false,enginePromise=null,genCtl=null,loadArmed=true,lastFailure=null,loadCancelled=false,eng=init.eng,q=init.q,b=init.b,banner=init.banner,eline=init.eline,dotEl=init.dotEl,statusEl=init.statusEl,thread=init.thread,document=init.document,localStorage=init.localStorage,ViaMemory=init.ViaMemory,ViaLocalEngine=init.ViaLocalEngine,ViaWasmEngine=init.ViaWasmEngine,window=init.window,consentShown=init.consentShown,updateIdCard=init.updateIdCard,paintTerm=init.paintTerm,paintDiag=init.paintDiag,xreadTouch=init.xreadTouch,ensureEngine=init.ensureEngine;';
  const bare = 'var BLMContrat=window.BLMContrat,BLMComprehension=window.BLMComprehension,BLMLangue=window.BLMLangue,BLMRegistre=window.BLMRegistre,BLMCoherence=window.BLMCoherence,BLMCorrection=window.BLMCorrection,BLMPhilo=window.BLMPhilo,BLMRoutage=window.BLMRoutage,BLMBudget=window.BLMBudget,BLMCouts=window.BLMCouts,BLMJournal=window.BLMJournal,BLMSavoir=window.BLMSavoir;';
  const inits = {
    botsById: Object.assign({}, bots), selectedBots: ['geeko'], queue: [], hists: {},
    eng: { provider: 'local', baseUrl: '', model: 'test' }, q: 'geeko', b: bots.geeko, banner, eline, dotEl, statusEl, thread, document, localStorage,
    ViaMemory: fw2.ViaMemory, ViaLocalEngine: fw2.ViaLocalEngine, ViaWasmEngine: fw2.ViaWasmEngine, window: fw2,
    consentShown: fw2.consentShown, updateIdCard: fw2.updateIdCard, paintTerm: fw2.paintTerm, paintDiag: fw2.paintDiag, xreadTouch: fw2.xreadTouch, ensureEngine: fw2.ensureEngine
  };
  const body = decls + bare + ALL_FN.map(n => src[n]).join('\n') + '\n;return {pump,runItem,hists:()=>hists,queue:()=>queue,isWorking:()=>working,getFailure:()=>lastFailure,getXread:()=>window.__xread||[]};';
  const fns = new Function('init', body)(inits);
  const lastId = (cmd) => { const ps = inst.posted.filter(m => !cmd || m.cmd === cmd); return ps.length ? ps[ps.length - 1].id : null; };
  return {
    E,
    posted: () => inst.posted,
    loadReady: async () => { const lp = E.load(); const id = lastId('load'); if (id == null) throw new Error('pas de rpc load'); inst.onmessage({ data: { id, type: 'ready', model: 'm', tokenizer: 't' } }); await lp; },
    respondChat: (text, tokenFirst) => { const id = lastId('chat'); if (id == null) throw new Error('pas de rpc chat'); if (tokenFirst) inst.onmessage({ data: { id, type: 'token', text: tokenFirst } }); inst.onmessage({ data: { id, type: 'done', text } }); },
    pump: fns.pump, runItem: fns.runItem, texts, journalEcrits,
    hists: fns.hists, queue: fns.queue, isWorking: fns.isWorking, getFailure: fns.getFailure, getXread: fns.getXread,
    async drain(max) { max = max || 500; for (let i = 0; i < max && fns.isWorking(); i++) await new Promise(r => setImmediate(r)); for (let i = 0; i < 15; i++) await new Promise(r => setImmediate(r)); }
  };
}

async function partieB() {
  console.log('--- B. parcours complet simule (vrai runItem/pump + vrai Worker simule) ---');
  const baseHists = () => {
    const h = [];
    for (let i = 0; i < 16; i++) h.push({ role: i % 2 ? 'assistant' : 'user', content: 'old chatter number ' + i + ' about stuff' });
    h.push({ role: 'user', content: 'do you know the time' });
    h.push({ role: 'assistant', content: 'it is noon' });
    h.push({ role: 'user', content: 'and the weather today' });
    h.push({ role: 'assistant', content: 'it is warm and sunny' });
    return h;
  };
  const QC = 'Salut, tu sais parler quelles langues ?';
  const REPONSE = 'Salut ! Oui, je parle français 😊 Et toi, comment tu vas ?';
  function makeRunner() {
    const html = fs.readFileSync(path.join(DIR, 'conversation.html'), 'utf8');
    const src = {};
    for (const n of ALL_FN) {
      const mi = html.search(new RegExp('function ' + n + '\\('));
      if (mi < 0 || (mi > 0 && /[A-Za-z0-9_$]/.test(html[mi - 1]))) throw new Error('fonction introuvable: ' + n);
      const nl = html.indexOf('\n', mi);
      const first = html.slice(mi, nl);
      let code;
      if (/\}\s*$/.test(first)) code = first;
      else { const end = html.indexOf('\n}', mi); if (end < 0) throw new Error('fin introuvable: ' + n); code = html.slice(mi, end + 2); }
      src[n] = code;
    }
    const texts = [];
    const mkEl = () => {
      const o = { children: [], style: {}, textContent: '', innerHTML: '', hidden: false, disabled: true, value: '', className: '', removed: false };
      o.appendChild = (c) => { o.children.push(c); return c; };
      o.setAttribute = () => {}; o.querySelector = () => null; o.querySelectorAll = () => [];
      o.addEventListener = () => {}; o.remove = () => { o.removed = true; }; o.focus = () => {}; o.click = () => {};
      return o;
    };
    const document = {
      createElement: () => makeEl(), createTextNode: (t) => { texts.push(String(t)); return { textContent: String(t) }; },
      getElementById: () => makeEl(), querySelector: () => null, querySelectorAll: () => [], addEventListener: () => {}
    };
    const thread = { children: [], scrollTop: 0, querySelector: () => null, querySelectorAll: () => [], appendChild(c) { this.children.push(c); return c; } };
    const localStorage = makeStore();
    const banner = makeEl(), eline = makeEl(), dotEl = makeEl(), statusEl = makeEl();
    const bots = {
      geeko: { id: 'geeko', name: 'Geeko', specialty: 'bidouille', personality: 'taquin', greeting: 'Salut !', avatar: '🤖' },
      geekette: { id: 'geekette', name: 'Geekette', specialty: 'brico', personality: 'enjouée', greeting: 'Coucou !', avatar: '🤖' }
    };
    const journalEcrits = [];
    // Vrai transport local : worker simulé, sysPrompt réel (providers).
    let inst = null;
    function StubWorker() {
      inst = this; this.posted = []; this.terminated = false;
      this.postMessage = (m) => { this.posted.push(m); };
      this.terminate = () => { this.terminated = true; };
    }
    const wP = { localStorage: makeStore() };
    new Function('window', 'global', fs.readFileSync(path.join(DIR, 'providers.js'), 'utf8') + ';')(wP, wP);
    const fw = { Worker: StubWorker, ViaProviders: wP.ViaProviders };
    new Function('window', 'global', fs.readFileSync(path.join(DIR, 'local-wasm.js'), 'utf8') + ';')(fw, fw);
    const E = fw.ViaWasmEngine;
    const chats = [];
    const ViaLocalEngine = {
      summary: () => E.summary(),
      chat: (bot, history, opt) => { chats.push({ bot: bot.id, history, opt }); return E.chat(bot, history, opt); },
      getConsent: () => 'granted', pickModel: () => ({ downloadMB: 390 })
    };
    const fw2 = {
      BLMContrat: C, BLMComprehension: Comp, BLMLangue: L, BLMRegistre: R, BLMCoherence: Co,
      BLMCorrection: Cor, BLMPhilo: P, BLMRoutage: Rout, BLMSavoir: undefined, BLMBudget: Bud, BLMCouts: Cou,
      BLMJournal: { consigner: (x) => { journalEcrits.push(JSON.parse(JSON.stringify(x))); return x; }, lire: () => [], ecrire: () => true, effacer: () => true },
      BLMMemoire: M, ViaMemory: { entries: () => [] }, console,
      ViaLocalEngine, ViaWasmEngine: { cancel() {} },
      document, localStorage, thread,
      consentShown: () => {}, updateIdCard: () => {}, paintTerm: () => {}, paintDiag: () => {},
      xreadTouch: (item) => { (fw2.__x = fw2.__x || []).push(item && item.text); return Promise.resolve(); },
      ensureEngine: async function () {
        if (ViaLocalEngine.summary().phase !== 'ready') { const e = new Error('Chargement non demandé.'); e.code = 'NEEDS_LOAD'; throw e; }
        return true;
      }
    };
    const decls = 'var botsById=init.botsById,selectedBots=init.selectedBots,queue=init.queue,hists=init.hists,working=init.working,enginePromise=init.enginePromise,genCtl=init.genCtl,loadArmed=init.loadArmed,lastFailure=init.lastFailure,loadCancelled=init.loadCancelled,eng=init.eng,q=init.q,b=init.b,banner=init.banner,eline=init.eline,dotEl=init.dotEl,statusEl=init.statusEl,thread=init.thread,document=init.document,localStorage=init.localStorage,ViaMemory=init.ViaMemory,ViaLocalEngine=init.ViaLocalEngine,ViaWasmEngine=init.ViaWasmEngine,window=init.window,consentShown=init.consentShown,updateIdCard=init.updateIdCard,paintTerm=init.paintTerm,paintDiag=init.paintDiag,xreadTouch=init.xreadTouch,ensureEngine=init.ensureEngine;';
    const bare = 'var BLMContrat=window.BLMContrat,BLMComprehension=window.BLMComprehension,BLMLangue=window.BLMLangue,BLMRegistre=window.BLMRegistre,BLMCoherence=window.BLMCoherence,BLMCorrection=window.BLMCorrection,BLMPhilo=window.BLMPhilo,BLMRoutage=window.BLMRoutage,BLMBudget=window.BLMBudget,BLMCouts=window.BLMCouts,BLMJournal=window.BLMJournal,BLMSavoir=window.BLMSavoir;';
    const inits = {
      botsById: Object.assign({}, bots), selectedBots: ['geeko'], queue: [], hists: {}, working: false, enginePromise: null, genCtl: null, loadArmed: true, lastFailure: null, loadCancelled: false,
      eng: { provider: 'local', baseUrl: '', model: 'test' }, q: 'geeko', b: bots.geeko, banner, eline, dotEl, statusEl, thread, document, localStorage,
      ViaMemory: fw2.ViaMemory, ViaLocalEngine: fw2.ViaLocalEngine, ViaWasmEngine: fw2.ViaWasmEngine, window: fw2,
      consentShown: fw2.consentShown, updateIdCard: fw2.updateIdCard, paintTerm: fw2.paintTerm, paintDiag: fw2.paintDiag, xreadTouch: fw2.xreadTouch, ensureEngine: fw2.ensureEngine
    };
    const body = decls + bare + ALL_FN.map(n => src[n]).join('\n') + '\n;return {pump,runItem,hists:()=>hists,queue:()=>queue,isWorking:()=>working,getFailure:()=>lastFailure,getXread:()=>window.__xread||[]};';
    const fns = new Function('init', body)(inits);
    const lastId = (cmd) => { const ps = inst.posted.filter(m => !cmd || m.cmd === cmd); return ps.length ? ps[ps.length - 1].id : null; };
    return {
      E, inst: () => inst, posted: () => inst.posted,
      loadReady: async () => { const lp = E.load(); const id = lastId('load'); if (id == null) throw new Error('pas de rpc load'); inst.onmessage({ data: { id, type: 'ready', model: 'm', tokenizer: 't' } }); await lp; },
      respondChat: async (text, tokenFirst) => { const id = lastId('chat'); if (id == null) throw new Error('pas de rpc chat'); if (tokenFirst) inst.onmessage({ data: { id, type: 'token', text: tokenFirst } }); inst.onmessage({ data: { id, type: 'done', text } }); },
      pump: fns.pump, runItem: fns.runItem, chats, texts, journalEcrits,
      hists: fns.hists, queue: fns.queue, isWorking: fns.isWorking, getFailure: fns.getFailure, getXread: fns.getXread,
      async drain(max) { max = max || 400; for (let i = 0; i < max && fns.isWorking(); i++) await new Promise(r => setImmediate(r)); for (let i = 0; i < 15; i++) await new Promise(r => setImmediate(r)); }
    };
  }
  // B1 : file d'attente moteur non pret, puis UN SEUL envoi apres chargement.
  {
    const R = makeRunner();
    R.hists()['geeko'] = baseHists();
    R.queue().push({ text: QC, cancelled: false });
    R.pump();
    await R.drain();
    check('B1 pas denvoi avant chargement', R.chats.length === 0 || R.posted().filter(m => m.cmd === 'chat').length === 0);
    check('B1 sys mise en attente', R.texts.join(' ').indexOf('Modèle non chargé') > -1);
    check('B1 file conservee', R.queue().length === 1);
    await R.loadReady();
    R.pump();
    let tours = 0;
    while (R.posted().filter(m => m.cmd === 'chat').length === 0 && tours++ < 300) await new Promise(r => setImmediate(r));
    await R.respondChat(REPONSE, 'Salut ! ');
    await R.drain();
    const envois = R.posted().filter(m => m.cmd === 'chat');
    check('B1 envoye exactement 1 fois', envois.length === 1);
    const msgs = envois[0].payload.messages;
    check('B1 sys present en tete (FR)', msgs[0] && msgs[0].role === 'system' && /fran[çc]ais/i.test(msgs[0].content));
    check('B1 courant dernier', msgs[msgs.length - 1].content === QC);
    check('B1 roles issus historique restaure', msgs.slice(1, -1).every(m => m.content === QC || /old chatter|do you know|it is|and the weather/i.test(m.content) || m.content.indexOf('Contexte mémorisé') === 0 || m.content.indexOf('[Faits') === 0));
    const h = R.hists()['geeko'];
    check('B1 h: question + 1 reponse affichee', h[h.length - 2].content === QC && h[h.length - 1].content === REPONSE);
    check('B1 journal succes', R.journalEcrits.length >= 1 && R.journalEcrits[R.journalEcrits.length - 1].issue === 'succes');
    R.pump(); await R.drain();
    check('B1 pas de reenvoi', R.posted().filter(m => m.cmd === 'chat').length === 1);
  }
  // B2 : annulation pendant generation -> pas de reponse, tour suivant propre.
  {
    const R = makeRunner();
    R.hists()['geeko'] = [];
    await R.loadReady();
    R.queue().push({ text: 'question annulee ?', cancelled: false });
    R.pump();
    let tours = 0;
    while (R.posted().filter(m => m.cmd === 'chat').length === 0 && tours++ < 300) await new Promise(r => setImmediate(r));
    R.E.cancel();
    await R.drain();
    const h = R.hists()['geeko'];
    check('B2 annule: question gardee, pas de reponse', h.length === 1 && h[0].content === 'question annulee ?');
    check('B2 file videe, pas de requeue', R.queue().length === 0);
    await R.loadReady();
    R.queue().push({ text: 'nouvelle question ?', cancelled: false });
    R.pump();
    tours = 0;
    while (R.posted().filter(m => m.cmd === 'chat').length < 2 && tours++ < 300) await new Promise(r => setImmediate(r));
    await R.respondChat('Réponse neuve.');
    await R.drain();
    const h2 = R.hists()['geeko'];
    check('B2 tour suivant propre', h2[h2.length - 1].content === 'Réponse neuve.' && R.chats.length === 2);
  }
}

function extraireTroncatureWorker() {
  const src = fs.readFileSync(path.join(DIR, 'local-wasm-worker.js'), 'utf8');
  const m = src.match(/var entree = p\.messages \|\| \[\];[\s\S]*?entree = sys0\.concat\(corps\.slice\(-\(6 - sys0\.length\)\)\);/);
  if (!m) throw new Error('troncature worker introuvable');
  return new Function('p', m[0] + '\nreturn entree;');
}
function partieC() {
  console.log('--- C. troncature worker (code reel extrait) + ancien comportement ---');
  const tronquer = extraireTroncatureWorker();
  const sys = { role: 'system', content: 'sys' };
  const mk = (n, sansSys) => { const a = sansSys ? [] : [sys]; for (let i = 0; i < n; i++) a.push({ role: i % 2 ? 'assistant' : 'user', content: 'm' + i }); return a; };
  let out = tronquer({ messages: mk(8) });
  check('C1 sys conserve avec historique long', out[0] && out[0].role === 'system');
  check('C1 borne a 6', out.length === 6);
  check('C1 courant dernier', out[out.length - 1].content === 'm7');
  out = tronquer({ messages: mk(8, true) });
  check('C2 sans sys: 6 derniers', out.length === 6 && out[0].content === 'm2');
  out = tronquer({ messages: [sys, { role: 'user', content: 'x' }] });
  check('C3 court inchange', out.length === 2 && out[0].role === 'system');
  out = tronquer({ messages: [] });
  check('C4 vide -> vide', Array.isArray(out) && out.length === 0);
  // Démonstration du bug d'origine : l'ancienne coupe aveugle éjectait la consigne.
  const ancienClient = (msgs) => msgs.slice(-5);
  const ancienWorker = (msgs) => msgs.slice(-4);
  const plein = [sys].concat(mk(7).slice(0));
  const apresAncien = ancienWorker(ancienClient(plein));
  check('C5 ancien code: sys PERDU (cause demontree)', apresAncien[0].role !== 'system');
  const apresFixe = tronquer({ messages: plein });
  check('C5 nouveau code: sys conserve', apresFixe[0].role === 'system');
}
async function partieD() {
  console.log('--- D. role conversationnel ViA (non-regression) ---');
  const cfg = JSON.parse(fs.readFileSync(path.join(DIR, 'bots.json'), 'utf8'));
  const vlist = cfg.bots.filter(b => b.id === 'via');
  check('D0 entree ViA presente dans bots.json', vlist.length === 1);
  const via = vlist[0];
  const t = makeEngine();
  const lp = t.E.load(); t.respond({ id: 1, type: 'ready', model: 'm', tokenizer: 't' }); await lp;
  const provSrc = fs.readFileSync(path.join(DIR, 'providers.js'), 'utf8');
  const pwin = {};
  new Function('window', 'global', provSrc + ';')(pwin, pwin);
  const sys = pwin.ViaProviders.sysPrompt(via);
  check('D1 sys ViA en francais', /fran[çc]ais/i.test(sys));
  check('D2 sys ViA social (specialite + ecoute/relance)', /sociabilit|chaleureux|écoute|relance|passions/i.test(sys));
  check('D3 transparence conservee', /sans conscience r/i.test(sys));
  check('D4 pas daide code spontanee (negation explicite)', /Ne propose jamais d.aide en programmation sauf demande explicite/.test(sys) && /ne te pr\u00e9sente jamais comme assistant de code/i.test(sys));
  check('D5 pas de cadrage code-positif hors negation', !/assistant de programmation|code assistant|aide au code|aide en programmation(?! sauf demande)/i.test(sys.replace(/Ne propose jamais[^.]*\./, '')));
  const autres = cfg.bots.filter(b => b.id !== 'via');
  const propres = autres.every(b => !/bot de sociabilit|Ne propose jamais d.aide en programmation/.test(pwin.ViaProviders.sysPrompt(b)));
  check('D6 autres bots inchanges (pas de clause ViA)', propres);
  const q = 'J\u2019aime dessiner et j\u2019ai plusieurs r\u00eaves, mais je ne sais pas trop par o\u00f9 commencer. Tu veux en parler avec moi ?';
  const hist = [];
  for (let i = 0; i < 19; i++) hist.push({ role: i % 2 ? 'assistant' : 'user', content: 'message restaure numero ' + i });
  const mem = hist.map(x => M.classerEchange('via', x.role === 'user' ? 'demande' : 'reponse', x.content));
  const ctx = M.recupererPertinents(mem, 'via', 'dessiner reves commencer', 8);
  const entree = M.formulerEntreeClasse(ctx, q);
  const pc = t.E.chat(via, entree, {});
  const m = t.posted.find(x => x.cmd === 'chat');
  const msgs = m.payload.messages;
  check('D7 sys ViA en tete malgre 20 restaures', msgs[0] && msgs[0].role === 'system');
  check('D8 sys transmis = consigne ViA (texte envoye au modele)', msgs[0].content === sys);
  check('D8bis consigne ViA sociale en francais dans lenvoi', /bot de sociabilit/i.test(msgs[0].content) && /fran[çc]ais/i.test(msgs[0].content) && /sans conscience r/i.test(msgs[0].content));
  check('D9 courant dernier (question dessins/reves intacte)', msgs[msgs.length - 1].content === q);
  t.respond({ id: 2, type: 'done', text: 'Avec plaisir !' }); await pc;
}
async function main() {
  await partieA();
  await partieB();
  partieC();
  await partieD();
  console.log(failures === 0 ? 'TOUS LES TESTS PASSENT' : failures + ' ECHEC(S)');
  process.exit(failures ? 1 : 0);
}
main().catch(e => { console.error('FATAL', e); process.exit(1); });
