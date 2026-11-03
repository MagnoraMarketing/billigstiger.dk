"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { formatNumber, materialLabels } from "@/lib/format";
import type { Facets } from "@/lib/catalog";

export function FilterPanel({ facets }: { facets: Facets }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const list = (key: string) => (params.get(key) ?? "").split(",").filter(Boolean);

  function update(mut: (p: URLSearchParams) => void) {
    const next = new URLSearchParams(params.toString());
    mut(next);
    next.delete("side");
    startTransition(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }));
  }

  function toggle(key: string, value: string) {
    update((p) => {
      const cur = new Set(list(key));
      if (cur.has(value)) cur.delete(value);
      else cur.add(value);
      if (cur.size) p.set(key, [...cur].join(","));
      else p.delete(key);
    });
  }

  function setValue(key: string, value: string) {
    update((p) => (value ? p.set(key, value) : p.delete(key)));
  }

  const active = ["materiale", "maerke", "hoejdeMin", "hoejdeMax", "prisMin", "prisMax", "belastning", "professionel", "lager"].some((k) =>
    params.has(k),
  );

  return (
    <div>
      <button type="button" className="btn btn-outline w-full lg:hidden" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? "Skjul filtre" : "Vis filtre"}
      </button>
      <div className={`${open ? "block" : "hidden"} mt-4 space-y-6 lg:mt-0 lg:block ${pending ? "opacity-60" : ""}`} aria-busy={pending}>
        {active && (
          <button type="button" className="text-sm font-medium text-brand-600 underline" onClick={() => router.push(pathname + (params.get("q") ? `?q=${encodeURIComponent(params.get("q")!)}` : ""))}>
            Nulstil alle filtre
          </button>
        )}

        <fieldset>
          <legend className="mb-2 font-semibold">Arbejdshøjde (m)</legend>
          <div className="flex items-center gap-2">
            <NumberBox label="Fra" name="hoejdeMin" placeholder={formatNumber(facets.heightRange[0])} value={params.get("hoejdeMin") ?? ""} onCommit={setValue} />
            <span aria-hidden="true">–</span>
            <NumberBox label="Til" name="hoejdeMax" placeholder={formatNumber(facets.heightRange[1])} value={params.get("hoejdeMax") ?? ""} onCommit={setValue} />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[
              ["Under 3 m", "", "3"],
              ["3–5 m", "3", "5"],
              ["5–8 m", "5", "8"],
              ["Over 8 m", "8", ""],
            ].map(([label, min, max]) => (
              <button
                key={label}
                type="button"
                className={`rounded-full border px-2.5 py-1 text-xs ${params.get("hoejdeMin") === (min || null) && params.get("hoejdeMax") === (max || null) ? "border-ink-900 bg-ink-900 text-white" : "border-ink-300 hover:bg-ink-100"}`}
                onClick={() =>
                  update((p) => {
                    if (min) p.set("hoejdeMin", min);
                    else p.delete("hoejdeMin");
                    if (max) p.set("hoejdeMax", max);
                    else p.delete("hoejdeMax");
                  })
                }
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 font-semibold">Pris (kr.)</legend>
          <div className="flex items-center gap-2">
            <NumberBox label="Fra" name="prisMin" placeholder={String(facets.priceRange[0])} value={params.get("prisMin") ?? ""} onCommit={setValue} />
            <span aria-hidden="true">–</span>
            <NumberBox label="Til" name="prisMax" placeholder={String(facets.priceRange[1])} value={params.get("prisMax") ?? ""} onCommit={setValue} />
          </div>
        </fieldset>

        {facets.materials.length > 0 && (
          <fieldset>
            <legend className="mb-2 font-semibold">Materiale</legend>
            {facets.materials.map((m) => (
              <Check key={m.value} label={`${materialLabels[m.value] ?? m.value} (${m.count})`} checked={list("materiale").includes(m.value)} onChange={() => toggle("materiale", m.value)} />
            ))}
          </fieldset>
        )}

        {facets.loads.length > 0 && (
          <fieldset>
            <legend className="mb-2 font-semibold">Min. belastning</legend>
            <select className="input" value={params.get("belastning") ?? ""} onChange={(e) => setValue("belastning", e.target.value)}>
              <option value="">Alle</option>
              {facets.loads.map((l) => (
                <option key={l} value={l}>
                  {l} kg eller mere
                </option>
              ))}
            </select>
          </fieldset>
        )}

        {facets.brands.length > 1 && (
          <fieldset>
            <legend className="mb-2 font-semibold">Mærke</legend>
            {facets.brands.map((b) => (
              <Check key={b.value} label={`${b.value} (${b.count})`} checked={list("maerke").includes(b.value)} onChange={() => toggle("maerke", b.value)} />
            ))}
          </fieldset>
        )}

        <fieldset>
          <legend className="mb-2 font-semibold">Andet</legend>
          <Check label="Kun professionelle (EN 131 Pro)" checked={params.get("professionel") === "1"} onChange={() => setValue("professionel", params.get("professionel") === "1" ? "" : "1")} />
          <Check label="Kun varer på lager" checked={params.get("lager") === "1"} onChange={() => setValue("lager", params.get("lager") === "1" ? "" : "1")} />
        </fieldset>
      </div>
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-ink-900" />
      {label}
    </label>
  );
}

function NumberBox({
  label,
  name,
  value,
  placeholder,
  onCommit,
}: {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  onCommit: (name: string, v: string) => void;
}) {
  const [v, setV] = useState(value);
  return (
    <label className="flex-1">
      <span className="sr-only">{label}</span>
      <input
        className="input"
        inputMode="decimal"
        value={v}
        placeholder={placeholder}
        onChange={(e) => setV(e.target.value.replace(/[^0-9.,]/g, ""))}
        onBlur={() => v !== value && onCommit(name, v.replace(",", "."))}
        onKeyDown={(e) => e.key === "Enter" && onCommit(name, v.replace(",", "."))}
      />
    </label>
  );
}
