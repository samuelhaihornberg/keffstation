// src/webgpu-detection.js — Détection réelle WebGPU pour ViArtificial Labs.
// Détecte l'adaptateur et le périphérique GPU réels.
// Ne déclare WebGPU actif que si l'initialisation et le chargement d'un modèle compatible aboutissent.
// Aucun backend d'inférence WebGPU n'est actuellement intégré dans le projet.
'use strict';
(function (global) {
  var ETATS = {
    navigateurCompatible: false,
    gpuInitialise: false,
    modeleCharge: false,
    inferencePrete: false,
    erreur: null,
    detail: ''
  };

  // ---------- Détection étape par étape ----------
  async function detecter() {
    var etat = {
      navigateurCompatible: false,
      gpuInitialise: false,
      modeleCharge: false,
      inferencePrete: false,
      erreur: null,
      detail: '',
      etapes: []
    };

    // Étape 1 : vérifier navigator.gpu
    etat.etapes.push({ nom: 'navigateur', statut: 'en-cours' });
    if (!navigator.gpu) {
      etat.erreur = 'navigator.gpu non disponible dans ce navigateur';
      etat.detail = 'Le navigateur ne supporte pas WebGPU (Chrome 113+, Edge 113+, Safari 18+).';
      etat.etapes[0].statut = 'echec';
      return etat;
    }
    etat.navigateurCompatible = true;
    etat.etapes[0].statut = 'reussi';

    // Étape 2 : demander un adaptateur
    etat.etapes.push({ nom: 'adaptateur', statut: 'en-cours' });
    var adapter = null;
    try {
      adapter = await navigator.gpu.requestAdapter();
    } catch (e) {
      etat.erreur = 'Erreur lors de la demande d\'adaptateur: ' + (e && e.message ? e.message : e);
      etat.etapes[1].statut = 'echec';
      return etat;
    }
    if (!adapter) {
      etat.erreur = 'Aucun adaptateur GPU disponible';
      etat.detail = 'Le navigateur supporte WebGPU mais aucun GPU compatible n\'a été trouvé.';
      etat.etapes[1].statut = 'echec';
      return etat;
    }
    etat.etapes[1].statut = 'reussi';
    etat.etapes[1].detail = adapter.info ? (adapter.info.vendor + ' ' + adapter.info.device) : 'adaptateur trouvé';

    // Étape 3 : demander un périphérique
    etat.etapes.push({ nom: 'peripherique', statut: 'en-cours' });
    var device = null;
    try {
      device = await adapter.requestDevice();
    } catch (e) {
      etat.erreur = 'Erreur lors de la demande de périphérique: ' + (e && e.message ? e.message : e);
      etat.etapes[2].statut = 'echec';
      return etat;
    }
    if (!device) {
      etat.erreur = 'Impossible d\'obtenir un périphérique GPU';
      etat.etapes[2].statut = 'echec';
      return etat;
    }
    etat.gpuInitialise = true;
    etat.etapes[2].statut = 'reussi';

    // Étape 4 : vérifier si un backend d'inférence WebGPU est disponible
    etat.etapes.push({ nom: 'backend-inference', statut: 'en-cours' });
    var hasBackend = false;
    try { hasBackend = !!(global.ViaWebGPUBackend && global.ViaWebGPUBackend.execute); } catch (e) {}
    if (!hasBackend) {
      etat.erreur = 'Aucun backend d\'inférence WebGPU intégré dans le projet';
      etat.detail = 'Le GPU est initialisé mais aucun modèle WebGPU (WebLLM, Transformers.js WebGPU) n\'est chargé. Aucune inférence ne peut être exécutée.';
      etat.etapes[3].statut = 'echec';
      // Ne pas marquer comme prêt
      etat.modeleCharge = false;
      etat.inferencePrete = false;
      return etat;
    }
    etat.etapes[3].statut = 'reussi';

    // Étape 5 : charger un modèle (si backend disponible)
    etat.etapes.push({ nom: 'modele', statut: 'en-cours' });
    // Pas de modèle WebGPU chargé actuellement
    etat.erreur = 'Aucun modèle WebGPU chargé';
    etat.detail = 'Le backend existe mais aucun modèle n\'est chargé. Chargez un modèle compatible WebGPU.';
    etat.etapes[4].statut = 'echec';
    etat.modeleCharge = false;
    etat.inferencePrete = false;

    return etat;
  }

  // ---------- État actuel ----------
  function getEtat() {
    return {
      navigateurCompatible: ETATS.navigateurCompatible,
      gpuInitialise: ETATS.gpuInitialise,
      modeleCharge: ETATS.modeleCharge,
      inferencePrete: ETATS.inferencePrete,
      erreur: ETATS.erreur,
      detail: ETATS.detail
    };
  }

  // ---------- API publique ----------
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { detecter: detecter, getEtat: getEtat, ETATS: ETATS };
  }
  if (typeof window !== 'undefined') {
    window.ViaWebGPUDetection = { detecter: detecter, getEtat: getEtat, ETATS: ETATS };
  }
})(typeof window !== 'undefined' ? window : global);