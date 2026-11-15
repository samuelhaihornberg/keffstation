import { CATALOGUE } from '../../../data/catalogue.js';
import { buildOrder } from '../../../lib/payment-core.js';
import { paypalFetch, jsonResponse, safeRequestId } from '../_lib/paypal.js';

function amountObj(currency, value) {
  return { currency_code: currency, value: Number(value).toFixed(2) };
}

export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Requête invalide.' }, 400);
  }

  const items = Array.isArray(body && body.items) ? body.items : [];
  const order = buildOrder(CATALOGUE, items);
  if (!order.ok) {
    return jsonResponse({ ok: false, error: order.error || 'Commande invalide.' }, 400);
  }

  try {
    const payload = {
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
      application_context: {
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
      },
    };

    const requestId = safeRequestId(body && body.requestId);
    const headers = requestId ? { 'PayPal-Request-Id': requestId, 'Prefer': 'return=representation' } : { 'Prefer': 'return=representation' };

    const created = await paypalFetch(context.env, '/v2/checkout/orders', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!created || !created.id) {
      return jsonResponse({ ok: false, error: 'Création de commande PayPal impossible.' }, 502);
    }
    return jsonResponse({ ok: true, id: created.id, status: created.status || 'CREATED', totals: order.totals });
  } catch (err) {
    const status = err && err.status ? err.status : 502;
    const msg = status === 503 ? 'Paiement non configuré côté serveur.' : 'Impossible de créer la commande PayPal.';
    return jsonResponse({ ok: false, error: msg }, status);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}
