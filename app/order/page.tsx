import { Suspense } from "react";
import { ShieldCheck } from "lucide-react";
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
        title="三步完成燕禮訂購需求"
        description="先確認商品，再留下收件方式；送出前會有完整摘要供你檢查。"
      />
      <div className="order-intro-note flex items-start gap-3 rounded-[1.25rem] border border-champagne/14 bg-white/52 px-5 py-4 text-sm leading-7 text-ink/58">
        <ShieldCheck aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-champagne" />
        <p>約 3 分鐘完成。送出後由顧問確認內容與報價，此步驟不會立即付款。</p>
      </div>
      <Suspense fallback={<div className="paper-panel p-6 text-sm text-ink/60">載入訂購表單中...</div>}>
        <OrderForm products={products} />
      </Suspense>
    </main>
  );
}
