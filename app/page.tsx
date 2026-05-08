import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/motion";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { contact, getCategories, getFeaturedProducts, productContent, site } from "@/lib/content";
import { withBasePath } from "@/lib/utils";

export default function HomePage() {
  const categories = getCategories();
  const featured = getFeaturedProducts();

  return (
    <main className="pb-20">
      <section className="shell grid min-h-[calc(100vh-84px)] items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <FadeIn className="space-y-8">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.38em] text-champagne">{site.englishSlogan}</p>
            <h1 className="max-w-3xl font-display text-5xl leading-[0.95] text-ink md:text-7xl">
              精品燕窩，不做傳統電商感，
              <br />
              而像一個真正的 luxury gift maison。
            </h1>
            <p className="max-w-2xl text-base leading-8 text-ink/65 md:text-lg">
              參考高轉換品牌網站的導購節奏，重新設計為奶油白、香檳金、霧面黑與留白構成的精品官網，
              讓燕禮、企業贈禮與客製方案都能呈現更高級的品牌感。
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/collections" className="hero-button-dark">探索商品系列</Link>
            <Link href="/order" className="hero-button-light">立即下單</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "精品主軸", value: "Quiet Luxury" },
              { label: "品牌顧問", value: contact.name },
              { label: "LINE", value: contact.line }
            ].map((item) => (
              <div key={item.label} className="glass-panel p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-champagne">{item.label}</p>
                <p className="mt-3 text-lg text-ink">{item.value}</p>
              </div>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.08} className="grid gap-6">
          <div className="glass-panel relative aspect-[1/1.16] overflow-hidden">
            <Image src={withBasePath("/assets/brand/brand-card.jpg")} alt="Maison Aurelia brand card" fill className="object-cover" />
          </div>
          <div className="glass-panel overflow-hidden">
            <video controls playsInline poster={withBasePath("/assets/brand/brand-card.jpg")} className="w-full object-cover">
              <source src={withBasePath("/assets/video/hero-film.mp4")} type="video/mp4" />
            </video>
          </div>
        </FadeIn>
      </section>

      <section className="shell space-y-8 py-14">
        <SectionHeading
          eyebrow="Brand Narrative"
          title="用品牌故事、Why Us、商品系列、FAQ 與下單流程，建立完整高端購物旅程。"
          description="結構借鏡成熟品牌站的資訊安排，但文案、圖片、視覺與互動全部重做，保留商業效率，同時維持精品禮盒品牌的克制與優雅。"
        />
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-panel p-7">
            <p className="text-sm uppercase tracking-[0.28em] text-rosegold">Brand Promise</p>
            <p className="mt-4 text-base leading-8 text-ink/65">
              {site.chineseSlogan}。我們把產地溯源、送禮儀式感、客製提案與正式下單機制整合成一個精緻而完整的品牌體驗。
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {categories.map((category) => (
              <Link key={category.slug} href={`/collections/${category.slug}`} className="glass-panel group overflow-hidden">
                <div className="relative aspect-[4/5]">
                  <Image src={withBasePath(category.coverImage)} alt={category.name} fill className="object-cover transition duration-500 group-hover:scale-[1.04]" />
                </div>
                <div className="space-y-2 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-champagne">{category.englishName}</p>
                  <h3 className="font-display text-3xl text-ink">{category.name}</h3>
                  <p className="text-sm leading-7 text-ink/60">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="shell space-y-8 py-14">
        <SectionHeading
          eyebrow="Best Sellers"
          title="暢銷商品區保留導購效率，但商品卡語言改成高級禮盒展示。"
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {featured.map((product, index) => (
            <FadeIn key={product.slug} delay={index * 0.08}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="shell py-14">
        <div className="glass-panel grid gap-8 p-8 lg:grid-cols-[1fr_1.2fr] lg:p-10">
          <SectionHeading
            eyebrow="Origin Atelier"
            title="越南燕廠，不只是相簿，而是讓精品品牌站得住的來源敘事。"
            description="原料、採摘、處理與品管影像會在系列頁完整鋪陳，讓高端感建立在真實供應鏈之上。"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {productContent.factoryGallery.slice(0, 4).map((image) => (
              <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                <Image src={withBasePath(image)} alt="origin atelier" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
