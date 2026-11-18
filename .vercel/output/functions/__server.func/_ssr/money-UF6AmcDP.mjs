import { C as require_jsx_runtime, b as Link, p as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/money-UF6AmcDP.js
var import_jsx_runtime = require_jsx_runtime();
var LINKS = [
	{
		to: "/",
		label: "Home"
	},
	{
		to: "/shop",
		label: "Shop"
	},
	{
		to: "/embed-demo",
		label: "Embed"
	},
	{
		to: "/console",
		label: "Console"
	}
];
function SiteHeader() {
	const path = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-5xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "font-display text-xl leading-none tracking-tight text-ink",
				children: ["PayLink ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-gold",
					children: "PH"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex items-center gap-1 overflow-x-auto text-sm",
				children: LINKS.map((item) => {
					const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						className: active ? "shrink-0 rounded-full bg-ink px-3 py-2 text-paper" : "shrink-0 rounded-full px-3 py-2 text-muted",
						children: item.label
					}, item.to);
				})
			})]
		})
	});
}
function formatPeso(centavos) {
	return new Intl.NumberFormat("en-PH", {
		style: "currency",
		currency: "PHP",
		minimumFractionDigits: 2
	}).format(centavos / 100);
}
function formatWhen(iso) {
	if (!iso) return "";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return new Intl.DateTimeFormat("en-PH", {
		timeZone: "Asia/Manila",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	}).format(d);
}
function formatRef(ref) {
	if (ref.length !== 8) return ref;
	return `${ref.slice(0, 4)} ${ref.slice(4)}`;
}
//#endregion
export { formatWhen as i, formatPeso as n, formatRef as r, SiteHeader as t };
