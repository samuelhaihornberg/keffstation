// cos-editor/editor.js — éditeur COS réel (NOUVEAU 2026-11-07, à confirmer).
// Charge cos-langage.js (module-shim) et expose : analyse locale, aperçu SPA
// isolé, diagnostics, export JSON, tutoriels et info recyclor.
// Aucun script personnalisé n'est exécuté : les balises <script_…> restent
// des opérandes typés du graphe COS.
(function () {
  'use strict';

  var COS = window.COSLangage;
  var sourceEl = document.getElementById('source');
  var gouttiereEl = document.getElementById('gouttiere');
  var compteurEl = document.getElementById('compteur-source');
  var statutEl = document.getElementById('statut');
  var statsEl = document.getElementById('stats');
  var apercuEl = document.getElementById('apercu');
  var listeLiensEl = document.getElementById('liste-liens');
  var listeDiagsEl = document.getElementById('liste-diagnostics');
  var listeCssEl = document.getElementById('liste-css');
  var badgeLiensEl = document.getElementById('badge-liens');
  var badgeDiagsEl = document.getElementById('badge-diags');
  var badgeCssEl = document.getElementById('badge-css');
  var badgeTutoEl = document.getElementById('badge-tuto');
  var toastEl = document.getElementById('toast');
  var btnAnalyser = document.getElementById('btn-analyser');
  var btnExemple = document.getElementById('btn-exemple');
  var btnDefaut = document.getElementById('btn-defaut');
  var btnEffacer = document.getElementById('btn-effacer');
  var btnCopier = document.getElementById('btn-copier');
  var btnTelecharger = document.getElementById('btn-telecharger');
  var btnTutoriel = document.getElementById('btn-tutoriel');

  var STORAGE_KEY = 'cos-editor-source-v1';
  var dernier = null;
  var timerAnalyse = null;
  var timerToast = null;

  var EXEMPLE = [
    '<!-- Éditeur COS : chaque <co> porte une connexion. -->',
    '<cos id="demo-editeur">',
    '  <co>',
    '    <script_Alphanumerotation(aconnecter)>',
    '      :root { --encre: #e8ebff; --fond-noeud: #141936; }',
    '      .card {',
    '        background: var(--fond-noeud);',
    '        border: 1px solid #2c335c;',
    '        border-radius: 14px;',
    '        padding: 14px;',
    '        color: var(--encre);',
    '      }',
    '      A1 { box-shadow: 0 0 0 2px #27d17f; }',
    '      B2 { border-color: #0066ff; }',
    '      @media (max-width: 520px) {',
    '        .card { padding: 10px; }',
    '      }',
    '    </script_Alphanumerotation(aconnecter)>',
    '    <script_alphanumerotationdefonctionaconnecter id="A1"> to <script_founctionvaleuratribualphanumeroté id="B2">',
    '  </co>',
    '  <co>A1 ➡️ C3</co>',
    '  <co><script_C3 id="C3"> to <script_D4 id="D4"></co>',
    '  <co>001 ➡️ 002</co>',
    '</cos>'
  ].join('\n');

  var CSS_APERCU = [
    '*{box-sizing:border-box}',
    'html,body{margin:0;min-height:100%;background:#0b0d1c;color:#e8ebff;font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}',
    'body{padding:18px}',
    '.cos-doc{max-width:760px;margin:0 auto;display:grid;gap:18px}',
    '.cos-section h2{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#8f98c9;margin:0 0 8px;font-weight:700}',
    '.cos-noeuds{display:flex;flex-wrap:wrap;gap:8px}',
    '.cos-node{display:inline-flex;flex-direction:column;gap:2px;padding:8px 10px;border:1px solid #2c335c;border-radius:10px;background:#141936;min-width:90px;max-width:100%}',
    '.cos-node b{font-size:12px;color:#7ce3b0;overflow-wrap:anywhere}',
    '.cos-node small{font-size:10px;color:#9aa4d4;overflow-wrap:anywhere}',
    '.cos-liens{display:grid;gap:8px}',
    '.cos-lien{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px 12px;border:1px solid #2c335c;border-radius:12px;background:#141936}',
    '.cos-rang{font-size:10px;color:#6973a8;min-width:16px}',
    '.cos-extremite{font:600 12px/1.3 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;padding:5px 8px;border-radius:8px;background:#0c1028;border:1px solid #30396b;overflow-wrap:anywhere;max-width:100%}',
    '.cos-fleche{color:#7ce3b0;font-weight:800}',
    '.cos-op{font-size:10px;color:#8f98c9;border:1px solid #2c335c;border-radius:999px;padding:2px 7px}',
    '.cos-badge{font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:#ffd23f;border:1px solid #5c4a12;background:#2a2308;border-radius:999px;padding:2px 7px}',
    '.vide{color:#8f98c9;text-align:center;padding:32px 0}'
  ].join('\n');

  // --- Aide au chargement / stockage ---
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>""]/g, function (c) {
      if (c === '&') return '&amp';
      if (c === '<') return '&lt';
      if (c === '>') return '&gt';
      if (c === '"') return '&quot';
      return c;
    }) + ';';
  }
  function notifier(message, type) {
    toastEl.textContent = message;
    toastEl.setAttribute('data-type', type || 'ok');
    toastEl.classList.add('visible');
    clearTimeout(timerToast);
    timerToast = setTimeout(function () { toastEl.classList.remove('visible'); }, 2600);
  }
  function setStatut(message, niveau) {
    statutEl.textContent = message;
    statutEl.setAttribute('data-niveau', niveau || 'info');
  }
  function compterLignes(texte) {
    return String(texte || '').split('\n').length;
  }
  function majGouttiere() {
    var n = compterLignes(sourceEl.value);
    var lignes = new Array(n);
    for (var i = 1; i <= n; i++) lignes[i - 1] = i;
    gouttiereEl.textContent = lignes.join('\n');
    compteurEl.textContent = n + (n > 1 ? ' lignes' : ' ligne');
    gouttiereEl.scrollTop = sourceEl.scrollTop;
  }
  function sauver() {
    try { localStorage.setItem(STORAGE_KEY, sourceEl.value); } catch (e) {}
  }
  function restaurer() {
    var src = null;
    try { src = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    sourceEl.value = (src && src.trim()) ? src : EXEMPLE;
  }

  // --- Génération du tutoriel dynamique ---
  function genererTutoriel() {
    var sections = [];

    // 1. Syntaxe de base
    sections.push({
      titre: 'Syntaxe de base',
      contenu: [
        'Le langage COS utilise deux types de blocs :',
        '<code><cos>…</cos></code> regroupe un document de connexions.',
        '<code><co>…</code> définit une connexion (une ligne « A to B »).',
        '',
        'Formes acceptées :',
        '<ul>',
        '<li><code>A to B</code> — connexion textuelle (A → B).</li>',
        '<li><code>A➡️B</code> — aller (pointe = receveur = B).</li>',
        '<li><code>A⬅️B</code> — retour (pointe = receveur = A).</li>',
        '<li><code>A ↔ B</code> — description (jamais traversable).</li>',
        '</ul>',
        '',
        'Exemple :',
        '<pre><code><cos><co>A to B</co><co>C ➡️ D</co></cos></code></pre>'
      ].join('\n')
    });

    // 2. Balises script personnalisées
    sections.push({
      titre: 'Balises <script_…> (opérandes typés)',
      contenu: [
        'NOUVEAU 2026-11-07 : les balises <code><script_…></code> sont des opérandes',
        'typés du graphe COS. Elles ne s\'exécutent jamais.',
        '',
        'Formes acceptées :',
        '<ul>',
        '<li><code><script_alphanumerotationdefonctionaconnecter></code> — balise seule.</li>',
        '<li><code><script_Alphanumerotation(aconnecter)></code> — avec attributs nom.</li>',
        '<li><code><script_… id="A1"</code> — avec attribut <code>id</code>.</li>',
        '<li><code><script_… valeur="X"</code> — attribut <code>valeur</code>.</li>',
        '<li><code><script_… nom="X"</code> — attribut <code>nom</code>.</li>',
        '<li><code><script_…>contenu</script_…></code> — balise avec contenu.</li>',
        '</ul>',
        '',
        'Valeur retenue : attribut id / valeur / nom / contenu / nom de balise (dans cet ordre).',
        '',
        'Exemple :',
        '<pre><code><cos><script_alphanumerotationdefonctionaconnecter id="A1"> to <script_founctionvaleuratribualphanumeroté id="B2"></cos></code></code></pre>',
        '',
        'Résultat parsing :',
        '<pre><code>{ de: "alphanumerotationdefonctionaconnecter", vers: "founctionvaleuratribualphanumeroté", op: "to", script: true, operandes: { de: { id: "A1" }, vers: { id: "B2"} } }</code></code></pre>'
      ].join('\n')
    });

    // 3. CSS alphanumérique
    sections.push({
      titre: 'CSS alphanumérique dans <script_Alphanumerotation(aconnecter)>',
      contenu: [
        'Les blocs <code><script_Alphanumerotation(aconnecter)>…</script_Alphanumerotation(aconnecter)></code>',
        'peuvent contenir du CSS réel.',
        '',
        'Les sélecteurs alphanumériques purs (A1, B2, C3…) sont automatiquement',
        'convertis en <code>[data-cos="A1"]</code> pour l\'aperçu.',
        '',
        'Exemple CSS :',
        '<pre><code><script_Alphanumerotation(aconnecter)>.card { background:#111; color:#fff } A1 { box-shadow: 0 0 0 2px #27d17f }</script_Alphanumerotation(aconnecter>)</code></code></pre>',
        '',
        'Résultat : bloc CSS avec règles .card et [data-cos="A1"].',
        '',
        'Interdits : @import, javascript:, expression(, HTML tags, iframes.'
      ].join('\n')
    });

    // 4. Récyclor : états, polarités, rythmes de données
    sections.push({
      titre: 'Recyclor — États, polarités & rythmes de données',
      contenu: [
        'Le module <code>recyclor.js</code> gère la sauvegarde/restoration bit-à-bit',
        'des données BLM (Base de Ligne de Moteurs).',
        '',
        'États de santé :',
        '<ul>',
        '<li><b>Sain (100)</b> — données pleinement valides.</li>',
        '<li><b>Réduite</b> — santé dégradée, données conservées mais fragilisées.</li>',
        '<li><b>Vide (repos)</b> — cache libéré, données préservées en backup.</li>',
        '</ul>',
        '',
        'Polarités de données (exemples concepts non implémentés) :',
        '<ul>',
        '<li><code>ern</code> — échanges réciproques nord-sud.</li>',
        '<li><code>mattern</code> — motifs matérialisés.</li>',
        '<li><code>mzttern</code> — matrices de tendances.</li>',
        '<li><code>couzern</code> — cycles d\'usage zéro.</li>',
        '</ul>',
        '',
        'Rythmes de recyclage :',
        '<ul>',
        '<li><b>Compute</b> : <i>improvise → propose → valide collective</i>.</li>',
        '<li><b>Dry-run</b> : rien ne relâche sans <code>autorise=true</code>.</li>',
        '<li><b>Backup</b> : empreinte SHA-256 avant toute écriture.</li>',
        '<li><b>Vide organique</b> : rythme doux, paliers décroissants selon santé.</li>',
        '</ul>',
        '',
        'Fonctionnement :',
        '<ol>',
        '<li>Copier les données.</li>',
        '<li>Mesurer la santé (empreinte SHA-256).</li>',
        '<li>Réduire (dégrade) ou vider (cache).</li>',
        '<li>Recoller l\'original → état revient à 100%.</li>',
        '<li>Suppression ciblée sous confirmation.</li>',
        '</ol>'
      ].join('\n')
    });

    // 5. Tutoriel i.assist (chat)
    sections.push({
      titre: 'Tutoriel i.assist — Chat COS',
      contenu: [
        'Bienvenue dans l\'assistant interactif COS. Voici comment utiliser',
        'l\'éditeur en mode chat :',
        '',
        '<b>Commandes de base :</b>',
        '<ul>',
        '<li><code>analyser</code> — analyse le code source COS.</li>',
        '<li><code>exemple</code> — charge un exemple de démonstration.</li>',
        '<li><code>cos-defaut</code> — charge le document par défaut (118 connexions).</li>',
        '<li><code>effacer</code> — vide la source actuelle.</li>',
        '</ul>',
        '',
        '<b>Exemple de chat :</b>',
        '<pre><code>utilisateur: analyser\nassistant: 4 liens reconnises, 4 nœuds, 5 règles CSS valides.Statut: Analyse OK — 4 lien(s) ok</code></pre>',
        '',
        '<b>Diagnostics en temps réel :</b>',
        '<ul>',
        '<li>Les modificateurs inconnus (ex. « i ») sont signalés et le lien non exécuté.</li>',
        '<li>Les IDs non alphanumériques sont rejetés.</li>',
        '<li>Les constructions CSS interdites sont détectées et refusées.</li>',
        '<li>Les opérandes <code><script_…></code> restent typés, jamais exécutés.</li>',
        '</ul>'
      ].join('\n')
    });

    // Construction HTML du tutoriel
    var html = '';
    sections.forEach(function (s) {
      html += '<div class="tutoriel-section">';
      html += '<h3>' + esc(s.titre) + '</h3>';
      html += '<p>' + esc(s.contenu).replace(/\n/g, '</p><p>') + '</p>';
      if (s.contenu.match(/<pre>/)) {
        // Extraire le bloc pre
        var preMatch = s.contenu.match(/<pre><code>([\s\S]*?)<\/code><\/pre>/);
        if (preMatch) {
          html += '<pre><code>' + esc(preMatch[1]) + '</code></pre>';
        }
      }
      html += '</div>';
    });
    return html;
  }

  // --- Initialisation UI ---
  function activerVue(nom) {
    ['apercu', 'liens', 'diagnostics', 'css', 'tutoriel'].forEach(function (v) {
      var actif = nom === v;
      document.querySelector('.onglet[data-vue="' + v + '"]').classList.toggle('actif', actif);
      document.querySelector('.onglet[data-vue="' + v + '"]').setAttribute('aria-selected', actif ? 'true' : 'false');
      document.getElementById('vue-' + v).hidden = !actif;
    });
    // Mise à jour du badge tutoriel
    badgeTutoEl.textContent = '?';
  }
  ['apercu', 'liens', 'diagnostics', 'css', 'tutoriel'].forEach(function (v) {
    document.querySelector('.onglet[data-vue="' + v + '"]').addEventListener('click', function () { activerVue(v); });
  });

  // --- Événements ---
  sourceEl.addEventListener('input', function () {
    majGouttiere();
    sauver();
    planifierAnalyse();
  });
  sourceEl.addEventListener('scroll', function () {
    gouttiereEl.scrollTop = sourceEl.scrollTop;
  });
  sourceEl.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      sourceEl.setRangeText('  ', sourceEl.selectionStart, sourceEl.selectionEnd, 'end');
      majGouttiere();
      sauver();
      planifierAnalyse();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      analyser();
    }
  });

  btnAnalyser.addEventListener('click', analyser);
  btnExemple.addEventListener('click', function () {
    sourceEl.value = EXEMPLE;
    majGouttiere();
    analyser();
    notifier('Exemple chargé : balises <script_…> et CSS alphanumérique.');
  });
  btnDefaut.addEventListener('click', function () {
    if (typeof window.COSDefaut !== 'string') {
      notifier('cos-defaut.js indisponible.', 'erreur');
      return;
    }
    sourceEl.value = window.COSDefaut;
    majGouttiere();
    analyser();
    notifier('cos-defaut chargé : 118 connexions.');
  });
  btnEffacer.addEventListener('click', function () {
    if (sourceEl.value.trim() && !window.confirm('Effacer la source actuelle ?')) return;
    sourceEl.value = '';
    majGouttiere();
    analyser();
    notifier('Source effacée.');
  });
  btnCopier.addEventListener('click', copierJSON);
  btnTelecharger.addEventListener('click', telechargerJSON);
  btnTutoriel.addEventListener('click', function () {
    activerVue('tutoriel');
    var tutorielHTML = genererTutoriel();
    document.getElementById('conteneur-tutoriel').innerHTML = tutorielHTML;
    notifier('Tutoriel affiché.');
  });

  // --- Départ ---
  restaurer();
  majGouttiere();
  if (!COS) {
    setStatut('Runtime COS indisponible', 'erreur');
    listeDiagsEl.innerHTML = '<p class="vide">cos-langage.js n’a pas pu être chargé.</p>';
  } else {
    analyser();
  }
})();