---
lang: fr
original_lang: fr
title: COS Language: Guide complet des balises `<script_...>`
slug: cos-language-guide
reviewed: true
---

# COS Language: Guide complet des balises `<script_...>`

## Introduction

Le langage COS (Cos Operative System) utilise des balises `<script_...>` comme opérandes typés dans le graphe COS. Contrairement aux idées reçues, ces balises ne s'exécutent **jamais** : elles restent des descripteurs de nœuds dans le réseau de connexons.

## Structure des balises

Les balises `<script_...>` peuvent prendre plusieurs formes :

1. **Balise seule** : `<script_alphanumerotationdefonctionaconnecter>`
2. **Avec attributs** : `<script_... id="A1" valeur="X" nom="Y">`
3. **Avec contenu** : `<script_...>texte intérieur</script_...>`

## Règle de valorisation

La valeur retenue suit cet ordre de priorité :

1. Attribut `id`
2. Attribut `valeur`
3. Attribut `nom`
4. Contenu intérieur
5. Nom de la balise elle-même

**Exemple** :

```html
<script_alphanumerotationdefonctionaconnecter id="A1">
```

Résultat : `id` = "A1"

## Utilisation dans les connexions

Les balises `<script_...>` apparaissent dans les connexions COS :

```html
<script_alphanumerotationdefonctionaconnecter> to <script_founctionvaleuratribualphanumeroté>
```

Ce qui génère le lien :

- `de: "alphanumerotationdefonctionaconnecter"`
- `vers: "founctionvaleuratribualphanumeroté"`
- `op: "to"`
- `script: true` (indicateur, pas exécution)

## Cas particuliers

- **Attributs `A1`, `B2`** : deviennent `de: "A1"`, `vers: "B2"` avec `script: true`
- **CSS dans `<script_Alphanumerotation(aconnecter)>`** : le contenu est du CSS réel, les sélecteurs alphanumériques (`A1`) sont normalisés en `[data-cos="A1"]`
- **Interdits** : `@import`, `javascript:`, `expression(`, balises HTML, iframes

## Importance

Ces balises sont des **opérandes typés** qui structurent le graphe COS sans jamais être exécutées côté navigateur ou serveur. Elles permettent une analyse, un tri et un triage réseau sûrs.
