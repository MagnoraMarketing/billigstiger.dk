import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Tak for din ordre", robots: { index: false } };

export default async function ThanksPage({ searchParams }: { searchParams: Promise<{ ordre?: string }> }) {
  const { ordre } = await searchParams;
  const safe = ordre && /^BS-[0-9A-Z-]{6,20}$/.test(ordre) ? ordre : null;
  return (
    <div className="container-page max-w-2xl py-16 text-center">
      <p className="text-5xl" aria-hidden="true">
        ✓
      </p>
      <h1 className="mt-4 text-3xl font-extrabold">Tak for din ordre!</h1>
      {safe && (
        <p className="mt-2 text-lg">
          Ordrenummer: <strong>{safe}</strong>
        </p>
      )}
      <p className="mt-4 text-ink-700">Vi har modtaget din ordre og sender en ordrebekræftelse med betalingsoplysninger til din e-mail.</p>
      <Link href="/" className="btn btn-secondary mt-8">
        Til forsiden
      </Link>
    </div>
  );
}
