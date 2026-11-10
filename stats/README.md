# 📊 Statistiques publiques — KeffStation

Page publique de statistiques de la plateforme : **vues** et **durée de consultation par page**,
**clics par lien et par bouton**, le tout en graphiques 3D « montagnes ».

🔗 URL publique : <https://samuelhaihornberg.github.io/keffstation/stats/>

---

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html` | Page publique (KPI, 2 scènes 3D, tables, import/export) |
| `css/style.css` | Thème sombre aligné sur la vitrine (palette `--cyan` / `--violet` / `--pink`) |
| `js/script.js` | Fusion des données, rendu des tableaux, scènes 3D (Three.js) + repli 2D |
| `data/stats.json` | Base de référence versionnée (données de démonstration) |
| `../keff-stats.js` | Tracker partagé chargé sur **toutes** les pages de la plateforme |

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

Deux scènes indépendantes, montées avec **Three.js** (CDN unpkg, repli jsDelivr) :

1. **Montagnes des vues** — hauteur = nombre de vues, largeur = clics, profondeur = durée ;
2. **Montagnes de la durée de vue** — hauteur = temps passé sur la page.

Interactions : glisser pour tourner, molette pour zoomer, survol d'une montagne pour le détail
(infobulle), clic pour mettre en évidence la ligne correspondante du tableau.

**Repli 2D** : si le CDN est bloqué ou si WebGL est indisponible, un histogramme 2D est affiché
à la place — la page reste utilisable.

## Consolider plusieurs navigateurs

1. Sur le poste A : **Exporter JSON** → `keffstation-stats.json`.
2. Sur le poste B : **Importer** → le fichier → les totaux sont **fusionnés** avec la base
   de référence et les données locales.
3. **Réinitialiser** vide les mesures locales (la base de référence est conservée).

## Note sur les données

Les mesures sont **locales au navigateur** : elles reflètent la navigation de chaque visiteur.
La base de référence (`data/stats.json`) est versionnée dans le dépôt pour disposer d'un jeu
cohérent de démonstration. Pour des chiffres globaux, les mêmes événements sont envoyés à
Google Analytics.
