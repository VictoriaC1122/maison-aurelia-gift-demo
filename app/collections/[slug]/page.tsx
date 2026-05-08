import { notFound } from "next/navigation";
import { AutoImageRotator } from "@/components/auto-image-rotator";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { getCategories, getCategory, getProductsByCategory, productContent } from "@/lib/content";
import { withBasePath } from "@/lib/utils";
import Image from "next/image";

export function generateStaticParams() {
  return getCategories().map((category) => ({ slug: category.slug }));
}

export default async function CollectionDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const products = getProductsByCategory(slug);
  const isFactory = slug === "factory";

  return (
    <main className="shell space-y-10 py-16">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.36em] text-champagne">{category.englishName}</p>
          <h1 className="font-display text-5xl text-ink md:text-7xl">{category.name}</h1>
          <p className="max-w-2xl text-base leading-8 text-ink/65">{category.description}</p>
        </div>
        <div className="glass-panel relative min-h-[360px] overflow-hidden">
          <AutoImageRotator
            images={[category.coverImage, ...products.flatMap((product) => product.images)]}
            alt={category.name}
            priority
            intervalMs={4800}
            className="absolute inset-0"
            imageClassName="object-cover"
          />
        </div>
      </div>

      {isFactory ? (
        <section className="space-y-8">
          <SectionHeading eyebrow="Origin Gallery" title="越南燕廠故事與溯源影像" />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {productContent.factoryGallery.map((image) => (
              <div key={image} className="glass-panel relative aspect-[4/3] overflow-hidden">
                <Image src={withBasePath(image)} alt="factory image" fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="space-y-8">
          <SectionHeading eyebrow="Products" title="商品分類頁" description="目前部分產品為範本資料，便於你之後補上正式名稱、價格、規格與特色。" />
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
