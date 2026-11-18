import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { StatusPill } from "@/components/ui";
import { formatPeso, formatRef } from "@/lib/money";
import { fetchPayPage } from "@/lib/paylink.functions";

export const Route = createFileRoute("/shop/thanks")({
  validateSearch: (search: Record<string, unknown>) => ({
    charge: typeof search.charge === "string" ? search.charge : "",
    status: typeof search.status === "string" ? search.status : "",
  }),
  loaderDeps: ({ search }) => ({ charge: search.charge }),
  loader: ({ deps }) => (deps.charge ? fetchPayPage({ data: { id: deps.charge } }) : Promise.resolve(null)),
  component: Thanks,
});

function Thanks() {
  const data = Route.useLoaderData();
  const found = data && data.ok && data.found ? data : null;
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <SiteHeader />
      <main className="mx-auto grid max-w-lg gap-4 px-4 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Back from checkout</p>
        <h1 className="text-4xl">{found?.charge.status === "paid" ? "Order noted" : "Still waiting on payment"}</h1>
        {found ? (
          <section className="grid gap-3 rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{found.charge.description}</p>
              <StatusPill status={found.charge.status} />
            </div>
            <p className="font-display text-4xl tabular-nums">{formatPeso(found.charge.amountCentavos)}</p>
            <p className="text-sm text-muted">Reference {formatRef(found.charge.reference)}</p>
            {found.charge.status !== "paid" ? (
              <Link
                to="/pay/$chargeId"
                params={{ chargeId: found.charge.id }}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-4 text-sm font-semibold text-paper"
              >
                Finish payment
              </Link>
            ) : (
              <p className="text-sm text-ink">Harbor kept the reference. This demo does not ship the coffee.</p>
            )}
          </section>
        ) : (
          <p className="text-muted">No payment was attached to this return. Start from the shop.</p>
        )}
        <Link to="/shop" className="text-sm font-semibold text-gold">
          Back to the shop
        </Link>
      </main>
    </div>
  );
}
