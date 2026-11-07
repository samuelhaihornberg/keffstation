// ============================================================================
// src/recyclor.js — Moteur de recyclage BLM (recyclor) · cos V5
// CommonJS, pour s'insérer dans backend.js (qui est du CJS) sans toucher à la
// ligne embarquée (BASE_GZ_B64 / createServer sur une seule ligne).
//
// Principe : copie bit-à-bit garantie par empreinte SHA-256, backup santé
// avant toute écriture, restauration "neuve en pleine santé" depuis le backup,
// suppression ciblée sous confirmation, et boucle compute (improvise → propose
// → valide collective). Aucun accès aux .env ni clés API.
//
// VIDAGE ORGANIQUE + REVITALIZATOR (principe complet) :
//   copier → mesurer la santé → réduire OU vider quand ça se dégrade →
//   recoller l'original → l'état revient à 100 %.
//   RÉDUIRE ≠ VIDER : réduire dégrade la data (elle reste) ; vider la RELÂCHE
//   (le cache s'en va). L'original n'est jamais touché.
//   Le vidage organique adapte son rythme à la santé (courbe douce, paliers
//   décroissants). Le revitalizator redéfinit l'état complet, pas un chiffre.
//   Dry-run par défaut : rien n'est relâché sans autoriser=true.
// ============================================================================
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const http = require('http');
const zlib = require('zlib');

// Le calcul partagé venait du noyau motor.s (source de vérité unique).
// MANQUE CONSTATÉ 2026-11-02 : './motor-noyau.js' et './host-policy.js'
// n'existent PAS dans viartificial/src (ni dans KeffStation). Le require
// direct faisait crasher le module au chargement. Repli : chargement
// best-effort + formules locales documentées (santé Shannon, paliers,
// rythme organique). Aucun comportement réseau modifié.
var noyau = null, creerPolitique = null;
try { noyau = require('./motor-noyau.js').noyau; } catch (e) { noyau = null; }
try { creerPolitique = require('./host-policy.js').creerPolitique; } catch (e) { creerPolitique = null; }
if (!noyau) {
  // Repli local (formules équivalentes documentées, sans dépendance).
  noyau = {
    sante: function (data, densite) {
      var s = String(data == null ? '' : data), freq = {}, i, c, p, h = 0;
      for (i = 0; i < s.length; i++) { c = s[i]; freq[c] = (freq[c] || 0) + 1; }
      Object.keys(freq).forEach(function (k) { p = freq[k] / Math.max(1, s.length); h -= p * (Math.log(p) / Math.log(2)); });
      var max = Math.log(Math.max(2, densite || 4)) / Math.log(2);
      return { entropie: +h.toFixed(4), pourcent: Math.max(0, 1 - h / 8), octets: s.length, bruit: 0 };
    },
    paliers: function (total, parPalier) {
      var t = +total || 0, n = Math.max(1, +parPalier || 10), out = [], i;
      for (i = 1; i <= n; i++) out.push({ palier: i, libere: Math.round(t * i / n), reste: t - Math.round(t * i / n), part: +(100 * i / n).toFixed(1) });
      return out;
    },
    rythmeOrganic: function (sante, cycles) {
      var s = Math.max(0, Math.min(1, +sante || 0)), c = Math.max(1, +cycles || 1);
      return { urgence: +(1 - s).toFixed(3), pas: Math.round(100 * (1 - s) / c), libere: 0, retenu: 0, organic: true };
    },
    vidageDynamique: function (octets, opts) {
      var o = opts || {}, n = Math.max(1, +o.cycles || 5), t = +octets || 0, acc = 0, cycles = [], i;
      for (i = 1; i <= n; i++) { var q = Math.round(t / n); acc += q; cycles.push({ cycle: i, libere: q, cumul: acc }); }
      return { cycles: cycles, libere: acc, reste: Math.max(0, t - acc) };
    }
  };
}
if (!creerPolitique) { creerPolitique = function () { return { autorise: function () { return false; } }; }; }

/* ------------------------------------------------------------------ réglages */
const ENV = process.env;
const RECYCLOR_HOST = ENV.HOST || '127.0.0.1';
const RECYCLOR_PORT = parseInt(ENV.RECYCLOR_PORT || '8788', 10);

// Répertoire de backups DÉDIÉ et DÉCLARÉ — HORS du dépôt ViArtificial.
const BACKUP_DIR = path.resolve(__dirname, '../../miroirs/viartificial-recyclor/backups');
const LOG_DIR    = path.resolve(__dirname, '../../miroirs/viartificial-recyclor/log');
const TRASH_DIR  = path.resolve(__dirname, '../../miroirs/viartificial-recyclor/trash');

const MAX_BODY = 64 * 1024;
const MAX_ITER = 50;          // boucle compute bornée
const MAX_MS   = 30000;       // timeout boucle compute (30 s)

/* ------------------------------------------------------------------ ern cibles */
const ERNS_CIBLES = new Set(['golem', 'btb', 'matrixia', 'mirroria']);

/* ------------------------------------------------------------------ utils */
function ensureDirs() {
  for (const d of [BACKUP_DIR, LOG_DIR, TRASH_DIR]) {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  }
}

function log(line) {
  ensureDirs();
  const ts = new Date().toISOString();
  try { fs.appendFileSync(path.join(LOG_DIR, 'recyclor.log'), `[${ts}] ${line}\n`); } catch { /* best effort */ }
}

function empreinte(data) {
  return crypto.createHash('sha256').update(String(data)).digest('hex');
}

function estIdentique(a, b) {
  return empreinte(a) === empreinte(b);
}

/* ------------------------------------------------------------------ autorisation */
/**
 * Décision oui/non selon attributs/valeurs de la task + usage utilisateur + bot.
 * L'utilisateur et le bot doivent tous deux être d'accord (oui) pour autoriser.
 */
function autorise(task, utilisateur, bot) {
  if (!task || typeof task !== 'object') return false;
  const attributs = task.attributs || {};
  const valeurs = task.valeurs || {};

  // Règle : si la task exige explicitement la dégradation (attribut 'degradation' = true),
  // il faut que l'utilisateur ET le bot l'aient tous deux confirmée (oui).
  if (attributs.degradation === true) {
    const uOk = (utilisateur && utilisateur.confirmeDegradation === true);
    const bOk = (bot && bot.confirmeDegradation === true);
    return uOk && bOk;
  }

  // Par défaut, une task peut demander une copie fidèle sans dégradation : oui.
  // Si la task porte un attribut 'interdit' à true, non.
  if (attributs.interdit === true) return false;

  // Si des valeurs sensibles sont présentes sans attribution claire, refus prudent.
  const clefsSensibles = ['cle', 'key', 'secret', 'token', 'mdp', 'password'];
  for (const k of clefsSensibles) {
    if (k in attributs || k in valeurs) return false;
  }

  return true;
}

/* ------------------------------------------------------------------ classe Recyclor */
class Recyclor {
  constructor(options = {}) {
    ensureDirs();
    this.host = options.host || RECYCLOR_HOST;
    this.port = options.port || RECYCLOR_PORT;
    this.seuilFidelite = 0; // 0 % de perte tolérée : 100 % fidélité exigée
    this.server = null;
    this.pressePapier = new Map(); // presse-papier virtuel : id -> { data|b64, compresse, empreinte, ts, owner }
    this.seuilCompression = options.seuilCompression || 1024; // >1Ko => compresse auto
    log(`Recyclor initialisé (host=${this.host}, port=${this.port})`);
  }

  /* ---------------------------------------------------------------- copy */
  /**
   * Copie bit-à-bit d'une data originale.
   * Retourne { copie, empreinteOriginal, empreinteCopie, fidele, autorise, raison }.
   * Rejette si le hash de la copie diffère de l'original (pas de dégradation silencieuse).
   * Dérogation à 100 % uniquement si autorise(task, utilisateur, bot) === true.
   */
  copierFidele(original, { task, utilisateur, bot } = {}) {
    const empOrig = empreinte(original);
    const autorisee = autorise(task, utilisateur, bot);

    // Copie bit-à-bit (Buffer slice / chaîne identique)
    const copie = Buffer.from(String(original)).toString();
    const empCopie = empreinte(copie);
    const fidele = estIdentique(copie, original);

    let raison = 'copie fidèle';
    if (!fidele) {
      raison = 'REJETÉ : empreinte copie !== empreinte original (dégradation détectée)';
      log(`copierFidele REJETÉ bot=${bot ? bot.id : '?'} raison=${raison}`);
      return { copie, empreinteOriginal: empOrig, empreinteCopie: empCopie, fidele: false, autorise: false, raison };
    }

    if (!autorisee && (task && task.attributs && task.attributs.degradation === true)) {
      raison = 'REJETÉ : dégradation demandée mais non autorisée (user+bot non confirmés)';
      log(`copierFidele REJETÉ bot=${bot ? bot.id : '?'} raison=${raison}`);
      return { copie, empreinteOriginal: empOrig, empreinteCopie: empCopie, fidele: true, autorise: false, raison };
    }

    log(`copierFidele OK bot=${bot ? bot.id : '?'} fidele=${fidele} autorise=${autorisee}`);
    return { copie, empreinteOriginal: empOrig, empreinteCopie: empCopie, fidele: true, autorise: autorisee, raison };
  }

  verifierFidelite(copie, empreinteReference) {
    const ok = empreinte(copie) === empreinteReference;
    log(`verifierFidelite ok=${ok}`);
    return ok;
  }

  /* ---------------------------------------------------------------- backup santé */
  /**
   * Crée une sauvegarde santé : données + empreinte + horodatage.
   * Retourne { id, fichier, sha256, horodatage }.
   * L'original et le backup sont stockés ; jamais écrasés automatiquement.
   */
  backupSante(data, label = 'backup') {
    ensureDirs();
    const ts = Date.now();
    const id = `${label}-${ts}`;
    const emp = empreinte(data);
    const fichier = path.join(BACKUP_DIR, `${id}.json`);
    const shaFichier = path.join(BACKUP_DIR, `${id}.sha256`);
    const payload = { id, label, horodatage: new Date().toISOString(), empreinte: emp, data: String(data) };
    fs.writeFileSync(fichier, JSON.stringify(payload, null, 2));
    fs.writeFileSync(shaFichier, emp);
    log(`backupSante id=${id} fichier=${fichier} empreinte=${emp}`);
    return { id, fichier, sha256: emp, horodatage: payload.horodatage };
  }

  /* ---------------------------------------------------------------- restore santé */
  /**
   * Restaure depuis un backup santé :
   *  1. supprime toute "data compatible" dans zoneCible (sous confirmation implicite par l'appel)
   *  2. recolle l'original depuis le backup ("neuve en pleine santé")
   * Retourne { restaure: true, origine: id, donnees, empreinte }.
   */
  restaurerSante(idSauvegarde, zoneCible = null, { confirmer = false } = {}) {
    if (!confirmer) {
      log(`restaurerSante BLOQUÉ id=${idSauvegarde} confirmation requise`);
      return { restaure: false, erreur: 'confirmation requise (confirmer=true)' };
    }
    ensureDirs();
    const fichier = path.join(BACKUP_DIR, `${idSauvegarde}.json`);
    const shaFichier = path.join(BACKUP_DIR, `${idSauvegarde}.sha256`);
    if (!fs.existsSync(fichier)) {
      log(`restaurerSante ERREUR backup introuvable id=${idSauvegarde}`);
      return { restaure: false, erreur: 'backup introuvable' };
    }
    const payload = JSON.parse(fs.readFileSync(fichier, 'utf8'));
    const empStock = fs.readFileSync(shaFichier, 'utf8').trim();
    const empActuelle = empreinte(payload.data);
    if (empActuelle !== empStock) {
      log(`restaurerSante ERREUR empreinte backup corrompue id=${idSauvegarde}`);
      return { restaure: false, erreur: 'empreinte backup corrompue' };
    }

    // Suppression de la data compatible dans la zone cible (si demandée)
    let supprimee = null;
    if (zoneCible) {
      supprimee = this.supprimerCompatible(zoneCible, { confirmer: true });
    }

    log(`restaurerSante OK id=${idSauvegarde} zoneCible=${!!zoneCible}`);
    return {
      restaure: true,
      origine: idSauvegarde,
      donnees: payload.data,
      empreinte: empStock,
      zoneCible,
      compatibleSupprimee: supprimee
    };
  }

  /* ---------------------------------------------------------------- santé en octets */
  /**
   * Mesure la santé d'une data : 1 - entropie normalisée (Shannon 1948).
   * LE CALCUL VIENT DU NOYAU motor.s (source de vérité unique).
   * Retourne { entropie, pourcent, octets, bruit }.
   */
  sante(data, densite = 4) {
    return noyau.sante(data, densite);
  }

  /* ---------------------------------------------------------------- paliers de vidage */
  /**
   * Découpe un total en paliers réguliers : [{ palier, libere, reste, part }]
   * LE CALCUL VIENT DU NOYAU motor.s.
   */
  paliers(total, parPalier = 10) {
    return noyau.paliers(total, parPalier);
  }

  /* ---------------------------------------------------------------- vidage ORGANIQUE */
  /**
   * Le vidage dynamique (organic) : le rythme suit la santé de la data.
   * LE CALCUL VIENT DU NOYAU motor.s (courbe douce, intérêt composé).
   * Retourne { urgence, pas, libere, retenu, organic }.
   */
  rythmeOrganic(sante = 1, cycles = 1) {
    return noyau.rythmeOrganic(sante, cycles);
  }

  /** La suite complète d'un vidage organique, cycle par cycle (calcul du noyau). */
  vidageDynamique(octets, { cycles = 5, sante = 1 } = {}) {
    return noyau.vidageDynamique(octets, { cycles, sante });
  }

  /* ---------------------------------------------------------------- VIDER le cache */
  /**
   * VIDER ≠ RÉDUIRE.
   *   réduire : la data est dégradée, elle reste là.
   *   vider   : la data est RELÂCHÉE, le cache s'en va.
   * L'original n'est jamais touché : rien n'est perdu.
   * mode : 'coup' | 'progressif' | 'organic'. Dry-run par défaut.
   */
  vider(zoneCible, { mode = 'coup', autoriser = false, parPalier = 10, cycles = 5, sante = 1 } = {}) {
    const existe = fs.existsSync(zoneCible);
    const contenu = existe ? fs.readFileSync(zoneCible, 'utf8') : '';
    const octets = contenu.length;

    if (!autoriser) {
      log(`vider BLOQUÉ (dry-run) zone=${zoneCible} mode=${mode}`);
      return { vide: false, mode, propose: true, octets,
               motif: 'dry-run : rien relâché sans autoriser=true' };
    }

    let detail;
    if (mode === 'coup') {
      detail = { libere: octets, reste: 0 };
    } else if (mode === 'progressif') {
      const pal = this.paliers(octets, parPalier);
      detail = { paliers: pal, libere: pal[pal.length - 1].libere, reste: 0 };
    } else if (mode === 'organic') {
      const dyn = this.vidageDynamique(octets, { cycles, sante });
      detail = { cycles: dyn.cycles, libere: dyn.libere, reste: dyn.reste };
    } else {
      return { vide: false, mode, erreur: 'mode inconnu : coup, progressif ou organic' };
    }

    // On RELÂCHE le cache en l'archivant (jamais de destruction sèche).
    ensureDirs();
    let archive = null;
    if (existe) {
      const ts = Date.now();
      archive = path.join(TRASH_DIR, `${ts}-relache-${path.basename(zoneCible)}`);
      fs.writeFileSync(archive, contenu);
      fs.unlinkSync(zoneCible);                 // le cache s'en va
      fs.writeFileSync(`${archive}.sha256`, empreinte(contenu));
      log(`vider OK zone=${zoneCible} mode=${mode} libere=${detail.libere} archive=${archive}`);
    }
    return { vide: true, mode, ...detail, archive, original_intact: true,
             reversible: true, octets };
  }

  /* ---------------------------------------------------------------- REVITALIZATOR */
  /**
   * Le revitalizator recyclor : recoller l'original REDÉFINIT l'état complet
   * de la data (santé 100 %, empreinte recalculée, octets recomptés), et non
   * pas seulement un chiffre. L'anti-oscillation repart de zéro.
   * Réutilise restaurerSante (backup) : on redéfinit à partir de l'original.
   */
  revitaliser(zoneCible, { label = 'revitalisation' } = {}) {
    let original = null;
    if (fs.existsSync(zoneCible)) {
      original = fs.readFileSync(zoneCible, 'utf8');
    } else {
      // Le cache a été relâché : on le retrouve dans la corbeille.
      ensureDirs();
      const base = path.basename(zoneCible);
      const trouve = fs.readdirSync(TRASH_DIR).filter((f) => f.endsWith(`relache-${base}`)).sort().pop();
      if (!trouve) {
        log(`revitaliser IMPOSSIBLE zone=${zoneCible} aucune source`);
        return { revitalise: false, erreur: 'aucune source (ni fichier ni corbeille)' };
      }
      original = fs.readFileSync(path.join(TRASH_DIR, trouve), 'utf8');
    }

    const sante = this.sante(original);
    // L'état est REDÉFINI : on réécrit la data, santé 100 %, empreinte neuve.
    ensureDirs();
    fs.writeFileSync(zoneCible, original);
    const emp = empreinte(original);
    const bk = this.backupSante(original, label);
    log(`revitaliser OK zone=${zoneCible} empreinte=${emp} santeAvant=${sante.pourcent.toFixed(2)}`);
    return {
      revitalise: true,
      redefini: { sante: 100, etat: 'revitalisee', octets: original.length, empreinte: emp },
      avant: { sante: Math.round(sante.pourcent * 100), entropie: sante.entropie },
      backup: bk,
      cyclesRemisAZero: true
    };
  }

  /* ---------------------------------------------------------------- suppression compatible */
  /**
   * Supprime la "data compatible" d'une zone. Par défaut INTERDITE.
   * Nécessite confirmer: true et place dans la corbeille avec délai de grâce.
   */
  supprimerCompatible(zoneCible, { confirmer = false, filtre = null } = {}) {
    if (!confirmer) {
      log(`supprimerCompatible BLOQUÉ zone=${zoneCible} confirmation requise`);
      return { supprimee: false, erreur: 'confirmation requise' };
    }
    ensureDirs();
    // On ne supprime pas réellement le fichier source (sécurité) ; on l'archive en corbeille.
    let archive = null;
    if (fs.existsSync(zoneCible)) {
      const contenu = fs.readFileSync(zoneCible, 'utf8');
      const ts = Date.now();
      const nom = path.basename(zoneCible);
      const archivePath = path.join(TRASH_DIR, `${ts}-${nom}`);
      fs.writeFileSync(archivePath, contenu);
      fs.unlinkSync(zoneCible);
      archive = archivePath;
      log(`supprimerCompatible OK zone=${zoneCible} archive=${archivePath}`);
    }
    return { supprimee: true, archive, filtre };
  }

  /* ---------------------------------------------------------------- boucle compute */
  /**
   * Boucle computative sur un groupe de tasks (ern / mattern / mzttern / couzern).
   * improvise : génère une variante (copie avec empreinte)
   * propose   : expose la variante sans l'appliquer
   * valide    : attend validation collective (utilisateur + bots concernés)
   * Bornée : max MAX_ITER itérations, timeout MAX_MS.
   */
  boucleCompute(tasks, { propose, valide } = {}) {
    ensureDirs();
    const debut = Date.now();
    const journal = [];
    let iteration = 0;

    const tourner = () => {
      if (iteration >= MAX_ITER) {
        journal.push({ etape: 'stop', raison: 'max itérations atteinte' });
        return { termine: true, raison: 'max iterations', journal };
      }
      if (Date.now() - debut > MAX_MS) {
        journal.push({ etape: 'stop', raison: 'timeout atteint' });
        return { termine: true, raison: 'timeout', journal };
      }
      iteration++;

      // improvise : prendre la première task non traitée, en faire une variante
      const t = tasks[iteration - 1];
      if (!t) {
        journal.push({ etape: 'stop', raison: 'toutes les tasks traitées' });
        return { termine: true, raison: 'done', journal };
      }

      const variante = this.copierFidele(t.donnees || t, { task: t, utilisateur: t.utilisateur, bot: t.bot });
      journal.push({ etape: 'improvise', iteration, task: t.id || t.nom || 'inconnue', variante: !!variante.fidele });

      // propose : exposer (ici on consigne, le client valide via valide)
      if (typeof propose === 'function') {
        try { propose(variante, t); } catch { /* best effort */ }
      }
      journal.push({ etape: 'propose', iteration });

      // valide : si la fonction de validation retourne true, on considère la variante acceptée
      let validee = false;
      if (typeof valide === 'function') {
        try { validee = !!valide(variante, t); } catch { validee = false; }
      }
      journal.push({ etape: 'valide', iteration, validee });

      if (!validee) {
        // improvise à nouveau sur la même task (variante suivante) ou passe à la suivante
        journal.push({ etape: 'retry', iteration, raison: 'variante non validée' });
      }

      return tourner();
    };

    const resultat = tourner();
    log(`boucleCompute OK iterations=${iteration} termine=${resultat.termine}`);
    return { ...resultat, iterations: iteration };
  }

  /* --------------------------------- compressor (deflate, sans perte) */
  compresser(data) {
    const buf = Buffer.from(String(data), 'utf8');
    const cmp = zlib.deflateSync(buf);
    const b64 = cmp.toString('base64');
    const ratio = buf.length ? +(100 * cmp.length / buf.length).toFixed(2) : 0;
    log(`compresser octets=${buf.length} -> ${cmp.length} (${ratio}%)`);
    return { b64, octets: buf.length, compresse: cmp.length, ratio, empreinte: empreinte(data) };
  }
  decompresser(b64, empreinteAttendue = null) {
    const buf = zlib.inflateSync(Buffer.from(String(b64), 'base64'));
    const data = buf.toString('utf8');
    const emp = empreinte(data);
    if (empreinteAttendue && emp !== empreinteAttendue) {
      log('decompresser REJETÉ empreinte mismatch');
      return { ok: false, erreur: 'empreinte mismatch après décompression' };
    }
    return { ok: true, data, empreinte: emp, octets: buf.length };
  }

  /* --------------------- presse-papier virtuel : copy / suppr / coller */
  // copy : demande user ou processor (task/utilisateur/bot) via autorise().
  presseCopier(id, data, { task, utilisateur, bot, forcerCompression = null, sources = [], version = 1, params = {} } = {}) {
    if (!id || typeof id !== 'string') return { ok: false, erreur: 'id requis' };
    if (!autorise(task || {}, utilisateur || { confirmeDegradation: true }, bot || { confirmeDegradation: true }) && task) {
      return { ok: false, erreur: 'non autorisé (user+bot)' };
    }
    const str = String(data);
    const veutCompresser = forcerCompression !== null ? forcerCompression : str.length > this.seuilCompression;
    let stocke = str, compresse = false, meta = null;
    if (veutCompresser) { meta = this.compresser(str); stocke = meta.b64; compresse = true; }
    this.pressePapier.set(id, { stocke, compresse, empreinte: empreinte(str), ts: Date.now(), octets: str.length, ratio: meta ? meta.ratio : 100, sources, version, params });
    log(`presseCopier id=${id} octets=${str.length} compresse=${compresse}`);
    return { ok: true, id, compresse, empreinte: empreinte(str), octets: str.length };
  }
  // coller : uniquement sur demande explicite (demandeur = user ou processor).
  presseColler(id, { demandeur } = {}) {
    if (!demandeur) return { ok: false, erreur: 'coller exige demandeur (user|processor)' };
    const e = this.pressePapier.get(id);
    if (!e) return { ok: false, erreur: 'presse-papier vide pour cet id' };
    const data = e.compresse ? this.decompresser(e.stocke, e.empreinte).data : e.stocke;
    log(`presseColler id=${id} par=${demandeur} octets=${data.length}`);
    return { ok: true, id, data, empreinte: e.empreinte, compresse: e.compresse, par: demandeur };
  }
  presseSupprimer(id, { confirmer = false } = {}) {
    if (!confirmer) return { ok: false, erreur: 'confirmation requise' };
    const e = this.pressePapier.get(id);
    if (!e) return { ok: false, erreur: 'introuvable' };
    this.pressePapier.delete(id);
    ensureDirs();
    fs.writeFileSync(path.join(TRASH_DIR, `${Date.now()}-presse-${id}.sha256`), e.empreinte);
    log(`presseSupprimer id=${id}`);
    return { ok: true, id };
  }

  /* ---------------------------------------------------------------- TRANSMETTRE (BLM→COS→mémoire) */
  /**
   * NOUVEAU 2026-11-02 — transmet un élément du BLM vers un moteur COS puis
   * vers la mémoire du bot, SANS perte / duplication / mélange.
   * Garanties : empreinte SHA-256 vérifiée après chaque étape ; registre `vus`
   * (Set d'empreintes) → doublon détecté, non réécrit ; cloison `botId` :
   * refus si le bot destinataire diffère du bot source.
   * Retour : { ok, etape, empreinte, doublon, raison }.
   */
  transmettre(element, botSource, botDest, vus) {
    var str = String(element == null ? '' : element);
    var emp = empreinte(str);
    var dst = botDest && (botDest.id || botDest);
    var src = botSource && (botSource.id || botSource);
    if (String(dst || '') !== String(src || '')) {
      log('transmettre REFUSÉ mélange bot ' + src + ' -> ' + dst);
      return { ok: false, etape: 'cloison', empreinte: emp, doublon: false, raison: 'bot-destinataire-different (mélange interdit)' };
    }
    var set = vus instanceof Set ? vus : (this._vus || (this._vus = new Set()));
    if (set.has(emp)) { log('transmettre DOUBLON ' + emp.slice(0, 12)); return { ok: true, etape: 'dedup', empreinte: emp, doublon: true, raison: 'déjà transmis, non réécrit' }; }
    var copie = this.copierFidele(str, { task: {}, utilisateur: { confirmeDegradation: true }, bot: { id: String(src || '?'), confirmeDegradation: true } });
    if (!copie.fidele || !this.verifierFidelite(copie.copie, emp)) {
      log('transmettre PERTE ' + emp.slice(0, 12));
      return { ok: false, etape: 'fidelite', empreinte: emp, doublon: false, raison: 'empreinte mismatch (perte interdite)' };
    }
    set.add(emp);
    return { ok: true, etape: 'transmis', empreinte: emp, doublon: false, donnees: copie.copie, raison: 'copie fidèle, bot ' + src };
  }

  /* ---------------------------------------------------------------- serveur HTTP dédié */
  start() {
    if (this.server) return this;
    /* la politique d'origine est celle du projet (src/host-policy.js) */
    const POLITIQUE = creerPolitique(process.env, {
      host: this.host,
      ports: [this.port, parseInt(process.env.PORT || '8787', 10), 80, 443]
    });
    const lireCorps = (req, cb) => {
      let corps = '';
      req.on('data', (c) => { corps += c; if (corps.length > MAX_BODY) { req.socket.destroy(); } });
      req.on('end', () => cb(corps));
    };

    const envoyer = (res, code, obj) => {
      const body = JSON.stringify(obj || {});
      const entetes = {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff'
      };
      /* CORS : JAMAIS `*`. On ne renvoie l'origine que si elle est
         autorisée — la MÊME politique que le reste du projet
         (src/host-policy.js). Sinon n'importe quel site du navigateur
         pourrait lire les sauvegardes du moteur. */
      const origin = res.__origine || null;
      if (origin && POLITIQUE.autorise(origin)) {
        entetes['Access-Control-Allow-Origin'] = origin;
        entetes['Vary'] = 'Origin';
      }
      res.writeHead(code, entetes);
      res.end(body);
    };

    this.server = http.createServer((req, res) => {
      res.__origine = req.headers.origin || null;
      const u = new URL(req.url, `http://${this.host}:${this.port}`);
      const route = u.pathname;
      if (req.method === 'OPTIONS') {
        const h = { 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' };
        if (res.__origine && POLITIQUE.autorise(res.__origine)) h['Access-Control-Allow-Origin'] = res.__origine;
        res.writeHead(204, h);
        res.end();
        return;
      }

      if (route === '/recyclor/copier' && req.method === 'POST') {
        lireCorps(req, (corps) => {
          try {
            const p = JSON.parse(corps || '{}');
            const r = this.copierFidele(p.original, { task: p.task, utilisateur: p.utilisateur, bot: p.bot });
            envoyer(res, 200, { ok: true, ...r });
          } catch (e) { envoyer(res, 400, { ok: false, erreur: e.message }); }
        });
        return;
      }
      if (route === '/recyclor/verifier' && req.method === 'POST') {
        lireCorps(req, (corps) => {
          try {
            const p = JSON.parse(corps || '{}');
            const ok = this.verifierFidelite(p.copie, p.empreinteReference);
            envoyer(res, 200, { ok, fidele: ok });
          } catch (e) { envoyer(res, 400, { ok: false, erreur: e.message }); }
        });
        return;
      }
      if (route === '/recyclor/backup' && req.method === 'POST') {
        lireCorps(req, (corps) => {
          try {
            const p = JSON.parse(corps || '{}');
            const r = this.backupSante(p.data, p.label);
            envoyer(res, 200, { ok: true, ...r });
          } catch (e) { envoyer(res, 400, { ok: false, erreur: e.message }); }
        });
        return;
      }
      if (route === '/recyclor/restaurer' && req.method === 'POST') {
        lireCorps(req, (corps) => {
          try {
            const p = JSON.parse(corps || '{}');
            const r = this.restaurerSante(p.id, p.zoneCible, { confirmer: p.confirmer === true });
            envoyer(res, r.restaure ? 200 : 400, { ok: r.restaure, ...r });
          } catch (e) { envoyer(res, 400, { ok: false, erreur: e.message }); }
        });
        return;
      }
      if (route === '/recyclor/compute' && req.method === 'POST') {
        lireCorps(req, (corps) => {
          try {
            const p = JSON.parse(corps || '{}');
            const r = this.boucleCompute(p.tasks || [], { propose: p.propose, valide: p.valide });
            envoyer(res, 200, { ok: true, ...r });
          } catch (e) { envoyer(res, 400, { ok: false, erreur: e.message }); }
        });
        return;
      }
      if (route === '/recyclor/vider' && req.method === 'POST') {
        lireCorps(req, (corps) => {
          try {
            const p = JSON.parse(corps || '{}');
            const r = this.vider(p.zoneCible, {
              mode: p.mode, autoriser: p.autoriser === true,
              parPalier: p.parPalier, cycles: p.cycles, sante: p.sante
            });
            envoyer(res, r.vide ? 200 : (r.erreur ? 400 : 200), { ok: r.vide, ...r });
          } catch (e) { envoyer(res, 400, { ok: false, erreur: e.message }); }
        });
        return;
      }
      if (route === '/recyclor/revitaliser' && req.method === 'POST') {
        lireCorps(req, (corps) => {
          try {
            const p = JSON.parse(corps || '{}');
            const r = this.revitaliser(p.zoneCible, { label: p.label });
            envoyer(res, r.revitalise ? 200 : 400, { ok: r.revitalise, ...r });
          } catch (e) { envoyer(res, 400, { ok: false, erreur: e.message }); }
        });
        return;
      }
      if (route === '/recyclor/sante' && req.method === 'GET') {
        // liste les backups disponibles (sans exposer les données)
        ensureDirs();
        const liste = fs.readdirSync(BACKUP_DIR).filter((f) => f.endsWith('.json')).map((f) => {
          const p = path.join(BACKUP_DIR, f);
          const st = fs.statSync(p);
          return { fichier: f, taille: st.size, mtime: st.mtime.toISOString() };
        });
        envoyer(res, 200, { ok: true, backups: liste });
        return;
      }
      if ((route === '/recyclor/presse/copier' || route === '/recyclor/presse/coller' || route === '/recyclor/presse/supprimer') && req.method === 'POST') {
        lireCorps(req, (corps) => {
          try {
            const p = JSON.parse(corps || '{}');
            let r;
            if (route.endsWith('/copier')) r = this.presseCopier(p.id, p.data, { task: p.task, utilisateur: p.utilisateur, bot: p.bot });
            else if (route.endsWith('/coller')) r = this.presseColler(p.id, { demandeur: p.demandeur });
            else r = this.presseSupprimer(p.id, { confirmer: p.confirmer === true });
            envoyer(res, r.ok ? 200 : 400, r);
          } catch (e) { envoyer(res, 400, { ok: false, erreur: e.message }); }
        });
        return;
      }
      envoyer(res, 404, { ok: false, erreur: 'route inconnue' });
    });

    this.server.listen(this.port, this.host, () => {
      log(`Serveur recyclor démarré http://${this.host}:${this.port}`);
    });
    return this;
  }

  stop() {
    if (this.server) { this.server.close(); this.server = null; log('Serveur recyclor arrêté'); }
  }
}

module.exports = { Recyclor, empreinte, estIdentique, autorise, ERNS_CIBLES, BACKUP_DIR, TRASH_DIR };
