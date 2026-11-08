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
    currency: {
      fr: "Devise",
      en: "Currency",
      es: "Divisa",
      de: "Währung",
      it: "Valuta",
      pt: "Moeda",
      nl: "Valuta",
      pl: "Waluta",
      ru: "Валюта",
      zh: "货币",
      ja: "通貨",
      ko: "통화",
      ar: "العملة",
      hi: "मुद्रा",
      tr: "Para birimi"
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

    about_link: {
      fr: "À propos",
      en: "About",
      es: "Acerca de",
      de: "Über uns",
      it: "Informazioni",
      pt: "Sobre",
      nl: "Over",
      pl: "O nas",
      ru: "О нас",
      zh: "关于",
      ja: "について",
      ko: "소개",
      ar: "من نحن",
      hi: "बारे में",
      tr: "Hakkında"
    },

    /* ---------- Widget 7 Web Apps ---------- */
    widget_apps_title: {
      fr: "7 Web Apps KeffStation",
      en: "7 KeffStation Web Apps",
      es: "7 Aplicaciones Web KeffStation",
      de: "7 KeffStation Web-Apps",
      it: "7 App Web KeffStation",
      pt: "7 Aplicativos Web KeffStation",
      nl: "7 KeffStation Web-apps",
      pl: "7 Aplikacji sieciowych KeffStation",
      ru: "7 веб-приложений KeffStation",
      zh: "7 个 KeffStation Web 应用",
      ja: "7 つの KeffStation ウェブアプリ",
      ko: "7 개의 KeffStation 웹 앱",
      ar: "تطبيقات ويب KeffStation",
      hi: "7 KeffStation वेब ऐप",
      tr: "7 KeffStation Web Uygulaması"
    },
    widget_kifftech: {
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
    widget_kifftech_desc: {
      fr: "Objets connectés & gadgets",
      en: "Connected objects & gadgets",
      es: "Objetos conectados y gadgets",
      de: "Vernetzte Objekte & Gadgets",
      it: "Oggetti connessi e gadget",
      pt: "Objetos conectados e gadgets",
      nl: "Verbonden objecten & gadgets",
      pl: "Podłączone przedmioty i gadżety",
      ru: "Подключенные объекты и гаджеты",
      zh: "连接对象和小工具",
      ja: "コネクテッドオブジェクトとガジェット",
      ko: "연결된 객체 및 가젯",
      ar: "الأشياء المتصلة والأدوات",
      hi: "कनेक्टेड ऑब्जेक्ट्स और गैजेट्स",
      tr: "Bağlantılı nesneler ve cihazlar"
    },
    widget_via: {
      fr: "ViArtificial Labs",
      en: "ViArtificial Labs",
      es: "ViArtificial Labs",
      de: "ViArtificial Labs",
      it: "ViArtificial Labs",
      pt: "ViArtificial Labs",
      nl: "ViArtificial Labs",
      pl: "ViArtificial Labs",
      ru: "ViArtificial Labs",
      zh: "ViArtificial Labs",
      ja: "ViArtificial Labs",
      ko: "비아아티피셜 랩스",
      ar: "مختبرات فيأرتيفيشيل",
      hi: "विआआर्टिफिशियल लैब्स",
      tr: "ViArtificial Laboratuvarları"
    },
    widget_via_desc: {
      fr: "Moteurs IA & conversation",
      en: "AI engines & conversation",
      es: "Motores IA y conversación",
      de: "KI-Engines & Konversation",
      it: "Motori IA e conversazione",
      pt: "Motores IA e conversação",
      nl: "AI-engines & gesprek",
      pl: "Silniki AI i rozmowa",
      ru: "ИИ-движки и беседа",
      zh: "AI 引擎和对话",
      ja: "AI エンジンと会話",
      ko: "AI 엔진 및 대화",
      ar: "محركات ذكاء اصطناعي ومحادثة",
      hi: "AI इंजन और बातचीत",
      tr: "AI motorları ve sohbet"
    },
    widget_critiques: {
      fr: "Critiques-Services",
      en: "Critiques-Services",
      es: "Críticas-Servicios",
      de: "Kritiken-Dienste",
      it: "Recensioni-Servizi",
      pt: "Críticas-Serviços",
      nl: "Recensies-Diensten",
      pl: "Recenzje-Usługi",
      ru: "Критические услуги",
      zh: "批评-服务",
      ja: "批評-サービス",
      ko: "비판-서비스",
      ar: "نقد-خدمات",
      hi: "आलोचना-सेवाएं",
      tr: "Eleştiri-Hizmetler"
    },
    widget_critiques_desc: {
      fr: "Avis & critiques services",
      en: "Reviews & service critiques",
      es: "Reseñas y críticas de servicios",
      de: "Bewertungen & Dienstleistungskritiken",
      it: "Recensioni e critiche di servizi",
      pt: "Avaliações e críticas de serviços",
      nl: "Beoordelingen & dienstkritieken",
      pl: "Recenzje i krytyka usług",
      ru: "Обзоры и критика услуг",
      zh: "评论和服务批评",
      ja: "レビューとサービス批評",
      ko: "리뷰 및 서비스 비판",
      ar: "مراجعات وانتقادات الخدمات",
      hi: "समीक्षा और सेवा आलोचना",
      tr: "İncelemeler ve hizmet eleştirileri"
    },
    widget_tricktrocjob: {
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
    widget_tricktrocjob_desc: {
      fr: "Utilitaires & outils tech",
      en: "Utilities & tech tools",
      es: "Utilidades y herramientas tecnológicas",
      de: "Dienstprogramme & technische Tools",
      it: "Utilità e strumenti tecnici",
      pt: "Utilitários e ferramentas de tecnologia",
      nl: "Hulpprogramma's & tech-tools",
      pl: "Narzędzia i narzędzia technologiczne",
      ru: "Утилиты и технические инструменты",
      zh: "实用工具和技术工具",
      ja: "ユーティリティとテックツール",
      ko: "유틸리티 및 기술 도구",
      ar: "برامج مساعدة وأدوات تقنية",
      hi: "यूटिलिटी और तकनीकी उपकरण",
      tr: "Araçlar ve teknik araçlar"
    },
    widget_videogames: {
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
    widget_videogames_desc: {
      fr: "Jeux & émulation",
      en: "Games & emulation",
      es: "Juegos y emulación",
      de: "Spiele & Emulation",
      it: "Giochi ed emulazione",
      pt: "Jogos e emulação",
      nl: "Games & emulatie",
      pl: "Gry i emulacja",
      ru: "Игры и эмуляция",
      zh: "游戏和模拟",
      ja: "ゲームとエミュレーション",
      ko: "게임 및 에뮬레이션",
      ar: "ألعاب ومحاكاة",
      hi: "गेम और एमुलेशन",
      tr: "Oyunlar ve emülasyon"
    },
    widget_cos: {
      fr: "cos Editor",
      en: "cos Editor",
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
    widget_cos_desc: {
      fr: "Éditeur syntaxe COS",
      en: "COS syntax editor",
      es: "Editor de sintaxis COS",
      de: "COS-Syntax-Editor",
      it: "Editor sintassi COS",
      pt: "Editor de sintaxe COS",
      nl: "COS-syntaxiseditor",
      pl: "Edytor składni COS",
      ru: "Редактор синтаксиса COS",
      zh: "COS 语法编辑器",
      ja: "COS 構文エディター",
      ko: "COS 구문 편집기",
      ar: "محرر بناء جملة COS",
      hi: "COS सिंटैक्स संपादक",
      tr: "COS sözdizimi düzenleyici"
    },
    widget_linguistic: {
      fr: "Linguistic Motors",
      en: "Linguistic Motors",
      es: "Motores lingüísticos",
      de: "Linguistische Motoren",
      it: "Motori linguistici",
      pt: "Motores linguísticos",
      nl: "Linguïstische motoren",
      pl: "Silniki językowe",
      ru: "Лингвистические двигатели",
      zh: "语言引擎",
      ja: "言語モーター",
      ko: "언어 모터",
      ar: "محركات لغوية",
      hi: "भाषा इंजन",
      tr: "Dil motorları"
    },
    widget_linguistic_desc: {
      fr: "NLP / LLM local",
      en: "Local NLP / LLM",
      es: "NLP / LLM local",
      de: "Lokales NLP / LLM",
      it: "NLP / LLM locale",
      pt: "NLP / LLM local",
      nl: "Lokaal NLP / LLM",
      pl: "Lokalny NLP / LLM",
      ru: "Локальный NLP / LLM",
      zh: "本地 NLP / LLM",
      ja: "ローカル NLP / LLM",
      ko: "로컬 NLP / LLM",
      ar: "NLP / LLM محلي",
      hi: "स्थानीय NLP / LLM",
      tr: "Yerel NLP / LLM"
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
    },
    "cos_editor_": {
      fr: "🧩",
      en: "🧩",
    },
    "cos_editor_0_ligne": {
      fr: "0 ligne",
      en: "0 ligne",
    },
    "cos_editor_analyser": {
      fr: "Analyser",
      en: "Analyser",
    },
    "cos_editor_aperu": {
      fr: "Aperçu",
      en: "Aperçu",
    },
    "cos_editor_copier_json": {
      fr: "Copier JSON",
      en: "Copier JSON",
    },
    cos_editor_cos_defaut_118: {
      fr: "cos_defaut (118)",
      en: "cos_defaut (118)",
    },
    "cos_editor_css_0": {
      fr: "CSS 0",
      en: "CSS 0",
    },
    "cos_editor_diagnostics_0": {
      fr: "Diagnostics 0",
      en: "Diagnostics 0",
    },
    "cos_editor_diteur_cos": {
      fr: "Éditeur COS",
      en: "Éditeur COS",
    },
    "cos_editor_effacer": {
      fr: "Effacer",
      en: "Effacer",
    },
    "cos_editor_exemple": {
      fr: "Exemple",
      en: "Exemple",
    },
    "cos_editor_initialisation": {
      fr: "Initialisation…",
      en: "Initialisation…",
    },
    "cos_editor_les_balises_nouveau_confirmer_sont_des_o": {
      fr: "Les balises  (NOUVEAU, à confirmer) sont des opérandes typés : l'éditeur les analyse, ne les exécute jamais.",
      en: "Les balises  (NOUVEAU, à confirmer) sont des opérandes typés : l'éditeur les analyse, ne les exécute jamais.",
    },
    "cos_editor_liens_0": {
      fr: "Liens 0",
      en: "Liens 0",
    },
    "cos_editor_rsultats": {
      fr: "Résultats",
      en: "Résultats",
    },
    "cos_editor_source_cos": {
      fr: "Source COS",
      en: "Source COS",
    },
    "cos_editor_syntaxe_css_alphanumrique": {
      fr: "Syntaxe  ·  ·  · CSS alphanumérique",
      en: "Syntaxe  ·  ·  · CSS alphanumérique",
    },
    "cos_editor_tlcharger_json": {
      fr: "Télécharger JSON",
      en: "Télécharger JSON",
    },
    "cos_editor_tutoriel": {
      fr: "Tutoriel",
      en: "Tutoriel",
    },
    "cos_editor_tutoriel_": {
      fr: "Tutoriel ?",
      en: "Tutoriel ?",
    },
    "docs_100": {
      fr: "/100",
      en: "/100",
    },
    "docs_10_jours": {
      fr: "10 jours",
      en: "10 jours",
    },
    "docs_124_": {
      fr: "+12,4 %",
      en: "+12,4 %",
    },
    "docs_1_842": {
      fr: "1 842",
      en: "1 842",
    },
    "docs_23_": {
      fr: "−2,3 %",
      en: "−2,3 %",
    },
    "docs_24_pts_vs_priode_prcdente": {
      fr: "+2,4 pts vs période précédente",
      en: "+2,4 pts vs période précédente",
    },
    "docs_30_jours": {
      fr: "30 jours",
      en: "30 jours",
    },
    "docs_3_271": {
      fr: "3 271",
      en: "3 271",
    },
    "docs_412": {
      fr: "412",
      en: "412",
    },
    "docs_42_": {
      fr: "+4,2 %",
      en: "+4,2 %",
    },
    "docs_7_derniers_jours": {
      fr: "7 derniers jours",
      en: "7 derniers jours",
    },
    "docs_7_jours": {
      fr: "7 jours",
      en: "7 jours",
    },
    "docs_80_": {
      fr: "80 %",
      en: "80 %",
    },
    "docs_81_": {
      fr: "+8,1 %",
      en: "+8,1 %",
    },
    "docs_85_": {
      fr: "85 %",
      en: "85 %",
    },
    "docs_90_": {
      fr: "90 %",
      en: "90 %",
    },
    "docs_91": {
      fr: "91",
      en: "91",
    },
    "docs_91100": {
      fr: "91/100",
      en: "91/100",
    },
    "docs_93_": {
      fr: "93 %",
      en: "93 %",
    },
    "docs_96": {
      fr: "96",
      en: "96",
    },
    "docs_999_": {
      fr: "99,9 %",
      en: "99,9 %",
    },
    "docs_administration": {
      fr: "Administration",
      en: "Administration",
    },
    "docs_alertes_rcentes": {
      fr: "Alertes récentes",
      en: "Alertes récentes",
    },
    "docs_appliquer": {
      fr: "Appliquer",
      en: "Appliquer",
    },
    "docs_au": {
      fr: "Au",
      en: "Au",
    },
    "docs_aucune_valeur_saisie_nest_affiche_ici_le": {
      fr: "Aucune valeur saisie n'est affichée ici. Les soumissions complètes restent dans une table protégée côté serveur.",
      en: "Aucune valeur saisie n'est affichée ici. Les soumissions complètes restent dans une table protégée côté serveur.",
    },
    "docs_boutons_0": {
      fr: "Boutons 0",
      en: "Boutons 0",
    },
    "docs_ces_donnes_sont_spares_des_requtes_googl": {
      fr: "Ces données sont séparées des requêtes Google Search Console.",
      en: "Ces données sont séparées des requêtes Google Search Console.",
    },
    "docs_chaque_clic_est_rattach_un_identifiant_s": {
      fr: "Chaque clic est rattaché à un identifiant stable, sans donnée personnelle.",
      en: "Chaque clic est rattaché à un identifiant stable, sans donnée personnelle.",
    },
    "docs_clics": {
      fr: "Clics",
      en: "Clics",
    },
    "docs_composantes_du_score_affich_au_sommet_de": {
      fr: "Composantes du score affiché au sommet de la montagne.",
      en: "Composantes du score affiché au sommet de la montagne.",
    },
    "docs_ctr": {
      fr: "CTR",
      en: "CTR",
    },
    "docs_diffr_23_jours": {
      fr: "Différé 2–3 jours",
      en: "Différé 2–3 jours",
    },
    "docs_disponibilit": {
      fr: "Disponibilité",
      en: "Disponibilité",
    },
    "docs_dmarrages_envois_succs_et_erreurs": {
      fr: "Démarrages, envois, succès et erreurs.",
      en: "Démarrages, envois, succès et erreurs.",
    },
    "docs_donnes_google_distinctes_des_recherches_": {
      fr: "Données Google, distinctes des recherches internes.",
      en: "Données Google, distinctes des recherches internes.",
    },
    "docs_du": {
      fr: "Du",
      en: "Du",
    },
    "docs_faible": {
      fr: "Faible",
      en: "Faible",
    },
    "docs_fiabilit": {
      fr: "Fiabilité",
      en: "Fiabilité",
    },
    "docs_fiabilit_du_projet": {
      fr: "Fiabilité du projet",
      en: "Fiabilité du projet",
    },
    "docs_formulaires": {
      fr: "Formulaires",
      en: "Formulaires",
    },
    "docs_formulaires_envoys": {
      fr: "Formulaires envoyés",
      en: "Formulaires envoyés",
    },
    "docs_fracheur_des_donnes": {
      fr: "Fraîcheur des données",
      en: "Fraîcheur des données",
    },
    "docs_google_ne_fournit_pas_ces_donnes_en_temp": {
      fr: "Google ne fournit pas ces données en temps réel et masque certaines requêtes. Ne pas les additionner aux recherches internes.",
      en: "Google ne fournit pas ces données en temps réel et masque certaines requêtes. Ne pas les additionner aux recherches internes.",
    },
    "docs_google_search_console": {
      fr: "Google Search Console",
      en: "Google Search Console",
    },
    "docs_gsc": {
      fr: "GSC",
      en: "GSC",
    },
    "docs_impressions": {
      fr: "Impressions",
      en: "Impressions",
    },
    "docs_keffstation": {
      fr: "Keffstation",
      en: "Keffstation",
    },
    "docs_les_tests_de_refus_de_carte_se_font_uniq": {
      fr: "Les tests de refus de carte se font uniquement en Sandbox. Aucune commande réelle n'est créée.",
      en: "Les tests de refus de carte se font uniquement en Sandbox. Aucune commande réelle n'est créée.",
    },
    "docs_lev": {
      fr: "Élevé",
      en: "Élevé",
    },
    "docs_liens_0": {
      fr: "Liens 0",
      en: "Liens 0",
    },
    "docs_liens_boutons_onglets_et_menus": {
      fr: "Liens, boutons, onglets et menus.",
      en: "Liens, boutons, onglets et menus.",
    },
    "docs_menus_0": {
      fr: "Menus 0",
      en: "Menus 0",
    },
    "docs_mis_jour_1432": {
      fr: "Mis à jour à 14:32",
      en: "Mis à jour à 14:32",
    },
    "docs_ne_pas_dployer_tel_quel_la_2fa_sera_ajou": {
      fr: "Ne pas déployer tel quel. La 2FA sera ajoutée avant la mise en ligne.",
      en: "Ne pas déployer tel quel. La 2FA sera ajoutée avant la mise en ligne.",
    },
    "docs_onglets_0": {
      fr: "Onglets 0",
      en: "Onglets 0",
    },
    "docs_personnalis": {
      fr: "Personnalisé",
      en: "Personnalisé",
    },
    "docs_poids_15_": {
      fr: "Poids 15 %",
      en: "Poids 15 %",
    },
    "docs_poids_20_": {
      fr: "Poids 20 %",
      en: "Poids 20 %",
    },
    "docs_poids_30_": {
      fr: "Poids 30 %",
      en: "Poids 30 %",
    },
    "docs_position": {
      fr: "Position",
      en: "Position",
    },
    "docs_priv": {
      fr: "Privé",
      en: "Privé",
    },
    "docs_prototype_local_donnes_fictives_aucune_d": {
      fr: "Prototype local · Données fictives · Aucune donnée personnelle",
      en: "Prototype local · Données fictives · Aucune donnée personnelle",
    },
    "docs_qualit_technique": {
      fr: "Qualité technique",
      en: "Qualité technique",
    },
    "docs_recherches": {
      fr: "Recherches",
      en: "Recherches",
    },
    "docs_recherches_effectues_sur_keffstation_tem": {
      fr: "Recherches effectuées sur Keffstation — temps réel.",
      en: "Recherches effectuées sur Keffstation — temps réel.",
    },
    "docs_recherches_internes": {
      fr: "Recherches internes",
      en: "Recherches internes",
    },
    "docs_sommet_central_fiabilit_crtes_activit": {
      fr: "Sommet central = fiabilité · crêtes = activité",
      en: "Sommet central = fiabilité · crêtes = activité",
    },
    "docs_succs_formulaires": {
      fr: "Succès formulaires",
      en: "Succès formulaires",
    },
    "docs_succs_paiements": {
      fr: "Succès paiements",
      en: "Succès paiements",
    },
    "docs_synthse_de_la_priode_slectionne": {
      fr: "Synthèse de la période sélectionnée.",
      en: "Synthèse de la période sélectionnée.",
    },
    "docs_top_clics": {
      fr: "Top clics",
      en: "Top clics",
    },
    "docs_visites": {
      fr: "Visites",
      en: "Visites",
    },
    "docs_vue_densemble": {
      fr: "Vue d'ensemble",
      en: "Vue d'ensemble",
    },
    "kifftech_": {
      fr: "🤖",
      en: "🤖",
    },
    "kifftech_000_": {
      fr: "0,00 €",
      en: "0,00 €",
    },
    "kifftech_0_hard_refresh_mise_jour_version_kifftec": {
      fr: "0\n\n    \n      \n      Hard refresh — mise à jour version KiffTech\n    \n    \n      \n      Vider le cache KiffTech\n    \nRayons\nCrédits\nÀ propos\n\n\n\nKiffTech\n\n\n  \n    \n      \n    \n    \n      Samsung • Smartphones • 2024",
      en: "0\n\n    \n      \n      Hard refresh — mise à jour version KiffTech\n    \n    \n      \n      Vider le cache KiffTech\n    \nRayons\nCrédits\nÀ propos\n\n\n\nKiffTech\n\n\n  \n    \n      \n    \n    \n      Samsung • Smartphones • 2024",
    },
    "kifftech_0_produits": {
      fr: "0 produits",
      en: "0 produits",
    },
    "kifftech_0_rayons_crdits_caisse_admin_cube_recher": {
      fr: "0\n    \n    Rayons\n    Crédits\n    Caisse admin\n    \n      \n      Cube\n    \n  \n\n\n  \n    \n      Recherche\n      \n        \n        \n      \n    \n    \n      🤖 Agent IA — Référence exacte\n      \n        \n      \n      Identifier + Aperçu\n      \n    \n    \n      Filtres\n      \n        \n          Catégorie\n          \n        \n        \n          Année\n          \n        \n        \n          Marque\n          \n        \n        \n          Époque (Consoles)\n          \n        \n      \n    \n    \n      0Produits\n      _Sources\n      _Années\n      _MAJ\n    \n    \n      🛒 La Caisse 0\n      \n    \n  \n  \n    \n      Catalogue\n      0 produits\n      Trier\n      \n        Pertinence\n        Marque A_Z\n        Prix croissant\n        Prix décroissant\n      \n    \n    \n  \n\n\n\n\n  \n    \n      \n        \n        \n        \n      \n      ×",
      en: "0\n    \n    Rayons\n    Crédits\n    Caisse admin\n    \n      \n      Cube\n    \n  \n\n\n  \n    \n      Recherche\n      \n        \n        \n      \n    \n    \n      🤖 Agent IA — Référence exacte\n      \n        \n      \n      Identifier + Aperçu\n      \n    \n    \n      Filtres\n      \n        \n          Catégorie\n          \n        \n        \n          Année\n          \n        \n        \n          Marque\n          \n        \n        \n          Époque (Consoles)\n          \n        \n      \n    \n    \n      0Produits\n      _Sources\n      _Années\n      _MAJ\n    \n    \n      🛒 La Caisse 0\n      \n    \n  \n  \n    \n      Catalogue\n      0 produits\n      Trier\n      \n        Pertinence\n        Marque A_Z\n        Prix croissant\n        Prix décroissant\n      \n    \n    \n  \n\n\n\n\n  \n    \n      \n        \n        \n        \n      \n      ×",
    },
    "kifftech_11_rayons": {
      fr: "11 rayons",
      en: "11 rayons",
    },
    "kifftech_173": {
      fr: "173",
      en: "173",
    },
    "kifftech_173_objets": {
      fr: "173 objets",
      en: "173 objets",
    },
    "kifftech_173_objets_11_rayons_2020_2026_modles_wi": {
      fr: "173 objets\n        11 rayons\n        2020 → 2026 modèles\n        Wikimedia visuels libres\n      \n    \n    \n      Tout le catalogue →",
      en: "173 objets\n        11 rayons\n        2020 → 2026 modèles\n        Wikimedia visuels libres\n      \n    \n    \n      Tout le catalogue →",
    },
    "kifftech_1_322_": {
      fr: "1 322 €",
      en: "1 322 €",
    },
    "kifftech_1_469_": {
      fr: "1 469 €",
      en: "1 469 €",
    },
    "kifftech_1_469_1_322_prix_kifftech_10_": {
      fr: "1 469 €\n        1 322 €\n        Prix KiffTech −10 %",
      en: "1 469 €\n        1 322 €\n        Prix KiffTech −10 %",
    },
    "kifftech_1_semaine_5_semaines": {
      fr: "1 semaine à 5 semaines",
      en: "1 semaine à 5 semaines",
    },
    "kifftech_2020_2026_modles": {
      fr: "2020 → 2026 modèles",
      en: "2020 → 2026 modèles",
    },
    "kifftech__keffstation_cube": {
      fr: "← KeffStation / Cube",
      en: "← KeffStation / Cube",
    },
    "kifftech__kifftech_caisse_amp_paiements": {
      fr: "💰 KiffTech — Caisse &amp; Paiements",
      en: "💰 KiffTech — Caisse &amp; Paiements",
    },
    "kifftech__prcdents": {
      fr: "‹ Précédents",
      en: "‹ Précédents",
    },
    "kifftech__propos": {
      fr: "À propos",
      en: "À propos",
    },
    "kifftech__propos_de_kifftech": {
      fr: "À propos de KiffTech",
      en: "À propos de KiffTech",
    },
    "kifftech__propos_de_kifftech_kifftech_est_une_pla": {
      fr: "À propos de KiffTech\n      KiffTech est une plateforme de l'organisation KeffStation. Elle rassemble des objets connectés, des gadgets high_tech et des accessoires électroniques, avec un fonctionnement différent des boutiques classiques.\n\n      Des prix officiels faciles à trouver ailleurs\n      Les prix officiels des constructeurs et les promotions ponctuelles se retrouvent facilement dans une multitude de boutiques en ligne. Chez KiffTech, nous ne cherchons pas à aligner ces prix visibles partout.\n\n      Notre modèle : achat en file d'attente\n      Quand vous passez commande sur KiffTech, votre article entre dans une file d'attente de 1 jour à 1 semaine avant envoi du colis. Ce délai nous permet de regrouper plusieurs demandes par produit ou par lot de produits, puis de négocier avec nos fournisseurs officiels grossistes un pourcentage de promotion plus élevé que sur le prix public.\n\n      Délais et compensation\n      Le délai de livraison estimé est de 1 semaine à 5 semaines selon le produit et le volume du colis. Si le délai de livraison annoncé est dépassé, un remboursement partiel est appliqué.\n\n      \n        Transparence : nous n'inventons aucun prix, aucune remise et aucune garantie. Les promotions dépendent des accords conclus avec les fournisseurs et peuvent varier d'un produit à l'autre. Les délais sont des estimations, pas des engagements contractuels.\n      \n\n      Découvrir le catalogue\n      Retournez aux rayons KiffTech",
      en: "À propos de KiffTech\n      KiffTech est une plateforme de l'organisation KeffStation. Elle rassemble des objets connectés, des gadgets high_tech et des accessoires électroniques, avec un fonctionnement différent des boutiques classiques.\n\n      Des prix officiels faciles à trouver ailleurs\n      Les prix officiels des constructeurs et les promotions ponctuelles se retrouvent facilement dans une multitude de boutiques en ligne. Chez KiffTech, nous ne cherchons pas à aligner ces prix visibles partout.\n\n      Notre modèle : achat en file d'attente\n      Quand vous passez commande sur KiffTech, votre article entre dans une file d'attente de 1 jour à 1 semaine avant envoi du colis. Ce délai nous permet de regrouper plusieurs demandes par produit ou par lot de produits, puis de négocier avec nos fournisseurs officiels grossistes un pourcentage de promotion plus élevé que sur le prix public.\n\n      Délais et compensation\n      Le délai de livraison estimé est de 1 semaine à 5 semaines selon le produit et le volume du colis. Si le délai de livraison annoncé est dépassé, un remboursement partiel est appliqué.\n\n      \n        Transparence : nous n'inventons aucun prix, aucune remise et aucune garantie. Les promotions dépendent des accords conclus avec les fournisseurs et peuvent varier d'un produit à l'autre. Les délais sont des estimations, pas des engagements contractuels.\n      \n\n      Découvrir le catalogue\n      Retournez aux rayons KiffTech",
    },
    "kifftech__retour_au_catalogue": {
      fr: "← Retour au catalogue",
      en: "← Retour au catalogue",
    },
    "kifftech__retour_catalogue": {
      fr: "← Retour catalogue",
      en: "← Retour catalogue",
    },
    "kifftech__tous_les_objets_le_catalogue_complet_to": {
      fr: "+\n    \n      Tous les objets\n      Le catalogue complet, tous rayons confondus — derniers gadgets 2024_2026 inclus.\n    \n    173\n    ↗",
      en: "+\n    \n      Tous les objets\n      Le catalogue complet, tous rayons confondus — derniers gadgets 2024_2026 inclus.\n    \n    173\n    ↗",
    },
    "kifftech__vider_lhistorique": {
      fr: "🗑️ Vider l'historique",
      en: "🗑️ Vider l'historique",
    },
    "kifftech_ac58jpg_magic_keyboard_2_visuel_magic_ke": {
      fr: "ac58.jpg — Magic Keyboard 2, visuel Magic Keyboard US\n        File:Apple Magic Keyboard _ US.jpg\n        CC (Commons)",
      en: "ac58.jpg — Magic Keyboard 2, visuel Magic Keyboard US\n        File:Apple Magic Keyboard _ US.jpg\n        CC (Commons)",
    },
    "kifftech_ac60jpg_mx_keys_s_visuel_mx_keys_filelog": {
      fr: "ac60.jpg — MX Keys S, visuel MX Keys\n        File:Logitech MX Keys YR0073 Wireless Keyboard.jpg\n        CC (Commons)",
      en: "ac60.jpg — MX Keys S, visuel MX Keys\n        File:Logitech MX Keys YR0073 Wireless Keyboard.jpg\n        CC (Commons)",
    },
    "kifftech_ac66jpg_magic_mouse_filemagic_mousejpg_c": {
      fr: "ac66.jpg — Magic Mouse\n        File:Magic Mouse.jpg\n        CC (Commons)",
      en: "ac66.jpg — Magic Mouse\n        File:Magic Mouse.jpg\n        CC (Commons)",
    },
    "kifftech_ac67jpg_mx_master_3s_filelogitech_mx_mas": {
      fr: "ac67.jpg — MX Master 3S\n        File:Logitech MX Master 3S HS03.jpg\n        CC (Commons)",
      en: "ac67.jpg — MX Master 3S\n        File:Logitech MX Master 3S HS03.jpg\n        CC (Commons)",
    },
    "kifftech_ac71jpg_g_pro_x_superlight_2_rose_filelo": {
      fr: "ac71.jpg — G Pro X Superlight 2, rose\n        File:Logitech Pro X Superlight 2 sample 20231216.jpg\n        CC (Commons)",
      en: "ac71.jpg — G Pro X Superlight 2, rose\n        File:Logitech Pro X Superlight 2 sample 20231216.jpg\n        CC (Commons)",
    },
    "kifftech_ac84jpg_t7_shield_1to_visuel_face_avant_": {
      fr: "ac84.jpg — T7 Shield 1To, visuel face avant 4TB\n        File:SAMSUNG PROTABLE SSD T7 SHIELD 4TB FRONT SIDE.jpg\n        CC (Commons)",
      en: "ac84.jpg — T7 Shield 1To, visuel face avant 4TB\n        File:SAMSUNG PROTABLE SSD T7 SHIELD 4TB FRONT SIDE.jpg\n        CC (Commons)",
    },
    "kifftech_accueil": {
      fr: "Accueil",
      en: "Accueil",
    },
    "kifftech_actions": {
      fr: "Actions",
      en: "Actions",
    },
    "kifftech_agent_de_veille": {
      fr: "Agent de Veille",
      en: "Agent de Veille",
    },
    "kifftech_agent_de_veille_0produits_0sources_maj_0": {
      fr: "Agent de Veille\n\n0Produits\n0Sources\n—MAJ\n0%Couverture\n\n\n\n\n\nRecherche & Filtres\n\n\n\n\n\n\n\n\n\n\n\n\n\nSources de Données\n\n\n\n\n\nActions\n\nLancer la veille\nExporter JSON\nVider le cache\n\n\n\n\n\nKiffTech Club\n\n\n\n1€/jour (≈30€/mois) • Sans engagement\n• _10% à _21% selon ancienneté\n• Livraison toujours offerte\n• Accès priorité nouveautés\n\n\n\n\n\nLa Caisse 0\n\n\n\n\n\n\n\n0 produits\nTrier les produits\n\nPertinence\nMarque A_Z\nPrix croissant\nPrix décroissant\n\n\n\n‹ Précédents\n\n\n\nSuivants ›\n\n\n\n\n\n\n\n\n\n\n×",
      en: "Agent de Veille\n\n0Produits\n0Sources\n—MAJ\n0%Couverture\n\n\n\n\n\nRecherche & Filtres\n\n\n\n\n\n\n\n\n\n\n\n\n\nSources de Données\n\n\n\n\n\nActions\n\nLancer la veille\nExporter JSON\nVider le cache\n\n\n\n\n\nKiffTech Club\n\n\n\n1€/jour (≈30€/mois) • Sans engagement\n• _10% à _21% selon ancienneté\n• Livraison toujours offerte\n• Accès priorité nouveautés\n\n\n\n\n\nLa Caisse 0\n\n\n\n\n\n\n\n0 produits\nTrier les produits\n\nPertinence\nMarque A_Z\nPrix croissant\nPrix décroissant\n\n\n\n‹ Précédents\n\n\n\nSuivants ›\n\n\n\n\n\n\n\n\n\n\n×",
    },
    "kifftech_agent_ia": {
      fr: "AGENT IA",
      en: "AGENT IA",
    },
    kifftech_airpods_3jpg_apple_airpods_3_fileairpods: {
      fr: "airpods_3.jpg — Apple AirPods 3\n        File:AirPods 3.jpg\n        CC0",
      en: "airpods_3.jpg — Apple AirPods 3\n        File:AirPods 3.jpg\n        CC0",
    },
    kifftech_airpods_maxjpg_apple_airpods_max_fileair: {
      fr: "airpods_max.jpg — Apple AirPods Max\n        File:AirPods Max black.jpg\n        CC BY_SA 4.0",
      en: "airpods_max.jpg — Apple AirPods Max\n        File:AirPods Max black.jpg\n        CC BY_SA 4.0",
    },
    kifftech_airpods_pro_3jpg_apple_airpods_pro_3_fil: {
      fr: "airpods_pro_3.jpg — Apple AirPods Pro 3\n        File:AirPods Pro 3 in weiß.jpg\n        CC BY_SA 4.0",
      en: "airpods_pro_3.jpg — Apple AirPods Pro 3\n        File:AirPods Pro 3 in weiß.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_ajouter_la_caisse": {
      fr: "Ajouter à la caisse",
      en: "Ajouter à la caisse",
    },
    kifftech_analogue_pocketjpg_analogue_pocket_filea: {
      fr: "analogue_pocket.jpg — Analogue Pocket\n        File:Analogue Pocket in Yellow (53367343185).jpg\n        CC BY_SA 2.0",
      en: "analogue_pocket.jpg — Analogue Pocket\n        File:Analogue Pocket in Yellow (53367343185).jpg\n        CC BY_SA 2.0",
    },
    "kifftech_anne": {
      fr: "Année",
      en: "Année",
    },
    kifftech_apple_tv_4kjpg_apple_tv_4k_2022_fileappl: {
      fr: "apple_tv_4k.jpg — Apple TV 4K (2022)\n        File:Apple TV 4K (3rd Generation, 2022) with Siri Remote (cropped).jpg\n        CC BY_SA 4.0",
      en: "apple_tv_4k.jpg — Apple TV 4K (2022)\n        File:Apple TV 4K (3rd Generation, 2022) with Siri Remote (cropped).jpg\n        CC BY_SA 4.0",
    },
    kifftech_apple_watch_ultra_3jpg_apple_watch_ultra: {
      fr: "apple_watch_ultra_3.jpg — Apple Watch Ultra 3\n        File:Apple Watch Ultra 3 Ti Ocean Band (2026) 03.jpg\n        CC BY_SA 4.0",
      en: "apple_watch_ultra_3.jpg — Apple Watch Ultra 3\n        File:Apple Watch Ultra 3 Ti Ocean Band (2026) 03.jpg\n        CC BY_SA 4.0",
    },
    kifftech_arduino_uno_r4jpg_arduino_uno_r4_fileard: {
      fr: "arduino_uno_r4.jpg — Arduino Uno R4\n        File:Arduino UNO R4 WiFi.jpg\n        CC BY_SA 4.0",
      en: "arduino_uno_r4.jpg — Arduino Uno R4\n        File:Arduino UNO R4 WiFi.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_aw10jpg_galaxy_watch_7_44mm_filegalaxy_w": {
      fr: "aw10.jpg — Galaxy Watch 7 44mm\n        File:Galaxy Watch 7.jpg\n        CC BY_SA 4.0",
      en: "aw10.jpg — Galaxy Watch 7 44mm\n        File:Galaxy Watch 7.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_aw3jpg_airpods_pro_2_fileairpods_pro_2jp": {
      fr: "aw3.jpg — AirPods Pro 2\n        File:AirPods Pro 2.jpg\n        CC BY_SA 4.0",
      en: "aw3.jpg — AirPods Pro 2\n        File:AirPods Pro 2.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_aw6jpg_galaxy_buds_3_pro_visuel_rapproch": {
      fr: "aw6.jpg — Galaxy Buds 3 Pro, visuel rapproché Buds2 Pro\n        File:Samsung Galaxy Buds2 Pro (Graphite) (3).jpg\n        CC (Commons)",
      en: "aw6.jpg — Galaxy Buds 3 Pro, visuel rapproché Buds2 Pro\n        File:Samsung Galaxy Buds2 Pro (Graphite) (3).jpg\n        CC (Commons)",
    },
    "kifftech_aw9bpng_logo_apple_watch_ultra_2_fileapp": {
      fr: "aw9b.png — logo Apple Watch Ultra 2\n        File:Apple Watch Ultra 2 (logo).svg\n        CC BY_SA 4.0",
      en: "aw9b.png — logo Apple Watch Ultra 2\n        File:Apple Watch Ultra 2 (logo).svg\n        CC BY_SA 4.0",
    },
    "kifftech_aw9jpg_apple_watch_ultra_gamme_ultra_2_f": {
      fr: "aw9.jpg — Apple Watch Ultra, gamme Ultra 2\n        File:Apple Watch Ultra 2.jpg\n        CC BY_SA 4.0",
      en: "aw9.jpg — Apple Watch Ultra, gamme Ultra 2\n        File:Apple Watch Ultra 2.jpg\n        CC BY_SA 4.0",
    },
    kifftech_beats_fit_projpg_beats_fit_pro_filebeats: {
      fr: "beats_fit_pro.jpg — Beats Fit Pro\n        File:Beats Fit Pro _ 1.jpg\n        CC BY_SA 4.0",
      en: "beats_fit_pro.jpg — Beats Fit Pro\n        File:Beats Fit Pro _ 1.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_caisse_admin": {
      fr: "Caisse admin",
      en: "Caisse admin",
    },
    kifftech_canon_eos_r5jpg_canon_eos_r5_filecanon_e: {
      fr: "canon_eos_r5.jpg — Canon EOS R5\n        File:Canon EOS R5 (cropped).jpg\n        CC BY_SA 4.0",
      en: "canon_eos_r5.jpg — Canon EOS R5\n        File:Canon EOS R5 (cropped).jpg\n        CC BY_SA 4.0",
    },
    "kifftech_caractristiques": {
      fr: "Caractéristiques",
      en: "Caractéristiques",
    },
    "kifftech_catalogue": {
      fr: "Catalogue",
      en: "Catalogue",
    },
    "kifftech_catalogue_complet_": {
      fr: "Catalogue complet ↗",
      en: "Catalogue complet ↗",
    },
    "kifftech_catgorie": {
      fr: "Catégorie",
      en: "Catégorie",
    },
    "kifftech_cc0": {
      fr: "CC0",
      en: "CC0",
    },
    kifftech_cc_by_sa_20: {
      fr: "CC BY_SA 2.0",
      en: "CC BY_SA 2.0",
    },
    kifftech_cc_by_sa_30_au: {
      fr: "CC BY_SA 3.0 au",
      en: "CC BY_SA 3.0 au",
    },
    kifftech_cc_by_sa_30_de: {
      fr: "CC BY_SA 3.0 de",
      en: "CC BY_SA 3.0 de",
    },
    kifftech_cc_by_sa_40: {
      fr: "CC BY_SA 4.0",
      en: "CC BY_SA 4.0",
    },
    "kifftech_cc_by_20": {
      fr: "CC BY 2.0",
      en: "CC BY 2.0",
    },
    "kifftech_cc_by_30": {
      fr: "CC BY 3.0",
      en: "CC BY 3.0",
    },
    "kifftech_cc_by_40": {
      fr: "CC BY 4.0",
      en: "CC BY 4.0",
    },
    "kifftech_cc_commons": {
      fr: "CC (Commons)",
      en: "CC (Commons)",
    },
    "kifftech_ce7jpg_samsung_990_pro_visuel_4tb_pour_m": {
      fr: "ce7.jpg — Samsung 990 PRO, visuel 4TB pour modèle 2TB\n        File:SAMSUNG M.2 NVMe SSD 990 PRO 4TB.jpg\n        CC BY_SA 4.0",
      en: "ce7.jpg — Samsung 990 PRO, visuel 4TB pour modèle 2TB\n        File:SAMSUNG M.2 NVMe SSD 990 PRO 4TB.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_co10jpg_switch_2_filenintendo_switch_2_i": {
      fr: "co10.jpg — Switch 2\n        File:Nintendo Switch 2 in Docking Console.jpg\n        CC (Commons)",
      en: "co10.jpg — Switch 2\n        File:Nintendo Switch 2 in Docking Console.jpg\n        CC (Commons)",
    },
    "kifftech_co11png_ps5_slim_visuel_rapproch_ps5_dig": {
      fr: "co11.png — PS5 Slim, visuel rapproché PS5 Digital Edition\n        File:PS5DigitalEdition.png\n        CC (Commons)",
      en: "co11.png — PS5 Slim, visuel rapproché PS5 Digital Edition\n        File:PS5DigitalEdition.png\n        CC (Commons)",
    },
    "kifftech_co13jpg_xbox_series_x_manette_filexbox_s": {
      fr: "co13.jpg — Xbox Series X + manette\n        File:Xbox series X (50648118708).jpg\n        CC (Commons)",
      en: "co13.jpg — Xbox Series X + manette\n        File:Xbox series X (50648118708).jpg\n        CC (Commons)",
    },
    "kifftech_co15png_steam_deck_de_face_linuxsteamos_": {
      fr: "co15.png — Steam Deck de face, Linux/SteamOS\n        File:Steam Deck (front).png\n        CC (Commons)",
      en: "co15.png — Steam Deck de face, Linux/SteamOS\n        File:Steam Deck (front).png\n        CC (Commons)",
    },
    "kifftech_co16png_rog_ally_tenu_en_main_capture_vi": {
      fr: "co16.png — ROG Ally tenu en main, capture vidéo\n        File:ASUS ROG_Handheld_Leistungsanalyse (Geekerwan) 26.png\n        CC (Commons)",
      en: "co16.png — ROG Ally tenu en main, capture vidéo\n        File:ASUS ROG_Handheld_Leistungsanalyse (Geekerwan) 26.png\n        CC (Commons)",
    },
    kifftech_co2jpg_super_nintendo_filenintendo_super: {
      fr: "co2.jpg — Super Nintendo\n        File:Nintendo_Super_NES_Console_101_FL.jpg\n        CC (Commons)",
      en: "co2.jpg — Super Nintendo\n        File:Nintendo_Super_NES_Console_101_FL.jpg\n        CC (Commons)",
    },
    kifftech_co3jpg_sega_mega_drive_filesega_mega_dri: {
      fr: "co3.jpg — Sega Mega Drive\n        File:Sega_Mega_Drive_JP_Mk1_Console_Set.jpg\n        CC (Commons)",
      en: "co3.jpg — Sega Mega Drive\n        File:Sega_Mega_Drive_JP_Mk1_Console_Set.jpg\n        CC (Commons)",
    },
    "kifftech_co4jpg_game_boy_visuel_rapproch_game_boy": {
      fr: "co4.jpg — Game Boy, visuel rapproché Game Boy Advance\n        File:Nintendo_Game_Boy_Advance_Milky_Blue_FL.jpg\n        CC (Commons)",
      en: "co4.jpg — Game Boy, visuel rapproché Game Boy Advance\n        File:Nintendo_Game_Boy_Advance_Milky_Blue_FL.jpg\n        CC (Commons)",
    },
    kifftech_co5png_playstation_manette_filepsx_conso: {
      fr: "co5.png — PlayStation + manette\n        File:PSX_Console_wController.png\n        CC (Commons)",
      en: "co5.png — PlayStation + manette\n        File:PSX_Console_wController.png\n        CC (Commons)",
    },
    kifftech_co6jpg_nintendo_64_manette_filenintendo_: {
      fr: "co6.jpg — Nintendo 64 + manette\n        File:Nintendo_64_wController_L.jpg\n        CC (Commons)",
      en: "co6.jpg — Nintendo 64 + manette\n        File:Nintendo_64_wController_L.jpg\n        CC (Commons)",
    },
    kifftech_co7png_sega_dreamcast_filesega_dreamcast: {
      fr: "co7.png — Sega Dreamcast\n        File:Sega_dreamcast_set.png\n        CC (Commons)",
      en: "co7.png — Sega Dreamcast\n        File:Sega_dreamcast_set.png\n        CC (Commons)",
    },
    kifftech_co8jpg_gamecube_filenintendo_gamecube_co: {
      fr: "co8.jpg — GameCube\n        File:Nintendo_GameCube_Console_BR.jpg\n        CC (Commons)",
      en: "co8.jpg — GameCube\n        File:Nintendo_GameCube_Console_BR.jpg\n        CC (Commons)",
    },
    "kifftech_co9png_switch_oled_docke_filenintendo_sw": {
      fr: "co9.png — Switch OLED, dockée\n        File:Nintendo Switch – OLED_Modell mit gedockter Konsole 20230506 HOF01624 RAW_Export.png\n        CC (Commons)",
      en: "co9.png — Switch OLED, dockée\n        File:Nintendo Switch – OLED_Modell mit gedockter Konsole 20230506 HOF01624 RAW_Export.png\n        CC (Commons)",
    },
    "kifftech_countsrid_0": {
      fr: "${COUNTS[r.id] || 0}",
      en: "${COUNTS[r.id] || 0}",
    },
    "kifftech_cp1jpg_macbook_pro_m3_gamme_16_m3_max_fi": {
      fr: "cp1.jpg — MacBook Pro M3, gamme 16 M3 Max\n        File:Apple MacBook Pro (M3).jpg\n        CC BY_SA 4.0",
      en: "cp1.jpg — MacBook Pro M3, gamme 16 M3 Max\n        File:Apple MacBook Pro (M3).jpg\n        CC BY_SA 4.0",
    },
    "kifftech_cp2jpg_dell_xps_15_gamme_xps_1315_filede": {
      fr: "cp2.jpg — Dell XPS 15, gamme XPS 13/15\n        File:DELL XPS 13 and 15 (37080596413).jpg\n        CC (Commons)",
      en: "cp2.jpg — Dell XPS 15, gamme XPS 13/15\n        File:DELL XPS 13 and 15 (37080596413).jpg\n        CC (Commons)",
    },
    "kifftech_cp3jpg_asus_rog_zephyrus_g14_fileasus_ro": {
      fr: "cp3.jpg — ASUS ROG Zephyrus G14\n        File:ASUS ROG Zephyrus 2026_08_15 G14.jpg\n        CC BY_SA 4.0",
      en: "cp3.jpg — ASUS ROG Zephyrus G14\n        File:ASUS ROG Zephyrus 2026_08_15 G14.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_cp6jpg_framework_laptop_13_amd_fileframe": {
      fr: "cp6.jpg — Framework Laptop 13 AMD\n        File:Framework laptop AMD 13.jpg\n        CC BY_SA 4.0",
      en: "cp6.jpg — Framework Laptop 13 AMD\n        File:Framework laptop AMD 13.jpg\n        CC BY_SA 4.0",
    },
    kifftech_cp9jpg_lg_gram_17_filelg_vietnam_laptop_: {
      fr: "cp9.jpg — LG Gram 17\n        File:Lg_vietnam laptop lg_gram 17.jpg\n        CC BY_SA 4.0",
      en: "cp9.jpg — LG Gram 17\n        File:Lg_vietnam laptop lg_gram 17.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_crdits": {
      fr: "Crédits",
      en: "Crédits",
    },
    "kifftech_crdits_photos": {
      fr: "Crédits photos",
      en: "Crédits photos",
    },
    "kifftech_crdits_visuels": {
      fr: "Crédits visuels",
      en: "Crédits visuels",
    },
    "kifftech_crdits_visuels_catalogue_keffstation": {
      fr: "Crédits visuels\n      Catalogue\n      KeffStation",
      en: "Crédits visuels\n      Catalogue\n      KeffStation",
    },
    "kifftech_cube": {
      fr: "Cube",
      en: "Cube",
    },
    "kifftech_dcouvrir_le_catalogue": {
      fr: "Découvrir le catalogue",
      en: "Découvrir le catalogue",
    },
    "kifftech_des_prix_officiels_faciles_trouver_aille": {
      fr: "Des prix officiels faciles à trouver ailleurs",
      en: "Des prix officiels faciles à trouver ailleurs",
    },
    kifftech_dji_air_2sjpg_dji_air_2s_filedji_air_2sj: {
      fr: "dji_air_2s.jpg — DJI Air 2S\n        File:DJI Air 2S.jpg\n        CC BY_SA 3.0 au",
      en: "dji_air_2s.jpg — DJI Air 2S\n        File:DJI Air 2S.jpg\n        CC BY_SA 3.0 au",
    },
    kifftech_dji_air_3jpg_dji_air_3_filetemporaerhaus: {
      fr: "dji_air_3.jpg — DJI Air 3\n        File:Temporaerhaus dji air 3 flug.jpg\n        CC BY_SA 4.0",
      en: "dji_air_3.jpg — DJI Air 3\n        File:Temporaerhaus dji air 3 flug.jpg\n        CC BY_SA 4.0",
    },
    kifftech_dji_mavic_3jpg_dji_mavic_3_filedji_mavic: {
      fr: "dji_mavic_3.jpg — DJI Mavic 3\n        File:DJI Mavic 3.jpg\n        CC BY_SA 4.0",
      en: "dji_mavic_3.jpg — DJI Mavic 3\n        File:DJI Mavic 3.jpg\n        CC BY_SA 4.0",
    },
    kifftech_dji_mini_2jpg_dji_mini_2_filedji_mini_2j: {
      fr: "dji_mini_2.jpg — DJI Mini 2\n        File:DJI Mini 2.jpg\n        CC BY_SA 4.0",
      en: "dji_mini_2.jpg — DJI Mini 2\n        File:DJI Mini 2.jpg\n        CC BY_SA 4.0",
    },
    kifftech_dji_mini_3_projpg_dji_mini_3_pro_filedji: {
      fr: "dji_mini_3_pro.jpg — DJI Mini 3 Pro\n        File:DJI Mini 3 Pro.jpg\n        CC BY_SA 4.0",
      en: "dji_mini_3_pro.jpg — DJI Mini 3 Pro\n        File:DJI Mini 3 Pro.jpg\n        CC BY_SA 4.0",
    },
    kifftech_dji_mini_4_projpg_dji_mini_4_pro_file202: {
      fr: "dji_mini_4_pro.jpg — DJI Mini 4 Pro\n        File:2024 Dron DJI Mini 4 Pro (02).jpg\n        CC BY_SA 4.0",
      en: "dji_mini_4_pro.jpg — DJI Mini 4 Pro\n        File:2024 Dron DJI Mini 4 Pro (02).jpg\n        CC BY_SA 4.0",
    },
    "kifftech_dlais_et_compensation": {
      fr: "Délais et compensation",
      en: "Délais et compensation",
    },
    "kifftech_dobjets": {
      fr: "d’objets",
      en: "d’objets",
    },
    "kifftech_dtail_de_la_commande": {
      fr: "Détail de la commande",
      en: "Détail de la commande",
    },
    kifftech_echo_dot_5_clockjpg_amazon_echo_dot_5_wi: {
      fr: "echo_dot_5_clock.jpg — Amazon Echo Dot 5 with Clock\n        File:Amazon Echo Dot 5 mit Uhr.jpg\n        CC BY_SA 4.0",
      en: "echo_dot_5_clock.jpg — Amazon Echo Dot 5 with Clock\n        File:Amazon Echo Dot 5 mit Uhr.jpg\n        CC BY_SA 4.0",
    },
    kifftech_echo_show_5jpg_amazon_echo_show_5_fileec: {
      fr: "echo_show_5.jpg — Amazon Echo Show 5\n        File:Echo Show 5.jpg\n        CC BY_SA 4.0",
      en: "echo_show_5.jpg — Amazon Echo Show 5\n        File:Echo Show 5.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_exporter_json": {
      fr: "Exporter JSON",
      en: "Exporter JSON",
    },
    "kifftech_file20230729_s9jpg": {
      fr: "File:20230729 삼성 갤럭시 탭 S9.jpg",
      en: "File:20230729 삼성 갤럭시 탭 S9.jpg",
    },
    "kifftech_file2024_dron_dji_mini_4_pro_02jpg": {
      fr: "File:2024 Dron DJI Mini 4 Pro (02).jpg",
      en: "File:2024 Dron DJI Mini 4 Pro (02).jpg",
    },
    "kifftech_file_dattente_de_1_jour_1_semaine_avant_": {
      fr: "file d'attente de 1 jour à 1 semaine avant envoi du colis",
      en: "file d'attente de 1 jour à 1 semaine avant envoi du colis",
    },
    kifftech_fileabout_ipad_air_13_inch_m2jpg: {
      fr: "File:About iPad Air 13_inch (M2).jpg",
      en: "File:About iPad Air 13_inch (M2).jpg",
    },
    kifftech_fileabout_ipad_pro_11_inch_m4jpg: {
      fr: "File:About iPad Pro 11_inch (M4).jpg",
      en: "File:About iPad Pro 11_inch (M4).jpg",
    },
    kifftech_fileabout_ipad_pro_13_inch_m4jpg: {
      fr: "File:About iPad Pro 13_inch (M4).jpg",
      en: "File:About iPad Pro 13_inch (M4).jpg",
    },
    "kifftech_fileairpods_3jpg": {
      fr: "File:AirPods 3.jpg",
      en: "File:AirPods 3.jpg",
    },
    "kifftech_fileairpods_max_blackjpg": {
      fr: "File:AirPods Max black.jpg",
      en: "File:AirPods Max black.jpg",
    },
    "kifftech_fileairpods_pro_2jpg": {
      fr: "File:AirPods Pro 2.jpg",
      en: "File:AirPods Pro 2.jpg",
    },
    "kifftech_fileairpods_pro_3_in_weijpg": {
      fr: "File:AirPods Pro 3 in weiß.jpg",
      en: "File:AirPods Pro 3 in weiß.jpg",
    },
    "kifftech_fileamazon_echo_dot_5_mit_uhrjpg": {
      fr: "File:Amazon Echo Dot 5 mit Uhr.jpg",
      en: "File:Amazon Echo Dot 5 mit Uhr.jpg",
    },
    kifftech_fileamd_radeon_rx6800xt_from2020year_fro: {
      fr: "File:Amd_radeon_rx6800xt_from2020year_front.jpg",
      en: "File:Amd_radeon_rx6800xt_from2020year_front.jpg",
    },
    "kifftech_fileamd_ryzen_7_5800x3djpg": {
      fr: "File:AMD Ryzen 7 5800X3D.jpg",
      en: "File:AMD Ryzen 7 5800X3D.jpg",
    },
    "kifftech_fileanalogue_pocket_in_yellow_5336734318": {
      fr: "File:Analogue Pocket in Yellow (53367343185).jpg",
      en: "File:Analogue Pocket in Yellow (53367343185).jpg",
    },
    kifftech_fileanymal_robot_inspection_power_gridjp: {
      fr: "File:Anymal_robot_inspection_power_grid.jpg",
      en: "File:Anymal_robot_inspection_power_grid.jpg",
    },
    "kifftech_fileapple_homepod_minijpg": {
      fr: "File:Apple HomePod mini.jpg",
      en: "File:Apple HomePod mini.jpg",
    },
    "kifftech_fileapple_macbook_pro_m3jpg": {
      fr: "File:Apple MacBook Pro (M3).jpg",
      en: "File:Apple MacBook Pro (M3).jpg",
    },
    kifftech_fileapple_magic_keyboard___usjpg: {
      fr: "File:Apple Magic Keyboard _ US.jpg",
      en: "File:Apple Magic Keyboard _ US.jpg",
    },
    "kifftech_fileapple_tv_4k_3rd_generation_2022_with": {
      fr: "File:Apple TV 4K (3rd Generation, 2022) with Siri Remote (cropped).jpg",
      en: "File:Apple TV 4K (3rd Generation, 2022) with Siri Remote (cropped).jpg",
    },
    "kifftech_fileapple_vision_pro_on_displayjpg": {
      fr: "File:Apple Vision Pro on display.jpg",
      en: "File:Apple Vision Pro on display.jpg",
    },
    "kifftech_fileapple_watch_series_10jpg": {
      fr: "File:Apple Watch Series 10.jpg",
      en: "File:Apple Watch Series 10.jpg",
    },
    "kifftech_fileapple_watch_series_7_january_2022_02": {
      fr: "File:Apple Watch Series 7; January 2022 (02).jpg",
      en: "File:Apple Watch Series 7; January 2022 (02).jpg",
    },
    "kifftech_fileapple_watch_series_8jpg": {
      fr: "File:Apple Watch Series 8.jpg",
      en: "File:Apple Watch Series 8.jpg",
    },
    "kifftech_fileapple_watch_series_9_croppedjpg": {
      fr: "File:Apple Watch Series 9 (cropped).jpg",
      en: "File:Apple Watch Series 9 (cropped).jpg",
    },
    "kifftech_fileapple_watch_ultra_2_logosvg": {
      fr: "File:Apple Watch Ultra 2 (logo).svg",
      en: "File:Apple Watch Ultra 2 (logo).svg",
    },
    "kifftech_fileapple_watch_ultra_2jpg": {
      fr: "File:Apple Watch Ultra 2.jpg",
      en: "File:Apple Watch Ultra 2.jpg",
    },
    "kifftech_fileapple_watch_ultra_3_ti_ocean_band_20": {
      fr: "File:Apple Watch Ultra 3 Ti Ocean Band (2026) 03.jpg",
      en: "File:Apple Watch Ultra 3 Ti Ocean Band (2026) 03.jpg",
    },
    "kifftech_filearduino_uno_r4_wifijpg": {
      fr: "File:Arduino UNO R4 WiFi.jpg",
      en: "File:Arduino UNO R4 WiFi.jpg",
    },
    kifftech_fileasus_rog_handheld_leistungsanalyse_g: {
      fr: "File:ASUS ROG_Handheld_Leistungsanalyse (Geekerwan) 26.png",
      en: "File:ASUS ROG_Handheld_Leistungsanalyse (Geekerwan) 26.png",
    },
    kifftech_fileasus_rog_zephyrus_2026_08_15_g14jpg: {
      fr: "File:ASUS ROG Zephyrus 2026_08_15 G14.jpg",
      en: "File:ASUS ROG Zephyrus 2026_08_15 G14.jpg",
    },
    "kifftech_fileasus_strix_rtx_4090jpg": {
      fr: "File:Asus Strix RTX 4090.jpg",
      en: "File:Asus Strix RTX 4090.jpg",
    },
    kifftech_fileback_of_iphone_16_pro___2jpg: {
      fr: "File:Back of iPhone 16 Pro _ 2.jpg",
      en: "File:Back of iPhone 16 Pro _ 2.jpg",
    },
    "kifftech_fileback_of_the_ipad_air_4th_generationj": {
      fr: "File:Back of the iPad Air 4th generation.jpg",
      en: "File:Back of the iPad Air 4th generation.jpg",
    },
    "kifftech_fileback_of_the_iphone_13_projpg": {
      fr: "File:Back of the iPhone 13 Pro.jpg",
      en: "File:Back of the iPhone 13 Pro.jpg",
    },
    "kifftech_fileback_of_the_iphone_14_projpg": {
      fr: "File:Back of the iPhone 14 Pro.jpg",
      en: "File:Back of the iPhone 14 Pro.jpg",
    },
    "kifftech_fileback_of_the_samsung_galaxy_a54_5gjpg": {
      fr: "File:Back of the Samsung Galaxy A54 5G.jpg",
      en: "File:Back of the Samsung Galaxy A54 5G.jpg",
    },
    "kifftech_fileback_of_the_samsung_galaxy_s22_ultra": {
      fr: "File:Back of the Samsung Galaxy S22 Ultra.jpg",
      en: "File:Back of the Samsung Galaxy S22 Ultra.jpg",
    },
    "kifftech_fileback_view_of_iphone_14_bluejpg": {
      fr: "File:Back view of iPhone 14 Blue.jpg",
      en: "File:Back view of iPhone 14 Blue.jpg",
    },
    "kifftech_fileback_view_of_iphone_16_ultramarinejp": {
      fr: "File:Back view of iPhone 16 Ultramarine.jpg",
      en: "File:Back view of iPhone 16 Ultramarine.jpg",
    },
    "kifftech_fileback_view_of_samsung_galaxy_s23_ultr": {
      fr: "File:Back view of Samsung Galaxy S23 Ultra Green.jpg",
      en: "File:Back view of Samsung Galaxy S23 Ultra Green.jpg",
    },
    "kifftech_fileback_view_of_samsung_galaxy_s24_ultr": {
      fr: "File:Back view of Samsung Galaxy S24 Ultra Black.jpg",
      en: "File:Back view of Samsung Galaxy S24 Ultra Black.jpg",
    },
    kifftech_filebeats_fit_pro___1jpg: {
      fr: "File:Beats Fit Pro _ 1.jpg",
      en: "File:Beats Fit Pro _ 1.jpg",
    },
    "kifftech_filecanon_eos_r5_croppedjpg": {
      fr: "File:Canon EOS R5 (cropped).jpg",
      en: "File:Canon EOS R5 (cropped).jpg",
    },
    "kifftech_filedell_xps_13_and_15_37080596413jpg": {
      fr: "File:DELL XPS 13 and 15 (37080596413).jpg",
      en: "File:DELL XPS 13 and 15 (37080596413).jpg",
    },
    "kifftech_filedji_air_2sjpg": {
      fr: "File:DJI Air 2S.jpg",
      en: "File:DJI Air 2S.jpg",
    },
    "kifftech_filedji_mavic_3jpg": {
      fr: "File:DJI Mavic 3.jpg",
      en: "File:DJI Mavic 3.jpg",
    },
    "kifftech_filedji_mini_2jpg": {
      fr: "File:DJI Mini 2.jpg",
      en: "File:DJI Mini 2.jpg",
    },
    "kifftech_filedji_mini_3_projpg": {
      fr: "File:DJI Mini 3 Pro.jpg",
      en: "File:DJI Mini 3 Pro.jpg",
    },
    kifftech_filedji_osmo_pocket_3___1jpg: {
      fr: "File:DJI Osmo Pocket 3 _ 1.jpg",
      en: "File:DJI Osmo Pocket 3 _ 1.jpg",
    },
    "kifftech_fileecho_show_5jpg": {
      fr: "File:Echo Show 5.jpg",
      en: "File:Echo Show 5.jpg",
    },
    "kifftech_fileframework_laptop_amd_13jpg": {
      fr: "File:Framework laptop AMD 13.jpg",
      en: "File:Framework laptop AMD 13.jpg",
    },
    "kifftech_filegalaxy_s20png": {
      fr: "File:Galaxy S20.png",
      en: "File:Galaxy S20.png",
    },
    "kifftech_filegalaxy_s26_ultra_lavenderjpg": {
      fr: "File:Galaxy S26 Ultra lavender.jpg",
      en: "File:Galaxy S26 Ultra lavender.jpg",
    },
    "kifftech_filegalaxy_watch_7jpg": {
      fr: "File:Galaxy Watch 7.jpg",
      en: "File:Galaxy Watch 7.jpg",
    },
    "kifftech_filegarmin_forerunner_965jpeg": {
      fr: "File:Garmin Forerunner 965.jpeg",
      en: "File:Garmin Forerunner 965.jpeg",
    },
    kifftech_fileghost_robotics___civitas_group_visio: {
      fr: "File:Ghost Robotics _ Civitas Group Vision 60 robot dog at BSDA 2024.jpg",
      en: "File:Ghost Robotics _ Civitas Group Vision 60 robot dog at BSDA 2024.jpg",
    },
    "kifftech_filegoogle_nest_audiojpg": {
      fr: "File:Google Nest Audio.jpg",
      en: "File:Google Nest Audio.jpg",
    },
    "kifftech_filegoogle_pixel_5_frontjpg": {
      fr: "File:Google Pixel 5 front.jpg",
      en: "File:Google Pixel 5 front.jpg",
    },
    "kifftech_filegoogle_pixel_6_sorta_seafoam_front_b": {
      fr: "File:Google Pixel 6 Sorta Seafoam front bottom_left.jpg",
      en: "File:Google Pixel 6 Sorta Seafoam front bottom_left.jpg",
    },
    "kifftech_filegoogle_pixel_7_20230416_hof00361_raw": {
      fr: "File:Google Pixel 7 20230416 HOF00361 RAW_Export.png",
      en: "File:Google Pixel 7 20230416 HOF00361 RAW_Export.png",
    },
    "kifftech_filegoogle_pixel_8_pro_back_baysvg": {
      fr: "File:Google Pixel 8 Pro back (Bay).svg",
      en: "File:Google Pixel 8 Pro back (Bay).svg",
    },
    "kifftech_filegoogle_pixel_tabletpng": {
      fr: "File:Google Pixel Tablet.png",
      en: "File:Google Pixel Tablet.png",
    },
    "kifftech_filegopro_hero_10_black_with_battery_doo": {
      fr: "File:GoPro Hero 10 Black with battery door open.jpg",
      en: "File:GoPro Hero 10 Black with battery door open.jpg",
    },
    kifftech_filegopro_hero_9_black___frontjpg: {
      fr: "File:GoPro Hero 9 Black _ Front.jpg",
      en: "File:GoPro Hero 9 Black _ Front.jpg",
    },
    kifftech_filegopro_hro_13_black___03jpg: {
      fr: "File:GoPro Héro 13 Black _ 03.jpg",
      en: "File:GoPro Héro 13 Black _ 03.jpg",
    },
    "kifftech_filehonor_magic_6_projpg": {
      fr: "File:Honor Magic 6 Pro.jpg",
      en: "File:Honor Magic 6 Pro.jpg",
    },
    "kifftech_filehuawei_matebook_x_pro_2023jpg": {
      fr: "File:Huawei MateBook X Pro 2023.jpg",
      en: "File:Huawei MateBook X Pro 2023.jpg",
    },
    "kifftech_filehuawei_matepad_projpg": {
      fr: "File:Huawei MatePad Pro.jpg",
      en: "File:Huawei MatePad Pro.jpg",
    },
    "kifftech_filehuawei_p40_pro_frontjpg": {
      fr: "File:HUAWEI P40 Pro Front.jpg",
      en: "File:HUAWEI P40 Pro Front.jpg",
    },
    "kifftech_filehuawei_p60_projpg": {
      fr: "File:Huawei P60 Pro.jpg",
      en: "File:Huawei P60 Pro.jpg",
    },
    kifftech_fileinsta360_one_x2_2jpg: {
      fr: "File:Insta360 One X2_2.jpg",
      en: "File:Insta360 One X2_2.jpg",
    },
    "kifftech_fileintel_cpu_core_i7_12700k_alder_lake_": {
      fr: "File:Intel CPU Core i7 12700K Alder Lake top.jpg",
      en: "File:Intel CPU Core i7 12700K Alder Lake top.jpg",
    },
    "kifftech_fileipad_10png": {
      fr: "File:IPad 10.png",
      en: "File:IPad 10.png",
    },
    "kifftech_fileipad_mini_6_in_handjpg": {
      fr: "File:IPad Mini 6 in hand.jpg",
      en: "File:IPad Mini 6 in hand.jpg",
    },
    kifftech_fileipad_pro_11_inch_m5_silver___backsid: {
      fr: "File:IPad Pro (11_inch, M5, Silver) _ Backside.jpg",
      en: "File:IPad Pro (11_inch, M5, Silver) _ Backside.jpg",
    },
    kifftech_fileiphone_12_product__redpng: {
      fr: "File:Iphone_12_product__red.png",
      en: "File:Iphone_12_product__red.png",
    },
    "kifftech_fileiphone_15_pro_maxpng": {
      fr: "File:IPhone 15 pro max.png",
      en: "File:IPhone 15 pro max.png",
    },
    "kifftech_fileiphone_15_vectorsvg": {
      fr: "File:IPhone 15 Vector.svg",
      en: "File:IPhone 15 Vector.svg",
    },
    "kifftech_fileiphone_16e_blackjpg": {
      fr: "File:IPhone 16e Black.jpg",
      en: "File:IPhone 16e Black.jpg",
    },
    kifftech_fileiphone_17_lavender___backsidejpg: {
      fr: "File:IPhone 17 (Lavender) _ Backside.jpg",
      en: "File:IPhone 17 (Lavender) _ Backside.jpg",
    },
    kifftech_fileiphone_17_pro_2025_12_28jpg: {
      fr: "File:IPhone 17 Pro (2025_12_28).jpg",
      en: "File:IPhone 17 Pro (2025_12_28).jpg",
    },
    kifftech_fileiphone_17_pro_max_cosmic_orange___ba: {
      fr: "File:IPhone 17 Pro Max (Cosmic Orange) _ Backside.jpg",
      en: "File:IPhone 17 Pro Max (Cosmic Orange) _ Backside.jpg",
    },
    kifftech_fileiphone_air_cloud_white___backsidejpg: {
      fr: "File:IPhone Air (Cloud White) _ Backside.jpg",
      en: "File:IPhone Air (Cloud White) _ Backside.jpg",
    },
    "kifftech_filelatest_tesla_optimus_humanoid_robotj": {
      fr: "File:Latest Tesla Optimus Humanoid Robot.jpg",
      en: "File:Latest Tesla Optimus Humanoid Robot.jpg",
    },
    "kifftech_filelenovo_legion_gojpg": {
      fr: "File:Lenovo Legion Go.jpg",
      en: "File:Lenovo Legion Go.jpg",
    },
    kifftech_filelg_vietnam_laptop_lg_gram_17jpg: {
      fr: "File:Lg_vietnam laptop lg_gram 17.jpg",
      en: "File:Lg_vietnam laptop lg_gram 17.jpg",
    },
    "kifftech_filelogitech_mx_keys_yr0073_wireless_key": {
      fr: "File:Logitech MX Keys YR0073 Wireless Keyboard.jpg",
      en: "File:Logitech MX Keys YR0073 Wireless Keyboard.jpg",
    },
    "kifftech_filelogitech_mx_master_3s_hs03jpg": {
      fr: "File:Logitech MX Master 3S HS03.jpg",
      en: "File:Logitech MX Master 3S HS03.jpg",
    },
    "kifftech_filelogitech_pro_x_superlight_2_sample_2": {
      fr: "File:Logitech Pro X Superlight 2 sample 20231216.jpg",
      en: "File:Logitech Pro X Superlight 2 sample 20231216.jpg",
    },
    "kifftech_filem2_macbook_air_starlight_modeljpg": {
      fr: "File:M2 Macbook Air Starlight model.jpg",
      en: "File:M2 Macbook Air Starlight model.jpg",
    },
    "kifftech_filem3_macbook_pro_14_inch_space_grey_mo": {
      fr: "File:M3 Macbook Pro 14 inch Space Grey model.jpg",
      en: "File:M3 Macbook Pro 14 inch Space Grey model.jpg",
    },
    "kifftech_filemac_mini_2020_m1_anschlssejpg": {
      fr: "File:Mac mini 2020 (M1) Anschlüsse.jpg",
      en: "File:Mac mini 2020 (M1) Anschlüsse.jpg",
    },
    "kifftech_filemac_mini_2024_m4jpg": {
      fr: "File:Mac mini 2024 M4.jpg",
      en: "File:Mac mini 2024 M4.jpg",
    },
    kifftech_filemacbook_air_15_inch_m4_silverjpg: {
      fr: "File:MacBook Air (15_inch, M4, Silver).jpg",
      en: "File:MacBook Air (15_inch, M4, Silver).jpg",
    },
    "kifftech_filemacbook_air_m1_silver_pngpng": {
      fr: "File:Macbook Air M1 Silver PNG.png",
      en: "File:Macbook Air M1 Silver PNG.png",
    },
    "kifftech_filemacbook_pro_13_m1_2020jpg": {
      fr: "File:MacBook Pro 13 (M1, 2020).jpg",
      en: "File:MacBook Pro 13 (M1, 2020).jpg",
    },
    kifftech_filemacbook_pro_14_inch_m5_space_blackjp: {
      fr: "File:MacBook Pro (14_inch, M5, Space Black).jpg",
      en: "File:MacBook Pro (14_inch, M5, Space Black).jpg",
    },
    "kifftech_filemagic_mousejpg": {
      fr: "File:Magic Mouse.jpg",
      en: "File:Magic Mouse.jpg",
    },
    "kifftech_filemeta_quest_2_2jpg": {
      fr: "File:Meta quest 2 2.jpg",
      en: "File:Meta quest 2 2.jpg",
    },
    "kifftech_filemeta_quest_3_front_viewjpg": {
      fr: "File:Meta Quest 3 front View.jpg",
      en: "File:Meta Quest 3 front View.jpg",
    },
    "kifftech_filemeta_quest_3s_display_unitjpg": {
      fr: "File:Meta Quest 3S Display Unit.jpg",
      en: "File:Meta Quest 3S Display Unit.jpg",
    },
    "kifftech_filemicrosoft_surface_laptop_7jpg": {
      fr: "File:Microsoft Surface Laptop 7.jpg",
      en: "File:Microsoft Surface Laptop 7.jpg",
    },
    "kifftech_filemicrosoft_surface_projpg": {
      fr: "File:Microsoft Surface Pro.jpg",
      en: "File:Microsoft Surface Pro.jpg",
    },
    kifftech_filemotorola_razr_40_ultra___3jpg: {
      fr: "File:Motorola razr 40 ultra _ 3.jpg",
      en: "File:Motorola razr 40 ultra _ 3.jpg",
    },
    "kifftech_filems_surface_go_3png": {
      fr: "File:MS Surface Go 3.png",
      en: "File:MS Surface Go 3.png",
    },
    "kifftech_filenanoleaf_shapesjpg": {
      fr: "File:Nanoleaf Shapes.jpg",
      en: "File:Nanoleaf Shapes.jpg",
    },
    kifftech_filenintendo_64_wcontroller_ljpg: {
      fr: "File:Nintendo_64_wController_L.jpg",
      en: "File:Nintendo_64_wController_L.jpg",
    },
    kifftech_filenintendo_game_boy_advance_milky_blue: {
      fr: "File:Nintendo_Game_Boy_Advance_Milky_Blue_FL.jpg",
      en: "File:Nintendo_Game_Boy_Advance_Milky_Blue_FL.jpg",
    },
    kifftech_filenintendo_gamecube_console_brjpg: {
      fr: "File:Nintendo_GameCube_Console_BR.jpg",
      en: "File:Nintendo_GameCube_Console_BR.jpg",
    },
    kifftech_filenintendo_super_nes_console_101_fljpg: {
      fr: "File:Nintendo_Super_NES_Console_101_FL.jpg",
      en: "File:Nintendo_Super_NES_Console_101_FL.jpg",
    },
    "kifftech_filenintendo_switch_2_in_docking_console": {
      fr: "File:Nintendo Switch 2 in Docking Console.jpg",
      en: "File:Nintendo Switch 2 in Docking Console.jpg",
    },
    kifftech_filenintendo_switch_oled_modell_mit_gedo: {
      fr: "File:Nintendo Switch – OLED_Modell mit gedockter Konsole 20230506 HOF01624 RAW_Export.png",
      en: "File:Nintendo Switch – OLED_Modell mit gedockter Konsole 20230506 HOF01624 RAW_Export.png",
    },
    "kifftech_filenothing_ear2jpg": {
      fr: "File:Nothing ear2.jpg",
      en: "File:Nothing ear2.jpg",
    },
    kifftech_filenothing_phone_1_back___whitejpg: {
      fr: "File:Nothing Phone (1) back _ white.jpg",
      en: "File:Nothing Phone (1) back _ white.jpg",
    },
    "kifftech_filenothing_phone_2_booredatworkcom_001p": {
      fr: "File:Nothing phone (2) (Booredatwork.com) 001.png",
      en: "File:Nothing phone (2) (Booredatwork.com) 001.png",
    },
    "kifftech_filenothing_phone_2ajpg": {
      fr: "File:Nothing phone (2a).jpg",
      en: "File:Nothing phone (2a).jpg",
    },
    "kifftech_fileoneplus_13_backjpg": {
      fr: "File:OnePlus 13 back.jpg",
      en: "File:OnePlus 13 back.jpg",
    },
    "kifftech_fileoneplus_8_projpg": {
      fr: "File:OnePlus 8 Pro.jpg",
      en: "File:OnePlus 8 Pro.jpg",
    },
    "kifftech_fileoneplus_9_pro_backjpg": {
      fr: "File:OnePlus 9 Pro back.jpg",
      en: "File:OnePlus 9 Pro back.jpg",
    },
    "kifftech_fileoppo_find_x7_ultrajpg": {
      fr: "File:Oppo Find X7 Ultra.jpg",
      en: "File:Oppo Find X7 Ultra.jpg",
    },
    "kifftech_filepair_of_lavender_samsung_galaxy_buds": {
      fr: "File:Pair of lavender Samsung Galaxy Buds2 Pro.jpg",
      en: "File:Pair of lavender Samsung Galaxy Buds2 Pro.jpg",
    },
    "kifftech_filepalit_geforce_rtx_5090_gamerock_2025": {
      fr: "File:Palit GeForce RTX 5090 Gamerock 20250530 HOF3913 RAW_Export.png",
      en: "File:Palit GeForce RTX 5090 Gamerock 20250530 HOF3913 RAW_Export.png",
    },
    kifftech_filepico_4___2jpg: {
      fr: "File:Pico 4 _ 2.jpg",
      en: "File:Pico 4 _ 2.jpg",
    },
    "kifftech_filepico_4_ultra_headsetjpg": {
      fr: "File:Pico 4 ultra headset.jpg",
      en: "File:Pico 4 ultra headset.jpg",
    },
    "kifftech_filepixel_8ajpg": {
      fr: "File:Pixel 8a.jpg",
      en: "File:Pixel 8a.jpg",
    },
    kifftech_fileplaydate_front_viewpng: {
      fr: "File:Playdate front_view.png",
      en: "File:Playdate front_view.png",
    },
    "kifftech_fileplaystation_5_pro_no_disc_drivejpg": {
      fr: "File:PlayStation 5 Pro no disc drive.jpg",
      en: "File:PlayStation 5 Pro no disc drive.jpg",
    },
    "kifftech_fileplaystation_vr2jpg": {
      fr: "File:PlayStation VR2.jpg",
      en: "File:PlayStation VR2.jpg",
    },
    "kifftech_fileplus_key_oneplus_nord_5jpg": {
      fr: "File:Plus key OnePlus Nord 5.jpg",
      en: "File:Plus key OnePlus Nord 5.jpg",
    },
    "kifftech_fileps5digitaleditionpng": {
      fr: "File:PS5DigitalEdition.png",
      en: "File:PS5DigitalEdition.png",
    },
    kifftech_filepsx_console_wcontrollerpng: {
      fr: "File:PSX_Console_wController.png",
      en: "File:PSX_Console_wController.png",
    },
    "kifftech_fileraspberry_pi_5_backsidejpg": {
      fr: "File:Raspberry Pi 5 Backside.jpg",
      en: "File:Raspberry Pi 5 Backside.jpg",
    },
    "kifftech_fileraspberry_pi_zero_2_wjpg": {
      fr: "File:Raspberry Pi Zero 2 W.jpg",
      en: "File:Raspberry Pi Zero 2 W.jpg",
    },
    kifftech_fileray_ban_meta_gen_1_smart_glasses_wit: {
      fr: "File:Ray_Ban Meta Gen 1 smart glasses with charging case.jpg",
      en: "File:Ray_Ban Meta Gen 1 smart glasses with charging case.jpg",
    },
    "kifftech_filerear_view_of_the_samsung_galaxy_s25_": {
      fr: "File:Rear view of the Samsung Galaxy S25 Ultra smartphone.jpg",
      en: "File:Rear view of the Samsung Galaxy S25 Ultra smartphone.jpg",
    },
    "kifftech_fileredmi_note_14_proplusjpg": {
      fr: "File:Redmi Note 14 ProPlus.jpg",
      en: "File:Redmi Note 14 ProPlus.jpg",
    },
    "kifftech_fileryzen_5_5600x_in_socketjpg": {
      fr: "File:Ryzen 5 5600X in socket.jpg",
      en: "File:Ryzen 5 5600X in socket.jpg",
    },
    kifftech_filesamsung_galaxy_z_flip_5_vonkajsi_dis: {
      fr: "File:Samsung_Galaxy_Z_Flip_5 vonkajsi_displej.jpg",
      en: "File:Samsung_Galaxy_Z_Flip_5 vonkajsi_displej.jpg",
    },
    "kifftech_filesamsung_galaxy_buds2_pro_graphite_3j": {
      fr: "File:Samsung Galaxy Buds2 Pro (Graphite) (3).jpg",
      en: "File:Samsung Galaxy Buds2 Pro (Graphite) (3).jpg",
    },
    "kifftech_filesamsung_galaxy_fold_5jpg": {
      fr: "File:Samsung Galaxy Fold 5.jpg",
      en: "File:Samsung Galaxy Fold 5.jpg",
    },
    "kifftech_filesamsung_galaxy_s21_frontjpg": {
      fr: "File:Samsung Galaxy S21 Front.jpg",
      en: "File:Samsung Galaxy S21 Front.jpg",
    },
    "kifftech_filesamsung_galaxy_s24_ultra_2jpg": {
      fr: "File:SAMSUNG Galaxy S24 Ultra (2).jpg",
      en: "File:SAMSUNG Galaxy S24 Ultra (2).jpg",
    },
    "kifftech_filesamsung_galaxy_s24_ultrajpg": {
      fr: "File:Samsung Galaxy S24 Ultra.jpg",
      en: "File:Samsung Galaxy S24 Ultra.jpg",
    },
    "kifftech_filesamsung_galaxy_s25_edgejpg": {
      fr: "File:Samsung Galaxy S25 Edge.jpg",
      en: "File:Samsung Galaxy S25 Edge.jpg",
    },
    "kifftech_filesamsung_galaxy_tab_s8jpg": {
      fr: "File:Samsung Galaxy Tab S8.jpg",
      en: "File:Samsung Galaxy Tab S8.jpg",
    },
    kifftech_filesamsung_galaxy_watch_2026_08_11_ultr: {
      fr: "File:Samsung Galaxy Watch 2026_08_11 Ultra 3.jpg",
      en: "File:Samsung Galaxy Watch 2026_08_11 Ultra 3.jpg",
    },
    "kifftech_filesamsung_galaxy_watch_4jpg": {
      fr: "File:Samsung Galaxy Watch 4.jpg",
      en: "File:Samsung Galaxy Watch 4.jpg",
    },
    "kifftech_filesamsung_galaxy_watch_5_croppedjpg": {
      fr: "File:SAMSUNG Galaxy Watch 5 (cropped).jpg",
      en: "File:SAMSUNG Galaxy Watch 5 (cropped).jpg",
    },
    "kifftech_filesamsung_galaxy_watch_6jpg": {
      fr: "File:Samsung Galaxy Watch 6.jpg",
      en: "File:Samsung Galaxy Watch 6.jpg",
    },
    "kifftech_filesamsung_galaxy_z_flip_6jpg": {
      fr: "File:Samsung Galaxy Z Flip 6.jpg",
      en: "File:Samsung Galaxy Z Flip 6.jpg",
    },
    "kifftech_filesamsung_galaxy_z_fold8_rearjpg": {
      fr: "File:Samsung Galaxy Z Fold8 rear.jpg",
      en: "File:Samsung Galaxy Z Fold8 rear.jpg",
    },
    "kifftech_filesamsung_m2_nvme_ssd_990_pro_4tbjpg": {
      fr: "File:SAMSUNG M.2 NVMe SSD 990 PRO 4TB.jpg",
      en: "File:SAMSUNG M.2 NVMe SSD 990 PRO 4TB.jpg",
    },
    "kifftech_filesamsung_protable_ssd_t7_shield_4tb_f": {
      fr: "File:SAMSUNG PROTABLE SSD T7 SHIELD 4TB FRONT SIDE.jpg",
      en: "File:SAMSUNG PROTABLE SSD T7 SHIELD 4TB FRONT SIDE.jpg",
    },
    kifftech_filesandisk_extreme_portable_ssd_1_tb___: {
      fr: "File:SanDisk Extreme Portable SSD 1 TB _ front view with cable.jpg",
      en: "File:SanDisk Extreme Portable SSD 1 TB _ front view with cable.jpg",
    },
    "kifftech_filesapphire_amd_radeon_rx_7900_xtxjpg": {
      fr: "File:Sapphire AMD Radeon RX 7900 XTX.jpg",
      en: "File:Sapphire AMD Radeon RX 7900 XTX.jpg",
    },
    kifftech_filesega_dreamcast_setpng: {
      fr: "File:Sega_dreamcast_set.png",
      en: "File:Sega_dreamcast_set.png",
    },
    kifftech_filesega_mega_drive_jp_mk1_console_setjp: {
      fr: "File:Sega_Mega_Drive_JP_Mk1_Console_Set.jpg",
      en: "File:Sega_Mega_Drive_JP_Mk1_Console_Set.jpg",
    },
    "kifftech_fileshure_mv7_microphonejpg": {
      fr: "File:Shure MV7 microphone.jpg",
      en: "File:Shure MV7 microphone.jpg",
    },
    "kifftech_filesony_a7_iv_33mp_mirrorless_digital_c": {
      fr: "File:Sony a7 IV 33MP Mirrorless Digital Camera.jpg",
      en: "File:Sony a7 IV 33MP Mirrorless Digital Camera.jpg",
    },
    kifftech_filesony_wf_1000xm4jpg: {
      fr: "File:Sony WF_1000XM4.jpg",
      en: "File:Sony WF_1000XM4.jpg",
    },
    "kifftech_filesony_xperia_1_vpng": {
      fr: "File:Sony Xperia 1 V.png",
      en: "File:Sony Xperia 1 V.png",
    },
    kifftech_filesony_zv_1_50009804078jpg: {
      fr: "File:Sony ZV_1 (50009804078).jpg",
      en: "File:Sony ZV_1 (50009804078).jpg",
    },
    "kifftech_filespot_by_boston_dynamicsjpg": {
      fr: "File:Spot by Boston Dynamics.jpg",
      en: "File:Spot by Boston Dynamics.jpg",
    },
    "kifftech_filesteam_controller_with_puckjpg": {
      fr: "File:Steam Controller with Puck.jpg",
      en: "File:Steam Controller with Puck.jpg",
    },
    "kifftech_filesteam_deck_frontpng": {
      fr: "File:Steam Deck (front).png",
      en: "File:Steam Deck (front).png",
    },
    "kifftech_filesteam_frame_with_controllersjpg": {
      fr: "File:Steam Frame with controllers.jpg",
      en: "File:Steam Frame with controllers.jpg",
    },
    "kifftech_filesteam_machine_frontjpg": {
      fr: "File:Steam machine front.jpg",
      en: "File:Steam machine front.jpg",
    },
    "kifftech_filesurface_pro_9_in_sapphire_colourjpg": {
      fr: "File:Surface Pro 9 in Sapphire colour.jpg",
      en: "File:Surface Pro 9 in Sapphire colour.jpg",
    },
    "kifftech_filetemporaerhaus_dji_air_3_flugjpg": {
      fr: "File:Temporaerhaus dji air 3 flug.jpg",
      en: "File:Temporaerhaus dji air 3 flug.jpg",
    },
    "kifftech_fileunitree_go2_of_salvamont_side_viewjp": {
      fr: "File:Unitree Go2 of Salvamont side view.jpg",
      en: "File:Unitree Go2 of Salvamont side view.jpg",
    },
    "kifftech_filexbox_series_x_50648118708jpg": {
      fr: "File:Xbox series X (50648118708).jpg",
      en: "File:Xbox series X (50648118708).jpg",
    },
    "kifftech_filexiaomi_13_frontjpg": {
      fr: "File:Xiaomi 13 front.jpg",
      en: "File:Xiaomi 13 front.jpg",
    },
    "kifftech_filexiaomi_pad_6_displayjpg": {
      fr: "File:Xiaomi Pad 6 display.jpg",
      en: "File:Xiaomi Pad 6 display.jpg",
    },
    "kifftech_filexiaomi_pad_6s_projpg": {
      fr: "File:Xiaomi Pad 6S Pro.jpg",
      en: "File:Xiaomi Pad 6S Pro.jpg",
    },
    "kifftech_filexiaomi_pad_7jpg": {
      fr: "File:Xiaomi Pad 7.jpg",
      en: "File:Xiaomi Pad 7.jpg",
    },
    "kifftech_fournisseurs_officiels_grossistes": {
      fr: "fournisseurs officiels grossistes",
      en: "fournisseurs officiels grossistes",
    },
    kifftech_galaxy_a54jpg_samsung_galaxy_a54_filebac: {
      fr: "galaxy_a54.jpg — Samsung Galaxy A54\n        File:Back of the Samsung Galaxy A54 5G.jpg\n        CC BY_SA 4.0",
      en: "galaxy_a54.jpg — Samsung Galaxy A54\n        File:Back of the Samsung Galaxy A54 5G.jpg\n        CC BY_SA 4.0",
    },
    kifftech_galaxy_buds_2_projpg_samsung_galaxy_buds: {
      fr: "galaxy_buds_2_pro.jpg — Samsung Galaxy Buds 2 Pro\n        File:Pair of lavender Samsung Galaxy Buds2 Pro.jpg\n        CC BY 4.0",
      en: "galaxy_buds_2_pro.jpg — Samsung Galaxy Buds 2 Pro\n        File:Pair of lavender Samsung Galaxy Buds2 Pro.jpg\n        CC BY 4.0",
    },
    kifftech_galaxy_s20jpg_samsung_galaxy_s20_filegal: {
      fr: "galaxy_s20.jpg — Samsung Galaxy S20\n        File:Galaxy S20.png\n        CC BY 4.0",
      en: "galaxy_s20.jpg — Samsung Galaxy S20\n        File:Galaxy S20.png\n        CC BY 4.0",
    },
    kifftech_galaxy_s21jpg_samsung_galaxy_s21_filesam: {
      fr: "galaxy_s21.jpg — Samsung Galaxy S21\n        File:Samsung Galaxy S21 Front.jpg\n        CC BY_SA 4.0",
      en: "galaxy_s21.jpg — Samsung Galaxy S21\n        File:Samsung Galaxy S21 Front.jpg\n        CC BY_SA 4.0",
    },
    kifftech_galaxy_s22_ultrajpg_samsung_galaxy_s22_u: {
      fr: "galaxy_s22_ultra.jpg — Samsung Galaxy S22 Ultra\n        File:Back of the Samsung Galaxy S22 Ultra.jpg\n        CC BY_SA 4.0",
      en: "galaxy_s22_ultra.jpg — Samsung Galaxy S22 Ultra\n        File:Back of the Samsung Galaxy S22 Ultra.jpg\n        CC BY_SA 4.0",
    },
    kifftech_galaxy_s23_ultrajpg_samsung_galaxy_s23_u: {
      fr: "galaxy_s23_ultra.jpg — Samsung Galaxy S23 Ultra\n        File:Back view of Samsung Galaxy S23 Ultra Green.jpg\n        CC BY_SA 4.0",
      en: "galaxy_s23_ultra.jpg — Samsung Galaxy S23 Ultra\n        File:Back view of Samsung Galaxy S23 Ultra Green.jpg\n        CC BY_SA 4.0",
    },
    kifftech_galaxy_s25_edgejpg_samsung_galaxy_s25_ed: {
      fr: "galaxy_s25_edge.jpg — Samsung Galaxy S25 Edge\n        File:Samsung Galaxy S25 Edge.jpg\n        CC BY_SA 4.0",
      en: "galaxy_s25_edge.jpg — Samsung Galaxy S25 Edge\n        File:Samsung Galaxy S25 Edge.jpg\n        CC BY_SA 4.0",
    },
    kifftech_galaxy_s25_ultrajpg_samsung_galaxy_s25_u: {
      fr: "galaxy_s25_ultra.jpg — Samsung Galaxy S25 Ultra\n        File:Rear view of the Samsung Galaxy S25 Ultra smartphone.jpg\n        CC0",
      en: "galaxy_s25_ultra.jpg — Samsung Galaxy S25 Ultra\n        File:Rear view of the Samsung Galaxy S25 Ultra smartphone.jpg\n        CC0",
    },
    kifftech_galaxy_s26_ultrajpg_samsung_galaxy_s26_u: {
      fr: "galaxy_s26_ultra.jpg — Samsung Galaxy S26 Ultra\n        File:Galaxy S26 Ultra lavender.jpg\n        CC BY 4.0",
      en: "galaxy_s26_ultra.jpg — Samsung Galaxy S26 Ultra\n        File:Galaxy S26 Ultra lavender.jpg\n        CC BY 4.0",
    },
    kifftech_galaxy_tab_s8jpg_samsung_galaxy_tab_s8_f: {
      fr: "galaxy_tab_s8.jpg — Samsung Galaxy Tab S8\n        File:Samsung Galaxy Tab S8.jpg\n        CC BY_SA 4.0",
      en: "galaxy_tab_s8.jpg — Samsung Galaxy Tab S8\n        File:Samsung Galaxy Tab S8.jpg\n        CC BY_SA 4.0",
    },
    kifftech_galaxy_watch_4jpg_samsung_galaxy_watch_4: {
      fr: "galaxy_watch_4.jpg — Samsung Galaxy Watch 4\n        File:Samsung Galaxy Watch 4.jpg\n        CC BY_SA 4.0",
      en: "galaxy_watch_4.jpg — Samsung Galaxy Watch 4\n        File:Samsung Galaxy Watch 4.jpg\n        CC BY_SA 4.0",
    },
    kifftech_galaxy_watch_5jpg_samsung_galaxy_watch_5: {
      fr: "galaxy_watch_5.jpg — Samsung Galaxy Watch 5\n        File:SAMSUNG Galaxy Watch 5 (cropped).jpg\n        CC BY_SA 4.0",
      en: "galaxy_watch_5.jpg — Samsung Galaxy Watch 5\n        File:SAMSUNG Galaxy Watch 5 (cropped).jpg\n        CC BY_SA 4.0",
    },
    kifftech_galaxy_watch_6jpg_samsung_galaxy_watch_6: {
      fr: "galaxy_watch_6.jpg — Samsung Galaxy Watch 6\n        File:Samsung Galaxy Watch 6.jpg\n        CC BY_SA 4.0",
      en: "galaxy_watch_6.jpg — Samsung Galaxy Watch 6\n        File:Samsung Galaxy Watch 6.jpg\n        CC BY_SA 4.0",
    },
    kifftech_galaxy_watch_ultra_3jpg_samsung_galaxy_w: {
      fr: "galaxy_watch_ultra_3.jpg — Samsung Galaxy Watch Ultra 3\n        File:Samsung Galaxy Watch 2026_08_11 Ultra 3.jpg\n        CC BY 4.0",
      en: "galaxy_watch_ultra_3.jpg — Samsung Galaxy Watch Ultra 3\n        File:Samsung Galaxy Watch 2026_08_11 Ultra 3.jpg\n        CC BY 4.0",
    },
    kifftech_galaxy_z_flip_5jpg_samsung_galaxy_z_flip: {
      fr: "galaxy_z_flip_5.jpg — Samsung Galaxy Z Flip 5\n        File:Samsung_Galaxy_Z_Flip_5 vonkajsi_displej.jpg\n        CC BY 3.0",
      en: "galaxy_z_flip_5.jpg — Samsung Galaxy Z Flip 5\n        File:Samsung_Galaxy_Z_Flip_5 vonkajsi_displej.jpg\n        CC BY 3.0",
    },
    kifftech_galaxy_z_fold_5jpg_samsung_galaxy_z_fold: {
      fr: "galaxy_z_fold_5.jpg — Samsung Galaxy Z Fold 5\n        File:Samsung Galaxy Fold 5.jpg\n        CC BY_SA 4.0",
      en: "galaxy_z_fold_5.jpg — Samsung Galaxy Z Fold 5\n        File:Samsung Galaxy Fold 5.jpg\n        CC BY_SA 4.0",
    },
    kifftech_galaxy_z_fold_8jpg_samsung_galaxy_z_fold: {
      fr: "galaxy_z_fold_8.jpg — Samsung Galaxy Z Fold 8\n        File:Samsung Galaxy Z Fold8 rear.jpg\n        CC BY_SA 4.0",
      en: "galaxy_z_fold_8.jpg — Samsung Galaxy Z Fold 8\n        File:Samsung Galaxy Z Fold8 rear.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_galaxy_s24_ultra": {
      fr: "Galaxy S24 Ultra",
      en: "Galaxy S24 Ultra",
    },
    kifftech_garmin_forerunner_965jpg_garmin_forerunn: {
      fr: "garmin_forerunner_965.jpg — Garmin Forerunner 965\n        File:Garmin Forerunner 965.jpeg\n        CC BY_SA 4.0",
      en: "garmin_forerunner_965.jpg — Garmin Forerunner 965\n        File:Garmin Forerunner 965.jpeg\n        CC BY_SA 4.0",
    },
    kifftech_gopro_hero_10jpg_gopro_hero10_black_file: {
      fr: "gopro_hero_10.jpg — GoPro HERO10 Black\n        File:GoPro Hero 10 Black with battery door open.jpg\n        CC BY 4.0",
      en: "gopro_hero_10.jpg — GoPro HERO10 Black\n        File:GoPro Hero 10 Black with battery door open.jpg\n        CC BY 4.0",
    },
    kifftech_gopro_hero_13jpg_gopro_hero13_black_file: {
      fr: "gopro_hero_13.jpg — GoPro HERO13 Black\n        File:GoPro Héro 13 Black _ 03.jpg\n        CC BY_SA 4.0",
      en: "gopro_hero_13.jpg — GoPro HERO13 Black\n        File:GoPro Héro 13 Black _ 03.jpg\n        CC BY_SA 4.0",
    },
    kifftech_gopro_hero_9jpg_gopro_hero9_black_filego: {
      fr: "gopro_hero_9.jpg — GoPro HERO9 Black\n        File:GoPro Hero 9 Black _ Front.jpg\n        CC BY_SA 4.0",
      en: "gopro_hero_9.jpg — GoPro HERO9 Black\n        File:GoPro Hero 9 Black _ Front.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_hard_refresh_mise_jour_version_kifftech": {
      fr: "Hard refresh — mise à jour version KiffTech",
      en: "Hard refresh — mise à jour version KiffTech",
    },
    "kifftech_historique_de_tout_ce_qui_a_t_pay_produi": {
      fr: "Historique de tout ce qui a été payé (produits, panier, caisse).",
      en: "Historique de tout ce qui a été payé (produits, panier, caisse).",
    },
    kifftech_homepod_minijpg_apple_homepod_mini_filea: {
      fr: "homepod_mini.jpg — Apple HomePod mini\n        File:Apple HomePod mini.jpg\n        CC BY_SA 3.0 de",
      en: "homepod_mini.jpg — Apple HomePod mini\n        File:Apple HomePod mini.jpg\n        CC BY_SA 3.0 de",
    },
    kifftech_huawei_p40_projpg_huawei_p40_pro_filehua: {
      fr: "huawei_p40_pro.jpg — Huawei P40 Pro\n        File:HUAWEI P40 Pro Front.jpg\n        CC BY_SA 4.0",
      en: "huawei_p40_pro.jpg — Huawei P40 Pro\n        File:HUAWEI P40 Pro Front.jpg\n        CC BY_SA 4.0",
    },
    kifftech_huawei_p60_projpg_huawei_p60_pro_filehua: {
      fr: "huawei_p60_pro.jpg — Huawei P60 Pro\n        File:Huawei P60 Pro.jpg\n        CC BY_SA 4.0",
      en: "huawei_p60_pro.jpg — Huawei P60 Pro\n        File:Huawei P60 Pro.jpg\n        CC BY_SA 4.0",
    },
    kifftech_i7_12700kjpg_intel_core_i7_12700k_filein: {
      fr: "i7_12700k.jpg — Intel Core i7_12700K\n        File:Intel CPU Core i7 12700K Alder Lake top.jpg\n        CC BY_SA 4.0",
      en: "i7_12700k.jpg — Intel Core i7_12700K\n        File:Intel CPU Core i7 12700K Alder Lake top.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_identifier_aperu": {
      fr: "Identifier + Aperçu",
      en: "Identifier + Aperçu",
    },
    "kifftech_imgcreditstxt": {
      fr: "img/CREDITS.txt",
      en: "img/CREDITS.txt",
    },
    "kifftech_index_des_rayons_": {
      fr: "Index des rayons ↓",
      en: "Index des rayons ↓",
    },
    kifftech_insta360_one_x2jpg_insta360_one_x2_filei: {
      fr: "insta360_one_x2.jpg — Insta360 ONE X2\n        File:Insta360 One X2_2.jpg\n        CC BY_SA 4.0",
      en: "insta360_one_x2.jpg — Insta360 ONE X2\n        File:Insta360 One X2_2.jpg\n        CC BY_SA 4.0",
    },
    kifftech_ipad_10jpg_apple_ipad_10_fileipad_10png_: {
      fr: "ipad_10.jpg — Apple iPad 10\n        File:IPad 10.png\n        CC BY_SA 4.0",
      en: "ipad_10.jpg — Apple iPad 10\n        File:IPad 10.png\n        CC BY_SA 4.0",
    },
    kifftech_ipad_air_13_m2jpg_apple_ipad_air_13_m2_f: {
      fr: "ipad_air_13_m2.jpg — Apple iPad Air 13 M2\n        File:About iPad Air 13_inch (M2).jpg\n        CC BY_SA 4.0",
      en: "ipad_air_13_m2.jpg — Apple iPad Air 13 M2\n        File:About iPad Air 13_inch (M2).jpg\n        CC BY_SA 4.0",
    },
    kifftech_ipad_air_4jpg_apple_ipad_air_4_fileback_: {
      fr: "ipad_air_4.jpg — Apple iPad Air 4\n        File:Back of the iPad Air 4th generation.jpg\n        CC BY_SA 4.0",
      en: "ipad_air_4.jpg — Apple iPad Air 4\n        File:Back of the iPad Air 4th generation.jpg\n        CC BY_SA 4.0",
    },
    kifftech_ipad_mini_6jpg_apple_ipad_mini_6_fileipa: {
      fr: "ipad_mini_6.jpg — Apple iPad mini 6\n        File:IPad Mini 6 in hand.jpg\n        CC BY_SA 4.0",
      en: "ipad_mini_6.jpg — Apple iPad mini 6\n        File:IPad Mini 6 in hand.jpg\n        CC BY_SA 4.0",
    },
    kifftech_ipad_pro_11_m4jpg_apple_ipad_pro_11_m4_f: {
      fr: "ipad_pro_11_m4.jpg — Apple iPad Pro 11 M4\n        File:About iPad Pro 11_inch (M4).jpg\n        CC BY_SA 4.0",
      en: "ipad_pro_11_m4.jpg — Apple iPad Pro 11 M4\n        File:About iPad Pro 11_inch (M4).jpg\n        CC BY_SA 4.0",
    },
    kifftech_ipad_pro_11_m5jpg_apple_ipad_pro_11_m5_f: {
      fr: "ipad_pro_11_m5.jpg — Apple iPad Pro 11 M5\n        File:IPad Pro (11_inch, M5, Silver) _ Backside.jpg\n        CC0",
      en: "ipad_pro_11_m5.jpg — Apple iPad Pro 11 M5\n        File:IPad Pro (11_inch, M5, Silver) _ Backside.jpg\n        CC0",
    },
    kifftech_iphone_12jpg_apple_iphone_12_fileiphone_: {
      fr: "iphone_12.jpg — Apple iPhone 12\n        File:Iphone_12_product__red.png\n        CC BY_SA 4.0",
      en: "iphone_12.jpg — Apple iPhone 12\n        File:Iphone_12_product__red.png\n        CC BY_SA 4.0",
    },
    kifftech_iphone_13_projpg_apple_iphone_13_pro_fil: {
      fr: "iphone_13_pro.jpg — Apple iPhone 13 Pro\n        File:Back of the iPhone 13 Pro.jpg\n        CC BY_SA 4.0",
      en: "iphone_13_pro.jpg — Apple iPhone 13 Pro\n        File:Back of the iPhone 13 Pro.jpg\n        CC BY_SA 4.0",
    },
    kifftech_iphone_14_projpg_apple_iphone_14_pro_fil: {
      fr: "iphone_14_pro.jpg — Apple iPhone 14 Pro\n        File:Back of the iPhone 14 Pro.jpg\n        CC BY_SA 4.0",
      en: "iphone_14_pro.jpg — Apple iPhone 14 Pro\n        File:Back of the iPhone 14 Pro.jpg\n        CC BY_SA 4.0",
    },
    kifftech_iphone_14jpg_apple_iphone_14_fileback_vi: {
      fr: "iphone_14.jpg — Apple iPhone 14\n        File:Back view of iPhone 14 Blue.jpg\n        CC BY_SA 4.0",
      en: "iphone_14.jpg — Apple iPhone 14\n        File:Back view of iPhone 14 Blue.jpg\n        CC BY_SA 4.0",
    },
    kifftech_iphone_16_projpg_apple_iphone_16_pro_fil: {
      fr: "iphone_16_pro.jpg — Apple iPhone 16 Pro\n        File:Back of iPhone 16 Pro _ 2.jpg\n        CC BY_SA 4.0",
      en: "iphone_16_pro.jpg — Apple iPhone 16 Pro\n        File:Back of iPhone 16 Pro _ 2.jpg\n        CC BY_SA 4.0",
    },
    kifftech_iphone_16ejpg_apple_iphone_16e_fileiphon: {
      fr: "iphone_16e.jpg — Apple iPhone 16e\n        File:IPhone 16e Black.jpg\n        CC BY 4.0",
      en: "iphone_16e.jpg — Apple iPhone 16e\n        File:IPhone 16e Black.jpg\n        CC BY 4.0",
    },
    kifftech_iphone_16jpg_apple_iphone_16_fileback_vi: {
      fr: "iphone_16.jpg — Apple iPhone 16\n        File:Back view of iPhone 16 Ultramarine.jpg\n        CC BY_SA 4.0",
      en: "iphone_16.jpg — Apple iPhone 16\n        File:Back view of iPhone 16 Ultramarine.jpg\n        CC BY_SA 4.0",
    },
    kifftech_iphone_17_pro_maxjpg_apple_iphone_17_pro: {
      fr: "iphone_17_pro_max.jpg — Apple iPhone 17 Pro Max\n        File:IPhone 17 Pro Max (Cosmic Orange) _ Backside.jpg\n        CC0",
      en: "iphone_17_pro_max.jpg — Apple iPhone 17 Pro Max\n        File:IPhone 17 Pro Max (Cosmic Orange) _ Backside.jpg\n        CC0",
    },
    kifftech_iphone_17_projpg_apple_iphone_17_pro_fil: {
      fr: "iphone_17_pro.jpg — Apple iPhone 17 Pro\n        File:IPhone 17 Pro (2025_12_28).jpg\n        CC0",
      en: "iphone_17_pro.jpg — Apple iPhone 17 Pro\n        File:IPhone 17 Pro (2025_12_28).jpg\n        CC0",
    },
    kifftech_iphone_17jpg_apple_iphone_17_fileiphone_: {
      fr: "iphone_17.jpg — Apple iPhone 17\n        File:IPhone 17 (Lavender) _ Backside.jpg\n        CC0",
      en: "iphone_17.jpg — Apple iPhone 17\n        File:IPhone 17 (Lavender) _ Backside.jpg\n        CC0",
    },
    kifftech_iphone_airjpg_apple_iphone_air_fileiphon: {
      fr: "iphone_air.jpg — Apple iPhone Air\n        File:IPhone Air (Cloud White) _ Backside.jpg\n        CC0",
      en: "iphone_air.jpg — Apple iPhone Air\n        File:IPhone Air (Cloud White) _ Backside.jpg\n        CC0",
    },
    "kifftech_keffstation": {
      fr: "KeffStation",
      en: "KeffStation",
    },
    "kifftech_kifftech": {
      fr: "KiffTech",
      en: "KiffTech",
    },
    "kifftech_kifftech_club": {
      fr: "KiffTech Club",
      en: "KiffTech Club",
    },
    kifftech_kifftech_crdits_photos_box_sizingborder_: {
      fr: "KiffTech — Crédits photos\n\n*{box_sizing:border_box;margin:0;padding:0}\nbody{min_height:100vh;min_height:100dvh;background:#070816;color:#f4f6ff;font:1rem/1.55 system_ui,_apple_system,\"Segoe UI\",Roboto,sans_serif}\n.app{max_width:900px;margin:0 auto;padding:clamp(16px,3vw,24px);padding_bottom:max(clamp(24px,5vw,48px),env(safe_area_inset_bottom))}\nheader{display:flex;align_items:center;gap:12px;flex_wrap:wrap;margin_bottom:20px}\nh1{font_size:clamp(1.3rem,3.5vw,2rem);font_weight:800;background:linear_gradient(90deg,#1e6bff,#00d4ff,#27d17f);_webkit_background_clip:text;background_clip:text;color:transparent}\n.intro{background:rgba(30,107,255,.08);border:1px solid rgba(30,107,255,.3);border_radius:14px;padding:16px 18px;margin_bottom:22px;color:#c9d1f2}\n.intro a{color:#8ab4ff}\nul{list_style:none;display:flex;flex_direction:column;gap:10px}\nli{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border_radius:12px;padding:12px 14px;font_size:.92rem}\nli a{color:#8ab4ff;text_decoration:none;overflow_wrap:anywhere}\nli a:hover{text_decoration:underline}\n.lic{display:inline_block;margin_left:8px;padding:2px 8px;border_radius:999px;background:rgba(255,210,63,.12);color:#ffd23f;font_size:.72rem;font_weight:700;white_space:nowrap}\n.back{display:inline_flex;margin_top:24px;padding:12px 18px;border_radius:999px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);color:#ffd23f;font_weight:700;text_decoration:none}\nfooter{margin_top:28px;color:#8a92b8;font_size:.8rem}\n\n\n\n\n\n📷Crédits photos\n\nLes 175 visuels du catalogue proviennent de Wikimedia Commons.\nIls sont utilisés selon la licence indiquée pour chaque fichier (CC0, CC BY, CC BY_SA ou domaine public) :\nusage commercial autorisé avec attribution ; les fichiers CC BY_SA imposent en plus le partage à l'identique.\nLes images ont été redimensionnées (500 px) pour l'affichage.\nChaque fiche renvoie à sa page source pour identifier l'auteur et la licence exacte.\n\n\n      \n        sp1.jpg — Samsung Galaxy S24 Ultra\n        File:Samsung Galaxy S24 Ultra.jpg\n        CC BY_SA 4.0",
      en: "KiffTech — Crédits photos\n\n*{box_sizing:border_box;margin:0;padding:0}\nbody{min_height:100vh;min_height:100dvh;background:#070816;color:#f4f6ff;font:1rem/1.55 system_ui,_apple_system,\"Segoe UI\",Roboto,sans_serif}\n.app{max_width:900px;margin:0 auto;padding:clamp(16px,3vw,24px);padding_bottom:max(clamp(24px,5vw,48px),env(safe_area_inset_bottom))}\nheader{display:flex;align_items:center;gap:12px;flex_wrap:wrap;margin_bottom:20px}\nh1{font_size:clamp(1.3rem,3.5vw,2rem);font_weight:800;background:linear_gradient(90deg,#1e6bff,#00d4ff,#27d17f);_webkit_background_clip:text;background_clip:text;color:transparent}\n.intro{background:rgba(30,107,255,.08);border:1px solid rgba(30,107,255,.3);border_radius:14px;padding:16px 18px;margin_bottom:22px;color:#c9d1f2}\n.intro a{color:#8ab4ff}\nul{list_style:none;display:flex;flex_direction:column;gap:10px}\nli{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border_radius:12px;padding:12px 14px;font_size:.92rem}\nli a{color:#8ab4ff;text_decoration:none;overflow_wrap:anywhere}\nli a:hover{text_decoration:underline}\n.lic{display:inline_block;margin_left:8px;padding:2px 8px;border_radius:999px;background:rgba(255,210,63,.12);color:#ffd23f;font_size:.72rem;font_weight:700;white_space:nowrap}\n.back{display:inline_flex;margin_top:24px;padding:12px 18px;border_radius:999px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);color:#ffd23f;font_weight:700;text_decoration:none}\nfooter{margin_top:28px;color:#8a92b8;font_size:.8rem}\n\n\n\n\n\n📷Crédits photos\n\nLes 175 visuels du catalogue proviennent de Wikimedia Commons.\nIls sont utilisés selon la licence indiquée pour chaque fichier (CC0, CC BY, CC BY_SA ou domaine public) :\nusage commercial autorisé avec attribution ; les fichiers CC BY_SA imposent en plus le partage à l'identique.\nLes images ont été redimensionnées (500 px) pour l'affichage.\nChaque fiche renvoie à sa page source pour identifier l'auteur et la licence exacte.\n\n\n      \n        sp1.jpg — Samsung Galaxy S24 Ultra\n        File:Samsung Galaxy S24 Ultra.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_kifftech_dition_2026_keffstation": {
      fr: "KiffTech® — Édition 2026 / KeffStation",
      en: "KiffTech® — Édition 2026 / KeffStation",
    },
    "kifftech_kifftech_est_une_plateforme_de_lorganisa": {
      fr: "KiffTech est une plateforme de l'organisation KeffStation. Elle rassemble des objets connectés, des gadgets high_tech et des accessoires électroniques, avec un fonctionnement différent des boutiques classiques.",
      en: "KiffTech est une plateforme de l'organisation KeffStation. Elle rassemble des objets connectés, des gadgets high_tech et des accessoires électroniques, avec un fonctionnement différent des boutiques classiques.",
    },
    "kifftech_kifftech_index_des_rayons_dition_2026": {
      fr: "KiffTech® — Index des rayons / Édition 2026",
      en: "KiffTech® — Index des rayons / Édition 2026",
    },
    "kifftech_la_caisse": {
      fr: "La Caisse",
      en: "La Caisse",
    },
    "kifftech_lancer_la_veille": {
      fr: "Lancer la veille",
      en: "Lancer la veille",
    },
    "kifftech_le_catalogue_complet_tous_rayons_confond": {
      fr: "Le catalogue complet, tous rayons confondus — derniers gadgets 2024_2026 inclus.",
      en: "Le catalogue complet, tous rayons confondus — derniers gadgets 2024_2026 inclus.",
    },
    "kifftech_le_dlai_de_livraison_estim_est_de_1_sema": {
      fr: "Le délai de livraison estimé est de 1 semaine à 5 semaines selon le produit et le volume du colis. Si le délai de livraison annoncé est dépassé, un remboursement partiel est appliqué.",
      en: "Le délai de livraison estimé est de 1 semaine à 5 semaines selon le produit et le volume du colis. Si le délai de livraison annoncé est dépassé, un remboursement partiel est appliqué.",
    },
    kifftech_legion_gojpg_lenovo_legion_go_filelenovo: {
      fr: "legion_go.jpg — Lenovo Legion Go\n        File:Lenovo Legion Go.jpg\n        CC BY_SA 4.0",
      en: "legion_go.jpg — Lenovo Legion Go\n        File:Lenovo Legion Go.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_les_175_visuels_du_catalogue_proviennent": {
      fr: "Les 175 visuels du catalogue proviennent de Wikimedia Commons.\nIls sont utilisés selon la licence indiquée pour chaque fichier (CC0, CC BY, CC BY_SA ou domaine public) :\nusage commercial autorisé avec attribution ; les fichiers CC BY_SA imposent en plus le partage à l'identique.\nLes images ont été redimensionnées (500 px) pour l'affichage.\nChaque fiche renvoie à sa page source pour identifier l'auteur et la licence exacte.",
      en: "Les 175 visuels du catalogue proviennent de Wikimedia Commons.\nIls sont utilisés selon la licence indiquée pour chaque fichier (CC0, CC BY, CC BY_SA ou domaine public) :\nusage commercial autorisé avec attribution ; les fichiers CC BY_SA imposent en plus le partage à l'identique.\nLes images ont été redimensionnées (500 px) pour l'affichage.\nChaque fiche renvoie à sa page source pour identifier l'auteur et la licence exacte.",
    },
    "kifftech_les_prix_officiels_des_constructeurs_et_": {
      fr: "Les prix officiels des constructeurs et les promotions ponctuelles se retrouvent facilement dans une multitude de boutiques en ligne. Chez KiffTech, nous ne cherchons pas à aligner ces prix visibles partout.",
      en: "Les prix officiels des constructeurs et les promotions ponctuelles se retrouvent facilement dans une multitude de boutiques en ligne. Chez KiffTech, nous ne cherchons pas à aligner ces prix visibles partout.",
    },
    kifftech_mac_mini_m1jpg_apple_mac_mini_m1_filemac: {
      fr: "mac_mini_m1.jpg — Apple Mac mini M1\n        File:Mac mini 2020 (M1) Anschlüsse.jpg\n        CC BY 4.0",
      en: "mac_mini_m1.jpg — Apple Mac mini M1\n        File:Mac mini 2020 (M1) Anschlüsse.jpg\n        CC BY 4.0",
    },
    kifftech_mac_mini_m4jpg_apple_mac_mini_m4_filemac: {
      fr: "mac_mini_m4.jpg — Apple Mac mini M4\n        File:Mac mini 2024 M4.jpg\n        CC BY 4.0",
      en: "mac_mini_m4.jpg — Apple Mac mini M4\n        File:Mac mini 2024 M4.jpg\n        CC BY 4.0",
    },
    kifftech_macbook_air_15_m4jpg_apple_macbook_air_1: {
      fr: "macbook_air_15_m4.jpg — Apple MacBook Air 15 M4\n        File:MacBook Air (15_inch, M4, Silver).jpg\n        CC0",
      en: "macbook_air_15_m4.jpg — Apple MacBook Air 15 M4\n        File:MacBook Air (15_inch, M4, Silver).jpg\n        CC0",
    },
    kifftech_macbook_air_m1jpg_apple_macbook_air_m1_f: {
      fr: "macbook_air_m1.jpg — Apple MacBook Air M1\n        File:Macbook Air M1 Silver PNG.png\n        CC BY_SA 4.0",
      en: "macbook_air_m1.jpg — Apple MacBook Air M1\n        File:Macbook Air M1 Silver PNG.png\n        CC BY_SA 4.0",
    },
    kifftech_macbook_air_m2jpg_apple_macbook_air_m2_f: {
      fr: "macbook_air_m2.jpg — Apple MacBook Air M2\n        File:M2 Macbook Air Starlight model.jpg\n        CC BY_SA 4.0",
      en: "macbook_air_m2.jpg — Apple MacBook Air M2\n        File:M2 Macbook Air Starlight model.jpg\n        CC BY_SA 4.0",
    },
    kifftech_macbook_pro_13_m1jpg_apple_macbook_pro_1: {
      fr: "macbook_pro_13_m1.jpg — Apple MacBook Pro 13 M1\n        File:MacBook Pro 13 (M1, 2020).jpg\n        CC BY_SA 4.0",
      en: "macbook_pro_13_m1.jpg — Apple MacBook Pro 13 M1\n        File:MacBook Pro 13 (M1, 2020).jpg\n        CC BY_SA 4.0",
    },
    kifftech_macbook_pro_14_m3jpg_apple_macbook_pro_1: {
      fr: "macbook_pro_14_m3.jpg — Apple MacBook Pro 14 M3\n        File:M3 Macbook Pro 14 inch Space Grey model.jpg\n        CC BY_SA 4.0",
      en: "macbook_pro_14_m3.jpg — Apple MacBook Pro 14 M3\n        File:M3 Macbook Pro 14 inch Space Grey model.jpg\n        CC BY_SA 4.0",
    },
    kifftech_macbook_pro_14_m5jpg_apple_macbook_pro_1: {
      fr: "macbook_pro_14_m5.jpg — Apple MacBook Pro 14 M5\n        File:MacBook Pro (14_inch, M5, Space Black).jpg\n        CC0",
      en: "macbook_pro_14_m5.jpg — Apple MacBook Pro 14 M5\n        File:MacBook Pro (14_inch, M5, Space Black).jpg\n        CC0",
    },
    "kifftech_marque": {
      fr: "Marque",
      en: "Marque",
    },
    kifftech_matebook_x_projpg_huawei_matebook_x_pro_: {
      fr: "matebook_x_pro.jpg — Huawei MateBook X Pro\n        File:Huawei MateBook X Pro 2023.jpg\n        CC BY_SA 4.0",
      en: "matebook_x_pro.jpg — Huawei MateBook X Pro\n        File:Huawei MateBook X Pro 2023.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_n": {
      fr: "N°",
      en: "N°",
    },
    kifftech_nanoleaf_shapesjpg_nanoleaf_shapes_filen: {
      fr: "nanoleaf_shapes.jpg — Nanoleaf Shapes\n        File:Nanoleaf Shapes.jpg\n        CC BY_SA 4.0",
      en: "nanoleaf_shapes.jpg — Nanoleaf Shapes\n        File:Nanoleaf Shapes.jpg\n        CC BY_SA 4.0",
    },
    kifftech_nest_audiojpg_google_nest_audio_filegoog: {
      fr: "nest_audio.jpg — Google Nest Audio\n        File:Google Nest Audio.jpg\n        CC BY_SA 4.0",
      en: "nest_audio.jpg — Google Nest Audio\n        File:Google Nest Audio.jpg\n        CC BY_SA 4.0",
    },
    kifftech_nothing_ear_2jpg_nothing_ear_2_filenothi: {
      fr: "nothing_ear_2.jpg — Nothing Ear (2)\n        File:Nothing ear2.jpg\n        CC BY_SA 4.0",
      en: "nothing_ear_2.jpg — Nothing Ear (2)\n        File:Nothing ear2.jpg\n        CC BY_SA 4.0",
    },
    kifftech_nothing_phone_1jpg_nothing_phone_1_filen: {
      fr: "nothing_phone_1.jpg — Nothing Phone (1)\n        File:Nothing Phone (1) back _ white.jpg\n        CC BY_SA 4.0",
      en: "nothing_phone_1.jpg — Nothing Phone (1)\n        File:Nothing Phone (1) back _ white.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_notre_modle_achat_en_file_dattente": {
      fr: "Notre modèle : achat en file d'attente",
      en: "Notre modèle : achat en file d'attente",
    },
    "kifftech_numi": {
      fr: "${NUM(i)}",
      en: "${NUM(i)}",
    },
    "kifftech_numi_rid_rdesc_countsrid_0_": {
      fr: "${NUM(i)}\n    \n      ${r.id}\n      ${r.desc}\n    \n    ${COUNTS[r.id] || 0}\n    ↗",
      en: "${NUM(i)}\n    \n      ${r.id}\n      ${r.desc}\n    \n    ${COUNTS[r.id] || 0}\n    ↗",
    },
    "kifftech_objets": {
      fr: "Objets",
      en: "Objets",
    },
    "kifftech_offres_des_marques_partenaires_via_impac": {
      fr: "Offres des marques partenaires via impact.com.",
      en: "Offres des marques partenaires via impact.com.",
    },
    kifftech_oneplus_13jpg_oneplus_13_fileoneplus_13_: {
      fr: "oneplus_13.jpg — OnePlus 13\n        File:OnePlus 13 back.jpg\n        CC BY_SA 4.0",
      en: "oneplus_13.jpg — OnePlus 13\n        File:OnePlus 13 back.jpg\n        CC BY_SA 4.0",
    },
    kifftech_oneplus_8_projpg_oneplus_8_pro_fileonepl: {
      fr: "oneplus_8_pro.jpg — OnePlus 8 Pro\n        File:OnePlus 8 Pro.jpg\n        CC BY_SA 4.0",
      en: "oneplus_8_pro.jpg — OnePlus 8 Pro\n        File:OnePlus 8 Pro.jpg\n        CC BY_SA 4.0",
    },
    kifftech_oneplus_9_projpg_oneplus_9_pro_fileonepl: {
      fr: "oneplus_9_pro.jpg — OnePlus 9 Pro\n        File:OnePlus 9 Pro back.jpg\n        CC BY_SA 4.0",
      en: "oneplus_9_pro.jpg — OnePlus 9 Pro\n        File:OnePlus 9 Pro back.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_organisation_keffstation": {
      fr: "organisation KeffStation",
      en: "organisation KeffStation",
    },
    kifftech_osmo_pocket_3jpg_dji_osmo_pocket_3_filed: {
      fr: "osmo_pocket_3.jpg — DJI Osmo Pocket 3\n        File:DJI Osmo Pocket 3 _ 1.jpg\n        CC BY_SA 4.0",
      en: "osmo_pocket_3.jpg — DJI Osmo Pocket 3\n        File:DJI Osmo Pocket 3 _ 1.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_partenaires": {
      fr: "Partenaires",
      en: "Partenaires",
    },
    kifftech_pi_zero_2_wjpg_raspberry_pi_zero_2_w_fil: {
      fr: "pi_zero_2_w.jpg — Raspberry Pi Zero 2 W\n        File:Raspberry Pi Zero 2 W.jpg\n        CC BY_SA 4.0",
      en: "pi_zero_2_w.jpg — Raspberry Pi Zero 2 W\n        File:Raspberry Pi Zero 2 W.jpg\n        CC BY_SA 4.0",
    },
    kifftech_pico_4jpg_pico_4_filepico_4___2jpg_cc_by: {
      fr: "pico_4.jpg — PICO 4\n        File:Pico 4 _ 2.jpg\n        CC BY_SA 4.0",
      en: "pico_4.jpg — PICO 4\n        File:Pico 4 _ 2.jpg\n        CC BY_SA 4.0",
    },
    kifftech_pixel_5jpg_google_pixel_5_filegoogle_pix: {
      fr: "pixel_5.jpg — Google Pixel 5\n        File:Google Pixel 5 front.jpg\n        CC BY_SA 4.0",
      en: "pixel_5.jpg — Google Pixel 5\n        File:Google Pixel 5 front.jpg\n        CC BY_SA 4.0",
    },
    kifftech_pixel_6jpg_google_pixel_6_filegoogle_pix: {
      fr: "pixel_6.jpg — Google Pixel 6\n        File:Google Pixel 6 Sorta Seafoam front bottom_left.jpg\n        CC BY_SA 4.0",
      en: "pixel_6.jpg — Google Pixel 6\n        File:Google Pixel 6 Sorta Seafoam front bottom_left.jpg\n        CC BY_SA 4.0",
    },
    kifftech_pixel_7jpg_google_pixel_7_filegoogle_pix: {
      fr: "pixel_7.jpg — Google Pixel 7\n        File:Google Pixel 7 20230416 HOF00361 RAW_Export.png\n        CC BY 4.0",
      en: "pixel_7.jpg — Google Pixel 7\n        File:Google Pixel 7 20230416 HOF00361 RAW_Export.png\n        CC BY 4.0",
    },
    "kifftech_playdatejpg_panic_playdate_fileplaydate_": {
      fr: "playdate.jpg — Panic Playdate\n        File:Playdate front_view.png\n        CC BY_SA 4.0",
      en: "playdate.jpg — Panic Playdate\n        File:Playdate front_view.png\n        CC BY_SA 4.0",
    },
    "kifftech_poque_consoles": {
      fr: "Époque (Consoles)",
      en: "Époque (Consoles)",
    },
    "kifftech_prix_kifftech_10_": {
      fr: "Prix KiffTech −10 %",
      en: "Prix KiffTech −10 %",
    },
    "kifftech_prix_promo_kifftech_20_ds_10_articles_en": {
      fr: "Prix Promo KiffTech : −20 % dès 10 articles en caisse (achat groupé) • Livraison offerte aux abonnés KiffTech Club",
      en: "Prix Promo KiffTech : −20 % dès 10 articles en caisse (achat groupé) • Livraison offerte aux abonnés KiffTech Club",
    },
    "kifftech_prix_sources": {
      fr: "Prix & Sources",
      en: "Prix & Sources",
    },
    kifftech_ps5_projpg_sony_playstation_5_pro_filepl: {
      fr: "ps5_pro.jpg — Sony PlayStation 5 Pro\n        File:PlayStation 5 Pro no disc drive.jpg\n        CC BY 3.0",
      en: "ps5_pro.jpg — Sony PlayStation 5 Pro\n        File:PlayStation 5 Pro no disc drive.jpg\n        CC BY 3.0",
    },
    "kifftech_psvr2jpg_sony_playstation_vr2_fileplayst": {
      fr: "psvr2.jpg — Sony PlayStation VR2\n        File:PlayStation VR2.jpg\n        CC BY 4.0",
      en: "psvr2.jpg — Sony PlayStation VR2\n        File:PlayStation VR2.jpg\n        CC BY 4.0",
    },
    "kifftech_public_domain": {
      fr: "Public domain",
      en: "Public domain",
    },
    "kifftech_quand_vous_passez_commande_sur_kifftech_": {
      fr: "Quand vous passez commande sur KiffTech, votre article entre dans une file d'attente de 1 jour à 1 semaine avant envoi du colis. Ce délai nous permet de regrouper plusieurs demandes par produit ou par lot de produits, puis de négocier avec nos fournisseurs officiels grossistes un pourcentage de promotion plus élevé que sur le prix public.",
      en: "Quand vous passez commande sur KiffTech, votre article entre dans une file d'attente de 1 jour à 1 semaine avant envoi du colis. Ce délai nous permet de regrouper plusieurs demandes par produit ou par lot de produits, puis de négocier avec nos fournisseurs officiels grossistes un pourcentage de promotion plus élevé que sur le prix public.",
    },
    kifftech_quest_2jpg_meta_quest_2_filemeta_quest_2: {
      fr: "quest_2.jpg — Meta Quest 2\n        File:Meta quest 2 2.jpg\n        CC BY_SA 4.0",
      en: "quest_2.jpg — Meta Quest 2\n        File:Meta quest 2 2.jpg\n        CC BY_SA 4.0",
    },
    kifftech_quest_3sjpg_meta_quest_3s_filemeta_quest: {
      fr: "quest_3s.jpg — Meta Quest 3S\n        File:Meta Quest 3S Display Unit.jpg\n        CC BY 4.0",
      en: "quest_3s.jpg — Meta Quest 3S\n        File:Meta Quest 3S Display Unit.jpg\n        CC BY 4.0",
    },
    kifftech_raspberry_pi_5jpg_raspberry_pi_5_fileras: {
      fr: "raspberry_pi_5.jpg — Raspberry Pi 5\n        File:Raspberry Pi 5 Backside.jpg\n        CC BY 4.0",
      en: "raspberry_pi_5.jpg — Raspberry Pi 5\n        File:Raspberry Pi 5 Backside.jpg\n        CC BY 4.0",
    },
    kifftech_ray_ban_metajpg_ray_ban_meta_smart_glass: {
      fr: "ray_ban_meta.jpg — Ray_Ban Meta Smart Glasses\n        File:Ray_Ban Meta Gen 1 smart glasses with charging case.jpg\n        CC BY 4.0",
      en: "ray_ban_meta.jpg — Ray_Ban Meta Smart Glasses\n        File:Ray_Ban Meta Gen 1 smart glasses with charging case.jpg\n        CC BY 4.0",
    },
    "kifftech_rayon": {
      fr: "Rayon",
      en: "Rayon",
    },
    "kifftech_rayons": {
      fr: "Rayons",
      en: "Rayons",
    },
    "kifftech_rayons_dobjets": {
      fr: "Rayons\n      d’objets",
      en: "Rayons\n      d’objets",
    },
    kifftech_razr_40_ultrajpg_motorola_razr_40_ultra_: {
      fr: "razr_40_ultra.jpg — Motorola Razr 40 Ultra\n        File:Motorola razr 40 ultra _ 3.jpg\n        CC BY_SA 4.0",
      en: "razr_40_ultra.jpg — Motorola Razr 40 Ultra\n        File:Motorola razr 40 ultra _ 3.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_rb1jpg_unitree_go2_fileunitree_go2_of_sa": {
      fr: "rb1.jpg — Unitree Go2\n        File:Unitree Go2 of Salvamont side view.jpg\n        CC BY_SA 4.0",
      en: "rb1.jpg — Unitree Go2\n        File:Unitree Go2 of Salvamont side view.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_rb2jpg_boston_dynamics_spot_filespot_by_": {
      fr: "rb2.jpg — Boston Dynamics Spot\n        File:Spot by Boston Dynamics.jpg\n        CC BY_SA 4.0",
      en: "rb2.jpg — Boston Dynamics Spot\n        File:Spot by Boston Dynamics.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_rb4jpg_tesla_optimus_humanode_filelatest": {
      fr: "rb4.jpg — Tesla Optimus humanoïde\n        File:Latest Tesla Optimus Humanoid Robot.jpg\n        CC BY_SA 4.0",
      en: "rb4.jpg — Tesla Optimus humanoïde\n        File:Latest Tesla Optimus Humanoid Robot.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_rb8jpg_anybotics_anymal_gamme_d_fileanym": {
      fr: "rb8.jpg — ANYbotics ANYmal, gamme D\n        File:Anymal_robot_inspection_power_grid.jpg\n        CC BY_SA 4.0",
      en: "rb8.jpg — ANYbotics ANYmal, gamme D\n        File:Anymal_robot_inspection_power_grid.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_rb9jpg_ghost_robotics_vision_60_fileghos": {
      fr: "rb9.jpg — Ghost Robotics Vision 60\n        File:Ghost Robotics _ Civitas Group Vision 60 robot dog at BSDA 2024.jpg\n        CC BY_SA 4.0",
      en: "rb9.jpg — Ghost Robotics Vision 60\n        File:Ghost Robotics _ Civitas Group Vision 60 robot dog at BSDA 2024.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_rdesc": {
      fr: "${r.desc}",
      en: "${r.desc}",
    },
    "kifftech_recherche_filtres": {
      fr: "Recherche & Filtres",
      en: "Recherche & Filtres",
    },
    "kifftech_refresh": {
      fr: "Refresh",
      en: "Refresh",
    },
    "kifftech_remboursement_partiel": {
      fr: "remboursement partiel",
      en: "remboursement partiel",
    },
    "kifftech_retournez_aux_rayons_kifftech_pour_parco": {
      fr: "Retournez aux rayons KiffTech pour parcourir les produits disponibles.",
      en: "Retournez aux rayons KiffTech pour parcourir les produits disponibles.",
    },
    "kifftech_rid": {
      fr: "${r.id}",
      en: "${r.id}",
    },
    kifftech_rtx_4090jpg_nvidia_geforce_rtx_4090_file: {
      fr: "rtx_4090.jpg — NVIDIA GeForce RTX 4090\n        File:Asus Strix RTX 4090.jpg\n        CC BY_SA 4.0",
      en: "rtx_4090.jpg — NVIDIA GeForce RTX 4090\n        File:Asus Strix RTX 4090.jpg\n        CC BY_SA 4.0",
    },
    kifftech_rtx_5090jpg_nvidia_geforce_rtx_5090_file: {
      fr: "rtx_5090.jpg — NVIDIA GeForce RTX 5090\n        File:Palit GeForce RTX 5090 Gamerock 20250530 HOF3913 RAW_Export.png\n        CC BY 4.0",
      en: "rtx_5090.jpg — NVIDIA GeForce RTX 5090\n        File:Palit GeForce RTX 5090 Gamerock 20250530 HOF3913 RAW_Export.png\n        CC BY 4.0",
    },
    kifftech_rx_6800_xtjpg_amd_radeon_rx_6800_xt_file: {
      fr: "rx_6800_xt.jpg — AMD Radeon RX 6800 XT\n        File:Amd_radeon_rx6800xt_from2020year_front.jpg\n        CC BY_SA 4.0",
      en: "rx_6800_xt.jpg — AMD Radeon RX 6800 XT\n        File:Amd_radeon_rx6800xt_from2020year_front.jpg\n        CC BY_SA 4.0",
    },
    kifftech_rx_7900_xtxjpg_amd_radeon_rx_7900_xtx_fi: {
      fr: "rx_7900_xtx.jpg — AMD Radeon RX 7900 XTX\n        File:Sapphire AMD Radeon RX 7900 XTX.jpg\n        CC BY_SA 4.0",
      en: "rx_7900_xtx.jpg — AMD Radeon RX 7900 XTX\n        File:Sapphire AMD Radeon RX 7900 XTX.jpg\n        CC BY_SA 4.0",
    },
    kifftech_ryzen_5600xjpg_amd_ryzen_5_5600x_fileryz: {
      fr: "ryzen_5600x.jpg — AMD Ryzen 5 5600X\n        File:Ryzen 5 5600X in socket.jpg\n        CC BY_SA 4.0",
      en: "ryzen_5600x.jpg — AMD Ryzen 5 5600X\n        File:Ryzen 5 5600X in socket.jpg\n        CC BY_SA 4.0",
    },
    kifftech_ryzen_5800x3djpg_amd_ryzen_7_5800x3d_fil: {
      fr: "ryzen_5800x3d.jpg — AMD Ryzen 7 5800X3D\n        File:AMD Ryzen 7 5800X3D.jpg\n        CC BY_SA 4.0",
      en: "ryzen_5800x3d.jpg — AMD Ryzen 7 5800X3D\n        File:AMD Ryzen 7 5800X3D.jpg\n        CC BY_SA 4.0",
    },
    kifftech_sandisk_extreme_ssdjpg_sandisk_extreme_p: {
      fr: "sandisk_extreme_ssd.jpg — SanDisk Extreme Portable SSD\n        File:SanDisk Extreme Portable SSD 1 TB _ front view with cable.jpg\n        CC BY_SA 4.0",
      en: "sandisk_extreme_ssd.jpg — SanDisk Extreme Portable SSD\n        File:SanDisk Extreme Portable SSD 1 TB _ front view with cable.jpg\n        CC BY_SA 4.0",
    },
    kifftech_shure_mv7jpg_shure_mv7_fileshure_mv7_mic: {
      fr: "shure_mv7.jpg — Shure MV7\n        File:Shure MV7 microphone.jpg\n        CC BY 2.0",
      en: "shure_mv7.jpg — Shure MV7\n        File:Shure MV7 microphone.jpg\n        CC BY 2.0",
    },
    "kifftech_smart_devices_173_objets_illustrs_11_ray": {
      fr: "Smart devices — 173 objets illustrés / 11 rayons",
      en: "Smart devices — 173 objets illustrés / 11 rayons",
    },
    kifftech_sony_a7_ivjpg_sony_a7_iv_filesony_a7_iv_: {
      fr: "sony_a7_iv.jpg — Sony A7 IV\n        File:Sony a7 IV 33MP Mirrorless Digital Camera.jpg\n        CC BY_SA 4.0",
      en: "sony_a7_iv.jpg — Sony A7 IV\n        File:Sony a7 IV 33MP Mirrorless Digital Camera.jpg\n        CC BY_SA 4.0",
    },
    kifftech_sony_wf_1000xm4jpg_sony_wf_1000xm4_files: {
      fr: "sony_wf_1000xm4.jpg — Sony WF_1000XM4\n        File:Sony WF_1000XM4.jpg\n        CC BY_SA 4.0",
      en: "sony_wf_1000xm4.jpg — Sony WF_1000XM4\n        File:Sony WF_1000XM4.jpg\n        CC BY_SA 4.0",
    },
    kifftech_sony_zv_1jpg_sony_zv_1_filesony_zv_1_500: {
      fr: "sony_zv_1.jpg — Sony ZV_1\n        File:Sony ZV_1 (50009804078).jpg\n        CC BY 2.0",
      en: "sony_zv_1.jpg — Sony ZV_1\n        File:Sony ZV_1 (50009804078).jpg\n        CC BY 2.0",
    },
    "kifftech_sources_de_donnes": {
      fr: "Sources de Données",
      en: "Sources de Données",
    },
    "kifftech_sp11png_iphone_15_vectoriel_fileiphone_1": {
      fr: "sp11.png — iPhone 15, vectoriel\n        File:IPhone 15 Vector.svg\n        CC BY_SA 4.0",
      en: "sp11.png — iPhone 15, vectoriel\n        File:IPhone 15 Vector.svg\n        CC BY_SA 4.0",
    },
    "kifftech_sp12jpg_galaxy_s24_visuel_rapproch_s24_u": {
      fr: "sp12.jpg — Galaxy S24+, visuel rapproché S24 Ultra\n        File:Back view of Samsung Galaxy S24 Ultra Black.jpg\n        CC (Commons)",
      en: "sp12.jpg — Galaxy S24+, visuel rapproché S24 Ultra\n        File:Back view of Samsung Galaxy S24 Ultra Black.jpg\n        CC (Commons)",
    },
    kifftech_sp13jpg_pixel_8a_filepixel_8ajpg_cc_by_s: {
      fr: "sp13.jpg — Pixel 8a\n        File:Pixel 8a.jpg\n        CC BY_SA 4.0",
      en: "sp13.jpg — Pixel 8a\n        File:Pixel 8a.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_sp14jpg_redmi_note_13_pro_visuel_rapproc": {
      fr: "sp14.jpg — Redmi Note 13 Pro, visuel rapproché gamme Note 14 Pro+\n        File:Redmi Note 14 ProPlus.jpg\n        CC (Commons)",
      en: "sp14.jpg — Redmi Note 13 Pro, visuel rapproché gamme Note 14 Pro+\n        File:Redmi Note 14 ProPlus.jpg\n        CC (Commons)",
    },
    "kifftech_sp15jpg_galaxy_z_flip_6_filesamsung_gala": {
      fr: "sp15.jpg — Galaxy Z Flip 6\n        File:Samsung Galaxy Z Flip 6.jpg\n        CC BY_SA 4.0",
      en: "sp15.jpg — Galaxy Z Flip 6\n        File:Samsung Galaxy Z Flip 6.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_sp16jpg_oneplus_nord_4_visuel_rapproch_n": {
      fr: "sp16.jpg — OnePlus Nord 4, visuel rapproché Nord 5\n        File:Plus key OnePlus Nord 5.jpg\n        CC (Commons)",
      en: "sp16.jpg — OnePlus Nord 4, visuel rapproché Nord 5\n        File:Plus key OnePlus Nord 5.jpg\n        CC (Commons)",
    },
    "kifftech_sp17png_nothing_phone_2_filenothing_phon": {
      fr: "sp17.png — Nothing Phone 2\n        File:Nothing phone (2) (Booredatwork.com) 001.png\n        CC BY_SA 4.0",
      en: "sp17.png — Nothing Phone 2\n        File:Nothing phone (2) (Booredatwork.com) 001.png\n        CC BY_SA 4.0",
    },
    "kifftech_sp18jpg_honor_magic_6_pro_filehonor_magi": {
      fr: "sp18.jpg — Honor Magic 6 Pro\n        File:Honor Magic 6 Pro.jpg\n        CC BY_SA 4.0",
      en: "sp18.jpg — Honor Magic 6 Pro\n        File:Honor Magic 6 Pro.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_sp1bjpg_galaxy_s24_ultra_dos_titanium_fi": {
      fr: "sp1b.jpg — Galaxy S24 Ultra, dos titanium\n        File:SAMSUNG Galaxy S24 Ultra (2).jpg\n        CC BY_SA 4.0",
      en: "sp1b.jpg — Galaxy S24 Ultra, dos titanium\n        File:SAMSUNG Galaxy S24 Ultra (2).jpg\n        CC BY_SA 4.0",
    },
    "kifftech_sp2png_iphone_15_pro_max_fileiphone_15_p": {
      fr: "sp2.png — iPhone 15 Pro Max\n        File:IPhone 15 pro max.png\n        CC BY_SA 4.0",
      en: "sp2.png — iPhone 15 Pro Max\n        File:IPhone 15 pro max.png\n        CC BY_SA 4.0",
    },
    "kifftech_sp4png_google_pixel_8_pro_bay_filegoogle": {
      fr: "sp4.png — Google Pixel 8 Pro, Bay\n        File:Google Pixel 8 Pro back (Bay).svg\n        CC BY_SA 4.0",
      en: "sp4.png — Google Pixel 8 Pro, Bay\n        File:Google Pixel 8 Pro back (Bay).svg\n        CC BY_SA 4.0",
    },
    "kifftech_sp6jpg_nothing_phone_2a_filenothing_phon": {
      fr: "sp6.jpg — Nothing Phone (2a)\n        File:Nothing phone (2a).jpg\n        CC BY_SA 4.0",
      en: "sp6.jpg — Nothing Phone (2a)\n        File:Nothing phone (2a).jpg\n        CC BY_SA 4.0",
    },
    "kifftech_sp8jpg_oppo_find_x7_ultra_fileoppo_find_": {
      fr: "sp8.jpg — OPPO Find X7 Ultra\n        File:Oppo Find X7 Ultra.jpg\n        CC BY_SA 4.0",
      en: "sp8.jpg — OPPO Find X7 Ultra\n        File:Oppo Find X7 Ultra.jpg\n        CC BY_SA 4.0",
    },
    kifftech_steam_controllerjpg_valve_steam_controll: {
      fr: "steam_controller.jpg — Valve Steam Controller (2026)\n        File:Steam Controller with Puck.jpg\n        CC BY_SA 4.0",
      en: "steam_controller.jpg — Valve Steam Controller (2026)\n        File:Steam Controller with Puck.jpg\n        CC BY_SA 4.0",
    },
    kifftech_steam_deckjpg_valve_steam_deck_filesteam: {
      fr: "steam_deck.jpg — Valve Steam Deck\n        File:Steam Deck (front).png\n        CC BY_SA 4.0",
      en: "steam_deck.jpg — Valve Steam Deck\n        File:Steam Deck (front).png\n        CC BY_SA 4.0",
    },
    kifftech_steam_framejpg_valve_steam_frame_fileste: {
      fr: "steam_frame.jpg — Valve Steam Frame\n        File:Steam Frame with controllers.jpg\n        CC BY 4.0",
      en: "steam_frame.jpg — Valve Steam Frame\n        File:Steam Frame with controllers.jpg\n        CC BY 4.0",
    },
    kifftech_steam_machinejpg_valve_steam_machine_fil: {
      fr: "steam_machine.jpg — Valve Steam Machine\n        File:Steam machine front.jpg\n        CC BY_SA 4.0",
      en: "steam_machine.jpg — Valve Steam Machine\n        File:Steam machine front.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_suivants_": {
      fr: "Suivants ›",
      en: "Suivants ›",
    },
    kifftech_surface_go_3jpg_microsoft_surface_go_3_f: {
      fr: "surface_go_3.jpg — Microsoft Surface Go 3\n        File:MS Surface Go 3.png\n        CC BY 4.0",
      en: "surface_go_3.jpg — Microsoft Surface Go 3\n        File:MS Surface Go 3.png\n        CC BY 4.0",
    },
    kifftech_surface_laptop_7jpg_microsoft_surface_la: {
      fr: "surface_laptop_7.jpg — Microsoft Surface Laptop 7\n        File:Microsoft Surface Laptop 7.jpg\n        CC0",
      en: "surface_laptop_7.jpg — Microsoft Surface Laptop 7\n        File:Microsoft Surface Laptop 7.jpg\n        CC0",
    },
    kifftech_surface_pro_11jpg_microsoft_surface_pro_: {
      fr: "surface_pro_11.jpg — Microsoft Surface Pro 11\n        File:Microsoft Surface Pro.jpg\n        Public domain",
      en: "surface_pro_11.jpg — Microsoft Surface Pro 11\n        File:Microsoft Surface Pro.jpg\n        Public domain",
    },
    kifftech_surface_pro_9jpg_microsoft_surface_pro_9: {
      fr: "surface_pro_9.jpg — Microsoft Surface Pro 9\n        File:Surface Pro 9 in Sapphire colour.jpg\n        CC BY_SA 4.0",
      en: "surface_pro_9.jpg — Microsoft Surface Pro 9\n        File:Surface Pro 9 in Sapphire colour.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_tb13jpg_xiaomi_pad_7_filexiaomi_pad_7jpg": {
      fr: "tb13.jpg — Xiaomi Pad 7\n        File:Xiaomi Pad 7.jpg\n        CC (Commons)",
      en: "tb13.jpg — Xiaomi Pad 7\n        File:Xiaomi Pad 7.jpg\n        CC (Commons)",
    },
    "kifftech_tb1jpg_ipad_pro_13_m4_fileabout_ipad_pro": {
      fr: "tb1.jpg — iPad Pro 13 M4\n        File:About iPad Pro 13_inch (M4).jpg\n        CC BY_SA 4.0",
      en: "tb1.jpg — iPad Pro 13 M4\n        File:About iPad Pro 13_inch (M4).jpg\n        CC BY_SA 4.0",
    },
    "kifftech_tb2jpg_galaxy_tab_s9_ultra_gamme_tab_s9_": {
      fr: "tb2.jpg — Galaxy Tab S9 Ultra, gamme Tab S9\n        File:20230729 삼성 갤럭시 탭 S9.jpg\n        CC (Commons)",
      en: "tb2.jpg — Galaxy Tab S9 Ultra, gamme Tab S9\n        File:20230729 삼성 갤럭시 탭 S9.jpg\n        CC (Commons)",
    },
    "kifftech_tb3jpg_xiaomi_pad_6s_pro_filexiaomi_pad_": {
      fr: "tb3.jpg — Xiaomi Pad 6S Pro\n        File:Xiaomi Pad 6S Pro.jpg\n        CC BY_SA 4.0",
      en: "tb3.jpg — Xiaomi Pad 6S Pro\n        File:Xiaomi Pad 6S Pro.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_tb6png_google_pixel_tablet_filegoogle_pi": {
      fr: "tb6.png — Google Pixel Tablet\n        File:Google Pixel Tablet.png\n        CC BY_SA 4.0",
      en: "tb6.png — Google Pixel Tablet\n        File:Google Pixel Tablet.png\n        CC BY_SA 4.0",
    },
    "kifftech_tb8jpg_huawei_matepad_pro_gamme_132_file": {
      fr: "tb8.jpg — Huawei MatePad Pro, gamme 13.2\n        File:Huawei MatePad Pro.jpg\n        CC BY_SA 4.0",
      en: "tb8.jpg — Huawei MatePad Pro, gamme 13.2\n        File:Huawei MatePad Pro.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_times": {
      fr: "&times;",
      en: "&times;",
    },
    "kifftech_total_de_la_commande": {
      fr: "Total de la commande",
      en: "Total de la commande",
    },
    "kifftech_tous_les_objets": {
      fr: "Tous les objets",
      en: "Tous les objets",
    },
    "kifftech_transparence_nous_ninventons_aucun_prix_": {
      fr: "Transparence : nous n'inventons aucun prix, aucune remise et aucune garantie. Les promotions dépendent des accords conclus avec les fournisseurs et peuvent varier d'un produit à l'autre. Les délais sont des estimations, pas des engagements contractuels.",
      en: "Transparence : nous n'inventons aucun prix, aucune remise et aucune garantie. Les promotions dépendent des accords conclus avec les fournisseurs et peuvent varier d'un produit à l'autre. Les délais sont des estimations, pas des engagements contractuels.",
    },
    "kifftech_trier": {
      fr: "Trier",
      en: "Trier",
    },
    "kifftech_trier_les_produits": {
      fr: "Trier les produits",
      en: "Trier les produits",
    },
    "kifftech_trier_par_prix": {
      fr: "Trier par prix",
      en: "Trier par prix",
    },
    "kifftech_un_index_raisonn_de_la_tech_contemporain": {
      fr: "Un index raisonné de la tech contemporaine : flagships, pliables, machines de calcul, audio, drones, consoles et objets connectés. Prix officiels, sélection KiffTech et visuels libres — de 2020 à 2026.",
      en: "Un index raisonné de la tech contemporaine : flagships, pliables, machines de calcul, audio, drones, consoles et objets connectés. Prix officiels, sélection KiffTech et visuels libres — de 2020 à 2026.",
    },
    "kifftech_vider_le_cache": {
      fr: "Vider le cache",
      en: "Vider le cache",
    },
    "kifftech_vider_le_cache_kifftech": {
      fr: "Vider le cache KiffTech",
      en: "Vider le cache KiffTech",
    },
    "kifftech_voir_le_dtail": {
      fr: "Voir le détail",
      en: "Voir le détail",
    },
    "kifftech_vr1jpg_apple_vision_pro_fileapple_vision": {
      fr: "vr1.jpg — Apple Vision Pro\n        File:Apple Vision Pro on display.jpg\n        CC BY_SA 4.0",
      en: "vr1.jpg — Apple Vision Pro\n        File:Apple Vision Pro on display.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_vr2jpg_meta_quest_3_filemeta_quest_3_fro": {
      fr: "vr2.jpg — Meta Quest 3\n        File:Meta Quest 3 front View.jpg\n        CC BY_SA 4.0",
      en: "vr2.jpg — Meta Quest 3\n        File:Meta Quest 3 front View.jpg\n        CC BY_SA 4.0",
    },
    "kifftech_vr5jpg_pico_4_ultra_filepico_4_ultra_hea": {
      fr: "vr5.jpg — PICO 4 Ultra\n        File:Pico 4 ultra headset.jpg\n        CC BY_SA 4.0",
      en: "vr5.jpg — PICO 4 Ultra\n        File:Pico 4 ultra headset.jpg\n        CC BY_SA 4.0",
    },
    kifftech_watch_series_10jpg_apple_watch_series_10: {
      fr: "watch_series_10.jpg — Apple Watch Series 10\n        File:Apple Watch Series 10.jpg\n        Public domain",
      en: "watch_series_10.jpg — Apple Watch Series 10\n        File:Apple Watch Series 10.jpg\n        Public domain",
    },
    kifftech_watch_series_7jpg_apple_watch_series_7_f: {
      fr: "watch_series_7.jpg — Apple Watch Series 7\n        File:Apple Watch Series 7; January 2022 (02).jpg\n        CC BY 2.0",
      en: "watch_series_7.jpg — Apple Watch Series 7\n        File:Apple Watch Series 7; January 2022 (02).jpg\n        CC BY 2.0",
    },
    kifftech_watch_series_8jpg_apple_watch_series_8_f: {
      fr: "watch_series_8.jpg — Apple Watch Series 8\n        File:Apple Watch Series 8.jpg\n        CC BY_SA 4.0",
      en: "watch_series_8.jpg — Apple Watch Series 8\n        File:Apple Watch Series 8.jpg\n        CC BY_SA 4.0",
    },
    kifftech_watch_series_9jpg_apple_watch_series_9_f: {
      fr: "watch_series_9.jpg — Apple Watch Series 9\n        File:Apple Watch Series 9 (cropped).jpg\n        CC BY_SA 4.0",
      en: "watch_series_9.jpg — Apple Watch Series 9\n        File:Apple Watch Series 9 (cropped).jpg\n        CC BY_SA 4.0",
    },
    "kifftech_wikimedia_commons": {
      fr: "Wikimedia Commons",
      en: "Wikimedia Commons",
    },
    "kifftech_wikimedia_visuels_libres": {
      fr: "Wikimedia visuels libres",
      en: "Wikimedia visuels libres",
    },
    "kifftech_words": {
      fr: "${words}",
      en: "${words}",
    },
    kifftech_xiaomi_13jpg_xiaomi_13_filexiaomi_13_fro: {
      fr: "xiaomi_13.jpg — Xiaomi 13\n        File:Xiaomi 13 front.jpg\n        CC BY_SA 4.0",
      en: "xiaomi_13.jpg — Xiaomi 13\n        File:Xiaomi 13 front.jpg\n        CC BY_SA 4.0",
    },
    kifftech_xiaomi_pad_6jpg_xiaomi_pad_6_filexiaomi_: {
      fr: "xiaomi_pad_6.jpg — Xiaomi Pad 6\n        File:Xiaomi Pad 6 display.jpg\n        CC0",
      en: "xiaomi_pad_6.jpg — Xiaomi Pad 6\n        File:Xiaomi Pad 6 display.jpg\n        CC0",
    },
    kifftech_xperia_1_vjpg_sony_xperia_1_v_filesony_x: {
      fr: "xperia_1_v.jpg — Sony Xperia 1 V\n        File:Sony Xperia 1 V.png\n        CC0",
      en: "xperia_1_v.jpg — Sony Xperia 1 V\n        File:Sony Xperia 1 V.png\n        CC0",
    },
    "linguistic_motors_": {
      fr: "🧠",
      en: "🧠",
    },
    "linguistic_motors_benchmark": {
      fr: "Benchmark",
      en: "Benchmark",
    },
    "linguistic_motors_bpe": {
      fr: "BPE",
      en: "BPE",
    },
    "linguistic_motors_bpewordpieceunigram_interactif_vocabulai": {
      fr: "BPE/WordPiece/Unigram interactif : vocabulaire, merges, compression ratio, tokens spéciaux.",
      en: "BPE/WordPiece/Unigram interactif : vocabulaire, merges, compression ratio, tokens spéciaux.",
    },
    "linguistic_motors_embedding_explorer": {
      fr: "Embedding Explorer",
      en: "Embedding Explorer",
    },
    linguistic_motors_embedding_explorerprojection_2d3d_t_sne_: {
      fr: "Embedding ExplorerProjection 2D/3D (t_SNE, UMAP, PCA), similarité cosinus, analogies vectorielles, clusters.Embeddingst_SNEUMAPExplorer →",
      en: "Embedding ExplorerProjection 2D/3D (t_SNE, UMAP, PCA), similarité cosinus, analogies vectorielles, clusters.Embeddingst_SNEUMAPExplorer →",
    },
    "linguistic_motors_embeddings": {
      fr: "Embeddings",
      en: "Embeddings",
    },
    linguistic_motors_fine_tuning_low_rank_quantization_4_bit_: {
      fr: "Fine_tuning low_rank, quantization 4_bit NF4, gradient checkpointing, export GGML/GGUF/ONNX.",
      en: "Fine_tuning low_rank, quantization 4_bit NF4, gradient checkpointing, export GGML/GGUF/ONNX.",
    },
    "linguistic_motors_generation_playground": {
      fr: "Generation Playground",
      en: "Generation Playground",
    },
    linguistic_motors_generation_playgroundsampling_top_kp_tem: {
      fr: "Generation PlaygroundSampling top_k/p, temperature, repetition penalty, logits bias, seeds reproductibles, streaming.GénérationSamplingStreamingGénérer →",
      en: "Generation PlaygroundSampling top_k/p, temperature, repetition penalty, logits bias, seeds reproductibles, streaming.GénérationSamplingStreamingGénérer →",
    },
    "linguistic_motors_gguf": {
      fr: "GGUF",
      en: "GGUF",
    },
    "linguistic_motors_gnration": {
      fr: "Génération",
      en: "Génération",
    },
    "linguistic_motors_gptq": {
      fr: "GPTQ",
      en: "GPTQ",
    },
    "linguistic_motors_gptq_awq_gguf_q2_kq8_0_calibration_perpl": {
      fr: "GPTQ, AWQ, GGUF q2_k→q8_0, calibration, perplexity eval, benchmark vitesse/mémoire.",
      en: "GPTQ, AWQ, GGUF q2_k→q8_0, calibration, perplexity eval, benchmark vitesse/mémoire.",
    },
    linguistic_motors_local_first: {
      fr: "Local_First",
      en: "Local_First",
    },
    linguistic_motors_local_first_runtime: {
      fr: "Local_First Runtime",
      en: "Local_First Runtime",
    },
    linguistic_motors_local_first_runtimewebllm_transformersjs: {
      fr: "Local_First RuntimeWebLLM, Transformers.js, llama.cpp WASM, ONNX Runtime Web. Zero_server inference.Local_FirstWASMZero_ServerTester →",
      en: "Local_First RuntimeWebLLM, Transformers.js, llama.cpp WASM, ONNX Runtime Web. Zero_server inference.Local_FirstWASMZero_ServerTester →",
    },
    "linguistic_motors_lora": {
      fr: "LoRA",
      en: "LoRA",
    },
    "linguistic_motors_loraqlora_trainer": {
      fr: "LoRA/QLoRA Trainer",
      en: "LoRA/QLoRA Trainer",
    },
    linguistic_motors_loraqlora_trainerfine_tuning_low_rank_qu: {
      fr: "LoRA/QLoRA TrainerFine_tuning low_rank, quantization 4_bit NF4, gradient checkpointing, export GGML/GGUF/ONNX.LoRAQLoRAGGUFEntraîner →",
      en: "LoRA/QLoRA TrainerFine_tuning low_rank, quantization 4_bit NF4, gradient checkpointing, export GGML/GGUF/ONNX.LoRAQLoRAGGUFEntraîner →",
    },
    "linguistic_motors_moteurs_linguistiques": {
      fr: "Moteurs linguistiques",
      en: "Moteurs linguistiques",
    },
    linguistic_motors_projection_2d3d_t_sne_umap_pca_similarit: {
      fr: "Projection 2D/3D (t_SNE, UMAP, PCA), similarité cosinus, analogies vectorielles, clusters.",
      en: "Projection 2D/3D (t_SNE, UMAP, PCA), similarité cosinus, analogies vectorielles, clusters.",
    },
    "linguistic_motors_qlora": {
      fr: "QLoRA",
      en: "QLoRA",
    },
    "linguistic_motors_quantization": {
      fr: "Quantization",
      en: "Quantization",
    },
    "linguistic_motors_quantization_lab": {
      fr: "Quantization Lab",
      en: "Quantization Lab",
    },
    "linguistic_motors_quantization_labgptq_awq_gguf_q2_kq8_0_c": {
      fr: "Quantization LabGPTQ, AWQ, GGUF q2_k→q8_0, calibration, perplexity eval, benchmark vitesse/mémoire.QuantizationGPTQBenchmarkQuantifier →",
      en: "Quantization LabGPTQ, AWQ, GGUF q2_k→q8_0, calibration, perplexity eval, benchmark vitesse/mémoire.QuantizationGPTQBenchmarkQuantifier →",
    },
    "linguistic_motors_sampling": {
      fr: "Sampling",
      en: "Sampling",
    },
    linguistic_motors_sampling_top_kp_temperature_repetition_p: {
      fr: "Sampling top_k/p, temperature, repetition penalty, logits bias, seeds reproductibles, streaming.",
      en: "Sampling top_k/p, temperature, repetition penalty, logits bias, seeds reproductibles, streaming.",
    },
    "linguistic_motors_streaming": {
      fr: "Streaming",
      en: "Streaming",
    },
    linguistic_motors_t_sne: {
      fr: "t_SNE",
      en: "t_SNE",
    },
    "linguistic_motors_tokenizer": {
      fr: "Tokenizer",
      en: "Tokenizer",
    },
    "linguistic_motors_tokenizer_visualizer": {
      fr: "Tokenizer Visualizer",
      en: "Tokenizer Visualizer",
    },
    "linguistic_motors_tokenizer_visualizerbpewordpieceunigram_": {
      fr: "Tokenizer VisualizerBPE/WordPiece/Unigram interactif : vocabulaire, merges, compression ratio, tokens spéciaux.TokenizerBPEVisualisationVisualiser →",
      en: "Tokenizer VisualizerBPE/WordPiece/Unigram interactif : vocabulaire, merges, compression ratio, tokens spéciaux.TokenizerBPEVisualisationVisualiser →",
    },
    "linguistic_motors_umap": {
      fr: "UMAP",
      en: "UMAP",
    },
    "linguistic_motors_visualisation": {
      fr: "Visualisation",
      en: "Visualisation",
    },
    "linguistic_motors_wasm": {
      fr: "WASM",
      en: "WASM",
    },
    "linguistic_motors_webllm_transformersjs_llamacpp_wasm_onnx": {
      fr: "WebLLM, Transformers.js, llama.cpp WASM, ONNX Runtime Web. Zero_server inference.",
      en: "WebLLM, Transformers.js, llama.cpp WASM, ONNX Runtime Web. Zero_server inference.",
    },
    linguistic_motors_zero_server: {
      fr: "Zero_Server",
      en: "Zero_Server",
    },
    "prototype_100": {
      fr: "/100",
      en: "/100",
    },
    "prototype_10_jours": {
      fr: "10 jours",
      en: "10 jours",
    },
    "prototype_124_": {
      fr: "+12,4 %",
      en: "+12,4 %",
    },
    "prototype_1_842": {
      fr: "1 842",
      en: "1 842",
    },
    "prototype_23_": {
      fr: "−2,3 %",
      en: "−2,3 %",
    },
    "prototype_24_pts_vs_priode_prcdente": {
      fr: "+2,4 pts vs période précédente",
      en: "+2,4 pts vs période précédente",
    },
    "prototype_30_jours": {
      fr: "30 jours",
      en: "30 jours",
    },
    "prototype_3_271": {
      fr: "3 271",
      en: "3 271",
    },
    "prototype_412": {
      fr: "412",
      en: "412",
    },
    "prototype_42_": {
      fr: "+4,2 %",
      en: "+4,2 %",
    },
    "prototype_7_derniers_jours": {
      fr: "7 derniers jours",
      en: "7 derniers jours",
    },
    "prototype_7_jours": {
      fr: "7 jours",
      en: "7 jours",
    },
    "prototype_80_": {
      fr: "80 %",
      en: "80 %",
    },
    "prototype_81_": {
      fr: "+8,1 %",
      en: "+8,1 %",
    },
    "prototype_85_": {
      fr: "85 %",
      en: "85 %",
    },
    "prototype_90_": {
      fr: "90 %",
      en: "90 %",
    },
    "prototype_91": {
      fr: "91",
      en: "91",
    },
    "prototype_91100": {
      fr: "91/100",
      en: "91/100",
    },
    "prototype_93_": {
      fr: "93 %",
      en: "93 %",
    },
    "prototype_96": {
      fr: "96",
      en: "96",
    },
    "prototype_999_": {
      fr: "99,9 %",
      en: "99,9 %",
    },
    "prototype_administration": {
      fr: "Administration",
      en: "Administration",
    },
    "prototype_alertes_rcentes": {
      fr: "Alertes récentes",
      en: "Alertes récentes",
    },
    "prototype_appliquer": {
      fr: "Appliquer",
      en: "Appliquer",
    },
    "prototype_au": {
      fr: "Au",
      en: "Au",
    },
    "prototype_aucune_valeur_saisie_nest_affiche_ici_le": {
      fr: "Aucune valeur saisie n'est affichée ici. Les soumissions complètes restent dans une table protégée côté serveur.",
      en: "Aucune valeur saisie n'est affichée ici. Les soumissions complètes restent dans une table protégée côté serveur.",
    },
    "prototype_boutons_0": {
      fr: "Boutons 0",
      en: "Boutons 0",
    },
    "prototype_ces_donnes_sont_spares_des_requtes_googl": {
      fr: "Ces données sont séparées des requêtes Google Search Console.",
      en: "Ces données sont séparées des requêtes Google Search Console.",
    },
    "prototype_chaque_clic_est_rattach_un_identifiant_s": {
      fr: "Chaque clic est rattaché à un identifiant stable, sans donnée personnelle.",
      en: "Chaque clic est rattaché à un identifiant stable, sans donnée personnelle.",
    },
    "prototype_clics": {
      fr: "Clics",
      en: "Clics",
    },
    "prototype_composantes_du_score_affich_au_sommet_de": {
      fr: "Composantes du score affiché au sommet de la montagne.",
      en: "Composantes du score affiché au sommet de la montagne.",
    },
    "prototype_ctr": {
      fr: "CTR",
      en: "CTR",
    },
    "prototype_diffr_23_jours": {
      fr: "Différé 2–3 jours",
      en: "Différé 2–3 jours",
    },
    "prototype_disponibilit": {
      fr: "Disponibilité",
      en: "Disponibilité",
    },
    "prototype_dmarrages_envois_succs_et_erreurs": {
      fr: "Démarrages, envois, succès et erreurs.",
      en: "Démarrages, envois, succès et erreurs.",
    },
    "prototype_donnes_google_distinctes_des_recherches_": {
      fr: "Données Google, distinctes des recherches internes.",
      en: "Données Google, distinctes des recherches internes.",
    },
    "prototype_du": {
      fr: "Du",
      en: "Du",
    },
    "prototype_faible": {
      fr: "Faible",
      en: "Faible",
    },
    "prototype_fiabilit": {
      fr: "Fiabilité",
      en: "Fiabilité",
    },
    "prototype_fiabilit_du_projet": {
      fr: "Fiabilité du projet",
      en: "Fiabilité du projet",
    },
    "prototype_formulaires": {
      fr: "Formulaires",
      en: "Formulaires",
    },
    "prototype_formulaires_envoys": {
      fr: "Formulaires envoyés",
      en: "Formulaires envoyés",
    },
    "prototype_fracheur_des_donnes": {
      fr: "Fraîcheur des données",
      en: "Fraîcheur des données",
    },
    "prototype_google_ne_fournit_pas_ces_donnes_en_temp": {
      fr: "Google ne fournit pas ces données en temps réel et masque certaines requêtes. Ne pas les additionner aux recherches internes.",
      en: "Google ne fournit pas ces données en temps réel et masque certaines requêtes. Ne pas les additionner aux recherches internes.",
    },
    "prototype_google_search_console": {
      fr: "Google Search Console",
      en: "Google Search Console",
    },
    "prototype_gsc": {
      fr: "GSC",
      en: "GSC",
    },
    "prototype_impressions": {
      fr: "Impressions",
      en: "Impressions",
    },
    "prototype_keffstation": {
      fr: "Keffstation",
      en: "Keffstation",
    },
    "prototype_les_tests_de_refus_de_carte_se_font_uniq": {
      fr: "Les tests de refus de carte se font uniquement en Sandbox. Aucune commande réelle n'est créée.",
      en: "Les tests de refus de carte se font uniquement en Sandbox. Aucune commande réelle n'est créée.",
    },
    "prototype_lev": {
      fr: "Élevé",
      en: "Élevé",
    },
    "prototype_liens_0": {
      fr: "Liens 0",
      en: "Liens 0",
    },
    "prototype_liens_boutons_onglets_et_menus": {
      fr: "Liens, boutons, onglets et menus.",
      en: "Liens, boutons, onglets et menus.",
    },
    "prototype_menus_0": {
      fr: "Menus 0",
      en: "Menus 0",
    },
    "prototype_mis_jour_1432": {
      fr: "Mis à jour à 14:32",
      en: "Mis à jour à 14:32",
    },
    "prototype_ne_pas_dployer_tel_quel_la_2fa_sera_ajou": {
      fr: "Ne pas déployer tel quel. La 2FA sera ajoutée avant la mise en ligne.",
      en: "Ne pas déployer tel quel. La 2FA sera ajoutée avant la mise en ligne.",
    },
    "prototype_onglets_0": {
      fr: "Onglets 0",
      en: "Onglets 0",
    },
    "prototype_personnalis": {
      fr: "Personnalisé",
      en: "Personnalisé",
    },
    "prototype_poids_15_": {
      fr: "Poids 15 %",
      en: "Poids 15 %",
    },
    "prototype_poids_20_": {
      fr: "Poids 20 %",
      en: "Poids 20 %",
    },
    "prototype_poids_30_": {
      fr: "Poids 30 %",
      en: "Poids 30 %",
    },
    "prototype_position": {
      fr: "Position",
      en: "Position",
    },
    "prototype_priv": {
      fr: "Privé",
      en: "Privé",
    },
    "prototype_prototype_local_donnes_fictives_aucune_d": {
      fr: "Prototype local · Données fictives · Aucune donnée personnelle",
      en: "Prototype local · Données fictives · Aucune donnée personnelle",
    },
    "prototype_qualit_technique": {
      fr: "Qualité technique",
      en: "Qualité technique",
    },
    "prototype_recherches": {
      fr: "Recherches",
      en: "Recherches",
    },
    "prototype_recherches_effectues_sur_keffstation_tem": {
      fr: "Recherches effectuées sur Keffstation — temps réel.",
      en: "Recherches effectuées sur Keffstation — temps réel.",
    },
    "prototype_recherches_internes": {
      fr: "Recherches internes",
      en: "Recherches internes",
    },
    "prototype_sommet_central_fiabilit_crtes_activit": {
      fr: "Sommet central = fiabilité · crêtes = activité",
      en: "Sommet central = fiabilité · crêtes = activité",
    },
    "prototype_succs_formulaires": {
      fr: "Succès formulaires",
      en: "Succès formulaires",
    },
    "prototype_succs_paiements": {
      fr: "Succès paiements",
      en: "Succès paiements",
    },
    "prototype_synthse_de_la_priode_slectionne": {
      fr: "Synthèse de la période sélectionnée.",
      en: "Synthèse de la période sélectionnée.",
    },
    "prototype_top_clics": {
      fr: "Top clics",
      en: "Top clics",
    },
    "prototype_visites": {
      fr: "Visites",
      en: "Visites",
    },
    "prototype_vue_densemble": {
      fr: "Vue d'ensemble",
      en: "Vue d'ensemble",
    },
    "tricktrocjob_abonnement_mensuel_facturation_auto_fidl": {
      fr: "Abonnement mensuel, facturation auto, fidélisation. Ex: maintenance PC, cours hebdo, livraison courses.",
      en: "Abonnement mensuel, facturation auto, fidélisation. Ex: maintenance PC, cours hebdo, livraison courses.",
    },
    "tricktrocjob_auto": {
      fr: "Auto",
      en: "Auto",
    },
    "tricktrocjob_change": {
      fr: "Échange",
      en: "Échange",
    },
    "tricktrocjob_changer_un_trox": {
      fr: "Échanger un Trox",
      en: "Échanger un Trox",
    },
    "tricktrocjob_changer_un_troxmettre_en_ligne_un_objet_": {
      fr: "Échanger un TroxMettre en ligne un objet, gérer les propositions, finaliser l'échange en main propre ou par envoi.TroxÉchangeObjetPublier →",
      en: "Échanger un TroxMettre en ligne un objet, gérer les propositions, finaliser l'échange en main propre ou par envoi.TroxÉchangeObjetPublier →",
    },
    "tricktrocjob_communaut_locale": {
      fr: "Communauté locale",
      en: "Communauté locale",
    },
    "tricktrocjob_communaut_localevnements_ville_par_ville": {
      fr: "Communauté localeÉvénements ville par ville, échanges en main propre, ateliers réparation. Zéro frais port.LocalRencontreConfianceRejoindre →",
      en: "Communauté localeÉvénements ville par ville, échanges en main propre, ateliers réparation. Zéro frais port.LocalRencontreConfianceRejoindre →",
    },
    "tricktrocjob_comptence": {
      fr: "Compétence",
      en: "Compétence",
    },
    "tricktrocjob_confiance": {
      fr: "Confiance",
      en: "Confiance",
    },
    "tricktrocjob_conomie": {
      fr: "Économie",
      en: "Économie",
    },
    "tricktrocjob_crdits": {
      fr: "Crédits",
      en: "Crédits",
    },
    "tricktrocjob_crer_un_trix": {
      fr: "Créer un Trix",
      en: "Créer un Trix",
    },
    "tricktrocjob_crer_un_trixtutoriel_pas_pas_pour_publie": {
      fr: "Créer un TrixTutoriel pas à pas pour publier votre astuce ou tutoriel. Structure virale, étapes numérotées, photos qualité.TutorielPublicationTrixCommencer →",
      en: "Créer un TrixTutoriel pas à pas pour publier votre astuce ou tutoriel. Structure virale, étapes numérotées, photos qualité.TutorielPublicationTrixCommencer →",
    },
    "tricktrocjob_crer_une_offre_de_service_fixer_le_prix_": {
      fr: "Créer une offre de service, fixer le prix (crédits/€), gérer les clients, facturation auto.",
      en: "Créer une offre de service, fixer le prix (crédits/€), gérer les clients, facturation auto.",
    },
    "tricktrocjob_expertise": {
      fr: "Expertise",
      en: "Expertise",
    },
    "tricktrocjob_format": {
      fr: "Format",
      en: "Format",
    },
    tricktrocjob_format_60_90s_hook_3s_dmo_claire_cta_crd: {
      fr: "Format 60_90s, hook 3s, démo claire, CTA crédits. Vertical, sous_titres, +300% engagement.",
      en: "Format 60_90s, hook 3s, démo claire, CTA crédits. Vertical, sous_titres, +300% engagement.",
    },
    "tricktrocjob_freelance": {
      fr: "Freelance",
      en: "Freelance",
    },
    "tricktrocjob_gagner_des_crdits": {
      fr: "Gagner des crédits",
      en: "Gagner des crédits",
    },
    "tricktrocjob_gagner_des_crditssystme_de_rcompenses_pa": {
      fr: "Gagner des créditsSystème de récompenses, parrainage 500 crédits/filleul, bonus de validation, économie dégressive 17%→5%.CréditsRécompenseÉconomieVoir →",
      en: "Gagner des créditsSystème de récompenses, parrainage 500 crédits/filleul, bonus de validation, économie dégressive 17%→5%.CréditsRécompenseÉconomieVoir →",
    },
    "tricktrocjob_gratuit_pour_objets_500_certificat_authe": {
      fr: "Gratuit pour objets >500€. Certificat authenticité, estimation marché, assurance transport incluse.",
      en: "Gratuit pour objets >500€. Certificat authenticité, estimation marché, assurance transport incluse.",
    },
    "tricktrocjob_local": {
      fr: "Local",
      en: "Local",
    },
    "tricktrocjob_luxe": {
      fr: "Luxe",
      en: "Luxe",
    },
    "tricktrocjob_mettre_en_ligne_un_objet_grer_les_propos": {
      fr: "Mettre en ligne un objet, gérer les propositions, finaliser l'échange en main propre ou par envoi.",
      en: "Mettre en ligne un objet, gérer les propositions, finaliser l'échange en main propre ou par envoi.",
    },
    "tricktrocjob_objet": {
      fr: "Objet",
      en: "Objet",
    },
    "tricktrocjob_objets_rares_expertise_pro": {
      fr: "Objets rares : expertise pro",
      en: "Objets rares : expertise pro",
    },
    "tricktrocjob_objets_rares_expertise_progratuit_pour_o": {
      fr: "Objets rares : expertise proGratuit pour objets >500€. Certificat authenticité, estimation marché, assurance transport incluse.ExpertiseLuxeSécuritéDemander →",
      en: "Objets rares : expertise proGratuit pour objets >500€. Certificat authenticité, estimation marché, assurance transport incluse.ExpertiseLuxeSécuritéDemander →",
    },
    "tricktrocjob_proposer_un_service": {
      fr: "Proposer un Service",
      en: "Proposer un Service",
    },
    "tricktrocjob_proposer_un_servicecrer_une_offre_de_ser": {
      fr: "Proposer un ServiceCréer une offre de service, fixer le prix (crédits/€), gérer les clients, facturation auto.ServiceFreelanceCompétenceCréer →",
      en: "Proposer un ServiceCréer une offre de service, fixer le prix (crédits/€), gérer les clients, facturation auto.ServiceFreelanceCompétenceCréer →",
    },
    "tricktrocjob_publication": {
      fr: "Publication",
      en: "Publication",
    },
    "tricktrocjob_rcompense": {
      fr: "Récompense",
      en: "Récompense",
    },
    "tricktrocjob_rcurrent": {
      fr: "Récurrent",
      en: "Récurrent",
    },
    "tricktrocjob_rencontre": {
      fr: "Rencontre",
      en: "Rencontre",
    },
    "tricktrocjob_revenus": {
      fr: "Revenus",
      en: "Revenus",
    },
    "tricktrocjob_scurit": {
      fr: "Sécurité",
      en: "Sécurité",
    },
    "tricktrocjob_service": {
      fr: "Service",
      en: "Service",
    },
    "tricktrocjob_service_rcurrent": {
      fr: "Service récurrent",
      en: "Service récurrent",
    },
    "tricktrocjob_service_rcurrentabonnement_mensuel_factu": {
      fr: "Service récurrentAbonnement mensuel, facturation auto, fidélisation. Ex: maintenance PC, cours hebdo, livraison courses.RécurrentRevenusAutoConfigurer →",
      en: "Service récurrentAbonnement mensuel, facturation auto, fidélisation. Ex: maintenance PC, cours hebdo, livraison courses.RécurrentRevenusAutoConfigurer →",
    },
    "tricktrocjob_systme_de_rcompenses_parrainage_500_crdi": {
      fr: "Système de récompenses, parrainage 500 crédits/filleul, bonus de validation, économie dégressive 17%→5%.",
      en: "Système de récompenses, parrainage 500 crédits/filleul, bonus de validation, économie dégressive 17%→5%.",
    },
    "tricktrocjob_tricktrocjob": {
      fr: "Tricktrocjob",
      en: "Tricktrocjob",
    },
    "tricktrocjob_trix": {
      fr: "Trix",
      en: "Trix",
    },
    "tricktrocjob_trix_vido_court": {
      fr: "Trix vidéo court",
      en: "Trix vidéo court",
    },
    tricktrocjob_trix_vido_courtformat_60_90s_hook_3s_dmo: {
      fr: "Trix vidéo courtFormat 60_90s, hook 3s, démo claire, CTA crédits. Vertical, sous_titres, +300% engagement.VidéoFormatViralCréer →",
      en: "Trix vidéo courtFormat 60_90s, hook 3s, démo claire, CTA crédits. Vertical, sous_titres, +300% engagement.VidéoFormatViralCréer →",
    },
    "tricktrocjob_trox": {
      fr: "Trox",
      en: "Trox",
    },
    "tricktrocjob_tutoriel": {
      fr: "Tutoriel",
      en: "Tutoriel",
    },
    "tricktrocjob_tutoriel_pas_pas_pour_publier_votre_astu": {
      fr: "Tutoriel pas à pas pour publier votre astuce ou tutoriel. Structure virale, étapes numérotées, photos qualité.",
      en: "Tutoriel pas à pas pour publier votre astuce ou tutoriel. Structure virale, étapes numérotées, photos qualité.",
    },
    "tricktrocjob_vido": {
      fr: "Vidéo",
      en: "Vidéo",
    },
    "tricktrocjob_viral": {
      fr: "Viral",
      en: "Viral",
    },
    "tricktrocjob_vnements_ville_par_ville_changes_en_main": {
      fr: "Événements ville par ville, échanges en main propre, ateliers réparation. Zéro frais port.",
      en: "Événements ville par ville, échanges en main propre, ateliers réparation. Zéro frais port.",
    },
    "viartificial_labs_": {
      fr: "🤖",
      en: "🤖",
    },
    "viartificial_labs_1_discuter": {
      fr: "1 · Discuter",
      en: "1 · Discuter",
    },
    "viartificial_labs_2_observer_live_partags_par_toi": {
      fr: "2 · Observer & live (partagés par toi)",
      en: "2 · Observer & live (partagés par toi)",
    },
    "viartificial_labs_3_agir_jeu_compatible": {
      fr: "3 · Agir (jeu compatible)",
      en: "3 · Agir (jeu compatible)",
    },
    "viartificial_labs__": {
      fr: "_⛶",
      en: "_⛶",
    },
    "viartificial_labs___rduire": {
      fr: "_ Réduire",
      en: "_ Réduire",
    },
    "viartificial_labs__actions_outils_explicitement_connects": {
      fr: "⚒️ Actions (outils explicitement connectés)",
      en: "⚒️ Actions (outils explicitement connectés)",
    },
    "viartificial_labs__activit_en_cours": {
      fr: "📝 Activité en cours",
      en: "📝 Activité en cours",
    },
    "viartificial_labs__annuler": {
      fr: "✕ Annuler",
      en: "✕ Annuler",
    },
    "viartificial_labs__arrter": {
      fr: "■ Arrêter",
      en: "■ Arrêter",
    },
    "viartificial_labs__arrter_reprendre_la_main": {
      fr: "■ Arrêter Reprendre la main",
      en: "■ Arrêter Reprendre la main",
    },
    "viartificial_labs__au_premier_plan": {
      fr: "⭐ Au premier plan",
      en: "⭐ Au premier plan",
    },
    "viartificial_labs__battlenet_non_connect_aucune_connexion_": {
      fr: "🔴 Battle.net : non connecté (aucune connexion annoncée)",
      en: "🔴 Battle.net : non connecté (aucune connexion annoncée)",
    },
    "viartificial_labs__bots": {
      fr: "← Bots",
      en: "← Bots",
    },
    "viartificial_labs__camra": {
      fr: "🎥 Caméra",
      en: "🎥 Caméra",
    },
    "viartificial_labs__camra_coupe": {
      fr: "🔴 Caméra : coupée",
      en: "🔴 Caméra : coupée",
    },
    "viartificial_labs__charger_le_llm_blm": {
      fr: "⚡ Charger le LLM + BLM",
      en: "⚡ Charger le LLM + BLM",
    },
    viartificial_labs__charger_le_modle_local_390_mo_wi_fi_rec: {
      fr: "📥 Charger le modèle local (≈390 Mo, Wi_Fi recommandé)",
      en: "📥 Charger le modèle local (≈390 Mo, Wi_Fi recommandé)",
    },
    "viartificial_labs__cookies_traceurs_aucun": {
      fr: "🍪 Cookies / traceurs : aucun",
      en: "🍪 Cookies / traceurs : aucun",
    },
    "viartificial_labs__cran": {
      fr: "🖥 Écran",
      en: "🖥 Écran",
    },
    "viartificial_labs__cran_non_partag": {
      fr: "🔴 Écran : non partagé",
      en: "🔴 Écran : non partagé",
    },
    "viartificial_labs__cran_son": {
      fr: "🖥+🔊 Écran + son",
      en: "🖥+🔊 Écran + son",
    },
    "viartificial_labs__diagnostics_appareil_pas_de_conclusion_": {
      fr: "🔍 Diagnostics appareil (pas de conclusion hâtive)",
      en: "🔍 Diagnostics appareil (pas de conclusion hâtive)",
    },
    viartificial_labs__hors_ligne_service_workers_des_4_pwa_: {
      fr: "📴 Hors_ligne (service workers des 4 PWA) : —",
      en: "📴 Hors_ligne (service workers des 4 PWA) : —",
    },
    "viartificial_labs__hub_keffstation": {
      fr: "← Hub KeffStation",
      en: "← Hub KeffStation",
    },
    "viartificial_labs__la_famille": {
      fr: "🤖 La famille",
      en: "🤖 La famille",
    },
    "viartificial_labs__micro_camra_partage_dcran_position_lusa": {
      fr: "🎙️ Micro · 📷 Caméra · 🖥️ Partage d’écran · 📍 Position : à l’usage uniquement",
      en: "🎙️ Micro · 📷 Caméra · 🖥️ Partage d’écran · 📍 Position : à l’usage uniquement",
    },
    "viartificial_labs__micro_coup": {
      fr: "🔴 Micro : coupé",
      en: "🔴 Micro : coupé",
    },
    "viartificial_labs__micro_voix": {
      fr: "🎙 Micro (voix)",
      en: "🎙 Micro (voix)",
    },
    "viartificial_labs__notifications_fin_de_rponse_actions_": {
      fr: "🔔 Notifications (fin de réponse, actions) : —",
      en: "🔔 Notifications (fin de réponse, actions) : —",
    },
    "viartificial_labs__nouvelle_sance": {
      fr: "＋ Nouvelle séance",
      en: "＋ Nouvelle séance",
    },
    "viartificial_labs__panneau_latral": {
      fr: "◧ Panneau latéral",
      en: "◧ Panneau latéral",
    },
    "viartificial_labs__parler_direct_via_": {
      fr: "💬 Parler direct à ViA →",
      en: "💬 Parler direct à ViA →",
    },
    "viartificial_labs__plein_cran": {
      fr: "⛶ Plein écran",
      en: "⛶ Plein écran",
    },
    "viartificial_labs__profils_indisponibles_ressayer": {
      fr: "⚠️ Profils indisponibles. ↻ Réessayer",
      en: "⚠️ Profils indisponibles. ↻ Réessayer",
    },
    "viartificial_labs__recharger_les_profils": {
      fr: "↻ Recharger les profils",
      en: "↻ Recharger les profils",
    },
    "viartificial_labs__ressayer": {
      fr: "↻ Réessayer",
      en: "↻ Réessayer",
    },
    "viartificial_labs__retour_au_hub_keffstation": {
      fr: "← Retour au hub KeffStation",
      en: "← Retour au hub KeffStation",
    },
    "viartificial_labs__rglages": {
      fr: "⚙️ Réglages",
      en: "⚙️ Réglages",
    },
    "viartificial_labs__stockage_persistant_vite_la_purge_par_l": {
      fr: "💾 Stockage persistant (évite la purge par le navigateur) : —",
      en: "💾 Stockage persistant (évite la purge par le navigateur) : —",
    },
    "viartificial_labs__superbots_familliya": {
      fr: "← SuperBots Familliya",
      en: "← SuperBots Familliya",
    },
    "viartificial_labs__tout_arrter": {
      fr: "■ Tout arrêter",
      en: "■ Tout arrêter",
    },
    "viartificial_labs__voix_en_direct_non_intgre": {
      fr: "🔴 Voix en direct : non intégrée",
      en: "🔴 Voix en direct : non intégrée",
    },
    "viartificial_labs__xsstream_geeko_geekette": {
      fr: "🎮 xsStream — Geeko & Geekette",
      en: "🎮 xsStream — Geeko & Geekette",
    },
    "viartificial_labs__xsstream_geeko_geekette_ct_de_la_partie": {
      fr: "🎮 xsStream : Geeko & Geekette à côté de la partie →",
      en: "🎮 xsStream : Geeko & Geekette à côté de la partie →",
    },
    "viartificial_labs_accord_modle_ia_": {
      fr: "Accord modèle IA : —",
      en: "Accord modèle IA : —",
    },
    "viartificial_labs_adresse_ollamaendpoint": {
      fr: "Adresse (Ollama/endpoint)",
      en: "Adresse (Ollama/endpoint)",
    },
    "viartificial_labs_agir_nexiste_que_dans_un_jeu_expliciteme": {
      fr: "Agir n’existe que dans un jeu explicitement compatible et connecté. En attendant : discuter et observer seulement.",
      en: "Agir n’existe que dans un jeu explicitement compatible et connecté. En attendant : discuter et observer seulement.",
    },
    "viartificial_labs_aucun_jeu_connect_pour_linstant_renseign": {
      fr: "Aucun jeu connecté pour l’instant. Renseigne ton jeu et ton édition (champ libre, aucune liste imposée) : c’est stocké localement, sans connexion.",
      en: "Aucun jeu connecté pour l’instant. Renseigne ton jeu et ton édition (champ libre, aucune liste imposée) : c’est stocké localement, sans connexion.",
    },
    "viartificial_labs_aucune_action_en_cours": {
      fr: "Aucune action en cours.",
      en: "Aucune action en cours.",
    },
    viartificial_labs_auto_test_non_lanc: {
      fr: "Auto_test non lancé.",
      en: "Auto_test non lancé.",
    },
    "viartificial_labs_autorisations_de_la_plateforme_keffstati": {
      fr: "Autorisations de la plateforme KeffStation (KiffTech, Tricktrocjob, ViArtificial, Videogames)",
      en: "Autorisations de la plateforme KeffStation (KiffTech, Tricktrocjob, ViArtificial, Videogames)",
    },
    "viartificial_labs_autoriser": {
      fr: "Autoriser",
      en: "Autoriser",
    },
    "viartificial_labs_autoriser_le_moteur_local": {
      fr: "Autoriser le moteur local",
      en: "Autoriser le moteur local",
    },
    "viartificial_labs_autoriser_le_tlchargement_du_modle_ia_et": {
      fr: "Autoriser le téléchargement du modèle IA et son stockage sur cet appareil pour discuter avec les SuperBots ?",
      en: "Autoriser le téléchargement du modèle IA et son stockage sur cet appareil pour discuter avec les SuperBots ?",
    },
    "viartificial_labs_autoriserplus_tarddtails": {
      fr: "AutoriserPlus tardDétails",
      en: "AutoriserPlus tardDétails",
    },
    viartificial_labs_blm_auto_test_en_cours: {
      fr: "BLM : auto_test en cours…",
      en: "BLM : auto_test en cours…",
    },
    "viartificial_labs_blm_non_tests": {
      fr: "BLM : non testés",
      en: "BLM : non testés",
    },
    "viartificial_labs_bot": {
      fr: "Bot",
      en: "Bot",
    },
    "viartificial_labs_carte_didentit_locale_token_automatique_": {
      fr: "Carte d’identité locale (token automatique, sur cet appareil uniquement)",
      en: "Carte d’identité locale (token automatique, sur cet appareil uniquement)",
    },
    "viartificial_labs_ceci_nest_pas_un_bandeau_cookies_aucun_t": {
      fr: "Ceci n’est pas un bandeau cookies : aucun traceur, aucun cookie facultatif. Le bouton « Autoriser » accorde le modèle + stockage persistant + notifications ; micro, caméra, partage d’écran et position restent demandés séparément par le navigateur, uniquement par la fonction qui en a besoin. Accord retirable à tout moment dans ⚙️ Réglages (avec suppression des fichiers).",
      en: "Ceci n’est pas un bandeau cookies : aucun traceur, aucun cookie facultatif. Le bouton « Autoriser » accorde le modèle + stockage persistant + notifications ; micro, caméra, partage d’écran et position restent demandés séparément par le navigateur, uniquement par la fonction qui en a besoin. Accord retirable à tout moment dans ⚙️ Réglages (avec suppression des fichiers).",
    },
    "viartificial_labs_champ_adresse_remplir_seulement_si_tu_di": {
      fr: "Champ Adresse : à remplir seulement si tu disposes d’un serveur Ollama joignable depuis cet appareil (sinon, utilise le moteur local). Sans moteur joignable, aucune réponse n’est simulée.",
      en: "Champ Adresse : à remplir seulement si tu disposes d’un serveur Ollama joignable depuis cet appareil (sinon, utilise le moteur local). Sans moteur joignable, aucune réponse n’est simulée.",
    },
    "viartificial_labs_chaque_sance_garde_son_contexte_spar_les": {
      fr: "Chaque séance garde son contexte séparé. Les anciennes séances restent consultables mais ne rejoignent jamais le contexte sans reprise explicite.",
      en: "Chaque séance garde son contexte séparé. Les anciennes séances restent consultables mais ne rejoignent jamais le contexte sans reprise explicite.",
    },
    "viartificial_labs_charge_accord_": {
      fr: "Chargée : — · Accord : —",
      en: "Chargée : — · Accord : —",
    },
    "viartificial_labs_chargement_des_profils": {
      fr: "Chargement des profils…",
      en: "Chargement des profils…",
    },
    "viartificial_labs_charger_recharger_le_moteur_local": {
      fr: "Charger / recharger le moteur local",
      en: "Charger / recharger le moteur local",
    },
    "viartificial_labs_cl_ventuelle_session_seule_jamais_sauveg": {
      fr: "Clé éventuelle (session seule, jamais sauvegardée)",
      en: "Clé éventuelle (session seule, jamais sauvegardée)",
    },
    "viartificial_labs_compagnon_de_partie_la_discussion_utilis": {
      fr: "Compagnon de partie. La discussion utilise le moteur configuré, sinon elle reste impossible (aucune simulation).",
      en: "Compagnon de partie. La discussion utilise le moteur configuré, sinon elle reste impossible (aucune simulation).",
    },
    "viartificial_labs_compagnon_geeko_geekette_": {
      fr: "Compagnon Geeko 🧑‍💻Geekette 👩‍💻",
      en: "Compagnon Geeko 🧑‍💻Geekette 👩‍💻",
    },
    "viartificial_labs_comptence_15_12345": {
      fr: "Compétence (1–5) 12345",
      en: "Compétence (1–5) 12345",
    },
    "viartificial_labs_conversation": {
      fr: "Conversation",
      en: "Conversation",
    },
    viartificial_labs_conversation_directe_via_superbots_box_s: {
      fr: "Conversation directe — ViA & SuperBots\n\n*{box_sizing:border_box;margin:0;padding:0}\n:root{color_scheme:dark}html,body{height:100%;background:#070816;color:#f4f6ff;font:16px/1.55 system_ui,sans_serif}\n.app{min_height:100vh;min_height:100dvh;display:flex;flex_direction:column;max_width:1100px;margin:0 auto;width:100%}\nheader.top{padding:12px 16px;background:rgba(10,12,34,.9);border_bottom:1px solid rgba(255,255,255,.1);display:flex;align_items:center;gap:8px;position:sticky;top:0;z_index:20;flex_wrap:wrap}\nheader.top a{color:#ffd23f;text_decoration:none;border:1px solid rgba(255,210,63,.5);border_radius:999px;padding:10px 14px;min_height:44px;display:inline_flex;align_items:center;font_size:.85rem}\nheader.top h1{font_size:1rem;flex:1;min_width:140px}\n.toolbar{display:flex;gap:8px;flex_wrap:wrap}\n.toolbar button{min_height:44px;padding:10px 14px;border_radius:999px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.06);color:#fff;font_size:.85rem}\n.toolbar button[aria_pressed=\"true\"]{border_color:#ffd23f;color:#ffd23f}\n.stage{flex:1;display:flex;gap:16px;padding:16px;align_items:flex_start}\n.activity{flex:1;min_width:0;border:1px dashed rgba(255,255,255,.2);border_radius:14px;padding:16px;color:#b9c0e6}\n.activity h2{font_size:1rem;color:#fff;margin_bottom:8px}\n.msn{width:min(420px,100%);border:1px solid rgba(184,77,255,.6);border_radius:14px;overflow:hidden;background:#0d1026;display:flex;flex_direction:column;box_shadow:0 12px 40px rgba(184,77,255,.25)}\n.msn_title{display:flex;align_items:center;gap:10px;padding:10px 12px;background:linear_gradient(135deg,#2a1b4d,#4d1b3a)}\n.msn_title .avatar{font_size:1.8rem}\n.msn_title .who{flex:1;min_width:0}\n.msn_title .who strong{display:block;font_size:.95rem}\n.status{display:flex;align_items:center;gap:6px;font_size:.78rem;color:#9fe8b8}\n.dot{width:10px;height:10px;border_radius:50%;background:#27d17f;flex_shrink:0}\n.winbtns{display:flex;gap:6px}\n.winbtns button{min_width:44px;min_height:44px;border_radius:10px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.06);color:#fff;font_size:1rem}\n#thread{padding:12px;display:flex;flex_direction:column;gap:8px;min_height:220px;max_height:46vh;overflow_y:auto}\n.msg{border_radius:12px;padding:10px 12px;max_width:92%;font_size:.95rem}\n.msg.bot{align_self:flex_start;background:rgba(255,255,255,.07);border:1px solid rgba(184,77,255,.4)}\n.msg.me{align_self:flex_end;background:rgba(184,77,255,.25)}\n.msg .meta{display:block;font_size:.72rem;color:#b9c0e6;margin_bottom:4px}\nform.composer{display:flex;gap:8px;padding:10px;border_top:1px solid rgba(255,255,255,.12);background:#070816}\ntextarea{flex:1;min_height:48px;max_height:120px;border_radius:12px;border:1px solid rgba(255,255,255,.2);background:#12142e;color:#fff;padding:10px 12px;font_size:1rem;resize:vertical}\n.composer button{min_height:48px;min_width:56px;border_radius:12px;border:1px solid #b84dff;background:linear_gradient(135deg,#b84dff,#ff3d9a);color:#fff;font_weight:700;font_size:1.1rem}\na:focus_visible,button:focus_visible,textarea:focus_visible{outline:2px solid #ffd23f;outline_offset:2px}\nbody[data_mode=\"fullscreen\"] .activity{display:none}\nbody[data_mode=\"fullscreen\"] .msn{width:100%}\nbody[data_mode=\"fullscreen\"] #thread{max_height:60vh}\nbody[data_mode=\"side\"] .stage{flex_direction:row}\nbody[data_mode=\"side\"] .msn{position:sticky;top:70px}\nbody[data_min=\"1\"] .msn{display:none}\n#settings{margin:12px 16px 0;border:1px solid rgba(184,77,255,.5);border_radius:12px;padding:12px 14px;background:rgba(184,77,255,.07)}\n#settings h2{font_size:1rem;color:#ffd23f;margin_bottom:8px}\n#settings label{display:block;margin:6px 0;font_size:.85rem}\n#settings input,#settings select{min_height:44px;border_radius:10px;border:1px solid rgba(255,255,255,.2);background:#12142e;color:#fff;padding:6px 10px;width:100%}\n#settings button{min_height:48px;padding:10px 18px;border_radius:999px;border:1px solid #ffd23f;background:transparent;color:#ffd23f;margin:4px 4px 0 0;font_size:.9rem}\n#consentBar{margin:10px 16px 0;max_width:720px;border:1px solid rgba(184,77,255,.6);border_radius:14px;padding:12px 14px;background:rgba(184,77,255,.08)}\n#consentBar p{margin:6px 0;font_size:.9rem}\n#consentSize{color:#b9c0e6;font_size:.85rem}\n.consentBtns{display:flex;gap:8px;flex_wrap:wrap}\n.consentBtns button{min_height:52px;padding:12px 20px;border_radius:999px;font_weight:700;font_size:1rem}\n#consentGo{border:none;background:linear_gradient(135deg,#b84dff,#ff3d9a);color:#fff;flex:1;min_width:200px}\n#consentLater,#consentDetails{border:1px solid #ffd23f;background:transparent;color:#ffd23f}\n#consentDetailText{font_size:.82rem;color:#b9c0e6;border_top:1px solid rgba(255,255,255,.12);margin_top:8px;padding_top:8px}\n#progWrap{margin_top:8px;border_radius:10px;background:#020604;border:1px solid #1f8f3f;padding:10px 12px;font_family:ui_monospace,SFMono_Regular,Menlo,Consolas,monospace}\n#progWrap .term{color:#39ff6a;font_size:.78rem;line_height:1.7;white_space:pre_wrap}\n#progBar{height:14px;border_radius:4px;background:#06130a;border:1px solid #1f8f3f;overflow:hidden;margin_top:6px}\n#progFill{height:100%;width:0%;background:repeating_linear_gradient(90deg,#39ff6a 0 8px,#0a3d1c 8px 10px)}\n#progText{font_size:.8rem;color:#39ff6a;margin:6px 0 0}\n.blink{animation:blink 1s steps(1) infinite}\n@keyframes blink{50%{opacity:0}}\n@media (prefers_reduced_motion:reduce){.blink{animation:none}}\n#permList{list_style:none;margin:8px 0;padding:0;font_size:.82rem;color:#b9c0e6}\n#permList li{margin:4px 0}\n#permList strong{color:#ffd23f}\n#chips{display:flex;gap:8px;flex_wrap:nowrap;overflow_x:auto;margin:10px 16px 0;padding_bottom:4px}\n.chip{flex_shrink:0;min_height:48px;padding:8px 14px;border_radius:999px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:#b9c0e6;font_size:.85rem}\n.chip.on{border_color:#ffd23f;color:#ffd23f;background:rgba(255,210,63,.08)}\n.msg.sys{align_self:center;background:transparent;border:1px dashed rgba(255,255,255,.25);color:#b9c0e6;font_size:.82rem;max_width:96%}\n@media (max_width:720px){#consentBar{margin:8px 10px 0}#chips{margin:8px 10px 0}}\n.statusline{margin:10px 16px 0;font_size:.82rem;color:#b9c0e6}\n#gearBtn{min_width:48px;min_height:48px;border_radius:12px;border:1px solid rgba(255,210,63,.5);background:rgba(255,210,63,.08);color:#ffd23f;font_size:1.3rem}\n@media (max_width:720px){html,body{font_size:17px}.stage{flex_direction:column;padding:10px}body[data_mode=\"side\"] .stage{flex_direction:column}body[data_mode=\"side\"] .msn{position:static;width:100%}.msn{width:100%}#thread{max_height:none;min_height:44dvh}.msg{font_size:1rem;max_width:96%}textarea{min_height:56px}form.composer{padding_bottom:max(10px,env(safe_area_inset_bottom))}header.top{padding:10px 12px}#settings{margin:8px 10px 0}.statusline{margin:8px 10px 0}}\n.enginebar{display:flex;gap:8px;align_items:center;padding:8px 12px;font_size:.8rem;color:#b9c0e6;border_top:1px solid rgba(255,255,255,.1)}#cancel{min_height:44px;padding:8px 14px;border_radius:999px;border:1px solid #ff3d9a;background:transparent;color:#ff3d9a}#retryBtn{min_height:44px;padding:8px 14px;border_radius:999px;border:1px solid #ffd23f;background:transparent;color:#ffd23f}\n#llmBlmBar{margin:10px 16px 0;max_width:720px}\n#llmBlmBtn{min_height:56px;width:100%;padding:12px 18px;border_radius:999px;border:none;background:linear_gradient(135deg,#b84dff,#ff3d9a);color:#fff;font_weight:700;font_size:1rem;cursor:pointer;touch_action:manipulation}\n#llmBlmBtn[disabled]{opacity:.6;cursor:default}\n#llmBlmMsg{font_size:.82rem;color:#b9c0e6;margin_top:6px;min_height:1.2em}\n@media (min_width:721px) and (max_width:1024px){#llmBlmBar{margin:10px auto 0}#llmBlmBtn{font_size:1.02rem}}\n@media (min_width:1025px){#llmBlmBar{max_width:560px}#llmBlmBtn{width:auto;min_width:340px;font_size:1rem}}\n/* Parcours simplifié : la conversation d'abord, les réglages ensuite. */\n.app>header{order:0}\n#engineBanner{order:1}\n#viaControls{order:2}\n.stage{order:3}\n#consentBar{order:4}\n.toolbar{order:5}\n#seances{order:6}\n#settings{order:7}\n#chips,#llmBlmBar,#loadBar{display:none!important}\n#viaControls{display:flex;gap:10px;align_items:center;flex_wrap:wrap;margin:10px 16px 0;padding:8px 12px;border:1px solid rgba(255,255,255,.12);border_radius:12px;background:rgba(255,255,255,.04)}\n#viaControls label{display:flex;align_items:center;gap:6px;font_size:.78rem;color:#b9c0e6}\n#viaControls select{min_height:44px;max_width:100%;border_radius:10px;border:1px solid rgba(255,255,255,.2);background:#12142e;color:#fff;padding:6px 10px;font_size:.85rem}\n#engineUsed,#blmUsed{font_size:.72rem;color:#8f96bd;flex_basis:100%}\n#quickConsent{min_height:44px;padding:8px 14px;border_radius:999px;border:1px solid #ffd23f;background:transparent;color:#ffd23f;font_size:.8rem}\n@media (max_width:720px){#viaControls{margin:8px 10px 0}.toolbar{display:none}}\n@media (prefers_reduced_motion:reduce){*{animation:none!important;transition:none!important}}\n\n\n\n\n← BotsConversation⚙️Hub\n\n⛶ Plein écran\n◧ Panneau latéral\n_ Réduire\n\nMoteur : en attente d’autorisation…\n\n  Bot \n  Mode \n    Local — sur cet appareil\n    Hybride — BLM locaux + en ligne\n    En ligne — serveur configuré\n  \n  Autoriser le moteur local\n  Moteur utilisé : —\n  BLM : auto_test en cours…\n\n\nAutoriser le téléchargement du modèle IA et son stockage sur cet appareil pour discuter avec les SuperBots ?\nModèle … — ≈ … Mo à télécharger une seule fois (Wi_Fi conseillé). La progression réelle s’affiche pendant le téléchargement.\nAutoriserPlus tardDétails\n\n\nLe modèle est partagé par tous les SuperBots : chacun garde sa personnalité, sa mémoire et ses conversations. Licence : . Fichiers stockés dans le cache du navigateur, réutilisés sans re_téléchargement ; une fois cet accord donné, le moteur local se charge automatiquement en arrière_plan. Aucun téléchargement sans cet accord.\nAutorisations de la plateforme KeffStation (KiffTech, Tricktrocjob, ViArtificial, Videogames)\n\n🧠 Modèle IA local (≈ … Mo) : —",
      en: "Conversation directe — ViA & SuperBots\n\n*{box_sizing:border_box;margin:0;padding:0}\n:root{color_scheme:dark}html,body{height:100%;background:#070816;color:#f4f6ff;font:16px/1.55 system_ui,sans_serif}\n.app{min_height:100vh;min_height:100dvh;display:flex;flex_direction:column;max_width:1100px;margin:0 auto;width:100%}\nheader.top{padding:12px 16px;background:rgba(10,12,34,.9);border_bottom:1px solid rgba(255,255,255,.1);display:flex;align_items:center;gap:8px;position:sticky;top:0;z_index:20;flex_wrap:wrap}\nheader.top a{color:#ffd23f;text_decoration:none;border:1px solid rgba(255,210,63,.5);border_radius:999px;padding:10px 14px;min_height:44px;display:inline_flex;align_items:center;font_size:.85rem}\nheader.top h1{font_size:1rem;flex:1;min_width:140px}\n.toolbar{display:flex;gap:8px;flex_wrap:wrap}\n.toolbar button{min_height:44px;padding:10px 14px;border_radius:999px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.06);color:#fff;font_size:.85rem}\n.toolbar button[aria_pressed=\"true\"]{border_color:#ffd23f;color:#ffd23f}\n.stage{flex:1;display:flex;gap:16px;padding:16px;align_items:flex_start}\n.activity{flex:1;min_width:0;border:1px dashed rgba(255,255,255,.2);border_radius:14px;padding:16px;color:#b9c0e6}\n.activity h2{font_size:1rem;color:#fff;margin_bottom:8px}\n.msn{width:min(420px,100%);border:1px solid rgba(184,77,255,.6);border_radius:14px;overflow:hidden;background:#0d1026;display:flex;flex_direction:column;box_shadow:0 12px 40px rgba(184,77,255,.25)}\n.msn_title{display:flex;align_items:center;gap:10px;padding:10px 12px;background:linear_gradient(135deg,#2a1b4d,#4d1b3a)}\n.msn_title .avatar{font_size:1.8rem}\n.msn_title .who{flex:1;min_width:0}\n.msn_title .who strong{display:block;font_size:.95rem}\n.status{display:flex;align_items:center;gap:6px;font_size:.78rem;color:#9fe8b8}\n.dot{width:10px;height:10px;border_radius:50%;background:#27d17f;flex_shrink:0}\n.winbtns{display:flex;gap:6px}\n.winbtns button{min_width:44px;min_height:44px;border_radius:10px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.06);color:#fff;font_size:1rem}\n#thread{padding:12px;display:flex;flex_direction:column;gap:8px;min_height:220px;max_height:46vh;overflow_y:auto}\n.msg{border_radius:12px;padding:10px 12px;max_width:92%;font_size:.95rem}\n.msg.bot{align_self:flex_start;background:rgba(255,255,255,.07);border:1px solid rgba(184,77,255,.4)}\n.msg.me{align_self:flex_end;background:rgba(184,77,255,.25)}\n.msg .meta{display:block;font_size:.72rem;color:#b9c0e6;margin_bottom:4px}\nform.composer{display:flex;gap:8px;padding:10px;border_top:1px solid rgba(255,255,255,.12);background:#070816}\ntextarea{flex:1;min_height:48px;max_height:120px;border_radius:12px;border:1px solid rgba(255,255,255,.2);background:#12142e;color:#fff;padding:10px 12px;font_size:1rem;resize:vertical}\n.composer button{min_height:48px;min_width:56px;border_radius:12px;border:1px solid #b84dff;background:linear_gradient(135deg,#b84dff,#ff3d9a);color:#fff;font_weight:700;font_size:1.1rem}\na:focus_visible,button:focus_visible,textarea:focus_visible{outline:2px solid #ffd23f;outline_offset:2px}\nbody[data_mode=\"fullscreen\"] .activity{display:none}\nbody[data_mode=\"fullscreen\"] .msn{width:100%}\nbody[data_mode=\"fullscreen\"] #thread{max_height:60vh}\nbody[data_mode=\"side\"] .stage{flex_direction:row}\nbody[data_mode=\"side\"] .msn{position:sticky;top:70px}\nbody[data_min=\"1\"] .msn{display:none}\n#settings{margin:12px 16px 0;border:1px solid rgba(184,77,255,.5);border_radius:12px;padding:12px 14px;background:rgba(184,77,255,.07)}\n#settings h2{font_size:1rem;color:#ffd23f;margin_bottom:8px}\n#settings label{display:block;margin:6px 0;font_size:.85rem}\n#settings input,#settings select{min_height:44px;border_radius:10px;border:1px solid rgba(255,255,255,.2);background:#12142e;color:#fff;padding:6px 10px;width:100%}\n#settings button{min_height:48px;padding:10px 18px;border_radius:999px;border:1px solid #ffd23f;background:transparent;color:#ffd23f;margin:4px 4px 0 0;font_size:.9rem}\n#consentBar{margin:10px 16px 0;max_width:720px;border:1px solid rgba(184,77,255,.6);border_radius:14px;padding:12px 14px;background:rgba(184,77,255,.08)}\n#consentBar p{margin:6px 0;font_size:.9rem}\n#consentSize{color:#b9c0e6;font_size:.85rem}\n.consentBtns{display:flex;gap:8px;flex_wrap:wrap}\n.consentBtns button{min_height:52px;padding:12px 20px;border_radius:999px;font_weight:700;font_size:1rem}\n#consentGo{border:none;background:linear_gradient(135deg,#b84dff,#ff3d9a);color:#fff;flex:1;min_width:200px}\n#consentLater,#consentDetails{border:1px solid #ffd23f;background:transparent;color:#ffd23f}\n#consentDetailText{font_size:.82rem;color:#b9c0e6;border_top:1px solid rgba(255,255,255,.12);margin_top:8px;padding_top:8px}\n#progWrap{margin_top:8px;border_radius:10px;background:#020604;border:1px solid #1f8f3f;padding:10px 12px;font_family:ui_monospace,SFMono_Regular,Menlo,Consolas,monospace}\n#progWrap .term{color:#39ff6a;font_size:.78rem;line_height:1.7;white_space:pre_wrap}\n#progBar{height:14px;border_radius:4px;background:#06130a;border:1px solid #1f8f3f;overflow:hidden;margin_top:6px}\n#progFill{height:100%;width:0%;background:repeating_linear_gradient(90deg,#39ff6a 0 8px,#0a3d1c 8px 10px)}\n#progText{font_size:.8rem;color:#39ff6a;margin:6px 0 0}\n.blink{animation:blink 1s steps(1) infinite}\n@keyframes blink{50%{opacity:0}}\n@media (prefers_reduced_motion:reduce){.blink{animation:none}}\n#permList{list_style:none;margin:8px 0;padding:0;font_size:.82rem;color:#b9c0e6}\n#permList li{margin:4px 0}\n#permList strong{color:#ffd23f}\n#chips{display:flex;gap:8px;flex_wrap:nowrap;overflow_x:auto;margin:10px 16px 0;padding_bottom:4px}\n.chip{flex_shrink:0;min_height:48px;padding:8px 14px;border_radius:999px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:#b9c0e6;font_size:.85rem}\n.chip.on{border_color:#ffd23f;color:#ffd23f;background:rgba(255,210,63,.08)}\n.msg.sys{align_self:center;background:transparent;border:1px dashed rgba(255,255,255,.25);color:#b9c0e6;font_size:.82rem;max_width:96%}\n@media (max_width:720px){#consentBar{margin:8px 10px 0}#chips{margin:8px 10px 0}}\n.statusline{margin:10px 16px 0;font_size:.82rem;color:#b9c0e6}\n#gearBtn{min_width:48px;min_height:48px;border_radius:12px;border:1px solid rgba(255,210,63,.5);background:rgba(255,210,63,.08);color:#ffd23f;font_size:1.3rem}\n@media (max_width:720px){html,body{font_size:17px}.stage{flex_direction:column;padding:10px}body[data_mode=\"side\"] .stage{flex_direction:column}body[data_mode=\"side\"] .msn{position:static;width:100%}.msn{width:100%}#thread{max_height:none;min_height:44dvh}.msg{font_size:1rem;max_width:96%}textarea{min_height:56px}form.composer{padding_bottom:max(10px,env(safe_area_inset_bottom))}header.top{padding:10px 12px}#settings{margin:8px 10px 0}.statusline{margin:8px 10px 0}}\n.enginebar{display:flex;gap:8px;align_items:center;padding:8px 12px;font_size:.8rem;color:#b9c0e6;border_top:1px solid rgba(255,255,255,.1)}#cancel{min_height:44px;padding:8px 14px;border_radius:999px;border:1px solid #ff3d9a;background:transparent;color:#ff3d9a}#retryBtn{min_height:44px;padding:8px 14px;border_radius:999px;border:1px solid #ffd23f;background:transparent;color:#ffd23f}\n#llmBlmBar{margin:10px 16px 0;max_width:720px}\n#llmBlmBtn{min_height:56px;width:100%;padding:12px 18px;border_radius:999px;border:none;background:linear_gradient(135deg,#b84dff,#ff3d9a);color:#fff;font_weight:700;font_size:1rem;cursor:pointer;touch_action:manipulation}\n#llmBlmBtn[disabled]{opacity:.6;cursor:default}\n#llmBlmMsg{font_size:.82rem;color:#b9c0e6;margin_top:6px;min_height:1.2em}\n@media (min_width:721px) and (max_width:1024px){#llmBlmBar{margin:10px auto 0}#llmBlmBtn{font_size:1.02rem}}\n@media (min_width:1025px){#llmBlmBar{max_width:560px}#llmBlmBtn{width:auto;min_width:340px;font_size:1rem}}\n/* Parcours simplifié : la conversation d'abord, les réglages ensuite. */\n.app>header{order:0}\n#engineBanner{order:1}\n#viaControls{order:2}\n.stage{order:3}\n#consentBar{order:4}\n.toolbar{order:5}\n#seances{order:6}\n#settings{order:7}\n#chips,#llmBlmBar,#loadBar{display:none!important}\n#viaControls{display:flex;gap:10px;align_items:center;flex_wrap:wrap;margin:10px 16px 0;padding:8px 12px;border:1px solid rgba(255,255,255,.12);border_radius:12px;background:rgba(255,255,255,.04)}\n#viaControls label{display:flex;align_items:center;gap:6px;font_size:.78rem;color:#b9c0e6}\n#viaControls select{min_height:44px;max_width:100%;border_radius:10px;border:1px solid rgba(255,255,255,.2);background:#12142e;color:#fff;padding:6px 10px;font_size:.85rem}\n#engineUsed,#blmUsed{font_size:.72rem;color:#8f96bd;flex_basis:100%}\n#quickConsent{min_height:44px;padding:8px 14px;border_radius:999px;border:1px solid #ffd23f;background:transparent;color:#ffd23f;font_size:.8rem}\n@media (max_width:720px){#viaControls{margin:8px 10px 0}.toolbar{display:none}}\n@media (prefers_reduced_motion:reduce){*{animation:none!important;transition:none!important}}\n\n\n\n\n← BotsConversation⚙️Hub\n\n⛶ Plein écran\n◧ Panneau latéral\n_ Réduire\n\nMoteur : en attente d’autorisation…\n\n  Bot \n  Mode \n    Local — sur cet appareil\n    Hybride — BLM locaux + en ligne\n    En ligne — serveur configuré\n  \n  Autoriser le moteur local\n  Moteur utilisé : —\n  BLM : auto_test en cours…\n\n\nAutoriser le téléchargement du modèle IA et son stockage sur cet appareil pour discuter avec les SuperBots ?\nModèle … — ≈ … Mo à télécharger une seule fois (Wi_Fi conseillé). La progression réelle s’affiche pendant le téléchargement.\nAutoriserPlus tardDétails\n\n\nLe modèle est partagé par tous les SuperBots : chacun garde sa personnalité, sa mémoire et ses conversations. Licence : . Fichiers stockés dans le cache du navigateur, réutilisés sans re_téléchargement ; une fois cet accord donné, le moteur local se charge automatiquement en arrière_plan. Aucun téléchargement sans cet accord.\nAutorisations de la plateforme KeffStation (KiffTech, Tricktrocjob, ViArtificial, Videogames)\n\n🧠 Modèle IA local (≈ … Mo) : —",
    },
    "viartificial_labs_cran_non_partag_camra_coupe_micro_coup_p": {
      fr: "Écran : non partagé. Caméra : coupée. Micro : coupé. Prévisualisation locale uniquement — le compagnon n’analyse voix/image que si un service voix/moteur est connecté (aucun pour l’instant).",
      en: "Écran : non partagé. Caméra : coupée. Micro : coupé. Prévisualisation locale uniquement — le compagnon n’analyse voix/image que si un service voix/moteur est connecté (aucun pour l’instant).",
    },
    "viartificial_labs_dcharger_le_moteur_libre_la_mmoire": {
      fr: "Décharger le moteur (libère la mémoire)",
      en: "Décharger le moteur (libère la mémoire)",
    },
    "viartificial_labs_dernier_parcours_aucune_requte_depuis_le": {
      fr: "Dernier parcours : aucune requête depuis le chargement.",
      en: "Dernier parcours : aucune requête depuis le chargement.",
    },
    "viartificial_labs_dition_choisie": {
      fr: "Édition choisie",
      en: "Édition choisie",
    },
    "viartificial_labs_dtails": {
      fr: "Détails",
      en: "Détails",
    },
    "viartificial_labs_dtection_en_cours_activit_en_courspasse_": {
      fr: "détection en cours…\n\n\n\n📝 Activité en coursPasse en « Panneau latéral » pour utiliser ce panneau à côté de la conversation (ex. notes, plan GuideoPlan). Tout reste dans la PWA.",
      en: "détection en cours…\n\n\n\n📝 Activité en coursPasse en « Panneau latéral » pour utiliser ce panneau à côté de la conversation (ex. notes, plan GuideoPlan). Tout reste dans la PWA.",
    },
    "viartificial_labs_enregistrer_jeu_dition": {
      fr: "Enregistrer jeu + édition",
      en: "Enregistrer jeu + édition",
    },
    "viartificial_labs_enregistrer_rglages": {
      fr: "Enregistrer réglages",
      en: "Enregistrer réglages",
    },
    "viartificial_labs_escbavatar": {
      fr: "'+esc(b.avatar||'🤖')+'",
      en: "'+esc(b.avatar||'🤖')+'",
    },
    "viartificial_labs_escbavatarescbnameescbspecialtyescbperso": {
      fr: "'+esc(b.avatar||'🤖')+''+esc(b.name)+''+esc(b.specialty||'')+''+esc(b.personality||'')+''+t+'Ouvrir la conversation →",
      en: "'+esc(b.avatar||'🤖')+''+esc(b.name)+''+esc(b.specialty||'')+''+esc(b.personality||'')+''+t+'Ouvrir la conversation →",
    },
    "viartificial_labs_escbname": {
      fr: "'+esc(b.name)+'",
      en: "'+esc(b.name)+'",
    },
    "viartificial_labs_escbpersonality": {
      fr: "'+esc(b.personality||'')+'",
      en: "'+esc(b.personality||'')+'",
    },
    "viartificial_labs_escbspecialty": {
      fr: "'+esc(b.specialty||'')+'",
      en: "'+esc(b.specialty||'')+'",
    },
    "viartificial_labs_escx": {
      fr: "'+esc(x)+'",
      en: "'+esc(x)+'",
    },
    "viartificial_labs_fournisseur_modle_local_automatique_part": {
      fr: "Fournisseur Modèle local automatique (partagé)Ollama local (gratuit, sans clé)Endpoint compatible OpenAI (saisi par toi)Aucun (désactivé)",
      en: "Fournisseur Modèle local automatique (partagé)Ollama local (gratuit, sans clé)Endpoint compatible OpenAI (saisi par toi)Aucun (désactivé)",
    },
    "viartificial_labs_geeko_et_geekette_au_premier_plan_entour": {
      fr: "Geeko et Geekette au premier plan, entourés de ViA, GuideoPlan, GoleMotor, B.T.B. et Theo. 💬 Parler direct à ViA → · 🎮 xsStream : Geeko & Geekette à côté de la partie →",
      en: "Geeko et Geekette au premier plan, entourés de ViA, GuideoPlan, GoleMotor, B.T.B. et Theo. 💬 Parler direct à ViA → · 🎮 xsStream : Geeko & Geekette à côté de la partie →",
    },
    "viartificial_labs_hors_ligne_en_attente": {
      fr: "Hors ligne — en attente",
      en: "Hors ligne — en attente",
    },
    "viartificial_labs_hub": {
      fr: "Hub",
      en: "Hub",
    },
    "viartificial_labs_initiative_15_12345": {
      fr: "Initiative (1–5) 12345",
      en: "Initiative (1–5) 12345",
    },
    "viartificial_labs_jeu_choisi": {
      fr: "Jeu choisi",
      en: "Jeu choisi",
    },
    "viartificial_labs_le_modle_est_partag_par_tous_les_superbo": {
      fr: "Le modèle est partagé par tous les SuperBots : chacun garde sa personnalité, sa mémoire et ses conversations. Licence : . Fichiers stockés dans le cache du navigateur, réutilisés sans re_téléchargement ; une fois cet accord donné, le moteur local se charge automatiquement en arrière_plan. Aucun téléchargement sans cet accord.",
      en: "Le modèle est partagé par tous les SuperBots : chacun garde sa personnalité, sa mémoire et ses conversations. Licence : . Fichiers stockés dans le cache du navigateur, réutilisés sans re_téléchargement ; une fois cet accord donné, le moteur local se charge automatiquement en arrière_plan. Aucun téléchargement sans cet accord.",
    },
    "viartificial_labs_mode_local_sur_cet_appareil_hybride_blm_": {
      fr: "Mode \n    Local — sur cet appareil\n    Hybride — BLM locaux + en ligne\n    En ligne — serveur configuré",
      en: "Mode \n    Local — sur cet appareil\n    Hybride — BLM locaux + en ligne\n    En ligne — serveur configuré",
    },
    viartificial_labs_modle_mo_tlcharger_une_seule_fois_wi_fi_: {
      fr: "Modèle … — ≈ … Mo à télécharger une seule fois (Wi_Fi conseillé). La progression réelle s’affiche pendant le téléchargement.",
      en: "Modèle … — ≈ … Mo à télécharger une seule fois (Wi_Fi conseillé). La progression réelle s’affiche pendant le téléchargement.",
    },
    "viartificial_labs_modle_ollamaendpoint": {
      fr: "Modèle (Ollama/endpoint)",
      en: "Modèle (Ollama/endpoint)",
    },
    "viartificial_labs_modle_utilis_": {
      fr: "Modèle utilisé : —",
      en: "Modèle utilisé : —",
    },
    "viartificial_labs_moteur_actif_": {
      fr: "Moteur actif : —",
      en: "Moteur actif : —",
    },
    "viartificial_labs_moteur_en_attente_dautorisation": {
      fr: "Moteur : en attente d’autorisation…",
      en: "Moteur : en attente d’autorisation…",
    },
    "viartificial_labs_moteur_utilis_": {
      fr: "Moteur utilisé : —",
      en: "Moteur utilisé : —",
    },
    "viartificial_labs_note_1_": {
      fr: "Note 1 : …",
      en: "Note 1 : …",
    },
    "viartificial_labs_note_2_": {
      fr: "Note 2 : …",
      en: "Note 2 : …",
    },
    "viartificial_labs_ouverture_de_via": {
      fr: "Ouverture de ViA…",
      en: "Ouverture de ViA…",
    },
    "viartificial_labs_ouvrir_la_conversation_": {
      fr: "Ouvrir la conversation →",
      en: "Ouvrir la conversation →",
    },
    "viartificial_labs_parler_via_": {
      fr: "Parler à ViA →",
      en: "Parler à ViA →",
    },
    "viartificial_labs_plus_tard": {
      fr: "Plus tard",
      en: "Plus tard",
    },
    "viartificial_labs_profils_indisponibles": {
      fr: "Profils indisponibles.",
      en: "Profils indisponibles.",
    },
    "viartificial_labs_pulsation_des_rponses_mot_mot": {
      fr: "Pulsation des réponses (mot à mot)",
      en: "Pulsation des réponses (mot à mot)",
    },
    "viartificial_labs_redirection_automatique_vers_la_conversa": {
      fr: "Redirection automatique vers la conversation.",
      en: "Redirection automatique vers la conversation.",
    },
    viartificial_labs_relancer_lauto_test_blm: {
      fr: "Relancer l’auto_test BLM",
      en: "Relancer l’auto_test BLM",
    },
    "viartificial_labs_relecture_croise_geeko_geekette_une_phra": {
      fr: "Relecture croisée Geeko ↔ Geekette (une phrase max)",
      en: "Relecture croisée Geeko ↔ Geekette (une phrase max)",
    },
    "viartificial_labs_reprendre": {
      fr: "Reprendre",
      en: "Reprendre",
    },
    "viartificial_labs_reprendre_la_main": {
      fr: "Reprendre la main",
      en: "Reprendre la main",
    },
    "viartificial_labs_retirer_laccord": {
      fr: "Retirer l’accord",
      en: "Retirer l’accord",
    },
    "viartificial_labs_retirer_laccord_supprimer_les_modles_tlc": {
      fr: "Retirer l’accord Supprimer les modèles téléchargés",
      en: "Retirer l’accord Supprimer les modèles téléchargés",
    },
    "viartificial_labs_si_rien_ne_se_passe_touche_le_bouton_un_": {
      fr: "Si rien ne se passe, touche le bouton (un seul clic, aucune adresse à taper).",
      en: "Si rien ne se passe, touche le bouton (un seul clic, aucune adresse à taper).",
    },
    "viartificial_labs_stockage_navigateur_": {
      fr: "Stockage navigateur : —",
      en: "Stockage navigateur : —",
    },
    "viartificial_labs_superbots_familliya": {
      fr: "SuperBots Familliya",
      en: "SuperBots Familliya",
    },
    "viartificial_labs_supprimer_les_modles_tlchargs": {
      fr: "Supprimer les modèles téléchargés",
      en: "Supprimer les modèles téléchargés",
    },
    "viartificial_labs_tat_rel_du_moteur_et_des_blm": {
      fr: "État réel du moteur et des BLM",
      en: "État réel du moteur et des BLM",
    },
    "viartificial_labs_test_conteneur_linux_http_200_contrles_s": {
      fr: "Testé : conteneur Linux (HTTP 200, contrôles statiques). Non testé sur appareils physiques.",
      en: "Testé : conteneur Linux (HTTP 200, contrôles statiques). Non testé sur appareils physiques.",
    },
    "viartificial_labs_test_llm_aucun_test_effectu": {
      fr: "Test LLM : aucun test effectué.",
      en: "Test LLM : aucun test effectué.",
    },
    "viartificial_labs_tester": {
      fr: "Tester",
      en: "Tester",
    },
    "viartificial_labs_token_modle_": {
      fr: "Token : — · Modèle : —",
      en: "Token : — · Modèle : —",
    },
    "viartificial_labs_un_seul_moteur_cpuwasm_partag_en_web_wor": {
      fr: "Un seul moteur CPU/WASM partagé en Web Worker, conservé en cache. Aucun téléchargement sans ton appui.",
      en: "Un seul moteur CPU/WASM partagé en Web Worker, conservé en cache. Aucun téléchargement sans ton appui.",
    },
    "viartificial_labs_une_famille_de_compagnons_ia": {
      fr: "Une famille de compagnons IA",
      en: "Une famille de compagnons IA",
    },
    "viartificial_labs_uniquement_ce_que_tu_choisis_dactiver_un": {
      fr: "Uniquement ce que tu choisis d’activer, un flux à la fois ou combinés. Aucune activation automatique, rien d’enregistré, arrêt à tout moment.",
      en: "Uniquement ce que tu choisis d’activer, un flux à la fois ou combinés. Aucune activation automatique, rien d’enregistré, arrêt à tout moment.",
    },
    "viartificial_labs_wasm_rduit_le_risque_de_fermeture_par_ma": {
      fr: "WASM réduit le risque de fermeture par manque de mémoire mais ne le garantit pas : si le navigateur ferme l’onglet, relance la page — le cache évite de tout retélécharger.",
      en: "WASM réduit le risque de fermeture par manque de mémoire mais ne le garantit pas : si le navigateur ferme l’onglet, relance la page — le cache évite de tout retélécharger.",
    },
    viartificial_labs_xsstream_geeko_geekette_box_sizingborder: {
      fr: "xsStream — Geeko & Geekette\n\n*{box_sizing:border_box;margin:0;padding:0}\n:root{color_scheme:dark}html,body{background:#070816;color:#f4f6ff;font:16px/1.55 system_ui,sans_serif}\n.app{max_width:1100px;margin:0 auto;min_height:100vh;min_height:100dvh;display:flex;flex_direction:column}\nheader{padding:12px 16px;background:rgba(10,12,34,.9);border_bottom:1px solid rgba(255,255,255,.1);display:flex;gap:8px;align_items:center;position:sticky;top:0;z_index:10;flex_wrap:wrap}\nheader a{color:#ffd23f;text_decoration:none;border:1px solid rgba(255,210,63,.5);border_radius:999px;padding:10px 14px;min_height:44px;display:inline_flex;align_items:center;font_size:.85rem}\nheader h1{font_size:1rem;flex:1;min_width:160px}\n.badges{display:flex;gap:8px;flex_wrap:wrap;padding:12px 16px 0}\n.badge{font_size:.78rem;border:1px solid rgba(255,120,120,.5);color:#ffb3b3;border_radius:999px;padding:8px 12px}\n.badge.ok{border_color:rgba(39,209,127,.5);color:#9fe8b8}\n.grid{display:grid;gap:12px;padding:16px;grid_template_columns:repeat(auto_fit,minmax(min(300px,100%),1fr))}\n.cap{border:1px solid rgba(184,77,255,.5);border_radius:14px;padding:14px;background:#0d1026;display:flex;flex_direction:column;gap:10px}\n.cap h2{font_size:1rem;color:#ffd23f}\n.cap p,.cap li{font_size:.88rem;color:#b9c0e6}\n.cap ul{padding_left:18px}\nlabel{display:block;font_size:.88rem;margin:6px 0}\nselect,input{min_height:44px;border_radius:10px;border:1px solid rgba(255,255,255,.2);background:#12142e;color:#fff;padding:8px 10px;width:100%;font_size:1rem}\nbutton{min_height:48px;border_radius:999px;border:1px solid #b84dff;background:linear_gradient(135deg,#b84dff,#ff3d9a);color:#fff;font_weight:600;padding:10px 18px;font_size:.95rem}\nbutton.ghost{background:transparent;border_color:#ffd23f;color:#ffd23f}\nbutton:disabled{opacity:.45}\nvideo{width:100%;border_radius:10px;background:#000;min_height:160px}\na:focus_visible,button:focus_visible,select:focus_visible,input:focus_visible{outline:2px solid #ffd23f;outline_offset:2px}\n.note{font_size:.8rem;color:#8f96bd}\nfooter{padding:16px;text_align:center;color:#b9c0e6;font_size:.85rem}\nfooter a{color:#ffd23f}\n.live_row{display:flex;gap:8px;flex_wrap:wrap}\n.live_row button{flex:1;min_width:140px}\n#xCam{max_width:180px;min_height:100px}\n.meter{height:10px;border_radius:999px;background:rgba(255,255,255,.1);overflow:hidden}\n.meter i{display:block;height:100%;width:0;background:linear_gradient(90deg,#27d17f,#ffd23f,#ff3d9a)}\n@media (max_width:720px){.grid{grid_template_columns:1fr}}\n\n\n\n\n← Bots🎮 xsStream — Geeko & GeeketteHub\n\n🔴 Battle.net : non connecté (aucune connexion annoncée)\n🔴 Écran : non partagé\n🔴 Caméra : coupée\n🔴 Micro : coupé\n🔴 Voix en direct : non intégrée\n\n\n1 · Discuter\nCompagnon de partie. La discussion utilise le moteur configuré, sinon elle reste impossible (aucune simulation).\nCompagnon Geeko 🧑‍💻Geekette 👩‍💻\nCompétence (1–5) 12345\nInitiative (1–5) 12345\nEnregistrer réglages\nOuvrir la conversation →\n\n2 · Observer & live (partagés par toi)\nUniquement ce que tu choisis d’activer, un flux à la fois ou combinés. Aucune activation automatique, rien d’enregistré, arrêt à tout moment.\n\n\n\n🖥 Écran🖥+🔊 Écran + son🎥 Caméra🎙 Micro (voix)■ Tout arrêter\nÉcran : non partagé. Caméra : coupée. Micro : coupé. Prévisualisation locale uniquement — le compagnon n’analyse voix/image que si un service voix/moteur est connecté (aucun pour l’instant).\n3 · Agir (jeu compatible)\nAucun jeu connecté pour l’instant. Renseigne ton jeu et ton édition (champ libre, aucune liste imposée) : c’est stocké localement, sans connexion.\nJeu choisi \nÉdition choisie \nEnregistrer jeu + édition\n\n⛔ Pas de contrôle automatisé de WoW (EULA Blizzard l’interdit — veto documenté) ni de GeForce NOW sans intégration autorisée.",
      en: "xsStream — Geeko & Geekette\n\n*{box_sizing:border_box;margin:0;padding:0}\n:root{color_scheme:dark}html,body{background:#070816;color:#f4f6ff;font:16px/1.55 system_ui,sans_serif}\n.app{max_width:1100px;margin:0 auto;min_height:100vh;min_height:100dvh;display:flex;flex_direction:column}\nheader{padding:12px 16px;background:rgba(10,12,34,.9);border_bottom:1px solid rgba(255,255,255,.1);display:flex;gap:8px;align_items:center;position:sticky;top:0;z_index:10;flex_wrap:wrap}\nheader a{color:#ffd23f;text_decoration:none;border:1px solid rgba(255,210,63,.5);border_radius:999px;padding:10px 14px;min_height:44px;display:inline_flex;align_items:center;font_size:.85rem}\nheader h1{font_size:1rem;flex:1;min_width:160px}\n.badges{display:flex;gap:8px;flex_wrap:wrap;padding:12px 16px 0}\n.badge{font_size:.78rem;border:1px solid rgba(255,120,120,.5);color:#ffb3b3;border_radius:999px;padding:8px 12px}\n.badge.ok{border_color:rgba(39,209,127,.5);color:#9fe8b8}\n.grid{display:grid;gap:12px;padding:16px;grid_template_columns:repeat(auto_fit,minmax(min(300px,100%),1fr))}\n.cap{border:1px solid rgba(184,77,255,.5);border_radius:14px;padding:14px;background:#0d1026;display:flex;flex_direction:column;gap:10px}\n.cap h2{font_size:1rem;color:#ffd23f}\n.cap p,.cap li{font_size:.88rem;color:#b9c0e6}\n.cap ul{padding_left:18px}\nlabel{display:block;font_size:.88rem;margin:6px 0}\nselect,input{min_height:44px;border_radius:10px;border:1px solid rgba(255,255,255,.2);background:#12142e;color:#fff;padding:8px 10px;width:100%;font_size:1rem}\nbutton{min_height:48px;border_radius:999px;border:1px solid #b84dff;background:linear_gradient(135deg,#b84dff,#ff3d9a);color:#fff;font_weight:600;padding:10px 18px;font_size:.95rem}\nbutton.ghost{background:transparent;border_color:#ffd23f;color:#ffd23f}\nbutton:disabled{opacity:.45}\nvideo{width:100%;border_radius:10px;background:#000;min_height:160px}\na:focus_visible,button:focus_visible,select:focus_visible,input:focus_visible{outline:2px solid #ffd23f;outline_offset:2px}\n.note{font_size:.8rem;color:#8f96bd}\nfooter{padding:16px;text_align:center;color:#b9c0e6;font_size:.85rem}\nfooter a{color:#ffd23f}\n.live_row{display:flex;gap:8px;flex_wrap:wrap}\n.live_row button{flex:1;min_width:140px}\n#xCam{max_width:180px;min_height:100px}\n.meter{height:10px;border_radius:999px;background:rgba(255,255,255,.1);overflow:hidden}\n.meter i{display:block;height:100%;width:0;background:linear_gradient(90deg,#27d17f,#ffd23f,#ff3d9a)}\n@media (max_width:720px){.grid{grid_template_columns:1fr}}\n\n\n\n\n← Bots🎮 xsStream — Geeko & GeeketteHub\n\n🔴 Battle.net : non connecté (aucune connexion annoncée)\n🔴 Écran : non partagé\n🔴 Caméra : coupée\n🔴 Micro : coupé\n🔴 Voix en direct : non intégrée\n\n\n1 · Discuter\nCompagnon de partie. La discussion utilise le moteur configuré, sinon elle reste impossible (aucune simulation).\nCompagnon Geeko 🧑‍💻Geekette 👩‍💻\nCompétence (1–5) 12345\nInitiative (1–5) 12345\nEnregistrer réglages\nOuvrir la conversation →\n\n2 · Observer & live (partagés par toi)\nUniquement ce que tu choisis d’activer, un flux à la fois ou combinés. Aucune activation automatique, rien d’enregistré, arrêt à tout moment.\n\n\n\n🖥 Écran🖥+🔊 Écran + son🎥 Caméra🎙 Micro (voix)■ Tout arrêter\nÉcran : non partagé. Caméra : coupée. Micro : coupé. Prévisualisation locale uniquement — le compagnon n’analyse voix/image que si un service voix/moteur est connecté (aucun pour l’instant).\n3 · Agir (jeu compatible)\nAucun jeu connecté pour l’instant. Renseigne ton jeu et ton édition (champ libre, aucune liste imposée) : c’est stocké localement, sans connexion.\nJeu choisi \nÉdition choisie \nEnregistrer jeu + édition\n\n⛔ Pas de contrôle automatisé de WoW (EULA Blizzard l’interdit — veto documenté) ni de GeForce NOW sans intégration autorisée.",
    },
    "videogames_16_consoles_en_catalogue_kifftech_nes_me": {
      fr: "16 consoles en catalogue KiffTech : NES, Mega Drive, PS1, N64, Dreamcast, Switch 2, PS5, Xbox Series, Steam Deck Linux — photos, prix officiels et prix KiffTech.",
      en: "16 consoles en catalogue KiffTech : NES, Mega Drive, PS1, N64, Dreamcast, Switch 2, PS5, Xbox Series, Steam Deck Linux — photos, prix officiels et prix KiffTech.",
    },
    "videogames_arcade": {
      fr: "Arcade",
      en: "Arcade",
    },
    videogames_arcade_web_high_scores_tournois_replays_: {
      fr: "Arcade web : high_scores, tournois, replays, modding, cross_platform, PWA installable.",
      en: "Arcade web : high_scores, tournois, replays, modding, cross_platform, PWA installable.",
    },
    "videogames_benchmark": {
      fr: "Benchmark",
      en: "Benchmark",
    },
    "videogames_benchmarks_gpucpu": {
      fr: "Benchmarks GPU/CPU",
      en: "Benchmarks GPU/CPU",
    },
    "videogames_benchmarks_gpucpufps_frametime_1_low_01_": {
      fr: "Benchmarks GPU/CPUFPS, frametime, 1% low, 0.1% low, consommation, DLSS/FSR/XeSS, frame gen.BenchmarkPerformanceUpscalingBench →",
      en: "Benchmarks GPU/CPUFPS, frametime, 1% low, 0.1% low, consommation, DLSS/FSR/XeSS, frame gen.BenchmarkPerformanceUpscalingBench →",
    },
    "videogames_cloud": {
      fr: "Cloud",
      en: "Cloud",
    },
    "videogames_cloud_gaming": {
      fr: "Cloud Gaming",
      en: "Cloud Gaming",
    },
    "videogames_cloud_gaminggeforce_now_xbox_cloud_luna_": {
      fr: "Cloud GamingGeForce Now, Xbox Cloud, Luna, Shadow, Boosteroid — comparatif latence/prix/bitrate.CloudStreamingLatenceComparer →",
      en: "Cloud GamingGeForce Now, Xbox Cloud, Luna, Shadow, Boosteroid — comparatif latence/prix/bitrate.CloudStreamingLatenceComparer →",
    },
    "videogames_consoles_rtro_modernes": {
      fr: "Consoles Rétro & Modernes",
      en: "Consoles Rétro & Modernes",
    },
    "videogames_consoles_rtro_modernes16_consoles_en_cat": {
      fr: "Consoles Rétro & Modernes16 consoles en catalogue KiffTech : NES, Mega Drive, PS1, N64, Dreamcast, Switch 2, PS5, Xbox Series, Steam Deck Linux — photos, prix officiels et prix KiffTech.RétroModernesKiffTechVoir les consoles →",
      en: "Consoles Rétro & Modernes16 consoles en catalogue KiffTech : NES, Mega Drive, PS1, N64, Dreamcast, Switch 2, PS5, Xbox Series, Steam Deck Linux — photos, prix officiels et prix KiffTech.RétroModernesKiffTechVoir les consoles →",
    },
    "videogames_emulation": {
      fr: "Emulation",
      en: "Emulation",
    },
    "videogames_emulation_station": {
      fr: "Emulation Station",
      en: "Emulation Station",
    },
    "videogames_emulation_stationretroarch_dolphin_pcsx2": {
      fr: "Emulation StationRetroArch, Dolphin, PCSX2, Ryujinx, Cemu, PPSSPP — configs optimisées, shaders, netplay.EmulationRetroShadersConfig →",
      en: "Emulation StationRetroArch, Dolphin, PCSX2, Ryujinx, Cemu, PPSSPP — configs optimisées, shaders, netplay.EmulationRetroShadersConfig →",
    },
    "videogames_fps_frametime_1_low_01_low_consommation_": {
      fr: "FPS, frametime, 1% low, 0.1% low, consommation, DLSS/FSR/XeSS, frame gen.",
      en: "FPS, frametime, 1% low, 0.1% low, consommation, DLSS/FSR/XeSS, frame gen.",
    },
    "videogames_geforce_now_xbox_cloud_luna_shadow_boost": {
      fr: "GeForce Now, Xbox Cloud, Luna, Shadow, Boosteroid — comparatif latence/prix/bitrate.",
      en: "GeForce Now, Xbox Cloud, Luna, Shadow, Boosteroid — comparatif latence/prix/bitrate.",
    },
    "videogames_gestion": {
      fr: "Gestion",
      en: "Gestion",
    },
    "videogames_kifftech": {
      fr: "KiffTech",
      en: "KiffTech",
    },
    "videogames_latence": {
      fr: "Latence",
      en: "Latence",
    },
    "videogames_modernes": {
      fr: "Modernes",
      en: "Modernes",
    },
    "videogames_mods": {
      fr: "Mods",
      en: "Mods",
    },
    "videogames_mods_tools": {
      fr: "Mods & Tools",
      en: "Mods & Tools",
    },
    "videogames_mods_toolsnexus_thunderstore_vortex_mo2_": {
      fr: "Mods & ToolsNexus, Thunderstore, Vortex, MO2, r2modman — profils, déploiement, résolution conflits.ModsToolsGestionGérer →",
      en: "Mods & ToolsNexus, Thunderstore, Vortex, MO2, r2modman — profils, déploiement, résolution conflits.ModsToolsGestionGérer →",
    },
    "videogames_nexus_thunderstore_vortex_mo2_r2modman_p": {
      fr: "Nexus, Thunderstore, Vortex, MO2, r2modman — profils, déploiement, résolution conflits.",
      en: "Nexus, Thunderstore, Vortex, MO2, r2modman — profils, déploiement, résolution conflits.",
    },
    "videogames_pawaw": {
      fr: "PAWAW",
      en: "PAWAW",
    },
    videogames_pawawarcade_web_high_scores_tournois_rep: {
      fr: "PAWAWArcade web : high_scores, tournois, replays, modding, cross_platform, PWA installable.PAWAWArcadeWebJouer →",
      en: "PAWAWArcade web : high_scores, tournois, replays, modding, cross_platform, PWA installable.PAWAWArcadeWebJouer →",
    },
    "videogames_performance": {
      fr: "Performance",
      en: "Performance",
    },
    "videogames_retro": {
      fr: "Retro",
      en: "Retro",
    },
    "videogames_retroarch_dolphin_pcsx2_ryujinx_cemu_pps": {
      fr: "RetroArch, Dolphin, PCSX2, Ryujinx, Cemu, PPSSPP — configs optimisées, shaders, netplay.",
      en: "RetroArch, Dolphin, PCSX2, Ryujinx, Cemu, PPSSPP — configs optimisées, shaders, netplay.",
    },
    "videogames_rollspunch": {
      fr: "Rollspunch",
      en: "Rollspunch",
    },
    "videogames_rollspunchrpg_tactique_tour_par_tour_dit": {
      fr: "RollspunchRPG tactique tour par tour, éditeur campagnes, multijoueur async, IA maître de jeu.RollspunchRPGTactiqueCampagne →",
      en: "RollspunchRPG tactique tour par tour, éditeur campagnes, multijoueur async, IA maître de jeu.RollspunchRPGTactiqueCampagne →",
    },
    "videogames_rpg": {
      fr: "RPG",
      en: "RPG",
    },
    "videogames_rpg_tactique_tour_par_tour_diteur_campag": {
      fr: "RPG tactique tour par tour, éditeur campagnes, multijoueur async, IA maître de jeu.",
      en: "RPG tactique tour par tour, éditeur campagnes, multijoueur async, IA maître de jeu.",
    },
    "videogames_rtro": {
      fr: "Rétro",
      en: "Rétro",
    },
    "videogames_shaders": {
      fr: "Shaders",
      en: "Shaders",
    },
    "videogames_streaming": {
      fr: "Streaming",
      en: "Streaming",
    },
    "videogames_tactique": {
      fr: "Tactique",
      en: "Tactique",
    },
    "videogames_tools": {
      fr: "Tools",
      en: "Tools",
    },
    "videogames_upscaling": {
      fr: "Upscaling",
      en: "Upscaling",
    },
    "videogames_videogames_hub": {
      fr: "Videogames Hub",
      en: "Videogames Hub",
    },
    "videogames_web": {
      fr: "Web",
      en: "Web",
    },
  };

  var STORAGE_KEY = "keffstation_lang";
  var STORAGE_CURRENCY = "keffstation_currency";
  var DEFAULT_LANG = "fr";
  var DEFAULT_CURRENCY = "EUR";
  var SUPPORTED = Object.keys(DICT.langNames);

  /* Devises par région/pays (détection automatique depuis IP/navigateur) */
  var REGION_CURRENCY = {
    "fr": "EUR", "de": "EUR", "es": "EUR", "it": "EUR", "pt": "EUR", "nl": "EUR",
    "pl": "PLN", "ru": "RUB", "zh": "CNY", "ja": "JPY", "ko": "KRW", "ar": "SAR",
    "hi": "INR", "tr": "TRY", "en": "USD", "en-us": "USD", "en-gb": "GBP",
    "en-ca": "CAD", "en-au": "AUD", "en-jp": "JPY"
  };

  /* Codes pays communs vers devises (fallback si région inconnue) */
  var COUNTRY_CURRENCY = {
    "US": "USD", "CA": "CAD", "GB": "GBP", "AU": "AUD", "JP": "JPY",
    "CN": "CNY", "KR": "KRW", "IN": "INR", "BR": "BRL", "MX": "MXN",
    "CH": "CHF", "SE": "SEK", "NO": "NOK", "DK": "DKK", "ZA": "ZAR"
  };

  /* Noms des devises affichés */
  var CURRENCY_NAMES = {
    "EUR": "Euro (€)", "USD": "Dollar US ($)", "GBP": "Livre sterling (£)",
    "JPY": "Yen (¥)", "CAD": "Dollar canadien (C$)", "AUD": "Dollar australien (A$)",
    "CHF": "Franc suisse (CHF)", "CNY": "Yuan (¥)", "KRW": "Won (₩)",
    "INR": "Roupie (₹)", "BRL": "Real (R$)", "MXN": "Peso mexicain ($)",
    "PLN": "Złoty (zł)", "RUB": "Rouble (₽)", "SAR": "Riyal (﷼)",
    "TRY": "Livre turque (₺)", "SEK": "Kouronne suédoise (kr)",
    "NOK": "Kouronne norvégienne (kr)", "DKK": "Kouronne danoise (kr)",
    "ZAR": "Rand (R)"
  };

  var SUPPORTED_CURRENCIES = Object.keys(CURRENCY_NAMES);

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

  async function setLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    document.documentElement.lang = lang;
    await applyTranslations(lang);
    await applyTranslationsGoogle(lang);
    refreshSelector(lang);
    document.dispatchEvent(new CustomEvent("ks-lang-change", { detail: { lang: lang } }));
  }

  function getCurrency() {
    try {
      var saved = localStorage.getItem(STORAGE_CURRENCY);
      if (saved && SUPPORTED_CURRENCIES.indexOf(saved) !== -1) {
        return saved;
      }
    } catch (e) {}
    // détection automatique depuis la langue du navigateur
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
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: c,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(value);
    } catch (e) {
      return value + " " + c;
    }
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

  /* Mise à jour des prix quand la devise change */
  function updateCurrencyDisplay() {
    var currency = getCurrency();
    document.querySelectorAll("[data-currency]").forEach(function (el) {
      var raw = el.getAttribute("data-currency");
      var val = parseFloat(raw);
      if (!isNaN(val)) {
        el.textContent = fmtCurrency(val, currency);
      }
    });
  }

  document.addEventListener("ks-currency-change", function (e) {
    updateCurrencyDisplay();
  });

  /* ========================= Sélecteur de langue ========================= */
  var SELECTOR_CSS = "\
    #ks-lang-selector {\
      position: fixed; top: 10px; right: 10px; z-index: 2000;\
      background: rgba(10,12,34,.92); border: 1px solid rgba(255,255,255,.2);\
      border-radius: 12px; padding: 10px; color: #f4f6ff;\
      font: 700 13px/1.2 system-ui,sans-serif; cursor: pointer; backdrop-filter: blur(6px);\
      display: flex; flex-direction: column; gap: 8px; align-items: flex-start;\
    }\
    #ks-lang-selector .ks-field {\
      display: flex; flex-direction: column; gap: 4px; width: 100%;\
    }\
    #ks-lang-selector label {\
      font: 600 11px/1.2 system-ui,sans-serif; color: #b9c0e6; margin: 0;\
    }\
    #ks-lang-selector select {\
      background: transparent; border: 1px solid rgba(255,255,255,.2); color: #ffd23f;\
      font: inherit; outline: none; cursor: pointer; -webkit-appearance: none;\
      padding: 4px 8px; border-radius: 6px; width: 100%;\
    }\
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

    // --- Champ langue ---
    var langField = document.createElement("div");
    langField.className = "ks-field";
    var langLabel = document.createElement("label");
    langLabel.textContent = t("language", lang);
    langLabel.style.marginRight = "6px";
    langLabel.style.color = "#b9c0e6";
    langLabel.style.fontSize = "11px";
    langField.appendChild(langLabel);
    var langSel = document.createElement("select");
    langSel.id = "ks-lang-picker";
    SUPPORTED.forEach(function (code) {
      var opt = document.createElement("option");
      opt.value = code;
      opt.textContent = DICT.langNames[code];
      if (code === lang) opt.selected = true;
      langSel.appendChild(opt);
    });
    langSel.addEventListener("change", function () {
      setLang(langSel.value);
    });
    langField.appendChild(langSel);
    box.appendChild(langField);

    // --- Champ devise ---
    var currField = document.createElement("div");
    currField.className = "ks-field";
    var currLabel = document.createElement("label");
    currLabel.textContent = t("currency", lang);
    currLabel.style.marginRight = "6px";
    currLabel.style.color = "#b9c0e6";
    currLabel.style.fontSize = "11px";
    currField.appendChild(currLabel);
    var currSel = document.createElement("select");
    currSel.id = "ks-currency-picker";
    SUPPORTED_CURRENCIES.forEach(function (code) {
      var opt = document.createElement("option");
      opt.value = code;
      opt.textContent = CURRENCY_NAMES[code] || code;
      if (code === getCurrency()) opt.selected = true;
      currSel.appendChild(opt);
    });
    currSel.addEventListener("change", function () {
      setCurrency(currSel.value);
    });
    currField.appendChild(currSel);
    box.appendChild(currField);

    return box;
  }

  function refreshSelector(lang) {
    var sel = document.getElementById("ks-lang-picker");
    if (sel) sel.value = lang;
  }

  function refreshCurrencySelector(currency) {
    var sel = document.getElementById("ks-currency-picker");
    if (sel) sel.value = currency;
  }

  function injectSelector(lang) {
    if (document.getElementById("ks-lang-selector")) return;
    injectStyle();
    var box = buildSelector(lang);
    document.body.appendChild(box);
  }

  /* ========================= Init ========================= */
  async function init() {
    var lang = getLang();
    document.documentElement.lang = lang;
    injectSelector(lang);
    applyTranslations(lang);
    updateCurrencyDisplay();

    // Re-traduire si le DOM change (SPA / injection dynamique)
    var observer = new MutationObserver(async function (mutations) {
      var need = false;
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (n) {
          if (n.nodeType === 1 && (n.hasAttribute && n.hasAttribute("data-i18n"))) need = true;
        });
      });
      if (need) { await applyTranslations(lang); await applyTranslationsGoogle(lang); }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
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
      } catch (e) {
        console.warn('[i18n] Google Translate failed:', e.message);
      }
      return text;
    })();
    return translating[cacheKey];
  }

  async function applyTranslationsGoogle(lang) {
    var fallbackElems = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < fallbackElems.length; i++) {
      (function (el) {
        var key = el.getAttribute("data-i18n");
        var val = t(key, lang);
        if (val === key) {
          var original = el.getAttribute("data-i18n-original");
          if (!original) {
            original = el.textContent;
            el.setAttribute("data-i18n-original", original);
          }
          if (original && original !== key && original.trim().length > 0) {
            googleTranslate(original, lang).then(function (translated) {
              el.textContent = translated;
            });
          }
        }
      })(fallbackElems[i]);
    }
  }

  // API exposée
  window.ksI18n = { setLang: setLang, getLang: getLang, t: t, apply: applyTranslations };
})();
