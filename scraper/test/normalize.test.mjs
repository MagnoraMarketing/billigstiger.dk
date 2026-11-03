import { test } from "node:test";
import assert from "node:assert/strict";
import { canonicalUrl, findJsonLdProduct, normalizeSpecs, parseKg, parseMeters, parsePriceOre } from "../src/normalize.mjs";

test("parsePriceOre handles Danish and English formats", () => {
  assert.equal(parsePriceOre("1.299,00 kr."), 129900);
  assert.equal(parsePriceOre("DKK 1,299.50"), 129950);
  assert.equal(parsePriceOre("1.299"), 129900);
  assert.equal(parsePriceOre("499,-"), 49900);
  assert.equal(parsePriceOre("1 049,95 kr"), 104995);
  assert.equal(parsePriceOre(799), 79900);
  assert.equal(parsePriceOre("Ring for pris"), null);
});

test("parseMeters converts units", () => {
  assert.equal(parseMeters("5,6 m"), 5.6);
  assert.equal(parseMeters("560 cm"), 5.6);
  assert.equal(parseMeters("5600 mm"), 5.6);
});

test("parseKg", () => {
  assert.equal(parseKg("150 kg"), 150);
  assert.equal(parseKg("Max 150kg"), 150);
});

test("normalizeSpecs maps Danish labels", () => {
  const s = normalizeSpecs({
    "Arbejdshøjde": "7,2 m",
    "Max. belastning": "150 kg",
    "Antal trin": "3 x 8",
    Materiale: "Aluminium",
    Standard: "EN 131 Professionel",
    Vægt: "15,0 kg",
  });
  assert.equal(s.workingHeight, 7.2);
  assert.equal(s.maxLoad, 150);
  assert.equal(s.steps, 3);
  assert.equal(s.material, "aluminium");
  assert.equal(s.professional, true);
  assert.equal(s.weight, 15);
});

test("findJsonLdProduct finds products in @graph", () => {
  const p = findJsonLdProduct([JSON.stringify({ "@graph": [{ "@type": "WebPage" }, { "@type": "Product", name: "X" }] }), "{bad"]);
  assert.equal(p.name, "X");
});

test("canonicalUrl strips tracking", () => {
  assert.equal(canonicalUrl("https://a.dk/x?utm_source=g&page=2#top"), "https://a.dk/x?page=2");
});
