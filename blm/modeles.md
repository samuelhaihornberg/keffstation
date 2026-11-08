# BLM — Modèles autorisés (gratuits uniquement)

Source : `opencode models` (provider `opencode`). Tous les modèles listés ci-dessous ont un coût input/output/cache de 0 (gratuits).

## Modèles disponibles (7)

| ID | Nom | Statut |
|----|-----|--------|
| opencode/flint-40b-free | Flint 40B Free | active |
| opencode/nemotron-3.5-super-vl-free | Nemotron 3.5 Super VL Free | active |
| opencode/beam-free | Beam Free | active |
| opencode/mimo-v2.6-flash-free | MiMo-V2.6-Flash Free | active |
| opencode/deepseek-v4.1-flash-free | DeepSeek V4.1 Flash Free | active |
| opencode/glm-5.3-flash-free | GLM-5.3-Flash Free | active |
| opencode/big-pickle | Big Pickle | active |

## Affectation par rôle de l'organisation

| Rôle | Modèle principal | Secours 1 | Secours 2 |
|------|------------------|-----------|-----------|
| Orchestrateur (coordination) | opencode/nemotron-3.5-super-vl-free | opencode/flint-40b-free | opencode/beam-free |
| Agent (exécution) | opencode/flint-40b-free | opencode/beam-free | opencode/mimo-v2.6-flash-free |
| Mémoire (leçons / erreurs / bons patrons) | opencode/beam-free | opencode/mimo-v2.6-flash-free | opencode/deepseek-v4.1-flash-free |
| Analyse (votes) | opencode/deepseek-v4.1-flash-free | opencode/glm-5.3-flash-free | opencode/big-pickle |
| Tâches (planification) | opencode/mimo-v2.6-flash-free | opencode/deepseek-v4.1-flash-free | opencode/glm-5.3-flash-free |

## Règle de secours en cas de limite de requêtes

1. Attendre avec délai croissant.
2. Passer au modèle gratuit suivant de la liste (secours 1, puis secours 2).
3. Ne jamais utiliser de modèle payant.

## Note

Les rôles exacts de l'organisation doivent être confirmés. Voir `blm/memoire/questions.md`.
