// Shared payment/sellability logic (browser + server). No DOM, no secrets.
// Recalculates amounts from canonical catalogue data; never trust client totals.

export function selectedOptionForGroup(groupe, index) {
  const i = Number.isInteger(index) ? index : 0;
  return (groupe.options || [])[i] || (groupe.options || [])[0] || null;
}

export function resolveSelection(product, choiceIndices) {
  const choice = Array.isArray(choiceIndices) ? choiceIndices : [];
  const labels = [];
  let prix = product.prix && typeof product.prix.montant === 'number' ? product.prix.montant : (product.price ?? null);
  let devise = (product.prix && product.prix.devise) || product.currency || 'EUR';
  let disponible = true;

  (product.variantes || []).forEach((groupe, g) => {
    const option = selectedOptionForGroup(groupe, choice[g] ?? 0);
    if (!option) return;
    labels.push(option.libelle);
    if (typeof option.prix === 'number') prix = option.prix;
    else if (option.prix === null) prix = null;
    if (option.dispo === false) disponible = false;
  });

  const dispoStatut = product.disponibilite && product.disponibilite.statut;
  if (dispoStatut && dispoStatut !== 'disponible') disponible = false;

  return {
    label: labels.filter(Boolean).join(' · '),
    prix,
    devise,
    disponible,
  };
}

export function sellability(product, selection) {
  const reasons = [];
  const sel = selection || resolveSelection(product, []);
  if (sel.prix === null || sel.prix === undefined || Number.isNaN(Number(sel.prix))) {
    reasons.push('Prix final à confirmer');
  }
  if (!sel.disponible) {
    reasons.push('Stock/disponibilité à confirmer ou indisponible');
  }
  if (!sel.devise) {
    reasons.push('Devise non définie');
  }
  if (!product.livraison || product.livraison.montant === undefined || product.livraison.montant === null) {
    reasons.push('Livraison non définie');
  }
  if (!product.taxes || (product.taxes.montant === undefined && product.taxes.inclus === undefined && product.taxes.taux === undefined)) {
    reasons.push('Taxes non définies');
  }
  if (reasons.length === 0) {
    if (!(Number(sel.prix) > 0)) reasons.push('Prix final invalide');
  }
  return { ok: reasons.length === 0, reasons };
}

export function formatSellabilityReason(reasons) {
  if (!reasons || !reasons.length) return '';
  return `Paiement indisponible : ${reasons.join(', ')}.`;
}

export function moneyToCents(amount) {
  return Math.round(Number(amount) * 100);
}

export function centsToMoney(cents) {
  return Math.round(Number(cents)) / 100;
}

export function buildOrder(catalogue, items) {
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, error: 'Panier vide.' };
  }
  const products = Array.isArray(catalogue && catalogue.produits) ? catalogue.produits : [];
  const byId = new Map(products.map(p => [p.id, p]));

  const lines = [];
  const devises = new Set();
  let totalCents = 0;

  for (const raw of items) {
    const productId = raw && raw.productId;
    const quantity = Math.max(1, Math.min(99, parseInt(raw && raw.quantity, 10) || 0));
    const choiceIndices = Array.isArray(raw && raw.choiceIndices) ? raw.choiceIndices.map(n => parseInt(n, 10) || 0) : [];
    if (!productId || !byId.has(productId)) {
      return { ok: false, error: `Produit introuvable: ${productId || 'inconnu'}` };
    }
    if (!quantity || quantity < 1) {
      return { ok: false, error: `Quantité invalide pour ${productId}` };
    }
    const product = byId.get(productId);
    const sel = resolveSelection(product, choiceIndices);
    const sell = sellability(product, sel);
    if (!sell.ok) {
      return { ok: false, error: `${product.modele || productId}: ${sell.reasons.join(', ')}` };
    }
    const unitCents = moneyToCents(sel.prix);
    const lineCents = unitCents * quantity;
    totalCents += lineCents;
    devises.add(sel.devise);
    lines.push({
      productId,
      title: `${product.marque || ''} ${product.modele || ''}`.trim() || productId,
      variant: sel.label || null,
      quantity,
      unitAmount: centsToMoney(unitCents),
      currency: sel.devise,
    });
  }

  if (devises.size !== 1) {
    return { ok: false, error: 'Paiement impossible : le panier contient plusieurs devises. Réglez les articles séparément par devise.' };
  }

  const currency = [...devises][0];
  return {
    ok: true,
    currency,
    total: centsToMoney(totalCents),
    totalCents,
    lines,
  };
}
