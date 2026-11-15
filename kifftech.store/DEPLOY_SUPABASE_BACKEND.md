# KiffTech — Paiement PayPal réel avec Supabase Edge Functions

Vitrine : **GitHub Pages** (inchangée). Backend de paiement : **Supabase Edge Functions** du projet `spkaxtmhefhycqnshybo`. **Aucun Cloudflare, aucun serveur Node, aucune modification DNS.**

> État : code prêt et testé localement (banc simulé). **Non déployé** sur votre projet par cette session. **Le paiement Live n’est pas opérationnel** tant que les étapes 3 à 6 ci-dessous ne sont pas faites et que les endpoints ne répondent pas.

## 1. Architecture

| Élément | Où | Rôle |
|---|---|---|
| `paypal-config` | Edge Function (GET) | Renvoie uniquement `clientId`, devise, environnement, version des conditions. **Jamais le secret.** |
| `paypal-create-order` | Edge Function (POST) | Recalcule la commande depuis le catalogue (`payment-core.js`), vérifie l’acceptation des conditions, crée la commande PayPal (`intent: CAPTURE`), enregistre la commande + acceptation + hash du jeton. |
| `paypal-capture-order` | Edge Function (POST) | Vérifie le jeton de commande, verrouille, contrôle l’état PayPal, capture, **vérifie montant et devise**, puis marque « payé » et crée le reçu. |
| `migrations/20261115120000_kifftech_payments.sql` | Base | Tables `payment_orders`, `invoices`, `rate_limits` ; RLS activée **sans** accès anon/authenticated ; fonctions `kt_rate_limit_hit`, `kt_mark_paid`. |
| `data/payment-config.js` | Front (public) | URL des fonctions + clé **publishable** uniquement. |
| `data/legal.js` | Front + copie serveur | Conditions publiées (URL + version). **Vide = paiement désactivé.** |

Règles de sécurité appliquées dans les fonctions :
- **Montants** : jamais repris du navigateur (prix, totaux et champs forgés sont ignorés). Le serveur recalcule articles, variantes, quantités (max 20 lignes), devise unique, livraison, taxes et total.
- **Payé** : uniquement après capture PayPal `COMPLETED` **avec montant et devise identiques** à la commande enregistrée. Sinon `failed` (aucune facture).
- **Jeton de commande** : 256 bits aléatoires renvoyés une fois au navigateur ; seule son empreinte SHA-256 est stockée. Sans lui : pas de capture.
- **Double capture / double clic** : verrou `created → capturing`, réconciliation via `GET order` avant toute capture, `PayPal-Request-Id` déterministe (`capture-<id interne>`).
- **Refus carte** (`INSTRUMENT_DECLINED`) : code `declined`, commande réessayable, aucun paiement.
- **CORS** : uniquement l’origine exacte `PUBLIC_SITE_ORIGIN` ; une requête avec `Origin` différent est refusée (403).
- **Débit** : 10 créations / 10 min, 30 captures / 10 min, 120 configs / 10 min par empreinte d’IP (SHA-256 tronquée, IP non conservée).
- **Authentification** : `verify_jwt = false` (voir `supabase/config.toml`) car le panier est public, sans compte. La protection repose sur les points ci-dessus.
- **Données minimisées** : pas de nom, e-mail ou adresse de l’acheteur stocké par KiffTech. Les réponses PayPal complètes ne sont jamais journalisées.
- **Cartes** : composants PayPal officiels, champs carte affichés seulement si `isEligible()`. Aucune saisie ni stockage de numéro de carte.

## 2. Conditions d’utilisation (bloquant)

Le dépôt ne contient **aucune page de conditions d’utilisation ni politique de confidentialité**. Le seul lien existant (bannière cookies de `keffstation/index.html`) pointe vers `href="#"`. Aucun texte juridique n’a donc été créé.

Tant que `data/legal.js` n’est pas renseigné, le paiement est **désactivé** (le serveur refuse la création avec `legal_not_configured`).

Pour activer : publier les conditions (ex. `https://www.kiffstation.com/conditions.html`), puis dans `data/legal.js` renseigner `termsUrl`, `termsVersion` (ex. `2026-11-15-v1`), `privacyUrl`, `termsDate`. Changer `termsVersion` à chaque modification des conditions. Lancer `npm run sync:supabase`, commit, push.

Les « règles existantes de KiffStation » mentionnées dans la demande **n’existent pas encore** dans le dépôt : à fournir avant publication.

## 3. Lier le projet et déployer

Dans `kifftech.store/` :

```bash
cd kifftech.store
npm run check:supabase                     # copies _shared à jour (doit afficher "à jour")

supabase login
supabase link --project-ref spkaxtmhefhycqnshybo

# Migration (crée les tables et fonctions ; ou coller le SQL dans Supabase Dashboard → SQL Editor)
supabase db push

# Fonctions (verify_jwt désactivé explicitement, voir section 1)
supabase functions deploy paypal-config --no-verify-jwt
supabase functions deploy paypal-create-order --no-verify-jwt
supabase functions deploy paypal-capture-order --no-verify-jwt
```

## 4. Secrets (Dashboard uniquement)

**Supabase Dashboard → projet `spkaxtmhefhycqnshybo` → Edge Functions → Secrets**. Saisir vous-même, sans les coller dans le chat, Git ou les logs :

| Nom | Valeur à saisir | Note |
|---|---|---|
| `PAYPAL_CLIENT_ID` | identifiant **Live** de l’application PayPal | secret chiffré |
| `PAYPAL_CLIENT_SECRET` | secret **Live** | secret chiffré, serveur uniquement |
| `PAYPAL_API_BASE` | `https://api-m.paypal.com` | Live. Seules les deux bases PayPal officielles sont acceptées. |
| `PUBLIC_SITE_ORIGIN` | origine exacte de la vitrine, ex. `https://www.kiffstation.com` | **À confirmer** : le `CNAME` du dépôt indique `www.kiffstation.com`. Sans slash final. |

Ne **créez pas** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` ni `SUPABASE_SECRET_KEY` : la plateforme les fournit aux fonctions. La clé secrète exposée dans la conversation précédente **doit être révoquée puis remplacée** par vous dans Project Settings → API Keys ; elle n’est utilisée nulle part dans ce code.

Les GitHub Secrets ne sont **pas** utilisés au runtime des fonctions. Aucun workflow de déploiement n’est ajouté ; si vous en créez un, il ne doit recevoir que le jeton de déploiement Supabase et jamais les secrets PayPal.

## 5. Publier le front

`data/payment-config.js` contient déjà l’URL `https://spkaxtmhefhycqnshybo.supabase.co/functions/v1` et la clé publishable. Après les étapes 3 à 4 et la publication des conditions (section 2) : commit et push sur `main` (GitHub Pages se met à jour).

## 6. Vérifications à faire (sans paiement réel)

```bash
# Config publique : 200, aucun secret dans la réponse, origine exacte acceptée
curl -i -H "Origin: https://www.kiffstation.com" https://spkaxtmhefhycqnshybo.supabase.co/functions/v1/paypal-config

# Origine étrangère : 403
curl -i -H "Origin: https://exemple.invalid" https://spkaxtmhefhycqnshybo.supabase.co/functions/v1/paypal-config

# Création sans acceptation : 400 terms_not_accepted (aucune commande créée)
curl -i -X POST -H "Origin: https://www.kiffstation.com" -H "Content-Type: application/json" \
  -d '{"items":[],"acceptTerms":false}' https://spkaxtmhefhycqnshybo.supabase.co/functions/v1/paypal-create-order
```

Attendu après déploiement : `paypal-config` renvoie 200 (ou 503 `paypal_not_configured` si un secret manque) ; `legal_not_configured` tant que les conditions ne sont pas publiées. **Ne faites pas de paiement pour tester.**

Tests locaux du comportement (simulation PayPal + base, aucun appel réel) : `bash supabase/tests/run-local-tests.sh` (nécessite `deno`). Résultat au moment de la rédaction : **35/35**.

## 7. Reste à faire de votre côté

1. Révoquer / remplacer la clé secrète Supabase exposée.
2. `supabase link` + `db push` + 3× `functions deploy --no-verify-jwt`.
3. Saisir les 4 secrets dans le Dashboard (section 4).
4. Publier les conditions et les renseigner dans `data/legal.js` (section 2).
5. Confirmer `PUBLIC_SITE_ORIGIN`.
6. Vérifier les endpoints (section 6), puis tester avec un compte acheteur **Sandbox** si vous voulez un test sans débit, avant toute vente Live.

## 8. Facturation : ce qui manque pour une facture légale

Le reçu est créé après capture avec : numéro unique (`KT-AAAA-NNNNNN`), date, lignes, devise, montant payé, référence PayPal. Il est marqué `legal_complete = false` tant que ces informations ne sont pas renseignées dans `invoices.seller` (saisie par vous, jamais inventée) :
- dénomination, forme juridique, adresse du siège, SIREN/SIRET ou équivalent, RCS/répertoire, numéro de TVA intracommunautaire si applicable ;
- régime de TVA et taux appliqués (aujourd’hui : livraison 0 € et taxes 0 € « non prises en charge », à valider par votre expert-comptable) ;
- contact vendeur, médiateur de la consommation, conditions de remboursement et de rétractation (à rédiger et publier).

Ces mentions ne sont pas générées par le code. Un reçu avec `legal_complete = false` ne doit pas être présenté comme une facture conforme.
