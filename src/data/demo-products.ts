import type { Material, Product } from "@/lib/types";

/**
 * DEMO CATALOGUE
 * ----------------------------------------------------------------------------
 * These products are placeholders so the shop can be developed, reviewed and
 * tested before the real supplier catalogue is imported into data/products.json.
 * Names, specs and prices are ILLUSTRATIVE ONLY and are flagged `isDemo: true`.
 * The UI shows a clear demo banner whenever demo products are served.
 * Never deploy demo data as the real catalogue.
 */

interface Template {
  category: string;
  base: string;
  material: Material;
  variants: Array<{
    label: string;
    workingHeight: number;
    ladderLength?: number;
    transportLength?: number;
    platformHeight?: number;
    steps?: number;
    sections?: number;
    weight: number;
    price: number;
  }>;
  maxLoad: number;
  professional: boolean;
  brand: string;
  features: string[];
  blurb: string;
}

const templates: Template[] = [
  {
    category: "trappestiger",
    base: "Aluminium trappestige ensidet",
    material: "aluminium",
    maxLoad: 150,
    professional: true,
    brand: "DemoPro",
    blurb: "Ensidet trappestige med brede, riflede trin og sikkerhedsbøjle.",
    features: ["Brede trin (8 cm) med skridsikker profil", "Værktøjsbakke på topplatform", "Sikkerhedsbøjle", "Skridsikre fødder"],
    variants: [
      { label: "3 trin", steps: 3, workingHeight: 2.6, platformHeight: 0.65, weight: 4.1, price: 499 },
      { label: "4 trin", steps: 4, workingHeight: 2.85, platformHeight: 0.85, weight: 4.9, price: 599 },
      { label: "5 trin", steps: 5, workingHeight: 3.1, platformHeight: 1.1, weight: 5.6, price: 699 },
      { label: "6 trin", steps: 6, workingHeight: 3.35, platformHeight: 1.3, weight: 6.4, price: 799 },
      { label: "8 trin", steps: 8, workingHeight: 3.85, platformHeight: 1.75, weight: 8.2, price: 1049 },
    ],
  },
  {
    category: "trappestiger",
    base: "Dobbeltsidet trappestige",
    material: "aluminium",
    maxLoad: 150,
    professional: true,
    brand: "DemoPro",
    blurb: "Trappestige med adgang fra begge sider – to personer kan arbejde samtidig.",
    features: ["Adgang fra begge sider", "Sammenklappelig til transport", "Spredningssikring i stålwire", "EN 131 professionel"],
    variants: [
      { label: "2x4 trin", steps: 8, workingHeight: 2.9, ladderLength: 1.0, weight: 6.0, price: 849 },
      { label: "2x6 trin", steps: 12, workingHeight: 3.4, ladderLength: 1.5, weight: 8.4, price: 1099 },
      { label: "2x8 trin", steps: 16, workingHeight: 3.9, ladderLength: 2.0, weight: 11.0, price: 1449 },
    ],
  },
  {
    category: "kombistiger",
    base: "Kombistige 3-delt",
    material: "aluminium",
    maxLoad: 150,
    professional: false,
    brand: "DemoLine",
    blurb: "Alsidig 3-delt kombistige: trappestige, skydestige og trappeopstilling.",
    features: ["Kan bruges som trappestige, skydestige og på trapper", "Stabiliseringsbom", "Låsebeslag i stål", "Hjul til nem transport"],
    variants: [
      { label: "3x6 trin", sections: 3, steps: 18, workingHeight: 5.7, ladderLength: 4.7, transportLength: 1.8, weight: 11.5, price: 1299 },
      { label: "3x8 trin", sections: 3, steps: 24, workingHeight: 7.2, ladderLength: 6.1, transportLength: 2.4, weight: 15.0, price: 1599 },
      { label: "3x10 trin", sections: 3, steps: 30, workingHeight: 8.5, ladderLength: 7.4, transportLength: 2.9, weight: 18.9, price: 1999 },
    ],
  },
  {
    category: "kombistiger",
    base: "Multistige 4x4 leddelt",
    material: "aluminium",
    maxLoad: 150,
    professional: false,
    brand: "DemoLine",
    blurb: "Leddelt multistige med fire led – kan blive til stillads-bukke, trappestige eller lang anlægsstige.",
    features: ["Kan bruges i over 10 positioner", "Automatiske låseled", "Kompakt foldet mål", "Inkl. platformsplade (ekstra tilbehør)"],
    variants: [
      { label: "4x3 trin", steps: 12, workingHeight: 4.5, ladderLength: 3.5, transportLength: 0.95, weight: 10.8, price: 1149 },
      { label: "4x4 trin", steps: 16, workingHeight: 5.6, ladderLength: 4.6, transportLength: 1.2, weight: 13.2, price: 1399 },
      { label: "4x5 trin", steps: 20, workingHeight: 6.8, ladderLength: 5.8, transportLength: 1.5, weight: 16.0, price: 1699 },
    ],
  },
  {
    category: "skydestiger",
    base: "Skydestige 2-delt",
    material: "aluminium",
    maxLoad: 150,
    professional: true,
    brand: "DemoPro",
    blurb: "2-delt skydestige med stabiliseringsbom – til tagrender og facade.",
    features: ["Stabiliseringsbom for ekstra stabilitet", "Faldsikre stigekroge", "D-formede trin", "Rulleskinner på overdelen"],
    variants: [
      { label: "2x10 trin", sections: 2, steps: 20, workingHeight: 5.6, ladderLength: 4.6, transportLength: 2.9, weight: 10.6, price: 1199 },
      { label: "2x12 trin", sections: 2, steps: 24, workingHeight: 6.6, ladderLength: 5.6, transportLength: 3.4, weight: 12.8, price: 1449 },
      { label: "2x14 trin", sections: 2, steps: 28, workingHeight: 7.5, ladderLength: 6.5, transportLength: 4.0, weight: 15.2, price: 1749 },
    ],
  },
  {
    category: "skydestiger",
    base: "Skydestige 3-delt",
    material: "aluminium",
    maxLoad: 150,
    professional: true,
    brand: "DemoPro",
    blurb: "Kraftig 3-delt skydestige til store højder.",
    features: ["Tre sektioner til store højder", "Bred stabiliseringsbom", "Kan også bruges som trappestige", "EN 131 professionel"],
    variants: [
      { label: "3x10 trin", sections: 3, steps: 30, workingHeight: 7.8, ladderLength: 6.8, transportLength: 2.9, weight: 17.5, price: 1899 },
      { label: "3x12 trin", sections: 3, steps: 36, workingHeight: 9.2, ladderLength: 8.2, transportLength: 3.4, weight: 21.0, price: 2299 },
      { label: "3x14 trin", sections: 3, steps: 42, workingHeight: 10.6, ladderLength: 9.6, transportLength: 4.0, weight: 25.5, price: 2799 },
    ],
  },
  {
    category: "teleskopstiger",
    base: "Teleskopstige",
    material: "aluminium",
    maxLoad: 150,
    professional: false,
    brand: "DemoLine",
    blurb: "Kompakt teleskopstige, der kan skydes sammen til under 1 meter.",
    features: ["Soft-close mekanisme", "Låser automatisk på hvert trin", "Inkl. bæretaske", "Fylder minimalt"],
    variants: [
      { label: "2,6 m", workingHeight: 3.6, ladderLength: 2.6, transportLength: 0.75, steps: 9, weight: 7.2, price: 749 },
      { label: "3,2 m", workingHeight: 4.2, ladderLength: 3.2, transportLength: 0.8, steps: 11, weight: 9.0, price: 899 },
      { label: "3,8 m", workingHeight: 4.8, ladderLength: 3.8, transportLength: 0.85, steps: 13, weight: 10.8, price: 1099 },
    ],
  },
  {
    category: "enkeltstiger",
    base: "Enkeltstige / anlægsstige",
    material: "aluminium",
    maxLoad: 150,
    professional: true,
    brand: "DemoPro",
    blurb: "Let og robust anlægsstige i én sektion.",
    features: ["Én sektion – intet at justere", "Skridsikre fødder", "Lav vægt", "Kan monteres med vægafstandsholder"],
    variants: [
      { label: "8 trin", steps: 8, workingHeight: 3.3, ladderLength: 2.3, weight: 3.8, price: 449 },
      { label: "12 trin", steps: 12, workingHeight: 4.4, ladderLength: 3.4, weight: 5.6, price: 649 },
      { label: "16 trin", steps: 16, workingHeight: 5.5, ladderLength: 4.5, weight: 7.4, price: 849 },
    ],
  },
  {
    category: "platformsstiger",
    base: "Platformsstige med gelænder",
    material: "aluminium",
    maxLoad: 150,
    professional: true,
    brand: "DemoPro",
    blurb: "Mobil platformsstige med stor ståflade og gelænder hele vejen rundt.",
    features: ["Ståflade 60x40 cm", "Gelænder på tre sider", "Fjederbelastede hjul", "Værktøjskrog"],
    variants: [
      { label: "4 trin", steps: 4, platformHeight: 0.95, workingHeight: 2.95, weight: 15.0, price: 2499 },
      { label: "6 trin", steps: 6, platformHeight: 1.45, workingHeight: 3.45, weight: 19.0, price: 2999 },
      { label: "8 trin", steps: 8, platformHeight: 1.9, workingHeight: 3.9, weight: 24.0, price: 3699 },
    ],
  },
  {
    category: "tagstiger",
    base: "Tagstige med rygningskrog",
    material: "aluminium",
    maxLoad: 150,
    professional: false,
    brand: "DemoLine",
    blurb: "Tagstige med rygningskrog og hjul – lægges op ad taget.",
    features: ["Rygningskrog", "Hjul til at rulle stigen op", "Gummibelagte trin", "Kan forlænges med ekstra sektion"],
    variants: [
      { label: "2,9 m", ladderLength: 2.9, workingHeight: 2.9, steps: 10, weight: 5.5, price: 999 },
      { label: "4,1 m", ladderLength: 4.1, workingHeight: 4.1, steps: 14, weight: 7.6, price: 1299 },
    ],
  },
  {
    category: "glasfiberstiger",
    base: "Glasfiber trappestige",
    material: "glasfiber",
    maxLoad: 150,
    professional: true,
    brand: "DemoPro",
    blurb: "Ikke-ledende trappestige til el-arbejde.",
    features: ["Ikke-ledende vanger i glasfiber", "Aluminiumstrin", "Stor topplatform", "EN 131 professionel"],
    variants: [
      { label: "5 trin", steps: 5, workingHeight: 3.1, platformHeight: 1.1, weight: 8.4, price: 1399 },
      { label: "7 trin", steps: 7, workingHeight: 3.6, platformHeight: 1.55, weight: 10.8, price: 1699 },
    ],
  },
  {
    category: "rullestilladser",
    base: "Rullestillads aluminium",
    material: "aluminium",
    maxLoad: 200,
    professional: true,
    brand: "DemoPro",
    blurb: "Mobilt aluminiumsstillads med bremsehjul og gelænder.",
    features: ["Bremsehjul", "Platform med lem", "Fodlister", "Hurtig samling uden værktøj"],
    variants: [
      { label: "Arbejdshøjde 4 m", platformHeight: 2.0, workingHeight: 4.0, weight: 60, price: 4999 },
      { label: "Arbejdshøjde 6 m", platformHeight: 4.0, workingHeight: 6.0, weight: 95, price: 7499 },
    ],
  },
  {
    category: "skamler-og-trappetrin",
    base: "Trappetrin",
    material: "aluminium",
    maxLoad: 150,
    professional: false,
    brand: "DemoLine",
    blurb: "Let trappetrin til køkkenet og bryggerset.",
    features: ["Foldes fladt sammen", "Skridsikre trin", "Bærehåndtag"],
    variants: [
      { label: "2 trin", steps: 2, platformHeight: 0.45, workingHeight: 2.4, weight: 2.4, price: 249 },
      { label: "3 trin", steps: 3, platformHeight: 0.67, workingHeight: 2.65, weight: 3.3, price: 329 },
    ],
  },
  {
    category: "tilbehoer",
    base: "Stabiliseringsbom til stige",
    material: "aluminium",
    maxLoad: 0,
    professional: false,
    brand: "DemoLine",
    blurb: "Eftermonterbar stabiliseringsbom til skyde- og enkeltstiger.",
    features: ["Øger stabiliteten markant", "Passer til de fleste stigevanger", "Inkl. beslag"],
    variants: [{ label: "100 cm", workingHeight: 0, weight: 2.0, price: 299 }],
  },
  {
    category: "tilbehoer",
    base: "Vægafstandsholder",
    material: "aluminium",
    maxLoad: 0,
    professional: false,
    brand: "DemoLine",
    blurb: "Holder stigen fri af tagrende og facade.",
    features: ["Beskytter tagrenden", "Gummiendestykker", "Hurtig montering"],
    variants: [{ label: "Standard", workingHeight: 0, weight: 1.6, price: 349 }],
  },
];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

let counter = 1000;

export const demoProducts: Product[] = templates.flatMap((t) => {
  const family = t.variants.map((v) => {
    counter += 1;
    const name = `${t.base} ${v.label}`;
    const slug = slugify(name);
    const product: Product = {
      id: `demo-${counter}`,
      slug,
      sku: `BS-${counter}`,
      name,
      brand: t.brand,
      categorySlug: t.category,
      shortDescription: t.blurb,
      description: `${t.blurb} Denne model er en demovare, der viser, hvordan produktsiden ser ud, når det rigtige sortiment er importeret. Specifikationer og priser er kun til illustration.`,
      priceOre: v.price * 100,
      compareAtPriceOre: null,
      stockStatus: counter % 7 === 0 ? "backorder" : "in_stock",
      deliveryDays: counter % 7 === 0 ? "5-10 hverdage" : "1-3 hverdage",
      specs: {
        workingHeight: v.workingHeight || undefined,
        ladderLength: v.ladderLength,
        transportLength: v.transportLength,
        platformHeight: v.platformHeight,
        steps: v.steps,
        sections: v.sections,
        maxLoad: t.maxLoad || undefined,
        weight: v.weight,
        material: t.material,
        standard: t.maxLoad ? (t.professional ? "EN 131 Professionel" : "EN 131 Ikke-professionel") : undefined,
        professional: t.professional,
      },
      images: [],
      features: t.features,
      isDemo: true,
    };
    return product;
  });
  const slugs = family.map((p) => p.slug);
  family.forEach((p) => (p.relatedSlugs = slugs.filter((s) => s !== p.slug)));
  return family;
});
