"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const options = [
  ["popular", "Anbefalet"],
  ["price-asc", "Pris: lav til høj"],
  ["price-desc", "Pris: høj til lav"],
  ["height-asc", "Arbejdshøjde: lav til høj"],
  ["height-desc", "Arbejdshøjde: høj til lav"],
  ["name", "Navn A–Å"],
] as const;

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="whitespace-nowrap text-ink-500">Sortér efter</span>
      <select
        className="input w-auto"
        value={params.get("sort") ?? "popular"}
        onChange={(e) => {
          const p = new URLSearchParams(params.toString());
          if (e.target.value === "popular") p.delete("sort");
          else p.set("sort", e.target.value);
          p.delete("side");
          router.push(`${pathname}?${p.toString()}`, { scroll: false });
        }}
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
