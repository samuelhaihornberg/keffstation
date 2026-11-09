
var botDemande=(new URLSearchParams(location.search).get('bot')||'').toLowerCase();
if(!/^[a-z]+$/.test(botDemande))botDemande='';
var bot=(new URLSearchParams(location.search).get('bot')||'geeko').toLowerCase();
if(bot!=='geeko'&&bot!=='geekette')bot='geeko';
document.getElementById('xBot').value=bot;
function paintSet(){var s=ViaMemory.settings(bot);document.getElementById('xSkill').value=String(s.skill);document.getElementById('xInit').value=String(s.initiative);var pr=ViaMemory.progression(bot);document.getElementById('xProg').textContent='Progression '+ (bot==='geeko'?'Geeko':'Geekette') +' : '+pr.total+' expériences enregistrées ('+pr.confirmed+' confirmées). Réglages indépendants de l’autre compagnon.';}
document.getElementById('xBot').onchange=function(e){bot=e.target.value;botDemande='';paintSet();};
document.getElementById('xSave').onclick=function(){var cur=ViaMemory.settings(bot);ViaMemory.saveSettings(bot,{skill:document.getElementById('xSkill').value,initiative:document.getElementById('xInit').value,advice:cur.advice,persona:cur.persona});paintSet();};
document.getElementById('xChat').onclick=function(){location.href='./conversation.html?bot='+(botDemande||bot);};
paintSet();
try{var g=JSON.parse(localStorage.getItem('xs-game')||'{}');document.getElementById('xGame').value=g.game||'';document.getElementById('xEdition').value=g.edition||'';if(g.game)document.getElementById('xGameMsg').textContent='Enregistré localement : '+g.game+' — '+g.edition+' (aucune connexion au jeu).';}catch(e){}
document.getElementById('xGameSave').onclick=function(){var g={game:document.getElementById('xGame').value.trim(),edition:document.getElementById('xEdition').value.trim()};try{localStorage.setItem('xs-game',JSON.stringify(g));}catch(e){}document.getElementById('xGameMsg').textContent=g.game?('Enregistré localement : '+g.game+' — '+g.edition+' (aucune connexion au jeu).'):'Champ vide : rien enregistré.';};
var screenStream=null,camStream=null,micStream=null,micRAF=null;
function badge(id,txt,ok){var e=document.getElementById(id);e.textContent=txt;e.className='badge'+(ok?' ok':'');}
function liveMsg(){document.getElementById('xScreenMsg').textContent='Écran : '+(screenStream?'partagé par toi':'non partagé')+'. Caméra : '+(camStream?'active':'coupée')+'. Micro : '+(micStream?'actif (niveau ci-dessus, sans retour son)':'coupé')+'. Prévisualisation locale — analyse compagnon : aucun service voix/moteur connecté.';}
function stopTracks(s){if(s)s.getTracks().forEach(function(t){t.stop();});}
document.getElementById('xShare').onclick=function(){goScreen(false);};
document.getElementById('xShareSnd').onclick=function(){goScreen(true);};
function goScreen(snd){if(!navigator.mediaDevices||!navigator.mediaDevices.getDisplayMedia){document.getElementById('xScreenMsg').textContent='Partage d’écran non supporté par ce navigateur.';return;}
stopTracks(screenStream);screenStream=null;
navigator.mediaDevices.getDisplayMedia({video:true,audio:!!snd}).then(function(s){screenStream=s;var v=document.getElementById('xVideo');v.srcObject=s;v.play().catch(function(){});badge('bScreen',snd?'🟢 Écran + son : partagés par toi':'🟢 Écran : partagé par toi',true);liveMsg();s.getVideoTracks()[0].addEventListener('ended',function(){stopTracks(screenStream);screenStream=null;document.getElementById('xVideo').srcObject=null;badge('bScreen','🔴 Écran : non partagé',false);liveMsg();});}).catch(function(e){document.getElementById('xScreenMsg').textContent='Partage refusé ou impossible : '+(e&&e.message?e.message:e)+'. Rien capturé.';});}
document.getElementById('xCamOn').onclick=function(){if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return;
stopTracks(camStream);navigator.mediaDevices.getUserMedia({video:{width:{ideal:640}},audio:false}).then(function(s){camStream=s;var v=document.getElementById('xCam');v.srcObject=s;v.play().catch(function(){});badge('bCam','🟢 Caméra : active (toi)',true);liveMsg();}).catch(function(e){document.getElementById('xScreenMsg').textContent='Caméra refusée ou impossible : '+(e&&e.message?e.message:e)+'.';});};
document.getElementById('xMicOn').onclick=function(){if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return;
stopTracks(micStream);navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true},video:false}).then(function(s){micStream=s;badge('bMic','🟢 Micro : actif (voix en direct, niveau ci-dessus)',true);liveMsg();var AC=window.AudioContext||window.webkitAudioContext;if(!AC){return;}var ctx=new AC();var src=ctx.createMediaStreamSource(s);var an=ctx.createAnalyser();an.fftSize=256;src.connect(an);var buf=new Uint8Array(an.frequencyBinCount);var m=document.getElementById('xMeter');(function tick(){if(!micStream){try{ctx.close();}catch(e){}return;}an.getByteFrequencyData(buf);var v=0;for(var i=0;i<buf.length;i++)v+=buf[i];v=v/buf.length/255;m.style.width=Math.round(Math.min(100,v*160))+'%';micRAF=requestAnimationFrame(tick);})();}).catch(function(e){document.getElementById('xScreenMsg').textContent='Micro refusé ou impossible : '+(e&&e.message?e.message:e)+'. Voix en direct indisponible.';});};
document.getElementById('xLiveOff').onclick=function(){stopTracks(screenStream);screenStream=null;stopTracks(camStream);camStream=null;stopTracks(micStream);micStream=null;if(micRAF)cancelAnimationFrame(micRAF);document.getElementById('xVideo').srcObject=null;document.getElementById('xCam').srcObject=null;document.getElementById('xMeter').style.width='0';badge('bScreen','🔴 Écran : non partagé',false);badge('bCam','🔴 Caméra : coupée',false);badge('bMic','🔴 Micro : coupé',false);liveMsg();};

if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(function(){});}ViaCaps.paint('capsLine');
