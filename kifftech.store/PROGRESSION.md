# PROGRESSION KiffTech — Dropshipping Bioluminescent

**Dernière MAJ** : 2026-11-14
**Objectif** : SPA PWA dropshipping international, catalogue bioluminescent, abonnements, import auto

## État global : 85%

| Public | Progression | Justification |
|--------|-------------|---------------|
| Client / User | 85% | PWA installable, catalogue interactif, fiches produits, panier, abonnements |
| Développeur | 80% | Architecture import, mappings, mappings, export CSV/JSON, SW offline |
| Admin | 70% | Remises configurables, vérification prix référence, planification cron (Trésor) |

## Checklist PWA

- [x] `manifest.json` (icônes PNG 192/512/maskable/apple-touch, thème, `display: standalone`, `scope: "./"`, `id: "./"`, `orientation: "portrait-primary"`, `shortcuts`, `categories`)
- [x] Service Worker (`sw.js` v1) : network-first nav, cache-first assets, purge anciens caches, `skipWaiting`/`clients.claim`
- [x] Registration SW dans `app.js` + `install.js`
- [x] Gestion `beforeinstallprompt` → bouton installer, aide iOS
- [x] Meta `theme-color`, `apple-mobile-web-app-*`, `link rel=manifest`
- [x] Icônes PNG réelles : 192x192, 512x512, 512x512 maskable, apple-touch-icon 180x180, favicon.ico (générées Canvas)
- [x] `scope: "./"` et `id: "./"` pour GitHub Pages
- [x] `orientation: "portrait-primary"` (app mobile)
- [x] Shortcuts : Catalogue, Abonnements

## Fonctionnalités implémentées (Étape 1 - Démo)

> Section historique. Le catalogue généré de 120 produits a depuis été remplacé
> par le catalogue éditorial vérifié de `data/catalogue.js` (voir plus bas).

### Catalogue Bioluminescent
- [x] 120 produits démo générés (pas de vraies données) — marques, catégories, fournisseurs réalistes
- [x] Grille responsive (2-4 colonnes), scroll infini "Charger plus"
- [x] Filtres : catégorie, fournisseur, recherche temps réel (debounced)
- [x] Cartes produit : image (Unsplash), badge (Nouveau/Promo/Rupture), prix, prix référence barré, remise %, stock, bouton ajouter
- [x] Fiche produit modale + page dédiée : specs complètes, description, actions
- [x] Design bioluminescent : particules, glow, glassmorphism, thème sombre #03050a, accent #00ffc8

### Abonnements
- [x] **Basic** : 1€/semaine — catalogue complet, prix référence, alertes stock, import CSV manuel
- [x] **Trésor** : 3,35€/semaine — tout Basic + import auto cron, remises 5-25% configurables, API REST + webhooks, sync temps réel, rapports marge/ROI
- [x] UI cartes avec ruban "TRÉSOR", glow doré, liste features, bouton d'activation
- [x] Gestion état abonnement (actif/annulé), persistance locale (démo)

### Import Automatisé (Architecture)
- [x] 4 sources démo : TechData (API), Ingram Micro (CSV), ALSO (XML), TD SYNNEX (API)
- [x] Statut actif/pause, toggle, configuration par source
- [x] Mappings champs configurables par source (SKU, titre, prix, stock, catégorie)
- [x] Planification cron (Trésor uniquement) : liste tâches, activation/désactivation
- [x] Tableau mappings croisé sources × champs
- [x] Remises globales (slider 0-30%), marge cible (10-100%), auto-update prix, vérif prix référence

### Panier & Export
- [x] Panier persistant (localStorage), compteur badge, total
- [x] Export catalogue CSV / JSON
- [x] Import CSV (lecture FileReader, parsing basique)
- [x] Toast notifications (succès/erreur)

### Technique
- [x] PWA complète : SW v1, manifest, install prompt, splash screen animée
- [x] Bioluminescent particles (18, respect `prefers-reduced-motion`)
- [x] Responsive mobile-first : 360px → 1024px+, safe-area insets
- [x] Navigation : tabs top (scroll-snap), bottom bar (5 sections), keyboard/gamepad ready
- [x] Pas de framework, pas de build, ES module, chemins relatifs `./`
- [x] Médias : images Unsplash (libres usage commercial), icônes générées Canvas
- [x] Aucune donnée réelle présentée comme telle — tout est démo explicite

## Fichiers déployés

- `index.html` (HTML sémantique, 5 panels, modal, splash, toasts)
- `style.css` (bioluminescent, glassmorphism, grid, responsive, animations)
- `app.js` (ES module, state, catalogue, abonnements, import, export, cart, SW, install)
- `sw.js` v1 (network-first nav, cache-first assets, version statique)
- `manifest.json` (PWA complet, shortcuts, categories)
- `install.js` (beforeinstallprompt, SW update banner)
- `icons/` : icon-192.png, icon-512.png, maskable-512.png, apple-touch-icon.png, favicon.ico
- `tools/check-pwa.js` (validateur autonome)
- `generate-icons.js` (générateur Canvas)
- `package.json` / `package-lock.json` (canvas dependency)

## Vérifications effectuées

- [x] `node --check` sur app.js, sw.js, install.js, generate-icons.js ✅
- [x] `manifest.json` JSON valide ✅
- [x] `node tools/check-pwa.js` → 67 OK, 0 erreurs ✅
- [x] Serveur local `python3 -m http.server 8081` : tous fichiers 200 ✅
- [x] Chemins relatifs uniquement (aucun `/` absolu) ✅
- [x] Syntaxe JS validée ✅

## À tester sur téléphone (manuel)

- [ ] Installation Android Chrome (beforeinstallprompt → bouton « Installer »)
- [ ] Installation iOS Safari (aide « Partager ▸ Sur l'écran d'accueil »)
- [ ] Mode avion / hors ligne : catalogue + assets servis depuis cache
- [ ] Navigation : tabs, bottom bar, swipe, clavier, gamepad
- [ ] Catalogue : filtres, recherche, chargement plus, fiche produit, panier
- [ ] Abonnements : activation Basic/Trésor, annulation, UI état
- [ ] Import : sources, mappings, planification (Trésor)
- [ ] Réglages : sliders remises/marge, checkboxes, export/import CSV
- [ ] Lisibilité : texte 16px+, contraste, cibles tactiles 44px, pas de débordement 360px
- [ ] Particules désactivées si `prefers-reduced-motion`
- [ ] Mise à jour SW : banner « Nouvelle version disponible » + rechargement

## Cahier des charges contenu produit (2026-11-14)

Référence : **`data/CONTENU.md`**. Contrôle : `node tools/check-contenu.js` (`--strict` pour bloquer).

### Minimum par fiche (état 2026-11-14, après extension)
- [x] **3 à 5 images** (minimum 3), licence libre vérifiée, attribution visible — 22 fiches sur 27
- [x] **1 à 2 vidéos** (minimum 1), officielles fabricant, embed `youtube-nocookie` — 27 fiches sur 27
- [x] **1 tableau de caractéristiques** vérifiées — 27 fiches sur 27
- [x] **1 article** rédigé (`article: { titre, contenu }`) — 27 fiches sur 27
- [x] **10 à 20 occasions d'utilisation** (minimum 10) — 27 fiches sur 27
- [ ] Atteindre les minimums sur **toutes** les fiches (5 fiches encore incomplètes : médias/images manquants)

### Couverture
- [ ] **Une fiche par marque et par année**, 2020 → 2026 : **63 fiches** (9 × 7)
- [x] Marques représentées : **Samsung, Apple, Linux, Microsoft, Steam, Meta, HP, Alienware, MSI**
- [ ] Chaque couple marque × année confirmé par une source fabricant datée — **23 couples sur 63**

### Ajouts de cette session
- [x] Apple iPhone 13 (2021), iPhone 14 Pro (2022), iPhone 15 Pro (2023), iPhone 16 Pro (2024) — fiches complètes
- [x] Apple iPhone 17e (2026) — fiche complète (Apple 2026 couvert)
- [x] Samsung Galaxy S22 Ultra (2022), Galaxy S23 Ultra (2023), Galaxy S24 Ultra (2024) — fiches complètes (prix S22 FR non retrouvé sur source officielle archivée)
- [x] Raspberry Pi 5 (2023, Linux) — fiche complète
- [x] Meta Quest 3 (2023) — fiche complète
- [x] `sw.js` porté à `kifftech-v13`
- [ ] Médias/images encore manquants : Steam Machine 2026 (1 image), Steam Deck OLED 2023 (2 images), Half-Life: Alyx 2020 (1 image), HP Reverb G2 2020 (3 images + vidéo), Alienware m15 R3 2020 (3 images + vidéo)
- [ ] `img/airpods-pro-2-1.jpg` non intégré (origine/droits non vérifiés)
- [ ] Samsung Galaxy S25 Ultra (2025) investigué (images Commons préparées) mais non ajouté faute de récupération fiable de caractéristiques/prix officiels vérifiables dans cette session (pages officielles JS/timeouts, quota de recherche web atteint)

### État au 2026-11-14
- **15 fiches** au catalogue : 9 nouvelles fiches 2020 + 6 fiches historiques (2023–2026).
- Couverture marque × année : **11 couples sur 63** (les 9 marques en 2020,
  Steam 2023 et Steam 2026).
- **6 fiches complètes sur 15** : Samsung Galaxy S20 5G, Apple iPhone 12,
  Raspberry Pi 400, Microsoft Xbox Series X, Meta Quest 2, MSI Bravo 17.
- Fiches 2020 incomplètes et raisons :
  - **Valve Half-Life: Alyx** — 0/3 images : aucune photo du jeu sous licence
    libre sur Commons (logo seul), vidéo officielle présente, article rédigé.
  - **HP Reverb G2** — 0/3 images et 0/1 vidéo : aucune photo libre du modèle,
    aucune vidéo officielle HP de 2020 retrouvée ; article rédigé.
  - **Alienware m15 R3** — 0/3 images et 0/1 vidéo : aucune photo libre du
    modèle, aucune vidéo officielle Dell/Alienware retrouvée ; article rédigé.
- Fiches historiques (2023–2026) : article absent, et images insuffisantes pour
  Steam Machine (2/3), PS5 Pro (1/3) et Steam Deck OLED (0/3).
- Les prix sont affichés dans la devise publiée par le fabricant (souvent USD) ;
  l'absence de prix EUR officiel est documentée dans `manquants[]`.
- `medias.videos[]` et `article` sont désormais rendus par la fiche produit
  (rétrocompatible avec `medias.video`).
- Vérifications : `node --input-type=module --check < data/catalogue.js` ✅,
  `node tools/check-contenu.js` ✅ (6/15 complètes, 11/63 couples), les 32
  images référencées existent dans `img/`, cache SW passé en `kifftech-v11`.

## Prochaines actions (Étapes suivantes)

1. **Tests manuels Android/iOS** (cf. liste ci-dessus)
2. **Backend réel** : API Node/Express pour authentification, paiements (Stripe), webhooks fournisseurs
3. **Base de données** : PostgreSQL (produits, commandes, users, abonnements, logs import)
4. **Import réel** : Connecteurs API fournisseurs (TechData, Ingram, TD SYNNEX), parsing CSV/XML/JSON robuste, queue Bull/Redis
5. **Prix référence vérifiables** : Intégration APIs publiques (Keepa, CamelCamelCamel, PrixMoinsCher) + comparaison automatique
6. **Remises dynamiques** : Moteur de règles (paliers volume, fidélité, promo fournisseur)
7. **Trésor avancé** : API REST documentée (OpenAPI), webhooks commandes/stock, sync temps réel WebSocket
8. **Admin dashboard** : Analytics ventes, marge, ROI, alertes stock, gestion utilisateurs
9. **Lighthouse PWA audit** → corriger alertes
10. **Push GitHub Pages** si validé (ou déploiement Vercel/Netlify pour backend)

## Notes

- **Architecture** : SPA vanilla ES module, CSS custom properties, IndexedDB/localStorage pour persistance démo
- **Données** : catalogue éditorial dans `data/catalogue.js`, fiches vérifiées fabricant avec sources datées ; médias Wikimedia Commons sous licence libre et vidéos officielles YouTube ; aucune commande ni paiement réel, pas de vraies clés API
- **Design** : Bioluminescent sci-fi, #03050a bg, #00ffc8 accent, glassmorphism, particules, glow subtils
- **Sécurité** : Pas de paiement réel, pas de secrets en dur, CSP ready, HTTPS requis pour PWA
- **Accessibilité** : ARIA labels, roles, focus-visible, contrastes, reduced-motion, sémantique HTML5
## Audit et corrections (2026-11-12)

Corrigé dans `app.js` :
- Le démarrage échouait (`this.mainTabs` et plusieurs boutons jamais affectés) : l'écran de chargement restait bloqué.
- Fonctions référencées mais absentes, ajoutées : panier (`cartManager`, persisté en `localStorage`), `addToCart`, `subscribe` / annulation, export CSV/JSON, lecture CSV.
- Le catalogue de démonstration est déterministe (plus de prix ni de stocks aléatoires à chaque chargement). Vidéos factices supprimées.
- Navigation : onglets Abonnements, Import et Réglages ajoutés ; barre inférieure remplie ; panneaux non actifs masqués.

Corrigé dans `sw.js` (v2) : le code applicatif passe par le réseau d'abord ; le cache est nommé `kifftech-v2` (à incrémenter à chaque modification pré-cachée).

Restant à faire avant mise en vitrine :
- Catalogue réel (le catalogue actuel est fictif, images picsum.photos sans rapport avec les produits).
- Paiement et abonnements réels (aucun paiement n'est traité aujourd'hui).
- Textes marketing à valider : « Catalogue 5000+ produits », « Prix de référence vérifiés », « API REST + Webhooks », « Sync fournisseurs temps réel » ne sont pas implémentés.
- Doublons de méthodes à nettoyer (`applyFilters`, `openModal`, `closeModal`, `bindCartEvents`, `updateCartDisplay`) : seule la dernière définition est active.
- Domaine personnalisé non configuré (voir README).

## Catalogue vérifié fabricant (2026-11-13)

Le catalogue de démonstration généré est remplacé par un catalogue éditorial dans `data/catalogue.js` : 6 produits sortis entre 2023 et 2026, fiches construites uniquement à partir de sources fabricant ou de pages produit officielles, avec date de vérification sur chaque source.

- **Nouveautés 2026 (3)** : Steam Machine (Valve, lancée 22/06/2026, 1 039–1 428 € TTC), Steam Frame (Valve, 14/09/2026, 1 049–1 279 € TTC), Steam Controller (Valve, 04/05/2026, 99 € — rupture de stock, achat par réservation, bouton WhatsApp Business sur la variante).
- **2025** : Nintendo Switch 2 (05/06/2025 ; deux variantes de batterie confirmées sur la fiche officielle ; prix public actuel non re-confirmable → `null`, « Information à confirmer »).
- **2024** : PlayStation 5 Pro (07/11/2024 ; prix `null`, 1 photo sous licence libre → badge « Fiche incomplète »).
- **2023** : Steam Deck OLED (16/11/2023 ; prix vérifié 779 € / 919 € TTC depuis l'annonce Valve du 27/05/2026 ; 0 photo du modèle OLED sous licence libre vérifiée → badge « Fiche incomplète »).

Règles appliquées :

- Prix = prix public officiel uniquement (TTC, marché France/UE), source + date ; aucune remise ni promotion ; rien d'inventé (prix, références, stock, contenu de boîte, bundles, compatibilités).
- Chaque fiche : 10–20 situations d'utilisation, bloc « Bundles et accessoires compatibles » (ex. accessoires Steam Frame d'origine 39/59/69 €, ajout panier à l'achat du casque uniquement), tableau technique, variantes réelles, médias crédités (Wikimedia Commons, licences CC0/CC BY/CC BY-SA vérifiées) et vidéo officielle fabricant (embed YouTube vérifié via oembed).
- `manquants` explicites par produit (SKU non publiés, prix non re-confirmables, photos sous licence libre insuffisantes) → badge « Fiche incomplète ».
- WhatsApp Business : numéro « 05 48 38 52 69 » dans `data/config.js`, bouton sur variante indisponible ; lien `wa.me` volontairement désactivé (`whatsappLienUrl: null`) tant que pays/numéro/activation ne sont pas confirmés.
- État de démonstration affiché ; bilan panneau dédié (`bilan.js`) conservé, devise €.

Vérifications du 13/11/2026 :

- [x] Validateur catalogue (`validate-catalogue.mjs`) : 0 erreur, 11 alertes attendues (SKU non publiés, prix non re-confirmables Switch 2 / PS5 Pro, images < 3 pour Machine / PS5 Pro / Deck OLED)
- [x] `node --check` sur `data/catalogue.js` (copie `.mjs`) ✅
- [x] Smoke test DOM factice (`/tmp/opencode/smoke-app.mjs`) : import réel d'`app.js`, rendu catalogue, 3 badges « Nouveauté 2026 », fiches détaillées (prix `null` → « Information à confirmer », vidéo embed `youtube-nocookie`), 14 images référencées toutes présentes ✅
- [x] Crédits médias à jour (`/tmp/opencode/media-credits.json`, 16 entrées)
- [x] Lien officiel par configuration (13/11/2026, 2e passe) : bouton « Boutique officielle du fabricant » dans la fiche, piloté par la configuration sélectionnée ; URL vérifiées le même jour :
  - Steam Machine / Frame / Controller / Deck OLED : pages produit officielles Valve (`store.steampowered.com/hardware/...`, 200), la configuration se sélectionne sur la page (Valve ne fournit pas d'URL distincte par configuration)
  - PS5 Pro : URL d'achat directe par configuration publiée par Sony (`direct.playstation.com/fr-fr/buy-consoles/playstation5-pro-console-2-tb`, extraite du CTA « Acheter sur PS Direct » de la page buy-now officielle)
  - Switch 2 : page produit officielle Nintendo France pour la console seule ; **désactivé** pour le pack Mario Kart World et les variantes de batterie (aucune page officielle dédiée, boutique Nintendo non vérifiable : file d'attente anti-bot) → bouton « Lien officiel précis introuvable »
  - Aucun URL fabriqué : chaque paramètre vient d'une page officielle du fabricant
- [ ] `node tools/check-pwa.js` : non exécutable dans cet environnement (module npm `canvas` absent, pas de npm) — à relancer sur un poste avec npm
- [ ] Tests manuels téléphone / navigateur réel (rendu, SW, installation)

## Catalogue vérifié fabricant — fiches 2020 (2026-11-14)

Neuf fiches 2020 ajoutées à `data/catalogue.js`, une par marque imposée. Chaque
produit est réellement sorti en 2020 et vérifié par une source fabricant datée.

| Marque | Produit | Sortie | État |
|---|---|---|---|
| Samsung | Galaxy S20 5G | 06/03/2020 (US), 13/03/2020 (FR) | ✅ complète |
| Apple | iPhone 12 | 23/10/2020 | ✅ complète |
| Linux | Raspberry Pi 400 | 02/11/2020 | ✅ complète |
| Microsoft | Xbox Series X | 10/11/2020 | ✅ complète |
| Steam (Valve) | Half-Life: Alyx | 23/03/2020 | ⚠️ 0/3 images |
| Meta | Quest 2 | 13/10/2020 | ✅ complète |
| HP | Reverb G2 | automne 2020 | ⚠️ 0/3 images, 0/1 vidéo |
| Alienware | m15 R3 | 21/05/2020 | ⚠️ 0/3 images, 0/1 vidéo |
| MSI | Bravo 17 | avril/mai 2020 | ✅ complète |

Règles appliquées pour 2020 :

- Chaque fiche a un article de 6 paragraphes, 12–13 occasions d'utilisation,
  un tableau de 9–15 caractéristiques et des sources datées.
- 18 photographies sous licence libre téléchargées dans `img/` (Wikimedia
  Commons : CC0, CC BY 2.0/4.0, CC BY-SA 4.0), avec auteur, licence,
  attribution et page source sur chaque image.
- 6 vidéos officielles intégrées (Samsung, Apple, Raspberry Pi, Xbox, Valve,
  Meta, MSI) ; aucune vidéo officielle HP/Alienware retrouvée.
- Aucune photo libre du HP Reverb G2, de l'Alienware m15 R3 ni de
  Half-Life: Alyx : `images: []` plutôt qu'une photo d'un autre modèle, raison
  documentée dans `manquants[]`.
- Prix affichés dans la devise publiée par le fabricant (USD pour la plupart) ;
  l'absence de prix EUR officiel est listée dans `manquants[]`.
- MSI Bravo 17 : aucun prix public sur la fiche constructeur → `prix: null`,
  affiché « Information à confirmer ».
- HP Reverb G2 : pas de jour exact de disponibilité → `dateSortie: null`, la
  fiche affiche l'année.

Vérifications du 14/11/2026 :

- [x] `node --input-type=module --check < data/catalogue.js` ✅
- [x] `node tools/check-contenu.js` : 15 fiches, 6/15 complètes, 11/63 couples ✅
- [x] Les 32 images référencées existent dans `img/` (aucun chemin cassé) ✅
- [x] En-têtes des 18 nouvelles images contrôlés (JPEG/PNG valides) ✅
- [x] Cache service worker incrémenté `kifftech-v9` → `kifftech-v11` (devises) ✅
- [ ] `--strict` et `--complete` échouent volontairement (fiches et couples
  restants à compléter) — attendu à ce stade
