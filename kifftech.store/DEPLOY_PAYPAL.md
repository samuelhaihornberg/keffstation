# KiffTech — Paiement PayPal (ponctuel) : déploiement et état

> Voir aussi **`DEPLOY_CLOUDFLARE_BACKEND.md`** pour la préparation/déploiement du backend via **Cloudflare Pages Functions** (`kifftech.store/functions/`) en gardant **GitHub Pages** comme vitrine (URL `*.pages.dev` d’abord, sans modification DNS).

## Implémentation (ce dépôt, `kifftech.store/`)
- **Frontend** : SDK PayPal officiel (`buttons,card-fields`), achat **ponctuel** (`intent=capture`), présentation KiffTech. Backend configurable via `data/payment-config.js` (`PAYMENT_API_BASE` vide = same-origin, ou URL absolue du backend Cloudflare). Le navigateur reçoit uniquement la config publique (`clientId`, devise, environnement). **Aucun `PAYPAL_CLIENT_SECRET`, aucun numéro de carte, aucune donnée sensible de paiement** n’est collecté/stocké/exposé côté front.
- **Compte PayPal / carte** : carte via composants PayPal officiels **selon autorisation/éligibilité** (`isEligible()` vérifié avant champs avancés). Pas de formulaire maison de carte.
- **Backend** (GitHub Pages ne peut pas sécuriser le secret) : `/api/paypal/config`, `/api/paypal/create-order`, `/api/paypal/capture-order` implémentés dans :
  - `functions/api/paypal/*` (Cloudflare Pages Functions / Workers) — **cible recommandée** pour un backend séparé du site GitHub Pages
  - `server.js` (Node)
- **CORS (backend séparé)** : autorisé uniquement pour l’origine exacte `PUBLIC_SITE_ORIGIN` (env non secrète). Préflight OPTIONS géré.
- **Montants** : recalculés côté serveur à partir du catalogue vérifié (`lib/payment-core.js`, `data/catalogue.js`). Le client n’envoie pas de montants faisant foi. Devise unique, prix final, disponibilité/stock, **livraison** et **taxes** doivent être déterminés avant paiement.
- **Validation de paiement** : commande considérée payée uniquement après **capture confirmée côté serveur** (`COMPLETED`).
- **0 € livraison/taxes** : autorisés s’ils sont **réellement configurés et justifiés** (ex. configuration actuelle : livraison internationale expresse gratuite, taxes non prises en charge) et affichés comme définis ; sinon traités comme non définis → boutons désactivés.
- **Aucun achat réel** effectué pendant les vérifications.

## Variables d’environnement backend
À configurer **dans l’hébergeur du backend** (Cloudflare Dashboard → Workers & Pages → projet → Settings → Variables and Secrets). Jamais dans Git/front/GitHub Pages/logs.
- `PAYPAL_CLIENT_ID` — identifiant (Live en production).
- `PAYPAL_CLIENT_SECRET` — **secret serveur uniquement** (chiffré).
- `PAYPAL_API_BASE` — `https://api-m.paypal.com` (**Live production**) ou `https://api-m.sandbox.paypal.com` (Sandbox).
- `PUBLIC_SITE_ORIGIN` — origine exacte du site publié (CORS), ex. `https://www.kiffstation.com`.

Voir `.env.example` et `DEPLOY_CLOUDFLARE_BACKEND.md`.

## État Sandbox vs Live
### Sandbox
- **Supporté par le code** avec identifiants Sandbox + `PAYPAL_API_BASE=https://api-m.sandbox.paypal.com` sur un backend déployé/joignable.
- **Non vérifié opérationnel ici** (aucun backend déployé/configuré testé).

### Live
- **Prévu par le code** (`PAYPAL_API_BASE=https://api-m.paypal.com` + identifiants Live).
- **Configuré/déployé** : **non attesté** (à réaliser par vous dans Cloudflare Dashboard ; secrets non accessibles/vérifiables ici).
- **Effectivement opérationnel** : **non — ne pas déclarer Live opérationnel** avant déploiement Cloudflare effectif, saisie des variables/secrets Live, configuration `PAYMENT_API_BASE` front vers `*.pages.dev` (puis domaine si choisi), `PUBLIC_SITE_ORIGIN` correct, et vérification des endpoints/éligibilité sans paiement réel.

## Condition actuelle
- GitHub Pages publie le front statique (vitrine conservée). Les endpoints `./api/paypal/*` ne sont pas servis par Pages → backend séparé requis. Livraison/taxes 0 € actuellement **configurés/justifiés** dans le catalogue (définis).
