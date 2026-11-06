# KiffTech — Catalogue illustré 2020-2026

## État
- **156 produits** dans `LOCAL_DB` (`app.v2.js`), tous avec au moins une photo réelle.
- **100 nouveaux gadgets populaires 2020-2026** ajoutés (smartphones, PC, tablettes, audio, VR, consoles, drones, smart home, accessoires, composants, robots).
- **11 rayons visibles** : Smartphones 40, Consoles & Videogames 18, Audio & Wearables 18, Tablets 15, Drones & Caméras 14, Computers 13, Composant electronic & informatic 11, Accessories 8, VR AR gadgets 8, Smart Home 6, Company & studying Robots 5.
- Le rayon « Garden & furnitures smart devices » n'a aucune photo libre : il est filtré de `rayons.html` tant qu'il n'est pas illustré.
- **158 fichiers image** dans `img/`, tous utilisés, tous crédités dans `img/CREDITS.txt`.
- Page **`credits.html`** : attribution visible, lien vers chaque fichier Wikimedia Commons.

## Politique visuelle
1. Source unique : **Wikimedia Commons** (CC0, CC BY, CC BY-SA ou domaine public).
2. Redimensionnement 500 px, nommage `{id}.jpg` ou `{id}.png`.
3. Une ligne de crédit par fichier dans `img/CREDITS.txt` + entrée dans `credits.html`.
4. **Pas de copie d'images fabricants** ni de résultat Google Images sans licence vérifiée : risque juridique.
5. La licence CC BY-SA impose attribution et partage à l'identique ; la page crédits couvre cette obligation.

## Méthode de sélection des 100 nouveaux gadgets
1. Vivier de 219 références populaires 2020-2026 (`gadgets.js` + `gadgets2.js`).
2. Résolution automatique : image d'article Wikipédia, puis recherche Commons stricte.
3. Filtres : licence libre, format JPEG/PNG/WebP, taille minimale, bonne génération, bonne variante (Pro/Max/Ultra…), pas de comparaison, pas d'accessoire, pas de photo de magasin ou de produit cassé.
4. Contrôle manuel des cas ambigus et fichiers imposés quand une photo exacte existe.
5. Résultat : **100 produits retenus sur 219 candidats** (46 %). Les références sans photo libre exploitable (Sony WH-1000XM5, JBL Charge 5, Anker 737, Galaxy Tab S10 Ultra…) ont été écartées.

## Pourquoi les produits sans photo ont été retirés
La base complète comptait 216 fiches, dont 160 sans photo libre (74 %). Plutôt que d'afficher 160 aperçus SVG générés, le catalogue ne conserve que les produits réellement illustrés. Le code de secours `previewImage()` reste présent pour les produits partenaires éventuels, mais aucun produit local n'en dépend.

## Review et descriptions
`productReview(p)` génère pour chaque fiche un résumé (marque, modèle, année, catégorie, top specs, prix), une note KiffTech /5 et des points « + » / « à vérifier ». Aucune fiche n'a de description rédigée : la modale affiche ce résumé automatique. Les 156 fiches ont donc un contenu minimum, mais pas encore de texte marketing original.

## Ajouter un produit illustré
1. Trouver une photo sur Wikimedia Commons (CC0, CC BY ou CC BY-SA).
2. Télécharger, redimensionner 500 px, nommer `img/{id}.jpg`.
3. Ajouter l'entrée dans `LOCAL_DB` avec `images:['./img/{id}.jpg']`.
4. Ajouter la ligne dans `img/CREDITS.txt`, régénérer `credits.html`, ajouter le fichier aux `ASSETS` de `sw.js` et mettre à jour `COUNTS` dans `rayons.html`.
5. Vérifier : `npm test` + `node --check kifftech/app.v2.js`.

## Vérif
- `node --check kifftech/app.v2.js` OK
- `npm test` : 17/17
- 156/156 fiches avec photo, 0 produit sans image, 0 fichier orphelin.
