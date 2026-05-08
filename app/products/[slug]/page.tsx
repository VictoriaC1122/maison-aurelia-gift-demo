import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/content";
import { formatCurrency } from "@/lib/utils";

export function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
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
    <main className="shell space-y-10 py-16">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-4">
          <div className="glass-panel relative aspect-[4/4.8] overflow-hidden">
            <Image src={product.images[0]} alt={product.nameZh} fill className="object-cover" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {product.images.slice(1).map((image) => (
              <div key={image} className="glass-panel relative aspect-square overflow-hidden">
                <Image src={image} alt={product.nameZh} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel space-y-6 p-8">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.34em] text-rosegold">{product.name}</p>
            <h1 className="font-display text-5xl text-ink">{product.nameZh}</h1>
            <p className="text-lg leading-8 text-ink/68">{product.summary}</p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full border border-champagne/30 px-4 py-2 text-sm text-ink/70">{product.specification}</span>
            <strong className="font-display text-2xl">{formatCurrency(product.price)}</strong>
          </div>
          <ul className="space-y-3 text-sm leading-8 text-ink/68">
            {product.features.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-4">
            <Link href={`/order?product=${product.slug}`} className="hero-button-dark">立即下單</Link>
            <Link href="/custom" className="hero-button-light">詢問客製方案</Link>
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
