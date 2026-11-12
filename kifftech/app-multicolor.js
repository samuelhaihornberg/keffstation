/* ==========================================================================
   KiffTech — App Multicolor Boutique + Catalogue
   Interface boutique classy-punchy avec effet wow, filtres, tri, modal
   ========================================================================== */

(function() {
  'use strict';

  /* ---------- Éléments DOM ---------- */
  const productsGrid = document.getElementById('productsGrid');
  const categoryFilters = document.getElementById('categoryFilters');
  const catalogueSearch = document.getElementById('catalogueSearch');
  const catalogueSort = document.getElementById('catalogueSort');
  const catalogueCount = document.getElementById('catalogueCount');
  const modalOverlay = document.querySelector('.modal-kifftech');
  const modalBrand = document.getElementById('modal-brand');
  const modalMedia = document.getElementById('modal-media');
  const modalSpecs = document.getElementById('modal-specs');
  const modalClose = modalOverlay.querySelector('.modal-kifftech-close');
  const modalCancel = modalOverlay.querySelector('#modal-cancel');
  const modalAdd = modalOverlay.querySelector('#modal-add');
  const toast = document.querySelector('.toast-kifftech');

  /* ---------- État ---------- */
  let allProducts = [];
  let filteredProducts = [];
  let currentCategory = null;
  let currentSort = 'name';
  let currentSearch = '';

  /* ---------- Initialisation ---------- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    loadCatalogue();
    setupEventListeners();
    setupModal();
    setupToast();
  }

  /* ---------- Chargement des données ---------- */
  async function loadCatalogue() {
    try {
      const response = await fetch('./data/catalogue.json', { cache:'no-cache' });
      if (!response.ok) throw new Error('Impossible de charger le catalogue');
      const data = await response.json();

      const products = Array.isArray(data.products) ? data.products : [];
      const categories = data.categories || {};

      allProducts = products.map(p => ({
        id: p.id,
        brand: p.brand || 'Sans marque',
        model: p.model || 'Sans nom',
        year: p.year || 2024,
        category: p.category || 'Accessories',
        price: (p.price && p.price.official) || 0,
        specs: p.specs || {},
        images: (p.images && p.images.length) ? p.images : ['./img/no-image.jpg'],
        usage: p.usage || [],
        impact: p.impact || null,
        source: p.source || 'local'
      }));

      // Initialiser les filtres de catégorie
      renderCategoryFilters(categories);

      // Afficher les produits
      applyFiltersAndSort();

      // Écouter les changements
      catalogueSearch.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase();
        applyFiltersAndSort();
      });

      catalogueSort.addEventListener('change', (e) => {
        currentSort = e.target.value;
        applyFiltersAndSort();
      });

    } catch (err) {
      console.error('[KiffTech] Erreur chargement catalogue:', err);
      if (productsGrid) productsGrid.innerHTML = '<div style="text-align:center;padding:40px;color:var(--kf-acid);">Impossible de charger le catalogue.</div>';
    }
  }

  /* ---------- Filtrage et tri ---------- */
  function applyFiltersAndSort() {
    let result = [...allProducts];

    // Filtre par catégorie
    if (currentCategory) {
      result = result.filter(p => p.category === currentCategory);
    }

    // Filtre par recherche
    if (currentSearch) {
      result = result.filter(p => {
        const text = (p.brand + ' ' + p.model + ' ' + p.category).toLowerCase();
        return text.includes(currentSearch);
      });
    }

    // Tri
    result.sort((a, b) => {
      switch (currentSort) {
        case 'name': return a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model);
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'year-desc': return (b.year || 0) - (a.year || 0);
        case 'brand': return a.brand.localeCompare(b.brand);
        default: return 0;
      }
    });

    filteredProducts = result;
    renderProducts();
  }

  /* ---------- Rendu des filtres ---------- */
  function renderCategoryFilters(categories) {
    if (!categoryFilters) return;

    const uniqueCats = [...new Set(allProducts.map(p => p.category))].sort();

    let html = '<span class="filter-chip filter-active" data-cat="all">Tous</span>';
    uniqueCats.forEach(cat => {
      const count = allProducts.filter(p => p.category === cat).length;
      html += `<span class="filter-chip ${currentCategory === cat ? 'filter-active' : ''}" data-cat="${cat}">${escapeHtml(cat)} (${count})</span>`;
    });

    categoryFilters.innerHTML = html;

    // Événements sur les chips
    categoryFilters.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cat = chip.dataset.cat;
        currentCategory = (cat === 'all') ? null : cat;

        // Mettre à jour l'état actif
        categoryFilters.querySelectorAll('.filter-chip').forEach(c => {
          c.classList.toggle('filter-active', c.dataset.cat === cat || (cat === 'all' && c.dataset.cat === 'all'));
        });

        applyFiltersAndSort();
      });
    });
  }

  /* ---------- Rendu des produits ---------- */
  function renderProducts() {
    if (!productsGrid) return;

    catalogueCount.textContent = `${filteredProducts.length} produit${filteredProducts.length > 1 ? 's' : ''}`;

    if (filteredProducts.length === 0) {
      productsGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--kf-ink-dim);">Aucun produit trouvé</div>`;
      return;
    }

    productsGrid.innerHTML = filteredProducts.map(p => `
      <article class="product-card k-card" tabindex="0" role="button" aria-label="Produit ${p.brand} ${p.model}">
        <div class="product-media">
          <img src="${p.images[0]}" alt="${p.brand} ${p.model}" class="product-img" loading="lazy">
          <span class="product-badge k-badge">Nouveau</span>
        </div>
        <div class="product-info">
          <span class="product-brand">${p.brand}</span>
          <h3 class="product-name">${p.model}</h3>
          <div class="product-meta">
            <span class="meta-year">${p.year || ''}</span>
            <span class="meta-category">${p.category}</span>
          </div>
          <div class="product-prices">
            <span class="price-kifftech">${p.price.toLocaleString('fr-FR')} €</span>
            ${p.price > 0 ? `<span class="price-crossed">${Math.round(p.price * 1.25).toLocaleString('fr-FR')} €</span>` : ''}
          </div>
        </div>
        <div class="product-actions">
          <button class="product-action k-btn">Détails</button>
        </div>
      </article>
    `).join('');

    // Re-attacher les événements
    attachProductEvents();
  }

  function attachProductEvents() {
    productsGrid.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        const id = card.dataset.id;
        openProductModal(id);
      });
    });
  }

  /* ---------- Modal produit ---------- */
  window.openProductModal = function(id) {
    const p = allProducts.find(prod => prod.id === id);
    if (!p) return;

    modalBrand.textContent = p.brand + ' ' + p.model;
    modalMedia.innerHTML = `<img src="${p.images[0]}" alt="${p.brand} ${p.model}" style="width:100%;height:100%;object-fit:cover;">`;

    let specsHtml = '';
    if (p.specs && Object.keys(p.specs).length) {
      specsHtml = '<h4>Caractéristiques</h4>' +
        Object.entries(p.specs).map(([k, v]) =>
          `<div class="spec-item"><span class="spec-label">${k}</span><span class="spec-value">${v}</span></div>`
        ).join('');
    } else {
      specsHtml = '<p>Aucune caractéristique détaillée.</p>';
    }
    modalSpecs.innerHTML = specsHtml;

    modalOverlay.classList.add('open');
  };

  window.addToCart = function(id) {
    const p = allProducts.find(prod => prod.id === id);
    if (!p) return;

    try {
      const saved = JSON.parse(localStorage.getItem('kifftech.cart.v1') || '[]');
      const existing = saved.find(i => i.id === p.id);
      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        saved.push({ id: p.id, qty: 1, brand: p.brand, model: p.model, price: p.price });
      }
      localStorage.setItem('kifftech.cart.v1', JSON.stringify(saved));
      majCompteurCaisse();
      showToast(p.model + ' ajouté à la caisse', 'success');
    } catch(e) {
      console.error('Erreur ajout caisse:', e);
    }
  };

  function closeModal() {
    modalOverlay.classList.remove('open');
  }

  modalClose.addEventListener('click', closeModal);
  modalCancel.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ---------- Utilitaires ---------- */
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  }

  function fmtPrice(price, currency='EUR') {
    return new Intl.NumberFormat('fr-FR', { style:'currency', currency }).format(price);
  }

  /* ---------- Caisse ---------- */
  const CART_KEY = 'kifftech.cart.v1';
  const cartBadge = document.querySelector('.cart-count');

  function majCompteurCaisse() {
    let n = 0;
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      n = saved.reduce((a,i)=>a + (Number(i && i.qty) || 1), 0);
    } catch(e){ n = 0; }
    if (cartBadge) cartBadge.textContent = n;
  }
  majCompteurCaisse();
  window.addEventListener('storage', majCompteurCaisse);

  function showToast(msg, type='success') {
    if(!toast) return;
    const icon = toast.querySelector('.toast-kifftext-icon');
    const msgEl = toast.querySelector('.toast-kifftext-msg');
    icon.textContent = type==='success'?'✅':'⚠️';
    msgEl.textContent = msg;
    toast.className = 'toast-kifftech show ' + type;
    setTimeout(()=>toast.classList.remove('show'), 3000);
  }

  /* ---------- Initialisation ---------- */
  document.addEventListener('DOMContentLoaded', init);

})();