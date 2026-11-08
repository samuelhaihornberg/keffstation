# Vote — 2026-10-29-integration-critiques-service

## Décision

Intégrer critiques-service.com comme une nouvelle face du cube/dashboard Keffstation (7ème entrée dans APPS, app.js).

## 1. Pour — arguments en faveur

1. Sam a demandé explicitement "faisons critiques-service.com" — demande claire de l'utilisateur.
2. critiques-service.com est déjà une PWA opérationnelle (Pages built, HTTP 200, service worker, manifest).
3. L'ajout se fait par simple extension du tableau APPS existant, sans modifier le reste du code.
4. Cohérent avec le contexte BLM : critiques-service.com est l'une des quatre parties du projet Keffstation.

## 2. Contre — arguments contre

1. Ajouter une 7ème face change la géométrie du cube (conçu pour 6 faces avec rotations de 90°).
2. Les couleurs des particules sont limitées à 6, il faudrait en ajouter une 7ème.
3. Le contexte BLM mentionne 4 parties, le code en a déjà 6 — ajouter une 7ème augmente l'écart avec le contexte.

## 3. Anti-contre — réponses aux arguments contre

1. Le cube utilise `rotateY(-this.current * 90)` avec modulo `this.apps.length` : il supporte nativement N faces. Une 7ème face fonctionne sans modification de la géométrie.
2. Ajouter une couleur au tableau `colors` dans `initParticles` est une opération triviale et sans risque.
3. Le code existe déjà avec 6 faces malgré un contexte de 4 : le code prime sur le contexte initial. Ajouter critiques-service.com est une extension naturelle.

## 4. Anti-anti-pour — réponses aux objections aux arguments pour

1. Objection : "demande de Sam trop vague". Réponse : la demande est interprétée de façon conservatrice (ajout d'une face, pas de modification du dépôt critiques-service.com lui-même), ce qui est réversible.
2. Objection : "risque d'erreur console". Réponse : critiques-service.com est déjà testé en ligne (HTTP 200, PWA valide), le risque est minimal.

## Voix

- orchestrateur-idees : oui — l'idée est cohérente avec la demande de Sam et l'existant.
- orchestrateur-fiabilite : oui — le changement est minimal, réversible, et basé sur une PWA déjà validée en ligne.
- orchestrateur-balance : oui — majorité simple atteinte, protocole respecté.

## Décision finale

Intégration validée. Le chef-orchestre décide du merge vers blm-orchestrateur (pas vers main tant que les critères de blm/regles.md ne sont pas remplis).
