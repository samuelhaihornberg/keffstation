# Moteurs : types, états, polarités — existant vs NOUVEAU (2026-11-02)

## Ce qui existait déjà (vérifié dans le code)
- **Types** : AUCUN système de types moteur. Seuls fournisseurs réels : `local`
  (CPU/WASM), `ollama`, `custom`, `none` (`providers.js`) + `webllm` migré vers local.
- **États** : phases moteur `idle/checking/needs-consent/downloading/loading/ready/
  generating/error` (`local-engine.js`) ; statuts mémoire `actif/termine/bloque`
  (`memoire-classee.js`) ; issues journal `succes/refus/erreur` (`blm-journal.js`) ;
  intentions `salutation/question/message` (019). Aucun état moteur unifié.
- **Polarités** : UNE SEULE occurrence, affective et calculée, SANS rapport moteur :
  `POLARITES = positive/negative/abstraite` (`etats-keff.js`, états simulés,
  `conscienceVecue:false`). AUCUNE polarité de circulation définie.
- **COS** : aucune définition (mentions : manifest `cos, SuperBots`, recyclor
  `cos V5`, app.js `Syntaxe cos (connexions)`). **MANQUE : spec COS absente.**
- **Nœuds** : aucun (`matrice-v1.csv` = graphe BLM documentaire, pas de calcul ;
  `local-engine` = CPU/WASM monothread réel ; WebGPU non utilisé).

## Règles NOUVELLEMENT définies (n'existaient pas, à confirmer)
1. `src/blm-moteurs-cos.js` — Types `inference|savoir|correction|memoire` ;
   états `disponible|indisponible|en-charge|refuse-budget|hors-perimetre` ;
   polarités circulation `emetteur|receveur|neutre`. Sélection BLM (064/066) :
   salutation/hors-périmètre/budget → `repli` seul ; sinon 1er inference disponible.
2. `src/noeuds-calcul.js` — Familles `cpu|gpu|virtuel|matrice|pattern|networkien`.
   Physiques RÉELLES : `cpu-wasm`, `ollama-distant` (si adresse). Tout le reste
   (graphe BLM, regex, crédits virtuels, WebGPU) = LOGIQUE ou INDISPONIBLE.
3. `src/recyclor.js` — `transmettre(el, botSrc, botDst, vus)` : empreinte SHA-256
   par étape, Set anti-doublon, cloison botId (refus si mélange). Repli local
   si `motor-noyau/host-policy` absents (**MANQUE : ces deux fichiers
   n'existent pas dans le dépôt**).
4. `src/blm-contrat.js` — champ optionnel `moteurs: []` (v4 conservée, rétrocompatible).
5. `src/memoire-classee.js` — `projetDuBot` + `verifierCloisonnement` explicites
   (comportement inchangé : projet = botId, moteur LLM partagé, ViA sociable intacte).

## Décisions à confirmer (humain)
- Valider/rejeter les 3 vocabulaires NOUVEAUX (types/états/polarités + familles nœuds).
- Spec COS réelle (connexions A1➡️B2 du cos-editor ?) : brancher ou non sur BLM.
- `motor-noyau.js` / `host-policy.js` : restaurer, ou entériner le repli local.
- Seuils 005/099 toujours heuristiques (plan-v1) : mesurer en usage réel.

## Équipes de cohérence (NOUVEAU 2026-11-02, `src/blm-equipe.js`)
- Équipe = intention → vagues (routage 002 PRÉSENT : 3/2/2/18 blocs, jamais 100).
  `salutation` (019+035+057, sans moteur), `minimal` (019+035),
  `repli` (019+028, sans moteur), `standard` (6 vagues S1→S6).
- Ordre/parallélisme : S1/S4/S6 portes séquentielles (socle, décision, finale) ;
  S2 (compréhension+langue), S3 (mémoire+savoir+registre), S5 (cohérence+
  correction+amitié) parallélisables car lecture seule sur EtatMessage/texte.
- Mise en commun : EtatMessage enrichi par champ (contrat PRÉSENT : chaque bloc
  n'écrit que ses champs + trace) ; `formulerEntreeClasse` PRÉSENT (rôles
  fiables vs bloc mémoire étiqueté) ; sysPrompt unique PRÉSENT (068).
- Contradictions : `etat.contradictions[]` + verdicts cohérence PRÉSENTS
  (vouvoiement-vs-tutoiement, incohérent→repli terminal, doute conservé-signalé,
  redemande unique tentative 1). RÉSOLUTION FORMALISÉE 2026-11-03
  (`src/blm-equipe.js resoudre()`, 5 niveaux imposés) : L1 sécurité (fuite→repli,
  PII masquée→on continue) ; L2 fonction-bot (personnification→repli car
  conscience simulée = fiction 008 ; fonction contrariée→repli) ; L3 fidélité
  (forme touchant citation/nom/fait→correction écartée, affiche-signalé, 032/
  033/049/083) ; L4 cohérence (incohérent→repli, doute→affiche-signalé 026/077) ;
  L5 correction (doute 084→signalé, sinon tracée 086). Chaque niveau verse
  `{niveau, bloc, regle, sortie}` dans `trace[]`, compatible `BLMContrat.tracer`.
- Gardes PRÉSENTES : cloisonnement par bot (projet=botId), aucun BLM ne touche
  sysPrompt/personality, ViA sociable (096 + consigne providers.js), xread
  binôme 1 phrase + silence si incohérent.
- Familles par vague : voir `FAMILLES_PAR_VAGUE` (16 familles, amitié hors
  binôme exclue, coûts en suivi 098/100).
- VÉRIFICATION 2026-11-03 (catalogue étapes + plan-v1 S1-S6 + code) :
  S1 porte (001,003,004,007,011,015 — tous cat. étape 1) ; S2 logique
  (019-027 sauf doublon, +028 exécuté par `blmComprehension→dansPerimetre`,
  +029-031,034 — tous cat. étape 2) ; S3 logique (+014 via `sansProfilDeduit`,
  035-041,043,044,045-050,057,058,061 — tous cat. étape 3) ; S4 porte
  (005/099 cat. étape 1 + 097 cat. étape 6 rangés ici car plan-v1 S4 + porte
  budget du code, 063-070 cat. étape 4, +096 cat. étape 4 MAIS non câblé en
  code — à préciser) ; S5 logique (010,032,033,071-078,079-085,093-095 cat.
  étape 5, +059 cat. étape 5 MAIS non câblé — à préciser ; 026 retiré de S5
  le 2026-11-03, doublon : acteur S5 = 077) ; S6 porte (006,009,012,013,016,
  017,018,087,098,100 cat. étape 6 + 008/051-056/060/062 cat. étape 5 rangés
  ici car plan-v1 S6 + `verifierFinaleBLM` du code). Hors vagues :
  `NON_AFFECTES` (002 stratégie, 042 sur demande, 086 passive, 088 doc seule,
  089-092 runner direct — statuts plan-v1). Salutation : formule + marque
  d'état exigées, réponse directe sans moteur. Monothread : vagues = logiques
  (seul worker réel = inférence WASM, jamais les BLM) ; écriture par champ,
  seule variable de module mutable = compteur 097 dans la porte S4.

## COS / cos-editor / 005 / 099 — confirmés vs à décider (2026-11-03)
- CONFIRMÉ (recherche exhaustive) : COS n'a AUCUNE définition exécutable dans
  le projet. Mentions = textes marketing uniquement : `app.js:61-62,72,89-94`
  (« Syntaxe cos », « Guide cos : connexions A1➡️B2 »), cartes
  `cos-editor/index.html` (« connexions A1➡️B2 », sans grammaire ni code —
  3 fichiers statiques : index/manifest/sw), `viartificial/manifest.json`
  (« cos, SuperBots… »), `etats-keff.js:3` (« COS preserve : gain ~50%… »,
  allégation non mesurée), `recyclor.js:2` (« cos V5 », version non définie
  ailleurs). `matrice-v1.csv` = paires BLM uniquement, aucun lien BLM↔COS.
  A1→B2 N'EST PAS une règle établie : jamais supposé.
- DÉCIDÉ : routage COS INACTIF par défaut (`blm-moteurs-cos.js` : `COS_ACTIF =
  false`, `selectionner()` → null, `activer()` opt-in explicite) ; les deux
  points d'appel (`conversation.html` orchestration + porte S4) n'agissent que
  si `estActif()`, sinon trace `cos-inactif-spec-manquante` ; repli existant
  (002/005/099 → reponseSalutation) conservé tel quel.
- CONFIRMÉ 005 (ORC-BUDGET) : enveloppe = tokens d'entrée max PAR APPEL moteur
  (sysPrompt + contexte classé + demande), défaut 2048, plage 512–8192,
  heuristique ≈4 car/token NON validée scientifiquement ; absent → refus moteur
  + repli, jamais d'illimité silencieux. Sources : `catalogue-v1.md:19-21`,
  `plan-v1.md:14`, `src/blm-budget.js` (`calculerEnveloppe/appliquerEnveloppe`).
- CONFIRMÉ 099 (COU-PLAFOND) : plafond = APPELS moteur PAR SESSION (comptés par
  097 `compteurDefaut`, défaut 50/session, remis à zéro au rechargement),
  plage 1–500, 0 = moteur coupé ; absent → refus + repli. Sources :
  `catalogue-v1.md:301-303`, `plan-v1.md:15`, `src/blm-couts.js`.
  005 et 099 sont des BORNES DE COÛT EXPLICITES, pas des optimums prouvés.
- À DÉCIDER : spec COS réelle (grammaire, graphe, correspondances BLM↔COS) ;
  activation du routage COS ; seuils chiffrés définitifs 005/099 (mesure en
  usage réel, plan-v1) ; sort de « COS preserve » (`etats-keff.js:3`,
  allégation non étayée — reformuler ou supprimer).

## COS langage — défini ici vs préexistant (2026-11-03)
- PRÉEXISTANT (découvert dans `/root/projets/motor.s`, hors dépôt KeffStation) : grammaire `<cos>/<co>`, formes
  `to/➡️/⬅️`, pointe = receveur, condition if, donneur/receveur, ID
  `^[A-Za-z][A-Za-z0-9]*$`, `↔` = description jamais traversable
  (`co-cos-commun.js`), cartes + ordre documentaire, `parseSpec/traiter`.
  Référence IDs L00/A01-D01 = AUTRE domaine (non importée : non-résolue ici).
  ViArtificial `cos.js` (règles bot) cité par co-cos-commun : ABSENT du dépôt.
- DÉFINI ICI (NOUVEAU) : `src/cos-registre.js` (généré du catalogue : 110 BLM
  complets + 16 familles + fr/en + 15 patterns du code + 4 paramètres 005/099 ;
  alias ≠ remplacement, `manque[]` si insuffisant), `src/cos-defaut.js` (118
  paires `Dépend:` du catalogue, dont 12 des 101-110), `src/cos-langage.js` (analyseur, résolution,
  compatibilité ancrée, sélection d'équipe, rotation documentaire bornée
  MAX_LIENS=8), champ contrat `cosLiens`, intégration `orchestrerBLM`
  (liens exécutés → tracés `cos/lien-*`, jusqu'à 4 signalements tracés).
- Règles de compatibilité (NOUVELLES, ancrées) : BLM→BLM si `depend` catalogue ;
  BLM↔famille si membre ; famille→famille : phases S adjacentes À VÉRIFIER ;
  langue→BLM si famille touche-langue ; pattern→BLM si documenté pour lui ;
  BLM→paramètre si produit ; paramètre→BLM JAMAIS.
- « i » de A1→iB2 : AUCUNE classe/propriété ne le définit (recherche
  exhaustive) → `modificateur-inconnu`, lien NON exécuté, signalé.
- Connexions désormais exécutées (sélection CORRIGÉE 2026-11-03 : classement
  par compatibilité puis tourniquet par vague du receveur, borne MAX_LIENS=8
  appliquée APRÈS classement ; écartés tracés avec rang et raison) :
  standard = 8 liens couvrant les 6 vagues (ex. 001→003 S1, 001→019 S2,
  035→014 S3, 097→005 S4, 026→010 S5, 087→008 S6, +2 second tour S1/S2) ;
  salutation = 019→057 ; repli/minimal selon mobilisation.

## Orchestrateur ViA BLM+COS (2026-11-03, `src/blm-usages.js` + `conversation.html`)
- Constat préalable : la version GitHub Pages observée (`.../keffstation/
  viartificial/conversation.html`) NE contient PAS les changements non
  commités (0 occurrence de `__dernierEtat|cos-langage|blm-equipe`) et n'a PAS
  le fix sys-préservée (`sys0` absent) → consigne système éjectable quand
  l'historique remplit le contexte, template anglais par défaut du worker
  (cause probable du « Bonjour How can I assist you today? » et des fragments
  du mini-modèle 360M). Les dicos locaux (`dico-expressions.js` = registre
  d'usages vide au démarrage, `dico-philo.js` = vérificateur) ne contiennent
  AUCUNE liste à réciter et ne sont pas transmis au moteur (seul UN fait
  étiqueté transite via `formulerEntreeClasse`). Le COS récent n'a donc PAS
  été testé par cette capture.
- Rôles (correspondances catalogue, aucun nouveau numéro) : reconnaissance =
  019-028 (CMP) + `distinguerDemande` (salut-simple vs explication-
  linguistique vs ordinaire) ; coutumes = 057/058/061 (REG) + 045/046 (SAV,
  aide interne jamais récitée) ; suite = 060/053/074 (type interne
  inviter-repondre|poursuivre-sujet|conclure, jamais affiché) ; formulation =
  068/069 (sysPrompt + moteur) ; orchestrateur = 002 + portes S1/S4/S6.
- Règles : salut simple (« Salut ») → réponse sociale directe brève + relance,
  sans moteur, sans cours ; explication linguistique → moteur avec contrainte
  FR + aide dico interne étiquetée (1 fait max) ; sorties internes (formule,
  suite) jamais concaténées ni transmises au moteur (vérifié : absentes de
  `prep.msgs`) ; un seul texte final. `demandeType/formule/suite` validés en
  contrat (champs internes). Langue persistée par bot (`via-langue-<bot>`,
  conservée sauf marqueurs forts de l'autre langue). Personnalités intactes
  (`bots.json` non modifié). Harnais Node : 7 cas vérifiés (dont EN conservé
  puis bascule explicite), batterie 85/85. Vrai moteur : NON testé ici
  (Chromium conteneur SIGTRAP) — à valider sur l'appareil via le protocole
  du 2026-11-03.
- VÉRIFICATION NAVIGATEUR (2026-11-03) : BLOQUÉE. Binaires présents
  (chromium-1248 + headless shell arm64, v156 — lancement OK) mais toute
  création de page plante : SIGTRAP exit 133 sur `--dump-dom` pour les deux
  binaires, `newPage` Playwright « Target closed », GPU exit_code=5 (conteneur
  aarch64 sans Xvfb/dbus). Aucune page chargée ⇒ moteur LLM réel (WASM 390 Mo)
  non tenté, réponse réelle NON validée. Seul le harnais Node sur code réel
  fait foi (parcours ci-dessus). Rôles, sysPrompt, mémoires par
  bot inchangés ; ViA sociable, sans revendication de conscience.
- Statut DOCUMENTAIRE au 2026-11-03 (vérifié statiquement, pas d'exécution) :
  066 `resoudreMoteur` CÂBLÉ et déterminant (gates runItem/runRemote) ;
  005=2048 et 099=50 CÂBLÉS et appliqués (portes + refus + traces) ;
  classement compatibilité + tourniquet + MAX_LIENS=8 CÂBLÉS (sélection
  d'équipe) ; grammaire cos `<co bot>` DISPONIBLE et parseur `lireBlocCo`
  RÉELLEMENT APPELÉ (chaîne unique choisirParleur→ficheDepuisBloc→lireBlocCo,
  sans producteur de repli). Distinguer : sélection COS des moteurs
  (`selectionner`) TOUJOURS INACTIVE par défaut — ce n'est pas 066.
- À DÉCIDER : MAX_LIENS et critère d'ordre (biais S1 actuel), activation
  routage-sélection COS, seuils 005/099 définitifs, sort de « COS preserve ».

## Câblage 101–110 (2026-11-03, exécutés seulement si pertinents, jamais forcés)
- 101 (S2) : `repererCandidats` (blm-comprehension) si ≥2 mots porteurs →
  `etat.expressions[]` {texte, statut:'candidat-non-verifie'} (faute de dico
  d'idiomes : candidats, pas idiomes attestés), jamais affichés ni transmis.
- 103 (S4) : `traductionDemandee` (verbe + cible) → contrainte + annotation
  `[Consigne BLM-103]` de la demande (seul vecteur vers le moteur).
- 104/105 (S3) : 1 seul `definirMot` partagé si linguistique + mot ; base vide
  → tracé, rien d'inventé ; fait unique étiqueté si trouvé (jamais récité).
- 106 (S3) : `scorerPublication({})` réel si marqueurs d'usage ou candidats →
  popularité 0 / véracité non évaluée, interne, jamais affiché.
- 109 (S6) : `etatAffectif` dans `verifierFinaleBLM` si réponse à afficher →
  `etat.simulation` (conscienceVecue:false), fiction re-confirmée.
- 110 (S4) : `mesuresReelles()` par appel moteur → `etat.mesures`
  (disponibles + indisponibles : tokens/s, FPS/IPS, GPU, CPU% interdits).
- Vérifié (harnais, code réel) : 101 candidats sur messages multi-mots,
  103 annoté sur « Traduis … en français », 104/105 base-vide sans invention,
  106 popularité 0, 109 vecu=false, 110 indispo listés ; msgs sans
  expressions/formule/suite/simulation ; batterie 85/85, 0 doublon, 0 orphelin.

## Parcours global 11 étapes (2026-11-03, `PARCOURS` blm-equipe.js)
Ordre : LLM partagé (066) → orchestrateur d'entrée 001 → équipe 002 + vagues
→ orchestrateur de synthèse 065 (budget + entrée classée) → registre
SuperBots 003 → orchestrateur de sélection 003 (UN seul bot parle :
`choisirSuperBot`, mémoires pertinentes via `noterPertinence`, égalité →
premier/choix explicite) → SuperBot (personnalité préservée) → orchestrateur
de réponse 087 (correction + vérification) → LLM partagé formulation 068
(sysPrompt unique) → orchestrateur de sortie 006 (`finaliserSortie` : un seul
texte, journal sans brut, sauvegarde) → utilisateur.
Handoffs via COS existantes (`relierEtape` : 001→002 et 002→065 compatibles
`depend-catalogue`, tracés `cos/etape-ok` ; sinon simple trace, jamais inventé).
Nœuds : seules ressources physiques tracées (`noeuds/ressources-physiques-seules`).
Vérifié statiquement (parse des 8 fonctions, PARCOURS au registre, handoffs,
sélection) ; AUCUNE batterie ni conversation lancée.
Non câblé : seuils 005/099 définitifs (valeurs 2048/50 CÂBLÉES et appliquées,
seuls les chiffres définitifs restent à mesurer).

## Moteurs, xread interne, graphe million (2026-11-03)
- Moteurs (`resoudreMoteur`, porte S4, tracé `parcours/moteur-*`) : local
CPU/WASM = réel ; Ollama distant seulement si adresse configurée, sinon repli
explicite ; GPU = toujours indisponible (aucun moteur WebGPU dans le projet,
jamais déclaré actif). Nœuds virtuels/matrice/patterns/networkiens =
catégories logiques (`noeuds/` tracé ressources physiques seules). 005
(enveloppe 2048) et 099 (plafond 50) tracés comme LIMITES (`couts/limite-*`),
pas des objectifs de vitesse.
- XRead 093-095 : relecture interne en lecture seule (`xreadTouch(item,
dernierTexte)`) — analyse locale de la réponse contre les souvenirs classés
du binôme, trace `xread/lecture-seule-*` + journal, SANS génération, SANS
parole à l'utilisateur, SANS écriture mémoire. Seul le SuperBot sélectionné
parle (salutations comprises). Exception à trancher : conservation du binôme
relecteur vs sélection stricte.
- Graphe COS (`scripts/gen-cos-graphe.cjs`, déterministe, une commande) :
1 034 280 candidats (170 nœuds : 110 BLM + 16 familles + 2 langues + 15
patterns + 4 paramètres + 7 SuperBots + 4 moteurs + 11 orchestrateurs + 1 LLM ;
paires ordonnées sans auto-lien × to/→/← × 12 contextes), chacun vérifié :
77 616 valides / 956 664 écartés + motif ; 0 actif initial (réservé aux
résultats réels via `--evoluer`). Les 118 paires `Dépend:` du doc défaut sont
toutes valides. Shards `src/cos-graphe/shard-*.jsonl` (ignorés git,
régénérables) + `index.json` suivi ; consultation sans tout charger
(`--cherche`) ; le parcours actif garde la sélection légère existante
(cos-defaut + équipe + borne).
- Vérifié statiquement : 10 fonctions parsées, PARCOURS 11 au registre,
handoffs 001→002/002→065 `depend-catalogue`, sélection (explicite >
mémoires > défaut), moteur (3 cas), graphe (total + 118/118). AUCUN
lancement, AUCUNE conversation, AUCUNE batterie.

## Règles bot cos.js + moteur déterminant + xread lecture seule (2026-11-03)
- cos.js réel (`/root/viartificial/src/cos.js`, identique autre dépôt) :
  grammaire blocs `<co bot>` + lignes `code op clé: valeur`, ID
  `^[A-Za-z][A-Za-z0-9]*$`, gardes (1 Mo, anti-traversal, doublons refusés,
  lignes non conformes = erreurs signalées). Effets : fiches bot structurées
  (role, temperament, voix, reglePropre, mots, echelle, capacites, gadgets,
  pour-contre, modes, droits, refus, limiteBalancier) ; seul `norm` était
  réutilisé (`regles.js`), `parseCOS/chargerFamille` sans appelant.
  Câblé via `src/cos-fiches.js` (grammaire portée + `ficheDepuisBloc` :
  représentation `<co>` générée de `bots.json` → `lireBlocCo`, aller-retour
  vérifié, valeurs manquantes → `nonRenseigne`) : registre 003 valide les
  fiches (`registre/fiche-<id>`), sélection départagée par mots/tags en cas
  d'égalité de mémoires. `ficheDepuisJson` : repli historique non employé par
  le parcours. AUCUN .cos inventé.
- Moteur déterminant (066) : `resoudreMoteur` couvre none/webllm/local/ollama/
  custom/gpu ; runItem REFUSE si ≠ local-cpu-wasm, runRemote REFUSE si
  `aucun` — la fonction décide de l'appel réel, pas seulement la trace.
  GPU toujours indisponible (aucun WebGPU) ; nœuds logiques jamais déclarés actifs.
- XRead 093-095 : relecture interne, SANS `ViaLocalEngine.chat`, SANS
  `addPulsed`, SANS `h.push`/`saveConv`, langue du binôme restaurée
  (`memLangue`) ; seul le SuperBot sélectionné parle.
- 005 (=2048, `blm-budget.js`) et 099 (=50, `blm-couts.js`) inchangés :
  limites, pas objectifs. Classement compatibilité + tourniquet par vague
  avant MAX_LIENS=8 inchangés. Graphe : candidats 1 034 280 / valides 77 616
  / 0 actif (réservé aux résultats réels via `--evoluer`, jamais auto-promu, vérifié : aucun `actif-confirme` dans les 12 shards).

## Matrice de circulation requête→réponse + alignement local/Pages (2026-11-04, statique, rien exécuté)
Chaîne vérifiée dans le code : version fichiers (`__VIA_BUILD`,
SW `viartificial-v29`) → PWA/SW/cache (navigate réseau-d'abord, .js
cache-d'abord + rafraîchi en arrière-plan, bots.json no-store, purge auto sauf
modèles IA) → bot + conversation (`H(bot.id)`, `saveConv`, `via-conv-<id>`) →
requête (`queue.push({id,text})`, `q<base36><seq>`) → orchestrateur + BLM
(traces `parcours/requete-<id>`, `selection-<bot>`, équipe, `cos/lien-r*`,
`suite-*`, `mesures`) → moteur réellement appelé (`resoudreMoteur` + gate +
trace `parcours/moteur-*`) → réponse rattachée (`item.dernierReponse`,
`finaliserSortie`, journal motif=requestId, `saveConv`) → affichage (méta =
bot + moteur réel : `moteur local`, `Ollama distant (réseau)`,
`réponse directe`, `simulé`).
Local vs Pages (constaté par fetch, fichiers intacts) : conversation.html
identique à l'octet (102 926, même ordre des 27 scripts) ; sw.js identique
v28 des deux côtés au moment du contrôle — ÉCART : sans bump, les navigateurs
ayant l'ancien SW resservent l'ancien parcours (HTML neuf + modules vieux en
cache-first). CORRIGÉ : cache `viartificial-v29` (purge à l'activation,
re-téléchargement des modules).
« En ligne » ≠ « moteur local » : le bandeau dit la joignabilité du SITE,
la bulle dit le MOTEUR d'inférence. Le diagnostic (`paintDiag`, Réglages)
affiche désormais les deux : `build : …` (version réellement chargée) +
`inférence : locale (cet appareil, CPU/WASM)` vs `DISTANTE (…)` +
`moteur actif : …`. Toute divergence build local/diag = décalage de
publication ou de cache, repérable immédiatement.
Reste à vérifier sur l'appareil : ouvrir `?bot=via`, lire diagDetail
(build + moteur actif), salutation (méta `réponse directe`), question
(méta moteur + journal motif=requestId), comparer `__VIA_BUILD` au déployé ;
si écart : vider les données du site (le SW v29 purge au prochain chargement).

## Suivi des écarts — état unique au 2026-11-03 (inspection statique, rien exécuté)
RÉSOLUS (câblés, vérifiés dans le code, comportements non observés en exécution) :
- XRead en relecture interne + un seul bot visible : `xreadTouch(item,
  dernierTexte)` sans `chat`/`addPulsed`/`push`/`saveConv`, langue du binôme
  restaurée, appelé avec la réponse produite ; `runItem`, salutations et
  `runRemote` (b0) ne font parler qu'un bot.
- 005=2048 et 099=50 comme limites appliquées : défauts sourcés
  (`blm-budget.js:7`, `blm-couts.js:6`), portes + refus + traces
  (`calculerEnveloppe/appliquerEnveloppe/compter`, `couts/limite-*`).
- Classement COS par compatibilité, tourniquet, ordre documentaire, puis
  MAX_LIENS=8 : `liensPourEquipe` appelé avec les vagues dans
  `orchestrerBLM` ; `classerLiens` + `parVague` + `MAX_LIENS = 8`
  (`cos-langage.js`) inchangés et en place.
- Parseur `lireBlocCo` appelé : chaîne unique
  `choisirParleur` → `ficheDepuisBloc` → `lireBlocCo` sur représentation
  `<co>` générée de `bots.json` (source unique, aller-retour vérifié, valeurs
  manquantes → `nonRenseigne`) ; aucun producteur de repli dans le parcours.
- Sélecteur COS des moteurs ACTIVÉ (2026-11-03, `COS_ACTIF = true` par défaut,
  opt-out `desactiver()` conservé) : table des routes explicite `ROUTES`
  (moteurs réellement présents uniquement — local CPU/WASM si modèle chargé ;
  ollama/custom-distant seulement si endpoint configuré ; repli toujours ;
  `aucun` sinon ; GPU toujours indisponible ; virtuel/matrice/pattern/
  networkien = catégories logiques) ; `selectionner(etat, plan, env,
  besoins{bot, equipe, fournisseur, ollamaUrl})` consulte bot + équipe active
  puis TRANSMET à 066 (`resoudreMoteur`, portes + repli conservés) ; gates
  runItem/runRemote déterminants (refus si moteur non appelable).
  Traces séparées : routes d'exécution `route/<moteur>` (bloc `route`) vs
  liens d'apprentissage du graphe `cos/lien-*` (bloc `cos`, jamais promus
  en routes).
À DISTINGUER (ne pas confondre) :
- Routeur 066 CÂBLÉ pour les moteurs pris en charge : `resoudreMoteur`
  (none/webllm/local/ollama/custom/gpu) + gates runItem/runRemote qui
  REFUSENT sans moteur valide — la fonction détermine l'appel réel.
- `selectionner()` COS : TOUJOURS INACTIVE par défaut (opt-in `activer()`) ;
  ce n'est pas 066 et ne le remplace pas.
- Graphe : 1 034 280 candidats / 77 616 valides / 0 ACTIF (`actif-confirme`
  absent des 12 shards ; promotion réservée aux résultats réels via
  `--evoluer`, aucun lien ne devient actif sans mesure réelle).
- Documentés SANS exécution (statuts catalogue inchangés) : 042 (sur demande),
  086 (passive), 088 (doc seule), 089-092 (runner direct) ; seuils définitifs
  005/099 ; activation sélection COS (ouverte, distincte de 066) ; critère
  d'ordre MAX_LIENS.
- Validation téléphone : ÉTAPE ULTÉRIEURE, non demandée maintenant (protocole
  existant conservé, rien à refaire ici).
« COS preserve » — occurrence exacte : `src/etats-keff.js:3`, REFORMULÉE le
2026-11-03 en « ancienne hypothèse NON MESURÉE, sans effet de code ». Effet
réel : AUCUN — aucun code ne lit cette chaîne (seule autre mention :
commentaire `src/noeuds-calcul.js:4` qui la cite comme trace documentaire).
Les exports réellement exécutés du fichier sont `etatAffectif` (109,
`verifierFinaleBLM`) ; `comparerTemperatures`/`arbitrerCharge`/`synergie`
n'ont AUCUN appelant dans le parcours (référencés seulement par 110 comme
mesures de référence). Gain d'environ 50 % : NON ÉTABLI, conservé comme
hypothèse historique, jamais comme règle.
