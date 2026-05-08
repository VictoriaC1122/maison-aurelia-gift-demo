import { SectionHeading } from "@/components/section-heading";
import { OrderForm } from "@/components/order-form";
import { getProducts } from "@/lib/content";

export default async function OrderPage({
  searchParams
}: {
  searchParams: Promise<{ product?: string; success?: string }>;
}) {
  const params = await searchParams;
  const products = getProducts();

  return (
    <main className="shell space-y-8 py-16">
      <SectionHeading eyebrow="Order Form" title="下單表單" description="訂單欄位與後端資料結構已完成，正式上線時可切換為 Supabase storage。" />
      {params.success ? (
        <div className="glass-panel p-6 text-sm leading-8 text-ink/68">
          訂單已送出，訂單編號：<strong>{params.success}</strong>
        </div>
      ) : null}
      <OrderForm products={products} defaultProductSlug={params.product} />
    </main>
  );
}
