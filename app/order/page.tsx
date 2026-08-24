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
    <main id="main-content" className="order-page shell space-y-8 py-10 md:py-16">
      <SectionHeading
        as="h1"
        eyebrow="Order Request"
        title="確認商品與訂購資料"
        description="依序確認品項、填寫收件資料並送出需求；正式規格、報價與配送日期會由顧問再與你確認。"
      />
      <div className="glass-panel flex flex-col gap-3 px-5 py-4 text-sm text-ink/62 sm:flex-row sm:flex-wrap sm:items-center sm:gap-0 sm:divide-x sm:divide-champagne/18 sm:px-6">
        <span className="sm:pr-5">約 3 分鐘完成</span>
        <span className="sm:px-5">送出後由顧問確認</span>
        <span className="sm:pl-5">此步驟不會立即付款</span>
      </div>
      <Suspense fallback={<div className="glass-panel p-6 text-sm text-ink/60">載入下單表單中...</div>}>
        <OrderForm products={products} />
      </Suspense>
    </main>
  );
}
