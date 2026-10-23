import Link from "next/link";
import { AutoImageRotator } from "@/components/auto-image-rotator";
import { SectionHeading } from "@/components/section-heading";
import { getCategories, getProductsByCategory } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "商品系列",
  description: "依系列快速瀏覽越金燕的本養、深養與產地故事內容。",
  path: "/collections"
});

export default function CollectionsPage() {
  return (
    <main id="main-content" className="shell space-y-8 py-10 md:py-16">
      <SectionHeading as="h1" eyebrow="Collections" title="商品系列" description="依送禮情境與風味深度，瀏覽本養、深養與產地系列。" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {getCategories().map((category) => (
          <Link key={category.slug} href={`/collections/${category.slug}`} className="collection-card glass-panel group overflow-hidden">
            <div className="relative aspect-[4/5]">
              <AutoImageRotator
                images={[category.coverImage, ...getProductsByCategory(category.slug).flatMap((product) => product.images)]}
                alt={category.name}
                className="absolute inset-0 transition duration-500 group-hover:scale-[1.03]"
                imageClassName="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 380px"
              />
            </div>
            <div className="space-y-2 p-5 md:p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-champagne">{category.englishName}</p>
              <h2 className="font-display text-[2rem] leading-[1.08] md:text-3xl">{category.name}</h2>
              <p className="text-sm leading-7 text-ink/65">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
