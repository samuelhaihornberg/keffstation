-- KiffTech — commandes PayPal, acceptations des conditions, factures/reçus et limitation de débit.
-- Accès exclusivement serveur (service role des Edge Functions). RLS activée sans politique publique :
-- anon et authenticated n'ont aucun accès direct.

create extension if not exists pgcrypto;

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  request_id text unique,
  paypal_order_id text unique,
  status text not null default 'created' check (status in ('created', 'capturing', 'paid', 'failed')),
  currency text not null check (char_length(currency) = 3),
  subtotal numeric(12,2) not null,
  shipping numeric(12,2) not null,
  taxes numeric(12,2) not null,
  total numeric(12,2) not null,
  lines jsonb not null,
  terms_version text not null,
  terms_url text not null,
  terms_accepted_at timestamptz not null,
  token_hash text not null,
  paypal_capture_id text,
  failure_code text,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.payment_orders(id),
  invoice_number text not null unique,
  issued_at timestamptz not null default now(),
  currency text not null,
  subtotal numeric(12,2) not null,
  shipping numeric(12,2) not null,
  taxes numeric(12,2) not null,
  total_paid numeric(12,2) not null,
  paypal_capture_id text not null,
  lines jsonb not null,
  -- Identité du vendeur : NULL tant qu'elle n'est pas renseignée par le responsable de la boutique.
  seller jsonb,
  legal_complete boolean not null default false
);

create table if not exists public.rate_limits (
  key text not null,
  window_start timestamptz not null,
  hits integer not null default 0,
  primary key (key, window_start)
);

alter table public.payment_orders enable row level security;
alter table public.invoices enable row level security;
alter table public.rate_limits enable row level security;

revoke all on public.payment_orders, public.invoices, public.rate_limits from anon, authenticated;

create sequence if not exists public.invoice_seq;

create or replace function public.kt_rate_limit_hit(p_key text, p_window_seconds integer, p_max integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window timestamptz;
  v_hits integer;
begin
  v_window := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  insert into public.rate_limits (key, window_start, hits) values (p_key, v_window, 1)
  on conflict (key, window_start) do update set hits = public.rate_limits.hits + 1
  returning hits into v_hits;
  return v_hits <= p_max;
end;
$$;

create or replace function public.kt_mark_paid(p_order_id uuid, p_capture_id text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  o public.payment_orders%rowtype;
  v_number text;
begin
  select * into o from public.payment_orders where id = p_order_id for update;
  if not found then
    raise exception 'order_not_found';
  end if;
  if o.status = 'paid' then
    return (select invoice_number from public.invoices where order_id = p_order_id);
  end if;
  update public.payment_orders
    set status = 'paid', paypal_capture_id = p_capture_id, paid_at = now(), updated_at = now(), failure_code = null
    where id = p_order_id;
  v_number := 'KT-' || to_char(now() at time zone 'Europe/Paris', 'YYYY') || '-' || lpad(nextval('public.invoice_seq')::text, 6, '0');
  insert into public.invoices (order_id, invoice_number, currency, subtotal, shipping, taxes, total_paid, paypal_capture_id, lines)
    values (p_order_id, v_number, o.currency, o.subtotal, o.shipping, o.taxes, o.total, p_capture_id, o.lines);
  return v_number;
end;
$$;

revoke all on function public.kt_rate_limit_hit(text, integer, integer) from public, anon, authenticated;
revoke all on function public.kt_mark_paid(uuid, text) from public, anon, authenticated;
grant execute on function public.kt_rate_limit_hit(text, integer, integer) to service_role;
grant execute on function public.kt_mark_paid(uuid, text) to service_role;

-- Nettoyage des compteurs de débit anciens (à planifier, ex. pg_cron quotidien).
-- delete from public.rate_limits where window_start < now() - interval '2 days';
