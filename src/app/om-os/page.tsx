import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";

export const metadata: Metadata = { title: "Om os", alternates: { canonical: "/om-os" } };

export default function Page() {
  return (
    <ContentPage title="Om BilligeStiger.dk" path="/om-os">
      <p>BilligeStiger.dk er en dansk webshop specialiseret i stiger, stilladser og tilbehør. Vi vil gøre det nemt at finde den rigtige stige til opgaven – til en fair pris.</p>
      <h2>Hvorfor handle hos os?</h2>
      <ul>
        <li>Skarpe priser på stiger til både private og professionelle</li>
        <li>Tydelige specifikationer: arbejdshøjde, belastning, materiale og standard</li>
        <li>Rådgivning, hvis du er i tvivl om, hvilken stige du skal vælge</li>
        <li>Levering i hele Danmark</li>
      </ul>
    </ContentPage>
  );
}
