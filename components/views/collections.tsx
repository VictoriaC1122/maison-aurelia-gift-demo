import Link from "next/link";
import { AutoImageRotator } from "@/components/auto-image-rotator";
import { SectionHeading } from "@/components/section-heading";
import { categoryAltName, categoryDescription, categoryName, getCategories, getProductsByCategory } from "@/lib/content";
import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export function collectionsMetadata(locale: Locale) {
  const t = getMessages(locale).collections;
  return buildMetadata({ title: t.metaTitle, description: t.metaDescription, path: "/collections", locale });
}

export function CollectionsView({ locale }: { locale: Locale }) {
  const t = getMessages(locale).collections;
  return (
    <main id="main-content" className="shell space-y-8 py-10 md:py-16">
      <SectionHeading as="h1" eyebrow={t.eyebrow} title={t.title} description={t.description} />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {getCategories().map((category) => (
          <Link key={category.slug} href={localePath(locale, `/collections/${category.slug}`)} className="collection-card glass-panel group overflow-hidden">
            <div className="relative aspect-[4/5]">
              <AutoImageRotator
                images={[category.coverImage, ...getProductsByCategory(category.slug).flatMap((product) => product.images)]}
                alt={categoryName(category, locale)}
                className="absolute inset-0 transition duration-500 group-hover:scale-[1.03]"
                imageClassName="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 380px"
              />
            </div>
            <div className="space-y-2 p-5 md:p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-champagne">{categoryAltName(category, locale)}</p>
              <h2 className="font-display text-[2rem] leading-[1.08] md:text-3xl">{categoryName(category, locale)}</h2>
              <p className="text-sm leading-7 text-ink/65">{categoryDescription(category, locale)}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
