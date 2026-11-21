

/* ===== Sélecteur d'articles — gestion des pages et ouverture des apps ===== */

(function () {

  var selector = document.querySelector('.article-selector');

  if (!selector) return;



  var pageDots = selector.querySelectorAll('.page-dot');

  var pages = selector.querySelectorAll('.article-page');

  var closeBtn = selector.querySelector('.selector-close');

  var titleEl = selector.querySelector('#selector-title');

  var openBtn = selector.querySelector('#selector-open-btn');



  // Titres par page (mis à jour selon la langue)

  var pageTitles = [
    'KiffTech — Articles',

    'ViArtificial Labs — Articles',

    'Videogames — Articles',

    'Blogum — Articles'
  ];



  // URLs des apps par page

  var pageAppUrls = [
    './kifftech.store/',

    './viartificial-labs/',

    './videogames/',

    './blogum/'
  ];



  // Noms des apps par page

  var pageAppNames = [
    'KiffTech',

    'ViArtificial Labs',

    'Videogames',

    'Blogum'
  ];



  function showPage(index) {

    pages.forEach(function (page, i) {

      page.classList.toggle('active', i === index);

      page.style.display = i === index ? 'flex' : 'none';

    });

    pageDots.forEach(function (dot, i) {

      dot.classList.toggle('active', i === index);

    });

    if (titleEl && pageTitles[index]) {

      titleEl.textContent = pageTitles[index];

    }

    // Mettre à jour le bouton ouvrir avec le nom de l'app

    if (openBtn && pageAppNames[index]) {

      openBtn.textContent = 'Ouvrir ' + pageAppNames[index];

      openBtn.onclick = function () {

        window.location.href = pageAppUrls[index];

      };

    }

  }



  pageDots.forEach(function (dot) {

    dot.addEventListener('click', function () {

      var idx = parseInt(dot.getAttribute('data-page'), 10);

      showPage(idx);

    });

  });



  if (closeBtn) {

    closeBtn.addEventListener('click', function () {

      selector.style.display = 'none';

    });

  }



  // Ouvrir le sélecteur quand on clique sur une app dans la vitrine

  document.querySelectorAll('.app-ring-button').forEach(function (btn) {

    btn.addEventListener('click', function (e) {

      e.preventDefault();

      e.stopPropagation();

      var pageIndex = btn.getAttribute('data-page');

      if (pageIndex !== null && pageIndex !== undefined) {

        showPage(parseInt(pageIndex, 10));

        selector.style.display = 'flex';

      } else {

        // Fallback : ouvrir directement l'URL

        var url = btn.getAttribute('data-url');

        if (url && url !== '#') {

          window.location.href = url;

        }

      }

    });

  });

})();



/* Fonction globale pour ouvrir une app */

window.openApp = function (url) {

  if (!url || url === '#') {

    alert('Cette application sera disponible bientôt.');

    return;

  }

  window.location.href = url;

};

