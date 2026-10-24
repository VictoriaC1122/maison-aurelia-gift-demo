import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2, Gift, Headphones, MessageCircleMore, PackageCheck, Sparkles, Truck } from "lucide-react";
import { HeroShowcase, type HeroSlide } from "@/components/hero-showcase";
import { FadeIn } from "@/components/motion";
import { Phrases } from "@/components/phrases";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { TrustBadges } from "@/components/trust-badges";
import {
  contact,
  getFactoryCaption,
  getFaqs,
  getFeaturedProducts,
  getProduct,
  productContent,
  productName,
  site
} from "@/lib/content";
import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { displaySpecification } from "@/lib/pricing";
import { absoluteSiteUrl, buildMetadata, localeUrl } from "@/lib/seo";
import { cn, formatCurrency, withBasePath } from "@/lib/utils";

export function homeMetadata(locale: Locale) {
  const t = getMessages(locale).home;
  return buildMetadata({ title: t.metaTitle, description: t.metaDescription, path: "/", locale });
}

const OCCASION_LINKS = [
  { href: "/products?category=riyang", icon: Sparkles },
  { href: "/products?category=shenyang", icon: Gift },
  { href: "/custom", icon: Building2 }
];

export function HomeView({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const t = messages.home;
  const href = (path: string) => localePath(locale, path);
  const lineUrl = `https://line.me/R/ti/p/~${contact.line}`;
  const faqs = getFaqs(locale);
  const featured = getFeaturedProducts();

  const heroSlides: HeroSlide[] = (site.heroSlides ?? featured.map((product) => ({ product: product.slug, image: product.images[0] })))
    .map((slide) => {
      const product = getProduct(slide.product);
      if (!product) return null;
      return {
        image: slide.image,
        name: productName(product, locale),
        // 有售價時顯示價格（與規格），否則顯示規格說明
        spec: product.price
          ? [formatCurrency(product.price, product.priceFrom, locale), product.specification && product.specification !== "待補" ? product.specification : null]
              .filter(Boolean)
              .join(" · ")
          : displaySpecification(product.specification, locale),
        href: href(`/products/${product.slug}`)
      };
    })
    .filter((slide): slide is HeroSlide => slide !== null);

  const occasionImages = site.occasionImages ?? productContent.factoryGallery;
  const occasions = t.occasions.map((text, index) => ({
    ...text,
    ...OCCASION_LINKS[index],
    image: occasionImages[index] ?? productContent.factoryGallery[index]
  }));
  const serviceIcons = [PackageCheck, Truck, Headphones];
  const servicePoints = t.servicePoints.map((text, index) => ({ ...text, icon: serviceIcons[index] }));
  const originImages = site.originImages ?? productContent.factoryGallery.slice(0, 3);

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t.metaTitle,
    description: t.metaDescription,
    url: localeUrl(locale, "/"),
    inLanguage: messages.htmlLang,
    primaryImageOfPage: absoluteSiteUrl(site.ogImage),
    mainEntity: featured.map((product) => ({
      "@type": "Product",
      name: productName(product, locale),
      url: localeUrl(locale, `/products/${product.slug}`)
    }))
  };

  return (
    <main id="main-content" className="relative pb-10 md:pb-16">
      <StructuredData data={homeSchema} />

      {/* 大螢幕右側的顧問聯絡 */}
      <aside className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 2xl:block">
        <div className="editorial-note flex flex-col items-center gap-5 px-4 py-6">
          <span className="eyebrow [writing-mode:vertical-rl]">{t.asideLabel}</span>
          <div className="h-16 w-px bg-champagne/30" />
          <a
            href={lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-champagne/30 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-ink transition hover:bg-white/70"
          >
            LINE
          </a>
          <Link
            href={href("/contact")}
            className="rounded-full border border-champagne/30 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-ink transition hover:bg-white/70"
          >
            {t.asideContact}
          </Link>
        </div>
      </aside>

      {/* 主視覺 */}
      <section className="shell grid items-center gap-6 pb-8 pt-4 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-10 md:pb-10 md:pt-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:gap-14">
        <div className="order-2 min-w-0 space-y-5 md:order-1 md:space-y-7 md:pr-2">
          <div className="space-y-4 md:space-y-5">
            <p className="eyebrow">{t.heroEyebrow}</p>
            <h1 className="home-hero__title font-display text-ink">
              {t.heroTitle.map((line) => (
                <span key={line} className="block">
                  <Phrases text={line} />
                </span>
              ))}
            </h1>
            <p className="home-hero__body max-w-[35rem] text-[0.98rem] leading-7 text-ink/65 md:text-lg md:leading-8">{t.heroBody}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <Link href={href("/products")} className="hero-button-dark min-h-[52px] justify-center px-8">
              {t.shop}
            </Link>
            <Link href="#gift-guide" className="hero-button-light min-h-[52px] justify-center gap-2 px-6">
              {t.byOccasion}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="home-hero__assurance flex items-start gap-3 border-t border-champagne/20 pt-4 text-sm leading-6 text-ink/60">
            <PackageCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <span>{t.assurance}</span>
          </div>
        </div>

        <div className="home-hero__stage relative order-1 min-w-0 overflow-hidden rounded-[1.6rem] border border-white/55 bg-white/55 shadow-[0_24px_58px_rgba(37,26,19,0.12)] md:order-2 md:rounded-[1.9rem]">
          <HeroShowcase slides={heroSlides} eyebrow={t.signatureEyebrow} viewLabel={messages.common.viewProduct} />
        </div>
      </section>

      <section className="shell pb-4 md:pb-6">
        <TrustBadges locale={locale} />
      </section>

      {/* 品牌理念 */}
      <section className="shell py-14 md:py-24">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{t.statementEyebrow}</p>
          <div aria-hidden="true" className="mt-6 flex items-center justify-center gap-3">
            <span className="gold-rule" />
            <span className="h-1.5 w-1.5 rotate-45 bg-champagne/80" />
            <span className="gold-rule" />
          </div>
          <blockquote className="statement-quote balance-title mt-7 font-display text-ink">
            {t.statementQuote.map((line) => (
              <span key={line} className="block">
                <Phrases text={line} />
              </span>
            ))}
          </blockquote>
          <p className="text-pretty mx-auto mt-6 max-w-xl text-[0.97rem] leading-8 text-ink/65">{t.statementBody}</p>
          <Link href={href("/about")} className="text-link mt-7 inline-flex items-center gap-2 text-sm text-ink/75">
            {t.statementCta}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </FadeIn>
      </section>

      {/* 依送禮情境挑選 */}
      <section id="gift-guide" className="shell scroll-mt-28 space-y-8 py-10 md:space-y-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-end">
          <SectionHeading eyebrow={t.guideEyebrow} title={t.guideTitle} description={t.guideDescription} />
          <ul className="hidden gap-3 sm:grid sm:grid-cols-3">
            {servicePoints.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="flex items-start gap-3 border-l border-champagne/25 pl-4">
                  <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <div>
                    <p className="text-sm text-ink">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-ink/60">{item.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="occasion-grid flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0">
          {occasions.map((occasion, index) => {
            const Icon = occasion.icon;
            return (
              <FadeIn key={occasion.title} delay={index * 0.08} className="occasion-slide min-w-0">
                <Link
                  href={href(occasion.href)}
                  className="occasion-card group block h-full overflow-hidden rounded-[1.65rem] border border-champagne/14 bg-[rgba(255,253,249,0.86)]"
                >
                  <div className="relative aspect-[5/3.4] overflow-hidden">
                    <Image
                      src={withBasePath(occasion.image)}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 80vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-pearl/80 text-ink backdrop-blur-md">
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="p-5 md:p-6">
                    <p className="eyebrow !text-[10px]">{occasion.eyebrow}</p>
                    <h3 className="mt-2 font-display text-[1.7rem] leading-tight text-ink md:text-[1.95rem]">{occasion.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-ink/60">{occasion.description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm text-ink/75">
                      {occasion.cta}
                      <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* 熱銷商品 */}
      <section className="shell space-y-8 py-10 md:py-14">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow={t.bestEyebrow} title={t.bestTitle} description={t.bestDescription} />
          <Link href={href("/products")} className="hero-button-light min-h-[48px] shrink-0 justify-center gap-2 px-6">
            {messages.common.viewAllProducts}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {featured.map((product, index) => (
            <FadeIn key={product.slug} delay={index * 0.08}>
              <ProductCard product={product} locale={locale} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 產地與工序 */}
      <section className="shell py-10 md:py-14">
        <div className="overflow-hidden rounded-[1.8rem] bg-ink text-pearl shadow-[0_28px_70px_rgba(25,17,12,0.18)] md:rounded-[2.5rem]">
          <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12 lg:p-12">
            <div className="flex min-w-0 flex-col gap-7">
              <div>
                <p className="eyebrow-on-dark">{t.originEyebrow}</p>
                <h2
                  className={cn(
                    "balance-title mt-4 font-display leading-[1.18] text-pearl",
                    locale === "en" ? "max-w-[16ch] text-[2.1rem] md:text-[2.7rem]" : "max-w-[11.5em] text-[2.1rem] md:text-[2.35rem] xl:text-[2.5rem]"
                  )}
                >
                  <Phrases text={t.originTitle} />
                </h2>
                <p className="text-pretty mt-5 max-w-lg text-[0.96rem] leading-8 text-pearl/70 md:text-base">{t.originText}</p>
              </div>
              <ol className="space-y-0 border-t border-pearl/12">
                {t.originSteps.map((item, index) => (
                  <li key={item} className="flex items-center gap-4 border-b border-pearl/12 py-3.5">
                    <span className="font-display text-sm tracking-[0.18em] text-champagne">0{index + 1}</span>
                    <span className="text-sm text-pearl/80">{item}</span>
                  </li>
                ))}
              </ol>
              <Link
                href={href("/collections/factory")}
                className="inline-flex min-h-[48px] w-fit items-center gap-2 rounded-full border border-pearl/25 px-5 text-sm text-pearl transition hover:bg-pearl/10"
              >
                {t.originCta} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {originImages.map((image, index) => (
                <div
                  key={image}
                  className={cn(
                    "relative overflow-hidden rounded-[1.1rem] md:rounded-[1.4rem]",
                    index === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/3.4]"
                  )}
                >
                  <Image
                    src={withBasePath(image)}
                    alt={getFactoryCaption(image, index, locale)}
                    fill
                    sizes={index === 0 ? "(max-width: 1024px) 100vw, 640px" : "(max-width: 1024px) 50vw, 320px"}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 品牌影片 */}
      <section className="shell py-10 md:py-14">
        <FadeIn className="grid min-w-0 gap-6 overflow-hidden rounded-[1.8rem] border border-champagne/12 bg-gradient-to-b from-[rgba(255,253,249,0.86)] to-[rgba(245,238,229,0.8)] p-5 md:gap-8 md:p-8 lg:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)] lg:items-center lg:p-10">
          <div className="min-w-0 space-y-4 lg:pr-4">
            <p className="eyebrow">{t.filmEyebrow}</p>
            <h2 className="home-film__title balance-title font-display text-ink">
              <Phrases text={t.filmTitle} />
            </h2>
            <p className="max-w-md text-[0.96rem] leading-7 text-ink/60 md:text-base md:leading-8">{t.filmText}</p>
          </div>
          <div className="min-w-0 overflow-hidden rounded-[1.45rem] bg-[#120f0d] p-2 shadow-[0_18px_42px_rgba(29,19,12,0.14)] md:rounded-[1.7rem] md:p-3">
            <video
              controls
              playsInline
              preload="none"
              poster={withBasePath("/assets/video/hero-film-poster.webp")}
              className="aspect-[65/36] w-full rounded-[1.05rem] bg-black object-cover md:rounded-[1.3rem]"
              aria-label={t.filmLabel}
            >
              <source src={withBasePath("/assets/video/hero-film.mp4")} type="video/mp4" />
            </video>
          </div>
        </FadeIn>
      </section>

      {/* 專屬顧問與常見問題 */}
      <section className="shell py-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="paper-panel p-6 md:p-9 lg:p-10">
            <p className="eyebrow">{t.conciergeEyebrow}</p>
            <h2
              className={cn(
                "balance-title mt-4 font-display leading-[1.2] text-ink",
                locale === "en" ? "max-w-[20ch] text-[2.1rem] md:text-[2.7rem]" : "max-w-[14em] text-[2.1rem] md:text-[2.8rem]"
              )}
            >
              <Phrases text={t.conciergeTitle} />
            </h2>
            <p className="text-pretty mt-5 max-w-xl text-base leading-8 text-ink/60">{t.conciergeText}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="hero-button-dark min-h-[52px] justify-center gap-2 px-7">
                <MessageCircleMore aria-hidden="true" className="h-4 w-4" />
                {t.conciergeLine}
              </a>
              <Link href={href("/custom")} className="hero-button-light min-h-[52px] justify-center px-7">
                {t.conciergeCorporate}
              </Link>
            </div>
            <div className="mt-8 grid gap-3 border-t border-champagne/15 pt-6 sm:grid-cols-2">
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="rounded-[1.15rem] border border-champagne/14 bg-white/55 p-4 transition hover:bg-white/85"
              >
                <span className="eyebrow block !text-[10px]">{t.phone}</span>
                <span className="mt-2 block text-base text-ink">{contact.phone}</span>
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="min-w-0 rounded-[1.15rem] border border-champagne/14 bg-white/55 p-4 transition hover:bg-white/85"
              >
                <span className="eyebrow block !text-[10px]">{t.email}</span>
                <span className="mt-2 block break-all text-sm text-ink">{contact.email}</span>
              </a>
            </div>
          </div>

          <div className="paper-panel flex flex-col p-6 md:p-9 lg:p-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">{t.faqEyebrow}</p>
                <h2 className="mt-4 font-display text-[2rem] leading-tight text-ink md:text-[2.5rem]">{t.faqTitle}</h2>
              </div>
              <Link
                href={href("/faq")}
                className="hidden min-h-[44px] shrink-0 items-center gap-2 whitespace-nowrap text-sm text-ink/60 transition hover:text-ink sm:inline-flex"
              >
                {t.faqAll} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 divide-y divide-champagne/14 border-y border-champagne/14">
              {faqs.slice(0, 4).map((faq, index) => (
                <details key={faq.question} className="group py-1">
                  <summary className="faq-summary flex cursor-pointer list-none items-center gap-4 py-4 text-base text-ink">
                    <span className="font-display text-xs tracking-[0.2em] text-gold">0{index + 1}</span>
                    <span className="flex-1">{faq.question}</span>
                    <span aria-hidden="true" className="text-xl font-light text-ink/45 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="pb-5 pl-9 pr-3 text-sm leading-7 text-ink/65">{faq.answer}</p>
                </details>
              ))}
            </div>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
              <p className="text-sm text-ink/60">{t.faqMore}</p>
              <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-2 text-sm text-ink/80">
                <MessageCircleMore aria-hidden="true" className="h-4 w-4" />
                {t.faqMoreLine}
              </a>
            </div>
            <Link href={href("/faq")} className="mt-4 inline-flex min-h-[44px] items-center gap-2 text-sm text-ink/65 hover:text-ink sm:hidden">
              {t.faqAllMobile} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
