import Link from "next/link";
import { Suspense } from "react";
import { applyFilters, computeFacets, PAGE_SIZE, parseFilters } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { FilterPanel } from "./FilterPanel";
import { ProductCard } from "./ProductCard";
import { SortSelect } from "./SortSelect";

type SP = Record<string, string | string[] | undefined>;

/** Server-rendered listing with URL-driven filters, sorting and pagination. */
export function ProductListing({ products, searchParams, basePath }: { products: Product[]; searchParams: SP; basePath: string }) {
  const filters = parseFilters(searchParams);
  const filtered = applyFilters(products, filters);
  const facets = computeFacets(products);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(filters.page ?? 1, pages);
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pageHref = (n: number) => {
    const p = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (k !== "side" && typeof v === "string") p.set(k, v);
    });
    if (n > 1) p.set("side", String(n));
    const qs = p.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
      <aside aria-label="Filtre">
        <Suspense>
          <FilterPanel facets={facets} />
        </Suspense>
      </aside>
      <section aria-label="Produkter">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-500" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "produkt" : "produkter"}
          </p>
          <Suspense>
            <SortSelect />
          </Suspense>
        </div>
        {shown.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ink-300 p-10 text-center">
            <p className="font-semibold">Ingen produkter matcher dine filtre.</p>
            <Link href={basePath} className="mt-3 inline-block text-brand-600 underline">
              Nulstil filtre
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        {pages > 1 && (
          <nav aria-label="Sider" className="mt-8 flex justify-center gap-1">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={pageHref(n)}
                aria-current={n === page ? "page" : undefined}
                className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 ${n === page ? "border-ink-900 bg-ink-900 text-white" : "border-ink-300 hover:bg-ink-100"}`}
              >
                {n}
              </Link>
            ))}
          </nav>
        )}
      </section>
    </div>
  );
}
