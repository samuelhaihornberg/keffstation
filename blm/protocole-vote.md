# BLM — Protocole de vote de l'orchestrateur-balance

## Objet

Pour chaque décision importante (choix d'architecture, idée à retenir, merge), l'orchestrateur-balance organise un vote structuré entre les trois orchestrateurs (idées, fiabilité, balance). Le chef-orchestre tranche en cas d'égalité et décide du merge final.

## Fichier de vote

L'orchestrateur-balance crée le fichier `blm/votes/AAAA-MM-JJ-sujet.md` (date au format ISO, sujet en kebab-case).

## Quatre tableaux séparés

Chaque fichier de vote contient exactement quatre tableaux, dans cet ordre :

1. **Pour** : les arguments en faveur de l'option.
2. **Contre** : les arguments contre l'option.
3. **Anti-contre** : pour chaque argument contre, la réponse qui le réfute.
4. **Anti-anti-pour** : pour chaque objection faite aux arguments pour, la réponse qui défend ces arguments.

## Règles de rédaction

- Chaque ligne de tableau est courte, numérotée, et cite sa justification.
- Un argument sans justification n'est pas recevable.

## Voix

Ensuite, chacun des trois orchestrateurs (idées, fiabilité, balance) donne une voix :
- **oui**
- **non**
- **oui avec réserves**

Chaque voix s'accompagne d'une phrase de justification.

## Décision

- La majorité simple décide.
- En cas d'égalité, le chef-orchestre tranche et écrit pourquoi.
- Si un orchestrateur a voté contre la décision finale, son désaccord est noté dans `blm/memoire/lecons.md`.

## Intégration

Ce protocole est référencé dans les prompts système de : chef-orchestre, orchestrateur-idees, orchestrateur-fiabilite, orchestrateur-balance.
