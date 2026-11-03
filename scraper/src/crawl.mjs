/**
 * BilligeStiger.dk market-research crawler.
 *
 * Crawls a ladder catalogue (default: https://www.stigefabrikken.dk/stiger) and
 * records categories, product names, product numbers, brands, prices, specs,
 * variants and related links for COMPETITOR ANALYSIS / PRICE COMPARISON.
 *
 * Rules (enforced in code):
 *  - robots.txt is respected (Crawlee `respectRobotsTxtFile`).
 *  - Low concurrency + delay between requests.
 *  - Only the configured host is crawled.
 *  - Images are NOT downloaded; only their URLs are recorded for reference.
 *  - Output is research data. Do not republish competitor texts or images in the
 *    shop — product content must come from suppliers / own copy.
 *
 * Usage:
 *   npm run crawl -- [startUrl] [--max=500]
 *   CHROMIUM_PATH=/path/to/chromium npm run crawl
 * Output: ../data/research/<host>-<date>.json
 */
import { PlaywrightCrawler, Configuration } from "crawlee";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalUrl, findJsonLdProduct, normalizeSpecs, parsePriceOre } from "./normalize.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const startUrl = args.find((a) => a.startsWith("http")) || process.env.START_URL || "https://www.stigefabrikken.dk/stiger";
const maxRequests = Number(args.find((a) => a.startsWith("--max="))?.split("=")[1] || process.env.MAX_REQUESTS || 1500);
const host = new URL(startUrl).host;
const scope = new URL(startUrl);

const products = new Map();
const pick = (obj, re) => Object.entries(obj || {}).find(([k]) => re.test(k.trim()))?.[1] || null;
const categories = new Map();

const config = new Configuration({ persistStorage: false });

const crawler = new PlaywrightCrawler(
  {
    maxConcurrency: 2,
    maxRequestsPerMinute: 30,
    maxRequestsPerCrawl: maxRequests,
    respectRobotsTxtFile: true,
    requestHandlerTimeoutSecs: 60,
    launchContext: {
      launchOptions: {
        headless: true,
        ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
      },
      userAgent: process.env.CRAWLER_USER_AGENT || "BilligeStigerResearchBot/1.0 (+market research; low rate)",
    },
    preNavigationHooks: [
      async ({ page }) => {
        // Skip heavy assets – we only need HTML/DOM.
        await page.route("**/*.{png,jpg,jpeg,webp,gif,svg,woff,woff2,mp4}", (r) => r.abort());
      },
    ],
    async requestHandler({ page, request, enqueueLinks, log }) {
      await page.waitForLoadState("domcontentloaded");
      // Accept/close cookie banners if present (no consent is stored beyond this session).
      await page.locator('button:has-text("Accepter"), button:has-text("Tillad alle")').first().click({ timeout: 1500 }).catch(() => {});

      const raw = await page.evaluate(() => {
        const text = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
        const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent);
        const meta = (p) => document.querySelector(`meta[property="${p}"],meta[name="${p}"]`)?.getAttribute("content") || null;
        const breadcrumbs = [...document.querySelectorAll('[class*="breadcrumb"] a, nav[aria-label*="rød"] a, nav[aria-label*="readcrumb"] a')].map(text).filter(Boolean);

        // Generic spec-table extraction: <table> rows and <dl> pairs.
        const specs = {};
        document.querySelectorAll("table tr").forEach((tr) => {
          const cells = tr.querySelectorAll("th,td");
          if (cells.length === 2) specs[text(cells[0])] = text(cells[1]);
        });
        document.querySelectorAll("dl").forEach((dl) => {
          const dts = dl.querySelectorAll("dt");
          dts.forEach((dt) => {
            const dd = dt.nextElementSibling;
            if (dd && dd.tagName === "DD") specs[text(dt)] = text(dd);
          });
        });

        const priceRe = /^(?:DKK\s*)?\d{1,3}(?:[.\s]\d{3})*(?:,\d{2})?\s*(?:kr\.?|,-|DKK)$/i;
        const priceEl =
          document.querySelector('[itemprop="price"], [class*="price"]:not([class*="old"]):not([class*="before"])') ||
          [...document.querySelectorAll("main p, main span, main div")].find((el) => el.children.length === 0 && priceRe.test(text(el)));
        const variantOptions = [...document.querySelectorAll("select option")].map(text).filter((t) => t && !/vælg/i.test(t)).slice(0, 50);

        return {
          title: document.title,
          h1: text(document.querySelector("h1")),
          jsonLd,
          ogImage: meta("og:image"),
          description: meta("description"),
          breadcrumbs,
          specs,
          priceText: priceEl ? priceEl.getAttribute("content") || text(priceEl) : null,
          variantOptions,
          sortOptions: [...document.querySelectorAll('select[name*="sort"] option, [class*="sort"] option')].map(text),
          filterGroups: [...document.querySelectorAll('[class*="filter"] legend, [class*="filter"] h3, [class*="filter"] h4')].map(text).slice(0, 40),
          productLinkCount: document.querySelectorAll('a[href*="/produkt"], a[href*="/product"], [class*="product"] a').length,
        };
      });

      let ld = findJsonLdProduct(raw.jsonLd);
      // DOM fallback: a page with a heading, a price and a spec table is treated as a product page.
      if (!ld && raw.h1 && parsePriceOre(raw.priceText) && Object.keys(normalizeSpecs(raw.specs)).length >= 2) {
        ld = { name: raw.h1, offers: { price: raw.priceText } };
      }
      const url = canonicalUrl(request.loadedUrl || request.url);

      if (ld) {
        const offers = Array.isArray(ld.offers) ? ld.offers : ld.offers ? [ld.offers] : [];
        const offer = offers[0] || {};
        products.set(url, {
          url,
          name: ld.name || raw.h1,
          sku: ld.sku || ld.mpn || pick(raw.specs, /^(varenummer|varenr\.?|vare-nr\.?|sku|produktnummer|model)$/i),
          gtin: ld.gtin13 || ld.gtin || null,
          brand: (typeof ld.brand === "string" ? ld.brand : ld.brand?.name) || pick(raw.specs, /^(m(æ|ae)rke|brand|producent|fabrikat)$/i),
          priceOre: parsePriceOre(offer.price ?? offer.lowPrice ?? raw.priceText),
          currency: offer.priceCurrency || "DKK",
          availability: offer.availability || null,
          breadcrumbs: raw.breadcrumbs,
          specsRaw: raw.specs,
          specs: normalizeSpecs(raw.specs),
          variants: raw.variantOptions,
          imageUrls: [].concat(ld.image || raw.ogImage || []).slice(0, 10),
          scrapedAt: new Date().toISOString(),
        });
        log.info(`Product: ${ld.name}`);
      } else {
        categories.set(url, {
          url,
          title: raw.h1 || raw.title,
          breadcrumbs: raw.breadcrumbs,
          sortOptions: [...new Set(raw.sortOptions)],
          filterGroups: [...new Set(raw.filterGroups)],
          productLinkCount: raw.productLinkCount,
        });
      }

      await enqueueLinks({
        strategy: "same-hostname",
        transformRequestFunction: (req) => {
          const u = new URL(req.url);
          if (u.host !== host) return false;
          if (/\.(pdf|jpg|png|zip)$/i.test(u.pathname)) return false;
          if (/(kurv|basket|cart|checkout|login|konto|account|wishlist)/i.test(u.pathname)) return false;
          // Stay within the ladder section + product pages.
          if (!u.pathname.startsWith(scope.pathname) && !/produkt|product|\/p\//i.test(u.pathname) && !u.searchParams.has("page")) return false;
          req.url = canonicalUrl(u.toString());
          return req;
        },
      });
    },
    failedRequestHandler({ request, log }) {
      log.warning(`Failed: ${request.url}`);
    },
  },
  config,
);

await crawler.run([startUrl]);

const outDir = path.resolve(__dirname, "../../data/research");
await fs.mkdir(outDir, { recursive: true });
const file = path.join(outDir, `${host.replace(/[^a-z0-9.-]/gi, "_")}-${new Date().toISOString().slice(0, 10)}.json`);
await fs.writeFile(
  file,
  JSON.stringify({ source: startUrl, crawledAt: new Date().toISOString(), categories: [...categories.values()], products: [...products.values()] }, null, 2),
);
console.log(`Saved ${products.size} products and ${categories.size} listing pages to ${file}`);
