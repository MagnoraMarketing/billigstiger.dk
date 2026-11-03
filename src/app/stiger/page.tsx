import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductListing } from "@/components/ProductListing";
import { getAllProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Alle stiger",
  description: "Se hele sortimentet af stiger: trappestiger, kombistiger, skydestiger, teleskopstiger, platformsstiger og rullestilladser.",
  alternates: { canonical: "/stiger" },
};

export default async function AllLaddersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [products, sp] = await Promise.all([getAllProducts(), searchParams]);
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ name: "Alle stiger", href: "/stiger" }]} />
      <h1 className="mb-6 mt-3 text-3xl font-extrabold">Alle stiger</h1>
      <ProductListing products={products} searchParams={sp} basePath="/stiger" />
    </div>
  );
}
