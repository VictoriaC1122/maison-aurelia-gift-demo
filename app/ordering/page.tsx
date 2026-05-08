import { SectionHeading } from "@/components/section-heading";

const steps = [
  "選擇商品系列或客製方案",
  "進入下單表單，填寫收件與規格資訊",
  "品牌顧問確認檔期、數量與配送需求",
  "建立正式訂單並進入後續出貨流程"
];

export default function OrderingPage() {
  return (
    <main className="shell space-y-8 py-16">
      <SectionHeading eyebrow="Ordering" title="訂購流程" description="參考成熟購物品牌的導購邏輯，讓詢價與正式下單都更順手。" />
      <div className="grid gap-5 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step} className="glass-panel p-6">
            <p className="text-xs uppercase tracking-[0.32em] text-champagne">Step {index + 1}</p>
            <p className="mt-4 text-sm leading-8 text-ink/68">{step}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
