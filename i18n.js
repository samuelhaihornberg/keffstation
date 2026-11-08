/*!
 * KeffStation i18n — Traducteur universel toutes langues
 * Traduit tous les éléments marqués data-i18n="cle" ou data-i18n-html="cle"
 * Sélecteur de langue/dispositif injecté automatiquement, choix mémorisé (localStorage)
 * Synchronisation inter-onglets via événement storage
 * Traduction de page entière d'un coup (synchrone) + Google Translate en arrière-plan (non bloquant)
 * Pas d'animations qui bloquent les boutons
 */

(function () {
  "use strict";

  /* ========================= Dictionnaire de traductions ========================= */
  var DICT = {
    /* Codes de langue affichés */
    langNames: {
      af: "Afrikaans", am: "አማርኛ", ar: "العربية", as: "অসমীয়া", az: "Azərbaycan dili",
      bg: "Български", bn: "বাংলা", bo: "བོད་སྐད", ca: "Català", cs: "Čeština", cy: "Cymraeg",
      da: "Dansk", de: "Deutsch", dz: "རྫོང་ཁ", el: "Ελληνικά", en: "English", eo: "Esperanto",
      es: "Español", et: "Eesti", eu: "Euskara", fa: "فارسى", fi: "Suomi", fr: "Français",
      ga: "Gaeilge", gl: "Galego", gu: "ગુજરાતી", ha: "Hausa", he: "עברית", hi: "हिन्दी",
      hr: "Hrvatski", hu: "Magyar", hy: "Հայերեն", id: "Bahasa Indonesia", ig: "Asụsụ Igbo",
      is: "Íslenska", it: "Italiano", ja: "日本語", jv: "Basa Jawa", ka: "ქართული", kk: "Қазақша",
      km: "ខ្មែរ", kn: "ಕನ್ನಡ", ko: "한국어", ku: "کوردی", ky: "Кыргызча", la: "Latine",
      lb: "Lëtzebuergesch", lo: "ລາວ", lt: "Lietuvių", lv: "Latviešu", mg: "Malagasy",
      mk: "Македонски", ml: "മലയാളം", mn: "ᠮᠣᠩᠭᠣᠯ ᠬᠡᠯᠡ", mr: "मराठी", ms: "Bahasa Melayu",
      my: "မြန်မာ", ne: "नेपाली", nl: "Nederlands", no: "Norsk", ny: "Chichewa", or: "ଓଡ଼ିଆ",
      pa: "ਪੰਜਾਬੀ", pl: "Polski", ps: "پښتو", pt: "Português", ro: "Română", ru: "Русский",
      rw: "Kinyarwanda", sd: "سنڌي", si: "සිංහල", sk: "Slovenčina", sl: "Slovenščina",
      sm: "Gagana Sāmoa", sn: "chiShona", so: "Soomaaliga", sq: "Shqip", sr: "Српски",
      st: "Sesotho", su: "Basa Sunda", sv: "Svenska", sw: "Kiswahili", ta: "தமிழ்",
      te: "తెలుగు", tg: "тоҷикӣ", th: "ภาษาไทย", tl: "Filipino", tr: "Türkçe", uk: "Українська",
      ur: "اردو", uz: "Oʻzbekcha", vi: "Tiếng Việt", xh: "isiXhosa", yi: "ייִדיש", yo: "Èdè Yorùbá",
      zh: "中文", zu: "isiZulu"
    },

    /* Drapeaux par langue */
    langFlags: {
      af: "🇿🇦", am: "🇪🇹", ar: "🇸🇦", as: "🇮🇳", az: "🇦🇿", bg: "🇧🇬", bn: "🇧🇩", bo: "🇧🇹",
      ca: "🇪🇸", cs: "🇨🇿", cy: "🏴󠁧󠁢󠁷󠁬󠁳󠁴", da: "🇩🇰", de: "🇩🇪", dz: "🇧🇹", el: "🇬🇷",
      en: "🇺🇸", eo: "🏳️‍🌈", es: "🇪🇸", et: "🇪🇪", eu: "🇪🇸", fa: "🇮🇷", fi: "🇫🇮", fr: "🇫🇷",
      ga: "🇮🇪", gl: "🇪🇸", gu: "🇮🇳", ha: "🇳🇬", he: "🇮🇱", hi: "🇮🇳", hr: "🇭🇷", hu: "🇭🇺",
      hy: "🇦🇲", id: "🇮🇩", ig: "🇳🇬", is: "🇮🇸", it: "🇮🇹", ja: "🇯🇵", jv: "🇮🇩", ka: "🇬🇪",
      kk: "🇰🇿", km: "🇰🇭", kn: "🇮🇳", ko: "🇰🇷", ku: "🇮🇶", ky: "🇰🇬", la: "🇻🇦", lb: "🇱🇺",
      lo: "🇱🇦", lt: "🇱🇹", lv: "🇱🇻", mg: "🇲🇬", mk: "🇲🇰", ml: "🇮🇳", mn: "🇲🇳", mr: "🇮🇳",
      ms: "🇲🇾", my: "🇲🇲", ne: "🇳🇵", nl: "🇳🇱", no: "🇳🇴", ny: "🇲🇼", or: "🇮🇳", pa: "🇮🇳",
      pl: "🇵🇱", ps: "🇦🇫", pt: "🇵🇹", ro: "🇷🇴", ru: "🇷🇺", rw: "🇷🇼", sd: "🇵🇰", si: "🇱🇰",
      sk: "🇸🇰", sl: "🇸🇮", sm: "🇼🇸", sn: "🇿🇼", so: "🇸🇴", sq: "🇦🇱", sr: "🇷🇸", st: "🇱🇸",
      su: "🇮🇩", sv: "🇸🇪", sw: "🇸🇿", ta: "🇮🇳", te: "🇮🇳", tg: "🇹🇯", th: "🇹🇭", tl: "🇵🇭",
      tr: "🇹🇷", uk: "🇺🇦", ur: "🇵🇰", uz: "🇺🇿", vi: "🇻🇳", xh: "🇿🇦", yi: "🇮🇱", yo: "🇳🇬",
      zh: "🇨🇳", zu: "🇿🇦"
    },

    /* Drapeaux par devise */
    currencyFlags: {
      EUR: "🇪🇺", USD: "🇺🇸", GBP: "🇬🇧", JPY: "🇯🇵", CAD: "🇨🇦", AUD: "🇦🇺", CHF: "🇨🇭",
      CNY: "🇨🇳", KRW: "🇰🇷", INR: "🇮🇳", BRL: "🇧🇷", MXN: "🇲🇽", PLN: "🇵🇱", RUB: "🇷🇺",
      SAR: "🇸🇦", TRY: "🇹🇷", SEK: "🇸🇪", NOK: "🇳🇴", DKK: "🇩🇰", ZAR: "🇿🇦"
    },

    /* Devises par région/pays */
    regionCurrency: {
      fr: "EUR", de: "EUR", es: "EUR", it: "EUR", pt: "EUR", nl: "EUR", pl: "PLN", ru: "RUB",
      zh: "CNY", ja: "JPY", ko: "KRW", ar: "SAR", hi: "INR", tr: "TRY", en: "USD", "en-us": "USD",
      "en-gb": "GBP", "en-ca": "CAD", "en-au": "AUD", "en-jp": "JPY"
    },

    /* Codes pays vers devises */
    countryCurrency: {
      US: "USD", CA: "CAD", GB: "GBP", AU: "AUD", JP: "JPY", CN: "CNY", KR: "KRW", IN: "INR",
      BR: "BRL", MX: "MXN", CH: "CHF", SE: "SEK", NO: "NOK", DK: "DKK", ZA: "ZAR"
    },

    /* Noms des devises */
    currencyNames: {
      EUR: "Euro (€)", USD: "Dollar US ($)", GBP: "Livre sterling (£)", JPY: "Yen (¥)",
      CAD: "Dollar canadien (C$)", AUD: "Dollar australien (A$)", CHF: "Franc suisse (CHF)",
      CNY: "Yuan (¥)", KRW: "Won (₩)", INR: "Roupie (₹)", BRL: "Real (R$)", MXN: "Peso mexicain ($)",
      PLN: "Złoty (zł)", RUB: "Rouble (₽)", SAR: "Riyal (﷼)", TRY: "Livre turque (₺)",
      SEK: "Kouronne suédoise (kr)", NOK: "Kouronne norvégienne (kr)", DKK: "Kouronne danoise (kr)",
      ZAR: "Rand (R)"
    },

    /* Mots-clés UI */
    language: { fr: "Langue", en: "Language", es: "Idioma", de: "Sprache", it: "Lingua",
      pt: "Idioma", nl: "Taal", pl: "Język", ru: "Язык", zh: "语言", ja: "言語", ko: "언어",
      ar: "اللغة", hi: "भाषा", tr: "Dil" },
    currency: { fr: "Devise", en: "Currency", es: "Divisa", de: "Währung", it: "Valuta",
      pt: "Moeda", nl: "Valuta", pl: "Waluta", ru: "Валюта", zh: "货币", ja: "通貨", ko: "통화",
      ar: "العملة", hi: "मुद्रा", tr: "Para birimi" },
    animation: { fr: "Animation", en: "Animation", es: "Animación", de: "Animation",
      it: "Animazione", pt: "Animação", nl: "Animatie", pl: "Animacja", ru: "Анимация",
      zh: "动画", ja: "アニメーション", ko: "애니메이션", ar: "الرسوم المتحركة", hi: "एनीमेशन",
      tr: "Animasyon" },
    sync: { fr: "Synchronisé", en: "Synced", es: "Sincronizado", de: "Synchronisiert",
      it: "Sincronizzato", pt: "Sincronizado", nl: "Gesynchroniseerd", pl: "Synchronizacja",
      ru: "Синхронизировано", zh: "同步", ja: "同期", ko: "동기화", ar: "مزامنة", hi: "सिंक्रोनाइज़",
      tr: "Senkronize" },
    async: { fr: "Asynchronisé", en: "Asynchronous", es: "Asincrónico", de: "Asynchron",
      it: "Asincrono", pt: "Assíncrono", nl: "Asynchroon", pl: "Asynchronicznie",
      ru: "Асинхронно", zh: "异步", ja: "非同期", ko: "비동기식", ar: "غير متزامن", hi: "असिंक्रोनस",
      tr: "Zamansız" },
    desync: { fr: "Désynchronisé", en: "Desynced", es: "Desincronizado", de: "Desynchronisiert",
      it: "Desincronizzato", pt: "Desincronizado", nl: "Ongesynchroniseerd", pl: "Desynchronizacja",
      ru: "Десинхронизировано", zh: "不同步", ja: "非同期", ko: "비동기식", ar: "غير متزامن",
      hi: "असमांजस्य", tr: "Senkronize Değil" },

    /* ---------- Racine / index.html ---------- */
    app_name: { fr: "KeffStation", en: "KeffStation", es: "KeffStation", de: "KeffStation",
      it: "KeffStation", pt: "KeffStation", nl: "KeffStation", pl: "KeffStation", ru: "KeffStation",
      zh: "KeffStation", ja: "KeffStation", ko: "KeffStation", ar: "KeffStation", hi: "KeffStation",
      tr: "KeffStation" },
    subtitle_platform: { fr: "Vitrine Smart Tech & High Tech", en: "Smart Tech & High Tech Showcase",
      es: "Escaparate Smart Tech y High Tech", de: "Smart Tech & High Tech Schaufenster",
      it: "Vetrina Smart Tech & High Tech", pt: "Vitrine Smart Tech & High Tech",
      nl: "Smart Tech & High Tech Schaufenster", pl: "Witryna Smart Tech & High Tech",
      ru: "Витрина Smart Tech & High Tech", zh: "智能科技与高科技橱窗", ja: "スマートテック／ハイトック ショーケース",
      ko: "스마트 테크 & 하이테크 쇼케이스", ar: "عرض الذكي Tech و الهايتك", hi: "स्मार्ट टेक और हाईटेक शोकेस",
      tr: "Akıllı Tek ve Yüksek Teknoloji Vitrini" },
    tagline: { fr: "Become.What.Ever.You.Want...Kw;)Nk...!", en: "Become.What.Ever.You.Want...Kw;)Nk...!",
      es: "¡Sé.lo.que.quieras...Kw;)Nk...!", de: "Werde.Was.Immer.Du.Willst...Kw;)Nk...!",
      it: "Diventa.Cosa.Vuoi...Kw;)Nk...!", pt: "Torne-se.O.Que.Quiser...Kw;)Nk...!",
      nl: "Word.Wat.Je.Wilt...Kw;)Nk...!", pl: "Bądź.Kim.Chcesz...Kw;)Nk...!",
      ru: "Стань.Тем.Кем.Хочешь...Kw;)Nk...!", zh: "成为你想成为的任何事物...Kw;)Nk...!",
      ja: "なりたいものになろう...Kw;)Nk...!", ko: "whatever you want가 되세요...Kw;)Nk...!",
      ar: "كن ما تريد...Kw;)Nk...!", hi: "जो चाहो बनो...Kw;)Nk...!", tr: "İstediğin şey ol...Kw;)Nk...!" },
    scroll_down: { fr: "Défiler", en: "Scroll", es: "Desplazar", de: "Blättern", it: "Scorri",
      pt: "Rolar", nl: "Schuiven", pl: "Przewiń", ru: "Прокрутка", zh: "滚动", ja: "スクロール",
      ko: "스크롤", ar: "مرر", hi: "स्क्रॉल करें", tr: "Kaydır" },
    platform_title: { fr: "KiffStation : Votre plateforme multi-PWA", en: "KiffStation: Your multi-PWA platform",
      es: "KiffStation: Tu plataforma multi-PWA", de: "KiffStation: Ihre multi-PWA Plattform",
      it: "KiffStation: La tua piattaforma multi-PWA", pt: "KiffStation: Sua plataforma multi-PWA",
      nl: "KiffStation: Jouw multi-PWA platform", pl: "KiffStation: Twoja platforma multi-PWA",
      ru: "KiffStation: Ваша multi-PWA платформа", zh: "KiffStation：您的多平台PWA",
      ja: "KiffStation：マルチPWAプラットフォーム", ko: "KiffStation: 멀티 PWA 플랫폼",
      ar: "KiffStation: منصتك متعددة PWA", hi: "KiffStation: आपका मल्टी-PWA प्लेटफॉर्म",
      tr: "KiffStation: Çoklu PWA platformunuz" },
    platform_desc: { fr: "KeffStation est une plateforme regroupant plusieurs applications web (PWA) dédiées à la technologie, aux gadgets high‑tech et aux objets connectés. Toutes les apps sont conçues pour offrir une expérience native sur Android, iOS et Windows.",
      en: "KeffStation is a platform bringing together several web apps (PWA) dedicated to technology, high‑tech gadgets and connected objects. All apps are designed to offer a native experience on Android, iOS and Windows.",
      es: "KeffStation es una plataforma que agrupa varias aplicaciones web (PWA) dedicadas a la tecnología, los gadgets high-tech y los objetos conectados. Todas las apps están diseñadas para ofrecer una experiencia nativa en Android, iOS y Windows.",
      de: "KeffStation ist eine Plattform, die mehrere Web-Apps (PWA) vereint, die der Technologie, High-Tech-Gadgets und vernetzten Objekten gewidmet sind. Alle Apps sind darauf ausgelegt, ein natives Erlebnis auf Android, iOS und Windows zu bieten.",
      it: "KeffStation è una piattaforma che riunisce diverse app web (PWA) dedicate alla tecnologia, ai gadget high-tech e agli oggetti connessi. Tutte le app sono progettate per offrire un'esperienza nativa su Android, iOS e Windows.",
      pt: "KeffStation é uma plataforma que reúne vários aplicativos web (PWA) dedicados à tecnologia, gadgets high-tech e objetos conectados. Todos os aplicativos são projetados para oferecer uma experiência nativa no Android, iOS e Windows.",
      nl: "KeffStation is een platform dat verschillende web-apps (PWA) samenbrengt die zijn toegewijd aan technologie, high-tech-gadgets en verbonden objecten. Alle apps zijn ontworpen om een native ervaring te bieden op Android, iOS en Windows.",
      pl: "KeffStation to platforma gromadząca kilka aplikacji webowych (PWA) poświęconych technologii, high-techowym gadżetom i podłączonym przedmiotom. Wszystkie aplikacje są zaprojektowane tak, aby oferować natywne doświadczenie na Androidzie, iOS i Windows.",
      ru: "KeffStation — это платформа, объединяющая несколько веб-приложений (PWA), посвященных технологиям, высокотехнологичным гаджетам и подключенным объектам. Все приложения разработаны для обеспечения нативного опыта на Android, iOS и Windows.",
      zh: "KeffStation 是一个集合多个 Web 应用（PWA）的平台，致力于技术、高科技设备和连接对象。所有应用都旨在为 Android、iOS 和 Windows 提供原生体验。",
      ja: "KeffStationは、テクノロジー、ハイテクガジェット、コネクテッドオブジェクトに特化した複数のウェブアプリ（PWA）を集約するプラットフォームです。すべてのアプリは、Android、iOS、Windowsでネイティブ体験を提供します。",
      ko: "KeffStation은 기술, 하이테크 가젯, 연결된 객체에 특화된 여러 웹 앱(PWA)을 모아놓은 플랫폼입니다. 모든 앱은 Android, iOS, Windows에서 네이티브 경험을 제공합니다.",
      ar: "KeffStation هي منصة تجمع عدة تطبيقات ويب (PWA) مخصصة للتكنولوجيا والأجهزة الذكية عالية التقنية والأجهزة المتصلة. جميع التطبيقات مصممة لتوفير تجربة أصلية على Android و iOS و Windows.",
      hi: "KeffStation एक ऐसा प्लेटफॉर्म है जो कई वेब ऐप (PWA) को इकट्ठा करता है जो तकनीक, हाई-टेक गैजेट और कनेक्टेड ऑब्जेक्ट्स के लिए समर्पित हैं। सभी ऐप Android, iOS और Windows पर मूल अनुभव प्रदान करते हैं।",
      tr: "KeffStation, teknoloji, yüksek teknoloji cihazları ve bağlı nesneler için adanmış birden fazla web uygulaması (PWA) birleştiren bir platformdur. Tüm uygulamalar, Android, iOS ve Windows'ta yerel bir deneyim sunar." },
    install_title: { fr: "Installez vos apps préférées", en: "Install your favorite apps",
      es: "Instala tus aplicaciones favoritas", de: "Installieren Sie Ihre Lieblings-Apps",
      it: "Installa le tue app preferite", pt: "Instale seus aplicativos favoritos",
      nl: "Installeer je favoriete apps", pl: "Zainstaluj swoje ulubione aplikacje",
      ru: "Установите ваши любимые приложения", zh: "安装你喜欢的应用", ja: "お気に入りのアプリをインストール",
      ko: "즐겨찾는 앱 설치", ar: "ثبت تطبيقاتك المفضلة", hi: "अपने पसंदीदा ऐप इंस्टॉल करें",
      tr: "Favori uygulamalarınızı yükleyin" },
    install_android: { fr: "Android APK", en: "Android APK", es: "Android APK", de: "Android APK",
      it: "Android APK", pt: "Android APK", nl: "Android APK", pl: "Android APK", ru: "Android APK",
      zh: "Android APK", ja: "Android APK", ko: "안드로이드 APK", ar: "آندرويد APK", hi: "एंड्रॉइड APK",
      tr: "Android APK" },
    install_ios: { fr: "iOS IPA", en: "iOS IPA", es: "iOS IPA", de: "iOS IPA", it: "iOS IPA",
      pt: "iOS IPA", nl: "iOS IPA", pl: "iOS IPA", ru: "iOS IPA", zh: "iOS IPA", ja: "iOS IPA",
      ko: "iOS IPA", ar: "iOS IPA", hi: "iOS IPA", tr: "iOS IPA" },
    install_windows: { fr: "Windows EXE", en: "Windows EXE", es: "Windows EXE", de: "Windows EXE",
      it: "Windows EXE", pt: "Windows EXE", nl: "Windows EXE", pl: "Windows EXE", ru: "Windows EXE",
      zh: "Windows EXE", ja: "Windows EXE", ko: "윈도우 EXE", ar: "ويندوز EXE", hi: "विंडोज़ EXE",
      tr: "Windows EXE" },
    install_note: { fr: "Ces applications fonctionnent hors ligne et sont mises à jour automatiquement.",
      en: "These applications work offline and are updated automatically.",
      es: "Estas aplicaciones funcionan sin conexión y se actualizan automáticamente.",
      de: "Diese Anwendungen funktionieren offline und werden automatisch aktualisiert.",
      it: "Queste applicazioni funzionano offline e vengono aggiornate automaticamente.",
      pt: "Estes aplicativos funcionam off-line e são atualizados automaticamente.",
      nl: "Deze apps werken offline en worden automatisch bijgewerkt.",
      pl: "Te aplikacje działają offline i są aktualizowane automatycznie.",
      ru: "Эти приложения работают в офлайн-режиме и обновляются автоматически.",
      zh: "这些应用可离线使用并自动更新。", ja: "これらのアプリはオフラインで動作し、自動的に更新されます。",
      ko: "이 앱들은 오프라인에서 작동하며 자동으로 업데이트됩니다.", ar: "هذه التطبيقات تعمل دون اتصال بالإنترنت ويتم تحديثها تلقائيًا.",
      hi: "ये एप्लिकेशन ऑफ़लाइन काम करते हैं और स्वचालित रूप से अपडेट होते हैं।",
      tr: "Bu uygulamalar çevrimdışı çalışır ve otomatik olarak güncellenir." },
    app_count: { fr: "apps", en: "apps", es: "apps", de: "Apps", it: "app", pt: "apps",
      nl: "apps", pl: "aplikacje", ru: "приложения", zh: "个应用", ja: "アプリ", ko: "개 앱",
      ar: "تطبيقات", hi: "ऐप्स", tr: "uygulama" },

    /* ---------- Sous-PWA génériques ---------- */
    kifftech_name: { fr: "KiffTech", en: "KiffTech", es: "KiffTech", de: "KiffTech",
      it: "KiffTech", pt: "KiffTech", nl: "KiffTech", pl: "KiffTech", ru: "KiffTech",
      zh: "KiffTech", ja: "KiffTech", ko: "키프테크", ar: "كيفيتك", hi: "किफटेक", tr: "KiffTech" },
    kifftech_desc: { fr: "Boutique et gestion d'objets connectés", en: "Shop and connected objects management",
      es: "Tienda y gestión de objetos conectados", de: "Shop und Verwaltung vernetzter Objekte",
      it: "Negozio e gestione di oggetti connessi", pt: "Loja e gerenciamento de objetos conectados",
      nl: "Winkel en beheer van verbonden objecten", pl: "Sklep i zarządzanie podłączonymi przedmiotami",
      ru: "Магазин и управление подключенными объектами", zh: "商店和连接对象管理",
      ja: "ショップとコネクテッドオブジェクト管理", ko: "샵과 연결된 객체 관리",
      ar: "متجر وإدارة الأشياء المتصلة", hi: "स्टोर और कनेक्टेड ऑब्जेक्ट्स प्रबंधन",
      tr: "Mağaza ve bağlı nesne yönetimi" },
    via_name: { fr: "ViArtificial", en: "ViArtificial", es: "ViArtificial", de: "ViArtificial",
      it: "ViArtificial", pt: "ViArtificial", nl: "ViArtificial", pl: "ViArtificial", ru: "ViArtificial",
      zh: "ViArtificial", ja: "ViArtificial", ko: "비아아티피셜", ar: "فيأرتيفيشيل", hi: "विआआर्टिफिशियल",
      tr: "ViArtificial" },
    via_desc: { fr: "Moteurs IA et conversation directe", en: "AI engines and direct conversation",
      es: "Motores IA y conversación directa", de: "KI-Engines und direkte Konversation",
      it: "Motori IA e conversazione diretta", pt: "Motores IA e conversação direta",
      nl: "AI-engines en directe conversatie", pl: "Silniki AI i bezpośrednia rozmowa",
      ru: "ИИ-движки и прямая беседа", zh: "AI引擎和直接对话", ja: "AIエンジンと直接の会話",
      ko: "AI 엔진과 직접 대화", ar: "محركات ذكاء اصطناعي ومحادثة مباشرة",
      hi: "AI इंजन और सीधी बातचीत", tr: "AI motorları ve doğrudan sohbet" },
    tricktrocjob_name: { fr: "Tricktrocjob", en: "Tricktrocjob", es: "Tricktrocjob", de: "Tricktrocjob",
      it: "Tricktrocjob", pt: "Tricktrocjob", nl: "Tricktrocjob", pl: "Tricktrocjob", ru: "Tricktrocjob",
      zh: "Tricktrocjob", ja: "Tricktrocjob", ko: "트릭트로크ジョブ", ar: "تريكتروكجوب",
      hi: "ट्रिकट्रोकजॉब", tr: "Tricktrocjob" },
    tricktrocjob_desc: { fr: "Utilitaires et outils techniques", en: "Utilities and technical tools",
      es: "Utilidades y herramientas técnicas", de: "Dienstprogramme und technische Werkzeuge",
      it: "Utilità e strumenti tecnici", pt: "Utilitários e ferramentas técnicas",
      nl: "Hulpprogramma's en technische gereedschappen", pl: "Narzędzia i narzędzia techniczne",
      ru: "Утилиты и технические инструменты", zh: "实用工具和技术工具",
      ja: "ユーティリティと技術ツール", ko: "유틸리티 및 기술 도구",
      ar: "برامج مساعدة وأدوات تقنية", hi: "यूटिलिटी और तकनीकी उपकरण",
      tr: "Araçlar ve teknik araçlar" },
    videogames_name: { fr: "Videogames", en: "Videogames", es: "Videojuegos", de: "Videospiele",
      it: "Videogiochi", pt: "Videogames", nl: "Videogames", pl: "Gry wideo", ru: "Видеоигры",
      zh: "电子游戏", ja: "ビデオゲーム", ko: "비디오 게임", ar: "ألعاب فيديو", hi: "वीडियो गेम",
      tr: "Video oyunları" },
    videogames_desc: { fr: "Retro et jeux rétro", en: "Retro and retro games",
      es: "Retro y juegos retro", de: "Retro und Retro-Spiele", it: "Retro e giochi retrò",
      pt: "Retrô e jogos retrô", nl: "Retro en retro games", pl: "Retro i gry retro",
      ru: "Ретро и ретро-игры", zh: "复古游戏", ja: "レトロゲーム", ko: "레트로 게임",
      ar: "ألعاب كلاسيكية", hi: "रेट्रो गेम्स", tr: "Retro oyunlar" },
    coseditor_name: { fr: "Éditeur COS", en: "COS Editor", es: "Editor COS", de: "COS-Editor",
      it: "Editor COS", pt: "Editor COS", nl: "COS-editor", pl: "Edytor COS", ru: "Редактор COS",
      zh: "COS 编辑器", ja: "COS エディター", ko: "COS 편집기", ar: "محرر COS", hi: "COS संपादक",
      tr: "COS Düzenleyici" },
    coseditor_desc: { fr: "Analyse, aperçu et tutoriels COS", en: "COS analysis, preview and tutorials",
      es: "Análisis, vista previa y tutoriales COS", de: "COS-Analyse, Vorschau und Tutorials",
      it: "Analisi, anteprima e tutorial COS", pt: "Análise, pré-visualização e tutoriais COS",
      nl: "COS-analyse, voorbeeld en tutorials", pl: "Analiza, podgląd i samouczki COS",
      ru: "Анализ, предварительный просмотр и руководства COS", zh: "COS 分析、预览和教程",
      ja: "COS 分析、プレビューとチュートリアル", ko: "COS 분석, 미리보기 및 튜토리얼",
      ar: "تحليل ومعاينة ودروس COS", hi: "COS विश्लेषण, पूर्वावलोकन और ट्यूटोरियल",
      tr: "COS analizi, önizleme ve eğiticiler" },
    linguisticmotors_name: { fr: "Moteurs linguistiques", en: "Linguistic engines",
      es: "Motores lingüísticos", de: "Linguistische Motoren", it: "Motori linguistici",
      pt: "Motores linguísticos", nl: "Linguïstische engines", pl: "Silniki językowe",
      ru: "Лингвистические движки", zh: "语言引擎", ja: "言語エンジン", ko: "언어 엔진",
      ar: "محركات لغوية", hi: "भाषा इंजन", tr: "Dil motorları" },
    linguisticmotors_desc: { fr: "NLP/LLM local et expérimental", en: "Local and experimental NLP/LLM",
      es: "NLP/LLM local y experimental", de: "Lokaler und experimenteller NLP/LLM",
      it: "NLP/LLM locale e sperimentale", pt: "NLP/LLM local e experimental",
      nl: "Lokale en experimentele NLP/LLM", pl: "Lokalny i eksperymentalny NLP/LLM",
      ru: "Локальный и экспериментальный NLP/LLM", zh: "本地和实验性 NLP/LLM",
      ja: "ローカルおよび実験的な NLP/LLM", ko: "로컬 및 실험적 NLP/LLM",
      ar: "NLP/LLM محلي وتجريبي", hi: "स्थानीय और प्रायोगिक NLP/LLM",
      tr: "Yerel ve deneysel NLP/LLM" },

    /* ---------- UI générique ---------- */
    init: { fr: "Initialisation…", en: "Initializing…", es: "Inicializando…", de: "Initialisierung…",
      it: "Inizializzazione…", pt: "Inicializando…", nl: "Initialisatie…", pl: "Inicjalizacja…",
      ru: "Инициализация…", zh: "初始化中…", ja: "初期化中…", ko: "초기화 중…", ar: "جاري التهيئة…",
      hi: "प्रारंभ हो रहा है…", tr: "Başlatılıyor…" },
    default: { fr: "Défaut", en: "Default", es: "Predeterminado", de: "Standard",
      it: "Predefinito", pt: "Padrão", nl: "Standaard", pl: "Domyślny", ru: "По умолчанию",
      zh: "默认", ja: "デフォルト", ko: "기본값", ar: "الافتراضي", hi: "डिफ़ॉल्ट", tr: "Varsayılan" },
    example: { fr: "Exemple", en: "Example", es: "Ejemplo", de: "Beispiel", it: "Esempio",
      pt: "Exemplo", nl: "Voorbeeld", pl: "Przykład", ru: "Пример", zh: "示例", ja: "例",
      ko: "예시", ar: "مثال", hi: "उदाहरण", tr: "Örnek" },
    clear: { fr: "Effacer", en: "Clear", es: "Borrar", de: "Löschen", it: "Cancella", pt: "Limpar",
      nl: "Wissen", pl: "Wyczyść", ru: "Очистить", zh: "清除", ja: "クリア", ko: "지우기",
      ar: "مسح", hi: "साफ़ करें", tr: "Temizle" },
    tutorial: { fr: "Tutoriel", en: "Tutorial", es: "Tutorial", de: "Tutorial", it: "Tutorial",
      pt: "Tutorial", nl: "Zelfstudie", pl: "Samouczek", ru: "Руководство", zh: "教程",
      ja: "チュートリアル", ko: "튜토리얼", ar: "دورة تعليمية", hi: "ट्यूटोरियल", tr: "Eğitim" },
    language: { fr: "Langue", en: "Language", es: "Idioma", de: "Sprache", it: "Lingua",
      pt: "Idioma", nl: "Taal", pl: "Język", ru: "Язык", zh: "语言", ja: "言語", ko: "언어",
      ar: "اللغة", hi: "भाषा", tr: "Dil" },
    offline: { fr: "Hors ligne", en: "Offline", es: "Sin conexión", de: "Offline", it: "Offline",
      pt: "Off-line", nl: "Offline", pl: "Offline", ru: "Офлайн", zh: "离线", ja: "オフライン",
      ko: "오프라인", ar: "بدون اتصال", hi: "ऑफलाइन", tr: "Çevrimdışı" },
    loading: { fr: "Chargement…", en: "Loading…", es: "Cargando…", de: "Laden…", it: "Caricamento…",
      pt: "Carregando…", nl: "Laden…", pl: "Ładowanie…", ru: "Загрузка…", zh: "加载中…",
      ja: "読み込み中…", ko: "로드 중…", ar: "جاري التحميل…", hi: "लोड हो रहा है…",
      tr: "Yükleniyor…" },

    /* ---------- Widget 7 Web Apps ---------- */
    widget_apps_title: { fr: "7 Web Apps KeffStation", en: "7 KeffStation Web Apps",
      es: "7 Aplicaciones Web KeffStation", de: "7 KeffStation Web-Apps", it: "7 App Web KeffStation",
      pt: "7 Aplicativos Web KeffStation", nl: "7 KeffStation Web-apps", pl: "7 Aplikacji sieciowych KeffStation",
      ru: "7 веб-приложений KeffStation", zh: "7 个 KeffStation Web 应用", ja: "7 つの KeffStation ウェブアプリ",
      ko: "7 개의 KeffStation 웹 앱", ar: "تطبيقات ويب KeffStation", hi: "7 KeffStation वेब ऐप",
      tr: "7 KeffStation Web Uygulaması" },
    widget_kifftech: { fr: "KiffTech", en: "KiffTech", es: "KiffTech", de: "KiffTech",
      it: "KiffTech", pt: "KiffTech", nl: "KiffTech", pl: "KiffTech", ru: "KiffTech",
      zh: "KiffTech", ja: "KiffTech", ko: "키프테크", ar: "كيفيتك", hi: "किफटेक", tr: "KiffTech" },
    widget_kifftech_desc: { fr: "Objets connectés & gadgets", en: "Connected objects & gadgets",
      es: "Objetos conectados y gadgets", de: "Vernetzte Objekte & Gadgets",
      it: "Oggetti connessi e gadget", pt: "Objetos conectados e gadgets",
      nl: "Verbonden objecten & gadgets", pl: "Podłączone przedmioty i gadżety",
      ru: "Подключенные объекты и гаджеты", zh: "连接对象和小工具", ja: "コネクテッドオブジェクトとガジェット",
      ko: "연결된 객체 및 가젯", ar: "الأشياء المتصلة والأدوات", hi: "कनेक्टेड ऑब्जेक्ट्स और गैजेट्स",
      tr: "Bağlantılı nesneler ve cihazlar" },
    widget_via: { fr: "ViArtificial Labs", en: "ViArtificial Labs", es: "ViArtificial Labs",
      de: "ViArtificial Labs", it: "ViArtificial Labs", pt: "ViArtificial Labs", nl: "ViArtificial Labs",
      pl: "ViArtificial Labs", ru: "ViArtificial Labs", zh: "ViArtificial Labs", ja: "ViArtificial Labs",
      ko: "비아아티피셜 랩스", ar: "مختبرات فيأرتيفيشيل", hi: "विआआर्टिफिशियल लैब्स",
      tr: "ViArtificial Laboratuvarları" },
    widget_via_desc: { fr: "Moteurs IA & conversation", en: "AI engines & conversation",
      es: "Motores IA y conversación", de: "KI-Engines & Konversation", it: "Motori IA e conversazione",
      pt: "Motores IA e conversação", nl: "AI-engines & gesprek", pl: "Silniki AI i rozmowa",
      ru: "ИИ-движки и беседа", zh: "AI 引擎和直接对话", ja: "AI エンジンと直接の会話",
      ko: "AI 엔진과 대화", ar: "محركات ذكاء اصطناعي ومحادثة مباشرة",
      hi: "AI इंजन और सीधी बातचीत", tr: "AI motorları ve doğrudan sohbet" },
    widget_critiques: { fr: "Critiques-Services", en: "Critiques-Services", es: "Críticas-Servicios",
      de: "Kritiken-Dienste", it: "Recensioni-Servizi", pt: "Críticas-Serviços",
      nl: "Recensies-Diensten", pl: "Recenzje-Usługi", ru: "Критические услуги", zh: "批评-服务",
      ja: "批評-サービス", ko: "비판-서비스", ar: "نقد-خدمات", hi: "आलोचना-सेवाएं",
      tr: "Eleştiri-Hizmetler" },
    widget_critiques_desc: { fr: "Avis & critiques services", en: "Reviews & service critiques",
      es: "Reseñas y críticas de servicios", de: "Bewertungen & Dienstleistungskritiken",
      it: "Recensioni e critiche di servizi", pt: "Avaliações e críticas de serviços",
      nl: "Beoordelingen & dienstkritieken", pl: "Recenzje i krytyka usług",
      ru: "Обзоры и критика услуг", zh: "评论和服务批评", ja: "レビューとサービス批評",
      ko: "리뷰 및 서비스 비판", ar: "مراجعات وانتقادات الخدمات", hi: "समीक्षा और सेवा आलोचना",
      tr: "İncelemeler ve hizmet eleştirileri" },
    widget_tricktrocjob: { fr: "Tricktrocjob", en: "Tricktrocjob", es: "Tricktrocjob", de: "Tricktrocjob",
      it: "Tricktrocjob", pt: "Tricktrocjob", nl: "Tricktrocjob", pl: "Tricktrocjob", ru: "Tricktrocjob",
      zh: "Tricktrocjob", ja: "Tricktrocjob", ko: "트릭트로크ジョブ", ar: "تريكتروكجوب",
      hi: "ट्रिकट्रोकजॉब", tr: "Tricktrocjob" },
    widget_tricktrocjob_desc: { fr: "Utilitaires & outils tech", en: "Utilities & tech tools",
      es: "Utilidades y herramientas técnicas", de: "Dienstprogramme und technische Werkzeuge",
      it: "Utilità e strumenti tecnici", pt: "Utilitários e ferramentas de tecnologia",
      nl: "Hulpprogramma's en technische gereedschappen", pl: "Narzędzia i narzędzia techniczne",
      ru: "Утилиты и технические инструменты", zh: "实用工具和技术工具",
      ja: "ユーティリティと技術ツール", ko: "유틸리티 및 기술 도구",
      ar: "برامج مساعدة وأدوات تقنية", hi: "यूटिलिटी और तकनीकी उपकरण",
      tr: "Araçlar ve teknik araçlar" },
    widget_videogames: { fr: "Videogames", en: "Videogames", es: "Videojuegos", de: "Videospiele",
      it: "Videogiochi", pt: "Videogames", nl: "Videogames", pl: "Gry wideo", ru: "Видеоигры",
      zh: "电子游戏", ja: "ビデオゲーム", ko: "비디오 게임", ar: "ألعاب فيديو", hi: "वीडियो गेम",
      tr: "Video oyunları" },
    widget_videogames_desc: { fr: "Jeux & émulation", en: "Games & emulation",
      es: "Juegos y emulación", de: "Spiele & Emulation", it: "Giochi ed emulazione",
      pt: "Jogos e emulação", nl: "Games & emulatie", pl: "Gry i emulacja", ru: "Игры и эмуляция",
      zh: "游戏和模拟", ja: "ゲームとエミュレーション", ko: "게임 및 에뮬레이션",
      ar: "ألعاب ومحاكاة", hi: "गेम और एमुलेशन", tr: "Oyunlar ve emülasyon" },
    widget_cos: { fr: "cos Editor", en: "cos Editor", es: "Editor COS", de: "COS-Editor",
      it: "Editor COS", pt: "Editor COS", nl: "COS-editor", pl: "Edytor COS", ru: "Редактор COS",
      zh: "COS 编辑器", ja: "COS エディター", ko: "COS 편집기", ar: "محرر COS", hi: "COS संपादक",
      tr: "COS Düzenleyici" },
    widget_cos_desc: { fr: "Éditeur syntaxe COS", en: "COS syntax editor", es: "Editor de sintaxis COS",
      de: "COS-Syntax-Editor", it: "Editor sintassi COS", pt: "Editor de sintaxe COS",
      nl: "COS-syntaxiseditor", pl: "Edytor składni COS", ru: "Редактор синтаксиса COS",
      zh: "COS 语法编辑器", ja: "COS 構文エディター", ko: "COS 구문 편집기",
      ar: "محرر بناء جملة COS", hi: "COS सिंटैक्स संपादक", tr: "COS sözdizimi düzenleyici" },
    widget_linguistic: { fr: "Linguistic Motors", en: "Linguistic Motors",
      es: "Motores lingüísticos", de: "Linguistische Motoren", it: "Motori linguistici",
      pt: "Motores linguísticos", nl: "Linguïstische motoren", pl: "Silniki językowe",
      ru: "Лингвистические двигатели", zh: "语言引擎", ja: "言語モーター", ko: "언어 모터",
      ar: "محركات لغوية", hi: "भाषा इंजन", tr: "Dil motorları" },
    widget_linguistic_desc: { fr: "NLP / LLM local", en: "Local NLP / LLM", es: "NLP / LLM local",
      de: "Lokales NLP / LLM", it: "NLP / LLM locale", pt: "NLP / LLM local", nl: "Lokaal NLP / LLM",
      pl: "Lokalny NLP / LLM", ru: "Локальный NLP / LLM", zh: "本地 NLP / LLM",
      ja: "ローカル NLP / LLM", ko: "로컬 NLP / LLM", ar: "NLP / LLM محلي", hi: "स्थानीय NLP / LLM",
      tr: "Yerel NLP / LLM" },

    /* ---------- cos-editor ---------- */
    source_cos: { fr: "Source COS", en: "COS Source", es: "Código COS", de: "COS-Quelle",
      it: "Sorgente COS", pt: "Fonte COS", nl: "COS-bron", pl: "Źródło COS", ru: "Исходный код COS",
      zh: "COS 源代码", ja: "COS ソース", ko: "COS 소스", ar: "مصدر COS", hi: "COS स्रोत",
      tr: "COS Kaynağı" },
    resultats: { fr: "Résultats", en: "Results", es: "Resultados", de: "Ergebnisse", it: "Risultati",
      pt: "Resultados", nl: "Resultaten", pl: "Wyniki", ru: "Результаты", zh: "结果", ja: "結果",
      ko: "결과", ar: "النتائج", hi: "परिणाम", tr: "Sonuçlar" },
    analyser: { fr: "Analyser", en: "Analyze", es: "Analizar", de: "Analysieren", it: "Analizza",
      pt: "Analisar", nl: "Analyseren", pl: "Analizuj", ru: "Анализировать", zh: "分析", ja: "分析",
      ko: "분석", ar: "حلّل", hi: "विश्लेषण करें", tr: "Analiz Et" },
    copier_json: { fr: "Copier JSON", en: "Copy JSON", es: "Copiar JSON", de: "JSON kopieren",
      it: "Copia JSON", pt: "Copiar JSON", nl: "JSON kopiëren", pl: "Kopiuj JSON", ru: "Копировать JSON",
      zh: "复制 JSON", ja: "JSONをコピー", ko: "JSON 복사", ar: "نسخ JSON", hi: "JSON कॉपी करें",
      tr: "JSON Kopyala" },
    telecharger_json: { fr: "Télécharger JSON", en: "Download JSON", es: "Descargar JSON",
      de: "JSON herunterladen", it: "Scarica JSON", pt: "Baixar JSON", nl: "JSON downloaden",
      pl: "Pobierz JSON", ru: "Скачать JSON", zh: "下载 JSON", ja: "JSONをダウンロード",
      ko: "JSON 다운로드", ar: "تنزيل JSON", hi: "JSON डाउनलोड करें", tr: "JSON İndir" },
    apercu: { fr: "Aperçu", en: "Preview", es: "Vista previa", de: "Vorschau", it: "Anteprima",
      pt: "Pré-visualização", nl: "Voorbeeld", pl: "Podgląd", ru: "Предварительный просмотр",
      zh: "预览", ja: "プレビュー", ko: "미리보기", ar: "معاينة", hi: "पूर्वावलोकन", tr: "Önizleme" },
    liens: { fr: "Liens", en: "Links", es: "Enlaces", de: "Links", it: "Link", pt: "Links",
      nl: "Links", pl: "Linki", ru: "Ссылки", zh: "链接", ja: "リンク", ko: "링크", ar: "روابط",
      hi: "लिंक", tr: "Bağlantılar" },
    diagnostics: { fr: "Diagnostics", en: "Diagnostics", es: "Diagnósticos", de: "Diagnose",
      it: "Diagnostica", pt: "Diagnósticos", nl: "Diagnostics", pl: "Diagnostyka", ru: "Диагностика",
      zh: "诊断", ja: "診断", ko: "진단", ar: "تشخيصات", hi: "निदान", tr: "Tanılar" },
    pied_cos: { fr: "COS · analyse locale dans le navigateur · aucun script personnalisé exécuté",
      en: "COS · local analysis in browser · no custom script executed",
      es: "COS · análisis local en el navegador · ningún script personalizado ejecutado",
      de: "COS · lokale Analyse im Browser · kein benutzerdefiniertes Skript ausgeführt",
      it: "COS · analisi locale nel browser · nessuno script personalizzato eseguito",
      pt: "COS · análise local no navegador · nenhum script personalizado executado",
      nl: "COS · lokale analyse in browser · geen aangepast script uitgevoerd",
      pl: "COS · lokalna analiza w przeglądarce · żaden niestandardowy skrypt nie został wykonany",
      ru: "COS · локальный анализ в браузере · никакой пользовательский скрипт не выполнен",
      zh: "COS · 浏览器本地分析 · 未执行自定义脚本", ja: "COS · ブラウザー内ローカル分析 · カスタムスクリプトは実行されません",
      ko: "COS · 브라우저 내 로컬 분석 · 사용자 정의 스크립트 실행 안 함", ar: "COS · تحليل محلي في المتصفح · لا توجد نصوص مخصصة يتم تنفيذها",
      hi: "COS · ब्राउज़र में स्थानीय विश्लेषण · कोई कस्टम स्क्रिप्ट नहीं चलाया गया",
      tr: "COS · tarayıcıda yerel analiz · özel betik çalıştırılmadı" },

    /* ---------- admin / prototype ---------- */
    admin_title: { fr: "Administration", en: "Administration", es: "Administración",
      de: "Administration", it: "Amministrazione", pt: "Administração", nl: "Administratie",
      pl: "Administracja", ru: "Администрирование", zh: "管理", ja: "管理", ko: "관리",
      ar: "إدارة", hi: "प्रशासन", tr: "Yönetim" },
    prive: { fr: "Privé", en: "Private", es: "Privado", de: "Privat", it: "Privato",
      pt: "Privado", nl: "Privé", pl: "Prywatne", ru: "Частный", zh: "私有", ja: "プライベート",
      ko: "비공개", ar: "خاص", hi: "निजी", tr: "Özel" },
    prototype_notice: { fr: "Prototype. Données fictives, aucune connexion réelle, aucun secret.",
      en: "Prototype. Fake data, no real connection, no secrets.", es: "Prototipo. Datos ficticios, sin conexión real, sin secretos.",
      de: "Prototyp. Fiktive Daten, keine echte Verbindung, keine Geheimnisse.",
      it: "Prototipo. Dati fittizi, nessuna connessione reale, nessun segreto.",
      pt: "Protótipo. Dados fictícios, nenhuma conexão real, nenhum segredo.",
      nl: "Prototype. Nepgegevens, geen echte verbinding, geen geheimen.",
      pl: "Prototyp. Dane fikcyjne, brak rzeczywistego połączenia, brak tajemnic.",
      ru: "Прототип. Фальшивые данные, нет реального соединения, нет секретов.",
      zh: "原型。假数据，无真实连接，无秘密。", ja: "プロトタイプ。ダミーデータ、実際の接続なし、秘密なし。",
      ko: "프로토타입. 가짜 데이터, 실제 연결 없음, 비밀 없음.", ar: "نموذج أولي. بيانات وهمية، कोई اتصال حقيقي नहीं, कोई रहस्य नहीं.",
      hi: "प्रोटोटाइप. नकली डेटा, कोई वास्तविक कनेक्शन नहीं, कोई रहस्य नहीं।",
      tr: "Prototip. Sahte veri, gerçek bağlantı yok, gizli yok." },
    periode_title: { fr: "Sélection de la période", en: "Period selection", es: "Selección de período",
      de: "Zeitraumauswahl", it: "Selezione periodo", pt: "Seleção de período", nl: "Periodekeuze",
      pl: "Wybór okresu", ru: "Выбор периода", zh: "周期选择", ja: "期間の選択", ko: "기간 선택",
      ar: "اختيار الفترة", hi: "अवधि चयन", tr: "Dönem Seçimi" },
    periode_7: { fr: "7 jours", en: "7 days", es: "7 días", de: "7 Tage", it: "7 giorni",
      pt: "7 dias", nl: "7 dagen", pl: "7 dni", ru: "7 дней", zh: "7天", ja: "7日間", ko: "7일",
      ar: "7 أيام", hi: "7 दिन", tr: "7 gün" },
    periode_10: { fr: "10 jours", en: "10 days", es: "10 días", de: "10 Tage", it: "10 giorni",
      pt: "10 dias", nl: "10 dagen", pl: "10 dni", ru: "10 дней", zh: "10天", ja: "10日間", ko: "10일",
      ar: "10 أيام", hi: "10 दिन", tr: "10 gün" },
    periode_30: { fr: "30 jours", en: "30 days", es: "30 días", de: "30 Tage", it: "30 giorni",
      pt: "30 dias", nl: "30 dagen", pl: "30 dni", ru: "30 дней", zh: "30天", ja: "30日間", ko: "30일",
      ar: "30 أيام", hi: "30 दिन", tr: "30 gün" },
    periode_custom: { fr: "Personnalisé", en: "Custom", es: "Personalizado", de: "Benutzerdefiniert",
      it: "Personalizzato", pt: "Personalizado", nl: "Aangepast", pl: "Niestandardowy",
      ru: "Настроить", zh: "自定义", ja: "カスタム", ko: "사용자 지정", ar: "مخصص", hi: "कस्टम",
      tr: "Özel" },
    appliquer: { fr: "Appliquer", en: "Apply", es: "Aplicar", de: "Anwenden", it: "Applica",
      pt: "Aplicar", nl: "Toepassen", pl: "Zastosuj", ru: "Применить", zh: "应用", ja: "適用",
      ko: "적용", ar: "تطبيق", hi: "लागू करें", tr: "Uygula" },

    /* ---------- kifftech ---------- */
    hero_kicker: { fr: "Samsung • Smartphones • 2024", en: "Samsung • Smartphones • 2024",
      es: "Samsung • Smartphones • 2024", de: "Samsung • Smartphones • 2024",
      it: "Samsung • Smartphones • 2024", pt: "Samsung • Smartphones • 2024",
      nl: "Samsung • Smartphones • 2024", pl: "Samsung • Smartphones • 2024",
      ru: "Samsung • Смартфоны • 2024", zh: "三星 • 智能手机 • 2024", ja: "サムスン • スマートフォン • 2024",
      ko: "삼성 • 스마트폰 • 2024", ar: "سامسونج • هواتف ذكية • 2024", hi: "सैमसंग • स्मार्टफोन • 2024",
      tr: "Samsung • Akıllı telefonlar • 2024" },
    hero_title: { fr: "Galaxy S24 Ultra", en: "Galaxy S24 Ultra", es: "Galaxy S24 Ultra",
      de: "Galaxy S24 Ultra", it: "Galaxy S24 Ultra", pt: "Galaxy S24 Ultra", nl: "Galaxy S24 Ultra",
      pl: "Galaxy S24 Ultra", ru: "Galaxy S24 Ultra", zh: "Galaxy S24 Ultra", ja: "Galaxy S24 Ultra",
      ko: "갤럭시 S24 울트라", ar: "Galaxy S24 Ultra", hi: "गैलेक्सी S24 अल्ट्रा", tr: "Galaxy S24 Ultra" },
    hero_discount: { fr: "Prix KiffTech −10 %", en: "KiffTech Price −10%", es: "Precio KiffTech −10%",
      de: "KiffTech-Preis −10%", it: "Prezzo KiffTech −10%", pt: "Preço KiffTech −10%",
      nl: "KiffTech-prijs −10%", pl: "Cena KiffTech −10%", ru: "Цена KiffTech −10%",
      zh: "KiffTech 价格 −10%", ja: "KiffTech価格 −10%", ko: "KiffTech 가격 −10%",
      ar: "سعر KiffTech −10%", hi: "KiffTech मूल्य −10%", tr: "KiffTech fiyatı −10%" },
    hero_promo: { fr: "Prix Promo KiffTech : −20 % dès 10 articles en caisse (achat groupé) • Livraison offerte aux abonnés KiffTech Club",
      en: "KiffTech Promo Price: −20% from 10 items in cart (group purchase) • Free delivery for KiffTech Club subscribers",
      es: "Precio Promo KiffTech: −20% desde 10 artículos en caja (compra grupal) • Envío gratis para suscriptores de KiffTech Club",
      de: "KiffTech Promo-Preis: −20% ab 10 Artikeln im Warenkorb (Gruppenkauf) • Kostenlose Lieferung für KiffTech Club-Abonnenten",
      it: "Prezzo Promo KiffTech: −20% da 10 articoli nel carrello (acquisto di gruppo) • Consegna gratuita per gli abbonati al KiffTech Club",
      pt: "Preço Promo KiffTech: −20% a partir de 10 itens no carrinho (compra em grupo) • Entrega grátis para assinantes do KiffTech Club",
      nl: "KiffTech Promo-prijs: −20% vanaf 10 artikelen in winkelwagen (groepsaankoop) • Gratis bezorging voor KiffTech Club-abonnees",
      pl: "Cena Promo KiffTech: −20% od 10 przedmiotów w koszyku (zakup grupowy) • Darmowa dostawa dla subskrybentów KiffTech Club",
      ru: "Промо-цена KiffTech: −20% от 10 товаров в корзине (групповая покупка) • Бесплатная доставка для подписчиков KiffTech Club",
      zh: "KiffTech 促销价：从购物车中的 10 件商品开始享受 −20%（团购）• KiffTech Club 订阅者免运费",
      ja: "KiffTech プロモ価格：カートに 10 点以上で −20%（グループ購入）• KiffTech Club 加入者は送料無料",
      ko: "KiffTech 프로모 가격: 장바구니에 10개 이상 상품 시 −20% (단체 구매) • KiffTech Club 구독자 무료 배송",
      ar: "سعر ترويج KiffTech: −20% من 10 عناصر في السلة (شراء جماعي) • توصيل مجاني لمشتركي نادي KiffTech",
      hi: "KiffTech प्रोमो मूल्य: कार्ट में 10 आइटम से −20% (समूह खरीद) • KiffTech Club ग्राहकों के लिए मुफ्त डिलीवरी",
      tr: "KiffTech Promo Fiyatı: Sepette 10 üründen itibaren −20% (gruplu alışveriş) • KiffTech Club abonelerine ücretsiz teslimat" },
    hero_detail: { fr: "Voir le détail", en: "View detail", es: "Ver detalle", de: "Details ansehen",
      it: "Vedi dettaglio", pt: "Ver detalhe", nl: "Bekijk detail", pl: "Zobacz szczegóły",
      ru: "Посмотреть детали", zh: "查看详情", ja: "詳細を表示", ko: "상세정보 보기",
      ar: "عرض التفاصيل", hi: "विवरण देखें", tr: "Detayı görüntüle" },
    hero_add_cart: { fr: "Ajouter à la caisse", en: "Add to cart", es: "Añadir al carrito",
      de: "In den Warenkorb", it: "Aggiungi al carrello", pt: "Adicionar ao carrinho",
      nl: "Toevoegen aan winkelwagen", pl: "Dodaj do koszyka", ru: "Добавить в корзину",
      zh: "加入购物车", ja: "カートに追加", ko: "장바구니에 추가", ar: "إضافة إلى السلة",
      hi: "कार्ट में जोड़ें", tr: "Sepete ekle" },
    rayons_title: { fr: "Rayons", en: "Aisles", es: "Pasillos", de: "Abteilungen",
      it: "Reparti", pt: "Setores", nl: "Afdelingen", pl: "Działy", ru: "Отделы", zh: "区域",
      ja: "部門", ko: "코너", ar: "الأقسام", hi: "विभाग", tr: "Bölümler" },
    panel_agent: { fr: "Agent de Veille", en: "Watch Agent", es: "Agente de Vigilancia",
      de: "Watch-Agent", it: "Agente di Vigilanza", pt: "Agente de Monitoramento", nl: "Watch-agent",
      pl: "Agent nadzoru", ru: "Агент мониторинга", zh: "监控代理", ja: "監視エージェント",
      ko: "감시 에이전트", ar: "وكيل المراقبة", hi: "निगरानी एजेंट", tr: "Gözlem Aracısı" },
    panel_search: { fr: "Recherche & Filtres", en: "Search & Filters", es: "Búsqueda y Filtros",
      de: "Suche & Filter", it: "Ricerca e Filtri", pt: "Busca e Filtros", nl: "Zoeken & Filters",
      pl: "Wyszukiwanie i filtry", ru: "Поиск и фильтры", zh: "搜索和筛选", ja: "検索とフィルター",
      ko: "검색 및 필터", ar: "البحث والفلاتر", hi: "खोज और फिल्टर", tr: "Arama ve Filtreler" },
    panel_sources: { fr: "Sources de Données", en: "Data Sources", es: "Fuentes de Datos",
      de: "Datenquellen", it: "Fonti Dati", pt: "Fontes de Dados", nl: "Gegevensbronnen",
      pl: "Źródła danych", ru: "Источники данных", zh: "数据源", ja: "データソース", ko: "데이터 소스",
      ar: "مصادر البيانات", hi: "डेटा स्रोत", tr: "Veri Kaynakları" },
    panel_actions: { fr: "Actions", en: "Actions", es: "Acciones", de: "Aktionen", it: "Azioni",
      pt: "Ações", nl: "Acties", pl: "Akcje", ru: "Действия", zh: "操作", ja: "アクション",
      ko: "작업", ar: "الإجراءات", hi: "क्रियाएं", tr: "İşlemler" },
    panel_club: { fr: "KiffTech Club", en: "KiffTech Club", es: "Club KiffTech", de: "KiffTech Club",
      it: "KiffTech Club", pt: "Clube KiffTech", nl: "KiffTech Club", pl: "Klub KiffTech", ru: "KiffTech Club",
      zh: "KiffTech 俱乐部", ja: "KiffTech クラブ", ko: "KiffTech 클럽", ar: "نادي KiffTech",
      hi: "KiffTech क्लब", tr: "KiffTech Kulübü" },
    panel_caisse: { fr: "La Caisse", en: "Checkout", es: "Caja", de: "Kasse", it: "Cassa",
      pt: "Caixa", nl: "Kassa", pl: "Kasa", ru: "Касса", zh: "结账", ja: "レジ", ko: "계산대",
      ar: "الصندوق", hi: "नकदी काउंटर", tr: "Kasa" },
    search_placeholder: { fr: "Produit, marque, modèle…", en: "Product, brand, model…",
      es: "Producto, marca, modelo…", de: "Produkt, Marke, Modell…", it: "Prodotto, marca, modello…",
      pt: "Produto, marca, modelo…", nl: "Product, merk, model…", pl: "Produkt, marka, model…",
      ru: "Товар, бренд, модель…", zh: "产品、品牌、型号…", ja: "製品、ブランド、モデル…",
      ko: "제품, 브랜드, 모델…", ar: "المنتج، العلامة التجارية، الموديل…", hi: "उत्पाद, ब्रांड, मॉडल…",
      tr: "Ürün, marka, model…" },
    sort_relevance: { fr: "Pertinence", en: "Relevance", es: "Relevancia", de: "Relevanz",
      it: "Pertinenza", pt: "Relevância", nl: "Relevantie", pl: "Istotność", ru: "Релевантность",
      zh: "相关性", ja: "関連性", ko: "관련성", ar: "الصلة", hi: "प्रासंगिकता", tr: "Uygunluk" },
    sort_brand: { fr: "Marque A-Z", en: "Brand A-Z", es: "Marca A-Z", de: "Marke A-Z",
      it: "Marca A-Z", pt: "Marca A-Z", nl: "Merk A-Z", pl: "Marka A-Z", ru: "Бренд A-Z",
      zh: "品牌 A-Z", ja: "ブランド A-Z", ko: "브랜드 A-Z", ar: "العلامة التجارية A-Z",
      hi: "ब्रांड A-Z", tr: "Marka A-Z" },
    sort_price_asc: { fr: "Prix croissant", en: "Price ascending", es: "Precio ascendente",
      de: "Preis aufsteigend", it: "Prezzo crescente", pt: "Preço crescente", nl: "Prijs oplopend",
      pl: "Cena rosnąco", ru: "Цена по возрастанию", zh: "价格升序", ja: "価格昇順", ko: "가격 오름차순",
      ar: "السعر تصاعدياً", hi: "मूल्य आरोही", tr: "Fiyat artan" },
    sort_price_desc: { fr: "Prix décroissant", en: "Price descending", es: "Precio descendente",
      de: "Preis absteigend", it: "Prezzo decrescente", pt: "Preço decrescente", nl: "Prijs aflopend",
      pl: "Cena malejąco", ru: "Цена по убыванию", zh: "价格降序", ja: "価格降順", ko: "가격 내림차순",
      ar: "السعر تنازلياً", hi: "मूल्य अवरोही", tr: "Fiyat azalan" },
    reader_prev: { fr: "‹ Précédents", en: "‹ Previous", es: "‹ Anterior", de: "‹ Vorherige",
      it: "‹ Precedente", pt: "‹ Anterior", nl: "‹ Vorige", pl: "‹ Poprzednie", ru: "‹ Предыдущие",
      zh: "‹ 上一页", ja: "‹ 前へ", ko: "‹ 이전", ar: "‹ السابقة", hi: "‹ पिछले", tr: "‹ Önceki" },
    reader_next: { fr: "Suivants ›", en: "Next ›", es: "Siguiente ›", de: "Nächste ›",
      it: "Successivo ›", pt: "Próximo ›", nl: "Volgende ›", pl: "Następne ›", ru: "Следующие ›",
      zh: "下一页 ›", ja: "次へ ›", ko: "다음 ›", ar: "التالي ›", hi: "अगला ›", tr: "Sonraki ›" },
    modal_close: { fr: "Fermer", en: "Close", es: "Cerrar", de: "Schließen", it: "Chiudi",
      pt: "Fechar", nl: "Sluiten", pl: "Zamknij", ru: "Закрыть", zh: "关闭", ja: "閉じる", ko: "닫기",
      ar: "إغلاق", hi: "बंद करें", tr: "Kapat" },
    modal_caracteristiques: { fr: "Caractéristiques", en: "Features", es: "Características",
      de: "Eigenschaften", it: "Caratteristiche", pt: "Características", nl: "Kenmerken",
      pl: "Cechy", ru: "Характеристики", zh: "特性", ja: "特徴", ko: "특성", ar: "الخصائص",
      hi: "विशेषताएं", tr: "Özellikler" },
    modal_prix_sources: { fr: "Prix & Sources", en: "Price & Sources", es: "Precio & Fuentes",
      de: "Preis & Quellen", it: "Prezzo & Fonti", pt: "Preço & Fontes", nl: "Prijs & Bronnen",
      pl: "Cena & Źródła", ru: "Цена & Источники", zh: "价格 & 数据源", ja: "価格 & データソース",
      ko: "가격 & 데이터 소스", ar: "السعر & مصادر البيانات", hi: "मूल्य & डेटा स्रोत",
      tr: "Fiyat & Veri Kaynakları" },

    /* ========================= Fin du dictionnaire ========================= */
  };

  /* ========================= Stockage ========================= */
  var STORAGE_KEY = "keffstation_lang";
  var STORAGE_CURRENCY = "keffstation_currency";
  var STORAGE_TRADUCTION = "keffstation_traduction";
  var STORAGE_ANIM = "keffstation_anim";
  var DEFAULT_LANG = "fr";
  var DEFAULT_CURRENCY = "EUR";
  var SUPPORTED = Object.keys(DICT.langNames);

  /* ========================= Helpers ========================= */
  function getLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved.length >= 2) {
        var savedCode = saved.slice(0, 2).toLowerCase();
        if (SUPPORTED.indexOf(savedCode) !== -1) return savedCode;
      }
    } catch (e) {}
    var nav = (navigator.language || navigator.userLanguage || "").slice(0, 2).toLowerCase();
    if (nav && SUPPORTED.indexOf(nav) !== -1) return nav;
    return DEFAULT_LANG;
  }

  function setLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    document.documentElement.lang = lang;
    translationCache = {};
    translating = {};
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.removeAttribute("data-i18n-original");
    });
    applyTranslations(lang);
    refreshSelector(lang);
    document.dispatchEvent(new CustomEvent("ks-lang-change", { detail: { lang: lang } }));
    applyTranslationsGoogle(lang).catch(function (e) {});
  }

  function getCurrency() {
    try {
      var saved = localStorage.getItem(STORAGE_CURRENCY);
      if (saved && SUPPORTED_CURRENCIES.indexOf(saved) !== -1) return saved;
    } catch (e) {}
    var nav = (navigator.language || navigator.userLanguage || "fr").toLowerCase();
    if (REGION_CURRENCY[nav]) return REGION_CURRENCY[nav];
    var nav2 = nav.slice(0, 2);
    if (REGION_CURRENCY[nav2]) return REGION_CURRENCY[nav2];
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
      return new Intl.NumberFormat(undefined, { style: "currency", currency: c, minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
    } catch (e) { return value + " " + c; }
  }

  var FALLBACK = ["en", "fr"];
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

  /* ========================= Traduction automatique Google (fallback) ========================= */
  var translationCache = {};
  var translating = {};

  async function googleTranslate(text, targetLang) {
    if (!text || text.length === 0) return text;
    var cacheKey = text + '||' + targetLang;
    if (translationCache[cacheKey]) return translationCache[cacheKey];
    if (translating[cacheKey]) return translating[cacheKey];
    translating[cacheKey] = (async function () {
      try {
        var url = 'https://translate.googleapis.com/translate_a/t?client=gtx&sl=auto&tl=' + encodeURIComponent(targetLang) + '&q=' + encodeURIComponent(text);
        var resp = await fetch(url);
        var data = await resp.json();
        if (data && data[0] && data[0][0] && data[0][0][0]) {
          var result = data[0][0][0];
          translationCache[cacheKey] = result;
          return result;
        }
      } catch (e) { console.warn('[i18n] Google Translate failed:', e.message); }
      return text;
    })();
    return translating[cacheKey];
  }

  async function applyTranslationsGoogle(lang) {
    var fallbackElems = document.querySelectorAll("[data-i18n]");
    var cacheTraduction = {};
    try { cacheTraduction = JSON.parse(localStorage.getItem(STORAGE_TRADUCTION) || "{}"); } catch (e) {}
    var dirty = false;
    var pending = [];
    for (var i = 0; i < fallbackElems.length; i++) {
      (function (el) {
        var key = el.getAttribute("data-i18n");
        var val = t(key, lang);
        if (val === key) {
          var original = el.getAttribute("data-i18n-original");
          if (!original) { original = el.textContent; el.setAttribute("data-i18n-original", original); }
          if (original && original !== key && original.trim().length > 0) {
            var cacheKey = original + '||' + lang;
            if (cacheTraduction[cacheKey]) { el.textContent = cacheTraduction[cacheKey]; }
            else { pending.push({ el: el, original: original, cacheKey: cacheKey }); }
          }
        }
      })(fallbackElems[i]);
    }
    var index = 0, BATCH = 12, DELAY = 80;
    function nextBatch() {
      if (index >= pending.length) {
        if (dirty) { setTimeout(function () { try { localStorage.setItem(STORAGE_TRADUCTION, JSON.stringify(cacheTraduction)); } catch (e) {} }, 400); }
        return;
      }
      var batch = pending.slice(index, index + BATCH); index += BATCH;
      Promise.all(batch.map(function (item) {
        return googleTranslate(item.original, lang).then(function (translated) {
          item.el.textContent = translated; cacheTraduction[item.cacheKey] = translated; dirty = true;
        }).catch(function () { });
      })).then(function () { setTimeout(nextBatch, DELAY); });
    }
    nextBatch();
  }

  document.addEventListener("ks-currency-change", function (e) { updateCurrencyDisplay(); });

  /* ========================= Sélecteur de langue/dévis/animation ========================= */
  var SELECTOR_CSS = "\
    #ks-lang-selector {\
      position: fixed; top: 10px; right: 10px; z-index: 100;\
      font: 700 13px/1.2 system-ui,sans-serif; user-select: none; -webkit-user-select: none;\
    }\
    #ks-lang-toggle {\
      position: relative; background: rgba(10,12,34,.92); border: 1px solid rgba(255,255,255,.2);\
      border-radius: 14px; padding: 10px 14px; color: #f4f6ff; cursor: pointer; backdrop-filter: blur(6px);\
      -webkit-backdrop-filter: blur(6px); display: inline-flex; align-items: center; gap: 8px;\
      min-width: 52px; min-height: 52px; touch-action: manipulation; -webkit-tap-highlight-color: transparent;\
    }\
    #ks-lang-toggle .ks-flag { font-size: 22px; line-height: 1; }\
    #ks-lang-toggle .ks-arrow { font-size: 11px; color: #b9c0e6; transition: transform .2s ease; margin-left: 4px; }\
    #ks-lang-toggle.open .ks-arrow { transform: rotate(180deg); }\
    #ks-lang-toggle.open { border-color: #ffd23f; box-shadow: 0 0 20px rgba(255,210,63,.35); }\
    #ks-lang-toggle:active { background: rgba(255,255,255,.08); }\
    #ks-lang-menu {\
      position: absolute; top: 100%; right: 0; margin-top: 8px; background: rgba(8,9,22,.96);\
      border: 1px solid rgba(255,255,255,.22); border-radius: 16px; padding: 10px;\
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); min-width: 300px; z-index: 101;\
      display: none; box-shadow: 0 12px 48px rgba(0,0,0,.55); overflow-y: auto; max-height: 70vh; overscroll-behavior: contain;\
    }\
    #ks-lang-toggle.open + #ks-lang-menu, #ks-lang-menu.visible { display: block; }\
    #ks-lang-menu .ks-section-title {\
      font: 700 11px/1.2 system-ui,sans-serif; color: #ffd23f; padding: 8px 12px 4px 12px;\
      text-transform: uppercase; letter-spacing: .08em; opacity: .9; }\
    #ks-lang-menu .ks-option {\
      display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 12px;\
      color: #f4f6ff; cursor: pointer; font: 500 14px/1.3 system-ui,sans-serif; white-space: nowrap;\
      touch-action: manipulation; -webkit-tap-highlight-color: transparent; transition: all .15s ease;\
    }\
    #ks-lang-menu .ks-option:hover, #ks-lang-menu .ks-option:focus-visible {\
      background: rgba(255,255,255,.08); outline: 2px solid #ffd23f; outline-offset: -2px;\
    }\
    #ks-lang-menu .ks-option.ks-active {\
      background: rgba(255,210,63,.18); color: #ffd23f; border: 1px solid rgba(255,210,63,.35);\n\
    }\
    #ks-lang-menu .ks-option .ks-flag { font-size: 20px; line-height: 1; min-width: 28px; text-align: center; }\
    #ks-lang-menu .ks-option .ks-name { flex: 1; font-weight: 600; }\
    #ks-lang-menu .ks-divider { height: 1px; background: rgba(255,255,255,.1); margin: 8px 0; }\
    #ks-lang-menu .ks-loading { font: 400 12px/1.4 system-ui,sans-serif; color: #b9c0e6; padding: 10px 12px; text-align: center; opacity: .7; }\
    #ks-anim-controls {\n      margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,.15);\n\
      display: flex; flex-direction: column; gap: 6px;\n    }\
    #ks-anim-controls .ks-section-title {\n      font: 700 10px/1.2 system-ui,sans-serif; color: #ffd23f;\n\
      text-transform: uppercase; letter-spacing: .08em;\n    }\
    #ks-anim-controls .ks-anim-btn {\n      display: flex; align-items: center; gap: 8px; padding: 7px 10px;\n\
      border-radius: 8px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.15);\n\
      color: #f4f6ff; cursor: pointer; font: 500 12px/1.3 system-ui,sans-serif;\n\
      transition: all .15s ease;\n    }\
    #ks-anim-controls .ks-anim-btn:hover {\n      background: rgba(255,255,255,.14); border-color: #ffd23f; color: #ffd23f;\n    }\
    #ks-anim-controls .ks-anim-btn.ks-active {\n      background: rgba(255,210,63,.18); color: #ffd23f;\n\
      border: 1px solid #ffd23f; box-shadow: 0 0 12px rgba(255,210,63,.3);\n    }\
    #ks-anim-controls .ks-anim-btn .ks-flag {\n      font-size: 16px; line-height: 1; min-width: 24px;\n\
      text-align: center;\n    }\
  \";\n"

  function injectStyle() { if (document.getElementById("ks-i18n-style")) return; var s = document.createElement("style"); s.id = "ks-i18n-style"; s.textContent = SELECTOR_CSS; (document.head || document.documentElement).appendChild(s); }

  function buildSelector(lang) {
    var box = document.createElement("div"); box.id = "ks-lang-selector";
    var toggle = document.createElement("button"); toggle.id = "ks-lang-toggle"; toggle.type = "button";
    toggle.setAttribute("aria-haspopup", "true"); toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", t("language", lang));
    var flag = document.createElement("span"); flag.className = "ks-flag"; flag.textContent = FLAGS_LANG[lang] || "🌐";
    var arrow = document.createElement("span"); arrow.className = "ks-arrow"; arrow.textContent = "▼";
    toggle.appendChild(flag); toggle.appendChild(arrow);
    toggle.addEventListener("click", function (e) { e.stopPropagation(); var open = toggle.classList.toggle("open"); toggle.setAttribute("aria-expanded", open); var menu = document.getElementById("ks-lang-menu"); if (menu) menu.classList.toggle("visible", open); });

    var menu = document.createElement("div"); menu.id = "ks-lang-menu"; menu.setAttribute("role", "menu");

    var secLang = document.createElement("div"); secLang.className = "ks-section-title"; secLang.textContent = t("language", lang); menu.appendChild(secLang);
    SUPPORTED.forEach(function (code) {
      var item = document.createElement("div"); var isActive = (code === lang);
      item.className = "ks-option" + (isActive ? " ks-active" : ""); item.setAttribute("role", "menuitem");
      var f = document.createElement("span"); f.className = "ks-flag"; f.textContent = FLAGS_LANG[code] || "🌐";
      var n = document.createElement("span"); n.className = "ks-name"; n.textContent = DICT.langNames[code];
      item.appendChild(f); item.appendChild(n);
      item.addEventListener("click", function (e) { e.stopPropagation(); setLang(code); toggle.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); menu.classList.remove("visible"); flag.textContent = FLAGS_LANG[code] || "🌐"; document.querySelectorAll("#ks-lang-menu .ks-option").forEach(function (it) { it.classList.remove("ks-active"); }); item.classList.add("ks-active"); toggle.setAttribute("aria-label", t("language", code)); });
      menu.appendChild(item);
    });
    var div = document.createElement("div"); div.className = "ks-divider"; menu.appendChild(div);

    var secCurr = document.createElement("div"); secCurr.className = "ks-section-title"; secCurr.textContent = t("currency", lang); menu.appendChild(secCurr);
    SUPPORTED_CURRENCIES.forEach(function (code) {
      var item = document.createElement("div"); var isActive = (code === getCurrency());
      item.className = "ks-option" + (isActive ? " ks-active" : ""); item.setAttribute("role", "menuitem");
      var f = document.createElement("span"); f.className = "ks-flag"; f.textContent = FLAGS_CURRENCY[code] || "💰";
      var n = document.createElement("span"); n.className = "ks-name"; n.textContent = CURRENCY_NAMES[code] || code;
      item.appendChild(f); item.appendChild(n);
      item.addEventListener("click", function (e) { e.stopPropagation(); setCurrency(code); toggle.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); menu.classList.remove("visible"); document.querySelectorAll("#ks-lang-menu .ks-option").forEach(function (it) { it.classList.remove("ks-active"); }); item.classList.add("ks-active"); });
      menu.appendChild(item);
    });

    var animField = document.createElement("div"); animField.className = "ks-field";
    var animLabel = document.createElement("label"); animLabel.textContent = t("animation", lang); animLabel.style.marginRight = "6px"; animLabel.style.color = "#b9c0e6"; animLabel.style.fontSize = "11px";
    animField.appendChild(animLabel);
    var animModes = [ { code: "sync", label: "Synchronisé", flag: "⚡" }, { code: "async", label: "Asynchronisé", flag: "🌊" }, { code: "desync", label: "Désynchronisé", flag: "🎲" } ];
    animModes.forEach(function (m) { var item = document.createElement("div"); var isActive = (document.documentElement.getAttribute("data-anim") === m.code); item.className = "ks-anim-btn" + (isActive ? " ks-active" : ""); item.setAttribute("role", "button"); item.setAttribute("aria-pressed", isActive); var f = document.createElement("span"); f.className = "ks-flag"; f.textContent = m.flag; var n = document.createElement("span"); n.className = "ks-name"; n.textContent = m.label; item.appendChild(f); item.appendChild(n); item.addEventListener("click", function (e) { e.stopPropagation(); setAnimationMode(m.code); document.querySelectorAll("#ks-anim-controls .ks-anim-btn").forEach(function (it) { it.classList.remove("ks-active"); it.setAttribute("aria-pressed", "false"); }); item.classList.add("ks-active"); item.setAttribute("aria-pressed", "true"); }); animField.appendChild(item); });
    box.appendChild(animField);

    box.appendChild(toggle);
    box.appendChild(menu);

    document.addEventListener("click", function (e) { if (!box.contains(e.target)) { toggle.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); menu.classList.remove("visible"); } });
    return box;
  }

  function refreshSelector(lang) { var flag = document.querySelector("#ks-lang-toggle .ks-flag"); if (flag) flag.textContent = FLAGS_LANG[lang] || "🌐"; var toggle = document.getElementById("ks-lang-toggle"); if (toggle) toggle.setAttribute("aria-label", t("language", lang)); document.querySelectorAll("#ks-lang-menu .ks-option").forEach(function (it) { it.classList.remove("ks-active"); }); var opts = document.querySelectorAll("#ks-lang-menu .ks-option"); var found = false; for (var i = 0; i < opts.length; i++) { var nameEl = opts[i].querySelector(".ks-name"); if (nameEl && DICT.langNames[lang] && nameEl.textContent === DICT.langNames[lang]) { opts[i].classList.add("ks-active"); found = true; break; } } if (!found) { for (var i = 0; i < opts.length; i++) { var flagEl = opts[i].querySelector(".ks-flag"); if (flagEl && FLAGS_LANG[lang] && flagEl.textContent === FLAGS_LANG[lang]) { opts[i].classList.add("ks-active"); break; } } } }

  function refreshCurrencySelector(currency) { document.querySelectorAll("#ks-lang-menu .ks-option").forEach(function (it) { it.classList.remove("ks-active"); }); var opts = document.querySelectorAll("#ks-lang-menu .ks-option"); for (var i = 0; i < opts.length; i++) { var nameEl = opts[i].querySelector(".ks-name"); if (nameEl && CURRENCY_NAMES[currency] && nameEl.textContent === CURRENCY_NAMES[currency]) { opts[i].classList.add("ks-active"); break; } } }

  function injectSelector(lang) { if (document.getElementById("ks-lang-selector")) return; injectStyle(); var box = buildSelector(lang); document.body.appendChild(box); }

  function setAnimationMode(mode) { document.body.classList.remove("anim-sync", "anim-async", "anim-desync"); if (mode === "sync" || mode === "async" || mode === "desync") { document.body.classList.add("anim-" + mode); document.documentElement.setAttribute("data-anim", mode); } else { document.documentElement.removeAttribute("data-anim"); } try { localStorage.setItem(STORAGE_ANIM, mode); } catch (e) {} document.dispatchEvent(new CustomEvent("ks-anim-change", { detail: { mode: mode } })); }
  function getAnimationMode() { try { var saved = localStorage.getItem(STORAGE_ANIM); if (saved === "sync" || saved === "async" || saved === "desync") return saved; } catch (e) {} return "none"; }
  (function () { var savedMode = getAnimationMode(); if (savedMode) setAnimationMode(savedMode); })();

  async function init() { var lang = getLang(); document.documentElement.lang = lang; injectSelector(lang); applyTranslations(lang); updateCurrencyDisplay(); (function () { var curLang = getLang(); applyTranslations(curLang); applyTranslationsGoogle(curLang).catch(function(){}); })(); }
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); } else { init(); }

  window.ksI18n = { setLang: setLang, getLang: getLang, t: t, apply: applyTranslations };
})();