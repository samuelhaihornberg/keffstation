/*!
 * KeffTech — Configuration Shopify Headless (EXEMPLE)
 * ============================================================================
 * Copiez ce fichier en shopify-config.js et remplissez avec vos propres valeurs.
 * NE JAMAIS committer shopify-config.js contenant un vrai jeton sur GitHub.
 *
 * Le jeton Storefront est PUBLIC : il est conçu pour être exposé côté navigateur.
 * Il ne permet que des lectures en magasin et la création de paniers/checkouts.
 * NE JAMAIS utiliser de jeton Admin API ni de jeton Storefront PRIVÉ ici.
 */

window.KIFFTECH_SHOPIFY = {
  // Domaine de votre boutique Shopify (sans https://)
  // Exemple : "ma-boutique.myshopify.com"
  domain: "",

  // Jeton d'accès Storefront PUBLIC (begins par shpat_...)
  // Obtenu dans Shopify admin > Apps > Develop apps > Storefront API access token
  storefrontAccessToken: "",

  // Version de l'API Storefront à utiliser
  apiVersion: "2024-01",

  // Nombre max de produits à charger par requête
  pageSize: 100,

  // Si true, les produits Shopify remplacent les produits locaux KiffTech
  // Si false, ils sont fusionnés en complément (évite les doublons par handle)
  replaceLocalDb: false,

  // Devise affichée (doit correspondre à celle de votre boutique Shopify)
  currency: "EUR",

  // Préfixe d'ID pour éviter les collisions avec les produits locaux KiffTech
  idPrefix: "shopify-",
};
