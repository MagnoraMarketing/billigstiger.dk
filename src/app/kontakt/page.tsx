import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { shop } from "@/lib/env";

export const metadata: Metadata = { title: "Kontakt", alternates: { canonical: "/kontakt" } };

export default function Page() {
  return (
    <ContentPage title="Kontakt os" path="/kontakt">
      <p>Har du spørgsmål til en stige, en ordre eller levering? Skriv til os – vi svarer typisk inden for én hverdag.</p>
      <ul>
        <li>
          E-mail: <a href={`mailto:${shop.email}`}>{shop.email}</a>
        </li>
        {shop.phone && (
          <li>
            Telefon: <a href={`tel:${shop.phone.replace(/\s/g, "")}`}>{shop.phone}</a>
          </li>
        )}
        {shop.address && <li>Adresse: {shop.address}</li>}
        {shop.cvr && <li>CVR: {shop.cvr}</li>}
      </ul>
      <h2>Få hjælp til at vælge stige</h2>
      <p>Fortæl os, hvad du skal bruge stigen til, og hvor højt du skal op – så finder vi den rigtige model til dig.</p>
    </ContentPage>
  );
}
