-- ============================================================
-- Keffstation Admin — Installation complète (schéma + RLS + vues)
-- Coller tout ce fichier dans Supabase → SQL Editor, puis Run.
-- La purge automatique (0003_retention.sql) est optionnelle et
-- peut être exécutée plus tard.
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
-- ============================================================
-- Keffstation Admin — RLS, liste blanche admin et vues agrégées
-- À exécuter après 0001_schema.sql
-- ============================================================

-- ------------------------------------------------------------
-- 1. RLS activé partout. Sans politique, tout est refusé.
--    Le service_role contourne RLS et reste côté serveur.
-- ------------------------------------------------------------
alter table public.sessions enable row level security;
alter table public.analytics_events enable row level security;
alter table public.form_events enable row level security;
alter table public.search_events enable row level security;
alter table public.gsc_queries enable row level security;
alter table public.reliability_snapshots enable row level security;
alter table public.alerts enable row level security;
alter table public.admin_audit_log enable row level security;
alter table public.admin_users enable row level security;

-- ------------------------------------------------------------
-- 2. Fonction d'administration
--    Vrai uniquement si l'utilisateur connecté est dans admin_users.
-- ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ------------------------------------------------------------
-- 3. Lecture réservée à l'admin authentifié.
--    Aucune politique d'écriture : les écritures passent
--    uniquement par le service_role côté serveur.
-- ------------------------------------------------------------
drop policy if exists admin_read_sessions on public.sessions;
create policy admin_read_sessions on public.sessions
  for select to authenticated
  using (public.is_admin());

drop policy if exists admin_read_analytics_events on public.analytics_events;
create policy admin_read_analytics_events on public.analytics_events
  for select to authenticated
  using (public.is_admin());

drop policy if exists admin_read_form_events on public.form_events;
create policy admin_read_form_events on public.form_events
  for select to authenticated
  using (public.is_admin());

drop policy if exists admin_read_search_events on public.search_events;
create policy admin_read_search_events on public.search_events
  for select to authenticated
  using (public.is_admin());

drop policy if exists admin_read_gsc_queries on public.gsc_queries;
create policy admin_read_gsc_queries on public.gsc_queries
  for select to authenticated
  using (public.is_admin());

drop policy if exists admin_read_reliability on public.reliability_snapshots;
create policy admin_read_reliability on public.reliability_snapshots
  for select to authenticated
  using (public.is_admin());

drop policy if exists admin_read_alerts on public.alerts;
create policy admin_read_alerts on public.alerts
  for select to authenticated
  using (public.is_admin());

drop policy if exists admin_read_audit on public.admin_audit_log;
create policy admin_read_audit on public.admin_audit_log
  for select to authenticated
  using (public.is_admin());

-- Les vues en security_invoker nécessitent aussi le droit SELECT
-- sur les tables de base. Les lignes restent filtrées par les RLS
-- ci-dessus : seul un admin voit des données.
grant select on public.sessions to authenticated;
grant select on public.analytics_events to authenticated;
grant select on public.form_events to authenticated;
grant select on public.search_events to authenticated;
grant select on public.gsc_queries to authenticated;
grant select on public.reliability_snapshots to authenticated;
grant select on public.alerts to authenticated;
grant select on public.admin_audit_log to authenticated;

-- ------------------------------------------------------------
-- 4. Vues agrégées pour le tableau de bord.
--    security_invoker = true : les RLS des tables s'appliquent.
-- ------------------------------------------------------------

create or replace view public.v_daily_activity
with (security_invoker = true) as
select
  (occurred_at at time zone 'Europe/Paris')::date as day,
  count(*) filter (where event_type = 'page_view') as page_views,
  count(*) filter (where event_type = 'click') as clicks,
  count(*) filter (where event_type = 'search') as searches,
  count(*) filter (where event_type in ('form_submit', 'form_success')) as form_submissions,
  count(distinct session_id) as sessions
from public.analytics_events
group by 1;

create or replace view public.v_click_breakdown
with (security_invoker = true) as
select
  coalesce(element_type, 'unknown') as element_type,
  coalesce(element_id, '') as element_id,
  coalesce(element_label, '') as element_label,
  coalesce(path, '') as path,
  count(*) as clicks
from public.analytics_events
where event_type = 'click'
group by 1, 2, 3, 4;

create or replace view public.v_form_funnel
with (security_invoker = true) as
select
  form_id,
  count(*) filter (where event_type = 'start') as started,
  count(*) filter (where event_type = 'submit') as submitted,
  count(*) filter (where event_type = 'success') as succeeded,
  count(*) filter (where event_type = 'error') as errors
from public.form_events
group by form_id;

create or replace view public.v_search_top
with (security_invoker = true) as
select
  query,
  count(*) as searches,
  round(avg(results_count)::numeric, 1) as avg_results,
  count(*) filter (where results_count = 0) as zero_results,
  count(*) filter (where clicked_result_id is not null) as result_clicks
from public.search_events
group by query;

create or replace view public.v_gsc_daily
with (security_invoker = true) as
select
  date,
  sum(clicks)::bigint as clicks,
  sum(impressions)::bigint as impressions,
  case
    when sum(impressions) > 0
      then round(100.0 * sum(clicks) / sum(impressions), 2)
    else 0
  end as ctr,
  round(avg(position)::numeric, 1) as position,
  bool_or(is_partial) as is_partial
from public.gsc_queries
group by date;

create or replace view public.v_gsc_top
with (security_invoker = true) as
select
  query,
  sum(clicks)::bigint as clicks,
  sum(impressions)::bigint as impressions,
  case
    when sum(impressions) > 0
      then round(100.0 * sum(clicks) / sum(impressions), 2)
    else 0
  end as ctr,
  round(avg(position)::numeric, 1) as position
from public.gsc_queries
group by query;

create or replace view public.v_reliability_latest
with (security_invoker = true) as
select
  snapshot_at,
  uptime_pct,
  error_rate,
  form_success_rate,
  payment_success_rate,
  data_freshness,
  score
from public.reliability_snapshots
order by snapshot_at desc
limit 1;

-- ------------------------------------------------------------
-- 5. Droits de lecture des vues
-- ------------------------------------------------------------
grant select on public.v_daily_activity to authenticated;
grant select on public.v_click_breakdown to authenticated;
grant select on public.v_form_funnel to authenticated;
grant select on public.v_search_top to authenticated;
grant select on public.v_gsc_daily to authenticated;
grant select on public.v_gsc_top to authenticated;
grant select on public.v_reliability_latest to authenticated;

-- ------------------------------------------------------------
-- 6. Après création du compte admin dans Authentication → Users,
--    récupérer son UUID et exécuter (remplacer la valeur) :
--
--    insert into public.admin_users (user_id)
--    values ('00000000-0000-0000-0000-000000000000')
--    on conflict (user_id) do nothing;
-- ------------------------------------------------------------
