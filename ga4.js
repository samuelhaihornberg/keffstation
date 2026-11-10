// =============================================================
// KeffStation — Google Analytics 4 (configuration)
// -------------------------------------------------------------
// Initialise dataLayer + gtag + la configuration GA4.
// Sans ce bloc, la bibliothèque gtag/js est chargée mais n'envoie
// RIEN : c'est gtag('config', …) qui déclenche les page_view.
//
// Le script est partagé par toutes les PWA du domaine (même propriété).
// Les événements métier (vues, durée, clics liens/boutons) sont envoyés
// par keff-stats.js ; les clics de navigation par analytics-events.js.
// =============================================================
(function () {
  'use strict';

  var MEASUREMENT_ID = 'G-WP6HC0CM9E';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, {
    anonymize_ip: true,
    send_page_view: true
  });
})();
