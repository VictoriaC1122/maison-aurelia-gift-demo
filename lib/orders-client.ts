import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { OrderRecord, OrderStatus } from "@/lib/types";

export const DEMO_ORDER_KEY = "yuajinyan-demo-orders";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "待確認",
  confirmed: "已確認",
  shipped: "已出貨",
  completed: "已完成",
  cancelled: "已取消"
};

export const ORDER_STATUSES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

export type OrderPayload = {
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

type OrderRow = {
  order_id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  email: string;
  line_id: string | null;
  address: string;
  product_name: string;
  category: string | null;
  quantity: number;
  option: string | null;
  preferred_delivery_date: string | null;
  note: string | null;
  status: OrderStatus;
  admin_note: string | null;
};

function rowToOrder(row: OrderRow): OrderRecord {
  return {
    orderId: row.order_id,
    createdAt: row.created_at,
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email,
    lineId: row.line_id ?? "",
    address: row.address,
    productName: row.product_name,
    category: row.category ?? "",
    quantity: row.quantity,
    option: row.option ?? "",
    preferredDeliveryDate: row.preferred_delivery_date ?? "",
    note: row.note ?? "",
    status: row.status,
    adminNote: row.admin_note ?? ""
  };
}

function buildDemoOrderId() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const serial = String(Date.now()).slice(-4);
  return `DEMO-${stamp}-${serial}`;
}

/** 送出訂單：已連接 Supabase 時寫入資料庫，否則存在瀏覽器（展示模式）。 */
export async function submitOrder(payload: OrderPayload): Promise<{ orderId: string; live: boolean }> {
  const supabase = getSupabase();

  if (supabase) {
    const { data, error } = await supabase.rpc("submit_order", { payload });
    if (error || typeof data !== "string") {
      throw error ?? new Error("Order was not created.");
    }
    return { orderId: data, live: true };
  }

  const order: OrderRecord = {
    orderId: buildDemoOrderId(),
    createdAt: new Date().toISOString(),
    status: "pending",
    ...payload
  };
  const current = JSON.parse(window.localStorage.getItem(DEMO_ORDER_KEY) ?? "[]") as OrderRecord[];
  current.unshift(order);
  window.localStorage.setItem(DEMO_ORDER_KEY, JSON.stringify(current));
  return { orderId: order.orderId, live: false };
}

/** 新訂單 Email 通知（Web3Forms）。失敗不影響訂單本身。 */
export async function notifyNewOrder(orderId: string, payload: OrderPayload) {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  if (!accessKey) return;

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 6000);

  try {
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        access_key: accessKey,
        subject: `【越金燕】新訂單 ${orderId}｜${payload.productName} x ${payload.quantity}`,
        from_name: "越金燕官網",
        replyto: payload.email,
        訂單編號: orderId,
        商品: payload.productName,
        規格: payload.option,
        數量: String(payload.quantity),
        希望配送日期: payload.preferredDeliveryDate || "未指定",
        收件人: payload.customerName,
        電話: payload.phone,
        Email: payload.email,
        LINE: payload.lineId || "未填",
        地址: payload.address,
        備註: payload.note || "無"
      })
    });
  } catch {
    // 通知失敗時仍以資料庫為準，後台看得到訂單。
  } finally {
    window.clearTimeout(timer);
  }
}

export async function fetchOrders() {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) throw error;
  return (data as OrderRow[]).map(rowToOrder);
}

export async function updateOrder(orderId: string, patch: { status?: OrderStatus; adminNote?: string }) {
  const supabase = getSupabase();
  if (!supabase) return;
  const update: Partial<OrderRow> = {};
  if (patch.status) update.status = patch.status;
  if (patch.adminNote !== undefined) update.admin_note = patch.adminNote;
  const { error } = await supabase.from("orders").update(update).eq("order_id", orderId);
  if (error) throw error;
}

export { isSupabaseConfigured };

export async function checkIsAdmin() {
  const supabase = getSupabase();
  if (!supabase) return false;
  const { data, error } = await supabase.rpc("is_admin");
  if (error) return false;
  return data === true;
}
