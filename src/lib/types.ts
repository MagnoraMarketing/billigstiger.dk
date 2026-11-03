export type LadderType =
  | "trappestige"
  | "kombistige"
  | "skydestige"
  | "teleskopstige"
  | "enkeltstige"
  | "platformsstige"
  | "tagstige"
  | "glasfiberstige"
  | "rullestillads"
  | "skammel"
  | "tilbehoer";

export type Material = "aluminium" | "glasfiber" | "staal" | "trae" | "kombineret";

export interface Category {
  slug: string;
  name: string;
  /** Short text used on cards and in meta descriptions. */
  summary: string;
  /** Longer SEO / buying-guide intro shown on the category page. */
  intro: string;
  ladderType: LadderType;
  parent?: string;
}

export interface ProductSpecs {
  /** Max working height in metres. */
  workingHeight?: number;
  /** Ladder length (fully extended) in metres. */
  ladderLength?: number;
  /** Folded / transport length in metres. */
  transportLength?: number;
  /** Platform / top step height in metres. */
  platformHeight?: number;
  steps?: number;
  sections?: number;
  /** Max load in kg. */
  maxLoad?: number;
  weight?: number;
  material?: Material;
  standard?: string;
  professional?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export interface ProductImage {
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  brand: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  /** Price in DKK incl. VAT, in øre (integer) to avoid float issues. */
  priceOre: number;
  /** Optional "before" price in øre — only use with documented price history. */
  compareAtPriceOre?: number | null;
  stockStatus: "in_stock" | "backorder" | "out_of_stock" | "unknown";
  deliveryDays?: string;
  specs: ProductSpecs;
  images: ProductImage[];
  features: string[];
  relatedSlugs?: string[];
  isDemo?: boolean;
  updatedAt?: string;
}

export type SortKey = "popular" | "price-asc" | "price-desc" | "height-asc" | "height-desc" | "name";

export interface ProductFilters {
  category?: string;
  q?: string;
  material?: Material[];
  brand?: string[];
  minHeight?: number;
  maxHeight?: number;
  minPrice?: number;
  maxPrice?: number;
  minLoad?: number;
  professional?: boolean;
  inStock?: boolean;
  sort?: SortKey;
  page?: number;
}

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  priceOre: number;
  quantity: number;
}
