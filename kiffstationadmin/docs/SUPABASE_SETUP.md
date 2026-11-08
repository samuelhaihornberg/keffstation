# Mise en place de Supabase

Ce guide décrit la création du projet Supabase et le déploiement du backend.
Il est prévu pour être suivi depuis un téléphone Android, sans SSH et sans CLI.

> **Règle absolue** : ne jamais coller dans ce dépôt, dans un message ou dans une
> capture d'écran : mot de passe de base de données, clé `service_role`, jeton
> personnel Supabase, valeur de `SESSION_PEPPER`.
> Le mot de passe admin et ces secrets vont dans Bitwarden.

---

## 1. Créer le compte et le projet

1. Ouvrir <https://supabase.com> et se connecter avec GitHub
   (compte `samuelhaihornberg`, déjà protégé).
2. Créer une organisation (offre gratuite).
3. Créer un projet :
   - **Nom** : `keffstation`
   - **Région** : `eu-west-3` (Paris) ou `eu-central-1` (Francfort)
   - **Mot de passe de la base** : générer 32 caractères ou plus,
     l'enregistrer dans Bitwarden. Ne jamais le partager.
4. Attendre la fin de l'initialisation du projet.

## 2. Créer l'utilisateur admin

1. **Authentication → Sign In / Providers → Email** :
   désactiver **Allow new users to sign up**.
   Il ne doit y avoir aucune inscription publique.
2. **Authentication → Users → Add user → Create new user** :
   - e-mail admin dédié ;
   - mot de passe long et unique, stocké dans Bitwarden ;
   - cocher la confirmation automatique de l'e-mail.
3. Copier l'**UUID** de l'utilisateur créé (colonne `UID`).

## 3. Créer le schéma et les règles d'accès

Dans **SQL Editor → New query**, exécuter les fichiers dans cet ordre :

1. `supabase/migrations/0001_schema.sql`
2. `supabase/migrations/0002_rls_and_views.sql`
3. `supabase/migrations/0003_retention.sql`

Puis ajouter l'utilisateur admin à la liste blanche :

```sql
insert into public.admin_users (user_id)
values ('COLLER_ICI_L_UUID_ADMIN')
on conflict (user_id) do nothing;
```

Vérifier que RLS est actif partout :

```sql
select relname, relrowsecurity
from pg_class
where relnamespace = 'public'::regnamespace
  and relkind = 'r'
order by relname;
```

La colonne `relrowsecurity` doit être `true` pour toutes les tables.

## 4. Déployer la fonction `ingest`

1. **Edge Functions → Deploy a new function → Via Editor**.
2. Nom : `ingest`.
3. Coller le contenu de `supabase/functions/ingest/index.ts`.
4. Désactiver **Verify JWT** (la PWA publique n'envoie aucun jeton).
5. Déployer.

### Secrets de la fonction

Dans **Edge Functions → Secrets** (ou **Project Settings → Edge Functions**),
ajouter :

| Secret | Valeur |
|---|---|
| `SESSION_PEPPER` | chaîne aléatoire de 32 octets hexadécimaux minimum, générée localement et stockée dans Bitwarden |
| `ALLOWED_ORIGINS` | origines autorisées, séparées par des virgules. Laisser vide pour le premier test, puis mettre le domaine réel de la PWA avant la production. |

Générer la valeur de `SESSION_PEPPER` dans Termux :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copier le résultat directement dans Bitwarden puis dans Supabase.
Ne pas l'afficher dans une capture d'écran.

## 5. Tester la collecte

Récupérer le **Project ref** dans **Project Settings → General**
(ou dans l'URL `https://supabase.com/dashboard/project/<ref>`).

Tester depuis Termux :

```bash
curl -i -X POST "https://<REF>.supabase.co/functions/v1/ingest" \
  -H "Content-Type: application/json" \
  -d '{"events":[{"type":"page_view","sessionId":"test-session-1","path":"/","deviceType":"mobile"}]}'
```

Réponse attendue : `HTTP/2 204`.

Vérifier en base :

```sql
select event_type, path, device_type, occurred_at
from public.analytics_events
order by occurred_at desc
limit 5;
```

Nettoyer les données de test (uniquement tant qu'il n'y a pas de vraies données) :

```sql
truncate public.analytics_events, public.sessions,
         public.form_events, public.search_events;
```

## 6. Vérifier qu'aucune lecture publique n'est possible

Récupérer la clé `anon` dans **Project Settings → API**.
Elle est publique par conception, mais ne pas la commiter.

```bash
curl -sS "https://<REF>.supabase.co/rest/v1/analytics_events?select=id&limit=1" \
  -H "apikey: <ANON_KEY>"
```

Résultat attendu : `[]` (RLS bloque toutes les lignes), jamais une liste
d'événements. La clé `service_role` ne doit jamais quitter le serveur.

## 7. Informations à transmettre pour la suite

Peuvent être partagés sans risque :

- le **Project ref** ;
- l'**URL du projet** `https://<ref>.supabase.co` ;
- la liste des migrations exécutées.

Ne jamais transmettre :

- le mot de passe de la base ;
- la clé `service_role` ;
- la clé `anon` (inutile pour l'instant) ;
- le jeton personnel Supabase ;
- `SESSION_PEPPER`.

## 8. Prochaine étape

Une fois le projet créé et testé :

1. connecter la PWA `keffstation` à `/ingest` (fichier `analytics.js` côté PWA) ;
2. créer l'authentification admin par cookie `HttpOnly` côté Edge Function ;
3. brancher le tableau de bord sur les vues agrégées ;
4. ajouter Google Search Console et les alertes e-mail.

La 2FA reste à activer avant toute mise en ligne avec des données réelles.
