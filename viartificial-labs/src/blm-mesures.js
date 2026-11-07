// src/blm-mesures.js — 110 COU-MESURES : mesures réellement disponibles.
// Pur, sans réseau. Référentiel documenté exécuté en porte S4 : déclare ce que
// le système mesure VRAIMENT, et INTERDIT le reste (tokens/s, FPS/IPS, GPU,
// CPU% : aucun capteur ni chronométrage dans le projet ; WebGPU non utilisé).
// Source des disponibles : local-engine.js detect(), blm-couts.js, journal.
'use strict';
var MESURES_INDISPONIBLES = ['tokens/s', 'FPS/IPS', 'GPU', 'CPU%'];
function mesuresReelles() {
  var nav = (typeof navigator !== 'undefined') ? navigator : {};
  var dispo = { deviceMemoryGo: (nav.deviceMemory || null), threads: null, backend: 'wasm-cpu (déclaré local-engine, non remesuré ici)', tokensEstimes: 'heuristique ~4 car/token (005, non validée)' };
  try {
    if (typeof crossOriginIsolated !== 'undefined' && crossOriginIsolated && typeof SharedArrayBuffer !== 'undefined') dispo.threads = 'multithread-possible';
    else dispo.threads = 'monothread';
  } catch (e) { dispo.threads = 'inconnu'; }
  return { disponibles: dispo, indisponibles: MESURES_INDISPONIBLES.slice(), sources: ['local-engine.js', 'blm-couts.js', 'blm-journal.js'] };
}
module.exports = { mesuresReelles: mesuresReelles, INDISPONIBLES: MESURES_INDISPONIBLES };
