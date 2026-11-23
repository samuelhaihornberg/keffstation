// src/diagnostic-via.js — Écran de diagnostic lisible pour ViArtificial Labs.
// Distingue configuration, consentement, préchargement, moteur prêt, dispatch exécuté,
// contribution reçue, parcelle transmise, KEF et migration.
'use strict';
(function (global) {
  function creerDiagnostic() {
    var diag = {
      configuration: { etat: 'inconnu', detail: '' },
      consentementCookies: { etat: 'inconnu', detail: '' },
      consentementModele: { etat: 'inconnu', detail: '' },
      prechargement: { etat: 'inconnu', detail: '', modules: 0 },
      moteurPret: { etat: 'inconnu', detail: '' },
      dispatchExecute: { etat: 'inconnu', detail: '' },
      contributionRecue: { etat: 'inconnu', detail: '' },
      parcelleTransmise: { etat: 'inconnu', detail: '' },
      kef: { etat: 'inconnu', detail: '' },
      migration: { etat: 'inconnu', detail: '' },
      webgpu: { etat: 'indisponible', detail: 'Aucun backend réel' }
    };

    // Configuration
    try {
      var cfg = global.ViaProviders ? global.ViaProviders.load() : null;
      if (cfg) {
        diag.configuration.etat = 'configure';
        diag.configuration.detail = 'provider: ' + cfg.provider + ', baseUrl: ' + (cfg.baseUrl || 'aucun');
      } else {
        diag.configuration.etat = 'non-configure';
        diag.configuration.detail = 'ViaProviders non disponible';
      }
    } catch (e) {
      diag.configuration.etat = 'erreur';
      diag.configuration.detail = e.message;
    }

    // Consentement cookies
    try {
      var cc = global.ViaLocalEngine ? global.ViaLocalEngine.getCookiesConsent() : null;
      diag.consentementCookies.etat = cc === 'granted' ? 'accorde' : (cc === 'withdrawn' ? 'retire' : 'non-demande');
      diag.consentementCookies.detail = cc || 'null';
    } catch (e) {
      diag.consentementCookies.etat = 'erreur';
      diag.consentementCookies.detail = e.message;
    }

    // Consentement modèle
    try {
      var mc = global.ViaLocalEngine ? global.ViaLocalEngine.getModelConsent() : null;
      diag.consentementModele.etat = mc === 'granted' ? 'accorde' : (mc === 'withdrawn' ? 'retire' : 'non-demande');
      diag.consentementModele.detail = mc || 'null';
    } catch (e) {
      diag.consentementModele.etat = 'erreur';
      diag.consentementModele.detail = e.message;
    }

    // Préchargement
    try {
      var pe = global.__viaPreloadEtat;
      if (pe) {
        diag.prechargement.etat = pe.termine ? 'termine' : 'en-cours';
        diag.prechargement.detail = pe.charge + ' modules charges' + (pe.erreur ? ' (erreur: ' + pe.erreur + ')' : '');
        diag.prechargement.modules = pe.charge || 0;
      } else {
        diag.prechargement.etat = 'non-demarre';
        diag.prechargement.detail = 'préchargement non lancé';
      }
    } catch (e) {
      diag.prechargement.etat = 'erreur';
      diag.prechargement.detail = e.message;
    }

    // Moteur prêt
    try {
      var sm = global.ViaLocalEngine ? global.ViaLocalEngine.summary() : null;
      if (sm) {
        diag.moteurPret.etat = (sm.phase === 'ready' || sm.phase === 'generating') ? 'pret' : sm.phase;
        diag.moteurPret.detail = 'phase: ' + sm.phase + ', modèle: ' + (sm.model || 'aucun');
      } else {
        diag.moteurPret.etat = 'non-disponible';
        diag.moteurPret.detail = 'ViaLocalEngine non disponible';
      }
    } catch (e) {
      diag.moteurPret.etat = 'erreur';
      diag.moteurPret.detail = e.message;
    }

    // Dispatch exécuté
    try {
      var lastDispatch = global.__viaDernierDispatch;
      if (lastDispatch) {
        diag.dispatchExecute.etat = lastDispatch.statut || 'inconnu';
        diag.dispatchExecute.detail = 'moteur: ' + (lastDispatch.moteurReel || 'aucun') + ', durée: ' + (lastDispatch.temps ? lastDispatch.temps.duree + 'ms' : 'N/A');
      } else {
        diag.dispatchExecute.etat = 'non-execute';
        diag.dispatchExecute.detail = 'aucun dispatch effectué';
      }
    } catch (e) {
      diag.dispatchExecute.etat = 'erreur';
      diag.dispatchExecute.detail = e.message;
    }

    // Contribution reçue
    try {
      var lastCompte = global.__viaDernierCompte;
      if (lastCompte) {
        diag.contributionRecue.etat = lastCompte.repondus > 0 ? 'recue' : 'aucune';
        diag.contributionRecue.detail = lastCompte.repondus + ' répondus / ' + lastCompte.sollicites + ' sollicités';
      } else {
        diag.contributionRecue.etat = 'non-disponible';
        diag.contributionRecue.detail = 'aucun compte enregistré';
      }
    } catch (e) {
      diag.contributionRecue.etat = 'erreur';
      diag.contributionRecue.detail = e.message;
    }

    // Parcelle transmise
    try {
      if (global.ViaParcelles) {
        var parcelles = global.ViaParcelles.listerParcelles ? global.ViaParcelles.listerParcelles() : [];
        var circulantes = parcelles.filter(function (p) { return p.etat === 'circulante'; });
        var envoyees = parcelles.filter(function (p) { return p.etat === 'envoyee-reception-en-attente'; });
        var nonTransmises = parcelles.filter(function (p) { return p.etat === 'creee-mais-non-transmise'; });
        if (circulantes.length > 0) {
          diag.parcelleTransmise.etat = 'transmise';
          diag.parcelleTransmise.detail = circulantes.length + ' circulantes, ' + envoyees.length + ' envoyées (attente), ' + nonTransmises.length + ' non transmises';
        } else if (envoyees.length > 0) {
          diag.parcelleTransmise.etat = 'envoyee';
          diag.parcelleTransmise.detail = envoyees.length + ' envoyées (réception en attente), ' + nonTransmises.length + ' non transmises';
        } else if (parcelles.length > 0) {
          diag.parcelleTransmise.etat = 'creee';
          diag.parcelleTransmise.detail = parcelles.length + ' créées, 0 transmises';
        } else {
          diag.parcelleTransmise.etat = 'aucune';
          diag.parcelleTransmise.detail = 'aucune parcelle créée';
        }
      } else {
        diag.parcelleTransmise.etat = 'non-disponible';
        diag.parcelleTransmise.detail = 'ViaParcelles non disponible';
      }
    } catch (e) {
      diag.parcelleTransmise.etat = 'erreur';
      diag.parcelleTransmise.detail = e.message;
    }

    // KEF
    try {
      var kefHist = global.ViaKEF ? global.ViaKEF.historique('global', 'global') : [];
      diag.kef.etat = kefHist.length > 0 ? 'calcule' : 'non-calcule';
      diag.kef.detail = kefHist.length + ' relevés enregistrés';
    } catch (e) {
      diag.kef.etat = 'erreur';
      diag.kef.detail = e.message;
    }

    // Migration
    try {
      if (global.ViaImporteurConnexions) {
        var impEtat = global.ViaImporteurConnexions.getEtat();
        diag.migration.etat = impEtat.etat;
        diag.migration.detail = impEtat.motif;
      } else {
        diag.migration.etat = 'non-disponible';
        diag.migration.detail = 'importeur non chargé';
      }
    } catch (e) {
      diag.migration.etat = 'erreur';
      diag.migration.detail = e.message;
    }

    return diag;
  }

  function afficherDiagnostic(container) {
    var diag = creerDiagnostic();
    var el = container || document.getElementById('diagDetail') || document.body;
    var html = '<div class="via-diagnostic" style="font-size:0.8rem;padding:12px;background:rgba(0,0,0,.3);border-radius:8px;margin:8px 0;">';
    html += '<h4 style="color:#b84dff;margin:0 0 8px;">Diagnostic ViArtificial Labs</h4>';
    var labels = {
      configuration: 'Configuration', consentementCookies: 'Consentement cookies',
      consentementModele: 'Consentement modèle', prechargement: 'Préchargement',
      moteurPret: 'Moteur prêt', dispatchExecute: 'Dispatch exécuté',
      contributionRecue: 'Contribution reçue', parcelleTransmise: 'Parcelle transmise',
      kef: 'KEF', migration: 'Migration 677', webgpu: 'WebGPU'
    };
    for (var key in diag) {
      var d = diag[key];
      var color = (d.etat === 'accorde' || d.etat === 'termine' || d.etat === 'pret' || d.etat === 'transmise' || d.etat === 'recue' || d.etat === 'calcule') ? '#27d17f' :
        (d.etat === 'indisponible' || d.etat === 'bloque' || d.etat === 'BLOQUE') ? '#ff4d6d' :
        (d.etat === 'erreur') ? '#ff4d6d' : '#ffd23f';
      html += '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.1);">';
      html += '<span style="color:#e0e0e0;">' + (labels[key] || key) + '</span>';
      html += '<span style="color:' + color + ';font-weight:600;">' + d.etat + '</span>';
      html += '</div>';
      if (d.detail) html += '<div style="font-size:0.7rem;color:#8f96bd;padding:2px 0 4px 8px;">' + d.detail + '</div>';
    }
    html += '</div>';
    el.innerHTML = html + (el.innerHTML || '');
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { creerDiagnostic: creerDiagnostic, afficherDiagnostic: afficherDiagnostic };
  }
  if (typeof window !== 'undefined') {
    window.ViaDiagnostic = { creerDiagnostic: creerDiagnostic, afficherDiagnostic: afficherDiagnostic };
  }
})(typeof window !== 'undefined' ? window : global);