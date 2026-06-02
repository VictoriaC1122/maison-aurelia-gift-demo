import { AdminOrdersClient } from "@/components/admin-orders-client";
import ordersData from "@/data/orders.json";
import type { OrderRecord } from "@/lib/types";

export default function AdminOrdersPage() {
  const orders = ordersData as OrderRecord[];
  return (
    <main className="shell py-10 md:py-16">
      <AdminOrdersClient initialOrders={orders} />
    </main>
  );
}
