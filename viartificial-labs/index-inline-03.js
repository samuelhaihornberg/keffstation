
(function(){
var D=document.getElementById('disclaimer'),DUO=document.getElementById('duo'),TRI=document.getElementById('tribu');
var EB=document.getElementById('errBox'),EM=document.getElementById('errMsg'),RB=document.getElementById('retryBtn'),DR=document.getElementById('diagRetry'),DG=document.getElementById('diagLine');
var LSKEY='via-bots-cache-v1',TIMEOUT_MS=10000;
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function loadCached(){try{var r=localStorage.getItem(LSKEY);if(!r)return null;var o=JSON.parse(r);return (o&&o.bots&&o.bots.length)?o:null;}catch(e){return null;}}
function saveCache(c){try{localStorage.setItem(LSKEY,JSON.stringify({ts:Date.now(),bots:c.bots,disclaimer:c.disclaimer,encouragement:c.encouragement}));}catch(e){}}
function card(b,feat){var t=(b.tags||[]).map(function(x){return '<span data-i18n="viartificial-labs_escx" class="tag">'+esc(x)+'</span>';}).join('');
return '<article data-i18n="viartificial-labs_escbavatarescbnameescbspecialtyescbperso" class="card'+(feat?' featured':'')+'"><span data-i18n="viartificial-labs_escbavatar" class="avatar" aria-hidden="true">'+esc(b.avatar||'🤖')+'</span><h3 data-i18n="viartificial-labs_escbname">'+esc(b.name)+'</h3><p data-i18n="viartificial-labs_escbspecialty" class="role">'+esc(b.specialty||'')+'</p><p data-i18n="viartificial-labs_escbpersonality" class="persona">'+esc(b.personality||'')+'</p><div class="tags" data-i18n="viartificial-labs/index.html_t_3">'+t+'</div><a class="btn" href="./conversation.html?bot='+esc(b.id)+'">Ouvrir la conversation →</a></article>';}
function paint(c,note){var duo='',tribu='';c.bots.forEach(function(b){if(b.featured)duo+=card(b,true);else tribu+=card(b,false);});
DUO.innerHTML=duo;TRI.innerHTML=tribu;
D.textContent=(c.disclaimer||'Personnages simulés.')+' '+(c.encouragement||'')+(note?(' ('+note+')'):'');
EB.hidden=true;paintDiag('OK · '+c.bots.length+' profils');}
function paintDiag(s){if(DG)DG.textContent='Diagnostic : '+s+' · URL résolue : '+new URL('./bots.json',location.href).href;}
function fail(m,cached){if(cached){try{paint(cached,'copie locale — en attente réseau');}catch(e){}}
EM.textContent=m+' — profils affichés depuis la copie locale si disponible.';
EB.hidden=false;D.textContent='Chargement interrompu : '+m;paintDiag('ERREUR · '+m);}
function load(manual){EB.hidden=true;D.textContent='Chargement des profils…';paintDiag(manual?'rechargement manuel…':'chargement…');
var cached=loadCached();
var ctl=new AbortController(),to=setTimeout(function(){ctl.abort();},TIMEOUT_MS);
fetch('./bots.json',{signal:ctl.signal,cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('bots.json HTTP '+r.status);return r.json();}).then(function(c){
clearTimeout(to);if(!c||!c.bots||!c.bots.length)throw new Error('contenu vide');
saveCache(c);paint(c,cached?'mis à jour':'');}).catch(function(e){clearTimeout(to);
var m=(e&&e.name==='AbortError')?('délai dépassé ('+(TIMEOUT_MS/1000)+' s)'):(e&&e.message?e.message:'réseau indisponible');
fail(m,cached);}).finally(function(){try{if(window.ViaCaps)ViaCaps.paint('capsLine');}catch(e){}});}
RB.onclick=function(){load(true);};if(DR)DR.onclick=function(){load(true);};
load(false);
if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(function(){});}
})();
