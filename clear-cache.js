/* ===== KIFFSTATION — VIDANGE DES CACHES =====
   Bouton + fonctions pour vider tous les caches du navigateur :
   - Cache HTTP (Service Worker, caches API)
   - localStorage / sessionStorage
   - Service Workers (désenregistrement)
   - Rechargement forcé de la page
*/

(function(){
  'use strict';

  function injectClearCacheButton(){
    // Éviter les doublons
    if(document.getElementById('clear-cache-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'clear-cache-btn';
    btn.className = 'clear-cache-btn';
    btn.innerHTML = '🗑️ Vider le cache';
    btn.title = 'Vider tous les caches (Service Worker, localStorage, sessionStorage, cache HTTP) et recharger';
    btn.style.cssText = [
      'position:fixed',
      'top:10px',
      'right:10px',
      'z-index:9999',
      'padding:8px 14px',
      'border-radius:8px',
      'border:1px solid rgba(255,255,255,.3)',
      'background:rgba(255,61,154,.2)',
      'color:#ff3d9a',
      'font-weight:700',
      'font-size:.85rem',
      'cursor:pointer',
      'backdrop-filter:blur(6px)',
      'transition:all .2s'
    ].join(';');

    btn.onmouseover = function(){ this.style.background = 'rgba(255,61,154,.4)'; this.style.borderColor = '#ff3d9a'; };
    btn.onmouseout = function(){ this.style.background = 'rgba(255,61,154,.2)'; this.style.borderColor = 'rgba(255,255,255,.3)'; };

    btn.onclick = async function(){
      btn.textContent = 'Vidage en cours...';
      btn.style.background = '#ffd23f';
      btn.style.color = '#05060a';

      try {
        // 1. Désenregistrer les Service Workers
        if('serviceWorker' in navigator){
          const registrations = await navigator.serviceWorker.getRegistrations();
          for(const reg of registrations){
            await reg.unregister();
            console.log('[ClearCache] Service Worker désenregistré :', reg.scope);
          }
        }

        // 2. Vider les caches HTTP (Cache API)
        if('caches' in window){
          const names = await caches.keys();
          for(const name of names){
            await caches.delete(name);
            console.log('[ClearCache] Cache supprimé :', name);
          }
        }

        // 3. Vider localStorage et sessionStorage
        localStorage.clear();
        sessionStorage.clear();
        console.log('[ClearCache] localStorage et sessionStorage vidés');

        // 4. Rechargement forcé sans cache
        window.location.reload(true);
      } catch(e){
        console.error('[ClearCache] Erreur :', e);
        btn.textContent = 'Erreur — essayez F5';
        setTimeout(()=>{ btn.textContent = '🗑️ Vider le cache'; btn.style.background = 'rgba(255,61,154,.2)'; btn.style.color = '#ff3d9a'; }, 2000);
      }
    };

    document.body.appendChild(btn);
    console.log('[ClearCache] Bouton "Vider le cache" injecté');
  }

  // Lancer au chargement
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', injectClearCacheButton);
  } else {
    injectClearCacheButton();
  }

})();
