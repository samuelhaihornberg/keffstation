/* Vidéo de présentation : pas de lecture automatique, affichage de remplacement si le fichier ne charge pas. */
(function () {
  var video = document.getElementById('intro-video');
  var fallback = document.getElementById('intro-video-fallback');
  if (!video || !fallback) return;
  video.addEventListener('error', function () {
    video.hidden = true;
    fallback.hidden = false;
  });
})();
