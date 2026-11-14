# Déploiement du paiement PayPal (KiffTech)

## Constat dépôt (sans lecture/affichage de secrets)
- Aucun dossier `.github/workflows/` ni fichier de workflow présent dans le dépôt : aucune référence de secret PayPal n’a pu être repérée dans des workflows versionnés.
- Aucun backend/serverless PayPal existant dans le dépôt avant cette intégration.
- Hébergement actuel : GitHub Pages (statique) — **incompatible** avec les endpoints serveur requis (création/capture PayPal, secrets côté serveur). Les endpoints doivent être hébergés sur un backend/serverless.

## Implémentation ajoutée (compatible Cloudflare Pages Functions)
- Endpoints serveur sécurisés : `functions/api/paypal/config.js`, `functions/api/paypal/create-order.js`, `functions/api/paypal/capture-order.js` (+ helpers `functions/api/_lib/paypal.js`).
- Logique partagée de vendabilité/recalcul serveur : `lib/payment-core.js` (montant recalculé depuis le catalogue canonique `data/catalogue.js` par `productId`/`choiceIndices`/`quantity` ; aucune confiance au prix/total navigateur).
- Paiement autorisé uniquement si l’offre est vendable (prix final, disponibilité, devise, **livraison** et **taxes** définis). À défaut, « Acheter maintenant » est désactivé avec explication. (Les fiches actuelles ne définissent pas livraison/taxes → paiement non autorisé tant que non complété.)
- Confirmation affichée uniquement après capture PayPal `COMPLETED`. Annulation/refus/erreurs gérés côté client. Aucun paiement réel lancé pendant la vérification.

## Secrets PayPal (déjà dans GitHub Actions Secrets selon configuration existante — ne pas les redemander/afficher)
Les fonctions serveur lisent uniquement des variables d’environnement (jamais exposées au navigateur, jamais loguées) :
- `PAYPAL_CLIENT_ID` (identifiant client, public côté SDK mais fourni via endpoint serveur `/api/paypal/config`)
- `PAYPAL_CLIENT_SECRET` (**secret**, serveur uniquement)
- `PAYPAL_API_BASE` (optionnel) : `https://api-m.paypal.com` (production) ou `https://api-m.sandbox.paypal.com` (sandbox)

## Option A — Serveur Node (recommandé si vous choisissez Node)
Le dépôt inclut `server.js` (Node, ESM) qui sert le site statique **et** les endpoints `/api/paypal/config|create-order|capture-order` sur la même origine, en recalculant les montants côté serveur (`buildOrder`, `lib/payment-core.js`).

1. **Prérequis** : Node.js (version supportant `fetch` natif, ex. Node 18+).
2. **Variables d’environnement** (à définir dans l’environnement de l’hébergeur, **jamais** dans le dépôt) :
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET` (serveur uniquement)
   - `PAYPAL_API_BASE` (optionnel) : `https://api-m.sandbox.paypal.com` (test) ou `https://api-m.paypal.com` (production)
   - `PORT` (optionnel, défaut `3000`)
   - Voir `.env.example` (placeholders uniquement).
3. **Démarrage** : `npm install` (si nécessaire) puis `npm start` (ou `node server.js`) avec les variables définies.
4. **Déploiement** : héberger ce service Node sur un fournisseur exposant le port HTTP (Render, Railway, Fly.io, VPS, etc.) et faire pointer le domaine KiffTech vers cette instance afin que le front et `/api/paypal/*` soient sur la **même origine**. GitHub Pages seul ne peut pas exécuter `server.js`.
5. **Vérification** : `GET /api/paypal/config` renvoie `{ ok: true, clientId, ... }` quand configuré ; tester le flux sandbox avant production.

## Option B — Cloudflare Pages Functions (alternative)
GitHub Pages ne peut pas exécuter `functions/`. Pour utiliser les Functions incluses (`functions/api/*`), déployer sur Cloudflare Pages avec les mêmes variables d’environnement (`PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_API_BASE`) et servir front + API sur la même origine.

## Vendabilité catalogue (condition métier)
Pour autoriser un paiement réel, compléter par produit/offre les champs requis côté catalogue/données canoniques : prix final confirmé, disponibilité, devise, **livraison** (montant/détail) et **taxes** (montant/taux/inclus) — puis recalcul/validation serveur s’appuiera dessus.

## Vérifications effectuées ici
- Implémentation côté code : création/capture via endpoints serveur, recalcul serveur, états UI (chargement/annulation/refus/erreur/succès après capture confirmée), désactivation + motif quand non vendable.
- Aucune exécution de paiement réel effectuée.

## Limite actuelle
Tant que (a) aucun backend serverless déployé avec les variables `PAYPAL_*` n’est accessible à la même origine et (b) les offres n’incluent pas livraison/taxes définies, le paiement restera indisponible/refusé — comportement voulu par les règles de sécurité/vendabilité.
