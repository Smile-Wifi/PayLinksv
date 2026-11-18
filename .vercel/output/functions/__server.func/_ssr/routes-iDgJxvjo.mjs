import { C as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as formatPeso, r as formatRef, t as SiteHeader } from "./money-UF6AmcDP.mjs";
import { a as Link2, i as QrCode, n as Store } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-iDgJxvjo.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid max-w-5xl gap-10 px-4 py-8 sm:py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-[0.18em] text-gold",
								children: "Peso checkout"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "max-w-xl text-4xl leading-tight text-ink sm:text-6xl",
								children: "Your e-wallet QR, as a pay link."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "max-w-xl text-lg text-muted",
								children: "PayLink PH lets a customer scan your GCash, Maya, or QR Ph code — or open a link from any website. You confirm when the money actually lands. Nothing here holds funds."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-3 sm:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/shop",
									className: "inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-paper",
									children: "Try the demo shop"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/console",
									className: "inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-surface px-5 text-sm font-semibold text-ink",
									children: "Upload your QR"
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "rounded-3xl border border-line bg-surface p-5 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs uppercase tracking-wide text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sample pay link" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pending" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 font-display text-4xl tabular-nums",
								children: formatPeso(24e3)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: "Ube crinkle box · Harbor Kape"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 rounded-2xl bg-paper px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-wide text-muted",
									children: "Reference"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-3xl tracking-wide",
									children: formatRef("UB24KAFE")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 grid grid-cols-3 gap-2",
								children: [
									"QR Ph",
									"GCash",
									"Maya"
								].map((rail) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-20 place-items-center rounded-xl border border-dashed border-line text-xs text-muted",
									children: rail
								}, rail))
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, {
								className: "size-5",
								"aria-hidden": "true"
							}),
							title: "Scan to pay",
							body: "Customers scan the QR you already use. The amount and reference sit beside it."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, {
								className: "size-5",
								"aria-hidden": "true"
							}),
							title: "Or send a link",
							body: "Each charge gets a pay link you can text, post, or return from another site."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, {
								className: "size-5",
								"aria-hidden": "true"
							}),
							title: "Drop it on a site",
							body: "A publishable key and a button snippet start a hosted checkout from any page."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid gap-3 rounded-3xl bg-ink px-5 py-6 text-paper sm:grid-cols-[1.4fr_0.6fr] sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl",
						children: "Built for personal QR, not a bank webhook."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm text-paper/80",
						children: "GCash and Maya personal codes do not notify a website. The customer marks the payment sent. You match the reference in your wallet app and confirm. Sandbox mode lets you rehearse that without moving pesos."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/embed-demo",
						className: "inline-flex min-h-12 items-center justify-center rounded-full bg-gold-2 px-5 text-sm font-semibold text-ink",
						children: "See it on another site"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "PayLink PH is a checkout layer for your own e-wallet QR. It is not a bank, e-money issuer, or remittance company, and it never receives the payment."
				})
			]
		})]
	});
}
function Step({ icon, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "grid gap-2 rounded-2xl border border-line bg-surface p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-10 place-items-center rounded-full bg-paper text-ink",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: body
			})
		]
	});
}
//#endregion
export { Home as component };
