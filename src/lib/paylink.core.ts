import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { getSql, type Sql } from "@/lib/db";

export type Rail = "gcash" | "maya" | "qrph";
export type ChargeStatus = "pending" | "claimed" | "paid" | "expired" | "cancelled";

export type MerchantPublic = {
  businessName: string;
  tagline: string;
  city: string;
  gcashQr: string;
  mayaQr: string;
  qrphQr: string;
  primaryRail: Rail;
  sandbox: boolean;
  publishableKey: string;
};

export type ChargeView = {
  id: string;
  amountCentavos: number;
  description: string;
  reference: string;
  status: ChargeStatus;
  source: string;
  returnUrl: string;
  createdAt: string;
  claimedAt: string | null;
  paidAt: string | null;
  expiresAt: string;
};

type MerchantRow = {
  business_name: string;
  tagline: string;
  city: string;
  gcash_qr: string;
  maya_qr: string;
  qrph_qr: string;
  primary_rail: string;
  sandbox: boolean;
  publishable_key: string;
  operator_hash: string;
};

type ChargeRow = {
  id: string;
  amount_centavos: number;
  description: string;
  reference: string;
  status: string;
  source: string;
  return_url: string;
  created_at: string;
  claimed_at: string | null;
  paid_at: string | null;
  expires_at: string;
};

const RAILS: Rail[] = ["qrph", "gcash", "maya"];
const SOURCES = new Set(["console", "store", "api", "sample", "widget"]);

function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

function asRail(value: string): Rail {
  return value === "gcash" || value === "maya" || value === "qrph" ? value : "qrph";
}

function asStatus(value: string): ChargeStatus {
  if (
    value === "pending" ||
    value === "claimed" ||
    value === "paid" ||
    value === "expired" ||
    value === "cancelled"
  ) {
    return value;
  }
  return "pending";
}

function mapCharge(row: ChargeRow): ChargeView {
  return {
    id: row.id,
    amountCentavos: Number(row.amount_centavos),
    description: row.description,
    reference: row.reference,
    status: asStatus(row.status),
    source: row.source,
    returnUrl: row.return_url,
    createdAt: row.created_at,
    claimedAt: row.claimed_at,
    paidAt: row.paid_at,
    expiresAt: row.expires_at,
  };
}

function mapMerchant(row: MerchantRow): MerchantPublic & { operatorHash: string } {
  return {
    businessName: row.business_name,
    tagline: row.tagline,
    city: row.city,
    gcashQr: row.gcash_qr,
    mayaQr: row.maya_qr,
    qrphQr: row.qrph_qr,
    primaryRail: asRail(row.primary_rail),
    sandbox: Boolean(row.sandbox),
    publishableKey: row.publishable_key,
    operatorHash: row.operator_hash,
  };
}

function cleanText(value: unknown, max: number, label: string, min = 1): string | { error: string } {
  if (typeof value !== "string") return { error: `${label} is required` };
  const text = value.replace(/[\u0000-\u001F]/g, "").trim();
  if (text.length < min) return { error: min === 0 ? `${label} is invalid` : `${label} is required` };
  if (text.length > max) return { error: `${label} is too long` };
  return text;
}

export function parsePesos(value: unknown): number | { error: string } {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  if (!Number.isFinite(n)) return { error: "Enter a valid amount in pesos" };
  const centavos = Math.round(n * 100);
  if (Math.abs(n * 100 - centavos) > 0.01) return { error: "Use at most 2 decimal places" };
  if (centavos < 100) return { error: "Minimum amount is ₱1.00" };
  if (centavos > 5_000_000) return { error: "Maximum amount is ₱50,000.00" };
  return centavos;
}

export function cleanReturnUrl(value: unknown): string | { error: string } {
  if (value == null || value === "") return "";
  if (typeof value !== "string") return { error: "Return URL is invalid" };
  const text = value.trim();
  if (!text) return "";
  if (text.length > 500) return { error: "Return URL is too long" };
  let url: URL;
  try {
    url = new URL(text);
  } catch {
    return { error: "Return URL must be a full http(s) link" };
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { error: "Return URL must start with http or https" };
  }
  return url.toString();
}

function cleanQr(value: unknown): string | { error: string } {
  if (value == null || value === "") return "";
  if (typeof value !== "string") return { error: "QR image is invalid" };
  const compact = value.replace(/\s/g, "");
  if (compact.length > 560_000) return { error: "QR image must be under 400 KB" };
  if (!/^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(compact)) {
    return { error: "Use a PNG, JPG, or WebP QR image" };
  }
  return compact;
}

function humanRef(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  let out = "";
  for (let i = 0; i < 8; i += 1) out += alphabet[bytes[i]! % alphabet.length];
  return out;
}

function isChargeId(id: string): boolean {
  return /^pl_[a-f0-9]{8}$/.test(id);
}

async function openDb(): Promise<Sql> {
  const sql = await getSql();
  await sql`update charges set status = 'expired' where status in ('pending', 'claimed') and expires_at < now()`;
  const existing = await sql<{ publishable_key: string }>`select publishable_key from merchant where id = 1`;
  if (!existing[0]) throw new Error("Merchant record missing");
  if (!existing[0].publishable_key) {
    const key = `pk_${randomBytes(12).toString("hex")}`;
    await sql`update merchant set publishable_key = ${key} where id = 1 and publishable_key = ''`;
  }
  return sql;
}

async function loadMerchant(sql: Sql) {
  const rows = await sql<MerchantRow>`
    select business_name, tagline, city, gcash_qr, maya_qr, qrph_qr, primary_rail, sandbox, publishable_key, operator_hash
    from merchant where id = 1
  `;
  if (!rows[0]) throw new Error("Merchant record missing");
  return mapMerchant(rows[0]);
}

async function loadCharge(sql: Sql, id: string): Promise<ChargeView | null> {
  if (!isChargeId(id)) return null;
  const rows = await sql<ChargeRow>`
    select id, amount_centavos, description, reference, status, source, return_url,
      to_char(created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at,
      to_char(claimed_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as claimed_at,
      to_char(paid_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as paid_at,
      to_char(expires_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as expires_at
    from charges where id = ${id}
  `;
  return rows[0] ? mapCharge(rows[0]) : null;
}

function publicMerchant(m: MerchantPublic & { operatorHash: string }): MerchantPublic {
  return {
    businessName: m.businessName,
    tagline: m.tagline,
    city: m.city,
    gcashQr: m.gcashQr,
    mayaQr: m.mayaQr,
    qrphQr: m.qrphQr,
    primaryRail: m.primaryRail,
    sandbox: m.sandbox,
    publishableKey: m.publishableKey,
  };
}

function authorized(m: { operatorHash: string }, key: unknown): boolean {
  if (typeof key !== "string" || key.length < 16 || key.length > 80) return false;
  if (!m.operatorHash) return false;
  return safeEqual(m.operatorHash, hashKey(key));
}

export async function getPublicMerchant(): Promise<MerchantPublic> {
  const sql = await openDb();
  return publicMerchant(await loadMerchant(sql));
}

export async function getPayPage(id: string): Promise<
  | { ok: true; found: false }
  | { ok: true; found: true; charge: ChargeView; merchant: MerchantPublic }
> {
  const sql = await openDb();
  const charge = await loadCharge(sql, id);
  if (!charge) return { ok: true, found: false };
  const merchant = publicMerchant(await loadMerchant(sql));
  return { ok: true, found: true, charge, merchant };
}

export async function consoleGate(key: string): Promise<
  | { ok: true; claimed: boolean; authorized: false; businessName: string }
  | { ok: true; claimed: true; authorized: true; merchant: MerchantPublic; charges: ChargeView[] }
> {
  const sql = await openDb();
  const merchant = await loadMerchant(sql);
  if (!merchant.operatorHash || !authorized(merchant, key)) {
    return {
      ok: true,
      claimed: merchant.operatorHash.length > 0,
      authorized: false,
      businessName: merchant.businessName,
    };
  }
  const rows = await sql<ChargeRow>`
    select id, amount_centavos, description, reference, status, source, return_url,
      to_char(created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at,
      to_char(claimed_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as claimed_at,
      to_char(paid_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as paid_at,
      to_char(expires_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as expires_at
    from charges
    order by created_at desc
    limit 30
  `;
  return {
    ok: true,
    claimed: true,
    authorized: true,
    merchant: publicMerchant(merchant),
    charges: rows.map(mapCharge),
  };
}

export async function claimConsole(key: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (typeof key !== "string" || !/^ok_[a-f0-9]{32}$/.test(key)) {
    return { ok: false, error: "Operator key is invalid" };
  }
  const sql = await openDb();
  const rows = await sql<{ id: number }>`
    update merchant
    set operator_hash = ${hashKey(key)}, updated_at = now()
    where id = 1 and operator_hash = ''
    returning id
  `;
  if (!rows[0]) return { ok: false, error: "This console is already claimed. Paste the operator key." };
  return { ok: true };
}

export async function saveProfile(input: {
  key: string;
  businessName: string;
  tagline: string;
  city: string;
  primaryRail: string;
  sandbox: boolean;
}): Promise<{ ok: true; merchant: MerchantPublic } | { ok: false; error: string }> {
  const businessName = cleanText(input.businessName, 40, "Business name");
  if (typeof businessName !== "string") return { ok: false, error: businessName.error };
  const taglineRaw = typeof input.tagline === "string" ? input.tagline : "";
  const tagline = cleanText(taglineRaw, 80, "Tagline", 0);
  if (typeof tagline !== "string") return { ok: false, error: tagline.error };
  const cityRaw = typeof input.city === "string" ? input.city : "";
  const city = cleanText(cityRaw, 40, "City", 0);
  if (typeof city !== "string") return { ok: false, error: city.error };
  if (!RAILS.includes(input.primaryRail as Rail)) return { ok: false, error: "Pick a wallet rail" };
  if (typeof input.sandbox !== "boolean") return { ok: false, error: "Sandbox flag is invalid" };

  const sql = await openDb();
  const merchant = await loadMerchant(sql);
  if (!authorized(merchant, input.key)) return { ok: false, error: "Operator key does not match" };

  await sql`
    update merchant set
      business_name = ${businessName},
      tagline = ${tagline},
      city = ${city},
      primary_rail = ${input.primaryRail},
      sandbox = ${input.sandbox},
      updated_at = now()
    where id = 1
  `;
  return { ok: true, merchant: publicMerchant(await loadMerchant(sql)) };
}

export async function saveQr(input: {
  key: string;
  rail: string;
  dataUrl: string;
}): Promise<{ ok: true; merchant: MerchantPublic } | { ok: false; error: string }> {
  if (!RAILS.includes(input.rail as Rail)) return { ok: false, error: "Unknown wallet" };
  const dataUrl = cleanQr(input.dataUrl);
  if (typeof dataUrl !== "string") return { ok: false, error: dataUrl.error };
  const sql = await openDb();
  const merchant = await loadMerchant(sql);
  if (!authorized(merchant, input.key)) return { ok: false, error: "Operator key does not match" };
  const rail = input.rail as Rail;
  if (rail === "gcash") {
    await sql`update merchant set gcash_qr = ${dataUrl}, updated_at = now() where id = 1`;
  } else if (rail === "maya") {
    await sql`update merchant set maya_qr = ${dataUrl}, updated_at = now() where id = 1`;
  } else {
    await sql`update merchant set qrph_qr = ${dataUrl}, updated_at = now() where id = 1`;
  }
  return { ok: true, merchant: publicMerchant(await loadMerchant(sql)) };
}

export async function createCharge(input: {
  amountPesos: unknown;
  description: unknown;
  returnUrl?: unknown;
  source?: unknown;
}): Promise<{ ok: true; charge: ChargeView; payPath: string } | { ok: false; error: string }> {
  const centavos = parsePesos(input.amountPesos);
  if (typeof centavos !== "number") return { ok: false, error: centavos.error };
  const description = cleanText(input.description, 120, "Description");
  if (typeof description !== "string") return { ok: false, error: description.error };
  const returnUrl = cleanReturnUrl(input.returnUrl ?? "");
  if (typeof returnUrl !== "string") return { ok: false, error: returnUrl.error };
  const source = typeof input.source === "string" && SOURCES.has(input.source) ? input.source : "api";

  const sql = await openDb();
  const countRows = await sql<{ n: number }>`select count(*)::int as n from charges`;
  const n = Number(countRows[0]?.n ?? 0);
  if (n >= 200) {
    return { ok: false, error: "This gateway is full. Confirm existing payments or wait until they expire." };
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const id = `pl_${randomBytes(4).toString("hex")}`;
    const reference = humanRef();
    try {
      const rows = await sql<ChargeRow>`
        insert into charges (id, amount_centavos, description, reference, status, source, return_url, expires_at)
        values (
          ${id},
          ${centavos},
          ${description},
          ${reference},
          'pending',
          ${source},
          ${returnUrl},
          now() + interval '24 hours'
        )
        returning id, amount_centavos, description, reference, status, source, return_url,
          to_char(created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at,
          to_char(claimed_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as claimed_at,
          to_char(paid_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as paid_at,
          to_char(expires_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as expires_at
      `;
      if (!rows[0]) return { ok: false, error: "Could not create the payment" };
      return { ok: true, charge: mapCharge(rows[0]), payPath: `/pay/${id}` };
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (!/unique|duplicate/i.test(message)) throw err;
    }
  }
  return { ok: false, error: "Could not allocate a payment reference. Try again." };
}

async function mutateStatus(
  id: string,
  next: "claimed" | "paid" | "cancelled",
  from: ChargeStatus[],
): Promise<ChargeView | null> {
  const sql = await openDb();
  if (!isChargeId(id)) return null;
  let rows: ChargeRow[] = [];
  if (next === "claimed") {
    rows = await sql<ChargeRow>`
      update charges set status = 'claimed', claimed_at = now()
      where id = ${id} and status = 'pending'
      returning id, amount_centavos, description, reference, status, source, return_url,
        to_char(created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at,
        to_char(claimed_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as claimed_at,
        to_char(paid_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as paid_at,
        to_char(expires_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as expires_at
    `;
  } else if (next === "paid") {
    rows = await sql<ChargeRow>`
      update charges set status = 'paid', paid_at = now()
      where id = ${id} and status in ('pending', 'claimed')
      returning id, amount_centavos, description, reference, status, source, return_url,
        to_char(created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at,
        to_char(claimed_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as claimed_at,
        to_char(paid_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as paid_at,
        to_char(expires_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as expires_at
    `;
  } else {
    rows = await sql<ChargeRow>`
      update charges set status = 'cancelled'
      where id = ${id} and status in ('pending', 'claimed')
      returning id, amount_centavos, description, reference, status, source, return_url,
        to_char(created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at,
        to_char(claimed_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as claimed_at,
        to_char(paid_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as paid_at,
        to_char(expires_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as expires_at
    `;
  }
  if (rows[0]) return mapCharge(rows[0]);
  return loadCharge(sql, id);
}

export async function claimPayment(id: string): Promise<{ ok: true; charge: ChargeView } | { ok: false; error: string }> {
  const charge = await mutateStatus(id, "claimed", ["pending"]);
  if (!charge) return { ok: false, error: "Payment not found" };
  if (charge.status === "expired") return { ok: false, error: "This pay link has expired" };
  if (charge.status === "cancelled") return { ok: false, error: "This pay link was cancelled" };
  return { ok: true, charge };
}

export async function simulatePayment(
  id: string,
): Promise<{ ok: true; charge: ChargeView } | { ok: false; error: string }> {
  const sql = await openDb();
  const merchant = await loadMerchant(sql);
  if (!merchant.sandbox) return { ok: false, error: "Sandbox mode is off. Pay by QR, then confirm in the console." };
  const charge = await mutateStatus(id, "paid", ["pending", "claimed"]);
  if (!charge) return { ok: false, error: "Payment not found" };
  if (charge.status !== "paid") return { ok: false, error: "This payment can no longer be simulated" };
  return { ok: true, charge };
}

export async function confirmPayment(input: {
  key: string;
  id: string;
}): Promise<{ ok: true; charge: ChargeView } | { ok: false; error: string }> {
  const sql = await openDb();
  const merchant = await loadMerchant(sql);
  if (!authorized(merchant, input.key)) return { ok: false, error: "Operator key does not match" };
  const charge = await mutateStatus(input.id, "paid", ["pending", "claimed"]);
  if (!charge) return { ok: false, error: "Payment not found" };
  if (charge.status !== "paid") return { ok: false, error: "Only open payments can be confirmed" };
  return { ok: true, charge };
}

export async function cancelPayment(input: {
  key: string;
  id: string;
}): Promise<{ ok: true; charge: ChargeView } | { ok: false; error: string }> {
  const sql = await openDb();
  const merchant = await loadMerchant(sql);
  if (!authorized(merchant, input.key)) return { ok: false, error: "Operator key does not match" };
  const charge = await mutateStatus(input.id, "cancelled", ["pending", "claimed"]);
  if (!charge) return { ok: false, error: "Payment not found" };
  if (charge.status !== "cancelled") return { ok: false, error: "Only open payments can be cancelled" };
  return { ok: true, charge };
}

export function corsJson(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "content-type, x-paylink-key",
      "access-control-allow-methods": "GET, POST, OPTIONS",
    },
  });
}

export function corsEmpty(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "content-type, x-paylink-key",
      "access-control-allow-methods": "GET, POST, OPTIONS",
    },
  });
}

function chargePayload(charge: ChargeView, request: Request) {
  const origin = new URL(request.url).origin;
  return {
    id: charge.id,
    reference: charge.reference,
    amount: charge.amountCentavos / 100,
    currency: "PHP",
    description: charge.description,
    status: charge.status,
    payPath: `/pay/${charge.id}`,
    payUrl: `${origin}/pay/${charge.id}`,
    expiresAt: charge.expiresAt,
  };
}

async function keyOk(request: Request, sql: Sql): Promise<boolean> {
  const presented = request.headers.get("x-paylink-key") ?? "";
  const merchant = await loadMerchant(sql);
  if (!merchant.publishableKey || !presented) return false;
  return safeEqual(merchant.publishableKey, presented);
}

export async function apiCreateCharge(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return corsJson({ error: "Invalid JSON" }, 400);
  }
  const record = typeof body === "object" && body ? (body as Record<string, unknown>) : {};
  const sql = await openDb();
  if (!(await keyOk(request, sql))) return corsJson({ error: "Invalid publishable key" }, 401);
  const created = await createCharge({
    amountPesos: record.amount,
    description: record.description,
    returnUrl: record.returnUrl ?? "",
    source: record.source === "widget" ? "widget" : "api",
  });
  if (!created.ok) return corsJson({ error: created.error }, 400);
  return corsJson(chargePayload(created.charge, request), 201);
}

export async function apiGetCharge(request: Request, id: string): Promise<Response> {
  const sql = await openDb();
  const charge = await loadCharge(sql, id);
  if (!charge) return corsJson({ error: "Payment not found" }, 404);
  return corsJson(chargePayload(charge, request));
}
