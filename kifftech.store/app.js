/* ===== KiffTech — Catalogue (données vérifiées) ===== */
import { CATALOGUE } from './data/catalogue.js';
import { CONTACT } from './data/config.js';
import { SUPABASE_FUNCTIONS_BASE_URL, SUPABASE_PUBLISHABLE_KEY } from './data/payment-config.js';
import { LEGAL } from './data/legal.js';

// Le paiement n'est ouvert que si les conditions sont publiées ET validées (termsValidated).
function legalReady() {
  return Boolean(LEGAL.termsUrl && LEGAL.termsVersion && LEGAL.termsValidated === true);
}
import { resolveSelection, sellability, formatSellabilityReason, buildOrder, RAYON_ACCESSOIRES, tauxPalierAccessoires } from './lib/payment-core.js';

// ---------- RAYONS (Catégories de produits) ----------
const RAYONS = [
  { id: 'accessoires-gadgets', label: 'Gadgets et accessoires', icon: '🔌', color: '#00ffc8', desc: 'Accessoires, gadgets et studios', sousRayons: [
    { id: 'cables-lumineux-neons', label: 'Câbles lumineux, néons et décorations' },
    { id: 'batteries-externes', label: 'Batteries externes (magnétiques, solaires)' },
    { id: 'antennes', label: 'Antennes' },
    { id: 'cameras-360', label: 'Caméras à 360 degrés' },
    { id: 'smart-gadgets', label: 'Smart gadgets (antistress mécaniques et électroniques)' },
    { id: 'studio-video', label: 'Studio vidéo' },
    { id: 'studio-radio', label: 'Studio radio' },
    { id: 'studio-serveurs', label: 'Studio serveurs' },
    { id: 'studio-design', label: 'Studio design' },
    { id: 'studio-audio', label: 'Studio audio' },
    { id: 'sfx-musique', label: 'SFX et musique' }
  ] },
  { id: 'jeux-video', label: 'Jeux vidéo', icon: '🎮', color: '#ff6b00', desc: 'Consoles, jeux et accessoires gaming' },
  { id: 'smartphones', label: 'Smartphones', icon: '📱', color: '#00d4ff', desc: 'Smartphones et accessoires' },
  { id: 'ordinateurs-composants', label: 'Ordinateurs et composants', icon: '💻', color: '#0066ff', desc: 'Ordinateurs, composants et périphériques' },
  { id: 'tablettes', label: 'Tablettes', icon: '📲', color: '#00ffc8', desc: 'Tablettes et accessoires' },
  { id: 'vr-ar', label: 'VR & AR', icon: '🥽', color: '#b84dff', desc: 'Casques VR et AR complets' },
  { id: 'maison-securite', label: 'Maison connectée et sécurité', icon: '🏠', color: '#b84dff', desc: 'Maison connectée, sécurité et surveillance' },
  { id: 'smart-car', label: 'Smart car et mobilité connectée', icon: '🚗', color: '#ff6b00', desc: 'Smart car, mobilité et accessoires connectés' },
  { id: 'smart-tech', label: 'Smart tech', icon: '🤖', color: '#ffd23f', desc: 'Robots, drones, assistants, énergie et objets connectés' }
];

const RAYONS_MAP = Object.fromEntries(RAYONS.map(r => [r.id, r]));

// ---------- GRILLE PROMOTIONNELLE KIFFTECH (par année de sortie) ----------
// Taux de réduction KiffTech appliqué au prix officiel vérifié selon l'année de sortie du modèle.
// L'année de sortie sert UNIQUEMENT au calcul de la promotion : aucun filtre n'est appliqué sur le catalogue.
const TAUX_PROMO_PAR_ANNEE = {
  '2020': 25, // -25 %
  '2021': 23, // -23 %
  '2022': 21, // -21 %
  '2023': 18, // -18 %
  '2024': 15, // -15 %
  '2025': 12, // -12 %
  '2026': 10  // -10 %
};

function roundMoney2(val){
  const n = Number(val);
  return (typeof n === 'number' && Number.isFinite(n)) ? Math.round(n * 100) / 100 : null;
}

// Un rayon n’est affiché que s’il contient au moins une fiche. Aucune fiche n’est masquée pour son année, son média ou son statut.
function rayonsAffiches() {
  return RAYONS.filter(r => DEMO_PRODUCTS.some(p => p.rayon === r.id));
}

// ---------- PRODUITS (données vérifiées : data/catalogue.js) ----------

function normalizeProduct(raw) {
  const prix = raw.prix || null;
  return {
    ...raw,
    title: raw.modele.toLowerCase().startsWith(String(raw.marque).toLowerCase() + ' ') ? raw.modele : `${raw.marque} ${raw.modele}`,
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
  .filter(p => RAYONS_MAP[p.rayon])
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
    let subtotal = 0;
    let shipping = 0;
    let taxes = 0;
    let shippingDefined = true;
    let taxesDefined = true;
    let pricedDefined = true;
    const quantiteAccessoires = state.cart.reduce((s, item) => {
      const p = productsMap.get(item.productId);
      return p && p.rayon === RAYON_ACCESSOIRES ? s + item.quantity : s;
    }, 0);
    const tauxLot = tauxPalierAccessoires(quantiteAccessoires);
    for (const item of state.cart) {
      const p = productsMap.get(item.productId);
      if (!p) continue;
      const sel = resolveSelection(p, item.choiceIndices || []);
      const devise = sel.devise || null;
      totalItems += item.quantity;
      uniqueItems += 1;
      const remise = p.rayon === RAYON_ACCESSOIRES && tauxLot > 0 ? tauxLot : 0;
      const prixUnitaire = typeof sel.prix === 'number' ? Math.round(sel.prix * (1 - remise) * 100) / 100 : sel.prix;
      if (devise) parDevise.set(devise, Math.round(((parDevise.get(devise) || 0) + (Number(prixUnitaire || 0) * item.quantity)) * 100) / 100);
      if (typeof sel.prix !== 'number' || !Number.isFinite(sel.prix) || !devise) pricedDefined = false;
      else subtotal = Math.round((subtotal + prixUnitaire * item.quantity) * 100) / 100;
      if (typeof sel.shipping === 'number' && Number.isFinite(sel.shipping)) shipping = Math.round((shipping + sel.shipping * item.quantity) * 100) / 100;
      else shippingDefined = false;
      if (typeof sel.taxes === 'number' && Number.isFinite(sel.taxes)) taxes = Math.round((taxes + sel.taxes * item.quantity) * 100) / 100;
      else taxesDefined = false;
    }
    const devises = [...parDevise.keys()];
    const deviseUnique = devises.length === 1 ? devises[0] : null;
    const finalDefined = pricedDefined && shippingDefined && taxesDefined && !!deviseUnique;
    const finalTotal = finalDefined ? Math.round((subtotal + shipping + taxes) * 100) / 100 : null;
    return {
      totalItems, uniqueItems, devises,
      devise: deviseUnique,
      parDevise: Object.fromEntries(parDevise),
      mixedCurrencies: devises.length > 1,
      pricedDefined,
      shippingDefined,
      taxesDefined,
      finalDefined,
      subtotal: pricedDefined && deviseUnique ? subtotal : null,
      shipping: shippingDefined && deviseUnique ? shipping : null,
      taxes: taxesDefined && deviseUnique ? taxes : null,
      finalTotal,
      details: []
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

    document.addEventListener('kt-media-rights-change', () => {
      if (state.currentProduct) {
        const detail = document.getElementById('productDetail');
        if (detail) detail.innerHTML = this.productDetailHTML(state.currentProduct);
      }
    });

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
    // Abonnement en maintenance : aucune souscription n’est enregistrée tant que le paiement n’existe pas.
    this.showToast('Abonnement en maintenance : indisponible pour le moment.', 'error');
    return;
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
    this.categoryFilter.innerHTML = '<option value="">Tous les rayons</option>' + rayonsAffiches().map(r=>`<option value="${r.id}">${r.label}</option>`).join('');
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
      grid.innerHTML = rayonsAffiches().map(r => this.rayonCardHTML(r)).join('');
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
    const promo = this.getPromoKiffTech(p, this.currentChoice(p));
    const prixHTML = promo && promo.prixPromotionnel != null
      ? `<span class="product-price"><s>${formatPrice(promo.prixOfficiel, promo.devise)}</s> ${formatPrice(promo.prixPromotionnel, promo.devise)}</span>
         <span class="product-price-note">Promo KiffTech −${promo.pourcentage}% · ${promo.devise} · prix officiel vérifié${promo.dateVerification ? ' · vérifié le ' + this.formatDate(promo.dateVerification) : ''}${promo.source ? ' · ' + this.sourceLink(promo.source) : ''}</span>`
      : `<span class="product-price">${p.price !== null ? formatPrice(p.price, p.currency) : 'Prix officiel à vérifier'}</span>
         <span class="product-price-note">${p.price !== null ? 'Prix public officiel (devise du fabricant)' : 'Prix promotionnel indisponible (prix officiel non vérifié)'}${promo && promo.statut && promo.statut !== 'ok' ? (promo.statut === 'annee-manquante' ? ' · champ "annee" à vérifier pour le calcul' : ' · champ prix officiel à vérifier') : ''}</span>`;
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

  getPromoKiffTech(p, choiceIndices){
    const promoSource = p && p.promotionKiffTech;
    const annee = Number(p?.annee);
    const tauxBrut = Number(TAUX_PROMO_PAR_ANNEE[String(annee ?? '')]);
    const taux = Number.isFinite(tauxBrut) && tauxBrut > 0 ? tauxBrut : null;
    const choice = Array.isArray(choiceIndices) ? choiceIndices : (p ? this.currentChoice(p) : []);
    // Prix officiel : montant confirmé de la variante sélectionnée, sinon le prix officiel du produit.
    // Une variante sans montant confirmé (ex. accessoire ou option liée) ne remet pas le prix officiel à null.
    let official = (p && p.prix && typeof p.prix.montant === 'number') ? p.prix.montant : (typeof p?.price === 'number' ? p.price : null);
    let devise = (p && p.prix && p.prix.devise) || p?.currency || 'EUR';
    for (let g = 0; g < (p?.variantes || []).length; g++) {
      const option = (p.variantes[g].options || [])[choice[g] ?? 0];
      if (!option) continue;
      if (typeof option.prix === 'number' && Number.isFinite(option.prix)) {
        official = option.prix;
        if (option.devise) devise = option.devise;
      }
    }
    const officialMontant = (typeof official === 'number' && Number.isFinite(official)) ? official : null;
    const source = (p && p.prix && p.prix.source) || (promoSource && promoSource.source) || null;
    const dateVerification = (p && p.prix && p.prix.date) || (promoSource && promoSource.dateVerification) || null;
    if(!p) return null;
    const base = { annee, taux, devise, source, dateVerification };
    if(taux === null){
      // Année de sortie hors grille ou non renseignée : le calcul de promo est impossible.
      return { ...base, prixOfficiel: null, pourcentage: null, prixPromotionnel: null, statut: 'annee-manquante', manquant: 'annee' };
    }
    if(officialMontant === null){
      // Prix officiel non vérifié (ou variante/devise sans montant officiel) : la promo ne doit pas être fabriquée.
      return { ...base, prixOfficiel: null, pourcentage: taux, prixPromotionnel: null, statut: 'prix-officiel-manquant', manquant: 'prix-officiel' };
    }
    const prixPromotionnel = roundMoney2(officialMontant * (1 - taux / 100));
    return { ...base, prixOfficiel: officialMontant, pourcentage: taux, prixPromotionnel, statut: 'ok', manquant: [] };
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
            <p>${etat.achetable ? 'Prix final, variante, disponibilité, livraison et taxes confirmés.' : 'Fiche consultable. Achat possible uniquement si prix final, variante, disponibilité/stock, livraison et taxes sont confirmés.'}${!etat.achetable && etat.raisons.length ? ' ' + sanitizeHTML(etat.raisons.join(', ')) + '.' : ''}</p>
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
    const rights = this.mediaRightsConsent();
    const rightsNote = rights === 'accepted'
      ? '<p class="media-rights-status is-accepted">Validation des droits médias : acceptée (cookie).</p>'
      : rights === 'rejected'
        ? '<p class="media-rights-status is-rejected">Validation des droits médias : refusée (cookie).</p>'
        : '<p class="media-rights-status">Validation des droits médias : non définie.</p>';
    return `
      <img class="main-image" src="${sanitizeHTML(media.fichier)}" alt="${sanitizeHTML(media.alt || '')}" loading="lazy">
      <div class="thumbnails">${p.medias.images.map((m, k) => `<button type="button" class="thumb-btn${k === i ? ' is-active' : ''}" data-image-index="${k}" aria-label="Image ${k + 1}"><img src="${sanitizeHTML(m.fichier)}" alt="" loading="lazy"></button>`).join('')}</div>
      <p class="media-credit">${sanitizeHTML(media.auteur || '')}${media.licence ? ' · ' + sanitizeHTML(media.licence) : ''}${media.source ? ' · ' + this.sourceLink(media.source) : ''}</p>
      ${rightsNote}`;
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
    const promoVar = this.getPromoKiffTech(p, choice);
    return `
      <div class="variant-box">
        ${groups}
        <div class="variant-price">
          ${promoVar && promoVar.prixPromotionnel != null
            ? `<span class="variant-price-value">${formatPrice(promoVar.prixPromotionnel, promoVar.devise)} <span class="variant-price-ref"><s>${formatPrice(promoVar.prixOfficiel, promoVar.devise)}</s></span></span>
               <span class="variant-price-note">Promo KiffTech −${promoVar.pourcentage}% · ${promoVar.devise} · prix officiel vérifié${promoVar.dateVerification ? ' · vérifié le ' + this.formatDate(promoVar.dateVerification) : ''}</span>`
            : `<span class="variant-price-value">${sel.prix !== null ? formatPrice(sel.prix, p.currency) : 'Information à confirmer'}</span>
               <span class="variant-price-note">${sanitizeHTML(sel.label)}${sel.label ? ' · ' : ''}Prix public officiel (devise du fabricant)</span>`}
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
    const promo = this.getPromoKiffTech(p, this.currentChoice(p));
    const prixLigne = prix
      ? `<div><span class="price-label">Prix public officiel</span> <strong>${formatPrice(prix.montant, prix.devise)}</strong> (${sanitizeHTML(prix.marche || '')}${prix.libelle ? ', ' + sanitizeHTML(prix.libelle) : ''})${prix.date ? ', vérifié le ' + this.formatDate(prix.date) : ''} ${this.sourceLink(prix.source)}</div>`
      : '<div><span class="price-label">Prix public officiel</span> Prix officiel à vérifier</div>';
    const promoLigne = promo && promo.prixPromotionnel != null
      ? `<div class="promo-kifftech"><span class="price-label">Promotion KiffTech</span> <strong>−${promo.pourcentage}%</strong> · Prix promotionnel : <strong>${formatPrice(promo.prixPromotionnel, promo.devise)}</strong> (calculé sur le prix officiel vérifié ${formatPrice(promo.prixOfficiel, promo.devise)})<br/><span class="price-label">Prix officiel barré</span> <s>${formatPrice(promo.prixOfficiel, promo.devise)}</s><br/><span class="price-label">Année de sortie</span> ${promo.annee} · Devise ${promo.devise}<br/>${promo.source ? this.sourceLink(promo.source) : ''}${promo.dateVerification ? ' · vérifié le ' + this.formatDate(promo.dateVerification) : ''}</div>`
      : `<div class="promo-kifftech"><span class="price-label">Promotion KiffTech</span> Prix promotionnel indisponible (prix officiel du modèle/variante non vérifié${promo && promo.statut === 'annee-manquante' ? ' · champ "annee" à vérifier pour le calcul' : ''}${promo && promo.statut === 'prix-officiel-manquant' ? ' · champ prix officiel à vérifier' : ''})</div>`;
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

  mediaRightsConsent(){
    try {
      const m = document.cookie.split(';').map(s=>s.trim()).find(s=>s.startsWith('kt_media_rights_consent='));
      return m ? decodeURIComponent(m.split('=').slice(1).join('=')) : '';
    } catch { return ''; }
  }

  mediaHTML(p){
    const imgs = p.medias?.images || [];
    const videos = Array.isArray(p.medias?.videos) && p.medias.videos.length
      ? p.medias.videos
      : (p.medias?.video ? [p.medias.video] : []);
    const rights = this.mediaRightsConsent();
    const rightsLabel = rights === 'accepted' ? 'acceptée' : rights === 'rejected' ? 'refusée' : 'non définie';
    const videoHTML = videos.length
      ? videos.map(video => `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${sanitizeHTML(video.id)}" title="${sanitizeHTML(video.titre)}" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
        <p class="media-credit">Vidéo officielle : ${sanitizeHTML(video.titre)}, ${sanitizeHTML(video.chaine)} · <a href="${sanitizeHTML(video.url)}" target="_blank" rel="noopener">YouTube</a></p>`).join('')
      : '<p class="empty-note">Vidéo officielle : Information à confirmer.</p>';
    const imgHTML = imgs.length
      ? `<ul class="media-list">${imgs.map((m, k) => `<li><strong>Image ${k + 1}</strong> : ${sanitizeHTML(m.alt || '')}<span class="media-credit">${sanitizeHTML(m.auteur || m.attribution || '')}${(m.licence) ? ' · ' + sanitizeHTML(m.licence) : ''}${m.source ? ' · ' + this.sourceLink(m.source) : ''}</span></li>`).join('')}</ul>`
      : '<p class="empty-note">Image à confirmer : aucun média autorisé vérifié.</p>';
    return `<p class="media-rights-status ${rights==='accepted'?'is-accepted':rights==='rejected'?'is-rejected':''}">Validation des droits médias : ${rightsLabel} (cookie <code>kt_media_rights_consent</code>).</p>` + videoHTML + imgHTML;
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

  formatTotalsMoney(value, currency) {
    if (value === null || value === undefined) return 'À définir';
    return formatPrice(value, currency || 'EUR');
  }

  renderTotalsSummaryHTML(totals, { compact = false } = {}) {
    const currency = totals.devise || totals.currency || '—';
    const rows = [
      ['Sous-total', this.formatTotalsMoney(totals.subtotal, currency)],
      ['Livraison', this.formatTotalsMoney(totals.shipping, currency)],
      ['Taxes', this.formatTotalsMoney(totals.taxes, currency)],
      ['Devise', currency === '—' ? 'À définir' : sanitizeHTML(currency)],
      ['Total final', this.formatTotalsMoney(totals.finalTotal, currency)],
    ];
    return `
      <div class="payment-totals ${compact ? 'compact' : ''}" aria-label="Récapitulatif des montants">
        ${rows.map(([label, value]) => `<div class="payment-total-row ${label === 'Total final' ? 'is-final' : ''}"><span>${label}</span><strong>${value}</strong></div>`).join('')}
      </div>`;
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
      const subtotal = (unit != null ? unit : 0) * item.quantity;
      const priceText = unit != null ? formatPrice(unit, sel.devise || totals.devise || 'EUR') : 'Information à confirmer';
      const variantText = sel.label ? ` <span class="cart-variant">(${sanitizeHTML(sel.label)})</span>` : '';
      const sell = sellability(product, sel);
      return `
        <div class="cart-item">
          <div class="cart-item-info">
            <h4>${sanitizeHTML(product.title)}${variantText}</h4>
            <span class="cart-item-price">${priceText} / unité</span>
            ${sell.ok ? '' : `<span class="cart-item-note">${sanitizeHTML(formatSellabilityReason(sell.reasons))}</span>`}
          </div>
          <div class="cart-item-actions">
            <button class="qty-btn" data-action="dec" data-index="${index}" aria-label="Diminuer">−</button>
            <span class="qty">${item.quantity}</span>
            <button class="qty-btn" data-action="inc" data-index="${index}" aria-label="Augmenter">+</button>
            <button class="remove-btn" data-action="remove" data-index="${index}" aria-label="Retirer">✕</button>
          </div>
          <div class="cart-item-subtotal">${unit != null ? formatPrice(subtotal, sel.devise || totals.devise || 'EUR') : '—'}</div>
        </div>`;
    }).join('');

    const unsellable = items.some((item) => {
      const p = state.productsMap.get(item.productId);
      return !p || !sellability(p, resolveSelection(p, item.choiceIndices || [])).ok;
    });
    const canPay = !unsellable && !totals.mixedCurrencies && totals.finalDefined && totals.finalTotal > 0;
    const payNote = totals.mixedCurrencies
      ? 'Paiement indisponible : la caisse contient plusieurs devises. Retirez des articles pour n’avoir qu’une seule devise.'
      : unsellable || !totals.finalDefined
        ? 'Paiement indisponible : prix final, disponibilité, livraison, taxes, devise ou stock non valides pour ce panier. Le paiement reste désactivé tant que le total final n’est pas déterminé.'
        : 'Paiement PayPal ponctuel (compte PayPal et, si PayPal l’autorise pour le compte/pays, carte via les composants PayPal officiels). Montants recalculés et capture confirmée côté serveur avant validation de paiement.';

    panel.querySelector('.panel-content').innerHTML = `
      <div class="cart-list">${itemsHTML}</div>
      <div class="cart-summary kifftech-checkout">
        <h3 class="checkout-title">Récapitulatif de paiement KiffTech</h3>
        ${this.renderTotalsSummaryHTML(totals)}
        <p class="cart-note">${sanitizeHTML(payNote)}</p>
        ${this.termsBlockHTML()}
        <div id="paypalCartContainer" class="paypal-container kifftech-paypal" aria-live="polite"></div>
        <div id="paypalCardContainer" class="paypal-container kifftech-card" aria-live="polite"></div>
        <div id="paypalCartStatus" class="pay-status" aria-live="polite"></div>
        <p style="font-size:.7rem;color:var(--fg-muted);margin-top:.5rem;">Achat ponctuel uniquement. Aucun numéro de carte n’est collecté ni stocké par KiffTech (composants PayPal officiels). Le serveur recalcule les montants depuis le catalogue vérifié et ne marque une commande payée qu’après capture confirmée.</p>
      </div>`;

    panel.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index, 10);
        const item = cartManager.getItems()[index];
        if (!item) return;
        if (btn.dataset.action === 'inc') cartManager.updateQuantity(index, item.quantity + 1);
        if (btn.dataset.action === 'dec') cartManager.updateQuantity(index, item.quantity - 1);
        if (btn.dataset.action === 'remove') cartManager.remove(index);
        this.renderCartPanel();
      });
    });

    if (canPay) {
      this.renderPayPalCheckout({ buttonsSelector: '#paypalCartContainer', cardSelector: '#paypalCardContainer', items, mode: 'cart' });
    } else {
      const c = panel.querySelector('#paypalCartContainer');
      if (c) c.innerHTML = '<p class="pay-unavailable">Paiement indisponible pour cette caisse tant que le total final (sous-total, livraison, taxes, devise) n’est pas déterminé et valide.</p>';
      const cc = panel.querySelector('#paypalCardContainer');
      if (cc) cc.innerHTML = '';
    }
  }


  paymentApiUrl(path) {
    const endpoint = String(path || '').startsWith('/') ? String(path) : '/' + String(path || '');
    const supaBase = (typeof SUPABASE_FUNCTIONS_BASE_URL === 'string' ? SUPABASE_FUNCTIONS_BASE_URL : '').replace(/\/+$/, '');
    if (!supaBase) return '';
    if (endpoint.endsWith('/api/paypal/config')) return `${supaBase}/paypal-config`;
    if (endpoint.endsWith('/api/paypal/create-order')) return `${supaBase}/paypal-create-order`;
    if (endpoint.endsWith('/api/paypal/capture-order')) return `${supaBase}/paypal-capture-order`;
    return `${supaBase}${endpoint}`;
  }
  termsBlockHTML() {
    if (!legalReady()) {
      return '<div class="kt-terms kt-terms--off"><p class="pay-unavailable">Paiement indisponible : conditions en cours de validation. <a href="./conditions.html">Lire les conditions</a> · <a href="./politique-confidentialite.html">Lire la politique de confidentialité</a></p></div>';
    }
    const privacy = LEGAL.privacyUrl
      ? ` et la <a href="${sanitizeHTML(LEGAL.privacyUrl)}" target="_blank" rel="noopener">politique de confidentialité</a>`
      : '';
    return `<label class="kt-terms"><input type="checkbox" class="kt-accept-terms"> <span>J’ai lu et j’accepte les <a href="${sanitizeHTML(LEGAL.termsUrl)}" target="_blank" rel="noopener">conditions d’utilisation</a>${privacy} (version ${sanitizeHTML(LEGAL.termsVersion)}). Achat ponctuel, sans abonnement.</span></label>`;
  }

  paymentApiHeaders(extra = {}) {
    const headers = { ...extra };
    const supaBase = (typeof SUPABASE_FUNCTIONS_BASE_URL === 'string' ? SUPABASE_FUNCTIONS_BASE_URL : '').replace(/\/+$/, '');
    const key = (typeof SUPABASE_PUBLISHABLE_KEY === 'string' ? SUPABASE_PUBLISHABLE_KEY : '').trim();
    if (supaBase && key) {
      headers.apikey = key;
    }
    return headers;
  }

  async ensurePayPalSDK() {
    if (window.paypal && window.__kifftechPaypalConfig) return { paypal: window.paypal, config: window.__kifftechPaypalConfig };
    if (this._paypalLoading) return this._paypalLoading;
    this._paypalLoading = (async () => {
      if (!this.paymentApiUrl('/api/paypal/config')) throw new Error('Paiement non configuré : URL du backend Supabase manquante.');
      const res = await fetch(this.paymentApiUrl('/api/paypal/config'), { headers: this.paymentApiHeaders({ 'Accept': 'application/json' }), cache: 'no-store' });
      let cfg = null;
      try { cfg = await res.json(); } catch {}
      if (!res.ok || !cfg || !cfg.ok || !cfg.clientId) {
        throw new Error((cfg && cfg.error) || 'Paiement non configuré côté serveur ou backend injoignable.');
      }
      await new Promise((resolve, reject) => {
        const existing = document.querySelector('script[data-kifftech-paypal-sdk="1"]');
        if (existing) { existing.addEventListener('load', resolve, { once: true }); existing.addEventListener('error', () => reject(new Error('Impossible de charger le SDK PayPal.')), { once: true }); return; }
        const s = document.createElement('script');
        s.dataset.kifftechPaypalSdk = '1';
        const params = new URLSearchParams({
          'client-id': cfg.clientId,
          currency: cfg.currency || 'EUR',
          intent: cfg.intent || 'capture',
          components: 'buttons,card-fields',
          commit: 'true',
        });
        s.src = `https://www.paypal.com/sdk/js?${params.toString()}`;
        s.async = true;
        s.onload = resolve;
        s.onerror = () => reject(new Error('Impossible de charger le SDK PayPal.'));
        document.head.appendChild(s);
      });
      if (!window.paypal) throw new Error('SDK PayPal indisponible.');
      window.__kifftechPaypalConfig = cfg;
      return { paypal: window.paypal, config: cfg };
    })().finally(() => { this._paypalLoading = null; });
    return this._paypalLoading;
  }

  makePaymentRequestId(prefix = 'kt') {
    try {
      const rnd = (crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      return `${prefix}-${String(rnd).replace(/[^A-Za-z0-9._:-]/g, '').slice(0, 60)}`;
    } catch {
      return `${prefix}-${Date.now()}-${Math.floor(Math.random()*1e6)}`;
    }
  }

  async renderPayPalCheckout({ buttonsSelector, cardSelector = null, items, mode = 'cart', statusSelector = null }) {
    const buttonsContainer = document.querySelector(buttonsSelector);
    if (!buttonsContainer) return;
    const cardContainer = cardSelector ? document.querySelector(cardSelector) : null;
    const statusEl = statusSelector ? document.querySelector(statusSelector) : (mode === 'cart' ? document.querySelector('#paypalCartStatus') : document.querySelector('#paypalDirectStatus'));
    const setStatus = (msg, type = 'info') => {
      if (!statusEl) return;
      statusEl.className = `pay-status ${type}`;
      statusEl.textContent = msg || '';
    };

    const orderCheck = buildOrder(CATALOGUE, items);
    if (!orderCheck.ok) {
      buttonsContainer.innerHTML = `<p class="pay-unavailable">${sanitizeHTML(orderCheck.error || 'Paiement indisponible.')}</p>`;
      if (cardContainer) cardContainer.innerHTML = '';
      setStatus(orderCheck.error || 'Paiement indisponible.', 'error');
      return;
    }

    const scope = buttonsContainer.closest('.kifftech-checkout');
    const termsBox = scope ? scope.querySelector('.kt-accept-terms') : null;
    const args = { buttonsSelector, cardSelector, items, mode, statusSelector };
    if (!legalReady()) {
      buttonsContainer.innerHTML = '<p class="pay-unavailable">Paiement indisponible : conditions en cours de validation.</p>';
      if (cardContainer) cardContainer.innerHTML = '';
      setStatus('Paiement indisponible : conditions non publiées.', 'error');
      return;
    }
    if (!termsBox || !termsBox.checked) {
      buttonsContainer.innerHTML = '<p class="pay-unavailable">Cochez la case d’acceptation des conditions pour afficher les moyens de paiement.</p>';
      if (cardContainer) cardContainer.innerHTML = '';
      if (termsBox && !termsBox.dataset.bound) {
        termsBox.dataset.bound = '1';
        termsBox.addEventListener('change', () => {
          buttonsContainer.dataset.rendering = '0';
          this.renderPayPalCheckout(args);
        });
      }
      setStatus('', 'info');
      return;
    }

    if (buttonsContainer.dataset.rendering === '1') return;
    buttonsContainer.dataset.rendering = '1';
    buttonsContainer.innerHTML = '';
    if (cardContainer) cardContainer.innerHTML = '';
    setStatus('Chargement du paiement sécurisé PayPal…');

    let sdk;
    try {
      sdk = await this.ensurePayPalSDK();
    } catch (e) {
      buttonsContainer.innerHTML = `<p class="pay-unavailable">${sanitizeHTML(e.message || 'Paiement non configuré.')}</p>`;
      setStatus(e.message || 'Paiement non configuré.', 'error');
      buttonsContainer.dataset.rendering = '0';
      return;
    }

    const paypal = sdk.paypal;
    const env = (sdk.config && sdk.config.environment) || 'unknown';
    const envLabel = env === 'sandbox' ? 'Sandbox' : env === 'live' ? 'Live' : 'environnement serveur';
    const inFlight = { creating: false, capturing: false };

    const createOrder = async () => {
      if (inFlight.creating) throw new Error('Création de commande déjà en cours.');
      inFlight.creating = true;
      const requestId = this.makePaymentRequestId('create');
      try {
        if (!termsBox || !termsBox.checked) throw new Error('Acceptez les conditions avant de payer.');
        const res = await fetch(this.paymentApiUrl('/api/paypal/create-order'), {
          method: 'POST',
          headers: this.paymentApiHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ items, requestId, acceptTerms: true, termsVersion: LEGAL.termsVersion }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok || !data.id || !data.orderToken) throw new Error(data.error || 'Création de commande refusée.');
        this._payTokens = this._payTokens || new Map();
        this._payTokens.set(data.id, data.orderToken);
        setStatus(`Commande PayPal créée (${envLabel}). Finalisez le paiement sans recharger la page.`, 'info');
        return data.id;
      } finally {
        inFlight.creating = false;
      }
    };

    const captureOrder = async (orderID) => {
      if (inFlight.capturing) return { ok: false, error: 'Capture déjà en cours.' };
      inFlight.capturing = true;
      const requestId = this.makePaymentRequestId('capture');
      try {
        const orderToken = this._payTokens && this._payTokens.get(orderID);
        if (!orderToken) throw new Error('Session de paiement expirée. Relancez le paiement.');
        const res = await fetch(this.paymentApiUrl('/api/paypal/capture-order'), {
          method: 'POST',
          headers: this.paymentApiHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ orderID, orderToken, requestId }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok || data.status !== 'COMPLETED') {
          const err = new Error(data.error || 'Paiement non confirmé par le serveur. Aucun paiement validé.');
          err.code = data.code || '';
          throw err;
        }
        this._payTokens.delete(orderID);
        return data;
      } finally {
        inFlight.capturing = false;
      }
    };

    const onApproved = async (data) => {
      setStatus('Paiement approuvé. Confirmation de la capture côté serveur…');
      try {
        const captured = await captureOrder(data.orderID);
        const inv = captured.invoice;
        let msg = captured.alreadyCaptured ? 'Paiement déjà confirmé côté serveur.' : 'Paiement confirmé par le serveur. Merci pour votre commande.';
        if (inv) {
          msg += ` Reçu n° ${inv.number} : ${formatPrice(inv.totalPaid, inv.currency)} payés. Référence PayPal : ${inv.paypalCaptureId}.`;
          if (!inv.legalComplete) msg += ' Document provisoire : les mentions légales du vendeur ne sont pas encore finalisées.';
        }
        if (inv && captured.receiptToken) {
          const receiptUrl = `./facture.html#n=${encodeURIComponent(inv.number)}&t=${encodeURIComponent(captured.receiptToken)}`;
          msg += ' Ouverture de votre facture…';
          setTimeout(() => { window.location.href = receiptUrl; }, 2500);
        }
        setStatus(msg, 'success');
        this.showToast(captured.alreadyCaptured ? 'Paiement déjà confirmé.' : 'Paiement confirmé.', 'success');
        if (mode === 'cart') {
          state.cart = [];
          cartManager.save();
          this.updateCartDisplay();
        }
      } catch (err) {
        setStatus(err.message || 'Paiement non confirmé. Aucun paiement validé sans confirmation serveur.', 'error');
        this.showToast(err.message || 'Paiement non confirmé.', 'error');
      }
    };

    try {
      const brandColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00ffc8';
      const buttons = paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'pill',
          label: 'pay',
          tagline: false,
          height: 45,
        },
        createOrder,
        onApprove: (data) => onApproved(data),
        onCancel: () => {
          setStatus('Paiement annulé. Aucun débit confirmé.', 'info');
          this.showToast('Paiement annulé.', 'error');
        },
        onError: (err) => {
          console.warn('PayPal button error', err);
          setStatus('Erreur ou refus de paiement. Aucun paiement confirmé. Vous pouvez réessayer.', 'error');
        },
      });

      if (!buttons.isEligible()) {
        buttonsContainer.innerHTML = '<p class="pay-unavailable">Boutons PayPal non éligibles dans ce contexte. Vérifiez la configuration et l’éligibilité du compte.</p>';
      } else {
        await buttons.render(buttonsContainer);
      }

      // Champs de carte avancés PayPal (hébergés) : affichés uniquement si éligibles.
      if (cardContainer) {
        if (paypal.CardFields && typeof paypal.CardFields === 'function') {
          try {
            const cardFields = paypal.CardFields({
              createOrder,
              onApprove: (data) => onApproved(data),
            });
            if (cardFields.isEligible && cardFields.isEligible()) {
              const idBase = (cardContainer.id && cardContainer.id !== '') ? cardContainer.id : `card-${mode}-${Date.now()}`;
              cardContainer.id = idBase;
              cardContainer.innerHTML = `
                <div class="pay-divider"><span>Paiement par carte (si éligible)</span></div>
                <div class="card-fields-wrap kifftech-card-wrap">
                  <div class="card-preview" aria-hidden="true">
                    <div class="card-preview-top"><span class="card-brand">KIFFTECH · CARTE</span><span class="card-chip"></span></div>
                    <div class="card-preview-num">•••• •••• •••• ••••</div>
                    <div class="card-preview-bottom"><span>Titulaire</span><span>MM/AA</span></div>
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
                    <p class="card-note">Saisie sécurisée par champs hébergés PayPal. Aucune donnée de carte n’est collectée ni stockée par KiffTech.</p>
                  </div>
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
                  const current = buildOrder(CATALOGUE, items);
                  if (!current.ok) {
                    setStatus(current.error || 'Paiement indisponible.', 'error');
                    return;
                  }
                  submit.disabled = true;
                  setStatus('Traitement du paiement par carte…');
                  try {
                    await cardFields.submit();
                  } catch (err) {
                    console.warn('Card submit error', err);
                    setStatus('Paiement par carte refusé, annulé ou interrompu. Aucun débit confirmé.', 'error');
                  } finally {
                    submit.disabled = false;
                  }
                });
              }
            } else {
              cardContainer.innerHTML = '<p class="pay-unavailable">Champs carte avancés non éligibles pour ce compte/pays/appareil. Le paiement par carte peut rester disponible via PayPal selon éligibilité.</p>';
            }
          } catch (e) {
            console.warn('CardFields unavailable', e);
            cardContainer.innerHTML = '<p class="pay-unavailable">Champs carte avancés indisponibles. Utilisez le bouton PayPal si disponible.</p>';
          }
        }
      }

      setStatus(`Paiement sécurisé PayPal (${envLabel}, achat ponctuel). Vérifiez le total final avant de payer.`, 'info');
    } catch (e) {
      console.error('PayPal render error', e);
      buttonsContainer.innerHTML = `<p class="pay-unavailable">${sanitizeHTML(e.message || 'Impossible d’afficher le paiement PayPal.')}</p>`;
      setStatus(e.message || 'Impossible d’afficher le paiement PayPal.', 'error');
    } finally {
      buttonsContainer.dataset.rendering = '0';
    }
  }

  async buyNow(productId, choiceIndices = [], containerSelector = '#paypalDirectContainer') {
    const p = state.productsMap.get(productId) || state.products.find(x => x.id === productId);
    if (!p) return;
    const items = [{ productId, choiceIndices: Array.isArray(choiceIndices) ? choiceIndices : this.currentChoice(p), quantity: 1 }];
    const order = buildOrder(CATALOGUE, items);
    if (!order.ok) {
      this.showToast(order.error || 'Paiement indisponible pour cet article.', 'error');
      const c = document.querySelector(containerSelector);
      if (c) c.innerHTML = `<p class="pay-unavailable">${sanitizeHTML(order.error || 'Paiement indisponible.')}</p>`;
      return;
    }

    const totalsHTML = this.renderTotalsSummaryHTML({
      subtotal: order.totals.subtotal,
      shipping: order.totals.shipping,
      taxes: order.totals.taxes,
      devise: order.totals.currency,
      finalTotal: order.totals.total,
    }, { compact: true });

    this.modalBody.innerHTML = `
      <div class="kifftech-checkout kifftech-checkout-modal">
        <h3 class="checkout-title">Paiement KiffTech — ${sanitizeHTML(p.title)}</h3>
        ${totalsHTML}
        <p class="cart-note">Achat ponctuel. Vérifiez le sous-total, la livraison, les taxes, la devise et le total final avant l’ouverture/la confirmation du paiement.</p>
        ${this.termsBlockHTML()}
        <div id="paypalModalContainer" class="paypal-container kifftech-paypal" aria-live="polite"></div>
        <div id="paypalModalCardContainer" class="paypal-container kifftech-card" aria-live="polite"></div>
        <div id="paypalDirectStatus" class="pay-status" aria-live="polite"></div>
        <p style="font-size:.7rem;color:var(--fg-muted);margin-top:.5rem;">Composants PayPal officiels. Aucune collecte/stockage direct des cartes par KiffTech. Capture confirmée côté serveur uniquement.</p>
      </div>`;
    this.modal.hidden = false;
    document.body.style.overflow = 'hidden';
    await this.renderPayPalCheckout({ buttonsSelector: '#paypalModalContainer', cardSelector: '#paypalModalCardContainer', items, mode: 'direct', statusSelector: '#paypalDirectStatus' });
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