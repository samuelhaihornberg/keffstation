// Test local des paliers de lot (accessoires et gadgets). Catalogue synthétique, aucun réseau.
import { buildOrder, tauxPalierAccessoires } from '../../lib/payment-core.js';

const catalogue = { produits: [{
  id: 'test-acc', marque: 'KiffTech', modele: 'Test accessoire', rayon: 'accessoires-gadgets',
  prix: { montant: 10, devise: 'EUR' }, variantes: [], disponibilite: { statut: 'disponible' },
  stock: 999, livraison: { montant: 0 }, taxes: { montant: 0 },
  medias: { images: [{ licence: 'CC0', attribution: 'Test' }] },
}] };

let fails = 0;
const check = (name, ok, extra = '') => { console.log(`${ok ? 'PASS' : 'FAIL'} ${name} ${extra}`); if (!ok) fails++; };
const cas = [
  [1, 0, 10], [2, 0.15, 17], [4, 0.15, 34], [5, 0.20, 40], [9, 0.20, 72], [10, 0.25, 75], [12, 0.25, 90],
];
for (const [qte, taux, total] of cas) {
  const o = buildOrder(catalogue, [{ productId: 'test-acc', choiceIndices: [], quantity: qte }]);
  check(`palier ${qte} article(s) -> ${taux * 100}%`, o.ok && tauxPalierAccessoires(qte) === taux && o.totals.total === total, o.ok ? `total=${o.totals.total}` : o.error);
}
const mixte = buildOrder({ produits: [...catalogue.produits, { ...catalogue.produits[0], id: 'autre', rayon: 'smartphones' }] },
  [{ productId: 'test-acc', choiceIndices: [], quantity: 2 }, { productId: 'autre', choiceIndices: [], quantity: 3 }]);
check('palier calculé sur les seuls accessoires (2 accessoires + 3 autres -> 15% sur accessoires seulement)',
  mixte.ok && mixte.totals.subtotal === 17 + 30, mixte.ok ? `subtotal=${mixte.totals.subtotal}` : mixte.error);
console.log(fails ? `${fails} échec(s)` : 'Tous les paliers sont corrects');
process.exit(fails ? 1 : 0);
