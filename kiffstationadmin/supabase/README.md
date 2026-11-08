# Backend Supabase

| Élément | Rôle |
|---|---|
| `migrations/0001_schema.sql` | tables, contraintes, index |
| `migrations/0002_rls_and_views.sql` | RLS, liste blanche admin, vues agrégées |
| `migrations/0003_retention.sql` | purge automatique (90 jours / 1 an) |
| `functions/ingest/index.ts` | collecte d'événements anonymisés |
| `.env.example` | noms des secrets à définir dans Supabase |
| `config.toml` | configuration CLI (JWT désactivé pour `ingest`) |

## Ordre d'exécution

Suivre `docs/SUPABASE_SETUP.md`.

## Règles

- Aucun secret dans ce dossier.
- La clé `service_role` reste dans les secrets Supabase.
- La PWA n'envoie aucun jeton : `verify_jwt = false` pour `ingest`.
- Les tables sont en refus par défaut ; seul l'admin authentifié peut lire.
- Les valeurs de formulaire ne sont jamais stockées dans les événements.
