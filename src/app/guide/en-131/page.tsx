import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";

export const metadata: Metadata = {
  title: "Hvad betyder EN 131? Standarden for stiger forklaret",
  description: "EN 131 er den europæiske standard for bærbare stiger. Læs forskellen på professionel og ikke-professionel godkendelse.",
  alternates: { canonical: "/guide/en-131" },
};

export default function Page() {
  return (
    <ContentPage title="Hvad betyder EN 131?" path="/guide/en-131" crumbs={[{ name: "Guides", href: "/guide/valg-af-stige" }]}>
      <p>EN 131 er den fælles europæiske standard for bærbare stiger. Den stiller krav til konstruktion, styrke, stabilitet og mærkning.</p>
      <h2>Professionel eller ikke-professionel</h2>
      <p>
        Standarden skelner mellem stiger til professionel brug og stiger til private. Professionelle stiger testes med flere
        belastningscyklusser og er beregnet til daglig brug på arbejdspladser.
      </p>
      <h2>Stabiliseringsbom</h2>
      <p>Anlægsstiger over en vis længde skal have en bredere fod/stabiliseringsbom for at reducere risikoen for, at stigen vælter sidelæns.</p>
      <h2>Mærkning</h2>
      <p>En godkendt stige er mærket med standard, maksimal belastning, brugsanvisning og piktogrammer for sikker brug.</p>
    </ContentPage>
  );
}
