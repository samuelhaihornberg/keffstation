
(function () {
  "use strict";

  var ARTICLES = [
    {
      id: "keffstation-guide",
      fr: "./content/articles/keffstation-guide.md",
      en: "./content/articles/keffstation-guide.en.md",
      title_fr: "KeffStation: Guide complet de la vitrine smart tech",
      title_en: "KeffStation: Complete guide to the smart tech showcase"
    },
    {
      id: "cos-language-guide",
      fr: "./content/articles/cos-language-guide.md",
      en: "./content/articles/cos-language-guide.en.md",
      title_fr: "COS Language: Guide complet des balises `<script_...>`",
      title_en: "COS Language: Complete guide to `<script_...>` tags"
    },
    {
      id: "pwa-seo-guide",
      fr: "./content/articles/pwa-seo-guide.md",
      en: "./content/articles/pwa-seo-guide.en.md",
      title_fr: "SEO Technique pour les PWA: Guide KeffStation",
      title_en: "Technical SEO for PWAs: KeffStation Guide"
    }
  ];

  var listEl = document.getElementById("articles-list");
  var currentLang = (typeof ksI18nLocales !== "undefined" && ksI18nLocales.getLang) ? ksI18nLocales.getLang() : "fr";

  function render() {
    listEl.innerHTML = "";
    ARTICLES.forEach(function (a) {
      var articleEl = document.createElement("article");
      var title = (currentLang === "en") ? a.title_en : a.title_fr;
      var langBadge = (currentLang === "en") ? '<span class="translated-badge">traduit</span>' : '<span class="original-badge">original</span>';
      articleEl.innerHTML = '\
        <h2>' + escapeHtml(title) + ' ' + langBadge + '</h2>\
        <div class="meta">\
          <span>📄 ' + a.id + '</span>\
          <span id="lang-label-' + a.id + '"></span>\
        </div>\
        <div class="content" id="content-' + a.id + '">Chargement…</div>\
        <div class="lang-switch">\
          <a class="lang-btn ' + (currentLang === "fr" ? "active" : "") + '" href="#fr" data-lang="fr" data-id="' + a.id + '">🇫🇷 Français</a>\
          <a class="lang-btn ' + (currentLang === "en" ? "active" : "") + '" href="#en" data-lang="en" data-id="' + a.id + '">🇺🇸 English</a>\
        </div>\
      ';
      listEl.appendChild(articleEl);
      loadArticle(a, currentLang);
    });
    // wire lang switch buttons
    listEl.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var lang = btn.getAttribute("data-lang");
        var id = btn.getAttribute("data-id");
        currentLang = lang;
        render();
      });
    });
  }

  function loadArticle(a, lang) {
    var url = (lang === "en" && a.en) ? a.en : a.fr;
    var contentEl = document.getElementById("content-" + a.id);
    var labelEl = document.getElementById("lang-label-" + a.id);
    fetch(url).then(function (r) {
      if (!r.ok) throw new Error("not found");
      return r.text();
    }).then(function (md) {
      contentEl.innerHTML = markdownToHtml(md);
      if (labelEl) {
        var orig = (lang === "en") ? "Original en français" : "Version anglaise (traduite)";
        labelEl.textContent = orig;
      }
    }).catch(function () {
      contentEl.textContent = "Article non disponible dans cette langue.";
    });
  }

  function escapeHtml(t) {
    return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function markdownToHtml(md) {
    // extraction du frontmatter YAML
    var front = "";
    var body = md;
    var m = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
    if (m) {
      front = m[1];
      body = md.slice(m[0].length);
    }
    var html = body
      .replace(/^# (.*$)/gmi, "<h1>$1</h1>")
      .replace(/^## (.*$)/gmi, "<h2>$1</h2>")
      .replace(/^### (.*$)/gmi, "<h3>$1</h3>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
      .replace(/^- (.*$)/gmi, "<li>$1</li>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>");
    if (html.indexOf("<li>") !== -1) {
      html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");
    }
    html = "<p>" + html + "</p>";
    return html;
  }

  render();
})();
