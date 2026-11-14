/* ===== KiffTech Service Worker =====
   Règle : incrémenter CACHE_NAME à chaque modification des fichiers pré-cachés.
   Le code (HTML, JS, CSS) passe toujours par le réseau d'abord : une ancienne
   version ne peut pas rester affichée depuis le cache après une mise en ligne. */

const CACHE_NAME='kifftech-v24';
const PRECACHE_ASSETS=[
  './','./index.html','./promotions.html','./style.css','./app.js','./install.js','./bilan.js','./manifest.json',
  './data/catalogue.js','./data/config.js','./lib/payment-core.js',
  './icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./icons/apple-touch-icon.png'
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(PRECACHE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

function reseauEnPremier(requete){
  return fetch(requete,{cache:'no-cache'})
    .then(r=>{
      if(r.ok){const copie=r.clone();caches.open(CACHE_NAME).then(c=>c.put(requete,copie));}
      return r;
    })
    .catch(()=>caches.match(requete).then(m=>m||caches.match('./index.html')));
}

self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(e.request.method!=='GET'||url.origin!==location.origin) return;

  if(e.request.mode==='navigate'){
    e.respondWith(reseauEnPremier(e.request));
    return;
  }

  if(/\.(js|css|html|json)$/.test(url.pathname)||['script','style'].includes(e.request.destination)){
    e.respondWith(reseauEnPremier(e.request));
    return;
  }

  e.respondWith(
    caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{
      if(r.ok){const copie=r.clone();caches.open(CACHE_NAME).then(ca=>ca.put(e.request,copie));}
      return r;
    }))
  );
});

self.addEventListener('message',e=>{
  if(e.data?.type==='PRECACHE_ALL'){
    caches.open(CACHE_NAME).then(c=>c.addAll(PRECACHE_ASSETS));
  }
});
