import Link from "next/link";
import { ArrowDown, CreditCard, PackageSearch, ShoppingBag, Truck, UserCheck } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { enabledDeliveryOptions, enabledPaymentOptions } from "@/lib/commerce";
import { site } from "@/lib/content";
import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { formatTWD } from "@/lib/pricing";
import { buildMetadata } from "@/lib/seo";

const STEP_ICONS = [ShoppingBag, Truck, UserCheck, CreditCard, PackageSearch];

export function orderingMetadata(locale: Locale) {
  const t = getMessages(locale).ordering;
  return buildMetadata({ title: t.metaTitle, description: t.metaDescription, path: "/ordering", locale });
}

export function OrderingView({ locale }: { locale: Locale }) {
  const t = getMessages(locale).ordering;
  const href = (path: string) => localePath(locale, path);
  const cvsFee = site.shippingPolicy.cvsShippingFee;
  const steps = t.steps.map((step, index) => ({ ...step, icon: STEP_ICONS[index] }));

  return (
    <main id="main-content" className="shell space-y-12 py-10 md:py-16">
      <SectionHeading as="h1" eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <ol aria-label={t.flowLabel} className="order-flow">
        {steps.map(({ icon: Icon, title, text }, index) => (
          <li key={title} className="order-flow__item">
            <div className="order-flow__card">
              <span className="block text-[11px] tracking-[0.24em] text-gold">{t.stepLabel(index + 1)}</span>
              <span className="mt-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-[0_6px_16px_rgba(21,18,15,0.06)]">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="mt-3 block font-display text-lg text-ink">{title}</span>
              <span className="mt-1 block text-sm leading-6 text-ink/60">{text}</span>
            </div>
            {index < steps.length - 1 ? (
              <ArrowDown aria-hidden="true" className="order-flow__arrow-down h-5 w-5 text-gold" />
            ) : null}
          </li>
        ))}
      </ol>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="paper-panel p-6 md:p-8">
          <h2 className="font-display text-2xl text-ink">{t.deliveryTitle}</h2>
          <ul className="mt-4 divide-y divide-champagne/12">
            {enabledDeliveryOptions(locale).map((option) => (
              <li key={option.id} className="flex items-start justify-between gap-4 py-3">
                <span>
                  <span className="block text-ink">{option.label}</span>
                  <span className="text-sm leading-6 text-ink/60">{option.description}</span>
                </span>
                <span className="shrink-0 text-sm text-ink/70">
                  {option.id === "home" ? formatTWD(site.shippingPolicy.standardShippingFee) : cvsFee ? formatTWD(cvsFee) : t.byStore}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-ink/60">
            {t.freeNote(formatTWD(site.shippingPolicy.freeShippingThreshold))}
            {locale === "zh" ? site.shippingPolicy.customNotes : ""}
          </p>
        </div>
        <div className="paper-panel p-6 md:p-8">
          <h2 className="font-display text-2xl text-ink">{t.paymentTitle}</h2>
          <ul className="mt-4 divide-y divide-champagne/12">
            {enabledPaymentOptions(locale).map((option) => (
              <li key={option.id} className="py-3">
                <span className="block text-ink">{option.label}</span>
                <span className="text-sm leading-6 text-ink/60">{option.description}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-ink/60">{t.confirmNote}</p>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href={href("/products")} className="hero-button-dark min-h-[52px] justify-center px-8">{t.start}</Link>
        <Link href={href("/track")} className="hero-button-light min-h-[52px] justify-center px-8">{t.track}</Link>
        <Link href={href("/returns")} className="hero-button-light min-h-[52px] justify-center px-8">{t.returns}</Link>
      </div>
    </main>
  );
}
