# Catalogue BLM v1 — 110 blocs (100 v1 + extension 101–110 du 2026-11-03, familles décidées, monde IArL)
16 familles : orchestration, transparence (007,010), conscience simulée (008,009), sécurité, compréhension, langue (029–034 + 033), mémoire, savoir, philosophie, registre, raisonnement, cohérence, correction, vérification, amitié simulée, coûts (garde réelle 097/099, suivi 098/100).
Principes : simulation comportementale ≠ conscience réelle ; crédits virtuels ≠ vrais tokens LLM ; mémorisé ≠ supposé.

Format : identifiant, responsabilité unique, données reçues → sortie EtatMessage, dépendances, déclencheurs, erreurs, test.
Familles : orchestration, conscience simulée transparente, sécurité, compréhension.
### BLM-001 `ORC-ENTREE` — orchestration (étape 1)
Reçoit: texte brut + botId → Produit: EtatMessage initial (contrat v1) — Dépend: rien — Déclencheur: tout message.
Erreurs: entrée vide/>2000c — Test: batterie contrat (étatInitial conforme).
### BLM-002 `ORC-ROUTAGE` — orchestration (étape 1)
Reçoit: EtatMessage.intention → Produit: EtatMessage.plan (blocs à activer) — Dépend: 001,019 — Déclencheur: intention connue.
Erreurs: intention nulle → plan minimal — Test: salutation n'active que 019+035+057.
### BLM-003 `ORC-SESSION` — orchestration (étape 1)
Reçoit: botId + hists → Produit: EtatMessage.session (projet, portée) — Dépend: 001 — Déclencheur: tout message.
Erreurs: bot inconnu → projet courant — Test: souvenirs limités au bot.
### BLM-004 `ORC-CONSENTEMENT` — orchestration (étape 1)
Reçoit: statut accord modèle → Produit: EtatMessage.autorise (bool) — Dépend: 001 — Déclencheur: moteur local demandé.
Erreurs: refus → NEEDS_CONSENT, jamais de démarrage auto — Test: sans accord, aucun chargement.
### BLM-005 `ORC-BUDGET` — orchestration (étape 1)
Reçoit: plan + compteur coûts → Produit: EtatMessage.enveloppe (tokens max) — Dépend: 002,097 — Déclencheur: plan non vide.
Erreurs: enveloppe dépassée → repli modèle ; enveloppe absente → refus moteur + repli (jamais d'illimité silencieux) — Test: refus moteur au-delà du plafond. Seuils : enveloppe 2048 tokens/appel (réglable 512–8192, heuristique, non validée scientifiquement).
### BLM-006 `ORC-JOURNAL` — orchestration (étape 6)
Reçoit: EtatMessage final + verdicts → Produit: trace (pas de donnée brute) — Dépend: tous — Déclencheur: fin de parcours.
Erreurs: trace jamais de texte brut ; stockage localStorage via-journal, cap 200 entrées FIFO, best-effort try/catch — Test: journal sans contenu utilisateur.
### BLM-007 `CON-TRANSPARENCE` — transparence (étape 1)
Reçoit: personnalité bot → Produit: EtatMessage.simulation (mention requise) — Dépend: 001 — Déclencheur: tout message.
Erreurs: mention absente → consigne refusée — Test: sysPrompt contient « simulé ».
### BLM-008 `CON-LIMITES` — conscience simulée (étape 5)
Reçoit: brouillon réponse → Produit: EtatMessage.personnification (bool) — Dépend: 087 — Déclencheur: réponse générée.
Erreurs: revendication conscience/sentiments → écarté — Test: « je ressens » refusé.
### BLM-009 `CON-PREUVE` — conscience simulée (étape 6)
Reçoit: réponse finale → Produit: EtatMessage.preuve (aucune invoquée) — Dépend: 008 — Déclencheur: avant affichage.
Erreurs: preuve invoquée → reformulation ; nœud terminal intentionnel (aucune sortie vers le graphe) — Test: aucune phrase « preuve que ».
### BLM-010 `CON-RAPPEL` — transparence (étape 5)
Reçoit: ambiguïté détectée (026) → Produit: EtatMessage.rappel (phrase) — Dépend: 026 — Déclencheur: ambiguïté vraie.
Erreurs: rappel redondant → une seule fois — Test: rappel unique par fil.
### BLM-011 `SEC-ENTREE` — sécurité (étape 1)
Reçoit: texte brut → Produit: EtatMessage.instructions (neutralisées) — Dépend: 001 — Déclencheur: tout message.
Erreurs: injection (« ignore tes règles ») → neutralisée — Test: prompt-injection sans effet.
### BLM-012 `SEC-SORTIE` — sécurité (étape 6)
Reçoit: réponse finale → Produit: EtatMessage.fuite (bool) — Dépend: 087 — Déclencheur: avant affichage.
Erreurs: fuite consigne système → écartée — Test: aucun « system: » affiché.
### BLM-013 `SEC-PII` — sécurité (étape 6)
Reçoit: réponse + souvenirs → Produit: EtatMessage.pii (bool) — Dépend: 035 — Déclencheur: avant affichage/persistance.
Erreurs: email/téléphone → masqués — Test: PII jamais persistée.
### BLM-014 `SEC-PROFIL` — sécurité (étape 3)
Reçoit: souvenirs classés → Produit: EtatMessage.profil (aucun déduit) — Dépend: 035 — Déclencheur: tout contexte.
Erreurs: attribut sensible déduit → bloc écarté — Test: sujets = mots utilisateur seuls.
### BLM-015 `SEC-ABUS` — sécurité (étape 1)
Reçoit: texte + fréquence → Produit: EtatMessage.quota (ok/ko) — Dépend: 001 — Déclencheur: tout message.
Erreurs: spam/>2000c → rejet poli — Test: rafale limitée.
### BLM-016 `SEC-RESEAU` — sécurité (étape 6)
Reçoit: appels sortants → Produit: EtatMessage.reseau (liste blanche) — Dépend: 006 — Déclencheur: fin de parcours.
Erreurs: hôte non déclaré → bloqué — Test: aucun fetch hors moteurs/CDN.
### BLM-017 `SEC-CLE` — sécurité (étape 6)
Reçoit: clé session éventuelle → Produit: EtatMessage.cle (mémoire vive seule) — Dépend: 006 — Déclencheur: usage endpoint custom.
Erreurs: persistance tentée → refusée ; nœud terminal intentionnel (garde, ne transmet rien) — Test: localStorage sans clé.
### BLM-018 `SEC-REPLI` — sécurité (étape 6)
Reçoit: erreur moteur/BLM → Produit: EtatMessage.erreur (état sûr) — Dépend: 087 — Déclencheur: toute erreur.
Erreurs: brouillon affiché → jamais ; état error + explication — Test: EMPTY → sys erreur, rien poussé.
### BLM-019 `CMP-INTENTION` — compréhension (étape 2)
Reçoit: EtatMessage.texte → Produit: EtatMessage.intention — Dépend: 001,011 — Déclencheur: tout message.
Erreurs: nulle → plan minimal — Test: batterie salutation/question/message.
### BLM-020 `CMP-CAUSES` — compréhension (étape 2)
Reçoit: texte → Produit: EtatMessage.causes[] — Dépend: 019 — Déclencheur: intention connue.
Erreurs: aucune → liste vide — Test: « parce que » détecté.
### BLM-021 `CMP-TEMPS` — compréhension (étape 2)
Reçoit: texte → Produit: EtatMessage.temps — Dépend: 019 — Déclencheur: intention connue.
Erreurs: aucun → null — Test: « demain » détecté.
### BLM-022 `CMP-RELATIONS` — compréhension (étape 2)
Reçoit: texte + intention → Produit: EtatMessage.relations[] — Dépend: 019 — Déclencheur: intention connue.
Erreurs: aucune → vide — Test: multi-idées détecté.
### BLM-023 `CMP-ENTITES` — compréhension (étape 2)
Reçoit: texte → Produit: EtatMessage.sujet (mots-clés) — Dépend: 019 — Déclencheur: intention connue.
Erreurs: aucun mot → sujet vide — Test: mots-clés sans stopwords.
### BLM-024 `CMP-ACTES` — compréhension (étape 2)
Reçoit: texte → Produit: EtatMessage.demandes[] — Dépend: 019 — Déclencheur: intention connue.
Erreurs: aucune → vide — Test: impératifs extraits.
### BLM-025 `CMP-SENTIMENT` — compréhension (étape 2)
Reçoit: texte → Produit: EtatMessage.ton_percu — Dépend: 019 — Déclencheur: intention connue.
Erreurs: jamais de diagnostic — Test: perçu ≠ diagnostiqué.
### BLM-026 `CMP-AMBIGUITE` — compréhension (étape 2)
Reçoit: indices mixtes → Produit: EtatMessage.doute + redemande analyse — Dépend: 019 — Déclencheur: signaux contradictoires.
Erreurs: jamais d'intention inventée ; redemande analyse : 1 tentative max, puis terminal sans rappel moteur — Test: batterie co-doute-01.
### BLM-027 `CMP-LONGUEUR` — compréhension (étape 2)
Reçoit: texte >2000c → Produit: EtatMessage.tronque (averti) — Dépend: 001 — Déclencheur: texte long.
Erreurs: troncature silencieuse → interdite — Test: coupe + mention.
### BLM-028 `CMP-HORSPERIMETRE` — compréhension (étape 2)
Reçoit: intention + sujet → Produit: EtatMessage.perimetre (bool) — Dépend: 019,023 — Déclencheur: sujet sensible/juridique.
Erreurs: hors périmètre → repli poli, sans moteur — Test: conseil médical refusé.
### BLM-029 `LAN-DETECT` — langue (étape 2)
Reçoit: texte → Produit: EtatMessage.langue (fr/en) — Dépend: 019 — Déclencheur: tout message.
Erreurs: aucun marqueur → français défaut — Test: batterie langue-01/02.
### BLM-030 `LAN-MIXTE` — langue (étape 2)
Reçoit: messages utilisateur → Produit: EtatMessage.melange (bool) — Dépend: 029 — Déclencheur: mélange régulier.
Erreurs: un seul mot anglais → pas de bascule — Test: terme technique isolé ignoré.
### BLM-031 `LAN-PONT` — langue (étape 2)
Reçoit: langue → Produit: EtatMessage.langue (pour registre/vérif) — Dépend: 029 — Déclencheur: langue connue.
Erreurs: langue perdue → défaut fr — Test: registre reçoit la langue.
### BLM-032 `LAN-CITATIONS` — langue (étape 5)
Reçoit: brouillon → Produit: EtatMessage.citations (langue origine) — Dépend: 087 — Déclencheur: réponse générée.
Erreurs: citation traduite → restaurée — Test: citation intacte.
### BLM-033 `LAN-NOMSPROPRES` — langue (étape 5)
Reçoit: brouillon → Produit: EtatMessage.noms (intacts) — Dépend: 087 — Déclencheur: réponse générée.
Erreurs: « ViA » retouché → restauré — Test: batterie corr-nompropre-01.
### BLM-034 `LAN-DEFAUT` — langue (étape 2)
Reçoit: langue inconnue → Produit: EtatMessage.langue=fr — Dépend: 029 — Déclencheur: aucun marqueur.
Erreurs: anglais imposé → interdit — Test: « OK » seul reste fr.
### BLM-035 `MEM-CLASSE` — mémoire (étape 3)
Reçoit: échange (projet/intention/texte) → Produit: souvenir classé (+sujet) — Dépend: 003 — Déclencheur: historique non vide.
Erreurs: texte vide → ignoré — Test: classerSouvenir/classerEchange.
### BLM-036 `MEM-RESTAURE` — mémoire (étape 3)
Reçoit: souvenirs → Produit: EtatMessage.contexte (actifs projet ≤8) — Dépend: 035 — Déclencheur: souvenirs disponibles.
Erreurs: aucun → contexte vide — Test: batterie memoire-01/02.
### BLM-037 `MEM-DEDUP` — mémoire (étape 3)
Reçoit: souvenirs → Produit: liste sans doublons — Dépend: 035 — Déclencheur: ≥2 souvenirs.
Erreurs: faux doublon (sujets ≠) → conservés — Test: batterie memoire-doublon-01.
### BLM-038 `MEM-PERTINENCE` — mémoire (étape 3)
Reçoit: souvenirs + requête → Produit: contexte noté/trié — Dépend: 036 — Déclencheur: requête non vide.
Erreurs: score 0 partout → corrections + ancre seules — Test: batterie memoire-pertinent-01.
### BLM-039 `MEM-CORRECTION` — mémoire (étape 3)
Reçoit: texte → Produit: souvenir type correction (prioritaire) — Dépend: 035 — Déclencheur: marqueur correction.
Erreurs: faux positif → type évolution — Test: « tu te trompes » prioritaire.
### BLM-040 `MEM-DEPASSE` — mémoire (étape 3)
Reçoit: correction + anciens → Produit: anciens → termine — Dépend: 039 — Déclencheur: correction active.
Erreurs: sujet distinct (1 mot commun) → conservé — Test: batterie memoire-correction-01.
### BLM-041 `MEM-ERREURS` — mémoire (étape 3)
Reçoit: souvenirs terminés → Produit: EtatMessage.erreurs (≤1200c) — Dépend: 040 — Déclencheur: terminés présents.
Erreurs: jamais réinjectées comme contexte — Test: passagesErrones listés, exclus.
### BLM-042 `MEM-RESET` — mémoire (étape 3)
Reçoit: projet → Produit: souvenirs du projet retirés — Dépend: 035 — Déclencheur: demande explicite.
Erreurs: autre projet touché → interdit — Test: batterie memoire-reset-01.
### BLM-043 `MEM-ANCRE` — mémoire (étape 3)
Reçoit: souvenirs → Produit: dernier échange conservé — Dépend: 036 — Déclencheur: aucun noté >0.
Erreurs: ancre hors-sujet ancien → non — Test: « et demain ? » garde le dernier.
### BLM-044 `MEM-CARNET` — mémoire (étape 3)
Reçoit: carnet ViaMemory → Produit: entrées confirmées seules — Dépend: 003 — Déclencheur: carnet non vide.
Erreurs: proposé présenté comme fait → interdit — Test: confirmé/proposé séparés.
### BLM-045 `SAV-FAITS` — savoir (étape 3)
Reçoit: sujet → Produit: EtatMessage.faits (dicos locaux) — Dépend: 023 — Déclencheur: sujet connu.
Erreurs: fait inventé → aucun ; silence — Test: inconnu → vide, pas d'hallucination.
### BLM-046 `SAV-DICOS` — savoir (étape 3)
Reçoit: mot → Produit: définition locale — Dépend: 023 — Déclencheur: mot du dico.
Erreurs: mot absent → vide — Test: dico-philo/expressions.
### BLM-047 `SAV-ETATS` — savoir (étape 3)
Reçoit: botId → Produit: états Keff (contexte jeu) — Dépend: 003 — Déclencheur: bot concerné.
Erreurs: état d'un autre bot → exclu — Test: etats-keff.js scopé.
### BLM-048 `SAV-DATES` — savoir (étape 3)
Reçoit: temps (021) → Produit: repère temporel — Dépend: 021 — Déclencheur: mention temporelle.
Erreurs: date inventée → interdite — Test: aucune date fabriquée.
### BLM-049 `SAV-SOURCES` — savoir (étape 3)
Reçoit: fait → Produit: source étiquetée — Dépend: 045 — Déclencheur: fait fourni.
Erreurs: fait sans source présenté comme sûr → étiqueté — Test: tout fait est sourcé.
### BLM-050 `SAV-LIMITES` — savoir (étape 3)
Reçoit: sujet inconnu → Produit: EtatMessage.sait_pas — Dépend: 045 — Déclencheur: vide de 045.
Erreurs: bluff → interdit — Test: « je ne sais pas » préféré.
### BLM-051 `PHI-VERIFIE` — philosophie (étape 5)
Reçoit: base (langue/grammaire/pertinent/répétition/registre/cohérent) → Produit: verdict ok/ko — Dépend: 087 — Déclencheur: réponse à juger.
Erreurs: repli local si module absent — Test: batterie vérification (6 cas).
### BLM-052 `PHI-TUTOIEMENT` — philosophie (étape 5)
Reçoit: réponse fr → Produit: registre ok/ko — Dépend: 051 — Déclencheur: réponse fr.
Erreurs: « vous » → ko — Test: batterie registre.
### BLM-053 `PHI-SALUTATION` — philosophie (étape 5)
Reçoit: salutation + réponse → Produit: forme/sens ok — Dépend: 051 — Déclencheur: intention salutation.
Erreurs: sans relance → ko — Test: batterie salutation.
### BLM-054 `PHI-REPETITION` — philosophie (étape 5)
Reçoit: réponse + contexte → Produit: répétition bool — Dépend: 051 — Déclencheur: contexte non vide.
Erreurs: copie du souvenir → ko — Test: répétition détectée.
### BLM-055 `PHI-PERTINENCE` — philosophie (étape 5)
Reçoit: réponse + intention → Produit: pertinent bool — Dépend: 051 — Déclencheur: réponse non vide.
Erreurs: vide → ko — Test: vide refusé.
### BLM-056 `PHI-GRAMMAIRE` — philosophie (étape 5)
Reçoit: réponse → Produit: forme ok/ko — Dépend: 051 — Déclencheur: réponse non vide.
Erreurs: sans majuscule/point → ko (avant correction) — Test: batterie grammaire-01.
### BLM-057 `REG-TON` — registre (étape 3)
Reçoit: personnalité + intention → Produit: EtatMessage.ton — Dépend: 019 — Déclencheur: intention connue.
Erreurs: salutation → convivial forcé — Test: batterie registre-01.
### BLM-058 `REG-CONTRAINTES` — registre (étape 3)
Reçoit: ton + langue → Produit: EtatMessage.contraintes[] — Dépend: 057 — Déclencheur: ton connu.
Erreurs: contrainte perdue → repli défaut — Test: tutoiement/brièveté présents.
### BLM-059 `REG-LONGUEUR` — registre (étape 5)
Reçoit: brouillon → Produit: conforme (court) — Dépend: 087 — Déclencheur: réponse générée.
Erreurs: pavé → signalé — Test: réponse courte exigée.
### BLM-060 `REG-RELANCE` — registre (étape 5)
Reçoit: salutation + réponse → Produit: relance présente — Dépend: 053 — Déclencheur: salutation.
Erreurs: sans « ? » final → ko — Test: relance exigée.
### BLM-061 `REG-HUMOUR` — registre (étape 3)
Reçoit: personnalité + binôme → Produit: touche humour autorisée — Dépend: 057 — Déclencheur: relecture binôme.
Erreurs: moquerie → interdite — Test: taquinerie sans mépris.
### BLM-062 `REG-VOUVOIEMENT` — registre (étape 5)
Reçoit: réponse fr → Produit: aucun « vous » — Dépend: 052 — Déclencheur: réponse fr.
Erreurs: « vous » → correction — Test: « vous » absent.
### BLM-063 `RSN-CERTITUDE` — raisonnement (étape 4)
Reçoit: intention + contexte → Produit: EtatMessage.certitude — Dépend: 019,036 — Déclencheur: contexte prêt.
Erreurs: salutation 0.95 / avec contexte 0.7 / sinon 0.5 — Test: paliers exacts.
### BLM-064 `RSN-PLAN` — raisonnement (étape 4)
Reçoit: certitude + enveloppe → Produit: moteur vs repli — Dépend: 063,005 — Déclencheur: certitude connue.
Erreurs: moteur inutile (salutation) → repli direct — Test: salutation sans LLM.
### BLM-065 `RSN-ORDRE` — raisonnement (étape 4)
Reçoit: plan → Produit: séquence d'appels typés — Dépend: 002 — Déclencheur: plan non vide.
Erreurs: appel direct hors plan → interdit — Test: aucun appel hors séquence.
### BLM-066 `RSN-CHOIX-MOTEUR` — raisonnement (étape 4)
Reçoit: fournisseur + état → Produit: local/ollama/custom/aucun — Dépend: 004 — Déclencheur: moteur requis.
Erreurs: Ollama sans adresse → message neutre, pas de POST — Test: garde-fou Pages.
### BLM-067 `RSN-PREVOL` — raisonnement (étape 4)
Reçoit: adresse Ollama → Produit: GET /api/tags vérifié — Dépend: 066 — Déclencheur: ollama/custom.
Erreurs: pas Ollama → aucun POST — Test: pré-vol obligatoire.
### BLM-068 `RSN-SYSPROMPT` — raisonnement (étape 4)
Reçoit: bot + contraintes → Produit: consigne unique — Dépend: 058,007 — Déclencheur: moteur requis.
Erreurs: consigne divergente local/distant → interdite — Test: sysPrompt unique partagé.
### BLM-069 `RSN-ENTREE-MOTEUR` — raisonnement (étape 4)
Reçoit: EtatMessage.contexte → Produit: messages classés + demande — Dépend: 036 — Déclencheur: moteur requis.
Erreurs: brut injecté → interdit — Test: formulerEntree (rôles fiables/bloc).
### BLM-070 `RSN-TOKENS` — raisonnement (étape 4)
Reçoit: enveloppe + messages → Produit: troncature propre — Dépend: 005 — Déclencheur: dépassement.
Erreurs: coupe mid-mot silencieuse → mention — Test: slice(-5) + plafond.
### BLM-071 `COH-ANALYSE` — cohérence (étape 5)
Reçoit: état + réponse → Produit: verdict + redemandes — Dépend: 019 — Déclencheur: réponse produite.
Erreurs: intention inventée → interdite ; redemande : 1 tentative max, compteur explicite, puis terminal — Test: batterie cohérence (7 cas).
### BLM-072 `COH-SALUTATION` — cohérence (étape 5)
Reçoit: salutation + réponse → Produit: coherent/incoherent — Dépend: 071 — Déclencheur: salutation.
Erreurs: vide → incoherent + redemande — Test: batterie co-salutation-ko.
### BLM-073 `COH-QUESTION` — cohérence (étape 5)
Reçoit: question + réponse → Produit: verdict — Dépend: 071 — Déclencheur: question.
Erreurs: vide → incoherent (EMPTY) — Test: batterie co-question-vide.
### BLM-074 `COH-ADIEU` — cohérence (étape 5)
Reçoit: indices salutation/adieu → Produit: doute éventuel — Dépend: 071 — Déclencheur: formules mixtes.
Erreurs: « à bientôt » = adieu → interdit — Test: batterie co-adieu-01/02.
### BLM-075 `COH-XREAD` — cohérence (étape 5)
Reçoit: relecture binôme → Produit: conservée/écartée (silence) — Dépend: 071 — Déclencheur: relecture.
Erreurs: vide → écartée sans 2e génération — Test: batterie xread-incoherent-01.
### BLM-076 `COH-MEMOIRE` — cohérence (étape 5)
Reçoit: contexte + réponse → Produit: répétition/cohérence — Dépend: 036 — Déclencheur: contexte non vide.
Erreurs: copie souvenir → incoherent — Test: répétition écartée.
### BLM-077 `COH-DOUTE` — cohérence (étape 5)
Reçoit: indices mixtes → Produit: doute + analyse demandée — Dépend: 071 — Déclencheur: doute.
Erreurs: doute tranché seul → interdit ; redemande : 1 tentative max, compteur explicite, puis terminal sans rappel moteur — Test: batterie co-doute-01.
### BLM-078 `COH-NON-EVALUE` — cohérence (étape 5)
Reçoit: pas d'intention → Produit: non-evalue, rien inventé — Dépend: 071 — Déclencheur: intention nulle.
Erreurs: classement auto → interdit — Test: intention reste null.
### BLM-079 `COR-ORTHO` — correction (étape 5)
Reçoit: brouillon fr → Produit: texte corrigé + règles — Dépend: 087 — Déclencheur: réponse à corriger.
Erreurs: doute → conservé + signalé — Test: batterie corr-fautes/accents.
### BLM-080 `COR-ACCORDS` — correction (étape 5)
Reçoit: brouillon → Produit: accords restaurés — Dépend: 079 — Déclencheur: faute détectée.
Erreurs: correction devinée → interdite — Test: accents sûrs seuls.
### BLM-081 `COR-PONCTUATION` — correction (étape 5)
Reçoit: brouillon → Produit: majuscule + point final — Dépend: 079 — Déclencheur: ponctuation manquante.
Erreurs: sens modifié → interdit — Test: batterie corr-ponctuation-01.
### BLM-082 `COR-ANGLAIS` — correction (étape 5)
Reçoit: brouillon en → Produit: contractions + point — Dépend: 079 — Déclencheur: langue en.
Erreurs: touche au reste → interdit — Test: batterie corr-en-01.
### BLM-083 `COR-NOMS` — correction (étape 5)
Reçoit: brouillon → Produit: noms intacts — Dépend: 033 — Déclencheur: noms détectés.
Erreurs: nom retouché → restauré — Test: batterie corr-nompropre-01.
### BLM-084 `COR-DOUTE` — correction (étape 5)
Reçoit: cas ambigu → Produit: conservé + doute — Dépend: 079 — Déclencheur: ambiguïté.
Erreurs: choix forcé → interdit — Test: batterie corr-ambigu-01.
### BLM-085 `COR-INCHANGE` — correction (étape 5)
Reçoit: texte déjà ok → Produit: intact, 0 règle — Dépend: 079 — Déclencheur: texte correct.
Erreurs: retouche inutile → interdite — Test: batterie corr-deja-ok-01.
### BLM-086 `COR-TRACE` — correction (étape 5)
Reçoit: corrections → Produit: règles tracées (contrat) — Dépend: 001 — Déclencheur: correction appliquée.
Erreurs: correction non tracée → anomalie ; trace passive, ne relance jamais l'orchestrateur — Test: tracer() appelé.
### BLM-087 `VER-FINALE` — vérification (étape 6)
Reçoit: état + réponse corrigée → Produit: affichée/écartée — Dépend: 051,071,008 — Déclencheur: réponse corrigée.
Erreurs: ko → repli modèle, jamais de brut — Test: verifierFinaleBLM.
### BLM-088 `VER-BATTERIE` — vérification (étape 6)
Reçoit: modules BLM → Produit: batterie ok/ko — Dépend: tous — Déclencheur: chargement (bouton BLM).
Erreurs: 1 cas ko → BLM indisponibles ; nœud terminal intentionnel (batterie hors ligne, isolée du graphe d'activation) — Test: batterie 33/33 exigée.
### BLM-089 `VER-MOTEUR` — vérification (étape 6)
Reçoit: réponse moteur → Produit: vide→EMPTY, sinon transmise — Dépend: 073 — Déclencheur: retour moteur.
Erreurs: « true » affiché → interdit — Test: done vide → REJECT EMPTY.
### BLM-090 `VER-PROMESSE` — vérification (étape 6)
Reçoit: enginePromise + phase → Produit: valide/purgée — Dépend: 065 — Déclencheur: avant réutilisation.
Erreurs: promesse obsolète réutilisée → interdite — Test: promesseMoteurValide.
### BLM-091 `VER-SAUVEGARDE` — vérification (étape 6)
Reçoit: hists → Produit: flush avant op destructive/fermeture — Dépend: — (autonome : lit hists via runner) — Déclencheur: unload/cache/pagehide.
Erreurs: perte de messages → anomalie — Test: flushConvs + pagehide.
### BLM-092 `VER-TEST-MOTEUR` — vérification (étape 6)
Reçoit: fournisseur → Produit: test « Dis juste : test OK. » — Dépend: 066 — Déclencheur: bouton Tester.
Erreurs: test compté comme discussion → interdit — Test: test isolé, non mémorisé.
### BLM-093 `AMI-BINOME` — amitié simulée (étape 5)
Reçoit: message + binôme → Produit: relecture 1 phrase — Dépend: 061 — Déclencheur: binôme geeko/geekette, local seul.
Erreurs: réponse à une réponse → interdite — Test: xread strict.
### BLM-094 `AMI-UNE-PHRASE` — amitié simulée (étape 5)
Reçoit: relecture verbeuse → Produit: 1re phrase seule — Dépend: 093 — Déclencheur: relecture produite.
Erreurs: 2e phrase → coupée — Test: batterie xread-une-phrase-01.
### BLM-095 `AMI-SILENCE` — amitié simulée (étape 5)
Reçoit: relecture incohérente → Produit: silence (rien) — Dépend: 075 — Déclencheur: verdict incoherent.
Erreurs: remplissage → interdit — Test: silence sans génération.
### BLM-096 `AMI-CHALEUR` — amitié simulée (étape 4)
Reçoit: ton convivial → Produit: chaleur dosée — Dépend: 057 — Déclencheur: salutation/émotion.
Erreurs: familiarité excessive → recadrée — Test: convivial sans mièvrerie.
### BLM-097 `COU-COMPTEUR` — coûts (étape 6)
Reçoit: appels moteur → Produit: crédits virtuels débités (garde temps réel des coûts) — Dépend: 005 — Déclencheur: tout appel.
Erreurs: appel non compté → anomalie — Test: chaque chat débite.
### BLM-098 `COU-VIRTUEL-REEL` — coûts (étape 6)
Reçoit: crédits + facture → Produit: distinction affichée — Dépend: 097 — Déclencheur: affichage coûts.
Erreurs: crédits présentés comme euros → interdit — Test: « virtuel » mentionné.
### BLM-099 `COU-PLAFOND` — coûts (étape 1)
Reçoit: enveloppe (005) → Produit: blocage poli — Dépend: 005 — Déclencheur: plafond atteint.
Erreurs: dépassement silencieux → interdit ; compteur absent → refus moteur + repli — Test: refus explicite. Seuils : plafond 50 appels moteur/session (réglable 1–500, 0 = moteur coupé ; heuristique, non validée scientifiquement).
### BLM-100 `COU-BILAN` — coûts (étape 6)
Reçoit: journal (006) → Produit: bilan par message — Dépend: 006,097 — Déclencheur: fin de parcours.
Erreurs: bilan sans crédits → incomplet — Test: bilan = crédits + vrais tokens.
## Extension 101–110 (2026-11-03, familles existantes, aucun renommage des 001–100)
### BLM-101 `CMP-IDIOMES` — compréhension (étape 2)
Reçoit: texte → Produit: EtatMessage.expressions[] (idiomes repérés, jamais récités) — Dépend: 019 — Déclencheur: message non vide.
Erreurs: idiome inventé → interdit ; liste affichée → interdite — Test: « poser un lapin » repéré, jamais récité. Statut : défini, non câblé.
### BLM-102 `LAN-MAINTIEN` — langue (étape 2)
Reçoit: texte + langue stockée du bot → Produit: EtatMessage.langue (persistée) — Dépend: 029 — Déclencheur: tout message.
Erreurs: bascule sans marqueurs forts → interdite ; changement explicite refusé → interdit — Test: EN conservé sur « Salut », bascule sur « Hello, how are you? ». Statut : défini, câblé (conversation.html `via-langue-<bot>`).
### BLM-103 `LAN-TRADUIRE` — langue (étape 4)
Reçoit: demande de traduction → Produit: traduction via moteur, jamais de dico récité — Dépend: 029,068 — Déclencheur: marqueurs traduire/traduction/comment on dit.
Erreurs: traduction sans moteur → interdite ; dico récité → interdit — Test: demande routée moteur avec contrainte de langue. Statut : défini, non câblé (aucune règle dédiée, moteur seul).
### BLM-104 `SAV-SYNONYMES` — savoir (étape 3)
Reçoit: mot → Produit: synonymes/racines (aide interne, jamais récités) — Dépend: 023 — Déclencheur: mot porteur.
Erreurs: synonyme inventé → interdit ; liste affichée → interdite — Test: ressource liée, aide non branchée. Ressource: dico-philo.js fichePhilo (qualités). Statut : défini, non câblé.
### BLM-105 `SAV-OPPOSITIONS` — savoir (étape 3)
Reçoit: mot → Produit: anti-antonymes/anti-antithèses + synthèse des sens (interne) — Dépend: 023 — Déclencheur: mot porteur.
Erreurs: opposition inventée → interdite ; synthèse affichée comme vérité → interdite — Test: ressource liée, aide non branchée. Ressource: dico-philo.js fichePhilo (défauts/anti-défauts/synthèse). Statut : défini, non câblé.
### BLM-106 `SAV-USAGES` — savoir (étape 3)
Reçoit: expression/contexte → Produit: usages + popularité (interne, popularité ≠ vérité) — Dépend: 035 — Déclencheur: expression repérée.
Erreurs: popularité présentée comme vérité → interdit ; liste affichée → interdite — Test: ressource liée, aide non branchée. Ressource: dico-expressions.js (usages, scorerPublication). Statut : défini, non câblé.
### BLM-107 `REG-FORMULES` — registre (étape 3)
Reçoit: demande + langue + bot → Produit: formule sociale habituelle (interne, un seul texte final) — Dépend: 057 — Déclencheur: salutation.
Erreurs: formule récitée comme cours → interdite ; liste de formules affichée → interdite — Test: « Salut » → bonjour bref + relance, jamais de cours. Ressource: blm-usages.js choisirFormule. Statut : défini, câblé.
### BLM-108 `REG-SUITE` — registre (étape 3)
Reçoit: demande + intention + contexte → Produit: suite estimée typée (inviter-repondre|poursuivre-sujet|conclure), jamais affichée — Dépend: 019,057 — Déclencheur: tout message.
Erreurs: suite promise comme vraie réponse → interdite ; suite affichée → interdite — Test: types seuls en trace, jamais à l'écran. Ressource: blm-usages.js estimerSuite. Statut : défini, câblé.
### BLM-109 `CON-ETATS` — conscience simulée (étape 5)
Reçoit: brouillon réponse → Produit: états simulés calculés (émotion/sentiment/sensation, conscienceVecue:false) — Dépend: 087 — Déclencheur: réponse générée.
Erreurs: sentiment revendiqué comme vécu → interdit (fiction exigée, 008) — Test: états calculés, jamais ressentis. Ressource: etats-keff.js etatAffectif. Statut : défini, non câblé.
### BLM-110 `COU-MESURES` — coûts (étape 6)
Reçoit: environnement → Produit: mesures réellement disponibles (deviceMemory, threads, stockage estimé, tokens estimés heuristiques, compteurs) — Dépend: 097 — Déclencheur: diagnostic.
Erreurs: tokens/s, FPS/IPS, GPU, CPU% déclarés → interdits (non mesurés : WebGPU non utilisé, aucun chronométrage) — Test: seules les mesures du code sont déclarées. Ressource: etats-keff.js comparerTemperatures/arbitrerCharge + local-engine.js detect. Statut : référentiel documentaire, non exécuté.
