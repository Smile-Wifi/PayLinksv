import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-CyE1K9AO.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var tones = {
	ink: "bg-ink text-paper hover:bg-ink-soft",
	gold: "bg-gold-2 text-ink hover:bg-gold hover:text-paper",
	quiet: "border border-line bg-surface text-ink hover:bg-paper-2",
	mint: "bg-mint text-paper hover:bg-ink",
	coral: "bg-surface text-coral border border-coral/40 hover:bg-paper-2"
};
function Button({ tone = "ink", className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50", tones[tone], className),
		...props
	});
}
function TextField({ label, hint, className, ...props }) {
	const id = props.id ?? props.name;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "grid gap-1.5 text-sm",
		htmlFor: id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium text-ink",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id,
				className: cn("h-12 w-full rounded-xl border border-line bg-surface px-3 text-base text-ink outline-none placeholder:text-muted focus-visible:border-gold", className),
				...props
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted",
				children: hint
			}) : null
		]
	});
}
function Panel({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cn("rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-5", className),
		children
	});
}
function StatusPill({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide", status === "paid" ? "bg-mint text-paper" : status === "claimed" ? "bg-ink text-paper" : status === "expired" || status === "cancelled" ? "bg-paper-2 text-coral" : "bg-gold-2 text-ink"),
		children: status
	});
}
//#endregion
export { TextField as i, Panel as n, StatusPill as r, Button as t };
