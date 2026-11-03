import { describe, expect, it } from "vitest";
import { applyFilters, computeFacets, parseFilters } from "@/lib/catalog";
import { demoProducts } from "@/data/demo-products";
import { categories } from "@/lib/categories";

describe("demo catalogue integrity", () => {
  it("has unique ids and slugs and valid categories", () => {
    expect(new Set(demoProducts.map((p) => p.id)).size).toBe(demoProducts.length);
    expect(new Set(demoProducts.map((p) => p.slug)).size).toBe(demoProducts.length);
    const slugs = categories.map((c) => c.slug);
    demoProducts.forEach((p) => expect(slugs).toContain(p.categorySlug));
    demoProducts.forEach((p) => expect(p.isDemo).toBe(true));
  });
});

describe("parseFilters", () => {
  it("parses Danish URL params", () => {
    const f = parseFilters({ hoejdeMin: "3,5", materiale: "aluminium,glasfiber", sort: "price-asc", side: "2", professionel: "1" });
    expect(f.minHeight).toBe(3.5);
    expect(f.material).toEqual(["aluminium", "glasfiber"]);
    expect(f.sort).toBe("price-asc");
    expect(f.page).toBe(2);
    expect(f.professional).toBe(true);
  });
  it("ignores invalid values", () => {
    const f = parseFilters({ sort: "evil", hoejdeMin: "abc", side: "-3" });
    expect(f.sort).toBe("popular");
    expect(f.minHeight).toBeUndefined();
    expect(f.page).toBe(1);
  });
});

describe("applyFilters", () => {
  it("filters by category and height and sorts by price", () => {
    const out = applyFilters(demoProducts, { category: "skydestiger", minHeight: 7, sort: "price-asc" });
    expect(out.length).toBeGreaterThan(0);
    out.forEach((p) => {
      expect(p.categorySlug).toBe("skydestiger");
      expect(p.specs.workingHeight!).toBeGreaterThanOrEqual(7);
    });
    for (let i = 1; i < out.length; i++) expect(out[i].priceOre).toBeGreaterThanOrEqual(out[i - 1].priceOre);
  });
  it("searches across name with multiple terms (accent-insensitive)", () => {
    const out = applyFilters(demoProducts, { q: "glasfiber 5 trin" });
    expect(out.map((p) => p.name)).toContain("Glasfiber trappestige 5 trin");
  });
  it("filters by material", () => {
    const out = applyFilters(demoProducts, { material: ["glasfiber"] });
    expect(out.every((p) => p.specs.material === "glasfiber")).toBe(true);
  });
});

describe("computeFacets", () => {
  it("returns ranges", () => {
    const f = computeFacets(demoProducts);
    expect(f.priceRange[0]).toBeLessThan(f.priceRange[1]);
    expect(f.materials.map((m) => m.value)).toContain("aluminium");
  });
});
