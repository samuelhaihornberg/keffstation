
var q=(new URLSearchParams(location.search).get('bot')||'').toLowerCase();
var botMemorise='';try{botMemorise=localStorage.getItem('via-bot')||'';}catch(e){}
var body=document.body,thread=document.getElementById('thread');
function setMode(m){body.dataset.mode=m;document.getElementById('bFull').setAttribute('aria-pressed',m==='fullscreen');document.getElementById('bSide').setAttribute('aria-pressed',m==='side');try{localStorage.setItem('msn-mode',m);}catch(e){}}
function setMin(v){body.dataset.min=v?'1':'0';document.getElementById('bMin').setAttribute('aria-pressed',!!v);if(!v)document.getElementById('input').focus();}
document.getElementById('bFull').onclick=function(){setMin(false);setMode('fullscreen');};
document.getElementById('bSide').onclick=function(){setMin(false);setMode('side');};
document.getElementById('bMin').onclick=function(){setMin(body.dataset.min!=='1');};
document.getElementById('wMin').onclick=function(){setMin(true);};
document.getElementById('wFull').onclick=function(){setMin(false);setMode(body.dataset.mode==='fullscreen'?'side':'fullscreen');};
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&body.dataset.min!=='1')setMin(true);});
try{var sm=localStorage.getItem('msn-mode');if(sm==='side'||sm==='fullscreen')setMode(sm);}catch(e){}
fetch('./bots.json').then(function(r){return r.json();}).then(function(cfg){
function botParId(id){for(var i=0;i<cfg.bots.length;i++)if(cfg.bots[i].id===id)return cfg.bots[i];return null;}
var b=botParId(q)||botParId(botMemorise)||botParId('via')||cfg.bots[0];
q=b.id;
botsById={};cfg.bots.forEach(function(x){botsById[x.id]=x;});
selectedBots=[b.id];
document.getElementById('title').textContent=b.avatar+' '+b.name+' — '+b.specialty;
document.getElementById('avatar').textContent=b.avatar;
document.getElementById('who').textContent=b.name;
function add(who,text,botObj,moteur){var d=document.createElement('div');d.className='msg '+who;var s=document.createElement('span');s.className='meta';s.textContent=who==='me'?'Moi':(botObj?botObj.name+' ('+(moteur||'moteur local')+')':b.name+' (simulé)');if(who==='sys')s.textContent='ℹ️ info';d.appendChild(s);d.appendChild(document.createTextNode(text));thread.appendChild(d);thread.scrollTop=thread.scrollHeight;return d;}
function addWait(bot){var d=document.createElement('div');d.className='msg bot';d.textContent=bot.name+' écrit… ';var c=document.createElement('span');c.className='blink';c.textContent='▊';c.setAttribute('aria-hidden','true');d.appendChild(c);thread.appendChild(d);thread.scrollTop=thread.scrollHeight;return d;}
function addStream(bot){var d=document.createElement('div');d.className='msg bot';var s=document.createElement('span');s.className='meta';s.textContent=bot.name+' (moteur local)';d.appendChild(s);var body=document.createElement('span');d.appendChild(body);thread.appendChild(d);thread.scrollTop=thread.scrollHeight;return{box:d,body:body};}
// Ajoute un message système sauf s'il est identique au dernier (pas de répétitions).
function addOnce(kind,text){try{var ms=thread.querySelectorAll('.msg');if(ms.length&&ms[ms.length-1].textContent.indexOf(text)!==-1)return;}catch(e){}add(kind,text);}
function pulseOn(){try{return localStorage.getItem('via-pulse')!=='off';}catch(e){return true;}}
function reduceMotion(){try{return window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}}
// Pulsation : affiche la réponse mot à mot (le bot respire). Réponses courtes =
// vrombissement (tout d'un coup). Motion réduite ou pulsation coupée = tout d'un coup.
function addPulsed(bot,text,moteur){
  var d=document.createElement('div');d.className='msg bot';var s=document.createElement('span');s.className='meta';s.textContent=bot.name+' ('+(moteur||'moteur local')+')';d.appendChild(s);
  var body=document.createElement('span');d.appendChild(body);thread.appendChild(d);thread.scrollTop=thread.scrollHeight;
  var words=String(text).split(/(\s+)/);
  if(!pulseOn()||reduceMotion()||words.length<40){body.textContent=text;return d;}
  var i=0,cur='';
  var t=setInterval(function(){
    cur+=words[i++]||'';body.textContent=cur;thread.scrollTop=thread.scrollHeight;
    if(i>=words.length){clearInterval(t);}
  },120);
  return d;
}
var eng=ViaProviders.load();
// --- Mode de conversation et configuration en ligne (mémoire séparée) ---
// Le mode retenu ne modifie ni les conversations, ni les BLM, ni les accords.
// La configuration en ligne est conservée à part : repasser en local ne
// l'efface pas, et le mode local ne l'utilise jamais par surprise.
var MODE_KEY='via-mode',ONLINE_KEY='via-online';
function lireMode(){try{var m=localStorage.getItem(MODE_KEY);if(m==='local'||m==='hybride'||m==='online')return m;}catch(e){}return 'local';}
function memoriserMode(m){try{localStorage.setItem(MODE_KEY,m);}catch(e){}}
function cfgEnLigne(){try{var c=JSON.parse(localStorage.getItem(ONLINE_KEY)||'null');if(c&&(c.provider==='ollama'||c.provider==='custom'))return {provider:c.provider,baseUrl:String(c.baseUrl||''),model:String(c.model||'')};}catch(e){}return null;}
function memoriserEnLigne(c){try{if(c&&(c.provider==='ollama'||c.provider==='custom'))localStorage.setItem(ONLINE_KEY,JSON.stringify({provider:c.provider,baseUrl:String(c.baseUrl||''),model:String(c.model||'')}));}catch(e){}}
function cfgKey(c){return String((c&&c.provider)||'')+'|'+String((c&&c.baseUrl)||'')+'|'+String((c&&c.model)||'');}
function moteurVerifie(c){try{return !!(window.__viaLLMVerifie&&window.__viaLLMVerifieKey===cfgKey(c));}catch(e){return false;}}
function moteurVraimentPret(st){
  if(st!=='ready')return st;
  if(!eng)return 'idle';
  if(eng.provider==='local'){
    var ph='';try{ph=ViaLocalEngine.summary().phase;}catch(e){}
    return (ph==='ready'||ph==='generating')?'ready':'idle';
  }
  if(eng.provider==='ollama'||eng.provider==='custom'){
    if(!String(eng.baseUrl||'').trim())return 'idle';
    return (moteurVerifie(eng)&&llmStatus&&llmStatus.state==='ok')?'ready':'idle';
  }
  return 'idle';
}
function majBlmUsed(){
  var el=document.getElementById('blmUsed');if(!el)return;
  var t='BLM : '+etiquetteBLM();
  try{if(blmStatus&&blmStatus.refuses&&blmStatus.refuses.length)t+=' — refusé(s) : '+blmStatus.refuses.join(', ');else if(blmStatus&&blmStatus.state==='error'&&blmStatus.message)t+=' — '+blmStatus.message;}catch(e){}
  el.textContent=t;
}
function afficherMoteurUtilise(extra){
  try{
    var el=document.getElementById('engineUsed');
    if(el){var er=etatMoteurReel();var t='Moteur utilisé : '+(er.label||'—')+' — '+(er.etat||'?');if(extra)t+=' ('+extra+')';el.textContent=t;}
  }catch(e){}
  majBlmUsed();
}
function appliquerMode(mode,silencieux){
  mode=(mode==='local'||mode==='hybride'||mode==='online')?mode:'local';
  memoriserMode(mode);window.__viaMode=mode;
  var mp=document.getElementById('modePick');if(mp)mp.value=mode;
  var en=cfgEnLigne();
  if(mode==='local'){
    eng={provider:'local',baseUrl:'',model:''};ViaProviders.save(eng);
  }else if(mode==='online'){
    if(en){eng={provider:en.provider,baseUrl:en.baseUrl,model:en.model};ViaProviders.save(eng);}
    else{eng={provider:'none',baseUrl:'',model:''};ViaProviders.save(eng);}
  }else{
    if(en){eng={provider:en.provider,baseUrl:en.baseUrl,model:en.model};ViaProviders.save(eng);}
    else{eng={provider:'local',baseUrl:'',model:''};ViaProviders.save(eng);}
  }
  window.__viaLLMVerifie=false;window.__viaLLMVerifieKey='';
  if(typeof fillSettings==='function')fillSettings();
  if(!silencieux)afficherMoteurUtilise();
}
function demarrerMoteurLocal(raison){
  if(ViaLocalEngine.getConsent()!=='granted'){setState('needs-consent');afficherMoteurUtilise(raison?('local non autorisé — '+raison):'local non autorisé');return Promise.resolve(false);}
  var ph='';try{ph=ViaLocalEngine.summary().phase;}catch(e){}
  if(ph==='ready'||ph==='generating'){setState('ready');afficherMoteurUtilise(raison||'déjà chargé');return Promise.resolve(true);}
  loadArmed=true;
  if(ph==='downloading'||ph==='loading'||ph==='checking'){setState(ph==='downloading'?'downloading':ph==='checking'?'checking':'loading');afficherMoteurUtilise(raison||'chargement en cours');return Promise.resolve(true);}
  setState('checking');afficherMoteurUtilise(raison?('chargement — '+raison):'chargement');
  return ensureEngine().then(function(){updateIdCard();setState('ready');afficherMoteurUtilise(raison||'chargé');pump();return true;},function(e){
    var c=e&&e.code;
    if(c==='NEEDS_CONSENT'){consentShown(true);setState('needs-consent');}
    else if(c==='ABORTED'||c==='NEEDS_LOAD'){setState('idle');}
    else{setState('error',explain(e));}
    afficherMoteurUtilise(raison?('échec — '+raison):'échec');
    return false;
  });
}
function orchestrerDemarrage(){
  var mode=lireMode();window.__viaMode=mode;
  appliquerMode(mode,true);
  majBlmUsed();
  var en=cfgEnLigne();
  if(mode==='local'){
    if(ViaLocalEngine.getConsent()==='granted')return demarrerMoteurLocal('chargement automatique');
    setState('needs-consent');afficherMoteurUtilise('chargement automatique après autorisation');return Promise.resolve(false);
  }
  if(mode==='online'){
    if(!en||!String(en.baseUrl||'').trim()){
      setState('idle');afficherMoteurUtilise('aucun serveur en ligne configuré');
      try{var m=document.getElementById('pMsg');if(m)m.textContent='Mode en ligne : aucun serveur configuré. Renseigne une adresse dans Réglages (Avancé) — aucune réponse ne sera simulée.';}catch(e){}
      return Promise.resolve(false);
    }
    setState('checking');afficherMoteurUtilise('test du serveur en ligne');
    return testerLLM(15000).then(function(r){
      if(r.ok){setState('ready');afficherMoteurUtilise('serveur en ligne vérifié');pump();return true;}
      setState('idle');afficherMoteurUtilise('en ligne indisponible — aucun repli automatique en mode en ligne');return false;
    });
  }
  // Hybride : en ligne d'abord s'il est configuré, sinon local, sans jamais
  // prétendre que le distant répond.
  if(en&&String(en.baseUrl||'').trim()){
    setState('checking');afficherMoteurUtilise('hybride — test du serveur en ligne');
    return testerLLM(15000).then(function(r){
      if(r.ok){setState('ready');afficherMoteurUtilise('hybride — en ligne vérifié');pump();return true;}
      addOnce('sys','Hybride : le serveur en ligne ne répond pas — bascule sur le moteur local.');
      eng={provider:'local',baseUrl:'',model:''};ViaProviders.save(eng);
      if(ViaLocalEngine.getConsent()==='granted')return demarrerMoteurLocal('repli hybride');
      setState('needs-consent');afficherMoteurUtilise('hybride — local non autorisé');return false;
    });
  }
  eng={provider:'local',baseUrl:'',model:''};ViaProviders.save(eng);
  addOnce('sys','Hybride : aucun serveur en ligne configuré — moteur local utilisé.');
  if(ViaLocalEngine.getConsent()==='granted')return demarrerMoteurLocal('hybride sans serveur en ligne');
  setState('needs-consent');afficherMoteurUtilise('hybride — local non autorisé');return Promise.resolve(false);
}
// États RÉELS, jamais déduits d'un simple réglage sélectionné : le LLM distant
// n'est « actif » qu'après un test réussi, les BLM qu'après la batterie.
var blmStatus={state:'untested',total:0,reussis:0,refuses:[],message:'auto-test non lancé',at:0};
var llmStatus={state:'unverified',provider:null,baseUrl:'',model:'',detail:'aucun test effectué',at:0};
window.__blmReady=false;
var loadArmed=false; // vrai uniquement après appui explicite sur « Charger le modèle » (jamais auto)
// Migration : un ancien réglage manuel « webllm » ne doit plus bloquer le parcours
// automatique. Bascule vers le mode local automatique (une seule fois) SANS
// supprimer conversations ni fichiers en cache (réutilisés par le moteur).
// Le consentement existant est respecté tel quel : sans accord, rien ne démarre.
(function migrateLegacyManual(){
  try{
    var done=false; try{done=!!localStorage.getItem('via-migrated-webllm');}catch(e){}
    if(!done&&eng.provider==='webllm'){
      eng={provider:'local',baseUrl:'',model:''};ViaProviders.save(eng);
      try{localStorage.setItem('via-migrated-webllm','1');}catch(e){}
      var mm=document.getElementById('pMsg');if(mm)mm.textContent='Ancien réglage « WebLLM manuel » migré vers le mode automatique (accord et fichiers conservés).';
    }
  }catch(e){}
})();
var botsById={},selectedBots=[],queue=[],working=false,lastFailure=null,enginePromise=null,genCtl=null,loadCancelled=false;
/* Une promesse moteur n'est valable que si le moteur charge/génère encore :
   après déchargement ou crash, la promesse résolue d'avant ne doit ni masquer
   l'avis « non chargé » ni bloquer un vrai rechargement. */
function promesseMoteurValide(){
  if(!enginePromise)return false;
  var ph='';try{ph=ViaLocalEngine.summary().phase;}catch(e){}
  if(ph==='downloading'||ph==='loading'||ph==='generating'||ph==='checking')return true;
  enginePromise=null;return false;
}
var hists={};function H(id){if(!hists[id])hists[id]=[];return hists[id];}
var banner=document.getElementById('engineBanner'),eline=document.getElementById('engineLine'),dotEl=document.querySelector('#msn .dot'),statusEl=document.getElementById('status');
function setState(st,msg){
  var map={idle:['Moteur local : non chargé — chargement automatique après autorisation.','Hors ligne — non chargé','#8f96bd'],
    'needs-consent':['Moteur : en attente d’autorisation…','Hors ligne — autorisation requise','#8f96bd'],
    checking:['Vérification du moteur…','Vérification…','#ffd23f'],
    downloading:['Téléchargement du modèle… '+(msg||''),'Téléchargement…','#ffd23f'],
    loading:['Chargement du moteur en mémoire…','Chargement…','#ffd23f'],
    ready:['Prêt — moteur local partagé','En ligne (moteur local, opérationnel)','#27d17f'],
    responding:['Réponse en cours ('+(msg||'')+')…','En ligne — '+(msg||'')+' écrit…','#27d17f'],
    error:['Erreur : '+(msg||'moteur indisponible'),'Hors ligne — erreur','#ff3d9a']};
  if(eng.provider==='ollama'||eng.provider==='custom'){
    var nomF=(eng.provider==='ollama'?'Ollama':'Endpoint')+(eng.model?' ('+eng.model+')':'');
    map.idle=[nomF+(eng.baseUrl?' — '+eng.baseUrl:' — adresse non renseignée')+(eng.baseUrl?' — non testé. Envoie un message ou teste dans Réglages (Avancé).':' : aucun serveur à contacter. Choisis le moteur local ou renseigne une adresse.'),'Hors ligne — '+eng.provider,'#8f96bd'];
    map.ready=['Prêt — '+nomF,'En ligne ('+eng.provider+', opérationnel)','#27d17f'];
    map.checking=['Vérification '+nomF+'…','Vérification…','#ffd23f'];
  }
  if(eng.provider==='none'){
    map.idle=['Aucun moteur sélectionné — choisis Local ou configure un serveur en ligne dans Réglages (Avancé).','Hors ligne — aucun moteur','#8f96bd'];
    map.ready=map.idle;
  }
  // Aucun « prêt » sans preuve réelle : le local doit être chargé, le distant
  // doit avoir réussi un test pour cette adresse/modèle exacts.
  if(typeof moteurVraimentPret==='function')st=moteurVraimentPret(st);
  var m=map[st]||map.idle;
  eline.textContent=m[0];statusEl.textContent=m[1];if(dotEl)dotEl.style.background=m[2];
  banner.textContent=(st==='ready'?'🟢 ':st==='error'?'🔴 ':st==='idle'||st==='needs-consent'?'⚪ ':'🟡 ')+m[0];
  document.getElementById('cancel').hidden=!(st==='downloading'||st==='loading'||st==='responding');
  document.getElementById('retryBtn').hidden=(st!=='error');
  var pw=document.getElementById('progWrap');if(pw)pw.hidden=(st!=='downloading'&&st!=='loading');
  var lb=document.getElementById('loadBar'),lbtn=document.getElementById('loadBtn');
  if(lb){var granted=eng.provider==='local'&&ViaLocalEngine.getConsent()==='granted';lb.hidden=!(granted&&(st==='idle'||st==='error'||st==='checking'||st==='downloading'||st==='loading'));
    if(lbtn){var mb2='≈390 Mo';try{var pk2=ViaLocalEngine.pickModel(window.__viaCap||null);if(pk2&&pk2.downloadMB)mb2='≈'+pk2.downloadMB+' Mo';}catch(e){};if(st==='downloading'||st==='loading'||st==='checking'){lbtn.disabled=true;lbtn.innerHTML='⏳ '+(m[0]||'Chargement…')+' ('+mb2+')';}else{lbtn.disabled=false;lbtn.innerHTML=(st==='error'?'↻ Recharger le modèle':'📥 Charger le modèle local')+' ('+mb2+' conservés en cache après le 1er chargement)';}}}
  try{if(typeof paintEngineStatus==='function')paintEngineStatus();}catch(e){}
}
// Cause réelle, en clair : jamais de message générique quand le code est connu.
function explain(e){
  var code=e&&e.code,msg=e&&e.message?e.message:'moteur indisponible';
  if(code==='NEEDS_CONSENT')return 'Autorisation requise : autorise le téléchargement ci-dessus (un seul accord).';
  if(code==='NEEDS_LOAD')return 'Modèle local non chargé : le chargement automatique démarre après autorisation (ou via Réglages → Avancé) — ton message partira ensuite.';
  if(code==='NOT_LOADED')return 'Modèle non chargé : autorise le téléchargement (un seul accord) ; le chargement se fait ensuite automatiquement, ou via Réglages (Avancé).';
  if(code==='NO_LOCAL')return msg+' Aucun service distant ne sera configuré sans ton accord : choisis-en un explicitement dans Réglages (Avancé).';
  if(code==='LOAD_FAIL'||/404|Failed to fetch|NetworkError|network|réseau/i.test(msg))return msg+' (téléchargement impossible : vérifie la connexion, puis clique Réessayer — une seule tentative à la fois).';
  if(code==='STORAGE_FULL')return msg+' Libère de l’espace puis clique Réessayer (une seule tentative à la fois).';
  if(code==='BUSY')return 'Moteur occupé : attends la fin ou clique Annuler, puis Réessaie.';
  if(code==='ABORTED')return 'Annulé à ta demande.';
  return msg;
}
// État réellement constatable, jamais déduit du menu : un fournisseur choisi
// n'est pas un moteur chargé, et une adresse Ollama saisie n'est pas un serveur
// qui répond. Le LLM distant reste « non vérifié » jusqu'à un test réussi.
function etatMoteurReel(){
  var e=eng||{provider:'local'},out={provider:e.provider,label:'',etat:'',model:'',ready:false,llmDetail:'',phase:''};
  if(e.provider==='local'){
    out.label='Moteur local CPU/WASM (cet appareil)';
    var sm={};try{sm=ViaLocalEngine.summary();}catch(x){}
    out.phase=sm.phase||'idle';out.model=sm.model||'(aucun modèle chargé)';
    if(out.phase==='ready'||out.phase==='generating'){out.etat='prêt';out.ready=true;}
    else if(out.phase==='downloading')out.etat='téléchargement…';
    else if(out.phase==='loading')out.etat='chargement…';
    else if(out.phase==='error')out.etat='erreur';
    else out.etat='non chargé';
    out.llmDetail='modèle local '+(out.ready?'chargé':'non chargé')+' — '+out.model;
  }else if(e.provider==='ollama'||e.provider==='custom'){
    out.label=(e.provider==='ollama'?'Ollama':'Endpoint compatible OpenAI')+(e.baseUrl?' — '+e.baseUrl:' — adresse non renseignée');
    out.model=e.model||'(non précisé)';
    var meme=(llmStatus&&llmStatus.provider===e.provider&&llmStatus.baseUrl===(e.baseUrl||'')&&llmStatus.model===(e.model||''));
    if(meme&&llmStatus.state==='ok'){out.etat='répond (testé)';out.ready=true;out.llmDetail=llmStatus.detail||'test réussi';}
    else if(meme&&llmStatus.state==='error'){out.etat='échec du test';out.llmDetail=llmStatus.detail||'échec du test';}
    else{out.etat='configuré, non vérifié';out.llmDetail='aucun test effectué pour cette adresse/modèle';}
  }else{
    out.label='Aucun moteur (désactivé)';out.model='—';out.etat='désactivé';out.llmDetail='aucun moteur sélectionné';
  }
  return out;
}
function etiquetteBLM(){
  if(!blmStatus||blmStatus.state==='untested')return 'non testés';
  if(blmStatus.state==='ok')return 'chargés ('+blmStatus.reussis+'/'+blmStatus.total+')';
  if(blmStatus.state==='partial')return 'partiels ('+blmStatus.reussis+'/'+blmStatus.total+')';
  return 'erreur'+(blmStatus.total?(' ('+blmStatus.reussis+'/'+blmStatus.total+')'):'');
}
function paintEngineStatus(){
  try{
    var er=etatMoteurReel();
    var se=document.getElementById('stEngine');if(se)se.textContent=er.label+' — '+er.etat;
    var sm=document.getElementById('stModel');if(sm)sm.textContent=er.model;
    var sb=document.getElementById('stBLM');if(sb)sb.textContent=etiquetteBLM();
    var sd=document.getElementById('stBLMDetail');
    if(sd){if(blmStatus.state==='untested')sd.textContent='Auto-test non lancé : appuie sur « Charger le LLM + BLM » ou « Relancer l’auto-test BLM ».';else if(blmStatus.refuses&&blmStatus.refuses.length)sd.textContent='Exemples refusés : '+blmStatus.refuses.join(', ');else sd.textContent=blmStatus.message||'';}
    var sl=document.getElementById('stLLM');if(sl)sl.textContent='Test LLM : '+(er.llmDetail||'aucun test effectué');
    var sp=document.getElementById('stPath');if(sp)sp.textContent='Dernier parcours : '+(window.__viaDernierParcours||'aucune requête depuis le chargement');
    if(typeof afficherMoteurUtilise==='function')afficherMoteurUtilise();
  }catch(e){}
}
// Batterie BLM complète (85 exemples exigés) : rapporte les identifiants exacts
// refusés. Ne déclare JAMAIS « chargés » si un seul exemple échoue.
function executerAutoTestBLM(){
  var B={comprehension:window.BLMComprehension,langue:window.BLMLangue,registre:window.BLMRegistre,memoire:window.BLMMemoire,philo:window.BLMPhilo,coherence:window.BLMCoherence,contrat:window.BLMContrat,correction:window.BLMCorrection,routage:window.BLMRoutage,savoir:window.BLMSavoir,budget:window.BLMBudget,couts:window.BLMCouts,conscience:window.BLMConscience,securite:window.BLMSecurite,journal:window.BLMJournal};
  try{
    if(!window.BLMExemples||!window.BLMExemples.batterie)throw new Error('module d’exemples BLM absent');
    var bat=window.BLMExemples.batterie(B);
    var refuses=(bat.details||[]).filter(function(d){return d&&!d.ok&&!d.attente;}).map(function(d){return d.id+' ['+d.bloc+']';});
    blmStatus={state:bat.ok?'ok':(bat.reussis>0?'partial':'error'),total:bat.total,reussis:bat.reussis,refuses:refuses,message:bat.ok?'batterie complète réussie':'batterie incomplète',at:Date.now()};
    window.__blmReady=!!bat.ok;
  }catch(e){
    blmStatus={state:'error',total:0,reussis:0,refuses:[],message:(e&&e.message)?e.message:String(e),at:Date.now()};
    window.__blmReady=false;
  }
  paintEngineStatus();
  return blmStatus;
}
// Test LLM réellement distinct du choix du fournisseur. Local : résumé du moteur.
// Distant : un vrai échange court (pré-vol Ollama inclus), avec l'adresse testée
// et le code d'erreur affichés en cas d'échec.
function testerLLM(timeoutMs){
  return new Promise(function(resolve){
    var e=eng||{};
    var bot=(typeof botsById!=='undefined'&&(botsById[selectedBots[0]]||botsById[q]))||{id:'via',name:'ViA',specialty:'',personality:''};
    function fin(state,detail,code){
      llmStatus={provider:e.provider,baseUrl:e.baseUrl||'',model:e.model||'',state:state,detail:detail,code:code||null,at:Date.now()};
      if(e.provider!=='local'){
        window.__viaLLMVerifie=(state==='ok');
        window.__viaLLMVerifieKey=(state==='ok')?cfgKey(e):'';
      }
      paintEngineStatus();
      resolve({ok:state==='ok',state:state,detail:detail,code:code||null});
    }
    if(e.provider==='none'){fin('error','Aucun moteur sélectionné.');return;}
    if(e.provider==='local'){
      var sm={};try{sm=ViaLocalEngine.summary();}catch(x){}
      if(sm.phase==='ready'||sm.phase==='generating')fin('ok','modèle local chargé — '+(sm.model||'?'));
      else fin('error','modèle local non chargé (phase : '+(sm.phase||'idle')+').');
      return;
    }
    var base=String(e.baseUrl||'').trim();
    if(!base){fin('error','adresse vide : aucun serveur '+e.provider+' à contacter.');return;}
    if(typeof ViaProviders==='undefined'||!ViaProviders.chat){fin('error','couche fournisseur non chargée.');return;}
    var c=new AbortController(),done=false;
    var t=setTimeout(function(){if(!done){done=true;try{c.abort();}catch(x){}fin('error','délai dépassé (15 s) : aucune réponse de '+base+'.','TIMEOUT');}},timeoutMs||15000);
    var key=null;try{key=document.getElementById('pKey').value||null;}catch(x){}
    ViaProviders.chat(e,bot,[{role:'user',content:'Dis juste : test OK.'}],c.signal,key).then(function(r){
      if(done)return;done=true;clearTimeout(t);fin('ok','réponse reçue de '+base+' : '+String(r).slice(0,80));
    },function(err){
      if(done)return;done=true;clearTimeout(t);
      var code=(err&&err.code)||null;
      fin('error',((err&&err.message)||'échec')+(code?' ['+code+']':'')+' — adresse testée : '+base,code);
    });
  });
}
function fillSettings(){var pp=document.getElementById('pProvider');if(pp)pp.value=eng.provider;document.getElementById('pUrl').value=eng.baseUrl||'';document.getElementById('pModel').value=eng.model||'';llmStatus={state:'unverified',provider:eng.provider,baseUrl:eng.baseUrl||'',model:eng.model||'',detail:'aucun test effectué',at:0};if(eng.provider!=='local'){window.__viaLLMVerifie=false;window.__viaLLMVerifieKey='';}paintEngineStatus();}
function consentShown(v){document.getElementById('consentBar').hidden=!v;}
function refreshConsent(){
  var c=ViaLocalEngine.getConsent();
  // Accord retiré : on réaffiche la barre UNE fois (flag), puis on respecte le refus.
  var reshown=false; try{reshown=!!localStorage.getItem('via-bar-reshown');}catch(e){}
  if(c==='withdrawn'&&!reshown){consentShown(true);try{localStorage.setItem('via-bar-reshown','1');}catch(e){}}
  else consentShown(c===null);
  var st=document.getElementById('consentState');
  if(st)st.textContent=c==='granted'?'accordé':c==='later'?'reporté (redemandé à l’envoi)':c==='withdrawn'?'retiré':'non demandé';
  var qc=document.getElementById('quickConsent');if(qc)qc.hidden=!(c!=='granted'&&lireMode()!=='online');
  paintPick(window.__viaCap||null);
  var lic=document.getElementById('consentLicense');if(lic)lic.textContent='Apache 2.0 — usage autorisé pour discuter avec les SuperBots sur cet appareil.';
  paintStorage();paintIdCard();paintEngineStatus();
}
// Taille réelle par appareil détecté (sans télécharger) + blocage explicite
// si aucun moteur local ne convient. Ne conclut jamais sur « tout le téléphone ».
function paintPick(cap){
  var m=document.getElementById('consentModel'),mb=document.getElementById('consentMB'),nl=document.getElementById('consentNoLocal'),go=document.getElementById('consentGo');
  if(!cap){if(m)m.textContent='…';if(mb)mb.textContent='…';return;}
  var pick=ViaLocalEngine.pickModel(cap);
  if(pick.error){
    if(m)m.textContent='aucun compatible';if(mb)mb.textContent='0';
    if(nl){nl.hidden=false;nl.textContent='Aucun moteur local compatible : '+pick.message+' Aucun service distant ne sera configuré sans ton accord.';}
    if(go)go.disabled=true;
  }else{
    var short=(pick.id||'SmolLM2-360M-Instruct-ONNX').split('-Instruct')[0].split('/').pop();
    if(m)m.textContent=short+' (CPU/WASM, monothread)';if(mb)mb.textContent=pick.downloadMB;
    if(nl)nl.hidden=true;if(go)go.disabled=false;
  }
  paintDiag(cap);
}
// Version réellement chargée (à bumper à chaque publication : repère
// anti-décalage local/Pages/cache) + moteur réellement utilisé (à distinguer
// de « site accessible en ligne », qui ne dit rien de l'inférence).
window.__VIA_BUILD = '2026-11-08-parcours13+110BLM';
function paintDiag(cap){
  var el=document.getElementById('diagDetail');if(!el)return;
  cap=cap||(ViaLocalEngine.lastDetect?ViaLocalEngine.lastDetect():null);
  if(!cap){el.textContent='détection en cours…';return;}
  var L=['contexte sécurisé : '+(cap.secure?'oui':'NON'),
    'WebGPU : non utilisé (moteur CPU/WASM seul)',
    'WebAssembly (moteur CPU) : '+(cap.wasm?'oui':'non — requis')];
  try{var pk=ViaLocalEngine.pickModel(cap);L.push('modèle local sélectionnable : '+(pk.error?('aucun ('+pk.error+')'):pk.backend+' / '+(pk.id||'auto')));}catch(e){}
  var er={};try{er=etatMoteurReel();}catch(e){}
  L.push('moteur actif : '+(er.label||'?')+' — '+(er.etat||'?'));
  L.push('modèle utilisé : '+(er.model||'—'));
  try{
    if(er.provider==='local'){var sm=ViaLocalEngine.summary();if(sm){if(sm.tokenizer)L.push('tokenizer : '+sm.tokenizer);if(sm.mode&&sm.mode!=='—')L.push('mode : '+sm.mode);if(sm.threads)L.push('threads : '+sm.threads);}}
    else{var sm2=ViaLocalEngine.summary();L.push('moteur WASM local : '+((sm2&&(sm2.phase==='ready'||sm2.phase==='generating'))?'également chargé':'non chargé / en pause'));}
  }catch(e){}
  L.push('BLM : '+etiquetteBLM());
  if(blmStatus.refuses&&blmStatus.refuses.length)L.push('exemples BLM refusés : '+blmStatus.refuses.join(', '));
  L.push('test LLM : '+((llmStatus&&llmStatus.detail)||'aucun test effectué'));
  if(cap.reasons&&cap.reasons.length)L.push('causes : '+cap.reasons.join(' | '));
  else L.push('causes : aucune (appareil compatible)');
  L.push('build : '+(window.__VIA_BUILD||'?'));
  L.push('inférence : '+(er.provider==='local'?'locale (cet appareil, CPU/WASM)':(er.provider==='ollama'||er.provider==='custom')?'DISTANTE ('+er.provider+' — adresse configurée ; le site reste joignable en ligne, l’inférence dépend du serveur)':'aucune (moteur désactivé)'));
  el.textContent=L.join('\n');
}
function paintStorage(){
  var el=document.getElementById('storageInfo');if(!el)return;el.textContent='calcul…';
  ViaLocalEngine.storageCheck(0).then(function(s){el.textContent=s.unknown?'non mesurable sur ce navigateur':'utilisé '+s.usageMB+' / quota '+s.quotaMB+' Mo';});
}
function autoriserLocal(){
  ViaLocalEngine.setConsent('granted');refreshConsent();
  requestPlatformPerms().then(function(){paintPerms();});
  if(lireMode()==='online'){setState('idle');afficherMoteurUtilise('local autorisé — mode en ligne conservé');return;}
  demarrerMoteurLocal('accord donné');
}
document.getElementById('consentGo').onclick=autoriserLocal;
var quickConsentBtn=document.getElementById('quickConsent');
if(quickConsentBtn)quickConsentBtn.onclick=autoriserLocal;
document.getElementById('consentLater').onclick=function(){ViaLocalEngine.setConsent('later');refreshConsent();setState('needs-consent');};
document.getElementById('consentDetails').onclick=function(){var t=document.getElementById('consentDetailText');t.hidden=!t.hidden;if(!t.hidden)paintPerms();};
// Autorisations réellement accordables en un geste : stockage persistant + notifications.
// Micro, caméra, partage d'écran, position : JAMAIS demandés ici, uniquement à l'usage.
async function requestPlatformPerms(){
  try{if(navigator.storage&&navigator.storage.persist){await navigator.storage.persist();}}catch(e){}
  try{
    if('Notification' in window&&Notification.permission==='default'){
      if(Notification.requestPermission.length>0){await Notification.requestPermission();}
      else{await new Promise(function(res){Notification.requestPermission(function(){res();});});}
    }
  }catch(e){}
}
async function permState(name){
  try{
    if(!navigator.permissions||!navigator.permissions.query)return 'état non lisible ici';
    var r=await navigator.permissions.query({name:name});
    return r.state==='granted'?'accordée':r.state==='denied'?'refusée':'à demander à l’usage';
  }catch(e){return 'non supportée ici';}
}
async function paintPerms(){
  var c=ViaLocalEngine.getConsent();
  var info=ViaLocalEngine.modelInfo(ViaLocalEngine.MODELS[0].id);
  var mm=document.getElementById('pmMB');if(mm)mm.textContent=info.downloadMB;
  var sm=document.getElementById('psModel');if(sm)sm.textContent=c==='granted'?'accordé':c==='later'?'reporté':c==='withdrawn'?'retiré':'non demandé';
  var sp=document.getElementById('psPersist');
  if(sp){try{if(navigator.storage&&navigator.storage.persisted){sp.textContent=await navigator.storage.persisted()?'accordé (persistant)':'standard (purge possible)';}else sp.textContent='inconnu ici';}catch(e){sp.textContent='inconnu ici';}}
  var sn=document.getElementById('psNotify');
  if(sn)sn.textContent=('Notification' in window)?(Notification.permission==='granted'?'accordée':Notification.permission==='denied'?'refusée (fonction indisponible)':'en attente (demandée au clic Autoriser)'):'non supportée ici';
  var md=document.getElementById('psMediaState');
  if(md){var parts=[];var names=[['microphone','micro'],['camera','caméra'],['display-capture','écran'],['geolocation','position']];for(var i=0;i<names.length;i++){parts.push(names[i][1]+' : '+await permState(names[i][0]));}md.textContent='('+parts.join(' · ')+')';}
  var sw=document.getElementById('psSW');
  if(sw){var on=false;try{on=!!(navigator.serviceWorker&&navigator.serviceWorker.controller);}catch(e){}sw.textContent=on?'actif':'enregistrement… (recharge si absent)';}
}
// Orchestrateur rétro : groupes de tâches du chargement, pilotés par ce que le
// SuperBot doit assembler pour répondre (runtime → poids → personnalité → règles).
var orch={};
function orchReset(modelShort){orch={runtime:['RUNTIME WASM CPU','…',''],poids:['POIDS '+modelShort,'…',''],personnalite:['PERSONNALITE','…',''],regles:['REGLES reponse','…','']};paintTerm();}
function orchSet(g,st,extra){if(orch[g]){orch[g][1]=st;if(extra!==undefined)orch[g][2]=extra;paintTerm();}}
function paintTerm(){var el=document.getElementById('termLog');if(!el)return;var L='';for(var k in orch){var g=orch[k];var mark=g[1]==='OK'?'[OK]':g[1]==='ERREUR'? '[!!]':g[1]==='…'?'[..]':'[>>]';L+='&gt; '+g[0]+' '+mark+(g[2]?' '+g[2]:'')+'<br>';}el.innerHTML=L+'<span class="blink">▊</span>';}
function ensureEngine(){
  var sm=ViaLocalEngine.summary();
  if(sm.phase==='ready')return Promise.resolve(true);
  if(enginePromise){
    if(!promesseMoteurValide()){/* obsolète : on la jette, on repart proprement */}
    else return enginePromise;
  }
  // JAMAIS de démarrage automatique : seul le bouton « Charger » arme le chargement.
  if(!loadArmed){var e0=new Error('Chargement non demandé : appuie sur « Charger le modèle local ».');e0.code='NEEDS_LOAD';return Promise.reject(e0);}
  enginePromise=(async function(){
    var c=ViaLocalEngine.getConsent();
    if(c!=='granted'){setState('needs-consent');consentShown(true);var e1=new Error('Autorisation requise pour télécharger le modèle.');e1.code='NEEDS_CONSENT';throw e1;}
    loadCancelled=false;setState('downloading','0 %');
    var info0=ViaLocalEngine.modelInfo(ViaLocalEngine.MODELS[0].id);
    orchReset(info0.id.split('-Instruct')[0]);
    var f=document.getElementById('progFill');if(f)f.style.width='0%';
    await ViaLocalEngine.autoLoad(function(s){
      if(s.group==='runtime'){orchSet('runtime',s.progress>=100?'OK':'>>');}
      else if(s.group==='poids'){
        if(s.phase==='downloading'){orchSet('runtime','OK');orchSet('poids','>>',(s.progress||0)+' %');setState('downloading',(s.progress||0)+' %');var ff=document.getElementById('progFill');if(ff)ff.style.width=(s.progress||0)+'%';var pt=document.getElementById('progText');if(pt)pt.textContent='LOAD poids '+(s.progress||0)+' %'+(s.detail?' — '+s.detail:'')+' — tu peux continuer à lire, rien n’est bloqué.';}
        else{orchSet('poids','OK');setState('loading');}
      }
    });
    if(loadCancelled){try{await ViaLocalEngine.unload();}catch(e){}var e2=new Error('Chargement annulé à ta demande.');e2.code='ABORTED';throw e2;}
    orchSet('personnalite','OK');orchSet('regles','OK');
    setState('ready');return true;
  })();
  enginePromise.then(function(){},function(e){enginePromise=null;if(e&&(e.code==='NEEDS_CONSENT'||e.code==='ABORTED'||e.code==='NEEDS_LOAD')){setState(e.code==='NEEDS_CONSENT'?'needs-consent':'idle');}else{setState('error',explain(e));for(var k in orch){if(orch[k][1]==='>>'||orch[k][1]==='…')orch[k][1]='ERREUR';}paintTerm();paintDiag();lastFailure={stage:'engine',item:null};}});
  return enginePromise;
}
// Bouton unique de chargement : armé par l'utilisateur, jamais automatique.
// Double-clic sans effet (promesse partagée + bouton désactivé pendant le chargement).
function flushConvs(){try{for(var k in hists)saveConv(k);}catch(e){}}
// Bouton « Charger le LLM + BLM » : toujours visible, quel que soit le fournisseur.
// 1) initialise les BLM (indépendant du LLM) ; 2) charge ou teste le LLM sélectionné.
// Ne touche ni aux conversations, ni aux caches, ni aux 4 boutons refresh/cache.
document.getElementById('llmBlmBtn').onclick=function(){
  var btn=this,msg=document.getElementById('llmBlmMsg');
  if(!msg||btn.disabled)return;
  btn.disabled=true;
  function dire(t){msg.textContent=t;}
  function finir(){btn.disabled=false;paintEngineStatus();}
  // 1) BLM : auto-test complet, indépendant du LLM. Un échec n'est jamais
  // transformé en succès et les identifiants refusés sont affichés.
  var bs=executerAutoTestBLM();
  var blmTxt='BLM : '+etiquetteBLM();
  if(bs.refuses&&bs.refuses.length)blmTxt+=' — refusé(s) : '+bs.refuses.join(', ');
  else if(bs.state!=='ok')blmTxt+=' — '+bs.message;
  // 2) LLM réellement sélectionné : test séparé, résultat séparé.
  var baseTest=String(eng.baseUrl||'').trim();
  if((eng.provider==='ollama'||eng.provider==='custom')&&!baseTest){
    llmStatus={provider:eng.provider,baseUrl:eng.baseUrl||'',model:eng.model||'',state:'error',detail:'adresse vide : aucun serveur à contacter',at:Date.now()};
    dire(blmTxt+' · LLM '+eng.provider+' : aucun serveur configuré. Renseigne une adresse réellement joignable dans Réglages, ou choisis le moteur local.');
    finir();return;
  }
  if(eng.provider==='local'){
    flushConvs();loadArmed=true;setState('checking');dire(blmTxt+' · Chargement du modèle local…');
    ensureEngine().then(function(){updateIdCard();pump();return testerLLM();}).then(function(r){
      dire(blmTxt+' · LLM local : '+(r.ok?'prêt — '+r.detail:'échec — '+r.detail));
    },function(e){
      return testerLLM().then(function(r){dire(blmTxt+' · LLM local : échec — '+((e&&e.message)?e.message:e)+' · '+r.detail);});
    }).then(finir);
  }else if(eng.provider==='ollama'||eng.provider==='custom'){
    var avert=[];
    if(/^http:\/\//i.test(baseTest)&&location.protocol==='https:')avert.push('page https + adresse http : le navigateur bloque l’appel (contenu mixte) — il faut une adresse https joignable');
    if(/\/\/(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.|localhost|127\.)/i.test(baseTest)&&location.protocol==='https:')avert.push('adresse locale depuis un site public : l’accès réseau privé est bloqué sans relais — prévoir un relais https (tunnel/proxy TLS) ou le moteur local');
    setState('checking');dire(blmTxt+' · Test LLM '+eng.provider+'…'+(avert.length?' Avertissement navigateur : '+avert.join(' ; ')+'.':''));
    testerLLM(15000).then(function(r){
      if(r.ok){setState('ready');dire(blmTxt+' · LLM '+eng.provider+' : OK — '+r.detail);return;}
      setState('idle');
      var m=blmTxt+' · LLM '+eng.provider+' : échec — '+r.detail+'. Choix : (1) saisir une adresse de serveur réellement joignable depuis cet appareil ; (2) utiliser le moteur local proposé (fournisseur « local »).';
      if(r.code==='HTTP_405'){
        dire(m+' Diagnostic du serveur…');
        diagServeur(baseTest).then(function(d){
          var rr=d.racine,tt=d.tags;
          var estOllama=(rr.status===200&&/ollama is running/i.test(rr.body))||(tt.status===200&&/models/i.test(tt.body));
          var verdict=estOllama?'Le serveur répond comme Ollama mais refuse POST /api/chat : un intermédiaire (proxy, passerelle) modifie les requêtes, ou les versions divergent.':'Réponse non-Ollama à cette adresse (racine HTTP '+(rr.status||rr.erreur||'?')+', tags HTTP '+(tt.status||tt.erreur||'?')+') : vérifie protocole, hôte, port et chemin.';
          dire(m+' '+verdict);
        });
      }else dire(m);
    }).then(finir);
  }else{
    testerLLM().then(function(r){dire(blmTxt+' · LLM : '+r.detail);}).then(finir);
  }
};
var blmTestBtn=document.getElementById('blmTestBtn');
if(blmTestBtn)blmTestBtn.onclick=function(){
  var b=executerAutoTestBLM(),msg=document.getElementById('llmBlmMsg');
  if(msg)msg.textContent='BLM : '+etiquetteBLM()+(b.refuses&&b.refuses.length?' — refusé(s) : '+b.refuses.join(', '):(b.state==='ok'?'':' — '+b.message));
};
document.getElementById('loadBtn').onclick=function(){
  var b=this;var ph='';try{ph=ViaLocalEngine.summary().phase;}catch(e){}
  if(ph==='downloading'||ph==='loading'||ph==='generating'||ph==='ready')return;
  if(promesseMoteurValide())return;
  flushConvs();loadArmed=true;b.disabled=true;setState('checking');
  ensureEngine().then(function(){updateIdCard();pump();},function(){}).then(function(){b.disabled=false;});
};
fillSettings();
document.getElementById('pProvider').onchange=function(){eng.provider=this.value;eng.baseUrl=document.getElementById('pUrl').value.trim();eng.model=document.getElementById('pModel').value.trim();if(this.value==='local'){memoriserMode('local');eng={provider:'local',baseUrl:'',model:''};}else if(this.value==='ollama'||this.value==='custom'){memoriserMode('online');memoriserEnLigne(eng);}ViaProviders.save(eng);fillSettings();var mp0=document.getElementById('modePick');if(mp0)mp0.value=lireMode();setState(eng.provider==='local'?(ViaLocalEngine.getConsent()==='granted'?'idle':'needs-consent'):'idle');if(eng.provider==='local'&&ViaLocalEngine.getConsent()==='granted')demarrerMoteurLocal('choix local');paintDiag();};
document.getElementById('pUrl').onchange=function(){eng.baseUrl=this.value.trim();ViaProviders.save(eng);if(eng.provider==='ollama'||eng.provider==='custom')memoriserEnLigne(eng);window.__viaLLMVerifie=false;window.__viaLLMVerifieKey='';llmStatus={state:'unverified',provider:eng.provider,baseUrl:eng.baseUrl||'',model:eng.model||'',detail:'aucun test effectué',at:0};setState('idle');paintDiag();};
document.getElementById('pModel').onchange=function(){eng.model=this.value.trim();ViaProviders.save(eng);if(eng.provider==='ollama'||eng.provider==='custom')memoriserEnLigne(eng);window.__viaLLMVerifie=false;window.__viaLLMVerifieKey='';llmStatus={state:'unverified',provider:eng.provider,baseUrl:eng.baseUrl||'',model:eng.model||'',detail:'aucun test effectué',at:0};setState('idle');paintDiag();};
document.getElementById('withdrawBtn').onclick=function(){flushConvs();ViaLocalEngine.setConsent('withdrawn');enginePromise=null;lastFailure=null;try{ViaLocalEngine.unload();}catch(e){}try{if(window.BLMJournal)window.BLMJournal.effacer();}catch(e){}setState('needs-consent');refreshConsent();document.getElementById('pMsg').textContent='Accord retiré. Les fichiers restent en cache : supprime-les ci-dessous si besoin.';};
document.getElementById('deleteModelsBtn').onclick=function(){flushConvs();if(!confirm('Supprimer les fichiers du modèle téléchargé ? Ils seront re-téléchargés au prochain usage autorisé.'))return;var self=this;self.disabled=true;ViaLocalEngine.deleteModels().then(function(n){enginePromise=null;document.getElementById('pMsg').textContent='Modèles supprimés ('+n+' cache(s) vidé(s)).';setState(ViaLocalEngine.getConsent()==='granted'?'idle':'needs-consent');paintStorage();}).catch(function(e){document.getElementById('pMsg').textContent='Suppression incomplète : '+(e&&e.message?e.message:e);}).finally(function(){self.disabled=false;});};
document.getElementById('pUnload').onclick=function(){flushConvs();try{ViaLocalEngine.unload();}catch(e){}enginePromise=null;lastFailure=null;loadArmed=false;document.getElementById('pProg').textContent='Modèle déchargé.';setState('idle');};
document.getElementById('pTest').onclick=function(){var msg=document.getElementById('pMsg');if(msg)msg.textContent='Test en cours…';testerLLM(15000).then(function(r){if(msg)msg.textContent=(r.ok?'Test réussi : ':'Échec : ')+r.detail;if(r.ok)setState('ready');else setState('idle');});};
var pReloadBtn=document.getElementById('pReload');
if(pReloadBtn)pReloadBtn.onclick=function(){
  memoriserMode('local');appliquerMode('local',true);
  flushConvs();loadArmed=true;setState('checking');afficherMoteurUtilise('rechargement manuel');
  ensureEngine().then(function(){updateIdCard();setState('ready');afficherMoteurUtilise('rechargé manuellement');pump();},function(e){var c=e&&e.code;if(c==='NEEDS_CONSENT'){consentShown(true);setState('needs-consent');}else if(c==='ABORTED'||c==='NEEDS_LOAD'){setState('idle');}else{setState('error',explain(e));}});
};
botsById={};cfg.bots.forEach(function(x){botsById[x.id]=x;});
selectedBots=botsById[q]?[q]:[cfg.bots[0].id];
renderChips();
renderBotPick();
try{if(typeof ViaDico!=='undefined'){window.__viaDicoTxt=window.__viaDicoTxt||{};['via','geeko','geekette','theo'].forEach(function(id){ViaDico.textePour(id).then(function(t){window.__viaDicoTxt[id]=t;}).catch(function(){});});}}catch(e){}
migrerAnciennesConvs();
renderSeances();
afficherBot(b.id);
try{var _sb=document.getElementById('sessBot');if(_sb)_sb.onchange=function(){renderSeances();};var _sn=document.getElementById('sessNew');if(_sn)_sn.onclick=function(){var _sb2=document.getElementById('sessBot');var _bb=_sb2?_sb2.value:null;if(!_bb||!(typeof botsById!=='undefined'&&botsById[_bb]))_bb=(typeof q!=='undefined'&&botsById[q])?q:'geeko';nouvelleSeance(_bb);};}catch(e){}
try{if(window.BLMJournal)window.BLMJournal.ecrire(window.BLMJournal.lire());}catch(e){}
try{window.addEventListener('pagehide',function(){try{for(var k in hists)saveConv(k);}catch(e){}});}catch(e){}
function renderChips(){var box=document.getElementById('chips');if(!box)return;box.innerHTML='';cfg.bots.forEach(function(x){var on=selectedBots.indexOf(x.id)>-1;var c=document.createElement('button');c.type='button';c.className='chip'+(on?' on':'');c.textContent=x.avatar+' '+x.name;c.setAttribute('aria-pressed',on);c.onclick=function(){choisirBot(x.id);};box.appendChild(c);});}
// Sélection unique : un seul bot répond, le choix est mémorisé localement.
function renderBotPick(){
  var sel=document.getElementById('botPick');if(!sel)return;
  sel.innerHTML='';
  (cfg.bots||[]).forEach(function(x){var o=document.createElement('option');o.value=x.id;o.textContent=(x.avatar||'')+' '+x.name;sel.appendChild(o);});
  var cur=(selectedBots&&selectedBots[0])||q;try{sel.value=cur;}catch(e){}
  sel.onchange=function(){choisirBot(this.value);};
}
function choisirBot(id){
  if(typeof botsById==='undefined'||!botsById[id])return;
  try{flushConvs();}catch(eF){}
  selectedBots=[id];q=id;
  try{localStorage.setItem('via-bot',id);}catch(e){}
  var b=botsById[id];
  var t=document.getElementById('title');if(t)t.textContent=b.avatar+' '+b.name+' — '+b.specialty;
  var a=document.getElementById('avatar');if(a)a.textContent=b.avatar;
  var w=document.getElementById('who');if(w)w.textContent=b.name;
  var bp=document.getElementById('botPick');if(bp)bp.value=id;
  var sb=document.getElementById('sessBot');if(sb)sb.value=id;
  renderChips();
  afficherBot(id);
  try{assurerSeance(id);}catch(e){}
  try{renderSeances();}catch(e){}
}
// Affiche la séance active du bot choisi ; sans séance, l'accueil prédéfini
// (clairement étiqueté, jamais présenté comme une réponse IA).
function afficherBot(id){
  var th=document.getElementById('thread');if(!th)return;
  var s=null;try{s=trouverSeance(id,sessionActiveId(id));}catch(e){}
  if(s&&s.messages&&s.messages.length){try{hists[id]=(s.messages||[]).slice();}catch(e){}afficherSeance(id);return;}
  th.innerHTML='';
  var b=(typeof botsById!=='undefined')?botsById[id]:null;if(!b)return;
  add('bot',b.greeting+' — '+(typeof cfg!=='undefined'&&cfg.disclaimer?cfg.disclaimer:''),b,'accueil prédéfini (pas une réponse IA)');
}
var form=document.getElementById('form'),input=document.getElementById('input'),cancelBtn=document.getElementById('cancel');
cancelBtn.onclick=function(){flushConvs();loadCancelled=true;if(genCtl)genCtl.abort();var ph='';try{ph=ViaLocalEngine.summary().phase;}catch(e){}if(ph==='downloading'||ph==='loading'||ph==='generating'){try{ViaWasmEngine.cancel();}catch(e){}loadArmed=false;}};
document.getElementById('retryBtn').onclick=function(){enginePromise=null;var f=lastFailure;lastFailure=null;if(f&&f.item){queue.unshift({id:f.item.id||('q'+Date.now().toString(36)),text:f.item.text,cancelled:false});}setState('idle');pump();};
function pump(){
  if(working||!queue.length)return;
  var sm={phase:'idle'};try{sm=ViaLocalEngine.summary();}catch(e){}
  if(eng.provider!=='local'){var it0=queue.shift();if(!it0)return;working=true;runItem(it0).then(function(){working=false;pump();},function(){working=false;pump();});return;}
  if(sm.phase!=='ready'){
    if(!promesseMoteurValide())addOnce('sys','Modèle non chargé : chargement automatique après autorisation — ton message partira dès qu’il est prêt.');
    return;
  }
  var item=queue.shift();
  if(!item)return;
  working=true;
  runItem(item).then(function(){working=false;pump();},function(){working=false;pump();});
}
function runItem(item){
  if(eng.provider!=='local')return runRemote(item);
  return ensureEngine().then(function(){
    var chain=Promise.resolve();
    // Orchestrateur de sélection : un seul SuperBot prend la parole.
    var choix=choisirParleur(selectedBots,item.text);
    var parleurId=choix.id, motifChoix=choix.motif;
    // Séance active du bot : contexte cloisonné ; la réponse sera rattachée
    // à cette séance (item.sessionId) et ignorée si elle change entre-temps.
    try{var _se=assurerSeance(parleurId);if(_se&&!item.sessionId)item.sessionId=_se.id;}catch(xS0){}
    [parleurId].forEach(function(id){
      chain=chain.then(function(){
        if(item.cancelled)return;
        var bot=botsById[id];if(!bot)return;
        setState('responding',bot.name);
        var sd=addStream(bot);
        genCtl=new AbortController();
        var h=H(bot.id);h.push({role:'user',content:item.text});
        var orch=orchestrerBLM(item.text,bot,h);
        try{if(window.BLMContrat){BLMContrat.tracer(orch,'registre','selection-'+bot.id,motifChoix||'');BLMContrat.tracer(orch,'parcours','requete-'+(item.id||'?'),bot.id);}}catch(xSel){}
        var prep=preparerEntreeMoteur(orch,item.text,bot);
        if(!prep.ok){sd.box.remove();addOnce('sys','Erreur ('+bot.name+') : '+prep.message);lastFailure={stage:'response',item:item};setState('error',prep.message);return Promise.resolve();}
        try{window.__viaDernierParcours='local CPU/WASM · '+bot.name+' · intention '+((orch&&orch.intention)||'?')+' · '+((prep.msgs||[]).length)+' message(s) · BLM '+etiquetteBLM();if(typeof paintEngineStatus==='function')paintEngineStatus();}catch(xP){}
        // BLM 066 : resoudreMoteur DÉTERMINE le moteur appelé (pas une trace).
        var rmMoteur=(window.BLMCos&&window.BLMCos.resoudreMoteur)?window.BLMCos.resoudreMoteur({fournisseur:'local',ollamaUrl:'',gpuDemande:false}):{moteur:'local-cpu-wasm',repli:'',physique:true};
        if(rmMoteur.moteur!=='local-cpu-wasm'){sd.box.remove();addOnce('sys','Erreur ('+bot.name+') : '+rmMoteur.repli);lastFailure={stage:'response',item:item};setState('error',rmMoteur.repli);return Promise.resolve();}
        return ViaLocalEngine.chat(bot,prep.msgs,{signal:genCtl.signal,onToken:function(t){sd.body.textContent+=t;thread.scrollTop=thread.scrollHeight;}}).then(function(r){
          try{if(item.sessionId){var _cur=null;try{_cur=sessionActiveId(bot.id);}catch(e){}if(_cur&&_cur!==item.sessionId){try{sd.box.remove();}catch(xR){}try{if(window.BLMContrat)BLMContrat.tracer(orch,'parcours','reponse-ignoree-seance-fermee',String(item.sessionId));}catch(xT){}genCtl=null;return;}}}catch(e){}
          r=blmCorrigerReponse(orch,r);
          r=verifierFinaleBLM(orch,r);
          sd.body.textContent=r;try{item.dernierReponse=r;}catch(xD){}finaliserSortie(bot,h,r,orch,'succes',item.id||'parcours-standard');
        },function(e){
          if((e&&e.code)==='ABORTED'||(e&&e.name)==='AbortError'){sd.body.textContent+=' ⏹';addOnce('sys','Réponse interrompue : moteur déchargé pour libérer la mémoire. Recharge pour continuer.');item.cancelled=true;}
          else{sd.box.remove();addOnce('sys','Erreur ('+bot.name+') : '+explain(e));lastFailure={stage:'response',item:item};setState('error',explain(e));try{if(window.BLMJournal)window.BLMJournal.consigner({bot:bot.id,issue:'erreur',motif:String((e&&e.code)||(e&&e.name)||'moteur'),verdict:'',redemandes:(orch&&orch.redemandes?orch.redemandes.length:0)});}catch(ex){}throw e;}
        }).then(function(){genCtl=null;});
      });
    });
    return chain.then(function(){
      if(item.cancelled)return;
      return xreadTouch(item,item.dernierReponse);
    }).then(function(){if(!item.cancelled){setState('ready');lastFailure=null;}});
  },function(e){
    if(e&&e.code==='NEEDS_CONSENT'){addOnce('sys','Autorise le téléchargement du modèle ci-dessus pour discuter (un seul accord, réutilisé ensuite).');consentShown(true);input.value=item.text;input.focus();}
    else if(e&&e.code==='NEEDS_LOAD'){queue.unshift(item);addOnce('sys',explain(e));}
    else if(e&&e.code==='ABORTED'){addOnce('sys','Chargement annulé.');}
    else{lastFailure={stage:'engine',item:item};}
  });
}
function saveConv(id){try{var h=hists[id]||[];var L=lireSeances(id);var sid=sessionActiveId(id);var s=null;for(var i=0;i<L.length;i++)if(L[i]&&L[i].id===sid){s=L[i];break;}if(!s)return;if(h.length){s.messages=h.slice(-40);s.updatedAt=Date.now();if(/^Nouvelle discussion/.test(s.titre||'')){for(var j=0;j<h.length;j++){if(h[j]&&h[j].role==='user'&&String(h[j].content||'').trim()){s.titre=String(h[j].content).trim().slice(0,42);break;}}}}ecrireSeances(id,L);renderSeances();}catch(e){}}
// --- Séances cloisonnées par bot : chaque séance a son id, ses messages, sa
// langue ; l'historique actif (hists) ne contient QUE la séance active.
// Les anciennes séances restent consultables dans le panneau mais ne sont
// JAMAIS réinjectées sans reprise explicite. ViaMemory (carnet/profil) reste
// séparé : il n'est ni lu ni écrit ici.
function lireSeances(bot){try{var v=JSON.parse(localStorage.getItem('via-seances-'+bot)||'null');if(Array.isArray(v))return v;}catch(e){}return [];}
function ecrireSeances(bot,list){try{localStorage.setItem('via-seances-'+bot,JSON.stringify((list||[]).slice(0,20)));}catch(e){}}
function sessionActiveId(bot){try{var m=JSON.parse(localStorage.getItem('via-seances-actives')||'{}');return (m&&m[bot])||null;}catch(e){return null;}}
function definirSeanceActive(bot,id){try{var m={};try{m=JSON.parse(localStorage.getItem('via-seances-actives')||'{}')||{};}catch(e){}if(id)m[bot]=id;else delete m[bot];localStorage.setItem('via-seances-actives',JSON.stringify(m));}catch(e){}}
function trouverSeance(bot,id){var L=lireSeances(bot);for(var i=0;i<L.length;i++)if(L[i]&&L[i].id===id)return L[i];return null;}
function assurerSeance(bot){var s=trouverSeance(bot,sessionActiveId(bot));if(s)return s;var lg='fr';try{lg=localStorage.getItem('via-langue-'+bot)||'fr';}catch(e){}var id='s'+Date.now().toString(36)+Math.floor(Math.random()*999);s={id:id,titre:'Nouvelle discussion',messages:[],langue:lg,createdAt:Date.now(),updatedAt:Date.now()};var L=lireSeances(bot);L.unshift(s);ecrireSeances(bot,L);definirSeanceActive(bot,id);return s;}
function majLangueSeance(bot,langue){try{var s=trouverSeance(bot,sessionActiveId(bot));if(!s||s.langue===langue)return;var L=lireSeances(bot);for(var i=0;i<L.length;i++)if(L[i]&&L[i].id===s.id){L[i].langue=langue;L[i].updatedAt=Date.now();break;}ecrireSeances(bot,L);}catch(e){}}
function nouvelleSeance(bot){try{if(genCtl)genCtl.abort();}catch(e){}var lg='fr';try{lg=localStorage.getItem('via-langue-'+bot)||'fr';}catch(e){}var id='s'+Date.now().toString(36)+Math.floor(Math.random()*999);var s={id:id,titre:'Nouvelle discussion',messages:[],langue:lg,createdAt:Date.now(),updatedAt:Date.now()};var L=lireSeances(bot);L.unshift(s);ecrireSeances(bot,L.slice(0,20));definirSeanceActive(bot,id);try{hists[bot]=[];}catch(e){}afficherSeance(bot);renderSeances();}
function reprendreSeance(bot,id){var s=trouverSeance(bot,id);if(!s)return;try{if(genCtl)genCtl.abort();}catch(e){}definirSeanceActive(bot,id);try{hists[bot]=(s.messages||[]).slice();}catch(e){}afficherSeance(bot);renderSeances();}
function escH(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function afficherSeance(bot){try{var th=document.getElementById('thread');if(!th)return;th.innerHTML='';var h=H(bot);var b0=(typeof botsById!=='undefined')?botsById[bot]:null;for(var i=0;i<h.length;i++){var m=h[i];if(!m)continue;if(m.role==='user')add('me',String(m.content||''));else if(m.role==='assistant')add('bot',String(m.content||''),b0||{name:bot},m.moteur||'réponse directe');}th.scrollTop=th.scrollHeight;}catch(e){}}
function renderSeances(){try{
  var box=document.getElementById('sessList');var sel=document.getElementById('sessBot');if(!box||!sel||typeof cfg==='undefined')return;
  if(!sel.options.length){(cfg.bots||[]).forEach(function(b){var o=document.createElement('option');o.value=b.id;o.textContent=(b.avatar||'')+' '+b.name;sel.appendChild(o);});}
  var cur=sel.value;if(!(typeof botsById!=='undefined'&&botsById[cur])){cur=(typeof q!=='undefined'&&botsById[q])?q:((cfg.bots[0]||{}).id||'geeko');try{sel.value=cur;}catch(e){}}
  var L=lireSeances(cur),actif=sessionActiveId(cur),htm='';
  if(!L.length)htm='<div style="color:#8f96bd" data-i18n="viartificial-labs/conversation.html_aucune_séance_pour_ce_bot_écris_un_messa_10">Aucune séance pour ce bot. Écris un message ou crée une séance.</div>';
  L.forEach(function(s){if(!s)return;var nb=(s.messages||[]).filter(function(m){return m&&(m.role==='user'||m.role==='assistant');}).length;var d='';try{d=new Date(s.updatedAt||s.createdAt||Date.now()).toLocaleString();}catch(e){}var estAct=(s.id===actif);htm+='<div style="display:flex;gap:8px;align-items:center;margin:6px 0;padding:8px 10px;border:1px solid '+(estAct?'#27d17f':'rgba(255,255,255,.12)')+';border-radius:10px" data-i18n="viartificial-labs/conversation.html_eschstitreséanceestact_active_11"><div style="flex:1;min-width:0"><div style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+escH(s.titre||'Séance')+(estAct?' · active':'')+'</div><div style="font-size:.78rem;color:#8f96bd" data-i18n="viartificial-labs/conversation.html_nb_messages_eschd_slangue_12">'+nb+' message(s) · '+escH(d)+' · '+(s.langue||'?')+'</div></div>'+(estAct?'':'<button data-i18n="viartificial-labs_reprendre" type="button" data-sess-bot="'+escH(cur)+'" data-sess-id="'+escH(s.id)+'" style="min-height:44px;border-radius:999px;border:1px solid #ffd23f;background:transparent;color:#ffd23f;padding:8px 14px">Reprendre</button>')+'</div>';});
  box.innerHTML=htm;
  var btns=box.querySelectorAll('[data-sess-id]');for(var i=0;i<btns.length;i++)(function(el){el.onclick=function(){reprendreSeance(el.getAttribute('data-sess-bot'),el.getAttribute('data-sess-id'));};})(btns[i]);
}catch(e){}}
// Migration unique : les anciens 'via-conv-<bot>' deviennent UNE séance
// archivée consultable, jamais réinjectée ; les clés historiques sont retirées.
function migrerAnciennesConvs(){try{(cfg.bots||[]).forEach(function(b){var id=b.id,raw=null;try{raw=localStorage.getItem('via-conv-'+id);}catch(e){}if(raw==null)return;var arr=null;try{arr=JSON.parse(raw);}catch(e){}try{localStorage.removeItem('via-conv-'+id);}catch(e){}if(!Array.isArray(arr)||!arr.length)return;var L=lireSeances(id);for(var i=0;i<L.length;i++)if(L[i]&&(L[i].id==='s-legacy'))return;var lg='fr';try{lg=localStorage.getItem('via-langue-'+id)||'fr';}catch(e){}L.unshift({id:'s-legacy',titre:'Conversation précédente',messages:arr.slice(-40),langue:lg,createdAt:Date.now(),updatedAt:Date.now()});ecrireSeances(id,L.slice(0,20));});}catch(e){}}
function xreadOn(){try{return localStorage.getItem('via-xread')!=='off';}catch(e){return true;}}
// Synergetizer minimal : le binôme Geeko↔Geekette se relit (une phrase max).
// Strict : une seule intervention par message, jamais de réponse à une réponse,
// jamais si le binôme a déjà répondu. Silence en cas d'échec (pas de remplissage).
function xreadTouch(item,dernierTexte){
  // Relecture interne 093-095 (lecture seule) : le binôme relit SANS générer,
  // SANS parler à l'utilisateur, SANS écrire ses mémoires ni les mélanger.
  // Analyse locale de la réponse produite contre les souvenirs classés du
  // binôme ; trace interne uniquement. Aucun appel moteur, aucun affichage.
  if(typeof xreadOn==='function'?!xreadOn():false)return Promise.resolve();
  if(typeof q==='undefined'||(q!=='geeko'&&q!=='geekette'))return Promise.resolve();
  var pid=q==='geeko'?'geekette':'geeko';
  var bot=(typeof botsById!=='undefined')?botsById[pid]:null;if(!bot)return Promise.resolve();
  var h=H(pid); // lecture seule : jamais de push ici.
  // Garde anti-mélange : la langue persistée du binôme est restaurée intacte
  // après relecture (blmLangue écrit via-langue-<bot>).
  var cleLangue='via-langue-'+pid,memLangue=null;
  try{memLangue=localStorage.getItem(cleLangue);}catch(xL){}
  var etatX=null;
  try{etatX=orchestrerBLM(item.text,bot,h);}catch(e){try{if(memLangue!==null)localStorage.setItem(cleLangue,memLangue);}catch(xR){}return Promise.resolve();}
  try{if(memLangue!==null)localStorage.setItem(cleLangue,memLangue);}catch(xR){}
  var txt=String(dernierTexte==null?'':dernierTexte).trim();
  if(!txt)return Promise.resolve();
  var coh={verdict:'non-evalue',motifs:[],redemandes:[],indices:null};
  try{if(window.BLMCoherence&&window.BLMCoherence.analyser)coh=window.BLMCoherence.analyser(etatX,txt)||coh;}catch(e){coh={verdict:'non-evalue',motifs:['coherence-erreur'],redemandes:[],indices:null};}
  try{if(window.BLMContrat)window.BLMContrat.tracer(etatX,'xread','lecture-seule-'+coh.verdict,coh.motifs.join(',')||'sans-motif');}catch(e){}
  try{if(window.BLMJournal)window.BLMJournal.consigner({bot:pid,issue:'succes',motif:'relecture-interne',verdict:coh.verdict,session:(function(){try{return sessionActiveId(pid)||'';}catch(e){return '';}})(),redemandes:(etatX&&etatX.redemandes?etatX.redemandes.length:0)});}catch(e){}
  return Promise.resolve();
}
// Carte d'identité locale (token automatique) : modèle, chargements, accord.
// Rien ne quitte l'appareil : aucun serveur, aucun compte.
function updateIdCard(){
  var key='via-idcard',card=null;
  try{card=JSON.parse(localStorage.getItem(key)||'null');}catch(e){card=null;}
  var now=new Date(),p=function(n){return ('0'+n).slice(-2);};
  var stamp=now.getFullYear()+'-'+p(now.getMonth()+1)+'-'+p(now.getDate())+' '+p(now.getHours())+':'+p(now.getMinutes());
  var sm={};try{sm=ViaLocalEngine.summary();}catch(e){}
  var model=sm.model;
  // Aucun modèle local réellement chargé : ne pas inventer un chargement ni
  // afficher SmolLM2 quand un moteur distant est sélectionné.
  if(!model){paintIdCard();return;}
  if(!card||!card.token){var hh=0,s=model+stamp;for(var i=0;i<s.length;i++)hh=(hh*31+s.charCodeAt(i))>>>0;card={token:'VIA-'+hh.toString(36).toUpperCase(),firstLoaded:stamp,loads:0};}
  card.model=model;card.lastLoaded=stamp;card.loads=(card.loads||0)+1;
  try{localStorage.setItem(key,JSON.stringify(card));}catch(e){}
  paintIdCard(card);
}
function paintIdCard(card){
  try{if(!card)card=JSON.parse(localStorage.getItem('via-idcard')||'null');}catch(e){card=null;}
  var t=document.getElementById('idcToken');if(t)t.textContent=card?card.token:'—';
  var er={};try{er=etatMoteurReel();}catch(e){}
  var m=document.getElementById('idcModel');if(m)m.textContent=(er.model||'—');
  var l=document.getElementById('idcLoaded');if(l)l.textContent=(er.label||'?')+' — '+(er.etat||'?')+(card?(' · dernier chargement local : '+card.lastLoaded+' ('+card.loads+' chargement(s))'):'');
  var c0=null;try{c0=JSON.parse(localStorage.getItem(ViaLocalEngine.CONSENT_KEY||'via-consent')||'null');}catch(e){}
  var cs=document.getElementById('idcConsent');if(cs)cs.textContent=(c0&&c0.ts)?new Date(c0.ts).toLocaleString():'—';
}
function runRemote(item){
  var choixR=choisirParleur(selectedBots,item.text);
  var b0=botsById[choixR.id]||botsById[q]||botsById[selectedBots[0]];
  var mode=lireMode();
  if((eng.provider==='ollama'||eng.provider==='custom')&&!String(eng.baseUrl||'').trim()){
    if(mode==='hybride'&&ViaLocalEngine.getConsent()==='granted'&&!item.repliLocal){
      addOnce('sys','Hybride : aucun serveur en ligne configuré — bascule sur le moteur local.');
      eng={provider:'local',baseUrl:'',model:''};try{ViaProviders.save(eng);}catch(e0){}
      item.repliLocal=true;
      try{fillSettings();}catch(e1){}
      afficherMoteurUtilise('hybride — repli local');
      return runItem(item);
    }
    addOnce('sys','Aucun serveur LLM configuré (BLM : '+etiquetteBLM()+'). Renseigne une adresse réellement joignable dans Réglages, ou choisis le moteur local disponible.');setState('idle');afficherMoteurUtilise('aucun serveur en ligne');working=false;return Promise.resolve();
  }
  // BLM 066 : le moteur réellement appelé est celui de resoudreMoteur.
  var rmDistant=(window.BLMCos&&window.BLMCos.resoudreMoteur)?window.BLMCos.resoudreMoteur({fournisseur:eng.provider,ollamaUrl:eng.baseUrl,gpuDemande:false}):{moteur:eng.provider+'-distant',repli:'',physique:true};
  if(rmDistant.moteur==='aucun'){addOnce('sys','Erreur : '+rmDistant.repli+'. BLM : '+etiquetteBLM()+'.');setState('error',rmDistant.repli);lastFailure={stage:'response',item:item};working=false;return Promise.resolve();}
  setState('responding',b0.name);
  var wait=addWait(b0);
  genCtl=new AbortController();
  var key=document.getElementById('pKey').value||null;try{var _seR=assurerSeance(b0.id);if(_seR&&!item.sessionId)item.sessionId=_seR.id;}catch(xSR){}var h=H(b0.id);h.push({role:'user',content:item.text});
  var orchR=orchestrerBLM(item.text,b0,h);
  try{if(window.BLMContrat){BLMContrat.tracer(orchR,'registre','selection-'+b0.id,choixR.motif||'choix-distant');BLMContrat.tracer(orchR,'parcours','requete-'+(item.id||'?'),b0.id);}}catch(xSelR){}
  var prepR=preparerEntreeMoteur(orchR,item.text,b0);
  if(!prepR.ok){wait.remove();addOnce('sys','Erreur : '+prepR.message);lastFailure={stage:'response',item:item};setState('error',prepR.message);return Promise.resolve();}
  try{window.__viaDernierParcours=(eng.provider==='ollama'?'Ollama':(eng.provider==='custom'?'Endpoint compatible OpenAI':eng.provider))+' · '+b0.name+' · intention '+((orchR&&orchR.intention)||'?')+' · '+((prepR.msgs||[]).length)+' message(s) · BLM '+etiquetteBLM();if(typeof paintEngineStatus==='function')paintEngineStatus();}catch(xPR){}
  return ViaProviders.chat(eng,b0,prepR.msgs,genCtl.signal,key).then(function(r){
    try{if(item.sessionId){var _curR=null;try{_curR=sessionActiveId(b0.id);}catch(e){}if(_curR&&_curR!==item.sessionId){wait.remove();try{if(window.BLMContrat)BLMContrat.tracer(orchR,'parcours','reponse-ignoree-seance-fermee',String(item.sessionId));}catch(xT){}genCtl=null;return;}}}catch(e){}
    r=blmCorrigerReponse(orchR,r);
    r=verifierFinaleBLM(orchR,r);
    window.__viaLLMVerifie=true;window.__viaLLMVerifieKey=cfgKey(eng);
    llmStatus={provider:eng.provider,baseUrl:eng.baseUrl||'',model:eng.model||'',state:'ok',detail:'réponse réellement reçue',at:Date.now()};
    wait.remove();var moteurDistant=(eng.provider==='ollama'?'Ollama distant (réseau)':(eng.provider==='custom'?'Endpoint distant (réseau)':eng.provider));addPulsed(b0,r,moteurDistant);setState('ready');lastFailure=null;finaliserSortie(b0,h,r,orchR,'succes',item.id||'parcours-standard');afficherMoteurUtilise('réponse en ligne');
  },function(e){
    wait.remove();
    if((e&&e.code)==='ABORTED'){add('sys','Réponse annulée à ta demande.');}
    else{
      if(mode==='hybride'&&ViaLocalEngine.getConsent()==='granted'&&!item.repliLocal){
        try{if(h.length&&h[h.length-1]&&h[h.length-1].role==='user'&&h[h.length-1].content===item.text)h.pop();}catch(xH){}
        addOnce('sys','Hybride : le serveur en ligne a échoué ('+String((e&&e.code)||'erreur')+') — bascule sur le moteur local.');
        eng={provider:'local',baseUrl:'',model:''};try{ViaProviders.save(eng);}catch(xS){}
        item.repliLocal=true;
        try{fillSettings();}catch(xF){}
        afficherMoteurUtilise('hybride — repli local après échec en ligne');
        setState('checking');
        return demarrerMoteurLocal('repli hybride').then(function(){return runItem(item);});
      }
      if(mode==='online')addOnce('sys','Mode en ligne : aucun repli automatique vers le local. Change de mode ou vérifie l’adresse dans Réglages (Avancé).');
      if((e&&e.code)==='NOT_LOADED'&&ViaLocalEngine.getConsent()!=='granted')consentShown(true);
      var msg='Erreur : '+explain(e);if(eng.provider==='ollama'&&e&&e.code==='HTTP_405')msg+=' — POST refusé : cette adresse ne répond pas comme une API Ollama (URL et corps affichés ci-dessus). Choix : adresse d’un serveur réellement joignable, ou moteur local.';addOnce('sys',msg);lastFailure={stage:'response',item:item};setState('error',explain(e));try{if(window.BLMJournal)window.BLMJournal.consigner({bot:b0.id,issue:'erreur',motif:String((e&&e.code)||(e&&e.name)||'moteur'),verdict:'',redemandes:(orchR&&orchR.redemandes?orchR.redemandes.length:0)});}catch(ex){}
    }
  }).then(function(){genCtl=null;});
}
// Diagnostic serveur depuis le téléphone : sonde la racine (Ollama répond
// « Ollama is running ») et /api/tags ({"models":...}). Identifie qui répond
// vraiment : Ollama, un autre service, ou rien (mauvais Wi-Fi/IP/port/pare-feu).
function diagServeur(base){
  var root=String(base||'').replace(/\/$/,'');
  function sonde(url){return fetch(url,{method:'GET',cache:'no-store'}).then(function(r){return r.text().then(function(t){var srv='';try{srv=r.headers.get('server')||'';}catch(e){}return {url:url,status:r.status,server:srv,body:String(t||'').slice(0,200)};});}).catch(function(e){return {url:url,erreur:(e&&e.name)||'injoignable'};});}
  return Promise.all([sonde(root+'/'),sonde(root+'/api/tags')]).then(function(rs){return {racine:rs[0],tags:rs[1]};});
}
// Salutation + « ça va » = ouverture conviviale : réponse directe vérifiée, sans moteur.
// Évite que le mini-modèle local et l'historique brut détournent la réponse.
function estSalutation(t){try{if(window.BLMUsages&&window.BLMUsages.distinguerDemande){var _dt=window.BLMUsages.distinguerDemande(t);if(_dt==='salutation-simple'||_dt==='question-sociale')return true;}}catch(x){}if(window.BLMComprehension&&BLMComprehension.detecterIntention)return BLMComprehension.detecterIntention(t)==='salutation';var s=String(t||'').trim();return /^(salut|bonjour|bonsoir|coucou|hello|yo|hey)[,!.\s]*/i.test(s)&&/ça va|ca va|comment (tu vas|vas-tu)|vous allez|la forme|quoi de neuf|how are you/i.test(s);}
function reponseSalutation(){return 'Salut ! Ravi de te voir 😊';}
// Réponse sociale (usages) : formule habituelle brève + relance, un seul texte.
// Repli sur reponseSalutation si le module est absent. Personnalités intactes.
function reponseSociale(bot,texte,langue){var dt='salutation-simple';try{if(window.BLMUsages&&window.BLMUsages.distinguerDemande)dt=window.BLMUsages.distinguerDemande(texte)||dt;}catch(xD){}try{if(window.BLMUsages&&window.BLMUsages.choisirFormule){var f=window.BLMUsages.choisirFormule(dt,langue||'fr',texte);if(f&&f.formule){if(window.BLMUsages.doserChaleur){var d=window.BLMUsages.doserChaleur(f,langue||'fr',dt);if(!d.ok){if(window.console&&console.warn)console.warn('[096] formule recadrée ('+d.motif+') : repli formule vérifiée');}else return f.formule;}else return f.formule;}}}catch(x){}return reponseSalutation();}
// --- Orchestrateur BLM du parcours réel (modules src/ chargés ci-dessus) ---
// 1 compréhension (intention) → 2 contexte (souvenirs classés) → 3 langue →
// 4 formulation (moteur ou modèle direct) → 5 vérification finale (BLMPhilo).
// Chaque étape reçoit l'objet de la précédente et l'enrichit.
function langueMessageLocal(t){var s=String(t||'');if(/[àâäéèêëîïôöùûüç]/i.test(s))return 'fr';if(/\b(le|la|les|des|est|une|vous|tu|que|pour|comment|avec)\b/i.test(s))return 'fr';if(/\b(hello|how|are|you|the|and|what|thanks|please|morning|today|with|for)\b/i.test(s))return 'en';return 'fr';}
function souvenirsPertinents(botId,h,texteCourant){
  if(!window.BLMMemoire)return [];
  var M=window.BLMMemoire,projet=String(botId||'courant'),base,courant=String(texteCourant||'').trim();
  try{base=(M.filtrerEchanges?M.filtrerEchanges(h||[]):(h||[]).filter(function(m){return m&&(m.role==='user'||m.role==='assistant')&&String(m.content||'').trim();})).filter(function(m){return String((m&&m.content)||'').trim()!==courant;}).slice(-8);}catch(e){base=[];}
  var mem=base.map(function(m){var txt=String(m.content||'').slice(0,500),inten=m.role==='user'?'demande':'reponse';
    try{if(M.classerEchange)return M.classerEchange(projet,inten,txt);}catch(e){}
    return M.classerSouvenir({projet:projet,intention:inten,type:'evolution',texte:txt,statut:'actif'});});
  try{if(M.souvenirsDuCarnet&&typeof ViaMemory!=='undefined'&&ViaMemory.entries){var car=M.souvenirsDuCarnet(ViaMemory.entries(projet),projet);if(car&&car.length)mem=mem.concat(car);}}catch(e){}
  try{if(M.sansProfilDeduit){mem=mem.filter(function(m){try{return M.sansProfilDeduit(m);}catch(x){return true;}});}}catch(e){}
  try{
    if(M.recupererPertinents)return M.recupererPertinents(mem,projet,texteCourant||'',8);
    return M.restaurerSurLancement(mem,{app:projet});
  }catch(e){return mem;}
}
// --- État commun BLM : circule entre les blocs, chacun l'enrichit ---
// intention, contexte utile, langue, relations, temps, causes, ton,
// contraintes, certitude ; un bloc peut signaler une contradiction ou
// demander une nouvelle analyse (redemandes).
function etatInitial(texte,bot){
  // Socle étape 1 : forme imposée par le contrat versionné quand il est chargé.
  if(window.BLMContrat&&BLMContrat.etatInitial)return BLMContrat.etatInitial(texte,bot&&bot.id);
  return {texte:String(texte||''),botId:bot&&bot.id,intention:null,contexte:[],langue:null,relations:[],temps:null,causes:[],ton:'neutre',contraintes:['tutoiement, jamais de « vous »','pas de preuve de conscience','réponse courte, une relance si salutation'],certitude:0.5,contradictions:[],redemandes:[],sujet:null,demandes:[],ton_percu:'neutre',doute:false,perimetre:true,tronque:false,melange:false};
}
function blmComprehension(etat){
  if(window.BLMComprehension){var C=window.BLMComprehension;etat.intention=C.detecterIntention(etat.texte);var that=etat;C.extraireCauses(etat.texte).forEach(function(c){that.causes.push(c);});var tp=C.extraireTemps(etat.texte);if(tp)etat.temps=tp;C.extraireRelations(etat.texte,etat.intention).forEach(function(r){that.relations.push(r);});
    try{
      if(C.tronquerTexte){var tr=C.tronquerTexte(etat.texte,2000);etat.texte=tr.texte;etat.tronque=tr.tronque;if(tr.tronque&&window.BLMContrat)BLMContrat.tracer(etat,'comprehension','longueur-plafonnee','2000c');}
      if(C.extraireEntites){var en=C.extraireEntites(etat.texte);if(en.length)etat.sujet=en.join(' ');}
      if(C.extraireDemandes){var dq=C.extraireDemandes(etat.texte);dq.forEach(function(x){that.demandes.push(x);});}
      if(C.detecterSentiment)etat.ton_percu=C.detecterSentiment(etat.texte);
      if(C.detecterAmbiguite){etat.doute=C.detecterAmbiguite(etat.texte);if(etat.doute&&window.BLMContrat)BLMContrat.tracer(etat,'comprehension','ambiguite-signalee','doute');}
      if(C.dansPerimetre){etat.perimetre=C.dansPerimetre(etat.texte);if(!etat.perimetre&&window.BLMContrat)BLMContrat.tracer(etat,'comprehension','hors-perimetre','repli-poli');}
      if(window.BLMContrat)BLMContrat.tracer(etat,'comprehension','intention-'+etat.intention,'champs-023-028');
    }catch(e){}
    return etat;}
  var t=etat.texte,m=t.toLowerCase();
  etat.intention=estSalutation(t)?'salutation':(/\?\s*$/.test(t.trim())?'question':'message');
  if(/parce que|puisque|donc|alors|\bcar\b|grace à|à cause/.test(m))etat.causes.push('cause-marquee');
  if(/demain|hier|aujourd|ce soir|bientôt|la semaine/.test(m))etat.temps='mention-temporelle';
  if(etat.intention==='salutation')etat.relations.push('salutation->etat-personnel');
  if(/et\b.*\?/.test(m))etat.relations.push('multi-idees');
  if(String(t).length>2000){etat.texte=String(t).slice(0,2000);etat.tronque=true;}
  var mots=String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/[^a-z0-9]+/).filter(function(w){return w.length>=4;});
  if(mots.length)etat.sujet=mots.slice(0,5).join(' ');
  if(/(au revoir|adieu|bonne nuit|\bbye\b)/i.test(t)&&/^(salut|bonjour|bonsoir|coucou|hello|yo|hey)\b/i.test(t.trim()))etat.doute=true;
  if(/(medicament|dosage|ordonnance|avocat|juridique|tribunal)/i.test(t.normalize? t.normalize('NFD').replace(/[\u0300-\u036f]/g,''):t))etat.perimetre=false;
  return etat;}
function blmMemoire(etat,h){etat.contexte=souvenirsPertinents(etat.botId,h,etat.texte);try{if(window.BLMSavoir&&window.BLMSavoir.chercherFait){var fz=window.BLMSavoir.chercherFait(etat.sujet||'',window.BLMSavoirBase||{faits:{}});etat.faits=fz?[fz]:[];}}catch(e){}return etat;}
function blmLangue(etat){var lg=(window.BLMLangue&&BLMLangue.detecterLangue)?BLMLangue.detecterLangue(etat.texte):langueMessageLocal(etat.texte);
  var botId=etat.botId||'courant';
  try{
    var s=String(etat.texte||'');
    var frM=/[àâäéèêëîïôöùûüç]/i.test(s)||/\b(le|la|les|des|est|une|vous|tu|que|pour|comment|avec|bonjour|merci)\b/i.test(s);
    var enM=/\b(hello|how|are|you|the|and|what|thanks|please|morning|today|with|for|your|good|know|time|work|need|like|think)\b/i.test(s);
    var mem=null;try{mem=localStorage.getItem('via-langue-'+botId);}catch(x){}
    var sessLg=null;
    try{var _m0=JSON.parse(localStorage.getItem('via-seances-actives')||'{}');var _sid0=_m0[botId];if(_sid0){var _L0=JSON.parse(localStorage.getItem('via-seances-'+botId)||'[]');for(var _k=0;_k<_L0.length;_k++){var _s=_L0[_k];if(_s&&_s.id===_sid0&&(_s.langue==='fr'||_s.langue==='en')){sessLg=_s.langue;break;}}}}catch(x){}
    if(enM&&!frM){lg='en';try{localStorage.setItem('via-langue-'+botId,'en');}catch(x){}}
    else if(frM){lg='fr';try{localStorage.setItem('via-langue-'+botId,'fr');}catch(x){}}
    else if(sessLg){lg=sessLg;}
    else if(mem==='en'||mem==='fr'){lg=mem;}
  }catch(x){}
  etat.langue=lg;
  try{var _sid2=null;try{var _m2=JSON.parse(localStorage.getItem('via-seances-actives')||'{}');_sid2=_m2[botId];}catch(x){}if(_sid2){var _L2=[];try{_L2=JSON.parse(localStorage.getItem('via-seances-'+botId)||'[]');}catch(x){}for(var _j=0;_j<_L2.length;_j++){if(_L2[_j]&&_L2[_j].id===_sid2&&_L2[_j].langue!==lg){_L2[_j].langue=lg;_L2[_j].updatedAt=Date.now();try{localStorage.setItem('via-seances-'+botId,JSON.stringify(_L2));}catch(x){}break;}}}}catch(x){}
  try{if(window.BLMLangue&&BLMLangue.detecterMelange){etat.melange=BLMLangue.detecterMelange(etat.texte);}else{var s2=String(etat.texte||'');var fr2=(s2.match(/[àâäéèêëîïôöùûüç]/gi)||[]).length;var en2=(s2.match(/\b(hello|how|are|you|the|and|what|thanks|today|with|for)\b/gi)||[]).length;etat.melange=fr2>=1&&en2>=2;}}catch(e){}return etat;}
function blmTon(etat,bot){if(window.BLMRegistre&&BLMRegistre.choisirTon){etat.ton=BLMRegistre.choisirTon(bot&&bot.personality,etat.intention);return etat;}var p=String((bot&&bot.personality)||'');etat.ton=/drôle|fun|taquin|iron|enjoué/i.test(p)?'enjoue':'neutre';if(etat.intention==='salutation')etat.ton='convivial';return etat;}
function blmCertitude(etat){etat.certitude=etat.intention==='salutation'?0.95:(etat.contexte.length?0.7:0.5);return etat;}
// --- Parcours global (PARCOURS blm-equipe.js) : handoffs via COS existantes,
// sélection d'un seul SuperBot, sortie unique. Les dictionnaires et notes
// internes ne deviennent jamais le texte affiché.
function relierEtape(etat,deId,versId,etape){
  // Handoff inter-étapes : résolu + compatible → tracé cos ; sinon simple
  // trace d'étape (jamais de lien inventé).
  try{
    if(window.COSLangage&&window.COSLangage.resoudreId&&window.COSLangage.compatible){
      var a=window.COSLangage.resoudreId(deId,{}),b=window.COSLangage.resoudreId(versId,{});
      var c=window.COSLangage.compatible(a,b);
      if(window.BLMContrat)BLMContrat.tracer(etat,'cos','etape-'+(c.ok?'ok':'signalee'),deId+'→'+versId+' ('+etape+', '+(c.ok?c.motif:(c.motif||'non-resolu'))+')');
      return c.ok;
    }
  }catch(x){}
  try{if(window.BLMContrat)BLMContrat.tracer(etat,'parcours',etape,deId+'→'+versId);}catch(y){}
  return false;
}
function choisirParleur(ids,texte){
  // Orchestrateur de sélection : un seul bot parle. Priorité explicite SEULEMENT
  // si la demande la contient (?bot= présent dans l'URL et bot connu) ; sinon
  // mémoires pertinentes (noterPertinence), puis chevauchement mots/tags des
  // fiches COS ; égalité persistante → ordre des chips. Personnalités et
  // mémoires intactes.
  var liste=(ids||[]).filter(function(id){return typeof botsById!=='undefined'&&botsById[id];});
  if(!liste.length) return {id:(ids||[])[0]||null,motif:'aucun'};
  if(liste.length===1) return {id:liste[0],motif:'choix-unique'};
  var demandeExplicite=null;
  try{if(typeof location!=='undefined'&&location.search&&botsById){var pb=new URLSearchParams(location.search).get('bot');if(pb&&liste.indexOf(pb)>=0)demandeExplicite=pb;}}catch(xQ){}
  if(demandeExplicite) return {id:demandeExplicite,motif:'choix-explicite-demande'};
  try{
    if(window.BLMEquipe&&window.BLMEquipe.choisirSuperBot&&window.BLMMemoire&&window.BLMMemoire.recupererPertinents&&window.BLMMemoire.classerEchange){
      // Fiches SuperBots (cos.js : grammaire + gardes) : validation + mots/tags
      // pour départager une égalité de mémoires. Rien d'inventé.
      // Fiches via la GRAMMAIRE cos UNIQUEMENT (lireBlocCo sur représentation
      // générée de bots.json, source unique). Échec de parse → fiche invalide
      // (null) + trace, JAMAIS de producteur de repli : une seule grammaire,
      // un seul parseur, pas de divergence silencieuse.
      var fiches={};try{if(window.COSFiches&&window.COSFiches.ficheDepuisBloc){liste.forEach(function(id){try{var fb=window.COSFiches.ficheDepuisBloc(botsById[id]);if(fb&&fb.fiche){fiches[id]=fb.fiche;}else{fiches[id]=null;if(window.console&&console.warn)console.warn('[registre] fiche COS illisible pour '+id+' : '+((fb&&fb.erreurs||[]).join(';')||'inconnue')+' — fiche écartée, mémoire seule');}}catch(xFb){fiches[id]=null;if(window.console&&console.warn)console.warn('[registre] fiche COS en erreur pour '+id+' — fiche écartée, mémoire seule');}});var presents=liste.filter(function(id){return fiches[id];});var vr=window.COSFiches.validerRegistre(presents.map(function(id){return fiches[id];}));if(window.BLMContrat&&(!vr.ok)&&window.console&&console.warn)console.warn('[registre] fiches invalides : '+vr.erreurs.join(';'));} }catch(xF){}
      var motsSujet=(function(s){try{return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/[^a-z0-9]+/).filter(function(w){return w.length>=4;});}catch(x){return [];}})(texte);
      var scores=liste.map(function(id){
        var base=[];try{base=window.BLMMemoire.filtrerEchanges?window.BLMMemoire.filtrerEchanges(H(id)).slice(-8):(H(id)||[]).filter(function(m){return m&&(m.role==='user'||m.role==='assistant');}).slice(-8);}catch(x){}
        var mem=base.map(function(m){try{return window.BLMMemoire.classerEchange(id,m.role==='user'?'demande':'reponse',String(m.content||'').slice(0,500));}catch(y){return null;}}).filter(Boolean);
        var pts=0;try{pts=window.BLMMemoire.recupererPertinents(mem,id,texte||'',8).length;}catch(z){}
        var ov=0;try{if(window.COSFiches&&window.COSFiches.chevauchement&&fiches[id])ov=window.COSFiches.chevauchement(fiches[id],motsSujet);}catch(xO){}
        return {id:id,points:pts,chevauchement:ov,motif:pts>0?('memoires-pertinentes-'+pts):(ov>0?('fiche-mots-'+ov):'aucune-memoire-pertinente')};
      });
      var ch=window.BLMEquipe.choisirSuperBot(liste,scores);
      if(ch&&ch.id&&botsById[ch.id]) return ch;
    }
  }catch(x){}
  return {id:liste[0],motif:'defaut-premier-choisi'};
}
function finaliserSortie(bot,h,reponse,orch,issue,motif){
  // Orchestrateur de sortie (006) : un seul texte, journal sans brut, sauvegarde.
  // La réponse est rattachée à la séance active (sessionId) en plus du bot.
  var sessId='';try{sessId=sessionActiveId(bot.id)||'';}catch(e){}
  h.push({role:'assistant',content:reponse});
  try{saveConv(bot.id);}catch(e){}
  try{if(window.BLMContrat)BLMContrat.tracer(orch||{},'parcours','sortie-006',issue||'succes');}catch(e){}
  try{if(window.BLMJournal)window.BLMJournal.consigner({bot:bot.id,issue:issue||'succes',motif:String(motif||''),verdict:'affiche',session:sessId,redemandes:(orch&&orch.redemandes?orch.redemandes.length:0)});}catch(e){}
}
function orchestrerBLM(texte,bot,h){
  var e=etatInitial(texte,bot);
  blmComprehension(e);
  // Parcours : entrée (001). Nœuds : seules les ressources physiques sont
  // déclarées (jamais un nœud logique comme actif).
  try{if(window.BLMContrat)BLMContrat.tracer(e,'parcours','entree-001',e.botId||'?');}catch(err0){}
  try{if(window.BLMNoeuds&&window.BLMNoeuds.ressourcesPhysiques){var rn=window.BLMNoeuds.ressourcesPhysiques().map(function(n){return n.id+':'+n.etat;});if(window.BLMContrat)BLMContrat.tracer(e,'noeuds','ressources-physiques-seules',rn.join(','));}}catch(errN){}
  // USAGES (blm-usages.js) : 1 reconnaissance (salut simple vs explication
  // linguistique vs ordinaire), 2 coutumes (formule interne, dicos en aide
  // jamais récitée), 3 suite attendue (interne, jamais affichée).
  // Salut simple → intention salutation + formule directe, sans moteur.
  try{if(window.BLMUsages&&BLMUsages.distinguerDemande){e.demandeType=BLMUsages.distinguerDemande(e.texte);if(window.BLMContrat)BLMContrat.tracer(e,'comprehension','demande-'+e.demandeType,'019-028');
    if(e.demandeType==='salutation-simple'){e.intention='salutation';}
    if(e.demandeType==='explication-linguistique'&&window.BLMSavoir&&window.BLMSavoir.definirMot){var mots=(e.sujet||'').split(' ').filter(function(w){return w;});var def=window.BLMSavoir.definirMot(mots[0]||'',window.BLMSavoirBase||{definitions:{}});if(def){e.faits=(e.faits||[]).concat([{texte:String(def).slice(0,300),source:'dico-local (aide interne, jamais récité)'}]);if(window.BLMContrat)BLMContrat.tracer(e,'savoir','aide-interne-046','1-fait-etiquete');}}
  }}catch(errU){}
  try{if(window.BLMRoutage&&BLMRoutage.planifierBlocs){var pl=BLMRoutage.planifierBlocs(e.intention,{perimetre:e.perimetre});if(window.BLMContrat)BLMContrat.tracer(e,'routage','plan-'+pl.motif,pl.blocs.join(','));relierEtape(e,'001','002','orchestrateur-entree');}}catch(err){}
  blmMemoire(e,h);blmLangue(e);blmTon(e,bot);blmCertitude(e);
  // Formation (module optionnel, absent du dépôt : garde silencieuse ; jamais
  // de texte intégral, jamais de récitation : au plus des ancres étiquetées
  // avec source, dans la limite des faits).
  try{if(window.BLMFormation&&window.BLMFormation.recuperer){var _b0=null;try{_b0=(typeof botsById!=='undefined')?botsById[e.botId]:null;}catch(xB){}var _reste=Math.max(0,2-((e.faits||[]).length));if(_reste>0){var _fm=window.BLMFormation.recuperer({sujet:e.sujet||'',langue:e.langue||'fr',bot:_b0||{id:e.botId},max:_reste});if(_fm&&_fm.length){_fm.forEach(function(f){e.faits.push({texte:String(f.resume||'').slice(0,300),source:String(f.source||'formation').slice(0,120)});});if(window.BLMContrat)BLMContrat.tracer(e,'savoir','formation-'+_fm.length+'-extraits',_fm.map(function(f){return f.id;}).join(','));}}}}catch(errF2){}
  // Formule + suite (internes, jamais affichées ni transmises au moteur) :
  // formule seulement pour le salut simple (réponse directe), suite estimée
  // pour tout message (vérification S5/S6 : relance attendue ou non).
  try{if(window.BLMUsages&&BLMUsages.estimerSuite){e.suite=BLMUsages.estimerSuite(e.demandeType,e.intention,(e.contexte||[]).length);if(BLMUsages.choisirFormule&&(e.demandeType==='salutation-simple'||e.intention==='salutation')){var fl=BLMUsages.choisirFormule('salutation-simple',e.langue||'fr',e.texte);e.formule={formule:fl.formule,relance:fl.relance,ton:fl.ton,langue:fl.langue};}if(window.BLMContrat)BLMContrat.tracer(e,'registre','suite-'+((e.suite&&e.suite.type)||'?'),e.demandeType||'?');}}catch(errF){}
  // 101/103/104/105/106 — exécution seulement si pertinent (jamais forcés) :
  // 101 candidats si ≥2 mots porteurs ; 103 contrainte traduction si verbe +
  // cible ; 104/105 aide dico partagée si linguistique + mot (1 seul appel,
  // base vide = tracé, rien d'inventé) ; 106 popularité si marqueurs d'usage
  // ou candidats (appel réel, résultat interne, jamais affiché).
  try{
    var motsSujet2=(e.sujet||'').split(' ').filter(function(w){return w;});
    if(window.BLMComprehension&&BLMComprehension.repererCandidats&&motsSujet2.length>=2){var cd=BLMComprehension.repererCandidats(e.texte,motsSujet2);if(cd&&cd.length){e.expressions=cd.slice(0,5);if(window.BLMContrat)BLMContrat.tracer(e,'comprehension','101-candidats',cd.length+'-candidats-non-verifies');}}
    if(window.BLMUsages&&BLMUsages.traductionDemandee){var tr=BLMUsages.traductionDemandee(e.texte);if(tr&&tr.demande){e.contraintes.push('traduction vers '+tr.vers+' demandée (103, via moteur, jamais de dico récité)');if(window.BLMContrat)BLMContrat.tracer(e,'registre','103-traduction-vers-'+tr.vers,'contrainte-ajoutee');}}
    if(e.demandeType==='explication-linguistique'&&window.BLMSavoir&&window.BLMSavoir.definirMot&&motsSujet2.length){var df=window.BLMSavoir.definirMot(motsSujet2[0],window.BLMSavoirBase||{definitions:{}});if(df){e.faits=(e.faits||[]).concat([{texte:String(df).slice(0,300),source:'dico-local 104/105/046 (aide interne, jamais récitée)'}]);if(window.BLMContrat)BLMContrat.tracer(e,'savoir','104-105-aide-consultee','1-fait-etiquete');}else if(window.BLMContrat){BLMContrat.tracer(e,'savoir','104-105-046-base-vide','aucune-definition-ni-invention');}}
    var usageMk=/usage|coutume|populaire|populair|expression/.test((function(s){try{return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}catch(x){return String(s||'').toLowerCase();}})(e.texte));
    if(e.demandeType==='explication-linguistique'&&(usageMk||(e.expressions||[]).length>0)&&window.BLMDicos&&window.BLMDicos.scorerPublication){var sc=window.BLMDicos.scorerPublication({},function(){return 1;});if(window.BLMContrat)BLMContrat.tracer(e,'savoir','106-popularite-'+(sc.popularite||0)+'-veracite-non-evaluee','interne-jamais-affiche');}
  }catch(errG){}
  // ÉQUIPE (blm-equipe.js) : composition tracée selon intention/périmètre —
  // jamais 100 blocs ; S2/S3/S5 = vagues logiques (PWA monothread, lecture
  // seule vérifiée), S1/S4/S6 = portes séquentielles.
  try{if(window.BLMEquipe&&BLMEquipe.composer){var eq=BLMEquipe.composer(e.intention,e.perimetre);if(window.BLMContrat)BLMContrat.tracer(e,'routage','equipe-'+eq.motif,eq.vagues.map(function(v){return v.nom+':'+v.mode;}).join(','));}}catch(err2){}
  // COS-LANGAGE (cos-langage.js) : liens du document par défaut dont les deux
  // extrémités sont mobilisées par l'équipe → tracés dans EtatMessage
  // (etat.cosLiens), ils contribuent aux garde-fous de la cohérence S5/S6.
  // Mémoires, rôles et sysPrompt restent séparés par bot ; ViA inchangée.
  try{if(window.COSLangage&&window.COSLangage.liensPourEquipe&&window.BLMEquipe&&typeof eq!=='undefined'&&eq){var bq=[];eq.vagues.forEach(function(v){(v.blocs||[]).forEach(function(b){if(bq.indexOf(b)<0)bq.push(b);});});var fq=[];try{Object.keys(window.BLMEquipe.FAMILLES_PAR_VAGUE||{}).forEach(function(vn){(window.BLMEquipe.FAMILLES_PAR_VAGUE[vn]||[]).forEach(function(f){if(fq.indexOf(f)<0)fq.push(f);});});}catch(x2){}var lr=window.COSLangage.liensPourEquipe(window.COSDefaut||'',bq,fq,eq.vagues);e.cosLiens=(lr.executes||[]).map(function(l){return l.donneur+l.op+l.receveur;});lr.executes.forEach(function(l){if(window.BLMContrat)BLMContrat.tracer(e,'cos','lien-'+l.sens+'-r'+(l.rang||'?'),l.donneur+'→'+l.receveur+' ('+(l.vague||'?')+')');});(lr.signales||[]).slice(0,4).forEach(function(sg){if(window.BLMContrat)BLMContrat.tracer(e,'cos',sg.statut,(sg.de||'')+(sg.op||' ')+(sg.vers||'')+' '+(sg.detail||''));});}}catch(err3){}
  // COS-MOTEURS : sélection inactive par défaut (spec établie = langage, pas
  // de correspondance BLM↔moteur) ; repli existant conservé.
  try{if(window.BLMCos&&BLMCos.selectionner&&window.BLMCos.estActif&&BLMCos.estActif()){var pl0=null;try{if(window.BLMRoutage&&BLMRoutage.planifierBlocs)pl0=BLMRoutage.planifierBlocs(e.intention,{perimetre:e.perimetre});}catch(x){}var bes0={fournisseur:(typeof eng!=='undefined'&&eng.provider)||'local',ollamaUrl:(typeof eng!=='undefined'&&eng.baseUrl)||'',gpuDemande:false,bot:e.botId};var sel0=BLMCos.selectionner(e,pl0||{motif:'routage-absent'},null,bes0);if(sel0){e.moteurs=sel0;if(window.BLMContrat){BLMContrat.tracer(e,'routage','cos-'+(sel0.map(function(m){return m.id;}).join(',')||'repli'),e.intention||'nulle');BLMContrat.tracer(e,'route','route-'+sel0[0].id,sel0[0].motif);}}else if(window.BLMContrat){BLMContrat.tracer(e,'routage','cos-inactif','repli-existant-conserve');}}else if(window.BLMContrat){BLMContrat.tracer(e,'routage','cos-inactif','repli-existant-conserve');}}catch(err){}
  if(window.BLMContrat){var chk=BLMContrat.valider(e);if(!chk.ok&&window.console&&console.warn)console.warn('[BLM-contrat] '+chk.problemes.join(','));try{window.__dernierEtat=chk.etat||e;if(window.console&&window.console.info&&window.__dernierEtat.cosLiens)window.console.info('[BLM+COS] intention='+(window.__dernierEtat.intention||'?')+' cosLiens='+window.__dernierEtat.cosLiens.join(' '));}catch(_){}return chk.etat||e;}
  return e;
}
// Formulation de l'entrée moteur : SEUL le contexte classé est transmis, jamais
// l'historique brut. Rôle d'origine conservé uniquement si explicitement
// enregistré et fiable (intention demande/reponse + statut actif + texte non
// vide et différent du message actuel) ; sinon, bloc mémoire clairement
// étiqueté, jamais présenté comme une citation du user ou du bot.
// Aucun souvenir pertinent → la demande actuelle seule.
// S4 — porte d'entrée unique des appels moteur (WASM + Ollama) : budget
// (005/099) puis enveloppe, puis contexte classé + savoir autorisé.
// Ne jette jamais : le refus ({ok:false}) emprunte le parcours d'erreur
// existant de l'appelant, jamais transformé en réponse réussie.
function preparerEntreeMoteur(etat, texte, bot){
  try{
    var plan=(window.BLMRoutage&&window.BLMRoutage.planifierBlocs)?window.BLMRoutage.planifierBlocs(etat.intention,{perimetre:etat.perimetre,forcerMoteur:(etat.intention==='salutation'&&eng&&eng.provider==='local'&&ViaLocalEngine&&ViaLocalEngine.summary&&ViaLocalEngine.summary().phase==='ready')}):{moteur:true,blocs:[],motif:'routage-absent'};
    var cpt=(window.BLMCouts&&window.BLMCouts.compteurDefaut)?window.BLMCouts.compteurDefaut():null;
    var cEtat=cpt?{appels:cpt.appels(),plafond:cpt.plafond()}:{appels:0,plafond:50};
    var env=(window.BLMBudget&&window.BLMBudget.calculerEnveloppe)?window.BLMBudget.calculerEnveloppe(plan,cEtat):{autorise:true,maxTokens:2048,motif:'budget-absent'};
    if(!env.autorise)return {ok:false,code:env.motif==='plafond-atteint'?'PLAFOND':'NO_ENGINE',message:env.motif==='plafond-atteint'?'Plafond d’appels moteur atteint pour cette session : repli modèle.':'Plan sans moteur : repli modèle.'};
    // 005/099 : limites tracées (budget d'entrée / plafond d'appels), jamais
    // des objectifs de vitesse. Moteur réellement choisi + son repli.
    try{if(window.BLMContrat)BLMContrat.tracer(etat,'couts','limite-'+(env.motif||'budget'),'refus-moteur-possible-repli');}catch(xL){}
    try{if(window.BLMCos&&window.BLMCos.resoudreMoteur){var rm=window.BLMCos.resoudreMoteur({fournisseur:(typeof eng!=='undefined'&&eng.provider)||'local',ollamaUrl:(typeof eng!=='undefined'&&eng.baseUrl)||'',gpuDemande:false});if(window.BLMContrat)BLMContrat.tracer(etat,'parcours','moteur-'+rm.moteur,rm.repli);}}catch(xM){}
    // COS : ordre BLM appliqué (moteurs[0] = premier appelé). Repli => refus porte.
    try{if(window.BLMCos&&BLMCos.selectionner&&window.BLMCos.estActif&&BLMCos.estActif()){var bes=(typeof eng!=='undefined')?{fournisseur:eng.provider,ollamaUrl:eng.baseUrl,gpuDemande:false,bot:etat.botId}:null;var sel=BLMCos.selectionner(etat,plan,env,bes);if(sel){etat.moteurs=sel;try{if(window.BLMContrat)BLMContrat.tracer(etat,'route','route-'+sel[0].id,sel[0].motif);}catch(xR){}if(sel.length===1&&sel[0].id==='repli')return {ok:false,code:sel[0].etat==='hors-perimetre'?'HORS_PERIMETRE':'NO_ENGINE',message:'Repli modèle ('+sel[0].motif+'), aucun moteur COS appelé.'};}}}catch(x){}
    // 110 COU-MESURES (porte S4, appel moteur uniquement) : déclare les mesures
    // réellement disponibles, jamais tokens/s, FPS/IPS, GPU ni CPU%.
    try{if(window.BLMMesures&&BLMMesures.mesuresReelles){var mm=window.BLMMesures.mesuresReelles();etat.mesures={disponibles:Object.keys(mm.disponibles||{}),indisponibles:mm.indisponibles||[]};if(window.BLMContrat)BLMContrat.tracer(etat,'couts','110-mesures-reelles',(mm.disponibles?Object.keys(mm.disponibles).length:0)+'-dispo-'+(mm.indisponibles||[]).length+'-indispo');}}catch(x110){}
    var msgs=(window.BLMMemoire&&window.BLMMemoire.formulerEntreeClasse)?window.BLMMemoire.formulerEntreeClasse((etat&&etat.contexte)||[],texte,(etat&&etat.faits)||[]):formulerEntree(etat,texte);
    msgs=msgs||[];
    // S4 : la consigne de personnalité (ViA incluse) et le contexte BLM compact
    // accompagnent CHAQUE appel moteur. Le texte brut de l'historique ne part
    // toujours pas : seuls les souvenirs classés ci-dessus sont transmis.
    var _bot=bot||((typeof botsById!=='undefined'&&etat&&etat.botId&&botsById[etat.botId])?botsById[etat.botId]:{id:'via',name:'ViA',specialty:'',personality:''});
    var _sys='';
    try{if(typeof ViaProviders!=='undefined'&&ViaProviders.sysPrompt)_sys=ViaProviders.sysPrompt(_bot);}catch(xSys){}
    if(!_sys){_sys='Tu es '+(_bot.name||'ViA')+', personnage simulé sans conscience réelle. '+(_bot.specialty||'')+' '+(_bot.personality||'')+' Réponds en français, court. Tutoie toujours, jamais de « vous ». Si on te salue, salue en retour puis pose une question.';}
    var _ctx=[];
    if(etat){
      if(etat.intention)_ctx.push('intention='+etat.intention);
      if(etat.demandeType)_ctx.push('demande='+etat.demandeType);
      if(etat.langue)_ctx.push('langue='+etat.langue);
      if(etat.ton)_ctx.push('ton='+etat.ton);
      if(etat.sujet)_ctx.push('sujet='+String(etat.sujet).slice(0,80));
      if(etat.contexte&&etat.contexte.length)_ctx.push('souvenirs='+etat.contexte.length);
      if(etat.faits&&etat.faits.length)_ctx.push('faits='+etat.faits.map(function(f){return String((f&&f.texte)||'').slice(0,60);}).join(' | '));
      if(etat.contraintes&&etat.contraintes.length)_ctx.push('contraintes='+etat.contraintes.slice(0,4).join(' ; '));
      if(etat.perimetre===false)_ctx.push('hors-perimetre=oui');
      if(etat.melange)_ctx.push('melange-linguistique=oui');
    }
    var _ctxTxt=_ctx.length?('[Contexte BLM interne — ne pas réciter : '+_ctx.join('; ')+']'):'';
    if(msgs.length&&msgs[0]&&msgs[0].role==='system'){
      if(_ctxTxt)msgs[0]={role:'system',content:String(msgs[0].content||'')+'\n'+_ctxTxt};
    }else{
      msgs=[{role:'system',content:_sys+(_ctxTxt?'\n'+_ctxTxt:'')}].concat(msgs);
    }
    if(window.BLMBudget&&window.BLMBudget.appliquerEnveloppe)msgs=window.BLMBudget.appliquerEnveloppe(msgs,env.maxTokens);
    // Orchestrateur de synthèse (065) : résultats rassemblés avant génération ;
    // LLM partagé pour formuler (068, consigne unique).
    try{relierEtape(etat,'002','065','orchestrateur-synthese');if(window.BLMContrat){BLMContrat.tracer(etat,'parcours','synthese-065','entree-classee-prete');BLMContrat.tracer(etat,'parcours','llm-partage-formulation',etat.botId||'?');}}catch(xS){}
    // 103 : la contrainte de traduction rejoint la demande (bloc étiqueté,
    // même style que les blocs mémoire) pour qu'elle parvienne au moteur.
    try{var tr103=(etat.contraintes||[]).filter(function(c){return /\(103,/.test(c);});if(tr103.length&&msgs.length){var dl=msgs[msgs.length-1];msgs[msgs.length-1]={role:dl.role,content:String(dl.content)+'\n[Consigne BLM-103 : '+tr103[0]+']'};if(window.BLMContrat)BLMContrat.tracer(etat,'raisonnement','103-consigne-transmise','demande-annotee');}}catch(x103){}
    if(cpt)cpt.compter();
    return {ok:true,msgs:msgs};
  }catch(e){return {ok:false,code:(e&&e.code)||'BUDGET',message:(e&&e.message)||'Budget moteur indisponible : repli modèle.'};}
}
function formulerEntree(etat, texteCourant){
  try{if(window.BLMMemoire&&BLMMemoire.formulerEntreeClasse)return BLMMemoire.formulerEntreeClasse((etat&&etat.contexte)||[],texteCourant,(etat&&etat.faits)||[]);}catch(e){}
  var courant = String(texteCourant||'');
  var sv = (etat && etat.contexte) || [];
  var roles = [], memoire = [];
  sv.forEach(function(m){
    var t = String((m && m.texte)||'').trim();
    if(!t || t === courant.trim()) return;
    var fiable = m && (m.intention==='demande'||m.intention==='reponse') && m.statut==='actif';
    if(fiable) roles.push({role:m.intention==='demande'?'user':'assistant', content:t});
    else memoire.push(t);
  });
  var msgs = roles.slice(-4);
  if(memoire.length) msgs.push({role:'user', content:'[Contexte mémorisé — informations passées, pas des messages actuels : '+memoire.slice(-4).join(' | ').slice(0,800)+']'});
  msgs.push({role:'user', content:courant});
  return msgs;
}
function demanderReanalyse(etat,r){
  // Redemande unique et terminale : le repli modèle ne réinvoque jamais le moteur.
  // Délégué au contrat (testé en batterie) ; repli local si module absent.
  try{if(window.BLMContrat&&window.BLMContrat.demanderReanalyse)return window.BLMContrat.demanderReanalyse(etat,r);}catch(e){}
  var o=(typeof r==='object'&&r)?r:{bloc:'formulation',motif:String(r)};
  if(!o.demande)o.demande='modele-verifie';
  o.tentative=1;
  var deja=etat.redemandes.some(function(x){
    if(x==='modele-verifie'||(x&&x.demande==='modele-verifie'))return o.demande==='modele-verifie';
    return x&&x.demande===o.demande&&x.motif===o.motif;
  });
  if(!deja)etat.redemandes.push(o);
  return etat;
}
function blmCorrigerReponse(etat,rep){
  // Correction locale après génération, avant vérification : aucun appel LLM.
  // Trace chaque règle appliquée ; en cas de doute, le texte est conservé.
  try{if(window.BLMCorrection&&BLMCorrection.corriger){var c=BLMCorrection.corriger(etat,rep);if(c&&typeof c.texte==='string'){if(window.BLMContrat&&c.corrections){var that=etat;c.corrections.forEach(function(k){BLMContrat.tracer(that,'correction',k.regle,k.avant+' → '+k.apres);});if(c.doute)BLMContrat.tracer(that,'correction','doute-conserve',String(rep));}return c.texte;}}}catch(e){}
  return String(rep==null?'':rep);
}
function verifierFinaleBLM(etat,rep){
  var s=String(rep||'').trim(),fr=etat.langue==='fr';
  // Orchestrateur de réponse (087) : un seul texte final.
  // Traçabilité requête→réponse : requestId porté par l'item, le bot et la
  // conversation (h) ; le journal consigne motif=requestId.
  try{if(window.BLMContrat)BLMContrat.tracer(etat,'parcours','reponse-087','verification-finale');}catch(xR){}
  // 109 CON-ETATS : états simulés calculés (fiction, conscienceVecue:false),
  // jamais affichés, jamais ressentis. Pertinent pour toute réponse à afficher.
  try{if(window.BLMEtats&&window.BLMEtats.etatAffectif&&s){etat.simulation=window.BLMEtats.etatAffectif({emotion:String(etat.ton_percu||'neutre'),sentiment:String(etat.sujet||'').slice(0,120),sensation:''});if(window.BLMContrat)BLMContrat.tracer(etat,'conscience','109-fiction-confirmee','calcule-sans-vecu');}}catch(x109){}
  try{if(window.BLMSecurite&&window.BLMSecurite.masquerPII){var m0=window.BLMSecurite.masquerPII(s);if(m0.texte!==s){s=m0.texte;if(window.BLMContrat)window.BLMContrat.tracer(etat,'securite','pii-masquee',m0.trouves.join(','));}}}catch(e){}
  var coh={verdict:'non-evalue',motifs:[],redemandes:[],indices:null};
  try{if(window.BLMCoherence&&BLMCoherence.analyser)coh=BLMCoherence.analyser(etat,s)||coh;}catch(e){coh={verdict:'non-evalue',motifs:['coherence-erreur'],redemandes:[],indices:null};}
  (coh.redemandes||[]).forEach(function(r){demanderReanalyse(etat,r);});
  var base={langueOk:true,grammaireOk:true,pertinent:s.length>0,repetition:false,registreOk:true,coherent:true};
  if(etat.intention==='salutation'){
    base.langueOk=!fr||/[àâäéèêëîïôöùûüç]/i.test(s)||/\b(je|tu|nous|salut|bonjour)\b/i.test(s);
    // Grammaire : majuscule + fin de phrase OU emoji final (les bots parlent
    // avec emojis ; exiger un point après 😊 serait artificiel).
    base.grammaireOk=/^[A-ZÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ]/.test(s)&&(/[.?!\…]\s*$/.test(s)||/[^A-Za-zÀ-ÿ\s.?!,…:;«»"'\-()]\s*$/.test(s));
    base.registreOk=!fr||!/\bvous\b/i.test(s);
    // Cohérence salutation : salue + (relance attendue OU bref sans
    // présupposition pour un simple « Salut » : ne pas exiger de relance là
    // où le bot répond volontairement bref ; 120 = heuristique non validée).
    var brefNonPresomptueux=(etat.demandeType==='salutation-simple')&&s.length<=120&&!/ça va bien|et toi|\bvous\b/i.test(s);
    base.coherent=/salut|bonjour|coucou|hello|ça va|comment/i.test(s)&&(/\?\s*$/.test(s)||brefNonPresomptueux);
    base.repetition=etat.contexte.some(function(m){return m.texte===s;});
  } else {
    // Vérification sujet/réponse pour tous les messages non-salutation :
    // au moins un mot-clé du sujet doit apparaître dans la réponse
    // (heuristique légère sur mots, pas de garantie sémantique complète).
    var sujetMots=(etat.sujet||'').split(' ').filter(function(w){return w.length>=3;});
    var reponseNorm=s.toLowerCase();
    try{reponseNorm=reponseNorm.normalize('NFD').replace(/[\u0300-\u036f]/g,'');}catch(e){}
    var chevauchement=0;
    sujetMots.forEach(function(w){var wn=w.toLowerCase();try{wn=wn.normalize('NFD').replace(/[\u0300-\u036f]/g,'');}catch(e){}if(reponseNorm.indexOf(wn)>=0)chevauchement++;});
    base.pertinent=chevauchement>0||sujetMots.length===0;
    base.coherent=s.length>0&&etat.contexte.every(function(m){return m.texte!==s||etat.intention!=='question';});
    // Une réponse à une question qui se termine par ? ne répond pas quand elle
    // ne fait que renvoyer la question. Une réponse qui affirme quelque chose
    // puis relance (« Oui, je parle français. Et toi ? ») reste valide.
    if(etat.intention==='question'&&/\?\s*$/.test(s.trim())&&s.trim().length>15){
      var avantQuestion=s.trim().replace(/\?\s*$/,'');
      var phraseAvant=/[.!…]\s+\S/.test(avantQuestion);
      var marqueurReponse=/\b(oui|non|si|je|j'|moi|c'est|voici|bien s[ûu]r|exact|plut[ôo]t|par exemple|il y a)\b/i.test(avantQuestion);
      if(!phraseAvant&&!marqueurReponse)base.coherent=false;
    }
    base.repetition=etat.contexte.some(function(m){return m.texte===s;});
  }
  var v={ok:true,problemes:[]};
  try{if(window.BLMPhilo)v=BLMPhilo.verifierReponse(base);}catch(e){v={ok:base.langueOk&&base.grammaireOk&&base.pertinent&&!base.repetition&&base.registreOk&&base.coherent,problemes:['repli-local']};}
  if(/salut|bonjour/i.test(s)&&/\bvous\b/i.test(s))etat.contradictions.push('vouvoiement-vs-tutoiement');
  if(coh.verdict==='doute'){if(window.console&&console.warn)console.warn('[BLM] doute : '+coh.motifs.join(',')+' — réponse conservée, signalée.');}
  var perso=false,fuite=false,tropLong=false,vecu=false;
  try{if(window.BLMConscience&&window.BLMConscience.detecterPersonnification){var dp=window.BLMConscience.detecterPersonnification(s);perso=dp.atteinte;if(perso&&window.BLMContrat)window.BLMContrat.tracer(etat,'conscience','personnification-refusee',dp.motifs.join(','));}}catch(e){}
  try{if(window.BLMConscience&&window.BLMConscience.detecterRevendicationVecu){var dv=window.BLMConscience.detecterRevendicationVecu(s);vecu=dv.atteinte;if(vecu&&window.BLMContrat)window.BLMContrat.tracer(etat,'conscience','vecu-simule-exige',dv.motifs.join(','));}}catch(e){}
  try{if(window.BLMSecurite&&window.BLMSecurite.detecterFuite){var df=window.BLMSecurite.detecterFuite(s);fuite=df.fuite;if(fuite&&window.BLMContrat)window.BLMContrat.tracer(etat,'securite','fuite-ecartee',df.motifs.join(','));}}catch(e){}
  // 059 REG-LONGUEUR (registre, étape 5, après 087) : pavé signalé → repli ;
  // réponse courte exigée par la consigne. Le seuil 2000c est le garde-fou
  // existant (027/tronque), pas un optimum.
  try{if(s.length>2000){tropLong=true;if(window.BLMContrat)window.BLMContrat.tracer(etat,'registre','059-longueur-pave-signale',String(s.length));}}catch(e){}
  var motifsEcart=(coh.motifs.concat(v.problemes).concat(perso?['personnification']:[]).concat(fuite?['fuite']:[]).concat(tropLong?['longueur']:[]).concat(vecu?['vecu-simule']:[]));
  if(coh.verdict==='incoherent'||!v.ok||etat.contradictions.length||perso||fuite||tropLong||vecu){demanderReanalyse(etat,{bloc:'formulation',motif:motifsEcart.join(',')||'reponse-écartée'});if(window.console&&console.warn)console.warn('[BLM] incohérent ('+motifsEcart.join(',')+') : modèle vérifié (tentative unique).');if(etat.intention==='salutation')return reponseSalutation();if(etat.intention==='question')return 'Je n’ai pas pu répondre à ta question. Peux-tu reformuler ?';return 'Je n’ai pas bien compris ta demande. Tu peux préciser ?';}
  return s;
}
form.addEventListener('submit',function(e){e.preventDefault();var v=input.value.trim();if(!v)return;add('me',v);input.value='';// Nouveau parcours : moteur de génération (bloc 1) — prend le relais si moteur prêt ou salutation
  if (window.ViaParcoursGeneration && typeof window.ViaParcoursGeneration.executerParcours === 'function') {
    var b = (typeof botsById !== 'undefined' && botsById[q]) || { id: 'via', name: 'ViA' };
    var estSalut = typeof estSalutation === 'function' && estSalutation(v);
    if (window.ViaParcoursGeneration.estDisponible() || estSalut) {
      window.ViaParcoursGeneration.executerParcours(v, b,
        function(reponse){ input.focus(); },
        function(err){ /* fallback : l'ancien parcours ci-dessous prend le relais */ }
      );
      input.focus();
      return;
    }
  }
  var moteurPret=eng&&eng.provider==='local'&&ViaLocalEngine&&ViaLocalEngine.summary&&ViaLocalEngine.summary().phase==='ready';if(estSalutation(v)&&!moteurPret){var chx=choisirParleur(selectedBots,v);var b=botsById[chx.id];if(b){try{assurerSeance(b.id);}catch(e){}var h=H(b.id);h.push({role:'user',content:v});var orch0=null;try{orch0=orchestrerBLM(v,b,h);}catch(e){}var r0=reponseSociale(b,v,(function(){try{return localStorage.getItem('via-langue-'+b.id)||'fr';}catch(x){return 'fr';}})());var r=r0;try{if(orch0){r=blmCorrigerReponse(orch0,r0);r=verifierFinaleBLM(orch0,r);}}catch(e){r=r0;}h.push({role:'assistant',content:r});add('bot',r,b,'réponse directe (sans moteur)');saveConv(b.id);try{if(window.BLMJournal)window.BLMJournal.consigner({bot:b.id,issue:'succes',motif:'salutation-directe',verdict:'affiche',session:(function(){try{return sessionActiveId(b.id)||'';}catch(x){return '';}})(),redemandes:0});}catch(e){}}input.focus();return;}try{window.__qseq=(window.__qseq||0)+1;}catch(x){}queue.push({id:'q'+Date.now().toString(36)+(window.__qseq||0),text:v,cancelled:false});pump();input.focus();});
input.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();form.requestSubmit();}});
var actCtl=null;
function renderActs(){var el=document.getElementById('actList');el.innerHTML='';ViaActions.TOOLS.forEach(function(t){var d=document.createElement('div');var ok=ViaActions.available(t);d.textContent=(ok?'🟢 ':'🔴 ')+t.title+' — '+t.desc+' [accès : '+t.perms+']'+(t.sensitive?' [SENSIBLE : validation exigée]':'')+((t.needs&&!ok)?' [manquant : '+t.needs+']':'');var rb=document.createElement('button');rb.type='button';rb.textContent=ok?'Exécuter':'Indisponible';rb.style.cssText='margin-left:8px;min-height:44px;border-radius:999px;border:1px solid #ffd23f;background:transparent;color:#ffd23f';rb.disabled=!ok;rb.onclick=function(){execAct(t);};d.appendChild(rb);el.appendChild(d);});}
function actUI(state,res){document.getElementById('actState').textContent='État : '+state;if(res!==undefined)document.getElementById('actResult').textContent='Résultat réel : '+res;var r=(state==='en cours');document.getElementById('actStop').hidden=!r;document.getElementById('actTake').hidden=!r;}
document.getElementById('actStop').onclick=function(){if(actCtl)actCtl.abort();};
document.getElementById('actTake').onclick=function(){if(actCtl)actCtl.abort();actUI('repris en main','Tu as repris la main : action stoppée, écris directement dans le champ message.');input.focus();};
function execAct(t){if(actCtl)return;if(t.sensitive){if(!confirm('VALIDATION EXIGÉE — « '+t.title+' » est sensible (achat, suppression importante, publication ou message externe). Confirmer ?')){actUI('refusée','Validation refusée : rien exécuté.');return;}}
var txt='';if(t.id==='ask'){txt=prompt('Question pour le moteur (service connecté requis) :','');if(!txt)return;}
actCtl=new AbortController();actUI('en cours');add('sys','⚒️ Action « '+t.title+' » — objectif : '+t.desc);
ViaActions.run(t.id,{bot:q,botObj:b,text:txt,title:b.name+' — '+t.title,key:document.getElementById('pKey').value||null,signal:actCtl.signal},function(st,msg){document.getElementById('actState').textContent='État : en cours — '+msg;}).then(function(r){actUI('terminée',r);add('sys','⚒️ « '+t.title+' » terminé : '+r);}).catch(function(e){if(e&&e.name==='AbortError')actUI('arrêtée','Arrêtée à ta demande : reprends la main.');else actUI('erreur',(e&&e.message)||'échec');}).finally(function(){actCtl=null;document.getElementById('actStop').hidden=true;document.getElementById('actTake').hidden=true;});}
renderActs();
fillSettings();
try{document.getElementById('pulseChk').checked=pulseOn();}catch(e){}
document.getElementById('pulseChk').onchange=function(){try{localStorage.setItem('via-pulse',this.checked?'on':'off');}catch(e){}};
try{document.getElementById('xreadChk').checked=xreadOn();}catch(e){}
document.getElementById('xreadChk').onchange=function(){try{localStorage.setItem('via-xread',this.checked?'on':'off');}catch(e){}};
document.getElementById('gearBtn').onclick=function(){var s=document.getElementById('settings');s.hidden=!s.hidden;if(!s.hidden){refreshConsent();paintPerms();paintDiag();}};
refreshConsent();paintDiag();
// Auto-test BLM au chargement : purement local, sans moteur ni réseau. Il rend
// l'état réel visible immédiatement (chargés / partiels / erreur + exemples
// exactement refusés) au lieu de supposer que les modules sont chargés.
try{executerAutoTestBLM();majBlmUsed();}catch(e){}
paintDiag();
try{ViaLocalEngine.detect().then(function(c){window.__viaCap=c;paintPick(c);paintDiag(c);}).catch(function(){});}catch(e){}
// Démarrage direct : BLM déjà testés, puis moteur local automatique (accord
// préalable) ou serveur en ligne réellement configuré. Aucun faux « prêt ».
try{
  var mp=document.getElementById('modePick');
  if(mp){mp.value=lireMode();mp.onchange=function(){appliquerMode(this.value);orchestrerDemarrage();refreshConsent();};}
  var mbp=document.getElementById('botPick');if(mbp)mbp.value=(selectedBots[0]||q);
  refreshConsent();
  orchestrerDemarrage();
}catch(e){setState('idle');}
ViaCaps.paint('capsLine');
input.focus();
}).catch(function(){document.getElementById('who').textContent='Hors-ligne : recharge en ligne une fois.';});
