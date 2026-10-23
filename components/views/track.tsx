import { OrderTracker } from "@/components/order-tracker";
import { getMessages, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export function trackMetadata(locale: Locale) {
  const t = getMessages(locale).track;
  return buildMetadata({ title: t.metaTitle, description: t.metaDescription, path: "/track", noIndex: true, locale });
}

export function TrackView({ locale }: { locale: Locale }) {
  const t = getMessages(locale).track;
  return (
    <main id="main-content" className="shell space-y-6 py-8 md:py-12">
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.32em] text-champagne">{t.eyebrow}</p>
        <h1 className="font-display text-[2.2rem] leading-tight text-ink md:text-[2.8rem]">{t.title}</h1>
        <p className="text-sm leading-7 text-ink/60">{t.description}</p>
      </div>
      <OrderTracker />
    </main>
  );
}
