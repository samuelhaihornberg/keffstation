const CACHE='kifftech-agent-v20';
var KEEP_RE=/transformers|onnx|webllm|mlc/i;
const ASSETS=['./','./index.html','./rayons.html','./catalog.html','./app.v2.js','./manifest.json','./img/sp1.jpg','./img/sp2.png','./img/sp4.png','./img/sp6.jpg','./img/sp8.jpg','./img/tb1.jpg','./img/tb3.jpg','./img/tb6.png','./img/tb8.jpg','./img/cp1.jpg','./img/cp3.jpg','./img/cp6.jpg','./img/cp9.jpg','./img/aw3.jpg','./img/aw9.jpg','./img/aw10.jpg','./img/vr1.jpg','./img/vr2.jpg','./img/vr5.jpg','./img/ce7.jpg','./img/rb2.jpg','./img/rb4.jpg','./img/rb1.jpg','./img/rb8.jpg','./img/rb9.jpg','./img/sp1b.jpg','./img/aw9b.png','./img/sp11.png','./img/sp13.jpg','./img/sp15.jpg','./img/sp17.png','./img/sp18.jpg','./img/sp12.jpg','./img/sp14.jpg','./img/sp16.jpg','./img/tb2.jpg','./img/tb13.jpg','./img/cp2.jpg','./img/aw6.jpg','./img/co2.jpg','./img/co3.jpg','./img/co4.jpg','./img/co5.png','./img/co6.jpg','./img/co7.png','./img/co8.jpg','./img/co9.png','./img/co10.jpg','./img/co11.png','./img/co13.jpg','./img/co15.png','./img/co16.png','./img/ac66.jpg','./img/ac67.jpg','./img/ac60.jpg','./img/ac58.jpg','./img/ac84.jpg','./img/ac71.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE&&!KEEP_RE.test(x)).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(url.origin!==self.location.origin)return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(ch=>ch.put(e.request,c))}return res}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
    return;
  }
  if(/\.(js|css|png|jpg|jpeg|gif|svg|webp|woff2?|ttf|ico|json)$/.test(url.pathname)){
    e.respondWith(caches.match(e.request).then(cached=>{
      const net=fetch(e.request).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(ch=>ch.put(e.request,c))}return res}).catch(()=>cached);
      return cached||net;
    }));
    return;
  }
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});