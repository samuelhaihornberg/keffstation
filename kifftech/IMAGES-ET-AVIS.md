# KiffTech — Catalogue illustré

## État
- **56 produits** dans `LOCAL_DB` (`app.v2.js`), tous avec au moins une photo réelle.
- **9 rayons visibles** : Smartphones 13, Consoles & Videogames 13, Tablets 6, Accessories 6, Computers 5, Company & studying Robots 5, Audio & Wearables 4, VR AR gadgets 3, Composant electronic & informatic 1.
- Le rayon « Garden & furnitures smart devices » n'a aucune photo libre : il est filtré de `rayons.html` tant qu'il n'est pas illustré.
- **58 fichiers** dans `img/`, tous utilisés, tous crédités dans `img/CREDITS.txt`.
- Page **`credits.html`** : attribution visible, lien vers chaque fichier Wikimedia Commons.

## Politique visuelle
1. Source unique : **Wikimedia Commons** (CC BY-SA 4.0 ou CC0 / domaine public).
2. Redimensionnement 500 px, nommage `{id}.jpg` ou `{id}.png`.
3. Une ligne de crédit par fichier dans `img/CREDITS.txt` + entrée dans `credits.html`.
4. **Pas de copie d'images fabricants** ni de résultat Google Images sans licence vérifiée : risque juridique.
5. La licence CC BY-SA impose attribution et partage à l'identique ; la page crédits couvre cette obligation.

## Pourquoi les produits sans photo ont été retirés
La base complète comptait 216 fiches, dont 160 sans photo libre (74 %). Plutôt que d'afficher 160 aperçus SVG générés, le catalogue ne conserve que les produits réellement illustrés. Le code de secours `previewImage()` reste présent pour les produits partenaires éventuels, mais aucun produit local n'en dépend.

## Review et descriptions
`productReview(p)` génère pour chaque fiche un résumé (marque, modèle, année, catégorie, top specs, prix), une note KiffTech /5 et des points « + » / « à vérifier ». Aucune fiche n'a de description rédigée : la modale affiche ce résumé automatique. Les 56 fiches ont donc un contenu minimum, mais pas encore de texte marketing original.

## Ajouter un produit illustré
1. Trouver une photo sur Wikimedia Commons (CC BY-SA ou CC0).
2. Télécharger, redimensionner 500 px, nommer `img/{id}.jpg`.
3. Ajouter l'entrée dans `LOCAL_DB` avec `images:['./img/{id}.jpg']`.
4. Ajouter la ligne dans `img/CREDITS.txt`, régénérer `credits.html`, et mettre à jour `COUNTS` dans `rayons.html`.
5. Vérifier : `npm test` + `node --check kifftech/app.v2.js`.

## Vérif
- `node --check kifftech/app.v2.js` OK
- `npm test` : 16/16
- 56/56 fiches avec photo, 0 produit sans image, 0 fichier orphelin.
