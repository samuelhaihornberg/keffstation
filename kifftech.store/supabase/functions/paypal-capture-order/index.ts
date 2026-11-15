import { corsHeaders, json, options, paypalFetch, safeRequestId } from "../_shared/paypal.ts";

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

  const orderID = body && typeof body.orderID === "string" ? body.orderID.trim() : "";
  if (!/^[-A-Z0-9]+$/i.test(orderID)) {
    return json({ ok: false, error: "Identifiant de commande invalide." }, 400, headers);
  }

  try {
    const existing = await paypalFetch(`/v2/checkout/orders/${encodeURIComponent(orderID)}`, { method: "GET" });
    const existingStatus = existing && existing.status;
    if (existingStatus === "COMPLETED") {
      const cap = (((existing.purchase_units || [])[0] || {}).payments || {}).captures || [];
      return json({ ok: true, status: "COMPLETED", captureId: (cap[0] || {}).id || null, alreadyCaptured: true }, 200, headers);
    }
    if (existingStatus && existingStatus !== "APPROVED") {
      return json({ ok: false, error: "Le paiement n’est pas approuvé pour capture.", status: existingStatus }, 400, headers);
    }

    const requestId = safeRequestId(body && body.requestId);
    const reqHeaders: Record<string, string> = requestId
      ? { "PayPal-Request-Id": requestId, "Prefer": "return=representation" }
      : { "Prefer": "return=representation" };
    const captured = await paypalFetch(`/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`, {
      method: "POST",
      headers: reqHeaders,
      body: "{}",
    });

    const status = captured && captured.status;
    if (status !== "COMPLETED") {
      return json({ ok: false, error: "Le paiement n’a pas été confirmé par le serveur.", status: status || "UNKNOWN" }, 400, headers);
    }

    const captures = (((captured.purchase_units || [])[0] || {}).payments || {}).captures || [];
    const captureId = (captures[0] || {}).id || null;

    // Succès uniquement après capture confirmée côté serveur.
    return json({ ok: true, status: "COMPLETED", captureId }, 200, headers);
  } catch (err: any) {
    const status = err && err.status ? err.status : 502;
    const msg = status === 503 ? "Paiement non configuré côté serveur." : "Impossible de confirmer la capture du paiement PayPal.";
    return json({ ok: false, error: msg }, status, headers);
  }
});
