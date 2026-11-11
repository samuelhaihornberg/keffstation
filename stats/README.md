# 📊 Statistiques KeffStation

Page de statistiques de la plateforme : **vues** et **durée de consultation par page**,
**clics par lien et par bouton**, en graphiques 3D « montagnes ».

🔗 URL publique : <https://samuelhaihornberg.github.io/keffstation/stats/>

> **Les données sont réelles.** Aucun chiffre n'est simulé : la page consomme
> `data/live.json`, produit par le workflow *Collect Real Stats* à partir des API
> GitHub Traffic, Google Analytics 4 et Google Search Console.
> Voir **[SOURCES.md](SOURCES.md)** pour brancher les accès.

---

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html` | Page publique (KPI, sources, 4 scènes 3D, tables, import/export) |
| `css/style.css` | Thème sombre aligné sur la vitrine (palette `--cyan` / `--violet` / `--pink`) |
| `js/script.js` | Fusion des données (live + local + import), rendu, scènes 3D + repli 2D |
| `data/live.json` | **Données réelles** collectées (généré par le workflow, commité par le bot) |
| `../keff-stats.js` | Tracker partagé chargé sur **toutes** les pages de la plateforme |
| `../ga4.js` | Configuration Google Analytics 4 (partagée par toutes les PWA) |
| `../scripts/collect-stats.js` | Collecteur (GitHub Traffic + GA4 + Search Console) |

## Le tracker `keff-stats.js`

Script sans dépendance, chargé avec `<script defer src="../keff-stats.js"></script>`.
Il mesure et stocke dans `localStorage` (clé `keffstation_stats_v1`) :

- **vues** — 1 par chargement de page ;
- **durée** — temps passé sur la page (battement toutes les 5 s + `pagehide` / `visibilitychange`) ;
- **clics** — chaque clic sur un **lien** (`a[href]`) et chaque clic sur un **bouton**
  (`button`, `[role="button"]`, `input[type=button|submit]`), avec libellé et cible.

Les mêmes événements sont envoyés à Google Analytics (`gtag`) quand le tag est présent.

### API publique

```js
window.KeffStats.get();     // objet complet { pages, links, buttons }
window.KeffStats.page;      // chemin de la page courante ("kifftech/index.html")
window.KeffStats.export();  // JSON string
window.KeffStats.reset();   // efface les données locales
```

Opt-out sur un élément : `data-ks-track="off"`.

## Les graphiques 3D

Trois scenes indépendantes, montées avec **Three.js** (CDN unpkg, repli jsDelivr) —
**un graphique « montagnes » par statistique** :

| Carte | Hauteur | Largeur | Profondeur |
|---|---|---|---|
| **Montagnes des vues** | nombre de vues | clics | durée |
| **Montagnes de la durée de vue** | temps passé sur la page | clics | durée |
| **Montagnes des clics** | clics sur liens/boutons | clics | durée |

Chaque sommet est une page de la plateforme : survol = infobulle (valeur de la statistique,
clics, durée, durée moyenne), clic = ouverture du **détail de la page**.

### Vue par page sélectionnée

Quand une page est sélectionnée (clic sur une montagne, sur une ligne du tableau des pages,
ou via le bouton **📄 Page sélectionnée**), un panneau dédié s'ouvre :

- 4 KPI de la page (vues, clics, durée totale, durée moyenne) ;
- une **scène 3D montagnes** où chaque sommet est un **lien ou un bouton** de la page
  (hauteur = nombre de clics, couleur = intensité) ;
- la table des clics de la page ;
- le tableau global des clics se filtre automatiquement sur la page sélectionnée.

Un bouton **✕ Revenir à la plateforme** referme la vue et rétablit la vue d'ensemble.

### Barre de sélection

- **Affichage** : `🌐 Plateforme` / `📄 Page sélectionnée`
- **Statistique** : `📈 Vues` / `⏱️ Durée` / `👆 Clics` — la carte correspondante est mise en
  évidence (liseré cyan), et chaque carte dispose de son bouton *Voir cette statistique*.

### Interactions 3D

Glisser pour tourner, molette pour zoomer, survol d'une montagne pour le détail (infobulle),
clic pour sélectionner la page. Les scènes hors écran sont mises en pause (économie CPU/GPU).

**Repli 2D** : si le CDN est bloqué ou si WebGL est indisponible, un histogramme 2D est affiché
à la place — la page reste utilisable.

## Consolider plusieurs navigateurs

1. Sur le poste A : **Exporter JSON** → `keffstation-stats.json`.
2. Sur le poste B : **Importer** → le fichier → les totaux sont **fusionnés** avec les
   données réelles collectées et les données locales.
3. **Réinitialiser** vide les mesures locales (les données collectées sont conservées).

## Note sur les données

Les chiffres affichés proviennent de quatre sources, dont l'état est visible dans le
panneau **Sources des données** :

- **GitHub Traffic API** — vues et visiteurs uniques par chemin, pour chaque dépôt
  (keffstation, Factureboutique, Kifftech.store, critiques-services.com) ;
- **GA4 Data API** — vues, durée d'engagement et clics par lien/bouton ;
- **Search Console API** — clics et impressions de recherche par URL ;
- **ce navigateur** — mesures réalisées sur l'appareil du visiteur (`localStorage`).

Chaque page indique les sources qui l'ont alimentée.
