// Exposes ONLY the public PayPal client ID for the browser SDK. No secrets.
import { getPayPalConfig, jsonResponse } from '../_lib/paypal.js';

export async function onRequestGet(context) {
  const { clientId } = getPayPalConfig(context && context.env);
  if (!clientId) {
    return jsonResponse({ ok: false, error: 'Paiement non configuré.' }, 503);
  }
  return jsonResponse({ ok: true, clientId, currency: 'EUR' });
}
