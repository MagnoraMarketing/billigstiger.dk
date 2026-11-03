import type { Metadata } from "next";
import { CartView } from "./CartView";
import { shop } from "@/lib/env";

export const metadata: Metadata = { title: "Indkøbskurv", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-3xl font-extrabold">Indkøbskurv</h1>
      <CartView freeShippingThresholdOre={shop.freeShippingThresholdOre} />
    </div>
  );
}
