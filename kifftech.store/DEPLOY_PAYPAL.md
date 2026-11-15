# KiffTech — Paiement PayPal (ponctuel) : état et déploiement

> **Cible actuelle (demandée)** : **Supabase Edge Functions** (`kifftech.store/supabase/functions/`) en gardant **GitHub Pages** comme vitrine. **Aucune configuration Cloudflare, aucune modification DNS.** Voir **`DEPLOY_SUPABASE_BACKEND.md`** (étapes exactes, sans inventer de Project URL/Ref).

## Implémentation (ce dépôt, `kifftech.store/`)
- **Frontend** : SDK PayPal officiel (`buttons,card-fields`), achat **ponctuel** (`intent=capture`). Config dans `data/payment-config.js` :
  - `SUPABASE_FUNCTIONS_BASE_URL` + `SUPABASE_PUBLISHABLE_KEY` (publique uniquement, si requise) pour appeler `/paypal-config`, `/paypal-create-order`, `/paypal-capture-order`.
  - (Alternative) `PAYMENT_API_BASE` pour backend custom. Le navigateur reçoit uniquement la config publique ; **aucun `PAYPAL_CLIENT_SECRET`, aucune clé `service_role`, aucune donnée carte** collectée/stockée/exposée côté front.
- **Carte** : composants PayPal officiels uniquement si autorisé/éligible (`isEligible()` avant champs avancés). **Aucune collecte directe de numéros de carte**.
- **Supabase Edge Functions** : `supabase/functions/paypal-config|paypal-create-order|paypal-capture-order` + `_shared/` (helpers, `payment-core.js`, `catalogue.js`). CORS limité à `PUBLIC_SITE_ORIGIN`.
- **Montants/validation** : **recalculés côté serveur** depuis le catalogue de référence (articles, variantes, devise, livraison, taxes, total) — jamais confiance au navigateur. Commande considérée payée uniquement après **capture confirmée serveur `COMPLETED`**.
- **0 € livraison/taxes** : autorisés si **configurés et justifiés** (état catalogue actuel) ; sinon non définis → paiement désactivé.
- **Aucun achat réel** effectué.

## Variables/secrets (Supabase, jamais dans Git/front/logs/chat)
À définir dans **Supabase Dashboard → Edge Functions → Secrets** (voir `.env.example` fictif dans `supabase/functions/.env.example`) :
- `PAYPAL_CLIENT_ID` — identifiant (Live en production).
- `PAYPAL_CLIENT_SECRET` — **secret serveur uniquement**.
- `PAYPAL_API_BASE` — `https://api-m.paypal.com` (Live) ou `https://api-m.sandbox.paypal.com` (Sandbox).
- `PUBLIC_SITE_ORIGIN` — origine exacte du site publié (CORS).

Front (public, dans `data/payment-config.js`) : `SUPABASE_FUNCTIONS_BASE_URL`, `SUPABASE_PUBLISHABLE_KEY` (publishable/anon uniquement, optionnelle). **Jamais `service_role`.**

## État Sandbox vs Live
- **Sandbox** : supporté si déployé avec secrets Sandbox + `PAYPAL_API_BASE` Sandbox — **non vérifié ici**.
- **Live** : supporté (`https://api-m.paypal.com` + secrets Live) — **non opérationnel ; ne pas déclarer opérationnel** avant déploiement des fonctions sur votre projet Supabase, saisie des secrets Live, configuration front (URL/ref réels, sans invention) et vérification des endpoints/éligibilité. **Non confirmé.**
