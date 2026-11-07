# Plan monde IArL — 100 BLM / 10 000 paires (v1 finale, implémentation)
Base A : `/root/KeffStation/viartificial`. B/standalone intacts. Aucun code modifié.
Fichiers : `catalogue-v1.md` (100 blocs, 16 familles), `matrice-v1.csv`, ce plan.
## Règles (rappel)
Actif : lien déclaré systématique + 19 appels orchestrateur. Conditionnel : situational + 2 redemandes (budget 1, sinon terminal). Interdit CONTRE-SENS : diagonale, retours arrière, brut/clé→moteur. Inutile : sans lien déclaré ; 088 isolée (batterie hors ligne). 086→001 passive hors graphe. Retours vers 087 : données, pas activations.
## Ordre d'implémentation (dépendances des 110 liens)
S1 socle : 001,003,004,007,011,015. Pré : rien/001. Valide : contrat battery, consent load, injection neutralisée.
S2 comprendre : 019,002,020–029,030,031,034. Pré : S1. Valide : batterie salutation/question/message, langue, 019→002.
S3 contexte : 035–050,057,058,061,014 (033→langue). Pré : S1–S2. Valide : batterie mémoire (pertinent/ignoré/doublon/vide/correction/reset).
S4 décider+moteur : 005,097,099,063–070. Pré : S2–S3. Valide : sysPrompt unique, pré-vol Ollama, formulerEntree (classé seul), EMPTY→rejet, promesse valide/purgée, flush+pagehide.
S5 juger local : 010,026,032,033,071–078,079–086,093–096. Pré : S4. Valide : batterie cohérence/correction, xread silence, 086 sans sortant.
S6 finaliser : 008,009,012,013,016,017,018,051–056,060,062,087,089–092,098,100,006 (+088 doc seule). Pré : S5. Valide : batterie 33+/33+, repli modèle terminal, journal sans brut.
## Seuils 005/099 (heuristiques, non validés scientifiquement)
005 enveloppe : tokens d'entrée max par appel (sysPrompt + contexte classé + demande ; ≈4 car/token indicatif). Plage 512–8192, défaut 2048 (cohérent : msgs ≤5, rôles ≤4, bloc ≤800c, génération 64 tokens fixe). Absent → refus moteur + repli modèle.
099 plafond : appels moteur par session (097 compte). Plage 1–500, défaut 50, 0 = moteur coupé. Absent → refus + repli. Justification : borne explicite de coût réel (batterie/serveur), pas d'optimum prouvé.
## Journal 006 (local, PWA)
localStorage `via-journal`, JSON, cap 200 FIFO, écriture best-effort try/catch (jamais bloquante), entrées sans texte brut (refs + verdicts + compteurs). Consentement : couvert par l'accord modèle (`via-consent`) + mention ; effacement : parité withdraw/deleteModels (clé supprimée) ; reprise : relu au lancement comme restoreConvs, séquence continuée. Sync serveur : hors étape (aucun endpoint, aucune PII ne quitte l'appareil).
## Contrat feuilles terminales + arrêt redemande
Sortie : {succes-terminal | refus | erreur | redemande(demande, motif, tentative:1)}. Une feuille ne rappelle jamais orchestrateur/moteur ; seule demanderReanalyse écrit (dédupliquée, tentative forcée 1). Vérifié : etat.redemandes est écriture seule (aucun lecteur ne relance) ; verifierFinaleBLM bascule sur reponseSalutation (repli) puis push+saveConv. Chemin d'arrêt {019,071,077} : 019→071 analyse → redemande analyse (077→019 idem) → deja=true au 2e passage → terminal, repli affiché, fin. Seul cycle résiduel, borné et prouvé sans rappel moteur.
## Comptes (inchangés, revérifiés)
100 BLM, 10 000 paires uniques, actives 61, conditionnelles 49, interdites 4002, inutiles 5888, diagonale 100/100.
## Décisions prises / questions ouvertes
Pris : 16 familles ; sens uniques justifiés ; 086 passive ; budget redemande 1 ; terminaux documentés ; restrictions 001→012/004→016/019→010 (code lu) ; 099→097 inversé en 097→099 ; seuils et journal ci-dessus.
Ouvert : seuils chiffrés définitifs (005/099 : mesurer en usage réel) ; persistance exacte du journal (clé/cap à figer à l'implémentation S6) ; câblage runner des feuilles (appel direct, jamais via graphe).
