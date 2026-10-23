import { ProductCatalog } from "@/components/product-catalog";
import { SectionHeading } from "@/components/section-heading";
import { TrustBadges } from "@/components/trust-badges";
import { getCategories, getProducts } from "@/lib/content";
import { getMessages, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export function productsMetadata(locale: Locale) {
  const t = getMessages(locale).productsPage;
  return buildMetadata({ title: t.metaTitle, description: t.metaDescription, path: "/products", locale });
}

export function ProductsView({ locale }: { locale: Locale }) {
  const t = getMessages(locale).productsPage;
  return (
    <main id="main-content" className="shell space-y-8 py-8 md:py-12">
      <SectionHeading as="h1" eyebrow={t.eyebrow} title={t.title} description={t.description} />
      <ProductCatalog products={getProducts()} categories={getCategories()} />
      <TrustBadges className="pt-4" locale={locale} />
    </main>
  );
}
