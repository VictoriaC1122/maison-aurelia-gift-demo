"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { OrderRecord, OrderStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const statuses: OrderStatus[] = ["pending", "confirmed", "shipped", "completed", "cancelled"];

export function AdminOrdersClient({ initialOrders }: { initialOrders: OrderRecord[] }) {
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState(initialOrders);

  useEffect(() => {
    const id = setTimeout(async () => {
      const response = await fetch(`/api/orders${query ? `?q=${encodeURIComponent(query)}` : ""}`);
      const payload = (await response.json()) as { orders: OrderRecord[] };
      setOrders(payload.orders);
    }, 180);
    return () => clearTimeout(id);
  }, [query]);

  const countLabel = useMemo(() => `${orders.length} orders`, [orders.length]);

  async function updateStatus(orderId: string, status: OrderStatus) {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    const payload = (await response.json()) as { order: OrderRecord };
    if (response.ok) {
      setOrders((current) => current.map((item) => (item.orderId === orderId ? payload.order : item)));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-luxe border border-white/60 bg-white/70 p-6 shadow-glass backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-champagne">Order Console</p>
          <h2 className="font-display text-3xl text-ink">/admin/orders</h2>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            className="field min-w-[280px]"
            placeholder="搜尋姓名、電話、商品"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Link
            href="/api/orders/export"
            className="inline-flex rounded-full border border-champagne/30 px-5 py-3 text-sm text-ink transition hover:-translate-y-0.5"
          >
            匯出 CSV
          </Link>
        </div>
      </div>

      <p className="text-sm text-ink/55">{countLabel}</p>

      <div className="overflow-hidden rounded-luxe border border-white/60 bg-white/75 shadow-glass">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-ink text-pearl">
              <tr>
                {["訂單編號", "時間", "客戶", "商品", "規格", "配送日期", "狀態"].map((label) => (
                  <th key={label} className="px-5 py-4 font-medium">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId} className="border-t border-mist/40">
                  <td className="px-5 py-4">{order.orderId}</td>
                  <td className="px-5 py-4">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-4">
                    <div>{order.customerName}</div>
                    <div className="text-xs text-ink/55">{order.phone}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div>{order.productName}</div>
                    <div className="text-xs text-ink/55">{order.category}</div>
                  </td>
                  <td className="px-5 py-4">{order.option}</td>
                  <td className="px-5 py-4">{order.preferredDeliveryDate}</td>
                  <td className="px-5 py-4">
                    <select
                      className="field min-w-[150px]"
                      value={order.status}
                      onChange={(event) => updateStatus(order.orderId, event.target.value as OrderStatus)}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
