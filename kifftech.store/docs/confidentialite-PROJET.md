# Déclaration de confidentialité — KiffTech.store (PROJET, NON PUBLIÉ)

> **Projet à faire valider par un professionnel du droit avant publication.** Les champs entre crochets doivent être renseignés par le responsable de la boutique. Aucune identité, adresse ni numéro n’a été inventé.

## 1. Responsable du traitement
[Dénomination sociale — À COMPLÉTER] · [Adresse — À COMPLÉTER] · [Contact : e-mail dédié — À COMPLÉTER] · [Délégué à la protection des données, si désigné — À COMPLÉTER]

## 2. Données traitées lors d’un achat
| Donnée | Qui la traite | Par KiffTech.store ? |
|---|---|---|
| Numéro de carte, date d’expiration, CVV | PayPal (paiement par carte via ses composants) | **Non.** Jamais reçues, jamais stockées par KiffTech.store. |
| Nom, e-mail, adresse de l’acheteur | PayPal, lors du paiement | **Non** (pas demandés par la boutique, pas stockés). |
| Contenu du panier (produits, variantes, quantités, montants) | KiffTech.store | Oui, sur la commande et le reçu. Aucune donnée d’identification. |
| Acceptation des conditions (version, URL, date/heure) | KiffTech.store | Oui, avec la commande. |
| Référence de transaction PayPal | KiffTech.store | Oui, sur le reçu. |
| Empreinte de l’adresse IP (SHA-256 tronquée) | KiffTech.store, pour limiter les appels abusifs | Oui, purgée après 2 jours. L’adresse IP elle-même n’est pas conservée. |

## 3. Finalités et bases légales
- Exécution du contrat d’achat (commande, paiement, livraison) — exécution d’un contrat.
- Respect des obligations comptables et fiscales (reçus) — obligation légale.
- Sécurité du service et lutte contre les abus — intérêt légitime.

## 4. Destinataires
- **PayPal** (paiement), selon sa propre politique de confidentialité.
- **Supabase** (hébergement de la base et des fonctions de paiement) — [région et transferts hors UE à vérifier et à documenter].
- **GitHub Pages** (hébergement de la vitrine statique, sans données de commande).

## 5. Durées de conservation
- Jetons de commande : supprimés (empreinte remplacée) dès le paiement confirmé.
- Identifiants techniques de requête : supprimés dès le paiement confirmé.
- Empreintes d’IP : 2 jours maximum.
- Reçus : [durée à valider par l’expert-comptable ; les pièces comptables sont en principe conservées plusieurs années]. Ils ne contiennent pas de nom, e-mail, adresse ni donnée de carte.

## 6. Suppression après validation du paiement
Après capture PayPal confirmée :
- le jeton de commande est purgé immédiatement ;
- les identifiants techniques de requête sont supprimés ;
- les empreintes d’IP sont purgées au plus tard après 2 jours (fonction `kt_purge_technical_data`, à planifier) ;
- aucune donnée de carte n’est présente à supprimer, car elle n’est jamais transmise à KiffTech.store.

**Limite** : les reçus ne peuvent pas être supprimés avant la fin de leur durée de conservation légale. Ils ne contiennent pas de données personnelles directes. Pour toute demande concernant les données détenues par PayPal, s’adresser à PayPal.

## 7. Vos droits
Accès, rectification, effacement, limitation, opposition et portabilité, dans les limites légales. Demande : [contact — À COMPLÉTER]. Réclamation possible auprès de la CNIL (cnil.fr).

## 8. Sécurité
Recalcul des montants côté serveur, accès aux commandes par jeton non réutilisable, accès base réservé au serveur, origine web restreinte, aucun secret dans le code ou le navigateur.

## 9. Mise à jour
Date de dernière mise à jour : [À COMPLÉTER].
