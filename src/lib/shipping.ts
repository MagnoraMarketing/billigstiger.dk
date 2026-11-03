import { shop } from "./env";

export function shippingFor(subtotalOre: number): number {
  if (subtotalOre <= 0) return 0;
  return subtotalOre >= shop.freeShippingThresholdOre ? 0 : shop.shippingOre;
}

/** Danish VAT is 25% of the net price, i.e. 20% of a VAT-inclusive price. */
export function vatIncluded(totalOre: number): number {
  return Math.round(totalOre / 5);
}
