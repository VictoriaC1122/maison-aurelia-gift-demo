import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Gift,
  Headphones,
  PackageCheck,
  Sparkles,
  Truck
} from "lucide-react";
import { AutoImageRotator } from "@/components/auto-image-rotator";
import { FadeIn } from "@/components/motion";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { TrustBadges } from "@/components/trust-badges";
import {
  contact,
  getCategory,
  getFactoryCaption,
  getFaqs,
  getFeaturedProducts,
  getProductsByCategory,
  productContent,
  productName,
  site
} from "@/lib/content";
import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { displaySpecification } from "@/lib/pricing";
import { absoluteSiteUrl, buildMetadata, localeUrl } from "@/lib/seo";
import { cn, withBasePath } from "@/lib/utils";

export function homeMetadata(locale: Locale) {
  const t = getMessages(locale).home;
  return buildMetadata({ title: t.metaTitle, description: t.metaDescription, path: "/", locale });
}

export function HomeView({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const t = messages.home;
  const href = (path: string) => localePath(locale, path);
  const faqs = getFaqs(locale);
  const featured = getFeaturedProducts();
  const signatureProduct = featured[0];
  const essentialCategory = getCategory("benyang");
  const reserveCategory = getCategory("shenyang");
  const essentialImages = getProductsByCategory("benyang").flatMap((product) => product.images);
  const reserveImages = getProductsByCategory("shenyang").flatMap((product) => product.images);
  const occasionMeta = [
    { href: "/products?category=benyang", images: [essentialCategory?.coverImage ?? "", ...essentialImages], icon: Sparkles },
    { href: "/products?category=shenyang", images: [reserveCategory?.coverImage ?? "", ...reserveImages], icon: Gift },
    { href: "/custom", images: productContent.factoryGallery, icon: Building2 }
  ];
  const occasions = t.occasions.map((text, index) => ({ ...text, ...occasionMeta[index] }));
  const serviceIcons = [PackageCheck, Truck, Headphones];
  const servicePoints = t.servicePoints.map((text, index) => ({ ...text, icon: serviceIcons[index] }));
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
    <main id="main-content" className="relative pb-8 md:pb-16">
      <StructuredData data={homeSchema} />

      <aside className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 2xl:block">
        <div className="editorial-note flex flex-col items-center gap-5 px-4 py-6">
          <span className="text-[11px] uppercase tracking-[0.32em] text-champagne [writing-mode:vertical-rl]">
            {t.asideLabel}
          </span>
          <div className="h-16 w-px bg-champagne/30" />
          <a
            href={`https://line.me/R/ti/p/~${contact.line}`}
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

      <section className="home-hero shell grid items-center gap-7 py-5 md:gap-9 md:py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10 xl:gap-14">
        <FadeIn className="home-hero__copy min-w-0 space-y-5 md:space-y-6">
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.28em] text-champagne md:text-xs md:tracking-[0.38em]">
              {t.heroEyebrow}
            </p>
            <h1 className="home-hero__title font-display text-ink">
              {t.heroTitle.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </h1>
            <p className="home-hero__body max-w-[35rem] text-[0.98rem] leading-7 text-ink/66 md:text-lg md:leading-8">
              {t.heroBody}
            </p>
          </div>
          <div className="home-hero__actions flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link href={href("/products")} className="hero-button-dark min-h-[52px] justify-center px-8">
              {t.shop}
            </Link>
            <Link href="#gift-guide" className="home-hero__text-link inline-flex min-h-[48px] items-center justify-center gap-2 px-2 text-sm text-ink/70 transition hover:text-ink">
              {t.byOccasion}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="home-hero__assurance flex items-start gap-3 border-t border-champagne/18 pt-4 text-sm leading-6 text-ink/56">
            <PackageCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-champagne" />
            <span>{t.assurance}</span>
          </div>
        </FadeIn>

        <FadeIn delay={0.08} className="home-hero__mood relative min-w-0 overflow-hidden rounded-[1.8rem] border border-white/55 bg-white/55 shadow-[0_24px_58px_rgba(37,26,19,0.12)]">
          <AutoImageRotator
            images={signatureProduct?.images ?? featured.flatMap((product) => product.images)}
            alt={signatureProduct ? productName(signatureProduct, locale) : t.heroImageAlt}
            priority
            intervalMs={5600}
            className="absolute inset-0"
            imageClassName="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1279px) 52vw, 620px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(24,16,12,0.36)] via-transparent to-transparent" />
          {signatureProduct ? (
            <Link
              href={href(`/products/${signatureProduct.slug}`)}
              className="absolute inset-x-4 bottom-4 z-10 grid gap-2 rounded-[1.25rem] border border-white/45 bg-[rgba(252,248,242,0.84)] p-4 backdrop-blur-xl transition hover:bg-[rgba(252,248,242,0.94)] md:inset-x-5 md:bottom-5 md:grid-cols-[1fr_auto] md:items-end md:gap-5 md:p-5"
            >
              <span>
                <span className="block text-[10px] uppercase tracking-[0.26em] text-champagne">{t.signatureEyebrow}</span>
                <strong className="mt-2 block font-display text-xl font-medium leading-tight text-ink md:text-2xl">
                  {productName(signatureProduct, locale)}
                </strong>
                <span className="mt-1 block text-sm text-ink/58">
                  {displaySpecification(signatureProduct.specification, locale)}
                </span>
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-ink/70">
                {messages.common.viewProduct} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </Link>
          ) : null}
        </FadeIn>
      </section>

      <section className="shell pb-4 md:pb-6">
        <TrustBadges locale={locale} />
      </section>

      <section id="gift-guide" className="shell scroll-mt-32 space-y-7 py-10 md:space-y-9 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-end">
          <SectionHeading
            eyebrow={t.guideEyebrow}
            title={t.guideTitle}
            description={t.guideDescription}
          />
          <div className="service-rail grid gap-3 sm:grid-cols-3">
            {servicePoints.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="service-rail__item flex items-start gap-3 border-l border-champagne/22 pl-4">
                  <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-champagne" />
                  <div>
                    <p className="text-sm text-ink">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-ink/50">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="occasion-grid flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0">
          {occasions.map((occasion, index) => {
            const Icon = occasion.icon;
            return (
              <FadeIn key={occasion.title} delay={index * 0.06} className="occasion-slide">
                <Link href={href(occasion.href)} className="occasion-card group block h-full overflow-hidden rounded-[1.65rem] border border-champagne/14 bg-[rgba(255,253,249,0.82)]">
                  <div className="relative aspect-[5/3] overflow-hidden">
                    <AutoImageRotator
                      images={occasion.images}
                      alt={occasion.title}
                      intervalMs={6200 + index * 850}
                      className="absolute inset-0 transition duration-700 group-hover:scale-[1.025]"
                      imageClassName="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-pearl/78 text-ink backdrop-blur-md">
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="p-5 md:p-6">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-champagne">{occasion.eyebrow}</p>
                    <h2 className="mt-2 font-display text-[1.75rem] leading-tight text-ink md:text-[2rem]">{occasion.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-ink/58">{occasion.description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm text-ink/72">
                      {occasion.cta} <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </section>

      <section className="home-shop shell space-y-8 py-10 md:py-14">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow={t.bestEyebrow}
            title={t.bestTitle}
            description={t.bestDescription}
          />
          <Link
            href={href("/products")}
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full border border-champagne/28 bg-white/55 px-6 text-sm text-ink transition hover:bg-white/82 active:scale-[0.99]"
          >
            {messages.common.viewAllProducts}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, index) => (
            <FadeIn key={product.slug} delay={index * 0.07}>
              <ProductCard product={product} locale={locale} />
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="home-provenance shell py-10 md:py-14">
        <div className="overflow-hidden rounded-[2rem] bg-ink text-pearl shadow-[0_28px_70px_rgba(25,17,12,0.18)] md:rounded-[2.5rem]">
          <div className="grid gap-8 p-6 md:p-9 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12 lg:p-12">
            <div className="flex min-w-0 flex-col justify-between gap-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.34em] text-champagne">{t.originEyebrow}</p>
                <h2
                  className={cn(
                    "mt-4 font-display leading-[1.16] text-pearl",
                    locale === "en" ? "max-w-[16ch] text-[2.1rem] md:text-[2.7rem] lg:text-[3rem]" : "max-w-[10ch] text-[2.4rem] md:text-[3.25rem] lg:text-[3.6rem]"
                  )}
                >
                  {t.originTitle}
                </h2>
                <p className="mt-5 max-w-lg text-[0.96rem] leading-8 text-pearl/62 md:text-base">
                  {t.originText}
                </p>
              </div>
              <Link href={href("/collections/factory")} className="inline-flex min-h-[48px] w-fit items-center gap-2 rounded-full border border-pearl/24 px-5 text-sm text-pearl transition hover:bg-pearl/10">
                {t.originCta} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>

            <div className="origin-story-grid grid grid-cols-2 gap-3 md:gap-4">
              {productContent.factoryGallery.slice(0, 4).map((image, index) => (
                <div
                  key={image}
                  className={index === 0 ? "relative col-span-2 aspect-[16/8] overflow-hidden rounded-[1.4rem]" : "relative aspect-[4/3] overflow-hidden rounded-[1.4rem]"}
                >
                  <Image
                    src={withBasePath(image)}
                    alt={getFactoryCaption(image, index, locale)}
                    fill
                    sizes={index === 0 ? "(max-width: 1024px) 100vw, 620px" : "(max-width: 1024px) 50vw, 300px"}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="grid border-t border-pearl/10 sm:grid-cols-3">
            {t.originSteps.map((item, index) => (
              <div key={item} className="flex items-center gap-3 border-b border-pearl/10 px-6 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 md:px-8">
                <span className="text-xs tracking-[0.2em] text-champagne">0{index + 1}</span>
                <span className="text-sm text-pearl/72">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-film shell py-10 md:py-14">
        <FadeIn className="home-film__panel grid min-w-0 gap-6 overflow-hidden rounded-[1.8rem] border border-champagne/12 bg-[rgba(255,253,249,0.76)] p-5 md:gap-8 md:p-8 lg:grid-cols-[minmax(240px,0.62fr)_minmax(0,1.38fr)] lg:items-center lg:p-10">
          <div className="home-film__copy min-w-0 space-y-4 lg:pr-4">
            <p className="text-[11px] uppercase tracking-[0.32em] text-champagne">{t.filmEyebrow}</p>
            <h2 className="font-display text-ink">{t.filmTitle}</h2>
            <p className="max-w-md text-[0.96rem] leading-7 text-ink/60 md:text-base md:leading-8">
              {t.filmText}
            </p>
          </div>
          <div className="home-film__video min-w-0 overflow-hidden rounded-[1.45rem] bg-[#120f0d] p-2 shadow-[0_18px_42px_rgba(29,19,12,0.14)] md:rounded-[1.7rem] md:p-3">
            <video
              controls
              playsInline
              preload="metadata"
              poster={withBasePath(signatureProduct?.images[0] ?? "/assets/categories/benyang/S__75194507_0.webp")}
              className="aspect-video w-full rounded-[1.05rem] bg-black object-contain md:rounded-[1.3rem]"
              aria-label={t.filmLabel}
            >
              <source src={withBasePath("/assets/video/hero-film.mp4")} type="video/mp4" />
            </video>
          </div>
        </FadeIn>
      </section>

      <section className="shell py-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="paper-panel p-6 md:p-9 lg:p-10">
            <p className="text-[11px] uppercase tracking-[0.32em] text-champagne">{t.conciergeEyebrow}</p>
            <h2
              className={cn(
                "mt-4 font-display leading-[1.18] text-ink",
                locale === "en" ? "max-w-[20ch] text-[2.1rem] md:text-[2.7rem]" : "max-w-[15ch] text-[2.3rem] md:text-[3.2rem]"
              )}
            >
              {t.conciergeTitle}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-ink/60">
              {t.conciergeText}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={`https://line.me/R/ti/p/~${contact.line}`} className="hero-button-dark min-h-[52px] justify-center px-7">
                {t.conciergeLine}
              </a>
              <Link href={href("/custom")} className="hero-button-light min-h-[52px] justify-center px-7">
                {t.conciergeCorporate}
              </Link>
            </div>
            <div className="mt-8 grid gap-3 border-t border-champagne/15 pt-6 sm:grid-cols-2">
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="contact-mini-row rounded-[1.15rem] border border-champagne/12 bg-white/55 p-4 transition hover:bg-white/80">
                <span className="block text-[10px] uppercase tracking-[0.24em] text-champagne">{t.phone}</span>
                <span className="mt-2 block text-base text-ink">{contact.phone}</span>
              </a>
              <a href={`mailto:${contact.email}`} className="contact-mini-row min-w-0 rounded-[1.15rem] border border-champagne/12 bg-white/55 p-4 transition hover:bg-white/80">
                <span className="block text-[10px] uppercase tracking-[0.24em] text-champagne">{t.email}</span>
                <span className="mt-2 block break-all text-sm text-ink">{contact.email}</span>
              </a>
            </div>
          </div>

          <div className="paper-panel p-6 md:p-9 lg:p-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-champagne">{t.faqEyebrow}</p>
                <h2 className="mt-4 font-display text-[2rem] leading-tight text-ink md:text-[2.6rem]">{t.faqTitle}</h2>
              </div>
              <Link href={href("/faq")} className="hidden min-h-[44px] shrink-0 items-center gap-2 whitespace-nowrap text-sm text-ink/60 hover:text-ink sm:inline-flex">
                {t.faqAll} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 divide-y divide-champagne/14 border-y border-champagne/14">
              {faqs.slice(0, 3).map((faq, index) => (
                <details key={faq.question} className="group py-1">
                  <summary className="faq-summary flex cursor-pointer list-none items-center gap-4 py-4 text-base text-ink">
                    <span className="text-[10px] tracking-[0.2em] text-champagne">0{index + 1}</span>
                    <span className="flex-1">{faq.question}</span>
                    <span aria-hidden="true" className="text-xl font-light text-ink/42 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="pb-5 pl-9 pr-3 text-sm leading-7 text-ink/58">{faq.answer}</p>
                </details>
              ))}
            </div>
            <Link href={href("/faq")} className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm text-ink/62 hover:text-ink sm:hidden">
              {t.faqAllMobile} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
