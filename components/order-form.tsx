"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Minus, Plus, ShieldCheck } from "lucide-react";
import { contact } from "@/lib/content";
import type { Product } from "@/lib/types";
import { formatCurrency, withBasePath } from "@/lib/utils";

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
  const selectedProduct = products.find((product) => product.nameZh === form.productName) ?? defaultProduct;

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
      const firstInvalidField = Object.keys(nextErrors)[0];
      window.requestAnimationFrame(() => document.getElementById(firstInvalidField)?.focus());
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

  function stepHeader(step: string, title: string, description: string) {
    return (
      <div className="mb-5 flex items-start gap-3 border-b border-champagne/12 pb-4 md:mb-6">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-xs tracking-[0.08em] text-pearl">
          {step}
        </span>
        <div>
          <h2 className="font-display text-xl leading-tight text-ink md:text-2xl">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-ink/55">{description}</p>
        </div>
      </div>
    );
  }

  const minDeliveryDate = new Date().toISOString().split("T")[0];

  if (successId) {
    return (
      <section role="status" aria-live="polite" className="glass-panel mx-auto max-w-4xl overflow-hidden p-6 md:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-champagne/14 text-champagne">
            <CheckCircle2 aria-hidden="true" className="h-7 w-7" />
          </span>
          <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-champagne">Request Saved</p>
          <h2 className="mt-3 font-display text-[2rem] leading-tight text-ink md:text-[2.6rem]">訂購需求已建立</h2>
          <p className="mt-3 text-base leading-8 text-ink/62">
            訂單編號 <strong className="text-ink">{successId}</strong>。顧問將依你留下的品項與聯絡資料確認規格、交期與配送安排。
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { step: "01", text: "需求已儲存" },
            { step: "02", text: "顧問確認細節" },
            { step: "03", text: "確認後安排配送" }
          ].map((item) => (
            <div key={item.step} className="rounded-[1.25rem] border border-champagne/14 bg-white/55 p-4 text-center">
              <p className="text-[11px] tracking-[0.2em] text-champagne">{item.step}</p>
              <p className="mt-2 text-sm text-ink/70">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/collections" className="hero-button-dark min-h-[52px] justify-center">繼續瀏覽商品</Link>
          <a href={`https://line.me/R/ti/p/~${contact.line}`} className="hero-button-light min-h-[52px] justify-center">LINE 補充需求</a>
        </div>
      </section>
    );
  }

  return (
    <div className="order-checkout grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      {selectedProduct ? (
        <section aria-label="目前選擇的商品" className="glass-panel flex min-w-0 items-center gap-4 p-4 lg:hidden">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.15rem]">
            <Image src={withBasePath(selectedProduct.images[0])} alt={selectedProduct.nameZh} fill sizes="96px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-champagne">目前選擇</p>
            <h2 className="mt-1 truncate font-display text-lg text-ink">{selectedProduct.nameZh}</h2>
            <p className="mt-1 text-sm text-ink/55">{form.option}・數量 {form.quantity}</p>
            <Link href={`/products/${selectedProduct.slug}`} className="mt-2 inline-flex text-xs text-ink/68 underline decoration-champagne/40 underline-offset-4">
              返回商品詳情
            </Link>
          </div>
        </section>
      ) : null}
      <form noValidate onSubmit={onSubmit} aria-busy={submitting} className="min-w-0 space-y-5">
        {submitError ? (
          <div role="alert" className="rounded-[1.35rem] border border-rosegold/18 bg-rosegold/10 px-4 py-3 text-sm text-ink/76">
            {submitError}
          </div>
        ) : null}

        <fieldset className="glass-panel min-w-0 p-5 md:p-7">
          <legend className="sr-only">確認商品與數量</legend>
          {stepHeader("01", "確認商品", "先確認品項、規格與希望配送時間。")}
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            <div className="field-group md:col-span-2">
              {fieldLabel("商品品項", "productName", "必填")}
              <select
                id="productName"
                className="field"
                required
                aria-label="商品品項"
                aria-invalid={Boolean(errors.productName)}
                aria-describedby={errors.productName ? "productName-error" : undefined}
                value={products.find((product) => product.nameZh === form.productName)?.slug ?? defaultProduct?.slug}
                onChange={(e) => handleProductChange(e.target.value)}
              >
                {products.map((product) => (
                  <option key={product.slug} value={product.slug}>{product.nameZh}</option>
                ))}
              </select>
              {errors.productName ? <p id="productName-error" className="text-sm text-rosegold">{errors.productName}</p> : null}
            </div>

            <div className="field-group">
              <p className="field-label">商品分類</p>
              <div id="category" tabIndex={-1} className="flex min-h-[52px] items-center rounded-2xl border border-champagne/15 bg-cream/45 px-4 py-3 text-sm text-ink/68">
                {CATEGORY_LABELS[form.category] ?? form.category}
              </div>
              {errors.category ? <p id="category-error" className="text-sm text-rosegold">{errors.category}</p> : null}
            </div>

            <div className="field-group">
              {fieldLabel("數量", "quantity", "必填")}
              <div className="grid min-h-[52px] grid-cols-[52px_minmax(0,1fr)_52px] overflow-hidden rounded-2xl border border-champagne/20 bg-pearl/80">
                <button
                  type="button"
                  aria-label="減少數量"
                  disabled={form.quantity <= 1}
                  className="inline-flex items-center justify-center border-r border-champagne/15 text-ink/68 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                  onClick={() => updateField("quantity", Math.max(1, form.quantity - 1))}
                >
                  <Minus aria-hidden="true" className="h-4 w-4" />
                </button>
                <input
                  id="quantity"
                  className="min-w-0 bg-transparent px-2 text-center text-base text-ink outline-none"
                  aria-label="數量"
                  aria-invalid={Boolean(errors.quantity)}
                  aria-describedby={errors.quantity ? "quantity-error" : undefined}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  value={form.quantity}
                  onChange={(e) => updateField("quantity", Number(e.target.value))}
                />
                <button
                  type="button"
                  aria-label="增加數量"
                  className="inline-flex items-center justify-center border-l border-champagne/15 text-ink/68 transition hover:bg-white"
                  onClick={() => updateField("quantity", (Number.isFinite(form.quantity) ? form.quantity : 0) + 1)}
                >
                  <Plus aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
              {errors.quantity ? <p id="quantity-error" className="text-sm text-rosegold">{errors.quantity}</p> : null}
            </div>

            <div className="field-group">
              {fieldLabel("規格 / 需求", "option", "必填")}
              <input id="option" className="field" required placeholder="例：6 x 75ml" aria-label="規格" aria-invalid={Boolean(errors.option)} aria-describedby={errors.option ? "option-error" : undefined} value={form.option} onChange={(e) => updateField("option", e.target.value)} />
              {errors.option ? <p id="option-error" className="text-sm text-rosegold">{errors.option}</p> : null}
            </div>

            <div className="field-group">
              {fieldLabel("希望配送日期", "preferredDeliveryDate", "選填")}
              <input id="preferredDeliveryDate" className="field" aria-label="希望配送日期" type="date" min={minDeliveryDate} value={form.preferredDeliveryDate} onChange={(e) => updateField("preferredDeliveryDate", e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset className="glass-panel min-w-0 p-5 md:p-7">
          <legend className="sr-only">填寫收件與聯絡資料</legend>
          {stepHeader("02", "收件與聯絡資料", "顧問將透過以下資料與你確認訂購細節。")}
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            <div className="field-group">
              {fieldLabel("收件人姓名", "customerName", "必填")}
              <input id="customerName" className="field" required placeholder="請填寫收件人姓名" aria-label="客戶姓名" aria-invalid={Boolean(errors.customerName)} aria-describedby={errors.customerName ? "customerName-error" : undefined} autoComplete="name" value={form.customerName} onChange={(e) => updateField("customerName", e.target.value)} />
              {errors.customerName ? <p id="customerName-error" className="text-sm text-rosegold">{errors.customerName}</p> : null}
            </div>
            <div className="field-group">
              {fieldLabel("聯絡電話", "phone", "必填")}
              <input id="phone" className="field" required placeholder="09xx xxx xxx" aria-label="聯絡電話" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} autoComplete="tel" inputMode="tel" type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
              {errors.phone ? <p id="phone-error" className="text-sm text-rosegold">{errors.phone}</p> : null}
            </div>
            <div className="field-group">
              {fieldLabel("Email", "email", "必填")}
              <input id="email" className="field" required placeholder="you@example.com" aria-label="Email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} autoComplete="email" inputMode="email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
              {errors.email ? <p id="email-error" className="text-sm text-rosegold">{errors.email}</p> : null}
            </div>
            <div className="field-group">
              {fieldLabel("LINE ID", "lineId", "選填")}
              <input id="lineId" className="field" placeholder="your-line-id" aria-label="LINE ID" autoComplete="nickname" value={form.lineId} onChange={(e) => updateField("lineId", e.target.value)} />
            </div>
            <div className="field-group md:col-span-2">
              {fieldLabel("完整收件地址", "address", "必填")}
              <textarea id="address" className="field min-h-[112px] resize-none" required placeholder="縣市、區域、路名與門牌" aria-label="收件地址" aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? "address-error" : undefined} autoComplete="street-address" value={form.address} onChange={(e) => updateField("address", e.target.value)} />
              {errors.address ? <p id="address-error" className="text-sm text-rosegold">{errors.address}</p> : null}
            </div>
          </div>
        </fieldset>

        <fieldset className="glass-panel min-w-0 p-5 md:p-7">
          <legend className="sr-only">補充需求並送出</legend>
          {stepHeader("03", "補充需求並送出", "如有包裝、企業送禮或指定時程，可在此說明。")}
          <div className="field-group">
            {fieldLabel("備註", "note", "選填")}
            <textarea id="note" className="field min-h-[132px] resize-none" placeholder="例如：希望加購提袋、企業腰封、分批配送" aria-label="備註" value={form.note} onChange={(e) => updateField("note", e.target.value)} />
          </div>
          <div className="mt-5 flex flex-col gap-4 border-t border-champagne/12 pt-5 md:flex-row md:items-center md:justify-between">
            <p id="order-submit-note" className="max-w-xl text-sm leading-7 text-ink/58">
              送出後不會立即產生付款；顧問會先確認規格、報價與配送日期。
            </p>
            <button
              className="min-h-[52px] w-full shrink-0 rounded-full bg-ink px-7 py-3 text-sm text-pearl transition hover:-translate-y-0.5 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
              disabled={submitting}
              aria-describedby="order-submit-note"
            >
              {submitting ? "正在建立需求..." : "確認並送出"}
            </button>
          </div>
        </fieldset>
      </form>

      <aside className="order-summary glass-panel hidden min-w-0 overflow-hidden lg:sticky lg:top-28 lg:block">
        {selectedProduct ? (
          <>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image src={withBasePath(selectedProduct.images[0])} alt={selectedProduct.nameZh} fill sizes="(max-width: 1024px) 100vw, 340px" className="object-cover" />
            </div>
            <div className="space-y-5 p-5 md:p-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-champagne">Your Selection</p>
                <h2 className="mt-2 font-display text-[1.65rem] leading-tight text-ink">{selectedProduct.nameZh}</h2>
                <p className="mt-2 text-sm leading-6 text-ink/55">{selectedProduct.summary}</p>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-[1rem] border border-champagne/12 bg-white/55 p-3">
                  <dt className="text-xs text-ink/42">規格</dt>
                  <dd className="mt-1 text-ink/72">{form.option}</dd>
                </div>
                <div className="rounded-[1rem] border border-champagne/12 bg-white/55 p-3">
                  <dt className="text-xs text-ink/42">數量</dt>
                  <dd className="mt-1 text-ink/72">{form.quantity}</dd>
                </div>
              </dl>
              <div className="flex items-end justify-between gap-4 border-y border-champagne/12 py-4">
                <span className="text-xs uppercase tracking-[0.18em] text-ink/42">參考價格</span>
                <strong className="font-display text-xl text-ink">{formatCurrency(selectedProduct.price)}</strong>
              </div>
              <Link href={`/products/${selectedProduct.slug}`} className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-champagne/25 text-sm text-ink transition hover:bg-white/75">
                返回商品詳情
              </Link>
            </div>
          </>
        ) : null}
        <div className="border-t border-champagne/12 bg-cream/35 p-5 md:p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-champagne" />
            <div>
              <p className="text-sm text-ink">先確認，再安排</p>
              <p className="mt-1 text-xs leading-6 text-ink/52">正式報價與配送日期會由顧問確認，送出此表單不代表付款完成。</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
