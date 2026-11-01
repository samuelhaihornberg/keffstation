/* Moteur LLM en Web Worker — Transformers.js v3 sur CPU/WASM (AUCUN WebGPU/WebLLM).
   Docs officielles (huggingface.co/docs/transformers.js v3 : api/pipelines,
   api/env) : pipeline text-generation, messages [{role,content}],
   TextStreamer(skip_prompt), progress_callback, env.useBrowserCache.
   - Importe le runtime depuis CDN (mise en cache HTTP navigateur).
   - Inférence HORS thread principal : l'interface reste réactive.
   - Sans COOP/COEP (GitHub Pages ne définit pas ces en-têtes), ONNX Runtime utilise
     WASM monothread automatiquement (pas de SharedArrayBuffer requis).
   - Annulation du téléchargement : terminaison du worker côté client
     (3.7.2 : pas de env.fetch, coupure par terminaison du worker) ;
     annulation en génération : worker terminé côté client, rien ne redémarre seul. */
import { pipeline, TextStreamer, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2/+esm';

// Docs officielles transformers.js v3 (huggingface.co/docs/transformers.js :
// api/pipelines + api/env) : pipeline('text-generation', id, { device:'wasm',
// dtype:'q4', progress_callback }), messages [{role,content}],
// TextStreamer(tokenizer,{skip_prompt,skip_special_tokens,callback_function}).
env.allowLocalModels = false;
env.useBrowserCache = true; // vérifié : clé existante en 3.7.2 (useWasmCache/fetch absents).
// GitHub Pages sans COOP/COEP : pas de SharedArrayBuffer → 1 thread explicite.
// Vérifié 3.7.2 : le runtime lit numThreads sur l'objet wasm existant ; on le
// mute en place (jamais remplacé, pour conserver wasmPaths/proxy).
try { if (env.backends && env.backends.onnx && env.backends.onnx.wasm) env.backends.onnx.wasm.numThreads = 1; } catch (e) {}

var OFFICIAL_SMOLLM2_TEMPLATE = "{% for message in messages %}{% if loop.first and messages[0]['role'] != 'system' %}{{ '<|im_start|>system\nYou are a helpful AI assistant named SmolLM, trained by Hugging Face<|im_end|>\n' }}{% endif %}{{'<|im_start|>' + message['role'] + '\n' + message['content'] + '<|im_end|>' + '\n'}}{% endfor %}{% if add_generation_prompt %}{{ '<|im_start|>assistant\n' }}{% endif %}";
/* Template ci-dessus = officiel HuggingFaceTB/SmolLM2-360M-Instruct
   (tokenizer_config.json, 368 car., vérifié 2026-10-31, identique dans
   onnx-community/SmolLM2-360M-Instruct-ONNX) : restauré tel quel si absent,
   jamais inventé. Sans chat_template : erreur NO_CHAT_TEMPLATE, pas de format maison. */

var pipe = null, picked = null, ctl = null;
var tokInfo = { source: 'inconnu', hasTemplate: false };
// Vérifié 3.7.2 : le runtime n'expose PAS env.fetch — aucun enveloppement
// possible. Annulation du téléchargement = terminaison du worker côté client
// (ViaWasmEngine.cancel) : le navigateur interrompt les fetch en vol, les
// promesses rejettent ABORTED, RIEN ne redémarre seul. Ici 'cancel' ne fait
// qu'abandonner la boucle d'essais si elle n'a pas commencé son fetch.

function send(id, msg) { postMessage(Object.assign({ id: id }, msg)); }

onmessage = async function (e) {
  var m = e.data || {}, id = m.id, cmd = m.cmd, p = m.payload || {};
  try {
    if (cmd === 'load') {
      ctl = new AbortController();
      var ids = p.modelId ? [p.modelId] : (p.candidates || []);
      var lastErr = null;
      for (var i = 0; i < ids.length; i++) {
        if (ctl.signal.aborted) throw { code: 'ABORTED', name: 'AbortError', message: 'Annulé à ta demande.' };
        var seen = {};
        try {
          send(id, { type: 'stage', group: 'runtime', phase: 'downloading', progress: 5, detail: 'runtime Transformers.js (CPU/WASM)… essai ' + (i + 1) + '/' + ids.length + ' : ' + ids[i] });
          var prog = function (r) {
            if (!r) return;
            if (r.status === 'progress') {
              var key = r.file || 'fichier'; seen[key] = { loaded: r.loaded || 0, total: r.total || 0 };
              var L = 0, Tt = 0; for (var k in seen) { L += seen[k].loaded; Tt += seen[k].total; }
              var pct = Tt > 0 ? Math.round(L / Tt * 100) : (typeof r.progress === 'number' ? Math.round(r.progress * 100) : 0);
              send(id, { type: 'progress', group: 'poids', progress: pct, detail: key + ' ' + pct + ' %' });
            } else if (r.status === 'done' || r.status === 'ready') { send(id, { type: 'progress', group: 'poids', progress: 100, detail: (r.file || 'fichier') + ' OK' }); }
          };
          var pl = await pipeline('text-generation', ids[i], { device: 'wasm', dtype: 'q4', progress_callback: prog });
          // dtype 'q4' vérifié : fichiers model_q4.onnx des distributions
          // onnx-community ci-dessus ; device 'wasm' = CPU monothread ici.
          pipe = pl; picked = ids[i]; lastErr = null; break;
        } catch (err) {
          lastErr = err; pipe = null;
          if (err && (err.name === 'AbortError' || err.code === 'ABORTED')) throw err;
          // Sinon cascade vers le candidat suivant (petit→grand), une fois chacun.
        }
      }
      if (!pipe) throw { code: 'LOAD_FAIL', message: 'Modèle CPU indisponible : ' + ((lastErr && lastErr.message) || 'échec') + '. Vérifie la connexion, puis Réessaie (une seule tentative à la fois).' };
      try {
        if (pipe.tokenizer && pipe.tokenizer.chat_template) { tokInfo = { source: 'distribué avec le modèle', hasTemplate: true }; }
        else if (pipe.tokenizer && /SmolLM2/i.test(picked || '')) { pipe.tokenizer.chat_template = OFFICIAL_SMOLLM2_TEMPLATE; tokInfo = { source: 'officiel restauré (HuggingFaceTB/SmolLM2-360M-Instruct)', hasTemplate: !!pipe.tokenizer.chat_template }; }
        else if (pipe.tokenizer) { tokInfo = { source: 'absent de la distribution (' + picked + ')', hasTemplate: false }; }
        else { tokInfo = { source: 'tokenizer introuvable', hasTemplate: false }; }
      } catch (err2) { tokInfo = { source: 'restauration impossible : ' + (err2 && err2.message), hasTemplate: false }; }
      if (!tokInfo.hasTemplate) throw { code: 'NO_CHAT_TEMPLATE', message: 'Template de conversation absent pour ' + picked + ' : génération impossible sans inventer de format.' };
      send(id, { type: 'ready', model: picked, tokenizer: tokInfo.source });
    } else if (cmd === 'chat') {
      if (!pipe) throw { code: 'NOT_LOADED', message: 'Modèle non chargé.' };
      if (!pipe.tokenizer || !pipe.tokenizer.chat_template) throw { code: 'NO_CHAT_TEMPLATE', message: 'Template de conversation absent pour ' + (picked || 'ce modèle') + ' : recharge le modèle.' };
      var stream = null;
      try {
        stream = new TextStreamer(pipe.tokenizer, { skip_prompt: true, skip_special_tokens: true, callback_function: function (t) { send(id, { type: 'token', text: t }); } });
      } catch (err3) { stream = null; }
      // Contexte court + réponses courtes (mobile) : 4 derniers messages,
      // 64 tokens max. Historiques complets conservés en localStorage (intacts).
      var out = await pipe(p.messages.slice(-4), { max_new_tokens: 64, temperature: 0.7, do_sample: true, top_p: 0.9, streamer: stream });
      var g = out && out[0] && out[0].generated_text, t = '';
      if (Array.isArray(g)) { var last = g[g.length - 1]; t = (last && (last.content || last.text)) || ''; }
      else if (typeof g === 'string') { t = g; }
      t = String(t).trim();
      if (!t) throw { code: 'EMPTY', message: 'Réponse vide du moteur.' };
      send(id, { type: 'done', text: t });
    } else if (cmd === 'cancel') {
      if (ctl) { try { ctl.abort(); } catch (e) {} }
      send(id, { type: 'cancelled' });
    } else if (cmd === 'unload') {
      pipe = null; picked = null;
      send(id, { type: 'done' });
    } else {
      throw { code: 'UNKNOWN_CMD', message: 'Commande inconnue : ' + cmd };
    }
  } catch (err) {
    var code = (err && err.code) || 'ERROR';
    if (code === 'ERROR' && err && err.name === 'AbortError') code = 'ABORTED';
    send(id, { type: 'error', code: code, message: (err && err.message) || String(err) });
  }
};
