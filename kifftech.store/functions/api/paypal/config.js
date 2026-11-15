// Exposes ONLY public PayPal client config for the browser SDK. No secrets.
import { getPayPalConfig, jsonResponse, corsHeaders, optionsResponse } from '../_lib/paypal.js';

export async function onRequestGet(context) {
  const cors = corsHeaders(context.request, context.env);
  const { clientId, environment } = getPayPalConfig(context && context.env);
  if (!clientId) {
    return jsonResponse({ ok: false, error: 'Paiement non configuré côté serveur.' }, 503, cors);
  }
  // Ne jamais renvoyer de secret (clientSecret exclu).
  return jsonResponse({ ok: true, clientId, currency: 'EUR', environment, intent: 'capture' }, 200, cors);
}

export async function onRequestOptions(context) {
  return optionsResponse(corsHeaders(context.request, context.env));
}
