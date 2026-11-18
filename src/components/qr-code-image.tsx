import { useEffect, useState } from "react";

export function QrCodeImage({ value, label }: { value: string; label: string }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let live = true;
    void import("qrcode")
      .then((mod) =>
        mod.toDataURL(value, {
          margin: 1,
          width: 360,
          errorCorrectionLevel: "M",
          color: { dark: "#102033", light: "#fffdf8" },
        }),
      )
      .then((url) => {
        if (live) setSrc(url);
      })
      .catch(() => {
        if (live) setSrc("");
      });
    return () => {
      live = false;
    };
  }, [value]);

  if (!src) {
    return (
      <div className="grid size-56 place-items-center rounded-2xl bg-paper-2 text-sm text-muted">Preparing QR…</div>
    );
  }

  return <img src={src} alt={label} className="size-56 rounded-2xl bg-surface" />;
}
