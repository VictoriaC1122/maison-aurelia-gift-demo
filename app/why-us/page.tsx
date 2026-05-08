import { SectionHeading } from "@/components/section-heading";

const reasons = [
  {
    title: "Luxury Visual Language",
    description: "以精品雜誌式字級、柔霧色系、玻璃卡片與留白比例建立高端第一印象。"
  },
  {
    title: "Source-Backed Trust",
    description: "把越南燕廠做成完整來源敘事，而不是單純商品配圖。"
  },
  {
    title: "Commerce-Ready Flow",
    description: "包含分類頁、商品頁、下單表單、訂單 API 與 admin 管理，不只是形象頁。"
  }
];

export default function WhyUsPage() {
  return (
    <main className="shell space-y-8 py-16">
      <SectionHeading
        eyebrow="Why Us"
        title="品牌理念"
        description="網站不只是漂亮，而是把高端送禮品牌該有的故事、秩序、流程與可信度一起做完整。"
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {reasons.map((reason) => (
          <article key={reason.title} className="glass-panel p-7">
            <h2 className="font-display text-3xl text-ink">{reason.title}</h2>
            <p className="mt-4 text-sm leading-8 text-ink/65">{reason.description}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
