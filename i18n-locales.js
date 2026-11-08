/*!
 * KeffStation i18n-locales — Module de traduction basé sur fichiers de langue
 * Complément de i18n.js (système legacy conservé pour compatibilité)
 *
 * - Charge les fichiers locales/XX.json (versionnés pour le cache hors ligne)
 * - Gère le fallback : langue demandée → fr → en → clé originale
 * - Gère l'affichage RTL (arabe, hébreu) via dir="rtl" sur <html>
 * - Sélecteur de langue persistant (localStorage) + événement inter-onglets
 * - Choix global (KeffStation) repris par les PWA liées, sauf override par PWA
 * - Pas de traduction automatique par défaut (aucune API externe appelée)
 * - Contenus non traduits : affiche la langue d'origine, pas de page vide
 */

(function () {
  "use strict";

  var STORAGE_KEY = "keffstation_lang";
  var STORAGE_KEY_PWA = "keffstation_lang_"; // préfixé par l'id de la PWA
  var STORAGE_TRADUCTION = "keffstation_trad";
  var LOCALES_URL = "./locales/";
  var LOCALES_META = LOCALES_URL + "locales.json";
  var CACHE_BUST = "?v=1.0.0"; // version des fichiers de langue (cache busting)

  var DEFAULT_LANG = "fr";
  var FALLBACK = ["fr", "en"];
  var SUPPORTED = [];
  var LANG_META = {}; // { code: {name, native, dir, flag, complete, reviewed} }
  var RTL_LANGS = [];
  var DICT = {}; // { lang: { domain: { key: value } } }
  var LOADED = {}; // { lang: boolean }
  var CURRENT_LANG = DEFAULT_LANG;
  var CURRENT_PWA = null; // id de la PWA courante, détecté depuis le chemin
  var RTLCSS_INJECTED = false;
  var RTL_CSS_URL = LOCALES_URL + "rtl.css" + CACHE_BUST;

  /* ========================= Détection PWA ========================= */
  function detectPWA() {
    var path = window.location.pathname || "";
    var pwaList = [
      "kifftech", "viartificial-labs", "tricktrocjob", "videogames",
      "cos-editor", "linguistic-motors", "kiffstationadmin", "blm", "content",
      "docs", "prototype"
    ];
    for (var i = 0; i < pwaList.length; i++) {
      if (path.indexOf("/" + pwaList[i] + "/") !== -1 || path === "/" + pwaList[i] + "/") {
        return pwaList[i];
      }
    }
    // Racine = KeffStation
    if (path === "/" || path === "/index.html" || path === "") {
      return "keffstation";
    }
    return "keffstation";
  }

  /* ========================= Chargement des métadonnées ========================= */
  function loadLocalesMeta(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", LOCALES_META + CACHE_BUST, true);
    xhr.onload = function () {
      if (xhr.status === 200 || xhr.status === 0) {
        try {
          var meta = JSON.parse(xhr.responseText);
          LANG_META = meta.locales || {};
          RTL_LANGS = meta.rtl || [];
          SUPPORTED = Object.keys(LANG_META);
          if (SUPPORTED.length === 0) {
            SUPPORTED = [DEFAULT_LANG, "en"];
          }
          CURRENT_PWA = detectPWA();
          if (callback) callback();
        } catch (e) {
          if (callback) callback();
        }
      } else {
        if (callback) callback();
      }
    };
    xhr.onerror = function () { if (callback) callback(); };
    xhr.send();
  }

  /* ========================= Chargement d'un fichier de langue ========================= */
  function loadLang(lang, callback) {
    if (LOADED[lang]) {
      if (callback) callback(lang);
      return;
    }
    var url = LOCALES_URL + lang + ".json" + CACHE_BUST;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
      if (xhr.status === 200 || xhr.status === 0) {
        try {
          var data = JSON.parse(xhr.responseText);
          // On stocke chaque domaine séparément pour un accès rapide
          DICT[lang] = data;
          LOADED[lang] = true;
          if (callback) callback(lang);
        } catch (e) {
          LOADED[lang] = false;
          if (callback) callback(lang);
        }
      } else {
        LOADED[lang] = false;
        if (callback) callback(lang);
      }
    };
    xhr.onerror = function () { LOADED[lang] = false; if (callback) callback(lang); };
    xhr.send();
  }

  /* ========================= Sélection de la langue ========================= */
  function getLang(pwaId) {
    pwaId = pwaId || CURRENT_PWA || "keffstation";
    var key = STORAGE_KEY_PWA + pwaId;
    try {
      var saved = localStorage.getItem(key);
      if (saved && SUPPORTED.indexOf(saved.slice(0, 2).toLowerCase()) !== -1) {
        return saved.slice(0, 2).toLowerCase();
      }
      // Fallback sur la langue globale si pas de choix spécifique à la PWA
      var global = localStorage.getItem(STORAGE_KEY);
      if (global && SUPPORTED.indexOf(global.slice(0, 2).toLowerCase()) !== -1) {
        return global.slice(0, 2).toLowerCase();
      }
    } catch (e) {}
    var nav = (navigator.language || navigator.userLanguage || "").slice(0, 2).toLowerCase();
    if (nav && SUPPORTED.indexOf(nav) !== -1) return nav;
    return DEFAULT_LANG;
  }

  function setLang(lang, pwaId) {
    pwaId = pwaId || CURRENT_PWA || "keffstation";
    lang = lang.slice(0, 2).toLowerCase();
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;

    var key = STORAGE_KEY_PWA + pwaId;
    try { localStorage.setItem(key, lang); } catch (e) {}

    // Aussi sauver en globale pour cohérence
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}

    CURRENT_LANG = lang;
    applyDirection(lang);

    // Charger la langue si nécessaire, puis appliquer
    if (!LOADED[lang]) {
      loadLang(lang, function () {
        applyTranslations(lang, pwaId);
        refreshSelector(lang, pwaId);
        autoTranslateMissing(lang, pwaId);
        document.dispatchEvent(new CustomEvent("ks-lang-change", {
          detail: { lang: lang, pwa: pwaId }
        }));
      });
    } else {
      applyTranslations(lang, pwaId);
      refreshSelector(lang, pwaId);
      autoTranslateMissing(lang, pwaId);
      document.dispatchEvent(new CustomEvent("ks-lang-change", {
        detail: { lang: lang, pwa: pwaId }
      }));
    }
  }

  /* ========================= Direction RTL/LTR ========================= */
  function applyDirection(lang) {
    var isRTL = RTL_LANGS.indexOf(lang) !== -1;
    var html = document.documentElement;
    html.lang = lang;
    if (isRTL) {
      html.setAttribute("dir", "rtl");
    } else {
      html.removeAttribute("dir");
    }
    // Classe CSS pour ciblage fin
    document.body.classList.remove("dir-rtl", "dir-ltr");
    document.body.classList.add(isRTL ? "dir-rtl" : "dir-ltr");
    // Injecter les règles CSS RTL si nécessaire
    if (isRTL && !RTLCSS_INJECTED) {
      injectRTLCSS();
      RTLCSS_INJECTED = true;
    }
  }

  function injectRTLCSS() {
    if (document.getElementById("ks-rtl-style")) return;
    var link = document.createElement("link");
    link.id = "ks-rtl-style";
    link.rel = "stylesheet";
    link.href = RTL_CSS_URL;
    (document.head || document.documentElement).appendChild(link);
  }

  /* ========================= Fonction de traduction t() ========================= */
  function t(key, lang, domain) {
    lang = lang || CURRENT_LANG || DEFAULT_LANG;
    domain = domain || "system";

    // 1. Chercher dans le fichier de langue chargé
    var langDict = DICT[lang];
    if (langDict && langDict[domain] && langDict[domain][key] !== undefined) {
      return langDict[domain][key];
    }
    // 2. Chercher dans le domaine "system" (commun)
    if (domain !== "system") {
      var sysDict = DICT[lang];
      if (sysDict && sysDict.system && sysDict.system[key] !== undefined) {
        return sysDict.system[key];
      }
    }
    // 3. Fallback vers les langues de repli
    for (var i = 0; i < FALLBACK.length; i++) {
      var fb = FALLBACK[i];
      if (fb === lang) continue;
      var fbDict = DICT[fb];
      if (fbDict && fbDict[domain] && fbDict[domain][key] !== undefined) {
        return fbDict[domain][key];
      }
      if (domain !== "system") {
        var fbSys = DICT[fb];
        if (fbSys && fbSys.system && fbSys.system[key] !== undefined) {
          return fbSys.system[key];
        }
      }
    }
    // 4. Fallback sur l'ancien dictionnaire i18n.js (legacy) si disponible
    if (typeof DICT !== "undefined" && window.DICT_LEGACY) {
      var legacy = window.DICT_LEGACY[key];
      if (legacy) {
        if (legacy[lang] !== undefined) return legacy[lang];
        for (var j = 0; j < FALLBACK.length; j++) {
          if (legacy[FALLBACK[j]] !== undefined) return legacy[FALLBACK[j]];
        }
      }
    }
    // 5. Retourner la clé elle-même (pas de page vide)
    return key;
  }

  /* ========================= Application des traductions sur le DOM ========================= */
  function applyTranslations(lang, pwaId) {
    lang = lang || CURRENT_LANG || DEFAULT_LANG;
    pwaId = pwaId || CURRENT_PWA || "keffstation";

    // Déterminer les domaines pertinents pour cette PWA
    var domains = getDomainsForPWA(pwaId);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = resolveValue(key, lang, domains);
      if (val !== key && val !== null) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          if (!el.value) el.placeholder = val;
        } else {
          el.textContent = val;
        }
      }
      el.setAttribute("data-i18n-lang", lang);
      // Marquer si la traduction manque (pour debug / affichage langue d'origine)
      if (val === key) {
        el.setAttribute("data-i18n-missing", "true");
      } else {
        el.removeAttribute("data-i18n-missing");
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      var val = resolveValue(key, lang, domains);
      if (val !== key && val !== null) el.innerHTML = val;
      el.setAttribute("data-i18n-lang", lang);
    });

    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      el.title = resolveValue(el.getAttribute("data-i18n-title"), lang, domains);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      el.placeholder = resolveValue(el.getAttribute("data-i18n-placeholder"), lang, domains);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", resolveValue(el.getAttribute("data-i18n-aria"), lang, domains));
    });
  }

  function getDomainsForPWA(pwaId) {
    // Chaque PWA a son propre domaine + le domaine system (commun)
    var domains = ["system"];
    if (pwaId && pwaId !== "system") {
      domains.push(pwaId);
    }
    // Domains additionnels selon le contexte
    if (pwaId === "kiffstationadmin" || pwaId === "docs" || pwaId === "prototype") {
      domains.push("kiffstationadmin");
    }
    if (pwaId === "keffstation") {
      domains.push("keffstation");
    }
    return domains;
  }

  function resolveValue(key, lang, domains) {
    // Essayer chaque domaine dans l'ordre
    for (var i = 0; i < domains.length; i++) {
      var domain = domains[i];
      var val = t(key, lang, domain);
      if (val !== key) return val;
    }
    // Dernier recours : t() avec le domaine par défaut
    return t(key, lang, "system");
  }

  /* ========================= Traduction automatique fallback (Google) ========================= */
  // Appelée pour les clés sans traduction humaine (langues autres que fr/en).
  // Le résultat est marqué data-i18n-auto="true" et n'est PAS relu.
  var AUTO_TRANSLATE_CACHE = {};
  async function googleTranslateText(text, targetLang) {
    if (!text || text.trim().length === 0) return text;
    var ck = text + '||' + targetLang;
    if (AUTO_TRANSLATE_CACHE[ck]) return AUTO_TRANSLATE_CACHE[ck];
    try {
      var url = 'https://translate.googleapis.com/translate_a/t?client=gtx&sl=auto&tl=' +
        encodeURIComponent(targetLang) + '&q=' + encodeURIComponent(text);
      var resp = await fetch(url);
      var data = await resp.json();
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        AUTO_TRANSLATE_CACHE[ck] = data[0][0][0];
        return data[0][0][0];
      }
    } catch (e) {}
    return text;
  }

  function autoTranslateMissing(lang, pwaId) {
    // Ne pas traduire automatiquement les langues déjà couvertes (fr, en)
    if (lang === 'fr' || lang === 'en') return;
    var elems = document.querySelectorAll("[data-i18n-missing='true']");
    var index = 0, BATCH = 6, DELAY = 150;
    function nextBatch() {
      if (index >= elems.length) return;
      var batch = Array.prototype.slice.call(elems, index, index + BATCH); index += BATCH;
      batch.forEach(function (el) {
        var original = el.getAttribute("data-i18n-original");
        if (!original || original.trim().length === 0) {
          original = el.textContent || el.getAttribute("placeholder") || el.getAttribute("aria-label") || "";
          el.setAttribute("data-i18n-original", original);
        }
        if (!original || original.trim().length === 0) return;
        googleTranslateText(original, lang).then(function (tr) {
          if (tr && tr !== original) {
            if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
              if (!el.value) el.placeholder = tr;
            } else {
              el.textContent = tr;
            }
            el.setAttribute("data-i18n-auto", "true");
            el.removeAttribute("data-i18n-missing");
            // Petit badge visuel de traduction automatique
            if (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA") {
              var badge = document.createElement("span");
              badge.className = "ks-auto-badge";
              badge.title = "Traduit automatiquement (non relu) — langue d'origine : " + (el.getAttribute("data-i18n-lang") || lang);
              badge.textContent = " [auto]";
              badge.style.fontSize = "0.65em";
              badge.style.opacity = "0.5";
              badge.style.marginLeft = "4px";
              badge.style.whiteSpace = "nowrap";
              // Évite les doublons
              if (!el.querySelector(".ks-auto-badge")) el.appendChild(badge);
            }
          }
        }).catch(function () {});
      });
      setTimeout(nextBatch, DELAY);
    }
    nextBatch();
  }

  /* ========================= Sélecteur de langue ========================= */
  var SELECTOR_CSS = "\
    #ks-lang-selector {\
      position: fixed; top: 10px; right: 10px; z-index: 10000;\
      font: 700 13px/1.2 system-ui,sans-serif; user-select: none;\
    }\
    #ks-lang-toggle {\
      position: relative; background: rgba(10,12,34,.9); border: 1px solid rgba(255,255,255,.2);\
      border-radius: 14px; padding: 10px 14px; color: #f4f6ff; cursor: pointer;\
      display: inline-flex; align-items: center; gap: 8px; min-width: 52px; min-height: 52px;\
      touch-action: manipulation;\
    }\
    #ks-lang-toggle .ks-flag { font-size: 22px; line-height: 1; }\
    #ks-lang-toggle .ks-arrow { font-size: 11px; color: #b9c0e6; margin-left: 4px; }\
    #ks-lang-toggle.open + #ks-lang-menu, #ks-lang-menu.visible { display: block; }\
    #ks-lang-menu {\
      position: absolute; top: 100%; right: 0; margin-top: 8px;\
      background: rgba(8,9,22,.96); border: 1px solid rgba(255,255,255,.22);\
      border-radius: 16px; padding: 10px; min-width: 300px; z-index: 10001;\
      display: none; box-shadow: 0 12px 48px rgba(0,0,0,.55); overflow-y: auto; max-height: 70vh;\
      direction: ltr;\
    }\
    [dir=rtl] #ks-lang-menu { left: 0; right: auto; }\
    #ks-lang-menu .ks-section-title {\
      font: 700 11px/1.2 system-ui,sans-serif; color: #ffd23f; padding: 8px 12px 4px 12px;\
      text-transform: uppercase; letter-spacing: .08em; opacity: .9; }\
    #ks-lang-menu .ks-option {\
      display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 12px;\
      color: #f4f6ff; cursor: pointer; font: 500 14px/1.3 system-ui,sans-serif;\
      white-space: nowrap; touch-action: manipulation;\
    }\
    #ks-lang-menu .ks-option:hover { background: rgba(255,255,255,.08); }\
    #ks-lang-menu .ks-option.ks-active { background: rgba(255,210,63,.18); color: #ffd23f; border: 1px solid #ffd23f; }\
    #ks-lang-menu .ks-option .ks-flag { font-size: 20px; min-width: 28px; text-align: center; }\
    #ks-lang-menu .ks-option .ks-name { flex: 1; font-weight: 600; }\
    #ks-lang-menu .ks-divider { height: 1px; background: rgba(255,255,255,.1); margin: 8px 0; }\
    #ks-lang-menu .ks-complete { font-size: 11px; opacity: .6; margin-left: 8px; }\
    #ks-lang-menu .ks-missing { color: #ff9999; }\
    .ks-auto-badge { font-size: 0.65em; opacity: 0.5; margin-left: 4px; white-space: nowrap; }\
  ";

  function injectStyle() {
    if (document.getElementById("ks-i18n-locales-style")) return;
    var s = document.createElement("style");
    s.id = "ks-i18n-locales-style";
    s.textContent = SELECTOR_CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function buildSelector(lang, pwaId) {
    var box = document.createElement("div");
    box.id = "ks-lang-selector";

    var toggle = document.createElement("button");
    toggle.id = "ks-lang-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-haspopup", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", t("language", lang, "system"));
    var flag = document.createElement("span");
    flag.className = "ks-flag";
    flag.textContent = (LANG_META[lang] && LANG_META[lang].flag) || "🌐";
    var arrow = document.createElement("span");
    arrow.className = "ks-arrow";
    arrow.textContent = "▼";
    toggle.appendChild(flag);
    toggle.appendChild(arrow);

    var menu = document.createElement("div");
    menu.id = "ks-lang-menu";
    menu.setAttribute("role", "menu");

    var secTitle = document.createElement("div");
    secTitle.className = "ks-section-title";
    secTitle.textContent = t("language", lang, "system");
    menu.appendChild(secTitle);

    // Indication de la PWA courante
    var pwaLabel = document.createElement("div");
    pwaLabel.className = "ks-section-title";
    pwaLabel.textContent = PWA_NAMES[pwaId] || pwaId;
    menu.appendChild(pwaLabel);

    SUPPORTED.forEach(function (code) {
      var item = document.createElement("div");
      var isActive = (code === lang);
      item.className = "ks-option" + (isActive ? " ks-active" : "");
      item.setAttribute("role", "menuitem");
      var f = document.createElement("span");
      f.className = "ks-flag";
      f.textContent = (LANG_META[code] && LANG_META[code].flag) || "🌐";
      var n = document.createElement("span");
      n.className = "ks-name";
      n.textContent = (LANG_META[code] && LANG_META[code].native) || code;
      // Marque les langues non complètes
      if (LANG_META[code] && !LANG_META[code].complete) {
        var badge = document.createElement("span");
        badge.className = "ks-complete ks-missing";
        badge.title = "Traduction incomplète — fallback vers le français/anglais";
        badge.textContent = "⚠";
        n.appendChild(badge);
      }
      item.appendChild(f);
      item.appendChild(n);
      item.addEventListener("click", function (e) {
        e.stopPropagation();
        setLang(code, pwaId);
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("visible");
        flag.textContent = (LANG_META[code] && LANG_META[code].flag) || "🌐";
        document.querySelectorAll("#ks-lang-menu .ks-option").forEach(function (it) {
          it.classList.remove("ks-active");
        });
        item.classList.add("ks-active");
        toggle.setAttribute("aria-label", t("language", code, "system"));
      });
      menu.appendChild(item);
    });

    box.appendChild(toggle);
    box.appendChild(menu);

    document.addEventListener("click", function (e) {
      if (!box.contains(e.target)) {
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("visible");
      }
    });
    return box;
  }

  function refreshSelector(lang, pwaId) {
    var flag = document.querySelector("#ks-lang-toggle .ks-flag");
    if (flag) flag.textContent = (LANG_META[lang] && LANG_META[lang].flag) || "🌐";
    var toggle = document.getElementById("ks-lang-toggle");
    if (toggle) toggle.setAttribute("aria-label", t("language", lang, "system"));
    document.querySelectorAll("#ks-lang-menu .ks-option").forEach(function (it) {
      it.classList.remove("ks-active");
    });
    var opts = document.querySelectorAll("#ks-lang-menu .ks-option");
    for (var i = 0; i < opts.length; i++) {
      var nameEl = opts[i].querySelector(".ks-name");
      if (nameEl && LANG_META[lang] && nameEl.textContent.indexOf(LANG_META[lang].native) !== -1) {
        opts[i].classList.add("ks-active");
        break;
      }
    }
  }

  function injectSelector(lang, pwaId) {
    if (document.getElementById("ks-lang-selector")) return;
    injectStyle();
    var box = buildSelector(lang, pwaId);
    document.body.appendChild(box);
  }

  /* ========================= Noms PWA pour l'affichage ========================= */
  var PWA_NAMES = {
    "keffstation": "KeffStation",
    "kifftech": "KiffTech",
    "viartificial-labs": "ViArtificial Labs",
    "critiques-services": "Critiques-Services",
    "tricktrocjob": "Tricktrocjob",
    "videogames": "Videogames",
    "cos-editor": "cos Editor",
    "linguistic-motors": "Linguistic Motors",
    "kiffstationadmin": "Keffstation Admin",
    "blm": "BLM Orchestrateur",
    "content": "Content",
    "docs": "Docs",
    "prototype": "Prototype"
  };

  /* ========================= Init ========================= */
  function init() {
    loadLocalesMeta(function () {
      CURRENT_PWA = detectPWA();
      var lang = getLang(CURRENT_PWA);
      applyDirection(lang);
      injectSelector(lang, CURRENT_PWA);
      if (!LOADED[lang]) {
        loadLang(lang, function () {
          applyTranslations(lang, CURRENT_PWA);
          refreshSelector(lang, CURRENT_PWA);
          autoTranslateMissing(lang, CURRENT_PWA);
        });
      } else {
        applyTranslations(lang, CURRENT_PWA);
        refreshSelector(lang, CURRENT_PWA);
        autoTranslateMissing(lang, CURRENT_PWA);
      }
      // Écouter les changements de langue globaux (depuis i18n.js legacy ou autre onglet)
      document.addEventListener("ks-lang-change", function (e) {
        if (e.detail && e.detail.pwa !== CURRENT_PWA) {
          // Une autre PWA a changé de langue : on garde notre choix sauf si c'est le global
          var globalLang = localStorage.getItem(STORAGE_KEY);
          if (globalLang && SUPPORTED.indexOf(globalLang.slice(0,2).toLowerCase()) !== -1) {
            setLang(globalLang.slice(0,2).toLowerCase(), CURRENT_PWA);
          }
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* API publique */
  window.ksI18nLocales = {
    setLang: setLang,
    getLang: getLang,
    t: t,
    apply: applyTranslations,
    getPWA: function () { return CURRENT_PWA; },
    isRTL: function (lang) { return RTL_LANGS.indexOf(lang !== undefined ? lang : CURRENT_LANG) !== -1; }
  };

  // Compatibilité : exposer aussi sous ksI18n si l'ancien n'existe pas
  if (!window.ksI18n) {
    window.ksI18n = { setLang: setLang, getLang: getLang, t: t, apply: applyTranslations };
  }

})();
