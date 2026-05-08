import { SectionHeading } from "@/components/section-heading";
import { faqs } from "@/lib/content";

export default function FaqPage() {
  return (
    <main className="shell space-y-8 py-16">
      <SectionHeading eyebrow="FAQ" title="常見問題" />
      <div className="space-y-4">
        {faqs.map((faq) => (
          <details key={faq.question} className="glass-panel p-6">
            <summary className="cursor-pointer list-none font-display text-2xl text-ink">{faq.question}</summary>
            <p className="mt-4 text-sm leading-8 text-ink/68">{faq.answer}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
