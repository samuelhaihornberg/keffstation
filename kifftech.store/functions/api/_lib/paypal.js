// Server-side PayPal helpers. Secrets are read ONLY from environment variables.
// Never log or expose secrets.

function getEnv(env, key) {
  return (env && env[key]) || (typeof process !== 'undefined' && process.env && process.env[key]) || '';
}

export function getPayPalConfig(env) {
  const clientId = getEnv(env, 'PAYPAL_CLIENT_ID');
  const clientSecret = getEnv(env, 'PAYPAL_CLIENT_SECRET');
  const base = String(getEnv(env, 'PAYPAL_API_BASE') || 'https://api-m.paypal.com').replace(/\/$/, '');
  const environment = /sandbox/i.test(base) ? 'sandbox' : (/api-m\.paypal\.com$/i.test(base) ? 'live' : 'custom');
  return { clientId, clientSecret, base, environment };
}

export function getAllowedOrigin(env) {
  const v = String(getEnv(env, 'PUBLIC_SITE_ORIGIN') || '').trim().replace(/\/$/, '');
  return v;
}

export function corsHeaders(request, env) {
  const allowed = getAllowedOrigin(env);
  const origin = request && request.headers ? String(request.headers.get('Origin') || '') : '';
  if (!allowed || !origin || origin !== allowed) return {};
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Accept',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

export async function getAccessToken(env) {
  const { clientId, clientSecret, base } = getPayPalConfig(env);
  if (!clientId || !clientSecret) {
    const err = new Error('Configuration PayPal incomplète côté serveur.');
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
    const err = new Error('Échec d’authentification PayPal.');
    err.status = 502;
    throw err;
  }
  const data = await res.json();
  return data.access_token;
}

export async function paypalFetch(env, path, options = {}) {
  const { base } = getPayPalConfig(env);
  const token = await getAccessToken(env);
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers,
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  if (!res.ok) {
    const err = new Error('Requête PayPal refusée.');
    err.status = res.status >= 400 && res.status < 500 ? 400 : 502;
    err.details = data;
    throw err;
  }
  return data;
}

export function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extraHeaders },
  });
}

export function optionsResponse(extraHeaders = {}) {
  return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store', ...extraHeaders } });
}

export function safeRequestId(value) {
  const id = typeof value === 'string' ? value.trim() : '';
  return /^[A-Za-z0-9._:-]{8,80}$/.test(id) ? id : '';
}
