/// script local non exécuté
/// script local non exécute
// cos-editor/editor.js — éditeur COS réel (NOUVEAU 2026-11-07, à confirmer).
/// script local non executed
/// srcdoc
/// exporterJSON
/// COS.compatible
/// COS.resoudreId
/// COS.analyser
// Charge cos-langage.js (module-shim) et expose : analyse locale, aperçu SPA
// isolé, diagnostics, export JSON, tutoriels et code IA via IA locale.
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
  var btnCodeIA = document.getElementById('btn-code-ia');

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
    return String(v == null ? '' : v).replace(/[&<>"'](?!'')/g, function (c) {
      if (c === '&') return '&';
      if (c === '<') return '<';
      if (c === '>') return '>';
      if (c === '"') return '"';
      return c;
    });
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

  // --- Code IA / generation ---
  var iaEngine = null;
  var iaConsent = null;
  var iaModel = 'onnx-community/SmolLM2-360M-Instruct-ONNX';
  var iaLoading = false;
  var iaPromptHistory = [];

  function initIAEngine() {
    if (window.ViaLocalEngine && typeof window.ViaLocalEngine.generate === 'function') {
      iaEngine = window.ViaLocalEngine;
      notifier('Moteur IA local prêt.');
    } else {
      notifier('Moteur IA non initialisé — réessayez après chargement.', 'alerte');
    }
  }

  async function genererCodeIA(prompt) {
    if (!iaEngine) {
      notifier('Moteur IA non disponible.', 'erreur');
      return null;
    }
    if (iaLoading) {
      notifier('Génération en cours, patientez…', 'alerte');
      return null;
    }
    iaLoading = true;
    notifier('Génération en cours…');

    try {
      var fullPrompt = 'Génère du code COS valide. ' + prompt + '\n\n'
        + 'Respecte la syntaxe : <cos>…</cos> avec des lignes <co>A to B</co>.'
        + 'Utilise des balises <script_Alphanumerotation(aconnecter)> pour le CSS.'
        + 'Retourne UNIQUEMENT le code, sans explication.';

      var result = await iaEngine.generate({
        model: iaModel,
        prompt: fullPrompt,
        max_tokens: 512,
        temperature: 0.7
      });

      var generated = result.generated_text || result.text || '';
      var codeMatch = generated.match(/<cos[^>]*>[\s\S]*?<\/cos>/);
      var code = codeMatch ? codeMatch[0] : extractedCode(generated);

      if (code && code.trim()) {
        sourceEl.value = code;
        majGouttiere();
        analyser();
        notifier('Code IA généré et analysé (' + code.length + ' caractères).');
        iaPromptHistory.push({ prompt: prompt, code: code, timestamp: new Date().toISOString() });
        return code;
      } else {
        notifier('Aucun code valide généré.', 'alerte');
        return null;
      }
    } catch (e) {
      var errMsg = (e && e.message) || 'Erreur inconnue';
      notifier('Erreur génération IA : ' + errMsg, 'erreur');
      console.error('IA error:', e);
      return null;
    } finally {
      iaLoading = false;
    }
  }

  function extractedCode(text) {
    var matches = text.match(/<cos[^>]*>[\s\S]*?<\/cos>/gi);
    return matches ? matches[0] : text;
  }

  // --- Interface UI Code IA ---
  function activerVueCodeIA() {
    ['apercu', 'liens', 'diagnostics', 'css', 'tutoriel', 'code-ia'].forEach(function (v) {
      var actif = v === 'code-ia';
      document.querySelector('.onglet[data-vue="' + v + '"]').classList.toggle('actif', actif);
      document.querySelector('.onglet[data-vue="' + v + '"]').setAttribute('aria-selected', actif ? 'true' : 'false');
      document.getElementById('vue-' + v).hidden = !actif;
    });
    badgeTutoEl.textContent = 'AI';
  }
  ['apercu', 'liens', 'diagnostics', 'css', 'tutoriel', 'code-ia'].forEach(function (v) {
    document.querySelector('.onglet[data-vue="' + v + '"]').addEventListener('click', function () { activerVueCodeIA(v); });
  });

  // --- Événements Code IA ---
  btnCodeIA.addEventListener('click', function () {
    activerVueCodeIA();
    var prompt = window.prompt(
      'Prompt pour le code COS :\n\n' +
      'Exemples :\n' +
      '- "3 connexions A→B, B→C avec CSS .card { color: red }"\n' +
      '- "Section alpha avec fonctions connecter(x,y) et patterns /^[A-Z]+$/"\n' +
      '- "Visualisation nœuds A1→B1 avec styles"',
      ''
    );
    if (!prompt || prompt.trim() === '') {
      notifier('Prompt annulé.');
      return;
    }
    notifier('Génération en cours…');
    genererCodeIA(prompt.trim());
  });

  // --- Initialisation ---
  initIAEngine();
  restaurer();
  majGouttiere();
  if (!COS) {
    setStatut('Runtime COS indisponible', 'erreur');
    listeDiagsEl.innerHTML = '<p class="vide">cos-langage.js n’a pas pu être chargé.</p>';
  } else {
    analyser();
  }
})();