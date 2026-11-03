import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { getAllProducts, getProductBySlug, getProductsBySlugs } from "@/lib/catalog";
import { getCategory } from "@/lib/categories";
import { shop, siteUrl } from "@/lib/env";
import { formatMeters, formatPrice, materialLabels, stockLabels } from "@/lib/format";
import type { Product } from "@/lib/types";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return (await getAllProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  return {
    title: `${p.name} – ${formatPrice(p.priceOre)}`,
    description: p.shortDescription || p.description.slice(0, 155),
    alternates: { canonical: `/produkt/${p.slug}` },
    openGraph: { title: p.name, description: p.shortDescription, images: p.images.slice(0, 1).map((i) => ({ url: i.url, alt: i.alt })) },
    robots: p.isDemo ? { index: false, follow: true } : undefined,
  };
}

function specRows(p: Product): Array<[string, string]> {
  const s = p.specs;
  const rows: Array<[string, string | undefined]> = [
    ["Varenummer", p.sku],
    ["Mærke", p.brand],
    ["Arbejdshøjde", s.workingHeight ? formatMeters(s.workingHeight) : undefined],
    ["Stigelængde (udtrukket)", s.ladderLength ? formatMeters(s.ladderLength) : undefined],
    ["Transportlængde", s.transportLength ? formatMeters(s.transportLength) : undefined],
    ["Platform / øverste trin", s.platformHeight ? formatMeters(s.platformHeight) : undefined],
    ["Antal trin", s.steps ? String(s.steps) : undefined],
    ["Antal sektioner", s.sections ? String(s.sections) : undefined],
    ["Maks. belastning", s.maxLoad ? `${s.maxLoad} kg` : undefined],
    ["Vægt", s.weight ? `${String(s.weight).replace(".", ",")} kg` : undefined],
    ["Materiale", s.material ? materialLabels[s.material] ?? s.material : undefined],
    ["Standard", s.standard],
  ];
  return rows.filter((r): r is [string, string] => Boolean(r[1]));
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const category = getCategory(product.categorySlug);
  const related = await getProductsBySlugs(product.relatedSlugs ?? []);
  const rows = specRows(product);

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { name: "Stiger", href: "/stiger" },
          ...(category ? [{ name: category.name, href: `/kategori/${category.slug}` }] : []),
          { name: product.name, href: `/produkt/${product.slug}` },
        ]}
      />

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-ink-100/60">
            <ProductImage product={product} priority />
          </div>
          {product.images.length > 1 && (
            <ul className="grid grid-cols-5 gap-2">
              {product.images.slice(1, 6).map((img) => (
                <li key={img.url} className="aspect-square overflow-hidden rounded-lg bg-ink-100/60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.alt} className="h-full w-full object-contain" loading="lazy" />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="text-sm uppercase tracking-wide text-ink-500">{product.brand}</p>
          <h1 className="mt-1 text-3xl font-extrabold leading-tight">{product.name}</h1>
          <p className="mt-1 text-sm text-ink-500">Varenr. {product.sku}</p>
          {product.isDemo && (
            <p className="mt-3 rounded-lg bg-brand-100 p-3 text-sm">Demovare – specifikationer og pris er kun eksempler.</p>
          )}
          <p className="mt-4 text-ink-700">{product.shortDescription}</p>

          <div className="mt-6 rounded-2xl border border-ink-100 p-5 shadow-sm">
            <p className="text-3xl font-extrabold">{formatPrice(product.priceOre)}</p>
            <p className="text-xs text-ink-500">inkl. moms</p>
            <p className={`mt-2 text-sm font-medium ${product.stockStatus === "in_stock" ? "text-buy-700" : "text-ink-700"}`}>
              ● {stockLabels[product.stockStatus]}
              {product.deliveryDays ? ` – levering ${product.deliveryDays}` : ""}
            </p>
            <AddToCartButton product={product} withQuantity className="mt-4" />
            <ul className="mt-4 space-y-1 text-sm text-ink-700">
              <li>✓ Fri fragt ved køb over {formatPrice(shop.freeShippingThresholdOre)}</li>
              <li>✓ 30 dages returret</li>
              <li>✓ Personlig rådgivning på {shop.email}</li>
            </ul>
          </div>

          {product.features.length > 0 && (
            <ul className="mt-6 space-y-2">
              {product.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm">
                  <span className="text-brand-600" aria-hidden="true">
                    ✔
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section aria-labelledby="desc">
          <h2 id="desc" className="text-xl font-bold">
            Beskrivelse
          </h2>
          <div className="prose-shop mt-3">
            {product.description.split(/\n{2,}/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>
        <section aria-labelledby="specs">
          <h2 id="specs" className="text-xl font-bold">
            Specifikationer
          </h2>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {rows.map(([k, v]) => (
                <tr key={k} className="border-b border-ink-100">
                  <th scope="row" className="w-1/2 py-2 pr-4 text-left font-medium text-ink-500">
                    {k}
                  </th>
                  <td className="py-2">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {related.length > 0 && (
        <section className="mt-14" aria-labelledby="related">
          <h2 id="related" className="text-xl font-bold">
            Andre størrelser og lignende stiger
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {category && (
        <p className="mt-10 text-sm">
          <Link href={`/kategori/${category.slug}`} className="text-brand-600 underline">
            ← Se alle {category.name.toLowerCase()}
          </Link>
        </p>
      )}

      {!product.isDemo && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            sku: product.sku,
            brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
            description: product.shortDescription || product.description,
            image: product.images.map((i) => i.url),
            offers: {
              "@type": "Offer",
              url: `${siteUrl}/produkt/${product.slug}`,
              priceCurrency: "DKK",
              price: (product.priceOre / 100).toFixed(2),
              availability:
                product.stockStatus === "in_stock"
                  ? "https://schema.org/InStock"
                  : product.stockStatus === "backorder"
                    ? "https://schema.org/BackOrder"
                    : "https://schema.org/OutOfStock",
            },
          }}
        />
      )}
    </div>
  );
}
