# Inventaire local — services techniques et ressources ViArtificial Labs (2026-11-03)
Ni COS ni Recyclor ne sont des BLM : ce sont des services techniques avec des
liens documentés vers l'équipe BLM. Les dictionnaires sont des ressources
internes (aide à comprendre/formuler), jamais du texte à réciter.
## COS (langage de connexion) — service, pas de numéro BLM
- Implémentation : `src/cos-langage.js` (grammaire issue de motor.s),
  `src/cos-registre.js` (147 entrées : 110 BLM + 16 familles + 2 langues +
  15 patterns + 4 paramètres, généré du catalogue), `src/cos-defaut.js`
  (118 paires `Dépend:`, généré).
- Sélecteur des moteurs ACTIVÉ par défaut (`COS_ACTIF = true`, opt-out
  `desactiver()`) : table des routes explicite `ROUTES` (`blm-moteurs-cos.js`,
  moteurs réellement présents uniquement) ; `selectionner(etat, plan, env,
  besoins{bot, equipe, fournisseur, ollamaUrl})` consulte les besoins puis
  TRANSMET le choix à 066 (`resoudreMoteur`, portes + repli conservés).
  Traces séparées : routes d'exécution `route/<moteur>` (bloc `route`) vs
  liens d'apprentissage du graphe `cos/lien-*` (bloc `cos`, jamais promus
  comme routes).
- Fiches SuperBots (`src/cos-fiches.js`, grammaire cos.js portée) : la grammaire
  `<co bot>` + `lireBlocCo` est DISPONIBLE et le parseur est RÉELLEMENT APPELÉ
  (`choisirParleur` → `ficheDepuisBloc` → `lireBlocCo`, représentation `<co>`
  générée depuis `bots.json`, source unique, aller-retour vérifié, valeurs
  manquantes → `nonRenseigne`). AUCUN producteur de repli : `ficheDepuisJson`
  n'est employé nulle part dans le parcours (relique non branchée). Échec de
  parse → fiche écartée + trace, mémoire seule. Liens `?bot=<id>` préservés à
  la création : cartes `index.html` (`?bot=<id>`), bouton direct ViA dans le
  hero (`conversation.html?bot=via`, statique, sans JS), `xsstream.html`
  transmet le `?bot=` entrant (choix explicite de la page prioritaire) ;
  `via.html` = raccourci cliquable (redirection auto + bouton).
- Liens avec l'équipe : `orchestrerBLM` exécute `liensPourEquipe` sur l'équipe
  mobilisée (classement compatibilité + tourniquet par vague, borne MAX_LIENS=8
  après classement) ; liens tracés `cos/lien-*`, écartés tracés avec raison ;
  `etat.cosLiens` validé au contrat. Sélection COS des moteurs ACTIVE par
  défaut (`COS_ACTIF = true`, opt-out explicite conservé), distincte et
  complémentaire de 066 : la sélection COS propose, `resoudreMoteur` dispose.
  066 reste DÉTERMINANT : runItem refuse si ≠ local-cpu-wasm, runRemote refuse
  si `aucun` (adresse manquante) ; GPU toujours indisponible, nœuds logiques
  jamais déclarés actifs.
## Recyclor — service, pas de numéro BLM
- Implémentation : `src/recyclor.js` (`copierFidele` SHA-256, `backupSante`,
  `restaurerSante`, `transmettre` anti-perte/doublon/mélange, `autorise`).
- Liens avec l'équipe : `transmettre` cloisonne par botId (même règle que
  mémoires) ; `autorise` user+bot ; journaux sous `miroirs/…` hors dépôt.
## Moteurs LLM — services, pas de BLM
- `providers.js` (local CPU/WASM partagé, ollama, custom), `local-wasm.js` +
  worker (sysPrompt unique partagé, sys jamais tronquée, 64 tokens max).
- Liens : 066 choix-moteur, 068 sysPrompt, 069 entrée classée, 005/099 portes.
- Choix tracé (`resoudreMoteur`, porte S4, `parcours/moteur-*` + repli) :
  local réel par défaut ; distant seulement si adresse configurée ; GPU
  toujours indisponible. 005/099 = LIMITES, pas des objectifs de vitesse.
## XRead — relecture interne, jamais une voix
- `xreadTouch(item, dernierTexte)` : analyse locale de la réponse contre les
  souvenirs classés du binôme, trace + journal, SANS génération, SANS parole,
  SANS écriture mémoire. Seul le SuperBot sélectionné parle (salutations comprises).
## Séances cloisonnées — historiques par bot, jamais mélangés
- Stockage `via-seances-<bot>` : [{id, titre, messages, langue, horodatages}] ;
  active suivie dans `via-seances-actives`. Création = contexte vide ;
  reprise = explicite (`Reprendre`) ; anciennes `via-conv-*` migrées une fois
  en séance archivée `s-legacy` consultable, clés supprimées, jamais
  réinjectées. Réponses tardives ignorées (`item.sessionId` vs active).
  Salut seul → bref sans présupposition ni relance ; « Ça va ? » →
  `question-sociale` → réponse brève (moteur contourné comme les salutations).
  Formulations vérifiées (`blmCorrigerReponse` + `verifierFinaleBLM` : bref≤120,
  emoji final accepté). ViaMemory (carnet/profil) intact et séparé.
  AUCUN corpus publications/transcriptions dans le dépôt : 106 reste une
  consultation tracée à base vide ; dicos = aides internes jamais récitées.
## Formation documentaire et simulée — socle + approfondissement (NOUVEAU)
- `src/blm-formation.js` (AUCUN nouveau numéro BLM : alimente 045/046/049/050) :
  niveaux 1 illustrés/récits → 2 jeunesse/généraliste → 3 adultes/pro →
  4 spécialisés → 5 références ; classification {domaine fermé, niveau,
  langue fr/en, concepts, prérequis, provenance exacte, licence, fiabilité,
  média, vecu documentaire/simule}.
- Socle d'amorçage VÉRIFIÉ (6 notions, toutes internes au dépôt, paraphrasées —
  aucun texte recopié, aucun corpus externe embarqué) : tutoiement-fr (N2),
  salutation-breve (N2), credits-virtuels (N3), memoire-cloisonnee (N3),
  coherence-doute (N4), redemande-unique (N4, prerequis coherence-doute).
  N1 et N5 : VIDES, manque signalé (aucun contenu jeunesse vérifié, aucune
  référence approfondie vérifiée).
- Homologation `homologuer()` : domaine connu, niveau 1-5, langue fr/en,
  concepts renseignés, licence ouverte/autorisée explicite, prerequis tous
  présents, résumé ≤300c, AUCUN champ de texte intégral (refus structurel) ;
  `vecu` restreint à documentaire/simule/null.
- Règles : seules les entrées FIABILITÉ VÉRIFIÉE atteignent le moteur
  (max 2, ancres ≤300c étiquetées avec source) ; jamais de texte intégral,
  jamais de récitation, jamais de liste affichée ; la formation reste invisible
  (améliore compréhension/exemples/manière de s'exprimer sans annoncer de
  livres) ; provenance conservée (faits sourcés vs déductions vs simulé).
- Vécu : un SuperBot peut apprendre de ressources décrites mais ne prétend
  JAMAIS avoir personnellement vécu un événement (garde `detecterRevendicationVecu`,
  repli modèle, tracé `conscience/vecu-simule-exige`).
- Graphe : notions indexées (`notion:<id>`, prerequis vérifiés) ; compat :
  prerequis-formation, savoir-puise-formation (045/046/049/050),
  approfondissement-bot (domaine du rôle) ; runtime inchangé (sélection légère).
## Graphe COS complet — indexé hors parcours
- `scripts/gen-cos-graphe.cjs` : ~1,1 M de liens vérifiés (dépendances +
  notions), 118/118 paires Dépend valides, prerequis des notions tous
  résolus ; shards ignorés git + `index.json` suivi, `--cherche` sans tout
  charger, `--evoluer` réservé aux résultats réels (0 actif initial).
  Le parcours actif garde la sélection légère (ancres, jamais les notions
  entières).
## Mesures réellement disponibles (110 COU-MESURES, seules déclarables)
- Oui : deviceMemory, monothread/multithread, stockage estimé, backend wasm,
  tokenizer, crédits virtuels (097/098/100), tokens estimés ≈4 car/token
  (heuristique NON validée), compteurs journal. INTERDIT de déclarer :
  tokens/s, FPS/IPS, GPU (non utilisé), CPU%.
## Dictionnaires — ressources, jamais récitées
- `dico-philo.js` fichePhilo → 104/105 (consultés si linguistique + mot ; base
  vide = tracé sans invention) ; verifierReponse → 051-056 (branchée, jugement).
  `dico-expressions.js` → 106 (`scorerPublication({})` réel si pertinent ;
  popularité 0 / véracité non évaluée, jamais affiché). `etats-keff.js`
  etatAffectif → 109 (calculé par réponse à afficher, fiction re-confirmée) ;
  comparerTemperatures/arbitrerCharge → 110 (référentiel des mesures réellement
  disponibles, indisponibles interdites).
  Règle : 1 fait étiqueté max vers le moteur, jamais de liste affichée.
## Version en ligne
- L'application en ligne (GitHub Pages, branche déployée) ne reçoit ces
  contenus qu'après commit + push explicites de l'humain (jamais par l'agent).
  Vérifier avant toute démo : `curl` de la page servie doit contenir
  `cos-defaut`, `blm-usages`, `__dernierEtat`, `BLM-110`.
- Fiches SuperBots : grammaire cos.js portée (`src/cos-fiches.js`), bots.json
  converti sans invention, registre 003 valide, sélection départagée par
  mots/tags. Moteur : `resoudreMoteur` DÉTERMINE l'appel (runItem/runRemote
  refusent si `aucun`). XRead : lecture seule, aucun affichage ni écriture.
  Graphe : états candidat/valide distincts, 0 actif (promotion `--evoluer`
  réservée aux résultats réels). `selectionner()` COS : inactive, distinct de
  066 (activation = choix ouvert). « COS preserve » : ancienne hypothèse non
  mesurée, sans effet de code (`etats-keff.js:3` reformulé). Validation
  téléphone : étape ultérieure, non demandée.
  Graphe : états candidat/valide distincts, 0 actif (promotion `--evoluer`
  réservée aux résultats réels).
