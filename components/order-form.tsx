"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/lib/types";

const DEMO_ORDER_KEY = "maison-aurelia-demo-orders";
const CATEGORY_LABELS: Record<string, string> = {
  benyang: "燕序・本養",
  shenyang: "燕序・深養",
  factory: "越南燕廠"
};

function displaySpecification(value: string) {
  return value === "待補" ? "顧問確認" : value;
}

function buildDemoOrderId() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const serial = String(Date.now()).slice(-4);
  return `DEMO-${stamp}-${serial}`;
}

type OrderFormState = {
  customerName: string;
  phone: string;
  email: string;
  lineId: string;
  address: string;
  productName: string;
  category: string;
  quantity: number;
  option: string;
  preferredDeliveryDate: string;
  note: string;
};

type OrderFormErrors = Partial<Record<keyof OrderFormState, string>>;

function validateEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildErrors(form: OrderFormState) {
  const errors: OrderFormErrors = {};

  if (!form.customerName.trim()) errors.customerName = "請填寫收件人姓名。";
  if (!form.phone.trim()) {
    errors.phone = "請填寫聯絡電話。";
  } else if (!/^[0-9+\-\s()]{8,}$/.test(form.phone.trim())) {
    errors.phone = "請確認電話格式是否正確。";
  }

  if (!form.email.trim()) {
    errors.email = "請填寫 Email。";
  } else if (!validateEmail(form.email.trim())) {
    errors.email = "請填寫有效的 Email 格式。";
  }

  if (!form.address.trim()) errors.address = "請填寫完整收件地址。";
  if (!form.productName.trim()) errors.productName = "請選擇商品品項。";
  if (!form.category.trim()) errors.category = "請確認商品分類。";
  if (!Number.isFinite(form.quantity) || form.quantity < 1) errors.quantity = "數量至少需要 1。";
  if (!form.option.trim()) errors.option = "請確認商品規格。";

  return errors;
}

export function OrderForm({ products, defaultProductSlug }: { products: Product[]; defaultProductSlug?: string }) {
  const searchParams = useSearchParams();
  const requestedSlug = searchParams.get("product") ?? defaultProductSlug;
  const defaultProduct = useMemo(
    () => products.find((product) => product.slug === requestedSlug) ?? products[0],
    [products, requestedSlug]
  );

  const [form, setForm] = useState<OrderFormState>({
    customerName: "",
    phone: "",
    email: "",
    lineId: "",
    address: "",
    productName: defaultProduct?.nameZh ?? "",
    category: defaultProduct?.category ?? "",
    quantity: 1,
    option: displaySpecification(defaultProduct?.specification ?? ""),
    preferredDeliveryDate: "",
    note: ""
  });
  const [errors, setErrors] = useState<OrderFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState("");
  const [submitError, setSubmitError] = useState("");

  function updateField<K extends keyof OrderFormState>(field: K, value: OrderFormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
    setErrors((current) => ({
      ...current,
      [field]: undefined
    }));
    setSubmitError("");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = buildErrors(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitError("請先完成表單中的必填欄位。");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
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
    } catch {
      setSubmitError("目前無法儲存你的表單資訊，請稍後再試一次。");
    } finally {
      setSubmitting(false);
    }
  }

  function handleProductChange(slug: string) {
    const product = products.find((item) => item.slug === slug);
    if (!product) return;
    setForm((current) => ({
      ...current,
      productName: product.nameZh,
      category: product.category,
      option: displaySpecification(product.specification)
    }));
    setErrors((current) => ({
      ...current,
      productName: undefined,
      category: undefined,
      option: undefined
    }));
  }

  function fieldLabel(label: string, htmlFor: keyof OrderFormState, hint?: string) {
    return (
      <div className="space-y-1.5">
        <label htmlFor={htmlFor} className="field-label">
          {label}
          {hint ? <span className="field-hint">{hint}</span> : null}
        </label>
      </div>
    );
  }

  const minDeliveryDate = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-5">
      {successId ? (
        <div role="status" aria-live="polite" className="glass-panel p-5 text-sm leading-7 text-ink/68 md:p-6 md:leading-8">
          已收到你的預約資訊：<strong>{successId}</strong>。我們將依你留下的內容整理後續聯繫細節。
        </div>
      ) : null}
      {submitError ? (
        <div role="alert" className="rounded-[1.35rem] border border-rosegold/18 bg-rosegold/10 px-4 py-3 text-sm text-ink/76">
          {submitError}
        </div>
      ) : null}
      <form noValidate onSubmit={onSubmit} className="grid gap-4 rounded-luxe border border-white/60 bg-white/70 p-5 shadow-glass backdrop-blur md:grid-cols-2 md:gap-5 md:p-8">
        <div className="field-group">
          {fieldLabel("客戶姓名", "customerName")}
          <input id="customerName" className="field" placeholder="請填寫收件人姓名" aria-label="客戶姓名" aria-invalid={Boolean(errors.customerName)} aria-describedby={errors.customerName ? "customerName-error" : undefined} autoComplete="name" value={form.customerName} onChange={(e) => updateField("customerName", e.target.value)} />
          {errors.customerName ? <p id="customerName-error" className="text-sm text-rosegold">{errors.customerName}</p> : null}
        </div>
        <div className="field-group">
          {fieldLabel("聯絡電話", "phone")}
          <input id="phone" className="field" placeholder="09xx xxx xxx" aria-label="聯絡電話" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} autoComplete="tel" inputMode="tel" type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
          {errors.phone ? <p id="phone-error" className="text-sm text-rosegold">{errors.phone}</p> : null}
        </div>
        <div className="field-group">
          {fieldLabel("Email", "email")}
          <input id="email" className="field" placeholder="you@example.com" aria-label="Email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} autoComplete="email" inputMode="email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
          {errors.email ? <p id="email-error" className="text-sm text-rosegold">{errors.email}</p> : null}
        </div>
        <div className="field-group">
          {fieldLabel("LINE ID", "lineId", "選填")}
          <input id="lineId" className="field" placeholder="your-line-id" aria-label="LINE ID" autoComplete="nickname" value={form.lineId} onChange={(e) => updateField("lineId", e.target.value)} />
        </div>
        <div className="field-group md:col-span-2">
          {fieldLabel("收件地址", "address")}
          <textarea id="address" className="field min-h-[112px] resize-none md:col-span-2" placeholder="請填寫完整地址" aria-label="收件地址" aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? "address-error" : undefined} autoComplete="street-address" value={form.address} onChange={(e) => updateField("address", e.target.value)} />
          {errors.address ? <p id="address-error" className="text-sm text-rosegold">{errors.address}</p> : null}
        </div>
        <div className="field-group">
          {fieldLabel("商品品項", "productName")}
          <select
            id="productName"
            className="field"
            aria-label="商品品項"
            aria-invalid={Boolean(errors.productName)}
            aria-describedby={errors.productName ? "productName-error" : undefined}
            value={products.find((product) => product.nameZh === form.productName)?.slug ?? defaultProduct?.slug}
            onChange={(e) => handleProductChange(e.target.value)}
          >
            {products.map((product) => (
              <option key={product.slug} value={product.slug}>
                {product.nameZh}
              </option>
            ))}
          </select>
          {errors.productName ? <p id="productName-error" className="text-sm text-rosegold">{errors.productName}</p> : null}
        </div>
        <div className="field-group">
          {fieldLabel("商品分類", "category")}
          <input id="category" className="field" placeholder="系統將自動帶入" aria-label="商品分類" aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? "category-error" : undefined} readOnly value={CATEGORY_LABELS[form.category] ?? form.category} />
          {errors.category ? <p id="category-error" className="text-sm text-rosegold">{errors.category}</p> : null}
        </div>
        <div className="field-group">
          {fieldLabel("數量", "quantity")}
          <input id="quantity" className="field" placeholder="1" aria-label="數量" aria-invalid={Boolean(errors.quantity)} aria-describedby={errors.quantity ? "quantity-error" : undefined} type="number" inputMode="numeric" min={1} step={1} value={form.quantity} onChange={(e) => updateField("quantity", Number(e.target.value))} />
          {errors.quantity ? <p id="quantity-error" className="text-sm text-rosegold">{errors.quantity}</p> : null}
        </div>
        <div className="field-group">
          {fieldLabel("規格", "option")}
          <input id="option" className="field" placeholder="例：6 x 75ml" aria-label="規格" aria-invalid={Boolean(errors.option)} aria-describedby={errors.option ? "option-error" : undefined} value={form.option} onChange={(e) => updateField("option", e.target.value)} />
          {errors.option ? <p id="option-error" className="text-sm text-rosegold">{errors.option}</p> : null}
        </div>
        <div className="field-group md:col-span-2">
          {fieldLabel("希望配送日期", "preferredDeliveryDate", "選填")}
          <input id="preferredDeliveryDate" className="field md:col-span-2" aria-label="希望配送日期" placeholder="希望配送日期" type="date" min={minDeliveryDate} value={form.preferredDeliveryDate} onChange={(e) => updateField("preferredDeliveryDate", e.target.value)} />
        </div>
        <div className="field-group md:col-span-2">
          {fieldLabel("備註", "note", "選填")}
          <textarea id="note" className="field min-h-[120px] resize-none md:col-span-2" placeholder="若有包裝、份數或送禮時程需求，歡迎補充" aria-label="備註" value={form.note} onChange={(e) => updateField("note", e.target.value)} />
        </div>
        <div className="md:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-7 text-ink/60">若有指定送禮時程、份數或包裝需求，也歡迎一併備註。</p>
          <button className="min-h-[52px] w-full rounded-full bg-ink px-6 py-3 text-sm text-pearl transition hover:-translate-y-0.5 active:scale-[0.99] sm:w-auto" disabled={submitting}>
            {submitting ? "送出中..." : "送出預約"}
          </button>
        </div>
      </form>
    </div>
  );
}
