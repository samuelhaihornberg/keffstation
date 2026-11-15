import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATALOGUE } from './data/catalogue.js';
import { buildOrder } from './lib/payment-core.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || '3000', 10);

function getPayPalConfig() {
  const clientId = process.env.PAYPAL_CLIENT_ID || '';
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
  const base = String(process.env.PAYPAL_API_BASE || 'https://api-m.paypal.com').replace(/\/$/, '');
  const environment = /sandbox/i.test(base) ? 'sandbox' : (/api-m\.paypal\.com$/i.test(base) ? 'live' : 'custom');
  return { clientId, clientSecret, base, environment };
}

function getAllowedOrigin() {
  return String(process.env.PUBLIC_SITE_ORIGIN || '').trim().replace(/\/$/, '');
}

function corsHeaders(req) {
  const allowed = getAllowedOrigin();
  const origin = String((req.headers && req.headers.origin) || '');
  if (!allowed || !origin || origin !== allowed) return {};
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Accept',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function amountObj(currency, value) {
  return { currency_code: currency, value: Number(value).toFixed(2) };
}

function safeRequestId(value) {
  const id = typeof value === 'string' ? value.trim() : '';
  return /^[A-Za-z0-9._:-]{8,80}$/.test(id) ? id : '';
}

async function getAccessToken() {
  const { clientId, clientSecret, base } = getPayPalConfig();
  if (!clientId || !clientSecret) {
    const err = new Error('Configuration PayPal incomplète côté serveur.');
    err.status = 503;
    throw err;
  }
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
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

async function paypalFetch(apiPath, options = {}) {
  const { base } = getPayPalConfig();
  const token = await getAccessToken();
  const res = await fetch(`${base}${apiPath}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
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

function sendJSON(req, res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...corsHeaders(req),
  });
  res.end(json);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return null; }
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.normalize(path.join(__dirname, pathname));
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  try {
    const st = await stat(filePath);
    if (st.isDirectory()) {
      const idx = path.join(filePath, 'index.html');
      await stat(idx);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      createReadStream(idx).pipe(res);
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    if (req.method === 'GET' && url.pathname === '/api/paypal/config') {
      const { clientId, environment } = getPayPalConfig();
      if (!clientId) return sendJSON(req, res, 503, { ok: false, error: 'Paiement non configuré côté serveur.' });
      return sendJSON(req, res, 200, { ok: true, clientId, currency: 'EUR', environment, intent: 'capture' });
    }

    if (req.method === 'POST' && url.pathname === '/api/paypal/create-order') {
      const body = await readBody(req);
      if (body === null) return sendJSON(req, res, 400, { ok: false, error: 'Requête invalide.' });
      const order = buildOrder(CATALOGUE, Array.isArray(body.items) ? body.items : []);
      if (!order.ok) return sendJSON(req, res, 400, { ok: false, error: order.error || 'Commande invalide.' });
      try {
        const requestId = safeRequestId(body.requestId);
        const headers = requestId ? { 'PayPal-Request-Id': requestId, 'Prefer': 'return=representation' } : { 'Prefer': 'return=representation' };
        const created = await paypalFetch('/v2/checkout/orders', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [{
              amount: {
                currency_code: order.totals.currency,
                value: order.totals.total.toFixed(2),
                breakdown: {
                  item_total: amountObj(order.totals.currency, order.totals.subtotal),
                  shipping: amountObj(order.totals.currency, order.totals.shipping),
                  tax_total: amountObj(order.totals.currency, order.totals.taxes),
                },
              },
              items: order.lines.map(l => ({
                name: String(l.title || 'Article').slice(0, 127),
                description: l.variant ? String(l.variant).slice(0, 127) : undefined,
                quantity: String(l.quantity),
                unit_amount: amountObj(order.totals.currency, l.unitAmount),
              })),
            }],
            application_context: { shipping_preference: 'NO_SHIPPING', user_action: 'PAY_NOW' },
          }),
        });
        if (!created || !created.id) return sendJSON(req, res, 502, { ok: false, error: 'Création de commande PayPal impossible.' });
        return sendJSON(req, res, 200, { ok: true, id: created.id, status: created.status || 'CREATED', totals: order.totals });
      } catch (err) {
        const status = err && err.status ? err.status : 502;
        const msg = status === 503 ? 'Paiement non configuré côté serveur.' : 'Impossible de créer la commande PayPal.';
        return sendJSON(req, res, status, { ok: false, error: msg });
      }
    }

    if (req.method === 'POST' && url.pathname === '/api/paypal/capture-order') {
      const body = await readBody(req);
      if (body === null) return sendJSON(req, res, 400, { ok: false, error: 'Requête invalide.' });
      const orderID = body && typeof body.orderID === 'string' ? body.orderID.trim() : '';
      if (!/^[-A-Z0-9]+$/i.test(orderID)) return sendJSON(req, res, 400, { ok: false, error: 'Identifiant de commande invalide.' });
      try {
        const existing = await paypalFetch(`/v2/checkout/orders/${encodeURIComponent(orderID)}`, { method: 'GET' });
        const existingStatus = existing && existing.status;
        if (existingStatus === 'COMPLETED') {
          const cap = (((existing.purchase_units || [])[0] || {}).payments || {}).captures || [];
          return sendJSON(req, res, 200, { ok: true, status: 'COMPLETED', captureId: (cap[0] || {}).id || null, alreadyCaptured: true });
        }
        if (existingStatus && existingStatus !== 'APPROVED') {
          return sendJSON(req, res, 400, { ok: false, error: 'Le paiement n’est pas approuvé pour capture.', status: existingStatus });
        }
        const requestId = safeRequestId(body.requestId);
        const headers = requestId ? { 'PayPal-Request-Id': requestId, 'Prefer': 'return=representation' } : { 'Prefer': 'return=representation' };
        const captured = await paypalFetch(`/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`, { method: 'POST', headers, body: '{}' });
        const status = captured && captured.status;
        if (status !== 'COMPLETED') return sendJSON(req, res, 400, { ok: false, error: 'Le paiement n’a pas été confirmé par le serveur.', status: status || 'UNKNOWN' });
        const captures = (((captured.purchase_units || [])[0] || {}).payments || {}).captures || [];
        return sendJSON(req, res, 200, { ok: true, status: 'COMPLETED', captureId: (captures[0] || {}).id || null });
      } catch (err) {
        const status = err && err.status ? err.status : 502;
        const msg = status === 503 ? 'Paiement non configuré côté serveur.' : 'Impossible de confirmer la capture du paiement PayPal.';
        return sendJSON(req, res, status, { ok: false, error: msg });
      }
    }

    if (req.method === 'OPTIONS') {
      res.writeHead(204, { 'Cache-Control': 'no-store', ...corsHeaders(req) });
      return res.end();
    }

    return serveStatic(req, res);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) sendJSON(req, res, 500, { ok: false, error: 'Erreur serveur.' });
  }
});

server.listen(PORT, () => {
  console.log(`KiffTech server listening on http://localhost:${PORT}`);
});
