import { SectionHeading } from "@/components/section-heading";
import { buildMetadata } from "@/lib/seo";

const steps = [
  "選擇商品系列或客製方案",
  "進入下單表單，填寫收件與規格資訊",
  "品牌顧問確認檔期、數量與配送需求",
  "建立正式訂單並進入後續出貨流程"
];

export const metadata = buildMetadata({
  title: "訂購流程",
  description: "從挑選系列、確認規格到配送安排，一次掌握 Maison Aurelia 的完整訂購流程。",
  path: "/ordering"
});

export default function OrderingPage() {
  return (
    <main id="main-content" className="shell space-y-8 py-10 md:py-16">
      <SectionHeading as="h1" eyebrow="Ordering" title="訂購流程" description="從挑選品項到配送安排，讓每一步都清楚而從容。" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step} className="glass-panel relative overflow-hidden p-5 md:p-6">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-champagne/60 via-rosegold/30 to-transparent" />
            <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Step {index + 1}</p>
            <p className="mt-4 text-[0.97rem] leading-8 text-ink/68">{step}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
