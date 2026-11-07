// ============ KeffStation — suivi des clics réels (Google Analytics) ============
// Envoie des événements gtag pour les interactions réelles des utilisateurs.
// À inclure après le bloc gtag de config sur chaque page.
(function(){
  function send(eventName, params){
    if(typeof window.gtag === 'function'){
      window.gtag('event', eventName, params || {});
    }
  }
  function isExternal(url){
    try{
      return new URL(url).origin !== window.location.origin;
    }catch(e){
      return false;
    }
  }
  function cleanText(el){
    return (el.textContent || '').replace(/\s+/g,' ').trim().slice(0,80);
  }

  document.addEventListener('click', function(e){
    var target = e.target;
    // remonter jusqu'au lien ou bouton cliqué
    while(target && target !== document.body){
      if(target.tagName === 'A' && target.href){
        var href = target.href;
        var label = cleanText(target) || href;
        if(isExternal(href)){
          send('outbound_click', {
            event_category: 'navigation',
            event_label: label,
            link_url: href,
            link_destination: 'external'
          });
        }else{
          send('internal_click', {
            event_category: 'navigation',
            event_label: label,
            link_url: href,
            link_destination: 'internal'
          });
        }
        return;
      }
      if((target.tagName === 'BUTTON' || target.role === 'button') && !target.closest('a')){
        send('button_click', {
          event_category: 'interaction',
          event_label: cleanText(target) || target.id || 'bouton',
          element_id: target.id || undefined
        });
        return;
      }
      target = target.parentElement;
    }
  }, {passive:true});
})();
