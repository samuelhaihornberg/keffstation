# KiffTech — Images officielles + Reviews complets (200 produits)

## État (56 photos réelles / 216 — vérif visuelle systématique)
- 216 produits LOCAL_DB (200 + 16 Consoles & Videogames avec era retro/modern + filtre Époque + carte Rayons)
- Photos CC câblées : 50 (dont co5 PS1, co11 PS5*, co13 Series X, co15 Steam Deck Linux, co16 ROG Ally*) — * = rapprochée notée
- Rejetées après contrôle visuel : Zapper pour NES, carte mère PS5, schéma Xbox, macro puce Steam Deck, carré noir Series S
- Sans photo libre : co1 NES, co12 PS5 Pro, co14 Series S → aperçu généré + page officielle + review complet
- 216 produits LOCAL_DB (200 + 16 Consoles & Videogames avec era retro/modern + filtre Époque + carte Rayons)
- Photos CC câblées : 45 (30 d'origine + sp12, sp14, sp16, tb2, tb13, cp2, aw6, co2, co3, co4*, co6, co7, co8, co9, co10) — * = génération rapprochée notée dans crédits
- Rejetés lot consoles : co1 (photo SNES pour NES), co11 (carte mère nue pour PS5), co13 (schéma vectoriel), co15 (macro puce AMD pour Steam Deck)
- Sans photo libre : co1 NES, co5 PS1, co11/12 PS5, co13/14 Xbox, co15 Steam Deck, co16 ROG Ally → aperçu généré + page officielle + review complet
- 200 produits LOCAL_DB (sp 20, cp 10, tb 20, ac 100, vr 10, ce 10, rb 10, gf 10, aw 10)
- 37 fichiers locaux `img/` (CC Wikimedia, voir `img/CREDITS.txt`) couvrant 36 produits (30 d'origine + sp12, sp14, sp16, tb2, cp2, aw6)
- 4 lots Commons testés (~40 requêtes) : 8 faux visuels supprimés (mairie, Ford, chien, immeuble, mauvais modèles), barrière auto marque+n° modèle en place (`/tmp/prio_fetch.sh`)
- Rejetés (pas de photo libre exacte) : vr3, aw2, sp3/5/7/9/10/19/20, lots 3-4 (owi : Commons ne couvre pas accessoires/téléphones récents/robots de niche)
- 164 produits restants → **aperçu SVG généré** (badge « Aperçu généré ») + bouton page officielle constructeur + review complet (déjà en place)

## Pourquoi pas de copie « images officielles » ?
Les visuels fabricants sont © constructeurs. Les copier en local = risque juridique.
Solution légale appliquée :
1. Garder les 32 photos CC BY-SA existantes (badge « Photo CC »).
2. Pour les 170 autres : aperçu généré local (offline) + bouton **« Page officielle {marque} »** dans la modale → l'utilisateur voit l'image officielle chez le fabricant.
3. Badge honnête : `Photo CC` vs `Aperçu généré` (plus de faux « Officiel »).

## Review complet (tous produits, sans copie presse)
`productReview(p)` dans `app.v2.js` génère pour chaque fiche :
- résumé original (marque, modèle, année, catégorie, top 3 specs, prix officiel + prix KiffTech)
- note KiffTech /5 (+0.2 si photo CC)
- 2 points + / 2 points « à vérifier »
- ligne « Visuel : Photo CC / Aperçu généré — voir page officielle »

Affiché dans la modale : description + 4 cartes specs (Note, Points +, À vérifier, Visuel).

## Liens officiels
`BRAND_SITES` (~70 marques) + `officialUrl(p)` → page constructeur + recherche modèle.
Ex : Samsung → https://www.samsung.com/fr/search?q=Galaxy+S24+Ultra

## Ajouter une vraie photo (procédure)
1. Chercher sur Wikimedia Commons uniquement (licence CC BY-SA / CC0).
2. Télécharger, resize 500px, nommer `{id}.jpg` dans `img/`.
3. Ajouter `images:['./img/{id}.jpg']` dans LOCAL_DB + ligne dans `img/CREDITS.txt` (fichier source + auteur).
4. Ne jamais ajouter d'image fabricant sans licence écrite.

## Vérif
- `node --check app.v2.js` OK
- 200/200 fiches ont résumé + note + lien officiel (générés dynamiquement, pas de fiche vide)
