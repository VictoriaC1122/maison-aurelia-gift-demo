import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { AutoImageRotator } from "@/components/auto-image-rotator";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { getCategories, getCategory, getFactoryCaption, getProductsByCategory, productContent } from "@/lib/content";

const FACTORY_STEPS = [
  { title: "燕屋築巢", text: "金絲燕在越南燕屋的木樑上，以唾液一層層築成燕窩。燕屋保持安靜、昏暗，讓燕子安心棲息。" },
  { title: "人工採收", text: "燕窩由採收人員在燕屋內，以刮刀從木樑上逐一手工取下。" },
  { title: "清潔整理", text: "採下的原燕盞經過清潔、挑毛與整形，成為一盞盞完整的燕盞與燕條。" },
  { title: "製成燕序", text: "整理好的燕窩再製作成「燕序」本養、深養系列，裝入禮盒送到你手上。" }
];
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
      description: "瀏覽越金燕的系列內容。",
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
      <nav aria-label="麵包屑" className="flex min-w-0 items-center gap-2 overflow-hidden text-sm text-ink/48">
        <Link href="/" className="shrink-0 transition hover:text-ink">首頁</Link>
        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-champagne" />
        <Link href="/collections" className="shrink-0 transition hover:text-ink">商品系列</Link>
        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-champagne" />
        <span aria-current="page" className="truncate text-ink/72">{category.name}</span>
      </nav>
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

      <nav aria-label="切換商品系列" className="glass-panel flex gap-2 overflow-x-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {getCategories().map((item) => {
          const isCurrent = item.slug === category.slug;
          return (
            <Link
              key={item.slug}
              href={`/collections/${item.slug}`}
              aria-current={isCurrent ? "page" : undefined}
              className={`inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full px-5 text-sm transition ${
                isCurrent ? "bg-ink text-pearl" : "bg-white/55 text-ink/68 hover:bg-white/85 hover:text-ink"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {isFactory ? (
        <section className="space-y-8">
          <SectionHeading
            eyebrow="From Swiftlet House to Gift Box"
            title="從燕屋到燕盞"
            description="越金燕的燕窩來自越南燕屋。以下是燕屋、採收與整理過程的實拍照片，讓你在挑選前看見每一盞燕窩的來處。"
          />
          <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {FACTORY_STEPS.map((step, index) => (
              <li key={step.title} className="glass-panel p-5 md:p-6">
                <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Step {index + 1}</p>
                <h3 className="mt-3 font-display text-2xl text-ink">{step.title}</h3>
                <p className="mt-3 text-[0.97rem] leading-8 text-ink/66">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {productContent.factoryGallery.map((image, index) => (
              <figure key={image} className="glass-panel overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <Image src={withBasePath(image)} alt={getFactoryCaption(image, index)} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 360px" className="object-cover" />
                </div>
                <figcaption className="px-5 py-4 text-sm text-ink/66">{getFactoryCaption(image, index)}</figcaption>
              </figure>
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
