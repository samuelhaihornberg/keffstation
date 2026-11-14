import { CATALOGUE } from '../../../data/catalogue.js';
import { buildOrder } from '../../../lib/payment-core.js';
import { paypalFetch, jsonResponse } from '../_lib/paypal.js';

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

    const created = await paypalFetch(context.env, '/v2/checkout/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!created || !created.id) {
      return jsonResponse({ ok: false, error: 'Création de commande PayPal impossible.' }, 502);
    }
    return jsonResponse({ ok: true, id: created.id });
  } catch (err) {
    const status = err && err.status ? err.status : 502;
    const msg = status === 503 ? 'Paiement non configuré côté serveur.' : 'Impossible de créer la commande PayPal.';
    return jsonResponse({ ok: false, error: msg }, status);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}
