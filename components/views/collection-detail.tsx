import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { AutoImageRotator } from "@/components/auto-image-rotator";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import {
  categoryAltName,
  categoryDescription,
  categoryName,
  getCategories,
  getCategory,
  getFactoryCaption,
  getProductsByCategory,
  productContent
} from "@/lib/content";
import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { cn, withBasePath } from "@/lib/utils";

export function collectionStaticParams() {
  return getCategories().map((category) => ({ slug: category.slug }));
}

export function collectionMetadata(slug: string, locale: Locale): Metadata {
  const category = getCategory(slug);
  const t = getMessages(locale).collections;
  if (!category) {
    return buildMetadata({ title: t.metaTitle, description: t.fallbackDescription, path: "/collections", locale });
  }
  return buildMetadata({
    title: categoryName(category, locale),
    description: categoryDescription(category, locale),
    path: `/collections/${slug}`,
    image: category.coverImage,
    locale
  });
}

export function CollectionDetailView({ slug, locale }: { slug: string; locale: Locale }) {
  const category = getCategory(slug);
  if (!category) notFound();

  const messages = getMessages(locale);
  const t = messages.collections;
  const factory = messages.factory;
  const href = (path: string) => localePath(locale, path);
  const products = getProductsByCategory(slug);
  const isFactory = slug === "factory";
  const name = categoryName(category, locale);

  return (
    <main id="main-content" className="shell space-y-10 py-10 md:py-16">
      <nav aria-label={messages.common.breadcrumb} className="flex min-w-0 items-center gap-2 overflow-hidden text-sm text-ink/48">
        <Link href={href("/")} className="shrink-0 transition hover:text-ink">{messages.common.home}</Link>
        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-champagne" />
        <Link href={href("/collections")} className="shrink-0 transition hover:text-ink">{t.title}</Link>
        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-champagne" />
        <span aria-current="page" className="truncate text-ink/72">{name}</span>
      </nav>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end">
        <div className="min-w-0 space-y-5">
          <p className="text-xs uppercase tracking-[0.36em] text-champagne">{categoryAltName(category, locale)}</p>
          <h1
            className={cn(
              "collection-hero__title font-display leading-[1.02] text-ink",
              locale === "en" ? "text-[2.5rem] md:text-[3.4rem] lg:text-[4rem] xl:text-[4.4rem]" : "text-[2.7rem] md:text-[3.8rem] lg:text-[4.6rem] xl:text-[5.1rem]"
            )}
          >
            {name}
          </h1>
          <p className="max-w-2xl text-base leading-8 text-ink/65">{categoryDescription(category, locale)}</p>
          {!isFactory ? (
            <div className="inline-flex rounded-full border border-champagne/15 bg-white/62 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-champagne">
              {t.count(products.length)}
            </div>
          ) : null}
        </div>
        <div className="glass-panel relative min-h-[260px] overflow-hidden md:min-h-[360px]">
          <AutoImageRotator
            images={[category.coverImage, ...products.flatMap((product) => product.images)]}
            alt={name}
            priority
            intervalMs={4800}
            className="absolute inset-0"
            imageClassName="object-cover"
            sizes="(max-width: 1024px) 100vw, 520px"
          />
        </div>
      </div>

      <nav aria-label={t.switchLabel} className="glass-panel flex gap-2 overflow-x-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {getCategories().map((item) => {
          const isCurrent = item.slug === category.slug;
          return (
            <Link
              key={item.slug}
              href={href(`/collections/${item.slug}`)}
              aria-current={isCurrent ? "page" : undefined}
              className={cn(
                "inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full px-5 text-sm transition",
                isCurrent ? "bg-ink text-pearl" : "bg-white/55 text-ink/68 hover:bg-white/85 hover:text-ink"
              )}
            >
              {categoryName(item, locale)}
            </Link>
          );
        })}
      </nav>

      {isFactory ? (
        <section className="space-y-8">
          <SectionHeading eyebrow={factory.eyebrow} title={factory.title} description={factory.description} />
          <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {factory.steps.map((step, index) => (
              <li key={step.title} className="glass-panel p-5 md:p-6">
                <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">{factory.stepLabel(index + 1)}</p>
                <h3 className="mt-3 font-display text-2xl text-ink">{step.title}</h3>
                <p className="mt-3 text-[0.97rem] leading-8 text-ink/66">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {productContent.factoryGallery.map((image, index) => (
              <figure key={image} className="glass-panel overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={withBasePath(image)}
                    alt={getFactoryCaption(image, index, locale)}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 360px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="px-5 py-4 text-sm text-ink/66">{getFactoryCaption(image, index, locale)}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : (
        <section className="space-y-8">
          <SectionHeading eyebrow={t.productsEyebrow} title={t.productsTitle} description={t.productsDescription} />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
