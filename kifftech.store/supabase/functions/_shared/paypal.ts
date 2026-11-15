// Shared helpers for Supabase Edge Functions (Deno). No secrets in code/logs.
export function getPayPalConfig() {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID') || '';
  const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET') || '';
  const base = String(Deno.env.get('PAYPAL_API_BASE') || 'https://api-m.paypal.com').replace(/\/$/, '');
  const environment = /sandbox/i.test(base) ? 'sandbox' : (/api-m\.paypal\.com$/i.test(base) ? 'live' : 'custom');
  return { clientId, clientSecret, base, environment };
}

export function getAllowedOrigin() {
  return String(Deno.env.get('PUBLIC_SITE_ORIGIN') || '').trim().replace(/\/$/, '');
}

export function corsHeaders(req: Request): Record<string, string> {
  const allowed = getAllowedOrigin();
  const origin = req.headers.get('Origin') || '';
  if (!allowed || !origin || origin !== allowed) return { 'Vary': 'Origin' };
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

export function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });
}

export function options(req: Request) {
  return new Response('ok', { headers: corsHeaders(req) });
}

export async function getAccessToken() {
  const { clientId, clientSecret, base } = getPayPalConfig();
  if (!clientId || !clientSecret) {
    const err: any = new Error('Configuration PayPal incomplète côté serveur.');
    err.status = 503;
    throw err;
  }
  const auth = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    const err: any = new Error('Échec d’authentification PayPal.');
    err.status = 502;
    throw err;
  }
  const data = await res.json();
  return data.access_token;
}

export async function paypalFetch(path: string, options: RequestInit = {}) {
  const { base } = getPayPalConfig();
  const token = await getAccessToken();
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');
  const res = await fetch(`${base}${path}`, { ...options, headers });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  if (!res.ok) {
    const err: any = new Error('Requête PayPal refusée.');
    err.status = res.status >= 400 && res.status < 500 ? 400 : 502;
    err.details = data;
    throw err;
  }
  return data;
}

export function safeRequestId(value: unknown) {
  const id = typeof value === 'string' ? value.trim() : '';
  return /^[A-Za-z0-9._:-]{8,80}$/.test(id) ? id : '';
}
