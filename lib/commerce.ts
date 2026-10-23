import { site } from "@/lib/content";
import type { DeliveryMethod, OrderStatus, PaymentMethod, PaymentStatus } from "@/lib/types";

export type DeliveryOption = {
  id: DeliveryMethod;
  label: string;
  shortLabel: string;
  description: string;
  storeMapUrl?: string;
  storeIdHint?: string;
};

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: "home",
    label: "宅配到府",
    shortLabel: "宅配",
    description: "送到指定地址，可備註希望到貨日。"
  },
  {
    id: "cvs_711",
    label: "7-ELEVEN 超商取貨",
    shortLabel: "7-11 取貨",
    description: "送到指定門市，到貨後會收到取貨通知。",
    storeMapUrl: "https://emap.pcsc.com.tw/",
    storeIdHint: "6 碼店號，例如 123456"
  },
  {
    id: "cvs_family",
    label: "全家超商取貨",
    shortLabel: "全家取貨",
    description: "送到指定門市，到貨後會收到取貨通知。",
    storeMapUrl: "https://www.family.com.tw/Marketing/zh/Map",
    storeIdHint: "店舖號碼，例如 012345"
  }
];

export type PaymentOption = {
  id: PaymentMethod;
  label: string;
  description: string;
};

export const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: "bank_transfer",
    label: "銀行轉帳／ATM",
    description: "顧問確認金額後提供匯款資訊，轉帳後可在「訂單查詢」回報帳號後五碼。"
  },
  {
    id: "cod",
    label: "貨到付款／取貨付款",
    description: "宅配於收貨時付款；超商取貨於門市取件時付款。"
  }
];

export function enabledDeliveryOptions() {
  return DELIVERY_OPTIONS.filter((option) => site.delivery[option.id]);
}

export function enabledPaymentOptions() {
  return PAYMENT_OPTIONS.filter((option) => site.payment[option.id]);
}

export function deliveryLabel(method?: string) {
  return DELIVERY_OPTIONS.find((option) => option.id === method)?.label ?? "宅配到府";
}

export function paymentLabel(method?: string) {
  return PAYMENT_OPTIONS.find((option) => option.id === method)?.label ?? "銀行轉帳／ATM";
}

/** 依配送方式回傳運費基準；null 代表由顧問確認 */
export function baseShippingFee(method: DeliveryMethod) {
  return method === "home" ? site.shippingPolicy.standardShippingFee : site.shippingPolicy.cvsShippingFee;
}

export function hasBankAccount() {
  const account = site.payment.bankAccount;
  return Boolean(account.bankName && account.accountNumber);
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "待確認",
  confirmed: "已確認",
  shipped: "已出貨",
  completed: "已完成",
  cancelled: "已取消"
};

export const ORDER_STATUSES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: "未付款",
  reported: "已回報匯款",
  paid: "已付款",
  refunded: "已退款"
};

export const PAYMENT_STATUSES = Object.keys(PAYMENT_STATUS_LABELS) as PaymentStatus[];
