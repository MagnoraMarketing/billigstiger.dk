import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { shop } from "@/lib/env";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Fragt og levering", alternates: { canonical: "/fragt-og-levering" } };

export default function Page() {
  return (
    <ContentPage title="Fragt og levering" path="/fragt-og-levering">
      <p>Vi leverer til adresser i hele Danmark (ekskl. Færøerne og Grønland).</p>
      <h2>Fragtpriser</h2>
      <ul>
        <li>Fragt: {formatPrice(shop.shippingOre)} pr. ordre</li>
        <li>Fri fragt ved køb over {formatPrice(shop.freeShippingThresholdOre)}</li>
        <li>Lange stiger og stilladser kan kræve særlig fragt – vi kontakter dig, hvis det er tilfældet.</li>
      </ul>
      <h2>Leveringstid</h2>
      <p>Leveringstiden fremgår af hver produktside. Lagervarer afsendes normalt inden for 1–3 hverdage efter modtaget betaling.</p>
    </ContentPage>
  );
}
