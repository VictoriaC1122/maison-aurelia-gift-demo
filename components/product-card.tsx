import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Product } from "@/lib/types";
import { formatCurrency, withBasePath } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const specification = product.specification === "待補" ? "顧問確認" : product.specification;
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1];

  return (
    <article className="product-card group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.65rem] border border-champagne/14 bg-[rgba(255,253,249,0.86)]">
      <Link
        href={`/products/${product.slug}`}
        aria-label={`查看 ${product.nameZh} 詳情`}
        className="product-card__media relative block aspect-[4/3] overflow-hidden focus-visible:outline-offset-[-4px]"
      >
        {primaryImage ? (
          <Image
            src={withBasePath(primaryImage)}
            alt={product.nameZh}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
            className="object-cover transition duration-700 group-hover:scale-[1.018]"
          />
        ) : null}
        {secondaryImage ? (
          <Image
            src={withBasePath(secondaryImage)}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
            className="hidden object-cover opacity-0 transition duration-700 group-hover:opacity-100 md:block"
          />
        ) : null}
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/55 bg-pearl/84 px-3 py-1.5 text-[11px] tracking-[0.06em] text-ink/72 backdrop-blur-md">
          查看內容 <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
        </span>
      </Link>
      <div className="product-card__body flex min-w-0 flex-1 flex-col gap-5 p-5 md:p-6">
        <div className="space-y-2.5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-rosegold md:text-xs md:tracking-[0.32em]">{product.name}</p>
          <h3 className="product-card__title min-h-[3.8rem] font-display text-[1.68rem] leading-[1.08] text-ink md:min-h-[4.8rem] md:text-3xl">
            <Link href={`/products/${product.slug}`} className="inline-flex min-h-11 items-center transition hover:text-ink/70">
              {product.nameZh}
            </Link>
          </h3>
          <p className="product-card__summary min-h-[5rem] text-[0.96rem] leading-7 text-ink/65 md:min-h-[5.5rem] md:text-sm">{product.summary}</p>
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <div className="product-card__pricing flex items-end justify-between gap-3 border-t border-champagne/12 pt-4 text-sm">
            <span className="product-card__spec inline-flex w-fit rounded-full border border-champagne/22 px-4 py-2 text-[0.96rem] text-ink/68 md:text-sm">
              {specification}
            </span>
            <span className="text-right">
              <span className="block text-[10px] uppercase tracking-[0.18em] text-ink/38">{product.price ? "售價" : "報價方式"}</span>
              <strong className="product-card__price mt-1 block font-display text-[1.35rem] font-medium leading-none text-ink md:text-xl">{formatCurrency(product.price)}</strong>
            </span>
          </div>
          <div className="product-card__actions grid gap-3 sm:grid-cols-2">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-champagne/35 px-5 py-3 text-[0.95rem] text-ink transition hover:-translate-y-0.5 active:scale-[0.99] md:text-sm"
            >
              查看詳情
            </Link>
            <Link
              href={`/order?product=${product.slug}`}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-ink px-5 py-3 text-[0.95rem] text-pearl transition hover:-translate-y-0.5 active:scale-[0.99] md:text-sm"
            >
              選入訂購單
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
