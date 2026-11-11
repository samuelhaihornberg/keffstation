# KiffTech — Sources produits

Ce dossier contient 3 fichiers. Deux sont **optionnels** et se remplissent
d_products (les prix et les photos viennent de ta boutique).

| Fichier | Rôle | Qui le remplit |
|---|---|---|
| `catalogue.json` | catalogue local enrichi (454 produits, 25+ par catalogue) | `node scripts/kifftech/build-catalogue.mjs` |
| `products.json` | catalogue **live** (Shopify / Impact / exports) | le workflow `Boutique Sync` |
| `shopify-export.csv` | **ton export produits Shopify** | toi (ou le workflow, si le domaine est configuré) |
| `impact-export.csv` | ton export produits Impact (facultatif) | toi |

## Méthode 1 — Domaine Shopify configuré (automatique)

Le workflow `Boutique Sync (Shopify + Impact)` appelle l'API Shopify et
Impact tout seul. Il suffit que le **sous-domaine de la boutique** soit connu :

- variable GitHub `SHOPIFY_DOMAIN` = `kifftech.myshopify.com` (recommandé), ou
- secret `SHOPIFY_STORE_DOMAIN` = la même valeur.

→ où trouver l'adresse : Shopify admin → **Settings → Domains** → l'adresse
`xxx.myshopify.com` affichée en haut de l'écran.

## Méthode 2 — Import par export CSV (fonctionne sans API)

1. Shopify admin → **Produits** → **Exporter** → choisis *Export CSV des produits*.
2. Dépose le fichier `shopify-export.csv` dans **ce dossier** (via GitHub :
   `Add file` → *Upload files*, ou en le deposit par glisser-déposer).
3. Le workflow se relance tout seul (il surveille ce dossier) et publie les
   produits dans `products.json`.

Le CSV est lu colonne par colonne :

| Colonne Shopify | Utilisation |
|---|---|
| `Title` | nom du produit KiffTech |
| `Vendor` | marque |
| `Product Category` / `Type` / `Tags` | affectation au catalogue (automatique) |
| `Variant Price` | prix KiffTech affiché |
| `Variant Compare At Price` | prix officiel barré |
| `Image Src` | photo du produit |
| `Body (HTML)` | description (texte nettoyé) |
| `Status` | seules les lignes `active` sont reprises |

Un `.json` est accepté aussi (tableau d'objets avec `title`/`model`, `brand`,
`price`, `images`, `category`).

## Méthode 3 — Impact

L'API Impact fonctionne déjà (compte + campagne **Kifftech.store**, Id 60056).
Elle ne renvoie de produits que si un **catalogue produits** existe côté Impact :

- Impact Partner Center → **Catalogs** → *Upload* d'un flux produits (CSV/TSV), ou
- connexion d'un **Shopping Cart** (pull depuis la boutique Shopify).

Tant que le catalogue est vide, l'API renvoie 0 produit : le site continue
d'afficher le catalogue local. Un `impact-export.csv` déposé ici fonctionne
aussi, avec les mêmes colonnes (`Name`, `Manufacturer`, `CurrentPrice`,
`ImageUrl`, `Url`, `Description`, `Category`).

## Vérifier

```bash
node scripts/sync-boutique.mjs      # lit les exports + écrit products.json
node scripts/kifftech/import-products.mjs   # affiche ce qui a été lu
```

Puis : `Actions` → *Boutique Sync* → *Run workflow* → le bandeau
« Sources live actives » de la boutique indique le nombre de produits.
