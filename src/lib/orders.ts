import "server-only";
import { z } from "zod";
import type { Product } from "./types";
import { shippingFor, vatIncluded } from "./shipping";

export const orderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    company: z.string().trim().max(120).optional().or(z.literal("")),
    cvr: z.string().trim().regex(/^\d{8}$/, "CVR skal være 8 cifre").optional().or(z.literal("")),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().min(8).max(20),
    address: z.string().trim().min(3).max(200),
    zip: z.string().trim().regex(/^\d{4}$/, "Postnummer skal være 4 cifre"),
    city: z.string().trim().min(2).max(80),
    note: z.string().trim().max(1000).optional().or(z.literal("")),
  }),
  lines: z
    .array(z.object({ productId: z.string().min(1).max(100), quantity: z.number().int().min(1).max(99) }))
    .min(1)
    .max(50),
  acceptTerms: z.literal(true),
  /** Honeypot – must be empty. */
  website: z.string().max(0).optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;

export interface PricedOrder {
  orderNumber: string;
  createdAt: string;
  customer: OrderInput["customer"];
  lines: Array<{ productId: string; sku: string; name: string; quantity: number; unitPriceOre: number; lineTotalOre: number }>;
  subtotalOre: number;
  shippingOre: number;
  totalOre: number;
  vatOre: number;
}

/** Prices are always recalculated server-side from the catalogue — never trust client prices. */
export function priceOrder(input: OrderInput, catalogue: Product[]): PricedOrder | { error: string } {
  const lines: PricedOrder["lines"] = [];
  for (const l of input.lines) {
    const p = catalogue.find((x) => x.id === l.productId);
    if (!p) return { error: `Produktet ${l.productId} findes ikke længere.` };
    if (p.stockStatus === "out_of_stock") return { error: `${p.name} er desværre udsolgt.` };
    lines.push({ productId: p.id, sku: p.sku, name: p.name, quantity: l.quantity, unitPriceOre: p.priceOre, lineTotalOre: p.priceOre * l.quantity });
  }
  const subtotalOre = lines.reduce((s, l) => s + l.lineTotalOre, 0);
  const shippingOre = shippingFor(subtotalOre);
  const totalOre = subtotalOre + shippingOre;
  const now = new Date();
  const orderNumber = `BS-${now.toISOString().slice(2, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  return { orderNumber, createdAt: now.toISOString(), customer: input.customer, lines, subtotalOre, shippingOre, totalOre, vatOre: vatIncluded(totalOre) };
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

const kr = (ore: number) => `${(ore / 100).toFixed(2).replace(".", ",")} kr.`;

export function orderEmailHtml(o: PricedOrder, forCustomer: boolean): string {
  const c = o.customer;
  const rows = o.lines
    .map((l) => `<tr><td>${esc(l.sku)}</td><td>${esc(l.name)}</td><td align="right">${l.quantity}</td><td align="right">${kr(l.unitPriceOre)}</td><td align="right">${kr(l.lineTotalOre)}</td></tr>`)
    .join("");
  return `<div style="font-family:Arial,sans-serif;color:#0f172a">
<h2>${forCustomer ? "Tak for din ordre" : "Ny ordre"} ${esc(o.orderNumber)}</h2>
${forCustomer ? "<p>Vi har modtaget din ordre og sender en ordrebekræftelse med betalingsoplysninger hurtigst muligt.</p>" : ""}
<table cellpadding="6" style="border-collapse:collapse" border="1">
<tr><th>Varenr.</th><th>Produkt</th><th>Antal</th><th>Stk.pris</th><th>I alt</th></tr>${rows}
<tr><td colspan="4" align="right">Subtotal</td><td align="right">${kr(o.subtotalOre)}</td></tr>
<tr><td colspan="4" align="right">Fragt</td><td align="right">${kr(o.shippingOre)}</td></tr>
<tr><td colspan="4" align="right"><b>Total inkl. moms</b></td><td align="right"><b>${kr(o.totalOre)}</b></td></tr>
<tr><td colspan="4" align="right">Heraf moms</td><td align="right">${kr(o.vatOre)}</td></tr>
</table>
<h3>Leveringsadresse</h3>
<p>${esc(c.name)}${c.company ? `<br>${esc(c.company)}${c.cvr ? ` (CVR ${esc(c.cvr)})` : ""}` : ""}<br>${esc(c.address)}<br>${esc(c.zip)} ${esc(c.city)}<br>${esc(c.email)} · ${esc(c.phone)}</p>
${c.note ? `<h3>Bemærkning</h3><p>${esc(c.note)}</p>` : ""}
</div>`;
}

export type DeliveryResult = { ok: true; channels: string[] } | { ok: false; reason: string };

/**
 * Delivers the order to the shop owner. No database is used: orders are sent by
 * e-mail (Resend REST API) and/or POSTed as JSON to a webhook (e.g. Zapier/Make,
 * Google Sheets, an ERP). At least one channel must be configured.
 */
export async function deliverOrder(o: PricedOrder): Promise<DeliveryResult> {
  const channels: string[] = [];
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFICATION_EMAIL;
  const from = process.env.ORDER_FROM_EMAIL || "BilligeStiger.dk <ordre@billigestiger.dk>";
  const webhook = process.env.ORDER_WEBHOOK_URL;

  if (!(resendKey && to) && !webhook) {
    return { ok: false, reason: "not_configured" };
  }

  if (resendKey && to) {
    const send = (recipient: string, subject: string, html: string) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [recipient], subject, html, reply_to: recipient === to ? o.customer.email : to }),
      });
    const res = await send(to, `Ny ordre ${o.orderNumber} – ${kr(o.totalOre)}`, orderEmailHtml(o, false));
    if (!res.ok) return { ok: false, reason: `email_failed_${res.status}` };
    channels.push("email");
    // Customer copy is best-effort; owner notification is what matters.
    await send(o.customer.email, `Ordrebekræftelse ${o.orderNumber} – BilligeStiger.dk`, orderEmailHtml(o, true)).catch(() => undefined);
  }

  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(process.env.ORDER_WEBHOOK_SECRET ? { "X-Webhook-Secret": process.env.ORDER_WEBHOOK_SECRET } : {}) },
      body: JSON.stringify(o),
    });
    if (!res.ok && channels.length === 0) return { ok: false, reason: `webhook_failed_${res.status}` };
    if (res.ok) channels.push("webhook");
  }

  return { ok: true, channels };
}
