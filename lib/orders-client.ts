import { deliveryLabel, paymentLabel } from "@/lib/commerce";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type {
  DeliveryMethod,
  OrderItem,
  OrderRecord,
  OrderStatus,
  PaymentMethod,
  PaymentStatus
} from "@/lib/types";

export { ORDER_STATUSES, ORDER_STATUS_LABELS, PAYMENT_STATUSES, PAYMENT_STATUS_LABELS } from "@/lib/commerce";

export const DEMO_ORDER_KEY = "yuajinyan-demo-orders";

export type DeliveryDetails = {
  zip?: string;
  city?: string;
  district?: string;
  detail?: string;
  storeId?: string;
  storeName?: string;
};

export type CheckoutPayload = {
  customerName: string;
  phone: string;
  email: string;
  lineId: string;
  items: OrderItem[];
  deliveryMethod: DeliveryMethod;
  delivery: DeliveryDetails;
  paymentMethod: PaymentMethod;
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
  items: OrderItem[] | null;
  delivery_method: DeliveryMethod | null;
  payment_method: PaymentMethod | null;
  payment_status: PaymentStatus | null;
  payment_last5: string | null;
  quoted_total: number | null;
  tracking_number: string | null;
};

export type TrackedOrder = {
  orderId: string;
  createdAt: string;
  status: OrderStatus;
  productName: string;
  quantity: number;
  items: OrderItem[];
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentLast5: string;
  quotedTotal: number | null;
  trackingNumber: string;
  preferredDeliveryDate: string;
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
    adminNote: row.admin_note ?? "",
    items: row.items ?? [],
    deliveryMethod: row.delivery_method ?? "home",
    paymentMethod: row.payment_method ?? "bank_transfer",
    paymentStatus: row.payment_status ?? "unpaid",
    paymentLast5: row.payment_last5 ?? "",
    quotedTotal: row.quoted_total,
    trackingNumber: row.tracking_number ?? ""
  };
}

export function formatDeliveryAddress(method: DeliveryMethod, delivery: DeliveryDetails) {
  if (method === "home") {
    return [delivery.zip, `${delivery.city ?? ""}${delivery.district ?? ""}${delivery.detail ?? ""}`]
      .filter(Boolean)
      .join(" ");
  }
  const brand = method === "cvs_711" ? "7-ELEVEN" : "全家";
  return `${brand} ${delivery.storeName ?? ""}門市（店號 ${delivery.storeId ?? ""}）`;
}

function itemSummary(items: OrderItem[]) {
  return items.map((item) => `${item.name} x${item.quantity}`).join("、");
}

function buildDemoOrderId() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const serial = String(Date.now()).slice(-4);
  return `DEMO-${stamp}-${serial}`;
}

function readDemoOrders() {
  try {
    return JSON.parse(window.localStorage.getItem(DEMO_ORDER_KEY) ?? "[]") as OrderRecord[];
  } catch {
    return [];
  }
}

/** 送出訂單：已連接 Supabase 時寫入資料庫，否則存在瀏覽器（展示模式）。 */
export async function submitOrder(payload: CheckoutPayload): Promise<{ orderId: string; live: boolean }> {
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
    customerName: payload.customerName,
    phone: payload.phone,
    email: payload.email,
    lineId: payload.lineId,
    address: formatDeliveryAddress(payload.deliveryMethod, payload.delivery),
    productName: itemSummary(payload.items),
    category: "",
    quantity: payload.items.reduce((sum, item) => sum + item.quantity, 0),
    option: "",
    preferredDeliveryDate: payload.preferredDeliveryDate,
    note: payload.note,
    items: payload.items,
    deliveryMethod: payload.deliveryMethod,
    paymentMethod: payload.paymentMethod,
    paymentStatus: "unpaid",
    paymentLast5: "",
    quotedTotal: null,
    trackingNumber: ""
  };
  const current = readDemoOrders();
  current.unshift(order);
  window.localStorage.setItem(DEMO_ORDER_KEY, JSON.stringify(current));
  return { orderId: order.orderId, live: false };
}

/** 新訂單 Email 通知（Web3Forms）。失敗不影響訂單本身。 */
export async function notifyNewOrder(orderId: string, payload: CheckoutPayload) {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  if (!accessKey) return;

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 6000);
  const lines = payload.items
    .map((item) => `・${item.name}（${item.spec}）x ${item.quantity}`)
    .join("\n");
  const totalQuantity = payload.items.reduce((sum, item) => sum + item.quantity, 0);

  try {
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        access_key: accessKey,
        subject: `【越金燕】新訂單 ${orderId}｜共 ${totalQuantity} 件`,
        from_name: "越金燕官網",
        replyto: payload.email,
        訂單編號: orderId,
        商品明細: lines,
        配送方式: deliveryLabel(payload.deliveryMethod),
        收件地址或門市: formatDeliveryAddress(payload.deliveryMethod, payload.delivery),
        付款方式: paymentLabel(payload.paymentMethod),
        希望到貨日: payload.preferredDeliveryDate || "未指定",
        訂購人: payload.customerName,
        電話: payload.phone,
        Email: payload.email,
        LINE: payload.lineId || "未填",
        備註: payload.note || "無"
      })
    });
  } catch {
    // 通知失敗時仍以資料庫為準，後台看得到訂單。
  } finally {
    window.clearTimeout(timer);
  }
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

export async function trackOrder(orderId: string, phone: string): Promise<TrackedOrder | null> {
  const supabase = getSupabase();

  if (!supabase) {
    const match = readDemoOrders().find(
      (order) =>
        order.orderId.toUpperCase() === orderId.trim().toUpperCase() &&
        normalizePhone(order.phone) === normalizePhone(phone)
    );
    if (!match) return null;
    return {
      orderId: match.orderId,
      createdAt: match.createdAt,
      status: match.status,
      productName: match.productName,
      quantity: match.quantity,
      items: match.items ?? [],
      deliveryMethod: match.deliveryMethod ?? "home",
      paymentMethod: match.paymentMethod ?? "bank_transfer",
      paymentStatus: match.paymentStatus ?? "unpaid",
      paymentLast5: match.paymentLast5 ?? "",
      quotedTotal: match.quotedTotal ?? null,
      trackingNumber: match.trackingNumber ?? "",
      preferredDeliveryDate: match.preferredDeliveryDate
    };
  }

  const { data, error } = await supabase.rpc("track_order", { p_order_id: orderId, p_phone: phone });
  if (error) throw error;
  const row = (data as Array<Record<string, unknown>> | null)?.[0];
  if (!row) return null;
  return {
    orderId: String(row.order_id),
    createdAt: String(row.created_at),
    status: row.status as OrderStatus,
    productName: String(row.product_name ?? ""),
    quantity: Number(row.quantity ?? 0),
    items: (row.items as OrderItem[]) ?? [],
    deliveryMethod: (row.delivery_method as DeliveryMethod) ?? "home",
    paymentMethod: (row.payment_method as PaymentMethod) ?? "bank_transfer",
    paymentStatus: (row.payment_status as PaymentStatus) ?? "unpaid",
    paymentLast5: String(row.payment_last5 ?? ""),
    quotedTotal: row.quoted_total === null || row.quoted_total === undefined ? null : Number(row.quoted_total),
    trackingNumber: String(row.tracking_number ?? ""),
    preferredDeliveryDate: String(row.preferred_delivery_date ?? "")
  };
}

export async function reportPayment(orderId: string, phone: string, last5: string) {
  const supabase = getSupabase();
  if (!supabase) {
    const orders = readDemoOrders().map((order) =>
      order.orderId === orderId ? { ...order, paymentLast5: last5, paymentStatus: "reported" as PaymentStatus } : order
    );
    window.localStorage.setItem(DEMO_ORDER_KEY, JSON.stringify(orders));
    return true;
  }
  const { data, error } = await supabase.rpc("report_payment", {
    p_order_id: orderId,
    p_phone: phone,
    p_last5: last5
  });
  if (error) throw error;
  return data === true;
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

export type OrderPatch = {
  status?: OrderStatus;
  adminNote?: string;
  paymentStatus?: PaymentStatus;
  quotedTotal?: number | null;
  trackingNumber?: string;
};

export async function updateOrder(orderId: string, patch: OrderPatch) {
  const supabase = getSupabase();
  if (!supabase) return;
  const update: Partial<OrderRow> = {};
  if (patch.status) update.status = patch.status;
  if (patch.adminNote !== undefined) update.admin_note = patch.adminNote;
  if (patch.paymentStatus) update.payment_status = patch.paymentStatus;
  if (patch.quotedTotal !== undefined) update.quoted_total = patch.quotedTotal;
  if (patch.trackingNumber !== undefined) update.tracking_number = patch.trackingNumber;
  const { error } = await supabase.from("orders").update(update).eq("order_id", orderId);
  if (error) throw error;
}

export async function checkIsAdmin() {
  const supabase = getSupabase();
  if (!supabase) return false;
  const { data, error } = await supabase.rpc("is_admin");
  if (error) return false;
  return data === true;
}

export { isSupabaseConfigured };
