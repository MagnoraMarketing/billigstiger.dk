import Link from "next/link";
import { categories } from "@/lib/categories";
import { shop } from "@/lib/env";

export function Footer() {
  return (
    <footer className="mt-16 bg-ink-900 text-ink-300">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-extrabold text-white">
            Billige<span className="text-brand-400">Stiger</span>.dk
          </p>
          <p className="mt-2 text-sm">Stiger, stilladser og tilbehør til skarpe priser – til hjemmet og til professionelle.</p>
          <p className="mt-4 text-sm">
            <a href={`mailto:${shop.email}`} className="hover:text-white">
              {shop.email}
            </a>
            {shop.phone && (
              <>
                <br />
                <a href={`tel:${shop.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {shop.phone}
                </a>
              </>
            )}
            {shop.cvr && (
              <>
                <br />
                CVR: {shop.cvr}
              </>
            )}
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">Kategorier</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {categories.slice(0, 7).map((c) => (
              <li key={c.slug}>
                <Link href={`/kategori/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Kundeservice</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li><Link href="/kontakt" className="hover:text-white">Kontakt os</Link></li>
            <li><Link href="/fragt-og-levering" className="hover:text-white">Fragt og levering</Link></li>
            <li><Link href="/handelsbetingelser" className="hover:text-white">Handelsbetingelser</Link></li>
            <li><Link href="/privatlivspolitik" className="hover:text-white">Privatlivspolitik</Link></li>
            <li><Link href="/om-os" className="hover:text-white">Om BilligeStiger.dk</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Guides</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li><Link href="/guide/valg-af-stige" className="hover:text-white">Hvilken stige skal jeg vælge?</Link></li>
            <li><Link href="/guide/en-131" className="hover:text-white">Hvad betyder EN 131?</Link></li>
            <li><Link href="/guide/sikkerhed" className="hover:text-white">Sikkert arbejde på stige</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-800">
        <p className="container-page py-4 text-xs">© {new Date().getFullYear()} BilligeStiger.dk · Alle priser er inkl. 25% moms</p>
      </div>
    </footer>
  );
}
