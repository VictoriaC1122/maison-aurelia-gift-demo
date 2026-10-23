import { AutoImageRotator } from "@/components/auto-image-rotator";
import { FadeIn } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { getFeaturedProducts } from "@/lib/content";
import { getMessages, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export function aboutMetadata(locale: Locale) {
  const t = getMessages(locale).about;
  return buildMetadata({ title: t.metaTitle, description: t.metaDescription, path: "/about", locale });
}

export function AboutView({ locale }: { locale: Locale }) {
  const t = getMessages(locale).about;
  const featured = getFeaturedProducts();

  return (
    <main id="main-content" className="shell space-y-10 py-10 md:py-16">
      <SectionHeading as="h1" eyebrow={t.eyebrow} title={t.title} description={t.description} />
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <FadeIn className="glass-panel p-5 md:p-8">
          <p className="text-base leading-8 text-ink/70 md:text-lg md:leading-9">{t.body}</p>
          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-champagne">{t.slogan}</p>
        </FadeIn>
        <FadeIn delay={0.08} className="glass-panel relative min-h-[300px] overflow-hidden md:min-h-[420px]">
          <AutoImageRotator
            images={featured.flatMap((product) => product.images)}
            alt={t.imageAlt}
            priority
            intervalMs={5200}
            className="absolute inset-0"
            imageClassName="object-cover"
            sizes="(max-width: 1024px) 100vw, 520px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(27,20,15,0.3)] via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 z-10 rounded-[1.45rem] border border-white/35 bg-[rgba(255,250,245,0.7)] p-4 backdrop-blur-xl md:bottom-6 md:left-6 md:right-6 md:rounded-[1.6rem] md:p-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne">{t.promiseEyebrow}</p>
            <p className="mt-2 text-sm leading-7 text-ink/75">{t.promiseText}</p>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
