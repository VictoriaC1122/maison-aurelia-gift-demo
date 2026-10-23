import { ProductCatalog } from "@/components/product-catalog";
import { SectionHeading } from "@/components/section-heading";
import { TrustBadges } from "@/components/trust-badges";
import { getCategories, getProducts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "全部商品",
  description: "選購越金燕「燕序」本養、深養系列燕窩禮盒，支援宅配到府與 7-11、全家超商取貨。",
  path: "/products"
});

export default function ProductsPage() {
  return (
    <main id="main-content" className="shell space-y-8 py-8 md:py-12">
      <SectionHeading
        as="h1"
        eyebrow="Shop"
        title="全部商品"
        description="燕序本養適合日常保養與初次品嚐；燕序深養適合長輩、重要客戶與節慶大禮。"
      />
      <ProductCatalog products={getProducts()} categories={getCategories()} />
      <TrustBadges className="pt-4" />
    </main>
  );
}
