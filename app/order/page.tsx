import { OrderRedirect } from "@/components/order-redirect";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "結帳",
  description: "前往越金燕結帳頁面。",
  path: "/order",
  noIndex: true
});

export default function OrderPage() {
  return (
    <main id="main-content" className="shell py-16">
      <OrderRedirect />
    </main>
  );
}
