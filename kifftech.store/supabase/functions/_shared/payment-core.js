// COPIE GÉNÉRÉE depuis lib/payment-core.js — ne pas éditer. Régénérer : npm run sync:supabase
// Shared payment/sellability logic (browser + server). No DOM, no secrets.
// Recalculates amounts from canonical catalogue data; never trust client totals.

function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function toDefinedMoney(value) {
  return typeof value === 'number' && Number.isFinite(value) ? roundMoney(value) : null;
}

function moneyOrNull(obj) {
  if (!obj || typeof obj !== 'object') return null;
  if (toDefinedMoney(obj.montant) !== null) return toDefinedMoney(obj.montant);
  // Ne pas inventer un montant à partir d'un taux/inclus sans base confirmée.
  return null;
}

export function selectedOptionForGroup(groupe, index) {
  const i = Number.isInteger(index) ? index : 0;
  return (groupe.options || [])[i] || (groupe.options || [])[0] || null;
}

export function resolveSelection(product, choiceIndices) {
  const choice = Array.isArray(choiceIndices) ? choiceIndices : [];
  const labels = [];
  let prix = product.prix && typeof product.prix.montant === 'number' ? roundMoney(product.prix.montant) : (typeof product.price === 'number' ? roundMoney(product.price) : null);
  let devise = (product.prix && product.prix.devise) || product.currency || null;
  let disponible = true;

  (product.variantes || []).forEach((groupe, g) => {
    const option = selectedOptionForGroup(groupe, choice[g] ?? 0);
    if (!option) return;
    labels.push(option.libelle);
    if (typeof option.prix === 'number' && Number.isFinite(option.prix)) prix = roundMoney(option.prix);
    else if (option.prix === null) prix = null;
    if (option.devise) devise = option.devise;
    if (option.dispo === false) disponible = false;
  });

  const dispoStatut = product.disponibilite && product.disponibilite.statut;
  if (dispoStatut && dispoStatut !== 'disponible') disponible = false;
  const stock = typeof product.stock === 'number' ? product.stock
    : (product.disponibilite && typeof product.disponibilite.stock === 'number' ? product.disponibilite.stock : null);
  if (stock !== null && stock <= 0) disponible = false;

  const shipping = moneyOrNull(product.livraison);
  const taxes = moneyOrNull(product.taxes);

  return {
    label: labels.filter(Boolean).join(' · '),
    prix,
    devise,
    disponible,
    shipping,
    taxes,
  };
}

export function checkSellability(product, selection) {
  const reasons = [];
  if (!product) reasons.push('Produit introuvable');
  if (!selection) reasons.push('Sélection invalide');
  if (selection && (selection.prix === null || selection.prix === undefined || !Number.isFinite(selection.prix))) reasons.push('Prix final à confirmer');
  if (selection && !selection.devise) reasons.push('Devise non définie');
  if (selection && !selection.disponible) reasons.push('Disponibilité/stock non confirmée');
  if (!selection || selection.shipping === null || selection.shipping === undefined) reasons.push('Livraison non définie');
  if (!selection || selection.taxes === null || selection.taxes === undefined) reasons.push('Taxes non définies');
  return { ok: reasons.length === 0, reasons };
}

export function formatSellabilityReason(reasons) {
  if (!reasons || !reasons.length) return 'Paiement indisponible.';
  return `Paiement indisponible : ${reasons.join(', ')}.`;
}

export function buildOrder(catalogue, items) {
  const rawItems = Array.isArray(items) ? items : [];
  if (rawItems.length === 0) return { ok: false, error: 'Caisse vide.' };

  const products = (catalogue && catalogue.produits) || [];
  const map = new Map(products.map(p => [p.id, p]));

  const lines = [];
  let currency = null;
  let subtotal = 0;
  let shippingTotal = 0;
  let taxesTotal = 0;

  for (const item of rawItems) {
    if (!item || typeof item.productId !== 'string') return { ok: false, error: 'Article invalide.' };
    const product = map.get(item.productId);
    if (!product) return { ok: false, error: 'Produit introuvable.' };
    const qty = Number.isInteger(item.quantity) ? item.quantity : parseInt(item.quantity, 10);
    if (!Number.isInteger(qty) || qty <= 0) return { ok: false, error: 'Quantité invalide.' };
    const stock = typeof product.stock === 'number' ? product.stock
      : (product.disponibilite && typeof product.disponibilite.stock === 'number' ? product.disponibilite.stock : null);
    const maxQty = (stock !== null && Number.isFinite(stock)) ? Math.min(999, Math.max(0, Math.floor(stock))) : 99;
    if (qty > maxQty) return { ok: false, error: `Quantité supérieure au stock disponible (${maxQty}).` };

    const selection = resolveSelection(product, item.choiceIndices || []);
    const sell = checkSellability(product, selection);
    if (!sell.ok) return { ok: false, error: `${product.marque} ${product.modele} : ${sell.reasons.join(', ')}.` };

    if (!currency) currency = selection.devise;
    if (selection.devise !== currency) return { ok: false, error: 'Devise unique requise pour le paiement.' };

    const lineSubtotal = roundMoney(selection.prix * qty);
    const lineShipping = roundMoney(selection.shipping * qty);
    const lineTaxes = roundMoney(selection.taxes * qty);
    subtotal = roundMoney(subtotal + lineSubtotal);
    shippingTotal = roundMoney(shippingTotal + lineShipping);
    taxesTotal = roundMoney(taxesTotal + lineTaxes);

    lines.push({
      id: product.id,
      title: `${product.marque} ${product.modele}`,
      variant: selection.label || null,
      quantity: qty,
      unitAmount: selection.prix,
      currency,
      lineSubtotal,
      lineShipping,
      lineTaxes,
    });
  }

  const total = roundMoney(subtotal + shippingTotal + taxesTotal);
  if (!currency) return { ok: false, error: 'Devise non définie.' };
  if (!(total > 0)) return { ok: false, error: 'Total final invalide.' };

  return {
    ok: true,
    currency,
    lines,
    totals: {
      subtotal,
      shipping: shippingTotal,
      taxes: taxesTotal,
      currency,
      total,
    },
    // compat héritée
    total,
  };
}

export function sellability(product, selection) {
  return checkSellability(product, selection || (product ? resolveSelection(product, []) : null));
}
