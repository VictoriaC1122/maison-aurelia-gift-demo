"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { ProductCard } from "@/components/product-card";
import { categoryName } from "@/lib/content";
import type { Category, Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "price-asc" | "price-desc";

export function ProductCatalog({ products, categories }: { products: Product[]; categories: Category[] }) {
  const shoppable = useMemo(
    () => categories.filter((item) => products.some((product) => product.category === item.slug)),
    [categories, products]
  );
  const { locale, t } = useLocale();
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("featured");

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("category");
    if (requested && shoppable.some((item) => item.slug === requested)) setCategory(requested);
    // 只在進入頁面時讀取網址參數
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = useMemo(() => {
    const filtered = category === "all" ? products : products.filter((product) => product.category === category);
    if (sort === "featured") return filtered;
    const price = (product: Product) => Number(product.price) || (sort === "price-asc" ? Infinity : -Infinity);
    return [...filtered].sort((a, b) => (sort === "price-asc" ? price(a) - price(b) : price(b) - price(a)));
  }, [products, category, sort]);

  const hasPrices = products.some((product) => Number(product.price) > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label={t.catalog.tabs} className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {[{ slug: "all", name: t.catalog.all }, ...shoppable.map((item) => ({ slug: item.slug, name: categoryName(item, locale) }))].map((item) => (
            <button
              key={item.slug}
              type="button"
              role="tab"
              aria-selected={category === item.slug}
              onClick={() => setCategory(item.slug)}
              className={cn(
                "inline-flex min-h-[44px] shrink-0 items-center rounded-full px-5 text-sm transition",
                category === item.slug ? "bg-ink text-pearl" : "border border-champagne/20 bg-white/60 text-ink/70 hover:bg-white"
              )}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm text-ink/60">
          <span>{t.common.productCount(visible.length)}</span>
          {hasPrices ? (
            <label className="flex items-center gap-2">
              <span className="sr-only">{t.catalog.sort}</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="min-h-[40px] rounded-full border border-champagne/20 bg-white/70 px-3 text-sm text-ink"
              >
                <option value="featured">{t.catalog.featured}</option>
                <option value="price-asc">{t.catalog.priceAsc}</option>
                <option value="price-desc">{t.catalog.priceDesc}</option>
              </select>
            </label>
          ) : null}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product) => (
          <ProductCard key={product.slug} product={product} locale={locale} headingLevel="h2" />
        ))}
      </div>
    </div>
  );
}
