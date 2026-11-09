

(function () {

  var overlay = document.getElementById('app-discover-overlay');

  var closeBtn = document.getElementById('discover-close');

  var cancelBtn = document.getElementById('discover-cancel');

  var openBtn = document.getElementById('discover-open');

  var iconEl = document.getElementById('discover-icon');

  var titleEl = document.getElementById('discover-title');

  var descEl = document.getElementById('discover-desc');

  var currentUrl = null;



  function close() {

    if (overlay) overlay.classList.remove('visible');

    currentUrl = null;

  }



  function openAppDiscover(el) {

    if (!overlay || !el) return;

    var url = el.getAttribute('data-url');

    var desc = el.getAttribute('data-desc') || '';

    var icon = el.querySelector('.sphere-icon') ? el.querySelector('.sphere-icon').textContent : '📦';

    var title = el.querySelector('.sphere-title') ? el.querySelector('.sphere-title').textContent : 'Application';



    if (iconEl) iconEl.textContent = icon;

    if (titleEl) titleEl.textContent = title;

    if (descEl) descEl.textContent = desc;

    currentUrl = url;



    overlay.classList.add('visible');

  }



  if (closeBtn) closeBtn.addEventListener('click', close);

  if (cancelBtn) cancelBtn.addEventListener('click', close);

  if (overlay) {

    overlay.addEventListener('click', function (e) {

      if (e.target === overlay) close();

    });

  }

  if (openBtn) {

    openBtn.addEventListener('click', function () {

      if (currentUrl) {

        window.location.href = currentUrl;

      }

    });

  }



  // Fermeture avec la touche Échap

  document.addEventListener('keydown', function (e) {

    if (e.key === 'Escape' && overlay && overlay.classList.contains('visible')) {

      close();

    }

  });



  // Expose pour les onclick HTML

  window.openAppDiscover = openAppDiscover;

})();

