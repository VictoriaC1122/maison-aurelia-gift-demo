import Link from "next/link";
import { PolicySection } from "@/components/policy-section";
import { SectionHeading } from "@/components/section-heading";
import { contact } from "@/lib/content";
import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

type PolicyBlock = { title: string; paragraphs?: readonly string[]; list?: readonly string[]; after?: string };

export function PolicyBlocks({ sections }: { sections: readonly PolicyBlock[] }) {
  return (
    <>
      {sections.map((section) => (
        <PolicySection key={section.title} title={section.title}>
          {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.list ? (
            <ul className="list-disc space-y-2 pl-5">
              {section.list.map((item) => <li key={item}>{item}</li>)}
            </ul>
          ) : null}
          {section.after ? <p>{section.after}</p> : null}
        </PolicySection>
      ))}
    </>
  );
}

export function returnsMetadata(locale: Locale) {
  const t = getMessages(locale).returns;
  return buildMetadata({ title: t.metaTitle, description: t.metaDescription, path: "/returns", locale });
}

export function ReturnsView({ locale }: { locale: Locale }) {
  const t = getMessages(locale).returns;
  const colon = locale === "en" ? ": " : "：";
  const separator = locale === "en" ? " · " : "・";
  return (
    <main id="main-content" className="shell space-y-8 py-10 md:py-16">
      <SectionHeading as="h1" eyebrow={t.eyebrow} title={t.title} description={t.description} />
      <div className="paper-panel max-w-4xl space-y-6 p-6 md:p-10">
        <PolicyBlocks sections={t.sections} />
        <PolicySection title={t.contactTitle}>
          <p>
            {t.contactLine}{colon}
            <a href={`https://line.me/R/ti/p/~${contact.line}`} className="underline decoration-champagne/50 underline-offset-4">{contact.line}</a>
            {separator}{t.contactPhone}{colon}{contact.phone}
            {separator}{t.contactEmail}{colon}
            <a href={`mailto:${contact.email}`} className="underline decoration-champagne/50 underline-offset-4">{contact.email}</a>
          </p>
          <p>
            <Link href={localePath(locale, "/contact")} className="underline decoration-champagne/50 underline-offset-4">{t.contactPage}</Link>
          </p>
        </PolicySection>
      </div>
    </main>
  );
}
