---
lang: en
original_lang: fr
original_file: pwa-seo-guide.md
title: Technical SEO for PWAs: KeffStation Guide
slug: pwa-seo-guide
translated: true
reviewed: true
---

# Technical SEO for PWAs: KeffStation Guide

## Introduction

SEO optimization for Progressive Web Apps (PWA) follows specific principles while respecting classic natural referencing best practices.

## Verified technical SEO elements

### 1. robots.txt file
```
User-agent: *
Allow: /
Sitemap: https://samuelhaihornberg.github.io/keffstation/sitemap.xml
```
This file allows search engines to index all accessible pages.

### 2. Sitemap.xml
The sitemap.xml contains the main URLs of the site with their priorities and update frequencies:
- Home page (priority: 1.0)
- Subfolders kifftech, viartificial-labs, tricktrocjob, videogames, linguistic-motors (priority: 0.7-0.9)
- Last modification dates: 2026-11-07

### 3. Essential meta tags
- `viewport`: responsive design
- `theme-color`: application theme color
- `description`: unique content per page
- `keywords`: relevant terms (not artificially repeated)

### 4. JSON-LD structured data
Each main page has a JSON-LD block with:
- Type `Store` with name, description, URL
- `alternateName` for name variants
- Local address (France for KeffStation)
- Optional fields depending on page type

### 5. Open Graph & Twitter Cards
- `og:title`, `og:description`, `og:url`, `og:type`, `og:site_name`, `og:image`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- Ensure proper sharing on social networks

## SEO best practices

### Unique content
Each page must have unique content faithful to its subject. Avoid duplication between sub-sites.

### H1/H2 structure
- The `<title>` tag serves as main heading
- Sub-sections use logical H2/H3 hierarchy
- No level skipping (H2 after H4 for example)

### Image alt texts
All significant images must have a descriptive `alt` text. Decorative icons can have `alt=""`.

### Internal links
- Consistent link structure between pages of the same site
- Descriptive anchor text (not "click here")
- Links to the most important pages from the home page

### Canonical URLs
The canonical URL is the actual GitHub Pages URL:
`https://samuelhaihornberg.github.io/keffstation/`

No `<link rel="canonical">` tag is necessary since there is no duplicated content between different URLs.

## Points of attention

### Keywords
Use natural and relevant terms, without keyword stuffing. The current keyword list has been streamlined to keep only truly relevant terms.

### Duplicate content
Each sub-site (kifftech, viartificial-labs, etc.) has its own targeted content. No duplication is intentional.

### Google Search Console verification
After going live, it is recommended to:
1. Add the site to Google Search Console
2. Submit the sitemap.xml
3. Monitor indexing errors
4. Check search performance

### No guaranteed results
SEO optimization improves visibility but does not guarantee a specific ranking or traffic increase. Google's algorithms are numerous and depend on many factors.

## Modified files

This guide refers to the following project files:
- `index.html`: SEO metadata
- `sitemap.xml`: site URL
- `robots.txt`: indexing rules
- `vitrine.css`: showcase style
- `manifest.json`: PWA metadata
