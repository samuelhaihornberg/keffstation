-- Reçus accessibles par jeton (seule l'empreinte est stockée) et purge des données techniques après paiement.
-- Aucune donnée personnelle (nom, e-mail, adresse, carte) n'est reçue ni stockée par KiffTech.

alter table public.invoices add column if not exists receipt_token_hash text;

drop function if exists public.kt_mark_paid(uuid, text);

create or replace function public.kt_mark_paid(p_order_id uuid, p_capture_id text, p_receipt_hash text)
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
  insert into public.invoices (order_id, invoice_number, currency, subtotal, shipping, taxes, total_paid, paypal_capture_id, lines, receipt_token_hash)
    values (p_order_id, v_number, o.currency, o.subtotal, o.shipping, o.taxes, o.total, p_capture_id, o.lines, p_receipt_hash);
  return v_number;
end;
$$;

revoke all on function public.kt_mark_paid(uuid, text, text) from public, anon, authenticated;
grant execute on function public.kt_mark_paid(uuid, text, text) to service_role;

-- Purge des données techniques : compteurs d'IP hachées (> 2 jours), jetons et identifiants de requête des commandes terminées.
-- Les factures sont conservées (obligations comptables) sans identifiant direct.
create or replace function public.kt_purge_technical_data()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer;
begin
  delete from public.rate_limits where window_start < now() - interval '2 days';
  get diagnostics n = row_count;
  update public.payment_orders
    set token_hash = 'purged', request_id = null, updated_at = now()
    where status in ('paid', 'failed') and token_hash <> 'purged';
  return n;
end;
$$;

revoke all on function public.kt_purge_technical_data() from public, anon, authenticated;
grant execute on function public.kt_purge_technical_data() to service_role;
