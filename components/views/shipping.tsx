import Link from "next/link";
import { Building2, Store, Truck } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/content";
import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { formatTWD } from "@/lib/pricing";
import { buildMetadata } from "@/lib/seo";

const NOTE_LINKS = ["/track", "", "/returns"];

export function shippingMetadata(locale: Locale) {
  const t = getMessages(locale).shipping;
  return buildMetadata({ title: t.metaTitle, description: t.metaDescription, path: "/shipping", locale });
}

export function ShippingView({ locale }: { locale: Locale }) {
  const t = getMessages(locale).shipping;
  const policy = site.shippingPolicy;
  const cards = [
    { icon: Truck, title: t.home.title, fee: formatTWD(policy.standardShippingFee), text: t.home.text },
    { icon: Store, title: t.pickup.title, fee: policy.cvsShippingFee ? formatTWD(policy.cvsShippingFee) : t.byStore, text: t.pickup.text },
    { icon: Building2, title: t.corporate.title, fee: t.quote, text: locale === "zh" ? policy.customNotes || t.corporate.text : t.corporate.text }
  ];

  return (
    <main id="main-content" className="shell space-y-8 py-10 md:py-16">
      <SectionHeading as="h1" eyebrow={t.eyebrow} title={t.title} description={t.description(formatTWD(policy.freeShippingThreshold))} />
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(({ icon: Icon, title, fee, text }) => (
          <section key={title} className="paper-panel p-6">
            <Icon aria-hidden="true" className="h-6 w-6 text-champagne" />
            <h2 className="mt-4 font-display text-2xl text-ink">{title}</h2>
            <p className="mt-2 text-lg text-ink">{fee}</p>
            <p className="mt-3 text-sm leading-7 text-ink/62">{text}</p>
          </section>
        ))}
      </div>
      <div className="paper-panel space-y-2 p-6 text-sm leading-7 text-ink/65">
        {t.notes.map(([before, linkText, after], index) => (
          <p key={before}>
            {before}
            {linkText && NOTE_LINKS[index] ? (
              <Link href={localePath(locale, NOTE_LINKS[index])} className="underline underline-offset-4">{linkText}</Link>
            ) : null}
            {after}
          </p>
        ))}
      </div>
    </main>
  );
}
