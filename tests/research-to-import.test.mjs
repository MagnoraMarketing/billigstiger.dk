import { test } from "node:test";
import assert from "node:assert/strict";
import { guessCategory, isLadder, priceFromReference, toRows } from "../scripts/research-to-import.mjs";
import { buildCatalogue } from "../scripts/import-products.mjs";

test("category guessing", () => {
  assert.equal(guessCategory({ name: "Alu trappestige 5 trin" }), "trappestiger");
  assert.equal(guessCategory({ name: "X", breadcrumbs: ["Forside", "Stiger", "Skydestiger"] }), "skydestiger");
  assert.equal(guessCategory({ name: "Glasfiber trappestige" }), "glasfiberstiger");
});

test("price rule only applies when a factor is given", () => {
  assert.equal(priceFromReference(129900, 0), "");
  assert.equal(priceFromReference(129900, 0.95), "1229");
  assert.equal(priceFromReference(129950, 1), "1299.50");
});

test("rows carry facts only and import cleanly with a price rule", () => {
  const research = { products: [{ url: "https://x/p", name: "Alu skydestige 2x10 trin", sku: "A1", brand: "B", priceOre: 149900, availability: "https://schema.org/InStock", breadcrumbs: [], specs: { workingHeight: 5.6, maxLoad: 150, material: "aluminium" } }] };
  const rows = toRows(research, 0.95);
  assert.equal(rows[0].category, "skydestiger");
  assert.ok(!("description" in rows[0]) && !("images" in rows[0]));
  const { products, errors } = buildCatalogue(rows.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v == null ? "" : String(v)]))));
  assert.deepEqual(errors, []);
  assert.equal(products[0].priceOre, 141900);
});

test("only ladders are kept", () => {
  const research = { products: [
    { name: "Rullestillads 6 m", breadcrumbs: ["Stilladser"], specs: {} },
    { name: "Stigefod til skydestige", breadcrumbs: ["Stiger", "Skydestiger"], specs: {} },
    { name: "Trinskammel 2 trin", breadcrumbs: [], specs: {} },
    { name: "Teleskopstige 3,8 m", breadcrumbs: ["Stiger", "Teleskopstiger"], priceOre: 99900, specs: {} },
    { name: "Glasfiber trappestige 6 trin", breadcrumbs: ["Stiger", "Trappestiger"], priceOre: 99900, specs: {} },
  ] };
  const skipped = [];
  const rows = toRows(research, 1, skipped);
  assert.deepEqual(rows.map((r) => r.category), ["teleskopstiger", "glasfiberstiger"]);
  assert.equal(skipped.length, 3);
  assert.equal(isLadder({ name: "Kombistige 3x8" }, "kombistiger"), true);
});
