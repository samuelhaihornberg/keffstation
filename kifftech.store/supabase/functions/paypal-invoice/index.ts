// Consultation d'un reçu par son numéro + jeton de reçu (seule l'empreinte est stockée).
import { clientKey, corsHeaders, errorResponse, foreignOrigin, HttpError, json, readJson, sha256Hex } from "../_shared/http.ts";
import { db, rateLimitOk } from "../_shared/db.ts";

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(req) });
    if (foreignOrigin(req)) throw new HttpError(403, "forbidden_origin", "Origine non autorisée.");
    if (req.method !== "POST") throw new HttpError(405, "method", "Méthode non autorisée.");
    if (!(await rateLimitOk(await clientKey(req, "invoice"), 600, 60))) {
      throw new HttpError(429, "rate_limited", "Trop de tentatives. Réessayez plus tard.");
    }
    const body = await readJson(req, 2048);
    const number = typeof body.invoiceNumber === "string" ? body.invoiceNumber.trim() : "";
    const token = typeof body.receiptToken === "string" ? body.receiptToken : "";
    if (!/^KT-\d{4}-\d{6}$/.test(number) || token.length < 20 || token.length > 200) {
      throw new HttpError(400, "bad_request", "Requête invalide.");
    }
    const { data: inv } = await db().from("invoices").select("*").eq("invoice_number", number).maybeSingle();
    if (!inv) throw new HttpError(404, "not_found", "Reçu introuvable.");
    if ((await sha256Hex(token)) !== inv.receipt_token_hash) throw new HttpError(403, "bad_token", "Accès au reçu refusé.");
    return json({
      ok: true,
      invoice: {
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
        seller: inv.seller || null,
      },
    }, 200, corsHeaders(req));
  } catch (err) {
    return errorResponse(req, err);
  }
});
