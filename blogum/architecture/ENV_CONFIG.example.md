# Blogum — Variables de configuration & points de configuration (gabarit)

## 1) Côté client PWA (public, build/deploiement statique)
> À n’utiliser qu’avec des règles d’accès serveur/BD (RLS) strictes. **Aucune clé secrète / service_role ici. Aucun secret GitHub.**

- `BLOGUM_ENV` : `prod-21plus` | `prod-18-20` | `prod-under18` (un seul env ciblé par déploiement/app instance)
- `BLOGUM_API_BASE_URL` : URL des fonctions/API serveur de l’environnement isolé
- `BLOGUM_SUPABASE_URL` : URL projet Supabase de l’environnement isolé (si Supabase)
- `BLOGUM_SUPABASE_PUBLISHABLE_KEY` (anon/publishable uniquement) : utilisable côté navigateur **uniquement** avec RLS strictes
- `BLOGUM_MEDIA_MODE` : `authenticated-temporary-urls` (pas d’URL publique permanente)

**Interdit côté client/build public** : `service_role`, secrets serveur, et toute valeur issue de secrets GitHub (ex. `kiffstationkey`). Ne pas utiliser de préfixe d’injection publique (type `VITE_`) pour des secrets.

## 2) Côté serveur / Supabase Edge Functions (par environnement isolé)
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` (si requis), `SUPABASE_SERVICE_ROLE_KEY` (**serveur uniquement**)
- Secrets de stockage/signature (selon fournisseur) pour générer des autorisations/URLs **temporaires** vers buckets **privés**
- Paramètres de vérification d’âge (intégration méthode approuvée) — stocker uniquement le **résultat minimal**
- Configuration des politiques (durée max URL, portée utilisateur/ressource, journaux)

## 3) GitHub (configuration admin, sans exposer de valeurs)
- **`secrets.kiffstationkey`** : secret confidentiel inconnu.
  - Ne pas l’afficher, ne pas le commiter, ne pas l’injecter dans le build public.
  - Référencer `secrets.kiffstationkey` dans un workflow **uniquement** si un déploiement/configuration **serveur** en a réellement besoin, et **sans imprimer sa valeur**.
  - Si son type/usage ne peut être déterminé sans révéler sa valeur : **ne pas l’utiliser** ; le configurer dans l’emplacement serveur approprié (ex. secret de projet Supabase/Edge Function ou secret serveur équivalent).
- Autres secrets de déploiement serveur (si ajoutés plus tard) : uniquement dans secrets GitHub/environnements serveur, jamais dans artefacts Pages.

## 4) Séparation des environnements (obligatoire)
- 3 jeux de configuration indépendants (21+, 18–20, <18) : projets/DB/auth/stockage/domaines distincts, aucune clé ni ressource partagée.
- Le routage client vers l’environnement correct dépend du résultat de vérification d’âge (flux à définir/implémenter côté serveur approuvé).

## 5) Rappels de conformité technique
- Médias d’autrui : pas de cache durable, pas de bouton de téléchargement, pas de bucket/URL publique permanente ; URLs temporaires scopées.
- Reposts : référence `original_post_id` + `reposter_user_id`, sans duplication média ; indisponible si original retiré/supprimé.
- Limites navigateur : suppression des tampons internes et prévention absolue des captures non garanties.
