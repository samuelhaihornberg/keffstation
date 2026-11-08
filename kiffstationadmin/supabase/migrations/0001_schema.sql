-- ============================================================
-- Keffstation Admin — Schéma initial
-- À exécuter dans Supabase → SQL Editor, dans cet ordre :
--   1. 0001_schema.sql
--   2. 0002_rls_and_views.sql
--   3. 0003_retention.sql
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Sessions agrégées
-- L'identifiant est un hachage côté serveur : aucune IP brute.
-- ------------------------------------------------------------
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  device_type text not null default 'unknown'
    check (device_type in ('mobile', 'tablet', 'desktop', 'unknown')),
  landing_path text,
  referrer_domain text,
  is_bot boolean not null default false
);

comment on table public.sessions is
  'Sessions agrégées. session_id est un hachage, jamais une IP ni un identifiant navigateur brut.';

-- ------------------------------------------------------------
-- Événements bruts, sans données personnelles
-- ------------------------------------------------------------
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  session_id text not null,
  event_type text not null
    check (event_type in (
      'page_view', 'click', 'tab_view', 'menu_open',
      'form_start', 'form_submit', 'form_success', 'form_error',
      'search', 'payment_attempt', 'payment_result', 'error'
    )),
  element_type text
    check (element_type in (
      'link', 'button', 'tab', 'menu', 'form', 'search', 'payment'
    )),
  element_id text,
  element_label text,
  path text,
  metadata jsonb not null default '{}'::jsonb,
  device_type text not null default 'unknown'
    check (device_type in ('mobile', 'tablet', 'desktop', 'unknown')),
  referrer_domain text,
  country_code text
);

comment on table public.analytics_events is
  'Événements analytics anonymisés. Aucune valeur de formulaire, aucune IP brute.';

-- ------------------------------------------------------------
-- Formulaires : métriques uniquement, jamais les valeurs saisies
-- ------------------------------------------------------------
create table if not exists public.form_events (
  id uuid primary key default gen_random_uuid(),
  form_id text not null,
  event_type text not null
    check (event_type in ('start', 'submit', 'success', 'error')),
  error_code text,
  occurred_at timestamptz not null default now()
);

comment on table public.form_events is
  'Démarrages, envois, succès et erreurs de formulaires. Aucune valeur saisie.';

-- ------------------------------------------------------------
-- Recherches internes à Keffstation
-- ------------------------------------------------------------
create table if not exists public.search_events (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  results_count integer not null default 0
    check (results_count >= 0),
  clicked_result_id text,
  occurred_at timestamptz not null default now()
);

comment on table public.search_events is
  'Recherches internes Keffstation. Séparées des données Google Search Console.';

-- ------------------------------------------------------------
-- Google Search Console (données différées, table séparée)
-- ctr est stocké en pourcentage (0–100).
-- ------------------------------------------------------------
create table if not exists public.gsc_queries (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  query text not null,
  clicks integer not null default 0,
  impressions integer not null default 0,
  ctr numeric(7, 4) not null default 0,
  position numeric(7, 2) not null default 0,
  fetched_at timestamptz not null default now(),
  is_partial boolean not null default false,
  unique (date, query)
);

comment on table public.gsc_queries is
  'Données Google Search Console, différées et parfois masquées par Google. Ne pas additionner aux recherches internes.';

-- ------------------------------------------------------------
-- Instantanés de fiabilité
-- ------------------------------------------------------------
create table if not exists public.reliability_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_at timestamptz not null default now(),
  uptime_pct numeric(6, 3) not null default 0,
  error_rate numeric(6, 3) not null default 0,
  form_success_rate numeric(6, 3) not null default 0,
  payment_success_rate numeric(6, 3) not null default 0,
  data_freshness numeric(6, 3) not null default 0,
  score numeric(6, 2) not null default 0
);

comment on table public.reliability_snapshots is
  'Composantes du score de fiabilité affiché au sommet de la montagne.';

-- ------------------------------------------------------------
-- Alertes envoyées (résumé + lien sécurisé, jamais de données personnelles)
-- ------------------------------------------------------------
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  alert_type text not null,
  summary text not null,
  secure_link text,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

-- ------------------------------------------------------------
-- Journal d'audit des actions admin
-- ------------------------------------------------------------
create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor text not null,
  action text not null,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Liste blanche des administrateurs
-- Seuls les comptes présents ici peuvent lire les données.
-- ------------------------------------------------------------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Liste blanche des comptes admin. Aucune inscription publique.';

-- ------------------------------------------------------------
-- Index de lecture
-- ------------------------------------------------------------
create index if not exists analytics_events_occurred_at_idx
  on public.analytics_events (occurred_at desc);
create index if not exists analytics_events_type_time_idx
  on public.analytics_events (event_type, occurred_at desc);
create index if not exists analytics_events_element_idx
  on public.analytics_events (element_type, element_id);
create index if not exists analytics_events_session_idx
  on public.analytics_events (session_id);

create index if not exists sessions_started_at_idx
  on public.sessions (started_at desc);

create index if not exists form_events_time_idx
  on public.form_events (occurred_at desc);
create index if not exists form_events_form_idx
  on public.form_events (form_id, occurred_at desc);

create index if not exists search_events_time_idx
  on public.search_events (occurred_at desc);
create index if not exists search_events_query_idx
  on public.search_events (query);

create index if not exists gsc_queries_date_idx
  on public.gsc_queries (date desc);

create index if not exists reliability_snapshots_time_idx
  on public.reliability_snapshots (snapshot_at desc);

create index if not exists alerts_created_at_idx
  on public.alerts (created_at desc);

create index if not exists admin_audit_log_created_at_idx
  on public.admin_audit_log (created_at desc);
