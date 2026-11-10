/*!
 * KeffStation Page Translate — Bouton unique Google Translate
 *
 * Un seul bouton globe (🌍), sans texte, pas de menu déroulant de langue.
 * Au clic : ouvre Google Translate sur la page courante (détection automatique
 * de la langue source, langue cible = langue système ou libre choix depuis
 * l'interface Google Translate).
 */

(function () {
  "use strict";

  var ADAPTER_ID = "ks-page-translate";

  /* URL Google Translate sur la page courante, détection automatique de la source */
  function googleTranslateUrl() {
    var u = encodeURIComponent(window.location.href);
    return "https://translate.google.com/translate?sl=auto&u=" + u;
  }

  /* Détecte la langue courte du navigateur (ex: fr, en, es…) */
  function systemLang() {
    var nav = (navigator.language || navigator.userLanguage || "").slice(0, 2).toLowerCase();
    return nav || "";
  }

  function buildButton() {
    var box = document.createElement("div");
    box.id = ADAPTER_ID;
    box.style.position = "fixed";
    box.style.top = "10px";
    box.style.right = "10px";
    box.style.zIndex = "10000";
    box.style.font = "700 13px/1.2 system-ui,sans-serif";
    box.style.userSelect = "none";
    box.style.pointerEvents = "auto";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "ks-page-translate-btn";
    btn.style.background = "rgba(10,12,34,.9)";
    btn.style.border = "1px solid rgba(255,215,63,.4)";
    btn.style.borderRadius = "14px";
    btn.style.padding = "0";
    btn.style.color = "#ffd700";
    btn.style.cursor = "pointer";
    btn.style.display = "inline-flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.gap = "8px";
    btn.style.minWidth = "52px";
    btn.style.minHeight = "52px";
    btn.style.width = "52px";
    btn.style.height = "52px";
    btn.style.touchAction = "manipulation";
    btn.style.transition = "all .2s ease";
    btn.setAttribute("aria-label", "Traduire cette page");
    btn.setAttribute("title", "Traduire cette page");

    var icon = document.createElement("span");
    icon.textContent = "🌍";
    icon.style.fontSize = "20px";
    icon.style.pointerEvents = "none";
    btn.appendChild(icon);

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
      var tl = systemLang();
      var url = googleTranslateUrl();
      // Ajouter la langue cible si détectée (l'utilisateur peut toujours changer sur Google Translate)
      if (tl) {
        url = "https://translate.google.com/translate?sl=auto&tl=" + tl + "&u=" + encodeURIComponent(window.location.href);
      }
      window.open(url, "_blank");
    });

    box.appendChild(btn);
    return box;
  }

  function inject() {
    if (document.getElementById(ADAPTER_ID)) return;
    document.body.appendChild(buildButton());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }

  /* API publique */
  window.ksPageTranslate = {
    translate: function () {
      var btn = document.getElementById("ks-page-translate-btn");
      if (btn) btn.click();
    },
    hasNative: false,
  };

  console.log("[KeffStation Page Translate] Bouton Google Translate unique chargé");
})();
