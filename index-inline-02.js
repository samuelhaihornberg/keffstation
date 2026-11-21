/* Vidéo de présentation : pas de lecture automatique, affichage de remplacement si le fichier ne charge pas. */
(function () {
  var video = document.getElementById('intro-video');
  var fallback = document.getElementById('intro-video-fallback');
  if (!video || !fallback) return;
  var sources = video.querySelectorAll('source');
  var last = sources[sources.length - 1];
  var showFallback = function () {
    video.hidden = true;
    fallback.hidden = false;
  };
  if (last) last.addEventListener('error', showFallback);
  else video.addEventListener('error', showFallback);
})();
