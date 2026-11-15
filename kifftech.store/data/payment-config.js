/* Configuration front du backend paiement (GitHub Pages).
   Option A — Supabase Edge Functions (recommandé ici) :
     - SUPABASE_FUNCTIONS_BASE_URL : URL de base des fonctions, ex. "https://<PROJECT_REF>.supabase.co/functions/v1" (sans slash final)
     - SUPABASE_PUBLISHABLE_KEY    : clé publique/publishable (anon) du projet si requise pour invoquer les fonctions (jamais service_role)
     Fonctions attendues : /paypal-config, /paypal-create-order, /paypal-capture-order

   Option B — Backend custom (Cloudflare/Node) :
     - PAYMENT_API_BASE : ex. "https://<projet>.pages.dev" ou "" pour same-origin (./api/paypal/*)

   Ne jamais mettre de secret ici. */
export const SUPABASE_FUNCTIONS_BASE_URL = '';
export const SUPABASE_PUBLISHABLE_KEY = '';
export const PAYMENT_API_BASE = '';
