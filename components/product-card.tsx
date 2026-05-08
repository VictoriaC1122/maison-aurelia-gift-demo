import Link from "next/link";
import { AutoImageRotator } from "@/components/auto-image-rotator";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-luxe border border-white/50 bg-white/70 shadow-glass backdrop-blur">
      <div className="relative aspect-[4/4.6] overflow-hidden">
        <AutoImageRotator
          images={product.images}
          alt={product.nameZh}
          className="absolute inset-0 transition duration-500 group-hover:scale-[1.03]"
          imageClassName="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.32em] text-rosegold">{product.name}</p>
          <h3 className="min-h-[4.2rem] font-display text-[1.9rem] leading-tight text-ink md:min-h-[4.8rem] md:text-3xl">
            {product.nameZh}
          </h3>
          <p className="min-h-[5.25rem] text-sm leading-7 text-ink/65 md:min-h-[5.5rem]">{product.summary}</p>
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex w-fit rounded-full border border-champagne/25 px-4 py-2 text-ink/70">
            {product.specification}
          </span>
          <strong className="font-display text-xl text-ink">{formatCurrency(product.price)}</strong>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-champagne/35 px-5 py-3 text-sm text-ink transition hover:-translate-y-0.5 active:scale-[0.99]"
            >
              查看詳情
            </Link>
            <Link
              href={`/order?product=${product.slug}`}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-ink px-5 py-3 text-sm text-pearl transition hover:-translate-y-0.5 active:scale-[0.99]"
            >
              加入詢價 / 下單
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
