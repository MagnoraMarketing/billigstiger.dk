# BilligeStiger.dk

Webshop for stiger, stilladser og tilbehør – bygget til Preben.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Crawlee + Playwright (research crawler) · Vercel.
**Ingen database:** Sortimentet ligger i `data/products.json` (versioneret i git), og ordrer sendes pr. e-mail og/eller webhook.

## Kom i gang

```bash
npm install
cp .env.example .env.local   # udfyld efter behov
npm run dev                  # http://localhost:3000
```

| Kommando | Formål |
| --- | --- |
| `npm run dev` / `build` / `start` | Udvikling / produktionsbuild |
| `npm run lint` · `npm run typecheck` | ESLint og TypeScript |
| `npm test` | Vitest (filtre, ordreberegning) + import-tests |
| `npm run import:products -- fil.csv` | Importér sortiment til `data/products.json` |
| `npm run crawl -- <url> [--max=500]` | Markedsresearch-crawl (kræver `npm --prefix scraper install`) |
| `npm run research:report -- data/research/<fil>.json` | Rapport over kategorier, priser, filtre |

## Funktioner

- **Forside** med kategorier, fra-priser, udvalgte produkter og guides.
- **Kategorisider** (`/kategori/[slug]`) og **alle stiger** (`/stiger`) med URL-baserede filtre: arbejdshøjde, pris, materiale, min. belastning, mærke, professionel (EN 131), lagerstatus – samt sortering (pris, højde, navn) og sidenummerering.
- **Søgning** (`/soeg`) på navn, varenr., mærke, materiale – flere ord, accent-uafhængigt.
- **Produktside** med specifikationstabel, egenskaber, relaterede størrelser, lagerstatus og Product JSON-LD.
- **Kurv** (localStorage) og **kasse** med validering (zod), honeypot, simpel rate-limit. Priser og fragt beregnes altid på serveren.
- **SEO:** metadata pr. side, canonical, `sitemap.xml`, `robots.txt`, BreadcrumbList/Product/OnlineStore JSON-LD, danske URL’er, `NEXT_PUBLIC_NOINDEX` til staging.
- **Indhold:** guides (valg af stige, EN 131, sikkerhed), kontakt, fragt, handelsbetingelser og privatlivspolitik (skabeloner).
- Egne SVG-illustrationer bruges som produktbilleder, indtil licenserede leverandørbilleder er importeret.
- Responsivt (testet ved 390 px og 1280 px uden vandret scroll), tilgængelighed (skip-link, labels, aria-live, fokusmarkering), sikkerhedsheaders.

## Sortiment / data

1. **Demo-sortiment:** Så længe `data/products.json` er tom (`[]`), vises et tydeligt mærket demo-sortiment (`src/data/demo-products.ts`) med et banner øverst. Demo-priser er *ikke* rigtige, demo-sider er `noindex`, og ordrer afvises.
2. **Rigtigt sortiment:** Udfyld en CSV efter `data/import-template.csv` (kolonner: sku, name, brand, category, price, stock, specs, features `|`-separeret, images `|`-separeret, related_skus …) og kør:
   ```bash
   npm run import:products -- leverandoer.csv --dry-run
   npm run import:products -- leverandoer.csv
   ```
   Importen validerer kategorier, priser, dubletter m.m. og afviser hele filen ved fejl. Commit `data/products.json` og push → Vercel deployer automatisk.
3. Kategorier redigeres i `src/lib/categories.ts`.

> Brug kun tekster og billeder, I har ret til (egne eller leverandørlicenserede). Konkurrenters tekster/billeder må ikke kopieres ind.

## Ordrer (uden database)

`POST /api/orders` validerer ordren, genberegner priser fra kataloget og leverer den via:

- **E-mail (Resend):** `RESEND_API_KEY` + `ORDER_NOTIFICATION_EMAIL` (+ `ORDER_FROM_EMAIL` på et verificeret domæne). Kunden får en kopi.
- **Webhook:** `ORDER_WEBHOOK_URL` (fx Zapier/Make → Google Sheets, e-conomic, Dinero). Valgfri `ORDER_WEBHOOK_SECRET` sendes som `X-Webhook-Secret`.

Er ingen kanal sat op, afvises ordren med en venlig fejl (der går aldrig en ordre tabt i stilhed). Betaling håndteres i dag via ordrebekræftelse/faktura – online kortbetaling (fx Stripe, Quickpay, Reepay) kan tilføjes senere.

## Markedsresearch-crawler (`scraper/`)

Separat pakke (indgår ikke i Vercel-buildet) bygget på **Crawlee + Playwright**:

- Respekterer `robots.txt`, max 2 samtidige forespørgsler / 30 pr. minut, holder sig til samme host og stige-sektionen.
- Udtrækker produkter via schema.org JSON-LD med DOM-fallback (h1 + pris + specifikationstabel): navn, varenr., mærke, pris, lagerstatus, brødkrummer/kategori, rå + normaliserede specifikationer (arbejdshøjde, længder, trin, sektioner, belastning, vægt, materiale, standard), varianter. Fra listesider registreres sortering, filtergrupper og antal produktlinks.
- Billeder downloades **ikke** – kun URL’er registreres som reference.
- Output: `data/research/<host>-<dato>.json` (git-ignoreret, kun til intern analyse).

```bash
npm --prefix scraper install
CHROMIUM_PATH=/sti/til/chromium npm run crawl -- https://www.stigefabrikken.dk/stiger --max=1500
npm run research:report -- data/research/www.stigefabrikken.dk-YYYY-MM-DD.json
npm --prefix scraper test
```

## Deployment (Vercel)

1. Importér GitHub-repoet i Vercel (framework: Next.js, ingen ekstra build-indstillinger).
2. Sæt miljøvariabler fra `.env.example` (mindst `NEXT_PUBLIC_NOINDEX=1` indtil lancering).
3. **Domæne senere:** Tilføj `billigestiger.dk` under *Project → Domains*, peg DNS (A `76.76.21.21` / CNAME `cname.vercel-dns.com`) og sæt `NEXT_PUBLIC_SITE_URL=https://billigestiger.dk`. Alle canonical-URL’er, sitemap og JSON-LD følger automatisk med.

## Udestående (kræver ejer/adgang)

- [ ] Konkurrent-crawl: `stigefabrikken.dk` var blokeret i udviklingsmiljøets netværk – kør crawleren lokalt (se ovenfor).
- [ ] Rigtigt sortiment, priser og licenserede billeder fra leverandør → `npm run import:products`.
- [ ] Firmaoplysninger (CVR, adresse, telefon) i miljøvariabler.
- [ ] Gennemgang af handelsbetingelser og privatlivspolitik (skabeloner).
- [ ] Resend-konto + verificeret afsenderdomæne, eller webhook-URL, så ordrer kan modtages.
- [ ] Evt. online betaling (Stripe/Quickpay) – kræver konto hos udbyder.
- [ ] Vercel-projekt og domæne-DNS.
