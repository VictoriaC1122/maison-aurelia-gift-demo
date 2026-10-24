"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { QuantityStepper } from "@/components/quantity-stepper";
import { getProducts, productName } from "@/lib/content";
import { useCart } from "@/lib/cart";
import { displaySpecification, formatTWD, type CartSummary } from "@/lib/pricing";
import { useModalBehavior, usePresence } from "@/lib/use-presence";
import { formatCurrency, withBasePath } from "@/lib/utils";

export function CartTotals({ summary, compact = false }: { summary: CartSummary; compact?: boolean }) {
  const { t } = useLocale();
  const quoted = summary.subtotal === null;

  return (
    <div className="space-y-3 text-sm">
      {!quoted && summary.freeShippingRemaining !== null ? (
        <div className="rounded-2xl border border-champagne/15 bg-white/60 px-4 py-3">
          <p className="flex items-center gap-2 text-ink/70">
            <Truck aria-hidden="true" className="h-4 w-4 text-gold" />
            {summary.freeShippingRemaining > 0
              ? <>{t.cart.freeLeftBefore}<strong className="text-ink">{formatTWD(summary.freeShippingRemaining)}</strong>{t.cart.freeLeftAfter}</>
              : t.cart.freeReached}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-champagne/15">
            <div
              className="h-full rounded-full bg-champagne transition-all"
              style={{
                width: `${Math.min(100, ((summary.subtotal ?? 0) / summary.freeShippingThreshold) * 100)}%`
              }}
            />
          </div>
        </div>
      ) : null}
      <dl className="space-y-2">
        <div className="flex items-center justify-between">
          <dt className="text-ink/60">{t.cart.subtotal}</dt>
          <dd className="text-ink">{quoted ? t.common.priceOnRequest : formatTWD(summary.subtotal ?? 0)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-ink/60">{t.cart.shipping}</dt>
          <dd className="text-ink">
            {quoted ? t.cart.shippingTbd : summary.shippingFee === 0 ? t.cart.freeShipping : formatTWD(summary.shippingFee ?? 0)}
          </dd>
        </div>
        <div className="flex items-end justify-between border-t border-champagne/15 pt-3">
          <dt className="text-ink">{t.cart.total}</dt>
          <dd className="font-display text-xl text-ink">{quoted ? t.common.priceOnRequest : formatTWD(summary.total ?? 0)}</dd>
        </div>
      </dl>
      {quoted && !compact ? (
        <p className="text-xs leading-6 text-ink/60">{t.cart.quotedNote}</p>
      ) : null}
    </div>
  );
}

export function CartDrawer() {
  const { isOpen, close, summary, setQuantity, remove, add } = useCart();
  const { locale, t, href } = useLocale();
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawer = usePresence(isOpen, 300);

  useModalBehavior(isOpen, close);
  useEffect(() => {
    if (drawer.visible) closeRef.current?.focus({ preventScroll: true });
  }, [drawer.visible]);

  if (!drawer.mounted) return null;

  const inCart = new Set(summary.lines.map((line) => line.product.slug));
  const suggestions = getProducts().filter((product) => !inCart.has(product.slug)).slice(0, 2);

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label={t.cart.dialog} data-state={drawer.visible ? "open" : "closed"}>
      <button
        type="button"
        tabIndex={-1}
        aria-label={t.cart.close}
        className="overlay-fade absolute inset-0 bg-[rgba(21,18,15,0.38)] backdrop-blur-[2px]"
        onClick={close}
      />
      <aside className="sheet-right absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-pearl shadow-[0_0_60px_rgba(21,18,15,0.18)]">
        <header className="flex items-center justify-between border-b border-champagne/15 px-5 py-4">
          <div>
            <p className="eyebrow">{t.cart.eyebrow}</p>
            <h2 className="font-display text-xl text-ink">{t.cart.title(summary.itemCount)}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={t.cart.close}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-champagne/20 text-ink/70 transition hover:bg-white"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </header>

        {summary.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-champagne/12 text-gold">
              <ShoppingBag aria-hidden="true" className="h-6 w-6" />
            </span>
            <p className="text-ink/60">{t.cart.empty}</p>
            <Link href={href("/products")} onClick={close} className="hero-button-dark min-h-[48px] justify-center px-7">
              {t.common.shopNow}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-champagne/12 px-5">
                {summary.lines.map((line) => (
                  <li key={line.product.slug} className="grid grid-cols-[76px_minmax(0,1fr)] gap-4 py-4">
                    <Link
                      href={href(`/products/${line.product.slug}`)}
                      onClick={close}
                      className="relative h-[76px] w-[76px] overflow-hidden rounded-xl border border-champagne/12"
                    >
                      <Image
                        src={withBasePath(line.product.images[0])}
                        alt={productName(line.product, locale)}
                        fill
                        sizes="76px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            href={href(`/products/${line.product.slug}`)}
                            onClick={close}
                            className="block truncate text-[0.95rem] text-ink hover:underline"
                          >
                            {productName(line.product, locale)}
                          </Link>
                          <p className="text-xs text-ink/60">{displaySpecification(line.product.specification, locale)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(line.product.slug)}
                          aria-label={t.cart.remove(productName(line.product, locale))}
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/40 transition hover:bg-rosegold/10 hover:text-ink"
                        >
                          <Trash2 aria-hidden="true" className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <QuantityStepper
                          size="sm"
                          value={line.quantity}
                          onChange={(value) => setQuantity(line.product.slug, value)}
                          label={t.cart.quantityOf(productName(line.product, locale))}
                        />
                        <span className="text-sm text-ink">
                          {line.lineTotal === null ? t.common.priceOnRequest : formatTWD(line.lineTotal)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {suggestions.length > 0 ? (
                <section className="mx-5 mb-5 mt-2 rounded-2xl border border-champagne/14 bg-white/50 p-4">
                  <h3 className="eyebrow">{t.product.related}</h3>
                  <ul className="mt-3 space-y-3">
                    {suggestions.map((product) => (
                      <li key={product.slug} className="flex items-center gap-3">
                        <Link
                          href={href(`/products/${product.slug}`)}
                          onClick={close}
                          className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-champagne/12"
                        >
                          <Image src={withBasePath(product.images[0])} alt="" fill sizes="56px" className="object-cover" />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={href(`/products/${product.slug}`)}
                            onClick={close}
                            className="block truncate text-sm text-ink hover:underline"
                          >
                            {productName(product, locale)}
                          </Link>
                          <p className="text-xs text-ink/60">{formatCurrency(product.price, product.priceFrom, locale)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => add(product.slug, 1, { open: true })}
                          aria-label={`${t.common.addToCart}${locale === "en" ? ": " : "："}${productName(product, locale)}`}
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:bg-ink hover:text-pearl"
                        >
                          <Plus aria-hidden="true" className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
            <footer className="space-y-4 border-t border-champagne/15 bg-cream/40 px-5 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
              <CartTotals summary={summary} compact />
              <Link href={href("/checkout")} onClick={close} className="hero-button-dark min-h-[52px] w-full justify-center">
                {t.cart.checkout}
              </Link>
              <button
                type="button"
                onClick={close}
                className="w-full text-center text-sm text-ink/60 underline-offset-4 hover:underline"
              >
                {t.cart.continueShopping}
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
