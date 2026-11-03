import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/catalog";
import { categories } from "@/lib/categories";
import { siteUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = (await getAllProducts()).filter((p) => !p.isDemo);
  const staticPaths = ["", "/stiger", "/om-os", "/kontakt", "/fragt-og-levering", "/handelsbetingelser", "/privatlivspolitik", "/guide/valg-af-stige", "/guide/en-131", "/guide/sikkerhed"];
  return [
    ...staticPaths.map((p) => ({ url: `${siteUrl}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.5 })),
    ...categories.map((c) => ({ url: `${siteUrl}/kategori/${c.slug}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${siteUrl}/produkt/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
