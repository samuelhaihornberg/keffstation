/*!
 * KeffStation i18n Orchestrateur — Agent unique de traduction multi-PWA
 *
 * Rôles :
 *  - Charge les fichiers de langue locales/XX.json (versionnés pour le cache hors ligne)
 *  - Scanne le DOM ([data-i18n, data-i18n-html, data-i18n-title, …]) et applique les traductions
 *  - Fallback : fichier JSON par domaine → DICT_LEGACY (ancien dictionnaire) → clé originale
 *  - Traduction auto Google pour les langues non couvertes (marquée visuellement [auto], langue d'origine indiquée)
 *  - Mémorise le choix de langue par PWA (localStorage) + conserve à la navigation/réouverture
 *  - Gère l'affichage droite-à-gauche (arabe, hébreu) via dir="rtl" + CSS dédié
 *  - Un seul sélecteur de langue accessible, réutilisé par toutes les PWA liées
 *
 * Aucun service externe payant n'est appelé. La traduction automatique Google est un fallback
 * gratuit et est clairement signalée comme non relue.
 */

(function () {
  "use strict";

  /* ========================= Configuration ========================= */
  var STORAGE_KEY = "keffstation_lang";
  var STORAGE_KEY_PWA = "keffstation_lang_"; // préfixé par l'id de la PWA
  var CACHE_BUST = "?v=1.0.0";
  var DEFAULT_LANG = "fr";
  var FALLBACK = ["fr", "en"];
  var RTL_LANGS = ["ar", "he"];

  var BASE_PATH = (typeof window !== "undefined" && window.__I18N_BASE_PATH)
    ? window.__I18N_BASE_PATH
    : "./";
  var LOCALES_URL = BASE_PATH + "locales/";

  /* ========================= État ========================= */
  var DICT = {};        // { lang: { domain: { key: value } } }
  var LANG_META = {};   // { code: {name, native, dir, flag, complete, reviewed} }
  var LOADED = {};      // { lang: boolean }
  var CURRENT_LANG = DEFAULT_LANG;
  var CURRENT_PWA = "keffstation";
  var AUTO_TRANSLATE_CACHE = {};
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
    if (path === "/" || path === "/index.html" || path === "" || path === "/articles.html") {
      return "keffstation";
    }
    return "keffstation";
  }

  /* ========================= Chargement métadonnées ========================= */
  function loadLocalesMeta(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", LOCALES_URL + "locales.json" + CACHE_BUST, true);
    xhr.onload = function () {
      if (xhr.status === 200 || xhr.status === 0) {
        try {
          var meta = JSON.parse(xhr.responseText);
          LANG_META = meta.locales || {};
          RTL_LANGS = meta.rtl || RTL_LANGS;
        } catch (e) {}
      }
      SUPPORTED = Object.keys(LANG_META);
      if (SUPPORTED.length === 0) {
        SUPPORTED = [DEFAULT_LANG, "en"];
      }
      CURRENT_PWA = detectPWA();
      if (callback) callback();
    };
    xhr.onerror = function () {
      SUPPORTED = [DEFAULT_LANG, "en"];
      CURRENT_PWA = detectPWA();
      if (callback) callback();
    };
    xhr.send();
  }

  var SUPPORTED = [DEFAULT_LANG, "en"];

  /* ========================= Chargement fichier de langue ========================= */
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
          DICT[lang] = data;
          LOADED[lang] = true;
        } catch (e) {
          LOADED[lang] = false;
        }
      } else {
        LOADED[lang] = false;
      }
      if (callback) callback(lang);
    };
    xhr.onerror = function () {
      LOADED[lang] = false;
      if (callback) callback(lang);
    };
    xhr.send();
  }

  /* ========================= Sélection de langue ========================= */
  function getLang(pwaId) {
    pwaId = pwaId || CURRENT_PWA || "keffstation";
    var key = STORAGE_KEY_PWA + pwaId;
    try {
      var saved = localStorage.getItem(key);
      if (saved && SUPPORTED.indexOf(saved.slice(0, 2).toLowerCase()) !== -1) {
        return saved.slice(0, 2).toLowerCase();
      }
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
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}

    CURRENT_LANG = lang;
    applyDirection(lang);

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

  /* ========================= Direction RTL / LTR ========================= */
  function applyDirection(lang) {
    var isRTL = RTL_LANGS.indexOf(lang) !== -1;
    var html = document.documentElement;
    html.lang = lang;
    if (isRTL) {
      html.setAttribute("dir", "rtl");
    } else {
      html.removeAttribute("dir");
    }
    document.body.classList.remove("dir-rtl", "dir-ltr");
    document.body.classList.add(isRTL ? "dir-rtl" : "dir-ltr");
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

    // 1. Fichier de langue chargé (domaine courant)
    var langDict = DICT[lang];
    if (langDict && langDict[domain] && langDict[domain][key] !== undefined) {
      return langDict[domain][key];
    }
    // 2. Domaine commun "system"
    if (domain !== "system") {
      var sysDict = DICT[lang];
      if (sysDict && sysDict.system && sysDict.system[key] !== undefined) {
        return sysDict.system[key];
      }
    }
    // 3. Langues de repli (fichiers JSON)
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
    // 4. Ancien dictionnaire i18n.js (DICT_LEGACY) — toutes les clés, toutes les langues
    if (window.DICT_LEGACY) {
      var legacy = window.DICT_LEGACY[key];
      if (legacy) {
        if (legacy[lang] !== undefined) return legacy[lang];
        for (var j = 0; j < FALLBACK.length; j++) {
          if (legacy[FALLBACK[j]] !== undefined) return legacy[FALLBACK[j]];
        }
      }
    }
    // 5. Clé elle-même (pas de page vide ; autoTranslateMissing complète pour les autres langues)
    return key;
  }

  /* ========================= Application DOM ========================= */
  function getDomainsForPWA(pwaId) {
    var domains = ["system"];
    if (pwaId && pwaId !== "system") {
      domains.push(pwaId);
    }
    if (pwaId === "kiffstationadmin" || pwaId === "docs" || pwaId === "prototype") {
      domains.push("kiffstationadmin");
    }
    if (pwaId === "keffstation") {
      domains.push("keffstation");
    }
    return domains;
  }

  function resolveValue(key, lang, domains) {
    for (var i = 0; i < domains.length; i++) {
      var val = t(key, lang, domains[i]);
      if (val !== key) return val;
    }
    return t(key, lang, "system");
  }

  function applyTranslations(lang, pwaId) {
    lang = lang || CURRENT_LANG || DEFAULT_LANG;
    pwaId = pwaId || CURRENT_PWA || "keffstation";
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
      el.removeAttribute("data-i18n-missing");
      if (val === key) {
        el.setAttribute("data-i18n-missing", "true");
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

  /* ========================= Traduction auto fallback (Google) ========================= */
  function googleTranslateText(text, targetLang) {
    if (!text || text.trim().length === 0) return text;
    var ck = text + '||' + targetLang;
    if (AUTO_TRANSLATE_CACHE[ck]) return AUTO_TRANSLATE_CACHE[ck];
    try {
      var url = 'https://translate.googleapis.com/translate_a/t?client=gtx&sl=auto&tl=' +
        encodeURIComponent(targetLang) + '&q=' + encodeURIComponent(text);
      // fetch est utilisé ici ; pas de clé API, service gratuit, résultat marqué non relu
      return fetch(url).then(function (resp) {
        return resp.json();
      }).then(function (data) {
        if (data && data[0] && data[0][0] && data[0][0][0]) {
          AUTO_TRANSLATE_CACHE[ck] = data[0][0][0];
          return data[0][0][0];
        }
        return text;
      }).catch(function () {
        return text;
      });
    } catch (e) {
      return Promise.resolve(text);
    }
  }

  function autoTranslateMissing(lang, pwaId) {
    if (lang === 'fr' || lang === 'en') return; // traductions rédigées prioritaires
    var elems = document.querySelectorAll("[data-i18n-missing='true']");
    var index = 0, BATCH = 6, DELAY = 200;
    function nextBatch() {
      if (index >= elems.length) return;
      var batch = Array.prototype.slice.call(elems, index, index + BATCH); index += BATCH;
      batch.forEach(function (el) {
        var original = el.getAttribute("data-i18n-original");
        if (!original) {
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
            if (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA") {
              if (!el.querySelector(".ks-auto-badge")) {
                var badge = document.createElement("span");
                badge.className = "ks-auto-badge";
                badge.title = "Traduit automatiquement (non relu) — langue d'origine : " +
                  (el.getAttribute("data-i18n-lang") || lang);
                badge.textContent = " [auto]";
                badge.style.fontSize = "0.65em";
                badge.style.opacity = "0.5";
                badge.style.marginLeft = "4px";
                badge.style.whiteSpace = "nowrap";
                el.appendChild(badge);
              }
            }
          }
        });
      });
      setTimeout(nextBatch, DELAY);
    }
    nextBatch();
  }

  /* ========================= Sélecteur de langue (unique) ========================= */
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
    if (document.getElementById("ks-i18n-orchestrator-style")) return;
    var s = document.createElement("style");
    s.id = "ks-i18n-orchestrator-style";
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
      if (LANG_META[code] && !LANG_META[code].complete) {
        var badge = document.createElement("span");
        badge.className = "ks-complete ks-missing";
        badge.title = "Traduction incomplète — fallback / auto-traduction";
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
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* ========================= API publique ========================= */
  window.ksI18n = {
    setLang: setLang,
    getLang: getLang,
    t: t,
    apply: applyTranslations,
    getPWA: function () { return CURRENT_PWA; },
    isRTL: function (lang) { return RTL_LANGS.indexOf(lang !== undefined ? lang : CURRENT_LANG) !== -1; }
  };

  // Compatibilité si un autre script appelle window.ksI18nLocales
  window.ksI18nLocales = window.ksI18n;

})();
