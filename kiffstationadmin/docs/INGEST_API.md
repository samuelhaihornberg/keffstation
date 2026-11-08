# Contrat de la fonction `ingest`

La PWA publique envoie des événements anonymisés à :

```text
POST https://<PROJECT_REF>.supabase.co/functions/v1/ingest
Content-Type: application/json
```

Aucun jeton, aucune clé et aucun cookie ne sont envoyés.

## Corps de la requête

```json
{
  "events": [
    {
      "type": "page_view",
      "sessionId": "identifiant-aléatoire-de-session",
      "occurredAt": "2026-11-07T14:32:00.000Z",
      "path": "/boutique",
      "deviceType": "mobile",
      "referrerDomain": "google.com",
      "elementType": "link",
      "elementId": "nav-boutique",
      "elementLabel": "Boutique",
      "metadata": {
        "duration_ms": 1200
      }
    }
  ]
}
```

### Limites

| Élément | Limite |
|---|---|
| Événements par requête | 25 maximum |
| Taille du corps | 16 Ko maximum |
| Événements par session | 120 par minute |
| Longueur des chaînes | 200 caractères (requête de recherche : 120) |

### Types d'événements acceptés

`page_view`, `click`, `tab_view`, `menu_open`, `form_start`, `form_submit`,
`form_success`, `form_error`, `search`, `payment_attempt`, `payment_result`,
`error`.

### Types d'éléments acceptés

`link`, `button`, `tab`, `menu`, `form`, `search`, `payment`.

### Clés de métadonnées acceptées

Toutes les autres clés sont ignorées :

- `query` (recherche interne, 120 caractères max) ;
- `results_count` ;
- `clicked_result_id` ;
- `form_id` ;
- `error_code` ;
- `payment_provider` ;
- `payment_status` ;
- `duration_ms`.

## Règles côté PWA

- Générer `sessionId` avec `crypto.randomUUID()` et le conserver dans
  `sessionStorage` (pas de cookie, pas d'empreinte de navigateur).
- Ne jamais envoyer de valeur de formulaire : nom, e-mail, téléphone, adresse,
  message, numéro de carte.
- Envoyer uniquement le chemin de la page, sans paramètres ni ancre.
- Ne pas envoyer l'URL de provenance complète, seulement le domaine.
- Regrouper les événements par lots de 25 maximum.
- Utiliser `fetch(..., { keepalive: true })` ou `navigator.sendBeacon`.
- Ignorer silencieusement les erreurs réseau : la mesure ne doit jamais gêner
  l'utilisateur.
- Ne pas suivre les robots ni les navigateurs sans JavaScript.

## Côté serveur

- L'identifiant de session est haché avec `SESSION_PEPPER` avant stockage.
- L'IP brute n'est jamais stockée.
- Les robots sont filtrés par User-Agent.
- Les dates trop anciennes (plus de 7 jours) ou futures sont ramenées dans une
  fenêtre valide.
- Les métadonnées sont filtrées par liste blanche.
- Les insertions utilisent la clé `service_role`, uniquement côté serveur.

## Réponses

| Code | Signification |
|---|---|
| `204` | Événements acceptés (ou robot ignoré) |
| `400` | Payload invalide |
| `403` | Origine non autorisée |
| `413` | Corps trop volumineux |
| `429` | Limite par session dépassée |
| `500` | Erreur de stockage |
