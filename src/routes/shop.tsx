import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui";
import { PRODUCTS } from "@/lib/catalog";
import { absoluteAppUrl } from "@/lib/public-url";
import { formatPeso } from "@/lib/money";
import { fetchMerchant, createCharge } from "@/lib/paylink.functions";

export const Route = createFileRoute("/shop")({
  loader: () => fetchMerchant(),
  component: Shop,
});

function Shop() {
  const merchant = Route.useLoaderData();
  const navigate = useNavigate();
  const [qty, setQty] = useState<Record<string, number>>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const lines = PRODUCTS.map((product) => ({ ...product, qty: qty[product.id] ?? 0 })).filter((line) => line.qty > 0);
  const totalPesos = lines.reduce((sum, line) => sum + line.pesos * line.qty, 0);
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  const summary = useMemo(
    () => lines.map((line) => `${line.qty}× ${line.name}`).join(", "),
    [lines],
  );

  function bump(id: string, delta: number) {
    setQty((current) => {
      const next = Math.max(0, (current[id] ?? 0) + delta);
      return { ...current, [id]: next };
    });
  }

  async function checkout() {
    if (!lines.length || busy) return;
    setBusy(true);
    setError("");
    const returnUrl = absoluteAppUrl("/shop/thanks");
    const result = await createCharge({
      data: {
        amountPesos: totalPesos,
        description: summary.slice(0, 120),
        returnUrl,
        source: "store",
      },
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    await navigate({ to: "/pay/$chargeId", params: { chargeId: result.charge.id } });
  }

  return (
    <div className="min-h-dvh bg-paper pb-28 text-ink">
      <SiteHeader />
      <main className="mx-auto grid max-w-3xl gap-6 px-4 py-8">
        <header className="grid gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Demo shop</p>
          <h1 className="text-4xl">{merchant.businessName}</h1>
          <p className="max-w-xl text-muted">
            {merchant.tagline || "A mock storefront checking out through PayLink PH."} Add something, then pay by link.
          </p>
        </header>
        <ul className="grid gap-3">
          {PRODUCTS.map((product) => {
            const n = qty[product.id] ?? 0;
            return (
              <li key={product.id} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
                <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-ink font-display text-lg text-gold-2">
                  {product.mark}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-muted">{product.detail}</p>
                  <p className="mt-1 tabular-nums">{formatPeso(product.pesos * 100)}</p>
                </div>
                {n === 0 ? (
                  <Button tone="quiet" onClick={() => bump(product.id, 1)}>
                    Add
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button tone="quiet" className="size-11 px-0" onClick={() => bump(product.id, -1)} aria-label={`Remove one ${product.name}`}>
                      −
                    </Button>
                    <span className="w-6 text-center tabular-nums">{n}</span>
                    <Button tone="quiet" className="size-11 px-0" onClick={() => bump(product.id, 1)} aria-label={`Add another ${product.name}`}>
                      +
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        {error ? <p className="text-sm text-coral">{error}</p> : null}
      </main>
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">{count === 0 ? "Cart empty" : `${count} in cart`}</p>
            <p className="font-display text-2xl tabular-nums">{formatPeso(totalPesos * 100)}</p>
          </div>
          <Button onClick={() => void checkout()} disabled={!count || busy}>
            {busy ? "Starting…" : "Pay with PayLink"}
          </Button>
        </div>
      </div>
    </div>
  );
}
