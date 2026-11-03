import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/ContentPage";

export const metadata: Metadata = {
  title: "Hvilken stige skal jeg vælge? Guide til valg af stige",
  description: "Sådan vælger du den rigtige stige: arbejdshøjde, stigetype, materiale, belastning og EN 131-standard forklaret.",
  alternates: { canonical: "/guide/valg-af-stige" },
};

export default function Page() {
  return (
    <ContentPage title="Hvilken stige skal jeg vælge?" path="/guide/valg-af-stige" crumbs={[{ name: "Guides", href: "/guide/valg-af-stige" }]}>
      <p>Den rigtige stige afhænger af tre ting: hvor højt du skal op, hvad du skal lave, og hvor ofte du bruger den.</p>
      <h2>1. Find den nødvendige arbejdshøjde</h2>
      <p>
        Arbejdshøjden er den højde, du komfortabelt kan arbejde i, når du står på det højeste tilladte trin – typisk ca. 1 meter over
        trinnet. Mål højden til det punkt, du skal nå (fx tagrenden), og vælg en stige med en arbejdshøjde, der er lidt højere.
      </p>
      <h2>2. Vælg stigetype</h2>
      <ul>
        <li><Link href="/kategori/trappestiger">Trappestige</Link> – fritstående, til indendørs opgaver op til ca. 4 m.</li>
        <li><Link href="/kategori/kombistiger">Kombistige</Link> – fleksibel alt-i-én, god til både inde og ude.</li>
        <li><Link href="/kategori/skydestiger">Skydestige</Link> – til tag, tagrender og facade i store højder.</li>
        <li><Link href="/kategori/teleskopstiger">Teleskopstige</Link> – kompakt, når pladsen er trang.</li>
        <li><Link href="/kategori/platformsstiger">Platformsstige</Link> – når du skal stå længe i samme højde.</li>
        <li><Link href="/kategori/rullestilladser">Rullestillads</Link> – til større flader og længerevarende arbejde.</li>
      </ul>
      <h2>3. Materiale</h2>
      <p>Aluminium er let og vejrbestandigt. Glasfiber er ikke-ledende og skal vælges til el-arbejde. Træ ses sjældnere i dag.</p>
      <h2>4. Belastning og standard</h2>
      <p>
        Stiger efter EN 131 er godkendt til mindst 150 kg. Bruger du stigen erhvervsmæssigt, skal den være godkendt som
        “Professionel”. Læs mere i vores <Link href="/guide/en-131">guide til EN 131</Link>.
      </p>
      <h2>Hurtig huskeregel</h2>
      <table>
        <tbody>
          <tr><th className="pr-4 text-left">Opgave</th><th className="text-left">Anbefalet</th></tr>
          <tr><td className="pr-4">Skifte pære, male loft</td><td>Trappestige 4–6 trin</td></tr>
          <tr><td className="pr-4">Rense tagrende (1-plan)</td><td>2-delt skydestige eller kombistige</td></tr>
          <tr><td className="pr-4">Facade på 2-plans hus</td><td>3-delt skydestige eller rullestillads</td></tr>
          <tr><td className="pr-4">El-installation</td><td>Glasfiberstige</td></tr>
        </tbody>
      </table>
    </ContentPage>
  );
}
