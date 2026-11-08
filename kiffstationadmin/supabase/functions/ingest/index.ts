// ============================================================
// Keffstation — Fonction d'ingestion d'événements anonymisés
// Supabase Edge Function (Deno)
//
// Déploiement : voir docs/SUPABASE_SETUP.md
// Secrets requis :
//   SESSION_PEPPER   : chaîne aléatoire longue (Bitwarden)
//   ALLOWED_ORIGINS  : origines autorisées, séparées par des virgules
//
// Cette fonction n'accepte aucune donnée personnelle :
//   - pas de valeur de formulaire ;
//   - pas d'IP brute ;
//   - identifiant de session haché côté serveur ;
//   - métadonnées filtrées par liste blanche.
// ============================================================

import { createClient } from "npm:@supabase/supabase-js@2";

const MAX_EVENTS = 25;
const MAX_BODY_BYTES = 16 * 1024;
const MAX_STRING = 200;
const MAX_EVENTS_PER_MINUTE = 120;

const EVENT_TYPES = new Set([
  "page_view",
  "click",
  "tab_view",
  "menu_open",
  "form_start",
  "form_submit",
  "form_success",
  "form_error",
  "search",
  "payment_attempt",
  "payment_result",
  "error",
]);

const ELEMENT_TYPES = new Set([
  "link",
  "button",
  "tab",
  "menu",
  "form",
  "search",
  "payment",
]);

const DEVICE_TYPES = new Set(["mobile", "tablet", "desktop", "unknown"]);

// Seules ces clés techniques sont conservées dans metadata.
// Tout le reste est ignoré, notamment les champs de formulaire.
const METADATA_KEYS = new Set([
  "query",
  "results_count",
  "clicked_result_id",
  "form_id",
  "error_code",
  "payment_provider",
  "payment_status",
  "duration_ms",
]);

const BOT_PATTERN =
  /bot|crawler|spider|slurp|bingpreview|headless|lighthouse|pagespeed|facebookexternalhit|whatsapp|telegrambot|semrush|ahrefs|mj12bot|dotbot|yandex/i;

const encoder = new TextEncoder();

const allowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } },
);

// ------------------------------------------------------------
// Utilitaires
// ------------------------------------------------------------

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };

  if (origin && (allowedOrigins.length === 0 || allowedOrigins.includes(origin))) {
    headers["Access-Control-Allow-Origin"] =
      allowedOrigins.length === 0 ? "*" : origin;
  }

  return headers;
}

function isOriginAllowed(origin: string | null): boolean {
  // Pas d'en-tête Origin : requête serveur ou curl. CORS ne s'applique pas.
  if (!origin) return true;
  if (allowedOrigins.length === 0) return true;
  return allowedOrigins.includes(origin);
}

function jsonResponse(
  status: number,
  body: Record<string, unknown>,
  origin: string | null,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(origin),
    },
  });
}

function emptyResponse(status: number, origin: string | null): Response {
  return new Response(null, { status, headers: corsHeaders(origin) });
}

function cleanString(value: unknown, max = MAX_STRING): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim();
  if (!cleaned) return null;
  return cleaned.slice(0, max);
}

function cleanPath(value: unknown): string | null {
  const raw = cleanString(value, 300);
  if (!raw) return null;
  try {
    const url = new URL(raw, "https://keffstation.invalid");
    return (url.pathname || "/").slice(0, MAX_STRING);
  } catch {
    return null;
  }
}

function cleanDomain(value: unknown): string | null {
  const raw = cleanString(value, 120);
  if (!raw) return null;
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(raw)) return null;
  return raw.toLowerCase();
}

function cleanMetadata(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const out: Record<string, unknown> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (!METADATA_KEYS.has(key)) continue;

    if (key === "results_count" || key === "duration_ms") {
      const number = Number(raw);
      if (Number.isFinite(number) && number >= 0 && number <= 1_000_000) {
        out[key] = Math.round(number);
      }
      continue;
    }

    if (key === "query") {
      const query = cleanString(raw, 120);
      if (query) out[key] = query;
      continue;
    }

    const text = cleanString(raw, 80);
    if (text) out[key] = text;
  }

  return out;
}

function cleanTime(value: unknown): string {
  const now = Date.now();
  const date = typeof value === "string" ? new Date(value) : new Date();
  const time = Number.isNaN(date.getTime()) ? now : date.getTime();
  // On refuse les dates trop anciennes ou dans le futur.
  const clamped = Math.min(
    now + 5 * 60_000,
    Math.max(now - 7 * 86_400_000, time),
  );
  return new Date(clamped).toISOString();
}

async function hashSession(sessionId: string): Promise<string> {
  const pepper = Deno.env.get("SESSION_PEPPER") ?? "";
  if (!pepper) {
    console.warn("SESSION_PEPPER absent : hachage sans poivre.");
  }
  const digest = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(`${pepper}:${sessionId}`),
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// ------------------------------------------------------------
// Handler
// ------------------------------------------------------------

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");

  if (request.method === "OPTIONS") {
    return emptyResponse(204, origin);
  }

  if (request.method !== "POST") {
    return jsonResponse(405, { error: "method_not_allowed" }, origin);
  }

  if (!isOriginAllowed(origin)) {
    return jsonResponse(403, { error: "origin_not_allowed" }, origin);
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  if (BOT_PATTERN.test(userAgent)) {
    // Robots : on ignore silencieusement, sans écrire en base.
    return emptyResponse(204, origin);
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return jsonResponse(413, { error: "payload_too_large" }, origin);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(400, { error: "invalid_json" }, origin);
  }

  const container = payload as { events?: unknown };
  const events = Array.isArray(container?.events)
    ? container.events
    : Array.isArray(payload)
      ? payload
      : null;

  if (!events || events.length === 0 || events.length > MAX_EVENTS) {
    return jsonResponse(400, { error: "invalid_events" }, origin);
  }

  const eventRows: Record<string, unknown>[] = [];
  const formRows: Record<string, unknown>[] = [];
  const searchRows: Record<string, unknown>[] = [];
  let firstSession: {
    hash: string;
    occurredAt: string;
    deviceType: string;
    path: string | null;
    referrerDomain: string | null;
  } | null = null;

  for (const rawEvent of events) {
    if (!rawEvent || typeof rawEvent !== "object") continue;
    const item = rawEvent as Record<string, unknown>;

    const eventType =
      typeof item.type === "string" && EVENT_TYPES.has(item.type)
        ? item.type
        : null;
    if (!eventType) continue;

    const rawSessionId = cleanString(item.sessionId, 128);
    if (!rawSessionId) continue;

    const sessionHash = await hashSession(rawSessionId);
    const occurredAt = cleanTime(item.occurredAt);
    const deviceType =
      typeof item.deviceType === "string" && DEVICE_TYPES.has(item.deviceType)
        ? item.deviceType
        : "unknown";
    const elementType =
      typeof item.elementType === "string" &&
        ELEMENT_TYPES.has(item.elementType)
        ? item.elementType
        : null;
    const elementId = cleanString(item.elementId, 80);
    const elementLabel = cleanString(item.elementLabel, 80);
    const path = cleanPath(item.path);
    const referrerDomain = cleanDomain(item.referrerDomain);
    const metadata = cleanMetadata(item.metadata);

    eventRows.push({
      occurred_at: occurredAt,
      session_id: sessionHash,
      event_type: eventType,
      element_type: elementType,
      element_id: elementId,
      element_label: elementLabel,
      path,
      metadata,
      device_type: deviceType,
      referrer_domain: referrerDomain,
      country_code: null,
    });

    if (!firstSession) {
      firstSession = {
        hash: sessionHash,
        occurredAt,
        deviceType,
        path,
        referrerDomain,
      };
    } else if (occurredAt < firstSession.occurredAt) {
      firstSession.occurredAt = occurredAt;
      firstSession.deviceType = deviceType;
      firstSession.path = path;
      firstSession.referrerDomain = referrerDomain;
    }

    if (eventType.startsWith("form_")) {
      const formId = cleanString(metadata.form_id ?? elementId, 80);
      if (formId) {
        formRows.push({
          form_id: formId,
          event_type: eventType.replace("form_", ""),
          error_code:
            eventType === "form_error"
              ? cleanString(metadata.error_code, 80)
              : null,
          occurred_at: occurredAt,
        });
      }
    }

    if (eventType === "search") {
      const query = cleanString(metadata.query, 120);
      if (query) {
        const results = Number(metadata.results_count);
        searchRows.push({
          query,
          results_count:
            Number.isFinite(results) && results >= 0 ? Math.round(results) : 0,
          clicked_result_id: cleanString(metadata.clicked_result_id, 80),
          occurred_at: occurredAt,
        });
      }
    }
  }

  if (eventRows.length === 0 || !firstSession) {
    return jsonResponse(400, { error: "no_valid_events" }, origin);
  }

  // Limitation simple par session : 120 événements par minute.
  const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();
  const { count, error: countError } = await supabase
    .from("analytics_events")
    .select("id", { count: "exact", head: true })
    .eq("session_id", firstSession.hash)
    .gte("occurred_at", oneMinuteAgo);

  if (countError) {
    console.error("rate limit check failed", countError.message);
  } else if ((count ?? 0) > MAX_EVENTS_PER_MINUTE) {
    return jsonResponse(429, { error: "rate_limited" }, origin);
  }

  const { error: eventsError } = await supabase
    .from("analytics_events")
    .insert(eventRows);

  if (eventsError) {
    console.error("analytics_events insert failed", eventsError.message);
    return jsonResponse(500, { error: "storage_failed" }, origin);
  }

  if (formRows.length > 0) {
    const { error } = await supabase.from("form_events").insert(formRows);
    if (error) console.error("form_events insert failed", error.message);
  }

  if (searchRows.length > 0) {
    const { error } = await supabase.from("search_events").insert(searchRows);
    if (error) console.error("search_events insert failed", error.message);
  }

  const nowIso = new Date().toISOString();
  const { error: sessionError } = await supabase.from("sessions").upsert(
    {
      session_id: firstSession.hash,
      started_at: firstSession.occurredAt,
      ended_at: nowIso,
      device_type: firstSession.deviceType,
      landing_path: firstSession.path,
      referrer_domain: firstSession.referrerDomain,
      is_bot: false,
    },
    { onConflict: "session_id", ignoreDuplicates: true },
  );

  if (sessionError) {
    console.error("sessions upsert failed", sessionError.message);
  } else {
    const { error: updateError } = await supabase
      .from("sessions")
      .update({ ended_at: nowIso })
      .eq("session_id", firstSession.hash);
    if (updateError) {
      console.error("sessions update failed", updateError.message);
    }
  }

  return emptyResponse(204, origin);
});
