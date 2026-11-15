# Déploiement backend PayPal — Cloudflare Pages Functions (`kifftech.store/`)

Objectif : **garder GitHub Pages comme vitrine/site publié** et déployer **uniquement le backend paiement** (API `/api/paypal/*`) sur une **instance Cloudflare Pages séparée** depuis le sous-dossier `kifftech.store/` (fichiers statiques + Functions). Utiliser d’abord l’URL **`*.pages.dev`** fournie par Cloudflare. **Aucun DNS modifié, GitHub Pages non remplacé.**

> Je ne peux pas créer/déployer le projet Cloudflare ni saisir de secrets depuis cette session. Les fichiers sont préparés dans le dépôt ; suivez les étapes ci-dessous dans le tableau de bord Cloudflare.

## 1) Fichiers préparés (dans `kifftech.store/`)
- `functions/api/paypal/{config,create-order,capture-order}.js` + `functions/api/_lib/paypal.js` : endpoints backend (création/capture serveur, montant recalculé depuis le catalogue, capture confirmée `COMPLETED` requise, CORS limité à l’origine autorisée).
- `data/payment-config.js` : configuration front `PAYMENT_API_BASE` (URL du backend Cloudflare à renseigner après déploiement).
- `server.js` : alternative Node (mêmes règles), non utilisée pour Cloudflare Pages.
- `.env.example` : noms des variables/secrets à définir côté hébergeur.

## 2) Étapes exactes — Cloudflare Dashboard
1. **Connexion** : Cloudflare Dashboard → **Workers & Pages**.
2. **Créer le projet Pages** : *Create application* → onglet **Pages** → *Connect to Git*.
3. **Sélectionner le dépôt** : `samuelhaihornberg/keffstation` (branche `main`).
4. **Configurer le build (important : sous-dossier `kifftech.store/`)** :
   - **Project name** : au choix (ex. `kifftech-paypal-backend`) — l’URL sera `https://<project-name>.pages.dev`.
   - **Production branch** : `main`
   - **Framework preset** : `None`
   - **Root directory (directory / path)** : `kifftech.store`  ← **obligatoire** (déploie ce sous-dossier avec ses Functions)
   - **Build command** : *(laisser vide)*
   - **Build output directory** : `.` (ou laisser vide selon UI ; le contenu statique du sous-dossier doit être servi avec `functions/`)
5. **Déployer** : *Save and Deploy*. Noter l’URL de production **`https://<project-name>.pages.dev`** (ne pas toucher au DNS).
6. **Variables et secrets** : projet → **Settings** → **Variables and Secrets** → *Add* (environnement **Production**, et Preview si souhaité) :
   - **Secret chiffré (Encrypt)** — nom : `PAYPAL_CLIENT_SECRET` — valeur : *(à saisir par vous, jamais committée/affichée)*
   - **Secret ou variable chiffrée** — nom : `PAYPAL_CLIENT_ID` — valeur : *(à saisir par vous ; identifiant Live pour la production)*
   - **Variable** — nom : `PAYPAL_API_BASE` — valeur non secrète : `https://api-m.paypal.com` (**Live / production**)
   - **Variable** — nom : `PUBLIC_SITE_ORIGIN` — valeur non secrète : **origine exacte du site publié** (sans slash final), ex. `https://www.kiffstation.com` *(CNAME racine du repo ; à confirmer selon l’URL réellement utilisée par les visiteurs. Pour GitHub Pages sans domaine perso : `https://samuelhaihornberg.github.io`)*
7. **Redéployer** après ajout des variables/secrets (Deployments → *Retry deployment* / nouveau déploiement) pour prise en compte.
8. **Configurer le front GitHub Pages pour appeler ce backend** (sans changer GitHub Pages) :
   - Dans le dépôt, fichier `kifftech.store/data/payment-config.js`, définir :
     - `export const PAYMENT_API_BASE = 'https://<project-name>.pages.dev';`
   - Commit & push sur `main` (déclenche le déploiement GitHub Pages existant). **Ne mettre aucun secret dans ce fichier.**
9. **Vérifier (sans paiement réel)** :
   - `GET https://<project-name>.pages.dev/api/paypal/config` → JSON `{ ok: true, clientId, currency, environment, intent }` **sans** `clientSecret` (ni aucune valeur secrète).
   - Depuis le site publié (origine exacte configurée), le panier/checkout doit appeler le backend Cloudflare ; en cas d’erreur config/réseau, un message explicite est affiché côté UI.
   - Création/capture : montant recalculé côté serveur (`lib/payment-core.js` + `data/catalogue.js`), commande marquée payée côté flux applicatif **uniquement** après capture `COMPLETED` confirmée par le serveur.
   - Les montants livraison/taxes à **0 €** (actuellement configurés/justifiés : livraison internationale expresse gratuite, taxes non prises en charge) doivent rester affichés comme définis ; ne pas autoriser si non configurés/justifiés.

## 3) Valeurs non secrètes à saisir / noms des secrets
- **Noms des secrets/variables à ajouter dans Cloudflare** : `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_API_BASE`, `PUBLIC_SITE_ORIGIN`.
- **Valeurs non secrètes** : `PAYPAL_API_BASE=https://api-m.paypal.com` (Live), `PUBLIC_SITE_ORIGIN=<origine exacte du site publié>`.
- **Secrets (valeurs à saisir uniquement par vous dans le Dashboard, chiffrées)** : `PAYPAL_CLIENT_SECRET` (obligatoire), `PAYPAL_CLIENT_ID` (identifiants Live). **Ne jamais lire/afficher/copier/committer ces valeurs.**

## 4) Sécurité & contraintes
- CORS limité à **l’origine exacte** `PUBLIC_SITE_ORIGIN` (préflight OPTIONS géré). Ne pas utiliser `*` en production.
- Aucun secret dans Git, GitHub Pages, JavaScript public ou logs. `GET /api/paypal/config` n’expose jamais `PAYPAL_CLIENT_SECRET`.
- Paiement ponctuel ; carte uniquement si éligible/autorisée (vérification `isEligible()` côté SDK). **Aucun paiement réel de test effectué.**

## 5) État Live
- **Ne pas déclarer le mode Live opérationnel** avant : déploiement Cloudflare effectif, saisie des variables/secrets **Live** dans le Dashboard, et vérification réussie des endpoints (config/création/capture) + éligibilité compte/pays. Le code supporte Live ; l’opérationnalité dépend de votre déploiement/configuration.
