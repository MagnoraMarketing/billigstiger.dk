"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function MobileMenu({ categories }: { categories: Array<{ slug: string; name: string }> }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="md:hidden">
      <button type="button" className="rounded-lg p-2 hover:bg-ink-100" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
        <span className="sr-only">Menu</span>
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-full max-h-[80vh] overflow-y-auto border-b border-ink-100 bg-white shadow-lg">
          <form action="/soeg" role="search" className="flex p-4">
            <label htmlFor="mq" className="sr-only">
              Søg
            </label>
            <input id="mq" name="q" type="search" placeholder="Søg efter stiger" className="input rounded-r-none" />
            <button className="btn btn-secondary rounded-l-none">Søg</button>
          </form>
          <ul className="divide-y divide-ink-100 pb-2">
            <li>
              <Link href="/stiger" className="block px-4 py-3 font-semibold">
                Alle stiger
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/kategori/${c.slug}`} className="block px-4 py-3">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/guide/valg-af-stige" className="block px-4 py-3 text-brand-600">
                Guide: Hvilken stige skal jeg vælge?
              </Link>
            </li>
            <li>
              <Link href="/kontakt" className="block px-4 py-3">
                Kontakt
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
