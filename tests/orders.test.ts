import { describe, expect, it } from "vitest";
import { orderEmailHtml, orderSchema, priceOrder } from "@/lib/orders";
import { demoProducts } from "@/data/demo-products";

const customer = { name: "Test Kunde", email: "kunde@example.com", phone: "12345678", address: "Testvej 1", zip: "1000", city: "København" };

describe("orderSchema", () => {
  it("accepts a valid order", () => {
    expect(orderSchema.safeParse({ customer, lines: [{ productId: "x", quantity: 1 }], acceptTerms: true }).success).toBe(true);
  });
  it("rejects missing terms, bad zip and honeypot", () => {
    expect(orderSchema.safeParse({ customer, lines: [{ productId: "x", quantity: 1 }], acceptTerms: false }).success).toBe(false);
    expect(orderSchema.safeParse({ customer: { ...customer, zip: "12" }, lines: [{ productId: "x", quantity: 1 }], acceptTerms: true }).success).toBe(false);
    expect(orderSchema.safeParse({ customer, lines: [{ productId: "x", quantity: 1 }], acceptTerms: true, website: "spam" }).success).toBe(false);
  });
});

describe("priceOrder", () => {
  it("uses catalogue prices and adds shipping below threshold", () => {
    const cheap = demoProducts.find((p) => p.priceOre < 99900)!;
    const r = priceOrder({ customer, lines: [{ productId: cheap.id, quantity: 1 }], acceptTerms: true }, demoProducts);
    if ("error" in r) throw new Error(r.error);
    expect(r.subtotalOre).toBe(cheap.priceOre);
    expect(r.shippingOre).toBe(9900);
    expect(r.totalOre).toBe(cheap.priceOre + 9900);
    expect(r.vatOre).toBe(Math.round(r.totalOre / 5));
  });
  it("gives free shipping above threshold", () => {
    const p = demoProducts.find((x) => x.priceOre >= 99900)!;
    const r = priceOrder({ customer, lines: [{ productId: p.id, quantity: 2 }], acceptTerms: true }, demoProducts);
    if ("error" in r) throw new Error(r.error);
    expect(r.shippingOre).toBe(0);
    expect(r.subtotalOre).toBe(p.priceOre * 2);
  });
  it("rejects unknown products", () => {
    const r = priceOrder({ customer, lines: [{ productId: "nope", quantity: 1 }], acceptTerms: true }, demoProducts);
    expect("error" in r).toBe(true);
  });
  it("escapes HTML in e-mails", () => {
    const p = demoProducts[0];
    const r = priceOrder({ customer: { ...customer, name: "<script>x</script>" }, lines: [{ productId: p.id, quantity: 1 }], acceptTerms: true }, demoProducts);
    if ("error" in r) throw new Error(r.error);
    expect(orderEmailHtml(r, false)).not.toContain("<script>");
  });
});
