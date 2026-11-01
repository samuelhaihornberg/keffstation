// Bouton hard-refresh KeffStation : purge les caches SW puis recharge.
// Couvre le shell + (via l'overlay) les SPAs embarquées. Zéro dépendance.
(function () {
  function $(id) { return document.getElementById(id); }

  async function purgeCaches() {
    if (!('caches' in window)) return 0;
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    return keys.length;
  }

  async function hardRefresh() {
    const btn = $('refresh-btn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = '⏳';
    }
    try {
      const n = await purgeCaches();
      console.log('[Refresh] caches purgés:', n);
    } catch (e) {
      console.warn('[Refresh] purge partielle:', e);
    }
    // Recharge dure : les caches étant vides, le SW retélécharge tout.
    window.location.reload();
  }

  window.hardRefresh = hardRefresh;

  document.addEventListener('DOMContentLoaded', () => {
    if ($('refresh-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'refresh-btn';
    btn.type = 'button';
    btn.textContent = '⟳';
    btn.title = 'Recharger (vide les caches)';
    btn.setAttribute('aria-label', 'Recharger la page et vider les caches');
    // Adaptatif : à gauche si un champ d'envoi vit en bas à droite (ex. conversation),
    // pour ne jamais masquer le contenu ni le bouton d'envoi.
    const side = document.querySelector('form.composer, .composer') ? 'left:1rem' : 'right:1rem';
    btn.style.cssText = [
      'position:fixed', 'bottom:1rem', side, 'z-index:9998',
      'width:48px', 'height:48px', 'border-radius:50%',
      'border:1px solid rgba(255,255,255,.2)', 'background:rgba(10,12,34,.9)',
      'color:#ffd23f', 'font-size:22px', 'cursor:pointer',
      'box-shadow:0 4px 20px rgba(0,0,0,.5)', 'touch-action:manipulation'
    ].join(';');
    btn.addEventListener('click', hardRefresh);
    document.body.appendChild(btn);
  });
})();
