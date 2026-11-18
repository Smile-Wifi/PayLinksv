import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, S as useRouter, X as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as formatWhen, n as formatPeso, r as formatRef, t as SiteHeader } from "./money-UF6AmcDP.mjs";
import { r as StatusPill, t as Button } from "./ui-CyE1K9AO.mjs";
import { o as Copy, r as Smartphone, s as CircleCheck } from "../_libs/lucide-react.mjs";
import { h as simulatePayment, l as claimPayment, r as Route$3 } from "./router-CfMzJ1-m.mjs";
import { t as absoluteAppUrl } from "./public-url-4ez33Kiw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pay._chargeId-DwG8mjF_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QrCodeImage({ value, label }) {
	const [src, setSrc] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let live = true;
		import("../_libs/qrcode.mjs").then((n) => /* @__PURE__ */ __toESM(n.t())).then((mod) => mod.toDataURL(value, {
			margin: 1,
			width: 360,
			errorCorrectionLevel: "M",
			color: {
				dark: "#102033",
				light: "#fffdf8"
			}
		})).then((url) => {
			if (live) setSrc(url);
		}).catch(() => {
			if (live) setSrc("");
		});
		return () => {
			live = false;
		};
	}, [value]);
	if (!src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid size-56 place-items-center rounded-2xl bg-paper-2 text-sm text-muted",
		children: "Preparing QR…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: label,
		className: "size-56 rounded-2xl bg-surface"
	});
}
var RAILS = [
	{
		id: "qrph",
		label: "QR Ph",
		hint: "GCash, Maya, and most bank apps"
	},
	{
		id: "gcash",
		label: "GCash",
		hint: "Scan inside the GCash app"
	},
	{
		id: "maya",
		label: "Maya",
		hint: "Scan inside the Maya app"
	}
];
function railImage(merchant, rail) {
	if (rail === "gcash") return merchant.gcashQr;
	if (rail === "maya") return merchant.mayaQr;
	return merchant.qrphQr;
}
function CheckoutCard({ charge, merchant, busy, error, onClaim, onSimulate }) {
	const available = RAILS.filter((rail) => railImage(merchant, rail.id));
	const initial = available.some((rail) => rail.id === merchant.primaryRail) ? merchant.primaryRail : available[0]?.id ?? merchant.primaryRail;
	const [rail, setRail] = (0, import_react.useState)(initial);
	const [copied, setCopied] = (0, import_react.useState)("");
	const image = railImage(merchant, rail);
	const open = charge.status === "pending" || charge.status === "claimed";
	const shareUrl = absoluteAppUrl(`/pay/${charge.id}`);
	const referencePayload = `PAYLINK PH\nREF ${charge.reference}\nPHP ${(charge.amountCentavos / 100).toFixed(2)}\n${merchant.businessName}`;
	async function copy(label, value) {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto grid w-full max-w-lg gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-[0.16em] text-gold",
					children: "PayLink PH"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl text-ink",
						children: merchant.businessName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [merchant.tagline || "Scan to pay, or send this link.", merchant.city ? ` · ${merchant.city}` : ""]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: charge.status })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-line bg-surface px-5 py-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: charge.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-5xl tabular-nums tracking-tight text-ink",
						children: formatPeso(charge.amountCentavos)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center justify-between gap-3 rounded-xl bg-paper px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-muted",
							children: "Message / reference"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl tracking-wide text-ink",
							children: formatRef(charge.reference)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							tone: "quiet",
							onClick: () => void copy("ref", charge.reference),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
								className: "size-4",
								"aria-hidden": "true"
							}), copied === "ref" ? "Copied" : "Copy"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-muted",
						children: [
							"Pay the exact amount. Paste the reference into the wallet message so the merchant can match it. Expires",
							" ",
							formatWhen(charge.expiresAt),
							"."
						]
					})
				]
			}),
			charge.status === "paid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 rounded-2xl bg-mint px-5 py-5 text-paper",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
						className: "size-8",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl",
						children: "Payment confirmed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							charge.paidAt ? `Marked paid ${formatWhen(charge.paidAt)}.` : "Marked paid.",
							" Keep the reference",
							" ",
							formatRef(charge.reference),
							" for your receipt."
						]
					}),
					returnHref ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: returnHref,
						className: "inline-flex min-h-11 items-center justify-center rounded-full bg-paper px-4 text-sm font-semibold text-ink",
						children: ["Return to ", merchant.businessName]
					}) : null
				]
			}) : null,
			charge.status === "claimed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-2xl border border-line bg-paper-2 px-4 py-3 text-sm text-ink",
				children: "You marked this as sent. It stays pending until the merchant sees the money and confirms it."
			}) : null,
			charge.status === "expired" || charge.status === "cancelled" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "rounded-2xl border border-coral/30 bg-surface px-4 py-3 text-sm text-coral",
				children: [
					"This pay link is ",
					charge.status,
					". Ask ",
					merchant.businessName,
					" for a new one."
				]
			}) : null,
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid justify-items-center gap-4 rounded-2xl border border-line bg-surface px-4 py-5",
				children: [
					available.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap justify-center gap-2",
							children: RAILS.map((item) => {
								const ready = Boolean(railImage(merchant, item.id));
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: !ready,
									onClick: () => setRail(item.id),
									className: rail === item.id ? "min-h-11 rounded-full bg-ink px-4 text-sm font-semibold text-paper" : "min-h-11 rounded-full border border-line px-4 text-sm font-semibold text-ink disabled:opacity-40",
									children: item.label
								}, item.id);
							})
						}),
						image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: image,
							alt: `${rail} QR for ${merchant.businessName}`,
							className: "size-64 rounded-2xl bg-surface object-contain"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "No QR saved for this wallet yet."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-xs text-center text-sm text-muted",
							children: RAILS.find((item) => item.id === rail)?.hint
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid justify-items-center gap-3 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCodeImage, {
							value: referencePayload,
							label: "Payment reference QR"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-xs text-sm text-muted",
							children: "Reference QR only — it is not a wallet payment code. Upload a GCash, Maya, or QR Ph image in the console to accept a real scan."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "grid w-full gap-2 text-sm text-ink",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3 rounded-xl bg-paper px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-gold",
									children: "1"
								}), "Open GCash, Maya, or any QR Ph app."]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3 rounded-xl bg-paper px-3 py-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-gold",
										children: "2"
									}),
									"Scan the code and enter ",
									formatPeso(charge.amountCentavos),
									"."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3 rounded-xl bg-paper px-3 py-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-gold",
										children: "3"
									}),
									"Put ",
									formatRef(charge.reference),
									" in the message field."
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid w-full gap-2",
						children: [
							charge.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: onClaim,
								disabled: busy,
								children: "I've sent the payment"
							}) : null,
							merchant.sandbox ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								tone: "gold",
								onClick: onSimulate,
								disabled: busy,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, {
									className: "size-4",
									"aria-hidden": "true"
								}), "Simulate wallet payment"]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								tone: "quiet",
								onClick: () => void copy("link", shareUrl || `/pay/${charge.id}`),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
									className: "size-4",
									"aria-hidden": "true"
								}), copied === "link" ? "Link copied" : "Copy pay link"]
							})
						]
					}),
					merchant.sandbox ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-xs text-muted",
						children: "Sandbox is on. Simulated payments do not move money. Turn it off in the console for live confirm-only mode."
					}) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-sm text-coral",
						children: error
					}) : null
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid justify-items-center gap-2 rounded-2xl border border-dashed border-line px-4 py-4 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCodeImage, {
					value: shareUrl || referencePayload,
					label: "QR that opens this pay link"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Scan to open this pay link on another phone."
				})]
			})
		]
	});
}
function PayPage() {
	const initial = Route$3.useLoaderData();
	const router = useRouter();
	const [charge, setCharge] = (0, import_react.useState)(initial.ok && initial.found ? initial.charge : null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (initial.ok && initial.found) setCharge(initial.charge);
	}, [initial]);
	(0, import_react.useEffect)(() => {
		if (!charge || charge.status === "paid" || charge.status === "expired" || charge.status === "cancelled") return;
		const timer = window.setInterval(() => {
			router.invalidate();
		}, 4e3);
		return () => window.clearInterval(timer);
	}, [charge, router]);
	if (!initial.ok || !initial.found || !charge) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-lg px-4 py-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl",
				children: "Pay link not found"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted",
				children: "That charge does not exist, or the link was typed wrong."
			})]
		})]
	});
	async function run(action) {
		setBusy(true);
		setError("");
		const result = action === "claim" ? await claimPayment({ data: { id: charge.id } }) : await simulatePayment({ data: { id: charge.id } });
		setBusy(false);
		if (!result.ok) {
			setError(result.error);
			return;
		}
		setCharge(result.charge);
		router.invalidate();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "px-4 py-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckoutCard, {
				charge,
				merchant: initial.merchant,
				busy,
				error,
				onClaim: () => void run("claim"),
				onSimulate: () => void run("simulate")
			})
		})]
	});
}
//#endregion
export { PayPage as component };
