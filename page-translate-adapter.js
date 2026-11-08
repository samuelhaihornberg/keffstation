/*!
 * KeffStation Page Translate Adapter — Adaptateur de traduction de page
 *
 * Ajoute un bouton "Traduire cette page" qui utilise le traducteur intégré
 * du navigateur (Chrome, Edge, etc.) sans API externe payante.
 *
 * Compatible avec l'orchestrateur i18n existant (fr/en traduits humainement).
 * Pour les langues non couvertes, ce bouton déclenche la traduction native du
 * navigateur sur toute la page.
 */

(function () {
  "use strict";

  var ADAPTER_ID = "ks-page-translate";
  var BTN_LABEL_FR = "Traduire cette page";
  var BTN_LABEL_EN = "Translate this page";
  var GOOGLE_TRANSLATE_URL =
    "https://translate.google.com/translate?sl=auto&tl={lang}&u=" +
    encodeURIComponent(window.location.href);

  /* Détecte si le navigateur propose une traduction native (Chrome/Edge) */
  function hasNativeTranslate() {
    return !!(
      window.chrome &&
      window.chrome.i18n &&
      typeof window.chrome.i18n.getAcceptLanguages === "function"
    );
  }

  function buildButton(currentLang) {
    var box = document.createElement("div");
    box.id = ADAPTER_ID;
    box.style.position = "fixed";
    box.style.top = "70px"; // sous le sélecteur de langue
    box.style.right = "10px";
    box.style.zIndex = "10000";
    box.style.font = "700 13px/1.2 system-ui,sans-serif";
    box.style.userSelect = "none";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "ks-page-translate-btn";
    btn.style.background = "rgba(10,12,34,.9)";
    btn.style.border = "1px solid rgba(255,215,63,.4)";
    btn.style.borderRadius = "14px";
    btn.style.padding = "10px 14px";
    btn.style.color = "#ffd700";
    btn.style.cursor = "pointer";
    btn.style.display = "inline-flex";
    btn.style.alignItems = "center";
    btn.style.gap = "8px";
    btn.style.minWidth = "52px";
    btn.style.minHeight = "52px";
    btn.style.touchAction = "manipulation";
    btn.style.transition = "all .2s ease";

    var icon = document.createElement("span");
    icon.textContent = "🌍";
    icon.style.fontSize = "20px";
    btn.appendChild(icon);

    var label = document.createElement("span");
    label.textContent = currentLang === "fr" ? BTN_LABEL_FR : BTN_LABEL_EN;
    label.style.fontWeight = "600";
    btn.appendChild(label);

    btn.addEventListener("mouseenter", function () {
      btn.style.background = "rgba(255,215,63,.15)";
      btn.style.borderColor = "#ffd700";
    });
    btn.addEventListener("mouseleave", function () {
      btn.style.background = "rgba(10,12,34,.9)";
      btn.style.borderColor = "rgba(255,215,63,.4)";
    });

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      translatePage(currentLang);
    });

    box.appendChild(btn);
    return box;
  }

  function translatePage(lang) {
    // 1. Essayer la traduction native du navigateur (Chrome/Edge)
    if (hasNativeTranslate()) {
      // Déclencher l'UI de traduction native en modifiant l'attribut lang
      var html = document.documentElement;
      var target = lang === "fr" ? "en" : "fr";
      html.setAttribute("lang", target);
      // Réouvrir la page avec l'URL de traduction Google si le navigateur ne propose pas nativement
      window.location.href =
        GOOGLE_TRANSLATE_URL.replace("{lang}", target);
      return;
    }

    // 2. Fallback : ouvrir Google Translate sur l'URL courante dans un nouvel onglet
    var target = lang === "fr" ? "en" : "fr";
    var url = GOOGLE_TRANSLATE_URL.replace("{lang}", target);
    window.open(url, "_blank");
  }

  function inject() {
    if (document.getElementById(ADAPTER_ID)) return;
    var currentLang =
      (typeof ksI18n !== "undefined" && ksI18n.getLang) ? ksI18n.getLang() : "fr";
    var box = buildButton(currentLang);
    document.body.appendChild(box);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }

  /* API publique */
  window.ksPageTranslate = {
    translate: translatePage,
    hasNative: hasNativeTranslate,
  };

  console.log("[KeffStation Page Translate] Adaptateur chargé");
})();
