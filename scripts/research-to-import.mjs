#!/usr/bin/env node
/**
 * Converts a research crawl (data/research/*.json) into an import CSV DRAFT.
 *
 * Takes over only FACTS: product name, brand, model/SKU, category and technical
 * specifications. Competitor descriptions and images are NOT carried over –
 * a neutral short text is generated from the specs instead, and the shop's own
 * SVG illustrations are used until licensed supplier images are added.
 *
 * Prices: the shop owner decides the price rule. Without --price-factor the
 * price column is left empty and the import will refuse the file, so nothing
 * goes live with a price the owner has not chosen.
 *
 *   node scripts/research-to-import.mjs data/research/<file>.json --price-factor=0.95 > data/draft.csv
 *   (0.95 = 5% under the reference price, rounded down to ...9 kr.)
 */
import fs from "node:fs/promises";

const CATEGORY_RULES = [
  [/rullestillads|stillads/i, "rullestilladser"],
  [/glasfiber/i, "glasfiberstiger"],
  [/platform|podie/i, "platformsstiger"],
  [/tagstige|tag-?stige|rygning/i, "tagstiger"],
  [/teleskop/i, "teleskopstiger"],
  [/kombi|multi|led(delt)?stige/i, "kombistiger"],
  [/skydestige|[23]-?delt|tre-?delt|to-?delt/i, "skydestiger"],
  [/trappestige|dobbeltsidet|ensidet|husholdning/i, "trappestiger"],
  [/skammel|trappetrin|trinskammel/i, "skamler-og-trappetrin"],
  [/enkelt|anl(æ|ae)g/i, "enkeltstiger"],
  [/tilbeh|fod|stabilis|holder|krog|beslag/i, "tilbehoer"],
];

export function guessCategory(p) {
  const hay = [...(p.breadcrumbs || []), p.name].join(" ");
  for (const [re, slug] of CATEGORY_RULES) if (re.test(hay)) return slug;
  return "";
}

export function priceFromReference(ore, factor) {
  if (!ore || !factor) return "";
  // Same price as the reference: keep it exactly (incl. øre).
  if (factor === 1) return (ore / 100).toFixed(2);
  const kr = Math.floor((ore / 100) * factor);
  // Psychological rounding down to ...9 (e.g. 1234 -> 1229)
  const rounded = kr >= 100 ? Math.floor(kr / 10) * 10 - 1 : kr;
  return String(Math.max(1, rounded));
}

export function shortText(p, s) {
  const parts = [];
  if (s.workingHeight) parts.push(`arbejdshøjde ${String(s.workingHeight).replace(".", ",")} m`);
  if (s.steps) parts.push(`${s.steps} trin`);
  if (s.maxLoad) parts.push(`maks. ${s.maxLoad} kg`);
  if (s.material) parts.push(s.material);
  return parts.length ? `${p.name} med ${parts.join(", ")}.` : p.name;
}

const csvCell = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const COLS = ["sku", "name", "brand", "category", "price", "stock", "short_description", "working_height", "ladder_length", "transport_length", "platform_height", "steps", "sections", "max_load", "weight", "material", "standard", "professional", "reference_url", "reference_price"];

export function toRows(research, factor) {
  const seen = new Set();
  return research.products
    .filter((p) => p.name)
    .map((p, i) => {
      const s = p.specs || {};
      let sku = (p.sku || "").toString().trim() || `REF-${i + 1}`;
      while (seen.has(sku)) sku += "-b";
      seen.add(sku);
      const stock = /InStock/i.test(p.availability || "") ? "in_stock" : /BackOrder|PreOrder/i.test(p.availability || "") ? "backorder" : "unknown";
      return {
        sku, name: p.name, brand: p.brand || "", category: guessCategory(p),
        price: priceFromReference(p.priceOre, factor), stock,
        short_description: shortText(p, s),
        working_height: s.workingHeight, ladder_length: s.ladderLength, transport_length: s.transportLength,
        platform_height: s.platformHeight, steps: s.steps, sections: s.sections, max_load: s.maxLoad,
        weight: s.weight, material: s.material, standard: s.standard, professional: s.professional ? "ja" : "",
        reference_url: p.url, reference_price: p.priceOre ? (p.priceOre / 100).toFixed(2) : "",
      };
    });
}

async function main() {
  const file = process.argv.slice(2).find((a) => !a.startsWith("--"));
  const factor = Number(process.argv.find((a) => a.startsWith("--price-factor="))?.split("=")[1]) || 0;
  if (!file) {
    console.error("Brug: node scripts/research-to-import.mjs <research.json> [--price-factor=0.95]");
    process.exit(1);
  }
  const rows = toRows(JSON.parse(await fs.readFile(file, "utf8")), factor);
  process.stdout.write([COLS.join(","), ...rows.map((r) => COLS.map((c) => csvCell(r[c])).join(","))].join("\n") + "\n");
  const noCat = rows.filter((r) => !r.category).length;
  console.error(`${rows.length} produkter. ${noCat} uden kategori (skal udfyldes manuelt).${factor ? "" : " Ingen --price-factor: pris-kolonnen er tom."}`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
