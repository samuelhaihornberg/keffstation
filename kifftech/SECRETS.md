# KiffTech — Connexion Shopify + Impact (secrets GitHub)

Ce document explique comment brancher la boutique KiffTech sur **Shopify** et
**Impact.com** sans jamais exposer un secret dans le navigateur.

## Principe

```
Secrets GitHub  ──►  workflow boutique-sync  ──►  kifftech/data/products.json  ──►  site public
   (serveur)            (serveur, runner GH)        (JSON public, sans secret)
```

- Les secrets sont lus **uniquement** dans GitHub Actions.
- Le runner écrit un **fichier public** (`kifftech/data/products.json`) qui
  contient les produits, les prix et les liens de compra.
- Le navigateur lit ce fichier : aucun secret n'est envoyé au client.
- Le jeton **Storefront** de Shopify est public par design (lecture magasin +
  panier) : il est injecté au déploiement dans `kifftech/shopify-config.js`.
  Le jeton **Admin API** ne sort jamais du runner.

## 1. Secrets à créer

Repo GitHub → `Settings` → `Secrets and variables` → `Actions` → `New repository secret`.

| Secret | Obligatoire | Exemple | Rôle |
|---|---|---|---|
| `SHOPIFY_STORE_DOMAIN` | oui (Shopify) | `kifftech.myshopify.com` | Domaine de la boutique Shopify |
| `SHOPIFY_ADMIN_TOKEN` | recommandé | `shpat_…` | Admin API, scope `read_products` (et `read_inventory`) |
| `SHOPIFY_STOREFRONT_TOKEN` | recommandé | `shpat_…` ou `…` | Storefront API public, injecté dans le navigateur |
| `SHOPIFY_API_VERSION` | non | `2024-10` | Version de l'API (défaut `2024-10`) |
| `IMPACT_API_KEY` | oui (Impact) | `…` | Clé API Impact.com |
| `IMPACT_API_SECRET` | oui (Impact) | `…` | Secret API Impact.com |
| `IMPACT_CAMPAIGN_ID` | oui (Impact) | `…` | Identifiant de campagne (subid) pour les liens de suivi |
| `IMPACT_BRAND_ID` | non | `…` | Identifiant de catalogue/marque Impact |
| `SITE_DOMAIN` | variable | `kiffstation.com` | Domaine public du site |
| `DEFAULT_CURRENCY` | variable | `EUR` | Devise d'affichage |

> `SITE_DOMAIN` et `DEFAULT_CURRENCY` sont des **variables** (onglet
> *Variables*), pas des secrets.

### Où trouver ces valeurs

**Shopify**
- Domaine : `https://<nom>.myshopify.com` (visible dans l'admin Shopify).
- Admin API : `admin.shopify.com` → *Apps and sales channels* → *Develop apps* →
  créer une app → *API credentials* → **Install app** → copier le token
  (`shpat_…`). Scopes : `read_products`, `read_inventory`.
- Storefront API : même écran → *Storefront API access tokens* → **Install app**.
  Ce jeton est public : il n'autorise que la lecture du catalogue et la création
  de paniers.

**Impact.com**
- `impact.com` → *Partner Center* → *Settings* → *API* → clé + secret.
- Campaign ID et Brand ID : même écran (section *Campaigns* / *Brands*).

## 2. Domaine personnalisé (kiffstation.com)

La boutique fonctionne déjà sur `https://samuelhaihornberg.github.io/keffstation/`.

Pour brancher `kiffstation.com` :

1. Dans le dépôt, ajouter un fichier `CNAME` contenant `kiffstation.com`.
2. Dans `Settings` → `Pages` → *Custom domain*, saisir `kiffstation.com`.
3. Chez ton registrar, ajouter les enregistrements DNS demandés par GitHub
   (A/ALIAS vers `samuelhaihornberg.github.io`, ou CNAME selon le cas).

⚠️ Le fichier `CNAME` n'est **pas** ajouté automatiquement : sans la
configuration DNS, GitHub Pages ne pourra plus servir le site. Ajoute-le
seulement quand le domaine est prêt.

Pour Shopify, le domaine de la boutique (`xxx.myshopify.com` ou ton propre
domaine) est celui renseigné dans `SHOPIFY_STORE_DOMAIN` : les produits et le
lien de paiement utilisent ce domaine.

## 3. Vérifier la connexion

1. `Actions` → workflow **Boutique Sync (Shopify + Impact)** → *Run workflow*.
2. Dans les logs, la ligne `Diagnostic de la configuration` indique ce qui est
   présent ; ensuite `Synchroniser catalogue (Shopify + Impact)` indique le
   nombre de produits récupérés.
3. Le fichier `kifftech/data/products.json` est commité automatiquement → le
   déploiement GitHub Pages se relance.
4. Sur la boutique, le bandeau **« Sources live actives »** (sous les rayons)
   affiche `Shopify <domaine> (N)` et/ou `Impact (N)`.

## 4. Reconstruction du catalogue local

```bash
node scripts/kifftech/build-catalogue.mjs           # catalogue + photos CC Commons
node scripts/kifftech/build-catalogue.mjs --no-images
```

- Entrée : base embarquée `LOCAL_DB` (`kifftech/app.v2.js`) + fichiers
  `products-*.json`.
- Sortie : `kifftech/data/catalogue.json` (chargé par `kifftech/catalogue-live.js`).
- Les photos proviennent de Wikimedia Commons (CC BY-SA) et sont créditées dans
  `kifftech/img/CREDITS.txt`.

## 5. Dépannage

| Symptôme | Cause probable | Solution |
|---|---|---|
| `Shopify indisponible` en console | domaine/token absent ou invalide | vérifier les noms exacts des secrets |
| `Impact` en échec 401 | clé/secret erronés | régénérer la paire dans le Partner Center |
| Catalogue live vide | le workflow n'a pas tourné | *Run workflow* sur `Boutique Sync` |
| Produits sans photo | pas de fichier CC sur Commons | aperçu généré automatiquement (badge « Aperçu généré ») |
