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
      <div className="flex flex-col gap-4 rounded-luxe border border-white/60 bg-white/70 p-6 shadow-glass backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-champagne">Order Ledger</p>
          <h1 className="font-display text-3xl text-ink">訂單一覽</h1>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label htmlFor="order-search" className="sr-only">
            搜尋姓名、電話或商品
          </label>
          <input
            id="order-search"
            className="field w-full md:min-w-0 md:flex-1 lg:w-[320px] lg:flex-none"
            placeholder="搜尋姓名、電話、商品"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-champagne/30 px-5 py-3 text-sm text-ink transition hover:-translate-y-0.5"
          >
            匯出 CSV
          </button>
        </div>
      </div>

      <p className="text-sm text-ink/55">{countLabel}</p>

      <div className="grid gap-4 md:hidden">
        {filteredOrders.map((order) => (
          <article key={order.orderId} className="glass-panel space-y-4 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-champagne">{order.orderId}</p>
                <h3 className="mt-2 font-display text-[1.55rem] leading-[1.06] text-ink">{order.productName}</h3>
              </div>
              <select
                className="field w-auto min-w-[140px] max-w-[150px] shrink-0"
                value={order.status}
                onChange={(event) => updateStatus(order.orderId, event.target.value as OrderStatus)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-3 text-sm text-ink/68">
              <div className="rounded-[1.1rem] border border-champagne/12 bg-white/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.22em] text-champagne">客戶</p>
                <p className="mt-2 text-base text-ink">{order.customerName}</p>
                <p className="mt-1 text-sm text-ink/58">{order.phone}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[1.1rem] border border-champagne/12 bg-white/55 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-champagne">規格</p>
                  <p className="mt-2">{order.option}</p>
                </div>
                <div className="rounded-[1.1rem] border border-champagne/12 bg-white/55 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-champagne">配送日期</p>
                  <p className="mt-2">{order.preferredDeliveryDate || "待確認"}</p>
                </div>
              </div>
              <div className="rounded-[1.1rem] border border-champagne/12 bg-white/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.22em] text-champagne">建立時間</p>
                <p className="mt-2">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-luxe border border-white/60 bg-white/75 shadow-glass md:block">
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
      <p className="text-xs leading-7 text-ink/45">此頁用於整理訂單資訊與配送狀態，便於快速檢視與後續安排。</p>
    </div>
  );
}
