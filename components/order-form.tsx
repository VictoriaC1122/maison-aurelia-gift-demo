"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck
} from "lucide-react";
import { contact } from "@/lib/content";
import type { Product } from "@/lib/types";
import { cn, formatCurrency, withBasePath } from "@/lib/utils";

const DEMO_ORDER_KEY = "maison-aurelia-demo-orders";
const CATEGORY_LABELS: Record<string, string> = {
  benyang: "燕序・本養",
  shenyang: "燕序・深養",
  factory: "越南燕廠"
};

const CHECKOUT_STEPS = [
  { step: 1, label: "確認商品", shortLabel: "商品" },
  { step: 2, label: "收件資料", shortLabel: "收件" },
  { step: 3, label: "確認送出", shortLabel: "確認" }
] as const;

type CheckoutStep = (typeof CHECKOUT_STEPS)[number]["step"];

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

const PRODUCT_FIELDS: Array<keyof OrderFormState> = ["productName", "category", "quantity", "option"];
const CONTACT_FIELDS: Array<keyof OrderFormState> = ["customerName", "phone", "email", "address"];

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

function errorsForFields(errors: OrderFormErrors, fields: Array<keyof OrderFormState>) {
  return fields.reduce<OrderFormErrors>((result, field) => {
    if (errors[field]) result[field] = errors[field];
    return result;
  }, {});
}

export function OrderForm({ products, defaultProductSlug }: { products: Product[]; defaultProductSlug?: string }) {
  const searchParams = useSearchParams();
  const requestedSlug = searchParams.get("product") ?? defaultProductSlug;
  const defaultProduct = useMemo(
    () => products.find((product) => product.slug === requestedSlug) ?? products[0],
    [products, requestedSlug]
  );
  const [activeStep, setActiveStep] = useState<CheckoutStep>(1);
  const [furthestStep, setFurthestStep] = useState<CheckoutStep>(1);
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
  const minDeliveryDate = new Date().toISOString().split("T")[0];

  function updateField<K extends keyof OrderFormState>(field: K, value: OrderFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  }

  function focusField(field?: keyof OrderFormState) {
    if (!field) return;
    window.setTimeout(() => document.getElementById(field)?.focus(), 80);
  }

  function scrollToProgress() {
    window.requestAnimationFrame(() => {
      document.getElementById("checkout-progress")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function validateCurrentStep(step: CheckoutStep) {
    const allErrors = buildErrors(form);
    const fields = step === 1 ? PRODUCT_FIELDS : CONTACT_FIELDS;
    const stepErrors = errorsForFields(allErrors, fields);
    const firstInvalid = fields.find((field) => stepErrors[field]);

    if (firstInvalid) {
      setErrors((current) => ({ ...current, ...stepErrors }));
      setSubmitError("請先完成這一步的必填欄位。");
      focusField(firstInvalid);
      return false;
    }

    setSubmitError("");
    return true;
  }

  function continueTo(nextStep: CheckoutStep) {
    if (activeStep < 3 && !validateCurrentStep(activeStep)) return;
    setActiveStep(nextStep);
    setFurthestStep((current) => Math.max(current, nextStep) as CheckoutStep);
    scrollToProgress();
  }

  function jumpToStep(step: CheckoutStep) {
    if (step > furthestStep) return;
    setActiveStep(step);
    setSubmitError("");
    scrollToProgress();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = buildErrors(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitError("請先完成表單中的必填欄位。");
      const productError = PRODUCT_FIELDS.find((field) => nextErrors[field]);
      const contactError = CONTACT_FIELDS.find((field) => nextErrors[field]);
      const targetStep: CheckoutStep = productError ? 1 : 2;
      setActiveStep(targetStep);
      focusField(productError ?? contactError);
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
      <label htmlFor={htmlFor} className="field-label">
        {label}
        {hint ? <span className="field-hint">{hint}</span> : null}
      </label>
    );
  }

  function panelHeading(eyebrow: string, title: string, description: string) {
    return (
      <div className="mb-6 border-b border-champagne/14 pb-5">
        <p className="text-[10px] uppercase tracking-[0.28em] text-champagne">{eyebrow}</p>
        <h2 className="mt-2 font-display text-[1.65rem] leading-tight text-ink md:text-[2rem]">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-ink/52">{description}</p>
      </div>
    );
  }

  if (successId) {
    return (
      <section role="status" aria-live="polite" className="paper-panel mx-auto max-w-4xl overflow-hidden p-6 md:p-10">
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
            <div key={item.step} className="rounded-[1.15rem] border border-champagne/14 bg-white/55 p-4 text-center">
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
      <div className="min-w-0 space-y-5">
        {selectedProduct ? (
          <section aria-label="目前選擇的商品" className="paper-panel flex min-w-0 items-center gap-4 p-4 lg:hidden">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1rem] sm:h-24 sm:w-24">
              <Image src={withBasePath(selectedProduct.images[0])} alt={selectedProduct.nameZh} fill sizes="96px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne">目前選擇</p>
              <h2 className="mt-1 truncate font-display text-lg text-ink">{selectedProduct.nameZh}</h2>
              <p className="mt-1 text-sm text-ink/55">{form.option}・數量 {form.quantity}</p>
            </div>
          </section>
        ) : null}

        <nav id="checkout-progress" aria-label="訂購進度" className="checkout-progress scroll-mt-28 rounded-[1.45rem] border border-champagne/14 bg-[rgba(255,253,249,0.76)] p-2">
          <ol className="grid grid-cols-3 gap-1.5">
            {CHECKOUT_STEPS.map((item) => {
              const isActive = item.step === activeStep;
              const isComplete = item.step < activeStep || item.step < furthestStep;
              const isAvailable = item.step <= furthestStep;
              return (
                <li key={item.step}>
                  <button
                    type="button"
                    disabled={!isAvailable}
                    aria-current={isActive ? "step" : undefined}
                    onClick={() => jumpToStep(item.step)}
                    className={cn(
                      "checkout-progress__step flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[1rem] px-2 text-sm transition",
                      isActive ? "bg-ink text-pearl shadow-[0_10px_24px_rgba(24,17,12,0.12)]" : "text-ink/48",
                      isAvailable && !isActive ? "hover:bg-white/70 hover:text-ink" : "",
                      !isAvailable ? "cursor-default opacity-45" : ""
                    )}
                  >
                    <span className={cn("inline-flex h-6 w-6 items-center justify-center rounded-full border text-[10px]", isActive ? "border-pearl/24" : "border-champagne/22")}>
                      {isComplete && !isActive ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : item.step}
                    </span>
                    <span className="hidden sm:inline">{item.label}</span>
                    <span className="sm:hidden">{item.shortLabel}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <form noValidate onSubmit={onSubmit} aria-busy={submitting} className="min-w-0">
          {submitError ? (
            <div role="alert" className="mb-4 rounded-[1.15rem] border border-rosegold/18 bg-rosegold/10 px-4 py-3 text-sm text-ink/76">
              {submitError}
            </div>
          ) : null}

          {activeStep === 1 ? (
            <fieldset className="paper-panel min-w-0 p-5 md:p-7">
              <legend className="sr-only">確認商品與數量</legend>
              {panelHeading("Step 01", "確認商品", "選擇品項、數量與希望配送日期。")}
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
                    value={products.find((product) => product.nameZh === form.productName)?.slug ?? defaultProduct?.slug ?? ""}
                    onChange={(event) => handleProductChange(event.target.value)}
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
                      onChange={(event) => updateField("quantity", Number(event.target.value))}
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
                  <input id="option" className="field" required placeholder="例：6 x 75ml" aria-label="規格" aria-invalid={Boolean(errors.option)} aria-describedby={errors.option ? "option-error" : undefined} value={form.option} onChange={(event) => updateField("option", event.target.value)} />
                  {errors.option ? <p id="option-error" className="text-sm text-rosegold">{errors.option}</p> : null}
                </div>
                <div className="field-group">
                  {fieldLabel("希望配送日期", "preferredDeliveryDate", "選填")}
                  <input id="preferredDeliveryDate" className="field" aria-label="希望配送日期" type="date" min={minDeliveryDate} value={form.preferredDeliveryDate} onChange={(event) => updateField("preferredDeliveryDate", event.target.value)} />
                </div>
              </div>
              <div className="mt-6 flex justify-end border-t border-champagne/14 pt-5">
                <button type="button" onClick={() => continueTo(2)} className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-ink px-7 text-sm text-pearl transition hover:-translate-y-0.5 active:scale-[0.99] sm:w-auto">
                  下一步：收件資料 <ChevronRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            </fieldset>
          ) : null}

          {activeStep === 2 ? (
            <fieldset className="paper-panel min-w-0 p-5 md:p-7">
              <legend className="sr-only">填寫收件與聯絡資料</legend>
              {panelHeading("Step 02", "收件與聯絡資料", "顧問將透過以下資料確認訂購細節。")}
              <div className="grid gap-4 md:grid-cols-2 md:gap-5">
                <div className="field-group">
                  {fieldLabel("收件人姓名", "customerName", "必填")}
                  <input id="customerName" className="field" required placeholder="請填寫收件人姓名" aria-label="客戶姓名" aria-invalid={Boolean(errors.customerName)} aria-describedby={errors.customerName ? "customerName-error" : undefined} autoComplete="name" value={form.customerName} onChange={(event) => updateField("customerName", event.target.value)} />
                  {errors.customerName ? <p id="customerName-error" className="text-sm text-rosegold">{errors.customerName}</p> : null}
                </div>
                <div className="field-group">
                  {fieldLabel("聯絡電話", "phone", "必填")}
                  <input id="phone" className="field" required placeholder="09xx xxx xxx" aria-label="聯絡電話" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} autoComplete="tel" inputMode="tel" type="tel" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />
                  {errors.phone ? <p id="phone-error" className="text-sm text-rosegold">{errors.phone}</p> : null}
                </div>
                <div className="field-group">
                  {fieldLabel("Email", "email", "必填")}
                  <input id="email" className="field" required placeholder="you@example.com" aria-label="Email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} autoComplete="email" inputMode="email" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
                  {errors.email ? <p id="email-error" className="text-sm text-rosegold">{errors.email}</p> : null}
                </div>
                <div className="field-group">
                  {fieldLabel("LINE ID", "lineId", "選填")}
                  <input id="lineId" className="field" placeholder="your-line-id" aria-label="LINE ID" autoComplete="nickname" value={form.lineId} onChange={(event) => updateField("lineId", event.target.value)} />
                </div>
                <div className="field-group md:col-span-2">
                  {fieldLabel("完整收件地址", "address", "必填")}
                  <textarea id="address" className="field min-h-[112px] resize-none" required placeholder="縣市、區域、路名與門牌" aria-label="收件地址" aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? "address-error" : undefined} autoComplete="street-address" value={form.address} onChange={(event) => updateField("address", event.target.value)} />
                  {errors.address ? <p id="address-error" className="text-sm text-rosegold">{errors.address}</p> : null}
                </div>
              </div>
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-champagne/14 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={() => jumpToStep(1)} className="inline-flex min-h-[48px] items-center justify-center gap-2 px-4 text-sm text-ink/62 transition hover:text-ink">
                  <ChevronLeft aria-hidden="true" className="h-4 w-4" /> 返回商品
                </button>
                <button type="button" onClick={() => continueTo(3)} className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-ink px-7 text-sm text-pearl transition hover:-translate-y-0.5 active:scale-[0.99]">
                  下一步：確認內容 <ChevronRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            </fieldset>
          ) : null}

          {activeStep === 3 ? (
            <fieldset className="paper-panel min-w-0 p-5 md:p-7">
              <legend className="sr-only">確認訂購資料並送出</legend>
              {panelHeading("Step 03", "最後確認", "確認商品與收件資料後，再送出訂購需求。")}
              <div className="grid gap-4 md:grid-cols-2">
                <section className="rounded-[1.2rem] border border-champagne/14 bg-cream/38 p-4 md:p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display text-lg text-ink">商品內容</h3>
                    <button type="button" onClick={() => jumpToStep(1)} className="min-h-[44px] text-sm text-ink/52 underline decoration-champagne/40 underline-offset-4">修改</button>
                  </div>
                  <dl className="mt-3 space-y-3 text-sm">
                    <div>
                      <dt className="text-ink/40">品項</dt>
                      <dd className="mt-1 text-ink/76">{form.productName}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><dt className="text-ink/40">規格</dt><dd className="mt-1 text-ink/76">{form.option}</dd></div>
                      <div><dt className="text-ink/40">數量</dt><dd className="mt-1 text-ink/76">{form.quantity}</dd></div>
                    </div>
                    <div><dt className="text-ink/40">希望日期</dt><dd className="mt-1 text-ink/76">{form.preferredDeliveryDate || "未指定"}</dd></div>
                  </dl>
                </section>
                <section className="rounded-[1.2rem] border border-champagne/14 bg-cream/38 p-4 md:p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display text-lg text-ink">收件資料</h3>
                    <button type="button" onClick={() => jumpToStep(2)} className="min-h-[44px] text-sm text-ink/52 underline decoration-champagne/40 underline-offset-4">修改</button>
                  </div>
                  <dl className="mt-3 space-y-3 text-sm">
                    <div><dt className="text-ink/40">收件人</dt><dd className="mt-1 text-ink/76">{form.customerName}</dd></div>
                    <div><dt className="text-ink/40">聯絡方式</dt><dd className="mt-1 break-all text-ink/76">{form.phone}<br />{form.email}{form.lineId ? <><br />LINE：{form.lineId}</> : null}</dd></div>
                    <div><dt className="text-ink/40">地址</dt><dd className="mt-1 break-words text-ink/76">{form.address}</dd></div>
                  </dl>
                </section>
              </div>
              <div className="field-group mt-5">
                {fieldLabel("補充需求", "note", "選填")}
                <textarea id="note" className="field min-h-[124px] resize-none" placeholder="例如：希望加購提袋、企業腰封、分批配送" aria-label="備註" value={form.note} onChange={(event) => updateField("note", event.target.value)} />
              </div>
              <div className="mt-5 flex items-start gap-3 rounded-[1.1rem] border border-champagne/14 bg-white/52 p-4 text-sm leading-7 text-ink/58">
                <ShieldCheck aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-champagne" />
                <p id="order-submit-note">送出後不會立即付款；顧問會先確認規格、正式報價與配送日期。</p>
              </div>
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-champagne/14 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={() => jumpToStep(2)} className="inline-flex min-h-[48px] items-center justify-center gap-2 px-4 text-sm text-ink/62 transition hover:text-ink">
                  <ChevronLeft aria-hidden="true" className="h-4 w-4" /> 返回收件資料
                </button>
                <button
                  className="min-h-[52px] rounded-full bg-ink px-8 py-3 text-sm text-pearl transition hover:-translate-y-0.5 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={submitting}
                  aria-describedby="order-submit-note"
                >
                  {submitting ? "正在建立需求..." : "確認並送出需求"}
                </button>
              </div>
            </fieldset>
          ) : null}
        </form>
      </div>

      <aside className="order-summary paper-panel hidden min-w-0 overflow-hidden lg:sticky lg:top-28 lg:block">
        {selectedProduct ? (
          <>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image src={withBasePath(selectedProduct.images[0])} alt={selectedProduct.nameZh} fill sizes="340px" className="object-cover" />
            </div>
            <div className="space-y-5 p-5 md:p-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-champagne">Your Selection</p>
                <h2 className="mt-2 font-display text-[1.65rem] leading-tight text-ink">{selectedProduct.nameZh}</h2>
                <p className="mt-2 text-sm leading-6 text-ink/55">{selectedProduct.summary}</p>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-[1rem] border border-champagne/12 bg-cream/38 p-3">
                  <dt className="text-xs text-ink/42">規格</dt>
                  <dd className="mt-1 text-ink/72">{form.option}</dd>
                </div>
                <div className="rounded-[1rem] border border-champagne/12 bg-cream/38 p-3">
                  <dt className="text-xs text-ink/42">數量</dt>
                  <dd className="mt-1 text-ink/72">{form.quantity}</dd>
                </div>
              </dl>
              <div className="flex items-end justify-between gap-4 border-y border-champagne/12 py-4">
                <span className="text-xs uppercase tracking-[0.18em] text-ink/42">{selectedProduct.price ? "商品售價" : "報價方式"}</span>
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
