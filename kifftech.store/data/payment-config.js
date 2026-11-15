/* Configuration publique du front (GitHub Pages). Aucun secret ici.
   - SUPABASE_FUNCTIONS_BASE_URL : URL des Edge Functions du projet Supabase
     (Project URL + "/functions/v1"). Les fonctions : paypal-config, paypal-create-order, paypal-capture-order.
   - SUPABASE_PUBLISHABLE_KEY : clé publishable (publique) envoyée en en-tête "apikey" si nécessaire.
     Ne jamais y mettre la clé secrète / service_role. */
export const SUPABASE_FUNCTIONS_BASE_URL = 'https://spkaxtmhefhycqnshybo.supabase.co/functions/v1';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_hxW67QrCb_UX-jj6tWm8ew_WhCHxciB';
