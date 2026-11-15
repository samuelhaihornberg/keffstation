// Accès base uniquement côté serveur. La clé est fournie par l'environnement Supabase des fonctions
// (injectée par la plateforme, jamais écrite dans le code, le front ou Git).
import { createClient } from "npm:@supabase/supabase-js@2";
import { HttpError } from "./http.ts";

let client: any = null;

export function db(): any {
  if (client) return client;
  const url = Deno.env.get("SUPABASE_URL") || "";
  // Variables injectées par la plateforme (ne jamais en créer manuellement) : clé serveur de la plateforme.
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SECRET_KEY") || "";
  if (!url || !key) throw new HttpError(503, "db_unavailable", "Service temporairement indisponible.");
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

// Limite de débit atomique (fonction SQL kt_rate_limit_hit). Fenêtre en secondes.
export async function rateLimitOk(key: string, windowSeconds: number, max: number): Promise<boolean> {
  const { data, error } = await db().rpc("kt_rate_limit_hit", { p_key: key, p_window_seconds: windowSeconds, p_max: max });
  if (error) throw new HttpError(503, "db_unavailable", "Service temporairement indisponible.");
  return data === true;
}
