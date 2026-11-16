/* Conditions et politique de la boutique.
   Pages publiées (URL vérifiées le 15/11/2026, HTTP 200) :
   - conditions.html : Partie I (Conditions d’utilisation et de vente)
   - politique-confidentialite.html : Partie II (Politique de confidentialité)
   termsValidated : false tant que la version 0.2 (règles commerciales) n’est pas validée par écrit par l’avocat.
   Si remis à false, le serveur refuse la création de commande (legal_not_configured) et le front désactive le paiement. */
export const LEGAL = {
  termsUrl: 'https://samuelhaihornberg.github.io/keffstation/kifftech.store/conditions.html',
  privacyUrl: 'https://samuelhaihornberg.github.io/keffstation/kifftech.store/politique-confidentialite.html',
  termsVersion: '0.1',
  termsDate: '15 novembre 2026',
  termsValidated: false,
};
