"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/lib/types";

const DEMO_ORDER_KEY = "maison-aurelia-demo-orders";

function buildDemoOrderId() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const serial = String(Date.now()).slice(-4);
  return `DEMO-${stamp}-${serial}`;
}

export function OrderForm({ products, defaultProductSlug }: { products: Product[]; defaultProductSlug?: string }) {
  const searchParams = useSearchParams();
  const requestedSlug = searchParams.get("product") ?? defaultProductSlug;
  const defaultProduct = useMemo(
    () => products.find((product) => product.slug === requestedSlug) ?? products[0],
    [products, requestedSlug]
  );

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    lineId: "",
    address: "",
    productName: defaultProduct?.nameZh ?? "",
    category: defaultProduct?.category ?? "",
    quantity: 1,
    option: defaultProduct?.specification ?? "",
    preferredDeliveryDate: "",
    note: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const nextOrder = {
      orderId: buildDemoOrderId(),
      createdAt: new Date().toISOString(),
      status: "pending",
      ...form
    };

    const currentOrders = JSON.parse(window.localStorage.getItem(DEMO_ORDER_KEY) ?? "[]") as Array<Record<string, unknown>>;
    currentOrders.unshift(nextOrder);
    window.localStorage.setItem(DEMO_ORDER_KEY, JSON.stringify(currentOrders));
    setSuccessId(nextOrder.orderId);
    setSubmitting(false);
  }

  function handleProductChange(slug: string) {
    const product = products.find((item) => item.slug === slug);
    if (!product) return;
    setForm((current) => ({
      ...current,
      productName: product.nameZh,
      category: product.category,
      option: product.specification
    }));
  }

  return (
    <div className="space-y-5">
      {successId ? (
        <div className="glass-panel p-6 text-sm leading-8 text-ink/68">
          已收到你的預約資訊：<strong>{successId}</strong>。我們將依你留下的內容整理後續聯繫細節。
        </div>
      ) : null}
      <form onSubmit={onSubmit} className="grid gap-4 rounded-luxe border border-white/60 bg-white/70 p-5 shadow-glass backdrop-blur md:grid-cols-2 md:gap-5 md:p-8">
        <input className="field" placeholder="客戶姓名" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
        <input className="field" placeholder="電話" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="field" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="field" placeholder="LINE ID" value={form.lineId} onChange={(e) => setForm({ ...form, lineId: e.target.value })} />
        <textarea className="field md:col-span-2" placeholder="收件地址" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <select
          className="field"
          value={products.find((product) => product.nameZh === form.productName)?.slug ?? defaultProduct?.slug}
          onChange={(e) => handleProductChange(e.target.value)}
        >
          {products.map((product) => (
            <option key={product.slug} value={product.slug}>
              {product.nameZh}
            </option>
          ))}
        </select>
        <input className="field" placeholder="商品分類" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className="field" placeholder="數量" type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
        <input className="field" placeholder="規格" value={form.option} onChange={(e) => setForm({ ...form, option: e.target.value })} />
        <input className="field md:col-span-2" placeholder="希望配送日期" type="date" value={form.preferredDeliveryDate} onChange={(e) => setForm({ ...form, preferredDeliveryDate: e.target.value })} />
        <textarea className="field md:col-span-2" placeholder="備註" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        <div className="md:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-7 text-ink/60">若有指定送禮時程、份數或包裝需求，也歡迎一併備註。</p>
          <button className="min-h-[50px] rounded-full bg-ink px-6 py-3 text-sm text-pearl transition hover:-translate-y-0.5 active:scale-[0.99]" disabled={submitting}>
            {submitting ? "送出中..." : "送出預約"}
          </button>
        </div>
      </form>
    </div>
  );
}
