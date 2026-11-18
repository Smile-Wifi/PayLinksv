import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/paylink.core-DccOj7TW.js
var _0002_paylink_default = "create table if not exists merchant (\n  id integer primary key,\n  business_name text not null default 'Harbor Kape',\n  tagline text not null default 'A demo café checkout on PayLink PH',\n  city text not null default '',\n  gcash_qr text not null default '',\n  maya_qr text not null default '',\n  qrph_qr text not null default '',\n  primary_rail text not null default 'qrph',\n  sandbox boolean not null default true,\n  publishable_key text not null default '',\n  operator_hash text not null default '',\n  updated_at timestamptz not null default now(),\n  constraint merchant_singleton check (id = 1),\n  constraint merchant_rail_chk check (primary_rail in ('gcash', 'maya', 'qrph'))\n);\n\ninsert into merchant (id) values (1) on conflict (id) do nothing;\n\ncreate table if not exists charges (\n  id text primary key,\n  amount_centavos integer not null,\n  description text not null,\n  reference text not null unique,\n  status text not null default 'pending',\n  source text not null default 'api',\n  return_url text not null default '',\n  created_at timestamptz not null default now(),\n  claimed_at timestamptz,\n  paid_at timestamptz,\n  expires_at timestamptz not null,\n  constraint charges_amount_chk check (amount_centavos >= 100 and amount_centavos <= 5000000),\n  constraint charges_status_chk check (status in ('pending', 'claimed', 'paid', 'expired', 'cancelled'))\n);\n\ncreate index if not exists charges_created_idx on charges (created_at desc);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_paylink.sql": _0002_paylink_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
var RAILS = [
	"qrph",
	"gcash",
	"maya"
];
var SOURCES = /* @__PURE__ */ new Set([
	"console",
	"store",
	"api",
	"sample",
	"widget"
]);
function hashKey(key) {
	return createHash("sha256").update(key).digest("hex");
}
function safeEqual(a, b) {
	const ba = Buffer.from(a);
	const bb = Buffer.from(b);
	if (ba.length !== bb.length) return false;
	return timingSafeEqual(ba, bb);
}
function asRail(value) {
	return value === "gcash" || value === "maya" || value === "qrph" ? value : "qrph";
}
function asStatus(value) {
	if (value === "pending" || value === "claimed" || value === "paid" || value === "expired" || value === "cancelled") return value;
	return "pending";
}
function mapCharge(row) {
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
		expiresAt: row.expires_at
	};
}
function mapMerchant(row) {
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
		operatorHash: row.operator_hash
	};
}
function cleanText(value, max, label, min = 1) {
	if (typeof value !== "string") return { error: `${label} is required` };
	const text = value.replace(/[\u0000-\u001F]/g, "").trim();
	if (text.length < min) return { error: min === 0 ? `${label} is invalid` : `${label} is required` };
	if (text.length > max) return { error: `${label} is too long` };
	return text;
}
function parsePesos(value) {
	const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
	if (!Number.isFinite(n)) return { error: "Enter a valid amount in pesos" };
	const centavos = Math.round(n * 100);
	if (Math.abs(n * 100 - centavos) > .01) return { error: "Use at most 2 decimal places" };
	if (centavos < 100) return { error: "Minimum amount is ₱1.00" };
	if (centavos > 5e6) return { error: "Maximum amount is ₱50,000.00" };
	return centavos;
}
function cleanReturnUrl(value) {
	if (value == null || value === "") return "";
	if (typeof value !== "string") return { error: "Return URL is invalid" };
	const text = value.trim();
	if (!text) return "";
	if (text.length > 500) return { error: "Return URL is too long" };
	let url;
	try {
		url = new URL(text);
	} catch {
		return { error: "Return URL must be a full http(s) link" };
	}
	if (url.protocol !== "https:" && url.protocol !== "http:") return { error: "Return URL must start with http or https" };
	return url.toString();
}
function cleanQr(value) {
	if (value == null || value === "") return "";
	if (typeof value !== "string") return { error: "QR image is invalid" };
	const compact = value.replace(/\s/g, "");
	if (compact.length > 56e4) return { error: "QR image must be under 400 KB" };
	if (!/^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(compact)) return { error: "Use a PNG, JPG, or WebP QR image" };
	return compact;
}
function humanRef() {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	const bytes = randomBytes(8);
	let out = "";
	for (let i = 0; i < 8; i += 1) out += alphabet[bytes[i] % 32];
	return out;
}
function isChargeId(id) {
	return /^pl_[a-f0-9]{8}$/.test(id);
}
async function openDb() {
	const sql = await getSql();
	await sql`update charges set status = 'expired' where status in ('pending', 'claimed') and expires_at < now()`;
	const existing = await sql`select publishable_key from merchant where id = 1`;
	if (!existing[0]) throw new Error("Merchant record missing");
	if (!existing[0].publishable_key) await sql`update merchant set publishable_key = ${`pk_${randomBytes(12).toString("hex")}`} where id = 1 and publishable_key = ''`;
	return sql;
}
async function loadMerchant(sql) {
	const rows = await sql`
    select business_name, tagline, city, gcash_qr, maya_qr, qrph_qr, primary_rail, sandbox, publishable_key, operator_hash
    from merchant where id = 1
  `;
	if (!rows[0]) throw new Error("Merchant record missing");
	return mapMerchant(rows[0]);
}
async function loadCharge(sql, id) {
	if (!isChargeId(id)) return null;
	const rows = await sql`
    select id, amount_centavos, description, reference, status, source, return_url,
      to_char(created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at,
      to_char(claimed_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as claimed_at,
      to_char(paid_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as paid_at,
      to_char(expires_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as expires_at
    from charges where id = ${id}
  `;
	return rows[0] ? mapCharge(rows[0]) : null;
}
function publicMerchant(m) {
	return {
		businessName: m.businessName,
		tagline: m.tagline,
		city: m.city,
		gcashQr: m.gcashQr,
		mayaQr: m.mayaQr,
		qrphQr: m.qrphQr,
		primaryRail: m.primaryRail,
		sandbox: m.sandbox,
		publishableKey: m.publishableKey
	};
}
function authorized(m, key) {
	if (typeof key !== "string" || key.length < 16 || key.length > 80) return false;
	if (!m.operatorHash) return false;
	return safeEqual(m.operatorHash, hashKey(key));
}
async function getPublicMerchant() {
	return publicMerchant(await loadMerchant(await openDb()));
}
async function getPayPage(id) {
	const sql = await openDb();
	const charge = await loadCharge(sql, id);
	if (!charge) return {
		ok: true,
		found: false
	};
	return {
		ok: true,
		found: true,
		charge,
		merchant: publicMerchant(await loadMerchant(sql))
	};
}
async function consoleGate(key) {
	const sql = await openDb();
	const merchant = await loadMerchant(sql);
	if (!merchant.operatorHash || !authorized(merchant, key)) return {
		ok: true,
		claimed: merchant.operatorHash.length > 0,
		authorized: false,
		businessName: merchant.businessName
	};
	const rows = await sql`
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
		charges: rows.map(mapCharge)
	};
}
async function claimConsole(key) {
	if (typeof key !== "string" || !/^ok_[a-f0-9]{32}$/.test(key)) return {
		ok: false,
		error: "Operator key is invalid"
	};
	if (!(await (await openDb())`
    update merchant
    set operator_hash = ${hashKey(key)}, updated_at = now()
    where id = 1 and operator_hash = ''
    returning id
  `)[0]) return {
		ok: false,
		error: "This console is already claimed. Paste the operator key."
	};
	return { ok: true };
}
async function saveProfile(input) {
	const businessName = cleanText(input.businessName, 40, "Business name");
	if (typeof businessName !== "string") return {
		ok: false,
		error: businessName.error
	};
	const tagline = cleanText(typeof input.tagline === "string" ? input.tagline : "", 80, "Tagline", 0);
	if (typeof tagline !== "string") return {
		ok: false,
		error: tagline.error
	};
	const city = cleanText(typeof input.city === "string" ? input.city : "", 40, "City", 0);
	if (typeof city !== "string") return {
		ok: false,
		error: city.error
	};
	if (!RAILS.includes(input.primaryRail)) return {
		ok: false,
		error: "Pick a wallet rail"
	};
	if (typeof input.sandbox !== "boolean") return {
		ok: false,
		error: "Sandbox flag is invalid"
	};
	const sql = await openDb();
	if (!authorized(await loadMerchant(sql), input.key)) return {
		ok: false,
		error: "Operator key does not match"
	};
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
	return {
		ok: true,
		merchant: publicMerchant(await loadMerchant(sql))
	};
}
async function saveQr(input) {
	if (!RAILS.includes(input.rail)) return {
		ok: false,
		error: "Unknown wallet"
	};
	const dataUrl = cleanQr(input.dataUrl);
	if (typeof dataUrl !== "string") return {
		ok: false,
		error: dataUrl.error
	};
	const sql = await openDb();
	if (!authorized(await loadMerchant(sql), input.key)) return {
		ok: false,
		error: "Operator key does not match"
	};
	const rail = input.rail;
	if (rail === "gcash") await sql`update merchant set gcash_qr = ${dataUrl}, updated_at = now() where id = 1`;
	else if (rail === "maya") await sql`update merchant set maya_qr = ${dataUrl}, updated_at = now() where id = 1`;
	else await sql`update merchant set qrph_qr = ${dataUrl}, updated_at = now() where id = 1`;
	return {
		ok: true,
		merchant: publicMerchant(await loadMerchant(sql))
	};
}
async function createCharge(input) {
	const centavos = parsePesos(input.amountPesos);
	if (typeof centavos !== "number") return {
		ok: false,
		error: centavos.error
	};
	const description = cleanText(input.description, 120, "Description");
	if (typeof description !== "string") return {
		ok: false,
		error: description.error
	};
	const returnUrl = cleanReturnUrl(input.returnUrl ?? "");
	if (typeof returnUrl !== "string") return {
		ok: false,
		error: returnUrl.error
	};
	const source = typeof input.source === "string" && SOURCES.has(input.source) ? input.source : "api";
	const sql = await openDb();
	const countRows = await sql`select count(*)::int as n from charges`;
	if (Number(countRows[0]?.n ?? 0) >= 200) return {
		ok: false,
		error: "This gateway is full. Confirm existing payments or wait until they expire."
	};
	for (let attempt = 0; attempt < 5; attempt += 1) {
		const id = `pl_${randomBytes(4).toString("hex")}`;
		const reference = humanRef();
		try {
			const rows = await sql`
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
			if (!rows[0]) return {
				ok: false,
				error: "Could not create the payment"
			};
			return {
				ok: true,
				charge: mapCharge(rows[0]),
				payPath: `/pay/${id}`
			};
		} catch (err) {
			const message = err instanceof Error ? err.message : "";
			if (!/unique|duplicate/i.test(message)) throw err;
		}
	}
	return {
		ok: false,
		error: "Could not allocate a payment reference. Try again."
	};
}
async function mutateStatus(id, next, from) {
	const sql = await openDb();
	if (!isChargeId(id)) return null;
	let rows = [];
	if (next === "claimed") rows = await sql`
      update charges set status = 'claimed', claimed_at = now()
      where id = ${id} and status = 'pending'
      returning id, amount_centavos, description, reference, status, source, return_url,
        to_char(created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at,
        to_char(claimed_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as claimed_at,
        to_char(paid_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as paid_at,
        to_char(expires_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as expires_at
    `;
	else if (next === "paid") rows = await sql`
      update charges set status = 'paid', paid_at = now()
      where id = ${id} and status in ('pending', 'claimed')
      returning id, amount_centavos, description, reference, status, source, return_url,
        to_char(created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at,
        to_char(claimed_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as claimed_at,
        to_char(paid_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as paid_at,
        to_char(expires_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as expires_at
    `;
	else rows = await sql`
      update charges set status = 'cancelled'
      where id = ${id} and status in ('pending', 'claimed')
      returning id, amount_centavos, description, reference, status, source, return_url,
        to_char(created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at,
        to_char(claimed_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as claimed_at,
        to_char(paid_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as paid_at,
        to_char(expires_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as expires_at
    `;
	if (rows[0]) return mapCharge(rows[0]);
	return loadCharge(sql, id);
}
async function claimPayment(id) {
	const charge = await mutateStatus(id, "claimed", ["pending"]);
	if (!charge) return {
		ok: false,
		error: "Payment not found"
	};
	if (charge.status === "expired") return {
		ok: false,
		error: "This pay link has expired"
	};
	if (charge.status === "cancelled") return {
		ok: false,
		error: "This pay link was cancelled"
	};
	return {
		ok: true,
		charge
	};
}
async function simulatePayment(id) {
	if (!(await loadMerchant(await openDb())).sandbox) return {
		ok: false,
		error: "Sandbox mode is off. Pay by QR, then confirm in the console."
	};
	const charge = await mutateStatus(id, "paid", ["pending", "claimed"]);
	if (!charge) return {
		ok: false,
		error: "Payment not found"
	};
	if (charge.status !== "paid") return {
		ok: false,
		error: "This payment can no longer be simulated"
	};
	return {
		ok: true,
		charge
	};
}
async function confirmPayment(input) {
	if (!authorized(await loadMerchant(await openDb()), input.key)) return {
		ok: false,
		error: "Operator key does not match"
	};
	const charge = await mutateStatus(input.id, "paid", ["pending", "claimed"]);
	if (!charge) return {
		ok: false,
		error: "Payment not found"
	};
	if (charge.status !== "paid") return {
		ok: false,
		error: "Only open payments can be confirmed"
	};
	return {
		ok: true,
		charge
	};
}
async function cancelPayment(input) {
	if (!authorized(await loadMerchant(await openDb()), input.key)) return {
		ok: false,
		error: "Operator key does not match"
	};
	const charge = await mutateStatus(input.id, "cancelled", ["pending", "claimed"]);
	if (!charge) return {
		ok: false,
		error: "Payment not found"
	};
	if (charge.status !== "cancelled") return {
		ok: false,
		error: "Only open payments can be cancelled"
	};
	return {
		ok: true,
		charge
	};
}
function corsJson(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"content-type": "application/json; charset=utf-8",
			"access-control-allow-origin": "*",
			"access-control-allow-headers": "content-type, x-paylink-key",
			"access-control-allow-methods": "GET, POST, OPTIONS"
		}
	});
}
function corsEmpty() {
	return new Response(null, {
		status: 204,
		headers: {
			"access-control-allow-origin": "*",
			"access-control-allow-headers": "content-type, x-paylink-key",
			"access-control-allow-methods": "GET, POST, OPTIONS"
		}
	});
}
function chargePayload(charge, request) {
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
		expiresAt: charge.expiresAt
	};
}
async function keyOk(request, sql) {
	const presented = request.headers.get("x-paylink-key") ?? "";
	const merchant = await loadMerchant(sql);
	if (!merchant.publishableKey || !presented) return false;
	return safeEqual(merchant.publishableKey, presented);
}
async function apiCreateCharge(request) {
	let body;
	try {
		body = await request.json();
	} catch {
		return corsJson({ error: "Invalid JSON" }, 400);
	}
	const record = typeof body === "object" && body ? body : {};
	if (!await keyOk(request, await openDb())) return corsJson({ error: "Invalid publishable key" }, 401);
	const created = await createCharge({
		amountPesos: record.amount,
		description: record.description,
		returnUrl: record.returnUrl ?? "",
		source: record.source === "widget" ? "widget" : "api"
	});
	if (!created.ok) return corsJson({ error: created.error }, 400);
	return corsJson(chargePayload(created.charge, request), 201);
}
async function apiGetCharge(request, id) {
	const charge = await loadCharge(await openDb(), id);
	if (!charge) return corsJson({ error: "Payment not found" }, 404);
	return corsJson(chargePayload(charge, request));
}
//#endregion
export { apiCreateCharge, apiGetCharge, cancelPayment, claimConsole, claimPayment, cleanReturnUrl, confirmPayment, consoleGate, corsEmpty, corsJson, createCharge, getPayPage, getPublicMerchant, parsePesos, saveProfile, saveQr, simulatePayment };
