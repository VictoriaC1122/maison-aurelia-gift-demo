import { NextRequest, NextResponse } from "next/server";
import { createOrder, listOrders, validateOrder } from "@/lib/order-store";
import type { OrderInput } from "@/lib/types";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? undefined;
  const orders = await listOrders(query);
  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as Partial<OrderInput>;
  const validation = validateOrder(payload);
  if (!validation.valid) {
    return NextResponse.json(
      { error: `缺少欄位：${validation.missing.join(", ")}` },
      { status: 400 }
    );
  }

  const order = await createOrder(payload as OrderInput);
  return NextResponse.json({ ok: true, orderId: order.orderId, order });
}
