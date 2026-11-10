// ============ KiffTech — Caisse admin : tableau des commandes payées ============
// Lit la même clé localStorage que le catalogue (app.v2.js) :
//   kifftech.commandes.payees.v1
(function(){
  const ORDERS_KEY='kifftech.commandes.payees.v1';
  const $=s=>document.querySelector(s);
  const $$=s=>Array.from(document.querySelectorAll(s));

  let commandes=[];

  function fmtPrice(n){
    return (Number(n||0)).toFixed(2).replace('.',',')+' €';
  }
  function fmtDate(iso){
    if(!iso)return '-';
    const d=new Date(iso);
    return d.toLocaleDateString('fr-FR')+' '+d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
  }
  function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

  function load(){
    try{
      const raw=localStorage.getItem(ORDERS_KEY);
      if(!raw){commandes=[];return true;}
      const arr=JSON.parse(raw);
      commandes=Array.isArray(arr)?arr:[];
      return true;
    }catch(e){
      console.warn('[Caisse admin] lecture impossible',e);
      commandes=[];
      return false;
    }
  }
  function save(){localStorage.setItem(ORDERS_KEY,JSON.stringify(commandes));}

  function render(){
    const tbody=$('#tbody');
    const empty=$('#empty');
    const tableau=$('#tableau');
    const stateErr=$('#state-err');
    const statNb=$('#stat-nb');
    const statTotal=$('#stat-total');
    const statArticles=$('#stat-articles');

    stateErr.style.display='none';

    const nb=commandes.length;
    const total=commandes.reduce((s,o)=>s+Number(o.total||0),0);
    const articles=commandes.reduce((s,o)=>s+Number(o.count||0),0);

    statNb.textContent=nb;
    statTotal.textContent=fmtPrice(total);
    statArticles.textContent=articles;

    if(nb===0){
      tableau.style.display='none';
      empty.style.display='block';
      return;
    }
    empty.style.display='none';
    tableau.style.display='table';

    tbody.innerHTML=commandes.map(o=>{
      const ref=esc(o.ref||'-');
      const date=fmtDate(o.date);
      const client=esc(o.name||'—');
      const email=esc(o.email||'—');
      const tel=esc(o.phone||'—');
      const mode=esc(o.mode||'—');
      const statut=esc(o.statut||'payee');
      const items=Array.isArray(o.items)?o.items:[];
      const apercu=items.map(it=>{
        const q=Number(it.qty||1);
        return `${esc(it.model||it.id)} ×${q}`;
      }).slice(0,3).join(' • ')+(items.length>3?' • …':'')||'Caisse vide';

      return `<tr>
        <td><span class="ref">${ref}</span></td>
        <td><span class="date">${date}</span></td>
        <td><span class="client">${client}</span></td>
        <td><span class="email">${email}</span></td>
        <td><span class="tel">${tel}</span></td>
        <td>
          <div class="caisse-lignes"><div class="line">${apercu}</div></div>
        </td>
        <td><span class="total">${fmtPrice(o.total||0)}</span></td>
        <td><span class="badge" style="color:#b9c0e6;border-color:rgba(185,192,230,.35)">${mode}</span></td>
        <td><span class="badge payee">${statut}</span></td>
        <td>
          <div class="actions">
            <button class="btn secondary" onclick="ouvrirDetail(${JSON.stringify(o).replace(/"/g,'&quot;')})" title="Voir le détail">📄 Détail</button>
            <button class="btn danger" style="padding:6px 8px" onclick="supprimerCommande('${esc(o.ref)}')" title="Supprimer">🗑️</button>
          </div>
        </td>
      </tr>`;
    }).join('');
  }

  window.supprimerCommande=function(ref){
    if(!confirm('Supprimer cette commande de l’historique ?'))return;
    commandes=commandes.filter(o=>o.ref!==ref);
    save();
    render();
    afficherToast('Commande supprimée');
  };
  window.ouvrirDetail=function(o){
    $('#modal-ref').textContent=o.ref||'-';
    $('#d-ref').textContent=o.ref||'-';
    $('#d-date').textContent=fmtDate(o.date);
    $('#d-client').textContent=o.name||'—';
    $('#d-email').textContent=o.email||'—';
    $('#d-tel').textContent=o.phone||'—';
    $('#d-mode').textContent=o.mode||'—';
    $('#d-statut').textContent=o.statut||'payee';
    $('#d-total').textContent=fmtPrice(o.total||0);

    const items=Array.isArray(o.items)?o.items:[];
    const tb=$('#d-items');
    if(items.length===0){
      tb.innerHTML='<tr><td colspan="4" style="color:#8a92b8">Aucun détail de caisse enregistré pour cette commande.</td></tr>';
    }else{
      tb.innerHTML=items.map(it=>{
        const q=Number(it.qty||1);
        const pu=Number(it.kifftech||0);
        return `<tr>
          <td><span style="color:#e8eef7">${esc(it.model||it.id)}</span><div style="font-size:.75rem;color:#8a92b8">${esc(it.brand||'')}${it.year?' · '+it.year:''}${it.category?' · '+it.category:''}</div></td>
          <td>${q}</td>
          <td>${fmtPrice(pu)}</td>
          <td>${fmtPrice(pu*q)}</td>
        </tr>`;
      }).join('');
    }
    $('#modal-detail').classList.add('visible');
  };
  window.fermerDetail=function(){
    $('#modal-detail').classList.remove('visible');
  };
  window.viderHistorique=function(){
    if(commandes.length===0){afficherToast('Rien à vider');return;}
    if(!confirm('Vider tout l’historique des commandes payées ? Cette action est irréversible.'))return;
    localStorage.removeItem(ORDERS_KEY);
    commandes=[];
    render();
    afficherToast('Historique vidé');
  };

  function afficherToast(msg,type='info'){
    const t=$('#toast');
    t.textContent=msg;
    t.style.display='block';
    if(type==='error'){
      t.style.borderLeftColor='#ff4d4d';
      t.style.background='#2a1a1a';
    }else{
      t.style.borderLeftColor='#27d17f';
      t.style.background='#111827';
    }
    setTimeout(()=>{t.style.display='none';},2500);
  }

  window.rechargerDonnees=function(){
    const ok=load();
    if(!ok){
      $('#state-err').style.display='block';
      $('#tableau').style.display='none';
      $('#empty').style.display='none';
      afficherToast('Échec de chargement des données','error');
      return;
    }
    $('#state-err').style.display='none';
    render();
    afficherToast('Données actualisées');
  };

  // fermeture du modal au clic hors carte
  $('#modal-detail').addEventListener('click',e=>{
    if(e.target===$('#modal-detail'))fermerDetail();
  });
  // touche Echap
  document.addEventListener('keydown',e=>{if(e.key==='Escape')fermerDetail();});

  const ok=load();
  if(!ok)$('#state-err').style.display='block';
  render();
})();
