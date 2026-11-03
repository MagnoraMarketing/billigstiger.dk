import Link from "next/link";
import { LadderIllustration } from "@/components/LadderIllustration";
import { ProductCard } from "@/components/ProductCard";
import { getAllProducts } from "@/lib/catalog";
import { categories } from "@/lib/categories";
import { formatPrice } from "@/lib/format";

export default async function HomePage() {
  const products = await getAllProducts();
  const featured = ["trappestiger", "kombistiger", "skydestiger", "teleskopstiger"]
    .map((c) => products.find((p) => p.categorySlug === c))
    .filter((p) => p != null);
  const fromPrice = (slug: string) => {
    const prices = products.filter((p) => p.categorySlug === slug).map((p) => p.priceOre);
    return prices.length ? Math.min(...prices) : null;
  };

  return (
    <>
      <section className="bg-gradient-to-br from-brand-50 via-white to-brand-100">
        <div className="container-page grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
          <div>
            <p className="mb-3 inline-block rounded-full bg-ink-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-300">
              Stiger til hjem og erhverv
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Kvalitetsstiger til <span className="text-brand-600">billige priser</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-ink-700">
              Find den rigtige stige på få minutter. Filtrér på arbejdshøjde, materiale og belastning – og få den leveret til døren.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/stiger" className="btn btn-secondary px-6 py-3 text-base">
                Se alle stiger
              </Link>
              <Link href="/guide/valg-af-stige" className="btn btn-outline px-6 py-3 text-base">
                Hjælp mig med at vælge
              </Link>
            </div>
          </div>
          <div className="relative mx-auto hidden aspect-square w-full max-w-md md:block" aria-hidden="true">
            <div className="absolute inset-6 rounded-full bg-brand-300/40" />
            <LadderIllustration type="kombistige" className="relative h-full w-full" />
          </div>
        </div>
      </section>

      <section className="container-page py-12" aria-labelledby="cat-heading">
        <h2 id="cat-heading" className="text-2xl font-bold">
          Find stige efter type
        </h2>
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => {
            const from = fromPrice(c.slug);
            return (
              <li key={c.slug}>
                <Link
                  href={`/kategori/${c.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-ink-100 bg-white p-4 shadow-sm transition hover:border-brand-400 hover:shadow-md"
                >
                  <LadderIllustration type={c.ladderType} className="mx-auto h-24 w-24 transition group-hover:scale-105" />
                  <span className="mt-3 font-semibold">{c.name}</span>
                  <span className="mt-1 line-clamp-2 text-xs text-ink-500">{c.summary}</span>
                  {from != null && <span className="mt-auto pt-2 text-sm font-semibold text-brand-600">Fra {formatPrice(from)}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {featured.length > 0 && (
        <section className="bg-ink-100/50 py-12" aria-labelledby="pop-heading">
          <div className="container-page">
            <div className="flex items-end justify-between">
              <h2 id="pop-heading" className="text-2xl font-bold">
                Udvalgte stiger
              </h2>
              <Link href="/stiger" className="text-sm font-semibold text-brand-600 hover:underline">
                Se alle →
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-page grid gap-6 py-12 md:grid-cols-3">
        {[
          ["Hvilken højde skal jeg bruge?", "Arbejdshøjden er ca. 1 meter over det højeste trin, du må stå på. Mål højden, du skal nå, og vælg en stige med lidt ekstra.", "/guide/valg-af-stige"],
          ["Hvad betyder EN 131?", "EN 131 er den europæiske standard for bærbare stiger. Til erhverv skal du vælge en stige godkendt som 'Professionel'.", "/guide/en-131"],
          ["Arbejd sikkert i højden", "Korrekt vinkel, fast underlag og tre kontaktpunkter. Læs vores tjekliste før du går i gang.", "/guide/sikkerhed"],
        ].map(([title, text, href]) => (
          <Link key={href} href={href} className="rounded-xl border border-ink-100 p-6 hover:border-brand-400">
            <h3 className="font-bold">{title}</h3>
            <p className="mt-2 text-sm text-ink-700">{text}</p>
            <span className="mt-3 inline-block text-sm font-semibold text-brand-600">Læs guiden →</span>
          </Link>
        ))}
      </section>
    </>
  );
}
