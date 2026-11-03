#!/usr/bin/env node
/**
 * Imports the shop catalogue from a supplier CSV (or JSON array) into
 * data/products.json, which the Next.js app reads at build time.
 *
 *   npm run import:products -- path/to/products.csv
 *   npm run import:products -- path/to/products.csv --dry-run
 *
 * See data/import-template.csv for the column format. Use ONLY data you have the
 * right to publish (own texts / supplier-licensed texts and images).
 */
import fs from "node:fs/promises";
import path from "node:path";

const VALID_CATEGORIES = [
  "trappestiger", "kombistiger", "skydestiger", "teleskopstiger", "enkeltstiger", "platformsstiger",
  "tagstiger", "glasfiberstiger", "rullestilladser", "skamler-og-trappetrin", "tilbehoer",
];
const VALID_STOCK = ["in_stock", "backorder", "out_of_stock", "unknown"];
const VALID_MATERIAL = ["aluminium", "glasfiber", "staal", "trae", "kombineret"];

export function parseCsv(text) {
  const rows = [];
  let row = [], field = "", q = false;
  const delim = text.split("\n")[0].includes(";") && !text.split("\n")[0].includes(",") ? ";" : ",";
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === delim) { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((x) => x !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((x) => x !== "")) rows.push(row);
  const [header, ...body] = rows;
  const keys = header.map((h) => h.trim().replace(/^﻿/, "").toLowerCase());
  return body.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? "").trim()])));
}

export function slugify(s) {
  return s.toLowerCase().replace(/æ/g, "ae").replace(/ø/g, "oe").replace(/å/g, "aa").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const num = (v) => {
  if (v == null || v === "") return undefined;
  const n = Number(String(v).replace(/\s/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
};
const list = (v) => (v ? String(v).split("|").map((x) => x.trim()).filter(Boolean) : []);
const bool = (v) => /^(1|true|ja|yes|x)$/i.test(String(v ?? "").trim());

export function toProduct(r, line) {
  const errors = [];
  const name = r.name;
  const sku = r.sku;
  const price = num(r.price);
  if (!sku) errors.push("sku mangler");
  if (!name) errors.push("name mangler");
  if (price == null || price <= 0) errors.push("price mangler/ugyldig");
  if (!VALID_CATEGORIES.includes(r.category)) errors.push(`ukendt category "${r.category}"`);
  const stock = r.stock || "unknown";
  if (!VALID_STOCK.includes(stock)) errors.push(`ukendt stock "${stock}"`);
  const material = r.material ? r.material.toLowerCase() : undefined;
  if (material && !VALID_MATERIAL.includes(material)) errors.push(`ukendt material "${r.material}"`);
  if (errors.length) return { errors: errors.map((e) => `linje ${line}: ${e}`) };

  const specs = Object.fromEntries(
    Object.entries({
      workingHeight: num(r.working_height),
      ladderLength: num(r.ladder_length),
      transportLength: num(r.transport_length),
      platformHeight: num(r.platform_height),
      steps: num(r.steps),
      sections: num(r.sections),
      maxLoad: num(r.max_load),
      weight: num(r.weight),
      material,
      standard: r.standard || undefined,
      professional: bool(r.professional),
    }).filter(([, v]) => v !== undefined),
  );
  return {
    product: {
      id: sku,
      slug: r.slug ? slugify(r.slug) : slugify(name),
      sku,
      name,
      brand: r.brand || "",
      categorySlug: r.category,
      shortDescription: r.short_description || "",
      description: r.description || r.short_description || "",
      priceOre: Math.round(price * 100),
      compareAtPriceOre: num(r.compare_at_price) ? Math.round(num(r.compare_at_price) * 100) : null,
      stockStatus: stock,
      deliveryDays: r.delivery_days || undefined,
      specs,
      images: list(r.images).map((url) => ({ url, alt: name })),
      features: list(r.features),
      relatedSkus: list(r.related_skus),
      updatedAt: new Date().toISOString(),
    },
  };
}

export function buildCatalogue(rows) {
  const errors = [];
  const products = [];
  rows.forEach((r, i) => {
    const res = toProduct(r, i + 2);
    if (res.errors) errors.push(...res.errors);
    else products.push(res.product);
  });
  // Unique SKUs and slugs
  const seenSku = new Set();
  const seenSlug = new Map();
  for (const p of products) {
    if (seenSku.has(p.sku)) errors.push(`dublet sku ${p.sku}`);
    seenSku.add(p.sku);
    const n = seenSlug.get(p.slug) ?? 0;
    if (n) p.slug = `${p.slug}-${slugify(p.sku)}`;
    seenSlug.set(p.slug, n + 1);
  }
  // Resolve related SKUs → slugs
  const bySku = new Map(products.map((p) => [p.sku, p.slug]));
  for (const p of products) {
    p.relatedSlugs = p.relatedSkus.map((s) => bySku.get(s)).filter(Boolean);
    delete p.relatedSkus;
  }
  return { products, errors };
}

async function main() {
  const args = process.argv.slice(2);
  const file = args.find((a) => !a.startsWith("--"));
  const dry = args.includes("--dry-run");
  if (!file) {
    console.error("Brug: npm run import:products -- <fil.csv|fil.json> [--dry-run]");
    process.exit(1);
  }
  const text = await fs.readFile(file, "utf8");
  const rows = file.endsWith(".json") ? JSON.parse(text) : parseCsv(text);
  const { products, errors } = buildCatalogue(rows);
  if (errors.length) {
    console.error(`Import afvist – ${errors.length} fejl:\n` + errors.map((e) => ` - ${e}`).join("\n"));
    process.exit(1);
  }
  const out = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../data/products.json");
  if (dry) console.log(`Dry run OK: ${products.length} produkter ville blive skrevet til ${out}`);
  else {
    await fs.writeFile(out, JSON.stringify(products, null, 2) + "\n");
    console.log(`Importerede ${products.length} produkter til ${out}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main();
