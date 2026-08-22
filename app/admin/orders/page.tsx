import { AdminOrdersClient } from "@/components/admin-orders-client";
import ordersData from "@/data/orders.json";
import type { OrderRecord } from "@/lib/types";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "訂單管理",
  description: "檢視 Maison Aurelia 展示站的訂單列表、搜尋結果與狀態管理。",
  path: "/admin/orders",
  noIndex: true
});

export default function AdminOrdersPage() {
  const orders = ordersData as OrderRecord[];
  return (
    <main id="main-content" className="shell py-10 md:py-16">
      <AdminOrdersClient initialOrders={orders} />
    </main>
  );
}
