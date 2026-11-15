/* Conditions et politique de la boutique (pages : conditions.html, politique-confidentialite.html).
   - termsUrl / privacyUrl : pages publiées.
   - termsVersion : version du document (0.1 = projet).
   - termsValidated : NE PASSER À true QU'APRÈS validation juridique et complétion des champs [À COMPLÉTER].
     Tant qu'il vaut false, le serveur refuse la création de commande (legal_not_configured) et le front
     désactive le paiement. */
export const LEGAL = {
  termsUrl: 'https://www.kiffstation.com/kifftech.store/conditions.html',
  privacyUrl: 'https://www.kiffstation.com/kifftech.store/politique-confidentialite.html',
  termsVersion: '0.1',
  termsDate: '',
  termsValidated: false,
};
