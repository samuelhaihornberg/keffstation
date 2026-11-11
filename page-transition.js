/* ===== KIFFSTATION — TRANSITION DE PAGE =====
   Animation de transition fluide entre les pages du site.
   Quand on clique sur un lien interne, un overlay de couleur apparaît
   avec une animation de glissement avant le chargement de la nouvelle page.
*/

(function(){
  'use strict';

  // Couleur de fond de la transition (rose KiffStation)
  const TRANSITION_COLOR = 'rgba(7, 8, 22, 0.98)';
  const TRANSITION_DURATION = 450; // ms

  // Créer l'overlay de transition
  function createTransitionOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'width:100vw',
      'height:100vh',
      'background:' + TRANSITION_COLOR,
      'z-index:99999',
      'display:none',
      'justify-content:center',
      'align-items:center',
      'flex-direction:column',
      'gap:12px',
      'backdrop-filter:blur(6px)',
      '-webkit-backdrop-filter:blur(6px)',
      'opacity:0',
      'transition:opacity ' + TRANSITION_DURATION + 'ms ease'
    ].join(';');

    // Spinner ou texte de chargement
    const spinner = document.createElement('div');
    spinner.style.cssText = [
      'width:40px',
      'height:40px',
      'border:3px solid rgba(255,255,255,0.2)',
      'border-top-color:#ff3d9a',
      'border-radius:50%',
      'animation:spin 0.8s linear infinite'
    ].join(';');

    const txt = document.createElement('div');
    txt.style.cssText = [
      'color:#fff',
      'font-size:1rem',
      'font-weight:700',
      'font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif',
      'letter-spacing:0.05em'
    ].join(';');
    txt.textContent = 'Chargement de la page…';

    overlay.appendChild(spinner);
    overlay.appendChild(txt);
    document.body.appendChild(overlay);

    // Animation keyframes spin
    if (!document.getElementById('page-transition-keyframes')) {
      const kf = document.createElement('style');
      kf.id = 'page-transition-keyframes';
      kf.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
      document.head.appendChild(kf);
    }

    return overlay;
  }

  const overlay = createTransitionOverlay();

  function showOverlay() {
    overlay.style.display = 'flex';
    // Petit délai pour permettre au display:flex de s'appliquer avant l'opacité
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });
  }

  function hideOverlay() {
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.display = 'none';
    }, TRANSITION_DURATION);
  }

  // Détermine si une URL est interne au site
  function isInternalUrl(href) {
    if (!href) return false;
    try {
      const url = new URL(href, window.location.href);
      const currentHost = window.location.host;
      // Même domaine (kiffstation.com ou github.io)
      return url.host === currentHost;
    } catch (e) {
      // Si ce n'est pas une URL absolue, c'est un lien relatif → interne
      return href.startsWith('./') || href.startsWith('../') || href.startsWith('/') || href.startsWith('#');
    }
  }

  // Intercepter les clics sur les liens
  function setupLinkInterception() {
    document.addEventListener('click', function(e) {
      // Trouver l'élément <a> cliqué (ou son parent)
      let link = e.target.closest('a[href]');
      if (!link) return;

      const href = link.getAttribute('href');

      // Ignorer si ce n'est pas un lien interne
      if (!isInternalUrl(href)) return;

      // Ignorer si c'est un ancrage sur la même page
      if (href.startsWith('#')) return;

      // Ignorer si la touche Ctrl/Cmd est pressée (nouvel onglet)
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;

      // Ignorer si l'élément a déjà un onclick (évite le double chargement)
      if (link.onclick || link.getAttribute('onclick')) return;

      // Empêcher le comportement par défaut
      e.preventDefault();
      e.stopImmediatePropagation();

      // Lancer la transition
      showOverlay();

      // Attendre la fin de l'animation avant de naviguer
      setTimeout(() => {
        window.location.href = href;
      }, TRANSITION_DURATION);
    }, true);
  }

  // Initialiser
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLinkInterception);
  } else {
    setupLinkInterception();
  }

})();
