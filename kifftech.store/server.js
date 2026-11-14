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
  const base = (process.env.PAYPAL_API_BASE || 'https://api-m.paypal.com').replace(/\/$/, '');
  return { clientId, clientSecret, base };
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

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(payload);
}

async function readJsonBody(req) {
  return await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 1_000_000) { reject(new Error('too large')); req.destroy(); }
    });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

async function handleConfig(req, res) {
  if (req.method !== 'GET') return sendJson(res, 405, { ok: false, error: 'Méthode non autorisée.' });
  const { clientId } = getPayPalConfig();
  if (!clientId) return sendJson(res, 503, { ok: false, error: 'Paiement non configuré.' });
  return sendJson(res, 200, { ok: true, clientId, currency: 'EUR' });
}

async function handleCreateOrder(req, res) {
  if (req.method === 'OPTIONS') { res.writeHead(204, { 'Cache-Control': 'no-store' }); return res.end(); }
  if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'Méthode non autorisée.' });
  let body;
  try { body = await readJsonBody(req); } catch { return sendJson(res, 400, { ok: false, error: 'Requête invalide.' }); }
  const items = Array.isArray(body && body.items) ? body.items : [];
  const order = buildOrder(CATALOGUE, items);
  if (!order.ok) return sendJson(res, 400, { ok: false, error: order.error || 'Commande invalide.' });
  try {
    const payload = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: order.currency,
          value: order.total.toFixed(2),
          breakdown: {
            item_total: { currency_code: order.currency, value: order.total.toFixed(2) },
          },
        },
        items: order.lines.map(l => ({
          name: String(l.title || 'Article').slice(0, 127),
          description: l.variant ? String(l.variant).slice(0, 127) : undefined,
          quantity: String(l.quantity),
          unit_amount: { currency_code: order.currency, value: Number(l.unitAmount).toFixed(2) },
        })),
      }],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
      },
    };
    const created = await paypalFetch('/v2/checkout/orders', { method: 'POST', body: JSON.stringify(payload) });
    if (!created || !created.id) return sendJson(res, 502, { ok: false, error: 'Création de commande PayPal impossible.' });
    return sendJson(res, 200, { ok: true, id: created.id });
  } catch (err) {
    const status = err && err.status ? err.status : 502;
    const msg = status === 503 ? 'Paiement non configuré côté serveur.' : 'Impossible de créer la commande PayPal.';
    return sendJson(res, status, { ok: false, error: msg });
  }
}

async function handleCaptureOrder(req, res) {
  if (req.method === 'OPTIONS') { res.writeHead(204, { 'Cache-Control': 'no-store' }); return res.end(); }
  if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'Méthode non autorisée.' });
  let body;
  try { body = await readJsonBody(req); } catch { return sendJson(res, 400, { ok: false, error: 'Requête invalide.' }); }
  const orderID = body && typeof body.orderID === 'string' ? body.orderID.trim() : '';
  if (!/^[-A-Z0-9]+$/i.test(orderID)) return sendJson(res, 400, { ok: false, error: 'Identifiant de commande invalide.' });
  try {
    const captured = await paypalFetch(`/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`, { method: 'POST', body: '{}' });
    const status = captured && captured.status;
    if (status !== 'COMPLETED') return sendJson(res, 400, { ok: false, error: 'Le paiement n’a pas été confirmé.', status: status || 'UNKNOWN' });
    const captureId = (((captured.purchase_units || [])[0] || {}).payments || {}).captures
      ? ((((captured.purchase_units || [])[0] || {}).payments || {}).captures[0] || {}).id
      : null;
    return sendJson(res, 200, { ok: true, status: 'COMPLETED', captureId: captureId || null });
  } catch (err) {
    const status = err && err.status ? err.status : 502;
    const msg = status === 503 ? 'Paiement non configuré côté serveur.' : 'Impossible de capturer le paiement PayPal.';
    return sendJson(res, status, { ok: false, error: msg });
  }
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

async function serveStatic(req, res, urlPath) {
  let pathname = decodeURIComponent(urlPath.split('?')[0]);
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.join(__dirname, pathname);
  if (!filePath.startsWith(__dirname)) { res.writeHead(403); return res.end('Forbidden'); }
  try {
    let st = await stat(filePath);
    if (st.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html');
      st = await stat(indexPath);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return createReadStream(indexPath).pipe(res);
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    return createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const p = url.pathname.replace(/\/+$/, '') || '/';
    if (p === '/api/paypal/config') return await handleConfig(req, res);
    if (p === '/api/paypal/create-order') return await handleCreateOrder(req, res);
    if (p === '/api/paypal/capture-order') return await handleCaptureOrder(req, res);
    return await serveStatic(req, res, url.pathname);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) sendJson(res, 500, { ok: false, error: 'Erreur serveur.' });
  }
});

server.listen(PORT, () => {
  const { clientId, clientSecret } = getPayPalConfig();
  console.log(`KiffTech server running on http://localhost:${PORT}`);
  if (!clientId || !clientSecret) {
    console.log('PayPal non configuré: définissez PAYPAL_CLIENT_ID et PAYPAL_CLIENT_SECRET (et optionnellement PAYPAL_API_BASE).');
  }
});
