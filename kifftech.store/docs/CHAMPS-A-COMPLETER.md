# Champs à compléter avant activation des commandes

Source : `docs/source/KiffStation_conditions_utilisation_et_confidentialite.txt` (version 0.1). Ces champs sont **surlignés** dans les pages et doivent être renseignés par le responsable de la boutique. Aucun n’a été inventé.

| Partie | Section | Ligne source | Champ |
|---|---|---|---|
| Partie I | — | 7 | [À COMPLÉTER] |
| Partie I | 1. ÉDITEUR ET VENDEUR | 20 | [RAISON SOCIALE OU NOM LÉGAL] |
| Partie I | 1. ÉDITEUR ET VENDEUR | 21 | [À COMPLÉTER] |
| Partie I | 1. ÉDITEUR ET VENDEUR | 22 | [À COMPLÉTER] |
| Partie I | 1. ÉDITEUR ET VENDEUR | 23 | [À COMPLÉTER, LE CAS ÉCHÉANT] |
| Partie I | 1. ÉDITEUR ET VENDEUR | 24 | [À COMPLÉTER, LE CAS ÉCHÉANT] |
| Partie I | 1. ÉDITEUR ET VENDEUR | 25 | [À COMPLÉTER] |
| Partie I | 1. ÉDITEUR ET VENDEUR | 26 | [À COMPLÉTER] |
| Partie I | 7. LIVRAISON, TAXES, RETOURS ET ANNULATIONS | 77 | [URL DE LA POLITIQUE DE RETOURS ET D’ANNULATIONS] |
| Partie I | 7. LIVRAISON, TAXES, RETOURS ET ANNULATIONS | 80 | [Lien vers le formulaire d’annulation] |
| Partie I | 7. LIVRAISON, TAXES, RETOURS ET ANNULATIONS | 81 | [Adresse e-mail professionnelle] |
| Partie I | 10. CONFIDENTIALITÉ | 100 | [URL DE LA POLITIQUE DE CONFIDENTIALITÉ] |
| Partie I | 11. RESPONSABILITÉ ET DROIT APPLICABLE | 106 | [PAYS ET DROIT À CONFIRMER] |
| Partie I | 11. RESPONSABILITÉ ET DROIT APPLICABLE | 107 | [À COMPLÉTER APRÈS VÉRIFICATION] |
| Partie I | 12. CONTACT ET VERSION | 114 | [À COMPLÉTER] |
| Partie I | 12. CONTACT ET VERSION | 115 | [À COMPLÉTER] |
| Partie I | 12. CONTACT ET VERSION | 116 | [À COMPLÉTER] |
| Partie I | 12. CONTACT ET VERSION | 118 | [DATE À COMPLÉTER] |
| Partie II | 1. RESPONSABLE DU TRAITEMENT | 126 | [NOM LÉGAL DE LA PERSONNE OU DE L’ENTREPRISE] |
| Partie II | 1. RESPONSABLE DU TRAITEMENT | 128 | [À COMPLÉTER] |
| Partie II | 1. RESPONSABLE DU TRAITEMENT | 129 | [ADRESSE E-MAIL À COMPLÉTER] |
| Partie II | 1. RESPONSABLE DU TRAITEMENT | 130 | [À COMPLÉTER] |
| Partie II | 6. DURÉES DE CONSERVATION | 173 | [DURÉE OU CRITÈRE À COMPLÉTER] |
| Partie II | 6. DURÉES DE CONSERVATION | 174 | [DURÉE LÉGALE À DÉTERMINER] |
| Partie II | 6. DURÉES DE CONSERVATION | 176 | [DURÉE À COMPLÉTER] |
| Partie II | 6. DURÉES DE CONSERVATION | 177 | [DURÉE À COMPLÉTER] |
| Partie II | 7. COOKIES ET STOCKAGE LOCAL | 185 | [À COMPLÉTER AVANT PUBLICATION] |
| Partie II | 8. DROITS DES UTILISATEURS | 189 | [ADRESSE E-MAIL VIE PRIVÉE] |
| Partie II | 10. MINEURS | 201 | [ADRESSE E-MAIL VIE PRIVÉE] |
| Partie II | 11. MODIFICATIONS ET CONTACT | 208 | [ADRESSE E-MAIL VIE PRIVÉE] |
| Partie II | 11. MODIFICATIONS ET CONTACT | 210 | [DATE À COMPLÉTER] |

Total : 31 occurrences.

## Après complétion
1. Renseigner les champs dans le document source (ou directement dans les pages), en gardant le texte.
2. Mettre `termsValidated: true` dans `data/legal.js` uniquement après validation juridique.
3. `npm run sync:supabase`, commit, push, puis relancer le workflow de déploiement (ou redéployer `paypal-config` et `paypal-create-order`).
4. Vérifier `paypal-config` : `legalReady` doit valoir `true`.
