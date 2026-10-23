"use client";

import { Minus, Plus } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  label
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
}) {
  const { t } = useLocale();
  const small = size === "sm";
  const groupLabel = label ?? t.common.quantity;

  return (
    <div
      role="group"
      aria-label={groupLabel}
      className={cn(
        "inline-grid shrink-0 items-center overflow-hidden rounded-full border border-champagne/25 bg-pearl/90",
        small ? "h-9 grid-cols-[36px_40px_36px]" : "h-12 grid-cols-[46px_52px_46px]"
      )}
    >
      <button
        type="button"
        aria-label={t.common.decrease}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="inline-flex h-full items-center justify-center text-ink/70 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Minus aria-hidden="true" className={small ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>
      <input
        aria-label={groupLabel}
        inputMode="numeric"
        className={cn("h-full w-full bg-transparent text-center text-ink outline-none", small ? "text-sm" : "text-base")}
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value.replace(/\D/g, ""));
          if (Number.isFinite(next) && next >= min) onChange(Math.min(max, next));
        }}
      />
      <button
        type="button"
        aria-label={t.common.increase}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="inline-flex h-full items-center justify-center text-ink/70 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Plus aria-hidden="true" className={small ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>
    </div>
  );
}
