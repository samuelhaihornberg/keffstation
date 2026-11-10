# 📡 Statistiques réelles — sources et configuration

La page `/stats/` n'affiche **aucune donnée simulée**. Elle consomme
`stats/data/live.json`, produit automatiquement par le workflow
[Collect Real Stats](https://github.com/samuelhaihornberg/keffstation/actions/workflows/stats-collect.yml).

```
Actions → Collect Real Stats → Run workflow   (manuel)
```

Le workflow tourne aussi **chaque jour à 05:17 UTC** et committe le fichier
si les données ont changé.

---

## Les 4 sources

| Source | Ce qu'elle mesure | Clé secrète requise | Obligatoire |
|---|---|---|---|
| **GitHub Traffic API** | vues + visiteurs uniques **par chemin**, par dépôt | `GH_TRAFFIC_TOKEN` | non |
| **GA4 Data API** | vues, durée d'engagement, **clics par lien et par bouton** | `GA4_PROPERTY_ID` + `GA4_SERVICE_ACCOUNT_JSON` | non |
| **Search Console API** | clics et impressions de **recherche** par URL | `GSC_SITE_URL` + `GSC_SERVICE_ACCOUNT_JSON` | non |
| **Ce navigateur** | vues, durée et clics mesurés sur l'appareil du visiteur | — (localStorage) | toujours |

Chaque source est indépendante : le workflow collecte ce qui est configuré et
n'écrit le fichier que si **au moins une** a répondu.

> ⚠️ Les secrets ne sont **jamais** exposés dans le navigateur : ils vivent
> uniquement dans les secrets du workflow. `live.json` est un fichier public
> contenant uniquement des chiffres agrégés.

---

## 1. GitHub Traffic API

C'est la source la plus simple : elle donne le trafic **réel** de toutes tes
PWA (et de leurs URL), y compris celles qui n'ont pas de tag Analytics.

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens**
   → **Tokens (classic)** → *Generate new token (classic)*.
2. Coche **`public_repo`** (tes dépôts sont publics) — ou `repo` si tu veux
   couvrir des dépôts privés.
3. Copie le token et crée le secret Actions :
   `Settings` → `Secrets and variables` → `Actions` → `New repository secret`
   → Nom : **`GH_TRAFFIC_TOKEN`**.

> L'API Traffic ne conserve que **14 jours glissants** et ne compte que les
> vues des 14 derniers jours. `GITHUB_TOKEN` (le token intégré d'Actions) ne
> donne **pas** accès à cette API : il faut un PAT.

---

## 2. Google Analytics 4 (Data API)

Ta propriété existe déjà (`G-WP6HC0CM9E`), mais **le tag n'était pas
configuré** : la bibliothèque était chargée sans appel à `gtag('config')`,
donc GA4 ne recevait rien. C'est corrigé (`ga4.js`, inclus sur toutes les PWA).

Pour récupérer les données côté serveur, il faut un **compte de service** :

1. [console.cloud.google.com](https://console.cloud.google.com) → crée un
   projet (ou prends celui qui héberge GA4).
2. **APIs & Services** → **Library** → active **Google Analytics Data API**.
3. **APIs & Services** → **Credentials** → *Create credentials* →
   **Service account** → note l'**adresse e-mail** du compte
   (`xxx@xxx.iam.gserviceaccount.com`).
4. **Keys** → *Create new key* → **JSON** → copie tout le contenu.
5. Dans **GA4** → *Admin* → **Property Access Management** → *Add users* →
   colle l'e-mail du compte de service → rôle **Viewer** (ou Analyst).
   *(le compte de service n'apparaît pas dans la liste : ajoute-le par e-mail)*
6. **GA4** → *Admin* → **Property Settings** → copie le **Property ID**
   (un nombre, ex. `123456789` — pas le `G-XXXX`).
7. Dans le dépôt → *Secrets and variables* → *Actions* → crée :
   - **`GA4_PROPERTY_ID`** = `123456789`
   - **`GA4_SERVICE_ACCOUNT_JSON`** = le contenu complet du fichier JSON
     (collé tel quel, accolades comprises).

Ce que la page en tire :
- **vues par page** (`screenPageViews`),
- **durée par page** (`userEngagementDuration`),
- **clics par lien et par bouton** (événements `keff_link_click` et
  `keff_button_click` envoyés par `keff-stats.js`, avec le libellé et la cible).

---

## 3. Google Search Console

Search Console donne le trafic **issu de Google** : clics, impressions, CTR et
position moyenne par URL. C'est la seule source qui rende compte de ton
référencement.

Deux méthodes possibles :

### A. Compte de service (recommandé)

1. Same as above : active **Search Console API** dans le projet Google Cloud.
2. Crée le secret **`GSC_SERVICE_ACCOUNT_JSON`** (même clé JSON).
3. Dans **Search Console** → *Paramètres* → *Utilisateurs et associations* →
   *Ajouter un utilisateur* → colle l'e-mail du compte de service →
   permission **Lecture seule** (ou « Propriétaire de l'ensemble du site »
   pour un site au niveau du domaine).
4. Crée le secret **`GSC_SITE_URL`** avec l'identifiant du site :
   - site au niveau du domaine : `sc-domain:samuelhaihornberg.github.io`
   - préfixe d'URL : `https://kiffstation.com/`

### B. OAuth2 (si tu préfères un compte Google personnel)

Crée un secret client OAuth de type *Application Web* dans Google Cloud, puis
3 secrets : **`GSC_CLIENT_ID`**, **`GSC_CLIENT_SECRET`**,
**`GSC_REFRESH_TOKEN`**.

---

## 4. Vérifier que ça marche

1. Lance le workflow **manuellement**.
2. Ouvre l'onglet **Summary** du run : le récapitulatif indique quelle source
   a répondu.
3. La page `/stats/` affiche alors le panneau **Sources des données** avec
   l'état de chaque source (actif / inactif + la raison).
4. `stats/data/live.json` est commité par le bot : tu peux le consulter
   directement dans GitHub.

> ⏳ Les données GA4 et Search Console ont un délai de quelques heures :
> une collecte immédiate peut renvoyer des chiffres incomplets. La collecte
> quotidienne prend le relais.

---

## Anatomie de `live.json`

```jsonc
{
  "generated": "2026-11-10T05:17:12.000Z",
  "real": true,
  "window": { "days": 30, "from": "2026-10-11", "to": "2026-11-10" },
  "sources": {
    "github": { "ok": true, "repos": [ /* par dépôt */ ] },
    "ga4":    { "ok": true, "property": "123456789", "totals": { } },
    "gsc":    { "ok": true, "site": "sc-domain:…", "totals": { } }
  },
  "pages": {
    "keffstation": {
      "index.html": {
        "label": "Vitrine KeffStation",
        "views": 500,        // GA4 + GitHub
        "uniques": 200,     // GitHub
        "clicks": 165,       // GA4 (événements)
        "duration": 3600,    // GA4 (engagement)
        "search_clicks": 120,// Search Console
        "impressions": 3400,
        "sources": ["github", "ga4", "gsc"]
      }
    },
    "Factureboutique": { "…": { } }
  },
  "links":   { "keffstation": { "index.html||Kifftech|…": { "count": 120 } } },
  "buttons": { "keffstation": { "index.html||⛶|#btn-capture": { "count": 45 } } },
  "totals": { "views": 0, "clicks": 0, "duration": 0 }
}
```

## Lancer la collecte en local

```bash
GH_TRAFFIC_TOKEN=ghp_… GA4_PROPERTY_ID=123456789 \
GA4_SERVICE_ACCOUNT_JSON='{…}' GSC_SITE_URL=sc-domain:… \
node scripts/collect-stats.js
```

Le script n'écrit `stats/data/live.json` que si au moins une source a répondu,
et ne journalise jamais un secret.
