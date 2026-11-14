# Cahier des charges — contenu des fiches produit

**Version** : 1.3 — 2026-11-14 (recentrage boutique jeux vidéo & smart tech, promotion KiffTech, état réel)
**Périmètre** : catalogue KiffTech (`data/catalogue.js`)
**Contrôle** : `node tools/check-contenu.js` (souple), `--strict` (fiches), `--complete` (couverture)

Ce document est la référence à respecter pour chaque fiche produit. Une fiche qui ne remplit pas ces minimums est considérée comme **incomplète**.

---

## 1. Positionnement et rayons

KiffTech est une boutique spécialisée jeux vidéo et smart tech (nom, style, PWA, fiches, caisse et intégration PayPal conservés). Rayons du catalogue :
1. **Jeux vidéo** (`jeux-video`) : consoles, jeux et accessoires gaming
2. **Smartphones** (`smartphones`)
3. **Ordinateurs et composants** (`ordinateurs-composants`)
4. **Tablettes** (`tablettes`)
5. **Montres connectées et wearables** (`montres-wearables`)
6. **Maison connectée et sécurité** (`maison-securite`)
7. **Smart car et mobilité connectée** (`smart-car`)
8. **Smart tech** (`smart-tech`) : robots, drones, assistants, énergie et objets connectés

Les produits/contenus existants sont reclassés dans le rayon approprié (sans suppression pour changement de nom, sans doublon entre rayons).

## 2. Couverture attendue (matrice marque × année)

- **Produits réellement commercialisés entre 2020 et 2026**, en mettant en avant les modèles de 2026.
- **Matrice prévue (référence historique du contrôle)** : 9 marques × 7 années = 63 couples — Samsung, Apple, Linux, Microsoft, Steam/Valve, Meta, HP, Alienware, MSI (2020–2026).
- **Règle** : chaque case doit correspondre à un produit réellement sorti cette année-là, confirmé par une source fiable/fabricant datée. **N’ajouter que des sorties confirmées.** Si aucune sortie confirmée pour un couple, ne pas inventer : documenter l’absence dans `manquants[]` et laisser la case non couverte.

### Cas particuliers
- **Linux** : appareil vendu avec Linux (PC, console, mini-PC) ; renseigner `plateforme: "Linux"` en plus de `marque`.
- **Steam/Valve** : matériel/produits Valve/Steam ; absence de nouveauté matérielle grand public certaines années = case non couverte documentée.
- **Nintendo, Sony (et autres marques pertinentes)** : fiches conservées/ajoutées si sorties confirmées ; hors matrice des 63 couples de base mais présentes au catalogue.

### État réel de la matrice (60 fiches au total, au 14/11/2026)

| Marque | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 |
|---|---|---|---|---|---|---|---|
| Samsung | Galaxy S20 5G, Galaxy Watch3 | Galaxy S21 5G | Galaxy S22 Ultra | Galaxy S23 Ultra | Galaxy S24 Ultra | Galaxy S25 Ultra | Galaxy S26 Ultra |
| Apple | iPhone 12, Apple Watch Series 6 | iPhone 13 | iPhone 14 Pro | iPhone 15 Pro | iPhone 16 Pro | iPhone 17 Pro | iPhone 17e |
| Linux | Raspberry Pi 400 | Raspberry Pi Pico | Raspberry Pi Pico W | Raspberry Pi 5 | Raspberry Pi Pico 2 | Raspberry Pi 500+ | — |
| Microsoft | Xbox Series X | Surface Laptop 4 | Surface Laptop 5 | Surface Laptop Studio 2 | Surface Laptop (7th Edition) | Surface Laptop 13-inch (1st Edition) | Surface Laptop (8th Edition) |
| Valve/Steam | Half-Life: Alyx | Valve Index (kit VR) | Steam Deck (LCD) | Steam Deck OLED | — | — | Steam Machine |
| Meta | Quest 2 | — | Meta Quest Pro | Quest 3 | Meta Quest 3S | — | — |
| HP | Reverb G2 | Spectre x360 14 (2021) | Spectre x360 13.5 (2022) | — | Spectre x360 14 (2024) | — | OmniBook Ultra (2026) |
| Alienware | m15 R3 | m15 R4 | x14 | m16 | m16 R2 | 16 Area-51 (2025) | 16X Aurora (2026) |
| MSI | Bravo 17 | GE76 Raider (2021) | Raider GE67 HX (2022) | Titan GT77 HX (2023) | Titan 18 HX (2024) | Titan 18 HX Dragon Edition Norse Myth (2025) | Raider 16 Max (2026) |

> Fiches hors matrice 63 conservées : Nintendo Switch 2 (2025, jeux vidéo), PlayStation 5 Pro (2024, jeux vidéo), Sony WH-1000XM4 (2020, smart tech). Aucune case n’est inventée ; les cases « — » ou années manquantes restent à confirmer/documenter.

## 3. Structure obligatoire d’une fiche (produit/variante)

1. Titre, marque, modèle exact et référence (référence/SKU si confirmée, sinon « à vérifier » dans `manquants`).
2. Description du modèle et de ses principales caractéristiques.
3. Variantes réellement disponibles à sélectionner (configuration exacte) ; ne pas inventer de variante.
4. Tableau détaillé des caractéristiques (`caracteristiques[]`) : processeur, mémoire vive, stockage, carte graphique si applicable, écran et résolution, batterie, chargeur, ports, connectivité, système, clavier et langue lorsqu’il y en a, dimensions, accessoires inclus et compatibilité. Une information non confirmée va dans `manquants[]`, jamais dans le tableau.
5. De **10 à 20** situations d’utilisation adaptées au produit (`usages[]`), concrètes et distinctes.
6. Prix officiel vérifié, promotion KiffTech et prix promotionnel calculé (voir §4).
7. Médias du produit (voir §5).
8. Bouton/lien **« Fiche fabricant »** menant à la page officielle du modèle exact, et à la configuration exacte lorsqu’elle est proposée (voir §6).
9. Distinction accessoires inclus / compatibles vendus séparément / bundles réellement proposés (ne pas inventer de bundle). Article rédigé (`article`).

**États** : séparer **« Présent au catalogue »** (fiche réelle consultable, même si stock/prix actuel non confirmé) de **« Achetable maintenant »** (uniquement si prix final, variante, disponibilité, livraison et taxes sont confirmés). Le paiement n’est actif que dans ce second cas.

## 4. Prix et promotions

- Rechercher le **prix public officiel** du fabricant ou de sa boutique officielle pour le modèle/variante concerné. Enregistrer le **lien source**, la **devise** et la **date de vérification**.
- Calculer le **prix promotionnel KiffTech** en appliquant une réduction de **10 à 25 %** au prix officiel vérifié. Afficher distinctement : **prix officiel**, **pourcentage de réduction** et **prix promotionnel** obtenu. Le prix de référence doit être le prix officiel vérifié du fabricant (jamais estimé, concurrent ou inventé).
- **Devise** : conserver la devise de la source, sans conversion inventée. Panier multi-devises : conserver le comportement actuel (pas de total unique converti).
- **Si le prix officiel du modèle/variante n’est pas vérifiable** : ne pas inventer de prix ni de promotion ; indiquer que le prix officiel reste à vérifier et laisser le prix promotionnel indisponible.

## 5. Images et vidéos

- **Images** : au moins 3 et jusqu’à 5 images pertinentes par modèle. Google Images peut servir à repérer des sources possibles ; le filtre « droits d’usage » n’est qu’un point de départ. Ouvrir la **page d’origine** et vérifier : licence permettant l’usage prévu (y compris commercial), attribution requise, et correspondance exacte au modèle/variante. Ne pas télécharger une miniature Google ; ne pas considérer une image de boutique officielle comme libre de droits sans preuve.
- **Préférer** : flux d’affiliation autorisé, licence commerciale explicite, ou licence compatible usage commercial (ex. CC0, CC BY). **Écarter** : licences NC et toute image aux droits non vérifiables. **Interdit** : images générées par IA ; utiliser la seule présence dans Google Images comme preuve de licence ; copier/héberger sans autorisation.
- **Données à conserver par média utilisé** : URL/source originale, auteur/organisme, licence, attribution exigée, modèle/variante correspondant, date de vérification (et fichier local si hébergé).
- **Vidéos** : 1 à 2 vidéos correspondant exactement au modèle. Vidéo officielle ou dont les conditions autorisent clairement l’intégration ; privilégier l’intégration depuis la plateforme source (YouTube embed) lorsque le téléchargement/réutilisation du fichier n’est pas autorisé. Ne pas télécharger sans autorisation.
- **Si droits/modèle non confirmés** : ne pas intégrer le média, garder la fiche sans ce média et indiquer précisément ce qui manque. Ne jamais remplacer par l’image d’un modèle ressemblant.

## 6. Modèles, variantes et liens fabricant

- N’ajouter que des produits dont **marque, modèle exact et année de commercialisation** sont confirmés par une source fiable.
- Le bouton fabricant doit ouvrir le **chemin officiel le plus précis** disponible pour le modèle/configuration de la fiche : page produit exacte, puis variante/configuration correspondante si lien direct fourni. Pas de page d’accueil générale, pas de produit ressemblant, **pas d’URL fabriquée**. Si non vérifiable, le signaler dans la fiche.
- Distinguer accessoires inclus, compatibles vendus séparément et bundles réellement proposés. Ne pas inventer de bundle.

## 7. Règles de rédaction générales

- Français, ton factuel. Toute information non confirmée figure dans `manquants[]` et déclenche le badge « Fiche incomplète ».
- Aucune modification de la vitrine KeffStation, des DNS, de PayPal ou du backend dans le cadre du contenu.

## 8. Contrôle automatique

```bash
node tools/check-contenu.js            # audit, ne bloque pas
node tools/check-contenu.js --strict   # code 1 si une fiche existante est incomplète
node tools/check-contenu.js --complete # code 1 si un des couples prévus manque
node tools/check-contenu.js --json     # sortie machine
```

`--strict` porte sur les fiches existantes ; `--complete` porte sur la couverture globale.
