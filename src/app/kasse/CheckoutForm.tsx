"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { OrderSummary } from "@/components/OrderSummary";
import { formatPrice } from "@/lib/format";

const fields: Array<{ name: string; label: string; type?: string; autoComplete?: string; required?: boolean; half?: boolean }> = [
  { name: "name", label: "Fulde navn", autoComplete: "name", required: true },
  { name: "company", label: "Firma (valgfrit)", autoComplete: "organization", half: true },
  { name: "cvr", label: "CVR (valgfrit)", half: true },
  { name: "email", label: "E-mail", type: "email", autoComplete: "email", required: true, half: true },
  { name: "phone", label: "Telefon", type: "tel", autoComplete: "tel", required: true, half: true },
  { name: "address", label: "Adresse", autoComplete: "street-address", required: true },
  { name: "zip", label: "Postnr.", autoComplete: "postal-code", required: true, half: true },
  { name: "city", label: "By", autoComplete: "address-level2", required: true, half: true },
];

export function CheckoutForm({ freeShippingThresholdOre }: { freeShippingThresholdOre: number }) {
  const { lines, ready, clear } = useCart();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  if (!ready) return <p className="text-ink-500">Indlæser…</p>;
  if (lines.length === 0)
    return (
      <p>
        Din kurv er tom.{" "}
        <Link href="/stiger" className="underline">
          Find en stige
        </Link>
      </p>
    );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    setFieldErrors({});
    const fd = new FormData(e.currentTarget);
    const customer = Object.fromEntries(
      ["name", "company", "cvr", "email", "phone", "address", "zip", "city", "note"].map((k) => [k, String(fd.get(k) ?? "")]),
    );
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          lines: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
          acceptTerms: fd.get("acceptTerms") === "on",
          website: String(fd.get("website") ?? ""),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Noget gik galt. Prøv igen.");
        setFieldErrors(data.issues ?? {});
        setStatus("idle");
        return;
      }
      clear();
      router.push(`/kasse/tak?ordre=${encodeURIComponent(data.orderNumber)}`);
    } catch {
      setError("Netværksfejl. Prøv igen.");
      setStatus("idle");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_22rem]" noValidate={false}>
      <div>
        <fieldset className="grid grid-cols-2 gap-4">
          <legend className="mb-3 text-lg font-bold">Leveringsoplysninger</legend>
          {fields.map((f) => (
            <label key={f.name} className={`text-sm ${f.half ? "col-span-2 sm:col-span-1" : "col-span-2"}`}>
              <span className="mb-1 block font-medium">
                {f.label}
                {f.required && <span aria-hidden="true"> *</span>}
              </span>
              <input
                name={f.name}
                type={f.type ?? "text"}
                autoComplete={f.autoComplete}
                required={f.required}
                className="input"
                inputMode={f.name === "zip" || f.name === "cvr" ? "numeric" : undefined}
                pattern={f.name === "zip" ? "\\d{4}" : f.name === "cvr" ? "\\d{8}" : undefined}
              />
            </label>
          ))}
          <label className="col-span-2 text-sm">
            <span className="mb-1 block font-medium">Bemærkning til ordren (valgfrit)</span>
            <textarea name="note" rows={3} maxLength={1000} className="input" />
          </label>
          {/* Honeypot for bots */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        </fieldset>

        <div className="mt-6 rounded-xl bg-ink-100/60 p-4 text-sm">
          <p className="font-semibold">Betaling</p>
          <p className="mt-1 text-ink-700">
            Når vi har modtaget din ordre, sender vi en ordrebekræftelse med betalingsoplysninger. Varen afsendes, når betalingen er
            modtaget.
          </p>
        </div>

        <label className="mt-6 flex items-start gap-2 text-sm">
          <input type="checkbox" name="acceptTerms" required className="mt-1 h-4 w-4 accent-ink-900" />
          <span>
            Jeg har læst og accepterer{" "}
            <Link href="/handelsbetingelser" target="_blank" className="underline">
              handelsbetingelserne
            </Link>{" "}
            og{" "}
            <Link href="/privatlivspolitik" target="_blank" className="underline">
              privatlivspolitikken
            </Link>
            .
          </span>
        </label>
      </div>

      <aside className="h-fit rounded-xl border border-ink-100 p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">Din ordre</h2>
        <ul className="mb-4 space-y-2 text-sm">
          {lines.map((l) => (
            <li key={l.productId} className="flex justify-between gap-3">
              <span>
                {l.quantity} × {l.name}
              </span>
              <span className="whitespace-nowrap">{formatPrice(l.priceOre * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <OrderSummary freeShippingThresholdOre={freeShippingThresholdOre} />
        {error && (
          <div role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
            {error}
            {Object.keys(fieldErrors).length > 0 && <p className="mt-1 text-xs">Tjek felterne og prøv igen.</p>}
          </div>
        )}
        <button type="submit" disabled={status === "sending"} className="btn btn-primary mt-5 w-full py-3">
          {status === "sending" ? "Sender ordre…" : "Afgiv ordre"}
        </button>
        <p className="mt-2 text-center text-xs text-ink-500">Priser beregnes endeligt ved afgivelse af ordren.</p>
      </aside>
    </form>
  );
}
