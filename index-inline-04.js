

(function () {

  "use strict";

  var ENDPOINT = "https://qsibfydsqmrcnonwcbzn.supabase.co/functions/v1/clever-task";

  var MAX_BATCH = 20;

  var FLUSH_INTERVAL = 30000;

  var queue = [];

  var sessionId = null;

  var sending = false;

  var pageStartTime = Date.now();

  var currentPath = location.pathname || "/";



  function getSessionId() {

    if (!sessionId) {

      try { sessionId = sessionStorage.getItem("ks_session_id"); } catch (e) {}

      if (!sessionId) {

        try { sessionId = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2); } catch (e) { sessionId = Math.random().toString(36).slice(2); }

        try { sessionStorage.setItem("ks_session_id", sessionId); } catch (e) {}

      }

    }

    return sessionId;

  }



  function isBot() {

    var ua = navigator.userAgent || "";

    return /bot|crawler|spider|slurp|bingpreview|headless|lighthouse|pagespeed|facebookexternalhit|whatsapp|telegrambot|semrush|ahrefs|mj12bot|dotbot|yandex/i.test(ua);

  }



  function cleanPath(value) {

    if (typeof value !== "string") return null;

    try {

      var url = new URL(value, "https://keffstation.invalid");

      return (url.pathname || "/").slice(0, 300);

    } catch (e) { return null; }

  }



  function cleanString(value, max) {

    if (typeof value !== "string") return null;

    var cleaned = value.replace(/[\u0000-\u001f\u007f]/g, "").trim();

    if (!cleaned) return null;

    return cleaned.slice(0, max || 200);

  }



  function deviceType() {

    var ua = navigator.userAgent || "";

    if (/Mobi|Android|iPhone|iPad/.test(ua)) return "mobile";

    if (/Tablet/.test(ua)) return "tablet";

    return "desktop";

  }



  function sendEvent(type, elementType, elementId, elementLabel, path, metadata) {

    if (isBot()) return;

    getSessionId();

    queue.push({

      type: type,

      sessionId: sessionId,

      occurredAt: new Date().toISOString(),

      path: path ? cleanPath(path) : null,

      deviceType: deviceType(),

      elementType: elementType || null,

      elementId: elementId ? cleanString(elementId, 80) : null,

      elementLabel: elementLabel ? cleanString(elementLabel, 80) : null,

      metadata: metadata || {}

    });

    if (queue.length >= MAX_BATCH) flush();

  }



  function flush() {

    if (sending || queue.length === 0) return;

    sending = true;

    var batch = queue.splice(0, MAX_BATCH);

    var payload = JSON.stringify({ events: batch });

    if (navigator.sendBeacon) {

      navigator.sendBeacon(ENDPOINT, payload);

      sending = false;

      return;

    }

    fetch(ENDPOINT, {

      method: "POST",

      body: payload,

      headers: { "Content-Type": "application/json; charset=utf-8" },

      keepalive: true

    }).then(function () { sending = false; }).catch(function () { sending = false; });

  }



  // Page vue à l'arrivée

  sendEvent("page_view", null, null, null, currentPath);



  // Temps passé sur la page : envoyé à la sortie (duration_ms dans les métadonnées)

  function sendPageDuration() {

    var duration = Date.now() - pageStartTime;

    if (duration > 500) {

      sendEvent("page_view", null, null, null, currentPath, { duration_ms: Math.round(duration) });

    }

  }



  // Navigation SPA : bouton retour / avant du navigateur

  window.addEventListener("popstate", function () {

    sendPageDuration();

    pageStartTime = Date.now();

    currentPath = location.pathname || "/";

    sendEvent("page_view", null, null, null, currentPath);

  }, { passive: true });



  // Interception de history.pushState pour les applications SPA

  (function () {

    var origPushState = history.pushState;

    history.pushState = function () {

      origPushState.apply(this, arguments);

      sendPageDuration();

      pageStartTime = Date.now();

      currentPath = location.pathname || "/";

      sendEvent("page_view", null, null, null, currentPath);

    };

  })();



  // Clics sur liens et boutons

  if (typeof document !== "undefined") {

    document.addEventListener("click", function (ev) {

      var target = ev.target;

      while (target && target !== document.body) {

        if (target.tagName === "A" || target.tagName === "BUTTON") {

          var elType = target.tagName === "A" ? "link" : "button";

          var label = (target.textContent || "").trim().slice(0, 80);

          var id = target.id || target.getAttribute("data-id") || "";

          var href = target.getAttribute("href") || "";

          sendEvent("click", elType, id, label, href ? cleanPath(href) : null);

          return;

        }

        target = target.parentElement;

      }

    }, { passive: true });



    // Formulaires : start + submit (aucune valeur saisie n'est envoyée)

    document.addEventListener("submit", function (ev) {

      var form = ev.target;

      if (form.tagName !== "FORM") return;

      var formId = form.id || form.getAttribute("data-form-id") || cleanString(form.getAttribute("name"), 80) || "form";

      sendEvent("form_start", "form", formId, null, null, { form_id: formId });

      sendEvent("form_submit", "form", formId, null, null, { form_id: formId });

    }, { passive: true });

  }



  // Envoi périodique et à la sortie / onglet caché

  setInterval(flush, FLUSH_INTERVAL);

  if (typeof window !== "undefined") {

    window.addEventListener("beforeunload", function () {

      sendPageDuration();

      flush();

    });

    window.addEventListener("visibilitychange", function () {

      if (document.visibilityState === "hidden") {

        sendPageDuration();

        flush();

      }

    });

  }



  window.ksAnalytics = { send: sendEvent, flush: flush };

})();

