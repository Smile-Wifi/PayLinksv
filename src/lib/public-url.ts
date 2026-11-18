import { previewPathPrefix } from "@/lib/preview-path-prefix";

export function appBaseUrl(): string {
  if (typeof window === "undefined") return "";
  const prefix = previewPathPrefix(window.location.hostname, window.location.pathname) ?? "";
  return `${window.location.origin}${prefix}`;
}

export function absoluteAppUrl(path: string): string {
  const base = appBaseUrl();
  if (!base) return path;
  return `${base}${path}`;
}
