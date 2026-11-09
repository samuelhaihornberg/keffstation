
// ============ KiffStation Admin — Données réelles ============
const LEADS_KEY='kiffstation.leads.v1';
let leads=[];

const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));

function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function fmtDate(iso){if(!iso)return '-';const d=new Date(iso);return d.toLocaleDateString('fr-FR')+' '+d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});}

function loadLeads(){
  try{
    const raw=localStorage.getItem(LEADS_KEY);
    if(!raw){leads=[];return true;}
    const arr=JSON.parse(raw);
    leads=Array.isArray(arr)?arr:[];
    return true;
  }catch(e){console.warn('[Admin] lecture leads impossible',e);leads=[];return false;}
}
function saveLeads(){localStorage.setItem(LEADS_KEY,JSON.stringify(leads));}

function nouveauRef(){
  const d=new Date(),p=n=>String(n).padStart(2,'0');
  return 'LEAD-'+d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
}

function ajouterLead(e){
  e.preventDefault();
  const nom=$('#f-nom').value.trim();
  const email=$('#f-email').value.trim();
  const tel=$('#f-tel').value.trim();
  const source=$('#f-source').value;
  const statut=$('#f-statut').value;
  const notes=$('#f-notes').value.trim();
  if(!nom||!email||!tel){afficherToast('Remplissez nom, email et téléphone','error');return false;}
  const lead={ref:nouveauRef(),nom,email,tel,source,statut,notes,date:new Date().toISOString()};
  leads.unshift(lead);
  saveLeads();
  $('#lead-form').reset();
  render();
  afficherToast('Lead enregistré : '+lead.ref);
  return false;
}

function supprimerLead(ref){
  if(!confirm('Supprimer ce lead ?'))return;
  leads=leads.filter(l=>l.ref!==ref);
  saveLeads();
  render();
  afficherToast('Lead supprimé');
}

function effacerTous(){
  if(leads.length===0){afficherToast('Rien à effacer');return;}
  if(!confirm('Effacer tous les leads ? Irréversible.'))return;
  localStorage.removeItem(LEADS_KEY);
  leads=[];
  render();
  afficherToast('Tous les leads effacés');
}

function render(){
  const tbody=$('#tbody-leads');
  const empty=$('#empty-leads');
  const tableau=$('#table-leads');
  const statNb=$('#stat-nb');
  const statNouveau=$('#stat-nouveau');
  const statPerdu=$('#stat-perdu');
  const statConverti=$('#stat-converti');

  const nb=leads.length;
  const nouveau=leads.filter(l=>l.statut==='nouveau').length;
  const perdu=leads.filter(l=>l.statut==='perdu').length;
  const converti=leads.filter(l=>l.statut==='converti').length;
  const taux=nb?Math.round(converti/nb*100):0;

  statNb.textContent=nb;
  statNouveau.textContent=nouveau;
  statPerdu.textContent=perdu;
  statConverti.textContent=taux+' %';

  if(nb===0){
    tableau.style.display='none';
    empty.style.display='block';
  }else{
    empty.style.display='none';
    tableau.style.display='table';
    tbody.innerHTML=leads.map(l=>{
      const badgeClass={'nouveau':'badge nouveau','contacte':'badge contacte','converti':'badge converti','perdu':'badge perdu'}[l.statut]||'badge';
      return `<tr>
        <td data-i18n="kiffstationadmin_index_legacy_esclref_9"><span class="lead-ref" data-i18n="./kiffstationadmin/index-legacy.html_esclref_12">${esc(l.ref)}</span></td>
        <td data-i18n="kiffstationadmin_index_legacy_esclnomlnotesesclnotes_8"><span style="color:var(--text)" data-i18n="./kiffstationadmin/index-legacy.html_esclnom_13">${esc(l.nom)}</span>${l.notes?'<div style="font-size:.72rem;color:var(--muted);margin-top:2px" data-i18n="./kiffstationadmin/index-legacy.html_esclnotes_47">'+esc(l.notes)+'</div>':''}</td>
        <td data-i18n="kiffstationadmin_index_legacy_esclemail_7"><a href="mailto:${esc(l.email)}" style="color:var(--muted)" data-i18n="./kiffstationadmin/index-legacy.html_esclemail_10">${esc(l.email)}</a></td>
        <td data-i18n="kiffstationadmin_index_legacy_escltel_6"><a href="tel:${esc(l.tel)}" style="color:var(--muted)" data-i18n="./kiffstationadmin/index-legacy.html_escltel_11">${esc(l.tel)}</a></td>
        <td data-i18n="kiffstationadmin_index_legacy_esclsource_5"><span style="color:var(--muted);font-size:.8rem" data-i18n="./kiffstationadmin/index-legacy.html_esclsource_14">${esc(l.source)}</span></td>
        <td data-i18n="kiffstationadmin_index_legacy_esclstatut_4"><span class="${badgeClass}" data-i18n="./kiffstationadmin/index-legacy.html_esclstatut_15">${esc(l.statut)}</span></td>
        <td data-i18n="kiffstationadmin_index_legacy_fmtdateldate_3"><span class="date" data-i18n="./kiffstationadmin/index-legacy.html_fmtdateldate_16">${fmtDate(l.date)}</span></td>
        <td><button class="btn danger" style="padding:4px 8px;font-size:.75rem" onclick="supprimerLead('${esc(l.ref)}')">🗑️</button></td>
      </tr>`;
    }).join('');
  }
  majBoutonCSV();
  dessinerMontagne3D();
}

function majBoutonCSV(){
  const btn=$('#btn-csv');
  if(leads.length===0){btn.style.display='none';return;}
  btn.style.display='inline-flex';
  const csv=['ref,nom,email,tel,source,statut,notes,date'].concat(leads.map(l=>[
    l.ref,l.nom,l.email,l.tel,l.source,l.statut,l.notes,l.date
  ].map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(','))).join('\n');
  btn.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);
}

function exporterCSV(){
  if(leads.length===0){afficherToast('Aucun lead à exporter','error');return;}
  $('#btn-csv').click();
  afficherToast('Export CSV lancé');
}

function afficherToast(msg,type='info'){
  const t=$('#toast');
  t.textContent=msg;
  t.style.display='block';
  if(type==='error'){t.style.borderLeftColor=varDanger();t.style.background='#2a1a1a';}
  else{t.style.borderLeftColor='#27d17f';t.style.background='#111827';}
  setTimeout(()=>t.style.display='none',2500);
}
function varDanger(){return '#ff4d4d';}

// ============ Graphique montagne 3D (Three.js) ============
let scene3d,camera3d,renderer3d,mesh3d,particles3d;
function dessinerMontagne3D(){
  const wrap=$('.chart-wrap');
  const canvas=$('#canvas3d');
  if(!wrap||!canvas)return;
  if(!scene3d){
    scene3d=new THREE.Scene();
    scene3d.fog=new THREE.FogExp2(0x070816,0.012);
    camera3d=new THREE.PerspectiveCamera(55,wrap.clientWidth/wrap.clientHeight,0.1,100);
    camera3d.position.set(8,6,10);
    renderer3d=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true});
    renderer3d.setSize(wrap.clientWidth,wrap.clientHeight);
    renderer3d.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    const light=new THREE.DirectionalLight(0xffffff,0.8);light.position.set(5,10,5);scene3d.add(light);
    const light2=new THREE.AmbientLight(0x222244,0.5);scene3d.add(light2);
    // grille au sol
    const grid=new THREE.GridHelper(40,40,0x1a1d3a,0x0f1226);scene3d.add(grid);
  }
  // supprimer ancien relief
  if(mesh3d){scene3d.remove(mesh3d);mesh3d.geometry.dispose();mesh3d.material.dispose();}
  if(particles3d){scene3d.remove(particles3d);particles3d.geometry.dispose();particles3d.material.dispose();}

  const size=41;
  const data=new Float32Array(size*size);
  const cx=size/2,cy=size/2;
  // générer relief à partir des leads : plus de leads = plus de pics
  const seed=leads.length;
  for(let i=0;i<size;i++){
    for(let j=0;j<size;j++){
      let h=0;
      // bruit simple de montagne
      const x=(i-cx)/6,y=(j-cy)/6;
      h+=Math.sin(x)*Math.cos(y)*1.2;
      h+=Math.sin(x*3+y*2)*0.6;
      h+=Math.sin(x*7)*Math.cos(y*5)*0.4;
      // pics liés aux leads
      for(let k=0;k<Math.min(seed,12);k++){
        const px=(Math.sin(k*2.3)*5)+cx,py=(Math.cos(k*1.7)*5)+cy;
        const d=Math.sqrt((i-px)*(i-px)+(j-py)*(j-py));
        h+=Math.exp(-d*d/8)*2.2;
      }
      data[i*size+j]=Math.max(0,h);
    }
  }
  const geometry=new THREE.PlaneGeometry(40,40,size-1,size-1);
  geometry.rotateX(-Math.PI/2);
  const pos=geometry.attributes.position;
  for(let i=0;i<size;i++){
    for(let j=0;j<size;j++){
      const idx=i*size+j;
      pos.setY(idx,data[idx]*1.4);
    }
  }
  pos.needsUpdate=true;
  geometry.computeVertexNormals();
  const material=new THREE.MeshStandardMaterial({color:0x1a1d3a,emissive:0x27d17f,emissiveIntensity:0.3,flatShading:true,side:THREE.DoubleSide,wireframe:false});
  mesh3d=new THREE.Mesh(geometry,material);
  scene3d.add(mesh3d);

  // nuage de points au-dessus des pics
  const pts=[];
  for(let i=0;i<size;i++){
    for(let j=0;j<size;j++){
      const h=data[i*size+j];
      if(h>1.2){
        pts.push((i-cx)/size*40-20, h*1.4+1, (j-cy)/size*40-20);
      }
    }
  }
  const ptsGeo=new THREE.BufferGeometry();
  ptsGeo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
  const ptsMat=new THREE.PointsMaterial({color:0x6366f1,size:0.12,transparent:true,opacity:0.8});
  particles3d=new THREE.Points(ptsGeo,ptsMat);
  scene3d.add(particles3d);

  animer3D();
}
function animer3D(){
  if(!scene3d)return;
  const t=Date.now()*0.001;
  if(mesh3d){
    mesh3d.rotation.z=Math.sin(t*0.2)*0.02;
    mesh3d.material.emissiveIntensity=0.3+Math.sin(t)*0.15;
  }
  camera3d.lookAt(0,0,0);
  renderer3d.render(scene3d,camera3d);
  requestAnimationFrame(animer3D);
}
window.addEventListener('resize',()=>{
  const wrap=$('.chart-wrap');
  if(!renderer3d||!wrap)return;
  camera3d.aspect=wrap.clientWidth/wrap.clientHeight;
  camera3d.updateProjectionMatrix();
  renderer3d.setSize(wrap.clientWidth,wrap.clientHeight);
});

// ============ Initialisation ============
const ok=loadLeads();
if(!ok){
  const err=document.createElement('div');
  err.style.cssText='padding:16px;background:rgba(255,77,77,.1);border:1px solid rgba(255,77,77,.25);color:#ff6b6b;border-radius:8px;margin-top:12px;text-align:center';
  err.innerHTML='<b>⚠ Échec de chargement des données (localStorage indisponible).</b>';
  document.querySelector('.container').appendChild(err);
}
render();
