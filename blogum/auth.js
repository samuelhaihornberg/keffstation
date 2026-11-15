(function () {
  'use strict';

  function getConfig() {
    const c = window.BLOGUM_CONFIG || {};
    return {
      supabaseUrl: (c.supabaseUrl || '').trim(),
      supabasePublishableKey: (c.supabasePublishableKey || '').trim(),
      env: (c.env || '').trim(),
      ageVerificationProvider: c.ageVerificationProvider || { configured: false }
    };
  }

  function isSupabaseConfigured() {
    const c = getConfig();
    return !!(c.supabaseUrl && c.supabasePublishableKey);
  }

  async function ensureClient() {
    const cfg = getConfig();
    if (!isSupabaseConfigured()) {
      return { client: null, configured: false, reason: 'missing_public_config' };
    }
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      if (!window.__blogumSupabaseClient) {
        window.__blogumSupabaseClient = window.supabase.createClient(cfg.supabaseUrl, cfg.supabasePublishableKey, {
          auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
        });
      }
      return { client: window.__blogumSupabaseClient, configured: true };
    }
    return { client: null, configured: false, reason: 'sdk_unavailable' };
  }

  function notConfiguredResult() {
    return {
      ok: false,
      configured: false,
      code: 'auth_not_configured',
      message: "Connexion réelle non configurée : paramètres publics Supabase/Auth manquants ou client indisponible. Aucune opération n'a été envoyée au serveur."
    };
  }

  function sanitizeError(err) {
    const msg = (err && (err.message || err.error_description || err.error)) || 'Une erreur est survenue.';
    // messages compréhensibles sans fuite sensible
    return String(msg);
  }

  const BlogumAuth = {
    isConfigured: isSupabaseConfigured,
    getConfig,

    async getSession() {
      const { client, configured } = await ensureClient();
      if (!configured || !client) return { session: null, configured: false };
      try {
        const { data, error } = await client.auth.getSession();
        if (error) return { session: null, configured: true, error: sanitizeError(error) };
        return { session: data.session || null, configured: true };
      } catch (e) {
        return { session: null, configured: true, error: sanitizeError(e) };
      }
    },

    async signUp({ email, password, pseudo, birthDate, acceptedTerms }) {
      // Préparation parcours âge : la date de naissance est collectée pour le flux de vérification futur,
      // mais le routage/environnement DOIT être déterminé par un résultat de vérification confirmé côté serveur.
      // Aucun accès/activation tant que la vérification n’est pas configurée/confirmée.
      const meta = {
        pseudo: (pseudo || '').trim(),
        birth_date: birthDate || null,
        terms_accepted: !!acceptedTerms,
        age_verification_status: 'pending_not_configured'
      };
      const { client, configured } = await ensureClient();
      if (!configured || !client) return notConfiguredResult();
      try {
        const { data, error } = await client.auth.signUp({
          email: (email || '').trim(),
          password,
          options: { data: meta }
        });
        if (error) return { ok: false, configured: true, message: sanitizeError(error) };
        // Ne pas prétendre au succès d’activation : confirmation e-mail / activation réelle dépend du serveur/projet
        return {
          ok: true,
          configured: true,
          needsEmailConfirmation: !data.session,
          user: data.user || null,
          session: data.session || null,
          message: data.session
            ? "Compte créé (session active) — activation soumise à la vérification d’âge confirmée côté serveur (non configurée)."
            : "Inscription envoyée. Vérifie ton adresse e-mail pour confirmer le compte. L’activation reste soumise à la vérification d’âge confirmée côté serveur (non configurée)."
        };
      } catch (e) {
        return { ok: false, configured: true, message: sanitizeError(e) };
      }
    },

    async signIn({ email, password }) {
      const { client, configured } = await ensureClient();
      if (!configured || !client) return notConfiguredResult();
      try {
        const { data, error } = await client.auth.signInWithPassword({ email: (email || '').trim(), password });
        if (error) return { ok: false, configured: true, message: sanitizeError(error) };
        return { ok: true, configured: true, session: data.session || null, user: data.user || null };
      } catch (e) {
        return { ok: false, configured: true, message: sanitizeError(e) };
      }
    },

    async signOut() {
      const { client, configured } = await ensureClient();
      if (!configured || !client) return notConfiguredResult();
      try {
        const { error } = await client.auth.signOut();
        if (error) return { ok: false, configured: true, message: sanitizeError(error) };
        return { ok: true, configured: true };
      } catch (e) {
        return { ok: false, configured: true, message: sanitizeError(e) };
      }
    },

    async resetPassword(email) {
      const { client, configured } = await ensureClient();
      if (!configured || !client) return notConfiguredResult();
      try {
        // Message de réinitialisation neutre (ne pas révéler si l’e-mail est inscrit)
        const redirectTo = window.location.origin + window.location.pathname;
        const { error } = await client.auth.resetPasswordForEmail((email || '').trim(), { redirectTo });
        if (error) {
          // ne pas divulguer l’existence du compte ; renvoyer un message neutre sauf erreur technique générique
          return { ok: true, configured: true, neutral: true, message: "Si un compte correspond à cette adresse, un e-mail de réinitialisation a été envoyé." };
        }
        return { ok: true, configured: true, neutral: true, message: "Si un compte correspond à cette adresse, un e-mail de réinitialisation a été envoyé." };
      } catch (e) {
        return { ok: true, configured: true, neutral: true, message: "Si un compte correspond à cette adresse, un e-mail de réinitialisation a été envoyé." };
      }
    }
  };

  window.BlogumAuth = BlogumAuth;
})();
