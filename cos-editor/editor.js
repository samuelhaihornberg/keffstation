// cos-editor/editor.js — éditeur COS réel (NOUVEAU 2026-11-07, à confirmer).
// Charge cos-langage.js (module-shim) et expose : analyse locale, aperçu HTML
// isolé, diagnostics, export JSON. Aucun script personnalisé n'est exécuté :
// les balises <script_…> restent des opérandes typés du graphe COS.
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
  var toastEl = document.getElementById('toast');
  var btnAnalyser = document.getElementById('btn-analyser');
  var btnExemple = document.getElementById('btn-exemple');
  var btnDefaut = document.getElementById('btn-defaut');
  var btnEffacer = document.getElementById('btn-effacer');
  var btnCopier = document.getElementById('btn-copier');
  var btnTelecharger = document.getElementById('btn-telecharger');

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

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
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

  // ------------------------------------------------------------- diagnostics
  function nomDef(r) {
    if (!r || !r.resolu) return '';
    var d = r.def || {};
    return d.nom || d.classe || r.id;
  }

  function estScript(id, cartes) {
    return !!(cartes && cartes[id] && cartes[id].classe === 'script');
  }

  function cartesLocales(result) {
    var cartes = {};
    Object.keys(result.cartes || {}).forEach(function (k) { cartes[k] = result.cartes[k]; });
    (result.liens || []).forEach(function (lien) {
      [lien.donneur, lien.receveur].forEach(function (id) {
        if (cartes[id]) return;
        var r = COS.resoudreId(id, cartes);
        if (r.resolu) cartes[r.id] = r.def;
      });
    });
    return cartes;
  }

  function diagnostiquer(result, cartes) {
    var diags = [];
    (result.notes || []).forEach(function (note) {
      diags.push({ niveau: 'alerte', texte: note });
    });
    (result.styles || []).forEach(function (css, i) {
      if (css.ok) {
        diags.push({ niveau: 'ok', texte: 'CSS bloc ' + (i + 1) + ' : ' + css.rules.length + ' règle(s) valide(s).' });
      }
      (css.erreurs || []).forEach(function (erreur) {
        diags.push({ niveau: 'erreur', texte: 'CSS bloc ' + (i + 1) + ' : ' + erreur });
      });
    });
    (result.liens || []).forEach(function (lien, i) {
      var etiquette = 'Lien ' + (i + 1) + ' « ' + lien.donneur + ' ' + lien.op + ' ' + lien.receveur + ' »';
      if (lien.modificateur) {
        diags.push({ niveau: 'alerte', texte: etiquette + ' : modificateur « ' + lien.modificateur + ' » non défini, lien non exécuté.' });
        return;
      }
      var de = COS.resoudreId(lien.donneur, cartes);
      var vers = COS.resoudreId(lien.receveur, cartes);
      if (!de.resolu) { diags.push({ niveau: 'erreur', texte: etiquette + ' : ' + de.manque }); return; }
      if (!vers.resolu) { diags.push({ niveau: 'erreur', texte: etiquette + ' : ' + vers.manque }); return; }
      var comp = COS.compatible(de, vers);
      if (comp.ok) {
        var msg = etiquette + ' : compatible (' + comp.motif + ')';
        if (lien.script) msg += ' — opérandes typés, aucun script exécuté';
        diags.push({ niveau: 'ok', texte: msg });
      } else {
        diags.push({ niveau: 'alerte', texte: etiquette + ' : incompatible (' + comp.motif + ').' });
      }
    });
    if (!diags.length) diags.push({ niveau: 'info', texte: 'Aucun diagnostic : le document est vide ou non analysé.' });
    return diags;
  }

  // --------------------------------------------------------------------- CSS
  function declarationAutorisee(d) {
    return !/url\s*\(/i.test(d.valeur) && !/expression\s*\(/i.test(d.valeur) && !/javascript\s*:/i.test(d.valeur);
  }

  function declarationsCss(rule) {
    return (rule.declarations || []).filter(declarationAutorisee).map(function (d) {
      return d.propriete + ': ' + d.valeur + ';';
    }).join(' ');
  }

  function cssDepuisRegles(analyse, profondeur) {
    var pad = new Array((profondeur || 0) + 1).join('  ');
    var out = [];
    (analyse.rules || []).forEach(function (rule) {
      if (rule.atRule && rule.children && rule.children.length) {
        var interieur = cssDepuisRegles({ rules: rule.children }, (profondeur || 0) + 1);
        if (interieur.trim()) out.push(pad + rule.selecteur + ' {\n' + interieur + '\n' + pad + '}');
      } else {
        var decls = declarationsCss(rule);
        if (decls) out.push(pad + (rule.selecteurApplique || rule.selecteur) + ' { ' + decls + ' }');
      }
    });
    return out.join('\n');
  }

  function cssComplet(styles) {
    return (styles || []).map(function (analyse) { return cssDepuisRegles(analyse, 0); }).filter(Boolean).join('\n\n');
  }

  // ------------------------------------------------------------------ aperçu
  function rendreApercu(result, cartes) {
    var liens = result.liens || [];
    var ids = Object.keys(cartes).sort();
    var css = cssComplet(result.styles);
    var html = '<!doctype html><html lang="fr"><head><meta charset="utf-8">'
      + '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; img-src data:; font-src data:">'
      + '<style>' + CSS_APERCU + '\n' + css + '</style></head><body><main class="cos-doc">';

    if (!liens.length && !ids.length) {
      html += '<p class="vide">Aucune connexion ni nœud reconnu.</p>';
    }

    if (ids.length) {
      html += '<section class="cos-section"><h2>Nœuds</h2><div class="cos-noeuds">';
      ids.forEach(function (id) {
        var def = cartes[id] || {};
        html += '<span class="cos-node" data-cos="' + esc(id) + '"><b>' + esc(id) + '</b><small>' + esc(def.nom || def.classe || 'nœud') + '</small></span>';
      });
      html += '</div></section>';
    }

    if (liens.length) {
      html += '<section class="cos-section"><h2>Connexions</h2><div class="cos-liens">';
      liens.forEach(function (lien, i) {
        var fleche = lien.sens === 'retour' ? '←' : '→';
        html += '<article class="card cos-lien" data-cos="' + esc(lien.donneur) + '">'
          + '<span class="cos-rang">' + (i + 1) + '</span>'
          + '<span class="cos-extremite" data-cos="' + esc(lien.donneur) + '">' + esc(lien.donneur) + '</span>'
          + '<span class="cos-fleche">' + fleche + '</span>'
          + '<span class="cos-extremite" data-cos="' + esc(lien.receveur) + '">' + esc(lien.receveur) + '</span>'
          + '<span class="cos-op">' + esc(lien.op) + '</span>'
          + (lien.script ? '<span class="cos-badge">script local</span>' : '')
          + '</article>';
      });
      html += '</div></section>';
    }

    html += '</main></body></html>';
    apercuEl.srcdoc = html;
  }

  // ------------------------------------------------------------------- vues
  function rendreStats(result, cartes, diags) {
    var regles = (result.styles || []).reduce(function (n, a) { return n + (a.rules || []).length; }, 0);
    var erreurs = diags.filter(function (d) { return d.niveau === 'erreur'; }).length;
    var alertes = diags.filter(function (d) { return d.niveau === 'alerte'; }).length;
    var noeuds = Object.keys(cartes || {}).length;
    var liens = (result.liens || []).length;
    statsEl.innerHTML = '<span class="pill">' + liens + ' lien' + (liens > 1 ? 's' : '') + '</span>'
      + '<span class="pill vert">' + noeuds + ' nœud' + (noeuds > 1 ? 's' : '') + '</span>'
      + '<span class="pill">' + regles + ' règle' + (regles > 1 ? 's' : '') + ' CSS</span>'
      + (erreurs ? '<span class="pill rouge">' + erreurs + ' erreur' + (erreurs > 1 ? 's' : '') + '</span>' : '')
      + (alertes ? '<span class="pill jaune">' + alertes + ' alerte' + (alertes > 1 ? 's' : '') + '</span>' : '');
    badgeLiensEl.textContent = String(liens);
    badgeDiagsEl.textContent = String(erreurs + alertes);
    badgeDiagsEl.className = 'badge-onglet' + (erreurs ? ' rouge' : (alertes ? ' jaune' : ''));
    badgeCssEl.textContent = String((result.styles || []).length);
  }

  function rendreLiens(result, cartes) {
    var liens = result.liens || [];
    if (!liens.length) {
      listeLiensEl.innerHTML = '<p class="vide">Aucune connexion. Ajoutez un bloc <code>&lt;cos&gt;…&lt;/cos&gt;</code> avec des lignes <code>&lt;co&gt;A to B&lt;/co&gt;</code>.</p>';
      return;
    }
    var html = '';
    liens.forEach(function (lien, i) {
      var de = COS.resoudreId(lien.donneur, cartes);
      var vers = COS.resoudreId(lien.receveur, cartes);
      var comp = (de.resolu && vers.resolu) ? COS.compatible(de, vers) : null;
      var script = !!lien.script || estScript(lien.donneur, cartes) || estScript(lien.receveur, cartes);
      var invalide = !de.resolu || !vers.resolu || !!(comp && !comp.ok) || !!lien.modificateur;
      var badge;
      if (lien.modificateur) badge = '<span class="badge erreur">modificateur inconnu</span>';
      else if (!de.resolu || !vers.resolu) badge = '<span class="badge erreur">non résolu</span>';
      else if (comp && comp.ok) badge = '<span class="badge ok">' + esc(comp.motif) + '</span>';
      else badge = '<span class="badge erreur">incompatible</span>';

      var details = [];
      details.push(de.resolu
        ? '<span><code>' + esc(de.id) + '</code> ' + esc(nomDef(de)) + '</span>'
        : '<span class="manque">' + esc(de.manque) + '</span>');
      details.push('<span class="sep">·</span>');
      details.push(vers.resolu
        ? '<span><code>' + esc(vers.id) + '</code> ' + esc(nomDef(vers)) + '</span>'
        : '<span class="manque">' + esc(vers.manque) + '</span>');
      if (lien.modificateur) details.push('<span class="sep">·</span><span class="manque">modificateur « ' + esc(lien.modificateur) + ' » non défini</span>');
      if (lien.css) details.push('<span class="sep">·</span><span>CSS : ' + lien.css.length + ' bloc(s)</span>');
      if (script) details.push('<span class="sep">·</span><span>script local non exécuté</span>');

      html += '<article class="lien' + (invalide ? ' invalide' : '') + '">'
        + '<span class="lien-rang">' + (i + 1) + '</span>'
        + '<div class="lien-corps">'
        + '<div class="lien-tete">'
        + '<code class="extremite' + (estScript(lien.donneur, cartes) ? ' script' : '') + '">' + esc(lien.donneur) + '</code>'
        + '<span class="fleche">' + (lien.sens === 'retour' ? '←' : '→') + '</span>'
        + '<code class="extremite' + (estScript(lien.receveur, cartes) ? ' script' : '') + '">' + esc(lien.receveur) + '</code>'
        + '<span class="op">' + esc(lien.op) + '</span>'
        + (script ? '<span class="badge script">script local</span>' : '')
        + badge
        + '</div>'
        + '<div class="lien-detail">' + details.join(' ') + '</div>'
        + '</div></article>';
    });
    listeLiensEl.innerHTML = html;
  }

  function rendreDiagnostics(diags) {
    if (!diags.length) {
      listeDiagsEl.innerHTML = '<p class="vide">Aucun diagnostic.</p>';
      return;
    }
    var libelles = { ok: 'OK', info: 'Info', alerte: 'Alerte', erreur: 'Erreur' };
    listeDiagsEl.innerHTML = diags.map(function (d) {
      return '<article class="diag ' + d.niveau + '"><span class="diag-badge">' + (libelles[d.niveau] || d.niveau) + '</span><p>' + esc(d.texte) + '</p></article>';
    }).join('');
  }

  function rendreCss(result) {
    var styles = result.styles || [];
    if (!styles.length) {
      listeCssEl.innerHTML = '<p class="vide">Aucun bloc CSS reconnu. Utilisez <code>&lt;script_Alphanumerotation(aconnecter)&gt; … &lt;/script_Alphanumerotation(aconnecter)&gt;</code>.</p>';
      return;
    }
    listeCssEl.innerHTML = styles.map(function (css, i) {
      var texte = cssDepuisRegles(css, 0);
      var erreurs = (css.erreurs || []).length
        ? '<ul class="css-erreurs">' + css.erreurs.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>'
        : '';
      return '<article class="css-bloc">'
        + '<div class="css-tete"><b>Bloc CSS ' + (i + 1) + '</b><span class="badge ' + (css.ok ? 'ok' : 'erreur') + '">' + (css.ok ? 'valide' : 'à corriger') + '</span></div>'
        + erreurs
        + '<pre><code>' + esc(texte || css.source) + '</code></pre>'
        + '</article>';
    }).join('');
  }

  // ------------------------------------------------------------------ export
  function resolutionExport(r) {
    var o = { resolu: !!r.resolu, id: r.id, manque: r.manque || null };
    if (r.def) o.def = r.def;
    if (r.script) o.script = true;
    if (r.aliasNumerique) o.aliasNumerique = true;
    return o;
  }

  function exporterJSON() {
    if (!COS || typeof COS.analyser !== 'function') {
      return {
        format: 'cos-editor-export',
        version: 1,
        genere: new Date().toISOString(),
        erreur: 'runtime COS indisponible',
        source: sourceEl.value
      };
    }
    var base = dernier || { resultat: COS.analyser(sourceEl.value), cartes: {}, diagnostics: [] };
    var result = base.resultat;
    var cartes = base.cartes || result.cartes || {};
    var liens = (result.liens || []).map(function (lien, i) {
      var de = COS.resoudreId(lien.donneur, cartes);
      var vers = COS.resoudreId(lien.receveur, cartes);
      var comp = (de.resolu && vers.resolu) ? COS.compatible(de, vers) : { ok: false, motif: 'non-resolu' };
      return {
        ordre: i + 1,
        de: lien.de,
        vers: lien.vers,
        op: lien.op,
        sens: lien.sens,
        donneur: lien.donneur,
        receveur: lien.receveur,
        modificateur: lien.modificateur,
        script: !!lien.script,
        operandes: lien.operandes ? {
          de: {
            nom: lien.operandes.de.nom,
            valeur: lien.operandes.de.id,
            attrs: lien.operandes.de.attrs,
            contenu: lien.operandes.de.contenu
          },
          vers: {
            nom: lien.operandes.vers.nom,
            valeur: lien.operandes.vers.id,
            attrs: lien.operandes.vers.attrs,
            contenu: lien.operandes.vers.contenu
          }
        } : null,
        resolution: { de: resolutionExport(de), vers: resolutionExport(vers) },
        compatibilite: comp,
        css: lien.css || []
      };
    });
    return {
      format: 'cos-editor-export',
      version: 1,
      genere: new Date().toISOString(),
      note: 'Aucun script personnalisé n’est exécuté : les balises <script_…> sont des opérandes typés.',
      source: sourceEl.value,
      blocs: result.blocs || 0,
      cartes: cartes,
      liens: liens,
      styles: result.styles || [],
      diagnostics: base.diagnostics || [],
      analyse: result
    };
  }

  function copierJSON() {
    var texte = JSON.stringify(exporterJSON(), null, 2);
    function ok() { notifier('JSON copié (' + texte.length + ' caractères).'); }
    function secours() {
      var zone = document.createElement('textarea');
      zone.value = texte;
      zone.setAttribute('readonly', '');
      zone.style.position = 'fixed';
      zone.style.top = '-1000px';
      document.body.appendChild(zone);
      zone.select();
      try { document.execCommand('copy'); ok(); }
      catch (e) { notifier('Copie impossible dans ce navigateur.', 'erreur'); }
      document.body.removeChild(zone);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texte).then(ok, secours);
    } else {
      secours();
    }
  }

  function telechargerJSON() {
    var texte = JSON.stringify(exporterJSON(), null, 2);
    var blob = new Blob([texte], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'cos-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1200);
    notifier('Téléchargement de cos-export.json.');
  }

  // ----------------------------------------------------------------- analyse
  function analyser() {
    if (!COS || typeof COS.analyser !== 'function') {
      setStatut('Runtime COS indisponible', 'erreur');
      return;
    }
    var result;
    try {
      result = COS.analyser(sourceEl.value);
    } catch (e) {
      setStatut('Erreur d’analyse : ' + e.message, 'erreur');
      return;
    }
    var cartes = cartesLocales(result);
    var diags = diagnostiquer(result, cartes);
    dernier = { resultat: result, cartes: cartes, diagnostics: diags };
    rendreStats(result, cartes, diags);
    rendreLiens(result, cartes);
    rendreDiagnostics(diags);
    rendreCss(result);
    rendreApercu(result, cartes);

    var erreurs = diags.filter(function (d) { return d.niveau === 'erreur'; }).length;
    var alertes = diags.filter(function (d) { return d.niveau === 'alerte'; }).length;
    if (!result.ok) setStatut('Aucune connexion reconnue', 'alerte');
    else if (erreurs) setStatut(erreurs + ' erreur(s) — voir Diagnostics', 'erreur');
    else if (alertes) setStatut('Analyse OK — ' + alertes + ' alerte(s)', 'alerte');
    else setStatut('Analyse OK — ' + (result.liens || []).length + ' lien(s)', 'ok');
    sauver();
  }

  function planifierAnalyse() {
    clearTimeout(timerAnalyse);
    timerAnalyse = setTimeout(analyser, 240);
  }

  // ------------------------------------------------------------------ onglets
  var onglets = Array.prototype.slice.call(document.querySelectorAll('.onglet'));
  var vues = Array.prototype.slice.call(document.querySelectorAll('.vue'));
  function activerVue(nom) {
    onglets.forEach(function (onglet) {
      var actif = onglet.getAttribute('data-vue') === nom;
      onglet.classList.toggle('actif', actif);
      onglet.setAttribute('aria-selected', actif ? 'true' : 'false');
    });
    vues.forEach(function (vue) {
      vue.hidden = vue.id !== 'vue-' + nom;
    });
  }
  onglets.forEach(function (onglet) {
    onglet.addEventListener('click', function () { activerVue(onglet.getAttribute('data-vue')); });
  });

  // ------------------------------------------------------------------ events
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

  // ------------------------------------------------------------------ départ
  restaurer();
  majGouttiere();
  if (!COS) {
    setStatut('Runtime COS indisponible', 'erreur');
    listeDiagsEl.innerHTML = '<p class="vide">cos-langage.js n’a pas pu être chargé.</p>';
  } else {
    analyser();
  }
})();
