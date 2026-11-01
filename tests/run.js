// Suite de tests KeffStation : node tests/run.js (zéro dépendance).
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
let failures = 0;

function check(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
  } catch (e) {
    failures++;
    console.error(`❌ ${name} : ${e.message}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const appJs = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const swJs = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));

check('syntaxe app.js / install.js / sw.js', () => {
  const files = ['app.js', 'install.js', 'refresh.js', 'sw.js', 'kifftech/sw.js', 'tricktrocjob/sw.js', 'viartificial/sw.js', 'cos-editor/sw.js', 'linguistic-motors/sw.js', 'videogames/sw.js'];
  for (const f of files) {
    execSync(`node --check ${f}`, { cwd: ROOT, stdio: 'pipe' });
  }
});

check('caches vidés (v2) et adaptatifs', () => {
  const sws = ['sw.js', 'kifftech/sw.js', 'tricktrocjob/sw.js', 'viartificial/sw.js', 'cos-editor/sw.js', 'linguistic-motors/sw.js', 'videogames/sw.js'];
  for (const f of sws) {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    assert(/-v\d+'/.test(src), `${f}: version cache absente (vieux cache conservé)`);
    assert(!/-v1'/.test(src), `${f}: référence v1 restante`);
    assert(src.includes("mode === 'navigate'") || src.includes('mode==='), `${f}: stratégie navigation absente`);
    assert(src.includes('woff2'), `${f}: stratégie statiques absente`);
    assert(!/"\/(index\.html|app\.js|manifest\.json)"/.test(src), `${f}: chemin absolu`);
  }
});

check('4 faces PWA avec URLs', () => {
  const urls = [...appJs.matchAll(/appUrl:\s*"([^"]+)"/g)].map((m) => m[1]);
  assert(urls.length === 4, `attendu 4 appUrl, trouvé ${urls.length}`);
  assert(urls.every((u) => u.startsWith('https://samuelhaihornberg.github.io/keffstation/')), 'URLs hors scope keffstation');
  for (const gone of ['num: "Moteurs linguistiques"', 'num: "Éditeur cos"']) {
    assert(!appJs.includes(gone), `face restante : ${gone}`);
  }
  assert(appJs.includes('num: "Tricktrocjob"'), 'face Tricktrocjob absente');
  assert(appJs.includes('Moteurs linguistiques : NLP local'), 'articles NLP absents de ViArtificial');
  assert(appJs.includes('Éditeur cos : écrire la syntaxe'), 'articles cos absents de ViArtificial');
});

check('rotation cube correcte faces 0-5', () => {
  const m = appJs.match(/updateCubeRotation\(\) \{([\s\S]*?)\n  \}\n/);
  assert(m, 'méthode introuvable');
  const ctx = { current: 0, currentRotationY: 0, cube: { style: {} }, faces: [] };
  const fn = new Function(m[1]);
  const expected = ['rotateY(0deg)', 'rotateY(-90deg)', 'rotateY(-180deg)', 'rotateY(-270deg)'];
  expected.forEach((exp, i) => {
    ctx.current = i;
    fn.call(ctx);
    assert(ctx.cube.style.transform === exp, `face ${i}: ${ctx.cube.style.transform} != ${exp}`);
  });
});

check('boutons embed ouvrent overlay (pas de navigation forcée)', () => {
  assert(appJs.includes('this.openEmbed(app)'), 'openEmbed non branché');
  assert(/if \(app\.embedUrl\) \{\s*this\.openEmbed\(app\)/.test(appJs), 'overlay non prioritaire');
});

check('chemins relatifs GitHub Pages (SW + manifest)', () => {
  assert(!/"\/(index\.html|app\.js|manifest\.json)"/.test(swJs), 'SW: chemin absolu restant');
  assert(manifest.start_url === './', `start_url = ${manifest.start_url}`);
});

check('éléments DOM requis présents', () => {
  for (const id of ['cube', 'nav', 'arrows', 'loading', 'embed-overlay', 'embed-iframe']) {
    assert(indexHtml.includes(`id="${id}"`), `#${id} manquant`);
  }
});

check('faces actives droites (pas de miroir)', () => {
  // rotation cube + transform .active doivent s'annuler (net 0°)
  const cubeRot = { 0: 0, 1: -90, 2: -180, 3: -270 };
  const faceRotY = { 0: 0, 1: 90, 2: 180, 3: -90 };
  const get = (face) => {
    const re = new RegExp(`\\.cube-face\\.active\\[data-face="${face}"\\]\\{[^}]*transform:([^;}]+)`);
    const m = indexHtml.match(re);
    assert(m, `règle .active face ${face} introuvable`);
    return m[1];
  };
  for (const i of [0, 1, 2, 3]) {
    const t = get(i);
    const ry = new RegExp(`rotateY\\(${faceRotY[i]}deg\\)`).test(t);
    assert(ry, `face ${i} active non droite : ${t.trim()}`);
    assert(((cubeRot[i] + faceRotY[i]) % 360 + 360) % 360 === 0, `face ${i}: net non nul`);
  }
  assert(!/data-face="[45]"/.test(indexHtml), 'règles CSS pour faces inexistantes');
});

check('KiffTech : page rayons + filtre ?rayon', () => {
  const rayons = fs.readFileSync(path.join(ROOT, 'kifftech/rayons.html'), 'utf8');
  assert(rayons.includes('catalog.html?rayon='), 'rayons.html: liens ?rayon absents');
  for (const c of ["'Smartphones'", "'Computers'", "'Tablets'", "'Audio & Wearables'", "'VR AR gadgets'", "'Garden & furnitures smart devices'", "'Composant electronic & informatic'", "'Company & studying Robots'"]) {
    assert(rayons.includes(`id: ${c}`), `rayons.html: rayon ${c} absent`);
  }
  const kapp = fs.readFileSync(path.join(ROOT, 'kifftech/app.v2.js'), 'utf8');
  assert(kapp.includes("params.get('rayon')"), 'catalogue: support ?rayon absent');
  const kcat = fs.readFileSync(path.join(ROOT, 'kifftech/catalog.html'), 'utf8');
  assert(/src="app\.v2\.js(\?v=\d+)?"/.test(kcat), 'catalog.html: ne charge pas app.v2.js');
  execSync('node --check kifftech/app.v2.js', { cwd: ROOT, stdio: 'pipe' });
  assert(appJs.includes('kifftech/rayons.html'), 'cube: bouton KiffTech ne mène pas aux rayons');
});

check('catalogue : pas de plantage sur éléments absents', () => {
  const kapp = fs.readFileSync(path.join(ROOT, 'kifftech/app.v2.js'), 'utf8');
  assert(!/^\s*\$\('#(btn-fetch|btn-clear|btn-subscribe|btn-subscribe-header|btn-cart-header|modal-close|modal-overlay)'\)\.addEventListener/m.test(kapp), 'addEventListener non gardé');
  assert(kapp.includes('if(mt)mt.dataset.currentId'), 'modal-title non gardé');
});
check('agent IA : référence exacte + previews + prix barrés', () => {
  const kapp = fs.readFileSync(path.join(ROOT, 'kifftech/app.v2.js'), 'utf8');
  assert(kapp.includes('function agentFind'), 'agentFind absent');
  assert(kapp.includes('function previewImage'), 'previewImage absent');
  assert(kapp.includes('CAT_EMOJI'), 'emojis rayons absents');
  assert(/let discount=10/.test(kapp), 'remise de base -10% absente');
  const kcat = fs.readFileSync(path.join(ROOT, 'kifftech/catalog.html'), 'utf8');
  assert(kcat.includes('id="agent-input"') && kcat.includes('id="agent-result"'), 'panneau agent absent du catalogue');
  assert(kapp.includes('previewImage(p)'), 'galerie modale sans secours visuel');
  assert(kapp.includes('p.description ||'), 'description partenaire ignorée en modale');
});
check('visuels produits officiels (batch smartphones)', () => {
  const kapp = fs.readFileSync(path.join(ROOT, 'kifftech/app.v2.js'), 'utf8');
  for (const [id, img] of [['sp1', 'img/sp1.jpg'], ['sp2', 'img/sp2.png'], ['sp4', 'img/sp4.png'], ['sp6', 'img/sp6.jpg'], ['sp8', 'img/sp8.jpg'], ['tb1', 'img/tb1.jpg'], ['tb3', 'img/tb3.jpg'], ['tb6', 'img/tb6.png'], ['tb8', 'img/tb8.jpg'], ['cp1', 'img/cp1.jpg'], ['cp3', 'img/cp3.jpg'], ['cp6', 'img/cp6.jpg'], ['cp9', 'img/cp9.jpg'], ['aw3', 'img/aw3.jpg'], ['aw9', 'img/aw9.jpg'], ['aw10', 'img/aw10.jpg'], ['vr1', 'img/vr1.jpg'], ['vr2', 'img/vr2.jpg'], ['vr5', 'img/vr5.jpg'], ['ce7', 'img/ce7.jpg'], ['rb2', 'img/rb2.jpg'], ['rb4', 'img/rb4.jpg'], ['rb1', 'img/rb1.jpg'], ['rb8', 'img/rb8.jpg'], ['rb9', 'img/rb9.jpg'], ['sp11', 'img/sp11.png'], ['sp13', 'img/sp13.jpg'], ['sp15', 'img/sp15.jpg'], ['sp17', 'img/sp17.png'], ['sp18', 'img/sp18.jpg']]) {
    assert(kapp.includes(`{id:'${id}',images:['./${img}'`), `${id}: images[] absent`);
    const st = fs.statSync(path.join(ROOT, 'kifftech', img));
    assert(st.size > 5000, `${img}: fichier trop petit`);
  }
});
check('20 produits par rayon (smartphones)', () => {
  const kapp = fs.readFileSync(path.join(ROOT, 'kifftech/app.v2.js'), 'utf8');
  const n = (kapp.match(/category:'Smartphones'/g) || []).length;
  assert(n === 20, `smartphones: ${n} != 20`);
  const na = (kapp.match(/category:'Accessories'/g) || []).length;
  assert(na === 100, `accessories: ${na} != 100`);
});
check('tri catalogue + galerie multi-médias', () => {
  const kapp = fs.readFileSync(path.join(ROOT, 'kifftech/app.v2.js'), 'utf8');
  assert(kapp.includes('price-asc') && kapp.includes('price-desc'), 'tri prix absent');
  assert(kapp.includes("params.get('sort')"), '?sort absent');
  assert(kapp.includes('galleryVideos'), 'support vidéo absent');
  assert(kapp.includes('#modal-media video'), 'navigation vidéo absente');
  const kcat = fs.readFileSync(path.join(ROOT, 'kifftech/catalog.html'), 'utf8');
  assert(kcat.includes('id="sort-select"'), 'sélecteur tri absent');
});
check('bouton hard-refresh global + overlay', () => {
  const rjs = fs.readFileSync(path.join(ROOT, 'refresh.js'), 'utf8');
  assert(rjs.includes('caches.delete'), 'refresh.js: purge caches absente');
  assert(rjs.includes('window.location.reload()'), 'refresh.js: reload absent');
  assert(indexHtml.includes('refresh.js'), 'index.html: refresh.js non chargé');
  assert(/refresh=\$\{Date\.now\(\)\}/.test(appJs), 'overlay: cache-buster absent');
});

check('impact.com : connecteur sans secrets exposés', () => {
  const sync = fs.readFileSync(path.join(ROOT, 'scripts/sync-impact.js'), 'utf8');
  assert(sync.includes('https://api.impact.com'), 'base API officielle absente');
  assert(sync.includes('/${PERSONA}/') && sync.includes('/Catalogs'), 'endpoints catalogues absents');
  assert(sync.includes("'Mediapartners'") && sync.includes("'Advertisers'"), 'personas absents');
  assert(sync.includes('process.env.IMPACT_ACCOUNT_SID') && sync.includes('process.env.IMPACT_AUTH_TOKEN'), 'lecture via env absente');
  assert(sync.includes('[REDACTED]'), 'redaction logs absente');
  assert(sync.includes('le dernier catalogue valide est conservé'), 'garde-fou catalogue vide absent');
  assert(!/['"][A-Za-z0-9+/=]{24,}['"]/.test(sync.replace(/Basic /g, '')), 'secret potentiel en clair dans le script');
  const wf = fs.readFileSync(path.join(ROOT, '.github/workflows/sync-impact.yml'), 'utf8');
  assert(wf.includes('workflow_dispatch'), 'lancement manuel absent');
  assert(wf.includes('secrets.IMPACT_ACCOUNT_SID') && wf.includes('secrets.IMPACT_AUTH_TOKEN'), 'secrets non utilisés');
  const kapp = fs.readFileSync(path.join(ROOT, 'kifftech/app.v2.js'), 'utf8');
  assert(kapp.includes('loadPartnerProducts'), 'fusion partenaire absente');
  assert(kapp.includes('if(!p.partner)'), 'prix partenaires non protégés');
  const ray = fs.readFileSync(path.join(ROOT, 'kifftech/rayons.html'), 'utf8');
  assert(ray.includes('impact-products.json'), 'carte Partenaires absente des rayons');
});

if (failures > 0) {
  console.error(`\n${failures} test(s) en échec`);
  process.exit(1);
}
console.log('\nTous les tests réussis.');
