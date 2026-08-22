import { SectionHeading } from "@/components/section-heading";
import { faqs } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "常見問題",
  description: "快速查閱 Maison Aurelia 的交期、客製、配送與訂購常見問題。",
  path: "/faq"
});

export default function FaqPage() {
  return (
    <main id="main-content" className="shell space-y-8 py-10 md:py-16">
      <SectionHeading as="h1" eyebrow="FAQ" title="常見問題" description="把常見的交期、客製與配送疑問整理清楚，方便快速確認。" />
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
