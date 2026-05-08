import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatCurrency, withBasePath } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-luxe border border-white/50 bg-white/70 shadow-glass backdrop-blur">
      <div className="relative aspect-[4/4.6] overflow-hidden">
        <Image
          src={withBasePath(product.images[0])}
          alt={product.nameZh}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.32em] text-rosegold">{product.name}</p>
          <h3 className="font-display text-3xl text-ink">{product.nameZh}</h3>
          <p className="text-sm leading-7 text-ink/65">{product.summary}</p>
        </div>
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="rounded-full border border-champagne/25 px-4 py-2 text-ink/70">
            {product.specification}
          </span>
          <strong className="font-display text-xl text-ink">{formatCurrency(product.price)}</strong>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex rounded-full border border-champagne/35 px-5 py-3 text-sm text-ink transition hover:-translate-y-0.5"
          >
            查看詳情
          </Link>
          <Link
            href={`/order?product=${product.slug}`}
            className="inline-flex rounded-full bg-ink px-5 py-3 text-sm text-pearl transition hover:-translate-y-0.5"
          >
            加入詢價 / 下單
          </Link>
        </div>
      </div>
    </article>
  );
}
