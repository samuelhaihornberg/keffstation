# BLM — Boucle de travail par tâche

## Étape 1 — Sam donne une tâche
Le chef-orchestre crée `blm/taches/N.md` et le tag `avant-tache-N`.

## Étape 2 — Mémoire
Le gardien-memoire lit `blm/memoire/` (leçons, erreurs, bons-patrons, questions) et résume ce qui sert à cette tâche.

## Étape 3 — Plan et idées
Le planificateur écrit les étapes (courtes et testables). L'orchestrateur-idees propose des idées nouvelles.

## Étape 4 — Vote
L'orchestrateur-balance fait voter le plan selon le protocole de `blm/protocole-vote.md`.

## Étape 5 — Architecture et code
L'architecte fixe la structure des fichiers et des modules. Puis les codeurs travaillent par micro-étapes, avec un commit clair après chacune.

## Étape 6 — Tests
Le testeur vérifie les critères de réussite de `blm/regles.md` avec les moyens réellement disponibles ici (scripts Node, validation du manifest et du service worker, navigateur sans interface s'il peut être installé). Il indique précisément ce qu'il n'a pas pu vérifier.

## Étape 7 — Relecture et correction
Le relecteur relit. Le correcteur-bugs corrige, une cause à la fois. Boucle test, relecture, correction : cinq tours maximum.

## Étape 8 — Fiabilité
L'orchestrateur-fiabilite valide ou bloque.

## Étape 9 — Mémoire
Le gardien-memoire écrit les leçons, les erreurs et les bons patrons dans `blm/memoire/`.

## Étape 10 — Fusion ou blocage
Le chef-orchestre fusionne vers la branche principale seulement si tous les critères de `blm/regles.md` sont remplis. Sinon il s'arrête et écrit le blocage dans `blm/journal.md`.

## Activation par étapes

Au départ, seuls ces agents sont actifs : chef-orchestre, gardien-memoire, planificateur, codeur-front, codeur-back et testeur. Deux agents en même temps au maximum.

Les autres agents (orchestrateur-idees, orchestrateur-fiabilite, orchestrateur-balance, architecte, specialiste-pwa, relecteur, correcteur-bugs) s'activent quand une tâche s'est terminée sans blocage.

## Compte rendu de fin de tâche

À la fin de chaque tâche : une phrase de résultat, la liste des fichiers modifiés, et les questions ajoutées à `blm/memoire/questions.md`.

## Interdiction

Ne lance aucune tâche de code tant que Sam n'a pas donné une tâche.
