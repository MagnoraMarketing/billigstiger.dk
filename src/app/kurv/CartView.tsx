"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { OrderSummary } from "@/components/OrderSummary";
import { formatPrice } from "@/lib/format";

export function CartView({ freeShippingThresholdOre }: { freeShippingThresholdOre: number }) {
  const { lines, ready, setQuantity, remove } = useCart();
  if (!ready) return <p className="text-ink-500">Indlæser kurv…</p>;
  if (lines.length === 0)
    return (
      <div className="rounded-xl border border-dashed border-ink-300 p-10 text-center">
        <p className="font-semibold">Din kurv er tom.</p>
        <Link href="/stiger" className="btn btn-secondary mt-4">
          Find en stige
        </Link>
      </div>
    );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <ul className="h-fit divide-y divide-ink-100 rounded-xl border border-ink-100">
        {lines.map((l) => (
          <li key={l.productId} className="flex flex-wrap items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <Link href={`/produkt/${l.slug}`} className="font-semibold hover:underline">
                {l.name}
              </Link>
              <p className="text-xs text-ink-500">Varenr. {l.sku}</p>
              <p className="text-sm">{formatPrice(l.priceOre)} pr. stk.</p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <span className="sr-only">Antal af {l.name}</span>
              <select className="input w-20" value={l.quantity} onChange={(e) => setQuantity(l.productId, Number(e.target.value))}>
                {Array.from({ length: Math.max(20, l.quantity) }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <p className="w-28 text-right font-semibold">{formatPrice(l.priceOre * l.quantity)}</p>
            <button type="button" onClick={() => remove(l.productId)} className="text-sm text-ink-500 underline hover:text-ink-900">
              Fjern
            </button>
          </li>
        ))}
      </ul>
      <aside className="h-fit rounded-xl border border-ink-100 p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">Oversigt</h2>
        <OrderSummary freeShippingThresholdOre={freeShippingThresholdOre} />
        <Link href="/kasse" className="btn btn-primary mt-5 w-full py-3">
          Gå til kassen
        </Link>
        <Link href="/stiger" className="mt-3 block text-center text-sm underline">
          Fortsæt med at handle
        </Link>
      </aside>
    </div>
  );
}
