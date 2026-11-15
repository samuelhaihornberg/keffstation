// Helpers HTTP partagés (Supabase Edge Functions). Aucun secret ici.

export class HttpError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function allowedOrigin(): string {
  return String(Deno.env.get("PUBLIC_SITE_ORIGIN") || "").trim().replace(/\/+$/, "");
}

// CORS limité à l'origine exacte de la vitrine publiée.
export function corsHeaders(req: Request): Record<string, string> {
  const allowed = allowedOrigin();
  const origin = req.headers.get("Origin") || "";
  const base: Record<string, string> = { "Vary": "Origin" };
  if (!allowed || !origin || origin !== allowed) return base;
  return {
    ...base,
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Max-Age": "86400",
  };
}

// Requête venant d'un navigateur d'une autre origine : refusée.
export function foreignOrigin(req: Request): boolean {
  const origin = req.headers.get("Origin");
  if (!origin) return false;
  return origin !== allowedOrigin();
}

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });
}

export function errorResponse(req: Request, err: unknown): Response {
  if (err instanceof HttpError) {
    return json({ ok: false, code: err.code, error: err.message }, err.status, corsHeaders(req));
  }
  console.error("unexpected_error", (err as Error)?.name || "Error");
  return json({ ok: false, code: "internal", error: "Erreur serveur." }, 500, corsHeaders(req));
}

export async function readJson(req: Request, maxBytes = 16_384): Promise<any> {
  const text = await req.text();
  if (text.length > maxBytes) throw new HttpError(413, "too_large", "Requête trop volumineuse.");
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new HttpError(400, "bad_json", "Requête invalide.");
  }
}

export async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function randomToken(bytes = 32): string {
  const arr = crypto.getRandomValues(new Uint8Array(bytes));
  return btoa(String.fromCharCode(...arr)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Empreinte d'IP (non réversible) pour limiter les appels abusifs sans conserver l'IP.
export async function clientKey(req: Request, scope: string): Promise<string> {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  return `${scope}:${(await sha256Hex(ip)).slice(0, 32)}`;
}

export function safeRequestId(value: unknown): string {
  const id = typeof value === "string" ? value.trim() : "";
  return /^[A-Za-z0-9._:-]{8,80}$/.test(id) ? id : "";
}
