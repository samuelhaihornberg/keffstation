# KeffStation

Cube 3D des 6 PWAs : KiffTech, Tricktrocjob, ViArtificial, cos Editor, Linguistic Motors, Videogames.

## Aperçu

Interface "cube des applications" en HTML/CSS/JS pur (sans framework). Chaque face du cube donne accès à une PWA indépendante, embarquée dans un iframe ou accessible en nouvel onglet. Service Worker pour le cache hors-ligne, Web App Manifest pour l'installation sur écran d'accueil.

## Stack

- HTML5, CSS3, JavaScript (ES modules)
- Service Worker (`sw.js`) + Web App Manifest (`manifest.json`)
- GitHub Pages (statique, `.nojekyll` présent)

## Utilisation

```bash
git clone https://github.com/samuelhaihornberg/keffstation.git
cd keffstation
# Ouvrir index.html directement dans le navigateur, ou servir avec un serveur HTTP :
# python3 -m http.server 8000
# npx http-server -p 8000
```

Les 6 faces renvoient vers :
- **KiffTech** — https://samuelhaihornberg.github.io/Kiff-Tech/
- **Tricktrocjob** — https://samuelhaihornberg.github.io/keffjobtrictrocc/
- **ViArtificial labs** — https://samuelhaihornberg.github.io/ViArtificial/
- **cos Editor** — https://samuelhaihornberg.github.io/cos-editor/
- **Linguistic Motors** — https://samuelhaihornberg.github.io/linguistic-motors/
- **Videogames** — https://samuelhaihornberg.github.io/videogames/

## Déploiement

GitHub Pages activé, site servi depuis la branche `main`.

GitHub Pages : https://samuelhaihornberg.github.io/keffstation/

## Licence

Privé — tous droits réservés.
