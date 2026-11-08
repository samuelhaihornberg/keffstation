/*!
 * KeffStation i18n — Traducteur universel toutes langues
 * Sélecteur de langue simple en haut à droite
 * Pas d'écran noir, pas de texte vertical, pas de blocage
 */

(function () {
  "use strict";

  var DICT = {
    langNames: {
      fr: "Français", en: "English", es: "Español", de: "Deutsch", it: "Italiano",
      pt: "Português", nl: "Nederlands", pl: "Polski", ru: "Русский", zh: "中文",
      ja: "日本語", ko: "한국어", ar: "العربية", hi: "हिन्दी", tr: "Türkçe"
    },
    langFlags: {
      fr: "🇫🇷", en: "🇺🇸", es: "🇪🇸", de: "🇩🇪", it: "🇮🇹", pt: "🇵🇹",
      nl: "🇳🇱", pl: "🇵🇱", ru: "🇷🇺", zh: "🇨🇳", ja: "🇯🇵", ko: "🇰🇷",
      ar: "🇸🇦", hi: "🇮🇳", tr: "🇹🇷"
    },
    language: { fr: "Langue", en: "Language", es: "Idioma", de: "Sprache", it: "Lingua",
      pt: "Idioma", nl: "Taal", pl: "Język", ru: "Язык", zh: "语言", ja: "言語",
      ko: "언어", ar: "اللغة", hi: "भाषा", tr: "Dil" },
    currency: { fr: "Devise", en: "Currency", es: "Divisa", de: "Währung", it: "Valuta",
      pt: "Moeda", nl: "Valuta", pl: "Waluta", ru: "Валюта", zh: "货币", ja: "通貨",
      ko: "통화", ar: "العملة", hi: "मुद्रा", tr: "Para birimi" },
    animation: { fr: "Animation", en: "Animation", es: "Animación", de: "Animation",
      it: "Animazione", pt: "Animação", nl: "Animatie", pl: "Animacja", ru: "Анимация",
      zh: "动画", ja: "アニメーション", ko: "애니메이션", ar: "الرسوم المتحركة",
      hi: "एनीमेशन", tr: "Animasyon" }
  };

  var STORAGE_KEY = "keffstation_lang";
  var DEFAULT_LANG = "fr";
  var SUPPORTED = Object.keys(DICT.langNames);

  function getLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.indexOf(saved.slice(0, 2).toLowerCase()) !== -1) {
        return saved.slice(0, 2).toLowerCase();
      }
    } catch (e) {}
    var nav = (navigator.language || navigator.userLanguage || "").slice(0, 2).toLowerCase();
    if (nav && SUPPORTED.indexOf(nav) !== -1) return nav;
    return DEFAULT_LANG;
  }

  function setLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    document.documentElement.lang = lang;
    applyTranslations(lang);
    refreshSelector(lang);
    document.dispatchEvent(new CustomEvent("ks-lang-change", { detail: { lang: lang } }));
    applyTranslationsGoogle(lang).catch(function () {});
  }

  function getCurrency() {
    try {
      var saved = localStorage.getItem(STORAGE_CURRENCY);
      if (saved) return saved;
    } catch (e) {}
    return DEFAULT_CURRENCY;
  }

  function setCurrency(currency) {
    try { localStorage.setItem(STORAGE_CURRENCY, currency); } catch (e) {}
    document.dispatchEvent(new CustomEvent("ks-currency-change", { detail: { currency: currency } }));
    refreshCurrencySelector(currency);
  }

  function fmtCurrency(value, currency) {
    var c = currency || getCurrency();
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: c,
        minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
    } catch (e) { return value + " " + c; }
  }

  function t(key, lang) {
    var entry = DICT[key];
    if (!entry) return key;
    if (entry[lang] !== undefined) return entry[lang];
    for (var i = 0; i < FALLBACK.length; i++) {
      if (entry[FALLBACK[i]] !== undefined) return entry[FALLBACK[i]];
    }
    return key;
  }

  function applyTranslations(lang) {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = t(key, lang);
      if (val !== key) {
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
      var val = t(key, lang);
      if (val !== key) el.innerHTML = val;
      el.setAttribute("data-i18n-lang", lang);
    });
    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      el.title = t(el.getAttribute("data-i18n-title"), lang);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      el.placeholder = t(el.getAttribute("data-i18n-placeholder"), lang);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"), lang));
    });
  }

  var translationCache = {};
  async function googleTranslate(text, targetLang) {
    if (!text || text.length === 0) return text;
    var cacheKey = text + '||' + targetLang;
    if (translationCache[cacheKey]) return translationCache[cacheKey];
    try {
      var url = 'https://translate.googleapis.com/translate_a/t?client=gtx&sl=auto&tl=' +
        encodeURIComponent(targetLang) + '&q=' + encodeURIComponent(text);
      var resp = await fetch(url);
      var data = await resp.json();
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        translationCache[cacheKey] = data[0][0][0];
        return data[0][0][0];
      }
    } catch (e) {}
    return text;
  }

  async function applyTranslationsGoogle(lang) {
    var elems = document.querySelectorAll("[data-i18n]");
    var cacheTraduction = {};
    try { cacheTraduction = JSON.parse(localStorage.getItem(STORAGE_TRADUCTION) || "{}"); } catch (e) {}
    var pending = [];
    for (var i = 0; i < elems.length; i++) {
      (function (el) {
        var key = el.getAttribute("data-i18n");
        var val = t(key, lang);
        if (val === key) {
          var original = el.getAttribute("data-i18n-original");
          if (!original) { original = el.textContent; el.setAttribute("data-i18n-original", original); }
          if (original && original !== key && original.trim().length > 0) {
            var ck = original + '||' + lang;
            if (cacheTraduction[ck]) { el.textContent = cacheTraduction[ck]; }
            else { pending.push({ el: el, original: original, ck: ck }); }
          }
        }
      })(elems[i]);
    }
    var index = 0, BATCH = 8, DELAY = 100;
    function nextBatch() {
      if (index >= pending.length) return;
      var batch = pending.slice(index, index + BATCH); index += BATCH;
      Promise.all(batch.map(function (item) {
        return googleTranslate(item.original, lang).then(function (tr) {
          item.el.textContent = tr;
          cacheTraduction[item.ck] = tr;
        }).catch(function () {});
      })).then(function () { setTimeout(nextBatch, DELAY); });
    }
    nextBatch();
    setTimeout(function () {
      try { localStorage.setItem(STORAGE_TRADUCTION, JSON.stringify(cacheTraduction)); } catch (e) {}
    }, 500);
  }

  var SELECTOR_CSS = "\
    #ks-lang-selector {\
      position: fixed; top: 10px; right: 10px; z-index: 1000;\
      font: 700 13px/1.2 system-ui,sans-serif; user-select: none; -webkit-user-select: none;\
    }\
    #ks-lang-toggle {\
      position: relative; background: rgba(10,12,34,.9); border: 1px solid rgba(255,255,255,.3);\
      border-radius: 12px; padding: 8px 12px; color: #f4f6ff; cursor: pointer;\
      display: inline-flex; align-items: center; gap: 8px; min-width: 44px; min-height: 44px;\
      touch-action: manipulation; -webkit-tap-highlight-color: transparent;\
    }\
    #ks-lang-toggle .ks-flag { font-size: 20px; line-height: 1; }\
    #ks-lang-toggle .ks-arrow { font-size: 11px; color: #b9c0e6; margin-left: 4px; }\
    #ks-lang-menu {\
      position: absolute; top: 100%; right: 0; margin-top: 8px;\
      background: rgba(8,9,22,.96); border: 1px solid rgba(255,255,255,.2);\
      border-radius: 12px; padding: 8px; min-width: 200px; z-index: 10001;\
      display: none; box-shadow: 0 8px 32px rgba(0,0,0,.4); overflow-y: auto; max-height: 60vh;\
    }\
    #ks-lang-toggle.open + #ks-lang-menu, #ks-lang-menu.visible { display: block; }\
    #ks-lang-menu .ks-section-title {\
      font: 700 11px/1.2 system-ui,sans-serif; color: #ffd23f; padding: 8px 12px 4px 12px;\
      text-transform: uppercase; letter-spacing: .08em; opacity: .9; }\
    #ks-lang-menu .ks-option {\
      display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 10px;\
      color: #f4f6ff; cursor: pointer; font: 500 13px/1.3 system-ui,sans-serif;\
      white-space: nowrap; touch-action: manipulation; -webkit-tap-highlight-color: transparent;\
    }\
    #ks-lang-menu .ks-option:hover { background: rgba(255,255,255,.08); }\
    #ks-lang-menu .ks-option.ks-active { background: rgba(255,210,63,.18); color: #ffd23f; border: 1px solid #ffd23f; }\
    #ks-lang-menu .ks-option .ks-flag { font-size: 18px; min-width: 26px; text-align: center; }\
    #ks-lang-menu .ks-option .ks-name { flex: 1; font-weight: 600; }\
    #ks-lang-menu .ks-divider { height: 1px; background: rgba(255,255,255,.1); margin: 8px 0; }\
  \";\n"

  function injectStyle() {
    if (document.getElementById("ks-i18n-style")) return;
    var s = document.createElement("style");
    s.id = "ks-i18n-style";
    s.textContent = SELECTOR_CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function buildSelector(lang) {
    var box = document.createElement("div");
    box.id = "ks-lang-selector";

    var toggle = document.createElement("button");
    toggle.id = "ks-lang-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-haspopup", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", t("language", lang));
    var flag = document.createElement("span");
    flag.className = "ks-flag";
    flag.textContent = DICT.langFlags[lang] || "🌐";
    var arrow = document.createElement("span");
    arrow.className = "ks-arrow";
    arrow.textContent = "▼";
    toggle.appendChild(flag);
    toggle.appendChild(arrow);
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = toggle.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
      var menu = document.getElementById("ks-lang-menu");
      if (menu) menu.classList.toggle("visible", open);
    });

    var menu = document.createElement("div");
    menu.id = "ks-lang-menu";
    menu.setAttribute("role", "menu");

    var secLang = document.createElement("div");
    secLang.className = "ks-section-title";
    secLang.textContent = t("language", lang);
    menu.appendChild(secLang);

    SUPPORTED.forEach(function (code) {
      var item = document.createElement("div");
      var isActive = (code === lang);
      item.className = "ks-option" + (isActive ? " ks-active" : "");
      item.setAttribute("role", "menuitem");
      var f = document.createElement("span");
      f.className = "ks-flag";
      f.textContent = DICT.langFlags[code] || "🌐";
      var n = document.createElement("span");
      n.className = "ks-name";
      n.textContent = DICT.langNames[code];
      item.appendChild(f);
      item.appendChild(n);
      item.addEventListener("click", function (e) {
        e.stopPropagation();
        setLang(code);
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("visible");
        flag.textContent = DICT.langFlags[code] || "🌐";
        document.querySelectorAll("#ks-lang-menu .ks-option").forEach(function (it) {
          it.classList.remove("ks-active");
        });
        item.classList.add("ks-active");
        toggle.setAttribute("aria-label", t("language", code));
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

  function refreshSelector(lang) {
    var flag = document.querySelector("#ks-lang-toggle .ks-flag");
    if (flag) flag.textContent = DICT.langFlags[lang] || "🌐";
    var toggle = document.getElementById("ks-lang-toggle");
    if (toggle) toggle.setAttribute("aria-label", t("language", lang));
    document.querySelectorAll("#ks-lang-menu .ks-option").forEach(function (it) {
      it.classList.remove("ks-active");
    });
    var opts = document.querySelectorAll("#ks-lang-menu .ks-option");
    for (var i = 0; i < opts.length; i++) {
      var nameEl = opts[i].querySelector(".ks-name");
      if (nameEl && DICT.langNames[lang] && nameEl.textContent === DICT.langNames[lang]) {
        opts[i].classList.add("ks-active");
        break;
      }
    }
  }

  function injectSelector(lang) {
    if (document.getElementById("ks-lang-selector")) return;
    injectStyle();
    var box = buildSelector(lang);
    document.body.appendChild(box);
  }

  function setAnimationMode(mode) {
    document.body.classList.remove("anim-sync", "anim-async", "anim-desync");
    if (mode === "sync" || mode === "async" || mode === "desync") {
      document.body.classList.add("anim-" + mode);
      document.documentElement.setAttribute("data-anim", mode);
    } else {
      document.documentElement.removeAttribute("data-anim");
    }
    try { localStorage.setItem(STORAGE_ANIM, mode); } catch (e) {}
  }
  function getAnimationMode() {
    try {
      var saved = localStorage.getItem(STORAGE_ANIM);
      if (saved === "sync" || saved === "async" || saved === "desync") return saved;
    } catch (e) {}
    return null;
  }
  (function () {
    var savedMode = getAnimationMode();
    if (savedMode) setAnimationMode(savedMode);
  })();

  function init() {
    var lang = getLang();
    document.documentElement.lang = lang;
    injectSelector(lang);
    applyTranslations(lang);
    (function () {
      var curLang = getLang();
      applyTranslations(curLang);
      applyTranslationsGoogle(curLang).catch(function () {});
    })();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.ksI18n = { setLang: setLang, getLang: getLang, t: t, apply: applyTranslations };
})();