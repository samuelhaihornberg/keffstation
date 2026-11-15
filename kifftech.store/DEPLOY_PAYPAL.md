# KiffTech — Paiement PayPal (ponctuel) : déploiement et état

## Implémentation (ce dépôt, `kifftech.store/`)
- **Frontend** : SDK PayPal officiel (`buttons,card-fields`), achat **ponctuel** (`intent=capture`), présentation KiffTech. Le navigateur reçoit uniquement la config publique (`clientId`, devise, environnement dérivé de `PAYPAL_API_BASE`). **Aucun `PAYPAL_CLIENT_SECRET`, aucun numéro de carte, aucune donnée sensible de paiement** n’est collecté/stocké côté KiffTech.
- **Compte PayPal** : proposé via boutons PayPal officiels.
- **Carte (crédit/débit)** : proposée via **boutons PayPal** lorsque PayPal l’autorise pour le compte/pays, et via **Card Fields hébergés PayPal** uniquement si `isEligible()` est vrai (vérification d’éligibilité avant affichage des champs avancés). Pas de formulaire maison de carte.
- **Backend requis** (GitHub Pages ne peut pas sécuriser le secret) : création et capture serveur (`/api/paypal/config`, `/api/paypal/create-order`, `/api/paypal/capture-order`) implémentées dans :
  - `server.js` (Node, hébergement serveur/conteneur)
  - `functions/api/paypal/*` (Cloudflare Pages Functions / Workers)
- **Montants** : recalculés côté serveur à partir du catalogue vérifié (`lib/payment-core.js`, `data/catalogue.js`). Le client envoie uniquement des identifiants/quantités/sélections ; **les montants client ne sont jamais fiables**. Devise unique, prix final, disponibilité, **livraison** et **taxes** doivent être déterminés avant paiement.
- **Validation de paiement** : une commande n’est considérée payée qu’après **capture confirmée côté serveur** (`COMPLETED`). Gestion de base des annulations/refus/erreurs réseau, désactivation/réentrance limitée, vérification d’état avant capture et reprise prudente des statuts complétés (sans créer volontairement de double paiement).
- **Aucun achat réel** effectué pendant les vérifications automatisées.

## Variables d’environnement backend (obligatoires pour activer le paiement)
À configurer **dans l’hébergeur du backend** (jamais dans le dépôt, ni dans le JS public, ni dans les logs) :
- `PAYPAL_CLIENT_ID` — identifiant client (public côté SDK, mais fourni par le backend).
- `PAYPAL_CLIENT_SECRET` — **secret serveur uniquement**.
- `PAYPAL_API_BASE` — `https://api-m.sandbox.paypal.com` (Sandbox) ou `https://api-m.paypal.com` (Live).

Voir `.env.example`.

## Hébergeur nécessaire
Un **backend réellement déployé** est nécessaire (GitHub Pages seul ne suffit pas). Options compatibles avec le code fourni :
- **Cloudflare Pages + Functions** (recommandé si le front est statique) : déployer `kifftech.store` avec le dossier `functions/` et définir les variables d’environnement.
- **Serveur Node** (VPS/PaaS/conteneur) : exécuter `server.js` avec les variables d’environnement, en servant le même dossier applicatif.

## État Sandbox vs Live (séparation explicite)
### Sandbox
- **Supporté par le code** lorsque `PAYPAL_CLIENT_ID/SECRET` Sandbox et `PAYPAL_API_BASE=https://api-m.sandbox.paypal.com` sont configurés sur un backend déployé.
- **Non vérifié opérationnel ici** : aucun backend déployé/configuré avec des identifiants Sandbox n’a été testé dans cet environnement.

### Live
- **Prévu par le code** (bascule via `PAYPAL_API_BASE=https://api-m.paypal.com` et identifiants Live).
- **Configuré** : non (aucune preuve de configuration Live déployée).
- **Effectivement disponible/opérationnel** : **non confirmé**. Ne pas considérer le paiement Live opérationnel tant que tous les points suivants ne sont pas vérifiés : backend Live réellement déployé, identifiants Live valides, éligibilité carte/compte/pays confirmée, et **panier/offre vendable complet** avec sous-total, livraison, taxes, devise et total final déterminés (actuellement la livraison et les taxes sont « à définir » → le paiement doit rester désactivé ; aucun montant inventé ou mis à zéro).

## Condition actuelle du catalogue (important)
- Les fiches/produits ne définissent pas encore de **livraison** et **taxes** confirmées (`lib/payment-core.js` exige ces montants). En conséquence, **le bouton de paiement reste désactivé** et le total final n’est pas payable tant que ces valeurs ne sont pas configurées et vérifiées. C’est conforme aux règles demandées.
