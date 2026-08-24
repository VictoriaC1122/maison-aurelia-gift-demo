import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, ChevronRight, Headphones, PackageCheck, Truck } from "lucide-react";
import { AutoImageRotator } from "@/components/auto-image-rotator";
import { StructuredData } from "@/components/structured-data";
import { contact, getCategory, getProduct, getProducts } from "@/lib/content";
import { buildMetadata, buildProductSchema } from "@/lib/seo";
import { formatCurrency, withBasePath } from "@/lib/utils";
import Image from "next/image";

export function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return buildMetadata({
      title: "商品詳情",
      description: "查看 Maison Aurelia 的商品內容。",
      path: "/collections"
    });
  }

  return buildMetadata({
    title: product.nameZh,
    description: product.summary,
    path: `/products/${slug}`,
    image: product.images[0]
  });
}

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.category);
  const specification = product.specification === "待補" ? "顧問確認" : product.specification;

  return (
    <main id="main-content" className="shell space-y-8 py-10 md:space-y-10 md:py-16">
      <StructuredData data={buildProductSchema(product)} />
      <nav aria-label="麵包屑" className="flex min-w-0 items-center gap-2 overflow-hidden text-sm text-ink/48">
        <Link href="/" className="shrink-0 transition hover:text-ink">首頁</Link>
        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-champagne" />
        <Link href="/collections" className="shrink-0 transition hover:text-ink">商品系列</Link>
        {category ? (
          <>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-champagne" />
            <Link href={`/collections/${category.slug}`} className="shrink-0 transition hover:text-ink">{category.name}</Link>
          </>
        ) : null}
        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-champagne" />
        <span aria-current="page" className="truncate text-ink/72">{product.nameZh}</span>
      </nav>
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-8">
        <div className="glass-panel relative aspect-[4/3] min-w-0 overflow-hidden md:aspect-[4/4.8] lg:col-start-1 lg:row-start-1">
          <AutoImageRotator images={product.images} alt={product.nameZh} priority className="absolute inset-0" imageClassName="object-cover" intervalMs={4600} sizes="(max-width: 1024px) 100vw, 560px" />
        </div>
        <div className="glass-panel min-w-0 space-y-5 p-5 md:space-y-6 md:p-8 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.34em] text-rosegold">{product.name}</p>
            <h1 className="product-detail-title font-display text-[2.55rem] leading-[1.02] text-ink md:text-[3.35rem] lg:text-[3.8rem]">{product.nameZh}</h1>
            <p className="text-base leading-8 text-ink/68 md:text-lg">{product.summary}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.2rem] border border-champagne/12 bg-white/55 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-champagne">系列分類</p>
              <p className="mt-2 text-base text-ink/76">{category?.name ?? product.category}</p>
            </div>
            <div className="rounded-[1.2rem] border border-champagne/12 bg-white/55 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-champagne">規格資訊</p>
              <p className="mt-2 text-base text-ink/76">{specification}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-y border-champagne/15 py-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-champagne">參考價格</p>
              <strong className="mt-2 block font-display text-2xl">{formatCurrency(product.price)}</strong>
            </div>
            <p className="max-w-[16rem] text-sm leading-6 text-ink/52 sm:text-right">送出需求後，由顧問確認規格、數量與正式報價。</p>
          </div>
          <ul className="space-y-3 text-sm leading-8 text-ink/68">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className="mt-1.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-champagne/12 text-champagne">
                  <Check aria-hidden="true" className="h-3.5 w-3.5" />
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link href="/ordering" className="rounded-[1.2rem] border border-champagne/15 bg-white/55 p-4 transition hover:bg-white/80">
              <PackageCheck aria-hidden="true" className="h-5 w-5 text-champagne" />
              <p className="mt-3 text-sm text-ink">專人確認</p>
              <p className="mt-1 text-xs leading-5 text-ink/50">送出後確認品項與交期</p>
            </Link>
            <Link href="/shipping" className="rounded-[1.2rem] border border-champagne/15 bg-white/55 p-4 transition hover:bg-white/80">
              <Truck aria-hidden="true" className="h-5 w-5 text-champagne" />
              <p className="mt-3 text-sm text-ink">配送說明</p>
              <p className="mt-1 text-xs leading-5 text-ink/50">查看運費與配送安排</p>
            </Link>
            <a href={`https://line.me/R/ti/p/~${contact.line}`} className="rounded-[1.2rem] border border-champagne/15 bg-white/55 p-4 transition hover:bg-white/80">
              <Headphones aria-hidden="true" className="h-5 w-5 text-champagne" />
              <p className="mt-3 text-sm text-ink">LINE 顧問</p>
              <p className="mt-1 text-xs leading-5 text-ink/50">先詢問再決定也可以</p>
            </a>
          </div>
          <div className="grid gap-3 sm:flex sm:flex-wrap sm:gap-4">
            <Link href={`/order?product=${product.slug}`} className="hero-button-dark min-h-[52px] justify-center">填寫訂購資料</Link>
            <Link href="/custom" className="hero-button-light min-h-[52px] justify-center">企業客製洽詢</Link>
          </div>
          {product.placeholder ? (
            <p className="rounded-3xl border border-rosegold/20 bg-rosegold/10 px-4 py-3 text-sm text-ink/70">
              本品項採專人詢價，實際規格與禮盒內容將由顧問協助確認。
            </p>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:col-start-1 lg:row-start-2">
          {product.images.slice(1).map((image) => (
            <div key={image} className="glass-panel relative aspect-square overflow-hidden">
              <Image src={withBasePath(image)} alt={`${product.nameZh} 商品細節`} fill sizes="(max-width: 768px) 50vw, 260px" className="object-cover" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
