import { Suspense } from "react";
import { SectionHeading } from "@/components/section-heading";
import { OrderForm } from "@/components/order-form";
import { getProducts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "下單表單",
  description: "填寫收件與商品資訊，提交 Maison Aurelia 的燕禮詢價與下單需求。",
  path: "/order"
});

export default function OrderPage() {
  const products = getProducts();

  return (
    <main id="main-content" className="shell space-y-8 py-10 md:py-16">
      <SectionHeading as="h1" eyebrow="Order Form" title="下單表單" description="留下收件與品項資訊後，我們會再與你確認細節與配送安排。" />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "步驟一", text: "確認系列與規格" },
          { label: "步驟二", text: "填寫收件與聯絡資訊" },
          { label: "步驟三", text: "由顧問回覆交期與配送" }
        ].map((item) => (
          <div key={item.label} className="glass-panel p-5">
            <p className="text-[11px] uppercase tracking-[0.26em] text-champagne">{item.label}</p>
            <p className="mt-2 text-base leading-7 text-ink/72">{item.text}</p>
          </div>
        ))}
      </div>
      <Suspense fallback={<div className="glass-panel p-6 text-sm text-ink/60">載入下單表單中...</div>}>
        <OrderForm products={products} />
      </Suspense>
    </main>
  );
}
