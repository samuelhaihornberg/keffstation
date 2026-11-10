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

### Ce que ton dépôt contient déjà (vérifié)

| Secret existant | Contenu | État |
|---|---|---|
| `PAYPAL_SECRET_ID` | Client ID public PayPal | ✅ injecté au déploiement → boutons PayPal actifs |
| `SHOPIFY_KEY` | jeton **Storefront** `shpss_…` (public) | ✅ détecté, injecté au navigateur |
| `SHOPIFY_ID` | **UUID de l'app** (`d1e0d09c-d9da-…-ecc0a`) | ⚠️ ce n'est pas le domaine de la boutique |
| `IMPACT_ACCOUNT_SID` | SID de compte annonceur Impact | ✅ API répond |
| `IMPACT_AUTH_TOKEN` | jeton d'authentification Impact | ✅ API répond |
| `KIFFTECHSTORE` | 2ᵉ SID de compte Impact | ✅ API répond |
| `TOKEN_KIFFTECHSTORE` | 2ᵉ jeton Impact | ✅ API répond |

### Ce qu'il manque

| Secret / variable | Valeur attendue | Pourquoi |
|---|---|---|
| `SHOPIFY_DOMAIN` (**variable**, pas secret) | `kifftech.myshopify.com` | Le sous-domaine réel de la boutique. Sans lui, l'API Shopify renvoie **404** (une boutique inexistante) au lieu de 401. Le UUID `SHOPIFY_ID` ne peut pas servir de domaine. |
| `SHOPIFY_STORE_DOMAIN` (secret, prioritaire) | idem | Alternative au nom ci-dessus. |

> Le workflow accepte plusieurs alias pour chaque valeur
> (`SHOPIFY_STORE_DOMAIN` > variable `SHOPIFY_DOMAIN` > `SHOPIFY_ID` > …).

### Variables utiles

| Variable | Exemple | Rôle |
|---|---|---|
| `SHOPIFY_DOMAIN` | `kifftech.myshopify.com` | domaine de la boutique Shopify |
| `SITE_DOMAIN` | `kiffstation.com` | domaine public du site |
| `DEFAULT_CURRENCY` | `EUR` | devise d'affichage |
| `PAYPAL_BUTTONS` | `{"style":{"color":"blue","layout":"horizontal"}}` | boutons PayPal personnalisés (style, financement, message) |

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

**État actuel : le domaine est déjà en ligne et redirige vers le site.**
`https://kiffstation.com` → redirection Cloudflare → `https://samuelhaihornberg.github.io/keffstation/`.
Les URL canoniques et le sitemap pointent volontairement vers l'adresse finale
(`github.io`) tant que cette redirection existe : ce sont les URL servies.

### Option A — Garder la redirection (zéro risque, rien à faire)
Le site est accessible sur `kiffstation.com` aujourd'hui. C'est l'état actuel.

### Option B — Servir directement sur kiffstation.com (recommandé pour le SEO et Shopify)

1. **GitHub** : `Settings` → `Pages` → *Custom domain* → saisir `kiffstation.com`
   → *Save*. (Avec une publication par workflow Actions, le fichier `CNAME`
   du dépôt est ignoré : c'est bien le réglage Pages qui fait foi.)
2. **Cloudflare** (ton registrar) : remplace l'enregistrement actuel de
   `kiffstation.com` par :

   | Type | Nom | Valeur |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `samuelhaihornberg.github.io` |

   (AAAA optionnels : `2606:50c0:8000::153`, `…8001::153`, `…8002::153`, `…8003::153`.)
   Passe leenuage Cloudflare en **DNS uniquement** (gris) pour `@` et `www` :
   Cloudflare en proxy orange + GitHub Pages exige un SSL "Full (strict)" avec
   le domaine déclaré dans Pages, sinon le certificat ne correspond pas.
3. Laisse GitHub émettre le certificat (quelques minutes, parfois 24 h).
4. Vérifie que `https://kiffstation.com/` répond 200 et affiche le site.
5. Bascule les URL canoniques : demande-moi de le faire (ou lance
   `node scripts/kifftech/set-site-url.mjs kiffstation.com`) — le sitemap et
   les balises `canonical` / JSON-LD passent alors sur le nouveau domaine.

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
