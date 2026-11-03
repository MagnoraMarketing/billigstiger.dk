const dkk = new Intl.NumberFormat("da-DK", { style: "currency", currency: "DKK", minimumFractionDigits: 2 });
const num = new Intl.NumberFormat("da-DK", { maximumFractionDigits: 2 });

export function formatPrice(ore: number): string {
  return dkk.format(ore / 100);
}

export function formatMeters(m?: number): string {
  return m ? `${num.format(m)} m` : "–";
}

export function formatNumber(n: number): string {
  return num.format(n);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const materialLabels: Record<string, string> = {
  aluminium: "Aluminium",
  glasfiber: "Glasfiber",
  staal: "Stål",
  trae: "Træ",
  kombineret: "Kombineret",
};

export const stockLabels: Record<string, string> = {
  in_stock: "På lager",
  backorder: "Bestillingsvare",
  out_of_stock: "Udsolgt",
  unknown: "Kontakt os for levering",
};
