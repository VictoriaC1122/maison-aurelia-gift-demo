"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, ExternalLink, Lock, MapPin, ShieldCheck, ShoppingBag, Store, Truck } from "lucide-react";
import { CartTotals } from "@/components/cart-drawer";
import { useLocale } from "@/components/locale-provider";
import zipcodes from "@/data/tw-zipcodes.json";
import { useCart } from "@/lib/cart";
import {
  baseShippingFee,
  enabledDeliveryOptions,
  enabledPaymentOptions,
  type DeliveryOption
} from "@/lib/commerce";
import { contact, getProducts, productName, site } from "@/lib/content";
import type { Messages } from "@/lib/i18n";
import { isSupabaseConfigured, notifyNewOrder, submitOrder, type CheckoutPayload } from "@/lib/orders-client";
import { displaySpecification, formatTWD, parsePrice, summarizeCart } from "@/lib/pricing";
import type { DeliveryMethod, PaymentMethod } from "@/lib/types";
import { cn, withBasePath } from "@/lib/utils";

const ZIPCODES = zipcodes as unknown as Record<string, Array<[string, string]>>;
const COUNTIES = Object.keys(ZIPCODES);

/** 英文版的縣市名稱（地址仍以中文送出，方便物流配送） */
const COUNTY_EN: Record<string, string> = {
  臺北市: "Taipei City", 基隆市: "Keelung City", 新北市: "New Taipei City", 連江縣: "Lienchiang County",
  宜蘭縣: "Yilan County", 新竹市: "Hsinchu City", 新竹縣: "Hsinchu County", 桃園市: "Taoyuan City",
  苗栗縣: "Miaoli County", 臺中市: "Taichung City", 彰化縣: "Changhua County", 南投縣: "Nantou County",
  嘉義市: "Chiayi City", 嘉義縣: "Chiayi County", 雲林縣: "Yunlin County", 臺南市: "Tainan City",
  高雄市: "Kaohsiung City", 澎湖縣: "Penghu County", 金門縣: "Kinmen County", 屏東縣: "Pingtung County",
  臺東縣: "Taitung County", 花蓮縣: "Hualien County"
};

type FormState = {
  customerName: string;
  phone: string;
  email: string;
  lineId: string;
  deliveryMethod: DeliveryMethod;
  city: string;
  district: string;
  detail: string;
  storeId: string;
  storeName: string;
  paymentMethod: PaymentMethod;
  preferredDeliveryDate: string;
  note: string;
};

type FieldName = keyof FormState | "consent";
type Errors = Partial<Record<FieldName, string>>;

const FIELD_ORDER: FieldName[] = [
  "customerName",
  "phone",
  "email",
  "city",
  "district",
  "detail",
  "storeId",
  "storeName",
  "consent"
];

function normalizePhone(value: string) {
  return value.replace(/[\s-]/g, "");
}

function validate(form: FormState, consent: boolean, text: Messages["checkout"]["errors"]): Errors {
  const errors: Errors = {};
  if (!form.customerName.trim()) errors.customerName = text.name;
  if (!/^09\d{8}$/.test(normalizePhone(form.phone))) errors.phone = text.phone;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = text.email;
  if (form.deliveryMethod === "home") {
    if (!form.city) errors.city = text.city;
    if (!form.district) errors.district = text.district;
    if (!form.detail.trim()) errors.detail = text.detail;
  } else {
    if (!/^\d{5,6}$/.test(form.storeId.trim())) errors.storeId = text.storeId;
    if (!form.storeName.trim()) errors.storeName = text.storeName;
  }
  if (!consent) errors.consent = text.consent;
  return errors;
}

function Section({ step, title, icon, children }: { step: number; title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="paper-panel p-5 md:p-7">
      <h2 className="mb-5 flex items-center gap-3 border-b border-champagne/14 pb-4 font-display text-xl text-ink md:text-2xl">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs text-pearl">{step}</span>
        {title}
        <span className="ml-auto text-gold">{icon}</span>
      </h2>
      {children}
    </section>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={`${id}-error`} className="text-sm text-[#a2533f]">
      {message}
    </p>
  ) : null;
}

export function CheckoutForm() {
  const { ready, lines, clear, open } = useCart();
  const { locale, t: messages, href } = useLocale();
  const t = messages.checkout;
  const deliveryOptions = enabledDeliveryOptions(locale);
  const paymentOptions = enabledPaymentOptions(locale);
  const [form, setForm] = useState<FormState>({
    customerName: "",
    phone: "",
    email: "",
    lineId: "",
    deliveryMethod: deliveryOptions[0]?.id ?? "home",
    city: "",
    district: "",
    detail: "",
    storeId: "",
    storeName: "",
    paymentMethod: paymentOptions[0]?.id ?? "bank_transfer",
    preferredDeliveryDate: "",
    note: ""
  });
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState<{ orderId: string; paymentMethod: PaymentMethod } | null>(null);

  const summary = useMemo(
    () => summarizeCart(lines, getProducts(), baseShippingFee(form.deliveryMethod)),
    [lines, form.deliveryMethod]
  );
  const codLimit = site.payment.codLimit ?? null;
  const codBlocked = codLimit !== null && summary.subtotal !== null && summary.subtotal > codLimit;
  useEffect(() => {
    if (codBlocked && form.paymentMethod === "cod") {
      const fallback = paymentOptions.find((option) => option.id !== "cod");
      if (fallback) setForm((current) => ({ ...current, paymentMethod: fallback.id }));
    }
  }, [codBlocked, form.paymentMethod, paymentOptions]);
  const districts = form.city ? ZIPCODES[form.city] ?? [] : [];
  const zip = districts.find(([name]) => name === form.district)?.[1] ?? "";
  const selectedDelivery = deliveryOptions.find((option) => option.id === form.deliveryMethod) as DeliveryOption;
  const minDate = new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0];

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  }

  function fieldProps(name: FieldName) {
    return {
      id: name,
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": errors[name] ? `${name}-error` : undefined
    };
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (summary.lines.length === 0) return;

    const nextErrors = validate(form, consent, t.errors);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitError(t.errors.fix);
      const first = FIELD_ORDER.find((name) => nextErrors[name]);
      if (first) {
        const element = document.getElementById(first);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
        window.setTimeout(() => element?.focus({ preventScroll: true }), 300);
      }
      return;
    }

    if (honeypot) {
      setSuccess({ orderId: "YJY-RECEIVED", paymentMethod: form.paymentMethod });
      return;
    }

    const payload: CheckoutPayload = {
      customerName: form.customerName.trim(),
      phone: normalizePhone(form.phone),
      email: form.email.trim(),
      lineId: form.lineId.trim(),
      items: summary.lines.map((line) => ({
        slug: line.product.slug,
        name: line.product.nameZh,
        spec: displaySpecification(line.product.specification),
        quantity: line.quantity,
        unitPrice: parsePrice(line.product.price)
      })),
      deliveryMethod: form.deliveryMethod,
      delivery:
        form.deliveryMethod === "home"
          ? { zip, city: form.city, district: form.district, detail: form.detail.trim() }
          : { storeId: form.storeId.trim(), storeName: form.storeName.trim().replace(/門市$/, "") },
      paymentMethod: form.paymentMethod,
      preferredDeliveryDate: form.deliveryMethod === "home" ? form.preferredDeliveryDate : "",
      // 英文版下單時在備註標示，方便顧問以英文聯繫
      note: locale === "en" ? `【英文網站訂單】${form.note.trim() ? ` ${form.note.trim()}` : ""}` : form.note.trim()
    };

    setSubmitting(true);
    setSubmitError("");
    try {
      const { orderId, live } = await submitOrder(payload);
      if (live) await notifyNewOrder(orderId, payload);
      clear();
      setSuccess({ orderId, paymentMethod: form.paymentMethod });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError(t.errors.submit(contact.line));
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    const bank = success.paymentMethod === "bank_transfer";
    return (
      <section role="status" aria-live="polite" className="paper-panel mx-auto max-w-3xl p-6 text-center md:p-10">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-champagne/14 text-gold">
          <CheckCircle2 aria-hidden="true" className="h-7 w-7" />
        </span>
        <p className="mt-5 eyebrow">{t.success.eyebrow}</p>
        <h2 className="mt-3 font-display text-[2rem] leading-tight text-ink md:text-[2.6rem]">{t.success.title}</h2>
        <p className="mt-4 text-base leading-8 text-ink/65">
          {t.success.orderNumber} <strong className="text-ink">{success.orderId}</strong>
          <br />
          {t.success.contactNote}
        </p>
        {!isSupabaseConfigured ? (
          <p className="mx-auto mt-4 max-w-lg rounded-2xl border border-rosegold/20 bg-rosegold/10 px-4 py-3 text-sm text-ink/70">
            {t.success.demo}
          </p>
        ) : null}
        <ol className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
          {[
            t.success.stepConfirm,
            bank ? t.success.stepBank : t.success.stepCod,
            t.success.stepShip
          ].map((text, index) => (
            <li key={text} className="rounded-2xl border border-champagne/14 bg-white/55 p-4 text-sm leading-6 text-ink/70">
              <span className="block text-[11px] tracking-[0.2em] text-gold">0{index + 1}</span>
              {text}
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={href(`/track?order=${encodeURIComponent(success.orderId)}`)} className="hero-button-dark min-h-[52px] justify-center px-7">
            {t.success.track}
          </Link>
          <Link href={href("/products")} className="hero-button-light min-h-[52px] justify-center px-7">
            {t.success.continueShopping}
          </Link>
        </div>
        <p className="mt-6 text-sm text-ink/60">{t.success.remember}</p>
      </section>
    );
  }

  if (!ready) {
    // 與空購物車區塊同高，避免載入後版面跳動
    return (
      <div role="status" className="paper-panel mx-auto flex min-h-[22rem] max-w-xl items-center justify-center p-8 text-center text-sm text-ink/60">
        {t.loadingCart}
      </div>
    );
  }

  if (summary.lines.length === 0) {
    return (
      <section className="paper-panel mx-auto flex min-h-[22rem] max-w-xl flex-col items-center justify-center p-8 text-center md:p-10">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-champagne/12 text-gold">
          <ShoppingBag aria-hidden="true" className="h-6 w-6" />
        </span>
        <h2 className="mt-5 font-display text-2xl text-ink">{t.emptyTitle}</h2>
        <p className="mt-2 text-sm leading-7 text-ink/60">{t.emptyText}</p>
        <Link href={href("/products")} className="hero-button-dark mt-6 min-h-[52px] justify-center px-8 md:w-auto">
          {messages.common.shopNow}
        </Link>
      </section>
    );
  }

  const orderSummary = (
    <div className="space-y-5">
      <ul className="divide-y divide-champagne/12">
        {summary.lines.map((line) => (
          <li key={line.product.slug} className="flex items-center gap-3 py-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-champagne/12">
              <Image src={withBasePath(line.product.images[0])} alt={productName(line.product, locale)} fill sizes="64px" className="object-cover" />
              <span className="absolute -right-0 -top-0 inline-flex h-5 min-w-5 items-center justify-center rounded-bl-lg bg-ink px-1 text-[11px] text-pearl">
                {line.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-ink">{productName(line.product, locale)}</p>
              <p className="text-xs text-ink/60">{displaySpecification(line.product.specification, locale)}</p>
            </div>
            <span className="text-sm text-ink">{line.lineTotal === null ? messages.common.priceOnRequest : formatTWD(line.lineTotal)}</span>
          </li>
        ))}
      </ul>
      <button type="button" onClick={open} className="text-sm text-ink/60 underline decoration-champagne/50 underline-offset-4 hover:text-ink">
        {t.editCart}
      </button>
      <CartTotals summary={summary} />
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
      <details className="paper-panel group p-5 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-sm text-ink">
            <ShoppingBag aria-hidden="true" className="h-4 w-4 text-gold" />
            {t.summaryCount(summary.itemCount)}
            <ChevronDown aria-hidden="true" className="h-4 w-4 transition group-open:rotate-180" />
          </span>
          <span className="font-display text-lg text-ink">
            {summary.total === null ? messages.common.priceOnRequest : formatTWD(summary.total)}
          </span>
        </summary>
        <div className="mt-4 border-t border-champagne/14 pt-2">{orderSummary}</div>
      </details>

      <form noValidate onSubmit={onSubmit} aria-busy={submitting} className="min-w-0 space-y-5">
        {!isSupabaseConfigured ? (
          <div className="rounded-2xl border border-rosegold/20 bg-rosegold/10 px-4 py-3 text-sm leading-6 text-ink/72">
            {t.demo}
          </div>
        ) : null}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="company-website">{t.honeypot}</label>
          <input id="company-website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
        </div>

        <Section step={1} title={t.sections.contact} icon={<ShieldCheck aria-hidden="true" className="h-5 w-5" />}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="field-group">
              <label htmlFor="customerName" className="field-label">{t.name}<span className="field-hint">{t.required}</span></label>
              <input {...fieldProps("customerName")} className="field" autoComplete="name" placeholder={t.namePlaceholder} value={form.customerName} onChange={(event) => update("customerName", event.target.value)} />
              <FieldError id="customerName" message={errors.customerName} />
            </div>
            <div className="field-group">
              <label htmlFor="phone" className="field-label">{t.phone}<span className="field-hint">{t.phoneHint}</span></label>
              <input {...fieldProps("phone")} className="field" type="tel" inputMode="tel" autoComplete="tel" placeholder="0912 345 678" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
              <FieldError id="phone" message={errors.phone} />
            </div>
            <div className="field-group">
              <label htmlFor="email" className="field-label">{t.email}<span className="field-hint">{t.required}</span></label>
              <input {...fieldProps("email")} className="field" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(event) => update("email", event.target.value)} />
              <FieldError id="email" message={errors.email} />
            </div>
            <div className="field-group">
              <label htmlFor="lineId" className="field-label">{t.lineId}<span className="field-hint">{t.lineHint}</span></label>
              <input id="lineId" className="field" autoComplete="off" placeholder="your-line-id" value={form.lineId} onChange={(event) => update("lineId", event.target.value)} />
            </div>
          </div>
        </Section>

        <Section step={2} title={t.sections.delivery} icon={<Truck aria-hidden="true" className="h-5 w-5" />}>
          <fieldset>
            <legend className="sr-only">{t.chooseDelivery}</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {deliveryOptions.map((option) => {
                const checked = form.deliveryMethod === option.id;
                return (
                  <label
                    key={option.id}
                    className={cn(
                      "flex cursor-pointer flex-col gap-1 rounded-2xl border p-4 transition",
                      checked ? "border-ink bg-white shadow-[0_8px_20px_rgba(21,18,15,0.06)]" : "border-champagne/20 bg-white/50 hover:border-champagne/45"
                    )}
                  >
                    <span className="flex items-center gap-2 text-sm text-ink">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value={option.id}
                        checked={checked}
                        onChange={() => update("deliveryMethod", option.id)}
                        className="h-4 w-4 accent-[#15120F]"
                      />
                      {option.id === "home" ? <Truck aria-hidden="true" className="h-4 w-4 text-gold" /> : <Store aria-hidden="true" className="h-4 w-4 text-gold" />}
                      {option.label}
                    </span>
                    <span className="pl-6 text-xs leading-5 text-ink/60">{option.description}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {t.taiwanOnly ? <p className="mt-3 text-xs leading-5 text-ink/60">{t.taiwanOnly}</p> : null}

          {form.deliveryMethod === "home" ? (
            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_110px]">
              <div className="field-group">
                <label htmlFor="city" className="field-label">{t.city}</label>
                <select {...fieldProps("city")} className="field" value={form.city} onChange={(event) => { update("city", event.target.value); update("district", ""); }}>
                  <option value="">{t.cityPlaceholder}</option>
                  {COUNTIES.map((county) => (
                    <option key={county} value={county}>
                      {locale === "en" && COUNTY_EN[county] ? `${COUNTY_EN[county]}（${county}）` : county}
                    </option>
                  ))}
                </select>
                <FieldError id="city" message={errors.city} />
              </div>
              <div className="field-group">
                <label htmlFor="district" className="field-label">{t.district}</label>
                <select {...fieldProps("district")} className="field" value={form.district} disabled={!form.city} onChange={(event) => update("district", event.target.value)}>
                  <option value="">{form.city ? t.districtPlaceholder : t.districtFirst}</option>
                  {districts.map(([name, code]) => <option key={`${name}-${code}`} value={name}>{name}</option>)}
                </select>
                <FieldError id="district" message={errors.district} />
              </div>
              <div className="field-group">
                <span className="field-label">{t.zip}</span>
                <div className="flex min-h-[52px] items-center rounded-2xl border border-champagne/15 bg-cream/45 px-4 text-sm text-ink/70">{zip || "—"}</div>
              </div>
              <div className="field-group md:col-span-3">
                <label htmlFor="detail" className="field-label">{t.detail}</label>
                <input {...fieldProps("detail")} className="field" autoComplete="street-address" placeholder={t.detailPlaceholder} value={form.detail} onChange={(event) => update("detail", event.target.value)} />
                <FieldError id="detail" message={errors.detail} />
              </div>
              <div className="field-group md:col-span-2">
                <label htmlFor="preferredDeliveryDate" className="field-label">{t.date}<span className="field-hint">{t.dateHint}</span></label>
                <input id="preferredDeliveryDate" className="field" type="date" min={minDate} value={form.preferredDeliveryDate} onChange={(event) => update("preferredDeliveryDate", event.target.value)} />
              </div>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <a
                href={selectedDelivery.storeMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-2xl border border-champagne/25 bg-white/60 px-4 py-3 text-sm text-ink transition hover:bg-white"
              >
                <span className="flex items-center gap-2">
                  <MapPin aria-hidden="true" className="h-4 w-4 text-gold" />
                  {selectedDelivery.id === "cvs_711" ? messages.delivery.cvs_711.mapButton : messages.delivery.cvs_family.mapButton}
                </span>
                <ExternalLink aria-hidden="true" className="h-4 w-4 text-ink/60" />
              </a>
              <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                <div className="field-group">
                  <label htmlFor="storeId" className="field-label">{t.storeId}</label>
                  <input {...fieldProps("storeId")} className="field" inputMode="numeric" placeholder={selectedDelivery.storeIdHint} value={form.storeId} onChange={(event) => update("storeId", event.target.value.replace(/\D/g, "").slice(0, 6))} />
                  <FieldError id="storeId" message={errors.storeId} />
                </div>
                <div className="field-group">
                  <label htmlFor="storeName" className="field-label">{t.storeName}</label>
                  <input {...fieldProps("storeName")} className="field" placeholder={t.storeNamePlaceholder} value={form.storeName} onChange={(event) => update("storeName", event.target.value)} />
                  <FieldError id="storeName" message={errors.storeName} />
                </div>
              </div>
              <p className="text-xs leading-6 text-ink/60">{t.pickupNote}</p>
            </div>
          )}
        </Section>

        <Section step={3} title={t.sections.payment} icon={<Lock aria-hidden="true" className="h-5 w-5" />}>
          <fieldset className="space-y-3">
            <legend className="sr-only">{t.choosePayment}</legend>
            {paymentOptions.map((option) => {
              const checked = form.paymentMethod === option.id;
              const disabled = option.id === "cod" && codBlocked;
              return (
                <label
                  key={option.id}
                  className={cn(
                    "flex gap-3 rounded-2xl border p-4 transition",
                    disabled ? "cursor-not-allowed border-champagne/15 bg-white/30 opacity-60" : "cursor-pointer",
                    !disabled && (checked ? "border-ink bg-white shadow-[0_8px_20px_rgba(21,18,15,0.06)]" : "border-champagne/20 bg-white/50 hover:border-champagne/45")
                  )}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.id}
                    checked={checked}
                    disabled={disabled}
                    onChange={() => update("paymentMethod", option.id)}
                    className="mt-1 h-4 w-4 accent-[#15120F]"
                  />
                  <span>
                    <span className="block text-sm text-ink">
                      {option.id === "cod" && form.deliveryMethod !== "home" ? messages.payment.cod.labelPickup : option.id === "cod" ? messages.payment.cod.labelHome : option.label}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-ink/60">
                      {disabled && codLimit !== null ? t.codLimit(formatTWD(codLimit)) : option.description}
                    </span>
                  </span>
                </label>
              );
            })}
          </fieldset>
          <div className="field-group mt-5">
            <label htmlFor="note" className="field-label">{t.note}<span className="field-hint">{t.optional}</span></label>
            <textarea id="note" className="field min-h-[104px] resize-y" placeholder={t.notePlaceholder} value={form.note} onChange={(event) => update("note", event.target.value)} />
          </div>
        </Section>

        <div className="paper-panel space-y-4 p-5 md:p-7">
          <label htmlFor="consent" className="flex cursor-pointer items-start gap-3 text-sm leading-7 text-ink/72">
            <input
              {...fieldProps("consent")}
              type="checkbox"
              className="mt-1.5 h-4 w-4 shrink-0 accent-[#15120F]"
              checked={consent}
              onChange={(event) => {
                setConsent(event.target.checked);
                setErrors((current) => ({ ...current, consent: undefined }));
              }}
            />
            <span>
              {t.consent[0]}
              <Link href={href("/privacy")} target="_blank" className="mx-1 underline decoration-champagne/50 underline-offset-4">{t.consent[1]}</Link>
              {t.consent[2]}
              <Link href={href("/returns")} target="_blank" className="ml-1 underline decoration-champagne/50 underline-offset-4">{t.consent[3]}</Link>
              {t.consent[4]}
            </span>
          </label>
          <FieldError id="consent" message={errors.consent} />
          {submitError ? (
            <p role="alert" className="rounded-2xl border border-rosegold/25 bg-rosegold/10 px-4 py-3 text-sm text-ink/76">{submitError}</p>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-ink px-8 text-base text-pearl transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Lock aria-hidden="true" className="h-4 w-4" />
            {submitting ? t.submitting : t.submit}
          </button>
          <p className="text-center text-xs leading-6 text-ink/60">{t.submitNote}</p>
        </div>
      </form>

      <aside className="paper-panel hidden p-6 lg:sticky lg:top-28 lg:block">
        <h2 className="mb-2 font-display text-xl text-ink">{t.summary}</h2>
        {orderSummary}
      </aside>
    </div>
  );
}
