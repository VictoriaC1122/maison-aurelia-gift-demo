import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart";
import { categoryName, getCategory, productName, productSummary } from "@/lib/content";
import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { displaySpecification } from "@/lib/pricing";
import type { Product } from "@/lib/types";
import { formatCurrency, withBasePath } from "@/lib/utils";

export function ProductCard({ product, locale = "zh" }: { product: Product; locale?: Locale }) {
  const t = getMessages(locale);
  const name = productName(product, locale);
  const href = localePath(locale, `/products/${product.slug}`);
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1];
  const category = getCategory(product.category);

  return (
    <article className="product-card group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.4rem] border border-champagne/14 bg-[rgba(255,253,249,0.9)]">
      <Link
        href={href}
        aria-label={t.common.viewProductAria(name)}
        className="product-card__media relative block aspect-square overflow-hidden bg-white/60 focus-visible:outline-offset-[-4px]"
      >
        {primaryImage ? (
          <Image
            src={withBasePath(primaryImage)}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
            className="object-cover transition duration-700 group-hover:scale-[1.02]"
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
        {category ? (
          <span className="absolute left-3 top-3 rounded-full bg-pearl/90 px-3 py-1 text-[11px] tracking-[0.08em] text-ink/70 backdrop-blur">
            {categoryName(category, locale)}
          </span>
        ) : null}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 md:p-5">
        <div className="space-y-1.5">
          <h3 className="font-display text-[1.25rem] leading-snug text-ink md:text-[1.35rem]">
            <Link href={href} className="transition hover:text-ink/70">
              {name}
            </Link>
          </h3>
          <p className="text-xs text-ink/50">{displaySpecification(product.specification, locale)}</p>
          <p className="line-clamp-2 text-sm leading-6 text-ink/62">{productSummary(product, locale)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-champagne/12 pt-3">
          <strong className="font-display text-lg font-medium text-ink">{formatCurrency(product.price, product.priceFrom, locale)}</strong>
          <AddToCartButton slug={product.slug} className="min-h-[42px] px-4 text-[13px]" />
        </div>
      </div>
    </article>
  );
}
