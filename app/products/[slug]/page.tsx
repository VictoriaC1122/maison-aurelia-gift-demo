import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, ChevronDown, ChevronRight, MessageCircleMore, ShieldCheck, Store, Truck } from "lucide-react";
import { MobileBuyBar, ProductPurchase } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { StructuredData } from "@/components/structured-data";
import { enabledDeliveryOptions, enabledPaymentOptions } from "@/lib/commerce";
import { contact, getCategory, getProduct, getProducts, site } from "@/lib/content";
import { displaySpecification, formatTWD } from "@/lib/pricing";
import { buildMetadata, buildProductSchema } from "@/lib/seo";
import type { ProductDetails } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const DETAIL_LABELS: Array<[keyof ProductDetails, string]> = [
  ["netContent", "容量／入數"],
  ["nestContent", "每瓶燕窩含量"],
  ["ingredients", "成分"],
  ["sweetness", "甜度"],
  ["howToEnjoy", "食用方式"],
  ["storage", "保存方式"],
  ["shelfLife", "保存期限"],
  ["origin", "原產地"],
  ["manufacturer", "製造廠商"],
  ["allergens", "過敏原資訊"],
  ["nutrition", "營養標示"]
];

export function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) {
    return buildMetadata({ title: "商品詳情", description: "查看越金燕的商品內容。", path: "/products" });
  }
  return buildMetadata({
    title: product.nameZh,
    description: product.summary,
    path: `/products/${slug}`,
    image: product.images[0]
  });
}

function InfoSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group border-b border-champagne/15">
      <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-4 text-base text-ink">
        {title}
        <ChevronDown aria-hidden="true" className="h-4 w-4 text-ink/45 transition group-open:rotate-180" />
      </summary>
      <div className="pb-6 text-sm leading-7 text-ink/68">{children}</div>
    </details>
  );
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.category);
  const specification = displaySpecification(product.specification);
  const priceLabel = formatCurrency(product.price, product.priceFrom);
  const details = DETAIL_LABELS.map(([key, label]) => [label, product.details?.[key]?.trim() ?? ""] as const).filter(
    ([, value]) => value
  );
  const related = getProducts().filter((item) => item.slug !== product.slug).slice(0, 3);
  const cvsFee = site.shippingPolicy.cvsShippingFee;

  return (
    <>
      <main id="main-content" className="shell space-y-10 pb-32 pt-6 md:space-y-14 md:pb-16 md:pt-10">
        <StructuredData data={buildProductSchema(product)} />
        <nav aria-label="麵包屑" className="flex min-w-0 items-center gap-2 overflow-hidden text-sm text-ink/48">
          <Link href="/" className="shrink-0 transition hover:text-ink">首頁</Link>
          <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-champagne" />
          <Link href="/products" className="shrink-0 transition hover:text-ink">全部商品</Link>
          {category ? (
            <>
              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-champagne" />
              <Link href={`/products?category=${category.slug}`} className="shrink-0 transition hover:text-ink">{category.name}</Link>
            </>
          ) : null}
          <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-champagne" />
          <span aria-current="page" className="truncate text-ink/72">{product.nameZh}</span>
        </nav>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          <ProductGallery images={product.images} alt={product.nameZh} priority />

          <div className="min-w-0 space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="space-y-3">
              {category ? (
                <Link href={`/products?category=${category.slug}`} className="inline-flex rounded-full border border-champagne/25 px-3 py-1 text-xs tracking-[0.08em] text-ink/65 hover:bg-white">
                  {category.name}
                </Link>
              ) : null}
              <h1 className="product-detail-title font-display text-[2.2rem] leading-[1.12] text-ink md:text-[2.9rem]">{product.nameZh}</h1>
              <p className="text-xs uppercase tracking-[0.28em] text-rosegold">{product.name}</p>
            </div>

            <div className="flex flex-wrap items-end gap-x-4 gap-y-1 border-y border-champagne/15 py-4">
              <strong className="font-display text-[2rem] font-medium leading-none text-ink">{priceLabel}</strong>
              <span className="pb-1 text-sm text-ink/55">{specification}</span>
              {!product.price ? (
                <span className="w-full pt-1 text-xs leading-5 text-ink/50">售價由顧問確認，可先加入購物車送出訂單，確認前不會扣款。</span>
              ) : null}
            </div>

            <p className="text-base leading-8 text-ink/70">{product.summary}</p>

            <ul className="space-y-2 text-sm text-ink/70">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-champagne" />
                  {feature}
                </li>
              ))}
            </ul>

            <ProductPurchase slug={product.slug} />

            <ul className="grid gap-2 rounded-2xl border border-champagne/14 bg-white/50 p-4 text-sm text-ink/68">
              <li className="flex items-center gap-2.5">
                <Truck aria-hidden="true" className="h-4 w-4 text-champagne" />
                宅配到府 {formatTWD(site.shippingPolicy.standardShippingFee)}，滿 {formatTWD(site.shippingPolicy.freeShippingThreshold)} 免運
              </li>
              <li className="flex items-center gap-2.5">
                <Store aria-hidden="true" className="h-4 w-4 text-champagne" />
                7-11／全家超商取貨{cvsFee ? ` ${formatTWD(cvsFee)}` : ""}
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck aria-hidden="true" className="h-4 w-4 text-champagne" />
                顧問確認品項與金額後才付款
              </li>
            </ul>

            <a
              href={`https://line.me/R/ti/p/~${contact.line}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-ink/65 underline decoration-champagne/50 underline-offset-4 hover:text-ink"
            >
              <MessageCircleMore aria-hidden="true" className="h-4 w-4" />
              想先問問看？LINE 諮詢顧問
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-3xl border-t border-champagne/15">
          <InfoSection title="商品介紹" defaultOpen>
            <p>{product.summary}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {product.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
          </InfoSection>
          <InfoSection title="商品規格與標示">
            {details.length > 0 ? (
              <dl className="divide-y divide-champagne/12">
                {details.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 py-2.5">
                    <dt className="text-ink/48">{label}</dt>
                    <dd className="whitespace-pre-line break-words text-ink/78">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p>規格：{specification}。完整成分、保存期限與營養標示，歡迎向顧問索取。</p>
            )}
          </InfoSection>
          <InfoSection title="配送與付款">
            <p className="text-ink">配送方式</p>
            <ul className="mb-4 mt-1 list-disc pl-5">
              {enabledDeliveryOptions().map((option) => <li key={option.id}>{option.label}：{option.description}</li>)}
            </ul>
            <p className="text-ink">付款方式</p>
            <ul className="mt-1 list-disc pl-5">
              {enabledPaymentOptions().map((option) => <li key={option.id}>{option.label}：{option.description}</li>)}
            </ul>
            <p className="mt-4">
              詳見 <Link href="/shipping" className="underline underline-offset-4">配送與運費</Link>。
            </p>
          </InfoSection>
          <InfoSection title="退換貨說明">
            <p>
              未拆封商品收到後 7 日內可申請退貨；食品與客製商品依法可能不適用，詳見
              <Link href="/returns" className="mx-1 underline underline-offset-4">退換貨說明</Link>。
            </p>
          </InfoSection>
        </section>

        {related.length > 0 ? (
          <section className="space-y-6">
            <h2 className="font-display text-2xl text-ink md:text-3xl">你可能也喜歡</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => <ProductCard key={item.slug} product={item} />)}
            </div>
          </section>
        ) : null}
      </main>

      <MobileBuyBar slug={product.slug} priceLabel={priceLabel} specLabel={specification} />
    </>
  );
}
