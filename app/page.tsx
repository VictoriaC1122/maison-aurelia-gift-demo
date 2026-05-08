import Image from "next/image";
import Link from "next/link";
import { AutoImageRotator } from "@/components/auto-image-rotator";
import { FadeIn } from "@/components/motion";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { contact, getCategories, getFeaturedProducts, getProductsByCategory, productContent, site } from "@/lib/content";
import { withBasePath } from "@/lib/utils";

export default function HomePage() {
  const categories = getCategories();
  const featured = getFeaturedProducts();
  const signatureProduct = featured[0];

  return (
    <main className="relative pb-8 md:pb-20">
      <aside className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 xl:block">
        <div className="glass-panel flex flex-col items-center gap-5 px-4 py-6">
          <span className="text-[11px] uppercase tracking-[0.32em] text-champagne [writing-mode:vertical-rl]">
            Concierge
          </span>
          <div className="h-16 w-px bg-champagne/30" />
          <a
            href={`https://line.me/R/ti/p/~${contact.line}`}
            className="rounded-full border border-champagne/30 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-ink transition hover:bg-white/70"
          >
            Line
          </a>
          <a
            href="/contact"
            className="rounded-full border border-champagne/30 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-ink transition hover:bg-white/70"
          >
            Contact
          </a>
        </div>
      </aside>

      <section className="shell grid items-start gap-8 py-5 md:gap-10 md:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:pt-6">
        <FadeIn className="space-y-6 pt-1 md:space-y-10 lg:pt-0">
          <div className="space-y-4 md:space-y-5">
            <p className="text-xs uppercase tracking-[0.38em] text-champagne">{site.englishSlogan}</p>
            <h1 className="max-w-3xl font-display text-[2.9rem] leading-[0.94] text-ink sm:text-[3.45rem] md:text-7xl">
              讓燕禮回到應有的質地，
              <br />
              在日常與贈禮之間，安靜發光。
            </h1>
            <p className="max-w-2xl text-[15px] leading-7 text-ink/65 md:text-lg md:leading-8">
              以奶油白、香檳金與留白構成品牌語境，將燕窩、節慶贈禮與客製禮盒整理成更從容、
              更細緻的收藏式體驗。
            </p>
          </div>
          <div className="grid gap-3 sm:flex sm:flex-wrap sm:gap-4">
            <Link href="/collections" className="hero-button-dark min-h-[52px] justify-center px-7">探索商品系列</Link>
            <Link href="/order" className="hero-button-light min-h-[52px] justify-center px-7">立即下單</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {[
              { label: "精品主軸", value: "Quiet Luxury" },
              { label: "品牌顧問", value: contact.name },
              { label: "LINE", value: contact.line }
            ].map((item) => (
              <div key={item.label} className="glass-panel p-4 md:p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-champagne">{item.label}</p>
                <p className="mt-3 text-lg text-ink">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="hidden items-center gap-4 text-sm text-ink/45 md:flex">
            <span className="h-px w-16 bg-champagne/35" />
            <span className="uppercase tracking-[0.24em]">Scroll to discover</span>
          </div>
        </FadeIn>
        <FadeIn delay={0.08} className="grid gap-4 md:gap-6">
          <div className="glass-panel relative aspect-[1/1.16] overflow-hidden rounded-[2rem]">
            <AutoImageRotator
              images={featured.flatMap((product) => product.images)}
              alt="Maison Aurelia signature selections"
              priority
              intervalMs={5000}
              className="absolute inset-0"
              imageClassName="object-cover"
            />
            <div className="absolute inset-x-5 bottom-5 z-10 rounded-[1.5rem] border border-white/40 bg-[rgba(249,244,235,0.72)] p-4 backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.3em] text-champagne">Maison Moodboard</p>
              <p className="mt-2 text-sm leading-7 text-ink/72">
                以奶白紙紋、柔金光澤與安靜留白，描繪更克制的高端燕禮語境。
              </p>
            </div>
          </div>
          <div className="glass-panel overflow-hidden rounded-[2rem]">
            <video controls playsInline poster={withBasePath(featured[0]?.images[0] ?? "/assets/categories/benyang/S__75194507_0.jpg")} className="w-full object-cover">
              <source src={withBasePath("/assets/video/hero-film.mp4")} type="video/mp4" />
            </video>
          </div>
        </FadeIn>
      </section>

      <section className="shell space-y-8 py-10 md:py-14">
        <SectionHeading
          eyebrow="Brand Narrative"
          title="從品牌氣質到送禮細節，都應該被妥帖呈現。"
          description="Maison Aurelia 希望讓每一份燕禮，都像一件被細心挑選的作品，溫柔、克制，卻足夠令人記得。"
        />
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="glass-panel grid gap-6 p-5 md:p-7">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.28em] text-rosegold">Brand Promise</p>
              <p className="text-base leading-8 text-ink/65">
                {site.chineseSlogan}。從產地到瓶身，從包裝到贈禮時刻，我們希望把珍貴感留在每一次被打開的瞬間。
              </p>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: "Gentle Radiance",
                  text: "以低飽和色階與金色筆觸，保留燕禮應有的細緻與安定感。"
                },
                {
                  title: "Ceremonial Gifting",
                  text: "每一份禮盒都以打開時的光線、手感與節奏去思考它該如何被記住。"
                }
              ].map((item) => (
                <div key={item.title} className="rounded-[1.4rem] border border-champagne/15 bg-white/55 p-4 md:p-5">
                  <p className="font-display text-2xl text-ink">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-ink/58">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {categories.map((category) => (
              <Link key={category.slug} href={`/collections/${category.slug}`} className="glass-panel group overflow-hidden">
                <div className="relative aspect-[4/5]">
                  <AutoImageRotator
                    images={[category.coverImage, ...getProductsByCategory(category.slug).flatMap((product) => product.images)]}
                    alt={category.name}
                    className="absolute inset-0 transition duration-500 group-hover:scale-[1.04]"
                    imageClassName="object-cover"
                  />
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

      <section className="shell space-y-8 py-10 md:py-14">
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

      {signatureProduct ? (
        <section className="shell py-10 md:py-14">
          <div className="glass-panel grid gap-6 overflow-hidden p-5 md:gap-8 md:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
            <div className="relative min-h-[280px] overflow-hidden rounded-[2rem] md:min-h-[360px]">
              <AutoImageRotator
                images={signatureProduct.images}
                alt={signatureProduct.nameZh}
                priority
                intervalMs={4800}
                className="absolute inset-0"
                imageClassName="object-cover"
              />
            </div>
              <div className="flex flex-col justify-center space-y-5 md:space-y-6">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.34em] text-champagne">Signature Selection</p>
                <h2 className="font-display text-[2.3rem] leading-tight text-ink md:text-6xl">
                  {signatureProduct.nameZh}
                </h2>
                <p className="text-base leading-8 text-ink/65">
                  {signatureProduct.summary}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 md:gap-4">
                {signatureProduct.features.map((feature) => (
                  <div key={feature} className="rounded-[1.4rem] border border-champagne/15 bg-white/60 p-4 text-sm leading-7 text-ink/60">
                    {feature}
                  </div>
                ))}
              </div>
              <div className="grid gap-3 sm:flex sm:flex-wrap sm:gap-4">
                <Link href={`/products/${signatureProduct.slug}`} className="hero-button-dark min-h-[52px] justify-center">
                  了解此系列
                </Link>
                <Link href="/custom" className="hero-button-light min-h-[52px] justify-center">
                  洽詢客製禮盒
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="shell py-10 md:py-14">
        <div className="glass-panel grid gap-6 p-5 md:gap-8 md:p-8 lg:grid-cols-[1fr_1.2fr] lg:p-10">
          <SectionHeading
            eyebrow="Origin Atelier"
            title="所有細膩的風味與質地，都有它被好好對待的來處。"
            description="從產地採摘到後續整理，每一道工序都影響著最終入口的純淨與層次。"
          />
          <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
            {productContent.factoryGallery.slice(0, 4).map((image) => (
              <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                <Image src={withBasePath(image)} alt="origin atelier" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="glass-panel p-5 md:p-8 lg:p-10">
            <SectionHeading
              eyebrow="Private Concierge"
              title="如果你在尋找更細緻的送禮方式，我們很樂意替你整理。"
              description="無論是一份節慶心意、商務往來，或想為重要的人保留更安靜的祝福，都可以從這裡開始。"
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2 md:gap-4">
              <div className="rounded-[1.4rem] border border-champagne/15 bg-white/55 p-4 md:p-5">
                <p className="text-xs uppercase tracking-[0.26em] text-champagne">Phone</p>
                <p className="mt-2 text-lg text-ink">{contact.phone}</p>
              </div>
              <div className="rounded-[1.4rem] border border-champagne/15 bg-white/55 p-4 md:p-5">
                <p className="text-xs uppercase tracking-[0.26em] text-champagne">Email</p>
                <p className="mt-2 text-lg text-ink">{contact.email}</p>
              </div>
            </div>
          </div>
          <div className="glass-panel p-5 md:p-8 lg:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-rosegold">Selected Notes</p>
            <div className="mt-5 space-y-5">
              {[
                "燕禮的珍貴，不只在內容本身，也在它被遞出的那一刻是否足夠從容。",
                "好的送禮從不喧嘩，它只是讓人一眼就知道，你真的有把這份心意放在心上。",
                "從包裝、光澤、份量，到入口後的節奏與尾韻，細節總會替品牌說話。"
              ].map((line) => (
                <div key={line} className="border-b border-champagne/12 pb-5 text-sm leading-8 text-ink/60 last:border-none last:pb-0">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
