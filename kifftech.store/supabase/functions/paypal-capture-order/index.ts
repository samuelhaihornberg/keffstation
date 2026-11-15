// Capture serveur après approbation du client. "Payé" uniquement après capture COMPLETED
// avec montant et devise identiques à la commande enregistrée côté serveur.
// Après paiement : le jeton de commande est purgé et un jeton de reçu (haché) est créé.
import { clientKey, corsHeaders, errorResponse, foreignOrigin, HttpError, json, randomToken, readJson, sha256Hex } from "../_shared/http.ts";
import { db, rateLimitOk } from "../_shared/db.ts";
import { paypalFetch, PayPalError } from "../_shared/paypal.ts";

function firstCapture(order: any): any {
  const pu = (order && order.purchase_units && order.purchase_units[0]) || {};
  return (pu.payments && pu.payments.captures && pu.payments.captures[0]) || null;
}

function invoiceView(inv: any) {
  return {
    number: inv.invoice_number,
    issuedAt: inv.issued_at,
    currency: inv.currency,
    subtotal: Number(inv.subtotal),
    shipping: Number(inv.shipping),
    taxes: Number(inv.taxes),
    totalPaid: Number(inv.total_paid),
    paypalCaptureId: inv.paypal_capture_id,
    lines: inv.lines,
    legalComplete: inv.legal_complete === true,
  };
}

Deno.serve(async (req: Request) => {
  let lockedId: string | null = null;
  try {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(req) });
    if (foreignOrigin(req)) throw new HttpError(403, "forbidden_origin", "Origine non autorisée.");
    if (req.method !== "POST") throw new HttpError(405, "method", "Méthode non autorisée.");
    if (!(await rateLimitOk(await clientKey(req, "capture"), 600, 30))) {
      throw new HttpError(429, "rate_limited", "Trop de tentatives. Réessayez plus tard.");
    }

    const body = await readJson(req, 4096);
    const orderID = typeof body.orderID === "string" ? body.orderID.trim() : "";
    const orderToken = typeof body.orderToken === "string" ? body.orderToken : "";
    if (!/^[A-Z0-9]{8,40}$/i.test(orderID) || orderToken.length < 20 || orderToken.length > 200) {
      throw new HttpError(400, "bad_request", "Requête invalide.");
    }

    const { data: row } = await db().from("payment_orders")
      .select("id, status, currency, total, token_hash, paypal_order_id")
      .eq("paypal_order_id", orderID).maybeSingle();
    if (!row) throw new HttpError(404, "order_not_found", "Commande introuvable.");
    if (row.status === "paid") {
      throw new HttpError(409, "already_paid", "Ce paiement est déjà confirmé. Votre reçu a été ouvert lors de la première confirmation.");
    }
    if (row.token_hash === "purged" || (await sha256Hex(orderToken)) !== row.token_hash) {
      throw new HttpError(403, "bad_token", "Accès à la commande refusé.");
    }
    if (row.status === "capturing") throw new HttpError(409, "capture_in_progress", "Paiement en cours de confirmation. Patientez.");
    if (row.status !== "created") throw new HttpError(400, "not_capturable", "Cette commande ne peut plus être encaissée.");

    // Verrou : une seule capture à la fois pour cette commande.
    const { data: locked } = await db().from("payment_orders")
      .update({ status: "capturing", updated_at: new Date().toISOString() })
      .eq("id", row.id).eq("status", "created").select("id");
    if (!locked || locked.length === 0) throw new HttpError(409, "capture_in_progress", "Paiement en cours de confirmation. Patientez.");
    lockedId = row.id;

    const pp = await paypalFetch(`/v2/checkout/orders/${encodeURIComponent(orderID)}`, { method: "GET" });
    let capture: any = null;
    if (pp.status === "COMPLETED") {
      capture = firstCapture(pp); // déjà capturé lors d'une tentative précédente : on réconcilie
    } else if (pp.status === "APPROVED") {
      const cap = await paypalFetch(`/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`, {
        method: "POST",
        headers: { "PayPal-Request-Id": `capture-${row.id}`, "Prefer": "return=representation" },
        body: "{}",
      });
      if (cap && cap.status === "COMPLETED") capture = firstCapture(cap);
    } else {
      throw new HttpError(400, "not_approved", "Le paiement n’a pas été approuvé par le client.");
    }

    const amountOk = capture
      && capture.status === "COMPLETED"
      && capture.amount
      && capture.amount.currency_code === row.currency
      && Number(capture.amount.value).toFixed(2) === Number(row.total).toFixed(2);
    if (!amountOk) {
      await db().from("payment_orders").update({ status: "failed", failure_code: "amount_mismatch", paypal_capture_id: capture ? String(capture.id) : null, updated_at: new Date().toISOString() }).eq("id", row.id);
      lockedId = null;
      throw new HttpError(409, "amount_mismatch", "Le montant confirmé ne correspond pas à la commande. Contactez la boutique avec la référence de paiement.");
    }

    const captureId = String(capture.id);
    const receiptToken = randomToken(32);
    const { data: invNumber, error: payErr } = await db().rpc("kt_mark_paid", {
      p_order_id: row.id,
      p_capture_id: captureId,
      p_receipt_hash: await sha256Hex(receiptToken),
    });
    if (payErr) throw new HttpError(503, "db_unavailable", "Paiement reçu mais confirmation interne en attente. Conservez la référence de paiement.");
    lockedId = null;

    // Purge immédiate du jeton de commande : il n'a plus d'usage après paiement.
    await db().from("payment_orders").update({ token_hash: "purged", request_id: null, updated_at: new Date().toISOString() }).eq("id", row.id);

    const { data: inv } = await db().from("invoices").select("*").eq("invoice_number", invNumber).maybeSingle();
    return json({
      ok: true,
      status: "COMPLETED",
      captureId,
      invoiceNumber: invNumber,
      receiptToken,
      invoice: inv ? invoiceView(inv) : null,
    }, 200, corsHeaders(req));
  } catch (err) {
    if (lockedId) {
      // Libère le verrou. Une nouvelle tentative réconcilie via PayPal (idempotent).
      const declined = err instanceof PayPalError && err.isDeclined();
      await db().from("payment_orders").update({
        status: "created",
        failure_code: declined ? "declined" : "capture_retry",
        updated_at: new Date().toISOString(),
      }).eq("id", lockedId).eq("status", "capturing");
    }
    if (err instanceof PayPalError && err.isDeclined()) {
      return json({ ok: false, code: "declined", error: "Paiement refusé par PayPal. Choisissez un autre moyen de paiement." }, 402, corsHeaders(req));
    }
    return errorResponse(req, err);
  }
});
