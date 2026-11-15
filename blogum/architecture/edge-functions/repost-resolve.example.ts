// GABARIT Supabase Edge Function (Deno) — résolution de repost sans duplication média
// Retourne la publication originale si accessible/active, sinon "publication non disponible".

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  try {
    // Entrée: repost_id (ou original_post_id + contexte)
    // 1) Authentifier l'appelant et vérifier l'environnement/âge
    // 2) Charger le repost (original_post_id, reposter_user_id, target_space_id)
    // 3) Vérifier que l'appelant a accès au contexte du repost (espace cible/autorisation)
    // 4) Tenter de charger l'original via règles d'accès (RLS côté user ou contrôle serveur)
    //    - si original absent, status != active, supprimé ou accès retiré => indisponible
    // 5) Ne jamais dupliquer/copier le fichier média ; ne renvoyer qu'une référence/résolution autorisée
    //    (l'accès média effectif passe par media-access / URL temporaire après contrôle)

    return new Response(JSON.stringify({
      ok: false,
      error: "TEMPLATE_NOT_CONFIGURED",
      note: "Implémenter résolution: original accessible => données/référence ; sinon { unavailable: true, reason: 'publication_non_disponible' }."
    }), { status: 501, headers: { "content-type": "application/json" } });
  } catch (_e) {
    return new Response(JSON.stringify({ ok: false, error: "SERVER_ERROR" }), { status: 500, headers: { "content-type": "application/json" } });
  }
});
