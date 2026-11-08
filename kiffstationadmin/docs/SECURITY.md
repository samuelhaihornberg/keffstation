# Sécurité — Administration Keffstation

## Règles non négociables

- Aucun mot de passe, code PIN, clé SSH, clé secrète ou jeton admin dans :
  - le navigateur ;
  - le dépôt ;
  - les fichiers publics ;
  - les messages ou les captures d'écran publiés.
- Aucun serveur SSH/SSHD pour ouvrir l'administration.
- Authentification admin dédiée, sans inscription publique.
- Base de données protégée côté serveur, avec RLS activé.
- Clé `service_role` uniquement dans les variables d'environnement serveur.
- Accès minimum pour chaque service.
- E-mails d'alerte : résumé + lien sécurisé, jamais les données personnelles complètes.
- Recherches internes Keffstation séparées des requêtes Google Search Console.
- PayPal Sandbox pour tester les refus de carte sans vraie commande.

## État de la double vérification

Le propriétaire a demandé de reporter la double vérification et de démarrer avec une seule authentification.

- **Prototype / développement** : mot de passe long et unique, limitation des tentatives, session courte, cookie sécurisé, journal d'audit.
- **Avant mise en ligne** : double vérification obligatoire (TOTP ou passkey), codes de secours hors ligne.
- **Ne pas exposer** le tableau avec des données réelles tant que la 2FA n'est pas active.

Cette exception est temporaire et doit être suivie dans la roadmap.

## Comptes et permissions

| Service | Compte | Permission minimale | Secrets |
|---|---|---|---|
| GitHub | `samuelhaihornberg` | dépôt privé `kiffstationadmin` | jeton OAuth local, jamais dans le dépôt |
| Supabase | à créer | `service_role` côté serveur, `anon` insert-only | variables d'environnement |
| Hébergement | à choisir | déploiement + variables d'environnement | jamais dans le dépôt |
| Resend/Postmark | à créer | envoi d'e-mails uniquement | clé API côté serveur |
| Google Search Console | compte Google admin | lecture seule | OAuth côté serveur |
| PayPal Developer | à créer | Sandbox uniquement | identifiants Sandbox côté serveur |
| Monitoring | à choisir | lecture seule | clé côté serveur |
| Bitwarden | existant | coffre admin | mot de passe maître hors ligne |

## Authentification admin

### Phase 1 — développement

- Un seul compte admin.
- Mot de passe de 20 caractères minimum, généré et stocké dans Bitwarden.
- Limitation des tentatives : 5 échecs → verrouillage temporaire.
- Session de 30 minutes, renouvellement contrôlé.
- Cookie `HttpOnly`, `Secure`, `SameSite=Strict`.
- Protection CSRF sur les actions d'écriture.
- Journal d'audit : connexion, déconnexion, changement de paramètres, export.
- Aucun secret dans le JavaScript du navigateur.

### Phase 2 — avant production

- TOTP ou passkey obligatoire.
- Codes de secours générés et conservés hors ligne.
- Test de récupération de compte.
- Rotation des secrets après tout doute.
- Revue des sessions actives.

## Base de données

- RLS activé sur toutes les tables.
- Politique par défaut : refus.
- `anon` : insertion limitée via `/ingest`, aucun `SELECT`.
- `authenticated` admin : lecture des vues agrégées uniquement.
- `service_role` : jamais dans le navigateur, jamais dans le dépôt.
- Fonctions `SECURITY DEFINER` limitées et auditées.
- Sauvegardes chiffrées, restauration testée.
- Journal d'audit des accès admin.

## Collecte et données personnelles

- Pas d'IP brute : hachage ou troncature.
- Pas d'URL complète avec paramètres sensibles.
- Pas de contenu de formulaire dans les événements analytics.
- Identifiants de session hachés.
- Filtrage des robots.
- La fonction `ingest` est publique (`verify_jwt = false`) : appliquer une
  limitation de débit au niveau du CDN/WAF avant la production.
- `ALLOWED_ORIGINS` doit contenir uniquement les domaines réels de la PWA
  avant la mise en ligne.
- Politique de conservation :
  - événements bruts : 90 jours ;
  - agrégats : 2 ans ;
  - soumissions de formulaires : 30 jours si stockées ;
  - alertes : 1 an.
- Les données de formulaire réellement nécessaires sont stockées dans une table séparée, chiffrée, à accès serveur uniquement.
- Les e-mails d'alerte ne contiennent que des résumés et un lien sécurisé.

## En-têtes et protections web

- HTTPS obligatoire, HSTS.
- CSP stricte, pas de script inline non autorisé en production.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy` minimale.
- Limitation de débit sur `/ingest` et `/login`.
- WAF ou protection équivalente sur l'hébergeur.
- `noindex` sur l'administration.
- Pas de données sensibles dans les logs.

## Alertes e-mail

- SPF, DKIM, DMARC configurés.
- Clé d'envoi limitée à l'envoi.
- Résumé + lien sécurisé.
- Aucune donnée personnelle complète.
- Aucune pièce jointe sensible.
- Déduplication et limitation des alertes.
- Lien vers l'admin protégé par authentification.

## Google Search Console

- OAuth lecture seule.
- Jetons stockés côté serveur, chiffrés.
- Synchronisation planifiée, pas en temps réel.
- Badge « différé » et mention des requêtes masquées.
- Table séparée des recherches internes.
- Aucune fusion des compteurs.

## PayPal Sandbox

- Compte Developer + Sandbox uniquement.
- Cartes de test pour refus, fonds insuffisants, expiration.
- Aucune vraie commande.
- Identifiants Sandbox côté serveur.
- Webhooks Sandbox avec vérification de signature.
- Idempotence des notifications.
- Passage en production séparé et documenté.

## Déploiement

- Aucun SSH/SSHD.
- GitHub Actions ou interface de l'hébergeur.
- Secrets dans les variables d'environnement de la plateforme.
- Analyse des secrets avant commit (`gitleaks` ou équivalent).
- GitHub Secret Scanning activé.
- Revue des dépendances.
- Sauvegarde avant migration.

## En cas d'incident

1. Révoquer les sessions admin.
2. Révoquer les jetons et clés concernés.
3. Changer le mot de passe admin.
4. Vérifier les journaux d'audit.
5. Prévenir si des données personnelles ont été exposées.
6. Corriger, tester, documenter.
