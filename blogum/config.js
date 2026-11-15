// Configuration publique Blogum (client). Aucune clé secrète / service_role / secret GitHub.
// Renseigner uniquement si un projet Supabase Auth est configuré pour CET environnement isolé
// et si des règles RLS strictes sont en place.
window.BLOGUM_CONFIG = {
  // Exemple (à configurer par l’admin pour l’environnement ciblé) :
  // supabaseUrl: "https://<project-ref>.supabase.co",
  // supabasePublishableKey: "<anon/publishable-key>",
  // env: "prod-21plus" | "prod-18-20" | "prod-under18",
  supabaseUrl: "",
  supabasePublishableKey: "",
  env: "",

  // URLs des politiques (à adapter quand publiées)
  termsUrl: "",
  privacyUrl: "",

  // Intégration future (fournisseur de vérification d’âge approuvé, côté serveur) — ne pas collecter/stocker de documents d’identité
  ageVerificationProvider: {
    configured: false,
    providerName: "",
    integrationNote: "Point d’intégration réservé : conserver uniquement le résultat minimal de vérification confirmé côté serveur (aucune image de carte d’identité, passeport ou permis)."
  }
};
