import { CATALOGUE } from "../_shared/catalogue.js";
import { buildOrder } from "../_shared/payment-core.js";
import { corsHeaders, json, options, paypalFetch, safeRequestId } from "../_shared/paypal.ts";

function amountObj(currency: string, value: number) {
  return { currency_code: currency, value: Number(value).toFixed(2) };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return options(req);
  const headers = corsHeaders(req);
  if (req.method !== "POST") return json({ ok: false, error: "Méthode non autorisée." }, 405, headers);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "Requête invalide." }, 400, headers);
  }

  const items = Array.isArray(body && body.items) ? body.items : [];
  // Montants recalculés côté serveur depuis le catalogue de référence (jamais confiance au client).
  const order = buildOrder(CATALOGUE, items);
  if (!order.ok) {
    return json({ ok: false, error: order.error || "Commande invalide." }, 400, headers);
  }

  try {
    const payload = {
      intent: "CAPTURE",
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
        items: order.lines.map((l: any) => ({
          name: String(l.title || "Article").slice(0, 127),
          description: l.variant ? String(l.variant).slice(0, 127) : undefined,
          quantity: String(l.quantity),
          unit_amount: amountObj(order.totals.currency, l.unitAmount),
        })),
      }],
      application_context: {
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
      },
    };

    const requestId = safeRequestId(body && body.requestId);
    const reqHeaders: Record<string, string> = requestId
      ? { "PayPal-Request-Id": requestId, "Prefer": "return=representation" }
      : { "Prefer": "return=representation" };

    const created = await paypalFetch("/v2/checkout/orders", {
      method: "POST",
      headers: reqHeaders,
      body: JSON.stringify(payload),
    });

    if (!created || !created.id) {
      return json({ ok: false, error: "Création de commande PayPal impossible." }, 502, headers);
    }
    return json({ ok: true, id: created.id, status: created.status || "CREATED", totals: order.totals }, 200, headers);
  } catch (err: any) {
    const status = err && err.status ? err.status : 502;
    const msg = status === 503 ? "Paiement non configuré côté serveur." : "Impossible de créer la commande PayPal.";
    return json({ ok: false, error: msg }, status, headers);
  }
});
