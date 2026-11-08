// ============================================================
// Keffstation Admin — Fonction de lecture des statistiques
// Supabase Edge Function (Deno)
//
// Déploie via Supabase → Edge Functions → Via Editor
// Nom : read-stats
// Verify JWT : OFF (l'admin s'authentifie séparément)
// Secrets requis : SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//
// Cette fonction contourne RLS avec la clé service_role (côté serveur uniquement)
// et retourne des données agrégées pour le tableau de bord.
// ============================================================

import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } },
);

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Max-Age": "86400",
};

function json(status: number, body: unknown, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders,
      ...(origin ? { "Access-Control-Allow-Origin": origin } : {}),
    },
  });
}

function empty(status: number, origin: string | null) {
  return new Response(null, { status, headers: corsHeaders });
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return empty(204, origin);
  }

  if (req.method !== "POST" && req.method !== "GET") {
    return json(405, { error: "method_not_allowed" }, origin);
  }

  let body: { days?: number; start?: string; end?: string } = {};
  if (req.method === "POST") {
    try {
      body = await req.json();
    } catch {
      return json(400, { error: "invalid_json" }, origin);
    }
  }

  const days = body.days ?? 7;
  const now = new Date();
  const end = body.end ? new Date(body.end) : now;
  const start = body.start
    ? new Date(body.start)
    : new Date(now.getTime() - (days - 1) * 86400000);

  const startISO = start.toISOString();
  const endISO = end.toISOString();

  // ------------------------------------------------------------
  // 1. Activité quotidienne (vues de page, clics, recherches, formulaires)
  // ------------------------------------------------------------
  const { data: activity } = await supabase
    .from("v_daily_activity")
    .select("*")
    .gte("day", start.toISOString().slice(0, 10))
    .lte("day", end.toISOString().slice(0, 10))
    .order("day", { ascending: true });

  // ------------------------------------------------------------
  // 2. Répartition des clics par type
  // ------------------------------------------------------------
  const { data: clicks } = await supabase
    .from("v_click_breakdown")
    .select("element_type, clicks")
    .gte("clicks", 0);

  // ------------------------------------------------------------
  // 3. Formulaires par formulaire
  // ------------------------------------------------------------
  const { data: forms } = await supabase
    .from("v_form_funnel")
    .select("*");

  // ------------------------------------------------------------
  // 4. Top recherches internes
  // ------------------------------------------------------------
  const { data: searches } = await supabase
    .from("v_search_top")
    .select("*")
    .order("searches", { ascending: false })
    .limit(10);

  // ------------------------------------------------------------
  // 5. GSC (Google Search Console)
  // ------------------------------------------------------------
  const { data: gsc } = await supabase
    .from("v_gsc_daily")
    .select("*")
    .gte("date", start.toISOString().slice(0, 10))
    .lte("date", end.toISOString().slice(0, 10))
    .order("date", { ascending: true });

  // ------------------------------------------------------------
  // 6. Dernière fiabilité
  // ------------------------------------------------------------
  const { data: reliability } = await supabase
    .from("v_reliability_latest")
    .select("*");

  // ------------------------------------------------------------
  // Totaux
  // ------------------------------------------------------------
  const totals = {
    visits: activity?.reduce((s, r) => s + (r.page_views ?? 0), 0) ?? 0,
    clicks: activity?.reduce((s, r) => s + (r.clicks ?? 0), 0) ?? 0,
    searches: activity?.reduce((s, r) => s + (r.searches ?? 0), 0) ?? 0,
    forms: activity?.reduce((s, r) => s + (r.form_submissions ?? 0), 0) ?? 0,
    sessions: activity?.reduce((s, r) => s + (r.sessions ?? 0), 0) ?? 0,
  };

  const clicksByType = {
    link: clicks?.filter((c) => c.element_type === "link").reduce((s, c) => s + c.clicks, 0) ?? 0,
    button: clicks?.filter((c) => c.element_type === "button").reduce((s, c) => s + c.clicks, 0) ?? 0,
    tab: clicks?.filter((c) => c.element_type === "tab").reduce((s, c) => s + c.clicks, 0) ?? 0,
    menu: clicks?.filter((c) => c.element_type === "menu").reduce((s, c) => s + c.clicks, 0) ?? 0,
  };

  return json(200, {
    period: { start: startISO, end: endISO, days },
    totals,
    clicks_by_type: clicksByType,
    activity: activity ?? [],
    forms: forms ?? [],
    searches: searches ?? [],
    gsc: gsc ?? [],
    reliability: reliability ?? null,
  }, origin);
});
