// Appels REST PayPal côté serveur. Secrets lus uniquement depuis l'environnement des fonctions.
import { HttpError } from "./http.ts";

const ALLOWED_BASES = ["https://api-m.paypal.com", "https://api-m.sandbox.paypal.com"];

export function getPayPalConfig() {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID") || "";
  const clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET") || "";
  const base = String(Deno.env.get("PAYPAL_API_BASE") || "").replace(/\/+$/, "");
  if (!clientId || !clientSecret || !base) {
    throw new HttpError(503, "paypal_not_configured", "Paiement non configuré côté serveur.");
  }
  if (!ALLOWED_BASES.includes(base)) {
    throw new HttpError(503, "paypal_not_configured", "Paiement non configuré côté serveur.");
  }
  const environment = base === "https://api-m.paypal.com" ? "live" : "sandbox";
  return { clientId, clientSecret, base, environment };
}

let cachedToken: { value: string; expiresAt: number; base: string } | null = null;

async function accessToken(): Promise<string> {
  const { clientId, clientSecret, base } = getPayPalConfig();
  if (cachedToken && cachedToken.base === base && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new HttpError(502, "paypal_auth", "Authentification PayPal impossible.");
  const data = await res.json();
  cachedToken = { value: data.access_token, expiresAt: Date.now() + (data.expires_in || 300) * 1000, base };
  return data.access_token;
}

export class PayPalError extends HttpError {
  paypalName: string;
  issues: string;
  constructor(status: number, paypalName: string, issues = "") {
    super(status, "paypal_error", "Requête PayPal refusée.");
    this.paypalName = paypalName;
    this.issues = issues;
  }
  isDeclined(): boolean {
    return /INSTRUMENT_DECLINED|DECLINED/i.test(`${this.paypalName} ${this.issues}`);
  }
}

// Ne journalise jamais les réponses PayPal complètes (données payeur).
export async function paypalFetch(path: string, init: { method: string; body?: string; headers?: Record<string, string> }): Promise<any> {
  const { base } = getPayPalConfig();
  const token = await accessToken();
  let res: Response;
  try {
    res = await fetch(`${base}${path}`, {
      method: init.method,
      body: init.body,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(init.headers || {}) },
    });
  } catch {
    throw new HttpError(502, "paypal_network", "PayPal est injoignable. Réessayez.");
  }
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  if (!res.ok) {
    const name = String((data && data.name) || `HTTP_${res.status}`).slice(0, 80);
    if (res.status >= 500) throw new HttpError(502, "paypal_unavailable", "PayPal indisponible. Réessayez.");
    const issues = Array.isArray(data && data.details)
      ? data.details.map((d: any) => String((d && d.issue) || "")).filter(Boolean).join(",").slice(0, 200)
      : "";
    throw new PayPalError(400, name, issues);
  }
  return data;
}
