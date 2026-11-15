const B = "http://127.0.0.1:8787";
const O = 'https://www.kiffstation.com';
const results = [];
const check = (name, ok, extra = '') => { results.push([ok, name, extra]); console.log(`${ok ? 'PASS' : 'FAIL'} ${name} ${extra}`); };
const post = (fn, body, origin = O) => fetch(`${B}/${fn}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify(body) });
const ctl = (c) => fetch(`${B}/__control`, { method: 'POST', body: JSON.stringify(c) });
const state = async () => (await fetch(`${B}/__state`)).json();
const cart = [{ productId: 'apple-iphone-17e', choiceIndices: [], quantity: 2 }];
const goodCreate = (extra = {}) => ({ items: cart, acceptTerms: true, termsVersion: 'TEST-v1', requestId: 'req-' + Math.random().toString(36).slice(2, 12), ...extra });

// 1. Config publique sans secret
let r = await fetch(`${B}/paypal-config`, { headers: { Origin: O } });
let t = await r.text();
check('config 200 pour origine exacte', r.status === 200);
check('config ne contient aucun secret', !t.includes('TEST_SECRET_VALUE') && !/secret/i.test(t), t.slice(0, 120));
check('config renvoie environnement sandbox (test)', t.includes('"environment":"sandbox"'));
check('CORS origine exacte', r.headers.get('access-control-allow-origin') === O);

r = await fetch(`${B}/paypal-config`, { headers: { Origin: 'https://evil.example' } });
check('config refuse origine étrangère (403)', r.status === 403);
r = await fetch(`${B}/paypal-config`, { headers: { Origin: 'https://evil.example' } });
r = await fetch(`${B}/paypal-config`, { method: 'OPTIONS', headers: { Origin: O } });
check('preflight OPTIONS 204 pour origine exacte', r.status === 204 && r.headers.get('access-control-allow-origin') === O);

// 2. Acceptation des conditions
r = await post('paypal-create-order', goodCreate({ acceptTerms: false }));
check('création refusée sans acceptation (400)', r.status === 400, String(r.status));
r = await post('paypal-create-order', goodCreate({ acceptTerms: undefined }));
check('création refusée si acceptation absente (400)', r.status === 400);
r = await post('paypal-create-order', goodCreate({ termsVersion: 'OLD' }));
check('création refusée si version des conditions obsolète (409)', r.status === 409);
r = await post('paypal-create-order', goodCreate(), 'https://evil.example');
check('création refusée origine étrangère (403)', r.status === 403);

// 3. Recalcul serveur : le client envoie des faux prix/totaux, ignorés
const forged = goodCreate({ total: 1, price: 1, subtotal: 1, amount: '0.01' });
forged.items = [{ productId: 'apple-iphone-17e', choiceIndices: [], quantity: 2, prix: 1, price: 1 }];
r = await post('paypal-create-order', forged);
let c = await r.json();
check('création 200 avec montants forgés ignorés', r.status === 200 && c.ok, JSON.stringify(c).slice(0, 160));
check('total recalculé serveur = 1438.00 EUR', c.totals && c.totals.total === 1438 && c.totals.currency === 'EUR');
let st = await state();
check('payload PayPal contient 1438.00 (pas 0.01)', st.lastCreatePayload.purchase_units[0].amount.value === '1438.00');
check('payload PayPal: livraison 0.00 et taxes 0.00 justifiées', st.lastCreatePayload.purchase_units[0].amount.breakdown.shipping.value === '0.00' && st.lastCreatePayload.purchase_units[0].amount.breakdown.tax_total.value === '0.00');
check('PayPal-Request-Id/intent CAPTURE', st.lastCreatePayload.intent === 'CAPTURE');
const orderRow = st.orders.find((o) => o.paypal_order_id === c.id);
check('commande enregistrée avec version, URL et date d’acceptation', orderRow && orderRow.terms_version === 'TEST-v1' && orderRow.terms_url.startsWith('https://') && !!orderRow.terms_accepted_at);
check('jeton non stocké en clair (hash seulement)', orderRow && orderRow.token_hash.length === 64 && !JSON.stringify(orderRow).includes(c.orderToken));
const token = c.orderToken; const ppId = c.id;

// 4. Capture : jeton
r = await post('paypal-capture-order', { orderID: ppId, orderToken: 'x'.repeat(30) });
check('capture refusée avec mauvais jeton (403)', r.status === 403);
r = await post('paypal-capture-order', { orderID: 'UNKNOWN123456' , orderToken: token });
check('capture commande inconnue (404)', r.status === 404);
r = await post('paypal-capture-order', { orderID: ppId, orderToken: token }, 'https://evil.example');
check('capture origine étrangère (403)', r.status === 403);

// 5. Capture non approuvée
await ctl({ nextPpStatus: 'CREATED' });
r = await post('paypal-create-order', goodCreate());
const notApproved = await r.json();
r = await post('paypal-capture-order', { orderID: notApproved.id, orderToken: notApproved.orderToken });
check('capture refusée si PayPal non approuvé (400)', r.status === 400, String((await r.json()).code));
await ctl({ nextPpStatus: 'APPROVED' });

// 6. Refus carte
await ctl({ captureMode: 'decline' });
r = await post('paypal-capture-order', { orderID: ppId, orderToken: token });
let j = await r.json();
check('refus carte -> code declined (402), pas de paiement', r.status === 402 && j.code === 'declined', JSON.stringify(j));
st = await state();
check('après refus commande remise à created (pas payée)', st.orders.find((o) => o.paypal_order_id === ppId).status === 'created');

// 7. Erreur réseau PayPal pendant capture -> pas de payé, réessai possible
await ctl({ captureMode: 'network' });
r = await post('paypal-capture-order', { orderID: ppId, orderToken: token });
check('erreur PayPal 5xx -> 502, non payée', r.status === 502, String(r.status));
st = await state();
check('après erreur 5xx commande non marquée payée', st.orders.find((o) => o.paypal_order_id === ppId).status === 'created');

// 8. Montant incorrect côté PayPal -> failed, pas payé
await ctl({ captureMode: 'mismatch' });
r = await post('paypal-capture-order', { orderID: ppId, orderToken: token });
j = await r.json();
st = await state();
check('montant différent -> 409 amount_mismatch', r.status === 409 && j.code === 'amount_mismatch', JSON.stringify(j));
check('montant différent -> commande failed, aucune facture', st.orders.find((o) => o.paypal_order_id === ppId).status === 'failed' && !st.invoices.some((i) => i.order_id === st.orders.find((o) => o.paypal_order_id === ppId).id));

// 9. Capture réussie -> facture
await ctl({ captureMode: 'ok' });
const ppIdOk = (await (await post('paypal-create-order', goodCreate())).json());
r = await post('paypal-capture-order', { orderID: ppIdOk.id, orderToken: ppIdOk.orderToken });
j = await r.json();
check('capture réussie 200 COMPLETED', r.status === 200 && j.status === 'COMPLETED', JSON.stringify(j).slice(0, 160));
check('facture avec numéro unique et montant payé 1438', j.invoice && /^KT-\d{4}-\d{6}$/.test(j.invoice.number) && j.invoice.totalPaid === 1438 && j.invoice.currency === 'EUR');
check('facture indique légalement incomplète (pas de faux document conforme)', j.invoice && j.invoice.legalComplete === false);

// 10. Double capture / double clic : pas de 2e capture
const before = (await state()).pp.capture;
r = await post('paypal-capture-order', { orderID: ppIdOk.id, orderToken: ppIdOk.orderToken });
j = await r.json();
check('2e capture = alreadyCaptured, sans nouvel appel PayPal capture', r.status === 200 && j.alreadyCaptured === true && (await state()).pp.capture === before);
st = await state();
check('une seule facture pour cette commande', st.invoices.filter((i) => i.order_id === st.orders.find((o) => o.paypal_order_id === ppIdOk.id).id).length === 1);

// 11. Limitation de débit
const rate = await (async () => { await ctl({ rate: false }); const x = await post('paypal-create-order', goodCreate()); await ctl({ rate: true }); return x; })();
check('limitation de débit -> 429', rate.status === 429);

// 12. Config sans secret et erreurs propres (requête invalide)
r = await post('paypal-create-order', { items: [] , acceptTerms: true, termsVersion: 'TEST-v1' });
check('panier vide refusé (400)', r.status === 400);
r = await fetch(`${B}/paypal-create-order`, { method: 'POST', headers: { Origin: O, 'Content-Type': 'application/json' }, body: '{not json' });
check('JSON invalide -> 400 propre', r.status === 400);

const failed = results.filter((x) => !x[0]).length;
console.log(`\n${results.length - failed}/${results.length} OK`);
process.exit(failed ? 1 : 0);
