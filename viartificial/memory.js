/* Mémoire locale par SuperBot — localStorage, aucun réseau, aucune activité inventée.
   Le carnet démarre VIDE : seules les entrées explicitement enregistrées (utilisateur
   ou « proposer au carnet » confirmé) y figurent. Séparation confirmé / proposé.
   Réglages Geeko/Geekette indépendants ; progression calculée des seuls enregistrements. */
(function (global) {
  'use strict';
  var P = 'via-mem-v1:', PS = 'via-set-v1:';
  function read(k, fb) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? fb : v; } catch (e) { return fb; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function entries(bot) { var a = read(P + bot, []); return Array.isArray(a) ? a : []; }
  function persist(bot, a) { write(P + bot, a); }
  function add(bot, type, text, status) {
    var a = entries(bot);
    var e = { id: 'm' + Date.now().toString(36) + Math.floor(Math.random() * 999), type: type, text: String(text || '').slice(0, 2000), status: status === 'confirmed' ? 'confirmed' : 'proposed', at: new Date().toISOString() };
    if (!e.text.trim()) return null;
    a.push(e); persist(bot, a); return e;
  }
  function confirm(bot, id) { var a = entries(bot), f = false; a.forEach(function (e) { if (e.id === id) { e.status = 'confirmed'; f = true; } }); if (f) persist(bot, a); return f; }
  function correct(bot, id, text) { var a = entries(bot), f = false; a.forEach(function (e) { if (e.id === id) { e.text = String(text).slice(0, 2000); f = true; } }); if (f) persist(bot, a); return f; }
  function remove(bot, id) { persist(bot, entries(bot).filter(function (e) { return e.id !== id; })); }
  function clearBot(bot) { try { localStorage.removeItem(P + bot); } catch (e) {} }
  function exportBot(bot) { return JSON.stringify({ bot: bot, exportedAt: new Date().toISOString(), entries: entries(bot), settings: settings(bot) }, null, 2); }
  function settings(bot) { return read(PS + bot, { skill: 3, initiative: 3, advice: 'equilibre', persona: '' }); }
  function saveSettings(bot, s) { write(PS + bot, { skill: +s.skill || 3, initiative: +s.initiative || 3, advice: s.advice || 'equilibre', persona: String(s.persona || '').slice(0, 500) }); }
  function progression(bot) {
    var byType = {}, conf = 0, prop = 0;
    entries(bot).forEach(function (e) { byType[e.type] = (byType[e.type] || 0) + 1; if (e.status === 'confirmed') conf++; else prop++; });
    return { total: conf + prop, confirmed: conf, proposed: prop, byType: byType };
  }
  global.ViaMemory = { entries: entries, add: add, confirm: confirm, correct: correct, remove: remove, clearBot: clearBot, exportBot: exportBot, settings: settings, saveSettings: saveSettings, progression: progression };
})(window);
