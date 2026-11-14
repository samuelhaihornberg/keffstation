/* ===== KiffTech — bilan des ventes & bénéfices =====
   Clients et ventes fictifs. Totaux calculés en centimes à partir des achats. */
(() => {
  'use strict';

  const ARTICLES = [
    { id: 'ecouteurs', nom: 'Écouteurs sans fil ANC', categorie: 'Gadgets', prix: 129 },
    { id: 'chargeur', nom: 'Chargeur USB-C GaN 65 W', categorie: 'Chargeurs', prix: 49 },
    { id: 'powerbank', nom: 'Power bank 20 000 mAh', categorie: 'Chargeurs', prix: 119 },
    { id: 'souris', nom: 'Souris sans fil ergonomique', categorie: 'Accessoires', prix: 89 },
    { id: 'support', nom: 'Support magnétique voiture', categorie: 'Accessoires', prix: 39 },
    { id: 'cable', nom: 'Câble USB-C tressé 2 m', categorie: 'Accessoires', prix: 31 }
  ];

  const CLIENTS = [
    { nom: 'Client 1', achats: { ecouteurs: 1 } },
    { nom: 'Client 2', achats: { chargeur: 1, support: 1 } },
    { nom: 'Client 3', achats: { powerbank: 1, cable: 1 } },
    { nom: 'Client 4', achats: { ecouteurs: 1, chargeur: 1, support: 1 } },
    { nom: 'Client 5', achats: { chargeur: 1, support: 1, cable: 1 } },
    { nom: 'Client 6', achats: { powerbank: 1, support: 1 } },
    { nom: 'Client 7', achats: { souris: 1 } },
    { nom: 'Client 8', achats: { cable: 2 } }
  ];

  const COMMISSIONS = [
    { libelle: 'KeffStation', montant: 0.30 },
    { libelle: 'kifftech.store', montant: 0.20 }
  ];

  const cent = (valeur) => Math.round(valeur * 100);
  const formatNombre = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatMontant = (centimes) => formatNombre.format(centimes / 100) + '\u00a0€';
  const byId = (id) => document.getElementById(id);

  const lignesClients = CLIENTS.map((client) => {
    const lignes = Object.entries(client.achats).map(([id, qte]) => {
      const article = ARTICLES.find((a) => a.id === id);
      return { article, qte, centimes: qte * cent(article.prix) };
    });
    return { nom: client.nom, lignes, total: lignes.reduce((s, l) => s + l.centimes, 0) };
  });

  const totalVentes = lignesClients.reduce((s, c) => s + c.total, 0);
  const totalBenefices = COMMISSIONS.reduce((s, c) => s + cent(c.montant), 0);
  const articlesVendus = lignesClients.reduce((s, c) => s + c.lignes.reduce((t, l) => t + l.qte, 0), 0);

  const produitsVendus = ARTICLES.map((article) => {
    const achats = lignesClients.flatMap((c) => c.lignes.filter((l) => l.article === article));
    return {
      ...article,
      qte: achats.reduce((s, l) => s + l.qte, 0),
      clients: achats.length,
      centimes: achats.reduce((s, l) => s + l.centimes, 0)
    };
  });

  function tirer(n) {
    const pioche = produitsVendus.slice();
    for (let i = pioche.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pioche[i], pioche[j]] = [pioche[j], pioche[i]];
    }
    return pioche.slice(0, n);
  }

  function rendreKpis() {
    const commissions = COMMISSIONS.map((c) => c.libelle + ' ' + formatMontant(cent(c.montant))).join(' · ');
    byId('bilanKpis').innerHTML = `
      <div class="bilan-kpi">
        <span class="bilan-kpi-label">Total des ventes</span>
        <strong class="bilan-kpi-val">${formatMontant(totalVentes)}</strong>
      </div>
      <div class="bilan-kpi">
        <span class="bilan-kpi-label">Bénéfices</span>
        <strong class="bilan-kpi-val">${formatMontant(totalBenefices)}</strong>
        <span class="bilan-kpi-sub">${commissions}</span>
      </div>
      <div class="bilan-kpi bilan-kpi-total">
        <span class="bilan-kpi-label">Total</span>
        <strong class="bilan-kpi-val">${formatMontant(totalVentes + totalBenefices)}</strong>
      </div>
      <div class="bilan-kpi">
        <span class="bilan-kpi-label">Clients</span>
        <strong class="bilan-kpi-val">${CLIENTS.length}</strong>
        <span class="bilan-kpi-sub">${articlesVendus} articles vendus</span>
      </div>`;
  }

  function rendreTirage() {
    byId('bilanTirage').innerHTML = tirer(3).map((p) => `
      <article class="bilan-tile">
        <span class="bilan-cat">${p.categorie}</span>
        <h4 class="bilan-nom">${p.nom}</h4>
        <p class="bilan-meta">${p.qte} vendu${p.qte > 1 ? 's' : ''} · ${p.clients} client${p.clients > 1 ? 's' : ''}</p>
        <p class="bilan-montant">${formatMontant(p.centimes)}</p>
      </article>`).join('');
  }

  function rendreClients() {
    byId('bilanClients').innerHTML = lignesClients.map((c) => `
      <tr>
        <th scope="row">${c.nom}</th>
        <td>${c.lignes.map((l) => `${l.article.nom} ×${l.qte}`).join(', ')}</td>
        <td class="bilan-num">${formatMontant(c.total)}</td>
      </tr>`).join('');
    byId('bilanTotal').innerHTML = `
      <tr>
        <th scope="row">Total des ventes</th>
        <td>${articlesVendus} articles</td>
        <td class="bilan-num">${formatMontant(totalVentes)}</td>
      </tr>`;
  }

  function init() {
    rendreKpis();
    rendreTirage();
    rendreClients();
    byId('bilanTirageBtn').addEventListener('click', rendreTirage);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
