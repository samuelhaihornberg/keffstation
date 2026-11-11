/* KiffTech — Rayons : logique (extraite de rayons.html) */
(function () {
'use strict';
/* ==================== DATA RAYONS ==================== */
// Chaque rayon pointe vers une catégorie canonique du catalogue (app.v2.js).
// Clic = ouverture du lecteur de produits filtré sur ce rayon.
const RAYONS = [
  { id:'Accessoires & Gadgets', cat:'Accessories', icon:'🧰', color:'var(--kf-blue)', desc:'Chargeurs GaN, batteries, câbles, coques, claviers, souris, hubs, stockage.' },
  { id:'Smartphones', cat:'Smartphones', icon:'📱', color:'var(--kf-cyan)', desc:'Flagships, pliables, milieu de gamme — Samsung, Xiaomi, Apple, Google.' },
  { id:'Tablets', cat:'Tablets', icon:'📲', color:'var(--kf-pink)', desc:'Tablettes pro et famille — stylet, clavier, grand écran.' },
  { id:'Laptop, tour & mini PC', cat:'Computers', icon:'💻', color:'var(--kf-emerald)', desc:'Ultrabooks, PC de bureau, mini PC — Apple Silicon, Intel Core Ultra, Ryzen.' },
  { id:'Consoles & accessoires vidéo games', cat:'Consoles & Videogames', icon:'🎮', color:'var(--kf-orange)', desc:'Consoles rétro et modernes — PS5, Switch, Xbox, Steam Deck, accessoires.' },
  { id:'Immobilier & logement connecté', cat:'Smart Home', icon:'🏢', color:'var(--kf-violet)', desc:'Objets connectés du logement : maison intelligente, sécurité, énergie.' },
  { id:'Garden', cat:'Garden & furnitures smart devices', icon:'🪴', color:'var(--kf-emerald)', desc:'Jardin et maison connectés — robots tondeuses, éclairage, arrosage.' },
  { id:'Robots de compagnie & éducatifs', cat:'Company & studying Robots', icon:'🤖', color:'var(--kf-blue)', desc:'Robots compagnons et éducatifs — programmation, IA embarquée.' },
  { id:'Sport & électronique', cat:'Audio & Wearables', icon:'⌚', color:'var(--kf-pink)', desc:'Montres connectées, bracelets fitness, matériel sport électronique.' },
  { id:'Composants informatiques', cat:'Composant electronic & informatic', icon:'🔌', color:'var(--kf-cyan)', desc:'Composants informatique — cartes graphiques, CPU, SSD, cartes mères.' },
  { id:'Composants électroniques', cat:'Composant electronic', icon:'⚡', color:'var(--kf-orange)', desc:'Composants électroniques — résistances, condensateurs, modules, capteurs.' },
  { id:'Matière & outillage électronique', cat:'Materiel electronique & outillage', icon:'⚙️', color:'var(--kf-violet)', desc:'Pièces et matière pour électronique et/ou mécanique — soudure, boîtiers, outillage.' }
];

/* Nombre de produits par rayon (catalogue JSON versionné) */
const RAYON_COUNTS = {};
function chargerComptes(){
  return fetch('./data/catalogue.json', { cache:'no-cache' })
    .then(r => r.ok ? r.json() : null)
    .then(j => {
      const list = Array.isArray(j) ? j : (j && j.products) || [];
      list.forEach(p => {
        const c = p.category || 'Accessories';
        RAYON_COUNTS[c] = (RAYON_COUNTS[c] || 0) + 1;
      });
      return list;
    })
    .catch(() => []);
}

const rayonGrid = document.getElementById('rayonGrid');
// URL propre par rayon : page statique dediee (durable et partageable).
function slugRayon(cat){
  return String(cat || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/&/g, ' et ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}
function urlRayon(cat){ return './rayons/' + slugRayon(cat) + '/'; }

function rendreRayons(){
  rayonGrid.innerHTML = RAYONS.map((r,i) => `
  <a class="rayon-card" href="${urlRayon(r.cat)}" data-rayon="${i}" role="listitem" aria-label="Rayon ${r.id}">
    <div class="rayon-media">
      <span style="font-size:3.2rem">${r.icon}</span>
    </div>
    <div class="rayon-body">
      <div class="rayon-name">${r.id}</div>
      <div class="rayon-desc">${r.desc}</div>
    </div>
    <div class="rayon-footer">
      <span class="rayon-count">${RAYON_COUNTS[r.cat] != null ? RAYON_COUNTS[r.cat] + ' produits' : '25+ produits'}</span>
      <span class="rayon-arrow">▸</span>
    </div>
  </a>
`).join('');
}
rendreRayons();

rayonGrid.querySelectorAll('.rayon-card').forEach(el => {
  el.addEventListener('click',(e)=>{
    if (e.metaKey || e.ctrlKey || e.shiftKey) return; // laisse le nouvel onglet fonctionner
    e.preventDefault(); // empêche le suivi du lien <a> (double navigation qui fait clignoter)
    const i = +el.dataset.rayon;
    // Clic direct sur une carte rayon : ouvre la boutique avec ce rayon filtre
    window.location.href = '../../index.html?rayon=' + slugRayon(RAYONS[i].cat);
  });
});

/* Chargement du catalogue pour afficher le nombre de produits par rayon */
chargerComptes().then(() => { rendreRayons(); });

/* ==================== MODAL ==================== */
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalSub = document.getElementById('modalSub');
const modalMedia = document.getElementById('modalMedia');
const modalSpecs = document.getElementById('modalSpecs');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const modalAdd = document.getElementById('modalAdd');

let currentRayon = null;

function openModal(r){
  currentRayon = r;
  modalTitle.textContent = r.id;
  modalSub.textContent = r.desc;
  modalMedia.textContent = r.icon;
  modalSpecs.innerHTML = `
    <div class="spec-item"><span class="spec-label">Rayon</span><span class="spec-value">${r.id}</span></div>
    <div class="spec-item"><span class="spec-label">Produits</span><span class="spec-value">${RAYON_COUNTS[r.cat] != null ? RAYON_COUNTS[r.cat] : '25+'}</span></div>
    <div class="spec-item"><span class="spec-label">Statut</span><span class="spec-value">Disponible en file d’attente</span></div>
    <div class="spec-item"><span class="spec-label">Intermédiaire</span><span class="spec-value">KiffTech.store</span></div>
    <div class="spec-item"><span class="spec-label">Promotion</span><span class="spec-value">Multi-articles (−20 % +1 % / article)</span></div>
  `;
  modalAdd.setAttribute('href', urlRayon(r.cat));
  modalOverlay.classList.add('open');
  modalClose.focus();
}

function closeModal(){
  modalOverlay.classList.remove('open');
  currentRayon = null;
}

modalClose.addEventListener('click',closeModal);
modalCancel.addEventListener('click',closeModal);
modalOverlay.addEventListener('click',(e)=>{ if(e.target===modalOverlay) closeModal(); });
document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeModal(); });
modalAdd.addEventListener('click',()=>{
  if(!currentRayon) return;
  closeModal();
});

/* ==================== LA CAISSE (compteur réel) ==================== */
const cartBadge = document.getElementById('cartBadge');
const cartBtn = document.getElementById('cartBtn');
const CART_KEY = 'kifftech.cart.v1';

function majCompteurCaisse(){
  let n = 0;
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    n = saved.reduce((a,i)=>a + (Number(i && i.qty) || 1), 0);
  } catch(e){ n = 0; }
  if (cartBadge) cartBadge.textContent = n;
}
majCompteurCaisse();
window.addEventListener('storage', majCompteurCaisse);

function showToast(msg,type='success'){
  const t=document.getElementById('toast');
  t.querySelector('.t-emoji').textContent = type==='success'?'✅':'⚠️';
  t.querySelector('#toastMsg').textContent = msg;
  t.className = 'toast show '+type;
  setTimeout(()=>t.classList.remove('show'),2500);
}

function filterCart(n){
  showToast(`Promotion de caisse active dès ${n} article(s) sélectionné(s)`,'warn');
}

/* Compteur simple affiché dans les cartes rayon (démo) */
rayonGrid.querySelectorAll('.rayon-count').forEach(el=>{
  el.textContent = Math.floor(Math.random()*40)+5 + '+';
});
})();
