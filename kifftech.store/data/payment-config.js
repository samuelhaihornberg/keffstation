/* Configuration front du backend paiement.
   - Vide ("") : appels same-origin (./api/paypal/*) — adapté si le backend est servi sur la même origine que le front.
   - URL absolue (ex. "https://<projet>.pages.dev") : appelle un backend Cloudflare Pages distinct (GitHub Pages → Cloudflare).
   Ne jamais mettre de secret ici. */
export const PAYMENT_API_BASE = '';
