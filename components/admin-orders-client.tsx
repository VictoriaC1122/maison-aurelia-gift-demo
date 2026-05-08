"use client";

import { useEffect, useMemo, useState } from "react";
import type { OrderRecord, OrderStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const statuses: OrderStatus[] = ["pending", "confirmed", "shipped", "completed", "cancelled"];
const DEMO_ORDER_KEY = "maison-aurelia-demo-orders";

export function AdminOrdersClient({ initialOrders }: { initialOrders: OrderRecord[] }) {
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState(initialOrders);

  useEffect(() => {
    const localOrders = JSON.parse(window.localStorage.getItem(DEMO_ORDER_KEY) ?? "[]") as OrderRecord[];
    if (localOrders.length > 0) {
      setOrders((current) => {
        const merged = [...localOrders, ...current].filter(
          (order, index, array) => array.findIndex((item) => item.orderId === order.orderId) === index
        );
        return merged;
      });
    }
  }, []);

  const filteredOrders = useMemo(() => {
    if (!query) return orders;
    return orders.filter((order) =>
      [order.customerName, order.phone, order.productName]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [orders, query]);

  const countLabel = useMemo(() => `${filteredOrders.length} orders`, [filteredOrders.length]);

  function updateStatus(orderId: string, status: OrderStatus) {
    setOrders((current) => {
      const next = current.map((item) => (item.orderId === orderId ? { ...item, status } : item));
      window.localStorage.setItem(
        DEMO_ORDER_KEY,
        JSON.stringify(next.filter((item) => item.orderId.startsWith("DEMO-")))
      );
      return next;
    });
  }

  function exportCsv() {
    const headers = [
      "orderId",
      "createdAt",
      "customerName",
      "phone",
      "email",
      "lineId",
      "address",
      "productName",
      "category",
      "quantity",
      "option",
      "preferredDeliveryDate",
      "note",
      "status"
    ];

    const csv = [
      headers.join(","),
      ...filteredOrders.map((order) =>
        headers
          .map((key) => `"${String(order[key as keyof OrderRecord] ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "maison-aurelia-demo-orders.csv";
    anchor.click();
    URL.revokeObjectURL(url);
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
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex rounded-full border border-champagne/30 px-5 py-3 text-sm text-ink transition hover:-translate-y-0.5"
          >
            匯出 CSV
          </button>
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
              {filteredOrders.map((order) => (
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
      <p className="text-xs leading-7 text-ink/45">
        這是靜態展示版 admin，資料更新只會保存在目前瀏覽器，方便業主預覽流程與介面。
      </p>
    </div>
  );
}
