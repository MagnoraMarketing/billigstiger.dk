import { NextResponse } from "next/server";
import { getAllProducts, isDemoCatalog } from "@/lib/catalog";
import { deliverOrder, orderSchema, priceOrder } from "@/lib/orders";

export const runtime = "nodejs";

// Very small in-memory rate limit (per server instance). Use a WAF / Vercel Firewall rule for real protection.
const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 10 * 60_000) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  h.n += 1;
  return h.n > 10;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ error: "For mange forsøg. Prøv igen om lidt." }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig forespørgsel." }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Kontrollér venligst de udfyldte felter.", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  if (await isDemoCatalog()) {
    return NextResponse.json({ error: "Butikken kører med demo-sortiment, så ordrer kan endnu ikke gennemføres." }, { status: 503 });
  }

  const priced = priceOrder(parsed.data, await getAllProducts());
  if ("error" in priced) return NextResponse.json({ error: priced.error }, { status: 409 });

  const result = await deliverOrder(priced);
  if (!result.ok) {
    console.error("[orders] delivery failed:", result.reason, priced.orderNumber);
    return NextResponse.json(
      { error: "Vi kunne ikke modtage ordren lige nu. Kontakt os venligst på e-mail, så hjælper vi dig." },
      { status: 503 },
    );
  }

  return NextResponse.json({ orderNumber: priced.orderNumber, totalOre: priced.totalOre }, { status: 201 });
}
