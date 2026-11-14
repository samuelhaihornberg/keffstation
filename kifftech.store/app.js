/* ===== KiffTech — Catalogue (données vérifiées) ===== */
import { CATALOGUE } from './data/catalogue.js';
import { CONTACT } from './data/config.js';
import { resolveSelection, sellability, formatSellabilityReason, buildOrder } from './lib/payment-core.js';

// ---------- RAYONS (Catégories de produits) ----------
const RAYONS = [
  { id: 'jeux-video', label: 'Jeux vidéo', icon: '🎮', color: '#ff6b00', desc: 'Consoles, jeux et accessoires gaming' },
  { id: 'smartphones', label: 'Smartphones', icon: '📱', color: '#00d4ff', desc: 'Smartphones et accessoires' },
  { id: 'ordinateurs-composants', label: 'Ordinateurs et composants', icon: '💻', color: '#0066ff', desc: 'Ordinateurs, composants et périphériques' },
  { id: 'tablettes', label: 'Tablettes', icon: '📲', color: '#00ffc8', desc: 'Tablettes et accessoires' },
  { id: 'montres-wearables', label: 'Montres connectées et wearables', icon: '⌚', color: '#00ff88', desc: 'Montres connectées, bracelets et wearables' },
  { id: 'maison-securite', label: 'Maison connectée et sécurité', icon: '🏠', color: '#b84dff', desc: 'Maison connectée, sécurité et surveillance' },
  { id: 'smart-car', label: 'Smart car et mobilité connectée', icon: '🚗', color: '#ff6b00', desc: 'Smart car, mobilité et accessoires connectés' },
  { id: 'smart-tech', label: 'Smart tech', icon: '🤖', color: '#ffd23f', desc: 'Robots, drones, assistants, énergie et objets connectés' }
];

const RAYONS_MAP = Object.fromEntries(RAYONS.map(r => [r.id, r]));

// ---------- PRODUITS (données vérifiées : data/catalogue.js) ----------
const ANNEE_MIN = 2020;
const ANNEE_MAX = 2026;

function normalizeProduct(raw) {
  const prix = raw.prix || null;
  return {
    ...raw,
    title: `${raw.marque} ${raw.modele}`,
    brand: raw.marque,
    category: raw.rayon,
    price: prix ? prix.montant : null,
    currency: prix?.devise || 'EUR',
    images: (raw.medias?.images || []).map(m => m.fichier),
    isNew: raw.annee === 2026,
    incomplete: (raw.manquants || []).length > 0
  };
}

const DEMO_PRODUCTS = CATALOGUE.produits
  .filter(p => p.annee >= ANNEE_MIN && p.annee <= ANNEE_MAX && RAYONS_MAP[p.rayon])
  .map(normalizeProduct);

const FALLBACK_PRODUCTS = DEMO_PRODUCTS;

// ---------- UTILITIES ----------
function sanitizeHTML(str){return String(str ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function formatPrice(val,devise='EUR'){
  if(typeof val!=='number'||!Number.isFinite(val)) return 'Information à confirmer';
  devise = devise || 'EUR';
  try{
    return new Intl.NumberFormat('fr-FR',{style:'currency',currency:devise,minimumFractionDigits:2,maximumFractionDigits:2}).format(val);
  }catch(e){
    return val.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' '+devise;
  }
}
function debounce(fn,ms){let t;return(...args)=>{clearTimeout(t);t=setTimeout(()=>fn(...args),ms);};}
function whatsappHTML(){
  const label = 'Contacter via WhatsApp Business';
  return CONTACT.whatsappLienUrl
    ? `<a class="btn-secondary btn-whatsapp" href="${sanitizeHTML(CONTACT.whatsappLienUrl)}" target="_blank" rel="noopener">${label}</a>`
    : `<button type="button" class="btn-secondary btn-whatsapp" disabled>${label}</button>
        <p class="wa-note">Numéro professionnel : <strong>${sanitizeHTML(CONTACT.whatsappBusiness)}</strong></p>`;
}

// ---------- STATE ----------
const STORE_KEYS = { cart: 'kifftech-cart-v1', subscription: 'kifftech-subscription-v1' };

function readJSON(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch (e) {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* stockage indisponible : l'état reste en mémoire */
  }
}

const state = {
  products: DEMO_PRODUCTS,
  productsMap: new Map(),
  filteredProducts: [],
  currentRayon: null,
  currentCategory: '',
  currentSupplier: '',
  currentSearch: '',
  visibleCount: 24,
  currentProduct: null,
  currentTab: 'catalog',
  subscription: readJSON(STORE_KEYS.subscription, null),
  sortBy: 'featured',
  importSources: [],
  schedules: [],
  mappings: {globalDiscount:10,targetMargin:35,autoPriceUpdate:true,verifyRefPrice:true},
  cart: readJSON(STORE_KEYS.cart, [])
    .filter(i => i && i.productId && i.quantity > 0 && DEMO_PRODUCTS.some(p => p.id === i.productId))
    .map(i => ({ productId: i.productId, variant: i.variant || '', prix: i.prix ?? null, devise: i.devise || 'EUR', quantity: i.quantity })),
  variantChoice: {},
  imageIndex: 0,
  toastQueue: [],
};

// ---------- PANIER (persistant) ----------
const cartManager = {
  getItems() {
    return state.cart;
  },
  save() {
    writeJSON(STORE_KEYS.cart, state.cart);
    window.dispatchEvent(new Event('cart:change'));
  },
  add(productId, choiceIndices = [], qty = 1) {
    const key = JSON.stringify(Array.isArray(choiceIndices) ? choiceIndices : []);
    const item = state.cart.find(i => i.productId === productId && JSON.stringify(i.choiceIndices || []) === key);
    if (item) item.quantity = Math.min(item.quantity + qty, 99);
    else state.cart.push({ productId, choiceIndices: Array.isArray(choiceIndices) ? choiceIndices : [], quantity: qty });
    this.save();
  },
  updateQuantity(index, quantity) {
    if (quantity <= 0) return this.remove(index);
    const item = state.cart[index];
    if (item) {
      item.quantity = Math.min(quantity, 99);
      this.save();
    }
  },
  remove(index) {
    state.cart.splice(index, 1);
    this.save();
  },
  calculateTotals(productsMap) {
    let totalItems = 0, uniqueItems = 0;
    const parDevise = new Map();
    for (const item of state.cart) {
      const p = productsMap.get(item.productId);
      if (!p) continue;
      const sel = resolveSelection(p, item.choiceIndices || []);
      const devise = sel.devise || 'EUR';
      totalItems += item.quantity;
      uniqueItems += 1;
      const unit = (sel.prix != null ? sel.prix : 0);
      const montant = unit * item.quantity;
      parDevise.set(devise, Math.round(((parDevise.get(devise) || 0) + montant) * 100) / 100);
    }
    const devises = [...parDevise.keys()];
    const deviseUnique = devises.length === 1 ? devises[0] : null;
    const subtotal = deviseUnique ? parDevise.get(deviseUnique) : null;
    return {
      totalItems, uniqueItems, devises,
      devise: deviseUnique,
      parDevise: Object.fromEntries(parDevise),
      mixedCurrencies: devises.length > 1,
      subtotal, shipping: null, finalTotal: subtotal, details: []
    };
  }
};

// ---------- SOURCES DE CATALOGUE ----------
// Aucune source externe connectée : le catalogue local est utilisé.
function getCachedProducts() { return null; }
function setCachedProducts() {}
const productAgent = {
  async syncAllProducts() {
    throw new Error('aucune source de catalogue externe connectée');
  }
};

// ---------- MAIN CLASS ----------
class KiffTech{
  constructor(){
    this.tabs = ['catalog', 'subscriptions', 'bilan', 'import', 'settings'];
    this.tabLabels = {catalog:'Catalogue', subscriptions:'Abonnements', bilan:'Bilan', import:'Import', settings:'Réglages'};
    this.tabIcons = {
      catalog:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/><line x1="4" y1="6" x2="4" y2="18"/><line x1="20" y1="6" x2="20" y2="18"/></svg>'
    };

    this.productsGrid = document.getElementById('productsGrid');
    this.loadMore = document.getElementById('loadMore');
    this.categoryFilter = document.getElementById('categoryFilter');
    this.supplierFilter = document.getElementById('supplierFilter');
    this.searchInput = document.getElementById('searchInput');
    this.productDetail = document.getElementById('productDetail');
    this.cartCount = document.getElementById('cartCount');
    this.modal = document.getElementById('productModal');
    this.modalBody = document.getElementById('modalBody');
    this.toastContainer = document.getElementById('toastContainer');
    this.splashBar = document.getElementById('splashBar');
    this.splashText = document.getElementById('splashText');
    this.mainTabs = document.getElementById('mainTabs');
    this.bottomTabs = document.getElementById('bottomTabs');
    this.addSourceBtn = document.getElementById('addSourceBtn');
    this.addScheduleBtn = document.getElementById('addScheduleBtn');
    this.exportCSV = document.getElementById('exportCSV');
    this.exportJSON = document.getElementById('exportJSON');
    this.importCSV = document.getElementById('importCSV');
    this.csvImportInput = document.getElementById('csvImportInput');
    this.noveltiesSection = document.getElementById('noveltiesSection');
    this.noveltiesGrid = document.getElementById('noveltiesGrid');

    this.currentRayon = null;
    this.currentRayonProducts = [];
    this.rayonSort = 'featured';
    this.rayonBrandFilter = '';

    this.init();
  }

  init(){
    this.setProgress(10,'Initialisation…');
    this.buildTabs();
    this.bindEvents();
    this.populateFilters();
    this.applyFilters();
    this.initBioParticles();
    this.registerSW();
    this.setupInstallPrompt();
    this.bindCartEvents();

    this.loadProducts();

    if(document.readyState==='complete') this.onLoaded();
    else window.addEventListener('load',()=>this.onLoaded());
  }

  addToCart(productId) {
    const p = state.productsMap.get(productId) || state.products.find(x => x.id === productId);
    if (!p) return;
    const choice = this.currentChoice(p);
    const sel = resolveSelection(p, choice);
    if (sel.prix === null) {
      this.showToast('Prix public officiel à confirmer : ajout impossible', 'error');
      return;
    }
    if (!sel.disponible) {
      this.showToast('Variante non disponible : ajout impossible', 'error');
      return;
    }
    cartManager.add(productId, choice, 1);
    this.showToast(`${p.title} ajouté à la caisse`);
  }

  currentChoice(p) {
    const choice = state.variantChoice[p.id];
    if (Array.isArray(choice)) return choice.slice();
    return (p.variantes || []).map(() => 0);
  }

  selectedVariant(p) {
    const choice = this.currentChoice(p);
    const labels = [];
    let prix = p.price;
    let disponible = true;
    let lien = null;
    let lienManquant = false;
    let lienDefini = false;
    (p.variantes || []).forEach((groupe, g) => {
      const option = (groupe.options || [])[choice[g] ?? 0];
      if (!option) return;
      labels.push(option.libelle);
      if (option.prix != null) prix = option.prix;
      if (option.dispo === false) disponible = false;
      if ('lienOfficiel' in option) {
        lienDefini = true;
        if (option.lienOfficiel === null) lienManquant = true;
        else if (option.lienOfficiel && option.lienOfficiel.url && !lien) lien = option.lienOfficiel;
      }
    });
    const lienOfficiel = lienManquant ? null : lien;
    return { label: labels.join(' · '), prix, disponible, lienOfficiel, lienManquant, lienDefini, choiceIndices: choice };
  }

  exportCatalog(format) {
    const products = state.products || [];
    let content;
    let type;
    let name;
    if (format === 'json') {
      content = JSON.stringify(products, null, 2);
      type = 'application/json';
      name = 'kifftech-catalogue.json';
    } else {
      const cols = ['id', 'title', 'brand', 'category', 'annee', 'price', 'reference'];
      const cell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
      content = [cols.join(';'), ...products.map(p => cols.map(c => cell(p[c])).join(';'))].join('\n');
      type = 'text/csv;charset=utf-8';
      name = 'kifftech-catalogue.csv';
    }
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    this.showToast(`Catalogue exporté (${products.length} produits)`);
  }

  handleCSVImport(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const lines = String(reader.result || '').split(/\r?\n/).filter(l => l.trim());
      const rows = Math.max(0, lines.length - 1);
      this.showToast(`${rows} ligne(s) lue(s) — rien n'a été ajouté au catalogue`, rows ? 'success' : 'error');
    };
    reader.onerror = () => this.showToast('Lecture du fichier impossible', 'error');
    reader.readAsText(file);
    e.target.value = '';
  }

  subscribe(tier) {
    const names = { basic: 'KiffTech Basic', tresor: 'KiffTech Trésor' };
    if (!names[tier]) return;
    state.subscription = { tier, since: new Date().toISOString() };
    writeJSON(STORE_KEYS.subscription, state.subscription);
    this.renderSubscription();
    this.showToast(`${names[tier]} activé (aucun paiement)`);
  }

  cancelSubscription() {
    state.subscription = null;
    writeJSON(STORE_KEYS.subscription, null);
    this.renderSubscription();
    this.showToast('Abonnement annulé');
  }

  renderSubscription() {
    const label = document.getElementById('currentSub');
    const actions = document.getElementById('subActions');
    if (!label || !actions) return;
    if (!state.subscription) {
      label.textContent = 'Aucun abonnement actif';
      actions.innerHTML = '';
      return;
    }
    const name = state.subscription.tier === 'tresor' ? 'KiffTech Trésor' : 'KiffTech Basic';
    label.textContent = `${name} — actif`;
    actions.innerHTML = '<button type="button" class="btn-secondary" id="cancelSubBtn">Annuler l’abonnement</button>';
    document.getElementById('cancelSubBtn').addEventListener('click', () => this.cancelSubscription());
  }

  async loadProducts() {
    this.setProgress(30, 'Chargement catalogue…');
    
    const cached = getCachedProducts();
    if (cached) {
      state.products = cached;
      this.buildProductsMap();
      this.setProgress(80, 'Catalogue chargé (cache)');
      this.applyFilters();
      return;
    }

    this.setProgress(50, 'Synchronisation…');
    try {
      const products = await productAgent.syncAllProducts();
      state.products = products;
      this.buildProductsMap();
      setCachedProducts(products);
      this.setProgress(80, 'Catalogue synchronisé');
      this.applyFilters();
    } catch (err) {
      console.warn('[KiffTech] Erreur sync, fallback:', err.message);
      state.products = FALLBACK_PRODUCTS;
      this.buildProductsMap();
      this.applyFilters();
    }
    
    this.setProgress(100, 'Prêt');
  }

  buildProductsMap() {
    state.productsMap = new Map();
    state.products.forEach(p => state.productsMap.set(p.id, p));
  }

  onLoaded(){
    this.animateProgress(100,'Prêt',()=>{this.hideSplash();});
  }

  setProgress(pct,text){this.splashBar.style.width=pct+'%';this.splashText.textContent=text;}
  animateProgress(target,text,cb){let cur=parseInt(this.splashBar.style.width)||0;const step=()=>{if(cur<target){cur=Math.min(target,cur+3);this.setProgress(cur,text);requestAnimationFrame(()=>setTimeout(step,20));}else if(cb)cb();};step();}
  hideSplash(){document.getElementById('splash').classList.add('hidden');}

  buildTabs(){
    const tabsHTML=this.tabs.map((t,i)=>`<button class="main-tab" role="tab" aria-selected="${i===0}" data-tab="${t}">${this.tabLabels[t]}</button>`).join('');
    this.mainTabs.innerHTML=tabsHTML;
    this.bottomTabs.innerHTML=tabsHTML;
    [this.mainTabs,this.bottomTabs].forEach(nav=>nav.querySelectorAll('.main-tab').forEach(btn=>btn.addEventListener('click',()=>this.switchTab(btn.dataset.tab))));
    this.switchTab(this.tabs[0]);
  }

  switchTab(tab){
    state.currentTab=tab;
    if(tab==='cart') this.renderCartPanel();
    document.querySelectorAll('.panel').forEach(p=>p.hidden=true);
    document.getElementById(`panel-${tab}`).hidden=false;
    document.querySelectorAll('[role="tab"]').forEach(btn=>{btn.setAttribute('aria-selected',btn.dataset.tab===tab);});
  }

  populateFilters(){
    this.categoryFilter.innerHTML = '<option value="">Tous les rayons</option>' + RAYONS.map(r=>`<option value="${r.id}">${r.label}</option>`).join('');
    this.supplierFilter.innerHTML = '<option value="">Tous fournisseurs</option>';
  }

  applyFilters=debounce(()=>{
    state.currentCategory=this.categoryFilter.value;
    state.currentSupplier=this.supplierFilter.value;
    state.currentSearch=(this.searchInput?.value || '').toLowerCase();
    state.visibleCount=24;

    let baseProducts = state.products;
    
    if(this.currentRayon){
      baseProducts = baseProducts.filter(p => p.category === this.currentRayon);
    } else if(state.currentCategory){
      baseProducts = baseProducts.filter(p => p.category === state.currentCategory);
    }
    
    if(this.rayonBrandFilter) baseProducts = baseProducts.filter(p => p.brand === this.rayonBrandFilter);
    if(state.currentSupplier) baseProducts = baseProducts.filter(p => p.supplierName === state.currentSupplier);
    if(state.currentSearch) baseProducts = baseProducts.filter(p => p.title.toLowerCase().includes(state.currentSearch) || p.description.toLowerCase().includes(state.currentSearch) || p.brand.toLowerCase().includes(state.currentSearch));

    state.filteredProducts = baseProducts;
    
    if(this.currentRayon){
      this.currentRayonProducts = baseProducts;
      this.sortRayonProducts();
      baseProducts = this.currentRayonProducts;
    }
    
    state.visibleCount = 24;
    this.renderProducts();
  },150);

  renderProducts(){
    const grid = this.productsGrid;
    
    if(this.currentRayon){
      const toShow = this.currentRayonProducts.slice(0, state.visibleCount);
      grid.innerHTML = toShow.map(p => this.catalogProductHTML(p)).join('');
      this.renderNovelties([]);
    } else {
      grid.innerHTML = RAYONS.map(r => this.rayonCardHTML(r)).join('');
      this.bindRayonCards();
      this.renderNovelties(state.products.filter(p => p.isNew));
    }
    
    this.loadMore.hidden = state.visibleCount >= state.filteredProducts.length;

    this.bindProductCards(grid);
  }

  bindProductCards(container){
    container.querySelectorAll('.catalog-product').forEach(card=>{
      card.addEventListener('click',(e)=>{
        if(e.target.closest('a[data-action="manufacturer"], a[href]')) return;
        if(e.target.closest('[data-action="add"]')){
          e.preventDefault();
          e.stopPropagation();
          this.addToCart(card.dataset.id);
          return;
        }
        if(e.target.closest('[data-action="detail"]')){
          e.preventDefault();
        }
        this.openProduct(card.dataset.id);
      });
    });
  }

  renderNovelties(list){
    if(!this.noveltiesSection || !this.noveltiesGrid) return;
    this.noveltiesSection.hidden = list.length === 0;
    this.noveltiesGrid.innerHTML = list.map(p => this.noveltyCardHTML(p)).join('');
    this.bindProductCards(this.noveltiesGrid);
  }

  noveltyCardHTML(p){
    const names = (p.accessoires || []).map(a => a.nom);
    const access = names.length
      ? `<div class="novelty-access"><span class="novelty-access-label">Accessoires compatibles</span><span>${names.map(sanitizeHTML).join(' · ')}</span></div>`
      : `<div class="novelty-access"><span class="novelty-access-label">Accessoires compatibles</span><span>Information à confirmer</span></div>`;
    return this.catalogProductHTML(p, access);
  }

  rayonCardHTML(r){
    const count = state.products.filter(p => p.category === r.id).length;
    const hasProducts = count > 0;
    return `
      <article class="rayon-card" data-rayon="${r.id}" style="--rayon-color:${r.color};" ${!hasProducts ? 'data-empty="true"' : ''}>
        <div class="rayon-icon" style="background:${r.color}20;color:${r.color};">${r.icon}</div>
        <h3 class="rayon-label">${r.label}</h3>
        <p class="rayon-desc">${r.desc}</p>
        <div class="rayon-meta">
          <span class="rayon-count">${count} produit${count>1?'s':''}</span>
          ${!hasProducts ? '<span class="rayon-empty">Bientôt disponible</span>' : ''}
        </div>
        <button class="rayon-btn" type="button" aria-label="Voir ${r.label}">Explorer le rayon</button>
      </article>
    `;
  }

  bindRayonCards(){
    this.productsGrid.querySelectorAll('.rayon-card').forEach(card=>{
      card.addEventListener('click',()=>this.openRayon(card.dataset.rayon));
    });
  }

  openRayon(rayonId){
    this.currentRayon = rayonId;
    this.currentRayonProducts = state.products.filter(p => p.category === rayonId);
    this.applyFilters();
    this.showRayonHeader(rayonId);
  }

  showRayonHeader(rayonId){
    const rayon = RAYONS_MAP[rayonId];
    if(!rayon) return;
    this.searchInput = null;
    
    const header = this.productsGrid.parentElement.querySelector('.panel-header');
    if(header){
      header.innerHTML = `
        <div class="rayon-header" style="--rayon-color:${rayon.color};">
          <button class="btn-back" onclick="window.keffTech.closeRayon()" aria-label="Retour au catalogue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span>CATALOGUES</span>
          </button>
          <div class="rayon-header-info">
            <span class="rayon-header-icon" style="background:${rayon.color}20;color:${rayon.color};">${rayon.icon}</span>
            <div>
              <h2>${rayon.label}</h2>
              <p>${rayon.desc}</p>
            </div>
          </div>
          <div class="rayon-header-actions">
            <select id="rayonSort" onchange="window.keffTech.setRayonSort(this.value)" style="padding:.4rem .75rem;font-size:.75rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--fg);min-width:140px;">
              <option value="featured">Sélection</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="newest">Nouveautés</option>
            </select>
            <select id="rayonBrandFilter" onchange="window.keffTech.setRayonBrandFilter(this.value)" style="padding:.4rem .75rem;font-size:.75rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--fg);min-width:140px;">
              <option value="">Toutes marques</option>
              ${[...new Set(state.products.filter(p => p.category === this.currentRayon).map(p => p.brand))].sort().map(b=>`<option value="${sanitizeHTML(b)}">${sanitizeHTML(b)}</option>`).join('')}
            </select>
          </div>
        `;
    }
  }

  closeRayon(){
    this.currentRayon = null;
    this.currentRayonProducts = [];
    this.applyFilters();
    const header = this.productsGrid.parentElement.querySelector('.panel-header');
    if(header){
      header.innerHTML = `
        <h2>CATALOGUES</h2>
        <div class="filter-bar">
          <input type="search" id="searchInput" placeholder="Rechercher produits..." aria-label="Recherche">
        </div>
      `;
      this.searchInput = document.getElementById('searchInput');
      this.searchInput.addEventListener('input',this.applyFilters);
      this.populateFilters();
      this.renderProducts();
    }
  }

  setRayonSort(value){
    this.rayonSort = value;
    this.sortRayonProducts();
    this.renderProducts();
  }

  setRayonBrandFilter(value){
    this.rayonBrandFilter = value;
    this.applyFilters();
  }

  sortRayonProducts(){
    if(!this.currentRayon) return;
    switch(this.rayonSort){
      case 'price-asc': this.currentRayonProducts.sort((a,b)=>(a.price ?? Number.MAX_SAFE_INTEGER)-(b.price ?? Number.MAX_SAFE_INTEGER)); break;
      case 'price-desc': this.currentRayonProducts.sort((a,b)=>(b.price ?? -1)-(a.price ?? -1)); break;
      case 'newest': this.currentRayonProducts.sort((a,b)=>(b.annee-a.annee)||String(b.dateSortie||'').localeCompare(String(a.dateSortie||''))); break;
      default: break;
    }
  }

  applyFilters=debounce(()=>{
    state.currentCategory=this.categoryFilter.value;
    state.currentSupplier=this.supplierFilter.value;
    state.currentSearch=(this.searchInput?.value || '').toLowerCase();
    state.visibleCount=24;

    let baseProducts = state.products;
    
    if(this.currentRayon){
      baseProducts = baseProducts.filter(p => p.category === this.currentRayon);
    } else if(state.currentCategory){
      baseProducts = baseProducts.filter(p => p.category === state.currentCategory);
    }
    
    if(this.rayonBrandFilter) baseProducts = baseProducts.filter(p => p.brand === this.rayonBrandFilter);
    if(state.currentSupplier) baseProducts = baseProducts.filter(p => p.supplierName === state.currentSupplier);
    if(state.currentSearch) baseProducts = baseProducts.filter(p => p.title.toLowerCase().includes(state.currentSearch) || p.description.toLowerCase().includes(state.currentSearch) || p.brand.toLowerCase().includes(state.currentSearch));

    state.filteredProducts = baseProducts;
    
    if(this.currentRayon){
      this.currentRayonProducts = baseProducts;
      this.sortRayonProducts();
      baseProducts = this.currentRayonProducts;
    }
    
    state.visibleCount = 24;
    this.renderProducts();
  },150);

  catalogProductHTML(p, extra = ''){
    const color = RAYONS_MAP[p.category]?.color || '#00ffc8';
    const brandColor = this.getBrandColor(p.brand);
    const img = p.images[0];
    const etat = this.getEtatCatalogue(p);
    const promo = this.getPromoKiffTech(p);
    const prixHTML = promo && promo.prixPromotionnel != null
      ? `<span class="product-price"><s>${formatPrice(promo.prixOfficiel, promo.devise)}</s> ${formatPrice(promo.prixPromotionnel, promo.devise)}</span>
         <span class="product-price-note">Prix officiel vérifié · Promo KiffTech −${promo.pourcentage}%</span>`
      : `<span class="product-price">${p.price !== null ? formatPrice(p.price, p.currency) : 'Prix officiel à vérifier'}</span>
         <span class="product-price-note">${p.price !== null ? 'Prix public officiel (devise du fabricant)' : 'Prix promotionnel indisponible (prix officiel non vérifié)'}</span>`;
    return `
      <article class="catalog-product" data-id="${sanitizeHTML(p.id)}" style="--rayon-color:${color};">
        <div class="product-thumb${img ? '' : ' product-thumb--empty'}"${img ? ` style="background-image:url('${sanitizeHTML(img)}')"` : ''} aria-hidden="true">
          ${p.isNew ? '<span class="product-badge badge-new">Nouveauté 2026</span>' : ''}
          ${etat.achetable ? '<span class="product-badge badge-buyable">Achetable maintenant</span>' : '<span class="product-badge badge-present">Présent au catalogue</span>'}
          ${p.incomplete ? '<span class="product-badge badge-info">Fiche incomplète</span>' : ''}
          ${img ? '' : '<span class="thumb-missing">Image à confirmer</span>'}
        </div>
        <div class="product-info">
          <div class="product-meta">
            <span class="product-brand" style="background:${brandColor}20;color:${brandColor};border-color:${brandColor}40;">${sanitizeHTML(p.brand)}</span>
            <span class="product-category">${sanitizeHTML(RAYONS_MAP[p.category]?.label || p.category)}</span>
            <span class="product-year">${p.annee}</span>
          </div>
          <h3 class="product-title">${sanitizeHTML(p.title)}</h3>
          <div class="product-price-row">${prixHTML}</div>
          ${extra}
          <div class="product-actions">
            ${p.ficheFabricant ? `<a href="${sanitizeHTML(p.ficheFabricant)}" target="_blank" rel="noopener" class="btn-catalog" data-action="manufacturer">Fiche fabricant</a>` : ''}
            <button type="button" class="btn-catalog secondary" data-action="detail">Afficher détails</button>
            <button type="button" class="btn-catalog" data-action="add">Ajouter à la caisse</button>
          </div>
        </div>
      </article>`;
  }

  getBrandColor(brand){
    const colors = {
      'Samsung': '#0066ff', 'Xiaomi': '#ff6b00', 'Apple': '#888', 'Google': '#4285f4',
      'Sony': '#0066ff', 'Bose': '#b84dff', 'Sennheiser': '#0066ff', 'JBL': '#ff6b00',
      'Anker': '#00d4ff', 'Nothing': '#888', 'Sennheiser': '#0066ff', 'Jabra': '#00ffc8',
      'Garmin': '#00ff88', 'Garmin': '#00ff88', 'Amazfit': '#ff6b00', 'Huawei': '#ff2d95',
      'Philips Hue': '#00d4ff', 'Aqara': '#00ff88', 'Sonoff': '#ff6b00', 'Shelly': '#b84dff',
      'TP-Link': '#0066ff', 'Meross': '#00d4ff', 'IKEA': '#0066ff',
      'Arlo': '#00d4ff', 'Ring': '#ff6b00', 'Eufy': '#00ff88', 'Reolink': '#b84dff',
      'Logitech': '#0066ff', 'Razer': '#00ff88', 'SteelSeries': '#ff6b00', 'Corsair': '#ffd23f',
      'iRobot': '#00d4ff', 'Roborock': '#00ff88', 'Ecovacs': '#ff6b00', 'Dreame': '#b84dff',
      'DJI': '#0066ff', 'Autel': '#b84dff', 'BetaFPV': '#ff6b00',
      'Keychron': '#00d4ff', 'Razer': '#00ff88', 'CalDigit': '#0066ff', 'Satechi': '#00d4ff',
      'Anker': '#00d4ff', 'Baseus': '#ff6b00', 'UGREEN': '#00ff88', 'EcoFlow': '#0066ff',
      'Jackery': '#ff6b00', 'Bluetti': '#ffd23f', 'Nitecore': '#b84dff',
      '70mai': '#00d4ff', 'Nextbase': '#0066ff', 'Vantrue': '#ff6b00',
      'Meta': '#0066ff', 'Apple': '#888', 'Pico': '#ff6b00', 'XREAL': '#00d4ff'
    };
    return colors[brand] || '#00ffc8';
  }

  loadMoreProducts(){
    state.visibleCount += 24;
    this.renderProducts();
  }

  openProduct(id){
    state.currentProduct = state.products.find(p => p.id === id);
    if(state.currentProduct){
      state.imageIndex = 0;
      this.renderProductDetail();
      this.switchTab('product');
      this.productDetail.scrollTop = 0;
    }
  }

  formatDate(iso){
    if(!iso) return 'date à confirmer';
    return new Date(`${iso}T00:00:00`).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});
  }

  sourceLink(url){
    return url ? `<a href="${sanitizeHTML(url)}" target="_blank" rel="noopener">source</a>` : '';
  }

  getEtatCatalogue(p){
    const sell = sellability(p, resolveSelection(p, this.currentChoice ? this.currentChoice(p) : []));
    return {
      present: true,
      achetable: !!sell.ok,
      raisons: sell.reasons || []
    };
  }

  getPromoKiffTech(p){
    const promo = p && p.promotionKiffTech;
    if(!promo) return null;
    const off = Number(promo.prixOfficielVerifie);
    const pct = Number(promo.pourcentageReduction);
    const pp = Number(promo.prixPromotionnel);
    if(!Number.isFinite(off) || !Number.isFinite(pct) || !Number.isFinite(pp)) return null;
    if(pct < 10 || pct > 25) return null;
    return {
      prixOfficiel: off,
      pourcentage: pct,
      prixPromotionnel: pp,
      devise: promo.devise || (p.prix && p.prix.devise) || p.currency || 'EUR',
      source: promo.source,
      dateVerification: promo.dateVerification
    };
  }

  renderProductDetail(){
    if(!state.currentProduct){this.productDetail.innerHTML='<p class="empty">Aucun produit sélectionné</p>';return;}
    const p = state.currentProduct;
    const rayon = RAYONS_MAP[p.category];
    const color = rayon?.color || '#00ffc8';
    const brandColor = this.getBrandColor(p.brand);
    const etat = this.getEtatCatalogue(p);

    this.productDetail.innerHTML = `
      <div class="detail-header" style="--rayon-color:${color};">
        <div class="detail-gallery">${this.galleryHTML(p)}</div>
        <div class="detail-meta">
          <div class="detail-badges">
            <span class="detail-brand" style="background:${brandColor}20;color:${brandColor};border-color:${brandColor}40;">${sanitizeHTML(p.brand)}</span>
            <span class="detail-category">${sanitizeHTML(rayon?.label || p.category)}</span>
            <span class="product-badge ${etat.achetable ? 'badge-buyable' : 'badge-present'}">${etat.achetable ? 'Achetable maintenant' : 'Présent au catalogue'}</span>
            ${p.isNew ? '<span class="product-badge badge-new">Nouveauté 2026</span>' : ''}
            ${p.incomplete ? '<span class="product-badge badge-info">Fiche incomplète</span>' : ''}
          </div>
          <h2 class="detail-title">${sanitizeHTML(p.title)}</h2>
          <div class="detail-ref">Modèle : ${sanitizeHTML(p.reference || 'Information à confirmer')}</div>
          <div class="detail-ref">Sortie officielle : ${sanitizeHTML(p.dateSortie ? this.formatDate(p.dateSortie) : String(p.annee))}</div>
          <div class="etat-catalogue ${etat.achetable ? 'is-buyable' : 'is-present'}">
            <strong>${etat.achetable ? 'Achetable maintenant' : 'Présent au catalogue'}</strong>
            <p>${etat.achetable ? 'Prix final, variante, disponibilité, livraison et taxes confirmés.' : 'Fiche réelle consultable. Achat impossible tant que prix final, variante, disponibilité, livraison et taxes ne sont pas confirmés.'}${!etat.achetable && etat.raisons.length ? ' ' + sanitizeHTML(etat.raisons.join(', ')) + '.' : ''}</p>
          </div>
        </div>
      </div>
      <p class="detail-desc">${sanitizeHTML(p.description)}</p>
      <div id="variantBox">${this.variantBoxHTML(p)}</div>
      <section class="detail-block">
        <h4>Caractéristiques</h4>
        ${this.specsTableHTML(p)}
      </section>
      <section class="detail-block">
        <h4>Bundles et accessoires compatibles</h4>
        ${this.bundlesHTML(p)}
      </section>
      <section class="detail-block">
        <h4>Situations d’utilisation</h4>
        ${this.usagesHTML(p)}
      </section>
      ${this.articleHTML(p)}
      <section class="detail-block">
        <h4>Prix et disponibilité</h4>
        ${this.priceBlockHTML(p)}
      </section>
      <section class="detail-block">
        <h4>Médias</h4>
        ${this.mediaHTML(p)}
      </section>
      <section class="detail-block">
        <h4>Sources et informations manquantes</h4>
        ${this.sourcesHTML(p)}
      </section>`;
  }

  galleryHTML(p){
    if(!p.images.length){
      return '<div class="main-image main-image--empty" role="img" aria-label="Image à confirmer">Image à confirmer</div>';
    }
    const i = Math.min(state.imageIndex, p.images.length - 1);
    const media = p.medias.images[i];
    return `
      <img class="main-image" src="${sanitizeHTML(media.fichier)}" alt="${sanitizeHTML(media.alt)}" loading="lazy">
      <div class="thumbnails">${p.medias.images.map((m, k) => `<button type="button" class="thumb-btn${k === i ? ' is-active' : ''}" data-image-index="${k}" aria-label="Image ${k + 1}"><img src="${sanitizeHTML(m.fichier)}" alt="" loading="lazy"></button>`).join('')}</div>
      <p class="media-credit">${sanitizeHTML(media.auteur)} · ${sanitizeHTML(media.licence)} · ${this.sourceLink(media.source)}</p>`;
  }

  variantBoxHTML(p){
    const choice = this.currentChoice(p);
    const sel = this.selectedVariant(p);
    const sell = sellability(p, { ...resolveSelection(p, choice) });
    const groups = (p.variantes || []).map((groupe, g) => `
        <div class="variant-group">
          <span class="variant-label">${sanitizeHTML(groupe.groupe)}</span>
          <div class="variant-options">${(groupe.options || []).map((o, k) => `<button type="button" class="variant-chip${k === (choice[g] ?? 0) ? ' is-selected' : ''}${o.dispo === false ? ' is-unavailable' : ''}" data-variant-group="${g}" data-variant-option="${k}" aria-pressed="${k === (choice[g] ?? 0)}">${sanitizeHTML(o.libelle)}${o.dispo === false ? ' (indisponible)' : ''}</button>`).join('')}</div>
        </div>`).join('');
    const addDisabled = sel.prix === null || !sel.disponible;
    const addLabel = sel.prix === null ? 'Prix à confirmer' : !sel.disponible ? 'Variante indisponible' : 'Ajouter à la caisse';
    const lien = sel.lienOfficiel;
    const lienHTML = sel.lienDefini
      ? (lien
        ? `<a class="btn-official" href="${sanitizeHTML(lien.url)}" target="_blank" rel="noopener" aria-label="Ouvrir la page officielle du fabricant pour ${sanitizeHTML(sel.label)} (nouvelle fenêtre)">Boutique officielle du fabricant<span class="btn-official-arrow" aria-hidden="true">↗</span></a>
           <span class="lien-official-note">Vérifié le ${sanitizeHTML(lien.verifie || '')} · ${sanitizeHTML(lien.precision || '')}</span>`
        : '<button type="button" class="btn-official btn-official--off" disabled>Lien officiel précis introuvable pour cette configuration</button>')
      : '';
    const buyTitle = sell.ok ? 'Payer cet article avec PayPal' : formatSellabilityReason(sell.reasons);
    return `
      <div class="variant-box">
        ${groups}
        <div class="variant-price">
          <span class="variant-price-value">${sel.prix !== null ? formatPrice(sel.prix, p.currency) : 'Information à confirmer'}</span>
          <span class="variant-price-note">${sanitizeHTML(sel.label)}${sel.label ? ' · ' : ''}Prix public officiel (devise du fabricant)</span>
        </div>
        <div class="detail-actions">
          <button type="button" class="btn-primary" data-action="add" ${addDisabled ? 'disabled' : ''}>${addLabel}</button>
          <button type="button" class="btn-secondary btn-buy-now" data-action="buy-now" ${sell.ok ? '' : 'disabled'} title="${sanitizeHTML(buyTitle)}">Acheter maintenant</button>
          ${sel.disponible ? '' : whatsappHTML()}
        </div>
        ${sell.ok ? '' : `<p class="pay-unavailable" role="note">${sanitizeHTML(formatSellabilityReason(sell.reasons))}</p>`}
        <div id="paypalDirectContainer" class="paypal-container" aria-live="polite"></div>
        ${lienHTML ? `<div class="lien-official">${lienHTML}</div>` : ''}
      </div>`;
  }

  specsTableHTML(p){
    const rows = (p.caracteristiques || []).map(c => `<tr><th scope="row">${sanitizeHTML(c.libelle)}</th><td>${sanitizeHTML(c.valeur)}</td></tr>`).join('');
    const boite = p.contenuBoite ? `<tr><th scope="row">Contenu de la boîte</th><td>${sanitizeHTML(p.contenuBoite)}</td></tr>` : '';
    return rows || boite
      ? `<div class="table-wrap"><table class="specs-table"><tbody>${rows}${boite}</tbody></table></div>`
      : '<p class="empty-note">Information à confirmer</p>';
  }

  bundlesHTML(p){
    const bundles = p.bundles || [];
    const acc = p.accessoires || [];
    const bundleHTML = bundles.length
      ? `<h5>Bundles vendus ensemble (officiels)</h5><ul class="link-list">${bundles.map(b => `<li><strong>${sanitizeHTML(b.nom)}</strong> — ${sanitizeHTML(b.contenu)} ${this.sourceLink(b.source)}</li>`).join('')}</ul>`
      : '<h5>Bundles vendus ensemble (officiels)</h5><p class="empty-note">Aucun bundle officiel confirmé : Information à confirmer.</p>';
    const accHTML = acc.length
      ? `<h5>Accessoires vendus séparément</h5><ul class="link-list">${acc.map(a => `<li><strong>${sanitizeHTML(a.nom)}</strong> — compatible : ${sanitizeHTML(a.compatibilite)} ${this.sourceLink(a.source)}</li>`).join('')}</ul>`
      : '<h5>Accessoires vendus séparément</h5><p class="empty-note">Aucun accessoire officiel confirmé : Information à confirmer.</p>';
    return bundleHTML + accHTML;
  }

  usagesHTML(p){
    const items = p.usages || [];
    return items.length
      ? `<ul class="usage-list">${items.map(u => `<li>${sanitizeHTML(u)}</li>`).join('')}</ul>`
      : '<p class="empty-note">Information à confirmer</p>';
  }

  articleHTML(p){
    const article = p.article;
    if(!article) return '';
    const titre = typeof article === 'string' ? '' : (article.titre || '');
    const contenu = typeof article === 'string' ? article : article.contenu;
    const paragraphs = Array.isArray(contenu)
      ? contenu.map(x => String(x).trim()).filter(Boolean)
      : String(contenu || '').split(/\n{2,}/).map(x => x.trim()).filter(Boolean);
    if(!paragraphs.length) return '';
    return `
      <section class="detail-block detail-article">
        <h4>Article${titre ? ` — ${sanitizeHTML(titre)}` : ''}</h4>
        ${paragraphs.map(x => `<p class="detail-desc">${sanitizeHTML(x)}</p>`).join('')}
      </section>`;
  }

  priceBlockHTML(p){
    const prix = p.prix;
    const dispo = p.disponibilite;
    const promo = this.getPromoKiffTech(p);
    const prixLigne = prix
      ? `<div><span class="price-label">Prix public officiel</span> <strong>${formatPrice(prix.montant, prix.devise)}</strong> (${sanitizeHTML(prix.marche || '')}${prix.libelle ? ', ' + sanitizeHTML(prix.libelle) : ''})${prix.date ? ', vérifié le ' + this.formatDate(prix.date) : ''} ${this.sourceLink(prix.source)}</div>`
      : '<div><span class="price-label">Prix public officiel</span> Prix officiel à vérifier</div>';
    const promoLigne = promo
      ? `<div class="promo-kifftech"><span class="price-label">Promotion KiffTech</span> <strong>−${promo.pourcentage}%</strong> · Prix promotionnel : <strong>${formatPrice(promo.prixPromotionnel, promo.devise)}</strong> (calculé sur le prix officiel vérifié) ${promo.dateVerification ? ' · vérifié le ' + this.formatDate(promo.dateVerification) : ''} ${this.sourceLink(promo.source)}</div>`
      : `<div class="promo-kifftech"><span class="price-label">Promotion KiffTech</span> Prix promotionnel indisponible (prix officiel du modèle/variante non vérifié)</div>`;
    const dispoLigne = dispo && dispo.statut === 'disponible'
      ? `<div><span class="price-label">Disponibilité officielle</span> ${sanitizeHTML(dispo.libelle)}, vérifiée le ${this.formatDate(dispo.date)} ${this.sourceLink(dispo.source)}</div>`
      : '<div><span class="price-label">Disponibilité officielle</span> Information à confirmer</div>';
    return `
      <div class="price-block">
        ${prixLigne}
        ${promoLigne}
        ${dispoLigne}
        <div><span class="price-label">Achat</span> ${this.getEtatCatalogue(p).achetable ? 'Offre vendable (prix final, variante, disponibilité, livraison et taxes confirmés).' : 'Non achetable : prix final, disponibilité, livraison et/ou taxes non confirmés.'}</div>
      </div>`;
  }

  mediaHTML(p){
    const imgs = p.medias?.images || [];
    const videos = Array.isArray(p.medias?.videos) && p.medias.videos.length
      ? p.medias.videos
      : (p.medias?.video ? [p.medias.video] : []);
    const videoHTML = videos.length
      ? videos.map(video => `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${sanitizeHTML(video.id)}" title="${sanitizeHTML(video.titre)}" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
        <p class="media-credit">Vidéo officielle : ${sanitizeHTML(video.titre)}, ${sanitizeHTML(video.chaine)} · <a href="${sanitizeHTML(video.url)}" target="_blank" rel="noopener">YouTube</a></p>`).join('')
      : '<p class="empty-note">Vidéo officielle : Information à confirmer.</p>';
    const imgHTML = imgs.length
      ? `<ul class="media-list">${imgs.map((m, k) => `<li><strong>Image ${k + 1}</strong> : ${sanitizeHTML(m.alt)}<span class="media-credit">${sanitizeHTML(m.attribution)} · ${this.sourceLink(m.source)}</span></li>`).join('')}</ul>`
      : '<p class="empty-note">Image à confirmer : aucun média autorisé vérifié.</p>';
    return videoHTML + imgHTML;
  }

  sourcesHTML(p){
    const sources = (p.sourcesVerifiees || []).map(s => `<li>${sanitizeHTML(s.libelle)} : <a href="${sanitizeHTML(s.url)}" target="_blank" rel="noopener">${sanitizeHTML(s.url)}</a> (vérifié le ${this.formatDate(s.date)})</li>`).join('');
    const manquants = (p.manquants || []).map(m => `<li>${sanitizeHTML(m)}</li>`).join('');
    return `
      <h5>Sources officielles consultées</h5>
      <ul class="link-list">${sources || '<li>Information à confirmer</li>'}</ul>
      <p class="media-credit">Année de sortie officielle : ${p.annee}${p.sourceAnnee ? ` · ${this.sourceLink(p.sourceAnnee.url)}` : ''}</p>
      ${manquants ? `<h5>Informations manquantes</h5><ul class="link-list">${manquants}</ul>` : ''}`;
  }

  onDetailClick(e){
    const p = state.currentProduct;
    if(!p) return;
    const chip = e.target.closest('[data-variant-group]');
    if(chip){
      const choice = state.variantChoice[p.id] || [];
      choice[Number(chip.dataset.variantGroup)] = Number(chip.dataset.variantOption);
      state.variantChoice[p.id] = choice;
      this.productDetail.querySelector('#variantBox').innerHTML = this.variantBoxHTML(p);
      return;
    }
    const thumb = e.target.closest('[data-image-index]');
    if(thumb){
      state.imageIndex = Number(thumb.dataset.imageIndex);
      this.productDetail.querySelector('.detail-gallery').innerHTML = this.galleryHTML(p);
      return;
    }
    if(e.target.closest('[data-action="add"]')) { this.addToCart(p.id); return; }
    if(e.target.closest('[data-action="buy-now"]')) { this.buyNow(p.id, this.currentChoice(p), '#paypalDirectContainer'); return; }
  }

  bindCartEvents() {
    window.addEventListener('cart:change', () => this.updateCartDisplay());
  }

  updateCartDisplay() {
    const totals = cartManager.calculateTotals(state.productsMap);
    this.cartCount.textContent = totals.totalItems;
    
    if (state.currentTab === 'cart') this.renderCartPanel();
  }

  renderCartPanel() {
    const panel = document.getElementById('panel-cart');
    if (!panel) return;

    const items = cartManager.getItems();

    if (items.length === 0) {
      panel.querySelector('.panel-content').innerHTML = `
        <div class="empty-state" style="text-align:center;padding:3rem 1rem;color:var(--fg-muted);">
          <div style="font-size:3rem;margin-bottom:1rem;">🛒</div>
          <h3 style="margin-bottom:.5rem;">Caisse vide</h3>
          <p>Ajoutez des produits à la caisse depuis le catalogue</p>
          <button class="btn-primary" onclick="window.keffTech.switchTab('catalog')" style="margin-top:1rem;">Aller au catalogue</button>
        </div>`;
      return;
    }

    const totals = cartManager.calculateTotals(state.productsMap);
    const itemsHTML = items.map((item, index) => {
      const product = state.productsMap.get(item.productId);
      if (!product) return '';
      const sel = resolveSelection(product, item.choiceIndices || []);
      const unit = sel.prix;
      const devise = sel.devise || 'EUR';
      const line = unit !== null && unit !== undefined ? unit * item.quantity : null;
      const thumb = product.images[0];
      return `
        <article class="cart-item" style="display:flex;gap:1rem;padding:1rem;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);margin-bottom:.75rem;align-items:center;">
          ${thumb ? `<img src="${sanitizeHTML(thumb)}" alt="" style="width:80px;height:80px;object-fit:cover;border-radius:var(--radius-md);">` : '<div class="cart-thumb-empty" aria-hidden="true">Image à confirmer</div>'}
          <div style="flex:1;min-width:0;">
            <h4 style="font-size:.9rem;font-weight:600;margin-bottom:.25rem;">${sanitizeHTML(product.title)}</h4>
            ${sel.label ? `<p style="font-size:.7rem;color:var(--fg-muted);">${sanitizeHTML(sel.label)}</p>` : ''}
            <p style="font-size:.7rem;color:var(--fg-muted);">${sanitizeHTML(product.brand)} • ${unit !== null ? formatPrice(unit, devise) : 'Prix à confirmer'} x ${item.quantity}</p>
            <div style="display:flex;align-items:center;gap:.5rem;margin-top:.5rem;">
              <button onclick="window.keffTech.updateCartQty(${index}, ${item.quantity - 1})" class="icon-btn-sm" style="width:32px;height:32px;">−</button>
              <span style="min-width:2rem;text-align:center;font-weight:600;">${item.quantity}</span>
              <button onclick="window.keffTech.updateCartQty(${index}, ${item.quantity + 1})" class="icon-btn-sm" style="width:32px;height:32px;">+</button>
              <span style="margin-left:auto;font-weight:700;color:var(--accent);">${line !== null ? formatPrice(line, devise) : 'Prix à confirmer'}</span>
              <button onclick="window.keffTech.removeFromCart(${index})" class="icon-btn-sm" style="color:var(--danger);" aria-label="Supprimer">🗑️</button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    const sousTotauxHTML = Object.entries(totals.parDevise).map(([devise, montant]) => `
        <div style="display:flex;justify-content:space-between;padding:.5rem 0;">
          <span>Sous-total ${sanitizeHTML(devise)} (prix publics officiels)</span>
          <span>${formatPrice(montant, devise)}</span>
        </div>`).join('');
    const totalHTML = totals.mixedCurrencies
      ? `<div style="display:flex;justify-content:space-between;padding:.5rem 0;border-top:2px solid var(--accent);margin-top:1rem;font-size:1.1rem;font-weight:800;">
          <span>TOTAL indicatif</span>
          <span style="color:var(--accent);">Non calculable</span>
        </div>
        <p style="font-size:.7rem;color:var(--fg-muted);margin-top:.5rem;">Le panier contient des prix publiés dans plusieurs devises : aucune conversion de change n’est effectuée. Réglez séparément par devise.</p>`
      : `<div style="display:flex;justify-content:space-between;padding:.5rem 0;border-top:2px solid var(--accent);margin-top:1rem;font-size:1.1rem;font-weight:800;">
          <span>TOTAL (prix officiels)</span>
          <span style="color:var(--accent);">${formatPrice(totals.finalTotal, totals.devise || 'EUR')}</span>
        </div>`;

    const orderItems = items.map(i => ({ productId: i.productId, choiceIndices: i.choiceIndices || [], quantity: i.quantity }));
    const cartOrder = buildOrder(CATALOGUE, orderItems);

    const content = panel.querySelector('.panel-content');
    content.innerHTML = `
      <div style="margin-bottom:1.5rem;">
        <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:.5rem;">Caisse (${totals.totalItems} article${totals.totalItems > 1 ? 's' : ''})</h2>
        <p style="color:var(--fg-muted);font-size:.8rem;">${totals.uniqueItems} produit${totals.uniqueItems > 1 ? 's' : ''} différent${totals.uniqueItems > 1 ? 's' : ''}</p>
      </div>
      <div class="cart-items">${itemsHTML}</div>
      <div class="cart-summary" style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-xl);padding:1.5rem;margin-top:1.5rem;">
        ${sousTotauxHTML}
        <div style="display:flex;justify-content:space-between;padding:.5rem 0;">
          <span>Livraison</span>
          <span style="color:var(--fg-muted);font-weight:700;">À définir (requis pour le paiement)</span>
        </div>
        ${totalHTML}
        <p style="font-size:.7rem;color:var(--fg-muted);margin-top:.5rem;">Montant recalculé côté serveur à partir du catalogue. Le paiement n’est possible que pour une offre vendable (prix final, disponibilité, devise, livraison et taxes définis).</p>
        ${cartOrder.ok ? '' : `<p class="pay-unavailable" role="note" style="margin-top:.75rem">${sanitizeHTML(cartOrder.error || 'Paiement indisponible pour ce panier.')}</p>`}
        <div id="paypalCartStatus" class="pay-status" aria-live="polite" style="margin-top:.75rem;"></div>
        <div id="paypalCartContainer" class="paypal-container" aria-live="polite" style="margin-top:.75rem;"></div>
        <div style="display:flex;gap:.75rem;margin-top:1.5rem;">
          <button class="btn-secondary" onclick="window.keffTech.switchTab('catalog')" style="flex:1;">Continuer mes achats</button>
        </div>
      </div>
      `;
    if (cartOrder.ok) {
      this.renderPayPalButtons('#paypalCartContainer', orderItems, { mode: 'cart' });
    }
  }

  updateCartQty(index, quantity) {
    cartManager.updateQuantity(index, quantity);
    if (state.currentTab === 'cart') this.renderCartPanel();
  }

  removeFromCart(index) {
    cartManager.remove(index);
    if (state.currentTab === 'cart') this.renderCartPanel();
  }

  checkout() {
    this.showToast('Utilisez le bouton PayPal pour régler la caisse.', 'error');
  }

  async buyNow(productId, choiceIndices = null, containerSelector = null) {
    const p = state.productsMap.get(productId) || state.products.find(x => x.id === productId);
    if (!p) return;
    const choice = Array.isArray(choiceIndices) ? choiceIndices : this.currentChoice(p);
    const sel = resolveSelection(p, choice);
    const sell = sellability(p, sel);
    if (!sell.ok) {
      this.showToast(formatSellabilityReason(sell.reasons), 'error');
      return;
    }
    const items = [{ productId, choiceIndices: choice, quantity: 1 }];
    if (containerSelector) {
      const el = document.querySelector(containerSelector);
      if (el) {
        el.innerHTML = '<div class="pay-status">Chargement du paiement sécurisé…</div>';
        await this.renderPayPalButtons(containerSelector, items, { mode: 'direct', productTitle: p.title });
        return;
      }
    }
    // fallback: show modal with PayPal buttons
    this.modalBody.innerHTML = `
      <h3 style="margin-bottom:.5rem;">Acheter maintenant</h3>
      <p style="margin-bottom:1rem;color:var(--fg-muted);font-size:.85rem;">${sanitizeHTML(p.title)}${sel.label ? ' — ' + sanitizeHTML(sel.label) : ''}</p>
      <p style="margin-bottom:1rem;font-weight:700;">${formatPrice(sel.prix, sel.devise || p.currency || 'EUR')}</p>
      <div id="paypalModalStatus" class="pay-status" aria-live="polite"></div>
      <div id="paypalModalContainer" class="paypal-container"></div>
    `;
    this.modal.hidden = false;
    document.body.style.overflow = 'hidden';
    await this.renderPayPalButtons('#paypalModalContainer', items, { mode: 'direct', productTitle: p.title });
  }

  async ensurePayPalSDK() {
    if (window.paypal) return window.paypal;
    if (this._paypalLoading) return this._paypalLoading;
    this._paypalLoading = (async () => {
      const res = await fetch('./api/paypal/config', { headers: { 'Accept': 'application/json' } });
      let cfg = null;
      try { cfg = await res.json(); } catch {}
      if (!res.ok || !cfg || !cfg.ok || !cfg.clientId) {
        throw new Error((cfg && cfg.error) || 'Paiement non configuré.');
      }
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        const params = new URLSearchParams({
          'client-id': cfg.clientId,
          currency: cfg.currency || 'EUR',
          intent: 'capture',
          components: 'buttons,card-fields',
          'enable-funding': 'card',
          'disable-funding': 'paylater,venmo',
        });
        s.src = `https://www.paypal.com/sdk/js?${params.toString()}`;
        s.async = true;
        s.onload = resolve;
        s.onerror = () => reject(new Error('Impossible de charger le SDK PayPal.'));
        document.head.appendChild(s);
      });
      if (!window.paypal) throw new Error('SDK PayPal indisponible.');
      return window.paypal;
    })().catch(err => { this._paypalLoading = null; throw err; });
    return this._paypalLoading;
  }

  async renderPayPalButtons(containerSelector, items, opts = {}) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.innerHTML = '';
    const statusSel = opts.mode === 'cart' ? '#paypalCartStatus' : (opts.mode === 'direct' ? (containerSelector === '#paypalModalContainer' ? '#paypalModalStatus' : '#paypalDirectContainer') : null);
    const setStatus = (msg, type) => {
      const el = statusSel ? document.querySelector(statusSel) : null;
      if (el) { el.textContent = msg || ''; el.className = 'pay-status' + (type ? ' ' + type : ''); }
    };
    const cardWrapId = `${String(containerSelector).replace(/[^a-zA-Z0-9_-]/g, '')}-card`;
    try {
      setStatus('Chargement du paiement sécurisé…');
      const paypal = await this.ensurePayPalSDK();
      setStatus('');
      container.innerHTML = `
        <div class="pay-methods">
          <div class="pay-method pay-method-paypal">
            <div class="pay-method-title">PayPal</div>
            <div id="${cardWrapId}-buttons"></div>
          </div>
          <div class="pay-divider"><span>ou</span></div>
          <div class="pay-method pay-method-card">
            <div class="pay-method-title">Carte bancaire</div>
            <div id="${cardWrapId}-fields" class="card-fields-wrap"></div>
          </div>
        </div>`;

      const btnTarget = `#${cardWrapId}-buttons`;
      const cardTarget = `#${cardWrapId}-fields`;
      paypal.Buttons({
        style: { layout: 'vertical', shape: 'rect', label: 'pay' },
        onClick: (data, actions) => {
          const order = buildOrder(CATALOGUE, items);
          if (!order.ok) {
            setStatus(order.error || 'Paiement indisponible.', 'error');
            this.showToast(order.error || 'Paiement indisponible.', 'error');
            return actions.reject();
          }
          setStatus('');
          return actions.resolve();
        },
        createOrder: async () => {
          setStatus('Création de la commande sécurisée…');
          const res = await fetch('./api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok || !data.ok || !data.id) {
            const msg = data.error || 'Impossible de créer la commande.';
            setStatus(msg, 'error');
            throw new Error(msg);
          }
          setStatus('Commande créée. Finalisez le paiement dans la fenêtre PayPal.');
          return data.id;
        },
        onApprove: async (data) => {
          setStatus('Confirmation du paiement en cours…');
          const res = await fetch('./api/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID: data.orderID }),
          });
          const result = await res.json().catch(() => ({}));
          if (!res.ok || !result.ok || result.status !== 'COMPLETED') {
            const msg = result.error || 'Le paiement n’a pas été confirmé.';
            setStatus(msg, 'error');
            this.showToast(msg, 'error');
            return;
          }
          setStatus('Paiement confirmé. Merci pour votre achat.', 'success');
          this.showToast('Paiement confirmé.', 'success');
          if (opts.mode === 'cart') {
            state.cart = [];
            cartManager.save();
            this.updateCartDisplay();
            this.renderCartPanel();
          }
        },
        onCancel: () => {
          setStatus('Paiement annulé. Aucun montant n’a été débité.', 'info');
          this.showToast('Paiement annulé.', 'error');
        },
        onError: (err) => {
          console.warn('PayPal error', err);
          setStatus('Erreur lors du paiement. Aucun débit confirmé.', 'error');
          this.showToast('Erreur lors du paiement. Réessayez.', 'error');
        },
      }).render(btnTarget);

      await this.renderCardFields(cardTarget, items, { ...opts, setStatus });
    } catch (err) {
      container.innerHTML = '';
      setStatus(err && err.message ? err.message : 'Paiement indisponible.', 'error');
    }
  }

  async renderCardFields(containerSelector, items, opts = {}) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const setStatus = opts.setStatus || (() => {});
    try {
      if (!window.paypal || !window.paypal.CardFields) {
        container.innerHTML = '<p class="pay-unavailable">Paiement par carte personnalisé non disponible (composant carte indisponible). Utilisez PayPal ci-dessus.</p>';
        return;
      }
      const cardFields = window.paypal.CardFields({
        createOrder: async () => {
          const order = buildOrder(CATALOGUE, items);
          if (!order.ok) {
            setStatus(order.error || 'Paiement indisponible.', 'error');
            this.showToast(order.error || 'Paiement indisponible.', 'error');
            throw new Error(order.error || 'Commande invalide.');
          }
          setStatus('Création de la commande sécurisée…');
          const res = await fetch('./api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok || !data.ok || !data.id) {
            const msg = data.error || 'Impossible de créer la commande.';
            setStatus(msg, 'error');
            throw new Error(msg);
          }
          setStatus('Saisissez vos informations de carte pour payer.');
          return data.id;
        },
        onApprove: async (data) => {
          setStatus('Confirmation du paiement en cours…');
          const res = await fetch('./api/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID: data.orderID }),
          });
          const result = await res.json().catch(() => ({}));
          if (!res.ok || !result.ok || result.status !== 'COMPLETED') {
            const msg = result.error || 'Le paiement n’a pas été confirmé.';
            setStatus(msg, 'error');
            this.showToast(msg, 'error');
            return;
          }
          setStatus('Paiement confirmé. Merci pour votre achat.', 'success');
          this.showToast('Paiement confirmé.', 'success');
          if (opts.mode === 'cart') {
            state.cart = [];
            cartManager.save();
            this.updateCartDisplay();
            this.renderCartPanel();
          }
        },
        onError: (err) => {
          console.warn('CardFields error', err);
          setStatus('Erreur lors du paiement par carte. Aucun débit confirmé.', 'error');
          this.showToast('Erreur lors du paiement par carte.', 'error');
        },
        style: {
          input: { 'font-size': '16px', color: '#e6fff5' },
          '.invalid': { color: '#ff6b6b' },
        },
      });

      if (!cardFields.isEligible || !cardFields.isEligible()) {
        container.innerHTML = '<p class="pay-unavailable">Carte personnalisée non éligible sur ce compte/appareil. Utilisez le bouton PayPal (carte possible via PayPal si disponible).</p>';
        return;
      }

      const idBase = container.id || `card-${Date.now()}`;
      container.id = idBase;
      container.innerHTML = `
        <div class="card-preview" aria-hidden="true">
          <div class="card-preview-top"><span class="card-brand">CARTE BANCAIRE</span><span class="card-chip"></span></div>
          <div class="card-preview-num">•••• •••• •••• ••••</div>
          <div class="card-preview-bottom"><span>Nom du titulaire</span><span>MM/AA</span></div>
        </div>
        <div class="card-form">
          <label class="card-label">Nom sur la carte</label>
          <div id="${idBase}-name" class="card-field"></div>
          <label class="card-label">Numéro de carte</label>
          <div id="${idBase}-number" class="card-field"></div>
          <div class="card-row">
            <div><label class="card-label">Expiration</label><div id="${idBase}-expiry" class="card-field"></div></div>
            <div><label class="card-label">CVV</label><div id="${idBase}-cvv" class="card-field"></div></div>
          </div>
          <button type="button" id="${idBase}-submit" class="btn-primary card-submit">Payer par carte</button>
          <p class="card-note">Saisie sécurisée (champs hébergés PayPal). Aucune donnée de carte n’est stockée par KiffTech.</p>
        </div>`;

      const nameField = cardFields.NameField();
      const numberField = cardFields.NumberField();
      const expiryField = cardFields.ExpiryField();
      const cvvField = cardFields.CVVField();
      await Promise.all([
        nameField.render(`#${idBase}-name`),
        numberField.render(`#${idBase}-number`),
        expiryField.render(`#${idBase}-expiry`),
        cvvField.render(`#${idBase}-cvv`),
      ]);

      const submit = document.getElementById(`${idBase}-submit`);
      if (submit) {
        submit.addEventListener('click', async () => {
          const order = buildOrder(CATALOGUE, items);
          if (!order.ok) {
            setStatus(order.error || 'Paiement indisponible.', 'error');
            this.showToast(order.error || 'Paiement indisponible.', 'error');
            return;
          }
          submit.disabled = true;
          setStatus('Traitement du paiement par carte…');
          try {
            await cardFields.submit();
          } catch (err) {
            console.warn('Card submit error', err);
            setStatus('Paiement par carte refusé ou interrompu. Aucun débit confirmé.', 'error');
          } finally {
            submit.disabled = false;
          }
        });
      }
    } catch (e) {
      console.warn('CardFields unavailable', e);
      container.innerHTML = '<p class="pay-unavailable">Paiement par carte personnalisé indisponible. Utilisez le bouton PayPal.</p>';
    }
  }

    closeModal(){this.modal.hidden=true;document.body.style.overflow='';}

  bindCartEvents() {
    window.addEventListener('cart:change', () => this.updateCartDisplay());
  }

  updateCartDisplay() {
    const totals = cartManager.calculateTotals(state.productsMap);
    this.cartCount.textContent = totals.totalItems;
    
    if (state.currentTab === 'cart') this.renderCartPanel();
  }

  bindEvents(){
    this.loadMore.querySelector('button').addEventListener('click',()=>this.loadMoreProducts());
    this.categoryFilter.addEventListener('change',this.applyFilters);
    this.supplierFilter.addEventListener('change',this.applyFilters);
    this.searchInput.addEventListener('input',this.applyFilters);
    document.querySelectorAll('.btn-subscribe').forEach(btn=>btn.addEventListener('click',()=>this.subscribe(btn.dataset.tier)));
    this.addSourceBtn.addEventListener('click',()=>this.showToast('Ajout source — démo seulement'));
    this.addScheduleBtn.addEventListener('click',()=>this.showToast('Nouvelle tâche cron — démo seulement'));
    this.exportCSV.addEventListener('click',()=>this.exportCatalog('csv'));
    this.exportJSON.addEventListener('click',()=>this.exportCatalog('json'));
    this.importCSV.addEventListener('click',()=>this.csvImportInput.click());
    this.csvImportInput.addEventListener('change',(e)=>this.handleCSVImport(e));
    this.modal.querySelector('.modal-close').addEventListener('click',()=>this.closeModal());
    this.modal.querySelector('.modal-backdrop').addEventListener('click',()=>this.closeModal());
    document.addEventListener('keydown',(e)=>{if(e.key==='Escape') this.closeModal();});

    document.getElementById('cartBtn').addEventListener('click',()=>this.switchTab('cart'));
    document.getElementById('userBtn').addEventListener('click',()=>this.switchTab('settings'));
    document.getElementById('searchBtn').addEventListener('click',()=>{this.searchInput?.focus();});
    this.productDetail.addEventListener('click',(e)=>this.onDetailClick(e));
  }

  initBioParticles(){
    const container=document.getElementById('bioParticles');
    if(!container) return;
    if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const colors=['#00ffc8','#0066ff','#b84dff','#ff6b00','#ffd23f'];
    for(let i=0;i<18;i++){
      const p=document.createElement('div');
      p.className='bio-particle';
      const size=1.5+Math.random()*3;
      const sx=(Math.random()-0.5)*innerWidth*0.8;
      const sy=(Math.random()-0.5)*innerHeight*0.8;
      const ex=(Math.random()-0.5)*innerWidth*0.8;
      const ey=(Math.random()-0.5)*innerHeight*0.8;
      const dx=ex-sx, dy=ey-sy;
      const clr=colors[Math.floor(Math.random()*colors.length)];
      const op=0.05+Math.random()*0.1;
      const dur=20+Math.random()*20;
      const delay=Math.random()*5;
      p.style.cssText=`left:50%;top:50%;width:${size}px;height:${size}px;--sx:${sx}px;--sy:${sy}px;--dx:${dx}px;--dy:${dy}px;--ex:${ex}px;--ey:${ey}px;--op:${op};background:${clr};color:${clr};animation-duration:${dur}s;animation-delay:${delay}s`;
      if(Math.random()<.4) p.classList.add('glow');
      container.appendChild(p);
    }
  }

  showToast(msg,type='success'){const t=document.createElement('div');t.className=`toast ${type}`;t.textContent=msg;this.toastContainer.appendChild(t);setTimeout(()=>{t.style.animation='toastIn .3s reverse';setTimeout(()=>t.remove(),300);},3500);}

  registerSW(){if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(console.warn);}}

  setupInstallPrompt(){
    let deferredPrompt=null;
    const installBtn=document.createElement('button');
    installBtn.className='install-btn';
    installBtn.textContent='Installer KiffTech';
    installBtn.style.cssText='position:fixed;bottom:calc(var(--bottom-bar-h) + 1rem + var(--safe-bottom));left:50%;transform:translateX(-50%);z-index:90;padding:.75rem 1.5rem;background:var(--accent);color:#03050a;border:none;border-radius:999px;font-weight:700;display:none;box-shadow:0 4px 20px rgba(0,255,200,.4)';
    document.body.appendChild(installBtn);

    window.addEventListener('beforeinstallprompt',(e)=>{e.preventDefault();deferredPrompt=e;installBtn.style.display='block';});
    window.addEventListener('appinstalled',()=>{deferredPrompt=null;installBtn.style.display='none';});
    installBtn.addEventListener('click',async()=>{if(!deferredPrompt) return;deferredPrompt.prompt();const{outcome}=await deferredPrompt.userChoice;if(outcome==='accepted') installBtn.style.display='none';deferredPrompt=null;});
    if(window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) installBtn.style.display='none';
  }

  bindCartEvents() {
    window.addEventListener('cart:change', () => this.updateCartDisplay());
  }

  updateCartDisplay() {
    const totals = cartManager.calculateTotals(state.productsMap);
    this.cartCount.textContent = totals.totalItems;
    
    if (state.currentTab === 'cart') this.renderCartPanel();
  }
}

document.addEventListener('DOMContentLoaded',()=>{window.keffTech=new KiffTech();window.keffTech.renderSubscription();window.keffTech.updateCartDisplay();});