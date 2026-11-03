import Link from "next/link";
import { siteUrl } from "@/lib/env";
import { JsonLd } from "./JsonLd";

export interface Crumb {
  name: string;
  href: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "Forside", href: "/" }, ...items];
  return (
    <nav aria-label="Brødkrumme" className="text-sm text-ink-500">
      <ol className="flex flex-wrap items-center gap-1">
        {all.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === all.length - 1 ? (
              <span aria-current="page" className="text-ink-700">
                {c.name}
              </span>
            ) : (
              <Link href={c.href} className="hover:underline">
                {c.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${siteUrl}${c.href}` })),
        }}
      />
    </nav>
  );
}
