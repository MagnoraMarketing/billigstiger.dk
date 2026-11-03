import type { Category } from "./types";

/**
 * Category tree for BilligeStiger.dk.
 * Structure is based on common Danish ladder-market conventions (EN 131 types).
 * Texts are written for this shop — do not paste competitor copy here.
 */
export const categories: Category[] = [
  {
    slug: "trappestiger",
    name: "Trappestiger",
    ladderType: "trappestige",
    summary: "Fritstående stiger med trin på én eller begge sider – til hjemmet og værkstedet.",
    intro:
      "En trappestige står selv og er det oplagte valg til maling, lampeskift, lagerreoler og indendørs opgaver. Vælg mellem ensidet og dobbeltsidet adgang, og kig efter brede trin, sikkerhedsbøjle og EN 131-godkendelse, hvis stigen bruges professionelt.",
  },
  {
    slug: "kombistiger",
    name: "Kombistiger",
    ladderType: "kombistige",
    summary: "Flere stiger i én: trappestige, skydestige og arbejdsplatform.",
    intro:
      "Kombistigen kan stilles op som trappestige, foldes ud som skydestige og ofte bruges på trapper. Den giver mest stige for pengene, hvis du har mange forskellige opgaver og kun vil have én stige i garagen.",
  },
  {
    slug: "skydestiger",
    name: "Skydestiger",
    ladderType: "skydestige",
    summary: "2- og 3-delte stiger til tag, tagrender og facade.",
    intro:
      "Skydestiger består af to eller tre sektioner, der skydes op langs hinanden. De er velegnede til tagrender, facader og vinduespudsning i højden. Husk stabiliseringsbom i bunden og korrekt opstillingsvinkel (ca. 75°).",
  },
  {
    slug: "teleskopstiger",
    name: "Teleskopstiger",
    ladderType: "teleskopstige",
    summary: "Kompakte stiger, der kan skydes sammen til transport og opbevaring.",
    intro:
      "Teleskopstiger fylder minimalt og passer i bagagerummet. De er populære til håndværkere og i lejligheder med begrænset opbevaringsplads.",
  },
  {
    slug: "enkeltstiger",
    name: "Enkeltstiger",
    ladderType: "enkeltstige",
    summary: "Anlægsstiger i én sektion – enkle, lette og robuste.",
    intro:
      "Enkeltstiger (anlægsstiger) er den simpleste stigetype: én sektion, der stilles op mod en væg. De er lette at håndtere og velegnede til faste adgangsveje og kortere højder.",
  },
  {
    slug: "platformsstiger",
    name: "Platformsstiger",
    ladderType: "platformsstige",
    summary: "Stiger med stor ståplatform og gelænder – til længerevarende arbejde.",
    intro:
      "Platformsstiger og podiestiger giver en stor, sikker ståflade med gelænder hele vejen rundt. De bruges på lagre, i butikker og ved montage, hvor man står længe i samme højde.",
  },
  {
    slug: "tagstiger",
    name: "Tagstiger",
    ladderType: "tagstige",
    summary: "Stiger og tagkroge til sikker færdsel på taget.",
    intro:
      "Tagstiger lægges op ad tagfladen og hægtes over rygningen, så du kan komme sikkert til skorsten, antenne og solceller.",
  },
  {
    slug: "glasfiberstiger",
    name: "Glasfiberstiger",
    ladderType: "glasfiberstige",
    summary: "Ikke-ledende stiger til el-arbejde og installatører.",
    intro:
      "Glasfiberstiger leder ikke strøm og er derfor det sikre valg ved arbejde nær elinstallationer. De er tungere end aluminium men meget robuste.",
  },
  {
    slug: "rullestilladser",
    name: "Rullestilladser",
    ladderType: "rullestillads",
    summary: "Mobile stilladser til facade, loft og større arbejdsopgaver.",
    intro:
      "Et rullestillads giver en stor og stabil arbejdsplatform, der kan flyttes på hjul. Ideelt til maling af facader, lofter og montage over større flader.",
  },
  {
    slug: "skamler-og-trappetrin",
    name: "Skamler & trappetrin",
    ladderType: "skammel",
    summary: "Små trin og skamler til hjemmet, køkkenet og lageret.",
    intro:
      "Når du blot skal en halv meter op, er en skammel eller et trappetrin det hurtigste og sikreste valg.",
  },
  {
    slug: "tilbehoer",
    name: "Tilbehør",
    ladderType: "tilbehoer",
    summary: "Stigefødder, stabilisatorer, stigeholdere og spandkroge.",
    intro:
      "Gør din stige sikrere og mere praktisk med stabiliseringsbomme, gummifødder, vægafstandsholdere, stigekroge og opbevaringsbeslag.",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
