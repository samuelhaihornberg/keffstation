# Blogum (KeffStation) — Plan d’architecture serveur & stockage (étape de préparation)

> **Périmètre** : préparation documentaire et gabarits techniques intégrés proprement au dépôt (`blogum/`). Aucun déploiement réalisé, aucun secret modifié ou exposé. Les autres PWA de KeffStation ne sont pas modifiées.
>
> **Contexte dépôt** : KeffStation est une vitrine multi-PWA statique (GitHub Pages, `deploy.yml` publie le contenu statique). Blogum est intégré dans `blogum/` (UI 3 vues Mur/Réels/Profil déjà en place, état local en mémoire). Aucune infrastructure Supabase/serveur Blogum n’est versionnée aujourd’hui dans le dépôt (des endpoints Supabase externes existent dans d’autres apps, hors périmètre). Les workflows existants (`.github/workflows/*`) ne doivent pas être modifiés pour injecter de secrets dans le build public.

## 1) Principes non négociables
- **Isolation par âge/environnement** : 3 environnements totalement séparés (serveur, auth, base, stockage, configuration, déploiement) sans partage de données ni de médias.
- **Autorisation côté serveur/BD** : le filtrage UI ne suffit jamais. Chaque lecture/écriture/média est contrôlée par identité, âge/environnement, espace et droits.
- **Médias d’autrui non persistés localement** : pas de cache durable hors ligne des publications d’autrui ; suppression immédiate des données média/publication mises en cache pour la lecture après fin complète du visionnage (dans la mesure des API navigateur disponibles).
- **Minimisation des données de vérification d’âge** : aucune image de pièce d’identité stockée dans Blogum ; conservation uniquement du **résultat minimal** de vérification (si méthode approuvée définie).
- **Secrets** : `secrets.kiffstationkey` (GitHub) est confidentiel/inconnu — jamais affiché, loggé, commité, ni injecté dans le build public (pas de `VITE_*` public). Une PWA statique ne peut pas lire un secret GitHub Actions à l’exécution.

## 2) Environnements séparés (isolation réelle)
| Environnement | Public | Isolation | Notes |
|---|---|---|---|
| **Blogum 21+** | Utilisateurs **≥ 21 ans** | Projet/serveur, auth, DB, stockage, clés, domaine/sous-domaine ou app distincts | Fonctions de rencontre/espaces adultes possibles **uniquement** ici (selon règles produit/légales). |
| **Blogum 18–20** | Utilisateurs **18–20 ans** | Projet/serveur, auth, DB, stockage, clés distincts ; **aucun partage** données/médias avec 21+ | **Ne pas considérer comme mineurs**. Vérification d’âge adaptée avant accès. Accès/rencontre selon politique dédiée, sans mélange avec 21+. |
| **Espace < 18 ans** | Moins de 18 ans | Environnement distinct, contrôles parentaux et protections renforcées | **Aucun mélange** avec fonctions de rencontre ni espaces adultes. Fonctionnalités limitées selon politique de protection. |

**Recommandation d’implémentation** : 3 projets Supabase (ou 3 backends équivalents) séparés + 3 configurations de stockage distinctes (buckets privés par env, jamais publics). Le client Blogum (PWA statique) doit cibler **un seul** backend selon le résultat de vérification/routage d’âge, sans embarquer de clé secrète.

## 3) Espaces indépendants (Famille, Ami·es, Pro, Public / StreamStars)
- Espaces logiques avec **RLS/ACL strictes** en base et contrôles d’autorisation dans les fonctions serveur/Edge.
- **Règle** : un utilisateur n’accède qu’aux publications/médias des espaces pour lesquels il possède un droit explicite (membre/autorisé) ; `Public/StreamStars` suit ses règles propres de visibilité publiable **sans URL permanente publique non contrôlée**.
- **Aucun espace ne lit les publications privées d’un autre espace** (politique par ligne/ressource, jamais par simple filtre UI).
- Les relations **follow (sens unique)** et **contact (réciproque)** sont des primitives d’autorisation distinctes (voir schéma).

## 4) Services & composants (cible)
| Composant | Rôle | Remarques |
|---|---|---|
| **Client PWA Blogum** (`blogum/`) | UI 3 vues, navigation, appels API authentifiés, SW/Cache API, IndexedDB local, gestion cache/téléchargement adaptatif | Statique sur GitHub Pages ; ne contient que config publique autorisée (ex. URL projet/clé publiable *si RLS strictes*). |
| **Auth** (par env, isolé) | Comptes, sessions, MFA/contrôles parentaux (<18), rattachement au résultat de vérification d’âge | Pas de données d’identité documentaire. |
| **Base de données** (par env) | Profils, rubriques, publications, espaces, membres, follows/contacts, reposts (références), métadonnées de vérification minimale, journaux d’accès si requis | RLS obligatoire sur toutes tables sensibles. |
| **Stockage objets privé** (par env) | Médias (images/vidéo/audio) en buckets privés | Accès via autorisation serveur / URLs signées temporaires à durée limitée ; pas de bucket/URL publique permanente. |
| **Edge Functions / API serveur** (par env) | Vérification d’accès, délivrance d’autorisations/URLs temporaires de lecture, orchestration repost (référence), suppression/invalidation, médiation sécurisée | Seul endroit pour secrets serveur (ex. `service_role`) ; `kiffstationkey` uniquement si type/usage serveur confirmé et référencé sans fuite. |
| **Service Worker + Cache API** | Cache des **assets app** (shell) et stratégies réseau ; **pas** de cache durable des publications/médias d’autrui | Téléchargement adaptatif, libération après visionnage (best-effort). |
| **IndexedDB (local)** | Données locales nécessaires (préférences, brouillons propres, index/état UI, métadonnées de cache/lecture) | Jamais de copie durable hors ligne des publications d’autrui. |

## 5) Modèle de données proposé (par environnement isolé)
> Gabarit SQL : `blogum/architecture/migrations/001_blogum_core.sql` (à adapter/valider avant application dans le bon projet/env).

- **`profiles`** : profil utilisateur (données propres), rattachement env/âge-validé (résultat minimal).
- **`age_verifications`** : `user_id`, `status/result` minimal (ex. `verified_18_20` / `verified_21_plus` / `under_18` ou équivalent), `method_id` approuvé (référence), `verified_at`, `expires_at?` — **aucun document, aucune image**.
- **`spaces`** : `type` ∈ {`family`,`friends`,`pro`,`public_streamstars`}, propriétaire/contexte, métadonnées.
- **`space_memberships`** / autorisations : droits d’accès par espace (lecture/écriture/modération) — base des RLS.
- **`follows`** : relation **sens unique** (follower → followed).
- **`contacts`** : relation **réciproque** (paire/état accepté).
- **`rubrics`**, **`rubric_answers`** : structure Blog-Forum/profil (contenu de l’auteur).
- **`posts`** : publication (auteur, espace, type texte/image/vidéo/musique/stickers/vidéo+musique, statut, visibilité).
- **`post_media`** : métadonnées média (référence objet stockage **privé**, type, taille/durée) — jamais URL publique permanente.
- **`reactions`**, **`comments`** : interactions soumises aux mêmes règles d’espace/accès.
- **`reposts`** : **référence** à `original_post_id` + `reposter_user_id` (+ espace/cible autorisée) — **sans duplication du fichier média**.
- **`parental_controls`** (<18 env) : liens tuteur/enfant, politiques/consentements, restrictions (selon cadre légal retenu).

## 6) Règles d’accès (serveur/BD — exemples de politique)
- **Isolation env** : aucune requête/token d’un env ne donne accès aux ressources d’un autre env.
- **Âge** : accès conditionné au `age_verification` valide pour l’env ; 18–20 ≠ mineur mais séparé de 21+ ; <18 sans fonctions de rencontre/espaces adultes.
- **Espaces** :
  - Lecture/écriture d’un post **uniquement** si l’acteur est autorisé sur `post.space_id` (membre, destinataire, ou règle `public_streamstars` contrôlée).
  - `family/friends/pro` : privés aux membres/autorisés ; **jamais lisibles** depuis un autre espace.
  - `public_streamstars` : visibilité contrôlée et diffusion via accès authentifié/autorisations temporaires (pas d’URL publique permanente réutilisable).
- **Médias** : aucun accès direct bucket public ; obtention via fonction serveur qui vérifie droits + émet autorisation/URL **temporaire** limitée à l’utilisateur et à la durée nécessaire à la lecture.
- **Reposts** : stockent `original_post_id` + `reposter_user_id` ; à la lecture, résolution dynamique — si original supprimé/accès retiré → état « publication non disponible ». Aucun fichier média dupliqué.
- **RLS** : activée sur toutes les tables ; politiques explicites par opération (SELECT/INSERT/UPDATE/DELETE) basées sur `auth.uid()`, appartenance espace, relation follow/contact lorsque pertinent, et env/âge.

## 7) Cache adaptatif, téléchargement progressif et visionnage (client)
- **Service Worker + Cache API** : pré-cache/cache des **assets de l’application Blogum** (shell, scripts/styles/manifeste/icônes nécessaires) avec stratégie adaptée (ex. cache-first pour shell, network pour données API). Gabarit : `blogum/architecture/client/sw.blogum.template.js`.
- **IndexedDB** : uniquement données locales nécessaires (préférences vue, brouillons/contenu propre, file d’état de lecture/cache éphémère). Gabarit d’interface : `blogum/architecture/client/cache-manager.template.js`.
- **Téléchargement adaptatif** : chargement progressif du fil selon vue/préférences ; **aperçus d’abord**, médias complets **uniquement** pendant la lecture ou après action explicite de l’utilisateur.
- **Rétention** : **ne jamais enregistrer hors ligne** les publications des autres dans un cache durable. Après **fin complète du visionnage** d’une publication d’un autre utilisateur, supprimer immédiatement les blobs/données média et de publication mises en cache pour cette lecture (best-effort via API disponibles).
- **Auteur** : conserve et gère ses propres publications dans son espace (selon capacités backend/stockage configurées).
- **Transparence & contrôle** : afficher clairement la **taille du cache** et proposer une **commande pour le vider** (Cache Storage + entrées IndexedDB gérées par Blogum).
- **Limites navigateur (à afficher/assumer)** : impossible de garantir la suppression des **tampons internes** du navigateur/moteur média/OS, ni d’empêcher toute **capture d’écran ou enregistrement externe**.

## 8) Publications des autres, médias protégés et reposts
- **Pas de bouton de téléchargement** pour les publications des autres.
- **Pas de bucket public, pas d’URL permanente publique** ; médias servis via auth + règles serveur + autorisations/URLs **temporaires** (durée/portée limitées à l’utilisateur autorisé et à la lecture).
- **Ne pas promettre** l’impossibilité technique de copie/récupération depuis un navigateur (DevTools, cache, capture, enregistrement externe possibles) ; réduire l’exposition (liens non réutilisables, courts, scopés).
- **Reposts** : table/référence `original_post_id` + `reposter_user_id` (et contexte d’espace autorisé), **sans duplication média**. Si suppression/retrait d’accès de l’original → affichage « publication non disponible ».

## 9) Secret GitHub « `kiffstationkey` » (confidentiel, inconnu)
- **Traitement** : valeur confidentielle inconnue — **ne pas afficher, ne pas écrire** (fichier/log/capture/commit), **jamais** dans `VITE_*` ni dans un artefact distribué par GitHub Pages.
- **Contrainte** : une PWA statique ne peut pas appeler directement un secret GitHub Actions à l’exécution.
- **Usage acceptable (conditionnel)** : référencer `secrets.kiffstationkey` **uniquement** dans un workflow GitHub Actions si celui-ci doit **configurer/déployer une fonction serveur** (ex. Supabase Edge Function) et **sans imprimer sa valeur**. Ne pas l’injecter dans le build public de Blogum.
- **Côté serveur/Supabase** : clés serveur dans secrets de **Supabase Edge Functions** ou environnement serveur équivalent. Clé **publishable/anon** utilisable côté navigateur uniquement avec **RLS strictes** ; **`service_role`/secrets serveur restent côté serveur**.
- **Si le type/usage de `kiffstationkey` ne peut être déterminé sans révéler sa valeur** : **ne pas l’utiliser**. L’administrateur doit le configurer de façon sûre (ex. secret côté projet Supabase/Edge Function ou secret serveur dédié) selon sa nature réelle, puis lier le workflow de déploiement serveur sans exposition.

## 10) Fichiers concernés / livrables de cette étape
| Fichier | Rôle |
|---|---|
| `blogum/ARCHITECTURE_SERVEUR_STOCKAGE.md` | Plan d’architecture (ce document). |
| `blogum/architecture/migrations/001_blogum_core.sql` | Gabarit de schéma/RLS (exemple, à adapter par env, non appliqué). |
| `blogum/architecture/edge-functions/media-access.example.ts` | Gabarit Edge Function (accès média autorisé/URL temporaire, sans secrets en dur). |
| `blogum/architecture/edge-functions/repost-resolve.example.ts` | Gabarit résolution de repost (référence, indisponibilité si original retiré). |
| `blogum/architecture/client/sw.blogum.template.js` | Gabarit Service Worker (assets app ; pas de cache durable médias d’autrui). |
| `blogum/architecture/client/cache-manager.template.js` | Gabarit gestion cache/IndexedDB/taille/purge (best-effort). |
| `blogum/architecture/ENV_CONFIG.example.md` | Variables de configuration (publiques vs serveur) et points de configuration Supabase/GitHub. |

**Non modifiés (conformité périmètre)** : autres PWA, workflows `.github/workflows/*`, configuration de secrets, déploiement.

## 11) Distinction finale (état de préparation)
### Prêt dans le code (dépôt, étape actuelle)
- Plan d’architecture et règles (âges/environnements séparés, espaces, autorisations serveur/BD, médias/reposts, cache) documentés et adaptés au repo statique `blogum/`.
- Gabarits fournis : migration SQL exemple, Edge Functions exemples, gabarits client SW/gestion de cache, modèle de variables de configuration.
- UI Blogum existante (Mur/Réels/Profil, générateur) reste locale/démo et cohérente avec les principes (aucune prétention de stockage/envoi réel).

### À configurer dans Supabase ou GitHub (par l’administrateur/projet, sans exposer de secrets)
- Créer/provisionner **3 environnements isolés** (21+, 18–20, <18) : projets backend/DB/auth/stockage séparés.
- Appliquer/adapter les **migrations** et **RLS/politiques** par environnement ; créer buckets de **stockage privés** et politiques d’accès.
- Déployer et configurer les **Edge Functions/API serveur** (secrets serveur tels que `service_role` dans l’env serveur/Edge, jamais côté client/build).
- Définir et intégrer une **méthode de vérification d’âge approuvée** (stockage du **résultat minimal** uniquement, aucun document/image).
- Configurer côté client **uniquement** les valeurs publiques nécessaires (ex. URL projet, clé publishable) **avec RLS strictes** ; ne jamais exposer de clé secrète.
- **`secrets.kiffstationkey`** : déterminer son type/usage réel **sans révéler sa valeur** ; si pertinent pour un déploiement serveur, le référencer dans un workflow **serveur** uniquement (sans impression/injection build public). Sinon, ne pas l’utiliser et le configurer dans l’emplacement serveur approprié.
- Ajouter les workflows de déploiement serveur (si retenus) séparément, sans impacter le déploiement statique GitHub Pages ni injecter de secrets dans les artefacts publics.

### Ne peut pas être garanti par un navigateur (limites à communiquer)
- **Suppression des tampons internes** (cache navigateur, mémoire, pipeline média, OS, couches réseau/CDN intermédiaires hors contrôle client) : non garantie absolue.
- **Prévention absolue des captures d’écran, enregistrements externes ou copies** (outils OS, caméra, extensions, DevTools, extraction mémoire) : impossible à garantir.
- Les mesures prévues (pas de cache durable d’autrui, URLs temporaires/scopées, pas de téléchargement proposé, purge après visionnage best-effort) **réduisent l’exposition** mais ne constituent pas une protection absolue.
