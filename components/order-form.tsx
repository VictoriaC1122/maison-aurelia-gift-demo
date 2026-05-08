"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";

export function OrderForm({ products, defaultProductSlug }: { products: Product[]; defaultProductSlug?: string }) {
  const router = useRouter();
  const defaultProduct = useMemo(
    () => products.find((product) => product.slug === defaultProductSlug) ?? products[0],
    [defaultProductSlug, products]
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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const payload = (await response.json()) as { orderId?: string; error?: string };
    setSubmitting(false);

    if (!response.ok || !payload.orderId) {
      window.alert(payload.error ?? "送出失敗，請稍後再試。");
      return;
    }

    router.push(`/order?success=${payload.orderId}`);
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
    <form onSubmit={onSubmit} className="grid gap-5 rounded-luxe border border-white/60 bg-white/70 p-6 shadow-glass backdrop-blur md:grid-cols-2 md:p-8">
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
      <div className="md:col-span-2 flex items-center justify-between gap-4">
        <p className="text-sm leading-7 text-ink/60">送出後會建立正式訂單編號，並可於 admin 訂單頁查詢與管理。</p>
        <button className="rounded-full bg-ink px-6 py-3 text-sm text-pearl transition hover:-translate-y-0.5" disabled={submitting}>
          {submitting ? "送出中..." : "送出訂單"}
        </button>
      </div>
    </form>
  );
}
