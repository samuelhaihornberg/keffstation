// GABARIT Supabase Edge Function (Deno) — accès média contrôlé / URL temporaire
// À déployer dans l'environnement isolé approprié. NE PAS inclure de secrets en dur.
// Secrets serveur (ex. service_role) doivent être configurés dans l'environnement serveur/Edge Functions.
// "kiffstationkey" (GitHub secret, inconnu) : ne pas utiliser ici sauf si sa nature/usage serveur est confirmé sans exposition.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    // 1) Authentifier l'appelant (JWT/session de l'env isolé)
    // 2) Valider les paramètres (post_id / media_id)
    // 3) Vérifier autorisation serveur/BD : âge/env, espace, membership, statut du post (actif), droits lecture
    // 4) Résoudre le chemin de stockage PRIVÉ (jamais URL publique permanente)
    // 5) Générer une autorisation/URL signée TEMPORAIRE, limitée à l'utilisateur et à la durée nécessaire à la lecture
    // 6) Journaliser minimalement si requis (sans données sensibles)

    // PSEUDO-LOGIQUE (à implémenter avec client admin côté serveur uniquement) :
    // - const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    // - vérifier accès sur posts/space_memberships/age_verifications
    // - const { data } = await supabaseAdmin.storage.from('private-bucket').createSignedUrl(path, EXPIRES_IN_SECONDS)
    // - retourner { url: data.signedUrl, expiresIn }

    return new Response(JSON.stringify({
      ok: false,
      error: "TEMPLATE_NOT_CONFIGURED",
      note: "Implémenter vérification d’accès + URL signée temporaire. Aucun média public permanent."
    }), { status: 501, headers: { "content-type": "application/json" } });
  } catch (_e) {
    return new Response(JSON.stringify({ ok: false, error: "SERVER_ERROR" }), { status: 500, headers: { "content-type": "application/json" } });
  }
});
