import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Gift, MapPin, MessageCircleMore, ScrollText } from "lucide-react";
import { AutoImageRotator } from "@/components/auto-image-rotator";
import { FadeIn } from "@/components/motion";
import { Phrases } from "@/components/phrases";
import { SectionHeading } from "@/components/section-heading";
import {
  categoryAltName,
  categoryDescription,
  categoryName,
  contact,
  getCategory,
  getFactoryCaption,
  getFeaturedProducts,
  productContent
} from "@/lib/content";
import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { withBasePath } from "@/lib/utils";

const PROMISE_ICONS = [MapPin, ScrollText, Gift];

export function aboutMetadata(locale: Locale) {
  const t = getMessages(locale).about;
  return buildMetadata({ title: t.metaTitle, description: t.metaDescription, path: "/about", locale });
}

export function AboutView({ locale }: { locale: Locale }) {
  const t = getMessages(locale).about;
  const href = (path: string) => localePath(locale, path);
  const featured = getFeaturedProducts();
  const collections = ["riyang", "shenyang", "benyang"].map((slug) => getCategory(slug)).filter((category) => category !== undefined);
  // 築巢 → 採收 → 整理
  const originImages = [6, 7, 1].map((index) => productContent.factoryGallery[index]).filter(Boolean);

  return (
    <main id="main-content" className="space-y-16 pb-6 pt-10 md:space-y-24 md:pt-16">
      {/* 品牌介紹 */}
      <section className="shell space-y-10">
        <SectionHeading as="h1" eyebrow={t.eyebrow} title={t.title} description={t.description} />
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <FadeIn className="glass-panel flex flex-col justify-center gap-8 p-6 md:p-10 lg:p-12">
            <p className="text-pretty text-base leading-8 text-ink/72 md:text-lg md:leading-9">{t.body}</p>
            <div className="flex items-center gap-4">
              <span className="gold-rule" aria-hidden="true" />
              <p className="eyebrow">{t.slogan}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.08} className="glass-panel relative min-h-[320px] overflow-hidden md:min-h-[440px]">
            <AutoImageRotator
              images={featured.flatMap((product) => product.images)}
              alt={t.imageAlt}
              priority
              intervalMs={5200}
              className="absolute inset-0"
              imageClassName="object-cover"
              sizes="(max-width: 1024px) 100vw, 560px"
            />
            <div className="absolute inset-0 z-[3] bg-gradient-to-t from-[rgba(27,20,15,0.3)] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 z-[4] rounded-[1.3rem] border border-white/35 bg-[rgba(255,250,245,0.78)] p-4 backdrop-blur-xl md:bottom-6 md:left-6 md:right-6 md:p-5">
              <p className="eyebrow">{t.promiseEyebrow}</p>
              <p className="mt-2 text-sm leading-7 text-ink/75">{t.promiseText}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 三個承諾 */}
      <section className="shell space-y-8">
        <SectionHeading eyebrow={t.promisesEyebrow} title={t.promisesTitle} />
        <ul className="grid gap-4 md:grid-cols-3 md:gap-5">
          {t.promises.map((promise, index) => {
            const Icon = PROMISE_ICONS[index];
            return (
              <FadeIn key={promise.title} as="li" delay={index * 0.08} className="paper-panel flex h-full flex-col gap-4 p-6 md:p-7">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-champagne/14 text-gold">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span className="font-display text-sm tracking-[0.2em] text-gold">0{index + 1}</span>
                  </div>
                  <h3 className="font-display text-[1.45rem] leading-tight text-ink">{promise.title}</h3>
                  <p className="text-sm leading-7 text-ink/65">{promise.text}</p>
              </FadeIn>
            );
          })}
        </ul>
      </section>

      {/* 燕序系列 */}
      <section className="shell space-y-8">
        <SectionHeading eyebrow={t.collectionsEyebrow} title={t.collectionsTitle} />
        <div className="grid gap-5 md:grid-cols-3">
          {collections.map((category, index) => (
            <FadeIn key={category.slug} delay={index * 0.08}>
              <Link
                href={href(`/products?category=${category.slug}`)}
                className="collection-card group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-champagne/14 bg-[rgba(255,253,249,0.88)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={withBasePath(category.coverImage)}
                    alt={categoryName(category, locale)}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between gap-6 p-6">
                  <div className="space-y-2">
                    <p className="eyebrow !text-[10px]">{categoryAltName(category, locale)}</p>
                    <h3 className="font-display text-[1.7rem] leading-tight text-ink">{categoryName(category, locale)}</h3>
                    <p className="text-sm leading-7 text-ink/65">{categoryDescription(category, locale)}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm text-ink/75">
                    {t.collectionsCta}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 產地 */}
      <section className="shell">
        <div className="grid gap-8 overflow-hidden rounded-[1.8rem] bg-ink p-6 text-pearl md:rounded-[2.4rem] md:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-12 lg:p-12">
          <div className="space-y-5">
            <p className="eyebrow-on-dark">{t.originEyebrow}</p>
            <h2 className="balance-title font-display text-[2.1rem] leading-tight md:text-[2.7rem]">
              <Phrases text={t.originTitle} />
            </h2>
            <p className="text-pretty text-[0.97rem] leading-8 text-pearl/70">{t.originText}</p>
            <Link
              href={href("/collections/factory")}
              className="inline-flex min-h-[48px] w-fit items-center gap-2 rounded-full border border-pearl/25 px-5 text-sm text-pearl transition hover:bg-pearl/10"
            >
              {t.originCta} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {originImages.map((image, index) => (
              <figure key={image} className="space-y-2">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[1rem] md:rounded-[1.3rem]">
                  <Image
                    src={withBasePath(image)}
                    alt={getFactoryCaption(image, index, locale)}
                    fill
                    sizes="(max-width: 1024px) 33vw, 220px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="hidden text-xs leading-5 text-pearl/60 md:block">{getFactoryCaption(image, index, locale)}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 行動呼籲 */}
      <section className="shell">
        <FadeIn className="paper-panel flex flex-col items-start gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="space-y-2">
            <h2 className="font-display text-[1.8rem] leading-tight text-ink md:text-[2.2rem]">{t.ctaTitle}</h2>
            <p className="text-sm leading-7 text-ink/65 md:text-base">{t.ctaText}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={`https://line.me/R/ti/p/~${contact.line}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-button-dark min-h-[52px] justify-center gap-2 px-7"
            >
              <MessageCircleMore aria-hidden="true" className="h-4 w-4" />
              {t.ctaLine}
            </a>
            <Link href={href("/products")} className="hero-button-light min-h-[52px] justify-center px-7">
              {t.ctaShop}
            </Link>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
