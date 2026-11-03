/**
 * Pure helpers that turn raw scraped strings into structured values.
 * Kept free of Crawlee/Playwright so they can be unit-tested.
 */

/** "1.299,00 kr." | "DKK 1299.00" | "1 299,-" → 129900 (øre). Returns null if no price. */
export function parsePriceOre(input) {
  if (input == null) return null;
  if (typeof input === "number") return Math.round(input * 100);
  let s = String(input).replace(/\s| /g, "").replace(/kr\.?|dkk|,-/gi, "");
  const m = s.match(/\d[\d.,]*/);
  if (!m) return null;
  s = m[0];
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  if (lastComma > lastDot) {
    // Danish format: 1.299,00
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (lastDot > lastComma && lastComma !== -1) {
    // English format: 1,299.00
    s = s.replace(/,/g, "");
  } else if (lastDot !== -1 && s.length - lastDot - 1 === 3 && lastComma === -1) {
    // "1.299" — dot used as thousands separator
    s = s.replace(/\./g, "");
  }
  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n * 100) : null;
}

/** "5,6 m" → 5.6, "560 cm" → 5.6, "5600 mm" → 5.6 */
export function parseMeters(input) {
  if (input == null) return null;
  const m = String(input).replace(/ /g, " ").match(/(\d+(?:[.,]\d+)?)\s*(mm|cm|m|meter)?\b/i);
  if (!m) return null;
  let n = Number(m[1].replace(",", "."));
  const unit = (m[2] || "m").toLowerCase();
  if (unit === "cm") n /= 100;
  if (unit === "mm") n /= 1000;
  return Math.round(n * 100) / 100;
}

/** "150 kg" → 150 */
export function parseKg(input) {
  if (input == null) return null;
  const m = String(input).match(/(\d+(?:[.,]\d+)?)\s*kg/i) || String(input).match(/^\s*(\d+(?:[.,]\d+)?)\s*$/);
  return m ? Number(m[1].replace(",", ".")) : null;
}

export function parseInteger(input) {
  if (input == null) return null;
  const m = String(input).match(/\d+/);
  return m ? Number(m[0]) : null;
}

const SPEC_KEYS = [
  { key: "workingHeight", re: /arbejdsh(ø|oe)jde|working height/i, parse: parseMeters },
  { key: "ladderLength", re: /stigel(æ|ae)ngde|(max\.?|udtrukket|samlet) l(æ|ae)ngde|ladder length/i, parse: parseMeters },
  { key: "transportLength", re: /transport|sammenklappet|indskudt/i, parse: parseMeters },
  { key: "platformHeight", re: /platform|(ø|oe)verste trin|st(å|aa)h(ø|oe)jde/i, parse: parseMeters },
  { key: "steps", re: /antal trin|trin(?!.*h(ø|oe)jde)/i, parse: parseInteger },
  { key: "sections", re: /sektion|antal dele|delt/i, parse: parseInteger },
  { key: "maxLoad", re: /belastning|max.*kg|b(æ|ae)reevne|load/i, parse: parseKg },
  { key: "weight", re: /^v(æ|ae)gt|weight/i, parse: (v) => parseKg(v) ?? parseFloat(String(v).replace(",", ".")) },
  { key: "material", re: /materiale|material/i, parse: normalizeMaterial },
  { key: "standard", re: /standard|norm|godkend/i, parse: (v) => String(v).trim() },
];

export function normalizeMaterial(v) {
  const s = String(v).toLowerCase();
  if (/glasfiber|fiberglas|gfk/.test(s) && /alu/.test(s)) return "kombineret";
  if (/glasfiber|fiberglas|gfk/.test(s)) return "glasfiber";
  if (/alu/.test(s)) return "aluminium";
  if (/st(å|aa)l|steel/.test(s)) return "staal";
  if (/tr(æ|ae)|wood/.test(s)) return "trae";
  return s.trim() || null;
}

/** Maps a free-form spec table ({label: value}) to known spec keys; keeps the raw table too. */
export function normalizeSpecs(raw) {
  const specs = {};
  for (const [label, value] of Object.entries(raw || {})) {
    for (const def of SPEC_KEYS) {
      if (specs[def.key] != null) continue;
      if (def.re.test(label)) {
        const parsed = def.parse(value);
        if (parsed != null && parsed !== "" && !Number.isNaN(parsed)) specs[def.key] = parsed;
        break;
      }
    }
  }
  if (typeof specs.standard === "string") specs.professional = /prof/i.test(specs.standard);
  return specs;
}

/** Picks the first schema.org Product node from a list of JSON-LD blobs. */
export function findJsonLdProduct(blobs) {
  const visit = (node) => {
    if (!node || typeof node !== "object") return null;
    if (Array.isArray(node)) {
      for (const n of node) {
        const r = visit(n);
        if (r) return r;
      }
      return null;
    }
    const t = node["@type"];
    if (t === "Product" || (Array.isArray(t) && t.includes("Product"))) return node;
    if (node["@graph"]) return visit(node["@graph"]);
    return null;
  };
  for (const b of blobs) {
    try {
      const r = visit(typeof b === "string" ? JSON.parse(b) : b);
      if (r) return r;
    } catch {
      /* ignore invalid JSON-LD */
    }
  }
  return null;
}

/** Strips tracking params / fragments so the same page isn't crawled twice. */
export function canonicalUrl(u) {
  try {
    const url = new URL(u);
    url.hash = "";
    for (const k of [...url.searchParams.keys()]) {
      if (/^(utm_|gclid|fbclid|sessionid|sid)/i.test(k)) url.searchParams.delete(k);
    }
    return url.toString();
  } catch {
    return u;
  }
}
