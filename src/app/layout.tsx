import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { DemoBanner } from "@/components/DemoBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { isDemoCatalog } from "@/lib/catalog";
import { shop, siteName, siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BilligeStiger.dk – Stiger og stilladser til skarpe priser",
    template: "%s | BilligeStiger.dk",
  },
  description:
    "Køb trappestiger, kombistiger, skydestiger, teleskopstiger og rullestilladser til skarpe priser. Hurtig levering i hele Danmark.",
  applicationName: siteName,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "da_DK", siteName, url: siteUrl },
  robots: process.env.NEXT_PUBLIC_NOINDEX === "1" ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = { themeColor: "#0f172a" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const demo = await isDemoCatalog();
  return (
    <html lang="da">
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">
          Gå til indhold
        </a>
        <CartProvider>
          {demo && <DemoBanner />}
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </CartProvider>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "OnlineStore",
            name: siteName,
            url: siteUrl,
            email: shop.email,
            ...(shop.phone ? { telephone: shop.phone } : {}),
            ...(shop.cvr ? { vatID: `DK${shop.cvr}` } : {}),
          }}
        />
      </body>
    </html>
  );
}
