import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { shop } from "@/lib/env";

export const metadata: Metadata = { title: "Privatlivspolitik", alternates: { canonical: "/privatlivspolitik" } };

// NOTE: Template text. Must be reviewed before launch.
export default function Page() {
  return (
    <ContentPage title="Privatlivspolitik" path="/privatlivspolitik">
      <p>
        <em>Skabelon – skal gennemgås og tilpasses inden lancering.</em>
      </p>
      <h2>Dataansvarlig</h2>
      <p>BilligeStiger.dk{shop.cvr ? `, CVR ${shop.cvr}` : ""}. Kontakt: {shop.email}.</p>
      <h2>Hvilke oplysninger behandler vi?</h2>
      <p>Når du afgiver en ordre, behandler vi navn, adresse, e-mail, telefonnummer og evt. firma/CVR for at kunne levere og fakturere din ordre (GDPR art. 6, stk. 1, litra b og c).</p>
      <h2>Opbevaring</h2>
      <p>Ordreoplysninger opbevares i 5 år efter regnskabsårets afslutning jf. bogføringsloven.</p>
      <h2>Cookies</h2>
      <p>Webshoppen bruger kun teknisk nødvendig lokal lagring i din browser til at huske indholdet af din indkøbskurv. Vi bruger ikke sporings- eller marketingcookies.</p>
      <h2>Dine rettigheder</h2>
      <p>Du har ret til indsigt, berigtigelse, sletning, begrænsning og dataportabilitet samt ret til at klage til Datatilsynet.</p>
    </ContentPage>
  );
}
