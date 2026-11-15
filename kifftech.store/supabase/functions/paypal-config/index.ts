// Configuration publique du SDK PayPal. Ne renvoie jamais PAYPAL_CLIENT_SECRET.
import { LEGAL } from "../_shared/legal.js";
import { corsHeaders, errorResponse, foreignOrigin, HttpError, json, clientKey } from "../_shared/http.ts";
import { rateLimitOk } from "../_shared/db.ts";
import { getPayPalConfig } from "../_shared/paypal.ts";

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(req) });
    if (foreignOrigin(req)) throw new HttpError(403, "forbidden_origin", "Origine non autorisée.");
    if (req.method !== "GET") throw new HttpError(405, "method", "Méthode non autorisée.");
    if (!(await rateLimitOk(await clientKey(req, "config"), 600, 120))) {
      throw new HttpError(429, "rate_limited", "Trop de tentatives. Réessayez plus tard.");
    }
    const { clientId, environment } = getPayPalConfig();
    return json({
      ok: true,
      clientId,
      currency: "EUR",
      intent: "capture",
      environment,
      legalReady: Boolean(LEGAL.termsUrl && LEGAL.termsVersion),
      termsVersion: LEGAL.termsVersion || null,
    }, 200, corsHeaders(req));
  } catch (err) {
    return errorResponse(req, err);
  }
});
