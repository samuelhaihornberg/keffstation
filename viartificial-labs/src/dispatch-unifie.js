// src/dispatch-unifie.js — Interface unique de dispatch vers les moteurs disponibles.
// Validation des entrées, sélection, exécution asynchrone, délai max, annulation,
// erreurs typées, résultat structuré avec provenance.
// Branche aux consommateurs existants (runItem, fenetres-discution).
'use strict';
(function (global) {
  var TIMEOUT_INTERNE = 60000; // 60s max (interne, jamais affiché)
  var TIMEOUT_DEFAUT = 15000; // 15s pour l'affichage

  // ---------- Types d'erreurs ----------
  var ERREURS = {
    ENTREE_INVALIDE: 'entree-invalide',
    MOTEUR_INDISPONIBLE: 'moteur-indisponible',
    TIMEOUT: 'timeout',
    ANNULE: 'annule',
    RESEAU: 'reseau',
    REPONSE_INVALIDE: 'reponse-invalide',
    AUCUN_MOTEUR: 'aucun-moteur'
  };

  // ---------- Vérification réelle des moteurs ----------
  function verifierMoteur(moteurId) {
    var resultat = { moteur: moteurId, disponible: false, pret: false, detail: '', erreur: null };
    if (moteurId === 'local') {
      try {
        if (!global.ViaLocalEngine || !global.ViaLocalEngine.summary) {
          resultat.erreur = 'ViaLocalEngine non disponible';
          return resultat;
        }
        var sm = global.ViaLocalEngine.summary();
        resultat.disponible = true;
        resultat.pret = sm.phase === 'ready' || sm.phase === 'generating';
        resultat.detail = 'phase: ' + sm.phase + ', modèle: ' + (sm.model || 'aucun');
        if (!resultat.pret) resultat.erreur = 'modèle non chargé (phase: ' + sm.phase + ')';
      } catch (e) {
        resultat.erreur = (e && e.message) ? e.message : 'erreur de vérification';
      }
    } else if (moteurId === 'ollama') {
      try {
        if (!global.ViaProviders || !global.ViaProviders.load) {
          resultat.erreur = 'ViaProviders non disponible';
          return resultat;
        }
        var cfg = global.ViaProviders.load();
        if (cfg.provider !== 'ollama') {
          resultat.erreur = 'fournisseur non configuré en ollama (actuel: ' + cfg.provider + ')';
          return resultat;
        }
        if (!cfg.baseUrl) {
          resultat.erreur = 'URL Ollama non configurée';
          return resultat;
        }
        resultat.disponible = true;
        resultat.pret = true;
        resultat.detail = 'endpoint: ' + cfg.baseUrl + ', modèle: ' + (cfg.model || 'défaut');
      } catch (e) {
        resultat.erreur = (e && e.message) ? e.message : 'erreur de vérification';
      }
    } else if (moteurId === 'custom') {
      try {
        if (!global.ViaProviders || !global.ViaProviders.load) {
          resultat.erreur = 'ViaProviders non disponible';
          return resultat;
        }
        var cfg2 = global.ViaProviders.load();
        if (cfg2.provider !== 'custom') {
          resultat.erreur = 'fournisseur non configuré en custom (actuel: ' + cfg2.provider + ')';
          return resultat;
        }
        if (!cfg2.baseUrl) {
          resultat.erreur = 'URL personnalisée non configurée';
          return resultat;
        }
        resultat.disponible = true;
        resultat.pret = true;
        resultat.detail = 'endpoint: ' + cfg2.baseUrl + ', modèle: ' + (cfg2.model || 'défaut');
      } catch (e) {
        resultat.erreur = (e && e.message) ? e.message : 'erreur de vérification';
      }
    } else if (moteurId === 'gpu') {
      // WebGPU : présence de navigator.gpu seule ne suffit pas
      var hasGPU = false;
      var hasBackend = false;
      try { hasGPU = !!(navigator.gpu); } catch (e) {}
      try { hasBackend = !!(global.ViaWebGPUBackend && global.ViaWebGPUBackend.execute); } catch (e) {}
      if (hasGPU && hasBackend) {
        resultat.disponible = true;
        resultat.pret = true;
        resultat.detail = 'WebGPU backend réel disponible';
      } else if (hasGPU && !hasBackend) {
        resultat.erreur = 'WebGPU détecté (navigator.gpu) mais aucun backend d\'inférence implémenté';
      } else {
        resultat.erreur = 'WebGPU non supporté par ce navigateur';
      }
    } else if (moteurId === 'repli') {
      resultat.disponible = true;
      resultat.pret = true;
      resultat.detail = 'repli textuel (pas un moteur LLM)';
    } else {
      resultat.erreur = 'moteur inconnu: ' + moteurId;
    }
    return resultat;
  }

  // ---------- Sélection du moteur ----------
  function selectionnerMoteur(preference, contexte) {
    var ctx = contexte || {};
    // Vérifier la préférence demandée
    if (preference) {
      var v = verifierMoteur(preference);
      if (v.disponible && v.pret) return preference;
    }
    // Essayer local d'abord
    var vLocal = verifierMoteur('local');
    if (vLocal.disponible && vLocal.pret) return 'local';
    // Essayer ollama
    var vOllama = verifierMoteur('ollama');
    if (vOllama.disponible && vOllama.pret) return 'ollama';
    // Essayer custom
    var vCustom = verifierMoteur('custom');
    if (vCustom.disponible && vCustom.pret) return 'custom';
    // WebGPU
    var vGPU = verifierMoteur('gpu');
    if (vGPU.disponible && vGPU.pret) return 'gpu';
    // Repli
    return 'repli';
  }

  // ---------- Dispatch unifié ----------
  function dispatcher(params) {
    var p = params || {};
    var taskId = p.taskId || ('task-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6));
    var moteurDemande = p.moteur || null;
    var bot = p.bot || null;
    var messages = p.messages || [];
    var signal = p.signal || null;
    var onToken = p.onToken || null;
    // Timeout selon le moteur : 15s pour les endpoints distants, 60s pour le local
    var timeoutDefaut = (moteurSelectionne === 'ollama' || moteurSelectionne === 'custom') ? 15000 : TIMEOUT_DEFAUT;
    var timeout = p.timeout || timeoutDefaut;

    // Valider les entrées
    if (!bot) return Promise.reject({ code: ERREURS.ENTREE_INVALIDE, message: 'bot manquant', taskId: taskId });
    if (!messages || !Array.isArray(messages) || messages.length === 0) return Promise.reject({ code: ERREURS.ENTREE_INVALIDE, message: 'messages manquants ou vides', taskId: taskId });

    var debut = Date.now();
    // Sélectionner le moteur
    var moteurSelectionne = moteurDemande || selectionnerMoteur(null, {});
    var verification = verifierMoteur(moteurSelectionne);

    // Si aucun moteur opérationnel
    if (!verification.disponible || !verification.pret) {
      // Vérifier s'il y a au moins un moteur disponible
      var moteursDisponibles = ['local', 'ollama', 'custom', 'gpu'].filter(function (m) { var v = verifierMoteur(m); return v.disponible && v.pret; });
      if (moteursDisponibles.length === 0) {
        return Promise.resolve({
          taskId: taskId,
          moteurDemande: moteurDemande,
          moteurReel: null,
          statut: 'indisponible',
          sortie: null,
          erreur: 'Aucun moteur opérationnel disponible. ' + verification.erreur,
          temps: { debut: debut, fin: Date.now(), duree: Date.now() - debut },
          provenance: 'dispatch-unifie'
        });
      }
      // Utiliser le premier moteur disponible
      moteurSelectionne = moteursDisponibles[0];
      verification = verifierMoteur(moteurSelectionne);
    }

    // Exécution asynchrone avec timeout et annulation
    return new Promise(function (resolve, reject) {
      var timeoutId = setTimeout(function () {
        // Ne pas marquer le moteur comme indisponible : état d'attente
        resolve({
          taskId: taskId,
          moteurDemande: moteurDemande,
          moteurReel: moteurSelectionne,
          statut: 'timeout',
          sortie: null,
          erreur: 'Moteur en chargement — délai dépassé',
          temps: { debut: debut, fin: Date.now(), duree: Date.now() - debut },
          provenance: 'dispatch-unifie',
          peutBooster: true
        });
      }, timeout);

      var annule = false;
      if (signal) {
        signal.addEventListener('abort', function () {
          annule = true;
          clearTimeout(timeoutId);
          resolve({
            taskId: taskId,
            moteurDemande: moteurDemande,
            moteurReel: moteurSelectionne,
            statut: 'annule',
            sortie: null,
            erreur: 'Annulé par l\'utilisateur',
            temps: { debut: debut, fin: Date.now(), duree: Date.now() - debut },
            provenance: 'dispatch-unifie'
          });
        });
      }

      // Exécuter le moteur
      var executePromise;
      if (moteurSelectionne === 'local') {
        executePromise = global.ViaLocalEngine.chat(bot, messages, { signal: signal, onToken: onToken });
      } else if (moteurSelectionne === 'ollama' || moteurSelectionne === 'custom') {
        // Vérifier l'endpoint avant d'envoyer
        if (global.ViaProviders && global.ViaProviders.ping) {
          var cfg = global.ViaProviders.load();
          executePromise = global.ViaProviders.ping(cfg, signal).then(function () {
            return global.ViaProviders.chat(cfg, bot, messages, signal, null, null);
          });
        } else {
          executePromise = Promise.reject({ code: ERREURS.RESEAU, message: 'ViaProviders.ping non disponible' });
        }
      } else if (moteurSelectionne === 'repli') {
        // Repli textuel : PAS une exécution LLM, clairement séparé
        executePromise = Promise.resolve('[repli] ' + (bot.name || 'bot') + ' : réponse de repli (pas de moteur LLM)');
      } else {
        executePromise = Promise.reject({ code: ERREURS.MOTEUR_INDISPONIBLE, message: 'moteur non supporté: ' + moteurSelectionne });
      }

      executePromise.then(function (resultat) {
        if (annule) return;
        clearTimeout(timeoutId);
        resolve({
          taskId: taskId,
          moteurDemande: moteurDemande,
          moteurReel: moteurSelectionne,
          statut: 'termine',
          sortie: resultat,
          erreur: null,
          temps: { debut: debut, fin: Date.now(), duree: Date.now() - debut },
          provenance: 'dispatch-unifie'
        });
      }).catch(function (err) {
        if (annule) return;
        clearTimeout(timeoutId);
        resolve({
          taskId: taskId,
          moteurDemande: moteurDemande,
          moteurReel: moteurSelectionne,
          statut: 'erreur',
          sortie: null,
          erreur: (err && err.message) ? err.message : String(err),
          code: (err && err.code) ? err.code : ERREURS.RESEAU,
          temps: { debut: debut, fin: Date.now(), duree: Date.now() - debut },
          provenance: 'dispatch-unifie'
        });
      });
    });
  }

  // ---------- Vérifier tous les moteurs ----------
  function verifierTousMoteurs() {
    var moteurs = ['local', 'ollama', 'custom', 'gpu', 'repli'];
    var resultats = {};
    moteurs.forEach(function (m) {
      resultats[m] = verifierMoteur(m);
    });
    return resultats;
  }

  // ---------- API publique ----------
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ERREURS: ERREURS, verifierMoteur: verifierMoteur, selectionnerMoteur: selectionnerMoteur, dispatcher: dispatcher, verifierTousMoteurs: verifierTousMoteurs };
  }
  if (typeof window !== 'undefined') {
    window.ViaDispatchUnifie = { ERREURS: ERREURS, verifierMoteur: verifierMoteur, selectionnerMoteur: selectionnerMoteur, dispatcher: dispatcher, verifierTousMoteurs: verifierTousMoteurs };
  }
})(typeof window !== 'undefined' ? window : global);