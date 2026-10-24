import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, ChevronDown, ChevronRight, MessageCircleMore, ShieldCheck, Store, Truck } from "lucide-react";
import { MobileBuyBar, ProductPurchase } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { StructuredData } from "@/components/structured-data";
import { enabledDeliveryOptions, enabledPaymentOptions } from "@/lib/commerce";
import {
  categoryName,
  contact,
  getCategory,
  getProduct,
  getProducts,
  productAltName,
  productDetails,
  productFeatures,
  productName,
  productSummary,
  site
} from "@/lib/content";
import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { displaySpecification, formatTWD } from "@/lib/pricing";
import { buildMetadata, buildProductSchema } from "@/lib/seo";
import type { ProductDetails } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

const DETAIL_KEYS: Array<keyof ProductDetails> = [
  "netContent",
  "nestContent",
  "ingredients",
  "sweetness",
  "howToEnjoy",
  "storage",
  "shelfLife",
  "origin",
  "manufacturer",
  "allergens",
  "nutrition"
];

export function productStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}

export function productMetadata(slug: string, locale: Locale): Metadata {
  const product = getProduct(slug);
  const t = getMessages(locale).product;
  if (!product) {
    return buildMetadata({ title: t.fallbackTitle, description: t.fallbackDescription, path: "/products", locale });
  }
  return buildMetadata({
    title: productName(product, locale),
    description: productSummary(product, locale),
    path: `/products/${slug}`,
    image: product.images[0],
    locale
  });
}

function InfoSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group border-b border-champagne/15">
      <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-4 text-base text-ink">
        {title}
        <ChevronDown aria-hidden="true" className="h-4 w-4 text-ink/60 transition group-open:rotate-180" />
      </summary>
      <div className="pb-6 text-sm leading-7 text-ink/68">{children}</div>
    </details>
  );
}

export function ProductDetailView({ slug, locale }: { slug: string; locale: Locale }) {
  const product = getProduct(slug);
  if (!product) notFound();
  const messages = getMessages(locale);
  const t = messages.product;
  const href = (path: string) => localePath(locale, path);
  const name = productName(product, locale);
  const summary = productSummary(product, locale);
  const features = productFeatures(product, locale);
  const category = getCategory(product.category);
  const specification = displaySpecification(product.specification, locale);
  const priceLabel = formatCurrency(product.price, product.priceFrom, locale);
  const productDetailValues = productDetails(product, locale);
  const details = DETAIL_KEYS.map((key) => [t.detailLabels[key], productDetailValues[key]?.trim() ?? ""] as const).filter(
    ([, value]) => value
  );
  const colon = locale === "en" ? ": " : "：";
  const related = getProducts().filter((item) => item.slug !== product.slug).slice(0, 3);
  const cvsFee = site.shippingPolicy.cvsShippingFee;

  return (
    <>
      <main id="main-content" className="shell space-y-8 pb-32 pt-5 md:space-y-14 md:pb-16 md:pt-8">
        <StructuredData data={buildProductSchema(product, locale)} />
        <nav aria-label={messages.common.breadcrumb} className="flex min-w-0 items-center gap-2 overflow-hidden text-xs text-ink/60 md:text-sm">
          <Link href={href("/")} className="shrink-0 transition hover:text-ink">{messages.common.home}</Link>
          <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-gold" />
          <Link href={href("/products")} className="shrink-0 transition hover:text-ink">{messages.nav.products}</Link>
          {category ? (
            <>
              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-gold" />
              <Link href={href(`/products?category=${category.slug}`)} className="shrink-0 transition hover:text-ink">{categoryName(category, locale)}</Link>
            </>
          ) : null}
          <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-gold" />
          <span aria-current="page" className="truncate text-ink/72">{name}</span>
        </nav>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          <ProductGallery images={product.images} alt={name} priority />

          <div className="min-w-0 space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="space-y-3">
              {category ? (
                <Link href={href(`/products?category=${category.slug}`)} className="inline-flex rounded-full border border-champagne/25 px-3 py-1 text-xs tracking-[0.08em] text-ink/65 hover:bg-white">
                  {categoryName(category, locale)}
                </Link>
              ) : null}
              <h1 className="product-detail-title font-display text-[2.2rem] leading-[1.12] text-ink md:text-[2.9rem]">{name}</h1>
              <p className={cn("text-xs text-gold", locale === "en" ? "tracking-[0.2em]" : "uppercase tracking-[0.28em]")}>{productAltName(product, locale)}</p>
            </div>

            <div className="flex flex-wrap items-end gap-x-4 gap-y-1 border-y border-champagne/15 py-4">
              <strong className="font-display text-[2rem] font-medium leading-none text-ink">{priceLabel}</strong>
              <span className="pb-1 text-sm text-ink/60">{specification}</span>
              {!product.price ? (
                <span className="w-full pt-1 text-xs leading-5 text-ink/60">{t.priceNote}</span>
              ) : null}
            </div>

            <p className="text-base leading-8 text-ink/70">{summary}</p>

            <ul className="space-y-2 text-sm text-ink/70">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-gold" />
                  {feature}
                </li>
              ))}
            </ul>

            <ProductPurchase slug={product.slug} />

            <ul className="grid gap-2 rounded-2xl border border-champagne/14 bg-white/50 p-4 text-sm text-ink/68">
              <li className="flex items-center gap-2.5">
                <Truck aria-hidden="true" className="h-4 w-4 text-gold" />
                {t.homeDelivery(formatTWD(site.shippingPolicy.standardShippingFee), formatTWD(site.shippingPolicy.freeShippingThreshold))}
              </li>
              <li className="flex items-center gap-2.5">
                <Store aria-hidden="true" className="h-4 w-4 text-gold" />
                {t.pickup(cvsFee ? formatTWD(cvsFee) : "")}
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck aria-hidden="true" className="h-4 w-4 text-gold" />
                {t.confirmFirst}
              </li>
            </ul>

            <a
              href={`https://line.me/R/ti/p/~${contact.line}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-ink/65 underline decoration-champagne/50 underline-offset-4 hover:text-ink"
            >
              <MessageCircleMore aria-hidden="true" className="h-4 w-4" />
              {t.askLine}
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-3xl border-t border-champagne/15">
          <InfoSection title={t.intro} defaultOpen>
            <p>{summary}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
          </InfoSection>
          <InfoSection title={t.specs}>
            {details.length > 0 ? (
              <dl className="divide-y divide-champagne/12">
                {details.map(([label, value]) => (
                  <div key={label} className={cn("grid gap-3 py-2.5", locale === "en" ? "grid-cols-[9.5rem_minmax(0,1fr)]" : "grid-cols-[7rem_minmax(0,1fr)]")}>
                    <dt className="text-ink/60">{label}</dt>
                    <dd className="whitespace-pre-line break-words text-ink/78">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p>{t.specsFallback(specification)}</p>
            )}
          </InfoSection>
          <InfoSection title={t.deliveryAndPayment}>
            <p className="text-ink">{t.deliveryMethods}</p>
            <ul className="mb-4 mt-1 list-disc pl-5">
              {enabledDeliveryOptions(locale).map((option) => <li key={option.id}>{option.label}{colon}{option.description}</li>)}
            </ul>
            <p className="text-ink">{t.paymentMethods}</p>
            <ul className="mt-1 list-disc pl-5">
              {enabledPaymentOptions(locale).map((option) => <li key={option.id}>{option.label}{colon}{option.description}</li>)}
            </ul>
            <p className="mt-4">
              {t.seeShipping[0]}<Link href={href("/shipping")} className="underline underline-offset-4">{t.seeShipping[1]}</Link>{t.seeShipping[2]}
            </p>
          </InfoSection>
          <InfoSection title={t.returnsTitle}>
            <p>
              {t.returnsText[0]}
              <Link href={href("/returns")} className="ml-1 underline underline-offset-4">{t.returnsText[1]}</Link>
              {t.returnsText[2]}
            </p>
          </InfoSection>
        </section>

        {related.length > 0 ? (
          <section className="space-y-6">
            <h2 className="font-display text-2xl text-ink md:text-3xl">{t.related}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => <ProductCard key={item.slug} product={item} locale={locale} />)}
              {related.length < 3 ? (
                <Link
                  href={href("/products")}
                  className="group hidden min-h-[240px] flex-col items-center justify-center gap-4 rounded-[1.4rem] border border-dashed border-champagne/40 bg-white/35 p-6 text-center transition hover:bg-white/70 lg:flex"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-champagne/40 text-gold transition group-hover:bg-ink group-hover:text-pearl">
                    <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="font-display text-xl text-ink">{messages.common.viewAllProducts}</span>
                </Link>
              ) : null}
            </div>
          </section>
        ) : null}
      </main>

      <MobileBuyBar slug={product.slug} priceLabel={priceLabel} specLabel={specification} />
    </>
  );
}
