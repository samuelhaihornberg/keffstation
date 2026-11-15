(() => {
  'use strict';

  const VIEWS = ['mur', 'reels', 'profil'];
  const REACTIONS = [
    { key: 'like', label: '+1 like', emoji: '👍' },
    { key: 'dislike', label: '-1 dislike', emoji: '👎' },
    { key: 'adore', label: "J'adore", emoji: '❤️' },
    { key: 'surkiff', label: 'Je surkiff', emoji: '🥵' },
    { key: 'deteste', label: 'Je déteste', emoji: '🤬' },
    { key: 'degoute', label: 'Ça me dégoûte', emoji: '🤮' }
  ];

  const POST_TYPES = [
    { value: 'texte', label: 'Texte' },
    { value: 'image', label: 'Image' },
    { value: 'stickers', label: 'Stickers' },
    { value: 'video', label: 'Vidéo' },
    { value: 'musique', label: 'Musique' },
    { value: 'video_musique', label: 'Vidéo + musique' }
  ];

  const DEFAULT_RUBRIC_TYPES = [
    { value: 'professionnel', label: 'Professionnel' },
    { value: 'familial', label: 'Familial' },
    { value: 'amical', label: 'Amical' },
    { value: 'sentimental', label: 'Sentimental / amoureux' },
    { value: 'autre', label: 'Autre (libre)' }
  ];

  const QUESTION_BANK = {
    professionnel: [
      { q: "Quel métier, projet ou savoir-faire aimerais-tu présenter ?", prompt: "Exemple : Je suis développeur web et j’aime créer des outils utiles, simples et accessibles." },
      { q: "Quelles expériences ou réalisations souhaites-tu mettre en avant ?", prompt: "Exemple : J’ai participé à des projets collaboratifs où j’ai appris à allier rigueur et créativité." },
      { q: "Quel type d’échanges ou d’opportunités recherches-tu ?", prompt: "Exemple : Je suis ouvert aux collaborations, aux partages d’idées et aux projets qui ont du sens." }
    ],
    familial: [
      { q: "Qu’aimerais-tu raconter sur ta vie de famille ou les moments qui comptent pour toi ?", prompt: "Exemple : J’aime partager les petits moments du quotidien, les traditions et les souvenirs qui nous rapprochent." },
      { q: "Quelles valeurs ou habitudes familiales te tiennent à cœur ?", prompt: "Exemple : L’entraide, l’écoute et les moments passés ensemble sont très importants pour moi." },
      { q: "Que souhaites-tu partager dans cet espace familial ?", prompt: "Exemple : Je veux y publier des nouvelles, des souvenirs et des moments de vie en toute simplicité." }
    ],
    amical: [
      { q: "Qu’aimes-tu partager ou faire avec tes ami·es ?", prompt: "Exemple : J’aime improviser des sorties, discuter pendant des heures et découvrir de nouvelles activités ensemble." },
      { q: "Comment décrirais-tu l’ambiance que tu aimes entre ami·es ?", prompt: "Exemple : Une ambiance bienveillante, drôle et sincère où chacun peut être lui-même." },
      { q: "Qu’aimerais-tu que tes ami·es trouvent dans cette rubrique ?", prompt: "Exemple : Des idées, des souvenirs, des coups de cœur et des moments à partager." }
    ],
    sentimental: [
      { q: "Qu’aimerais-tu dire de ta façon de vivre une relation ?", prompt: "Exemple : Je valorise la confiance, la communication et la douceur dans une relation." },
      { q: "Qu’est-ce qui compte le plus pour toi au quotidien avec quelqu’un ?", prompt: "Exemple : Le respect, la complicité et l’envie de construire ensemble sont essentiels pour moi." },
      { q: "Que souhaites-tu exprimer dans cet espace sentimental/amoureux ?", prompt: "Exemple : Je veux y partager ma vision de la relation, mes attentes et ce qui me touche." }
    ],
    autre: [
      { q: "Quel est le thème ou l’intention de cette rubrique ?", prompt: "Exemple : Cette rubrique rassemble mes passions, mes idées et ce que j’ai envie d’explorer." },
      { q: "Qu’aimerais-tu y partager ou raconter ?", prompt: "Exemple : Je souhaite y publier des réflexions, des créations et des découvertes personnelles." },
      { q: "Qu’aimerais-tu que les visiteurs retiennent de cet espace ?", prompt: "Exemple : J’espère qu’ils y découvriront un aperçu sincère de mon univers." }
    ]
  };

  const STORAGE_KEY = 'blogum_profile_maker_v1';
  const state = {
    viewIndex: 0,
    posts: [
      { id: uid(), author: 'Alex', sphere: 'Pro', type: 'texte', content: 'Bienvenue sur le Mur Blogum : partagez vos idées, images, vidéos et musiques.', mediaUrl: '', stickers: '', createdAt: Date.now() - 3600000, reactions: {}, userReactions: {}, comments: [{ id: uid(), author: 'Marie', text: 'Hâte de découvrir vos rubriques !' }] },
      { id: uid(), author: 'Sophie', sphere: 'Amis', type: 'stickers', content: 'Mood du jour', mediaUrl: '', stickers: '✨🎵😄', createdAt: Date.now() - 7200000, reactions: { adore: 2 }, userReactions: {}, comments: [] }
    ],
    reels: [
      { id: uid(), author: 'Lina', title: 'Réel démo — vidéo courte', type: 'video', mediaUrl: '', note: 'Aperçu interface : publication vidéo (fichier/URL à ajouter par l’utilisateur, non enregistré côté serveur).', music: '', reactions: {}, userReactions: {}, comments: [] },
      { id: uid(), author: 'Noa', title: 'Vidéo + musique', type: 'video_musique', mediaUrl: '', note: 'Exemple de format vidéo avec musique. Le studio avancé sera développé plus tard.', music: 'Piste : ambiance douce (exemple)', reactions: { surkiff: 1 }, userReactions: {}, comments: [] }
    ],
    profileMode: 'view', // 'view' (page visible) | 'edit' (Maker / Modifier mon Blog-Forum)
    profile: {
      draft: { displayName: 'Vous', bio: '', rubrics: [] },
      published: { displayName: 'Vous', bio: '', rubrics: [] }
    },
    maker: {
      selectedRubricId: null,
      questionPreviewRubricId: null,
      pagePreview: false,
      notice: ''
    }
  };

  function uid() { return 'id-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }
  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
  function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function fmtTime(ts) {
    try { return new Date(ts).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }); } catch { return ''; }
  }
  function deepClone(v) { return JSON.parse(JSON.stringify(v)); }

  function makeQuestion(type) {
    const bank = QUESTION_BANK[type] || QUESTION_BANK.autre;
    const base = bank[Math.floor(Math.random() * bank.length)] || { q: 'Votre question', prompt: 'Exemple : ...' };
    return { id: uid(), q: base.q, prompt: base.prompt, answer: '', include: true, isCustom: false };
  }
  function makeQuestions(type) { return (QUESTION_BANK[type] || QUESTION_BANK.autre).map(x => ({ id: uid(), q: x.q, prompt: x.prompt, answer: '', include: true, isCustom: false })); }
  function makeRubric(type = 'professionnel', title = '') {
    const typeLabel = (DEFAULT_RUBRIC_TYPES.find(t => t.value === type) || DEFAULT_RUBRIC_TYPES[0]).label;
    return { id: uid(), type, title: title || typeLabel, questions: makeQuestions(type) };
  }
  function rubricTypeLabel(v) { return (DEFAULT_RUBRIC_TYPES.find(r => r.value === v) || {}).label || v; }

  function hasBackendStorage() { return false; } // aucune logique serveur fabriquée
  function storageNotice() {
    return hasBackendStorage()
      ? 'Sauvegarde serveur disponible (selon configuration).'
      : 'Sauvegarde backend indisponible : les données du Maker/Profil sont enregistrées localement sur cet appareil (localStorage) et ne sont pas envoyées au serveur.';
  }

  function loadLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data && data.profile && data.profile.draft && data.profile.published) {
        state.profile = data.profile;
        if (data.profileMode) state.profileMode = data.profileMode;
      }
    } catch (_) {}
  }
  function saveLocal(msg = 'Brouillon enregistré localement sur cet appareil.') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile: state.profile, profileMode: state.profileMode, savedAt: Date.now() }));
      state.maker.notice = msg;
    } catch (_) {
      state.maker.notice = 'Impossible d’enregistrer localement (stockage indisponible sur cet appareil).';
    }
  }

  function init() {
    loadLocal();
    // assurer un draft initial avec thèmes proposés si vide
    if (!state.profile.draft.rubrics || !state.profile.draft.rubrics.length) {
      state.profile.draft.rubrics = [
        makeRubric('professionnel', 'Professionnel'),
        makeRubric('familial', 'Familial'),
        makeRubric('amical', 'Amical'),
        makeRubric('sentimental', 'Sentimental / amoureux')
      ];
    }
    if (!state.maker.selectedRubricId && state.profile.draft.rubrics[0]) state.maker.selectedRubricId = state.profile.draft.rubrics[0].id;
    renderTabs();
    renderAllViews();
    bindNav();
    bindSwipe();
    setView(0, false);
  }

  function renderTabs() {
    const tabs = qs('#viewTabs');
    const labels = [
      { id: 'mur', t: 'Mur', s: 'Fil & publications' },
      { id: 'reels', t: 'Réels / Story', s: 'Vidéo verticale' },
      { id: 'profil', t: 'Profil', s: 'Blog-Forum' }
    ];
    tabs.innerHTML = labels.map((v, i) => `
      <button class="view-tab" role="tab" aria-selected="${i === 0}" aria-controls="view-${v.id}" id="tab-${v.id}" data-index="${i}">
        ${escapeHtml(v.t)}<span>${escapeHtml(v.s)}</span>
      </button>`).join('');
  }

  function renderAllViews() {
    renderMur();
    renderReels();
    renderProfil();
  }

  function setView(index, animate = true) {
    state.viewIndex = Math.max(0, Math.min(VIEWS.length - 1, index));
    const track = qs('#viewsTrack');
    if (track) {
      track.style.transition = animate ? 'transform .28s ease' : 'none';
      track.style.transform = `translateX(-${state.viewIndex * 100}%)`;
    }
    qsa('.view-tab').forEach((btn, i) => {
      const active = i === state.viewIndex;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function bindNav() {
    qs('#viewTabs').addEventListener('click', (e) => {
      const btn = e.target.closest('.view-tab');
      if (!btn) return;
      setView(Number(btn.dataset.index));
    });
  }

  function bindSwipe() {
    const viewport = qs('#viewsViewport');
    if (!viewport) return;
    let startX = 0, startY = 0, dx = 0, dy = 0, tracking = false;
    viewport.addEventListener('touchstart', (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      const t = e.touches[0]; startX = t.clientX; startY = t.clientY; dx = 0; dy = 0; tracking = true;
    }, { passive: true });
    viewport.addEventListener('touchmove', (e) => {
      if (!tracking || !e.touches || e.touches.length !== 1) return;
      const t = e.touches[0]; dx = t.clientX - startX; dy = t.clientY - startY;
    }, { passive: true });
    viewport.addEventListener('touchend', () => {
      if (!tracking) return; tracking = false;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        if (dx < 0) setView(state.viewIndex + 1); else setView(state.viewIndex - 1);
      }
    }, { passive: true });
  }

  // -------- Mur (inchangé, distinct du Maker Profil) --------
  function renderMur() {
    qs('#view-mur').innerHTML = `
      <div class="stack">
        <section class="card stack">
          <h2 class="sec-title">Nouvelle publication</h2>
          <p class="small muted">Publication du Mur (interface locale). Types : texte, image, stickers, vidéo, musique, ou vidéo avec musique. Ce formulaire est distinct du générateur de Profil.</p>
          <div class="row">
            <label class="field" style="flex:1;min-width:180px">Type
              <select id="murType">${POST_TYPES.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}</select>
            </label>
            <label class="field" style="flex:1;min-width:180px">Sphère (contexte)
              <select id="murSphere"><option>Public</option><option>Pro</option><option>Famille</option><option>Amis</option><option>Sentimental/amoureux</option></select>
            </label>
          </div>
          <label class="field">Texte / légende
            <textarea id="murText" placeholder="Qu'avez-vous à partager ?"></textarea>
          </label>
          <div id="murExtra" class="stack"></div>
          <div class="row"><button class="btn primary" id="murPublish">Publier</button></div>
        </section>
        <section class="stack">
          <h2 class="sec-title">Fil d'actualité</h2>
          <div id="murFeed" class="stack"></div>
        </section>
      </div>`;
    renderMurExtra();
    qs('#murType').addEventListener('change', renderMurExtra);
    qs('#murPublish').addEventListener('click', publishMurPost);
    renderMurFeed();
  }

  function renderMurExtra() {
    const type = qs('#murType').value;
    const el = qs('#murExtra');
    if (type === 'image') {
      el.innerHTML = `<label class="field">Image (URL ou fichier local, aperçu uniquement)<input type="text" id="murUrl" placeholder="https://..."><input type="file" id="murFile" accept="image/*"></label>`;
    } else if (type === 'video' || type === 'video_musique') {
      el.innerHTML = `<label class="field">Vidéo (URL ou fichier local, aperçu uniquement)<input type="text" id="murUrl" placeholder="https://..."><input type="file" id="murFile" accept="video/*"></label>${type === 'video_musique' ? '<label class="field">Musique associée (titre/URL, info)<input type="text" id="murMusic" placeholder="Ex. titre de la piste"></label>' : ''}`;
    } else if (type === 'musique') {
      el.innerHTML = `<label class="field">Musique (URL ou fichier local, aperçu uniquement)<input type="text" id="murUrl" placeholder="https://..."><input type="file" id="murFile" accept="audio/*"></label>`;
    } else if (type === 'stickers') {
      el.innerHTML = `<label class="field">Stickers / emojis<input type="text" id="murStickers" placeholder="Ex. ✨🔥🎉"></label>`;
    } else {
      el.innerHTML = '';
    }
  }

  function getFilePreviewUrl(inputId) {
    const f = qs('#' + inputId);
    if (f && f.files && f.files[0]) return URL.createObjectURL(f.files[0]);
    return '';
  }

  function publishMurPost() {
    const type = qs('#murType').value;
    const content = (qs('#murText').value || '').trim();
    const sphere = qs('#murSphere').value;
    const mediaUrl = (qs('#murUrl') ? qs('#murUrl').value.trim() : '') || getFilePreviewUrl('murFile');
    const stickers = (qs('#murStickers') ? qs('#murStickers').value.trim() : '');
    const music = (qs('#murMusic') ? qs('#murMusic').value.trim() : '');
    if (!content && !mediaUrl && !stickers) return;
    state.posts.unshift({ id: uid(), author: 'Vous', sphere, type, content, mediaUrl, stickers, music, createdAt: Date.now(), reactions: {}, userReactions: {}, comments: [] });
    qs('#murText').value = '';
    renderMurExtra();
    renderMurFeed();
  }

  function renderMurFeed() {
    const feed = qs('#murFeed');
    if (!state.posts.length) { feed.innerHTML = '<div class="empty">Aucune publication pour le moment.</div>'; return; }
    feed.innerHTML = state.posts.map(p => postCardHTML(p, 'mur')).join('');
    bindPostInteractions(feed, state.posts, 'mur');
  }

  function mediaHTML(p) {
    if (p.type === 'image' && p.mediaUrl) return `<div class="post-media"><img src="${escapeHtml(p.mediaUrl)}" alt="Image de publication"></div>`;
    if ((p.type === 'video' || p.type === 'video_musique') && p.mediaUrl) return `<div class="post-media"><video src="${escapeHtml(p.mediaUrl)}" controls playsinline></video>${p.music ? `<div class="small muted" style="padding:8px">Musique : ${escapeHtml(p.music)}</div>` : ''}</div>`;
    if ((p.type === 'video' || p.type === 'video_musique') && !p.mediaUrl) return `<div class="post-media"><div class="media-placeholder">🎬 Publication ${p.type === 'video_musique' ? 'vidéo + musique' : 'vidéo'} (aperçu interface — média non fourni)${p.music ? `<br><span class="small">${escapeHtml(p.music)}</span>` : ''}</div></div>`;
    if (p.type === 'musique') return `<div class="post-media"><div class="media-placeholder">🎵 Musique${p.mediaUrl ? `<br><audio controls src="${escapeHtml(p.mediaUrl)}" style="width:100%;margin-top:8px"></audio>` : ' (aperçu interface)'}</div></div>`;
    if (p.type === 'image' && !p.mediaUrl) return `<div class="post-media"><div class="media-placeholder">🖼️ Image (aperçu interface — média non fourni)</div></div>`;
    return '';
  }

  function reactionsHTML(item, scope) {
    return `<div class="reactions">${REACTIONS.map(r => {
      const count = (item.reactions && item.reactions[r.key]) || 0;
      const active = item.userReactions && item.userReactions[r.key];
      return `<button class="reaction-btn ${active ? 'active' : ''}" data-action="react" data-scope="${scope}" data-id="${item.id}" data-reaction="${r.key}" title="${escapeHtml(r.label)}">${r.emoji}<span class="count">${count}</span></button>`;
    }).join('')}</div>`;
  }

  function commentsHTML(item, scope) {
    const comments = item.comments || [];
    return `<div class="comments">
      <div class="small muted"><strong>Commentaires</strong> (${comments.length})</div>
      ${comments.map(c => `<div class="comment"><div class="comment-author">${escapeHtml(c.author)}</div><div>${escapeHtml(c.text)}</div></div>`).join('') || '<div class="small muted">Aucun commentaire (interface locale).</div>'}
      <form class="comment-form" data-action="comment" data-scope="${scope}" data-id="${item.id}">
        <input type="text" name="comment" placeholder="Ajouter un commentaire..." aria-label="Commentaire">
        <button class="btn small" type="submit">Envoyer</button>
      </form>
    </div>`;
  }

  function postCardHTML(p, scope) {
    return `<article class="post-card" data-id="${p.id}">
      <div class="post-head"><div><div class="post-author">${escapeHtml(p.author)}</div><div class="post-meta">${escapeHtml(p.sphere || 'Public')} · ${escapeHtml(POST_TYPES.find(t => t.value === p.type)?.label || p.type)} · ${fmtTime(p.createdAt)}</div></div></div>
      ${p.content ? `<div class="post-body">${escapeHtml(p.content)}</div>` : ''}
      ${p.stickers ? `<div class="stickers">${escapeHtml(p.stickers)}</div>` : ''}
      ${mediaHTML(p)}
      ${reactionsHTML(p, scope)}
      ${commentsHTML(p, scope)}
    </article>`;
  }

  function getCollection(scope) {
    if (scope === 'mur') return state.posts;
    if (scope === 'reels') return state.reels;
    return [];
  }

  function bindPostInteractions(root, collection, scope) {
    root.querySelectorAll('[data-action="react"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = collection.find(x => x.id === btn.dataset.id);
        if (!item) return;
        const key = btn.dataset.reaction;
        item.reactions = item.reactions || {}; item.userReactions = item.userReactions || {};
        if (item.userReactions[key]) { item.userReactions[key] = false; item.reactions[key] = Math.max(0, (item.reactions[key] || 1) - 1); }
        else { item.userReactions[key] = true; item.reactions[key] = (item.reactions[key] || 0) + 1; }
        if (scope === 'mur') renderMurFeed(); else renderReels();
      });
    });
    root.querySelectorAll('form[data-action="comment"]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[name="comment"]');
        const text = (input.value || '').trim();
        if (!text) return;
        const item = collection.find(x => x.id === form.dataset.id);
        if (!item) return;
        item.comments = item.comments || [];
        item.comments.push({ id: uid(), author: 'Vous', text });
        input.value = '';
        if (scope === 'mur') renderMurFeed(); else renderReels();
      });
    });
  }

  // -------- Reels / Story --------
  function renderReels() {
    const panel = qs('#view-reels');
    panel.innerHTML = `
      <div class="stack">
        <section class="card stack">
          <h2 class="sec-title">Publier un Réel / Story</h2>
          <p class="small muted">Formats prévus : vidéo, ou vidéo avec musique. Une vidéo courte à la fois dans le fil. (Studio avancé de montage images/vidéos : plus tard.)</p>
          <div class="row">
            <label class="field" style="flex:1;min-width:180px">Type<select id="reelType"><option value="video">Vidéo</option><option value="video_musique">Vidéo + musique</option></select></label>
            <label class="field" style="flex:1;min-width:180px">Titre<input type="text" id="reelTitle" placeholder="Titre du réel"></label>
          </div>
          <label class="field">Vidéo (URL ou fichier local, aperçu uniquement)<input type="text" id="reelUrl" placeholder="https://..."><input type="file" id="reelFile" accept="video/*"></label>
          <label class="field" id="reelMusicWrap">Musique (info/piste, pour vidéo + musique)<input type="text" id="reelMusic" placeholder="Ex. titre de la piste"></label>
          <label class="field">Description / note<textarea id="reelNote" placeholder="Texte, contexte..."></textarea></label>
          <div class="row"><button class="btn primary" id="reelPublish">Ajouter au fil Réels</button></div>
        </section>
        <section class="stack">
          <h2 class="sec-title">Fil Réels / Story (vertical)</h2>
          <p class="small muted">Faites défiler verticalement pour passer d’une vidéo à l’autre. Commandes de réaction et commentaire disponibles.</p>
          <div class="reels-shell"><div class="reels-track" id="reelsTrack"></div></div>
        </section>
      </div>`;
    const sync = () => { qs('#reelMusicWrap').classList.toggle('hidden', qs('#reelType').value !== 'video_musique'); };
    qs('#reelType').addEventListener('change', sync); sync();
    qs('#reelPublish').addEventListener('click', () => {
      const type = qs('#reelType').value;
      const title = (qs('#reelTitle').value || '').trim() || (type === 'video_musique' ? 'Vidéo + musique' : 'Vidéo courte');
      const mediaUrl = (qs('#reelUrl').value || '').trim() || getFilePreviewUrl('reelFile');
      const music = (qs('#reelMusic').value || '').trim();
      const note = (qs('#reelNote').value || '').trim();
      state.reels.unshift({ id: uid(), author: 'Vous', title, type, mediaUrl, note, music, reactions: {}, userReactions: {}, comments: [] });
      renderReels();
    });
    renderReelsTrack();
  }

  function renderReelsTrack() {
    const track = qs('#reelsTrack');
    if (!state.reels.length) { track.innerHTML = '<div class="reel-item"><div class="reel-bg">Aucun réel pour le moment.</div></div>'; return; }
    track.innerHTML = state.reels.map(r => `
      <section class="reel-item" data-id="${r.id}">
        <div class="reel-bg">${r.mediaUrl ? `<video src="${escapeHtml(r.mediaUrl)}" controls playsinline loop></video>` : `<div>🎬 ${escapeHtml(r.title)}<br><span class="small muted">${escapeHtml(r.note || 'Aperçu interface — ajoutez une vidéo (URL/fichier local)')}</span>${r.music ? `<br><span class="small">🎵 ${escapeHtml(r.music)}</span>` : ''}</div>`}</div>
        <div class="reel-overlay">
          <div class="reel-info card" style="background:rgba(0,0,0,.35)">
            <h3>${escapeHtml(r.title)}</h3>
            <div class="small muted">${escapeHtml(r.author)} · ${r.type === 'video_musique' ? 'Vidéo + musique' : 'Vidéo'}</div>
            ${r.note ? `<div class="small" style="margin-top:6px">${escapeHtml(r.note)}</div>` : ''}
            ${r.music ? `<div class="small" style="margin-top:4px">🎵 ${escapeHtml(r.music)}</div>` : ''}
            ${commentsHTML(r, 'reels')}
          </div>
          <div class="reel-actions">${REACTIONS.map(rx => { const count = (r.reactions && r.reactions[rx.key]) || 0; const active = r.userReactions && r.userReactions[rx.key]; return `<div style="text-align:center"><button class="reaction-btn ${active ? 'active' : ''}" data-action="react" data-scope="reels" data-id="${r.id}" data-reaction="${rx.key}" title="${escapeHtml(rx.label)}">${rx.emoji}</button><div class="count">${count}</div></div>`; }).join('')}</div>
        </div>
      </section>`).join('');
    bindPostInteractions(track, state.reels, 'reels');
  }

  // -------- Profil / Maker Blog-Forum --------
  function getDraft() { return state.profile.draft; }
  function getPublished() { return state.profile.published; }

  function renderProfil() {
    const panel = qs('#view-profil');
    panel.innerHTML = `
      <div class="stack">
        <section class="card stack">
          <div class="row" style="justify-content:space-between;align-items:flex-start">
            <div>
              <h2 class="sec-title" style="margin-bottom:2px">Profil — Blog-Forum personnel</h2>
              <p class="small muted">Page personnelle configurable (Maker). Deux états : vue publique (aperçu) et mode édition.</p>
            </div>
            <div class="row">
              <button class="btn ${state.profileMode === 'view' ? 'primary' : ''} maker-btn" id="modeViewBtn">Voir ma page</button>
              <button class="btn ${state.profileMode === 'edit' ? 'primary' : ''} maker-btn" id="modeEditBtn">Modifier mon Blog-Forum</button>
            </div>
          </div>
          <div class="notice small"><strong>Relations Blogum :</strong> <em>follow</em> = sens unique ; <em>contact</em> = réciproque. Audiences/espaces et réactions suivent les règles du projet (gestion réelle selon backend). ${escapeHtml(storageNotice())}</div>
          ${state.maker.notice ? `<div class="notice small" style="border-left-color:rgba(39,209,127,.6)">${escapeHtml(state.maker.notice)}</div>` : ''}
        </section>
        <div id="profileContent" class="stack"></div>
      </div>`;
    qs('#modeViewBtn').onclick = () => { state.profileMode = 'view'; renderProfil(); };
    qs('#modeEditBtn').onclick = () => { state.profileMode = 'edit'; renderProfil(); };
    if (state.profileMode === 'edit') renderProfileEditor(); else renderProfilePublicView();
  }

  function renderProfilePublicView() {
    const pub = getPublished();
    const hasContent = (pub.bio && pub.bio.trim()) || (pub.rubrics && pub.rubrics.length);
    qs('#profileContent').innerHTML = `
      <section class="card stack">
        <h3 class="sub-title">Page profil (telle que les autres la verront)</h3>
        ${!hasContent ? '<div class="empty">Aucune rubrique affichée pour le moment. Passe en mode « Modifier mon Blog-Forum » pour composer et ajouter des rubriques à ton profil.</div>' : `
          <div class="post-head"><div><div class="post-author">${escapeHtml(pub.displayName || 'Vous')}</div><div class="post-meta">Page Blog-Forum personnelle</div></div></div>
          <div class="post-body">${escapeHtml(pub.bio || 'Bio à compléter.')}</div>
          <div class="row small muted" style="margin-top:8px">Follows (sens unique) : démo · Contacts (réciproques) : démo · Audiences selon rubriques/espaces</div>
        `}
      </section>
      <section class="stack">
        <h3 class="sub-title">Rubriques affichées</h3>
        ${(!pub.rubrics || !pub.rubrics.length) ? '<div class="empty">Aucune rubrique ajoutée au profil.</div>' : pub.rubrics.map(r => `
          <article class="card stack">
            <div class="rubric-head"><div><strong>${escapeHtml(r.title || 'Sans titre')}</strong> <span class="rubric-type">${escapeHtml(rubricTypeLabel(r.type))}</span></div></div>
            ${(r.questions || []).filter(q => q.include !== false && ((q.answer || '').trim() || (q.q || '').trim())).map(q => `
              <div class="qa-block">
                <div class="qa-question">${escapeHtml(q.q)}</div>
                <div class="post-body">${escapeHtml((q.answer || '').trim() ? q.answer : '(Réponse non renseignée)')}</div>
              </div>`).join('') || '<div class="small muted">Aucune réponse affichée dans cette rubrique.</div>'}
          </article>`).join('')}
      </section>
      <section class="notice small">Prévisualisation locale de la page publique. Les modifications se font dans « Modifier mon Blog-Forum » puis doivent être ajoutées/mises à jour sur le profil. ${escapeHtml(storageNotice())}</section>`;
  }

  function moveRubric(index, dir) {
    const arr = getDraft().rubrics;
    const ni = index + dir;
    if (ni < 0 || ni >= arr.length) return;
    const [item] = arr.splice(index, 1); arr.splice(ni, 0, item);
    saveLocal('Brouillon mis à jour (ordre des rubriques, local).');
    renderProfil();
  }

  function renderProfileEditor() {
    const draft = getDraft();
    if (!state.maker.selectedRubricId || !draft.rubrics.find(r => r.id === state.maker.selectedRubricId)) {
      state.maker.selectedRubricId = draft.rubrics[0] ? draft.rubrics[0].id : null;
    }
    const selected = draft.rubrics.find(r => r.id === state.maker.selectedRubricId) || null;
    qs('#profileContent').innerHTML = `
      <section class="card stack">
        <h3 class="sub-title">Maker — Modifier mon Blog-Forum</h3>
        <p class="small muted">Compose ta page personnelle (blog-forum) par rubriques. Boutons du générateur distincts du bouton « Publier » du Mur.</p>
        <div class="row">
          <label class="field" style="flex:1;min-width:200px">Nom affiché<input type="text" id="profileName" value="${escapeHtml(draft.displayName || '')}" placeholder="Votre nom"></label>
        </div>
        <label class="field">Bio / présentation<textarea id="profileBio" placeholder="Présentez votre page Blog-Forum...">${escapeHtml(draft.bio || '')}</textarea></label>
        <div class="row maker-actions">
          <button class="btn maker-btn" id="saveDraftBtn">Enregistrer le brouillon</button>
          <button class="btn maker-btn" id="previewWholeBtn">${state.maker.pagePreview ? 'Masquer' : 'Prévisualiser'} la page entière</button>
          <button class="btn maker-btn primary" id="publishProfileBtn">Mettre à jour ma page profil</button>
        </div>
      </section>

      <section class="card stack">
        <h3 class="sub-title">Rubriques (thèmes proposés + libres)</h3>
        <p class="small muted">Thèmes proposés : Professionnel, Familial, Amical, Sentimental / amoureux. Tu peux créer, renommer, réordonner et supprimer librement tes rubriques.</p>
        <div class="row maker-actions">
          <button class="btn maker-btn" data-add-rubric="professionnel">+ Professionnel</button>
          <button class="btn maker-btn" data-add-rubric="familial">+ Familial</button>
          <button class="btn maker-btn" data-add-rubric="amical">+ Amical</button>
          <button class="btn maker-btn" data-add-rubric="sentimental">+ Sentimental/amoureux</button>
          <button class="btn maker-btn" data-add-rubric="autre">+ Rubrique libre</button>
        </div>
        <div id="rubricManager" class="rubric-list"></div>
      </section>

      <section id="rubricEditorArea" class="stack"></section>
      ${state.maker.pagePreview ? renderWholePreviewHTML() : ''}
    `;

    qs('#profileName').addEventListener('input', e => { draft.displayName = e.target.value; });
    qs('#profileBio').addEventListener('input', e => { draft.bio = e.target.value; });
    qs('#saveDraftBtn').onclick = () => { saveLocal(); renderProfil(); };
    qs('#previewWholeBtn').onclick = () => { state.maker.pagePreview = !state.maker.pagePreview; renderProfil(); };
    qs('#publishProfileBtn').onclick = () => {
      // publie la page entière (profil + rubriques telles que dans le brouillon affichable)
      state.profile.published = deepClone({
        displayName: draft.displayName,
        bio: draft.bio,
        rubrics: draft.rubrics.map(r => ({
          ...deepClone(r),
          questions: (r.questions || []).filter(q => q.include !== false)
        }))
      });
      saveLocal('Page profil mise à jour et enregistrée localement sur cet appareil.');
      state.profileMode = 'view';
      renderProfil();
    };
    qsa('[data-add-rubric]').forEach(btn => btn.onclick = () => {
      const r = makeRubric(btn.dataset.addRubric);
      draft.rubrics.push(r);
      state.maker.selectedRubricId = r.id;
      saveLocal('Rubrique ajoutée au brouillon (local).');
      renderProfil();
    });

    renderRubricManager(draft, selected);
    renderRubricEditorArea(selected);
  }

  function renderRubricManager(draft, selected) {
    const wrap = qs('#rubricManager');
    if (!draft.rubrics.length) { wrap.innerHTML = '<div class="empty">Aucune rubrique. Ajoute un thème proposé ou une rubrique libre.</div>'; return; }
    wrap.innerHTML = draft.rubrics.map((r, i) => `
      <div class="rubric-item ${selected && selected.id === r.id ? 'rubric-selected' : ''}">
        <div class="rubric-head">
          <div style="min-width:0;flex:1">
            <input class="rubric-title-input" data-rubric-title="${r.id}" value="${escapeHtml(r.title || '')}" placeholder="Titre de la rubrique">
            <div class="row small muted" style="margin-top:4px">
              <span class="rubric-type">${escapeHtml(rubricTypeLabel(r.type))}</span>
              <span>${(r.questions || []).filter(q => q.include !== false).length} question(s) incluse(s)</span>
            </div>
          </div>
        </div>
        <div class="row maker-actions" style="margin-top:8px">
          <button class="btn small maker-btn" data-select-rubric="${r.id}">Éditer</button>
          <button class="btn small maker-btn" data-move-rubric="${r.id}" data-dir="-1" ${i===0?'disabled':''}>↑</button>
          <button class="btn small maker-btn" data-move-rubric="${r.id}" data-dir="1" ${i===draft.rubrics.length-1?'disabled':''}>↓</button>
          <button class="btn small maker-btn danger" data-del-rubric="${r.id}">Supprimer</button>
        </div>
      </div>`).join('');

    qsa('[data-rubric-title]').forEach(inp => inp.addEventListener('input', e => {
      const r = draft.rubrics.find(x => x.id === e.target.dataset.rubricTitle);
      if (r) r.title = e.target.value;
    }));
    qsa('[data-select-rubric]').forEach(btn => btn.onclick = () => { state.maker.selectedRubricId = btn.dataset.selectRubric; state.maker.questionPreviewRubricId = null; renderProfil(); });
    qsa('[data-move-rubric]').forEach(btn => btn.onclick = () => { const idx = draft.rubrics.findIndex(x => x.id === btn.dataset.moveRubric); if (idx >= 0) moveRubric(idx, Number(btn.dataset.dir)); });
    qsa('[data-del-rubric]').forEach(btn => btn.onclick = () => {
      draft.rubrics = draft.rubrics.filter(x => x.id !== btn.dataset.delRubric);
      if (state.maker.selectedRubricId === btn.dataset.delRubric) state.maker.selectedRubricId = draft.rubrics[0] ? draft.rubrics[0].id : null;
      saveLocal('Rubrique supprimée du brouillon (local).');
      renderProfil();
    });
  }

  function renderWholePreviewHTML() {
    const d = getDraft();
    return `
      <section class="preview-box stack">
        <h3 class="sub-title">Prévisualisation de la page entière (avant affichage)</h3>
        <div class="card">
          <div class="post-author">${escapeHtml(d.displayName || 'Votre profil')}</div>
          <div class="post-body" style="margin-top:6px">${escapeHtml(d.bio || 'Bio à compléter.')}</div>
        </div>
        ${d.rubrics.length ? d.rubrics.map(r => `
          <div class="card">
            <div class="rubric-head"><strong>${escapeHtml(r.title || 'Sans titre')}</strong><span class="rubric-type">${escapeHtml(rubricTypeLabel(r.type))}</span></div>
            ${(r.questions || []).filter(q => q.include !== false).map(q => `
              <div class="qa-block"><div class="qa-question">${escapeHtml(q.q || '(Question)')}</div><div class="post-body">${escapeHtml((q.answer || '').trim() ? q.answer : '(Réponse à compléter)')}</div></div>`).join('') || '<div class="small muted">Aucune question incluse.</div>'}
          </div>`).join('') : '<div class="empty">Aucune rubrique dans le brouillon.</div>'}
        <p class="small muted">Ceci est un aperçu. Clique sur « Mettre à jour ma page profil » pour l’afficher telle que les autres la verront.</p>
      </section>`;
  }

  function renderRubricEditorArea(r) {
    const area = qs('#rubricEditorArea');
    if (!r) { area.innerHTML = '<div class="empty">Sélectionne ou crée une rubrique pour la configurer.</div>'; return; }
    const isPreview = state.maker.questionPreviewRubricId === r.id;
    if (isPreview) {
      area.innerHTML = `
        <section class="preview-box stack">
          <h3 class="sub-title">Prévisualisation de la rubrique (avant affichage)</h3>
          <div><strong>${escapeHtml(r.title || 'Sans titre')}</strong> <span class="rubric-type">${escapeHtml(rubricTypeLabel(r.type))}</span></div>
          ${(r.questions || []).filter(q => q.include !== false).map(q => `
            <div class="qa-block">
              <div class="qa-question">${escapeHtml(q.q || '(Question)')}</div>
              <div class="small muted">Exemple de prompt (aide) :</div>
              <div class="prompt-example">${escapeHtml(q.prompt || '')}</div>
              <div class="small muted">Réponse :</div>
              <div class="post-body">${escapeHtml((q.answer || '').trim() ? q.answer : '(Réponse à compléter)')}</div>
            </div>`).join('') || '<div class="small muted">Aucune question incluse.</div>'}
          <div class="row maker-actions">
            <button class="btn maker-btn primary" id="applyRubricBtn">Ajouter / mettre à jour cette rubrique sur ma page profil</button>
            <button class="btn maker-btn" id="backEditRubricBtn">Revenir à l’édition</button>
          </div>
        </section>`;
      qs('#applyRubricBtn').onclick = () => {
        // met à jour la rubrique correspondante dans le profil publié
        const pub = getPublished();
        const idx = pub.rubrics.findIndex(x => x.id === r.id);
        const pubRubric = deepClone({ ...r, questions: (r.questions || []).filter(q => q.include !== false) });
        if (idx >= 0) pub.rubrics[idx] = pubRubric; else pub.rubrics.push(pubRubric);
        // garder cohérent nom/bio depuis brouillon
        pub.displayName = getDraft().displayName; pub.bio = getDraft().bio;
        saveLocal('Rubrique ajoutée/mise à jour sur la page profil (local).');
        state.maker.questionPreviewRubricId = null;
        state.profileMode = 'view';
        renderProfil();
      };
      qs('#backEditRubricBtn').onclick = () => { state.maker.questionPreviewRubricId = null; renderProfil(); };
      return;
    }

    area.innerHTML = `
      <section class="card stack" style="border-color:rgba(255,210,63,.25)">
        <div class="row" style="justify-content:space-between;align-items:center">
          <h3 class="sub-title">Édition de la rubrique : ${escapeHtml(r.title || 'Sans titre')}</h3>
          <span class="rubric-type">${escapeHtml(rubricTypeLabel(r.type))}</span>
        </div>
        <p class="small muted">Pour chaque question : une question claire, <strong>un seul exemple de prompt modifiable</strong> (aide), et <strong>ta réponse en texte libre</strong> (séparée). Tu peux ignorer/supprimer une question ou ajouter tes propres questions. Modifie/supprime aussi les réponses déjà affichées en éditant puis en mettant à jour la rubrique.</p>
        <div id="questionsEditor" class="stack"></div>
        <div class="row maker-actions">
          <button class="btn maker-btn" id="addQuestionBtn">+ Ajouter une question</button>
          <button class="btn maker-btn" id="resetQuestionsBtn">Réinitialiser les questions du thème</button>
        </div>
        <div class="row maker-actions" style="margin-top:4px">
          <button class="btn maker-btn" id="saveDraftRubricBtn">Enregistrer le brouillon</button>
          <button class="btn maker-btn primary" id="previewRubricBtn">Prévisualiser la rubrique</button>
        </div>
      </section>`;

    renderQuestionsEditor(r);
    qs('#addQuestionBtn').onclick = () => { r.questions.push({ id: uid(), q: 'Ta question', prompt: 'Exemple : écris ici un prompt d’aide modifiable...', answer: '', include: true, isCustom: true }); renderRubricEditorArea(r); };
    qs('#resetQuestionsBtn').onclick = () => { const answersByQ = {}; (r.questions||[]).forEach(q => { if (q.q) answersByQ[q.q] = q.answer; }); r.questions = makeQuestions(r.type).map(q => ({...q, answer: answersByQ[q.q] || ''})); renderRubricEditorArea(r); };
    qs('#saveDraftRubricBtn').onclick = () => { saveLocal(); renderProfil(); };
    qs('#previewRubricBtn').onclick = () => { state.maker.questionPreviewRubricId = r.id; renderProfil(); };
  }

  function renderQuestionsEditor(r) {
    const wrap = qs('#questionsEditor');
    const qsList = r.questions || [];
    if (!qsList.length) { wrap.innerHTML = '<div class="empty">Aucune question. Ajoute une question personnalisée.</div>'; return; }
    wrap.innerHTML = qsList.map((q, i) => `
      <div class="qa-block ${q.include === false ? 'qa-ignored' : ''}">
        <div class="row" style="justify-content:space-between;align-items:center;gap:8px">
          <div class="qa-question" style="margin:0">Question ${i + 1}</div>
          <label class="small muted" style="display:flex;align-items:center;gap:6px"><input type="checkbox" data-q-include="${q.id}" ${q.include !== false ? 'checked' : ''}> Inclure dans la rubrique</label>
        </div>
        <label class="field" style="margin-top:6px">Question (claire, modifiable)
          <textarea data-q-text="${q.id}" rows="2" placeholder="Écris la question...">${escapeHtml(q.q || '')}</textarea>
        </label>
        <label class="field">Exemple de prompt (aide modifiable, non prédéfini)
          <textarea data-q-prompt="${q.id}" rows="2" placeholder="Exemple de prompt d’aide...">${escapeHtml(q.prompt || '')}</textarea>
        </label>
        <label class="field">Ta réponse (texte libre, séparé)
          <textarea data-q-answer="${q.id}" rows="4" placeholder="Écris librement ta réponse (tu peux ignorer l’exemple)...">${escapeHtml(q.answer || '')}</textarea>
        </label>
        <div class="row maker-actions">
          <button class="btn small maker-btn danger" data-q-delete="${q.id}">Supprimer la question</button>
        </div>
      </div>`).join('');

    qsa('[data-q-include]').forEach(el => el.onchange = e => { const q = qsList.find(x => x.id === e.target.dataset.qInclude); if (q) q.include = e.target.checked; });
    qsa('[data-q-text]').forEach(el => el.addEventListener('input', e => { const q = qsList.find(x => x.id === e.target.dataset.qText); if (q) q.q = e.target.value; }));
    qsa('[data-q-prompt]').forEach(el => el.addEventListener('input', e => { const q = qsList.find(x => x.id === e.target.dataset.qPrompt); if (q) q.prompt = e.target.value; }));
    qsa('[data-q-answer]').forEach(el => el.addEventListener('input', e => { const q = qsList.find(x => x.id === e.target.dataset.qAnswer); if (q) q.answer = e.target.value; }));
    qsa('[data-q-delete]').forEach(btn => btn.onclick = () => { r.questions = qsList.filter(x => x.id !== btn.dataset.qDelete); renderRubricEditorArea(r); });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
