# Champs restants avant activation des commandes

Source : `docs/source/KiffStation_conditions_utilisation_et_confidentialite.txt`. Les valeurs déjà renseignées sont listées dans `docs/source/valeurs-renseignees.json`. Les champs ci-dessous restent surlignés dans les pages et ne doivent pas être inventés.

| Partie | Section | Ligne source | Champ |
|---|---|---|---|

Total restant : 0 occurrences (dont l’en-tête de date, présent dans les deux pages).

## Après complétion
1. Compléter les champs (valeurs fournies par le responsable, pas inventées), puis relancer `python3 tools/build-legal-pages.py`.
2. Faire valider le texte juridiquement.
3. Mettre `termsValidated: true` dans `data/legal.js` uniquement après validation.
4. `npm run sync:supabase`, commit, push, relancer le workflow de déploiement, puis vérifier `legalReady: true`.
