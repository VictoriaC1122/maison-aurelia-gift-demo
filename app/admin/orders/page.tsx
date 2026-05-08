export const dynamic = "force-dynamic";

import { AdminOrdersClient } from "@/components/admin-orders-client";
import { listOrders } from "@/lib/order-store";

export default async function AdminOrdersPage() {
  const orders = await listOrders();
  return (
    <main className="shell py-16">
      <AdminOrdersClient initialOrders={orders} />
    </main>
  );
}
