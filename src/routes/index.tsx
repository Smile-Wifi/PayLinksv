import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Link2, QrCode, Store } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { formatPeso, formatRef } from "@/lib/money";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <SiteHeader />
      <main className="mx-auto grid max-w-5xl gap-10 px-4 py-8 sm:py-12">
        <section className="grid items-start gap-8 lg:grid-cols-5">
          <div className="grid gap-5 lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Peso checkout</p>
            <h1 className="max-w-xl text-4xl leading-tight text-ink sm:text-6xl">
              Your e-wallet QR, as a pay link.
            </h1>
            <p className="max-w-xl text-lg text-muted">
              PayLink PH lets a customer scan your GCash, Maya, or QR Ph code — or open a link from any website.
              You confirm when the money actually lands. Nothing here holds funds.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/shop"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-paper"
              >
                Try the demo shop
              </Link>
              <Link
                to="/console"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-surface px-5 text-sm font-semibold text-ink"
              >
                Upload your QR
              </Link>
            </div>
          </div>

          <aside className="rounded-3xl border border-line bg-surface p-5 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted">
              <span>Sample pay link</span>
              <span>Pending</span>
            </div>
            <p className="mt-6 font-display text-4xl tabular-nums">{formatPeso(24000)}</p>
            <p className="mt-1 text-sm text-muted">Ube crinkle box · Harbor Kape</p>
            <div className="mt-5 rounded-2xl bg-paper px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-muted">Reference</p>
              <p className="font-display text-3xl tracking-wide">{formatRef("UB24KAFE")}</p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {["QR Ph", "GCash", "Maya"].map((rail) => (
                <div key={rail} className="grid h-20 place-items-center rounded-xl border border-dashed border-line text-xs text-muted">
                  {rail}
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <Step icon={<QrCode className="size-5" aria-hidden="true" />} title="Scan to pay" body="Customers scan the QR you already use. The amount and reference sit beside it." />
          <Step icon={<Link2 className="size-5" aria-hidden="true" />} title="Or send a link" body="Each charge gets a pay link you can text, post, or return from another site." />
          <Step icon={<Store className="size-5" aria-hidden="true" />} title="Drop it on a site" body="A publishable key and a button snippet start a hosted checkout from any page." />
        </section>

        <section className="grid gap-3 rounded-3xl bg-ink px-5 py-6 text-paper sm:grid-cols-[1.4fr_0.6fr] sm:items-center">
          <div>
            <h2 className="text-3xl">Built for personal QR, not a bank webhook.</h2>
            <p className="mt-2 max-w-xl text-sm text-paper/80">
              GCash and Maya personal codes do not notify a website. The customer marks the payment sent. You match
              the reference in your wallet app and confirm. Sandbox mode lets you rehearse that without moving pesos.
            </p>
          </div>
          <Link
            to="/embed-demo"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-gold-2 px-5 text-sm font-semibold text-ink"
          >
            See it on another site
          </Link>
        </section>

        <p className="text-xs text-muted">
          PayLink PH is a checkout layer for your own e-wallet QR. It is not a bank, e-money issuer, or remittance
          company, and it never receives the payment.
        </p>
      </main>
    </div>
  );
}

function Step({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <article className="grid gap-2 rounded-2xl border border-line bg-surface p-4">
      <span className="grid size-10 place-items-center rounded-full bg-paper text-ink">{icon}</span>
      <h2 className="text-2xl">{title}</h2>
      <p className="text-sm text-muted">{body}</p>
    </article>
  );
}
