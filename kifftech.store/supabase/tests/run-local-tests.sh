#!/usr/bin/env bash
# Tests locaux des fonctions de paiement : PayPal et PostgREST simulés, aucune requête réelle, aucun secret.
# Usage (depuis kifftech.store/) : bash supabase/tests/run-local-tests.sh   (nécessite deno)
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
WORK="$(mktemp -d)"
trap 'kill "$PID" 2>/dev/null || true; rm -rf "$WORK"' EXIT
cp -r "$ROOT/supabase/functions" "$WORK/functions"
# Conditions de TEST fictives (le vrai data/legal.js reste vide tant que les conditions ne sont pas publiées).
cat > "$WORK/functions/_shared/legal.js" <<'JS'
export const LEGAL = { termsUrl: 'https://example.invalid/test-conditions', privacyUrl: '', termsVersion: 'TEST-v1', termsDate: '2026-01-01', termsValidated: true };
JS
cp "$HERE/mock-server.ts" "$WORK/server.ts"
cp "$HERE/payment-flow.test.mjs" "$WORK/test.mjs"
(cd "$WORK" && deno run --no-lock -A server.ts > server.log 2>&1) & PID=$!
for _ in $(seq 1 30); do curl -s -o /dev/null http://127.0.0.1:8787/__state && break; sleep 1; done
(cd "$WORK" && node test.mjs)
