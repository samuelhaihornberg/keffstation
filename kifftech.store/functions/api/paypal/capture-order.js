import { paypalFetch, jsonResponse } from '../_lib/paypal.js';

export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Requête invalide.' }, 400);
  }

  const orderID = body && typeof body.orderID === 'string' ? body.orderID.trim() : '';
  if (!/^[-A-Z0-9]+$/i.test(orderID)) {
    return jsonResponse({ ok: false, error: 'Identifiant de commande invalide.' }, 400);
  }

  try {
    const captured = await paypalFetch(context.env, `/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`, {
      method: 'POST',
      body: '{}',
    });

    const status = captured && captured.status;
    if (status !== 'COMPLETED') {
      return jsonResponse({ ok: false, error: 'Le paiement n’a pas été confirmé.', status: status || 'UNKNOWN' }, 400);
    }

    const captureId = (((captured.purchase_units || [])[0] || {}).payments || {}).captures
      ? ((((captured.purchase_units || [])[0] || {}).payments || {}).captures[0] || {}).id
      : null;

    return jsonResponse({ ok: true, status: 'COMPLETED', captureId: captureId || null });
  } catch (err) {
    const status = err && err.status ? err.status : 502;
    const msg = status === 503 ? 'Paiement non configuré côté serveur.' : 'Impossible de capturer le paiement PayPal.';
    return jsonResponse({ ok: false, error: msg }, status);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}
