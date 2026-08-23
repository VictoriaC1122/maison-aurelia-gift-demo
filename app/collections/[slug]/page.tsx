import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AutoImageRotator } from "@/components/auto-image-rotator";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { getCategories, getCategory, getProductsByCategory, productContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { withBasePath } from "@/lib/utils";
import Image from "next/image";

export function generateStaticParams() {
  return getCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) {
    return buildMetadata({
      title: "商品系列",
      description: "瀏覽 Maison Aurelia 的系列內容。",
      path: "/collections"
    });
  }

  return buildMetadata({
    title: category.name,
    description: category.description,
    path: `/collections/${slug}`,
    image: category.coverImage
  });
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
    <main id="main-content" className="shell space-y-10 py-10 md:py-16">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end">
        <div className="min-w-0 space-y-5">
          <p className="text-xs uppercase tracking-[0.36em] text-champagne">{category.englishName}</p>
          <h1 className="collection-hero__title font-display text-[2.7rem] leading-[1.02] text-ink md:text-[3.8rem] lg:text-[4.6rem] xl:text-[5.1rem]">{category.name}</h1>
          <p className="max-w-2xl text-base leading-8 text-ink/65">{category.description}</p>
          {!isFactory ? (
            <div className="inline-flex rounded-full border border-champagne/15 bg-white/62 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-champagne">
              {products.length} 款系列商品
            </div>
          ) : null}
        </div>
        <div className="glass-panel relative min-h-[260px] overflow-hidden md:min-h-[360px]">
          <AutoImageRotator
            images={[category.coverImage, ...products.flatMap((product) => product.images)]}
            alt={category.name}
            priority
            intervalMs={4800}
            className="absolute inset-0"
            imageClassName="object-cover"
            sizes="(max-width: 1024px) 100vw, 520px"
          />
        </div>
      </div>

      {isFactory ? (
        <section className="space-y-8">
          <SectionHeading eyebrow="Origin Gallery" title="越南燕廠故事與溯源影像" />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {productContent.factoryGallery.map((image) => (
              <div key={image} className="glass-panel relative aspect-[4/3] overflow-hidden">
                <Image src={withBasePath(image)} alt="factory image" fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 360px" className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="space-y-8">
          <SectionHeading eyebrow="Products" title="本系列選品" description="規格、份數與禮盒搭配可由顧問協助確認，適合日常保養、節慶與企業贈禮。" />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
