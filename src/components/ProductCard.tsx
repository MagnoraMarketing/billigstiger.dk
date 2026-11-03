import Link from "next/link";
import { formatMeters, formatPrice, materialLabels, stockLabels } from "@/lib/format";
import type { Product } from "@/lib/types";
import { AddToCartButton } from "./AddToCartButton";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product }: { product: Product }) {
  const s = product.specs;
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-ink-100 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/produkt/${product.slug}`} className="relative block aspect-square bg-ink-100/60">
        <ProductImage product={product} />
        {s.professional && (
          <span className="absolute left-2 top-2 rounded bg-ink-900 px-2 py-0.5 text-xs font-semibold text-white">Professionel</span>
        )}
        {product.isDemo && (
          <span className="absolute right-2 top-2 rounded bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-600">Demo</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs uppercase tracking-wide text-ink-500">{product.brand}</p>
        <h3 className="font-semibold leading-snug">
          <Link href={`/produkt/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-500">
          {s.workingHeight ? <li>Arbejdshøjde {formatMeters(s.workingHeight)}</li> : null}
          {s.maxLoad ? <li>Maks. {s.maxLoad} kg</li> : null}
          {s.material ? <li>{materialLabels[s.material] ?? s.material}</li> : null}
        </ul>
        <div className="mt-auto pt-2">
          <p className="text-xl font-bold">{formatPrice(product.priceOre)}</p>
          <p className={`text-xs ${product.stockStatus === "in_stock" ? "text-buy-700" : "text-ink-500"}`}>
            {stockLabels[product.stockStatus]}
            {product.deliveryDays ? ` · Levering ${product.deliveryDays}` : ""}
          </p>
        </div>
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}
