// Copie les modules partagés (panier/recalcul, catalogue, conditions) vers supabase/functions/_shared.
// Usage : node tools/sync-supabase-shared.mjs          (écrit les copies)
//         node tools/sync-supabase-shared.mjs --check  (échoue si une copie diverge)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const map = [
  ['lib/payment-core.js', 'supabase/functions/_shared/payment-core.js'],
  ['data/catalogue.js', 'supabase/functions/_shared/catalogue.js'],
  ['data/legal.js', 'supabase/functions/_shared/legal.js'],
];
const check = process.argv.includes('--check');
let drift = false;
for (const [src, dst] of map) {
  const out = `// COPIE GÉNÉRÉE depuis ${src} — ne pas éditer. Régénérer : npm run sync:supabase\n` + readFileSync(join(root, src), 'utf8');
  let current = '';
  try { current = readFileSync(join(root, dst), 'utf8'); } catch { /* absent */ }
  if (current === out) continue;
  drift = true;
  if (check) console.log(`Divergence : ${dst}`);
  else { writeFileSync(join(root, dst), out); console.log(`Synchronisé : ${dst}`); }
}
if (check && drift) process.exit(1);
if (check && !drift) console.log('Copies Supabase à jour.');
