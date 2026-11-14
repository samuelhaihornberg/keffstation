# KiffTech

Catalogue de démonstration en PWA (Progressive Web App) : objets connectés et gadgets, abonnements, panier.

## Adresse de publication

- GitHub Pages : https://samuelhaihornberg.github.io/Kifftech.store/
- Domaine personnalisé : non configuré à ce jour (voir « Domaine »).

## Fonctionnement

- HTML, CSS et JavaScript sans framework ni étape de build. Tous les chemins sont relatifs (`./`).
- Service worker `sw.js` : le code (HTML, JS, CSS) passe toujours par le réseau d'abord ; les icônes sont mises en cache.
- Données : catalogue dans `data/catalogue.js` — produits sortis entre 2020 et 2026, caractéristiques et prix vérifiés auprès des sources fabricant (Samsung, Apple, Raspberry Pi, Microsoft, Valve, Meta, HP, Alienware, MSI, Nintendo, Sony), chaque fiche listant ses sources et sa date de vérification. L'app reste en **démonstration** : aucune commande ni paiement n'est possible ; les informations non confirmées sont affichées « Information à confirmer » (badge « Fiche incomplète »).
- Liens officiels : dans chaque fiche, le bouton « Boutique officielle du fabricant » ouvre la page officielle correspondant à la configuration sélectionnée (URL vérifiées et datées). Si aucune page officielle directe n'existe pour la configuration (ex. pack Mario Kart World, variantes de batterie Switch 2), le bouton est désactivé avec la mention « Lien officiel précis introuvable » ; aucun lien de remplacement (accueil, recherche, plateforme générique, modèle ressemblant) n'est utilisé.
- Médias : photographies sous licence libre (Wikimedia Commons, auteur et licence vérifiés, attribution affichée sous chaque image) et vidéos officielles fabricant intégrées via YouTube (embed `youtube-nocookie.com`).
- Devises : chaque prix est affiché dans la devise publiée par le fabricant (`EUR`, `USD`…), sans conversion. Le panier calcule un sous-total par devise et n'affiche aucun total global lorsque plusieurs devises sont présentes.
- Panier et abonnements : enregistrés dans le navigateur (`localStorage`). Aucun paiement n'est traité.
- Aucune dépendance à un service externe pour fonctionner.

## Cahier des charges du contenu

Le contenu attendu pour chaque fiche est défini dans **`data/CONTENU.md`** :

- **3 à 5 images minimum** (3 au minimum, licence libre vérifiée et attribution visible) ;
- **1 à 2 vidéos minimum** (1 au minimum, officielles fabricant, embed `youtube-nocookie`) ;
- **un tableau de caractéristiques** vérifiées ;
- **un article** rédigé par produit ;
- **10 à 20 occasions d'utilisation minimum** (10 au minimum).

Couverture visée : **une fiche par marque et par année de 2020 à 2026**, soit
**9 marques × 7 années = 63 fiches**, avec Samsung, Apple, Linux, Microsoft,
Steam, Meta, HP, Alienware et MSI (voir `data/CONTENU.md`).

Audit de l'état courant :

```bash
node tools/check-contenu.js            # rapport, ne bloque pas
node tools/check-contenu.js --strict   # échoue si une fiche existante est incomplète
node tools/check-contenu.js --complete # échoue si un des 63 couples manque
```

État au 14/11/2026 : **27 fiches**, **22 fiches complètes**, **23 couples marque × année couverts sur 63**.
Ajouts récents : iPhone 13/14 Pro/15 Pro/16 Pro/17e, Galaxy S22/S23/S24 Ultra, Raspberry Pi 5, Meta Quest 3.
Fiches encore incomplètes faute de médias libres/vérifiés : Steam Machine (2/3 images), Steam Deck OLED (1/3), Half-Life: Alyx (2/3), HP Reverb G2 (0/3 images, 0/1 vidéo), Alienware m15 R3 (0/3 images, 0/1 vidéo). `img/airpods-pro-2-1.jpg` reste non intégré (origine/droits non vérifiés). Service worker : `kifftech-v13`.

## Lancer en local

```bash
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000/. Le service worker ne fonctionne qu'en HTTPS ou sur localhost : ouvrir `index.html` directement ne suffit pas.

## Publier une mise à jour

1. Modifier les fichiers.
2. Si un fichier pré-caché change (liste `PRECACHE_ASSETS` ou code), incrémenter `CACHE_NAME` dans `sw.js`.
3. Pousser sur `main` : GitHub Pages reconstruit le site (le dépôt ne contient aucun workflow de déploiement).

## Domaine

- kiftech.store n'est pas enregistré au moment de la vérification (registre RDAP : « available for registration »). Aucune redirection n'est définie dans ce dépôt.
- Pour utiliser un domaine : l'enregistrer ou le restaurer chez le registrar, configurer les DNS, puis renseigner le domaine dans Settings → Pages → Custom domain.
- Ne pas ajouter de fichier `CNAME` avant que le DNS soit prêt : l'URL GitHub Pages pourrait être redirigée vers un domaine injoignable.

## Icônes

```bash
npm install
node generate-icons.js
```

Le paquet `canvas` n'est requis que pour générer les icônes, pas pour exécuter l'application.

## Licence

Privé — tous droits réservés.
