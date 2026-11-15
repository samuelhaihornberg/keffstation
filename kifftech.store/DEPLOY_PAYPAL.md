# KiffTech — Paiement PayPal : état

Voir **`DEPLOY_SUPABASE_BACKEND.md`** pour l’architecture, les étapes de déploiement, les secrets et les vérifications.

## Résumé
- Backend : Supabase Edge Functions (`supabase/functions/`), projet `spkaxtmhefhycqnshybo`. Pas de Cloudflare, pas de serveur Node.
- Front : GitHub Pages, appelle les fonctions via `data/payment-config.js` (URL + clé publishable uniquement).
- Paiement ponctuel (`intent: CAPTURE`). PayPal et carte via composants officiels, selon éligibilité PayPal.
- Montants recalculés côté serveur. « Payé » uniquement après capture confirmée avec montant et devise identiques.
- Acceptation des conditions obligatoire (case non cochée par défaut), version et date enregistrées avec la commande.
- Reçu créé après capture (numéro unique, `legal_complete = false` tant que l’identité vendeur n’est pas renseignée).

## Sandbox / Live
- **Sandbox** : supporté par le code avec les identifiants Sandbox et `PAYPAL_API_BASE=https://api-m.sandbox.paypal.com`. **Non déployé ni testé sur votre projet.**
- **Live** : supporté par le code avec les identifiants Live et `PAYPAL_API_BASE=https://api-m.paypal.com`. **Non opérationnel à ce stade** : fonctions non déployées, secrets Live non saisis, conditions non publiées, endpoints non vérifiés.

## Bloquants restants
1. Déploiement des fonctions et de la migration sur `spkaxtmhefhycqnshybo`.
2. Secrets Live saisis dans le Dashboard.
3. Conditions d’utilisation et politique de confidentialité publiées (`data/legal.js`).
4. Identité vendeur et mentions légales de facturation.
5. Révocation de la clé secrète Supabase exposée dans la conversation.
