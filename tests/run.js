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

check('apps PWA avec URLs', () => {
  const urls = [...appJs.matchAll(/appUrl:\s*"([^"]+)"/g)].map((m) => m[1]);
  assert(urls.length === 6, `attendu 6 appUrl, trouvé ${urls.length}`);
  assert(urls.every((u) => u.startsWith('https://samuelhaihornberg.github.io/keffstation/')), 'URLs hors scope keffstation');
  for (const gone of ['num: "Moteurs linguistiques"', 'num: "Éditeur cos"']) {
    assert(!appJs.includes(gone), `face restante : ${gone}`);
  }
  for (const kept of [
    'num: "Kifftech"', 'num: "Tricktrocjob"', 'num: "ViArtificial labs"',
    'num: "Videogames"', 'num: "cos Editor"', 'num: "Linguistic Motors"'
  ]) {
    assert(appJs.includes(kept), `app absente : ${kept}`);
  }
  assert(appJs.includes('Moteurs linguistiques : NLP local'), 'articles NLP absents de ViArtificial');
  assert(appJs.includes('Éditeur cos : écrire la syntaxe'), 'articles cos absents de ViArtificial');
});

check('vitrine ronde : satellites répartis régulièrement', () => {
  const m = appJs.match(/function orbitPosition\(index, total, radius = 36\) \{([\s\S]*?)\n\}/);
  assert(m, 'orbitPosition introuvable');
  const orbitPosition = new Function('index', 'total', 'radius', m[1]);
  const near = (a, b) => Math.abs(a - b) < 1e-9;
  const p0 = orbitPosition(0, 4, 36);
  assert(near(p0.x, 50) && near(p0.y, 14), `index 0: ${p0.x},${p0.y}`);
  const p1 = orbitPosition(1, 4, 36);
  assert(near(p1.x, 86) && near(p1.y, 50), `index 1: ${p1.x},${p1.y}`);
  const p2 = orbitPosition(2, 4, 36);
  assert(near(p2.x, 50) && near(p2.y, 86), `index 2: ${p2.x},${p2.y}`);
  const p3 = orbitPosition(3, 4, 36);
  assert(near(p3.x, 14) && near(p3.y, 50), `index 3: ${p3.x},${p3.y}`);
  assert(near(orbitPosition(1, 6, 36).deg, -30), 'pas de 60° incorrect pour 6 apps');
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
  for (const id of ['vitrine', 'orbit', 'nav', 'loading', 'panel', 'embed-overlay', 'embed-iframe']) {
    assert(indexHtml.includes(`id="${id}"`), `#${id} manquant`);
  }
});

check('vitrine ronde : anneau, ondes et satellites', () => {
  const css = fs.readFileSync(path.join(ROOT, 'vitrine.css'), 'utf8');
  for (const token of ['.orbit', '.node-disc', '.wave', '.core', '@keyframes ripple', '@keyframes spin']) {
    assert(css.includes(token), `vitrine.css: ${token} absent`);
  }
  assert(indexHtml.includes('vitrine.css'), 'index.html ne charge pas vitrine.css');
  assert(!indexHtml.includes('cube-face'), 'anciennes faces de cube restantes');
  assert(appJs.includes('buildVitrine'), 'buildVitrine absent');
  assert(appJs.includes('orbitPosition'), 'orbitPosition absent');
});

check('KiffTech : page rayons + filtre ?rayon', () => {
  const rayons = fs.readFileSync(path.join(ROOT, 'kifftech/rayons.html'), 'utf8');
  assert(rayons.includes('catalog.html?rayon='), 'rayons.html: liens ?rayon absents');
  for (const c of ["'Smartphones'", "'Computers'", "'Tablets'", "'Audio & Wearables'", "'VR AR gadgets'", "'Drones & Caméras'", "'Smart Home'", "'Garden & furnitures smart devices'", "'Composant electronic & informatic'", "'Company & studying Robots'"]) {
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
check('catalogue filtré : uniquement produits illustrés', () => {
  const kapp = fs.readFileSync(path.join(ROOT, 'kifftech/app.v2.js'), 'utf8');
  const start = kapp.indexOf('const LOCAL_DB = [');
  const end = kapp.indexOf('\n];', start);
  const DB = new Function('return ' + kapp.slice(start + 'const LOCAL_DB = '.length, end + 2))();
  assert(DB.length === 156, `produits: ${DB.length} != 156`);
  assert(DB.every(p => p.images && p.images.length), 'produit sans image restant');
  for (const p of DB) {
    for (const img of p.images) {
      const rel = img.replace(/^\.\//, '');
      const st = fs.statSync(path.join(ROOT, 'kifftech', rel));
      assert(st.size > 5000, `${img}: fichier trop petit`);
    }
  }
  const kcat = fs.readFileSync(path.join(ROOT, 'kifftech/catalog.html'), 'utf8');
  assert(kcat.includes('156 produits illustrés'), 'meta description non mise à jour');
  const modern = DB.filter(p => p.year >= 2020 && p.year <= 2026).length;
  assert(modern >= 100, `gadgets 2020-2026: ${modern} < 100`);
  const cats = new Set(DB.map(p => p.category));
  assert(cats.has('Drones & Caméras') && cats.has('Smart Home'), 'nouveaux rayons absents de LOCAL_DB');
});
check('crédits : 1 ligne par image, aucune orpheline', () => {
  const files = fs.readdirSync(path.join(ROOT, 'kifftech/img')).filter(f => f !== 'CREDITS.txt');
  const creds = fs.readFileSync(path.join(ROOT, 'kifftech/img/CREDITS.txt'), 'utf8').trim().split('\n')
    .map(l => (l.match(/^- (\S+)/) || [])[1]).filter(Boolean);
  assert(files.length === creds.length, `${files.length} images / ${creds.length} crédits`);
  assert(new Set(creds).size === creds.length, 'crédits en double');
  for (const f of files) assert(creds.includes(f), `crédit manquant : ${f}`);
  const html = fs.readFileSync(path.join(ROOT, 'kifftech/credits.html'), 'utf8');
  assert(html.includes('Les ' + files.length + ' visuels'), 'credits.html non régénéré');
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
