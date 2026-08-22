import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AutoImageRotator } from "@/components/auto-image-rotator";
import { StructuredData } from "@/components/structured-data";
import { getProduct, getProducts } from "@/lib/content";
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

  return (
    <main id="main-content" className="shell space-y-8 py-10 md:space-y-10 md:py-16">
      <StructuredData data={buildProductSchema(product)} />
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="min-w-0 grid gap-4">
          <div className="glass-panel relative aspect-[4/4.8] overflow-hidden">
            <AutoImageRotator images={product.images} alt={product.nameZh} priority className="absolute inset-0" imageClassName="object-cover" intervalMs={4600} sizes="(max-width: 1024px) 100vw, 560px" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3 md:gap-4">
            {product.images.slice(1).map((image) => (
              <div key={image} className="glass-panel relative aspect-square overflow-hidden">
                <Image src={withBasePath(image)} alt={product.nameZh} fill sizes="(max-width: 768px) 33vw, 180px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel min-w-0 space-y-5 p-5 md:space-y-6 md:p-8">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.34em] text-rosegold">{product.name}</p>
            <h1 className="font-display text-[3rem] leading-[0.96] text-ink md:text-[3.6rem] lg:text-[4.2rem]">{product.nameZh}</h1>
            <p className="text-base leading-8 text-ink/68 md:text-lg">{product.summary}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.2rem] border border-champagne/12 bg-white/55 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-champagne">系列分類</p>
              <p className="mt-2 text-base text-ink/76">{product.category}</p>
            </div>
            <div className="rounded-[1.2rem] border border-champagne/12 bg-white/55 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-champagne">規格資訊</p>
              <p className="mt-2 text-base text-ink/76">{product.specification}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex w-fit rounded-full border border-champagne/30 px-4 py-2 text-sm text-ink/70">{product.specification}</span>
            <strong className="font-display text-2xl">{formatCurrency(product.price)}</strong>
          </div>
          <ul className="space-y-3 text-sm leading-8 text-ink/68">
            {product.features.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
          </ul>
          <div className="grid gap-3 sm:flex sm:flex-wrap sm:gap-4">
            <Link href={`/order?product=${product.slug}`} className="hero-button-dark min-h-[52px] justify-center">立即下單</Link>
            <Link href="/custom" className="hero-button-light min-h-[52px] justify-center">詢問客製方案</Link>
          </div>
          {product.placeholder ? (
            <p className="rounded-3xl border border-rosegold/20 bg-rosegold/10 px-4 py-3 text-sm text-ink/70">
              這個商品目前仍為範本資料。請到 `data/products.json` 補上正式價格與規格。
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
