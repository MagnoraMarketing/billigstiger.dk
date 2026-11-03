import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { shop } from "@/lib/env";

export const metadata: Metadata = { title: "Handelsbetingelser", alternates: { canonical: "/handelsbetingelser" } };

// NOTE: Template text. Must be reviewed and completed with company details before launch.
export default function Page() {
  return (
    <ContentPage title="Handelsbetingelser" path="/handelsbetingelser">
      <p>
        <em>Disse betingelser er en skabelon og skal gennemgås og tilpasses af ejeren inden lancering.</em>
      </p>
      <h2>1. Sælger</h2>
      <p>
        BilligeStiger.dk{shop.cvr ? `, CVR ${shop.cvr}` : ""}
        {shop.address ? `, ${shop.address}` : ""}. E-mail: {shop.email}.
      </p>
      <h2>2. Priser</h2>
      <p>Alle priser er i danske kroner inkl. 25% moms. Fragt fremgår af kurven, før ordren afgives.</p>
      <h2>3. Aftaleindgåelse og betaling</h2>
      <p>Aftalen er bindende, når du har modtaget vores ordrebekræftelse. Betalingsoplysninger fremgår af ordrebekræftelsen.</p>
      <h2>4. Levering</h2>
      <p>Se <a href="/fragt-og-levering">fragt og levering</a>.</p>
      <h2>5. Fortrydelsesret</h2>
      <p>
        Som forbruger har du 14 dages fortrydelsesret fra den dag, du modtager varen. Derudover tilbyder vi 30 dages returret. Du skal
        give os meddelelse på {shop.email}, og varen skal returneres i væsentligt samme stand og mængde. Du afholder selv
        returomkostningerne, medmindre andet er aftalt.
      </p>
      <h2>6. Reklamation</h2>
      <p>Du har 2 års reklamationsret efter købelovens regler. Reklamation skal ske inden rimelig tid efter, at manglen er opdaget.</p>
      <h2>7. Klageadgang</h2>
      <p>
        Du kan klage til Nævnenes Hus via <a href="https://naevneneshus.dk" rel="noopener">naevneneshus.dk</a> eller EU-Kommissionens
        online klageportal.
      </p>
    </ContentPage>
  );
}
