/* ===== KeffStation Cube App Module ===== */

// ============ DATA ============
const APPS = [
  {
    num: "Kifftech",
    title: "Kifftech",
    desc: "Boutique PWA : Samsung, Xiaomi, prix sous officiels, livraison mondiale. Backend Node unique, zéro dépendance, données JSON.",
    tags: ["PWA", "Node", "E-commerce", "Smart tech"],
    appUrl: "https://samuelhaihornberg.github.io/keffstation/kifftech/rayons.html",
    embedUrl: "https://samuelhaihornberg.github.io/keffstation/kifftech/rayons.html",
    embedLabel: "Ouvrir Kifftech",
    embedded: true,
    color: "#1e6bff",
    subArticles: [
      { title: "Catalogue Samsung", desc: "Galaxy Buds, SmartTag, chargeurs rapides — fiches complètes.", tags: ["Samsung", "Audio", "Accessoires"] },
      { title: "Catalogue Xiaomi", desc: "Redmi Buds, Smart Band, caméras Wi-Fi — specs et prix.", tags: ["Xiaomi", "Fitness", "Maison"] },
      { title: "Guide d'achat", desc: "Comment choisir vos écouteurs, bracelets, gadgets selon votre usage.", tags: ["Guide", "Conseil", "Achat"] },
      { title: "Offres VIP", desc: "Accès anticipé, remises exclusives, abonnements mensuels.", tags: ["VIP", "Promo", "Abonnement"] },
      { title: "Galaxy Buds 3 Pro : ANC adaptatif", desc: "Nouveaux écouteurs Samsung avec réduction de bruit IA, 30h autonomie, boîtier sans fil. Prix compétitif vs AirPods Pro 2.", tags: ["Samsung", "Audio", "ANC", "Nouveauté"] },
      { title: "Xiaomi Smart Band 9 Pro : AMOLED 1.74\"", desc: "Écran AMOLED 1.74\", GPS intégré, 21 jours autonomie, 150+ modes sport. Meilleur rapport qualité/prix fitness 2024.", tags: ["Xiaomi", "Fitness", "AMOLED", "GPS"] },
      { title: "Samsung Galaxy SmartTag 3 : UWB + Thread", desc: "Tracker nouvelle génération avec Ultra Wideband précis, compatibilité Matter/Thread, 1 an autonomie.", tags: ["Samsung", "Tracker", "UWB", "Matter"] },
      { title: "Chargeur 65W GaN 3 ports : ultra-compact", desc: "Charge rapide 65W (2x USB-C + 1x USB-A), nitrure de gallium, taille carte crédit. Idéal voyage multi-appareils.", tags: ["Chargeur", "GaN", "Voyage", "Multi-port"] },
      { title: "Xiaomi Redmi Buds 6 Pro : LDAC + ANC 55dB", desc: "Écouteurs Hi-Res LDAC, ANC hybride 55dB, 38h autonomie, 3 micros IA. Qualité audiophile sous 100€.", tags: ["Xiaomi", "Audio", "LDAC", "ANC"] },
      { title: "Samsung Galaxy Watch 7 : BioActive + IA", desc: "Capteur BioActive 2.0, analyse sommeil IA, ECG/TA, 40h autonomie, Wear OS 5. Santé complète au poignet.", tags: ["Samsung", "Montre", "Santé", "IA"] },
      { title: "Robot aspirateur Xiaomi X20 Pro : LDS + IA", desc: "Navigation LDS 360°, reconnaissance objets IA, serpillière auto-lift, station vidage 60 jours.", tags: ["Xiaomi", "Robot", "IA", "Maison"] },
      { title: "Chargeur sans fil 50W MagSafe compatible", desc: "Charge magnétique 50W (iPhone 15+), ventilation active, indicateur LED, 30 min pour 50%.", tags: ["Chargeur", "MagSafe", "Sans-fil", "Rapide"] },
      { title: "Xiaomi 14 Ultra : photo Leica 1\"", desc: "Capteur 1 pouce, optique Leica Summilux, ouverture variable, 8K vidéo. Photographie mobile niveau pro.", tags: ["Xiaomi", "Photo", "Leica", "Pro"] },
      { title: "Samsung Galaxy Z Fold 6 : pliable pro", desc: "Écran 7.6\" QXGA+, Snapdragon 8 Gen 3, S-Pen, IP48, 7 ans mises à jour. Productivité pliable ultime.", tags: ["Samsung", "Foldable", "Productivité", "Flagship"] }
    ]
  },
  {
    num: "Tricktrocjob",
    title: "Tricktrocjob",
    desc: "Échange d'astuces pas à pas, troc d'objets, services entre particuliers. Frais dégressifs 17%→5%, double porte-monnaie (solde + crédits).",
    tags: ["Marketplace", "Troc", "Crédits", "Communauté"],
    appUrl: "https://samuelhaihornberg.github.io/keffstation/tricktrocjob/",
    embedUrl: "https://samuelhaihornberg.github.io/keffstation/tricktrocjob/",
    embedLabel: "Ouvrir Tricktrocjob",
    color: "#ff3d9a",
    subArticles: [
      { title: "Comment créer un Trix", desc: "Tutoriel pas à pas pour publier votre astuce ou tutoriel.", tags: ["Tutoriel", "Publication", "Trix"] },
      { title: "Échanger un Trox", desc: "Mettre en ligne un objet, gérer les propositions, finaliser l'échange.", tags: ["Trox", "Échange", "Objet"] },
      { title: "Proposer un Service", desc: "Créer une offre de service, fixer le prix, gérer les clients.", tags: ["Service", "Freelance", "Compétence"] },
      { title: "Gagner des crédits", desc: "Système de récompenses, parrainage, bonus de validation.", tags: ["Crédits", "Récompense", "Économie"] },
      { title: "Créer un Trix viral : structure gagnante", desc: "Titre accrocheur, étapes numérotées, photos qualité, prix en crédits. Exemples de Trix à 10k+ vues.", tags: ["Trix", "Viral", "Rédaction", "Visibilité"] },
      { title: "Négocier un Trox : techniques gagnantes", desc: "Évaluer la valeur, proposer contre-offre, photos sous angles, description honnête. Évitez les arnaques.", tags: ["Trox", "Négociation", "Sécurité", "Évaluation"] },
      { title: "Service récurrent : revenus passifs", desc: "Abonnement mensuel, facturation auto, fidélisation clients. Ex: maintenance PC, cours hebdo, livraison courses.", tags: ["Service", "Récurrent", "Revenus", "Automatisation"] },
      { title: "Parrainage : 500 crédits par filleul", desc: "Partagez votre lien, filleul valide son 1er échange = 500 crédits chacun. Illimité, cumulable avec promos.", tags: ["Parrainage", "Crédits", "Récompense", "Viral"] },
      { title: "Trix vidéo : format court engageant", desc: "60-90 sec, hook 3 sec, démo claire, CTA crédits. Format vertical, sous-titres, musique libre. +300% engagement.", tags: ["Trix", "Vidéo", "Format", "Engagement"] },
      { title: "Objets rares : authentification pro", desc: "Service expertise gratuite pour objets >500€. Certificat authenticité, estimation marché, assurance transport incluse.", tags: ["Expertise", "Authentique", "Luxe", "Sécurité"] },
      { title: "Communauté locale : rencontres mensuelles", desc: "Événements ville par ville, échanges en main propre, ateliers réparation. Zéro frais port, confiance directe.", tags: ["Communauté", "Local", "Rencontre", "Échange"] },
      { title: "Dashboard vendeur : stats temps réel", desc: "Vues, favoris, conversions, revenus crédits/€. Alertes prix, relance paniers, export CSV. Pilotage pro.", tags: ["Dashboard", "Stats", "Vente", "Pro"] },
      { title: "API publique : intégration tierce", desc: "REST + Webhooks, taux limités, scopes granulaires. Intégrez Tricktroc dans votre app.", tags: ["API", "Intégration", "Dev", "Webhook"] },
      { title: "Mode hors-ligne : PWA offline-first", desc: "Cache intelligent, sync différée, conflits résolus. Travaillez sans connexion.", tags: ["PWA", "Offline", "Sync", "Cache"] }
    ]
  },
  {
    num: "ViArtificial labs",
    title: "ViArtificial labs",
    desc: "Syntaxe cos (connexions), famille SuperBots (ViA, BTB+Golem, Geeko, Guideoplan), blocs logiques BLM/BLSM, motor.s injection.",
    tags: ["cos", "SuperBots", "BLM", "motor.s"],
    appUrl: "https://samuelhaihornberg.github.io/keffstation/viartificial-labs/",
    embedUrl: "https://samuelhaihornberg.github.io/keffstation/viartificial-labs/",
    embedLabel: "Ouvrir SuperBots",
    color: "#b84dff",
    subArticles: [
      { title: "Syntaxe cos", desc: "Référence complète : connexions, sandwich, adresses, CSM.", tags: ["cos", "Syntax", "Référence"] },
      { title: "SuperBots", desc: "ViA, BTB+Golem, Geeko, Guideoplan — personnalités et rôles.", tags: ["SuperBots", "IA", "Personnalité"] },
      { title: "BLM & BLSM", desc: "Blocs de logique matricielle et bloc de création médias.", tags: ["BLM", "BLSM", "Logique", "Création"] },
      { title: "motor.s", desc: "Bibliothèque emojis, COS, EMOJI, MS, FENETRE, RECYCLOR, BOOST, SUPERSTREAM.", tags: ["motor.s", "Moteurs", "Injection"] },
      { title: "Guide cos : connexions & adresses", desc: "Syntaxe A1 ➡️ B2, adresses alphanum, sandwich miroir. Exemples prêts à l'emploi pour devs.", tags: ["cos", "Tutoriel", "Connexions", "Dev"] },
      { title: "ViA : configurer votre miroir IA", desc: "Personnalité, ton, limites, mémoire. Exemples prompts système pour assistant personnel, coach, analyste.", tags: ["ViA", "Config", "Prompt", "IA"] },
      { title: "BTB + Golem : sécurité & moteur", desc: "BTB valide, Golem exécute. Pipeline CI/CD, tests auto, rollback auto. Architecture zero-trust.", tags: ["BTB", "Golem", "Sécurité", "CI/CD"] },
      { title: "Geeko Geekette : dev companion", desc: "Revues code, debug, doc auto, tests unitaires. Intégration VS Code, GitHub, GitLab. Pair programming IA.", tags: ["Geeko", "Dev", "Code", "IDE"] },
      { title: "Guideoplan : plan perso → pro", desc: "Matrice 15/28, budget, timeline, risques. Export PDF/Notion. Sync bidirectionnel vie pro/perso.", tags: ["Guideoplan", "Planification", "Budget", "Sync"] },
      { title: "BLM : blocs logiques réutilisables", desc: "Créer, versionner, composer blocs. Marketplace communautaire, tests auto, rollback 1-clic. Gouvernance code.", tags: ["BLM", "Blocs", "Réutilisable", "Gouvernance"] },
      { title: "BLSM : générer images/sons/3D", desc: "Prompts structurés, seeds reproductibles, variations contrôlées. Export assets jeu/web/app. Pipeline créatif.", tags: ["BLSM", "Génératif", "Assets", "Pipeline"] },
      { title: "motor.s injection : noyau partiel", desc: "MOTOR.noyau(['COS','FENETRE']) — 50KB gzippé. CDN global, cache éternel, versioning sémantique. Zéro config.", tags: ["motor.s", "Injection", "CDN", "Performance"] },
      { title: "ERN : mémoire distribuée", desc: "Entités-Relations-Nœuds, graphe persistant, requêtes locales. Mémoire IA souveraine.", tags: ["ERN", "Mémoire", "Graphe", "Souveraineté"] },
      { title: "Moteurs linguistiques : NLP local", desc: "Tokenisation, embeddings, génération contrôlée, fine-tuning LoRA, quantization GGUF — le tout local-first.", tags: ["NLP", "LLM", "Local-First"] },
      { title: "Tokenizer Visualizer", desc: "Visualisation interactive BPE/WordPiece/Unigram, vocabulaire, merges, compression ratio.", tags: ["Tokenizer", "Visualisation", "NLP"] },
      { title: "Embedding Explorer", desc: "Projection 2D/3D (t-SNE, UMAP), similarité cosinus, analogies vectorielles, clusters.", tags: ["Embeddings", "Projection", "NLP"] },
      { title: "Generation Playground", desc: "Sampling top-k/p, temperature, repetition penalty, logits bias, seeds reproductibles, streaming.", tags: ["Génération", "Sampling", "LLM"] },
      { title: "LoRA/QLoRA Trainer", desc: "Fine-tuning low-rank adaptatif, quantization 4-bit NF4, gradient checkpointing, export GGML/GGUF/ONNX.", tags: ["LoRA", "Fine-tuning", "Quantization"] },
      { title: "Quantization Lab", desc: "GPTQ, AWQ, GGUF q2_k→q8_0, calibration, perplexity eval, benchmark vitesse/mémoire.", tags: ["Quantization", "GPTQ", "Benchmark"] },
      { title: "Local-First Runtime", desc: "WebLLM, Transformers.js, llama.cpp WASM, ONNX Runtime Web. Zero-server inference.", tags: ["Local-First", "WASM", "Zero-Server"] },
      { title: "Éditeur cos : écrire la syntaxe", desc: "Éditeur interactif cos (connexions, sandwich, adresses, CSM). Validation temps réel, coloration, autocomplétion.", tags: ["cos", "Éditeur", "Dev"] },
      { title: "Guide de démarrage cos", desc: "Premiers pas avec l'éditeur cos : syntaxe de base, connexions A1➡️B2, mode sandwich miroir.", tags: ["Guide", "Débutant", "cos"] },
      { title: "Référence cos complète", desc: "Tous les opérateurs, adresses, motifs, CSM, exemples commentés.", tags: ["Référence", "Documentation", "cos"] },
      { title: "Snippets cos prêts à l'emploi", desc: "Templates : pipelines, boucles, conditions, parallélisme, gestion d'erreurs.", tags: ["Snippets", "Templates", "cos"] },
      { title: "Débogage visuel cos", desc: "Inspecteur de graphe, points d'arrêt, exécution pas à pas, logs colorés.", tags: ["Debug", "Inspecteur", "cos"] },
      { title: "Playground cos live", desc: "Éditeur Monaco/CodeMirror, validation temps réel, coloration, autocomplétion, export JSON.", tags: ["Playground", "Live", "Export"] },
      { title: "cos en CI/CD", desc: "GitHub Actions, GitLab CI, validation PR, tests cos unitaires, déploiement auto.", tags: ["CI/CD", "GitHub", "GitLab"] }
    ]
  },
  {
    num: "Videogames",
    title: "Videogames",
    desc: "Catalogue jeux, emulation, cloud gaming, mods, benchmarks. PAWAW, Rollspunch, indés, retro, AAA.",
    tags: ["Jeux", "Gaming", "Emulation", "Cloud"],
    appUrl: "https://samuelhaihornberg.github.io/keffstation/videogames/",
    embedUrl: "https://samuelhaihornberg.github.io/keffstation/videogames/",
    embedLabel: "Ouvrir Videogames",
    color: "#ff6b00",
    subArticles: [
      { title: "PAWAW", desc: "Plateforme arcade web, high-scores, tournois, replays, modding, cross-platform, PWA installable.", tags: ["PAWAW", "Arcade", "Web"] },
      { title: "Rollspunch", desc: "RPG tactique tour par tour, éditeur de campagnes, multijoueur async, IA maître de jeu.", tags: ["Rollspunch", "RPG", "Tactique"] },
      { title: "Cloud Gaming", desc: "GeForce Now, Xbox Cloud, Luna, Shadow, Boosteroid — comparatif latence/prix/bitrate.", tags: ["Cloud", "Streaming", "Latence"] },
      { title: "Emulation Station", desc: "RetroArch, Dolphin, PCSX2, Ryujinx, Cemu, PPSSPP — configs optimisées, shaders, netplay.", tags: ["Emulation", "Retro", "Shaders"] },
      { title: "Benchmarks GPU/CPU", desc: "FPS, frametime, 1% low, 0.1% low, consommation, DLSS/FSR/XeSS, frame gen.", tags: ["Benchmark", "Performance", "Upscaling"] },
      { title: "Mods & Tools", desc: "Nexus, Thunderstore, Vortex, MO2, r2modman — profils, déploiement, résolution conflits.", tags: ["Mods", "Tools", "Gestion"] }
    ]
  },
  {
    num: "cos Editor",
    title: "cos Editor",
    desc: "Éditeur cos dans le navigateur : connexions A1 ➡️ B2, mode sandwich miroir, validation temps réel, coloration syntaxique et export JSON.",
    tags: ["cos", "Éditeur", "Dev"],
    appUrl: "https://samuelhaihornberg.github.io/keffstation/cos-editor/",
    embedUrl: "https://samuelhaihornberg.github.io/keffstation/cos-editor/",
    embedLabel: "Ouvrir cos Editor",
    color: "#27d17f",
    subArticles: [
      { title: "Syntaxe cos", desc: "Connexions, sandwich miroir, adresses alphanumériques et CSM.", tags: ["cos", "Syntaxe", "Référence"] },
      { title: "Validation temps réel", desc: "Erreurs soulignées, suggestions, exécution pas à pas et export JSON.", tags: ["Validation", "Debug", "Export"] },
      { title: "Snippets prêts à l'emploi", desc: "Templates pipelines, boucles, conditions, parallélisme.", tags: ["Snippets", "Templates"] }
    ]
  },
  {
    num: "Linguistic Motors",
    title: "Linguistic Motors",
    desc: "Moteurs linguistiques local-first : tokenisation, embeddings, génération contrôlée, quantization GGUF. Inférence zéro serveur dans le navigateur.",
    tags: ["NLP", "LLM", "Local-first", "WASM"],
    appUrl: "https://samuelhaihornberg.github.io/keffstation/linguistic-motors/",
    embedUrl: "https://samuelhaihornberg.github.io/keffstation/linguistic-motors/",
    embedLabel: "Ouvrir Linguistic Motors",
    color: "#ffd23f",
    subArticles: [
      { title: "Tokenizer Visualizer", desc: "Visualisation interactive BPE/WordPiece/Unigram, vocabulaire, merges, ratio de compression.", tags: ["Tokenizer", "Visualisation", "NLP"] },
      { title: "Embedding Explorer", desc: "Projection 2D/3D, similarité cosinus, analogies vectorielles, clusters.", tags: ["Embeddings", "Projection", "NLP"] },
      { title: "Generation Playground", desc: "Sampling top-k/p, température, repetition penalty, seeds reproductibles.", tags: ["Génération", "Sampling", "LLM"] },
      { title: "Quantization Lab", desc: "GGUF q2_k → q8_0, calibration, perplexity, benchmark vitesse/mémoire.", tags: ["Quantization", "GGUF", "Benchmark"] }
    ]
  },
  {
    num: "Critiques Services",
    title: "Critiques Services",
    desc: "Plateforme de critiques de services avec preuves vidéo — Expériences personnelles réelles uniquement. Authentification, votes, commentaires, géolocalisation, galerie preuves, PWA hors-ligne.",
    tags: ["PWA", "Critiques", "Vidéos", "Géolocalisation"],
    appUrl: "https://samuelhaihornberg.github.io/critiques-services.com/",
    embedUrl: "https://samuelhaihornberg.github.io/critiques-services.com/",
    embedLabel: "Ouvrir Critiques Services",
    color: "#e94560",
    subArticles: [
      { title: "Lire les critiques", desc: "Consultez les critiques de services avec preuves vidéo, filtres et recherche.", tags: ["Lecture", "Critiques", "Recherche"] },
      { title: "Créer une critique", desc: "Publiez votre propre critique avec photos, vidéos, géolocalisation et prix.", tags: ["Création", "Preuves", "Géolocalisation"] },
      { title: "Voter et commenter", desc: "Système de votes 👍/👎, réactions emoji, commentaires forum.", tags: ["Votes", "Commentaires", "Réactions"] },
      { title: "Carte des services", desc: "Géolocalisation Leaflet + Nominatim, services en ligne.", tags: ["Carte", "Géolocalisation", "Leaflet"] },
      { title: "Profil utilisateur", desc: "Infos, stats, onglets critiques et statistiques.", tags: ["Profil", "Stats", "Utilisateur"] },
      { title: "PWA hors-ligne", desc: "Service Worker, manifest, mode hors-ligne, installation sur écran d'accueil.", tags: ["PWA", "Hors-ligne", "Installable"] }
    ]
  }
];

// ============ UTILITIES ============
function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = String(str ?? '');
  return div.innerHTML;
}

// Position d'un satellite sur l'anneau (en % du conteneur carré).
// index 0 = midi, puis sens horaire. Radius 38 = anneau à 38% du centre.
function orbitPosition(index, total, radius = 36) {
  const step = 360 / total;
  const deg = -90 + step * index;
  const rad = (deg * Math.PI) / 180;
  return {
    x: 50 + radius * Math.cos(rad),
    y: 50 + radius * Math.sin(rad),
    deg,
    step
  };
}

const APP_ICONS = {
  'Kifftech': '🛍️',
  'Tricktrocjob': '🔄',
  'ViArtificial labs': '🤖',
  'Videogames': '🎮',
  'cos Editor': '🧩',
  'Linguistic Motors': '🧠'
};

// ============ VITRINE RONDE ============
class KeffStation {
  constructor() {
    this.apps = APPS;
    this.current = 0;
    this.pwaCache = new Map();

    this.vitrine = document.getElementById('vitrine');
    this.orbit = document.getElementById('orbit');
    this.nav = document.getElementById('nav');
    this.appPrev = document.getElementById('app-prev');
    this.appNext = document.getElementById('app-next');
    this.loading = document.getElementById('loading');
    this.loadingBar = document.getElementById('loading-bar-inner');
    this.appCount = document.getElementById('app-count');

    this.panel = document.getElementById('panel');
    this.panelCard = document.getElementById('panel-card');

    this.embedOverlay = document.getElementById('embed-overlay');
    this.embedIframe = document.getElementById('embed-iframe');
    this.embedLoading = document.getElementById('embed-loading');
    this.embedTitle = document.getElementById('embed-title');
    this.embedSubtitle = document.getElementById('embed-subtitle');

    const elementsFound = {
      vitrine: !!this.vitrine, nav: !!this.nav, panel: !!this.panel, panelCard: !!this.panelCard,
      embedOverlay: !!this.embedOverlay, embedIframe: !!this.embedIframe,
      embedLoading: !!this.embedLoading
    };
    console.log('KeffStation constructor - Éléments trouvés :', elementsFound);
    const missing = Object.entries(elementsFound).filter(([, found]) => !found).map(([name]) => name);
    if (missing.length > 0) {
      const msg = 'Missing DOM elements: ' + missing.join(', ');
      console.error('KeffStation constructor - Éléments manquants :', missing);
      throw new Error(msg);
    }

    this.nodes = [];
    this.dots = [];
  }

  async init() {
    try {
      console.log('KeffStation: démarrage de l\'initialisation…');
      this.setProgress(5, '🔄 Initialisation…');

      this.setProgress(15, '🔍 Vérification endpoints…');
      // Non bloquant : la vitrine reste utilisable même si le réseau est lent.
      this.validateEndpoints()
        .then(() => this.setProgress(25, '✅ Endpoints validés'))
        .catch(() => this.setProgress(25, '⚠️ Vérification écourtée'));

      this.setProgress(40, '🪐 Construction de la vitrine…');
      this.buildVitrine();
      this.setProgress(65, '✅ Vitrine construite');

      this.setProgress(75, '⌨️ Configuration événements…');
      this.setupEventListeners();
      this.setProgress(85, '✅ Événements configurés');

      this.setProgress(95, '🎯 Presque prêt…');
      this.hideLoading();
      this.setProgress(100, '✅ KeffStation prêt');

      this.initialized = true;
      console.log('KeffStation initialisée');

      this.preloadAllEmbedded();
    } catch (error) {
      console.error('Initialization failed:', error);
      this.showError(error?.message || error?.toString() || 'Erreur inconnue');
      throw error;
    }
  }

  async validateEndpoints() {
    // Best-effort et borné : ne doit JAMAIS bloquer l'initialisation.
    const endpoints = this.apps.map(app => app.appUrl).filter(Boolean);
    const ctl = new AbortController();
    const to = setTimeout(() => ctl.abort(), 6000);
    try {
      const results = await Promise.allSettled(
        endpoints.map(url => fetch(url, { method: 'HEAD', mode: 'no-cors', signal: ctl.signal }).catch(() => true))
      );
      const failed = endpoints.filter((_, i) => results[i].status === 'rejected');
      if (failed.length > 0) console.warn('Some endpoints unreachable (may be CORS):', failed);
    } finally {
      clearTimeout(to);
    }
  }

  // ---- Construction ----
  buildVitrine() {
    const total = this.apps.length;
    this.vitrine.style.setProperty('--count', total);
    if (this.appCount) this.appCount.textContent = total;

    // L'orbite n'existe plus dans le DOM : les apps sont affichées statiquement.
    this.nodes = [];

    this.apps.forEach((app, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.dataset.index = i;
      dot.setAttribute('aria-label', `Ouvrir ${app.num}`);
      dot.innerHTML = `<span class="app-dot-icon">${sanitizeHTML(APP_ICONS[app.num] || app.title.slice(0, 1))}</span>`;
      dot.addEventListener('click', () => this.openApp(i));
      this.nav.appendChild(dot);
    });

    this.dots = Array.from(this.nav.querySelectorAll('button'));
    this.setFocus(0, false);
  }

  setFocus(index, open = false) {
    this.current = index;
    this.nodes.forEach((node, i) => {
      node.classList.toggle('focused', i === index);
      node.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
    this.dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    if (open) this.openApp(index);
  }

  setupEventListeners() {
    // Flèches clavier : navigue dans l'anneau ; Entrée ouvre.
    document.addEventListener('keydown', (e) => {
      if (this.embedOverlay.classList.contains('visible')) {
        if (e.key === 'Escape') this.closeEmbed();
        return;
      }
      if (this.panel.classList.contains('open')) {
        if (e.key === 'Escape') this.closePanel();
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.setFocus((this.current - 1 + this.apps.length) % this.apps.length);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        this.setFocus((this.current + 1) % this.apps.length);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.openApp(this.current);
      }
    });

    // Pause de la rotation pendant l'inspection.
    this.vitrine.addEventListener('pointerenter', () => this.vitrine.classList.add('paused'));
    this.vitrine.addEventListener('pointerleave', () => this.vitrine.classList.remove('paused'));

    // Panneau de détail : fermeture au clic sur le fond.
    this.panel.addEventListener('click', (e) => {
      if (e.target === this.panel) this.closePanel();
    });

    // Overlay PWA embarquée.
    document.getElementById('embed-back')?.addEventListener('click', () => this.closeEmbed());
    document.getElementById('embed-refresh')?.addEventListener('click', () => {
      if (!this.embedIframe || !this.currentEmbedApp) return;
      const base = this.currentEmbedApp.embedUrl;
      const sep = base.includes('?') ? '&' : '?';
      this.embedIframe.src = `${base}${sep}refresh=${Date.now()}`;
    });
    document.getElementById('embed-newtab')?.addEventListener('click', () => {
      if (this.currentEmbedApp) window.open(this.currentEmbedApp.embedUrl, '_blank', 'noopener,noreferrer');
    });

    // Lecteur d'app : flèches gauche / droite.
    this.appPrev?.addEventListener('click', () => {
      this.setFocus((this.current - 1 + this.apps.length) % this.apps.length);
    });
    this.appNext?.addEventListener('click', () => {
      this.setFocus((this.current + 1) % this.apps.length);
    });

    // Lecteur d'app : swipe gauche / droite sur la vitrine.
    let touchStartX = 0;
    this.vitrine.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    this.vitrine.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) {
          // swipe vers la gauche -> app suivante
          this.setFocus((this.current + 1) % this.apps.length);
        } else {
          // swipe vers la droite -> app précédente
          this.setFocus((this.current - 1 + this.apps.length) % this.apps.length);
        }
      }
    }, { passive: true });
  }

  // ---- Panneau détail ----
  openApp(index) {
    const app = this.apps[index];
    if (!app) return;
    this.setFocus(index);

    const articles = (app.subArticles || []).map(sub => `
      <article class="article-card">
        <h3>${sanitizeHTML(sub.title)}</h3>
        <p>${sanitizeHTML(sub.desc)}</p>
        <div class="article-tags">${(sub.tags || []).map(t => `<span class="article-tag">${sanitizeHTML(t)}</span>`).join('')}</div>
      </article>
    `).join('');

    const tags = (app.tags || []).map(t => `<span class="face-tag">${sanitizeHTML(t)}</span>`).join('');

    this.panelCard.style.setProperty('--accent', app.color || '#1e6bff');
    this.panelCard.innerHTML = `
      <div class="panel-head">
        <div class="panel-badge" aria-hidden="true">${sanitizeHTML(APP_ICONS[app.num] || app.title.slice(0, 1))}</div>
        <div class="panel-heading">
          <h2 class="panel-title">${sanitizeHTML(app.title)}</h2>
          <div class="face-tags panel-tags">${tags}</div>
        </div>
        <button class="panel-close" type="button" aria-label="Fermer">×</button>
      </div>
      <p class="panel-desc">${sanitizeHTML(app.desc)}</p>
      <div class="panel-grid">${articles}</div>
      <button type="button" class="embed-btn" data-app-index="${index}">
        <span aria-hidden="true">📱</span>
        <span class="embed-btn-text">${sanitizeHTML(app.embedLabel || 'Ouvrir ' + app.num)}</span>
        <span class="embed-preload-status" aria-hidden="true"></span>
      </button>
    `;

    this.panelCard.querySelector('.panel-close')?.addEventListener('click', () => this.closePanel());
    this.panelCard.querySelector('.embed-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (app.embedUrl) {
        this.openEmbed(app);
      } else if (app.appUrl) {
        window.location.href = app.appUrl;
      }
    });

/* Cube3D (blm-orchestrateur) — méthodes désactivées pour syntaxe
  expandFace(index) {
    if (index !== this.current) {
      this.rotateTo(index);
      // Wait for rotation to complete then expand
      setTimeout(() => this.doExpandFace(index), 400);
    } else {
      this.doExpandFace(index);
    }
  }

  doExpandFace(index) {
    const face = this.faces[index];
    if (!face) return;
    
    this.isExpanded = true;
    this.cube.classList.add('face-expanded');
    face.classList.add('expanded');
    
    // Scroll to top
    face.scrollTop = 0;
    
    // Focus management
    setTimeout(() => face.querySelector('.face-close')?.focus(), 100);
  }

  collapseFace() {
    if (!this.isExpanded) return;
    const face = this.faces[this.current];
    if (!face) return;
    
    this.isExpanded = false;
    this.cube.classList.remove('face-expanded');
    face.classList.remove('expanded');
    face.scrollTop = 0;
  }

  onDragStart(e) {
    if (this.isExpanded) return;
    this.isDragging = true;
    this.startX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    this.cube.style.transition = 'none';
    if (e.target?.setPointerCapture) e.target.setPointerCapture(e.pointerId);
  }

  onDragMove(e) {
    if (!this.isDragging || this.isExpanded) return;
    const dx = (e.clientX ?? e.touches?.[0]?.clientX ?? 0) - this.startX;
    const angle = this.currentRotationY + dx * 0.4;
    this.cube.style.transform = `rotateY(${angle}deg)`;
  }

  onDragEnd(e) {
    if (!this.isDragging || this.isExpanded) return;
    this.isDragging = false;
    const dx = (e.clientX ?? e.changedTouches?.[0]?.clientX ?? 0) - this.startX;
    const threshold = 60;
    this.cube.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1)';
    if (Math.abs(dx) > threshold) {
      this.rotateBy(dx > 0 ? -1 : 1);
    } else {
      this.updateCubeRotation();
    }
    if (e.target?.releasePointerCapture) e.target.releasePointerCapture(e.pointerId);
  }

  initParticles() {
    try {
      const container = document.getElementById('particules');
      if (!container) return;
      const colors = ['#1e6bff','#ff3d9a','#ffd23f','#27d17f','#8a4dff','#ff6b00','#e94560'];
      for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'particule';
        const sx = (Math.random() - .5) * window.innerWidth * .8;
        const sy = (Math.random() - .5) * window.innerHeight * .8;
        const ex = (Math.random() - .5) * window.innerWidth * .8;
        const ey = (Math.random() - .5) * window.innerHeight * .8;
        const delay = Math.random() * 15;
        const dur = 12 + Math.random() * 10;
        const op = .15 + Math.random() * .25;
        const clr = colors[Math.floor(Math.random() * colors.length)];
        p.style.cssText = `left:50%;top:50%;--sx:${sx}px;--sy:${sy}px;--ex:${ex}px;--ey:${ey}px;--op:${op};background:${clr};animation-duration:${dur}s;animation-delay:${delay}s`;
        container.appendChild(p);
      }
    });
    } catch (e) { console.warn(e); }
  }
*/
    /* fin Cube3D désactivé */

    this.panel.classList.add('open');
    this.panelCard.scrollTop = 0;
    document.body.classList.add('overlay-open');
    setTimeout(() => this.panelCard.querySelector('.panel-close')?.focus(), 60);
  }

  closePanel() {
    this.panel.classList.remove('open');
    document.body.classList.remove('overlay-open');
  }

  // ---- PWA préchargement ----
  preloadPWA(app) {
    if (!app.embedUrl || this.pwaCache.has(app.embedUrl)) return Promise.resolve();
    return fetch(app.embedUrl, { method: 'GET', mode: 'no-cors', credentials: 'omit' })
      .then(() => {
        this.pwaCache.set(app.embedUrl, true);
        this.updatePreloadStatus(app.embedUrl, true);
      })
      .catch(() => {}); // CORS attendu
  }

  preloadAllEmbedded() {
    this.apps.filter(a => a.embedUrl).forEach(app => this.preloadPWA(app));
  }

  updatePreloadStatus(embedUrl, loaded) {
    const btns = document.querySelectorAll(`.embed-btn[data-embed-url="${embedUrl}"]`);
    btns.forEach(btn => {
      if (loaded) btn.classList.add('preloaded');
      const status = btn.querySelector('.embed-preload-status');
      if (status) status.title = loaded ? 'Préchargé ✓' : 'Préchargement…';
    });
  }

  // ---- Overlay PWA ----
  currentEmbedApp = null;

  openEmbed(app) {
    if (!app.embedUrl) return;
    console.log('Opening embed:', app.num);
    this.currentEmbedApp = app;

    this.embedTitle.textContent = app.title;
    this.embedSubtitle.textContent = app.num;
    this.embedIframe.style.display = 'none';
    this.embedIframe.classList.remove('loaded');
    this.embedLoading.style.display = 'flex';
    this.embedIframe.src = app.embedUrl;
    this.embedOverlay.classList.add('visible');
    document.body.classList.add('overlay-open');

    const onLoad = () => {
      this.embedLoading.style.display = 'none';
      this.embedIframe.style.display = 'block';
      this.embedIframe.classList.add('loaded');
      this.embedIframe.removeEventListener('load', onLoad);
      setTimeout(() => this.embedIframe?.focus(), 100);
    };
    this.embedIframe.addEventListener('load', onLoad);
  }

  closeEmbed() {
    if (!this.currentEmbedApp) return;
    this.embedOverlay.classList.remove('visible');
    this.embedIframe.src = 'about:blank';
    this.embedIframe.style.display = 'none';
    this.embedIframe.classList.remove('loaded');
    this.currentEmbedApp = null;
    document.body.classList.remove('overlay-open');
  }

  // ---- Chargement ----
  hideLoading() {
    if (this.loading) this.loading.classList.add('hidden');
  }

  showError(msg) {
    if (this.loading) {
      this.loading.innerHTML = `<div class="loading-text">❌ ${sanitizeHTML(msg)}</div>`;
      this.loading.style.color = '#ff3d9a';
    }
  }

  setProgress(percent, text) {
    if (this.loadingBar) this.loadingBar.style.width = percent + '%';
    const loadingText = this.loading?.querySelector('.loading-text');
    if (loadingText && text) loadingText.textContent = text;
  }
}

// ============ INIT ============
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function setLoadingText(loading, text, color) {
  if (!loading) return;
  const t = loading.querySelector('.loading-text');
  if (t) t.textContent = text;
  else loading.textContent = text;
  if (color) loading.style.color = color;
}

function initApp() {
  console.log('initApp called, readyState:', document.readyState);
  const loading = document.getElementById('loading');
  setLoadingText(loading, '🔄 Initialisation…');

  const timeoutId = setTimeout(() => {
    setLoadingText(loading, '⚠️ Initialisation lente…', '#ffd23f');
  }, 5000);

  // Garde-fou : l'écran de chargement ne doit jamais bloquer définitivement.
  const watchdogId = setTimeout(() => {
    if (window.keffStation?.initialized) return;
    clearTimeout(timeoutId);
    if (loading) {
      loading.innerHTML = '<div class="loading-text">❌ Initialisation impossible (réseau trop lent ?).<br><button type="button" id="init-retry" style="margin-top:12px;min-height:48px;padding:10px 22px;border-radius:999px;border:1px solid #ffd23f;background:transparent;color:#ffd23f;font-weight:700">↻ Réessayer</button></div>';
      loading.style.color = '#ff3d9a';
      document.getElementById('init-retry')?.addEventListener('click', () => window.location.reload());
    }
  }, 15000);

  try {
    window.keffStation = new KeffStation();
    console.log('KeffStation created, starting init...');
    window.keffStation.setProgress(2, '📦 Chargement module…');
    window.keffStation.init().then(() => {
      clearTimeout(timeoutId);
      clearTimeout(watchdogId);
      setLoadingText(loading, '✅ KeffStation prêt', '#27d17f');
      setTimeout(() => loading.classList.add('hidden'), 1000);
    }).catch(e => {
      clearTimeout(timeoutId);
      clearTimeout(watchdogId);
      console.error('App init failed:', e);
      setLoadingText(loading, '❌ Erreur: ' + (e?.message || e?.toString() || 'Erreur inconnue'), '#ff3d9a');
    });
  } catch (e) {
    clearTimeout(timeoutId);
    clearTimeout(watchdogId);
    console.error('Constructor/InitApp sync error:', e);
    setLoadingText(loading, '❌ Erreur sync: ' + (e?.message || e?.toString() || 'Erreur inconnue'), '#ff3d9a');
  }
}

// Expose for debugging
window.KeffStation = KeffStation;
window.orbitPosition = orbitPosition;
console.log('KeffStation module loaded');
