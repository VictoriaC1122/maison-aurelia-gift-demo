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
              讓燕禮回到應有的質地，
              <br />
              在日常與贈禮之間，安靜發光。
            </h1>
            <p className="max-w-2xl text-base leading-8 text-ink/65 md:text-lg">
              以奶油白、香檳金與留白構成品牌語境，將燕窩、節慶贈禮與客製禮盒整理成更從容、
              更細緻的收藏式體驗。
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
          title="從品牌氣質到送禮細節，都應該被妥帖呈現。"
          description="Maison Aurelia 希望讓每一份燕禮，都像一件被細心挑選的作品，溫柔、克制，卻足夠令人記得。"
        />
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-panel p-7">
            <p className="text-sm uppercase tracking-[0.28em] text-rosegold">Brand Promise</p>
            <p className="mt-4 text-base leading-8 text-ink/65">
              {site.chineseSlogan}。從產地到瓶身，從包裝到贈禮時刻，我們希望把珍貴感留在每一次被打開的瞬間。
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
          title="幾款值得一眼記住，也值得慢慢品味的燕禮。"
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
            title="所有細膩的風味與質地，都有它被好好對待的來處。"
            description="從產地採摘到後續整理，每一道工序都影響著最終入口的純淨與層次。"
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
