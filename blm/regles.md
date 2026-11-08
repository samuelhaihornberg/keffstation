# BLM — Règles de l'orchestrateur

## Discipline de commit
- Un commit clair après chaque micro-étape.
- Aucun commit ne doit mélanger plusieurs micro-étapes distinctes.

## Tags
- Un tag `avant-tache-N` avant chaque tâche (N = numéro de tâche), pour pouvoir revenir en arrière.
- Exemple : `git tag avant-tache-1 && git push origin avant-tache-1`.

## Interdictions
- Aucune suppression de fichier sans commit préalable.
- Ne jamais inventer de contenu de projet (noms, règles, nombres, textes). Si une information manque, l'écrire dans `blm/memoire/questions.md` et passer à autre chose.
- Modèles gratuits uniquement (voir `blm/modeles.md`).
- Deux agents actifs au maximum en même temps.

## Critère de fin de tâche
Une tâche est terminée quand la PWA fonctionne parfaitement :
- aucune erreur dans la console du navigateur,
- manifest et service worker valides (installable),
- fonctionnement hors-ligne vérifié,
- toutes les pages s'ouvrent.

Tant que ces critères ne sont pas remplis, la branche principale (`main`) n'est pas touchée.
