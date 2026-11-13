/*!
 * KeffStation i18n Orchestrateur — Traduction humaine uniquement
 * - Un seul sélecteur de langue (fr / en) pour toute la plateforme et toutes les PWA liées
 * - Choix mémorisé (localStorage), conservé à la navigation, au rafraîchissement et à la réouverture
 * - Traduction immédiate au clic sur toutes les pages
 * - Pas de traduction automatique : seules fr et en sont proposées (traduites humainement)
 * - Fallback : si une clé manque, la clé originale s'affiche (jamais de page vide)
 * - Toutes les PWA gardent leur identité, aucun merge
 */

(function () {
  "use strict";

  /* ========================= Configuration ========================= */
  var STORAGE_KEY = "keffstation_lang";
  var STORAGE_KEY_PWA = "keffstation_lang_"; // préfixé par l'id de la PWA
  var DEFAULT_LANG = "fr";
  var SUPPORTED = ["fr", "en"]; // seules les langues traduites humainement
  var RTL_LANGS = []; // aucune RTL pour l'instant (fr/en uniquement)

  /* ========================= État ========================= */
  var DICT = {};        // { lang: { domain: { key: value } } }
  var LANG_META = {
    fr: { name: "Français", native: "Français", dir: "ltr", flag: "🇫🇷", complete: true, reviewed: true },
    en: { name: "English", native: "English", dir: "ltr", flag: "🇺🇸", complete: true, reviewed: true }
  };
  var CURRENT_LANG = DEFAULT_LANG;
  var CURRENT_PWA = "keffstation";

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

  /* ========================= Sélection de langue ========================= */
  function getLang(pwaId) {
    pwaId = pwaId || CURRENT_PWA || "keffstation";
    var key = STORAGE_KEY_PWA + pwaId;
    try {
      var saved = localStorage.getItem(key);
      if (saved && SUPPORTED.indexOf(saved) !== -1) {
        return saved;
      }
      var global = localStorage.getItem(STORAGE_KEY);
      if (global && SUPPORTED.indexOf(global) !== -1) {
        return global;
      }
    } catch (e) {}
    var nav = (navigator.language || navigator.userLanguage || "").slice(0, 2).toLowerCase();
    if (SUPPORTED.indexOf(nav) !== -1) return nav;
    return DEFAULT_LANG;
  }

  function setLang(lang, pwaId) {
    pwaId = pwaId || CURRENT_PWA || "keffstation";
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;

    var key = STORAGE_KEY_PWA + pwaId;
    try { localStorage.setItem(key, lang); } catch (e) {}
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}

    CURRENT_LANG = lang;
    applyDirection(lang);

    applyTranslations(lang, pwaId);
    refreshSelector(lang, pwaId);
    document.dispatchEvent(new CustomEvent("ks-lang-change", {
      detail: { lang: lang, pwa: pwaId }
    }));
  }

  /* ========================= Direction RTL / LTR ========================= */
  function applyDirection(lang) {
    var html = document.documentElement;
    html.lang = lang;
    if (RTL_LANGS.indexOf(lang) !== -1) {
      html.setAttribute("dir", "rtl");
      document.body.classList.add("dir-rtl");
      document.body.classList.remove("dir-ltr");
    } else {
      html.removeAttribute("dir");
      document.body.classList.add("dir-ltr");
      document.body.classList.remove("dir-rtl");
    }
  }

  /* ========================= Fonction de traduction t() ========================= */
  function t(key, lang, domain) {
    lang = lang || CURRENT_LANG || DEFAULT_LANG;
    domain = domain || "system";

    // 1. Nouveau fichier de langue (domaine courant)
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
    // 3. Fallback sur l'autre langue supportée (fr <-> en)
    var other = (lang === "fr") ? "en" : "fr";
    var otherDict = DICT[other];
    if (otherDict && otherDict[domain] && otherDict[domain][key] !== undefined) {
      return otherDict[domain][key];
    }
    if (domain !== "system") {
      var otherSys = DICT[other];
      if (otherSys && otherSys.system && otherSys.system[key] !== undefined) {
        return otherSys.system[key];
      }
    }
    // 4. Ancien dictionnaire i18n.js (DICT_LEGACY) — toutes les clés
    if (window.DICT_LEGACY) {
      var legacy = window.DICT_LEGACY[key];
      if (legacy) {
        if (legacy[lang] !== undefined) return legacy[lang];
        if (legacy[other] !== undefined) return legacy[other];
      }
    }
    // 5. Clé elle-même (jamais de page vide)
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
    #ks-lang-toggle .ks-flag { font-size: 24px; line-height: 1; }\
    #ks-lang-toggle.open + #ks-lang-menu, #ks-lang-menu.visible { display: block; }\
    #ks-lang-menu {\
      position: absolute; top: 100%; right: 0; margin-top: 8px;\
      background: rgba(8,9,22,.96); border: 1px solid rgba(255,255,255,.22);\
      border-radius: 16px; padding: 10px; min-width: 260px; z-index: 10001;\
      display: none; box-shadow: 0 12px 48px rgba(0,0,0,.55); overflow-y: auto; max-height: 60vh;\
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
    toggle.appendChild(flag);

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
    CURRENT_PWA = detectPWA();
    var lang = getLang(CURRENT_PWA);
    applyDirection(lang);
    // Sélecteur de langue avec drapeaux supprimé : seul le bouton Google Translate
    // (page-translate-adapter.js) reste disponible, sans texte, emoji uniquement.

    applyTranslations(lang, CURRENT_PWA);
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
    getPWA: function () { return CURRENT_PWA; }
  };

  // Compatibilité avec d'éventuels anciens appels
  window.ksI18nLocales = window.ksI18n;

  // Log de débogage visible dans la console
  console.log("[KeffStation i18n] Orchestrateur chargé — PWA: " + CURRENT_PWA + ", Langue: " + CURRENT_LANG);

})();
