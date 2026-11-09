

(function () {

  var headerVideo = document.querySelector('.video-frame-media');

  if (!headerVideo) return;

  headerVideo.muted = true;

  headerVideo.defaultMuted = true;

  function tryPlay() {

    var p = headerVideo.play();

    if (p && typeof p.catch === 'function') p.catch(function () {});

  }

  tryPlay();

  headerVideo.addEventListener('canplay', tryPlay, { once: true });

  document.addEventListener('visibilitychange', function () {

    if (document.visibilityState === 'visible') tryPlay();

  });

  document.addEventListener('touchstart', tryPlay, { once: true, passive: true });

  document.addEventListener('click', tryPlay, { once: true });

})();



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

    'ViArtificial Labs — Articles',

    'cos Editor — Articles',

    'Linguistic Motors — Articles',

    'Critiques-Services — Articles',

    'KiffTech — Articles',

    'Tricktrocjob — Articles',

    'Videogames — Articles'

  ];



  // URLs des apps par page

  var pageAppUrls = [

    './viartificial-labs/',

    './cos-editor/',

    './linguistic-motors/',

    'https://samuelhaihornberg.github.io/critiques-services.com/',

    './kifftech/',

    './tricktrocjob/',

    './videogames/'

  ];



  // Noms des apps par page

  var pageAppNames = [

    'ViArtificial Labs',

    'cos Editor',

    'Linguistic Motors',

    'Critiques-Services',

    'KiffTech',

    'Tricktrocjob',

    'Videogames'

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

