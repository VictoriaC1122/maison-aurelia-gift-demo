import Link from "next/link";
import { AutoImageRotator } from "@/components/auto-image-rotator";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const specification = product.specification === "待補" ? "顧問確認" : product.specification;

  return (
    <article className="product-card group flex h-full min-w-0 flex-col overflow-hidden rounded-luxe border border-white/50 bg-white/70 shadow-glass backdrop-blur">
      <Link
        href={`/products/${product.slug}`}
        aria-label={`查看 ${product.nameZh} 詳情`}
        className="product-card__media relative block aspect-[4/3] overflow-hidden focus-visible:outline-offset-[-4px]"
      >
        <AutoImageRotator
          images={product.images}
          alt={product.nameZh}
          className="absolute inset-0 transition duration-500 group-hover:scale-[1.03]"
          imageClassName="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 360px"
        />
        <span className="absolute bottom-3 right-3 rounded-full border border-white/55 bg-pearl/80 px-3 py-1.5 text-[11px] tracking-[0.08em] text-ink/72 backdrop-blur-md">
          查看商品
        </span>
      </Link>
      <div className="product-card__body flex min-w-0 flex-1 flex-col gap-4 p-5 md:p-6">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.28em] text-rosegold md:text-xs md:tracking-[0.32em]">{product.name}</p>
          <h3 className="product-card__title min-h-[3.8rem] font-display text-[1.68rem] leading-[1.08] tracking-[-0.015em] text-ink md:min-h-[4.8rem] md:text-3xl md:tracking-normal">
            <Link href={`/products/${product.slug}`} className="transition hover:text-ink/70">
              {product.nameZh}
            </Link>
          </h3>
          <p className="product-card__summary min-h-[5rem] text-[0.96rem] leading-7 text-ink/65 md:min-h-[5.5rem] md:text-sm">{product.summary}</p>
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <div className="product-card__pricing flex items-center justify-between gap-3 text-sm">
            <span className="product-card__spec inline-flex w-fit rounded-full border border-champagne/25 px-4 py-2 text-[0.96rem] text-ink/70 md:text-sm">
              {specification}
            </span>
            <strong className="product-card__price font-display text-[1.72rem] leading-none text-ink md:text-xl">{formatCurrency(product.price)}</strong>
          </div>
          <div className="product-card__actions grid gap-3 sm:grid-cols-2">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-champagne/35 px-5 py-3 text-[0.95rem] text-ink transition hover:-translate-y-0.5 active:scale-[0.99] md:text-sm"
            >
              了解商品
            </Link>
            <Link
              href={`/order?product=${product.slug}`}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-ink px-5 py-3 text-[0.95rem] text-pearl transition hover:-translate-y-0.5 active:scale-[0.99] md:text-sm"
            >
              選擇此商品
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
