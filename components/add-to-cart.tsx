"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { QuantityStepper } from "@/components/quantity-stepper";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  slug,
  className,
  label
}: {
  slug: string;
  className?: string;
  label?: string;
}) {
  const { add } = useCart();
  const { t } = useLocale();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        add(slug, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
      className={cn(
        "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm text-pearl transition hover:-translate-y-0.5 active:scale-[0.99]",
        className
      )}
    >
      {added ? <Check aria-hidden="true" className="h-4 w-4" /> : <ShoppingBag aria-hidden="true" className="h-4 w-4" />}
      {added ? t.common.added : label ?? t.common.addToCart}
    </button>
  );
}

export function ProductPurchase({ slug }: { slug: string }) {
  const { add } = useCart();
  const router = useRouter();
  const { t, href } = useLocale();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-ink/60">{t.common.quantity}</span>
        <QuantityStepper value={quantity} onChange={setQuantity} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => add(slug, quantity)}
          className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full border border-ink bg-white/70 px-6 text-[0.95rem] text-ink transition hover:bg-white active:scale-[0.99]"
        >
          <ShoppingBag aria-hidden="true" className="h-4 w-4" />
          {t.common.addToCart}
        </button>
        <button
          type="button"
          onClick={() => {
            add(slug, quantity, { open: false });
            router.push(href("/checkout"));
          }}
          className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-ink px-6 text-[0.95rem] text-pearl transition hover:-translate-y-0.5 active:scale-[0.99]"
        >
          {t.common.buyNow}
        </button>
      </div>
    </div>
  );
}

export function MobileBuyBar({ slug, priceLabel, specLabel }: { slug: string; priceLabel: string; specLabel: string }) {
  const { add } = useCart();
  const router = useRouter();
  const { t, href } = useLocale();

  return (
    <div className="product-mobile-dock md:hidden">
      <div className="min-w-0">
        <span className="block truncate text-[11px] text-ink/60">{specLabel}</span>
        <strong className="mt-0.5 block truncate font-display text-base font-medium leading-tight text-ink">{priceLabel}</strong>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => add(slug, 1)}
          aria-label={t.common.addToCart}
          className="inline-flex h-[50px] w-[50px] items-center justify-center rounded-full border border-ink text-ink active:scale-[0.98]"
        >
          <ShoppingBag aria-hidden="true" className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => {
            add(slug, 1, { open: false });
            router.push(href("/checkout"));
          }}
          className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-ink px-6 text-sm text-pearl active:scale-[0.98]"
        >
          {t.common.buyNow}
        </button>
      </div>
    </div>
  );
}
