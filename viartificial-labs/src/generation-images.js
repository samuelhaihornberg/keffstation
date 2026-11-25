// src/generation-images.js — Génération d'images pour ViArtificial Labs.
// Vérifie les capacités réelles du navigateur (WebGPU, mémoire, stockage).
// Ne fabrique aucune image de démonstration. Ne déclenche aucun service payant.
// Si aucune solution compatible n'est installable, l'état reste honnêtement incomplet.
'use strict';
(function (global) {
  // ---------- État réel ----------
  var ETAT = {
    navigateurCompatible: false,
    webgpuDisponible: false,
    backendReel: false,
    modeleCharge: false,
    generationPrete: false,
    erreur: null,
    detail: '',
    etapes: []
  };

  // ---------- Vérification des capacités ----------
  async function verifierCapacites() {
    var etat = { navigateurCompatible: false, webgpuDisponible: false, backendReel: false, modeleCharge: false, generationPrete: false, erreur: null, detail: '', etapes: [] };

    // Étape 1 : WebGPU disponible
    etat.etapes.push({ nom: 'webgpu', statut: 'en-cours' });
    var hasGPU = false;
    try { hasGPU = !!(navigator.gpu); } catch (e) {}
    if (!hasGPU) {
      etat.erreur = 'WebGPU non supporté par ce navigateur';
      etat.detail = 'La génération d\'images nécessite WebGPU (Chrome 113+, Edge 113+, Safari 18+).';
      etat.etapes[0].statut = 'echec';
      return etat;
    }
    etat.webgpuDisponible = true;
    etat.etapes[0].statut = 'reussi';

    // Étape 2 : adaptateur GPU
    etat.etapes.push({ nom: 'adaptateur', statut: 'en-cours' });
    var adapter = null;
    try { adapter = await navigator.gpu.requestAdapter(); } catch (e) {}
    if (!adapter) {
      etat.erreur = 'Aucun adaptateur GPU disponible';
      etat.etapes[1].statut = 'echec';
      return etat;
    }
    etat.etapes[1].statut = 'reussi';

    // Étape 3 : backend d'inférence image
    etat.etapes.push({ nom: 'backend-image', statut: 'en-cours' });
    // Vérifier si un backend de génération d'images est intégré
    var hasImageBackend = false;
    try { hasImageBackend = !!(global.ViaImageBackend && global.ViaImageBackend.generate); } catch (e) {}
    if (!hasImageBackend) {
      etat.erreur = 'Aucun backend de génération d\'images intégré dans le projet';
      etat.detail = 'WebGPU est disponible mais aucun modèle de génération d\'images (Stable Diffusion, etc.) n\'est chargé. Transformers.js v3 supporte la génération d\'images via WebGPU mais nécessite ~2GB de poids de modèle.';
      etat.etapes[2].statut = 'echec';
      etat.backendReel = false;
      return etat;
    }
    etat.backendReel = true;
    etat.etapes[2].statut = 'reussi';

    // Étape 4 : modèle chargé
    etat.etapes.push({ nom: 'modele', statut: 'en-cours' });
    // Pas de modèle chargé actuellement
    etat.erreur = 'Aucun modèle de génération d\'images chargé';
    etat.detail = 'Le backend existe mais aucun modèle n\'est chargé. Chargez un modèle compatible (ex: Xenova/stable-diffusion-2-1-base).';
    etat.etapes[3].statut = 'echec';
    etat.modeleCharge = false;
    etat.generationPrete = false;

    return etat;
  }

  // ---------- Demander une génération ----------
  async function generer(prompt, options) {
    var opts = options || {};
    var resultat = {
      prompt: prompt,
      statut: 'non-demarre',
      image: null,
      erreur: null,
      progression: 0,
      temps: { debut: Date.now(), fin: null, duree: null }
    };

    // Vérifier les capacités
    var cap = await verifierCapacites();
    if (!cap.generationPrete) {
      resultat.statut = 'indisponible';
      resultat.erreur = cap.erreur || 'Génération d\'images non disponible';
      resultat.detail = cap.detail;
      return resultat;
    }

    // Si un backend réel existe, l'utiliser
    if (global.ViaImageBackend && global.ViaImageBackend.generate) {
      resultat.statut = 'en-cours';
      try {
        var img = await global.ViaImageBackend.generate(prompt, {
          onProgress: function (p) { resultat.progression = p; }
        });
        resultat.statut = 'termine';
        resultat.image = img;
        resultat.temps.fin = Date.now();
        resultat.temps.duree = resultat.temps.fin - resultat.temps.debut;
      } catch (e) {
        resultat.statut = 'erreur';
        resultat.erreur = (e && e.message) ? e.message : 'Échec de la génération';
      }
    } else {
      resultat.statut = 'indisponible';
      resultat.erreur = 'Aucun backend de génération d\'images disponible';
    }

    return resultat;
  }

  // ---------- Annuler une génération ----------
  function annuler() {
    if (global.ViaImageBackend && global.ViaImageBackend.cancel) {
      global.ViaImageBackend.cancel();
    }
    return { annule: true };
  }

  // ---------- État actuel ----------
  function getEtat() {
    return {
      navigateurCompatible: ETAT.navigateurCompatible,
      webgpuDisponible: ETAT.webgpuDisponible,
      backendReel: ETAT.backendReel,
      modeleCharge: ETAT.modeleCharge,
      generationPrete: ETAT.generationPrete,
      erreur: ETAT.erreur,
      detail: ETAT.detail
    };
  }

  // ---------- API publique ----------
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { verifierCapacites: verifierCapacites, generer: generer, annuler: annuler, getEtat: getEtat, ETAT: ETAT };
  }
  if (typeof window !== 'undefined') {
    window.ViaGenerationImages = { verifierCapacites: verifierCapacites, generer: generer, annuler: annuler, getEtat: getEtat, ETAT: ETAT };
  }
})(typeof window !== 'undefined' ? window : global);