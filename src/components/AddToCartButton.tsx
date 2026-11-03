"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/types";

export function AddToCartButton({
  product,
  withQuantity = false,
  className = "",
}: {
  product: Pick<Product, "id" | "slug" | "name" | "sku" | "priceOre" | "stockStatus">;
  withQuantity?: boolean;
  className?: string;
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const disabled = product.stockStatus === "out_of_stock";

  function onAdd() {
    add({ productId: product.id, slug: product.slug, name: product.name, sku: product.sku, priceOre: product.priceOre }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className={`flex items-stretch gap-2 ${className}`}>
      {withQuantity && (
        <label className="flex items-center rounded-lg border border-ink-300">
          <span className="sr-only">Antal</span>
          <button type="button" className="px-3 text-lg" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Færre">
            −
          </button>
          <input
            type="number"
            min={1}
            max={99}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
            className="w-12 text-center [appearance:textfield]"
          />
          <button type="button" className="px-3 text-lg" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Flere">
            +
          </button>
        </label>
      )}
      <button type="button" onClick={onAdd} disabled={disabled} className="btn btn-primary flex-1" aria-live="polite">
        {disabled ? "Udsolgt" : added ? "✓ Lagt i kurven" : "Læg i kurv"}
      </button>
    </div>
  );
}
