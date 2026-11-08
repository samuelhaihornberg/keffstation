/*!
 * KeffStation i18n — Traducteur universel toutes langues
 * Traduit tous les éléments marqués data-i18n="cle" ou data-i18n-html="cle"
 * Sélecteur de langue injecté automatiquement, choix mémorisé (localStorage)
 */

(function () {
  "use strict";

  /* ========================= Dictionnaire de traductions ========================= */
  var DICT = {
    // Codes de langue affichés — toutes les langues parlées dans le monde
    langNames: {
      af: "Afrikaans",
      am: "አማርኛ",
      ar: "العربية",
      as: "অসমীয়া",
      az: "Azərbaycan dili",
      bg: "Български",
      bn: "বাংলা",
      bo: "བོད་སྐད",
      ca: "Català",
      cs: "Čeština",
      cy: "Cymraeg",
      da: "Dansk",
      de: "Deutsch",
      dz: "རྫོང་ཁ",
      el: "Ελληνικά",
      en: "English",
      eo: "Esperanto",
      es: "Español",
      et: "Eesti",
      eu: "Euskara",
      fa: "فارسى",
      fi: "Suomi",
      fr: "Français",
      ga: "Gaeilge",
      gl: "Galego",
      gu: "ગુજરાતી",
      ha: "Hausa",
      he: "עברית",
      hi: "हिन्दी",
      hr: "Hrvatski",
      hu: "Magyar",
      hy: "Հայերեն",
      id: "Bahasa Indonesia",
      ig: "Asụsụ Igbo",
      is: "Íslenska",
      it: "Italiano",
      ja: "日本語",
      jv: "Basa Jawa",
      ka: "ქართული",
      kk: "Қазақша",
      km: "ខ្មែរ",
      kn: "ಕನ್ನಡ",
      ko: "한국어",
      ku: "کوردی",
      ky: "Кыргызча",
      la: "Latine",
      lb: "Lëtzebuergesch",
      lo: "ລາວ",
      lt: "Lietuvių",
      lv: "Latviešu",
      mg: "Malagasy",
      mk: "Македонски",
      ml: "മലയാളം",
      mn: "ᠮᠣᠩᠭᠣᠯ ᠬᠡᠯᠡ",
      mr: "मराठी",
      ms: "Bahasa Melayu",
      my: "မြန်မာ",
      ne: "नेपाली",
      nl: "Nederlands",
      no: "Norsk",
      ny: "Chichewa",
      or: "ଓଡ଼ିଆ",
      pa: "ਪੰਜਾਬੀ",
      pl: "Polski",
      ps: "پښتو",
      pt: "Português",
      ro: "Română",
      ru: "Русский",
      rw: "Kinyarwanda",
      sd: "سنڌي",
      si: "සිංහල",
      sk: "Slovenčina",
      sl: "Slovenščina",
      sm: "Gagana Sāmoa",
      sn: "chiShona",
      so: "Soomaaliga",
      sq: "Shqip",
      sr: "Српски",
      st: "Sesotho",
      su: "Basa Sunda",
      sv: "Svenska",
      sw: "Kiswahili",
      ta: "தமிழ்",
      te: "తెలుగు",
      tg: "тоҷикӣ",
      th: "ภาษาไทย",
      tl: "Filipino",
      tr: "Türkçe",
      uk: "Українська",
      ur: "اردو",
      uz: "Oʻzbekcha",
      vi: "Tiếng Việt",
      xh: "isiXhosa",
      yi: "ייִדיש",
      yo: "Èdè Yorùbá",
      zh: "中文",
      zu: "isiZulu"
    },

    /* ---------- Racine / index.html ---------- */
    app_name: {
      fr: "KeffStation",
      en: "KeffStation",
      es: "KeffStation",
      de: "KeffStation",
      it: "KeffStation",
      pt: "KeffStation",
      nl: "KeffStation",
      pl: "KeffStation",
      ru: "KeffStation",
      zh: "KeffStation",
      ja: "KeffStation",
      ko: "KeffStation",
      ar: "KeffStation",
      hi: "KeffStation",
      tr: "KeffStation"
    },
    subtitle_platform: {
      fr: "Vitrine Smart Tech & High Tech",
      en: "Smart Tech & High Tech Showcase",
      es: "Escaparate Smart Tech y High Tech",
      de: "Smart Tech & High Tech Schaufenster",
      it: "Vetrina Smart Tech & High Tech",
      pt: "Vitrine Smart Tech & High Tech",
      nl: "Smart Tech & High Tech Schaufenster",
      pl: "Witryna Smart Tech & High Tech",
      ru: "Витрина Smart Tech & High Tech",
      zh: "智能科技与高科技橱窗",
      ja: "スマートテック／ハイトック ショーケース",
      ko: "스마트 테크 & 하이테크 쇼케이스",
      ar: "عرض स्मार्ट 테크 و الهايتك",
      hi: "स्मार्ट टेक और हाईटेक शोकेस",
      tr: "Akıllı Tek ve Yüksek Teknoloji Vitrini"
    },
    tagline: {
      fr: "Become.What.Ever.You.Want...Kw;)Nk...!",
      en: "Become.What.Ever.You.Want...Kw;)Nk...!",
      es: "¡Sé.lo.que.quieras...Kw;)Nk...!",
      de: "Werde.Was.Immer.Du.Willst...Kw;)Nk...!",
      it: "Diventa.Cosa.Vuoi...Kw;)Nk...!",
      pt: "Torne-se.O.Que.Quiser...Kw;)Nk...!",
      nl: "Word.Wat.Je.Wilt...Kw;)Nk...!",
      pl: "Bądź.Kim.Chcesz...Kw;)Nk...!",
      ru: "Стань.Тем.Кем.Хочешь...Kw;)Nk...!",
      zh: "成为你想成为的任何事物...Kw;)Nk...!",
      ja: "なりたいものになろう...Kw;)Nk...!",
      "ko": "whatever you want가 되세요...Kw;)Nk...!",
      ar: "كن ما تريد...Kw;)Nk...!",
      hi: "जो चाहो बनो...Kw;)Nk...!",
      tr: "İstediğin şey ol...Kw;)Nk...!"
    },
    scroll_down: {
      fr: "Défiler",
      en: "Scroll",
      es: "Desplazar",
      de: "Blättern",
      it: "Scorri",
      pt: "Rolar",
      nl: "Schuiven",
      pl: "Przewiń",
      ru: "Прокрутка",
      zh: "滚动",
      ja: "スクロール",
      ko: "스크롤",
      ar: "مرر",
      hi: "स्क्रॉल करें",
      tr: "Kaydır"
    },
    platform_title: {
      fr: "KiffStation : Votre plateforme multi-PWA",
      en: "KiffStation: Your multi-PWA platform",
      es: "KiffStation: Tu plataforma multi-PWA",
      de: "KiffStation: Ihre multi-PWA Plattform",
      it: "KiffStation: La tua piattaforma multi-PWA",
      pt: "KiffStation: Sua plataforma multi-PWA",
      nl: "KiffStation: Jouw multi-PWA platform",
      pl: "KiffStation: Twoja platforma multi-PWA",
      ru: "KiffStation: Ваша multi-PWA платформа",
      zh: "KiffStation：您的多平台PWA",
      ja: "KiffStation：マルチPWAプラットフォーム",
      ko: "KiffStation: 멀티 PWA 플랫폼",
      ar: "KiffStation: منصتك متعددة PWA",
      hi: "KiffStation: आपका मल्टी-PWA प्लेटफॉर्म",
      tr: "KiffStation: Çoklu PWA platformunuz"
    },
    platform_desc: {
      fr: "KeffStation est une plateforme regroupant plusieurs applications web (PWA) dédiées à la technologie, aux gadgets high‑tech et aux objets connectés. Toutes les apps sont conçues pour offrir une expérience native sur Android, iOS et Windows.",
      en: "KeffStation is a platform bringing together several web apps (PWA) dedicated to technology, high‑tech gadgets and connected objects. All apps are designed to offer a native experience on Android, iOS and Windows.",
      es: "KeffStation es una plataforma que agrupa varias aplicaciones web (PWA) dedicadas a la tecnología, los gadgets high-tech y los objetos conectados. Todas las apps están diseñadas para ofrecer una experiencia nativa en Android, iOS y Windows.",
      de: "KeffStation ist eine Plattform, die mehrere Web-Apps (PWA) vereint, die der Technologie, High-Tech-Gadgets und vernetzten Objekten gewidmet sind. Alle Apps sind darauf ausgelegt, ein natives Erlebnis auf Android, iOS und Windows zu bieten.",
      it: "KeffStation è una piattaforma che riunisce diverse app web (PWA) dedicate alla tecnologia, ai gadget high-tech e agli oggetti connessi. Tutte le app sono progettate per offrire un'esperienza nativa su Android, iOS e Windows.",
      pt: "KeffStation é uma plataforma que reúne vários aplicativos web (PWA) dedicados à tecnologia, gadgets high-tech e objetos conectados. Todos os aplicativos são projetados para oferecer uma experiência nativa no Android, iOS e Windows.",
      nl: "KeffStation is een platform dat verschillende web-apps (PWA) samenbrengt die zijn toegewijd aan technologie, high-tech-gadgets en verbonden objecten. Alle apps zijn ontworpen om een native ervaring te bieden op Android, iOS en Windows.",
      pl: "KeffStation to platforma gromadząca kilka aplikacji webowych (PWA) poświęconych technologii, high-techowym gadżetom i podłączonym przedmiotom. Wszystkie aplikacje są zaprojektowane tak, aby oferować natywne doświadczenie na Androidzie, iOS i Windows.",
      ru: "KeffStation — это платформа, объединяющая несколько веб-приложений (PWA), посвященных технологиям, высокотехнологичным гаджетам и подключенным объектам. Все приложения разработаны для обеспечения нативного опыта на Android, iOS и Windows.",
      zh: "KeffStation 是一个集合多个 Web 应用（PWA）的平台，致力于技术、高科技设备和连接对象。所有应用都旨在在 Android、iOS 和 Windows 上提供原生体验。",
      ja: "KeffStationは、テクノロジー、ハイテクガジェット、コネクテッドオブジェクトに特化した複数のウェブアプリ（PWA）を集約するプラットフォームです。すべてのアプリは、Android、iOS、Windowsでネイティブ体験を提供するように設計されています。",
      ko: "KeffStation은 기술, 하이테크 가젯, 연결된 객체에 전념한 여러 웹 앱(PWA)을 모아놓은 플랫폼입니다. 모든 앱은 Android, iOS, Windows에서 네이티브 경험을 제공하도록 설계되었습니다.",
      ar: "KeffStation هي منصة تجمع عدة تطبيقات ويب (PWA) مخصصة للتكنولوجيا والأجهزة الذكية عالية التقنية والأ oggetti المتصلة. جميع التطبيقات مصممة لتوفير تجربة أصلية على Android و iOS و Windows.",
      hi: "KeffStation एक ऐसा प्लेटफॉर्म है जो कई वेब ऐप (PWA) को इकट्ठा करता है जो तकनीक, हाई-टेक गैजेट और कनेक्टेड ऑब्जेक्ट्स के लिए समर्पित हैं। सभी ऐप Android, iOS और Windows पर नेटिव अनुभव प्रदान करने के लिए डिज़ाइन किए गए हैं।",
      tr: "KeffStation, teknoloji, yüksek teknoloji cihazları ve bağlanmış nesneler için adanmış birden fazla web uygulaması (PWA) birleştiren bir platformdur. Tüm uygulamalar, Android, iOS ve Windows'ta yerel bir deneyim sunacak şekilde tasarlanmıştır."
    },
    install_title: {
      fr: "Installez vos apps préférées",
      en: "Install your favorite apps",
      es: "Instala tus aplicaciones favoritas",
      de: "Installieren Sie Ihre Lieblings-Apps",
      it: "Installa le tue app preferite",
      pt: "Instale seus aplicativos favoritos",
      nl: "Installeer je favoriete apps",
      pl: "Zainstaluj swoje ulubione aplikacje",
      ru: "Установите ваши любимые приложения",
      zh: "安装你喜欢的应用",
      ja: "お気に入りのアプリをインストール",
      ko: "즐겨찾는 앱 설치",
      ar: "ثبت تطبيقاتك المفضلة",
      hi: "अपने पसंदीदा ऐप इंस्टॉल करें",
      tr: "Favori uygulamalarınızı yükleyin"
    },
    install_android: {
      fr: "Android APK",
      en: "Android APK",
      es: "Android APK",
      de: "Android APK",
      it: "Android APK",
      pt: "Android APK",
      nl: "Android APK",
      pl: "Android APK",
      ru: "Android APK",
      zh: "Android APK",
      ja: "Android APK",
      ko: "안드로이드 APK",
      ar: "آندرويد APK",
      hi: "एंड्रॉइड APK",
      tr: "Android APK"
    },
    install_ios: {
      fr: "iOS IPA",
      en: "iOS IPA",
      es: "iOS IPA",
      de: "iOS IPA",
      it: "iOS IPA",
      pt: "iOS IPA",
      nl: "iOS IPA",
      pl: "iOS IPA",
      ru: "iOS IPA",
      zh: "iOS IPA",
      ja: "iOS IPA",
      ko: "iOS IPA",
      ar: "iOS IPA",
      hi: "iOS IPA",
      tr: "iOS IPA"
    },
    install_windows: {
      fr: "Windows EXE",
      en: "Windows EXE",
      es: "Windows EXE",
      de: "Windows EXE",
      it: "Windows EXE",
      pt: "Windows EXE",
      nl: "Windows EXE",
      pl: "Windows EXE",
      ru: "Windows EXE",
      zh: "Windows EXE",
      ja: "Windows EXE",
      ko: "윈도우 EXE",
      ar: "ويندوز EXE",
      hi: "विंडोज़ EXE",
      tr: "Windows EXE"
    },
    install_note: {
      fr: "Ces applications fonctionnent hors ligne et sont mises à jour automatiquement.",
      en: "These applications work offline and are updated automatically.",
      es: "Estas aplicaciones funcionan sin conexión y se actualizan automáticamente.",
      de: "Diese Anwendungen funktionieren offline und werden automatisch aktualisiert.",
      it: "Queste applicazioni funzionano offline e vengono aggiornate automaticamente.",
      pt: "Estes aplicativos funcionam off-line e são atualizados automaticamente.",
      nl: "Deze apps werken offline en worden automatisch bijgewerkt.",
      pl: "Te aplikacje działają offline i są aktualizowane automatycznie.",
      ru: "Эти приложения работают в офлайн-режиме и обновляются автоматически.",
      zh: "这些应用可离线使用并自动更新。",
      ja: "これらのアプリはオフラインで動作し、自動的に更新されます。",
      ko: "이 앱들은 오프라인에서 작동하며 자동으로 업데이트됩니다.",
      ar: "هذه التطبيقات تعمل دون اتصال بالإنترنت ويتم تحديثها تلقائيًا.",
      hi: "ये एप्लिकेशन ऑफ़लाइन काम करते हैं और स्वचालित रूप से अपडेट होते हैं।",
      tr: "Bu uygulamalar çevrimdışı çalışır ve otomatik olarak güncellenir."
    },
    app_count: {
      fr: "apps",
      en: "apps",
      es: "apps",
      de: "Apps",
      it: "app",
      pt: "apps",
      nl: "apps",
      pl: "aplikacje",
      ru: "приложения",
      zh: "个应用",
      ja: "アプリ",
      ko: "개 앱",
      ar: "تطبيقات",
      hi: "ऐप्स",
      tr: "uygulama"
    },

    /* ---------- Sous-PWA génériques ---------- */
    kifftech_name: {
      fr: "KiffTech",
      en: "KiffTech",
      es: "KiffTech",
      de: "KiffTech",
      it: "KiffTech",
      pt: "KiffTech",
      nl: "KiffTech",
      pl: "KiffTech",
      ru: "KiffTech",
      zh: "KiffTech",
      ja: "KiffTech",
      ko: "키프테크",
      ar: "كيفيتك",
      hi: "किफटेक",
      tr: "KiffTech"
    },
    kifftech_desc: {
      fr: "Boutique et gestion d'objets connectés",
      en: "Shop and connected objects management",
      es: "Tienda y gestión de objetos conectados",
      de: "Shop und Verwaltung vernetzter Objekte",
      it: "Negozio e gestione di oggetti connessi",
      pt: "Loja e gerenciamento de objetos conectados",
      nl: "Winkel en beheer van verbonden objecten",
      pl: "Sklep i zarządzanie podłączonymi przedmiotami",
      ru: "Магазин и управление подключенными объектами",
      zh: "商店和连接对象管理",
      ja: "ショップとコネクテッドオブジェクト管理",
      ko: "샵과 연결된 객체 관리",
      ar: "متجر وإدارة الأشياء المتصلة",
      hi: "स्टोर और कनेक्टेड ऑब्जेक्ट्स प्रबंधन",
      tr: "Mağaza ve bağlı nesne yönetimi"
    },
    via_name: {
      fr: "ViArtificial",
      en: "ViArtificial",
      es: "ViArtificial",
      de: "ViArtificial",
      it: "ViArtificial",
      pt: "ViArtificial",
      nl: "ViArtificial",
      pl: "ViArtificial",
      ru: "ViArtificial",
      zh: "ViArtificial",
      ja: "ViArtificial",
      ko: "비아아티피셜",
      ar: "فيأرتيفيشيل",
      hi: "विआआर्टिफिशियल",
      tr: "ViArtificial"
    },
    via_famille: {
      fr: "Une famille de compagnons IA",
      en: "A family of AI companions",
      es: "Una familia de compañeros de IA",
      de: "Eine Familie von KI-Begleitern",
      it: "Una famiglia di compagni di intelligenza artificiale",
      pt: "Uma família de companheiros de IA",
      nl: "Een familie van AI-gezellen",
      pl: "Rodzina towarzyszy AI",
      ru: "Семья ИИ-спутников",
      zh: "AI 伴侣家族",
      ja: "AIコンパニオンの家族",
      ko: "AI 동반자 가족",
      ar: "عائلة من رفقاء الذكاء الاصطناعي",
      hi: "AI साथियों का एक परिवार",
      tr: "Bir aile yapay zeka arkadaşı"
    },
    via_desc: {
      fr: "Moteurs IA et conversation directe",
      en: "AI engines and direct conversation",
      es: "Motores IA y conversación directa",
      de: "KI-Engines und direkte Konversation",
      it: "Motori IA e conversazione diretta",
      pt: "Motores IA e conversação direta",
      nl: "AI-engines en directe conversatie",
      pl: "Silniki AI i bezpośrednia rozmowa",
      ru: "ИИ-движки и прямая беседа",
      zh: "AI引擎和直接对话",
      ja: "AIエンジンと直接の会話",
      ko: "AI 엔진과 직접 대화",
      ar: "محركات ذكاء اصطناعي ومحادثة مباشرة",
      hi: "AI इंजन और सीधी बातचीत",
      tr: "AI motorları ve doğrudan sohbet"
    },
    tricktrocjob_name: {
      fr: "Tricktrocjob",
      en: "Tricktrocjob",
      es: "Tricktrocjob",
      de: "Tricktrocjob",
      it: "Tricktrocjob",
      pt: "Tricktrocjob",
      nl: "Tricktrocjob",
      pl: "Tricktrocjob",
      ru: "Tricktrocjob",
      zh: "Tricktrocjob",
      ja: "Tricktrocjob",
      ko: "트릭트로크ジョブ",
      ar: "تريكتروكجوب",
      hi: "ट्रिकट्रोकजॉब",
      tr: "Tricktrocjob"
    },
    tricktrocjob_desc: {
      fr: "Utilitaires et outils techniques",
      en: "Utilities and technical tools",
      es: "Utilidades y herramientas técnicas",
      de: "Dienstprogramme und technische Werkzeuge",
      it: "Utilità e strumenti tecnici",
      pt: "Utilitários e ferramentas técnicas",
      nl: "Hulpprogramma's en technische gereedschappen",
      pl: "Narzędzia i narzędzia techniczne",
      ru: "Утилиты и технические инструменты",
      zh: "实用工具和技术工具",
      ja: "ユーティリティと技術ツール",
      ko: "유틸리티 및 기술 도구",
      ar: "برامج مساعدة وأدوات تقنية",
      hi: "यूटिलिटी और तकनीकी उपकरण",
      tr: "Araçlar ve teknik araçlar"
    },
    videogames_name: {
      fr: "Videogames",
      en: "Videogames",
      es: "Videojuegos",
      de: "Videospiele",
      it: "Videogiochi",
      pt: "Videogames",
      nl: "Videogames",
      pl: "Gry wideo",
      ru: "Видеоигры",
      zh: "电子游戏",
      ja: "ビデオゲーム",
      ko: "비디오 게임",
      ar: "ألعاب فيديو",
      hi: "वीडियो गेम",
      tr: "Video oyunları"
    },
    videogames_desc: {
      fr: "Retro et jeux rétro",
      en: "Retro and retro games",
      es: "Retro y juegos retro",
      de: "Retro und Retro-Spiele",
      it: "Retro e giochi retrò",
      pt: "Retrô e jogos retrô",
      nl: "Retro en retro games",
      pl: "Retro i gry retro",
      ru: "Ретро и ретро-игры",
      zh: "复古游戏",
      ja: "レトロゲーム",
      ko: "레트로 게임",
      ar: "ألعاب كلاسيكية",
      hi: "रेट्रो गेम्स",
      tr: "Retro oyunlar"
    },
    coseditor_name: {
      fr: "Éditeur COS",
      en: "COS Editor",
      es: "Editor COS",
      de: "COS-Editor",
      it: "Editor COS",
      pt: "Editor COS",
      nl: "COS-editor",
      pl: "Edytor COS",
      ru: "Редактор COS",
      zh: "COS 编辑器",
      ja: "COS エディター",
      ko: "COS 편집기",
      ar: "محرر COS",
      hi: "COS संपादक",
      tr: "COS Düzenleyici"
    },
    coseditor_desc: {
      fr: "Analyse, aperçu et tutoriels COS",
      en: "COS analysis, preview and tutorials",
      es: "Análisis, vista previa y tutoriales COS",
      de: "COS-Analyse, Vorschau und Tutorials",
      it: "Analisi, anteprima e tutorial COS",
      pt: "Análise, pré-visualização e tutoriais COS",
      nl: "COS-analyse, voorbeeld en tutorials",
      pl: "Analiza, podgląd i samouczki COS",
      ru: "Анализ, предварительный просмотр и руководства COS",
      zh: "COS 分析、预览和教程",
      ja: "COS 分析、プレビューとチュートリアル",
      ko: "COS 분석, 미리보기 및 튜토리얼",
      ar: "تحليل ومعاينة ودروس COS",
      hi: "COS विश्लेषण, पूर्वावलोकन और ट्यूटोरियल",
      tr: "COS analizi, önizleme ve eğiticiler"
    },
    linguisticmotors_name: {
      fr: "Moteurs linguistiques",
      en: "Linguistic engines",
      es: "Motores lingüísticos",
      de: "Linguistische Motoren",
      it: "Motori linguistici",
      pt: "Motores linguísticos",
      nl: "Linguïstische engines",
      pl: "Silniki językowe",
      ru: "Лингвистические движки",
      zh: "语言引擎",
      ja: "言語エンジン",
      ko: "언어 엔진",
      ar: "محركات لغوية",
      hi: "भाषा इंजन",
      tr: "Dil motorları"
    },
    linguisticmotors_desc: {
      fr: "NLP/LLM local et expérimental",
      en: "Local and experimental NLP/LLM",
      es: "NLP/LLM local y experimental",
      de: "Lokaler und experimenteller NLP/LLM",
      it: "NLP/LLM locale e sperimentale",
      pt: "NLP/LLM local e experimental",
      nl: "Lokale en experimentele NLP/LLM",
      pl: "Lokalny i eksperymentalny NLP/LLM",
      ru: "Локальный и экспериментальный NLP/LLM",
      zh: "本地和实验性 NLP/LLM",
      ja: "ローカルおよび実験的な NLP/LLM",
      ko: "로컬 및 실험적 NLP/LLM",
      ar: "NLP/LLM محلي وتجريبي",
      hi: "स्थानीय और प्रायोगिक NLP/LLM",
      tr: "Yerel ve deneysel NLP/LLM"
    },

    /* ---------- UI générique ---------- */
    init: {
      fr: "Initialisation…",
      en: "Initializing…",
      es: "Inicializando…",
      de: "Initialisierung…",
      it: "Inizializzazione…",
      pt: "Inicializando…",
      nl: "Initialisatie…",
      pl: "Inicjalizacja…",
      ru: "Инициализация…",
      zh: "初始化中…",
      ja: "初期化中…",
      ko: "초기화 중…",
      ar: "جاري التهيئة…",
      hi: "प्रारंभ हो रहा है…",
      tr: "Başlatılıyor…"
    },
    default: {
      fr: "Défaut",
      en: "Default",
      es: "Predeterminado",
      de: "Standard",
      it: "Predefinito",
      pt: "Padrão",
      nl: "Standaard",
      pl: "Domyślny",
      ru: "По умолчанию",
      zh: "默认",
      ja: "デフォルト",
      ko: "기본값",
      ar: "الافتراضي",
      hi: "डिफ़ॉल्ट",
      tr: "Varsayılan"
    },
    example: {
      fr: "Exemple",
      en: "Example",
      es: "Ejemplo",
      de: "Beispiel",
      it: "Esempio",
      pt: "Exemplo",
      nl: "Voorbeeld",
      pl: "Przykład",
      ru: "Пример",
      zh: "示例",
      ja: "例",
      ko: "예시",
      ar: "مثال",
      hi: "उदाहरण",
      tr: "Örnek"
    },
    clear: {
      fr: "Effacer",
      en: "Clear",
      es: "Borrar",
      de: "Löschen",
      it: "Cancella",
      pt: "Limpar",
      nl: "Wissen",
      pl: "Wyczyść",
      ru: "Очистить",
      zh: "清除",
      ja: "クリア",
      ko: "지우기",
      ar: "مسح",
      hi: "साफ़ करें",
      tr: "Temizle"
    },
    tutorial: {
      fr: "Tutoriel",
      en: "Tutorial",
      es: "Tutorial",
      de: "Tutorial",
      it: "Tutorial",
      pt: "Tutorial",
      nl: "Zelfstudie",
      pl: "Samouczek",
      ru: "Руководство",
      zh: "教程",
      ja: "チュートリアル",
      ko: "튜토리얼",
      ar: "دورة تعليمية",
      hi: "ट्यूटोरियल",
      tr: "Eğitim"
    },
    language: {
      fr: "Langue",
      en: "Language",
      es: "Idioma",
      de: "Sprache",
      it: "Lingua",
      pt: "Idioma",
      nl: "Taal",
      pl: "Język",
      ru: "Язык",
      zh: "语言",
      ja: "言語",
      ko: "언어",
      ar: "اللغة",
      hi: "भाषा",
      tr: "Dil"
    },
    offline: {
      fr: "Hors ligne",
      en: "Offline",
      es: "Sin conexión",
      de: "Offline",
      it: "Offline",
      pt: "Off-line",
      nl: "Offline",
      pl: "Offline",
      ru: "Офлайн",
      zh: "离线",
      ja: "オフライン",
      ko: "오프라인",
      ar: "بدون اتصال",
      hi: "ऑफलाइन",
      tr: "Çevrimdışı"
    },
    loading: {
      fr: "Chargement…",
      en: "Loading…",
      es: "Cargando…",
      de: "Laden…",
      it: "Caricamento…",
      pt: "Carregando…",
      nl: "Laden…",
      pl: "Ładowanie…",
      ru: "Загрузка…",
      zh: "加载中…",
      ja: "読み込み中…",
      ko: "로드 중…",
      ar: "جاري التحميل…",
      hi: "लोड हो रहा है…",
      tr: "Yükleniyor…"
    },

    /* ---------- cos-editor ---------- */
    source_cos: {
      fr: "Source COS",
      en: "COS Source",
      es: "Código COS",
      de: "COS-Quelle",
      it: "Sorgente COS",
      pt: "Fonte COS",
      nl: "COS-bron",
      pl: "Źródło COS",
      ru: "Исходный код COS",
      zh: "COS 源代码",
      ja: "COS ソース",
      ko: "COS 소스",
      ar: "مصدر COS",
      hi: "COS स्रोत",
      tr: "COS Kaynağı"
    },
    resultats: {
      fr: "Résultats",
      en: "Results",
      es: "Resultados",
      de: "Ergebnisse",
      it: "Risultati",
      pt: "Resultados",
      nl: "Resultaten",
      pl: "Wyniki",
      ru: "Результаты",
      zh: "结果",
      ja: "結果",
      ko: "결과",
      ar: "النتائج",
      hi: "परिणाम",
      tr: "Sonuçlar"
    },
    analyser: {
      fr: "Analyser",
      en: "Analyze",
      es: "Analizar",
      de: "Analysieren",
      it: "Analizza",
      pt: "Analisar",
      nl: "Analyseren",
      pl: "Analizuj",
      ru: "Анализировать",
      zh: "分析",
      ja: "分析",
      ko: "분석",
      ar: "حلّل",
      hi: "विश्लेषण करें",
      tr: "Analiz Et"
    },
    copier_json: {
      fr: "Copier JSON",
      en: "Copy JSON",
      es: "Copiar JSON",
      de: "JSON kopieren",
      it: "Copia JSON",
      pt: "Copiar JSON",
      nl: "JSON kopiëren",
      pl: "Kopiuj JSON",
      ru: "Копировать JSON",
      zh: "复制 JSON",
      ja: "JSONをコピー",
      ko: "JSON 복사",
      ar: "نسخ JSON",
      hi: "JSON कॉपी करें",
      tr: "JSON Kopyala"
    },
    telecharger_json: {
      fr: "Télécharger JSON",
      en: "Download JSON",
      es: "Descargar JSON",
      de: "JSON herunterladen",
      it: "Scarica JSON",
      pt: "Baixar JSON",
      nl: "JSON downloaden",
      pl: "Pobierz JSON",
      ru: "Скачать JSON",
      zh: "下载 JSON",
      ja: "JSONをダウンロード",
      ko: "JSON 다운로드",
      ar: "تنزيل JSON",
      hi: "JSON डाउनलोड करें",
      tr: "JSON İndir"
    },
    apercu: {
      fr: "Aperçu",
      en: "Preview",
      es: "Vista previa",
      de: "Vorschau",
      it: "Anteprima",
      pt: "Pré-visualização",
      nl: "Voorbeeld",
      pl: "Podgląd",
      ru: "Предварительный просмотр",
      zh: "预览",
      ja: "プレビュー",
      ko: "미리보기",
      ar: "معاينة",
      hi: "पूर्वावलोकन",
      tr: "Önizleme"
    },
    liens: {
      fr: "Liens",
      en: "Links",
      es: "Enlaces",
      de: "Links",
      it: "Link",
      pt: "Links",
      nl: "Links",
      pl: "Linki",
      ru: "Ссылки",
      zh: "链接",
      ja: "リンク",
      ko: "링크",
      ar: "روابط",
      hi: "लिंक",
      tr: "Bağlantılar"
    },
    diagnostics: {
      fr: "Diagnostics",
      en: "Diagnostics",
      es: "Diagnósticos",
      de: "Diagnose",
      it: "Diagnostica",
      pt: "Diagnósticos",
      nl: "Diagnostics",
      pl: "Diagnostyka",
      ru: "Диагностика",
      zh: "诊断",
      ja: "診断",
      ko: "진단",
      ar: "تشخيصات",
      hi: "निदान",
      tr: "Tanılar"
    },
    pied_cos: {
      fr: "COS · analyse locale dans le navigateur · aucun script personnalisé exécuté",
      en: "COS · local analysis in browser · no custom script executed",
      es: "COS · análisis local en el navegador · ningún script personalizado ejecutado",
      de: "COS · lokale Analyse im Browser · kein benutzerdefiniertes Skript ausgeführt",
      it: "COS · analisi locale nel browser · nessuno script personalizzato eseguito",
      pt: "COS · análise local no navegador · nenhum script personalizado executado",
      nl: "COS · lokale analyse in browser · geen aangepast script uitgevoerd",
      pl: "COS · lokalna analiza w przeglądarce · żaden niestandardowy skrypt nie został wykonany",
      ru: "COS · локальный анализ в браузере · никакой пользовательский скрипт не выполнен",
      zh: "COS · 浏览器本地分析 · 未执行自定义脚本",
      ja: "COS · ブラウザー内ローカル分析 · カスタムスクリプトは実行されません",
      ko: "COS · 브라우저 내 로컬 분석 · 사용자 정의 스크립트 실행 안 함",
      ar: "COS · تحليل محلي في المتصفح · لا توجد نصوص مخصصة يتم تنفيذها",
      hi: "COS · ब्राउज़र में स्थानीय विश्लेषण · कोई कस्टम स्क्रिप्ट नहीं चलाया गया",
      tr: "COS · tarayıcıda yerel analiz · özel betik çalıştırılmadı"
    },

    /* ---------- admin / prototype ---------- */
    admin_title: {
      fr: "Administration",
      en: "Administration",
      es: "Administración",
      de: "Administration",
      it: "Amministrazione",
      pt: "Administração",
      nl: "Administratie",
      pl: "Administracja",
      ru: "Администрирование",
      zh: "管理",
      ja: "管理",
      ko: "관리",
      ar: "إدارة",
      hi: "प्रशासन",
      tr: "Yönetim"
    },
    prive: {
      fr: "Privé",
      en: "Private",
      es: "Privado",
      de: "Privat",
      it: "Privato",
      pt: "Privado",
      nl: "Privé",
      pl: "Prywatne",
      ru: "Частный",
      zh: "私有",
      ja: "プライベート",
      ko: "비공개",
      ar: "خاص",
      hi: "निजी",
      tr: "Özel"
    },
    prototype_notice: {
      fr: "Prototype. Données fictives, aucune connexion réelle, aucun secret.",
      en: "Prototype. Fake data, no real connection, no secrets.",
      es: "Prototipo. Datos ficticios, sin conexión real, sin secretos.",
      de: "Prototyp. Fiktive Daten, keine echte Verbindung, keine Geheimnisse.",
      it: "Prototipo. Dati fittizi, nessuna connessione reale, nessun segreto.",
      pt: "Protótipo. Dados fictícios, nenhuma conexão real, nenhum segredo.",
      nl: "Prototype. Nepgegevens, geen echte verbinding, geen geheimen.",
      pl: "Prototyp. Dane fikcyjne, brak rzeczywistego połączenia, brak tajemnic.",
      ru: "Прототип. Фальшивые данные, нет реального соединения, нет секретов.",
      zh: "原型。假数据，无真实连接，无秘密。",
      ja: "プロトタイプ。ダミーデータ、実際の接続なし、秘密なし。",
      ko: "프로토타입. 가짜 데이터, 실제 연결 없음, 비밀 없음.",
      ar: "نموذج أولي. بيانات وهمية، कोई اتصال حقيقي नहीं, कोई रहस्य नहीं.",
      hi: "प्रोटोटाइप. नकली डेटा, कोई वास्तविक कनेक्शन नहीं, कोई रहस्य नहीं।",
      tr: "Prototip. Sahte veri, gerçek bağlantı yok, gizli yok."
    },
    periode_title: {
      fr: "Sélection de la période",
      en: "Period selection",
      es: "Selección de período",
      de: "Zeitraumauswahl",
      it: "Selezione periodo",
      pt: "Seleção de período",
      nl: "Periodekeuze",
      pl: "Wybór okresu",
      ru: "Выбор периода",
      zh: "周期选择",
      ja: "期間の選択",
      ko: "기간 선택",
      ar: "اختيار الفترة",
      hi: "अवधि चयन",
      tr: "Dönem Seçimi"
    },
    periode_7: {
      fr: "7 jours",
      en: "7 days",
      es: "7 días",
      de: "7 Tage",
      it: "7 giorni",
      pt: "7 dias",
      nl: "7 dagen",
      pl: "7 dni",
      ru: "7 дней",
      zh: "7天",
      ja: "7日間",
      ko: "7일",
      ar: "7 أيام",
      hi: "7 दिन",
      tr: "7 gün"
    },
    periode_10: {
      fr: "10 jours",
      en: "10 days",
      es: "10 días",
      de: "10 Tage",
      it: "10 giorni",
      pt: "10 dias",
      nl: "10 dagen",
      pl: "10 dni",
      ru: "10 дней",
      zh: "10天",
      ja: "10日間",
      ko: "10일",
      ar: "10 أيام",
      hi: "10 दिन",
      tr: "10 gün"
    },
    periode_30: {
      fr: "30 jours",
      en: "30 days",
      es: "30 días",
      de: "30 Tage",
      it: "30 giorni",
      pt: "30 dias",
      nl: "30 dagen",
      pl: "30 dni",
      ru: "30 дней",
      zh: "30天",
      ja: "30日間",
      ko: "30일",
      ar: "30 أيام",
      hi: "30 दिन",
      tr: "30 gün"
    },
    periode_custom: {
      fr: "Personnalisé",
      en: "Custom",
      es: "Personalizado",
      de: "Benutzerdefiniert",
      it: "Personalizzato",
      pt: "Personalizado",
      nl: "Aangepast",
      pl: "Niestandardowy",
      ru: "Настроить",
      zh: "自定义",
      ja: "カスタム",
      ko: "사용자 지정",
      ar: "مخصص",
      hi: "कस्टम",
      tr: "Özel"
    },
    appliquer: {
      fr: "Appliquer",
      en: "Apply",
      es: "Aplicar",
      de: "Anwenden",
      it: "Applica",
      pt: "Aplicar",
      nl: "Toepassen",
      pl: "Zastosuj",
      ru: "Применить",
      zh: "应用",
      ja: "適用",
      ko: "적용",
      ar: "تطبيق",
      hi: "लागू करें",
      tr: "Uygula"
    }
  };

  var STORAGE_KEY = "keffstation_lang";
  var DEFAULT_LANG = "fr";
  var SUPPORTED = Object.keys(DICT.langNames);

  /* ========================= Helpers ========================= */
  function getLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.indexOf(saved) !== -1) {
        return saved;
      }
    } catch (e) {}
    // détecte la langue navigateur (fr/en/etc.)
    var nav = (navigator.language || navigator.userLanguage || "fr").slice(0, 2).toLowerCase();
    return SUPPORTED.indexOf(nav) !== -1 ? nav : DEFAULT_LANG;
  }

  function setLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    document.documentElement.lang = lang;
    applyTranslations(lang);
    refreshSelector(lang);
    document.dispatchEvent(new CustomEvent("ks-lang-change", { detail: { lang: lang } }));
  }

  // Fallback : langue demandée → anglais → français → clé brute
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
      if (val === key) return;
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        if (!el.value) el.placeholder = val;
      } else {
        el.textContent = val;
      }
      el.setAttribute("data-i18n-lang", lang);
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      var val = t(key, lang);
      if (val === key) return;
      el.innerHTML = val;
      el.setAttribute("data-i18n-lang", lang);
    });
    // attributs title/placeholder/aria-label
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

  /* ========================= Sélecteur de langue ========================= */
  var SELECTOR_CSS = "\
    #ks-lang-selector {\
      position: fixed; top: 10px; right: 10px; z-index: 2000;\
      background: rgba(10,12,34,.92); border: 1px solid rgba(255,255,255,.2);\
      border-radius: 12px; padding: 6px 10px; color: #f4f6ff;\
      font: 700 13px/1.2 system-ui,sans-serif; cursor: pointer; backdrop-filter: blur(6px);\
    }\
    #ks-lang-selector select {\n      background: transparent; border: none; color: #ffd23f;\n      font: inherit; outline: none; cursor: pointer; -webkit-appearance: none;\n    }\
    #ks-lang-selector option { background: #070816; color: #f4f6ff; }\
  ";

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
    box.setAttribute("role", "combobox");
    box.setAttribute("aria-label", t("language", lang));
    var label = document.createElement("span");
    label.textContent = t("language", lang) + " ";
    label.style.marginRight = "6px";
    label.style.color = "#b9c0e6";
    label.style.fontSize = "12px";
    box.appendChild(label);
    var sel = document.createElement("select");
    sel.id = "ks-lang-picker";
    SUPPORTED.forEach(function (code) {
      var opt = document.createElement("option");
      opt.value = code;
      opt.textContent = DICT.langNames[code];
      if (code === lang) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.addEventListener("change", function () {
      setLang(sel.value);
    });
    box.appendChild(sel);
    return box;
  }

  function refreshSelector(lang) {
    var sel = document.getElementById("ks-lang-picker");
    if (sel) sel.value = lang;
  }

  function injectSelector(lang) {
    if (document.getElementById("ks-lang-selector")) return;
    injectStyle();
    var box = buildSelector(lang);
    document.body.appendChild(box);
  }

  /* ========================= Init ========================= */
  function init() {
    var lang = getLang();
    document.documentElement.lang = lang;
    injectSelector(lang);
    applyTranslations(lang);

    // Re-traduire si le DOM change (SPA / injection dynamique)
    var observer = new MutationObserver(function (mutations) {
      var need = false;
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (n) {
          if (n.nodeType === 1 && (n.hasAttribute && n.hasAttribute("data-i18n"))) need = true;
        });
      });
      if (need) applyTranslations(lang);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // API exposée
  window.ksI18n = { setLang: setLang, getLang: getLang, t: t, apply: applyTranslations };
})();
