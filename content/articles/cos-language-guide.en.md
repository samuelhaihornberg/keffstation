---
lang: en
original_lang: fr
original_file: cos-language-guide.md
title: COS Language: Complete guide to `<script_...>` tags
slug: cos-language-guide
translated: true
reviewed: true
---

# COS Language: Complete guide to `<script_...>` tags

## Introduction

The COS language (Cos Operative System) uses `<script_...>` tags as typed operands in the COS graph. Contrary to popular belief, these tags **never execute**: they remain node descriptors in the connections network.

## Tag structure

`<script_...>` tags can take several forms:

1. **Bare tag**: `<script_alphanumerotationdefonctionaconnecter>`
2. **With attributes**: `<script_... id="A1" value="X" name="Y">`
3. **With content**: `<script_...>inner text</script_...>`

## Value resolution rule

The retained value follows this priority order:

1. `id` attribute
2. `value` attribute
3. `name` attribute
4. Inner content
5. The tag name itself

**Example**:

```html
<script_alphanumerotationdefonctionaconnecter id="A1">
```

Result: `id` = "A1"

## Use in connections

`<script_...>` tags appear in COS connections:

```html
<script_alphanumerotationdefonctionaconnecter> to <script_founctionvaleuratribualphanumeroté>
```

This generates the link:

- `de: "alphanumerotationdefonctionaconnecter"`
- `vers: "founctionvaleuratribualphanumeroté"`
- `op: "to"`
- `script: true` (indicator, not execution)

## Special cases

- **Attributes `A1`, `B2`**: become `de: "A1"`, `vers: "B2"` with `script: true`
- **CSS inside `<script_Alphanumerotation(aconnecter)>`**: content is real CSS, alphanumeric selectors (`A1`) are normalized to `[data-cos="A1"]`
- **Forbidden**: `@import`, `javascript:`, `expression(`, HTML tags, iframes

## Importance

These tags are **typed operands** that structure the COS graph without ever being executed client-side or server-side. They enable safe analysis, sorting and network filtering.
