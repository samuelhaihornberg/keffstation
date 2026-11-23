// src/fenetres-discution.js — Gestionnaire de fenêtres de discussion ViArtificial Labs.
// Chaque fenêtre = une « Scéance » (session unique) avec un bot ou un duo de bots.
// Fenêtres détachables, redimensionnables, maximisables, déplaçables (comme un OS).
// Fonctionnalités : historique des scéances, nouvelle scéance, partage d'écran,
// envoi de média/fichier, dictée vocale, écoute de la réponse avec lecteur audio.
'use strict';
(function (global) {
  var fenetres = [];
  var zCounter = 100;
  var container = null;

  function init(containerId) {
    container = document.getElementById(containerId) || document.body;
  }

  // ---------- Création d'une fenêtre de discussion ----------
  function ouvrirFenetre(botIds, titre) {
    var ids = Array.isArray(botIds) ? botIds : [botIds];
    var nom = ids.map(function (id) { return (global.botsById && global.botsById[id]) ? global.botsById[id].name : id; }).join(' + ');
    var titreFinal = titre || ('Scéance — ' + nom);

    var win = document.createElement('div');
    win.className = 'via-window';
    win.style.zIndex = ++zCounter;
    win.dataset.botIds = ids.join(',');

    var header = document.createElement('div');
    header.className = 'via-window-header';
    header.innerHTML = '<span class="via-window-title">' + escapeHtml(titreFinal) + '</span>' +
      '<div class="via-window-controls">' +
      '<button class="via-win-min" title="Réduire">─</button>' +
      '<button class="via-win-max" title="Agrandir">□</button>' +
      '<button class="via-win-close" title="Fermer">✕</button>' +
      '</div>';
    win.appendChild(header);

    var body = document.createElement('div');
    body.className = 'via-window-body';
    body.innerHTML =
      '<div class="via-window-toolbar">' +
      '<button class="via-btn via-btn-new-seance" title="Nouvelle scéance">+ Scéance</button>' +
      '<button class="via-btn via-btn-history" title="Historique des scéances">📜</button>' +
      '<button class="via-btn via-btn-share" title="Partager l\'écran">🖥️</button>' +
      '<button class="via-btn via-btn-file" title="Envoyer un fichier/média">📎</button>' +
      '<button class="via-btn via-btn-dictate" title="Dictée vocale">🎤</button>' +
      '</div>' +
      '<div class="via-window-messages"></div>' +
      '<div class="via-window-input-area">' +
      '<textarea class="via-window-input" placeholder="Écrivez votre message…" rows="2"></textarea>' +
      '<button class="via-btn via-btn-send" title="Envoyer">➤</button>' +
      '</div>' +
      '<div class="via-window-audio-player" hidden>' +
      '<audio controls class="via-audio"></audio>' +
      '<span class="via-audio-status">Lecture de la réponse…</span>' +
      '</div>';
    win.appendChild(body);

    // Drag
    var dragging = false, dragOffX = 0, dragOffY = 0;
    header.addEventListener('mousedown', function (e) {
      if (e.target.tagName === 'BUTTON') return;
      dragging = true;
      var rect = win.getBoundingClientRect();
      dragOffX = e.clientX - rect.left;
      dragOffY = e.clientY - rect.top;
      win.style.zIndex = ++zCounter;
      e.preventDefault();
    });
    document.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      win.style.left = (e.clientX - dragOffX) + 'px';
      win.style.top = (e.clientY - dragOffY) + 'px';
    });
    document.addEventListener('mouseup', function () { dragging = false; });

    // Resize
    var resizing = false, resizeStartW = 0, resizeStartH = 0, resizeStartX = 0, resizeStartY = 0;
    var resizeHandle = document.createElement('div');
    resizeHandle.className = 'via-window-resize';
    win.appendChild(resizeHandle);
    resizeHandle.addEventListener('mousedown', function (e) {
      resizing = true;
      resizeStartW = win.offsetWidth;
      resizeStartH = win.offsetHeight;
      resizeStartX = e.clientX;
      resizeStartY = e.clientY;
      win.style.zIndex = ++zCounter;
      e.preventDefault();
      e.stopPropagation();
    });
    document.addEventListener('mousemove', function (e) {
      if (!resizing) return;
      var newW = Math.max(320, resizeStartW + (e.clientX - resizeStartX));
      var newH = Math.max(240, resizeStartH + (e.clientY - resizeStartY));
      win.style.width = newW + 'px';
      win.style.height = newH + 'px';
    });
    document.addEventListener('mouseup', function () { resizing = false; });

    // Controls
    header.querySelector('.via-win-close').addEventListener('click', function () {
      win.remove();
      fenetres = fenetres.filter(function (w) { return w !== win; });
    });
    header.querySelector('.via-win-max').addEventListener('click', function () {
      if (win.classList.contains('via-window-maximized')) {
        win.classList.remove('via-window-maximized');
        win.style.width = '';
        win.style.height = '';
        win.style.left = '';
        win.style.top = '';
      } else {
        win.classList.add('via-window-maximized');
      }
    });
    header.querySelector('.via-win-min').addEventListener('click', function () {
      body.style.display = body.style.display === 'none' ? '' : 'none';
    });

    // Focus on click
    win.addEventListener('mousedown', function () { win.style.zIndex = ++zCounter; });

    // Position
    var offset = fenetres.length * 30;
    win.style.left = (100 + offset) + 'px';
    win.style.top = (100 + offset) + 'px';
    win.style.width = '480px';
    win.style.height = '560px';

    container.appendChild(win);
    fenetres.push(win);

    // Wire up toolbar buttons
    wireToolbar(win, ids);

    return win;
  }

  function wireToolbar(win, botIds) {
    var btnNew = win.querySelector('.via-btn-new-seance');
    var btnHist = win.querySelector('.via-btn-history');
    var btnShare = win.querySelector('.via-btn-share');
    var btnFile = win.querySelector('.via-btn-file');
    var btnDict = win.querySelector('.via-btn-dictate');
    var btnSend = win.querySelector('.via-btn-send');
    var input = win.querySelector('.via-window-input');
    var msgs = win.querySelector('.via-window-messages');

    // Nouvelle scéance
    btnNew.addEventListener('click', function () {
      var newWin = ouvrirFenetre(botIds, 'Scéance — ' + new Date().toLocaleTimeString());
      // Copier le contexte si nécessaire
    });

    // Historique
    btnHist.addEventListener('click', function () {
      var histDiv = document.createElement('div');
      histDiv.className = 'via-window-history-panel';
      histDiv.innerHTML = '<h4>Scéances précédentes</h4><div class="via-history-list"></div>';
      var list = histDiv.querySelector('.via-history-list');
      try {
        var seances = JSON.parse(localStorage.getItem('via-seances-' + botIds[0]) || '[]');
        seances.forEach(function (s) {
          var item = document.createElement('div');
          item.className = 'via-history-item';
          item.textContent = (s.titre || 'Scéance') + ' — ' + new Date(s.updatedAt || s.createdAt).toLocaleDateString();
          item.addEventListener('click', function () {
            // Charger la scéance
            msgs.innerHTML = '';
            (s.messages || []).forEach(function (m) {
              var div = document.createElement('div');
              div.className = 'via-msg via-msg-' + (m.role === 'user' ? 'user' : 'bot');
              div.textContent = m.content;
              msgs.appendChild(div);
            });
            histDiv.remove();
          });
          list.appendChild(item);
        });
      } catch (e) {}
      if (!list.children.length) list.innerHTML = '<p>Aucune scéance précédente.</p>';
      win.appendChild(histDiv);
      setTimeout(function () { histDiv.remove(); }, 15000);
    });

    // Partage d'écran
    btnShare.addEventListener('click', function () {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
          .then(function (stream) {
            var video = document.createElement('video');
            video.srcObject = stream;
            video.autoplay = true;
            video.style.maxWidth = '100%';
            var container = document.createElement('div');
            container.className = 'via-screen-share';
            container.appendChild(video);
            msgs.appendChild(container);
          })
          .catch(function (e) { console.warn('Partage écran refusé:', e); });
      } else {
        alert('Partage d\'écran non supporté par ce navigateur.');
      }
    });

    // Envoi de fichier/média
    btnFile.addEventListener('click', function () {
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,video/*,audio/*,.pdf,.txt,.doc,.docx';
      input.addEventListener('change', function (e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
          var div = document.createElement('div');
          div.className = 'via-msg via-msg-user via-msg-file';
          if (file.type.startsWith('image/')) {
            var img = document.createElement('img');
            img.src = ev.target.result;
            img.style.maxWidth = '200px';
            div.appendChild(img);
          } else {
            div.textContent = '📎 ' + file.name + ' (' + (file.size / 1024).toFixed(1) + ' Ko)';
          }
          msgs.appendChild(div);
          msgs.scrollTop = msgs.scrollHeight;
        };
        reader.readAsDataURL(file);
      });
      input.click();
    });

    // Dictée vocale
    var recognizing = false;
    var recognition = null;
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.onresult = function (e) {
        var transcript = '';
        for (var i = 0; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        input.value = transcript;
      };
      recognition.onend = function () {
        recognizing = false;
        btnDict.classList.remove('via-dictating');
      };
    }
    btnDict.addEventListener('click', function () {
      if (!recognition) { alert('Dictée vocale non supportée.'); return; }
      if (recognizing) {
        recognition.stop();
        recognizing = false;
        btnDict.classList.remove('via-dictating');
      } else {
        recognition.start();
        recognizing = true;
        btnDict.classList.add('via-dictating');
      }
    });

    // Envoi de message
    btnSend.addEventListener('click', function () { envoyerMessage(win, botIds, input, msgs); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        envoyerMessage(win, botIds, input, msgs);
      }
    });
  }

  function envoyerMessage(win, botIds, input, msgs) {
    var text = input.value.trim();
    if (!text) return;
    input.value = '';

    var userDiv = document.createElement('div');
    userDiv.className = 'via-msg via-msg-user';
    userDiv.textContent = text;
    msgs.appendChild(userDiv);
    msgs.scrollTop = msgs.scrollHeight;

    // Réponse du bot (ou du duo)
    var botDiv = document.createElement('div');
    botDiv.className = 'via-msg via-msg-bot';
    botDiv.textContent = '…';
    msgs.appendChild(botDiv);

    // Vérifier le consentement et charger le moteur si nécessaire
    if (global.ViaLocalEngine && global.ViaLocalEngine.getConsent && global.ViaLocalEngine.getConsent() !== 'granted') {
      var consentDiv = document.createElement('div');
      consentDiv.className = 'via-msg via-msg-sys';
      consentDiv.innerHTML = 'Autorisez le modèle local pour discuter. <button class="via-btn via-btn-consent">Autoriser</button>';
      msgs.appendChild(consentDiv);
      var btnConsent = consentDiv.querySelector('.via-btn-consent');
      if (btnConsent) {
        btnConsent.addEventListener('click', function () {
          global.ViaLocalEngine.setConsent('granted');
          global.ViaLocalEngine.initAutoLoad(function (p) {
            botDiv.textContent = 'Chargement du modèle local : ' + (p.progress || 0) + '%…';
          }).then(function () {
            botDiv.textContent = 'Modèle prêt. Réessayez votre message.';
          }).catch(function (e) {
            botDiv.textContent = 'Échec du chargement : ' + (e && e.message ? e.message : e);
          });
        });
      }
      botDiv.remove();
      return;
    }
    // Charger le moteur si consentement accordé mais pas encore chargé
    if (global.ViaLocalEngine && global.ViaLocalEngine.getConsent && global.ViaLocalEngine.getConsent() === 'granted' &&
        global.ViaLocalEngine.summary && global.ViaLocalEngine.summary().phase !== 'ready') {
      botDiv.textContent = 'Chargement du modèle local…';
      global.ViaLocalEngine.initAutoLoad(function (p) {
        botDiv.textContent = 'Chargement du modèle local : ' + (p.progress || 0) + '%…';
      }).then(function () {
        // Moteur chargé, continuer avec la réponse
        var bot = (global.botsById && global.botsById[botIds[0]]) || { id: botIds[0], name: botIds[0] };
        var msgs_arr = [{ role: 'user', content: text }];
        global.ViaLocalEngine.chat(bot, msgs_arr, {
          onToken: function (t) { botDiv.textContent += t; msgs.scrollTop = msgs.scrollHeight; }
        }).then(function (r) {
          botDiv.textContent = r;
          ajouterLecteurAudio(botDiv, r);
        }).catch(function (e) {
          botDiv.textContent = 'Erreur : ' + (e && e.message ? e.message : e);
        });
      }).catch(function (e) {
        botDiv.textContent = 'Échec du chargement : ' + (e && e.message ? e.message : e);
      });
      return;
    }
    // Appel au moteur local si disponible
    if (global.ViaLocalEngine && global.ViaLocalEngine.summary && global.ViaLocalEngine.summary().phase === 'ready') {
      // Utiliser le moteur local
      var bot = (global.botsById && global.botsById[botIds[0]]) || { id: botIds[0], name: botIds[0] };
      var msgs_arr = [{ role: 'user', content: text }];
      global.ViaLocalEngine.chat(bot, msgs_arr, {
        onToken: function (t) { botDiv.textContent += t; msgs.scrollTop = msgs.scrollHeight; }
      }).then(function (r) {
        botDiv.textContent = r;
        // Lecteur audio pour la réponse
        ajouterLecteurAudio(botDiv, r);
      }).catch(function (e) {
        botDiv.textContent = 'Erreur : ' + (e && e.message ? e.message : e);
      });
    } else {
      // Réponse simulée (sans moteur)
      setTimeout(function () {
        botDiv.textContent = 'Réponse simulée (moteur non chargé). Activez le moteur local pour une vraie réponse.';
      }, 500);
    }
  }

  function ajouterLecteurAudio(container, texte) {
    if (!window.speechSynthesis) return;
    var player = document.createElement('div');
    player.className = 'via-audio-player-inline';
    player.innerHTML = '<button class="via-btn-play" title="Écouter la réponse">🔊</button>' +
      '<input type="range" class="via-audio-progress" min="0" max="100" value="0" disabled>' +
      '<span class="via-audio-time">0:00</span>';
    container.appendChild(player);

    var btnPlay = player.querySelector('.via-btn-play');
    var progress = player.querySelector('.via-audio-progress');
    var timeSpan = player.querySelector('.via-audio-time');
    var utterance = null;
    var playing = false;

    btnPlay.addEventListener('click', function () {
      if (playing) {
        window.speechSynthesis.cancel();
        playing = false;
        btnPlay.textContent = '🔊';
        return;
      }
      utterance = new SpeechSynthesisUtterance(texte);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0;
      utterance.onstart = function () { playing = true; btnPlay.textContent = '⏸'; };
      utterance.onend = function () { playing = false; btnPlay.textContent = '🔊'; progress.value = 100; };
      utterance.onboundary = function (e) {
        if (e.charIndex && texte.length) {
          var pct = Math.round((e.charIndex / texte.length) * 100);
          progress.value = pct;
          var sec = Math.round((pct / 100) * (texte.length / 15));
          timeSpan.textContent = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
        }
      };
      // Permettre de cliquer sur la barre de progression pour choisir le moment d'écoute
      progress.addEventListener('click', function (e) {
        var rect = progress.getBoundingClientRect();
        var pct = (e.clientX - rect.left) / rect.width;
        // Approximation : on ne peut pas seek dans SpeechSynthesis, mais on peut
        // relancer à partir d'un point approximatif
        var charIdx = Math.round(pct * texte.length);
        var remaining = texte.slice(charIdx);
        window.speechSynthesis.cancel();
        var u2 = new SpeechSynthesisUtterance(remaining);
        u2.lang = 'fr-FR';
        u2.rate = 1.0;
        window.speechSynthesis.speak(u2);
        playing = true;
        btnPlay.textContent = '⏸';
      });
      window.speechSynthesis.speak(utterance);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ---------- Ouvrir une fenêtre pour un bot ----------
  function ouvrirBot(botId) {
    return ouvrirFenetre([botId], 'Scéance — ' + ((global.botsById && global.botsById[botId]) ? global.botsById[botId].name : botId));
  }

  // ---------- Ouvrir une fenêtre pour un duo ----------
  function ouvrirDuo(botId1, botId2) {
    return ouvrirFenetre([botId1, botId2], 'Scéance — ' + botId1 + ' + ' + botId2);
  }

  // ---------- CSS injecté ----------
  function injecterCSS() {
    if (document.getElementById('via-window-css')) return;
    var style = document.createElement('style');
    style.id = 'via-window-css';
    style.textContent = `
.via-window {
  position: fixed;
  background: #1a1a2e;
  border: 1px solid rgba(184,77,255,.4);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 320px;
  min-height: 240px;
  color: #e0e0e0;
  font-family: system-ui, sans-serif;
}
.via-window-header {
  background: linear-gradient(135deg, #2a1a4e, #1a1a2e);
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
  user-select: none;
  border-bottom: 1px solid rgba(184,77,255,.3);
}
.via-window-title { font-weight: 600; font-size: 0.9rem; color: #b84dff; }
.via-window-controls { display: flex; gap: 4px; }
.via-window-controls button {
  background: rgba(255,255,255,.1);
  border: none;
  color: #fff;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
}
.via-window-controls button:hover { background: rgba(184,77,255,.3); }
.via-window-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.via-window-toolbar {
  display: flex;
  gap: 4px;
  padding: 6px 8px;
  background: rgba(0,0,0,.2);
  border-bottom: 1px solid rgba(255,255,255,.1);
  flex-wrap: wrap;
}
.via-btn {
  background: rgba(184,77,255,.2);
  border: 1px solid rgba(184,77,255,.3);
  color: #e0e0e0;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
}
.via-btn:hover { background: rgba(184,77,255,.4); }
.via-btn-dictating { background: rgba(255,0,0,.3) !important; animation: pulse 1s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
.via-window-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.via-msg { padding: 8px 12px; border-radius: 8px; max-width: 85%; word-wrap: break-word; }
.via-msg-user { background: rgba(39,209,127,.15); align-self: flex-end; border: 1px solid rgba(39,209,127,.3); }
.via-msg-bot { background: rgba(184,77,255,.15); align-self: flex-start; border: 1px solid rgba(184,77,255,.3); }
.via-msg-file { font-style: italic; }
.via-window-input-area {
  display: flex;
  gap: 8px;
  padding: 8px;
  border-top: 1px solid rgba(255,255,255,.1);
}
.via-window-input {
  flex: 1;
  background: rgba(0,0,0,.3);
  border: 1px solid rgba(255,255,255,.2);
  border-radius: 8px;
  color: #e0e0e0;
  padding: 8px;
  resize: none;
  font-family: inherit;
}
.via-window-input:focus { outline: none; border-color: rgba(184,77,255,.5); }
.via-window-resize {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  cursor: se-resize;
  background: linear-gradient(135deg, transparent 50%, rgba(184,77,255,.4) 50%);
}
.via-window-maximized {
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  border-radius: 0;
}
.via-window-history-panel {
  position: absolute;
  top: 50px;
  right: 10px;
  background: #1a1a2e;
  border: 1px solid rgba(184,77,255,.4);
  border-radius: 8px;
  padding: 12px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  min-width: 200px;
}
.via-history-item {
  padding: 6px 8px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.85rem;
}
.via-history-item:hover { background: rgba(184,77,255,.2); }
.via-screen-share { margin: 8px 0; }
.via-screen-share video { max-width: 100%; border-radius: 8px; }
.via-audio-player-inline {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  padding: 4px 8px;
  background: rgba(0,0,0,.2);
  border-radius: 6px;
}
.via-audio-player-inline button {
  background: none;
  border: none;
  color: #b84dff;
  cursor: pointer;
  font-size: 1.1rem;
}
.via-audio-progress { flex: 1; cursor: pointer; }
.via-audio-time { font-size: 0.75rem; color: #8f96bd; min-width: 36px; }
`;
    document.head.appendChild(style);
  }

  // ---------- API publique ----------
  global.ViaFenetres = {
    init: init,
    ouvrirFenetre: ouvrirFenetre,
    ouvrirBot: ouvrirBot,
    ouvrirDuo: ouvrirDuo,
    injecterCSS: injecterCSS,
    fenetres: function () { return fenetres; }
  };
})(window);