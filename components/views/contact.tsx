import { AutoImageRotator } from "@/components/auto-image-rotator";
import { SectionHeading } from "@/components/section-heading";
import { contact, getFeaturedProducts } from "@/lib/content";
import { getMessages, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export function contactMetadata(locale: Locale) {
  const t = getMessages(locale).contactPage;
  return buildMetadata({ title: t.metaTitle, description: t.metaDescription, path: "/contact", locale });
}

export function ContactView({ locale }: { locale: Locale }) {
  const t = getMessages(locale).contactPage;
  const featured = getFeaturedProducts();
  const colon = locale === "en" ? ": " : "：";
  const contactItems = [
    [t.labels.name, contact.name || "", ""],
    [t.labels.title, locale === "en" ? t.contactTitle : contact.title || "", ""],
    [t.labels.phone, contact.phone || "", contact.phone ? `tel:${contact.phone.replace(/\s+/g, "")}` : ""],
    [t.labels.email, contact.email || "", contact.email ? `mailto:${contact.email}` : ""],
    [t.labels.line, contact.line || "", contact.line ? `https://line.me/R/ti/p/~${contact.line}` : ""],
    [t.labels.instagram, contact.instagram || "", ""],
    [t.labels.address, contact.address || "", ""],
    [t.labels.hours, contact.businessHours || "", ""]
  ].filter(([, value]) => value && !value.startsWith("待補"));

  return (
    <main id="main-content" className="shell space-y-10 py-10 md:py-16">
      <SectionHeading as="h1" eyebrow={t.eyebrow} title={t.title} description={t.description} />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-panel relative min-h-[300px] overflow-hidden md:min-h-[420px]">
          <AutoImageRotator
            images={featured.flatMap((product) => product.images)}
            alt={t.imageAlt}
            priority
            intervalMs={5400}
            className="absolute inset-0"
            imageClassName="object-cover"
            sizes="(max-width: 1024px) 100vw, 600px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(23,18,15,0.45)] via-[rgba(23,18,15,0.12)] to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 z-10 rounded-[1.45rem] border border-white/35 bg-[rgba(248,241,232,0.74)] p-4 backdrop-blur-xl md:bottom-6 md:left-6 md:right-6 md:rounded-[1.6rem] md:p-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-champagne">{t.overlayEyebrow}</p>
            <p className="mt-2 text-sm leading-7 text-ink/75">{t.overlayText}</p>
          </div>
        </div>
        <div className="contact-concierge glass-panel grid gap-5 p-5 md:p-8">
          {contactItems.map(([label, value, href]) => {
            const content = (
              <>
                <p className="text-xs uppercase tracking-[0.28em] text-champagne">{label}</p>
                <p className="mt-2 text-base text-ink/75">{value}</p>
              </>
            );

            return href ? (
              <a key={label} href={href} className="contact-row border-b border-mist/40 pb-4 last:border-none" aria-label={`${label}${colon}${value}`}>
                {content}
              </a>
            ) : (
              <div key={label} className="contact-row border-b border-mist/40 pb-4 last:border-none">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
