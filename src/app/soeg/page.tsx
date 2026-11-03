import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductListing } from "@/components/ProductListing";
import { getAllProducts, matchesQuery } from "@/lib/catalog";

export const metadata: Metadata = { title: "Søg", robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [all, sp] = await Promise.all([getAllProducts(), searchParams]);
  const q = (typeof sp.q === "string" ? sp.q : "").trim().slice(0, 100);
  const products = q ? all.filter((p) => matchesQuery(p, q)) : all;

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ name: "Søg", href: "/soeg" }]} />
      <h1 className="mb-2 mt-3 text-3xl font-extrabold">{q ? `Søgeresultater for “${q}”` : "Søg i sortimentet"}</h1>
      <form action="/soeg" className="mb-6 flex max-w-xl" role="search">
        <label htmlFor="search-q" className="sr-only">
          Søg
        </label>
        <input id="search-q" name="q" defaultValue={q} type="search" className="input rounded-r-none" placeholder="Søg efter stiger" />
        <button className="btn btn-secondary rounded-l-none">Søg</button>
      </form>
      <ProductListing products={products} searchParams={sp} basePath="/soeg" />
    </div>
  );
}
