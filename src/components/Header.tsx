import Link from "next/link";
import { categories } from "@/lib/categories";
import { CartLink } from "./CartLink";
import { MobileMenu } from "./MobileMenu";

const mainNav = categories.filter((c) =>
  ["trappestiger", "kombistiger", "skydestiger", "teleskopstiger", "platformsstiger", "rullestilladser", "tilbehoer"].includes(c.slug),
);

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/95 backdrop-blur">
      <div className="bg-ink-900 text-white">
        <div className="container-page flex h-9 items-center justify-center gap-6 text-xs sm:justify-between">
          <span>✓ Fri fragt over 999 kr.</span>
          <span className="hidden sm:inline">✓ 30 dages returret</span>
          <span className="hidden md:inline">✓ Sikker betaling</span>
          <span className="hidden lg:inline">✓ Rådgivning om valg af stige</span>
        </div>
      </div>
      <div className="container-page flex h-16 items-center gap-4">
        <MobileMenu categories={categories.map(({ slug, name }) => ({ slug, name }))} />
        <Link href="/" className="flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-tight" aria-label="BilligeStiger.dk – forside">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-400 text-ink-900" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
              <path d="M8 3 6 21M16 3l2 18M7.5 8h9M7 13h10M6.5 18h11" />
            </svg>
          </span>
          <span>
            Billige<span className="text-brand-600">Stiger</span>
            <span className="text-ink-500">.dk</span>
          </span>
        </Link>
        <form action="/soeg" role="search" className="mx-auto hidden max-w-xl flex-1 md:flex">
          <label htmlFor="q" className="sr-only">
            Søg efter stiger
          </label>
          <input id="q" name="q" type="search" placeholder="Søg fx 'trappestige 5 trin' eller varenummer" className="input rounded-r-none" />
          <button className="btn btn-secondary rounded-l-none" type="submit">
            Søg
          </button>
        </form>
        <CartLink />
      </div>
      <nav aria-label="Kategorier" className="hidden border-t border-ink-100 md:block">
        <ul className="container-page flex h-11 items-center gap-6 overflow-x-auto text-sm font-medium">
          <li>
            <Link href="/stiger" className="hover:text-brand-600">
              Alle stiger
            </Link>
          </li>
          {mainNav.map((c) => (
            <li key={c.slug} className="whitespace-nowrap">
              <Link href={`/kategori/${c.slug}`} className="hover:text-brand-600">
                {c.name}
              </Link>
            </li>
          ))}
          <li className="whitespace-nowrap">
            <Link href="/guide/valg-af-stige" className="text-brand-600 hover:underline">
              Hvilken stige skal jeg vælge?
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
