// Exposes ONLY public PayPal client config for the browser SDK. No secrets.
import { getPayPalConfig, jsonResponse } from '../_lib/paypal.js';

export async function onRequestGet(context) {
  const { clientId, environment } = getPayPalConfig(context && context.env);
  if (!clientId) {
    return jsonResponse({ ok: false, error: 'Paiement non configuré côté serveur.' }, 503);
  }
  return jsonResponse({ ok: true, clientId, currency: 'EUR', environment, intent: 'capture' });
}
