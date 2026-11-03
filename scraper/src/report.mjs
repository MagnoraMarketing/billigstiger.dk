/**
 * Summarises a research crawl: category structure, product counts, brands,
 * price ranges and the spec fields competitors expose (useful for planning
 * filters). Usage: npm run report -- ../data/research/<file>.json
 */
import fs from "node:fs/promises";

const file = process.argv[2];
if (!file) {
  console.error("Usage: npm run report -- <research.json>");
  process.exit(1);
}
const data = JSON.parse(await fs.readFile(file, "utf8"));
const kr = (o) => (o == null ? "–" : `${(o / 100).toLocaleString("da-DK")} kr.`);

const byCat = new Map();
for (const p of data.products) {
  const cat = p.breadcrumbs?.slice(1, 3).join(" > ") || "(ukendt)";
  if (!byCat.has(cat)) byCat.set(cat, []);
  byCat.get(cat).push(p);
}

console.log(`# Research report: ${data.source}\nCrawled ${data.crawledAt}\n`);
console.log(`Products: ${data.products.length}, listing pages: ${data.categories.length}\n`);
console.log("## Categories");
for (const [cat, list] of [...byCat.entries()].sort((a, b) => b[1].length - a[1].length)) {
  const prices = list.map((p) => p.priceOre).filter(Boolean);
  console.log(`- ${cat}: ${list.length} products, ${kr(Math.min(...prices))} – ${kr(Math.max(...prices))}`);
}
const brands = new Map();
data.products.forEach((p) => p.brand && brands.set(p.brand, (brands.get(p.brand) || 0) + 1));
console.log("\n## Brands");
[...brands.entries()].sort((a, b) => b[1] - a[1]).forEach(([b, n]) => console.log(`- ${b}: ${n}`));
const specKeys = new Map();
data.products.forEach((p) => Object.keys(p.specsRaw || {}).forEach((k) => specKeys.set(k, (specKeys.get(k) || 0) + 1)));
console.log("\n## Spec fields seen");
[...specKeys.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40).forEach(([k, n]) => console.log(`- ${k}: ${n}`));
const sorts = new Set(data.categories.flatMap((c) => c.sortOptions));
const filters = new Set(data.categories.flatMap((c) => c.filterGroups));
console.log(`\n## Sort options\n${[...sorts].map((s) => `- ${s}`).join("\n") || "(none found)"}`);
console.log(`\n## Filter groups\n${[...filters].map((s) => `- ${s}`).join("\n") || "(none found)"}`);
