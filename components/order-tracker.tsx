"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Check, Copy, Landmark, PackageSearch, Truck } from "lucide-react";
import {
  PAYMENT_STATUS_LABELS,
  deliveryLabel,
  hasBankAccount,
  paymentLabel
} from "@/lib/commerce";
import { contact, site } from "@/lib/content";
import { reportPayment, trackOrder, type TrackedOrder } from "@/lib/orders-client";
import { formatTWD } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "pending", label: "已收到訂單" },
  { key: "confirmed", label: "已確認" },
  { key: "shipped", label: "已出貨" },
  { key: "completed", label: "已完成" }
] as const;

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("zh-TW", {
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
      {copied ? "已複製" : "複製"}
    </button>
  );
}

export function OrderTracker() {
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
      setError("請輸入訂單編號與下單手機號碼。");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await trackOrder(orderId.trim(), phone);
      setOrder(result);
      if (!result) setError("查無這筆訂單，請確認訂單編號與手機號碼是否正確。");
    } catch {
      setError("目前無法查詢，請稍後再試。");
    } finally {
      setLoading(false);
    }
  }

  async function submitReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!order) return;
    if (!/^\d{5}$/.test(last5)) {
      setReportMessage("請輸入匯款帳號後五碼（5 位數字）。");
      return;
    }
    setReporting(true);
    setReportMessage("");
    try {
      const ok = await reportPayment(order.orderId, phone, last5);
      if (ok) {
        setReportMessage("已收到你的匯款回報，確認入帳後會更新付款狀態。");
        await lookup();
      } else {
        setReportMessage("這筆訂單目前無法回報匯款，請直接與我們聯繫。");
      }
    } catch {
      setReportMessage("回報失敗，請稍後再試。");
    } finally {
      setReporting(false);
    }
  }

  const stepIndex = order ? STEPS.findIndex((step) => step.key === order.status) : -1;
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
          <label htmlFor="track-order" className="field-label">訂單編號</label>
          <input id="track-order" className="field uppercase" placeholder="YJY-20261024-0001" value={orderId} onChange={(event) => setOrderId(event.target.value)} />
        </div>
        <div className="field-group">
          <label htmlFor="track-phone" className="field-label">下單手機號碼</label>
          <input id="track-phone" className="field" type="tel" inputMode="tel" placeholder="0912 345 678" value={phone} onChange={(event) => setPhone(event.target.value)} />
        </div>
        {error ? <p role="alert" className="text-sm text-[#a2533f]">{error}</p> : null}
        <button disabled={loading} className="hero-button-dark min-h-[52px] w-full justify-center gap-2 disabled:opacity-50">
          <PackageSearch aria-hidden="true" className="h-4 w-4" />
          {loading ? "查詢中…" : "查詢訂單"}
        </button>
        <p className="text-xs leading-6 text-ink/50">
          找不到訂單編號？請透過 LINE（{contact.line}）或電話 {contact.phone} 與我們聯繫。
        </p>
      </form>

      {order ? (
        <section aria-live="polite" className="paper-panel space-y-6 p-5 md:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-2xl text-ink">{order.orderId}</h2>
            <span className="text-sm text-ink/50">下單時間 {formatDateTime(order.createdAt)}</span>
          </div>

          {order.status === "cancelled" ? (
            <p className="rounded-2xl border border-rosegold/25 bg-rosegold/10 px-4 py-3 text-sm text-ink/75">此訂單已取消，如有疑問請與我們聯繫。</p>
          ) : (
            <ol className="flex items-center">
              {STEPS.map((step, index) => {
                const done = index <= stepIndex;
                return (
                  <li key={step.key} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-2">
                      <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-full border text-xs", done ? "border-ink bg-ink text-pearl" : "border-champagne/30 bg-white text-ink/40")}>
                        {done ? <Check aria-hidden="true" className="h-4 w-4" /> : index + 1}
                      </span>
                      <span className={cn("whitespace-nowrap text-xs", done ? "text-ink" : "text-ink/45")}>{step.label}</span>
                    </div>
                    {index < STEPS.length - 1 ? (
                      <span className={cn("mx-2 mb-6 h-px flex-1", index < stepIndex ? "bg-ink" : "bg-champagne/30")} />
                    ) : null}
                  </li>
                );
              })}
            </ol>
          )}

          <div>
            <h3 className="mb-2 text-sm text-ink/55">訂購商品</h3>
            {order.items.length > 0 ? (
              <ul className="divide-y divide-champagne/12 rounded-2xl border border-champagne/14 bg-white/50 px-4">
                {order.items.map((item) => (
                  <li key={`${item.slug}-${item.name}`} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <span className="text-ink">{item.name}<span className="ml-2 text-xs text-ink/45">{item.spec}</span></span>
                    <span className="text-ink/70">x {item.quantity}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink">{order.productName}（共 {order.quantity} 件）</p>
            )}
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-champagne/14 bg-white/50 p-4">
              <dt className="flex items-center gap-2 text-xs text-ink/50"><Truck aria-hidden="true" className="h-4 w-4 text-champagne" />配送</dt>
              <dd className="mt-1 text-sm text-ink">{deliveryLabel(order.deliveryMethod)}</dd>
              {order.trackingNumber ? <dd className="mt-1 text-sm text-ink/70">物流單號：{order.trackingNumber}</dd> : null}
            </div>
            <div className="rounded-2xl border border-champagne/14 bg-white/50 p-4">
              <dt className="flex items-center gap-2 text-xs text-ink/50"><Landmark aria-hidden="true" className="h-4 w-4 text-champagne" />付款</dt>
              <dd className="mt-1 text-sm text-ink">{paymentLabel(order.paymentMethod)}・{PAYMENT_STATUS_LABELS[order.paymentStatus]}</dd>
              <dd className="mt-1 text-sm text-ink/70">
                應付金額：{order.quotedTotal !== null ? <strong className="text-ink">{formatTWD(order.quotedTotal)}</strong> : "顧問確認中"}
              </dd>
            </div>
          </dl>

          {showBankInfo ? (
            <div className="space-y-4 rounded-2xl border border-champagne/25 bg-cream/50 p-5">
              <h3 className="font-display text-lg text-ink">匯款資訊</h3>
              {order.quotedTotal === null ? (
                <p className="text-sm leading-7 text-ink/65">顧問確認金額後，應付金額與匯款帳號會顯示在這裡，也會透過電話或 LINE 通知你。</p>
              ) : hasBankAccount() ? (
                <dl className="space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-3"><dt className="text-ink/55">銀行</dt><dd className="text-ink">{bank.bankName}{bank.bankCode ? `（${bank.bankCode}）` : ""}{bank.branch ? ` ${bank.branch}` : ""}</dd></div>
                  <div className="flex items-center justify-between gap-3"><dt className="text-ink/55">帳號</dt><dd className="flex items-center gap-2 text-ink">{bank.accountNumber}<CopyButton value={bank.accountNumber} /></dd></div>
                  {bank.accountName ? <div className="flex items-center justify-between gap-3"><dt className="text-ink/55">戶名</dt><dd className="text-ink">{bank.accountName}</dd></div> : null}
                  <div className="flex items-center justify-between gap-3"><dt className="text-ink/55">金額</dt><dd className="font-display text-lg text-ink">{formatTWD(order.quotedTotal)}</dd></div>
                  <p className="pt-1 text-xs text-ink/50">請於 {site.payment.transferDeadlineDays} 日內完成轉帳，並在下方回報帳號後五碼。</p>
                </dl>
              ) : (
                <p className="text-sm leading-7 text-ink/65">顧問會透過電話或 LINE 提供匯款帳號。</p>
              )}

              {order.paymentStatus === "reported" ? (
                <p className="rounded-xl bg-white/70 px-4 py-3 text-sm text-ink/70">已收到匯款回報（後五碼 {order.paymentLast5}），確認入帳後會更新狀態。</p>
              ) : (
                <form onSubmit={submitReport} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="field-group flex-1">
                    <label htmlFor="last5" className="field-label">已轉帳？回報帳號後五碼</label>
                    <input id="last5" className="field" inputMode="numeric" maxLength={5} placeholder="12345" value={last5} onChange={(event) => setLast5(event.target.value.replace(/\D/g, "").slice(0, 5))} />
                  </div>
                  <button disabled={reporting} className="hero-button-dark min-h-[52px] justify-center px-6 disabled:opacity-50">
                    {reporting ? "送出中…" : "回報匯款"}
                  </button>
                </form>
              )}
              {reportMessage ? <p role="status" className="text-sm text-ink/70">{reportMessage}</p> : null}
            </div>
          ) : null}
        </section>
      ) : (
        <section className="paper-panel hidden items-center justify-center p-10 text-center text-sm leading-7 text-ink/50 lg:flex lg:min-h-[320px]">
          查詢結果會顯示在這裡
        </section>
      )}
    </div>
  );
}
