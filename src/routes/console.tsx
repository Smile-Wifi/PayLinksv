import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Button, Panel, StatusPill, TextField } from "@/components/ui";
import { OPERATOR_STORAGE_KEY } from "@/lib/catalog";
import { formatPeso, formatRef, formatWhen } from "@/lib/money";
import type { ChargeView, MerchantPublic, Rail } from "@/lib/paylink.core";
import {
  cancelPayment,
  claimConsole,
  confirmPayment,
  createCharge,
  fetchConsole,
  saveProfile,
  saveQr,
} from "@/lib/paylink.functions";
import { absoluteAppUrl, appBaseUrl } from "@/lib/public-url";
import { readQrFile } from "@/lib/qr-file";

export const Route = createFileRoute("/console")({
  component: ConsolePage,
});

type Tab = "wallet" | "link" | "activity" | "embed";

function makeOperatorKey() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return `ok_${[...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

function ConsolePage() {
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [key, setKey] = useState("");
  const [paste, setPaste] = useState("");
  const [claimed, setClaimed] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [merchant, setMerchant] = useState<MerchantPublic | null>(null);
  const [charges, setCharges] = useState<ChargeView[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [tab, setTab] = useState<Tab>("wallet");
  const [busy, setBusy] = useState(false);

  async function refresh(nextKey: string) {
    try {
      const gate = await fetchConsole({ data: { key: nextKey } });
      setClaimed(gate.claimed);
      setAuthorized(gate.authorized);
      if (gate.authorized) {
        setMerchant(gate.merchant);
        setCharges(gate.charges);
      }
      return gate;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open the console");
      return null;
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    const stored = window.localStorage.getItem(OPERATOR_STORAGE_KEY) ?? "";
    setKey(stored);
    setReady(true);
    void refresh(stored);
  }, []);

  async function claim() {
    setBusy(true);
    setError("");
    const next = makeOperatorKey();
    const result = await claimConsole({ data: { key: next } });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      setClaimed(true);
      return;
    }
    window.localStorage.setItem(OPERATOR_STORAGE_KEY, next);
    setKey(next);
    await refresh(next);
    setNotice("Console claimed on this browser. Copy the operator key before you clear site data.");
  }

  async function unlock() {
    setBusy(true);
    setError("");
    const gate = await refresh(paste.trim());
    setBusy(false);
    if (!gate?.authorized) {
      setError("That operator key does not match.");
      return;
    }
    window.localStorage.setItem(OPERATOR_STORAGE_KEY, paste.trim());
    setKey(paste.trim());
  }

  if (!ready || !loaded) {
    return (
      <div className="min-h-dvh bg-paper text-ink">
        <SiteHeader />
        <main className="px-4 py-16 text-center text-muted">Opening console…</main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <SiteHeader />
      <main className="mx-auto grid max-w-3xl gap-4 px-4 py-6">
        <header className="grid gap-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Merchant console</p>
          <h1 className="text-4xl">{merchant?.businessName ?? "PayLink PH"}</h1>
        </header>

        {!authorized ? (
          <Panel className="grid gap-4">
            <h2 className="text-2xl">{claimed ? "Unlock the console" : "Claim this console"}</h2>
            <p className="text-sm text-muted">
              {claimed
                ? "Payments can only be confirmed with the operator key created on first claim."
                : "The first claim locks confirmations to an operator key kept in this browser. Customers never see it."}
            </p>
            {claimed ? (
              <TextField
                label="Operator key"
                name="operator"
                value={paste}
                autoComplete="off"
                onChange={(event) => setPaste(event.target.value)}
              />
            ) : null}
            {error ? <p className="text-sm text-coral">{error}</p> : null}
            {claimed ? (
              <Button onClick={() => void unlock()} disabled={busy || paste.trim().length < 16}>
                Unlock
              </Button>
            ) : (
              <Button onClick={() => void claim()} disabled={busy}>
                Claim console
              </Button>
            )}
          </Panel>
        ) : merchant ? (
          <>
            <div className="flex gap-2 overflow-x-auto">
              {(
                [
                  ["wallet", "Wallet QR"],
                  ["link", "New link"],
                  ["activity", "Activity"],
                  ["embed", "For websites"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setTab(id);
                    if (id === "activity" || id === "embed") void refresh(key);
                  }}
                  className={
                    tab === id
                      ? "min-h-11 shrink-0 rounded-full bg-ink px-4 text-sm font-semibold text-paper"
                      : "min-h-11 shrink-0 rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink"
                  }
                >
                  {label}
                </button>
              ))}
            </div>
            {notice ? <p className="rounded-xl bg-paper-2 px-3 py-2 text-sm">{notice}</p> : null}
            {error ? <p className="text-sm text-coral">{error}</p> : null}
            {tab === "wallet" ? (
              <WalletTab
                merchant={merchant}
                operatorKey={key}
                onMerchant={setMerchant}
                onError={setError}
                onNotice={setNotice}
              />
            ) : null}
            {tab === "link" ? (
              <LinkTab
                onCreated={(charge) => {
                  setCharges((current) => [charge, ...current.filter((item) => item.id !== charge.id)]);
                  setNotice(`Pay link ready · ${formatRef(charge.reference)}`);
                }}
                onError={setError}
              />
            ) : null}
            {tab === "activity" ? (
              <ActivityTab
                charges={charges}
                operatorKey={key}
                onChange={(charge) =>
                  setCharges((current) => current.map((item) => (item.id === charge.id ? charge : item)))
                }
                onError={setError}
              />
            ) : null}
            {tab === "embed" ? <EmbedTab merchant={merchant} /> : null}
          </>
        ) : null}
      </main>
    </div>
  );
}

function WalletTab({
  merchant,
  operatorKey,
  onMerchant,
  onError,
  onNotice,
}: {
  merchant: MerchantPublic;
  operatorKey: string;
  onMerchant: (merchant: MerchantPublic) => void;
  onError: (message: string) => void;
  onNotice: (message: string) => void;
}) {
  const [businessName, setBusinessName] = useState(merchant.businessName);
  const [tagline, setTagline] = useState(merchant.tagline);
  const [city, setCity] = useState(merchant.city);
  const [primaryRail, setPrimaryRail] = useState<Rail>(merchant.primaryRail);
  const [sandbox, setSandbox] = useState(merchant.sandbox);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    onError("");
    const result = await saveProfile({
      data: { key: operatorKey, businessName, tagline, city, primaryRail, sandbox },
    });
    setBusy(false);
    if (!result.ok) {
      onError(result.error);
      return;
    }
    onMerchant(result.merchant);
    onNotice(result.merchant.sandbox ? "Profile saved. Sandbox payments are allowed." : "Profile saved. Live confirm-only mode.");
  }

  async function upload(rail: Rail, file: File | undefined) {
    if (!file) return;
    onError("");
    try {
      const dataUrl = await readQrFile(file);
      const result = await saveQr({ data: { key: operatorKey, rail, dataUrl } });
      if (!result.ok) onError(result.error);
      else {
        onMerchant(result.merchant);
        onNotice("Wallet QR saved. New pay links will show it.");
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : "Could not read that image");
    }
  }

  async function clear(rail: Rail) {
    const result = await saveQr({ data: { key: operatorKey, rail, dataUrl: "" } });
    if (!result.ok) onError(result.error);
    else onMerchant(result.merchant);
  }

  const rails: { id: Rail; label: string; image: string }[] = [
    { id: "qrph", label: "QR Ph", image: merchant.qrphQr },
    { id: "gcash", label: "GCash", image: merchant.gcashQr },
    { id: "maya", label: "Maya", image: merchant.mayaQr },
  ];

  return (
    <div className="grid gap-4">
      <Panel className="grid gap-3">
        <h2 className="text-2xl">Business</h2>
        <TextField label="Name on the checkout" name="businessName" value={businessName} maxLength={40} onChange={(event) => setBusinessName(event.target.value)} />
        <TextField label="Tagline" name="tagline" value={tagline} maxLength={80} onChange={(event) => setTagline(event.target.value)} />
        <TextField label="City" name="city" value={city} maxLength={40} onChange={(event) => setCity(event.target.value)} hint="Shown on the pay page. Leave blank if you prefer." />
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Default wallet</span>
          <select
            value={primaryRail}
            onChange={(event) => setPrimaryRail(event.target.value as Rail)}
            className="h-12 rounded-xl border border-line bg-surface px-3 text-base"
          >
            <option value="qrph">QR Ph</option>
            <option value="gcash">GCash</option>
            <option value="maya">Maya</option>
          </select>
        </label>
        <label className="flex items-center justify-between gap-3 rounded-xl bg-paper px-3 py-3 text-sm">
          <span>
            <span className="block font-medium">Sandbox mode</span>
            <span className="text-muted">Shows “Simulate wallet payment” on checkout. Turn off for live use.</span>
          </span>
          <input
            type="checkbox"
            className="size-5 accent-ink"
            checked={sandbox}
            onChange={(event) => setSandbox(event.target.checked)}
          />
        </label>
        <Button onClick={() => void save()} disabled={busy}>
          Save profile
        </Button>
      </Panel>
      <Panel className="grid gap-4">
        <div>
          <h2 className="text-2xl">Personal e-wallet QR</h2>
          <p className="mt-1 text-sm text-muted">
            Upload the same code you already show customers. PayLink displays it. Your wallet still receives the money.
          </p>
        </div>
        {rails.map((rail) => (
          <div key={rail.id} className="grid gap-3 rounded-2xl border border-line p-3 sm:grid-cols-[auto_1fr] sm:items-center">
            {rail.image ? (
              <img src={rail.image} alt={`${rail.label} QR`} className="size-28 rounded-xl bg-paper object-contain" />
            ) : (
              <div className="grid size-28 place-items-center rounded-xl border border-dashed border-line text-xs text-muted">
                No QR
              </div>
            )}
            <div className="grid gap-2">
              <p className="font-semibold">{rail.label}</p>
              <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-line bg-surface px-4 text-sm font-semibold">
                Upload image
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    void upload(rail.id, file);
                  }}
                />
              </label>
              {rail.image ? (
                <Button tone="quiet" onClick={() => void clear(rail.id)}>
                  Remove
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </Panel>
      <Panel>
        <p className="text-xs uppercase tracking-wide text-muted">Operator key</p>
        <p className="mt-1 break-all font-mono text-sm">{operatorKey}</p>
        <p className="mt-2 text-sm text-muted">Store this somewhere safe. It confirms and cancels payments.</p>
      </Panel>
    </div>
  );
}

function LinkTab({
  onCreated,
  onError,
}: {
  onCreated: (charge: ChargeView) => void;
  onError: (message: string) => void;
}) {
  const [amount, setAmount] = useState("180");
  const [description, setDescription] = useState("Counter order");
  const [latest, setLatest] = useState<ChargeView | null>(null);
  const [busy, setBusy] = useState(false);

  async function create() {
    setBusy(true);
    onError("");
    const result = await createCharge({
      data: {
        amountPesos: amount,
        description,
        returnUrl: "",
        source: "console",
      },
    });
    setBusy(false);
    if (!result.ok) {
      onError(result.error);
      return;
    }
    setLatest(result.charge);
    onCreated(result.charge);
  }

  const href = latest ? absoluteAppUrl(resultPath(latest.id)) : "";

  return (
    <Panel className="grid gap-3">
      <h2 className="text-2xl">Create a pay link</h2>
      <TextField label="Amount in pesos" name="amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} />
      <TextField label="What it’s for" name="description" value={description} maxLength={120} onChange={(event) => setDescription(event.target.value)} />
      <Button onClick={() => void create()} disabled={busy}>
        {busy ? "Creating…" : "Create pay link"}
      </Button>
      {latest ? (
        <div className="grid gap-2 rounded-xl bg-paper p-3 text-sm">
          <p>
            {formatPeso(latest.amountCentavos)} · {formatRef(latest.reference)}
          </p>
          <p className="break-all text-muted">{href}</p>
          <Link
            to="/pay/$chargeId"
            params={{ chargeId: latest.id }}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-4 font-semibold text-paper"
          >
            Open checkout
          </Link>
        </div>
      ) : null}
    </Panel>
  );
}

function resultPath(id: string) {
  return `/pay/${id}`;
}

function ActivityTab({
  charges,
  operatorKey,
  onChange,
  onError,
}: {
  charges: ChargeView[];
  operatorKey: string;
  onChange: (charge: ChargeView) => void;
  onError: (message: string) => void;
}) {
  async function act(id: string, kind: "confirm" | "cancel") {
    onError("");
    const result =
      kind === "confirm"
        ? await confirmPayment({ data: { key: operatorKey, id } })
        : await cancelPayment({ data: { key: operatorKey, id } });
    if (!result.ok) onError(result.error);
    else onChange(result.charge);
  }

  if (!charges.length) {
    return (
      <Panel>
        <h2 className="text-2xl">No payments yet</h2>
        <p className="mt-1 text-sm text-muted">Create a link, or check out from the demo shop.</p>
      </Panel>
    );
  }

  return (
    <ul className="grid gap-3">
      {charges.map((charge) => {
        const open = charge.status === "pending" || charge.status === "claimed";
        return (
          <li key={charge.id} className="grid gap-3 rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{charge.description}</p>
                <p className="text-sm text-muted">
                  {formatRef(charge.reference)} · {formatWhen(charge.createdAt)} · {charge.source}
                </p>
              </div>
              <StatusPill status={charge.status} />
            </div>
            <p className="font-display text-3xl tabular-nums">{formatPeso(charge.amountCentavos)}</p>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/pay/$chargeId"
                params={{ chargeId: charge.id }}
                className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm font-semibold"
              >
                Open
              </Link>
              {open ? (
                <Button tone="mint" onClick={() => void act(charge.id, "confirm")}>
                  Confirm paid
                </Button>
              ) : null}
              {open ? (
                <Button tone="coral" onClick={() => void act(charge.id, "cancel")}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function EmbedTab({ merchant }: { merchant: MerchantPublic }) {
  const base = appBaseUrl();
  const snippet = `<script src="${base}/paylink.js" data-paylink-key="${merchant.publishableKey}"></script>
<button type="button" data-paylink data-amount="240" data-description="Ube crinkle box">
  Pay with PayLink PH
</button>`;
  const curl = `curl -X POST ${base}/api/v1/charges \\
  -H "content-type: application/json" \\
  -H "x-paylink-key: ${merchant.publishableKey}" \\
  -d '{"amount":240,"description":"Ube crinkle box"}'`;

  return (
    <div className="grid gap-4">
      <Panel className="grid gap-2">
        <h2 className="text-2xl">Publishable key</h2>
        <p className="break-all font-mono text-sm">{merchant.publishableKey}</p>
        <p className="text-sm text-muted">
          Safe to put on a website. It can create pay links. It cannot confirm them.
        </p>
      </Panel>
      <Panel className="grid gap-2">
        <h2 className="text-2xl">Button snippet</h2>
        <pre className="overflow-x-auto rounded-xl bg-ink p-3 text-xs leading-relaxed text-paper">{snippet}</pre>
      </Panel>
      <Panel className="grid gap-2">
        <h2 className="text-2xl">Create a charge</h2>
        <pre className="overflow-x-auto rounded-xl bg-ink p-3 text-xs leading-relaxed text-paper">{curl}</pre>
        <p className="text-sm text-muted">
          Read status with GET {base}/api/v1/charges/pl_xxxxxxxx. Amount is pesos. Links expire in 24 hours.
        </p>
      </Panel>
    </div>
  );
}
