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
    btn.innerHTML = '🗑️';
    btn.title = 'Vider tous les caches (Service Worker, localStorage, sessionStorage, cache HTTP) et recharger';
    btn.style.cssText = [
      'position:fixed',
      'top:10px',
      'right:10px',
      'z-index:9999',
      'padding:10px',
      'border-radius:12px',
      'border:1px solid rgba(255,255,255,.3)',
      'background:rgba(255,61,154,.25)',
      'color:#ff3d9a',
      'font-size:1.5rem',
      'cursor:pointer',
      'backdrop-filter:blur(6px)',
      'transition:all .2s',
      'width:48px',
      'height:48px',
      'display:flex',
      'align-items:center',
      'justify-content:center'
    ].join(';');

    btn.onmouseover = function(){ this.style.background = 'rgba(255,61,154,.45)'; this.style.borderColor = '#ff3d9a'; this.style.transform = 'scale(1.1)'; };
    btn.onmouseout = function(){ this.style.background = 'rgba(255,61,154,.25)'; this.style.borderColor = 'rgba(255,255,255,.3)'; this.style.transform = 'scale(1)'; };

    btn.onclick = async function(){
      btn.innerHTML = '⏳';
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
        btn.innerHTML = '🗑️';
        btn.style.background = 'rgba(255,61,154,.25)';
        btn.style.color = '#ff3d9a';
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
