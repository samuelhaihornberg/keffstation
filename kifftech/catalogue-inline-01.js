
// Rayons miroirs des catégories du catalogue (catalog.html).
// Pour ajouter un catalogue : ajouter une entrée ici ET la catégorie dans kifftech/app.v2.js.
const CATALOGUES = [
  { id: 'Smartphones', icon: '📱', desc: 'Flagships, pliables, milieu de gamme — Samsung, Xiaomi, Apple, Google et plus.' },
  { id: 'Computers', icon: '💻', desc: 'Ultrabooks, pro, gaming — Apple Silicon, Intel Core Ultra, Ryzen + RTX.' },
  { id: 'Tablets', icon: '📲', desc: 'Tablettes pro et famille — stylet, clavier, grand écran.' },
  { id: 'Audio & Wearables', icon: '🎧', desc: 'Écouteurs ANC, casques, montres connectées, bracelets — Sony, Bose, Apple, Garmin.' },
  { id: 'VR AR gadgets', icon: '🥽', desc: 'Casques VR/AR, lunettes connectées, accessoires immersifs.' },
  { id: 'Drones & Caméras', icon: '🚁', desc: 'Drones, caméras d’action, stabilisateurs et hybrides — DJI, GoPro, Insta360, Sony, Canon.' },
  { id: 'Smart Home', icon: '🏠', desc: 'Enceintes connectées, hubs, éclairage et robots ménagers — Amazon, Google, Apple, Philips, Roborock.' },
  { id: 'Garden & furnitures smart devices', icon: '🪴', desc: 'Maison et jardin connectés — robots, éclairage, mobilier smart.' },
  { id: 'Composant electronic & informatic', icon: '🔌', desc: 'Cartes graphiques, CPU, SSD, cartes SBC — NVIDIA, AMD, Intel, Raspberry Pi, Arduino.' },
  { id: 'Company & studying Robots', icon: '🤖', desc: 'Robots compagnons et éducatifs — programmation, IA embarquée.' },
  { id: 'Accessories', icon: '🧰', desc: 'Chargeurs GaN, batteries, câbles, coques, claviers, souris, hubs, stockage.' },
  { id: 'Consoles & Videogames', icon: '🎮', desc: 'Consoles rétro (NES, Mega Drive, PS1…) et modernes (PS5, Switch, Xbox, Steam Deck Linux).' }
];
const COUNTS = {'Smartphones':47,'Computers':16,'Tablets':16,'Audio & Wearables':21,'VR AR gadgets':9,'Drones & Caméras':14,'Smart Home':6,'Garden & furnitures smart devices':0,'Composant electronic & informatic':11,'Company & studying Robots':5,'Accessories':8,'Consoles & Videogames':20}; // synchronisé avec LOCAL_DB (produits illustrés uniquement)
const VISIBLE = CATALOGUES.filter(r => (COUNTS[r.id] || 0) > 0);
const PL = n => n > 1 ? 'objets' : 'objet';
const NUM = i => String(i + 1).padStart(2, '0');

// Bandeau défilant : deux copies pour une boucle continue.
const marquee = document.getElementById('marquee-track');
if (marquee) {
  const words = VISIBLE.map(r => r.id).join(' ');
  marquee.innerHTML = `<span data-i18n="kifftech_words">${words}</span><span data-i18n="kifftech_words">${words}</span>`;
}

const grid = document.getElementById('catalogues-grid');
grid.innerHTML = VISIBLE.map((r, i) => `
  <a data-i18n="kifftech_numi_rid_rdesc_countsrid_0_" class="kf-catalogue" role="listitem" href="./catalog.html?catalogue=${encodeURIComponent(r.id)}" aria-label="Rayon ${r.id}, ${COUNTS[r.id] || 0} ${PL(COUNTS[r.id] || 0)}">
    <span data-i18n="kifftech_numi" class="kf-catalogue-num">${NUM(i)}</span>
    <span data-i18n="kifftech_rid" class="kf-catalogue-main">
      <span class="kf-catalogue-name">${r.id}</span>
      <span data-i18n="kifftech_rdesc" class="kf-catalogue-desc">${r.desc}</span>
    </span>
    <span data-i18n="kifftech_countsrid_0" class="kf-catalogue-count">${COUNTS[r.id] || 0}</span>
    <span class="kf-catalogue-cta" aria-hidden="true">↗</span>
  </a>`).join('') + `
  <a data-i18n="kifftech__tous_les_objets_le_catalogue_complet_to" class="kf-catalogue is-all" role="listitem" href="./catalog.html" aria-label="Tous les produits, 173 objets">
    <span class="kf-catalogue-num">+</span>
    <span data-i18n="kifftech_tous_les_objets" class="kf-catalogue-main">
      <span class="kf-catalogue-name">Tous les objets</span>
      <span data-i18n="kifftech_le_catalogue_complet_tous_catalogues_confond" class="kf-catalogue-desc">Le catalogue complet, tous catalogues confondus — derniers gadgets 2024-2026 inclus.</span>
    </span>
    <span data-i18n="kifftech_173" class="kf-catalogue-count">173</span>
    <span class="kf-catalogue-cta" aria-hidden="true">↗</span>
  </a>`;

fetch('./impact-products.json').then(r => r.ok ? r.json() : null).then(d => {
  const n = d && Array.isArray(d.products) ? d.products.length : 0;
  if (!n) return;
  const a = document.createElement('a');
  a.className = 'kf-catalogue is-partner';
  a.href = './catalog.html?catalogue=' + encodeURIComponent('Partenaires');
  a.setAttribute('aria-label', 'Rayon Partenaires, ' + n + ' produits');
  a.innerHTML = `<span class="kf-catalogue-num">★</span><span data-i18n="kifftech_partenaires" class="kf-catalogue-main"><span class="kf-catalogue-name">Partenaires</span><span data-i18n="kifftech_offres_des_marques_partenaires_via_impac" class="kf-catalogue-desc">Offres des marques partenaires via impact.com.</span></span><span data-i18n="kifftech_n" class="kf-catalogue-count">${n}</span><span class="kf-catalogue-cta" aria-hidden="true">↗</span>`;
  grid.appendChild(a);
}).catch(() => {});
