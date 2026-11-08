# Prototype visuel — Administration Keffstation

Ce dossier contient une maquette statique, sans backend et sans authentification.

## Ce que montre le prototype

- graphique en montagne 3D sur base carrée ;
- sommet central représentant la fiabilité ;
- périodes 7 / 10 / 30 jours et dates personnalisées ;
- cartes visites, clics, formulaires, recherches ;
- onglets Clics, Formulaires, Recherches, Google Search Console, Fiabilité ;
- tableaux de détail et alertes récentes ;
- rendu léger : Canvas 2D, aucune librairie externe, aucun appel réseau.

## Ce qu'il ne fait pas

- aucune connexion à la PWA Keffstation ;
- aucune lecture de base de données ;
- aucune authentification ;
- aucune donnée réelle ;
- aucun paiement ;
- aucun envoi d'e-mail.

## Prévisualisation locale

Depuis Termux, à la racine du dépôt :

```bash
node prototype/serve.js
```

Le terminal affiche l'URL exacte, par exemple :

```text
http://127.0.0.1:8080/prototype/
```

Si le port 8080 est occupé, le serveur essaie automatiquement le suivant.
Le serveur écoute uniquement sur `127.0.0.1`. Ne pas l'exposer sur Internet.
Pour imposer un port : `PORT=8090 node prototype/serve.js`.

## Règles

- Ne pas déployer ce prototype tel quel.
- Ne jamais ajouter de mot de passe, clé ou jeton dans ces fichiers.
- La version de production utilisera une authentification et une base protégée côté serveur.
- La 2FA sera ajoutée avant la mise en ligne.
