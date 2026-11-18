import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as formatWhen, n as formatPeso, r as formatRef, t as SiteHeader } from "./money-UF6AmcDP.mjs";
import { i as TextField, n as Panel, r as StatusPill, t as Button } from "./ui-CyE1K9AO.mjs";
import { t as OPERATOR_STORAGE_KEY } from "./catalog-PLMzUis5.mjs";
import { c as claimConsole, d as createCharge, f as fetchConsole, m as saveQr, p as saveProfile, s as cancelPayment, u as confirmPayment } from "./router-CfMzJ1-m.mjs";
import { n as appBaseUrl, t as absoluteAppUrl } from "./public-url-4ez33Kiw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/console-CnY11_os.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function readQrFile(file) {
	if (![
		"image/png",
		"image/jpeg",
		"image/webp"
	].includes(file.type)) return Promise.reject(/* @__PURE__ */ new Error("Use a PNG, JPG, or WebP screenshot of your QR"));
	if (file.size > 4e5) return Promise.reject(/* @__PURE__ */ new Error("That image is over 400 KB. Export a smaller PNG."));
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === "string") resolve(reader.result);
			else reject(/* @__PURE__ */ new Error("Could not read that image"));
		};
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read that image"));
		reader.readAsDataURL(file);
	});
}
function makeOperatorKey() {
	const bytes = /* @__PURE__ */ new Uint8Array(16);
	crypto.getRandomValues(bytes);
	return `ok_${[...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}
function ConsolePage() {
	const [ready, setReady] = (0, import_react.useState)(false);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	const [key, setKey] = (0, import_react.useState)("");
	const [paste, setPaste] = (0, import_react.useState)("");
	const [claimed, setClaimed] = (0, import_react.useState)(false);
	const [authorized, setAuthorized] = (0, import_react.useState)(false);
	const [merchant, setMerchant] = (0, import_react.useState)(null);
	const [charges, setCharges] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)("");
	const [tab, setTab] = (0, import_react.useState)("wallet");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function refresh(nextKey) {
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
	(0, import_react.useEffect)(() => {
		const stored = window.localStorage.getItem("paylink.operatorKey") ?? "";
		setKey(stored);
		setReady(true);
		refresh(stored);
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
	if (!ready || !loaded) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "px-4 py-16 text-center text-muted",
			children: "Opening console…"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid max-w-3xl gap-4 px-4 py-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "grid gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-[0.16em] text-gold",
					children: "Merchant console"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl",
					children: merchant?.businessName ?? "PayLink PH"
				})]
			}), !authorized ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl",
						children: claimed ? "Unlock the console" : "Claim this console"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: claimed ? "Payments can only be confirmed with the operator key created on first claim." : "The first claim locks confirmations to an operator key kept in this browser. Customers never see it."
					}),
					claimed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
						label: "Operator key",
						name: "operator",
						value: paste,
						autoComplete: "off",
						onChange: (event) => setPaste(event.target.value)
					}) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-coral",
						children: error
					}) : null,
					claimed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void unlock(),
						disabled: busy || paste.trim().length < 16,
						children: "Unlock"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void claim(),
						disabled: busy,
						children: "Claim console"
					})
				]
			}) : merchant ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto",
					children: [
						["wallet", "Wallet QR"],
						["link", "New link"],
						["activity", "Activity"],
						["embed", "For websites"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab(id),
						className: tab === id ? "min-h-11 shrink-0 rounded-full bg-ink px-4 text-sm font-semibold text-paper" : "min-h-11 shrink-0 rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink",
						children: label
					}, id))
				}),
				notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl bg-paper-2 px-3 py-2 text-sm",
					children: notice
				}) : null,
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-coral",
					children: error
				}) : null,
				tab === "wallet" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletTab, {
					merchant,
					operatorKey: key,
					onMerchant: setMerchant,
					onError: setError,
					onNotice: setNotice
				}) : null,
				tab === "link" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkTab, {
					onCreated: (charge) => {
						setCharges((current) => [charge, ...current.filter((item) => item.id !== charge.id)]);
						setNotice(`Pay link ready · ${formatRef(charge.reference)}`);
					},
					onError: setError
				}) : null,
				tab === "activity" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityTab, {
					charges,
					operatorKey: key,
					onChange: (charge) => setCharges((current) => current.map((item) => item.id === charge.id ? charge : item)),
					onError: setError
				}) : null,
				tab === "embed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmbedTab, { merchant }) : null
			] }) : null]
		})]
	});
}
function WalletTab({ merchant, operatorKey, onMerchant, onError, onNotice }) {
	const [businessName, setBusinessName] = (0, import_react.useState)(merchant.businessName);
	const [tagline, setTagline] = (0, import_react.useState)(merchant.tagline);
	const [city, setCity] = (0, import_react.useState)(merchant.city);
	const [primaryRail, setPrimaryRail] = (0, import_react.useState)(merchant.primaryRail);
	const [sandbox, setSandbox] = (0, import_react.useState)(merchant.sandbox);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function save() {
		setBusy(true);
		onError("");
		const result = await saveProfile({ data: {
			key: operatorKey,
			businessName,
			tagline,
			city,
			primaryRail,
			sandbox
		} });
		setBusy(false);
		if (!result.ok) {
			onError(result.error);
			return;
		}
		onMerchant(result.merchant);
		onNotice(result.merchant.sandbox ? "Profile saved. Sandbox payments are allowed." : "Profile saved. Live confirm-only mode.");
	}
	async function upload(rail, file) {
		if (!file) return;
		onError("");
		try {
			const dataUrl = await readQrFile(file);
			const result = await saveQr({ data: {
				key: operatorKey,
				rail,
				dataUrl
			} });
			if (!result.ok) onError(result.error);
			else {
				onMerchant(result.merchant);
				onNotice("Wallet QR saved. New pay links will show it.");
			}
		} catch (err) {
			onError(err instanceof Error ? err.message : "Could not read that image");
		}
	}
	async function clear(rail) {
		const result = await saveQr({ data: {
			key: operatorKey,
			rail,
			dataUrl: ""
		} });
		if (!result.ok) onError(result.error);
		else onMerchant(result.merchant);
	}
	const rails = [
		{
			id: "qrph",
			label: "QR Ph",
			image: merchant.qrphQr
		},
		{
			id: "gcash",
			label: "GCash",
			image: merchant.gcashQr
		},
		{
			id: "maya",
			label: "Maya",
			image: merchant.mayaQr
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl",
						children: "Business"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
						label: "Name on the checkout",
						name: "businessName",
						value: businessName,
						maxLength: 40,
						onChange: (event) => setBusinessName(event.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
						label: "Tagline",
						name: "tagline",
						value: tagline,
						maxLength: 80,
						onChange: (event) => setTagline(event.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
						label: "City",
						name: "city",
						value: city,
						maxLength: 40,
						onChange: (event) => setCity(event.target.value),
						hint: "Shown on the pay page. Leave blank if you prefer."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1.5 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: "Default wallet"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: primaryRail,
							onChange: (event) => setPrimaryRail(event.target.value),
							className: "h-12 rounded-xl border border-line bg-surface px-3 text-base",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "qrph",
									children: "QR Ph"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "gcash",
									children: "GCash"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "maya",
									children: "Maya"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center justify-between gap-3 rounded-xl bg-paper px-3 py-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-medium",
							children: "Sandbox mode"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "Shows “Simulate wallet payment” on checkout. Turn off for live use."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "size-5 accent-ink",
							checked: sandbox,
							onChange: (event) => setSandbox(event.target.checked)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void save(),
						disabled: busy,
						children: "Save profile"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "grid gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl",
					children: "Personal e-wallet QR"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Upload the same code you already show customers. PayLink displays it. Your wallet still receives the money."
				})] }), rails.map((rail) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 rounded-2xl border border-line p-3 sm:grid-cols-[auto_1fr] sm:items-center",
					children: [rail.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: rail.image,
						alt: `${rail.label} QR`,
						className: "size-28 rounded-xl bg-paper object-contain"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-28 place-items-center rounded-xl border border-dashed border-line text-xs text-muted",
						children: "No QR"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: rail.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-line bg-surface px-4 text-sm font-semibold",
								children: ["Upload image", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/png,image/jpeg,image/webp",
									className: "sr-only",
									onChange: (event) => {
										const file = event.target.files?.[0];
										event.target.value = "";
										upload(rail.id, file);
									}
								})]
							}),
							rail.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								tone: "quiet",
								onClick: () => void clear(rail.id),
								children: "Remove"
							}) : null
						]
					})]
				}, rail.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-wide text-muted",
					children: "Operator key"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 break-all font-mono text-sm",
					children: operatorKey
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Store this somewhere safe. It confirms and cancels payments."
				})
			] })
		]
	});
}
function LinkTab({ onCreated, onError }) {
	const [amount, setAmount] = (0, import_react.useState)("180");
	const [description, setDescription] = (0, import_react.useState)("Counter order");
	const [latest, setLatest] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function create() {
		setBusy(true);
		onError("");
		const result = await createCharge({ data: {
			amountPesos: amount,
			description,
			returnUrl: "",
			source: "console"
		} });
		setBusy(false);
		if (!result.ok) {
			onError(result.error);
			return;
		}
		setLatest(result.charge);
		onCreated(result.charge);
	}
	const href = latest ? absoluteAppUrl(resultPath(latest.id)) : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl",
				children: "Create a pay link"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "Amount in pesos",
				name: "amount",
				inputMode: "decimal",
				value: amount,
				onChange: (event) => setAmount(event.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "What it’s for",
				name: "description",
				value: description,
				maxLength: 120,
				onChange: (event) => setDescription(event.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => void create(),
				disabled: busy,
				children: busy ? "Creating…" : "Create pay link"
			}),
			latest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 rounded-xl bg-paper p-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						formatPeso(latest.amountCentavos),
						" · ",
						formatRef(latest.reference)
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "break-all text-muted",
						children: href
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/pay/$chargeId",
						params: { chargeId: latest.id },
						className: "inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-4 font-semibold text-paper",
						children: "Open checkout"
					})
				]
			}) : null
		]
	});
}
function resultPath(id) {
	return `/pay/${id}`;
}
function ActivityTab({ charges, operatorKey, onChange, onError }) {
	async function act(id, kind) {
		onError("");
		const result = kind === "confirm" ? await confirmPayment({ data: {
			key: operatorKey,
			id
		} }) : await cancelPayment({ data: {
			key: operatorKey,
			id
		} });
		if (!result.ok) onError(result.error);
		else onChange(result.charge);
	}
	if (!charges.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "text-2xl",
		children: "No payments yet"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-1 text-sm text-muted",
		children: "Create a link, or check out from the demo shop."
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "grid gap-3",
		children: charges.map((charge) => {
			const open = charge.status === "pending" || charge.status === "claimed";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "grid gap-3 rounded-2xl border border-line bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: charge.description
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								formatRef(charge.reference),
								" · ",
								formatWhen(charge.createdAt),
								" · ",
								charge.source
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: charge.status })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl tabular-nums",
						children: formatPeso(charge.amountCentavos)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/pay/$chargeId",
								params: { chargeId: charge.id },
								className: "inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm font-semibold",
								children: "Open"
							}),
							open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								tone: "mint",
								onClick: () => void act(charge.id, "confirm"),
								children: "Confirm paid"
							}) : null,
							open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								tone: "coral",
								onClick: () => void act(charge.id, "cancel"),
								children: "Cancel"
							}) : null
						]
					})
				]
			}, charge.id);
		})
	});
}
function EmbedTab({ merchant }) {
	const base = appBaseUrl();
	const snippet = `<script src="${base}/paylink.js" data-paylink-key="${merchant.publishableKey}"><\/script>
<button type="button" data-paylink data-amount="240" data-description="Ube crinkle box">
  Pay with PayLink PH
</button>`;
	const curl = `curl -X POST ${base}/api/v1/charges \\
  -H "content-type: application/json" \\
  -H "x-paylink-key: ${merchant.publishableKey}" \\
  -d '{"amount":240,"description":"Ube crinkle box"}'`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "grid gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl",
						children: "Publishable key"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "break-all font-mono text-sm",
						children: merchant.publishableKey
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Safe to put on a website. It can create pay links. It cannot confirm them."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl",
					children: "Button snippet"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "overflow-x-auto rounded-xl bg-ink p-3 text-xs leading-relaxed text-paper",
					children: snippet
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "grid gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl",
						children: "Create a charge"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "overflow-x-auto rounded-xl bg-ink p-3 text-xs leading-relaxed text-paper",
						children: curl
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"Read status with GET ",
							base,
							"/api/v1/charges/pl_xxxxxxxx. Amount is pesos. Links expire in 24 hours."
						]
					})
				]
			})
		]
	});
}
//#endregion
export { ConsolePage as component };
