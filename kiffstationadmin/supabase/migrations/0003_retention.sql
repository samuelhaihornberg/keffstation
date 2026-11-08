-- ============================================================
-- Keffstation Admin — Purge des données anciennes
-- À exécuter après 0002_rls_and_views.sql
--
-- Politique de conservation :
--   - événements bruts, sessions, formulaires, recherches : 90 jours
--   - alertes : 1 an
-- ============================================================

-- Sur Supabase, pg_cron peut aussi être activé via
-- Database → Extensions → pg_cron. L'instruction ci-dessous
-- fonctionne depuis le SQL Editor (rôle postgres).
create extension if not exists pg_cron;

create or replace function public.purge_old_data()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.analytics_events
   where occurred_at < now() - interval '90 days';

  delete from public.sessions
   where started_at < now() - interval '90 days';

  delete from public.form_events
   where occurred_at < now() - interval '90 days';

  delete from public.search_events
   where occurred_at < now() - interval '90 days';

  delete from public.alerts
   where created_at < now() - interval '365 days';
end;
$$;

revoke all on function public.purge_old_data() from public;

-- Planification quotidienne à 03:15 (heure du serveur, UTC sur Supabase).
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule(
      'keffstation-purge-old-data',
      '15 3 * * *',
      $cron$select public.purge_old_data();$cron$
    );
    raise notice 'Purge planifiée avec pg_cron.';
  else
    raise notice 'pg_cron absent : planifier public.purge_old_data() manuellement.';
  end if;
end;
$$;
