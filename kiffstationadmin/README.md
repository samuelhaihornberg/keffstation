# Kiffstation Admin

Tableau d'administration privé de **Keffstation**.

- Dépôt principal (PWA publique) : <https://github.com/samuelhaihornberg/keffstation>
- Accès : administrateur uniquement
- État : prototype validé + backend Supabase préparé (schéma, RLS, collecte)
- Aucun mot de passe, code PIN, clé SSH, clé secrète ou jeton admin ne doit être commité ici.

## Contenu

| Fichier | Rôle |
|---|---|
| `docs/ARCHITECTURE.md` | Architecture cible : données, métriques, graphique montagne, périodes, hébergement |
| `docs/SECURITY.md` | Règles de sécurité, accès minimum, 2FA, alertes, PayPal Sandbox |
| `docs/ROADMAP.md` | Étapes de mise en œuvre |
| `docs/SUPABASE_SETUP.md` | Création du projet Supabase, migrations, fonction de collecte |
| `prototype/` | Maquette statique légère, données fictives, aucune connexion réelle |
| `supabase/` | Schéma SQL, RLS, vues agrégées et fonction `ingest` |

## Prévisualiser le prototype

Depuis Termux :

```bash
cd ~/kiffstationadmin
node prototype/serve.js
```

Le terminal affiche l'URL exacte, par exemple :

```text
http://127.0.0.1:8080/prototype/
```

Si le port 8080 est occupé, le serveur essaie automatiquement le suivant.

Le prototype :

- ne contient aucune authentification ;
- ne contient aucune donnée réelle ;
- ne doit pas être déployé tel quel ;
- sert uniquement à valider le rendu et les interactions sur téléphone Android.

## Principe de connexion au site principal

Les deux dépôts ne sont pas reliés par SSH ni par un sous-module. La connexion réelle se fera par une **base de données et une API côté serveur** :

1. la PWA publique envoie des événements anonymisés ;
2. la base stocke les événements avec des règles d'accès strictes ;
3. l'administration lit uniquement des données agrégées, via une authentification et des fonctions serveur.

Aucune clé `service_role`, aucun jeton PayPal et aucun secret d'administration ne doit être présent dans le navigateur ou dans le dépôt.

## Backend Supabase

Le dossier `supabase/` contient tout le nécessaire :

- le schéma des tables ;
- les règles RLS (refus par défaut, lecture réservée à l'admin) ;
- les vues agrégées du tableau de bord ;
- la fonction `ingest` qui reçoit les événements anonymisés de la PWA ;
- la purge automatique des données anciennes.

La mise en place est détaillée dans `docs/SUPABASE_SETUP.md`.
La CLI Supabase ne fonctionne pas sous Android : le déploiement se fait par
l'interface web Supabase, sans SSH.
