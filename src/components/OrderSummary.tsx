"use client";

import { formatPrice } from "@/lib/format";
import { shippingFor, vatIncluded } from "@/lib/shipping";
import { useCart } from "./CartProvider";

export function OrderSummary({ freeShippingThresholdOre }: { freeShippingThresholdOre: number }) {
  const { subtotalOre } = useCart();
  const shipping = shippingFor(subtotalOre);
  const total = subtotalOre + shipping;
  const missing = freeShippingThresholdOre - subtotalOre;
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt>Subtotal</dt>
        <dd>{formatPrice(subtotalOre)}</dd>
      </div>
      <div className="flex justify-between">
        <dt>Fragt</dt>
        <dd>{shipping === 0 ? "Gratis" : formatPrice(shipping)}</dd>
      </div>
      {missing > 0 && subtotalOre > 0 && <p className="rounded bg-brand-50 p-2 text-xs">Køb for {formatPrice(missing)} mere og få fri fragt.</p>}
      <div className="flex justify-between border-t border-ink-100 pt-2 text-base font-bold">
        <dt>Total</dt>
        <dd>{formatPrice(total)}</dd>
      </div>
      <div className="flex justify-between text-xs text-ink-500">
        <dt>Heraf moms</dt>
        <dd>{formatPrice(vatIncluded(total))}</dd>
      </div>
    </dl>
  );
}
