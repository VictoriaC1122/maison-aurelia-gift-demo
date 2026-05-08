import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/order-store";
import type { OrderStatus } from "@/lib/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const payload = (await request.json()) as { status: OrderStatus };
  const order = await updateOrderStatus(orderId, payload.status);
  return NextResponse.json({ ok: true, order });
}
