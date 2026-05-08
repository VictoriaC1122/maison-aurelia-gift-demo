import { SectionHeading } from "@/components/section-heading";

const reasons = [
  {
    title: "Luxury Visual Language",
    description: "以留白、光澤與比例感，讓視覺自然呈現出安靜而講究的質地。"
  },
  {
    title: "Source-Backed Trust",
    description: "把產地、工序與來源說清楚，讓安心感來自真實而不是想像。"
  },
  {
    title: "Commerce-Ready Flow",
    description: "讓挑選、詢問與下單都保持流暢，讓品牌感與使用感並存。"
  }
];

export default function WhyUsPage() {
  return (
    <main className="shell space-y-8 py-16">
      <SectionHeading
        eyebrow="Why Us"
        title="品牌理念"
        description="真正令人留下印象的，不只是外觀，而是每一處細節都被照顧得剛剛好。"
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
