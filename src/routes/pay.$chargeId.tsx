import { useEffect, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { CheckoutCard } from "@/components/checkout-card";
import type { ChargeView } from "@/lib/paylink.core";
import { claimPayment, fetchPayPage, simulatePayment } from "@/lib/paylink.functions";

export const Route = createFileRoute("/pay/$chargeId")({
  loader: ({ params }) => fetchPayPage({ data: { id: params.chargeId } }),
  component: PayPage,
});

function PayPage() {
  const initial = Route.useLoaderData();
  const router = useRouter();
  const [charge, setCharge] = useState<ChargeView | null>(initial.ok && initial.found ? initial.charge : null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initial.ok && initial.found) setCharge(initial.charge);
  }, [initial]);

  useEffect(() => {
    if (!charge || charge.status === "paid" || charge.status === "expired" || charge.status === "cancelled") return;
    const timer = window.setInterval(() => {
      void router.invalidate();
    }, 4000);
    return () => window.clearInterval(timer);
  }, [charge, router]);

  if (!initial.ok || !initial.found || !charge) {
    return (
      <div className="min-h-dvh bg-paper text-ink">
        <SiteHeader />
        <main className="mx-auto max-w-lg px-4 py-16">
          <h1 className="text-4xl">Pay link not found</h1>
          <p className="mt-2 text-muted">That charge does not exist, or the link was typed wrong.</p>
        </main>
      </div>
    );
  }

  async function run(action: "claim" | "simulate") {
    setBusy(true);
    setError("");
    const result =
      action === "claim"
        ? await claimPayment({ data: { id: charge!.id } })
        : await simulatePayment({ data: { id: charge!.id } });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setCharge(result.charge);
    void router.invalidate();
  }

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <SiteHeader />
      <main className="px-4 py-6">
        <CheckoutCard
          charge={charge}
          merchant={initial.merchant}
          busy={busy}
          error={error}
          onClaim={() => void run("claim")}
          onSimulate={() => void run("simulate")}
        />
      </main>
    </div>
  );
}
