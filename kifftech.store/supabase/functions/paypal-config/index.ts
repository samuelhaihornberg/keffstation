import { corsHeaders, getPayPalConfig, json, options } from "../_shared/paypal.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return options(req);
  const headers = corsHeaders(req);
  if (req.method !== "GET") return json({ ok: false, error: "Méthode non autorisée." }, 405, headers);

  const { clientId, environment } = getPayPalConfig();
  if (!clientId) {
    return json({ ok: false, error: "Paiement non configuré côté serveur." }, 503, headers);
  }
  // Public uniquement : jamais de secret (PAYPAL_CLIENT_SECRET exclu).
  return json({ ok: true, clientId, currency: "EUR", environment, intent: "capture" }, 200, headers);
});
