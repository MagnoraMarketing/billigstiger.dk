import type { Metadata } from "next";
import { CheckoutForm } from "./CheckoutForm";
import { shop } from "@/lib/env";

export const metadata: Metadata = { title: "Kasse", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-3xl font-extrabold">Kasse</h1>
      <CheckoutForm freeShippingThresholdOre={shop.freeShippingThresholdOre} />
    </div>
  );
}
