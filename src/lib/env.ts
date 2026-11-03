/** Central place for environment configuration. Never import service keys into client code. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  "http://localhost:3000").replace(/\/$/, "");

export const siteName = "BilligeStiger.dk";

/**
 * Catalogue source:
 *  - "file": products from data/products.json (produced by `npm run import:products`)
 *  - "demo": built-in illustrative demo products (default while data/products.json is empty)
 */
export function catalogSourceSetting(): "file" | "demo" | "auto" {
  const v = process.env.CATALOG_SOURCE;
  return v === "file" || v === "demo" ? v : "auto";
}

export const shop = {
  email: process.env.NEXT_PUBLIC_SHOP_EMAIL || "kontakt@billigestiger.dk",
  phone: process.env.NEXT_PUBLIC_SHOP_PHONE || "",
  cvr: process.env.NEXT_PUBLIC_SHOP_CVR || "",
  address: process.env.NEXT_PUBLIC_SHOP_ADDRESS || "",
  freeShippingThresholdOre: Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD_DKK || 999) * 100,
  shippingOre: Number(process.env.NEXT_PUBLIC_SHIPPING_DKK || 99) * 100,
};
