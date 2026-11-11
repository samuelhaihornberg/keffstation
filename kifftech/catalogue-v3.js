/* ============================================================================
   KiffTech — Catalogue v3 : affichage des produits avec filtres, tri et recherche
   Charge les produits depuis data/catalogue.json et affiche une grille interactive
   ============================================================================ */

(function(){
  'use strict';

  /* ---------- État ---------- */
  let allProducts = [];
  let filteredProducts = [];
  let currentCategory = null;
  let currentSort = 'name';
  let currentSearch = '';

  /* ---------- Éléments DOM ---------- */
  const catalogueGrid = document.getElementById('catalogueGrid');
  const categoryFilters = document.getElementById('categoryFilters');
  const catalogueSearch = document.getElementById('catalogueSearch');
  const catalogueSort = document.getElementById('catalogueSort');
  const catalogueCount = document.getElementById('catalogueCount');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalSub = document.getElementById('modalSub');
  const modalMedia = document.getElementById('modalMedia');
  const modalSpecs = document.getElementById('modalSpecs');
  const modalClose = document.getElementById('modalClose');
  const modalCancel = document.getElementById('modalCancel');
  const modalAdd = document.getElementById('modalAdd');

  /* ---------- Chargement des données ---------- */
  async function loadCatalogue(){
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

      // Détecter la catégorie depuis l'URL ?catalogue=
      const urlParams = new URLSearchParams(window.location.search);
      const urlCat = urlParams.get('catalogue');
      if (urlCat) {
        // Trouver la catégorie qui correspond au slug
        const matched = allProducts.find(p => {
          const slug = String(p.category || '')
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/&/g, ' et ')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
          return slug === urlCat;
        });
        if (matched) {
          currentCategory = matched.category;
        }
      }

      // Initialiser les filtres de catégorie
      renderCategoryFilters(categories);

      // Afficher les produits
      applyFiltersAndSort();

      // Écouter les changements de filtres
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
      catalogueGrid.innerHTML = '<div style="text-align:center;padding:40px;color:#ff3d9a;">Impossible de charger le catalogue. Vérifiez votre connexion.</div>';
    }
  }

  /* ---------- Rendu des filtres de catégorie ---------- */
  function renderCategoryFilters(categories){
    if (!categoryFilters) return;

    const uniqueCats = [...new Set(allProducts.map(p => p.category))].sort();

    let html = '<span class="filter-chip filter-active" data-cat="all">Tous</span>';
    uniqueCats.forEach(cat => {
      const count = allProducts.filter(p => p.category === cat).length;
      const isActive = (currentCategory === cat);
      html += `<span class="filter-chip ${isActive ? 'filter-active' : ''}" data-cat="${escapeHtml(cat)}">${escapeHtml(cat)} (${count})</span>`;
    });

    categoryFilters.innerHTML = html;

    categoryFilters.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cat = chip.dataset.cat;
        currentCategory = (cat === 'all') ? null : cat;

        // Mettre à jour l'état actif des chips
        categoryFilters.querySelectorAll('.filter-chip').forEach(c => {
          c.classList.toggle('filter-active', c.dataset.cat === cat || (cat === 'all' && c.dataset.cat === 'all'));
        });

        applyFiltersAndSort();
      });
    });
  }

  /* ---------- Filtrage et tri ---------- */
  function applyFiltersAndSort(){
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
        case 'name':
          return a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'year-desc':
          return (b.year || 0) - (a.year || 0);
        case 'brand':
          return a.brand.localeCompare(b.brand);
        default:
          return 0;
      }
    });

    filteredProducts = result;
    renderProducts();
  }

  /* ---------- Rendu des produits ---------- */
  function renderProducts(){
    if (!catalogueGrid) return;

    catalogueCount.textContent = `${filteredProducts.length} produit${filteredProducts.length > 1 ? 's' : ''}`;

    if (filteredProducts.length === 0) {
      catalogueGrid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#b9c0e6;">
          <div style="font-size:3rem;margin-bottom:16px;">📦</div>
          <p>Aucun produit trouvé</p>
        </div>
      `;
      return;
    }

    catalogueGrid.innerHTML = filteredProducts.map(p => `
      <article class="product-card" data-id="${p.id}">
        <div class="product-media">
          <img src="${escapeHtml(p.images[0])}" alt="${escapeHtml(p.brand + ' ' + p.model)}" loading="lazy">
          ${p.discount ? `<div class="product-badge">-${p.discount}%</div>` : ''}
          <div class="product-source">${p.source === 'shopify' ? 'Boutique' : p.source === 'impact' ? 'Impact' : 'Local'}</div>
        </div>
        <div class="product-info">
          <span class="product-brand">${escapeHtml(p.brand)}</span>
          <h3 class="product-name">${escapeHtml(p.model)}</h3>
          <div class="product-meta">
            <span class="meta-year">${p.year || ''}</span>
            <span class="meta-category">${escapeHtml(p.category)}</span>
          </div>
          <div class="product-prices">
            <span class="price-kifftech">${p.price.toLocaleString('fr-FR')} €</span>
            ${p.price > 0 ? `<span class="price-crossed">${Math.round(p.price * 1.25).toLocaleString('fr-FR')} €</span>` : ''}
          </div>
        </div>
        <div class="product-actions">
          <button class="btn-sm primary" onclick="openProductModal('${escapeHtml(p.id)}')">Détails</button>
          <button class="btn-sm" onclick="addToCart('${escapeHtml(p.id)}')">Ajouter</button>
        </div>
      </article>
    `).join('');

    // Re-attacher les événements (nécessaire car innerHTML recrée les éléments)
    attachProductEvents();
  }

  function attachProductEvents(){
    catalogueGrid.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        const id = card.dataset.id;
        openProductModal(id);
      });
    });
  }

  /* ---------- Modal produit ---------- */
  window.openProductModal = function(id){
    const p = allProducts.find(prod => prod.id === id);
    if (!p) return;

    modalTitle.textContent = p.brand + ' ' + p.model;
    modalSub.textContent = p.category + ' • ' + (p.year || '');
    modalMedia.innerHTML = `<img src="${escapeHtml(p.images[0])}" alt="${escapeHtml(p.brand + ' ' + p.model)}" style="width:100%;height:100%;object-fit:cover;">`;

    let specsHtml = '';
    if (p.specs && Object.keys(p.specs).length) {
      specsHtml = '<h4>Caractéristiques</h4>' +
        Object.entries(p.specs).map(([k, v]) =>
          `<div class="spec-item"><span class="spec-label">${escapeHtml(k)}</span><span class="spec-value">${escapeHtml(v)}</span></div>`
        ).join('');
    } else {
      specsHtml = '<p>Aucune caractéristique détaillée.</p>';
    }

    modalSpecs.innerHTML = specsHtml;

    const btn = document.getElementById('modalAdd');
    btn.onclick = () => {
      addToCart(p.id);
      closeModal();
    };

    modalOverlay.classList.add('open');
  };

  window.addToCart = function(id){
    const p = allProducts.find(prod => prod.id === id);
    if (!p) return;

    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      const existing = saved.find(i => i.id === p.id);
      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        saved.push({ id: p.id, qty: 1, brand: p.brand, model: p.model, price: p.price });
      }
      localStorage.setItem(CART_KEY, JSON.stringify(saved));
      majCompteurCaisse();
      showToast(p.model + ' ajouté à la caisse', 'success');
    } catch(e){
      console.error('Erreur ajout caisse:', e);
    }
  };

  function closeModal(){
    modalOverlay.classList.remove('open');
  }

  modalClose.addEventListener('click', closeModal);
  modalCancel.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ---------- Utilitaires ---------- */
  function escapeHtml(text){
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  }

  function fmtPrice(price, currency='EUR'){
    return new Intl.NumberFormat('fr-FR', { style:'currency', currency }).format(price);
  }

  /* ---------- Caisse ---------- */
  const CART_KEY = 'kifftech.cart.v1';
  const cartBadge = document.getElementById('cartBadge');

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
    if(!t) return;
    t.querySelector('.t-emoji').textContent = type==='success'?'✅':'⚠️';
    t.querySelector('#toastMsg').textContent = msg;
    t.className = 'toast show '+type;
    setTimeout(()=>t.classList.remove('show'),2500);
  }

  /* ---------- Initialisation ---------- */
  document.addEventListener('DOMContentLoaded', loadCatalogue);

})();
