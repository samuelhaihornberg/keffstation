# KiffTech — bouton PayPal

## Principe

Le site est **statique** (GitHub Pages). Il ne peut pas lire les secrets GitHub
à l'exécution. Le bouton PayPal utilise donc uniquement un **Client ID public**,
injecté au moment du build par `.github/workflows/deploy.yml`.

| Secret GitHub | Rôle | Exposé dans le site ? |
|---|---|---|
| `paypal_secret_ID` | **Client ID public** de l'application PayPal REST | Oui, c'est normal : un Client ID est public |
| `paypal_key` | **Clé secrète** PayPal | **Jamais** — réservée à un futur backend de vérification |
| `PAYPAL_CLIENT_ID` (optionnel) | Nom plus explicite, prioritaire sur `paypal_secret_ID` | Oui |

> ⚠️ Si `paypal_secret_ID` contient en réalité la **clé secrète** et non le
> Client ID, ne la mettez pas dans ce secret : supprimez-la et créez un secret
> `PAYPAL_CLIENT_ID` avec le Client ID public.

## Ce que fait le workflow

1. Lit `secrets.PAYPAL_CLIENT_ID` (sinon `secrets.paypal_secret_ID`).
2. Vérifie le format (`[A-Za-z0-9_-]{10,200}`).
3. Réécrit `kifftech/paypal-config.js` :

```js
window.KIFFTECH_PAYPAL_CLIENT_ID = 'A1b2…';
```

4. Publie l'artefact sur GitHub Pages.

Sans Client ID valide, le fichier contient une chaîne vide : le bouton PayPal
est simplement désactivé, le bouton « Commander » reste présent.

## Fonctionnement côté navigateur

- Le SDK officiel `paypal.com/sdk/js` est chargé à la demande, uniquement quand
  le panier contient au moins un article.
- Devise : **EUR** ; montant = total KiffTech du panier.
- `createOrder` → `actions.order.create`, `onApprove` → capture puis vidage du panier.
- En cas d'échec (hors ligne, SDK bloqué), un message invite à utiliser
  « Commander ».

## Limites connues

- Paiement **client-side** : adapté à une démo / petite boutique, mais la
  vérification serveur de la commande n'est pas faite. Pour de la production,
  créez les commandes côté serveur avec `paypal_key` (Cloudflare Worker,
  fonction serverless…) et ne gardez ici que le Client ID.
- Le panier est en mémoire : un rechargement de page le vide.
- Aucun frais de port ni TVA n'est calculé.
