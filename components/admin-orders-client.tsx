"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ChevronDown, Download, LogOut, RefreshCw } from "lucide-react";
import {
  DEMO_ORDER_KEY,
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_LABELS,
  checkIsAdmin,
  fetchOrders,
  isSupabaseConfigured,
  updateOrder,
  type OrderPatch
} from "@/lib/orders-client";
import { deliveryLabel, paymentLabel } from "@/lib/commerce";
import { formatTWD } from "@/lib/pricing";
import { getSupabase } from "@/lib/supabase";
import type { OrderRecord, OrderStatus, PaymentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type AuthState = "checking" | "signed-out" | "not-admin" | "ready";

type Draft = {
  adminNote: string;
  quotedTotal: string;
  paymentStatus: PaymentStatus;
  trackingNumber: string;
};

function draftFrom(order: OrderRecord): Draft {
  return {
    adminNote: order.adminNote ?? "",
    quotedTotal: order.quotedTotal === null || order.quotedTotal === undefined ? "" : String(order.quotedTotal),
    paymentStatus: order.paymentStatus ?? "unpaid",
    trackingNumber: order.trackingNumber ?? ""
  };
}

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  unpaid: "text-ink/55",
  reported: "text-[#a2533f]",
  paid: "text-[#3f6a45]",
  refunded: "text-ink/45"
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-rosegold/14 text-[#8a5544]",
  confirmed: "bg-champagne/18 text-[#7a6234]",
  shipped: "bg-[#dfe8f1] text-[#3d5873]",
  completed: "bg-[#e1eee2] text-[#3f6a45]",
  cancelled: "bg-ink/8 text-ink/50"
};

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

function readDemoOrders(initialOrders: OrderRecord[]) {
  try {
    const local = JSON.parse(window.localStorage.getItem(DEMO_ORDER_KEY) ?? "[]") as OrderRecord[];
    return [...local, ...initialOrders].filter(
      (order, index, array) => array.findIndex((item) => item.orderId === order.orderId) === index
    );
  } catch {
    return initialOrders;
  }
}

export function AdminOrdersClient({ initialOrders }: { initialOrders: OrderRecord[] }) {
  const [authState, setAuthState] = useState<AuthState>(isSupabaseConfigured ? "checking" : "ready");
  const [orders, setOrders] = useState<OrderRecord[]>(isSupabaseConfigured ? [] : initialOrders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const loadOrders = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setOrders(readDemoOrders(initialOrders));
      return;
    }
    setLoading(true);
    setError("");
    try {
      setOrders(await fetchOrders());
    } catch {
      setError("讀取訂單失敗，請重新整理或稍後再試。");
    } finally {
      setLoading(false);
    }
  }, [initialOrders]);

  const resolveSession = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setAuthState("ready");
      setOrders(readDemoOrders(initialOrders));
      return;
    }
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setAuthState("signed-out");
      return;
    }
    if (!(await checkIsAdmin())) {
      setAuthState("not-admin");
      return;
    }
    setAuthState("ready");
    await loadOrders();
  }, [initialOrders, loadOrders]);

  useEffect(() => {
    void resolveSession();
  }, [resolveSession]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabase();
    if (!supabase) return;
    setSigningIn(true);
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setSigningIn(false);
    if (signInError) {
      setError("登入失敗，請確認 Email 與密碼。");
      return;
    }
    setPassword("");
    await resolveSession();
  }

  async function signOut() {
    await getSupabase()?.auth.signOut();
    setOrders([]);
    setAuthState("signed-out");
  }

  async function changeStatus(orderId: string, status: OrderStatus) {
    const previous = orders;
    setOrders((current) => current.map((order) => (order.orderId === orderId ? { ...order, status } : order)));
    if (!isSupabaseConfigured) {
      const next = previous.map((order) => (order.orderId === orderId ? { ...order, status } : order));
      window.localStorage.setItem(DEMO_ORDER_KEY, JSON.stringify(next.filter((order) => order.orderId.startsWith("DEMO-"))));
      return;
    }
    try {
      await updateOrder(orderId, { status });
    } catch {
      setOrders(previous);
      setError("更新狀態失敗，請再試一次。");
    }
  }

  async function saveDetails(orderId: string) {
    const draft = drafts[orderId];
    if (!draft) return;
    const amount = draft.quotedTotal.trim() === "" ? null : Math.round(Number(draft.quotedTotal.replace(/[^\d.]/g, "")));
    if (amount !== null && !Number.isFinite(amount)) {
      setError("應付金額請輸入數字。");
      return;
    }
    const patch: OrderPatch = {
      adminNote: draft.adminNote,
      quotedTotal: amount,
      paymentStatus: draft.paymentStatus,
      trackingNumber: draft.trackingNumber.trim()
    };
    setSaving(orderId);
    setError("");
    try {
      if (isSupabaseConfigured) await updateOrder(orderId, patch);
      setOrders((current) =>
        current.map((order) =>
          order.orderId === orderId
            ? { ...order, adminNote: patch.adminNote, quotedTotal: amount, paymentStatus: patch.paymentStatus, trackingNumber: patch.trackingNumber }
            : order
        )
      );
      setSavedId(orderId);
      window.setTimeout(() => setSavedId((current) => (current === orderId ? null : current)), 2000);
    } catch {
      setError("儲存失敗，請再試一次。");
    } finally {
      setSaving(null);
    }
  }

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: orders.length };
    for (const status of ORDER_STATUSES) result[status] = orders.filter((order) => order.status === status).length;
    return result;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (!keyword) return true;
      return [order.orderId, order.customerName, order.phone, order.email, order.productName, order.address, order.lineId]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [orders, query, statusFilter]);

  function exportCsv() {
    const columns: Array<[keyof OrderRecord, string]> = [
      ["orderId", "訂單編號"],
      ["createdAt", "建立時間"],
      ["status", "狀態"],
      ["customerName", "收件人"],
      ["phone", "電話"],
      ["email", "Email"],
      ["lineId", "LINE"],
      ["address", "地址"],
      ["productName", "商品"],
      ["quantity", "數量"],
      ["deliveryMethod", "配送方式"],
      ["paymentMethod", "付款方式"],
      ["paymentStatus", "付款狀態"],
      ["paymentLast5", "匯款後五碼"],
      ["quotedTotal", "應付金額"],
      ["trackingNumber", "物流單號"],
      ["preferredDeliveryDate", "希望配送日期"],
      ["note", "客人備註"],
      ["adminNote", "內部備註"]
    ];
    const cell = (order: OrderRecord, key: keyof OrderRecord) => {
      let value = String(order[key] ?? "");
      if (key === "createdAt" && value) value = formatDateTime(value);
      if (key === "status") value = ORDER_STATUS_LABELS[order.status] ?? value;
      if (key === "deliveryMethod") value = deliveryLabel(order.deliveryMethod);
      if (key === "paymentMethod") value = paymentLabel(order.paymentMethod);
      if (key === "paymentStatus") value = PAYMENT_STATUS_LABELS[order.paymentStatus ?? "unpaid"];
      return `"${value.replace(/"/g, '""')}"`;
    };
    const csv = [
      columns.map(([, label]) => label).join(","),
      ...filteredOrders.map((order) => columns.map(([key]) => cell(order, key)).join(","))
    ].join("\n");
    // 加上 BOM，Excel 開啟中文才不會亂碼
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `越金燕訂單-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (authState === "checking") {
    return <div className="paper-panel mx-auto max-w-md p-8 text-center text-sm text-ink/60">載入中...</div>;
  }

  if (authState === "signed-out" || authState === "not-admin") {
    return (
      <div className="paper-panel mx-auto max-w-md p-6 md:p-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-champagne">Admin</p>
        <h1 className="mt-2 font-display text-3xl text-ink">訂單後台登入</h1>
        {authState === "not-admin" ? (
          <div className="mt-5 space-y-3 rounded-[1rem] border border-rosegold/20 bg-rosegold/10 p-4 text-sm leading-6 text-ink/72">
            <p>此帳號沒有後台權限，請改用管理員帳號登入。</p>
            <button type="button" onClick={signOut} className="underline underline-offset-4">登出</button>
          </div>
        ) : (
          <form onSubmit={signIn} className="mt-6 space-y-4">
            <div className="field-group">
              <label htmlFor="admin-email" className="field-label">Email</label>
              <input id="admin-email" type="email" autoComplete="username" required className="field" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="field-group">
              <label htmlFor="admin-password" className="field-label">密碼</label>
              <input id="admin-password" type="password" autoComplete="current-password" required className="field" value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            {error ? <p role="alert" className="text-sm text-rosegold">{error}</p> : null}
            <button disabled={signingIn} className="hero-button-dark min-h-[52px] w-full justify-center disabled:opacity-50">
              {signingIn ? "登入中..." : "登入"}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!isSupabaseConfigured ? (
        <div className="rounded-[1.15rem] border border-rosegold/20 bg-rosegold/10 px-5 py-4 text-sm leading-6 text-ink/72">
          展示模式：尚未連接 Supabase，以下是範例資料與這台裝置上送出的測試訂單。
        </div>
      ) : null}

      <div className="flex flex-col gap-4 rounded-luxe border border-white/60 bg-white/70 p-6 shadow-glass backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-champagne">Order Ledger</p>
          <h1 className="font-display text-3xl text-ink">訂單後台</h1>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label htmlFor="order-search" className="sr-only">搜尋訂單</label>
          <input
            id="order-search"
            className="field w-full md:min-w-0 md:flex-1 lg:w-[300px] lg:flex-none"
            placeholder="搜尋編號、姓名、電話、商品"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="flex gap-2">
            <button type="button" onClick={() => void loadOrders()} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-champagne/30 px-4 text-sm text-ink transition hover:bg-white" aria-label="重新整理">
              <RefreshCw aria-hidden="true" className={cn("h-4 w-4", loading ? "animate-spin" : "")} />
            </button>
            <button type="button" onClick={exportCsv} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-champagne/30 px-5 text-sm text-ink transition hover:bg-white">
              <Download aria-hidden="true" className="h-4 w-4" /> 匯出 Excel
            </button>
            {isSupabaseConfigured ? (
              <button type="button" onClick={signOut} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-champagne/30 px-4 text-sm text-ink/70 transition hover:bg-white" aria-label="登出">
                <LogOut aria-hidden="true" className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="依狀態篩選">
        {(["all", ...ORDER_STATUSES] as const).map((status) => (
          <button
            key={status}
            type="button"
            role="tab"
            aria-selected={statusFilter === status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              "inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full px-4 text-sm transition",
              statusFilter === status ? "bg-ink text-pearl" : "bg-white/60 text-ink/68 hover:bg-white"
            )}
          >
            {status === "all" ? "全部" : ORDER_STATUS_LABELS[status]}
            <span className="text-xs opacity-60">{counts[status] ?? 0}</span>
          </button>
        ))}
      </div>

      {error ? <p role="alert" className="rounded-[1rem] border border-rosegold/20 bg-rosegold/10 px-4 py-3 text-sm text-ink/76">{error}</p> : null}

      {filteredOrders.length === 0 ? (
        <div className="paper-panel p-8 text-center text-sm text-ink/55">{loading ? "讀取中..." : "目前沒有符合條件的訂單。"}</div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const isOpen = expanded === order.orderId;
            return (
              <article key={order.orderId} className="overflow-hidden rounded-[1.3rem] border border-white/60 bg-white/75 shadow-glass">
                <div className="grid gap-3 p-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.2fr)_minmax(0,1fr)_auto] md:items-center md:gap-5 md:p-5">
                  <div className="min-w-0">
                    <p className="text-[11px] tracking-[0.12em] text-champagne">{order.orderId}</p>
                    <p className="mt-1 text-xs text-ink/50">{formatDateTime(order.createdAt)}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base text-ink">{order.customerName}</p>
                    <a href={`tel:${order.phone.replace(/\s+/g, "")}`} className="text-sm text-ink/60 underline-offset-4 hover:underline">{order.phone}</a>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink">{order.productName}</p>
                    <p className="text-xs text-ink/50">
                      共 {order.quantity} 件・{deliveryLabel(order.deliveryMethod)}・
                      <span className={PAYMENT_STYLES[order.paymentStatus ?? "unpaid"]}>{PAYMENT_STATUS_LABELS[order.paymentStatus ?? "unpaid"]}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor={`status-${order.orderId}`} className="sr-only">訂單狀態</label>
                    <select
                      id={`status-${order.orderId}`}
                      className={cn("min-h-[44px] rounded-full border-0 px-4 text-sm outline-none", STATUS_STYLES[order.status])}
                      value={order.status}
                      onChange={(event) => void changeStatus(order.orderId, event.target.value as OrderStatus)}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>{ORDER_STATUS_LABELS[status]}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-label={isOpen ? "收合詳情" : "查看詳情"}
                      onClick={() => {
                        setExpanded(isOpen ? null : order.orderId);
                        setDrafts((current) => ({ ...current, [order.orderId]: current[order.orderId] ?? draftFrom(order) }));
                      }}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-champagne/25 text-ink/60 transition hover:bg-white"
                    >
                      <ChevronDown aria-hidden="true" className={cn("h-4 w-4 transition", isOpen ? "rotate-180" : "")} />
                    </button>
                  </div>
                </div>
                {isOpen ? (
                  <div className="grid gap-6 border-t border-champagne/14 bg-cream/30 p-4 text-sm md:grid-cols-2 md:p-5">
                    <div className="space-y-4">
                      {order.items && order.items.length > 0 ? (
                        <div>
                          <p className="text-xs text-ink/45">商品明細</p>
                          <ul className="mt-1 divide-y divide-champagne/12 rounded-xl border border-champagne/14 bg-white/60 px-3">
                            {order.items.map((item) => (
                              <li key={`${item.slug}-${item.name}`} className="flex justify-between gap-3 py-2">
                                <span>{item.name}<span className="ml-1 text-xs text-ink/45">{item.spec}</span></span>
                                <span>x {item.quantity}{item.unitPrice ? `・${formatTWD(item.unitPrice * item.quantity)}` : ""}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      <dl className="grid gap-3 sm:grid-cols-2">
                        <div><dt className="text-xs text-ink/45">Email</dt><dd className="mt-1 break-all"><a href={`mailto:${order.email}`} className="underline-offset-4 hover:underline">{order.email}</a></dd></div>
                        <div><dt className="text-xs text-ink/45">LINE</dt><dd className="mt-1">{order.lineId || "未填"}</dd></div>
                        <div><dt className="text-xs text-ink/45">配送方式</dt><dd className="mt-1">{deliveryLabel(order.deliveryMethod)}</dd></div>
                        <div><dt className="text-xs text-ink/45">付款方式</dt><dd className="mt-1">{paymentLabel(order.paymentMethod)}{order.paymentLast5 ? `（後五碼 ${order.paymentLast5}）` : ""}</dd></div>
                        <div className="sm:col-span-2"><dt className="text-xs text-ink/45">收件地址／門市</dt><dd className="mt-1 break-words">{order.address}</dd></div>
                        <div><dt className="text-xs text-ink/45">希望到貨日</dt><dd className="mt-1">{order.preferredDeliveryDate || "未指定"}</dd></div>
                        <div className="sm:col-span-2"><dt className="text-xs text-ink/45">客人備註</dt><dd className="mt-1 whitespace-pre-wrap break-words">{order.note || "無"}</dd></div>
                      </dl>
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs text-ink/45">訂單處理（應付金額、付款狀態與物流單號會顯示在客人的訂單查詢頁）</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="field-group">
                          <label htmlFor={`total-${order.orderId}`} className="field-label">應付金額（含運）</label>
                          <input
                            id={`total-${order.orderId}`}
                            className="field"
                            inputMode="numeric"
                            placeholder="例如 6880"
                            value={drafts[order.orderId]?.quotedTotal ?? ""}
                            onChange={(event) => setDrafts((current) => ({ ...current, [order.orderId]: { ...(current[order.orderId] ?? draftFrom(order)), quotedTotal: event.target.value } }))}
                          />
                        </div>
                        <div className="field-group">
                          <label htmlFor={`pay-${order.orderId}`} className="field-label">付款狀態</label>
                          <select
                            id={`pay-${order.orderId}`}
                            className="field"
                            value={drafts[order.orderId]?.paymentStatus ?? "unpaid"}
                            onChange={(event) => setDrafts((current) => ({ ...current, [order.orderId]: { ...(current[order.orderId] ?? draftFrom(order)), paymentStatus: event.target.value as PaymentStatus } }))}
                          >
                            {PAYMENT_STATUSES.map((status) => <option key={status} value={status}>{PAYMENT_STATUS_LABELS[status]}</option>)}
                          </select>
                        </div>
                        <div className="field-group sm:col-span-2">
                          <label htmlFor={`track-${order.orderId}`} className="field-label">物流單號</label>
                          <input
                            id={`track-${order.orderId}`}
                            className="field"
                            placeholder="出貨後填寫"
                            value={drafts[order.orderId]?.trackingNumber ?? ""}
                            onChange={(event) => setDrafts((current) => ({ ...current, [order.orderId]: { ...(current[order.orderId] ?? draftFrom(order)), trackingNumber: event.target.value } }))}
                          />
                        </div>
                      </div>
                      <div className="field-group">
                        <label htmlFor={`note-${order.orderId}`} className="field-label">內部備註（客人看不到）</label>
                        <textarea
                          id={`note-${order.orderId}`}
                          className="field min-h-[110px] resize-y"
                          placeholder="例如：已電話確認、要附提袋…"
                          value={drafts[order.orderId]?.adminNote ?? ""}
                          onChange={(event) => setDrafts((current) => ({ ...current, [order.orderId]: { ...(current[order.orderId] ?? draftFrom(order)), adminNote: event.target.value } }))}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={saving === order.orderId}
                          onClick={() => void saveDetails(order.orderId)}
                          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-ink px-6 text-sm text-pearl disabled:opacity-50"
                        >
                          {saving === order.orderId ? "儲存中..." : "儲存"}
                        </button>
                        {savedId === order.orderId ? <span className="text-sm text-[#3f6a45]">已儲存</span> : null}
                      </div>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
