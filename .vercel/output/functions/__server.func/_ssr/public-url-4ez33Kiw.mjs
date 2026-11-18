import { o as previewPathPrefix } from "./router-CfMzJ1-m.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/public-url-4ez33Kiw.js
function appBaseUrl() {
	if (typeof window === "undefined") return "";
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname) ?? "";
	return `${window.location.origin}${prefix}`;
}
function absoluteAppUrl(path) {
	const base = appBaseUrl();
	if (!base) return path;
	return `${base}${path}`;
}
//#endregion
export { appBaseUrl as n, absoluteAppUrl as t };
