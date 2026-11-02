// src/memoire-classee.js — remplace restauration auto derniers messages.
// Classification : projet, intention, evolution, correction, actif, termine/bloque.
// Le lancement d'une app/page déclenche restaurerSurLancement (pas au boot).
'use strict';
const STATUTS = new Set(['actif', 'termine', 'bloque']);
const TYPES = new Set(['projet', 'intention', 'evolution', 'correction']);
function classerSouvenir(s = {}) {
  const type = TYPES.has(s.type) ? s.type : 'evolution';
  const statut = STATUTS.has(s.statut) ? s.statut : 'actif';
  return { projet: String(s.projet || 'courant'), intention: String(s.intention || ''),
    type, texte: String(s.texte || '').slice(0, 2000), statut,
    ts: s.ts || Date.now() };
}
function restaurerSurLancement(memoires, { app = '', page = '' } = {}) {
  // Seuls les actifs du projet/app/page en cours reviennent.
  const cible = String(app || page || 'courant');
  return memoires.filter((m) => m.statut === 'actif')
    .filter((m) => m.projet === cible || m.projet === 'courant')
    .slice(-8);
}
// ---- Mémoire v2 adaptée (sans moteur) : déduplication, pertinence,
// corrections prioritaires, erreurs dépassées, remise à zéro.
// Tout sort en souvenirs classerSouvenir : seul formulerEntree les transmet
// (jamais d'historique brut dans sysPrompt ni dans un moteur).
function normeCle(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}
const MEM_STOP = new Set(['le', 'la', 'les', 'de', 'des', 'du', 'un', 'une', 'est', 'sont', 'et',
  'ou', 'mais', 'donc', 'car', 'que', 'qui', 'dont', 'pas', 'plus', 'moins', 'tres',
  'aussi', 'avec', 'pour', 'dans', 'sur', 'sous', 'entre', 'vers', 'chez', 'sans',
  'par', 'comme', 'si', 'quand', 'alors', 'ensuite', 'puis', 'apres', 'avant',
  'pendant', 'deja', 'encore', 'toujours', 'jamais', 'ce', 'cet', 'cette', 'ces',
  'mon', 'ton', 'son', 'notre', 'votre', 'leur', 'mes', 'tes', 'ses', 'nos', 'vos',
  'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'on', 'me', 'te', 'se',
  'lui', 'y', 'en', 'ne', 'non', 'oui', 'merci', 'cela', 'ca', 'etre', 'avoir',
  'the', 'and', 'with', 'what', 'how', 'why', 'have', 'this', 'that', 'your', 'for']);
function extraireMotsCles(texte, n) {
  const freq = {}, ordre = [];
  normeCle(texte).split(' ').forEach((w) => {
    if (w.length < 4 || MEM_STOP.has(w)) return;
    if (!freq[w]) { freq[w] = 0; ordre.push(w); }
    freq[w]++;
  });
  ordre.sort((a, b) => freq[b] - freq[a]);
  return ordre.slice(0, n || 5);
}
// Marqueurs de correction repris de B (formes normalisées) ; 'non pas' seul
// écarté : trop générique (« non pas demain » n'est pas une correction).
const MARQUEURS_CORRECTION = ['tu te trompes', 'tu tes trompe', 'corrige', 'correction',
  'faux', 'pas ca', 'ce nest pas', 'tu as tort', 'oublie ca', 'retiens',
  'erreur de ta part', 'tu as dit', 'tu as ecrit'];
function detecterCorrection(texte) {
  const n = normeCle(texte);
  return MARQUEURS_CORRECTION.some((m) => n.indexOf(m) >= 0);
}
// Classement d'un échange : classerSouvenir + sujet (mots-clés) + type
// correction détecté. Aucune déduction d'attribut sensible : sujet et
// correction reprennent les mots de l'utilisateur, sans catégorie imposée.
function classerEchange(projet, intention, texte) {
  const t = String(texte || '');
  const s = classerSouvenir({ projet, intention,
    type: detecterCorrection(t) ? 'correction' : 'evolution', texte: t, statut: 'actif' });
  s.sujet = extraireMotsCles(t, 5).join(' ');
  return s;
}
function cleSouvenir(m) {
  return String(m.projet || '') + '|' + String(m.intention || '') + '|' + normeCle(m.texte);
}
// Doublon évité : même projet+intention+texte normalisé → on garde la copie
// la plus récente, ordre chronologique conservé.
function dedupliquerSouvenirs(memoires) {
  const vus = new Map();
  (memoires || []).forEach((m) => { if (m) vus.set(cleSouvenir(m), m); });
  const premiers = new Map();
  (memoires || []).forEach((m) => { if (m && !premiers.has(cleSouvenir(m))) premiers.set(cleSouvenir(m), true); });
  const ordre = [];
  (memoires || []).forEach((m) => {
    if (!m) return;
    const k = cleSouvenir(m);
    if (premiers.get(k) === true) { ordre.push(vus.get(k)); premiers.set(k, false); }
  });
  return ordre;
}
// Une correction fait passer les souvenirs antérieurs du même sujet à
// 'termine' (exclus de restaurerSurLancement) : seuil prudent de 2 mots
// communs pour ne pas effacer sur un seul mot partagé.
function marquerDepasses(memoires) {
  const src = (memoires || []).map((m) => Object.assign({}, m));
  const corrections = src.filter((m) => m && m.type === 'correction' && m.statut === 'actif');
  corrections.forEach((c) => {
    const ref = new Set(extraireMotsCles((c.sujet || '') + ' ' + (c.texte || ''), 10));
    src.forEach((a) => {
      if (!a || a === c || a.statut === 'termine' || a.statut === 'bloque') return;
      if (a.type === 'correction') return;
      const su = extraireMotsCles((a.sujet || '') + ' ' + (a.texte || ''), 10);
      let commun = 0;
      su.forEach((w) => { if (ref.has(w)) commun++; });
      if (commun >= 2) a.statut = 'termine';
    });
  });
  return src;
}
function noterPertinence(souvenir, requete) {
  if (!souvenir) return 0;
  const cible = new Set(extraireMotsCles(((souvenir.sujet || '') + ' ' + (souvenir.texte || '')), 12));
  let s = 0;
  extraireMotsCles(requete, 12).forEach((w) => { if (cible.has(w)) s++; });
  return s;
}
// Récupération : corrections actives d'abord (garde-fous), puis souvenirs
// notés > 0, puis l'échange le plus récent (continuité : « et demain ? »
// répond au dernier message même sans mot commun). Les anciens non notés
// et non récents sont ignorés. Ne retourne que des actifs du projet.
function recupererPertinents(memoires, projet, requete, n) {
  const cible = String(projet || 'courant'), max = n || 8;
  const propres = dedupliquerSouvenirs(marquerDepasses(memoires))
    .filter((m) => m.statut === 'actif' && (m.projet === cible || m.projet === 'courant'));
  if (!propres.length) return [];
  const notes = propres.map((m) => ({ m, s: noterPertinence(m, requete) }));
  const corrections = notes.filter((x) => x.m.type === 'correction').map((x) => x.m);
  const notesPos = notes.filter((x) => x.m.type !== 'correction' && x.s > 0)
    .sort((a, b) => b.s - a.s).map((x) => x.m);
  let ancre = null;
  for (let i = propres.length - 1; i >= 0; i--) {
    if (propres[i].intention === 'demande') {
      ancre = propres.slice(i).filter((m) => m.type !== 'correction'
        && notesPos.indexOf(m) < 0 && corrections.indexOf(m) < 0);
      break;
    }
  }
  if (!ancre) ancre = [propres[propres.length - 1]].filter((m) => m
    && m.type !== 'correction' && notesPos.indexOf(m) < 0 && corrections.indexOf(m) < 0);
  const sortis = corrections.concat(notesPos, ancre || []);
  const uniques = [], vus = new Set();
  sortis.forEach((m) => { const k = cleSouvenir(m); if (!vus.has(k)) { vus.add(k); uniques.push(m); } });
  return uniques.slice(0, max);
}
// Erreurs dépassées (corrigées depuis) : ne remontent jamais comme contexte,
// servent au point de vérification pour refuser un brouillon qui les répète.
function passagesErrones(memoires, projet, maxChars) {
  const cible = String(projet || 'courant'), max = maxChars || 1200;
  const out = (memoires || [])
    .filter((m) => m && (m.projet === cible || m.projet === 'courant') && m.statut === 'termine')
    .map((m) => String(m.texte || '').slice(0, 240));
  const s = out.join('\n');
  return s.length > max ? s.slice(0, max) + '…' : s;
}
// Remise à zéro sûre : pure (aucun stockage touché ici), retire seulement
// le projet demandé, conserve les autres projets.
function reinitialiserSouvenirs(memoires, projet) {
  const cible = String(projet || 'courant');
  return (memoires || []).filter((m) => m && m.projet !== cible);
}
// ---- S3 « Contexte / mémoire » : filtrage, carnet, garde anti-profil,
// formulation classée. Tout ce qui part au moteur passe par ici.
function filtrerEchanges(h) {
  // Seuls les échanges user/assistant non vides ; les messages système
  // (consignes, diagnostics) et les vides ne deviennent jamais souvenirs.
  return (h || []).filter((m) => m && (m.role === 'user' || m.role === 'assistant')
    && String(m.content || '').trim());
}
function formulerEntreeClasse(contexte, texteCourant, faits) {
  // SEUL le contexte classé est transmis, jamais l'historique brut. Rôle
  // d'origine conservé uniquement si enregistré et fiable (intention
  // demande/reponse + statut actif + texte non vide et différent du message
  // actuel) ; sinon, bloc mémoire clairement étiqueté, jamais présenté comme
  // une citation du user ou du bot. Les faits autorisés du savoir (S4) sont
  // étiquetés avec leur source, jamais en rôles. Aucun souvenir pertinent →
  // demande seule. Le message courant est toujours dernier.
  var courant = String(texteCourant || '');
  var sv = contexte || [];
  var roles = [], memoire = [], lignesF = [];
  sv.forEach(function (m) {
    var t = String((m && m.texte) || '').trim();
    if (!t || t === courant.trim()) return;
    var fiable = m && (m.intention === 'demande' || m.intention === 'reponse') && m.statut === 'actif';
    if (fiable) roles.push({ role: m.intention === 'demande' ? 'user' : 'assistant', content: t });
    else memoire.push(t);
  });
  (faits || []).forEach(function (f) {
    var t = String((f && f.texte) || '').trim();
    if (!t) return;
    lignesF.push('« ' + t.slice(0, 300) + ' » [source : ' + String((f && f.source) || 'locale-non-verifiee').slice(0, 80) + ']');
  });
  var msgs = roles.slice(-4);
  if (memoire.length) msgs.push({ role: 'user', content: '[Contexte mémorisé — informations passées, pas des messages actuels : ' + memoire.slice(-4).join(' | ').slice(0, 800) + ']' });
  if (lignesF.length) msgs.push({ role: 'user', content: '[Faits mémorisés — informations vérifiées avec source, pas des messages : ' + lignesF.slice(0, 2).join(' | ').slice(0, 800) + ']' });
  msgs.push({ role: 'user', content: courant });
  return msgs;
}
function souvenirsDuCarnet(entrees, projet) {
  // 044 — carnet confirmé uniquement (jamais le « proposé »), max 2 récents,
  // intention 'note' : toujours bloc mémoire étiqueté, jamais un rôle.
  // Carnet vide (démarrage) → aucun changement de comportement.
  const cible = String(projet || 'courant');
  return (entrees || [])
    .filter((e) => e && e.status === 'confirmed' && String(e.text || '').trim())
    .slice(-2)
    .map((e) => classerEchange(cible, 'note', String(e.text || '').slice(0, 500)));
}
function sansProfilDeduit(souvenir) {
  // 014 — le sujet ne reprend que des mots du texte d'origine : aucun
  // attribut sensible déduit, aucune catégorie imposée.
  if (!souvenir) return false;
  const motsTexte = new Set(normeCle(souvenir.texte).split(' ').filter((w) => w));
  const sujets = String(souvenir.sujet || '').split(' ').filter((w) => w);
  return sujets.every((w) => motsTexte.has(w));
}
// ---- Cloisonnement par bot (EXPLICITE 2026-11-02, comportement inchangé) ----
// Le projet d'un souvenir EST l'id du bot (projetDuBot). verifierCloisonnement
// refuse tout souvenir dont le projet n'est ni le bot ni 'courant' : même
// moteur LLM partagé, mémoires jamais mélangées. ViA garde sa sociabilité
// (personality bots.json + sysPrompt providers.js, intacts).
function projetDuBot(botId) { return String((botId && botId.id) || botId || 'courant'); }
function verifierCloisonnement(memoires, botId) {
  const cible = projetDuBot(botId);
  return (memoires || []).every((m) => !m || String(m.projet || 'courant') === cible || String(m.projet || '') === 'courant');
}
module.exports = { STATUTS, TYPES, classerSouvenir, restaurerSurLancement,
  extraireMotsCles, detecterCorrection, classerEchange, dedupliquerSouvenirs,
  marquerDepasses, noterPertinence, recupererPertinents, passagesErrones,
  reinitialiserSouvenirs, filtrerEchanges, formulerEntreeClasse,
  souvenirsDuCarnet, sansProfilDeduit, projetDuBot, verifierCloisonnement };
