import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { fetchMerchant } from "@/lib/paylink.functions";
import { formatPeso } from "@/lib/money";

export const Route = createFileRoute("/embed-demo")({
  loader: () => fetchMerchant(),
  component: EmbedDemo,
});

function EmbedDemo() {
  const merchant = Route.useLoaderData();

  useEffect(() => {
    const selector = "script[data-paylink-widget]";
    if (document.querySelector(selector)) return;
    const script = document.createElement("script");
    const basePath = window.location.pathname.replace(/\/embed-demo\/?$/, "");
    script.src = `${basePath}/paylink.js`;
    script.dataset.paylinkKey = merchant.publishableKey;
    script.dataset.paylinkWidget = "1";
    document.body.appendChild(script);
  }, [merchant.publishableKey]);

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <SiteHeader />
      <main className="mx-auto grid max-w-lg gap-5 px-4 py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Another website</p>
        <h1 className="text-4xl">North Line Goods</h1>
        <p className="text-muted">
          This page is not the shop. It is a mock storefront using the PayLink button and your publishable key. Checkout
          still shows {merchant.businessName}'s QR.
        </p>
        <article className="grid gap-4 rounded-3xl border border-line bg-ink p-5 text-paper">
          <p className="text-xs uppercase tracking-[0.16em] text-gold-2">Ready to ship</p>
          <h2 className="text-3xl text-paper">Linen camp shirt</h2>
          <p className="text-sm text-paper/80">Undyed, mother-of-pearl buttons, cut in a small run.</p>
          <p className="font-display text-4xl tabular-nums">{formatPeso(89000)}</p>
          <button
            type="button"
            data-paylink=""
            data-amount="890"
            data-description="Linen camp shirt"
            data-return="/shop/thanks"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-gold-2 px-4 text-sm font-semibold text-ink"
          >
            Pay with PayLink PH
          </button>
          <p className="text-xs text-paper/70">
            The button calls /api/v1/charges, then opens the hosted pay link. Same snippet works on any site that can
            load the script.
          </p>
        </article>
      </main>
    </div>
  );
}
