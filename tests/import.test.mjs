import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { buildCatalogue, parseCsv } from "../scripts/import-products.mjs";

test("template CSV imports cleanly", () => {
  const rows = parseCsv(fs.readFileSync(new URL("../data/import-template.csv", import.meta.url), "utf8"));
  const { products, errors } = buildCatalogue(rows);
  assert.deepEqual(errors, []);
  assert.equal(products.length, 1);
  const p = products[0];
  assert.equal(p.priceOre, 69900);
  assert.equal(p.specs.workingHeight, 3.1);
  assert.equal(p.specs.professional, true);
  assert.deepEqual(p.features, ["Brede trin", "Sikkerhedsbøjle"]);
  assert.equal(p.slug, "eksempel-trappestige-5-trin");
});

test("invalid rows are rejected with line numbers", () => {
  const { errors } = buildCatalogue([{ sku: "A", name: "X", price: "0", category: "nope" }]);
  assert.ok(errors.some((e) => e.includes("linje 2") && e.includes("price")));
  assert.ok(errors.some((e) => e.includes("category")));
});

test("semicolon CSV with quotes and Danish thousands separators", () => {
  const rows = parseCsv('sku;name;category;price\n"A1";"Stige ""Pro""";skydestiger;1.299,00\n');
  const { products, errors } = buildCatalogue(rows);
  assert.deepEqual(errors, []);
  assert.equal(products[0].name, 'Stige "Pro"');
  assert.equal(products[0].priceOre, 129900);
});

test("duplicate SKUs are reported", () => {
  const r = { name: "A", category: "trappestiger", price: "100" };
  const { errors } = buildCatalogue([{ ...r, sku: "1" }, { ...r, sku: "1" }]);
  assert.ok(errors.some((e) => e.includes("dublet")));
});
