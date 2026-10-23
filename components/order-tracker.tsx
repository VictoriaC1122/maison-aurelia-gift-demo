"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Check, Copy, Landmark, PackageSearch, Truck } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { deliveryLabel, hasBankAccount, paymentLabel } from "@/lib/commerce";
import { contact, getProduct, productName, site } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { reportPayment, trackOrder, type TrackedOrder } from "@/lib/orders-client";
import { displaySpecification, formatTWD } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const STEP_KEYS = ["pending", "confirmed", "shipped", "completed"] as const;

function formatDateTime(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "zh-TW", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date(value));
}

function CopyButton({ value }: { value: string }) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        } catch {
          // 無法存取剪貼簿時忽略
        }
      }}
      className="inline-flex h-8 items-center gap-1 rounded-full border border-champagne/25 px-3 text-xs text-ink/70 hover:bg-white"
    >
      {copied ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : <Copy aria-hidden="true" className="h-3.5 w-3.5" />}
      {copied ? t.track.copied : t.track.copy}
    </button>
  );
}

export function OrderTracker() {
  const { locale, t: messages } = useLocale();
  const t = messages.track;
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [last5, setLast5] = useState("");
  const [reporting, setReporting] = useState(false);
  const [reportMessage, setReportMessage] = useState("");

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("order");
    if (requested) setOrderId(requested);
  }, []);

  async function lookup(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!orderId.trim() || phone.replace(/\D/g, "").length < 8) {
      setError(t.needInput);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await trackOrder(orderId.trim(), phone);
      setOrder(result);
      if (!result) setError(t.notFound);
    } catch {
      setError(t.failed);
    } finally {
      setLoading(false);
    }
  }

  async function submitReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!order) return;
    if (!/^\d{5}$/.test(last5)) {
      setReportMessage(t.reportInvalid);
      return;
    }
    setReporting(true);
    setReportMessage("");
    try {
      const ok = await reportPayment(order.orderId, phone, last5);
      if (ok) {
        setReportMessage(t.reportOk);
        await lookup();
      } else {
        setReportMessage(t.reportRejected);
      }
    } catch {
      setReportMessage(t.reportFailed);
    } finally {
      setReporting(false);
    }
  }

  const stepIndex = order ? STEP_KEYS.findIndex((key) => key === order.status) : -1;
  const steps = STEP_KEYS.map((key, index) => ({ key, label: t.steps[index] }));
  /** 訂單內的商品名稱以中文儲存；英文版依商品代碼顯示英文名稱 */
  const itemName = (slug: string, fallback: string) => {
    const product = getProduct(slug);
    return product ? productName(product, locale) : fallback;
  };
  const itemSpec = (slug: string, fallback: string) => {
    const product = getProduct(slug);
    return product && locale === "en" ? displaySpecification(product.specification, locale) : fallback;
  };
  const colon = locale === "en" ? ": " : "：";
  const bank = site.payment.bankAccount;
  const showBankInfo =
    order &&
    order.paymentMethod === "bank_transfer" &&
    order.status !== "cancelled" &&
    (order.paymentStatus === "unpaid" || order.paymentStatus === "reported");

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
      <form onSubmit={lookup} className="paper-panel space-y-4 p-5 md:p-6">
        <div className="field-group">
          <label htmlFor="track-order" className="field-label">{t.orderNumber}</label>
          <input id="track-order" className="field uppercase" placeholder="YJY-20261024-0001" value={orderId} onChange={(event) => setOrderId(event.target.value)} />
        </div>
        <div className="field-group">
          <label htmlFor="track-phone" className="field-label">{t.phone}</label>
          <input id="track-phone" className="field" type="tel" inputMode="tel" placeholder="0912 345 678" value={phone} onChange={(event) => setPhone(event.target.value)} />
        </div>
        {error ? <p role="alert" className="text-sm text-[#a2533f]">{error}</p> : null}
        <button disabled={loading} className="hero-button-dark min-h-[52px] w-full justify-center gap-2 disabled:opacity-50">
          <PackageSearch aria-hidden="true" className="h-4 w-4" />
          {loading ? t.loading : t.submit}
        </button>
        <p className="text-xs leading-6 text-ink/50">
          {t.help(contact.line, contact.phone)}
        </p>
      </form>

      {order ? (
        <section aria-live="polite" className="paper-panel space-y-6 p-5 md:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-2xl text-ink">{order.orderId}</h2>
            <span className="text-sm text-ink/50">{t.placedAt} {formatDateTime(order.createdAt, locale)}</span>
          </div>

          {order.status === "cancelled" ? (
            <p className="rounded-2xl border border-rosegold/25 bg-rosegold/10 px-4 py-3 text-sm text-ink/75">{t.cancelled}</p>
          ) : (
            <ol className="flex items-center">
              {steps.map((step, index) => {
                const done = index <= stepIndex;
                return (
                  <li key={step.key} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-2">
                      <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-full border text-xs", done ? "border-ink bg-ink text-pearl" : "border-champagne/30 bg-white text-ink/40")}>
                        {done ? <Check aria-hidden="true" className="h-4 w-4" /> : index + 1}
                      </span>
                      <span className={cn("whitespace-nowrap text-xs", done ? "text-ink" : "text-ink/45")}>{step.label}</span>
                    </div>
                    {index < steps.length - 1 ? (
                      <span className={cn("mx-2 mb-6 h-px flex-1", index < stepIndex ? "bg-ink" : "bg-champagne/30")} />
                    ) : null}
                  </li>
                );
              })}
            </ol>
          )}

          <div>
            <h3 className="mb-2 text-sm text-ink/55">{t.items}</h3>
            {order.items.length > 0 ? (
              <ul className="divide-y divide-champagne/12 rounded-2xl border border-champagne/14 bg-white/50 px-4">
                {order.items.map((item) => (
                  <li key={`${item.slug}-${item.name}`} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <span className="text-ink">{itemName(item.slug, item.name)}<span className="ml-2 text-xs text-ink/45">{itemSpec(item.slug, item.spec)}</span></span>
                    <span className="text-ink/70">x {item.quantity}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink">{t.totalQuantity(order.productName, order.quantity)}</p>
            )}
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-champagne/14 bg-white/50 p-4">
              <dt className="flex items-center gap-2 text-xs text-ink/50"><Truck aria-hidden="true" className="h-4 w-4 text-champagne" />{t.delivery}</dt>
              <dd className="mt-1 text-sm text-ink">{deliveryLabel(order.deliveryMethod, locale)}</dd>
              {order.trackingNumber ? <dd className="mt-1 text-sm text-ink/70">{t.trackingNumber}{colon}{order.trackingNumber}</dd> : null}
            </div>
            <div className="rounded-2xl border border-champagne/14 bg-white/50 p-4">
              <dt className="flex items-center gap-2 text-xs text-ink/50"><Landmark aria-hidden="true" className="h-4 w-4 text-champagne" />{t.payment}</dt>
              <dd className="mt-1 text-sm text-ink">{paymentLabel(order.paymentMethod, locale)}{locale === "en" ? " · " : "・"}{messages.paymentStatus[order.paymentStatus]}</dd>
              <dd className="mt-1 text-sm text-ink/70">
                {t.amountDue}{colon}{order.quotedTotal !== null ? <strong className="text-ink">{formatTWD(order.quotedTotal)}</strong> : t.amountPending}
              </dd>
            </div>
          </dl>

          {showBankInfo ? (
            <div className="space-y-4 rounded-2xl border border-champagne/25 bg-cream/50 p-5">
              <h3 className="font-display text-lg text-ink">{t.bankTitle}</h3>
              {order.quotedTotal === null ? (
                <p className="text-sm leading-7 text-ink/65">{t.bankPending}</p>
              ) : hasBankAccount() ? (
                <dl className="space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-3"><dt className="text-ink/55">{t.bank}</dt><dd className="text-ink">{bank.bankName}{bank.bankCode ? `（${bank.bankCode}）` : ""}{bank.branch ? ` ${bank.branch}` : ""}</dd></div>
                  <div className="flex items-center justify-between gap-3"><dt className="text-ink/55">{t.account}</dt><dd className="flex items-center gap-2 text-ink">{bank.accountNumber}<CopyButton value={bank.accountNumber} /></dd></div>
                  {bank.accountName ? <div className="flex items-center justify-between gap-3"><dt className="text-ink/55">{t.accountName}</dt><dd className="text-ink">{bank.accountName}</dd></div> : null}
                  <div className="flex items-center justify-between gap-3"><dt className="text-ink/55">{t.amount}</dt><dd className="font-display text-lg text-ink">{formatTWD(order.quotedTotal)}</dd></div>
                  <p className="pt-1 text-xs text-ink/50">{t.deadline(site.payment.transferDeadlineDays)}</p>
                </dl>
              ) : (
                <p className="text-sm leading-7 text-ink/65">{t.bankByAdvisor}</p>
              )}

              {order.paymentStatus === "reported" ? (
                <p className="rounded-xl bg-white/70 px-4 py-3 text-sm text-ink/70">{t.reported(order.paymentLast5 ?? "")}</p>
              ) : (
                <form onSubmit={submitReport} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="field-group flex-1">
                    <label htmlFor="last5" className="field-label">{t.reportLabel}</label>
                    <input id="last5" className="field" inputMode="numeric" maxLength={5} placeholder="12345" value={last5} onChange={(event) => setLast5(event.target.value.replace(/\D/g, "").slice(0, 5))} />
                  </div>
                  <button disabled={reporting} className="hero-button-dark min-h-[52px] justify-center px-6 disabled:opacity-50">
                    {reporting ? t.reporting : t.report}
                  </button>
                </form>
              )}
              {reportMessage ? <p role="status" className="text-sm text-ink/70">{reportMessage}</p> : null}
            </div>
          ) : null}
        </section>
      ) : (
        <section className="paper-panel hidden items-center justify-center p-10 text-center text-sm leading-7 text-ink/50 lg:flex lg:min-h-[320px]">
          {t.placeholder}
        </section>
      )}
    </div>
  );
}
