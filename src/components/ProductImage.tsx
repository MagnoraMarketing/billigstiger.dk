import { getCategory } from "@/lib/categories";
import type { Product } from "@/lib/types";
import { LadderIllustration } from "./LadderIllustration";

export function ProductImage({ product, className = "", priority = false }: { product: Product; className?: string; priority?: boolean }) {
  const img = product.images[0];
  if (img) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={img.url}
        alt={img.alt || product.name}
        className={`h-full w-full object-contain ${className}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }
  const type = getCategory(product.categorySlug)?.ladderType ?? "enkeltstige";
  return (
    <div className={`flex h-full w-full items-center justify-center ${className}`}>
      <LadderIllustration type={type} className="h-4/5 w-4/5" />
      <span className="sr-only">Illustration af {product.name}</span>
    </div>
  );
}
