import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "ink" | "gold" | "quiet" | "mint" | "coral";
};

const tones: Record<NonNullable<ButtonProps["tone"]>, string> = {
  ink: "bg-ink text-paper hover:bg-ink-soft",
  gold: "bg-gold-2 text-ink hover:bg-gold hover:text-paper",
  quiet: "border border-line bg-surface text-ink hover:bg-paper-2",
  mint: "bg-mint text-paper hover:bg-ink",
  coral: "bg-surface text-coral border border-coral/40 hover:bg-paper-2",
};

export function Button({ tone = "ink", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

export function TextField({
  label,
  hint,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  const id = props.id ?? props.name;
  return (
    <label className="grid gap-1.5 text-sm" htmlFor={id}>
      <span className="font-medium text-ink">{label}</span>
      <input
        id={id}
        className={cn(
          "h-12 w-full rounded-xl border border-line bg-surface px-3 text-base text-ink outline-none placeholder:text-muted focus-visible:border-gold",
          className,
        )}
        {...props}
      />
      {hint ? <span className="text-muted">{hint}</span> : null}
    </label>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-5", className)}>
      {children}
    </section>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "paid"
      ? "bg-mint text-paper"
      : status === "claimed"
        ? "bg-ink text-paper"
        : status === "expired" || status === "cancelled"
          ? "bg-paper-2 text-coral"
          : "bg-gold-2 text-ink";
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide", tone)}>
      {status}
    </span>
  );
}
