# Champs restants avant activation des commandes

Source : `docs/source/KiffStation_conditions_utilisation_et_confidentialite.txt`. Les valeurs déjà renseignées sont listées dans `docs/source/valeurs-renseignees.json`. Les champs ci-dessous restent surlignés dans les pages et ne doivent pas être inventés.

| Partie | Section | Ligne source | Champ |
|---|---|---|---|
| Partie I | 1. ÉDITEUR ET VENDEUR | 21 | [À COMPLÉTER] |
| Partie I | 1. ÉDITEUR ET VENDEUR | 23 | [À COMPLÉTER, LE CAS ÉCHÉANT] |
| Partie I | 7. LIVRAISON, TAXES, RETOURS ET ANNULATIONS | 77 | [URL DE LA POLITIQUE DE RETOURS ET D’ANNULATIONS] |
| Partie I | 7. LIVRAISON, TAXES, RETOURS ET ANNULATIONS | 80 | [Lien vers le formulaire d’annulation] |
| Partie I | 11. RESPONSABILITÉ ET DROIT APPLICABLE | 107 | [À COMPLÉTER APRÈS VÉRIFICATION] |
| Partie II | 6. DURÉES DE CONSERVATION | 174 | [DURÉE LÉGALE À DÉTERMINER] |
| Partie II | 6. DURÉES DE CONSERVATION | 176 | [DURÉE À COMPLÉTER] |
| Partie II | 6. DURÉES DE CONSERVATION | 177 | [DURÉE À COMPLÉTER] |
| Partie II | 7. COOKIES ET STOCKAGE LOCAL | 185 | [À COMPLÉTER AVANT PUBLICATION] |

Total restant : 9 occurrences (dont l’en-tête de date, présent dans les deux pages).

## Après complétion
1. Compléter les champs (valeurs fournies par le responsable, pas inventées), puis relancer `python3 tools/build-legal-pages.py`.
2. Faire valider le texte juridiquement.
3. Mettre `termsValidated: true` dans `data/legal.js` uniquement après validation.
4. `npm run sync:supabase`, commit, push, relancer le workflow de déploiement, puis vérifier `legalReady: true`.
