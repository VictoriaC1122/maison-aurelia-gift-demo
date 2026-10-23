import { OrderTracker } from "@/components/order-tracker";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "訂單查詢",
  description: "輸入訂單編號與下單手機，查詢越金燕訂單進度、付款與出貨狀態。",
  path: "/track",
  noIndex: true
});

export default function TrackPage() {
  return (
    <main id="main-content" className="shell space-y-6 py-8 md:py-12">
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.32em] text-champagne">Order Status</p>
        <h1 className="font-display text-[2.2rem] leading-tight text-ink md:text-[2.8rem]">訂單查詢</h1>
        <p className="text-sm leading-7 text-ink/60">輸入訂單編號與下單時的手機號碼，即可查看處理進度、應付金額與出貨資訊。</p>
      </div>
      <OrderTracker />
    </main>
  );
}
