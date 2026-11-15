// Banc de test : une seule process, handlers réels, PayPal et PostgREST simulés.
const handlers: Record<string, (r: Request) => Promise<Response> | Response> = {};
const realServe = Deno.serve;
(Deno as any).serve = (h: any) => { const name = (globalThis as any).__current; handlers[name] = h; return { finished: Promise.resolve() } as any; };
Deno.env.set("SUPABASE_URL", "https://mock-supabase.test");
Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "mock-service-role-not-real");
Deno.env.set("PUBLIC_SITE_ORIGIN", "https://samuelhaihornberg.github.io");
Deno.env.set("PAYPAL_CLIENT_ID", "TEST_CLIENT_ID_FAKE");
Deno.env.set("PAYPAL_CLIENT_SECRET", "TEST_SECRET_VALUE_MUST_NOT_LEAK");
Deno.env.set("PAYPAL_API_BASE", "https://api-m.sandbox.paypal.com");

const store: any = { orders: [] as any[], invoices: [] as any[], rate: true, invSeq: 0, ppOrders: {} as any, ppCalls: { create: 0, get: 0, capture: 0 }, nextPpStatus: "APPROVED", captureMode: "ok", lastCreatePayload: null as any, seq: 0 };
const realFetch = globalThis.fetch;
const json = (b: any, s = 200) => new Response(b === undefined ? "" : JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });
const rnd = (n: number) => Array.from(crypto.getRandomValues(new Uint8Array(n))).map((x) => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[x % 32]).join("");

function applyFilters(rows: any[], params: URLSearchParams) {
  let out = rows;
  for (const [k, v] of params) {
    if (["select", "order", "limit", "offset"].includes(k)) continue;
    if (v.startsWith("eq.")) { const val = v.slice(3); out = out.filter((r) => String(r[k]) === val); }
  }
  return out;
}

async function dbMock(url: URL, method: string, init: any): Promise<Response> {
  const table = url.pathname.replace("/rest/v1/", "");
  if (Deno.env.get("MOCK_DEBUG")) console.log("DB", method, url.pathname, url.search);
  const body = init.body ? JSON.parse(init.body) : undefined;
  const hget = (n: string) => { const h = init.headers; if (!h) return ""; if (typeof h.get === "function") return String(h.get(n) || ""); return String(h[n] || h[n.toLowerCase()] || ""); };
  const accept = hget("Accept");
  const wantObject = accept.includes("vnd.pgrst.object");
  const prefer = hget("Prefer");
  if (table.startsWith("rpc/")) {
    const fn = table.slice(4);
    if (fn === "kt_rate_limit_hit") return json(store.rate);
    if (fn === "kt_mark_paid") {
      const o = store.orders.find((x: any) => x.id === body.p_order_id);
      if (!o) return json({ code: "P0001", message: "order_not_found" }, 400);
      if (o.status === "paid") return json(store.invoices.find((i: any) => i.order_id === o.id).invoice_number);
      o.status = "paid"; o.paypal_capture_id = body.p_capture_id; o.paid_at = new Date().toISOString(); o.failure_code = null;
      store.invSeq += 1;
      const num = "KT-2026-" + String(store.invSeq).padStart(6, "0");
      store.invoices.push({ id: crypto.randomUUID(), order_id: o.id, invoice_number: num, issued_at: new Date().toISOString(), currency: o.currency, subtotal: o.subtotal, shipping: o.shipping, taxes: o.taxes, total_paid: o.total, paypal_capture_id: body.p_capture_id, lines: o.lines, seller: null, legal_complete: false, receipt_token_hash: body.p_receipt_hash });
      return json(num);
    }
    return json({ message: "unknown rpc" }, 404);
  }
  const rows = table === "payment_orders" ? store.orders : table === "invoices" ? store.invoices : [];
  if (method === "POST") {
    const dupReq = store.orders.find((o: any) => body.request_id && o.request_id === body.request_id);
    if (dupReq) return json({ code: "23505", message: "duplicate key" }, 409);
    const row = { id: crypto.randomUUID(), status: "created", paypal_order_id: null, ...body, created_at: new Date().toISOString() };
    rows.push(row);
    return wantObject ? json(row, 201) : json([row], 201);
  }
  if (method === "PATCH") {
    const hit = applyFilters(rows, url.searchParams);
    hit.forEach((r: any) => Object.assign(r, body));
    if (prefer.includes("return=representation")) return json(hit, 200);
    return new Response(null, { status: 204 });
  }
  if (method === "GET") {
    const hit = applyFilters(rows, url.searchParams);
    if (wantObject) {
      if (hit.length !== 1) return json({ code: "PGRST116", message: "JSON object requested, multiple (or no) rows returned" }, 406);
      return json(hit[0]);
    }
    return json(hit);
  }
  return json({ message: "unsupported" }, 405);
}

async function ppMock(url: URL, method: string, init: any): Promise<Response> {
  if (url.pathname === "/v1/oauth2/token") return json({ access_token: "FAKE_TOKEN", expires_in: 3600 });
  if (url.pathname === "/v2/checkout/orders" && method === "POST") {
    store.ppCalls.create += 1;
    const body = JSON.parse(init.body);
    store.lastCreatePayload = body;
    const id = "PP" + rnd(12);
    const pu = body.purchase_units[0];
    store.ppOrders[id] = { status: store.nextPpStatus, amount: pu.amount.value, currency: pu.amount.currency_code, capture: null };
    return json({ id, status: "CREATED" }, 201);
  }
  const m = url.pathname.match(/^\/v2\/checkout\/orders\/([A-Z0-9]+)(\/capture)?$/);
  if (m) {
    const o = store.ppOrders[m[1]];
    if (!o) return json({ name: "RESOURCE_NOT_FOUND" }, 404);
    if (!m[2] && method === "GET") {
      store.ppCalls.get += 1;
      return json({ id: m[1], status: o.status, purchase_units: [{ payments: { captures: o.capture ? [o.capture] : [] } }] });
    }
    if (m[2] && method === "POST") {
      store.ppCalls.capture += 1;
      if (store.captureMode === "decline") return json({ name: "UNPROCESSABLE_ENTITY", details: [{ issue: "INSTRUMENT_DECLINED" }] }, 422);
      if (store.captureMode === "network") return json({ name: "INTERNAL_SERVER_ERROR" }, 500);
      const value = store.captureMode === "mismatch" ? "1.00" : o.amount;
      o.capture = { id: "CAP" + rnd(10), status: "COMPLETED", amount: { currency_code: o.currency, value } };
      o.status = "COMPLETED";
      return json({ id: m[1], status: "COMPLETED", purchase_units: [{ payments: { captures: [o.capture] } }] }, 201);
    }
  }
  return json({ name: "NOT_FOUND" }, 404);
}

(globalThis as any).fetch = async (input: any, init: any = {}) => {
  const url = new URL(typeof input === "string" ? input : input.url);
  const method = (init.method || "GET").toUpperCase();
  if (url.host === "mock-supabase.test") return dbMock(url, method, init);
  if (url.host === "api-m.sandbox.paypal.com") return ppMock(url, method, init);
  return realFetch(input, init);
};

const names = ["paypal-config", "paypal-create-order", "paypal-capture-order", "paypal-invoice"];
for (const n of names) {
  (globalThis as any).__current = n;
  await import(`./functions/${n}/index.ts`);
}

realServe({ port: 8787, hostname: "127.0.0.1" }, async (req: Request) => {
  const url = new URL(req.url);
  if (url.pathname === "/__state") return json({ orders: store.orders, invoices: store.invoices, pp: store.ppCalls, lastCreatePayload: store.lastCreatePayload });
  if (url.pathname === "/__control") {
    const c = await req.json();
    Object.assign(store, c);
    return json({ ok: true });
  }
  const name = url.pathname.replace(/^\//, "");
  if (!handlers[name]) return json({ message: "no route" }, 404);
  return handlers[name](req);
});
