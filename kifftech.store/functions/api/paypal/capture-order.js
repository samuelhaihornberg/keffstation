import { paypalFetch, jsonResponse, safeRequestId, corsHeaders, optionsResponse } from '../_lib/paypal.js';

export async function onRequestPost(context) {
  const cors = corsHeaders(context.request, context.env);
  let body;
  try {
    body = await context.request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Requête invalide.' }, 400, cors);
  }

  const orderID = body && typeof body.orderID === 'string' ? body.orderID.trim() : '';
  if (!/^[-A-Z0-9]+$/i.test(orderID)) {
    return jsonResponse({ ok: false, error: 'Identifiant de commande invalide.' }, 400, cors);
  }

  try {
    const existing = await paypalFetch(context.env, `/v2/checkout/orders/${encodeURIComponent(orderID)}`, { method: 'GET' });
    const existingStatus = existing && existing.status;
    if (existingStatus === 'COMPLETED') {
      const cap = (((existing.purchase_units || [])[0] || {}).payments || {}).captures || [];
      return jsonResponse({ ok: true, status: 'COMPLETED', captureId: (cap[0] || {}).id || null, alreadyCaptured: true }, 200, cors);
    }
    if (existingStatus && existingStatus !== 'APPROVED') {
      return jsonResponse({ ok: false, error: 'Le paiement n’est pas approuvé pour capture.', status: existingStatus }, 400, cors);
    }

    const requestId = safeRequestId(body && body.requestId);
    const headers = requestId ? { 'PayPal-Request-Id': requestId, 'Prefer': 'return=representation' } : { 'Prefer': 'return=representation' };
    const captured = await paypalFetch(context.env, `/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`, {
      method: 'POST',
      headers,
      body: '{}',
    });

    const status = captured && captured.status;
    if (status !== 'COMPLETED') {
      return jsonResponse({ ok: false, error: 'Le paiement n’a pas été confirmé par le serveur.', status: status || 'UNKNOWN' }, 400, cors);
    }

    const captures = (((captured.purchase_units || [])[0] || {}).payments || {}).captures || [];
    const captureId = (captures[0] || {}).id || null;

    return jsonResponse({ ok: true, status: 'COMPLETED', captureId }, 200, cors);
  } catch (err) {
    const status = err && err.status ? err.status : 502;
    const msg = status === 503 ? 'Paiement non configuré côté serveur.' : 'Impossible de confirmer la capture du paiement PayPal.';
    return jsonResponse({ ok: false, error: msg }, status, cors);
  }
}

export async function onRequestOptions(context) {
  return optionsResponse(corsHeaders(context.request, context.env));
}
