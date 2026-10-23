import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { getFaqs } from "@/lib/content";
import { getMessages, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export function faqMetadata(locale: Locale) {
  const t = getMessages(locale).faqPage;
  return buildMetadata({ title: t.metaTitle, description: t.metaDescription, path: "/faq", locale });
}

export function FaqView({ locale }: { locale: Locale }) {
  const t = getMessages(locale).faqPage;
  const faqs = getFaqs(locale);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: getMessages(locale).htmlLang,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer }
    }))
  };
  return (
    <main id="main-content" className="shell space-y-8 py-10 md:py-16">
      <StructuredData data={faqSchema} />
      <SectionHeading as="h1" eyebrow={t.eyebrow} title={t.title} description={t.description} />
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details key={faq.question} className="glass-panel group p-5 md:p-6">
            <summary className="faq-summary cursor-pointer list-none">
              <span className="faq-summary__index">0{index + 1}</span>
              <span className="font-display text-[1.45rem] leading-[1.16] text-ink md:text-2xl">{faq.question}</span>
            </summary>
            <p className="mt-4 border-t border-champagne/10 pt-4 text-[0.97rem] leading-8 text-ink/68 md:text-sm">{faq.answer}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
