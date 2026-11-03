import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";

export const metadata: Metadata = {
  title: "Sikkert arbejde på stige – tjekliste",
  description: "Undgå fald fra stige: opstillingsvinkel, underlag, tre kontaktpunkter og andre gode råd.",
  alternates: { canonical: "/guide/sikkerhed" },
};

export default function Page() {
  return (
    <ContentPage title="Sikkert arbejde på stige" path="/guide/sikkerhed" crumbs={[{ name: "Guides", href: "/guide/valg-af-stige" }]}>
      <ol>
        <li>Efterse stigen før brug: ingen bøjede vanger, løse trin eller slidte fødder.</li>
        <li>Stil stigen på et fast, plant og skridsikkert underlag.</li>
        <li>Anlægsstiger stilles i ca. 75° vinkel (1 meter ud for hver 4 meter op).</li>
        <li>Stigen skal rage mindst 1 meter op over den kant, du skal træde ud på.</li>
        <li>Hold altid tre kontaktpunkter – to fødder og én hånd.</li>
        <li>Læn dig ikke ud over siden; flyt hellere stigen.</li>
        <li>Stå aldrig på de øverste trin, medmindre stigen er konstrueret til det.</li>
        <li>Brug stabiliseringsbom og vægafstandsholder, når det er muligt.</li>
      </ol>
      <p>Følg altid producentens brugsanvisning og Arbejdstilsynets vejledninger ved erhvervsmæssig brug.</p>
    </ContentPage>
  );
}
