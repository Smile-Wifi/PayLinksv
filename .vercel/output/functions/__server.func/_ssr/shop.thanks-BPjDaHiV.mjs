import { C as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as formatPeso, r as formatRef, t as SiteHeader } from "./money-UF6AmcDP.mjs";
import { r as StatusPill } from "./ui-CyE1K9AO.mjs";
import { n as Route$2 } from "./router-CfMzJ1-m.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop.thanks-BPjDaHiV.js
var import_jsx_runtime = require_jsx_runtime();
function Thanks() {
	const data = Route$2.useLoaderData();
	const found = data && data.ok && data.found ? data : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid max-w-lg gap-4 px-4 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-[0.16em] text-gold",
					children: "Back from checkout"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl",
					children: found?.charge.status === "paid" ? "Order noted" : "Still waiting on payment"
				}),
				found ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid gap-3 rounded-2xl border border-line bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: found.charge.description
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: found.charge.status })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-4xl tabular-nums",
							children: formatPeso(found.charge.amountCentavos)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: ["Reference ", formatRef(found.charge.reference)]
						}),
						found.charge.status !== "paid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/pay/$chargeId",
							params: { chargeId: found.charge.id },
							className: "inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-4 text-sm font-semibold text-paper",
							children: "Finish payment"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-ink",
							children: "Harbor kept the reference. This demo does not ship the coffee."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "No payment was attached to this return. Start from the shop."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "text-sm font-semibold text-gold",
					children: "Back to the shop"
				})
			]
		})]
	});
}
//#endregion
export { Thanks as component };
