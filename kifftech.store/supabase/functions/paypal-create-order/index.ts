// Création d'une commande PayPal ponctuelle. Montants recalculés côté serveur uniquement.
import { CATALOGUE } from "../_shared/catalogue.js";
import { buildOrder } from "../_shared/payment-core.js";
import { LEGAL } from "../_shared/legal.js";
import { clientKey, corsHeaders, errorResponse, foreignOrigin, HttpError, json, randomToken, readJson, safeRequestId, sha256Hex } from "../_shared/http.ts";
import { db, rateLimitOk } from "../_shared/db.ts";
import { getPayPalConfig, paypalFetch } from "../_shared/paypal.ts";

const money = (v: number) => Number(v).toFixed(2);

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(req) });
    if (foreignOrigin(req)) throw new HttpError(403, "forbidden_origin", "Origine non autorisée.");
    if (req.method !== "POST") throw new HttpError(405, "method", "Méthode non autorisée.");
    if (!(await rateLimitOk(await clientKey(req, "create"), 600, 10))) {
      throw new HttpError(429, "rate_limited", "Trop de tentatives. Réessayez plus tard.");
    }

    const body = await readJson(req);
    const items = Array.isArray(body.items) && body.items.length > 0 && body.items.length <= 20 ? body.items : null;
    if (!items) throw new HttpError(400, "bad_items", "Panier invalide.");

    if (!LEGAL.termsUrl || !LEGAL.termsVersion) {
      throw new HttpError(503, "legal_not_configured", "Conditions d’utilisation non publiées : paiement indisponible.");
    }
    if (body.acceptTerms !== true) {
      throw new HttpError(400, "terms_not_accepted", "Vous devez accepter les conditions avant le paiement.");
    }
    if (body.termsVersion !== LEGAL.termsVersion) {
      throw new HttpError(409, "terms_version", "Les conditions ont changé. Rechargez la page.");
    }

    // Recalcul serveur : produits, variantes, quantités, devise, livraison, taxes, total.
    const order: any = buildOrder(CATALOGUE, items);
    if (!order.ok) throw new HttpError(400, "order_invalid", order.error || "Commande invalide.");
    const t = order.totals;

    getPayPalConfig(); // échoue proprement si PayPal n'est pas configuré, avant toute écriture
    const requestId = safeRequestId(body.requestId) || crypto.randomUUID();
    const orderToken = randomToken(32);

    const { data: row, error: insErr } = await db().from("payment_orders").insert({
      request_id: requestId,
      status: "created",
      currency: t.currency,
      subtotal: t.subtotal,
      shipping: t.shipping,
      taxes: t.taxes,
      total: t.total,
      lines: order.lines,
      terms_version: LEGAL.termsVersion,
      terms_url: LEGAL.termsUrl,
      terms_accepted_at: new Date().toISOString(),
      token_hash: await sha256Hex(orderToken),
    }).select("id").single();
    if (insErr) {
      if (insErr.code === "23505") throw new HttpError(409, "duplicate", "Commande déjà en cours de création.");
      throw new HttpError(503, "db_unavailable", "Service temporairement indisponible.");
    }

    try {
      const created = await paypalFetch("/v2/checkout/orders", {
        method: "POST",
        headers: { "PayPal-Request-Id": `create-${requestId}`, "Prefer": "return=representation" },
        body: JSON.stringify({
          intent: "CAPTURE",
          custom_id: row.id,
          purchase_units: [{
            custom_id: row.id,
            amount: {
              currency_code: t.currency,
              value: money(t.total),
              breakdown: {
                item_total: { currency_code: t.currency, value: money(t.subtotal) },
                shipping: { currency_code: t.currency, value: money(t.shipping) },
                tax_total: { currency_code: t.currency, value: money(t.taxes) },
              },
            },
            items: order.lines.map((l: any) => ({
              name: String(l.title || "Article").slice(0, 127),
              description: l.variant ? String(l.variant).slice(0, 127) : undefined,
              quantity: String(l.quantity),
              unit_amount: { currency_code: t.currency, value: money(l.unitAmount) },
            })),
          }],
          application_context: { shipping_preference: "NO_SHIPPING", user_action: "PAY_NOW" },
        }),
      });
      if (!created || !created.id) throw new HttpError(502, "paypal_create", "Création de commande PayPal impossible.");

      const { error: updErr } = await db().from("payment_orders")
        .update({ paypal_order_id: created.id, updated_at: new Date().toISOString() })
        .eq("id", row.id);
      if (updErr) throw new HttpError(503, "db_unavailable", "Service temporairement indisponible.");

      return json({ ok: true, id: created.id, orderToken, totals: t, legal: { termsVersion: LEGAL.termsVersion, termsUrl: LEGAL.termsUrl } }, 200, corsHeaders(req));
    } catch (err) {
      await db().from("payment_orders").update({ status: "failed", failure_code: "create_failed", updated_at: new Date().toISOString() }).eq("id", row.id);
      throw err;
    }
  } catch (err) {
    return errorResponse(req, err);
  }
});
