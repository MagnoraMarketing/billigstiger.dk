import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-20 text-center">
      <h1 className="text-3xl font-extrabold">Siden blev ikke fundet</h1>
      <p className="mt-3 text-ink-700">Siden findes ikke eller er flyttet.</p>
      <Link href="/stiger" className="btn btn-secondary mt-6">
        Se alle stiger
      </Link>
    </div>
  );
}
