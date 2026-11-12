# KeffStation

Cube 3D des 4 PWAs : KiffTech, ViArtificial, Videogames, Blogum.

## Aperçu

Interface "cube des applications" en HTML/CSS/JS pur (sans framework). Chaque face du cube donne accès à une PWA indépendante, embarquée dans un iframe ou accessible en nouvel onglet. Web App Manifest pour l'installation sur écran d'accueil. **Pas de Service Worker ni de cache hors-ligne.**

## Stack

- HTML5, CSS3, JavaScript (ES modules)
- Web App Manifest (`manifest.json`) — pour l'installation sur écran d'accueil
- GitHub Pages (statique, `.nojekyll` présent)

## Les 4 PWAs

| Face | PWA | URL | Description |
|------|-----|-----|-------------|
| **KiffTech** | KiffTech.store | https://samuelhaihornberg.github.io/Kiff-Tech/ | Objets connectés & gadgets (2020-2026). Promotions de −10 % à −25 % sur les prix officiels. File d'attente fournisseur grossiste. |
| **ViArtificial** | ViArtificial | https://samuelhaihornberg.github.io/ViArtificial/ | Superbots, conversation, NLP/LLM local, assistants IA. |
| **Videogames** | Videogames | https://samuelhaihornberg.github.io/videogames/ | Jeux rétro, émulation, configurations, roms. Stick-Emoji : RollsPunch, Police-Criminal-homeoflaw. |
| **Blogum** | Blogum | https://samuelhaihornberg.github.io/keffstation/blogum/ | Blog maker, profil social network, rencontres, sphères d'audience, réactions émotionnelles. |

## Identification des sources

Chaque PWA possède un fichier `version.json` suivant sa dernière mise à jour et son statut :

- `kifftech/version.json` — KiffTech Store
- `viartificial-labs/version.json` — ViArtificial Labs
- `videogames/version.json` — Videogames
- `blogum/version.json` — Blogum

Mise à jour via les workflows GitHub Actions (`deploy.yml`, `boutique-sync.yml`, `stats-collect.yml`, `sync-impact.yml`).

## Utilisation

```bash
git clone https://github.com/samuelhaihornberg/keffstation.git
cd keffstation
# Ouvrir index.html directement dans le navigateur, ou servir avec un serveur HTTP :
# python3 -m http.server 8000
# npx http-server -p 8000
```

## Déploiement

GitHub Pages activé, site servi depuis la branche `main`.

GitHub Pages : https://samuelhaihornberg.github.io/keffstation/

## Workflow de surveillance

Un workflow horaire (`workflow-status.yml`) vérifie l'état de tous les pipelines :
- Affiche le statut global (✅ TOUT VERT ou ⚠️ DES ÉCHECS)
- Note la dernière mise à jour
- Permet de relancer les workflows en échec en boucle jusqu'obtention du statut vert

## Licence

Privé — tous droits réservés.