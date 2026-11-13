// src/parseur-demande.js — Parseur des corps de données à la réception d'un message (PWA).
// Donne un identifiant à la demande et décrit chaque corps nécessaire au calcul :
// id, version, type, source, dépendances, référence au contenu (ref).
// Types : message | contexte | parametre | logique-bllm | outil | modele | resultat-intermediaire | resultat-final
// Les objets lourds (poids modèle) utilisent une référence (ref) plutôt que d'être embarqués.
'use strict';
(function (global) {
  function nouvelIdDemande(){
    return 'req-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1000000).toString(36);
  }
  function refInline(valeur){ return { type: 'inline', valeur: valeur, taille: String(valeur == null ? '' : valeur).length }; }
  function refLourde(type, cible, tailleEstimee, note){
    return { type: 'ref', cible: cible, tailleEstimee: tailleEstimee || 0, note: note || '', charge: false };
  }
  function refModelCible(poidsCible, tailleEstimee){
    return refLourde('modele', poidsCible, tailleEstimee, 'poids du modèle : référence uniquement, jamais embarqué dans le corps');
  }
  // Déclare les corps nécessaires au calcul pour une demande donnée.
  // texte : contenu du message utilisateur ; bot : {id,name,...} ; ctx : contexte de séance (optionnel) ; moteur : info moteur (optionnel)
  function parserDemande(texte, bot, ctx, moteur){
    var idDemande = nouvelIdDemande();
    var now = Date.now();
    var corps = [];
    // 1) corps message (entrée brute)
    corps.push({
      id: idDemande + '-msg',
      version: 1,
      type: 'message',
      source: 'utilisateur',
      dependances: [],
      ref: refInline(texte),
      etat: 'actif',
      polarite: 'positive',
      sante: 'disponible',
      cause: 'reception-message',
      ts: now
    });
    // 2) corps contexte (séance / souvenirs) — passif, réutilisable par le Recyclor
    corps.push({
      id: idDemande + '-ctx',
      version: ctx && ctx.version != null ? ctx.version : 1,
      type: 'contexte',
      source: 'seance-' + (bot && bot.id ? bot.id : 'inconnu'),
      dependances: [idDemande + '-msg'],
      ref: { type: 'ref', cible: 'seance:' + (bot && bot.id ? bot.id : 'inconnu'), tailleEstimee: ctx ? ctx.tailleEstimee || 0 : 0, note: 'contexte de séance cloisonné par bot' },
      etat: 'passif',
      polarite: 'neutre',
      sante: 'disponible',
      cause: 'ouverture-seance',
      ts: now
    });
    // 3) corps paramètre (langue, mode, température, enveloppe)
    corps.push({
      id: idDemande + '-prm',
      version: 1,
      type: 'parametre',
      source: 'configuration-bot',
      dependances: [],
      ref: refInline({ langue: ctx && ctx.langue ? ctx.langue : 'fr', mode: 'local', enveloppe: 2048 }),
      etat: 'passif',
      polarite: 'neutre',
      sante: 'disponible',
      cause: 'parametres-par-defaut',
      ts: now
    });
    // 4) corps logique BLLM (ensemble de règles utiles à la tâche) — pattern abstrait
    corps.push({
      id: idDemande + '-bllm',
      version: 1,
      type: 'logique-bllm',
      source: 'registre-BLLM',
      dependances: [idDemande + '-msg', idDemande + '-ctx'],
      ref: { type: 'ref', cible: 'bllm:equipe-standard', tailleEstimee: 0, note: 'référence aux logiques BLLM (règles non exposées)' },
      etat: 'passif',
      polarite: 'abstraite',
      sante: 'disponible',
      cause: 'composition-equipe',
      ts: now
    });
    // 5) corps outil (action connectée si nécessaire)
    corps.push({
      id: idDemande + '-outil',
      version: 1,
      type: 'outil',
      source: 'actions-disponibles',
      dependances: [idDemande + '-msg'],
      ref: { type: 'ref', cible: 'outil:aucun', tailleEstimee: 0, note: 'aucun outil externe requis par défaut' },
      etat: 'passif',
      polarite: 'neutre',
      sante: 'disponible',
      cause: 'aucun-outil',
      ts: now
    });
    // 6) corps modèle (référence aux poids lourds, jamais embarqués)
    var poidsCible = (moteur && moteur.modelId) ? moteur.modelId : 'onnx-community/SmolLM2-360M-Instruct-ONNX';
    var tailleEstimee = (moteur && moteur.downloadMB) ? moteur.downloadMB * 1048576 : 390 * 1048576;
    corps.push({
      id: idDemande + '-mdl',
      version: 1,
      type: 'modele',
      source: 'moteur-local',
      dependances: [],
      ref: refModelCible(poidsCible, tailleEstimee),
      etat: 'passif',
      polarite: 'neutre',
      sante: 'disponible',
      cause: 'selection-moteur',
      ts: now
    });
    // 7) corps résultat intermédiaire (réservé, rempli après génération)
    corps.push({
      id: idDemande + '-res-int',
      version: 1,
      type: 'resultat-intermediaire',
      source: 'moteur-generation',
      dependances: [idDemande + '-msg', idDemande + '-mdl'],
      ref: { type: 'ref', cible: 'attente', tailleEstimee: 0, note: 'rempli après passage moteur' },
      etat: 'dormant',
      polarite: 'neutre',
      sante: 'indisponible',
      cause: 'en-attente-generation',
      ts: now
    });
    // 8) corps résultat final (réservé, affiché à l'utilisateur)
    corps.push({
      id: idDemande + '-res-final',
      version: 1,
      type: 'resultat-final',
      source: 'moteur-generation',
      dependances: [idDemande + '-res-int'],
      ref: { type: 'ref', cible: 'attente', tailleEstimee: 0, note: 'rempli avant affichage, réponse unique visible' },
      etat: 'dormant',
      polarite: 'positive',
      sante: 'indisponible',
      cause: 'en-attente-affichage',
      ts: now
    });
    // Enregistrement dans le registre
    var reg = global.ViaRegistreCorps;
    if (reg){
      corps.forEach(function(c){ reg.enregistrerCorps(c); reg.lierDemande(idDemande, c.id); });
    }
    return {
      idDemande: idDemande,
      bot: bot || { id: 'inconnu', name: 'inconnu' },
      texte: texte,
      corps: corps,
      timestamp: now,
      typesUtilises: corps.map(function(c){ return c.type; })
    };
  }
  // Remplit un corps résultat (intermédiaire ou final) depuis une référence de contenu
  function remplirResultat(idDemande, typeResultat, contenu, moteurUtilise, note){
    var reg = global.ViaRegistreCorps;
    if (!reg) return { ok: false, erreur: 'registre-indisponible' };
    var suffixe = typeResultat === 'resultat-final' ? '-res-final' : '-res-int';
    var id = idDemande + suffixe;
    var c = reg.getCorps(id);
    if (!c) return { ok: false, erreur: 'corps-resultat-introuvable', id: id };
    c.ref = { type: 'inline', valeur: contenu, taille: String(contenu == null ? '' : contenu).length, note: note || '' };
    c.etat = 'actif';
    c.sante = 'disponible';
    c.polarite = typeResultat === 'resultat-final' ? 'positive' : 'neutre';
    c.cause = 'rempli-' + (moteurUtilise || 'inconnu');
    c.ts = Date.now();
    reg.journalTransition(id, c.etat, c.cause, c.ts);
    return { ok: true, corps: c };
  }
  global.ViaParseurDemande = {
    nouvelIdDemande: nouvelIdDemande,
    parserDemande: parserDemande,
    remplirResultat: remplirResultat,
    refInline: refInline, refLourde: refLourde, refModelCible: refModelCible
  };
})(window);
