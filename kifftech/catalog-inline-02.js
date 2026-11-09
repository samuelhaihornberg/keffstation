
console.log('[Catalog] Inline script executed');
if ('serviceWorker' in navigator) {
  let refreshing = false;
  const forceReload = () => { if (refreshing) return; refreshing = true; window.location.reload(); };
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!sessionStorage.getItem('sw-fresh')) { sessionStorage.setItem('sw-fresh', '1'); return; }
    forceReload();
  });
  navigator.serviceWorker.register('./sw.js').then(reg => {
    console.log('[SW] Registered:', reg.scope);
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      if (!nw) return;
      nw.addEventListener('statechange', () => { if (nw.state === 'activated') forceReload(); });
    });
    if (reg.waiting) forceReload();
  }).catch(err => console.warn('[SW] Registration failed:', err));
  sessionStorage.setItem('sw-fresh', '1');
}
setTimeout(() => {
  const grid = document.getElementById('products-grid');
  console.log('[Catalog] products-grid children:', grid?.children?.length || 0);
  console.log('[Catalog] products-grid innerHTML length:', grid?.innerHTML?.length || 0);
}, 1000);
