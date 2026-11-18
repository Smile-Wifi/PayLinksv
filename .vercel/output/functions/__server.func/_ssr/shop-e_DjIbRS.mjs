import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as formatPeso, t as SiteHeader } from "./money-UF6AmcDP.mjs";
import { t as Button } from "./ui-CyE1K9AO.mjs";
import { n as PRODUCTS } from "./catalog-PLMzUis5.mjs";
import { d as createCharge, i as Route$4 } from "./router-CfMzJ1-m.mjs";
import { t as absoluteAppUrl } from "./public-url-4ez33Kiw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-e_DjIbRS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Shop() {
	const merchant = Route$4.useLoaderData();
	const navigate = useNavigate();
	const [qty, setQty] = (0, import_react.useState)({});
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const lines = PRODUCTS.map((product) => ({
		...product,
		qty: qty[product.id] ?? 0
	})).filter((line) => line.qty > 0);
	const totalPesos = lines.reduce((sum, line) => sum + line.pesos * line.qty, 0);
	const count = lines.reduce((sum, line) => sum + line.qty, 0);
	const summary = (0, import_react.useMemo)(() => lines.map((line) => `${line.qty}× ${line.name}`).join(", "), [lines]);
	function bump(id, delta) {
		setQty((current) => {
			const next = Math.max(0, (current[id] ?? 0) + delta);
			return {
				...current,
				[id]: next
			};
		});
	}
	async function checkout() {
		if (!lines.length || busy) return;
		setBusy(true);
		setError("");
		const returnUrl = absoluteAppUrl("/shop/thanks");
		const result = await createCharge({ data: {
			amountPesos: totalPesos,
			description: summary.slice(0, 120),
			returnUrl,
			source: "store"
		} });
		setBusy(false);
		if (!result.ok) {
			setError(result.error);
			return;
		}
		await navigate({
			to: "/pay/$chargeId",
			params: { chargeId: result.charge.id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper pb-28 text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto grid max-w-3xl gap-6 px-4 py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-[0.16em] text-gold",
								children: "Demo shop"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-4xl",
								children: merchant.businessName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "max-w-xl text-muted",
								children: [merchant.tagline || "A mock storefront checking out through PayLink PH.", " Add something, then pay by link."]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-3",
						children: PRODUCTS.map((product) => {
							const n = qty[product.id] ?? 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3 rounded-2xl border border-line bg-surface p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid size-14 shrink-0 place-items-center rounded-xl bg-ink font-display text-lg text-gold-2",
										children: product.mark
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold",
												children: product.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted",
												children: product.detail
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 tabular-nums",
												children: formatPeso(product.pesos * 100)
											})
										]
									}),
									n === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										tone: "quiet",
										onClick: () => bump(product.id, 1),
										children: "Add"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												tone: "quiet",
												className: "size-11 px-0",
												onClick: () => bump(product.id, -1),
												"aria-label": `Remove one ${product.name}`,
												children: "−"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-6 text-center tabular-nums",
												children: n
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												tone: "quiet",
												className: "size-11 px-0",
												onClick: () => bump(product.id, 1),
												"aria-label": `Add another ${product.name}`,
												children: "+"
											})
										]
									})
								]
							}, product.id);
						})
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-coral",
						children: error
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-0 z-10 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-3xl items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wide text-muted",
						children: count === 0 ? "Cart empty" : `${count} in cart`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl tabular-nums",
						children: formatPeso(totalPesos * 100)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void checkout(),
						disabled: !count || busy,
						children: busy ? "Starting…" : "Pay with PayLink"
					})]
				})
			})
		]
	});
}
//#endregion
export { Shop as component };
