# Roadmap — Administration Keffstation

## Phase 0 — Cadre et dépôt

- [x] Créer le dépôt privé `kiffstationadmin`.
- [x] Documenter l'architecture.
- [x] Documenter la sécurité.
- [x] Créer le prototype visuel avec données fictives.
- [x] Faire valider le prototype (montagne, périodes, lisibilité Android).
- [x] Valider la stack Supabase.
- [ ] Valider le nom de domaine admin.
- [ ] Valider la date d'activation de la 2FA.

## Phase 1 — Base et collecte

- [x] Préparer les migrations SQL, les vues agrégées et la fonction `ingest`.
- [ ] Créer le projet Supabase.
- [ ] Exécuter les migrations et activer RLS.
- [ ] Déployer la fonction `/ingest` avec limitation de débit.
- [ ] Ajouter l'envoi d'événements dans la PWA `keffstation`.
- [ ] Vérifier qu'aucun `SELECT` public n'est possible.
- [ ] Tester les insertions, le filtrage robots et les doublons.

## Phase 2 — Authentification admin

- [ ] Créer le compte admin unique.
- [ ] Implémenter la connexion mot de passe.
- [ ] Ajouter la limitation des tentatives.
- [ ] Ajouter les cookies `HttpOnly` / `Secure` / `SameSite`.
- [ ] Ajouter le journal d'audit.
- [ ] Ajouter la 2FA TOTP/passkey avant mise en ligne.

## Phase 3 — Tableau de bord

- [ ] Brancher les données réelles.
- [ ] Afficher les visites et les clics.
- [ ] Afficher les formulaires et les recherches internes.
- [ ] Afficher les composantes de fiabilité.
- [ ] Finaliser le graphique montagne 3D.
- [ ] Tester sur Android, en 3G/4G et en mode économie d'énergie.
- [ ] Ajouter le tableau accessible de repli.

## Phase 4 — Google Search Console

- [ ] Créer l'accès OAuth lecture seule.
- [ ] Stocker les jetons côté serveur.
- [ ] Créer la synchronisation planifiée.
- [ ] Séparer l'onglet GSC de l'onglet recherches internes.
- [ ] Afficher les badges « différé » et « requêtes masquées ».

## Phase 5 — Alertes et paiements

- [ ] Configurer Resend/Postmark et le domaine.
- [ ] Créer les alertes de disponibilité, formulaires et fiabilité.
- [ ] Vérifier qu'aucune donnée personnelle complète n'est envoyée.
- [ ] Configurer PayPal Sandbox.
- [ ] Tester les refus de carte sans commande réelle.
- [ ] Documenter le passage en production.

## Phase 6 — Durcissement et mise en ligne

- [ ] Activer la 2FA.
- [ ] Vérifier CSP, HSTS, cookies et limitation de débit.
- [ ] Vérifier les sauvegardes et la restauration.
- [ ] Vérifier les journaux d'audit.
- [ ] Tester l'administration sur téléphone Android.
- [ ] Déployer sur un sous-domaine privé.
- [ ] Désactiver l'indexation.
