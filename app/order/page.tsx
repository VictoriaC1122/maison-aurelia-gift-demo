import { Suspense } from "react";
import { SectionHeading } from "@/components/section-heading";
import { OrderForm } from "@/components/order-form";
import { getProducts } from "@/lib/content";

export default function OrderPage() {
  const products = getProducts();

  return (
    <main className="shell space-y-8 py-16">
      <SectionHeading eyebrow="Order Form" title="下單表單" description="這個展示版會用前端 mock mode 模擬下單與訂單狀態，方便在公開網址上直接預覽。" />
      <Suspense fallback={<div className="glass-panel p-6 text-sm text-ink/60">載入下單表單中...</div>}>
        <OrderForm products={products} />
      </Suspense>
    </main>
  );
}
