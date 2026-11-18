import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as formatPeso, t as SiteHeader } from "./money-UF6AmcDP.mjs";
import { a as Route$5 } from "./router-CfMzJ1-m.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/embed-demo-C_KkPkAX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EmbedDemo() {
	const merchant = Route$5.useLoaderData();
	(0, import_react.useEffect)(() => {
		if (document.querySelector("script[data-paylink-widget]")) return;
		const script = document.createElement("script");
		script.src = `${window.location.pathname.replace(/\/embed-demo\/?$/, "")}/paylink.js`;
		script.dataset.paylinkKey = merchant.publishableKey;
		script.dataset.paylinkWidget = "1";
		document.body.appendChild(script);
	}, [merchant.publishableKey]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid max-w-lg gap-5 px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-[0.16em] text-gold",
					children: "Another website"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl",
					children: "North Line Goods"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted",
					children: [
						"This page is not the shop. It is a mock storefront using the PayLink button and your publishable key. Checkout still shows ",
						merchant.businessName,
						"'s QR."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "grid gap-4 rounded-3xl border border-line bg-ink p-5 text-paper",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.16em] text-gold-2",
							children: "Ready to ship"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl text-paper",
							children: "Linen camp shirt"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-paper/80",
							children: "Undyed, mother-of-pearl buttons, cut in a small run."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-4xl tabular-nums",
							children: formatPeso(89e3)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-paylink": "",
							"data-amount": "890",
							"data-description": "Linen camp shirt",
							"data-return": "/shop/thanks",
							className: "inline-flex min-h-12 items-center justify-center rounded-full bg-gold-2 px-4 text-sm font-semibold text-ink",
							children: "Pay with PayLink PH"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-paper/70",
							children: "The button calls /api/v1/charges, then opens the hosted pay link. Same snippet works on any site that can load the script."
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { EmbedDemo as component };
