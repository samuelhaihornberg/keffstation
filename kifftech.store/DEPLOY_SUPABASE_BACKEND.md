# Déploiement backend PayPal — Supabase Edge Functions (`kifftech.store/`)

Objectif : **remplacer le backend Cloudflare/Node** par **Supabase Edge Functions** pour le paiement PayPal, en gardant la **vitrine publiée sur GitHub Pages**. **Aucune configuration Cloudflare, aucune modification DNS.**

> Je n’ai pas accès à votre compte Supabase. Les fichiers sont préparés ; suivez les étapes ci-dessous. **N’inventez pas de Project URL ni de Project Ref** : utilisez ceux affichés dans votre propre projet Supabase. **Aucun paiement réel de test effectué. Ne déclarez pas le paiement Live opérationnel** avant déploiement des fonctions, saisie des secrets Live et vérification des endpoints.

## 1) Fichiers créés/modifiés (dans `kifftech.store/`)
- `supabase/functions/paypal-config/index.ts` : configuration publique PayPal (renvoie `clientId`, `currency`, `environment`, `intent`) — **ne renvoie jamais `PAYPAL_CLIENT_SECRET`**.
- `supabase/functions/paypal-create-order/index.ts` : création de commande PayPal côté serveur.
- `supabase/functions/paypal-capture-order/index.ts` : capture côté serveur après approbation client.
- `supabase/functions/_shared/paypal.ts` : appels PayPal serveur (secrets via env), CORS limité à `PUBLIC_SITE_ORIGIN`.
- `supabase/functions/_shared/payment-core.js`, `supabase/functions/_shared/catalogue.js` : logique réutilisée de **recalcul/validation** (articles, variantes, devise, livraison, taxes, total) depuis les données de référence ; le navigateur n’est jamais source de vérité pour les montants. Commande « payée » uniquement après capture confirmée `COMPLETED`.
- `supabase/functions/.env.example` : **noms et valeurs fictives uniquement** (aucun secret réel).
- `data/payment-config.js` : configuration front (`SUPABASE_FUNCTIONS_BASE_URL`, `SUPABASE_PUBLISHABLE_KEY` publique uniquement). Clé `service_role` **jamais** côté front.
- `app.js` : appels vers les fonctions Supabase + en-têtes publics si configurés, gestion d’erreurs.

## 2) Prérequis (votre machine)
- Compte Supabase et accès au Dashboard.
- Supabase CLI installé : https://supabase.com/docs/guides/cli
- Git (dépôt `keffstation` à jour).

## 3) Étapes exactes — créer/lier le projet et déployer

### A. Créer (ou utiliser) un projet Supabase
1. Ouvrir **Supabase Dashboard** → *New project* (ou sélectionner un projet existant).
2. Noter dans *Project Settings → General/API* (sans les coller dans le dépôt/public) :
   - **Project URL** (ex. `https://<PROJECT_REF>.supabase.co`) — visible dans votre dashboard, **ne pas inventer**.
   - **Project Ref** (identifiant du projet).
   - **Publishable/anon key** (clé publique) — utilisable côté navigateur si nécessaire ; **ne jamais utiliser `service_role` dans le front**.

### B. Lier le dossier local et déployer les fonctions
Depuis le dossier `kifftech.store/` du dépôt :

```bash
cd kifftech.store

# Connexion CLI (ouvre le navigateur)
supabase login

# Lier le projet (remplacer <VOTRE_PROJECT_REF> par le ref affiché dans votre Dashboard)
supabase link --project-ref <VOTRE_PROJECT_REF>

# Déployer les fonctions Edge
supabase functions deploy paypal-config
supabase functions deploy paypal-create-order
supabase functions deploy paypal-capture-order
```

> Les fonctions lisent le catalogue/logique depuis `supabase/functions/_shared/` (incluses au déploiement). Exécuter les commandes depuis `kifftech.store/` (où se trouve `supabase/`).

### C. Configurer les secrets PayPal (Dashboard, jamais dans Git/logs/chat)
**Supabase Dashboard → Edge Functions → Secrets** (ou *Project Settings → Edge Functions → Secrets* selon l’UI) → ajouter :

| Nom du secret | Valeur (à saisir par vous) | Note |
|---|---|---|
| `PAYPAL_CLIENT_ID` | *(identifiant PayPal **Live** pour production)* | requis |
| `PAYPAL_CLIENT_SECRET` | *(secret PayPal **Live**)* | **secret serveur uniquement**, ne jamais exposer |
| `PAYPAL_API_BASE` | `https://api-m.paypal.com` | **API Live (production)** |
| `PUBLIC_SITE_ORIGIN` | *origine exacte du site publié, sans slash final* | ex. `https://www.kiffstation.com` (CNAME racine du repo, à confirmer) ou `https://samuelhaihornberg.github.io` — CORS limité à cette origine |

- Pour Sandbox : `PAYPAL_API_BASE=https://api-m.sandbox.paypal.com` avec identifiants Sandbox.
- Les valeurs réelles sont saisies **uniquement** dans le Dashboard (ou via `supabase secrets set ...` sur votre machine, sans committer). **Ne pas** les mettre dans le chat, Git, le front ou les logs.

### D. (Optionnel) Désactiver la vérification JWT pour invocation publique
Si l’appel depuis le navigateur échoue pour motif d’authentification, vous pouvez soit (a) envoyer la clé **publishable** depuis le front (config ci-dessous), soit (b) dans le Dashboard/CLI autoriser l’invocation sans JWT utilisateur pour ces fonctions selon votre politique de sécurité. **Ne jamais utiliser `service_role` côté navigateur.**

### E. Configurer le front GitHub Pages (sans DNS/Cloudflare)
Dans `kifftech.store/data/payment-config.js` :
- `SUPABASE_FUNCTIONS_BASE_URL = 'https://<PROJECT_REF>.supabase.co/functions/v1'` (URL issue de votre projet, **ne pas inventer**)
- `SUPABASE_PUBLISHABLE_KEY = '<CLE_PUBLISHABLE_ANON_PUBLIQUE>'` si nécessaire pour l’invocation (clé publique uniquement) ; sinon laisser vide.
- Laisser `PAYMENT_API_BASE = ''`.

Puis commit & push sur `main` (déploiement GitHub Pages existant). **Aucun secret dans ce fichier.**

## 4) Vérifications (sans paiement réel)
- `GET https://<PROJECT_REF>.supabase.co/functions/v1/paypal-config` → JSON `{ ok, clientId, currency, environment, intent }` **sans `clientSecret`**.
- Depuis l’origine publiée configurée (`PUBLIC_SITE_ORIGIN`), le checkout appelle les fonctions Supabase ; erreurs réseau/config affichées proprement.
- Création/capture : montants **recalculés côté serveur** (articles/variantes/devise/livraison/taxes/total depuis catalogue) ; aucune confiance aux montants navigateur ; « payé » uniquement après capture `COMPLETED` confirmée.
- Paiement **ponctuel**. PayPal et carte affichés uniquement selon options/éligibilité PayPal (composants officiels, `isEligible()` pour champs carte ; **aucune collecte directe de numéros de carte**).
- **Aucun paiement réel de test.**

## 5) Reste à configurer dans Supabase (de votre côté)
1. Créer/sélectionner le projet et récupérer **Project URL/Ref** + clé **publishable** (sans les publier dans le dépôt).
2. `supabase login` + `supabase link --project-ref <VOTRE_PROJECT_REF>` + déployer les 3 fonctions.
3. Saisir les secrets : `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_API_BASE=https://api-m.paypal.com`, `PUBLIC_SITE_ORIGIN` (origine exacte).
4. Renseigner `SUPABASE_FUNCTIONS_BASE_URL` (et `SUPABASE_PUBLISHABLE_KEY` si requis) dans `data/payment-config.js`, puis pousser.
5. Vérifier endpoints/CORS/éligibilité sans paiement réel.

## 6) État Sandbox vs Live
- **Sandbox** : supporté par le code si secrets Sandbox + `PAYPAL_API_BASE=https://api-m.sandbox.paypal.com` déployés — **non vérifié ici**.
- **Live** : supporté par le code (`https://api-m.paypal.com` + identifiants Live) — **non opérationnel / ne pas déclarer opérationnel** tant que fonctions non déployées sur **votre** projet Supabase, secrets Live non configurés, et endpoints non vérifiés. Aucun secret exposé, aucun paiement réel effectué.
