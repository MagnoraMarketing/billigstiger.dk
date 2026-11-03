#!/usr/bin/env bash
# Crawl → keep only ladders → same prices as reference → validate & import into data/products.json.
# Usage: npm run sync:ladders [-- https://www.stigefabrikken.dk/stiger]
set -euo pipefail
cd "$(dirname "$0")/.."
URL="${1:-https://www.stigefabrikken.dk/stiger}"
[ -d scraper/node_modules ] || PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm --prefix scraper install
[ -z "${CHROMIUM_PATH:-}" ] && [ -x /opt/pw-browsers/chromium ] && export CHROMIUM_PATH=/opt/pw-browsers/chromium
rm -f data/research/*.json 2>/dev/null || true
node scraper/src/crawl.mjs "$URL" --max="${MAX_REQUESTS:-3000}"
RESEARCH=$(ls -t data/research/*.json | grep -v skipped | head -1)
node scraper/src/report.mjs "$RESEARCH" > data/research/report.md
node scripts/research-to-import.mjs "$RESEARCH" --price-factor="${PRICE_FACTOR:-1}" > data/research/import.csv
node scripts/import-products.mjs data/research/import.csv
echo "Færdig. Rapport: data/research/report.md – commit data/products.json for at gå live."
