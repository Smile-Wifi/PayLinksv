import { useState } from "react";
import { CircleCheck, Copy, Smartphone } from "lucide-react";
import type { ChargeView, MerchantPublic, Rail } from "@/lib/paylink.core";
import { formatPeso, formatRef, formatWhen } from "@/lib/money";
import { absoluteAppUrl } from "@/lib/public-url";
import { Button, StatusPill } from "@/components/ui";
import { QrCodeImage } from "@/components/qr-code-image";

const RAILS: { id: Rail; label: string; hint: string }[] = [
  { id: "qrph", label: "QR Ph", hint: "GCash, Maya, and most bank apps" },
  { id: "gcash", label: "GCash", hint: "Scan inside the GCash app" },
  { id: "maya", label: "Maya", hint: "Scan inside the Maya app" },
];

function railImage(merchant: MerchantPublic, rail: Rail): string {
  if (rail === "gcash") return merchant.gcashQr;
  if (rail === "maya") return merchant.mayaQr;
  return merchant.qrphQr;
}

export function CheckoutCard({
  charge,
  merchant,
  busy,
  error,
  onClaim,
  onSimulate,
}: {
  charge: ChargeView;
  merchant: MerchantPublic;
  busy: boolean;
  error: string;
  onClaim: () => void;
  onSimulate: () => void;
}) {
  const available = RAILS.filter((rail) => railImage(merchant, rail.id));
  const initial = available.some((rail) => rail.id === merchant.primaryRail)
    ? merchant.primaryRail
    : (available[0]?.id ?? merchant.primaryRail);
  const [rail, setRail] = useState<Rail>(initial);
  const [copied, setCopied] = useState("");
  const image = railImage(merchant, rail);
  const open = charge.status === "pending" || charge.status === "claimed";
  const shareUrl = absoluteAppUrl(`/pay/${charge.id}`);
  const referencePayload = `PAYLINK PH\nREF ${charge.reference}\nPHP ${(charge.amountCentavos / 100).toFixed(2)}\n${merchant.businessName}`;

  async function copy(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(""), 1600);
    } catch {
      setCopied("");
    }
  }

  const returnHref = (() => {
    if (!charge.returnUrl || charge.status !== "paid") return "";
    try {
      const url = new URL(charge.returnUrl);
      url.searchParams.set("charge", charge.id);
      url.searchParams.set("status", charge.status);
      return url.toString();
    } catch {
      return "";
    }
  })();

  return (
    <article className="mx-auto grid w-full max-w-lg gap-4">
      <header className="grid gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">PayLink PH</p>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl text-ink">{merchant.businessName}</h1>
            <p className="mt-1 text-sm text-muted">
              {merchant.tagline || "Scan to pay, or send this link."}
              {merchant.city ? ` · ${merchant.city}` : ""}
            </p>
          </div>
          <StatusPill status={charge.status} />
        </div>
      </header>

      <section className="rounded-2xl border border-line bg-surface px-5 py-6">
        <p className="text-sm text-muted">{charge.description}</p>
        <p className="mt-2 font-display text-5xl tabular-nums tracking-tight text-ink">
          {formatPeso(charge.amountCentavos)}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-paper px-3 py-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Message / reference</p>
            <p className="font-display text-2xl tracking-wide text-ink">{formatRef(charge.reference)}</p>
          </div>
          <Button tone="quiet" onClick={() => void copy("ref", charge.reference)}>
            <Copy className="size-4" aria-hidden="true" />
            {copied === "ref" ? "Copied" : "Copy"}
          </Button>
        </div>
        <p className="mt-3 text-sm text-muted">
          Pay the exact amount. Paste the reference into the wallet message so the merchant can match it. Expires{" "}
          {formatWhen(charge.expiresAt)}.
        </p>
      </section>

      {charge.status === "paid" ? (
        <section className="grid gap-3 rounded-2xl bg-mint px-5 py-5 text-paper">
          <CircleCheck className="size-8" aria-hidden="true" />
          <h2 className="text-2xl">Payment confirmed</h2>
          <p className="text-sm">
            {charge.paidAt ? `Marked paid ${formatWhen(charge.paidAt)}.` : "Marked paid."} Keep the reference{" "}
            {formatRef(charge.reference)} for your receipt.
          </p>
          {returnHref ? (
            <a
              href={returnHref}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-paper px-4 text-sm font-semibold text-ink"
            >
              Return to {merchant.businessName}
            </a>
          ) : null}
        </section>
      ) : null}

      {charge.status === "claimed" ? (
        <p className="rounded-2xl border border-line bg-paper-2 px-4 py-3 text-sm text-ink">
          You marked this as sent. It stays pending until the merchant sees the money and confirms it.
        </p>
      ) : null}

      {charge.status === "expired" || charge.status === "cancelled" ? (
        <p className="rounded-2xl border border-coral/30 bg-surface px-4 py-3 text-sm text-coral">
          This pay link is {charge.status}. Ask {merchant.businessName} for a new one.
        </p>
      ) : null}

      {open ? (
        <section className="grid justify-items-center gap-4 rounded-2xl border border-line bg-surface px-4 py-5">
          {available.length > 0 ? (
            <>
              <div className="flex flex-wrap justify-center gap-2">
                {RAILS.map((item) => {
                  const ready = Boolean(railImage(merchant, item.id));
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={!ready}
                      onClick={() => setRail(item.id)}
                      className={
                        rail === item.id
                          ? "min-h-11 rounded-full bg-ink px-4 text-sm font-semibold text-paper"
                          : "min-h-11 rounded-full border border-line px-4 text-sm font-semibold text-ink disabled:opacity-40"
                      }
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
              {image ? (
                <img src={image} alt={`${rail} QR for ${merchant.businessName}`} className="size-64 rounded-2xl bg-surface object-contain" />
              ) : (
                <p className="text-sm text-muted">No QR saved for this wallet yet.</p>
              )}
              <p className="max-w-xs text-center text-sm text-muted">{RAILS.find((item) => item.id === rail)?.hint}</p>
            </>
          ) : (
            <div className="grid justify-items-center gap-3 text-center">
              <QrCodeImage value={referencePayload} label="Payment reference QR" />
              <p className="max-w-xs text-sm text-muted">
                Reference QR only — it is not a wallet payment code. Upload a GCash, Maya, or QR Ph image in the console
                to accept a real scan.
              </p>
            </div>
          )}

          <ol className="grid w-full gap-2 text-sm text-ink">
            <li className="flex gap-3 rounded-xl bg-paper px-3 py-2">
              <span className="font-display text-gold">1</span>
              Open GCash, Maya, or any QR Ph app.
            </li>
            <li className="flex gap-3 rounded-xl bg-paper px-3 py-2">
              <span className="font-display text-gold">2</span>
              Scan the code and enter {formatPeso(charge.amountCentavos)}.
            </li>
            <li className="flex gap-3 rounded-xl bg-paper px-3 py-2">
              <span className="font-display text-gold">3</span>
              Put {formatRef(charge.reference)} in the message field.
            </li>
          </ol>

          <div className="grid w-full gap-2">
            {charge.status === "pending" ? (
              <Button onClick={onClaim} disabled={busy}>
                I've sent the payment
              </Button>
            ) : null}
            {merchant.sandbox ? (
              <Button tone="gold" onClick={onSimulate} disabled={busy}>
                <Smartphone className="size-4" aria-hidden="true" />
                Simulate wallet payment
              </Button>
            ) : null}
            <Button tone="quiet" onClick={() => void copy("link", shareUrl || `/pay/${charge.id}`)}>
              <Copy className="size-4" aria-hidden="true" />
              {copied === "link" ? "Link copied" : "Copy pay link"}
            </Button>
          </div>
          {merchant.sandbox ? (
            <p className="text-center text-xs text-muted">
              Sandbox is on. Simulated payments do not move money. Turn it off in the console for live confirm-only mode.
            </p>
          ) : null}
          {error ? <p className="text-center text-sm text-coral">{error}</p> : null}
        </section>
      ) : null}

      <section className="grid justify-items-center gap-2 rounded-2xl border border-dashed border-line px-4 py-4 text-center">
        <QrCodeImage value={shareUrl || referencePayload} label="QR that opens this pay link" />
        <p className="text-sm text-muted">Scan to open this pay link on another phone.</p>
      </section>
    </article>
  );
}
