import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { OrderInput, OrderRecord, OrderStatus } from "@/lib/types";

const storageMode = process.env.STORAGE_MODE ?? "mock";
const mockFile = path.join(process.cwd(), "data", "orders.json");

function buildOrderId() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const serial = String(Date.now()).slice(-4);
  return `MA-${stamp}-${serial}`;
}

async function readMockOrders() {
  const raw = await fs.readFile(mockFile, "utf8");
  return JSON.parse(raw) as OrderRecord[];
}

async function writeMockOrders(orders: OrderRecord[]) {
  await fs.writeFile(mockFile, JSON.stringify(orders, null, 2), "utf8");
}

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase credentials are missing.");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false
    }
  });
}

export async function listOrders(query?: string) {
  if (storageMode === "supabase") {
    const supabase = getSupabaseClient();
    const table = process.env.SUPABASE_ORDERS_TABLE ?? "orders";
    let request = supabase.from(table).select("*").order("createdAt", { ascending: false });
    if (query) {
      request = request.or(
        `customerName.ilike.%${query}%,phone.ilike.%${query}%,productName.ilike.%${query}%`
      );
    }
    const { data, error } = await request;
    if (error) throw error;
    return (data ?? []) as OrderRecord[];
  }

  const orders = await readMockOrders();
  const filtered = query
    ? orders.filter((order) =>
        [order.customerName, order.phone, order.productName]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : orders;

  return filtered.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function createOrder(input: OrderInput) {
  const order: OrderRecord = {
    orderId: buildOrderId(),
    createdAt: new Date().toISOString(),
    status: input.status ?? "pending",
    ...input
  };

  if (storageMode === "supabase") {
    const supabase = getSupabaseClient();
    const table = process.env.SUPABASE_ORDERS_TABLE ?? "orders";
    const { error } = await supabase.from(table).insert(order);
    if (error) throw error;
    return order;
  }

  const orders = await readMockOrders();
  orders.unshift(order);
  await writeMockOrders(orders);
  return order;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  if (storageMode === "supabase") {
    const supabase = getSupabaseClient();
    const table = process.env.SUPABASE_ORDERS_TABLE ?? "orders";
    const { data, error } = await supabase
      .from(table)
      .update({ status })
      .eq("orderId", orderId)
      .select("*")
      .single();
    if (error) throw error;
    return data as OrderRecord;
  }

  const orders = await readMockOrders();
  const next = orders.map((order) => (order.orderId === orderId ? { ...order, status } : order));
  await writeMockOrders(next);
  return next.find((order) => order.orderId === orderId) as OrderRecord;
}

export async function exportOrdersCsv() {
  const orders = await listOrders();
  const headers = [
    "orderId",
    "createdAt",
    "customerName",
    "phone",
    "email",
    "lineId",
    "address",
    "productName",
    "category",
    "quantity",
    "option",
    "preferredDeliveryDate",
    "note",
    "status"
  ];

  const lines = orders.map((order) =>
    headers
      .map((key) => {
        const value = String(order[key as keyof OrderRecord] ?? "").replace(/"/g, '""');
        return `"${value}"`;
      })
      .join(",")
  );

  return [headers.join(","), ...lines].join("\n");
}

export function validateOrder(input: Partial<OrderInput>) {
  const required = [
    "customerName",
    "phone",
    "email",
    "lineId",
    "address",
    "productName",
    "category",
    "quantity",
    "option",
    "preferredDeliveryDate"
  ] as const;

  const missing = required.filter((field) => {
    const value = input[field];
    return value === undefined || value === null || value === "";
  });

  return {
    valid: missing.length === 0,
    missing
  };
}
