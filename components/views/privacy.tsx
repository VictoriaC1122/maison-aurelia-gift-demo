import Link from "next/link";
import { PolicySection } from "@/components/policy-section";
import { SectionHeading } from "@/components/section-heading";
import { PolicyBlocks } from "@/components/views/returns";
import { contact, site } from "@/lib/content";
import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export function privacyMetadata(locale: Locale) {
  const t = getMessages(locale).privacy;
  return buildMetadata({ title: t.metaTitle, description: t.metaDescription, path: "/privacy", locale });
}

export function PrivacyView({ locale }: { locale: Locale }) {
  const t = getMessages(locale).privacy;
  const owner = site.company.legalName || (locale === "en" ? site.brandName : site.brandNameZh);
  const [lead, phoneText, orText, linkText, tail] = t.contactText;

  return (
    <main id="main-content" className="shell space-y-8 py-10 md:py-16">
      <SectionHeading as="h1" eyebrow={t.eyebrow} title={t.title} description={t.description(owner)} />
      <div className="paper-panel max-w-4xl space-y-6 p-6 md:p-10">
        <PolicyBlocks sections={t.sections} />
        <PolicySection title={t.contactTitle}>
          <p>
            {lead}
            <a href={`mailto:${contact.email}`} className="mx-1 underline decoration-champagne/50 underline-offset-4">{contact.email}</a>
            {phoneText}{contact.phone}{orText}
            <Link href={localePath(locale, "/contact")} className="mx-1 underline decoration-champagne/50 underline-offset-4">{linkText}</Link>
            {tail}
          </p>
        </PolicySection>
      </div>
    </main>
  );
}
