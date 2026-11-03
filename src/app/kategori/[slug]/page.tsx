import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductListing } from "@/components/ProductListing";
import { getAllProducts } from "@/lib/catalog";
import { categories, getCategory } from "@/lib/categories";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) return {};
  return {
    title: `${c.name} – køb billigt online`,
    description: c.summary,
    alternates: { canonical: `/kategori/${c.slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: { params: Params; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const [all, sp] = await Promise.all([getAllProducts(), searchParams]);
  const products = all.filter((p) => p.categorySlug === slug);

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ name: "Stiger", href: "/stiger" }, { name: category.name, href: `/kategori/${slug}` }]} />
      <h1 className="mt-3 text-3xl font-extrabold">{category.name}</h1>
      <p className="mb-6 mt-2 max-w-3xl text-ink-700">{category.intro}</p>
      <nav aria-label="Andre kategorier" className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/kategori/${c.slug}`}
            className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm ${c.slug === slug ? "border-ink-900 bg-ink-900 text-white" : "border-ink-300 hover:bg-ink-100"}`}
          >
            {c.name}
          </Link>
        ))}
      </nav>
      <ProductListing products={products} searchParams={sp} basePath={`/kategori/${slug}`} />
    </div>
  );
}
